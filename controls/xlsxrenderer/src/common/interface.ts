import {
    LayoutOptions,
    ExcelOrder,
    ExcelHAlign,
    ExcelVAlign,
    ExcelLineStyle,
    ExcelPattern,
    CellType,
    WarningType,
    GridLinesDisplayStyle,
    ExcelPrintLocation,
    ExcelShapeType,
    ExcelFormControlType,
    AutoShapeType
} from './enum';
import { PdfFont } from '@syncfusion/ej2-pdf';
import { HeaderFooterOption } from '../renderer/header-footer-renderer';

/**
 * Data models for Excel to PDF conversion
 */

/**
 * Result of Excel to PDF conversion
 */
export interface ConversionResult {
    /**
     * Generated PDF content as Uint8Array
     */
    pdf: Uint8Array;
    /**
     * Number of pages in the generated PDF
     */
    pageCount: number;
    /**
     * Warnings generated during conversion
     */
    warnings: Warning[];
    /**
     * Performance timing information
     */
    timings: Record<string, number>;
    /**
     * Conversion metadata
     */
    metadata?: {
        size?: number;
        timestamp?: Date;
        workbookInfo?: {
            sheetCount?: number;
            cellCount?: number;
            hasCharts?: boolean;
            hasImages?: boolean;
        };
    };
}

/**
 * Warning generated during conversion
 */
export interface Warning {
    /**
     * Warning code
     */
    code: string;
    /**
     * Warning message
     */
    message: string;
    /**
     * Warning context
     */
    context?: unknown;
}

/**
 * Progress event during conversion
 */
export interface ProgressEvent {
    /**
     * Current sheet name being processed
     */
    sheetName: string;
    /**
     * Current page being processed
     */
    currentPage: number;
    /**
     * Total pages to be generated
     */
    totalPages: number;
    /**
     * Percent complete (0-100)
     */
    percentComplete: number;
    /**
     * Current processing stage
     */
    stage?: 'validating' | 'parsing' | 'layout' | 'pagination' | 'rendering' | 'pdf-generation';
}

/**
 * Options for Excel to PDF conversion
 */
export interface ExcelToPdfConverterOptions {
    /**
     * Specific sheets to convert (defaults to all)
     */
    sheets?: string[];
    /**
     * Page setup options
     */
    pageSetup?: {
        orientation?: 'Portrait' | 'Landscape';
        paperSize?: 'Letter' | 'Legal' | 'A3' | 'A4' | 'A5' | 'B4' | 'B5' | 'Executive' | 'Tabloid';
        margins?: {
            top: number;
            right: number;
            bottom: number;
            left: number;
        };
        /**
         * Whether to scale and fit content to page.
         */
        fitToPage?: boolean;
        /**
         * Whether to fit the entire sheet on one page.
         */
        fitSheetOnOnePage?: boolean;
        /**
         * Whether to fit all columns on one page width.
         */
        fitAllColumnsOnOnePage?: boolean;
        /**
         * Whether to fit all rows on one page height.
         */
        fitAllRowsOnOnePage?: boolean;
        scale?: number;
        customPaperSize?: {
            width: number;
            height: number;
        };
    };
    /**
     * Whether to render charts
     */
    renderCharts?: boolean;
    /**
     * Whether to render row and column headings (e.g. 1, 2, 3... and A, B, C...)
     */
    renderHeadings?: boolean;
    /**
     * Conversion limits
     */
    limits?: {
        maxPages?: number;
        maxCells?: number;
        maxImageBytes?: number;
        timeoutMs?: number;
    };
    /**
     * Default font family
     */
    defaultFont?: string;
    /**
     * Metadata for the generated PDF
     */
    metadata?: {
        title?: string;
        author?: string;
        subject?: string;
        keywords?: string;
    };
    /**
     * Whether to compress the PDF
     */
    compress?: boolean;
    /**
     * PDF security options
     */
    security?: {
        ownerPassword?: string;
        userPassword?: string;
        permissions?: string[];
    };
    /**
     * Open password for encrypted Excel workbook
     */
    password?: string;
    /**
     * Whether to export hidden worksheets
     */
    includeHiddenSheets?: boolean;
    /**
     * Whether to include gridlines in the exported PDF
     */
    includeGridlines?: boolean;
    /**
     * Scaling layout option determining how sheets fit on pages.
     */
    layoutOptions?: LayoutOptions;
    /**
     * Custom paper dimensions in inches.
     */
    customPaperSize?: {
        width: number;
        height: number;
    };
    /**
     * Indicates whether to throw an exception when the input workbook has no populated sheets.
     */
    throwWhenExcelFileIsEmpty?: boolean;
    /**
     * Indicates whether blank worksheets should be converted to PDF pages.
     */
    isConvertBlankSheet?: boolean;
    /**
     * Indicates whether blank intermediate pages should be rendered in PDF.
     */
    isConvertBlankPage?: boolean;
    /**
     * Indicates whether sheet bookmarks should be generated in the PDF document.
     */
    exportBookmarks?: boolean;
    /**
     * Indicates whether Excel workbook metadata should be copied to PDF document properties.
     */
    exportDocumentProperties?: boolean;
    /**
     * Enables Right-To-Left layout rendering.
     */
    enableRtl?: boolean;
    /**
     * Indicates whether used fonts should be embedded in the output PDF document.
     */
    embedFonts?: boolean;
    /**
     * Indicates whether images should be exported in high quality without lossy downsampling.
     */
    exportQualityImage?: boolean;
    /**
     * Gridlines display style on the output PDF pages.
     */
    displayGridLines?: GridLinesDisplayStyle;
    /**
     * Optional callback invoked when non-fatal conversion warnings are encountered.
     */
    warning?: IWarningCallback;
    /**
     * Header and footer configuration options.
     */
    headerFooterOption?: HeaderFooterOption;
    /**
     * Indicates whether file names rendered in headers or footers include their file extension.
     */
    showFileNameWithExtension?: boolean;
}

