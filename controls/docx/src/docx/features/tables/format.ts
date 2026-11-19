/**
 * Table / row / cell format facades and positioning (DocIO-aligned).
 *
 * @public
 */
import { createTableBordersHost, createCellBordersHost, Borders } from './borders';
import { Paddings, PaddingsHost } from './paddings';
import {
    readTableAlignment,
    readTableBorders,
    readTableCellMargins,
    readTableCellSpacing,
    readTableLayout,
    readTablePreferredWidth,
    readTableShading,
    writeTableAlignment,
    writeTableBorders,
    writeTableCellMargins,
    writeTableCellSpacing,
    writeTableLayout,
    writeTablePreferredWidth,
    writeTableShading,
    TableAlignment,
    TableBorders,
    TableCellMargins,
    TableLayout,
    TableShading,
    TableWidth,
    twipsToPoint,
    pointToTwips, TableCellBorders
} from './tbl-pr';
import {
    readRowCantSplit,
    readRowShading,
    writeRowCantSplit,
    writeRowShading
} from './tr-pr';
import {
    readCellBorders,
    readCellFitText,
    readCellMargins,
    readCellNoWrap,
    readCellShading,
    readCellTextDirection,
    readCellVerticalAlignment,
    readGridSpan,
    readHorizontalMerge,
    readIsSamePaddingsAsTable,
    readVerticalMerge,
    writeCellBorders,
    writeCellFitText,
    writeCellMargins,
    writeCellNoWrap,
    writeCellShading,
    writeCellTextDirection,
    writeCellVerticalAlignment,
    writeGridSpan,
    writeHorizontalMerge,
    writeIsSamePaddingsAsTable,
    writeVerticalMerge,
    TableCellTextDirection,
    TableCellVerticalAlignment
} from './tc-pr';
import {
    readTablePositioning,
    writeTablePositioning,
    TablePositioningBag
} from './tbl-pr-positioning';
import { OpenXmlElement } from '../../core/xml/index';
import { Color, colorToHexWire, normalizeColorHex } from '../document/color';

/**
 * Horizontal merge / vertical merge token (`ST_Merge` mapping).
 *
 * @public
 */
export enum CellMerge {
    None = 'none',
    Start = 'start',
    Continue = 'continue'
}

/**
 * Horizontal origin for floating table position (`w:tblpPr/@w:horzAnchor`).
 *
 * @public
 */
export enum TableHorizontalOrigin {
    Margin = 'margin',
    Page = 'page',
    Column = 'column'
}

/**
 * Vertical origin for floating table position (`w:tblpPr/@w:vertAnchor`).
 *
 * @public
 */
export enum TableVerticalOrigin {
    Margin = 'margin',
    Page = 'page',
    Paragraph = 'paragraph'
}

/**
 * @private
 */
export interface TableFormatHost {
    readTblPr(): OpenXmlElement;
    writeTblPr(next: OpenXmlElement): void;
    /**
     * DocIO paints `tableFormat.backColor` onto each cell's `w:tcPr/w:shd`
     * so Word shows the fill even when table-level shading alone is insufficient.
     * Optional so style-only hosts need not implement cell walks.
     */
    applyTableBackColorToCells?(fill: string | undefined): void;
}

/**
 * @private
 */
export interface RowFormatHost {
    readTrPr(): OpenXmlElement | undefined;
    writeTrPr(next: OpenXmlElement | undefined): void;
}

/**
 * @private
 */
export interface CellFormatHost {
    readTcPr(): OpenXmlElement | undefined;
    writeTcPr(next: OpenXmlElement | undefined): void;
}

function shdFill(shd: TableShading | undefined): string | undefined {
    return shd == null ? undefined : shd.fill;
}

/**
 * Normalize table/row/cell shading fill input to OOXML wire (`RRGGBB` / `'auto'`).
 * {@link Color} becomes hex. {@link Color.Transparent} and empty tokens clear fill
 * (`undefined`) — never invent `fill="auto"` for “no color” authoring.
 * Explicit string `'auto'` is preserved for load-path / intentional wire parity.
 * Strings may include a leading `#`; unknown non-hex tokens pass through for load-path compatibility.
 *
 * @param {string | Color} value - The value.
 * @returns {string | undefined} The result.
 * @private
 */
