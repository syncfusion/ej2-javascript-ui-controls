import { OpenXmlAttribute, OpenXmlChild, OpenXmlElement, serializeXml } from '../../core/xml/index';
import { visitBlocksInDocumentOrder, visitParagraphsInDocumentOrder } from '../../core/registry/index';
import { WordDocument, ImportRequest, registerImportContentHandler, registerCloneDocumentHandler } from './document';
import { propertiesFor } from '../properties/index';
import { Watermark } from '../watermark/index';
import { BlockContent, Paragraph } from './paragraph';
import { Section } from './section';
import { registerSectionAttachHook } from './sections';
import { TextRange, Tab } from './text-range';
import { CharacterFormat, CharacterFormatSnapshot } from './character-format';
import { ParagraphFormatSnapshot } from './paragraph-format';
import { isWml, wmlAttr } from './wml';
import { stylesFor, styleCollectionFor, Style, ParagraphStyle, StyleCollection, parseDocxStyle, DocxStyle } from '../styles/index';
import { numberingFor, NumberingPart, AbstractNumbering, parseAbstractNumbering } from '../numbering/index';
import { picturesInParagraph } from '../images/index';
import { remapImportedHyperlinks } from '../hyperlinks/index';
import { copySectionHeaderFooterParts } from '../headers-footers/index';
import { PageSetup, SectionBreakCode } from '../sections/index';
import { isTableBlock, Table } from '../tables/index';

/** True while importContent clones sections itself and remaps their lists afterwards. */
let suppressAttachRemap: boolean = false;

type StyleKind = 'paragraph' | 'character' | 'table';

/**
 * Fills every undefined member of `target` from the first base that defines it.
 * @param {T} target - The object to fill.
 * @param {ReadonlyArray<T>} bases - Fallback objects, in priority order.
 * @returns {T} A filled copy of `target`.
 * @private
 */
function fillUndefined<T extends object>(target: T, bases: ReadonlyArray<T>): T {
    const out: T = { ...target };
    for (const base of bases) {
        for (const key of Object.keys(base) as Array<keyof T>) {
            // eslint-disable-next-line security/detect-object-injection
            if (out[key] === undefined && base[key] !== undefined) {
                // eslint-disable-next-line security/detect-object-injection
                out[key] = base[key];
            }
        }
    }
    return out;
}

function paragraphStyleChain(styles: StyleCollection, styleId: string | undefined): ParagraphStyle[] {
    const chain: ParagraphStyle[] = [];
    let current: ParagraphStyle | undefined = styleId === undefined ? undefined : styles.getParagraphStyle(styleId);
    while (current !== undefined && chain.indexOf(current) === -1) {
        chain.push(current);
        current = current.baseParagraphStyle;
    }
    return chain;
}

function characterStyleChain(styles: StyleCollection, styleId: string | undefined): Style[] {
    const chain: Style[] = [];
    let current: Style | undefined = styleId === undefined ? undefined : styles.getCharacterStyle(styleId);
    while (current !== undefined && chain.indexOf(current) === -1) {
        chain.push(current);
        current = current.baseStyle;
    }
    return chain;
}

function visitTree(
    blocks: ReadonlyArray<BlockContent>,
    onParagraph: (paragraph: Paragraph) => void,
    onTable: (table: Table) => void
): void {
    for (const block of blocks) {
        if (block.type === 'paragraph') {
            onParagraph(block.paragraph);
        } else if (isTableBlock(block)) {
            const table: Table = block.value;
            onTable(table);
            for (const row of table.listRows()) {
                for (const cell of row.listCells()) {
                    visitTree(cell.listBlocks(), onParagraph, onTable);
                }
            }
        } else {
            visitBlocksInDocumentOrder([block], onParagraph);
        }
    }
}

/**
 * Drops revision-save ids, which never affect style formatting.
 * @param {OpenXmlElement} element - The element to filter.
 * @returns {OpenXmlElement} The element without rsid children.
 * @private
 */
function withoutRsid(element: OpenXmlElement): OpenXmlElement {
    const children: OpenXmlChild[] = element.children.filter((c: OpenXmlChild): boolean =>
        !(c.kind === 'element' && isWml(c, 'rsid')));
    return { ...element, children };
}

