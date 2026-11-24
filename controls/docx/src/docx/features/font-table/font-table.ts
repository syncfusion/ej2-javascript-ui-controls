import { DocxError } from '../../core/errors/docx-error';
import { WordDocument, FeaturePartState } from '../document/document';
import { FeaturePackagePart } from '../document/feature-package-part';
import { elementChildren, isWml, wmlElement } from '../document/wml';
import { partName, PartName } from '../../core/opc/part-name';
import { PackagePart } from '../../core/opc/package';
import { featureId, registerFeature, registerFeaturePartHandler } from '../../core/registry/index';
import { FeaturePartLoadContext } from '../../core/registry/part-handlers';
import { parseXml, serializeXml, WML_TRANSITIONAL_NAMESPACE, NamespaceDeclaration, OpenXmlAttribute, OpenXmlChild, OpenXmlElement } from '../../core/xml/index';
import { createFontTableFont, parseFontTableFont, FontTableFont } from './font-table-entry';
import { FeatureId } from '../../core/registry/feature-registry';
const FONT_TABLE: FeatureId = featureId('font-table');
/**
 * @private
 * Transitional font table relationship (ECMA-376-4 §9.2.5). */
export const FONT_TABLE_RELATIONSHIP_TYPE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/fontTable';
/**
 * @private
 * Strict font table relationship (ECMA-376-1 §11.3.5). */
export const STRICT_FONT_TABLE_RELATIONSHIP_TYPE: string = 'http://purl.oclc.org/ooxml/officeDocument/relationships/fontTable';
/**
 * @private
 * ECMA-376-1 §11.3.5 Font Table content type. */
export const FONT_TABLE_CONTENT_TYPE: string = 'application/vnd.openxmlformats-officedocument.wordprocessingml.fontTable+xml';
/**
 * @private
 */
export const FONT_TABLE_PART_NAME: PartName = partName('/word/fontTable.xml');
const utf8Decoder: TextDecoder = new TextDecoder('utf-8');
const utf8Encoder: TextEncoder = new TextEncoder();
/**
 *  Locale-independent lower-case key for font name lookup.
 *
 * @param {string} name - The name.
 * @returns {string} The result.
 */
function fontLookupKey(name: string): string {
    return name.toLowerCase();
}
/**
 * In-memory Font Table part (`word/fontTable.xml`).
 *
 * Clean loads stay byte-preserving until the first mutation. Dirty serialize
 * rebuilds `w:fonts` from entry models + residual children (ECMA-376-1 §11.3.5 /
 * §17.8). Each `w:font` emits the `CT_Font` child sequence (altName through
 * embed slots) then residual unknown children.
 *
 * @private
 */
