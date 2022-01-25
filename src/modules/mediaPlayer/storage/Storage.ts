import * as fs from 'fs';
import * as path from 'path';

/**
 * Stores and retrieves values from files in json format
 */
export default class Storage {
  private path: string;
  private storages: { [key: string]: any; } = {};

  constructor(path: string) {
    this.path = path;
  }

  /**
   * Sets a value in a storage
   * @param name Storage name
   * @param key Key assigned to the value to store
   * @param value Value to store
   */
  setValue(name: string, key: string, value: any) {
    // get storage
    let storage = this.getStorage(name);
    if(!storage) {
      storage = {};
    }
    storage[key] = value;
    // save file
    const filePath = path.join(this.path, name + '.json');
    fs.writeFileSync(filePath, JSON.stringify(storage));
  }

  /**
   * Gets a value from a storage
   * @returns A value from storage for the given key
   */
  getValue(name: string, key: string): any {
    const storage = this.getStorage(name);
    return storage ? storage[key] : null;
  }

  /**
   * 
   * @param name Gets a storage from memory or file
   * @returns The storage with the given name if exists, null otherwise
   */
  private getStorage(name: string): any {
    // get storage from memory
    if(this.storages[name]) {
      return this.storages[name];
    }
    else {
      // get storage from file
      try {
        const filePath = path.join(this.path, name + '.json');
        const storage = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        this.storages[name] = storage;
        return storage;
      } catch (error) {
        // the storage does not exist
        return null;
      }
    }
  }
}