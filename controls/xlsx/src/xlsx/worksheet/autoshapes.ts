/**
 * Worksheet autoshapes (DrawingML preset shapes, `prstSp` anchors).
 *
 * Citations:
 * - docs/specs/autoshapes.md; docs/ooxml-mapping/autoshapes.md
 * - dml-spreadsheetDrawing.xsd CT_WsDr / CT_OneCellAnchor / CT_Shape
 * - dml-main.xsd CT_PresetGeometry2D (prst attribute)
 * - sml CT_Drawing on CT_Worksheet
 *
 * Package side effects (drawing part + sheet relationship) defer to flush/save
 * (API-RULES R5.1). Foreign anchors (pic, chart, group, connector) are preserved
 * opaquely in the same drawing part alongside modeled autoshapes.
 *
 * @private
 */

import { InvalidArgumentError } from '../core/errors';
import { EMU_PER_PT } from '../core/length';
import {
    DRAWING_CONTENT_TYPE,
    DRAWING_REL_TYPE_TRANSITIONAL,
    DRAWINGML_MAIN_NS_TRANSITIONAL,
    DRAWINGML_SPREADSHEET_NS_TRANSITIONAL,
    isDrawingRelationshipType
} from '../core/package/constants';
import { OpcPackage } from '../core/package/opc-package';
import { normalizePartName, resolveRelationshipTarget } from '../core/package/part-names';
import { OpcRelationship } from '../core/package/relationships';
import { decodeUtf8, encodeUtf8, escapeXml, escapeXmlText, parseAttrMap, unescapeXml } from '../core/xml/minimal-xml';
import { PAGE_SETUP_SUCCESSORS } from './page-setup';
import { defaultThemeColorScheme, parseThemeColorScheme } from '../styles/color-resolve';
import { isThemeRelationshipType } from '../core/package/constants';

const XDR_NS: 'http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing' = DRAWINGML_SPREADSHEET_NS_TRANSITIONAL;
const A_NS: 'http://schemas.openxmlformats.org/drawingml/2006/main' = DRAWINGML_MAIN_NS_TRANSITIONAL;

/**
 * Specifies the kind of built-in shape to draw, such as a rectangle, oval,
 * arrow, or star.
 */
export enum AutoShapeType {
    /** A four-sided shape with square corners. */
    Rectangle = 'rect',
    /** A rectangle with rounded corners. */
    RoundedRectangle = 'roundRect',
    /** An ellipse that can be wider or taller than it is long. */
    Oval = 'ellipse',
    /** An ellipse whose width and height are forced equal, producing a circle. */
    Circle = 'ellipse', // enforced 1:1 width:height by library author code
    /** A triangle. */
    Triangle = 'triangle',
    /** A four-sided shape rotated 45 degrees, like a diamond. */
    Diamond = 'diamond',
    /** A five-sided shape. */
    Pentagon = 'pentagon',
    /** A six-sided shape. */
    Hexagon = 'hexagon',
    /** An eight-sided shape. */
    Octagon = 'octagon',
    /** A five-pointed star. */
    Star5 = 'star5',
    /** A ten-pointed star. */
    Star10 = 'star10',
    /** A three-dimensional box. */
    Cube = 'cube',
    /** A three-dimensional cylinder. */
    Cylinder = 'cylinder',
    /** A three-dimensional cone. */
    Cone = 'cone',
    /** A three-dimensional pyramid. */
    Pyramid = 'pyramid',
    /** A heart. */
    Heart = 'heart',
    /** A crescent moon. */
    Moon = 'moon',
    /** A sun. */
    Sun = 'sun',
    /** A cloud. */
    Cloud = 'cloud',
    /** An open curved arc. */
    Arc = 'arc',
    /** A block arrow pointing right. DrawingML preset `rightArrow` (not `rtTriangle`). */
    RightArrow = 'rightArrow',
    /** A block arrow pointing left. DrawingML preset `leftArrow` (not `ltTriangle`). */
    LeftArrow = 'leftArrow',
    /** A block arrow pointing up. DrawingML preset `upArrow` (not `triangle`). */
    UpArrow = 'upArrow',
    /** A block arrow pointing down. DrawingML preset `downArrow` (not `invTriangle`). */
    DownArrow = 'downArrow'
}

/**
 * The dash pattern a shape's outline is drawn with. Assign one of these
 * values to the shape's line formatting.
 */
export enum ShapeLineStyle {
    /** An unbroken, continuous line. */
    Solid = 'solid',
    /** Short dashes with gaps between them. */
    Dash = 'dash',
    /** A pattern of dots. */
    Dot = 'dot',
    /** Alternating dashes and dots. */
    DashDot = 'dashDot',
    /** A dash followed by two dots. */
    DashDotDot = 'dashDotDot',
    /** Long dashes with gaps between them. */
    LongDash = 'lgDash',
    /** Alternating long and short dashes. */
    DashLongDash = 'dashLongDash',
    /** No outline at all. */
    None = 'none'
}

/**
 * The kind of fill a shape's background uses. Assign one of these values
 * to the shape's fill type.
 */
export enum ShapeFillType {
    /** A single flat color. */
    Solid = 'solidFill',
    /** A smooth blend between two or more colors. */
    Gradient = 'gradFill',
    /** A repeating motif, like stripes or checks. */
    Pattern = 'pattFill'
}

/**
 * The direction a gradient fill blends its colors in. Assign one of these
 * values to the gradient settings of a shape's fill.
 */
export enum ExcelGradientStyle {
    /** Blend the colors along a straight line, from one edge to the other. */
    Linear = 'linear',
    /** Blend the colors outward from a center point, like concentric rings. */
    Radial = 'radial'
}

/**
 * Describes a shape's outline, including its color, weight, and dash style.
 */
export interface ShapeLineFormat {
    /**
     * The outline color as a hex value, like `'4472C4'` or `'#4472C4'`.
     * `undefined` draws no outline.
     */
    color: string | undefined;
    /**
     * The thickness of the outline in pixels — kept between 1 and 10.
     */
    weight: number;
    /** The dash pattern the outline is drawn with. */
    dashStyle: ShapeLineStyle;
}

/**
 * Describes how a shape is filled, whether with a solid color, gradient, or
 * pattern, including its colors and transparency.
 */
export interface ShapeFill {
    /**
     * The kind of fill: a flat color, a smooth color blend, or a repeating
     * pattern.
     */
    type: ShapeFillType;
    /**
     * The fill's main color as a hex value, like `'4472C4'` — used by solid
     * and pattern fills.
     */
    foreColor: string | undefined;
    /**
     * The color behind the pattern, as a hex value — used by pattern fills.
     */
    backColor: string | undefined;
    /**
     * How see-through the fill is, in percent — `0` fully opaque, `100`
     * fully transparent. `undefined` uses the library default.
     */
    transparency: number | undefined;
}

/**
 * One run of text inside a shape, with its own font formatting. A run whose
 * text is `'\n'` marks a paragraph break.
 *
 * @private
 */
export interface ShapeTextRun {
    /** The text of the run. */
    text: string;
    /** The formatting applied to this run. */
    font: {
        /** The font face name, or `undefined` for the default font. */
        name: string | undefined;
        /** The font size in points, or `undefined` for the default size. */
        size: number | undefined;
        /** Whether the run is bold. */
        bold: boolean;
        /** Whether the run is italic. */
        italic: boolean;
        /** Whether the run is underlined. */
        underline: boolean;
        /** The text color as a hex value like `'333333'`, or `undefined`. */
        color: string | undefined;
    };
}

/**
 * Holds the text inside a shape, along with its alignment and font
 * formatting.
 */
export interface ShapeTextFrame {
    /** The text shown inside the shape. Paragraphs are separated by `'\n'`. */
    text: string;
    /**
     * The text split into formatted runs. Present when the shape's text has
     * run-level formatting (always for shapes read from a file that contain
     * text). When assigned, it is used only if its runs join to `text`.
     *
     * @private
     */
    richText?: ShapeTextRun[];
    /** How the text lines up horizontally: left, center, right, or justify. */
    horizontalAlignment: 'left' | 'center' | 'right' | 'justify';
    /** How the text lines up vertically within the shape. */
    verticalAlignment: 'top' | 'middle' | 'bottom';
    /** The font the shape's text is drawn with. */
    font: {
        /** The font face name — for example `'Calibri'`. */
        name: string | undefined;
        /** The font size in points — for example `12`. */
        size: number | undefined;
        /** Whether the text is bold. */
        bold: boolean;
        /** Whether the text is italic. */
        italic: boolean;
        /** The text color as a hex value, like `'333333'`. */
        color: string | undefined;
    };
}

/**
 * Represents a shape placed on a worksheet, letting you set its position,
 * size, appearance, and text.
 */
export interface Shape {
    /** The shape's numeric id, unique within the worksheet's drawing. */
    readonly id: number;

    // Positioning & sizing
    /**
     * The row the shape's top edge is anchored to — 1-based, like Excel
     * rows.
     */
    row: number;
    /**
     * The column the shape's left edge is anchored to — 1-based, like
     * Excel columns.
     */
    column: number;
    /**
     * The width of the shape in points (72 pt = 1 in).
     */
    width: number;
    /**
     * The height of the shape in points (72 pt = 1 in).
     */
    height: number;

    /** How far the shape is turned, in degrees clockwise (0–360). */
    rotation: number;

