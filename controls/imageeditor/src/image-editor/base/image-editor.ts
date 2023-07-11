import { Component, NotifyPropertyChanges, INotifyPropertyChanged, Property, addClass, removeClass, ModuleDeclaration, extend, isBlazor, BlazorDotnetObject } from '@syncfusion/ej2-base';
import { Event, EmitType, EventHandler, getComponent, isNullOrUndefined, getUniqueID } from '@syncfusion/ej2-base';
import { ItemModel, Toolbar, ClickEventArgs } from '@syncfusion/ej2-navigations';
import { createSpinner } from '@syncfusion/ej2-popups';
import { Complex, Browser, ChildProperty, compile as templateCompiler, compile } from '@syncfusion/ej2-base';
import { ImageEditorModel, FinetuneSettingsModel, ZoomSettingsModel, SelectionSettingsModel } from './image-editor-model';
import { ToolbarModule, Crop, Draw, Filter, FreehandDrawing, Selection, Shape, Transform, UndoRedo, Export, SelectionChangeEventArgs, Transition, ArrowheadType } from './../index';
import { ZoomEventArgs, PanEventArgs, CropEventArgs, RotateEventArgs, FlipEventArgs, ShapeChangeEventArgs } from './../index';
import { ToolbarEventArgs, OpenEventArgs, SaveEventArgs, BeforeSaveEventArgs, Point, ShapeSettings, ImageFilterEventArgs } from './../index';
import { FinetuneEventArgs, QuickAccessToolbarEventArgs, CurrentObject, ImageDimension, TransformValue, PanPoint } from './../index';
import { Interaction, SelectionPoint, ImageFinetuneValue, Dimension, ActivePoint, ImageEditorClickEventArgs } from './../index';
import { Direction, ZoomTrigger, Theme, ImageEditorCommand, ImageFilterOption, ImageFinetuneOption } from './../index';
import { ItemModel as DropDownButtonItemModel } from '@syncfusion/ej2-splitbuttons';


/**
 * This interface is used to specify settings for finetuning operations on images, including brightness, contrast, hue, saturation, exposure, opacity, and blur. It includes properties for setting minimum and maximum values for each of these options, as well as a default value.
 */
export class FinetuneSettings extends ChildProperty<FinetuneSettings> {
    /**
     * Represents a finetune setting for adjusting the brightness of an image.
     *
     * @type {ImageFinetuneValue}
     *
     * @property {number} value - The brightness level of the image, from -100 to 100.
     * @property {number} min - The minimum brightness value allowed, typically -100.
     * @property {number} max - The maximum brightness value allowed, typically 100.
     * @default null
     */
    @Property(null)
    public brightness: ImageFinetuneValue;

    /**
     * Represents a finetune setting for adjusting the contrast of an image.
     *
     * @type {ImageFinetuneValue}
     *
     * @property {number} value - The contrast level of the image, from -100 to 100.
     * @property {number} min - The minimum contrast value allowed, typically -100.
     * @property {number} max - The maximum contrast value allowed, typically 100.
     * @default null
     */
    @Property(null)
    public contrast: ImageFinetuneValue;

    /**
     * Represents a finetune setting for adjusting the hue of an image.
     *
     * @type {ImageFinetuneValue}
     *
     * @property {number} value - The hue level of the image, from 0 to 100.
     * @property {number} min - The minimum hue value allowed, typically 0.
     * @property {number} max - The maximum hue value allowed, typically 100.
     * @default null
     */
    @Property(null)
    public hue: ImageFinetuneValue;

    /**
     * Represents a finetune setting for adjusting the saturation of an image.
     *
     * @type {ImageFinetuneValue}
     *
     * @property {number} value - The saturation level of the image, from -100 to 100.
     * @property {number} min - The minimum saturation value allowed, typically -100.
     * @property {number} max - The maximum saturation value allowed, typically 100.
     * @default null
     */
    @Property(null)
    public saturation: ImageFinetuneValue;

    /**
     * Represents a finetune setting for adjusting the exposure of an image.
     *
     * @type {ImageFinetuneValue}
     *
     * @property {number} value - The exposure level of the image, from -100 to 100.
     * @property {number} min - The minimum exposure value allowed, typically -100.
     * @property {number} max - The maximum exposure value allowed, typically 100.
     * @default null
     */
    @Property(null)
    public exposure: ImageFinetuneValue;

    /**
     * Represents a finetune setting for adjusting the opacity of an image.
     *
     * @type {ImageFinetuneValue}
     *
     * @property {number} value - The opacity level of the image, from 0 to 100.
     * @property {number} min - The minimum opacity value allowed, typically 0.
     * @property {number} max - The maximum opacity value allowed, typically 100.
     * @default null
     */
    @Property(null)
    public opacity: ImageFinetuneValue;

    /**
     * Represents a finetune setting for adjusting the blur of an image.
     *
     * @type {ImageFinetuneValue}
     *
     * @property {number} value - The blur level of the image, from 0 to 100.
     * @property {number} min - The minimum blur value allowed, typically 0.
     * @property {number} max - The maximum blur value allowed, typically 100.
     * @default null
     */
    @Property(null)
    public blur: ImageFinetuneValue;
}

/**
 * An interface used to define the settings such as minimum, maximum, and default zoom factors, and the type of zooming which are available in the image editor control.
 */
export class ZoomSettings extends ChildProperty<ZoomSettings> {
    /**
     * Specifies the available options for zooming in an image editor control.
     *
     * @remarks
     * Use this property to enable or disable specific types of zooming in the image editor. The following zooming options are available:
     * MouseWheel: Zooming is performed by scrolling the mouse wheel up and down.
     * Pinch: Zooming is performed using pinch gestures on touch-enabled devices.
     * Commands: Zooming is performed by clicking the CTRL key and either the plus (+) or minus (-) buttons on the keyboard.
     * Toolbar: Zooming is performed using toolbar buttons.
     *
     * By default, this property is set to `null`, which enables all types of zooming.
     *
     * @default null
     * @aspNumberEnum
     */
    @Property(null)
    public zoomTrigger: ZoomTrigger;

    /**
     * Specifies the minimum zooming level to limit the zooming.
     * An integer value that specifies the minimum zooming level. And the default value is 1 (100%).
     *
     * @remarks
     * The given value is considered as percentage.
     *
     */
    @Property(1)
    public minZoomFactor: number;

    /**
     * Specifies the maximum zooming level to limit the zooming.
     * An integer value that specifies the maximum zooming level. And the default value is 10 (1000 percent).
     *
     * @remarks
     * The given value is considered as percentage.
     *
     */
    @Property(10)
    public maxZoomFactor: number;

    /**
     * Specifies the default zoom factor to be applied on initial loading of image.
     * An integer value that specifies the current zooming level. And the default value is 1 (100 percent).
     *
     * @remarks
     * The given value is considered as percentage.
     *
     */
    @Property(1)
    public zoomFactor: number;

    /**
     * Specifies the point in which the zooming  has been performed in the image editor.
     * A point value that specifies the current zooming point.
     * And the default value is null, and it can be considered as center point of the image editor.
     *
     * @remarks
     * The given value is a point object which has x and y coordinates.
     *
     */
    @Property(null)
    public zoomPoint: Point;
}

/**
 * This interface is used to specify settings for selection operations on images, including visibility, stroke color and fill color.
 */
export class SelectionSettings extends ChildProperty<SelectionSettings> {
    /**
     * Specifies a boolean value whether to show circle on selection in the image editor.
     *
     * @type {boolean}
     *
     * @default true
     */
    @Property(true)
    public showCircle: boolean;

    /**
     * Represents stroke color of circle selection in the image editor.
     *
     * @type {string}
     *
     * @default null
     */
    @Property(null)
    public strokeColor: string;

    /**
     * Represents fill color of circle selection in the image editor.
     *
     * @type {string}
     *
     * @default null
     */
    @Property(null)
    public fillColor: string;
}

/**
 * The Image Editor is a graphical user interface for editing images.
 * 
 * {% codeBlock src='image-editor/default/index.md' %}{% endcodeBlock %}
 *
 * @remarks
 * The Image Editor component provides various image editing features such as zooming, cropping, rotating, inserting text and shapes (rectangles, ellipses, and lines), drawing freehand on top of an image, undo/redo, and more.
 *
 */
@NotifyPropertyChanges
export class ImageEditor extends Component<HTMLDivElement> implements INotifyPropertyChanged {
    /**
     *
     * Image Editor Private Properties
     */

    /** @hidden */
    public isImageLoaded: boolean = false;
    /** @hidden */
    public baseImg: HTMLImageElement;
    /** @hidden */
    public lowerCanvas : HTMLCanvasElement;
    /** @hidden */
    public upperCanvas : HTMLCanvasElement;
    /** @hidden */
    public inMemoryCanvas: HTMLCanvasElement;
    /** @hidden */
    public textArea: HTMLInputElement;
    /** @hidden */
    public activeObj: SelectionPoint = {activePoint: {startX: 0, startY: 0, endX: 0, endY: 0, width: 0, height: 0},
        flipObjColl: [], triangle: [], triangleRatio: [], rotatedAngle: 0 } as SelectionPoint;
    // current object's ui interaction properties
    /** @hidden */
    public currObjType: Interaction = {shape: '', isDragging: false, isActiveObj: false, isText : false, isInitialText: false, isLine: false, isInitialLine: false,
        isCustomCrop: false, isZoomed: false, isUndoZoom: false, isUndoAction: false, isFiltered: false, isSave: false, isResize: false };
    /** @hidden */
    public objColl: SelectionPoint[] = [];
    /** @hidden */
    // eslint-disable-next-line
    public pointColl: any = {};
    /** @hidden */
    public freehandCounter: number = 0;
    /** @hidden */
    public points: Point[] = [];
    /** @hidden */
    public togglePen: boolean = false;
    /** @hidden */
    public togglePan: boolean = false;
    /** @hidden */
    public img: ImageDimension = {destLeft: 0, destTop: 0, destWidth: 0, destHeight: 0, srcLeft: 0, srcTop: 0, srcWidth: 0, srcHeight: 0};
    /** @hidden */
    public themeColl: Object;
    /** @hidden */
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    public rotateFlipColl: any = [];
    // All prop values saved while cropping (to restore the image to its original state)
    /** @hidden */
    public cropObj: CurrentObject = {cropZoom: 0, defaultZoom: 0, totalPannedPoint: {x: 0, y: 0}, totalPannedClientPoint: {x: 0, y: 0},
        totalPannedInternalPoint: {x: 0, y: 0}, tempFlipPanPoint: {x: 0, y: 0}, activeObj: {} as SelectionPoint, rotateFlipColl: [],
        degree: 0, currFlipState: '', destPoints: {startX: 0, startY: 0, width: 0, height: 0} as ActivePoint,
        srcPoints: {startX: 0, startY: 0, width: 0, height: 0} as ActivePoint, filter : '', zoomFactor: 0, previousZoomValue : 0 };
    // Stored transformations performed after cropping
    /** @hidden */
    public afterCropActions: string[] = [];
    /** @hidden */
    public currSelectionPoint: SelectionPoint;
    /** @hidden */
    public transform: TransformValue = {degree: 0, currFlipState: '', zoomFactor: 0, cropZoomFactor: null, defaultZoomFactor: 0 };
    /** @hidden */
    public panPoint: PanPoint = {currentPannedPoint: {x: 0, y: 0}, totalPannedPoint: {x: 0, y: 0}, totalPannedInternalPoint: {x: 0, y: 0},
        totalPannedClientPoint: {x: 0, y: 0} };
    /** @hidden */
    public isUndoRedo: boolean = false;
    /** @hidden */
    public isCropTab: boolean = false;
    /** @hidden */
    public isCircleCrop: boolean = false;
    /** @hidden */
    public fontSizeColl: DropDownButtonItemModel[] = [];
    /** @hidden */
    public initialAdjustmentValue: string = '';
    /** @hidden */
    public currentFilter: string = '';
    /** @hidden */
    public canvasFilter: string = 'brightness(' + 1 + ') ' + 'contrast(' + 100 + '%) ' + 'hue-rotate(' + 0 + 'deg) ' +
    'saturate(' + 100 + '%) ' + 'opacity(' + 1 + ') ' + 'blur(' + 0 + 'px) ' + 'sepia(0%) ' + 'grayscale(0%) ' + 'invert(0%)';
    /** @hidden */
    public dotNetRef: BlazorDotnetObject;
    /** @hidden */
    public toolbarHeight: number = 0;
    /** @hidden */
    // eslint-disable-next-line
    public events: any;
    /** @hidden */
    public isPublicMethod: boolean = false;
    /** @hidden */
    public cancelCropSelection: Transition;
    /** @hidden */
    public isCropToolbar: boolean = false;
    /** @hidden */
    public prevCurrSelectionPoint: SelectionPoint;
    /** @hidden */
    public cursor: string = 'default';
    /** @hidden */
    public eventType: string;
    /** @hidden */
    public panEventArgs: PanEventArgs;

    private lowerContext: CanvasRenderingContext2D;
    private upperContext: CanvasRenderingContext2D;
    private inMemoryContext: CanvasRenderingContext2D;
    private toolbarFn: Function;
    private qatFn: Function;

    /**
     * Defines one or more CSS classes that can be used to customize the appearance of an Image Editor component.
     *
     * @remarks
     * One or more CSS classes to customize the appearance of the Image Editor component, such as by changing its toolbar appearance, borders, sizes, or other visual aspects.
     *
     * @default ''
     *
     */
    @Property('')
    public cssClass: string;

    /**
     * Defines whether an Image Editor component is enabled or disabled.
     *
     * @remarks
     * A disabled Image Editor component may have a different visual appearance than an enabled one. When set to “true”, the Image Editor component will be disabled, and the user will not be able to interact with it.
     *
     * @default false
     */
    @Property(false)
    public disabled: boolean;

    /**
     * Specifies the height of the Image Editor.
     *
     * @remarks
     * The value of height is specified either as a percentage (e.g. '100%') or as a fixed pixel value (e.g. '100px').
     *
     * @default '100%'
     */
    @Property('100%')
    public height: string;

    /**
     * Specifies the theme of the Image Editor. The appearance of the shape selection in Image Editor is determined by this property.
     *
     * @remarks
     * The `theme` property supports all the built-in themes of Syncfusion, including:
     * - `Bootstrap5`
     * - `Fluent`
     * - `Tailwind`
     * - `Bootstrap4`
     * - `Material`
     * - `Fabric`
     * - `HighContrast`
     * - `Bootstrap5Dark`
     * - `Bootstrap4Dark`
     * - `MaterialDark`
     * - `FabricDark`
     * - `HighContrastDark`
     *
     * The default value is set to `Theme.Bootstrap5`.
     *
     * @isenumeration true
     * @default Theme.Bootstrap5
     * @asptype Theme
     *
     */
    @Property('Bootstrap5')
    public theme: string | Theme;

