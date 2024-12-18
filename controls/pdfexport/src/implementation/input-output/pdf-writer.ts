/**
 * PdfWriter.ts class for EJ2-PDF
 */
import { StreamWriter } from '@syncfusion/ej2-file-utils';
import { PdfDocumentBase } from './../document/pdf-document-base';
import { IPdfWriter } from './../../interfaces/i-pdf-writer';
import { IPdfPrimitive } from './../../interfaces/i-pdf-primitives';
/**
 * Used to `write a string` into output file.
 * @private
 */
export class PdfWriter implements IPdfWriter {
    /**
     * Specifies the current `position`.
     * @private
     */
    private currentPosition : number;
    /**
     * Specifies the `length` of the stream.
     * @private
     */
    private streamLength : number;
    /**
     * Check wheather the stream `can seek` or not.
     * @private
     */
    private cannotSeek : boolean;
    /**
     * Specifies the parent `document`.
     * @private
     */
    private pdfDocument : PdfDocumentBase;
    /**
     * Specifies the `stream`.
     * @private
     */
    private streamWriter : StreamWriter | PdfWriterHelper;
    /**
     * Initialize an instance of `PdfWriter` class.
     * @private
     */
    constructor(stream : StreamWriter)
    /**
     * Initialize an instance of `PdfWriter` class.
     * @private
     */
    constructor(stream : PdfWriterHelper)
    constructor(stream : StreamWriter | PdfWriterHelper) {
        this.streamWriter = stream;
    }
    //properties
    /**
     * Gets and Sets the `document`.
     * @private
     */
    public get document() : PdfDocumentBase {
        return this.pdfDocument;
    }
    public set document(value : PdfDocumentBase) {
        this.pdfDocument = value;
    }
    /**
     * Gets the `position`.
     * @private
     */
    public get position() : number {
        return this.streamWriter.buffer.size;
    }
    /**
     * Gets  the `length` of the stream'.
     * @private
     */
    public get length() : number {
        return this.streamWriter.buffer.size;
    }
    /**
     * Gets the `stream`.
     * @private
     */
    public get stream() : StreamWriter | PdfWriterHelper {
        return this.streamWriter;
    }
    //public Methods
    /**
     * `Writes the specified data`.
     * @private
     */
    public write(overload : IPdfPrimitive|number|string|number[]) : void {
        let data : number[] = [];
        let tempOverload : string = <string>overload;
        this.streamWriter.write(tempOverload);
    }
}
/**
 * Helper class for PDF writer.
 * @private
 */
export class PdfWriterHelper {
    buffer: PdfArrayBuffer;
    /**
     * Initialize an instance of `PdfWriterHelper` class.
     * @private
     */
    constructor() {
        this.buffer = new PdfArrayBuffer();
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
    buffer: number[];
    /**
     * Initialize an instance of `PdfArrayBuffer` class.
     * @private
     */
    constructor() {
        this.buffer = [];
    }
    /**
     * Gets the `size`.
     * @private
     */
    get size(): number {
        return this.buffer.length;
    }
    /**
     * Writes the specified data.
     * @private
     */
    write(value: string): void {
        for (let i: number = 0; i < value.length; i++) {
            this.buffer.push(value.charCodeAt(i) & 0xff);
        }
    }
    /**
     * Destroy the array buffer.
     * @private
     */
    destroy(): void {
        if (this.buffer) {
            this.buffer = [];
            this.buffer = undefined;
        }
    }
}