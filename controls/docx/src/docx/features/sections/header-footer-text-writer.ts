import { WordDocument } from '../document/document';
import { HeaderFooterReferenceType, PageSetup } from './page-setup';

/**
 * Writer used by {@link unlinkFromPrevious} to give a section its own (empty) header or footer.
 *
 * Implemented by the headers-footers feature and installed when that feature is registered, so that
 * `sections` does not import `headers-footers` (the two modules would otherwise form a static
 * import cycle and the optional feature would become part of the core graph).
 *
 * @private
 */
export interface SectionHeaderFooterTextWriter {
    /**
     * Sets the header text of `section` for `refType`.
     *
     * @param {WordDocument} document - The owning document.
     * @param {PageSetup} section - The section page setup.
     * @param {string} text - The header text.
     * @param {HeaderFooterReferenceType} refType - The reference type.
     * @returns {void} Nothing is returned.
     */
    setSectionHeader(document: WordDocument, section: PageSetup, text: string, refType: HeaderFooterReferenceType): void;
    /**
     * Sets the footer text of `section` for `refType`.
     *
     * @param {WordDocument} document - The owning document.
     * @param {PageSetup} section - The section page setup.
     * @param {string} text - The footer text.
     * @param {HeaderFooterReferenceType} refType - The reference type.
     * @returns {void} Nothing is returned.
     */
    setSectionFooter(document: WordDocument, section: PageSetup, text: string, refType: HeaderFooterReferenceType): void;
}

let installedWriter: SectionHeaderFooterTextWriter | undefined;

/**
 * Installs the header/footer writer. Called by the headers-footers feature registration.
 *
 * @param {SectionHeaderFooterTextWriter} writer - The writer.
 * @returns {void} Nothing is returned.
 * @private
 */
export function installSectionHeaderFooterTextWriter(writer: SectionHeaderFooterTextWriter): void {
    installedWriter = writer;
}

/**
 * The installed writer, or `undefined` while the headers-footers feature is not registered.
 *
 * @returns {SectionHeaderFooterTextWriter | undefined} The writer.
 * @private
 */
export function installedSectionHeaderFooterTextWriter(): SectionHeaderFooterTextWriter | undefined {
    return installedWriter;
}
