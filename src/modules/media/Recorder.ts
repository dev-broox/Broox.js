/**
 * Creates a video based on a stream.
 * ``` typescript
 * // example
 * const recorder = new broox.media.Recorder(stream);
 * recorder.start();
 * setTimeout(() => {
 *   recorder.stop().then(blob => {
 *     console.log(blob);
 *   )};
 * }, 10000);
 * ```
 */
export class Recorder {
  private stream: MediaStream;
  private recorder: MediaRecorder;
  private promise: Promise<Blob>;
  private resolve: (value: Blob | PromiseLike<Blob>) => void;

  /**
   * Creates an instance of the Recorder class. 
   */
  constructor();
  /**
   * Creates an instance of the Recorder class.
   * @param stream Stream to record.
   */
  constructor(stream: MediaStream);
  constructor(stream?: MediaStream) {
    this.stream = stream;
  }

  /**
   * Sets a stream to record.
   * @param stream Stream to record.
   */
  setStream(stream: MediaStream) {
    this.stream = stream;
  }

  /**
   * Starts recording.
   */
  start(options: MediaRecorderOptions) {
    const self = this;
    this.promise = new Promise((resolve, reject) => {
      self.resolve = resolve;
    });
    let data = [];
    this.recorder = new MediaRecorder(this.stream, options || {});
    this.recorder.ondataavailable = e => data.push(e.data);
    this.recorder.onstop = () => {
      self.resolve(new Blob(data, { type: 'video/webm' }));
    };
    this.recorder.start();
  }

  /**
   * Stops recording.
   */
  stop(): Promise<Blob> {
    this.recorder.state === 'recording' && this.recorder.stop();
    return this.promise;
  }
}