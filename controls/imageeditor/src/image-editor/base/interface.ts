import { FileType, ShapeType, ImageFinetuneOption, ImageFilterOption, FrameType, FrameLineStyle, ArrowheadType } from '../index';
import { ItemModel } from '@syncfusion/ej2-navigations';

/**
 * This interface is used to specify settings for image finetuning operations, including minimum and maximum values, as well as default values.
 */
export interface ImageFinetuneValue {

    /**
     * Specifies the minimum value of finetune option.
     *
     * @default null
     */
    min: number;

    /**
     * Specifies the maximum value of finetune option.
     *
     * @default null
     */
    max: number;

    /**
     * Specifies the default value of finetune option.
     *
     * @default null
     */
    defaultValue: number;
}

/**
 * The Interface which contains the properties for zoom transition occur in the Image Editor.
 *
 * @remarks
 * The `cancel` and `previousZoomFactor` properties were used for `zooming` event.
 */
export interface ZoomEventArgs {
    /**
     * Returns the point in which the zooming action was performed.
     *
     * @remarks
     * The given value is a point object which has x and y coordinates.
     *
     */
    zoomPoint: Point;

    /**
     * Returns the previous zoom factor that already had before this current zooming action.
     *
     * @remarks
     * The previous and current zoom factor is used for finding whether the performed zooming is a zoom in or zoom out.
     *
     */
    previousZoomFactor: number

    /**
     * Returns the current zoomed level, in which the loaded image is enlarged in the image editor.
     *
     * @remarks
     * The previous and current zoom factor is used for finding whether the performed zooming is a zoom in or zoom out.
     *
     */
    currentZoomFactor: number

    /**
     * Specifies a value that indicates whether the zooming action can be canceled in image editor.
     */
    cancel?: boolean;

    /**
     * Returns the type of zooming performed in the image editor.
     *
     * @remarks
     * This property is used to get the type of zooming performed in the editor.
     * The possible values of this property are 'MouseWheel', 'Pinch', 'Commands', and 'Toolbar'.
     * The value of this property will be updated each time a zoom operation is performed.
     * MouseWheel - It indicates the zooming performed using mouse wheel.
     * Pinch - It indicates that zooming is performed using pinch gestures on touch-enabled devices.
     * Commands - It indicates that zooming is performed by clicking the CTRL key and either the plus (+) or minus (-) buttons on the keyboard.
     * Toolbar - It indicates that zooming is performed using toolbar buttons.
     * By default, this property is set to 'Toolbar'.
     *
     *
     */
    zoomTrigger: string;
}

/**
 * The Interface which contains the properties for pan transition occur in the Image Editor.
 */
export interface PanEventArgs {
    /**
     * Returns the (x, y) point of panning started
     */
    startPoint: Point;

    /**
     * Returns the (x, y) point to be panning ended.
     */
    endPoint: Point;

    /**
     * Defines whether to cancel the panning action of image editor.
     */
    cancel: boolean;
}

/**
 * The Interface which contains the properties for crop transition occurs in the Image Editor.
 *
 * @remarks
 * The `cancel` and `preventScaling` properties were used for `cropping` event.
 */
export interface CropEventArgs {
    /**
     * Returns the start point of the crop region.
     *
     * @remarks
     * The start and end point is used get the cropping region in an image editor.
     *
     */
    startPoint: Point;

    /**
     * Returns the end point of the crop region.
     *
     * @remarks
     * The start and end point is used get the cropping region in an image editor.
     *
     */
    endPoint: Point;

    /**
     * Specifies whether to prevent scale-based cropping in the image editor.
     */
    preventScaling?: boolean;

    /**
     * Defines whether to cancel the cropping action of image editor.
     */
    cancel?: boolean;
}

/**
 * The Interface which contains the properties for rotate transition in the Image Editor.
 *
 * @remarks
 * The `cancel` and `previousDegree` properties were used for `rotating` event.
 */
export interface RotateEventArgs {
    /**
     * Returns the current degree to be rotated.
     */
    currentDegree: number;

    /**
     * Returns the previous degree of rotated image.
     */
    previousDegree: number;

    /**
     * Defines whether to cancel the rotating action of image editor.
     */
    cancel?: boolean;
}

/**
 * The Interface which contains the properties for flip transition in the Image Editor.
 *
 * @remarks
 * The `cancel` and `previousDirection` properties were used for `flipping` event.
 */