function withStyleIdentity(
    element: OpenXmlElement, styleId: string, name: string | undefined, basedOn: string | undefined | null
): OpenXmlElement {
    const attributes: OpenXmlAttribute[] = element.attributes.map((a: OpenXmlAttribute): OpenXmlAttribute =>
        a.localName === 'styleId' ? { ...a, value: styleId } : a);
    const children: OpenXmlChild[] = [];
    for (const child of element.children) {
        if (child.kind === 'element' && isWml(child, 'name') && name !== undefined) {
            children.push({ ...child, attributes: [wmlAttr('val', name)] });
        } else if (child.kind === 'element' && isWml(child, 'basedOn') && basedOn !== null) {
            if (basedOn !== undefined) {
                children.push({ ...child, attributes: [wmlAttr('val', basedOn)] });
            }
        } else {
            children.push(child);
        }
    }
    return { ...element, attributes, children };
}

/**
 * Resolves and caches how each source style is represented in the destination.
 *
 * @private
 */
class StyleMapper {
    private readonly cache: Map<string, string | undefined> = new Map<string, string | undefined>();
    private readonly sourceStyles: StyleCollection;
    private readonly destStyles: StyleCollection;

    private readonly request: ImportRequest;

    constructor(source: WordDocument, destination: WordDocument, request: ImportRequest) {
        this.request = request;
        this.sourceStyles = styleCollectionFor(source);
        this.destStyles = styleCollectionFor(destination);
    }

    /**
     * Destination style id to reference for a source style id; `undefined` means the default style.
     *
     * @param {StyleKind} kind - The style kind.
     * @param {string | undefined} sourceId - The source style id.
     * @returns {string | undefined} The destination style id.
     */
    map(kind: StyleKind, sourceId: string | undefined): string | undefined {
        if (sourceId === undefined || sourceId.length === 0) {
            return undefined;
        }
        const key: string = kind + ':' + sourceId;
        if (this.cache.has(key)) {
            return this.cache.get(key);
        }
        const result: string | undefined = this.resolve(kind, sourceId);
        this.cache.set(key, result);
        return result;
    }

    /**
     * Destination paragraph style id for a source paragraph. A paragraph without `w:pStyle` uses the
     * source's default style, which may differ from the destination's, so it is mapped too.
     *
     * @param {string | undefined} sourceId - The source paragraph style id, when explicit.
     * @returns {string | undefined} The destination style id; `undefined` keeps the default style.
     */
    mapParagraph(sourceId: string | undefined): string | undefined {
        if (sourceId !== undefined && sourceId.length > 0) {
            return this.map('paragraph', sourceId);
        }
        const defaults: Style[] = this.sourceStyles.stylesInOrder().filter(
            (style: Style): boolean => style.type === 'paragraph' && style.isDefault === true);
        if (defaults.length === 0) {
            return undefined;
        }
        const mapped: string | undefined = this.map('paragraph', defaults[0].styleId);
        return mapped === defaults[0].styleId ? undefined : mapped;
    }

    private resolve(kind: StyleKind, sourceId: string): string | undefined {
        const source: Style | undefined = this.sourceStyles.getStyle(sourceId);
        if (source === undefined || source.type !== kind) {
            return sourceId;
        }
        const name: string = source.name !== undefined ? source.name : sourceId;
        const match: Style | undefined = this.destStyles.findByName(name);
        if (match !== undefined) {
            if (match.type !== kind) {
                return undefined;
            }
            if ((this.request.generateOnConflict || this.request.options.mode === 'source') && !this.sameDefinition(source, match)) {
                // One shared suffix keeps the id and the name recognisably paired; a counter would collide
                // with styles from earlier imports.
                const suffix: string = '_' + this.uniqueId();
                return this.copy(source, match.styleId + suffix, name + suffix);
            }
            return match.styleId;
        }
        if (!this.request.addMissingStyles) {
            return sourceId;
        }
        const id: string = this.destStyles.hasStyle(sourceId) ? sourceId + '_' + this.uniqueId() : sourceId;
        return this.copy(source, id, undefined);
    }

