/**
 * Worksheet pictures as floating DrawingML objects.
 *
 * Pictures are stored above the worksheet grid in a spreadsheet drawing part.
 * The implementation follows the existing text-box and autoshape drawing
 * pipeline: package side effects are deferred until worksheet flush/save.
 *
 * Picture package-part content-type tokens (`ImageContentType` /
 * `ImageContentTypes`) are internal. Drawing identity fields on {@link Image}
 * (`id`, `relationshipId`, `contentType`, `name`, `description`) are also
 * internal. Public authoring is position and size via
 * {@link ImagesImpl.add} / `Worksheet.addImage` (format sniffed from bytes).
 */

import { InvalidArgumentError } from '../core/errors';
import { readImagePixelSize } from './image-size';
import { EMU_PER_PT } from '../core/length';
import {
    DRAWING_CONTENT_TYPE,
    DRAWING_REL_TYPE_TRANSITIONAL,
    isDrawingRelationshipType
} from '../core/package/constants';
import { OpcPackage, OpcPart } from '../core/package/opc-package';
import { normalizePartName, resolveRelationshipTarget } from '../core/package/part-names';
import { OpcRelationship } from '../core/package/relationships';
import { encodeUtf8, escapeXml, decodeUtf8, unescapeXml } from '../core/xml/minimal-xml';
import {
    anchorToAbsoluteLeftPt,
    anchorToAbsoluteTopPt,
    applyAbsoluteLeft,
    applyAbsoluteTop,
    pointsToEmu,
    requireNonNegativePoints,
    requirePositiveInt,
    requirePositivePoints,
    SheetMetrics,
    twoCellAnchorHeightEmu,
    twoCellAnchorWidthEmu
} from './drawing-placement';

const IMAGE_REL_TYPE: string =
  'http://schemas.openxmlformats.org/officeDocument/2006/relationships/image';
const XDR_NS: string = 'http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing';
const A_NS: string = 'http://schemas.openxmlformats.org/drawingml/2006/main';
const R_NS: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';

/**
 * Content-type string for an image part (`[Content_Types].xml` Override).
 *
 * @private
 */
export type ImageContentType =
  | 'image/png'
  | 'image/jpeg'
  | 'image/gif'
  | 'image/bmp'
  | 'image/tiff'
  | 'image/webp'
  | 'image/svg+xml'
  | 'image/emf'
  | 'image/wmf';

/**
 * Known image content-type constants used by the media part allocator.
 *
 * @private
 */
export const ImageContentTypes: Record<string, ImageContentType> = {
    png: 'image/png',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    bmp: 'image/bmp',
    tiff: 'image/tiff',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    emf: 'image/emf',
    wmf: 'image/wmf'
} as Record<string, ImageContentType>;

export interface ImagePosition {
    readonly row: number;
    readonly column: number;
    /** Width in points (72 points = 1 inch). */
    readonly width: number;
    /** Height in points (72 points = 1 inch). */
    readonly height: number;
    /** Absolute top from sheet origin in points (XlsIO IShape.Top); optional on bags. */
    readonly top?: number;
    /** Absolute left from sheet origin in points (XlsIO IShape.Left); optional on bags. */
    readonly left?: number;
}

/**
 * Represents an image embedded in a worksheet, letting you set its position
 * and size.
 */
export interface Image {
    /**
     * @private
     */
    readonly id: number;
    /**
     * @private
     */
    readonly relationshipId: string | undefined;
    /**
     * @private
     */
    readonly contentType: string;
    /** The raw bytes of the picture file. */
    readonly bytes: Uint8Array;
    /**
     * @private
     */
    name: string;
    /**
     * @private
     */
    description: string | undefined;
    /**
     * The row the picture's top edge is anchored to — 1-based, like Excel
     * rows. Setting `row` snaps the top edge to the row boundary (zero rowOff).
     */
    row: number;
    /**
     * The column the picture's left edge is anchored to — 1-based, like
     * Excel columns. Setting `column` snaps the left edge to the column
     * boundary (zero colOff).
     */
    column: number;
    /**
     * Absolute distance in points from the top of the sheet (row 1) to the
     * top edge of the picture (XlsIO `IShape.Top`). Setting `top` rewrites
     * `row` and DrawingML `xdr:rowOff` from live row heights (Excel-like
     * defaults when heights are unset).
     */
    top: number;
    /**
     * Absolute distance in points from the left of the sheet (column A) to
     * the left edge of the picture (XlsIO `IShape.Left`). Setting `left`
     * rewrites `column` and `xdr:colOff` from live column widths.
     */
    left: number;
    /** Width in points (72 points = 1 inch). Example: `144` = 2 inches. */
    width: number;
    /** Height in points (72 points = 1 inch). Example: `72` = 1 inch. */
    height: number;
    /**
     * Whether the picture is placed in its anchor cell (Excel "Place in Cell")
     * instead of floating over the grid. Defaults to `false`.
     *
     * Setting `true` makes the anchor cell (`row`, `column`) the picture's host:
     * the cell holds a `#VALUE!` error value and Excel draws the picture inside
     * it. Any earlier value of that cell is replaced. Setting `false` makes the
     * picture float again and clears that placeholder cell. Writing another
     * value into the host cell removes the picture, as it does in Excel.
     *
     * A picture placed in a cell has no position or size of its own: Excel draws
     * it at the cell size, so `width` and `height` are not saved and a workbook
     * opened later reports the image's natural size. The picture keeps its
     * bytes and `description` (saved as its alt text); `name` is not saved.
     * `top` and `left` cannot be set on a placed picture; use `row` and `column`.
     *
     * Two placed pictures cannot share a cell: setting `true`, or moving a
     * placed picture onto a cell that already hosts one, throws
     * `InvalidArgumentError`.
     *
     * @example
     * ```ts
     * const picture = sheet.addImage(bytes, 2, 3, 96, 96);
     * picture.placeInCell = true; // C2 now hosts the picture
     * await workbook.save();
     * ```
     */
    placeInCell: boolean;
    /**
     * Create an independent copy of this picture, detached from the
     * worksheet until it is added again.
     *
     * @returns the copied picture.
     */
    clone(): Image;
}