export class FontTablePart implements FeaturePackagePart {
    private bytes: Uint8Array | undefined;
    private dirty: boolean;
    private readonly fontEntries: FontTableFont[];
    private readonly rootExtrasBeforeFonts: OpenXmlElement[];
    private readonly rootExtrasAfterFonts: OpenXmlElement[];
    private readonly rootAttributes: OpenXmlAttribute[];
    private readonly rootNamespaceDeclarations: NamespaceDeclaration[];
    /**
     * @param {Uint8Array | undefined} bytes - The bytes.
     * @param {FontTableFont[]} fontEntries - The font entries.
     * @param {ReadonlyArray<OpenXmlElement>} rootExtrasBeforeFonts - The root extras before fonts.
     * @param {ReadonlyArray<OpenXmlElement>} rootExtrasAfterFonts - The root extras after fonts.
     * @param {ReadonlyArray<OpenXmlAttribute>} rootAttributes - The root attributes.
     * @param {ReadonlyArray<NamespaceDeclaration>} rootNamespaceDeclarations - The root namespace declarations.
     * @param {boolean} dirty - The dirty.
     * @private
     */
    constructor(
        bytes: Uint8Array | undefined,
        fontEntries: FontTableFont[],
        rootExtrasBeforeFonts: ReadonlyArray<OpenXmlElement>,
        rootExtrasAfterFonts: ReadonlyArray<OpenXmlElement>,
        rootAttributes: ReadonlyArray<OpenXmlAttribute>,
        rootNamespaceDeclarations: ReadonlyArray<NamespaceDeclaration>,
        dirty: boolean
    ) {
        this.bytes = bytes;
        this.fontEntries = fontEntries;
        this.rootExtrasBeforeFonts = [...rootExtrasBeforeFonts];
        this.rootExtrasAfterFonts = [...rootExtrasAfterFonts];
        this.rootAttributes = [...rootAttributes];
        this.rootNamespaceDeclarations =
            rootNamespaceDeclarations.length > 0
                ? [...rootNamespaceDeclarations]
                : [{ prefix: 'w', namespaceUri: WML_TRANSITIONAL_NAMESPACE }];
        this.dirty = dirty;
    }
    /**
     * Declared font names from `w:font/@w:name` in document order (stored casing).
     *
     * @returns {ReadonlyArray<string>} The result.
     * @public
     */
    fontNames(): ReadonlyArray<string> {
        return this.fontEntries.map((entry: FontTableFont) => entry.name);
    }
    /**
     * Whether a font name appears in the table (case-insensitive).
     *
     * @param {string} name - The name.
     * @returns {boolean} The result.
     * @public
     */
    hasFont(name: string): boolean {
        return this.font(name) !== undefined;
    }
    /**
     * Font table entries in document order.
     *
     * @returns {ReadonlyArray<FontTableFont>} The result.
     * @public
     */
    fonts(): ReadonlyArray<FontTableFont> {
        return this.fontEntries;
    }
    /**
     * Entry for `name`, or `undefined` when absent. Lookup is case-insensitive;
     * stored `@w:name` casing is unchanged.
     *
     * @param {string} name - The name.
     * @returns {FontTableFont | undefined} The result.
     * @public
     */
    font(name: string): FontTableFont | undefined {
        const key: string = fontLookupKey(name);
        return this.fontEntries.find((entry: FontTableFont) => fontLookupKey(entry.name) === key);
    }
    /**
     * Ensure a minimal `w:font/@w:name` row exists and return it.
     * If present (case-insensitive), returns the existing entry without duplicating.
     *
     * @param {string} name - The name.
     * @returns {FontTableFont} The result.
     * @throws DocxError `content/unsupported` when `name` is empty or whitespace-only.
     *
     * @public
     */
    appendFont(name: string): FontTableFont {
        const trimmed: string = name.trim();
        if (trimmed.length === 0) {
            throw new DocxError('content/unsupported', 'Font name must not be empty');
        }
        const existing: FontTableFont = this.font(trimmed);
        if (existing !== undefined) {
            return existing;
        }
        // Preserve caller casing (trimmed ends only).
        const created: FontTableFont = createFontTableFont(trimmed, () => {
            this.markDirty();
        });
        this.fontEntries.push(created);
        this.markDirty();
        return created;
    }
    /**
     * Declared substitute string for `name` (`w:altName/@w:val`), or `undefined`.
     * Case-insensitive name lookup. Does not create entries.
     *
     * Prefer {@link WordDocument.fontSubstitutionTable} `.get(name)` for substitution
     * workflows. This helper remains a thin catalog alias to
     * {@link FontTableFont.alternateName}.
     *
     * @param {string} name - The name.
     * @returns {string | undefined} The result.
     * @public
     */
    substituteFont(name: string): string | undefined {
        let ts330: any;
        return ((ts330 = this.font(name)), ts330 == null ? undefined : ts330.alternateName);
    }
    /**
     * @returns {boolean} The result.
     * @private
     */
    isDirty(): boolean {
        return this.dirty;
    }
    /**
     * @returns {void} Nothing is returned.
     * @private
     */
    markDirty(): void {
        this.dirty = true;
        this.bytes = undefined;
    }
    /**
     * @returns {Uint8Array} The result.
     * @private
     */
    serialize(): Uint8Array {
        if (!this.dirty) {
            if (this.bytes !== undefined) {
                return this.bytes;
            }
            return new Uint8Array(0);
        }
        const children: OpenXmlChild[] = [
            ...this.rootExtrasBeforeFonts,
            ...this.fontEntries.map((entry: FontTableFont) => entry.serialize()),
            ...this.rootExtrasAfterFonts
        ];
        const root: OpenXmlElement = wmlElement('fonts', {
            namespaceDeclarations: this.rootNamespaceDeclarations,
            attributes: this.rootAttributes,
            children
        });
        return utf8Encoder.encode(serializeXml(root));
    }
}
function parseFontTableRoot(root: OpenXmlElement, markDirty: () => void): {
    fontEntries: FontTableFont[];
    rootExtrasBeforeFonts: OpenXmlElement[];
    rootExtrasAfterFonts: OpenXmlElement[];
    rootAttributes: OpenXmlAttribute[];
    rootNamespaceDeclarations: NamespaceDeclaration[];
} {
    const fontEntries: FontTableFont[] = [];
    const rootExtrasBeforeFonts: OpenXmlElement[] = [];
    const rootExtrasAfterFonts: OpenXmlElement[] = [];
    let sawFont: boolean = false;
    for (const child of elementChildren(root)) {
        if (isWml(child, 'font')) {
            sawFont = true;
            const entry: FontTableFont = parseFontTableFont(child, markDirty);
            if (entry !== undefined) {
                fontEntries.push(entry);
            }
            continue;
        }
        if (sawFont) {
            rootExtrasAfterFonts.push(child);
        }
        else {
            rootExtrasBeforeFonts.push(child);
        }
    }
    return {
        fontEntries,
        rootExtrasBeforeFonts,
        rootExtrasAfterFonts,
        rootAttributes: [...root.attributes],
        rootNamespaceDeclarations: [...root.namespaceDeclarations]
    };
}
function loadFontTablePart(part: PackagePart | undefined): FontTablePart {
    if (part === undefined) {
        return new FontTablePart(undefined, [], [], [], [], [], false);
    }
    const root: OpenXmlElement = parseXml(utf8Decoder.decode(part.data));
    if (!isWml(root, 'fonts')) {
        return new FontTablePart(part.data, [], [], [], [], [], false);
    }
    // Entries close over this holder so markDirty works before/after construction.
    const holder: {
        part: FontTablePart | undefined;
    } = { part: undefined };
    const markDirty: () => void = (): void => {
        if (holder.part !== undefined) {
            holder.part.markDirty();
        }
    };
    const parsed: {
        fontEntries: FontTableFont[];
        rootExtrasBeforeFonts: OpenXmlElement[];
        rootExtrasAfterFonts: OpenXmlElement[];
        rootAttributes: OpenXmlAttribute[];
        rootNamespaceDeclarations: NamespaceDeclaration[];
    } = parseFontTableRoot(root, markDirty);
    const result: FontTablePart = new FontTablePart(
        part.data,
        parsed.fontEntries,
        parsed.rootExtrasBeforeFonts,
        parsed.rootExtrasAfterFonts,
        parsed.rootAttributes,
        parsed.rootNamespaceDeclarations,
        false
    );
    holder.part = result;
    return result;
}
let fontTableRegistered: boolean = false;
/**
 * @returns {void} Nothing is returned.
 * @private
 * Test hook
 */
