export * from './abstract-numbering';
export * from './list-string';
export * from './list-style';
export * from './numbering-instance';
export * from './numbering-level';
export * from './picture-bullet';
import { DocxError } from '../../core/errors/docx-error';
import { registerAlwaysOnBodyFeatureBootstrap } from '../document/body-always-on';
import { WordDocument, FeaturePartState } from '../document/document';
import { FeaturePackagePart } from '../document/feature-package-part';
import { Paragraph } from '../document/paragraph';
import { elementChildren, isWml, wmlAttr, wmlElement } from '../document/wml';
import { partName, PartName } from '../../core/opc/part-name';
import { PackagePart } from '../../core/opc/package';
import { featureId, isFeatureRegistered, registerFeature, registerFeatureMaterializeHandler, registerFeaturePartHandler, visitParagraphsInDocumentOrder } from '../../core/registry/index';
import { FeaturePartLoadContext } from '../../core/registry/part-handlers';
import { decodeXmlBytes, parseXml, serializeXml, closePartNamespaces, WML_TRANSITIONAL_NAMESPACE, OpenXmlChild, OpenXmlElement, NamespaceDeclaration } from '../../core/xml/index';
import { AbstractNumbering, MultiLevelType, createDefaultAbstractNumbering, parseAbstractNumbering } from './abstract-numbering';
import { createNumberingInstance, NumberingInstance, parseNumberingInstance } from './numbering-instance';
import { ListFormat } from './list-format';
import { NumberingPictureBullet, parseNumberingPictureBullet } from './picture-bullet';
import { setListFormatFactory } from '../document/paragraph';

// Bridge ListFormat onto Paragraph without extensionless CJS require (Vitest ESM).
setListFormatFactory((paragraph: Paragraph) => new ListFormat(paragraph));
// Side-effect: WordDocument.addListStyle + load list-style module.
import './list-style';
// Side-effect: Paragraph.listString.
import './list-string';
import { FeatureId } from '../../core/registry/feature-registry';
import { OpenXmlAttribute } from '../../core/xml/model';
const NUMBERING: FeatureId = featureId('numbering');
/**
 * @private
 * Transitional numbering relationship (ECMA-376-4 section 9.2.11). */
export const NUMBERING_RELATIONSHIP_TYPE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering';
/**
 * @private
 * Strict numbering relationship (ECMA-376-1 section 11.3.11). */
export const STRICT_NUMBERING_RELATIONSHIP_TYPE: string = 'http://purl.oclc.org/ooxml/officeDocument/relationships/numbering';
/**
 * @private
 * ECMA-376-1 section 11.3.11 Numbering Definitions content type. */
export const NUMBERING_CONTENT_TYPE: string = 'application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml';
/**
 * @private
 */
export const NUMBERING_PART_NAME: PartName = partName('/word/numbering.xml');
const utf8: TextEncoder = new TextEncoder();
/**
 * In-memory Numbering Definitions part (`word/numbering.xml`).
 *
 * Typed DOM for `CT_Numbering`: picture bullets, abstract definitions,
 * numbering instances, and optional `numIdMacAtCleanup`. Unmodeled root
 * children are preserved in prefix/suffix order.
 *
 * @private
 */
