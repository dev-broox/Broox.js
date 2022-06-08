/**
 * Represents a series of gestures in at a given time
 */
export class Gesture {
  private types: string[] = [];
  private timestamp: number = 0;

  /**
   * Creates an instance of the Gesture class.
   * @param types Gesture types.
   * @param timestamp Timestamp.
   */
  constructor(types: string[], timestamp: number) {
    this.types = types;
    this.timestamp = timestamp;
  }

  /**
   * Gets the types.
   * @returns Gesture types.
   */
  getTypes(): string[] {
    return this.types;
  }

  /**
   * Gets the timestamp.
   * @returns Timestamp.
   */
  getTimestamp(): number {
    return this.timestamp;
  }
}