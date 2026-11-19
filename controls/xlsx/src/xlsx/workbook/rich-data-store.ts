/**
 * Workbook-level store for the metadata and rich-value parts behind Picture in Cell.
 *
 * Follows the persons / pivot stores: it loads from the package when a workbook
 * opens, stays untouched while nothing changes (a no-op open and save keeps the
 * original bytes), and rewrites the parts on save only after a placed picture
 * was added, changed or removed.
 *
 * Reference chain ([MS-XLSX] §2.3.6.1.8, ECMA-376-1 §18.3.1.4):
 * `c/@vm` → `valueMetadata/bk/rc@v` (type `XLRICHVALUE`) → `futureMetadata/bk` `xlrd:rvb@i`
 * → `rdrichvalue.xml` `rv` (structure `_localImage`) → `richValueRel.xml` `rel` → image part.
 *
 * @private
 */

import { InvalidWorkbookError } from '../core/errors';
import {
    IMAGE_RELATIONSHIP_TYPE,
    RD_RICH_VALUE_CONTENT_TYPE,
    RD_RICH_VALUE_REL_TYPE,
    RD_RICH_VALUE_STRUCTURE_CONTENT_TYPE,
    RD_RICH_VALUE_STRUCTURE_REL_TYPE,
    RD_RICH_VALUE_TYPES_CONTENT_TYPE,
    RD_RICH_VALUE_TYPES_REL_TYPE,
    RICH_VALUE_REL_CONTENT_TYPE,
    RICH_VALUE_REL_REL_TYPE,
    SHEET_METADATA_CONTENT_TYPE,
    SHEET_METADATA_REL_TYPE
} from '../core/package/constants';
import { OpcPackage, OpcPart } from '../core/package/opc-package';
import { partNamesEqual } from '../core/package/part-names';
import { removePartIfUnreferenced } from '../core/package/part-references';
import { OpcRelationship } from '../core/package/relationships';
import { decodeUtf8, encodeUtf8 } from '../core/xml/minimal-xml';
import { ImageContentType, ImageEntry, isImageContentType, LoadedPlacedPicture, extensionFor, relativeTarget } from '../worksheet/images';
import {
    CALC_ORIGIN_STANDALONE, createEmptyRichData, defaultTypesInfoXml, ensureLocalImageStructure, FutureMetadata,
    localImageValue, parseMetadataXml, parseRichStructureXml, parseRichValueRelIds, parseRichValueXml, readLocalImage, RichDataModel,
    richValueBlock, richValueFuture, richValueTypeIndex, richValueTypeXml, RICH_VALUE_TYPE_NAME, RichValueRecord, rvbBlockXml,
    rvbIndexOf, serializeMetadataXml, serializeRichStructureXml, serializeRichValueRelXml, serializeRichValueXml, ValueBlock, XLRD_NS
} from './rich-data';

const DEFAULT_METADATA_PART: string = '/xl/metadata.xml';
const DEFAULT_VALUE_PART: string = '/xl/richData/rdrichvalue.xml';
const DEFAULT_STRUCTURE_PART: string = '/xl/richData/rdrichvaluestructure.xml';
const DEFAULT_TYPES_PART: string = '/xl/richData/rdRichValueTypes.xml';
const DEFAULT_REL_PART: string = '/xl/richData/richValueRel.xml';

/**
 * A worksheet as the store needs to see it.
 *
 * @private
 */
export interface RichDataSheet {
    /** True once the sheet's cells were read from the package. */
    isSheetDataLoaded(): boolean;
    ensureSheetDataLoaded(): void;
    /** Pictures placed in a cell. */
    placedPictures(): ImageEntry[];
    /** Every cell that carries a `vm`. */
    vmCells(): Array<{ readonly row: number; readonly col: number; readonly vm: number }>;
    setCellVm(row: number, col: number, vm: number | undefined): void;
    /** True while the cell still holds the `#VALUE!` placeholder. */
    isPlaceholderCell(row: number, col: number): boolean;
    dropPlaced(entry: ImageEntry): void;
    takeReleasedMedia(): string[];
}

interface PartNames {
    metadata: string | undefined;
    value: string | undefined;
    structure: string | undefined;
    rel: string | undefined;
    types: string | undefined;
}