/** @private */
export interface ImageEntry {
    id: number;
    relId?: string;
    mediaPartName?: string;
    contentType: ImageContentType;
    bytes: Uint8Array;
    name: string;
    description?: string | undefined;
    row: number;
    column: number;
    /** Offset below the top of row, DrawingML xdr:rowOff EMU. */
    rowOffEmu: number;
    /** Offset right of the left of column, DrawingML xdr:colOff EMU. */
    colOffEmu: number;
    widthEmu: number;
    heightEmu: number;
    /** True when the picture is placed in its anchor cell instead of floating. */
    placeInCell?: boolean;
    /** 1-based `c/@vm` of the host cell, once the workbook rich-data store assigned or read it. */
    vm?: number;
    /** Rich value `CalcOrigin` read from a file; written back unchanged. */
    calcOrigin?: number;
}

/**
 * A picture read from a rich value, to be added as a placed picture.
 *
 * @private
 */
export interface LoadedPlacedPicture {
    readonly row: number;
    readonly column: number;
    readonly bytes: Uint8Array;
    readonly contentType: ImageContentType;
    readonly mediaPartName: string;
    readonly description: string | undefined;
    readonly vm: number;
    readonly calcOrigin: number | undefined;
}

export interface ImagesHost {
    markDirty(): void;
    readonly package: OpcPackage;
    readonly sheetPartName: string | undefined;
    /** 1-based row height in points; 0 = unset → placement default. */
    getRowHeightPt?(row: number): number;
    /** 1-based column width in OOXML character units; 0 = unset. */
    getColumnWidthChars?(column: number): number;
    /** Put (`on`) or clear the `#VALUE!` host value of a picture placed in a cell. */
    setCellPlaceholder?(row: number, column: number, on: boolean): void;
    /** A picture placed in a cell was added, removed, moved or edited. */
    markPlacedChanged?(): void;
}

/**
 * What a picture handle needs from the collection that owns it.
 *
 * @private
 */
interface PlacedOwner {
    isHostCellTaken(entry: ImageEntry, row: number, column: number): boolean;
    setPlaceholder(row: number, column: number, on: boolean): void;
    placedChanged(): void;
    releaseDrawingRel(entry: ImageEntry): void;
}

export interface ImagesMaterializeResult {
    readonly drawingRel: OpcRelationship | undefined;
    readonly drawingRelationshipId: string | undefined;
    readonly ownsDrawingElement: boolean;
    /** True when the drawing part held nothing but pictures and was removed. */
    readonly removedDrawing?: boolean;
}

export class ImagesImpl {
    private readonly entries: ImageEntry[] = [];
    private readonly handles: Map<ImageEntry, ImageHandle> = new Map<ImageEntry, ImageHandle>();
    private host: ImagesHost | undefined;
    private drawingPartName: string | undefined;
    private drawingRelId: string | undefined;
    private loaded: boolean = false;
    private dirty: boolean = false;
    private nextId: number = 2;
    private nextName: number = 1;
    /** Drawing relationship ids no entry uses any more (picture removed or placed in a cell). */
    private readonly releasedRelIds: Set<string> = new Set<string>();
    /** Media parts that lost a drawing reference; the workbook removes those nothing else uses. */
    private releasedMedia: string[] = [];

    public bindHost(host: ImagesHost): void {
        this.host = host;
    }