    /**
     * Specifies the toolbar items to perform UI interactions.
     * It accepts both string[] and ItemModel[] to configure its toolbar items. The default value is null.
     * If the property is not defined in the control, the default toolbar will be rendered with preconfigured toolbar commands.
     * If the property is defined as empty collection, the toolbar will not be rendered.
     * The preconfigured toolbar commands are
     * - Crop: helps to crop an image as ellipse, square, various ratio aspects, custom selection with resize, drag and drop.
     * - Annotate: help to insert a shape on image that supports rectangle, ellipse, line, arrow, path, text and freehand drawing with resize, drag and drop, and customize its appearance.
     * - Transform: helps to rotate and flip an image.
     * - Finetunes: helps to perform adjustments on an image.
     * - Filters: helps to perform predefined color filters.
     * - ZoomIn: performs zoom-in an image.
     * - ZoomOut: performs zoom-out an image.
     * - Save: save the modified image.
     * - Open: open an image to perform editing.
     * - Reset: reset the modification and restore the original image.
     *
     * {% codeBlock src='image-editor/toolbar/index.md' %}{% endcodeBlock %}
     *
     * @remarks
     * If the toolbarTemplate property is defined in the control, the toolbar will be rendered based on the toolbarTemplate property.
     * @default null
     *
     */
    @Property()
    public toolbar: (string | ImageEditorCommand | ItemModel)[];

    /**
     * Specifies a custom template for the toolbar of an image editor control.
     * A string that specifies a custom template for the toolbar of the image editor. If this property is defined, the 'toolbar' property will not have any effect.
     *
     * {% codeBlock src='image-editor/toolbarTemplate/index.md' %}{% endcodeBlock %}
     *
     * @remarks
     * Use this property if you want to customize the entire toolbar in your own way. The template should be a string that contains the HTML markup for the custom toolbar.
     *
     * @default null
     * @aspType string
     *
     *
     */
    @Property()
    public toolbarTemplate: string | Function;

    /**
     * Specifies the width of an Image Editor.
     *
     * @remarks
     * The value of width is specified either as a percentage (e.g. '100%') or as a fixed pixel value (e.g. '100px').
     *
     * @default '100%'
     */
    @Property('100%')
    public width: string;

    /**
     * Specifies a boolean value whether enable undo/redo operations in the image editor.
     *
     * @remarks
     * If this property is true, the undo redo options will be enabled in toolbar and can also be accessed via keyboard shortcuts.
     * If set to false, both options will be disabled.
     * The undo redo history is limited to 16. Once the maximum limit is reached, the oldest history item will be removed to make space for the new item.
     *
     * @default true
     *
     */
    @Property(true)
    public allowUndoRedo: boolean;

    /**
     * Specifies whether to show/hide the quick access toolbar.
     *
     * @default true
     *
     * @remarks
     * Set this property to true to show the quick access toolbar, and false to hide it.
     * ```html
     * <div id='imageeditor'></div>
     * ```
     * ```typescript
     * <script>
     * var imageObj = new ImageEditor({
     *     showQuickAccessToolbar : true
     * });
     * imageObj.appendTo("#imageeditor");
     * </script>
     * ```
     */
    @Property(true)
    public showQuickAccessToolbar: boolean;

    /**
     * Specifies a template for the quick access toolbar.
     * Use this property to customize the quick access toolbar.
     *
     * @default null
     * @aspType string
     *
     * @remarks
     * This property only works if the "showQuickToolbar" property is set to true.
     * ```html
     * <div id='imageeditor'></div>
     * ```
     * ```typescript
     * <script>
     * var imageObj = new ImageEditor({
     *     showQuickAccessToolbar : true,
     *     quickAccessToolbarTemplate: '#toolbarTemplate'
     * });
     * imageObj.appendTo("#imageeditor");
     * </script>
     * <script id="toolbarTemplate" type="text/x-template">
     *    <div class = 'e-toolbar'>
     *      <button id= 'dltbtn'></button>
     *    </div>
     *  </script>
     * ```
     */
    @Property()
    public quickAccessToolbarTemplate: string | Function;

    /**
     * Specifies whether to prevent user interaction with the image editor control.
     * A boolean that specifies whether to prevent the interaction in image editor control. The default value is false.
     *
     * @remarks
     * If the property is true, the image editor control becomes read-only, and the user interaction will be prevented.
     *
     * @default false
     * @private
     */
    @Property(false)
    public isReadOnly: boolean;

    /**
     * Specifies whether to enable RTL mode in image editor control that displays the content in the right-to-left direction.
     * A boolean that specifies whether to enable RTL mode in image editor control. The default value is false.
     *
     * @default false
     * @private
     */
    @Property(false)
    public enableRtl: boolean;

    /**
     * Specifies a bool value whether enable or disable persist component's state between page reloads. The default value is false.
     *
     * @remarks
     * If this property is true, the controls's state persistence will be enabled.
     * Control's property will be stored in browser local storage to persist control's state when page reloads.
     *
     * @default false
     * @private
     */
    @Property(false)
    public enablePersistence: boolean;

    /**
     * Specifies the finetune settings option which can be used to perform color adjustments in the image editor control.
     *
     * {% codeBlock src='image-editor/finetuneSettings/index.md' %}{% endcodeBlock %}
     * 
     * @remarks
     * A 'FinetuneSettingsModel' value that specifies the the finetune options which are enabled in image editor control.
     * If the property is not specified, then the default values will be applied for minimum, maximum, and value properties for all finetune options.
     *
     * The possible values are:
     * - Brightness: The intensity of the primary colors grows with increased brightness, but the color itself does not change. It can be done by changing brightness and opacity property.
     * - Contrast: The contrast of an image refers to the difference between the light pixels and dark pixels. Low contrast images contain either a narrow range of colors while high contrast images have bright highlights and dark shadows. It can be done by changing contrast property.
     * - Hue: Hue distinguishes one color from another and is described using common color names such as green, blue, red, yellow, etc. Value refers to the lightness or darkness of a color. It can be controlled by hue-rotate property.
     * - Saturation: If saturation increases, colors appear sharper or purer. As saturation decreases, colors appear more washed-out or faded. It can be controlled by saturation and brightness property.
     * - Exposure: If exposure increases, intensity of light appears brighter. As exposure decreases, intensity of light decreases. Exposure can be controlled by brightness property.
     * - Opacity: The state or quality of being opaque or transparent, not allowing light to pass through the image. Opacity can be controlled by opacity property.
     * - Blur : Adjusting the blur can make an image unfocused or unclear. Blur can be controlled by blur property.
     *
     */
    @Complex<FinetuneSettingsModel>({}, FinetuneSettings)
    public finetuneSettings: FinetuneSettingsModel;

    /**
     * Specifies the zoom settings to perform zooming action.
     * A 'ZoomSettingsModel' value that specifies the the zoom related options which are enabled in image editor control. The default value is null.
     *
     * {% codeBlock src='image-editor/zoomSettings/index.md' %}{% endcodeBlock %}
     * 
     * @remarks
     * If the property is not specified, then the default settings will be applied for all the properties available in zoom settings.
     *
     * The following options are available in `zoomSettings`.
     * - minZoomFactor: Specifies the minimum zoom factor level to control the zoom.
     * - maxZoomFactor: Specifies the maximum zoom factor level to control the zoom.
     * - zoomFactor: Specifies the zoom factor to be applied to the image.
     * - zoomTrigger: Specifies the types of zooming to be supported in the image editor.
     * - zoomPoint: Specifies the x and y coordinates in which the zooming performed on initial load.
     *
     */
    @Complex<ZoomSettingsModel>({}, ZoomSettings)
    public zoomSettings: ZoomSettingsModel;

    /**
     * Specifies the selection settings to customize selection.
     * A 'SelectionSettingsModel' value that specifies the the customization related options which are enabled in image editor control. The default value is null.
     * 
     * @remarks
     * If the property is not specified, then the default settings will be applied for all the properties available in selection settings.
     *
     * The following options are available in `selectionSettings`.
     * - showCircle: Specifies whether to show / hide circles on selection.
     * - strokeColor: Specifies the stroke color of circle selection.
     * - fillColor: Specifies the fill color of circle selection.
     *
     */
    @Complex<SelectionSettingsModel>({}, SelectionSettings)
    public selectionSettings: SelectionSettingsModel;

    /**
     * Event callback that is raised before an image is saved.
     *
     * @event beforeSave
     */
    @Event()
    public beforeSave: EmitType<BeforeSaveEventArgs>;

    /**
     * Event callback that is raised after rendering the Image Editor component.
     *
     * @event created
     */
    @Event()
    public created: EmitType<Event>

    /**
     * Event callback that is raised once the component is destroyed with its elements and bound events.
     *
     * @event destroyed
     */
    @Event()
    public destroyed: EmitType<Event>

    /**
     * Event callback that is raised while zooming an image.
     *
     * @event zooming
     */
    @Event()
    public zooming: EmitType<ZoomEventArgs>

    /**
     * Event callback that is raised while panning an image.
     *
     * @event panning
     */
    @Event()
    public panning: EmitType<PanEventArgs>

    /**
     * Event callback that is raised while cropping an image.
     *
     * @event cropping
     */
    @Event()
    public cropping: EmitType<CropEventArgs>

    /**
     * Event callback that is raised while rotating an image.
     *
     * @event rotating
     */
    @Event()
    public rotating: EmitType<RotateEventArgs>

    /**
     * Event callback that is raised while flipping an image.
     *
     * @event flipping
     */
    @Event()
    public flipping: EmitType<FlipEventArgs>

    /**
     * Event callback that is raised while changing shapes in an Image Editor.
     *
     * @event shapeChanging
     */
    @Event()
    public shapeChanging: EmitType<ShapeChangeEventArgs>

    /**
     * Event callback that is raised while changing selection in an Image Editor.
     *
     * @event selectionChanging
     */
    @Event()
    public selectionChanging: EmitType<SelectionChangeEventArgs>

    /**
     * Event callback that is raised once an image is opened in an Image Editor.
     *
     * @event fileOpened
     */
    @Event()
    public fileOpened: EmitType<OpenEventArgs>

    /**
     * Event callback that is raised once an image is saved.
     *
     * @event saved
     */
    @Event()
    public saved: EmitType<SaveEventArgs>;

    /**
     * Event callback that is raised once the toolbar is created.
     *
     * @event toolbarCreated
     */
    @Event()
    public toolbarCreated: EmitType<ToolbarEventArgs>

    /**
     * Event callback that is raised while updating/refreshing the toolbar
     * 
     * {% codeBlock src='image-editor/toolbarUpdating/index.md' %}{% endcodeBlock %}
     *
     * @event toolbarUpdating
     *
     */
    @Event()
    public toolbarUpdating: EmitType<ToolbarEventArgs>

    /**
     * Event callback that is raised once the toolbar item is clicked.
     *
     * @event toolbarItemClicked
     */
    @Event()
    public toolbarItemClicked: EmitType<ClickEventArgs>

    /**
     * Event callback that is raised when applying filter to an image.
     *
     * @event imageFiltering
     */
    @Event()
    public imageFiltering : EmitType<ImageFilterEventArgs>;

    /**
     * Event callback that is raised when applying fine tune to an image.
     *
     * @event finetuneValueChanging
     */
    @Event()
    public finetuneValueChanging: EmitType<FinetuneEventArgs>

    /**
     * Event callback that is raised while clicking on an image in the Image Editor.
     *
     * @event click
     */
    @Event()
    public click: EmitType<ImageEditorClickEventArgs>

    /**
     * Event callback that is raised when opening the quick access toolbar.
     *
     * @event quickAccessToolbarOpen
     *
     * @remarks
     * Use this event to customize the toolbar items that appear in the quick access toolbar.
     * To customize the toolbar items, modify the "toolbarItems" collection property of the event arguments.
     * The "toolbarItems" collection contains string and ItemModel values.
     * The string values representing the names of the built-in toolbar items to display.
     * The ItemModel values representing the ItemModel of custom toolbar items to display.
     *
     * ```html
     * <div id='imageeditor'></div>
     * ```
     * ```typescript
     * <script>
     * var imageObj = new ImageEditor({
     *     showQuickAccessToolbar : true,
     *     quickAccessToolbarOpen: (args: QuickAccessToolbarEventArgs)=> {
     *         args.toolbarItems = [“Delete”, {text: “custom”}];
     *     }
     *
     * });
     * imageObj.appendTo("#imageeditor");
     * </script>
     */
    @Event()
    public quickAccessToolbarOpen: EmitType<QuickAccessToolbarEventArgs>

    /**
     * Event callback that is raised once the quick access toolbar item is clicked.
     *
     * @event quickAccessToolbarItemClick
     *
     */
    @Event()
    public quickAccessToolbarItemClick : EmitType<ClickEventArgs>

    /**
     *
     * Constructor for creating the widget
     *
     * @param  {ImageEditorModel} options - Specifies the image editor model
     * @param  {string|HTMLDivElement} element - Specifies the target element
     */

    constructor(options?: ImageEditorModel, element?: string | HTMLDivElement) {
        super(options);
        if (!isBlazor()) {
            ImageEditor.Inject(Crop, Draw, Selection, Transform, Export, ToolbarModule);
            ImageEditor.Inject(UndoRedo); ImageEditor.Inject(Filter);
            ImageEditor.Inject(Shape); ImageEditor.Inject(FreehandDrawing);
            if (element) {this.appendTo(element); }
        } else {
            new Crop(this); new Draw(this); new Filter(this); new FreehandDrawing(this);
            new Selection(this); new Shape(this); new Transform(this); new UndoRedo(this); new Export(this);
        }
    }

    /**
     * To provide the array of modules needed for component rendering.
     *
     * @returns {ModuleDeclaration[]} - To provide the array of modules needed for component rendering.
     * @hidden
     */
    public requiredModules(): ModuleDeclaration[] {
        const modules: ModuleDeclaration[] = [];
        modules.push({member: 'crop', args: [this]}); modules.push({member: 'draw', args: [this]});
        modules.push({member: 'selection', args: [this]}); modules.push({member: 'transform', args: [this]});
        modules.push({member: 'export', args: [this]}); modules.push({member: 'toolbar-module', args: [this]});
        modules.push({member: 'undo-redo', args: [this]}); modules.push({member: 'filter', args: [this]});
        modules.push({member: 'shape', args: [this]}); modules.push({member: 'freehand-draw', args: [this]});
        return modules;
    }

    protected preRender(): void {
        // pre render code snippets
        this.element.id = this.element.id || getUniqueID('ej2-image-editor');
        if (Browser.isDevice) {this.element.classList.add('e-device'); }
        this.initializeThemeColl();
    }

    /**
     *
     * To Initialize the component rendering
     *
     * @private
     * @returns {void}
     */
    protected render(): void {
        this.initialize();
    }

    /**
     * To get component name.
     *
     * @returns {string} - Module Name
     * @private
     */
    public getModuleName(): string {
        return 'image-editor';
    }

    /**
     *
     * To get the properties to be maintained in the persisted state.
     *
     * @returns {string} - Persist data
     * @private
     */
    public getPersistData(): string {
        return this.addOnPersist([]);
    }

