import { Storage } from './Storage';

export class LocalStorage implements Storage {
  /**
   * 
   * @param name File name
   * @param content Json content
   */
  write(name: string, content: any): void {
    localStorage.setItem(name, JSON.stringify(content));
  }
  /**
   * 
   * @param name File name
   * @returns Json content for the given project
   */
  read(name: string): any {
    const content = localStorage.getItem(name);
    if(content) {
      return JSON.parse(content);
    }
    return null;
  }
}