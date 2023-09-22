/**
 * Provides context to the apps executed within the Media Player.
 * #### Usage
 *
 * ``` typescript
 * import { BlobsController, getMediaInfo } from './brooxMediaPlayer.js';
 * ```
 * <br/>
 *
 * #### {@link BlobsController}
 *
 * Parses tuio events recieved by apps and keeps track of the blobs.
 *
 * ``` typescript
 * // example
 * const blobsController = new BlobsController(width, height, true, false, () => {...);
 * const skeletons = blobsController.getSkeletons();
 * ```
 * <br/>
 *
 * #### {@link KeyValue}
 *
 * Allows apps to persist json values associated to a project and a key.
 *
 * ``` typescript
 * // example
 * const user = {
 *   firstName: 'John',
 *   lastName: 'Doe'
 * };
 * const keyValue = new KeyValue();
 * keyValue.set('testApp', 'profile', user);
 * const profile = keyValue.get('testApp', 'profile');
 * ```
 * <br/>
 *
 * #### {@link GestureHandler}
 *
 * Parses OSC events recieved by apps and allows to handle the different gestures.
 *
 * ``` typescript
 * // example
 * const gestureHandler = new GestureHandler(500, 2);
 * gestureHandler.onPresence(() => console.log('Presence'));
 * ```
 * <br/>
 *
 * #### {@link OscListener}
 *
 * Listens to OSC events and executes callback functions.
 *
 * ``` typescript
 * // example
 * const oscListener = new OscListener();
 * oscListener.add('/start', () => console.log('Start'));
 * ```
 * <br/>
 * 
 * #### Functions
 * - {@link getMediaInfo}
 *   <br/>
 *   Gets media information.
 * - {@link getDeviceInfo}
 *   <br/>
 *   Gets device information.
 *   <br/>
 * - {@link logAlarm}
 *   <br/>
 *   Logs an alarm.
 *   <br/>
 * - {@link downloadFile}
 *   <br/>
 *   Downloads a file.
 * 
 * @module mediaPlayer
 */
export { GestureType } from './gesture/GestureType';
export { GestureHandler } from './gesture/GestureHandler';
export { KeyValue } from './keyValue/KeyValue';
export { BlobsController } from './blobs/BlobsController';
export { AddressType } from './blobs/AddressType';
export { OscListener } from './OscListener';
export { getMediaInfo, getDeviceInfo } from './Info';
export { logAlarm } from './Log';
export { downloadFile } from './File';