/**
 * Placed picture fields from rich data (without host cell coordinates or vm index).
 * Compatible with TypeScript 3.3.1 (Omit not available until 3.4).
 *
 * @private
 */
interface ResolvedPlacedPicture {
    readonly bytes: Uint8Array;
    readonly contentType: ImageContentType;
    readonly mediaPartName: string;
    readonly description: string | undefined;
    readonly calcOrigin: number | undefined;
}

function relOfType(rels: ReadonlyArray<OpcRelationship>, type: string): OpcRelationship | undefined {
    return rels.find((r: OpcRelationship): boolean => r.type === type);
}

/**
 * The name a part is stored under. Writers differ in the case of the names in relationship
 * targets (XlsIO writes `richdata/` for `richData/` entries); lookups of a part's own
 * relationships need the stored name.
 */
function storedName(pkg: OpcPackage, rel: OpcRelationship | undefined): string | undefined {
    if (rel === undefined) {
        return undefined;
    }
    return storedTarget(pkg, rel);
}

function storedTarget(pkg: OpcPackage, rel: OpcRelationship): string {
    const part: OpcPart | undefined = pkg.getPart(rel.resolvedTarget);
    return part === undefined ? rel.resolvedTarget : part.name;
}

function replaceRvbIndex(blockXml: string, index: number): string {
    return blockXml.replace(/(<(?:[A-Za-z_][\w.-]*:)?rvb\b[^>]*\bi=")\d+(")/, `$1${index}$2`);
}

/**
 * The metadata and rich-value state of one workbook.
 *
 * @private
 */
export class RichDataStore {
    private readonly pkg: OpcPackage;
    private model: RichDataModel = createEmptyRichData();
    private readonly names: PartNames = { metadata: undefined, value: undefined, structure: undefined, rel: undefined, types: undefined };
    private unreadable: boolean = false;
    private dirty: boolean = false;
    private pendingWrite: boolean = false;
    private droppedMedia: string[] = [];

    /**
     * Creates an empty store over `pkg`.
     *
     * @param {OpcPackage} pkg - Workbook package.
     *
     * @private
     */
    public constructor(pkg: OpcPackage) {
        this.pkg = pkg;
    }

    /**
     * Read the metadata and rich-value parts the workbook already holds.
     *
     * @param {ReadonlyArray<OpcRelationship>} rels - Workbook relationships.
     * @returns {void}
     *
     * @private
     */
    public load(rels: ReadonlyArray<OpcRelationship>): void {
        const metadata: OpcRelationship | undefined = relOfType(rels, SHEET_METADATA_REL_TYPE);
        const value: OpcRelationship | undefined = relOfType(rels, RD_RICH_VALUE_REL_TYPE);
        const structure: OpcRelationship | undefined = relOfType(rels, RD_RICH_VALUE_STRUCTURE_REL_TYPE);
        const relPart: OpcRelationship | undefined = relOfType(rels, RICH_VALUE_REL_REL_TYPE);
        const types: OpcRelationship | undefined = relOfType(rels, RD_RICH_VALUE_TYPES_REL_TYPE);
        this.names.metadata = storedName(this.pkg, metadata);
        this.names.value = storedName(this.pkg, value);
        this.names.structure = storedName(this.pkg, structure);
        this.names.rel = storedName(this.pkg, relPart);
        this.names.types = storedName(this.pkg, types);
        if (this.names.metadata === undefined) {
            return;
        }
        const metadataPart: OpcPart | undefined = this.pkg.getPart(this.names.metadata);
        if (metadataPart === undefined || !parseMetadataXml(decodeUtf8(metadataPart.data), this.model)) {
            this.unreadable = true;
            return;
        }
        this.loadRichParts();
        const typesPart: OpcPart | undefined = this.names.types === undefined ? undefined : this.pkg.getPart(this.names.types);
        this.model.typesInfoXml = typesPart === undefined ? undefined : decodeUtf8(typesPart.data);
    }

