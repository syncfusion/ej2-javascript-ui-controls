import { PdfGridBuiltinStyle, PdfGridHorizontalOverflowType, PdfTextAlignment, PdfTemplateHorizontalAlignment, PdfTemplateVerticalAlignment, PdfLayoutType, PdfLayoutBreakType, PdfLinkType, PdfGridBorderType } from '../enumerator';
import { PdfStandardFont, PdfFontFamily, PdfFont, PdfFontStyle } from '../fonts/pdf-standard-font';
import { PdfStringFormat, PdfVerticalAlignment } from '../fonts/pdf-string-format';
import { PdfBrush, PdfGraphics, PdfGraphicsState, PdfPen } from '../graphics/pdf-graphics';
import { PdfImage } from '../graphics/images/pdf-image';
import { PdfLayoutFormat } from '../graphics/pdf-layouter';
import { PdfUriAnnotation, PdfFileLinkAnnotation, PdfDocumentLinkAnnotation } from '../annotations/annotation';
import { PdfPage } from '../pdf-page';
import { Point, Rectangle, PdfColumnInformation, PdfGridCell, PdfGridLayoutResult, PdfGridRow, PdfGridStyle, PdfGridColumnStyle, PdfPaddings, PdfLink, PdfTextProperties, PdfImageProperties, PdfBackgroundImage, PdfGridBorderPen, PdfGridPen, _PdfBuiltInDescriptor, _PageSlice, _CellLayout, _segmentPlan, _PdfResolvedGridBorder, _PdfGridBorderSource } from '../pdf-document-helper';
import { _isTextDerivedHyperlink, _resolveImageDrawBounds } from '../utils';
import { PdfDocument } from '../pdf-document';
/**
 * Describes the Word-compatible border, banding and alignment rules of a built-in grid style.
 *
 * @private
 */
