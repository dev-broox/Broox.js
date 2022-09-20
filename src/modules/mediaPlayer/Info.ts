import{ Window } from './Window';

/**
 * Gets media information.
 * @returns Media information.
 * ``` typescript
 * // example
 * const mediaInfo = broox.mediaPlayer.getMediaInfo();
 * ```
 */
export const getMediaInfo = (): any => {
  return Window.getMediaInfo();
}

/**
 * Gets device information.
 * @returns Device information.
 * ``` typescript
 * // example
 * const deviceInfo = broox.mediaPlayer.getDeviceInfo();
 * ```
 */
 export const getDeviceInfo = (): any => {
  return Window.getDeviceInfo();
}