    private loadRichParts(): void {
        const valuePart: OpcPart | undefined = this.names.value === undefined ? undefined : this.pkg.getPart(this.names.value);
        const structurePart: OpcPart | undefined = this.names.structure === undefined ? undefined : this.pkg.getPart(this.names.structure);
        const relPart: OpcPart | undefined = this.names.rel === undefined ? undefined : this.pkg.getPart(this.names.rel);
        if (valuePart !== undefined && !parseRichValueXml(decodeUtf8(valuePart.data), this.model)) {
            this.unreadable = true;
        }
        if (structurePart !== undefined && !parseRichStructureXml(decodeUtf8(structurePart.data), this.model)) {
            this.unreadable = true;
        }
        if (relPart !== undefined && this.names.rel !== undefined) {
            const ids: string[] | undefined = parseRichValueRelIds(decodeUtf8(relPart.data));
            if (ids === undefined) {
                this.unreadable = true;
                return;
            }
            const relRels: ReadonlyArray<OpcRelationship> = this.pkg.getRelationships(this.names.rel);
            this.model.relTargets = ids.map((id: string): string => {
                const rel: OpcRelationship | undefined = relRels.find((r: OpcRelationship): boolean => r.id === id && r.type === IMAGE_RELATIONSHIP_TYPE);
                return rel === undefined ? '' : storedTarget(this.pkg, rel);
            });
        }
    }

    /**
     * True when the workbook holds rich values.
     *
     * @returns {boolean} Whether any rich value exists.
     *
     * @private
     */
    public hasData(): boolean {
        return this.model.values.length > 0;
    }

    /**
     * Record that a placed picture was added, changed or removed.
     *
     * @returns {void}
     *
     * @private
     */
    public markDirty(): void {
        this.dirty = true;
    }

    /**
     * Throw when the existing metadata cannot be read and so cannot be extended safely.
     *
     * @returns {void}
     *
     * @private
     */
    public assertWritable(): void {
        if (this.unreadable) {
            throw new InvalidWorkbookError('The workbook metadata part cannot be read, so a picture cannot be placed in a cell');
        }
    }

    /**
     * The picture bound to value-metadata index `vm`, or `undefined` when `vm` is not an in-cell picture.
     *
     * @param {number} vm - 1-based `c/@vm`.
     * @returns {object | undefined} Picture fields without the host cell.
     *
     * @private
     */
    public resolvePicture(vm: number): ResolvedPlacedPicture | undefined {
        const model: RichDataModel = this.model;
        const typeIndex: number = richValueTypeIndex(model);
        const block: ValueBlock | undefined = model.valueBlocks[vm - 1];
        const future: FutureMetadata | undefined = richValueFuture(model);
        const rc: { t: number; v: number } | undefined = block === undefined ? undefined : block.rcs.find((r: { t: number; v: number }): boolean => r.t === typeIndex);
        const futureBlock: string | undefined = rc === undefined || future === undefined ? undefined : future.blocks[rc.v];
        const rvIndex: number | undefined = futureBlock === undefined ? undefined : rvbIndexOf(futureBlock);
        const record: RichValueRecord | undefined = rvIndex === undefined ? undefined : model.values[rvIndex];
        const local: { relIndex: number; calcOrigin: number | undefined; text: string | undefined } | undefined = record === undefined ? undefined : readLocalImage(model, record);
        const target: string | undefined = local === undefined ? undefined : model.relTargets[local.relIndex];
        const part: OpcPart | undefined = target === undefined || target === '' ? undefined : this.pkg.getPart(target);
        if (local === undefined || part === undefined || target === undefined) {
            return undefined;
        }
        const contentType: string | undefined = this.pkg.contentType(part.name);
        if (contentType === undefined || !isImageContentType(contentType)) {
            return undefined;
        }
        return { bytes: part.data, contentType, mediaPartName: part.name, description: local.text, calcOrigin: local.calcOrigin };
    }

    /**
     * Bring the model in line with the pictures placed in cells and assign each its `vm`.
     * Runs before worksheets are written, because `vm` is a cell attribute.
     *
     * @param {RichDataSheet[]} sheets - Every worksheet.
     * @returns {void}
     *
     * @private
     */
    public prepare(sheets: RichDataSheet[]): void {
        for (const sheet of sheets) {
            if (sheet.isSheetDataLoaded()) {
                this.dropOverwrittenHosts(sheet);
            }
        }
        if (!this.dirty) {
            return;
        }
        this.assertWritable();
        for (const sheet of sheets) {
            sheet.ensureSheetDataLoaded();
            this.dropOverwrittenHosts(sheet);
        }
        new Rebuild(this.pkg, this.model, sheets).run((next: RichDataModel, dropped: string[]): void => {
            this.model = next;
            this.droppedMedia = this.droppedMedia.concat(dropped);
        });
        this.dirty = false;
        this.pendingWrite = true;
    }

