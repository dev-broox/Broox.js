import { Window } from './Window';

/**
 * Logs an alarm.
 * @param subject Alarm subject.
 * @param text Alarm text.
 * ``` typescript
 * // example
 * broox.mediaPlayer.logAlarm('Error', e.message);
 * ```
 */
export const logAlarm = (subject: string, text: string): any => {
  return Window.logAlarm(subject, text);
}