    public loadFromPackage(pkg: OpcPackage, sheetPartName: string | undefined): void {
        this.entries.length = 0;
        this.handles.clear();
        this.drawingPartName = undefined;
        this.drawingRelId = undefined;
        this.loaded = true;
        this.dirty = false;
        this.nextId = 2;
        this.nextName = 1;
        this.releasedRelIds.clear();
        this.releasedMedia = [];
        if (sheetPartName === undefined) {return; }
        const drawingRel: OpcRelationship = pkg.getRelationships(sheetPartName)
            .find((r: OpcRelationship) => isDrawingRelationshipType(r.type));
        if (drawingRel === undefined) {return; }
        this.drawingRelId = drawingRel.id;
        this.drawingPartName = normalizePartName(drawingRel.resolvedTarget);
        const part: OpcPart = pkg.getPart(this.drawingPartName);
        if (part === undefined) {return; }
        const drawingRels: ReadonlyArray<OpcRelationship> = pkg.getRelationships(this.drawingPartName);
        for (const anchor of extractAnchors(decodeUtf8(part.data))) {
            if (!anchor.includes('<xdr:pic')) {continue; }
            const id: number = numberAttr(anchor, 'cNvPr', 'id');
            // r:embed or writer-chosen prefix for the relationships NS (e.g. p6:embed).
            const embed: string = ((__t: RegExpExecArray) => (__t == null ? undefined : __t[1]))(
                // eslint-disable-next-line security/detect-unsafe-regex -- fixed OOXML/token grammar literal
                /<a:blip\b[^>]*\b(?:[A-Za-z_][\w.-]*:)?embed="([^"]+)"/.exec(anchor)
            );
            if (id === undefined || embed === undefined) {continue; }
            const mediaRel: OpcRelationship = drawingRels.find((r: OpcRelationship) => r.id === embed && r.type === IMAGE_REL_TYPE);
            if (mediaRel === undefined) {continue; }
            const media: OpcPart = pkg.getPart(mediaRel.resolvedTarget);
            const contentType: ImageContentType = pkg.contentType(mediaRel.resolvedTarget) as ImageContentType | undefined;
            if (media === undefined || contentType === undefined || !isImageContentType(contentType)) {continue; }
            // oneCellAnchor: xdr:ext. twoCellAnchor: often cx/cy=0 on a:ext — size from→to.
            const geometry: ImageAnchorGeometry = parseImageAnchorGeometry(anchor, this.sheetMetrics());
            if (geometry === undefined) {continue; }
            const nameAttr: string = attribute(anchor, 'cNvPr', 'name');
            const name: string = nameAttr !== undefined ? nameAttr : `Image ${this.nextName}`;
            const description: string = attribute(anchor, 'cNvPr', 'descr');
            const entry: ImageEntry = {
                id,
                relId: embed,
                mediaPartName: mediaRel.resolvedTarget,
                contentType,
                bytes: media.data,
                name,
                ...(description !== undefined ? { description } : {}),
                row: geometry.row,
                column: geometry.column,
                colOffEmu: geometry.colOffEmu,
                rowOffEmu: geometry.rowOffEmu,
                widthEmu: geometry.widthEmu,
                heightEmu: geometry.heightEmu
            };
            this.entries.push(entry);
            this.nextId = Math.max(this.nextId, id + 1);
            this.nextName = Math.max(this.nextName, trailingNumber(name) + 1);
        }
    }

    public get images(): ReadonlyArray<Image> {
        return this.entries.map((entry: ImageEntry) => this.handleFor(entry));
    }

    /**
     * Pictures placed in a cell.
     *
     * @returns {ImageEntry[]} The live entries.
     *
     * @private
     */
    public placedPictures(): ImageEntry[] {
        return this.entries.filter((entry: ImageEntry): boolean => entry.placeInCell === true);
    }

    /**
     * Add a picture read from a workbook rich value. The sheet already holds its host cell.
     *
     * @param {LoadedPlacedPicture} loaded - The picture.
     * @returns {void}
     *
     * @private
     */
    public addLoadedPlaced(loaded: LoadedPlacedPicture): void {
        const size: { width: number; height: number } = readImagePixelSize(loaded.bytes);
        const description: { description?: string } = loaded.description === undefined ? {} : { description: loaded.description };
        this.entries.push({
            id: this.nextId++,
            contentType: loaded.contentType,
            mediaPartName: loaded.mediaPartName,
            bytes: loaded.bytes,
            name: `Image ${this.nextName++}`,
            ...description,
            row: loaded.row,
            column: loaded.column,
            colOffEmu: 0,
            rowOffEmu: 0,
            widthEmu: size === undefined ? 0 : pointsToEmu(size.width * 0.75),
            heightEmu: size === undefined ? 0 : pointsToEmu(size.height * 0.75),
            placeInCell: true,
            vm: loaded.vm,
            ...(loaded.calcOrigin === undefined ? {} : { calcOrigin: loaded.calcOrigin })
        });
    }

    /**
     * Media parts that lost their drawing reference since the last call.
     *
     * @returns {string[]} Part names.
     *
     * @private
     */
    public takeReleasedMedia(): string[] {
        const taken: string[] = this.releasedMedia;
        this.releasedMedia = [];
        return taken;
    }

    public add(
        bytes: Uint8Array,
        row: number,
        column: number,
        width: number,
        height: number
    ): Image {
        if (!(bytes instanceof Uint8Array) || bytes.byteLength === 0) {
            throw new InvalidArgumentError('addImage bytes must be a non-empty Uint8Array');
        }
        requirePositiveInt(row, 'row');
        requirePositiveInt(column, 'column');
        requirePositivePoints(width, 'width');
        requirePositivePoints(height, 'height');
        const resolvedContentType: ImageContentType = sniffContentType(bytes);
        if (resolvedContentType === undefined) {
            throw new InvalidArgumentError('image format cannot be detected from bytes');
        }
        const entry: ImageEntry = {
            id: this.nextId++,
            contentType: resolvedContentType,
            bytes: new Uint8Array(bytes),
            name: `Image ${this.nextName++}`,
            row,
            column,
            colOffEmu: 0,
            rowOffEmu: 0,
            widthEmu: pointsToEmu(width),
            heightEmu: pointsToEmu(height)
        };
        this.entries.push(entry);
        this.markDirty();
        return this.handleFor(entry);
    }

    public remove(target: Image | number): void {
        const index: number = typeof target === 'number' ? target : this.entries.indexOf((target as ImageHandle).entry);
        if (!Number.isInteger(index) || index < 0 || index >= this.entries.length) {throw new InvalidArgumentError('removeImage target is not on this worksheet'); }
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const entry: ImageEntry = this.entries[index];
        if (entry !== undefined) {
            this.entries.splice(index, 1);
            this.handles.delete(entry);
            if (entry.placeInCell === true) {
                this.setPlaceholder(entry.row, entry.column, false);
                this.placedChanged();
            } else {
                this.releaseDrawingRel(entry);
            }
            this.markDirty();
        }
    }

    /**
     * Drop a placed picture whose host cell no longer holds its placeholder.
     *
     * @param {ImageEntry} entry - The picture.
     * @returns {void}
     *
     * @private
     */
    public dropPlaced(entry: ImageEntry): void {
        const index: number = this.entries.indexOf(entry);
        if (index >= 0) {
            this.entries.splice(index, 1);
            this.handles.delete(entry);
            this.markDirty();
        }
    }

    /** @private */
    public isHostCellTaken(entry: ImageEntry, row: number, column: number): boolean {
        return this.entries.some((e: ImageEntry): boolean => e !== entry && e.placeInCell === true && e.row === row && e.column === column);
    }

    /** @private */
    public setPlaceholder(row: number, column: number, on: boolean): void {
        if (this.host !== undefined && this.host.setCellPlaceholder !== undefined) {
            this.host.setCellPlaceholder(row, column, on);
        }
    }

    /** @private */
    public placedChanged(): void {
        if (this.host !== undefined && this.host.markPlacedChanged !== undefined) {
            this.host.markPlacedChanged();
        }
    }

    /** @private */
    public releaseDrawingRel(entry: ImageEntry): void {
        if (entry.relId !== undefined) {
            this.releasedRelIds.add(entry.relId);
            delete entry.relId;
        }
    }

    public materializeOnFlush(drawingRel: OpcRelationship | undefined): ImagesMaterializeResult {
        const host: ImagesHost = this.host;
        const floating: ImageEntry[] = this.entries.filter((entry: ImageEntry): boolean => entry.placeInCell !== true);
        if (host === undefined || host.sheetPartName === undefined) {
            return {
                drawingRel,
                drawingRelationshipId: (drawingRel == null ? undefined : drawingRel.id),
                ownsDrawingElement: this.dirty || floating.length > 0
            };
        }
        if ((!this.dirty && floating.length === 0) || (floating.length === 0 && drawingRel === undefined)) {
            this.dirty = false;
            return {
                drawingRel,
                drawingRelationshipId: (drawingRel == null ? undefined : drawingRel.id),
                ownsDrawingElement: false
            };
        }
        const partName: string = drawingRel === undefined
            ? this.allocateDrawingPart(host.package)
            : normalizePartName(drawingRel.resolvedTarget);
        this.drawingPartName = partName;
        const existing: OpcPart = host.package.getPart(partName);
        let xml: string = existing === undefined ? `<xdr:wsDr xmlns:xdr="${XDR_NS}" xmlns:a="${A_NS}" xmlns:r="${R_NS}"></xdr:wsDr>` : decodeUtf8(existing.data);
        xml = xml.replace(/<xdr:(?:oneCellAnchor|twoCellAnchor)\b[\s\S]*?<\/xdr:(?:oneCellAnchor|twoCellAnchor)>/g, (anchor: string) => anchor.includes('<xdr:pic') ? '' : anchor);
        const usedRelIds: Set<string> = new Set<string>(floating.map((e: ImageEntry): string => e.relId).filter((id: string): boolean => id !== undefined));
        const rels: OpcRelationship[] = host.package.getRelationships(partName).filter((rel: OpcRelationship): boolean => {
            const released: boolean = rel.type === IMAGE_REL_TYPE && this.releasedRelIds.has(rel.id) && !usedRelIds.has(rel.id);
            if (released) {
                this.releasedMedia.push(rel.resolvedTarget);
            }
            return !released;
        });
        this.releasedRelIds.clear();
        if (floating.length === 0 && !/<(?:\w+:)?(?:oneCellAnchor|twoCellAnchor|absoluteAnchor)\b/.test(xml)) {
            for (const rel of rels) {
                if (rel.type === IMAGE_REL_TYPE) {
                    this.releasedMedia.push(rel.resolvedTarget);
                }
            }
            host.package.removePart(partName);
            this.drawingPartName = undefined;
            this.drawingRelId = undefined;
            this.dirty = false;
            return { drawingRel: undefined, drawingRelationshipId: undefined, ownsDrawingElement: true, removedDrawing: true };
        }
        let nextRel: number = 1;
        for (const rel of rels) { const match: RegExpExecArray = /^rId(\d+)$/i.exec(rel.id); if (match) {nextRel = Math.max(nextRel, Number(match[1]) + 1); } }
        const anchors: string[] = [];
        for (const entry of floating) {
            let relId: string = entry.relId;
            if (relId === undefined) {
                relId = `rId${nextRel++}`;
                let mediaName: string = entry.mediaPartName;
                if (mediaName === undefined || host.package.getPart(mediaName) === undefined) {
                    mediaName = this.allocateMediaPart(host.package, entry.contentType);
                    host.package.setPart(mediaName, entry.bytes, entry.contentType);
                }
                entry.mediaPartName = mediaName;
                rels.push({ id: relId, type: IMAGE_REL_TYPE, target: relativeTarget(partName, mediaName), resolvedTarget: mediaName });
                entry.relId = relId;
            }
            anchors.push(serializeImage(entry, relId));
        }
        xml = xml.replace('</xdr:wsDr>', `${anchors.join('')}</xdr:wsDr>`);
        // Ensure xmlns:r is present when images with r:embed are written, following
        // the pattern from charts.ts for namespace injection into existing drawings.
        if (floating.length > 0 && !xml.includes('xmlns:r=')) {
            xml = xml.replace('<xdr:wsDr', `<xdr:wsDr xmlns:r="${R_NS}"`);
        }
        host.package.setPart(partName, encodeUtf8(xml), DRAWING_CONTENT_TYPE);
        host.package.setRelationships(partName, rels);
        let resultRel: OpcRelationship = drawingRel;
        if (resultRel === undefined) {
            const relId: string = `rId${maxSheetRelId(host.package.getRelationships(host.sheetPartName)) + 1}`;
            const target: string = relativeTarget(host.sheetPartName, partName);
            resultRel = {
                id: relId,
                type: DRAWING_REL_TYPE_TRANSITIONAL,
                target,
                resolvedTarget: resolveRelationshipTarget(host.sheetPartName, target, undefined)
            };
        }
        this.drawingRelId = resultRel.id;
        this.dirty = false;
        return { drawingRel: resultRel, drawingRelationshipId: resultRel.id, ownsDrawingElement: true };
    }

    private allocateDrawingPart(pkg: OpcPackage): string {
        let i: number = 1; while (pkg.getPart(`/xl/drawings/drawing${i}.xml`) !== undefined) {i++; } return `/xl/drawings/drawing${i}.xml`;
    }
    private allocateMediaPart(pkg: OpcPackage, type: ImageContentType): string {
        const ext: string = extensionFor(type); let i: number = 1; while (pkg.getPart(`/xl/media/image${i}.${ext}`) !== undefined) {i++; } return `/xl/media/image${i}.${ext}`;
    }
    private markDirty(): void { this.dirty = true; if (this.host != null) { this.host.markDirty(); } }
    private sheetMetrics(): SheetMetrics | undefined {
        const host: ImagesHost = this.host;
        if (host === undefined) {return undefined; }
        if (host.getRowHeightPt === undefined && host.getColumnWidthChars === undefined) {
            return undefined;
        }
        return {
            getRowHeightPt: (row: number) =>
                host.getRowHeightPt === undefined ? 0 : host.getRowHeightPt(row),
            getColumnWidthChars: (column: number) =>
                host.getColumnWidthChars === undefined ? 0 : host.getColumnWidthChars(column)
        };
    }
    private handleFor(entry: ImageEntry): Image {
        let handle: ImageHandle = this.handles.get(entry);
        if (handle === undefined) {
            handle = new ImageHandle(entry, () => this.markDirty(), () => this.sheetMetrics(), this);
            this.handles.set(entry, handle);
        }
        return handle;
    }
}