    private dropOverwrittenHosts(sheet: RichDataSheet): void {
        for (const entry of sheet.placedPictures()) {
            if (!sheet.isPlaceholderCell(entry.row, entry.column)) {
                if (entry.vm !== undefined) {
                    sheet.setCellVm(entry.row, entry.column, undefined);
                }
                sheet.dropPlaced(entry);
                this.dirty = true;
            }
        }
    }

    /**
     * Write the parts, relationships and content types, then remove media nothing references.
     * Runs after worksheets are written.
     *
     * @param {string} workbookPartName - Workbook part.
     * @param {RichDataSheet[]} sheets - Every worksheet.
     * @param {Function} allocateRelationshipId - Next free workbook relationship id.
     * @returns {void}
     *
     * @private
     */
    public write(workbookPartName: string, sheets: RichDataSheet[], allocateRelationshipId: () => string): void {
        if (this.pendingWrite) {
            if (this.model.values.length > 0) {
                this.writeRichParts(workbookPartName, allocateRelationshipId);
            } else {
                this.removeRichParts(workbookPartName);
            }
            this.pendingWrite = false;
        }
        const candidates: string[] = this.droppedMedia.slice();
        for (const sheet of sheets) {
            candidates.push(...sheet.takeReleasedMedia());
        }
        this.droppedMedia = [];
        for (const media of candidates) {
            removePartIfUnreferenced(this.pkg, media);
        }
    }

    private ensureWorkbookRel(workbookPartName: string, type: string, partName: string, allocate: () => string): void {
        const rels: ReadonlyArray<OpcRelationship> = this.pkg.getRelationships(workbookPartName);
        const existing: OpcRelationship | undefined = relOfType(rels, type);
        if (existing !== undefined && partNamesEqual(existing.resolvedTarget, partName)) {
            return;
        }
        const target: string = relativeTarget(workbookPartName, partName);
        const next: OpcRelationship[] = rels.filter((r: OpcRelationship): boolean => r.type !== type);
        next.push({ id: existing === undefined ? allocate() : existing.id, type, target, resolvedTarget: partName });
        this.pkg.setRelationships(workbookPartName, next);
    }

    private writeRichParts(workbookPartName: string, allocate: () => string): void {
        const model: RichDataModel = this.model;
        const metadata: string = this.names.metadata === undefined ? DEFAULT_METADATA_PART : this.names.metadata;
        const value: string = this.names.value === undefined ? DEFAULT_VALUE_PART : this.names.value;
        const structure: string = this.names.structure === undefined ? DEFAULT_STRUCTURE_PART : this.names.structure;
        const types: string = this.names.types === undefined ? DEFAULT_TYPES_PART : this.names.types;
        const relPart: string = this.names.rel === undefined ? DEFAULT_REL_PART : this.names.rel;
        this.names.metadata = metadata;
        this.names.value = value;
        this.names.structure = structure;
        this.names.types = types;
        this.names.rel = relPart;
        this.pkg.setPart(metadata, encodeUtf8(serializeMetadataXml(model)), SHEET_METADATA_CONTENT_TYPE);
        this.pkg.setPart(value, encodeUtf8(serializeRichValueXml(model)), RD_RICH_VALUE_CONTENT_TYPE);
        this.pkg.setPart(structure, encodeUtf8(serializeRichStructureXml(model)), RD_RICH_VALUE_STRUCTURE_CONTENT_TYPE);
        const typesXml: string = model.typesInfoXml === undefined ? defaultTypesInfoXml() : model.typesInfoXml;
        model.typesInfoXml = typesXml;
        this.pkg.setPart(types, encodeUtf8(typesXml), RD_RICH_VALUE_TYPES_CONTENT_TYPE);
        const ids: string[] = model.relTargets.map((_t: string, at: number): string => `rId${at + 1}`);
        this.pkg.setPart(relPart, encodeUtf8(serializeRichValueRelXml(ids)), RICH_VALUE_REL_CONTENT_TYPE);
        this.pkg.setRelationships(relPart, model.relTargets.map((target: string, at: number): OpcRelationship => ({
            id: `rId${at + 1}`, type: IMAGE_RELATIONSHIP_TYPE, target: relativeTarget(relPart, target), resolvedTarget: target
        })));
        this.ensureWorkbookRel(workbookPartName, SHEET_METADATA_REL_TYPE, metadata, allocate);
        this.ensureWorkbookRel(workbookPartName, RD_RICH_VALUE_REL_TYPE, value, allocate);
        this.ensureWorkbookRel(workbookPartName, RD_RICH_VALUE_STRUCTURE_REL_TYPE, structure, allocate);
        this.ensureWorkbookRel(workbookPartName, RD_RICH_VALUE_TYPES_REL_TYPE, types, allocate);
        this.ensureWorkbookRel(workbookPartName, RICH_VALUE_REL_REL_TYPE, relPart, allocate);
    }

