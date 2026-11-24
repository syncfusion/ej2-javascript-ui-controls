/**
 * Logical watermark attachment store (document → watermark).
 *
 * Kept separate from the owning module and the owning module so materialize can read
 * logical state without a circular import through the public barrel.
 *
 * @packageDocumentation
 */
import { WordDocument } from '../document/document';
import { Watermark } from './model';
/** Logical watermark attachment store (document → watermark). No package I/O. */
const documentWatermarks: WeakMap<WordDocument, Watermark> = new WeakMap<WordDocument, Watermark>();
/**
 * Read the logical watermark attached to a document.
 * Does not trigger lazy parse.
 *
 * @param {WordDocument} document - The document.
 * @returns {Watermark | undefined} The result.
 * @private
 */
export function logicalWatermarkOf(document: WordDocument): Watermark | undefined {
    return documentWatermarks.get(document);
}
/**
 * Attach or clear the logical watermark for a document (no package I/O).
 *
 * @param {WordDocument} document - The document.
 * @param {Watermark | undefined} value - The value.
 * @returns {void} Nothing is returned.
 * @private
 */
export function setLogicalWatermark(document: WordDocument, value: Watermark | undefined): void {
    if (value === undefined) {
        documentWatermarks.delete(document);
        return;
    }
    documentWatermarks.set(document, value);
}
/**
 * Clear logical watermark state for a single document.
 *
 * @param {WordDocument} document - The document.
 * @returns {void} Nothing is returned.
 * @private
 */
export function clearLogicalWatermark(document: WordDocument): void {
    documentWatermarks.delete(document);
}