    // Visual properties
    /**
     * The shape's background fill. `undefined` uses the default — a white
     * solid fill.
     */
    fill: ShapeFill | undefined;
    /** The shape's outline. `undefined` draws no outline. */
    line: ShapeLineFormat | undefined;

    // Text content & formatting
    /** The text shown inside the shape and how it is formatted. */
    textFrame: ShapeTextFrame;

    // Metadata
    /**
     * The name that identifies the shape. `undefined` lets the library
     * generate one.
     */
    name: string | undefined;
    /**
     * The alt text describing the shape for accessibility tools;
     * `undefined` when not set.
     */
    altText: string | undefined;
    /** The kind of shape — for example a rectangle, ellipse, or star. */
    readonly type: AutoShapeType;
    /** Whether the shape is visible on the worksheet. */
    isVisible: boolean;
    /** Whether the shape moves when its anchor cells move or resize. */
    isMoveWithCell: boolean;
    /** Whether the shape grows and shrinks with its anchor cells. */
    isSizeWithCell: boolean;
}

/**
 * Represents the shapes on a worksheet, letting you add or remove
 * rectangles, ovals, arrows, and other built-in shapes.
 */
export interface ShapesCollection {
    /** All shapes on the worksheet, in the order they were added. */
    readonly shapes: ReadonlyArray<Shape>;
    /**
     * Add a shape to the worksheet. Position it by cell and size it in
     * points (72 pt = 1 in), then set fill, outline, and text formatting
     * on the returned shape.
     *
     * @param type - The kind of shape to add, like `AutoShapeType.Rectangle`.
     * @param row - The 1-based row the shape's top edge is anchored to.
     * @param column - The 1-based column the shape's left edge is anchored to.
     * @param width - The shape width in points, like `144` (2 in).
     * @param height - The shape height in points, like `72` (1 in).
     * @param text - The text shown inside the shape, when any.
     * @param name - The name identifying the shape; generated when omitted.
     * @param altText - The alt text for accessibility tools, when any.
     * @param rotation - How far to turn the shape, in degrees clockwise.
     * @param moveWithCell - Whether the shape moves with its anchor cells.
     *   Default `true`.
     * @param sizeWithCell - Whether the shape resizes with its anchor cells.
     *   Default `false`.
     * @returns {Object} the newly created shape.
     */
    addShape(
        type: AutoShapeType,
        row: number,
        column: number,
        width: number,
        height: number,
        text?: string,
        name?: string,
        altText?: string,
        rotation?: number,
        moveWithCell?: boolean,
        sizeWithCell?: boolean
    ): Shape;
    /**
     * Remove a shape from the worksheet.
     *
     * @param target - The shape to remove, or its zero-based position among
     *   the worksheet's shapes.
     */
    removeShape(target: Shape | number): void;
}

/** Host callbacks for dirty + package access. */
export interface AutoShapesHost {
    markDirty(): void;
    readonly package: OpcPackage;
    readonly sheetPartName: string | undefined;
}

/**
 * Internal entry for one autoshape.
 *
 * @private
 */
export interface AutoShapeEntry {
    cNvPrId: number;
    name: string;
    type: AutoShapeType;
    /** 0-based OOXML marker row. */
    fromRow0: number;
    /** 0-based OOXML marker col. */
    fromCol0: number;
    rowOffEmu: number;
    colOffEmu: number;
    widthEmu: number;
    heightEmu: number;
    anchorKind: 'oneCell' | 'twoCell';
    toRow0?: number;
    toCol0?: number;
    toRowOffEmu?: number;
    toColOffEmu?: number;
    editAs?: string;
    rotation: number;
    text: string;
    runs?: ShapeTextRun[];
    textHorizontalAlignment: 'left' | 'center' | 'right' | 'justify';
    textVerticalAlignment: 'top' | 'middle' | 'bottom';
    fontName: string | undefined;
    fontSizePt: number | undefined;
    fontBold: boolean;
    fontItalic: boolean;
    fontColor: string | undefined;
    fill: ShapeFill;
    line: ShapeLineFormat;
    altText: string | undefined;
    isVisible: boolean;
    isMoveWithCell: boolean;
    isSizeWithCell: boolean;
}

/**
 * Result of materializing the drawing part + sheet drawing relationship.
 *
 * @private
 */
export interface AutoShapesMaterializeResult {
    /** Relationships to keep (non-drawing, or updated set without stale drawing). */
    readonly sheetRelsWithoutDrawing: ReadonlyArray<OpcRelationship>;
    /** New or retained drawing relationship, if any anchors remain. */
    readonly drawingRel: OpcRelationship | undefined;
    /** `r:id` for worksheet `<drawing>` when present. */
    readonly drawingRelationshipId: string | undefined;
    /** Whether the model owns/emits drawing (strip bag duplicates). */
    readonly ownsDrawingElement: boolean;
}

/**
 * Mutable autoshapes collection for one worksheet.
 *
 * @private
 */
export class AutoShapesImpl implements ShapesCollection {
    private readonly entries: AutoShapeEntry[] = [];
    private readonly handles: Map<AutoShapeEntry, ShapeHandle> = new Map<AutoShapeEntry, ShapeHandle>();
    private host: AutoShapesHost | undefined;
    private foreignAnchorsXml: string[] = [];
    private drawingPartName: string | undefined;
    private drawingRelId: string | undefined;
    private loaded: boolean = false;
    private dirty: boolean = false;
    private nextCNvPrId: number = 2;
    private nextNameIndex: number = 1;

    /**
     * bindHost method.
     *
     * @param {AutoShapesHost} host - The host parameter.
     * @returns {void} - Returns the result.
     */
    public bindHost(host: AutoShapesHost): void {
        this.host = host;
    }

    /**
     * Load drawing part for this sheet (if any). Call after sheet XML parse.
     *
     * @param {OpcPackage} pkg - The pkg parameter.
     * @param {string} sheetPartName - The sheetPartName parameter.
     * @returns {void} - Returns the result.
     */
    public loadFromPackage(pkg: OpcPackage, sheetPartName: string | undefined): void {
        this.entries.length = 0;
        this.handles.clear();
        this.foreignAnchorsXml = [];
        this.drawingPartName = undefined;
        this.drawingRelId = undefined;
        this.loaded = true;
        this.dirty = false;
        this.nextCNvPrId = 2;
        this.nextNameIndex = 1;

        if (sheetPartName === undefined) {
            return;
        }

        const rels: ReadonlyArray<OpcRelationship> = pkg.getRelationships(sheetPartName);
        const drawingRel: OpcRelationship = rels.find((r: OpcRelationship): boolean => isDrawingRelationshipType(r.type));
        if (drawingRel === undefined) {
            return;
        }

        this.drawingRelId = drawingRel.id;
        const partName: string = normalizePartName(drawingRel.resolvedTarget);
        this.drawingPartName = partName;
        const part: any = pkg.getPart(partName);
        if (part === undefined) {
            return;
        }

        const parsed: { shapes: AutoShapeEntry[]; foreignAnchorsXml: string[] } = parseDrawingXml(
            decodeUtf8(part.data),
            loadThemeColors(pkg)
        );
        for (const e of parsed.shapes) {
            this.entries.push(e);
            if (e.cNvPrId >= this.nextCNvPrId) {
                this.nextCNvPrId = e.cNvPrId + 1;
            }
            const num: number = extractTrailingNumber(e.name);
            if (num !== undefined && num >= this.nextNameIndex) {
                this.nextNameIndex = num + 1;
            }
        }
        this.foreignAnchorsXml = parsed.foreignAnchorsXml;
    }

    /**
     * Snapshot of live handles in file/add order.
     *
     * @returns {Object} - Returns the result.
     */
    public get shapes(): ReadonlyArray<Shape> {
        return this.entries.map((e: AutoShapeEntry): Shape => this.handleFor(e));
    }

    /**
     * Add a preset autoshape. Geometry is 1-based row/column + positive size in points. Optional trailing args: text, name, altText, rotation (default 0), moveWithCell (default true), sizeWithCell (default false). Nested fill/line/text formatting is set on the returned {@link Shape}.
     *
     * @param {AutoShapeType} type - The type parameter.
     * @param {number} row - The row parameter.
     * @param {number} column - The column parameter.
     * @param {number} width - The width parameter.
     * @param {number} height - The height parameter.
     * @param {string} text - The text parameter.
     * @param {string} name - The name parameter.
     * @param {string} altText - The altText parameter.
     * @param {number} rotation - The rotation parameter.
     * @param {boolean} moveWithCell - The moveWithCell parameter.
     * @param {boolean} sizeWithCell - The sizeWithCell parameter.
     * @returns {Shape} - Returns the result.
     */
    public addShape(
        type: AutoShapeType,
        row: number,
        column: number,
        width: number,
        height: number,
        text?: string,
        name?: string,
        altText?: string,
        rotation?: number,
        moveWithCell?: boolean,
        sizeWithCell?: boolean
    ): Shape {
        const rowN: number = requirePositiveInt(row, 'row');
        const columnN: number = requirePositiveInt(column, 'column');
        requirePositivePoints(width, 'width');
        requirePositivePoints(height, 'height');

        const initialText: string = text === undefined ? '' : String(text);
        const resolvedName: string =
            name === undefined || name === null || String(name).trim() === '' ? `Shape ${this.nextNameIndex}` : String(name);
        const resolvedAlt: string = altText === undefined || altText === null ? undefined : String(altText);
        const resolvedRotation: number = typeof rotation === 'number' && Number.isFinite(rotation) ? rotation % 360 : 0;

        const entry: AutoShapeEntry = {
            cNvPrId: this.nextCNvPrId,
            name: resolvedName,
            type,
            fromRow0: rowN - 1,
            fromCol0: columnN - 1,
            rowOffEmu: 0,
            colOffEmu: 0,
            widthEmu: pointsToEmu(width),
            heightEmu: pointsToEmu(height),
            anchorKind: 'twoCell',
            // Compute toRow0/toCol0 based on width/height in EMUs (approximate, as Excel does)
            toRow0: rowN, // one row down
            toCol0: columnN, // one column right
            toRowOffEmu: 0,
            toColOffEmu: 0,
            rotation: resolvedRotation,
            text: initialText,
            textHorizontalAlignment: 'left',
            textVerticalAlignment: 'top',
            fontName: undefined,
            fontSizePt: undefined,
            fontBold: false,
            fontItalic: false,
            fontColor: undefined,
            fill: {
                type: ShapeFillType.Solid,
                foreColor: undefined,
                backColor: undefined,
                transparency: undefined
            },
            line: {
                color: undefined,
                weight: 1,
                dashStyle: ShapeLineStyle.Solid
            },
            altText: resolvedAlt,
            isVisible: true,
            isMoveWithCell: moveWithCell !== false,
            isSizeWithCell: sizeWithCell === true
        };

        this.nextCNvPrId += 1;
        this.nextNameIndex += 1;
        this.entries.push(entry);
        this.markDirty();
        return this.handleFor(entry);
    }

