/**
 * Provides context to communicate with Vision Node.
 * #### Usage
 *
 * ``` typescript
 * import { SkeletonController } from './brooxVisionNode.js';
 * ```
 * <br/>
 *
 * #### {@link SkeletonController}
 *
 * Parses MQTT events sent by Vision Node and keeps track of the skeletons.
 *
 * ``` typescript
 * // example
 * const skeletonController = new SkeletonController(width, height, () => {...);
 * const skeletons = blobsController.getSkeletons();
 * ```
 * <br/>
 *
 * #### {@link GestureHandler}
 *
 * Parses MQTT events sent by Vision Node and allows to handle the different gestures.
 *
 * ``` typescript
 * // example
 * const gestureHandler = new GestureHandler(500, 2);
 * gestureHandler.onPresence(() => console.log('Presence'));
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
 * #### {@link MqttClient}
 *
 * MQTT client.
 *
 * ``` typescript
 * // example
 * const client = new MqttClient('localhost', 1884);
 * client.onMessage((message) => console.log(message));
 * ```
 * <br/>
 * 
 * @module visionNode
 */

export { SkeletonController } from './skeleton/SkeletonController';
export { KeyValue } from '../common/keyValue/KeyValue';
export { GestureHandler } from './gesture/GestureHandler';
export { MqttClient } from './MqttClient';
