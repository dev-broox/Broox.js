import FileSystemStorage from './FileSystemStorage';
import LocalStorage from './LocalStorage';
import Storage from './Storage';
import Window from './Window';

/**
 * Stores and retrieves values from files in json format
 */
export default class KeyValue {
  // private directory: string;
  private contents: { [key: string]: any; } = {};
  private storage: Storage;

  constructor() {
    if(Window.inElectron()) {
      this.storage = new FileSystemStorage(Window.getDirectory(), Window.getFileSystem());
    }
    else {
      this.storage = new LocalStorage();
    }
  }

  /**
   * Sets a value in storage
   * @param projectName Project name
   * @param key Key assigned to the value to store
   * @param value Value to store
   */
  setValue(projectName: string, key: string, value: any) {
    // get storage
    let content = this.getContent(projectName);
    if(!content) {
      content = {};
    }
    content[key] = value;
    this.storage.write(projectName, content);
  }

  /**
   * Gets a value from a content in storage
   * @param projectName Project name
   * @param key Key
   * @returns The value for the given key
   */
  getValue(projectName: string, key: string): any {
    const storage = this.getContent(projectName);
    return storage ? storage[key] : null;
  }

  /**
   * 
   * @param projectName Gets a content from memory or storage
   * @returns The content with the given name if exists, null otherwise
   */
  private getContent(projectName: string): any {
    // get storage from memory
    if(this.contents[projectName]) {
      return this.contents[projectName];
    }
    else {
      // get content from storage
      try {
        return this.storage.read(projectName);
      } catch (error) {
        // the content does not exist
        return null;
      }
    }
  }
}