    private removeRichParts(workbookPartName: string): void {
        const names: PartNames = this.names;
        const richTypes: string[] = [RD_RICH_VALUE_REL_TYPE, RD_RICH_VALUE_STRUCTURE_REL_TYPE, RD_RICH_VALUE_TYPES_REL_TYPE, RICH_VALUE_REL_REL_TYPE];
        const keepMetadata: boolean = this.model.types.length > 0 || this.model.cellMetadataXml !== undefined || this.model.extraXml.length > 0;
        const dropTypes: string[] = keepMetadata ? richTypes : richTypes.concat(SHEET_METADATA_REL_TYPE);
        for (const name of [names.value, names.structure, names.types, names.rel]) {
            if (name !== undefined) {
                this.pkg.removePart(name);
            }
        }
        if (names.metadata !== undefined) {
            if (keepMetadata) {
                this.pkg.setPart(names.metadata, encodeUtf8(serializeMetadataXml(this.model)), SHEET_METADATA_CONTENT_TYPE);
            } else {
                this.pkg.removePart(names.metadata);
            }
        }
        const rels: ReadonlyArray<OpcRelationship> = this.pkg.getRelationships(workbookPartName);
        const next: OpcRelationship[] = rels.filter((r: OpcRelationship): boolean => dropTypes.indexOf(r.type) < 0);
        if (next.length !== rels.length) {
            this.pkg.setRelationships(workbookPartName, next);
        }
        names.value = undefined;
        names.structure = undefined;
        names.types = undefined;
        names.rel = undefined;
        this.model.typesInfoXml = undefined;
        if (!keepMetadata) {
            names.metadata = undefined;
        }
    }
}

/**
 * One rebuild of the model: keeps what cells still use, appends what new pictures need.
 * Existing entries are renumbered densely so removed pictures leave nothing behind.
 */
class Rebuild {
    private readonly pkg: OpcPackage;
    private readonly old: RichDataModel;
    private readonly sheets: RichDataSheet[];
    private readonly next: RichDataModel = createEmptyRichData();
    private readonly vmMap: Map<number, number> = new Map<number, number>();
    private readonly futureMap: Map<number, number> = new Map<number, number>();
    private readonly valueMap: Map<number, number> = new Map<number, number>();
    private readonly relMap: Map<string, number> = new Map<string, number>();
    private readonly pinRels: boolean;
    private typeIndex: number;
    private future: FutureMetadata | undefined;

    /** @private */
    public constructor(pkg: OpcPackage, old: RichDataModel, sheets: RichDataSheet[]) {
        this.pkg = pkg;
        this.old = old;
        this.sheets = sheets;
        this.typeIndex = richValueTypeIndex(old);
        this.pinRels = old.values.some((rv: RichValueRecord): boolean => readLocalImage(old, rv) === undefined
            && old.structures[rv.s] !== undefined && old.structures[rv.s].keys.some((k: { n: string }): boolean => k.n.indexOf('_rvRel:') === 0));
    }

