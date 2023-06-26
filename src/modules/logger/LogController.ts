import { Settings } from './Settings';

export class LogController {
  private keyToOpenSettings: string = 'l';
  private settingsOpened = false;
  private settings: Settings;
  private onSettingsChangedCallback: (settings: any) => void;
  private logEnabled: boolean = false;
  private errorEnabled: boolean = false;
  private warnEnabled: boolean = false;
  private infoEnabled: boolean = false;
  private debugEnabled: boolean = false;
  private log = console.log;
  private error = console.error;
  private warn = console.warn;
  private info = console.info;
  private debug = console.debug;

  /**
   * 
   * @param enabled Value indicating whether logging is enabled.
   * @param onSettingsChanged On settings changed callback. 
   */
  constructor(enabled: boolean, onSettingsChanged?: (settings: any) => void) {
    this.logEnabled = this.errorEnabled = this.warnEnabled = this.infoEnabled = this.debugEnabled = enabled;
    this.onSettingsChangedCallback = onSettingsChanged;
    this.settings = new Settings();
    window.addEventListener('keydown', (event) => {
      if(event.key === this.keyToOpenSettings) {
        console.log('opening log settings...', event.key);
        this.settingsOpened ? this.closeSettings() : this.openSettings();
      }
    });
  }

  /**
   * Opens a panel to set the blobs settings.
   */
  openSettings() {
    this.settingsOpened = true;
    let settings = { logEnabled: this.logEnabled, errorEnabled: this.errorEnabled, warnEnabled: this.warnEnabled, infoEnabled: this.infoEnabled, debugEnabled: this.debugEnabled };
    this.settings.open(settings, (newSettings: any) => {
      this.setLogEnabled(newSettings.logEnabled);
      this.setErrorEnabled(newSettings.errorEnabled);
      this.setWarnEnabled(newSettings.warnEnabled);
      this.setInfoEnabled(newSettings.infoEnabled);
      this.setDebugEnabled(newSettings.debugEnabled);
      this.onSettingsChangedCallback && this.onSettingsChangedCallback(newSettings);
    }, () => {
      this.settingsOpened = false;
    });
  }

  /**
   * Closes the blobs settings panel.
   */
  closeSettings() {
    this.settingsOpened = false;
    this.settings.close();
  }

  /**
   * Sets a value indicating whether log is enabled.
   */
  setLogEnabled(value: boolean) {
    this.logEnabled = value;
    console.log = value ? this.log : () => {};
  }

  /**
   * Sets a value indicating whether error is enabled.
   */
  setErrorEnabled(value: boolean) {
    this.errorEnabled = value;
    console.error = value ? this.error : () => {};
  }

  /**
   * Sets a value indicating whether warn is enabled.
   */
  setWarnEnabled(value: boolean) {
    this.warnEnabled = value;
    console.warn = value ? this.warn : () => {};
  }

  /**
   * Sets a value indicating whether info is enabled.
   */
  setInfoEnabled(value: boolean) {
    this.infoEnabled = value;
    console.info = value ? this.info : () => {};
  }

  /**
   * Sets a value indicating whether debug is enabled.
   */
  setDebugEnabled(value: boolean) {
    this.debugEnabled = value;
    console.debug = value ? this.debug : () => {};
  }

  /**
   * Sets the key to open the settings panel when pressed.
   * @param key Key.
   */
  setKeyToOpenSettings(key: string) {
    this.keyToOpenSettings = key;
  }
}