    /**
     *
     * Called internally if any of the property value changed.
     *
     * @param {ImageEditorModel} newProperties - Specifies new properties
     * @param {ImageEditorModel} oldProperties - Specifies old properties
     * @returns {void}
     * @private
     */
    public onPropertyChanged(newProperties: ImageEditorModel, oldProperties?: ImageEditorModel): void {
        for (const prop of Object.keys(newProperties)) {
            switch (prop) {
            case 'cssClass':
                if (oldProperties.cssClass) {
                    removeClass([this.element], oldProperties.cssClass.replace(/\s+/g, ' ').trim().split(' ') );
                }
                if (newProperties.cssClass) {
                    addClass([this.element], newProperties.cssClass.replace(/\s+/g, ' ').trim().split(' ') );
                }
                break;
            case 'disabled':
                if (newProperties.disabled) {
                    this.element.classList.add('e-disabled');
                    this.unwireEvent();
                } else {
                    this.element.classList.remove('e-disabled');
                    this.wireEvent();
                }
                break;
            case 'height':
                this.element.style.height = newProperties.height;
                break;
            case 'width':
                this.element.style.width = newProperties.width;
                break;
            case 'theme':
                if (newProperties.theme) {
                    if (this.theme && this.theme !== '') {
                        this.theme = this.toPascalCase(this.theme);
                    } else {
                        this.theme = 'Bootstrap5';
                    }
                    this.upperContext.strokeStyle = this.themeColl[this.theme]['primaryColor'];
                    this.upperContext.fillStyle = this.themeColl[this.theme]['secondaryColor'];
                }
                break;
            case 'finetuneSettings':
                if (newProperties.finetuneSettings) {
                    this.finetuneSettings = newProperties.finetuneSettings;
                    this.notify('filter', { prop: 'update-finetunes'});
                }
                break;
            case 'locale':
                if (newProperties.locale) {
                    this.notify('toolbar', { prop: 'setLocale', onPropertyChange: false, value: {locale: newProperties.locale}});
                    this.notify('toolbar', { prop: 'refresh-toolbar', onPropertyChange: false, value: {type: 'main',
                        isApplyBtn: null, isCropping: null, isZooming: null, cType: null}});
                }
                break;
            case 'allowUndoRedo':
                if (newProperties.allowUndoRedo) {
                    this.allowUndoRedo = true;
                } else {
                    this.allowUndoRedo = false;
                }
                this.notify('toolbar', { prop: 'refresh-toolbar', onPropertyChange: false, value: {type: 'main',
                    isApplyBtn: null, isCropping: null, isZooming: null, cType: null}});
                break;
            case 'showQuickAccessToolbar':
                if (newProperties.showQuickAccessToolbar) {
                    this.showQuickAccessToolbar = true;
                    this.notify('toolbar', { prop: 'create-qa-toolbar', onPropertyChange: false});
                    this.notify('toolbar', { prop: 'renderQAT', onPropertyChange: false, value: {isPenEdit: null} });
                } else {
                    this.showQuickAccessToolbar = false;
                    this.notify('toolbar', { prop: 'destroy-qa-toolbar', onPropertyChange: false});
                }
                break;
            case 'zoomSettings':
                if (newProperties.zoomSettings) {
                    this.zoomSettings.zoomTrigger = newProperties.zoomSettings.zoomTrigger;
                }
                if (isNullOrUndefined(this.zoomSettings.zoomTrigger)) {
                    this.zoomSettings.zoomTrigger = (ZoomTrigger.MouseWheel | ZoomTrigger.Pinch | ZoomTrigger.Toolbar |
                        ZoomTrigger.Commands);
                    this.notify('toolbar', { prop: 'refresh-toolbar', onPropertyChange: false, value: {type: 'main',
                        isApplyBtn: null, isCropping: null, isZooming: null, cType: null}});
                } else if ((newProperties.zoomSettings.zoomTrigger & ZoomTrigger.Toolbar) === ZoomTrigger.Toolbar) {
                    this.notify('toolbar', { prop: 'refresh-toolbar', onPropertyChange: false, value: {type: 'main',
                        isApplyBtn: null, isCropping: null, isZooming: null, cType: null}});
                }
                break;
            case 'selectionSettings':
                if (newProperties.selectionSettings) {
                    this.selectionSettings = newProperties.selectionSettings;
                    if (this.activeObj.shape) {
                        this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
                        this.notify('draw', { prop: 'drawObject', onPropertyChange: false, value: {canvas: 'duplicate', obj: this.activeObj }});
                    }
                }
                break;
            }
        }
    }

    public destroy(): void {
        let classList: string[] = []; this.element.removeAttribute('tabindex');
        if (this.cssClass) {classList = classList.concat(this.cssClass.replace(/\s+/g, ' ').trim().split(' ') ); }
        removeClass([this.element], classList);
        if (!this.element.getAttribute('class')) {this.element.removeAttribute('class'); }
        if (!isBlazor()) {
            this.notify('toolbar', { prop: 'destroySubComponents', onPropertyChange: false });
            this.notify('destroyed', null);
            super.destroy();
        } else {
            this.element.classList.remove('e-image-editor');
        }
        this.unwireEvent();
        this.element.innerHTML = '';
    }

    public initialize(): void {
        if (this.toolbarTemplate) {
            this.element.appendChild(this.createElement('div', {
                id: this.element.id + '_toolbarArea', className: 'e-toolbar-area'
            }));
            this.toolbarTemplateFn();
        } else {
            this.notify('toolbar', { prop: 'create-toolbar', onPropertyChange: false });
            this.notify('toolbar', { prop: 'create-contextual-toolbar', onPropertyChange: false });
        }
        this.createCanvas();
        if (this.showQuickAccessToolbar) {
            const canvasWrapper: HTMLElement = document.querySelector('#' + this.element.id + '_canvasWrapper');
            canvasWrapper.appendChild(this.createElement('div', {
                id: this.element.id + '_quickAccessToolbarArea', className: 'e-quick-access-toolbar-area'
            }));
            const quickAccessToolbar: HTMLElement = document.getElementById(this.element.id + '_quickAccessToolbarArea');
            quickAccessToolbar.style.position = 'absolute';
            quickAccessToolbar.style.display = 'none';
            if (this.activeObj) {
                quickAccessToolbar.style.left = this.activeObj.activePoint.startX + 'px';
                quickAccessToolbar.style.top = this.activeObj.activePoint.startY + 'px';
            }
            quickAccessToolbar.style.width = '100%';
        }
        if (this.quickAccessToolbarTemplate) {
            this.quickAccessToolbarTemplateFn();
        } else {
            this.notify('toolbar', { prop: 'create-qa-toolbar', onPropertyChange: false });
        }
        this.wireEvent();
        this.lowerContext = this.lowerCanvas.getContext('2d'); this.upperContext = this.upperCanvas.getContext('2d');
        this.inMemoryContext = this.inMemoryCanvas.getContext('2d');
        this.lowerContext.filter = this.getDefaultFilter();
        this.notify('filter', { prop: 'setAdjustmentValue', onPropertyChange: false, value: {adjustmentValue: this.lowerContext.filter }});
        this.canvasFilter = this.lowerContext.filter;
        this.notify('toolbar', { prop: 'setInitialAdjustmentValue', onPropertyChange: false, value: {value: this.lowerContext.filter }});
        if (this.cssClass) {addClass([this.element], this.cssClass.replace(/\s+/g, ' ').trim().split(' ') ); }
        if (this.element) {
            createSpinner({
                target: this.element
            });
        }
        this.initializeZoomSettings();
    }


    /**
     *
     * This Method will add events to component (element, event, method, current reference)
     *
     * @returns {void}.
     */
    private wireEvent(): void {
        EventHandler.add(document, 'keydown', this.keyDownEventHandler, this);
        EventHandler.add(document, 'keypress', this.keyUpEventHandler, this);
        EventHandler.add(this.upperCanvas, 'mousedown', this.mouseDownEventHandler, this);
        EventHandler.add(this.upperCanvas, 'mousemove', this.mouseMoveEventHandler, this);
        EventHandler.add(this.upperCanvas, 'mouseup', this.mouseUpEventHandler, this);
        EventHandler.add(document, 'mouseup', this.mouseUpEventHandler, this);
        EventHandler.add(this.lowerCanvas, 'mousedown', this.canvasMouseDownHandler, this);
        EventHandler.add(this.lowerCanvas, 'mousemove', this.canvasMouseMoveHandler, this);
        EventHandler.add(this.lowerCanvas, 'mouseup', this.canvasMouseUpHandler, this);
        EventHandler.add(document, 'mouseup', this.canvasMouseUpHandler, this);
        EventHandler.add(this.upperCanvas, 'touchstart', this.touchStartHandler, this);
        EventHandler.add(this.lowerCanvas, 'touchstart', this.touchStartHandler, this);
        EventHandler.add(this.lowerCanvas, 'mousewheel DOMMouseScroll', this.handleScroll, this);
        EventHandler.add(this.upperCanvas, 'mousewheel DOMMouseScroll', this.handleScroll, this);
        window.addEventListener('resize', this.windowResizeHandler.bind(this));
        if ((!Browser.isIos && Browser.info.name !== 'safari')) {
            screen.orientation.addEventListener('change', this.screenOrientation.bind(this));
        }
        this.notify('shape', { prop: 'wireEvent', onPropertyChange: false });
    }

    /**
     *
     * This Method will remove events from component
     *
     * @returns {void}.
     */
    private unwireEvent(): void {
        EventHandler.remove(document, 'keydown', this.keyDownEventHandler);
        EventHandler.remove(document, 'keypress', this.keyUpEventHandler);
        EventHandler.remove(this.upperCanvas, 'mousedown', this.mouseDownEventHandler);
        EventHandler.remove(this.upperCanvas, 'mousemove', this.mouseMoveEventHandler);
        EventHandler.remove(this.upperCanvas, 'mouseup', this.mouseUpEventHandler);
        EventHandler.remove(document, 'mouseup', this.mouseUpEventHandler);
        EventHandler.remove(this.lowerCanvas, 'mousedown', this.canvasMouseDownHandler);
        EventHandler.remove(this.lowerCanvas, 'mousemove', this.canvasMouseMoveHandler);
        EventHandler.remove(this.lowerCanvas, 'mouseup', this.canvasMouseUpHandler);
        EventHandler.remove(document, 'mouseup', this.canvasMouseUpHandler);
        EventHandler.remove(this.upperCanvas, 'touchstart', this.touchStartHandler);
        EventHandler.remove(this.lowerCanvas, 'touchstart', this.touchStartHandler);
        EventHandler.remove(this.lowerCanvas, 'mousewheel DOMMouseScroll', this.handleScroll);
        EventHandler.remove(this.upperCanvas, 'mousewheel DOMMouseScroll', this.handleScroll);
        window.removeEventListener('resize', this.windowResizeHandler.bind(this));
        if ((!Browser.isIos && Browser.info.name !== 'safari')) {
            screen.orientation.removeEventListener('change', this.screenOrientation.bind(this));
        }
        this.notify('shape', { prop: 'unWireEvent', onPropertyChange: false });
        this.notify('selection', { prop: 'unWireEvent', onPropertyChange: false });
    }

    private createCanvas(): void {
        this.element.style.boxSizing = 'border-box';
        const obj: Object = {toolbarHeight: 0 };
        this.notify('toolbar', { prop: 'getToolbarHeight', value: {obj: obj }});
        const height: number = obj['toolbarHeight'];
        this.element.style.width = this.width; this.element.style.height = this.height;
        const canvasWrapper: HTMLElement = this.element.appendChild(this.createElement('div', { id: this.element.id + '_canvasWrapper',
            className: 'e-canvas-wrapper', attrs: { style: 'height:' + (this.element.offsetHeight - height - 2) + 'px; width:' +
        (this.element.offsetWidth - 2)
            + 'px; position: relative; overflow: hidden; margin: 0 auto;'}
        }));
        this.lowerCanvas = canvasWrapper.appendChild(this.createElement('canvas', {
            id: this.element.id + '_lowerCanvas', attrs: { name: 'canvasImage' }
        }));
        this.upperCanvas = canvasWrapper.appendChild(this.createElement('canvas', {
            id: this.element.id + '_upperCanvas', attrs: { name: 'canvasImage' }
        }));
        this.inMemoryCanvas = this.createElement('canvas', {
            id: this.element.id + '_inMemoryCanvas', attrs: { name: 'canvasImage' }
        });
        this.textArea = canvasWrapper.appendChild(this.createElement('textarea', {
            id: this.element.id + '_textArea', className: 'e-textarea', attrs: { name: 'textArea' }
        }));
        const dialog: HTMLElement = this.element.appendChild(this.createElement('div', {
            id: this.element.id + '_dialog', className: 'e-dialog'
        }));
        dialog.style.display = 'none';
        this.textArea.setAttribute('spellcheck', 'false');
        this.textArea.style.lineHeight = 'normal';
        this.lowerCanvas.style.width = this.upperCanvas.style.width = this.inMemoryCanvas.style.width = '100%';
        this.lowerCanvas.style.height = this.upperCanvas.style.height = this.inMemoryCanvas.style.height = '100%';
        this.upperCanvas.style.position = this.lowerCanvas.style.position = this.textArea.style.position = 'absolute';
        this.textArea.style.backgroundColor = 'transparent'; this.textArea.style.display = 'none';
        this.textArea.style.resize = 'none';
        this.lowerContext = this.lowerCanvas.getContext('2d');
        this.baseImg = this.createElement('img', {
            id: this.element.id + '_orgImg', attrs: { name: 'Image', crossorigin: 'anonymous' }
        });
        this.upperCanvas.style.cursor = this.cursor = 'default';
        this.upperCanvas.style.display = 'block';
        this.upperContext = this.upperCanvas.getContext('2d');
    }

    private touchStartHandler(e: MouseEvent & TouchEvent): void {
        this.notify('selection', {prop: 'touchStartHandler', onPropertyChange: false, value: {e: e}});
    }

    private mouseDownEventHandler(e: MouseEvent & TouchEvent): void {
        this.notify('selection', {prop: 'mouseDownEventHandler', onPropertyChange: false, value: {e: e}});
    }

    private mouseMoveEventHandler(e: MouseEvent & TouchEvent): void {
        this.notify('selection', {prop: 'mouseMoveEventHandler', onPropertyChange: false, value: {e: e}});
    }

    private mouseUpEventHandler(e: MouseEvent & TouchEvent): void {
        this.notify('selection', {prop: 'mouseUpEventHandler', onPropertyChange: false, value: {e: e}});
    }

    private keyDownEventHandler(e: KeyboardEvent): void {
        this.notify('selection', {prop: 'keyDownEventHandler', onPropertyChange: false, value: {e: e}});
    }

    private keyUpEventHandler(e: KeyboardEvent): void {
        // eslint-disable-next-line
        if (this.textArea.style.display === 'block' && (e.target as any).id === this.element.id + '_textArea') {
            this.notify('selection', {prop: 'textKeyDown', value: {e: e}});
        }
    }

    private canvasMouseDownHandler(e: MouseEvent & TouchEvent): void {
        this.notify('selection', {prop: 'canvasMouseDownHandler', onPropertyChange: false, value: {e: e}});
    }

    private canvasMouseMoveHandler(e: MouseEvent & TouchEvent): void {
        this.notify('selection', {prop: 'canvasMouseMoveHandler', onPropertyChange: false, value: {e: e}});
    }

    private canvasMouseUpHandler(e: MouseEvent & TouchEvent): void {
        this.notify('selection', {prop: 'canvasMouseUpHandler', onPropertyChange: false, value: {e: e}});
    }

    private handleScroll(e: KeyboardEvent): void {
        this.notify('selection', {prop: 'handleScroll', onPropertyChange: false, value: {e: e}});
    }

    private adjustToScreen(): void {
        this.update();
    }

    private screenOrientation(): void {
        if (Browser.isDevice) {
            setTimeout(this.adjustToScreen.bind(this), 100);
        }
    }

    private windowResizeHandler(): void {
        if (!Browser.isDevice && this.element.classList.contains('e-image-editor')) {
            this.adjustToScreen();
        }
    }

