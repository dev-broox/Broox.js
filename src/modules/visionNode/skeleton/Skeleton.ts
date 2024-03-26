import { Rect } from './Rect';

/**
 * Represents a skeleton
 */
export class Skeleton {
  private id: string;
  private body: Rect;
  private leftHand: Rect;
  private rightHand: Rect;
  private timestamp: number;

  /**
   * Initializes a new instance of the Skeleton class.
   * @param id Skeleton id.
   */
  constructor(id: string) {
    this.id = id;
    this.timestamp = Date.now();
    this.body = { x: 0, y: 0, width: 0, height: 0 };
    this.leftHand = { x: 0, y: 0, width: 0, height: 0 };
    this.rightHand = { x: 0, y: 0, width: 0, height: 0 };
  }

  /**
   * Sets a body.
   * @param body Body rectangle.
   */
  setBody(body: Rect) {
    this.body = body;
  }

  /**
   * Sets the left hand.
   * @param hand Hand rectangle.
   */
  setLeftHand(hand: Rect) {
    this.leftHand = hand;
  }

  /**
   * Sets the right hand.
   * @param hand Hand rectangle.
   */
  setRightHand(hand: Rect) {
    this.rightHand = hand;
  }

  /**
   * Sets the timestamp.
   * @param timestamp Timestamp.
   */
  setTimestamp(timestamp: number) {
    this.timestamp = timestamp;
  }

  /**
   * Gets the body.
   * @returns The body rectangle.
   */
  getBody(): Rect {
    return this.body;
  }

  /**
   * Gets the left hand.
   * @returns The hand rectangle.
   */
  getLeftHand(): Rect {
    return this.leftHand;
  }

  /**
   * Gets the right hand.
   * @returns The hand rectangle.
   */
  getRightHand(): Rect {
    return this.rightHand;
  }

  /**
   * Gets the timestamp.
   * @returns The timestamp.
   */
  getTimestamp(): number {
    return this.timestamp;
  }
}