    private sameDefinition(source: Style, dest: Style): boolean {
        const a: OpenXmlElement = withStyleIdentity(source.toDocxStyle().serialize(), dest.styleId, undefined, null);
        return serializeXml(withoutRsid(a)) === serializeXml(withoutRsid(dest.toDocxStyle().serialize()));
    }

    /**
     * Collision-resistant suffix appended to the style id/name (time in base 36 plus random).
     *
     * @returns {string} The suffix.
     */
    private uniqueId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }

    private copy(source: Style, id: string, name: string | undefined): string {
        // Register before resolving the base style so a base cycle terminates.
        this.cache.set(source.type + ':' + source.styleId, id);
        const baseId: string | undefined = source.basedOnId;
        const mappedBase: string | undefined = baseId === undefined ? undefined : this.map(source.type as StyleKind, baseId);
        const element: OpenXmlElement = withStyleIdentity(
            source.toDocxStyle().serialize(), id, name, baseId === undefined ? null : mappedBase);
        const shell: DocxStyle | undefined = parseDocxStyle(element);
        if (shell !== undefined) {
            this.destStyles.addStyle(shell);
        }
        return id;
    }
}

function characterSnapshot(run: TextRange): CharacterFormatSnapshot {
    return run.characterFormat.snapshot();
}

/**
 * Appends the source style formatting to direct formatting so effective values are unchanged.
 * @param {Paragraph} paragraph - The paragraph to flatten.
 * @param {StyleCollection} sourceStyles - The source style collection.
 * @param {Function | undefined} keepOnly - Optional character-format filter.
 * @returns {void} Nothing is returned.
 * @private
 */
function flattenParagraph(
    paragraph: Paragraph,
    sourceStyles: StyleCollection,
    keepOnly: ((s: CharacterFormatSnapshot) => CharacterFormatSnapshot) | undefined
): void {
    const chain: ParagraphStyle[] = paragraphStyleChain(sourceStyles, paragraph.styleId);
    const paraCharLayers: CharacterFormatSnapshot[] = chain.map((s: ParagraphStyle): CharacterFormatSnapshot =>
        s.characterFormat.snapshot());
    type SnapshotMap = (s: CharacterFormatSnapshot) => CharacterFormatSnapshot;
    const finish: SnapshotMap = (s: CharacterFormatSnapshot): CharacterFormatSnapshot => {
        const out: CharacterFormatSnapshot = { ...s, styleIdValue: undefined };
        return keepOnly === undefined ? out : keepOnly(out);
    };
    if (keepOnly === undefined) {
        const numbered: boolean = paragraph.numId !== undefined && paragraph.numId >= 1;
        // A numbering level's indents override the style's, so flattening the style indents into direct
        // formatting would wrongly override the level indents (e.g. nested bullets).
        const layers: ParagraphFormatSnapshot[] = chain.map((s: ParagraphStyle): ParagraphFormatSnapshot =>
            numbered ? { ...s.paragraphFormat.snapshot(), indentsValue: undefined } : s.paragraphFormat.snapshot());
        paragraph.paragraphFormat.hydrate(fillUndefined(paragraph.paragraphFormat.snapshot(), layers));
    }
    paragraph.breakCharacterFormat.hydrate(finish(fillUndefined(paragraph.breakCharacterFormat.snapshot(), paraCharLayers)));
    for (const item of paragraph.items) {
        if (item instanceof TextRange) {
            const charLayers: CharacterFormatSnapshot[] = characterStyleChain(sourceStyles, item.characterFormat.characterStyle)
                .map((s: Style): CharacterFormatSnapshot => s.characterFormat.snapshot());
            item.characterFormat.hydrate(finish(fillUndefined(characterSnapshot(item), charLayers.concat(paraCharLayers))));
        }
    }
}

/**
 * Merge Formatting keeps only these direct properties (decision D-03).
 * @param {CharacterFormatSnapshot} s - The snapshot to reduce.
 * @returns {CharacterFormatSnapshot} The reduced snapshot.
 * @private
 */