    private notifyResetForAllModules(): void {
        const modules: ModuleDeclaration[] = this.requiredModules();
        for (let i: number = 0; i < modules.length; i++) {
            this.notify(modules[i as number].member, { prop: 'reset', onPropertyChange: false});
        }
    }

    private allowShape(x: number, y: number): boolean {
        this.isPublicMethod = true;
        const obj: Object = {inRange: false};
        this.notify('shape', {prop: 'isPointsInRange', onPropertyChange: false,
            value: {x: x, y: y, obj: obj }});
        return obj['inRange'];
    }

    /**
     * Clears the current selection performed in the image editor.
     *
     * @returns {void}.
     */
    public clearSelection(): void {
        this.notify('selection', { prop: 'clearSelection', onPropertyChange: false});
    }

    /**
     * Crops an image based on the selection done in the image editor.
     *
     * {% codeBlock src='image-editor/crop/index.md' %}{% endcodeBlock %}
     *
     * @remarks
     * The selection can be done through programmatically using the 'select' method or through UI interactions.
     *
     * @returns {boolean}.
     *
     */
    public crop(): boolean {
        const obj: Object = {isCrop: false };
        this.notify('crop', {prop: 'crop', onPropertyChange: false, value: {obj: obj}});
        return obj['isCrop'];
    }

    /**
     * Flips an image by horizontally or vertically in the image editor.
     *
     * {% codeBlock src='image-editor/zoom/index.md' %}{% endcodeBlock %}
     *
     * @param { Direction } direction - Specifies the direction to flip the image.
     * A horizontal direction for horizontal flipping and vertical direction for vertical flipping.
     *
     * @remarks
     * It flips the shapes including rectangle, circle, line, text, and freehand drawings.
     *
     * @returns {void}.
     *
     */
    public flip(direction: Direction): void {
        this.notify('transform', {prop: 'flip', value: {direction: direction }});
        this.notify('undo-redo', {prop: 'updateCurrUrc', value: {type: 'ok' }});
    }

    /**
     * Returns an image as ImageData to load it in to a canvas.
     *
     * @remarks
     * The data returned from this method is directly drawn in a canvas using 'putImageData' method.
     * And then the user can get the base64 string from the canvas using toDataURL method.
     *
     * @returns {ImageData}.
     */
    public getImageData(): ImageData {
        const obj: Object = {canvas: null };
        this.notify('export', {prop: 'exportToCanvas', value: {object: obj }});
        return obj['canvas'].getContext('2d').getImageData(0, 0, obj['canvas'].width, obj['canvas'].height);
    }

    /**
     *  Opens an image as URL or ImageData for editing in an image editor.
     *
     * @param {string | ImageData } data - Specifies url of the image or image data.
     *
     * @remarks
     * The supported file types are JPG, JPEG, PNG, and SVG.
     *
     * @returns {void}.
     */
    public open(data: string | ImageData): void {
        this.notify('draw', {prop: 'open', value: {data: data}});
    }

    /**
     * Reset all the changes done in an image editor and revert to original image.
     *
     * @remarks
     * The undo redo collection also cleared while resetting the image editor.
     *
     * @returns {void}.
     */
    public reset(): void {
        const obj: Object = {isErrorImage: false };
        this.notify('draw', {prop: 'getErrorImage', value: {obj: obj}});
        if (!this.disabled && !obj['isErrorImage']) {
            this.clearContext(this.inMemoryContext); this.clearContext(this.lowerContext); this.clearContext(this.upperContext);
            this.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
            if (!isBlazor()) {
                this.notify('toolbar', { prop: 'refresh-toolbar', onPropertyChange: false, value: {type: 'main',
                    isApplyBtn: false, isCropping: false, isZooming: null, cType: null}});
                if (Browser.isDevice && document.getElementById(this.element.id + '_bottomToolbar')) {
                    (getComponent(document.getElementById(this.element.id + '_bottomToolbar'), 'toolbar') as Toolbar).destroy();
                    this.notify('toolbar', { prop: 'create-bottom-toolbar', onPropertyChange: false});
                }
            }
            this.currObjType.isUndoAction = this.isUndoRedo = this.togglePan = this.togglePen = this.isImageLoaded = false;
            this.isCircleCrop = this.isCropTab =  false; this.objColl = [];  this.transform.degree = 0;
            this.upperCanvas.style.display = 'block'; this.transform.currFlipState = '';
            this.upperCanvas.style.cursor = this.cursor = this.lowerCanvas.style.cursor = 'default';
            this.lowerContext.lineWidth = this.upperContext.lineWidth = undefined;
            this.textArea.value = this.textArea.textContent = ''; this.textArea.style.display = 'none';
            this.lowerContext.filter = this.canvasFilter = this.getDefaultFilter();
            this.img.destLeft = this.img.destTop = this.img.srcLeft = this.img.srcTop = 0;
            this.img.destWidth = this.img.destHeight = this.img.srcWidth = this.img.srcHeight = null;
            this.currSelectionPoint = null; this.panPoint.currentPannedPoint = {x: 0, y: 0};
            this.rotateFlipColl = []; this.points = []; this.pointColl = {}; this.freehandCounter = 0;
            this.notify('draw', { prop: 'resetPanPoints' });
            this.lowerCanvas.style.left = this.upperCanvas.style.left = ''; this.fontSizeColl = [];
            this.lowerCanvas.style.top = this.upperCanvas.style.top = '';
            this.lowerCanvas.style.maxWidth = this.upperCanvas.style.maxWidth = '';
            this.lowerCanvas.style.maxHeight = this.upperCanvas.style.maxHeight = '';
            this.transform.defaultZoomFactor = this.transform.zoomFactor = 0; this.transform.cropZoomFactor = null;
            this.currObjType = { shape: '', isDragging: false, isActiveObj: false, isText: false, isInitialText: false, isLine: false,
                isInitialLine: false, isCustomCrop: false, isZoomed: false, isUndoZoom: false,
                isUndoAction: false, isFiltered: false, isSave: false, isResize: false  };
            this.cropObj = {cropZoom: 0, defaultZoom: 0, totalPannedPoint: {x: 0, y: 0}, totalPannedClientPoint: {x: 0, y: 0},
                totalPannedInternalPoint: {x: 0, y: 0}, tempFlipPanPoint: {x: 0, y: 0}, activeObj: {} as SelectionPoint,
                rotateFlipColl: [], degree: 0, currFlipState: '', zoomFactor: 0, previousZoomValue : 0,
                destPoints: {startX: 0, startY: 0, width: 0, height: 0} as ActivePoint,
                srcPoints: {startX: 0, startY: 0, width: 0, height: 0} as ActivePoint, filter: '' };
            this.afterCropActions = []; this.currentFilter = '';
            const obj: Object = {initialZoomValue: false };
            this.notify('draw', { prop: 'getInitialZoomValue', onPropertyChange: false, value: {obj: obj }});
            if (obj['initialZoomValue']) {
                this.setProperties({zoomSettings: { zoomFactor: obj['initialZoomValue']}}, true);
            }
            if (document.getElementById(this.element.id + '_quickAccessToolbarArea')) {
                document.getElementById(this.element.id + '_quickAccessToolbarArea').style.display = 'none';
            }
            this.notifyResetForAllModules(); this.notify('filter', { prop: 'update-finetunes'});
            this.isImageLoaded = false;
            this.notify('draw', { prop: 'update-canvas', onPropertyChange: false});
            this.isImageLoaded = true;
            if (!isBlazor()) {
                if (this.element.querySelector('.e-contextual-toolbar-wrapper')) {
                    this.element.querySelector('.e-contextual-toolbar-wrapper').classList.add('e-hide');
                }
                this.notify('toolbar', {prop: 'refresh-dropdown-btn', value: {isDisabled: false}});
                this.notify('toolbar', {prop: 'enable-disable-btns'});
            }
        }
    }

    /**
     * Rotate an image to clockwise and anti-clockwise.
     *
     * {% codeBlock src='image-editor/rotate/index.md' %}{% endcodeBlock %}
     *
     * @param {number} degree - Specifies a degree to rotate an image.
     * A positive integer value for clockwise and negative integer value for anti-clockwise rotation. 
     *
     * @remarks
     * It rotated the shapes including rectangle, circle, line, text, and freehand drawings.
     *
     * @returns {boolean}.
     *
     */
    public rotate(degree: number): boolean {
        const obj: Object = {isRotate: false };
        this.notify('transform', {prop: 'rotate', value: {degree: degree, obj: obj}});
        this.notify('undo-redo', {prop: 'updateCurrUrc', value: {type: 'ok' }});
        return obj['isRotate'];
    }

    /**
     * Export an image using the specified file name and the extension.
     *
     * @param {string} type - Specifies a format of image to be saved. 
     * @param {string} fileName – Specifies a file name to be saved
     *
     * @remarks
     * The supported file types are JPG, JPEG, PNG, and SVG.
     *
     * @returns {void}.
     */
    public export(type?: string, fileName?: string): void {
        this.notify('export', { prop: 'export', onPropertyChange: false, value: {type: type, fileName: fileName}});
    }

    /**
     * Perform selection in an image editor. The selection helps to crop an image.
     *
     * {% codeBlock src='image-editor/select/index.md' %}{% endcodeBlock %}
     *
     * @param {string} type - Specifies the shape - circle / square / custom selection / pre-defined ratios.
     * @param {number} startX – Specifies the start x-coordinate point of the selection.
     * @param {number} startY – Specifies the start y-coordinate point of the selection.
     * @param {number} width - Specifies the width of the selection area.
     * @param {number} height - Specifies the height of the selection area.
     *
     * @remarks
     * The selection UI is based on the 'theme' property.
     *
     * @returns {void}.
     *
     */
    public select(type: string, startX?: number, startY?: number, width?: number, height?: number): void {
        this.notify('draw', { prop: 'select', onPropertyChange: false,
            value: {type: type, startX: startX, startY: startY, width: width, height: height}});
    }

    /**
     * Enable or disable a freehand drawing option in an Image Editor.
     *
     * @param {boolean} value - Specifies a value whether to enable or disable freehand drawing. 
     *
     * @returns {void}.
     * @private
     */
    public freeHandDraw(value: boolean): void {
        this.notify('freehand-draw', { prop: 'freeHandDraw', onPropertyChange: false, value: {value: value}});
    }

    /**
     * Enable or disable a freehand drawing in an Image Editor.
     *
     * @param {boolean} value - Specifies a value whether to enable or disable freehand drawing. 
     *
     * @remarks
     * User can directly drawing on a canvas after enabling this option.
     *
     * @returns {void}.
     */
    public freehandDraw(value: boolean): void {
        if (!this.disabled && this.isImageLoaded) {
            this.freeHandDraw(value);
        }
    }

    /**
     * Enable or disable a panning on the Image Editor.
     *
     * @param {boolean} value - Specifies a value whether enable or disable panning.
     *
     * @remarks
     * This option will take into effect once the image's visibility is hidden when zooming an image or selection has been performed.
     *
     * @returns {void}.
     */
    public pan(value: boolean): void {
        this.notify('transform', { prop: 'pan', onPropertyChange: false, value: {value: value}});
    }

    /**
     * Zoom in or out on a point in the image editor.
     *
     * @param {number} zoomFactor - The percentage-based zoom factor to use (e.g. 20 for 2x zoom).
     * @param {Point} zoomPoint - The point in the image editor to zoom in/out on.
     *
     * @remarks
     * Zooming directly enables the panning option when the image's visibility is hidden.
     * User can disable it by using 'Pan' method.
     * @returns {void}
     *
     */
    public zoom(zoomFactor: number, zoomPoint?: Point): void {
        this.notify('transform', { prop: 'zoom', onPropertyChange: false,
            value: {zoomFactor: zoomFactor, zoomPoint: zoomPoint}});
    }

    /**
     * Draw ellipse on an image.
     *
     * {% codeBlock src='image-editor/ellipse/index.md' %}{% endcodeBlock %}
     *
     * @param {number} x - Specifies x-coordinate of ellipse.
     * @param {number} y - Specifies y-coordinate of ellipse.
     * @param {number} radiusX - Specifies the radius x point for the ellipse.
     * @param {number} radiusY - Specifies the radius y point for the ellipse.
     * @param {number} strokeWidth - Specifies the stroke width of ellipse.
     * @param {string} strokeColor - Specifies the stroke color of ellipse.
     * @param {string} fillColor - Specifies the fill color of the ellipse.
     * @returns {boolean}.
     *
     */
    public drawEllipse(x?: number, y?: number, radiusX?: number, radiusY?: number, strokeWidth?: number, strokeColor?: string,
                       fillColor?: string): boolean {
        let isEllipse: boolean = false;
        const isPointsInRange: boolean = this.allowShape(x, y);
        if (!this.disabled && this.isImageLoaded && (isPointsInRange || (isNullOrUndefined(x) && isNullOrUndefined(y)))) {
            isEllipse = true;
            this.notify('shape', { prop: 'drawEllipse', onPropertyChange: false, value: {x: x, y: y, radiusX: radiusX, radiusY: radiusY,
                strokeWidth: strokeWidth, strokeColor: strokeColor, fillColor: fillColor }});
        }
        return isEllipse;
    }

    /**
     * Draw line on an image.
     *
     * @param {number} startX – Specifies start point x-coordinate of line.
     * @param {number} startY – Specifies start point y-coordinate of line.
     * @param {number} endX - Specifies end point x-coordinates of line.
     * @param {number} endY - Specifies end point y-coordinates of the line.
     * @param {number} strokeWidth - Specifies the stroke width of line.
     * @param {string} strokeColor - Specifies the stroke color of line.
     * @returns {boolean}.
     */
    public drawLine(startX?: number, startY?: number, endX?: number, endY?: number, strokeWidth?: number, strokeColor?: string): boolean {
        let isLine: boolean = false;
        const isPointsInRange: boolean = this.allowShape(startX, startY);
        if (!this.disabled && this.isImageLoaded && (isPointsInRange || (isNullOrUndefined(startX) && isNullOrUndefined(startY)))) {
            isLine = true;
            this.notify('shape', { prop: 'drawLine', onPropertyChange: false, value: {startX: startX, startY: startY, endX: endX,
                endY: endY, strokeWidth: strokeWidth, strokeColor: strokeColor}});
        }
        return isLine;
    }

    /**
     * Draw arrow on an image.
     *
     * @param {number} startX – Specifies start point x-coordinate of arrow.
     * @param {number} startY – Specifies start point y-coordinate of arrow.
     * @param {number} endX - Specifies end point x-coordinates of arrow.
     * @param {number} endY - Specifies end point y-coordinates of the arrow.
     * @param {number} strokeWidth - Specifies the stroke width of arrow.
     * @param {string} strokeColor - Specifies the stroke color of arrow.
     * @param {ArrowheadType} arrowStart – Specifies the type of arrowhead for start position. The default value is ‘None’.
     * @param {ArrowheadType} arrowEnd – Specifies the type of arrowhead for end position. The default value is ‘SolidArrow’.
     * @returns {boolean}.
     */
    public drawArrow(startX?: number, startY?: number, endX?: number, endY?: number, strokeWidth?: number, strokeColor?: string,
                     arrowStart?: ArrowheadType, arrowEnd?: ArrowheadType): boolean {
        let isArrow: boolean = false;
        const isPointsInRange: boolean = this.allowShape(startX, startY);
        if (!this.disabled && this.isImageLoaded && (isPointsInRange || (isNullOrUndefined(startX) && isNullOrUndefined(startY)))) {
            isArrow = true;
            this.notify('shape', { prop: 'drawArrow', onPropertyChange: false, value: {startX: startX, startY: startY, endX: endX,
                endY: endY, strokeWidth: strokeWidth, strokeColor: strokeColor, arrowStart: arrowStart, arrowEnd: arrowEnd }});
        }
        return isArrow;
    }

