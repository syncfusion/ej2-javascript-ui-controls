/**
 * PdfWriter.ts class for EJ2-PDF
 */
import { StreamWriter } from '@syncfusion/ej2-file-utils';
import { PdfDocumentBase } from './../document/pdf-document-base';
import { IPdfWriter } from './../../interfaces/i-pdf-writer';
/**
 * Helper class for chunk buffer.
 * @private
 */
export class _PdfChunkBuffer {
  /**
   * Specifies the `chunks`.
   * @private
   */
  private chunks: Uint8Array[] = [];
  /**
   * Specifies the `current`.
   * @private
   */
  private current: Uint8Array;
  /**
   * Specifies the `offset`.
   * @private
   */
  private offset: number = 0;
  /**
   * Specifies the `committed`.
   * @private
   */
  private committed: number = 0;
  /**
   * Specifies the `chunkSize`.
   * @private
   */
  private readonly chunkSize: number;
  /**
   * Initialize an instance of `_PdfChunkBuffer` class.
   * @private
   */
  constructor(chunkSize: number = 1048576) {
    this.chunkSize = chunkSize;
    this.current = new Uint8Array(this.chunkSize);
    this.chunks.push(this.current);
  }
  /**
   * Gets the `length`.
   * @private
   */
  get length(): number {
    return this.committed + this.offset;
  }
  /**
   * Grows the buffer by allocating a new chunk.
   * @private
   */
  private grow(): void {
    this.committed += this.offset;
    this.current = new Uint8Array(this.chunkSize);
    this.chunks.push(this.current);
    this.offset = 0;
  }
  
  /**
   * Writes ASCII string as bytes (each charCodeAt masked to 0..255).
   * @private
   */
  writeAscii(str: string): void {
    let idx: number = 0;
    while (idx < str.length) {
      if (this.offset >= this.current.byteLength) {
        this.grow();
      }
      const space: number = this.current.byteLength - this.offset;
      const toWrite: number = Math.min(space, str.length - idx);
      for (let i: number = 0; i < toWrite; i++) {
        this.current[this.offset + i] = str.charCodeAt(idx + i) & 0xFF;
      }
      this.offset += toWrite;
      idx += toWrite;
    }
  }
  /**
   * Converts to `Uint8Array`.
   * @private
   */
  toUint8Array(): Uint8Array {
    const total: number = this.length;
    const out: Uint8Array = new Uint8Array(total);
    let pos: number = 0;
    const lastIdx: number = this.chunks.length - 1;
    for (let i: number = 0; i <= lastIdx; i++) {
      const chunk: Uint8Array = this.chunks[i];
      if (i === lastIdx) {
        out.set(chunk.subarray(0, this.offset), pos);
        pos += this.offset;
      } else {
        out.set(chunk, pos);
        pos += chunk.byteLength;
      }
    }
    return out;
  }
  /**
   * Destroys the array buffer.
   * @private
   */
  destroy(): void {
    this.chunks = [];
    this.current = undefined as any;
    this.offset = 0;
    this.committed = 0;
  }
}
/**
 * Used to `write a string` into output file.
 * @private
 */
export class PdfWriter implements IPdfWriter {
  /**
   * Specifies the `byteCountForStreamWriter`.
   * @private
   */
  private byteCountForStreamWriter: number = 0;
  /**
   * Specifies the parent `document`.
   * @private
   */
  private pdfDocument: PdfDocumentBase;
  /**
   * Specifies the `stream`.
   * @private
   */
  private streamWriter: StreamWriter | PdfWriterHelper;
  /**
   * Initialize an instance of `PdfWriter` class.
   * @private
   */
  constructor(stream: StreamWriter);
  /**
   * Initialize an instance of `PdfWriter` class.
   * @private
   */
  constructor(stream: PdfWriterHelper);
  constructor(stream: StreamWriter | PdfWriterHelper) {
    this.streamWriter = stream;
  }
  /**
   * Gets and Sets the `document`.
   * @private
   */
  public get document(): PdfDocumentBase {
    return this.pdfDocument;
  }
  public set document(value: PdfDocumentBase) {
    this.pdfDocument = value;
  }
  /**
   * Gets the `position`.
   * @private
   */
  public get position(): number {
    if (this.streamWriter instanceof PdfWriterHelper) {
      return this.streamWriter.buffer.size;
    }
    // For StreamWriter, we keep an internal count based on written characters
    return this.byteCountForStreamWriter;
  }
  /**
   * Gets  the `length` of the stream'.
   * @private
   */
  public get length(): number {
    return this.position;
  }
  /**
   * Gets the `stream`.
   * @private
   */
  public get stream(): StreamWriter | PdfWriterHelper {
    return this.streamWriter;
  }
  /**
   * `Writes the specified data`.
   * @private
   */
  write(data: string | number): void {
    if (typeof data === 'number') {
      data = String.fromCharCode(data);
    }
    if (this.streamWriter instanceof PdfWriterHelper) {
      this.streamWriter.write(data);
    } else {
      (this.streamWriter as StreamWriter).write(data);
      this.byteCountForStreamWriter += data.length;
    }
  }
}
/**
 * Helper class for PDF writer.
 * @private
 */
export class PdfWriterHelper {
  /**
   * Specifies the `buffer`.
   * @private
   */
  buffer: PdfArrayBuffer;
  /**
   * Initialize an instance of `PdfWriterHelper` class.
   * @private
   */
  constructor(chunkSize: number = 1048576) {
    this.buffer = new PdfArrayBuffer(chunkSize);
  }
  /**
   * Writes the specified data.
   * @private
   */
  write(data: string): void {
    this.buffer.write(data);
  }
  /**
   * Destroy the array buffer.
   * @private
   */
  destroy(): void {
    if (this.buffer) {
      this.buffer.destroy();
      this.buffer = undefined;
    }
  }
}
/**
 * Helper class for PDF writer.
 * @private
 */
export class PdfArrayBuffer {
  /**
   * Specifies the `buffer`.
   * @private
   */
  private buf: _PdfChunkBuffer;
  /**
   * Initialize an instance of `PdfArrayBuffer` class.
   * @private
   */
  constructor(chunkSize: number = 1048576) {
    this.buf = new _PdfChunkBuffer(chunkSize);
  }
  /**
   * Gets the `size`.
   * @private
   */
  get size(): number {
    return this.buf.length;
  }
  /**
   * Writes the specified data.
   * @private
   */
  write(value: string): void {
    this.buf.writeAscii(value);
  }
  /**
   * Converts to `Uint8Array`.
   * @private
   */
  toUint8Array(): Uint8Array {
    return this.buf.toUint8Array();
  }
  /**
   * Destroys the buffer.
   * @private
   */
  destroy(): void {
    if (this.buf) {
      this.buf.destroy();
      this.buf = undefined as any;
    }
  }
}