    /**
     * Remove by handle or 0-based index into shapes.
     *
     * @param {number} target - The target parameter.
     * @returns {void} - Returns the result.
     */
    public removeShape(target: Shape | number): void {
        if (typeof target === 'number') {
            if (!Number.isInteger(target) || target < 0 || target >= this.entries.length) {
                throw new InvalidArgumentError(`removeShape index must be in 0..${this.entries.length - 1}`);
            }
            // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
            const entry: AutoShapeEntry = this.entries[target];
            if (entry !== undefined) {
                this.handles.delete(entry);
                this.entries.splice(target, 1);
                this.markDirty();
            }
            return;
        }
        if (target === null || typeof target !== 'object') {
            throw new InvalidArgumentError('removeShape requires a Shape or index');
        }
        const entry: AutoShapeEntry = (target as ShapeHandle).entry;
        if (entry === undefined) {
            throw new InvalidArgumentError('removeShape target is not a library Shape handle');
        }
        const idx: number = this.entries.indexOf(entry);
        if (idx < 0) {
            throw new InvalidArgumentError('Shape is not on this worksheet');
        }
        this.handles.delete(entry);
        this.entries.splice(idx, 1);
        this.markDirty();
    }

    /**
     * True when drawing package state may need rewrite.
     *
     * @returns {boolean} - Returns the result.
     */
    public get needsDrawingFlush(): boolean {
        return (
            this.dirty ||
            (this.loaded && (this.entries.length > 0 || this.foreignAnchorsXml.length > 0 || this.drawingPartName !== undefined))
        );
    }

    /**
     * True when the model should emit/replace the worksheet `<drawing>` element.
     *
     * @returns {boolean} - Returns the result.
     */
    public get ownsDrawingElement(): boolean {
        return this.dirty || this.drawingPartName !== undefined || this.entries.length > 0 || this.foreignAnchorsXml.length > 0;
    }

    /**
     * Write/remove drawing part and compute sheet drawing relationship. Call during worksheet flush after hyperlink retention filtering.
     *
     * @param {Object} sheetRelsCurrent - The sheetRelsCurrent parameter.
     * @returns {AutoShapesMaterializeResult} - Returns the result.
     */
    public materializeOnFlush(sheetRelsCurrent: ReadonlyArray<OpcRelationship>): AutoShapesMaterializeResult {
        const host: AutoShapesHost = this.host;
        const sheetPartName: string = host == null ? undefined : host.sheetPartName;

        // Strip existing drawing rels from the incoming set; we re-add if needed.
        const withoutDrawing: OpcRelationship[] = sheetRelsCurrent.filter(
            (r: OpcRelationship): boolean => !isDrawingRelationshipType(r.type)
        );

        const hasAnchors: boolean = this.entries.length > 0 || this.foreignAnchorsXml.length > 0;

        if (!this.ownsDrawingElement && !this.dirty) {
            return {
                sheetRelsWithoutDrawing: withoutDrawing,
                drawingRel: undefined,
                drawingRelationshipId: undefined,
                ownsDrawingElement: false
            };
        }

        if (!hasAnchors) {
            // Remove owned drawing part if we had one.
            if (host !== undefined && this.drawingPartName !== undefined) {
                host.package.removePart(this.drawingPartName);
            }
            this.drawingPartName = undefined;
            this.drawingRelId = undefined;
            this.dirty = false;
            return {
                sheetRelsWithoutDrawing: withoutDrawing,
                drawingRel: undefined,
                drawingRelationshipId: undefined,
                ownsDrawingElement: false
            };
        }

        if (host === undefined || sheetPartName === undefined) {
            // No package binding — still report that drawing element is owned so bags strip.
            const xml: string = serializeDrawingXml(this.entries, this.foreignAnchorsXml);
            void xml;
            return {
                sheetRelsWithoutDrawing: withoutDrawing,
                drawingRel: undefined,
                drawingRelationshipId: this.drawingRelId,
                ownsDrawingElement: true
            };
        }

        const partName: string = this.drawingPartName != null ? this.drawingPartName : allocateDrawingPartName(host.package);
        this.drawingPartName = partName;

        const xml: string = serializeDrawingXml(this.entries, this.foreignAnchorsXml);
        host.package.setPart(partName, encodeUtf8(xml), DRAWING_CONTENT_TYPE);

        let maxNum: number = 0;
        for (const r of withoutDrawing) {
            const m: RegExpExecArray = /^rId(\d+)$/i.exec(r.id);
            if (m !== null && m[1] !== undefined) {
                const n: number = Number.parseInt(m[1], 10);
                if (Number.isFinite(n) && n > maxNum) {
                    maxNum = n;
                }
            }
        }

        let relId: string = this.drawingRelId;
        const idTaken: boolean = relId !== undefined && withoutDrawing.some((r: OpcRelationship): boolean => r.id === relId);
        if (relId === undefined || idTaken) {
            maxNum += 1;
            relId = `rId${maxNum}`;
        }
        this.drawingRelId = relId;

        const target: string = relativeTargetFromSheetToDrawing(sheetPartName, partName);
        const drawingRel: OpcRelationship = {
            id: relId,
            type: DRAWING_REL_TYPE_TRANSITIONAL,
            target,
            resolvedTarget: resolveRelationshipTarget(sheetPartName, target, undefined)
        };

        this.dirty = false;
        return {
            sheetRelsWithoutDrawing: withoutDrawing,
            drawingRel,
            drawingRelationshipId: relId,
            ownsDrawingElement: true
        };
    }

    /**
     * markDirty method.
     *
     * @returns {void} - Returns the result.
     */
    private markDirty(): void {
        this.dirty = true;
        if (this.host != null) {
            this.host.markDirty();
        }
    }

    /**
     * handleFor method.
     *
     * @param {AutoShapeEntry} entry - The entry parameter.
     * @returns {Shape} - Returns the result.
     */
    private handleFor(entry: AutoShapeEntry): Shape {
        let h: ShapeHandle = this.handles.get(entry);
        if (h === undefined) {
            h = new ShapeHandle(entry, (): void => this.markDirty());
            this.handles.set(entry, h);
        }
        return h;
    }
}

/**
 * ShapeHandle class.
 */
class ShapeHandle implements Shape {
    /** @private */
    public readonly entry: AutoShapeEntry;
    private readonly markDirty: () => void;

    /**
     * Creates an instance.
     *
     * @param {AutoShapeEntry} entry - The entry parameter.
     * @param {any} markDirty - The markDirty parameter.
     */
    public constructor(entry: AutoShapeEntry, markDirty: () => void) {
        this.entry = entry;
        this.markDirty = markDirty;
    }

    /**
     * Gets id.
     *
     * @returns {number} - Returns the result.
     */
    public get id(): number {
        return this.entry.cNvPrId;
    }

    /**
     * Gets type.
     *
     * @returns {AutoShapeType} - Returns the result.
     */
    public get type(): AutoShapeType {
        return this.entry.type;
    }

    /**
     * Gets row.
     *
     * @returns {number} - Returns the result.
     */
    public get row(): number {
        return this.entry.fromRow0 + 1;
    }

    /**
     * Sets row.
     *
     * @param {number} value - The value parameter.
     */
    public set row(value: number) {
        const row: number = requirePositiveInt(value, 'row');
        this.entry.fromRow0 = row - 1;
        this.markDirty();
    }

    /**
     * Gets column.
     *
     * @returns {number} - Returns the result.
     */
    public get column(): number {
        return this.entry.fromCol0 + 1;
    }

    /**
     * Sets column.
     *
     * @param {number} value - The value parameter.
     */
    public set column(value: number) {
        const col: number = requirePositiveInt(value, 'column');
        this.entry.fromCol0 = col - 1;
        this.markDirty();
    }

    /**
     * Gets width.
     *
     * @returns {number} - Returns the result.
     */
    public get width(): number {
        return this.entry.widthEmu / EMU_PER_PT;
    }

