export * from './builtin-catalog';
export * from './builtin-resolver';
export * from './default-styles';
export * from './default-theme';
export * from './doc-defaults';
export * from './formatting-resolver';
export * from './latent-styles';
export * from './paragraph-properties';
export * from './run-properties';
export * from './style-base';
export * from './style-collection';
export * from './style-format-bridge';
export * from './style';
export * from './styles-with-effects';
export * from './table-style';
export * from './theme';
import { DocxError } from '../../core/errors/docx-error';
import { WordDocument, FeaturePartState } from '../document/document';
import { FeaturePackagePart } from '../document/feature-package-part';
import { Paragraph } from '../document/paragraph';
import { TextRange } from '../document/text-range';
import { elementChildren, isWml, wmlElement } from '../document/wml';
import { partName, PartName } from '../../core/opc/part-name';
import { PackagePart } from '../../core/opc/package';
import { featureId, isFeatureRegistered, registerFeature, registerFeatureMaterializeHandler, registerFeaturePartHandler, visitParagraphsInDocumentOrder } from '../../core/registry/index';
import { FeaturePartLoadContext } from '../../core/registry/part-handlers';
import { parseXml, serializeXml, WML_TRANSITIONAL_NAMESPACE, OpenXmlChild, OpenXmlElement } from '../../core/xml/index';
import { DocDefaults, parseDocDefaults } from './doc-defaults';
import { resolveReferencedStyle, resolveStyleForTarget, StyleLookupSurface } from './builtin-resolver';
import { StyleCollection, StyleCollectionHost } from './style-collection';
import { characterSnapshotToModeledRunProperties } from './style-format-bridge';
import { Style, ParagraphStyle, CharacterStyle, OpaqueStyle } from './style-base';
import {
    BuiltInStyle,
    BuiltinTableStyle,
    getBuiltinStyleTemplate,
    getBuiltinStyleTemplateByDisplayName,
    normalizeStyleName, BuiltinStyleTemplate
} from './builtin-catalog';
import { buildDefaultStylesArgs } from './default-styles';
import { registerFontTableFeature, resetFontTableFeatureForTests } from '../font-table/index';
import { resolveRunFormattingWithStyles, ResolvedRunFormatting } from './formatting-resolver';
import { LatentStyles, parseLatentStyles } from './latent-styles';
import { EMPTY_MODELED_PARAGRAPH_PROPERTIES, ModeledParagraphProperties } from './paragraph-properties';
import { EMPTY_MODELED_RUN_PROPERTIES, ModeledRunProperties } from './run-properties';
import { createMinimalDocxStyle, DocxStyle, DocxStyleType, parseDocxStyle } from './style';
import { registerStylesWithEffectsFeature, resetStylesWithEffectsFeatureForTests } from './styles-with-effects';
import {
    ConditionalFormattingStyle,
    ConditionalFormattingStyleCollection,
    ConditionalFormattingType,
    TableStyle,
    TableStyleCellProperties,
    TableStyleRowProperties,
    TableStyleTableProperties
} from './table-style';
import { registerThemeFeature, resetThemeFeatureForTests, ThemePart, themeFor } from './theme';
import { setStylesLookupFactory } from '../numbering/list-format';
import { ParagraphSpacing, ParagraphIndentation } from '../document/paragraph-format';
import { FeatureId } from '../../core/registry/feature-registry';
import { HeaderFooterKind } from '../document/headers-footers';

// Bridge stylesFor into ListFormat.applyStyle without extensionless CJS require (Vitest ESM).
setStylesLookupFactory((document: WordDocument) => stylesFor(document));
const STYLES: FeatureId = featureId('styles');
/**
 * @private
 * Transitional styles relationship (ECMA-376-4 §9.2.12). */
export const STYLES_RELATIONSHIP_TYPE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles';
/**
 * @private
 * Strict styles relationship (ECMA-376-1 §11.3.12). */
export const STRICT_STYLES_RELATIONSHIP_TYPE: string = 'http://purl.oclc.org/ooxml/officeDocument/relationships/styles';
/**
 * @private
 * ECMA-376-1 §11.3.12 Style Definitions content type. */
export const STYLES_CONTENT_TYPE: string = 'application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml';
/**
 * @private
 */
export const STYLES_PART_NAME: PartName = partName('/word/styles.xml');
const utf8Decoder: TextDecoder = new TextDecoder('utf-8');
const utf8: TextEncoder = new TextEncoder();
/**
 * In-memory Style Definitions part (`word/styles.xml`).
 *
 * Models `CT_Styles` as optional {@link DocDefaults}, optional {@link LatentStyles},
 * and an ordered list of {@link DocxStyle}. Serialize rebuilds the part from that
 * class graph (not an opaque XML bag). Unmodeled root children are retained in
 * document order relative to the three schema slots when dirty-path serialize runs.
 *
 * @private
 */
/**
 * In-memory Style Definitions part (`word/styles.xml`).
 *
 * Hosts package metadata (`docDefaults`, `latentStyles`, extras) and binds a
 * document-owned live {@link StyleCollection}. Transitional {@link DocxStyle}
 * lookups project from the live DOM with a stable shell cache so existing
 * resolver tests keep identity for getStyle.
 *
 * @private
 */
