import { DocxError } from '../../core/errors/docx-error';
import { WordDocument, FeaturePartState } from '../document/document';
import { FeaturePackagePart } from '../document/feature-package-part';
import { partName, PartName } from '../../core/opc/part-name';
import { PackagePart } from '../../core/opc/package';
import { featureId, registerFeature, registerFeaturePartHandler } from '../../core/registry/index';
import { FeaturePartLoadContext } from '../../core/registry/part-handlers';
import { parseXml, OpenXmlElement } from '../../core/xml/index';
import { DEFAULT_OFFICE_THEME_XML } from './default-theme';
import { FeatureId } from '../../core/registry/feature-registry';
import { OpenXmlAttribute, OpenXmlChild } from '../../core/xml/model';
const THEME: FeatureId = featureId('theme');
const utf8: TextEncoder = new TextEncoder();
/**
 *  DrawingML Main namespace (ECMA-376-1 §14.2.7).
 *
 * @private
 */
export const DML_MAIN_NAMESPACE: string = 'http://schemas.openxmlformats.org/drawingml/2006/main';
/**
 *  Transitional theme relationship (ECMA-376-4 §12.2.7).
 *
 * @private
 */
export const THEME_RELATIONSHIP_TYPE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme';
/**
 *  Strict theme relationship (ECMA-376-1 §14.2.7).
 *
 * @private
 */
export const STRICT_THEME_RELATIONSHIP_TYPE: string = 'http://purl.oclc.org/ooxml/officeDocument/relationships/theme';
/**
 *  ECMA-376-1 §14.2.7 Theme part content type.
 *
 * @private
 */
export const THEME_CONTENT_TYPE: string = 'application/vnd.openxmlformats-officedocument.theme+xml';
/**
 * @private
 */
export const THEME_PART_NAME: PartName = partName('/word/theme/theme1.xml');
/**
 * @private
 */
const utf8Decoder: TextDecoder = new TextDecoder('utf-8');
/**
 * @private
 */
interface ThemeFontCollection {
    readonly latin: string | undefined;
    readonly ea: string | undefined;
    readonly cs: string | undefined;
}
/**
 * @private
 */
interface ThemeFontScheme {
    readonly major: ThemeFontCollection;
    readonly minor: ThemeFontCollection;
}
/**
 * @private
 */
interface ThemeMetadata {
    readonly name: string | undefined;
    readonly colorSchemeName: string | undefined;
    readonly fontSchemeName: string | undefined;
    readonly formatSchemeName: string | undefined;
    readonly fontScheme: ThemeFontScheme | undefined;
}
/** Theme font slot (`ST_Theme`, ECMA-376-1 §17.18.96).
 *
 * @private
 */
export type ThemeFontSlot = 'majorEastAsia' | 'majorBidi' | 'majorAscii' | 'majorHAnsi' | 'minorEastAsia' | 'minorBidi' | 'minorAscii' | 'minorHAnsi';
/**
 * @private
 */
const THEME_FONT_SLOTS: ReadonlyArray<ThemeFontSlot> = [
    'majorEastAsia',
    'majorBidi',
    'majorAscii',
    'majorHAnsi',
    'minorEastAsia',
    'minorBidi',
    'minorAscii',
    'minorHAnsi'
];
/**
 * @param {string | undefined} raw - The raw.
 * @returns {ThemeFontSlot | undefined} The result.
 * @private
 * Parse `ST_Theme` attribute value.
 */
