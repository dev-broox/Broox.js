/**
 * Provides classes and functions related to the rendering process of different media.
 *
 * #### {@link Composition}
 *
 * Allows to create an image based on many media objects (images, videos, etc.).
 *
 * ``` typescript
 * // example
 * const composition = new broox.media.Composition(width, height, borderWidth);
 * composition.addElement(webcam, 0, 0, webcam.videoWidth, webcam.videoHeight, 1, false);
 * composition.get().then(blob => {
 *    image.src = URL.createObjectURL(blob);
 * )};
 * ```
 * <br/>
 * Allows to record a stream.
 *
 * ``` typescript
 * // example
 * const recorder = new broox.media.Recorder(stream);
 * recorder.start();
 * setTimeout(() => {
 *   recorder.stop().then(blob => {
 *     console.log(blob);
 *   )};
 * }, 10000);
 * ```
 * <br/>
 *
 * #### Functions
 * - {@link getAvailableDevices}
 *   <br/>
 *   Gets navigator media devices.
 * - {@link getDeviceId}
 *   <br/>
 *   Gets navigator device id.
 * - {@link startDevice}
 *   <br/>
 *   Starts a given device (user media).
 * - {@link drawElement}
 *   <br/>
 *   Renders an element in a given 2d context.
 * - {@link drawVideo}
 *   <br/>
 *   Renders a video in a given 2d context.
* - {@link blobToImage}
 *   <br/>
 *   Converts a blob to an image.
 * 
 * @module media
 */
export { drawElement, drawVideo } from './Context';
export { getAvailableDevices, getDeviceId, startDevice } from './Stream';
export { blobToImage } from './Blob';
export { Composition } from './Composition';
export { Recorder } from './Recorder';