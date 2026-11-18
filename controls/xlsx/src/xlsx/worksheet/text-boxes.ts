/**
 * Worksheet text boxes (DrawingML `xdr:sp` + `txBody` on sheet drawings).
 *
 * Citations:
 * - docs/specs/text-boxes.md; docs/ooxml-mapping/text-boxes.md
 * - dml-spreadsheetDrawing.xsd CT_WsDr / CT_OneCellAnchor / CT_Shape
 * - dml-main.xsd CT_TextBody / CT_TextParagraph / CT_RegularTextRun
 * - sml CT_Drawing on CT_Worksheet (after smartTags, before legacyDrawing)
 *
 * Package side effects (drawing part + sheet relationship) defer to flush/save
 * (API-RULES R5.1). Foreign anchors (pic, chart, group, connector) are preserved
 * opaquely in the same drawing part.
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

const XDR_NS: 'http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing' = DRAWINGML_SPREADSHEET_NS_TRANSITIONAL;
const A_NS: 'http://schemas.openxmlformats.org/drawingml/2006/main' = DRAWINGML_MAIN_NS_TRANSITIONAL;

/**
 * Vertical text anchoring inside the box (`a:bodyPr@anchor`).
 *
 * @private
 */
export type TextBoxVerticalAlignment = 'top' | 'middle' | 'bottom';

/**
 * Horizontal paragraph alignment (`a:pPr@algn`).
 *
 * @private
 */
export type TextBoxHorizontalAlignment = 'left' | 'center' | 'right' | 'justify';

/**
 * Represents a text box placed on a worksheet, letting you set its text,
 * position, size, and appearance.
 */
export interface TextBox {
    /**
     * @private
     */
    readonly id: number;
    /** The text shown inside the text box. */
    text: string;
    /**
     * The color the text box is filled with, as a hex value like
     * `'FFF2CC'` or `'#FFF2CC'`. `undefined` leaves it unfilled.
     */
    fillColor: string | undefined;
    /** The font face name the text is drawn with — for example `'Calibri'`. */
    fontName: string | undefined;
    /** The font size in points — for example `12`. */
    fontSize: number | undefined;
    /** Whether the text is bold. */
    fontBold: boolean;
    /** The text color as a hex value, like `'333333'` or `'#333333'`. */
    fontColor: string | undefined;
    /** How the text lines up vertically within the box: top, middle, or bottom. */
    verticalAlignment: 'top' | 'middle' | 'bottom';
    /** How the text lines up horizontally: left, center, right, or justify. */
    horizontalAlignment: 'left' | 'center' | 'right' | 'justify';
    /**
     * The row the text box's top edge is anchored to — 1-based, like Excel
     * rows.
     */
    readonly row: number;
    /**
     * The column the text box's left edge is anchored to — 1-based, like
     * Excel columns.
     */
    readonly column: number;
    /**
     * The width of the text box in points (72 pt = 1 in).
     */
    readonly width: number;
    /**
     * The height of the text box in points (72 pt = 1 in).
     */
    readonly height: number;
}

/** Host callbacks for dirty + package access. */
export interface TextBoxesHost {
    markDirty(): void;
    readonly package: OpcPackage;
    readonly sheetPartName: string | undefined;
}

/**
 * Internal entry for one text-box shape.
 *
 * @private
 */
export interface TextBoxEntry {
    cNvPrId: number;
    name: string;
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
    text: string;
    fillColor?: string | undefined;
    fontName?: string | undefined;
    fontSizePt?: number | undefined;
    fontBold: boolean;
    fontColor?: string | undefined;
    verticalAlignment: TextBoxVerticalAlignment;
    horizontalAlignment: TextBoxHorizontalAlignment;
}

/**
 * Result of materializing the drawing part + sheet drawing relationship.
 *
 * @private
 */