class ImageHandle implements Image {
    public readonly entry: ImageEntry;
    private readonly dirty: () => void;
    private readonly metrics: () => SheetMetrics | undefined;
    private readonly owner: PlacedOwner;

    public constructor(
        entry: ImageEntry,
        dirty: () => void,
        metrics: () => SheetMetrics | undefined,
        owner: PlacedOwner
    ) {
        this.entry = entry;
        this.dirty = dirty;
        this.metrics = metrics;
        this.owner = owner;
    }
    public get id(): number { return this.entry.id; }
    public get relationshipId(): string | undefined { return this.entry.relId; }
    public get contentType(): ImageContentType { return this.entry.contentType; }
    public get bytes(): Uint8Array { return new Uint8Array(this.entry.bytes); }
    public get name(): string { return this.entry.name; }
    public set name(value: string) { this.entry.name = String(value); this.dirty(); }
    public get description(): string | undefined { return this.entry.description; }
    public set description(value: string | undefined) {
        if (value === undefined) {delete this.entry.description; }
        else {this.entry.description = String(value); }
        if (this.entry.placeInCell === true) {
            this.owner.placedChanged();
        }
        this.dirty();
    }
    public get row(): number { return this.entry.row; }
    public set row(value: number) {
        requirePositiveInt(value, 'row');
        this.moveHost(value, this.entry.column);
        this.entry.row = value;
        this.entry.rowOffEmu = 0;
        this.dirty();
    }
    public get column(): number { return this.entry.column; }
    public set column(value: number) {
        requirePositiveInt(value, 'column');
        this.moveHost(this.entry.row, value);
        this.entry.column = value;
        this.entry.colOffEmu = 0;
        this.dirty();
    }
    public get top(): number {
        return anchorToAbsoluteTopPt(this.entry, this.metrics());
    }
    public set top(value: number) {
        this.requireFloating('top');
        requireNonNegativePoints(value, 'top');
        applyAbsoluteTop(this.entry, value, this.metrics());
        this.dirty();
    }
    public get left(): number {
        return anchorToAbsoluteLeftPt(this.entry, this.metrics());
    }
    public set left(value: number) {
        this.requireFloating('left');
        requireNonNegativePoints(value, 'left');
        applyAbsoluteLeft(this.entry, value, this.metrics());
        this.dirty();
    }
    public get width(): number { return this.entry.widthEmu / EMU_PER_PT; }
    public set width(value: number) { requirePositivePoints(value, 'width'); this.entry.widthEmu = pointsToEmu(value); this.dirty(); }
    public get height(): number { return this.entry.heightEmu / EMU_PER_PT; }
    public set height(value: number) { requirePositivePoints(value, 'height'); this.entry.heightEmu = pointsToEmu(value); this.dirty(); }
    public get placeInCell(): boolean { return this.entry.placeInCell === true; }
    public set placeInCell(value: boolean) {
        const placed: boolean = value === true;
        if (placed === (this.entry.placeInCell === true)) {
            return;
        }
        const { row, column } = this.entry;
        if (placed) {
            if (this.owner.isHostCellTaken(this.entry, row, column)) {
                throw new InvalidArgumentError(`cell (${row}, ${column}) already hosts a picture placed in a cell`);
            }
            this.entry.placeInCell = true;
            this.owner.releaseDrawingRel(this.entry);
            this.owner.setPlaceholder(row, column, true);
        } else {
            delete this.entry.placeInCell;
            delete this.entry.vm;
            this.owner.setPlaceholder(row, column, false);
        }
        this.owner.placedChanged();
        this.dirty();
    }
    public clone(): Image {
        const { relId: _relId, mediaPartName: _mediaPartName, placeInCell: _placed, vm: _vm, calcOrigin: _origin, ...rest } = this.entry;
        void _relId;
        void _mediaPartName;
        void _placed;
        void _vm;
        void _origin;
        const copy: ImageEntry = {
            ...rest,
            bytes: new Uint8Array(this.entry.bytes),
            colOffEmu: this.entry.colOffEmu,
            rowOffEmu: this.entry.rowOffEmu
        };
        return new ImageHandle(copy, this.dirty, this.metrics, this.owner);
    }
    private moveHost(row: number, column: number): void {
        if (this.entry.placeInCell !== true || (row === this.entry.row && column === this.entry.column)) {
            return;
        }
        if (this.owner.isHostCellTaken(this.entry, row, column)) {
            throw new InvalidArgumentError(`cell (${row}, ${column}) already hosts a picture placed in a cell`);
        }
        this.owner.setPlaceholder(this.entry.row, this.entry.column, false);
        this.owner.setPlaceholder(row, column, true);
        delete this.entry.vm;
        this.owner.placedChanged();
    }
    private requireFloating(label: string): void {
        if (this.entry.placeInCell === true) {
            throw new InvalidArgumentError(`${label} cannot be set on a picture placed in a cell; set row and column instead`);
        }
    }
}