export class NumberingPart implements FeaturePackagePart {
    private readonly rootPrefix: OpenXmlElement[];
    private readonly rootSuffix: OpenXmlElement[];
    private readonly pictureBulletList: NumberingPictureBullet[];
    private readonly abstractNumberingList: AbstractNumbering[];
    private readonly numberingList: NumberingInstance[];
    private readonly abstractById: Map<number, AbstractNumbering>;
    private readonly numberingById: Map<number, NumberingInstance>;
    private readonly pictureById: Map<number, NumberingPictureBullet>;
    private readonly pendingNumIds: Set<number>;
    /** Subset of pendingNumIds that should materialize as decimal (numbered) format. */
    private readonly pendingDecimalNumIds: Set<number>;
    /** Pending ids that materialize as all-decimal (HTML <ol>) nine-level definitions. */
    private readonly pendingHtmlDecimalNumIds: Set<number>;
    /** numFmt (e.g. 'upperLetter') for each pending HTML numbered instance. */
    private readonly pendingHtmlNumFmt: Map<number, string>;
    private numIdMacAtCleanupValue: number | undefined;
    private readonly rootNamespaceDeclarations: ReadonlyArray<NamespaceDeclaration>;
    private readonly rootAttributes: ReadonlyArray<OpenXmlAttribute>;
    private dirty: boolean;
    /**
     * @param {Object} init - The init.
     * @private
     */
    constructor(init: {
        readonly rootPrefix?: ReadonlyArray<OpenXmlElement>;
        readonly rootSuffix?: ReadonlyArray<OpenXmlElement>;
        readonly pictureBullets?: ReadonlyArray<NumberingPictureBullet>;
        readonly abstractNumberings?: ReadonlyArray<AbstractNumbering>;
        readonly numberings?: ReadonlyArray<NumberingInstance>;
        readonly numIdMacAtCleanup?: number;
        readonly dirty: boolean;
        readonly rootNamespaceDeclarations?: ReadonlyArray<NamespaceDeclaration>;
        readonly rootAttributes?: ReadonlyArray<OpenXmlAttribute>;
    }) {
        this.rootPrefix = [...(init.rootPrefix != null ? init.rootPrefix : [])];
        this.rootSuffix = [...(init.rootSuffix != null ? init.rootSuffix : [])];
        this.pictureBulletList = [...(init.pictureBullets != null ? init.pictureBullets : [])];
        this.abstractNumberingList = [...(init.abstractNumberings != null ? init.abstractNumberings : [])];
        this.numberingList = [...(init.numberings != null ? init.numberings : [])];
        this.abstractById = new Map();
        this.numberingById = new Map();
        this.pictureById = new Map();
        for (const pic of this.pictureBulletList) {
            this.pictureById.set(pic.numPicBulletId, pic);
        }
        for (const abs of this.abstractNumberingList) {
            this.abstractById.set(abs.abstractNumId, abs);
        }
        for (const num of this.numberingList) {
            this.numberingById.set(num.numId, num);
        }
        this.numIdMacAtCleanupValue = init.numIdMacAtCleanup;
        this.rootNamespaceDeclarations = init.rootNamespaceDeclarations != null ? init.rootNamespaceDeclarations : [];
        this.rootAttributes = init.rootAttributes != null ? init.rootAttributes : [];
        this.pendingNumIds = new Set();
        this.pendingDecimalNumIds = new Set();
        this.pendingHtmlDecimalNumIds = new Set();
        this.pendingHtmlNumFmt = new Map();
        this.dirty = init.dirty;
    }
    /** Ordered picture bullet definitions (`w:numPicBullet`). */
    get pictureBullets(): ReadonlyArray<NumberingPictureBullet> {
        return this.pictureBulletList;
    }
    /** Ordered abstract numbering definitions (`w:abstractNum`). */
    get abstractNumberings(): ReadonlyArray<AbstractNumbering> {
        return this.abstractNumberingList;
    }
    /** Ordered numbering instances (`w:num`). */
    get numberings(): ReadonlyArray<NumberingInstance> {
        return this.numberingList;
    }
    /** Optional `w:numIdMacAtCleanup/@w:val`. */
    get numIdMacAtCleanup(): number | undefined {
        return this.numIdMacAtCleanupValue;
    }
    /**
     *  Lookup abstract definition by id.
     *
     * @param {number} abstractNumId - Specifies the abstract num id.
     * @returns {AbstractNumbering | undefined} Returns the result.
     */
    getAbstractNumbering(abstractNumId: number): AbstractNumbering | undefined {
        return this.abstractById.get(abstractNumId);
    }
    /**
     *  Lookup numbering instance by id.
     *
     * @param {number} numId - Specifies the num id.
     * @returns {NumberingInstance | undefined} Returns the result.
     */
    getNumbering(numId: number): NumberingInstance | undefined {
        return this.numberingById.get(numId);
    }
    /**
     *  Lookup picture bullet by id.
     *
     * @param {number} numPicBulletId - Specifies the num pic bullet id.
     * @returns {NumberingPictureBullet | undefined} Returns the result.
     */
    getPictureBullet(numPicBulletId: number): NumberingPictureBullet | undefined {
        return this.pictureById.get(numPicBulletId);
    }
    /**
     *  Whether a numbering instance id exists in the catalog (including pending).
     *
     * @param {number} numId - Specifies the num id.
     * @returns {boolean} Returns the result.
     */
    hasInstance(numId: number): boolean {
        return this.numberingById.has(numId) || this.pendingNumIds.has(numId);
    }
    /**
     * Ensure a numbering instance exists, creating a nine-level default definition when absent.
     *
     * @param {number} numId - Specifies the num id.
     * @param {Object} format - Specifies the list format used when creating a new abstract numbering definition.
     *   `'bullet'` (default) produces the standard bullet pattern; `'decimal'` produces the
     *   cycling `decimal` / `lowerLetter` / `lowerRoman` pattern. Has no effect if the
     *   instance already exists.
     * @param {string} htmlNumFmt - The html num fmt.
     * @returns {void} Nothing is returned.
     */
    ensureInstance(numId: number, format: 'bullet' | 'decimal' | 'html-decimal' = 'bullet', htmlNumFmt: string = 'decimal'): void {
        if (numId < 1) {
            throw new DocxError('content/invalid-num-id', 'Numbering instance id must be at least 1');
        }
        if (this.numberingById.has(numId)) {
            return;
        }
        const abstractNumId: number = this.nextAbstractNumId();
        const abstract: AbstractNumbering = createDefaultAbstractNumbering(abstractNumId, format, htmlNumFmt);
        const instance: NumberingInstance = createNumberingInstance(numId, abstractNumId);
        this.abstractNumberingList.push(abstract);
        this.abstractById.set(abstractNumId, abstract);
        this.numberingList.push(instance);
        this.numberingById.set(numId, instance);
        this.dirty = true;
    }
    /**
     * Allocate a new bullet list instance id with a nine-level bullet definition on materialize.
     *
     * @returns {number} Returns the result.
     */
    createBulletInstance(): number {
        const numId: number = this.nextNumId();
        this.pendingNumIds.add(numId);
        return numId;
    }
    /**
     * Allocate a new decimal (numbered) list instance id with a nine-level definition on materialize.
     *
     * The cycling pattern (`decimal` / `lowerLetter` / `lowerRoman`) is materialized at
     * save time when the paragraph's `numbering` property is set.
     *
     * @param {string} numFmt - The num fmt.
     * @returns {number} The result.
     */
    createHtmlDecimalInstance(numFmt: string = 'decimal'): number {
        const numId: number = this.nextNumId();
        this.pendingHtmlDecimalNumIds.add(numId);
        this.pendingNumIds.add(numId);
        this.pendingHtmlNumFmt.set(numId, numFmt);
        return numId;
    }
    createDecimalInstance(): number {
        const numId: number = this.nextNumId();
        this.pendingDecimalNumIds.add(numId);
        this.pendingNumIds.add(numId);
        return numId;
    }
    /**
     * Register an existing abstract numbering definition and mark the part dirty.
     *
     * @param {AbstractNumbering} abstract - The abstract.
     * @returns {void} Nothing is returned.
     * @private
     */
    registerAbstract(abstract: AbstractNumbering): void {
        if (this.abstractById.has(abstract.abstractNumId)) {
            throw new DocxError(
                'content/invalid-num-id',
                `Abstract numbering id ${String(abstract.abstractNumId)} already exists`
            );
        }
        this.abstractNumberingList.push(abstract);
        this.abstractById.set(abstract.abstractNumId, abstract);
        this.dirty = true;
    }
    /**
     * Allocate the next unused abstract numbering id.
     *
     * @returns {number} The result.
     * @private
     */
    allocateAbstractNumId(): number {
        return this.nextAbstractNumId();
    }
    /**
     * Create a concrete `w:num` linked to an existing abstract definition.
     *
     * @param {number} abstractNumId - Existing abstract id.
     * @param {number} startOverride - Optional level-0 start override.
     * @returns {number} The result.
     * @private
     */
    createInstanceFromAbstract(abstractNumId: number, startOverride?: number): number {
        if (!this.abstractById.has(abstractNumId)) {
            throw new DocxError(
                'content/invalid-num-id',
                `Abstract numbering id ${String(abstractNumId)} is not defined`
            );
        }
        const numId: number = this.nextNumId();
        const instance: NumberingInstance = createNumberingInstance(numId, abstractNumId);
        if (startOverride !== undefined) {
            instance.setStartOverride(0, startOverride);
        }
        this.numberingList.push(instance);
        this.numberingById.set(numId, instance);
        this.dirty = true;
        return numId;
    }
    /**
     * Mark the numbering part dirty after an in-place abstract/level mutation.
     *
     * @returns {void} Nothing is returned.
     * @private
     */
    markDirty(): void {
        this.dirty = true;
    }
    /**
     * @param {number} numId - The num id.
     * @param {string | string} format - The format.
     * @returns {void} Nothing is returned.
     * @private
     * Track a numbering instance referenced before save.
     */
    registerPendingInstance(numId: number, format: 'bullet' | 'decimal' | 'html-decimal' = 'bullet'): void {
        if (this.numberingById.has(numId)) {
            return;
        }
        this.pendingNumIds.add(numId);
        if (format === 'decimal') {
            this.pendingDecimalNumIds.add(numId);
        }
    }
    /**
     * @param {number} numId - The num id.
     * @returns {boolean} The result.
     * @private
     * Whether a pending (not yet materialized) numbering id was allocated as decimal.
     */
    isPendingDecimal(numId: number): boolean {
        return this.pendingDecimalNumIds.has(numId);
    }
    /**
     * @param {WordDocument} document - The document.
     * @returns {void} Nothing is returned.
     * @private
     */
    materializePending(document: WordDocument): void {
        const ordered: number[] = [];
        const seen: Set<number> = new Set<number>();
        visitParagraphsInDocumentOrder(document, (paragraph: Paragraph) => {
            const numId: number = paragraph.numId;
            // Word uses numId 0 to mean "no numbering"; never materialize it.
            if (numId === undefined || numId < 1 || this.numberingById.has(numId) || seen.has(numId)) {
                return;
            }
            seen.add(numId);
            ordered.push(numId);
        });
        for (const numId of ordered) {
            const format: 'bullet' | 'decimal' | 'html-decimal' = this.pendingHtmlDecimalNumIds.has(numId)
                ? 'html-decimal'
                : this.pendingDecimalNumIds.has(numId) ? 'decimal' : 'bullet';
            const htmlNumFmt: string = this.pendingHtmlDecimalNumIds.has(numId)
                ? (this.pendingHtmlNumFmt.get(numId) != null ? this.pendingHtmlNumFmt.get(numId) : 'decimal')
                : 'decimal';
            this.ensureInstance(numId, format, htmlNumFmt);
            this.pendingNumIds.delete(numId);
            this.pendingDecimalNumIds.delete(numId);
            this.pendingHtmlDecimalNumIds.delete(numId);
        }
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
        const children: OpenXmlChild[] = [...this.rootPrefix];
        for (const pic of this.pictureBulletList) {
            children.push(pic.toOpenXml());
        }
        for (const abs of this.abstractNumberingList) {
            children.push(abs.toOpenXml());
        }
        for (const num of this.numberingList) {
            children.push(num.toOpenXml());
        }
        if (this.numIdMacAtCleanupValue !== undefined) {
            children.push(wmlElement('numIdMacAtCleanup', {
                attributes: [wmlAttr('val', String(this.numIdMacAtCleanupValue))]
            }));
        }
        children.push(...this.rootSuffix);
        const root: OpenXmlElement = wmlElement('numbering', {
            attributes: this.rootAttributes,
            namespaceDeclarations: closePartNamespaces(this.rootNamespaceDeclarations, children, this.rootAttributes),
            children
        });
        return utf8.encode(serializeXml(root));
    }
    private nextNumId(): number {
        let max: number = 0;
        for (const id of this.numberingById.keys()) {
            if (id > max) {
                max = id;
            }
        }
        for (const id of this.pendingNumIds) {
            if (id > max) {
                max = id;
            }
        }
        return max + 1;
    }
    private nextAbstractNumId(): number {
        let max: number = -1;
        for (const id of this.abstractById.keys()) {
            if (id > max) {
                max = id;
            }
        }
        return max + 1;
    }
}
function parseNumberingRoot(root: OpenXmlElement): {
    rootPrefix: OpenXmlElement[];
    rootSuffix: OpenXmlElement[];
    pictureBullets: NumberingPictureBullet[];
    abstractNumberings: AbstractNumbering[];
    numberings: NumberingInstance[];
    numIdMacAtCleanup: number | undefined;
} {
    let ts330: any;
    const rootPrefix: OpenXmlElement[] = [];
    const rootSuffix: OpenXmlElement[] = [];
    const pictureBullets: NumberingPictureBullet[] = [];
    const abstractNumberings: AbstractNumbering[] = [];
    const numberings: NumberingInstance[] = [];
    let numIdMacAtCleanup: number | undefined;
    let afterPrimary: boolean = false;
    for (const child of elementChildren(root)) {
        if (isWml(child, 'numPicBullet')) {
            const pic: NumberingPictureBullet = parseNumberingPictureBullet(child);
            if (pic !== undefined) {
                pictureBullets.push(pic);
                afterPrimary = true;
            }
            else if (!afterPrimary && abstractNumberings.length === 0 && numberings.length === 0) {
                rootPrefix.push(child);
            }
            else {
                rootSuffix.push(child);
            }
            continue;
        }
        if (isWml(child, 'abstractNum')) {
            afterPrimary = true;
            const entry: AbstractNumbering = parseAbstractNumbering(child);
            if (entry !== undefined) {
                abstractNumberings.push(entry);
            }
            else {
                rootSuffix.push(child);
            }
            continue;
        }
        if (isWml(child, 'num')) {
            afterPrimary = true;
            const entry: NumberingInstance = parseNumberingInstance(child);
            if (entry !== undefined) {
                numberings.push(entry);
            }
            else {
                rootSuffix.push(child);
            }
            continue;
        }
        if (isWml(child, 'numIdMacAtCleanup')) {
            afterPrimary = true;
            const raw: string = ((ts330 = child.attributes.find((a: OpenXmlAttribute) => a.localName === 'val' && a.namespaceUri === WML_TRANSITIONAL_NAMESPACE)), ts330 == null ? undefined : ts330.value);
            if (raw !== undefined && /^-?\d+$/.test(raw) && numIdMacAtCleanup === undefined) {
                numIdMacAtCleanup = Number.parseInt(raw, 10);
            }
            else {
                rootSuffix.push(child);
            }
            continue;
        }
        if (!afterPrimary && abstractNumberings.length === 0 && numberings.length === 0) {
            rootPrefix.push(child);
        }
        else {
            rootSuffix.push(child);
        }
    }
    return {
        rootPrefix,
        rootSuffix,
        pictureBullets,
        abstractNumberings,
        numberings,
        numIdMacAtCleanup
    };
}
function loadNumberingPart(part: PackagePart | undefined): NumberingPart {
    if (part === undefined) {
        return new NumberingPart({ dirty: false });
    }
    const root: OpenXmlElement = parseXml(decodeXmlBytes(part.data));
    if (!isWml(root, 'numbering')) {
        return new NumberingPart({ dirty: false });
    }
    const parsed: {
        rootPrefix: OpenXmlElement[];
        rootSuffix: OpenXmlElement[];
        pictureBullets: NumberingPictureBullet[];
        abstractNumberings: AbstractNumbering[];
        numberings: NumberingInstance[];
        numIdMacAtCleanup: number;
    } = parseNumberingRoot(root);
    return new NumberingPart({
        rootPrefix: parsed.rootPrefix,
        rootSuffix: parsed.rootSuffix,
        pictureBullets: parsed.pictureBullets,
        abstractNumberings: parsed.abstractNumberings,
        numberings: parsed.numberings,
        ...(parsed.numIdMacAtCleanup !== undefined
            ? { numIdMacAtCleanup: parsed.numIdMacAtCleanup }
            : {}),
        dirty: false,
        rootNamespaceDeclarations: root.namespaceDeclarations,
        rootAttributes: root.attributes
    });
}
let registered: boolean = false;
/**
 * @returns {void} Nothing is returned.
 * @private
 * Test hook
 */