    /**
     * Sets width.
     *
     * @param {number} value - The value parameter.
     */
    public set width(value: number) {
        requirePositivePoints(value, 'width');
        this.entry.widthEmu = pointsToEmu(value);
        this.markDirty();
    }

    /**
     * Gets height.
     *
     * @returns {number} - Returns the result.
     */
    public get height(): number {
        return this.entry.heightEmu / EMU_PER_PT;
    }

    /**
     * Sets height.
     *
     * @param {number} value - The value parameter.
     */
    public set height(value: number) {
        requirePositivePoints(value, 'height');
        this.entry.heightEmu = pointsToEmu(value);
        this.markDirty();
    }

    /**
     * Gets rotation.
     *
     * @returns {number} - Returns the result.
     */
    public get rotation(): number {
        return this.entry.rotation;
    }

    /**
     * Sets rotation.
     *
     * @param {number} value - The value parameter.
     */
    public set rotation(value: number) {
        if (typeof value !== 'number' || !Number.isFinite(value)) {
            throw new InvalidArgumentError('rotation must be a finite number');
        }
        this.entry.rotation = value % 360;
        this.markDirty();
    }

    /**
     * Gets fill.
     *
     * @returns {*} - Returns the result.
     */
    public get fill(): ShapeFill | undefined {
        return this.entry.fill;
    }

    /**
     * Sets fill.
     *
     * @param {*} value - The value parameter.
     */
    public set fill(value: ShapeFill | undefined) {
        if (value === undefined) {
            this.entry.fill = {
                type: ShapeFillType.Solid,
                foreColor: 'FFFFFF',
                backColor: undefined,
                transparency: 0
            };
        } else {
            this.entry.fill = value;
        }
        this.markDirty();
    }

    /**
     * Gets line.
     *
     * @returns {*} - Returns the result.
     */
    public get line(): ShapeLineFormat | undefined {
        return this.entry.line;
    }

    /**
     * Sets line.
     *
     * @param {*} value - The value parameter.
     */
    public set line(value: ShapeLineFormat | undefined) {
        if (value === undefined) {
            this.entry.line = {
                color: undefined,
                weight: 1,
                dashStyle: ShapeLineStyle.Solid
            };
        } else {
            this.entry.line = value;
        }
        this.markDirty();
    }

    /**
     * Gets textFrame.
     *
     * @returns {ShapeTextFrame} - Returns the result.
     */
    public get textFrame(): ShapeTextFrame {
        const frame: ShapeTextFrame = {
            text: this.entry.text,
            horizontalAlignment: this.entry.textHorizontalAlignment,
            verticalAlignment: this.entry.textVerticalAlignment,
            font: {
                name: this.entry.fontName,
                size: this.entry.fontSizePt,
                bold: this.entry.fontBold,
                italic: this.entry.fontItalic,
                color: this.entry.fontColor
            }
        };
        if (this.entry.runs !== undefined) {
            frame.richText = this.entry.runs.map((r: ShapeTextRun): ShapeTextRun => ({ text: r.text, font: { ...r.font } }));
        }
        return frame;
    }

    /**
     * Sets textFrame.
     *
     * @param {ShapeTextFrame} value - The value parameter.
     */
    public set textFrame(value: ShapeTextFrame) {
        if (value === null || typeof value !== 'object') {
            throw new InvalidArgumentError('textFrame must be an object');
        }
        this.entry.text = String(value.text != null ? value.text : '');
        const runs: ShapeTextRun[] | undefined = Array.isArray(value.richText) ? value.richText : undefined;
        this.entry.runs =
            runs !== undefined && runs.length > 0 && runs.map((r: ShapeTextRun): string => r.text).join('') === this.entry.text
                ? runs.map((r: ShapeTextRun): ShapeTextRun => ({
                    text: r.text,
                    font: {
                        name: r.font.name,
                        size: r.font.size,
                        bold: Boolean(r.font.bold),
                        italic: Boolean(r.font.italic),
                        underline: Boolean(r.font.underline),
                        color: normalizeColorOrClear(r.font.color)
                    }
                }))
                : undefined;
        this.entry.textHorizontalAlignment = (value.horizontalAlignment != null ? value.horizontalAlignment : 'left') as
            'left' | 'center' | 'right' | 'justify';
        this.entry.textVerticalAlignment = (value.verticalAlignment != null ? value.verticalAlignment : 'top') as
            'top' | 'middle' | 'bottom';
        if (value.font) {
            this.entry.fontName = value.font.name;
            this.entry.fontSizePt = value.font.size;
            this.entry.fontBold = Boolean(value.font.bold);
            this.entry.fontItalic = Boolean(value.font.italic);
            this.entry.fontColor = normalizeColorOrClear(value.font.color);
        }
        this.markDirty();
    }

    /**
     * Gets name.
     *
     * @returns {string} - Returns the result.
     */
    public get name(): string | undefined {
        return this.entry.name;
    }

    /**
     * Sets name.
     *
     * @param {string} value - The value parameter.
     */
    public set name(value: string | undefined) {
        const resolvedName: string =
            value === undefined || value === null || String(value).trim() === '' ? `Shape ${this.entry.cNvPrId}` : String(value);
        this.entry.name = resolvedName;
        this.markDirty();
    }

    /**
     * Gets altText.
     *
     * @returns {string} - Returns the result.
     */
    public get altText(): string | undefined {
        return this.entry.altText;
    }

    /**
     * Sets altText.
     *
     * @param {string} value - The value parameter.
     */
    public set altText(value: string | undefined) {
        this.entry.altText = value === undefined || value === null ? undefined : String(value);
        this.markDirty();
    }

    /**
     * Gets isVisible.
     *
     * @returns {boolean} - Returns the result.
     */
    public get isVisible(): boolean {
        return this.entry.isVisible;
    }

    /**
     * Sets isVisible.
     *
     * @param {boolean} value - The value parameter.
     */
    public set isVisible(value: boolean) {
        this.entry.isVisible = Boolean(value);
        this.markDirty();
    }

    /**
     * Gets isMoveWithCell.
     *
     * @returns {boolean} - Returns the result.
     */
    public get isMoveWithCell(): boolean {
        return this.entry.isMoveWithCell;
    }

    /**
     * Sets isMoveWithCell.
     *
     * @param {boolean} value - The value parameter.
     */
    public set isMoveWithCell(value: boolean) {
        this.entry.isMoveWithCell = Boolean(value);
        this.markDirty();
    }

    /**
     * Gets isSizeWithCell.
     *
     * @returns {boolean} - Returns the result.
     */
    public get isSizeWithCell(): boolean {
        return this.entry.isSizeWithCell;
    }

    /**
     * Sets isSizeWithCell.
     *
     * @param {boolean} value - The value parameter.
     */
    public set isSizeWithCell(value: boolean) {
        this.entry.isSizeWithCell = Boolean(value);
        this.markDirty();
    }
}

/**
 * CT_Worksheet successors after `drawing` (for insert index).
 */
export const DRAWING_SUCCESSORS: ReadonlyArray<string> = PAGE_SETUP_SUCCESSORS.filter((n: string): boolean => n !== 'drawing');

/**
 * Normalize color value to uppercase RRGGBB or undefined.
 *
 * @param {string} val - The val parameter.
 * @returns {string} - Returns the result.
 */
function normalizeColorOrClear(val: string | undefined): string | undefined {
    if (val === undefined || val === null) {
        return undefined;
    }
    let s: string = String(val).toUpperCase().trim();
    if (s.startsWith('#')) {
        s = s.substring(1);
    }
    if (s.length === 6 && /^[0-9A-F]{6}$/.test(s)) {
        return s;
    }
    return undefined;
}

/**
 * Extract trailing number from a name like "Shape 3" or "TextBox 1".
 *
 * @param {string} name - The name parameter.
 * @returns {number} - Returns the result.
 */
function extractTrailingNumber(name: string): number | undefined {
    const m: RegExpExecArray = /(\d+)$/.exec(name);
    if (m !== null && m[1] !== undefined) {
        const n: number = Number.parseInt(m[1], 10);
        if (Number.isFinite(n)) {
            return n;
        }
    }
    return undefined;
}

/**
 * pointsToEmu function.
 *
 * @param {number} points - The points parameter.
 * @returns {number} - Returns the result.
 */
function pointsToEmu(points: number): number {
    return Math.round(points * EMU_PER_PT);
}

/**
 * requirePositivePoints function.
 *
 * @param {number} value - The value parameter.
 * @param {string} label - The label parameter.
 * @returns {void} - Returns the result.
 */
function requirePositivePoints(value: number, label: string): void {
    if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
        throw new InvalidArgumentError(`${label} must be a positive number of points`);
    }
}

/**
 * requirePositiveInt function.
 *
 * @param {*} val - The val parameter.
 * @param {string} fieldName - The fieldName parameter.
 * @returns {number} - Returns the result.
 */
function requirePositiveInt(val: unknown, fieldName: string): number {
    if (typeof val !== 'number' || !Number.isInteger(val) || val < 1) {
        throw new InvalidArgumentError(`${fieldName} must be a positive integer`);
    }
    return val;
}

/**
 * Allocate next drawing part name (e.g., `/xl/drawings/drawing1.xml`).
 *
 * @param {OpcPackage} pkg - The pkg parameter.
 * @returns {string} - Returns the result.
 */
function allocateDrawingPartName(pkg: OpcPackage): string {
    let num: number = 1;
    while (pkg.getPart(`/xl/drawings/drawing${num}.xml`) !== undefined) {
        num += 1;
    }
    return `/xl/drawings/drawing${num}.xml`;
}

