/**
 * An enum representing the file types supported by the image editor.
 *
 * @enum {string}
 */
export enum FileType {
    /** The PNG file type. */
    Png = 'Png',
    /** The JPEG file type. */
    Jpeg = 'Jpeg',
    /** The SVG file type. */
    Svg = 'Svg'
}

/**
 * An enumeration representing the direction of an image editor operation.
 *
 * @enum {string}
 */
export enum Direction {
    /** The horizontal direction. */
    Horizontal = 'Horizontal',
    /** The vertical direction. */
    Vertical = 'Vertical'
}

/**
 * An enumeration representing the type of shape to be added in the image editor.
 *
 * @enum {string}
 */
export enum ShapeType {
    /** A rectangle shape. */
    Rectangle = 'Rectangle',
    /** An ellipse shape. */
    Ellipse = 'Ellipse',
    /** A line shape. */
    Line = 'Line',
    /** An arrow shape. */
    Arrow = 'Arrow',
    /** A path shape. */
    Path = 'Path',
    /** A text shape. */
    Text = 'Text',
    /** A freehand drawing shape. */
    FreehandDraw = 'FreehandDraw',
    /** An Image shape. */
    Image = 'Image'
}

/**
 * An enumeration representing the different ways to trigger zooming in the image editor.
 *
 * @aspNumberEnum
 */
export enum ZoomTrigger {
    /** Zooming triggered by mouse wheel. */
    MouseWheel = 1 << 0,
    /** Zooming triggered by pinch gesture. */
    Pinch = 1 << 1,
    /** Zooming triggered by command keys. */
    Commands = 1 << 2,
    /** Zooming triggered by toolbar button click. */
    Toolbar = 1 << 3
}

/**
 * * An enum representing the available themes in the image editor.
 */
export enum Theme {
    /** The Bootstrap 5 theme. */
    Bootstrap5 = 'Bootstrap5',
    /** The dark variant of the Bootstrap 5 theme. */
    Bootstrap5Dark = 'Bootstrap5Dark',
    /** The Tailwind CSS theme. */
    Tailwind = 'Tailwind',
    /** The dark variant of the Tailwind CSS theme. */
    TailwindDark = 'TailwindDark',
    /** The Fluent UI theme. */
    Fluent = 'Fluent',
    /** The dark variant of the Fluent UI theme. */
    FluentDark = 'FluentDark',
    /** The Bootstrap 4 theme. */
    Bootstrap4 = 'Bootstrap4',
    /** The Bootstrap theme. */
    Bootstrap = 'Bootstrap',
    /** The dark variant of the Bootstrap theme. */
    BootstrapDark = 'BootstrapDark',
    /** The Material Design theme. */
    Material = 'Material',
    /** The dark variant of the Material Design theme. */
    MaterialDark = 'MaterialDark',
    /** The Fabric theme. */
    Fabric = 'Fabric',
    /** The dark variant of the Fabric theme. */
    FabricDark = 'FabricDark',
    /** The high contrast theme. */
    Highcontrast = 'Highcontrast',
    /** The Fluent 2.0 UI theme. */
    Fluent2 = 'Fluent2',
    /** The dark variant of the Fluent 2.0 UI theme. */
    Fluent2Dark = 'Fluent2Dark'
}

/**
 * An enum representing the available toolbar commands in the image editor.
 */
export enum ImageEditorCommand {
    Crop = 'Crop',
    Transform = 'Transform',
    Annotate = 'Annotate',
    ZoomIn = 'ZoomIn',
    ZoomOut = 'ZoomOut',
    Open = 'Open',
    Reset = 'Reset',
    Save = 'Save',
    Pan = 'Pan',
    Move = 'Move',
    Pen = 'Pen',
    Line = 'Line',
    Arrow = 'Arrow',
    Path = 'Path',
    Rectangle = 'Rectangle',
    Image = 'Image',
    Ellipse = 'Ellipse',
    Text = 'Text',
    CustomSelection = 'CustomSelection',
    CircleSelection = 'CircleSelection',
    SquareSelection = 'SquareSelection',
    RatioSelection = 'RatioSelection',
    RotateLeft = 'RotateLeft',
    RotateRight = 'RotateRight',
    FlipHorizontal = 'FlipHorizontal',
    FlipVertical = 'FlipVertical',
    Undo = 'Undo',
    Redo = 'Redo',
    None = 'None',
    Mat = 'Mat',
    Bevel = 'Bevel',
    Inset = 'Inset',
    Hook = 'Hook',
    Finetune = 'Finetune',
    Filter = 'Filter',
    Frame = 'Frame',
    Resize = 'Resize',
    HorizontalFlip = 'HorizontalFlip',
    VerticalFlip = 'VerticalFlip',
    Brightness = 'Brightness',
    Contrast = 'Contrast',
    Hue = 'Hue',
    Saturation = 'Saturation',
    Opacity = 'Opacity',
    Blur = 'Blur',
    Exposure = 'Exposure',
    Default = 'Default',
    Chrome = 'Chrome',
    Cold = 'Cold',
    Warm = 'Warm',
    Grayscale = 'Grayscale',
    Sepia = 'Sepia',
    Invert = 'Invert',
    Straightening = 'Straightening',
}