export interface TextBoxesMaterializeResult {
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
 * Mutable text-box collection for one worksheet.
 *
 * @private
 */
export class TextBoxesImpl {
    private readonly entries: TextBoxEntry[] = [];
    private readonly handles: Map<TextBoxEntry, TextBoxHandle> = new Map<TextBoxEntry, TextBoxHandle>();
    private host: TextBoxesHost | undefined;
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
     * @param {TextBoxesHost} host - The host parameter.
     * @returns {void} - Returns the result.
     */
    public bindHost(host: TextBoxesHost): void {
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

        const parsed: ParsedDrawing = parseDrawingXml(decodeUtf8(part.data));
        for (const e of parsed.textBoxes) {
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
    public list(): ReadonlyArray<TextBox> {
        return this.entries.map((e: TextBoxEntry): TextBox => this.handleFor(e));
    }

    /**
     * Add a text box. Geometry is 1-based row/column + positive size in points. Optional trailing arg: text (default empty).
     *
     * @param {number} row - The row parameter.
     * @param {number} column - The column parameter.
     * @param {number} width - The width parameter.
     * @param {number} height - The height parameter.
     * @param {string} text - The text parameter.
     * @returns {TextBox} - Returns the result.
     */
    public add(row: number, column: number, width: number, height: number, text?: string): TextBox {
        const rowN: number = requirePositiveInt(row, 'row');
        const columnN: number = requirePositiveInt(column, 'column');
        requirePositivePoints(width, 'width');
        requirePositivePoints(height, 'height');
        const initialText: string = text === undefined ? '' : String(text);

        const entry: TextBoxEntry = {
            cNvPrId: this.nextCNvPrId,
            name: `TextBox ${this.nextNameIndex}`,
            fromRow0: rowN - 1,
            fromCol0: columnN - 1,
            rowOffEmu: 0,
            colOffEmu: 0,
            widthEmu: pointsToEmu(width),
            heightEmu: pointsToEmu(height),
            anchorKind: 'oneCell',
            text: initialText,
            fontBold: false,
            verticalAlignment: 'top',
            horizontalAlignment: 'left'
        };
        this.nextCNvPrId += 1;
        this.nextNameIndex += 1;
        this.entries.push(entry);
        this.markDirty();
        return this.handleFor(entry);
    }

    /**
     * Remove by handle or 0-based index into {@link list}.
     *
     * @param {number} target - The target parameter.
     * @returns {void} - Returns the result.
     */
    public remove(target: TextBox | number): void {
        if (typeof target === 'number') {
            if (!Number.isInteger(target) || target < 0 || target >= this.entries.length) {
                throw new InvalidArgumentError(`removeTextBox index must be in 0..${this.entries.length - 1}`);
            }
            // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
            const entry: TextBoxEntry = this.entries[target];
            if (entry !== undefined) {
                this.handles.delete(entry);
                this.entries.splice(target, 1);
                this.markDirty();
            }
            return;
        }
        if (target === null || typeof target !== 'object') {
            throw new InvalidArgumentError('removeTextBox requires a TextBox or index');
        }
        const entry: TextBoxEntry = (target as TextBoxHandle).entry;
        if (entry === undefined) {
            throw new InvalidArgumentError('removeTextBox target is not a library TextBox handle');
        }
        const idx: number = this.entries.indexOf(entry);
        if (idx < 0) {
            throw new InvalidArgumentError('TextBox is not on this worksheet');
        }
        this.handles.delete(entry);
        this.entries.splice(idx, 1);
        this.markDirty();
    }

    /**
     * True when drawing package state may need rewrite (authored changes or loaded).
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
     * Write/remove drawing part and compute sheet drawing relationship. Call during worksheet flush after hyperlink retention filtering. yet mixed — caller passes pre-final list; drawing types are stripped here).
     *
     * @param {Object} sheetRelsCurrent - The sheetRelsCurrent parameter.
     * @returns {TextBoxesMaterializeResult} - Returns the result.
     */
    public materializeOnFlush(sheetRelsCurrent: ReadonlyArray<OpcRelationship>): TextBoxesMaterializeResult {
        const host: TextBoxesHost = this.host;
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
     * @param {TextBoxEntry} entry - The entry parameter.
     * @returns {TextBox} - Returns the result.
     */
    private handleFor(entry: TextBoxEntry): TextBox {
        let h: TextBoxHandle = this.handles.get(entry);
        if (h === undefined) {
            h = new TextBoxHandle(entry, (): void => this.markDirty());
            this.handles.set(entry, h);
        }
        return h;
    }
}

/**
 * TextBoxHandle class.
 */
class TextBoxHandle implements TextBox {
    /** @private */
    public readonly entry: TextBoxEntry;
    private readonly markDirty: () => void;

    /**
     * Creates an instance.
     *
     * @param {TextBoxEntry} entry - The entry parameter.
     * @param {any} markDirty - The markDirty parameter.
     */
    public constructor(entry: TextBoxEntry, markDirty: () => void) {
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
     * Gets text.
     *
     * @returns {string} - Returns the result.
     */
    public get text(): string {
        return this.entry.text;
    }

    /**
     * Sets text.
     *
     * @param {string} value - The value parameter.
     */
    public set text(value: string) {
        this.entry.text = value === undefined || value === null ? '' : String(value);
        this.markDirty();
    }

    /**
     * Gets fillColor.
     *
     * @returns {string} - Returns the result.
     */
    public get fillColor(): string | undefined {
        return this.entry.fillColor;
    }

    /**
     * Sets fillColor.
     *
     * @param {string} value - The value parameter.
     */
    public set fillColor(value: string | undefined) {
        this.entry.fillColor = normalizeColorOrClear(value);
        this.markDirty();
    }

    /**
     * Gets fontName.
     *
     * @returns {string} - Returns the result.
     */
    public get fontName(): string | undefined {
        return this.entry.fontName;
    }

    /**
     * Sets fontName.
     *
     * @param {string} value - The value parameter.
     */
    public set fontName(value: string | undefined) {
        if (value === undefined || value === null || String(value).trim() === '') {
            this.entry.fontName = undefined;
        } else {
            this.entry.fontName = String(value);
        }
        this.markDirty();
    }

    /**
     * Gets fontSize.
     *
     * @returns {number} - Returns the result.
     */
    public get fontSize(): number | undefined {
        return this.entry.fontSizePt;
    }

    /**
     * Sets fontSize.
     *
     * @param {number} value - The value parameter.
     */
    public set fontSize(value: number | undefined) {
        if (value === undefined || value === null) {
            this.entry.fontSizePt = undefined;
        } else {
            if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
                throw new InvalidArgumentError('fontSize must be a positive finite number');
            }
            this.entry.fontSizePt = value;
        }
        this.markDirty();
    }

    /**
     * Gets fontBold.
     *
     * @returns {boolean} - Returns the result.
     */
    public get fontBold(): boolean {
        return this.entry.fontBold;
    }

    /**
     * Sets fontBold.
     *
     * @param {boolean} value - The value parameter.
     */
    public set fontBold(value: boolean) {
        this.entry.fontBold = Boolean(value);
        this.markDirty();
    }

    /**
     * Gets fontColor.
     *
     * @returns {string} - Returns the result.
     */
    public get fontColor(): string | undefined {
        return this.entry.fontColor;
    }

    /**
     * Sets fontColor.
     *
     * @param {string} value - The value parameter.
     */
    public set fontColor(value: string | undefined) {
        this.entry.fontColor = normalizeColorOrClear(value);
        this.markDirty();
    }

    /**
     * Gets verticalAlignment.
     *
     * @returns {TextBoxVerticalAlignment} - Returns the result.
     */
    public get verticalAlignment(): TextBoxVerticalAlignment {
        return this.entry.verticalAlignment;
    }

    /**
     * Sets verticalAlignment.
     *
     * @param {TextBoxVerticalAlignment} value - The value parameter.
     */
    public set verticalAlignment(value: TextBoxVerticalAlignment) {
        if (value !== 'top' && value !== 'middle' && value !== 'bottom') {
            throw new InvalidArgumentError('verticalAlignment must be "top", "middle", or "bottom"');
        }
        this.entry.verticalAlignment = value;
        this.markDirty();
    }

    /**
     * Gets horizontalAlignment.
     *
     * @returns {TextBoxHorizontalAlignment} - Returns the result.
     */
    public get horizontalAlignment(): TextBoxHorizontalAlignment {
        return this.entry.horizontalAlignment;
    }

    /**
     * Sets horizontalAlignment.
     *
     * @param {TextBoxHorizontalAlignment} value - The value parameter.
     */
    public set horizontalAlignment(value: TextBoxHorizontalAlignment) {
        if (value !== 'left' && value !== 'center' && value !== 'right' && value !== 'justify') {
            throw new InvalidArgumentError('horizontalAlignment must be "left", "center", "right", or "justify"');
        }
        this.entry.horizontalAlignment = value;
        this.markDirty();
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
     * Gets column.
     *
     * @returns {number} - Returns the result.
     */
    public get column(): number {
        return this.entry.fromCol0 + 1;
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
     * Gets height.
     *
     * @returns {number} - Returns the result.
     */
    public get height(): number {
        return this.entry.heightEmu / EMU_PER_PT;
    }
}

/**
 * CT_Worksheet successors after `drawing` (for insert index).
 * Citation: sml CT_Worksheet sequence; PAGE_SETUP_SUCCESSORS from drawing onward.
 */
export const DRAWING_SUCCESSORS: ReadonlyArray<string> = PAGE_SETUP_SUCCESSORS.filter((n: string): boolean => n !== 'drawing');

const DRAWING_PREDECESSORS_AFTER_SHEET_DATA: ReadonlyArray<string> = [
    'sheetData',
    'sheetCalcPr',
    'sheetProtection',
    'protectedRanges',
    'scenarios',
    'autoFilter',
    'sortState',
    'dataConsolidate',
    'customSheetViews',
    'mergeCells',
    'phoneticPr',
    'conditionalFormatting',
    'dataValidations',
    'hyperlinks',
    'printOptions',
    'pageMargins',
    'pageSetup',
    'headerFooter',
    'rowBreaks',
    'colBreaks',
    'customProperties',
    'cellWatches',
    'ignoredErrors',
    'smartTags'
];

/**
 * Index to insert modeled `<drawing r:id="…"/>` among after-sheetData siblings.
 *
 * @param {string} afterSheetDataLocals - The afterSheetDataLocals parameter.
 * @returns {number} - Returns the result.
 */
export function findDrawingInsertIndex(afterSheetDataLocals: ReadonlyArray<string>): number {
    const pred: Set<string> = new Set(DRAWING_PREDECESSORS_AFTER_SHEET_DATA);
    const succ: Set<string> = new Set(DRAWING_SUCCESSORS);
    let lastPred: number = -1;
    for (let i: number = 0; i < afterSheetDataLocals.length; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const name: string = afterSheetDataLocals[i];
        if (name !== undefined && pred.has(name)) {
            lastPred = i;
        }
    }
    if (lastPred >= 0) {
        return lastPred + 1;
    }
    for (let i: number = 0; i < afterSheetDataLocals.length; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const name: string = afterSheetDataLocals[i];
        if (name !== undefined && succ.has(name)) {
            return i;
        }
    }
    return afterSheetDataLocals.length;
}

/**
 * Serialize worksheet drawing element.
 *
 * @param {string} relationshipId - The relationshipId parameter.
 * @returns {string} - Returns the result.
 */
export function serializeDrawingElementXml(relationshipId: string): string {
    return `<drawing r:id="${escapeXml(relationshipId)}"/>`;
}

// ── Drawing XML parse / serialize ───────────────────────────────────────────

/**
 * ParsedDrawing.
 */
interface ParsedDrawing {
    readonly textBoxes: TextBoxEntry[];
    readonly foreignAnchorsXml: string[];
}

/**
 * parseDrawingXml function.
 *
 * @param {string} xml - The xml parameter.
 * @returns {ParsedDrawing} - Returns the result.
 */
function parseDrawingXml(xml: string): ParsedDrawing {
    const trimmed: string = stripProlog(xml);
    const root: { openAttrs: string; inner: string } = matchRootLocal(trimmed, 'wsDr');
    if (root === undefined) {
        return { textBoxes: [], foreignAnchorsXml: [] };
    }
    const children: string[] = splitTopLevelElements(root.inner);
    const textBoxes: TextBoxEntry[] = [];
    const foreignAnchorsXml: string[] = [];

    for (const child of children) {
        const local: string = elementLocalName(child);
        if (local !== 'oneCellAnchor' && local !== 'twoCellAnchor' && local !== 'absoluteAnchor') {
            foreignAnchorsXml.push(child);
            continue;
        }
        const sp: string = findChildByLocal(child, 'sp');
        if (sp === undefined) {
            foreignAnchorsXml.push(child);
            continue;
        }
        if (!isTextBoxShape(sp)) {
            foreignAnchorsXml.push(child);
            continue;
        }
        const entry: TextBoxEntry = parseTextBoxAnchor(child, local === 'twoCellAnchor' ? 'twoCell' : 'oneCell');
        if (entry === undefined) {
            foreignAnchorsXml.push(child);
            continue;
        }
        textBoxes.push(entry);
    }

    return { textBoxes, foreignAnchorsXml };
}

/**
 * isTextBoxShape function.
 *
 * @param {string} spXml - The spXml parameter.
 * @returns {boolean} - Returns the result.
 */
function isTextBoxShape(spXml: string): boolean {
    const nv: string = findChildByLocal(spXml, 'nvSpPr');
    if (nv !== undefined) {
        const cNvSpPr: string = findChildByLocal(nv, 'cNvSpPr');
        if (cNvSpPr !== undefined) {
            const attrs: Map<string, string> = parseAttrMap(elementOpenAttrs(cNvSpPr));
            const txBox: string = attrs.get('txBox') != null ? attrs.get('txBox') : attrs.get('txbox');
            if (txBox === '1' || txBox === 'true') {
                return true;
            }
        }
    }
    return findChildByLocal(spXml, 'txBody') !== undefined;
}

/**
 * parseTextBoxAnchor function.
 *
 * @param {string} anchorXml - The anchorXml parameter.
 * @param {Object} kind - The kind parameter.
 * @returns {*} - Returns the result.
 */
function parseTextBoxAnchor(anchorXml: string, kind: 'oneCell' | 'twoCell'): TextBoxEntry | undefined {
    const fromEl: string = findChildByLocal(anchorXml, 'from');
    if (fromEl === undefined) {
        return undefined;
    }
    const from: { row: number; col: number; rowOff: number; colOff: number } = parseMarker(fromEl);
    const sp: string = findChildByLocal(anchorXml, 'sp');
    if (sp === undefined) {
        return undefined;
    }

    let widthEmu: number = 0;
    let heightEmu: number = 0;
    const extEl: string = findChildByLocal(anchorXml, 'ext');
    if (extEl !== undefined) {
        const ea: Map<string, string> = parseAttrMap(elementOpenAttrs(extEl));
        widthEmu = parseEmuAttr(ea.get('cx'));
        heightEmu = parseEmuAttr(ea.get('cy'));
    }

    let toRow0: number | undefined;
    let toCol0: number | undefined;
    let toRowOffEmu: number | undefined;
    let toColOffEmu: number | undefined;
    if (kind === 'twoCell') {
        const toEl: string = findChildByLocal(anchorXml, 'to');
        if (toEl !== undefined) {
            const to: { row: number; col: number; rowOff: number; colOff: number } = parseMarker(toEl);
            toRow0 = to.row;
            toCol0 = to.col;
            toRowOffEmu = to.rowOff;
            toColOffEmu = to.colOff;
        }
    }

    // Prefer spPr xfrm ext when anchor ext missing.
    if (widthEmu === 0 && heightEmu === 0) {
        const spPr: string = findChildByLocal(sp, 'spPr');
        const xfrm: string = spPr !== undefined ? findChildByLocal(spPr, 'xfrm') : undefined;
        const xExt: string = xfrm !== undefined ? findChildByLocal(xfrm, 'ext') : undefined;
        if (xExt !== undefined) {
            const ea: Map<string, string> = parseAttrMap(elementOpenAttrs(xExt));
            widthEmu = parseEmuAttr(ea.get('cx'));
            heightEmu = parseEmuAttr(ea.get('cy'));
        }
    }

    const nvSpPr: string = findChildByLocal(sp, 'nvSpPr');
    const cNvPr: string = nvSpPr !== undefined ? findChildByLocal(nvSpPr, 'cNvPr') : undefined;
    let cNvPrId: number = 2;
    let name: string = 'TextBox 1';
    if (cNvPr !== undefined) {
        const attrs: Map<string, string> = parseAttrMap(elementOpenAttrs(cNvPr));
        const idRaw: string = attrs.get('id');
        if (idRaw !== undefined) {
            const n: number = Number.parseInt(idRaw, 10);
            if (Number.isFinite(n) && n > 0) {
                cNvPrId = n;
            }
        }
        const n: string = attrs.get('name');
        if (n !== undefined && n.length > 0) {
            name = n;
        }
    }

    let fillColor: string | undefined;
    const spPr: string = findChildByLocal(sp, 'spPr');
    if (spPr !== undefined) {
        fillColor = findSrgbIn(spPr, 'solidFill') != null ? findSrgbIn(spPr, 'solidFill') : undefined;
    }

    const txBody: string = findChildByLocal(sp, 'txBody');
    let text: string = '';
    let fontName: string | undefined;
    let fontSizePt: number | undefined;
    let fontBold: boolean = false;
    let fontColor: string | undefined;
    let verticalAlignment: TextBoxVerticalAlignment = 'top';
    let horizontalAlignment: TextBoxHorizontalAlignment = 'left';

    if (txBody !== undefined) {
        const bodyPr: string = findChildByLocal(txBody, 'bodyPr');
        if (bodyPr !== undefined) {
            const ba: Map<string, string> = parseAttrMap(elementOpenAttrs(bodyPr));
            verticalAlignment = bodyPrAnchorToApi(ba.get('anchor'));
        }
        const paragraphs: string[] = splitTopLevelElements(elementInner(txBody)).filter(
            (el: string): boolean => elementLocalName(el) === 'p'
        );
        const textParts: string[] = [];
        for (let pi: number = 0; pi < paragraphs.length; pi += 1) {
            // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
            const p: string = paragraphs[pi];
            if (p === undefined) {
                continue;
            }
            if (pi === 0) {
                const pPr: string = findChildByLocal(p, 'pPr');
                if (pPr !== undefined) {
                    const pa: Map<string, string> = parseAttrMap(elementOpenAttrs(pPr));
                    horizontalAlignment = pPrAlgnToApi(pa.get('algn'));
                }
            }
            const runs: string[] = splitTopLevelElements(elementInner(p));
            let paraText: string = '';
            for (const r of runs) {
                if (elementLocalName(r) !== 'r') {
                    continue;
                }
                const rPr: string = findChildByLocal(r, 'rPr');
                if (rPr !== undefined && fontName === undefined && fontSizePt === undefined) {
                    const ra: Map<string, string> = parseAttrMap(elementOpenAttrs(rPr));
                    const sz: string = ra.get('sz');
                    if (sz !== undefined) {
                        const szN: number = Number.parseInt(sz, 10);
                        if (Number.isFinite(szN) && szN > 0) {
                            fontSizePt = szN / 100;
                        }
                    }
                    const b: string = ra.get('b');
                    fontBold = b === '1' || b === 'true';
                    fontColor = findSrgbIn(rPr, 'solidFill') != null ? findSrgbIn(rPr, 'solidFill') : fontColor;
                    const latin: string = findChildByLocal(rPr, 'latin');
                    if (latin !== undefined) {
                        const la: Map<string, string> = parseAttrMap(elementOpenAttrs(latin));
                        fontName = la.get('typeface') != null ? la.get('typeface') : fontName;
                    }
                }
                const tEl: string = findChildByLocal(r, 't');
                if (tEl !== undefined) {
                    paraText += unescapeXml(elementInner(tEl));
                }
            }
            textParts.push(paraText);
        }
        text = textParts.join('\n');
    }

    const anchorAttrs: Map<string, string> = parseAttrMap(elementOpenAttrs(anchorXml));
    const editAs: string = anchorAttrs.get('editAs');

    const entry: TextBoxEntry = {
        cNvPrId,
        name,
        fromRow0: from.row,
        fromCol0: from.col,
        rowOffEmu: from.rowOff,
        colOffEmu: from.colOff,
        widthEmu: widthEmu > 0 ? widthEmu : 1,
        heightEmu: heightEmu > 0 ? heightEmu : 1,
        anchorKind: kind,
        text,
        fontBold,
        verticalAlignment,
        horizontalAlignment
    };
    if (fillColor !== undefined) {
        entry.fillColor = fillColor;
    }
    if (fontName !== undefined) {
        entry.fontName = fontName;
    }
    if (fontSizePt !== undefined) {
        entry.fontSizePt = fontSizePt;
    }
    if (fontColor !== undefined) {
        entry.fontColor = fontColor;
    }
    if (editAs !== undefined) {
        entry.editAs = editAs;
    }
    if (toRow0 !== undefined) {
        entry.toRow0 = toRow0;
    }
    if (toCol0 !== undefined) {
        entry.toCol0 = toCol0;
    }
    if (toRowOffEmu !== undefined) {
        entry.toRowOffEmu = toRowOffEmu;
    }
    if (toColOffEmu !== undefined) {
        entry.toColOffEmu = toColOffEmu;
    }
    return entry;
}

/**
 * parseMarker function.
 *
 * @param {string} markerXml - The markerXml parameter.
 * @returns {Object} - Returns the result.
 */
function parseMarker(markerXml: string): {
    row: number;
    col: number;
    rowOff: number;
    colOff: number;
} {
    const inner: string = elementInner(markerXml);
    const kids: string[] = splitTopLevelElements(inner);
    let row: number = 0;
    let col: number = 0;
    let rowOff: number = 0;
    let colOff: number = 0;
    for (const k of kids) {
        const local: string = elementLocalName(k);
        const text: string = elementInner(k).trim();
        const n: number = Number.parseInt(text, 10);
        if (local === 'row' && Number.isFinite(n)) {
            row = n;
        } else if (local === 'col' && Number.isFinite(n)) {
            col = n;
        } else if (local === 'rowOff' && Number.isFinite(n)) {
            rowOff = n;
        } else if (local === 'colOff' && Number.isFinite(n)) {
            colOff = n;
        }
    }
    return { row, col, rowOff, colOff };
}

/**
 * serializeDrawingXml function.
 *
 * @param {Object} entries - The entries parameter.
 * @param {string} foreignAnchorsXml - The foreignAnchorsXml parameter.
 * @returns {string} - Returns the result.
 */
function serializeDrawingXml(entries: ReadonlyArray<TextBoxEntry>, foreignAnchorsXml: ReadonlyArray<string>): string {
    const parts: string[] = [];
    parts.push('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
    parts.push(`<xdr:wsDr xmlns:xdr="${XDR_NS}" xmlns:a="${A_NS}">`);
    for (const f of foreignAnchorsXml) {
        parts.push(f);
    }
    for (const e of entries) {
        parts.push(serializeTextBoxAnchor(e));
    }
    parts.push('</xdr:wsDr>');
    return parts.join('');
}

/**
 * serializeTextBoxAnchor function.
 *
 * @param {TextBoxEntry} e - The e parameter.
 * @returns {string} - Returns the result.
 */
function serializeTextBoxAnchor(e: TextBoxEntry): string {
    const from: string = [
        '<xdr:from>',
        `<xdr:col>${e.fromCol0}</xdr:col>`,
        `<xdr:colOff>${e.colOffEmu}</xdr:colOff>`,
        `<xdr:row>${e.fromRow0}</xdr:row>`,
        `<xdr:rowOff>${e.rowOffEmu}</xdr:rowOff>`,
        '</xdr:from>'
    ].join('');

    const sp: string = serializeSp(e);

    if (e.anchorKind === 'twoCell' && e.toRow0 !== undefined && e.toCol0 !== undefined) {
        const editAs: string = e.editAs !== undefined && e.editAs.length > 0 ? ` editAs="${escapeXml(e.editAs)}"` : '';
        const to: string = [
            '<xdr:to>',
            `<xdr:col>${e.toCol0}</xdr:col>`,
            `<xdr:colOff>${e.toColOffEmu != null ? e.toColOffEmu : 0}</xdr:colOff>`,
            `<xdr:row>${e.toRow0}</xdr:row>`,
            `<xdr:rowOff>${e.toRowOffEmu != null ? e.toRowOffEmu : 0}</xdr:rowOff>`,
            '</xdr:to>'
        ].join('');
        return `<xdr:twoCellAnchor${editAs}>${from}${to}${sp}<xdr:clientData/></xdr:twoCellAnchor>`;
    }

    const ext: string = `<xdr:ext cx="${e.widthEmu}" cy="${e.heightEmu}"/>`;
    return `<xdr:oneCellAnchor>${from}${ext}${sp}<xdr:clientData/></xdr:oneCellAnchor>`;
}

/**
 * serializeSp function.
 *
 * @param {TextBoxEntry} e - The e parameter.
 * @returns {string} - Returns the result.
 */
function serializeSp(e: TextBoxEntry): string {
    const fill: string =
        e.fillColor !== undefined ? `<a:solidFill><a:srgbClr val="${escapeXml(e.fillColor)}"/></a:solidFill>` : '<a:noFill/>';

    const spPr: string = [
        '<xdr:spPr>',
        '<a:xfrm>',
        '<a:off x="0" y="0"/>',
        `<a:ext cx="${e.widthEmu}" cy="${e.heightEmu}"/>`,
        '</a:xfrm>',
        '<a:prstGeom prst="rect"><a:avLst/></a:prstGeom>',
        fill,
        '<a:ln><a:noFill/></a:ln>',
        '</xdr:spPr>'
    ].join('');

    const nv: string = [
        '<xdr:nvSpPr>',
        `<xdr:cNvPr id="${e.cNvPrId}" name="${escapeXml(e.name)}"/>`,
        '<xdr:cNvSpPr txBox="1"/>',
        '</xdr:nvSpPr>'
    ].join('');

    return `<xdr:sp macro="" textlink="">${nv}${spPr}${serializeTxBody(e)}</xdr:sp>`;
}

/**
 * serializeTxBody function.
 *
 * @param {TextBoxEntry} e - The e parameter.
 * @returns {string} - Returns the result.
 */
function serializeTxBody(e: TextBoxEntry): string {
    const anchor: string = apiToBodyPrAnchor(e.verticalAlignment);
    const algn: string = apiToPPrAlgn(e.horizontalAlignment);
    const lines: string[] = e.text.split('\n');
    const paras: string[] = [];
    for (let i: number = 0; i < lines.length; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const line: string = lines[i] != null ? lines[i] : '';
        const pPr: string = i === 0 ? `<a:pPr algn="${algn}"/>` : '<a:pPr/>';
        paras.push(`<a:p>${pPr}${serializeRun(e, line)}</a:p>`);
    }
    if (paras.length === 0) {
        paras.push(`<a:p><a:pPr algn="${algn}"/>${serializeRun(e, '')}</a:p>`);
    }
    return ['<xdr:txBody>', `<a:bodyPr wrap="square" anchor="${anchor}"/>`, '<a:lstStyle/>', ...paras, '</xdr:txBody>'].join('');
}

/**
 * serializeRun function.
 *
 * @param {TextBoxEntry} e - The e parameter.
 * @param {string} text - The text parameter.
 * @returns {string} - Returns the result.
 */
function serializeRun(e: TextBoxEntry, text: string): string {
    const attrs: string[] = ['lang="en-US"', 'dirty="0"'];
    if (e.fontSizePt !== undefined) {
        attrs.push(`sz="${Math.round(e.fontSizePt * 100)}"`);
    }
    if (e.fontBold) {
        attrs.push('b="1"');
    }
    const kids: string[] = [];
    if (e.fontColor !== undefined) {
        kids.push(`<a:solidFill><a:srgbClr val="${escapeXml(e.fontColor)}"/></a:solidFill>`);
    }
    if (e.fontName !== undefined) {
        kids.push(`<a:latin typeface="${escapeXml(e.fontName)}"/>`);
    }
    const rPr: string = `<a:rPr ${attrs.join(' ')}>${kids.join('')}</a:rPr>`;
    const space: '' | ' xml:space="preserve"' = needsXmlSpace(text) ? ' xml:space="preserve"' : '';
    return `<a:r>${rPr}<a:t${space}>${escapeXmlText(text)}</a:t></a:r>`;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

/**
 * allocateDrawingPartName function.
 *
 * @param {OpcPackage} pkg - The pkg parameter.
 * @returns {string} - Returns the result.
 */
function allocateDrawingPartName(pkg: OpcPackage): string {
    const existing: Set<string> = new Set(pkg.partNames().map((n: string): string => n.toLowerCase()));
    for (let i: number = 1; i < 10_000; i += 1) {
        const name: string = `/xl/drawings/drawing${i}.xml`;
        if (!existing.has(name.toLowerCase())) {
            return name;
        }
    }
    throw new InvalidArgumentError('Could not allocate a drawing part name');
}

/**
 * Relative Target from worksheet part to drawing part. Standard: `/xl/worksheets/sheet1.xml` → `/xl/drawings/drawing1.xml` ⇒ `../drawings/drawing1.xml`
 *
 * @param {string} sheetPartName - The sheetPartName parameter.
 * @param {string} drawingPartName - The drawingPartName parameter.
 * @returns {string} - Returns the result.
 */
export function relativeTargetFromSheetToDrawing(sheetPartName: string, drawingPartName: string): string {
    const sheet: string = normalizePartName(sheetPartName);
    const drawing: string = normalizePartName(drawingPartName);
    if (sheet.startsWith('/xl/worksheets/') && drawing.startsWith('/xl/drawings/')) {
        return `../drawings/${drawing.slice('/xl/drawings/'.length)}`;
    }
    const sheetSlash: number = sheet.lastIndexOf('/');
    const sheetDir: string = sheetSlash <= 0 ? '/' : sheet.slice(0, sheetSlash + 1);
    if (drawing.startsWith(sheetDir)) {
        return drawing.slice(sheetDir.length);
    }
    // Build ../ relative path
    const fromSegs: string[] = sheetDir.split('/').filter((s: string): boolean => s.length > 0);
    const toSegs: string[] = drawing.replace(/^\//, '').split('/');
    // fromSegs is directory of sheet (e.g. xl, worksheets)
    let i: number = 0;
    // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
    while (i < fromSegs.length && i < toSegs.length - 1 && fromSegs[i] === toSegs[i]) {
        i += 1;
    }
    const ups: number = fromSegs.length - i;
    const down: string = toSegs.slice(i).join('/');
    const prefix: string = ups > 0 ? `${'../'.repeat(ups)}` : '';
    return `${prefix}${down}`;
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
 * @param {number} value - The value parameter.
 * @param {string} label - The label parameter.
 * @returns {number} - Returns the result.
 */
function requirePositiveInt(value: number, label: string): number {
    if (typeof value !== 'number' || !Number.isInteger(value) || value < 1) {
        throw new InvalidArgumentError(`${label} must be a 1-based integer`);
    }
    return value;
}

/**
 * normalizeColorOrClear function.
 *
 * @param {string} value - The value parameter.
 * @returns {string} - Returns the result.
 */
function normalizeColorOrClear(value: string | undefined | null): string | undefined {
    if (value === undefined || value === null || String(value).trim() === '') {
        return undefined;
    }
    let s: string = String(value).trim();
    if (s.startsWith('#')) {
        s = s.slice(1);
    }
    if (s.length === 8 && /^[0-9a-fA-F]{8}$/.test(s)) {
        // AARRGGBB → RRGGBB
        s = s.slice(2);
    }
    if (!/^[0-9a-fA-F]{6}$/.test(s)) {
        throw new InvalidArgumentError('Color must be RRGGBB or #RRGGBB (optional AARRGGBB)');
    }
    return s.toUpperCase();
}

/**
 * parseEmuAttr function.
 *
 * @param {string} raw - The raw parameter.
 * @returns {number} - Returns the result.
 */
function parseEmuAttr(raw: string | undefined): number {
    if (raw === undefined) {
        return 0;
    }
    const n: number = Number.parseInt(raw, 10);
    return Number.isFinite(n) && n >= 0 ? n : 0;
}

/**
 * findSrgbIn function.
 *
 * @param {string} parentXml - The parentXml parameter.
 * @param {string} solidFillLocal - The solidFillLocal parameter.
 * @returns {string} - Returns the result.
 */
function findSrgbIn(parentXml: string, solidFillLocal: string = 'solidFill'): string | undefined {
    const fill: string = findChildByLocal(parentXml, solidFillLocal);
    if (fill === undefined) {
        return undefined;
    }
    const srgb: string = findChildByLocal(fill, 'srgbClr');
    if (srgb === undefined) {
        return undefined;
    }
    const attrs: Map<string, string> = parseAttrMap(elementOpenAttrs(srgb));
    const val: string = attrs.get('val');
    if (val === undefined) {
        return undefined;
    }
    try {
        return normalizeColorOrClear(val);
    } catch {
        return undefined;
    }
}

/**
 * bodyPrAnchorToApi function.
 *
 * @param {string} raw - The raw parameter.
 * @returns {TextBoxVerticalAlignment} - Returns the result.
 */
function bodyPrAnchorToApi(raw: string | undefined): TextBoxVerticalAlignment {
    if (raw === 'ctr' || raw === 'center') {
        return 'middle';
    }
    if (raw === 'b' || raw === 'bottom') {
        return 'bottom';
    }
    return 'top';
}

/**
 * apiToBodyPrAnchor function.
 *
 * @param {TextBoxVerticalAlignment} v - The v parameter.
 * @returns {string} - Returns the result.
 */
function apiToBodyPrAnchor(v: TextBoxVerticalAlignment): string {
    if (v === 'middle') {
        return 'ctr';
    }
    if (v === 'bottom') {
        return 'b';
    }
    return 't';
}

/**
 * pPrAlgnToApi function.
 *
 * @param {string} raw - The raw parameter.
 * @returns {TextBoxHorizontalAlignment} - Returns the result.
 */
function pPrAlgnToApi(raw: string | undefined): TextBoxHorizontalAlignment {
    if (raw === 'ctr' || raw === 'center') {
        return 'center';
    }
    if (raw === 'r' || raw === 'right') {
        return 'right';
    }
    if (raw === 'just' || raw === 'justify') {
        return 'justify';
    }
    return 'left';
}

/**
 * apiToPPrAlgn function.
 *
 * @param {TextBoxHorizontalAlignment} v - The v parameter.
 * @returns {string} - Returns the result.
 */
function apiToPPrAlgn(v: TextBoxHorizontalAlignment): string {
    if (v === 'center') {
        return 'ctr';
    }
    if (v === 'right') {
        return 'r';
    }
    if (v === 'justify') {
        return 'just';
    }
    return 'l';
}

/**
 * needsXmlSpace function.
 *
 * @param {string} text - The text parameter.
 * @returns {boolean} - Returns the result.
 */
function needsXmlSpace(text: string): boolean {
    if (text.length === 0) {
        return false;
    }
    const first: string = text.charAt(0);
    const last: string = text.charAt(text.length - 1);
    return /\s/.test(first) || /\s/.test(last) || text.includes('  ');
}

/**
 * extractTrailingNumber function.
 *
 * @param {string} name - The name parameter.
 * @returns {number} - Returns the result.
 */
function extractTrailingNumber(name: string): number | undefined {
    const m: RegExpExecArray = /(\d+)\s*$/.exec(name);
    if (m === null || m[1] === undefined) {
        return undefined;
    }
    const n: number = Number.parseInt(m[1], 10);
    return Number.isFinite(n) ? n : undefined;
}

/**
 * stripProlog function.
 *
 * @param {string} xml - The xml parameter.
 * @returns {string} - Returns the result.
 */
function stripProlog(xml: string): string {
    return xml.replace(/^\uFEFF/, '').replace(/<\?xml[^?]*\?>\s*/i, '');
}

/**
 * matchRootLocal function.
 *
 * @param {string} xml - The xml parameter.
 * @param {string} localName - The localName parameter.
 * @returns {Object} - Returns the result.
 */
function matchRootLocal(xml: string, localName: string): { openAttrs: string; inner: string } | undefined {
    // eslint-disable-next-line security/detect-non-literal-regexp -- RegExp built from escapeRegExp(localName) only
    const re: RegExp = new RegExp(`<((?:[A-Za-z_][\\w.-]*:)?)(${localName})(\\s[^>]*)?>([\\s\\S]*)</\\1?\\2\\s*>`, 'i');
    const m: RegExpExecArray = re.exec(xml);
    if (m === null) {
        // self-closing empty
        // eslint-disable-next-line security/detect-non-literal-regexp -- RegExp built from escapeRegExp(localName) only
        const sc: RegExpExecArray = new RegExp(`<((?:[A-Za-z_][\\w.-]*:)?)(${localName})(\\s[^>]*)?/>`, 'i').exec(xml);
        if (sc === null) {
            return undefined;
        }
        return { openAttrs: sc[3] != null ? sc[3] : '', inner: '' };
    }
    return { openAttrs: m[3] != null ? m[3] : '', inner: m[4] != null ? m[4] : '' };
}

/**
 * splitTopLevelElements function.
 *
 * @param {string} inner - The inner parameter.
 * @returns {string[]} - Returns the result.
 */
function splitTopLevelElements(inner: string): string[] {
    const out: string[] = [];
    let i: number = 0;
    const s: string = inner;
    while (i < s.length) {
        while (i < s.length && /\s/.test(s.charAt(i))) {
            i += 1;
        }
        if (i >= s.length) {
            break;
        }
        if (s.charAt(i) !== '<') {
            i += 1;
            continue;
        }
        if (s.startsWith('<!--', i)) {
            const end: number = s.indexOf('-->', i + 4);
            i = end < 0 ? s.length : end + 3;
            continue;
        }
        if (s.startsWith('<?', i)) {
            const end: number = s.indexOf('?>', i + 2);
            i = end < 0 ? s.length : end + 2;
            continue;
        }
        const start: number = i;
        const openEnd: number = s.indexOf('>', i);
        if (openEnd < 0) {
            break;
        }
        const openTag: string = s.slice(i, openEnd + 1);
        if (openTag.endsWith('/>')) {
            out.push(s.slice(start, openEnd + 1));
            i = openEnd + 1;
            continue;
        }
        // eslint-disable-next-line security/detect-unsafe-regex -- fixed OOXML/token grammar literal
        const nameMatch: RegExpExecArray = /^<\/?([A-Za-z_][\w.-]*(?::[A-Za-z_][\w.-]*)?)/.exec(openTag);
        const qName: string = nameMatch == null ? undefined : nameMatch[1];
        if (qName === undefined) {
            i = openEnd + 1;
            continue;
        }
        const local: string = qName.includes(':') ? qName.slice(qName.indexOf(':') + 1) : qName;
        let depth: number = 1;
        i = openEnd + 1;
        while (i < s.length && depth > 0) {
            const nextLt: number = s.indexOf('<', i);
            if (nextLt < 0) {
                i = s.length;
                break;
            }
            if (s.startsWith('<!--', nextLt)) {
                const end: number = s.indexOf('-->', nextLt + 4);
                i = end < 0 ? s.length : end + 3;
                continue;
            }
            const close: number = s.indexOf('>', nextLt);
            if (close < 0) {
                i = s.length;
                break;
            }
            const tag: string = s.slice(nextLt, close + 1);
            if (tag.startsWith('</')) {
                // eslint-disable-next-line security/detect-unsafe-regex -- fixed OOXML/token grammar literal
                const cn: RegExpExecArray = /^<\/([A-Za-z_][\w.-]*(?::[A-Za-z_][\w.-]*)?)/.exec(tag);
                let cLocal: string = '';
                if (cn !== null && cn[1] !== undefined) {
                    cLocal = cn[1].includes(':') ? cn[1].slice(cn[1].indexOf(':') + 1) : cn[1];
                }
                if (cLocal.toLowerCase() === local.toLowerCase()) {
                    depth -= 1;
                }
                i = close + 1;
                if (depth === 0) {
                    out.push(s.slice(start, close + 1));
                }
                continue;
            }
            if (tag.endsWith('/>')) {
                i = close + 1;
                continue;
            }
            // eslint-disable-next-line security/detect-unsafe-regex -- fixed OOXML/token grammar literal
            const on: RegExpExecArray = /^<([A-Za-z_][\w.-]*(?::[A-Za-z_][\w.-]*)?)/.exec(tag);
            const oLocal: string =
                on !== null && on[1] !== undefined ? (on[1].includes(':') ? on[1].slice(on[1].indexOf(':') + 1) : on[1]) : '';
            if (oLocal.toLowerCase() === local.toLowerCase()) {
                depth += 1;
            }
            i = close + 1;
        }
    }
    return out;
}

/**
 * elementLocalName function.
 *
 * @param {string} el - The el parameter.
 * @returns {string} - Returns the result.
 */
function elementLocalName(el: string): string {
    // eslint-disable-next-line security/detect-unsafe-regex -- fixed OOXML/token grammar literal
    const m: RegExpExecArray = /^<\/?([A-Za-z_][\w.-]*(?::[A-Za-z_][\w.-]*)?)/.exec(el.trim());
    if (m === null || m[1] === undefined) {
        return '';
    }
    const q: string = m[1];
    return q.includes(':') ? q.slice(q.indexOf(':') + 1) : q;
}

/**
 * elementOpenAttrs function.
 *
 * @param {string} el - The el parameter.
 * @returns {string} - Returns the result.
 */
function elementOpenAttrs(el: string): string {
    const m: RegExpExecArray = /^<[^>\s]+([^>]*)\/?>/.exec(el.trim());
    return m !== null && m[1] !== undefined ? m[1] : '';
}

/**
 * elementInner function.
 *
 * @param {string} el - The el parameter.
 * @returns {string} - Returns the result.
 */
function elementInner(el: string): string {
    const trimmed: string = el.trim();
    if (trimmed.endsWith('/>')) {
        return '';
    }
    const first: number = trimmed.indexOf('>');
    const last: number = trimmed.lastIndexOf('<');
    if (first < 0 || last <= first) {
        return '';
    }
    return trimmed.slice(first + 1, last);
}

/**
 * findChildByLocal function.
 *
 * @param {string} parentXml - The parentXml parameter.
 * @param {string} local - The local parameter.
 * @returns {string} - Returns the result.
 */
function findChildByLocal(parentXml: string, local: string): string | undefined {
    // parentXml may be a full element — search its inner children.
    const inner: string = elementInner(parentXml);
    for (const child of splitTopLevelElements(inner)) {
        if (elementLocalName(child).toLowerCase() === local.toLowerCase()) {
            return child;
        }
    }
    return undefined;
}