/**
 * Compute relative target from sheet part to drawing part (for rels).
 *
 * @param {string} sheetPartName - The sheetPartName parameter.
 * @param {string} drawingPartName - The drawingPartName parameter.
 * @returns {string} - Returns the result.
 */
function relativeTargetFromSheetToDrawing(sheetPartName: string, drawingPartName: string): string {
    // Both are absolute part names; compute relative target.
    // E.g., /xl/worksheets/sheet1.xml -> /xl/drawings/drawing1.xml => ../drawings/drawing1.xml
    const sheetDir: string = sheetPartName.substring(0, sheetPartName.lastIndexOf('/'));
    const drawingFile: string = drawingPartName.substring(drawingPartName.lastIndexOf('/') + 1);
    const up: '../' | './' = sheetDir === '/xl' ? './' : '../';
    return up + 'drawings/' + drawingFile;
}

/**
 * Parse drawing XML and extract shapes + foreign anchors.
 *
 * @param {string} xml - The xml parameter.
 * @returns {Object} - Returns the result.
 */
function parseDrawingXml(xml: string, themeColors: ReadonlyArray<string | undefined>): { shapes: AutoShapeEntry[]; foreignAnchorsXml: string[] } {
    const shapes: AutoShapeEntry[] = [];
    const foreignAnchorsXml: string[] = [];

    // Minimal parser for wsDr element and its children.
    // Accept both <xdr:wsDr> (Excel / our output) and the legacy unprefixed <wsDr> form.
    const rootMatch: RegExpExecArray = /<xdr:wsDr[^>]*>|<wsDr[^>]*xmlns:xdr="[^"]*"[^>]*>/i.exec(xml);
    if (!rootMatch) {
        return { shapes: [], foreignAnchorsXml: [] };
    }

    // Closing tag may be </xdr:wsDr> or </wsDr> — try both.
    const endIndex: number =
        xml.indexOf('</xdr:wsDr>', rootMatch.index) > 0
            ? xml.indexOf('</xdr:wsDr>', rootMatch.index)
            : xml.indexOf('</wsDr>', rootMatch.index);
    const content: string = endIndex > 0 ? xml.substring(rootMatch[0].length, endIndex) : '';

    // Extract one-cell and two-cell anchors.
    const anchorPattern: RegExp = /<xdr:(oneCell|twoCell)Anchor[^>]*>[\s\S]*?<\/xdr:\1Anchor>/gi;
    let match: any;

    // eslint-disable-next-line no-cond-assign -- intentional assign-in-condition while parsing
    while ((match = anchorPattern.exec(content)) !== null) {
        const anchorXml: string = match[0];
        const anchorKind: 'oneCell' | 'twoCell' = /oneCell/i.test(match[1] != null ? match[1] : '') ? 'oneCell' : 'twoCell';

        // Try to parse as a shape; if not, treat as foreign.
        const shapeEntry: AutoShapeEntry = tryParseShapeAnchor(anchorXml, anchorKind, themeColors);
        if (shapeEntry) {
            shapes.push(shapeEntry);
        } else {
            foreignAnchorsXml.push(anchorXml);
        }
    }

    return { shapes, foreignAnchorsXml };
}

/** A resolved DrawingML color. */
interface ParsedColor {
    hex: string;
    /** Transparency in percent (0 opaque, 100 clear). */
    transparency: number;
}

const SCHEME_COLOR_INDEX: { [key: string]: number } = {
    dk1: 0, lt1: 1, dk2: 2, lt2: 3, accent1: 4, accent2: 5, accent3: 6, accent4: 7,
    accent5: 8, accent6: 9, hlink: 10, folHlink: 11, tx1: 0, bg1: 1, tx2: 2, bg2: 3
};

const PRESET_COLORS: { [key: string]: string } = {
    black: '000000', white: 'FFFFFF', red: 'FF0000', green: '008000', blue: '0000FF', yellow: 'FFFF00',
    gray: '808080', grey: '808080', orange: 'FFA500', purple: '800080'
};

const DASH_STYLES: { [key: string]: ShapeLineStyle } = {
    solid: ShapeLineStyle.Solid,
    dash: ShapeLineStyle.Dash,
    sysDash: ShapeLineStyle.Dash,
    dot: ShapeLineStyle.Dot,
    sysDot: ShapeLineStyle.Dot,
    dashDot: ShapeLineStyle.DashDot,
    sysDashDot: ShapeLineStyle.DashDot,
    dashDotDot: ShapeLineStyle.DashDotDot,
    sysDashDotDot: ShapeLineStyle.DashDotDot,
    lgDash: ShapeLineStyle.LongDash,
    lgDashDot: ShapeLineStyle.DashLongDash,
    lgDashDotDot: ShapeLineStyle.DashLongDash
};

/**
 * Read the workbook theme's twelve colors (Office defaults when there is no theme part).
 *
 * @param {OpcPackage} pkg - The package.
 * @returns {Array} - Theme colors indexed by theme slot.
 */
function loadThemeColors(pkg: OpcPackage): ReadonlyArray<string | undefined> {
    const rels: ReadonlyArray<OpcRelationship> = pkg.getRelationships(pkg.officeDocumentPartName());
    const themeRel: OpcRelationship = rels.find((r: OpcRelationship): boolean => isThemeRelationshipType(r.type));
    const themePart: any = themeRel ? pkg.getPart(themeRel.resolvedTarget) : undefined;
    if (themePart !== undefined) {
        const scheme: ReadonlyArray<string | undefined> = parseThemeColorScheme(decodeUtf8(themePart.data)).colors;
        if (scheme.length > 0) {
            return scheme;
        }
    }
    return defaultThemeColorScheme().colors;
}

/**
 * Clamp a number to the 0..1 range.
 *
 * @param {number} v - The value.
 * @returns {number} - The clamped value.
 */
function clamp01(v: number): number {
    return v < 0 ? 0 : v > 1 ? 1 : v;
}

/**
 * Convert RGB (0-255) to HSL (0-1).
 *
 * @param {number} r - Red.
 * @param {number} g - Green.
 * @param {number} b - Blue.
 * @returns {number[]} - Hue, saturation, lightness.
 */
function rgbToHsl(r: number, g: number, b: number): number[] {
    const rr: number = r / 255;
    const gg: number = g / 255;
    const bb: number = b / 255;
    const max: number = Math.max(rr, gg, bb);
    const min: number = Math.min(rr, gg, bb);
    const l: number = (max + min) / 2;
    if (max === min) {
        return [0, 0, l];
    }
    const d: number = max - min;
    const sat: number = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    let h: number;
    if (max === rr) {
        h = (gg - bb) / d + (gg < bb ? 6 : 0);
    } else if (max === gg) {
        h = (bb - rr) / d + 2;
    } else {
        h = (rr - gg) / d + 4;
    }
    return [h / 6, sat, l];
}

/**
 * Convert one hue sector to an RGB channel fraction.
 *
 * @param {number} p - Lower bound.
 * @param {number} q - Upper bound.
 * @param {number} tIn - Hue offset.
 * @returns {number} - Channel fraction.
 */
function hueToChannel(p: number, q: number, tIn: number): number {
    let t: number = tIn;
    if (t < 0) {
        t += 1;
    }
    if (t > 1) {
        t -= 1;
    }
    if (t < 1 / 6) {
        return p + (q - p) * 6 * t;
    }
    if (t < 1 / 2) {
        return q;
    }
    if (t < 2 / 3) {
        return p + (q - p) * (2 / 3 - t) * 6;
    }
    return p;
}

/**
 * Convert HSL (0-1) to RGB (0-255).
 *
 * @param {number} h - Hue.
 * @param {number} sat - Saturation.
 * @param {number} l - Lightness.
 * @returns {number[]} - Red, green, blue.
 */
function hslToRgb(h: number, sat: number, l: number): number[] {
    if (sat === 0) {
        return [l * 255, l * 255, l * 255];
    }
    const q: number = l < 0.5 ? l * (1 + sat) : l + sat - l * sat;
    const p: number = 2 * l - q;
    return [hueToChannel(p, q, h + 1 / 3) * 255, hueToChannel(p, q, h) * 255, hueToChannel(p, q, h - 1 / 3) * 255];
}

/**
 * Format a channel as two uppercase hex digits.
 *
 * @param {number} n - Channel value.
 * @returns {string} - Hex digits.
 */
function toHex2(n: number): string {
    const v: number = Math.max(0, Math.min(255, Math.round(n)));
    return (v < 16 ? '0' : '') + v.toString(16).toUpperCase();
}

/**
 * Resolve the first DrawingML color element (srgbClr / schemeClr / sysClr / prstClr) in a fragment,
 * applying lumMod, lumOff, satMod, shade, tint and alpha in document order.
 *
 * @param {string} xml - Fragment containing a color element.
 * @param {Array} themeColors - Theme colors.
 * @returns {ParsedColor | undefined} - The resolved color, or undefined.
 */
