import hexToRgba from 'hex-to-rgba';
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
  private showBlob: boolean = true;
  private blobScale: number;
  private blobColor: string;
  private showHand: boolean = true;
  private handScale: number;
  private handColor: string;
  private onSettingsChangedCallback: (settings: any) => void;
  private keyToOpenSettings = 's';
  private settingsOpened = false;
  private debug = false;
  private debugContext: CanvasRenderingContext2D;
  private maxWidth: number;
  private maxHeight: number;

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
  constructor(width: number, height: number, simulate: boolean, onUpdate?: () => void, onBlobAdded?: (id: string, x: number, y: number) => void, onBlobDeleted?: (id: string) => void, onFrameUpdated?: (fseq: number) => void, onSettingsChanged?: (settings: any) => void) {
    this.simulate = simulate;
    this.activeArea = { x: 0, y: 0, width: width, height: height };
    this.blobScale = 1;
    this.blobColor = '#0000FF';
    this.handScale = 1;
    this.handColor = '#FF0000';
    this.onSettingsChangedCallback = onSettingsChanged;
    const onBlobsUpdate = () => {
      onUpdate && onUpdate();
      this.onUpdate();
    }
    this.skeletonBlobs = new Blobs(AddressType.skel, width, height, 1, onBlobsUpdate, onBlobAdded, onBlobDeleted, onFrameUpdated);
    this.singleBlobs = new Blobs(AddressType.blob, width, height, 1, onBlobsUpdate, onBlobAdded, onBlobDeleted, onFrameUpdated);
    this.simulate && this.singleBlobs.enableMouseBlob(true);
    this.maxWidth = width;
    this.maxHeight = height;
    this.settings = new Settings();
    window.addEventListener('message', (event) => {
      this.singleBlobs.onOSCMessage(event.data);
      this.skeletonBlobs.onOSCMessage(event.data);
    }, false);
    window.addEventListener('keydown', (event) => {
      if(event.key === this.keyToOpenSettings) {
        console.log('opening settings...', event.key);
        this.settingsOpened ? this.closeSettings() : this.openSettings();
      }
    });
    // create canvas and context for debugging purposes
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.left = '0';
    canvas.style.top = '0';
    canvas.width = width;
    canvas.height = height;
    document.body.appendChild(canvas);
    this.debugContext = canvas.getContext('2d');
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
   * @param value Value indicating whether to simulate a single blob with the mouse pointer.
   */
  setSimulate(value: boolean) {
    this.simulate = value;
    this.singleBlobs.enableMouseBlob(value);
  }

  /**
   * Sets debug mode.
   * @param value Value indicating whether to start the debug mode.
   */
  setDebug(value: boolean) {
    this.debug = value;
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
    this.debug = true;
    let settings = { activeArea: { ...this.activeArea }, showHand: this.showHand, handScale: this.handScale, handColor: this.handColor, showBlob: this.showBlob, blobScale: this.blobScale, blobColor: this.blobColor, simulate: this.simulate };
    this.settings.open(settings, this.maxWidth, this.maxHeight, (newSettings: any) => {
      this.setActiveArea(newSettings.activeArea.x, newSettings.activeArea.y, newSettings.activeArea.width, newSettings.activeArea.height);
      this.setBlobsScale(newSettings.handScale, newSettings.blobScale);
      this.showBlob = newSettings.showBlob;
      this.blobColor = newSettings.blobColor;
      this.showHand = newSettings.showHand;
      this.handColor = newSettings.handColor;
      this.setSimulate(newSettings.simulate);
      this.onSettingsChangedCallback && this.onSettingsChangedCallback(newSettings);
    }, () => this.killBlobs, () => {
      this.settingsOpened = false;
      this.debug = false;
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
   * Sets the key to open the settings panel when pressed.
   * @param key Key.
   */
  setKeyToOpenSettings(key: string) {
    this.keyToOpenSettings = key;
  }
 
  private onUpdate() {
    this.debugContext.clearRect(0, 0, this.debugContext.canvas.width, this.debugContext.canvas.height);
    if(this.debug) {
      this.drawActiveArea();
      if(this.showBlob) {
        const singleBlobs = this.getSingleBlobs();
        for(let blob of singleBlobs.values() || []) {
          const b = blob.get();
          this.drawBlob(b.rect, this.blobColor);
        }
      }
      if(this.showHand) {
        const skeletons = this.getSkeletons();
        for(let skeleton of skeletons.values() || []) {
          const s = skeleton.get();
          this.drawBlob(s.leftHand, this.handColor);
          this.drawBlob(s.rightHand, this.handColor);
        }
      }
    }
  }

  private drawActiveArea() {
    this.debugContext.beginPath();
    this.debugContext.lineWidth = 2;
    this.debugContext.strokeStyle = '#ff0000';
    this.debugContext.rect(this.activeArea.x, this.activeArea.y, this.activeArea.width, this.activeArea.height);
    this.debugContext.stroke();
  }

  private drawBlob(blob: Rect, color: string) {
    this.debugContext.beginPath();
    this.debugContext.lineWidth = 2;
    this.debugContext.rect(blob.x - blob.width / 2, blob.y - blob.height / 2, blob.width, blob.height);
    this.debugContext.fillStyle = hexToRgba(color, 0.2);
    this.debugContext.fill();
    this.debugContext.strokeStyle = hexToRgba(color);
    this.debugContext.stroke();
  }
}