/**
 * Diagnostic payload representing a non-fatal warning raised during conversion.
 */
export interface WarningInfo {
    /** Warning message string. */
    message: string;
    /** Category classification of the warning. */
    type: WarningType;
}

/**
 * Callback handler interface receiving conversion warnings.
 */
export interface IWarningCallback {
    /**
     * Invoked when a conversion warning occurs.
     *
     * @param info Details regarding the warning.
     * @returns void
     */
    showWarning(info: WarningInfo): void;
    /**
     * Setting this flag to `true` during a warning callback instructs the converter to cancel conversion.
     */
    cancel?: boolean;
}



/**
 * 4-channel Red, Green, Blue, Alpha numerical color definition (0-255).
 */
export interface Rgba {
    /** Red channel value (0-255). */
    r: number;
    /** Green channel value (0-255). */
    g: number;
    /** Blue channel value (0-255). */
    b: number;
    /** Alpha opacity channel value (0-255). */
    a: number;
}

/**
 * Border line definition for cell boundaries and diagonals.
 */
export interface IBorder {
    /** Style of the border line. */
    lineStyle: ExcelLineStyle;
    /** Rgba color of the border line. */
    color: Rgba;
    /** Indicates whether to draw diagonal cross lines. */
    showDiagonalLine?: boolean;
}

/**
 * Collection of all four outer borders and two diagonal lines of a cell.
 */
export interface IBorders {
    /** Left cell border edge. */
    left: IBorder;
    /** Right cell border edge. */
    right: IBorder;
    /** Top cell border edge. */
    top: IBorder;
    /** Bottom cell border edge. */
    bottom: IBorder;
    /** Diagonal line running downward from top-left to bottom-right. */
    diagonalDown: IBorder;
    /** Diagonal line running upward from bottom-left to top-right. */
    diagonalUp: IBorder;
}

/**
 * Evaluated visual formatting and styling properties for a worksheet cell.
 */
export interface ICellStyle {
    /** Font family name. */
    fontName: string;
    /** Font size in points. */
    fontSize: number;
    /** Bold text styling flag. */
    bold: boolean;
    /** Italic text styling flag. */
    italic: boolean;
    /** Underline text styling flag. */
    underline: boolean;
    /** Strikethrough text styling flag. */
    strikeout: boolean;
    /** Text foreground color. */
    fontColor: Rgba;
    /** Fill pattern type. */
    fillPattern: ExcelPattern;
    /** Background fill color. */
    fillColor: Rgba;
    /** Horizontal text alignment. */
    hAlign: ExcelHAlign;
    /** Vertical text alignment. */
    vAlign: ExcelVAlign;
    /** Word wrap flag. */
    wrapText: boolean;
    /** Text indentation level. */
    indent: number;
    /** Text rotation angle in degrees. */
    rotation: number;
    /** Shrink font size to fit cell width flag. */
    shrinkToFit: boolean;
    /** Border definitions. */
    borders: IBorders;
    /** Number formatting mask string. */
    numberFormat: string;
}