    /**
     * Draw path on an image.
     *
     * @param {Point[]} pointColl – Specifies collection of start and end x, y-coordinates of path.
     * @param {number} strokeWidth - Specifies the stroke width of path.
     * @param {string} strokeColor - Specifies the stroke color of path.
     * @returns {boolean}.
     */
    public drawPath(pointColl: Point[], strokeWidth?: number, strokeColor?: string): boolean {
        this.isPublicMethod = true;
        const obj: Object = {inRange: false};
        let isPath: boolean = false;
        if (pointColl && pointColl.length > 0) {
            for (let i: number = 0; i < pointColl.length; i++) {
                if (obj['inRange']) {
                    break;
                }
                this.notify('shape', {prop: 'isPointsInRange', onPropertyChange: false,
                    value: {x: pointColl[i as number].x, y: pointColl[i as number].y, obj: obj }});
            }
        }
        if (!this.disabled && this.isImageLoaded && (obj['inRange'] || isNullOrUndefined(pointColl))) {
            isPath = true;
            this.notify('shape', { prop: 'drawPath', onPropertyChange: false, value: {pointColl: pointColl,
                strokeWidth: strokeWidth, strokeColor: strokeColor }});
        }
        return isPath;
    }

    /**
     * Draw a rectangle on an image.
     *
     * @param {number} x - Specifies x-coordinate of rectangle.
     * @param {number} y - Specifies y-coordinate of rectangle.
     * @param {number} width - Specifies the width of the rectangle.
     * @param {number} height - Specifies the height of the rectangle.
     * @param {number} strokeWidth - Specifies the stroke width of rectangle.
     * @param {string} strokeColor - Specifies the stroke color of rectangle.
     * @param {string} fillColor - Specifies the fill color of the rectangle.
     * @returns {boolean}.
     */
    public drawRectangle(x?: number, y?: number, width?: number, height?: number, strokeWidth?: number, strokeColor?: string,
                         fillColor?: string): boolean {
        let isRectangle: boolean = false;
        const isPointsInRange: boolean = this.allowShape(x, y);
        if (!this.disabled && this.isImageLoaded && (isPointsInRange || (isNullOrUndefined(x) && isNullOrUndefined(y)))) {
            isRectangle = true;
            this.notify('shape', { prop: 'drawRectangle', onPropertyChange: false, value: {x: x, y: y, width: width, height: height,
                strokeWidth: strokeWidth, strokeColor: strokeColor, fillColor: fillColor }});
        }
        return isRectangle;
    }

    /**
     * Draw a text on an image.
     *
     * {% codeBlock src='image-editor/text/index.md' %}{% endcodeBlock %}
     *
     * @param {number} x - Specifies x-coordinate of text.
     * @param {number} y - Specifies y-coordinate of text.
     * @param {string} text - Specifies the text to add on an image.
     * @param {string} fontFamily - Specifies the font family of the text.
     * @param {number} fontSize - Specifies the font size of the text.
     * @param {boolean} bold - Specifies whether the text is bold or not.
     * @param {boolean} italic - Specifies whether the text is italic or not.
     * @param {string} color - Specifies font color of the text.
     * @returns {boolean}.
     *
     */
    public drawText(x?: number, y?: number, text?: string, fontFamily?: string, fontSize?: number, bold?: boolean, italic?: boolean,
                    color?: string): boolean {
        let isText: boolean = false;
        const isPointsInRange: boolean = this.allowShape(x, y);
        if (!this.disabled && this.isImageLoaded && (isPointsInRange || (isNullOrUndefined(x) && isNullOrUndefined(y)))) {
            isText = true;
            this.notify('shape', { prop: 'drawText', onPropertyChange: false, value: {x: x, y: y, text: text, fontFamily: fontFamily,
                fontSize: fontSize, bold: bold, italic: italic, color: color}});
        }
        return isText;
    }

    /**
     * Select a shape based on the given shape id.
     * Use 'getShapeSettings' method to get the shape id which is then passed to perform selection.
     *
     * {% codeBlock src='image-editor/selectShape/index.md' %}{% endcodeBlock %}
     *
     * @param {string} id - Specifies the shape id to select a shape on an image.
     * @returns {boolean}.
     *
     */
    public selectShape(id: string): boolean {
        const obj: Object = {isSelected: false};
        this.notify('shape', { prop: 'selectShape', onPropertyChange: false, value: {id: id, obj: obj }});
        return obj['isSelected'];
    }

    /**
     * Deletes a shape based on the given shape id.
     * Use 'getShapeSettings' method to get the shape id which is then passed to perform selection.
     *
     * {% codeBlock src='image-editor/deleteShape/index.md' %}{% endcodeBlock %}
     *
     * @param {string} id - Specifies the shape id to delete the shape on an image.
     * @returns {void}.
     *
     */
    public deleteShape(id: string): void {
        this.notify('shape', { prop: 'deleteShape', onPropertyChange: false, value: {id: id }});
    }

    /**
     * Get particular shapes details based on id of the shape which is drawn on an image editor.
     *
     * {% codeBlock src='image-editor/getShapeSetting/index.md' %}{% endcodeBlock %}
     *
     * @param {string} id - Specifies the shape id on an image.
     * @returns {ShapeSettings}.
     *
     */
    public getShapeSetting(id: string): ShapeSettings {
        const shapeDetails: ShapeSettings = {} as ShapeSettings;
        this.notify('shape', { prop: 'getShapeSetting', onPropertyChange: false,
            value: {id: id, obj: shapeDetails }});
        return shapeDetails;
    }

    /**
     * Get all the shapes details which is drawn on an image editor.
     *
     * @returns {ShapeSettings[]}.
     */
    public getShapeSettings(): ShapeSettings[] {
        const obj: Object = { shapeDetailsColl: [] };
        this.notify('shape', { prop: 'getShapeSettings', onPropertyChange: false, value: {obj: obj }});
        return obj['shapeDetailsColl'];
    }

    /**
     * To refresh the Canvas Wrapper.
     *
     * @returns {void}.
     */
    public update(): void {
        this.notify('transform', { prop: 'update' });
    }

    /**
     * Finetuning an image with the given type of finetune and its value in the image editor.
     *
     * @param {ImageFinetuneOption } finetuneOption - Specifies the finetune options to be performed in the image.
     * @param {number } value - Specifies the value for finetuning the image.
     *
     * @remarks
     * The finetuning will not affect the shapes background and border color.
     *
     * @returns {void}.
     *
     */
    public finetuneImage(finetuneOption: ImageFinetuneOption, value: number): void {
        if (!this.disabled && this.isImageLoaded) {
            this.notify('filter', { prop: 'finetuneImage', value: { value: value, option: finetuneOption } });
        }
    }

    /**
     * Filtering an image with the given type of filters.
     *
     * @param {ImageFilterOption } filterOption - Specifies the filter options to the image.
     *
     * @remarks
     * The filtering will not affect the shape's background and border color.
     * @returns {void}.
     */
    public applyImageFilter(filterOption: ImageFilterOption): void {
        if (!this.disabled && this.isImageLoaded) {
            this.notify('filter', { prop: 'applyImageFilter', value: { option: filterOption.toString() } });
            this.canvasFilter = this.lowerContext.filter;
            this.notify('undo-redo', {prop: 'updateCurrUrc', value: {type: 'ok' }});
        }
    }

    /**
     * Reverse the last action which performed by the user in the Image Editor.
     *
     * @remarks
     * This method will take into effect once the 'allowUndoRedo' property is enabled.
     *
     * @returns {void}.
     */
    public undo(): void {
        this.notify('undo-redo', { prop: 'undo', onPropertyChange: false});
    }

    /**
     * Redo the last user action that was undone by the user or `undo` method.
     *
     * @remarks
     * This method will take into effect once the 'allowUndoRedo' property is enabled.
     * @returns {void}.
     */
    public redo(): void {
        this.notify('undo-redo', { prop: 'redo', onPropertyChange: false});
    }

    /**
     * Get the dimension of an image in the image editor such as x, y, width, and height.
     * The method helps to get dimension after cropped an image.
     *
     * @returns {Dimension}.
     * A Dimension object containing the x, y, width, and height of an image.
     */
    public getImageDimension(): Dimension {
        return { x: this.img.destLeft, y: this.img.destTop, width: this.img.destWidth, height: this.img.destHeight };
    }

    // Toolbar related codes
    private toolbarTemplateFn(): void {
        let template: Element; const templateID: string = this.element.id + '_toolbar';
        const toolbarArea: HTMLElement = this.element.querySelector('#' + this.element.id + '_toolbarArea');
        if (this.toolbarTemplate) {
            this.toolbarFn = this.templateParser(this.toolbarTemplate);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((this as any).isReact) {
                template = this.toolbarFn({type: 'toolbar'}, this, 'Template', templateID)[0];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } else if ((this as any).isAngular) {
                const templateColl: Element [] = this.toolbarFn({type: 'toolbar'}, this, 'Template', templateID);
                template = (templateColl[0].nodeType === 3) ? templateColl[1] : templateColl[0];
            } else {
                template = this.toolbarFn({type: 'toolbar'}, this, 'Template', templateID)[0];
            }
            toolbarArea.appendChild(template);
            this.toolbarHeight = toolbarArea.clientHeight;
            this.notify('toolbar', { prop: 'setToolbarHeight', value: {height: this.toolbarHeight }});
            this['renderReactTemplates']();
        }
    }

    private quickAccessToolbarTemplateFn(): void {
        let template: Element; const templateID: string = this.element.id + '_quickAccessToolbar';
        const toolbarArea: HTMLElement = this.element.querySelector('#' + this.element.id + '_quickAccessToolbarArea');
        if (this.quickAccessToolbarTemplate) {
            this.qatFn = this.templateParser(this.quickAccessToolbarTemplate);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((this as any).isReact) {
                template = this.qatFn({type: 'toolbar'}, this, 'Template', templateID)[0];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } else if ((this as any).isAngular) {
                const templateColl: Element [] = this.qatFn({type: 'toolbar'}, this, 'Template', templateID);
                template = (templateColl[0].nodeType === 3) ? templateColl[1] : templateColl[0];
            } else {
                template = this.qatFn({type: 'toolbar'}, this, 'Template', templateID)[0];
            }
            toolbarArea.appendChild(template);
            this['renderReactTemplates']();
        }
    }

    private templateParser(template: string | Function): Function {
        if (template) {
            try {
                if (typeof template !== 'function' && document.querySelectorAll(template).length) {
                    return templateCompiler(document.querySelector(template).innerHTML.trim());
                } else {
                    return compile(template);
                }
            } catch (error) {
                return templateCompiler(template);
            }
        }
        return undefined;
    }

    // Common codes for EJ2 and Blazor
    private getTextFromId(id: string): string {
        const idToValue: Object = {'1': 'none', '2': 'bar', '3': 'arrow', '4': 'arrowSolid',
            '5': 'circle', '6': 'circleSolid', '7': 'square', '8': 'squareSolid' };
        return idToValue[`${id}`];
    }

    private getFinetuneOption(type: string): ImageFinetuneOption {
        const typeToOption: Object = {'brightness': ImageFinetuneOption.Brightness, 'contrast': ImageFinetuneOption.Contrast,
            'hue': ImageFinetuneOption.Hue, 'saturation': ImageFinetuneOption.Saturation, 'opacity': ImageFinetuneOption.Opacity,
            'blur': ImageFinetuneOption.Blur, 'exposure': ImageFinetuneOption.Exposure };
        return typeToOption[`${type}`];
    }

    private setPenStroke(args: string): void {
        this.notify('freehand-draw', {prop: 'setPenStrokeWidth', onPropertyChange: false, value: {value: parseInt(args, 10) }});
    }

    private updateFreehandDrawColorChange(): void {
        const obj: Object = {tempFreeHandDrawEditingStyles: null };
        this.notify('freehand-draw', {prop: 'getTempFreeHandDrawEditingStyles', value: {obj: obj }});
        this.notify('freehand-draw', {prop: 'color-change', value: {color: obj['tempFreeHandDrawEditingStyles'].strokeColor}});
    }

    private setInitialZoomState(): void {
        this.objColl.push(this.activeObj);
        this.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
        const isUndoRedo: boolean = this.isUndoRedo;
        this.isCropTab = false; this.isUndoRedo = true;
        if (this.transform.cropZoomFactor && this.transform.cropZoomFactor > 0) {
            this.notify('transform', { prop: 'zoomAction', onPropertyChange: false,
                value: {zoomFactor: -this.transform.cropZoomFactor, zoomPoint: null}});
        }
        else {
            this.notify('transform', { prop: 'zoomAction', onPropertyChange: false,
                value: {zoomFactor: Math.abs(this.transform.cropZoomFactor), zoomPoint: null}});
        }
        this.isUndoRedo = isUndoRedo; this.panPoint.totalPannedPoint = { x: 0, y: 0 };
        this.transform.cropZoomFactor = 0;
        this.notify('freehand-draw', { prop: 'updateFHDColl', onPropertyChange: false});
        this.activeObj = extend({}, this.objColl[this.objColl.length - 1], {}, true) as SelectionPoint;
        this.objColl.pop(); this.isCropTab = true;
        this.notify('draw', { prop: 'drawObject', onPropertyChange: false, value: {canvas: 'duplicate', obj: this.activeObj }});
    }

    /**
     * Set the old item Transform item state.
     *
     * @hidden
     * @returns {void}.
     */
    public updateCropTransformItems(): void {
        this.prevCurrSelectionPoint = extend({}, this.currSelectionPoint, {}, true) as SelectionPoint;
        const object: Object = {currObj: {} as CurrentObject };
        this.notify('filter', { prop: 'getCurrentObj', onPropertyChange: false, value: {object: object }});
        const currentObj: CurrentObject = object['currObj'];
        currentObj.objColl = extend([], this.objColl, [], true) as SelectionPoint[];
        currentObj.pointColl = extend([], this.pointColl, [], true) as Point[];
        currentObj.afterCropActions = extend([], this.afterCropActions, [], true) as string[];
        const selPointCollObj: Object = {selPointColl: null };
        this.notify('freehand-draw', { prop: 'getSelPointColl', onPropertyChange: false,
            value: {obj: selPointCollObj }});
        currentObj.selPointColl = extend([], selPointCollObj['selPointColl'], [], true) as Point[];
        this.cancelCropSelection = {operation: 'cropTransform', previousObj: currentObj, currentObj: currentObj,
            previousObjColl: currentObj.objColl, currentObjColl: currentObj.objColl,
            previousPointColl: currentObj.pointColl, currentPointColl: currentObj.pointColl,
            previousSelPointColl: currentObj.selPointColl, currentSelPointColl: currentObj.selPointColl,
            previousCropObj: extend({}, this.cropObj, {}, true) as CurrentObject,
            currentCropObj: extend({}, this.cropObj, {}, true) as CurrentObject,
            previousText: null, currentText: null, filter: null, isCircleCrop: this.isCircleCrop };
    }

