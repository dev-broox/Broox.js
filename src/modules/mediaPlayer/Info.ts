import{ Window } from './Window';

/**
 * Gets media information.
 * @returns Media information.
 * ``` typescript
 * // example
 * const mediaInfo = broox.mediaPlayer.getMediaInfo();
 * ```
 */
export function getMediaInfo(): any {
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
 export function getDeviceInfo(): any {
  return Window.getDeviceInfo();
}