export function parseThemeFontSlot(raw: string | undefined): ThemeFontSlot | undefined {
    if (raw === undefined) {
        return undefined;
    }
    // TS 3.3 / ES5 parity: avoid Array.prototype.includes.
    return THEME_FONT_SLOTS.indexOf(raw as ThemeFontSlot) !== -1 ? (raw as ThemeFontSlot) : undefined;
}
function parseFontCollection(element: OpenXmlElement): ThemeFontCollection {
    let latin: string | undefined;
    let ea: string | undefined;
    let cs: string | undefined;
    for (const child of childElements(element)) {
        if (isDml(child, 'latin')) {
            latin = dmlAttribute(child, 'typeface');
            continue;
        }
        if (isDml(child, 'ea')) {
            ea = dmlAttribute(child, 'typeface');
            continue;
        }
        if (isDml(child, 'cs')) {
            cs = dmlAttribute(child, 'typeface');
        }
    }
    return { latin, ea, cs };
}
function parseThemeFontScheme(root: OpenXmlElement): ThemeFontScheme | undefined {
    for (const child of childElements(root)) {
        if (!isDml(child, 'themeElements')) {
            continue;
        }
        let major: ThemeFontCollection | undefined;
        let minor: ThemeFontCollection | undefined;
        for (const scheme of childElements(child)) {
            if (isDml(scheme, 'fontScheme')) {
                for (const fontCollection of childElements(scheme)) {
                    if (isDml(fontCollection, 'majorFont')) {
                        major = parseFontCollection(fontCollection);
                    }
                    else if (isDml(fontCollection, 'minorFont')) {
                        minor = parseFontCollection(fontCollection);
                    }
                }
                break;
            }
        }
        if (major === undefined && minor === undefined) {
            return undefined;
        }
        return {
            major: major != null ? major : { latin: undefined, ea: undefined, cs: undefined },
            minor: minor != null ? minor : { latin: undefined, ea: undefined, cs: undefined }
        };
    }
    return undefined;
}
function typefaceForSlot(scheme: ThemeFontScheme, slot: ThemeFontSlot): string | undefined {
    switch (slot) {
    case 'majorAscii':
    case 'majorHAnsi':
        return scheme.major.latin;
    case 'minorAscii':
    case 'minorHAnsi':
        return scheme.minor.latin;
    case 'majorEastAsia':
        return scheme.major.ea;
    case 'minorEastAsia':
        return scheme.minor.ea;
    case 'majorBidi':
        return scheme.major.cs;
    case 'minorBidi':
        return scheme.minor.cs;
    }
}
function isDml(element: OpenXmlElement, localName: string): boolean {
    return element.localName === localName && element.namespaceUri === DML_MAIN_NAMESPACE;
}
function dmlAttribute(element: OpenXmlElement, localName: string): string | undefined {
    const found: OpenXmlAttribute = element.attributes.find((attribute: OpenXmlAttribute) => attribute.localName === localName &&
        (attribute.namespaceUri === DML_MAIN_NAMESPACE || attribute.namespaceUri === ''));
    return found == null ? undefined : found.value;
}
function childElements(element: OpenXmlElement): ReadonlyArray<OpenXmlElement> {
    return element.children.filter((child: OpenXmlChild): child is OpenXmlElement => child.kind === 'element');
}
function parseThemeMetadata(root: OpenXmlElement): ThemeMetadata | undefined {
    if (!isDml(root, 'theme')) {
        return undefined;
    }
    let colorSchemeName: string | undefined;
    let fontSchemeName: string | undefined;
    let formatSchemeName: string | undefined;
    for (const child of childElements(root)) {
        if (!isDml(child, 'themeElements')) {
            continue;
        }
        for (const scheme of childElements(child)) {
            if (isDml(scheme, 'clrScheme')) {
                colorSchemeName = dmlAttribute(scheme, 'name');
            }
            else if (isDml(scheme, 'fontScheme')) {
                fontSchemeName = dmlAttribute(scheme, 'name');
            }
            else if (isDml(scheme, 'fmtScheme')) {
                formatSchemeName = dmlAttribute(scheme, 'name');
            }
        }
        break;
    }
    return {
        name: dmlAttribute(root, 'name'),
        colorSchemeName,
        fontSchemeName,
        formatSchemeName,
        fontScheme: parseThemeFontScheme(root)
    };
}
function parseThemeMetadataFromBytes(bytes: Uint8Array): ThemeMetadata | undefined {
    const root: OpenXmlElement = parseXml(utf8Decoder.decode(bytes));
    return parseThemeMetadata(root);
}
/**
 * In-memory Theme part (`word/theme/theme1.xml`).
 *
 * When no Theme package part exists on load or {@link WordDocument.create}, the library
 * materializes a Word-proven default Office Theme (`dirty = true`) so save emits
 * `/word/theme/theme1.xml`. Existing package bytes are preserved when `dirty` is
 * false. Full typed theme editors remain out of scope (ADR D13).
 *
 * @private
 */