/**
 * Border stroke definition for conditional formatting cells.
 */
export interface CfBorderEdge {
    /** Border style name. */
    style: string;
    /** Hex color string. */
    color?: string;
}

/**
 * Evaluated conditional formatting data bar styling and bounds.
 */
export interface CfDataBar {
    /** Starting fraction (0.0 - 1.0) of bar. */
    startFrac: number;
    /** Length fraction (0.0 - 1.0) of bar. */
    lenFrac: number;
    /** Axis placement fraction, or null if no axis. */
    axisFrac: number | null;
    /** Bar fill hex color. */
    color: string;
    /** Optional border hex color. */
    border?: string;
    /** Optional axis hex color. */
    axisColor?: string;
    /** Whether gradient fill is applied. */
    isGradient: boolean;
    /** Whether value is negative. */
    isNegative: boolean;
    /** Whether Right-To-Left direction is used. */
    rtl: boolean;
    /** Progress percentage (0 - 100). */
    percent: number;
}

/**
 * Conditional formatting icon set specification.
 */
export interface CfIconSet {
    /** Icon set family name. */
    set: string;
    /** 0-based index of the icon within the set. */
    index: number;
    /** Total icon count in the set. */
    count: number;
    /** Image resource token identifier. */
    icon: string;
}

/**
 * Formatted run segment within a multi-style rich text cell.
 */
export interface IRichTextRun {
    /** Text content of the run. */
    text: string;
    /** Optional font family name. */
    fontName?: string;
    /** Optional font size in points. */
    fontSize?: number;
    /** Bold style flag. */
    bold?: boolean;
    /** Italic style flag. */
    italic?: boolean;
    /** Underline style flag. */
    underline?: boolean;
    /** Strikethrough style flag. */
    strikeout?: boolean;
    /** Font color. */
    fontColor?: Rgba;
    /** Subscript alignment flag. */
    subscript?: boolean;
    /** Superscript alignment flag. */
    superscript?: boolean;
}

/**
 * Threaded reply within a cell comment conversation.
 */
export interface ICellCommentReply {
    /** Author name of the reply. */
    author: string;
    /** Body text of the reply. */
    text: string;
    /** Creation timestamp. */
    createdAt?: Date;
}

/**
 * Note or threaded comment attached to a worksheet cell.
 */
export interface ICellComment {
    /** Main comment text. */
    text: string;
    /** Author of the comment. */
    author?: string;
    /** Creation timestamp. */
    createdAt?: Date;
    /** Whether the comment balloon is set to visible in place. */
    isVisible?: boolean;
    /** Whether the comment is a modern threaded conversation. */
    isThreaded?: boolean;
    /** Array of replies for threaded conversations. */
    replies?: ICellCommentReply[];
}

/**
 * Worksheet cell entity encapsulating coordinates, value, and formatting.
 */
export interface ICell {
    /** 1-based row index. */
    row: number;
    /** 1-based column index. */
    column: number;
    /** Formatted display text. */
    displayText: string;
    /** Whether the cell has no value. */
    isBlank: boolean;
    /** Evaluated data type. */
    cellType: CellType;
    /** Visual style applied to the cell. */
    style: ICellStyle;
    /** Whether cell has custom styling applied. */
    hasStyle: boolean;
    /** Target hyperlink URL if present. */
    hyperlink?: string;
    /** Conditional formatting data bar if active. */
    dataBar?: CfDataBar;
    /** Conditional formatting icon set item if active. */
    iconSet?: CfIconSet;
    /** Whether cell text is hidden by formatting. */
    hideValue?: boolean;
    /** Formatted rich text runs if cell contains inline styling. */
    richText?: IRichTextRun[];
    /** Cell note or comment. */
    comment?: ICellComment;
    /** Whether AutoFilter dropdown arrow button is present on the cell. */
    hasFilterButton?: boolean;
    /** Whether Data Validation dropdown button is present on the cell. */
    hasDropdownButton?: boolean;
}

/**
 * 1-based rectangular coordinate range of cells.
 */
