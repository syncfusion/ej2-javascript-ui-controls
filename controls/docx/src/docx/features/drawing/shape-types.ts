/**
 * DrawingML preset geometry tokens (`a:prstGeom/@prst`).
 *
 * Closed set from ECMA-376 DrawingML `ST_ShapeType`
 * (`specs/schemas/xsd/OfficeOpenXML-XMLSchema-Strict/dml-main.xsd`).
 *
 * @packageDocumentation
 */
import { enumValues } from '../../core/compat/object-compat';
/**
 * DrawingML preset geometry (`ST_ShapeType` / `a:prstGeom/@prst`).
 *
 * Members are schema wire tokens. Prefer these constants over raw strings.
 * @private
 */
export enum StShapeType {
    Line = 'line',
    LineInv = 'lineInv',
    Triangle = 'triangle',
    RtTriangle = 'rtTriangle',
    Rect = 'rect',
    Diamond = 'diamond',
    Parallelogram = 'parallelogram',
    Trapezoid = 'trapezoid',
    NonIsoscelesTrapezoid = 'nonIsoscelesTrapezoid',
    Pentagon = 'pentagon',
    Hexagon = 'hexagon',
    Heptagon = 'heptagon',
    Octagon = 'octagon',
    Decagon = 'decagon',
    Dodecagon = 'dodecagon',
    Star4 = 'star4',
    Star5 = 'star5',
    Star6 = 'star6',
    Star7 = 'star7',
    Star8 = 'star8',
    Star10 = 'star10',
    Star12 = 'star12',
    Star16 = 'star16',
    Star24 = 'star24',
    Star32 = 'star32',
    RoundRect = 'roundRect',
    Round1Rect = 'round1Rect',
    Round2SameRect = 'round2SameRect',
    Round2DiagRect = 'round2DiagRect',
    SnipRoundRect = 'snipRoundRect',
    Snip1Rect = 'snip1Rect',
    Snip2SameRect = 'snip2SameRect',
    Snip2DiagRect = 'snip2DiagRect',
    Plaque = 'plaque',
    Ellipse = 'ellipse',
    Teardrop = 'teardrop',
    HomePlate = 'homePlate',
    Chevron = 'chevron',
    PieWedge = 'pieWedge',
    Pie = 'pie',
    BlockArc = 'blockArc',
    Donut = 'donut',
    NoSmoking = 'noSmoking',
    RightArrow = 'rightArrow',
    LeftArrow = 'leftArrow',
    UpArrow = 'upArrow',
    DownArrow = 'downArrow',
    StripedRightArrow = 'stripedRightArrow',
    NotchedRightArrow = 'notchedRightArrow',
    BentUpArrow = 'bentUpArrow',
    LeftRightArrow = 'leftRightArrow',
    UpDownArrow = 'upDownArrow',
    LeftUpArrow = 'leftUpArrow',
    LeftRightUpArrow = 'leftRightUpArrow',
    QuadArrow = 'quadArrow',
    LeftArrowCallout = 'leftArrowCallout',
    RightArrowCallout = 'rightArrowCallout',
    UpArrowCallout = 'upArrowCallout',
    DownArrowCallout = 'downArrowCallout',
    LeftRightArrowCallout = 'leftRightArrowCallout',
    UpDownArrowCallout = 'upDownArrowCallout',
    QuadArrowCallout = 'quadArrowCallout',
    BentArrow = 'bentArrow',
    UturnArrow = 'uturnArrow',
    CircularArrow = 'circularArrow',
    LeftCircularArrow = 'leftCircularArrow',
    LeftRightCircularArrow = 'leftRightCircularArrow',
    CurvedRightArrow = 'curvedRightArrow',
    CurvedLeftArrow = 'curvedLeftArrow',
    CurvedUpArrow = 'curvedUpArrow',
    CurvedDownArrow = 'curvedDownArrow',
    SwooshArrow = 'swooshArrow',
    Cube = 'cube',
    Can = 'can',
    LightningBolt = 'lightningBolt',
    Heart = 'heart',
    Sun = 'sun',
    Moon = 'moon',
    SmileyFace = 'smileyFace',
    IrregularSeal1 = 'irregularSeal1',
    IrregularSeal2 = 'irregularSeal2',
    FoldedCorner = 'foldedCorner',
    Bevel = 'bevel',
    Frame = 'frame',
    HalfFrame = 'halfFrame',
    Corner = 'corner',
    DiagStripe = 'diagStripe',
    Chord = 'chord',
    Arc = 'arc',
    LeftBracket = 'leftBracket',
    RightBracket = 'rightBracket',
    LeftBrace = 'leftBrace',
    RightBrace = 'rightBrace',
    BracketPair = 'bracketPair',
    BracePair = 'bracePair',
    StraightConnector1 = 'straightConnector1',
    BentConnector2 = 'bentConnector2',
    BentConnector3 = 'bentConnector3',
    BentConnector4 = 'bentConnector4',
    BentConnector5 = 'bentConnector5',
    CurvedConnector2 = 'curvedConnector2',
    CurvedConnector3 = 'curvedConnector3',
    CurvedConnector4 = 'curvedConnector4',
    CurvedConnector5 = 'curvedConnector5',
    Callout1 = 'callout1',
    Callout2 = 'callout2',
    Callout3 = 'callout3',
    AccentCallout1 = 'accentCallout1',
    AccentCallout2 = 'accentCallout2',
    AccentCallout3 = 'accentCallout3',
    BorderCallout1 = 'borderCallout1',
    BorderCallout2 = 'borderCallout2',
    BorderCallout3 = 'borderCallout3',
    AccentBorderCallout1 = 'accentBorderCallout1',
    AccentBorderCallout2 = 'accentBorderCallout2',
    AccentBorderCallout3 = 'accentBorderCallout3',
    WedgeRectCallout = 'wedgeRectCallout',
    WedgeRoundRectCallout = 'wedgeRoundRectCallout',
    WedgeEllipseCallout = 'wedgeEllipseCallout',
    CloudCallout = 'cloudCallout',
    Cloud = 'cloud',
    Ribbon = 'ribbon',
    Ribbon2 = 'ribbon2',
    EllipseRibbon = 'ellipseRibbon',
    EllipseRibbon2 = 'ellipseRibbon2',
    LeftRightRibbon = 'leftRightRibbon',
    VerticalScroll = 'verticalScroll',
    HorizontalScroll = 'horizontalScroll',
    Wave = 'wave',
    DoubleWave = 'doubleWave',
    Plus = 'plus',
    FlowChartProcess = 'flowChartProcess',
    FlowChartDecision = 'flowChartDecision',
    FlowChartInputOutput = 'flowChartInputOutput',
    FlowChartPredefinedProcess = 'flowChartPredefinedProcess',
    FlowChartInternalStorage = 'flowChartInternalStorage',
    FlowChartDocument = 'flowChartDocument',
    FlowChartMultidocument = 'flowChartMultidocument',
    FlowChartTerminator = 'flowChartTerminator',
    FlowChartPreparation = 'flowChartPreparation',
    FlowChartManualInput = 'flowChartManualInput',
    FlowChartManualOperation = 'flowChartManualOperation',
    FlowChartConnector = 'flowChartConnector',
    FlowChartPunchedCard = 'flowChartPunchedCard',
    FlowChartPunchedTape = 'flowChartPunchedTape',
    FlowChartSummingJunction = 'flowChartSummingJunction',
    FlowChartOr = 'flowChartOr',
    FlowChartCollate = 'flowChartCollate',
    FlowChartSort = 'flowChartSort',
    FlowChartExtract = 'flowChartExtract',
    FlowChartMerge = 'flowChartMerge',
    FlowChartOfflineStorage = 'flowChartOfflineStorage',
    FlowChartOnlineStorage = 'flowChartOnlineStorage',
    FlowChartMagneticTape = 'flowChartMagneticTape',
    FlowChartMagneticDisk = 'flowChartMagneticDisk',
    FlowChartMagneticDrum = 'flowChartMagneticDrum',
    FlowChartDisplay = 'flowChartDisplay',
    FlowChartDelay = 'flowChartDelay',
    FlowChartAlternateProcess = 'flowChartAlternateProcess',
    FlowChartOffpageConnector = 'flowChartOffpageConnector',
    ActionButtonBlank = 'actionButtonBlank',
    ActionButtonHome = 'actionButtonHome',
    ActionButtonHelp = 'actionButtonHelp',
    ActionButtonInformation = 'actionButtonInformation',
    ActionButtonForwardNext = 'actionButtonForwardNext',
    ActionButtonBackPrevious = 'actionButtonBackPrevious',
    ActionButtonEnd = 'actionButtonEnd',
    ActionButtonBeginning = 'actionButtonBeginning',
    ActionButtonReturn = 'actionButtonReturn',
    ActionButtonDocument = 'actionButtonDocument',
    ActionButtonSound = 'actionButtonSound',
    ActionButtonMovie = 'actionButtonMovie',
    Gear6 = 'gear6',
    Gear9 = 'gear9',
    Funnel = 'funnel',
    MathPlus = 'mathPlus',
    MathMinus = 'mathMinus',
    MathMultiply = 'mathMultiply',
    MathDivide = 'mathDivide',
    MathEqual = 'mathEqual',
    MathNotEqual = 'mathNotEqual',
    CornerTabs = 'cornerTabs',
    SquareTabs = 'squareTabs',
    PlaqueTabs = 'plaqueTabs',
    ChartX = 'chartX',
    ChartStar = 'chartStar',
    ChartPlus = 'chartPlus'
}
/**
 * @private
 * Closed set of `ST_ShapeType` wire tokens. */