function mergeCharacterSubset(s: CharacterFormatSnapshot): CharacterFormatSnapshot {
    const out: CharacterFormatSnapshot = new CharacterFormat(undefined).snapshot();
    out.boldValue = s.boldValue;
    out.italicValue = s.italicValue;
    out.underlineStyleValue = s.underlineStyleValue;
    out.underlineColorValue = s.underlineColorValue;
    out.vertAlignValue = s.vertAlignValue;
    out.boldBidiValue = s.boldBidiValue;
    out.italicBidiValue = s.italicBidiValue;
    out.rPrExtra = s.rPrExtra;
    return out;
}

const FORM_FIELD_KEYWORDS: ReadonlyArray<string> = ['FORMTEXT', 'FORMCHECKBOX', 'FORMDROPDOWN'];

/**
 * Paragraph text for Keep Text Only: like `Paragraph.text`, but legacy form-field codes are kept.
 * @param {Paragraph} paragraph - The paragraph.
 * @returns {string} The text.
 * @private
 */
function textOnlyText(paragraph: Paragraph): string {
    const parts: string[] = [];
    const stack: Array<{ inResult: boolean; code: string }> = [];
    for (const item of paragraph.items.snapshot() as ReadonlyArray<unknown>) {
        if (item !== undefined && typeof item === 'object' && item !== null) {
            if ('fieldType' in item && !('fieldMarkType' in item)) {
                stack.push({ inResult: false, code: '' });
                continue;
            }
            if ('fieldMarkType' in item) {
                const kind: unknown = (item as { fieldMarkType: unknown }).fieldMarkType;
                const top: { inResult: boolean; code: string } | undefined = stack[stack.length - 1];
                if (kind === 'separate' && top !== undefined) {
                    top.inResult = true;
                    if (FORM_FIELD_KEYWORDS.indexOf(top.code.trim().split(/\s+/)[0].toUpperCase()) >= 0) {
                        parts.push(top.code);
                    }
                } else if (kind === 'end') {
                    stack.pop();
                }
                continue;
            }
        }
        const top: { inResult: boolean; code: string } | undefined = stack[stack.length - 1];
        if (item instanceof TextRange) {
            if (top === undefined || top.inResult) {
                parts.push(item.text);
            } else {
                top.code += item.text;
            }
        } else if (item instanceof Tab && (top === undefined || top.inResult)) {
            parts.push('\t');
        }
    }
    return parts.join('');
}

/**
 * The list label of a numbered paragraph; bullets are written as `*`.
 * @param {Paragraph} paragraph - The paragraph.
 * @returns {string} The label.
 * @private
 */
function textOnlyListLabel(paragraph: Paragraph): string {
    const label: string = paragraph.listString;
    if (label === undefined || label === '') {
        return '';
    }
    try {
        const part: NumberingPart = numberingFor(paragraph.owningDocument());
        const instance: ReturnType<NumberingPart['getNumbering']> = part.getNumbering(paragraph.numId as number);
        const abstract: AbstractNumbering | undefined = instance === undefined ? undefined
            : part.getAbstractNumbering(instance.abstractNumId);
        const ilvl: number = paragraph.listLevel !== undefined ? paragraph.listLevel : 0;
        const level: { numFmt?: string } | undefined = abstract === undefined ? undefined
            : abstract.levels.find((l: { ilvl: number }): boolean => l.ilvl === ilvl);
        if (level !== undefined && level.numFmt === 'bullet') {
            return '*  ';
        }
    } catch (e) {
        return label + '  ';
    }
    return label + '  ';
}

/**
 * Collects the Keep Text Only lines of the given sections.
 *
 * @param {ReadonlyArray<Section>} sections - The source sections.
 * @returns {string[]} One line per paragraph.
 * @private
 */
