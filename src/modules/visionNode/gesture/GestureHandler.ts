import { Gesture } from './Gesture';
import { GestureType } from './GestureType';

/**
 * Parses gestures coming from Vision Node and allows to add callbacks to perform an action when such gestures occure.
 * ``` typescript
 * // example
 * const gestureHandler = new GestureHandler(500, 2);
 * gestureHandler.onPresence(() => console.log('Presence'));
 * ```
 */
export class GestureHandler {
  private time: number;
  private delay: number;
  private listening: boolean = true;
  private gestures: Gesture[] = [];
  private presenceCallback: () => any;
  private bothHandsUpCallback: () => any;
  private leftHandUpCallback: () => any;
  private rightHandUpCallback: () => any;
  private bothHandsOnChestCallback: () => any;
  private leftHandOnChestCallback: () => any;
  private rightHandOnChestCallback: () => any;
  private availableTypes = Object.values(GestureType);

  /**
   * Creates an instance of the GestureHandler class.
   * @param time Time lapse in milliseconds before accepting a gesture as such.
   * @param delay Time lapse in seconds before listening to other gestures once a gesture is accepted.
   */
  constructor(time: number, delay: number) {
    this.time = time;
    this.delay = delay;
    const self = this;
    // listen osc events
    window.addEventListener('message', event => {
      this.parseEvent(event.data);
    }, false);
  }

  /**
   * Adds a callback function for the "presence" gesture.
   * @param callback Function that will be executed when the presence gesture is detected.
   */
  onPresence(callback: () => any) {
    this.presenceCallback = callback;
  }

  /**
   * Adds a callback function for the "both hands up" gesture.
   * @param callback Function that will be executed when the "both hands up" gesture is detected.
   */
  onBothHandsUp(callback: () => any) {
    this.bothHandsUpCallback = callback;
  }

  /**
   * Adds a callback function for the "left hand up" gesture.
   * @param callback Function that will be executed when the "left hand up" gesture is detected.
   */
  onLeftHandUp(callback: () => any) {
    this.leftHandUpCallback = callback;
  }

  /**
   * Adds a callback function for the "right hand up" gesture.
   * @param callback Function that will be executed when the "right hand up" gesture is detected.
   */
  onRightHandUp(callback: () => any) {
    this.rightHandUpCallback = callback;
  }

  /**
   * Adds a callback function for the "both hands on chest" gesture.
   * @param callback Function that will be executed when the "both hands on chest" gesture is detected.
   */
  onBothHandsOnChest(callback: () => any) {
    this.bothHandsOnChestCallback = callback;
  }

  /**
   * Adds a callback function for the "left hand on chest" gesture.
   * @param callback Function that will be executed when the "left hand on chest" gesture is detected.
   */
  onLeftHandOnChest(callback: () => any) {
    this.leftHandOnChestCallback = callback;
  }

  /**
   * Adds a callback function for the "right hand on chest" gesture.
   * @param callback Function that will be executed when the "right hand on chest" gesture is detected.
   */
  onRightHandOnChest(callback: () => any) {
    this.rightHandOnChestCallback = callback;
  }

  /**
   * Adds a potential gesture to be processed.
   * @param args OSC event args.
   */
  private add(gesture: Gesture): void {
    if(this.listening) {
      this.presenceCallback && this.presenceCallback();
      this.gestures.push(gesture);
      this.check();
    }
  }

  /**
   * Checks whether a gesture was made. 
   */
  private check(): void {
    // get last gesture
    const lastIndex = this.gestures.length - 1;
    const lastGesture = this.gestures[lastIndex];
    const lastGestureTypes = lastGesture.types;
    if(lastGestureTypes.length === 1) {
      const type = lastGestureTypes[0];
      // if gesture is BothHandsUp or BothHandsOnChest, send the event
      if(type === GestureType.BothHandsUp || type === GestureType.BothHandsOnChest) {
        this.send(type);
      }
      else if(this.gestures.length > 1) {
        const lastTimestamp = lastGesture.timestamp;
        let i = lastIndex;
        let gesture: Gesture | null = null;
        // find last gesture before the time lapse defined
        while(!gesture && --i >= 0 && this.gestures[i].types.indexOf(type) >= 0) {
          if(lastTimestamp - this.gestures[i].timestamp > this.time) {
            gesture = this.gestures[i];
          }
        }
        if(gesture) {
          this.send(type);
        }
      }
    }
  }

  /**
   * Executes a callback function based on the gesture made.
   * @param type Gesture made.
   */
  private send(type: string): void {
    console.log('Gesture ' + type + ' sent');
    this.listening = false;
    this.gestures = [];
    setTimeout(() => {
      this.listening = true;
    }, this.delay * 1000);
    if(type === GestureType.BothHandsUp) {
      this.bothHandsUpCallback && this.bothHandsUpCallback();
    }
    else if(type === GestureType.LeftHandUp) {
      this.leftHandUpCallback && this.leftHandUpCallback();
    }
    else if(type === GestureType.RightHandUp) {
      this.rightHandUpCallback && this.rightHandUpCallback();
    }
    else if(type === GestureType.BothHandsOnChest) {
      this.bothHandsOnChestCallback && this.bothHandsOnChestCallback();
    }
    else if(type === GestureType.LeftHandOnChest) {
      this.leftHandOnChestCallback && this.leftHandOnChestCallback();
    }
    else if(type === GestureType.RightHandOnChest) {
      this.rightHandOnChestCallback && this.rightHandOnChestCallback();
    }
  }

  /**
   * Parses an MQTT event.
   * @param event MQTT event.
   */
  private parseEvent(event: any): void {
    if(event.type === 'person') {
      const types = (event.poses || []).filter(p => this.availableTypes.includes(p));
      if(types.length) {
        const gesture = { id: event.id, types: types, timestamp: Date.now() };
        this.add(gesture);
      }
    }
  }
}