export function resetNumberingFeatureForTests(): void {
    registered = false;
}
/**
 * @returns {void} Nothing is returned.
 * @private
 * Register the numbering package-part handler. Idempotent.
 */
export function registerNumberingFeature(): void {
    if (registered) {
        return;
    }
    registered = true;
    registerFeature({ id: NUMBERING });
    registerFeaturePartHandler({
        featureId: NUMBERING,
        relationshipTypes: [NUMBERING_RELATIONSHIP_TYPE, STRICT_NUMBERING_RELATIONSHIP_TYPE],
        defaultRelativeTarget: 'numbering.xml',
        partName: NUMBERING_PART_NAME,
        contentType: NUMBERING_CONTENT_TYPE,
        loadPart(part: PackagePart | undefined, ctx: FeaturePartLoadContext): NumberingPart {
            void ctx;
            return loadNumberingPart(part);
        }
    });
    registerFeatureMaterializeHandler({
        featureId: NUMBERING,
        materialize(document: WordDocument): void {
            const part: FeaturePartState = document.featurePart(NUMBERING);
            if (part instanceof NumberingPart) {
                part.materializePending(document);
            }
        }
    });
}
/**
 * Numbering catalog for a document.
 *
 * On the default `@syncfusion/ej2-docx` entry, numbering is always-on: the package-part
 * handler is registered at module load and re-armed via
 * {@link registerAlwaysOnBodyFeatureBootstrap} before each
 * {@link WordDocument.create} / load. On {@link WordDocument.create}, feature package
 * parts are not pre-attached; this attaches an empty {@link NumberingPart} so
 * authoring APIs (`createBulletInstance`, paragraph numbering) work without a load.
 *
 * @param {WordDocument} document - The document.
 * @returns {NumberingPart} The result.
 * @throws DocxError `feature/not-registered` when the numbering module was not
 * registered (pure core path without the main entry / numbering subpath).
 * @private
 */
