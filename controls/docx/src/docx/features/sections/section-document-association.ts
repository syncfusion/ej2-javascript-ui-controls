import { WordDocument } from '../document/document';

/**
 * Owning document for a {@link PageSetup} instance (even/odd headers via settings).
 * Soft association — does not imply package ownership of the properties object alone.
 *
 * Keyed by object identity with a structural type so this module does not import
 * `page-setup.ts` (avoids a circular dependency under TS 3.3).
 */
const pageSetupOwnerDocuments: WeakMap<object, WordDocument> = new WeakMap<object, WordDocument>();

/**
 * Record which document owns this page setup (for settings / header-footer bridges).
 *
 * @param {object} pageSetup - The page setup.
 * @param {WordDocument} document - The document.
 * @returns {void} Nothing is returned.
 * @private
 */
export function associatePageSetupDocument(
    pageSetup: object,
    document: WordDocument
): void {
    pageSetupOwnerDocuments.set(pageSetup, document);
}

/**
 * @param {object} pageSetup - The page setup.
 * @param {WordDocument} document - The document.
 * @returns {void} Nothing is returned.
 * @private
 * Bridge name kept while call sites migrate off `SectionProperties`.
 */
export function associateSectionPropertiesDocument(
    pageSetup: object,
    document: WordDocument
): void {
    associatePageSetupDocument(pageSetup, document);
}

/**
 * Document previously associated with this page setup, if any.
 *
 * @param {object} pageSetup - The page setup.
 * @returns {WordDocument | undefined} The result.
 * @private
 */
export function ownerDocumentOf(pageSetup: object): WordDocument | undefined {
    return pageSetupOwnerDocuments.get(pageSetup);
}