/**
 * serializeImage.
 *
 * @param {ImageEntry} entry - The entry parameter.
 * @param {string} relId - The relId parameter.
 * @returns {string} - Returns the result.
 */
function serializeImage(entry: ImageEntry, relId: string): string {
    const descr: string = entry.description === undefined ? '' : ` descr="${escapeXml(entry.description)}"`;
    const colOff: number = entry.colOffEmu | 0;
    const rowOff: number = entry.rowOffEmu | 0;
    return `<xdr:oneCellAnchor><xdr:from><xdr:col>${entry.column - 1}</xdr:col><xdr:colOff>${colOff}</xdr:colOff><xdr:row>${entry.row - 1}</xdr:row><xdr:rowOff>${rowOff}</xdr:rowOff></xdr:from><xdr:ext cx="${entry.widthEmu}" cy="${entry.heightEmu}"/><xdr:pic><xdr:nvPicPr><xdr:cNvPr id="${entry.id}" name="${escapeXml(entry.name)}"${descr}/><xdr:cNvPicPr/></xdr:nvPicPr><xdr:blipFill><a:blip r:embed="${escapeXml(relId)}"/><a:stretch><a:fillRect/></a:stretch></xdr:blipFill><xdr:spPr><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></xdr:spPr></xdr:pic><xdr:clientData/></xdr:oneCellAnchor>`;
}