export interface FlipEventArgs {
    /**
     * Returns the direction(Horizontal and vertical) to be flipped.
     */
    direction: string;
    /**
     * Defines the cancel option to cancel the flip action.
     */
    cancel?: boolean;
    /**
     * Returns the previous flipped direction of image.
     */
    previousDirection: string;
}

/**
 * The Interface which contains the properties for shape change in Image Editor.
 *
 * @remarks
 * The `cancel` and `previousShapeSettings` properties were used for `shapeChanging` event.
 */
export interface ShapeChangeEventArgs {
    /**
     * Defines the cancel option to cancel the shape change action.
     */
    cancel?: boolean;
    /**
     * Returns the name of the action.
     */
    action?: string;
    /**
     * Returns the object of shape before moved, resized, or customized the UI.
     */
    previousShapeSettings?: ShapeSettings;
    /**
     * Returns `the object of shape which is inserted or moved or deleted or resized or customized the UI.
     */
    currentShapeSettings?: ShapeSettings;
}

/**
 * The Interface which contains the properties for selection change in Image Editor.
 */
export interface SelectionChangeEventArgs {
    /**
     * Returns the name of the action.
     */
    action?: string;
    /**
     * Returns the object of selection before resized, or customized the UI.
     */
    previousSelectionSettings?: CropSelectionSettings;
    /**
     * Returns the object of selection which is inserted or deleted or resized or customized the UI.
     */
    currentSelectionSettings?: CropSelectionSettings;
}

/**
 * The Interface which contains the properties for Toolbar events.
 */
export interface ToolbarEventArgs {
    /**
     * Defines whether the to cancel the toolbar updating/refreshing action in the image editor.
     */
    cancel?: boolean;

    /**
     * Returns the current toolbar type.
     */
    toolbarType?: string;

    /**
     * Returns the current toolbar item.
     */
    item?: ItemModel;

    /**
     * Specifies the toolbar item collection to be rendered as contextual toolbar.
     *
     * @remarks
     * This property collection contains string and ItemModel values.
     * The string values representing the names of the built-in toolbar items to be displayed.
     * The ItemModel values representing the object of custom toolbar items to be displayed.
     *
     */
    toolbarItems?: (string | ItemModel)[];
}

/**
 * The Interface which contains the properties for opening the image.
 */
export interface OpenEventArgs {
    /**
     * Returns the file name of an image.
     */
    fileName: string;
    /**
     * Returns the file type of an image.
     */
    fileType: FileType;
    /**
     * Returns whether the loaded file is valid in the image editor.
     */
    isValidImage: boolean;
}

/**
 * The Interface which contains the properties for saving the canvas as image.
 */
export interface SaveEventArgs {
    /**
     * Returns the file name of an image.
     */
    fileName: string;
    /**
     * Returns the file type of an image.
     */
    fileType: FileType;
}

/**
 * The Interface which contains the properties for before saving the canvas as image.
 */
export interface BeforeSaveEventArgs {
    /**
     * Defines whether the to cancel the saving action in the image editor.
     */
    cancel: boolean;
    /**
     * Specifies the file name for an image.
     */
    fileName: string;
    /**
     * Returns the file type for an image.
     */
    fileType: FileType;
}

/**
 * The Interface which contains the properties for Point Object in the image editor.
 *
 */
export interface Point {
    /**
     * Returns the x position in the canvas.
     */
    x: number;
    /**
     * Returns y position in the canvas.
     */
    y: number;
    /**
     * Returns the x ratio from in the image.
     *
     * @private
     */
    ratioX?: number;
    /**
     * Returns y ratio from the image.
     *
     * @private
     */
    ratioY?: number;
    /**
     * Specifies the time.
     *
     * @private
     */
    time?: number;
}

/**
 * Interface for CropSelectionSettings in the Image Editor.
 */
export interface CropSelectionSettings {
    /**
     * Returns the type of the selection.
     */
    type: string;
    /**
     * Returns the start x position of the selection.
     */
    startX: number;
    /**
     * Returns the start y position of the selection.
     */
    startY: number;
    /**
     * Returns the width of the selection.
     */
    width?: number;
    /**
     * Returns the height of the selection.
     */
    height?: number
}

/**
 * Interface for ShapeSettings in the Image Editor.
 */