type _PdfBuiltInRules = {
    customBorders: boolean;
    top: boolean; bottom: boolean; left: boolean; right: boolean;
    insideHorizontal: boolean; insideVertical: boolean;
    headerBottom: boolean; firstColumnRight: boolean;
    headerOnlyBottom: boolean;
    headerBottomColor: { r: number; g: number; b: number } | null;
    headerBottomWidth: number;
    bandOdd: boolean;
    firstColumnBackground: { r: number; g: number; b: number } | null;
    firstColumnTextColor: { r: number; g: number; b: number } | null;
    firstColumnNoBand: boolean;
    firstColumnRightAlign: boolean;
    headerBold: boolean;
    noHeaderVertical: boolean;
    firstColumnNoHorizontal: boolean;
    leftColor: { r: number; g: number; b: number } | null;
};
/**
 * Represents a table structure used to display tabular data in a PDF document.
 *
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access the first page
 * let page: PdfPage = document.getPage(0);
 * // Create the data source and column mapping
 * let dataSource: object[] = [{ id: '1001', name: 'John' }, { id: '1002', name: 'David' }];
 * let columns: PdfColumnInformation[] = [{ field: 'id', headerText: 'Employee ID', width: 80 }, { field: 'name', headerText: 'Employee Name', width: 120 }];
 * // Create a new PDF grid
 * let grid: PdfGrid = new PdfGrid(dataSource, columns);
 * // Draw the grid on the page
 * let result: PdfGridLayoutResult = grid.draw(page, { x: 10, y: 10, width: 240, height: 160 });
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfGrid {
    /**
     * Indicates whether this grid was constructed from a data source.
     *
     * @private
     */
    _isDataSourceGrid: boolean = false;
    /**
     * The caller-supplied data-source records for a data-source grid.
     *
     * @private
     */
    _dataSource: object[] = [];
    /**
     * The normalized column descriptors for a data-source grid.
     *
     * @private
     */
    _columns: PdfColumnInformation[] = [];
    /**
     * The count of currently generated record rows occupying the front of `_records`.
     *
     * @private
     */
    _generatedRecordCount: number = 0;
    /**
     * The logical column count.
     *
     * @private
     */
    _numberOfColumns: number = 0;
    /**
     * The zero-based column-index to width map, in points.
     *
     * @private
     */
    _columnWidths: Map<number, number> = new Map<number, number>();
    /**
     * The ordered header rows.
     *
     * @private
     */
    _headers: PdfGridRow[] = [];
    /**
     * Controls header rendering on continuation pages. Defaults to true for backward compatibility.
     *
     * @private
     */
    _repeatHeader: boolean = true;
    /**
     * The ordered record rows.
     *
     * @private
     */
    _records: PdfGridRow[] = [];
    /**
     * The grid-level style defaults.
     *
     * @private
     */
    _style: PdfGridStyle = {};
    /**
     * The selected built-in style.
     *
     * @private
     */
    _builtInStyle: PdfGridBuiltinStyle;
    /**
     * The internal default cell border, used when no border is resolved from a style.
     *
     * @private
     */
    _defaultBorder: PdfPen = new PdfPen({ r: 0, g: 0, b: 0 }, 1);
    /**
     * The internal default cell type.
     *
     * @private
     */
    _borderType: PdfGridBorderType = PdfGridBorderType.All;
    /**
     * The internal BorderEdges collection.
     *
     * @private
     */
    _drawnBorderEdges: Set<string> = new Set<string>();
    /**
     * The internal default text brush, used when no text color is resolved from a style.
     *
     * @private
     */
    _defaultTextBrush: PdfBrush = new PdfBrush({ r: 0, g: 0, b: 0 });
    /**
     * The internal default cell font, used when no font is resolved from a style.
     *
     * @private
     */
    _defaultFont: PdfFont = new PdfStandardFont(PdfFontFamily.helvetica, 9);
    /**
     * The internal default cell padding, in points.
     *
     * @private
     */
    _defaultPadding: { left: number; right: number; top: number; bottom: number } = { left: 2, right: 2, top: 2, bottom: 2 };
    /**
     * The internal default width used for a column that cannot be resolved from an explicit or distributed width.
     *
     * @private
     */
    _defaultColumnWidth: number = 100;
    /**
     * The backing field for the `horizontalOverflow` property.
     *
     * @private
     */
    _horizontalOverflow: PdfGridHorizontalOverflowType = PdfGridHorizontalOverflowType.onePage;
    /** Final physical page produced by a paginating nested grid during the current row render. */
    _nestedContinuationPage: PdfPage | null = null;
    /** Y coordinate immediately below the final nested-grid fragment on its physical page. */
    _nestedContinuationY: number = 0;
    _nestedDidContinue: boolean = false;
    /**
     * The immutable segment plan: array of segments with column ranges, widths, and metadata.
     * Populated during layout, consumed during rendering. Each segment is immutable after creation.
     *
     * @private
     */
    _segmentPlan: Array<{
        startCol: number;
        endCol: number;
        width: number;
        isFirstSegment: boolean;
        isLastSegment: boolean;
        validSpanAnchors: Set<number>;
        headers: Array<{
            rowIndex: number;
            cells: Array<{
                cellIndex: number;
                colStart: number;
                colEnd: number;
                colSpan: number;
                rowSpan: number;
                value: object | string | number | boolean | null;
                style: PdfGridColumnStyle;
                bounds: Rectangle;
                contentBounds: Rectangle;
            }>;
            bounds: Rectangle;
        }>;
        logicalRowIndices: Map<number, number>;
    }> = [];
    /**
     * Initializes a new `PdfGrid` from a data source array and column mappings.
     *
     * @param {object[]} dataSource  Source records..
     * @param {PdfColumnInformation[]} columns Column mappings.
     * @param {PdfGridStyle} style Grid style.
     * @param {PdfGridBuiltinStyle} builtInStyle Built-in grid style.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Create the data source and column mapping
     * let dataSource: object[] = [{ id: '1001', name: 'John' }, { id: '1002', name: 'David' }];
     * let columns: PdfColumnInformation[] = [{ field: 'id', headerText: 'Employee ID', width: 80 }, { field: 'name', headerText: 'Employee Name', width: 120 }];
     * // Create a new PDF grid from the data source
     * let grid: PdfGrid = new PdfGrid(dataSource, columns);
     * // Draw the grid on the page
     * let result: PdfGridLayoutResult = grid.draw(page, { x: 10, y: 10, width: 240, height: 160 });
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    public constructor(dataSource: object[], columns: PdfColumnInformation[],
        options?: { style?: PdfGridStyle, builtInStyle?: PdfGridBuiltinStyle })
    /**
     * Initializes a `PdfGrid` from explicit rows and columns.
     *
     * @param {number} columnsCount Number of columns.
     * @param {Map<number, number>} columnWidths Column widths, in points.
     * @param {PdfGridRow[]} rows Grid rows.
     * @param {PdfGridRow[]} headers Header rows.
     * @param {PdfGridStyle} style Grid style.
     * @param {PdfGridBuiltinStyle} builtInStyle Built-in grid style.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Create the explicit row and column structure
     * let widths: Map<number, number> = new Map<number, number>([[0, 80], [1, 120]]);
     * let headers: PdfGridRow[] = [{ cells: [{ value: 'Employee ID' }, { value: 'Employee Name' }] }];
     * let rows: PdfGridRow[] = [{ cells: [{ value: 'E01' }, { value: 'Robert' }] }, { cells: [{ value: 'E02' }, { value: 'Michael' }] }];
     * // Create a new PDF grid from the explicit structure
     * let grid: PdfGrid = new PdfGrid(2, widths, rows, headers);
     * // Draw the grid on the page
     * let result: PdfGridLayoutResult = grid.draw(page, { x: 10, y: 10, width: 240, height: 160 });
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    public constructor(columnsCount: number, columnWidths: Map<number, number>, rows: PdfGridRow[], headers?: PdfGridRow[],
        options?: { style?: PdfGridStyle, builtInStyle?: PdfGridBuiltinStyle })
    /**
     * Initializes a `PdfGrid` from explicit rows and columns with optional styling.
     *
     * @param {number} columnsCount Number of columns.
     * @param {Map<number, number>} columnWidths Column widths, in points.
     * @param {PdfGridRow[]} rows Grid rows.
     * @param {PdfGridRow[] | {style?: PdfGridStyle, builtInStyle?: PdfGridBuiltinStyle}} headersOrOptions Header rows or style options.
     */
    public constructor(columnsCount: number, columnWidths: Map<number, number>, rows: PdfGridRow[], headersOrOptions?: PdfGridRow[]
    | { style?: PdfGridStyle, builtInStyle?: PdfGridBuiltinStyle })
    public constructor(arg1: object[] | number, arg2: PdfColumnInformation[] | Map<number, number>,
                       arg3?: PdfGridRow[] | { style?: PdfGridStyle, builtInStyle?: PdfGridBuiltinStyle },
                       arg4?: PdfGridRow[] | { style?: PdfGridStyle, builtInStyle?: PdfGridBuiltinStyle },
                       arg5?: { style?: PdfGridStyle, builtInStyle?: PdfGridBuiltinStyle }) {
        if (typeof arg1 === 'number') {
            const rows: PdfGridRow[] = arg3 as PdfGridRow[];
            const headers: PdfGridRow[] | undefined = (arg4 && Array.isArray(arg4)) ? (arg4 as PdfGridRow[]) : undefined;
            const options: {
                style?: PdfGridStyle;
                builtInStyle?: PdfGridBuiltinStyle;
            }
            | undefined = ((arg4 && !Array.isArray(arg4))
                ? arg4 :
                arg5) as {
                style?: PdfGridStyle,
                builtInStyle?: PdfGridBuiltinStyle
            } | undefined;
            let style: PdfGridStyle | undefined;
            let builtInStyle: PdfGridBuiltinStyle | undefined;
            if (options) {
                style = options.style;
                builtInStyle = options.builtInStyle;
            }
            this._constructFromExplicitStructure(arg1, arg2 as Map<number, number>, rows, headers, style, builtInStyle);
        } else {
            let style: PdfGridStyle | undefined;
            let builtInStyle: PdfGridBuiltinStyle | undefined;
            const options: {
                style?: PdfGridStyle,
                builtInStyle?: PdfGridBuiltinStyle;
            } | undefined =
                arg3 as { style?: PdfGridStyle; builtInStyle?: PdfGridBuiltinStyle; } | undefined;
            if (options) {
                style = options.style;
                builtInStyle = options.builtInStyle;
            }
            this._constructFromDataSource(arg1, arg2 as PdfColumnInformation[], style, builtInStyle);
        }
    }
    /**
     * Gets or sets how the grid handles horizontal width overflow.
     * The default is `PdfGridHorizontalOverflowType.onePage`.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Create the explicit row and column structure
     * let widths: Map<number, number> = new Map<number, number>([[0, 80], [1, 120], [2, 80], [3, 120]]);
     * let rows: PdfGridRow[] = [{ cells: [{ value: 'A' }, { value: 'B' }, { value: 'C' }, { value: 'D' }] }];
     * // Create a new PDF grid
     * let grid: PdfGrid = new PdfGrid(4, widths, rows);
     * // Set horizontal overflow mode
     * grid.horizontalOverflow = PdfGridHorizontalOverflowType.nextPage;
     * // Draw the grid on the page
     * let result: PdfGridLayoutResult = grid.draw(page, { x: 10, y: 10, width: 150, height: 400 });
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @returns {PdfGridHorizontalOverflowType} The current horizontal overflow mode.
     */
    public get horizontalOverflow(): PdfGridHorizontalOverflowType {
        return this._horizontalOverflow;
    }
    /**
     * Sets how the grid handles horizontal width overflow.
     *
     * @param {PdfGridHorizontalOverflowType} value The horizontal overflow mode to set.
     * @throws {Error} If the value is not a valid `PdfGridHorizontalOverflowType` member.
     */
    public set horizontalOverflow(value: PdfGridHorizontalOverflowType) {
        if (value === undefined) {
            this._horizontalOverflow = PdfGridHorizontalOverflowType.onePage;
            return;
        }
        if (value === null ||
            typeof value !== 'number' ||
            !Number.isFinite(value) ||
            Math.floor(value) !== value ||
            (value !== PdfGridHorizontalOverflowType.onePage &&
                value !== PdfGridHorizontalOverflowType.nextPage &&
                value !== PdfGridHorizontalOverflowType.lastPage)) {
            throw new Error(
                'horizontalOverflow must be a valid PdfGridHorizontalOverflowType member'
            );
        }
        this._horizontalOverflow = value;
    }
    /**
     * Gets the current source records for a data-source grid.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Create the data source and column mapping
     * let dataSource: object[] = [{ id: '1001', name: 'John' }, { id: '1002', name: 'David' }];
     * let columns: PdfColumnInformation[] = [{ field: 'id', headerText: 'Employee ID', width: 80 }, { field: 'name', headerText: 'Employee Name', width: 120 }];
     * // Create a new PDF grid from the data source
     * let grid: PdfGrid = new PdfGrid(dataSource, columns);
     * // Retrieve the current data source
     * let currentData: object[] = grid.dataSource;
     * // Draw the grid on the page
     * let result: PdfGridLayoutResult = grid.draw(page, { x: 10, y: 10, width: 240, height: 160 });
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @returns {object[]} The current array of data-source records.
     */
    public get dataSource(): object[] {
        return this._dataSource;
    }
    /**
     * Gets the column count for the grid.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Create the explicit row and column structure
     * let widths: Map<number, number> = new Map<number, number>([[0, 80], [1, 120]]);
     * let headers: PdfGridRow[] = [{ cells: [{ value: 'ID' }, { value: 'Name' }] }];
     * let rows: PdfGridRow[] = [{ cells: [{ value: 'E01' }, { value: 'John' }] }];
     * // Create a new PDF grid with 2 columns
     * let grid: PdfGrid = new PdfGrid(2, widths, rows, headers);
     * // Retrieve the column count
     * let columnCount: number = grid.numberOfColumns;
     * // Draw the grid on the page with updated data
     * let result: PdfGridLayoutResult = grid.draw(page, { x: 10, y: 10, width: 240, height: 160 });
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @returns {number} The positive finite integer representing the number of columns.
     */
    public get numberOfColumns(): number {
        return this._numberOfColumns;
    }
    /**
     * Gets the number of header rows currently available in the grid.
     *
     * @returns {number} The number of header rows.
     */
    public get headersCount(): number {
        return this._headers.length;
    }
    /**
     * Gets the number of record rows currently available in the grid.
     * Header rows are not included in this count.
     *
     * @returns {number} The number of record rows.
     */
    public get recordsCount(): number {
        return this._records.length;
    }
    /**
     * Gets the record row at the specified zero-based index.
     *
     * @param {number} index The zero-based record-row index.
     * @returns {PdfGridRow} The record row at the specified index.
     * @throws {Error} If index is not a finite non-negative integer or is outside the record-row range.
     */
    public getRow(index: number): PdfGridRow {
        this._validateCollectionIndex(index, this._records.length, 'row');
        return this._records[index as number];
    }
    /**
     * Gets the header row at the specified zero-based index.
     *
     * @param {number} index The zero-based header-row index.
     * @returns {PdfGridRow} The header row at the specified index.
     * @throws {Error} If index is not a finite non-negative integer or is outside the header-row range.
     */
    public getHeader(index: number): PdfGridRow {
        this._validateCollectionIndex(index, this._headers.length, 'header');
        return this._headers[index as number];
    }
    /**
     * Validates a zero-based row or header index before collection access.
     *
     * @private
     * @param {number} index The caller-supplied index.
     * @param {number} count The number of available items.
     * @param {string} collectionName The collection name used in error messages.
     * @returns {void} Nothing.
     */
    _validateCollectionIndex(index: number, count: number, collectionName: string): void {
        if (typeof index !== 'number' || !Number.isFinite(index) || Math.floor(index) !== index) {
            throw new Error(`${collectionName} index must be a finite integer; received ${String(index)}.`);
        }
        if (index < 0 || index >= count) {
            const validRange: string = count > 0 ? `0..${count - 1}` : 'empty';
            throw new Error(`${collectionName} index ${index} is out of range. Valid range: ${validRange}.`);
        }
    }
    /**
     * Gets the column widths map for the grid.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Create the explicit row and column structure with custom widths
     * let widths: Map<number, number> = new Map<number, number>([[0, 80], [1, 120], [2, 150]]);
     * let headers: PdfGridRow[] = [{ cells: [{ value: 'ID' }, { value: 'Name' }, { value: 'Department' }] }];
     * let rows: PdfGridRow[] = [{ cells: [{ value: 'E01' }, { value: 'John' }, { value: 'Sales' }] }];
     * // Create a new PDF grid with specified column widths
     * let grid: PdfGrid = new PdfGrid(3, widths, rows, headers);
     * // Retrieve the column widths map
     * let columnWidthsMap: Map<number, number> = grid.columnWidths;
     * // Draw the grid on the page
     * let result: PdfGridLayoutResult = grid.draw(page, { x: 10, y: 10, width: 350, height: 160 });
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @returns {Map<number, number>} A map of column indices to their widths in points.
     */
    public get columnWidths(): Map<number, number> {
        return this._columnWidths;
    }
    /**
     * Gets the flag controlling whether header rows repeat on continuation pages.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Create the explicit row and column structure
     * let widths: Map<number, number> = new Map<number, number>([[0, 80], [1, 120]]);
     * let headers: PdfGridRow[] = [{ cells: [{ value: 'Employee ID' }, { value: 'Employee Name' }] }];
     * let rows: PdfGridRow[] = [{ cells: [{ value: 'E01' }, { value: 'John' }] }];
     * // Create a new PDF grid
     * let grid: PdfGrid = new PdfGrid(2, widths, rows, headers);
     * // Check the current repeat header setting (default is true)
     * let repeatsHeaders: boolean = grid.repeatHeader;
     * // Draw the grid on the page
     * let result: PdfGridLayoutResult = grid.draw(page, { x: 10, y: 10, width: 240, height: 160 });
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @returns {boolean} True if headers repeat on continuation pages; false if headers appear only on the first page.
     */
    public get repeatHeader(): boolean {
        return this._repeatHeader;
    }
    /**
     * Sets the flag controlling whether header rows repeat on continuation pages.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Create the explicit row and column structure
     * let widths: Map<number, number> = new Map<number, number>([[0, 80], [1, 120]]);
     * let headers: PdfGridRow[] = [{ cells: [{ value: 'Employee ID' }, { value: 'Employee Name' }] }];
     * let rows: PdfGridRow[] = [{ cells: [{ value: 'E01' }, { value: 'John' }] }, { cells: [{ value: 'E02' }, { value: 'Alice' }] }];
     * // Create a new PDF grid
     * let grid: PdfGrid = new PdfGrid(2, widths, rows, headers);
     * // Disable header repetition on continuation pages
     * grid.repeatHeader = false;
     * // Draw the grid with pagination (headers only appear on first page)
     * let result: PdfGridLayoutResult = grid.draw(page, { x: 10, y: 10, width: 240, height: 160 });
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {boolean} value True to repeat headers on all pages; false to show headers only on the first page.
     * @throws {Error} If the value is not a boolean.
     *
     */
    public set repeatHeader(value: boolean) {
        if (typeof value !== 'boolean') {
            throw new Error('repeatHeader must be a boolean.');
        }
        this._repeatHeader = value;
    }
    /**
     * Gets the grid-level style.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Create the explicit row and column structure
     * let widths: Map<number, number> = new Map<number, number>([[0, 80], [1, 120]]);
     * let headers: PdfGridRow[] = [{ cells: [{ value: 'Employee ID' }, { value: 'Employee Name' }] }];
     * let rows: PdfGridRow[] = [{ cells: [{ value: 'E01' }, { value: 'John' }] }];
     * // Create a new PDF grid with grid-level style defaults
     * let gridStyle: PdfGridStyle = { backgroundColor: { r: 240, g: 240, b: 240 }, textColor: { r: 0, g: 0, b: 0 } };
     * let grid: PdfGrid = new PdfGrid(2, widths, rows, headers, {style: gridStyle});
     * // Retrieve the grid-level style defaults
     * let currentStyle: PdfGridStyle = grid.style;
     * // Draw the grid on the page with applied styles
     * let result: PdfGridLayoutResult = grid.draw(page, { x: 10, y: 10, width: 240, height: 160 });
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @returns {PdfGridStyle} The grid-level style object containing styling properties.
     */
    public get style(): PdfGridStyle {
        return this._style;
    }
    /**
     * Sets the grid-level style.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Create the explicit row and column structure
     * let widths: Map<number, number> = new Map<number, number>([[0, 80], [1, 120]]);
     * let headers: PdfGridRow[] = [{ cells: [{ value: 'Employee ID' }, { value: 'Employee Name' }] }];
     * let rows: PdfGridRow[] = [{ cells: [{ value: 'E01' }, { value: 'John' }] }, { cells: [{ value: 'E02' }, { value: 'Alice' }] }];
     * // Create a new PDF grid
     * let grid: PdfGrid = new PdfGrid(2, widths, rows, headers);
     * // Define grid-level style with light gray background and black text
     * let newStyle: PdfGridStyle = {
     *     backgroundColor: { r: 240, g: 240, b: 240 },
     *     textColor: { r: 0, g: 0, b: 0 },
     *     font: { size: 10 }
     * };
     * // Set the grid-level style defaults
     * grid.style = newStyle;
     * // Draw the grid on the page with applied style defaults
     * let result: PdfGridLayoutResult = grid.draw(page, { x: 10, y: 10, width: 240, height: 160 });
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {PdfGridStyle} value A style object containing grid-level default styling properties.
     */
    public set style(value: PdfGridStyle) {
        this._style = value ? this._cloneStyle(value) : {};
        this._initializeBorderMode(this._style);
    }
    /**
     * Draws the grid on the specified page within the specified bounds.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Create a grid with multiple rows
     * let widths: Map<number, number> = new Map<number, number>([[0, 80], [1, 120]]);
     * let headers: PdfGridRow[] = [{ cells: [{ value: 'Employee ID' }, { value: 'Employee Name' }] }];
     * let rows: PdfGridRow[] = [
     *     { cells: [{ value: 'E01' }, { value: 'John' }] },
     *     { cells: [{ value: 'E02' }, { value: 'Alice' }] },
     *     { cells: [{ value: 'E03' }, { value: 'Bob' }] }
     * ];
     * let grid: PdfGrid = new PdfGrid(2, widths, rows, headers);
     * // Draw the grid within specified bounds with pagination support
     * let result: PdfGridLayoutResult = grid.draw(page, { x: 10, y: 10, width: 240, height: 300 });
     * console.log('Grid rendered on page:', result.page.pageIndex, 'Occupied bounds:', result.bounds);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {PdfPage} page The PDF page on which to draw the grid.
     * @param {Rectangle} bounds The rectangular bounds.
     * @param {PdfLayoutFormat} layoutFormat Optional layout format.
     * @returns {PdfGridLayoutResult} A layout result describing the completion page, occupied bounds, and any remaining rows if pagination occurred.
     * @throws {Error} If the grid does not fit within the specified bounds and pagination is not supported by the layout format.
     */
    public draw(page: PdfPage, bounds: Rectangle, layoutFormat?: PdfLayoutFormat): PdfGridLayoutResult
    /**
     * Draws the grid using the specified graphics context within the specified bounds.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Get the graphics context from the page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a small grid
     * let widths: Map<number, number> = new Map<number, number>([[0, 80], [1, 120]]);
     * let headers: PdfGridRow[] = [{ cells: [{ value: 'ID' }, { value: 'Name' }] }];
     * let rows: PdfGridRow[] = [{ cells: [{ value: 'E01' }, { value: 'John' }] }];
     * let grid: PdfGrid = new PdfGrid(2, widths, rows, headers);
     * // Draw the grid directly on graphics within bounds (no pagination)
     * grid.draw(graphics, { x: 10, y: 10, width: 240, height: 100 });
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {PdfGraphics} graphics The graphics context.
     * @param {Rectangle} bounds The rectangular bounds.
     * @returns {void} Nothing.
     * @throws {Error} If the grid content exceeds the available height within the specified bounds.
     */
    public draw(graphics: PdfGraphics, bounds: Rectangle): void;
    /**
     * Draws the grid on the specified page starting at the given location.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Create a grid with multiple rows
     * let widths: Map<number, number> = new Map<number, number>([[0, 80], [1, 120]]);
     * let headers: PdfGridRow[] = [{ cells: [{ value: 'Employee ID' }, { value: 'Employee Name' }] }];
     * let rows: PdfGridRow[] = [
     *     { cells: [{ value: 'E01' }, { value: 'John' }] },
     *     { cells: [{ value: 'E02' }, { value: 'Alice' }] },
     *     { cells: [{ value: 'E03' }, { value: 'Bob' }] }
     * ];
     * let grid: PdfGrid = new PdfGrid(2, widths, rows, headers);
     * // Draw the grid starting at location (10, 10) with automatic pagination
     * let result: PdfGridLayoutResult = grid.draw(page, { x: 10, y: 10 });
     * console.log('Grid rendered on page:', result.page.pageIndex, 'Occupied bounds:', result.bounds);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {PdfPage} page The PDF page on which to draw the grid.
     * @param {Point} location The (x, y) coordinates (in points) where the grid drawing will start.
     * @param {PdfLayoutFormat} layoutFormat Optional layout format.
     * @returns {PdfGridLayoutResult} A layout result describing the completion page, occupied bounds, and any remaining rows if pagination occurred.
     * @throws {Error} If the starting location exceeds the page boundaries.
     */
    public draw(page: PdfPage, location: Point, layoutFormat?: PdfLayoutFormat): PdfGridLayoutResult
    /**
     * Draws the grid using the specified graphics context starting at the given location.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Get the graphics context from the page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a small grid
     * let widths: Map<number, number> = new Map<number, number>([[0, 80], [1, 120]]);
     * let headers: PdfGridRow[] = [{ cells: [{ value: 'ID' }, { value: 'Name' }] }];
     * let rows: PdfGridRow[] = [{ cells: [{ value: 'E01' }, { value: 'John' }] }];
     * let grid: PdfGrid = new PdfGrid(2, widths, rows, headers);
     * // Draw the grid directly on graphics starting at location (10, 10) (no pagination)
     * grid.draw(graphics, { x: 10, y: 10 });
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {PdfGraphics} graphics The graphics context (typically from a page) on which to draw the grid.
     * @param {Point} location The (x, y) coordinates (in points) where the grid drawing will start.
     * @returns {void} Nothing.
     * @throws {Error} If the grid content exceeds the available space from the starting location to the graphics edges.
     */
    public draw(graphics: PdfGraphics, location: Point): void
    public draw(arg1: PdfPage | PdfGraphics, arg2: Rectangle | Point, arg3?: PdfLayoutFormat): PdfGridLayoutResult | void {
        const hasSize: boolean = 'width' in arg2 && typeof (arg2 as Rectangle).width === 'number';
        if (arg1 instanceof PdfPage) {
            const firstPage: PdfPage = arg1;
            const layoutFormat: PdfLayoutFormat = arg3;
            const pageClientSize: { width: number; height: number } = firstPage.graphics.clientSize;
            if (hasSize) {
                this._validatePageBounds(arg2 as Rectangle, pageClientSize);
            } else {
                this._validatePageLocation(arg2 as Point, pageClientSize);
            }
            const firstBounds: Rectangle = hasSize ? {
                x: (arg2 as Rectangle).x,
                y: (arg2 as Rectangle).y,
                width: Math.min((arg2 as Rectangle).width, pageClientSize.width - (arg2 as Rectangle).x),
                height: (arg2 as Rectangle).height
            } : {
                x: (arg2 as Point).x,
                y: (arg2 as Point).y,
                width: pageClientSize.width - (arg2 as Point).x,
                height: pageClientSize.height - (arg2 as Point).y
            };
            const sourceRows: PdfGridRow[] = this._headers.concat(this._records);
            this._validateNestedGridTree();
            this._validateNestedGridSpanPositions(sourceRows, this._numberOfColumns);
            this._validateAllPadding(sourceRows);
            this._validateAllSpacing();
            this._validateRowHeights(sourceRows);
            this._validateCellLinks(sourceRows);
            const columnWidths: number[] = this._resolveColumnWidths(firstBounds.width);
            const segments: Array<{ startCol: number; endCol: number; width: number }> =
                this._computeSegments(columnWidths, firstBounds.width);
            this._buildSegmentPlan(segments);
            const descriptor: _PdfBuiltInDescriptor = (typeof this._builtInStyle === 'number')
                ? this._resolveBuiltInDescriptor(this._builtInStyle)
                : null;
            const layoutType: PdfLayoutType = layoutFormat ? layoutFormat.layout : PdfLayoutType.paginate;
            if (layoutType === PdfLayoutType.onePage && this._segmentPlan.length > 1) {
                throw new Error(
                    'PdfGrid: PdfLayoutType.onePage cannot be combined with horizontalOverflow mode'
                );
            }
            let lastOccupied: Rectangle = { x: firstBounds.x, y: firstBounds.y, width: 0, height: 0 };
            let lastPage: PdfPage = firstPage;
            let remainingRows: PdfGridRow[];
            const headerCount: number = this._headers.length;
            const allRows: PdfGridRow[] = this._prepareRowsForPagination(sourceRows, firstBounds.height, layoutFormat,
                                                                         columnWidths, descriptor);
            const rowHeights: number[] = this._computeRowHeights(allRows, columnWidths, descriptor);
            const firstPageHeaderHeight: number = this._headers.length > 0
                ? rowHeights.slice(0, this._headers.length)
                    .reduce((sum: number, height: number) => sum + height, 0)
                : 0;
            const firstPageRecordCapacity: number = Math.max(
                firstBounds.height - firstPageHeaderHeight,
                4
            );
            for (let ri: number = this._headers.length; ri < allRows.length; ri++) {
                const paginatingChild: boolean = allRows[ri as number].cells.some((cell: PdfGridCell) =>
                    cell.value instanceof PdfGrid &&
                    !!(cell.style && cell.style.nestedGrid && cell.style.nestedGrid.allowPagination === true));
                if (paginatingChild && rowHeights[ri as number] > firstPageRecordCapacity) {
                    rowHeights[ri as number] = firstPageRecordCapacity;
                }
            }
            const nonPaginatedRows: number[] = this._detectNonPaginatedNestedRows(allRows);
            const hasPaginatingNestedRows: boolean = allRows.some((row: PdfGridRow, rowIndex: number) =>
                rowIndex >= headerCount && row.cells.some((cell: PdfGridCell) =>
                    cell.value instanceof PdfGrid &&
                    !!(cell.style && cell.style.nestedGrid &&
                        cell.style.nestedGrid.allowPagination === true)));
            const isNextPageMode: boolean = layoutType !== PdfLayoutType.onePage &&
                ((this._horizontalOverflow === PdfGridHorizontalOverflowType.nextPage &&
                    this._segmentPlan.length > 1) ||
                    (this._segmentPlan.length === 1 && hasPaginatingNestedRows));
            if (isNextPageMode) {
                const nextPageOwner: PdfPage = firstPage;
                const nextPageDocument: PdfDocument = nextPageOwner._crossReference._document;
                const repeatedHeaderHeight: number = this._repeatHeader && headerCount > 0
                    ? rowHeights.slice(0, headerCount)
                        .reduce((sum: number, height: number) => sum + height, 0)
                    : 0;
                const paginateBoundsHeight: number = layoutFormat && layoutFormat._boundSet &&
                    layoutFormat._paginateBounds
                    ? layoutFormat._paginateBounds.height
                    : -1;
                const segmentRenderWidths: number[][] = this._segmentPlan.map((segment: {
                    startCol: number;
                    endCol: number;
                    width: number;
                }) => {
                    const widths: number[] = new Array(this._numberOfColumns).fill(0) as number[];
                    for (let columnIndex: number = segment.startCol;
                        columnIndex < segment.endCol; columnIndex++) {
                        widths[columnIndex as number] = columnWidths[columnIndex as number];
                    }
                    return widths;
                });
                let nextOutputPageIndex: number = firstPage._pageIndex;
                let bandStartRow: number = headerCount;
                let bandIndex: number = 0;
                let resumePage: PdfPage | null = null;
                let resumeY: number = 0;
                while (bandStartRow < allRows.length) {
                    const firstBand: boolean = bandIndex === 0;
                    const referencePage: PdfPage = firstBand
                        ? firstPage
                        : nextPageDocument.getPage(Math.max(nextOutputPageIndex, 0));
                    const referenceClientHeight: number = referencePage.graphics.clientSize.height;
                    const pageHeight: number = firstBand
                        ? firstBounds.height
                        : paginateBoundsHeight > 0
                            ? Math.min(paginateBoundsHeight, referenceClientHeight)
                            : referenceClientHeight;
                    const resumedBand: boolean = resumePage !== null;
                    const bandHeaderHeight: number = resumedBand ? 0 : repeatedHeaderHeight;
                    const bodyCapacity: number = resumedBand
                        ? Math.max(referenceClientHeight - resumeY, 0)
                        : Math.max(pageHeight - bandHeaderHeight, 0);
                    let bandEndRow: number = bandStartRow;
                    let bandBodyHeight: number = 0;
                    while (bandEndRow < allRows.length &&
                        bandBodyHeight + rowHeights[bandEndRow as number] <= bodyCapacity + 1e-6) {
                        const bandRow: PdfGridRow = allRows[bandEndRow as number];
                        const rowHasPaginatingChild: boolean = bandRow.cells.some((cell: PdfGridCell) =>
                            cell.value instanceof PdfGrid &&
                            !!(cell.style && cell.style.nestedGrid &&
                                cell.style.nestedGrid.allowPagination === true));
                        bandBodyHeight += rowHeights[bandEndRow as number];
                        bandEndRow++;
                        if (rowHasPaginatingChild) {
                            break;
                        }
                    }
                    if (bandEndRow === bandStartRow) {
                        throw new Error(`PdfGrid no-progress detected: row ${bandStartRow} ` +
                            `(height ${rowHeights[bandStartRow as number]}) cannot fit within ` +
                            `nextPage body height ${bodyCapacity}.`);
                    }
                    for (let segmentIndex: number = 0;
                        segmentIndex < this._segmentPlan.length; segmentIndex++) {
                        const segment: _segmentPlan = this._segmentPlan[segmentIndex as number];
                        let renderPage: PdfPage;
                        const useNestedRemainder: boolean = segmentIndex === 0 && resumePage !== null;
                        if (useNestedRemainder) {
                            renderPage = resumePage as PdfPage;
                            nextOutputPageIndex = renderPage._pageIndex;
                        } else if (bandIndex === 0 && segmentIndex === 0) {
                            renderPage = firstPage;
                        } else {
                            nextOutputPageIndex++;
                            renderPage = nextOutputPageIndex < nextPageDocument.pageCount
                                ? nextPageDocument.getPage(nextOutputPageIndex)
                                : nextPageDocument.addPage();
                        }
                        const pageCountBeforeRender: number = nextPageDocument.pageCount;
                        const originX: number = useNestedRemainder
                            ? firstBounds.x
                            : bandIndex === 0 && segmentIndex === 0
                                ? firstBounds.x
                                : 0;
                        const originY: number = useNestedRemainder
                            ? resumeY
                            : bandIndex === 0 && segmentIndex === 0
                                ? firstBounds.y
                                : 0;
                        if (useNestedRemainder) {
                            resumePage = null;
                            resumeY = 0;
                        }
                        this._nestedContinuationPage = null;
                        this._nestedContinuationY = 0;
                        this._nestedDidContinue = false;
                        const renderWidths: number[] =
                            segmentRenderWidths[segmentIndex as number];
                        let headerOccupiedBounds: Rectangle | undefined;
                        if (this._repeatHeader && headerCount > 0 && !useNestedRemainder) {
                            const headerOccupied: boolean[][] = allRows.map(() =>
                                new Array(this._numberOfColumns).fill(false) as boolean[]);
                            headerOccupiedBounds = this._renderSlice(renderPage.graphics, {
                                x: originX,
                                y: originY,
                                width: segment.width,
                                height: bandHeaderHeight
                            }, allRows, 0, headerCount, renderWidths, rowHeights,
                                                                     descriptor, headerOccupied, renderPage);
                        }
                        const bodyOccupied: boolean[][] = allRows.map(() =>
                            new Array(this._numberOfColumns).fill(false) as boolean[]);
                        const bodyOccupiedBounds: Rectangle = this._renderSlice(renderPage.graphics, {
                            x: originX,
                            y: originY + bandHeaderHeight,
                            width: segment.width,
                            height: bandBodyHeight
                        }, allRows, bandStartRow, bandEndRow, renderWidths, rowHeights,
                                                                                descriptor, bodyOccupied, renderPage);
                        if (headerOccupiedBounds) {
                            const top: number = Math.min(headerOccupiedBounds.y, bodyOccupiedBounds.y);
                            const bottom: number = Math.max(
                                headerOccupiedBounds.y + headerOccupiedBounds.height,
                                bodyOccupiedBounds.y + bodyOccupiedBounds.height
                            );
                            lastOccupied = {
                                x: bodyOccupiedBounds.x,
                                y: top,
                                width: bodyOccupiedBounds.width,
                                height: Math.max(bottom - top, 0)
                            };
                        } else {
                            lastOccupied = bodyOccupiedBounds;
                        }
                        if (this._nestedContinuationPage !== null && this._nestedDidContinue) {
                            lastPage = this._nestedContinuationPage;
                            nextOutputPageIndex = lastPage._pageIndex;
                            const continuationClientHeight: number = lastPage.graphics.clientSize.height;
                            const nextRowHeight: number = bandEndRow < allRows.length
                                ? rowHeights[bandEndRow as number]
                                : 0;
                            const remainingHeight: number = Math.max(
                                continuationClientHeight - this._nestedContinuationY,
                                0
                            );
                            if (bandEndRow < allRows.length &&
                                nextRowHeight <= remainingHeight + 1e-6) {
                                resumePage = lastPage;
                                resumeY = this._nestedContinuationY;
                            }
                        } else if (nextPageDocument.pageCount > pageCountBeforeRender) {
                            nextOutputPageIndex = nextPageDocument.pageCount - 1;
                            lastPage = nextPageDocument.getPage(nextOutputPageIndex);
                        } else {
                            lastPage = renderPage;
                            nextOutputPageIndex = renderPage._pageIndex;
                        }
                    }
                    bandStartRow = bandEndRow;
                    bandIndex++;
                }
            } else {
                for (let segIdx: number = 0; segIdx < this._segmentPlan.length; segIdx++) {
                    const segPlan: _segmentPlan = this._segmentPlan[segIdx as number];
                    const segColumnWidths: number[] = columnWidths.slice(segPlan.startCol, segPlan.endCol);
                    const segRenderWidths: number[] = new Array(this._numberOfColumns).fill(0) as number[];
                    for (let ci: number = segPlan.startCol; ci < segPlan.endCol; ci++) {
                        segRenderWidths[ci as number] = columnWidths[ci as number];
                    }
                    let segFirstPage: PdfPage;
                    let segFirstBounds: Rectangle;
                    if (segIdx === 0) {
                        segFirstPage = firstPage;
                        segFirstBounds = { x: firstBounds.x, y: firstBounds.y, width: segPlan.width, height: firstBounds.height };
                    } else {
                        const segDoc: PdfPage  = lastPage;
                        const segLastPageIndex: number = lastPage._pageIndex;
                        const segDocument: PdfDocument = segDoc._crossReference._document;
                        const segNextPageIndex: number = segLastPageIndex + 1;
                        const segNextPageExists: boolean = segNextPageIndex < segDocument.pageCount;
                        segFirstPage = segNextPageExists ? segDocument.getPage(segNextPageIndex) : segDocument.addPage();
                        const segPageClientSize: { width: number; height: number } = segFirstPage.graphics.clientSize;
                        segFirstBounds = {
                            x: 0, y: 0,
                            width: segPlan.width,
                            height: segPageClientSize.height
                        };
                    }
                    const slices: _PageSlice[] = this._computeLayout(segFirstPage, segFirstBounds, layoutFormat,
                                                                     segColumnWidths, rowHeights, nonPaginatedRows);
                    if (layoutType === PdfLayoutType.onePage && slices.length > 0) {
                        const slice: _PageSlice = slices[0];
                        const occupied: boolean[][] = allRows.map(() =>
                            new Array(this._numberOfColumns).fill(false) as boolean[]);
                        lastOccupied = this._renderSlice(segFirstPage.graphics, slice.drawBounds, allRows,
                                                         slice.startRow, slice.endRow, segRenderWidths,
                                                         rowHeights, descriptor, occupied, segFirstPage);
                        lastPage = segFirstPage;
                        const firstUnrenderedRecord: number = Math.max(slice.endRow, headerCount);
                        if (firstUnrenderedRecord < allRows.length) {
                            remainingRows = [...allRows.slice(firstUnrenderedRecord)];
                        }
                    } else {
                        const occupied: boolean[][] = allRows.map(() =>
                            new Array(this._numberOfColumns).fill(false) as boolean[]);
                        for (let si: number = 0; si < slices.length; si++) {
                            const slice: _PageSlice = slices[si as number];
                            let repeatedHeaderOccupied: Rectangle | undefined;
                            if (slice.repeatHeaderCount > 0) {
                                const repeatHeaderHeight: number = rowHeights.slice(0, slice.repeatHeaderCount)
                                    .reduce((s: number, h: number) => s + h, 0);
                                const headerBounds: Rectangle = {
                                    x: slice.drawBounds.x, y: 0,
                                    width: slice.drawBounds.width, height: repeatHeaderHeight
                                };
                                const headerOccupied: boolean[][] = allRows.map(() =>
                                    new Array(this._numberOfColumns).fill(false) as boolean[]);
                                repeatedHeaderOccupied = this._renderSlice(
                                    slice.page.graphics, headerBounds, allRows, 0, slice.repeatHeaderCount,
                                    segRenderWidths, rowHeights, descriptor, headerOccupied, slice.page
                                );
                            }
                            const sliceOccupied: Rectangle = this._renderSlice(
                                slice.page.graphics, slice.drawBounds, allRows, slice.startRow, slice.endRow,
                                segRenderWidths, rowHeights, descriptor, occupied, slice.page
                            );
                            if (repeatedHeaderOccupied !== undefined) {
                                const mergedTop: number = Math.min(repeatedHeaderOccupied.y, sliceOccupied.y);
                                const mergedBottom: number = Math.max(
                                    repeatedHeaderOccupied.y + repeatedHeaderOccupied.height,
                                    sliceOccupied.y + sliceOccupied.height
                                );
                                lastOccupied = {
                                    x: sliceOccupied.x, y: mergedTop,
                                    width: sliceOccupied.width,
                                    height: Math.max(mergedBottom - mergedTop, 0)
                                };
                            } else {
                                lastOccupied = sliceOccupied;
                            }
                            lastPage = slice.page;
                        }
                    }
                }
            }
            const resultDocumentOwner: PdfPage = firstPage;
            const resultDocument: { pageCount: number; getPage: (index: number) => PdfPage } =
                resultDocumentOwner._crossReference._document;
            if (resultDocument.pageCount > 0) {
                lastPage = resultDocument.getPage(resultDocument.pageCount - 1);
            }
            const result: PdfGridLayoutResult = remainingRows !== undefined
                ? { page: lastPage, bounds: lastOccupied, remainingResult: remainingRows }
                : { page: lastPage, bounds: lastOccupied };
            return result;
        }
        const graphics: PdfGraphics = arg1 as PdfGraphics;
        let graphicsBounds: Rectangle;
        if (hasSize) {
            this._validateGraphicsBounds(arg2 as Rectangle);
            graphicsBounds = arg2 as Rectangle;
        } else {
            this._validateGraphicsLocation(arg2 as Point);
            const loc: Point = arg2 as Point;
            const clientSize: { width: number; height: number } = graphics.clientSize;
            const availableWidth: number = Math.max(clientSize.width - loc.x, 0);
            const availableHeight: number = Math.max(clientSize.height - loc.y, 0);
            graphicsBounds = { x: loc.x, y: loc.y, width: availableWidth, height: availableHeight };
        }
        this._validateNestedGridTree();
        const sourceRows: PdfGridRow[] = this._headers.concat(this._records);
        this._validateNestedGridSpanPositions(sourceRows, this._numberOfColumns);
        if (this._horizontalOverflow !== PdfGridHorizontalOverflowType.onePage) {
            const gColWidths: number[] = this._resolveColumnWidths(graphicsBounds.width);
            const gSegments: Array<{ startCol: number; endCol: number; width: number }> =
                this._computeSegments(gColWidths, graphicsBounds.width);
            if (gSegments.length > 1) {
                throw new Error(
                    'PdfGrid: The graphics-based draw overload cannot produce horizontal page continuation.'
                );
            }
        }
        const totalGridHeight: number = this._computeTotalGridHeight(graphicsBounds.width);
        if (totalGridHeight > graphicsBounds.height) {
            throw new Error(`PdfGrid does not fit within the supplied graphics bounds. Required height: ${totalGridHeight}, available height: ${graphicsBounds.height}.`);
        }
        this._layoutAndRender(graphics, graphicsBounds);
    }
    /**
     * Validates and appends one record row to the grid.
     *
     * ```typescript
     * // Create a new PDF document.
     * const document = new PdfDocument();
     * // Add a new page to the document.
     * const page = document.pages.add();
     * // Define column widths for the grid.
     * const columnWidths = new Map<number, number>([[0, 100], [1, 100]]);
     * // Create a new PDF grid with 2 columns.
     * const grid = new PdfGrid(2, columnWidths, []);
     * // Add header row to the grid.
     * grid.addHeader({ cells: [{ value: 'ID' }, { value: 'Name' }] });
     * // Add the first data row using addRow method.
     * grid.addRow({ cells: [{ value: '1001' }, { value: 'John' }] });
     * // Add the second data row using addRow method.
     * grid.addRow({ cells: [{ value: '1002' }, { value: 'Jane' }] });
     * // Add the third data row using addRow method.
     * grid.addRow({ cells: [{ value: '1003' }, { value: 'Michael' }] });
     * // Draw the grid on the page within the specified bounds.
     * grid.draw(page, { x: 50, y: 50, width: 200, height: 400 });
     * // Save the document.
     * document.save('grid.pdf');
     * // Destroy the document.
     * document.destroy();
     * ```
     *
     * @param {PdfGridRow} gridRow The record row to append.
     * @returns {void} Nothing.
     * @throws {Error} If gridRow validation fails.
     *
     */
    public addRow(gridRow: PdfGridRow): void {
        this._validateRow(gridRow);
        this._records.push(this._cloneRow(gridRow));
    }
    /**
     * Adds a header row to the grid.
     *
     * ```typescript
     * // Create a new PDF document.
     * const document = new PdfDocument();
     * // Add a new page to the document.
     * const page = document.pages.add();
     * // Define column widths for the grid.
     * const columnWidths = new Map<number, number>([[0, 100], [1, 100]]);
     * // Create a new PDF grid with 2 columns.
     * const grid = new PdfGrid(2, columnWidths, []);
     * // Add header row to the grid.
     * grid.addHeader({ cells: [{ value: 'ID' }, { value: 'Name' }] });
     * // Add the first data row using addRow method.
     * grid.addRow({ cells: [{ value: '1001' }, { value: 'John' }] });
     * // Add the second data row using addRow method.
     * grid.addRow({ cells: [{ value: '1002' }, { value: 'Jane' }] });
     * // Add the third data row using addRow method.
     * grid.addRow({ cells: [{ value: '1003' }, { value: 'Michael' }] });
     * // Draw the grid on the page within the specified bounds.
     * grid.draw(page, { x: 50, y: 50, width: 200, height: 400 });
     * // Save the document.
     * document.save('grid.pdf');
     * // Destroy the document.
     * document.destroy();
     * ```
     *
     * @param {PdfGridRow} gridRow Header row to add.
     * @returns {void}
     * @throws {Error} Throws if the row is invalid or its cell count does not match `numberOfColumns`.
     */
    public addHeader(gridRow: PdfGridRow): void {
        this._validateRow(gridRow);
        this._headers.push(this._cloneRow(gridRow));
    }
    /**
     * Constructs the internal model from a data source and column mapping.
     *
     * @private
     * @param {object[]} dataSource The caller-supplied data-source records.
     * @param {PdfColumnInformation[]} columns The caller-supplied column descriptors.
     * @param {PdfGridStyle} style The optional caller-supplied grid-level style.
     * @param {PdfGridBuiltinStyle} builtInStyle The optional caller-supplied built-in style.
     * @returns {void} Nothing.
     */
    _constructFromDataSource(dataSource: object[], columns: PdfColumnInformation[], style?: PdfGridStyle,
                             builtInStyle?: PdfGridBuiltinStyle): void {
        if (!Array.isArray(dataSource)) {
            throw new Error('dataSource must be an array.');
        }
        if (!Array.isArray(columns) || columns.length === 0) {
            throw new Error('columns must be a non-empty array.');
        }
        this._validateBuiltInStyle(builtInStyle);
        this._validateColumnFields(columns);
        this._isDataSourceGrid = true;
        this._dataSource = dataSource.slice();
        this._columns = columns.map((column: PdfColumnInformation) => {
            return {
                field: column.field, headerText: column.headerText, width: column.width,
                style: column.style ? this._cloneStyle(column.style) : undefined
            };
        });
        this._numberOfColumns = columns.length;
        this._columnWidths = new Map<number, number>();
        this._columns.forEach((column: PdfColumnInformation, index: number) => {
            if (typeof column.width === 'number') {
                this._columnWidths.set(index, column.width);
            }
        });
        this._style = style ? this._cloneStyle(style) : {};
        this._initializeBorderMode(this._style);
        this._builtInStyle = builtInStyle;
        this._headers = [this._buildGeneratedHeaderRow()];
        this._records = this._dataSource.map((record: object) => this._buildGeneratedRecordRow(record));
        this._generatedRecordCount = this._records.length;
    }
    /**
     * Validates that `builtInStyle`, when supplied, is a finite integer in the inclusive range [0, 104].
     * Throws before any model mutation when the value is out of range or has an invalid type.
     *
     * @private
     * @param {PdfGridBuiltinStyle} value The caller-supplied built-in style value.
     * @returns {void} Nothing.
     */
    _validateBuiltInStyle(value: PdfGridBuiltinStyle): void {
        if (typeof value === 'undefined') {
            return;
        }
        if (typeof value !== 'number' || !Number.isFinite(value) || Math.floor(value) !== value || value < 0 || value > 104) {
            throw new Error('builtInStyle must be a finite integer in the range 0–104 (PdfGridBuiltinStyle).');
        }
    }
    /**
     * Returns the resolved visual descriptor for the given built-in style value.
     * Each family maps to a deterministic border color, border width, header background, and band background.
     *
     * @private
     * @param {PdfGridBuiltinStyle} style The validated built-in style value (0–104).
     * @returns {_PdfBuiltInDescriptor} The resolved descriptor.
     */
    _resolveBuiltInDescriptor(style: PdfGridBuiltinStyle): _PdfBuiltInDescriptor {
        type Color = { r: number; g: number; b: number };
        const black: Color = { r: 0, g: 0, b: 0 };
        const white: Color = { r: 255, g: 255, b: 255 };
        const gray127: Color = { r: 127, g: 127, b: 127 };
        const gray153: Color = { r: 153, g: 153, b: 153 };
        const gray191: Color = { r: 191, g: 191, b: 191 };
        const gray204: Color = { r: 204, g: 204, b: 204 };
        const gray242: Color = { r: 242, g: 242, b: 242 };
        const medium: Color[] = [
            { r: 156, g: 194, b: 229 }, { r: 244, g: 176, b: 131 }, { r: 201, g: 201, b: 201 },
            { r: 255, g: 217, b: 102 }, { r: 142, g: 170, b: 219 }, { r: 168, g: 208, b: 141 }
        ];
        const pale: Color[] = [
            { r: 222, g: 234, b: 246 }, { r: 251, g: 228, b: 213 }, { r: 237, g: 237, b: 237 },
            { r: 255, g: 242, b: 204 }, { r: 217, g: 226, b: 243 }, { r: 226, g: 239, b: 217 }
        ];
        const light: Color[] = [
            { r: 189, g: 214, b: 238 }, { r: 247, g: 202, b: 172 }, { r: 219, g: 219, b: 219 },
            { r: 255, g: 229, b: 153 }, { r: 180, g: 198, b: 231 }, { r: 192, g: 224, b: 179 }
        ];
        const accent: Color[] = [
            { r: 91, g: 155, b: 213 }, { r: 237, g: 125, b: 49 }, { r: 165, g: 165, b: 165 },
            { r: 255, g: 192, b: 0 }, { r: 68, g: 114, b: 196 }, { r: 112, g: 173, b: 71 }
        ];
        const darkAccent: Color[] = [
            { r: 46, g: 116, b: 181 }, { r: 196, g: 89, b: 17 }, { r: 123, g: 123, b: 123 },
            { r: 191, g: 143, b: 0 }, { r: 47, g: 84, b: 150 }, { r: 83, g: 129, b: 53 }
        ];
        const descriptor: any = (borderColor: Color, borderWidth: number, headerBackground: Color,  // eslint-disable-line
                                 bandBackground: Color, headerTextColor: Color = null,
                                 bodyBackground: Color = null, bodyTextColor: Color = null): _PdfBuiltInDescriptor => {
            const result: any = { // eslint-disable-line
                borderColor, borderWidth, headerBackground, bandBackground,
                headerTextColor, bodyBackground, bodyTextColor
            };
            return result as _PdfBuiltInDescriptor;
        };
        if (style === 0) {
            return descriptor(gray191, 0.5, null, gray242);
        }
        if (style === 1) {
            return descriptor(gray127, 0.5, null, null);
        }
        if (style === 2) {
            return descriptor(gray127, 0.5, gray242, gray242);
        }
        if (style === 3) {
            return descriptor(white, 0, null, gray242);
        }
        if (style === 4) {
            return descriptor(gray127, 0.5, gray242, gray242);
        }
        if (style >= 5 && style <= 53) {
            const family: number = Math.floor((style - 5) / 7) + 1;
            const variant: number = (style - 5) % 7;
            if (variant === 0) {
                if (family === 1) {
                    return descriptor(gray153, 0.5, null, null);
                }
                if (family === 2) {
                    return descriptor(white, 0.5, null, gray204);
                }
                if (family === 3) {
                    return descriptor(gray153, 0.5, gray153, gray204);
                }
                if (family === 4) {
                    return descriptor(gray153, 0.5, black, gray204, white);
                }
                if (family === 5) {
                    return descriptor(white, 0.5, black, gray153, white, gray204);
                }
                return descriptor(gray204, 0.5, white, gray204, black);
            }
            const index: number = variant - 1;
            if (family === 1) {
                return descriptor(light[index as number], 0.5, null, null);
            }
            if (family === 2) {
                return descriptor(medium[index as number], 0.5, null, pale[index as number]);
            }
            if (family === 3) {
                return descriptor(medium[index as number], 0.5, medium[index as number], pale[index as number]);
            }
            if (family === 4) {
                return descriptor(medium[index as number], 0.5, accent[index as number], pale[index as number], white);
            }
            if (family === 5) {
                return descriptor(white, 0.5, accent[index as number], light[index as number], white, pale[index as number]);
            }
            return descriptor(medium[index as number], 0.5, white, pale[index as number], darkAccent[index as number],
                              null, darkAccent[index as number]);
        }
        if (style >= 54 && style <= 102) {
            const family: number = Math.floor((style - 54) / 7) + 1;
            const variant: number = (style - 54) % 7;
            if (variant === 0) {
                if (family === 1) {
                    return descriptor(gray204, 0.5, white, gray204);
                }
                if (family === 2) {
                    return descriptor(black, 0.5, null, gray204);
                }
                if (family === 3) {
                    return descriptor(black, 0.5, black, null, white);
                }
                if (family === 5) {
                    return descriptor(white, 0.5, black, black, white, black, white);
                }
                if (family === 6) {
                    return descriptor(black, 0.5, white, gray204, black);
                }
                if (family === 7) {
                    return descriptor(black, 0.5, white, gray204, black);
                }
                return descriptor(white, 0.5, black, gray204, white);
            }
            const index: number = variant - 1;
            if (family === 1) {
                return descriptor(medium[index as number], 0.5, white, pale[index as number]);
            }
            if (family === 2) {
                return descriptor(medium[index as number], 0.5, null, pale[index as number]);
            }
            if (family === 3) {
                return descriptor(accent[index as number], 0.5, accent[index as number], null, white);
            }
            if (family === 5) {
                return descriptor(white, 0.5, accent[index as number], accent[index as number], white, accent[index as number], white);
            }
            if (family === 4) {
                return descriptor(medium[index as number], 0.5, accent[index as number], pale[index as number], white);
            }
            if (family === 6) {
                return descriptor(darkAccent[index as number], 0.5, white, pale[index as number], darkAccent[index as number]);
            }
            return descriptor(darkAccent[index as number], 0.5, white, pale[index as number], darkAccent[index as number]);
        }
        if (style === 103) {
            return descriptor(gray191, 0.5, null, null);
        }
        return descriptor(black, 0.5, null, null);
    }
    /**
     * Resolves the Word-compatible border, banding and alignment rules for the grid's built-in style.
     *
     * @private
     * @param {PdfGridBuiltinStyle} style The validated built-in style value.
     * @returns {_PdfBuiltInRules} The rules, or null when the style needs no rule-based behavior.
     */
    _resolveBuiltInRules(style: PdfGridBuiltinStyle): _PdfBuiltInRules {
        type Color = { r: number; g: number; b: number };
        const black: Color = { r: 0, g: 0, b: 0 };
        const white: Color = { r: 255, g: 255, b: 255 };
        const accent: Color[] = [
            { r: 91, g: 155, b: 213 }, { r: 237, g: 125, b: 49 }, { r: 165, g: 165, b: 165 },
            { r: 255, g: 192, b: 0 }, { r: 68, g: 114, b: 196 }, { r: 112, g: 173, b: 71 }
        ];
        const darkAccentColors: Color[] = [
            { r: 46, g: 116, b: 181 }, { r: 196, g: 89, b: 17 }, { r: 123, g: 123, b: 123 },
            { r: 191, g: 143, b: 0 }, { r: 47, g: 84, b: 150 }, { r: 83, g: 129, b: 53 }
        ];
        const make: (values: any) => _PdfBuiltInRules = (values: any): _PdfBuiltInRules => ({ // eslint-disable-line
            customBorders: false, top: false, bottom: false, left: false, right: false,
            insideHorizontal: false, insideVertical: false, headerBottom: false, firstColumnRight: false,
            headerOnlyBottom: false, headerBottomColor: null, headerBottomWidth: 0, bandOdd: false,
            firstColumnBackground: null, firstColumnTextColor: null, firstColumnNoBand: false,
            firstColumnRightAlign: false, headerBold: false, noHeaderVertical: false,
            firstColumnNoHorizontal: false, leftColor: null, ...values
        });
        const allBorders: any = { // eslint-disable-line
            customBorders: true, top: true, bottom: true, left: true, right: true,
            insideHorizontal: true, insideVertical: true, headerBottom: true, firstColumnRight: true
        };
        const horizontal: any = { // eslint-disable-line
            customBorders: true, top: true, bottom: true, insideHorizontal: true, headerBottom: true
        };
        if (style === PdfGridBuiltinStyle.plainTable1 || style === PdfGridBuiltinStyle.plainTable4) {
            return make({ bandOdd: true });
        }
        if (style === PdfGridBuiltinStyle.plainTable3) {
            return make({ customBorders: true, headerBottom: true, firstColumnRight: true });
        }
        if (style === PdfGridBuiltinStyle.plainTable5) {
            return make({ customBorders: true, headerBottom: true, firstColumnRight: true,
                headerBold: true, firstColumnRightAlign: true, noHeaderVertical: true });
        }
        if (style >= 5 && style <= 53) {
            const family: number = Math.floor((style - 5) / 7) + 1;
            const variant: number = (style - 5) % 7;
            const color: Color = variant === 0 ? black : accent[variant - 1];
            if (family === 1) {
                return make({ ...allBorders, headerBottomColor: color, headerBottomWidth: 1 });
            }
            if (family === 2) {
                return make({ ...allBorders, left: false, right: false, headerOnlyBottom: true, bandOdd: true });
            }
            if (family === 3 || family === 7) {
                return make({ ...allBorders, left: false, headerOnlyBottom: true, firstColumnRightAlign: true,
                    firstColumnNoHorizontal: family === 3 });
            }
            if (family === 4) {
                return make({ bandOdd: true });
            }
            if (family === 5) {
                return make({ bandOdd: true, firstColumnBackground: color, firstColumnTextColor: white });
            }
            return make({ bandOdd: true });
        }
        if (style >= 54 && style <= 102) {
            const family: number = Math.floor((style - 54) / 7) + 1;
            if (family === 1) {
                return make({ customBorders: true, headerBottom: true });
            }
            if (family === 2) {
                return make({ ...horizontal, bandOdd: true });
            }
            if (family === 3) {
                return make({ ...horizontal, left: true, right: true });
            }
            if (family === 4) {
                return make({ ...horizontal, left: true, right: true, bandOdd: true });
            }
            if (family === 5) {
                const variant5: number = (style - 54) % 7;
                return make({
                    ...horizontal, left: true, firstColumnRight: true,
                    leftColor: variant5 === 0 ? black : accent[variant5 - 1]
                });
            }
            if (family === 6) {
                return make({ customBorders: true, top: true, headerBottom: true, bottom: true, bandOdd: true });
            }
            return make({ customBorders: true, firstColumnRight: true, bandOdd: true, firstColumnRightAlign: true,
                firstColumnNoBand: true, leftColor: style === 96 ? black : darkAccentColors[style - 97] });
        }
        return null;
    }
    /**
     * Returns the built-in rules of this grid, or null when no built-in style is applied.
     *
     * @private
     * @returns {_PdfBuiltInRules} The rules or null.
     */
    _getBuiltInRules(): _PdfBuiltInRules {
        return (typeof this._builtInStyle === 'number') ? this._resolveBuiltInRules(this._builtInStyle) : null;
    }
    /**
     * Determines whether a data row receives the banded fill of the built-in style.
     *
     * @private
     * @param {number} rowIndex The row index within header and body rows.
     * @param {number} headerCount The number of header rows.
     * @param {boolean} isHeader Indicates whether the row is a header row.
     * @returns {boolean} True when the row is banded.
     */
    _isBuiltInBandedRow(rowIndex: number, headerCount: number, isHeader: boolean): boolean {
        if (isHeader) {
            return false;
        }
        const rules: _PdfBuiltInRules = this._getBuiltInRules();
        return (rowIndex - headerCount) % 2 === (rules && rules.bandOdd ? 0 : 1);
    }
    /**
     * Resolves the font, brush and horizontal alignment used to draw a cell's text, including built-in style rules.
     *
     * @private
     * @param {PdfTextProperties} textProperties The merged text properties of the cell.
     * @param {boolean} isHeader Indicates whether the cell is in a header row.
     * @param {number} colIndex The column index of the cell.
     * @param {_PdfBuiltInDescriptor} descriptor The built-in style descriptor or null.
     * @returns {object} The font, brush and alignment.
     */
    _resolveBuiltInText(textProperties: PdfTextProperties, isHeader: boolean, colIndex: number,
                        descriptor: _PdfBuiltInDescriptor): { font: PdfFont; brush: PdfBrush; alignment: PdfTextAlignment } {
        const rules: _PdfBuiltInRules = this._getBuiltInRules();
        const extra: _PdfBuiltInDescriptor & { bodyTextColor?: { r: number; g: number; b: number } } = descriptor;
        let font: PdfFont = textProperties.font || this._defaultFont;
        if (!textProperties.font && isHeader && rules && rules.headerBold) {
            font = new PdfStandardFont(PdfFontFamily.helvetica, 9, PdfFontStyle.bold);
        }
        let color: { r: number; g: number; b: number } = null;
        if (isHeader && descriptor !== null && descriptor.headerTextColor !== null) {
            color = descriptor.headerTextColor;
        } else if (!isHeader && colIndex === 0 && rules && rules.firstColumnTextColor) {
            color = rules.firstColumnTextColor;
        } else if (!isHeader && extra && extra.bodyTextColor) {
            color = extra.bodyTextColor;
        }
        const brush: PdfBrush = textProperties.color || (color ? new PdfBrush(color) : null) || this._defaultTextBrush;
        let alignment: PdfTextAlignment = this._mapHorizontalAlignment(textProperties.horizontalAlignment);
        if (typeof textProperties.horizontalAlignment === 'undefined' && !isHeader && colIndex === 0 &&
            rules && rules.firstColumnRightAlign) {
            alignment = PdfTextAlignment.right;
        }
        return { font, brush, alignment };
    }
    /**
     * Validates a single cell value. Accepts string, boolean, null, undefined, finite number, and PdfImage.
     * Rejects non-finite numbers (NaN, ±Infinity), plain objects, functions, symbols, and cyclic values.
     *
     * @private
     * @param {any} value The cell value to validate.
     * @returns {void} Nothing.
     */
    _validateCellValue(value: any): void { // eslint-disable-line
        if (value === null || typeof value === 'undefined' || typeof value === 'string' || typeof value === 'boolean') {
            return;
        }
        if (typeof value === 'number') {
            if (!Number.isFinite(value)) {
                throw new Error('Cell value numbers must be finite; NaN and Infinity are not supported.');
            }
            return;
        }
        if (value instanceof PdfImage) {
            return;
        }
    }
    /**
     * Converts a cell value to its string representation.
     *
     * @private
     * @param {any} value The cell value to convert.
     * @returns {string} The string representation of the cell value.
     */
    _getCellText(value: any): string { // eslint-disable-line
        if (value === null || typeof value === 'undefined' || value instanceof PdfImage) {
            return '';
        }
        const valueType: string = typeof value;
        if (valueType === 'string' || valueType === 'boolean' || valueType === 'number') {
            return String(value);
        }
        return '';
    }
    /**
     * Validates every entry in the caller-supplied column-width map.
     *
     * @private
     * @param {Map<number, number>} widthMap The column-width map to validate.
     * @param {number} columnsCount The logical column count that determines valid key range.
     * @returns {void} Nothing.
     */
    _validateColumnWidthMap(widthMap: Map<number, number>, columnsCount: number): void {
        widthMap.forEach((value: number, key: number) => {
            if (typeof key !== 'number' || !Number.isFinite(key) || Math.floor(key) !== key ||
                key < 0 || key >= columnsCount) {
                throw new Error(`columnWidths key ${String(key)} is invalid; keys must be integers in the range 0..${columnsCount - 1}.`);
            }
            if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
                throw new Error(`columnWidths value for key ${key} is invalid; values must be finite positive numbers.`);
            }
        });
    }
    /**
     * Validates each column descriptor's `field` before any internal model is created.
     *
     * @private
     * @param {PdfColumnInformation[]} columns The caller-supplied column descriptors.
     * @returns {void} Nothing.
     */
    _validateColumnFields(columns: PdfColumnInformation[]): void {
        const seenFields: Set<string> = new Set<string>();
        columns.forEach((column: PdfColumnInformation) => {
            const field: any = column ? column.field : undefined; // eslint-disable-line
            if (typeof field !== 'string' || field.trim().length === 0) {
                throw new Error('PdfColumnInformation.field must be a non-empty, non-whitespace string.');
            }
            if (field.indexOf('.') !== -1) {
                throw new Error('Nested property paths are not supported for PdfColumnInformation.field.');
            }
            if (seenFields.has(field)) {
                throw new Error(`Duplicate PdfColumnInformation.field value: '${field}'.`);
            }
            seenFields.add(field);
        });
    }
    /**
     * Constructs the internal model from an explicit row and column structure.
     *
     * @private
     * @param {number} columnsCount The caller-supplied logical column count.
     * @param {Map<number, number>} columnWidths The caller-supplied column-width map.
     * @param {PdfGridRow[]} records The caller-supplied record rows.
     * @param {PdfGridRow[]} headers The optional caller-supplied header rows.
     * @param {PdfGridStyle} style The optional caller-supplied grid-level style.
     * @param {PdfGridBuiltinStyle} builtInStyle The optional caller-supplied built-in style.
     * @returns {void} Nothing.
     */
    _constructFromExplicitStructure(columnsCount: number, columnWidths: Map<number, number>, records: PdfGridRow[],
                                    headers?: PdfGridRow[], style?: PdfGridStyle, builtInStyle?: PdfGridBuiltinStyle): void {
        if (typeof columnsCount !== 'number' || !isFinite(columnsCount) || columnsCount <= 0 || Math.floor(columnsCount) !== columnsCount) {
            throw new Error('columnsCount must be a positive finite integer.');
        }
        if (!(columnWidths instanceof Map)) {
            throw new Error('columnWidths must be a Map<number, number>.');
        }
        if (!Array.isArray(records)) {
            throw new Error('records must be an array.');
        }
        this._validateColumnWidthMap(columnWidths, columnsCount);
        this._validateBuiltInStyle(builtInStyle);
        records.forEach((row: PdfGridRow) => this._validateRowOccupancy(row, columnsCount));
        if (Array.isArray(headers)) {
            headers.forEach((row: PdfGridRow) => this._validateRowOccupancy(row, columnsCount));
            this._validateHeaderSpanBoundary(headers);
            this._validateSpanOverlap(headers, columnsCount);
        }
        this._validateSpanOverlap(records, columnsCount);
        this._isDataSourceGrid = false;
        this._numberOfColumns = columnsCount;
        const entries: [number, number][] = [];
        columnWidths.forEach((value: number, key: number) => {
            entries.push([key, value]);
        });
        this._columnWidths = new Map<number, number>(entries);
        this._records = records.map((row: PdfGridRow) => this._cloneRow(row));
        this._headers = Array.isArray(headers) ? headers.map((row: PdfGridRow) => this._cloneRow(row)) : [];
        this._style = style ? this._cloneStyle(style) : {};
        this._initializeBorderMode(this._style);
        this._builtInStyle = builtInStyle;
    }
    /**
     * Validates that an explicit row's cells have valid span values and that the row fits within
     * the grid's logical column count. Rejects invalid span values (non-integer, <= 0, non-finite,
     * non-number) and column spans that exceed the remaining columns from their start position.
     *
     * @private
     * @param {PdfGridRow} row The row to validate.
     * @param {number} numberOfColumns The logical column count to validate against.
     * @returns {void} Nothing.
     */
    _validateRowOccupancy(row: PdfGridRow, numberOfColumns: number): void {
        if (!row || !Array.isArray(row.cells) || row.cells.length === 0) {
            throw new Error('PdfGridRow.cells must be a non-empty array.');
        }
        let visualPositions: number = 0;
        row.cells.forEach((cell: PdfGridCell) => {
            if (cell && cell.style) {
                if (typeof cell.style.columnSpan !== 'undefined') {
                    const cs: any = cell.style.columnSpan; // eslint-disable-line
                    if (typeof cs !== 'number' || !Number.isFinite(cs as number) ||
                        Math.floor(cs as number) !== cs || (cs as number) < 1) {
                        throw new Error('columnSpan must be a finite integer greater than or equal to 1.');
                    }
                }
                if (typeof cell.style.rowSpan !== 'undefined') {
                    const rs: any = cell.style.rowSpan; // eslint-disable-line
                    if (typeof rs !== 'number' || !Number.isFinite(rs as number) ||
                        Math.floor(rs as number) !== rs || (rs as number) < 1) {
                        throw new Error('rowSpan must be a finite integer greater than or equal to 1.');
                    }
                }
            }
            this._validateCellValue(cell ? cell.value : undefined);
            const colSpan: number = (cell && cell.style && typeof cell.style.columnSpan === 'number') ? (cell.style.columnSpan as number) : 1;
            visualPositions += colSpan;
        });
        if (visualPositions > numberOfColumns) {
            throw new Error(`PdfGridRow requires ${visualPositions} visual positions, exceeding numberOfColumns (${numberOfColumns}).`);
        }
    }
    /**
     * Validates that a section of rows (all headers or all records) contains no overlapping span regions.
     * Throws immediately when any cell's span region covers a position already owned by a previous cell.
     *
     * @private
     * @param {PdfGridRow[]} rows The section rows to validate (headers or records only, not mixed).
     * @param {number} numberOfColumns The logical column count.
     * @returns {void} Nothing.
     */
    _validateSpanOverlap(rows: PdfGridRow[], numberOfColumns: number): void {
        const occupied: boolean[][] = rows.map(() => new Array(numberOfColumns).fill(false) as boolean[]);
        rows.forEach((row: PdfGridRow, rowIndex: number) => {
            let colCursor: number = 0;
            row.cells.forEach((cell: PdfGridCell) => {
                while (colCursor < numberOfColumns && occupied[rowIndex as number][colCursor as number]) {
                    colCursor++;
                }
                if (colCursor >= numberOfColumns) {
                    return;
                }
                const cs: number = (cell && cell.style && typeof cell.style.columnSpan === 'number') ? (cell.style.columnSpan as number) : 1;
                const rs: number = (cell && cell.style && typeof cell.style.rowSpan === 'number') ? (cell.style.rowSpan as number) : 1;
                for (let dr: number = 0; dr < rs; dr++) {
                    for (let dc: number = 0; dc < cs; dc++) {
                        const targetRow: number = rowIndex + dr;
                        const targetCol: number = colCursor + dc;
                        if (targetRow >= rows.length || targetCol >= numberOfColumns) {
                            throw new Error('A cell span extends beyond the grid boundary.');
                        }
                        if (dr === 0 && dc === 0) {
                            continue;
                        }
                        if (occupied[targetRow as number][targetCol as number]) {
                            throw new Error('Overlapping cell spans detected.');
                        }
                        occupied[targetRow as number][targetCol as number] = true;
                    }
                }
                colCursor += cs;
            });
        });
    }
    /**
     * Validates that no header row's rowSpan extends into the records section.
     *
     * @private
     * @param {PdfGridRow[]} headers The header rows.
     * @returns {void} Nothing.
     */
    _validateHeaderSpanBoundary(headers: PdfGridRow[]): void {
        const headerCount: number = headers.length;
        headers.forEach((row: PdfGridRow, rowIndex: number) => {
            row.cells.forEach((cell: PdfGridCell) => {
                const rs: number = (cell && cell.style && typeof cell.style.rowSpan === 'number') ? (cell.style.rowSpan as number) : 1;
                if (rowIndex + rs > headerCount) {
                    throw new Error('A header row span extends into the record section.');
                }
            });
        });
    }
    /**
     * Builds the generated header row from the normalized data-source column descriptors.
     *
     * @private
     * @returns {PdfGridRow} The generated header row.
     */
    _buildGeneratedHeaderRow(): PdfGridRow {
        const cells: PdfGridCell[] = this._columns.map((column: PdfColumnInformation) => {
            const cell: PdfGridCell = { value: (typeof column.headerText === 'string') ? column.headerText : column.field };
            if (column.style) {
                cell.style = this._cloneStyle(column.style);
            }
            return cell;
        });
        return { cells: cells };
    }
    /**
     * Builds one generated record row from a data-source record.
     *
     * @private
     * @param {object} record The source record.
     * @returns {PdfGridRow} The generated record row.
     */
    _buildGeneratedRecordRow(record: object): PdfGridRow {
        const cells: PdfGridCell[] = this._columns.map((column: PdfColumnInformation) => {
            const value: any = record ? (record as Record<string, any>)[column.field] : undefined;  // eslint-disable-line
            const cell: PdfGridCell = { value: value };
            if (column.style) {
                cell.style = this._cloneStyle(column.style);
            }
            return cell;
        });
        return { cells: cells };
    }
    /**
     * Creates a defensive clone of a caller-owned row so later caller mutation does not affect the grid.
     *
     * @private
     * @param {PdfGridRow} row The caller-owned row to clone.
     * @returns {PdfGridRow} The cloned row.
     */
    _cloneRow(row: PdfGridRow): PdfGridRow {
        const cells: PdfGridCell[] = Array.isArray(row.cells) ? row.cells.map((cell: PdfGridCell) => {
            return {
                value: cell.value, style: cell.style ? this._cloneStyle(cell.style) : undefined,
                link: cell.link ? { ...cell.link } : undefined
            };
        }) : [];
        return {
            height: row.height, style: row.style ? this._cloneStyle(row.style) : undefined,
            cells: cells
        };
    }
    /**
     * Creates a defensive clone of a grid or column style.
     *
     * @private
     * @param {PdfGridStyle} style The grid style to clone.
     * @returns {PdfGridStyle} The cloned grid style.
     */
    _cloneStyle(style: PdfGridStyle): PdfGridStyle;
    /**
     * Creates a defensive clone of a column style.
     *
     * @private
     * @param {PdfGridColumnStyle} style The column style to clone.
     * @returns {PdfGridColumnStyle} The cloned column style.
     */
    _cloneStyle(style: PdfGridColumnStyle): PdfGridColumnStyle;
    _cloneStyle(style: PdfGridStyle | PdfGridColumnStyle): PdfGridStyle | PdfGridColumnStyle {
        const clone: PdfGridStyle | PdfGridColumnStyle = { ...style };
        const source: PdfGridStyle = style as PdfGridStyle;
        const target: PdfGridStyle = clone as PdfGridStyle;
        if (typeof source.space !== 'undefined') {
            target.space = source.space;
        }
        if (source.padding) {
            target.padding = { ...source.padding };
        }
        if (source.border && !this._isPdfPen(source.border as any)) { // eslint-disable-line
            const border: any = source.border as any; // eslint-disable-line
            const pen: any = border.pen ? border.pen : border; // eslint-disable-line
            const clonedPen: any = { ...pen }; // eslint-disable-line
            if (pen && pen.left) {
                clonedPen.left = { ...pen.left };
                if (Array.isArray(pen.left.dashPattern)) {
                    clonedPen.left.dashPattern = pen.left.dashPattern.slice();
                }
            }
            if (pen && pen.right) {
                clonedPen.right = { ...pen.right };
                if (Array.isArray(pen.right.dashPattern)) {
                    clonedPen.right.dashPattern = pen.right.dashPattern.slice();
                }
            }
            if (pen && pen.top) {
                clonedPen.top = { ...pen.top };
                if (Array.isArray(pen.top.dashPattern)) {
                    clonedPen.top.dashPattern = pen.top.dashPattern.slice();
                }
            }
            if (pen && pen.bottom) {
                clonedPen.bottom = { ...pen.bottom };
                if (Array.isArray(pen.bottom.dashPattern)) {
                    clonedPen.bottom.dashPattern = pen.bottom.dashPattern.slice();
                }
            }
            target.border = (border.pen ? { ...border, pen: clonedPen } : clonedPen) as any; // eslint-disable-line
        }
        if (source.textProperties) {
            target.textProperties = { ...source.textProperties };
        }
        if (source.imageProperties) {
            target.imageProperties = { ...source.imageProperties };
        }
        if (source.background) {
            if (this._isBackgroundImage(source.background)) {
                target.background = {
                    image: source.background.image,
                    imageProperties: source.background.imageProperties ?
                        { ...source.background.imageProperties } : undefined
                };
            } else {
                target.background = source.background;
            }
        }
        return clone;
    }
    /**
     * Resolves the style for a column at the specified index.
     *
     * @private
     * @param {number} colIndex The column index to resolve the style for.
     * @returns {PdfGridColumnStyle} The column style or undefined if not found.
     */
    _resolveColumnStyle(colIndex: number): PdfGridColumnStyle {
        if (!this._isDataSourceGrid || colIndex < 0 || colIndex >= this._columns.length) {
            return undefined;
        }
        const column: PdfColumnInformation = this._columns[colIndex as number];
        return column ? column.style : undefined;
    }
    /**
     * Resolves text properties by merging properties from grid, column, row, and cell levels.
     *
     * @private
     * @param {PdfGridCell} cell The grid cell to resolve properties for.
     * @param {PdfGridRow} row The grid row to resolve properties for.
     * @param {number} colIndex The column index for resolving column-level properties.
     * @returns {PdfTextProperties} The merged text properties.
     */
    _resolveTextProperties(cell: PdfGridCell, row: PdfGridRow, colIndex: number): PdfTextProperties {
        const gridProperties: PdfTextProperties = this._style.textProperties || {};
        const columnStyle: PdfGridColumnStyle = this._resolveColumnStyle(colIndex);
        const columnProperties: PdfTextProperties = columnStyle && columnStyle.textProperties ? columnStyle.textProperties : {};
        const rowProperties: PdfTextProperties = row.style && row.style.textProperties ? row.style.textProperties : {};
        const cellProperties: PdfTextProperties = cell.style && cell.style.textProperties ? cell.style.textProperties : {};
        return { ...gridProperties, ...columnProperties, ...rowProperties, ...cellProperties };
    }
    /**
     * Resolves image properties by merging properties from grid, column, row, and cell levels.
     *
     * @private
     * @param {PdfGridCell} cell The grid cell to resolve properties for.
     * @param {PdfGridRow} row The grid row to resolve properties for.
     * @param {number} colIndex The column index for resolving column-level properties.
     * @returns {PdfImageProperties} The merged image properties.
     */
    _resolveImageProperties(cell: PdfGridCell, row: PdfGridRow, colIndex: number): PdfImageProperties {
        const gridProperties: PdfImageProperties = this._style.imageProperties || {};
        const columnStyle: PdfGridColumnStyle = this._resolveColumnStyle(colIndex);
        const columnProperties: PdfImageProperties = columnStyle && columnStyle.imageProperties ? columnStyle.imageProperties : {};
        const rowProperties: PdfImageProperties = row.style && row.style.imageProperties ? row.style.imageProperties : {};
        const cellProperties: PdfImageProperties = cell.style && cell.style.imageProperties ? cell.style.imageProperties : {};
        return { ...gridProperties, ...columnProperties, ...rowProperties, ...cellProperties };
    }
    /**
     * Determines if a background value is a PdfBackgroundImage.
     *
     * @private
     * @param {PdfBrush | PdfBackgroundImage} bg The background value to check.
     * @returns {boolean} True if the background is a PdfBackgroundImage, false otherwise.
     */
    _isBackgroundImage(bg: PdfBrush | PdfBackgroundImage): bg is PdfBackgroundImage {
        return bg !== null && typeof bg === 'object' && 'image' in bg;
    }
    /**
     * Resolves the background (brush or image) by checking cell, row, column, and grid levels in priority order.
     *
     * @private
     * @param {PdfGridCell} cell The grid cell to resolve the background for.
     * @param {PdfGridRow} row The grid row to resolve the background for.
     * @param {number} colIndex The column index for resolving column-level background.
     * @returns {PdfBrush | PdfBackgroundImage} The resolved background (brush or image) or undefined if not found.
     */
    _resolveBackground(cell: PdfGridCell, row: PdfGridRow, colIndex: number): PdfBrush | PdfBackgroundImage {
        const cellBg: PdfBrush | PdfBackgroundImage = cell.style ? cell.style.background : undefined;
        if (cellBg) {
            return cellBg;
        }
        const rowBg: PdfBrush | PdfBackgroundImage = row.style ? row.style.background : undefined;
        if (rowBg) {
            return rowBg;
        }
        const colStyle: PdfGridColumnStyle = this._resolveColumnStyle(colIndex);
        const colBg: PdfBrush | PdfBackgroundImage = colStyle ? colStyle.background : undefined;
        if (colBg) {
            return colBg;
        }
        return this._style.background;
    }
    /**
     * Checks if the grid style indicates that borders should be drawn inside the cell bounds.
     *
     * @private
     * @returns {boolean} True if the border overlap style is set to 1, false otherwise.
     */
    _isInsideBorderOverlap(): boolean {
        const style: PdfGridStyle & { borderOverlapStyle?: number; boderOverlapStyle?: number } =
            this._style as PdfGridStyle & { borderOverlapStyle?: number; boderOverlapStyle?: number };
        const value: number = typeof style.borderOverlapStyle === 'number'
            ? style.borderOverlapStyle
            : style.boderOverlapStyle;
        return value === 1;
    }
    /**
     * Adjusts border bounds by inset if inside border overlap is enabled.
     *
     * @private
     * @param {Rectangle} bounds The original bounds to adjust.
     * @param {PdfPen} border The pen defining the border width.
     * @returns {Rectangle} The adjusted bounds or original bounds if inside border overlap is disabled.
     */
    _resolveBorderBounds(bounds: Rectangle, border: PdfPen): Rectangle {
        if (!this._isInsideBorderOverlap()) {
            return bounds;
        }
        const inset: number = Math.max(border.width, 0) / 2;
        return {
            x: bounds.x + inset,
            y: bounds.y + inset,
            width: Math.max(bounds.width - (inset * 2), 0),
            height: Math.max(bounds.height - (inset * 2), 0)
        };
    }
    /**
     * Validates that a grid row is a valid PdfGridRow object with a non-empty cell array that doesn't exceed the column count.
     *
     * @private
     * @param {PdfGridRow} gridRow The row to validate.
     * @returns {void} Nothing.
     * @throws {Error} If the row is invalid or cell count exceeds numberOfColumns.
     */
    /**
     * Collects all PdfGrid instances referenced as cell values across all rows (headers + records)
     * of this grid and all descendant grids, returning them in a flat set along with row/col context.
     *
     * @private
     * @param {PdfGridRow[]} rows Rows to scan.
     * @returns {Array<{grid: PdfGrid, rowIndex: number, colIndex: number}>} Nested grid references found.
     */
    _collectNestedGridRefs(rows: PdfGridRow[]): Array<{ grid: PdfGrid; rowIndex: number; colIndex: number }> {
        const refs: Array<{ grid: PdfGrid; rowIndex: number; colIndex: number }> = [];
        rows.forEach((row: PdfGridRow, rowIndex: number) => {
            let colIndex: number = 0;
            row.cells.forEach((cell: PdfGridCell) => {
                if (cell.value instanceof PdfGrid) {
                    refs.push({ grid: cell.value, rowIndex, colIndex });
                }
                const cs: number = (cell.style && typeof cell.style.columnSpan === 'number') ? cell.style.columnSpan : 1;
                colIndex += cs;
            });
        });
        return refs;
    }
    /**
     * Detects direct and indirect reference cycles in the nested grid tree starting at this grid.
     * Throws a deterministic cycle-detection error identifying the row and column indices of the
     * closing reference before any page modification.
     *
     * @private
     * @param {Set<PdfGrid>} ancestors The set of ancestor grids in the current traversal path.
     * @returns {void} Nothing.
     * @throws {Error} If a cycle is detected.
     */
    _detectCycles(ancestors: PdfGrid[]): void {
        const allRows: PdfGridRow[] = this._headers.concat(this._records);
        const refs: Array<{ grid: PdfGrid; rowIndex: number; colIndex: number }> = this._collectNestedGridRefs(allRows);
        refs.forEach((ref: { grid: PdfGrid; rowIndex: number; colIndex: number }) => {
            if (ancestors.indexOf(ref.grid) !== -1) {
                throw new Error(
                    'PdfGrid cycle detected creates a circular reference in the grid tree.'
                );
            }
            const next: PdfGrid[] = ancestors.concat([ref.grid]);
            ref.grid._detectCycles(next);
        });
    }
    /**
     * Enforces the maximum nesting depth for all nested grids in this grid's tree.
     * Throws a deterministic oversized-depth error before rendering when the depth is exceeded.
     *
     * @private
     * @param {number} currentDepth The current nesting depth (0 = root).
     * @param {number} maximumDepth The maximum permitted depth.
     * @returns {void} Nothing.
     * @throws {Error} If the maximum depth is exceeded.
     */
    _enforceMaxDepth(currentDepth: number, maximumDepth: number): void {
        if (currentDepth > maximumDepth) {
            throw new Error(
                `PdfGrid nesting depth ${currentDepth} exceeds the configured maximum depth of ${maximumDepth}.`
            );
        }
        const allRows: PdfGridRow[] = this._headers.concat(this._records);
        const refs: Array<{ grid: PdfGrid; rowIndex: number; colIndex: number }> = this._collectNestedGridRefs(allRows);
        refs.forEach((ref: { grid: PdfGrid; rowIndex: number; colIndex: number }) => {
            ref.grid._enforceMaxDepth(currentDepth + 1, maximumDepth);
        });
    }
    /**
     * Detects when the same PdfGrid instance is used as the value of two different cells in the
     * same layout pass. Throws a deterministic ownership-conflict error before any page modification.
     *
     * @private
     * @param {Set<PdfGrid>} seen The set of PdfGrid instances already encountered in this pass.
     * @returns {void} Nothing.
     * @throws {Error} If a duplicate ownership conflict is detected.
     */
    _detectDuplicateOwnership(seen: PdfGrid[]): void {
        const allRows: PdfGridRow[] = this._headers.concat(this._records);
        const refs: Array<{ grid: PdfGrid; rowIndex: number; colIndex: number }> = this._collectNestedGridRefs(allRows);
        refs.forEach((ref: { grid: PdfGrid; rowIndex: number; colIndex: number }) => {
            if (seen.indexOf(ref.grid) !== -1) {
                throw new Error(
                    'PdfGrid ownership conflict: the same nested PdfGrid instance is referenced by multiple cells'
                );
            }
            seen.push(ref.grid);
            ref.grid._detectDuplicateOwnership(seen);
        });
    }
    /**
     * Validates all nested grid cell values across the entire tree before any page modification.
     * Performs: null/destroyed instance guard, cycle detection, max-depth enforcement, and duplicate-ownership detection.
     *
     * @private
     * @param {number} maximumDepth The maximum permitted nesting depth. Defaults to 8.
     * @returns {void} Nothing.
     * @throws {Error} If any validation fails.
     */
    _validateNestedGridTree(maximumDepth: number = 8): void {
        this._detectCycles([this]);
        this._enforceMaxDepth(0, maximumDepth);
        this._detectDuplicateOwnership([this]);
    }
    _validateRow(gridRow: PdfGridRow): void {
        if (!gridRow || typeof gridRow !== 'object') {
            throw new Error('gridRow must be a valid PdfGridRow object.');
        }
        if (!Array.isArray(gridRow.cells) || gridRow.cells.length === 0) {
            throw new Error('gridRow.cells must be a non-empty array.');
        }
        if (gridRow.cells.length > this._numberOfColumns) {
            throw new Error(`PdfGridRow requires ${gridRow.cells.length} visual positions,
                exceeding numberOfColumns (${this._numberOfColumns}).`);
        }
    }
    /**
     * Validates that a Rectangle supplied to a graphics-based draw overload has positive, finite dimensions.
     * Throws before any rendering if any field is non-finite, or if width/height is <= 0.
     *
     * @private
     * @param {Rectangle} bounds The bounds to validate.
     * @returns {void} Nothing.
     */
    _validateGraphicsBounds(bounds: Rectangle): void {
        const fields: Array<keyof Rectangle> = ['x', 'y', 'width', 'height'];
        fields.forEach((field: keyof Rectangle) => {
            const v: number = bounds[field as keyof Rectangle] as number;
            if (typeof v !== 'number' || !isFinite(v) || isNaN(v)) {
                throw new Error(`PdfGrid draw: bounds.${field} must be a finite number; received ${v}.`);
            }
        });
        if (bounds.width <= 0) {
            throw new Error(`PdfGrid draw: bounds.width must be greater than 0; received ${bounds.width}.`);
        }
        if (bounds.height <= 0) {
            throw new Error(`PdfGrid draw: bounds.height must be greater than 0; received ${bounds.height}.`);
        }
    }
    /**
     * Validates that a Point supplied to a graphics-based draw overload has finite coordinates.
     * Throws before any rendering if any coordinate is non-finite.
     *
     * @private
     * @param {Point} location The location to validate.
     * @returns {void} Nothing.
     */
    _validateGraphicsLocation(location: Point): void {
        const coords: Array<keyof Point> = ['x', 'y'];
        coords.forEach((coord: keyof Point) => {
            const v: number = location[coord as keyof Point] as number;
            if (typeof v !== 'number' || !isFinite(v) || isNaN(v)) {
                throw new Error(`PdfGrid draw: location.${coord} must be a finite number; received ${v}.`);
            }
        });
    }
    /**
     * Validates the grid drawing bounds against the page client size.
     *
     * @private
     * @param {Rectangle} bounds Grid drawing bounds.
     * @param {{ width: number, height: number }} pageClientSize Page client size.
     * @param {number} pageClientSize.width Page client width.
     * @param {number} pageClientSize.height Page client height.
     * @returns {void}
     * @throws {Error} Throws if the bounds are invalid or exceed the page drawable area.
     */
    _validatePageBounds(bounds: Rectangle, pageClientSize: { width: number; height: number }): void {
        const fields: Array<keyof Rectangle> = ['x', 'y', 'width', 'height'];
        fields.forEach((field: keyof Rectangle) => {
            const v: number = bounds[field as keyof Rectangle] as number;
            if (typeof v !== 'number' || !Number.isFinite(v) || isNaN(v)) {
                throw new Error(`PdfGrid draw: bounds.${field} must be a finite number; received ${String(v)}.`);
            }
        });
        if (bounds.width <= 0) {
            throw new Error(`PdfGrid draw: bounds.width must be greater than 0; received ${bounds.width}.`);
        }
        if (bounds.height <= 0) {
            throw new Error(`PdfGrid draw: bounds.height must be greater than 0; received ${bounds.height}.`);
        }
        if (bounds.x < 0 || bounds.y < 0) {
            throw new Error(`PdfGrid draw: bounds coordinates must be non-negative; received x=${bounds.x}, y=${bounds.y}.`);
        }
        if (bounds.x >= pageClientSize.width || bounds.y >= pageClientSize.height) {
            throw new Error(`PdfGrid draw: bounds origin is outside the page drawable area (${pageClientSize.width} x ${pageClientSize.height}); received x=${bounds.x}, y=${bounds.y}.`);
        }
        if (bounds.y + bounds.height > pageClientSize.height) {
            throw new Error(`PdfGrid draw: bounds height exceeds the page drawable area (${pageClientSize.width} x ${pageClientSize.height}); received x=${bounds.x}, y=${bounds.y}, width=${bounds.width}, height=${bounds.height}.`);
        }
    }
    /**
     * Validates a grid drawing location against the page client size.
     *
     * @private
     * @param {Point} location Grid drawing location.
     * @param {{ width: number, height: number }} pageClientSize Page client size.
     * @param {number} pageClientSize.width Page client width.
     * @param {number} pageClientSize.height Page client height.
     * @returns {void}
     * @throws {Error} Throws if the location is invalid or outside the page drawable area.
     */
    _validatePageLocation(location: Point, pageClientSize: { width: number; height: number }): void {
        const coords: Array<keyof Point> = ['x', 'y'];
        coords.forEach((coord: keyof Point) => {
            const v: number = location[coord as keyof Point] as number;
            if (typeof v !== 'number' || !Number.isFinite(v) || isNaN(v)) {
                throw new Error(`PdfGrid draw: location.${coord} must be a finite number; received ${String(v)}.`);
            }
        });
        if (location.x < 0 || location.y < 0) {
            throw new Error(`PdfGrid draw: location coordinates must be non-negative; received x=${location.x}, y=${location.y}.`);
        }
        if (location.x >= pageClientSize.width || location.y >= pageClientSize.height) {
            throw new Error(`PdfGrid draw: location is outside the drawable area (${pageClientSize.width} x ${pageClientSize.height}); received x=${location.x}, y=${location.y}.`);
        }
        const availableWidth: number = pageClientSize.width - location.x;
        const availableHeight: number = pageClientSize.height - location.y;
        if (availableWidth <= 0 || availableHeight <= 0) {
            throw new Error(`PdfGrid draw: location leaves no positive drawable area; available width=${availableWidth}, height=${availableHeight}.`);
        }
    }
    /**
     * Validates that grid cells do not contain conflicting hyperlink definitions.
     *
     * @private
     * @param {PdfGridRow[]} allRows Grid rows to validate.
     * @returns {void}
     * @throws {Error} Throws if a cell contains both a text-derived hyperlink and an explicit link.
     */
    _validateCellLinks(allRows: PdfGridRow[]): void {
        for (let ri: number = 0; ri < allRows.length; ri++) {
            const row: PdfGridRow = allRows[ri as number];
            for (let ci: number = 0; ci < row.cells.length; ci++) {
                const cell: PdfGridCell = row.cells[ci as number];
                const hasExplicitLink: boolean = typeof cell.link !== 'undefined';
                const hasTextDerivedLink: boolean = typeof cell.value === 'string' && _isTextDerivedHyperlink(cell.value as string);
                if (hasExplicitLink && hasTextDerivedLink) {
                    throw new Error('PdfGrid: A cell cannot contain both a text-derived hyperlink and an explicit PdfLink. Remove either the cell link or use a non-URL value.');
                }
            }
        }
    }
    /**
     * Validates that nested grids are not placed in covered span positions.
     * Checks column-span and row-span coverage and throws before rendering if a nested grid is found in a covered cell.
     *
     * @private
     * @param {PdfGridRow[]} rows Grid rows to validate.
     * @param {number} numberOfColumns Total column count.
     * @returns {void}
     * @throws {Error} Throws if a nested grid is in a covered span position.
     */
    _validateNestedGridSpanPositions(rows: PdfGridRow[], numberOfColumns: number): void {
        const occupied: boolean[][] = rows.map(() => new Array(numberOfColumns).fill(false) as boolean[]);
        for (let rowIndex: number = 0; rowIndex < rows.length; rowIndex++) {
            const row: PdfGridRow = rows[rowIndex as number];
            let colCursor: number = 0;
            for (let cellIndex: number = 0; cellIndex < row.cells.length; cellIndex++) {
                const cell: PdfGridCell = row.cells[cellIndex as number];
                while (colCursor < numberOfColumns && occupied[rowIndex as number][colCursor as number]) {
                    colCursor++;
                }
                if (colCursor >= numberOfColumns) {
                    break;
                }
                const cs: number = (cell.style && typeof cell.style.columnSpan === 'number') ? (cell.style.columnSpan as number) : 1;
                const rs: number = (cell.style && typeof cell.style.rowSpan === 'number') ? (cell.style.rowSpan as number) : 1;
                if (cell.value instanceof PdfGrid && (cs > 1 || rs > 1)) {
                    for (let dr: number = 0; dr < rs; dr++) {
                        for (let dc: number = 0; dc < cs; dc++) {
                            if ((dr > 0 || dc > 0) && (rowIndex + dr < rows.length)) {
                                if (occupied[(rowIndex + dr) as number][(colCursor + dc) as number]) {
                                    throw new Error(`PdfGrid: Nested grid at row ${rowIndex}, column ${colCursor} has span coverage ` +
                                        `(column span ${cs}, row span ${rs}) and is placed in a covered span position.`);
                                }
                            }
                        }
                    }
                }
                for (let dr: number = 0; dr < rs; dr++) {
                    for (let dc: number = 0; dc < cs; dc++) {
                        if (dr === 0 && dc === 0) {
                            continue;
                        }
                        if ((rowIndex + dr) < rows.length) {
                            occupied[(rowIndex + dr) as number][(colCursor + dc) as number] = true;
                        }
                    }
                }
                colCursor += cs;
            }
        }
    }
    /**
     * Creates and adds a link annotation to a PDF page.
     *
     * @private
     * @param {PdfPage} page Page to which the annotation is added.
     * @param {Rectangle} cellBounds Annotation bounds.
     * @param {PdfLink} link Link configuration.
     * @returns {void}
     */
    _createLinkAnnotation(page: PdfPage, cellBounds: Rectangle, link: PdfLink): void {
        if (link.type === PdfLinkType.externalLink) {
            const uri: string = typeof link.uri === 'string' ? link.uri : '';
            const annotation: PdfUriAnnotation = new PdfUriAnnotation(cellBounds, uri);
            page.annotations.add(annotation);
        } else if (link.type === PdfLinkType.file) {
            const fileName: string = typeof link.file === 'string' ? link.file : '';
            const annotation: PdfFileLinkAnnotation = new PdfFileLinkAnnotation(cellBounds, fileName);
            page.annotations.add(annotation);
        } else if (link.type === PdfLinkType.internalLink) {
            const annotation: PdfDocumentLinkAnnotation = new PdfDocumentLinkAnnotation(cellBounds);
            if (link.destination) {
                annotation.destination = link.destination;
            }
            page.annotations.add(annotation);
        }
    }
    /**
     * Prepares grid rows for pagination by splitting rows that exceed the available page height.
     *
     * @private
     * @param {PdfGridRow[]} allRows Grid rows to prepare.
     * @param {number} availableHeight Available page height.
     * @param {PdfLayoutFormat} layoutFormat Grid layout settings.
     * @param {number[]} columnWidths Resolved column widths.
     * @param {_PdfBuiltInDescriptor} descriptor Built-in style descriptor.
     * @returns {PdfGridRow[]} Rows prepared for pagination.
     */
    _prepareRowsForPagination(allRows: PdfGridRow[], availableHeight: number, layoutFormat: PdfLayoutFormat,
                              columnWidths: number[], descriptor: _PdfBuiltInDescriptor): PdfGridRow[] {
        const layoutType: PdfLayoutType = layoutFormat ? layoutFormat.layout : PdfLayoutType.paginate;
        const breakType: PdfLayoutBreakType = layoutFormat ? layoutFormat.break : PdfLayoutBreakType.fitPage;
        if (layoutType !== PdfLayoutType.paginate || breakType !== PdfLayoutBreakType.fitPage) {
            return allRows;
        }
        const headerCount: number = this._headers.length;
        const headerRows: PdfGridRow[] = allRows.slice(0, headerCount);
        const headerHeights: number[] = this._computeRowHeights(headerRows, columnWidths, descriptor);
        const headerHeight: number = this._repeatHeader ? headerHeights.reduce((sum: number, height: number) => sum + height, 0) : 0;
        const fragmentHeight: number = Math.max(availableHeight - headerHeight, 4);
        const result: PdfGridRow[] = headerRows.slice();
        for (let rowIndex: number = headerCount; rowIndex < allRows.length; rowIndex++) {
            const row: PdfGridRow = allRows[rowIndex as number];
            const measuredHeight: number = this._computeRowHeights([row], columnWidths, descriptor)[0];
            if (measuredHeight <= fragmentHeight + 1e-6) {
                result.push(row);
                continue;
            }
            const hasNestedGrid: boolean = row.cells.some((cell: PdfGridCell) => cell.value instanceof PdfGrid);
            if (hasNestedGrid) {
                result.push(row);
                continue;
            }
            const cellChunks: string[][] = [];
            let colCursor: number = 0;
            row.cells.forEach((cell: PdfGridCell) => {
                const columnSpan: number = cell.style && typeof cell.style.columnSpan === 'number' ? cell.style.columnSpan : 1;
                let cellWidth: number = 0;
                for (let index: number = 0; index < columnSpan; index++) {
                    cellWidth += columnWidths[(colCursor + index) as number] || 0;
                }
                const padding: { left: number; right: number; top: number; bottom: number } =
                    this._resolveCellPadding(cell, row, colCursor, descriptor);
                const innerWidth: number = Math.max(cellWidth - padding.left - padding.right, 1);
                const innerHeight: number = Math.max(fragmentHeight - padding.top - padding.bottom, 1);
                cellChunks.push(this._splitCellText(this._getCellText(cell.value), innerWidth, innerHeight,
                                                    this._resolveTextProperties(cell, row, colCursor).font || this._defaultFont));
                colCursor += columnSpan;
            });
            const fragmentCount: number = Math.max(1, ...cellChunks.map((chunks: string[]) => chunks.length));
            for (let fragmentIndex: number = 0; fragmentIndex < fragmentCount; fragmentIndex++) {
                const fragmentCells: PdfGridCell[] = row.cells.map((cell: PdfGridCell, cellIndex: number) => {
                    const cloned: PdfGridCell = { value: '', style: cell.style ? this._cloneStyle(cell.style) : undefined, link: fragmentIndex === 0 && cell.link ? { ...cell.link } : undefined };
                    if (cell.value instanceof PdfImage) {
                        cloned.value = fragmentIndex === 0 ? cell.value : '';
                    } else {
                        cloned.value = cellChunks[cellIndex as number][fragmentIndex as number] || '';
                    }
                    if (cloned.style && typeof cloned.style.rowSpan === 'number') {
                        cloned.style.rowSpan = 1;
                    }
                    return cloned;
                });
                result.push({ style: row.style ? this._cloneStyle(row.style) : undefined, cells: fragmentCells });
            }
        }
        return result;
    }
    /**
     * Splits cell text into chunks that fit within the specified bounds.
     *
     * @private
     * @param {string} text Cell text to split.
     * @param {number} width Available text width.
     * @param {number} height Available text height.
     * @param {PdfFont} font Font used to measure the text.
     * @returns {string[]} Text chunks that fit within the available bounds.
     */
    _splitCellText(text: string, width: number, height: number, font: PdfFont): string[] {
        if (text.length === 0) {
            return [''];
        }
        const chunks: string[] = [];
        let remaining: string = text;
        while (remaining.length > 0) {
            let low: number = 1;
            let high: number = remaining.length;
            let best: number = 1;
            while (low <= high) {
                const middle: number = Math.floor((low + high) / 2);
                const candidate: string = remaining.substring(0, middle);
                const measured: { width: number; height: number } = font.measureString(candidate, width, true);
                if (measured.height <= height + 1e-6) {
                    best = middle;
                    low = middle + 1;
                } else {
                    high = middle - 1;
                }
            }
            if (best < remaining.length) {
                const whitespace: number = remaining.substring(0, best).lastIndexOf(' ');
                if (whitespace > 0) {
                    best = whitespace;
                }
            }
            chunks.push(remaining.substring(0, best).trim());
            remaining = remaining.substring(best).replace(/^\s+/, '');
        }
        return chunks;
    }
    /**
     * Measures the text height available within a grid cell.
     *
     * @private
     * @param {string} text Cell text.
     * @param {PdfFont} font Cell font.
     * @param {number} availableWidth Available cell width.
     * @returns {number} Measured text height.
     */
    _measureCellTextHeight(text: string, font: PdfFont, availableWidth: number): number {
        if (text.length === 0 || availableWidth <= 0) {
            return 0;
        }
        const format: PdfStringFormat = new PdfStringFormat();
        format.complexScript = true;
        const singleLineSize: { width: number; height: number } =
            font.measureString(text, format);
        if (singleLineSize.width <= availableWidth + 1e-6) {
            return singleLineSize.height;
        }
        return font.measureString(text, availableWidth, format).height;
    }
    _computeRowHeights(allRows: PdfGridRow[], columnWidths: number[], descriptor: _PdfBuiltInDescriptor): number[] {
        const rowHeights: number[] = allRows.map((row: PdfGridRow) => {
            if (typeof row.height === 'number') {
                return row.height;
            }
            let maxHeight: number = 0;
            let colCursor: number = 0;
            row.cells.forEach((cell: PdfGridCell) => {
                while (colCursor < this._numberOfColumns) {
                    colCursor++;
                    break;
                }
                const cs: number = (cell.style && typeof cell.style.columnSpan === 'number') ? (cell.style.columnSpan as number) : 1;
                const rs: number = (cell.style && typeof cell.style.rowSpan === 'number') ? (cell.style.rowSpan as number) : 1;
                if (rs === 1) {
                    let cellWidth: number = 0;
                    for (let dc: number = 0; dc < cs; dc++) {
                        cellWidth += columnWidths[(colCursor - 1 + dc) as number] || 0;
                    }
                    const effectivePadding: { left: number; right: number; top: number; bottom: number } =
                        this._resolveCellPadding(cell, row, colCursor - 1, descriptor);
                    const effectiveBorderWidth: number = this._resolveCellBorderWidth(cell, row, colCursor - 1, descriptor);
                    const effectiveSpacing: { left: number; right: number; top: number; bottom: number } =
                        this._resolveCellSpacing(cell, row, colCursor - 1, descriptor);
                    let contentHeight: number = 0;
                    if (cell.value instanceof PdfImage) {
                        this._validateImageCell(cell, colCursor - 1, 0);
                        const image: PdfImage = cell.value;
                        const intrinsicW: number = image.width > 0 ? image.width : 1;
                        const intrinsicH: number = image.height > 0 ? image.height : 1;
                        const ratio: number = intrinsicW / intrinsicH;
                        const imgProps: { width?: number; height?: number; fitType?: number } =
                            (cell.style && cell.style.imageProperties) ? cell.style.imageProperties : {};
                        const hasExplicitW: boolean = typeof imgProps.width === 'number';
                        const hasExplicitH: boolean = typeof imgProps.height === 'number';
                        const fitType: number | undefined = imgProps.fitType;
                        const innerWidth: number = Math.max(cellWidth - effectivePadding.left - effectivePadding.right, 1);
                        if (fitType === 3) {
                            contentHeight = intrinsicH;
                        } else if (hasExplicitW && hasExplicitH) {
                            const boxW: number = Math.min(imgProps.width as number, innerWidth);
                            const boxH: number = imgProps.height as number;
                            if (fitType === 0) {
                                contentHeight = boxW / ratio;
                            } else if (fitType === 1) {
                                contentHeight = boxH;
                            } else if (fitType === 2) {
                                const scaleW: number = boxW / intrinsicW;
                                const scaleH: number = boxH / intrinsicH;
                                contentHeight = intrinsicH * Math.min(scaleW, scaleH);
                            } else {
                                contentHeight = boxH;
                            }
                        } else if (hasExplicitW) {
                            const boxW: number = Math.min(imgProps.width as number, innerWidth);
                            contentHeight = boxW / ratio;
                        } else if (hasExplicitH) {
                            contentHeight = imgProps.height as number;
                        } else if (fitType === 0) {
                            contentHeight = innerWidth / ratio;
                        } else if (fitType === 1) {
                            contentHeight = intrinsicH;
                        } else if (fitType === 2) {
                            const scale: number = innerWidth / intrinsicW;
                            contentHeight = intrinsicH * scale;
                        } else {
                            const scale: number = Math.min(innerWidth / intrinsicW, 1);
                            contentHeight = intrinsicH * scale;
                        }
                    } else if (cell.value instanceof PdfGrid) {
                        const childGrid: PdfGrid = cell.value;
                        const innerWidth: number = Math.max(cellWidth - effectivePadding.left - effectivePadding.right, 1);
                        contentHeight = childGrid._computeTotalGridHeight(innerWidth);
                    } else {
                        const text: string = this._getCellText(cell.value);
                        const innerWidth: number = Math.max(cellWidth - effectivePadding.left - effectivePadding.right, 1);
                        const font: PdfFont = this._resolveTextProperties(cell, row, colCursor - 1).font ||
                            this._defaultFont;
                        contentHeight = this._measureCellTextHeight(text, font, innerWidth);
                    }
                    const required: number = contentHeight + effectivePadding.top + effectivePadding.bottom +
                        effectiveBorderWidth + effectiveSpacing.top + effectiveSpacing.bottom;
                    maxHeight = Math.max(maxHeight, required);
                }
                colCursor += cs - 1;
            });
            return Math.max(maxHeight, 4);
        });
        this._reconcileRowSpanHeights(allRows, columnWidths, rowHeights, descriptor);
        return rowHeights;
    }
    /**
     * Computes the page slices required to render the grid.
     *
     * @private
     * @param {PdfPage} firstPage Initial page.
     * @param {Rectangle} firstBounds Initial drawing bounds.
     * @param {PdfLayoutFormat} layoutFormat Grid layout settings.
     * @param {number[]} columnWidths Resolved column widths.
     * @param {number[]} rowHeights Computed row heights.
     * @param {number[]} nonPaginatedRows Computed nonPaginatedRows.
     * @returns {_PageSlice[]} Computed page slices.
     * @throws {Error} Throws if a row or repeated header cannot fit within the available page height.
     */
    _computeLayout(firstPage: PdfPage, firstBounds: Rectangle, layoutFormat: PdfLayoutFormat, columnWidths: number[],
                   rowHeights: number[], nonPaginatedRows?: number[]): _PageSlice[] {
        const layoutType: PdfLayoutType = layoutFormat ? layoutFormat.layout : PdfLayoutType.paginate;
        const breakType: PdfLayoutBreakType = layoutFormat ? layoutFormat.break : PdfLayoutBreakType.fitPage;
        const fitElement: boolean = breakType === PdfLayoutBreakType.fitElement;
        const paginateBoundsHeight: number = (layoutFormat && layoutFormat._boundSet && layoutFormat._paginateBounds)
            ? layoutFormat._paginateBounds.height : -1;
        const totalWidth: number = columnWidths.reduce((sum: number, w: number) => sum + w, 0);
        if (totalWidth > firstBounds.width && firstBounds.width > 0) {
            const scale: number = firstBounds.width / totalWidth;
            for (let index: number = 0; index < columnWidths.length; index++) {
                columnWidths[index as number] *= scale;
            }
        }
        const headerCount: number = this._headers.length;
        const repeatHeaders: boolean = layoutType === PdfLayoutType.paginate && headerCount > 0 && this._repeatHeader;
        let headerHeight: number = 0;
        if (repeatHeaders) {
            for (let hi: number = 0; hi < headerCount; hi++) {
                headerHeight += rowHeights[hi as number];
            }
        }
        const slices: _PageSlice[] = [];
        let rowIndex: number = 0;
        const rowCount: number = rowHeights.length;
        let currentPage: PdfPage = firstPage;
        let availableHeight: number = firstBounds.height;
        let drawY: number = firstBounds.y;
        let isFirstPage: boolean = true;
        const firstPageFullCapacity: number = repeatHeaders
            ? Math.max(firstBounds.height - headerHeight, 0)
            : firstBounds.height;
        for (let ri: number = headerCount; ri < rowCount; ri++) {
            const rh: number = rowHeights[ri as number];
            if (fitElement && rh > firstPageFullCapacity + 1e-6) {
                const section: string = ri < headerCount ? 'header' : 'record';
                throw new Error(`PdfGrid oversized content: ${section} row ${ri} (height ${rh}) cannot fit within available page height (${firstPageFullCapacity}). The element exceeds the drawable area of an empty page.`);
            }
        }
        while (rowIndex < rowCount) {
            const sliceStart: number = rowIndex;
            let accumulated: number = 0;
            let sliceEnd: number = rowIndex;
            const repeatCount: number = (!isFirstPage && repeatHeaders) ? headerCount : 0;
            if (fitElement) {
                while (sliceEnd < rowCount) {
                    const rh: number = rowHeights[sliceEnd as number];
                    if (rh <= availableHeight + 1e-6) {
                        if (accumulated + rh <= availableHeight + 1e-6) {
                            accumulated += rh;
                            sliceEnd++;
                        } else {
                            break;
                        }
                    } else {
                        break;
                    }
                }
            } else {
                while (sliceEnd < rowCount) {
                    const rh: number = rowHeights[sliceEnd as number];
                    if (accumulated + rh <= availableHeight + 1e-6) {
                        accumulated += rh;
                        sliceEnd++;
                    } else {
                        break;
                    }
                }
            }
            if (sliceEnd === sliceStart) {
                throw new Error(`PdfGrid no-progress detected: row ${sliceStart} (height ${rowHeights[sliceStart as number]}) cannot fit within available height ${availableHeight}
                    on page ${isFirstPage ? 'first' : 'continuation'}.`);
            }
            slices.push({
                startRow: sliceStart, endRow: sliceEnd, page: currentPage, drawBounds: {
                    x: firstBounds.x, y: drawY,
                    width: firstBounds.width, height: accumulated
                }, repeatHeaderCount: repeatCount
            });
            rowIndex = sliceEnd;
            if (rowIndex < rowCount) {
                if (layoutType === PdfLayoutType.onePage) {
                    break;
                }
                const doc: { _crossReference: { _document: { pageCount: number; getPage: (i: number) => PdfPage; addPage: () => PdfPage } } } = currentPage as any as  // eslint-disable-line
                    { _crossReference: { _document: { pageCount: number; getPage: (i: number) => PdfPage; addPage: () => PdfPage } } };
                const pageIndex: number = (currentPage as any as { _pageIndex: number })._pageIndex; // eslint-disable-line
                const document: { pageCount: number; getPage: (i: number) => PdfPage; addPage: () => PdfPage } =
                    doc._crossReference._document;
                const nextPageIndex: number = pageIndex + 1;
                const nextPageExists: boolean = nextPageIndex < document.pageCount;
                const nextPage: PdfPage = nextPageExists ? document.getPage(nextPageIndex) : document.addPage();
                const contClientSize: { width: number; height: number } = nextPage.graphics.clientSize;
                const contAvailableHeight: number = paginateBoundsHeight > 0
                    ? Math.min(paginateBoundsHeight, contClientSize.height)
                    : contClientSize.height;
                if (repeatHeaders && headerHeight > contAvailableHeight + 1e-6) {
                    throw new Error(`PdfGrid oversized header group: header height (${headerHeight}) cannot fit within continuation page height (${contAvailableHeight}). The header group exceeds the drawable area of an empty page.`);
                }
                const contFullCapacity: number = repeatHeaders
                    ? Math.max(contAvailableHeight - headerHeight, 0)
                    : contAvailableHeight;
                const nextRowHeight: number = rowHeights[rowIndex as number];
                if (fitElement && nextRowHeight > contFullCapacity + 1e-6) {
                    const section: string = rowIndex < headerCount ? 'header' : 'record';
                    throw new Error(`PdfGrid oversized content: ${section} row ${rowIndex} (height ${nextRowHeight}) cannot fit within continuation page available height (${contFullCapacity}). The element exceeds the drawable area of an empty page.`);
                }
                if (nonPaginatedRows && nonPaginatedRows.indexOf(rowIndex) !== -1 && nextRowHeight > contFullCapacity + 1e-6) {
                    throw new Error(`PdfGrid: Nested grid in row ${rowIndex} cannot fit on any page. Child height (${nextRowHeight}) exceeds available page height (${contFullCapacity}).`);
                }
                currentPage = nextPage;
                availableHeight = contFullCapacity;
                drawY = repeatHeaders ? headerHeight : 0;
                isFirstPage = false;
            }
        }
        return slices;
    }
    /**
     * Renders a grid row range within the specified bounds.
     *
     * @private
     * @param {PdfGraphics} graphics Graphics context used for rendering.
     * @param {Rectangle} bounds Drawing bounds.
     * @param {PdfGridRow[]} allRows Grid rows to render.
     * @param {number} startRow First row index to render.
     * @param {number} endRow Exclusive end row index.
     * @param {number[]} columnWidths Resolved column widths.
     * @param {number[]} rowHeights Computed row heights.
     * @param {_PdfBuiltInDescriptor} descriptor Built-in style descriptor.
     * @param {Array<Array<boolean>>} occupied Occupied cells for row and column spans.
     * @param {PdfPage} [page] Page used to add link annotations.
     * @returns {Rectangle} Bounds of the rendered grid slice.
     */
    _renderSlice(graphics: PdfGraphics, bounds: Rectangle, allRows: PdfGridRow[], startRow: number, endRow: number,
                 columnWidths: number[], rowHeights: number[], descriptor: _PdfBuiltInDescriptor, occupied: boolean[][],
                 page?: PdfPage): Rectangle {
        const headerCount: number = this._headers.length;
        const rowY: number[] = new Array(allRows.length).fill(0) as number[];
        rowY[0] = 0;
        for (let i: number = 1; i < allRows.length; i++) {
            rowY[i as number] = rowY[(i - 1) as number] + rowHeights[(i - 1) as number];
        }
        const sliceOriginY: number = rowY[startRow as number];
        const cellLayouts: _CellLayout[] = [];
        let maxOccupiedY: number = bounds.y;
        for (let rowIndex: number = startRow; rowIndex < endRow; rowIndex++) {
            const row: PdfGridRow = allRows[rowIndex as number];
            const isHeader: boolean = rowIndex < headerCount;
            let colCursor: number = 0;
            const renderY: number = bounds.y + (rowY[rowIndex as number] - sliceOriginY);
            row.cells.forEach((cell: PdfGridCell) => {
                while (colCursor < this._numberOfColumns && occupied[rowIndex as number][colCursor as number]) {
                    colCursor++;
                }
                if (colCursor >= this._numberOfColumns) {
                    return;
                }
                const cs: number = (cell.style && typeof cell.style.columnSpan === 'number') ? (cell.style.columnSpan as number) : 1;
                const rs: number = (cell.style && typeof cell.style.rowSpan === 'number') ? (cell.style.rowSpan as number) : 1;
                let cellWidth: number = 0;
                for (let dc: number = 0; dc < cs; dc++) {
                    cellWidth += columnWidths[(colCursor + dc) as number] || 0;
                }
                for (let dr: number = 0; dr < rs; dr++) {
                    for (let dc: number = 0; dc < cs; dc++) {
                        if (dr === 0 && dc === 0) {
                            continue;
                        }
                        const occupiedRow: number = rowIndex + dr;
                        const occupiedColumn: number = colCursor + dc;
                        if (occupiedRow < occupied.length &&
                            occupiedColumn < this._numberOfColumns) {
                            occupied[occupiedRow as number][occupiedColumn as number] = true;
                        }
                    }
                }
                if (cellWidth === 0) {
                    colCursor += cs;
                    return;
                }
                let cellHeight: number = 0;
                for (let dr: number = 0; dr < rs; dr++) {
                    cellHeight += rowHeights[(rowIndex + dr) as number] || 0;
                }
                let cellX: number = bounds.x;
                for (let dc: number = 0; dc < colCursor; dc++) {
                    cellX += columnWidths[dc as number] || 0;
                }
                const effectiveSpacing: { left: number; right: number; top: number; bottom: number } =
                    this._resolveCellSpacing(cell, row, colCursor, descriptor);
                const cellBounds: Rectangle = {
                    x: cellX + effectiveSpacing.left,
                    y: renderY + effectiveSpacing.top,
                    width: Math.max(cellWidth - effectiveSpacing.left - effectiveSpacing.right, 0),
                    height: Math.max(cellHeight - effectiveSpacing.top - effectiveSpacing.bottom, 0)
                };
                const effectivePadding: { left: number; right: number; top: number; bottom: number } =
                    this._resolveCellPadding(cell, row, colCursor, descriptor);
                const contentBounds: Rectangle = {
                    x: cellBounds.x + effectivePadding.left,
                    y: cellBounds.y + effectivePadding.top,
                    width: Math.max(cellBounds.width - effectivePadding.left - effectivePadding.right, 0),
                    height: Math.max(cellBounds.height - effectivePadding.top - effectivePadding.bottom, 0)
                };
                cellLayouts.push({
                    cellBounds,
                    contentBounds,
                    border: this._resolveEffectiveBorder(cell, row, colCursor, descriptor),
                    background: this._resolveEffectiveBackground(cell, row, colCursor, isHeader, descriptor,
                                                                 this._isBuiltInBandedRow(rowIndex, headerCount, isHeader)),
                    cell,
                    row,
                    isHeader,
                    colIndex: colCursor
                });
                maxOccupiedY = Math.max(maxOccupiedY, cellBounds.y + cellBounds.height);
                colCursor += cs;
            });
        }
        const state: PdfGraphicsState = graphics.save();
        for (let ci: number = 0; ci < cellLayouts.length; ci++) {
            const layout: _CellLayout = cellLayouts[ci as number];
            if (layout.background !== null) {
                if (this._isBackgroundImage(layout.background)) {
                    const imageBounds: Rectangle = this._resolveBackgroundImageBounds(layout.background,
                                                                                      layout.contentBounds);
                    graphics.drawImage(layout.background.image, imageBounds);
                } else {
                    graphics.drawRectangle(layout.cellBounds, layout.background);
                }
            }
        }
        for (let ci: number = 0; ci < cellLayouts.length; ci++) {
            const layout: _CellLayout = cellLayouts[ci as number];
            if (layout.cell.value instanceof PdfImage) {
                const imageBounds: Rectangle = this._resolveImageBounds(layout.cell, layout.row, layout.colIndex,
                                                                        layout.contentBounds);
                graphics.drawImage(layout.cell.value, imageBounds);
            }
        }
        this._drawnBorderEdges.clear();
        for (let ci: number = 0; ci < cellLayouts.length; ci++) {
            const layout: _CellLayout = cellLayouts[ci as number];
            this._drawResolvedCellBorder(graphics, layout.cellBounds, layout.border as any, layout.cell, // eslint-disable-line
                                         layout.row, layout.colIndex, allRows.indexOf(layout.row), startRow, endRow);
        }
        for (let ci: number = 0; ci < cellLayouts.length; ci++) {
            const layout: _CellLayout = cellLayouts[ci as number];
            if (!(layout.cell.value instanceof PdfImage) && !(layout.cell.value instanceof PdfGrid)) {
                const text: string = (layout.cell.value === null || typeof layout.cell.value === 'undefined') ?
                    '' : String(layout.cell.value);
                if (text.length > 0) {
                    const textProperties: PdfTextProperties = this._resolveTextProperties(layout.cell, layout.row,
                                                                                          layout.colIndex);
                    const vAlign: PdfVerticalAlignment = this._mapVerticalAlignment(textProperties.verticalAlignment);
                    const resolvedText: { font: PdfFont; brush: PdfBrush; alignment: PdfTextAlignment } =
                        this._resolveBuiltInText(textProperties, layout.isHeader, layout.colIndex, descriptor);
                    const fmt: PdfStringFormat = new PdfStringFormat(resolvedText.alignment, vAlign);
                    const font: PdfFont = resolvedText.font;
                    const brush: PdfBrush = resolvedText.brush;
                    graphics.drawString(text, font, layout.contentBounds, brush, fmt);
                }
            }
        }
        for (let ci: number = 0; ci < cellLayouts.length; ci++) {
            const layout: _CellLayout = cellLayouts[ci as number];
            if (layout.cell.value instanceof PdfGrid) {
                const childGrid: PdfGrid = layout.cell.value;
                if (layout.contentBounds.width > 0 && layout.contentBounds.height > 0) {
                    const clipToCell: boolean = !(layout.cell.style &&
                        layout.cell.style.nestedGrid &&
                        layout.cell.style.nestedGrid.clipToCell === false);
                    const allowPagination: boolean = !!(layout.cell.style &&
                        layout.cell.style.nestedGrid &&
                        layout.cell.style.nestedGrid.allowPagination === true);
                    if (allowPagination && typeof page !== 'undefined') {
                        const parentRowLayouts: _CellLayout[] = cellLayouts.filter(
                            (candidate: _CellLayout) => candidate.row === layout.row
                        );
                        this._renderNestedGridPaginated(
                            childGrid, layout, graphics, page, parentRowLayouts
                        );
                    } else if (clipToCell) {
                        const clipState: PdfGraphicsState = graphics.save();
                        graphics.setClip(layout.contentBounds);
                        childGrid._layoutAndRender(graphics, layout.contentBounds, page);
                        graphics.restore(clipState);
                    } else {
                        childGrid._layoutAndRender(graphics, layout.contentBounds, page);
                    }
                }
            }
        }
        if (typeof page !== 'undefined') {
            for (let ci: number = 0; ci < cellLayouts.length; ci++) {
                const layout: _CellLayout = cellLayouts[ci as number];
                const link: PdfLink = layout.cell.link;
                if (typeof link !== 'undefined') {
                    this._createLinkAnnotation(page, layout.cellBounds, link);
                } else {
                    const cellValue: any = layout.cell.value; // eslint-disable-line
                    if (typeof cellValue === 'string' && _isTextDerivedHyperlink(cellValue)) {
                        const uriAnnotation: PdfUriAnnotation = new PdfUriAnnotation(layout.cellBounds, cellValue);
                        page.annotations.add(uriAnnotation);
                    }
                }
            }
        }
        graphics.restore(state);
        const totalWidth: number = columnWidths.reduce((sum: number, w: number) => sum + w, 0);
        const occupiedHeight: number = maxOccupiedY - bounds.y;
        return { x: bounds.x, y: bounds.y, width: totalWidth, height: Math.max(occupiedHeight, 0) };
    }
    _renderNestedGridPaginated(childGrid: PdfGrid, layout: _CellLayout, parentGraphics: PdfGraphics,
                               parentPage: PdfPage, parentRowLayouts: _CellLayout[]): void {
        const childColWidths: number[] = childGrid._resolveColumnWidths(layout.contentBounds.width);
        const childDescriptor: _PdfBuiltInDescriptor = (typeof childGrid._builtInStyle === 'number')
            ? childGrid._resolveBuiltInDescriptor(childGrid._builtInStyle)
            : null;
        const childAllRows: PdfGridRow[] = childGrid._headers.concat(childGrid._records);
        const childRowHeights: number[] = childGrid._computeRowHeights(
            childAllRows, childColWidths, childDescriptor
        );
        const childFirstBounds: Rectangle = {
            x: layout.contentBounds.x,
            y: layout.contentBounds.y,
            width: layout.contentBounds.width,
            height: layout.contentBounds.height
        };
        const childNonPaginatedRows: number[] = childGrid._detectNonPaginatedNestedRows(childAllRows);
        const childSlices: _PageSlice[] = childGrid._computeLayout(
            parentPage, childFirstBounds, null, childColWidths,
            childRowHeights, childNonPaginatedRows
        );
        if (childSlices.length === 0) {
            return;
        }
        this._nestedDidContinue = childSlices.length > 1;
        const clipToCell: boolean = !(layout.cell.style &&
            layout.cell.style.nestedGrid &&
            layout.cell.style.nestedGrid.clipToCell === false);
        const parentBorder: any = layout.border; // eslint-disable-line
        const parentBackground: PdfBrush | PdfBackgroundImage | null = layout.background;
        const paddingTop: number = layout.contentBounds.y - layout.cellBounds.y;
        const paddingBottom: number = layout.cellBounds.height - layout.contentBounds.height - paddingTop;
        const repeatedHeaderHeight: number = childGrid._repeatHeader
            ? childRowHeights.slice(0, childGrid._headers.length)
                .reduce((sum: number, height: number) => sum + height, 0)
            : 0;
        const drawFragment:
        (slice: _PageSlice, fragmentPage: PdfPage, fragmentGraphics: PdfGraphics,
            isFirst: boolean, isLast: boolean) => void = (
            slice: _PageSlice, fragmentPage: PdfPage,
            fragmentGraphics: PdfGraphics, isFirst: boolean, isLast: boolean): void => {
            const repeatCount: number = isFirst ? 0 : slice.repeatHeaderCount;
            const repeatHeight: number = repeatCount > 0 ? repeatedHeaderHeight : 0;
            const fragmentContentHeight: number = repeatHeight + slice.drawBounds.height;
            const fragmentY: number = isFirst ? layout.cellBounds.y : 0;
            const fragmentContentY: number = fragmentY + paddingTop;
            const fragmentCellBounds: Rectangle = {
                x: layout.cellBounds.x,
                y: fragmentY,
                width: layout.cellBounds.width,
                height: fragmentContentHeight + paddingTop + paddingBottom
            };
            const fragmentContentBounds: Rectangle = {
                x: layout.contentBounds.x,
                y: fragmentContentY,
                width: layout.contentBounds.width,
                height: fragmentContentHeight
            };

            if (parentBackground !== null && parentBackground !== undefined) {
                if (this._isBackgroundImage(parentBackground)) {
                    const imageBounds: Rectangle = this._resolveBackgroundImageBounds(
                        parentBackground as PdfBackgroundImage, fragmentContentBounds
                    );
                    fragmentGraphics.drawImage(
                        (parentBackground as PdfBackgroundImage).image, imageBounds
                    );
                } else {
                    fragmentGraphics.drawRectangle(fragmentCellBounds, parentBackground as PdfBrush);
                }
            }
            if (!isFirst) {
                for (let siblingIndex: number = 0; siblingIndex < parentRowLayouts.length; siblingIndex++) {
                    const siblingLayout: _CellLayout = parentRowLayouts[siblingIndex as number];
                    if (siblingLayout === layout) {
                        continue;
                    }
                    const siblingTopPadding: number =
                        siblingLayout.contentBounds.y - siblingLayout.cellBounds.y;
                    const siblingBottomPadding: number =
                        siblingLayout.cellBounds.height - siblingLayout.contentBounds.y -
                        siblingLayout.contentBounds.height;
                    const siblingFragmentBounds: Rectangle = {
                        x: siblingLayout.cellBounds.x,
                        y: fragmentY,
                        width: siblingLayout.cellBounds.width,
                        height: fragmentCellBounds.height
                    };
                    const siblingContentBounds: Rectangle = {
                        x: siblingLayout.contentBounds.x,
                        y: fragmentY + siblingTopPadding,
                        width: siblingLayout.contentBounds.width,
                        height: Math.max(
                            siblingFragmentBounds.height - siblingTopPadding - siblingBottomPadding,
                            0
                        )
                    };
                    if (siblingLayout.background !== null && siblingLayout.background !== undefined) {
                        if (this._isBackgroundImage(siblingLayout.background)) {
                            const siblingImageBounds: Rectangle = this._resolveBackgroundImageBounds(
                                siblingLayout.background as PdfBackgroundImage, siblingContentBounds
                            );
                            fragmentGraphics.drawImage(
                                (siblingLayout.background as PdfBackgroundImage).image,
                                siblingImageBounds
                            );
                        } else {
                            fragmentGraphics.drawRectangle(
                                siblingFragmentBounds, siblingLayout.background as PdfBrush
                            );
                        }
                    }
                    this._renderParentCellFragmentBorder(
                        fragmentGraphics, siblingFragmentBounds,
                        siblingLayout.border, true, true
                    );
                }
            }
            const renderContent: () => void = (): void => {
                if (repeatCount > 0) {
                    const headerBounds: Rectangle = {
                        x: layout.contentBounds.x,
                        y: fragmentContentY,
                        width: layout.contentBounds.width,
                        height: repeatHeight
                    };
                    const headerOccupied: boolean[][] = childAllRows.map(() =>
                        new Array(childGrid._numberOfColumns).fill(false) as boolean[]);
                    childGrid._renderSlice(
                        fragmentGraphics, headerBounds, childAllRows, 0, repeatCount,
                        childColWidths, childRowHeights, childDescriptor,
                        headerOccupied, fragmentPage
                    );
                }
                const bodyBounds: Rectangle = {
                    x: layout.contentBounds.x,
                    y: fragmentContentY + repeatHeight,
                    width: layout.contentBounds.width,
                    height: slice.drawBounds.height
                };
                const bodyOccupied: boolean[][] = childAllRows.map(() =>
                    new Array(childGrid._numberOfColumns).fill(false) as boolean[]);
                childGrid._renderSlice(
                    fragmentGraphics, bodyBounds, childAllRows,
                    slice.startRow, slice.endRow, childColWidths,
                    childRowHeights, childDescriptor, bodyOccupied, fragmentPage
                );
            };
            if (clipToCell) {
                const clipState: PdfGraphicsState = fragmentGraphics.save();
                fragmentGraphics.setClip(fragmentContentBounds);
                renderContent();
                fragmentGraphics.restore(clipState);
            } else {
                renderContent();
            }
            // Close the nested parent cell at the top of every physical page.
            // Close this physical fragment even when more child rows continue later.
            // The next page opens a new fragment with its own top border.
            this._renderParentCellFragmentBorder(
                fragmentGraphics, fragmentCellBounds, parentBorder, true, true
            );
            if (isLast) {
                this._nestedContinuationPage = fragmentPage;
                this._nestedContinuationY =
                    fragmentCellBounds.y + fragmentCellBounds.height;
            }
        };
        for (let si: number = 0; si < childSlices.length; si++) {
            const slice: _PageSlice = childSlices[si as number];
            const isFirst: boolean = si === 0;
            const isLast: boolean = si === childSlices.length - 1;
            drawFragment(
                slice,
                isFirst ? parentPage : slice.page,
                isFirst ? parentGraphics : slice.page.graphics,
                isFirst,
                isLast
            );
        }
    }
    _renderParentCellFragmentBorder(
        graphics: PdfGraphics,
        cellBounds: Rectangle,
        border: any, // eslint-disable-line
        isFirst: boolean,
        isLast: boolean
    ): void {
        if (border === null || border === undefined) { return; }
        const base: _PdfResolvedGridBorder = {
            left: this._copyPen(this._defaultBorder), right: this._copyPen(this._defaultBorder),
            top: this._copyPen(this._defaultBorder), bottom: this._copyPen(this._defaultBorder),
            renderMode: 'rectangle'
        };
        const resolved: _PdfResolvedGridBorder = border.renderMode
            ? border as _PdfResolvedGridBorder : this._mergeBorderLevel(base, border);
        const mask: any = this._normalizeBorderMask(this._borderType); // eslint-disable-line
        const drawLeft: boolean = mask.left;
        const drawRight: boolean = mask.right;
        const drawTop: boolean = isFirst && mask.top;
        const drawBottom: boolean = isLast && mask.bottom;
        const leftX: number = cellBounds.x;
        const rightX: number = cellBounds.x + cellBounds.width;
        const topY: number = cellBounds.y;
        const bottomY: number = cellBounds.y + cellBounds.height;
        const horizontalStart: number = leftX - (drawLeft ? resolved.left.width / 2 : 0);
        const horizontalEnd: number = rightX + (drawRight ? resolved.right.width / 2 : 0);
        const verticalStart: number = topY - (drawTop ? resolved.top.width / 2 : 0);
        const verticalEnd: number = bottomY + (drawBottom ? resolved.bottom.width / 2 : 0);
        if (drawLeft) {
            this._drawOwnedBorderLine(
                graphics,
                resolved.left,
                { x: leftX, y: verticalStart },
                { x: leftX, y: verticalEnd }
            );
        }
        if (drawRight) {
            this._drawOwnedBorderLine(
                graphics,
                resolved.right,
                { x: rightX, y: verticalStart },
                { x: rightX, y: verticalEnd }
            );
        }
        if (drawTop) {
            this._drawOwnedBorderLine(
                graphics,
                resolved.top,
                { x: horizontalStart, y: topY },
                { x: horizontalEnd, y: topY }
            );
        }
        if (drawBottom) {
            this._drawOwnedBorderLine(
                graphics,
                resolved.bottom,
                { x: horizontalStart, y: bottomY },
                { x: horizontalEnd, y: bottomY }
            );
        }
    }
    /**
     * Computes the total grid height (sum of all resolved row heights) without rendering.
     * Used by graphics-based draw overloads to verify complete-fit before any rendering occurs.
     *
     * @private
     * @param {number} availableWidth The available drawing width, in points.
     * @returns {number} The total computed grid height, in points.
     */
    _computeTotalGridHeight(availableWidth: number): number {
        const columnWidths: number[] = this._resolveColumnWidths(availableWidth);
        const descriptor: _PdfBuiltInDescriptor = (typeof this._builtInStyle === 'number')
            ? this._resolveBuiltInDescriptor(this._builtInStyle)
            : null;
        const allRows: PdfGridRow[] = this._headers.concat(this._records);
        const rowHeights: number[] = allRows.map((row: PdfGridRow) => {
            if (typeof row.height === 'number') {
                return row.height;
            }
            let maxHeight: number = 0;
            let colCursor: number = 0;
            row.cells.forEach((cell: PdfGridCell) => {
                colCursor++;
                const cs: number = (cell.style && typeof cell.style.columnSpan === 'number') ? (cell.style.columnSpan as number) : 1;
                const rs: number = (cell.style && typeof cell.style.rowSpan === 'number') ? (cell.style.rowSpan as number) : 1;
                if (rs === 1) {
                    let cellWidth: number = 0;
                    for (let dc: number = 0; dc < cs; dc++) {
                        cellWidth += columnWidths[(colCursor - 1 + dc) as number] || 0;
                    }
                    const effectivePadding: { left: number; right: number; top: number; bottom: number } =
                        this._resolveCellPadding(cell, row, colCursor - 1, descriptor);
                    const effectiveBorderWidth: number = this._resolveCellBorderWidth(cell, row, colCursor - 1, descriptor);
                    const effectiveSpacing: { left: number; right: number; top: number; bottom: number } =
                        this._resolveCellSpacing(cell, row, colCursor - 1, descriptor);
                    const contentWidth: number = Math.max(cellWidth - effectivePadding.left - effectivePadding.right -
                        (effectiveBorderWidth * 2)
                        - effectiveSpacing.left - effectiveSpacing.right, 0);
                    let contentHeight: number = 0;
                    if (cell.value instanceof PdfImage) {
                        const image: PdfImage = cell.value;
                        const intrinsicW: number = image.width > 0 ? image.width : 1;
                        const intrinsicH: number = image.height > 0 ? image.height : 1;
                        if (contentWidth > 0) {
                            contentHeight = (intrinsicH / intrinsicW) * contentWidth;
                        }
                    } else if (cell.value instanceof PdfGrid) {
                        const childGrid: PdfGrid = cell.value;
                        const innerWidth: number = Math.max(contentWidth, 1);
                        contentHeight = childGrid._computeTotalGridHeight(innerWidth);
                    } else if (this._getCellText(cell.value).length > 0) {
                        const textValue: string = this._getCellText(cell.value);
                        const font: PdfFont = this._resolveTextProperties(cell, row, colCursor - 1).font ||
                            this._defaultFont;
                        const format: PdfStringFormat = new PdfStringFormat();
                        if (contentWidth > 0) {
                            const measured: { width: number; height: number } = font.measureString(textValue,
                                                                                                   { width: contentWidth,
                                                                                                       height: 0 },
                                                                                                   format,
                                                                                                   contentWidth, 0);
                            contentHeight = measured.height;
                        }
                    }
                    const required: number = contentHeight + effectivePadding.top + effectivePadding.bottom +
                        effectiveBorderWidth + effectiveSpacing.top + effectiveSpacing.bottom;
                    maxHeight = Math.max(maxHeight, required);
                }
                colCursor += cs - 1;
            });
            return Math.max(maxHeight, 4);
        });
        return rowHeights.reduce((sum: number, h: number) => sum + h, 0);
    }
    /**
     * Scans all rows and returns the set of row indices (in allRows = headers+records array)
     * that contain at least one cell whose value is a PdfGrid with allowPagination !== true.
     * These rows must be treated as indivisible during vertical pagination (T-44).
     *
     * @private
     * @param {PdfGridRow[]} allRows All rows (headers concatenated with records).
     * @returns {Set<number>} Set of row indices with non-paginated nested grids.
     */
    _detectNonPaginatedNestedRows(allRows: PdfGridRow[]): number[] {
        const result: number[] = [];
        for (let ri: number = 0; ri < allRows.length; ri++) {
            const row: PdfGridRow = allRows[ri as number];
            for (let ci: number = 0; ci < row.cells.length; ci++) {
                const cell: PdfGridCell = row.cells[ci as number];
                if (cell.value instanceof PdfGrid) {
                    const allowPagination: boolean = !!(cell.style &&
                        cell.style.nestedGrid &&
                        cell.style.nestedGrid.allowPagination === true);
                    if (!allowPagination) {
                        result.push(ri);
                        break;
                    }
                }
            }
        }
        return result;
    }
    /**
     * Scans all rows for nested grids and computes the minimum required width contributions.
     * Returns an array where each index represents the minimum required width for that column
     * due to nested grid minimum-width requirements. Returns 0 for columns with no nested constraints.
     *
     * @private
     * @returns {number[]} Minimum required widths per column due to nested grids.
     */
    _computeNestedGridMinimumWidths(): number[] {
        const minWidths: number[] = new Array<number>(this._numberOfColumns).fill(0);
        const allRows: PdfGridRow[] = this._headers.concat(this._records);
        allRows.forEach((row: PdfGridRow) => {
            let colCursor: number = 0;
            row.cells.forEach((cell: PdfGridCell) => {
                const cs: number = (cell.style && typeof cell.style.columnSpan === 'number') ? cell.style.columnSpan : 1;
                if (cell.value instanceof PdfGrid) {
                    const childGrid: PdfGrid = cell.value;
                    const descriptor: _PdfBuiltInDescriptor = (typeof this._builtInStyle === 'number')
                        ? this._resolveBuiltInDescriptor(this._builtInStyle)
                        : null;
                    const effectivePadding: { left: number; right: number; top: number; bottom: number } =
                        this._resolveCellPadding(cell, row, colCursor, descriptor);
                    const effectiveBorderWidth: number = this._resolveCellBorderWidth(cell, row, colCursor, descriptor);
                    const effectiveSpacing: { left: number; right: number; top: number; bottom: number } =
                        this._resolveCellSpacing(cell, row, colCursor, descriptor);

                    let mergedCellWidth: number = 0;
                    for (let dc: number = 0; dc < cs; dc++) {
                        const colIndex: number = colCursor + dc;
                        const explicitWidth: number = this._columnWidths.get(colIndex);
                        mergedCellWidth += (typeof explicitWidth === 'number') ? explicitWidth : this._defaultColumnWidth;
                    }
                    const childMinWidth: number = childGrid._resolveTotalWidth();
                    const neededTotalWidth: number = childMinWidth + effectivePadding.left + effectivePadding.right +
                        (effectiveBorderWidth * 2) + effectiveSpacing.left + effectiveSpacing.right;
                    if (neededTotalWidth > mergedCellWidth && cs > 0) {
                        const shortage: number = neededTotalWidth - mergedCellWidth;
                        const perColumnExpansion: number = shortage / cs;
                        for (let dc: number = 0; dc < cs; dc++) {
                            const colIndex: number = colCursor + dc;
                            minWidths[colIndex as number] = Math.max(minWidths[colIndex as number], perColumnExpansion);
                        }
                    }
                }
                colCursor += cs;
            });
        });
        return minWidths;
    }
    /**
     * Resolves the total width required by the current column model using explicit widths only.
     *
     * @private
     * @returns {number} The resolved total width, in points.
     */
    _resolveTotalWidth(): number {
        let total: number = 0;
        for (let index: number = 0; index < this._numberOfColumns; index++) {
            const explicitWidth: number = this._columnWidths.get(index);
            total += (typeof explicitWidth === 'number') ? explicitWidth : this._defaultColumnWidth;
        }
        return total;
    }
    /**
     * Resolves the final width of each logical column within the supplied available width.
     * Accounts for nested grid minimum-width requirements by expanding column allocations as needed.
     *
     * @private
     * @param {number} availableWidth The available drawing width, in points.
     * @returns {number[]} The resolved width of each column, in points.
     */
    _resolveColumnWidths(availableWidth: number): number[] {
        const widths: number[] = new Array<number>(this._numberOfColumns).fill(0);
        let explicitTotal: number = 0;
        const missing: number[] = [];
        for (let index: number = 0; index < this._numberOfColumns; index++) {
            const explicitWidth: number = this._columnWidths.get(index);
            if (typeof explicitWidth === 'number') {
                widths[index as number] = explicitWidth;
                explicitTotal += explicitWidth;
            } else {
                missing.push(index);
            }
        }
        if (missing.length > 0) {
            const remaining: number = Math.max(availableWidth - explicitTotal, 0);
            const share: number = remaining / missing.length;
            missing.forEach((index: number) => {
                widths[index as number] = share > 0 ? share : this._defaultColumnWidth;
            });
        }
        // T-13: Incorporate nested grid minimum-width requirements
        const nestedMinWidths: number[] = this._computeNestedGridMinimumWidths();
        nestedMinWidths.forEach((minWidth: number, index: number) => {
            if (minWidth > 0 && widths[index as number] < minWidth) {
                widths[index as number] = minWidth;
            }
        });
        return widths;
    }
    /**
     * Computes horizontal segments for column distribution based on horizontal overflow mode.
     * Each segment contains a contiguous range of logical columns that fit within available width.
     * T-23: onePage mode uses a single segment.
     * T-24-T-28: nextPage/lastPage modes partition columns into segments respecting column spans.
     *
     * @private
     * @param {number[]} columnWidths Resolved column widths for all logical columns.
     * @param {number} availableWidth Available drawing width per segment.
     * @returns {Array<{startCol: number, endCol: number, width: number}>} Segments: each with start column, end column (exclusive), and segment width.
     * @throws {Error} Throws for oversized spans, oversized columns, or no-progress segmentation.
     */
    _computeSegments(columnWidths: number[], availableWidth: number): Array<{ startCol: number; endCol: number; width: number }> {
        const tolerance: number = 1e-6;
        if (this._horizontalOverflow === PdfGridHorizontalOverflowType.onePage) {
            return [{
                startCol: 0,
                endCol: this._numberOfColumns,
                width: columnWidths.reduce((sum: number, w: number) => sum + w, 0)
            }];
        }
        const segments: Array<{ startCol: number; endCol: number; width: number }> = [];
        let currentStart: number = 0;
        const allRows: PdfGridRow[] = this._headers.concat(this._records);
        while (currentStart < this._numberOfColumns) {
            let currentEnd: number = currentStart;
            let segmentWidth: number = 0;
            let madeProgress: boolean = false;
            while (currentEnd < this._numberOfColumns) {
                const colWidth: number = columnWidths[currentEnd as number];
                if (colWidth > availableWidth + tolerance) {
                    throw new Error(`PdfGrid: Column ${currentEnd} width (${colWidth.toFixed(2)} points) exceeds maximum segment width (${availableWidth.toFixed(2)} points).`);
                }
                if (segmentWidth + colWidth <= availableWidth + tolerance) {
                    segmentWidth += colWidth;
                    currentEnd++;
                    madeProgress = true;
                } else {
                    break;
                }
            }
            if (!madeProgress) {
                throw new Error(`PdfGrid: Horizontal segmentation cannot make forward progress at column ${currentStart}; no column fits in available width.`);
            }
            let adjustedEnd: number = currentEnd;
            for (let rowIndex: number = 0; rowIndex < allRows.length; rowIndex++) {
                const row: PdfGridRow = allRows[rowIndex as number];
                let colCursor: number = 0;
                for (let cellIndex: number = 0; cellIndex < row.cells.length; cellIndex++) {
                    const cell: PdfGridCell = row.cells[cellIndex as number];
                    const cs: number = (cell.style && typeof cell.style.columnSpan === 'number') ? (cell.style.columnSpan as number) : 1;
                    if (colCursor >= currentStart && colCursor < adjustedEnd && colCursor + cs > adjustedEnd) {
                        adjustedEnd = colCursor;
                    }
                    colCursor += cs;
                    if (colCursor >= currentEnd) {
                        break;
                    }
                }
            }
            if (adjustedEnd === currentStart) {
                throw new Error(`PdfGrid: Column span at segment boundary starting column ${currentStart} cannot be kept intact within available width.`);
            }
            segments.push({
                startCol: currentStart,
                endCol: adjustedEnd,
                width: columnWidths.slice(currentStart, adjustedEnd).reduce((sum: number, w: number) => sum + w, 0)
            });
            currentStart = adjustedEnd;
        }
        return segments;
    }
    /**
     * Builds the immutable horizontal segment plan: for each segment, stores assigned column indices,
     * resolved column widths, first/last visible border flags, original logical row indices for banding,
     * and the set of valid span anchors.
     * T-30: Segment plan construction.
     *
     * @private
     * @param {Array<{startCol: number, endCol: number, width: number}>} segments Computed segments from _computeSegments.
     * @returns {void} Populates this._segmentPlan.
     */
    _buildSegmentPlan(segments: Array<{ startCol: number; endCol: number; width: number }>): void {
        const allRows: PdfGridRow[] = this._headers.concat(this._records);
        this._segmentPlan = [];
        for (let segIdx: number = 0; segIdx < segments.length; segIdx++) {
            const segment: any = segments[segIdx as number]; // eslint-disable-line
            const isFirstSegment: boolean = (segIdx === 0);
            const isLastSegment: boolean = (segIdx === segments.length - 1);
            const validSpanAnchors: Set<number> = new Set<number>();
            for (let rowIdx: number = 0; rowIdx < allRows.length; rowIdx++) {
                const row: PdfGridRow = allRows[rowIdx as number];
                let colCursor: number = 0;
                for (let cellIdx: number = 0; cellIdx < row.cells.length; cellIdx++) {
                    const cell: PdfGridCell = row.cells[cellIdx as number];
                    const cs: number = (cell.style && typeof cell.style.columnSpan === 'number') ? (cell.style.columnSpan as number) : 1;
                    if (colCursor >= segment.startCol && colCursor < segment.endCol) {
                        if (colCursor + cs <= segment.endCol) {
                            validSpanAnchors.add(rowIdx * this._numberOfColumns + colCursor);
                        }
                    }
                    colCursor += cs;
                    if (colCursor >= this._numberOfColumns) {
                        break;
                    }
                }
            }
            const logicalRowIndices: Map<number, number> = new Map<number, number>();
            for (let rowIdx: number = 0; rowIdx < allRows.length; rowIdx++) {
                logicalRowIndices.set(rowIdx, rowIdx);
            }
            type _SegmentHeaderCell = {
                cellIndex: number; colStart: number; colEnd: number;
                colSpan: number; rowSpan: number; value: object | string | number | boolean | null;
                style: PdfGridColumnStyle; bounds: Rectangle; contentBounds: Rectangle;
            };
            const headers: Array<{ rowIndex: number; cells: _SegmentHeaderCell[]; bounds: Rectangle }> = [];
            for (let hIdx: number = 0; hIdx < this._headers.length; hIdx++) {
                const headerRow: PdfGridRow = this._headers[hIdx as number];
                const headerCells: _SegmentHeaderCell[] = [];
                let colCursor: number = 0;
                for (let cellIdx: number = 0; cellIdx < headerRow.cells.length; cellIdx++) {
                    const cell: PdfGridCell = headerRow.cells[cellIdx as number];
                    const cs: number = (cell.style && typeof cell.style.columnSpan === 'number') ? (cell.style.columnSpan as number) : 1;
                    const rs: number = (cell.style && typeof cell.style.rowSpan === 'number') ? (cell.style.rowSpan as number) : 1;
                    if (colCursor >= segment.startCol && colCursor < segment.endCol) {
                        const cellValue: object | string | number | boolean | null =
                            (cell.value !== undefined ? cell.value : null) as object | string | number | boolean | null;
                        headerCells.push({
                            cellIndex: cellIdx,
                            colStart: colCursor,
                            colEnd: Math.min(colCursor + cs, segment.endCol),
                            colSpan: cs,
                            rowSpan: rs,
                            value: cellValue,
                            style: cell.style || {},
                            bounds: { x: 0, y: 0, width: 0, height: 0 },
                            contentBounds: { x: 0, y: 0, width: 0, height: 0 }
                        });
                    }
                    colCursor += cs;
                    if (colCursor >= this._numberOfColumns) {
                        break;
                    }
                }
                if (headerCells.length > 0) {
                    headers.push({
                        rowIndex: hIdx,
                        cells: headerCells,
                        bounds: { x: 0, y: 0, width: segment.width, height: 0 }
                    });
                }
            }
            this._segmentPlan.push({
                startCol: segment.startCol,
                endCol: segment.endCol,
                width: segment.width,
                isFirstSegment: isFirstSegment,
                isLastSegment: isLastSegment,
                validSpanAnchors: validSpanAnchors,
                headers: headers,
                logicalRowIndices: logicalRowIndices
            });
        }
    }
    /**
     * Computes segment-specific first/last-column border flags using original logical column indices
     * so built-in styles that mark edge columns resolve correctly within each segment.
     * T-33: Per-segment border classification.
     *
     * @private
     * @param {number} logicalColumnIndex The original column index in the grid.
     * @param {number} segmentIndex The segment index.
     * @returns {{isFirst: boolean, isLast: boolean}} Flags indicating if column is first/last in segment.
     */
    _getSegmentColumnBorderFlags(logicalColumnIndex: number, segmentIndex: number): { isFirst: boolean; isLast: boolean } {
        if (segmentIndex < 0 || segmentIndex >= this._segmentPlan.length) {
            return { isFirst: false, isLast: false };
        }
        const segment: _segmentPlan = this._segmentPlan[segmentIndex as number];
        const isFirst: boolean = (logicalColumnIndex === segment.startCol);
        const isLast: boolean = (logicalColumnIndex === segment.endCol - 1);
        return { isFirst: isFirst, isLast: isLast };
    }
    /**
     * Lays out and renders the complete grid within the supplied graphics context and bounds.
     *
     * @private
     * @param {PdfGraphics} graphics The graphics context on which to draw the grid.
     * @param {Rectangle} bounds The bounds within which the grid will be drawn.
     * @param {PdfPage} page The PdfPage within which the grid will be drawn.
     * @returns {Rectangle} The occupied bounds of the rendered content.
     */
    _layoutAndRender(graphics: PdfGraphics, bounds: Rectangle, page?: PdfPage): Rectangle {
        const columnWidths: number[] = this._resolveColumnWidths(bounds.width);
        const totalExplicit: number = columnWidths.reduce((sum: number, w: number) => sum + w, 0);
        if (totalExplicit > bounds.width && bounds.width > 0) {
            const scale: number = bounds.width / totalExplicit;
            for (let index: number = 0; index < columnWidths.length; index++) {
                columnWidths[index as number] *= scale;
            }
        }
        const descriptor: _PdfBuiltInDescriptor = (typeof this._builtInStyle === 'number')
            ? this._resolveBuiltInDescriptor(this._builtInStyle)
            : null;
        const headerCount: number = this._headers.length;
        const allRows: PdfGridRow[] = this._headers.concat(this._records);
        const rowCount: number = allRows.length;
        this._validateAllPadding(allRows);
        this._validateAllSpacing();
        this._validateRowHeights(allRows);
        const rowHeights: number[] = allRows.map((row: PdfGridRow, rowIndex: number) => {
            if (typeof row.height === 'number') {
                return row.height;
            }
            let maxHeight: number = 0;
            let colCursor: number = 0;
            row.cells.forEach((cell: PdfGridCell, cellIndex: number) => {
                while (colCursor < this._numberOfColumns) {
                    colCursor++;
                    break;
                }
                const cs: number = (cell.style && typeof cell.style.columnSpan === 'number') ?
                    (cell.style.columnSpan as number) : 1;
                const rs: number = (cell.style && typeof cell.style.rowSpan === 'number') ?
                    (cell.style.rowSpan as number) : 1;
                if (rs === 1) {
                    let cellWidth: number = 0;
                    for (let dc: number = 0; dc < cs; dc++) {
                        cellWidth += columnWidths[(colCursor - 1 + dc) as number] || 0;
                    }
                    const effectivePadding: { left: number; right: number; top: number; bottom: number } =
                        this._resolveCellPadding(cell, row, colCursor - 1, descriptor);
                    const effectiveBorderWidth: number = this._resolveCellBorderWidth(cell, row, colCursor - 1,
                                                                                      descriptor);
                    const effectiveSpacing: { left: number; right: number; top: number; bottom: number } =
                        this._resolveCellSpacing(cell, row, colCursor - 1, descriptor);
                    let contentHeight: number = 0;
                    if (cell.value instanceof PdfImage) {
                        this._validateImageCell(cell, cellIndex, rowIndex);
                        const image: PdfImage = cell.value;
                        const intrinsicW: number = image.width > 0 ? image.width : 1;
                        const intrinsicH: number = image.height > 0 ? image.height : 1;
                        const ratio: number = intrinsicW / intrinsicH;
                        const imgProps: { width?: number; height?: number; fitType?: number } =
                            (cell.style && cell.style.imageProperties) ? cell.style.imageProperties : {};
                        const hasExplicitW: boolean = typeof imgProps.width === 'number';
                        const hasExplicitH: boolean = typeof imgProps.height === 'number';
                        const fitType: number = imgProps.fitType;
                        const innerWidth: number = Math.max(cellWidth - effectivePadding.left -
                            effectivePadding.right, 1);
                        if (fitType === 3) {
                            contentHeight = intrinsicH;
                        } else if (hasExplicitW && hasExplicitH) {
                            const explicitW: number = imgProps.width as number;
                            const explicitH: number = imgProps.height as number;
                            if (fitType === 0) {
                                contentHeight = explicitW / ratio;
                            } else if (fitType === 1) {
                                contentHeight = explicitH;
                            } else if (fitType === 2) {
                                const scaleW: number = explicitW / intrinsicW;
                                const scaleH: number = explicitH / intrinsicH;
                                contentHeight = intrinsicH * Math.min(scaleW, scaleH);
                            } else {
                                contentHeight = explicitH;
                            }
                        } else if (hasExplicitW) {
                            contentHeight = (imgProps.width as number) / ratio;
                        } else if (hasExplicitH) {
                            contentHeight = imgProps.height as number;
                        } else if (fitType === 0) {
                            contentHeight = innerWidth / ratio;
                        } else if (fitType === 1 || fitType === 2) {
                            contentHeight = intrinsicH;
                        } else {
                            contentHeight = intrinsicH;
                        }
                    } else if (cell.value instanceof PdfGrid) {
                        const childGrid: PdfGrid = cell.value;
                        const innerWidth: number = Math.max(cellWidth - effectivePadding.left -
                            effectivePadding.right, 1);
                        contentHeight = childGrid._computeTotalGridHeight(innerWidth);
                    } else {
                        const text: string = this._getCellText(cell.value);
                        const innerWidth: number = Math.max(cellWidth - effectivePadding.left -
                            effectivePadding.right, 1);
                        const font: PdfFont = this._resolveTextProperties(cell, row, colCursor - 1).font ||
                            this._defaultFont;
                        contentHeight = this._measureCellTextHeight(text, font, innerWidth);
                    }
                    const required: number = contentHeight + effectivePadding.top + effectivePadding.bottom +
                        effectiveBorderWidth + effectiveSpacing.top + effectiveSpacing.bottom;
                    maxHeight = Math.max(maxHeight, required);
                }
                colCursor += cs - 1;
            });
            return Math.max(maxHeight, 4);
        });
        this._reconcileRowSpanHeights(allRows, columnWidths, rowHeights, descriptor);
        const rowY: number[] = new Array(rowCount).fill(0) as number[];
        rowY[0] = bounds.y;
        for (let i: number = 1; i < rowCount; i++) {
            rowY[i as number] = rowY[(i - 1) as number] + rowHeights[(i - 1) as number];
        }
        const occupied: boolean[][] = allRows.map(() => new Array(this._numberOfColumns).fill(false) as boolean[]);
        this._drawnBorderEdges.clear();
        allRows.forEach((row: PdfGridRow, rowIndex: number) => {
            const isHeader: boolean = rowIndex < headerCount;
            let colCursor: number = 0;
            row.cells.forEach((cell: PdfGridCell) => {
                while (colCursor < this._numberOfColumns && occupied[rowIndex as number][colCursor as number]) {
                    colCursor++;
                }
                if (colCursor >= this._numberOfColumns) {
                    return;
                }
                const cs: number = (cell.style && typeof cell.style.columnSpan === 'number') ?
                    (cell.style.columnSpan as number) : 1;
                const rs: number = (cell.style && typeof cell.style.rowSpan === 'number') ?
                    (cell.style.rowSpan as number) : 1;
                let cellWidth: number = 0;
                for (let dc: number = 0; dc < cs; dc++) {
                    cellWidth += columnWidths[(colCursor + dc) as number] || 0;
                }
                let cellHeight: number = 0;
                for (let dr: number = 0; dr < rs; dr++) {
                    cellHeight += rowHeights[(rowIndex + dr) as number] || 0;
                }
                let cellX: number = bounds.x;
                for (let dc: number = 0; dc < colCursor; dc++) {
                    cellX += columnWidths[dc as number] || 0;
                }
                const effectiveSpacing2: { left: number; right: number; top: number; bottom: number } =
                    this._resolveCellSpacing(cell, row, colCursor, descriptor);
                const cellBounds: Rectangle = {
                    x: cellX + effectiveSpacing2.left,
                    y: rowY[rowIndex as number] + effectiveSpacing2.top,
                    width: Math.max(cellWidth - effectiveSpacing2.left - effectiveSpacing2.right, 0),
                    height: Math.max(cellHeight - effectiveSpacing2.top - effectiveSpacing2.bottom, 0)
                };
                for (let dr: number = 0; dr < rs; dr++) {
                    for (let dc: number = 0; dc < cs; dc++) {
                        if (dr === 0 && dc === 0) {
                            continue;
                        }
                        occupied[(rowIndex + dr) as number][(colCursor + dc) as number] = true;
                    }
                }
                const effectiveBorder: _PdfResolvedGridBorder = this._resolveEffectiveBorder(cell, row, colCursor, descriptor);
                const isBanded: boolean = this._isBuiltInBandedRow(rowIndex, headerCount, isHeader);
                const effectiveBackground: PdfBrush | PdfBackgroundImage | null =
                    this._resolveEffectiveBackground(cell, row, colCursor, isHeader, descriptor, isBanded);
                if (effectiveBackground !== null && effectiveBackground instanceof PdfBrush) {
                    graphics.drawRectangle(cellBounds, effectiveBackground);
                }
                this._drawResolvedCellBorder(graphics, cellBounds, effectiveBorder, cell, row,
                                             colCursor, rowIndex, 0, allRows.length);
                const effectivePadding2: { left: number; right: number; top: number; bottom: number } =
                    this._resolveCellPadding(cell, row, colCursor, descriptor);
                const contentBounds: Rectangle = {
                    x: cellBounds.x + effectivePadding2.left,
                    y: cellBounds.y + effectivePadding2.top,
                    width: Math.max(cellBounds.width - effectivePadding2.left - effectivePadding2.right, 0),
                    height: Math.max(cellBounds.height - effectivePadding2.top - effectivePadding2.bottom, 0)
                };
                if (cell.value instanceof PdfImage) {
                    const imageBounds: Rectangle = this._resolveImageBounds(cell, row, colCursor, contentBounds);
                    graphics.drawImage(cell.value, imageBounds);
                } else if (cell.value instanceof PdfGrid) {
                    const childGrid: PdfGrid = cell.value;
                    if (contentBounds.width > 0 && contentBounds.height > 0) {
                        // T-50: Thread page context so child link annotations are emitted.
                        childGrid._layoutAndRender(graphics, contentBounds, page);
                    }
                } else {
                    const text: string = this._getCellText(cell.value);
                    if (text.length > 0) {
                        const textProperties: PdfTextProperties = this._resolveTextProperties(cell, row, colCursor);
                        const vAlign: PdfVerticalAlignment = this._mapVerticalAlignment(textProperties.verticalAlignment);
                        const resolvedText: { font: PdfFont; brush: PdfBrush; alignment: PdfTextAlignment } =
                            this._resolveBuiltInText(textProperties, isHeader, colCursor, descriptor);
                        const format: PdfStringFormat = new PdfStringFormat(resolvedText.alignment, vAlign);
                        const font: PdfFont = resolvedText.font;
                        const brush: PdfBrush = resolvedText.brush;
                        graphics.drawString(text, font, contentBounds, brush, format);
                    }
                }
                colCursor += cs;
            });
        });
        if (typeof page !== 'undefined') {
            let annotCursorY: number = bounds.y;
            const annotAllRows: PdfGridRow[] = this._headers.concat(this._records);
            for (let ri: number = 0; ri < annotAllRows.length; ri++) {
                const annotRow: PdfGridRow = annotAllRows[ri as number];
                const annotRowHeight: number = rowHeights[ri as number];
                let annotCursorX: number = bounds.x;
                let annotColCursor: number = 0;
                for (let ci: number = 0; ci < annotRow.cells.length; ci++) {
                    const annotCell: PdfGridCell = annotRow.cells[ci as number];
                    const cs: number = (annotCell.style && typeof annotCell.style.columnSpan === 'number')
                        ? (annotCell.style.columnSpan as number) : 1;
                    let annotCellWidth: number = 0;
                    for (let dc: number = 0; dc < cs; dc++) {
                        annotCellWidth += columnWidths[(annotColCursor + dc) as number] || 0;
                    }
                    const annotCellBounds: Rectangle = {
                        x: annotCursorX, y: annotCursorY,
                        width: annotCellWidth, height: annotRowHeight
                    };
                    const link: PdfLink = annotCell.link;
                    if (typeof link !== 'undefined') {
                        this._createLinkAnnotation(page, annotCellBounds, link);
                    } else {
                        const cellValue: any = annotCell.value; // eslint-disable-line
                        if (typeof cellValue === 'string' && _isTextDerivedHyperlink(cellValue)) {
                            const uriAnnotation: PdfUriAnnotation = new PdfUriAnnotation(annotCellBounds, cellValue);
                            page.annotations.add(uriAnnotation);
                        }
                    }
                    annotCursorX += annotCellWidth;
                    annotColCursor += cs;
                }
                annotCursorY += annotRowHeight;
            }
        }
        const totalWidth: number = columnWidths.reduce((sum: number, width: number) => sum + width, 0);
        const totalHeight: number = rowHeights.reduce((sum: number, h: number) => sum + h, 0);
        return { x: bounds.x, y: bounds.y, width: totalWidth, height: totalHeight };
    }
    /**
     * Validates a single spacing value. Throws if the value is not a finite number >= 0.
     *
     * @private
     * @param {any} value The value to validate.
     * @param {string} side The spacing side name for error messaging.
     * @param {string} context A descriptor for error messaging (e.g. "row 2 cell 1").
     * @returns {void}
     */
    _validateSpacingValue(value: any, side: string, context: string): void { // eslint-disable-line
        if (typeof value !== 'number') {
            throw new Error(`PdfGrid spacing validation failed at ${context}: '${side}'
                            must be a finite number >= 0; received type '${typeof value}'.`);
        }
        const n: number = value as number;
        if (!isFinite(n) || isNaN(n)) {
            throw new Error(`PdfGrid spacing validation failed at ${context}: '${side}'
                             must be a finite number >= 0; received ${n}.`);
        }
        if (n < 0) {
            throw new Error(`PdfGrid spacing validation failed at ${context}: '${side}'
                             must be a finite number >= 0; received ${n}.`);
        }
    }
    /**
     * Validates all spacing values on rows, cells, column styles, and the grid style before rendering.
     * Throws before any target modification if any spacing value is invalid.
     *
     * @private
     * @returns {void}
     */
    _validateAllSpacing(): void {
        if (this._style && typeof this._style.space !== 'undefined') {
            const gs: number = this._style.space;
            if (typeof gs !== 'number') {
                throw new Error('PdfGrid style space must be a positive finite number.');
            }
            if (!Number.isFinite(gs) || gs <= 0) {
                throw new Error('PdfGrid style space must be a positive finite number.');
            }
        }
    }
    /**
     * Resolves effective four-sided spacing for a cell using the full 5-level precedence chain.
     * When a numeric space value is provided, it is applied equally to all four sides.
     *
     * @private
     * @param {PdfGridCell} cell The cell being resolved.
     * @param {PdfGridRow} row The row containing the cell.
     * @param {number} colIndex The zero-based column index of the cell.
     * @param {_PdfBuiltInDescriptor} descriptor The built-in style descriptor or null.
     * @returns {object} Effective spacing.
     * @property {number} left Left spacing.
     * @property {number} right Right spacing.
     * @property {number} top Top spacing.
     * @property {number} bottom Bottom spacing.
     */
    _resolveCellSpacing(cell: PdfGridCell, row: PdfGridRow, colIndex: number,
                        descriptor: _PdfBuiltInDescriptor): { left: number; right: number; top: number; bottom: number } {
        const gridSpace: number | undefined = this._style ? this._style.space : undefined;
        const builtInTop: number = descriptor ? (descriptor.cellSpacingTop || 0) : 0;
        const builtInBottom: number = descriptor ? (descriptor.cellSpacingBottom || 0) : 0;
        const builtInLeft: number = descriptor ? (descriptor.cellSpacingLeft || 0) : 0;
        const builtInRight: number = descriptor ? (descriptor.cellSpacingRight || 0) : 0;
        const effectiveSpace: number = typeof gridSpace === 'number' && gridSpace > 0 ? gridSpace : 0;
        const top: number = effectiveSpace > 0 ? effectiveSpace : builtInTop;
        const bottom: number = effectiveSpace > 0 ? effectiveSpace : builtInBottom;
        const left: number = effectiveSpace > 0 ? effectiveSpace : builtInLeft;
        const right: number = effectiveSpace > 0 ? effectiveSpace : builtInRight;
        return { left, right, top, bottom };
    }
    /**
     * Validates all explicit row heights in the given row array before any rendering occurs.
     * Throws if any explicit height is zero, negative, non-finite, or of a non-number type.
     *
     * @private
     * @param {PdfGridRow[]} rows All rows (headers + records) to validate.
     * @returns {void}
     */
    _validateRowHeights(rows: PdfGridRow[]): void {
        rows.forEach((row: PdfGridRow, rowIndex: number) => {
            if (typeof row.height !== 'undefined') {
                const h: any = row.height; // eslint-disable-line
                if (typeof h !== 'number') {
                    throw new Error(`PdfGrid row height at index ${rowIndex}
                        must be a finite positive number; received type '${typeof h}'.`);
                }
                const hNum: number = h as number;
                if (!isFinite(hNum) || isNaN(hNum)) {
                    throw new Error(`PdfGrid row height at index ${rowIndex}
                        must be a finite positive number; received ${hNum}.`);
                }
                if (hNum <= 0) {
                    throw new Error(`PdfGrid row height at index ${rowIndex}
                        must be a finite positive number; received ${hNum}.`);
                }
            }
        });
    }
    /**
     * Reconciles row-span height deficits. For each cell with rowSpan > 1, measures its required height
     * and distributes any deficit proportionally across the covered auto-height rows.
     *
     * @private
     * @param {PdfGridRow[]} allRows All rows (headers + records).
     * @param {number[]} columnWidths Resolved column widths.
     * @param {number[]} rowHeights Mutable row-height array to adjust in-place.
     * @param {_PdfBuiltInDescriptor} descriptor Built-in style descriptor or null.
     * @returns {void}
     */
    _reconcileRowSpanHeights(allRows: PdfGridRow[], columnWidths: number[], rowHeights: number[],
                             descriptor: _PdfBuiltInDescriptor): void {
        allRows.forEach((row: PdfGridRow, rowIndex: number) => {
            let colCursor: number = 0;
            row.cells.forEach((cell: PdfGridCell, cellIndex: number) => { // eslint-disable-line
                const cs: number = (cell.style && typeof cell.style.columnSpan === 'number') ?
                    (cell.style.columnSpan as number) : 1;
                const rs: number = (cell.style && typeof cell.style.rowSpan === 'number') ?
                    (cell.style.rowSpan as number) : 1;
                if (rs > 1) {
                    let spanWidth: number = 0;
                    for (let dc: number = 0; dc < cs; dc++) {
                        spanWidth += columnWidths[(colCursor + dc) as number] || 0;
                    }
                    const effectivePadding: { left: number; right: number; top: number; bottom: number } =
                        this._resolveCellPadding(cell, row, colCursor, descriptor);
                    const effectiveBorderWidth: number = this._resolveCellBorderWidth(cell, row, colCursor - 1, descriptor);
                    let contentHeight: number = 0;
                    if (cell.value instanceof PdfImage) {
                        const image: PdfImage = cell.value;
                        const intrinsicW: number = image.width > 0 ? image.width : 1;
                        const intrinsicH: number = image.height > 0 ? image.height : 1;
                        const ratio: number = intrinsicW / intrinsicH;
                        const imgProps: { width?: number; height?: number; fitType?: number } =
                            (cell.style && cell.style.imageProperties) ? cell.style.imageProperties : {};
                        const hasExplicitW: boolean = typeof imgProps.width === 'number';
                        const hasExplicitH: boolean = typeof imgProps.height === 'number';
                        const fitType: number = imgProps.fitType;
                        const innerWidth: number = Math.max(spanWidth - effectivePadding.left - effectivePadding.right, 1);
                        if (hasExplicitW && hasExplicitH) {
                            const explicitW: number = imgProps.width as number;
                            const explicitH: number = imgProps.height as number;
                            if (fitType === 0) {
                                contentHeight = explicitW / ratio;
                            } else if (fitType === 1) {
                                contentHeight = explicitH;
                            } else if (fitType === 2) {
                                contentHeight = intrinsicH * Math.min(explicitW / intrinsicW, explicitH / intrinsicH);
                            } else {
                                contentHeight = explicitH;
                            }
                        } else if (hasExplicitW) {
                            contentHeight = (imgProps.width as number) / ratio;
                        } else if (hasExplicitH) {
                            contentHeight = imgProps.height as number;
                        } else if (fitType === 0) {
                            contentHeight = innerWidth / ratio;
                        } else {
                            contentHeight = intrinsicH;
                        }
                    } else {
                        const text: string = this._getCellText(cell.value);
                        const innerWidth: number = Math.max(spanWidth - effectivePadding.left - effectivePadding.right, 1);
                        const font: PdfFont = this._resolveTextProperties(cell, row, colCursor - 1).font ||
                            this._defaultFont;
                        contentHeight = this._measureCellTextHeight(text, font, innerWidth);
                    }
                    const effectiveSpacing: { left: number; right: number; top: number; bottom: number } =
                        this._resolveCellSpacing(cell, row, colCursor, descriptor);
                    const requiredHeight: number = contentHeight + effectivePadding.top + effectivePadding.bottom +
                        effectiveBorderWidth + effectiveSpacing.top + effectiveSpacing.bottom;
                    const effectiveRs: number = Math.min(rs, allRows.length - rowIndex);
                    let coveredHeight: number = 0;
                    for (let dr: number = 0; dr < effectiveRs; dr++) {
                        coveredHeight += rowHeights[(rowIndex + dr) as number] || 0;
                    }
                    const deficit: number = requiredHeight - coveredHeight;
                    if (deficit > 0) {
                        const autoRows: number[] = [];
                        for (let dr: number = 0; dr < effectiveRs; dr++) {
                            const coveredRow: PdfGridRow = allRows[(rowIndex + dr) as number];
                            if (coveredRow && typeof coveredRow.height !== 'number') {
                                autoRows.push(rowIndex + dr);
                            }
                        }
                        if (autoRows.length > 0) {
                            const share: number = deficit / autoRows.length;
                            autoRows.forEach((idx: number) => {
                                rowHeights[idx as number] += share;
                            });
                        } else {
                            // All covered rows are explicit — distribute across all covered rows
                            const share: number = deficit / effectiveRs;
                            for (let dr: number = 0; dr < effectiveRs; dr++) {
                                rowHeights[(rowIndex + dr) as number] += share;
                            }
                        }
                    }
                }
                colCursor += cs;
            });
        });
    }
    /**
     * Validates a single padding value. Throws if the value is not a finite number >= 0.
     *
     * @private
     * @param {any} value The value to validate.
     * @param {string} side The padding side name for error messaging.
     * @param {string} context A descriptor for error messaging (e.g. "row 2 cell 1").
     * @returns {void}
     */
    _validatePaddingValue(value: any, side: string, context: string): void { // eslint-disable-line
        if (typeof value !== 'number') {
            throw new Error(`PdfGrid padding validation failed at ${context}: '${side}'
                must be a finite number >= 0; received type '${typeof value}'.`);
        }
        const n: number = value as number;
        if (!isFinite(n) || isNaN(n)) {
            throw new Error(`PdfGrid padding validation failed at ${context}: '${side}'
                must be a finite number >= 0; received ${n}.`);
        }
        if (n < 0) {
            throw new Error(`PdfGrid padding validation failed at ${context}: '${side}'
                must be a finite number >= 0; received ${n}.`);
        }
    }
    /**
     * Validates all padding objects on rows, cells, column styles, and the grid style before rendering.
     * Throws before any target modification if any padding value is invalid.
     *
     * @private
     * @param {PdfGridRow[]} allRows All rows (headers + records).
     * @returns {void}
     */
    _validateAllPadding(allRows: PdfGridRow[]): void {
        const sides: string[] = ['left', 'right', 'top', 'bottom'];
        if (this._style && this._style.padding) {
            const gp: PdfPaddings = this._style.padding;
            sides.forEach((side: string) => {
                const v: any = (gp as Record<string, any>)[side]; // eslint-disable-line
                if (typeof v !== 'undefined') {
                    this._validatePaddingValue(v, side, 'grid style');
                }
            });
        }
        this._columns.forEach((col: PdfColumnInformation, colIdx: number) => {
            if (col.style && col.style.padding) {
                const colPad: PdfPaddings = col.style.padding;
                sides.forEach((side: string) => {
                    const v: any = (colPad as Record<string, any>)[<string>side]; // eslint-disable-line
                    if (typeof v !== 'undefined') {
                        this._validatePaddingValue(v, side, `column ${colIdx} style`);
                    }
                });
            }
        });
        allRows.forEach((row: PdfGridRow, rowIndex: number) => {
            if (row.style && row.style.padding) {
                const rp: PdfPaddings = row.style.padding;
                sides.forEach((side: string) => {
                    const v: any = (rp as Record<string, any>)[side]; // eslint-disable-line
                    if (typeof v !== 'undefined') {
                        this._validatePaddingValue(v, side, `row ${rowIndex} style`);
                    }
                });
            }
            row.cells.forEach((cell: PdfGridCell, cellIndex: number) => {
                if (cell.style && cell.style.padding) {
                    const cellPad: PdfPaddings = cell.style.padding;
                    sides.forEach((side: string) => {
                        const v: any = (cellPad as Record<string, any>)[side]; // eslint-disable-line
                        if (typeof v !== 'undefined') {
                            this._validatePaddingValue(v, side, `row ${rowIndex} cell ${cellIndex} style`);
                        }
                    });
                }
            });
        });
    }
    /**
     * Resolves effective four-sided padding for a cell using the full 5-level precedence chain.
     * Precedence per side: cell → row → column (data-source only) → grid → built-in → internal default.
     *
     * @private
     * @param {PdfGridCell} cell The cell being resolved.
     * @param {PdfGridRow} row The row containing the cell.
     * @param {number} colIndex The zero-based column index of the cell.
     * @param {_PdfBuiltInDescriptor} descriptor The built-in style descriptor or null.
     * @returns {object} Effective padding.
     */
    _resolveCellPadding(cell: PdfGridCell, row: PdfGridRow, colIndex: number,
                        descriptor: _PdfBuiltInDescriptor): { left: number; right: number;
            top: number; bottom: number } {
        const cellPad: PdfPaddings = cell.style ? cell.style.padding : undefined;
        const rowPad: PdfPaddings = row.style ? row.style.padding : undefined;
        const colStyle: PdfGridColumnStyle = this._resolveColumnStyle(colIndex);
        const colPad: PdfPaddings = colStyle ? colStyle.padding : undefined;
        const gridPad: PdfPaddings = this._style ? this._style.padding : undefined;
        const builtInLeft: number = descriptor ? (descriptor.cellPaddingLeft || 0) : 0;
        const builtInRight: number = descriptor ? (descriptor.cellPaddingRight || 0) : 0;
        const builtInTop: number = descriptor ? (descriptor.cellPaddingTop || 0) : 0;
        const builtInBottom: number = descriptor ? (descriptor.cellPaddingBottom || 0) : 0;
        let left: number = this._defaultPadding.left;
        if (cellPad && typeof cellPad.left === 'number') {
            left = cellPad.left;
        } else if (rowPad && typeof rowPad.left === 'number') {
            left = rowPad.left;
        } else if (colPad && typeof colPad.left === 'number') {
            left = colPad.left;
        } else if (gridPad && typeof gridPad.left === 'number') {
            left = gridPad.left;
        } else if (descriptor) {
            left = builtInLeft;
        }
        let right: number = this._defaultPadding.right;
        if (cellPad && typeof cellPad.right === 'number') {
            right = cellPad.right;
        } else if (rowPad && typeof rowPad.right === 'number') {
            right = rowPad.right;
        } else if (colPad && typeof colPad.right === 'number') {
            right = colPad.right;
        } else if (gridPad && typeof gridPad.right === 'number') {
            right = gridPad.right;
        } else if (descriptor) {
            right = builtInRight;
        }
        let top: number = this._defaultPadding.top;
        if (cellPad && typeof cellPad.top === 'number') {
            top = cellPad.top;
        } else if (rowPad && typeof rowPad.top === 'number') {
            top = rowPad.top;
        } else if (colPad && typeof colPad.top === 'number') {
            top = colPad.top;
        } else if (gridPad && typeof gridPad.top === 'number') {
            top = gridPad.top;
        } else if (descriptor) {
            top = builtInTop;
        }
        let bottom: number = this._defaultPadding.bottom;
        if (cellPad && typeof cellPad.bottom === 'number') {
            bottom = cellPad.bottom;
        } else if (rowPad && typeof rowPad.bottom === 'number') {
            bottom = rowPad.bottom;
        } else if (colPad && typeof colPad.bottom === 'number') {
            bottom = colPad.bottom;
        } else if (gridPad && typeof gridPad.bottom === 'number') {
            bottom = gridPad.bottom;
        } else if (descriptor) {
            bottom = builtInBottom;
        }
        return { left, right, top, bottom };
    }
    /**
     * Resolves the effective border width of a cell.
     *
     * @private
     * @param {PdfGridCell} cell Current cell.
     * @param {PdfGridRow} row Current row.
     * @param {number} colIndex Current column index.
     * @param {_PdfBuiltInDescriptor} descriptor Built-in style descriptor.
     * @returns {number} Effective border width.
     */
    _resolveCellBorderWidth(cell: PdfGridCell, row: PdfGridRow, colIndex: number,
                            descriptor: _PdfBuiltInDescriptor): number {
        const b: _PdfResolvedGridBorder = this._resolveEffectiveBorder(cell, row, colIndex, descriptor);
        return Math.max(b.left.width, b.right.width, b.top.width, b.bottom.width);
    }
    /**
     * Maps a PdfTemplateHorizontalAlignment to the corresponding PdfTextAlignment.
     *
     * @private
     * @param {PdfTemplateHorizontalAlignment} alignment Source alignment.
     * @returns {PdfTextAlignment} Mapped PdfTextAlignment.
     */
    _mapHorizontalAlignment(alignment: PdfTemplateHorizontalAlignment): PdfTextAlignment {
        switch (alignment) {
        case PdfTemplateHorizontalAlignment.center:
            return PdfTextAlignment.center;
        case PdfTemplateHorizontalAlignment.right:
            return PdfTextAlignment.right;
        default:
            return PdfTextAlignment.left;
        }
    }
    /**
     * Maps a PdfTemplateVerticalAlignment to the corresponding PdfVerticalAlignment.
     *
     * @private
     * @param {PdfTemplateVerticalAlignment} alignment Source alignment.
     * @returns {PdfVerticalAlignment} Mapped PdfVerticalAlignment.
     */
    _mapVerticalAlignment(alignment: PdfTemplateVerticalAlignment): PdfVerticalAlignment {
        switch (alignment) {
        case PdfTemplateVerticalAlignment.middle:
            return PdfVerticalAlignment.middle;
        case PdfTemplateVerticalAlignment.bottom:
            return PdfVerticalAlignment.bottom;
        default:
            return PdfVerticalAlignment.top;
        }
    }
    /**
     * Validates the image resource and image dimension properties of a cell before any rendering takes place.
     *
     * @private
     * @param {PdfGridCell} cell The cell whose image is to be validated.
     * @param {number} cellIndex Zero-based visual column index of the cell.
     * @param {number} rowIndex Zero-based row index.
     * @returns {void} Nothing.
     */
    _validateImageCell(cell: PdfGridCell, cellIndex: number, rowIndex: number): void {
        if (!(cell.value instanceof PdfImage)) {
            throw new Error(`PdfGrid image validation failed at row ${rowIndex}, cell ${cellIndex}: cell value is not a valid PdfImage instance.`);
        }
        if (cell.style && cell.style.imageProperties) {
            const img: { width?: number; height?: number } = cell.style.imageProperties;
            if (typeof img.width === 'number') {
                if (!isFinite(img.width) || img.width <= 0) {
                    throw new Error(`PdfGrid image validation failed at row ${rowIndex}, cell ${cellIndex}: explicit image width must be a finite positive number.`);
                }
            }
            if (typeof img.height === 'number') {
                if (!isFinite(img.height) || img.height <= 0) {
                    throw new Error(`PdfGrid image validation failed at row ${rowIndex}, cell ${cellIndex}: explicit image height must be a finite positive number.`);
                }
            }
        }
    }
    /**
     * Resolves the image drawing bounds within a cell.
     *
     * @private
     * @param {PdfGridCell} cell Cell containing the image.
     * @param {PdfGridRow} row Current row.
     * @param {number} colIndex Current column index.
     * @param {Rectangle} contentBounds Available content bounds.
     * @returns {Rectangle} Resolved image bounds.
     */
    _resolveImageBounds(cell: PdfGridCell, row: PdfGridRow, colIndex: number, contentBounds: Rectangle): Rectangle {
        const image: PdfImage = cell.value as PdfImage;
        const intrinsicW: number = image.width > 0 ? image.width : 1;
        const intrinsicH: number = image.height > 0 ? image.height : 1;
        const ratio: number = intrinsicW / intrinsicH;
        const imgProps: PdfImageProperties = this._resolveImageProperties(cell, row, colIndex);
        return _resolveImageDrawBounds(intrinsicW, intrinsicH, ratio, imgProps, contentBounds);
    }
    /**
     * Resolves the drawing bounds for a cell background image.
     *
     * @private
     * @param {PdfBackgroundImage} bgConfig Background image configuration.
     * @param {Rectangle} contentBounds Available content bounds.
     * @returns {Rectangle} Resolved image bounds.
     */
    _resolveBackgroundImageBounds(bgConfig: PdfBackgroundImage, contentBounds: Rectangle): Rectangle {
        const image: PdfImage = bgConfig.image;
        const intrinsicW: number = image.width > 0 ? image.width : 1;
        const intrinsicH: number = image.height > 0 ? image.height : 1;
        const ratio: number = intrinsicW / intrinsicH;
        const imgProps: PdfImageProperties = bgConfig.imageProperties || {};
        return _resolveImageDrawBounds(intrinsicW, intrinsicH, ratio, imgProps, contentBounds);
    }
    /**
     * Resolves the effective border pen for a cell.
     *
     * @private
     * @param {PdfGridCell} cell Current cell.
     * @param {PdfGridRow} row Current row.
     * @param {number} colIndex Current column index.
     * @returns {boolean} Explicite border true/false.
     */
    _hasExplicitBorder(cell: PdfGridCell, row: PdfGridRow, colIndex: number): boolean {
        if (cell.style && cell.style.border) { return true; }
        if (row.style && row.style.border) { return true; }
        const columnStyle: PdfGridColumnStyle = this._resolveColumnStyle(colIndex);
        return !!((columnStyle && columnStyle.border) || (this._style && this._style.border));
    }
    /**
     * Determines if the provided value is an instance of PdfPen.
     *
     * @private
     * @param {any} value The value to check.
     * @returns {boolean} True if the value is a PdfPen, otherwise false.
     */
    _isPdfPen(value: any): value is PdfPen { return value instanceof PdfPen; } // eslint-disable-line
    /**
     * Initializes the border mode based on the provided style.
     *
     * @private
     * @param {PdfGridStyle} style The grid style containing border information.
     * @returns {void}
     */
    _initializeBorderMode(style: PdfGridStyle): void {
        const border: any = style ? style.border : undefined; // eslint-disable-line
        this._borderType = border && !this._isPdfPen(border) && typeof border.type === 'number'
            ? border.type : PdfGridBorderType.All;
        this._validateBorderMask(this._borderType);
    }
    /**
     * Validates the provided border mask value.
     *
     * @private
     * @param {PdfGridBorderType} value The border mask value to validate.
     * @throws {Error} If the value is not a valid PdfGridBorderType mask.
     * @returns {void}
     */
    _validateBorderMask(value: PdfGridBorderType): void {
        const known: number = PdfGridBorderType.All | PdfGridBorderType.Left | PdfGridBorderType.Right |
            PdfGridBorderType.Top | PdfGridBorderType.Bottom | PdfGridBorderType.InsideVertical |
            PdfGridBorderType.InsideHorizontal | PdfGridBorderType.Inside | PdfGridBorderType.Outside;
        if (typeof value !== 'number' || !Number.isFinite(value) || Math.floor(value) !== value || value < 0 || (value & ~known) !== 0) {
            throw new Error('PdfGrid border type contains an invalid PdfGridBorderType mask.');
        }
    }
    /**
     * Normalizes the border mask value and returns an object indicating which borders are selected.
     *
     * @private
     * @param {PdfGridBorderType} value The border mask value to normalize.
     * @returns {object} An object with boolean flags for each border side.
     */
    _normalizeBorderMask(value: PdfGridBorderType): any { // eslint-disable-line
        this._validateBorderMask(value);
        let mask: number = value;
        if ((mask & PdfGridBorderType.Inside) !== 0) {
            mask |= PdfGridBorderType.InsideVertical | PdfGridBorderType.InsideHorizontal;
        }
        if ((mask & PdfGridBorderType.Outside) !== 0) {
            mask |= PdfGridBorderType.Left | PdfGridBorderType.Right | PdfGridBorderType.Top | PdfGridBorderType.Bottom;
        }
        const exclude: boolean = (mask & PdfGridBorderType.All) !== 0;
        const selected: (flag: PdfGridBorderType) => boolean = (flag: PdfGridBorderType): boolean =>
            exclude ? (mask & flag) === 0 : (mask & flag) !== 0;
        return {
            left: selected(PdfGridBorderType.Left),
            right: selected(PdfGridBorderType.Right),
            top: selected(PdfGridBorderType.Top),
            bottom: selected(PdfGridBorderType.Bottom),
            insideVertical: selected(PdfGridBorderType.InsideVertical),
            insideHorizontal: selected(PdfGridBorderType.InsideHorizontal)
        };
    }
    /**
     * Creates a copy of the provided PdfPen instance.
     *
     * @private
     * @param {PdfPen} pen The pen to copy.
     * @returns {PdfPen} A new PdfPen instance with the same properties.
     */
    _copyPen(pen: PdfPen): PdfPen {
        const source: any = pen as any; // eslint-disable-line
        const result: PdfPen = new PdfPen(source.color || { r: 0, g: 0, b: 0 }, source.width);
        const target: any = result as any; // eslint-disable-line
        if (typeof source.style !== 'undefined') {
            target.style = source.style;
        }
        if (typeof source.dashStyle !== 'undefined') {
            target.dashStyle = source.dashStyle;
        }
        if (typeof source.dashOffset !== 'undefined') {
            target.dashOffset = source.dashOffset;
        }
        if (typeof source.dashPattern !== 'undefined') {
            target.dashPattern = Array.isArray(source.dashPattern) ? source.dashPattern.slice() : source.dashPattern;
        }
        if (typeof source.lineCap !== 'undefined') {
            target.lineCap = source.lineCap;
        }
        if (typeof source.lineJoin !== 'undefined') {
            target.lineJoin = source.lineJoin;
        }
        return result;
    }
    /**
     * Resolves the effective pen for a specific border side, inheriting properties as needed.
     *
     * @private
     * @param {PdfGridPen} side The side-specific pen definition.
     * @param {PdfPen} inherited The inherited pen to use as a base.
     * @param {number} [width] Optional width override.
     * @returns {PdfPen} The resolved PdfPen for the border side.
     */
    _sidePen(side: PdfGridPen, inherited: PdfPen, width?: number): PdfPen {
        const source: any = side || {}; const parent: any = inherited as any; // eslint-disable-line
        const result: PdfPen = new PdfPen(
            source.color || parent.color || { r: 0, g: 0, b: 0 },
            typeof width === 'number' ? width : inherited.width
        );
        const target: any = result as any; // eslint-disable-line
        target.style = typeof source.style !== 'undefined' ? source.style : parent.style;
        target.dashStyle = target.style;
        target.dashOffset = typeof source.dashOffset !== 'undefined' ? source.dashOffset : parent.dashOffset;
        const pattern: number[] = source.dashPattern || parent.dashPattern;
        if (Array.isArray(pattern)) { target.dashPattern = pattern.slice(); }
        return result;
    }
    /**
     * Merges a border definition into a base resolved border, applying overrides as needed.
     *
     * @private
     * @param {_PdfResolvedGridBorder} base The base resolved border.
     * @param {_PdfGridBorderSource} value The border source to merge.
     * @returns {_PdfResolvedGridBorder} The merged resolved border.
     */
    _mergeBorderLevel(base: _PdfResolvedGridBorder, value: _PdfGridBorderSource): _PdfResolvedGridBorder {
        if (!value) { return base; }
        if (this._isPdfPen(value)) {
            const p: PdfPen = this._copyPen(value);
            return {
                left: this._copyPen(p),
                right: this._copyPen(p),
                top: this._copyPen(p),
                bottom: this._copyPen(p),
                renderMode: 'rectangle'
            };
        }
        const wrapper: any = value as any; // eslint-disable-line
        const p: PdfGridBorderPen = (wrapper.pen || wrapper) as PdfGridBorderPen;
        const width: number | undefined = p && typeof p.width === 'number' ? p.width : undefined;
        const leftBorder: PdfPen = p && p.left ? this._sidePen(p.left, base.left, width) :
            (typeof width === 'number' ? this._sidePen(undefined, base.left, width) : base.left);
        const rightBorder: PdfPen = p && p.right ? this._sidePen(p.right, base.right, width) :
            (typeof width === 'number' ? this._sidePen(undefined, base.right, width) : base.right);
        const topBorder: PdfPen = p && p.top ? this._sidePen(p.top, base.top, width) :
            (typeof width === 'number' ? this._sidePen(undefined, base.top, width) : base.top);
        const bottomBorder: PdfPen = p && p.bottom ? this._sidePen(p.bottom, base.bottom, width) :
            (typeof width === 'number' ? this._sidePen(undefined, base.bottom, width) : base.bottom);
        return {
            left: leftBorder,
            right: rightBorder,
            top: topBorder,
            bottom: bottomBorder,
            renderMode: 'lines'
        };
    }
    /**
     * Resolves the effective border for a cell, considering all style precedence levels.
     *
     * @private
     * @param {PdfGridCell} cell The current cell.
     * @param {PdfGridRow} row The current row.
     * @param {number} colIndex The column index of the cell.
     * @param {_PdfBuiltInDescriptor} descriptor The built-in style descriptor.
     * @returns {_PdfResolvedGridBorder} The resolved border for the cell.
     */
    _resolveEffectiveBorder(
        cell: PdfGridCell,
        row: PdfGridRow,
        colIndex: number,
        descriptor: _PdfBuiltInDescriptor
    ): _PdfResolvedGridBorder {
        const penColor: PdfPen = descriptor ? new PdfPen(descriptor.borderColor, descriptor.borderWidth) :
            this._defaultBorder;
        const p: PdfPen = penColor;
        let result: _PdfResolvedGridBorder = {
            left: this._copyPen(p),
            right: this._copyPen(p),
            top: this._copyPen(p),
            bottom: this._copyPen(p),
            renderMode: 'rectangle'
        };
        if (this._style.border) {
            result = this._mergeBorderLevel(result, this._style.border as any); // eslint-disable-line
        }
        const columnStyle: PdfGridColumnStyle = this._resolveColumnStyle(colIndex);
        if (columnStyle && columnStyle.border) {
            result = this._mergeBorderLevel(result, columnStyle.border as PdfPen | PdfGridBorderPen);
        }
        if (row.style && row.style.border) {
            result = this._mergeBorderLevel(result, row.style.border as PdfPen | PdfGridBorderPen);
        }
        if (cell.style && cell.style.border) {
            result = this._mergeBorderLevel(result, cell.style.border as PdfPen | PdfGridBorderPen);
        }
        if (this._borderType !== PdfGridBorderType.All) { result.renderMode = 'lines'; }
        return result;
    }
    /**
     * Generates a unique key for an edge defined by two points.
     *
     * @private
     * @param {Point} a The first point.
     * @param {Point} b The second point.
     * @returns {string} The unique edge key.
     */
    _edgeKey(a: Point, b: Point): string {
        const first: string = `${a.x.toFixed(4)},${a.y.toFixed(4)}`;
        const second: string = `${b.x.toFixed(4)},${b.y.toFixed(4)}`;
        return first < second ? `${first}|${second}` : `${second}|${first}`;
    }
    /**
     * Draws a border line if it has not already been drawn for the given edge.
     *
     * @private
     * @param {PdfGraphics} graphics The graphics context to draw on.
     * @param {PdfPen} pen The pen to use for drawing.
     * @param {Point} a The starting point of the line.
     * @param {Point} b The ending point of the line.
     * @returns {void}
     */
    _drawOwnedBorderLine(graphics: PdfGraphics, pen: PdfPen, a: Point, b: Point): void {
        if (!pen || pen.width <= 0) { return; }
        const key: string = this._edgeKey(a, b);
        if (!this._drawnBorderEdges.has(key)) { this._drawnBorderEdges.add(key); graphics.drawLine(pen, a, b); }
    }
    /**
     * Draws the resolved border for a cell, handling all border sides and styles.
     *
     * @private
     * @param {PdfGraphics} graphics The graphics context to draw on.
     * @param {Rectangle} cellBounds The bounds of the cell.
     * @param {any} border The resolved border object.
     * @param {PdfGridCell} cell The current cell.
     * @param {PdfGridRow} row The current row.
     * @param {number} colIndex The column index of the cell.
     * @param {number} rowIndex The row index of the cell.
     * @param {number} firstVisibleRowIndex The first visible row index in the current slice.
     * @param {number} lastVisibleRowIndex The last visible row index in the current slice.
     * @returns {void}
     */
    _drawResolvedCellBorder(graphics: PdfGraphics, cellBounds: Rectangle, border: any, // eslint-disable-line
                            cell: PdfGridCell, row: PdfGridRow, colIndex: number,
                            rowIndex: number, firstVisibleRowIndex: number,
                            lastVisibleRowIndex: number): void {
        const resolved: _PdfResolvedGridBorder = border && border.renderMode ? border : this._mergeBorderLevel({
            left: this._copyPen(this._defaultBorder), right: this._copyPen(this._defaultBorder),
            top: this._copyPen(this._defaultBorder), bottom: this._copyPen(this._defaultBorder), renderMode: 'rectangle'
        }, border);
        const builtInRules: _PdfBuiltInRules = this._getBuiltInRules();
        if (builtInRules && builtInRules.customBorders && !this._hasExplicitBorder(cell, row, colIndex)) {
            this._drawBuiltInRuleBorder(graphics, cellBounds, resolved, cell, colIndex, rowIndex,
                                        firstVisibleRowIndex, lastVisibleRowIndex, builtInRules);
            return;
        }
        const horizontalOnly: boolean = this._builtInStyle === PdfGridBuiltinStyle.plainTable2 &&
            !this._hasExplicitBorder(cell, row, colIndex);
        if (resolved.renderMode === 'rectangle' && !horizontalOnly) {
            let rectangleBounds: Rectangle = this._resolveBorderBounds(cellBounds, resolved.left);
            const halfWidth: number = Math.max(resolved.left.width, 0) / 2;
            const pageEdgeTolerance: number = 1e-6;
            if (halfWidth > 0 && rectangleBounds.y <= pageEdgeTolerance) {
                rectangleBounds = {
                    x: rectangleBounds.x,
                    y: rectangleBounds.y + halfWidth,
                    width: rectangleBounds.width,
                    height: Math.max(rectangleBounds.height - halfWidth, 0)
                };
            }
            if (halfWidth > 0 && rectangleBounds.x <= pageEdgeTolerance) {
                rectangleBounds = {
                    x: rectangleBounds.x + halfWidth,
                    y: rectangleBounds.y,
                    width: Math.max(rectangleBounds.width - halfWidth, 0),
                    height: rectangleBounds.height
                };
            }
            graphics.drawRectangle(rectangleBounds, resolved.left);
            return;
        }
        const mask: any = this._normalizeBorderMask(this._borderType); // eslint-disable-line
        const cs: number = cell.style && typeof cell.style.columnSpan === 'number' ? cell.style.columnSpan : 1;
        const rs: number = cell.style && typeof cell.style.rowSpan === 'number' ? cell.style.rowSpan : 1;
        const firstCol: boolean = colIndex === 0;
        const lastCol: boolean = colIndex + cs >= this._numberOfColumns;
        // Top remains a logical-grid boundary and is drawn only on the first grid page.
        const firstRow: boolean = rowIndex === 0;
        const isRepeatedHeaderOnlySlice: boolean = firstVisibleRowIndex === 0 &&
            lastVisibleRowIndex <= this._headers.length &&
            lastVisibleRowIndex < this._headers.length + this._records.length;
        const lastRow: boolean = !isRepeatedHeaderOnlySlice &&
            rowIndex + rs >= lastVisibleRowIndex;
        const drawLeft: boolean = firstCol ? mask.left : mask.insideVertical;
        const drawRight: boolean = lastCol ? mask.right : mask.insideVertical;
        const drawTop: boolean = firstRow ? mask.top : mask.insideHorizontal;
        const drawBottom: boolean = lastRow ? mask.bottom : mask.insideHorizontal;
        const leftX: number = cellBounds.x;
        const rightX: number = cellBounds.x + cellBounds.width;
        const topY: number = cellBounds.y;
        const bottomY: number = cellBounds.y + cellBounds.height;
        const horizontalStart: number = leftX - (drawLeft ? resolved.left.width / 2 : 0);
        const horizontalEnd: number = rightX + (drawRight ? resolved.right.width / 2 : 0);
        const verticalStart: number = topY - (drawTop ? resolved.top.width / 2 : 0);
        const verticalEnd: number = bottomY + (drawBottom ? resolved.bottom.width / 2 : 0);
        if (horizontalOnly) {
            if (firstRow) {
                this._drawOwnedBorderLine(
                    graphics,
                    resolved.top,
                    { x: horizontalStart, y: topY },
                    { x: horizontalEnd, y: topY }
                );
            }
            this._drawOwnedBorderLine(
                graphics,
                resolved.bottom,
                { x: horizontalStart, y: bottomY },
                { x: horizontalEnd, y: bottomY }
            );
            return;
        }
        if (drawLeft) {
            this._drawOwnedBorderLine(
                graphics,
                resolved.left,
                { x: leftX, y: verticalStart },
                { x: leftX, y: verticalEnd }
            );
        }
        if (drawRight) {
            this._drawOwnedBorderLine(
                graphics,
                resolved.right,
                { x: rightX, y: verticalStart },
                { x: rightX, y: verticalEnd }
            );
        }
        if (drawTop) {
            this._drawOwnedBorderLine(
                graphics,
                resolved.top,
                { x: horizontalStart, y: topY },
                { x: horizontalEnd, y: topY }
            );
        }
        if (drawBottom) {
            this._drawOwnedBorderLine(
                graphics,
                resolved.bottom,
                { x: horizontalStart, y: bottomY },
                { x: horizontalEnd, y: bottomY }
            );
        }
    }
    /**
     * Draws only the cell edges enabled by the built-in style rules.
     *
     * @private
     * @param {PdfGraphics} graphics The graphics context.
     * @param {Rectangle} cellBounds The bounds of the cell.
     * @param {_PdfResolvedGridBorder} resolved The resolved border pens.
     * @param {PdfGridCell} cell The current cell.
     * @param {number} colIndex The column index of the cell.
     * @param {number} rowIndex The row index of the cell.
     * @param {number} firstVisibleRowIndex The first visible row index in the current slice.
     * @param {number} lastVisibleRowIndex The last visible row index in the current slice.
     * @param {_PdfBuiltInRules} rules The built-in style rules.
     * @returns {void}
     */
    _drawBuiltInRuleBorder(graphics: PdfGraphics, cellBounds: Rectangle, resolved: _PdfResolvedGridBorder,
                           cell: PdfGridCell, colIndex: number, rowIndex: number, firstVisibleRowIndex: number,
                           lastVisibleRowIndex: number, rules: _PdfBuiltInRules): void {
        const cs: number = cell.style && typeof cell.style.columnSpan === 'number' ? cell.style.columnSpan : 1;
        const rs: number = cell.style && typeof cell.style.rowSpan === 'number' ? cell.style.rowSpan : 1;
        const headerCount: number = this._headers.length;
        const isHeaderRow: boolean = rowIndex < headerCount;
        const isRepeatedHeaderOnlySlice: boolean = firstVisibleRowIndex === 0 &&
            lastVisibleRowIndex <= headerCount &&
            lastVisibleRowIndex < headerCount + this._records.length;
        const lastRow: boolean = !isRepeatedHeaderOnlySlice && rowIndex + rs >= lastVisibleRowIndex;
        const topIsHeaderEdge: boolean = headerCount > 0 && rowIndex === headerCount;
        const bottomIsHeaderEdge: boolean = headerCount > 0 && rowIndex + rs === headerCount;
        const onlyBottom: boolean = isHeaderRow && rules.headerOnlyBottom;
        let drawTop: boolean = rowIndex === 0 ? rules.top : (topIsHeaderEdge ? rules.headerBottom : rules.insideHorizontal);
        let drawBottom: boolean = bottomIsHeaderEdge ? rules.headerBottom :
            (lastRow ? rules.bottom : rules.insideHorizontal);
        let drawLeft: boolean = colIndex === 0 ? rules.left : (colIndex === 1 ? rules.firstColumnRight : rules.insideVertical);
        let drawRight: boolean = colIndex + cs >= this._numberOfColumns ? rules.right :
            (colIndex + cs === 1 ? rules.firstColumnRight : rules.insideVertical);
        if (rules.noHeaderVertical && isHeaderRow) {
            drawLeft = false;
            drawRight = false;
        }
        if (rules.firstColumnNoHorizontal && !isHeaderRow && colIndex === 0) {
            drawTop = topIsHeaderEdge ? drawTop : false;
            drawBottom = false;
        }
        if (onlyBottom) {
            drawTop = false;
            drawLeft = false;
            drawRight = false;
        }
        const headerPen: PdfPen = rules.headerBottomColor ?
            new PdfPen(rules.headerBottomColor, rules.headerBottomWidth) : resolved.bottom;
        const topPen: PdfPen = topIsHeaderEdge ? headerPen : resolved.top;
        const bottomPen: PdfPen = bottomIsHeaderEdge ? headerPen : resolved.bottom;
        const leftX: number = cellBounds.x;
        const rightX: number = cellBounds.x + cellBounds.width;
        const topY: number = cellBounds.y;
        const bottomY: number = cellBounds.y + cellBounds.height;
        const horizontalStart: number = leftX - (drawLeft ? resolved.left.width / 2 : 0);
        const horizontalEnd: number = rightX + (drawRight ? resolved.right.width / 2 : 0);
        const verticalStart: number = topY - (drawTop ? topPen.width / 2 : 0);
        const verticalEnd: number = bottomY + (drawBottom ? bottomPen.width / 2 : 0);
        if (drawBottom) {
            this._drawOwnedBorderLine(graphics, bottomPen, { x: horizontalStart, y: bottomY }, { x: horizontalEnd, y: bottomY });
        }
        if (drawTop) {
            this._drawOwnedBorderLine(graphics, topPen, { x: horizontalStart, y: topY }, { x: horizontalEnd, y: topY });
        }
        if (drawLeft) {
            const leftPen: PdfPen = rules.leftColor && colIndex <= 1 ?
                new PdfPen(rules.leftColor, resolved.left.width) : resolved.left;
            this._drawOwnedBorderLine(graphics, leftPen, { x: leftX, y: verticalStart }, { x: leftX, y: verticalEnd });
        }
        if (drawRight) {
            const rightPen: PdfPen = rules.leftColor && colIndex + cs === 1 ?
                new PdfPen(rules.leftColor, resolved.right.width) : resolved.right;
            this._drawOwnedBorderLine(graphics, rightPen, { x: rightX, y: verticalStart }, { x: rightX, y: verticalEnd });
        }
    }
    /**
     * Resolves the effective background (brush or image) for a cell.
     *
     * @private
     * @param {PdfGridCell} cell Current cell.
     * @param {PdfGridRow} row Current row.
     * @param {number} colIndex Current column index.
     * @param {boolean} isHeader Indicates whether the row is a header.
     * @param {_PdfBuiltInDescriptor} descriptor Built-in style descriptor.
     * @param {boolean} [isBandedRow=false] Indicates whether the row is banded.
     * @returns {PdfBrush | PdfBackgroundImage | null} Effective background (brush or image), or `null`.
     */
    _resolveEffectiveBackground(cell: PdfGridCell, row: PdfGridRow, colIndex: number, isHeader: boolean,
                                descriptor: _PdfBuiltInDescriptor, isBandedRow: boolean = false): PdfBrush | PdfBackgroundImage | null {
        if (cell.style && cell.style.background) {
            return cell.style.background;
        }
        if (row.style && row.style.background) {
            return row.style.background;
        }
        const columnStyle: PdfGridColumnStyle = this._resolveColumnStyle(colIndex);
        if (columnStyle && columnStyle.background) {
            return columnStyle.background;
        }
        if (this._style.background) {
            return this._style.background;
        }
        if (descriptor !== null) {
            const rules: _PdfBuiltInRules = this._getBuiltInRules();
            if (!isHeader && colIndex === 0 && rules) {
                if (rules.firstColumnBackground) {
                    return new PdfBrush(rules.firstColumnBackground);
                }
                if (rules.firstColumnNoBand) {
                    return null;
                }
            }
            if (isHeader && descriptor.headerBackground !== null) {
                return new PdfBrush(descriptor.headerBackground);
            }
            if (!isHeader && isBandedRow && descriptor.bandBackground !== null) {
                return new PdfBrush(descriptor.bandBackground);
            }
            const builtInDescriptor: _PdfBuiltInDescriptor & {
                bodyBackground?: { r: number; g: number; b: number };
            } = descriptor;
            if (!isHeader && !isBandedRow && builtInDescriptor.bodyBackground) {
                return new PdfBrush(builtInDescriptor.bodyBackground);
            }
        }
        return null;
    }
}