export class StylesPart implements FeaturePackagePart, StyleLookupSurface, StyleCollectionHost {
    private docDefaultsValue: DocDefaults | undefined;
    private latentStylesValue: LatentStyles | undefined;
    /** Unbound create/load shells until {@link bindLiveCollection}. */
    private shellList: DocxStyle[];
    private readonly shellById: Map<string, DocxStyle>;
    private collection: StyleCollection | undefined;
    /** Stable DocxStyle projection cache (cleared only on bindLiveCollection). */
    private readonly projectedById: Map<string, DocxStyle>;
    private readonly rootExtrasBeforeStyles: OpenXmlElement[];
    private readonly rootExtrasAfterStyles: OpenXmlElement[];
    private readonly pendingParagraphStyles: Set<string>;
    private readonly pendingCharacterStyles: Set<string>;
    private readonly pendingTableStyles: Set<string>;
    private dirty: boolean;
    /**
     * @param {DocDefaults | undefined} docDefaults - The doc defaults.
     * @param {LatentStyles | undefined} latentStyles - The latent styles.
     * @param {DocxStyle[]} styles - The styles.
     * @param {OpenXmlElement[]} rootExtrasBeforeStyles - The root extras before styles.
     * @param {OpenXmlElement[]} rootExtrasAfterStyles - The root extras after styles.
     * @param {boolean} dirty - The dirty.
     * @private
     */
    constructor(
        docDefaults: DocDefaults | undefined,
        latentStyles: LatentStyles | undefined,
        styles: DocxStyle[],
        rootExtrasBeforeStyles: OpenXmlElement[],
        rootExtrasAfterStyles: OpenXmlElement[],
        dirty: boolean
    ) {
        this.docDefaultsValue = docDefaults;
        this.latentStylesValue = latentStyles;
        this.shellList = [...styles];
        this.shellById = new Map();
        for (const style of this.shellList) {
            this.shellById.set(style.styleId, style);
        }
        this.collection = undefined;
        this.projectedById = new Map();
        this.rootExtrasBeforeStyles = rootExtrasBeforeStyles;
        this.rootExtrasAfterStyles = rootExtrasAfterStyles;
        this.pendingParagraphStyles = new Set();
        this.pendingCharacterStyles = new Set();
        this.pendingTableStyles = new Set();
        this.dirty = dirty;
    }
    /**
     * @returns {void} Nothing is returned.
     * @private
     * StyleCollectionHost: styles package dirty + invalidate DocxStyle projection cache.
     */
    markStylesDirty(): void {
        this.dirty = true;
        // Keep projectedById so DocxStyle identity stays stable across ensure of other styles.
    }
    /**
     * Drop a stable DocxStyle projection after the live style is removed.
     *
     * @param {string} styleId - The style id.
     * @returns {void} Nothing is returned.
     * @private
     */
    forgetProjectedStyle(styleId: string): void {
        this.projectedById.delete(styleId);
        this.shellById.delete(styleId);
        this.pendingParagraphStyles.delete(styleId);
        this.pendingCharacterStyles.delete(styleId);
        this.pendingTableStyles.delete(styleId);
        if (this.shellList.length > 0) {
            this.shellList = this.shellList.filter((shell: DocxStyle) => shell.styleId !== styleId);
        }
    }
    /**
     * Clear body (and header/footer when registered) content references to `styleId`
     * so save-time materialize cannot re-create a minimal stub.
     *
     * @param {WordDocument} document - The document.
     * @param {string} styleId - The style id.
     * @returns {void} Nothing is returned.
     * @private
     */
    purgeContentStyleReferences(document: WordDocument, styleId: string): void {
        purgeStyleReferencesInDocument(document, styleId);
    }
    /**
     * Bind the live StyleCollection and drain create/load shells into it.
     *
     * @param {StyleCollection} collection - The collection.
     * @returns {void} Nothing is returned.
     * @private
     */
    bindLiveCollection(collection: StyleCollection): void {
        if (this.collection === collection) {
            return;
        }
        this.collection = collection;
        if (this.shellList.length > 0) {
            const shells: DocxStyle[] = this.takeShells();
            collection.replaceFromDocxStyles(shells, false);
        }
        // Pending ids recorded before bind transfer into the live collection.
        const pendingParagraph: string[] = Array.from(this.pendingParagraphStyles);
        for (const text of pendingParagraph) {
            collection.registerPendingParagraphStyle(text);
        }
        this.pendingParagraphStyles.clear();
        const pendingCharacter: string[] = Array.from(this.pendingCharacterStyles);
        for (const text of pendingCharacter) {
            collection.registerPendingCharacterStyle(text);
        }
        this.pendingCharacterStyles.clear();
        const pendingTable: string[] = Array.from(this.pendingTableStyles);
        for (const text of pendingTable) {
            collection.registerPendingTableStyle(text);
        }
        this.pendingTableStyles.clear();
        this.projectedById.clear();
    }
    /**
     * Drain unbound DocxStyle shells (load/create path).
     *
     * @returns {DocxStyle[]} The result.
     * @private
     */
    takeShells(): DocxStyle[] {
        const shells: DocxStyle[] = this.shellList.slice();
        this.shellList = [];
        this.shellById.clear();
        return shells;
    }
    /**
     * Live styles collection when bound.
     *
     * @returns {StyleCollection | undefined} The result.
     * @private
     */
    liveCollection(): StyleCollection | undefined {
        return this.collection;
    }
    /**
     * Ordered style definitions as they appear under `w:styles`.
     * Projects live styles to DocxStyle shells when the collection is bound.
     *
     * @public
     */
    get styles(): ReadonlyArray<DocxStyle> {
        if (this.collection !== undefined) {
            const liveStyles: ReadonlyArray<Style> = this.collection.stylesInOrder();
            const out: DocxStyle[] = [];
            for (const live of liveStyles) {
                const styleId: string = live.styleId;
                let shell: DocxStyle = this.projectedById.get(styleId);
                if (shell === undefined) {
                    shell = this.collection.projectDocxStyle(styleId);
                    if (shell !== undefined) {
                        this.projectedById.set(styleId, shell);
                    }
                }
                if (shell !== undefined) {
                    out.push(shell);
                }
            }
            return out;
        }
        return this.shellList;
    }
    /**
     * WordDocument defaults (`w:docDefaults`), when present.
     *
     * @public
     */
    get docDefaults(): DocDefaults | undefined {
        return this.docDefaultsValue;
    }
    /**
     * Latent styles (`w:latentStyles`), when present.
     *
     * @public
     */
    get latentStyles(): LatentStyles | undefined {
        return this.latentStylesValue;
    }
    /**
     * Look up a style by `w:styleId` (DocxStyle projection; stable while clean).
     *
     * @param {string} styleId - The style id.
     * @returns {DocxStyle | undefined} The result.
     * @public
     */
    getStyle(styleId: string): DocxStyle | undefined {
        if (this.collection !== undefined) {
            const cached: DocxStyle = this.projectedById.get(styleId);
            if (cached !== undefined) {
                return cached;
            }
            const projected: DocxStyle = this.collection.projectDocxStyle(styleId);
            if (projected !== undefined) {
                this.projectedById.set(styleId, projected);
            }
            return projected;
        }
        return this.shellById.get(styleId);
    }
    /**
     *  Whether a style id exists in the catalog (including pending ensure).
     *
     * @param {string} styleId - The style id.
     * @returns {boolean} The result.
     */
    hasStyle(styleId: string): boolean {
        if (this.collection !== undefined) {
            return this.collection.hasStyle(styleId);
        }
        return (
            this.shellById.has(styleId) ||
            this.pendingParagraphStyles.has(styleId) ||
            this.pendingCharacterStyles.has(styleId) ||
            this.pendingTableStyles.has(styleId)
        );
    }
    /**
     * Modeled run properties from `w:docDefaults/w:rPrDefault/w:rPr`.
     *
     * @returns {ModeledRunProperties} The result.
     * @public
     */
    docDefaultsRunProperties(): ModeledRunProperties {
        const defaults: DocDefaults = this.docDefaultsValue;
        if (defaults === undefined) {
            return EMPTY_MODELED_RUN_PROPERTIES;
        }
        return defaults.runProperties();
    }
    /**
     * Modeled paragraph properties from `w:docDefaults/w:pPrDefault/w:pPr`.
     *
     * Spacing uses branded point `number` (twips). Absent markup is not filled
     * with create-path defaults on load.
     *
     * @returns {ModeledParagraphProperties} The result.
     * @public
     */
    docDefaultsParagraphProperties(): ModeledParagraphProperties {
        const defaults: DocDefaults = this.docDefaultsValue;
        if (defaults === undefined) {
            return EMPTY_MODELED_PARAGRAPH_PROPERTIES;
        }
        return defaults.paragraphProperties();
    }
    /**
     * Modeled `w:rPr` on a style definition, or `undefined` when the style is absent.
     *
     * @param {string} styleId - The style id.
     * @returns {ModeledRunProperties | undefined} The result.
     * @public
     */
    styleRunProperties(styleId: string): ModeledRunProperties | undefined {
        if (this.collection !== undefined) {
            const live: Style = this.collection.getStyle(styleId);
            if (live === undefined) {
                return undefined;
            }
            return characterSnapshotToModeledRunProperties(live.characterFormatSnapshot());
        }
        const style: DocxStyle = this.shellById.get(styleId);
        if (style === undefined) {
            return undefined;
        }
        return style.runProperties();
    }
    /**
     * `w:basedOn/@w:val` for a style id, or `undefined` when absent or unknown.
     *
     * @param {string} styleId - The style id.
     * @returns {string | undefined} The result.
     * @public
     */
    styleBasedOn(styleId: string): string | undefined {
        if (this.collection !== undefined) {
            const live: Style = this.collection.getStyle(styleId);
            if (live === undefined) {
                return undefined;
            }
            return live.basedOnId;
        }
        let ts332: any;
        return ((ts332 = this.shellById.get(styleId)), ts332 == null ? undefined : ts332.basedOn);
    }
    /**
     * Ensure a paragraph style exists, creating a minimal `CT_Style` when absent.
     *
     * @param {string} styleId - The style id.
     * @returns {void} Nothing is returned.
     */
    ensureParagraphStyle(styleId: string): void {
        if (this.collection !== undefined) {
            this.collection.ensureParagraphStyle(styleId);
            return;
        }
        this.ensureStyle(styleId, 'paragraph');
    }
    /**
     * Ensure a character style exists, creating a minimal `CT_Style` when absent.
     *
     * @param {string} styleId - The style id.
     * @returns {void} Nothing is returned.
     */
    ensureCharacterStyle(styleId: string): void {
        if (this.collection !== undefined) {
            this.collection.ensureCharacterStyle(styleId);
            return;
        }
        this.ensureStyle(styleId, 'character');
    }
    /**
     * Ensure a table style exists, creating a minimal `CT_Style` when absent.
     *
     * @param {string} styleId - The style id.
     * @returns {void} Nothing is returned.
     */
    ensureTableStyle(styleId: string): void {
        if (this.collection !== undefined) {
            this.collection.ensureTableStyle(styleId);
            return;
        }
        this.ensureStyle(styleId, 'table');
    }
    /**
     * @param {string} styleId - The style id.
     * @returns {void} Nothing is returned.
     * @private
     * Record a paragraph style reference before save.
     */
    registerPendingParagraphStyle(styleId: string): void {
        if (this.collection !== undefined) {
            this.collection.registerPendingParagraphStyle(styleId);
            return;
        }
        if (this.shellById.has(styleId)) {
            return;
        }
        this.pendingParagraphStyles.add(styleId);
    }
    /**
     * @param {string} styleId - The style id.
     * @returns {void} Nothing is returned.
     * @private
     * Record a character style reference before save.
     */
    registerPendingCharacterStyle(styleId: string): void {
        if (this.collection !== undefined) {
            this.collection.registerPendingCharacterStyle(styleId);
            return;
        }
        if (this.shellById.has(styleId)) {
            return;
        }
        this.pendingCharacterStyles.add(styleId);
    }
    /**
     * @param {string} styleId - The style id.
     * @returns {void} Nothing is returned.
     * @private
     * Record a table style reference before save.
     */
    registerPendingTableStyle(styleId: string): void {
        if (this.collection !== undefined) {
            this.collection.registerPendingTableStyle(styleId);
            return;
        }
        if (this.shellById.has(styleId)) {
            return;
        }
        this.pendingTableStyles.add(styleId);
    }
    /**
     * @param {WordDocument} document - The document.
     * @returns {void} Nothing is returned.
     * @private
     */
    materializePending(document: WordDocument): void {
        // Ensure live collection is bound before materialize so ensure/canonicalize
        // go through the single Styles DOM.
        styleCollectionFor(document);
        const collection: StyleCollection = this.collection;
        if (collection !== undefined) {
            visitParagraphsInDocumentOrder(document, (paragraph: Paragraph) => {
                const paragraphStyleId: string = paragraph.styleId;
                // Empty style id is invalid OOXML; skip rather than fail save.
                if (paragraphStyleId !== undefined && paragraphStyleId.length > 0 && !collection.hasStyle(paragraphStyleId)) {
                    collection.ensureParagraphStyle(paragraphStyleId);
                    const resolved: Style = collection.getStyle(paragraphStyleId);
                    if (resolved !== undefined && resolved.styleId !== paragraphStyleId) {
                        paragraph.styleId = resolved.styleId;
                    }
                }
                for (const inline of paragraph.items) {
                    if (!(inline instanceof TextRange)) {
                        continue;
                    }
                    const runStyleId: string = inline.characterFormat.characterStyle;
                    if (runStyleId !== undefined && runStyleId.length > 0 && !collection.hasStyle(runStyleId)) {
                        collection.ensureCharacterStyle(runStyleId);
                        const resolved: Style = collection.getStyle(runStyleId);
                        if (resolved !== undefined && resolved.styleId !== runStyleId) {
                            inline.characterFormat.characterStyle = resolved.styleId;
                        }
                    }
                }
            });
            visitTablesInDocumentOrder(document, (table: TableStyleMaterializeTarget) => {
                const tableStyleId: string = table.styleId;
                if (tableStyleId !== undefined && tableStyleId.length > 0 && !collection.hasStyle(tableStyleId)) {
                    collection.ensureTableStyle(tableStyleId);
                    const resolved: Style = collection.getStyle(tableStyleId);
                    if (resolved !== undefined && resolved.styleId !== tableStyleId) {
                        table.styleId = resolved.styleId;
                    }
                }
            });
            collection.materializePendingIds(
                (fromId: string, toId: string) => {
                    visitParagraphsInDocumentOrder(document, (paragraph: Paragraph) => {
                        if (paragraph.styleId === fromId) {
                            paragraph.styleId = toId;
                        }
                    });
                },
                (fromId: string, toId: string) => {
                    visitParagraphsInDocumentOrder(document, (paragraph: Paragraph) => {
                        for (const inline of paragraph.items) {
                            if (!(inline instanceof TextRange)) {
                                continue;
                            }
                            if (inline.characterFormat.characterStyle === fromId) {
                                inline.characterFormat.characterStyle = toId;
                            }
                        }
                    });
                },
                (fromId: string, toId: string) => {
                    visitTablesInDocumentOrder(document, (table: TableStyleMaterializeTarget) => {
                        if (table.styleId === fromId) {
                            table.styleId = toId;
                        }
                    });
                }
            );
            return;
        }
        visitParagraphsInDocumentOrder(document, (paragraph: Paragraph) => {
            const paragraphStyleId: string = paragraph.styleId;
            if (paragraphStyleId !== undefined && !this.shellById.has(paragraphStyleId)) {
                this.ensureStyle(paragraphStyleId, 'paragraph');
                this.pendingParagraphStyles.delete(paragraphStyleId);
                const resolved: DocxStyle = this.shellById.get(paragraphStyleId);
                if (resolved !== undefined && resolved.styleId !== paragraphStyleId) {
                    paragraph.styleId = resolved.styleId;
                }
            }
            for (const inline of paragraph.items) {
                if (!(inline instanceof TextRange)) {
                    continue;
                }
                const runStyleId: string = inline.characterFormat.characterStyle;
                if (runStyleId !== undefined && !this.shellById.has(runStyleId)) {
                    this.ensureStyle(runStyleId, 'character');
                    this.pendingCharacterStyles.delete(runStyleId);
                    const resolved: DocxStyle = this.shellById.get(runStyleId);
                    if (resolved !== undefined && resolved.styleId !== runStyleId) {
                        inline.characterFormat.characterStyle = resolved.styleId;
                    }
                }
            }
        });
        visitTablesInDocumentOrder(document, (table: TableStyleMaterializeTarget) => {
            const tableStyleId: string = table.styleId;
            if (tableStyleId !== undefined && !this.shellById.has(tableStyleId)) {
                this.ensureStyle(tableStyleId, 'table');
                this.pendingTableStyles.delete(tableStyleId);
                const resolved: DocxStyle = this.shellById.get(tableStyleId);
                if (resolved !== undefined && resolved.styleId !== tableStyleId) {
                    table.styleId = resolved.styleId;
                }
            }
        });
        this.pendingParagraphStyles.clear();
        this.pendingCharacterStyles.clear();
        this.pendingTableStyles.clear();
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
        const children: OpenXmlChild[] = [];
        if (this.docDefaultsValue !== undefined) {
            children.push(this.docDefaultsValue.serialize());
        }
        if (this.latentStylesValue !== undefined) {
            children.push(this.latentStylesValue.serialize());
        }
        children.push(...this.rootExtrasBeforeStyles);
        if (this.collection !== undefined) {
            const liveStyles: ReadonlyArray<Style> = this.collection.stylesInOrder();
            for (const style of liveStyles) {
                children.push(style.serialize());
            }
        }
        else {
            for (const style of this.shellList) {
                children.push(style.serialize());
            }
        }
        children.push(...this.rootExtrasAfterStyles);
        const root: OpenXmlElement = wmlElement('styles', {
            namespaceDeclarations: [{ prefix: 'w', namespaceUri: WML_TRANSITIONAL_NAMESPACE }],
            children
        });
        return utf8.encode(serializeXml(root));
    }
    private ensureStyle(styleId: string, type: 'paragraph' | 'character' | 'table'): void {
        if (styleId.length === 0) {
            throw new DocxError('content/invalid-style-id', 'Style id must not be empty');
        }
        if (this.shellById.has(styleId)) {
            return;
        }
        // Resolver: document-first, catalog-second (complete built-in
        // definition), unknown preserved as a save-time dangling reference
        // (round-trip; never a minimal stub).
        const resolved: DocxStyle = resolveReferencedStyle(this, styleId, type);
        if (resolved === undefined) {
            const created: DocxStyle = createMinimalDocxStyle(styleId, type);
            this.shellList.push(created);
            this.shellById.set(styleId, created);
            this.markStylesDirty();
        }
    }
    /**
     * @param {string} name - The name.
     * @returns {DocxStyle | undefined} The result.
     * @private
     * Style-collection surface for the built-in resolver.
     */
    findStyleByDisplayName(name: string): DocxStyle | undefined {
        if (this.collection !== undefined) {
            const live: Style = this.collection.findByName(name);
            if (live === undefined) {
                return undefined;
            }
            const cached: DocxStyle = this.projectedById.get(live.styleId);
            if (cached !== undefined) {
                return cached;
            }
            const projected: DocxStyle = this.collection.projectDocxStyle(live.styleId);
            if (projected !== undefined) {
                this.projectedById.set(live.styleId, projected);
            }
            return projected;
        }
        const normalized: string = normalizeStyleName(name);
        if (normalized.length === 0) {
            return undefined;
        }
        return this.shellList.find((style: DocxStyle) => {
            const styleName: string = style.name;
            return styleName !== undefined && normalizeStyleName(styleName) === normalized;
        });
    }
    /**
     * @param {DocxStyle} style - The style.
     * @returns {void} Nothing is returned.
     * @private
     * Style-collection surface for the built-in resolver.
     */
    addStyle(style: DocxStyle): void {
        if (this.collection !== undefined) {
            if (this.collection.getStyle(style.styleId) !== undefined) {
                return;
            }
            // Live collection accepts Style; hydrate shell via replace path entry.
            this.collection.hydrateFromDocxStyles([style], true);
            this.projectedById.delete(style.styleId);
            return;
        }
        if (this.shellById.has(style.styleId)) {
            return;
        }
        this.shellList.push(style);
        this.shellById.set(style.styleId, style);
        this.markStylesDirty();
    }
}