function textOnlyParagraphs(sections: ReadonlyArray<Section>): string[] {
    const lines: string[] = [];
    const visit: (blocks: ReadonlyArray<BlockContent>) => void = (blocks: ReadonlyArray<BlockContent>): void => {
        for (const block of blocks) {
            if (block.type === 'paragraph') {
                lines.push(textOnlyListLabel(block.paragraph) + textOnlyText(block.paragraph));
            } else if (isTableBlock(block)) {
                for (const row of block.value.listRows()) {
                    // Cell paragraphs stay separate; a tab joins the last paragraph of a cell to the first of the next.
                    let pendingTab: boolean = false;
                    for (const cell of row.listCells()) {
                        cell.listParagraphs().forEach((paragraph: Paragraph, index: number): void => {
                            const text: string = textOnlyListLabel(paragraph) + textOnlyText(paragraph);
                            if (pendingTab && index === 0) {
                                lines[lines.length - 1] += '\t' + text;
                            } else {
                                lines.push(text);
                            }
                        });
                        pendingTab = cell.listParagraphs().length > 0;
                    }
                }
            }
            // Other blocks (content controls, bookmarks, opaque XML) are not text and are dropped.
        }
    };
    for (const section of sections) {
        visit(section.body.listBlocks());
    }
    return lines;
}

/**
 * Copies source list definitions into the destination and remaps the numbering ids of the paragraphs.
 * @param {ReadonlyArray<Paragraph>} paragraphs - The imported paragraphs.
 * @param {WordDocument} source - The source document.
 * @param {WordDocument} destination - The destination document.
 * @param {ImportRequest} request - The import request.
 * @param {number | undefined} continueNumId - The numbering id to continue, if any.
 * @returns {void} Nothing is returned.
 * @private
 */
function remapLists(
    paragraphs: ReadonlyArray<Paragraph>,
    source: WordDocument,
    destination: WordDocument,
    request: ImportRequest,
    continueNumId: number | undefined
): void {
    const sourcePart: NumberingPart = numberingFor(source);
    const destPart: NumberingPart = numberingFor(destination);
    const abstractMap: Map<number, number> = new Map<number, number>();
    const numMap: Map<number, number> = new Map<number, number>();
    for (const paragraph of paragraphs) {
        const srcNumId: number | undefined = paragraph.numId;
        if (srcNumId === undefined || srcNumId < 1) {
            continue;
        }
        if (request.options.list === 'continue' && continueNumId !== undefined) {
            paragraph.numId = continueNumId;
            continue;
        }
        let mapped: number | undefined = numMap.get(srcNumId);
        if (mapped === undefined) {
            const instance: ReturnType<NumberingPart['getNumbering']> = sourcePart.getNumbering(srcNumId);
            const abstract: AbstractNumbering | undefined = instance === undefined ? undefined
                : sourcePart.getAbstractNumbering(instance.abstractNumId);
            if (instance === undefined || abstract === undefined) {
                // Not materialized yet in the source: allocate an equivalent pending instance.
                if (sourcePart.hasInstance(srcNumId)) {
                    mapped = sourcePart.isPendingDecimal(srcNumId) ? destPart.createDecimalInstance() : destPart.createBulletInstance();
                    numMap.set(srcNumId, mapped);
                    paragraph.numId = mapped;
                }
                continue;
            }
            let newAbstractId: number | undefined = abstractMap.get(abstract.abstractNumId);
            if (newAbstractId === undefined) {
                newAbstractId = destPart.allocateAbstractNumId();
                const id: number = newAbstractId;
                const element: OpenXmlElement = abstract.toOpenXml();
                const copy: AbstractNumbering | undefined = parseAbstractNumbering({
                    ...element,
                    attributes: element.attributes.map((a: OpenXmlAttribute): OpenXmlAttribute =>
                        a.localName === 'abstractNumId' ? { ...a, value: String(id) } : a)
                });
                if (copy === undefined) {
                    continue;
                }
                destPart.registerAbstract(copy);
                abstractMap.set(abstract.abstractNumId, id);
            }
            mapped = destPart.createInstanceFromAbstract(newAbstractId, request.options.list === 'restart' ? 1 : undefined);
            numMap.set(srcNumId, mapped);
        }
        paragraph.numId = mapped;
    }
}

