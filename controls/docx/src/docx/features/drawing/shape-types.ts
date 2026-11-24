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
 *
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
 * Specifies the geometry of an auto shape.
 *
 * The Custom value indicates a custom geometry, and the Unknown value indicates a geometry that is not recognized.
 *
 * @public
 */
export enum AutoShapeType {
    /** Specifies the unknown type. */
    Unknown = 'unknown',

    /** Specifies the rectangle type. */
    Rectangle = 'rect',
    /** Specifies the rounded rectangle type. */
    RoundedRectangle = 'roundRect',
    /** Specifies the snip single corner rectangle type. */
    SnipSingleCornerRectangle = 'snip1Rect',
    /** Specifies the snip same side corner rectangle type. */
    SnipSameSideCornerRectangle = 'snip2SameRect',
    /** Specifies the snip diagonal corner rectangle type. */
    SnipDiagonalCornerRectangle = 'snip2DiagRect',
    /** Specifies the snip and round single corner rectangle type. */
    SnipAndRoundSingleCornerRectangle = 'snipRoundRect',
    /** Specifies the round single corner rectangle type. */
    RoundSingleCornerRectangle = 'round1Rect',
    /** Specifies the round same side corner rectangle type. */
    RoundSameSideCornerRectangle = 'round2SameRect',
    /** Specifies the round diagonal corner rectangle type. */
    RoundDiagonalCornerRectangle = 'round2DiagRect',

    /** Specifies the oval type. */
    Oval = 'ellipse',
    /** Specifies the isosceles triangle type. */
    IsoscelesTriangle = 'triangle',
    /** Specifies the right triangle type. */
    RightTriangle = 'rtTriangle',
    /** Specifies the parallelogram type. */
    Parallelogram = 'parallelogram',
    /** Specifies the trapezoid type. */
    Trapezoid = 'trapezoid',
    /** Specifies the non isosceles trapezoid type. */
    NonIsoscelesTrapezoid = 'nonIsoscelesTrapezoid',
    /** Specifies the diamond type. */
    Diamond = 'diamond',
    /** Specifies the regular pentagon type. */
    RegularPentagon = 'pentagon',
    /** Specifies the hexagon type. */
    Hexagon = 'hexagon',
    /** Specifies the heptagon type. */
    Heptagon = 'heptagon',
    /** Specifies the octagon type. */
    Octagon = 'octagon',
    /** Specifies the decagon type. */
    Decagon = 'decagon',
    /** Specifies the dodecagon type. */
    Dodecagon = 'dodecagon',

    /** Specifies the pie type. */
    Pie = 'pie',
    /** Specifies the pie wedge type. */
    PieWedge = 'pieWedge',
    /** Specifies the chord type. */
    Chord = 'chord',
    /** Specifies the teardrop type. */
    Teardrop = 'teardrop',
    /** Specifies the frame type. */
    Frame = 'frame',
    /** Specifies the half frame type. */
    HalfFrame = 'halfFrame',
    /** Specifies the l shape type. */
    LShape = 'corner',
    /** Specifies the diagonal stripe type. */
    DiagonalStripe = 'diagStripe',
    /** Specifies the cross type. */
    Cross = 'plus',
    /** Specifies the plaque type. */
    Plaque = 'plaque',
    /** Specifies the can type. */
    Can = 'can',
    /** Specifies the cube type. */
    Cube = 'cube',
    /** Specifies the bevel type. */
    Bevel = 'bevel',
    /** Specifies the donut type. */
    Donut = 'donut',
    /** Specifies the no symbol type. */
    NoSymbol = 'noSmoking',
    /** Specifies the block arc type. */
    BlockArc = 'blockArc',
    /** Specifies the folded corner type. */
    FoldedCorner = 'foldedCorner',
    /** Specifies the smiley face type. */
    SmileyFace = 'smileyFace',
    /** Specifies the heart type. */
    Heart = 'heart',
    /** Specifies the lightning bolt type. */
    LightningBolt = 'lightningBolt',
    /** Specifies the sun type. */
    Sun = 'sun',
    /** Specifies the moon type. */
    Moon = 'moon',
    /** Specifies the cloud type. */
    Cloud = 'cloud',
    /** Specifies the arc type. */
    Arc = 'arc',

    /** Specifies the double bracket type. */
    DoubleBracket = 'bracketPair',
    /** Specifies the double brace type. */
    DoubleBrace = 'bracePair',
    /** Specifies the left bracket type. */
    LeftBracket = 'leftBracket',
    /** Specifies the right bracket type. */
    RightBracket = 'rightBracket',
    /** Specifies the left brace type. */
    LeftBrace = 'leftBrace',
    /** Specifies the right brace type. */
    RightBrace = 'rightBrace',

