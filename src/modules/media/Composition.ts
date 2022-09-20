import { drawElement } from './Context';

/**
 * Generates images composition based on different elements.
 * ``` typescript
 * // example
 * const composition = new broox.media.Composition(width, height, borderWidth);
 * composition.addElement(webcam, 0, 0, webcam.videoWidth, webcam.videoHeight, 1, false);
 * composition.get().then(blob => {
 *   image.src = URL.createObjectURL(blob);
 * )};
 * ```
 */
export class Composition {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private scale: number;
  private borderWidth: number;

  /**
   * Generates an instance of the Composition class.
   * @param width Composition width.
   * @param height Composition height.
   * @param borderWidth Border width.
   */
  constructor(width: number, height: number, borderWidth: number) {
    this.borderWidth = borderWidth;
    this.canvas = document.createElement('canvas');
    this.scale = (width - this.borderWidth * 2) / width;
    this.canvas.width = width;
    this.canvas.height = height * this.scale + this.borderWidth * 2;
    this.context = this.canvas.getContext('2d');
    this.context.fillStyle = 'white';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Adds an element to the composition.
   * @param element Element to add.
   * @param x Element X position.
   * @param y Element Y position.
   * @param width Element width.
   * @param height Element height.
   * @param scale Element scale.
   * @param mirror Value indicating whether to mirror the image.
   * ``` typescript
   * // example
   * const composition = new broox.media.Composition(width, height, borderWidth);
   * composition.addElement(webcam, 0, 0, webcam.videoWidth, webcam.videoHeight, 1, false);
   * composition.addElement(image, 0, 0, image.width, image.height, 1, false);
   * ```
   */
  addElement(element: any, x: number, y: number, width: number, height: number, scale: number, mirror: boolean) {
    const destinationWidth = width * this.scale * scale;
    const destinationHeight = height * this.scale * scale;
    const destinationX = this.borderWidth + x * scale * this.scale;
    const destinationY = this.borderWidth + y * scale * this.scale;
    drawElement(element, this.context, width, height, destinationWidth, destinationHeight, destinationX, destinationY, mirror);
  }

  /**
   * Clears the composition.
   */
  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Gets the resulting composition.
   * @returns A promise with a blob containing the composition.
   * ``` typescript
   * // example
   * composition.get().then(blob => {
   *   image.src = URL.createObjectURL(blob);
   * )};
   * ```
   */
  get(): Promise<Blob> {
    return new Promise((resolve) => {
      this.canvas.toBlob(blob => resolve(blob), 'image/jpeg', 1);
    });
  }
}