/**
 * Converts a blob to an image.
 * @returns Promise with the resulting image.
 * ``` typescript
 * // example
 * broox.media.blobToImage(blobg).then(image => {});
 * ```
 */
 export const blobToImage = (blob: Blob) => {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(image.src);
      resolve(image);
    }
    image.src = URL.createObjectURL(blob);
  });
}