    /** Specifies the right arrow type. */
    RightArrow = 'rightArrow',
    /** Specifies the left arrow type. */
    LeftArrow = 'leftArrow',
    /** Specifies the up arrow type. */
    UpArrow = 'upArrow',
    /** Specifies the down arrow type. */
    DownArrow = 'downArrow',
    /** Specifies the left right arrow type. */
    LeftRightArrow = 'leftRightArrow',
    /** Specifies the up down arrow type. */
    UpDownArrow = 'upDownArrow',
    /** Specifies the quad arrow type. */
    QuadArrow = 'quadArrow',
    /** Specifies the left right up arrow type. */
    LeftRightUpArrow = 'leftRightUpArrow',
    /** Specifies the bent arrow type. */
    BentArrow = 'bentArrow',
    /** Specifies the u turn arrow type. */
    UTurnArrow = 'uturnArrow',
    /** Specifies the left up arrow type. */
    LeftUpArrow = 'leftUpArrow',
    /** Specifies the bent up arrow type. */
    BentUpArrow = 'bentUpArrow',
    /** Specifies the curved right arrow type. */
    CurvedRightArrow = 'curvedRightArrow',
    /** Specifies the curved left arrow type. */
    CurvedLeftArrow = 'curvedLeftArrow',
    /** Specifies the curved up arrow type. */
    CurvedUpArrow = 'curvedUpArrow',
    /** Specifies the curved down arrow type. */
    CurvedDownArrow = 'curvedDownArrow',
    /** Specifies the striped right arrow type. */
    StripedRightArrow = 'stripedRightArrow',
    /** Specifies the notched right arrow type. */
    NotchedRightArrow = 'notchedRightArrow',
    /** Specifies the pentagon type. */
    Pentagon = 'homePlate',
    /** Specifies the chevron type. */
    Chevron = 'chevron',

    /** Specifies the right arrow callout type. */
    RightArrowCallout = 'rightArrowCallout',
    /** Specifies the left arrow callout type. */
    LeftArrowCallout = 'leftArrowCallout',
    /** Specifies the up arrow callout type. */
    UpArrowCallout = 'upArrowCallout',
    /** Specifies the down arrow callout type. */
    DownArrowCallout = 'downArrowCallout',
    /** Specifies the left right arrow callout type. */
    LeftRightArrowCallout = 'leftRightArrowCallout',
    /** Specifies the up down arrow callout type. */
    UpDownArrowCallout = 'upDownArrowCallout',
    /** Specifies the quad arrow callout type. */
    QuadArrowCallout = 'quadArrowCallout',
    /** Specifies the circular arrow type. */
    CircularArrow = 'circularArrow',
    /** Specifies the left circular arrow type. */
    LeftCircularArrow = 'leftCircularArrow',
    /** Specifies the left right circular arrow type. */
    LeftRightCircularArrow = 'leftRightCircularArrow',
    /** Specifies the swoosh arrow type. */
    SwooshArrow = 'swooshArrow',

    /** Specifies the math plus type. */
    MathPlus = 'mathPlus',
    /** Specifies the math minus type. */
    MathMinus = 'mathMinus',
    /** Specifies the math multiply type. */
    MathMultiply = 'mathMultiply',
    /** Specifies the math division type. */
    MathDivision = 'mathDivide',
    /** Specifies the math equal type. */
    MathEqual = 'mathEqual',
    /** Specifies the math not equal type. */
    MathNotEqual = 'mathNotEqual',