export interface ShapeSettings {
    /**
     * Returns the id of the shape.
     */
    id: string;
    /**
     * Returns the type of the shape.
     */
    type: ShapeType;
    /**
     * Returns the start x position of the shape.
     */
    startX: number;
    /**
     * Returns the start y position of the shape.
     */
    startY: number;
    /**
     * Returns the opacity value of the shape.
     */
    opacity?: number;
    /**
     * Returns the width of the shape.
     */
    width?: number;
    /**
     * Returns the height of the shape.
     */
    height?: number;
    /**
     * Returns the stroke color of the shape.
     */
    strokeColor?: string;
    /**
     * Returns the fill color of the shape.
     */
    fillColor?: string;
    /**
     * Returns the stroke width of the shape.
     */
    strokeWidth?: number;
    /**
     * Returns the radius of the ellipse shape.
     */
    radius?: number;
    /**
     * Returns the length of the line or arrow shape.
     */
    length?: number;
    /**
     * Returns the text content of the text.
     */
    text?: string;
    /**
     * Returns the font size of the text.
     */
    fontSize?: number;
    /**
     * Returns the font family of the text.
     */
    fontFamily?: string;
    /**
     * Returns the font style of the text.
     */
    fontStyle?: string[];
    /**
     * Returns the font color of the text.
     */
    color?: string;
    /**
     * Returns the points collection of freehand drawing and path annotation.
     */
    points?: Point[];
    /**
     * Returns the degree of rotated shape.
     */
    degree?: number;
    /**
     * Returns the imageData of the image annotation.
     */
    imageData?: string | ImageData;
    /**
     * Returns the width radius of the ellipse shape.
     */
    radiusX?: number;
    /**
     * Returns the height radius of the ellipse shape.
     */
    radiusY?: number;
    /**
     * Returns the end x position of line and arrow.
     */
    endX?: number;
    /**
     * Returns the end y position of line and arrow.
     */
    endY?: number;
    /**
     * Returns the head type of an arrow.
     */
    arrowHead?: ArrowheadType;
    /**
     * Returns the tail type of an arrow.
     */
    arrowTail?: ArrowheadType;
    /**
     * Returns the order of the annotation in which it is placed on the image.
     */
    index?: number;
}

/**
 * The interface which contains the properties for filter option for the image.
 *
 * @remarks
 * The `cancel` property is used for `imageFiltering` event.
 */
export interface ImageFilterEventArgs {
    /**
     * Specifies the when applying filter to an image.
     */
    filter: ImageFilterOption;
    /**
     * Defines the cancel option to cancel the filter action.
     */
    cancel?: boolean;
}

/**
 * The interface which contains the properties for fine tunes option for the image.
 *
 * @remarks
 * The `cancel` property is used for `finetuneValueChanging` event.
 */
export interface FinetuneEventArgs {
    /**
     * Specifies the type of fine tunes.
     */
    finetune: ImageFinetuneOption;
    /**
     * Specifies the value of the fine tunes.
     */
    value: number;
    /**
     * Defines the cancel option to cancel the fine tunes action.
     */
    cancel?: boolean;
}

/**
 * Interface for Dimension calculation in the imageEditor.
 *
 */
export interface Dimension {
    /**
     * Gets x position from the canvas.
     */
    x?: number;
    /**
     * Gets y position from the canvas.
     */
    y?: number;
    /**
     * Gets width of the image.
     */
    width: number;
    /**
     * Gets height of the image.
     */
    height: number;
}

/**
 * Interface that provides information to the click event in the Image Editor.
 */
export interface ImageEditorClickEventArgs {
    /**
     * Returns the x and y coordinates of the mouse or touch action which performed in the Image Editor.
     */
    point: Point;
}

/**
 * The Interface which contains the properties for resize action in the Image Editor.
 *
 * @remarks
 * The `cancel`, `previousWidth`, and `previousHeight` properties were used for `resizing` event.
 */
export interface ResizeEventArgs {
    /**
     * Defines whether to cancel the resizing action of image editor.
     */
    cancel?: boolean;
    /**
     * Returns the width of the image before resizing can be performed.
     */
    previousWidth: number;
    /**
     * Returns the height of the image before resizing can be performed.
     */
    previousHeight: number;
    /**
     * Returns the width of the image after resizing can be performed.
     */
    width: number;
    /**
     * Returns the height of the image after resizing can be performed.
     */
    height: number;
    /**
     * Returns whether the resizing action should be an aspect ratio resizing or not.
     */
    isAspectRatio: boolean;
}

