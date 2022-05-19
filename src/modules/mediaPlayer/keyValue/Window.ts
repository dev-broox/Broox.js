import path from "path";

/**
 * Window wrapper
 */
export default class Window {
  static inElectron() {
    // @ts-ignore
    return !!window.electron;
  }

  static getFileSystem() {
    // @ts-ignore
    return window.fs;
  }

  static getDirectory() {
    const mediaPlayerDirectory = 'broox_mediaplayer';
    // @ts-ignore
    return path.join(window.userDataPath, mediaPlayerDirectory);
  }
}