    /** Specifies the flow chart process type. */
    FlowChartProcess = 'flowChartProcess',
    /** Specifies the flow chart alternate process type. */
    FlowChartAlternateProcess = 'flowChartAlternateProcess',
    /** Specifies the flow chart decision type. */
    FlowChartDecision = 'flowChartDecision',
    /** Specifies the flow chart data type. */
    FlowChartData = 'flowChartInputOutput',
    /** Specifies the flow chart predefined process type. */
    FlowChartPredefinedProcess = 'flowChartPredefinedProcess',
    /** Specifies the flow chart internal storage type. */
    FlowChartInternalStorage = 'flowChartInternalStorage',
    /** Specifies the flow chart document type. */
    FlowChartDocument = 'flowChartDocument',
    /** Specifies the flow chart multi document type. */
    FlowChartMultiDocument = 'flowChartMultidocument',
    /** Specifies the flow chart terminator type. */
    FlowChartTerminator = 'flowChartTerminator',
    /** Specifies the flow chart preparation type. */
    FlowChartPreparation = 'flowChartPreparation',
    /** Specifies the flow chart manual input type. */
    FlowChartManualInput = 'flowChartManualInput',
    /** Specifies the flow chart manual operation type. */
    FlowChartManualOperation = 'flowChartManualOperation',
    /** Specifies the flow chart connector type. */
    FlowChartConnector = 'flowChartConnector',
    /** Specifies the flow chart off page connector type. */
    FlowChartOffPageConnector = 'flowChartOffpageConnector',
    /** Specifies the flow chart card type. */
    FlowChartCard = 'flowChartPunchedCard',
    /** Specifies the flow chart punched tape type. */
    FlowChartPunchedTape = 'flowChartPunchedTape',
    /** Specifies the flow chart summing junction type. */
    FlowChartSummingJunction = 'flowChartSummingJunction',
    /** Specifies the flow chart or type. */
    FlowChartOr = 'flowChartOr',
    /** Specifies the flow chart collate type. */
    FlowChartCollate = 'flowChartCollate',
    /** Specifies the flow chart sort type. */
    FlowChartSort = 'flowChartSort',
    /** Specifies the flow chart extract type. */
    FlowChartExtract = 'flowChartExtract',
    /** Specifies the flow chart merge type. */
    FlowChartMerge = 'flowChartMerge',
    /** Specifies the flow chart stored data type. */
    FlowChartStoredData = 'flowChartOfflineStorage',
    /** Specifies the flow chart delay type. */
    FlowChartDelay = 'flowChartDelay',
    /** Specifies the flow chart sequential access storage type. */
    FlowChartSequentialAccessStorage = 'flowChartMagneticTape',
    /** Specifies the flow chart magnetic disk type. */
    FlowChartMagneticDisk = 'flowChartMagneticDisk',
    /** Specifies the flow chart direct access storage type. */
    FlowChartDirectAccessStorage = 'flowChartMagneticDrum',
    /** Specifies the flow chart display type. */
    FlowChartDisplay = 'flowChartDisplay',
    /** Specifies the flow chart online storage type. */
    FlowChartOnlineStorage = 'flowChartOnlineStorage',

    /** Specifies the explosion1 type. */
    Explosion1 = 'irregularSeal1',
    /** Specifies the explosion2 type. */
    Explosion2 = 'irregularSeal2',

    /** Specifies the star4 point type. */
    Star4Point = 'star4',
    /** Specifies the star5 point type. */
    Star5Point = 'star5',
    /** Specifies the star6 point type. */
    Star6Point = 'star6',
    /** Specifies the star7 point type. */
    Star7Point = 'star7',
    /** Specifies the star8 point type. */
    Star8Point = 'star8',
    /** Specifies the star10 point type. */
    Star10Point = 'star10',
    /** Specifies the star12 point type. */
    Star12Point = 'star12',
    /** Specifies the star16 point type. */
    Star16Point = 'star16',
    /** Specifies the star24 point type. */
    Star24Point = 'star24',
    /** Specifies the star32 point type. */
    Star32Point = 'star32',

    /** Specifies the up ribbon type. */
    UpRibbon = 'ribbon',
    /** Specifies the down ribbon type. */
    DownRibbon = 'ribbon2',
    /** Specifies the curved up ribbon type. */
    CurvedUpRibbon = 'ellipseRibbon',
    /** Specifies the curved down ribbon type. */
    CurvedDownRibbon = 'ellipseRibbon2',
    /** Specifies the left right ribbon type. */
    LeftRightRibbon = 'leftRightRibbon',
    /** Specifies the vertical scroll type. */
    VerticalScroll = 'verticalScroll',
    /** Specifies the horizontal scroll type. */
    HorizontalScroll = 'horizontalScroll',
    /** Specifies the wave type. */
    Wave = 'wave',
    /** Specifies the double wave type. */
    DoubleWave = 'doubleWave',

    /** Specifies the rectangular callout type. */
    RectangularCallout = 'wedgeRectCallout',
    /** Specifies the rounded rectangular callout type. */
    RoundedRectangularCallout = 'wedgeRoundRectCallout',
    /** Specifies the oval callout type. */
    OvalCallout = 'wedgeEllipseCallout',
    /** Specifies the cloud callout type. */
    CloudCallout = 'cloudCallout',