export const ST_SHAPE_TYPE_VALUES: ReadonlyArray<StShapeType> = enumValues<StShapeType>(StShapeType);
const ST_SHAPE_TYPE_SET: ReadonlySet<string> = new Set(ST_SHAPE_TYPE_VALUES);
/**
 * Whether `value` is a schema `ST_ShapeType` token.
 *
 * @param {string} value - The value.
 * @returns {*} The result.
 * @private
 */
export function isStShapeType(value: string): value is StShapeType {
    return ST_SHAPE_TYPE_SET.has(value);
}

/**
 * Public auto-shape geometry, including model-only Custom and Unknown.
 *
 * Preset members match DrawingML `ST_ShapeType` wire tokens. `Custom` means
 * `a:custGeom`; `Unknown` means VML-only, missing, or unrecognized geometry.
 * Never serialize Custom or Unknown as `a:prstGeom/@prst`.
 *
 * Member names are API-facing; values are exact `a:prstGeom/@prst` tokens.
 *
 * @public
 */
export enum AutoShapeType {
    Unknown = 'unknown',

    Rectangle = 'rect',
    RoundedRectangle = 'roundRect',
    SnipSingleCornerRectangle = 'snip1Rect',
    SnipSameSideCornerRectangle = 'snip2SameRect',
    SnipDiagonalCornerRectangle = 'snip2DiagRect',
    SnipAndRoundSingleCornerRectangle = 'snipRoundRect',
    RoundSingleCornerRectangle = 'round1Rect',
    RoundSameSideCornerRectangle = 'round2SameRect',
    RoundDiagonalCornerRectangle = 'round2DiagRect',

