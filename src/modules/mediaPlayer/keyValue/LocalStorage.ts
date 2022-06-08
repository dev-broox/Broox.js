import { Storage } from './Storage';

export class LocalStorage implements Storage {
  /**
   * 
   * @param projectName Project name
   * @param content Json content
   */
  write(projectName: string, content: any): void {
    localStorage.setItem(projectName, JSON.stringify(content));
  }
  /**
   * 
   * @param projectName Project name
   * @returns Json content for the given project
   */
  read(projectName: string): any {
    const content = localStorage.getItem(projectName);
    return JSON.parse(content);
  }
}