    /**
     * Get the pascal case.
     *
     * @param { string } str - Specifies the string to convert to pascal case.
     * @param { Object } obj - Specifies the string to convert to pascal case.
     * @hidden
     * @returns {string}.
     * A pascal case string.
     */
    public toPascalCase(str: string, obj?: Object): string {
        let strArr: string[] = [];
        if (!isNullOrUndefined(str)) {
            strArr = str.toLowerCase().split('-');
        }
        for (let i: number = 0; i < strArr.length; i++) {
            strArr[i as number] = strArr[i as number].charAt(0).toUpperCase() + strArr[i as number].slice(1);
        }
        if (obj) {
            obj['maxText'] = strArr.join('');
        }
        return strArr.join('');
    }

    /**
     * Get the font sizes.
     *
     * @hidden
     * @returns {DropDownButtonItemModel[]}.
     * A font size collections.
     */
    public getFontSizes(): DropDownButtonItemModel[] {
        const items: DropDownButtonItemModel[] = [];
        this.fontSizeColl = []; let fontSize: number;
        if (this.transform.degree === 0 || this.transform.degree % 180 === 0) {
            fontSize = this.img.destWidth / 25;
        }
        else {
            fontSize = this.img.destHeight / 25;
        }
        for (let i: number = 1; i <= 10; i++) {
            this.fontSizeColl.push({ text: (i * (Math.round(fontSize / 2))).toString() });
            items.push({text: (i.toString())});
        }
        return items;
    }

    /**
     * Handles the OK button operation
     *
     * @param { boolean } isMouseDown - Specifies whether it is a mouse down.
     * @hidden
     * @returns {void}.
     */
    public okBtn(isMouseDown?: boolean): void {
        let isCropSelection: boolean = false; let splitWords: string[];
        if (this.activeObj.shape !== undefined) {splitWords = this.activeObj.shape.split('-'); }
        if (splitWords === undefined && this.currObjType.isCustomCrop) {
            isCropSelection = true;
        } else if (splitWords !== undefined && splitWords[0] === 'crop'){
            isCropSelection = true;
        }
        const selElem: HTMLElement = this.element.querySelector('.e-contextual-toolbar-wrapper .e-toolbar-item.e-selected');
        const obj: Object = {bool: false };
        this.notify('selection', { prop: 'getFreehandDrawEditing', onPropertyChange: false, value: {obj: obj }});
        if (selElem) {
            this.currentFilter = selElem.children[0].children[0].id.replace('Canvas', '');
        }
        if (isCropSelection) {
            this.crop();
        } else if (this.togglePen) {
            this.freeHandDraw(false);
            this.notify('undo-redo', {prop: 'updateCurrUrc', value: {type: 'ok' }});
        } else if (this.textArea.style.display === 'block') {
            this.notify('shape', { prop: 'redrawActObj', onPropertyChange: false,
                value: {x: null, y: null, isMouseDown: null}});
            if (isNullOrUndefined(isMouseDown)) {
                this.notify('undo-redo', {prop: 'updateCurrUrc', value: {type: 'ok' }});
            }
        } else if ((!isBlazor() && document.querySelector('#' + this.element.id + '_sliderWrapper')) || (isBlazor() && !this.element.querySelector('.e-ie-contextual-slider').classList.contains('e-hidden')) ||
            this.currObjType.isFiltered) {
            this.initialAdjustmentValue = this.canvasFilter = this.lowerContext.filter;
            this.currObjType.isFiltered = false;
            const obj: Object = {value: null };
            this.notify('draw', {prop: 'getTempAdjustmentValue', value: {obj: obj }});
            if (obj['value'] !== this.lowerContext.filter) {
                this.notify('undo-redo', {prop: 'updateCurrUrc', value: {type: 'ok' }});
            }
        } else if (obj['bool']) {
            this.notify('freehand-draw', {prop: 'applyFhd', onPropertyChange: false});
            this.notify('selection', {prop: 'setFreehandDrawCustomized', value: {isFreehandDrawCustomized: false }});
            if (!isBlazor()) {
                this.notify('toolbar', {prop: 'destroy-qa-toolbar' });
            } else {
                this.updateToolbar(this.element, 'destroyQuickAccessToolbar');
            }
            this.notify('undo-redo', {prop: 'updateCurrUrc', value: {type: 'ok' }});
        } else if ((this.activeObj.activePoint.width !== 0 && this.activeObj.activePoint.height !== 0) ||
            (this.activeObj.shape === 'path' && this.activeObj.pointColl.length > 0)) {
            this.notify('shape', { prop: 'applyActObj', onPropertyChange: false, value: {isMouseDown: isMouseDown}});
        }
        if (!isBlazor() && !obj['isCropToolbar']) {
            this.notify('toolbar', { prop: 'refresh-toolbar', onPropertyChange: false, value: {type: 'main',
                isApplyBtn: false, isCropping: null, isZooming: null, cType: null}});
        }
        this.notify('draw', { prop: 'setNewPath', value: {bool: false }});
        this.isCropTab = false;
        this.transform.zoomFactor = this.transform.defaultZoomFactor;
        this.notify('selection', { prop: 'setCurrentDrawingShape', onPropertyChange: false, value: { value: '' }});
    }

    /**
     * Set the temporary filter properties.
     *
     * @hidden
     * @returns {void}.
     */
    public setTempFilterProperties(): void {
        this.upperCanvas.style.display = 'block';
        this.cropSelectedState();
        const obj: Object = {adjustmentLevel: null };
        this.notify('filter', { prop: 'getAdjustmentLevel', onPropertyChange: false,
            value: {obj: obj }});
        this.lowerContext.filter = this.initialAdjustmentValue;
        this.notify('draw', {prop: 'setTempAdjustmentValue', value: {tempAdjustmentValue: this.lowerContext.filter }});
        this.notify('filter', { prop: 'setTempAdjustmentLevel', onPropertyChange: false,
            value: {tempAdjustmentLevel: extend({}, obj['adjustmentLevel'], {}, true) }});
        this.notify('draw', {prop: 'setTempFilter', value: {tempFilter: this.currentFilter }});
        const undoRedoObj: Object = {undoRedoStep: null };
        this.notify('undo-redo', {prop: 'getUndoRedoStep', value: {obj: undoRedoObj }});
        this.notify('draw', {prop: 'setTempUndoRedoStep', value: {tempUndoRedoStep: undoRedoObj['undoRedoStep'] }});
    }

    /**
     * To crop the selection.
     *
     * @hidden
     * @returns {void}.
     */
    public cropSelectedState(): void {
        if (this.activeObj.shape && this.activeObj.shape.split('-')[0] === 'crop') {
            this.okBtn();
        }
    }

    /**
     * Get the current canvas data.
     *
     * @hidden
     * @returns {ImageData}.
     * An ImageData returns the current canvas image data object.
     */
    public getCurrentCanvasData(): ImageData {
        const tempFilter: string = this.lowerContext.filter;
        this.lowerContext.filter = this.canvasFilter = 'none';
        const objColl: SelectionPoint[] = extend([], this.objColl, null, true) as SelectionPoint[];
        const pointColl: Point[] = extend([], this.pointColl, null, true) as Point[];
        this.objColl = []; this.pointColl = []; this.freehandCounter = 0;
        this.notify('draw', {prop: 'render-image', value: {isMouseWheel: false } });
        const data: ImageData = this.getImageData();
        if (!isBlazor()) {
            if (!Browser.isDevice) {
                this.notify('toolbar', { prop: 'refresh-toolbar', onPropertyChange: false, value: {type: 'main',
                    isApplyBtn: true, isCropping: false }});
            }
            this.element.querySelector('#' + this.element.id + '_contextualToolbarArea').classList.remove('e-hide');
        }
        this.objColl = objColl; this.pointColl = pointColl; this.freehandCounter = pointColl.length;
        this.notify('shape', { prop: 'iterateObjColl', onPropertyChange: false});
        this.lowerContext.filter = this.canvasFilter = tempFilter;
        return data;
    }

    /**
     * To set current adjustment value
     *
     * @param { string } type - Specifies the type of adjustment.
     * @param { number } value - Specifies the value to adjust.
     * @hidden
     * @returns {void}.
     */
    public setCurrAdjustmentValue(type: string, value: number): void {
        const finetuneValueChanging: FinetuneEventArgs = { finetune: this.getFinetuneOption(type),
            value: value, cancel: false };
        if (isBlazor() && this.events && this.events.finetuneValueChanging.hasDelegate === true) {
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            (this.dotNetRef.invokeMethodAsync('OnFinetuneValueChangeAsync', finetuneValueChanging) as any).then((finetuneValueChanging: FinetuneEventArgs) => {
                if (finetuneValueChanging.cancel) { return; }
                this.notify('filter', { prop: 'setCurrAdjValue', value: { type: type.toLowerCase(), value: value } });
            });
        } else {
            this.trigger('finetuneValueChanging', finetuneValueChanging);
            if (finetuneValueChanging.cancel) { return; }
            this.notify('filter', { prop: 'setCurrAdjValue', value: { type: type.toLowerCase(), value: value } });
        }
    }

    /**
     * Get the square point for path.
     *
     * @param { SelectionPoint } obj - Specifies the points of path.
     * @hidden
     * @returns {ActivePoint}.
     * An ActivePoint object which returns the square point.
     */
    public getSquarePointForPath(obj: SelectionPoint): ActivePoint {
        let point: ActivePoint = { startX: 0, startY: 0, endX: 0, endY: 0, width: 0, height: 0 };
        if (obj.pointColl.length > 0) {
            point = {startX: obj.pointColl[0].x, startY: obj.pointColl[0].y, endX: obj.pointColl[0].x, endY: obj.pointColl[0].y };
            for (let i: number = 1; i < obj.pointColl.length; i++) {
                if (obj.pointColl[i as number].x < point.startX) {
                    point.startX = obj.pointColl[i as number].x;
                }
                if (obj.pointColl[i as number].y < point.startY) {
                    point.startY = obj.pointColl[i as number].y;
                }
                if (obj.pointColl[i as number].x > point.endX) {
                    point.endX = obj.pointColl[i as number].x;
                }
                if (obj.pointColl[i as number].y > point.endY) {
                    point.endY = obj.pointColl[i as number].y;
                }
            }
            point.width = point.endX - point.startX;
            point.height = point.endY - point.startY;
        }
        return point;
    }

    /**
     * Get the SelectionType.
     *
     * @param { string } type - Specifies the SelectionType.
     * @hidden
     * @returns {string}.
     * An string which returns the SelectionType.
     */
    public getSelectionType(type: string): string {
        const typeToSelectionType: Object = {'CropCustom': 'Custom', 'CropSquare': 'Square', 'CropCircle': 'Circle',
            'Crop3:2': '3:2', 'Crop4:3': '4:3', 'Crop5:4': '5:4', 'Crop7:5': '7:5', 'Crop16:9': '16:9' };
        return typeToSelectionType[`${type}`];
    }

    /** Clears the context.
     *
     * @param { CanvasRenderingContext2D } ctx - Specifies the canvas context.
     * @hidden
     * @returns {void}.
     */
    public clearContext(ctx: CanvasRenderingContext2D): void {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.clearRect(0, 0, ctx.canvas.height, ctx.canvas.width);
    }

    /**
     * Apply Arrow for start and end.
     *
     * @param { string } type - Specifies the start arrow or end arrow.
     * @param { string } id - Specifies the start arrow or end arrow item id.
     * @hidden
     * @returns {void}.
     */
    public updateArrow(type: string, id: string): void{
        this.notify('shape', { prop: 'pushActItemIntoObj'});
        const prevCropObj: CurrentObject = extend({}, this.cropObj, {}, true) as CurrentObject;
        const object: Object = {currObj: {} as CurrentObject };
        this.notify('filter', { prop: 'getCurrentObj', onPropertyChange: false, value: {object: object }});
        const prevObj: CurrentObject = object['currObj'];
        prevObj.objColl = extend([], this.objColl, [], true) as SelectionPoint[];
        prevObj.pointColl = extend([], this.pointColl, [], true) as Point[];
        prevObj.afterCropActions = extend([], this.afterCropActions, [], true) as string[];
        this.objColl.pop();
        if (type === 'startArrow') {this.activeObj.start = this.getTextFromId(id); }
        else if (type === 'endArrow') {this.activeObj.end = this.getTextFromId(id); }
        this.notify('shape', {prop: 'setStrokeSettings', value: {strokeSettings: null, strokeColor: null, fillColor: null,
            strokeWidth: this.activeObj.strokeSettings.strokeWidth }});
        this.objColl.push(this.activeObj);
        this.notify('undo-redo', { prop: 'updateUndoRedoColl', onPropertyChange: false,
            value: {operation: 'shapeTransform', previousObj: prevObj, previousObjColl: prevObj.objColl,
                previousPointColl: prevObj.pointColl, previousCropObj: prevCropObj, previousText: null,
                currentText: null, previousFilter: null, isCircleCrop: null}});
        this.notify('selection', { prop: 'redrawShape', value: { obj: this.objColl[this.objColl.length - 1] }});
        if (!isBlazor()) {
            if (Browser.isDevice) {
                if (document.getElementById(this.element.id + '_bottomToolbar')) {
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    const toolbar: any = getComponent(this.element.id + '_bottomToolbar', 'toolbar') as Toolbar;
                    toolbar.refreshOverflow();
                }
            } else {
                if (document.getElementById(this.element.id + '_toolbar')) {
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    const toolbar: any = getComponent(this.element.id + '_toolbar', 'toolbar') as Toolbar;
                    toolbar.refreshOverflow();
                }
            }
        }
    }