/**
 * Interface for quick access toolbar for the image.
 *
 */
export interface QuickAccessToolbarEventArgs {
    /**
     * Specifies whether to cancel the quick access toolbar the opening action.
     *
     * @remarks
     * Set this property to `true` to cancel the quick access toolbar opening action.
     * By default, this property is set to `false`.
     *
     */
    cancel: boolean;
    /**
     * Specifies the collection of toolbar items to be rendered in a quick access toolbar.
     *
     * @remarks
     * This property collection contains string and ItemModel values.
     * The string values representing the names of the built-in toolbar items to display.
     * The ItemModel values representing the object of custom toolbar items to display.
     * The ItemModel will be used to enable/disable the toolbar items.
     *
     */
    toolbarItems: (string | ItemModel)[];
    /**
     * Returns the type of shape to be selected such as Rectangle, Text, Line, Ellipse, Arrow, Path, Image, or Freehand draw.
     */
    shape?: string;
}

/**
 * The Interface which contains the properties for frame action in the Image Editor.
 *
 * @remarks
 * The `cancel` and `previousFrameSetting` properties were used for `frameChange` event.
 */
export interface FrameChangeEventArgs {
    /**
     * Defines whether to cancel the frame changing action of image editor.
     */
    cancel?: boolean;
    /**
     * Returns the previous frame settings applied on the image.
     */
    previousFrameSetting : FrameSettings;
    /**
     * Defines the current frame settings to be applied on the image.
     */
    currentFrameSetting : FrameSettings;
}

/**
 * Interface for a class FrameSettings
 */
export interface FrameSettings {

    /**
     * Specifies the frame option such as None, Mat, Bevel, Line, Inset, and Hook.
     *
     * @type {FrameType}
     *
     */
    type: FrameType;

    /**
     * Specifies the color of a frame.
     * A string value specifying the color of the frame. The color can be provided in various formats, including named colors ("red", "blue") and hexadecimal notation.
     *
     * @type {string}
     *
     */
    color: string;

    /**
     * Specifies the color of a frame.
     * A string value specifying the gradient color of the frame. The color can be provided in various formats, including named colors ("red", "blue") and hexadecimal notation.
     *
     * @type {string}
     *
     */
    gradientColor: string;

    /**
     * Specifies the size of a frame.
     * A number value specifying the size of the frame as a percentage. The size value indicates how much of the image's dimensions the frame occupies.
     *
     * @type {number}
     *
     */
    size: number;

    /**
     * Specifies the inset value of a frame.
     * A number value specifying the inset of the frame as a percentage. The inset value determines how far the frame is drawn inside the image boundaries.
     *
     * @remarks
     * The Inset value only be available for Line, Inset, and Hook frames.
     *
     * @type {number}
     *
     */
    inset: number;

    /**
     * Specifies the offset value of a frame.
     * A number value specifying the inset of the frame as a percentage. The inset value determines how far the frame is drawn inside the image boundaries.
     *
     * @remarks
     * The Inset value only be available for Line, Inset, and Hook frames.
     *
     * @type {number}
     *
     */
    offset: number;

    /**
     *  Specifies the radius value for line-type frame.
     *  A number value that specifies the border radius of the frame as a percentage. The border radius controls the curvature of the frame's corners or edges.
     *
     * @remarks
     * The radius value only be available for Line and Bevel frames.
     *
     * @type {number}
     *
     */
    borderRadius: number;

    /**
     *  Specifies the type of line to be drawn for line-type frame.
     *  A FrameLineStyle enumeration value that specifies the type of line to be applied as a frame.
     *
     * @remarks
     * The FrameLineStyle value only be available for Line frames.
     *
     * @type {FrameLineStyle}
     *
     */
    frameLineStyle: FrameLineStyle;

    /**
     *  Specifies the number of lines to be drawn for line-type frame.
     *
     * @remarks
     * The lineCount value only be available for Line frame.
     *
     * @type {number}
     *
     */
    lineCount: number;
}

/**
 * Interface for active object in the imageEditor.
 *
 * @private
 */
