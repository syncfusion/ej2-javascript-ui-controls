import { FileType, ShapeType, ImageFinetuneOption, ImageFilterOption } from '../index';
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
    cancel: boolean;

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
    preventScaling: boolean;

    /**
     * Defines whether to cancel the cropping action of image editor.
     */
    cancel: boolean;
}

/**
 * The Interface which contains the properties for rotate transition in the Image Editor.
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
    cancel: boolean;
}

/**
 * The Interface which contains the properties for flip transition in the Image Editor.
 */
export interface FlipEventArgs {
    /**
     * Returns the direction(Horizontal and vertical) to be flipped.
     */
    direction: string;
    /**
     * Defines the cancel option to cancel the flip action.
     */
    cancel: boolean;
    /**
     * Returns the previous flipped direction of image.
     */
    previousDirection: string;
}

/**
 * The Interface which contains the properties for shape change in Image Editor.
 */
export interface ShapeChangeEventArgs {
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
     * Returns the points collection of freehand drawing.
     */
    points?: Point[];
}

/**
 * Interface for filter option for the image.
 */
export interface ImageFilterEventArgs {
    /**
     * Specifies the when applying filter to an image.
     */
    filter: ImageFilterOption;
    /**
     * Defines the cancel option to cancel the filter action.
     */
    cancel: boolean;
}

/**
 * Interface for fine tunes option for the image.
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
    cancel: boolean;
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
 * Interface for quick access toolbar for the image.
 *
 * @private
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
     * Returns the type of shape to be selected such as Rectangle, Text, Line, Ellipse, Arrow, Path, or Freehand draw.
     */
    shape?: string;
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
}
