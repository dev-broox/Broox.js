/**
 * Listens to OSC events and executes callback functions.
 * ``` typescript
 * // example
 * const oscListener = new broox.mediaPlayer.OscListener();
 * oscListener.add('/start', () => console.log('Start'));
 * ```
 */
export class OscListener {
  private events: Map<string, () => any> = new Map<string, () => any>();

  /**
   * Creates an instance of the OscListener class.
   */
  constructor() {
    const self = this;
    // listen osc events
    window.addEventListener('message', event => {
      for(let i = 0; i < event.data.length; i++) {
        const e = event.data[i].address;
        if(self.events.has(e)) {
          const callback = self.events.get(e);
          callback();
        }
      }
    }, false);
  }

  /**
   * Adds a callback function to the given event.
   * @param event Event name to listen to.
   * @param callback Function to execute when the event is recieved.
   */
  add(event: string, callback: () => any) {
    this.events.set(event, callback);
  }
}