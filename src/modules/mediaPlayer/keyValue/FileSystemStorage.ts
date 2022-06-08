import * as path from 'path';
import { Storage } from './Storage';

export class FileSystemStorage implements Storage {
  private directory: string;
  private fileSystem: any;

  /**
   * 
   * @param directory Base directory 
   */
  constructor(directory: string, fileSystem: any) {
    this.directory = directory;
    this.fileSystem = fileSystem;
  }

  /**
   * 
   * @param projectName Project name
   * @param content Json content
   */
   write(projectName: string, content: any): void {
    const filePath = path.join(this.directory, projectName + '.json');
    this.fileSystem.writeFileSync(filePath, JSON.stringify(content));
   }

   /**
    * 
    * @param projectName Project name
    */
   read(projectName: string): any {
    const filePath = path.join(this.directory, projectName + '.json');
    const content = JSON.parse(this.fileSystem.readFileSync(filePath));
    return content;
   }
}