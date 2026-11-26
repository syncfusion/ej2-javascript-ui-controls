
/**
 * Display styles for worksheet gridlines in the generated PDF.
 */
export enum GridLinesDisplayStyle {
    /**
     * Gridlines are conditionally rendered based on worksheet configuration.
     */
    Auto = 0,
    /**
     * Gridlines are explicitly rendered on the output PDF page.
     */
    Visible = 1,
    /**
     * Gridlines are hidden on the output PDF page.
     */
    Invisible = 2
}

/**
 * Categorization types for warnings raised during Excel to PDF conversion.
 */
export enum WarningType {
    /** General conversion warning. */
    General = 0,
    /** Warning related to conditional formatting rules or data bars. */
    ConditionalFormatting = 1,
    /** Warning related to missing or incompatible fonts. */
    Font = 2,
    /** Warning indicating an unsupported Excel feature. */
    UnsupportedFeature = 3,
    /** Warning related to page setup or boundary calculations. */
    PageSettings = 4,
    /** Warning regarding drawing objects, shapes, or charts. */
    DrawingObjects = 5,
    /** Warning indicating a font substitution occurred. */
    FontSubstitution = 6,
    /** Warning regarding cell fill patterns or shading. */
    FillPattern = 7,
    /** Warning regarding pivot table layouts or formatting. */
    PivotTableSettings = 8
}

/**
 * Print pagination order for multi-page worksheet printing.
 */
export enum ExcelOrder {
    /** Print down rows first, then across columns. */
    DownThenOver = 0,
    /** Print across columns first, then down rows. */
    OverThenDown = 1
}

/**
 * Horizontal text alignment within a worksheet cell.
 */
export enum ExcelHAlign {
    /** Default general alignment based on value data type. */
    General = 0,
    /** Left-aligned text. */
    Left = 1,
    /** Center-aligned text. */
    Center = 2,
    /** Right-aligned text. */
    Right = 3,
    /** Repeated cell fill text. */
    Fill = 4,
    /** Justified text across cell width. */
    Justify = 5,
    /** Center text across a selected cell range. */
    CenterAcrossSelection = 6
}

/**
 * Vertical text alignment within a worksheet cell.
 */
export enum ExcelVAlign {
    /** Align text to the top edge of the cell. */
    Top = 0,
    /** Vertically center text in the cell. */
    Center = 1,
    /** Align text to the bottom edge of the cell. */
    Bottom = 2,
    /** Vertically justify text between cell top and bottom. */
    Justify = 3
}

/**
 * Line styles for cell borders.
 */
export enum ExcelLineStyle {
    /** No border. */
    None = 0,
    /** Thin solid border. */
    Thin = 1,
    /** Medium solid border. */
    Medium = 2,
    /** Dashed border line. */
    Dashed = 3,
    /** Dotted border line. */
    Dotted = 4,
    /** Thick solid border. */
    Thick = 5,
    /** Double border lines. */
    Double = 6,
    /** Hairline border. */
    Hair = 7,
    /** Medium dashed border line. */
    MediumDashed = 8,
    /** Dash-dot pattern border line. */
    DashDot = 9,
    /** Medium dash-dot pattern border line. */
    MediumDashDot = 10,
    /** Dash-dot-dot pattern border line. */
    DashDotDot = 11,
    /** Medium dash-dot-dot pattern border line. */
    MediumDashDotDot = 12,
    /** Slanted dash-dot pattern border line. */
    SlantedDashDot = 13
}

/**
 * Identifiers for individual cell border edges.
 */
export enum ExcelBordersIndex {
    /** Left cell border edge. */
    EdgeLeft = 0,
    /** Top cell border edge. */
    EdgeTop = 1,
    /** Bottom cell border edge. */
    EdgeBottom = 2,
    /** Right cell border edge. */
    EdgeRight = 3,
    /** Diagonal border line running downward from top-left to bottom-right. */
    DiagonalDown = 4,
    /** Diagonal border line running upward from bottom-left to top-right. */
    DiagonalUp = 5
}

/**
 * Shading and fill patterns for worksheet cells.
 */
export enum ExcelPattern {
    /** No fill pattern. */
    None = 0,
    /** Solid background fill. */
    Solid = 1,
    /** Gradient color fill. */
    Gradient = 2,
    /** Other hatched or patterned fills. */
    Other = 3
}

/**
 * Evaluated data type of a cell value.
 */
export enum CellType {
    /** Empty or unpopulated cell. */
    Blank = 0,
    /** Text string content. */
    String = 1,
    /** Numeric or financial value. */
    Number = 2,
    /** Boolean boolean true/false. */
    Boolean = 3,
    /** Cell formula evaluation error (e.g. `#VALUE!`, `#N/A`). */
    Error = 4,
    /** Cell containing a dynamic formula. */
    Formula = 5
}

/**
 * Output print location for cell comments and notes in PDF.
 */
export enum ExcelPrintLocation {
    /** Do not print comments or notes. */
    PrintNoComments = 0,
    /** Print all comments compiled at the end of the worksheet. */
    PrintSheetEnd = 1,
    /** Print comments in place over the worksheet cells as balloons. */
    PrintInPlace = 2
}

