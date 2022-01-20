/**
 * Manipulates 2d context
 */
export default class Context {
  /**
   * Renders a video element in the given 2d context.
   * @param video Video to draw in context.
   * @param context 2d context.
   * @param destinationWidth Destination width.
   * @param destinationHeight Destination height.
   * @param destinationX Destination x position.
   * @param destinationY Destination y position.
   * @param mirror Value indicating whether to mirror the image before. 
   */
  static drawVideo(video: HTMLVideoElement, context: CanvasRenderingContext2D, destinationWidth: number, destinationHeight: number, destinationX: number, destinationY: number, mirror = false) {
    this.drawElement(video, context, video.videoWidth, video.videoHeight, destinationWidth, destinationHeight, destinationX, destinationY, mirror);
  }

  private static drawElement(element: CanvasImageSource, context: CanvasRenderingContext2D, sourceWidth: number, sourceHeight: number, destinationWidth: number, destinationHeight: number, destinationX: number, destinationY: number, mirror = false) {
    context.save();
    // get ratios
    const horizontalRatio = destinationWidth / sourceWidth;
    const verticalRatio = destinationHeight / sourceHeight;
    let height = 0;
    let width = 0;
    let leftOffset = 0;
    let topOffset = 0;
    // take center of element vertically or horizontally depending on ratio
    if(verticalRatio > horizontalRatio) {
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
      context.drawImage(element, leftOffset, topOffset, width, height, -destinationX, destinationY, -destinationWidth, destinationHeight);
    }
    else {
      context.drawImage(element, leftOffset, topOffset, width, height, destinationX, destinationY, destinationWidth, destinationHeight);
    }
    context.restore();
  }
}