    /**
     * Apply Font style for text.
     *
     * @param { string } id - Specifies the selected item id.
     * @hidden
     * @returns {void}.
     */
    public updateFontFamily(id: string): void {
        this.notify('selection', { prop: 'setInitialTextEdit', value: {bool: false }});
        this.notify('shape', { prop: 'pushActItemIntoObj'});
        const objColl: SelectionPoint[] = extend([], this.objColl, [], true) as SelectionPoint[];
        const prevCropObj: CurrentObject = extend({}, this.cropObj, {}, true) as CurrentObject;
        const object: Object = {currObj: {} as CurrentObject };
        this.notify('filter', { prop: 'getCurrentObj', onPropertyChange: false, value: {object: object }});
        const prevObj: CurrentObject = object['currObj'];
        prevObj.objColl = extend([], this.objColl, [], true) as SelectionPoint[];
        prevObj.pointColl = extend([], this.pointColl, [], true) as Point[];
        prevObj.afterCropActions = extend([], this.afterCropActions, [], true) as string[];
        const selPointCollObj: Object = {selPointColl: null };
        this.notify('freehand-draw', { prop: 'getSelPointColl', onPropertyChange: false,
            value: {obj: selPointCollObj }});
        prevObj.selPointColl = extend([], selPointCollObj['selPointColl'], [], true) as Point[];
        this.objColl.pop();
        if (this.textArea.style.display === 'block') {
            this.notify('shape', { prop: 'updateFontRatio', onPropertyChange: false,
                value: {obj: this.activeObj, isTextArea: true}});
            const temp: string = this.activeObj.textSettings.fontFamily;
            this.activeObj.textSettings.fontFamily = this.toPascalCase(id);
            this.notify('shape', { prop: 'redraw-text' });
            this.objColl.push(this.activeObj);
            this.notify('undo-redo', { prop: 'updateUndoRedoColl', onPropertyChange: false,
                value: {operation: 'textAreaCustomization', previousObj: prevObj, previousObjColl: prevObj.objColl,
                    previousPointColl: prevObj.pointColl, previousSelPointColl: prevObj.selPointColl,
                    previousCropObj: prevCropObj, previousText: null,
                    currentText: null, previousFilter: null, isCircleCrop: null}});
            this.objColl.pop();
            this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
            const width: number = this.activeObj.activePoint.width +
            this.activeObj.textSettings.fontSize * 0.25;
            this.textArea.style.width = width + 'px';
            this.textArea.style.fontFamily = this.toPascalCase(id);
            this.activeObj.textSettings.fontFamily = temp;
            this.notify('shape', { prop: 'updateFontStyles', onPropertyChange: false,
                value: { isTextBox: null}});
        } else {
            this.notify('shape', { prop: 'updateFontRatio', onPropertyChange: false,
                value: {obj: this.activeObj, isTextArea: null}});
            const fontFamily: string = this.activeObj.textSettings.fontFamily = this.toPascalCase(id);
            this.notify('shape', { prop: 'setTextSettings', onPropertyChange: false,
                value: {textSettings: null, fontFamily: fontFamily, fontSize: null }});
            this.notify('shape', { prop: 'redraw-text' });
            this.objColl.push(this.activeObj);
            this.notify('undo-redo', { prop: 'updateUndoRedoColl', onPropertyChange: false,
                value: {operation: 'shapeTransform', previousObj: prevObj, previousObjColl: objColl,
                    previousPointColl: extend([], this.pointColl, [], true) as Point[],
                    previousSelPointColl: prevObj.selPointColl, previousCropObj: prevCropObj, previousText: null,
                    currentText: null, previousFilter: null, isCircleCrop: null}});
            this.notify('selection', { prop: 'redrawShape', value: { obj: this.objColl[this.objColl.length - 1] }});
        }
    }

    /**
     * Apply Font size for text.
     *
     * @param { string } text - Specifies the selected item text.
     * @hidden
     * @returns {void}.
     */
    public updateFontSize(text: string): void {
        const itemText: string = text;
        this.notify('selection', { prop: 'setInitialTextEdit', value: {bool: false }});
        this.notify('shape', { prop: 'pushActItemIntoObj'});
        const prevCropObj: CurrentObject = extend({}, this.cropObj, {}, true) as CurrentObject;
        const object: Object = {currObj: {} as CurrentObject };
        this.notify('filter', { prop: 'getCurrentObj', onPropertyChange: false, value: {object: object }});
        const prevObj: CurrentObject = object['currObj'];
        prevObj.objColl = extend([], this.objColl, [], true) as SelectionPoint[];
        prevObj.pointColl = extend([], this.pointColl, [], true) as Point[];
        prevObj.afterCropActions = extend([], this.afterCropActions, [], true) as string[];
        const selPointCollObj: Object = {selPointColl: null };
        this.notify('freehand-draw', { prop: 'getSelPointColl', onPropertyChange: false,
            value: {obj: selPointCollObj }});
        prevObj.selPointColl = extend([], selPointCollObj['selPointColl'], [], true) as Point[];
        this.objColl.pop();
        if (this.textArea.style.display === 'block') {
            this.notify('shape', { prop: 'updateFontRatio', onPropertyChange: false,
                value: {obj: this.activeObj, isTextArea: true}});
            const temp: number = this.activeObj.textSettings.fontSize;
            this.activeObj.textSettings.fontSize = parseInt(this.fontSizeColl[(parseInt(itemText, 10) - 1)].text, 10);
            this.objColl.push(this.activeObj);
            this.notify('undo-redo', { prop: 'updateUndoRedoColl', onPropertyChange: false,
                value: {operation: 'textAreaCustomization', previousObj: prevObj, previousObjColl: prevObj.objColl,
                    previousPointColl: prevObj.pointColl, previousSelPointColl: prevObj.selPointColl,
                    previousCropObj: prevCropObj, previousText: null,
                    currentText: null, previousFilter: null, isCircleCrop: null}});
            this.objColl.pop();
            let textStyle: string = '';
            if (this.textArea.style.fontWeight === 'bold') {textStyle = 'bold '; }
            if (this.textArea.style.fontStyle === 'italic') {textStyle = 'italic '; }
            if (this.textArea.style.fontWeight === 'bold' && this.textArea.style.fontStyle === 'italic') {
                textStyle = 'italic bold '; }
            this.upperContext.font = textStyle + this.activeObj.textSettings.fontSize + 'px' + ' ' + this.textArea.style.fontFamily;
            const rows: string[] = this.textArea.value.split('\n');
            const obj: Object = {maxText: '' };
            this.notify('shape', { prop: 'getMaxText', onPropertyChange: false,
                value: {isTextBox: true, text: null, obj: obj }});
            const text: string = obj['maxText'];
            const width: number = this.upperContext.measureText(text).width +
            this.activeObj.textSettings.fontSize * 0.5;
            this.textArea.style.width = width + 'px';
            this.textArea.style.height = rows.length * (this.activeObj.textSettings.fontSize + this.activeObj.textSettings.fontSize * 0.25) + 'px';
            this.activeObj.textSettings.fontSize = temp;
            this.upperContext.font = this.activeObj.textSettings.fontSize + 'px' + ' ' + this.activeObj.textSettings.fontFamily;
            this.textArea.style.fontSize = parseInt(this.fontSizeColl[(parseInt(itemText, 10) - 1)].text, 10) + 'px';
            if (this.textArea.style.fontFamily === 'georgia') {
                this.textArea.style.width = parseFloat(this.textArea.style.width) + parseFloat(this.textArea.style.fontSize) + 'px';
            }
        } else {
            this.notify('shape', { prop: 'updateFontRatio', onPropertyChange: false,
                value: {obj: this.activeObj, isTextArea: null}});
            const fontSize: number = this.activeObj.textSettings.fontSize = parseInt(this.fontSizeColl[(
                parseInt(itemText, 10) - 1)].text, 10);
            this.notify('shape', { prop: 'setTextSettings', onPropertyChange: false,
                value: {textSettings: null, fontFamily: null, fontSize: fontSize }});
            this.upperContext.font = this.activeObj.textSettings.fontSize + 'px' + ' ' + this.activeObj.textSettings.fontFamily;
            const rows: string[] = this.activeObj.keyHistory.split('\n');
            const obj: Object = {maxText: '' };
            this.notify('shape', { prop: 'getMaxText', onPropertyChange: false,
                value: {isTextBox: null, text: null, obj: obj }});
            const text: string = obj['maxText'];
            const width: number = this.upperContext.measureText(text).width +
            this.activeObj.textSettings.fontSize * 0.5;
            const height: number = rows.length * (this.activeObj.textSettings.fontSize +
                this.activeObj.textSettings.fontSize * 0.25);
            this.notify('selection', { prop: 'setTextSelection', onPropertyChange: false,
                value: {width: width, height: height}});
            this.notify('draw', { prop: 'updateActiveObject', onPropertyChange: false, value: {actPoint: this.activeObj.activePoint, obj: this.activeObj,
                isMouseMove: null, x: null, y: null}});
            this.notify('shape', { prop: 'redraw-text' });
            this.objColl.push(this.activeObj);
            this.notify('undo-redo', { prop: 'updateUndoRedoColl', onPropertyChange: false,
                value: {operation: 'shapeTransform', previousObj: prevObj, previousObjColl: prevObj.objColl,
                    previousPointColl: prevObj.pointColl, previousSelPointColl: prevObj.selPointColl,
                    previousCropObj: prevCropObj, previousText: null,
                    currentText: null, previousFilter: null, isCircleCrop: null}});
            this.notify('selection', { prop: 'redrawShape', value: { obj: this.objColl[this.objColl.length - 1] }});
        }
    }

    /**
     * Apply Font color for text.
     *
     * @param { string } value - Specifies the selected color item value.
     * @hidden
     * @returns {void}.
     */
    public updateFontColor(value: string): void {
        this.notify('selection', { prop: 'setInitialTextEdit', value: {bool: false }});
        this.notify('shape', { prop: 'pushActItemIntoObj'});
        const prevCropObj: CurrentObject = extend({}, this.cropObj, {}, true) as CurrentObject;
        const object: Object = {currObj: {} as CurrentObject };
        this.notify('filter', { prop: 'getCurrentObj', onPropertyChange: false, value: {object: object }});
        const prevObj: CurrentObject = object['currObj'];
        prevObj.objColl = extend([], this.objColl, [], true) as SelectionPoint[];
        prevObj.pointColl = extend([], this.pointColl, [], true) as Point[];
        prevObj.afterCropActions = extend([], this.afterCropActions, [], true) as string[];
        const selPointCollObj: Object = {selPointColl: null };
        this.notify('freehand-draw', { prop: 'getSelPointColl', onPropertyChange: false,
            value: {obj: selPointCollObj }});
        prevObj.selPointColl = extend([], selPointCollObj['selPointColl'], [], true) as Point[];
        this.objColl.pop();
        if (this.textArea.style.display === 'none') {
            this.activeObj.strokeSettings.strokeColor = value;
            this.notify('shape', {prop: 'setStrokeSettings', value: {strokeSettings: null,
                strokeColor: this.activeObj.strokeSettings.strokeColor, fillColor: null, strokeWidth: null }});
            if (!this.togglePen) {
                this.objColl.push(this.activeObj);
                this.notify('undo-redo', { prop: 'updateUndoRedoColl', onPropertyChange: false,
                    value: {operation: 'shapeTransform', previousObj: prevObj, previousObjColl: prevObj.objColl,
                        previousPointColl: prevObj.pointColl, previousSelPointColl: prevObj.selPointColl,
                        previousCropObj: prevCropObj, previousText: null,
                        currentText: null, previousFilter: null, isCircleCrop: null}});
                this.notify('selection', { prop: 'redrawShape', value: { obj: this.objColl[this.objColl.length - 1] }});
            }
        }
        else if (this.textArea.style.display === 'block') {
            this.textArea.style.color = value;
            const temp: string = this.activeObj.strokeSettings.strokeColor;
            this.activeObj.strokeSettings.strokeColor = value;
            this.objColl.push(this.activeObj);
            this.notify('undo-redo', { prop: 'updateUndoRedoColl', onPropertyChange: false,
                value: {operation: 'textAreaCustomization', previousObj: prevObj, previousObjColl: prevObj.objColl,
                    previousPointColl: prevObj.pointColl, previousSelPointColl: prevObj.selPointColl,
                    previousCropObj: prevCropObj, previousText: null,
                    currentText: null, previousFilter: null, isCircleCrop: null}});
            this.objColl.pop();
            this.activeObj.strokeSettings.strokeColor = temp;
        } else if (!this.togglePen) {
            this.objColl.push(this.activeObj);
            this.notify('undo-redo', { prop: 'updateUndoRedoColl', onPropertyChange: false,
                value: {operation: 'shapeTransform', previousObj: prevObj, previousObjColl: prevObj.objColl,
                    previousPointColl: prevObj.pointColl, previousSelPointColl: prevObj.selPointColl,
                    previousCropObj: prevCropObj, previousText: null,
                    currentText: null, previousFilter: null, isCircleCrop: null}});
            this.notify('selection', { prop: 'redrawShape', value: { obj: this.objColl[this.objColl.length - 1] }});
        }
    }

    /**
     * Apply Pen stroke width.
     *
     * @param { string } id - Specifies the selected item id.
     * @hidden
     * @returns {void}.
     */
    public updatePenStrokeWidth(id: string): void {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const temp: any = extend([], this.pointColl, [], true);
        this.updateFreehandDrawColorChange();
        const prevCropObj: CurrentObject = extend({}, this.cropObj, {}, true) as CurrentObject;
        const object: Object = {currObj: {} as CurrentObject };
        this.notify('filter', { prop: 'getCurrentObj', onPropertyChange: false, value: {object: object }});
        const prevObj: CurrentObject = object['currObj'];
        prevObj.objColl = extend([], this.objColl, [], true) as SelectionPoint[];
        prevObj.pointColl = extend([], this.pointColl, [], true) as Point[];
        prevObj.afterCropActions = extend([], this.afterCropActions, [], true) as string[];
        const selPointCollObj: Object = {selPointColl: null };
        this.notify('freehand-draw', { prop: 'getSelPointColl', onPropertyChange: false,
            value: {obj: selPointCollObj }});
        prevObj.selPointColl = extend([], selPointCollObj['selPointColl'], [], true) as Point[];
        this.pointColl = temp;
        this.notify('selection', {prop: 'setFreehandDrawCustomized', value: {isFreehandDrawCustomized: true }});
        this.setPenStroke(id);
        const obj: Object = {bool: false };
        this.notify('selection', { prop: 'getFreehandDrawEditing', onPropertyChange: false, value: {obj: obj }});
        if (obj['bool']) {
            const obj: Object = {penStrokeWidth: null };
            this.notify('freehand-draw', {prop: 'getPenStrokeWidth', onPropertyChange: false, value: {obj: obj }});
            this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
            this.notify('freehand-draw', { prop: 'hoverFhd', onPropertyChange: false,
                value: {strokeColor: null, strokeWidth: obj['penStrokeWidth']} });
            const indexObj: Object = {freehandSelectedIndex: null };
            this.notify('freehand-draw', {prop: 'getFreehandSelectedIndex', onPropertyChange: false, value: {obj: indexObj }});
            this.pointColl[indexObj['freehandSelectedIndex']].strokeWidth = obj['penStrokeWidth'];
            this.notify('undo-redo', { prop: 'updateUndoRedoColl', onPropertyChange: false,
                value: {operation: 'freehanddrawCustomized', previousObj: prevObj, previousObjColl: prevObj.objColl,
                    previousPointColl: prevObj.pointColl, previousSelPointColl: prevObj.selPointColl,
                    previousCropObj: prevCropObj, previousText: null,
                    currentText: null, previousFilter: null, isCircleCrop: null}});
        }
    }

