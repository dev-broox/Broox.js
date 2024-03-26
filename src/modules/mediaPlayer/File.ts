import { Window } from '../common/Window';

/**
 * Downloads a file.
 * @param url File url.
 * @param name File name.
 * @param onUpdate Callback function that indicates the percentage of the operation.
 * ``` typescript
 * // example
 * broox.mediaPlayer.downloadFile(url, name, onUpdate).then(filePath => ...);
 * ```
 */
export const downloadFile = (url: string, name: string, onUpdate: (percent: number) => void): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    Window.inElectron() ? Window.downloadFile(url, name, onUpdate, (error: any) => reject(error), (path: string) => resolve(path)) : resolve(url);
  });
}