/**
 * extractAnchors.
 *
 * @param {string} xml - The xml parameter.
 * @returns {string[]} - Returns the result.
 */
function extractAnchors(xml: string): string[] {
    const matches: RegExpMatchArray = xml.match(/<xdr:(?:oneCellAnchor|twoCellAnchor)\b[\s\S]*?<\/xdr:(?:oneCellAnchor|twoCellAnchor)>/g);
    return matches !== null ? matches : [];
}

interface ImageAnchorMarker {
    readonly col0: number;
    readonly colOff: number;
    readonly row0: number;
    readonly rowOff: number;
}

interface ImageAnchorGeometry {
    readonly row: number;
    readonly column: number;
    /** Offset right of the left of {@link column}, DrawingML xdr:colOff EMU. */
    readonly colOffEmu: number;
    /** Offset below the top of {@link row}, DrawingML xdr:rowOff EMU. */
    readonly rowOffEmu: number;
    readonly widthEmu: number;
    readonly heightEmu: number;
}

/**
 * Parse `xdr:from` / `xdr:to` marker (col, colOff, row, rowOff).
 * Tolerant of whitespace between required child tags.
 *
 * @param {string} xml - The xml parameter.
 * @param {'from' | 'to'} tag - The tag parameter.
 * @returns {ImageAnchorMarker | undefined} - Returns the result.
 */