function shadingFillToWire(value: string | Color): string | undefined {
    if (typeof value === 'number') {
        const hex: string = colorToHexWire(value);
        // Transparent (empty hex) clears fill; do not map to wire `auto`.
        return hex.length > 0 ? hex : undefined;
    }
    const raw: string = value.trim();
    if (raw.length === 0) {
        return undefined;
    }
    if (raw.toLowerCase() === 'auto') {
        return 'auto';
    }
    const hex: string = normalizeColorHex(raw);
    return hex !== undefined ? hex : value;
}

/**
 * Build a `w:shd` bag from a fill wire value.
 * When a fill is authored, default `pattern` to `clear` and `color` to `auto`
 * (DocIO / Word direct-format shape) unless previous shading already set them.
 * Never invents `fill: 'auto'` unless the caller passed that wire value.
 * Clearing fill drops a DocIO-default-only remainder (`clear`/`auto`) so bare
 * `w:shd` without a real fill is not left behind.
 *
 * @param {string | undefined} fill - The fill.
 * @param {TableShading | undefined} prev - The prev.
 * @returns {TableShading | undefined} The result.
 * @private
 */
function shdFromFill(fill: string | undefined, prev: TableShading | undefined): TableShading | undefined {
    if (fill === undefined) {
        if (prev === undefined) {
            return undefined;
        }
        const patternLeft: string = prev.pattern;
        const colorLeft: string = prev.color;
        // clear + auto (or absent) is only the DocIO default envelope for a real fill.
        const onlyDocIoDefaults: boolean =
            (patternLeft === undefined || patternLeft === 'clear') &&
            (colorLeft === undefined || colorLeft === 'auto');
        if (onlyDocIoDefaults) {
            return undefined;
        }
        if (colorLeft === undefined && patternLeft === undefined) {
            return undefined;
        }
        return {
            ...(colorLeft !== undefined ? { color: colorLeft } : {}),
            ...(patternLeft !== undefined ? { pattern: patternLeft } : {})
        };
    }
    // DocIO cell/table backColor: val="clear" color="auto" fill="<hex|auto>"
    const pattern: string =
        prev !== undefined && prev.pattern !== undefined && prev.pattern.length > 0
            ? prev.pattern
            : 'clear';
    const color: string =
        prev !== undefined && prev.color !== undefined && prev.color.length > 0
            ? prev.color
            : 'auto';
    return {
        fill: fill,
        color: color,
        pattern: pattern
    };
}

function wireMergeToCellMerge(v: 'restart' | 'continue' | undefined): CellMerge {
    if (v === 'restart') {
        return CellMerge.Start;
    }
    if (v === 'continue') {
        return CellMerge.Continue;
    }
    return CellMerge.None;
}

function cellMergeToWire(v: CellMerge): 'restart' | 'continue' | undefined {
    if (v === CellMerge.Start) {
        return 'restart';
    }
    if (v === CellMerge.Continue) {
        return 'continue';
    }
    return undefined;
}

/**
 * Floating table position (`w:tblpPr`).
 *
 * @public
 */
export class TablePositioning {
    private readonly host: TableFormatHost;

    /**
     * @param {TableFormatHost} host - The host.
     * @private
     */
    constructor(host: TableFormatHost) {
        this.host = host;
    }

    private readBag(): TablePositioningBag {
        const bag: TablePositioningBag = readTablePositioning(this.host.readTblPr());
        return bag !== undefined ? bag : {};
    }

    private writeBag(next: TablePositioningBag): void {
        this.host.writeTblPr(writeTablePositioning(this.host.readTblPr(), next));
    }

    get horizontalPosition(): number {
        const v: number = this.readBag().horizontalPosition;
        return v !== undefined ? v : 0;
    }
    set horizontalPosition(value: number) {
        const prev: TablePositioningBag = this.readBag();
        this.writeBag({
            horizontalPosition: value,
            verticalPosition: prev.verticalPosition,
            horizontalOrigin: prev.horizontalOrigin,
            verticalOrigin: prev.verticalOrigin,
            distanceFromTop: prev.distanceFromTop,
            distanceFromBottom: prev.distanceFromBottom,
            distanceFromLeft: prev.distanceFromLeft,
            distanceFromRight: prev.distanceFromRight,
            unknownAttributes: prev.unknownAttributes
        });
    }