export function resetFontTableFeatureForTests(): void {
    fontTableRegistered = false;
}
/**
 * @returns {void} Nothing is returned.
 * @private
 * Register the font table package-part handler. Idempotent.
 */
export function registerFontTableFeature(): void {
    if (fontTableRegistered) {
        return;
    }
    fontTableRegistered = true;
    registerFeature({ id: FONT_TABLE });
    registerFeaturePartHandler({
        featureId: FONT_TABLE,
        relationshipTypes: [FONT_TABLE_RELATIONSHIP_TYPE, STRICT_FONT_TABLE_RELATIONSHIP_TYPE],
        defaultRelativeTarget: 'fontTable.xml',
        partName: FONT_TABLE_PART_NAME,
        contentType: FONT_TABLE_CONTENT_TYPE,
        loadPart(part: PackagePart | undefined, ctx: FeaturePartLoadContext): FontTablePart {
            void ctx;
            return loadFontTablePart(part);
        }
    });
}
/**
 * Font table catalog for a document (`fontTable.xml` / `CT_FontsList`).
 *
 * **Public dual export:** Prefer {@link WordDocument.fontSubstitutionTable}
 * for alternate-name dictionary workflows (`get`/`set`/`delete`/`clear`/iteration).
 * Use `fontTableFor` only for the full catalog — panose, family, pitch, charset,
 * signature, embed relationship metadata, residual unknown markup, and
 * `appendFont` / `font` / `fonts`.
 *
 * When the feature is registered but no part is attached yet (for example
 * {@link WordDocument.create} before the handler ran at load, or registration after
 * load), attaches an empty not-dirty {@link FontTablePart} so authoring works
 * without a prior load of `fontTable.xml`.
 *
 * @param {WordDocument} document - The document.
 * @returns {FontTablePart} The result.
 * @throws DocxError `feature/not-registered` when a non-{@link FontTablePart}
 * value occupies the feature slot, or when the feature cannot be ensured.
 *
 * @private
 */
export function fontTableFor(document: WordDocument): FontTablePart {
    registerFontTableFeature();
    const existing: FeaturePartState = document.featurePart(FONT_TABLE);
    if (existing instanceof FontTablePart) {
        return existing;
    }
    if (existing !== undefined) {
        throw new DocxError('feature/not-registered', 'Font table part was not loaded; call registerFontTableFeature() or registerStylesFeature() before WordDocument.open');
    }
    // Absent only: empty catalog (not dirty). First mutation dirties and save emits the part.
    const empty: FontTablePart = new FontTablePart(undefined, [], [], [], [], [], false);
    document.setFeaturePart(FONT_TABLE, empty);
    return empty;
}

