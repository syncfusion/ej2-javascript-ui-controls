/**
 * `IPdfWriter.ts` interface for EJ2-PDF
 * Defines the basic interace of the various writers.
 * @private
 */
import { IPdfPrimitive } from './i-pdf-primitives';
import { PdfDocumentBase } from './../implementation/document/pdf-document-base';
export interface IPdfWriter {
    /**
     * Gets or sets the current `position` within the stream.
     * @private
     */
    position : number;
    /**
     * Stream `length`.
     * @private
     */
    length : number;
    /**
     * The `document` required for saving process.
     * @private
     */
    document : PdfDocumentBase;
    /**
     * `Writes` the specified data.
     * @private
     */
    write(overload : IPdfPrimitive|number|string) : void;
}