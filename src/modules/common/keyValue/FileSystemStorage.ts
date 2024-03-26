import { Storage } from './Storage';

export class FileSystemStorage implements Storage {
  private writeJson: (name: string, json: any) => void;
  private readJson: (name: string) => any;

  /**
   * 
   * @param writeJson Function to write a json
   * @param readJson Function to read a json 
   */
  constructor(writeJson: (name: string, json: any) => void, readJson: (name: string) => any) {
    this.writeJson = writeJson;
    this.readJson = readJson;
  }

  /**
   * 
   * @param name File name
   * @param json Json content
   */
   write(name: string, json: any): void {
    this.writeJson(name, json);
   }

   /**
    * 
    * @param name File name
    */
   read(name: string): any {
    const content = this.readJson(name);
    return content;
   }
}