    Oval = 'ellipse',
    IsoscelesTriangle = 'triangle',
    RightTriangle = 'rtTriangle',
    Parallelogram = 'parallelogram',
    Trapezoid = 'trapezoid',
    NonIsoscelesTrapezoid = 'nonIsoscelesTrapezoid',
    Diamond = 'diamond',
    RegularPentagon = 'pentagon',
    Hexagon = 'hexagon',
    Heptagon = 'heptagon',
    Octagon = 'octagon',
    Decagon = 'decagon',
    Dodecagon = 'dodecagon',

    Pie = 'pie',
    PieWedge = 'pieWedge',
    Chord = 'chord',
    Teardrop = 'teardrop',
    Frame = 'frame',
    HalfFrame = 'halfFrame',
    LShape = 'corner',
    DiagonalStripe = 'diagStripe',
    Cross = 'plus',
    Plaque = 'plaque',
    Can = 'can',
    Cube = 'cube',
    Bevel = 'bevel',
    Donut = 'donut',
    NoSymbol = 'noSmoking',
    BlockArc = 'blockArc',
    FoldedCorner = 'foldedCorner',
    SmileyFace = 'smileyFace',
    Heart = 'heart',
    LightningBolt = 'lightningBolt',
    Sun = 'sun',
    Moon = 'moon',
    Cloud = 'cloud',
    Arc = 'arc',

