import hexToRgba from 'hex-to-rgba';
import { Skeleton } from './Skeleton';
import { Rect } from './Rect';
import { SkeletonSettings } from '../../common/SkeletonSettings';

/**
 * Skeleton controller.
 */
export class SkeletonController {
  private width: number;
  private height: number;
  private onUpdateCallback: () => void;
  private onSettingsChangedCallback: (settings: any) => void;
  private skeletons: Map<string, Skeleton> = new Map<string, Skeleton>();
  private settings: SkeletonSettings;
  private activeArea: Rect;
  private showBody: boolean = true;
  private bodyScale: number;
  private bodyColor: string;
  private showHand: boolean = true;
  private handScale: number;
  private handColor: string;
  private keyToOpenSettings = 's';
  private debug = false;
  private debugContext: CanvasRenderingContext2D;
  private simulateBody = false;
  private handSize = 10;

  /**
   * Initializes a new instance of the SkeletonController class.
   * @param width Active area width.
   * @param height Active area height.
   * @param onUpdate Callback fired when a skeleton is updated.
   * @param onSettingsChanged Callback fired when settings change.
   */
  constructor(width: number, height: number, onUpdate: () => void, onSettingsChanged: (settings: any) => void) {
    this.width = width;
    this.height = height;
    this.onUpdateCallback = onUpdate;
    this.onSettingsChangedCallback = onSettingsChanged;
    this.activeArea = { x: 0, y: 0, width: width, height: height };
    this.bodyScale = 1;
    this.bodyColor = '#0000FF';
    this.handScale = 1;
    this.handColor = '#FF0000';
    window.addEventListener('message', (event) => {
      this.parseEvent(event.data);
    }, false);
    this.settings = new SkeletonSettings();
    window.addEventListener('keydown', (event) => {
      if(event.key === this.keyToOpenSettings) {
        this.debug ? this.closeSettings() : this.openSettings();
      }
    });
    // create canvas and context for debugging purposes
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.left = '0';
    canvas.style.top = '0';
    canvas.width = this.width;
    canvas.height = this.height;
    document.body.appendChild(canvas);
    this.debugContext = canvas.getContext('2d');
  }

  /**
   * Gets the skeletons.
   * @returns Array of skeletons.
   */
  getSkeletons(): Skeleton[]  {
    return Array.from(this.skeletons.values());
  }

  /**
   * Opens a panel to set the skeletons settings.
   */
  openSettings() {
    this.debug = true;
    let settings = { activeArea: { ...this.activeArea }, showHand: this.showHand, handScale: this.handScale, handSize: this.handSize, handColor: this.handColor, showBody: this.showBody, bodyScale: this.bodyScale, bodyColor: this.bodyColor, simulateBody: this.simulateBody };
    this.settings.open(settings, this.width, this.height, (newSettings: any) => {
      this.setActiveArea(newSettings.activeArea.x, newSettings.activeArea.y, newSettings.activeArea.width, newSettings.activeArea.height);
      this.setHandSize(newSettings.handSize);
      this.setScale(newSettings.handScale, newSettings.bodyScale);
      this.showBody = newSettings.showBody;
      this.showHand = newSettings.showHand;
      this.setColor(newSettings.handColor, newSettings.bodyColor);
      this.simulateBody = newSettings.simulateBody;
      this.onSettingsChangedCallback && this.onSettingsChangedCallback(newSettings);
    }, () => {}, () => {
      this.debug = false;
    });
  }

  /**
   * Closes the skeletons settings panel.
   */
  closeSettings() {
    this.debug = false;
    this.settings.close();
  }

  /**
   * Sets the skeletons active area.
   * @param x Left offset.
   * @param y Top offset.
   * @param width Width.
   * @param height Height.
   */
  setActiveArea(x: number, y: number, width: number, height: number) {
    this.activeArea = { x: x, y: y, width: width, height: height };
  }

  /**
   * Sets the scale.
   * @param handScale Hands scale.
   * @param bodyScale Body scale.
   */
  setScale(handScale: number, bodyScale: number) {
    this.handScale = handScale;
    this.bodyScale = bodyScale;
  }

  /**
   * Sets the body and hand color.
   * @param handColor Hand color.
   * @param bodyColor Body color.
   */
  setColor(handColor: string, bodyColor: string) {
    this.handColor = handColor;
    this.bodyColor = bodyColor;
  }

  /**
   * Sets the hand size.
   * @param size Hand size.
   */
  setHandSize(size: number) {
    this.handSize = size;
  }

  /**
   * Sets the key to open the settings panel when pressed.
   * @param key Key.
   */
  setKeyToOpenSettings(key: string) {
    this.keyToOpenSettings = key;
  }

  private parseEvent(event: any) {
    this.debugContext && this.debugContext.clearRect(0, 0, this.debugContext.canvas.width, this.debugContext.canvas.height);
    this.debug && this.drawActiveArea();
    if(event.type === 'person') {
      if(event.action === 'drop') {
        console.log('skeleton dropped', event.id);
        this.skeletons.delete(event.id);
        this.onUpdateCallback && this.onUpdateCallback();
        return;
      }
      let skeleton = this.skeletons.get(event.id);
      if(!skeleton) {
        skeleton = new Skeleton(event.id);
        this.skeletons.set(event.id, skeleton);
      }
      if(event.bbox) {
        const body = { x: this.activeArea.x + event.bbox[0] * this.activeArea.width, y: this.activeArea.y +  event.bbox[1] * this.activeArea.height, width: event.bbox[2] * this.activeArea.width * this.bodyScale, height: event.bbox[3] * this.activeArea.height * this.bodyScale };
        skeleton.setBody(body);
        this.debug && this.showBody && this.drawRect(body, this.bodyColor);
      }
      if(event.hands && event.hands.leftxy) {
        const scale = (event.hands.scale > 0 ? event.hands.scale : 1) * this.handScale;
        const hand = { x: this.activeArea.x + event.hands.leftxy[0] * this.activeArea.width, y: this.activeArea.y +  event.hands.leftxy[1] * this.activeArea.height, width: this.handSize * scale, height: this.handSize * scale };
        skeleton.setLeftHand(hand);
        this.debug && this.showHand && this.drawRect(hand, this.handColor);
      }
      if(event.hands && event.hands.rightxy) {
        const scale = (event.hands.scale > 0 ? event.hands.scale : 1) * this.handScale;
        const hand = { x: this.activeArea.x + event.hands.rightxy[0] * this.activeArea.width, y: this.activeArea.y +  event.hands.rightxy[1] * this.activeArea.height, width: this.handSize * scale, height: this.handSize * scale };
        skeleton.setRightHand(hand);
        this.debug && this.showHand && this.drawRect(hand, this.handColor);
      }
      this.onUpdateCallback && this.onUpdateCallback();
    }
  }

  private drawActiveArea() {
    this.debugContext.beginPath();
    this.debugContext.lineWidth = 2;
    this.debugContext.strokeStyle = '#ff0000';
    this.debugContext.rect(this.activeArea.x, this.activeArea.y, this.activeArea.width, this.activeArea.height);
    this.debugContext.stroke();
  }

  private drawRect(rect: Rect, color: string) {
    if(rect.x > 0 && rect.y > 0) {
      this.debugContext.beginPath();
      this.debugContext.lineWidth = 2;
      this.debugContext.rect(rect.x, rect.y, rect.width, rect.height);
      this.debugContext.fillStyle = hexToRgba(color, 0.2);
      this.debugContext.fill();
      this.debugContext.strokeStyle = hexToRgba(color);
      this.debugContext.stroke();
    }
  }
}