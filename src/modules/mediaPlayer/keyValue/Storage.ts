/**
 * Storage interface
 */
interface Storage {
  /**
   * 
   * @param projectName Project name
   * @param content Json content
   */
  write(projectName: string, content: any): void;

  /**
   * 
   * @param projectName Project name
   */
  read(projectName: string): any;
}

export default Storage;