/**
 * High-level shape classification for worksheet drawing elements.
 */
export enum ExcelShapeType {
    /** Unknown shape entity. */
    Unknown = 0,
    /** Embedded raster or vector picture. */
    Picture = 1,
    /** Chart or graphic visualization. */
    Chart = 2,
    /** Geometric vector AutoShape. */
    AutoShape = 3,
    /** Text box container. */
    TextBox = 4,
    /** Grouped composite shape. */
    GroupShape = 5,
    /** Comment or note popup balloon. */
    Comment = 6,
    /** Interactive form control (button, checkbox, dropdown, etc.). */
    FormControl = 7
}

/**
 * Types of Excel form controls supported during conversion.
 */
export enum ExcelFormControlType {
    /** Standard push button. */
    Button = 1,
    /** Checkbox toggle control. */
    CheckBox = 2,
    /** Option/radio button control. */
    OptionButton = 3,
    /** Dropdown combo box control. */
    ComboBox = 4,
    /** List box selection control. */
    ListBox = 5,
    /** Scroll bar control. */
    ScrollBar = 6,
    /** Numeric spinner control. */
    Spinner = 7,
    /** Group box border container. */
    GroupBox = 8,
    /** Static text label control. */
    Label = 9
}

/**
 * Geometric preset types for Excel AutoShapes.
 */
export enum AutoShapeType {
    /** Standard rectangle shape. */
    Rectangle = 1,
    /** Rectangle with rounded corners. */
    RoundedRectangle = 2,
    /** Ellipse or circle shape. */
    Oval = 3,
    /** Diamond / rhombus shape. */
    Diamond = 4,
    /** Isosceles triangle shape. */
    IsoscelesTriangle = 5,
    /** Right-angled triangle shape. */
    RightTriangle = 6,
    /** Parallelogram shape. */
    Parallelogram = 7,
    /** Trapezoid shape. */
    Trapezoid = 8,
    /** Regular hexagon shape. */
    Hexagon = 9,
    /** Regular octagon shape. */
    Octagon = 10,
    /** Plus or cross sign shape. */
    Cross = 11,
    /** 5-pointed star shape. */
    Star5 = 12,
    /** Block arrow pointing right. */
    RightArrow = 13,
    /** Block arrow pointing left. */
    LeftArrow = 14,
    /** Block arrow pointing up. */
    UpArrow = 15,
    /** Block arrow pointing down. */
    DownArrow = 16,
    /** Double-ended block arrow pointing left and right. */
    LeftRightArrow = 17,
    /** Double-ended block arrow pointing up and down. */
    UpDownArrow = 18,
    /** Straight line shape. */
    Line = 20,
    /** Straight line connector between shapes. */
    StraightConnector = 21,
    /** Right-angled bent connector. */
    BentConnector = 22,
    /** Curved connector line. */
    CurvedConnector = 23,
    /** Text box rectangular shape. */
    TextBox = 30,
    /** Heart symbol shape. */
    Heart = 35,
    /** Sun symbol shape. */
    Sun = 36,
    /** Crescent moon symbol shape. */
    Moon = 37,
    /** Cloud symbol shape. */
    Cloud = 38,
    /** Lightning bolt symbol shape. */
    LightningBolt = 39,
    /** Flowchart process rectangular shape. */
    FlowChartProcess = 60,
    /** Flowchart decision diamond shape. */
    FlowChartDecision = 61,
    /** Flowchart input/output parallelogram shape. */
    FlowChartData = 62,
    /** Flowchart predefined process shape. */
    FlowChartPredefinedProcess = 63,
    /** Flowchart internal storage shape. */
    FlowChartInternalStorage = 64,
    /** Flowchart document symbol shape. */
    FlowChartDocument = 65,
    /** Flowchart start/end rounded terminator shape. */
    FlowChartTerminator = 66,
    /** Rectangular speech callout bubble. */
    RectangularCallout = 100,
    /** Rounded rectangular speech callout bubble. */
    RoundedRectangularCallout = 101,
    /** Oval speech callout bubble. */
    OvalCallout = 102,
    /** Cloud thought bubble callout. */
    CloudCallout = 103,
    /** Custom OpenXML preset or arbitrary polygon. */
    Custom = 999
}

/**
 * Layout scaling options for converting Excel worksheets to PDF.
 *
 * @ignoresingular
 */
export enum LayoutOptions {
    /**
     * Renders all worksheet content onto a single PDF page.
     */
    FitSheetOnOnePage = 1,
    /**
     * Renders worksheets at their actual 100% scale without fitting.
     */
    NoScaling = 2,
    /**
     * Scales worksheet content horizontally so all columns fit on one page width.
     */
    FitAllColumnsOnOnePage = 4,
    /**
     * Scales worksheet content vertically so all rows fit on one page height.
     */
    FitAllRowsOnOnePage = 8,
    /**
     * Scales worksheets using custom `fitToPagesWide` and `fitToPagesTall` rules.
     */
    CustomScaling = 16,
    /**
     * Automatic layout scaling (defaults to `NoScaling`).
     */
    Automatic = 32
}
