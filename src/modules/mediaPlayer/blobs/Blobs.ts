import TUIOBlobs from './tuio/TUIOBlobs'

/**
 * Parses tuio events recieved by apps and keeps track of the blobs.
 *``` typescript
 * // example
 * const blobs = new broox.mediaPlayer.Blobs();
 * const activeItems = blobs.getActiveItems();
 * ```
 */
export class Blobs {
  private defaultAddress = null;
  private defaultController = new TUIOBlobs(null);
  private controllers = new Map();
  private touchTarget = window;

  /**
   * Attaches listeners to window
   */
  constructor() {
    window.addEventListener('message', this.onMessage.bind(this), false);
    window.requestAnimationFrame(this.loop.bind(this));
  }

  /**
   * Sets touch target.
   * @param target Target.
   */
  setTouchTarget(target) {
    if(target) {
      this.touchTarget = target;
      this.loopControllers(controller => {
        controller.setTouchTarget(target);
      });
    }
  }

  /**
   * Sets input.
   * @param inputs Inputs.
   * @param touchEventsTarget Target.
   */
  setInput(inputs = [], touchEventsTarget = null) {
    this.controllers = new Map();
    this.defaultAddress = null;
    this.defaultController = null;

    for(let input of inputs) {
      let address = input.address;
      if(!address) {
        continue;
      }
      let controller = new TUIOBlobs(address);
      if(this.controllers.has(address)) { 
        // only allow one controller with the same input message address
        continue;
      }
      if(!this.defaultAddress) {
        this.defaultAddress = address;
      }
      if(input.touchEvents != null) {
        controller.setTouchEventsEnabled(input.touchEvents);
      }
      this.controllers.set(address, controller);
    }
    this.setTouchTarget(touchEventsTarget ? touchEventsTarget : this.touchTarget);
  }

  /**
   * Sets blobs space transform.
   * @param x X.
   * @param y Y.
   * @param width Width.
   * @param height Height.
   */
  setBlobsSpaceTransform(x, y, width, height) {
    this.loopControllers(controller => {
      controller.setBlobsSpaceTransform(x, y, width, height);
    });
  }

  /**
   * Sets touch event as enabled or disabled.
   * @param isEnabled Value indicating whether is enabled.
   * @param address Address.
   */
  setTouchEventsEnabled(isEnabled, address = null) {
    let controller = this.getController(address);
    if(controller) {
      controller.setTouchEventsEnabled(isEnabled)
    }
  }

  /**
   * Gets controller.
   * @param address Address.
   * @returns Controller.
   */
  getController(address = null) {
    if(!address && this.defaultController) {
      return this.defaultController
    }
    else if(!address && this.defaultAddress) {
      return this.controllers.get(this.defaultAddress)
    }
    else if(address){
      return this.controllers.get(address);
    }
    return null;
  }

  /**
   * Gets active items.
   * @param address Address.
   * @returns Active items.
   */
  getActiveItems(address = null) {
    let controller = this.getController(address);
    if(!controller) {
      return new Map();
    }
    return controller.getActiveItems();
  }

  private onMessage(evt) {
    this.onOSCMessage(evt.data);
  }

  private onOSCMessage(json){
    this.loopControllers(controller => {
      controller.onOSCMessage(json);
    });
    if(this.defaultController) {
      const address = this.defaultController.getMessageAddress();
      if(address) {
        this.controllers.set(address, this.defaultController);
        this.defaultController = null;
        if(!this.defaultAddress) {
          this.defaultAddress = address;
        }
      }
    }
  }

  private loopControllers(action) {
    if(this.defaultController) {
      action(this.defaultController);
    }
    else {
      for(let [address, controller] of this.controllers) {
        action(controller);
      }
    }
  }

  private loop() {
    let touchesAdded = [];
    let touchesMoved = [];
    let touchesDeleted = [];
    let touchesAll = [];
    this.loopControllers(controller => {
      let touches = controller.updateTouches();
      if(touches && touches.all) {
        if(touches.added) {
            touchesAdded = touchesAdded.concat(touches.added);
        }
        if(touches.moved) {
            touchesMoved = touchesMoved.concat(touches.moved);
        }
        if(touches.deleted) {
            touchesDeleted = touchesDeleted.concat(touches.deleted);
        }
        touchesAll = touchesAll.concat(touches.all);
      }
    });
    this.sendTouchesAdded(touchesAdded, touchesAll);
    this.sendTouchesMoved(touchesMoved, touchesAll);
    this.sendTouchesDeleted(touchesDeleted, touchesAll);
    window.requestAnimationFrame(this.loop.bind(this));
  }

  private sendTouchesAdded(touchesChanged, touchesAll) {
    if(touchesChanged.length == 0) {
      return;
    }
    this.touchTarget.dispatchEvent(this.event('touchstart', touchesChanged, touchesAll));
  }

  private sendTouchesMoved(touchesChanged, touchesAll) {
    if(touchesChanged.length == 0) {
      return;
    }
    console.log(touchesAll);
    this.touchTarget.dispatchEvent(this.event('touchmove', touchesChanged, touchesAll));
  }

  private sendTouchesDeleted(touchesChanged, touchesAll) {
    if(touchesChanged.length == 0) {
      return;
    }
    this.touchTarget.dispatchEvent(this.event('touchend', touchesChanged, touchesAll));
  }

  private event(type, touchesChanged, touchesAll) {
    return new TouchEvent(type, {
      changedTouches: touchesChanged,
      targetTouches: touchesAll,
      touches: touchesAll
    });
  }
}