const styleCollections: WeakMap<WordDocument, StyleCollection> = new WeakMap<WordDocument, StyleCollection>();

/**
 * Bind or reuse the document-owned live StyleCollection on a styles part.
 *
 * @param {WordDocument} document - The document.
 * @param {StylesPart} part - The part.
 * @returns {StyleCollection} The result.
 * @private
 */
function ensureLiveStyleCollection(document: WordDocument, part: StylesPart): StyleCollection {
    const bound: StyleCollection = part.liveCollection();
    if (bound !== undefined) {
        styleCollections.set(document, bound);
        return bound;
    }
    let collection: StyleCollection = styleCollections.get(document);
    if (collection === undefined) {
        collection = new StyleCollection(document, part);
        styleCollections.set(document, collection);
    }
    part.bindLiveCollection(collection);
    return collection;
}

/**
 * Document-owned live StyleCollection. Stable identity per document.
 *
 * @param {WordDocument} document - The document.
 * @returns {StyleCollection} The result.
 * @private
 */
export function styleCollectionFor(document: WordDocument): StyleCollection {
    registerStylesFeature();
    return ensureLiveStyleCollection(document, stylesPartFor(document));
}

/**
 * Raw styles package part (no bind). Used by styleCollectionFor to avoid recursion.
 *
 * @param {WordDocument} document - The document.
 * @returns {StylesPart} The result.
 * @private
 */
