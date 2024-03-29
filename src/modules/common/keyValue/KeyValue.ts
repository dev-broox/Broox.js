import { FileSystemStorage } from './FileSystemStorage';
import { LocalStorage } from './LocalStorage';
import { Storage } from './Storage';
import { Window } from '../Window';
import Message from '../Message';

/**
 * Stores and retrieves values in json format.
 * Allows to persist data and be able to retrieve it after the media changes or the Media Player is reloaded.
 * It can be useful for persisting configuration parameters modified at runtime.
 * A project name and a key need to be specified in order to store and retrieve the data.
 */
export class KeyValue {
  private contents: { [key: string]: any; } = {};
  private storage: Storage;

  /**
   * Creates an instance of the KeyValue class.
   */
  constructor() {
    if(Window.inElectron()) {
      this.storage = new FileSystemStorage(Window.writeJson, Window.readJson);
    }
    else {
      this.storage = new LocalStorage();
    }
  }

  /**
   * Sets a value in storage
   * @param name File name
   * @param key Key assigned to the value to store
   * @param value Value to store
   * ``` typescript
   * // example
   * const user = {
   *   firstName: 'John',
   *   lastName: 'Doe'
   * };
   * const keyValue = new broox.mediaPlayer.KeyValue();
   * keyValue.set('testApp', 'profile', user);
   * ```
   */
  setValue(name: string, key: string, value: any) {
    if(name === 'config') {
      console.error(Message.forbiddenProjectName);
      return;
    }
    // get storage
    let content = this.getContent(name);
    if(!content) {
      content = {};
    }
    content[key] = value;
    this.storage.write(name, content);
  }

  /**
   * Gets a value from a content in storage
   * @param name File name
   * @param key Key
   * @returns The value for the given key
   * ``` typescript
   * // example
   * const keyValue = new broox.mediaPlayer.KeyValue();
   * const user = keyValue.get('testApp', 'profile');
   * console.log('User', user);
   * ```
   */
  getValue(name: string, key: string): any {
    const storage = this.getContent(name);
    return storage ? storage[key] : null;
  }

  /**
   * Gets a content from memory or storage
   * @param name File name
   * @returns The content with the given name if exists, null otherwise
   */
  private getContent(name: string): any {
    // get storage from memory
    if(this.contents[name]) {
      return this.contents[name];
    }
    else {
      // get content from storage
      try {
        return this.storage.read(name);
      } catch (error) {
        // the content does not exist
        return null;
      }
    }
  }
}