import { Gesture } from './Gesture';
import { GestureType } from './GestureType';

/**
 * Parse gestures coming from Vision Node
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
  private handOnChestCallback: () => any;

  /**
   * Creates an instance of the GestureHandler class.
   * @param time Time lapse before accepting a gesture as such.
   * @param delay Time before listening to other gestures once a gesture is accepted.
   */
  constructor(time: number, delay: number) {
    this.time = time;
    this.delay = delay;
    const self = this;
    // listen osc events
    window.addEventListener('message', event => {
      for(let i = 0; i < event.data.length; i++) {
        if(event.data[i].address === '/de/person') {
          self.add(event.data[i].args);
        }
      }
    }, false);
  }

  /**
   * Adds a potential gesture to be processed.
   * @param args OSC event args.
   */
  add(args: any[]): void {
    if(this.listening) {
      if(args[0] === 'id') {
        this.presenceCallback && this.presenceCallback();
      }
      else if(args[0] === 'prop' && args[2] === 'poses') {
        const types = args.slice(3);
        if(types.length) {
          const gesture = new Gesture(types, new Date().getTime());
          this.gestures.push(gesture);
          this.check();
        }
      }
    }
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
   * Adds a callback function for the "hand on chest" gesture.
   * @param callback Function that will be executed when the "hand on chest" gesture is detected.
   */
  onHandOnChest(callback: () => any) {
    this.handOnChestCallback = callback;
  }

  /**
   * Checks whether a gesture was made. 
   */
  private check(): void {
    // get last gesture
    const lastIndex = this.gestures.length - 1;
    const lastGesture = this.gestures[lastIndex];
    const lastGestureTypes = lastGesture.getTypes();
    if(lastGestureTypes.length === 1) {
      const type = lastGestureTypes[0];
      // if gesture is BothHandsUp or BothHandsOnChest, send the event
      if(type === GestureType.BothHandsUp || type === GestureType.BothHandsOnChest) {
        this.send(type);
      }
      else if(this.gestures.length > 1) {
        const lastTimestamp = lastGesture.getTimestamp();
        let i = lastIndex;
        let gesture: Gesture = null;
        // find last gesture before the time lapse defined
        while(!gesture && --i >= 0 && this.gestures[i].getTypes().indexOf(type) >= 0) {
          console.log(this.gestures[i]);
          if(lastTimestamp - this.gestures[i].getTimestamp() > this.time) {
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
      this.handOnChestCallback && this.handOnChestCallback();
    }
  }
}