function stylesPartFor(document: WordDocument): StylesPart {
    const part: FeaturePartState = document.featurePart(STYLES);
    if (part === undefined || !(part instanceof StylesPart)) {
        throw new DocxError('feature/not-registered', 'Styles part was not loaded; call registerStylesFeature() before WordDocument.open');
    }
    return part;
}

function parseStylesRoot(root: OpenXmlElement): {
    docDefaults: DocDefaults | undefined;
    latentStyles: LatentStyles | undefined;
    styles: DocxStyle[];
    rootExtrasBeforeStyles: OpenXmlElement[];
    rootExtrasAfterStyles: OpenXmlElement[];
} {
    let docDefaults: DocDefaults | undefined;
    let latentStyles: LatentStyles | undefined;
    const styles: DocxStyle[] = [];
    const rootExtrasBeforeStyles: OpenXmlElement[] = [];
    const rootExtrasAfterStyles: OpenXmlElement[] = [];
    let sawStyle: boolean = false;
    for (const child of elementChildren(root)) {
        if (isWml(child, 'docDefaults') && docDefaults === undefined) {
            docDefaults = parseDocDefaults(child);
            continue;
        }
        if (isWml(child, 'latentStyles') && latentStyles === undefined) {
            latentStyles = parseLatentStyles(child);
            continue;
        }
        if (isWml(child, 'style')) {
            sawStyle = true;
            const style: DocxStyle = parseDocxStyle(child);
            if (style !== undefined) {
                styles.push(style);
            }
            continue;
        }
        if (sawStyle) {
            rootExtrasAfterStyles.push(child);
        }
        else {
            rootExtrasBeforeStyles.push(child);
        }
    }
    return { docDefaults, latentStyles, styles, rootExtrasBeforeStyles, rootExtrasAfterStyles };
}
function loadStylesPart(part: PackagePart | undefined): StylesPart {
    if (part === undefined) {
        const { docDefaults, styles } = buildDefaultStylesArgs();
        return new StylesPart(docDefaults, undefined, styles, [], [], true);
    }
    const root: OpenXmlElement = parseXml(utf8Decoder.decode(part.data));
    if (!isWml(root, 'styles')) {
        return new StylesPart(undefined, undefined, [], [], [], false);
    }
    const parsed: {
        docDefaults: DocDefaults;
        latentStyles: LatentStyles;
        styles: DocxStyle[];
        rootExtrasBeforeStyles: OpenXmlElement[];
        rootExtrasAfterStyles: OpenXmlElement[];
    } = parseStylesRoot(root);
    return new StylesPart(
        parsed.docDefaults,
        parsed.latentStyles,
        parsed.styles,
        parsed.rootExtrasBeforeStyles,
        parsed.rootExtrasAfterStyles,
        false
    );
}
let registered: boolean = false;
/**
 * @returns {void} Nothing is returned.
 * @private
 * Test hook
 */