export interface ActivePoint {
    /**
     * Gets mouse down x-point.
     */
    startX: number;
    /**
     * Gets mouse down y-point.
     */
    startY: number;
    /**
     * Gets mouse move x-point.
     */
    endX?: number;
    /**
     * Gets mouse move y-point.
     */
    endY?: number;
    /**
     * Gets width of the selection.
     */
    width?: number;
    /**
     * Gets height of the selection.
     */
    height?: number;
    /**
     * Gets radius of the circle dot.
     */
    radius?: number;
}

/**
 * Defines the cropped value of all Objects for Image Editor.
 *
 * @private
 */
export interface CurrentObject {
    /**
     * Specifies the stroke color for the object in Image Editor.
     */
    cropZoom: number;
    /**
     * Specifies the stroke color for the object in Image Editor.
     */
    defaultZoom: number;
    /**
     * Specifies the stroke color for the object in Image Editor.
     */
    zoomFactor: number;
    /**
     * Specifies the stroke color for the object in Image Editor.
     */
    previousZoomValue: number;
    /**
     * Specifies the stroke color for the object in Image Editor.
     */
    straightenZoom: number;
    /**
     * Specifies the stroke color for the object in Image Editor.
     */
    totalPannedPoint: Point;
    /**
     * Specifies the stroke color for the object in Image Editor.
     */
    totalPannedClientPoint: Point;
    /**
     * Specifies the stroke color for the object in Image Editor.
     */
    totalPannedInternalPoint: Point;
    /**
     * Specifies the stroke color for the object in Image Editor.
     */
    tempFlipPanPoint: Point;
    /**
     * Specifies the stroke color for the object in Image Editor.
     */
    activeObj: SelectionPoint;
    /**
     * Specifies the stroke color for the object in Image Editor.
     */
    rotateFlipColl: string[] | number[];
    /**
     * Specifies the stroke color for the object in Image Editor.
     */
    degree: number;
    /**
     * Specifies the stroke color for the object in Image Editor.
     */
    currFlipState: string;
    /**
     * Specifies the stroke color for the object in Image Editor.
     */
    straighten: number;
    /**
     * Specifies the stroke color for the object in Image Editor.
     */
    destPoints: ActivePoint;
    /**
     * Specifies the stroke color for the object in Image Editor.
     */
    srcPoints: ActivePoint;
    /**
     * Specifies the filter for the image in Image Editor.
     */
    filter: string;
    /**
     * Specifies the brightness finetune is adjusted or not for the image in Image Editor.
     */
    isBrightAdjust: boolean;
    /**
     * Specifies the width of image to be resized in Image Editor.
     */
    aspectWidth: number;
    /**
     * Specifies the height of image to be resized in Image Editor.
     */
    aspectHeight: number;
    /**
     * Specifies the frame to be drawn in the image in Image Editor.
     */
    frame: string;
    /**
     * Specifies the finetune value in Image Editor.
     */
    adjustmentLevel: Adjustment;
    /**
     * Specifies the selected filter value in Image Editor.
     */
    currentFilter: string;
    /**
     * Specifies the frame object to be drawn on the image in Image Editor.
     */
    frameObj?: FrameValue;
    /**
     * Specifies the object collection in Image Editor.
     */
    objColl?: SelectionPoint[];
    /**
     * Specifies the point collections for freehand drawing in Image Editor.
     */
    pointColl?: Point[];
    /**
     * Specifies the selection point collections for freehand drawing in Image Editor.
     */
    selPointColl?: Point[];
    /**
     * Specifies the action collections performed after cropping in Image Editor.
     */
    afterCropActions?: string[];
    /**
     * Specifies the action collections performed after cropping in Image Editor.
     */
    currSelectionPoint?: SelectionPoint;
}

/**
 * Defines the stroke color, fillColor and strokeWidth properties for Image Editor.
 *
 * @private
 */
export interface StrokeSettings {
    /**
     * Specifies the stroke color for the object in Image Editor.
     */
    strokeColor: string;
    /**
     * Specifies the background color for the object in Image Editor.
     */
    fillColor: string;
    /**
     * Specifies the stroke width for the object in Image Editor.
     */
    strokeWidth: number;
    /**
     * Specifies the flip state for the object in Image Editor.
     */
    flipState?: string;
}

/**
 * Defines the destination and source points of image to draw in canvas.
 *
 * @private
 */