    DoubleBracket = 'bracketPair',
    DoubleBrace = 'bracePair',
    LeftBracket = 'leftBracket',
    RightBracket = 'rightBracket',
    LeftBrace = 'leftBrace',
    RightBrace = 'rightBrace',

    RightArrow = 'rightArrow',
    LeftArrow = 'leftArrow',
    UpArrow = 'upArrow',
    DownArrow = 'downArrow',
    LeftRightArrow = 'leftRightArrow',
    UpDownArrow = 'upDownArrow',
    QuadArrow = 'quadArrow',
    LeftRightUpArrow = 'leftRightUpArrow',
    BentArrow = 'bentArrow',
    UTurnArrow = 'uturnArrow',
    LeftUpArrow = 'leftUpArrow',
    BentUpArrow = 'bentUpArrow',
    CurvedRightArrow = 'curvedRightArrow',
    CurvedLeftArrow = 'curvedLeftArrow',
    CurvedUpArrow = 'curvedUpArrow',
    CurvedDownArrow = 'curvedDownArrow',
    StripedRightArrow = 'stripedRightArrow',
    NotchedRightArrow = 'notchedRightArrow',
    Pentagon = 'homePlate',
    Chevron = 'chevron',

    RightArrowCallout = 'rightArrowCallout',
    LeftArrowCallout = 'leftArrowCallout',
    UpArrowCallout = 'upArrowCallout',
    DownArrowCallout = 'downArrowCallout',
    LeftRightArrowCallout = 'leftRightArrowCallout',
    UpDownArrowCallout = 'upDownArrowCallout',
    QuadArrowCallout = 'quadArrowCallout',
    CircularArrow = 'circularArrow',
    LeftCircularArrow = 'leftCircularArrow',
    LeftRightCircularArrow = 'leftRightCircularArrow',
    SwooshArrow = 'swooshArrow',

    MathPlus = 'mathPlus',
    MathMinus = 'mathMinus',
    MathMultiply = 'mathMultiply',
    MathDivision = 'mathDivide',
    MathEqual = 'mathEqual',
    MathNotEqual = 'mathNotEqual',

    FlowChartProcess = 'flowChartProcess',
    FlowChartAlternateProcess = 'flowChartAlternateProcess',
    FlowChartDecision = 'flowChartDecision',
    FlowChartData = 'flowChartInputOutput',
    FlowChartPredefinedProcess = 'flowChartPredefinedProcess',
    FlowChartInternalStorage = 'flowChartInternalStorage',
    FlowChartDocument = 'flowChartDocument',
    FlowChartMultiDocument = 'flowChartMultidocument',
    FlowChartTerminator = 'flowChartTerminator',
    FlowChartPreparation = 'flowChartPreparation',
    FlowChartManualInput = 'flowChartManualInput',
    FlowChartManualOperation = 'flowChartManualOperation',
    FlowChartConnector = 'flowChartConnector',
    FlowChartOffPageConnector = 'flowChartOffpageConnector',
    FlowChartCard = 'flowChartPunchedCard',
    FlowChartPunchedTape = 'flowChartPunchedTape',
    FlowChartSummingJunction = 'flowChartSummingJunction',
    FlowChartOr = 'flowChartOr',
    FlowChartCollate = 'flowChartCollate',
    FlowChartSort = 'flowChartSort',
    FlowChartExtract = 'flowChartExtract',
    FlowChartMerge = 'flowChartMerge',
    FlowChartStoredData = 'flowChartOfflineStorage',
    FlowChartDelay = 'flowChartDelay',
    FlowChartSequentialAccessStorage = 'flowChartMagneticTape',
    FlowChartMagneticDisk = 'flowChartMagneticDisk',
    FlowChartDirectAccessStorage = 'flowChartMagneticDrum',
    FlowChartDisplay = 'flowChartDisplay',
    FlowChartOnlineStorage = 'flowChartOnlineStorage',

    Explosion1 = 'irregularSeal1',
    Explosion2 = 'irregularSeal2',

    Star4Point = 'star4',
    Star5Point = 'star5',
    Star6Point = 'star6',
    Star7Point = 'star7',
    Star8Point = 'star8',
    Star10Point = 'star10',
    Star12Point = 'star12',
    Star16Point = 'star16',
    Star24Point = 'star24',
    Star32Point = 'star32',