export function resetStylesFeatureForTests(): void {
    registered = false;
    resetThemeFeatureForTests();
    resetFontTableFeatureForTests();
    resetStylesWithEffectsFeatureForTests();
}
/**
 * @returns {void} Nothing is returned.
 * @private
 * Register the styles, theme, and font table package-part handlers. Idempotent.
 */
export function registerStylesFeature(): void {
    if (registered) {
        return;
    }
    registered = true;
    registerThemeFeature();
    registerFontTableFeature();
    registerStylesWithEffectsFeature();
    registerFeature({ id: STYLES });
    registerFeaturePartHandler({
        featureId: STYLES,
        relationshipTypes: [STYLES_RELATIONSHIP_TYPE, STRICT_STYLES_RELATIONSHIP_TYPE],
        defaultRelativeTarget: 'styles.xml',
        partName: STYLES_PART_NAME,
        contentType: STYLES_CONTENT_TYPE,
        loadPart(part: PackagePart | undefined, ctx: FeaturePartLoadContext): StylesPart {
            void ctx;
            return loadStylesPart(part);
        }
    });
    registerFeatureMaterializeHandler({
        featureId: STYLES,
        materialize(document: WordDocument): void {
            const part: FeaturePartState = document.featurePart(STYLES);
            if (part instanceof StylesPart) {
                part.materializePending(document);
            }
        }
    });
}
/**
 * Styles catalog for a document. Requires {@link registerStylesFeature}.
 *
 * @param {WordDocument} document - The document.
 * @returns {StylesPart} The result.
 * @throws DocxError `UNKNOWN_FEATURE` when the styles module was not registered before load.
 * @private
 */
export function stylesFor(document: WordDocument): StylesPart {
    const part: StylesPart = stylesPartFor(document);
    ensureLiveStyleCollection(document, part);
    return part;
}
/**
 * Assign a run character style id and ensure a matching style definition exists.
 *
 * Unknown styles throw `styles/undefined-style` (spec §5.2).
 *
 * @param {WordDocument} document - The document.
 * @param {TextRange} run - The run.
 * @param {string} styleId - The style id.
 * @returns {void} Nothing is returned.
 * @private
 */
export function assignRunStyle(document: WordDocument, run: TextRange, styleId: string): void {
    const styles: StylesPart = stylesFor(document);
    const resolved: DocxStyle = resolveStyleForTarget(styles, styleId, 'character');
    run.characterFormat.characterStyle = resolved.styleId;
}
/**
 * Resolve effective bold, italic, font size, and font names for a run in a paragraph.
 *
 * Requires {@link registerStylesFeature} before {@link WordDocument.open}.
 *
 * @param {WordDocument} document - The document.
 * @param {Paragraph} paragraph - The paragraph.
 * @param {TextRange} run - The run.
 * @returns {ResolvedRunFormatting} The result.
 * @private
 */