export interface ImageDimension {
    /**
     * Specifies the x coordinate where to place the image on the canvas.
     */
    destLeft: number;
    /**
     * Specifies the y coordinate where to place the image on the canvas.
     */
    destTop: number;
    /**
     * Specifies the width of the image to draw on the canvas.
     */
    destWidth: number;
    /**
     * Specifies the height of the image to draw on the canvas.
     */
    destHeight: number;
    /**
     * Specifies the x coordinate where to start clipping from the image.
     */
    srcLeft: number;
    /**
     * Specifies the y coordinate where to start clipping from the image.
     */
    srcTop: number;
    /**
     * Specifies the width of the clipped image.
     */
    srcWidth: number;
    /**
     * Specifies the height of the clipped image.
     */
    srcHeight: number;
}

/**
 * Defines the transformed values of image in canvas.
 *
 * @private
 */
export interface TransformValue {
    /**
     * Specifies the rotated degree of image on the canvas.
     */
    degree: number;
    /**
     * Specifies the flipped state of image on the canvas.
     */
    currFlipState: string;
    /**
     * Specifies the total zoomed value of image on the canvas.
     */
    zoomFactor: number;
    /**
     * Specifies the zoomed value of image in selection state on the canvas.
     */
    cropZoomFactor: number;
    /**
     * Specifies the zoomed value of image in non-selection state on the canvas.
     */
    defaultZoomFactor: number;
    /**
     * Specifies the straighten value of image on the canvas.
     */
    straighten: number;
}

/**
 * Defines the panned values of image in canvas.
 *
 * @private
 */
export interface PanPoint {
    /**
     * Specifies the temporary difference of old panned point and new panned point.
     */
    currentPannedPoint: Point;
    /**
     * Specifies the total panned point in non-rotated state from center of the image.
     */
    totalPannedPoint: Point;
    /**
     * Specifies the total temporary panned point in rotated state from center of the image.
     */
    totalPannedInternalPoint: Point;
    /**
     * Specifies the total panned point in rotated state from center of the image.
     */
    totalPannedClientPoint: Point;
}

/**
 * Defines the text, fontFamily, fontSize, bold, italic and underline properties for Image Editor.
 *
 * @private
 */
export interface TextSettings {
    /**
     * Specifies pre-defined text on canvas.
     */
    text: string;
    /**
     * Specifies the fontFamily for the text content.
     */
    fontFamily: string;
    /**
     * Specifies the fontSize for the text content.
     */
    fontSize: number;
    /**
     * Specifies the fontSize for the text content.
     */
    fontRatio: number;
    /**
     * Specifies the bold styles for the text content.
     */
    bold: boolean;
    /**
     * Specifies the italic styles for the text content.
     */
    italic: boolean;
    /**
     * Specifies the underline styles for the text content.
     */
    underline: boolean;
}

/**
 * Interface for Transition occur in the Image Editor.
 *
 * @private
 */
export interface Transition {
    /**
     * Specifies the operation name for undo / redo in Image Editor.
     */
    operation: string;
    /**
     * Specifies all previous object in Image Editor.
     */
    previousObj: CurrentObject;
    /**
     * Specifies all current object in Image Editor.
     */
    currentObj: CurrentObject;
    /**
     * Specifies the previous object collection in Image Editor.
     */
    previousObjColl: SelectionPoint[];
    /**
     * Specifies the current object collection in Image Editor.
     */
    currentObjColl: SelectionPoint[];
    /**
     * Specifies the previous point collection in Image Editor.
     */
    previousPointColl: Point[];
    /**
     * Specifies the current point collection in Image Editor.
     */
    currentPointColl: Point[];
    /**
     * Specifies the previous selection point collection in Image Editor.
     */
    previousSelPointColl: Point[];
    /**
     * Specifies the current selection point collection in Image Editor.
     */
    currentSelPointColl: Point[];
    /**
     * Specifies the previous crop object in Image Editor.
     */
    previousCropObj: CurrentObject;
    /**
     * Specifies the current crop object in Image Editor.
     */
    currentCropObj: CurrentObject;
    /**
     * Specifies the previous text from the text area in Image Editor.
     */
    previousText?: string;
    /**
     * Specifies the current text from the text area in Image Editor.
     */
    currentText?: string;
    /**
     * Specifies the current filter in Image Editor.
     */
    filter?: string;
    /**
     * Specifies the circle crop value in Image Editor.
     */
    isCircleCrop?: boolean;
    /**
     * Specifies the finetune slider value in Image Editor.
     */
    adjustmentLevel?: Adjustment;
    /**
     * Specifies the selected filter value in Image Editor.
     */
    currentFilter?: string;
}

