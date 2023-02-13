import { AddressType } from './AddressType';
import { Blobs } from './Blobs';
import Rect from './Rect';
import { Settings } from './Settings';

/**
 * Handles skeleton and single blobs and provides a visual way of updating their configuration.
 */
export class BlobsController {
  private simulate: boolean = false;
  private skeletonBlobs: Blobs;
  private singleBlobs: Blobs;
  private settings: Settings;
  private activeArea: Rect;
  private blobScale: number;
  private handScale: number;
  private onSettingsChangedCallback: (settings: any) => {};
  private keyToOpenSettings = 's';
  private settingsOpened = false;

  /**
   * 
   * @param width Active area width.
   * @param height Active area height.
   * @param simulate Value indicating whether to sumulate a blob with the mouse pointer.
   * @param onUpdate On update callback.
   * @param onBlobAdded On blob added callback.
   * @param onBlobDeleted  On blob deleted callback.
   * @param onFrameUpdated On frame udpated callback.
   * @param onSettingsChanged On settings changed callback.
   */
  constructor(width: number, height: number, simulate: boolean, onUpdate?: () => {}, onBlobAdded?: (id: string, x: number, y: number) => {}, onBlobDeleted?: (id: string) => {}, onFrameUpdated?: (fseq: number) => {}, onSettingsChanged?: (settings: any) => {}) {
    this.simulate = simulate;
    this.activeArea = { x: 0, y: 0, width: width, height: height };
    this.blobScale = 1;
    this.handScale = 1;
    this.onSettingsChangedCallback = onSettingsChanged;
    this.skeletonBlobs = new Blobs(AddressType.skel, width, height, 1, onUpdate, onBlobAdded, onBlobDeleted, onFrameUpdated);
    this.singleBlobs = new Blobs(AddressType.blob, width, height, 1, onUpdate, onBlobAdded, onBlobDeleted, onFrameUpdated);
    this.simulate && this.singleBlobs.enableMouseBlob(true);
    this.settings = new Settings();
    window.addEventListener('message', (event) => {
      console.log('tuio message', event.data);
      this.singleBlobs.onOSCMessage(event.data);
      this.skeletonBlobs.onOSCMessage(event.data);
    }, false);
    window.addEventListener('keydown', (event) => {
      if(event.key === this.keyToOpenSettings) {
        this.settingsOpened ? this.closeSettings() : this.openSettings();
      }
    });
  }

  /**
   * Gets skeleton blobs.
   * @returns Skeleton blobs.
   */
  getSkeletons() {
    return this.skeletonBlobs.getBlobs();
  }

  /**
   * Gets single blobs.
   * @returns Single blobs.
   */
  getSingleBlobs() {
    return this.singleBlobs.getBlobs();
  }

  /**
   * Sets the blobs active area.
   * @param x Left offset.
   * @param y Top offset.
   * @param width Width.
   * @param height Height.
   */
  setActiveArea(x: number, y: number, width: number, height: number) {
    this.activeArea = { x: x, y: y, width: width, height: height };
    this.skeletonBlobs.setActiveArea(x, y, width, height);
    this.singleBlobs.setActiveArea(x, y, width, height);
  }

  /**
   * Sets blobs scale.
   * @param handScale Skeleton hands scale.
   * @param blobScale Single blob scale.
   */
  setBlobsScale(handScale: number, blobScale: number) {
    this.handScale = handScale;
    this.blobScale = blobScale;
    this.skeletonBlobs.setScale(handScale);
    this.singleBlobs.setScale(blobScale);
  }

  /**
   * Simulates single blob with the mouse pointer.
   * @param value Value indicate whether to simulate a single blob with the mouse pointer.
   */
  setSimulate(value: boolean) {
    this.simulate = value;
    this.singleBlobs.enableMouseBlob(value);
  }

  /**
   * Kilss active blobs.
   */
  killBlobs() {
    this.skeletonBlobs.killBlobs();
    this.singleBlobs.killBlobs();
  }

  /**
   * Opens a panel to set the blobs settings.
   */
  openSettings() {
    this.settingsOpened = true;
    let settings = { activeArea: { ...this.activeArea }, handScale: this.handScale, blobScale: this.blobScale, simulate: this.simulate };
    this.settings.open(settings, (newSettings: any) => {
      this.settingsOpened = false;
      this.setActiveArea(newSettings.activeArea.x, newSettings.activeArea.y, newSettings.activeArea.width, newSettings.activeArea.height);
      this.setBlobsScale(newSettings.handScale, newSettings.blobScale);
      this.setSimulate(newSettings.simulate);
      this.onSettingsChangedCallback && this.onSettingsChangedCallback(newSettings);
    }, () => this.killBlobs);
  }

  /**
   * Closes the blobs settings panel.
   */
  closeSettings() {
    this.settingsOpened = false;
    this.settings.close();
  }

  /**
   * Sets the key to open the settings panel when pressed.
   * @param key Key.
   */
  setKeyToOpenSettings(key: string) {
    this.keyToOpenSettings = key;
  }
}