export function resolveRunFormatting(document: WordDocument, paragraph: Paragraph, run: TextRange): ResolvedRunFormatting {
    // Package-absent Theme is materialized as a dirty default for save emit only
    // (theme.ts). Font-slot resolution requires a package-backed Theme part; dirty
    // defaults leave asciiTheme/hAnsiTheme slots unresolved (formatting-resolver-theme AC).
    const theme: ThemePart = themeFor(document);
    return resolveRunFormattingWithStyles(
        stylesFor(document),
        paragraph,
        run,
        theme.isDirty() ? undefined : theme
    );
}
/**
 * Apply a built-in or custom style by style id or display name.
 *
 * - Paragraph styles write `w:pPr/w:pStyle` via {@link Paragraph.styleId}
 *   only — format properties are not copied onto the paragraph.
 * - Character styles (built-in or custom) update DOM state only:
 *   {@link Paragraph.breakCharacterFormat}.characterStyle and each existing
 *   {@link TextRange}.characterFormat.characterStyle. Serialization reflects
 *   that DOM (`w:pPr/w:rPr/w:rStyle` and run `w:rPr/w:rStyle`). Does **not**
 *   set {@link Paragraph.styleId}.
 *
 * Type validation remains in {@link resolveStyleForTarget}.
 *
 * @param {Paragraph} this - The this.
 * @param {string | BuiltInStyle} style - Style id string or {@link BuiltInStyle} constant.
 * @returns {void} Nothing is returned.
 * @public
 */
Paragraph.prototype.applyStyle = function applyStyle(this: Paragraph, style: string | BuiltInStyle): void {
    const requested: string = typeof style === 'string' ? style : style;
    const styles: StylesPart = stylesFor(this.owningDocument());
    const target: DocxStyleType = resolveApplyStyleTarget(styles, requested);
    const resolved: DocxStyle = resolveStyleForTarget(styles, requested, target);
    if (target === 'character') {
        const styleId: string = resolved.styleId;
        this.breakCharacterFormat.characterStyle = styleId;
        for (const inline of this.items) {
            if (inline instanceof TextRange) {
                inline.characterFormat.characterStyle = styleId;
            }
        }
        return;
    }
    this.styleId = resolved.styleId;
};

/**
 * Decide whether {@link Paragraph.applyStyle} should resolve as paragraph or
 * character. Prefers an existing document style (by id, then display name);
 * otherwise uses the built-in catalog type. Defaults to paragraph so unknown
 * and table-typed names keep prior invalid-type / undefined-style behavior.
 *
 * @param {StyleLookupSurface} styles - The styles.
 * @param {string} nameOrId - The name or id.
 * @returns {DocxStyleType} The result.
 * @private
 */
function resolveApplyStyleTarget(styles: StyleLookupSurface, nameOrId: string): DocxStyleType {
    const byId: DocxStyle = styles.getStyle(nameOrId);
    const existing: DocxStyle =
        byId !== undefined ? byId : styles.findStyleByDisplayName(nameOrId);
    if (existing !== undefined) {
        return existing.type === 'character' ? 'character' : 'paragraph';
    }
    const byName: BuiltinStyleTemplate = getBuiltinStyleTemplate(nameOrId);
    const template: BuiltinStyleTemplate =
        byName !== undefined ? byName : getBuiltinStyleTemplateByDisplayName(nameOrId);
    if (template !== undefined && template.type === 'character') {
        return 'character';
    }
    return 'paragraph';
}

/**
 * Read a direct (non-effective) character-format slot from a Style facade without
 * triggering paragraph effective resolution.
 *
 * @param {Object} format - The format.
 * @param {string} key - The key.
 * @returns {unknown} The result.
 * @private
 */
function directCharacterSlot(format: { [key: string]: unknown } | undefined, key: string): unknown {
    if (format === undefined) {
        return undefined;
    }
    // Access private *Value fields via snapshot for reliable authored detection.
    // Prefer public getters: Style-hosted CF has no resolveEffective* so getters are direct.
    switch (key) {
    case 'bold': return (format as any).bold;
    case 'italic': return (format as any).italic;
    case 'strikethrough': return (format as any).strikethrough;
    case 'doubleStrikethrough': return (format as any).doubleStrikethrough;
    case 'allCaps': return (format as any).allCaps;
    case 'smallCaps': return (format as any).smallCaps;
    case 'hidden': return (format as any).hidden;
    case 'emboss': return (format as any).emboss;
    case 'engrave': return (format as any).engrave;
    case 'outline': return (format as any).outline;
    case 'shadow': return (format as any).shadow;
    case 'noProof': return (format as any).noProof;
    case 'webHidden': return (format as any).webHidden;
    case 'fontSize': return (format as any).fontSize;
    case 'fontName': return (format as any).fontName;
    case 'fontNameAscii': return (format as any).fontNameAscii;
    case 'fontNameNonFarEast': return (format as any).fontNameNonFarEast;
    case 'fontNameFarEast': return (format as any).fontNameFarEast;
    case 'fontNameBidi': return (format as any).fontNameBidi;
    case 'underlineStyle': return (format as any).underlineStyle;
    case 'underlineColor': return (format as any).underlineColor;
    case 'textColor': return (format as any).textColor;
    case 'highlightColor': return (format as any).highlightColor;
    case 'textBackgroundColor': return (format as any).textBackgroundColor;
    case 'subSuperScript': return (format as any).subSuperScript;
    case 'characterSpacing': return (format as any).characterSpacing;
    case 'position': return (format as any).position;
    case 'kerning': return (format as any).kerning;
    case 'scaling': return (format as any).scaling;
    case 'boldBidi': return (format as any).boldBidi;
    case 'italicBidi': return (format as any).italicBidi;
    case 'fontSizeBidi': return (format as any).fontSizeBidi;
    case 'localeId': return (format as any).localeId;
    case 'localeIdBidi': return (format as any).localeIdBidi;
    case 'localeIdFarEast': return (format as any).localeIdFarEast;
    default: return undefined;
    }
}

function directParagraphSlot(format: { [key: string]: unknown } | undefined, key: string): unknown {
    if (format === undefined) {
        return undefined;
    }
    switch (key) {
    case 'horizontalAlignment': return (format as any).horizontalAlignment;
    case 'keepFollow': return (format as any).keepFollow;
    case 'keepLines': return (format as any).keepLines;
    case 'pageBreakBefore': return (format as any).pageBreakBefore;
    case 'pageBreakAfter': return (format as any).pageBreakAfter;
    case 'widowControl': return (format as any).widowControl;
    case 'bidi': return (format as any).bidi;
    case 'outlineLevel': return (format as any).outlineLevel;
    case 'leftIndent': return (format as any).leftIndent;
    case 'rightIndent': return (format as any).rightIndent;
    case 'firstLineIndent': return (format as any).firstLineIndent;
    case 'beforeSpacing': return (format as any).beforeSpacing;
    case 'afterSpacing': return (format as any).afterSpacing;
    case 'beforeAutospacing': return (format as any).beforeAutospacing;
    case 'afterAutospacing': return (format as any).afterAutospacing;
    case 'beforeLines': return (format as any).beforeLines;
    case 'afterLines': return (format as any).afterLines;
    case 'lineSpacing': return (format as any).lineSpacing;
    case 'lineSpacingRule': return (format as any).lineSpacingRule;
    case 'lineSpacingCount': return (format as any).lineSpacingCount;
    case 'tabStops': return (format as any).tabStops;
    case 'borders': {
        const pf: { readBordersBag?: () => unknown; borders?: unknown; } = format as { readBordersBag?: () => unknown; borders?: unknown };
        if (typeof pf.readBordersBag === 'function') {
            return pf.readBordersBag();
        }
        return pf.borders;
    }
    case 'backColor': return (format as any).backColor;
    case 'foreColor': return (format as any).foreColor;
    case 'contextualSpacing': return (format as any).contextualSpacing;
    case 'mirrorIndents': return (format as any).mirrorIndents;
    default: return undefined;
    }
}

