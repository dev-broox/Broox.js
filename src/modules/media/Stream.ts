import Message from '../../Message';

/**
 * Encapsulates navigator.mediaDevices functions.
 */
export default class Stream {
  /**
   * Gets all available devices.
   * @returns Promise with list of available devices.
   * ``` typescript
   * // example
   * broox.media.Stream.getAvailableDevices().then(devices => {});
   * ```
   */
  static getAvailableDevices(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      navigator.mediaDevices.enumerateDevices()
        .then(devices => {
          const result = devices.map(d => {
            return {
              id: d.deviceId,
              name: d.label
            }
          });
          resolve(result);
        })
        .catch(error => {
          reject(error.message);
        })
    });
  }

  /**
   * Gets the id for the given device name.
   * @param name Device name.
   * @returns Promise with device id if found. Error otherwise.
   * ``` typescript
   * // example
   * broox.media.Stream.getDeviceId('OBS Virtual Camera').then(id => {
   *   broox.media.Stream.start(id, 1080, 1920).then(stream => {});
   * });
   * ```
   */
  static getDeviceId(name: string): Promise<string> {
    return new Promise((resolve, reject) => {
      navigator.mediaDevices.enumerateDevices()
        .then(devices => {
          for(let i = 0; i < devices.length; i++) {
            if(devices[i].label === name) {
              resolve(devices[i].deviceId);
              return;
            }
          }
          reject(Message.deviceNotFound);
        })
        .catch(error => {
          reject(error.message);
        })
    });
  }

  /**
   * Starts the media stream.
   * @param deviceId Webcam identifier.
   * @param width Webcam width.
   * @param height Webcam height.
   * @returns MediaStream object to display webcam content.
   * ``` typescript
   * // example
   * broox.media.Stream.getDeviceId('OBS Virtual Camera').then(id => {
   *   broox.media.Stream.start(id, 1080, 1920).then(stream => {});
   * });
   * ```
   */
  static start(deviceId: string, width: number, height: number) {
    return navigator.mediaDevices.getUserMedia({ video: { deviceId: deviceId, width: width, height: height }});
  }
}