    get verticalPosition(): number {
        const v: number = this.readBag().verticalPosition;
        return v !== undefined ? v : 0;
    }
    set verticalPosition(value: number) {
        const prev: TablePositioningBag = this.readBag();
        this.writeBag({
            horizontalPosition: prev.horizontalPosition,
            verticalPosition: value,
            horizontalOrigin: prev.horizontalOrigin,
            verticalOrigin: prev.verticalOrigin,
            distanceFromTop: prev.distanceFromTop,
            distanceFromBottom: prev.distanceFromBottom,
            distanceFromLeft: prev.distanceFromLeft,
            distanceFromRight: prev.distanceFromRight,
            unknownAttributes: prev.unknownAttributes
        });
    }

    get horizontalOrigin(): TableHorizontalOrigin {
        const v: TableHorizontalOrigin = this.readBag().horizontalOrigin;
        return v !== undefined ? v : TableHorizontalOrigin.Margin;
    }
    set horizontalOrigin(value: TableHorizontalOrigin) {
        const prev: TablePositioningBag = this.readBag();
        this.writeBag({
            horizontalPosition: prev.horizontalPosition,
            verticalPosition: prev.verticalPosition,
            horizontalOrigin: value,
            verticalOrigin: prev.verticalOrigin,
            distanceFromTop: prev.distanceFromTop,
            distanceFromBottom: prev.distanceFromBottom,
            distanceFromLeft: prev.distanceFromLeft,
            distanceFromRight: prev.distanceFromRight,
            unknownAttributes: prev.unknownAttributes
        });
    }

    get verticalOrigin(): TableVerticalOrigin {
        const v: TableVerticalOrigin = this.readBag().verticalOrigin;
        return v !== undefined ? v : TableVerticalOrigin.Margin;
    }
    set verticalOrigin(value: TableVerticalOrigin) {
        const prev: TablePositioningBag = this.readBag();
        this.writeBag({
            horizontalPosition: prev.horizontalPosition,
            verticalPosition: prev.verticalPosition,
            horizontalOrigin: prev.horizontalOrigin,
            verticalOrigin: value,
            distanceFromTop: prev.distanceFromTop,
            distanceFromBottom: prev.distanceFromBottom,
            distanceFromLeft: prev.distanceFromLeft,
            distanceFromRight: prev.distanceFromRight,
            unknownAttributes: prev.unknownAttributes
        });
    }

    get distanceFromTop(): number {
        const v: number = this.readBag().distanceFromTop;
        return v !== undefined ? v : 0;
    }
    set distanceFromTop(value: number) {
        const prev: TablePositioningBag = this.readBag();
        this.writeBag({
            horizontalPosition: prev.horizontalPosition,
            verticalPosition: prev.verticalPosition,
            horizontalOrigin: prev.horizontalOrigin,
            verticalOrigin: prev.verticalOrigin,
            distanceFromTop: value,
            distanceFromBottom: prev.distanceFromBottom,
            distanceFromLeft: prev.distanceFromLeft,
            distanceFromRight: prev.distanceFromRight,
            unknownAttributes: prev.unknownAttributes
        });
    }

    get distanceFromBottom(): number {
        const v: number = this.readBag().distanceFromBottom;
        return v !== undefined ? v : 0;
    }
    set distanceFromBottom(value: number) {
        const prev: TablePositioningBag = this.readBag();
        this.writeBag({
            horizontalPosition: prev.horizontalPosition,
            verticalPosition: prev.verticalPosition,
            horizontalOrigin: prev.horizontalOrigin,
            verticalOrigin: prev.verticalOrigin,
            distanceFromTop: prev.distanceFromTop,
            distanceFromBottom: value,
            distanceFromLeft: prev.distanceFromLeft,
            distanceFromRight: prev.distanceFromRight,
            unknownAttributes: prev.unknownAttributes
        });
    }

    get distanceFromLeft(): number {
        const v: number = this.readBag().distanceFromLeft;
        return v !== undefined ? v : 0;
    }
    set distanceFromLeft(value: number) {
        const prev: TablePositioningBag = this.readBag();
        this.writeBag({
            horizontalPosition: prev.horizontalPosition,
            verticalPosition: prev.verticalPosition,
            horizontalOrigin: prev.horizontalOrigin,
            verticalOrigin: prev.verticalOrigin,
            distanceFromTop: prev.distanceFromTop,
            distanceFromBottom: prev.distanceFromBottom,
            distanceFromLeft: value,
            distanceFromRight: prev.distanceFromRight,
            unknownAttributes: prev.unknownAttributes
        });
    }