function modeledRunSlot(props: ModeledRunProperties, key: string): unknown {
    switch (key) {
    case 'bold': return props.bold;
    case 'boldBidi': return props.boldCs;
    case 'italic': return props.italic;
    case 'italicBidi': return props.italicCs;
    case 'fontSize': return props.fontSize;
    case 'fontSizeBidi': return props.fontSizeCs;
    case 'kerning': return props.kerning;
    case 'fontName': return props.asciiFont !== undefined ? props.asciiFont : props.hAnsiFont;
    case 'fontNameAscii': return props.asciiFont;
    case 'fontNameNonFarEast': return props.hAnsiFont;
    case 'fontNameFarEast': return props.eastAsiaFont;
    case 'fontNameBidi': return props.csFont;
    case 'textColor': return props.color; // wire hex; CF getter maps Color — leave for CF path only when Color
    default: return undefined;
    }
}

function modeledParagraphSlot(props: ModeledParagraphProperties, key: string): unknown {
    const spacing: ParagraphSpacing = props.spacing;
    const indentation: ParagraphIndentation = props.indentation;
    switch (key) {
    case 'keepFollow': return props.keepNext;
    case 'keepLines': return props.keepLines;
    case 'pageBreakBefore': return props.pageBreakBefore;
    case 'widowControl': return props.widowControl;
    case 'contextualSpacing': return props.contextualSpacing;
    case 'outlineLevel': return props.outlineLevel;
    case 'beforeSpacing': return spacing === undefined ? undefined : spacing.before;
    case 'afterSpacing': return spacing === undefined ? undefined : spacing.after;
    case 'lineSpacing': return spacing === undefined ? undefined : (spacing.lineSpacing !== undefined ? spacing.lineSpacing : spacing.line);
    case 'lineSpacingRule': return spacing === undefined ? undefined : spacing.lineRule;
    case 'leftIndent': return indentation === undefined ? undefined : indentation.left;
    case 'rightIndent': return indentation === undefined ? undefined : indentation.right;
    case 'firstLineIndent': {
        if (indentation === undefined) { return undefined; }
        if (indentation.firstLine !== undefined) { return indentation.firstLine; }
        if (indentation.hanging !== undefined) { return -indentation.hanging; }
        return undefined;
    }
    default: return undefined;
    }
}

const CF_BOOL_DEFAULT_FALSE: Set<string> = new Set([
    'bold', 'italic', 'strikethrough', 'doubleStrikethrough', 'allCaps', 'smallCaps',
    'hidden', 'emboss', 'engrave', 'outline', 'shadow', 'noProof', 'webHidden',
    'boldBidi', 'italicBidi'
]);

/**
 * Effective break-character value for a paragraph (style chain → docDefaults → API default).
 *
 * @param {Paragraph} this - The this.
 * @param {string} key - The key.
 * @returns {unknown} The result.
 * @private
 */
Paragraph.prototype.resolveEffectiveCharacterValue = function resolveEffectiveCharacterValue(this: Paragraph, key: string): unknown {
    try {
        const document: WordDocument = this.owningDocument();
        const styles: StylesPart = stylesFor(document);
        const collection: StyleCollection = styleCollectionFor(document);
        const seen: Set<string> = new Set<string>();
        let styleId: string = this.styleId;
        while (styleId !== undefined && styleId !== '' && !seen.has(styleId)) {
            seen.add(styleId);
            const live: Style = collection.getStyle(styleId);
            if (live !== undefined) {
                const slot: unknown = directCharacterSlot(live.characterFormat as unknown as { [key: string]: unknown }, key);
                if (slot !== undefined) {
                    return slot;
                }
                const base: Style = live.baseStyle;
                styleId = base === undefined ? undefined : base.styleId;
                continue;
            }
            // unresolved id — stop style walk
            break;
        }
        const docRun: ModeledRunProperties = styles.docDefaultsRunProperties();
        const fromDoc: unknown = modeledRunSlot(docRun, key);
        if (fromDoc !== undefined) {
            // textColor from modeled is wire hex string — CharacterFormat expects Color enum on public get.
            // Only return modeled colors for keys that CF effective path knows how to map; skip textColor wire here.
            if (key === 'textColor') {
                // leave to API default path below (Transparent) unless we can map — skip hex
            } else {
                return fromDoc;
            }
        }
    } catch {
        // detached — fall through
    }
    // Direct CF getters treat unset as `undefined` (DocIO-style).
    // Layout/effective consumers apply CHARACTER_FORMAT_DEFAULTS themselves.
    if (key === 'textColor' || key === 'textBackgroundColor' || key === 'underlineColor' || key === 'highlightColor') {
        return undefined;
    }
    return undefined;
};

/**
 * Effective paragraph-format value (style chain → docDefaults → API default).
 *
 * @param {Paragraph} this - The this.
 * @param {string} key - The key.
 * @returns {unknown} The result.
 * @private
 */
Paragraph.prototype.resolveEffectiveParagraphValue = function resolveEffectiveParagraphValue(this: Paragraph, key: string): unknown {
    try {
        const document: WordDocument = this.owningDocument();
        const styles: StylesPart = stylesFor(document);
        const collection: StyleCollection = styleCollectionFor(document);
        const seen: Set<string> = new Set<string>();
        let styleId: string = this.styleId;
        while (styleId !== undefined && styleId !== '' && !seen.has(styleId)) {
            seen.add(styleId);
            const live: Style = collection.getStyle(styleId);
            if (live !== undefined && live instanceof ParagraphStyle) {
                const slot: unknown = directParagraphSlot(live.paragraphFormat as unknown as { [key: string]: unknown }, key);
                if (slot !== undefined) {
                    return slot;
                }
                const base: ParagraphStyle = live.baseParagraphStyle;
                styleId = base === undefined ? undefined : base.styleId;
                continue;
            }
            if (live !== undefined) {
                const base: Style = live.baseStyle;
                styleId = base === undefined ? undefined : base.styleId;
                continue;
            }
            break;
        }
        const docP: ModeledParagraphProperties = styles.docDefaultsParagraphProperties();
        const fromDoc: unknown = modeledParagraphSlot(docP, key);
        if (fromDoc !== undefined) {
            return fromDoc;
        }
    } catch {
        // detached
    }
    // Direct property getters treat unset as `undefined` (DocIO-style).
    // Layout/effective consumers apply PARAGRAPH_FORMAT_DEFAULTS themselves
    // when they need concrete booleans/numbers — do not invent them here.
    return undefined;
};

