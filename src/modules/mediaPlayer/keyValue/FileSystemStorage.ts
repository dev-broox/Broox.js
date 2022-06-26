import { Storage } from './Storage';

export class FileSystemStorage implements Storage {
  private keyValue: any;

  /**
   * 
   * @param keyValue Key value manager 
   */
  constructor(keyValue: any) {
    this.keyValue = keyValue;
  }

  /**
   * 
   * @param projectName Project name
   * @param content Json content
   */
   write(projectName: string, content: any): void {
    this.keyValue.write(projectName, JSON.stringify(content));
   }

   /**
    * 
    * @param projectName Project name
    */
   read(projectName: string): any {
    const content = JSON.parse(this.keyValue.read(projectName));
    return content;
   }
}