/**
 * Interface for freehand drawing in the Image Editor.
 *
 * @private
 */
export interface FreehandDraw {
    /**
     * Specifies the last width of freehand draw points in Image Editor.
     */
    lastWidth: number;

    /**
     * Specifies the last velocity of freehand draw points in Image Editor.
     */
    lastVelocity: number;

    /**
     * Specifies the time of freehand draw points in Image Editor.
     */
    time: number;

    /**
     * Specifies the x point of freehand draw points in Image Editor.
     */
    pointX: number;

    /**
     * Specifies the y point of freehand draw points in Image Editor.
     */
    pointY: number;
}

/**
 * Interface for Transition occur in the Image Editor.
 *
 * @private
 */
export interface Adjustment {
    /**
     * Gets brightness level of image.
     */
    brightness: number;
    /**
     * Gets contrast level of image.
     */
    contrast: number;
    /**
     * Gets hue level of image.
     */
    hue: number;
    /**
     * Gets saturation level of image.
     */
    saturation: number;
    /**
     * Gets exposure level of image.
     */
    exposure: number;
    /**
     * Gets opacity level of image.
     */
    opacity: number;
    /**
     * Gets blur level of image.
     */
    blur: number;
    /**
     * Gets transparency level of image.
     */
    transparency: number;
    /**
     * Gets sharpness level of image.
     */
    sharpen: boolean;
    /**
     * Gets black and white level of image.
     */
    bw: boolean;
}

/**
 * Interface for interaction occur in the Image Editor.
 *
 * @private
 */
export interface Interaction {
    /**
     * Gets function name called from the canvas.
     */
    shape: string;
    /**
     * Gets function name called from the canvas.
     */
    isDragging: boolean;
    /**
     * Gets function name called from the canvas.
     */
    isActiveObj: boolean;
    /**
     * Gets function name called from the canvas.
     */
    isText: boolean;
    /**
     * Gets function name called from the canvas.
     */
    isInitialText: boolean;
    /**
     * Gets function name called from the canvas.
     */
    isLine: boolean;
    /**
     * Gets function name called from the canvas.
     */
    isInitialLine: boolean;
    /**
     * Gets function name called from the canvas.
     */
    isCustomCrop: boolean;
    /**
     * Gets function name called from the canvas.
     */
    isZoomed: boolean;
    /**
     * Gets function name called from the canvas.
     */
    isUndoZoom: boolean;
    /**
     * Gets function name called from the canvas.
     */
    isUndoAction: boolean;
    /**
     * Gets function name called from the canvas.
     */
    isFiltered: boolean;
    /**
     * Gets function name called from the canvas.
     */
    isSave: boolean;
    /**
     * Gets function name called from the canvas.
     */
    isResize: boolean;
}

/**
 * Interface for frame support in the Image Editor.
 *
 * @private
 */
export interface FrameValue {
    /**
     * Gets type of the frame.
     */
    type: string;
    /**
     * Gets color of the frame.
     */
    color: string;
    /**
     * Gets size of the frame.
     */
    size: number;
    /**
     * Gets inset value of the frame.
     */
    inset: number;
    /**
     * Gets offset value of the frame.
     */
    offset: number;
    /**
     * Gets radius of the frame.
     */
    radius: number;
    /**
     * Gets amount of the frame.
     */
    amount: number;
    /**
     * Gets line type of the frame.
     */
    border: string;
    /**
     * Gets gradient color of the frame.
     */
    gradientColor: string;
}

/**
 * Interface for Selection Object in the Image Editor.
 *
 * @private
 */
