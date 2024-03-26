/**
 * Renders a video element in the given 2d context.
 * @param video Video to draw in context.
 * @param context 2d context.
 * @param destinationWidth Destination width.
 * @param destinationHeight Destination height.
 * @param destinationX Destination x position.
 * @param destinationY Destination y position.
 * @param mirror Value indicating whether to mirror the image before.
 * ``` typescript
 * // example
 * const canvas = document.createElement('canvas');
 * canvas.width = width;
 * canvas.height = height;
 * const context = canvas.getContext('2d');
 * const video = document.getElementById('video')
 * drawElement(video, context, width, height, 0, 0, false);
 * ```
 */
export const drawVideo = (video: HTMLVideoElement, context: CanvasRenderingContext2D, destinationWidth: number, destinationHeight: number, destinationX: number, destinationY: number, mirror = false) => {
  drawElement(video, context, video.videoWidth, video.videoHeight, destinationWidth, destinationHeight, destinationX, destinationY, mirror);
}

/**
 * Renders an element in the given 2d context.
 * @param element Element to draw in context.
 * @param context 2d context.
 * @param sourceWidth Source width.
 * @param sourceHeight Source height.
 * @param destinationWidth Destination width.
 * @param destinationHeight Destination height.
 * @param destinationX Destination x position.
 * @param destinationY Destination y position.
 * @param mirror Value indicating whether to mirror the image before.
 * ``` typescript
 * // example
 * const canvas = document.createElement('canvas');
 * canvas.width = width;
 * canvas.height = height;
 * const context = canvas.getContext('2d');
 * const element = document.getElementById('img')
 * drawElement(element, context, element.width, element.height, width, height, 0, 0, false);
 * ```
 */
export const drawElement = (element: CanvasImageSource, context: CanvasRenderingContext2D, sourceWidth: number, sourceHeight: number, destinationWidth: number, destinationHeight: number, destinationX: number, destinationY: number, mirror = false) => {
  drawPartOfElement(element, context, false, sourceWidth, sourceHeight, 0, 0, destinationWidth, destinationHeight, destinationX, destinationY, mirror);
}

/**
 * Renders an element in the given 2d context.
 * @param element Element to draw in context.
 * @param context 2d context.
 * @param sourceWidth Source width.
 * @param sourceHeight Source height.
 * @param sourceX Source x position.
 * @param sourceY Source y position.
 * @param destinationWidth Destination width.
 * @param destinationHeight Destination height.
 * @param destinationX Destination x position.
 * @param destinationY Destination y position.
 * @param mirror Value indicating whether to mirror the image before.
 * ``` typescript
 * // example
 * const canvas = document.createElement('canvas');
 * canvas.width = width;
 * canvas.height = height;
 * const context = canvas.getContext('2d');
 * const element = document.getElementById('img')
 * drawPartOfElement(element, context, false, element.width, element.height, 0, 0, width, height, 0, 0, false);
 * ```
 */
 export const drawPartOfElement = (element: CanvasImageSource, context: CanvasRenderingContext2D, cutToScale: boolean, sourceWidth: number, sourceHeight: number, sourceX: number, sourceY: number, destinationWidth: number, destinationHeight: number, destinationX: number, destinationY: number, mirror = false) => {
  // get ratios
  const horizontalRatio = Math.round((destinationWidth / sourceWidth) * 100) / 100;
  const verticalRatio = Math.round((destinationHeight / sourceHeight) * 100) / 100;
  let height = 0;
  let width = 0;
  let leftOffset = 0;
  let topOffset = 0;
  // take center of element vertically or horizontally depending on ratio
  if(verticalRatio === horizontalRatio) {
    width = sourceWidth;
    height = sourceHeight;
    leftOffset = 0;
    topOffset = 0;
  }
  else if((verticalRatio > horizontalRatio && cutToScale) || (verticalRatio < horizontalRatio && !cutToScale)) {
    height = sourceHeight;
    width = destinationWidth / verticalRatio;
    leftOffset = (sourceWidth - width) / 2;
  }
  else {
    width = sourceWidth;
    height = destinationHeight / horizontalRatio;
    topOffset = (sourceHeight - height) / 2;
  }
  if(mirror) {
    context.scale(-1, 1);
    context.drawImage(element, sourceX + leftOffset, sourceY + topOffset, width, height, -destinationX, destinationY, -destinationWidth, destinationHeight);
  }
  else {
    context.drawImage(element, sourceX + leftOffset, sourceY + topOffset, width, height, destinationX, destinationY, destinationWidth, destinationHeight);
  }
}