    /** @private */
    public run(commit: (next: RichDataModel, droppedMedia: string[]) => void): void {
        const old: RichDataModel = this.old;
        const next: RichDataModel = this.next;
        next.rootAttrs = old.rootAttrs.indexOf('xmlns:xlrd') >= 0 ? old.rootAttrs : `${old.rootAttrs} xmlns:xlrd="${XLRD_NS}"`;
        next.types = old.types.slice();
        next.typeNames = old.typeNames.slice();
        next.cellMetadataXml = old.cellMetadataXml;
        next.extraXml = old.extraXml.slice();
        next.structures = old.structures.slice();
        next.typesInfoXml = old.typesInfoXml;
        next.futures = old.futures.map((f: FutureMetadata): FutureMetadata => (f.name === RICH_VALUE_TYPE_NAME ? { name: f.name, blocks: [] } : { name: f.name, blocks: f.blocks.slice() }));
        this.future = next.futures.find((f: FutureMetadata): boolean => f.name === RICH_VALUE_TYPE_NAME);
        if (this.pinRels) {
            next.relTargets = old.relTargets.slice();
        }
        const live: number[] = this.liveVms();
        for (const vm of live) {
            this.keepBlock(vm);
        }
        const fresh: Array<{ sheet: RichDataSheet; entry: ImageEntry }> = [];
        for (const sheet of this.sheets) {
            for (const entry of sheet.placedPictures()) {
                if (entry.vm === undefined || !this.vmMap.has(entry.vm)) {
                    fresh.push({ sheet, entry });
                } else {
                    entry.vm = this.vmMap.get(entry.vm);
                }
            }
        }
        for (const item of fresh) {
            this.addPicture(item.entry);
        }
        this.remapCells();
        for (const item of fresh) {
            item.sheet.setCellVm(item.entry.row, item.entry.column, item.entry.vm);
        }
        this.refreshDescriptions();
        this.dropEmptyType();
        const dropped: string[] = old.relTargets.filter((t: string): boolean => t !== '' && next.relTargets.indexOf(t) < 0);
        commit(next, dropped);
    }

    private liveVms(): number[] {
        const seen: Set<number> = new Set<number>();
        for (const sheet of this.sheets) {
            for (const cell of sheet.vmCells()) {
                if (cell.vm >= 1 && cell.vm <= this.old.valueBlocks.length) {
                    seen.add(cell.vm);
                }
            }
        }
        return Array.from(seen).sort((a: number, b: number): number => a - b);
    }

    private keepBlock(vm: number): void {
        const block: ValueBlock = this.old.valueBlocks[vm - 1];
        const rcs: Array<{ t: number; v: number }> = block.rcs.map((rc: { t: number; v: number }): { t: number; v: number } =>
            (rc.t === this.typeIndex ? { t: rc.t, v: this.keepFuture(rc.v) } : { t: rc.t, v: rc.v }));
        const xml: string = block.rcs.length === 0 ? block.xml : `<bk>${rcs.map((rc: { t: number; v: number }): string => `<rc t="${rc.t}" v="${rc.v}"/>`).join('')}</bk>`;
        this.next.valueBlocks.push({ xml, rcs });
        this.vmMap.set(vm, this.next.valueBlocks.length);
    }

    private keepFuture(index: number): number {
        const known: number | undefined = this.futureMap.get(index);
        const oldFuture: FutureMetadata | undefined = richValueFuture(this.old);
        const blockXml: string | undefined = oldFuture === undefined ? undefined : oldFuture.blocks[index];
        if (known !== undefined || blockXml === undefined || this.future === undefined) {
            return known === undefined ? index : known;
        }
        const rv: number | undefined = rvbIndexOf(blockXml);
        const mapped: number | undefined = rv === undefined ? undefined : this.keepValue(rv);
        this.future.blocks.push(mapped === undefined ? blockXml : replaceRvbIndex(blockXml, mapped));
        this.futureMap.set(index, this.future.blocks.length - 1);
        return this.future.blocks.length - 1;
    }

    private keepValue(index: number): number {
        const known: number | undefined = this.valueMap.get(index);
        const record: RichValueRecord | undefined = this.old.values[index];
        if (known !== undefined || record === undefined) {
            return known === undefined ? index : known;
        }
        const local: { relIndex: number; calcOrigin: number | undefined; text: string | undefined } | undefined = readLocalImage(this.old, record);
        if (local === undefined || this.pinRels) {
            this.next.values.push(record);
        } else {
            this.next.values.push(localImageValue(record.s, this.keepRel(this.old.relTargets[local.relIndex]), local.calcOrigin === undefined ? CALC_ORIGIN_STANDALONE : local.calcOrigin, local.text));
        }
        this.valueMap.set(index, this.next.values.length - 1);
        return this.next.values.length - 1;
    }

    private keepRel(target: string): number {
        const known: number | undefined = this.relMap.get(target);
        if (known !== undefined) {
            return known;
        }
        this.next.relTargets.push(target);
        this.relMap.set(target, this.next.relTargets.length - 1);
        return this.next.relTargets.length - 1;
    }