    get distanceFromRight(): number {
        const v: number = this.readBag().distanceFromRight;
        return v !== undefined ? v : 0;
    }
    set distanceFromRight(value: number) {
        const prev: TablePositioningBag = this.readBag();
        this.writeBag({
            horizontalPosition: prev.horizontalPosition,
            verticalPosition: prev.verticalPosition,
            horizontalOrigin: prev.horizontalOrigin,
            verticalOrigin: prev.verticalOrigin,
            distanceFromTop: prev.distanceFromTop,
            distanceFromBottom: prev.distanceFromBottom,
            distanceFromLeft: prev.distanceFromLeft,
            distanceFromRight: value,
            unknownAttributes: prev.unknownAttributes
        });
    }
}

/**
 * Table-level formatting surface.
 *
 * @public
 */
export class TableFormat {
    private readonly host: TableFormatHost;
    private readonly bordersInstance: Borders;
    private readonly paddingsInstance: Paddings;
    private readonly positioningInstance: TablePositioning;

    /**
     * @param {TableFormatHost} host - The host.
     * @private
     */
    constructor(host: TableFormatHost) {
        this.host = host;
        this.bordersInstance = new Borders(
            createTableBordersHost(
                () => readTableBorders(this.host.readTblPr()),
                (value: TableBorders | undefined) => {
                    this.host.writeTblPr(writeTableBorders(this.host.readTblPr(), value));
                }
            ),
            true
        );
        const padHost: PaddingsHost = {
            read: () => readTableCellMargins(this.host.readTblPr()),
            write: (value: TableCellMargins | undefined) => {
                this.host.writeTblPr(writeTableCellMargins(this.host.readTblPr(), value));
            }
        };
        this.paddingsInstance = new Paddings(padHost);
        this.positioningInstance = new TablePositioning(host);
    }

    get borders(): Borders {
        return this.bordersInstance;
    }

    get paddings(): Paddings {
        return this.paddingsInstance;
    }

    get positioning(): TablePositioning {
        return this.positioningInstance;
    }

    get horizontalAlignment(): TableAlignment {
        const value: TableAlignment = readTableAlignment(this.host.readTblPr());
        return value !== undefined ? value : TableAlignment.Left;
    }
    set horizontalAlignment(value: TableAlignment) {
        if (value !== 'left' && value !== 'center' && value !== 'right') {
            throw new RangeError('Unsupported TableAlignment value');
        }
        this.host.writeTblPr(writeTableAlignment(this.host.readTblPr(), value));
    }

    get cellSpacing(): number {
        const value: number = readTableCellSpacing(this.host.readTblPr());
        return value !== undefined ? value : 0;
    }
    set cellSpacing(value: number) {
        if (typeof value !== 'number' || !isFinite(value) || value < 0) {
            throw new RangeError('cellSpacing must be a finite non-negative number');
        }
        this.host.writeTblPr(writeTableCellSpacing(this.host.readTblPr(), value));
    }

    /**
     * Table background fill (`w:tblPr/w:shd/@w:fill`).
     *
     * - **Get (runtime)**: OOXML wire string — hex `RRGGBB`, `'auto'`, or `undefined` when unset.
     * - **Set**: hex string / `'auto'` (optional leading `#`), a {@link Color} enum value, or
     *   `undefined` to clear the authored fill. {@link Color.Transparent} clears fill
     *   (does not invent `w:fill="auto"`).
     *
     * TypeScript 3.3 requires identical get/set types, so the declared type is
     * `string | Color | undefined`; the getter always returns a string when set.
     */
    get backColor(): string | Color | undefined {
        return shdFill(readTableShading(this.host.readTblPr()));
    }
    set backColor(value: string | Color | undefined) {
        const prev: TableShading = readTableShading(this.host.readTblPr());
        const wire: string = value === undefined ? undefined : shadingFillToWire(value);
        this.host.writeTblPr(writeTableShading(this.host.readTblPr(), shdFromFill(wire, prev)));
        // DocIO writes the same fill onto each cell so tcPr/shd carries the color.
        const apply: (fill: string) => void = this.host.applyTableBackColorToCells;
        if (apply !== undefined) {
            apply.call(this.host, wire);
        }
    }