function parseImageAnchorMarker(xml: string, tag: 'from' | 'to'): ImageAnchorMarker | undefined {
    // eslint-disable-next-line security/detect-non-literal-regexp -- RegExp built from escapeRegExp(localName) only
    const match: RegExpExecArray = new RegExp(
        `<xdr:${tag}>[\\s\\S]*?<xdr:col>(\\d+)</xdr:col>[\\s\\S]*?<xdr:colOff>(\\d+)</xdr:colOff>` +
      `[\\s\\S]*?<xdr:row>(\\d+)</xdr:row>[\\s\\S]*?<xdr:rowOff>(\\d+)</xdr:rowOff>[\\s\\S]*?</xdr:${tag}>`,
        'i'
    ).exec(xml);
    if (match === null) {
        return undefined;
    }
    return {
        col0: Number(match[1]),
        colOff: Number(match[2]),
        row0: Number(match[3]),
        rowOff: Number(match[4])
    };
}

/**
 * First positive DrawingML extent on the anchor.
 * Prefers `xdr:ext` (oneCell) over `a:ext` (pic spPr/xfrm).
 * Zero extents are ignored — Excel twoCell pics often write cx="0" cy="0".
 *
 * @param {string} xml - The xml parameter.
 * @returns {Object} - Returns the result.
 */
function parsePositiveImageExtent(xml: string): { widthEmu: number; heightEmu: number } | undefined {
    const extentTags: string[] = ['xdr:ext', 'a:ext'];
    for (let i: number = 0; i < extentTags.length; i++) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const tag: string = extentTags[i]!;
        // eslint-disable-next-line security/detect-non-literal-regexp -- RegExp built from escapeRegExp(localName) only
        const re: RegExp = new RegExp('<' + tag + '\\b([^>/]*)', 'gi');
        let match: RegExpExecArray = re.exec(xml);
        while (match !== null) {
            const attrs: string = match[1] !== undefined ? match[1] : '';
            const cxMatch: RegExpExecArray = /\bcx="(\d+)"/i.exec(attrs);
            const cyMatch: RegExpExecArray = /\bcy="(\d+)"/i.exec(attrs);
            if (cxMatch !== null && cyMatch !== null) {
                const widthEmu: number = Number(cxMatch[1]);
                const heightEmu: number = Number(cyMatch[1]);
                if (widthEmu > 0 && heightEmu > 0) {
                    return { widthEmu, heightEmu };
                }
            }
            match = re.exec(xml);
        }
    }
    return undefined;
}

/**
 * Resolve picture anchor row/column (1-based) and size in EMU.
 *
 * Size priority:
 * 1. Positive `xdr:ext` / `a:ext`
 * 2. `xdr:from`→`xdr:to` using live row heights and column widths
 * 3. Otherwise 0 (getters report 0 pt; media still loads)
 *
 * @param {string} anchor - The anchor parameter.
 * @param {SheetMetrics | undefined} metrics - The metrics parameter.
 * @returns {ImageAnchorGeometry | undefined} - Returns the result.
 */