export function numberingFor(document: WordDocument): NumberingPart {
    const existing: FeaturePartState = document.featurePart(NUMBERING);
    if (existing instanceof NumberingPart) {
        return existing;
    }
    if (!isFeatureRegistered(NUMBERING) || existing !== undefined) {
        throw new DocxError('feature/not-registered', 'Numbering part was not loaded; call registerNumberingFeature() before WordDocument.open');
    }
    const empty: NumberingPart = new NumberingPart({ dirty: false });
    document.setFeaturePart(NUMBERING, empty);
    return empty;
}
/**
 * Specifies the type of list that is created.
 *
 * @public
 */
export type ListFormatType = 'bullet' | 'decimal';

/**
 * @param {Paragraph} paragraph - The paragraph.
 * @param {Object} value - The value.
 * @returns {void} Nothing is returned.
 *  Helper to apply numbering to a paragraph via the legacy numbering property.
 * @deprecated Use paragraph.listFormat.* methods instead; the numbering property remains
 * for backward compatibility but is not the canonical public API.
 *
 * @private
 */
function applyParagraphNumbering(
    paragraph: Paragraph,
    value:
    | {
        readonly numId: number;
        readonly level?: number;
    }
    | undefined
): void {
    if (value === undefined) {
        paragraph.numId = undefined;
        paragraph.listLevel = undefined;
        return;
    }
    const numbering: NumberingPart = numberingFor(paragraph.owningDocument());
    const level: number = value.level != null ? value.level : 0;
    const listId: number = value.numId;
    if (numbering.getNumbering(listId) === undefined) {
        if (numbering.hasInstance(listId)) {
            numbering.registerPendingInstance(listId, 'bullet');
        } else {
            numbering.ensureInstance(listId, 'bullet');
        }
    } else {
        numbering.registerPendingInstance(listId);
    }
    paragraph.numId = listId;
    paragraph.listLevel = level;
}

Object.defineProperty(Paragraph.prototype, 'numbering', {
    set(
        this: Paragraph,
        value:
        | {
            numId: number;
            level?: number;
        }
        | undefined
    ): void {
        applyParagraphNumbering(this, value);
    }
});

// Always-on on the main `@syncfusion/ej2-docx` entry: package-part handler for numbering.xml
// re-arms after test handler resets via WordDocument.create / fromPackage.
registerAlwaysOnBodyFeatureBootstrap(() => {
    registerNumberingFeature();
});
registerNumberingFeature();