    /**
     * When `true`, text may wrap around a floating table (`w:tblpPr` present).
     * When `false`, the table is inline (no `w:tblpPr`).
     */
    get wrapAround(): boolean {
        return readTablePositioning(this.host.readTblPr()) !== undefined;
    }
    set wrapAround(value: boolean) {
        if (value) {
            const existing: TablePositioningBag = readTablePositioning(this.host.readTblPr());
            if (existing === undefined) {
                this.host.writeTblPr(writeTablePositioning(this.host.readTblPr(), {}));
            }
            return;
        }
        this.host.writeTblPr(writeTablePositioning(this.host.readTblPr(), undefined));
    }

    /**
     * Inverse of fixed layout: `true` when layout is autoFit (default).
     */
    get isAutoResized(): boolean {
        return readTableLayout(this.host.readTblPr()) !== 'fixed';
    }
    set isAutoResized(value: boolean) {
        const layout: TableLayout = value ? 'autoFit' : 'fixed';
        this.host.writeTblPr(writeTableLayout(this.host.readTblPr(), layout));
    }

    /**
     * @private
     * Preferred width bag used by AutoFit / width helpers.
     */
    get preferredWidth(): TableWidth | undefined {
        return readTablePreferredWidth(this.host.readTblPr());
    }
    set preferredWidth(value: TableWidth | undefined) {
        this.host.writeTblPr(writeTablePreferredWidth(this.host.readTblPr(), value));
    }

    /**
     * @private
     */
    get layout(): TableLayout {
        return readTableLayout(this.host.readTblPr());
    }
    set layout(value: TableLayout) {
        this.host.writeTblPr(writeTableLayout(this.host.readTblPr(), value));
    }
}

/**
 * Row-level formatting surface.
 *
 * @public
 */
export class RowFormat {
    private readonly host: RowFormatHost;

    /**
     * @param {RowFormatHost} host - The host.
     * @private
     */
    constructor(host: RowFormatHost) {
        this.host = host;
    }

    /**
     * When `true`, the row may break across pages (Word default).
     * Maps inversely to `w:cantSplit`.
     */
    get isBreakAcrossPages(): boolean {
        const cant: boolean = readRowCantSplit(this.host.readTrPr());
        return cant !== true;
    }
    set isBreakAcrossPages(value: boolean) {
        // isBreakAcrossPages true → remove cantSplit; false → write cantSplit on.
        this.host.writeTrPr(writeRowCantSplit(this.host.readTrPr(), value ? undefined : true));
    }

    /**
     * Row background fill (`w:trPr/w:shd/@w:fill`).
     *
     * - **Get (runtime)**: OOXML wire string — hex `RRGGBB`, `'auto'`, or `undefined` when unset.
     * - **Set**: hex string / `'auto'` (optional leading `#`), a {@link Color} enum value, or
     *   `undefined` to clear the authored fill. {@link Color.Transparent} clears fill
     *   (does not invent `w:fill="auto"`).
     */
    get backColor(): string | Color | undefined {
        return shdFill(readRowShading(this.host.readTrPr()));
    }
    set backColor(value: string | Color | undefined) {
        const prev: TableShading = readRowShading(this.host.readTrPr());
        const wire: string = value === undefined ? undefined : shadingFillToWire(value);
        this.host.writeTrPr(writeRowShading(this.host.readTrPr(), shdFromFill(wire, prev)));
    }
}

/**
 * Cell-level formatting surface.
 *
 * @public
 */
export class CellFormat {
    private readonly host: CellFormatHost;
    private readonly bordersInstance: Borders;
    private readonly paddingsInstance: Paddings;

    /**
     * @param {CellFormatHost} host - The host.
     * @private
     */
    constructor(host: CellFormatHost) {
        this.host = host;
        this.bordersInstance = new Borders(
            createCellBordersHost(
                () => readCellBorders(this.host.readTcPr()),
                (value: TableCellBorders) => {
                    this.host.writeTcPr(writeCellBorders(this.host.readTcPr(), value));
                }
            ),
            false
        );
        const padHost: PaddingsHost = {
            read: () => readCellMargins(this.host.readTcPr()),
            write: (value: TableCellMargins | undefined) => {
                this.host.writeTcPr(writeCellMargins(this.host.readTcPr(), value));
            }
        };
        this.paddingsInstance = new Paddings(padHost);
    }