function lastListNumId(destination: WordDocument): number | undefined {
    let last: number | undefined;
    visitParagraphsInDocumentOrder(destination, (p: Paragraph): void => {
        if (p.numId !== undefined && p.numId >= 1) {
            last = p.numId;
        }
    });
    return last;
}

function importContent(destination: WordDocument, source: WordDocument, request: ImportRequest): void {
    const mode: ImportRequest['options']['mode'] = request.options.mode;
    // Capture everything that depends on the destination before it changes (self-import safe).
    const sourceStyles: StyleCollection = styleCollectionFor(source);
    let lastParagraphFormat: ParagraphFormatSnapshot | undefined;
    let lastParagraphStyleId: string | undefined;
    if (mode === 'merge') {
        try {
            const last: Paragraph = destination.lastParagraph;
            lastParagraphFormat = last.paragraphFormat.snapshot();
            lastParagraphStyleId = last.styleId;
        } catch (e) {
            lastParagraphFormat = undefined;
        }
    }
    const continueNumId: number | undefined = request.options.list === 'continue' ? lastListNumId(destination) : undefined;

    if (mode === 'textOnly') {
        const lines: string[] = textOnlyParagraphs(source.sections.asArray());
        const section: Section = destination.sections.add();
        for (const line of lines) {
            if (line === '') {
                section.body.appendParagraph();
            } else {
                section.body.appendParagraph({ text: line });
            }
        }
        const setup: unknown = section.pageSetup;
        if (setup instanceof PageSetup) {
            setup.breakCode = SectionBreakCode.NewPage;
        }
        return;
    }

    const mapper: StyleMapper = new StyleMapper(source, destination, request);
    // Sections.cloneTo clones every source section (count read once, so self-import is safe)
    // and appends the clones after the destination's existing sections.
    const existingCount: number = destination.sections.count;
    suppressAttachRemap = true;
    try {
        source.sections.cloneTo(destination.sections);
    } finally {
        suppressAttachRemap = false;
    }
    const sourceSections: ReadonlyArray<Section> = destination.sections.asArray().slice(existingCount);
    sourceSections.forEach((cloned: Section, index: number): void => {
        const from: unknown = source.sections[index as number].pageSetup;
        const to: unknown = cloned.pageSetup;
        if (from instanceof PageSetup && to instanceof PageSetup && from.headerFooterReferences.length > 0) {
            copySectionHeaderFooterParts(source, destination, from, to);
        }
    });
    const imported: Paragraph[] = [];
    for (const section of sourceSections) {
        visitTree(section.body.listBlocks(), (paragraph: Paragraph): void => {
            imported.push(paragraph);
            const original: string | undefined = paragraph.styleId;
            if (mode === 'destination') {
                paragraph.styleId = mapper.mapParagraph(original);
                for (const item of paragraph.items) {
                    if (item instanceof TextRange && item.characterFormat.characterStyle !== undefined) {
                        item.characterFormat.characterStyle = mapper.map('character', item.characterFormat.characterStyle);
                    }
                }
                return;
            }
            flattenParagraph(paragraph, sourceStyles, mode === 'merge' ? mergeCharacterSubset : undefined);
            if (mode === 'merge') {
                if (lastParagraphFormat !== undefined) {
                    paragraph.paragraphFormat.hydrate({ ...lastParagraphFormat });
                }
                paragraph.styleId = lastParagraphStyleId;
            } else {
                paragraph.styleId = undefined;
            }
        }, (table: Table): void => {
            table.styleId = mapper.map('table', table.styleId);
        });
    }
    for (const paragraph of imported) {
        for (const picture of picturesInParagraph(paragraph)) {
            picture.adoptCloneBytes(destination);
        }
    }
    remapImportedHyperlinks(source, destination, imported);
    if (request.options.list !== 'none' || imported.some((p: Paragraph): boolean => p.numId !== undefined && p.numId >= 1)) {
        remapLists(imported, source, destination, request, continueNumId);
    }

    if (request.join) {
        // Move the first imported section's content into the destination's previous last section.
        const joined: Section = sourceSections[0];
        const target: Section = destination.sections[existingCount - 1];
        for (const block of joined.body.listBlocks()) {
            target.body.appendRawBlock(block);
        }
        destination.sections.remove(joined);
    }
}