    UpRibbon = 'ribbon',
    DownRibbon = 'ribbon2',
    CurvedUpRibbon = 'ellipseRibbon',
    CurvedDownRibbon = 'ellipseRibbon2',
    LeftRightRibbon = 'leftRightRibbon',
    VerticalScroll = 'verticalScroll',
    HorizontalScroll = 'horizontalScroll',
    Wave = 'wave',
    DoubleWave = 'doubleWave',

    RectangularCallout = 'wedgeRectCallout',
    RoundedRectangularCallout = 'wedgeRoundRectCallout',
    OvalCallout = 'wedgeEllipseCallout',
    CloudCallout = 'cloudCallout',

    LineCallout1 = 'callout1',
    LineCallout2 = 'callout2',
    LineCallout3 = 'callout3',

    LineCallout1AccentBar = 'accentCallout1',
    LineCallout2AccentBar = 'accentCallout2',
    LineCallout3AccentBar = 'accentCallout3',

    LineCallout1NoBorder = 'borderCallout1',
    LineCallout2NoBorder = 'borderCallout2',
    LineCallout3NoBorder = 'borderCallout3',

    LineCallout1BorderAndAccentBar = 'accentBorderCallout1',
    LineCallout2BorderAndAccentBar = 'accentBorderCallout2',
    LineCallout3BorderAndAccentBar = 'accentBorderCallout3',

    StraightConnector = 'straightConnector1',
    BentConnector2 = 'bentConnector2',
    BentConnector3 = 'bentConnector3',
    BentConnector4 = 'bentConnector4',
    BentConnector5 = 'bentConnector5',
    CurvedConnector2 = 'curvedConnector2',
    CurvedConnector3 = 'curvedConnector3',
    CurvedConnector4 = 'curvedConnector4',
    CurvedConnector5 = 'curvedConnector5',

    ActionButtonBlank = 'actionButtonBlank',
    ActionButtonHome = 'actionButtonHome',
    ActionButtonHelp = 'actionButtonHelp',
    ActionButtonInformation = 'actionButtonInformation',
    ActionButtonForwardNext = 'actionButtonForwardNext',
    ActionButtonBackPrevious = 'actionButtonBackPrevious',
    ActionButtonEnd = 'actionButtonEnd',
    ActionButtonBeginning = 'actionButtonBeginning',
    ActionButtonReturn = 'actionButtonReturn',
    ActionButtonDocument = 'actionButtonDocument',
    ActionButtonSound = 'actionButtonSound',
    ActionButtonMovie = 'actionButtonMovie',

    Gear6 = 'gear6',
    Gear9 = 'gear9',
    Funnel = 'funnel',
    CornerTabs = 'cornerTabs',
    SquareTabs = 'squareTabs',
    PlaqueTabs = 'plaqueTabs',
    ChartX = 'chartX',
    ChartStar = 'chartStar',
    ChartPlus = 'chartPlus',
    Custom = 'custom'
}


/**
 * Preset auto-shape tokens that serialize as `a:prstGeom/@prst`.
 * Excludes {@link AutoShapeType.Custom} and {@link AutoShapeType.Unknown}.
 * @public
 */
export type PresetAutoShapeType = Exclude<
AutoShapeType,
  typeof AutoShapeType.Custom | typeof AutoShapeType.Unknown
>;

/**
 * Closed set of public AutoShapeType values (presets, Custom, Unknown).
 * @public
 */
export const AUTO_SHAPE_TYPE_VALUES: ReadonlyArray<AutoShapeType> = enumValues<AutoShapeType>(AutoShapeType);

const AUTO_SHAPE_TYPE_SET: ReadonlySet<string> = new Set(AUTO_SHAPE_TYPE_VALUES);

/**
 * Whether `value` is a public AutoShapeType (preset, Custom, or Unknown).
 *
 * @param {string} value - The value.
 * @returns {*} The result.
 * @private
 */
export function isAutoShapeType(value: string): value is AutoShapeType {
    return AUTO_SHAPE_TYPE_SET.has(value);
}

/**
 * Whether `value` is a preset auto-shape (serializable `a:prstGeom/@prst`).
 * Excludes Custom and Unknown.
 *
 * @param {string} value - The value.
 * @returns {*} The result.
 * @private
 */
export function isPresetAutoShapeType(value: string): value is PresetAutoShapeType {
    return isStShapeType(value);
}