    /**
     * Cell background fill (`w:tcPr/w:shd/@w:fill`).
     *
     * - **Get (runtime)**: OOXML wire string — hex `RRGGBB`, `'auto'`, or `undefined` when unset.
     * - **Set**: hex string / `'auto'` (optional leading `#`), a {@link Color} enum value, or
     *   `undefined` to clear the authored fill. {@link Color.Transparent} clears fill
     *   (does not invent `w:fill="auto"`).
     */
    get backColor(): string | Color | undefined {
        return shdFill(readCellShading(this.host.readTcPr()));
    }
    set backColor(value: string | Color | undefined) {
        const prev: TableShading = readCellShading(this.host.readTcPr());
        const wire: string = value === undefined ? undefined : shadingFillToWire(value);
        this.host.writeTcPr(writeCellShading(this.host.readTcPr(), shdFromFill(wire, prev)));
    }

    get borders(): Borders {
        return this.bordersInstance;
    }

    get paddings(): Paddings {
        return this.paddingsInstance;
    }

    get verticalAlignment(): TableCellVerticalAlignment {
        const value: TableCellVerticalAlignment = readCellVerticalAlignment(this.host.readTcPr());
        return value !== undefined ? value : TableCellVerticalAlignment.Top;
    }
    set verticalAlignment(value: TableCellVerticalAlignment) {
        if (value !== 'top' && value !== 'center' && value !== 'bottom') {
            throw new RangeError('Unsupported verticalAlignment value');
        }
        this.host.writeTcPr(writeCellVerticalAlignment(this.host.readTcPr(), value));
    }

    get textDirection(): TableCellTextDirection {
        const value: TableCellTextDirection = readCellTextDirection(this.host.readTcPr());
        return value !== undefined ? value : 'lr';
    }
    set textDirection(value: TableCellTextDirection) {
        if (
            value !== 'lr' &&
            value !== 'rl' &&
            value !== 'tb' &&
            value !== 'btLr' &&
            value !== 'lrV' &&
            value !== 'rlV'
        ) {
            throw new RangeError('Unsupported textDirection value');
        }
        this.host.writeTcPr(writeCellTextDirection(this.host.readTcPr(), value));
    }

    /**
     * When `true`, cell text wraps (default). Maps inversely to `w:noWrap`.
     */
    get wrapText(): boolean {
        const noWrap: boolean = readCellNoWrap(this.host.readTcPr());
        return noWrap !== true;
    }
    set wrapText(value: boolean) {
        this.host.writeTcPr(writeCellNoWrap(this.host.readTcPr(), value ? undefined : true));
    }

    get fitText(): boolean {
        const v: boolean = readCellFitText(this.host.readTcPr());
        return v === true;
    }
    set fitText(value: boolean) {
        this.host.writeTcPr(writeCellFitText(this.host.readTcPr(), value ? true : undefined));
    }

    get columnSpan(): number {
        const span: number = readGridSpan(this.host.readTcPr());
        return span !== undefined && span > 0 ? span : 1;
    }
    set columnSpan(value: number) {
        this.host.writeTcPr(writeGridSpan(this.host.readTcPr(), value));
    }

    get horizontalMerge(): CellMerge {
        return wireMergeToCellMerge(readHorizontalMerge(this.host.readTcPr()));
    }
    set horizontalMerge(value: CellMerge) {
        this.host.writeTcPr(writeHorizontalMerge(this.host.readTcPr(), cellMergeToWire(value)));
    }

    get verticalMerge(): CellMerge {
        return wireMergeToCellMerge(readVerticalMerge(this.host.readTcPr()));
    }
    set verticalMerge(value: CellMerge) {
        this.host.writeTcPr(writeVerticalMerge(this.host.readTcPr(), cellMergeToWire(value)));
    }

    get samePaddingsAsTable(): boolean {
        return readIsSamePaddingsAsTable(this.host.readTcPr());
    }
    set samePaddingsAsTable(value: boolean) {
        this.host.writeTcPr(writeIsSamePaddingsAsTable(this.host.readTcPr(), value));
    }
}

// Silence unused import when point helpers are only re-exported indirectly.
void twipsToPoint;
void pointToTwips;