function parseColor(xml: string, themeColors: ReadonlyArray<string | undefined>): ParsedColor | undefined {
    const m: RegExpExecArray = /<a:(srgbClr|schemeClr|sysClr|prstClr)\b([^>]*?)(?:\/>|>([\s\S]*?)<\/a:\1>)/i.exec(xml);
    if (!m) {
        return undefined;
    }
    const attrs: Map<string, string> = parseAttrMap(m[2]);
    const val: string = attrs.get('val');
    let hex: string | undefined;
    if (m[1] === 'srgbClr') {
        hex = val && /^[0-9A-Fa-f]{6}$/.test(val) ? val.toUpperCase() : undefined;
    } else if (m[1] === 'schemeClr') {
        const idx: number = SCHEME_COLOR_INDEX[val];
        hex = idx !== undefined && themeColors[idx] ? themeColors[idx].replace('#', '').toUpperCase() : undefined;
    } else if (m[1] === 'sysClr') {
        const last: string = attrs.get('lastClr');
        hex = last && /^[0-9A-Fa-f]{6}$/.test(last) ? last.toUpperCase() : val === 'windowText' ? '000000' : val === 'window' ? 'FFFFFF' : undefined;
    } else {
        hex = PRESET_COLORS[val];
    }
    if (hex === undefined) {
        return undefined;
    }
    let rgb: number[] = [parseInt(hex.substring(0, 2), 16), parseInt(hex.substring(2, 4), 16), parseInt(hex.substring(4, 6), 16)];
    let alpha: number = 100000;
    const modPattern: RegExp = /<a:(lumMod|lumOff|satMod|shade|tint|alpha)\s+val="(-?\d+)"/gi;
    let mod: RegExpExecArray;
    // eslint-disable-next-line no-cond-assign -- intentional assign-in-condition while parsing
    while ((mod = modPattern.exec(m[3] || '')) !== null) {
        const pct: number = Number.parseInt(mod[2], 10) / 100000;
        const kind: string = mod[1];
        if (kind === 'alpha') {
            alpha = pct * 100000;
        } else if (kind === 'shade') {
            rgb = rgb.map((c: number): number => c * pct);
        } else if (kind === 'tint') {
            rgb = rgb.map((c: number): number => c * pct + 255 * (1 - pct));
        } else {
            const hsl: number[] = rgbToHsl(rgb[0], rgb[1], rgb[2]);
            if (kind === 'lumMod') {
                hsl[2] = clamp01(hsl[2] * pct);
            } else if (kind === 'lumOff') {
                hsl[2] = clamp01(hsl[2] + pct);
            } else {
                hsl[1] = clamp01(hsl[1] * pct);
            }
            rgb = hslToRgb(hsl[0], hsl[1], hsl[2]);
        }
    }
    return { hex: toHex2(rgb[0]) + toHex2(rgb[1]) + toHex2(rgb[2]), transparency: Math.round(100 - alpha / 1000) };
}

/**
 * Read a shape fill from spPr, falling back to the style's fillRef.
 *
 * @param {string} spPrNoLn - spPr markup without the outline.
 * @param {string} styleXml - The xdr:style markup.
 * @param {Array} themeColors - Theme colors.
 * @returns {ShapeFill} - The fill.
 */
function parseFill(spPrNoLn: string, styleXml: string, themeColors: ReadonlyArray<string | undefined>): ShapeFill {
    const kindMatch: RegExpExecArray = /<a:(noFill|solidFill|gradFill|pattFill)\b/i.exec(spPrNoLn);
    const kind: string = kindMatch ? kindMatch[1] : undefined;
    if (kind === 'noFill') {
        return { type: ShapeFillType.Solid, foreColor: undefined, backColor: undefined, transparency: 100 };
    }
    if (kind === 'solidFill') {
        const block: RegExpExecArray = /<a:solidFill\b[^>]*>([\s\S]*?)<\/a:solidFill>/i.exec(spPrNoLn);
        const c: ParsedColor = block ? parseColor(block[1], themeColors) : undefined;
        return { type: ShapeFillType.Solid, foreColor: c ? c.hex : 'FFFFFF', backColor: undefined, transparency: c ? c.transparency : 0 };
    }
    if (kind === 'gradFill') {
        const block: RegExpExecArray = /<a:gradFill\b[^>]*>([\s\S]*?)<\/a:gradFill>/i.exec(spPrNoLn);
        const stops: ParsedColor[] = [];
        const gsPattern: RegExp = /<a:gs\b[^>]*>([\s\S]*?)<\/a:gs>/gi;
        let gs: RegExpExecArray;
        // eslint-disable-next-line no-cond-assign -- intentional assign-in-condition while parsing
        while (block && (gs = gsPattern.exec(block[1])) !== null) {
            const c: ParsedColor = parseColor(gs[1], themeColors);
            if (c) {
                stops.push(c);
            }
        }
        return {
            type: ShapeFillType.Gradient,
            foreColor: stops.length > 0 ? stops[0].hex : undefined,
            backColor: stops.length > 1 ? stops[stops.length - 1].hex : undefined,
            transparency: stops.length > 0 ? stops[0].transparency : 0
        };
    }
    if (kind === 'pattFill') {
        const fg: RegExpExecArray = /<a:fgClr\b[^>]*>([\s\S]*?)<\/a:fgClr>/i.exec(spPrNoLn);
        const bg: RegExpExecArray = /<a:bgClr\b[^>]*>([\s\S]*?)<\/a:bgClr>/i.exec(spPrNoLn);
        const fgc: ParsedColor = fg ? parseColor(fg[1], themeColors) : undefined;
        const bgc: ParsedColor = bg ? parseColor(bg[1], themeColors) : undefined;
        return {
            type: ShapeFillType.Pattern,
            foreColor: fgc ? fgc.hex : undefined,
            backColor: bgc ? bgc.hex : undefined,
            transparency: fgc ? fgc.transparency : 0
        };
    }
    const ref: RegExpExecArray = /<a:fillRef\b[^>]*>([\s\S]*?)<\/a:fillRef>/i.exec(styleXml);
    const rc: ParsedColor = ref ? parseColor(ref[1], themeColors) : undefined;
    return { type: ShapeFillType.Solid, foreColor: rc ? rc.hex : 'FFFFFF', backColor: undefined, transparency: 0 };
}

/**
 * Read a shape outline from spPr, falling back to the style's lnRef.
 *
 * @param {string} spPrXml - spPr markup.
 * @param {string} styleXml - The xdr:style markup.
 * @param {Array} themeColors - Theme colors.
 * @returns {ShapeLineFormat} - The outline.
 */
function parseLine(spPrXml: string, styleXml: string, themeColors: ReadonlyArray<string | undefined>): ShapeLineFormat {
    const lnMatch: RegExpExecArray = /<a:ln\b([^>]*?)(?:\/>|>([\s\S]*?)<\/a:ln>)/i.exec(spPrXml);
    const lnAttrs: Map<string, string> = lnMatch ? parseAttrMap(lnMatch[1]) : new Map<string, string>();
    const lnBody: string = lnMatch && lnMatch[2] ? lnMatch[2] : '';
    const widthEmu: number = Number.parseInt(lnAttrs.get('w') || '', 10);
    const weight: number = Number.isFinite(widthEmu) ? Math.max(1, Math.round(widthEmu / 12700)) : 1;
    const dashMatch: RegExpExecArray = /<a:prstDash\s+val="([^"]*)"/i.exec(lnBody);
    const dashStyle: ShapeLineStyle = dashMatch && DASH_STYLES[dashMatch[1]] ? DASH_STYLES[dashMatch[1]] : ShapeLineStyle.Solid;
    if (/<a:noFill\b/i.test(lnBody)) {
        return { color: undefined, weight, dashStyle };
    }
    const solid: RegExpExecArray = /<a:solidFill\b[^>]*>([\s\S]*?)<\/a:solidFill>/i.exec(lnBody);
    let color: ParsedColor = solid ? parseColor(solid[1], themeColors) : undefined;
    if (color === undefined && !solid) {
        const ref: RegExpExecArray = /<a:lnRef\b[^>]*>([\s\S]*?)<\/a:lnRef>/i.exec(styleXml);
        color = ref ? parseColor(ref[1], themeColors) : undefined;
    }
    return { color: color ? color.hex : undefined, weight, dashStyle };
}

/**
 * Read paragraphs and runs from a text body.
 *
 * @param {string} txBodyXml - txBody inner markup.
 * @param {Array} themeColors - Theme colors.
 * @returns {Object} - The runs and the first paragraph's alignment.
 */
