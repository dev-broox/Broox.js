/**
 * Provides context to the apps executed within the Media Player.
 *
 * #### {@link Blobs}
 *
 * Parses tuio events recieved by apps and keeps track of the blobs.
 *
 * ``` typescript
 * // example
 * const blobs = new broox.mediaPlayer.Blobs();
 * const activeItems = blobs.getActiveItems();
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
 * const keyValue = new broox.mediaPlayer.KeyValue();
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
 * const gestureHandler = new broox.mediaPlayer.GestureHandler(500, 2);
 * gestureHandler.onPresence(() => console.log('Presence'));
 * ```
 * <br/>
 *
 * #### Functions
 * - {@link getMediaInfo}
 *   <br/>
 *   Gets media information
 * - {@link getDeviceInfo}
 *   <br/>
 *   Gets device information
 * <br/>
 * 
 * @module mediaPlayer
 */
export { GestureType } from './gesture/GestureType';
export { GestureHandler } from './gesture/GestureHandler';
export { KeyValue } from './keyValue/KeyValue';
export { Blobs } from './blobs/Blobs';
export { getMediaInfo, getDeviceInfo } from './Info';
