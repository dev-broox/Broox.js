import Message from '../../Message';

/**
 * Gets all available devices.
 * @returns Promise with list of available devices.
 * ``` typescript
 * // example
 * broox.media.getAvailableDevices().then(devices => {});
 * ```
 */
export const getAvailableDevices = (): Promise<any[]> => {
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
 * broox.media.getDeviceId('OBS Virtual Camera').then(id => {
 *   broox.media.start(id, 1080, 1920).then(stream => {});
 * });
 * ```
 */
export const getDeviceId = (name: string): Promise<string> => {
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
 * broox.media.getDeviceId('OBS Virtual Camera').then(id => {
 *   broox.media.start(id, 1080, 1920).then(stream => {});
 * });
 * ```
 */
export const startDevice = (deviceId: string, width: number, height: number): Promise<MediaStream> => {
  return navigator.mediaDevices.getUserMedia({ video: { deviceId: deviceId, width: width, height: height }});
}