    private ensureType(): void {
        if (this.typeIndex > 0) {
            return;
        }
        this.next.types.push(richValueTypeXml());
        this.next.typeNames.push(RICH_VALUE_TYPE_NAME);
        this.typeIndex = this.next.types.length;
    }

    private ensureFuture(): FutureMetadata {
        if (this.future === undefined) {
            this.future = { name: RICH_VALUE_TYPE_NAME, blocks: [] };
            this.next.futures.push(this.future);
        }
        return this.future;
    }

    private mediaFor(entry: ImageEntry): string {
        const existing: string | undefined = entry.mediaPartName;
        if (existing !== undefined && this.pkg.getPart(existing) !== undefined) {
            return existing;
        }
        const ext: string = extensionFor(entry.contentType);
        let at: number = 1;
        while (this.pkg.getPart(`/xl/media/image${at}.${ext}`) !== undefined) {
            at += 1;
        }
        const name: string = `/xl/media/image${at}.${ext}`;
        this.pkg.setPart(name, entry.bytes, entry.contentType);
        entry.mediaPartName = name;
        return name;
    }

    private addPicture(entry: ImageEntry): void {
        this.ensureType();
        const future: FutureMetadata = this.ensureFuture();
        const structure: number = ensureLocalImageStructure(this.next, entry.description !== undefined);
        const relIndex: number = this.keepRel(this.mediaFor(entry));
        const calcOrigin: number = entry.calcOrigin === undefined ? CALC_ORIGIN_STANDALONE : entry.calcOrigin;
        this.next.values.push(localImageValue(structure, relIndex, calcOrigin, entry.description));
        future.blocks.push(rvbBlockXml(this.next.values.length - 1));
        this.next.valueBlocks.push(richValueBlock(this.typeIndex, future.blocks.length - 1));
        entry.vm = this.next.valueBlocks.length;
    }

    private remapCells(): void {
        for (const sheet of this.sheets) {
            for (const cell of sheet.vmCells()) {
                const mapped: number | undefined = this.vmMap.get(cell.vm);
                if (mapped !== undefined && mapped !== cell.vm) {
                    sheet.setCellVm(cell.row, cell.col, mapped);
                }
            }
        }
    }

    /** Re-write each loaded picture's alt text from its `description`. */
    private refreshDescriptions(): void {
        const future: FutureMetadata | undefined = this.future;
        for (const sheet of this.sheets) {
            for (const entry of sheet.placedPictures()) {
                const block: ValueBlock | undefined = entry.vm === undefined ? undefined : this.next.valueBlocks[entry.vm - 1];
                const rc: { t: number; v: number } | undefined = block === undefined ? undefined : block.rcs.find((r: { t: number; v: number }): boolean => r.t === this.typeIndex);
                const rvIndex: number | undefined = rc === undefined || future === undefined ? undefined : rvbIndexOf(future.blocks[rc.v]);
                const record: RichValueRecord | undefined = rvIndex === undefined ? undefined : this.next.values[rvIndex];
                const local: { relIndex: number; calcOrigin: number | undefined; text: string | undefined } | undefined = record === undefined ? undefined : readLocalImage(this.next, record);
                if (rvIndex !== undefined && local !== undefined && local.text !== entry.description) {
                    const structure: number = ensureLocalImageStructure(this.next, entry.description !== undefined);
                    this.next.values[rvIndex] = localImageValue(structure, local.relIndex, local.calcOrigin === undefined ? CALC_ORIGIN_STANDALONE : local.calcOrigin, entry.description);
                }
            }
        }
    }

    /** Remove the `XLRICHVALUE` declaration when nothing uses it and it can be removed without renumbering other types. */
    private dropEmptyType(): void {
        const next: RichDataModel = this.next;
        if (next.values.length > 0 || this.typeIndex === 0 || this.typeIndex !== next.types.length) {
            return;
        }
        next.types.pop();
        next.typeNames.pop();
        next.futures = next.futures.filter((f: FutureMetadata): boolean => f.name !== RICH_VALUE_TYPE_NAME);
        next.structures = next.structures.filter((s: { t: string }): boolean => s.t !== '_localImage');
        this.typeIndex = 0;
    }
}