function parseImageAnchorGeometry(anchor: string, metrics?: SheetMetrics): ImageAnchorGeometry | undefined {
    const from: ImageAnchorMarker = parseImageAnchorMarker(anchor, 'from');
    if (from === undefined) {
        return undefined;
    }

    let widthEmu: number = 0;
    let heightEmu: number = 0;
    const extent: { widthEmu: number; heightEmu: number; } = parsePositiveImageExtent(anchor);
    if (extent !== undefined) {
        widthEmu = extent.widthEmu;
        heightEmu = extent.heightEmu;
    } else {
        const to: ImageAnchorMarker = parseImageAnchorMarker(anchor, 'to');
        if (to !== undefined) {
            widthEmu = twoCellAnchorWidthEmu(from.col0, from.colOff, to.col0, to.colOff, metrics);
            heightEmu = twoCellAnchorHeightEmu(from.row0, from.rowOff, to.row0, to.rowOff, metrics);
        }
    }

    return {
        row: from.row0 + 1,
        column: from.col0 + 1,
        colOffEmu: from.colOff,
        rowOffEmu: from.rowOff,
        widthEmu,
        heightEmu
    };
}

/**
 * attribute.
 *
 * @param {string} xml - The xml parameter.
 * @param {string} element - The element parameter.
 * @param {string} name - The name parameter.
 * @returns {string | undefined} - Returns the result.
 */
// eslint-disable-next-line security/detect-non-literal-regexp -- RegExp built from escapeRegExp(localName) only
function attribute(xml: string, element: string, name: string): string | undefined { const match: RegExpExecArray = new RegExp(`<xdr:${element}\\b[^>]*\\b${name}="([^"]*)"`).exec(xml); if (match === null || match[1] === undefined) {
    return undefined;
}
return unescapeXml(match[1]); }
/**
 * numberAttr.
 *
 * @param {string} xml - The xml parameter.
 * @param {string} element - The element parameter.
 * @param {string} name - The name parameter.
 * @returns {number | undefined} - Returns the result.
 */
function numberAttr(xml: string, element: string, name: string): number | undefined {
    const value: string = attribute(xml, element, name);
    return value === undefined ? undefined : Number(value);
}
/**
 * isImageContentType.
 *
 * @param {string} value - The value parameter.
 * @returns {boolean} - Returns the result.
 *
 * @private
 */
export function isImageContentType(value: string): value is ImageContentType {
    // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
    const vals: ImageContentType[] = Object.keys(ImageContentTypes).map((k: string) => ImageContentTypes[k]!);
    return vals.indexOf(value as ImageContentType) >= 0;
}
/**
 * sniffContentType.
 *
 * @param {Uint8Array} bytes - The bytes parameter.
 * @returns {ImageContentType | undefined} - Returns the result.
 */
function sniffContentType(bytes: Uint8Array): ImageContentType | undefined { if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {return 'image/png'; } if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {return 'image/jpeg'; } if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) {return 'image/gif'; } if (bytes[0] === 0x42 && bytes[1] === 0x4d) {return 'image/bmp'; } if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) {return 'image/webp'; } return undefined; }
/**
 * extensionFor.
 *
 * @param {ImageContentType} type - The type parameter.
 * @returns {string} - Returns the result.
 *
 * @private
 */
export function extensionFor(type: ImageContentType): string { return type === 'image/jpeg' ? 'jpeg' : type.slice('image/'.length); }
/**
 * trailingNumber.
 *
 * @param {string} value - The value parameter.
 * @returns {number} - Returns the result.
 */
function trailingNumber(value: string): number { const match: RegExpExecArray = /(\d+)$/.exec(value); return match === null ? 0 : Number(match[1]); }
/**
 * maxSheetRelId.
 *
 * @param {ReadonlyArray<OpcRelationship>} rels - The rels parameter.
 * @returns {number} - Returns the result.
 */
function maxSheetRelId(rels: ReadonlyArray<OpcRelationship>): number { return rels.reduce((max: number, rel: OpcRelationship) => { const match: RegExpExecArray = /^rId(\d+)$/i.exec(rel.id); return match === null ? max : Math.max(max, Number(match[1])); }, 0); }
/**
 * relativeTarget.
 *
 * @param {string} source - The source parameter.
 * @param {string} target - The target parameter.
 * @returns {string} - Returns the result.
 *
 * @private
 */
export function relativeTarget(source: string, target: string): string { const sourceDir: string = source.slice(0, source.lastIndexOf('/')); const sourceParts: string[] = sourceDir.split('/').filter(Boolean); const targetParts: string[] = target.split('/').filter(Boolean); while (sourceParts.length > 0 && targetParts[0] === sourceParts[0]) { sourceParts.shift(); targetParts.shift(); } return `${'../'.repeat(sourceParts.length)}${targetParts.join('/')}`; }