export interface IMergedRegion {
    /** 1-based starting row index. */
    firstRow: number;
    /** 1-based starting column index. */
    firstColumn: number;
    /** 1-based ending row index. */
    lastRow: number;
    /** 1-based ending column index. */
    lastColumn: number;
}

/**
 * Embedded worksheet raster or vector image.
 */
export interface IPicture {
    /** Left coordinate in points. */
    left: number;
    /** Top coordinate in points. */
    top: number;
    /** Width in points. */
    width: number;
    /** Height in points. */
    height: number;
    /** 1-based bounding top row. */
    topRow: number;
    /** 1-based bounding bottom row. */
    bottomRow: number;
    /** 1-based bounding left column. */
    leftColumn: number;
    /** 1-based bounding right column. */
    rightColumn: number;
    /** Raw binary data or base64 image payload. */
    data: Uint8Array | string;
    /** Image visibility flag. */
    visible: boolean;
    /** Name of picture object. */
    name: string;
}

/**
 * Series data points and legend labels for a chart.
 */
export interface IChartSeriesData {
    /** Series legend title. */
    title?: string;
    /** Numeric values of the series. */
    values: number[];
    /** Optional category labels. */
    categoryLabels?: string[];
    /** Series color override. */
    color?: string;
}

/**
 * Chart entity embedded on a worksheet.
 */
export interface IChart {
    /** Name of the chart object. */
    name: string;
    /** Type of chart (Column, Bar, Line, Pie, Area, Scatter). */
    type: string;
    /** Title of the chart. */
    chartTitle?: string;
    /** Whether title is displayed. */
    hasTitle: boolean;
    /** Whether legend is displayed. */
    hasLegend: boolean;
    /** Legend position (Top, Bottom, Left, Right). */
    legendPosition?: string;
    /** Primary category axis configuration. */
    primaryCategoryAxis?: Record<string, unknown>;
    /** Primary value axis configuration. */
    primaryValueAxis?: Record<string, unknown>;
    /** Left offset in points. */
    left: number;
    /** Top offset in points. */
    top: number;
    /** Width in points. */
    width: number;
    /** Height in points. */
    height: number;
    /** 1-based top row index. */
    topRow: number;
    /** 1-based bottom row index. */
    bottomRow: number;
    /** 1-based left column index. */
    leftColumn: number;
    /** 1-based right column index. */
    rightColumn: number;
    /** Data series collection. */
    series: IChartSeriesData[];
    /** Category axis label strings. */
    categories: string[];
}

/**
 * Page setup, orientation, margins, and printing rules of a worksheet.
 */
export interface IPageSetup {
    /** Left page margin in inches. */
    leftMargin: number;
    /** Right page margin in inches. */
    rightMargin: number;
    /** Top page margin in inches. */
    topMargin: number;
    /** Bottom page margin in inches. */
    bottomMargin: number;
    /** Header margin from top edge in inches. */
    headerMargin: number;
    /** Footer margin from bottom edge in inches. */
    footerMargin: number;
    /** Page orientation ('Portrait' or 'Landscape'). */
    orientation: 'Portrait' | 'Landscape';
    /** Paper width in points. */
    paperWidth: number;
    /** Paper height in points. */
    paperHeight: number;
    /** Standard paper size identifier. */
    paperSize?: string | number;
    /** Percentage zoom scaling (100 = 100%). */
    zoom: number;
    /** Fit to page enabled flag. */
    isFitToPage: boolean;
    /** Number of pages wide to fit content. */
    fitToPagesWide: number;
    /** Number of pages tall to fit content. */
    fitToPagesTall: number;
    /** Pagination print order. */
    order: ExcelOrder;
    /** Center content horizontally on page flag. */
    centerHorizontally: boolean;
    /** Center content vertically on page flag. */
    centerVertically: boolean;
    /** Print gridlines flag. */
    printGridlines: boolean;
    /** Black and white monochrome printing flag. */
    blackAndWhite: boolean;
    /** Starting page number. */
    firstPageNumber: number;
    /** Automatic page numbering flag. */
    autoFirstPageNumber: boolean;
    /** Comments print location. */
    printComments?: ExcelPrintLocation;
    /** Repeat title rows range. */
    printTitleRows?: { first: number; last: number };
    /** Repeat title columns range. */
    printTitleColumns?: { first: number; last: number };
    /** Defined print areas. */
    printArea?: { firstRow: number; firstColumn: number; lastRow: number; lastColumn: number }[];
    /** Raw title rows string expression. */
    printTitleRowsText?: string;
    /** Raw title columns string expression. */
    printTitleColumnsText?: string;
    /** 1-based horizontal page break rows. */
    rowBreaks: number[];
    /** 1-based vertical page break columns. */
    columnBreaks: number[];
    /** Left header text template. */
    leftHeader: string;
    /** Center header text template. */
    centerHeader: string;
    /** Right header text template. */
    rightHeader: string;
    /** Left footer text template. */
    leftFooter: string;
    /** Center footer text template. */
    centerFooter: string;
    /** Right footer text template. */
    rightFooter: string;
}

