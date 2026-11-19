export * from './font-substitution-table';
export * from './font-table-entry';
export * from './font-table';
/**
 * Font Table feature (`word/fontTable.xml`).
 *
 * Owns the declarative font catalog (`CT_FontsList` / `CT_Font`), including
 * `w:altName` substitution and typed metadata (`panose1`, `charset`, `family`,
 * `notTrueType`, `pitch`, `sig`, embed relationship slots). Binary ODTTF
 * authoring remains out of scope (ECMA-376-1 §11.3.5, §17.8).
 *
 * Public substitution entry: {@link WordDocument.fontSubstitutionTable}.
 *
 * @packageDocumentation
 */
import { WordDocument } from '../document/document';
import { FontSubstitutionTableImpl, FontSubstitutionTable } from './font-substitution-table';
import { fontTableFor, registerFontTableFeature, FontTablePart } from './font-table';
/** Stable `WordDocument` → substitution table identity (TASK-8066). */
const substitutionTables: WeakMap<WordDocument, FontSubstitutionTable> = new WeakMap<WordDocument, FontSubstitutionTable>();
/**
 * WordDocument-owned font substitution dictionary for `document`.
 *
 * Same object identity on every access for a given document. Backed by the
 * document’s {@link FontTablePart} (ensured on first access).
 *
 * @param {WordDocument} document - The document.
 * @returns {FontSubstitutionTable} The result.
 * @private
 * Prefer {@link WordDocument.fontSubstitutionTable}.
 */
export function fontSubstitutionTableFor(document: WordDocument): FontSubstitutionTable {
    registerFontTableFeature();
    const cached: FontSubstitutionTable = substitutionTables.get(document);
    if (cached !== undefined) {
        return cached;
    }
    const part: FontTablePart = fontTableFor(document);
    const table: FontSubstitutionTableImpl = new FontSubstitutionTableImpl(part);
    substitutionTables.set(document, table);
    return table;
}
Object.defineProperty(WordDocument.prototype, 'fontSubstitutionTable', {
    configurable: true,
    enumerable: false,
    get(this: WordDocument): FontSubstitutionTable {
        return fontSubstitutionTableFor(this);
    }
});
registerFontTableFeature();
