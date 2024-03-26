/**
 * Window wrapper
 */
export class Window {
  static inElectron() {
    // @ts-ignore
    return !!window.electron;
  }

  static writeJson(name: string, json: any) {
    // @ts-ignore
    return window.app && window.app.writeJson(name, json);
  }

  static readJson(name: string) {
    // @ts-ignore
    return window.app && window.app.readJson(name);
  }

  static downloadFile(url: string, name: string, onUpdate: (percent: number) => void, onError: (error: any) => void, onSuccess: (path: string) => void) {
    // @ts-ignore
    return window.app && window.app.downloadFile && window.app.downloadFile(url, name, onUpdate, onError, onSuccess);
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