/**
 * AutoFilter range configuration.
 */
export interface IAutoFilterRange {
    /** Range string expression (e.g. `'A1:D20'`). */
    filterRange: string;
    /** Whether filter dropdown buttons are shown. */
    hasFilterButton?: boolean;
}

export type IDrawingShape = IShape;

/**
 * Drawing shape or interactive form control entity.
 */
export interface IShape {
    /** Shape name identifier. */
    name: string;
    /** Broad shape classification. */
    shapeType: ExcelShapeType;
    /** Geometry AutoShape type if applicable. */
    autoShapeType?: AutoShapeType;
    /** Form control type if applicable. */
    formControlType?: ExcelFormControlType;
    /** Canonical shape type name. */
    type: 'rectangle' | 'textbox' | 'line' | 'oval' | 'button' | 'checkbox' |
    'radio' | 'custom' | 'diamond' | 'triangle' | 'arrow' | string;
    /** OpenXML preset geometry identifier string. */
    presetType?: string;
    /** Left coordinate in points. */
    left: number;
    /** Top coordinate in points. */
    top: number;
    /** Width in points. */
    width: number;
    /** Height in points. */
    height: number;
    /** 1-based top row index. */
    topRow: number;
    /** 1-based bottom row index. */
    bottomRow: number;
    /** 1-based left column index. */
    leftColumn: number;
    /** 1-based right column index. */
    rightColumn: number;
    /** Shape visibility flag. */
    visible: boolean;
    /** Caption or text inside shape. */
    text?: string;
    /** Rotation angle in degrees clockwise. */
    rotation?: number;
    /** Checkbox or radio button checked state. */
    checked?: boolean;
    /** Shape fill color. */
    fillColor?: Rgba;
    /** Shape border stroke color. */
    borderColor?: Rgba;
    /** Shape border stroke width in points. */
    borderWidth?: number;
    /** Shape border dash pattern style. */
    borderDashStyle?: string;
    /** Font family name. */
    fontFamily?: string;
    /** Font size in points. */
    fontSizePt?: number;
    /** Bold text styling flag. */
    fontBold?: boolean;
    /** Italic text styling flag. */
    fontItalic?: boolean;
    /** Font color. */
    fontColor?: Rgba;
    /** Horizontal text alignment inside shape. */
    textHorizontalAlignment?: string;
    /** Vertical text alignment inside shape. */
    textVerticalAlignment?: string;
    /** Formatted rich text runs inside shape. */
    richText?: Array<{
        text: string;
        style?: {
            color?: string;
            fontSize?: string;
            fontFamily?: string;
            fontWeight?: string;
            fontStyle?: string;
            textDecoration?: string;
            verticalAlign?: string;
        };
    }>;
    /** Custom polygon path points for freeform shapes. */
    pathPoints?: { x: number; y: number }[];
}

/**
 * Worksheet data model providing access to cells, page settings, and visual elements.
 */
export interface IWorksheet {
    /** Sheet name. */
    name: string;
    /** 0-based index. */
    index: number;
    /** Visual tab index. */
    tabIndex: number;
    /** Sheet visibility flag. */
    visible: boolean;
    /** Whether sheet has no populated cells. */
    isEmpty: boolean;
    /** Whether sheet direction is Right-To-Left. */
    isRightToLeft: boolean;
    /** Total used range region. */
    usedRange: IMergedRegion;
    /** Page setup configuration. */
    pageSetup: IPageSetup;
    /** Merged cell regions collection. */
    mergedRegions: IMergedRegion[];
    /** Embedded images collection. */
    pictures: IPicture[];
    /** Embedded charts collection. */
    charts: IChart[];
    /** Drawing shapes and form controls collection. */
    shapes?: IShape[];
    /** AutoFilter configuration. */
    autoFilter?: IAutoFilterRange;
    /** List of unsupported shape names encountered. */
    unsupportedShapeNames: string[];
    /** Retrieves cell at 1-based coordinates. */
    getCell(row: number, column: number): ICell;
    /** Checks whether cell has data. */
    hasCellData(row: number, column: number): boolean;
    /** Column width in pixels. */
    getColumnWidthPx(column: number): number;
    /** Row height in pixels. */
    getRowHeightPx(row: number): number;
    /** Whether row is visible. */
    isRowVisible(row: number): boolean;
    /** Whether column is visible. */
    isColumnVisible(column: number): boolean;
}