function parseTextBody(
    txBodyXml: string,
    themeColors: ReadonlyArray<string | undefined>
): { runs: ShapeTextRun[]; hAlign: 'left' | 'center' | 'right' | 'justify' } {
    const runs: ShapeTextRun[] = [];
    let hAlign: 'left' | 'center' | 'right' | 'justify' = 'left';
    let seenPara: boolean = false;
    const paraPattern: RegExp = /<a:p\b([^>]*?)(?:\/>|>([\s\S]*?)<\/a:p>)/gi;
    let para: RegExpExecArray;
    // eslint-disable-next-line no-cond-assign -- intentional assign-in-condition while parsing
    while ((para = paraPattern.exec(txBodyXml)) !== null) {
        if (seenPara) {
            runs.push({ text: '\n', font: { name: undefined, size: undefined, bold: false, italic: false, underline: false, color: undefined } });
        }
        const body: string = para[2] || '';
        if (!seenPara) {
            const algn: RegExpExecArray = /<a:pPr\b[^>]*?\balgn="([^"]*)"/i.exec(body);
            hAlign = algn ? (algn[1] === 'ctr' ? 'center' : algn[1] === 'r' ? 'right' : algn[1] === 'just' ? 'justify' : 'left') : 'left';
        }
        seenPara = true;
        const runPattern: RegExp = /<a:r\b[^>]*>([\s\S]*?)<\/a:r>|<a:br\b[^>]*?(?:\/>|>[\s\S]*?<\/a:br>)/gi;
        let run: RegExpExecArray;
        // eslint-disable-next-line no-cond-assign -- intentional assign-in-condition while parsing
        while ((run = runPattern.exec(body)) !== null) {
            if (run[1] === undefined) {
                runs.push({ text: '\n', font: { name: undefined, size: undefined, bold: false, italic: false, underline: false, color: undefined } });
                continue;
            }
            const tMatch: RegExpExecArray = /<a:t\b[^>]*?(?:\/>|>([\s\S]*?)<\/a:t>)/i.exec(run[1]);
            const rPrMatch: RegExpExecArray = /<a:rPr\b([^>]*?)(?:\/>|>([\s\S]*?)<\/a:rPr>)/i.exec(run[1]);
            const ra: Map<string, string> = rPrMatch ? parseAttrMap(rPrMatch[1]) : new Map<string, string>();
            const rBody: string = rPrMatch && rPrMatch[2] ? rPrMatch[2] : '';
            const sz: number = Number.parseInt(ra.get('sz') || '', 10);
            const latin: RegExpExecArray = /<a:latin\b[^>]*?\btypeface="([^"]*)"/i.exec(rBody);
            const fillBlock: RegExpExecArray = /<a:solidFill\b[^>]*>([\s\S]*?)<\/a:solidFill>/i.exec(rBody);
            const color: ParsedColor = fillBlock ? parseColor(fillBlock[1], themeColors) : undefined;
            runs.push({
                text: tMatch && tMatch[1] ? unescapeXml(tMatch[1]) : '',
                font: {
                    name: latin ? unescapeXml(latin[1]) : undefined,
                    size: Number.isFinite(sz) ? sz / 100 : undefined,
                    bold: ra.get('b') === '1' || ra.get('b') === 'true',
                    italic: ra.get('i') === '1' || ra.get('i') === 'true',
                    underline: ra.get('u') !== undefined && ra.get('u') !== 'none',
                    color: color ? color.hex : undefined
                }
            });
        }
    }
    return { runs, hAlign };
}

/**
 * Serialize formatted runs as DrawingML paragraphs.
 *
 * @param {ShapeTextRun[]} runs - The runs.
 * @param {string} hAlign - The `algn` value.
 * @returns {string} - Paragraph markup.
 */
function serializeRunsAsParagraphs(runs: ReadonlyArray<ShapeTextRun>, hAlign: string): string {
    const paras: string[] = [];
    let current: string[] = [];
    const flush: () => void = (): void => {
        paras.push(`<a:p><a:pPr algn="${hAlign}"/>${current.join('')}</a:p>`);
        current = [];
    };
    for (const run of runs) {
        if (run.text === '\n') {
            flush();
            continue;
        }
        const f: ShapeTextRun['font'] = run.font;
        const attrs: string =
            ' lang="en-US"' +
            (f.size !== undefined ? ` sz="${Math.round(f.size * 100)}"` : '') +
            (f.bold ? ' b="1"' : '') +
            (f.italic ? ' i="1"' : '') +
            (f.underline ? ' u="sng"' : '');
        const kids: string =
            (f.color ? `<a:solidFill><a:srgbClr val="${f.color}"/></a:solidFill>` : '') +
            (f.name ? `<a:latin typeface="${escapeXml(f.name)}"/>` : '');
        current.push(`<a:r><a:rPr${attrs}${kids ? `>${kids}</a:rPr>` : '/>'}<a:t>${escapeXmlText(run.text)}</a:t></a:r>`);
    }
    flush();
    return paras.join('');
}

/**
 * Try to parse an anchor XML as an autoshape. Return entry or null if not recognized.
 *
 * @param {string} anchorXml - The anchorXml parameter.
 * @param {Object} anchorKind - The anchorKind parameter.
 * @returns {Object} - Returns the result.
 */
function tryParseShapeAnchor(
    anchorXml: string,
    anchorKind: 'oneCell' | 'twoCell',
    themeColors: ReadonlyArray<string | undefined>
): AutoShapeEntry | null {
    // Look for a preset shape (prstSp) inside the anchor.
    const prstSpMatch: RegExpExecArray = /<xdr:sp[^>]*>[\s\S]*?<xdr:spPr>[\s\S]*?<a:prstGeom\s+prst="([^"]*)"[\s\S]*?<\/xdr:sp>/i.exec(
        anchorXml
    );

    if (!prstSpMatch) {
        return null;
    }

    const prst: AutoShapeType = prstSpMatch[1] as AutoShapeType;

    // Parse position and size.
    const fromMatch: RegExpExecArray =
        /<xdr:from>[\s\S]*?<xdr:col>(\d+)<\/xdr:col>[\s\S]*?<xdr:colOff>(\d+)<\/xdr:colOff>[\s\S]*?<xdr:row>(\d+)<\/xdr:row>[\s\S]*?<xdr:rowOff>(\d+)<\/xdr:rowOff>[\s\S]*?<\/xdr:from>/i.exec(
            anchorXml
        );
    const toMatch: RegExpExecArray =
        /<xdr:to>[\s\S]*?<xdr:col>(\d+)<\/xdr:col>[\s\S]*?<xdr:colOff>(\d+)<\/xdr:colOff>[\s\S]*?<xdr:row>(\d+)<\/xdr:row>[\s\S]*?<xdr:rowOff>(\d+)<\/xdr:rowOff>[\s\S]*?<\/xdr:to>/i.exec(
            anchorXml
        );

    const spPrMatch: RegExpExecArray = /<xdr:spPr\b[^>]*>([\s\S]*?)<\/xdr:spPr>/i.exec(anchorXml);
    const spPrXml: string = spPrMatch ? spPrMatch[1] : '';
    const xfrmMatch: RegExpExecArray = /<a:xfrm\b([^>]*)>([\s\S]*?)<\/a:xfrm>/i.exec(spPrXml);
    const xfrmAttrs: Map<string, string> = xfrmMatch ? parseAttrMap(xfrmMatch[1]) : new Map<string, string>();
    // oneCell/absolute anchors carry <xdr:ext>; twoCell anchors store the size in <a:xfrm><a:ext>.
    const extMatch: RegExpExecArray =
        /<xdr:ext\s+cx="(\d+)"\s+cy="(\d+)"/i.exec(anchorXml) ||
        (xfrmMatch ? /<a:ext\s+cx="(\d+)"\s+cy="(\d+)"/i.exec(xfrmMatch[2]) : null);
    const styleXml: string = (/<xdr:style\b[^>]*>[\s\S]*?<\/xdr:style>/i.exec(anchorXml) || [''])[0];

    if (!fromMatch) {
        return null;
    }

    const fromCol0: number = Number.parseInt(fromMatch[1] != null ? fromMatch[1] : '0', 10);
    const colOffEmu: number = Number.parseInt(fromMatch[2] != null ? fromMatch[2] : '0', 10);
    const fromRow0: number = Number.parseInt(fromMatch[3] != null ? fromMatch[3] : '0', 10);
    const rowOffEmu: number = Number.parseInt(fromMatch[4] != null ? fromMatch[4] : '0', 10);
    const widthEmu: number = extMatch ? Number.parseInt(extMatch[1] != null ? extMatch[1] : '0', 10) : 0;
    const heightEmu: number = extMatch ? Number.parseInt(extMatch[2] != null ? extMatch[2] : '0', 10) : 0;

    // Parse cNvPr (name and id).
    const cNvPrMatch: RegExpExecArray = /<xdr:cNvPr\s+id="(\d+)"\s+name="([^"]*)"/i.exec(anchorXml);
    const cNvPrId: number = cNvPrMatch ? Number.parseInt(cNvPrMatch[1] != null ? cNvPrMatch[1] : '2', 10) : 2;
    const name: string = cNvPrMatch ? unescapeXml(cNvPrMatch[2] != null ? cNvPrMatch[2] : '') : `Shape ${cNvPrId}`;

    // Parse text content (all paragraphs and runs) and run formatting.
    const txBodyMatch: RegExpExecArray = /<xdr:txBody\b[^>]*>([\s\S]*?)<\/xdr:txBody>/i.exec(anchorXml);
    const txBodyXml: string = txBodyMatch ? txBodyMatch[1] : '';
    const parsedText: { runs: ShapeTextRun[]; hAlign: 'left' | 'center' | 'right' | 'justify' } = parseTextBody(txBodyXml, themeColors);
    const runs: ShapeTextRun[] = parsedText.runs;
    const text: string = runs.map((r: ShapeTextRun): string => r.text).join('');
    const bodyPrMatch: RegExpExecArray = /<a:bodyPr\b([^>]*)/i.exec(txBodyXml);
    const anchorAttr: string = bodyPrMatch ? parseAttrMap(bodyPrMatch[1]).get('anchor') : undefined;
    const vAlign: 'top' | 'middle' | 'bottom' = anchorAttr === 'ctr' ? 'middle' : anchorAttr === 'b' ? 'bottom' : 'top';
    const firstFont: ShapeTextRun['font'] | undefined = runs.length > 0 ? runs[0].font : undefined;
    let fontColor: string | undefined = firstFont ? firstFont.color : undefined;
    if (fontColor === undefined && firstFont !== undefined) {
        const fontRef: RegExpExecArray = /<a:fontRef\b[^>]*>([\s\S]*?)<\/a:fontRef>/i.exec(styleXml);
        const refColor: ParsedColor | undefined = fontRef ? parseColor(fontRef[1], themeColors) : undefined;
        fontColor = refColor ? refColor.hex : undefined;
    }

    // Parse rotation (in 1/60000 degree units) from <a:xfrm rot="">.
    const rotRaw: number = Number.parseInt(xfrmAttrs.get('rot') || '0', 10);
    const rotation: number = (Number.isFinite(rotRaw) ? rotRaw : 0) / 60000;

    // Parse fill from spPr, falling back to the shape style's fillRef.
    const spPrNoLn: string = spPrXml.replace(/<a:ln\b[^>]*\/>/gi, '').replace(/<a:ln\b[^>]*>[\s\S]*?<\/a:ln>/gi, '');
    const fill: ShapeFill = parseFill(spPrNoLn, styleXml, themeColors);

    // Parse line from spPr, falling back to the shape style's lnRef.
    const line: ShapeLineFormat = parseLine(spPrXml, styleXml, themeColors);

    // Parse alt text.
    const cNvPrTag: RegExpExecArray = /<xdr:cNvPr\b([^>]*)>/i.exec(anchorXml);
    const descr: string = cNvPrTag ? parseAttrMap(cNvPrTag[1]).get('descr') : undefined;
    const altText: string = descr ? unescapeXml(descr) : undefined;

    const entry: AutoShapeEntry = {
        cNvPrId,
        name,
        type: prst,
        fromRow0,
        fromCol0,
        rowOffEmu,
        colOffEmu,
        widthEmu,
        heightEmu,
        anchorKind,
        rotation,
        text,
        runs: runs.length > 0 ? runs : undefined,
        textHorizontalAlignment: parsedText.hAlign,
        textVerticalAlignment: vAlign,
        fontName: firstFont ? firstFont.name : undefined,
        fontSizePt: firstFont ? firstFont.size : undefined,
        fontBold: firstFont ? firstFont.bold : false,
        fontItalic: firstFont ? firstFont.italic : false,
        fontColor,
        fill,
        line,
        altText,
        isVisible: true,
        isMoveWithCell: true,
        isSizeWithCell: false
    };

    return entry;
}

