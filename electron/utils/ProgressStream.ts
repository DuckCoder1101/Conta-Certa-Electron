import { Transform, TransformCallback } from 'node:stream';

export class ProgressStream extends Transform {
  private readonly total: number;
  private readonly onProgress: (percent: number) => void;
  private loaded: number;

  constructor(total: number, onProgress: (percent: number) => void) {
    super();
    this.total = total;
    this.loaded = 0;
    this.onProgress = onProgress;
  }

  _transform(chunk: string, encoding: BufferEncoding, callback: TransformCallback) {
    this.loaded += chunk.length;

    const percent = chunk.length / this.total;
    this.onProgress(percent);

    callback(null, chunk);
  }
}