export interface SelectionPoint {
    /**
     * Gets start and end x, y Point.
     */
    horTopLine: ActivePoint;
    /**
     * Gets start and end x, y Point.
     */
    horTopInnerLine: ActivePoint;
    /**
     * Gets start and end x, y Point.
     */
    horBottomInnerLine: ActivePoint;
    /**
     * Gets start and end x, y Point.
     */
    horBottomLine: ActivePoint;
    /**
     * Gets start and end x, y Point.
     */
    verLeftLine: ActivePoint;
    /**
     * Gets start and end x, y Point.
     */
    verLeftInnerLine: ActivePoint;
    /**
     * Gets start and end x, y Point.
     */
    verRightInnerLine: ActivePoint;
    /**
     * Gets start and end x, y Point.
     */
    verRightLine: ActivePoint;
    /**
     * Gets start and end x, y Point with radius.
     */
    topLeftCircle: ActivePoint;
    /**
     * Gets start and end x, y Point with radius.
     */
    topCenterCircle: ActivePoint;
    /**
     * Gets start and end x, y Point with radius.
     */
    topRightCircle: ActivePoint;
    /**
     * Gets start and end x, y Point with radius.
     */
    centerLeftCircle: ActivePoint;
    /**
     * Gets start and end x, y Point with radius.
     */
    centerRightCircle: ActivePoint;
    /**
     * Gets start and end x, y Point with radius.
     */
    bottomLeftCircle: ActivePoint;
    /**
     * Gets start and end x, y Point with radius.
     */
    bottomCenterCircle: ActivePoint;
    /**
     * Gets start and end x, y Point with radius.
     */
    bottomRightCircle: ActivePoint;
    /**
     * Gets start and end x, y Point with radius.
     */
    activePoint: ActivePoint;
    /**
     * Gets angle of rotated shape.
     */
    rotatedAngle: number;
    /**
     * Gets order of shape.
     */
    order: number;
    /**
     * Gets start and end x, y Point with radius.
     */
    imageRatio?: ActivePoint;
    /**
     * Gets the shape to be drawn.
     */
    shape?: string;
    /**
     * Gets the line direction to be drawn.
     */
    lineDraw?: string;
    /**
     * Gets the text to be drawn.
     */
    keyHistory?: string;
    /**
     * Gets the direction to be dragged.
     */
    dragDirection?: string;
    /**
     * Gets the degree of the inserted shape / text.
     */
    shapeDegree?: number;
    /**
     * Gets the flipped state of shape / text.
     */
    textFlip?: string;
    /**
     * Gets the flipped state of shape / text.
     */
    shapeFlip?: string;
    /**
     * Gets the properties to customize the text.
     */
    textSettings?: TextSettings;
    /**
     * Gets the properties to customize the stroke.
     */
    strokeSettings?: StrokeSettings;
    /**
     * Gets the current index of object from the array.
     */
    currIndex?: string;
    /**
     * Gets the flip object collection from the array.
     */
    flipObjColl?: string[];
    /**
     * Gets in between x, y points of line or arrow shape.
     */
    pointColl?: Point[];
    /**
     * Gets in between x, y points of horizontal top line of shape.
     */
    horTopLinePointColl?: Point[];
    /**
     * Gets in between x, y points of horizontal bottom line of shape.
     */
    horBottomLinePointColl?: Point[];
    /**
     * Gets in between x, y points of vertical left line of shape.
     */
    verLeftLinePointColl?: Point[];
    /**
     * Gets in between x, y points of vertical right line of shape.
     */
    verRightLinePointColl?: Point[];
    /**
     * Gets x, y points of rotation shape.
     */
    rotationCirclePoint?: Point;
    /**
     * Gets x, y points of rotation shape in each rotation.
     */
    rotationCirclePointColl?: Point;
    /**
     * Gets ratio of rotation line distance in each rotation.
     */
    rotationCircleLine: number;
    /**
     * Gets the triangle value from the object.
     */
    triangle?: Point[];
    /**
     * Gets the triangle ratio from the object.
     */
    triangleRatio?: Point[];
    /**
     * Gets the triangle direction from the object.
     */
    triangleDirection?: string;
    /**
     * Gets the start type of arrow shape.
     */
    start?: string;
    /**
     * Gets the end type of arrow shape.
     */
    end?: string;
    /**
     * Gets the canvas of image shape.
     */
    imageCanvas?: HTMLCanvasElement;
    /**
     * Gets the image element of image shape.
     */
    imageElement?: HTMLImageElement;
    /**
     * Gets the image element is flipped in horizontal or not.
     */
    isHorImageFlip?: boolean;
    /**
     * Gets the image element is flipped in vertical  or not.
     */
    isVerImageFlip?: boolean;
    /**
     * Gets the transform collection values.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rotateFlipColl?: any;
    /**
     * Gets the opacity value of image annotation.
     */
    opacity?: number;
}
