import { WordDocument } from '../document/document';
import { Picture } from './index';
/**
 * Owning-document contact point for inline-picture leaves. Authored pictures bind
 * their owning document at `appendImage`; loaded pictures bind during body parse
 * (module-level WeakMap, keyed by the picture instance).
 *
 * Kept free of fields/styles imports so always-on images registration can bind
 * hosts without pulling optional feature modules into the core bundle.
 */
const hostDocuments: WeakMap<Picture, WordDocument> = new WeakMap<Picture, WordDocument>();
/**
 * @param {Picture} picture - The picture.
 * @param {WordDocument} document - The document.
 * @returns {void} Nothing is returned.
 * @private
 * Bind a picture to its owning document (load + authoring paths).
 */
export function bindCaptionHostDocument(picture: Picture, document: WordDocument): void {
    hostDocuments.set(picture, document);
}
/**
 * @param {Picture} picture - The picture.
 * @returns {WordDocument | undefined} The result.
 * @private
 * Host document of a picture, when bound.
 */
export function hostDocumentOf(picture: Picture): WordDocument | undefined {
    return hostDocuments.get(picture);
}