/**
 * Workbook document container model.
 */
export interface IWorkbook {
    /** Worksheets collection. */
    worksheets: IWorksheet[];
    /** Maximum row count limit. */
    maxRowCount: number;
    /** Maximum column count limit. */
    maxColumnCount: number;
    /** Workbook title. */
    title?: string;
    /** Workbook author. */
    author?: string;
}

/**
 * Settings controlling converter layout, formatting options, and event callbacks.
 */
export interface ExcelToPdfConverterSettings {
    /** Scaling layout mode. */
    layoutOptions: LayoutOptions;
    /** Gridlines display style. */
    displayGridLines: GridLinesDisplayStyle;
    /** Convert blank pages flag. */
    isConvertBlankPage: boolean;
    /** Convert blank sheets flag. */
    isConvertBlankSheet: boolean;
    /** Throw exception if workbook is empty flag. */
    throwWhenExcelFileIsEmpty: boolean;
    /** Generate PDF bookmarks flag. */
    exportBookmarks: boolean;
    /** Copy workbook properties to PDF document flag. */
    exportDocumentProperties: boolean;
    /** Enable RTL rendering flag. */
    enableRtl: boolean;
    /** Embed fonts in PDF flag. */
    embedFonts: boolean;
    /** Render headers flag. */
    showHeader: boolean;
    /** Render footers flag. */
    showFooter: boolean;
    /** Show extension in file name token flag. */
    showFileNameWithExtension: boolean;
    /** Export images in high quality flag. */
    exportQualityImage: boolean;
    /** Render row and column headings flag (e.g. 1, 2, 3... and A, B, C...). */
    renderHeadings?: boolean;
    /** Include hidden sheets in export flag. */
    includeHiddenSheets?: boolean;
    /** Custom paper dimensions in points. */
    customPaperSize?: { width: number; height: number };
    /** Diagnostic warning callback. */
    onWarning?: (type: WarningType, description: string) => boolean | void;
    /** Conversion progress callback. */
    onProgress?: (sheetCount: number, sheetIndex: number) => void;
    /** Callback before a sheet is drawn. */
    onSheetBeforeDrawn?: (sheetIndex: number) => boolean;
    /** Callback after a sheet is drawn. */
    onSheetAfterDrawn?: (sheetIndex: number) => void;
    /** Custom font resolution callback. */
    fontResolver?: (name: string, size: number, bold: boolean, italic: boolean) => PdfFont | null;
}


/**
 * Data structure representing a cell comment or note sorted by coordinate position for end-of-sheet compilation.
 */
export interface ISortedCommentItem {
    /** 1-based row index. */
    row: number;
    /** 1-based column index. */
    column: number;
    /** Alphanumeric cell coordinate address (e.g. 'B5'). */
    cellAddress: string;
    /** Comment details and thread replies. */
    comment: ICellComment;
}

/**
 * Group of pages associated with a specific worksheet and page setup configuration.
 */
export interface IHeaderFooterPageGroup {
    /** 0-based index of the first page in this group. */
    pageStartIndex: number;
    /** Total number of pages in this group. */
    pageCount: number;
    /** Page setup properties applied to these pages. */
    setup: IPageSetup;
    /** Name of the worksheet. */
    sheetName: string;
}

/**
 * Evaluated conditional formatting style results for a specific cell.
 */
export interface EvaluatedCF {
    fillColor?: string;
    textColor?: string;
    isBold?: boolean;
    isItalic?: boolean;
    isUnderline?: boolean;
    isStrike?: boolean;
    numberFormat?: string;
    borders?: { left?: CfBorderEdge; right?: CfBorderEdge; top?: CfBorderEdge; bottom?: CfBorderEdge };
    hideValue?: boolean;
    dataBar?: CfDataBar;
    iconSet?: CfIconSet;
}

