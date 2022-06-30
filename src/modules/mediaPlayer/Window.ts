import path from "path";

/**
 * Window wrapper
 */
export class Window {
  static inElectron() {
    // @ts-ignore
    return !!window.electron;
  }

  static getKeyValue() {
    // @ts-ignore
    return window.app && window.app.keyValue;
  }

  static getMediaInfo() {
    // @ts-ignore
    return window.app && window.app.media;
  }

  static getDeviceInfo() {
    // @ts-ignore
    return window.app && window.app.device;
  }

  static logAlarm(subject: string, text: string) {
    //@ts-ignore
    window.app && window.app.logAlarm(subject, text);
  }
}