/**
 * An enumeration of available image filter options.
 *
 * @remarks
 * These options can be used with the `applyImageFilter` method of the image editor control to apply filters to an image.
 */
export enum ImageFilterOption {
    /** Default filter */
    Default = 'Default',
    /** Chrome filter */
    Chrome = 'Chrome',
    /** Cold filter */
    Cold = 'Cold',
    /** Warm filter */
    Warm = 'Warm',
    /** Grayscale filter */
    Grayscale = 'Grayscale',
    /** Sepia filter */
    Sepia = 'Sepia',
    /** Invert filter */
    Invert = 'Invert'
}

/**
 * An enumeration of available image finetune options.
 *
 * @remarks
 * These options can be used with the `finetuneImage` method of the image editor control to apply finetuning to an image.
 */
export enum ImageFinetuneOption {
    /** Adjust the brightness of the image */
    Brightness = 'Brightness',
    /** Adjust the contrast of the image */
    Contrast = 'Contrast',
    /** Adjust the hue of the image */
    Hue = 'Hue',
    /** Adjust the saturation of the image */
    Saturation = 'Saturation',
    /** Adjust the exposure of the image */
    Exposure = 'Exposure',
    /** Adjust the opacity of the image */
    Opacity = 'Opacity',
    /** Adjust the blur of the image */
    Blur = 'Blur'
}

/**
 * Specifies the type of arrowhead should be drawn.
 *
 */
export enum ArrowheadType {
    /** Indicates no arrowhead should be drawn. */
    None = 'None',
    /** Indicates a normal triangle-shaped arrowhead should be drawn. */
    Arrow = 'Arrow',
    /** Indicates a solid triangle-shaped arrowhead should be drawn. */
    SolidArrow = 'SolidArrow',
    /** Indicates a circular-shaped arrowhead should be drawn. */
    Circle = 'Circle',
    /** Indicates a solid circular-shaped arrowhead should be drawn. */
    SolidCircle = 'SolidCircle',
    /** Indicates a square-shaped arrowhead should be drawn. */
    Square = 'Square',
    /** Indicates a solid square-shaped arrowhead should be drawn. */
    SolidSquare = 'SolidSquare',
    /** Indicates a bar shaped arrowhead should be drawn. */
    Bar = 'Bar'
}

/**
 * An enumeration of available frame options.
 *
 * @remarks
 * These options can be used with the `drawFrame` method of the image editor control to draw frames on an image.
 */
export enum FrameType {
    /** Represents a no frame. */
    None = 'None',
    /** Represents a mat frame. */
    Mat = 'Mat',
    /** Represents a bevel frame. */
    Bevel = 'Bevel',
    /** Represents a line frame. */
    Line = 'Line',
    /** Represents an inset frame. */
    Inset = 'Inset',
    /** Represents a hook frame. */
    Hook = 'Hook'
}

/**
 * An enumeration of available line options.
 *
 * @remarks
 * These options can be used with the `drawFrame` method of the image editor control to draw frames on an image.
 */
export enum FrameLineStyle {
    /** Represents a solid line. */
    Solid = 'Solid',
    /** Represents a dashed line. */
    Dashed = 'Dashed',
    /** Represents a dotted line. */
    Dotted = 'Dotted'
}

/**
 * An enumeration representing the type of redaction to be added in the image editor.
 *
 * @enum {string}
 */
export enum RedactType {
    /** Represents a blur redaction. */
    Blur = 'Blur',
    /** Represents a pixelate redaction. */
    Pixelate = 'Pixelate'
}