    /**
     * Apply Pen stroke color.
     *
     * @param { string } value - Specifies the selected color item value.
     * @hidden
     * @returns {void}.
     */
    public updatePenStrokeColor(value: string): void {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const temp: any = extend([], this.pointColl, [], true);
        this.updateFreehandDrawColorChange();
        const prevCropObj: CurrentObject = extend({}, this.cropObj, {}, true) as CurrentObject;
        const object: Object = {currObj: {} as CurrentObject };
        this.notify('filter', { prop: 'getCurrentObj', onPropertyChange: false, value: {object: object }});
        const prevObj: CurrentObject = object['currObj'];
        prevObj.objColl = extend([], this.objColl, [], true) as SelectionPoint[];
        prevObj.pointColl = extend([], this.pointColl, [], true) as Point[];
        prevObj.afterCropActions = extend([], this.afterCropActions, [], true) as string[];
        const selPointCollObj: Object = {selPointColl: null };
        this.notify('freehand-draw', { prop: 'getSelPointColl', onPropertyChange: false,
            value: {obj: selPointCollObj }});
        prevObj.selPointColl = extend([], selPointCollObj['selPointColl'], [], true) as Point[];
        this.pointColl = temp;
        this.notify('selection', {prop: 'setFreehandDrawCustomized', value: {isFreehandDrawCustomized: true }});
        this.activeObj.strokeSettings.strokeColor = value;
        const obj: Object = {bool: false };
        this.notify('selection', { prop: 'getFreehandDrawEditing', onPropertyChange: false, value: {obj: obj }});
        if (obj['bool']) {
            const indexObj: Object = {freehandSelectedIndex: null };
            this.notify('freehand-draw', {prop: 'getFreehandSelectedIndex', onPropertyChange: false, value: {obj: indexObj }});
            this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
            this.pointColl[indexObj['freehandSelectedIndex']].strokeColor = value;
            this.notify('freehand-draw', { prop: 'hoverFhd', onPropertyChange: false,
                value: {strokeColor: value} });
            this.notify('undo-redo', { prop: 'updateUndoRedoColl', onPropertyChange: false,
                value: {operation: 'freehanddrawCustomized', previousObj: prevObj, previousObjColl: prevObj.objColl,
                    previousPointColl: prevObj.pointColl, previousSelPointColl: prevObj.selPointColl,
                    previousCropObj: prevCropObj, previousText: null,
                    currentText: null, previousFilter: null, isCircleCrop: null}});
        }
        else if (!this.togglePen) {
            this.notify('selection', { prop: 'redrawShape', value: { obj: this.activeObj }});
        }
    }

    /**
     * Apply Shape stroke width.
     *
     * @param { string } id - Specifies the selected item id.
     * @hidden
     * @returns {void}.
     */
    public updateStrokeWidth(id: string): void {
        this.notify('shape', { prop: 'pushActItemIntoObj'});
        const prevCropObj: CurrentObject = extend({}, this.cropObj, {}, true) as CurrentObject;
        const object: Object = {currObj: {} as CurrentObject };
        this.notify('filter', { prop: 'getCurrentObj', onPropertyChange: false, value: {object: object }});
        const prevObj: CurrentObject = object['currObj'];
        prevObj.objColl = extend([], this.objColl, [], true) as SelectionPoint[];
        prevObj.pointColl = extend([], this.pointColl, [], true) as Point[];
        prevObj.afterCropActions = extend([], this.afterCropActions, [], true) as string[];
        const selPointCollObj: Object = {selPointColl: null };
        this.notify('freehand-draw', { prop: 'getSelPointColl', onPropertyChange: false,
            value: {obj: selPointCollObj }});
        prevObj.selPointColl = extend([], selPointCollObj['selPointColl'], [], true) as Point[];
        this.objColl.pop();
        this.activeObj.strokeSettings.strokeWidth = parseInt(id, 10);
        this.activeObj.strokeSettings.strokeWidth *= 2;
        this.notify('shape', {prop: 'setStrokeSettings', value: {strokeSettings: null, strokeColor: null, fillColor: null,
            strokeWidth: this.activeObj.strokeSettings.strokeWidth }});
        this.objColl.push(this.activeObj);
        this.notify('undo-redo', { prop: 'updateUndoRedoColl', onPropertyChange: false,
            value: {operation: 'shapeTransform', previousObj: prevObj, previousObjColl: prevObj.objColl,
                previousPointColl: prevObj.pointColl, previousSelPointColl: prevObj.selPointColl,
                previousCropObj: prevCropObj, previousText: null,
                currentText: null, previousFilter: null, isCircleCrop: null}});
        this.notify('selection', { prop: 'redrawShape', value: { obj: this.objColl[this.objColl.length - 1] }});
    }

    /**
     * Apply Shape stroke color.
     *
     * @param { string } value - Specifies the selected color item value.
     * @hidden
     * @returns {void}.
     */
    public updateStrokeColor(value: string): void {
        this.notify('shape', { prop: 'pushActItemIntoObj'});
        const prevCropObj: CurrentObject = extend({}, this.cropObj, {}, true) as CurrentObject;
        const object: Object = {currObj: {} as CurrentObject };
        this.notify('filter', { prop: 'getCurrentObj', onPropertyChange: false, value: {object: object }});
        const prevObj: CurrentObject = object['currObj'];
        prevObj.objColl = extend([], this.objColl, [], true) as SelectionPoint[];
        prevObj.pointColl = extend([], this.pointColl, [], true) as Point[];
        prevObj.afterCropActions = extend([], this.afterCropActions, [], true) as string[];
        const selPointCollObj: Object = {selPointColl: null };
        this.notify('freehand-draw', { prop: 'getSelPointColl', onPropertyChange: false,
            value: {obj: selPointCollObj }});
        prevObj.selPointColl = extend([], selPointCollObj['selPointColl'], [], true) as Point[];
        this.objColl.pop();
        this.activeObj.strokeSettings.strokeColor = value;
        this.notify('shape', {prop: 'setStrokeSettings', value: {strokeSettings: null, strokeColor:
            this.activeObj.strokeSettings.strokeColor, fillColor: null, strokeWidth: null }});
        if (!this.togglePen) {
            this.objColl.push(this.activeObj);
            this.notify('undo-redo', { prop: 'updateUndoRedoColl', onPropertyChange: false,
                value: {operation: 'shapeTransform', previousObj: prevObj, previousObjColl: prevObj.objColl,
                    previousPointColl: prevObj.pointColl, previousSelPointColl: prevObj.selPointColl,
                    previousCropObj: prevCropObj, previousText: null,
                    currentText: null, previousFilter: null, isCircleCrop: null}});
            this.notify('selection', { prop: 'redrawShape', value: { obj: this.objColl[this.objColl.length - 1] }});
        }
    }

    /**
     * Apply Shape fill color.
     *
     * @param { string } value - Specifies the selected color item value.
     * @hidden
     * @returns {void}.
     */
    public updateFillColor(value: string): void {
        this.notify('shape', { prop: 'pushActItemIntoObj'});
        const prevCropObj: CurrentObject = extend({}, this.cropObj, {}, true) as CurrentObject;
        const object: Object = {currObj: {} as CurrentObject };
        this.notify('filter', { prop: 'getCurrentObj', onPropertyChange: false, value: {object: object }});
        const prevObj: CurrentObject = object['currObj'];
        prevObj.objColl = extend([], this.objColl, [], true) as SelectionPoint[];
        prevObj.pointColl = extend([], this.pointColl, [], true) as Point[];
        prevObj.afterCropActions = extend([], this.afterCropActions, [], true) as string[];
        const selPointCollObj: Object = {selPointColl: null };
        this.notify('freehand-draw', { prop: 'getSelPointColl', onPropertyChange: false,
            value: {obj: selPointCollObj }});
        prevObj.selPointColl = extend([], selPointCollObj['selPointColl'], [], true) as Point[];
        this.objColl.pop();
        this.activeObj.strokeSettings.fillColor = value;
        this.notify('shape', {prop: 'setStrokeSettings',
            value: {strokeSettings: null, strokeColor: null, fillColor: this.activeObj.strokeSettings.fillColor,
                strokeWidth: null }});
        this.objColl.push(this.activeObj);
        this.notify('undo-redo', { prop: 'updateUndoRedoColl', onPropertyChange: false,
            value: {operation: 'shapeTransform', previousObj: prevObj, previousObjColl: prevObj.objColl,
                previousPointColl: prevObj.pointColl, previousSelPointColl: prevObj.selPointColl,
                previousCropObj: prevCropObj, previousText: null,
                currentText: null, previousFilter: null, isCircleCrop: null}});
        this.notify('selection', { prop: 'redrawShape', value: { obj: this.objColl[this.objColl.length - 1] }});
    }

    /**
     * Get pascalToSplitWords from string.
     *
     * @param { string } str - Specifies the word.
     * @hidden
     * @returns {string}.
     */
    public pascalToSplitWords(str: string): string {
        str = str.charAt(0).toUpperCase() + str.slice(1);
        const splitStr: string[] = str.match(/[A-Z][a-z]+/g);
        if (isNullOrUndefined(splitStr)) {
            return str;
        } else {
            return splitStr.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        }
    }

    /**
     * Get Slider Value.
     *
     * @param { string } type - Finetune type.
     * @hidden
     * @returns {number}.
     */
    public getCurrAdjustmentValue(type: string): number {
        const obj: Object = {adjustmentLevel: null };
        this.notify('filter', { prop: 'getAdjustmentLevel', onPropertyChange: false,
            value: {obj: obj }});
        const typeToAdjustmentLevel: Object = {'brightness': obj['adjustmentLevel'].brightness,
            'contrast': obj['adjustmentLevel'].contrast, 'hue': obj['adjustmentLevel'].hue,
            'saturation': obj['adjustmentLevel'].saturation, 'opacity': obj['adjustmentLevel'].opacity,
            'blur': obj['adjustmentLevel'].blur, 'exposure': obj['adjustmentLevel'].exposure };
        return typeToAdjustmentLevel[`${type}`] as number;
    }

    /**
     * Apply transformSelect.
     *
     * @param { string } type - Specifies the selected item text.
     * @hidden
     * @returns {void}.
     */
    public transformSelect(type: string): void {
        this.isCropToolbar = true;
        this.setInitialZoomState();
        const activeObj: SelectionPoint = extend({}, this.activeObj, {}, true) as SelectionPoint;
        this.cropSelectedState();
        this.notify('draw', {prop: 'resetCurrentSelectionPoint' });
        this.notify('transform', {prop: 'performTransformation', value: {text: type }});
        this.notify('draw', {prop: 'moveToSelectionRange', value: {type: type, activeObj: activeObj }});
        this.isCropToolbar = false;
    }

    /**
     * Returns default filter.
     *
     * @hidden
     * @returns {string}.
     */
    public getDefaultFilter(): string {
        return 'brightness(' + 1 + ') ' + 'contrast(' + 100 + '%) ' + 'hue-rotate(' + 0 + 'deg) ' +
            'saturate(' + 100 + '%) ' + 'opacity(' + 1 + ') ' + 'blur(' + 0 + 'px) ' + 'sepia(0%) ' +
            'grayscale(0%) ' + 'invert(0%)';
    }

    // Blazor codes
    /**
     * To Initialize the component rendering
     *
     * @private
     * @param {HTMLCanvasElement} element - Specifies the canvas element.
     * @param {BlazorDotnetObject} dotnetRef - Specifies for blazor client to server communication.
     * @returns {void}
     */
    public initializeImageEditor(element: HTMLDivElement, dotnetRef?: BlazorDotnetObject): void {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        this.element = element as any;
        const canvasWrapper: HTMLElement =  this.element.querySelector('.e-canvas-wrapper');
        if (this.element.querySelector('#' + this.element.id + '_toolbarArea')) {
            this.toolbarHeight = this.element.querySelector('#' + this.element.id + '_toolbarArea').clientHeight;
        } else {
            this.toolbarHeight = 0;
        }
        canvasWrapper.style.height = (this.element.offsetHeight - this.toolbarHeight - 2) + 'px';
        canvasWrapper.style.width = (this.element.offsetWidth - 2) + 'px';
        this.lowerCanvas = this.element.querySelector('.e-lower-canvas');
        this.upperCanvas = this.element.querySelector('.e-upper-canvas');
        this.lowerCanvas.id = this.element.id + '_lowerCanvas';
        this.upperCanvas.id = this.element.id + '_upperCanvas';
        this.textArea = this.element.querySelector('.e-textbox');
        this.inMemoryCanvas = this.createElement('canvas', {
            id: this.element.id + '_inMemoryCanvas', attrs: { name: 'canvasImage' }
        });
        this.upperCanvas.width = this.lowerCanvas.width = this.inMemoryCanvas.width = this.element.offsetWidth;
        this.upperCanvas.height = this.lowerCanvas.height = this.inMemoryCanvas.height = (this.element.offsetHeight - this.toolbarHeight);
        this.lowerContext = this.lowerCanvas.getContext('2d');
        this.baseImg = this.createElement('img', {
            id: this.element.id + '_orgImg', attrs: { name: 'Image', crossorigin: 'anonymous' }
        });
        this.upperContext = this.upperCanvas.getContext('2d');
        this.inMemoryContext = this.inMemoryCanvas.getContext('2d');
        if (dotnetRef) {this.dotNetRef = dotnetRef; }
        this.prerender(); this.wireEvent();
        this.lowerContext.filter = this.getDefaultFilter();
        this.notify('filter', { prop: 'setAdjustmentValue', onPropertyChange: false, value: {adjustmentValue: this.lowerContext.filter }});
        this.canvasFilter = this.initialAdjustmentValue = this.lowerContext.filter;
        if (this.cssClass) {addClass([this.element], this.cssClass.replace(/\s+/g, ' ').trim().split(' ') ); }
        if (this.element) {
            createSpinner({
                target: this.element
            });
        }
        this.initializeZoomSettings();
    }

    private prerender(): void {
        // pre render code snippets
        this.element.id = this.element.id || getUniqueID('ej2-image-editor');
        if (Browser.isDevice) {
            this.element.classList.add('e-device');
        }
        this.initializeThemeColl();
    }

    private initializeZoomSettings(): void {
        if (isNullOrUndefined(this.zoomSettings.zoomTrigger)) {
            this.zoomSettings.zoomTrigger = (ZoomTrigger.MouseWheel | ZoomTrigger.Pinch | ZoomTrigger.Toolbar | ZoomTrigger.Commands);
        }
        if (isNullOrUndefined(this.selectionSettings.strokeColor)) {
            this.selectionSettings.strokeColor = this.themeColl[this.theme]['primaryColor'];
        }
        if (isNullOrUndefined(this.selectionSettings.fillColor)) {
            this.selectionSettings.fillColor = this.themeColl[this.theme]['secondaryColor'];
        }
    }

    private initializeThemeColl(): void {
        this.themeColl = {
            Bootstrap5: { primaryColor: '#0d6efd', secondaryColor: '#fff' },
            Bootstrap5Dark: { primaryColor: '#0d6efd', secondaryColor: '#fff' },
            Tailwind: { primaryColor: '#4f46e5', secondaryColor: '#fff' },
            TailwindDark: {primaryColor: '#22d3ee', secondaryColor: '#fff' },
            Fluent: { primaryColor: '#0078d4', secondaryColor: '#fff' },
            FluentDark: { primaryColor: '#0078d4', secondaryColor: '#fff' },
            Bootstrap4: { primaryColor: '#007bff', secondaryColor: '#fff' },
            Bootstrap: { primaryColor: '#317ab9', secondaryColor: '#fff' },
            BootstrapDark: { primaryColor: '#317ab9', secondaryColor: '#fff' },
            Material: { primaryColor: '#e3165b', secondaryColor: '#fff' },
            MaterialDark: { primaryColor: '#00b0ff', secondaryColor: '#fff' },
            Fabric: { primaryColor: '#0078d6', secondaryColor: '#fff' },
            FabricDark: { primaryColor: '#0074cc', secondaryColor: '#fff' },
            Highcontrast: { primaryColor: '#000000', secondaryColor: '#fff' },
            Material3: { primaryColor: '#6750a4', secondaryColor: '#fff' },
            Material3Dark: { primaryColor: '#d0bcff', secondaryColor: '#fff' }
        };
    }

    /**
     * Get the square point for path.
     *
     * @param { HTMLDivElement } element - Specifies element.
     * @param { string } type - Specifies the type.
     * @param { string } value - Specifies the value.
     * @hidden
     * @private
     * @returns {void}.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    public updateToolbar(element: HTMLDivElement, type: string, value?: string): void  {

    }
}