registerImportContentHandler(importContent);

// Sections added from another document (e.g. `sections.add(section.clone())`) carry cloned pictures
// whose bytes must be registered with the receiving document's package.
registerSectionAttachHook((section: Section, document: WordDocument): void => {
    const origin: WordDocument | undefined = section.takeCloneSource();
    const paragraphs: Paragraph[] = [];
    const tables: Table[] = [];
    visitTree(section.body.listBlocks(), (paragraph: Paragraph): void => {
        paragraphs.push(paragraph);
        for (const picture of picturesInParagraph(paragraph)) {
            picture.adoptCloneBytes(document);
        }
    }, (table: Table): void => {
        tables.push(table);
    });
    // Style and list ids of a section cloned from another document refer to that document's parts.
    if (origin === undefined || origin === document || suppressAttachRemap) {
        return;
    }
    const request: ImportRequest = {
        addMissingStyles: true,
        generateOnConflict: true,
        options: { mode: 'destination', list: 'none' },
        join: false
    };
    // Styles first (so list-bearing paragraph styles exist), then lists.
    const mapper: StyleMapper = new StyleMapper(origin, document, request);
    for (const paragraph of paragraphs) {
        paragraph.styleId = mapper.mapParagraph(paragraph.styleId);
        for (const item of paragraph.items) {
            if (item instanceof TextRange && item.characterFormat.characterStyle !== undefined) {
                item.characterFormat.characterStyle = mapper.map('character', item.characterFormat.characterStyle);
            }
        }
    }
    for (const table of tables) {
        table.styleId = mapper.map('table', table.styleId);
    }
    if (paragraphs.some((p: Paragraph): boolean => p.numId !== undefined && p.numId >= 1)) {
        remapLists(paragraphs, origin, document, request, undefined);
    }
});

/**
 * Builds the clone of `source`: document-level state first, then `importContent(source)` with its
 * defaults (all styles imported, sections cloned in order).
 *
 * @param {WordDocument} source - The document to clone.
 * @returns {WordDocument} The independent copy.
 * @private
 */
function cloneDocument(source: WordDocument): WordDocument {
    const copy: WordDocument = WordDocument.create();
    // View setup and document settings.
    copy.viewSetup.documentViewType = source.viewSetup.documentViewType;
    copy.viewSetup.zoomType = source.viewSetup.zoomType;
    copy.viewSetup.zoomPercent = source.viewSetup.zoomPercent;
    copy.defaultTabStop = source.defaultTabStop;
    copy.trackRevisions = source.trackRevisions;
    // Built-in (core + extended) and custom properties.
    const from: ReturnType<typeof propertiesFor> = propertiesFor(source);
    const to: ReturnType<typeof propertiesFor> = propertiesFor(copy);
    for (const key of from.core.fields.keys()) {
        to.core.fields.set(key, from.core.fields.get(key));
    }
    for (const key of from.extended.fields.keys()) {
        to.extended.fields.set(key, from.extended.fields.get(key));
    }
    to.ensureCorePart(copy.opcPackage());
    const customCopy: ReturnType<typeof from.custom.clone> = from.custom.clone();
    for (let i: number = 0; i < customCopy.count; i++) {
        const property: ReturnType<typeof customCopy.get> = customCopy.get(i);
        to.custom.add(property.name, property.value, property.valueType);
    }
    // Watermark: only when the source has one.
    const watermark: Watermark | undefined = source.watermark;
    if (watermark !== undefined) {
        copy.watermark = watermark.clone();
    }
    // Font substitution table: union, source precedence.
    for (const [primary, alternate] of source.fontSubstitutionTable) {
        copy.fontSubstitutionTable.set(primary, alternate);
    }
    // Character and paragraph defaults (w:docDefaults) are not part of importContent.
    stylesFor(copy).replaceDocDefaults(stylesFor(source).docDefaults);
    // Content: the fresh document starts with one empty section that the clone must not keep.
    copy.importContent(source);
    copy.sections.removeAt(0);
    return copy;
}

registerCloneDocumentHandler(cloneDocument);