Object.defineProperty(WordDocument.prototype, 'styles', {
    get(this: WordDocument): StyleCollection {
        return styleCollectionFor(this);
    },
    configurable: true
});
Object.defineProperty(WordDocument.prototype, 'addTableStyle', {
    value(this: WordDocument, name: string): TableStyle {
        return styleCollectionFor(this).addTableStyle(name);
    },
    writable: true,
    configurable: true
});
Object.defineProperty(WordDocument.prototype, 'themes', {
    get(this: WordDocument): ThemePart {
        return themeFor(this);
    },
    configurable: true
});
/**
 * Minimal table surface used during style materialization (avoids styles↔tables import cycle).
 *
 * @private
 */
interface TableStyleMaterializeTarget {
    styleId: string | undefined;
    listRows(): ReadonlyArray<{
        listCells(): ReadonlyArray<{
            listBlocks(): ReadonlyArray<unknown>;
        }>;
    }>;
}

/**
 * Clear `w:pStyle` / `w:rStyle` / table style references that point at `styleId`.
 * Body + nested tables via document-order visitors; headers/footers when that feature is registered.
 *
 * @param {WordDocument} document - The document.
 * @param {string} styleId - The style id.
 * @returns {void} Nothing is returned.
 * @private
 */
function purgeStyleReferencesInDocument(document: WordDocument, styleId: string): void {
    visitParagraphsInDocumentOrder(document, (paragraph: Paragraph) => {
        purgeParagraphStyleReferences(paragraph, styleId);
    });
    visitTablesInDocumentOrder(document, (table: TableStyleMaterializeTarget) => {
        if (table.styleId === styleId) {
            table.styleId = undefined;
        }
    });
    purgeHeaderFooterStyleReferences(document, styleId);
}

/**
 * Clear paragraph and run style refs on a single paragraph.
 *
 * @param {Paragraph} paragraph - The paragraph.
 * @param {string} styleId - The style id.
 * @returns {void} Nothing is returned.
 * @private
 */
function purgeParagraphStyleReferences(paragraph: Paragraph, styleId: string): void {
    if (paragraph.styleId === styleId) {
        paragraph.styleId = undefined;
    }
    for (const inline of paragraph.items) {
        if (!(inline instanceof TextRange)) {
            continue;
        }
        if (inline.characterFormat.characterStyle === styleId) {
            inline.characterFormat.characterStyle = undefined;
        }
    }
}

/**
 * When headers-footers is registered, clear style refs in every loaded HF part
 * (including nested tables). Duck-types the catalog via featurePart so styles
 * stays free of a hard HF import — registry presence only.
 *
 * @param {WordDocument} document - The document.
 * @param {string} styleId - The style id.
 * @returns {void} Nothing is returned.
 * @private
 */
function purgeHeaderFooterStyleReferences(document: WordDocument, styleId: string): void {
    const headersFootersFeatureId: FeatureId = featureId('headers-footers');
    if (!isFeatureRegistered(headersFootersFeatureId)) {
        return;
    }
    const part: FeaturePartState = document.featurePart(headersFootersFeatureId);
    if (part === undefined || typeof part !== 'object' || part === null) {
        return;
    }
    const catalog: {
        relationshipIds?: (kind: HeaderFooterKind) => ReadonlyArray<string>;
        paragraphsForRelationship?: (relationshipId: string) => ReadonlyArray<Paragraph>;
        itemsForRelationship?: (relationshipId: string) => ReadonlyArray<unknown>;
    } = part as {
        relationshipIds?: (kind: 'header' | 'footer') => ReadonlyArray<string>;
        paragraphsForRelationship?: (relationshipId: string) => ReadonlyArray<Paragraph>;
        itemsForRelationship?: (relationshipId: string) => ReadonlyArray<unknown>;
    };
    if (typeof catalog.relationshipIds !== 'function') {
        return;
    }
    const kinds: Array<'header' | 'footer'> = ['header', 'footer'];
    for (const kind of kinds) {
        const ids: ReadonlyArray<string> = catalog.relationshipIds(kind);
        for (const relationshipId of ids) {
            if (typeof catalog.paragraphsForRelationship === 'function') {
                const paragraphs: ReadonlyArray<Paragraph> = catalog.paragraphsForRelationship(relationshipId);
                for (const paragraph of paragraphs) {
                    purgeParagraphStyleReferences(paragraph, styleId);
                }
            }
            if (typeof catalog.itemsForRelationship === 'function') {
                visitTableBlocks(catalog.itemsForRelationship(relationshipId), (table: TableStyleMaterializeTarget) => {
                    if (table.styleId === styleId) {
                        table.styleId = undefined;
                    }
                });
            }
        }
    }
}

/**
 * Visit every table block in document order, including nested tables.
 *
 * @param {WordDocument} document - The document.
 * @param {Function} visit - The visit.
 * @returns {void} Nothing is returned.
 * @private
 */
function visitTablesInDocumentOrder(
    document: WordDocument,
    visit: (table: TableStyleMaterializeTarget) => void
): void {
    visitTableBlocks(document.listBlocks(), visit);
}

function asTableStyleMaterializeTarget(value: unknown): TableStyleMaterializeTarget | undefined {
    if (typeof value !== 'object' || value === null) {
        return undefined;
    }
    const candidate: { listRows?: unknown; } = value as { listRows?: unknown };
    if (typeof candidate.listRows !== 'function') {
        return undefined;
    }
    return value as TableStyleMaterializeTarget;
}

function visitTableBlocks(
    blocks: ReadonlyArray<unknown>,
    visit: (table: TableStyleMaterializeTarget) => void
): void {
    for (const block of blocks) {
        if (typeof block !== 'object' || block === null) {
            continue;
        }
        const candidate: { type?: unknown; value?: unknown; } = block as { type?: unknown; value?: unknown };
        let table: TableStyleMaterializeTarget = asTableStyleMaterializeTarget(block);
        if (table === undefined && candidate.type === 'feature') {
            table = asTableStyleMaterializeTarget(candidate.value);
        }
        if (table === undefined) {
            continue;
        }
        visit(table);
        const rows: ReadonlyArray<{ listCells(): ReadonlyArray<{ listBlocks(): ReadonlyArray<unknown>; }>; }> = table.listRows();
        for (const row of rows) {
            const cells: ReadonlyArray<{ listBlocks(): ReadonlyArray<unknown>; }> = row.listCells();
            for (const cell of cells) {
                visitTableBlocks(cell.listBlocks(), visit);
            }
        }
    }
}

registerStylesFeature();