    /** Specifies the line callout1 type. */
    LineCallout1 = 'callout1',
    /** Specifies the line callout2 type. */
    LineCallout2 = 'callout2',
    /** Specifies the line callout3 type. */
    LineCallout3 = 'callout3',

    /** Specifies the line callout1 accent bar type. */
    LineCallout1AccentBar = 'accentCallout1',
    /** Specifies the line callout2 accent bar type. */
    LineCallout2AccentBar = 'accentCallout2',
    /** Specifies the line callout3 accent bar type. */
    LineCallout3AccentBar = 'accentCallout3',

    /** Specifies the line callout1 no border type. */
    LineCallout1NoBorder = 'borderCallout1',
    /** Specifies the line callout2 no border type. */
    LineCallout2NoBorder = 'borderCallout2',
    /** Specifies the line callout3 no border type. */
    LineCallout3NoBorder = 'borderCallout3',

    /** Specifies the line callout1 border and accent bar type. */
    LineCallout1BorderAndAccentBar = 'accentBorderCallout1',
    /** Specifies the line callout2 border and accent bar type. */
    LineCallout2BorderAndAccentBar = 'accentBorderCallout2',
    /** Specifies the line callout3 border and accent bar type. */
    LineCallout3BorderAndAccentBar = 'accentBorderCallout3',

    /** Specifies the straight connector type. */
    StraightConnector = 'straightConnector1',
    /** Specifies the bent connector2 type. */
    BentConnector2 = 'bentConnector2',
    /** Specifies the bent connector3 type. */
    BentConnector3 = 'bentConnector3',
    /** Specifies the bent connector4 type. */
    BentConnector4 = 'bentConnector4',
    /** Specifies the bent connector5 type. */
    BentConnector5 = 'bentConnector5',
    /** Specifies the curved connector2 type. */
    CurvedConnector2 = 'curvedConnector2',
    /** Specifies the curved connector3 type. */
    CurvedConnector3 = 'curvedConnector3',
    /** Specifies the curved connector4 type. */
    CurvedConnector4 = 'curvedConnector4',
    /** Specifies the curved connector5 type. */
    CurvedConnector5 = 'curvedConnector5',

    /** Specifies the action button blank type. */
    ActionButtonBlank = 'actionButtonBlank',
    /** Specifies the action button home type. */
    ActionButtonHome = 'actionButtonHome',
    /** Specifies the action button help type. */
    ActionButtonHelp = 'actionButtonHelp',
    /** Specifies the action button information type. */
    ActionButtonInformation = 'actionButtonInformation',
    /** Specifies the action button forward next type. */
    ActionButtonForwardNext = 'actionButtonForwardNext',
    /** Specifies the action button back previous type. */
    ActionButtonBackPrevious = 'actionButtonBackPrevious',
    /** Specifies the action button end type. */
    ActionButtonEnd = 'actionButtonEnd',
    /** Specifies the action button beginning type. */
    ActionButtonBeginning = 'actionButtonBeginning',
    /** Specifies the action button return type. */
    ActionButtonReturn = 'actionButtonReturn',
    /** Specifies the action button document type. */
    ActionButtonDocument = 'actionButtonDocument',
    /** Specifies the action button sound type. */
    ActionButtonSound = 'actionButtonSound',
    /** Specifies the action button movie type. */
    ActionButtonMovie = 'actionButtonMovie',

    /** Specifies the gear6 type. */
    Gear6 = 'gear6',
    /** Specifies the gear9 type. */
    Gear9 = 'gear9',
    /** Specifies the funnel type. */
    Funnel = 'funnel',
    /** Specifies the corner tabs type. */
    CornerTabs = 'cornerTabs',
    /** Specifies the square tabs type. */
    SquareTabs = 'squareTabs',
    /** Specifies the plaque tabs type. */
    PlaqueTabs = 'plaqueTabs',
    /** Specifies the chart x type. */
    ChartX = 'chartX',
    /** Specifies the chart star type. */
    ChartStar = 'chartStar',
    /** Specifies the chart plus type. */
    ChartPlus = 'chartPlus',
    /** Specifies the custom type. */
    Custom = 'custom'
}


/**
 * Preset auto-shape tokens that serialize as `a:prstGeom/@prst`.
 * Excludes {@link AutoShapeType.Custom} and {@link AutoShapeType.Unknown}.
 *
 * @public
 */
export type PresetAutoShapeType = Exclude<
AutoShapeType,
  typeof AutoShapeType.Custom | typeof AutoShapeType.Unknown
>;

/**
 * Closed set of public AutoShapeType values (presets, Custom, Unknown).
 *
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