/**
 * Serialize drawing XML from shape entries + foreign anchors.
 *
 * @param {Object} entries - The entries parameter.
 * @param {string} foreignAnchorsXml - The foreignAnchorsXml parameter.
 * @returns {string} - Returns the result.
 */
function serializeDrawingXml(entries: ReadonlyArray<AutoShapeEntry>, foreignAnchorsXml: ReadonlyArray<string>): string {
    const parts: string[] = [];

    // Root element MUST carry the xdr: prefix — <wsDr> without a prefix puts it in
    // no namespace and Excel drops the entire drawing part ("Removed Part: Drawing shape").
    parts.push('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' + `<xdr:wsDr xmlns:xdr="${XDR_NS}" xmlns:a="${A_NS}">`);

    for (const entry of entries) {
        parts.push(serializeShapeAnchor(entry));
    }

    for (const xml of foreignAnchorsXml) {
        parts.push(xml);
    }

    parts.push('</xdr:wsDr>');

    return parts.join('');
}

/**
 * Serialize a single shape anchor to XML.
 *
 * @param {AutoShapeEntry} entry - The entry parameter.
 * @returns {string} - Returns the result.
 */
function serializeShapeAnchor(entry: AutoShapeEntry): string {
    const parts: string[] = [];

    // FORCE: Always emit twoCellAnchor for all shapes (Excel compatibility)
    parts.push('<xdr:twoCellAnchor>');

    // <xdr:from>
    parts.push(
        '<xdr:from>' +
            `<xdr:col>${entry.fromCol0}</xdr:col>` +
            `<xdr:colOff>${entry.colOffEmu}</xdr:colOff>` +
            `<xdr:row>${entry.fromRow0}</xdr:row>` +
            `<xdr:rowOff>${entry.rowOffEmu}</xdr:rowOff>` +
            '</xdr:from>'
    );

    // <xdr:to> (always present)
    parts.push(
        '<xdr:to>' +
            `<xdr:col>${entry.toCol0 != null ? entry.toCol0 : entry.fromCol0 + 3}</xdr:col>` +
            `<xdr:colOff>${entry.toColOffEmu != null ? entry.toColOffEmu : 38100}</xdr:colOff>` +
            `<xdr:row>${entry.toRow0 != null ? entry.toRow0 : entry.fromRow0 + 12}</xdr:row>` +
            `<xdr:rowOff>${entry.toRowOffEmu != null ? entry.toRowOffEmu : 126100}</xdr:rowOff>` +
            '</xdr:to>'
    );

    // Serialize shape.
    const spId: number = entry.cNvPrId;
    const rotDegrees: number = entry.rotation * 60000; // Convert to 1/60000 degree units.

    // macro="" and textlink="" are always emitted on <xdr:sp> to match Excel output.
    parts.push('<xdr:sp macro="" textlink="">');

    // Non-visual properties wrapper.
    // cNvSpPr must be empty for preset-geometry shapes — txBox or spLocks with
    // connector-only attributes cause Excel to discard the drawing part.
    parts.push(
        '<xdr:nvSpPr>' +
            `<xdr:cNvPr id="${spId}" name="${escapeXml(entry.name)}"${entry.altText ? ` descr="${escapeXml(entry.altText)}"` : ''}/>` +
            '<xdr:cNvSpPr/>' +
            '</xdr:nvSpPr>'
    );

    // Shape properties
    const rotAttr: string = Math.round(rotDegrees) !== 0 ? ` rot="${Math.round(rotDegrees)}"` : '';
    parts.push(
        '<xdr:spPr>' +
            `<a:xfrm${rotAttr}>` +
            '<a:off x="0" y="0"/>' +
            `<a:ext cx="${entry.widthEmu}" cy="${entry.heightEmu}"/>` +
            '</a:xfrm>' +
            `<a:prstGeom prst="${entry.type}">` +
            '<a:avLst />' +
            '</a:prstGeom>'
    );

    // Fill.
    if (entry.fill) {
        if (entry.fill.type === ShapeFillType.Solid && entry.fill.foreColor) {
            parts.push('<a:solidFill>' + `<a:srgbClr val="${entry.fill.foreColor}" />` + '</a:solidFill>');
        } else {
            parts.push('<a:solidFill><a:srgbClr val="FFFFFF" /></a:solidFill>');
        }
    }

    // Line.
    if (entry.line && entry.line.color) {
        const lineWidthEmu: number = entry.line.weight * 12700;
        parts.push(
            `<a:ln w="${lineWidthEmu}">` + '<a:solidFill>' + `<a:srgbClr val="${entry.line.color}" />` + '</a:solidFill>' + '</a:ln>'
        );
    }

    parts.push('</xdr:spPr>');

    // Shape style belongs inside xdr:sp, after xdr:spPr and before xdr:txBody.
    parts.push(
        '<xdr:style>' +
            '<a:lnRef idx="2"><a:schemeClr val="accent1"><a:shade val="15000"/></a:schemeClr></a:lnRef>' +
            '<a:fillRef idx="1"><a:schemeClr val="accent1"/></a:fillRef>' +
            '<a:effectRef idx="0"><a:schemeClr val="accent1"/></a:effectRef>' +
            '<a:fontRef idx="minor"><a:schemeClr val="lt1"/></a:fontRef>' +
            '</xdr:style>'
    );

    // Text body.
    if (entry.text) {
        const vAnchor: 't' | 'ctr' | 'b' =
            entry.textVerticalAlignment === 'top' ? 't' : entry.textVerticalAlignment === 'middle' ? 'ctr' : 'b';
        const hAlign: 'r' | 'ctr' | 'l' | 'just' =
            entry.textHorizontalAlignment === 'left'
                ? 'l'
                : entry.textHorizontalAlignment === 'center'
                    ? 'ctr'
                    : entry.textHorizontalAlignment === 'right'
                        ? 'r'
                        : 'just';
        if (entry.runs !== undefined && entry.runs.map((r: ShapeTextRun): string => r.text).join('') === entry.text) {
            parts.push(
                '<xdr:txBody>' +
                    `<a:bodyPr vertOverflow="clip" horzOverflow="clip" rtlCol="0" anchor="${vAnchor}"/>` +
                    '<a:lstStyle/>' +
                    serializeRunsAsParagraphs(entry.runs, hAlign) +
                    '</xdr:txBody>'
            );
        } else {
        // Always emit sz="1100" for 11pt font (Excel default)
        // eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
        const szAttr: ' sz="1100"' = ' sz="1100"';
        const boldAttr: '' | ' b="1"' = entry.fontBold ? ' b="1"' : '';
        const italicAttr: '' | ' i="1"' = entry.fontItalic ? ' i="1"' : '';
        parts.push(
            '<xdr:txBody>' +
                `<a:bodyPr vertOverflow="clip" horzOverflow="clip" rtlCol="0" anchor="${vAnchor}"/>` +
                '<a:lstStyle/>' +
                '<a:p>' +
                `<a:pPr algn="${hAlign}"/>` +
                '<a:r>' +
                `<a:rPr lang="en-US"${szAttr}${boldAttr}${italicAttr}/>` +
                `<a:t>${escapeXmlText(entry.text)}</a:t>` +
                '</a:r>' +
                '</a:p>' +
                '</xdr:txBody>'
        );
        }
    }

    parts.push('</xdr:sp>');

    // Client data (required by OOXML spec)
    parts.push('<xdr:clientData/>');

    parts.push('</xdr:twoCellAnchor>');

    return parts.join('');
}