export class ThemePart implements FeaturePackagePart {
    private readonly bytes: Uint8Array | undefined;
    private readonly metadata: ThemeMetadata | undefined;
    private readonly dirty: boolean;
    /**
     * @param {Uint8Array | undefined} bytes - The bytes.
     * @param {ThemeMetadata | undefined} metadata - The metadata.
     * @param {boolean} dirty - The dirty.
     * @private
     */
    constructor(bytes: Uint8Array | undefined, metadata: ThemeMetadata | undefined, dirty: boolean) {
        this.bytes = bytes;
        this.metadata = metadata;
        this.dirty = dirty;
    }
    /**
     * `a:theme/@name`, or `undefined` when metadata could not be parsed.
     *
     * @returns {string | undefined} The result.
     * @public
     */
    name(): string | undefined {
        return this.metadata == null ? undefined : this.metadata.name;
    }
    /**
     * `a:themeElements/a:clrScheme/@name`, or `undefined` when absent.
     *
     * @returns {string | undefined} The result.
     * @public
     */
    colorSchemeName(): string | undefined {
        return this.metadata == null ? undefined : this.metadata.colorSchemeName;
    }
    /**
     * `a:themeElements/a:fontScheme/@name`, or `undefined` when absent.
     *
     * @returns {string | undefined} The result.
     * @public
     */
    fontSchemeName(): string | undefined {
        return this.metadata == null ? undefined : this.metadata.fontSchemeName;
    }
    /**
     * `a:themeElements/a:fmtScheme/@name`, or `undefined` when absent.
     *
     * @returns {string | undefined} The result.
     * @public
     */
    formatSchemeName(): string | undefined {
        return this.metadata == null ? undefined : this.metadata.formatSchemeName;
    }
    /**
     * Resolve a theme font slot to a typeface name from `a:fontScheme`.
     *
     * Returns `undefined` when the part, font scheme, or slot typeface is absent.
     *
     * @param {ThemeFontSlot} slot - The slot.
     * @returns {string | undefined} The result.
     * @public
     */
    typefaceFor(slot: ThemeFontSlot): string | undefined {
        const scheme: ThemeFontScheme = this.metadata == null ? undefined : this.metadata.fontScheme;
        if (scheme === undefined) {
            return undefined;
        }
        return typefaceForSlot(scheme, slot);
    }
    /**
     * @returns {boolean} The result.
     * @private
     */
    isDirty(): boolean {
        return this.dirty;
    }
    /**
     * @returns {Uint8Array} The result.
     * @private
     */
    serialize(): Uint8Array {
        if (this.bytes !== undefined) {
            return this.bytes;
        }
        return new Uint8Array(0);
    }
}
/**
 * Build the Word-proven default Office Theme part used when no Theme package
 * part exists (create path and load without theme). Evidence:
 * `input-documents/Sample_With_All_word_Element.docx` → `word/theme/theme1.xml`
 * (ECMA-376-1 §14.2.7). Marked dirty so save emits the part.
 *
 * @returns {ThemePart} The result.
 * @private
 */
export function createDefaultThemePart(): ThemePart {
    const bytes: Uint8Array = utf8.encode(DEFAULT_OFFICE_THEME_XML);
    const metadata: ThemeMetadata = parseThemeMetadataFromBytes(bytes);
    return new ThemePart(bytes, metadata, true);
}
function loadThemePart(part: PackagePart | undefined): ThemePart {
    if (part === undefined) {
        return createDefaultThemePart();
    }
    const metadata: ThemeMetadata = parseThemeMetadataFromBytes(part.data);
    return new ThemePart(part.data, metadata, false);
}
let themeRegistered: boolean = false;
/**
 * @returns {void} Nothing is returned.
 * @private
 * Test hook
 */
export function resetThemeFeatureForTests(): void {
    themeRegistered = false;
}
/**
 * @returns {void} Nothing is returned.
 * @private
 * Register the theme package-part handler. Idempotent.
 */
export function registerThemeFeature(): void {
    if (themeRegistered) {
        return;
    }
    themeRegistered = true;
    registerFeature({ id: THEME });
    registerFeaturePartHandler({
        featureId: THEME,
        relationshipTypes: [THEME_RELATIONSHIP_TYPE, STRICT_THEME_RELATIONSHIP_TYPE],
        defaultRelativeTarget: 'theme/theme1.xml',
        partName: THEME_PART_NAME,
        contentType: THEME_CONTENT_TYPE,
        loadPart(part: PackagePart | undefined, ctx: FeaturePartLoadContext): ThemePart {
            void ctx;
            return loadThemePart(part);
        }
    });
}
/**
 * Theme catalog for a document. Requires {@link registerStylesFeature} or
 * {@link registerThemeFeature}.
 *
 * @param {WordDocument} document - The document.
 * @returns {ThemePart} The result.
 * @throws DocxError `UNKNOWN_FEATURE` when the theme handler was not registered before load.
 * @private
 */
export function themeFor(document: WordDocument): ThemePart {
    registerThemeFeature();
    const part: FeaturePartState = document.featurePart(THEME);
    if (part === undefined || !(part instanceof ThemePart)) {
        throw new DocxError('feature/not-registered', 'Theme part was not loaded; call registerStylesFeature() before WordDocument.open');
    }
    return part;
}
