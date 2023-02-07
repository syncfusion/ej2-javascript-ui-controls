import { Component, NotifyPropertyChanges, INotifyPropertyChanged, Property, addClass, removeClass, extend } from '@syncfusion/ej2-base';
import { Event, EmitType, EventHandler, getComponent, getInstance, isNullOrUndefined, L10n, getUniqueID } from '@syncfusion/ej2-base';
import { Dimension, ActivePoint, SliderChangeEventArgs } from '@syncfusion/ej2-inputs';
import { ItemModel, Toolbar, ClickEventArgs } from '@syncfusion/ej2-navigations';
import { DropDownButton, ItemModel as DropDownButtonItemModel, MenuEventArgs, OpenCloseMenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { ColorPicker, ColorPickerEventArgs, Uploader, Slider } from '@syncfusion/ej2-inputs';
import { Button } from '@syncfusion/ej2-buttons';
import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import { Complex, compile, compile as templateCompiler, Browser, detach, select, ChildProperty } from '@syncfusion/ej2-base';
import { ImageEditorModel, FinetuneSettingsModel } from './image-editor-model';

/**
 * Interface for image finetune values.
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
 * Interface for image finetune values.
 */
export class FinetuneSettings extends ChildProperty<FinetuneSettings> {
    /**
     * Specifies the brightness level of image.
     *
     * @default null
     */
    @Property(null)
    public brightness: ImageFinetuneValue;

    /**
     * Specifies the contrast level image.
     *
     * @default null
     */
    @Property(null)
    public contrast: ImageFinetuneValue;

    /**
     * Specifies the hue level image.
     *
     * @default null
     */
    @Property(null)
    public hue: ImageFinetuneValue;

    /**
     * Specifies the saturation level image.
     *
     * @default null
     */
    @Property(null)
    public saturation: ImageFinetuneValue;

    /**
     * Specifies the exposure level image.
     *
     * @default null
     */
    @Property(null)
    public exposure: ImageFinetuneValue;

    /**
     * Specifies the opacity level image.
     *
     * @default null
     */
    @Property(null)
    public opacity: ImageFinetuneValue;

    /**
     * Specifies the blur level image.
     *
     * @default null
     */
    @Property(null)
    public blur: ImageFinetuneValue;
}

/**
 * Image Editor is a graphical user interface that helps to edit an image by performing actions like selection,
 * cropping, rotating, inserting text and shapes (rectangles, ellipses, lines), and drawing free hand on top of an image.
 *
 ```html
 * <div id='imageeditor'></div>
 * ```
 * ```typescript
 * <script>
 * var imageObj = new ImageEditor({});
 * imageObj.appendTo("#imageeditor");
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class ImageEditor extends Component<HTMLDivElement> implements INotifyPropertyChanged {
    /**
     *
     * ImageEditor Private Properties
     */

    private lowerCanvas : HTMLCanvasElement;
    private lowerContext: CanvasRenderingContext2D;
    private upperCanvas: HTMLCanvasElement;
    private upperContext: CanvasRenderingContext2D;
    private inMemoryCanvas: HTMLCanvasElement;
    private inMemoryContext: CanvasRenderingContext2D;
    private baseImg: HTMLImageElement;
    private textArea: HTMLInputElement;
    private degree : number = 0;  // current rotated state
    private isUndoRedo: boolean = false;
    private dragCanvas: boolean = false;
    private dragElement: string = '';
    private keyHistory: string = '';  // text history
    private tempKeyHistory: string = ''; // restore text history on cancel
    private mouseDownPoint: Point = {x: 0, y: 0};
    private previousPoint: Point = {x: 0, y: 0};  // updates prev x and y points in mouseMove
    private dragPoint: ActivePoint = {startX: 0, startY: 0, endX: 0, endY: 0};  // updates drag start and end points in mousedown and mousemove
    private diffPoint: Point = {x: 0, y: 0};  // updates resize points
    private oldPoint: Point = {} as Point;
    private objColl: SelectionPoint[] = [];  // shapes, text obj collection
    private undoRedoColl: Transition[] = [];
    private isImageLoaded: boolean = false;  // collection of Image Data mainly used for reset state
    private strokeSettings: StrokeSettings = {strokeColor: '#fff', fillColor: '', strokeWidth: null};
    private tempStrokeSettings: StrokeSettings = {strokeColor: '#fff', fillColor: '', strokeWidth: null}; // restore stroke settings on cancel
    private textSettings: TextSettings =
    {text: 'Enter Text', fontFamily: 'Arial', fontSize: null, fontRatio: null, bold: false, italic: false, underline: false};
    private tempTextSettings: TextSettings =
    {text: 'Enter Text', fontFamily: 'Arial', fontSize: null, fontRatio: null, bold: false, italic: false, underline: false}; // restore text settings on cancel
    private penStrokeWidth: number;
    private toolbarHeight: number = 46;
    private togglePan: boolean = false; // toggle pan
    private disablePan: boolean = false; // auto enable / disable pan while zooming
    private currFlipState: string = ''; // current flipped state
    private touchEndPoint: Point = {} as Point;
    private undoRedoStep: number = 0;
    private togglePen: boolean = false; // toggle free hand drawing
    private currentToolbar: string = 'main';
    private textStartPoints: Point = {x: 0, y: 0}; // restore text styles on cancel
    private fontSizeColl: DropDownButtonItemModel[] = []; // collection of font sizes
    private textRow: number = 1; // text area row count
    private activeObj: SelectionPoint = {activePoint: {startX: 0, startY: 0, endX: 0, endY: 0, width: 0, height: 0},
        flipObjColl: []} as SelectionPoint;
    private tempActiveObj: SelectionPoint = {activePoint: {startX: 0, startY: 0, endX: 0, endY: 0, width: 0, height: 0},
        flipObjColl: []} as SelectionPoint; // for undo redo
    private currObjType: Interaction = {shape: '', isDragging: false, isActiveObj: false, isText : false, isInitialText: false, isLine: false, isInitialLine: false,
        isCustomCrop: false, isZoomed: false, isUndoZoom: false, isUndoAction: false, isFiltered: false, isSave: false};
    private defToolbarItems: ItemModel[] = [];
    private defaultLocale: Object;
    private l10n: L10n;
    private themeColl: Object;
    private toolbarFn: Function;
    private isTimer: boolean = false; // mobile mode text area rendering on long touch
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    private timer: any; // mobile mode text area rendering on long touch
    private tempObjColl: SelectionPoint[]; // for undo redo
    private isFirstMove: boolean = false; // for pinch zoom
    private startTouches: Point[] = []; // for pinch zoom
    private tempTouches: Point[] = []; // for pinch zoom
    private adjustmentLevel: Adjustment = {brightness: 0, contrast: 0, hue: 0, opacity: 100, saturation: 0, blur: 0,
        exposure: 0, sharpen: false, bw: false}; // for toolbar slider value
    private tempAdjustmentLevel: Adjustment = {brightness: 0, contrast: 0, hue: 0, opacity: 100, saturation: 0, blur: 0,
        exposure: 0, sharpen: false, bw: false}; // for temp toolbar slider value
    private adjustmentValue: string = ''; // for internal slider value
    private initialAdjustmentValue: string = '';
    private tempAdjustmentValue: string = ''; // for temp internal slider value
    private currentFilter: string = ''; // current filter selected from toolbar
    private tempFilter: string = ''; // restore filter style on cancel
    private canvasFilter: string = 'brightness(' + 1 + ') ' + 'contrast(' + 100 + '%) ' + 'hue-rotate(' + 0 + 'deg) ' + // current filter style applied to lowerCanvas
        'saturate(' + 100 + '%) ' + 'opacity(' + 1 + ') ' + 'blur(' + 0 + 'px) ' + 'sepia(0%) ' + 'grayscale(0%) ' + 'invert(0%)';
    private tempUndoRedoColl: Transition[] = [];
    private tempUndoRedoStep: number = 0;
    // Revamp new properties
    private zoomFactor: number = 0; // Current zoom factor
    private tempZoomFactor: number = 0; // Restore zoom factor on cancel
    private destLeft: number = 0; // Current image left position
    private destTop: number = 0; // Current image top position
    private destWidth: number; // Current image width
    private destHeight: number; // Current image height
    private srcLeft: number = 0; // Original image left position
    private srcTop: number = 0; // Original image top position
    private srcWidth: number; // Original image width
    private srcHeight: number; // Original image height
    private currSelectionPoint: SelectionPoint; // To redraw old selection points when navigate to crop tab
    private cropDestPoints: ActivePoint = {startX: 0, startY: 0, width: 0, height: 0} as ActivePoint; // To redraw old image when navigate to crop tab
    private panDown: Point; // To store pan down point
    private panMove: Point; // To store pan move point
    private tempPanMove: Point; // To store previous pan move point
    private flipColl: string[] = []; // To store flip order
    private isReverseRotate: boolean = false; // True when rotate method is called from iteration
    private isReverseFlip: boolean = false; // True when rotate method is called from iteration
    private isPreventDragging: boolean = false; // Shapes dragging is prevented when crop region is inside shape points
    private isRotateZoom: boolean = false; // To restore zoomed image on selection crop selection
    // eslint-disable-next-line
    private rotateFlipColl: any = []; // Transformation collection for redrawing image on rotate and flip
    private currentPannedPoint: Point; // To store current panned point in rotated state
    private isCircleCrop: boolean = false; // Specifies whether circle crop is enabled or not
    private rotatedDestPoints: ActivePoint = {startX: 0, startY: 0, width: 0, height: 0} as ActivePoint;
    private croppedDegree: number = 0; // Specifies the degree when crop is performed
    private freehandDrawHoveredIndex: number; // Specifies current hovered index of freehand drawing
    private freehandDrawSelectedIndex: number; // Specifies current selected index of freehand drawing
    private isFreehandDrawingPoint: boolean = false; // Specifies whether mouse cursor is on freehand drawing point or not
    private isFreehandDrawEditing: boolean = false; // Specifies whether freehand drawing is in editing mode or not
    private tempFreeHandDrawEditingStyles: StrokeSettings = {strokeColor: null, fillColor: null, strokeWidth: null}; // Restore freehand drawing styles on cancel
    private totalPannedInternalPoint: Point = {x: 0, y: 0}; // To store total panned point internally in rotated state
    private totalPannedClientPoint: Point = {x: 0, y: 0}; // To store total panned point in client coordinates in rotated state
    private currentSelectionPoint: SelectionPoint; // To store current crop selection point (while changing crop selection dynamically)
    private totalPannedPoint: Point = {x: 0, y: 0}; // To store current panned point in non-rotated state
    private isCropTab: boolean = false; // Specifies whether crop tab is selected or not
    private cropZoomFactor: number = 0; // Specifies the zoom factor when crop selection is performed
    private defaultZoomFactor: number = 0; // Specifies the zoom factor when crop selection is not performed
    private fileName: string = ''; // Specifies the file name of the image on initial loading
    private isBrightnessAdjusted: boolean = false; // Specifies whether brightness is adjusted or not, to adjust opacity (combination)
    private isInitialLoading: boolean = false; // Specifies whether image is loaded for the first time or not (for applying initial filter)
    private fileType: FileType; // Specifies the file type of the image on initial loading
    // For Free Hand Drawing
    private freehandDrawObj: FreehandDraw = {lastWidth: 0, lastVelocity: 0, time: 0, pointX: 0, pointY: 0};
    private points: Point[] = [];
    // eslint-disable-next-line
    private pointColl: any = {};
    private pointCounter: number = 0;
    private freehandCounter: number = 0;
    private isFreehandDrawing: boolean = false;
    private tempFreehandCounter: number = 0;
    // Undo Redo
    private tempActObj: SelectionPoint; // For text editing undo redo
    private lastPan: Point = {x: 0, y: 0}; // To store last pan point
    private selectedFreehandColor: string = '#42a5f5';
    private isFreehandDrawCustomized: boolean = false;
    private isShapeInserted: boolean = false;
    private isAllowCropPan: boolean = false;
    private tempPannedPoint: Point = {x: 0, y: 0};
    private cropObj: CroppedObject = {cropZoom: 0, defaultZoom: 0, totalPannedPoint: {x: 0, y: 0}, totalPannedClientPoint: {x: 0, y: 0},
        totalPannedInternalPoint: {x: 0, y: 0}, activeObj: {} as SelectionPoint, rotateFlipColl: [], degree: 0,
        currFlipState: '', destPoints: {startX: 0, startY: 0, width: 0, height: 0} as ActivePoint,
        srcPoints: {startX: 0, startY: 0, width: 0, height: 0} as ActivePoint };
    private afterCropActions: string[] = [];
    private isCancelAction: boolean = false;
    private isFreehandPointMoved: boolean = false;
    private isTouch: boolean = false;
    private freehandDownPoint: Point = {x: 0, y: 0};
    private tempFlipPanPoint: Point = {x: 0, y: 0};
    private currentFreehandDrawIndex: number = 0; // Specifies id for every freehand drawing - uses while deleting
    private tempCurrentFreehandDrawIndex: number = 0; // Specifies id for every freehand drawing - uses while cancelling
    private preventZoomBtn: boolean = false;
    private cancelObjColl: SelectionPoint[] = [];
    private cancelPointColl: Point[] = [];
    private rotatedFlipCropSelection: boolean = false;

    /**
     * Defines class/multiple classes separated by a space for customizing Image Editor UI.
     *
     * @default ''
     ```html
     * <div id='imageeditor'></div>
     * ```
     * ```typescript
     * <script>
     * var imageObj = new ImageEditor({cssClass: 'e-custom-img-editor'});
     * imageObj.appendTo("#imageeditor");
     * </script>
     * ```
     */
    @Property('')
    public cssClass: string;

    /**
     * Specifies whether the Image Editor is disabled.
     *
     * @default false
     */
    @Property(false)
    public disabled: boolean;

    /**
     * Specifies the height of the Image Editor.
     *
     * @default '100%'
     */
    @Property('100%')
    public height: string;

    /**
     * Specifies the theme of the Image Editor. The shape selection appearance will be decided based on this property.
     * The property supports all the built-in themes of Syncfusion.
     * default 'Bootstrap5'
     *
     * @isenumeration true
     * @default Theme.Bootstrap5
     * @asptype Theme
     *
     */
    @Property('Bootstrap5')
    public theme: string | Theme;

    /**
     * Specifies the toolbar items to perform UI interactions. It accepts both string[] and ItemModel[] to configure its toolbar items.
     * If the property is defined as empty collection, the toolbar will not be rendered.
     * Suppose the property is not defined in control, an image editor’s toolbar will be rendered with preconfigured toolbar commands.
     * The preconfigured toolbar commands are
     *  Crop: helps to crop an image as ellipse, square, various ratio aspects, custom selection with resize, drag and drop.
     *  Annotate: help to insert a shape on image that supports rectangle, ellipse, line, text and freehand drawing with resize, drag and drop, and customize its appearance.
     *  Transform: helps to rotate and flip an image.
     *  ZoomIn: performs zoom-in an image.
     *  ZoomOut: performs zoom-out an image.
     *  Pan: performs panning once zoomed an image.
     *  Move: disable the pan action and move to perform other actions such as insert a shape, transform, and more.
     *  Save: save the modified image.
     *  Open: open an image to perform editing.
     *  Reset: reset the modification and restore the original image.
     *
     * @default null
     ```html
     * <div id='imageeditor'></div>
     * ```
     * ```typescript
     * <script>
     * var imageObj = new ImageEditor({
     *     toolbar[Crop, ZoomIn, ZoomOut, Transform, {text: 'Custom'}]
     * });
     * imageObj.appendTo("#imageeditor");
     * </script>
     * ```
     */
    @Property()
    public toolbar: (string | ImageEditorCommands | ItemModel)[];

    /**
     * Specifies template to the Image Editor Toolbar.
     * If you want to customize the entire toolbar in own way by using this property.
     * The property is depending on ‘toolbar’.
     *
     * @default null
     ```html
     * <div id='imageeditor'></div>
     * ```
     * ```typescript
     * <script>
     * var imageObj = new ImageEditor({
     *     toolbarTemplate: '#toolbarTemplate'
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
    public toolbarTemplate: string;

    /**
     * Specifies the width of the Image Editor.
     *
     * @default '100%'
     */
    @Property('100%')
    public width: string;

    /**
     * Specifies whether to perform undo / redo operation.
     *
     * @default false
     * @private
     */
    @Property(false)
    public allowUndoRedo: boolean;

    /**
     * Gets or sets whether to prevent the interaction in signature component.
     * True, if the signature component is read only state where the user interaction is prevented. The default value is false.
     *
     * @default false
     * @private
     */
    @Property(false)
    public isReadOnly: boolean;

    /**
     * Specifies the Signature in RTL mode that displays the content in the right-to-left direction.
     *
     * @default false
     * @private
     */
    @Property(false)
    public enableRtl: boolean;

    /**
     * Gets or sets whether to persist component's state between page reloads.
     * True, if the component's state persistence is enabled. The default value is false.
     * Component's property will be stored in browser local storage to persist component's state when page reloads.
     *
     * @default false
     * @private
     */
    @Property(false)
    public enablePersistence: boolean;

    /**
     * It can be done using the filter property of the canvas.  The following fine tunes can be supported.
     * Brightness: The intensity of the primary colors grows with increased brightness, but the color itself does not change. It can be done by changing brightness and opacity property.
     * Contrast: The contrast of an image refers to the difference between the light pixels and dark pixels. Low contrast images contain either a narrow range of colors while high contrast images have bright highlights and dark shadows. It can be done by changing contrast property.
     * Hue: Hue distinguishes one color from another and is described using common color names such as green, blue, red, yellow, etc. Value refers to the lightness or darkness of a color. It can be controlled by hue-rotate property.
     * Saturation: If saturation increases, colors appear sharper or purer. As saturation decreases, colors appear more washed-out or faded. It can be controlled by saturation and brightness property.
     * Exposure: If exposure increases, intensity of light appears brighter. As exposure decreases, intensity of light decreases. Exposure can be controlled by brightness property.
     * Opacity: The state or quality of being opaque or transparent, not allowing light to pass through the image. Opacity can be controlled by opacity property.
     * Blur : Adjusting the blur can make an image unfocused or unclear. Blur can be controlled by blur property.
     *
     */
    @Complex<FinetuneSettingsModel>({}, FinetuneSettings)
    public finetuneSettings: FinetuneSettingsModel;

    /**
     * Triggers before an image is saved.
     *
     * @event beforeSave
     */
    @Event()
    public beforeSave: EmitType<BeforeSaveEventArgs>;

    /**
     * Triggers once the component rendering is completed.
     *
     * @event created
     */
    @Event()
    public created: EmitType<Event>

    /**
     * Triggers once the component is destroyed with its elements and bound events.
     *
     * @event destroyed
     */
    @Event()
    public destroyed: EmitType<Event>

    /**
     * Triggers while zooming an image.
     *
     * @event zooming
     */
    @Event()
    public zooming: EmitType<ZoomEventArgs>

    /**
     * Triggers while panning an image.
     *
     * @event panning
     */
    @Event()
    public panning: EmitType<PanEventArgs>

    /**
     * Triggers while cropping an image.
     *
     * @event cropping
     */
    @Event()
    public cropping: EmitType<CropEventArgs>

    /**
     * Triggers while rotating an image.
     *
     * @event rotating
     */
    @Event()
    public rotating: EmitType<RotateEventArgs>

    /**
     * Triggers while flipping an image.
     *
     * @event flipping
     */
    @Event()
    public flipping: EmitType<FlipEventArgs>

    /**
     * Triggers while changing shapes in an image.
     *
     * @event shapeChanging
     */
    @Event()
    public shapeChanging: EmitType<ShapeChangeEventArgs>

    /**
     * Triggers once an image is opened.
     *
     * @event fileOpened
     */
    @Event()
    public fileOpened: EmitType<OpenEventArgs>

    /**
     * Triggers once an image is saved.
     *
     * @event saved
     */
    @Event()
    public saved: EmitType<SaveEventArgs>;

    /**
     * Triggers once the toolbar is created.
     *
     * @event toolbarCreated
     */
    @Event()
    public toolbarCreated: EmitType<ToolbarEventArgs>

    /**
     * Triggers while updating/refreshing the toolbar
     *
     * @event toolbarUpdating
     */
    @Event()
    public toolbarUpdating: EmitType<ToolbarEventArgs>

    /**
     * Triggers once the toolbar item is clicked.
     *
     * @event toolbarItemClicked
     */
    @Event()
    public toolbarItemClicked: EmitType<ClickEventArgs>

    /**
     * Triggers when applying filter to an image.
     *
     * @event imageFiltering
     */
    @Event()
    public imageFiltering : EmitType<ImageFilterEventArgs>;

    /**
     * Triggers when applying fine tune to an image.
     *
     * @event finetuneValueChanging
     */
    @Event()
    public finetuneValueChanging: EmitType<FinetuneEventArgs>

    /**
     *
     * Constructor for creating the widget
     *
     * @param  {ImageEditorModel} options - Specifies the image editor model
     * @param  {string|HTMLDivElement} element - Specifies the target element
     */

    constructor(options?: ImageEditorModel, element?: string | HTMLDivElement) {
        super(options, <string | HTMLDivElement>element);
    }

    protected preRender(): void {
        // pre render code snippets
        this.element.id = this.element.id || getUniqueID('ej2-image-editor');
        if (Browser.isDevice) {
            this.element.classList.add('e-device');
        }
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
            Highcontrast: { primaryColor: '#000000', secondaryColor: '#fff' }
        };
        this.defaultLocale = {
            Crop: 'Crop',
            ZoomIn: 'Zoom In',
            ZoomOut: 'Zoom Out',
            Undo: 'Undo',
            Redo: 'Redo',
            Transform: 'Transform',
            Annotation: 'Annotation',
            Finetune: 'Finetune',
            Brightness: 'Brightness',
            Contrast: 'Contrast',
            Hue: 'Hue',
            Saturation: 'Saturation',
            Opacity: 'Opacity',
            Blur: 'Blur',
            Sharpen: 'Sharpen',
            Exposure: 'Exposure',
            Filter: 'Filter',
            Default: 'Default',
            Chrome: 'Chrome',
            Cold: 'Cold',
            Warm: 'Warm',
            Grayscale: 'Grayscale',
            BlackAndWhite: 'Black and White',
            Sepia: 'Sepia',
            Invert: 'Invert',
            Text: 'Add Text',
            Pen: 'Pen',
            Reset: 'Reset',
            Save: 'Save',
            Select: 'Select',
            RotateLeft: 'Rotate Left',
            RotateRight: 'Rotate Right',
            HorizontalFlip: 'Horizontal Flip',
            VerticalFlip: 'Vertical Flip',
            OK: 'OK',
            Cancel: 'Cancel',
            FillColor: 'Fill Color',
            StrokeColor: 'Stroke Color',
            StrokeWidth: 'Stroke Width',
            FontFamily: 'Font Family',
            FontStyle: 'Font Style',
            FontSize: 'Font Size',
            FontColor: 'Font Color',
            Pan: 'Pan',
            Move: 'Move',
            Load: 'Load',
            Custom: 'Custom',
            Square: 'Square',
            Circle: 'Circle',
            Ellipse: 'Ellipse',
            Rectangle: 'Rectangle',
            Line: 'Line',
            Bold: 'Bold',
            Italic: 'Italic',
            BoldItalic: 'Bold Italic',
            XSmall: 'X-Small',
            Small: 'Small',
            Medium: 'Medium',
            Large: 'Large',
            XLarge: 'X-Large',
            ABC: 'ABC',
            Browse: 'Browse'
        };
        this.l10n = new L10n('image-editor', this.defaultLocale, this.locale);
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
     * @param  {ImageEditorModel} newProperties - Specifies new properties
     * @param  {ImageEditorModel} oldProperties - Specifies old properties
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
                    this.updateTheme();
                    this.upperContext.strokeStyle = this.themeColl[this.theme]['primaryColor'];
                    this.upperContext.fillStyle = this.themeColl[this.theme]['secondaryColor'];
                }
                break;
            case 'finetuneSettings':
                if (newProperties.finetuneSettings) {
                    this.finetuneSettings = newProperties.finetuneSettings;
                    this.updateFinetunes();
                }
                break;
            case 'locale':
                if (newProperties.locale) {
                    this.l10n.setLocale(newProperties.locale);
                    this.refreshToolbar('main');
                }
                break;
            case 'allowUndoRedo':
                if (newProperties.allowUndoRedo) {
                    this.allowUndoRedo = true;
                } else {
                    this.allowUndoRedo = false;
                }
                this.refreshToolbar('main');
                break;
            case 'toolbar':
                break;
            case 'toolbarTemplate':
                break;
            }
        }
    }

    public destroy(): void {
        let classList: string[] = [];
        this.element.removeAttribute('tabindex');
        if (this.cssClass) {classList = classList.concat(this.cssClass.replace(/\s+/g, ' ').trim().split(' ') ); }
        removeClass([this.element], classList);
        if (!this.element.getAttribute('class')) {this.element.removeAttribute('class'); }
        this.destroySubComponents(); this.unwireEvent(); super.destroy();
        this.element.innerHTML = '';
        this.trigger('destroyed');
    }

    public initialize(): void {
        this.updateFinetunes(); this.createToolbar(); this.createContextualToolbar(); this.createCanvas(); this.wireEvent();
        this.lowerContext.filter = this.canvasFilter = this.initialAdjustmentValue = this.adjustmentValue = this.getDefaultFilter();
        if (this.cssClass) {addClass([this.element], this.cssClass.replace(/\s+/g, ' ').trim().split(' ') ); }
        if (this.element) {
            createSpinner({
                target: this.element
            });
        }
    }

    private getDefaultFilter(): string {
        return 'brightness(' + 1 + ') ' + 'contrast(' + 100 + '%) ' + 'hue-rotate(' + 0 + 'deg) ' +
        'saturate(' + 100 + '%) ' + 'opacity(' + 1 + ') ' + 'blur(' + 0 + 'px) ' + 'sepia(0%) ' + 'grayscale(0%) ' + 'invert(0%)';
    }

    private updateFinetunes(): void {
        if (this.finetuneSettings) {
            if (this.finetuneSettings.brightness) {
                this.adjustmentLevel.brightness = this.finetuneSettings.brightness.defaultValue;
                this.tempAdjustmentLevel.brightness = this.finetuneSettings.brightness.defaultValue;
            }
            if (this.finetuneSettings.contrast) {
                this.adjustmentLevel.contrast = this.finetuneSettings.contrast.defaultValue;
                this.tempAdjustmentLevel.contrast = this.finetuneSettings.contrast.defaultValue;
            }
            if (this.finetuneSettings.hue) {
                this.adjustmentLevel.hue = this.finetuneSettings.hue.defaultValue;
                this.tempAdjustmentLevel.hue = this.finetuneSettings.hue.defaultValue;
            }
            if (this.finetuneSettings.saturation) {
                this.adjustmentLevel.saturation = this.finetuneSettings.saturation.defaultValue;
                this.tempAdjustmentLevel.saturation = this.finetuneSettings.saturation.defaultValue;
            }
            if (this.finetuneSettings.exposure) {
                this.adjustmentLevel.exposure = this.finetuneSettings.exposure.defaultValue;
                this.tempAdjustmentLevel.exposure = this.finetuneSettings.exposure.defaultValue;
            }
            if (this.finetuneSettings.opacity) {
                this.adjustmentLevel.opacity = this.finetuneSettings.opacity.defaultValue;
                this.tempAdjustmentLevel.opacity = this.finetuneSettings.opacity.defaultValue;
            }
            if (this.finetuneSettings.blur) {
                this.adjustmentLevel.blur = this.finetuneSettings.blur.defaultValue;
                this.tempAdjustmentLevel.blur = this.finetuneSettings.blur.defaultValue;
            }
            this.isInitialLoading = true;
        }
    }

    private initializeFilter(): void {
        this.setBrightness(this.adjustmentLevel.brightness);
        this.setContrast(this.adjustmentLevel.contrast);
        this.setHue(this.adjustmentLevel.hue);
        this.setSaturation(this.adjustmentLevel.saturation);
        this.setExposure(this.adjustmentLevel.exposure);
        this.setOpacity(this.adjustmentLevel.opacity);
        this.setBlur(this.adjustmentLevel.blur);
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
        EventHandler.add(this.upperCanvas, 'dblclick', this.findTextPoint, this);
        EventHandler.add(this.textArea, 'mousedown', this.findTextPoint, this);
        EventHandler.add(this.lowerCanvas, 'mousewheel DOMMouseScroll', this.handleScroll, this);
        EventHandler.add(this.upperCanvas, 'mousewheel DOMMouseScroll', this.handleScroll, this);
        window.addEventListener('resize', this.windowResizeHandler.bind(this));
        if ((!Browser.isIos && Browser.info.name !== 'safari')) {
            screen.orientation.addEventListener('change', this.screenOrientation.bind(this));
        }
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
    }

    private destroySubComponents(): void {
        const inputElement: NodeListOf<HTMLElement> = this.element.querySelectorAll('input.e-control') as NodeListOf<HTMLElement>;
        const btnElement: NodeListOf<HTMLElement> = this.element.querySelectorAll('button.e-control');
        for (let i: number = 0, len: number = inputElement.length; i < len; i++) {
            if (inputElement[i as number].classList.contains('e-color-picker')) {
                (getComponent(inputElement[i as number], 'color-picker') as ColorPicker).destroy();
                detach(select('input#' + inputElement[i as number].id, this.element));
            }
        }
        for (let i: number = 0, len: number = btnElement.length; i < len; i++) {
            if (btnElement[i as number].classList.contains('e-dropdown-btn')) {
                (getComponent(btnElement[i as number], 'dropdown-btn') as DropDownButton).destroy();
                detach(select('button#' + btnElement[i as number].id, this.element));
            } else if (btnElement[i as number].classList.contains('e-btn')) {
                (getComponent(btnElement[i as number], 'btn') as Button).destroy();
                detach(select('button#' + btnElement[i as number].id, this.element));
            }
        }
    }

    private updateTheme(): void {
        if (this.theme !== '') {
            this.theme = this.toPascalCase(this.theme);
        }
    }

    private toPascalCase(str: string): string {
        let strArr: string[] = [];
        if (!isNullOrUndefined(str)) {
            strArr = str.toLowerCase().split('-')
        }
        for (let i: number = 0; i < strArr.length; i++) {
            strArr[i as number] = strArr[i as number].charAt(0).toUpperCase() + strArr[i as number].slice(1);
        }
        return strArr.join('');
    }

    private createCanvas(): void {
        this.element.style.boxSizing = 'border-box';
        const height: number = this.toolbarHeight;
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
        this.textArea.setAttribute('spellcheck', 'false');
        this.lowerCanvas.style.width = this.upperCanvas.style.width = this.inMemoryCanvas.style.width = '100%';
        this.lowerCanvas.style.height = this.upperCanvas.style.height = this.inMemoryCanvas.style.height = '100%';
        this.upperCanvas.style.position = this.lowerCanvas.style.position = this.textArea.style.position = 'absolute';
        this.textArea.style.backgroundColor = 'transparent'; this.textArea.style.display = 'none';
        this.textArea.style.resize = 'none';
        this.lowerContext = this.lowerCanvas.getContext('2d');
        this.baseImg = this.createElement('img', {
            id: this.element.id + '_orgImg', attrs: { name: 'Image', crossorigin: 'anonymous' }
        });
        this.upperCanvas.style.cursor = 'default';
        this.upperCanvas.style.display = 'none';
        this.upperContext = this.upperCanvas.getContext('2d');
        this.inMemoryContext = this.inMemoryCanvas.getContext('2d');
    }

    private createToolbar(): void {
        if (isNullOrUndefined(this.toolbar) || (!isNullOrUndefined(this.toolbar) && this.toolbar.length > 0)) {
            this.element.appendChild(this.createElement('div', {
                id: this.element.id + '_toolbarArea', className: 'e-toolbar-area'
            }));
            if (this.toolbarTemplate) {
                this.toolbarTemplateFn();
            } else {
                const toolbarItems: ItemModel = { cssClass: 'e-image-upload', align: 'Left', type: 'Input',
                    tooltipText: this.l10n.getConstant('Browse'), template: new Uploader({allowedExtensions: '.jpg, .jpeg, .png,.svg'}) };
                if (isNullOrUndefined(this.defToolbarItems)) {
                    this.defToolbarItems = [];
                }
                this.defToolbarItems.push(toolbarItems);
                const toolbarArea: HTMLElement = document.getElementById(this.element.id + '_toolbarArea');
                const toolbar: HTMLElement = this.createElement('div', {
                    id: this.element.id + '_toolbar'
                });
                toolbarArea.appendChild(toolbar);
                const uploadItems: ItemModel[] = [
                    {
                        cssClass: 'e-image-upload',
                        align: 'Left', type: 'Input',
                        tooltipText: this.l10n.getConstant('Browse'),
                        template: new Uploader({
                            allowedExtensions: '.jpg, .jpeg, .png,.svg',
                            selected: () => {
                                if (Browser.isDevice) {
                                    if (this.defToolbarItems.length > 0 &&
                                        (!isNullOrUndefined(document.getElementById(this.element.id + '_toolbar')))) {
                                        (getComponent(document.getElementById(this.element.id + '_toolbar'), 'toolbar') as Toolbar).destroy();
                                    }
                                    if (!isNullOrUndefined(document.getElementById(this.element.id + '_bottomToolbar'))) {
                                        (getComponent(document.getElementById(this.element.id + '_bottomToolbar'), 'toolbar') as Toolbar).destroy();
                                    }
                                    this.initToolbarItem(false, Browser.isDevice, null);
                                    this.createBottomToolbar();
                                } else {
                                    if (this.defToolbarItems.length > 0 &&
                                        (!isNullOrUndefined(document.getElementById(this.element.id + '_toolbar')))) {
                                        (getComponent(document.getElementById(this.element.id + '_toolbar'), 'toolbar') as Toolbar).destroy();
                                    }
                                    this.initToolbarItem(false, false, null);
                                }
                            }
                        })
                    }
                ];
                new Toolbar({ items: uploadItems, width: '100%',
                    created: () => {
                        this.trigger('toolbarCreated', {toolbarType: 'main'});
                    },
                    clicked: this.defToolbarClicked.bind(this)}, '#' + this.element.id + '_toolbar');
                this.createLeftToolbarControls();
            }
            if (!isNullOrUndefined(document.getElementById(this.element.id + '_toolbar'))) {
                this.toolbarHeight = document.getElementById(this.element.id + '_toolbar').clientHeight;
            }
        } else {
            this.toolbarHeight = 0;
        }
    }

    private createContextualToolbar(): void {
        if (isNullOrUndefined(this.toolbar) || (!isNullOrUndefined(this.toolbar) && this.toolbar.length > 0)) {
            this.element.appendChild(this.createElement('div', { id: this.element.id + '_contextualToolbarArea',
                className: 'e-contextual-toolbar-wrapper e-hide', attrs: { style: 'position: absolute;' }
            }));
            const toolbarArea: HTMLElement = document.getElementById(this.element.id + '_contextualToolbarArea');
            const toolbar: HTMLElement = this.createElement('div', { id: this.element.id + '_contextualToolbar' });
            toolbarArea.appendChild(toolbar);
        }
    }

    private updateContextualToolbar(type: string, cType?: string): void {
        if (this.toolbarTemplate ) {
            this.toolbarTemplateFn();
        } else {
            const toolbarArea: Element = this.element.querySelector('#' + this.element.id + '_toolbarArea');
            const contextualToolbarArea: Element = this.element.querySelector('#' + this.element.id + '_contextualToolbarArea');
            contextualToolbarArea.classList.remove('e-hide');
            (contextualToolbarArea as HTMLElement).style.left = (toolbarArea as HTMLElement).offsetLeft + 'px';
            if (type === 'filter') {
                if (document.getElementById(this.element.id + '_toolbar') && this.defToolbarItems.length > 0) {
                    (getComponent(document.getElementById(this.element.id + '_toolbar'), 'toolbar') as Toolbar).destroy();
                }
                if (Browser.isDevice) {
                    this.initToolbarItem(false, true, true);
                } else {
                    this.initToolbarItem(true, null, null);
                }
                this.refreshSlider();
                this.initFilterToolbarItem();
            } else {
                if (document.querySelector('#' + this.element.id + '_contextualToolbar').classList.contains('e-control')) {
                    (getComponent(document.getElementById(this.element.id + '_contextualToolbar'), 'toolbar') as Toolbar).destroy();
                }
                this.refreshSlider();
                this.renderSlider(cType);
            }
            if (Browser.isDevice) {
                const cHt: number = (contextualToolbarArea as HTMLElement).offsetHeight;
                const ht: number = (this.element.querySelector('#' + this.element.id + '_canvasWrapper') as HTMLElement).offsetHeight;
                (contextualToolbarArea as HTMLElement).style.top = this.toolbarHeight + ht - cHt + 'px';
            } else {
                (contextualToolbarArea as HTMLElement).style.top = this.toolbarHeight + 'px';
            }
        }
    }

    private createBottomToolbar(): void {
        if (isNullOrUndefined(this.toolbar) || (!isNullOrUndefined(this.toolbar) && this.toolbar.length > 0)) {
            this.element.appendChild(this.createElement('div', {
                id: this.element.id + '_bottomToolbarArea', className: 'e-bottom-toolbar'
            }));
            if (!this.toolbarTemplate) {
                document.getElementById(this.element.id + '_canvasWrapper').style.height = (this.element.offsetHeight
                - this.toolbarHeight * 2) - 3 + 'px';
                const toolbarArea: HTMLElement = document.getElementById(this.element.id + '_bottomToolbarArea');
                const toolbarElem: HTMLElement = this.createElement('div', {
                    id: this.element.id + '_bottomToolbar'
                });
                toolbarArea.appendChild(toolbarElem);
            }
            this.initBottomToolbar();
        }
    }

    private initBottomToolbar(): void {
        if (isNullOrUndefined(this.toolbar) || (!isNullOrUndefined(this.toolbar) && this.toolbar.length > 0)) {
            if (this.toolbarTemplate) {
                this.toolbarTemplateFn();
            } else {
                const items: ItemModel[] = this.getMainToolbarItem();
                new Toolbar({ items: items, width: '100%',
                    created: () => {
                        this.renderAnnotationBtn();
                        this.renderCropBtn();
                        this.renderTransformBtn();
                        this.trigger('toolbarCreated', {toolbarType: 'main'});
                    },
                    clicked: this.defToolbarClicked.bind(this)
                }, '#' + this.element.id + '_bottomToolbar');
                if (this.defToolbarItems.length > 0 && (!isNullOrUndefined(document.getElementById(this.element.id + '_bottomToolbar')))) {
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    const toolbar: any = getComponent(this.element.id + '_bottomToolbar', 'toolbar') as Toolbar;
                    toolbar.refreshOverflow();
                }
            }
        }
    }

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
            this.renderReactTemplates();
        }
    }

    private templateParser(template: string): Function {
        if (template) {
            try {
                if (document.querySelectorAll(template).length) {
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

    private getLeftToolbarItem(isOkBtn?: boolean): ItemModel[] {
        const toolbarItems: ItemModel[] = [];
        if (!isOkBtn) {
            toolbarItems.push({ cssClass: 'e-image-upload', align: 'Left', type: 'Input', template: new Uploader({allowedExtensions: '.jpg, .jpeg, .png,.svg'}) });
            toolbarItems.push({ visible: false, cssClass: 'e-image-position e-btn e-flat', tooltipText: this.l10n.getConstant('Browse'), align: 'Left' });
        }
        if (this.allowUndoRedo) {
            if (isNullOrUndefined(this.toolbar) || (!isNullOrUndefined(this.toolbar) && this.toolbar.indexOf('Undo') > -1)) {
                toolbarItems.push({ id: this.element.id + '_undo', prefixIcon: 'e-icons e-undo', cssClass: 'top-icon e-undo',
                    tooltipText: this.l10n.getConstant('Undo'), align: 'Left' });
            }
            if (isNullOrUndefined(this.toolbar) || (!isNullOrUndefined(this.toolbar) && this.toolbar.indexOf('Redo') > -1)) {
                toolbarItems.push({ id: this.element.id + '_redo', prefixIcon: 'e-icons e-redo', cssClass: 'top-icon e-redo',
                    tooltipText: this.l10n.getConstant('Redo'), align: 'Left' });
            }
        }
        if (!this.preventZoomBtn) {
            if (isNullOrUndefined(this.toolbar) || (!isNullOrUndefined(this.toolbar) && this.toolbar.indexOf('ZoomOut') > -1)) {
                toolbarItems.push({ id: this.element.id + '_zoomOut', prefixIcon: 'e-icons e-zoom-out', cssClass: 'top-icon e-dec-zoom',
                    tooltipText: this.l10n.getConstant('ZoomOut'), align: 'Left' });
            }
            if (isNullOrUndefined(this.toolbar) || (!isNullOrUndefined(this.toolbar) && this.toolbar.indexOf('ZoomIn') > -1)) {
                toolbarItems.push({ id: this.element.id + '_zoomIn', prefixIcon: 'e-icons e-zoom-in', cssClass: 'top-icon e-inc-zoom',
                    tooltipText: this.l10n.getConstant('ZoomIn'), align: 'Left' });
            }
        }
        const tempToolbarItems: ItemModel[] = this.processToolbar('left');
        for (let i: number = 0, len: number = tempToolbarItems.length; i < len; i++) {
            toolbarItems.push(tempToolbarItems[i as number]);
        }
        return toolbarItems;
    }

    private getRightToolbarItem(isOkBtn?: boolean): ItemModel[] {
        const toolbarItems: ItemModel[] = [];
        if (isOkBtn) {
            toolbarItems.push({ id: this.element.id + '_ok', prefixIcon: 'e-icons e-check', cssClass: 'top-icon e-tick',
                tooltipText: this.l10n.getConstant('OK'), align: 'Right' });
            toolbarItems.push({ id: this.element.id + '_cancel', prefixIcon: 'e-icons e-close', cssClass: 'top-icon e-save',
                tooltipText: this.l10n.getConstant('Cancel'), align: 'Right' });
        }
        if (isNullOrUndefined(this.toolbar) || (!isNullOrUndefined(this.toolbar) && this.toolbar.indexOf('Reset') > -1)) {
            toolbarItems.push({ id: this.element.id + '_reset', prefixIcon: 'e-icons e-btn-reset', cssClass: 'top-icon e-img-reset',
                tooltipText: this.l10n.getConstant('Reset'), align: 'Right' });
        }
        if (!isOkBtn) {
            if (isNullOrUndefined(this.toolbar) || (!isNullOrUndefined(this.toolbar) && this.toolbar.indexOf('Save') > -1)) {
                toolbarItems.push({ id: this.element.id + '_save', prefixIcon: 'e-icons e-btn-save', cssClass: 'top-icon e-save',
                    tooltipText: this.l10n.getConstant('Save'), align: 'Right', template:
                    '<button id="' + this.element.id + '_saveBtn"></button>' });
            }
        }
        const tempToolbarItems: ItemModel[] = this.processToolbar('right');
        for (let i: number = 0, len: number = tempToolbarItems.length; i < len; i++) {
            toolbarItems.push(tempToolbarItems[i as number]);
        }
        return toolbarItems;
    }

    private getMainToolbarItem(isApplyOption?: boolean): ItemModel[] {
        const toolbarItems: ItemModel[] = [];
        if (isNullOrUndefined(this.toolbar) || (!isNullOrUndefined(this.toolbar) && this.toolbar.indexOf('Crop') > -1)) {
            toolbarItems.push({ id: this.element.id + '_crop', tooltipText: this.l10n.getConstant('Crop'), align: 'Center',
                template: '<button id="' + this.element.id + '_cropBtn"></button>'
            });
        }
        if (isNullOrUndefined(this.toolbar) || (!isNullOrUndefined(this.toolbar) && this.toolbar.indexOf('Annotate') > -1)) {
            toolbarItems.push({ id: this.element.id + '_annotation', tooltipText: this.l10n.getConstant('Annotation'), align: 'Center',
                template: '<button id="' + this.element.id + '_annotationBtn"></button>' });
        }
        if (isNullOrUndefined(this.toolbar) || (!isNullOrUndefined(this.toolbar) && this.toolbar.indexOf('Transform') > -1)) {
            toolbarItems.push({ id: this.element.id + '_transform', tooltipText: this.l10n.getConstant('Transform'), align: 'Center',
                template: '<button id="' + this.element.id + '_transformBtn"></button>'
            });
        }
        if (isNullOrUndefined(this.toolbar) || (!isNullOrUndefined(this.toolbar) && this.toolbar.indexOf('Finetune') > -1)) {
            toolbarItems.push({ id: this.element.id + '_adjustment', prefixIcon: 'e-icons e-adjustment', cssClass: 'top-icon e-adjustment',
                tooltipText: this.l10n.getConstant('Finetune'), align: 'Center' });
        }
        if (isNullOrUndefined(this.toolbar) || (!isNullOrUndefined(this.toolbar) && this.toolbar.indexOf('Filter') > -1)) {
            toolbarItems.push({ id: this.element.id + '_filter', prefixIcon: 'e-icons e-filters', cssClass: 'top-icon e-filters',
                tooltipText: this.l10n.getConstant('Filter'), align: 'Center' });
        }
        const tempToolbarItems: ItemModel[] = this.processToolbar('center');
        for (let i: number = 0, len: number = tempToolbarItems.length; i < len; i++) {
            toolbarItems.push(tempToolbarItems[i as number]);
        }
        if (isApplyOption) {
            toolbarItems.push({ id: this.element.id + '_ok', prefixIcon: 'e-icons e-check', cssClass: 'top-icon e-tick',
                tooltipText: this.l10n.getConstant('OK'), align: 'Right' });
            toolbarItems.push({ id: this.element.id + '_cancel', prefixIcon: 'e-icons e-close', cssClass: 'top-icon e-save',
                tooltipText: this.l10n.getConstant('Cancel'), align: 'Right' });
        }
        return toolbarItems;
    }

    private getZoomToolbarItem(): ItemModel[] {
        const toolbarItems: ItemModel[] = [];
        return toolbarItems;
    }

    private processToolbar(position: string): ItemModel[] {
        const toolbarItems: ItemModel[] = [];
        if (this.toolbar) {
            for (let i: number = 0, len: number = this.toolbar.length; i < len; i++) {
                if (typeof(this.toolbar[i as number]) === 'object') {
                    if (isNullOrUndefined((this.toolbar[i as number] as ItemModel).align)) {
                        if (position === 'left') {
                            toolbarItems.push(this.toolbar[i as number] as ItemModel);
                        }
                    } else if ((this.toolbar[i as number] as ItemModel).align.toLowerCase() === position) {
                        toolbarItems.push(this.toolbar[i as number] as ItemModel);
                    }
                }
            }
        }
        return toolbarItems;
    }

    private processSubToolbar(items: (string | ItemModel)[]): ItemModel[] {
        const toolbarItems: ItemModel[] = [];
        if (items) {
            for (let i: number = 0, len: number = items.length; i < len; i++) {
                if (typeof(items[i as number]) === 'object') {
                    (items[i as number] as ItemModel).align = 'Center';
                    toolbarItems.push(items[i as number] as ItemModel);
                }
            }
        }
        return toolbarItems;
    }

    private isToolbar(): boolean {
        return (isNullOrUndefined(this.toolbar) || (!isNullOrUndefined(this.toolbar) && this.toolbar.length > 0)
        || !isNullOrUndefined(this.toolbarTemplate));
    }

    private initToolbarItem(isApplyOption?: boolean, isDevice?: boolean, isOkBtn?: boolean): void {
        if (this.isToolbar()) {
            const leftItem: ItemModel[] = this.getLeftToolbarItem(isOkBtn);
            const rightItem: ItemModel[] = this.getRightToolbarItem(isOkBtn);
            const mainItem: ItemModel[] = this.getMainToolbarItem(isApplyOption);
            const zoomItem: ItemModel[] = this.getZoomToolbarItem();
            if (isDevice) {
                this.defToolbarItems = [...leftItem, ...rightItem];
            } else {
                this.defToolbarItems = [...leftItem, ...mainItem, ...rightItem, ...zoomItem];
            }
            new Toolbar({
                width: '100%',
                items: this.defToolbarItems,
                clicked: this.defToolbarClicked.bind(this),
                created: () => {
                    if (!isDevice) {
                        this.renderAnnotationBtn();
                        this.renderCropBtn();
                        this.renderTransformBtn();
                    }
                    this.renderSaveBtn();
                    this.trigger('toolbarCreated', {toolbarType: 'main'});
                }
            }, '#' + this.element.id + '_toolbar');
            this.createLeftToolbarControls();
            this.enableDisableToolbarBtn();
            if (this.isToolbar() && (!isNullOrUndefined(document.getElementById(this.element.id + '_toolbar')))) {
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                const toolbar: any = getComponent(this.element.id + '_toolbar', 'toolbar') as Toolbar;
                toolbar.refreshOverflow();
            }
        }
    }

    private enableDisableToolbarBtn(): void {
        const undo: HTMLElement = document.querySelector('#' + this.element.id + '_undo');
        if (!isNullOrUndefined(undo) && this.undoRedoStep === 0) {
            undo.classList.add('e-disabled');
            undo.parentElement.classList.add('e-overlay');
        } else if (!isNullOrUndefined(undo)) {
            undo.classList.remove('e-disabled');
            undo.parentElement.classList.remove('e-overlay');
        }
        const redo: HTMLElement = document.querySelector('#' + this.element.id + '_redo');
        if (!isNullOrUndefined(redo) && (this.undoRedoStep === this.undoRedoColl.length)) {
            redo.classList.add('e-disabled');
            redo.parentElement.classList.add('e-overlay');
        } else if (!isNullOrUndefined(redo) && (this.undoRedoStep === 0 && this.undoRedoColl.length > 0 )) {
            redo.classList.remove('e-disabled');
            redo.parentElement.classList.remove('e-overlay');
        } else if (!isNullOrUndefined(redo)) {
            redo.classList.remove('e-disabled');
            redo.parentElement.classList.remove('e-overlay');
        }
        const zoomIn: HTMLElement = document.querySelector('#' + this.element.id + '_zoomIn');
        if (!isNullOrUndefined(zoomIn) && this.zoomFactor >= 5) {
            zoomIn.classList.add('e-disabled');
            zoomIn.parentElement.classList.add('e-overlay');
        } else if (!isNullOrUndefined(zoomIn)) {
            zoomIn.classList.remove('e-disabled');
            zoomIn.parentElement.classList.remove('e-overlay');
        }
        const zoomOut: HTMLElement = document.querySelector('#' + this.element.id + '_zoomOut');
        if (!isNullOrUndefined(zoomOut) && this.zoomFactor === 0) {
            zoomOut.classList.add('e-disabled');
            zoomOut.parentElement.classList.add('e-overlay');
        } else if (!isNullOrUndefined(zoomOut)) {
            zoomOut.classList.remove('e-disabled');
            zoomOut.parentElement.classList.remove('e-overlay');
        }
        const pan: HTMLElement = document.querySelector('#' + this.element.id + '_pan');
        if (!isNullOrUndefined(pan) && this.zoomFactor === 0) {
            pan.style.display = 'none';
        } else if (!isNullOrUndefined(pan)) {
            pan.style.display = 'block';
        }
    }

    private createLeftToolbarControls(): void {
        if (this.defToolbarItems !== undefined && this.defToolbarItems.length > 0 &&
            (!isNullOrUndefined(document.getElementById(this.element.id + '_toolbar')))) {
            const uploadDiv: HTMLElement = document.getElementById(this.element.id + '_toolbar')
                .querySelector('.e-image-upload');
            if (uploadDiv) {
                const uploadElem: HTMLInputElement = uploadDiv.getElementsByTagName('input')[0];
                const uploadBtnElem: HTMLElement = uploadDiv.getElementsByTagName('button')[0];
                uploadBtnElem.className = 'e-tbar-btn e-tbtn-txt e-btn top-icon';
                uploadBtnElem.innerHTML = '';
                uploadBtnElem.appendChild(this.createElement('span', {
                    className: 'e-btn-icon e-icons e-upload-icon e-icon-left'
                }));
                uploadElem.onchange = this.fileSelect.bind(this, uploadElem);
            }
        }
    }

    private cropSelectedState(): void {
        if (!isNullOrUndefined(this.activeObj.shape) && this.activeObj.shape.split('-')[0] === 'crop') {
            this.okBtn();
        }
    }

    private renderAnnotationBtn(): void {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const proxy: ImageEditor = this;
        const items: DropDownButtonItemModel[] = [];
        if (isNullOrUndefined(this.toolbar) || (!isNullOrUndefined(this.toolbar) && this.toolbar.indexOf('Pen') > -1)) {
            items.push({ text: this.l10n.getConstant('Pen'), id: 'pen', iconCss: 'e-icons e-free-pen' });
        }
        if (isNullOrUndefined(this.toolbar) || (!isNullOrUndefined(this.toolbar) && this.toolbar.indexOf('Line') > -1)) {
            items.push({ text: this.l10n.getConstant('Line'), id: 'line', iconCss: 'e-icons e-line' });
        }
        if (isNullOrUndefined(this.toolbar) || (!isNullOrUndefined(this.toolbar) && this.toolbar.indexOf('Rectangle') > -1)) {
            items.push({ text: this.l10n.getConstant('Rectangle'), id: 'rectangle', iconCss: 'e-icons e-rectangle' });
        }
        if (isNullOrUndefined(this.toolbar) || (!isNullOrUndefined(this.toolbar) && this.toolbar.indexOf('Ellipse') > -1)) {
            items.push({ text: this.l10n.getConstant('Ellipse'), id: 'ellipse', iconCss: 'e-icons e-circle' });
        }
        if (isNullOrUndefined(this.toolbar) || (!isNullOrUndefined(this.toolbar) && this.toolbar.indexOf('Text') > -1)) {
            items.push({ text: this.l10n.getConstant('Text'), id: 'text', iconCss: 'e-icons e-add-text' });
        }
        const drpDownBtn: DropDownButton = new DropDownButton({ items: items, iconCss: 'e-icons e-annotation',
            cssClass: 'e-image-popup',
            open: (args: OpenCloseMenuEventArgs) => {
                if (this.currObjType.isUndoAction) { this.refreshUndoRedoColl(); }
                if (Browser.isDevice) {
                    args.element.parentElement.style.top = drpDownBtn.element.getBoundingClientRect().top -
                    args.element.parentElement.offsetHeight + 'px';
                }
            },
            select: (args: MenuEventArgs) => {
                this.cropSelectedState();
                let isCropSelection: boolean = false;
                let splitWords: string[];
                if (this.activeObj.shape !== undefined) {splitWords = this.activeObj.shape.split('-'); }
                if (splitWords === undefined && this.currObjType.isCustomCrop) {
                    isCropSelection = true;
                } else if (splitWords !== undefined && splitWords[0] === 'crop'){
                    isCropSelection = true;
                }
                this.currObjType.isCustomCrop = false;
                if (isCropSelection || this.togglePan) {
                    this.refreshActiveObj();
                    this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
                    this.refreshToolbar('main');
                }
                switch (args.item.id) {
                case 'pen':
                    proxy.tempFreehandCounter = proxy.freehandCounter;
                    proxy.tempCurrentFreehandDrawIndex = proxy.currentFreehandDrawIndex;
                    proxy.currentToolbar = 'pen';
                    this.freeHandDraw(true);
                    break;
                case 'text':
                    proxy.currentToolbar = 'text';
                    this.drawShapeText();
                    break;
                default:
                    proxy.currentToolbar = 'shapes';
                    proxy.drawShape((args.item.id).toLowerCase());
                    break;
                }
                this.updateToolbarItems();
            }
        });
        // Render initialized DropDownButton.
        drpDownBtn.appendTo('#' + this.element.id + '_annotationBtn');
    }

    private renderCropBtn(): void {
        const items: DropDownButtonItemModel[] = [];
        if (isNullOrUndefined(this.toolbar) || (!isNullOrUndefined(this.toolbar) && this.toolbar.indexOf('CustomSelection') > -1)) {
            items.push({ text: this.l10n.getConstant('Custom'), id: 'custom', iconCss: 'e-icons e-custom' });
        }
        if (isNullOrUndefined(this.toolbar) || (!isNullOrUndefined(this.toolbar) && this.toolbar.indexOf('CircleSelection') > -1)) {
            items.push({ text: this.l10n.getConstant('Circle'), id: 'circle', iconCss: 'e-icons e-circle' });
        }
        if (isNullOrUndefined(this.toolbar) || (!isNullOrUndefined(this.toolbar) && this.toolbar.indexOf('SquareSelection') > -1)) {
            items.push({ text: this.l10n.getConstant('Square'), id: 'square', iconCss: 'e-icons e-square' });
        }
        if (isNullOrUndefined(this.toolbar) || (!isNullOrUndefined(this.toolbar) && this.toolbar.indexOf('RatioSelection') > -1)) {
            items.push({ text: '3:2', id: '3:2', iconCss: 'e-icons e-custom-a' });
            items.push({ text: '4:3', id: '4:3', iconCss: 'e-icons e-custom-b' });
            items.push({ text: '5:4', id: '5:4', iconCss: 'e-icons e-custom-c' });
            items.push({ text: '7:5', id: '7:5', iconCss: 'e-icons e-custom-d' });
            items.push({ text: '16:9', id: '16:9', iconCss: 'e-icons e-custom-e' });
        }
        const drpDownBtn: DropDownButton = new DropDownButton({
            open: (args: OpenCloseMenuEventArgs) => {
                if (this.currObjType.isUndoAction) { this.refreshUndoRedoColl(); }
                if (this.togglePan) {
                    this.cancelPan();
                }
                if (Browser.isDevice) {
                    args.element.parentElement.style.top = drpDownBtn.element.getBoundingClientRect().top -
                    args.element.parentElement.offsetHeight + 'px';
                }
                if (!isNullOrUndefined(this.activeObj.shape) && this.activeObj.shape.split('-').length > 1) {
                    document.getElementById(this.activeObj.shape.split('-')[1]).classList.add('e-selected');
                }
            },
            items: items, select: this.cropSelect.bind(this),
            iconCss: 'e-icons e-select', cssClass: 'e-image-popup'
        });
        drpDownBtn.appendTo('#' + this.element.id + '_cropBtn');
    }

    private renderTransformBtn(): void {
        const items: DropDownButtonItemModel[] = [];
        if (isNullOrUndefined(this.toolbar) || (!isNullOrUndefined(this.toolbar) && this.toolbar.indexOf('RotateLeft') > -1)) {
            items.push({ text: this.l10n.getConstant('RotateLeft'), id: 'rotateleft', iconCss: 'e-icons e-anti-clock-wise' });
        }
        if (isNullOrUndefined(this.toolbar) || (!isNullOrUndefined(this.toolbar) && this.toolbar.indexOf('RotateRight') > -1)) {
            items.push({ text: this.l10n.getConstant('RotateRight'), id: 'rotateright', iconCss: 'e-icons e-clock-wise' });
        }
        if (isNullOrUndefined(this.toolbar) || (!isNullOrUndefined(this.toolbar) && this.toolbar.indexOf('FlipHorizontal') > -1)) {
            items.push({ text: this.l10n.getConstant('HorizontalFlip'), id: 'horizontalflip', iconCss: 'e-icons e-horizontal-flip' });
        }
        if (isNullOrUndefined(this.toolbar) || (!isNullOrUndefined(this.toolbar) && this.toolbar.indexOf('FlipVertical') > -1)) {
            items.push({ text: this.l10n.getConstant('VerticalFlip'), id: 'verticalflip', iconCss: 'e-icons e-vertical-flip' });
        }
        const drpDownBtn: DropDownButton = new DropDownButton({
            open: (args: OpenCloseMenuEventArgs) => {
                if (this.currObjType.isUndoAction) { this.refreshUndoRedoColl(); }
                if (Browser.isDevice) {
                    const ht: number = args.element.parentElement.offsetHeight;
                    args.element.parentElement.style.display = 'none';
                    args.element.parentElement.style.top = drpDownBtn.element.getBoundingClientRect().top -
                    ht + 'px';
                    args.element.parentElement.style.display = 'block';
                }
            },
            items: items, select: this.transformSelect.bind(this),
            iconCss: 'e-icons e-transform', cssClass: 'e-image-popup'
        });
        drpDownBtn.appendTo('#' + this.element.id + '_transformBtn');
    }

    private renderSaveBtn(): void {
        const imageEditorObj: ImageEditor = getInstance(document.getElementById(this.element.id), ImageEditor) as ImageEditor;
        const saveItems: DropDownButtonItemModel[] = [
            { text: 'JPEG', id: 'jpeg' },
            { text: 'PNG', id: 'png' },
            { text: 'SVG', id: 'svg' }
        ];
        const ddbElem: Element = document.getElementById(this.element.id + '_saveBtn');
        if (ddbElem) {
            // Initialize the DropDownButton component.
            const saveDrpDownBtn: DropDownButton = new DropDownButton({ items: saveItems, cssClass: 'e-caret-hide e-image-popup', iconCss: 'e-icons e-save',
                select: (args: MenuEventArgs) => {
                    imageEditorObj.export(args.item.text);
                }
            });
            saveDrpDownBtn.appendTo('#' + this.element.id + '_saveBtn');
        }
    }

    private cropSelect(args: MenuEventArgs): void {
        this.isCropTab = true;
        this.zoomFactor = this.cropZoomFactor;
        const activeObj: SelectionPoint = this.activeObj;
        const text: string = args.item.id;
        this.currentToolbar = 'crop';
        this.currSelectionPoint = null;
        this.select(text);
        this.refreshToolbar('main', true, true);
        this.refreshDropDownBtn(true);
        this.undoRedoColl.push({operation: 'selectionTransform', value: null,
            currentObj: extend([], this.objColl, [], true) as SelectionPoint[],
            previousObj: extend([], this.objColl, [], true) as SelectionPoint[],
            previousSelectionObj: extend({}, activeObj, {}, true) as SelectionPoint,
            currentSelectionObj: extend({}, this.activeObj, {}, true) as SelectionPoint,
            zoomFactor: this.zoomFactor, sharpen: this.adjustmentLevel.sharpen, bw: this.adjustmentLevel.bw});
        this.undoRedoStep++;
        this.enableDisableToolbarBtn();
    }

    private transformSelect(args: MenuEventArgs): void {
        this.cropSelectedState();
        this.currentSelectionPoint = null;
        this.performTransformation(args.item.id);
        this.afterCropActions.push(args.item.id);
    }

    private performTransformation(text: string): void {
        const tempZoomFactor: number = this.defaultZoomFactor;
        const isUndoRedo: boolean = this.isUndoRedo;
        if (this.defaultZoomFactor !== 0) {
            this.isUndoRedo = true;
            if (this.defaultZoomFactor > 0) {
                this.zoom(-this.defaultZoomFactor);
            } else {
                this.zoom(Math.abs(this.defaultZoomFactor));
            }
            this.isUndoRedo = isUndoRedo;
        }
        this.updateTransform(text);
        if (tempZoomFactor !== 0) {
            this.isUndoRedo = true;
            this.zoom(tempZoomFactor);
            this.isUndoRedo = isUndoRedo;
        }
    }

    private updateTransform(text: string): void {
        switch (text) {
        case 'rotateleft':
            this.rotate(-90);
            break;
        case 'rotateright':
            this.rotate(90);
            break;
        case 'horizontalflip':
            this.flip('Horizontal');
            break;
        case 'verticalflip':
            this.flip('Vertical');
            break;
        }
    }

    private getShapesToolbarItem(items: (string | ItemModel)[]): ItemModel[] {
        const toolbarItems: ItemModel[] = [];
        if (items.indexOf('fillColor') > -1) {
            toolbarItems.push({ prefixIcon: 'e-icons e-copy', id: this.element.id + '_fillcolor',
                cssClass: 'top-icon e-fill', tooltipText: this.l10n.getConstant('FillColor'), align: 'Center', type: 'Input',
                template: '<button id="' + this.element.id + '_fillColorBtn"></button>' });
        }
        if (items.indexOf('strokeColor') > -1) {
            toolbarItems.push({ prefixIcon: 'e-icons e-copy', id: this.element.id + '_strokecolor',
                cssClass: 'top-icon e-stroke', tooltipText: this.l10n.getConstant('StrokeColor'), align: 'Center', type: 'Input',
                template: '<button id="' + this.element.id + '_borderColorBtn"></button>' });
        }
        if (items.indexOf('strokeWidth') > -1) {
            toolbarItems.push({ id: this.element.id + '_strokeWidth', cssClass: 'top-icon e-size', tooltipText: 'Stroke Width', align: 'Center',
                type: 'Input', template: '<button id="' + this.element.id + '_borderWidthBtn"></button>' });
        }
        const tempToolbarItems: ItemModel[] = this.processSubToolbar(items);
        for (let i: number = 0, len: number = tempToolbarItems.length; i < len; i++) {
            toolbarItems.push(tempToolbarItems[i as number]);
        }
        if (!Browser.isDevice) {
            toolbarItems.push({ id: this.element.id + '_ok', prefixIcon: 'e-icons e-check', cssClass: 'top-icon e-tick',
                tooltipText: this.l10n.getConstant('OK'), align: 'Right' });
            toolbarItems.push({ id: this.element.id + '_cancel', prefixIcon: 'e-icons e-close', cssClass: 'top-icon e-save',
                tooltipText: this.l10n.getConstant('Cancel'), align: 'Right' });
        }
        return toolbarItems;
    }

    private initShapesToolbarItem(items: (string | ItemModel)[]): void {
        const leftItem: ItemModel[] = this.getLeftToolbarItem();
        const rightItem: ItemModel[] = this.getRightToolbarItem();
        const mainItem: ItemModel[] = this.getShapesToolbarItem(items);
        const zoomItem: ItemModel[] = this.getZoomToolbarItem();
        if (Browser.isDevice) {
            this.defToolbarItems = mainItem;
        } else {
            this.defToolbarItems = [...leftItem, ...zoomItem, ...mainItem, ...rightItem];
        }
        const toolbar: Toolbar = new Toolbar({
            width: '100%',
            items: this.defToolbarItems,
            clicked: this.defToolbarClicked.bind(this),
            created: () => {
                this.createShapeColor(items);
                this.createShapeBtn(items);
                if (!Browser.isDevice) {
                    this.renderSaveBtn();
                }
                this.trigger('toolbarCreated', {toolbarType: 'shapes'});
                if (Browser.isDevice) {
                    if (this.defToolbarItems.length > 0 && (!isNullOrUndefined(document.getElementById(this.element.id + '_bottomToolbar')))) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        (toolbar as any).refreshOverflow();
                    }
                } else {
                    this.createLeftToolbarControls();
                    if (this.defToolbarItems.length > 0 && (!isNullOrUndefined(document.getElementById(this.element.id + '_toolbar')))) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        (toolbar as any).refreshOverflow();
                    }
                }
            }
        });
        if (Browser.isDevice) {
            toolbar.appendTo('#' + this.element.id + '_bottomToolbar');
        } else {
            toolbar.appendTo('#' + this.element.id + '_toolbar');
        }
        this.enableDisableToolbarBtn();
    }

    private createShapeColor(items: (string | ItemModel)[]): void {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const proxy: ImageEditor = this;
        if (items.indexOf('fillColor') > -1) {
            this.element.querySelector('.e-template.e-fill').appendChild(this.createElement('input', {
                id: this.element.id + '_shape_fill'
            }));
            const fillColor: ColorPicker = new ColorPicker({
                modeSwitcher: false, noColor: true, value: '',
                showButtons: false, mode: 'Palette', cssClass: 'e-shape-fill-color',
                change: (args: ColorPickerEventArgs): void => {
                    this.pushActItemIntoObj();
                    const objColl: SelectionPoint[] = extend([], this.objColl, [], true) as SelectionPoint[];
                    this.objColl.pop();
                    proxy.activeObj.strokeSettings.fillColor = args.currentValue.hex;
                    proxy.strokeSettings.fillColor = proxy.activeObj.strokeSettings.fillColor;
                    this.objColl.push(this.activeObj);
                    proxy.undoRedoColl.push({operation: 'shapeTransform', value: null, currentObj: extend([], proxy.objColl, [], true) as SelectionPoint[],
                        previousObj: objColl, zoomFactor: proxy.zoomFactor, sharpen: proxy.adjustmentLevel.sharpen,
                        bw: proxy.adjustmentLevel.bw});
                    proxy.undoRedoStep++;
                    proxy.redrawShape(proxy.objColl[proxy.objColl.length - 1]);
                    if (args.currentValue.rgba === '') {
                        (fillDDB.element.children[0] as HTMLElement).classList.add('e-nocolor-item');
                    } else {
                        (fillDDB.element.children[0] as HTMLElement).classList.remove('e-nocolor-item');
                        (fillDDB.element.children[0] as HTMLElement).style.backgroundColor = args.currentValue.rgba;
                    }
                    fillDDB.toggle();
                }
            }, '#' + this.element.id + '_shape_fill');
            const fillDDB: DropDownButton = new DropDownButton({
                open: (args: OpenCloseMenuEventArgs) => {
                    if (Browser.isDevice) {
                        args.element.parentElement.style.top = fillDDB.element.getBoundingClientRect().top -
                        args.element.parentElement.offsetHeight + 'px';
                        args.element.parentElement.style.left = this.element.offsetLeft + 'px';
                    }
                },
                target: '.e-shape-fill-color',
                iconCss: 'e-dropdownbtn-preview'
            }, '#' + this.element.id + '_fillColorBtn');
            fillColor.inline = true;
            (this.element.querySelector('.e-fill.e-template .e-dropdownbtn-preview') as HTMLElement).classList.add('e-nocolor-item');
        }
        if (items.indexOf('strokeColor') > -1) {
            this.element.querySelector('.e-template.e-stroke').appendChild(this.createElement('input', {
                id: this.element.id + '_shape_stroke'
            }));
            const strokeColor: ColorPicker = new ColorPicker({
                modeSwitcher: false, noColor: false, value: '#fff',
                showButtons: false, mode: 'Palette', cssClass: 'e-shape-stroke-color',
                change: (args: ColorPickerEventArgs): void => {
                    this.pushActItemIntoObj();
                    const objColl: SelectionPoint[] = extend([], this.objColl, [], true) as SelectionPoint[];
                    this.objColl.pop();
                    proxy.activeObj.strokeSettings.strokeColor = args.currentValue.hex;
                    proxy.strokeSettings.strokeColor = proxy.activeObj.strokeSettings.strokeColor;
                    if (!proxy.togglePen) {
                        this.objColl.push(this.activeObj);
                        proxy.undoRedoColl.push({operation: 'shapeTransform', value: null,
                            currentObj: extend([], proxy.objColl, [], true) as SelectionPoint[],
                            previousObj: objColl, zoomFactor: proxy.zoomFactor,
                            sharpen: proxy.adjustmentLevel.sharpen, bw: proxy.adjustmentLevel.bw});
                        proxy.undoRedoStep++;
                        proxy.redrawShape(proxy.objColl[proxy.objColl.length - 1]);
                    }
                    (strokeDDB.element.children[0] as HTMLElement).style.backgroundColor = args.currentValue.rgba;
                    strokeDDB.toggle();
                }
            }, '#' + this.element.id + '_shape_stroke');
            const strokeDDB: DropDownButton = new DropDownButton({
                open: (args: OpenCloseMenuEventArgs) => {
                    if (Browser.isDevice) {
                        args.element.parentElement.style.top = strokeDDB.element.getBoundingClientRect().top -
                        args.element.parentElement.offsetHeight + 'px';
                        args.element.parentElement.style.left = this.element.offsetLeft + 'px';
                    }
                },
                target: '.e-shape-stroke-color',
                iconCss: 'e-dropdownbtn-preview'
            }, '#' + this.element.id + '_borderColorBtn');
            strokeColor.inline = true;
            (this.element.querySelector('.e-stroke.e-template .e-dropdownbtn-preview') as HTMLElement).style.background = '#fff';
        }
    }

    private createShapeBtn(items: (string | ItemModel)[]): void {
        const strokeWidthItems: DropDownButtonItemModel[] = [
            { id: '1', text: this.l10n.getConstant('XSmall') },
            { id: '2', text: this.l10n.getConstant('Small') },
            { id: '3', text: this.l10n.getConstant('Medium') },
            { id: '4', text: this.l10n.getConstant('Large') },
            { id: '5', text: this.l10n.getConstant('XLarge') }
        ];
        if (items.indexOf('strokeWidth') > -1) {
            const strokeWidthBtn: HTMLElement = document.getElementById(this.element.id + '_borderWidthBtn');
            const spanElem: HTMLElement = document.createElement('span');
            spanElem.innerHTML = this.l10n.getConstant('Small');
            spanElem.className = 'e-shape-stroke-width';
            strokeWidthBtn.appendChild(spanElem);
            // Initialize the DropDownButton component.
            const drpDownBtn: DropDownButton = new DropDownButton({ items: strokeWidthItems,
                open: (args: OpenCloseMenuEventArgs) => {
                    if (Browser.isDevice) {
                        args.element.parentElement.style.top = drpDownBtn.element.getBoundingClientRect().top -
                        args.element.parentElement.offsetHeight + 'px';
                    }
                    const activeBtn: string = spanElem.innerHTML;
                    if (activeBtn !== '') {
                        args.element.querySelector('[aria-label = ' + '"' + activeBtn + '"' + ']').classList.add('e-selected-btn');
                    }
                },
                select: (args: MenuEventArgs) => {
                    this.pushActItemIntoObj();
                    const objColl: SelectionPoint[] = extend([], this.objColl, [], true) as SelectionPoint[];
                    this.objColl.pop();
                    spanElem.textContent = args.item.text;
                    this.activeObj.strokeSettings.strokeWidth = parseInt(args.item.id, 10);
                    this.activeObj.strokeSettings.strokeWidth *= 2;
                    this.strokeSettings.strokeWidth = this.activeObj.strokeSettings.strokeWidth;
                    this.objColl.push(this.activeObj);
                    this.undoRedoColl.push({operation: 'shapeTransform', value: null,
                        currentObj: extend([], this.objColl, [], true) as SelectionPoint[],
                        previousObj: objColl, zoomFactor: this.zoomFactor,
                        sharpen: this.adjustmentLevel.sharpen, bw: this.adjustmentLevel.bw});
                    this.undoRedoStep++;
                    this.redrawShape(this.objColl[this.objColl.length - 1]);
                    if (Browser.isDevice) {
                        if (!isNullOrUndefined(document.getElementById(this.element.id + '_bottomToolbar'))) {
                            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                            const toolbar: any = getComponent(this.element.id + '_bottomToolbar', 'toolbar') as Toolbar;
                            toolbar.refreshOverflow();
                        }
                    } else {
                        if (!isNullOrUndefined(document.getElementById(this.element.id + '_toolbar'))) {
                            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                            const toolbar: any = getComponent(this.element.id + '_toolbar', 'toolbar') as Toolbar;
                            toolbar.refreshOverflow();
                        }
                    }
                }
            });
            // Render initialized DropDownButton.
            drpDownBtn.appendTo('#' + this.element.id + '_borderWidthBtn');
        }
    }

    private getTextToolbarItem(items: (string | ItemModel)[]): ItemModel[] {
        const toolbarItems: ItemModel[] = [];
        if (items.indexOf('fontFamily') > -1) {
            toolbarItems.push({ id: this.element.id + '_fontFamily', cssClass: 'top-icon e-img-font-family',
                tooltipText: this.l10n.getConstant('FontFamily'), align: 'Center',
                template: '<button id="' + this.element.id + '_fontFamilyBtn"></button>' });
        }
        if (items.indexOf('fontStyle') > -1) {
            toolbarItems.push({ id: this.element.id + '_fontStyle', cssClass: 'top-icon e-img-font-style',
                tooltipText: this.l10n.getConstant('FontStyle'), align: 'Center',
                template: '<button id="' + this.element.id + '_fontStyleBtn"></button>' });
        }
        if (items.indexOf('fontSize') > -1) {
            toolbarItems.push({ id: this.element.id + '_fontSize', cssClass: 'top-icon e-img-font-size',
                tooltipText: this.l10n.getConstant('FontSize'), align: 'Center',
                template: '<button id="' + this.element.id + '_fontSizeBtn"></button>' });
        }
        if (items.indexOf('fontColor') > -1) {
            toolbarItems.push({ cssClass: 'top-icon e-text-font-color', id: this.element.id + '_text_strokecolor',
                tooltipText: this.l10n.getConstant('FontColor'), align: 'Center',
                type: 'Input', template: '<button id="' + this.element.id + '_fontColorBtn"></button>' });
        }
        const tempToolbarItems: ItemModel[] = this.processSubToolbar(items);
        for (let i: number = 0, len: number = tempToolbarItems.length; i < len; i++) {
            toolbarItems.push(tempToolbarItems[i as number]);
        }
        if (!Browser.isDevice) {
            toolbarItems.push({ id: this.element.id + '_ok', prefixIcon: 'e-icons e-check', cssClass: 'top-icon e-tick',
                tooltipText: this.l10n.getConstant('OK'), align: 'Right' });
            toolbarItems.push({ id: this.element.id + '_cancel', prefixIcon: 'e-icons e-close', cssClass: 'top-icon e-save',
                tooltipText: this.l10n.getConstant('Cancel'), align: 'Right' });
        }
        return toolbarItems;
    }

    private getFontFamilyItems(): ItemModel[] {
        if (Browser.isDevice) {
            return [{ id: 'arial', text: 'ABC' }, { id: 'calibri', text: 'ABC' }, { id: 'georgia', text: 'ABC' },
                { id: 'roboto', text: 'ABC' }, { id: 'tahoma', text: 'ABC' }];
        }
        return [{ id: 'arial', text: 'Arial' }, { id: 'calibri', text: 'Calibri' }, { id: 'georgia', text: 'Georgia' },
            { id: 'roboto', text: 'Roboto' }, { id: 'tahoma', text: 'Tahoma' }];
    }

    private getFontSizeItems(): ItemModel[] {
        if (Browser.isDevice) {
            return [{ id: 'default', text: this.l10n.getConstant('ABC') }, { id: 'bold', text: this.l10n.getConstant('ABC') },
                { id: 'italic', text: this.l10n.getConstant('ABC') }, { id: 'bolditalic', text: this.l10n.getConstant('ABC') }];
        }
        return [{ id: 'default', text: this.l10n.getConstant('Default') }, { id: 'bold', text: this.l10n.getConstant('Bold') },
            { id: 'italic', text: this.l10n.getConstant('Italic') }, { id: 'bolditalic', text: this.l10n.getConstant('BoldItalic') }];
    }

    private initTextToolbarItem(items: (string | ItemModel)[]): void {
        const leftItem: ItemModel[] = this.getLeftToolbarItem();
        const rightItem: ItemModel[] = this.getRightToolbarItem();
        const mainItem: ItemModel[] = this.getTextToolbarItem(items);
        const zoomItem: ItemModel[] = this.getZoomToolbarItem();
        if (Browser.isDevice) {
            this.defToolbarItems = mainItem;
        } else {
            this.defToolbarItems = [...leftItem, ...zoomItem, ...mainItem, ...rightItem];
        }
        const toolbar: Toolbar = new Toolbar({
            width: '100%',
            items: this.defToolbarItems,
            clicked: this.defToolbarClicked.bind(this),
            created: () => {
                this.createTextColor(items);
                this.createTextBtn(items);
                if (!Browser.isDevice) {
                    this.renderSaveBtn();
                }
                this.trigger('toolbarCreated', {toolbarType: 'text'});
                if (Browser.isDevice) {
                    if (this.defToolbarItems.length > 0 && (!isNullOrUndefined(document.getElementById(this.element.id + '_bottomToolbar')))) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        (toolbar as any).refreshOverflow();
                    }
                } else {
                    this.createLeftToolbarControls();
                    if (this.defToolbarItems.length > 0 && (!isNullOrUndefined(document.getElementById(this.element.id + '_toolbar')))) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        (toolbar as any).refreshOverflow();
                    }
                }
            }
        });
        if (Browser.isDevice) {
            toolbar.appendTo('#' + this.element.id + '_bottomToolbar');
        } else {
            toolbar.appendTo('#' + this.element.id + '_toolbar');
        }
        this.enableDisableToolbarBtn();
    }

    private createTextColor(items: (string | ItemModel)[]): void {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const proxy: ImageEditor = this;
        if (items.indexOf('fontColor') > -1) {
            this.element.querySelector('.e-template.e-text-font-color').appendChild(this.createElement('input', {
                id: this.element.id + '_text_font'
            }));
            const fontColor: ColorPicker = new ColorPicker({
                modeSwitcher: false, value: '#fff',
                showButtons: false, mode: 'Palette', cssClass: 'e-text-fontt-color',
                change: (args: ColorPickerEventArgs): void => {
                    this.pushActItemIntoObj();
                    const objColl: SelectionPoint[] = extend([], this.objColl, [], true) as SelectionPoint[];
                    this.objColl.pop();
                    if (proxy.textArea.style.display === 'none') {
                        proxy.strokeSettings.strokeColor = proxy.activeObj.strokeSettings.strokeColor = args.currentValue.hex;
                        if (!proxy.togglePen) {
                            this.objColl.push(this.activeObj);
                            proxy.undoRedoColl.push({operation: 'shapeTransform',
                                value: null, currentObj: extend([], proxy.objColl, [], true) as SelectionPoint[],
                                previousObj: objColl, zoomFactor: proxy.zoomFactor,
                                sharpen: proxy.adjustmentLevel.sharpen, bw: proxy.adjustmentLevel.bw});
                            proxy.undoRedoStep++;
                            proxy.redrawShape(proxy.objColl[proxy.objColl.length - 1]);
                        }
                    }
                    else if (proxy.textArea.style.display === 'block') {
                        proxy.textArea.style.color = args.currentValue.hex;
                        const temp: string = proxy.activeObj.strokeSettings.strokeColor;
                        proxy.activeObj.strokeSettings.strokeColor = args.currentValue.hex;
                        this.objColl.push(this.activeObj);
                        this.undoRedoColl.push({operation: 'textTransform', value: null,
                            currentObj: extend([], this.objColl, [], true) as SelectionPoint[],
                            previousObj: objColl, zoomFactor: proxy.zoomFactor,
                            sharpen: proxy.adjustmentLevel.sharpen, bw: proxy.adjustmentLevel.bw});
                        this.undoRedoStep++;
                        this.objColl.pop();
                        proxy.activeObj.strokeSettings.strokeColor = temp;
                    } else if (!proxy.togglePen) {
                        this.objColl.push(this.activeObj);
                        proxy.undoRedoColl.push({operation: 'shapeTransform', value: null,
                            currentObj: extend([], proxy.objColl, [], true) as SelectionPoint[],
                            previousObj: objColl, zoomFactor: proxy.zoomFactor,
                            sharpen: proxy.adjustmentLevel.sharpen, bw: proxy.adjustmentLevel.bw});
                        proxy.undoRedoStep++;
                        proxy.redrawShape(proxy.objColl[proxy.objColl.length - 1]);
                    }
                    (strokeDDB.element.children[0] as HTMLElement).style.backgroundColor = args.currentValue.rgba;
                    strokeDDB.toggle();
                }
            }, '#' + this.element.id + '_text_font');
            const strokeDDB: DropDownButton = new DropDownButton({
                open: (args: OpenCloseMenuEventArgs) => {
                    if (Browser.isDevice) {
                        args.element.parentElement.style.top = strokeDDB.element.getBoundingClientRect().top -
                        args.element.parentElement.offsetHeight + 'px';
                        args.element.parentElement.style.left = this.element.offsetLeft + 'px';
                    }
                },
                target: '.e-text-fontt-color',
                iconCss: 'e-dropdownbtn-preview'
            }, '#' + this.element.id + '_fontColorBtn');
            fontColor.inline = true;
            (this.element.querySelector('.e-text-font-color.e-template .e-dropdownbtn-preview') as HTMLElement).style.background
                = '#fff';
        }
    }

    private pushActItemIntoObj(): void {
        if (this.textArea.style.display === 'none') {
            this.objColl.push(this.activeObj);
        } else {
            const temp: SelectionPoint = extend({}, this.activeObj, {}, true) as SelectionPoint;
            this.setTextBoxStylesToActObj();
            this.objColl.push(this.activeObj);
            this.activeObj = temp;
        }
    }

    private createTextBtn(items: (string | ItemModel)[]): void {
        if (items.indexOf('fontFamily') > -1) {
            const fontNameBtn: HTMLElement = document.getElementById(this.element.id + '_fontFamilyBtn');
            const spanElem: HTMLElement = document.createElement('span');
            if (Browser.isDevice) {
                spanElem.innerHTML = 'ABC';
                spanElem.setAttribute('style', 'font-family: arial');
            } else {
                spanElem.innerHTML = 'Arial';
            }
            spanElem.className = 'e-text-font-family';
            fontNameBtn.appendChild(spanElem);
            const fontFamilyBtn: DropDownButton = new DropDownButton({ items: this.getFontFamilyItems(),
                cssClass: 'e-font-family',
                createPopupOnClick: true,
                beforeItemRender: (args: MenuEventArgs) => {
                    args.element.setAttribute('style', 'font-family:' + args.element.id);
                },
                open: (args: OpenCloseMenuEventArgs) => {
                    if (Browser.isDevice) {
                        args.element.parentElement.style.top = fontFamilyBtn.element.getBoundingClientRect().top -
                        args.element.parentElement.offsetHeight + 'px';
                    }
                    let fontFamily: string;
                    if (this.textArea.style.display === 'block') {
                        fontFamily = this.textArea.style.fontFamily;
                    } else {
                        fontFamily = this.activeObj.textSettings.fontFamily;
                    }
                    args.element.querySelector('[id *= ' + '"' + fontFamily.toLowerCase()
                        + '"' + ']').classList.add('e-selected-btn');
                },
                select: (args: MenuEventArgs) => {
                    this.pushActItemIntoObj();
                    const objColl: SelectionPoint[] = extend([], this.objColl, [], true) as SelectionPoint[];
                    this.objColl.pop();
                    spanElem.textContent = args.item.text;
                    if (Browser.isDevice) {
                        spanElem.setAttribute('style', 'font-family:' + args.item.id);
                    }
                    if (this.textArea.style.display === 'block') {
                        this.updateFontRatio(this.activeObj, true);
                        const temp: string = this.activeObj.textSettings.fontFamily;
                        this.activeObj.textSettings.fontFamily = this.toPascalCase(args.item.id);
                        this.redrawText();
                        this.objColl.push(this.activeObj);
                        this.undoRedoColl.push({operation: 'textTransform', value: null,
                            currentObj: extend([], this.objColl, [], true) as SelectionPoint[],
                            previousObj: objColl, zoomFactor: this.zoomFactor,
                            sharpen: this.adjustmentLevel.sharpen, bw: this.adjustmentLevel.bw});
                        this.undoRedoStep++;
                        this.objColl.pop();
                        this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
                        const width: number = this.activeObj.activePoint.width +
                        this.activeObj.textSettings.fontSize * 0.25;
                        this.textArea.style.width = width + 'px';
                        this.textArea.style.fontFamily = this.toPascalCase(args.item.id);
                        this.activeObj.textSettings.fontFamily = temp;
                        this.updateFontStyles();
                    } else {
                        this.updateFontRatio(this.activeObj);
                        this.textSettings.fontFamily = this.activeObj.textSettings.fontFamily = this.toPascalCase(args.item.id);
                        this.redrawText();
                        this.objColl.push(this.activeObj);
                        this.undoRedoColl.push({operation: 'shapeTransform', value: null,
                            currentObj: extend([], this.objColl, [], true) as SelectionPoint[],
                            previousObj: objColl, zoomFactor: this.zoomFactor,
                            sharpen: this.adjustmentLevel.sharpen, bw: this.adjustmentLevel.bw});
                        this.undoRedoStep++;
                        this.redrawShape(this.objColl[this.objColl.length - 1]);
                    }
                }
            });
            fontFamilyBtn.appendTo('#' + this.element.id + '_fontFamilyBtn');
        }
        if (items.indexOf('fontStyle') > -1) {
            const fontStyleBtnElem: HTMLElement = document.getElementById(this.element.id + '_fontStyleBtn');
            const span1Elem: HTMLElement = document.createElement('span');
            if (Browser.isDevice) {
                span1Elem.innerHTML = this.l10n.getConstant('ABC');
            } else {
                span1Elem.innerHTML = this.l10n.getConstant('Default');
            }
            span1Elem.className = 'e-text-font-style';
            fontStyleBtnElem.appendChild(span1Elem);
            const fontStyleBtn: DropDownButton = new DropDownButton({ items: this.getFontSizeItems(),
                cssClass: 'e-font-style',
                createPopupOnClick: true,
                beforeItemRender: (args: MenuEventArgs) => {
                    if (Browser.isDevice) {
                        if (args.element.id === 'bold') {
                            args.element.setAttribute('style', 'font-weight: bold');
                        } else if (args.element.id === 'italic') {
                            args.element.setAttribute('style', 'font-style: italic');
                        } else if (args.element.id === 'bolditalic') {
                            args.element.setAttribute('style', 'font-style: italic;font-weight: bold');
                        }
                    }
                },
                open: (args: OpenCloseMenuEventArgs) => {
                    let fontStyle: string = 'default';
                    if (this.textArea.style.display === 'block') {
                        if (this.textArea.style.fontWeight === 'bold') {
                            fontStyle = 'bold';
                        }
                        if (this.textArea.style.fontStyle === 'italic') {
                            fontStyle = fontStyle.replace('default', '');
                            fontStyle += 'italic';
                        }
                    } else {
                        if (this.activeObj.textSettings.bold) {
                            fontStyle = 'bold';
                        }
                        if (this.activeObj.textSettings.italic) {
                            fontStyle = fontStyle.replace('default', '');
                            fontStyle += 'italic';
                        }
                    }
                    if (Browser.isDevice) {
                        args.element.parentElement.style.top = fontStyleBtn.element.getBoundingClientRect().top -
                        args.element.parentElement.offsetHeight + 'px';
                    }
                    args.element.querySelector('[id *= ' + '"' + fontStyle + '"' + ']').classList.add('e-selected-btn');
                },
                select: (args: MenuEventArgs) => {
                    if (Browser.isDevice) {
                        if (args.item.id === 'bold') {
                            span1Elem.setAttribute('style', 'font-weight: bold');
                        } else if (args.item.id === 'italic') {
                            span1Elem.setAttribute('style', 'font-style: italic');
                        } else if (args.item.id === 'bolditalic') {
                            span1Elem.setAttribute('style', 'font-style: italic;font-weight: bold');
                        }
                        this.applyFontStyle(args.item.id);
                    } else {
                        span1Elem.textContent = args.item.text;
                        this.applyFontStyle(args.item.id);
                    }
                }
            });
            fontStyleBtn.appendTo('#' + this.element.id + '_fontStyleBtn');
        }
        if (items.indexOf('fontSize') > -1) {
            const fontSizeBtnElem: HTMLElement = document.getElementById(this.element.id + '_fontSizeBtn');
            const fontSizeSpanElem: HTMLElement = document.createElement('span');
            const fontSizes: DropDownButtonItemModel[] = this.getFontSizes();
            fontSizeSpanElem.innerHTML = fontSizes[0].text;
            fontSizeSpanElem.className = 'e-text-font-size';
            fontSizeBtnElem.appendChild(fontSizeSpanElem);
            const fontSizeBtn: DropDownButton = new DropDownButton({
                cssClass: 'e-font-size',
                items: fontSizes,
                open: (args: OpenCloseMenuEventArgs) => {
                    if (Browser.isDevice) {
                        args.element.parentElement.style.top = fontSizeBtn.element.getBoundingClientRect().top -
                        args.element.parentElement.offsetHeight + 'px';
                    }
                    const activeBtn: string = fontSizeSpanElem.innerHTML;
                    args.element.querySelector('[aria-label *= ' + '"' + activeBtn + '"' + ']').classList.add('e-selected-btn');
                },
                select: (args: MenuEventArgs) => {
                    this.pushActItemIntoObj();
                    const objColl: SelectionPoint[] = extend([], this.objColl, [], true) as SelectionPoint[];
                    this.objColl.pop();
                    fontSizeSpanElem.textContent =  args.item.text;
                    if (this.textArea.style.display === 'block') {
                        this.updateFontRatio(this.activeObj, true);
                        const temp: number = this.activeObj.textSettings.fontSize;
                        this.activeObj.textSettings.fontSize = parseInt(this.fontSizeColl[(parseInt(args.item.text, 10) - 1)].text, 10);
                        this.objColl.push(this.activeObj);
                        this.undoRedoColl.push({operation: 'textTransform', value: null,
                            currentObj: extend([], this.objColl, [], true) as SelectionPoint[],
                            previousObj: objColl, zoomFactor: this.zoomFactor,
                            sharpen: this.adjustmentLevel.sharpen, bw: this.adjustmentLevel.bw});
                        this.undoRedoStep++;
                        this.objColl.pop();
                        let textStyle: string = '';
                        if (this.textArea.style.fontWeight === 'bold') {textStyle = 'bold '; }
                        if (this.textArea.style.fontStyle === 'italic') {textStyle = 'italic '; }
                        if (this.textArea.style.fontWeight === 'bold' && this.textArea.style.fontStyle === 'italic') {
                            textStyle = 'italic bold '; }
                        this.upperContext.font = textStyle + this.activeObj.textSettings.fontSize + 'px' + ' ' + this.textArea.style.fontFamily;
                        const rows: string[] = this.textArea.value.split('\n');
                        const text: string = this.getMaxText(true);
                        const width: number = this.upperContext.measureText(text).width +
                        this.activeObj.textSettings.fontSize * 0.5;
                        this.textArea.style.width = width + 'px';
                        this.textArea.style.height = rows.length * (this.activeObj.textSettings.fontSize + this.activeObj.textSettings.fontSize * 0.25) + 'px';
                        this.activeObj.textSettings.fontSize = temp;
                        this.upperContext.font = this.activeObj.textSettings.fontSize + 'px' + ' ' + this.activeObj.textSettings.fontFamily;
                        this.textArea.style.fontSize = parseInt(this.fontSizeColl[(parseInt(args.item.text, 10) - 1)].text, 10) + 'px';
                        if (this.textArea.style.fontFamily === 'georgia') {
                            this.textArea.style.width = parseFloat(this.textArea.style.width) + parseFloat(this.textArea.style.fontSize) + 'px';
                        }
                    } else {
                        this.updateFontRatio(this.activeObj);
                        this.textSettings.fontSize = this.activeObj.textSettings.fontSize = parseInt(this.fontSizeColl[(
                            parseInt(args.item.text, 10) - 1)].text, 10);
                        this.upperContext.font = this.activeObj.textSettings.fontSize + 'px' + ' ' + this.activeObj.textSettings.fontFamily;
                        const rows: string[] = this.activeObj.keyHistory.split('\n');
                        const text: string = this.getMaxText();
                        const width: number = this.upperContext.measureText(text).width +
                        this.activeObj.textSettings.fontSize * 0.5;
                        const height: number = rows.length * (this.activeObj.textSettings.fontSize +
                            this.activeObj.textSettings.fontSize * 0.25);
                        this.setTextSelection(width, height);
                        this.updateActiveObject(this.activeObj.activePoint, this.activeObj);
                        this.redrawText();
                        this.objColl.push(this.activeObj);
                        this.undoRedoColl.push({operation: 'shapeTransform', value: null,
                            currentObj: extend([], this.objColl, [], true) as SelectionPoint[],
                            previousObj: objColl, zoomFactor: this.zoomFactor,
                            sharpen: this.adjustmentLevel.sharpen, bw: this.adjustmentLevel.bw});
                        this.undoRedoStep++;
                        this.redrawShape(this.objColl[this.objColl.length - 1]);
                    }
                }
            });
            fontSizeBtn.appendTo('#' + this.element.id + '_fontSizeBtn');
        }
    }

    private getFontSizes(): DropDownButtonItemModel[] {
        const items: DropDownButtonItemModel[] = [];
        this.fontSizeColl = [];
        let fontSize: number;
        if (this.degree === 0 || this.degree % 180 === 0) {
            fontSize = this.destWidth / 25;
        }
        else {
            fontSize = this.destHeight / 25;
        }
        for (let i: number = 1; i <= 10; i++) {
            this.fontSizeColl.push({ text: (i * (Math.round(fontSize / 2))).toString() });
            items.push({text: (i.toString())});
        }
        return items;
    }

    private getTextAreaWidth(item: string): number {
        const tempBold: boolean = this.activeObj.textSettings.bold;
        const tempItalic: boolean = this.activeObj.textSettings.italic;
        switch (item) {
        case 'default':
            this.activeObj.textSettings.bold = false;
            this.activeObj.textSettings.italic = false;
            break;
        case 'bold':
            this.activeObj.textSettings.bold = true;
            this.activeObj.textSettings.italic = false;
            break;
        case 'italic':
            this.activeObj.textSettings.bold = false;
            this.activeObj.textSettings.italic = true;
            break;
        case 'bolditalic':
            this.activeObj.textSettings.bold = true;
            this.activeObj.textSettings.italic = true;
            break;
        }
        this.updateFontStyles();
        let width: number;
        if (this.textArea.style.display === 'none') {
            width = this.upperContext.measureText(this.activeObj.keyHistory).width +
            this.activeObj.textSettings.fontSize * 0.5;
        } else {
            width = this.upperContext.measureText(this.textArea.value).width +
            this.activeObj.textSettings.fontSize * 0.5;
        }
        this.activeObj.textSettings.bold = tempBold;
        this.activeObj.textSettings.italic = tempItalic;
        return width;
    }

    private updateUndoRedoObj(objColl: SelectionPoint[]): void {
        this.objColl.push(this.activeObj);
        this.undoRedoColl.push({operation: 'shapeTransform', value: null,
            currentObj: extend([], this.objColl, [], true) as SelectionPoint[], previousObj: objColl, zoomFactor: this.zoomFactor,
            sharpen: this.adjustmentLevel.sharpen, bw: this.adjustmentLevel.bw});
        this.undoRedoStep++;
        this.redrawShape(this.objColl[this.objColl.length - 1]);
    }

    private updateObjColl(item: string, objColl: SelectionPoint[]): void {
        const tempBold: boolean = this.activeObj.textSettings.bold;
        const tempItalic: boolean = this.activeObj.textSettings.italic;
        switch (item) {
        case 'default':
            this.activeObj.textSettings.bold = false;
            this.activeObj.textSettings.italic = false;
            break;
        case 'bold':
            this.activeObj.textSettings.bold = true;
            this.activeObj.textSettings.italic = false;
            break;
        case 'italic':
            this.activeObj.textSettings.bold = false;
            this.activeObj.textSettings.italic = true;
            break;
        case 'bolditalic':
            this.activeObj.textSettings.bold = true;
            this.activeObj.textSettings.italic = true;
            break;
        }
        this.objColl.push(this.activeObj);
        this.undoRedoColl.push({operation: 'textTransform', value: null,
            currentObj: extend([], this.objColl, [], true) as SelectionPoint[], previousObj: objColl, zoomFactor: this.zoomFactor,
            sharpen: this.adjustmentLevel.sharpen, bw: this.adjustmentLevel.bw});
        this.undoRedoStep++;
        this.objColl.pop();
        this.activeObj.textSettings.bold = tempBold;
        this.activeObj.textSettings.italic = tempItalic;
    }

    private applyFontStyle(item: string): void {
        this.pushActItemIntoObj();
        const objColl: SelectionPoint[] = extend([], this.objColl, [], true) as SelectionPoint[];
        this.objColl.pop();
        if (this.textArea.style.display === 'none') {
            this.updateFontRatio(this.activeObj);
        } else {
            this.updateFontRatio(this.activeObj, true);
        }
        switch (item) {
        case 'default':
            if (this.textArea.style.display === 'block') {
                const width: number = this.getTextAreaWidth(item);
                this.textArea.style.width = width + 'px';
                this.textArea.style.fontWeight = 'normal';
                this.textArea.style.fontStyle = 'normal';
                this.updateObjColl(item, objColl);
            } else {
                this.textSettings.bold = this.activeObj.textSettings.bold = false;
                this.textSettings.italic = this.activeObj.textSettings.italic = false;
                this.redrawText();
                this.updateUndoRedoObj(objColl);
            }
            break;
        case 'bold':
            if (this.textArea.style.display === 'block') {
                const width: number = this.getTextAreaWidth(item);
                this.textArea.style.width = width + 'px';
                this.textArea.style.fontWeight = 'bold';
                this.textArea.style.fontStyle = 'normal';
                this.updateObjColl(item, objColl);
            } else {
                this.textSettings.bold = this.activeObj.textSettings.bold = true;
                this.textSettings.italic = this.activeObj.textSettings.italic = false;
                this.redrawText();
                this.updateUndoRedoObj(objColl);
            }
            break;
        case 'italic':
            if (this.textArea.style.display === 'block') {
                const width: number = this.getTextAreaWidth(item);
                this.textArea.style.width = width + 'px';
                this.textArea.style.fontWeight = 'normal';
                this.textArea.style.fontStyle = 'italic';
                this.updateObjColl(item, objColl);
            } else {
                this.textSettings.bold = this.activeObj.textSettings.bold = false;
                this.textSettings.italic = this.activeObj.textSettings.italic = true;
                this.redrawText();
                this.updateUndoRedoObj(objColl);
            }
            break;
        case 'bolditalic':
            if (this.textArea.style.display === 'block') {
                const width: number = this.getTextAreaWidth(item);
                this.textArea.style.width = width + 'px';
                this.textArea.style.fontWeight = 'bold';
                this.textArea.style.fontStyle = 'italic';
                this.updateObjColl(item, objColl);
            } else {
                this.textSettings.bold = this.activeObj.textSettings.bold = true;
                this.textSettings.italic = this.activeObj.textSettings.italic = true;
                this.redrawText();
                this.updateUndoRedoObj(objColl);
            }
            break;
        }
    }

    private initZoomToolbarItem(): void {
        const leftItem: ItemModel[] = this.getLeftToolbarItem();
        const rightItem: ItemModel[] = this.getRightToolbarItem();
        const zoomItem: ItemModel[] = this.getZoomToolbarItem();

        this.defToolbarItems = [...leftItem, ...zoomItem, ...rightItem];
        new Toolbar({
            width: '100%',
            items: this.defToolbarItems,
            clicked: this.defToolbarClicked.bind(this),
            created: () => {
                this.renderSaveBtn();
                this.trigger('toolbarCreated', {toolbarType: 'zoom'});
            }
        }, '#' + this.element.id + '_toolbar');
        this.createLeftToolbarControls();
        this.enableDisableToolbarBtn();
        if (this.defToolbarItems.length > 0 && (!isNullOrUndefined(document.getElementById(this.element.id + '_toolbar')))) {
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            const toolbar: any = getComponent(this.element.id + '_toolbar', 'toolbar') as Toolbar;
            toolbar.refreshOverflow();
        }
    }

    private refreshUndoRedoColl(): void {
        this.undoRedoColl = this.undoRedoColl.slice(0, this.undoRedoStep);
        this.isUndoRedo = this.currObjType.isUndoAction = false;
        this.enableDisableToolbarBtn();
    }

    private applyPreviewFilter(): void {
        if (!isNullOrUndefined(document.querySelector('#' + this.element.id + '_sliderWrapper')) ||
            this.currObjType.isFiltered) {
            this.initialAdjustmentValue = this.canvasFilter = this.lowerContext.filter;
            this.currObjType.isFiltered = false;
        }
    }

    private contextualToolbarClicked(args: ClickEventArgs): void {
        const selEle: HTMLElement = this.element.querySelector('.e-contextual-toolbar-wrapper .e-toolbar-item.e-selected');
        if (selEle) {
            selEle.classList.remove('e-selected');
        }
        document.getElementById(args.item.id + 'Canvas').parentElement.parentElement.classList.add('e-selected');
        this.currObjType.isFiltered = true;
        const type: string = args.item.id.replace(this.element.id, '').split('_')[1];
        const imageFiltering: ImageFilterEventArgs = { filter: this.toPascalCase(type) as ImageFilterOptions};
        this.trigger('imageFiltering', imageFiltering);
        this.setFilter(type.toLowerCase());
        this.currentFilter = args.item.id;
        this.enableDisableToolbarBtn();
    }

    private defToolbarClicked(args: ClickEventArgs): void {
        let isContextualToolbar: boolean = false;
        if (this.element.querySelector('.e-contextual-toolbar-wrapper')) {
            if (!this.element.querySelector('.e-contextual-toolbar-wrapper').classList.contains('e-hide')) {
                isContextualToolbar = true;
            }
            this.element.querySelector('.e-contextual-toolbar-wrapper').classList.add('e-hide');
            
        }
        let zoomIn: HTMLElement;
        const type: string = args.item.id.replace(this.element.id + '_', '').toLowerCase();
        const imageEditorObj: ImageEditor = getInstance(document.getElementById(this.element.id), ImageEditor) as ImageEditor;
        let isCropSelection: boolean = false;  let panBtn: HTMLElement;
        let splitWords: string[];
        if (this.activeObj.shape !== undefined) {splitWords = this.activeObj.shape.split('-'); }
        if (splitWords === undefined && this.currObjType.isCustomCrop) {
            isCropSelection = true;
        } else if (splitWords !== undefined && splitWords[0] === 'crop'){
            isCropSelection = true;
        }
        let isDisabledZoomOut: boolean = false; let isDisabledFilter: boolean = false; let isDisabledAdjustment: boolean = false;
        const zoomOut: HTMLElement = document.querySelector('#' + this.element.id + '_zoomOut');
        if (!isNullOrUndefined(zoomOut) && zoomOut.classList.contains('e-disabled')) {
            isDisabledZoomOut = true;
        }
        const adjustment: HTMLElement = document.querySelector('#' + this.element.id + '_adjustment');
        if (!isNullOrUndefined(adjustment) && adjustment.classList.contains('e-disabled')) {
            isDisabledAdjustment = true;
        }
        const filter: HTMLElement = document.querySelector('#' + this.element.id + '_filter');
        if (!isNullOrUndefined(filter) && filter.classList.contains('e-disabled')) {
            isDisabledFilter = true;
        }
        this.enableDisableToolbarBtn();
        if (!this.disabled) {
            switch (type) {
            case 'zoomin':
                if (this.isFreehandDrawEditing) {
                    this.applyFreehandDraw();
                }
                this.applyPreviewFilter();
                this.currObjType.isFiltered = false;
                if (this.currObjType.isUndoAction) { this.refreshUndoRedoColl(); }
                if (this.togglePen) {
                    this.currObjType.isZoomed = true;
                    this.freeHandDraw(false);
                }
                this.currentSelectionPoint = null;
                imageEditorObj.zoom(.1);
                break;
            case 'zoomout':
                if (!isDisabledZoomOut) {
                    if (this.isFreehandDrawEditing) {
                        this.applyFreehandDraw();
                    }
                    this.applyPreviewFilter();
                    this.currObjType.isFiltered = false;
                    if (this.currObjType.isUndoAction) { this.refreshUndoRedoColl(); }
                    if (this.togglePen) {
                        this.currObjType.isZoomed = true;
                        this.freeHandDraw(false);
                    }
                    this.currentSelectionPoint = null;
                    imageEditorObj.zoom(-.1);
                }
                break;
            case 'pan':
                this.currObjType.isCustomCrop = this.currObjType.isFiltered = false;
                if (this.currObjType.isUndoAction) { this.refreshUndoRedoColl(); }
                if (isCropSelection) {
                    this.currObjType.isCustomCrop = false;
                    this.refreshActiveObj(); this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
                    this.refreshToolbar('main');
                }
                if (this.togglePan) {
                    this.cancelPan();
                    this.disablePan = true;
                    if (this.currentToolbar === 'pen') {
                        this.freeHandDraw(true);
                    }
                } else {
                    panBtn = this.element.querySelector('.e-img-pan .e-btn');
                    if (!isNullOrUndefined(panBtn)) {
                        panBtn.classList.add('e-selected-btn');
                    }
                    imageEditorObj.pan(true);
                    this.disablePan = false;
                }
                zoomIn = document.querySelector('#' + this.element.id + '_zoomIn');
                if (!isNullOrUndefined(zoomIn) && this.zoomFactor >= 5) {
                    zoomIn.classList.add('e-disabled');
                    zoomIn.parentElement.classList.add('e-overlay');
                } else if (!isNullOrUndefined(zoomIn)) {
                    zoomIn.classList.remove('e-disabled');
                    zoomIn.parentElement.classList.remove('e-overlay');
                }
                this.refreshToolbar('main');
                break;
            case 'cancel':
                this.performCancel(isContextualToolbar);
                break;
            case 'ok':
                this.okBtn();
                this.refreshDropDownBtn(false);
                this.currentToolbar = 'main';
                break;
            case 'crop':
                if (!isNullOrUndefined(this.currSelectionPoint)) {
                    this.select('Custom');
                    this.refreshToolbar('main', true, true);
                    (getComponent(this.element.querySelector('#' + this.element.id + '_cropBtn') as HTMLElement, 'dropdown-btn') as DropDownButton).toggle();
                    if (!isNullOrUndefined(this.activeObj.shape)) {
                        document.getElementById(this.activeObj.shape.split('-')[1]).classList.add('e-selected');
                    }
                }
                break;
            case 'reset':
                imageEditorObj.reset();
                this.currentToolbar = 'main';
                break;
            case 'undo':
                this.callUndo();
                break;
            case 'redo':
                this.callRedo();
                break;
            case 'adjustment':
                if (!isDisabledAdjustment) {
                    this.refreshToolbar('adjustment');
                    this.setTempFilterProperties();
                    this.openSlider('brightness');
                }
                break;
            case 'brightness':
            case 'contrast':
            case 'hue':
            case 'saturation':
            case 'opacity':
            case 'blur':
            case 'exposure':
                this.openSlider(type);
                break;
            case 'filter':
                if (!isDisabledFilter) {
                    this.refreshToolbar('filter');
                    this.setTempFilterProperties();
                }
                break;
            case 'default':
            case 'chrome':
            case 'cold':
            case 'warm':
            case 'grayscale':
            case 'blackandwhite':
            case 'sepia':
            case 'invert':
            case 'sharpen':
                this.currObjType.isFiltered = true;
                this.setFilter(type);
                break;
            }
        }
        this.trigger('toolbarItemClicked', args);
    }

    private performCancel(isContextualToolbar?: boolean): void {
        isContextualToolbar = isContextualToolbar ? isContextualToolbar : false;
        if  (this.isFreehandDrawEditing) {
            this.cancelFreehandDraw();
        } else if (this.textArea.style.display === 'block') {
            this.textArea.style.display = 'none';
            this.textArea.value = '';
            this.textArea.style.transform = '';
            this.activeObj.strokeSettings = this.tempStrokeSettings;
            this.activeObj.textSettings = this.tempTextSettings;
        } else if (!isNullOrUndefined(document.querySelector('#' + this.element.id + '_sliderWrapper')) ||
            this.currObjType.isFiltered) {
            this.lowerContext.filter = this.adjustmentValue = this.initialAdjustmentValue = this.tempAdjustmentValue;
            if (this.lowerContext.filter.split(' ').length > 1 &&
                this.lowerContext.filter.split(' ')[0].split('(')[1].split(')')[0] === '1') {
                this.isBrightnessAdjusted = false;
            }
            this.currentFilter = this.tempFilter;
            this.lowerContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
            this.redrawImgWithObj();
            this.currObjType.isFiltered = false;
            this.adjustmentLevel = extend({}, this.tempAdjustmentLevel, {}, true) as Adjustment;
            this.element.querySelector('.e-contextual-toolbar-wrapper').classList.add('e-hide');
            this.undoRedoColl = extend([], this.tempUndoRedoColl, [], true) as Transition[];
            this.undoRedoStep = this.tempUndoRedoStep;
            this.upperCanvas.style.cursor = 'default'; this.currObjType.isCustomCrop = false;
            this.tempStrokeSettings = {strokeColor: '#fff', fillColor: '', strokeWidth: null};
            this.callMainToolbar();
        } else {
            if (isContextualToolbar) {
                this.callMainToolbar();
            } else {
                this.cancelItems();
                this.togglePan = this.dragCanvas = false;
            }
        }
        this.enableDisableToolbarBtn();
        this.refreshDropDownBtn(false);
        this.currentToolbar = 'main';
    }

    private applyShape(): void {
        if (!isNullOrUndefined(this.activeObj.shape) && (this.activeObj.shape === 'rectangle' ||
            this.activeObj.shape === 'ellipse' || this.activeObj.shape === 'line' ||
            this.activeObj.shape === 'text')) {
            this.redrawActObj();
            this.refreshActiveObj();
            this.currentToolbar = 'main';
            this.refreshToolbar('main');
        }
    }

    private applyFreehandDraw(): void {
        if (this.pointColl[this.freehandDrawSelectedIndex].strokeColor === '#42a5f5') {
            this.pointColl[this.freehandDrawSelectedIndex].strokeColor = this.tempFreeHandDrawEditingStyles.strokeColor;
        }
        this.selectedFreehandColor = '#42a5f5';
        this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
        this.lowerContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
        this.renderImage();
        this.refreshToolbar('main');
        this.pointColl[this.freehandDrawSelectedIndex].isSelected = false;
        this.isFreehandDrawEditing = this.isFreehandDrawingPoint = false;
        this.freehandDrawHoveredIndex = this.freehandDrawSelectedIndex = null;
    }

    private cancelFreehandDraw(): void {
        this.selectedFreehandColor = '#42a5f5';
        this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
        for (let n: number = 0; n < this.freehandCounter; n++) {
            this.pointColl[n as number].strokeColor = this.tempFreeHandDrawEditingStyles.strokeColor;
            this.pointColl[n as number].strokeWidth = this.tempFreeHandDrawEditingStyles.strokeWidth;
        }
        this.pointCounter = 0;
        this.pointColl[this.freehandDrawSelectedIndex].isSelected = false;
        this.freehandDrawHoveredIndex = this.freehandDrawSelectedIndex = null;
        this.isFreehandDrawEditing = this.isFreehandDrawingPoint = false;
        this.tempFreeHandDrawEditingStyles = {strokeColor: null, strokeWidth: null, fillColor: null};
        this.refreshToolbar('main');
    }

    private openSlider(type: string): void {
        this.unselectBtn();
        this.currObjType.isFiltered = true;
        this.refreshToolbar('color', null, null, null, type);
        document.getElementById(this.element.id + '_' + type).classList.add('e-selected-btn');
    }

    private setTempFilterProperties(): void {
        this.upperCanvas.style.display = 'block';
        this.cropSelectedState();
        this.lowerContext.filter = this.initialAdjustmentValue;
        this.tempAdjustmentValue = this.lowerContext.filter;
        this.tempAdjustmentLevel = extend({}, this.adjustmentLevel, {}, true) as Adjustment;
        this.tempFilter = this.currentFilter;
        this.tempUndoRedoColl = extend([], this.undoRedoColl, [], true) as Transition[];
        this.tempUndoRedoStep = this.undoRedoStep;
    }

    private okBtn(): void {
        let isCropSelection: boolean = false; let splitWords: string[];
        if (this.activeObj.shape !== undefined) {splitWords = this.activeObj.shape.split('-'); }
        if (splitWords === undefined && this.currObjType.isCustomCrop) {
            isCropSelection = true;
        } else if (splitWords !== undefined && splitWords[0] === 'crop'){
            isCropSelection = true;
        }
        const selElem: HTMLElement = this.element.querySelector('.e-contextual-toolbar-wrapper .e-toolbar-item.e-selected');
        if (selElem) {
            this.currentFilter = selElem.children[0].children[0].id.replace('Canvas', '');
        }
        if (isCropSelection) {
            this.crop();
        } else if (this.togglePen) {
            this.freeHandDraw(false);
        } else if (this.textArea.style.display === 'block') {
            this.redrawActObj();
        } else if (!isNullOrUndefined(document.querySelector('#' + this.element.id + '_sliderWrapper')) ||
            this.currObjType.isFiltered) {
            this.initialAdjustmentValue = this.canvasFilter = this.lowerContext.filter;
            this.currObjType.isFiltered = false;
        } else if (this.isFreehandDrawEditing) {
            this.applyFreehandDraw();
        } else {
            this.applyActObj();
        }
        this.callMainToolbar(false);
        this.isCropTab = false;
        this.zoomFactor = this.defaultZoomFactor;
    }

    private updateBrightnessFilter(): void {
        const splitWords: string[] = this.lowerContext.filter.split(' ');
        if (this.isBrightnessAdjusted && splitWords.length > 0 && !isNullOrUndefined(splitWords[4])) {
            const opacityValue: number = parseFloat(splitWords[4].split('(')[1]);
            splitWords[4] = 'opacity(' + (opacityValue - 0.3) + ')';
            this.lowerContext.filter = splitWords.join(' ');
        }
    }

    private isFreehandDrawIndex(index: number): boolean {
        let isIndex: boolean = false;
        for (let i: number = 0; i < this.freehandCounter; i++) {
            if (parseInt(this.pointColl[i as number].id.split('_')[1], 10) - 1 === index) {
                isIndex = true;
                break;
            }
        }
        return isIndex;
    }

    private deleteFreehandDraw(index: number, isId?: boolean): void {
        if (this.isFreehandDrawIndex(index)) {
            this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
            // eslint-disable-next-line
            const tempPointColl: any = extend({}, this.pointColl, {}, true);
            this.pointColl = {}; let count: number = 0;
            if (isNullOrUndefined(isId)) {
                for (let i: number = 0; i < this.freehandCounter; i++) {
                    if (i !== index) {
                        this.pointColl[count as number] = tempPointColl[i as number];
                        count++;
                    }
                }
            } else {
                for (let i: number = 0; i < this.freehandCounter; i++) {
                    if (parseInt(tempPointColl[i as number].id.split('_')[1], 10) - 1 !== index) {
                        this.pointColl[count as number] = tempPointColl[i as number];
                        count++;
                    }
                }
            }
            this.freehandCounter -= 1;
            this.freehandDrawHoveredIndex = this.freehandDrawSelectedIndex = null;
            this.isFreehandDrawEditing = this.isFreehandDrawingPoint = false;
            this.renderImage();
            this.refreshToolbar('main');
        }
    }

    private unselectBtn(): void {
        if (document.querySelector('#' + this.element.id + '_brightness').classList.contains('e-selected-btn')) {
            document.querySelector('#' + this.element.id + '_brightness').classList.remove('e-selected-btn');
        } else if (document.querySelector('#' + this.element.id + '_contrast').classList.contains('e-selected-btn')) {
            document.querySelector('#' + this.element.id + '_contrast').classList.remove('e-selected-btn');
        } else if (document.querySelector('#' + this.element.id + '_hue').classList.contains('e-selected-btn')) {
            document.querySelector('#' + this.element.id + '_hue').classList.remove('e-selected-btn');
        } else if (document.querySelector('#' + this.element.id + '_saturation').classList.contains('e-selected-btn')) {
            document.querySelector('#' + this.element.id + '_saturation').classList.remove('e-selected-btn');
        } else if (document.querySelector('#' + this.element.id + '_opacity').classList.contains('e-selected-btn')) {
            document.querySelector('#' + this.element.id + '_opacity').classList.remove('e-selected-btn');
        } else if (document.querySelector('#' + this.element.id + '_blur').classList.contains('e-selected-btn')) {
            document.querySelector('#' + this.element.id + '_blur').classList.remove('e-selected-btn');
        } else if (document.querySelector('#' + this.element.id + '_exposure').classList.contains('e-selected-btn')) {
            document.querySelector('#' + this.element.id + '_exposure').classList.remove('e-selected-btn');
        }
    }

    private callUndo(): void {
        this.currObjType.isFiltered = false;
        if (!this.togglePan) {
            this.callMainToolbar(false, false);
        }
        if (this.zoomFactor === 0) {
            this.dragCanvas = this.togglePan = false;
            this.callMainToolbar(false, false);
        }
        if (this.element.querySelector('.e-contextual-toolbar-wrapper')) {
            this.element.querySelector('.e-contextual-toolbar-wrapper').classList.add('e-hide');
        }
        if (this.togglePen) {
            this.togglePen = false;
            this.upperCanvas.style.cursor = 'default';
            this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
        }
        this.undo();
    }

    private callRedo(): void {
        this.currObjType.isFiltered = false;
        if (!this.togglePan) {
            this.callMainToolbar(false, false);
        }
        if (this.zoomFactor === 0) {
            this.dragCanvas = this.togglePan = false;
            this.callMainToolbar(false, false);
        }
        this.redo();
    }

    private refreshSlider():  void {
        const sliderWrapper: HTMLElement = document.querySelector('#' + this.element.id + '_sliderWrapper');
        // eslint-disable-next-line
        const slider: any = document.querySelector('.e-slider');
        const hdrWrapper: HTMLElement = document.querySelector('#' + this.element.id + '_headWrapper');
        if (hdrWrapper) {
            hdrWrapper.style.display = 'none';
        }
        if (!isNullOrUndefined(sliderWrapper) && !isNullOrUndefined(slider)) {
            slider.ej2_instances[0].destroy();
            sliderWrapper.remove();
        }
    }

    private iterateObjColl(): void {
        for (let i: number = 0; i < this.objColl.length; i++) {
            this.apply(this.objColl[i as number].shape, this.objColl[i as number]);
            this.refreshActiveObj();
        }
    }

    private updateAdjustment(type: string, value: number, isPreview?: boolean): string {
        this.lowerContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
        let splitWords: string[] = this.lowerContext.filter.split(' ');
        let values: string[] = []; let opacityValue: number; let brightnessValue: number;
        if (splitWords[4] !== undefined) {opacityValue = parseFloat(splitWords[4].split('(')[1]); }
        if (splitWords[0] !== undefined) {brightnessValue = parseFloat(splitWords[0].split('(')[1]); }
        const brightness: number = this.getFilterValue(this.adjustmentLevel.brightness);
        const saturation: number = this.getFilterValue(this.adjustmentLevel.saturation);
        if (type !== 'brightness' && type !== 'contrast' && type !== 'hue' && type !== 'saturation' && type !== 'exposure'
            && type !== 'opacity' && type !== 'blur') {
            if (isNullOrUndefined(isPreview) && (this.adjustmentLevel.sharpen || this.adjustmentLevel.bw)) {
                this.isUndoRedo = true;
                const temp: string = this.lowerContext.filter;
                this.lowerContext.filter = 'none';
                this.iterateObjColl(); this.freehandRedraw(this.lowerContext);
                this.lowerContext.filter = temp;
                this.isUndoRedo = false;
            }
        }
        if (brightness !== 1) {splitWords[4] = 'opacity(' + (opacityValue - 0.3) + ')'; }
        let saturate: number; let bright: number; let saturatePercent: number; let contrast: number;
        let tempFilter: string; let temp: string; let saturatePercentage: number;
        switch (type) {
        case 'brightness':
            if (parseFloat(splitWords[3].split('(')[1]) !== 100) {
                value += 0.1;
            }
            splitWords[0] = 'brightness(' + value + ')';
            this.adjustmentValue = splitWords.join(' ');
            break;
        case 'contrast':
            splitWords[1] = 'contrast(' + value + '%)';
            this.adjustmentValue = splitWords.join(' ');
            break;
        case 'hue':
            splitWords[2] = 'hue-rotate(' + value + 'deg)';
            this.adjustmentValue = splitWords.join(' ');
            break;
        case 'saturation':
            splitWords[3] = 'saturate(' + value + '%)';
            if (saturation !== 1) {
                splitWords[0] = 'brightness(' + (brightnessValue + 0.1) + ')';
            }
            this.adjustmentValue = splitWords.join(' ');
            break;
        case 'opacity':
            if (parseFloat(splitWords[0].split('(')[1]) !== 1) {
                value -= 0.2;
            }
            splitWords[4] = 'opacity(' + value + ')';
            this.adjustmentValue = splitWords.join(' ');
            break;
        case 'blur':
            splitWords[5] = 'blur(' + value + 'px)';
            this.adjustmentValue = splitWords.join(' ');
            break;
        case 'exposure':
            if (brightness !== 1) {splitWords[4] = 'opacity(' + (opacityValue - 0.3) + ')'; }
            if (value > 1) {
                value -= 1; value += brightness;
            }
            else if (value < 1) {
                value = 1 - value; value = brightness - value;
            }
            splitWords[0] = 'brightness(' + value + ')';
            this.adjustmentValue = splitWords.join(' ');
            break;
        case 'chrome':
            saturate = this.getSaturationFilterValue(this.adjustmentLevel.saturation);
            saturate *= 100;
            value = saturate + (saturate * 0.4);
            splitWords[3] = 'saturate(' + value + '%)';
            values = this.adjustmentValue.split(' ');
            splitWords[0] = values[0];
            splitWords[1] = values[1];
            splitWords[2] = values[2];
            splitWords[4] = values[4];
            splitWords[5] = values[5];
            splitWords[6] = 'sepia(0%)';
            splitWords[7] = 'grayscale(0%)';
            splitWords[8] = 'invert(0%)';
            break;
        case 'cold':
            // Adjusting Brightness
            bright = this.getFilterValue(this.adjustmentLevel.brightness);
            bright *= 100;
            value = bright * 0.9;
            splitWords[0] = 'brightness(' + value + '%)';
            // Adjusting Contrast
            contrast = this.getFilterValue(this.adjustmentLevel.contrast);
            contrast *= 100;
            value = contrast + (contrast * 0.5);
            splitWords[1] = 'contrast(' + value + '%)';
            // Adjusting Saturation
            saturatePercentage = this.getSaturationFilterValue(this.adjustmentLevel.saturation);
            saturatePercentage *= 100;
            value = saturatePercentage;
            splitWords[3] = 'saturate(' + value + '%)';
            values = this.adjustmentValue.split(' ');
            splitWords[2] = values[2];
            splitWords[4] = values[4];
            splitWords[5] = values[5];
            splitWords[6] = 'sepia(0%)';
            splitWords[7] = 'grayscale(0%)';
            splitWords[8] = 'invert(0%)';
            break;
        case 'warm':
            saturatePercent = this.getSaturationFilterValue(this.adjustmentLevel.saturation);
            saturatePercent *= 100;
            value = saturatePercent + (saturatePercent * 0.4);
            splitWords[3] = 'saturate(' + value + '%)';
            splitWords[6] = 'sepia(25%)';
            values = this.adjustmentValue.split(' ');
            splitWords[0] = values[0];
            splitWords[1] = values[1];
            splitWords[2] = values[2];
            splitWords[4] = values[4];
            splitWords[5] = values[5];
            splitWords[7] = 'grayscale(0%)';
            splitWords[8] = 'invert(0%)';
            break;
        case 'grayscale':
            splitWords[7] = 'grayscale(100%)';
            values = this.adjustmentValue.split(' ');
            splitWords[0] = values[0];
            splitWords[1] = values[1];
            splitWords[2] = values[2];
            splitWords[3] = values[3];
            splitWords[4] = values[4];
            splitWords[5] = values[5];
            splitWords[6] = 'sepia(0%)';
            splitWords[8] = 'invert(0%)';
            break;
        case 'sepia':
            splitWords[6] = 'sepia(100%)';
            values = this.adjustmentValue.split(' ');
            splitWords[0] = values[0];
            splitWords[1] = values[1];
            splitWords[2] = values[2];
            splitWords[3] = values[3];
            splitWords[4] = values[4];
            splitWords[5] = values[5];
            splitWords[7] = 'grayscale(0%)';
            splitWords[8] = 'invert(0%)';
            break;
        case 'invert':
            splitWords[8] = 'invert(100%)';
            values = this.adjustmentValue.split(' ');
            splitWords[0] = values[0];
            splitWords[1] = values[1];
            splitWords[2] = values[2];
            splitWords[3] = values[3];
            splitWords[4] = values[4];
            splitWords[5] = values[5];
            splitWords[6] = 'sepia(0%)';
            splitWords[7] = 'grayscale(0%)';
            break;
        }
        if (type !== 'sharpen' && type !== 'blackandwhite') {
            if (isNullOrUndefined(isPreview)) {
                if (type === 'default') {
                    splitWords = this.getDefaultCurrentFilter(splitWords);
                }
                this.lowerContext.filter = splitWords.join(' ');
            }
            splitWords = this.setTempFilterValue(brightness, isPreview, splitWords, type);
            this.isRotateZoom = true;
            this.updateCurrentTransformedState('initial');
            this.lowerContext.drawImage(this.baseImg, this.srcLeft, this.srcTop, this.srcWidth,
                                        this.srcHeight, this.destLeft, this.destTop, this.destWidth, this.destHeight);
            this.updateCurrentTransformedState('reverse');
            this.isRotateZoom = false;
            if (brightness !== 1) {
                splitWords[4] = 'opacity(' + opacityValue + ')';
            } else if (saturation !== 1) {
                splitWords[0] = 'brightness(' + brightnessValue + ')';
            }
            if (type === 'exposure' && brightness !== 1) {
                splitWords[0] = 'brightness(' + brightnessValue + ')';
            }
            if (type === 'saturation' && saturation !== 1) {
                splitWords[0] = 'brightness(' + brightnessValue + ')';
            }
            splitWords = this.setTempFilterValue(brightness, isPreview, splitWords, type);
            if (isNullOrUndefined(isPreview)) {this.lowerContext.filter = this.initialAdjustmentValue = splitWords.join(' '); }
            const tempFilter: string = this.lowerContext.filter;
            this.lowerContext.filter = this.getDefaultFilter();
            this.iterateObjColl(); this.freehandRedraw(this.lowerContext);
            this.lowerContext.filter = tempFilter;
            if ((!isNullOrUndefined(this.currSelectionPoint) && this.currSelectionPoint.shape === 'crop-circle') || this.isCircleCrop) {
                this.cropCircle(this.lowerContext);
            }
            if (brightness === 1) {
                this.isBrightnessAdjusted = false;
            } else {
                this.isBrightnessAdjusted = true;
            }
        }
        const filter: string = splitWords.join(' ');
        return filter;
    }

    private autoEnablePan(): void {
        if (this.zoomFactor === 0) {
            this.dragCanvas = this.togglePan = false;
            this.callMainToolbar(false, true);
            this.pan(false);
            this.disablePan = false;
        } else if (!this.disablePan) {
            this.pan(true);
        } else if (this.disablePan) {
            this.pan(false);
        }
    }

    private setTempFilterValue(brightness: number, isPreview: boolean, splitWords: string[], type: string): string[] {
        if (isPreview && brightness !== 1) {
            const tempSplitWords: string[] = this.lowerContext.filter.split(' ');
            tempSplitWords[4] = splitWords[4];
            this.lowerContext.filter = tempSplitWords.join(' ');
        } else if (isPreview && type === 'default') {
            splitWords = this.getDefaultCurrentFilter(splitWords);
        }
        return splitWords;
    }

    private getDefaultCurrentFilter(splitWords: string[]): string[] {
        const values: string[] = this.adjustmentValue.split(' ');
        splitWords[0] = values[0];
        splitWords[1] = values[1];
        splitWords[2] = values[2];
        splitWords[3] = values[3];
        splitWords[4] = values[4];
        splitWords[5] = values[5];
        splitWords[6] = 'sepia(0%)';
        splitWords[7] = 'grayscale(0%)';
        splitWords[8] = 'invert(0%)';
        return splitWords;
    }

    private renderSlider(type: string): void {
        const canvasWrapper: HTMLElement = document.querySelector('#' + this.element.id + '_contextualToolbarArea');
        let hdrWrapper: HTMLElement = document.querySelector('#' + this.element.id + '_headWrapper');
        let labelWrapper: HTMLElement = document.querySelector('#' + this.element.id + '_labelWrapper');
        if (!hdrWrapper) {
            hdrWrapper = canvasWrapper.appendChild(this.createElement('div', {
                id: this.element.id + '_headWrapper',
                styles: 'position: relative'
            }));
            labelWrapper = hdrWrapper.appendChild(this.createElement('label', {
                id: this.element.id + '_labelWrapper',
                styles: Browser.isDevice ? 'position: absolute; top: 25%; left: calc(50% - 150px); font-size: 15px; text-transform: capitalize; font-weight: 400;'
                    : 'position: absolute; top: 25%; left: calc(50% - 226px); font-size: 15px; text-transform: capitalize; font-weight: 400;'
            }));
        } else {
            hdrWrapper.style.display = 'block';
        }
        labelWrapper.textContent = this.l10n.getConstant(this.toPascalCase(type));
        const sliderWrapper: HTMLElement = hdrWrapper.appendChild(this.createElement('div', {
            id: this.element.id + '_sliderWrapper',
            styles: 'position: absolute'
        }));
        const value: number = this.getCurrAdjustmentValue(type);
        let min: number; let max: number;
        let slider: Slider;
        if (type === 'brightness' || type === 'contrast' || type === 'saturation' || type === 'exposure') {
            if (this.finetuneSettings) {
                if (type === 'brightness' && this.finetuneSettings.brightness) {
                    min = this.finetuneSettings.brightness.min; max = this.finetuneSettings.brightness.max;
                } else if (type === 'contrast' && this.finetuneSettings.contrast) {
                    min = this.finetuneSettings.contrast.min; max = this.finetuneSettings.contrast.max;
                } else if (type === 'saturation' && this.finetuneSettings.saturation) {
                    min = this.finetuneSettings.saturation.min; max = this.finetuneSettings.saturation.max;
                } else if (type === 'exposure' && this.finetuneSettings.exposure) {
                    min = this.finetuneSettings.exposure.min; max = this.finetuneSettings.exposure.max;
                } else {
                    min = -100; max = 100;
                }
            } else {
                min = -100; max = 100;
            }
            slider = this.createSlider(min, max, value, type);
        }
        else if (type === 'hue' || type === 'blur' || type === 'opacity') {
            if (this.finetuneSettings) {
                if (type === 'hue' && this.finetuneSettings.hue) {
                    min = this.finetuneSettings.hue.min; max = this.finetuneSettings.hue.max;
                } else if (type === 'blur' && this.finetuneSettings.blur) {
                    min = this.finetuneSettings.blur.min; max = this.finetuneSettings.blur.max;
                } else if (type === 'opacity' && this.finetuneSettings.opacity) {
                    min = this.finetuneSettings.opacity.min; max = this.finetuneSettings.opacity.max;
                } else {
                    min = 0; max = 100;
                }
            } else {
                min = 0; max = 100;
            }
            slider = this.createSlider(min, max, value, type);
        }
        slider.appendTo('#' + this.element.id + '_sliderWrapper');
        sliderWrapper.style.left = (parseFloat(canvasWrapper.style.width) - parseFloat(slider.width as string)) / 2 + 'px';
    }

    private createSlider(min: number, max: number, value: number, type: string): Slider {
        return new Slider({
            value: value,
            tooltip: { isVisible: true, placement: 'Before', showOn: 'Always' },
            type: 'MinRange',
            min: min,
            max: max,
            step: 10,
            width: Browser.isDevice ? '200px' : '300px',
            cssClass: 'e-slider',
            change: (args: SliderChangeEventArgs): void => {
                this.setCurrAdjustmentValue(type, args.value as number);
                this.enableDisableToolbarBtn();
            }
        });
    }

    private getCurrAdjustmentValue(type: string): number {
        let value: number;
        switch (type) {
        case 'brightness':
            value = this.adjustmentLevel.brightness;
            break;
        case 'contrast':
            value = this.adjustmentLevel.contrast;
            break;
        case 'hue':
            value = this.adjustmentLevel.hue;
            break;
        case 'saturation':
            value = this.adjustmentLevel.saturation;
            break;
        case 'opacity':
            value = this.adjustmentLevel.opacity;
            break;
        case 'blur':
            value = this.adjustmentLevel.blur;
            break;
        case 'exposure':
            value = this.adjustmentLevel.exposure;
            break;
        }
        return value;
    }

    private setCurrAdjustmentValue(type: string, value: number): void {
        const finetuneValueChanging: FinetuneEventArgs = { finetune: this.toPascalCase(type) as ImageFinetuneOptions, value: value };
        this.trigger('finetuneValueChanging', finetuneValueChanging);
        switch (type) {
        case 'brightness':
            this.setBrightness(value);
            break;
        case 'contrast':
            this.setContrast(value);
            break;
        case 'hue':
            this.setHue(value);
            break;
        case 'saturation':
            this.setSaturation(value);
            break;
        case 'opacity':
            this.setOpacity(value);
            break;
        case 'blur':
            this.setBlur(value);
            break;
        case 'exposure':
            this.setExposure(value);
            break;
        }
    }

    private cancelPan(): void {
        this.applyActObj();
        const panBtn: HTMLElement = this.element.querySelector('.e-img-pan .e-btn');
        if (!isNullOrUndefined(panBtn)) {
            panBtn.classList.remove('e-selected-btn');
        }
        this.pan(false);
    }

    private callMainToolbar(isApplyBtn?: boolean, isZooming?: boolean): void {
        this.refreshToolbar('main', isApplyBtn, false, isZooming);
    }

    private setCurrSelectionPoints(isSetDimension?: boolean): void {
        this.srcLeft = 0; this.srcTop = 0;
        this.srcWidth = this.baseImg.width; this.srcHeight = this.baseImg.height;
        this.destLeft = this.cropDestPoints.startX; this.destTop = this.cropDestPoints.startY;
        this.destWidth = this.cropDestPoints.width; this.destHeight = this.cropDestPoints.height;
        this.lowerContext.clearRect(0, 0 , this.lowerCanvas.width, this.lowerCanvas.height);
        if (isSetDimension) {
            this.setDestinationPoints();
        }
        this.currentTransformedState('initial');
        if (this.croppedDegree === 0 && this.degree === 0 && !isNullOrUndefined(this.currSelectionPoint)
        && this.currSelectionPoint.shape !== 'crop-circle' && this.currSelectionPoint.shape !== 'crop-square') {
            this.destLeft = this.cropDestPoints.startX; this.destTop = this.cropDestPoints.startY;
            this.destWidth = this.cropDestPoints.width; this.destHeight = this.cropDestPoints.height;
        }
        if (this.degree === 0) {
            this.destLeft += this.totalPannedInternalPoint.x; this.destTop += this.totalPannedInternalPoint.y;
        }
        this.updateBrightnessFilter();
        this.lowerContext.drawImage(this.baseImg, this.srcLeft, this.srcTop, this.srcWidth, this.srcHeight,
                                    this.destLeft, this.destTop, this.destWidth, this.destHeight);
        this.currentTransformedState('reverse', null, null, true);
        if (isNullOrUndefined(this.cropObj.activeObj.shape)) {
            const temp: string = this.lowerContext.filter;
            this.lowerContext.filter = 'none';
            this.iterateObjColl(); this.freehandRedraw(this.lowerContext);
            this.lowerContext.filter = temp;
        } else {
            this.setCropObj();
        }
        this.currSelectionPoint = null;
    }

    private updateObjAndFreeHandDrawColl(): void {
        for (let i: number = 0; i < this.objColl.length; i++) {
            this.objColl[i as number].imageRatio = {startX: ((this.objColl[i as number].activePoint.startX - this.destLeft) /
            this.destWidth), startY: ((this.objColl[i as number].activePoint.startY - this.destTop) / this.destHeight),
            endX: ((this.objColl[i as number].activePoint.endX - this.destLeft) / this.destWidth),
            endY: ((this.objColl[i as number].activePoint.endY - this.destTop) / this.destHeight),
            width: this.destWidth / this.objColl[i as number].activePoint.width, height: this.destHeight /
            this.objColl[i as number].activePoint.height };
            this.refreshActiveObj();
        }
        for (let n: number = 0; n < this.freehandCounter; n++) {
            this.points = extend([], this.pointColl[n as number].points, []) as Point[];
            this.pointCounter = 0;
            const len: number = this.points.length;
            for (let l: number = 0; l < len; l++) {
                this.points[l as number].ratioX = (this.points[l as number].x - this.destLeft) / this.destWidth;
                this.points[l as number].ratioY = (this.points[l as number].y - this.destTop) / this.destHeight;
            }
        }
    }

    private cancelItems(): void {
        let isCropSelection: boolean = false;
        let splitWords: string[];
        if (this.activeObj.shape !== undefined) {splitWords = this.activeObj.shape.split('-'); }
        if (splitWords === undefined && this.currObjType.isCustomCrop) {
            isCropSelection = true;
        } else if (splitWords !== undefined && splitWords[0] === 'crop'){
            isCropSelection = true;
        }
        if (isCropSelection && this.isCropTab) {
            this.isCropTab = false;
            this.zoomFactor = this.defaultZoomFactor;
        }
        if (this.togglePen) {
            this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
            this.togglePen = false;
            this.upperCanvas.style.cursor = 'default';
            // eslint-disable-next-line
            const tempPointsColl: any = extend([], this.pointColl, [], true);
            this.pointColl = {};
            for (let i: number = 0; i < this.tempFreehandCounter; i++) {
                this.pointColl[i as number] = tempPointsColl[i as number];
            }
            this.freehandCounter = this.tempFreehandCounter;
            this.currentFreehandDrawIndex = this.tempCurrentFreehandDrawIndex;
        } else if (this.activeObj.shape === 'text') {
            if (isNullOrUndefined(this.activeObj.currIndex)) {
                this.refreshActiveObj();
                this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
            } else {
                this.activeObj.strokeSettings = this.tempStrokeSettings;
                this.activeObj.textSettings = this.tempTextSettings;
                if (this.activeObj.keyHistory === 'Enter Text' && this.activeObj.activePoint.startX === this.textStartPoints.x
                && this.activeObj.activePoint.startY === this.textStartPoints.y) {
                    this.refreshActiveObj();
                    this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
                    this.textSettings = this.tempTextSettings;
                    this.strokeSettings = this.tempStrokeSettings;
                    this.drawShapeText();
                    this.applyActObj();
                } else {
                    this.redrawText();
                    this.redrawShape(this.activeObj);
                    if (!isCropSelection && this.activeObj.topLeftCircle !== undefined) {this.applyActObj(); }
                    this.clearSelection();
                }
            }
            this.tempTextSettings = {text: 'Enter Text', fontFamily: 'Arial', fontSize: null, fontRatio: null, bold: false,
                italic: false, underline: false};
        } else if (this.activeObj.shape === 'rectangle' || this.activeObj.shape === 'ellipse' || this.activeObj.shape === 'line') {
            if (isNullOrUndefined(this.activeObj.currIndex)) {
                this.refreshActiveObj();
                this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
            } else {
                this.activeObj.strokeSettings = this.tempStrokeSettings;
                this.redrawShape(this.activeObj);
                this.applyActObj();
            }
        } else if ((this.zoomFactor !== this.tempZoomFactor) || isCropSelection && isNullOrUndefined(this.currSelectionPoint)) {
            const length: number = this.cropZoomFactor - this.tempZoomFactor;
            this.zoomFactor = this.cropZoomFactor;
            if (isNullOrUndefined(this.cropObj.activeObj.shape)) {
                if ((this.degree === 0 && this.totalPannedPoint.x === 0 && this.totalPannedPoint.y === 0) ||
                    (this.degree !== 0 && this.totalPannedInternalPoint.x === 0 && this.totalPannedInternalPoint.y === 0 &&
                    this.totalPannedClientPoint.x === 0 && this.totalPannedClientPoint.y === 0)) {
                    this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
                    this.refreshActiveObj();
                    if (length > 0) {
                        this.zoom(-length);
                    } else {
                        this.zoom(Math.abs(length));
                    }
                    this.cropZoomFactor = this.tempZoomFactor;
                    this.currObjType.isCustomCrop = false;
                    this.upperCanvas.style.cursor = 'default'; this.currObjType.isCustomCrop = false;
                    this.tempStrokeSettings = {strokeColor: '#fff', fillColor: '', strokeWidth: null};
                    this.callMainToolbar();
                    return;
                }
            }
            if (isNullOrUndefined(this.cropObj.activeObj.shape)) {
                if (this.degree === 0) {
                    const activeObj: SelectionPoint = extend({}, this.activeObj, {}) as SelectionPoint;
                    this.destLeft += (-this.totalPannedPoint.x);
                    this.destTop += (-this.totalPannedPoint.y);
                    this.drawPannImage({x: -this.totalPannedPoint.x, y: -this.totalPannedPoint.y}, this.getCurrentPanRegion());
                    this.updateFlipPan(activeObj);
                    this.totalPannedPoint = {x: 0, y: 0};
                } else {
                    this.totalPannedClientPoint = {x: -this.totalPannedClientPoint.x, y: -this.totalPannedClientPoint.y};
                    this.totalPannedInternalPoint = {x: -this.totalPannedInternalPoint.x, y: -this.totalPannedInternalPoint.y};
                    this.rotatePan(true);
                    this.totalPannedClientPoint = {x: 0, y: 0};
                    this.totalPannedInternalPoint = {x: 0, y: 0};
                    this.currentPannedPoint = {x: 0, y: 0};
                }
                this.refreshActiveObj();
                this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
                if (length > 0) {
                    this.zoom(-length);
                } else {
                    this.zoom(Math.abs(length));
                }
            } else {
                this.isCancelAction = true;
                this.objColl = []; this.pointColl = [];
                const freehandCounter: number = this.freehandCounter;
                this.freehandCounter = 0;
                const cropObj: CroppedObject = extend({}, this.cropObj, {}) as CroppedObject;
                const afterCropActions: string[] = extend([], this.afterCropActions, {}, true) as string[];
                this.setCropObj();
                this.cropImg();
                this.cropObj = cropObj;
                this.afterCropActions = afterCropActions;
                this.objColl = extend([], this.cancelObjColl, [], true) as SelectionPoint[];
                this.pointColl = extend([], this.cancelPointColl, [], true) as Point[];
                this.freehandCounter = freehandCounter;
                this.iterateObjColl(); this.freehandRedraw(this.lowerContext);
                this.clearOuterCanvas(this.lowerContext);
                if (this.isCircleCrop) {this.cropCircle(this.lowerContext); }
                this.isCancelAction = false;
            }
            this.zoomFactor = this.defaultZoomFactor;
            this.enableDisableToolbarBtn();
        } else {
            this.refreshActiveObj();
            this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
        }
        this.upperCanvas.style.cursor = 'default'; this.currObjType.isCustomCrop = false;
        this.tempStrokeSettings = {strokeColor: '#fff', fillColor: '', strokeWidth: null};
        this.callMainToolbar();
    }

    private freehandDownHandler(e: MouseEvent & TouchEvent, canvas: HTMLCanvasElement): void {
        this.freehandDrawObj.time = new Date().getTime();
        this.isFreehandDrawing = true;
        if (e.type === 'mousedown') {
            this.freehandDownPoint = {x: e.clientX, y: e.clientY};
        } else {
            this.freehandDownPoint = {x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
        this.isFreehandPointMoved = false;
        EventHandler.add(canvas, 'mousemove touchmove', this.freehandMoveHandler, this);
    }

    private freehandUpHandler(e: MouseEvent & TouchEvent, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): void {
        const rect: DOMRect = canvas.getBoundingClientRect() as DOMRect;
        EventHandler.remove(canvas, 'mousemove touchmove', this.freehandMoveHandler);
        if (this.points.length === 0) {
            if (e.type === 'mouseup') {
                this.processPoint(e.clientX - rect.left, e.clientY - rect.top, true, context);
            } else {
                if (!this.isFreehandPointMoved) {
                    this.processPoint(this.freehandDownPoint.x - rect.left, this.freehandDownPoint.y - rect.top, true, context);
                }
            }
        }
        context.closePath();
        this.pointColl[this.freehandCounter] = {};
        this.pointColl[this.freehandCounter].points = extend([], this.points);
        this.pointColl[this.freehandCounter].strokeColor = this.activeObj.strokeSettings.strokeColor;
        this.pointColl[this.freehandCounter].strokeWidth = this.penStrokeWidth;
        this.pointColl[this.freehandCounter].flipState = this.currFlipState;
        this.pointColl[this.freehandCounter].id = 'pen_' + (this.currentFreehandDrawIndex + 1);
        this.points = [];
        this.pointCounter = 0;
        this.freehandCounter++; this.currentFreehandDrawIndex++;
        this.isFreehandDrawing = false;
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const currentObj: any = extend([], this.pointColl, [], true);
        this.pointColl = {};
        for (let i: number = 0; i < this.freehandCounter - 1; i++) {
            this.pointColl[i as number] = currentObj[i as number];
        }
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const previousObj: any = extend([], this.pointColl, [], true);
        this.updateUndoRedoColl('freehanddraw', null, previousObj, currentObj, this.zoomFactor);
        this.pointColl = currentObj;
    }
    private freehandMoveHandler(e: MouseEvent & TouchEvent): void {
        this.isFreehandPointMoved = true;
        const rect: DOMRect = this.upperCanvas.getBoundingClientRect() as DOMRect;
        let x: number; let y: number;
        if (e.type === 'mousemove') {
            x = e.clientX - rect.left; y = e.clientY - rect.top;
        } else {
            x = e.touches[0].clientX - rect.left; y = e.touches[0].clientY - rect.top;
        }
        if (this.isFreehandDrawing) {
            this.processPoint(x, y, false, this.upperContext);
        }
    }

    private processPoint(x: number, y: number, mouseDown: boolean, context: CanvasRenderingContext2D): void {
        let lastPoint: Point = this.point(x, y, new Date().getTime());
        lastPoint = this.points.length > 0 && this.points[this.points.length - 1];
        const isLastPointTooClose: boolean = lastPoint ? this.distanceTo(lastPoint) <= 5 : false;
        let controlPoint1: Point; let controlPoint2: Point;
        let startPoint: Point; let endPoint: Point;
        if (!lastPoint || !(lastPoint && isLastPointTooClose) || mouseDown) {
            this.freehandDrawObj.time = new Date().getTime();
            this.points.push({x: x, y: y, ratioX: (x - this.destLeft) / this.destWidth, ratioY: (y - this.destTop) / this.destHeight,
                time: this.freehandDrawObj.time });
            if (this.points.length > 3) {
                controlPoint1 = (this.calcCurveControlPoints(this.points[this.pointCounter + 0], this.points[this.pointCounter + 1],
                                                             this.points[this.pointCounter + 2])).controlPoint2;
                controlPoint2 = (this.calcCurveControlPoints(this.points[this.pointCounter + 1], this.points[this.pointCounter + 2],
                                                             this.points[this.pointCounter + 3])).controlPoint1;
                startPoint = this.points[this.pointCounter + 1];
                endPoint = this.points[this.pointCounter + 2];
                let minStrokeWidth: number = 0.5; let maxStrokeWidth: number = 5;
                if (!isNullOrUndefined(this.penStrokeWidth)) {
                    minStrokeWidth = maxStrokeWidth = this.penStrokeWidth;
                }
                this.startDraw(context, controlPoint1, controlPoint2, startPoint, endPoint, minStrokeWidth, maxStrokeWidth);
                this.pointCounter++;
            }
            if (mouseDown) {
                controlPoint1 = controlPoint2 = startPoint = endPoint = {x: x, y: y, time: new Date().getTime()};
                let minStrokeWidth: number = 0.5; let maxStrokeWidth: number = 5;
                if (!isNullOrUndefined(this.penStrokeWidth)) {
                    minStrokeWidth = maxStrokeWidth = this.penStrokeWidth;
                }
                this.startDraw(context, controlPoint1, controlPoint2, startPoint, endPoint, minStrokeWidth, maxStrokeWidth);
            }
        }
    }

    private calcCurveControlPoints(p1: Point, p2: Point, p3: Point): {controlPoint1: Point, controlPoint2: Point} {
        if (!p2) { p2 = p1; }
        if (!p3) { p3 = p2; }
        const dx1: number = p1.x - p2.x; const dy1: number = p1.y - p2.y;
        const dx2: number = p2.x - p3.x; const dy2: number = p2.y - p3.y;
        const m1: Point = { x: (p1.x + p2.x) / 2.0, y: (p1.y + p2.y) / 2.0 };
        const m2: Point = { x: (p2.x + p3.x) / 2.0, y: (p2.y + p3.y) / 2.0 };
        const l1: number = Math.sqrt(dx1 * dx1 + dy1 * dy1);
        const l2: number = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        const dxm: number = (m1.x - m2.x); const dym: number = (m1.y - m2.y);
        const k: number = l2 / (l1 + l2);
        const cm: Point = { x: m2.x + dxm * k, y: m2.y + dym * k };
        const tx: number = p2.x - cm.x; const ty: number = p2.y - cm.y;
        return {
            controlPoint1: this.point(m1.x + tx, m1.y + ty, 0),
            controlPoint2: this.point(m2.x + tx, m2.y + ty, 0)
        };
    }

    private point(x: number, y: number, time: number): Point {
        this.freehandDrawObj.pointX = x;
        this.freehandDrawObj.pointY = y;
        return {x: this.freehandDrawObj.pointX, y: this.freehandDrawObj.pointY, time: time};
    }

    private startDraw(context: CanvasRenderingContext2D, controlPoint1: Point, controlPoint2: Point,
                      startPoint: Point, endPoint: Point, minStrokeWidth: number, maxStrokeWidth: number): void {
        let tempVelocity: number;
        tempVelocity = this.pointVelocity(startPoint);
        tempVelocity = 0.7 * tempVelocity + (1 - 0.7) * this.freehandDrawObj.lastVelocity;
        const newWidth: number  = Math.max(maxStrokeWidth / (0.7 + 1), minStrokeWidth);
        this.drawCurve(this.freehandDrawObj.time, newWidth, context, controlPoint1, controlPoint2, startPoint, endPoint, maxStrokeWidth);
        this.freehandDrawObj.lastVelocity = tempVelocity; this.freehandDrawObj.time = newWidth;
    }

    private pointVelocity(startPoint: Point): number{
        return (this.freehandDrawObj.time !== startPoint.time) ? this.distanceTo(startPoint) /
        (this.freehandDrawObj.time - startPoint.time) : 0;
    }

    private distanceTo(start: Point): number{
        return Math.sqrt(Math.pow(this.freehandDrawObj.pointX - start.x, 2) + Math.pow(this.freehandDrawObj.pointY - start.y, 2));
    }

    private drawCurve(startWidth: number, endWidth: number, context: CanvasRenderingContext2D,
                      controlPoint1: Point, controlPoint2: Point, startPoint: Point, endPoint: Point,
                      maxStrokeWidth: number): void {
        let width: number; let i: number; let t1: number; let t2: number;
        let t3: number; let u1: number; let u2: number; let u3: number; let x: number; let y: number;
        const widthValue: number = endWidth - startWidth;
        const bezierLength: number = this.bezierLength(controlPoint1, controlPoint2, startPoint, endPoint);
        const drawSteps: number  = Math.ceil(bezierLength) * 2;
        context.beginPath();
        for (i = 0; i < drawSteps; i++) {
            t1 = i / drawSteps; t2 = t1 * t1; t3 = t2 * t1;
            u1 = 1 - t1; u2 = u1 * u1; u3 = u2 * u1;
            x = u3 * startPoint.x; x += 3 * u2 * t1 * controlPoint1.x;
            x += 3 * u1 * t2 * controlPoint2.x; x += t3 * endPoint.x;
            y = u3 * startPoint.y; y += 3 * u2 * t1 * controlPoint1.y;
            y += 3 * u1 * t2 * controlPoint2.y; y += t3 * endPoint.y;
            width = Math.min(startWidth + t3 * widthValue, maxStrokeWidth);
            this.drawArc(x, y, width, context);
        }
        context.closePath();
        context.fill();
    }

    private bezierLength(controlPoint1: Point, controlPoint2: Point, startPoint: Point, endPoint: Point): number {
        const steps: number = 10; let length: number = 0; let i: number; let t: number;
        let pointx1: number; let pointy1: number; let pointx2: number; let pointy2: number;
        let pointx3: number; let pointy3: number;
        for (i = 0; i <= steps; i++) {
            t = i / steps;
            pointx1 = this.bezierPoint(t, startPoint.x, controlPoint1.x, controlPoint2.x, endPoint.x);
            pointy1 = this.bezierPoint(t, startPoint.y, controlPoint1.y, controlPoint2.y, endPoint.y);
            if (i > 0) {
                pointx3 = pointx1 - pointx2;
                pointy3 = pointy1 - pointy2;
                length += Math.sqrt(pointx3 * pointx3 + pointy3 * pointy3);
            }
            pointx2 = pointx1;
            pointy2 = pointy1;
        }
        return length;
    }

    private bezierPoint(t: number, startpoint: number, cp1: number, cp2: number, endpoint: number): number {
        return startpoint * (1.0 - t) * (1.0 - t) * (1.0 - t) + 3.0 * cp1 * (1.0 - t) * (1.0 - t) * t + 3.0 *
        cp2 * (1.0 - t) * t * t + endpoint * t * t * t;
    }

    private drawArc(x: number, y: number, size: number, context: CanvasRenderingContext2D): void {
        if ((x > this.destLeft && y > this.destTop && x < (this.destLeft + this.destWidth) && y < (this.destTop + this.destHeight) ||
        (context !== this.lowerContext && context !== this.upperContext))) {
            context.moveTo(x, y);
            context.arc(x, y, size, 0, 2 * Math.PI, false);
        }
    }

    private freehandRedraw(context: CanvasRenderingContext2D, points?: Point[]): void {
        const temp: string = context.filter;
        context.filter = 'none';
        if (!isNullOrUndefined(points)) {
            this.pointColl[this.freehandCounter] = {};
            this.pointColl[this.freehandCounter].points = points;
            this.pointColl[this.freehandCounter].strokeColor = this.activeObj.strokeSettings.strokeColor;
            this.pointColl[this.freehandCounter].strokeWidth = this.penStrokeWidth;
            this.pointColl[this.freehandCounter].flipState = this.currFlipState;
            this.freehandCounter++;
        }
        for (let n: number = 0; n < this.freehandCounter; n++) {
            this.points = extend([], this.pointColl[n as number].points) as Point[];
            this.pointCounter = 0;
            const len: number = this.points.length;
            let controlPoint1: Point; let controlPoint2: Point;
            let startPoint: Point; let endPoint: Point;
            let minStrokeWidth: number; let maxStrokeWidth: number;
            if (len > 0) {
                context.fillStyle = this.pointColl[n as number].strokeColor;
                minStrokeWidth = maxStrokeWidth = this.penStrokeWidth = this.pointColl[n as number].strokeWidth;
            }
            if (len === 1) {
                controlPoint1 = controlPoint2 = startPoint = endPoint = this.points[0];
                this.startDraw(context, controlPoint1, controlPoint2, startPoint, endPoint, minStrokeWidth, maxStrokeWidth);
            }
            for (let l: number = 0; l < len - 3; l++) {
                if (this.points[l + 1] && this.points[l + 2] && this.points[l + 2]) {
                    controlPoint1 = (this.calcCurveControlPoints(this.points[l + 0],
                                                                 this.points[l + 1], this.points[l + 2])).controlPoint2;
                    controlPoint2 = (this.calcCurveControlPoints(this.points[l + 1], this.points[l + 2],
                                                                 this.points[l + 3])).controlPoint1;
                    startPoint = this.points[l + 1];
                    endPoint = this.points[l + 2];
                    this.startDraw(context, controlPoint1, controlPoint2, startPoint, endPoint, minStrokeWidth, maxStrokeWidth);
                }
            }
            context.closePath();
        }
        context.filter = temp;
    }

    private redrawImgWithObj(): void {
        this.lowerContext.filter = this.canvasFilter;
        this.getCurrentFlipState();
        if (this.isCircleCrop) {this.cropCircle(this.lowerContext); }
        const tempFilter: string = this.lowerContext.filter;
        this.lowerContext.filter = this.getDefaultFilter();
        this.iterateObjColl(); this.freehandRedraw(this.lowerContext);
        this.lowerContext.filter = tempFilter;
    }

    private refreshToolbar(type: string, isApplyBtn?: boolean, isCropping?: boolean, isZooming?: boolean, cType?: string): void {
        if (!this.isImageLoaded) {
            return;
        }
        const args: ToolbarEventArgs = { toolbarType: type };
        if (type !== 'filter' && type !== 'color') {
            if (document.getElementById(this.element.id + '_toolbar') && this.defToolbarItems.length > 0) {
                (getComponent(document.getElementById(this.element.id + '_toolbar'), 'toolbar') as Toolbar).destroy();
            }
            if (document.getElementById(this.element.id + '_bottomToolbar') && this.defToolbarItems.length > 0) {
                if (document.getElementById(this.element.id + '_bottomToolbar').className.indexOf('e-control') > -1) {
                    (getComponent(document.getElementById(this.element.id + '_bottomToolbar'), 'toolbar') as Toolbar).destroy();
                }
            }
        }
        this.refreshSlider();
        switch (type) {
        case 'main':
            if (Browser.isDevice) {
                if (isCropping) { this.initToolbarItem(false, true, true); }
                else { this.initToolbarItem(false, true, null); }
            } else if (!Browser.isDevice || isZooming) {
                if (isZooming) {
                    this.initToolbarItem(isApplyBtn, Browser.isDevice, null);
                } else {
                    this.initToolbarItem(isApplyBtn, Browser.isDevice, null);
                }
            }
            if (Browser.isDevice) { this.initBottomToolbar(); }
            break;
        case 'shapes':
            if (Browser.isDevice) {
                this.initToolbarItem(false, true, true);
            }
            if (this.activeObj.shape === 'line') {
                args.toolbarItems = ['strokeColor', 'strokeWidth'];
            } else {
                args.toolbarItems = ['fillColor', 'strokeColor', 'strokeWidth'];
            }
            this.trigger('toolbarUpdating', args);
            this.initShapesToolbarItem(args.toolbarItems);
            break;
        case 'text':
            if (Browser.isDevice) {
                this.initToolbarItem(false, true, true);
            }
            args.toolbarItems = ['fontFamily', 'fontStyle', 'fontSize', 'fontColor'];
            this.trigger('toolbarUpdating', args);
            this.initTextToolbarItem(args.toolbarItems);
            break;
        case 'pen':
            if (Browser.isDevice) {
                this.initToolbarItem(false, true, true);
            }
            args.toolbarItems = ['strokeColor', 'strokeWidth'];
            this.trigger('toolbarUpdating', args);
            this.initPenToolbarItem(args.toolbarItems);
            break;
        case 'pan':
            this.initZoomToolbarItem();
            break;
        case 'adjustment':
            if (Browser.isDevice) {
                this.initToolbarItem(false, true, true);
            }
            this.initAdjustmentToolbarItem();
            break;
        case 'filter':
            this.updateContextualToolbar(type);
            break;
        case 'color':
            this.updateContextualToolbar(type, cType);
            break;
        }
        this.refreshDropDownBtn(isCropping);
    }

    private getAdjustmentToolbarItem(): ItemModel[] {
        const toolbarItems: ItemModel[] = [];
        if (isNullOrUndefined(this.toolbar) || (!isNullOrUndefined(this.toolbar) && this.toolbar.indexOf('Brightness') > -1)) {
            toolbarItems.push({ id: this.element.id + '_brightness', prefixIcon: 'e-icons e-brightness', cssClass: 'top-icon e-brightness',
                tooltipText: this.l10n.getConstant('Brightness'), align: 'Center' });
        }
        if (isNullOrUndefined(this.toolbar) || (!isNullOrUndefined(this.toolbar) && this.toolbar.indexOf('Contrast') > -1)) {
            toolbarItems.push({ id: this.element.id + '_contrast', prefixIcon: 'e-icons e-contrast', cssClass: 'top-icon e-contrast',
                tooltipText: this.l10n.getConstant('Contrast'), align: 'Center' });
        }
        if (isNullOrUndefined(this.toolbar) || (!isNullOrUndefined(this.toolbar) && this.toolbar.indexOf('Hue') > -1)) {
            toolbarItems.push({ id: this.element.id + '_hue', prefixIcon: 'e-icons e-fade', cssClass: 'top-icon e-fade',
                tooltipText: this.l10n.getConstant('Hue'), align: 'Center' });
        }
        if (isNullOrUndefined(this.toolbar) || (!isNullOrUndefined(this.toolbar) && this.toolbar.indexOf('Saturation') > -1)) {
            toolbarItems.push({ id: this.element.id + '_saturation', prefixIcon: 'e-icons e-saturation', cssClass: 'top-icon e-saturation',
                tooltipText: this.l10n.getConstant('Saturation'), align: 'Center' });
        }
        if (isNullOrUndefined(this.toolbar) || (!isNullOrUndefined(this.toolbar) && this.toolbar.indexOf('Exposure') > -1)) {
            toolbarItems.push({ id: this.element.id + '_exposure', prefixIcon: 'e-icons e-grain', cssClass: 'top-icon e-grain',
                tooltipText: this.l10n.getConstant('Exposure'), align: 'Center' });
        }
        if (isNullOrUndefined(this.toolbar) || (!isNullOrUndefined(this.toolbar) && this.toolbar.indexOf('Opacity') > -1)) {
            toolbarItems.push({ id: this.element.id + '_opacity', prefixIcon: 'e-icons e-opacity', cssClass: 'top-icon e-opacity',
                tooltipText: this.l10n.getConstant('Opacity'), align: 'Center' });
        }
        if (isNullOrUndefined(this.toolbar) || (!isNullOrUndefined(this.toolbar) && this.toolbar.indexOf('Blur') > -1)) {
            toolbarItems.push({ id: this.element.id + '_blur', prefixIcon: 'e-icons e-tint', cssClass: 'top-icon e-tint',
                tooltipText: this.l10n.getConstant('Blur'), align: 'Center' });
        }
        const tempToolbarItems: ItemModel[] = this.processToolbar('center');
        for (let i: number = 0, len: number = tempToolbarItems.length; i < len; i++) {
            toolbarItems.push(tempToolbarItems[i as number]);
        }
        if (!Browser.isDevice) {
            toolbarItems.push({ id: this.element.id + '_ok', prefixIcon: 'e-icons e-check', cssClass: 'top-icon e-tick',
                tooltipText: this.l10n.getConstant('OK'), align: 'Right' });
            toolbarItems.push({ id: this.element.id + '_cancel', prefixIcon: 'e-icons e-close', cssClass: 'top-icon e-save',
                tooltipText: this.l10n.getConstant('Cancel'), align: 'Right' });
        }
        return toolbarItems;
    }

    private getFilterToolbarItem(): ItemModel[] {
        const toolbarItems: ItemModel[] = [];
        if (isNullOrUndefined(this.toolbar) || (!isNullOrUndefined(this.toolbar) && this.toolbar.indexOf('Default') > -1)) {
            toolbarItems.push({ id: this.element.id + '_default', prefixIcon: 'e-icons e-none', cssClass: 'top-icon e-none',
                tooltipText: this.l10n.getConstant('Default'), align: 'Center',
                template: '<div class="filterwrapper" style="box-sizing: content-box;"><canvas id=' + this.element.id + '_defaultCanvas' + '></canvas><div style="text-align:center;"><span>' + this.l10n.getConstant('Default') + '</span></div></div>' });
        }
        if (isNullOrUndefined(this.toolbar) || (!isNullOrUndefined(this.toolbar) && this.toolbar.indexOf('Chrome') > -1)) {
            toolbarItems.push({ id: this.element.id + '_chrome', prefixIcon: 'e-icons e-none', cssClass: 'top-icon e-none',
                tooltipText: this.l10n.getConstant('Chrome'), align: 'Center',
                template: '<div class="filterwrapper" style="box-sizing: content-box;"><canvas id=' + this.element.id + '_chromeCanvas' + '></canvas><div style="text-align:center;"><span>' + this.l10n.getConstant('Chrome') + '</span></div></div>' });
        }
        if (isNullOrUndefined(this.toolbar) || (!isNullOrUndefined(this.toolbar) && this.toolbar.indexOf('Cold') > -1)) {
            toolbarItems.push({ id: this.element.id + '_cold', prefixIcon: 'e-icons e-none', cssClass: 'top-icon e-none',
                tooltipText: this.l10n.getConstant('Cold'), align: 'Center',
                template: '<div class="filterwrapper" style="box-sizing: content-box;"><canvas id=' + this.element.id + '_coldCanvas' + '></canvas><div style="text-align:center;"><span>' + this.l10n.getConstant('Cold') + '</span></div></div>' });
        }
        if (isNullOrUndefined(this.toolbar) || (!isNullOrUndefined(this.toolbar) && this.toolbar.indexOf('Warm') > -1)) {
            toolbarItems.push({ id: this.element.id + '_warm', prefixIcon: 'e-icons e-none', cssClass: 'top-icon e-none',
                tooltipText: this.l10n.getConstant('Warm'), align: 'Center',
                template: '<div class="filterwrapper" style="box-sizing: content-box;"><canvas id=' + this.element.id + '_warmCanvas' + '></canvas><div style="text-align:center;"><span>' + this.l10n.getConstant('Warm') + '</span></div></div>' });
        }
        if (isNullOrUndefined(this.toolbar) || (!isNullOrUndefined(this.toolbar) && this.toolbar.indexOf('Grayscale') > -1)) {
            toolbarItems.push({ id: this.element.id + '_grayscale', prefixIcon: 'e-icons e-none', cssClass: 'top-icon e-none',
                tooltipText: this.l10n.getConstant('Grayscale'), align: 'Center',
                template: '<div class="filterwrapper" style="box-sizing: content-box;"><canvas id=' + this.element.id + '_grayscaleCanvas' + '></canvas><div style="text-align:center;"><span>' + this.l10n.getConstant('Grayscale') + '</span></div></div>' });
        }
        if (isNullOrUndefined(this.toolbar) || (!isNullOrUndefined(this.toolbar) && this.toolbar.indexOf('Sepia') > -1)) {
            toolbarItems.push({ id: this.element.id + '_sepia', prefixIcon: 'e-icons e-none', cssClass: 'top-icon e-none',
                tooltipText: this.l10n.getConstant('Sepia'), align: 'Center',
                template: '<div class="filterwrapper" style="box-sizing: content-box;"><canvas id=' + this.element.id + '_sepiaCanvas' + '></canvas><div style="text-align:center;"><span>' + this.l10n.getConstant('Sepia') + '</span></div></div>' });
        }
        if (isNullOrUndefined(this.toolbar) || (!isNullOrUndefined(this.toolbar) && this.toolbar.indexOf('Invert') > -1)) {
            toolbarItems.push({ id: this.element.id + '_invert', prefixIcon: 'e-icons e-none', cssClass: 'top-icon e-none',
                tooltipText: this.l10n.getConstant('Invert'), align: 'Center',
                template: '<div class="filterwrapper" style="box-sizing: content-box;"><canvas id=' + this.element.id + '_invertCanvas' + '></canvas><div style="text-align:center;"><span>' + this.l10n.getConstant('Invert') + '</span></div></div>' });
        }
        const tempToolbarItems: ItemModel[] = this.processToolbar('center');
        for (let i: number = 0, len: number = tempToolbarItems.length; i < len; i++) {
            toolbarItems.push(tempToolbarItems[i as number]);
        }
        return toolbarItems;
    }

    private getPenToolbarItem(items: (string | ItemModel)[]): ItemModel[] {
        const toolbarItems: ItemModel[] = [];
        if (items.indexOf('strokeColor') > -1) {
            toolbarItems.push({ prefixIcon: 'e-icons e-copy', id: this.element.id + '_pen_strokecolor',
                cssClass: 'top-icon e-pen-stroke-color',
                tooltipText: this.l10n.getConstant('StrokeColor'), align: 'Center', type: 'Input',
                template: '<button id="' + this.element.id + '_penColorBtn"></button>' });
        }
        if (items.indexOf('strokeWidth') > -1) {
            toolbarItems.push({ prefixIcon: 'e-icons e-copy', cssClass: 'top-icon e-size',
                tooltipText: this.l10n.getConstant('StrokeWidth'),
                align: 'Center', type: 'Input', template: '<button id="' + this.element.id + '_penStrokeWidth"></button>' });
        }
        const tempToolbarItems: ItemModel[] = this.processSubToolbar(items);
        for (let i: number = 0, len: number = tempToolbarItems.length; i < len; i++) {
            toolbarItems.push(tempToolbarItems[i as number]);
        }
        if (!Browser.isDevice) {
            toolbarItems.push({ id: this.element.id + '_ok', prefixIcon: 'e-icons e-check', cssClass: 'top-icon e-tick',
                tooltipText: this.l10n.getConstant('OK'), align: 'Right' });
            toolbarItems.push({ id: this.element.id + '_cancel', prefixIcon: 'e-icons e-close', cssClass: 'top-icon e-save',
                tooltipText: this.l10n.getConstant('Cancel'), align: 'Right' });
        }
        return toolbarItems;
    }

    private initPenToolbarItem(items: (string | ItemModel)[]): void {
        const leftItem: ItemModel[] = this.getLeftToolbarItem();
        const rightItem: ItemModel[] = this.getRightToolbarItem();
        const mainItem: ItemModel[] = this.getPenToolbarItem(items);
        const zoomItem: ItemModel[] = this.getZoomToolbarItem();
        if (Browser.isDevice) {
            this.defToolbarItems = mainItem;
        } else {
            this.defToolbarItems = [...leftItem, ...zoomItem, ...mainItem, ...rightItem];
        }
        const toolbar: Toolbar = new Toolbar({
            width: '100%',
            items: this.defToolbarItems,
            clicked: this.defToolbarClicked.bind(this),
            created: () => {
                this.createPenColor(items);
                this.createPenBtn(items);
                if (!Browser.isDevice) {
                    this.renderSaveBtn();
                }
                this.trigger('toolbarCreated', {toolbarType: 'pen'});
                if (Browser.isDevice) {
                    if (this.defToolbarItems.length > 0 && (!isNullOrUndefined(document.getElementById(this.element.id + '_toolbar')))) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        (toolbar as any).refreshOverflow();
                    }
                } else {
                    this.createLeftToolbarControls();
                    if (this.defToolbarItems.length > 0 && (!isNullOrUndefined(document.getElementById(this.element.id + '_toolbar')))) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        (toolbar as any).refreshOverflow();
                    }
                }
            }
        });
        if (Browser.isDevice) {
            toolbar.appendTo('#' + this.element.id + '_bottomToolbar');
        } else {
            toolbar.appendTo('#' + this.element.id + '_toolbar');
        }
        this.enableDisableToolbarBtn();
    }

    private createPenColor(items: (string | ItemModel)[]): void {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const proxy: ImageEditor = this;
        if (items.indexOf('strokeColor') > -1) {
            this.element.querySelector('.e-template.e-pen-stroke-color').appendChild(this.createElement('input', {
                id: this.element.id + '_pen_stroke'
            }));
            const penColor: ColorPicker = new ColorPicker({
                modeSwitcher: false, value: '#fff',
                showButtons: false, mode: 'Palette', cssClass: 'e-pen-color',
                change: (args: ColorPickerEventArgs): void => {
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    const temp: any = extend([], this.pointColl, [], true);
                    this.updateFreehandDrawColorChange();
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    const previousObj: any = extend([], this.pointColl, [], true);
                    this.pointColl = temp;
                    proxy.isFreehandDrawCustomized = true;
                    proxy.activeObj.strokeSettings.strokeColor = proxy.selectedFreehandColor = args.currentValue.hex;
                    if (this.isFreehandDrawEditing) {
                        this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
                        this.pointColl[this.freehandDrawSelectedIndex].strokeColor = args.currentValue.hex;
                        this.hoverFreehandraw(args.currentValue.hex);
                        this.updateUndoRedoColl('freehanddrawCustomized', null, previousObj, this.pointColl, this.zoomFactor);
                    }
                    else if (!proxy.togglePen) {
                        proxy.redrawShape(this.activeObj);
                    }
                    (strokeDDB.element.children[0] as HTMLElement).style.backgroundColor = args.currentValue.rgba;
                    strokeDDB.toggle();
                }
            }, '#' + this.element.id + '_pen_stroke');
            const strokeDDB: DropDownButton = new DropDownButton({
                open: (args: OpenCloseMenuEventArgs) => {
                    if (Browser.isDevice) {
                        args.element.parentElement.style.top = strokeDDB.element.getBoundingClientRect().top -
                        args.element.parentElement.offsetHeight + 'px';
                        args.element.parentElement.style.left = this.element.offsetLeft + 'px';
                    }
                },
                target: '.e-pen-color',
                iconCss: 'e-dropdownbtn-preview'
            }, '#' + this.element.id + '_penColorBtn');
            penColor.inline = true;
            if (!isNullOrUndefined(this.freehandDrawSelectedIndex) && this.freehandDrawSelectedIndex > -1) {
                (this.element.querySelector('.e-pen-stroke-color.e-template .e-dropdownbtn-preview') as HTMLElement).style.background
                = this.selectedFreehandColor === '#42a5f5' ? this.tempFreeHandDrawEditingStyles.strokeColor :
                        this.pointColl[this.freehandDrawSelectedIndex].strokeColor;
            } else {
                (this.element.querySelector('.e-pen-stroke-color.e-template .e-dropdownbtn-preview') as HTMLElement).style.background
                = '#fff';
            }
        }
    }

    private createPenBtn(items: (string | ItemModel)[]): void {
        const strokeWidthItems: DropDownButtonItemModel[] = [
            { id: '1', text: this.l10n.getConstant('XSmall') },
            { id: '2', text: this.l10n.getConstant('Small') },
            { id: '3', text: this.l10n.getConstant('Medium') },
            { id: '4', text: this.l10n.getConstant('Large') },
            { id: '5', text: this.l10n.getConstant('XLarge') }
        ];
        if (items.indexOf('strokeWidth') > -1) {
            const strokeWidthBtn: HTMLElement = document.getElementById(this.element.id + '_penStrokeWidth');
            const spanElem: HTMLElement = document.createElement('span');
            if (!isNullOrUndefined(this.freehandDrawSelectedIndex) && this.freehandDrawSelectedIndex > -1) {
                spanElem.innerHTML = this.getPenStroke(this.pointColl[this.freehandDrawSelectedIndex].strokeWidth);
            } else {
                spanElem.innerHTML = this.l10n.getConstant('Small');
            }
            spanElem.className = 'e-pen-stroke-width';
            strokeWidthBtn.appendChild(spanElem);
            const drpDownBtn: DropDownButton = new DropDownButton({ items: strokeWidthItems,
                open: (args: OpenCloseMenuEventArgs) => {
                    if (Browser.isDevice) {
                        args.element.parentElement.style.top = drpDownBtn.element.getBoundingClientRect().top -
                        args.element.parentElement.offsetHeight + 'px';
                    }
                    const activeBtn: string = spanElem.innerHTML;
                    args.element.querySelector('[aria-label = ' + '"' + activeBtn + '"' + ']').classList.add('e-selected-btn');
                },
                select: (args: MenuEventArgs) => {
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    const temp: any = extend([], this.pointColl, [], true);
                    this.updateFreehandDrawColorChange();
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    const previousObj: any = extend([], this.pointColl, [], true);
                    this.pointColl = temp;
                    this.isFreehandDrawCustomized = true;
                    spanElem.textContent = args.item.text;
                    this.setPenStroke(args.item.id);
                    if (this.isFreehandDrawEditing) {
                        this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
                        this.hoverFreehandraw(null, this.penStrokeWidth);
                        this.pointColl[this.freehandDrawSelectedIndex].strokeWidth = this.penStrokeWidth;
                        this.updateUndoRedoColl('freehanddrawCustomized', null, previousObj, this.pointColl, this.zoomFactor);
                    }
                    if (Browser.isDevice) {
                        if (!isNullOrUndefined(document.getElementById(this.element.id + '_bottomToolbar'))) {
                            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                            const toolbar: any = getComponent(this.element.id + '_bottomToolbar', 'toolbar') as Toolbar;
                            toolbar.refreshOverflow();
                        }
                    } else {
                        if (!isNullOrUndefined(document.getElementById(this.element.id + '_toolbar'))) {
                            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                            const toolbar: any = getComponent(this.element.id + '_toolbar', 'toolbar') as Toolbar;
                            toolbar.refreshOverflow();
                        }
                    }
                }
            });
            // Render initialized DropDownButton.
            drpDownBtn.appendTo('#' + this.element.id + '_penStrokeWidth');
        }
    }

    private updateFreehandDrawColorChange(): void {
        if (!isNullOrUndefined(this.freehandDrawSelectedIndex) && !isNullOrUndefined(this.pointColl[this.freehandDrawSelectedIndex])
            && this.pointColl[this.freehandDrawSelectedIndex].strokeColor === '#42a5f5') {
            this.pointColl[this.freehandDrawSelectedIndex].strokeColor = this.tempFreeHandDrawEditingStyles.strokeColor;
        }
    }

    private setPenStroke(args: string): void {
        switch (parseInt(args, 10)) {
        case 1:
            this.penStrokeWidth = 1;
            break;
        case 2:
            this.penStrokeWidth = 2;
            break;
        case 3:
            this.penStrokeWidth = 3;
            break;
        case 4:
            this.penStrokeWidth = 4;
            break;
        case 5:
            this.penStrokeWidth = 5;
            break;
        }
    }

    private getPenStroke(value: number): string {
        let textContent: string = '';
        if (value === 1) {
            textContent = this.l10n.getConstant('XSmall');
        } else if (value === 2) {
            textContent = this.l10n.getConstant('Small');
        } else if (value === 3) {
            textContent = this.l10n.getConstant('Medium');
        } else if (value === 4) {
            textContent = this.l10n.getConstant('Large');
        } else if (value === 5) {
            textContent = this.l10n.getConstant('XLarge');
        }
        return textContent;
    }

    private initAdjustmentToolbarItem(): void {
        const leftItem: ItemModel[] = this.getLeftToolbarItem(null);
        const rightItem: ItemModel[] = this.getRightToolbarItem();
        const mainItem: ItemModel[] = this.getAdjustmentToolbarItem();
        const zoomItem: ItemModel[] = this.getZoomToolbarItem();
        if (Browser.isDevice) {
            this.defToolbarItems = mainItem;
        } else {
            this.defToolbarItems = [...leftItem, ...zoomItem, ...mainItem, ...rightItem];
        }
        const toolbar: Toolbar = new Toolbar({
            width: '100%',
            items: this.defToolbarItems,
            clicked: this.defToolbarClicked.bind(this),
            created: () => {
                if (!Browser.isDevice) {
                    this.renderSaveBtn();
                }
                if (Browser.isDevice) {
                    if (this.defToolbarItems.length > 0 && (!isNullOrUndefined(document.getElementById(this.element.id + '_toolbar')))) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        (toolbar as any).refreshOverflow();
                    }
                } else {
                    this.createLeftToolbarControls();
                    if (this.defToolbarItems.length > 0 && (!isNullOrUndefined(document.getElementById(this.element.id + '_toolbar')))) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        (toolbar as any).refreshOverflow();
                    }
                }
            }
        });
        if (Browser.isDevice) {
            toolbar.appendTo('#' + this.element.id + '_bottomToolbar');
        } else {
            toolbar.appendTo('#' + this.element.id + '_toolbar');
        }
        this.enableDisableToolbarBtn();
    }

    private initFilterToolbarItem(): void {
        const mainItem: ItemModel[] = this.getFilterToolbarItem();
        if (document.querySelector('#' + this.element.id + '_contextualToolbar').classList.contains('e-control')) {
            (getComponent(document.getElementById(this.element.id + '_contextualToolbar'), 'toolbar') as Toolbar).destroy();
        }
        const toolbar: Toolbar = new Toolbar({
            width: '100%',
            items: mainItem,
            clicked: this.contextualToolbarClicked.bind(this),
            created: () => {
                this.createCanvasFilter();
                if (this.currentFilter === '') {
                    this.currentFilter = this.element.id + '_default';
                }
                const hdrWrapper: HTMLElement = document.querySelector('#' + this.element.id + '_headWrapper');
                if (hdrWrapper) {
                    hdrWrapper.style.display = 'none';
                }
                document.getElementById(this.currentFilter + 'Canvas').parentElement.parentElement.classList.add('e-selected');
                this.enableDisableToolbarBtn();
                toolbar.refreshOverflow();
            }
        });
        toolbar.appendTo('#' + this.element.id + '_contextualToolbar');
    }

    private getCurrentCanvasData(): ImageData {
        const tempFilter: string = this.lowerContext.filter;
        this.lowerContext.filter = 'none';
        const objColl: SelectionPoint[] = extend([], this.objColl, null, true) as SelectionPoint[];
        this.objColl = [];
        this.renderImage();
        const data: ImageData = this.lowerContext.getImageData(this.destLeft, this.destTop, this.destWidth, this.destHeight);
        this.objColl = objColl;
        this.iterateObjColl();
        this.lowerContext.filter = tempFilter;
        return data;
    }

    private createCanvasFilter(): void {
        const imageData: ImageData = this.getCurrentCanvasData();
        this.inMemoryCanvas.width = imageData.width; this.inMemoryCanvas.height = imageData.height;
        this.inMemoryContext.putImageData(imageData, 0, 0);
        const noFilter: HTMLCanvasElement = document.querySelector('#' + this.element.id + '_defaultCanvas');
        let ctx: CanvasRenderingContext2D = noFilter.getContext('2d');
        noFilter.style.width = '100px'; noFilter.style.height = '100px';
        ctx.filter = this.updateAdjustment('default', null, true);
        ctx.drawImage(this.inMemoryCanvas, 0, 0, 300, 150);
        const chrome: HTMLCanvasElement = document.querySelector('#' + this.element.id + '_chromeCanvas');
        ctx = chrome.getContext('2d');
        chrome.style.width = '100px'; chrome.style.height = '100px';
        ctx.filter = this.updateAdjustment('chrome', null, true);
        ctx.drawImage(this.inMemoryCanvas, 0, 0, 300, 150);
        const cold: HTMLCanvasElement = document.querySelector('#' + this.element.id + '_coldCanvas');
        ctx = cold.getContext('2d');
        cold.style.width = '100px'; cold.style.height = '100px';
        ctx.filter = this.updateAdjustment('cold', null, true);
        ctx.drawImage(this.inMemoryCanvas, 0, 0, 300, 150);
        const warm: HTMLCanvasElement = document.querySelector('#' + this.element.id + '_warmCanvas');
        ctx = warm.getContext('2d');
        warm.style.width = '100px'; warm.style.height = '100px';
        ctx.filter = this.updateAdjustment('warm', null, true);
        ctx.drawImage(this.inMemoryCanvas, 0, 0, 300, 150);
        const grayscale: HTMLCanvasElement = document.querySelector('#' + this.element.id + '_grayscaleCanvas');
        ctx = grayscale.getContext('2d');
        grayscale.style.width = '100px'; grayscale.style.height = '100px';
        ctx.filter = this.updateAdjustment('grayscale', null, true);
        ctx.drawImage(this.inMemoryCanvas, 0, 0, 300, 150);
        const sepia: HTMLCanvasElement = document.querySelector('#' + this.element.id + '_sepiaCanvas');
        ctx = sepia.getContext('2d');
        sepia.style.width = '100px'; sepia.style.height = '100px';
        ctx.filter = this.updateAdjustment('sepia', null, true);
        ctx.drawImage(this.inMemoryCanvas, 0, 0, 300, 150);
        const invert: HTMLCanvasElement = document.querySelector('#' + this.element.id + '_invertCanvas');
        ctx = invert.getContext('2d');
        invert.style.width = '100px'; invert.style.height = '100px';
        ctx.filter = this.updateAdjustment('invert', null, true);
        ctx.drawImage(this.inMemoryCanvas, 0, 0, 300, 150);
    }

    private callUpdateCurrentTransformedState(): void {
        const tempObjColl: SelectionPoint[] = extend([], this.objColl, [], true) as SelectionPoint[];
        const tempActiveObj: SelectionPoint = extend({}, this.activeObj, {}, true) as SelectionPoint;
        this.objColl = []; this.refreshActiveObj();
        this.isRotateZoom = true;
        this.updateCurrentTransformedState('initial');
        if (this.degree === 0 && this.rotateFlipColl.length > 0) {
            this.destLeft += this.totalPannedPoint.x;
            this.destTop += this.totalPannedPoint.y;
        }
        this.destLeft += this.totalPannedInternalPoint.x; this.destTop += this.totalPannedInternalPoint.y;
        const temp: string = this.lowerContext.filter;
        this.updateBrightnessFilter();
        this.lowerContext.drawImage(this.baseImg, this.srcLeft, this.srcTop, this.srcWidth, this.srcHeight,
                                    this.destLeft, this.destTop, this.destWidth, this.destHeight);
        this.updateCurrentTransformedState('reverse');
        if (this.degree === 0 && this.rotateFlipColl.length > 0) {
            this.destLeft += this.totalPannedPoint.x;
            this.destTop += this.totalPannedPoint.y;
        }
        this.isRotateZoom = false;
        this.objColl = tempObjColl;
        const tempTogglePen: boolean = this.togglePen;
        this.togglePen = false;
        this.lowerContext.filter = 'none';
        this.iterateObjColl();
        this.destLeft += this.totalPannedInternalPoint.x; this.destTop += this.totalPannedInternalPoint.y;
        this.freehandRedraw(this.lowerContext);
        this.destLeft -= this.totalPannedInternalPoint.x; this.destTop -= this.totalPannedInternalPoint.y;
        this.togglePen = tempTogglePen;
        this.lowerContext.filter = temp;
        this.activeObj = tempActiveObj;
    }

    private updateCurrentTransformedState(type: string, isPreventDestination?: boolean, isRotatePan?: boolean): void {
        if (this.rotateFlipColl.length > 0) {
            if (type === 'initial') {
                this.reverseTransformedState();
                if (isNullOrUndefined(isPreventDestination)) {
                    this.setDestinationPoints();
                }
            }
            this.currentTransformedState(type, null, null, isRotatePan);
        }
        if (this.isCircleCrop || (!isNullOrUndefined(this.currSelectionPoint) && this.currSelectionPoint.shape === 'crop-circle')) {
            if (isRotatePan) {
                this.destLeft += this.totalPannedClientPoint.x; this.destTop += this.totalPannedClientPoint.y;
            }
            this.cropCircle(this.lowerContext);
            if (isRotatePan) {
                this.destLeft -= this.totalPannedClientPoint.x; this.destTop -= this.totalPannedClientPoint.y;
            }
        }
    }

    private reverseTransformedState(): void {
        this.lowerContext.setTransform(1, 0, 0, 1, 0, 0);
    }
    private currentTransformedState(type: string, isPreventDimension?: boolean, context?: CanvasRenderingContext2D,
                                    isPreventCircleCrop?: boolean): void {
        context = context ? context : this.lowerContext;
        if (type === 'initial') {
            this.iterateRotateFlipColl(context, type);
        } else if (type === 'reverse') {
            this.iterateRotateFlipColl(context, type);
            this.setClientTransformedDimension(isPreventDimension);
            if (this.isCircleCrop || (!isNullOrUndefined(this.currSelectionPoint) && this.currSelectionPoint.shape === 'crop-circle' && isNullOrUndefined(isPreventCircleCrop))) {
                if (isPreventCircleCrop) {
                    this.destLeft += this.totalPannedClientPoint.x; this.destTop += this.totalPannedClientPoint.y;
                }
                this.cropCircle(this.lowerContext);
                if (isPreventCircleCrop) {
                    this.destLeft -= this.totalPannedClientPoint.x; this.destTop -= this.totalPannedClientPoint.y;
                }
            }
        }
    }

    private iterateRotateFlipColl(context: CanvasRenderingContext2D, type: string): void {
        if (type === 'initial') {
            for (let i: number = 0; i < this.rotateFlipColl.length; i++) {
                this.setTransform(context, this.rotateFlipColl[i as number]);
            }
        } else if (type === 'reverse') {
            for (let i: number = this.rotateFlipColl.length - 1; i >= 0; i--) {
                this.setTransform(context, this.rotateFlipColl[i as number], true);
            }
        }
    }

    private setTransform(context: CanvasRenderingContext2D, value: number | string, isReverse?: boolean): void {
        if (isReverse && value === 90) {value = -90; }
        else if (isReverse && value === -90) {value = 90; }
        if (value === 'horizontal' && this.degree % 90 === 0 && this.degree % 180 !== 0) {
            value = 'vertical';
        }
        else if (value === 'vertical' && this.degree % 90 === 0 && this.degree % 180 !== 0) {
            value = 'horizontal';
        }
        this.isReverseRotate = this.isReverseFlip = true;
        if (isNullOrUndefined(isReverse)) {context.clearRect(0, 0, context.canvas.width, context.canvas.height); }
        switch (value) {
        case 90:
        case -90:
            context.translate(context.canvas.width / 2, context.canvas.height / 2);
            context.rotate(Math.PI / 180 * value);
            context.translate(-context.canvas.width / 2, -context.canvas.height / 2);
            break;
        case 'horizontal':
            context.translate(context.canvas.width, 0);
            context.scale(-1, 1);
            break;
        case 'vertical':
            context.translate(0, context.canvas.height);
            context.scale(1, -1);
            break;
        }
        this.isReverseRotate = this.isReverseFlip = false;
    }

    private isObjInsideCropRegion(obj: SelectionPoint): boolean {
        let isInside: boolean = false;
        if (obj.activePoint.startX >= this.destLeft && obj.activePoint.endX <= (this.destLeft + this.destWidth)) {
            isInside = true;
        }
        else if (obj.activePoint.startX <= this.destLeft && obj.activePoint.endX >= this.destLeft) {
            isInside = true;
        }
        else if (obj.activePoint.startX <= (this.destLeft + this.destWidth) && obj.activePoint.endX >= (this.destLeft + this.destWidth)) {
            isInside = true;
        }
        else if (obj.activePoint.startY >= this.destTop && obj.activePoint.endY <= (this.destTop + this.destHeight)) {
            isInside = true;
        }
        else if (obj.activePoint.startY <= this.destTop && obj.activePoint.endY >= this.destTop) {
            isInside = true;
        }
        else if (obj.activePoint.startY <= (this.destTop + this.destHeight) && obj.activePoint.endY >= (this.destTop + this.destHeight)) {
            isInside = true;
        }
        return isInside;
    }

    private panFreehandDrawColl(xDiff: number, yDiff: number, panRegion: string): void {
        for (let n: number = 0; n < this.freehandCounter; n++) {
            this.points = extend([], this.pointColl[n as number].points, []) as Point[];
            this.pointCounter = 0;
            const len: number = this.points.length;
            for (let l: number = 0; l < len; l++) {
                if (panRegion === '' || panRegion === 'vertical') {
                    this.points[l as number].x += xDiff;
                } else {
                    this.points[l as number].x -= xDiff;
                }
                if (panRegion === '' || panRegion === 'horizontal') {
                    this.points[l as number].y += yDiff;
                }
                else {
                    this.points[l as number].y -= yDiff;
                }
            }
        }
        this.freehandRedraw(this.lowerContext);
    }

    private panObjColl(xDiff: number, yDiff: number, panRegion: string): void {
        for (let i: number = 0; i < this.objColl.length; i++) {
            if (panRegion === '' || panRegion === 'vertical') {
                this.objColl[i as number].activePoint.startX += xDiff;
                this.objColl[i as number].activePoint.endX += xDiff;
            } else {
                this.objColl[i as number].activePoint.startX -= xDiff;
                this.objColl[i as number].activePoint.endX -= xDiff;
            }
            if (panRegion === '' || panRegion === 'horizontal') {
                this.objColl[i as number].activePoint.startY += yDiff;
                this.objColl[i as number].activePoint.endY += yDiff;
            } else {
                this.objColl[i as number].activePoint.startY -= yDiff;
                this.objColl[i as number].activePoint.endY -= yDiff;
            }
            this.objColl[i as number].activePoint.width = this.objColl[i as number].activePoint.endX -
                                                          this.objColl[i as number].activePoint.startX;
            this.objColl[i as number].activePoint.height = this.objColl[i as number].activePoint.endY -
                                                           this.objColl[i as number].activePoint.startY;
            this.updateActiveObject(this.objColl[i as number].activePoint, this.objColl[i as number]);
            const temp: string = this.lowerContext.filter;
            this.lowerContext.filter = 'none';
            this.apply(this.objColl[i as number].shape, this.objColl[i as number]);
            this.lowerContext.filter = temp;
            this.refreshActiveObj();
        }
    }

    private cropObjColl(): void {
        if (this.objColl.length > 0) {
            for (let i: number = 0; i < this.objColl.length; i++) {
                this.objColl[i as number].imageRatio = {startX: ((this.objColl[i as number].activePoint.startX -
                                                       this.activeObj.activePoint.startX) / this.activeObj.activePoint.width),
                startY: ((this.objColl[i as number].activePoint.startY -
                         this.activeObj.activePoint.startY) / this.activeObj.activePoint.height),
                endX: ((this.objColl[i as number].activePoint.endX -
                       this.activeObj.activePoint.startX) / this.activeObj.activePoint.width),
                endY: ((this.objColl[i as number].activePoint.endY -
                       this.activeObj.activePoint.startY) / this.activeObj.activePoint.height),
                width: this.activeObj.activePoint.width / this.objColl[i as number].activePoint.width,
                height: this.activeObj.activePoint.height / this.objColl[i as number].activePoint.height };
                if (this.objColl[i as number].shape === 'text') {
                    this.objColl[i as number].textSettings.fontRatio = this.objColl[i as number].activePoint.width / this.objColl[i as number].textSettings.fontSize;
                }
            }
        }
    }

    private cropFreehandDrawColl(): void {
        for (let n: number = 0; n < this.freehandCounter; n++) {
            this.points = extend([], this.pointColl[n as number].points, []) as Point[];
            this.pointCounter = 0;
            const len: number = this.points.length;
            for (let l: number = 0; l < len; l++) {
                this.points[l as number].ratioX = (this.points[l as number].x -
                                                   this.activeObj.activePoint.startX) / this.activeObj.activePoint.width;
                this.points[l as number].ratioY = (this.points[l as number].y -
                                                   this.activeObj.activePoint.startY) / this.activeObj.activePoint.height;
            }
        }
    }

    private hoverFreehandraw(fillStyle?: string, strokeWidth?: number): void {
        const context: CanvasRenderingContext2D = this.upperContext;
        let idx: number = -1;
        if (this.freehandDrawHoveredIndex > -1) {
            idx = this.freehandDrawHoveredIndex;
        } else {
            idx = this.freehandDrawSelectedIndex;
        }
        this.points = extend([], this.pointColl[idx as number].points) as Point[];
        this.pointCounter = 0;
        const len: number = this.points.length;
        let controlPoint1: Point; let controlPoint2: Point;
        let startPoint: Point; let endPoint: Point;
        let minStrokeWidth: number = 0; let maxStrokeWidth: number = 0;
        context.fillStyle = fillStyle ? fillStyle : '#42a5f5';
        context.strokeStyle = '#fff';
        minStrokeWidth = maxStrokeWidth = this.penStrokeWidth = strokeWidth ?
            strokeWidth : this.pointColl[idx as number].strokeWidth;
        for (let l: number = 0; l < len - 3; l++) {
            if (this.points[l + 1] && this.points[l + 2] && this.points[l + 2]) {
                controlPoint1 = (this.calcCurveControlPoints(this.points[l + 0], this.points[l + 1],
                                                             this.points[l + 2])).controlPoint2;
                controlPoint2 = (this.calcCurveControlPoints(this.points[l + 1], this.points[l + 2],
                                                             this.points[l + 3])).controlPoint1;
                startPoint = this.points[l + 1];
                endPoint = this.points[l + 2];
                this.startDraw(context, controlPoint1, controlPoint2, startPoint, endPoint, minStrokeWidth, maxStrokeWidth);
            }
            if (len === 1) {
                controlPoint1 = controlPoint2 = startPoint = endPoint = this.points[0];
                this.startDraw(context, controlPoint1, controlPoint2, startPoint, endPoint, minStrokeWidth, maxStrokeWidth);
            }
        }
        context.closePath();
    }

    private flipFreehandrawColl(value: string): void {
        if (value.toLowerCase() === 'horizontal') {
            for (let n: number = 0; n < this.freehandCounter; n++) {
                if (this.pointColl[n as number].shapeFlip !== this.currFlipState) {
                    this.points = extend([], this.pointColl[n as number].points, []) as Point[];
                    this.pointCounter = 0;
                    const len: number = this.points.length;
                    for (let l: number = 0; l < len; l++) {
                        if (this.points[l as number].x <= this.destLeft + (this.destWidth / 2)) {
                            this.points[l as number].x = (this.destLeft + this.destWidth) - (this.points[l as number].x - this.destLeft);
                        } else if (this.points[l as number].x >= this.destLeft + (this.destWidth / 2)) {
                            this.points[l as number].x = this.destLeft + (this.destLeft + this.destWidth - this.points[l as number].x);
                        }
                        this.points[l as number].ratioX = (this.points[l as number].x - this.destLeft) / this.destWidth;
                        this.points[l as number].ratioY = (this.points[l as number].y - this.destTop) / this.destHeight;
                    }
                    this.pointColl[n as number].shapeFlip = this.currFlipState;
                }
            }
        }
        else {
            for (let n: number = 0; n < this.freehandCounter; n++) {
                if (this.pointColl[n as number].shapeFlip !== this.currFlipState) {
                    this.points = extend([], this.pointColl[n as number].points, []) as Point[];
                    this.pointCounter = 0;
                    const len: number = this.points.length;
                    for (let l: number = 0; l < len; l++) {
                        if (this.points[l as number].y <= this.destTop + (this.destHeight / 2)) {
                            this.points[l as number].y = (this.destTop + this.destHeight) - (this.points[l as number].y - this.destTop);
                        } else if (this.points[l as number].y >= this.destTop + (this.destHeight / 2)) {
                            this.points[l as number].y = this.destTop + (this.destTop + this.destHeight - this.points[l as number].y);
                        }
                        this.points[l as number].ratioX = (this.points[l as number].x - this.destLeft) / this.destWidth;
                        this.points[l as number].ratioY = (this.points[l as number].y - this.destTop) / this.destHeight;
                    }
                    this.pointColl[n as number].shapeFlip = this.currFlipState;
                }
            }
        }
    }

    private rotateFreehandDrawColl(): void {
        for (let n: number = 0; n < this.freehandCounter; n++) {
            this.points = extend([], this.pointColl[n as number].points, []) as Point[];
            this.pointCounter = 0;
            const len: number = this.points.length;
            for (let l: number = 0; l < len; l++) {
                this.points[l as number].y = this.destTop + (this.destHeight * this.points[l as number].ratioX);
                this.points[l as number].x = (this.destLeft + this.destWidth) - (this.destWidth * this.points[l as number].ratioY);
            }
        }
        // Update current image ratio for all objects
        for (let n: number = 0; n < this.freehandCounter; n++) {
            this.points = extend([], this.pointColl[n as number].points, []) as Point[];
            this.pointCounter = 0;
            const len: number = this.points.length;
            for (let l: number = 0; l < len; l++) {
                this.points[l as number].ratioX = (this.points[l as number].x - this.destLeft) / this.destWidth;
                this.points[l as number].ratioY = (this.points[l as number].y - this.destTop) / this.destHeight;
            }
        }
    }

    private zoomFreehandDrawColl(): void {
        for (let n: number = 0; n < this.freehandCounter; n++) {
            this.points = extend([], this.pointColl[n as number].points, []) as Point[];
            this.pointCounter = 0;
            const len: number = this.points.length;
            for (let l: number = 0; l < len; l++) {
                this.points[l as number].x = this.zoomX(this.points[l as number].ratioX);
                this.points[l as number].y = this.zoomY(this.points[l as number].ratioY);
            }
        }
        this.freehandRedraw(this.lowerContext);
    }

    private zoomX(x: number): number {
        return (x * this.destWidth) + this.destLeft;
    }

    private zoomY(y: number): number {
        return (y * this.destHeight) + this.destTop;
    }

    private zoomObjColl(preventApply?: true): void {
        for (let i: number = 0; i < this.objColl.length; i++) {
            this.objColl[i as number].activePoint.startX = (this.objColl[i as number].imageRatio.startX * this.destWidth) + this.destLeft;
            this.objColl[i as number].activePoint.startY = (this.objColl[i as number].imageRatio.startY * this.destHeight) + this.destTop;
            this.objColl[i as number].activePoint.endX = (this.objColl[i as number].imageRatio.endX * this.destWidth) + this.destLeft;
            this.objColl[i as number].activePoint.endY = (this.objColl[i as number].imageRatio.endY * this.destHeight) + this.destTop;
            this.objColl[i as number].activePoint.width = this.objColl[i as number].activePoint.endX -
                this.objColl[i as number].activePoint.startX;
            this.objColl[i as number].activePoint.height = this.objColl[i as number].activePoint.endY -
                this.objColl[i as number].activePoint.startY;
            if (this.objColl[i as number].shape === 'text') {
                this.updateFontSize(this.objColl[i as number]);
            }
            this.updateActiveObject(this.objColl[i as number].activePoint, this.objColl[i as number]);
            if (isNullOrUndefined(preventApply)) {
                const temp: string = this.lowerContext.filter;
                this.lowerContext.filter = 'none';
                this.apply(this.objColl[i as number].shape, this.objColl[i as number]);
                this.refreshActiveObj();
                this.lowerContext.filter = temp;
            }
        }
    }

    private calcRatio(): Dimension {
        let widthRatio: number; let heightRatio: number;
        if (this.degree === 0 || this.degree % 180 === 0) {
            widthRatio = this.baseImg.width / this.destWidth;
            heightRatio = this.baseImg.height / this.destHeight;
        } else {
            widthRatio = this.baseImg.height / this.destWidth;
            heightRatio = this.baseImg.width / this.destHeight;
        }
        return {width: widthRatio, height: heightRatio};
    }

    private drawCustomSelection(cropShape: string): void {
        this.currObjType.isCustomCrop = true;
        this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
        this.currObjType.shape = this.activeObj.shape = cropShape.toLowerCase();
        if (this.zoomFactor === 0) {
            if (this.destLeft >= 0 && this.destTop >= 0) {
                this.activeObj.activePoint.startX = this.destLeft; this.activeObj.activePoint.startY = this.destTop;
                this.activeObj.activePoint.endX = this.destLeft + this.destWidth;
                this.activeObj.activePoint.endY = this.destTop + this.destHeight;
            } else if (this.destLeft >= 0) {
                this.activeObj.activePoint.startX = this.destLeft; this.activeObj.activePoint.startY = 7.5;
                this.activeObj.activePoint.endX = this.destLeft + this.destWidth;
                this.activeObj.activePoint.endY = this.lowerCanvas.height - 15;
            } else if (this.destTop >= 0) {
                this.activeObj.activePoint.startX = 7.5; this.activeObj.activePoint.startY = this.destTop;
                this.activeObj.activePoint.endX = this.lowerCanvas.width - 15;
                this.activeObj.activePoint.endY = this.destTop + this.destHeight;
            } else {
                // arcRadius 7.5
                this.activeObj.activePoint.startX = 7.5; this.activeObj.activePoint.startY = 7.5;
                this.activeObj.activePoint.endX = this.lowerCanvas.width - 15;
                this.activeObj.activePoint.endY = this.lowerCanvas.height - 15;
            }
        } else {
            if (this.destLeft > 0) {
                this.activeObj.activePoint.startX = this.destLeft;
            } else {
                this.activeObj.activePoint.startX = 7.5;
            }
            if (this.destTop > 0) {
                this.activeObj.activePoint.startY = this.destTop;
            } else {
                this.activeObj.activePoint.startY = 7.5;
            }
            if (this.destLeft + this.destWidth + 15 < this.lowerCanvas.width) {
                this.activeObj.activePoint.endX = this.destLeft + this.destWidth - 15;
            } else {
                this.activeObj.activePoint.endX = this.lowerCanvas.width - 15;
            }
            if (this.destTop + this.destHeight + 15 < this.lowerCanvas.height) {
                this.activeObj.activePoint.endY = this.destTop + this.destHeight - 15;
            } else {
                this.activeObj.activePoint.endY = this.lowerCanvas.height - 15;
            }
        }
        if (this.activeObj.activePoint.startX < this.destLeft) {
            this.activeObj.activePoint.startX = this.destLeft;
        }
        if (this.activeObj.activePoint.startY < this.destTop) {
            this.activeObj.activePoint.startY = this.destTop;
        }
        if (this.activeObj.activePoint.endX > this.destLeft + this.destWidth) {
            this.activeObj.activePoint.endX = this.destLeft + this.destWidth;
        }
        if (this.activeObj.activePoint.endY > this.destTop + this.destHeight) {
            this.activeObj.activePoint.endY = this.destTop + this.destHeight;
        }
        if (this.activeObj.activePoint.startX === this.destLeft && this.destLeft + this.destWidth > this.lowerCanvas.clientWidth) {
            this.activeObj.activePoint.endX = this.lowerCanvas.clientWidth - 15;
        }
        if (this.activeObj.activePoint.startY === this.destTop && this.destTop + this.destHeight > this.lowerCanvas.clientHeight) {
            this.activeObj.activePoint.endY = this.lowerCanvas.clientHeight - 15;
        }
        this.activeObj.activePoint.width = this.activeObj.activePoint.endX - this.activeObj.activePoint.startX;
        this.activeObj.activePoint.height = this.activeObj.activePoint.endY - this.activeObj.activePoint.startY;
        this.updateActiveObject(this.activeObj.activePoint, this.activeObj);
        this.drawObject('duplicate', this.activeObj, null, null, true);
    }

    private clearOuterCanvas(context: CanvasRenderingContext2D): void {
        const destLeft: number = this.destLeft; const destTop: number = this.destTop;
        if (this.currFlipState !== '') {
            this.destLeft = this.lowerCanvas.clientWidth - (this.destWidth + this.destLeft);
            this.destTop = this.lowerCanvas.clientHeight - (this.destHeight + this.destTop);
        }
        if (this.destWidth < this.lowerCanvas.width) {
            const left: number = this.destLeft > 0 ? this.destLeft : 0;
            context.clearRect(0, 0, left, this.lowerCanvas.height);
            context.clearRect(this.destLeft + this.destWidth, 0, left, this.lowerCanvas.height);
        }
        if (this.destHeight < this.lowerCanvas.height) {
            const top: number = this.destTop > 0 ? this.destTop : 0;
            context.clearRect(0, 0, this.lowerCanvas.width, top);
            context.clearRect(0, this.destTop + this.destHeight, this.lowerCanvas.width, top);
        }
        if (this.currFlipState !== '') {
            this.destLeft = destLeft; this.destTop = destTop;
        }
    }

    private cropCircle(context: CanvasRenderingContext2D, isSave?: boolean, isFlip?: boolean): void {
        if (isFlip && this.currFlipState !== '') {
            this.setTransform(context, this.currFlipState);
        }
        context.globalCompositeOperation = 'destination-in';
        context.beginPath();
        if (isNullOrUndefined(isSave)) {
            context.arc(this.destLeft + (this.destWidth / 2), this.destTop + (this.destHeight / 2), this.destWidth / 2, 0, Math.PI * 2);
        } else {
            context.arc(this.destWidth / 2, this.destHeight / 2, this.destWidth / 2, 0, Math.PI * 2);
        }
        context.closePath();
        context.fill();
        context.restore();
        context.globalCompositeOperation = 'source-over';
        this.currObjType.isActiveObj = this.isCircleCrop = true;
        if (isFlip && this.currFlipState !== '') {
            this.setTransform(context, this.currFlipState);
        }
    }

    private updateCropObj(): void {
        this.afterCropActions = [];
        this.cropObj.cropZoom = this.cropZoomFactor; this.cropObj.defaultZoom = this.defaultZoomFactor;
        this.cropObj.totalPannedPoint = extend({}, this.totalPannedPoint, {}, true) as Point;
        this.cropObj.totalPannedClientPoint = extend({}, this.totalPannedClientPoint, {}, true) as Point;
        this.cropObj.totalPannedInternalPoint = extend({}, this.totalPannedInternalPoint, {}, true) as Point;
        this.cropObj.activeObj = extend({}, this.activeObj, {}, true) as SelectionPoint;
        this.cropObj.rotateFlipColl = extend([], this.rotateFlipColl, [], true) as string[] | number[];
        this.cropObj.degree = this.degree;
        this.cropObj.currFlipState = this.currFlipState;
        this.cropObj.destPoints = {startX: this.destLeft, startY: this.destTop, endX: 0, endY: 0,
            width: this.destWidth, height: this.destHeight};
        this.cropObj.srcPoints = {startX: this.srcLeft, startY: this.srcTop, endX: 0, endY: 0,
            width: this.srcWidth, height: this.srcHeight};
    }

    private setCropObj(): void {
        this.cropZoomFactor = this.zoomFactor = this.cropObj.cropZoom; this.defaultZoomFactor = this.cropObj.defaultZoom;
        this.totalPannedPoint = extend({}, this.cropObj.totalPannedPoint, {}, true) as Point;
        this.totalPannedClientPoint = extend({}, this.cropObj.totalPannedClientPoint, {}, true) as Point;
        this.totalPannedInternalPoint = extend({}, this.cropObj.totalPannedInternalPoint, {}, true) as Point;
        this.rotateFlipColl = extend([], this.cropObj.rotateFlipColl, [], true) as string[] | number[];
        this.degree = this.cropObj.degree;
        this.currFlipState = this.cropObj.currFlipState;
        this.destLeft = this.cropObj.destPoints.startX; this.destTop = this.cropObj.destPoints.startY;
        this.destWidth = this.cropObj.destPoints.width; this.destHeight = this.cropObj.destPoints.height;
        this.srcLeft = this.cropObj.srcPoints.startX; this.srcTop = this.cropObj.srcPoints.startY;
        this.srcWidth = this.cropObj.srcPoints.width; this.srcHeight = this.cropObj.srcPoints.height;
        this.drawCropSelectionImage();
        if (this.degree !== 0) {
            this.isCircleCrop = false;
            if (!isNullOrUndefined(this.currSelectionPoint)) {
                this.currSelectionPoint.shape = '';
            }
            this.currentPannedPoint = { x: 0, y: 0 };
            this.rotatePan();
        }
        this.activeObj = extend({}, this.cropObj.activeObj, {}, true) as SelectionPoint;
        this.upperContext.clearRect(0, 0 , this.upperCanvas.width, this.upperCanvas.height);
        this.drawObject('duplicate');
        let activeObj: SelectionPoint = extend({}, this.cropObj.activeObj, {}, true) as SelectionPoint;
        let isAfterCropAction: boolean = false;
        if (this.afterCropActions.length > 0) {
            isAfterCropAction = true;
            const objColl: SelectionPoint[] = extend([], this.objColl, {}, true) as SelectionPoint[];
            const pointColl: Point[] = extend([], this.pointColl, {}, true) as Point[];
            const freehandCounter: number = this.freehandCounter;
            this.objColl = []; this.pointColl = []; this.freehandCounter = 0;
            const isCircleCrop: boolean = this.isCircleCrop;
            const currSelectionPoint: SelectionPoint = extend({}, this.currSelectionPoint, {}, true) as SelectionPoint;
            this.currSelectionPoint = null;
            this.isCircleCrop = false;
            let isFlip: boolean = false;
            for (let i: number = 0; i < this.afterCropActions.length; i++) {
                if (this.degree % 90 === 0 && this.degree % 180 !== 0 &&
                    (this.afterCropActions[i as number] === 'horizontalflip' || this.afterCropActions[i as number] === 'verticalflip')) {
                    this.rotatedFlipCropSelection = true;
                }
                this.updateTransform(this.afterCropActions[i as number]);
                if (this.afterCropActions[i as number] === 'horizontalflip' || this.afterCropActions[i as number] === 'verticalflip') {
                    if (this.degree === 0) {
                        this.destLeft += this.totalPannedPoint.x;
                        this.destTop += this.totalPannedPoint.y;
                    }
                    isFlip = true;
                }
            }
            this.isCircleCrop = isCircleCrop;
            this.currSelectionPoint = currSelectionPoint;
            const destPoints: ActivePoint = {startX: this.destLeft, startY: this.destTop, width: this.destWidth, height: this.destHeight};
            activeObj = extend({}, this.activeObj, {}, true) as SelectionPoint;
            this.refreshActiveObj();
            this.objColl = objColl; this.pointColl = pointColl; this.freehandCounter = freehandCounter;
            if (this.rotateFlipColl.length > 1 && typeof(this.rotateFlipColl[this.rotateFlipColl.length - 1]) === 'string') {
                this.iterateObjColl(); this.freehandRedraw(this.lowerContext);
            } else if (this.rotateFlipColl.length > 1 && typeof(this.rotateFlipColl[this.rotateFlipColl.length - 1]) === 'number' ||
                this.rotateFlipColl.length >= 0) {
                this.destLeft = activeObj.activePoint.startX; this.destTop = activeObj.activePoint.startY;
                this.destWidth = activeObj.activePoint.width; this.destHeight = activeObj.activePoint.height;
                this.zoomObjColl(); this.zoomFreehandDrawColl();
            }
            this.destLeft = destPoints.startX; this.destTop = destPoints.startY;
            this.destWidth = destPoints.width; this.destHeight = destPoints.height;
            this.totalPannedPoint = {x: 0, y: 0};
            this.totalPannedClientPoint = {x: 0, y: 0};
            this.totalPannedInternalPoint = {x: 0, y: 0};
            this.activeObj = activeObj;
            this.upperContext.clearRect(0, 0 , this.upperCanvas.width, this.upperCanvas.height);
            this.drawObject('duplicate');
            if (this.cropObj.degree !== this.degree) {
                this.cropZoomFactor = this.zoomFactor = 0;
            }
            this.updateObjAndFreeHandDrawColl();
            if (isFlip) {
                if (this.degree === 0) {
                    const currSelectionPoint: SelectionPoint = extend({}, this.currSelectionPoint, {}, true) as SelectionPoint;
                    this.currSelectionPoint = null;
                    this.isCircleCrop = false;
                    this.drawPannImage({x: 0, y: 0}, this.getCurrentPanRegion());
                    this.updateFlipPan(activeObj);
                    this.isCircleCrop = isCircleCrop;
                    this.currSelectionPoint = currSelectionPoint;
                }
                this.activeObj = activeObj;
                this.upperContext.clearRect(0, 0 , this.upperCanvas.width, this.upperCanvas.height);
                this.drawObject('duplicate');
            }
            if (this.rotatedFlipCropSelection) {
                // this.totalPannedInternalPoint = extend({}, this.cropObj.totalPannedInternalPoint, {}, true) as Point;
                this.rotatedFlipCropSelection = false;
            }
        }
        if (!this.isCancelAction && !isAfterCropAction) {
            this.setDestPointsForFlipState();
            this.updateObjAndFreeHandDrawColl();
            this.zoomFreehandDrawColl();
            this.destLeft = this.cropObj.destPoints.startX; this.destTop = this.cropObj.destPoints.startY;
        }
        this.activeObj = activeObj;
    }

    private drawCropSelectionImage(): void {
        const temp: string = this.lowerContext.filter;
        this.upperContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
        this.lowerContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
        this.reverseTransformedState();
        this.iterateRotateFlipColl(this.lowerContext, 'initial');
        this.updateBrightnessFilter();
        this.lowerContext.drawImage(this.baseImg, this.srcLeft, this.srcTop, this.srcWidth, this.srcHeight,
                                    this.destLeft, this.destTop, this.destWidth, this.destHeight);
        this.iterateRotateFlipColl(this.lowerContext, 'reverse');
        const activeObj: SelectionPoint = extend({}, this.cropObj.activeObj, {}, true) as SelectionPoint;
        this.lowerContext.filter = 'none';
        if (this.isCancelAction) {
            this.zoomObjColl(); this.zoomFreehandDrawColl();
        } else {
            this.destLeft = this.cropObj.destPoints.startX; this.destTop = this.cropObj.destPoints.startY;
            this.destWidth = this.cropObj.destPoints.width; this.destHeight = this.cropObj.destPoints.height;
            this.srcLeft = this.cropObj.srcPoints.startX; this.srcTop = this.cropObj.srcPoints.startY;
            this.srcWidth = this.cropObj.srcPoints.width; this.srcHeight = this.cropObj.srcPoints.height;
            const destPoints: ActivePoint = {startX: this.destLeft, startY: this.destTop, width: this.destWidth, height: this.destHeight};
            this.destLeft = this.cropObj.activeObj.activePoint.startX; this.destTop = this.cropObj.activeObj.activePoint.startY;
            this.destWidth = this.cropObj.activeObj.activePoint.width; this.destHeight = this.cropObj.activeObj.activePoint.height;
            this.zoomObjColl(); this.zoomFreehandDrawColl();
            this.destLeft = destPoints.startX; this.destTop = destPoints.startY;
            this.destWidth = destPoints.width; this.destHeight = destPoints.height;
        }
        this.activeObj = activeObj;
        this.lowerContext.filter = temp;
    }

    private cropImg(isRotateCrop?: boolean): void {
        if (isNullOrUndefined(isRotateCrop)) {
            this.croppedDegree = this.degree;
        }
        if (isNullOrUndefined(isRotateCrop) && this.degree !== 0) {
            this.updateCropObj();
            this.rotateCrop();
        } else if (isNullOrUndefined(isRotateCrop) && this.currFlipState !== '') {
            this.updateCropObj();
            this.flipCrop();
        } else {
            this.tempZoomFactor = this.zoomFactor;
            const ratio: Dimension = this.calcRatio();
            if (isNullOrUndefined(isRotateCrop) || !isRotateCrop) {
                this.updateCropObj();
                this.resetPanPoints();
                this.updateImageRatioForActObj();
                this.currSelectionPoint = extend({}, this.activeObj, {}, true) as SelectionPoint;
                this.cropDestPoints = {startX: this.destLeft, startY: this.destTop, width: this.destWidth, height: this.destHeight};
            }
            const maxDimension: Dimension = this.calcMaxDimension(this.activeObj.activePoint.width *
                                                                  ratio.width, this.activeObj.activePoint.height * ratio.height);
            this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
            this.lowerContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
            this.srcLeft = (this.activeObj.activePoint.startX * ratio.width) - (this.destLeft * ratio.width);
            this.srcTop = (this.activeObj.activePoint.startY * ratio.height) - (this.destTop * ratio.height);
            this.srcWidth = (this.activeObj.activePoint.width * ratio.width);
            this.srcHeight = (this.activeObj.activePoint.height * ratio.height);
            this.destLeft = (this.lowerCanvas.clientWidth - maxDimension.width) / 2;
            this.destTop = (this.lowerCanvas.clientHeight - maxDimension.height) / 2;
            this.destWidth = maxDimension.width;
            this.destHeight = maxDimension.height;
            const temp: string = this.lowerContext.filter;
            this.updateBrightnessFilter();
            this.lowerContext.drawImage(this.baseImg, this.srcLeft, this.srcTop,
                                        this.srcWidth, this.srcHeight, this.destLeft, this.destTop, this.destWidth, this.destHeight);
            this.lowerContext.filter = 'none';
            const activeObj: SelectionPoint = extend({}, this.activeObj, {}, true) as SelectionPoint;
            this.cropObjColl(); this.zoomObjColl();
            for (let i: number = 0; i < this.objColl.length; i++) {
                if (this.isObjInsideCropRegion(this.objColl[i as number])) {
                    this.apply(this.objColl[i as number].shape, this.objColl[i as number]); this.refreshActiveObj();
                }
            }
            this.activeObj = activeObj;
            this.cropFreehandDrawColl(); this.zoomFreehandDrawColl();
            this.clearOuterCanvas(this.lowerContext); this.clearOuterCanvas(this.upperContext);
            if (this.currSelectionPoint.shape === 'crop-circle') {this.cropCircle(this.lowerContext); }
            else {this.isCircleCrop = false; }
            this.lowerContext.filter = temp;
            this.refreshActiveObj(); this.currObjType.isCustomCrop = false;
            this.pan(false);
            this.defaultZoomFactor = 0;
        }
    }

    private updateImageRatioForActObj(): void {
        this.activeObj.imageRatio = { startX: ((this.activeObj.activePoint.startX - this.destLeft) / this.destWidth),
            startY: ((this.activeObj.activePoint.startY - this.destTop) / this.destHeight),
            endX: ((this.activeObj.activePoint.endX - this.destLeft) / this.destWidth),
            endY: ((this.activeObj.activePoint.endY - this.destTop) / this.destHeight),
            width: this.destWidth / this.activeObj.activePoint.width, height: this.destHeight / this.activeObj.activePoint.height };
    }

    private drawImgToCanvas(maxDimension: Dimension): void {
        this.lowerContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
        this.destWidth = maxDimension.width; this.destHeight = maxDimension.height;
        if (this.isInitialLoading) {
            this.initializeFilter();
            this.isInitialLoading  = false;
        }
        const temp: string = this.lowerContext.filter;
        this.updateBrightnessFilter();
        this.lowerContext.drawImage(this.baseImg, this.srcLeft, this.srcTop, this.srcWidth, this.srcHeight,
                                    this.destLeft, this.destTop, this.destWidth, this.destHeight);
        if ((!isNullOrUndefined(this.currSelectionPoint) && this.currSelectionPoint.shape === 'crop-circle') || this.isCircleCrop) {
            this.cropCircle(this.lowerContext);
        }
        this.lowerContext.filter = temp;
    }

    private limitPan(): void {
        if (this.activeObj.activePoint) {
            if (this.destLeft > this.activeObj.activePoint.startX) {
                this.destLeft = this.activeObj.activePoint.startX;
            }
            if (this.destTop > this.activeObj.activePoint.startY) {
                this.destTop = this.activeObj.activePoint.startY;
            }
            if (this.destLeft + this.destWidth < this.activeObj.activePoint.endX) {
                this.destLeft = this.activeObj.activePoint.endX - this.destWidth;
            }
            if (this.destTop + this.destHeight < this.activeObj.activePoint.endY) {
                this.destTop = this.activeObj.activePoint.endY - this.destHeight;
            }
        }
    }

    private updatePanPoints(panRegion: string): Point {
        const tempDestLeft: number = this.destLeft; const tempDestTop: number = this.destTop;
        let xDiff: number = this.panMove.x - this.tempPanMove.x; let yDiff: number = this.panMove.y - this.tempPanMove.y;
        if (panRegion === '') {
            this.destLeft += xDiff; this.destTop += yDiff;
            this.limitPan();
        } else if (panRegion === 'horizontal') {
            const tempActObj: SelectionPoint = extend({}, this.activeObj, {}, true) as SelectionPoint;
            this.updateFlipActiveObj(panRegion);
            xDiff = this.tempPanMove.x - this.panMove.x;
            this.destLeft += xDiff; this.destTop += yDiff;
            this.limitPan();
            this.activeObj = tempActObj;
        } else if (panRegion === 'vertical') {
            const tempActObj: SelectionPoint = extend({}, this.activeObj, {}, true) as SelectionPoint;
            this.updateFlipActiveObj(panRegion);
            yDiff = this.tempPanMove.y - this.panMove.y;
            this.destLeft += xDiff; this.destTop += yDiff;
            this.limitPan();
            this.activeObj = tempActObj;
        } else if (panRegion === 'horizontalVertical') {
            const tempActObj: SelectionPoint = extend({}, this.activeObj, {}, true) as SelectionPoint;
            this.updateFlipActiveObj(panRegion);
            xDiff = this.tempPanMove.x - this.panMove.x;
            this.destLeft += xDiff; this.destTop -= yDiff;
            this.limitPan();
            this.activeObj = tempActObj;
        } else if (panRegion === 'verticalHorizontal') {
            const tempActObj: SelectionPoint = extend({}, this.activeObj, {}, true) as SelectionPoint;
            this.updateFlipActiveObj(panRegion);
            yDiff = this.tempPanMove.y - this.panMove.y;
            this.destLeft -= xDiff; this.destTop += yDiff;
            this.limitPan();
            this.activeObj = tempActObj;
        }
        // returns panned difference for manipulating object collection
        return {x: this.destLeft - tempDestLeft, y: this.destTop - tempDestTop};
    }

    private setCurrentPanRegion(region: string, type: number | string): string {
        let panRegion: string = region;
        if (region === '') {
            if (type === 'horizontal') {
                panRegion = 'horizontal';
            } else if (type === 'vertical') {
                panRegion = 'vertical';
            }
        } else if (region === 'horizontal') {
            if (type === 'horizontal') {
                panRegion = 'horizontalVertical';
            } else if (type === 'vertical') {
                panRegion = 'verticalHorizontal';
            } else if (type === 90) {
                panRegion = 'vertical';
            } else if (type === -90) {
                panRegion = 'horizontal';
            }
        } else if (region === 'vertical') {
            if (type === 'horizontal') {
                panRegion = 'horizontalVertical';
            } else if (type === 'vertical') {
                panRegion = 'verticalHorizontal';
            }  else if (type === 90) {
                panRegion = 'horizontal';
            } else if (type === -90) {
                panRegion = 'vertical';
            }
        } else {
            if (type === 'horizontal') {
                panRegion = 'vertical';
            } else if (type === 'vertical') {
                panRegion = 'horizontal';
            }
        }
        return panRegion;
    }

    private getCurrentPanRegion(): string {
        let panRegion: string = '';
        for (let i: number = 0; i < this.rotateFlipColl.length; i++) {
            panRegion = this.setCurrentPanRegion(panRegion, this.rotateFlipColl[i as number]);
        }
        return panRegion;
    }

    private drawPannImage(point: Point, panRegion: string): void {
        this.lowerContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
        this.updateBrightnessFilter();
        this.lowerContext.drawImage(this.baseImg, this.srcLeft, this.srcTop, this.srcWidth,
                                    this.srcHeight, this.destLeft, this.destTop, this.destWidth, this.destHeight);
        if ((!isNullOrUndefined(this.currSelectionPoint) && this.currSelectionPoint.shape === 'crop-circle') || this.isCircleCrop) {
            this.cropCircle(this.lowerContext, null, true);
        }
        this.lowerContext.filter = 'none';
        this.panObjColl(point.x, point.y, panRegion);
        this.panFreehandDrawColl(point.x, point.y, panRegion);
        if (this.isCircleCrop) {
            this.cropCircle(this.lowerContext, null, true);
        }
    }

    private drawPannedImage(xDiff?: number, yDiff?: number): void {
        let isObjCreated: boolean = false;
        if (isNullOrUndefined(this.activeObj.shape)) {
            isObjCreated = true;
            this.activeObj.activePoint = {startX: this.destLeft, startY: this.destTop,
                endX: this.destLeft + this.destWidth, endY: this.destTop + this.destHeight};
            if (this.activeObj.activePoint.startX < 0) {this.activeObj.activePoint.startX = 0; }
            if (this.activeObj.activePoint.startY < 0) {this.activeObj.activePoint.startY = 0; }
            if (this.activeObj.activePoint.endX > this.lowerCanvas.width) {this.activeObj.activePoint.endX = this.lowerCanvas.width; }
            if (this.activeObj.activePoint.endY > this.lowerCanvas.height) {this.activeObj.activePoint.endY = this.lowerCanvas.height; }
            this.activeObj.activePoint.width = this.activeObj.activePoint.endX - this.activeObj.activePoint.startX;
            this.activeObj.activePoint.height = this.activeObj.activePoint.endY - this.activeObj.activePoint.startY;
            this.activeObj.shape = 'crop-custom'; this.activeObj.strokeSettings = this.strokeSettings;
            this.updateActiveObject(this.activeObj.activePoint, this.activeObj);
            this.isCropTab = true;
        }
        const panRegion: string = this.getCurrentPanRegion();
        if (this.degree === 0) {
            let point: Point;
            if (isNullOrUndefined(xDiff) && isNullOrUndefined(yDiff)) {
                point = this.updatePanPoints(panRegion);
            } else {
                point = {x: xDiff, y: yDiff};
            }
            this.totalPannedPoint.x += point.x; this.totalPannedPoint.y += point.y;
            const tempSelectionObj: SelectionPoint = extend({}, this.activeObj, {}, true) as SelectionPoint;
            const temp: string = this.lowerContext.filter;
            this.drawPannImage(point, panRegion);
            this.lowerContext.filter = temp;
            this.tempPanMove = extend({}, this.panMove, {}, true) as Point;
            this.activeObj = extend({}, tempSelectionObj, {}, true) as SelectionPoint;
            this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
            if (!isNullOrUndefined(this.activeObj.shape)) {
                this.drawObject('duplicate', this.activeObj);
            }
            this.updateFlipPan(tempSelectionObj);
        } else {
            const tempFlipState: string = this.currFlipState;
            this.isCropTab = true;
            if (isNullOrUndefined(xDiff) && isNullOrUndefined(yDiff)) {
                this.currentPannedPoint = this.updatePanPoints(panRegion);
            } else {
                this.currentPannedPoint = {x: xDiff, y: yDiff};
            }
            this.currFlipState = tempFlipState;
            this.rotatePan();
            this.isCropTab = false;
            this.tempPanMove = extend({}, this.panMove, {}, true) as Point;
        }
        if (isObjCreated) {
            this.refreshActiveObj(); this.isCropTab = false;
            this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
        }
    }

    private updateFlipPan(tempSelectionObj?: SelectionPoint): void {
        if (this.currFlipState !== '') {
            const temp: string = this.lowerContext.filter;
            this.refreshActiveObj();
            this.rotatedFlip();
            this.lowerContext.filter = 'none';
            this.freehandRedraw(this.lowerContext);
            this.lowerContext.filter = temp;
            this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
            if (!isNullOrUndefined(tempSelectionObj)) {
                this.drawObject('duplicate', tempSelectionObj);
            }
        }
    }

    private updateFlipActiveObj(panRegion: string): void {
        if (panRegion === 'horizontal') {
            if (this.activeObj.activePoint.startX > this.lowerCanvas.width / 2) {
                this.activeObj.activePoint.endX = (this.lowerCanvas.width / 2) -
                    (this.activeObj.activePoint.startX - (this.lowerCanvas.width / 2));
            } else {
                this.activeObj.activePoint.endX = (this.lowerCanvas.width / 2) + ((this.lowerCanvas.width / 2) -
                    this.activeObj.activePoint.startX);
            }
            this.activeObj.activePoint.startX = this.activeObj.activePoint.endX - this.activeObj.activePoint.width;
        } else if (panRegion === 'vertical') {
            if (this.activeObj.activePoint.startX > this.lowerCanvas.width / 2) {
                this.activeObj.activePoint.endY = (this.lowerCanvas.height / 2) -
                    (this.activeObj.activePoint.startY - (this.lowerCanvas.height / 2));
            } else {
                this.activeObj.activePoint.endY = (this.lowerCanvas.height / 2) +
                    ((this.lowerCanvas.height / 2) - this.activeObj.activePoint.startY);
            }
            this.activeObj.activePoint.startY = this.activeObj.activePoint.endY - this.activeObj.activePoint.height;
        } else if (panRegion === 'verticalHorizontal' || panRegion === 'horizontalVertical') {
            if (this.activeObj.activePoint.startX > this.lowerCanvas.width / 2) {
                this.activeObj.activePoint.endX = (this.lowerCanvas.width / 2) -
                    (this.activeObj.activePoint.startX - (this.lowerCanvas.width / 2));
                this.activeObj.activePoint.endY = (this.lowerCanvas.height / 2) -
                    (this.activeObj.activePoint.startY - (this.lowerCanvas.height / 2));
            }
            else {
                this.activeObj.activePoint.endX = (this.lowerCanvas.width / 2) + ((this.lowerCanvas.width / 2) -
                    this.activeObj.activePoint.startX);
                this.activeObj.activePoint.endY = (this.lowerCanvas.height / 2) +
                    ((this.lowerCanvas.height / 2) - this.activeObj.activePoint.startY);
            }
            this.activeObj.activePoint.startX = this.activeObj.activePoint.endX - this.activeObj.activePoint.width;
            this.activeObj.activePoint.startY = this.activeObj.activePoint.endY - this.activeObj.activePoint.height;
        }
        this.updateActiveObject(this.activeObj.activePoint, this.activeObj);
    }

    private resetPanPoints(): void {
        this.totalPannedPoint = {x: 0, y: 0};
        this.totalPannedClientPoint = {x: 0, y: 0};
        this.totalPannedInternalPoint = {x: 0, y: 0};
    }

    private flipCrop(): void {
        this.isReverseFlip = true;
        this.totalPannedPoint.x += this.tempFlipPanPoint.x;
        this.totalPannedPoint.y += this.tempFlipPanPoint.y;
        let tempCurrFlipState: string = this.currFlipState;
        const tempFlipColl: string[] = this.flipColl;
        this.flipColl = [];
        this.updateImageRatioForActObj();
        this.currSelectionPoint = extend({}, this.activeObj, {}, true) as SelectionPoint;
        this.lowerContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
        this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
        const temp: string = this.lowerContext.filter;
        this.updateBrightnessFilter();
        if (!isNullOrUndefined(this.tempPannedPoint) && this.totalPannedPoint.x === 0 && this.totalPannedPoint.y === 0) {
            this.totalPannedPoint = extend({}, this.tempPannedPoint, {}, true) as Point;
            this.tempPannedPoint = {x: 0, y: 0};
        }
        let isPrevent: boolean = true;
        if (!isNullOrUndefined(this.activeObj.shape) && this.activeObj.shape.split('-')[0] === 'crop' &&
            this.zoomFactor === 0 && this.cropObj.cropZoom !== 0) {
                isPrevent = false;
            }
        if (this.zoomFactor === 0 && isPrevent) {
            if (this.totalPannedPoint.x > 0) {
                this.destLeft -= Math.abs(this.totalPannedPoint.x);
            } else {
                this.destLeft += Math.abs(this.totalPannedPoint.x);
            }
            if (this.totalPannedPoint.y > 0) {
                this.destTop -= Math.abs(this.totalPannedPoint.y);
            } else {
                this.destTop += Math.abs(this.totalPannedPoint.y);
            }
        }
        this.lowerContext.drawImage(this.baseImg, this.srcLeft, this.srcTop, this.srcWidth,
                                    this.srcHeight, this.destLeft, this.destTop, this.destWidth, this.destHeight);
        const destLeft: number = this.destLeft; const destTop: number = this.destTop;
        if (this.currFlipState === 'horizontal' && this.zoomFactor > 0 && this.totalPannedPoint.x !== 0) {
            this.destLeft = destLeft - this.totalPannedPoint.x;
        } else if (this.currFlipState === 'vertical' && this.zoomFactor > 0 && this.totalPannedPoint.y !== 0) {
            this.destTop = destTop - this.totalPannedPoint.y;
        }
        this.updateImageRatioForActObj();
        this.objColl.push(this.activeObj);
        for (let i: number = 0; i < this.objColl.length; i++) {
            this.objColl[i as number].shapeFlip = '';
        }
        for (let i: number = 0; i < this.freehandCounter; i++) {
            this.pointColl[i as number].shapeFlip = '';
        }
        this.redrawObj(this.getCurrentPanRegion());
        this.flipFreehandrawColl(this.currFlipState);
        if (this.zoomFactor === 0 && isPrevent) {
            if (this.getCurrentPanRegion() === 'horizontal') {
                this.panObjColl(this.totalPannedPoint.x, -this.totalPannedPoint.y, this.getCurrentPanRegion());
                this.panFreehandDrawColl(this.totalPannedPoint.x, -this.totalPannedPoint.y, this.getCurrentPanRegion());
            } else if (this.getCurrentPanRegion() === 'vertical') {
                this.panObjColl(-this.totalPannedPoint.x, this.totalPannedPoint.y, this.getCurrentPanRegion());
                this.panFreehandDrawColl(-this.totalPannedPoint.x, this.totalPannedPoint.y, this.getCurrentPanRegion());
            } else {
                this.panObjColl(-this.totalPannedPoint.x, -this.totalPannedPoint.y, this.getCurrentPanRegion());
                this.panFreehandDrawColl(-this.totalPannedPoint.x, -this.totalPannedPoint.y, this.getCurrentPanRegion());
            }
        }
        this.activeObj = extend({}, this.objColl[this.objColl.length - 1], {}, true) as SelectionPoint;
        this.objColl.pop();
        this.drawObject('duplicate');
        this.destLeft = destLeft; this.destTop = destTop;
        this.cropImg(true);
        this.updateCurrentTransformedState('initial');
        this.setDestinationPoints();
        this.updateBrightnessFilter();
        this.lowerContext.drawImage(this.baseImg, this.srcLeft, this.srcTop, this.srcWidth, this.srcHeight,
                                    this.destLeft, this.destTop, this.destWidth, this.destHeight);
        this.lowerContext.filter = temp;
        this.isRotateZoom = false;
        this.updateCurrentTransformedState('reverse');
        if (tempCurrFlipState === '' && this.currFlipState !== '') {
            tempCurrFlipState = this.currFlipState;
        }
        this.currFlipState = tempCurrFlipState;
        this.flipColl = tempFlipColl;
        this.lowerContext.filter = 'none';
        for (let i: number = 0; i < this.objColl.length; i++) {
            this.objColl[i as number].shapeFlip = '';
        }
        for (let i: number = 0; i < this.freehandCounter; i++) {
            this.pointColl[i as number].shapeFlip = '';
        }
        this.redrawObj(this.getCurrentPanRegion());
        this.flipFreehandrawColl(this.currFlipState);
        this.iterateObjColl();
        this.freehandRedraw(this.lowerContext);
        this.lowerContext.filter = temp;
        if ((!isNullOrUndefined(this.currSelectionPoint) && this.currSelectionPoint.shape === 'crop-circle') || this.isCircleCrop) {
            this.cropCircle(this.lowerContext);
        }
        this.refreshActiveObj();
        this.clearOuterCanvas(this.lowerContext); this.clearOuterCanvas(this.upperContext);
        this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
        this.isReverseFlip = false;
        this.resetPanPoints();
    }

    private rotateCrop(): void {
        let shape: string = '';
        if (!isNullOrUndefined(this.activeObj.shape)) {
            shape = this.activeObj.shape;
        }
        const tempDegree: number = this.degree;
        if (this.degree % 90 === 0 && this.degree % 180 !== 0) {
            this.rotatedDestPoints.startX = this.destLeft; this.rotatedDestPoints.startY = this.destTop;
            this.rotatedDestPoints.width = this.destWidth; this.rotatedDestPoints.height = this.destHeight;
            this.rotatedDestPoints.startX -= this.totalPannedClientPoint.x;
            this.rotatedDestPoints.startY -= this.totalPannedClientPoint.y;
        }
        this.updateImageRatioForActObj();
        this.currSelectionPoint = extend({}, this.activeObj, {}, true) as SelectionPoint;
        this.objColl.push(this.activeObj);
        this.activeObj = extend({}, this.objColl[this.objColl.length - 1], {}, true) as SelectionPoint;
        this.reverseTransformedState();
        this.setClientTransformedDimension();
        this.lowerContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
        const temp: string = this.lowerContext.filter;
        this.updateBrightnessFilter();
        this.lowerContext.drawImage(this.baseImg, this.srcLeft, this.srcTop, this.srcWidth,
                                    this.srcHeight, this.destLeft, this.destTop, this.destWidth, this.destHeight);
        this.lowerContext.filter = temp;
        let length: number = 0;
        if (tempDegree === 90 || tempDegree === -270) {
            length = 3;
        } else if (tempDegree === 180 || tempDegree === -180) {
            length = 2;
        } else if (tempDegree === 270 || tempDegree === -90) {
            length = 1;
        }
        for (let i: number = 0; i < length; i++) {
            this.rotateObjColl();
            this.rotateFreehandDrawColl();
        }
        const activeObj: SelectionPoint = extend({}, this.objColl[this.objColl.length - 1], {}, true) as SelectionPoint;
        if (this.currFlipState !== '') {
            let flipState: string = '';
            for (let i: number = 0; i < this.objColl.length; i++) {
                this.objColl[i as number].shapeFlip = '';
            }
            if (this.currFlipState === 'horizontal') {
                flipState = this.degree % 90 === 0 && this.degree % 180 !== 0 ? 'vertical' : 'horizontal';
                this.redrawObj(flipState);
            } else if (this.currFlipState === 'vertical') {
                flipState = this.degree % 90 === 0 && this.degree % 180 !== 0 ? 'horizontal' : 'vertical';
                this.redrawObj(flipState);
            }
            for (let i: number = 0; i < this.freehandCounter; i++) {
                this.pointColl[i as number].shapeFlip = '';
            }
            if (this.currFlipState === 'horizontal') {
                flipState = this.degree % 90 === 0 && this.degree % 180 !== 0 ? 'vertical' : 'horizontal';
                this.flipFreehandrawColl(flipState);
            } else if (this.currFlipState === 'vertical') {
                flipState = this.degree % 90 === 0 && this.degree % 180 !== 0 ? 'horizontal' : 'vertical';
                this.flipFreehandrawColl(flipState);
            }
        }
        this.zoomFreehandDrawColl();
        this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
        this.drawObject('duplicate', activeObj);
        this.objColl.pop();
        this.degree = 0;
        this.cropImg(true);
        this.isReverseRotate = true;
        this.reverseTransformedState();
        this.degree = tempDegree;
        this.setDestinationPoints();
        this.currentTransformedState('initial');
        this.updateBrightnessFilter();
        this.lowerContext.drawImage(this.baseImg, this.srcLeft, this.srcTop, this.srcWidth,
                                    this.srcHeight, this.destLeft, this.destTop, this.destWidth, this.destHeight);
        this.lowerContext.filter = temp;
        this.currentTransformedState('reverse');
        length = 0;
        if (tempDegree === 90 || tempDegree === -270) {
            length = 1;
        } else if (tempDegree === 180 || tempDegree === -180) {
            length = 2;
        } else if (tempDegree === 270 || tempDegree === -90) {
            length = 3;
        }
        for (let i: number = 0; i < length; i++) {
            this.rotateObjColl();
            this.rotateFreehandDrawColl();
        }
        if (this.currFlipState !== '') {
            for (let i: number = 0; i < this.objColl.length; i++) {
                this.objColl[i as number].shapeFlip = '';
            }
            if (this.currFlipState === 'horizontal') {
                this.redrawObj('horizontal');
            } else if (this.currFlipState === 'vertical') {
                this.redrawObj('vertical');
            }
            for (let i: number = 0; i < this.freehandCounter; i++) {
                this.pointColl[i as number].shapeFlip = '';
            }
            if (this.currFlipState === 'horizontal') {
                this.flipFreehandrawColl('horizontal');
            } else if (this.currFlipState === 'vertical') {
                this.flipFreehandrawColl('vertical');
            }
        }
        this.isReverseRotate = false;
        if (shape === 'crop-circle') {
            this.cropCircle(this.lowerContext);
        }
        this.lowerContext.filter = 'none';
        for (let i: number = 0; i < this.objColl.length; i++) {
            if (this.isObjInsideCropRegion(this.objColl[i as number])) {
                this.apply(this.objColl[i as number].shape, this.objColl[i as number]); this.refreshActiveObj();
            }
        }
        this.zoomFreehandDrawColl();
        this.lowerContext.filter = temp;
        this.clearOuterCanvas(this.lowerContext); this.clearOuterCanvas(this.upperContext);
        if (shape === 'crop-circle') {
            this.cropCircle(this.lowerContext);
        }
        this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
        this.resetPanPoints();
    }

    private updateRotatePanPoints(): void {
        if (this.degree % 90 === 0 && this.degree % 180 !== 0) {
            if (this.degree === 90 || this.degree === -270) {
                this.destLeft += this.currentPannedPoint.y;
                this.destTop -= this.currentPannedPoint.x;
            }
            else if (this.degree === 270 || this.degree === -90) {
                this.destLeft -= this.currentPannedPoint.y;
                this.destTop += this.currentPannedPoint.x;
            }
        } else {
            if (this.degree === 180 || this.degree === -180) {
                this.destLeft -= this.currentPannedPoint.x;
                this.destTop -= this.currentPannedPoint.y;
            }
            else {
                this.destLeft += this.currentPannedPoint.x;
                this.destTop += this.currentPannedPoint.y;
            }
        }
    }

    private rotatePan(isCropSelection?: boolean): void {
        this.isReverseRotate = true;
        const tempDegree: number = this.degree;
        let rotatePanActiveObj: SelectionPoint;
        if (!isNullOrUndefined(this.activeObj.activePoint) && !isNullOrUndefined(this.activeObj.shape)) {
            rotatePanActiveObj = extend({}, this.activeObj, {}, true) as SelectionPoint;
        }
        const tempObjColl: SelectionPoint[] = extend([], this.objColl, [], true) as SelectionPoint[];
        this.objColl = []; this.refreshActiveObj();
        this.isRotateZoom = true;
        this.updateCurrentTransformedState('initial');
        const initialDestLeft: number = this.destLeft;
        const initialDestTop: number = this.destTop;
        if (this.isCropTab) {
            this.destLeft += this.totalPannedInternalPoint.x;
            this.destTop += this.totalPannedInternalPoint.y;
        }
        this.updateRotatePanPoints();
        if (this.isCropTab) {
            this.totalPannedInternalPoint.x = this.destLeft - initialDestLeft;
            this.totalPannedInternalPoint.y = this.destTop - initialDestTop;
        }
        const temp: string = this.lowerContext.filter;
        this.updateBrightnessFilter();
        this.lowerContext.drawImage(this.baseImg, this.srcLeft, this.srcTop, this.srcWidth,
                                    this.srcHeight, this.destLeft, this.destTop, this.destWidth, this.destHeight);
        this.isRotateZoom = false;
        this.updateCurrentTransformedState('reverse', true, true);
        const destLeft: number = this.destLeft; const destTop: number = this.destTop;
        this.destLeft += this.totalPannedClientPoint.x;
        this.destTop += this.totalPannedClientPoint.y;
        this.destLeft += this.currentPannedPoint.x;
        this.destTop += this.currentPannedPoint.y;
        this.totalPannedClientPoint.x = this.destLeft - destLeft; this.totalPannedClientPoint.y = this.destTop - destTop;
        this.objColl = tempObjColl;
        this.degree = tempDegree;
        this.objColl = extend([], tempObjColl, [], true) as SelectionPoint[];
        this.lowerContext.filter = 'none';
        const panRegion: string = this.getCurrentPanRegion();
        if (isCropSelection) {
            this.currentPannedPoint = extend({}, this.totalPannedClientPoint, {}, true) as Point;
        }
        this.panObjColl(this.currentPannedPoint.x, this.currentPannedPoint.y, panRegion);
        this.panFreehandDrawColl(this.currentPannedPoint.x, this.currentPannedPoint.y, panRegion);
        this.lowerContext.filter = temp;
        this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
        this.activeObj = extend({}, rotatePanActiveObj, {}, true) as SelectionPoint;
        if (!isNullOrUndefined(this.activeObj.activePoint)) {
            this.drawObject('duplicate', this.activeObj, null, null, true);
        }
        this.isReverseRotate = false;
    }

    private rotateZoom(value: number): void {
        const powerOften: number = Math.pow(10, 1);
        if ((Math.round(this.zoomFactor * powerOften ) / powerOften) === 0.1 && value === -0.1) {
            this.zoomFactor = 0;
        } else {this.zoomFactor += value; }
        if (this.isCropTab) {
            this.cropZoomFactor = this.zoomFactor;
        } else {
            this.defaultZoomFactor = this.zoomFactor;
        }
        const tempObjColl: SelectionPoint[] = extend([], this.objColl, [], true) as SelectionPoint[];
        const tempActiveObj: SelectionPoint = extend({}, this.activeObj, {}, true) as SelectionPoint;
        this.objColl = []; this.refreshActiveObj();
        this.updateCurrentTransformedState('initial');
        this.isRotateZoom = true;
        this.setDestinationPoints();
        const temp: string = this.lowerContext.filter;
        this.updateBrightnessFilter();
        this.lowerContext.drawImage(this.baseImg, this.srcLeft, this.srcTop, this.srcWidth, this.srcHeight,
                                    this.destLeft, this.destTop, this.destWidth, this.destHeight);
        this.lowerContext.filter = temp;
        this.isRotateZoom = false;
        this.updateCurrentTransformedState('reverse');
        this.objColl = tempObjColl;
        this.activeObj = tempActiveObj;
    }

    private drawZoomImgToCanvas(value: number, selectionObj?: SelectionPoint): void {
        const powerOften: number = Math.pow(10, 1);
        if ((Math.round(this.zoomFactor * powerOften ) / powerOften) === 0.1 && value === -0.1) {
            this.zoomFactor = 0;
        } else {this.zoomFactor += value; }
        if (this.isCropTab) {
            this.cropZoomFactor += value;
        } else {
            this.defaultZoomFactor = this.zoomFactor;
        }
        let maxDimension: Dimension = {width: 0, height: 0};
        if (this.isCropTab) {
            maxDimension = this.cropZoom(value, selectionObj);
        } else {
            maxDimension = this.calcMaxDimension(this.srcWidth, this.srcHeight);
            maxDimension.width += (maxDimension.width * this.zoomFactor);
            maxDimension.height += (maxDimension.height * this.zoomFactor);
            this.destLeft = (this.lowerCanvas.clientWidth - maxDimension.width) / 2;
            this.destTop = (this.lowerCanvas.clientHeight - maxDimension.height) / 2;
        }
        this.drawImgToCanvas(maxDimension);
    }

    private cropZoom(value: number, selectionObj?: SelectionPoint): Dimension {
        const destLeft: number = this.destLeft; const destTop: number = this.destTop;
        let maxDimension: Dimension = {width: 0, height: 0};
        if (this.srcLeft === 0 || this.srcTop === 0) {
            if (isNullOrUndefined(selectionObj)) {
                maxDimension = this.setZoomDimension(value, null);
            } else {
                maxDimension = this.setZoomDimension(value, selectionObj);
            }
        } else {
            if (this.degree % 90 === 0 && this.degree % 180 !== 0) {
                maxDimension = this.calcMaxDimension(this.srcHeight, this.srcWidth);
            } else {
                maxDimension = this.calcMaxDimension(this.srcWidth, this.srcHeight);
            }
            maxDimension.width += (maxDimension.width * this.zoomFactor);
            maxDimension.height += (maxDimension.height * this.zoomFactor);
        }
        this.destLeft = destLeft - ((maxDimension.width - this.destWidth) / 2);
        this.destTop = destTop - ((maxDimension.height - this.destHeight) / 2);
        if (!isNullOrUndefined(selectionObj)) {
            if (this.destLeft > selectionObj.activePoint.startX) {
                this.destLeft = selectionObj.activePoint.startX;
            }
            if (this.destTop > selectionObj.activePoint.startY) {
                this.destTop = selectionObj.activePoint.startY;
            }
            if (this.destLeft + maxDimension.width < selectionObj.activePoint.endX) {
                this.destLeft = selectionObj.activePoint.endX - maxDimension.width;
            }
            if (this.destTop + maxDimension.height < selectionObj.activePoint.endY) {
                this.destTop = selectionObj.activePoint.endY - maxDimension.height;
            }
        }
        return maxDimension;
    }

    private updateCanvas(): void {
        const fileOpened: OpenEventArgs = {fileName: this.fileName, fileType: this.fileType};
        this.srcWidth = this.baseImg.width; this.srcHeight = this.baseImg.height;
        const maxDimension: Dimension = this.calcMaxDimension(this.srcWidth, this.srcHeight);
        this.destLeft = (this.lowerCanvas.clientWidth - maxDimension.width) / 2;
        this.destTop = (this.lowerCanvas.clientHeight - maxDimension.height) / 2;
        this.drawImgToCanvas(maxDimension);
        this.cropDestPoints = {startX: this.destLeft, startY: this.destTop, width: this.destWidth, height: this.destHeight};
        const temp: string = this.lowerContext.filter;
        this.lowerContext.filter = 'none';
        this.iterateObjColl(); this.zoomFreehandDrawColl();
        this.lowerContext.filter = temp;
        if (this.destWidth > 0 && this.destHeight > 0) {
            this.isImageLoaded = true;
        }
        if (this.isUndoRedo) {
            if (this.currFlipState !== '') {
                this.flip(this.toPascalCase(this.currFlipState) as Direction);
            }
        }
        if (this.disabled) { this.element.setAttribute('class', 'e-disabled'); }
        this.trigger('fileOpened', fileOpened);
    }

    private imageOnLoad(src: string): void {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const proxy: ImageEditor = this;
        proxy.baseImg.src = src;
        this.baseImg.onload = () => {
            this.lowerContext.drawImage(this.baseImg, 0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
            hideSpinner(this.element);
            this.element.style.opacity = '1';
            this.updateCanvas();
            if (this.currObjType.isUndoZoom) {
                this.currObjType.isUndoZoom = false;
                this.lowerCanvas.style.display = 'block';
            }
            this.isUndoRedo = false;
            if (Browser.isDevice) {
                if (this.isToolbar() && (!isNullOrUndefined(document.getElementById(this.element.id + '_toolbar'))) &&
                (!isNullOrUndefined((getComponent(document.getElementById(this.element.id + '_toolbar'), 'toolbar') as Toolbar)))) {
                    (getComponent(document.getElementById(this.element.id + '_toolbar'), 'toolbar') as Toolbar).destroy();
                }
                if (!isNullOrUndefined(document.getElementById(this.element.id + '_bottomToolbar')) &&
                (!isNullOrUndefined((getComponent(document.getElementById(this.element.id + '_bottomToolbar'), 'toolbar') as Toolbar)))) {
                    (getComponent(document.getElementById(this.element.id + '_bottomToolbar'), 'toolbar') as Toolbar).destroy();
                }
                this.initToolbarItem(false, Browser.isDevice, null);
                this.createBottomToolbar();
            } else {
                if (this.isToolbar() && (!isNullOrUndefined(document.getElementById(this.element.id + '_toolbar'))) &&
                (!isNullOrUndefined((getComponent(document.getElementById(this.element.id + '_toolbar'), 'toolbar') as Toolbar)))) {
                    (getComponent(document.getElementById(this.element.id + '_toolbar'), 'toolbar') as Toolbar).destroy();
                }
                this.initToolbarItem(false, false, null);
            }
        };
    }

    private refreshActiveObj(): void {
        this.activeObj = {} as SelectionPoint;
        this.activeObj.activePoint = {startX: 0, startY: 0, endX: 0, endY: 0, width: 0, height: 0};
        this.activeObj.flipObjColl = [];
        this.activeObj.strokeSettings = this.strokeSettings;
        this.activeObj.textSettings = this.textSettings;
    }

    private redrawText(): void {
        if (this.activeObj.textSettings.bold) {
            this.upperContext.font = 'bold ' + this.activeObj.textSettings.fontSize + 'px' + ' ' + this.activeObj.textSettings.fontFamily;
        }
        if (this.activeObj.textSettings.italic) {
            this.upperContext.font = 'bold ' + this.activeObj.textSettings.fontSize + 'px' + ' ' + this.activeObj.textSettings.fontFamily;
        }
        if (this.activeObj.textSettings.bold && this.activeObj.textSettings.italic) {
            this.upperContext.font = 'italic bold ' + this.activeObj.textSettings.fontSize + 'px' + ' ' + this.activeObj.textSettings.fontFamily;
        }
        if (!this.activeObj.textSettings.bold && !this.activeObj.textSettings.italic) {
            this.upperContext.font = this.activeObj.textSettings.fontSize + 'px' + ' ' + this.activeObj.textSettings.fontFamily;
        }
        const rows: string[] = this.activeObj.keyHistory.split('\n');
        const text: string = this.textArea.style.display === 'block' ? this.getMaxText(true) : this.getMaxText();
        const width: number = this.upperContext.measureText(text).width + this.activeObj.textSettings.fontSize * 0.5;
        const height: number = rows.length * (this.activeObj.textSettings.fontSize + this.activeObj.textSettings.fontSize * 0.25);
        this.setTextSelection(width, height);
        this.updateActiveObject(this.activeObj.activePoint, this.activeObj);
        this.redrawShape(this.activeObj);
    }

    private setTextSelection(width: number, height: number): void {
        let degree: number = this.degree;
        if (this.activeObj.shapeDegree === 0) {degree = this.degree; }
        else {degree =  this.degree - this.activeObj.shapeDegree; }
        if (degree < 0) {
            degree = 360 + degree;
        }
        for (let i: number = 0; i < this.activeObj.flipObjColl.length; i++) {
            if (degree === 0) {
                if (this.activeObj.flipObjColl[i as number].toLowerCase() === 'horizontal') {
                    this.activeObj.activePoint = { startX: this.activeObj.activePoint.endX - width,
                        startY: this.activeObj.activePoint.startY,
                        endX: (this.activeObj.activePoint.endX),
                        endY: this.activeObj.activePoint.startY + (height ? height : 0) };
                } else if (this.activeObj.flipObjColl[i as number].toLowerCase() === 'vertical') {
                    this.activeObj.activePoint.startY = this.activeObj.activePoint.endY - height;
                    this.activeObj.activePoint = { startX: this.activeObj.activePoint.startX, startY: this.activeObj.activePoint.startY,
                        endX: (this.activeObj.activePoint.startX + (width ? width : 0)),
                        endY: this.activeObj.activePoint.endY };
                } else {
                    this.activeObj.activePoint = { startX: this.activeObj.activePoint.startX, startY: this.activeObj.activePoint.startY,
                        endX: (this.activeObj.activePoint.startX + (width ? width : 0)),
                        endY: this.activeObj.activePoint.startY + (height ? height : 0) };
                }
            }
            else if (degree === 90) {
                if (this.activeObj.flipObjColl[i as number].toLowerCase() === 'vertical') {
                    this.activeObj.activePoint.startX = this.activeObj.activePoint.endX - height;
                    this.activeObj.activePoint = { startX: this.activeObj.activePoint.startX,
                        startY: this.activeObj.activePoint.endY - width,
                        endX: (this.activeObj.activePoint.endX),
                        endY: this.activeObj.activePoint.endY};
                } else if (this.activeObj.flipObjColl[i as number].toLowerCase() === 'horizontal') {
                    this.activeObj.activePoint.endX = this.activeObj.activePoint.startX + height;
                    this.activeObj.activePoint = { startX: this.activeObj.activePoint.startX, startY: this.activeObj.activePoint.startY,
                        endX: (this.activeObj.activePoint.endX),
                        endY: this.activeObj.activePoint.startY + (width ? width : 0) };
                } else {
                    this.activeObj.activePoint.startX = this.activeObj.activePoint.endX - height;
                    this.activeObj.activePoint = { startX: this.activeObj.activePoint.startX, startY: this.activeObj.activePoint.startY,
                        endX: (this.activeObj.activePoint.endX),
                        endY: this.activeObj.activePoint.startY + (width ? width : 0) };
                }
            } else if (degree === 180) {
                if (this.activeObj.flipObjColl[i as number].toLowerCase() === 'horizontal') {
                    this.activeObj.activePoint.startY = this.activeObj.activePoint.endY - height;
                    this.activeObj.activePoint = { startX: this.activeObj.activePoint.startX,
                        startY: this.activeObj.activePoint.startY,
                        endX: (this.activeObj.activePoint.startX + width),
                        endY: this.activeObj.activePoint.endY };
                } else if (this.activeObj.flipObjColl[i as number].toLowerCase() === 'vertical') {
                    this.activeObj.activePoint.endY = this.activeObj.activePoint.startY + height;
                    this.activeObj.activePoint = { endX: this.activeObj.activePoint.endX, endY: this.activeObj.activePoint.endY,
                        startX: (this.activeObj.activePoint.endX - (width ? width : 0)),
                        startY: this.activeObj.activePoint.startY };
                } else {
                    this.activeObj.activePoint = { endX: this.activeObj.activePoint.endX, endY: this.activeObj.activePoint.endY,
                        startX: (this.activeObj.activePoint.endX - (width ? width : 0)),
                        startY: this.activeObj.activePoint.endY - (height ? height : 0) };
                }
            } else if (degree === 270) {
                if (this.activeObj.flipObjColl[i as number].toLowerCase() === 'vertical') {
                    this.activeObj.activePoint = { startX: this.activeObj.activePoint.startX,
                        startY: this.activeObj.activePoint.startY,
                        endX: (this.activeObj.activePoint.startX + height),
                        endY: this.activeObj.activePoint.startY + (width ? width : 0) };
                } else if (this.activeObj.flipObjColl[i as number].toLowerCase() === 'horizontal') {
                    this.activeObj.activePoint.startX = this.activeObj.activePoint.endX - height;
                    this.activeObj.activePoint = { startX: this.activeObj.activePoint.startX,
                        startY: this.activeObj.activePoint.endY - (width ? width : 0),
                        endX: this.activeObj.activePoint.endX,
                        endY: this.activeObj.activePoint.endY};
                } else {
                    this.activeObj.activePoint.endX = this.activeObj.activePoint.startX + height;
                    this.activeObj.activePoint = { startX: this.activeObj.activePoint.startX,
                        startY: this.activeObj.activePoint.endY - (width ? width : 0),
                        endX: this.activeObj.activePoint.endX,
                        endY: this.activeObj.activePoint.endY};
                }
            }
        }
        if (this.activeObj.flipObjColl.length === 0) {
            if (degree === 0) {
                this.activeObj.activePoint = { startX: this.activeObj.activePoint.startX, startY: this.activeObj.activePoint.startY,
                    endX: (this.activeObj.activePoint.startX + (width ? width : 0)),
                    endY: this.activeObj.activePoint.startY + (height ? height : 0) };
            }
            else if (degree === 90) {
                this.activeObj.activePoint.startX = this.activeObj.activePoint.endX - height;
                this.activeObj.activePoint = { startX: this.activeObj.activePoint.startX, startY: this.activeObj.activePoint.startY,
                    endX: (this.activeObj.activePoint.endX),
                    endY: this.activeObj.activePoint.startY + (width ? width : 0) };
            } else if (degree === 180) {
                this.activeObj.activePoint = { endX: this.activeObj.activePoint.endX, endY: this.activeObj.activePoint.endY,
                    startX: (this.activeObj.activePoint.endX - (width ? width : 0)),
                    startY: this.activeObj.activePoint.endY - (height ? height : 0) };
            } else if (degree === 270) {
                this.activeObj.activePoint.endX = this.activeObj.activePoint.startX + height;
                this.activeObj.activePoint = { startX: this.activeObj.activePoint.startX,
                    startY: this.activeObj.activePoint.endY - (width ? width : 0),
                    endX: this.activeObj.activePoint.endX,
                    endY: this.activeObj.activePoint.endY};
            }
        }
        this.activeObj.activePoint.width = this.activeObj.activePoint.endX - this.activeObj.activePoint.startX;
        this.activeObj.activePoint.height = this.activeObj.activePoint.endY - this.activeObj.activePoint.startY;
        if (this.degree === 360 || this.degree === -360) {
            this.degree = 0;
        }
    }

    private updateUndoRedoColl(operation: string, value?: string | number | boolean | Dimension | SelectionPoint[],
                               previousObj?: SelectionPoint[] | Dimension | string | Object,
                               currentObj?: SelectionPoint[] | string | Object | Dimension,
                               zoomFactor?: number, sharpen?: boolean, bw?: boolean): void {
        if (!this.isInitialLoading) {
            this.undoRedoStep++;
            this.undoRedoColl.push({operation: operation, value: value, previousObj: previousObj, currentObj: currentObj,
                zoomFactor: zoomFactor, sharpen: sharpen, bw: bw});
            if (this.undoRedoColl.length > 16) {
                this.undoRedoColl.splice(0, 1);
                this.undoRedoStep--;
            }
            this.enableDisableToolbarBtn();
        }
    }

    private fileSelect(inputElement: HTMLInputElement, args: Event): void {
        showSpinner(this.element);
        this.element.style.opacity = '0.5';
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const filesData: FileList = (args.target as any).files[0];
        if (this.isImageLoaded) {this.isImageLoaded = false; this.reset(); }
        if (isNullOrUndefined(this.toolbarTemplate)) {this.reset(); this.update(); }
        this.fileName = inputElement.value.split('\\')[inputElement.value.split('\\').length - 1];
        this.fileName = this.fileName.split('.')[0];
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const URL: any = window.URL; const url: URL = URL.createObjectURL(filesData);
        this.imageOnLoad(url.toString());
        inputElement.value = '';
    }

    private findTextPoint(e: MouseEvent & TouchEvent): void {
        if (this.activeObj.shape === 'text') {
            this.textArea.style.transformOrigin = '0 0';
            let degree: number; let scale: string = '';
            if (this.activeObj.shapeDegree === 0) {
                degree = this.degree;
            }
            else {
                degree = this.degree - this.activeObj.shapeDegree;
            }
            if (degree < 0) {
                degree = 360 + degree;
            }
            if (this.activeObj.flipObjColl.length > 0) {
                // need to add scale value according to length.
                for (let i: number = 0; i < this.activeObj.flipObjColl.length; i++) {
                    if (degree !== 0 && degree % 90 === 0 && degree !== 180) {
                        scale += this.activeObj.flipObjColl[i as number].toLowerCase() === 'horizontal' ? 'scale(1, -1)' :
                            'scale(-1, 1)';
                    } else {
                        scale += this.activeObj.flipObjColl[i as number].toLowerCase() === 'horizontal' ? 'scale(-1, 1)' :
                            'scale(1, -1)';
                    }
                    if (this.activeObj.flipObjColl[i as number].toLowerCase() === 'horizontal') {
                        this.textArea.style.transform = 'rotate(' + degree + 'deg)' + scale;
                    } else if (this.activeObj.flipObjColl[i as number].toLowerCase() === 'vertical') {
                        this.textArea.style.transform = 'rotate(' + degree + 'deg)' + scale;
                    }
                }
            } else {
                this.textArea.style.transform = 'rotate(' + degree + 'deg)';
            }
            this.findTextTarget(e);
        }
    }

    private getStrokeWidth(text: string): string {
        let strokeWidth: string;
        const currentWidth: number = parseInt(text, 10) / 2;
        switch (currentWidth) {
        case 1:
            strokeWidth = this.l10n.getConstant('XSmall');
            break;
        case 2:
            strokeWidth = this.l10n.getConstant('Small');
            break;
        case 3:
            strokeWidth = this.l10n.getConstant('Medium');
            break;
        case 4:
            strokeWidth = this.l10n.getConstant('Large');
            break;
        case 5:
            strokeWidth = this.l10n.getConstant('XLarge');
            break;
        }
        return strokeWidth;
    }

    private updateToolbarItems(): void {
        const selFillElem: HTMLElement = this.element.querySelector('.e-fill.e-template .e-dropdownbtn-preview') as HTMLElement;
        const selStrokeElem: HTMLElement = this.element.querySelector('.e-stroke.e-template .e-dropdownbtn-preview') as HTMLElement;
        const selTextStrokeElem: HTMLElement = this.element.querySelector('.e-text-font-color.e-template .e-dropdownbtn-preview') as HTMLElement;
        const selPenStrokeElem: HTMLElement = this.element.querySelector('.e-pen-stroke-color.e-template .e-dropdownbtn-preview') as HTMLElement;
        const strokeWidthElem: HTMLElement = this.element.querySelector('.e-shape-stroke-width') as HTMLElement;
        const fontFamilyElem: HTMLElement = this.element.querySelector('.e-text-font-family') as HTMLElement;
        const fontSizeElem: HTMLElement = this.element.querySelector('.e-text-font-size') as HTMLElement;
        const fontStyleElem: HTMLElement = this.element.querySelector('.e-text-font-style') as HTMLElement;
        if (selFillElem) {
            if (this.activeObj.strokeSettings.fillColor === '') {
                selFillElem.classList.add('e-nocolor-item');
            } else {
                selFillElem.classList.remove('e-nocolor-item');
                selFillElem.style.background = this.activeObj.strokeSettings.fillColor;
            }
            (getComponent(this.element.id + '_shape_fill', 'colorpicker') as ColorPicker).value
            = this.activeObj.strokeSettings.fillColor + 'ff';
        }
        if (selStrokeElem) {
            selStrokeElem.style.background = this.activeObj.strokeSettings.strokeColor;
            (getComponent(this.element.id + '_shape_stroke', 'colorpicker') as ColorPicker).value
            = this.activeObj.strokeSettings.strokeColor + 'ff';
        }
        if (selTextStrokeElem) {
            selTextStrokeElem.style.background = this.activeObj.strokeSettings.strokeColor;
            (getComponent(this.element.id + '_text_font', 'colorpicker') as ColorPicker).value
            = this.activeObj.strokeSettings.strokeColor + 'ff';
        }
        if (selPenStrokeElem) {
            selPenStrokeElem.style.background = this.activeObj.strokeSettings.strokeColor;
            (getComponent(this.element.id + '_pen_stroke', 'colorpicker') as ColorPicker).value
            = this.activeObj.strokeSettings.strokeColor + 'ff';
        }
        if (fontFamilyElem) {
            if (Browser.isDevice) {
                fontFamilyElem.setAttribute('style', 'font-family:' + this.activeObj.textSettings.fontFamily.toLowerCase());
            } else {
                fontFamilyElem.textContent = this.activeObj.textSettings.fontFamily;
            }
        }
        if (fontSizeElem) {
            for (let i: number = 0; i < this.fontSizeColl.length; i++) {
                if (parseInt(this.fontSizeColl[i as number].text, 10) >= Math.round(this.activeObj.textSettings.fontSize)) {
                    fontSizeElem.textContent = (i + 1).toString();
                    break;
                }
            }
        }
        if (fontStyleElem) {
            if (Browser.isDevice) {
                if (!this.activeObj.textSettings.bold && !this.activeObj.textSettings.italic) {
                    fontStyleElem.setAttribute('style', '');
                } else if (this.activeObj.textSettings.bold && this.activeObj.textSettings.italic) {
                    fontStyleElem.setAttribute('style', 'font-style: italic;font-weight: bold');
                } else if (this.activeObj.textSettings.bold) {
                    fontStyleElem.setAttribute('style', 'font-weight: bold');
                } else {
                    fontStyleElem.setAttribute('style', 'font-style: italic');
                }
            } else {
                if (!this.activeObj.textSettings.bold && !this.activeObj.textSettings.italic) {
                    fontStyleElem.textContent = 'Default';
                } else if (this.activeObj.textSettings.bold && this.activeObj.textSettings.italic) {
                    fontStyleElem.textContent = 'Bold Italic';
                } else if (this.activeObj.textSettings.bold) {
                    fontStyleElem.textContent = 'Bold';
                } else {
                    fontStyleElem.textContent = 'Italic';
                }
            }
        }
        if (strokeWidthElem) {
            const strokeWidth: string = Math.round((this.activeObj.strokeSettings.strokeWidth)).toString();
            strokeWidthElem.textContent = this.getStrokeWidth(strokeWidth);
        }
    }

    private setTimer(e: MouseEvent & TouchEvent): void {
        if (!this.isTimer && this.timer > 10) {
            this.findTextPoint(e);
            if (Browser.isDevice) {
                this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
            }
        }
    }

    // eslint-disable-next-line
    private targetTouches(touches: any): Point[] {
        const p1: Point = {x: touches[0].pageX, y: touches[0].pageY};
        const p2: Point = {x: touches[1].pageX, y: touches[1].pageY};
        const points: Point[] = [p1, p2];
        return points;
    }

    private calculateScale(startTouches: Point[], endTouches: Point[]): number {
        const startDistance: number = this.getDistance(startTouches[0], startTouches[1]);
        const endDistance: number = this.getDistance(endTouches[0], endTouches[1]);
        return endDistance / startDistance;
    }

    private getDistance(a: Point, b: Point): number {
        let x: number = 0; let y: number = 0;
        if (!isNullOrUndefined(a) && !isNullOrUndefined(b)) {
            x = a.x - b.x;
            y = a.y - b.y;
        }
        return Math.sqrt(x * x + y * y);
    }

    private setXYPoints(e: MouseEvent & TouchEvent): Point {
        e.preventDefault();
        let x: number; let y: number;
        if (e.type === 'mousedown') {
            x = e.clientX; y = e.clientY;
        } else {
            this.touchEndPoint.x = x = e.touches[0].clientX;
            this.touchEndPoint.y = y = e.touches[0].clientY;
        }
        const bbox: DOMRect = this.lowerCanvas.getBoundingClientRect() as DOMRect;
        x -= bbox.left; y -= bbox.top;
        return {x: x, y: y};
    }

    private touchStartHandler(e: MouseEvent & TouchEvent): void {
        e.preventDefault();
        if (e.touches.length === 2) {
            this.isFirstMove = true;
        } else {
            this.timer = setTimeout(this.setTimer.bind(this), 1000, e);
            this.mouseDownEventHandler(e);
        }
        EventHandler.add(this.lowerCanvas, 'touchend', this.mouseUpEventHandler, this);
        EventHandler.add(this.lowerCanvas, 'touchmove', this.mouseMoveEventHandler, this);
        EventHandler.add(this.upperCanvas, 'touchend', this.mouseUpEventHandler, this);
        EventHandler.add(this.upperCanvas, 'touchmove', this.mouseMoveEventHandler, this);
    }

    private isShapeTouch(e: MouseEvent & TouchEvent, isCropSelection: boolean): boolean {
        let isShape: boolean = false;
        if (e.type === 'touchstart') {
            this.redrawActObj();
            const points: Point = this.setXYPoints(e);
            const x: number = points.x; const y: number = points.y;
            isShape = this.findTargetObj(x, y, isCropSelection);
        }
        return isShape;
    }

    private isFreehandDrawTouch(e: MouseEvent & TouchEvent, isCropSelection: boolean): boolean {
        let isFreehandDraw: boolean = false;
        if (e.type === 'touchstart' && !isCropSelection) {
            this.redrawActObj();
            const points: Point = this.setXYPoints(e);
            const x: number = points.x; const y: number = points.y;
            this.setCursor(x, y);
            if (this.isFreehandDrawingPoint) {
                isFreehandDraw = true;
            }
        }
        return isFreehandDraw;
    }

    private selectFreehandDraw(index?: number): void {
        this.isFreehandDrawEditing = true;
        if (!isNullOrUndefined(index) || index === 0) {
            if (this.isFreehandDrawIndex(index)) {
                this.freehandDrawSelectedIndex = this.freehandDrawHoveredIndex = index;
                this.hoverFreehandraw();
                this.upperCanvas.style.cursor = 'pointer';
            } else {
                return;
            }
        }
        this.freehandDrawSelectedIndex = this.freehandDrawHoveredIndex;
        this.pointColl[this.freehandDrawSelectedIndex].isSelected = true;
        if (this.pointColl[this.freehandDrawHoveredIndex].strokeColor !== '#42a5f5') {
            this.tempFreeHandDrawEditingStyles.strokeColor = this.pointColl[this.freehandDrawHoveredIndex].strokeColor;
        }
        this.tempFreeHandDrawEditingStyles.strokeWidth = this.pointColl[this.freehandDrawHoveredIndex].strokeWidth;
        if (this.isFreehandDrawEditing) {
            this.refreshToolbar('pen');
        } else {
            this.okBtn();
        }
    }

    private closeContextualToolbar(): boolean {
        let isContextualToolbar: boolean = false;
        if ((!isNullOrUndefined(this.element.querySelector('#' + this.element.id + '_contextualToolbar')) &&
            !this.element.querySelector('#' + this.element.id + '_contextualToolbar').parentElement.classList.contains('e-hide')) ||
            (!isNullOrUndefined(this.element.querySelector('#' + this.element.id + '_headWrapper'))
            && !this.element.querySelector('#' + this.element.id + '_headWrapper').parentElement.classList.contains('e-hide'))) {
            this.element.querySelector('.e-contextual-toolbar-wrapper').classList.add('e-hide');
            this.okBtn();
            this.refreshToolbar('main');
            isContextualToolbar = true;
        }
        return isContextualToolbar;
    }

    private mouseDownEventHandler(e: MouseEvent & TouchEvent): void {
        if (e.type === 'touchstart') {
            this.isTouch = true;
        }
        if (e.type === 'touchstart' && e.currentTarget === this.lowerCanvas && !this.isImageLoaded) {
            return;
        }
        let isCropSelection: boolean = false; let splitWords: string[]; let isPan: boolean = true;
        if (this.activeObj.shape !== undefined) {splitWords = this.activeObj.shape.split('-'); }
        if (splitWords !== undefined && splitWords[0] === 'crop'){
            isCropSelection = true;
        }
        if (isCropSelection) {
            this.dragCanvas = this.togglePan = true;
        }
        if (isCropSelection && this.dragCanvas) {
            const points: Point = this.setXYPoints(e);
            const x: number = points.x; const y: number = points.y;
            this.setCursor(x, y);
            if (this.upperCanvas.style.cursor !== 'move' && this.upperCanvas.style.cursor !== 'crosshair' &&
            this.upperCanvas.style.cursor !== 'default' && this.upperCanvas.style.cursor !== 'grab') {
                isPan = false;
            }
        }
        const isShape: boolean = this.isShapeTouch(e, isCropSelection);
        const isFreehandDraw: boolean = this.isFreehandDrawTouch(e, isCropSelection);
        if (!isShape && !this.togglePen && !isCropSelection) {
            this.refreshToolbar('main');
            this.closeContextualToolbar();
        }
        if (this.dragCanvas && isPan && (this.upperCanvas.style.cursor === 'grab' || this.isTouch)
            && !isShape && !isFreehandDraw && !this.togglePen) {
            if (this.isFreehandDrawEditing) {
                this.applyFreehandDraw();
            }
            this.applyShape();
            this.canvasMouseDownHandler(e);
        }
        else {
            const points: Point = this.setXYPoints(e);
            const x: number = points.x; const y: number = points.y;
            this.redrawActObj(x, y);
            if (this.isFreehandDrawingPoint || (this.isFreehandDrawCustomized && !this.togglePen)) {
                if (!isNullOrUndefined(this.freehandDrawSelectedIndex) &&
                    this.freehandDrawSelectedIndex !== this.freehandDrawHoveredIndex) {
                    const tempHoveredIndex: number = this.freehandDrawHoveredIndex;
                    this.okBtn();
                    this.isFreehandDrawCustomized = false;
                    this.freehandDrawHoveredIndex = tempHoveredIndex;
                    if (this.freehandDrawHoveredIndex > -1) {
                        const strokeColor: string = this.pointColl[this.freehandDrawHoveredIndex].strokeColor === '#fff' ? '#42a5f5' : this.pointColl[this.freehandDrawHoveredIndex].strokeColor;
                        this.hoverFreehandraw(strokeColor, this.pointColl[this.freehandDrawHoveredIndex].strokeWidth);
                    }
                }
                if (!isNullOrUndefined(this.freehandDrawHoveredIndex) && this.freehandDrawHoveredIndex > -1) {
                    this.selectFreehandDraw();
                } else if (this.freehandDrawSelectedIndex) {
                    this.okBtn();
                    const strokeColor: string = this.pointColl[this.freehandDrawSelectedIndex].strokeColor;
                    this.hoverFreehandraw(strokeColor, this.pointColl[this.freehandDrawSelectedIndex].strokeWidth);
                }
            } else {
                if (this.isFreehandDrawEditing) {
                    this.cancelFreehandDraw();
                }
                this.closeContextualToolbar();
                this.isFreehandDrawEditing = false;
                if (this.upperCanvas.style.cursor === 'crosshair' || (Browser.isDevice && this.togglePen)) {
                    if (this.togglePen) {
                        if (isNullOrUndefined(this.activeObj.strokeSettings)) {
                            this.activeObj.strokeSettings = this.strokeSettings;
                        }
                        if (isNullOrUndefined(this.penStrokeWidth)) {
                            this.penStrokeWidth = 2;
                        }
                        this.upperContext.strokeStyle = this.activeObj.strokeSettings.strokeColor;
                        this.upperContext.fillStyle = this.activeObj.strokeSettings.strokeColor;
                        this.freehandDownHandler(e, this.upperCanvas); // To handle Freehand drawing
                    } else {
                        this.refreshActiveObj();
                        this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
                    }
                    this.currObjType.isActiveObj = false; this.dragElement = '';
                    this.dragPoint.startX = this.dragPoint.startY = this.dragPoint.endX = this.dragPoint.endY = 0;
                }
                if ((this.upperCanvas.style.cursor !== 'crosshair' && e.type.toLowerCase() === 'touchstart') ||
                (this.currObjType.isActiveObj && this.upperCanvas.style.cursor !== 'default' && !this.togglePen)) {
                    if (this.currObjType.isUndoAction) {
                        this.refreshUndoRedoColl();
                    }
                    this.findTarget(x, y, e.type);
                }
                else if ((this.currObjType.shape === '' || this.currObjType.isCustomCrop) && !this.togglePen  && this.upperCanvas.style.cursor !== 'default') {
                    this.setActivePoint(x, y);
                }
                if (!isNullOrUndefined(this.activeObj)) {
                    let isCropSelection: boolean = false;
                    let splitWords: string[];
                    if (this.activeObj.shape !== undefined) {splitWords = this.activeObj.shape.split('-'); }
                    if (splitWords === undefined && (this.currObjType.isCustomCrop || this.togglePen)) {
                        isCropSelection = true;
                    } else if (splitWords !== undefined && splitWords[0] === 'crop'){
                        isCropSelection = true;
                    }
                    if ((this.activeObj.shape === 'rectangle') || (this.activeObj.shape === 'ellipse')
                    || (this.activeObj.shape === 'line')) {
                        this.refreshToolbar('shapes');
                    }
                    else if (this.activeObj.shape === 'text') {
                        this.refreshToolbar('text');
                    }
                    else if (!isCropSelection) {
                        this.callMainToolbar();
                    }
                    this.updateToolbarItems();
                }
            }
        }
        this.isShapeInserted = false;
        this.tempActiveObj = extend({}, this.activeObj, {}, true) as SelectionPoint;
    }

    private mouseMoveEventHandler(e: MouseEvent & TouchEvent): void {
        e.preventDefault();
        if (e.type === 'touchmove' && e.touches.length === 2) {
            if (this.isFirstMove) {
                this.startTouches = this.targetTouches(e.touches);
                this.tempTouches = [];
                this.tempTouches.push({x: e.touches[0].clientX || (e.touches[0].pageX - this.lowerCanvas.offsetLeft),
                    y: e.touches[0].clientY || (e.touches[0].pageY - this.lowerCanvas.offsetTop)});
                this.tempTouches.push({x: e.touches[1].clientX || (e.touches[1].pageX - this.lowerCanvas.offsetLeft),
                    y: e.touches[1].clientY || (e.touches[1].pageY - this.lowerCanvas.offsetTop)});
            } else {
                const firstFingerX: number = e.touches[0].clientX || (e.touches[0].pageX - this.lowerCanvas.offsetLeft);
                const firstFingerY: number = e.touches[0].clientY || (e.touches[0].pageY - this.lowerCanvas.offsetTop);
                const secondFingerX: number = e.touches[1].clientX || (e.touches[1].pageX - this.lowerCanvas.offsetLeft);
                const secondFingerY: number = e.touches[1].clientY || (e.touches[1].pageY - this.lowerCanvas.offsetTop);
                const scale: number = this.calculateScale(this.startTouches, this.targetTouches(e.touches));
                // Need to set lastX and lastY points
                if (this.tempTouches[0].x !== firstFingerX && this.tempTouches[0].y !== firstFingerY &&
                    this.tempTouches[1].x !== secondFingerX && this.tempTouches[1].y !== secondFingerY) {
                    if (scale > 1) {
                        this.zoom(1.1);
                    } else {
                        this.zoom(-1.1);
                    }
                    this.tempTouches = [];
                    this.tempTouches.push({x: e.touches[0].clientX || (e.touches[0].pageX - this.lowerCanvas.offsetLeft),
                        y: e.touches[0].clientY || (e.touches[0].pageY - this.lowerCanvas.offsetTop)});
                    this.tempTouches.push({x: e.touches[1].clientX || (e.touches[1].pageX - this.lowerCanvas.offsetLeft),
                        y: e.touches[1].clientY || (e.touches[1].pageY - this.lowerCanvas.offsetTop)});
                }
            }
            this.isFirstMove = false;
            return;
        }
        if (this.textArea.style.display === 'none') {
            this.isTimer = true;
        }
        let x: number; let y: number;
        if (e.type === 'mousemove') {
            x = e.clientX; y = e.clientY;
        } else {
            this.touchEndPoint.x = x = e.touches[0].clientX;
            this.touchEndPoint.y = y = e.touches[0].clientY;
        }
        const bbox: DOMRect = this.lowerCanvas.getBoundingClientRect() as DOMRect;
        x -= bbox.left; y -= bbox.top;
        this.canvasMouseMoveHandler(e);
        let isCropSelection: boolean = false; let splitWords: string[];
        if (this.activeObj.shape !== undefined) {splitWords = this.activeObj.shape.split('-'); }
        if (splitWords !== undefined && splitWords[0] === 'crop'){
            isCropSelection = true;
        }
        if (isCropSelection && this.zoomFactor > 0) {
            this.disableZoomOutBtn();
        }
        if (this.currObjType.isActiveObj && (this.activeObj.activePoint !== undefined || this.objColl.length > 0) &&
        !this.dragCanvas || this.activeObj.activePoint !== undefined) {
            if (this.dragElement === '') {
                this.setCursor(x, y);
                if ((!isNullOrUndefined(this.activeObj.activePoint) && this.activeObj.activePoint.width === 0) && this.upperCanvas.style.cursor !== 'default' &&
                this.upperCanvas.style.cursor !== 'move' && this.upperCanvas.style.cursor !== 'crosshair'
                && this.upperCanvas.style.cursor !== 'grab' && this.upperCanvas.style.cursor !== 'pointer') {
                    this.upperCanvas.style.cursor = 'move';
                }
                this.findTarget(x, y, e.type);
            }
        }
        if (this.currObjType.isDragging) {
            this.upperContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
            this.updateActivePoint(x, y, isCropSelection);
            if (this.isPreventDragging) {
                if ((this.activeObj.activePoint.startX > this.destLeft) &&
                    (this.activeObj.activePoint.endX < this.destLeft + this.destWidth) && (this.activeObj.activePoint.startY > this.destTop)
                    && (this.activeObj.activePoint.endY < this.destTop + this.destHeight)) {
                    this.isPreventDragging = false;
                }
                this.drawObject('duplicate', null, null, null, true);
            } else {
                this.drawObject('duplicate');
            }
            if (isCropSelection) {
                this.dragCanvas = this.togglePan = true;
            }
        }
    }

    private mouseUpEventHandler(e: MouseEvent & TouchEvent): void {
        if (e.type === 'touchstart') {
            this.isTouch = false;
        }
        e.preventDefault();
        if (this.togglePan) {this.canvasMouseUpHandler(e); }
        let x: number; let y: number;
        if (e.type === 'mouseup') {
            x = e.clientX; y = e.clientY;
        } else {
            x = this.touchEndPoint.x; y = this.touchEndPoint.y;
        }
        const bbox: DOMRect = this.lowerCanvas.getBoundingClientRect() as DOMRect;
        x -= bbox.left; y -= bbox.top;
        if (e.type === 'touchend') {
            this.startTouches = this.tempTouches = [];
            this.isFirstMove = false;
            if (this.textArea.style.display === 'none') {
                this.isTimer = false; this.timer = 0;
            }
        }
        let isCropSelection: boolean = false; let splitWords: string[];
        if (this.activeObj.shape !== undefined) {splitWords = this.activeObj.shape.split('-'); }
        if (splitWords !== undefined && splitWords[0] === 'crop'){
            isCropSelection = true;
        }
        if (e.currentTarget === this.upperCanvas) {
            this.currObjType.shape = this.currObjType.shape.toLowerCase();
            if (!this.togglePen && !this.dragCanvas) {
                if (!isNullOrUndefined(this.tempObjColl) && this.activeObj.activePoint.width !== 0) {
                    this.objColl.push(this.activeObj);
                    if (JSON.stringify(this.activeObj.activePoint) !== JSON.stringify(this.tempActiveObj.activePoint)) {
                        this.undoRedoColl.push({operation: 'shapeTransform', value: null,
                            currentObj: extend([], this.objColl, [], true) as SelectionPoint[],
                            previousObj: this.tempObjColl, zoomFactor: this.zoomFactor,
                            sharpen: this.adjustmentLevel.sharpen, bw: this.adjustmentLevel.bw});
                        this.undoRedoStep++;
                    }
                    this.redrawShape(this.objColl[this.objColl.length - 1]);
                    this.tempObjColl = undefined;
                }
                if (!this.isFreehandDrawEditing) {
                    this.applyCurrActObj(x, y);
                }
            } else if (isCropSelection && !this.togglePen) {
                if (JSON.stringify(this.activeObj.activePoint) !== JSON.stringify(this.tempActiveObj.activePoint)) {
                    this.undoRedoColl.push({operation: 'selectionTransform', value: null,
                        currentObj: extend([], this.objColl, [], true) as SelectionPoint[],
                        previousObj: this.objColl, zoomFactor: this.zoomFactor,
                        currentSelectionObj: extend([], this.activeObj, {}, true) as SelectionPoint,
                        previousSelectionObj: extend([], this.tempActiveObj, {}, true) as SelectionPoint,
                        sharpen: this.adjustmentLevel.sharpen, bw: this.adjustmentLevel.bw});
                    this.undoRedoStep++;
                }
            }
        }
        if (this.togglePen && e.currentTarget === this.upperCanvas){
            this.freehandUpHandler(e, this.upperCanvas, this.upperContext);
        } else {this.currObjType.shape = ''; }
        this.dragElement = '';
        this.currObjType.isInitialLine = this.currObjType.isDragging = false;
        this.oldPoint.x = undefined; this.oldPoint.y = undefined;
    }

    private keyDownEventHandler(e: KeyboardEvent): void {
        let shapeChangingArgs: ShapeChangeEventArgs = {};
        let previousShapeSettings: ShapeSettings = {} as ShapeSettings;
        const beforeSave: BeforeSaveEventArgs = {fileName: this.fileName, fileType: this.fileType, cancel: false};
        let splitWords: string[];
        switch (e.key) {
        case (e.ctrlKey && 's'):
            this.trigger('beforeSave', beforeSave, (observableSaveArgs: BeforeSaveEventArgs) => {
                if (!beforeSave.cancel) {
                    this.export(observableSaveArgs.fileType, observableSaveArgs.fileName);
                }
            });
            e.preventDefault();
            e.stopImmediatePropagation();
            break;
        case (e.ctrlKey && 'z'):
            if (this.allowUndoRedo) {
                this.callUndo();
            }
            break;
        case (e.ctrlKey && 'y'):
            if (this.allowUndoRedo) {
                this.callRedo();
            }
            break;
        case 'Delete':
            if (this.isFreehandDrawEditing) {
                this.updateFreehandDrawColorChange();
                // eslint-disable-next-line
                const previousObj: any = extend([], this.pointColl, [], true);
                this.deleteFreehandDraw(this.freehandDrawHoveredIndex);
                this.updateUndoRedoColl('delete', 'freehanddraw', previousObj, this.pointColl, this.zoomFactor);
            } else if (this.textArea.style.display === 'none') {
                this.objColl.push(this.activeObj);
                const previousObj: SelectionPoint[] = extend([], this.objColl, [], true) as SelectionPoint[];
                this.objColl.pop();
                previousShapeSettings = this.updatePreviousShapeSettings();
                shapeChangingArgs = {action: 'delete', previousShapeSettings: previousShapeSettings, currentShapeSettings: null};
                this.keyHistory = '';
                this.clearSelection();
                this.trigger('shapeChanging', shapeChangingArgs);
                this.refreshToolbar('main');
                this.updateUndoRedoColl('delete', 'shape', previousObj, this.objColl, this.zoomFactor);
            }
            break;
        case 'Escape':
            if (this.togglePan) {
                this.refreshToolbar(this.currentToolbar);
                this.pan(false);
            } else if (this.textArea.style.display === 'block') {
                this.redrawActObj();
            } else {
                this.performCancel();
            }
            break;
        case 'Enter':
            if (this.activeObj.shape !== undefined) {splitWords = this.activeObj.shape.split('-'); }
            if (this.activeObj.horTopLine !== undefined && (this.activeObj.shape !== undefined && splitWords[0] === 'crop')) {
                this.crop();
            }
            break;
        default:
            if (Browser.isDevice && this.textArea.style.display === 'block') {
                setTimeout(this.textKeyDown.bind(this), 1, e);
            }
            break;
        }
    }

    private keyUpEventHandler(e: KeyboardEvent): void {
        // eslint-disable-next-line
        if (this.textArea.style.display === 'block' && (e.target as any).id === this.element.id + '_textArea') {
            setTimeout(this.textKeyDown.bind(this), 1, e);
        }
    }

    private canvasMouseDownHandler(e: MouseEvent & TouchEvent): void {
        e.preventDefault();
        let x: number; let y: number;
        if (e.type === 'mousedown') {
            x = e.offsetX || (e.pageX - this.lowerCanvas.offsetLeft);
            y = e.offsetY || (e.pageY - this.lowerCanvas.offsetTop);
        } else {
            x = e.touches[0].clientX || (e.touches[0].pageX - this.lowerCanvas.offsetLeft);
            y = e.touches[0].clientY || (e.touches[0].pageY - this.lowerCanvas.offsetTop);
        }
        const bbox: DOMRect = this.lowerCanvas.getBoundingClientRect() as DOMRect;
        x -= bbox.left; y -= bbox.top;
        this.panDown = {x: x, y: y};
        this.lastPan = {x: this.destLeft, y: this.destTop};
        if (isNullOrUndefined(this.tempPanMove)) {
            this.tempPanMove = {x: x, y: y};
        }
    }

    private canvasMouseMoveHandler(e: MouseEvent & TouchEvent): void {
        if (this.dragCanvas) {this.lowerCanvas.style.cursor = 'grab'; }
        else {this.dragCanvas = this.togglePan = false;
            this.lowerCanvas.style.cursor = this.upperCanvas.style.cursor = 'default'; }
        let x: number; let y: number;
        if (e.type === 'mousemove') {
            x = e.offsetX || (e.pageX - this.lowerCanvas.offsetLeft);
            y = e.offsetY || (e.pageY - this.lowerCanvas.offsetTop);
        } else {
            x = e.touches[0].clientX || (e.touches[0].pageX - this.lowerCanvas.offsetLeft);
            y = e.touches[0].clientY || (e.touches[0].pageY - this.lowerCanvas.offsetTop);
        }
        const bbox: DOMRect = this.lowerCanvas.getBoundingClientRect() as DOMRect;
        x -= bbox.left; y -= bbox.top;
        this.panMove = {x: x, y: y};
        if (this.panDown && this.panMove && this.togglePan && this.dragCanvas) {
            this.drawPannedImage();
        }
    }

    private canvasMouseUpHandler(e: MouseEvent & TouchEvent): void {
        e.preventDefault();
        if (this.togglePan) {
            if (this.panDown && this.panMove && this.togglePan && this.dragCanvas) {
                this.panDown = null; this.panMove = null; this.tempPanMove = null;
                this.updateUndoRedoColl('pan', null, {x: this.lastPan.x, y: this.lastPan.y}, {x: this.destLeft, y: this.destTop});
            }
        }
        this.currObjType.isDragging = false;
    }

    private handleScroll(e: KeyboardEvent): void {
        let x: number; let y: number; let isInsideCanvas: boolean = false;
        if (e.type === 'mousewheel') {
            // eslint-disable-next-line
            x = (e as any).clientX; y = (e as any).clientY;
        }
        const bbox: DOMRect = this.lowerCanvas.getBoundingClientRect() as DOMRect;
        x -= bbox.left; y -= bbox.top;
        if (x > this.destLeft && x < this.destLeft + this.destWidth && y > this.destTop && y < this.destTop + this.destHeight) {
            isInsideCanvas = true;
        }
        if (e.ctrlKey === true && isInsideCanvas) {
            e.preventDefault();
        }
    }

    private textKeyDown(e: KeyboardEvent): void {
        if (String.fromCharCode(e.which) === '\r') {
            this.textRow += 1;
        }
        this.textArea.setAttribute('rows', this.textRow.toString());
        this.textArea.style.height = 'auto';
        this.textArea.style.height = this.textArea.scrollHeight + 'px';
        this.setTextBoxWidth(e);
        if (Browser.isDevice) {
            this.textArea.style.width = parseFloat(this.textArea.style.width) + this.textArea.style.fontSize + 'px';
        }
        const rows: string[] = this.textArea.value.split('\n');
        this.textRow = rows.length;
        this.textArea.setAttribute('rows', this.textRow.toString());
    }

    private adjustToScreen(): void {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const proxy: ImageEditor = this;
        if ((!isNullOrUndefined(this.element.querySelector('#' + this.element.id + '_contextualToolbar')) &&
            !this.element.querySelector('#' + this.element.id + '_contextualToolbar').parentElement.classList.contains('e-hide')) ||
            (!isNullOrUndefined(this.element.querySelector('#' + this.element.id + '_headWrapper'))
            && !this.element.querySelector('#' + this.element.id + '_headWrapper').parentElement.classList.contains('e-hide'))) {
            this.element.querySelector('.e-contextual-toolbar-wrapper').classList.add('e-hide');
            this.okBtn();
            this.refreshToolbar('main');
        }
        let splitWords: string[]; let isSelectionCrop: boolean = false;
        if (this.activeObj.shape !== undefined) {splitWords = this.activeObj.shape.split('-'); }
        if (splitWords !== undefined && splitWords[0] === 'crop'){
            isSelectionCrop = true;
            this.updateImageRatioForActObj();
            this.objColl.push(this.activeObj);
            this.refreshActiveObj();
        }
        if (this.textArea.style.display === 'block') {
            this.redrawActObj();
        }
        const tempFilter: string = this.lowerContext.filter;
        this.update(); this.applyActObj(); this.refreshActiveObj();
        this.lowerContext.filter = this.initialAdjustmentValue = tempFilter;
        if (this.isImageLoaded) {
            showSpinner(this.element);
            this.element.style.opacity = '0.5';
        }
        this.lowerContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
        this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
        const canvasWrapper: HTMLElement = document.querySelector('#' + this.element.id + '_canvasWrapper');
        if (!isNullOrUndefined(canvasWrapper)) {
            canvasWrapper.style.width = this.element.offsetWidth + 'px';
            canvasWrapper.style.height = this.element.offsetHeight + 'px';
            if (Browser.isDevice) {
                canvasWrapper.style.height = (parseFloat(canvasWrapper.style.height) - (2 * this.toolbarHeight)) - 3 + 'px';
            } else {
                canvasWrapper.style.height = (parseFloat(canvasWrapper.style.height) - this.toolbarHeight) - 3 + 'px';
            }
        }
        const maxDimension: Dimension = this.calcMaxDimension(this.srcWidth, this.srcHeight);
        if (this.defaultZoomFactor > 0) {
            maxDimension.width += (maxDimension.width * this.defaultZoomFactor);
            maxDimension.height += (maxDimension.height * this.defaultZoomFactor);
        }
        this.destLeft = (this.lowerCanvas.clientWidth - maxDimension.width) / 2;
        this.destTop = (this.lowerCanvas.clientHeight - maxDimension.height) / 2;
        if (this.degree === 0 && this.currFlipState === '') {
            if (this.defaultZoomFactor > 0) {
                this.destLeft += this.totalPannedPoint.x;
                this.destTop += this.totalPannedPoint.y;
            }
            this.drawImgToCanvas(maxDimension);
        } else {
            this.drawImgToCanvas(maxDimension);
            this.updateCurrentTransformedState('initial');
            const temp: string = this.lowerContext.filter;
            this.updateBrightnessFilter();
            this.lowerContext.drawImage(this.baseImg, this.srcLeft, this.srcTop, this.srcWidth,
                                        this.srcHeight, this.destLeft, this.destTop, this.destWidth, this.destHeight);
            this.lowerContext.filter = temp;
            this.updateCurrentTransformedState('reverse');
        }
        this.zoomObjColl(); this.zoomFreehandDrawColl();
        if (this.isCircleCrop) {
            this.cropCircle(this.lowerContext);
        }
        hideSpinner(this.element); this.element.style.opacity = '1';
        if (this.defToolbarItems.length > 0 && (!isNullOrUndefined(document.getElementById(this.element.id + '_toolbar')))) {
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            const toolbar: any = getComponent(proxy.element.id + '_toolbar', 'toolbar') as Toolbar;
            toolbar.refreshOverflow();
            if (!isNullOrUndefined(this.element.querySelector('.e-contextual-toolbar-wrapper'))) {
                this.element.querySelector('.e-contextual-toolbar-wrapper').classList.add('e-hide');
            }
        }
        this.refreshActiveObj();
        this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
        if (isSelectionCrop) {
            this.activeObj = extend({}, this.objColl[this.objColl.length - 1], null, true) as SelectionPoint;
            this.objColl.pop();
            this.drawObject('duplicate', this.activeObj);
        }
        if ((this.degree !== 0 || this.currFlipState !== '') && this.defaultZoomFactor > 0) {
            const totalPannedPoint: Point = extend({}, this.totalPannedPoint, null, true) as Point;
            const totalPannedInternalPoint: Point = extend({}, this.totalPannedInternalPoint, null, true) as Point;
            const totalPannedClientPoint: Point = extend({}, this.totalPannedClientPoint, null, true) as Point;
            this.zoom(.1); this.zoom(-.1);
            if (this.degree === 0) {
                this.destLeft += totalPannedPoint.x; this.destTop += totalPannedPoint.y;
                this.totalPannedPoint = totalPannedPoint;
                this.updateFlipPan();
            } else {
                this.totalPannedInternalPoint = totalPannedInternalPoint;
                this.totalPannedClientPoint = totalPannedClientPoint;
                this.currentPannedPoint = {x: 0, y: 0};
                this.isCropTab = true;
                this.rotatePan();
                this.isCropTab = false;
            }
        } else if (this.degree !== 0 && this.cropZoomFactor > 0) {
            this.zoomFactor = this.cropZoomFactor = 0;
            this.enableDisableToolbarBtn();
        }
    }

    private screenOrientation(): void {
        if (Browser.isDevice) {
            setTimeout(this.adjustToScreen.bind(this), 100);
        }
    }

    private windowResizeHandler(): void {
        if (!Browser.isDevice) {
            this.adjustToScreen();
        }
    }

    private updatePreviousShapeSettings(): ShapeSettings {
        const fontStyle: string[] = [];
        if (this.activeObj.shape === 'text' && !isNullOrUndefined(this.activeObj.textSettings)) {
            if (this.activeObj.textSettings.bold) {
                fontStyle.push('bold');
            }
            if (this.activeObj.textSettings.italic) {
                fontStyle.push('italic');
            }
            if (this.activeObj.textSettings.underline) {
                fontStyle.push('underline');
            }
        }
        return {id: !isNullOrUndefined(this.activeObj.currIndex) ? this.activeObj.currIndex : null,
            type: this.toPascalCase(this.activeObj.shape) as ShapeType,
            startX: this.activeObj.activePoint.startX, startY: this.activeObj.activePoint.startY,
            width: this.activeObj.activePoint.width, height: this.activeObj.activePoint.height,
            strokeColor: !isNullOrUndefined(this.activeObj.strokeSettings) ? this.activeObj.strokeSettings.strokeColor : null,
            strokeWidth: !isNullOrUndefined(this.activeObj.strokeSettings) ? this.activeObj.strokeSettings.strokeWidth : null,
            fillColor: !isNullOrUndefined(this.activeObj.strokeSettings) ? this.activeObj.strokeSettings.fillColor : null,
            radius: this.activeObj.shape === 'ellipse' ? this.activeObj.activePoint.width / 2 : null,
            length: this.activeObj.shape === 'line' ? this.activeObj.activePoint.width : null,
            text: this.activeObj.shape === 'text' ? (!isNullOrUndefined(this.activeObj.keyHistory) ? this.activeObj.keyHistory : null) : null,
            fontSize: this.activeObj.shape === 'text' ? (!isNullOrUndefined(this.activeObj.textSettings) ? this.activeObj.textSettings.fontSize : null) : null,
            fontStyle: this.activeObj.shape === 'text' ? fontStyle : null,
            color: this.activeObj.shape === 'text' ? (!isNullOrUndefined(this.activeObj.strokeSettings) ? this.activeObj.strokeSettings.strokeColor : null) : null
        };
    }

    private disableZoomOutBtn(): boolean {
        let isDisabled: boolean = false;
        const zoomOut: HTMLElement = document.querySelector('#' + this.element.id + '_zoomOut');
        const destLeft: number = this.destLeft; const destTop: number = this.destTop;
        const destWidth: number = this.destWidth; const destHeight: number = this.destHeight;
        if (this.degree === 0 || this.degree === 180) {
            if (!isNullOrUndefined(this.activeObj.shape)) {
                this.setZoomDimension(-0.1, this.activeObj);
                if (this.destLeft > this.activeObj.activePoint.startX || this.destTop > this.activeObj.activePoint.startY ||
                this.destLeft + this.destWidth < this.activeObj.activePoint.endX || this.destTop + this.destHeight <
                this.activeObj.activePoint.endY) {
                    zoomOut.classList.add('e-disabled');
                    zoomOut.parentElement.classList.add('e-overlay');
                    isDisabled = true;
                } else {
                    zoomOut.classList.remove('e-disabled');
                    zoomOut.parentElement.classList.remove('e-overlay');
                    isDisabled = false;
                }
            } else {
                this.setZoomDimension(-0.1, null);
            }
        }
        this.destLeft = destLeft; this.destTop = destTop; this.destWidth = destWidth; this.destHeight = destHeight;
        return isDisabled;
    }

    private setZoomDimension(value: number, selectionObj: SelectionPoint): Dimension {
        let maxDimension: Dimension = { width: 0, height: 0 };
        if (this.degree % 90 === 0 && this.degree % 180 !== 0) {
            maxDimension = this.calcMaxDimension(this.srcHeight, this.srcWidth);
        } else {
            maxDimension = this.calcMaxDimension(this.srcWidth, this.srcHeight);
        }
        maxDimension.width += (maxDimension.width * this.zoomFactor);
        maxDimension.height += (maxDimension.height * this.zoomFactor);
        this.destLeft += ((this.destWidth - maxDimension.width) / 2);
        this.destTop += ((this.destHeight - maxDimension.height) / 2);
        // While zoom out limit image to draw inside the selection range
        if (value < 0 && !isNullOrUndefined(selectionObj)) {
            if (this.destLeft > selectionObj.activePoint.startX) {
                this.destLeft = selectionObj.activePoint.startX;
            }
            if (this.destTop > selectionObj.activePoint.startY) {
                this.destTop = selectionObj.activePoint.startY;
            }
            if (this.destLeft +  maxDimension.width < selectionObj.activePoint.startX + selectionObj.activePoint.width) {
                this.destLeft = this.destLeft + (selectionObj.activePoint.startX + selectionObj.activePoint.width) -
                    (this.destLeft +  maxDimension.width);
            }
            if (this.destTop +  maxDimension.height < selectionObj.activePoint.startY + selectionObj.activePoint.height) {
                this.destTop = this.destTop + (selectionObj.activePoint.startY + selectionObj.activePoint.height) -
                    (this.destTop +  maxDimension.height);
            }
        } else if (value < 0 && isNullOrUndefined(selectionObj)) {
            if (this.destLeft > 0) {
                this.destLeft = 0;
            }
            if (this.destTop > 0) {
                this.destTop = 0;
            }
            if (this.destLeft +  maxDimension.width < this.lowerCanvas.width) {
                this.destLeft = this.lowerCanvas.width - this.destWidth;
            }
            if (this.destTop +  maxDimension.height < this.lowerCanvas.height) {
                this.destTop = this.lowerCanvas.height - this.destHeight;
            }
        }
        return maxDimension;
    }

    private applyCurrActObj(x: number, y: number): void {
        let isInside: boolean = false;
        const actObj: SelectionPoint = extend({}, this.activeObj, {}, true) as SelectionPoint;
        if (isNullOrUndefined(actObj.activePoint)) {
            return;
        }
        if ((x >= Math.floor(actObj.activePoint.startX) && x <= Math.ceil(actObj.activePoint.endX) &&
            y >= Math.floor(actObj.activePoint.startY) && y <= Math.ceil(actObj.activePoint.endY))) {
            isInside = true;
        }
        if (!isInside) {
            this.updateImageRatioForActObj();
            if (this.activeObj.horTopLine !== undefined && this.activeObj.horTopLine.startX !== 0 && this.activeObj.horTopLine.endX !== 0
                && !this.currObjType.isCustomCrop && this.currObjType.shape !== '') {
                this.objColl.push(extend({}, this.activeObj, {}, true) as SelectionPoint);
            }
            if (this.activeObj.shape === 'text' || (this.currObjType.shape === 'ellipse' || this.currObjType.shape === 'rectangle' ||
               this.currObjType.shape === 'line')) {
                const tempFilter: string = this.lowerContext.filter;
                this.lowerContext.filter = this.getDefaultFilter();
                for (let i: number = 0; i < this.objColl.length; i++) {
                    if (this.isObjInsideCropRegion(this.objColl[i as number])) {
                        this.apply(this.objColl[i as number].shape, this.objColl[i as number]); this.refreshActiveObj();
                    }
                }
                this.zoomFreehandDrawColl();
                this.lowerContext.filter = tempFilter;
                this.apply('shape');
                this.clearOuterCanvas(this.lowerContext); this.clearOuterCanvas(this.upperContext);
                if (this.isCircleCrop) {
                    this.cropCircle(this.lowerContext);
                }
            }
            this.refreshToolbar('main');
        }
    }

    private updateTextFromTextArea(): void {
        if (this.activeObj.keyHistory !== this.textArea.value) {
            this.updateUndoRedoColl('text', this.objColl, this.activeObj.keyHistory, this.textArea.value,
                                    this.zoomFactor, this.adjustmentLevel.sharpen, this.adjustmentLevel.bw);
        }
        this.activeObj.keyHistory = this.textArea.value;
        this.textArea.style.display = 'none';
        this.textArea.value = '';
        this.updateFontStyles();
        let width: number = this.upperContext.measureText(this.activeObj.keyHistory).width +
        this.activeObj.textSettings.fontSize * 0.5;
        let height: number = this.activeObj.textSettings.fontSize + this.activeObj.textSettings.fontSize * 0.25;
        const rows: string[] = this.activeObj.keyHistory.split('\n');
        if (rows.length > 1) {
            height *= rows.length;
            const widthColl: number[] = [];
            for (let i: number = 0; i < rows.length; i++) {
                widthColl.push(this.upperContext.measureText(rows[i as number]).width +
                this.activeObj.textSettings.fontSize * 0.5);
            }
            width = Math.max(...widthColl);
        }
        this.setTextSelection(width, height);
        this.updateActiveObject(this.activeObj.activePoint, this.activeObj);
        this.updateImageRatioForActObj();
    }

    private setTextBoxStylesToActObj(): void {
        this.activeObj.textSettings.fontFamily = this.textArea.style.fontFamily;
        this.activeObj.strokeSettings.strokeColor = this.textArea.style.color;
        if (this.textArea.style.fontWeight === 'bold') {
            this.activeObj.textSettings.bold = true;
        } else {
            this.activeObj.textSettings.bold = false;
        }
        if (this.textArea.style.fontStyle === 'italic') {
            this.activeObj.textSettings.italic = true;
        } else {
            this.activeObj.textSettings.italic = false;
        }
        this.activeObj.textSettings.fontSize = (parseFloat(this.textArea.style.fontSize));
    }

    private redrawActObj(x?: number, y?: number): void {
        let splitWords: string[];
        if (this.activeObj.shape !== undefined) {splitWords = this.activeObj.shape.split('-'); }
        if (this.activeObj.horTopLine !== undefined && (this.activeObj.shape !== undefined && splitWords[0] !== 'crop')) {
            if (this.textArea.style.display === 'block') {
                this.setTextBoxStylesToActObj();
                this.updateFontRatio(this.activeObj, true);
                if (x && y) {
                    if ((x !== this.activeObj.activePoint.startX) && (y !== this.activeObj.activePoint.startY)) {
                        this.updateTextFromTextArea();
                        this.applyActObj();
                    }
                } else {
                    this.updateTextFromTextArea();
                    this.apply(this.activeObj.shape, this.activeObj);
                    this.objColl.push(this.activeObj);
                    this.refreshActiveObj();
                    this.textArea.style.transform = '';
                    this.refreshToolbar('main');
                }
            } else {
                this.applyActObj();
            }
        }
    }

    private setTextBoxPos(actObj: SelectionPoint, degree: number, flip: string, x: number, y: number): Point {
        const point: Point = {x: x, y: y};
        if (degree === 0) {
            if (flip.toLowerCase() === 'horizontal') {
                point.x = actObj.activePoint.endX;
                point.y = actObj.activePoint.startY;
            }
            else if (flip.toLowerCase() === 'vertical') {
                point.x = actObj.activePoint.startX;
                point.y = actObj.activePoint.endY;
            }
            else {
                point.x = actObj.activePoint.startX;
                point.y = actObj.activePoint.startY;
            }
        } else if (degree === 90) {
            if (flip.toLowerCase() === 'horizontal') {
                point.x = actObj.activePoint.startX;
                point.y = actObj.activePoint.startY;
            }
            else if (flip.toLowerCase() === 'vertical') {
                point.x = actObj.activePoint.endX;
                point.y = actObj.activePoint.endY;
            }
            else {
                point.x = actObj.activePoint.endX;
                point.y = actObj.activePoint.startY;
            }
        } else if (degree === 180) {
            if (flip.toLowerCase() === 'horizontal') {
                point.x = actObj.activePoint.startX;
                point.y = actObj.activePoint.endY;
            }
            else if (flip.toLowerCase() === 'vertical') {
                point.x = actObj.activePoint.endX;
                point.y = actObj.activePoint.startY;
            }
            else {
                point.x = actObj.activePoint.endX;
                point.y = actObj.activePoint.endY;
            }
        } else if (degree === 270) {
            if (flip.toLowerCase() === 'horizontal') {
                point.x = actObj.activePoint.endX;
                point.y = actObj.activePoint.endY;
            }
            else if (flip.toLowerCase() === 'vertical') {
                point.x = actObj.activePoint.startX;
                point.y = actObj.activePoint.startY;
            }
            else {
                point.x = actObj.activePoint.startX;
                point.y = actObj.activePoint.endY;
            }
        }
        return point;
    }

    private setTextBoxPoints(actObj: SelectionPoint, degree: number, flip: string, x: number, y: number): Point {
        const point: Point = {x: x, y: y};
        if (degree === 0) {
            if (actObj.flipObjColl[0].toLowerCase() === 'horizontal') {
                if (flip.toLowerCase() === 'horizontal') {
                    point.x = (actObj.activePoint.startX);
                    point.y = (actObj.activePoint.startY);
                } else if (flip.toLowerCase() === 'vertical') {
                    point.x = (actObj.activePoint.endX);
                    point.y = (actObj.activePoint.endY);
                }
            } else {
                if (flip.toLowerCase() === 'horizontal') {
                    point.x = (actObj.activePoint.endX);
                    point.y = (actObj.activePoint.endY);
                } else if (flip.toLowerCase() === 'vertical') {
                    point.x = (actObj.activePoint.endX);
                    point.y = (actObj.activePoint.startY);
                }
            }
        } else if (degree === 90) {
            if (actObj.flipObjColl[0].toLowerCase() === 'horizontal') {
                if (flip.toLowerCase() === 'horizontal') {
                    point.x = (actObj.activePoint.endX);
                    point.y = (actObj.activePoint.endY);
                } else if (flip.toLowerCase() === 'vertical') {
                    point.x = (actObj.activePoint.startX);
                    point.y = (actObj.activePoint.endY);
                }
            } else {
                if (flip.toLowerCase() === 'horizontal') {
                    point.x = (actObj.activePoint.startX);
                    point.y = (actObj.activePoint.endY);
                } else if (flip.toLowerCase() === 'vertical') {
                    point.x = (actObj.activePoint.startX);
                    point.y = (actObj.activePoint.startY);
                }
            }
        } else if (degree === 180) {
            if (actObj.flipObjColl[0].toLowerCase() === 'horizontal') {
                if (flip.toLowerCase() === 'horizontal') {
                    point.x = (actObj.activePoint.startX);
                    point.y = (actObj.activePoint.startY);
                }
                else if (flip.toLowerCase() === 'vertical') {
                    point.x = (actObj.activePoint.startX);
                    point.y = (actObj.activePoint.startY);
                }
            } else {
                if (flip.toLowerCase() === 'horizontal') {
                    point.x = (actObj.activePoint.startX);
                    point.y = (actObj.activePoint.startY);
                }
                else if (flip.toLowerCase() === 'vertical') {
                    point.x = (actObj.activePoint.startX);
                    point.y = (actObj.activePoint.endY);
                }
            }
        } else if (degree === 270) {
            if (actObj.flipObjColl[0].toLowerCase() === 'horizontal') {
                if (flip.toLowerCase() === 'horizontal') {
                    point.x = (actObj.activePoint.startX);
                    point.y = (actObj.activePoint.startY);
                }
                else if (flip.toLowerCase() === 'vertical') {
                    point.x = (actObj.activePoint.endX);
                    point.y = (actObj.activePoint.startY);
                }
            } else {
                if (flip.toLowerCase() === 'horizontal') {
                    point.x = (actObj.activePoint.endX);
                    point.y = (actObj.activePoint.startY);
                }
                else if (flip.toLowerCase() === 'vertical') {
                    point.x = (actObj.activePoint.endX);
                    point.y = (actObj.activePoint.endY);
                }
            }
        }
        return point;
    }

    private findTextTarget(e: MouseEvent & TouchEvent): void {
        let x: number; let y: number;
        if (e.type === 'dblclick') {
            x = e.clientX; y = e.clientY;
        } else if (e.type === 'touchstart') {
            this.touchEndPoint.x = x = e.touches[0].clientX;
            this.touchEndPoint.y = y = e.touches[0].clientY;
        }
        this.preventZoomBtn = true;
        this.refreshToolbar('text');
        this.preventZoomBtn = false;
        this.updateToolbarItems();
        if (!isNullOrUndefined(x) && !isNullOrUndefined(y)) {
            const bbox: DOMRect = this.lowerCanvas.getBoundingClientRect() as DOMRect;
            x -= bbox.left; y -= bbox.top;
            let degree: number; let flip: string = '';
            if (this.activeObj.shapeDegree === 0) {
                degree = this.degree;
            }
            else {
                degree = this.degree - this.activeObj.shapeDegree;
            }
            if (degree < 0) {
                degree = 360 + degree;
            }
            if (this.activeObj.textFlip === '') {
                if (this.activeObj.textFlip === this.currFlipState) {
                    flip = '';
                }
                else {
                    flip = this.currFlipState;
                }
            } else {
                if (this.activeObj.textFlip === this.currFlipState) {
                    flip = '';
                }
                else if (this.currFlipState === '') {
                    flip = this.activeObj.textFlip;
                } else {
                    flip = this.currFlipState;
                }
            }
            let temp: SelectionPoint;
            if (this.textArea.style.display === 'none') {
                temp = extend({}, this.activeObj, {}, true) as SelectionPoint;
                for (let i: number = 0; i < this.objColl.length; i++) {
                    if (JSON.stringify(this.activeObj) === JSON.stringify(this.objColl[i as number])) {
                        this.objColl.splice(i, 1);
                    }
                }
                this.refreshActiveObj();
                this.lowerContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
                this.redrawImgWithObj();
                //this.zoomFreehandDrawColl();
                if ((!isNullOrUndefined(this.currSelectionPoint) && this.currSelectionPoint.shape === 'crop-circle') || this.isCircleCrop) {
                    this.cropCircle(this.lowerContext);
                }
                this.activeObj = temp; this.updateFontStyles();
                const actObj: SelectionPoint = extend({}, this.activeObj, {}, true) as SelectionPoint;
                if (x >= (actObj.activePoint.startX - (actObj.topLeftCircle.radius * 2)) &&
                            x <= (actObj.activePoint.endX + (actObj.topLeftCircle.radius * 2)) &&
                            y >= (actObj.activePoint.startY - (actObj.topLeftCircle.radius * 2)) &&
                            y <= (actObj.activePoint.endY + (actObj.topLeftCircle.radius * 2))) {
                    this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
                    if (actObj.flipObjColl.length === 4) {
                        actObj.flipObjColl = [];
                        flip = '';
                    }
                    if (flip === '' && actObj.flipObjColl.length > 1) {
                        flip = actObj.flipObjColl[actObj.flipObjColl.length - 1];
                    }
                    if (actObj.flipObjColl.length <= 1) {
                        const points: Point = this.setTextBoxPos(actObj, degree, flip, x, y);
                        x = points.x; y = points.y;
                    } else {
                        const points: Point = this.setTextBoxPoints(actObj, degree, flip, x, y);
                        x = points.x; y = points.y;
                    }
                    this.textArea.style.display = 'block';
                    this.textArea.style.left = x + 'px';
                    this.textArea.style.top = y + 'px';
                    this.textArea.style.fontFamily = actObj.textSettings.fontFamily;
                    this.textArea.style.fontSize = actObj.textSettings.fontSize + 'px';
                    this.textArea.style.color = actObj.strokeSettings.strokeColor;
                    this.textArea.style.fontWeight = actObj.textSettings.bold ? 'bold' : 'normal';
                    this.textArea.style.fontStyle = actObj.textSettings.italic ? 'italic' : 'normal';
                    this.textArea.style.border = '2px solid ' + this.themeColl[this.theme]['primaryColor'];
                    this.textArea.value = actObj.keyHistory;
                    this.textArea.style.overflow = 'hidden';
                    this.textArea.style.height = 'auto';
                    this.textArea.focus();
                    if (degree % 90 === 0 && degree % 180 !== 0 && degree !== 0) {
                        if (this.zoomFactor === 0) {
                            this.textArea.style.width = (actObj.activePoint.height) + 'px';
                            this.textArea.style.height = (actObj.activePoint.width) + 'px';
                        } else {
                            this.textArea.style.width = actObj.activePoint.height + 'px';
                            this.textArea.style.height = actObj.activePoint.width + 'px';
                        }
                    } else {
                        if (this.zoomFactor === 0) {
                            this.textArea.style.width = (actObj.activePoint.width) + 'px';
                            this.textArea.style.height = (actObj.activePoint.height) + 'px';
                        } else {
                            this.textArea.style.width = actObj.activePoint.width + 'px';
                            this.textArea.style.height = actObj.activePoint.height + 'px';
                        }
                    }
                    this.setTextBoxWidth();
                    if (this.flipColl.length <= 1) {
                        this.setTextBoxHeight();
                    }
                } else {
                    this.applyActObj();
                }
            }
        } else if (this.textArea.style.display === 'block' && this.selectedText() !== '' && e.type === 'mousedown') {
            const temp: string = this.textArea.value;
            this.textArea.value += 'a';
            this.textArea.value = temp;
        }
    }

    private selectedText(): string {
        const start: number = this.textArea.selectionStart;
        const finish: number = this.textArea.selectionEnd;
        return this.textArea.value.substring(start, finish);
    }

    private setTextBoxHeight(): void {
        let textAreaTop: number;
        let degree: number; let flip: string = '';
        const actObj: SelectionPoint = extend({}, this.activeObj, {}, true) as SelectionPoint;
        if (actObj.shapeDegree === 0) {
            degree = this.degree;
        }
        else {
            degree = this.degree - actObj.shapeDegree;
        }
        if (degree < 0) {
            degree = 360 + degree;
        }
        if (actObj.textFlip === '') {
            if (actObj.textFlip === this.currFlipState) {
                flip = '';
            }
            else {
                flip = this.currFlipState;
            }
        } else {
            if (actObj.textFlip === this.currFlipState) {
                flip = '';
            }
            else if (this.currFlipState === '') {
                flip = actObj.textFlip;
            } else {
                flip = this.currFlipState;
            }
        }
        if (degree === 0) {
            if (flip.toLowerCase() === 'vertical') {
                this.textArea.style.maxHeight = (this.destHeight - (this.destHeight
                - parseFloat(this.textArea.style.top))) + 'px';
            }
            else {
                textAreaTop = parseFloat(this.textArea.style.top) - this.destTop;
                this.textArea.style.maxHeight = (this.destHeight - textAreaTop) + 'px';
            }
        } else if (degree === 90) {
            if (flip.toLowerCase() === 'horizontal') {
                this.textArea.style.maxHeight = (this.destWidth - (parseFloat(this.textArea.style.left)
                - this.destLeft)) + 'px';
            }
            else {
                this.textArea.style.maxHeight = (parseFloat(this.textArea.style.left)
                - this.destLeft) + 'px';
            }
        } else if (degree === 180) {
            if (flip.toLowerCase() === 'vertical') {
                textAreaTop = parseFloat(this.textArea.style.top) - this.destTop;
                this.textArea.style.maxHeight = (this.destHeight - textAreaTop) + 'px';
            }
            else {
                this.textArea.style.maxHeight = (parseFloat(this.textArea.style.top)
                - this.destTop) + 'px';
            }
        } else if (degree === 270) {
            if (flip.toLowerCase() === 'horizontal') {
                this.textArea.style.maxHeight = (parseFloat(this.textArea.style.left)
                - this.destLeft) + 'px';
            }
            else {
                this.textArea.style.maxHeight = this.destWidth - (parseFloat(this.textArea.style.left)
                - this.destLeft) + 'px';
            }
        }
        //this.textArea.style.maxHeight = ((parseFloat(this.textArea.style.maxHeight) - parseFloat(this.textArea.style.fontSize) * 0.5)) + 'px';
    }

    private setTextBoxWidth(e?: KeyboardEvent): void {
        const text: string = this.getMaxText(true);
        if (this.textArea.style.display === 'block') {
            this.updateFontStyles(true);
        } else {this.updateFontStyles(); }
        const textAreaWidth: number = (this.upperContext.measureText(text).width + (parseFloat(this.textArea.style.fontSize) / 2));
        const letterWidth: number = e ? this.upperContext.measureText(String.fromCharCode(e.which)).width : 0;
        const actObj: SelectionPoint = extend({}, this.activeObj, {}, true) as SelectionPoint;
        let degree: number; let flip: string = '';
        if (actObj.shapeDegree === 0) {
            degree = this.degree;
        }
        else {
            degree = this.degree - actObj.shapeDegree;
        }
        if (degree < 0) {
            degree = 360 + degree;
        }
        if (actObj.shapeFlip !== this.currFlipState) {
            flip = '';
        }
        else {
            flip = this.currFlipState;
        }
        if ((!isNullOrUndefined(e) && parseFloat(this.textArea.style.width) < (textAreaWidth + letterWidth)) || isNullOrUndefined(e)) {
            if (degree === 0) {
                if (flip.toLowerCase() === 'horizontal') {
                    if ((parseFloat(this.textArea.style.left) - this.destLeft) - textAreaWidth - letterWidth > 0) {
                        this.textArea.style.width = (textAreaWidth + letterWidth) + 'px';
                    }
                }
                else {
                    if ((this.destWidth - (parseFloat(this.textArea.style.left)
                    - this.destLeft)) > (textAreaWidth + letterWidth)) {
                        this.textArea.style.width = (textAreaWidth + letterWidth) + 'px';
                    }
                }
            } else if (degree === 90) {
                if (flip.toLowerCase() === 'vertical') {
                    if ((parseFloat(this.textArea.style.top) - this.destTop) - textAreaWidth - letterWidth > 0) {
                        this.textArea.style.width = (textAreaWidth + letterWidth) + 'px';
                    }
                }
                else {
                    if ((this.destWidth - (parseFloat(this.textArea.style.top)
                    - this.destTop)) > (textAreaWidth + letterWidth)) {
                        this.textArea.style.width = (textAreaWidth + letterWidth) + 'px';
                    }
                }
            } else if (degree === 180) {
                if (flip.toLowerCase() === 'horizontal') {
                    if ((this.destWidth - (parseFloat(this.textArea.style.left)
                    - this.destLeft)) > (textAreaWidth + letterWidth)) {
                        this.textArea.style.width = (textAreaWidth + letterWidth) + 'px';
                    }
                }
                else {
                    if ((parseFloat(this.textArea.style.left) - this.destLeft) - textAreaWidth - letterWidth > 0) {
                        this.textArea.style.width = (textAreaWidth + letterWidth) + 'px';
                    }
                }
            } else if (degree === 270) {
                if (flip.toLowerCase() === 'vertical') {
                    if ((this.destHeight - (parseFloat(this.textArea.style.top)
                    - this.destTop)) > (textAreaWidth + letterWidth)) {
                        this.textArea.style.width = (textAreaWidth + letterWidth) + 'px';
                    }
                }
                else {
                    if ((parseFloat(this.textArea.style.top) - this.destTop) - textAreaWidth - letterWidth > 0) {
                        this.textArea.style.width = (textAreaWidth + letterWidth) + 'px';
                    }
                }
            }
        }
    }

    private setActivePoint(startX?: number, startY?: number): void {
        if (isNullOrUndefined(this.activeObj.activePoint)) {
            return;
        }
        if (this.currObjType.isText) {
            const textWidth: number = startX ? startX : 0;
            const textHeight: number = startY ? startY : this.activeObj.textSettings.fontSize;
            if (this.activeObj.textSettings.fontSize === undefined) {
                this.activeObj.textSettings.fontSize = (Math.abs(this.baseImg.width - this.baseImg.height)) * 0.1;
            }
            this.setTextSelection(textWidth, textHeight);
            this.mouseDownPoint.x = this.activeObj.activePoint.endX; this.mouseDownPoint.y = this.activeObj.activePoint.endY;
            if (this.activeObj.horTopLine !== undefined) {
                this.activeObj.activePoint = extend({}, this.activeObj.activePoint, {}, true) as ActivePoint;
            }
            this.drawObject('duplicate');
        } else if (startX && startY) {
            this.activeObj.activePoint.startX = this.mouseDownPoint.x = startX;
            this.activeObj.activePoint.startY = this.mouseDownPoint.y = startY;
            this.currObjType.isDragging = true;
        } else {
            const selectInfo: SelectionPoint = this.activeObj;
            this.activeObj.activePoint = { startX: selectInfo.horTopLine.startX, startY: selectInfo.horTopLine.startY,
                endX: selectInfo.horTopLine.endX, endY: selectInfo.horTopLine.endY };
            this.activeObj.activePoint.width = this.activeObj.activePoint.endX - this.activeObj.activePoint.startX;
            this.activeObj.activePoint.height = this.activeObj.activePoint.endY - this.activeObj.activePoint.startY;
        }
    }

    private setDragWidth(width: number): void {
        const tempWidth: number = width;
        if (tempWidth >= 0) {
            for (let i: number = 0; i < tempWidth; i++) {
                width = tempWidth - i;
                this.activeObj.activePoint.startX += width; this.activeObj.activePoint.endX += width;
                if (this.activeObj.activePoint.startX >= this.destLeft &&
                    this.activeObj.activePoint.endX <= this.destLeft + this.destWidth) {
                    break;
                } else {
                    this.activeObj.activePoint.startX -= width; this.activeObj.activePoint.endX -= width;
                }
            }
        } else {
            for (let i: number = 1; i < Math.abs(tempWidth); i++) {
                width = tempWidth + i;
                this.activeObj.activePoint.startX += width; this.activeObj.activePoint.endX += width;
                if (this.activeObj.activePoint.startX >= this.destLeft &&
                    this.activeObj.activePoint.endX <= this.destLeft + this.destWidth) {
                    break;
                } else {
                    this.activeObj.activePoint.startX -= width; this.activeObj.activePoint.endX -= width;
                }
            }
        }
    }

    private setDragHeight(height: number): void {
        const tempHeight: number = height;
        if (tempHeight >= 0) {
            for (let i: number = 1; i < tempHeight; i++) {
                height = tempHeight - i;
                this.activeObj.activePoint.startY += height; this.activeObj.activePoint.endY += height;
                if (this.activeObj.activePoint.startY >= this.destTop &&
                    this.activeObj.activePoint.endY <= this.destTop + this.destHeight) {
                    break;
                } else {
                    this.activeObj.activePoint.startY -= height; this.activeObj.activePoint.endY -= height;
                }
            }
        } else {
            for (let i: number = 0; i < Math.abs(tempHeight); i++) {
                height = tempHeight + i;
                this.activeObj.activePoint.startY += height; this.activeObj.activePoint.endY += height;
                if (this.activeObj.activePoint.startY >= this.destTop &&
                    this.activeObj.activePoint.endY <= this.destTop + this.destHeight) {
                    break;
                } else {
                    this.activeObj.activePoint.startY -= height; this.activeObj.activePoint.endY -= height;
                }
            }
        }
    }

    private triggerShapeChange(shapeResizingArgs: ShapeChangeEventArgs, shapeMovingArgs: ShapeChangeEventArgs, type: string): void {
        this.activeObj.activePoint.width = this.activeObj.activePoint.endX - this.activeObj.activePoint.startX;
        this.activeObj.activePoint.height = this.activeObj.activePoint.endY - this.activeObj.activePoint.startY;
        const currentShapeSettings: ShapeSettings = this.updatePreviousShapeSettings();
        shapeResizingArgs.currentShapeSettings = currentShapeSettings; shapeMovingArgs.currentShapeSettings = currentShapeSettings;
        if (type === 'resize') {
            this.trigger('shapeChanging', shapeResizingArgs); this.updateShapeChangeEventArgs(shapeResizingArgs.currentShapeSettings);
        } else {
            this.trigger('shapeChanging', shapeMovingArgs); this.updateShapeChangeEventArgs(shapeMovingArgs.currentShapeSettings);
        }
    }

    private updateActivePoint(x: number, y: number, isCropSelection: boolean):  void {
        const maxDimension: Dimension = this.calcMaxDimension(this.activeObj.activePoint.width, this.activeObj.activePoint.height);
        const previousShapeSettings: ShapeSettings = this.updatePreviousShapeSettings();
        const shapeResizingArgs: ShapeChangeEventArgs = {action: 'resize',  previousShapeSettings: previousShapeSettings};
        const shapeMovingArgs: ShapeChangeEventArgs = {action: 'move', previousShapeSettings: previousShapeSettings};
        if (this.activeObj.shape === 'text' && this.dragElement !== '') {
            this.updateFontRatio(this.activeObj);
        }
        switch (this.dragElement.toLowerCase()) {
        case 'nw-resize':
            this.updateNWPoints(x, y, maxDimension);
            this.triggerShapeChange(shapeResizingArgs, shapeMovingArgs, 'resize');
            break;
        case 'n-resize':
            this.updateNPoints(x, y);
            this.triggerShapeChange(shapeResizingArgs, shapeMovingArgs, 'resize');
            break;
        case 'ne-resize':
            this.updateNEPoints(x, y, maxDimension);
            this.triggerShapeChange(shapeResizingArgs, shapeMovingArgs, 'resize');
            break;
        case 'w-resize':
            this.updateWPoints(x, y);
            this.triggerShapeChange(shapeResizingArgs, shapeMovingArgs, 'resize');
            break;
        case 'e-resize':
            this.updateEPoints(x, y);
            this.triggerShapeChange(shapeResizingArgs, shapeMovingArgs, 'resize');
            break;
        case 'sw-resize':
            this.updateSWPoints(x, y, maxDimension);
            this.triggerShapeChange(shapeResizingArgs, shapeMovingArgs, 'resize');
            break;
        case 's-resize':
            this.updateSPoints(x, y);
            this.triggerShapeChange(shapeResizingArgs, shapeMovingArgs, 'resize');
            break;
        case 'se-resize':
            this.updateSEPoints(x, y, maxDimension);
            this.triggerShapeChange(shapeResizingArgs, shapeMovingArgs, 'resize');
            break;
        default:
            if (!isCropSelection && !this.currObjType.isCustomCrop) {
                if (this.dragPoint.startX) {
                    const width: number = (this.dragPoint.endX - this.previousPoint.x);
                    const height: number = (this.dragPoint.endY - this.previousPoint.y);
                    this.activeObj.activePoint.startX += width; this.activeObj.activePoint.endX += width;
                    this.activeObj.activePoint.startY += height; this.activeObj.activePoint.endY += height;
                    if (!this.isPreventDragging && (this.activeObj.activePoint.startX < this.destLeft ||
                        this.activeObj.activePoint.startY < this.destTop || this.activeObj.activePoint.endX >
                        this.destLeft + this.destWidth || this.activeObj.activePoint.endY > this.destTop + this.destHeight)) {
                        this.activeObj.activePoint.startX -= width;
                        this.activeObj.activePoint.endX -= width;
                        this.activeObj.activePoint.startY -= height;
                        this.activeObj.activePoint.endY -= height;
                        this.setDragWidth(width); this.setDragHeight(height);
                    }
                } else {
                    this.activeObj.activePoint.startX = x < this.mouseDownPoint.x ? x : this.mouseDownPoint.x;
                    this.activeObj.activePoint.startY = y < this.mouseDownPoint.y ? y : this.mouseDownPoint.y;
                    x = x < this.mouseDownPoint.x ? this.mouseDownPoint.x : x;
                    y = y < this.mouseDownPoint.y ? this.mouseDownPoint.y : y;
                    this.activeObj.activePoint.endX = x;
                    this.activeObj.activePoint.endY = y;
                }
                this.triggerShapeChange(shapeResizingArgs, shapeMovingArgs, 'move');
            }
            break;
        }
    }

    private preventDraggingInvertly(): void {
        if (!this.isPreventDragging) {
            if (this.activeObj.activePoint.startX < this.destLeft) {
                this.activeObj.activePoint.startX = this.destLeft;
            }
            if (this.activeObj.activePoint.startY < this.destTop) {
                this.activeObj.activePoint.startY = this.destTop;
            }
            if (this.activeObj.activePoint.endX > this.destLeft + this.destWidth) {
                this.activeObj.activePoint.endX = this.destLeft + this.destWidth;
            }
            if (this.activeObj.activePoint.endY > this.destTop + this.destHeight) {
                this.activeObj.activePoint.endY = this.destTop + this.destHeight;
            }
        }
    }

    private updateNWPoints(x: number, y: number, maxDimension: Dimension): void {
        let diff: number; let width: number; let height: number; let scale: number; let percentage: number;
        const prevDiffX: number = this.diffPoint.x; const prevDiffY: number = this.diffPoint.y;
        const tempActiveObj: SelectionPoint = extend({}, this.activeObj, null, true) as SelectionPoint;
        if (this.activeObj.shape === 'text') {
            if (this.oldPoint.x === undefined && this.oldPoint.y === undefined) {
                this.diffPoint.x = this.activeObj.activePoint.startX - x; this.diffPoint.y = this.activeObj.activePoint.startY - y;
            }
            else {this.diffPoint.x = this.oldPoint.x - x; this.diffPoint.y = this.oldPoint.y - y; }
            this.oldPoint.x = x; this.oldPoint.y = y;
            if (this.diffPoint.x <= prevDiffX && this.diffPoint.y >= prevDiffY) {diff = Math.min(this.diffPoint.x, this.diffPoint.y); }
            else {diff = Math.max(this.diffPoint.x, this.diffPoint.y); }
            percentage = (diff / 10);
            this.activeObj.activePoint.startX -= (maxDimension.width / 100) * percentage;
            this.activeObj.activePoint.startY -= (maxDimension.height / 100) * percentage;
            this.activeObj.activePoint.width = this.activeObj.activePoint.endX - this.activeObj.activePoint.startX;
            this.activeObj.activePoint.height = this.activeObj.activePoint.endY - this.activeObj.activePoint.startY;
            this.updateFontSize(this.activeObj);
        } else {
            let splitWords: string[];
            if (this.activeObj.shape !== undefined) {splitWords = this.activeObj.shape.split('-'); }
            if (this.activeObj.shape === 'crop-custom' || (this.activeObj.shape !== undefined && splitWords[0] !== 'crop')) {
                this.activeObj.activePoint.startX = x; this.activeObj.activePoint.startY = y;
                if (this.activeObj.activePoint.startX > this.activeObj.activePoint.endX) {
                    const temp: number = this.activeObj.activePoint.startX;
                    this.activeObj.activePoint.startX = this.activeObj.activePoint.endX;
                    this.activeObj.activePoint.endX = temp;
                    this.dragElement = 'ne-resize';
                }
                if (this.activeObj.activePoint.startY > this.activeObj.activePoint.endY) {
                    const temp: number = this.activeObj.activePoint.startY;
                    this.activeObj.activePoint.startY = this.activeObj.activePoint.endY;
                    this.activeObj.activePoint.endY = temp;
                    this.dragElement = 'sw-resize';
                }
                this.preventDraggingInvertly();
            }
            else {
                if (this.activeObj.activePoint.startX < x && this.activeObj.activePoint.startY < y) {
                    width = x - this.activeObj.activePoint.startX; height = y - this.activeObj.activePoint.startY;
                    scale = Math.min(width, height);
                    const newScale: Point = this.getScaleRatio(scale);
                    this.activeObj.activePoint.startX += newScale.x; this.activeObj.activePoint.startY += newScale.y;
                    const left: number = this.destLeft > 0 ? this.destLeft : 0;
                    const top: number = this.destTop > 0 ? this.destTop : 0;
                    if (this.activeObj.activePoint.startX < left || this.activeObj.activePoint.startY < top) {
                        this.activeObj.activePoint.startX -= newScale.x; this.activeObj.activePoint.startY -= newScale.y;
                    }
                } else {
                    width = this.activeObj.activePoint.startX - x; height = y - this.activeObj.activePoint.endY;
                    scale = Math.max(width, height);
                    const newScale: Point = this.getScaleRatio(scale);
                    this.activeObj.activePoint.startX -= newScale.x; this.activeObj.activePoint.startY -= newScale.y;
                    const left: number = this.destLeft > 0 ? this.destLeft : 0;
                    const top: number = this.destTop > 0 ? this.destTop : 0;
                    if (this.activeObj.activePoint.startX < left || this.activeObj.activePoint.startY < top) {
                        this.activeObj.activePoint.startX += newScale.x; this.activeObj.activePoint.startY += newScale.y;
                    }
                }
            }
            this.activeObj.activePoint.width = this.activeObj.activePoint.endX - this.activeObj.activePoint.startX;
            this.activeObj.activePoint.height = this.activeObj.activePoint.endY - this.activeObj.activePoint.startY;
            this.preventInverseResize(tempActiveObj);
        }
    }

    private updateNPoints(x: number, y: number): void {
        let width: number; let height: number; let scale: number;
        if (this.activeObj.shape !== 'text') {
            let splitWords: string[];
            if (this.activeObj.shape !== undefined) {splitWords = this.activeObj.shape.split('-'); }
            if (this.activeObj.shape === 'crop-custom' || (this.activeObj.shape !== undefined && splitWords[0] !== 'crop')) {
                this.activeObj.activePoint.startY = y;
                this.activeObj.activePoint.height = this.activeObj.activePoint.endY - this.activeObj.activePoint.startY;
                if (this.activeObj.activePoint.startY > this.activeObj.activePoint.endY) {
                    const temp: number = this.activeObj.activePoint.startY;
                    this.activeObj.activePoint.startY = this.activeObj.activePoint.endY;
                    this.activeObj.activePoint.endY = temp;
                    this.dragElement = 's-resize';
                }
                this.preventDraggingInvertly();
            }
            else {
                if (this.activeObj.activePoint.endX > x && this.activeObj.activePoint.startY < y) {
                    width = this.activeObj.activePoint.endX - x; height = y - this.activeObj.activePoint.startY;
                    scale = Math.min(width, height);
                    const newScale: Point = this.getScaleRatio(scale);
                    this.activeObj.activePoint.endX -= newScale.x; this.activeObj.activePoint.startY += newScale.y;
                    if (this.activeObj.activePoint.endX > (this.destLeft + this.destWidth) ||
                        this.activeObj.activePoint.startY < this.destTop) {
                        this.activeObj.activePoint.endX += newScale.x; this.activeObj.activePoint.startY -= newScale.y;
                    }
                } else {
                    width = x - this.activeObj.activePoint.endX; height = this.activeObj.activePoint.startY - y;
                    scale = Math.max(width, height);
                    const newScale: Point = this.getScaleRatio(scale);
                    this.activeObj.activePoint.endX += newScale.x; this.activeObj.activePoint.startY -= newScale.y;
                    if (this.activeObj.activePoint.endX > (this.destLeft + this.destWidth) ||
                        this.activeObj.activePoint.startY < this.destTop) {
                        this.activeObj.activePoint.endX -= newScale.x; this.activeObj.activePoint.startY += newScale.y;
                    }
                }
                this.activeObj.activePoint.width = this.activeObj.activePoint.endX - this.activeObj.activePoint.startX;
                this.activeObj.activePoint.height = this.activeObj.activePoint.endY - this.activeObj.activePoint.startY;
            }
        }
    }

    private updateNEPoints(x: number, y: number, maxDimension: Dimension): void {
        let diff: number; let width: number; let height: number; let scale: number; let percentage: number;
        const prevDiffX: number = this.diffPoint.x; const prevDiffY: number = this.diffPoint.y;
        const tempActiveObj: SelectionPoint = extend({}, this.activeObj, null, true) as SelectionPoint;
        if (this.activeObj.shape === 'text') {
            if (this.oldPoint.x === undefined && this.oldPoint.y === undefined) {
                this.diffPoint.x = x - this.activeObj.activePoint.endX; this.diffPoint.y = this.activeObj.activePoint.startY - y;
            }
            else {this.diffPoint.x = x - this.oldPoint.x; this.diffPoint.y = this.oldPoint.y - y; }
            this.oldPoint.x = x; this.oldPoint.y = y;
            if (this.diffPoint.x <= prevDiffX && this.diffPoint.y >= prevDiffY) {
                diff = Math.min(this.diffPoint.x, this.diffPoint.y);
            }
            else {diff = Math.max(this.diffPoint.x, this.diffPoint.y); }
            percentage = (diff / 10);
            this.activeObj.activePoint.endX += (maxDimension.width / 100) * percentage;
            this.activeObj.activePoint.startY -= (maxDimension.height / 100) * percentage;
            this.activeObj.activePoint.width = this.activeObj.activePoint.endX - this.activeObj.activePoint.startX;
            this.activeObj.activePoint.height = this.activeObj.activePoint.endY - this.activeObj.activePoint.startY;
            this.updateFontSize(this.activeObj);
        } else {
            let splitWords: string[];
            if (this.activeObj.shape !== undefined) {splitWords = this.activeObj.shape.split('-'); }
            if (this.currObjType.isCustomCrop || (this.activeObj.shape !== undefined && splitWords[0] !== 'crop')) {
                this.activeObj.activePoint.endX = x; this.activeObj.activePoint.startY = y;
                if (this.activeObj.activePoint.endX < this.activeObj.activePoint.startX) {
                    const temp: number = this.activeObj.activePoint.endX;
                    this.activeObj.activePoint.endX = this.activeObj.activePoint.startX;
                    this.activeObj.activePoint.startX = temp;
                    this.dragElement = 'nw-resize';
                }
                if (this.activeObj.activePoint.startY > this.activeObj.activePoint.endY) {
                    const temp: number = this.activeObj.activePoint.startY;
                    this.activeObj.activePoint.startY = this.activeObj.activePoint.endY;
                    this.activeObj.activePoint.endY = temp;
                    this.dragElement = 'se-resize';
                }
                this.preventDraggingInvertly();
            }
            else {
                if (this.activeObj.activePoint.endX > x && this.activeObj.activePoint.startY < y) {
                    width = this.activeObj.activePoint.endX - x; height = y - this.activeObj.activePoint.startY;
                    scale = Math.min(width, height);
                    const newScale: Point = this.getScaleRatio(scale);
                    this.activeObj.activePoint.endX -= newScale.x; this.activeObj.activePoint.startY += newScale.y;
                    const endX: number = this.destLeft + this.destWidth < this.lowerCanvas.width ?
                        this.destLeft + this.destWidth : this.lowerCanvas.width;
                    const endY: number = this.destTop > 0 ? this.destTop : 0;
                    if (this.activeObj.activePoint.endX > endX || this.activeObj.activePoint.startY < endY) {
                        this.activeObj.activePoint.endX += newScale.x; this.activeObj.activePoint.startY -= newScale.y;
                    }
                } else {
                    width = x - this.activeObj.activePoint.endX; height = this.activeObj.activePoint.startY - y;
                    scale = Math.max(width, height);
                    const newScale: Point = this.getScaleRatio(scale);
                    this.activeObj.activePoint.endX += newScale.x; this.activeObj.activePoint.startY -= newScale.y;
                    const endX: number = this.destLeft + this.destWidth < this.lowerCanvas.width ?
                        this.destLeft + this.destWidth : this.lowerCanvas.width;
                    const endY: number = this.destTop > 0 ? this.destTop : 0;
                    if (this.activeObj.activePoint.endX > endX || this.activeObj.activePoint.startY < endY) {
                        this.activeObj.activePoint.endX -= newScale.x; this.activeObj.activePoint.startY += newScale.y;
                    }
                }
            }
            this.activeObj.activePoint.width = this.activeObj.activePoint.endX - this.activeObj.activePoint.startX;
            this.activeObj.activePoint.height = this.activeObj.activePoint.endY - this.activeObj.activePoint.startY;
            this.preventInverseResize(tempActiveObj);
        }
    }

    private updateWPoints(x: number, y: number): void {
        let width: number; let height: number; let scale: number;
        if (this.activeObj.shape !== 'text') {
            let splitWords: string[];
            if (this.activeObj.shape !== undefined) {splitWords = this.activeObj.shape.split('-'); }
            if (this.activeObj.shape === 'crop-custom' || (this.activeObj.shape !== undefined && splitWords[0] !== 'crop')) {
                this.activeObj.activePoint.startX = x;
                this.activeObj.activePoint.width = this.activeObj.activePoint.endX - this.activeObj.activePoint.startX;
                if (this.activeObj.activePoint.startX > this.activeObj.activePoint.endX) {
                    const temp: number = this.activeObj.activePoint.startX;
                    this.activeObj.activePoint.startX = this.activeObj.activePoint.endX;
                    this.activeObj.activePoint.endX = temp;
                    this.dragElement = 'e-resize';
                }
                this.preventDraggingInvertly();
            }
            else {
                if (this.activeObj.activePoint.startX < x && this.activeObj.activePoint.endY > y) {
                    width = x - this.activeObj.activePoint.startX; height = this.activeObj.activePoint.endY - y;
                    scale = Math.min(width, height);
                    const newScale: Point = this.getScaleRatio(scale);
                    this.activeObj.activePoint.startX += newScale.x; this.activeObj.activePoint.endY -= newScale.y;
                    if (this.activeObj.activePoint.startX < this.destLeft || this.activeObj.activePoint.endY >
                        (this.destTop + this.destHeight)) {
                        this.activeObj.activePoint.startX -= newScale.x; this.activeObj.activePoint.endY += newScale.y;
                    }
                } else {
                    width = this.activeObj.activePoint.startX - x; height = y - this.activeObj.activePoint.endY;
                    scale = Math.max(width, height);
                    const newScale: Point = this.getScaleRatio(scale);
                    this.activeObj.activePoint.startX -= newScale.x; this.activeObj.activePoint.endY += newScale.y;
                    if (this.activeObj.activePoint.startX < this.destLeft || this.activeObj.activePoint.endY >
                        (this.destTop + this.destHeight)) {
                        this.activeObj.activePoint.startX += newScale.x; this.activeObj.activePoint.endY -= newScale.y;
                    }
                }
                this.activeObj.activePoint.width = this.activeObj.activePoint.endX - this.activeObj.activePoint.startX;
                this.activeObj.activePoint.height = this.activeObj.activePoint.endY - this.activeObj.activePoint.startY;
            }
        }
    }

    private updateEPoints(x: number, y: number): void {
        let width: number; let height: number; let scale: number;
        if (this.activeObj.shape !== 'text') {
            let splitWords: string[];
            if (this.activeObj.shape !== undefined) {splitWords = this.activeObj.shape.split('-'); }
            if (this.activeObj.shape === 'crop-custom' || (this.activeObj.shape !== undefined && splitWords[0] !== 'crop')) {
                this.activeObj.activePoint.endX = x;
                this.activeObj.activePoint.width = this.activeObj.activePoint.endX - this.activeObj.activePoint.startX;
                if (this.activeObj.activePoint.endX < this.activeObj.activePoint.startX) {
                    const temp: number = this.activeObj.activePoint.endX;
                    this.activeObj.activePoint.endX = this.activeObj.activePoint.startX;
                    this.activeObj.activePoint.startX = temp;
                    this.dragElement = 'w-resize';
                }
                this.preventDraggingInvertly();
            }
            else {
                if (this.activeObj.activePoint.endX > x && this.activeObj.activePoint.endY > y) {
                    width = this.activeObj.activePoint.endX - x; height = this.activeObj.activePoint.endY - y;
                    scale = Math.min(width, height);
                    const newScale: Point = this.getScaleRatio(scale);
                    this.activeObj.activePoint.endX -= newScale.x; this.activeObj.activePoint.endY -= newScale.y;
                    if (this.activeObj.activePoint.endX > (this.destLeft + this.destWidth) ||
                        this.activeObj.activePoint.endY > (this.destTop + this.destHeight)) {
                        this.activeObj.activePoint.endX += newScale.x; this.activeObj.activePoint.endY += newScale.y;
                    }
                } else {
                    width = x - this.activeObj.activePoint.endX; height = y - this.activeObj.activePoint.endY;
                    scale = Math.max(width, height);
                    const newScale: Point = this.getScaleRatio(scale);
                    this.activeObj.activePoint.endX += newScale.x; this.activeObj.activePoint.endY += newScale.y;
                    if (this.activeObj.activePoint.endX > (this.destLeft + this.destWidth) || this.activeObj.activePoint.endY >
                        (this.destTop + this.destHeight)) {
                        this.activeObj.activePoint.endX -= newScale.x; this.activeObj.activePoint.endY -= newScale.y;
                    }
                }
                this.activeObj.activePoint.width = this.activeObj.activePoint.endX - this.activeObj.activePoint.startX;
                this.activeObj.activePoint.height = this.activeObj.activePoint.endY - this.activeObj.activePoint.startY;
            }
        }
    }

    private updateSWPoints(x: number, y: number, maxDimension: Dimension): void {
        let diff: number; let width: number; let height: number; let scale: number; let percentage: number;
        const prevDiffX: number = this.diffPoint.x; const prevDiffY: number = this.diffPoint.y;
        const tempActiveObj: SelectionPoint = extend({}, this.activeObj, null, true) as SelectionPoint;
        if (this.activeObj.shape === 'text') {
            if (this.oldPoint.x === undefined && this.oldPoint.y === undefined) {
                this.diffPoint.x = this.activeObj.activePoint.startX - x; this.diffPoint.y = y - this.activeObj.activePoint.endY;
            }
            else {this.diffPoint.x = this.oldPoint.x - x; this.diffPoint.y = y - this.oldPoint.y; }
            this.oldPoint.x = x; this.oldPoint.y = y;
            if (this.diffPoint.x <= prevDiffX && this.diffPoint.y >= prevDiffY) {
                diff = Math.min(this.diffPoint.x, this.diffPoint.y);
            }
            else {diff = Math.max(this.diffPoint.x, this.diffPoint.y); }
            percentage = (diff / 10);
            this.activeObj.activePoint.startX -= (maxDimension.width / 100) * percentage;
            this.activeObj.activePoint.endY += (maxDimension.height / 100) * percentage;
            this.activeObj.activePoint.width = this.activeObj.activePoint.endX - this.activeObj.activePoint.startX;
            this.activeObj.activePoint.height = this.activeObj.activePoint.endY - this.activeObj.activePoint.startY;
            this.updateFontSize(this.activeObj);
        } else {
            let splitWords: string[];
            if (this.activeObj.shape !== undefined) {splitWords = this.activeObj.shape.split('-'); }
            if (this.activeObj.shape === 'crop-custom' || (this.activeObj.shape !== undefined && splitWords[0] !== 'crop')) {
                this.activeObj.activePoint.startX = x; this.activeObj.activePoint.endY = y;
                if (this.activeObj.activePoint.startX > this.activeObj.activePoint.endX) {
                    const temp: number = this.activeObj.activePoint.startX;
                    this.activeObj.activePoint.startX = this.activeObj.activePoint.endX;
                    this.activeObj.activePoint.endX = temp;
                    this.dragElement = 'se-resize';
                }
                if (this.activeObj.activePoint.endY < this.activeObj.activePoint.startY) {
                    const temp: number = this.activeObj.activePoint.endY;
                    this.activeObj.activePoint.endY = this.activeObj.activePoint.startY;
                    this.activeObj.activePoint.startY = temp;
                    this.dragElement = 'nw-resize';
                }
                this.preventDraggingInvertly();
            }
            else {
                if (this.activeObj.activePoint.startX < x && this.activeObj.activePoint.endY > y) {
                    width = x - this.activeObj.activePoint.startX; height = this.activeObj.activePoint.endY - y;
                    scale = Math.min(width, height);
                    const newScale: Point = this.getScaleRatio(scale);
                    this.activeObj.activePoint.startX += newScale.x; this.activeObj.activePoint.endY -= newScale.y;
                    const endX: number = this.destLeft > 0 ? this.destLeft : 0;
                    const endY: number = this.destTop + this.destHeight < this.lowerCanvas.height ? this.destTop +
                                         this.destHeight : this.lowerCanvas.height;
                    if (this.activeObj.activePoint.startX < endX || this.activeObj.activePoint.endY > endY) {
                        this.activeObj.activePoint.startX -= newScale.x; this.activeObj.activePoint.endY += newScale.y;
                    }
                } else {
                    width = this.activeObj.activePoint.startX - x; height = y - this.activeObj.activePoint.endY;
                    scale = Math.max(width, height);
                    const newScale: Point = this.getScaleRatio(scale);
                    this.activeObj.activePoint.startX -= newScale.x; this.activeObj.activePoint.endY += newScale.y;
                    const endX: number = this.destLeft > 0 ? this.destLeft : 0;
                    const endY: number = this.destTop + this.destHeight < this.lowerCanvas.height ? this.destTop +
                                         this.destHeight : this.lowerCanvas.height;
                    if (this.activeObj.activePoint.startX < endX || this.activeObj.activePoint.endY > endY) {
                        this.activeObj.activePoint.startX += newScale.x; this.activeObj.activePoint.endY -= newScale.y;
                    }
                }
            }
            this.activeObj.activePoint.width = this.activeObj.activePoint.endX - this.activeObj.activePoint.startX;
            this.activeObj.activePoint.height = this.activeObj.activePoint.endY - this.activeObj.activePoint.startY;
            this.preventInverseResize(tempActiveObj);
        }
    }

    private updateSPoints(x: number, y: number): void {
        let width: number; let height: number; let scale: number;
        if (this.activeObj.shape !== 'text') {
            let splitWords: string[];
            if (this.activeObj.shape !== undefined) {splitWords = this.activeObj.shape.split('-'); }
            if (this.activeObj.shape === 'crop-custom' || (this.activeObj.shape !== undefined && splitWords[0] !== 'crop')) {
                this.activeObj.activePoint.endY = y;
                this.activeObj.activePoint.height = this.activeObj.activePoint.endY - this.activeObj.activePoint.startY;
                if (this.activeObj.activePoint.endY < this.activeObj.activePoint.startY) {
                    const temp: number = this.activeObj.activePoint.endY;
                    this.activeObj.activePoint.endY = this.activeObj.activePoint.startY;
                    this.activeObj.activePoint.startY = temp;
                    this.dragElement = 'n-resize';
                }
                this.preventDraggingInvertly();
            }
            else {
                if (this.activeObj.activePoint.endX > x && this.activeObj.activePoint.endY > y) {
                    width = this.activeObj.activePoint.endX - x;
                    height = this.activeObj.activePoint.endY - y;
                    scale = Math.min(width, height);
                    const newScale: Point = this.getScaleRatio(scale);
                    this.activeObj.activePoint.endX -= newScale.x; this.activeObj.activePoint.endY -= newScale.y;
                    if (this.activeObj.activePoint.endX > (this.destLeft + this.destWidth) ||
                        this.activeObj.activePoint.endY > (this.destTop + this.destHeight)) {
                        this.activeObj.activePoint.endX += newScale.x; this.activeObj.activePoint.endY += newScale.y;
                    }
                } else {
                    width = x - this.activeObj.activePoint.endX; height = y - this.activeObj.activePoint.endY;
                    scale = Math.max(width, height);
                    const newScale: Point = this.getScaleRatio(scale);
                    this.activeObj.activePoint.endX += newScale.x; this.activeObj.activePoint.endY += newScale.x;
                    if (this.activeObj.activePoint.endX > (this.destLeft + this.destWidth) ||
                        this.activeObj.activePoint.endY > (this.destTop + this.destHeight)) {
                        this.activeObj.activePoint.endX -= newScale.x; this.activeObj.activePoint.endY -= newScale.y;
                    }
                }
                this.activeObj.activePoint.width = this.activeObj.activePoint.endX - this.activeObj.activePoint.startX;
                this.activeObj.activePoint.height = this.activeObj.activePoint.endY - this.activeObj.activePoint.startY;
            }
        }
    }

    private updateSEPoints(x: number, y: number, maxDimension: Dimension): void {
        let diff: number; let width: number; let height: number; let scale: number; let percentage: number;
        const prevDiffX: number = this.diffPoint.x; const prevDiffY: number = this.diffPoint.y;
        const tempActiveObj: SelectionPoint = extend({}, this.activeObj, null, true) as SelectionPoint;
        if (this.activeObj.shape === 'text') {
            if (this.oldPoint.x === undefined && this.oldPoint.y === undefined) {
                this.diffPoint.x = x - this.activeObj.activePoint.endX;
                this.diffPoint.y = y - this.activeObj.activePoint.endY;
            } else {
                this.diffPoint.x = x - this.oldPoint.x;
                this.diffPoint.y = y - this.oldPoint.y;
            }
            this.oldPoint.x = x; this.oldPoint.y = y;
            if (this.diffPoint.x >= prevDiffX && this.diffPoint.y >= prevDiffY) {
                diff = Math.max(this.diffPoint.x, this.diffPoint.y);
            }
            else {diff = Math.min(this.diffPoint.x, this.diffPoint.y); }
            percentage = (diff / 10);
            this.activeObj.activePoint.endX += (maxDimension.width / 50) * percentage;
            this.activeObj.activePoint.endY += (maxDimension.height / 50) * percentage;
            this.activeObj.activePoint.width = this.activeObj.activePoint.endX - this.activeObj.activePoint.startX;
            this.activeObj.activePoint.height = this.activeObj.activePoint.endY - this.activeObj.activePoint.startY;
            this.updateFontSize(this.activeObj);
        } else {
            let splitWords: string[];
            if (this.activeObj.shape !== undefined) {splitWords = this.activeObj.shape.split('-'); }
            if (this.activeObj.shape === 'crop-custom' || (this.activeObj.shape !== undefined && splitWords[0] !== 'crop')) {
                this.activeObj.activePoint.endX = x; this.activeObj.activePoint.endY = y;
                if (this.activeObj.activePoint.endX < this.activeObj.activePoint.startX) {
                    const temp: number = this.activeObj.activePoint.endX;
                    this.activeObj.activePoint.endX = this.activeObj.activePoint.startX;
                    this.activeObj.activePoint.startX = temp;
                    this.dragElement = 'sw-resize';
                }
                if (this.activeObj.activePoint.endY < this.activeObj.activePoint.startY) {
                    const temp: number = this.activeObj.activePoint.endY;
                    this.activeObj.activePoint.endY = this.activeObj.activePoint.startY;
                    this.activeObj.activePoint.startY = temp;
                    this.dragElement = 'ne-resize';
                }
                this.preventDraggingInvertly();
            }
            else {
                if (this.activeObj.activePoint.endX > x && this.activeObj.activePoint.endY > y) {
                    width = this.activeObj.activePoint.endX - x; height = this.activeObj.activePoint.endY - y;
                    scale = Math.min(width, height);
                    const newScale: Point = this.getScaleRatio(scale);
                    this.activeObj.activePoint.endX -= newScale.x; this.activeObj.activePoint.endY -= newScale.y;
                    const endX: number = this.destLeft + this.destWidth < this.lowerCanvas.width ?
                        this.destLeft + this.destWidth : this.lowerCanvas.width;
                    const endY: number = this.destTop + this.destHeight < this.lowerCanvas.height ?
                        this.destTop + this.destHeight : this.lowerCanvas.height;
                    if (this.activeObj.activePoint.endX > endX || this.activeObj.activePoint.endY > endY) {
                        this.activeObj.activePoint.endX += newScale.x; this.activeObj.activePoint.endY += newScale.y;
                    }
                } else {
                    width = x - this.activeObj.activePoint.endX; height = y - this.activeObj.activePoint.endY;
                    scale = Math.max(width, height);
                    const newScale: Point = this.getScaleRatio(scale);
                    this.activeObj.activePoint.endX += newScale.x; this.activeObj.activePoint.endY += newScale.y;
                    const endX: number = this.destLeft + this.destWidth < this.lowerCanvas.width ? this.destLeft +
                                         this.destWidth : this.lowerCanvas.width;
                    const endY: number = this.destTop + this.destHeight < this.lowerCanvas.height ? this.destTop +
                                         this.destHeight : this.lowerCanvas.height;
                    if (this.activeObj.activePoint.endX > endX || this.activeObj.activePoint.endY > endY) {
                        this.activeObj.activePoint.endX -= newScale.x; this.activeObj.activePoint.endY -= newScale.y;
                    }
                }
            }
            this.activeObj.activePoint.width = this.activeObj.activePoint.endX - this.activeObj.activePoint.startX;
            this.activeObj.activePoint.height = this.activeObj.activePoint.endY - this.activeObj.activePoint.startY;
            this.preventInverseResize(tempActiveObj);
        }
    }

    private updateFontRatio(obj: SelectionPoint, isTextArea?: boolean): void {
        let degree: number;
        if (obj.shapeDegree === 0) {degree = this.degree; }
        else {degree =  this.degree - obj.shapeDegree; }
        if (isNullOrUndefined(isTextArea)) {
            if (degree === 0 || degree === 180) {
                obj.textSettings.fontRatio = obj.activePoint.width / obj.textSettings.fontSize;
            } else {
                obj.textSettings.fontRatio = obj.activePoint.height / obj.textSettings.fontSize;
            }
        } else if (isTextArea) {
            if (degree === 0 || degree === 180) {
                obj.textSettings.fontRatio = this.textArea.clientWidth / parseFloat(this.textArea.style.fontSize);
            } else {
                obj.textSettings.fontRatio = this.textArea.clientHeight / parseFloat(this.textArea.style.fontSize);
            }
        }
    }

    private updateFontSize(obj: SelectionPoint): void {
        let degree: number;
        if (obj.shapeDegree === 0) {degree = this.degree; }
        else {degree =  this.degree - obj.shapeDegree; }
        if (degree === 0 || degree === 180) {
            obj.textSettings.fontSize = (obj.activePoint.width / obj.textSettings.fontRatio);
        } else {
            obj.textSettings.fontSize = (obj.activePoint.height / obj.textSettings.fontRatio);
        }
    }

    private preventInverseResize(tempActiveObj: SelectionPoint): void {
        if (this.activeObj.activePoint.width < 0) {
            this.activeObj.activePoint.width = 0;
            this.activeObj.activePoint.startX = tempActiveObj.activePoint.startX;
            this.activeObj.activePoint.endX = tempActiveObj.activePoint.endX;
        }
        if (this.activeObj.activePoint.height < 0) {
            this.activeObj.activePoint.height = 0;
            this.activeObj.activePoint.startY = tempActiveObj.activePoint.startY;
            this.activeObj.activePoint.endY = tempActiveObj.activePoint.endY;
        }
    }

    private getScaleRatio(scale: number): Point {
        const point: Point = {x: scale, y: scale};
        if (this.activeObj.shape !== 'crop-custom' && this.activeObj.shape !== 'crop-circle' && this.activeObj.shape !== 'crop-square') {
            let ratio: string[] = this.activeObj.shape.split('-');
            ratio = ratio[1].split(':');
            const newScale: number = scale / (parseInt(ratio[1], 10));
            point.x = newScale * (parseInt(ratio[0], 10));
            point.y = newScale * (parseInt(ratio[1], 10));
        }
        return point;
    }

    private getMaxText(isTextBox?: boolean, text?: string): string {
        if (isNullOrUndefined(text)) {
            text = isTextBox ? this.textArea.value : this.activeObj.keyHistory;
        }
        let maxi: number; const rows: string[] = text.split('\n');
        let maxStr: number = rows[0].length;
        let maxText: string = rows[0];
        for (let i: number = 1; i < rows.length; i++) {
            maxi = rows[i as number].length;
            if (maxi > maxStr) {
                maxText = rows[i as number];
                maxStr = maxi;
            }
        }
        return maxText;
    }

    private setDragLimit(): void {
        if (this.activeObj.activePoint) {
            if (this.activeObj.activePoint.startX < this.destLeft) {
                this.activeObj.activePoint.startX = this.destLeft;
                this.activeObj.activePoint.endX = this.activeObj.activePoint.startX + this.activeObj.activePoint.width;
            }
            else if (this.activeObj.activePoint.endX > this.destLeft + this.destWidth) {
                this.activeObj.activePoint.endX = this.destLeft + this.destWidth;
                this.activeObj.activePoint.startX = this.activeObj.activePoint.endX - this.activeObj.activePoint.width;
            }
            if (this.activeObj.activePoint.startY < this.destTop) {
                this.activeObj.activePoint.startY = this.destTop;
            }
            else if (this.activeObj.activePoint.endY > this.destTop + this.destHeight) {
                this.activeObj.activePoint.endY = this.destTop + this.destHeight;
                this.activeObj.activePoint.startY = this.activeObj.activePoint.endY - this.activeObj.activePoint.height;
            }
            this.activeObj.activePoint.width = this.activeObj.activePoint.endX - this.activeObj.activePoint.startX;
            this.activeObj.activePoint.height = this.activeObj.activePoint.endY - this.activeObj.activePoint.startY;
        }
    }

    private lineDraw(): void {
        if (this.activeObj.activePoint.height < 10) {
            this.activeObj.activePoint.startY -= 10;
            this.activeObj.activePoint.endY += 10;
            this.activeObj.lineDraw = 'horizontal';
        } else if (this.activeObj.activePoint.width < 10) {
            this.activeObj.activePoint.startX -= 10;
            this.activeObj.activePoint.endX += 10;
            this.activeObj.lineDraw = 'vertical';
        }  else if (this.currObjType.isInitialLine) {
            this.activeObj.lineDraw = 'normal';
            this.currObjType.isInitialLine = false;
        }
        this.activeObj.activePoint.width = this.activeObj.activePoint.endX - this.activeObj.activePoint.startX;
        this.activeObj.activePoint.height = this.activeObj.activePoint.endY - this.activeObj.activePoint.startY;
    }

    private shapeCircle(canvasDraw: CanvasRenderingContext2D, selectionWidth: number, selectionHeight: number): void {
        canvasDraw.strokeStyle = this.themeColl[this.theme]['primaryColor'];
        canvasDraw.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
        canvasDraw.fillStyle = 'rgb(0, 0, 0, 0.5)';
        canvasDraw.fillRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
        const tempWidth: number = canvasDraw.lineWidth;
        canvasDraw.lineWidth = (2);
        canvasDraw.beginPath();
        canvasDraw.ellipse(this.activeObj.horTopLine.startX + (selectionWidth / 2), this.activeObj.horTopLine.startY
                + (selectionHeight / 2), selectionWidth / 2, selectionHeight / 2, 0, 0, 2 * Math.PI, false);
        canvasDraw.stroke();
        canvasDraw.closePath();
        canvasDraw.save();
        canvasDraw.beginPath();
        canvasDraw.arc(((this.activeObj.activePoint.endX - this.activeObj.activePoint.startX) / 2) + this.activeObj.activePoint.startX,
                       ((this.activeObj.activePoint.endY - this.activeObj.activePoint.startY) / 2) + this.activeObj.activePoint.startY,
                       (this.activeObj.activePoint.width / 2),
                       0, Math.PI * 2);
        canvasDraw.closePath();
        canvasDraw.clip();
        canvasDraw.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
        canvasDraw.restore();
        canvasDraw.lineWidth = tempWidth;
        this.drawOuterSelection(canvasDraw, true);
        this.currObjType.shape = '';
    }

    private drawOuterSelection(canvasDraw: CanvasRenderingContext2D, isCropCircle?: boolean): void {
        let splitWords: string[];
        canvasDraw.lineWidth = (0.5);
        if (this.activeObj.shape !== undefined) {
            splitWords  = this.activeObj.shape.split('-');
        }
        const tempObj: SelectionPoint = extend({}, this.activeObj, {}, true) as SelectionPoint;
        if (this.activeObj.shape !== undefined) {
            splitWords  = this.activeObj.shape.split('-');
        }
        if (((splitWords !== undefined && splitWords[0] === 'crop') || this.activeObj.shape === undefined) && !isCropCircle) {
            this.upperContext.fillStyle = 'rgb(0, 0, 0, 0.5)';
            this.upperContext.fillRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
            this.upperContext.clearRect(this.activeObj.activePoint.startX, this.activeObj.activePoint.startY,
                                        this.activeObj.activePoint.width, this.activeObj.activePoint.height);
        }
        canvasDraw.strokeStyle = this.themeColl[this.theme]['primaryColor'];
        canvasDraw.fillStyle = this.themeColl[this.theme]['secondaryColor'];
        if (this.activeObj.shape !== 'rectangle') {
            canvasDraw.beginPath();
            canvasDraw.rect(tempObj.activePoint.startX, tempObj.activePoint.startY, tempObj.activePoint.width, tempObj.activePoint.height);
            canvasDraw.stroke();
            canvasDraw.closePath();
        }
        canvasDraw.lineWidth *= 2;
        canvasDraw.beginPath();
        canvasDraw.moveTo(tempObj.topLeftCircle.startX, tempObj.topLeftCircle.startY);
        canvasDraw.arc(tempObj.topLeftCircle.startX, tempObj.topLeftCircle.startY,
                       tempObj.topLeftCircle.radius, 0, 2 * Math.PI);
        canvasDraw.moveTo(tempObj.topRightCircle.startX, tempObj.topRightCircle.startY);
        canvasDraw.arc(tempObj.topRightCircle.startX, tempObj.topRightCircle.startY,
                       tempObj.topRightCircle.radius, 0, 2 * Math.PI);
        canvasDraw.moveTo(tempObj.bottomLeftCircle.startX, tempObj.bottomLeftCircle.startY);
        canvasDraw.arc(tempObj.bottomLeftCircle.startX, tempObj.bottomLeftCircle.startY,
                       tempObj.bottomLeftCircle.radius, 0, 2 * Math.PI);
        canvasDraw.moveTo(tempObj.bottomRightCircle.startX, tempObj.bottomRightCircle.startY);
        canvasDraw.arc(tempObj.bottomRightCircle.startX, tempObj.bottomRightCircle.startY,
                       tempObj.bottomRightCircle.radius, 0, 2 * Math.PI);
        canvasDraw.stroke(); canvasDraw.fill(); canvasDraw.closePath();
        canvasDraw.lineWidth /= 2;
        if ((splitWords === undefined || splitWords[0] !== 'crop') && this.activeObj.shape !== 'text') {
            this.drawCenterCircles(canvasDraw);
        }
        this.activeObj = extend({}, tempObj, {}, true) as SelectionPoint;
    }

    private drawObject(canvas: string, obj?: SelectionPoint, isCropRatio?: boolean, points?: ActivePoint,
                       isPreventDrag?: boolean, saveContext?: CanvasRenderingContext2D): void {
        let canvasDraw: CanvasRenderingContext2D;
        if (canvas.toLowerCase() === 'original') {
            canvasDraw = this.lowerContext;
        } else if (canvas.toLowerCase() === 'duplicate') {
            canvasDraw = this.upperContext;
        } else if (!isNullOrUndefined(saveContext)) {
            canvasDraw = saveContext;
        }
        if (!isPreventDrag && !isNullOrUndefined(this.activeObj.shape)) {this.setDragLimit(); }
        if (this.currObjType.isLine && canvas !== 'original' && !obj) {
            this.lineDraw();
        }
        const splitWords: string[] = this.currObjType.shape.split('-');
        if (splitWords[0].toLowerCase() === 'crop' && isCropRatio) {
            this.drawCropRatio();
        }
        if (points) {
            this.activeObj.activePoint.startX = points.startX; this.activeObj.activePoint.startY = points.startY;
            this.activeObj.activePoint.endX = points.endX; this.activeObj.activePoint.endY = points.endY;
            this.activeObj.activePoint.width = points.width; this.activeObj.activePoint.height = points.height;
        }
        if (isNullOrUndefined(this.activeObj.strokeSettings)) {
            this.activeObj.strokeSettings = this.strokeSettings;
        }
        if (isNullOrUndefined(this.activeObj.strokeSettings.strokeWidth)) {
            this.activeObj.strokeSettings.strokeWidth = 4;
        }
        if (obj) {
            this.activeObj = extend({}, obj, {}, true) as SelectionPoint;
        }
        this.updateActiveObject();
        if (this.currObjType.isText) {
            this.activeObj.keyHistory = this.keyHistory;
        }
        if (canvas.toLowerCase() !== 'original') {
            let splitWords: string[]; let isCrop: boolean = false;
            if (this.activeObj.shape) {
                splitWords = this.activeObj.shape.split('-');
                if (splitWords[0] === 'crop') {isCrop = true; }
            }
            if (isCrop) {
                this.upperContext.fillStyle = 'rgb(0, 0, 0, 0.5)';
                this.upperContext.fillRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
                this.upperContext.clearRect(this.activeObj.activePoint.startX,
                                            this.activeObj.activePoint.startY,
                                            this.activeObj.activePoint.width,
                                            this.activeObj.activePoint.height);
            }
            if (canvasDraw === this.lowerContext || canvasDraw === this.upperContext) {
                this.drawOuterSelection(canvasDraw);
            }
        }
        this.currObjType.isActiveObj = true;
        if (obj) {this.drawShapeObj(canvas, obj.shape, saveContext); }
        else if (this.keyHistory !== '' && this.currObjType.isText) {this.drawShapeObj(canvas, 'text', saveContext); }
        else if (this.activeObj.shape) {this.drawShapeObj(canvas, this.activeObj.shape, saveContext); }
        else {this.drawShapeObj(canvas, undefined, saveContext); }
        if (this.isAllowCropPan) {
            this.isAllowCropPan = false;
            this.tempPanMove = extend({}, this.panMove, {}, true) as Point;
            this.currentPannedPoint  = this.updatePanPoints(this.getCurrentPanRegion());
            this.rotatePan();
        }
    }

    private rotateShape(canvasDraw: CanvasRenderingContext2D): void {
        canvasDraw.beginPath();
        canvasDraw.moveTo(this.activeObj.horTopLine.startX, this.activeObj.horTopLine.startY);
        canvasDraw.lineTo(this.activeObj.horTopLine.endX, this.activeObj.horTopLine.endY);
        canvasDraw.moveTo(this.activeObj.horBottomLine.startX, this.activeObj.horBottomLine.startY);
        canvasDraw.lineTo(this.activeObj.horBottomLine.endX, this.activeObj.horBottomLine.endY);
        canvasDraw.moveTo(this.activeObj.verLeftLine.startX, this.activeObj.verLeftLine.startY);
        canvasDraw.lineTo(this.activeObj.verLeftLine.endX, this.activeObj.verLeftLine.endY);
        canvasDraw.moveTo(this.activeObj.verRightLine.startX, this.activeObj.verRightLine.startY);
        canvasDraw.lineTo(this.activeObj.verRightLine.endX, this.activeObj.verRightLine.endY);
        canvasDraw.stroke();
    }

    private updateActiveObject(actPoint?: ActivePoint, obj?: SelectionPoint, isMouseMove?: boolean, x?: number, y?: number): void {
        actPoint = actPoint ? actPoint : extend({}, this.activeObj.activePoint, {}, true) as ActivePoint;
        obj = obj ? obj : extend({}, this.activeObj, {}, true) as SelectionPoint;
        actPoint.width = actPoint.endX - actPoint.startX;
        actPoint.height = actPoint.endY - actPoint.startY;
        x = x ? x : 0; y = y ? y : 0;
        const horCircleWidth: number = actPoint.width / 2; const verCircleHeight: number = actPoint.height / 2;
        const radius: number = 7.5;
        obj.horTopLine = {startX : actPoint.startX + x, startY: actPoint.startY - y,
            endX: actPoint.endX + x, endY: actPoint.endY + y};
        obj.horBottomLine = {startX : actPoint.startX - x, startY: actPoint.endY - y,
            endX: actPoint.endX - x, endY: actPoint.endY + y};
        obj.verLeftLine = {startX : actPoint.startX + x, startY: actPoint.startY - y,
            endX: actPoint.startX - y, endY: actPoint.endY - y};
        obj.verRightLine = {startX : actPoint.endX + x, startY: actPoint.startY + y,
            endX: actPoint.endX - x, endY: actPoint.endY + y};
        obj.topLeftCircle = {startX : actPoint.startX, startY: actPoint.startY,
            radius: obj.horTopLine.endX ? (radius) : 0};
        obj.topCenterCircle = {startX : actPoint.startX + horCircleWidth, startY: actPoint.startY,
            radius: obj.horTopLine.endX ? (radius) : 0};
        obj.topRightCircle = {startX : actPoint.endX, startY: actPoint.startY,
            radius: obj.horTopLine.endX ? (radius) : 0};
        obj.centerLeftCircle = {startX : actPoint.startX, startY: actPoint.startY + verCircleHeight,
            radius: obj.horTopLine.endX ? (radius) : 0};
        obj.centerRightCircle = {startX : actPoint.endX, startY: actPoint.startY + verCircleHeight,
            radius: obj.horTopLine.endX ? (radius) : 0};
        obj.bottomLeftCircle = {startX : actPoint.startX, startY: actPoint.endY,
            radius: obj.horTopLine.endX ? (radius) : 0};
        obj.bottomCenterCircle = {startX : actPoint.startX + horCircleWidth, startY: actPoint.endY,
            radius: obj.horTopLine.endX ? (radius) : 0};
        obj.bottomRightCircle = {startX : actPoint.endX, startY: actPoint.endY,
            radius: obj.horTopLine.endX ? (radius) : 0};
        obj.activePoint = actPoint;
        if (isNullOrUndefined(isMouseMove)) {
            this.activeObj = extend({}, obj, {}, true) as SelectionPoint;
        }
    }

    private drawShapeObj(canvas: string, shape?: string, saveContext?: CanvasRenderingContext2D): void {
        const currentShape: string = shape !== undefined ? shape : this.currObjType.shape;
        this.currObjType.shape = currentShape; let canvasDraw: CanvasRenderingContext2D;
        if (canvas.toLowerCase() === 'original') {
            canvasDraw = this.lowerContext;
        } else if (canvas.toLowerCase() === 'duplicate') {
            canvasDraw = this.upperContext;
        } else if (!isNullOrUndefined(saveContext)) {
            canvasDraw = saveContext;
        }
        if (this.currObjType.shape.toLowerCase() === 'rectangle' || this.currObjType.shape.toLowerCase() === 'ellipse'
         || this.currObjType.shape.toLowerCase() === 'line') {
            this.activeObj.shape = this.currObjType.shape;
        }
        canvasDraw.strokeStyle = this.activeObj.strokeSettings.strokeColor;
        if (shape === 'text' || shape === 'freehanddraw') {
            canvasDraw.fillStyle = this.activeObj.strokeSettings.strokeColor;
        } else {
            canvasDraw.fillStyle = this.activeObj.strokeSettings.fillColor;
        }
        const horLineWidth: number = this.activeObj.activePoint.width / 3;
        const verLineHeight: number = this.activeObj.activePoint.height / 3;
        let selectionWidth: number = this.activeObj.activePoint.endX - this.activeObj.activePoint.startX;
        let selectionHeight: number = this.activeObj.activePoint.endY - this.activeObj.activePoint.startY;
        switch (this.currObjType.shape.toLowerCase()) {
        case 'rectangle':
            this.drawSquareLines(canvasDraw);
            if (canvasDraw === this.upperContext) {
                this.drawOuterSelection(canvasDraw);
            }
            break;
        case 'ellipse':
            selectionWidth = Math.abs(selectionWidth); selectionHeight = Math.abs(selectionHeight);
            canvasDraw.beginPath();
            canvasDraw.ellipse(this.activeObj.activePoint.startX + (selectionWidth / 2),
                               this.activeObj.activePoint.startY + (selectionHeight / 2),
                               selectionWidth / 2,  selectionHeight / 2, 0, 0, 2 * Math.PI, false);
            if (this.activeObj.strokeSettings.fillColor !== '') {
                canvasDraw.fillStyle = this.activeObj.strokeSettings.fillColor;
                canvasDraw.fill();
            }
            canvasDraw.ellipse(this.activeObj.activePoint.startX + (selectionWidth / 2),
                               this.activeObj.activePoint.startY + (selectionHeight / 2),
                               Math.abs((selectionWidth / 2) - (this.activeObj.strokeSettings.strokeWidth)),
                               Math.abs((selectionHeight / 2) - (this.activeObj.strokeSettings.strokeWidth)),
                               0, 0, 2 * Math.PI, false);
            canvasDraw.fillStyle = this.activeObj.strokeSettings.strokeColor;
            canvasDraw.fill('evenodd');
            canvasDraw.closePath();
            if (canvasDraw === this.upperContext) {
                this.drawOuterSelection(canvasDraw);
            }
            break;
        case 'crop-circle':
            if (canvasDraw === this.lowerContext) {
                canvasDraw = this.upperContext;
            }
            this.shapeCircle(canvasDraw, selectionWidth, selectionHeight);
            break;
        case 'line':
            this.shapeLine(canvasDraw, selectionWidth, selectionHeight);
            if (canvasDraw === this.upperContext) {
                this.drawOuterSelection(canvasDraw);
            }
            break;
        case 'text':
            this.shapeText(canvasDraw);
            break;
        case 'crop-square':
        case 'crop-3:4':
        case 'crop-4:3':
        case 'crop-6:9':
        case 'crop-9:6':
        case 'crop-9:16':
        case 'crop-16:9':
            if (canvasDraw === this.lowerContext) {
                canvasDraw = this.upperContext;
            }
            this.drawSelection(horLineWidth, verLineHeight);
            this.currObjType.shape = '';
            break;
        default:
            this.drawSelection(horLineWidth, verLineHeight);
            break;
        }
    }

    private shapeLine(canvasDraw: CanvasRenderingContext2D, selectionWidth: number, selectionHeight: number): void {
        let startX: number; let startY: number; let endX: number; let endY: number; let degree: number;
        if (this.activeObj.shapeDegree === 0) {degree = this.degree; }
        else {degree =  this.degree - this.activeObj.shapeDegree; }
        if (degree === 0 || degree % 180 === 0) {
            startX = this.activeObj.activePoint.startX;
            startY = this.activeObj.activePoint.startY + (selectionHeight / 2);
            endX = this.activeObj.activePoint.endX;
            endY = this.activeObj.activePoint.startY + (selectionHeight / 2);
        } else {
            startX = this.activeObj.activePoint.startX + (selectionWidth / 2);
            startY = this.activeObj.activePoint.startY;
            endX = this.activeObj.activePoint.startX + (selectionWidth / 2);
            endY = this.activeObj.activePoint.endY;
        }
        const tempLineWidth: number = canvasDraw.lineWidth;
        canvasDraw.lineWidth = (this.activeObj.strokeSettings.strokeWidth);
        canvasDraw.beginPath();
        switch (this.activeObj.lineDraw.toLowerCase()) {
        case 'horizontal':
        case 'vertical':
            canvasDraw.moveTo(startX, startY);
            canvasDraw.lineTo(endX, endY);
            break;
        case 'normal':
            canvasDraw.moveTo(this.activeObj.horTopLine.startX, this.activeObj.horTopLine.startY);
            canvasDraw.lineTo(this.activeObj.horBottomLine.endX, this.activeObj.horBottomLine.endY);
            break;
        }
        canvasDraw.stroke();
        canvasDraw.lineWidth = tempLineWidth;
    }

    private shapeText(canvasDraw: CanvasRenderingContext2D): void {
        const rows: string[] = this.activeObj.keyHistory.split('\n');
        const height: number = this.activeObj.textSettings.fontSize + this.activeObj.textSettings.fontSize * 0.25;
        const lineHeight: number = ((height * rows.length) - (this.activeObj.textSettings.fontSize * rows.length)) / rows.length;
        for (let i: number = 0; i < rows.length; i++) {
            const text: string = rows[i as number];
            const yPoint: number = ((i + 1) * this.activeObj.textSettings.fontSize * 0.85) + (i * lineHeight);
            if (this.degree === -360) {this.degree = 0; }
            if (this.degree === 0 || this.degree === 180) {
                if (this.activeObj.textSettings.fontSize > this.activeObj.activePoint.height) {
                    this.activeObj.textSettings.fontSize = this.activeObj.activePoint.height -
                        (this.activeObj.activePoint.height * 0.1);
                }
            }
            else {
                if (this.activeObj.textSettings.fontSize > this.activeObj.activePoint.width) {
                    this.activeObj.textSettings.fontSize = this.activeObj.activePoint.width -
                        (this.activeObj.activePoint.width * 0.1);
                }
            }
            canvasDraw.strokeStyle = this.activeObj.strokeSettings.strokeColor;
            canvasDraw.fillStyle = this.activeObj.strokeSettings.strokeColor;
            let textStyle: string = '';
            if (this.activeObj.textSettings.bold) {textStyle = 'bold '; }
            if (this.activeObj.textSettings.italic) {textStyle = 'italic '; }
            if (this.activeObj.textSettings.bold && this.activeObj.textSettings.italic) {textStyle = 'italic bold '; }
            canvasDraw.font = textStyle + this.activeObj.textSettings.fontSize + 'px' + ' ' + this.activeObj.textSettings.fontFamily;
            if (this.activeObj.flipObjColl.length === 4) {
                this.activeObj.flipObjColl = [];
            }
            for (let j: number = 0; j < this.activeObj.flipObjColl.length; j++) {
                if (this.activeObj.flipObjColl[j as number].toLowerCase() === 'horizontal') {
                    canvasDraw.translate(canvasDraw.canvas.width, 0);
                    canvasDraw.scale(-1, 1);
                    this.updateActPoint('horizontal', canvasDraw);
                } else if (this.activeObj.flipObjColl[j as number].toLowerCase() === 'vertical') {
                    canvasDraw.translate(0, canvasDraw.canvas.height);
                    canvasDraw.scale(1, -1);
                    this.updateActPoint('vertical', canvasDraw);
                }
            }
            if (this.activeObj.shapeDegree !== this.degree) {
                this.rotateText(canvasDraw);
            } else {
                canvasDraw.fillText(text, this.activeObj.activePoint.startX + this.activeObj.textSettings.fontSize * 0.1,
                                    this.activeObj.activePoint.startY + yPoint);
            }
            for (let k: number = 0; k < this.activeObj.flipObjColl.length; k++) {
                if (this.activeObj.flipObjColl[k as number].toLowerCase() === 'horizontal') {
                    canvasDraw.translate(canvasDraw.canvas.width, 0);
                    canvasDraw.scale(-1, 1);
                    this.updateActPoint('horizontal', canvasDraw);
                } else if (this.activeObj.flipObjColl[k as number].toLowerCase() === 'vertical') {
                    canvasDraw.translate(0, canvasDraw.canvas.height);
                    canvasDraw.scale(1, -1);
                    this.updateActPoint('vertical', canvasDraw);
                }
            }
        }
        this.currObjType.isText = false;
    }

    private updateActPoint(degree: string, canvasDraw: CanvasRenderingContext2D): void {
        if (degree.toLowerCase() === 'horizontal') {
            if (this.activeObj.activePoint.startX <= canvasDraw.canvas.width / 2) {
                this.activeObj.activePoint.startX = canvasDraw.canvas.width / 2 + ((canvasDraw.canvas.width / 2) -
                this.activeObj.activePoint.endX);
                this.activeObj.activePoint.endX = this.activeObj.activePoint.startX + this.activeObj.activePoint.width;
                this.updateActiveObject(this.activeObj.activePoint, this.activeObj);
            } else if (this.activeObj.activePoint.startX >= canvasDraw.canvas.width / 2) {
                this.activeObj.activePoint.startX = canvasDraw.canvas.width - this.activeObj.activePoint.endX;
                this.activeObj.activePoint.endX = this.activeObj.activePoint.startX + this.activeObj.activePoint.width;
                this.updateActiveObject(this.activeObj.activePoint, this.activeObj);
            }
        }
        else if (degree.toLowerCase() === 'vertical') {
            if (this.activeObj.activePoint.startY <= canvasDraw.canvas.height / 2) {
                this.activeObj.activePoint.startY = canvasDraw.canvas.height / 2 + ((canvasDraw.canvas.height / 2) -
                this.activeObj.activePoint.endY);
                this.activeObj.activePoint.endY = this.activeObj.activePoint.startY + this.activeObj.activePoint.height;
                this.updateActiveObject(this.activeObj.activePoint, this.activeObj);
            } else if (this.activeObj.activePoint.startY >= canvasDraw.canvas.height / 2) {
                this.activeObj.activePoint.startY = canvasDraw.canvas.height - this.activeObj.activePoint.endY;
                this.activeObj.activePoint.endY = this.activeObj.activePoint.startY + this.activeObj.activePoint.height;
                this.updateActiveObject(this.activeObj.activePoint, this.activeObj);
            }
        }
    }

    private drawSquareLines(canvasDraw: CanvasRenderingContext2D): void {
        let splitWords: string[];
        if (this.activeObj.shape !== undefined) {splitWords = this.activeObj.shape.split('-'); }
        if (splitWords[0] === 'crop') {
            canvasDraw.strokeStyle = '#fff';
        } else {
            canvasDraw.strokeStyle = this.activeObj.strokeSettings.strokeColor;
        }
        canvasDraw.beginPath();
        canvasDraw.rect(this.activeObj.activePoint.startX, this.activeObj.activePoint.startY, this.activeObj.activePoint.width,
                        this.activeObj.activePoint.height);
        if (this.activeObj.strokeSettings.fillColor !== '') {
            canvasDraw.fillStyle = this.activeObj.strokeSettings.fillColor;
            canvasDraw.fill();
        }
        canvasDraw.rect(this.activeObj.activePoint.startX + this.activeObj.strokeSettings.strokeWidth,
                        this.activeObj.activePoint.startY + this.activeObj.strokeSettings.strokeWidth,
                        this.activeObj.activePoint.width - (2 * this.activeObj.strokeSettings.strokeWidth),
                        this.activeObj.activePoint.height - (2 * this.activeObj.strokeSettings.strokeWidth));
        canvasDraw.fillStyle = this.activeObj.strokeSettings.strokeColor;
        canvasDraw.fill('evenodd');
        canvasDraw.closePath();
    }

    private drawSelection(horLineWidth: number, verLineHeight: number): void {
        this.upperContext.strokeStyle = this.themeColl[this.theme]['primaryColor'];
        this.upperContext.beginPath();
        this.activeObj.horTopInnerLine = {startX : this.activeObj.activePoint.startX, startY: this.activeObj.activePoint.startY +
            verLineHeight, endX: this.activeObj.activePoint.endX, endY: this.activeObj.activePoint.endY + verLineHeight};
        this.activeObj.horBottomInnerLine = {startX : this.activeObj.activePoint.startX, startY: this.activeObj.activePoint.startY +
            (2 * verLineHeight), endX: this.activeObj.activePoint.endX, endY: this.activeObj.activePoint.endY + (2 * verLineHeight)};
        this.activeObj.verLeftInnerLine = {startX : this.activeObj.activePoint.startX + horLineWidth,
            startY: this.activeObj.activePoint.startY, endX: this.activeObj.activePoint.startX + horLineWidth,
            endY: this.activeObj.activePoint.endY};
        this.activeObj.verRightInnerLine = {startX : this.activeObj.activePoint.startX + (2 * horLineWidth),
            startY: this.activeObj.activePoint.startY, endX: this.activeObj.activePoint.startX + (2 * horLineWidth),
            endY: this.activeObj.activePoint.endY};
        this.upperContext.moveTo(this.activeObj.horTopInnerLine.startX, this.activeObj.horTopInnerLine.startY);
        this.upperContext.lineTo(this.activeObj.horTopInnerLine.endX, this.activeObj.horTopInnerLine.startY);
        this.upperContext.moveTo(this.activeObj.horBottomInnerLine.startX, this.activeObj.horBottomInnerLine.startY);
        this.upperContext.lineTo(this.activeObj.horBottomInnerLine.endX, this.activeObj.horBottomInnerLine.startY);
        this.upperContext.moveTo(this.activeObj.verLeftInnerLine.startX, this.activeObj.verLeftInnerLine.startY);
        this.upperContext.lineTo(this.activeObj.verLeftInnerLine.endX, this.activeObj.verLeftInnerLine.endY);
        this.upperContext.moveTo(this.activeObj.verRightInnerLine.startX, this.activeObj.verRightInnerLine.startY);
        this.upperContext.lineTo(this.activeObj.verRightInnerLine.endX, this.activeObj.verRightInnerLine.endY);
        this.upperContext.stroke();
        this.upperContext.closePath();
    }

    private drawCenterCircles(canvasDraw: CanvasRenderingContext2D): void {
        canvasDraw.lineWidth *= 2;
        canvasDraw.beginPath();
        canvasDraw.moveTo(this.activeObj.topCenterCircle.startX, this.activeObj.topCenterCircle.startY);
        canvasDraw.arc(this.activeObj.topCenterCircle.startX, this.activeObj.topCenterCircle.startY,
                       this.activeObj.topCenterCircle.radius, 0, 2 * Math.PI);
        canvasDraw.moveTo(this.activeObj.centerLeftCircle.startX, this.activeObj.centerLeftCircle.startY);
        canvasDraw.arc(this.activeObj.centerLeftCircle.startX, this.activeObj.centerLeftCircle.startY,
                       this.activeObj.centerLeftCircle.radius, 0, 2 * Math.PI);
        canvasDraw.moveTo(this.activeObj.centerRightCircle.startX, this.activeObj.centerRightCircle.startY);
        canvasDraw.arc(this.activeObj.centerRightCircle.startX, this.activeObj.centerRightCircle.startY,
                       this.activeObj.centerRightCircle.radius, 0, 2 * Math.PI);
        canvasDraw.moveTo(this.activeObj.bottomCenterCircle.startX, this.activeObj.bottomCenterCircle.startY);
        canvasDraw.arc(this.activeObj.bottomCenterCircle.startX, this.activeObj.bottomCenterCircle.startY,
                       this.activeObj.bottomCenterCircle.radius, 0, 2 * Math.PI);
        canvasDraw.stroke(); canvasDraw.fill(); canvasDraw.closePath();
        canvasDraw.lineWidth /= 2;
    }

    private findTarget(x: number, y: number, type: string): void {
        if (type.toLowerCase() === 'mousedown' || type.toLowerCase() === 'touchstart') {
            let splitWords: string[]; let isCrop: boolean = false;
            if (this.activeObj.shape) {
                splitWords = this.activeObj.shape.split('-');
                if (splitWords[0] === 'crop') {isCrop = true; }
            }
            this.findTargetObj(x, y, isCrop);
            this.updateCursorStyles(x, y, type);
        } else {
            switch ( this.dragElement.toLowerCase()) {
            case 'nw-resize':
                this.activeObj.topLeftCircle.startX = x; this.activeObj.topLeftCircle.startY = y;
                break;
            case 'n-resize':
                this.activeObj.topCenterCircle.startX = x; this.activeObj.topCenterCircle.startY = y;
                break;
            case 'ne-resize':
                this.activeObj.topRightCircle.startX = x; this.activeObj.topRightCircle.startY = y;
                break;
            case 'w-resize':
                this.activeObj.centerLeftCircle.startX = x; this.activeObj.centerLeftCircle.startY = y;
                break;
            case 'e-resize':
                this.activeObj.centerRightCircle.startX = x; this.activeObj.centerRightCircle.startY = y;
                break;
            case 'sw-resize':
                this.activeObj.bottomLeftCircle.startX = x; this.activeObj.bottomLeftCircle.startY = y;
                break;
            case 's-resize':
                this.activeObj.bottomCenterCircle.startX = x; this.activeObj.bottomCenterCircle.startY = y;
                break;
            case 'se-resize':
                this.activeObj.bottomRightCircle.startX = x; this.activeObj.bottomRightCircle.startY = y;
                break;
            default:
                if (this.dragPoint.startX && this.dragPoint.startY) {
                    this.previousPoint.x = this.dragPoint.endX; this.previousPoint.y = this.dragPoint.endY;
                    this.dragPoint.endX = x; this.dragPoint.endY = y;
                }
                break;
            }
        }
    }

    private findTargetObj(x: number, y: number, isCrop: boolean): boolean {
        let isShape: boolean;
        if (this.objColl.length !== 0 && !this.currObjType.isCustomCrop && !isCrop) {
            let diffX: number = 0; let i: number;
            for (let index: number = 0; index < this.objColl.length; index++ ) {
                const actObj: SelectionPoint = extend({}, this.objColl[index as number], {}, true) as SelectionPoint;
                if (x >= (actObj.activePoint.startX - (actObj.topLeftCircle.radius * 2)) &&
                    x <= (actObj.activePoint.endX + (actObj.topLeftCircle.radius * 2)) &&
                    y >= (actObj.activePoint.startY - (actObj.topLeftCircle.radius * 2)) &&
                    y <= (actObj.activePoint.endY + (actObj.topLeftCircle.radius * 2))) {
                    if (this.isTouch || this.upperCanvas.style.cursor === 'move' || this.upperCanvas.style.cursor === 'grab' || this.isShapeInserted) {
                        if (diffX === 0 || diffX > x - actObj.activePoint.startX) {
                            diffX = x - this.objColl[index as number].activePoint.startX;
                            i = index;
                        }
                    } else if (this.objColl[index as number].currIndex === this.tempActiveObj.currIndex) {
                        i = index;
                    }
                }
            }
            if (isNullOrUndefined(i)) {
                this.refreshActiveObj();
                isShape = false;
            } else {
                this.tempObjColl = extend([], this.objColl, [], true) as SelectionPoint[];
                this.currObjType.isCustomCrop = false;
                this.activeObj = extend({}, this.objColl[i as number], {}, true) as SelectionPoint;
                const temp: SelectionPoint = extend({}, this.objColl[i as number], {}, true) as SelectionPoint;
                this.objColl.splice(i, 1);
                if (this.degree === 0) {
                    this.lowerContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
                    this.updateBrightnessFilter();
                    this.lowerContext.drawImage(this.baseImg, this.srcLeft, this.srcTop, this.srcWidth,
                                                this.srcHeight, this.destLeft, this.destTop, this.destWidth, this.destHeight);
                    const temp: string = this.lowerContext.filter;
                    this.lowerContext.filter = 'none';
                    this.iterateObjColl();
                    this.activeObj = extend({}, temp, {}, true) as SelectionPoint;
                    this.freehandRedraw(this.lowerContext);
                    this.lowerContext.filter = temp;
                    this.getCurrentFlipState();
                } else {
                    this.callUpdateCurrentTransformedState();
                    this.freehandRedraw(this.lowerContext);
                }
                this.clearOuterCanvas(this.lowerContext);
                if ((!isNullOrUndefined(this.currSelectionPoint) && this.currSelectionPoint.shape === 'crop-circle') || this.isCircleCrop) {
                    this.cropCircle(this.lowerContext);
                }
                this.setActivePoint();
                this.activeObj = extend({}, temp, {}, true) as SelectionPoint;
                this.tempStrokeSettings = extend({}, this.activeObj.strokeSettings, {}, true) as StrokeSettings;
                this.tempTextSettings = extend({}, this.activeObj.textSettings, {}, true) as TextSettings;
                const shapeSettings: ShapeSettings = this.updatePreviousShapeSettings();
                const shapeChangingArgs: ShapeChangeEventArgs = {action: 'select', previousShapeSettings: shapeSettings,
                    currentShapeSettings: shapeSettings};
                this.trigger('shapeChanging', shapeChangingArgs);
                this.updateShapeChangeEventArgs(shapeChangingArgs.currentShapeSettings);
                if (this.activeObj.activePoint) {
                    this.drawObject('duplicate', this.activeObj, null, null, true);
                    if (this.activeObj.activePoint.startX < this.destLeft) {this.isPreventDragging = true; }
                    else if (this.activeObj.activePoint.endX > this.destLeft + this.destWidth) {this.isPreventDragging = true; }
                    else if (this.activeObj.activePoint.startY < this.destTop) {this.isPreventDragging = true; }
                    else if (this.activeObj.activePoint.endY > this.destTop + this.destHeight) {this.isPreventDragging = true; }
                }
                isShape = true;
            }
        }
        return isShape;
    }

    private getCurrentFlipState(): void {
        if (this.rotateFlipColl.length !== 0) {
            const totalPannedInternalPoint: Point = extend({}, this.totalPannedInternalPoint, {}, true) as Point;
            this.callUpdateCurrentTransformedState();
            this.totalPannedInternalPoint = totalPannedInternalPoint;
        } else {
            this.callUpdateCurrentTransformedState();
        }
    }

    private rotateDegree(degree: number): void {
        this.lowerContext.save();
        this.lowerContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
        this.lowerContext.translate(this.lowerCanvas.width / 2, this.lowerCanvas.height / 2);
        this.lowerContext.rotate(Math.PI / 180 * degree);
        this.lowerContext.translate(-this.lowerCanvas.width / 2, -this.lowerCanvas.height / 2);
        const temp: string = this.lowerContext.filter;
        this.updateBrightnessFilter();
        this.lowerContext.drawImage(this.baseImg, this.srcLeft, this.srcTop, this.srcWidth,
                                    this.srcHeight, this.destLeft, this.destTop, this.destWidth, this.destHeight);
        this.lowerContext.filter = temp;
        this.lowerContext.translate(this.lowerCanvas.width / 2, this.lowerCanvas.height / 2);
        this.lowerContext.rotate(Math.PI / 180 * -degree);
        this.lowerContext.translate(-this.lowerCanvas.width / 2, -this.lowerCanvas.height / 2);
        this.lowerContext.restore();
    }

    private updateCursorStyles(x: number, y: number, type: string): void {
        let isResize: boolean = false;
        if (this.activeObj.keyHistory !== '' && this.activeObj.shape === undefined && !this.currObjType.isCustomCrop &&
        !this.currObjType.isLine && this.currObjType.isText) {
            this.activeObj.shape = 'text';
        }
        const actObj: SelectionPoint = extend({}, this.activeObj, {}, true) as SelectionPoint;
        if (isNullOrUndefined(actObj.topLeftCircle)) {
            return;
        }
        if (x >= (actObj.topLeftCircle.startX - (actObj.topLeftCircle.radius * 2)) &&
            x <= (actObj.topLeftCircle.startX + (actObj.topLeftCircle.radius * 2)) &&
            y >= (actObj.topLeftCircle.startY - (actObj.topLeftCircle.radius * 2)) &&
            y <= (actObj.topLeftCircle.startY + (actObj.topLeftCircle.radius * 2)) && this.dragElement !== 'nw-resize') {
            actObj.topLeftCircle.startX = actObj.topLeftCircle.startY = 0;
            this.upperCanvas.style.cursor = 'nw-resize'; isResize = true;
            this.dragElement = this.upperCanvas.style.cursor;
        } else if (x >= (actObj.topCenterCircle.startX - (actObj.topLeftCircle.radius * 2)) &&
            x <= (actObj.topCenterCircle.startX + (actObj.topLeftCircle.radius * 2)) &&
            y >= (actObj.topCenterCircle.startY - (actObj.topLeftCircle.radius * 2)) &&
            y <= (actObj.topCenterCircle.startY + (actObj.topLeftCircle.radius * 2)) && this.dragElement !== 'n-resize') {
            actObj.topCenterCircle.startX = actObj.topCenterCircle.startY = 0;
            this.upperCanvas.style.cursor = 'n-resize'; isResize = true;
            this.dragElement = this.upperCanvas.style.cursor;
        } else if (x >= (actObj.topRightCircle.startX - (actObj.topLeftCircle.radius * 2)) &&
                x <= (actObj.topRightCircle.startX + (actObj.topLeftCircle.radius * 2)) &&
                y >= (actObj.topRightCircle.startY - (actObj.topLeftCircle.radius * 2)) &&
                y <= (actObj.topRightCircle.startY + (actObj.topLeftCircle.radius * 2)) && this.dragElement !== 'ne-resize') {
            actObj.topRightCircle.startX = actObj.topRightCircle.startY = 0;
            this.upperCanvas.style.cursor = 'ne-resize'; isResize = true;
            this.dragElement = this.upperCanvas.style.cursor;
        } else if (x >= (actObj.centerLeftCircle.startX - (actObj.topLeftCircle.radius * 2)) &&
                x <= (actObj.centerLeftCircle.startX + (actObj.topLeftCircle.radius * 2)) &&
                y >= (actObj.centerLeftCircle.startY - (actObj.topLeftCircle.radius * 2)) &&
                y <= (actObj.centerLeftCircle.startY + (actObj.topLeftCircle.radius * 2)) && this.dragElement !== 'w-resize') {
            actObj.centerLeftCircle.startX = actObj.centerLeftCircle.startY = 0;
            this.upperCanvas.style.cursor = 'w-resize'; isResize = true;
            this.dragElement = this.upperCanvas.style.cursor;
        } else if (x >= (actObj.centerRightCircle.startX - (actObj.topLeftCircle.radius * 2)) &&
                x <= (actObj.centerRightCircle.startX + (actObj.topLeftCircle.radius * 2)) &&
                y >= (actObj.centerRightCircle.startY - (actObj.topLeftCircle.radius * 2)) &&
                y <= (actObj.centerRightCircle.startY + (actObj.topLeftCircle.radius * 2)) && this.dragElement !== 'e-resize') {
            actObj.centerRightCircle.startX = actObj.centerRightCircle.startY = 0;
            this.upperCanvas.style.cursor = 'e-resize'; isResize = true;
            this.dragElement = this.upperCanvas.style.cursor;
        } else if (x >= (actObj.bottomLeftCircle.startX - (actObj.topLeftCircle.radius * 2)) &&
                x <= (actObj.bottomLeftCircle.startX + (actObj.topLeftCircle.radius * 2)) &&
                y >= (actObj.bottomLeftCircle.startY - (actObj.topLeftCircle.radius * 2)) &&
                y <= (actObj.bottomLeftCircle.startY + (actObj.topLeftCircle.radius * 2)) && this.dragElement !== 'sw-resize') {
            actObj.bottomLeftCircle.startX = actObj.bottomLeftCircle.startY = 0;
            this.upperCanvas.style.cursor = 'sw-resize'; isResize = true;
            this.dragElement = this.upperCanvas.style.cursor;
        } else if (x >= (actObj.bottomCenterCircle.startX - (actObj.topLeftCircle.radius * 2)) &&
                x <= (actObj.bottomCenterCircle.startX + (actObj.topLeftCircle.radius * 2)) &&
                y >= (actObj.bottomCenterCircle.startY - (actObj.topLeftCircle.radius * 2)) &&
                y <= (actObj.bottomCenterCircle.startY + (actObj.topLeftCircle.radius * 2)) && this.dragElement !== 's-resize') {
            actObj.bottomCenterCircle.startX = actObj.bottomCenterCircle.startY = 0;
            this.upperCanvas.style.cursor = 's-resize'; isResize = true;
            this.dragElement = this.upperCanvas.style.cursor;
        } else if (x >= (actObj.bottomRightCircle.startX - (actObj.topLeftCircle.radius * 2)) &&
                x <= (actObj.bottomRightCircle.startX + (actObj.topLeftCircle.radius * 2)) &&
                y >= (actObj.bottomRightCircle.startY - (actObj.topLeftCircle.radius * 2)) &&
                y <= (actObj.bottomRightCircle.startY + (actObj.topLeftCircle.radius * 2)) && this.dragElement !== 'se-resize') {
            actObj.bottomRightCircle.startX = actObj.bottomRightCircle.startY = 0;
            this.upperCanvas.style.cursor = 'se-resize'; isResize = true;
            this.dragElement = this.upperCanvas.style.cursor;
        } else {
            this.dragPoint.startX = this.previousPoint.x = this.dragPoint.endX = x;
            this.dragPoint.startY = this.previousPoint.y = this.dragPoint.endY = y;
        }
        this.previousPoint.x = this.previousPoint.y = this.diffPoint.x = this.diffPoint.y = 0;
        if (type === 'touchstart') {
            if (isResize || (x >= actObj.activePoint.startX && x <= actObj.activePoint.endX
                && y >= actObj.activePoint.startY && y <= actObj.activePoint.endY)) {
                this.currObjType.isDragging = true;
            }
        } else {
            this.currObjType.isDragging = true;
        }
    }

    private drawCropRatio(): void {
        let x: number; let y: number; let width: number; let height: number;
        if (this.zoomFactor > 0 && !isNullOrUndefined(this.currentSelectionPoint)) {
            //width = this.currentSelectionPoint.activePoint.width; height = this.currentSelectionPoint.activePoint.height;
            if (this.destLeft + this.destLeft + this.destWidth <= this.lowerCanvas.clientWidth) {
                width = this.destWidth;
                if (this.destLeft < 0) {
                    width += (2 * this.destLeft);
                }
            } else {
                width = this.lowerCanvas.clientWidth;
            }
            if (this.destTop + this.destTop + this.destHeight <= this.lowerCanvas.clientHeight) {
                height = this.destHeight;
                if (this.destTop < 0) {
                    height += (2 * this.destTop);
                }
            } else {
                height = this.lowerCanvas.clientHeight;
            }
            if (this.degree !== 0) {
                this.isAllowCropPan = true;
            }
        } else {
            width = this.destWidth; height = this.destHeight;
            if (this.destLeft < 0) {width += this.destLeft; }
            if (this.destTop < 0) {height += this.destTop; }
            if (this.currObjType.shape.toLowerCase() !== 'crop-square' && this.currObjType.shape.toLowerCase() !== 'crop-circle') {
                if (this.destLeft + this.destWidth > this.lowerCanvas.width) {
                    width -= (this.destLeft + this.destWidth - this.lowerCanvas.width); }
                if (this.destTop + this.destHeight > this.lowerCanvas.height) {
                    height -= (this.destTop + this.destHeight - this.lowerCanvas.height); }
            }
        }
        switch (this.currObjType.shape.toLowerCase()) {
        case 'crop-square':
        case 'crop-circle':
            this.setDragDirection(width, height);
            if (width === this.destWidth && height === this.destHeight) {
                this.activeObj.activePoint.startX += this.destLeft; this.activeObj.activePoint.startY += this.destTop;
                this.activeObj.activePoint.endX += this.destLeft; this.activeObj.activePoint.endY += this.destTop;
            }
            if (this.lowerCanvas.width > this.lowerCanvas.height) {
                this.activeObj.activePoint.height = this.activeObj.activePoint.endY - this.activeObj.activePoint.startY;
                this.activeObj.activePoint.width = this.activeObj.activePoint.height;
                this.activeObj.activePoint.endX = this.activeObj.activePoint.startX + this.activeObj.activePoint.width;
            } else {
                this.activeObj.activePoint.width = this.activeObj.activePoint.endX - this.activeObj.activePoint.startX;
                this.activeObj.activePoint.height = this.activeObj.activePoint.width;
                this.activeObj.activePoint.endY = this.activeObj.activePoint.startY + this.activeObj.activePoint.height;
            }
            break;
        case 'crop-3:2':
            x = 3; y = 2;
            break;
        case 'crop-4:3':
            x = 4; y = 3;
            break;
        case 'crop-5:4':
            x = 5; y = 4;
            break;
        case 'crop-7:5':
            x = 7; y = 5;
            break;
        case 'crop-16:9':
            x = 16; y = 9;
            break;
        }
        if (x !== undefined && y !== undefined) {
            this.calcShapeRatio(x, y, width, height);
            if (width === this.destWidth && height === this.destHeight) {
                this.updatePoints();
            }
        }
        // Set Selection inside image
        if (!isNullOrUndefined(this.currentSelectionPoint)) {
            if (this.activeObj.activePoint.startX < this.currentSelectionPoint.activePoint.startX) {
                const diff: number = this.currentSelectionPoint.activePoint.startX - this.activeObj.activePoint.startX;
                this.activeObj.activePoint.startX += diff; this.activeObj.activePoint.endX += diff;
            }
            if (this.activeObj.activePoint.startY < this.currentSelectionPoint.activePoint.startY) {
                const diff: number = this.currentSelectionPoint.activePoint.startY - this.activeObj.activePoint.startY;
                this.activeObj.activePoint.startY += diff; this.activeObj.activePoint.endY += diff;
            }
            if (this.activeObj.activePoint.endX > this.currentSelectionPoint.activePoint.endX) {
                const diff: number = this.activeObj.activePoint.endX - this.currentSelectionPoint.activePoint.endX;
                this.activeObj.activePoint.startX -= diff; this.activeObj.activePoint.endX -= diff;
            }
            if (this.activeObj.activePoint.endY > this.currentSelectionPoint.activePoint.endY) {
                const diff: number = this.activeObj.activePoint.endY - this.currentSelectionPoint.activePoint.endY;
                this.activeObj.activePoint.startY -= diff; this.activeObj.activePoint.endY -= diff;
            }
            this.activeObj.activePoint.startX = (this.lowerCanvas.clientWidth - this.activeObj.activePoint.width) / 2;
            this.activeObj.activePoint.startY = (this.lowerCanvas.clientHeight - this.activeObj.activePoint.height) / 2;
            this.activeObj.activePoint.endX = this.activeObj.activePoint.startX + this.activeObj.activePoint.width;
            this.activeObj.activePoint.endY = this.activeObj.activePoint.startY + this.activeObj.activePoint.height;
        }
        if (this.zoomFactor === 0) {
            if (this.activeObj.activePoint.startX < this.destLeft) {
                const diff: number = (this.destLeft - this.activeObj.activePoint.startX) + 7.5;
                this.activeObj.activePoint.startX += diff;
                this.activeObj.activePoint.endX += diff;
            }
            if (this.activeObj.activePoint.startY < this.destTop) {
                const diff: number = (this.destTop - this.activeObj.activePoint.startY) + 7.5;
                this.activeObj.activePoint.startY += diff;
                this.activeObj.activePoint.endY += diff;
            }
            this.activeObj.activePoint.width = this.activeObj.activePoint.endX - this.activeObj.activePoint.startX;
            this.activeObj.activePoint.height = this.activeObj.activePoint.endY - this.activeObj.activePoint.startY;
        }
    }

    private setDragDirection(width: number, height: number): void {
        const arcRadius: number = (7.5);
        if (this.destWidth > this.destHeight) {
            this.activeObj.activePoint.startX = this.dragPoint.startX = ((width / 2) - (height / 2))
                + arcRadius;
            this.activeObj.activePoint.startY = this.dragPoint.startY = ((height / 2) - (height / 2))
                + arcRadius;
            this.activeObj.activePoint.endX = ((width / 2) + (height / 2)) - arcRadius;
            this.activeObj.activePoint.endY = ((height / 2) + (height / 2)) - arcRadius;
        }
        else {
            this.activeObj.activePoint.startY = this.dragPoint.startX = ((height / 2) - (width) / 2)
                 + arcRadius;
            this.activeObj.activePoint.endY = ((height / 2) + (width) / 2) - arcRadius;
            this.activeObj.activePoint.startX = this.dragPoint.startX = arcRadius;
            this.activeObj.activePoint.endX = width - arcRadius;
        }
    }

    private updatePoints(): void {
        this.activeObj.activePoint.startX += this.destLeft;
        this.activeObj.activePoint.startY += this.destTop;
        this.activeObj.activePoint.endX += this.destLeft;
        this.activeObj.activePoint.endY += this.destTop;
        this.activeObj.activePoint.width = this.activeObj.activePoint.endX - this.activeObj.activePoint.startX;
        this.activeObj.activePoint.height = this.activeObj.activePoint.endY - this.activeObj.activePoint.startY;
    }

    private calcShapeRatio(x: number, y: number, imgWidth: number, imgHeight: number): void {
        const arcRadius: number = (7.5);
        const originalWidth: number = imgWidth;
        const originalHeight: number = imgHeight;
        const presetRatio: number = x / y;
        const standardSize: number = originalWidth >= originalHeight ? originalWidth : originalHeight;
        let width: number = standardSize * presetRatio; let height: number = standardSize;
        const scaleWidth: number = this.getScale(width, originalWidth);
        const snippetArray: number[] = [];
        for (let i: number = 0; i < 2; i++) {
            if (i === 0) { snippetArray.push(width * scaleWidth); }
            else { snippetArray.push(height * scaleWidth); }
        }
        width = snippetArray[0]; height = snippetArray[1];
        const scaleHeight: number = this.getScale(height, originalHeight);
        const snippetArray1: number[] = [];
        for (let i: number = 0; i < 2; i++) {
            if (i === 0) { snippetArray1.push(width * scaleHeight); }
            else { snippetArray1.push(height * scaleHeight); }
        }
        width = snippetArray1[0]; height = snippetArray1[1];
        this.activeObj.activePoint.width = width;
        this.activeObj.activePoint.height = height;
        this.activeObj.activePoint.startX = (this.dragPoint.startX = (originalWidth - width) / 2) + arcRadius;
        this.activeObj.activePoint.startY = (this.dragPoint.startY = (originalHeight - height) / 2) + arcRadius;
        this.activeObj.activePoint.endX = ((originalWidth - width) / 2 + width) - arcRadius;
        this.activeObj.activePoint.endY = ((originalHeight - height) / 2 + height) - arcRadius;
        if (this.activeObj.activePoint.startX < this.destLeft && this.destLeft + this.destWidth > this.lowerCanvas.clientWidth) {
            this.activeObj.activePoint.startX = this.destLeft;
            this.activeObj.activePoint.endX = this.activeObj.activePoint.startX + width;
        }
        if (this.activeObj.activePoint.startY < this.destTop && this.destTop + this.destHeight > this.lowerCanvas.clientHeight) {
            this.activeObj.activePoint.startY = this.destTop;
            this.activeObj.activePoint.endY = this.activeObj.activePoint.startY + height;
        }
        this.activeObj.activePoint.width = this.activeObj.activePoint.endX - this.activeObj.activePoint.startX;
        this.activeObj.activePoint.height = this.activeObj.activePoint.endY - this.activeObj.activePoint.startY;
    }

    private getScale(value: number, originalValue: number): number {
        return value > originalValue ? originalValue / value : 1;
    }

    private calcMaxDimension(width: number, height: number): Dimension {
        let canvasMaxWidth: number = this.element.clientWidth;
        let canvasMaxHeight: number = this.element.clientHeight - this.toolbarHeight;
        canvasMaxHeight = Browser.isDevice ? canvasMaxHeight - this.toolbarHeight : canvasMaxHeight;
        canvasMaxWidth -= 30; canvasMaxHeight -= 30;
        const widthScale: number = canvasMaxWidth / width;
        const heightScale: number = canvasMaxHeight / height;
        let cssMaxWidth: number = Math.min(width, canvasMaxWidth);
        let cssMaxHeight: number = Math.min(height, canvasMaxHeight);
        if (widthScale < 1 && widthScale < heightScale) {
            cssMaxWidth = width * widthScale; cssMaxHeight = height * widthScale;
        } else if (heightScale < 1 && heightScale < widthScale) {
            cssMaxWidth = width * heightScale; cssMaxHeight = height * heightScale;
        }
        return {width: cssMaxWidth, height: cssMaxHeight};
    }

    private setMaximumDimension(degree: number, tempCanvas: HTMLCanvasElement): void {
        let newWidth: number; let newHeight: number;
        if (degree % 90 === 0 && degree % 180 !== 0) {
            newWidth = this.baseImg.height; newHeight = this.baseImg.width;
        } else if (degree % 180 === 0 || degree === 0) {
            newWidth = this.baseImg.width; newHeight = this.baseImg.height;
        }
        tempCanvas.width = newWidth;
        tempCanvas.height = newHeight;
        const maxDimension: Dimension = this.calcMaxDimension(newWidth, newHeight);
        tempCanvas.style.maxWidth = maxDimension.width + 'px';
        tempCanvas.style.maxHeight = maxDimension.height + 'px';
    }

    private setCursor(x: number, y: number): void {
        let isCropSelection: boolean = false; let splitWords: string[];
        if (this.activeObj.horTopLine !== undefined) {
            if (this.activeObj.shape !== undefined) {splitWords = this.activeObj.shape.split('-'); }
            if (splitWords === undefined && this.currObjType.isCustomCrop) {
                isCropSelection = true;
            } else if (splitWords !== undefined && splitWords[0] === 'crop'){
                isCropSelection = true;
            }
            if (!isCropSelection && this.togglePan) {
                this.lowerCanvas.style.cursor = this.upperCanvas.style.cursor = 'grab';
            }
            const cursor: string = this.upperCanvas.style.cursor;
            const actObj: SelectionPoint = extend({}, this.activeObj, {}, true) as SelectionPoint;
            if (x >= (actObj.topLeftCircle.startX - ((actObj.topLeftCircle.radius * 2))) &&
                x <= (actObj.topLeftCircle.startX + ((actObj.topLeftCircle.radius * 2))) &&
                y >= (actObj.topLeftCircle.startY - ((actObj.topLeftCircle.radius * 2))) &&
                y <= (actObj.topLeftCircle.startY + ((actObj.topLeftCircle.radius * 2)))) {
                this.upperCanvas.style.cursor = 'nw-resize';
            }
            else if (x >= (actObj.topCenterCircle.startX - ((actObj.topLeftCircle.radius * 2))) &&
                x <= (actObj.topCenterCircle.startX + ((actObj.topLeftCircle.radius * 2))) &&
                y >= (actObj.topCenterCircle.startY - ((actObj.topLeftCircle.radius * 2))) &&
                y <= (actObj.topCenterCircle.startY + ((actObj.topLeftCircle.radius * 2)))) {
                this.upperCanvas.style.cursor = 'n-resize';
            }
            else if (x >= (actObj.topRightCircle.startX - ((actObj.topLeftCircle.radius * 2))) &&
                x <= (actObj.topRightCircle.startX + ((actObj.topLeftCircle.radius * 2))) &&
                y >= (actObj.topRightCircle.startY - ((actObj.topLeftCircle.radius * 2))) &&
                y <= (actObj.topRightCircle.startY + ((actObj.topLeftCircle.radius * 2)))) {
                this.upperCanvas.style.cursor = 'ne-resize';
            }
            else if (x >= (actObj.centerLeftCircle.startX - ((actObj.topLeftCircle.radius * 2))) &&
                x <= (actObj.centerLeftCircle.startX + ((actObj.topLeftCircle.radius * 2))) &&
                y >= (actObj.centerLeftCircle.startY - ((actObj.topLeftCircle.radius * 2))) &&
                y <= (actObj.centerLeftCircle.startY + ((actObj.topLeftCircle.radius * 2)))) {
                this.upperCanvas.style.cursor = 'w-resize';
            }
            else if (x >= (actObj.centerRightCircle.startX - ((actObj.topLeftCircle.radius * 2))) &&
                x <= (actObj.centerRightCircle.startX + ((actObj.topLeftCircle.radius * 2))) &&
                y >= (actObj.centerRightCircle.startY - ((actObj.topLeftCircle.radius * 2))) &&
                y <= (actObj.centerRightCircle.startY + ((actObj.topLeftCircle.radius * 2)))) {
                this.upperCanvas.style.cursor = 'e-resize';
            }
            else if (x >= (actObj.bottomLeftCircle.startX - ((actObj.topLeftCircle.radius * 2))) &&
                x <= (actObj.bottomLeftCircle.startX + ((actObj.topLeftCircle.radius * 2))) &&
                y >= (actObj.bottomLeftCircle.startY - ((actObj.topLeftCircle.radius * 2))) &&
                y <= (actObj.bottomLeftCircle.startY + ((actObj.topLeftCircle.radius * 2)))) {
                this.upperCanvas.style.cursor = 'sw-resize';
            }
            else if (x >= (actObj.bottomCenterCircle.startX - ((actObj.topLeftCircle.radius * 2))) &&
                x <= (actObj.bottomCenterCircle.startX + ((actObj.topLeftCircle.radius * 2))) &&
                y >= (actObj.bottomCenterCircle.startY - ((actObj.topLeftCircle.radius * 2))) &&
                y <= (actObj.bottomCenterCircle.startY + ((actObj.topLeftCircle.radius * 2)))) {
                this.upperCanvas.style.cursor = 's-resize';
            }
            else if (x >= (actObj.bottomRightCircle.startX - ((actObj.topLeftCircle.radius * 2))) &&
                x <= (actObj.bottomRightCircle.startX + ((actObj.topLeftCircle.radius * 2))) &&
                y >= (actObj.bottomRightCircle.startY - ((actObj.topLeftCircle.radius * 2))) &&
                y <= (actObj.bottomRightCircle.startY + ((actObj.topLeftCircle.radius * 2)))) {
                this.upperCanvas.style.cursor = 'se-resize';
            }
            else if ((x >= actObj.activePoint.startX &&
                x <= actObj.activePoint.endX) && (y >= actObj.activePoint.startY &&
                y <= actObj.activePoint.endY)) {
                if (isCropSelection) {this.upperCanvas.style.cursor = 'grab'; }
                else {this.upperCanvas.style.cursor = 'move'; }
            }
            else {
                if (this.currObjType.isCustomCrop) {
                    this.upperCanvas.style.cursor = 'crosshair';
                }
                this.upperCanvas.style.cursor = 'default';
            }
            if (cursor === 'default' && this.upperCanvas.style.cursor === 'default' && isCropSelection) {
                this.upperCanvas.style.cursor = 'grab';
            }
            if (cursor === 'grab' && this.upperCanvas.style.cursor === 'default') {
                this.upperCanvas.style.cursor = 'grab';
            }
        }
        else if (this.togglePan && !this.togglePen) {
            this.lowerCanvas.style.cursor = this.upperCanvas.style.cursor = 'grab';
        } else {
            if (this.currObjType.isCustomCrop || this.togglePen) {this.upperCanvas.style.cursor = 'crosshair'; }
            else {this.upperCanvas.style.cursor = 'default'; }
        }
        if (this.upperCanvas.style.cursor === 'default' || this.upperCanvas.style.cursor === 'grab') {
            const cursor: string = this.upperCanvas.style.cursor;
            if (this.objColl.length > 0 && (this.upperCanvas.style.cursor !== 'grab' || !isCropSelection)) {
                this.setCursorFromObj(x, y, this.objColl);
            }
            if (cursor === 'grab' && this.upperCanvas.style.cursor === 'default') {
                this.upperCanvas.style.cursor = 'grab';
            }
        }
        if ((this.upperCanvas.style.cursor === 'default' || this.upperCanvas.style.cursor === 'grab')
            && !isNullOrUndefined(this.pointColl[0]) && (this.upperCanvas.style.cursor !== 'grab' || !isCropSelection)) {
            this.setCursorForFreehandDrawing(x, y);
        }
    }

    private setCursorForFreehandDrawing(x: number, y: number): void {
        let isEntered: boolean = false;
        this.freehandDrawHoveredIndex = -1;
        for (let n: number = 0; n < this.freehandCounter; n++) {
            this.points = extend([], this.pointColl[n as number].points, []) as Point[];
            this.pointCounter = 0;
            const len: number = this.points.length;
            for (let l: number = 0; l < len; l++) {
                if (l !== 0) {
                    let isInside: boolean = false;
                    if (!isNullOrUndefined(this.points[l - 1]) && !isNullOrUndefined(this.points[l as number])) {
                        isInside = this.isInside(x, y, this.points[l - 1].x, this.points[l - 1].y,
                                                 this.points[l as number].x, this.points[l as number].y);
                    }
                    if (isInside) {
                        this.isFreehandDrawingPoint = true;
                        this.freehandDrawHoveredIndex = n;
                        this.hoverFreehandraw();
                        this.upperCanvas.style.cursor = 'pointer';
                        isEntered = true;
                        break;
                    } else if (!this.isFreehandDrawEditing || this.pointColl[n as number].isSelected) {
                        this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
                        if (!isNullOrUndefined(this.activeObj.shape) && this.textArea.style.display === 'none') {
                            this.drawObject('duplicate', this.activeObj);
                        }
                        if (this.isFreehandDrawEditing) {
                            const strokeColor: string = this.pointColl[n as number].strokeColor = this.selectedFreehandColor;
                            this.hoverFreehandraw(strokeColor, this.pointColl[n as number].strokeWidth);
                        } else {
                            this.freehandDrawHoveredIndex = null;
                        }
                        this.isFreehandDrawingPoint = false;
                    }
                } else {
                    if (x > this.points[l as number].x - this.pointColl[n as number].strokeWidth &&
                        x < this.points[l as number].x + this.pointColl[n as number].strokeWidth &&
                        y > this.points[l as number].y - this.pointColl[n as number].strokeWidth &&
                        y < this.points[l as number].y + this.pointColl[n as number].strokeWidth) {
                        this.isFreehandDrawingPoint = true;
                        this.freehandDrawHoveredIndex = n;
                        this.hoverFreehandraw();
                        this.upperCanvas.style.cursor = 'pointer';
                        isEntered = true;
                        break;
                    } else if (!this.isFreehandDrawEditing || this.pointColl[n as number].isSelected) {
                        this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
                        if (!isNullOrUndefined(this.activeObj.shape) && this.textArea.style.display === 'none') {
                            this.drawObject('duplicate', this.activeObj);
                        }
                        if (this.isFreehandDrawEditing) {
                            const strokeColor: string = this.pointColl[n as number].strokeColor === '#fff' ? '#42a5f5' : this.pointColl[n as number].strokeColor;
                            this.hoverFreehandraw(strokeColor, this.pointColl[n as number].strokeWidth);
                        }
                        this.isFreehandDrawingPoint = false;
                    }
                }
            }
            if (isEntered) {
                break;
            }
        }
    }

    private setCursorFromObj(x: number, y: number, obj: SelectionPoint[]): void {
        for (let i: number = 0; i < obj.length; i++) {
            const actObj: SelectionPoint = extend({}, obj[i as number], {}, true) as SelectionPoint;
            if (x >= (actObj.topLeftCircle.startX - ((actObj.topLeftCircle.radius * 2))) &&
                x <= (actObj.topLeftCircle.startX + ((actObj.topLeftCircle.radius * 2))) &&
                y >= (actObj.topLeftCircle.startY - ((actObj.topLeftCircle.radius * 2))) &&
                y <= (actObj.topLeftCircle.startY + ((actObj.topLeftCircle.radius * 2)))) {
                this.upperCanvas.style.cursor = 'nw-resize';
                break;
            }
            else if (x >= (actObj.topCenterCircle.startX - ((actObj.topLeftCircle.radius * 2))) &&
                x <= (actObj.topCenterCircle.startX + ((actObj.topLeftCircle.radius * 2))) &&
                y >= (actObj.topCenterCircle.startY - ((actObj.topLeftCircle.radius * 2))) &&
                y <= (actObj.topCenterCircle.startY + ((actObj.topLeftCircle.radius * 2)))) {
                this.upperCanvas.style.cursor = 'n-resize';
                break;
            }
            else if (x >= (actObj.topRightCircle.startX - ((actObj.topLeftCircle.radius * 2))) &&
                x <= (actObj.topRightCircle.startX + ((actObj.topLeftCircle.radius * 2))) &&
                y >= (actObj.topRightCircle.startY - ((actObj.topLeftCircle.radius * 2))) &&
                y <= (actObj.topRightCircle.startY + ((actObj.topLeftCircle.radius * 2)))) {
                this.upperCanvas.style.cursor = 'ne-resize';
                break;
            }
            else if (x >= (actObj.centerLeftCircle.startX - ((actObj.topLeftCircle.radius * 2))) &&
                x <= (actObj.centerLeftCircle.startX + ((actObj.topLeftCircle.radius * 2))) &&
                y >= (actObj.centerLeftCircle.startY - ((actObj.topLeftCircle.radius * 2))) &&
                y <= (actObj.centerLeftCircle.startY + ((actObj.topLeftCircle.radius * 2)))) {
                this.upperCanvas.style.cursor = 'w-resize';
                break;
            }
            else if (x >= (actObj.centerRightCircle.startX - ((actObj.topLeftCircle.radius * 2))) &&
                x <= (actObj.centerRightCircle.startX + ((actObj.topLeftCircle.radius * 2))) &&
                y >= (actObj.centerRightCircle.startY - ((actObj.topLeftCircle.radius * 2))) &&
                y <= (actObj.centerRightCircle.startY + ((actObj.topLeftCircle.radius * 2)))) {
                this.upperCanvas.style.cursor = 'e-resize';
                break;
            }
            else if (x >= (actObj.bottomLeftCircle.startX - ((actObj.topLeftCircle.radius * 2))) &&
                x <= (actObj.bottomLeftCircle.startX + ((actObj.topLeftCircle.radius * 2))) &&
                y >= (actObj.bottomLeftCircle.startY - ((actObj.topLeftCircle.radius * 2))) &&
                y <= (actObj.bottomLeftCircle.startY + ((actObj.topLeftCircle.radius * 2)))) {
                this.upperCanvas.style.cursor = 'sw-resize';
                break;
            }
            else if (x >= (actObj.bottomCenterCircle.startX - ((actObj.topLeftCircle.radius * 2))) &&
                x <= (actObj.bottomCenterCircle.startX + ((actObj.topLeftCircle.radius * 2))) &&
                y >= (actObj.bottomCenterCircle.startY - ((actObj.topLeftCircle.radius * 2))) &&
                y <= (actObj.bottomCenterCircle.startY + ((actObj.topLeftCircle.radius * 2)))) {
                this.upperCanvas.style.cursor = 's-resize';
                break;
            }
            else if (x >= (actObj.bottomRightCircle.startX - ((actObj.topLeftCircle.radius * 2))) &&
                x <= (actObj.bottomRightCircle.startX + ((actObj.topLeftCircle.radius * 2))) &&
                y >= (actObj.bottomRightCircle.startY - ((actObj.topLeftCircle.radius * 2))) &&
                y <= (actObj.bottomRightCircle.startY + ((actObj.topLeftCircle.radius * 2)))) {
                this.upperCanvas.style.cursor = 'se-resize';
                break;
            }
            else if ((x >= actObj.activePoint.startX &&
                x <= actObj.activePoint.endX) && (y >= actObj.activePoint.startY &&
                y <= actObj.activePoint.endY)) {
                this.upperCanvas.style.cursor = 'move';
                break;
            }
            else {
                if (this.currObjType.isCustomCrop) {
                    this.upperCanvas.style.cursor = 'crosshair';
                }
                this.upperCanvas.style.cursor = 'default';
            }
        }
    }

    private isInside(x: number, y: number, z1: number, z2: number, z3: number, z4: number): boolean {
        const x1: number = Math.min(z1, z3);
        const x2: number = Math.max(z1, z3);
        const y1: number = Math.min(z2, z4);
        const y2: number = Math.max(z2, z4);
        if ((x1 <= x && x <= x2) && (y1 <= y && y <= y2)) {
            return true;
        } else {
            return false;
        }
    }

    private refreshDropDownBtn(isDisabled: boolean): void {
        if (isNullOrUndefined(isDisabled)) {
            return;
        }
        const annotation: HTMLElement = document.querySelector('#' + this.element.id + '_annotationBtn');
        if (!isNullOrUndefined(annotation)) {
            if (isDisabled) {
                annotation.classList.add('e-disabled');
                annotation.parentElement.classList.add('e-overlay');
            } else {
                annotation.classList.remove('e-disabled');
                annotation.parentElement.classList.remove('e-overlay');
            }
            (getComponent(annotation as HTMLElement, 'dropdown-btn') as DropDownButton).disabled = isDisabled;
        }
        const transform: HTMLElement = document.querySelector('#' + this.element.id + '_transformBtn');
        if (!isNullOrUndefined(transform)) {
            if (isDisabled) {
                transform.classList.add('e-disabled');
                transform.parentElement.classList.add('e-overlay');
            } else {
                transform.classList.remove('e-disabled');
                transform.parentElement.classList.remove('e-overlay');
            }
            (getComponent(transform as HTMLElement, 'dropdown-btn') as DropDownButton).disabled = isDisabled;
        }
        const adjustment: HTMLElement = document.querySelector('#' + this.element.id + '_adjustment');
        if (!isNullOrUndefined(adjustment)) {
            if (isDisabled) {
                adjustment.classList.add('e-disabled');
                adjustment.parentElement.classList.add('e-overlay');
            } else {
                adjustment.classList.remove('e-disabled');
                adjustment.parentElement.classList.remove('e-overlay');
            }
            (getComponent(adjustment as HTMLElement, 'btn') as Button).disabled = isDisabled;
        }
        const filter: HTMLElement = document.querySelector('#' + this.element.id + '_filter');
        if (!isNullOrUndefined(filter)) {
            if (isDisabled) {
                filter.classList.add('e-disabled');
                filter.parentElement.classList.add('e-overlay');
            } else {
                filter.classList.remove('e-disabled');
                filter.parentElement.classList.remove('e-overlay');
            }
            (getComponent(filter as HTMLElement, 'btn') as Button).disabled = isDisabled;
        }
    }

    private downloadImg(blob: string, fileName: string): void {
        const a: HTMLAnchorElement = document.createElement('a');
        a.href = blob; a.target = '_parent';
        a.download = fileName;
        (document.body || document.documentElement).appendChild(a);
        a.click(); a.parentNode.removeChild(a);
    }


    private toSVGImg(fileName?: string): string {
        showSpinner(this.element);
        this.element.style.opacity = '0.5';
        const tempCanvas: HTMLCanvasElement = this.exportChangesToCanvas();
        const dataUrl: string = tempCanvas.toDataURL();
        hideSpinner(this.element);
        this.element.style.opacity = '1';
        const svg: SVGSVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', tempCanvas.style.maxWidth); svg.setAttribute('height', tempCanvas.style.maxHeight);
        const XLinkNS: string = 'http://www.w3.org/1999/xlink';
        const img: SVGImageElement = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        img.setAttributeNS(null, 'height', tempCanvas.height.toString());
        img.setAttributeNS(null, 'width', tempCanvas.width.toString());
        img.setAttributeNS(XLinkNS, 'xlink:href', dataUrl); svg.appendChild(img);
        const prefix: string = 'data:image/svg+xml;base64,';
        const header: string = '<svg' + ' xmlns="http://www.w3.org/2000/svg"' + ' xmlns:xlink="http://www.w3.org/1999/xlink"'
         + ` width="${tempCanvas.width}"` + ` height="${tempCanvas.height}"` + '>';
        const footer: string = '</svg>'; const body: string = svg.innerHTML;
        const data: string = header + body + footer; const svgDataUrl: string = prefix + btoa(data);
        if (fileName === null) {return svgDataUrl; }
        else {
            this.downloadImg(svgDataUrl, fileName + '.' + 'svg');
            return null;
        }
    }

    private toBlobFn(fileName: string, type: string): void {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const proxy: ImageEditor = this;
        showSpinner(this.element);
        this.element.style.opacity = '0.5';
        const tempCanvas: HTMLCanvasElement = this.exportChangesToCanvas();
        // eslint-disable-next-line @typescript-eslint/tslint/config
        tempCanvas.toBlob(function(blob){
            const blobUrl: string = URL.createObjectURL(blob);
            proxy.downloadImg(blobUrl, fileName + '.' + type);
            hideSpinner(proxy.element);
            proxy.element.style.opacity = '1';
        }, 'image/png');
    }

    private exportChangesToCanvas(): HTMLCanvasElement {
        const ratio: Dimension = this.calcRatio();
        const tempContextFilter: string = this.lowerContext.filter;
        // Manipulating blur value
        if (this.lowerContext.filter !== 'none') {
            const splitWords: string[] = this.lowerContext.filter.split(' ');
            let value: number = parseFloat(splitWords[5].split('(')[1]);
            value *= ((ratio.width + ratio.height) / 2);
            splitWords[5] = 'blur(' + value + 'px)';
            this.lowerContext.filter = splitWords.join(' ');
        }
        let maxDimension: Dimension;
        const tempCanvas: HTMLCanvasElement = this.createElement('canvas', {
            id: this.element.id + '_tempCanvas', attrs: { name: 'canvasImage' }
        });
        const tempContext: CanvasRenderingContext2D = tempCanvas.getContext('2d');
        tempContext.filter = this.lowerContext.filter;
        if (isNullOrUndefined(this.currSelectionPoint)) {
            tempCanvas.width = this.baseImg.width; tempCanvas.height = this.baseImg.height;
            maxDimension = this.calcMaxDimension(this.baseImg.width, this.baseImg.height);
            tempCanvas.style.maxWidth = maxDimension.width + 'px'; tempCanvas.style.maxHeight = maxDimension.height + 'px';
            tempContext.filter = this.lowerContext.filter;
            const temp: string = this.lowerContext.filter;
            this.updateBrightnessFilter();
            tempContext.drawImage(this.baseImg, this.srcLeft, this.srcTop, this.srcWidth,
                                  this.srcHeight, 0, 0, this.baseImg.width, this.baseImg.height);
            this.lowerContext.filter = temp;
        } else {
            tempCanvas.width = this.destWidth; tempCanvas.height = this.destHeight;
            tempContext.filter = this.lowerContext.filter;
            const temp: string = this.lowerContext.filter;
            this.updateBrightnessFilter();
            tempContext.drawImage(this.baseImg, this.srcLeft, this.srcTop, this.srcWidth,
                                  this.srcHeight, 0, 0, this.destWidth, this.destHeight);
            this.lowerContext.filter = temp;
        }
        if (this.degree !== 0 || this.currFlipState !== '') {
            this.updateSaveContext(tempContext);
            this.exportTransformedImage(tempContext);
        }
        if (this.objColl.length > 0) {
            const temp: string = tempContext.filter;
            tempContext.filter = 'none';
            const tempObjColl: SelectionPoint[] = extend([], this.objColl, [], true) as SelectionPoint[];
            for (let i: number = 0; i < this.objColl.length; i++) {
                // Subtracting destination left and top points
                this.objColl[i as number].activePoint.startX -= this.destLeft; this.objColl[i as number].activePoint.startY -= this.destTop;
                this.objColl[i as number].activePoint.endX -= this.destLeft; this.objColl[i as number].activePoint.endY -= this.destTop;
                this.objColl[i as number].activePoint.width = this.objColl[i as number].activePoint.endX -
                                                              this.objColl[i as number].activePoint.startX;
                this.objColl[i as number].activePoint.height = this.objColl[i as number].activePoint.endY -
                                                               this.objColl[i as number].activePoint.startY;

                // Manipulating points
                if (isNullOrUndefined(this.currSelectionPoint)) {
                    this.objColl[i as number].activePoint.startX *= ratio.width;
                    this.objColl[i as number].activePoint.startY *= ratio.height;
                    this.objColl[i as number].activePoint.endX *= ratio.width;
                    this.objColl[i as number].activePoint.endY *= ratio.height;
                    this.objColl[i as number].activePoint.width = this.objColl[i as number].activePoint.endX -
                                                                  this.objColl[i as number].activePoint.startX;
                    this.objColl[i as number].activePoint.height = this.objColl[i as number].activePoint.endY -
                                                                   this.objColl[i as number].activePoint.startY;
                    this.objColl[i as number].strokeSettings.strokeWidth *= ((ratio.width + ratio.height) / 2);
                    if (this.objColl[i as number].shape === 'text') {
                        this.objColl[i as number].textSettings.fontSize *= ((ratio.width + ratio.height) / 2);
                    }
                }

                this.drawObject('saveContext', this.objColl[i as number], null, null, true, tempContext);
            }
            tempContext.filter = temp;
            this.refreshActiveObj();
            this.objColl = tempObjColl;
        }
        if (this.freehandCounter > 0) {
            // eslint-disable-next-line
            const tempPointColl: any = extend({}, this.pointColl, {}, true);
            for (let n: number = 0; n < this.freehandCounter; n++) {
                this.points = extend([], this.pointColl[n as number].points, []) as Point[];
                this.pointCounter = 0;
                const len: number = this.points.length;
                if (isNullOrUndefined(this.currSelectionPoint)) {
                    this.pointColl[n as number].strokeWidth *= ((ratio.width + ratio.height) / 2);
                    for (let l: number = 0; l < len; l++) {
                        this.points[l as number].x = (this.points[l as number].x - this.destLeft) * ratio.width;
                        this.points[l as number].y = (this.points[l as number].y - this.destTop) * ratio.height;
                    }
                } else {
                    for (let l: number = 0; l < len; l++) {
                        this.points[l as number].x -= this.destLeft;
                        this.points[l as number].y -= this.destTop;
                    }
                }
            }
            this.freehandRedraw(tempContext);
            this.pointColl = tempPointColl;
        }
        if (this.isCircleCrop) {
            this.cropCircle(tempContext, true);
        }
        this.lowerContext.filter = tempContextFilter;
        return tempCanvas;
    }

    private exportTransformedImage(tempContext: CanvasRenderingContext2D): void {
        const degree: number = this.degree;
        for (let i: number = 0; i < this.rotateFlipColl.length; i++) {
            if (typeof(this.rotateFlipColl[i as number]) === 'number') {
                this.exportRotate(tempContext, this.rotateFlipColl[i as number]);
            } else if (this.rotateFlipColl[i as number] === 'horizontal') {
                this.exportHorizontalFlip(tempContext);
            } else if (this.rotateFlipColl[i as number] === 'vertical') {
                this.exportVerticalFlip(tempContext);
            }
        }
        this.degree = degree;
    }

    private exportRotate(tempContext: CanvasRenderingContext2D, degree: number): void {
        if (isNullOrUndefined(this.currSelectionPoint)) {
            this.setMaximumDimension(this.degree, tempContext.canvas);
            tempContext.translate(tempContext.canvas.width / 2, tempContext.canvas.height / 2);
            tempContext.rotate(Math.PI / 180 * degree);
            tempContext.drawImage(this.inMemoryCanvas, this.srcLeft, this.srcTop, this.srcWidth,
                                  this.srcHeight, -tempContext.canvas.height / 2, -tempContext.canvas.width / 2,
                                  tempContext.canvas.height, tempContext.canvas.width);
        } else {
            tempContext.translate(tempContext.canvas.width / 2, tempContext.canvas.height / 2);
            tempContext.rotate(Math.PI / 180 * degree);
            tempContext.drawImage(this.inMemoryCanvas, -tempContext.canvas.height / 2, -tempContext.canvas.width / 2,
                                  tempContext.canvas.height, tempContext.canvas.width);
        }
        this.updateSaveContext(tempContext);
    }

    private exportHorizontalFlip(tempContext: CanvasRenderingContext2D): void {
        tempContext.translate(tempContext.canvas.width, 0);
        tempContext.scale(-1, 1);
        tempContext.drawImage(this.inMemoryCanvas, 0, 0);
        this.updateSaveContext(tempContext);
    }

    private exportVerticalFlip(tempContext: CanvasRenderingContext2D): void {
        tempContext.translate(0, tempContext.canvas.height);
        tempContext.scale(1, -1);
        tempContext.drawImage(this.inMemoryCanvas, 0, 0);
        this.updateSaveContext(tempContext);
    }

    private updateSaveContext(tempContext: CanvasRenderingContext2D): void {
        tempContext.setTransform(1, 0, 0, 1, 0, 0);
        const imageData: ImageData = tempContext.getImageData(0, 0, tempContext.canvas.width, tempContext.canvas.height);
        this.inMemoryCanvas.width = imageData.width; this.inMemoryCanvas.height = imageData.height;
        this.inMemoryContext.putImageData(imageData, 0, 0);
    }

    private addLetter(letter: string): void {
        if (this.textArea.style.display === 'none' && (this.currObjType.isText || this.activeObj.shape === 'text')) {
            if (letter === 'Backspace') {
                this.keyHistory = this.keyHistory.slice(0, -1);
            } else {this.keyHistory += letter; }
            this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
            this.updateFontStyles();
            const width: number = this.upperContext.measureText(this.keyHistory + this.tempKeyHistory).width
            + this.activeObj.textSettings.fontSize * 0.5;
            const height: number = this.activeObj.textSettings.fontSize + this.activeObj.textSettings.fontSize * 0.25;
            this.upperContext.fillText(this.keyHistory + this.tempKeyHistory, this.activeObj.activePoint.startX,
                                       this.activeObj.activePoint.startY +
                                       this.activeObj.textSettings.fontSize);
            this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
            this.currObjType.isText = true;
            this.setActivePoint(width, height);
        }
    }

    private updateFontStyles(isTextBox?: boolean): void {
        this.upperContext.strokeStyle = this.activeObj.strokeSettings.strokeColor;
        this.upperContext.fillStyle = this.activeObj.strokeSettings.strokeColor;
        let textStyle: string = '';
        if (this.activeObj.textSettings.bold) {textStyle = 'bold '; }
        if (this.activeObj.textSettings.italic) {textStyle = 'italic '; }
        if (this.activeObj.textSettings.bold && this.activeObj.textSettings.italic) {textStyle = 'italic bold '; }
        const fontSize: number = isTextBox ? parseFloat(this.textArea.style.fontSize) : this.activeObj.textSettings.fontSize;
        const fontFamily: string = this.textArea.style.display === 'block' ? this.textArea.style.fontFamily : this.activeObj.textSettings.fontFamily;
        this.upperContext.font = textStyle + fontSize + 'px' + ' ' + fontFamily;
    }

    private textFlipDegree(canvasDraw: CanvasRenderingContext2D, startX: number, startY: number): void {
        const rows: string[] = this.activeObj.keyHistory.split('\n');
        const height: number = this.activeObj.textSettings.fontSize;
        const lineHeight: number = ((height * rows.length) - (this.activeObj.textSettings.fontSize * rows.length)) / rows.length;
        let yPoint: number = (this.activeObj.textSettings.fontSize * 0.85) + lineHeight;
        for (let i: number = 0; i < rows.length; i++) {
            const text: string = rows[i as number];
            if (i > 0) {
                if (i === 1) {
                    yPoint -= (this.activeObj.textSettings.fontSize * 0.85);
                }
                yPoint += this.activeObj.textSettings.fontSize + this.activeObj.textSettings.fontSize * 0.15;
            }
            canvasDraw.fillText(text, startX + this.activeObj.textSettings.fontSize * 0.15, startY +
                yPoint + (i > 0 ? this.activeObj.textSettings.fontSize * 0.25 : -this.activeObj.textSettings.fontSize * 0.35));
        }
    }

    private rotateText(canvasDraw: CanvasRenderingContext2D): void {
        let startX: number = this.activeObj.activePoint.startX;
        let startY: number = this.activeObj.activePoint.startY;
        let degree: number;
        if (this.activeObj.shapeDegree === 0) {
            degree = this.degree;
        }
        else {
            degree = this.degree - this.activeObj.shapeDegree;
        }
        if (degree < 0) {
            degree = 360 + degree;
        }
        if (degree % 360 === 0 && (this.degree !== -360 || this.currFlipState === '')) {
            startX = this.activeObj.activePoint.startX + this.activeObj.textSettings.fontSize * 0.15;
            startY = this.activeObj.activePoint.startY + (this.activeObj.activePoint.endY - this.activeObj.activePoint.startY);
            const rows: string[] = this.activeObj.keyHistory.split('\n');
            for (let i: number = 0; i < rows.length; i++) {
                startY = this.activeObj.activePoint.startY + (i * this.activeObj.textSettings.fontSize +
                    this.activeObj.textSettings.fontSize * 0.25);
                canvasDraw.fillText(rows[i as number], startX, startY);
            }
        }
        else if (degree % 90 === 0 && degree % 180 !== 0) {
            canvasDraw.translate(this.lowerCanvas.width / 2, this.lowerCanvas.height / 2);
            canvasDraw.rotate(Math.PI / 180 * degree);
            canvasDraw.translate(-this.lowerCanvas.height / 2, -this.lowerCanvas.width / 2);
            if (degree % 90 === 0 && degree % 270 !== 0) {
                startY = (this.lowerCanvas.width - this.activeObj.activePoint.endX) + this.activeObj.textSettings.fontSize * 0.4;
                startX = this.activeObj.activePoint.startY;
            }
            else if (degree % 270 === 0) {
                startX = this.lowerCanvas.height - this.activeObj.activePoint.endY;
                startY = this.activeObj.activePoint.startX + this.activeObj.textSettings.fontSize * 0.4;
            }
            this.textFlipDegree(canvasDraw, startX, startY);
            canvasDraw.translate(this.lowerCanvas.height / 2, this.lowerCanvas.width / 2);
            canvasDraw.rotate(Math.PI / 180 * -degree);
            canvasDraw.translate(-this.lowerCanvas.width / 2, -this.lowerCanvas.height / 2);
        }
        else {
            canvasDraw.translate(this.lowerCanvas.width / 2, this.lowerCanvas.height / 2);
            canvasDraw.rotate(Math.PI / 180 * degree);
            startX = this.lowerCanvas.width - this.activeObj.activePoint.endX;
            startY = (this.lowerCanvas.height - this.activeObj.activePoint.endY) + this.activeObj.textSettings.fontSize * 0.4;
            canvasDraw.translate(-this.lowerCanvas.width / 2, -this.lowerCanvas.height / 2);
            this.textFlipDegree(canvasDraw, startX, startY);
            canvasDraw.translate(this.lowerCanvas.width / 2, this.lowerCanvas.height / 2);
            canvasDraw.rotate(Math.PI / 180 * -degree);
            canvasDraw.translate(-this.lowerCanvas.width / 2, -this.lowerCanvas.height / 2);
        }
        if (this.degree === 360 || this.degree === -360) {
            this.degree = 0;
        }
    }

    private redrawObj(degree?: number | string): void {
        if (this.objColl.length > 0) {
            if (degree === 'horizontal' || degree === 'vertical' || degree === 'Horizontal' || degree === 'Vertical' ||
                degree === 'horizontalVertical' || degree === 'verticalHorizontal') {
                this.updateCurrentActiveObjPoint(degree.toLowerCase());
            } else if (typeof(degree) === 'number') {
                this.updateCurrentActiveObjPoint(degree);
                const tempFilter: string = this.lowerContext.filter;
                this.lowerContext.filter = this.getDefaultFilter();
                for (let i: number = 0; i < this.objColl.length; i++) {
                    const splitWords: string[] = this.objColl[i as number].shape.split('-');
                    if (splitWords[0] !== 'crop') {
                        this.apply(this.objColl[i as number].shape, this.objColl[i as number]);
                    }
                }
                this.lowerContext.filter = tempFilter;
            }
        }
    }

    private updateCurrentActiveObjPoint(degree: number | string): void {
        let currActObjIndex: number;
        for (let index: number = 0; index < this.objColl.length; index++) {
            if (this.activeObj.shape === this.objColl[index as number].shape &&
                this.activeObj.activePoint.startX === this.objColl[index as number].activePoint.startX &&
                this.activeObj.activePoint.startY === this.objColl[index as number].activePoint.startY &&
                this.activeObj.activePoint.endX === this.objColl[index as number].activePoint.endX &&
                this.activeObj.activePoint.endY === this.objColl[index as number].activePoint.endY &&
                this.activeObj.currIndex === this.objColl[index as number].currIndex) {
                currActObjIndex = index;
                break;
            }
        }
        if (degree === 'horizontal' || degree === 'vertical' || degree === 'Horizontal' || degree === 'Vertical' ||
            degree === 'horizontalvertical' || degree === 'verticalhorizontal') {
            if (degree === 'horizontal' || degree === 'Horizontal') {
                for (let i: number = 0; i < this.objColl.length; i++) {
                    if (this.objColl[i as number].shapeFlip !== this.currFlipState) {
                        if (this.objColl[i as number].activePoint.startX <= this.destLeft + (this.destWidth / 2)) {
                            this.objColl[i as number].activePoint.endX = (this.destLeft + this.destWidth) -
                                                                         (this.objColl[i as number].activePoint.startX - this.destLeft);
                            this.objColl[i as number].activePoint.startX = this.objColl[i as number].activePoint.endX -
                                                                           this.objColl[i as number].activePoint.width;
                            this.updateActiveObject(this.objColl[i as number].activePoint, this.objColl[i as number]);
                        } else if (this.objColl[i as number].activePoint.startX >= this.destLeft + (this.destWidth / 2)) {
                            this.objColl[i as number].activePoint.startX = this.destLeft + (this.destLeft + this.destWidth -
                                                                           this.objColl[i as number].activePoint.endX);
                            this.objColl[i as number].activePoint.endX = this.objColl[i as number].activePoint.startX +
                                                                         this.objColl[i as number].activePoint.width;
                            this.updateActiveObject(this.objColl[i as number].activePoint, this.objColl[i as number]);
                        }
                        this.objColl[i as number].imageRatio = {startX: ((this.objColl[i as number].activePoint.startX -
                                                                         this.destLeft) / this.destWidth),
                        startY: ((this.objColl[i as number].activePoint.startY - this.destTop) / this.destHeight),
                        endX: ((this.objColl[i as number].activePoint.endX - this.destLeft) / this.destWidth),
                        endY: ((this.objColl[i as number].activePoint.endY - this.destTop) / this.destHeight),
                        width: this.destWidth / this.objColl[i as number].activePoint.width,
                        height: this.destHeight / this.objColl[i as number].activePoint.height };
                        this.objColl[i as number].shapeFlip = this.currFlipState;
                    }
                }
            }
            else if (degree === 'vertical' || degree === 'Vertical') {
                for (let i: number = 0; i < this.objColl.length; i++) {
                    if (this.objColl[i as number].shapeFlip !== this.currFlipState) {
                        if (this.objColl[i as number].activePoint.startY <= this.destTop + (this.destHeight / 2)) {
                            this.objColl[i as number].activePoint.endY = (this.destTop + this.destHeight) -
                            (this.objColl[i as number].activePoint.startY - this.destTop);
                            this.objColl[i as number].activePoint.startY = this.objColl[i as number].activePoint.endY -
                            this.objColl[i as number].activePoint.height;
                            this.updateActiveObject(this.objColl[i as number].activePoint, this.objColl[i as number]);
                        } else if (this.objColl[i as number].activePoint.startY >= this.lowerCanvas.height / 2) {
                            this.objColl[i as number].activePoint.startY = this.destTop + (this.destTop + this.destHeight -
                            this.objColl[i as number].activePoint.endY);
                            this.objColl[i as number].activePoint.endY = this.objColl[i as number].activePoint.startY +
                            this.objColl[i as number].activePoint.height;
                            this.updateActiveObject(this.objColl[i as number].activePoint, this.objColl[i as number]);
                        }
                        this.objColl[i as number].imageRatio = {startX: ((this.objColl[i as number].activePoint.startX -
                                                                          this.destLeft) / this.destWidth),
                        startY: ((this.objColl[i as number].activePoint.startY - this.destTop) / this.destHeight),
                        endX: ((this.objColl[i as number].activePoint.endX - this.destLeft) / this.destWidth),
                        endY: ((this.objColl[i as number].activePoint.endY - this.destTop) / this.destHeight),
                        width: this.destWidth / this.objColl[i as number].activePoint.width,
                        height: this.destHeight / this.objColl[i as number].activePoint.height };
                        this.objColl[i as number].shapeFlip = this.currFlipState;
                    }
                }
            }
            else if (degree === 'verticalhorizontal' || degree === 'horizontalvertical') {
                for (let i: number = 0; i < this.objColl.length; i++) {
                    if (this.objColl[i as number].shapeFlip !== this.currFlipState) {
                        if (this.objColl[i as number].activePoint.startX <= this.destLeft + (this.destWidth / 2)) {
                            this.objColl[i as number].activePoint.endX = (this.destLeft + this.destWidth) -
                                                                         (this.objColl[i as number].activePoint.startX - this.destLeft);
                            this.objColl[i as number].activePoint.startX = this.objColl[i as number].activePoint.endX -
                                                                           this.objColl[i as number].activePoint.width;
                            this.updateActiveObject(this.objColl[i as number].activePoint, this.objColl[i as number]);
                        } else if (this.objColl[i as number].activePoint.startX >= this.destLeft + (this.destWidth / 2)) {
                            this.objColl[i as number].activePoint.startX = this.destLeft + (this.destLeft + this.destWidth -
                                                                           this.objColl[i as number].activePoint.endX);
                            this.objColl[i as number].activePoint.endX = this.objColl[i as number].activePoint.startX +
                                                                         this.objColl[i as number].activePoint.width;
                            this.updateActiveObject(this.objColl[i as number].activePoint, this.objColl[i as number]);
                        }
                        if (this.objColl[i as number].activePoint.startY <= this.destTop + (this.destHeight / 2)) {
                            this.objColl[i as number].activePoint.endY = (this.destTop + this.destHeight) -
                            (this.objColl[i as number].activePoint.startY - this.destTop);
                            this.objColl[i as number].activePoint.startY = this.objColl[i as number].activePoint.endY -
                            this.objColl[i as number].activePoint.height;
                            this.updateActiveObject(this.objColl[i as number].activePoint, this.objColl[i as number]);
                        } else if (this.objColl[i as number].activePoint.startY >= this.lowerCanvas.height / 2) {
                            this.objColl[i as number].activePoint.startY = this.destTop + (this.destTop + this.destHeight -
                            this.objColl[i as number].activePoint.endY);
                            this.objColl[i as number].activePoint.endY = this.objColl[i as number].activePoint.startY +
                            this.objColl[i as number].activePoint.height;
                            this.updateActiveObject(this.objColl[i as number].activePoint, this.objColl[i as number]);
                        }
                        this.objColl[i as number].imageRatio = {startX: ((this.objColl[i as number].activePoint.startX -
                                                                          this.destLeft) / this.destWidth),
                        startY: ((this.objColl[i as number].activePoint.startY - this.destTop) / this.destHeight),
                        endX: ((this.objColl[i as number].activePoint.endX - this.destLeft) / this.destWidth),
                        endY: ((this.objColl[i as number].activePoint.endY - this.destTop) / this.destHeight),
                        width: this.destWidth / this.objColl[i as number].activePoint.width,
                        height: this.destHeight / this.objColl[i as number].activePoint.height };
                        this.objColl[i as number].shapeFlip = this.currFlipState;
                    }
                }
            }
            if (currActObjIndex !== undefined) {
                this.activeObj = extend({}, this.objColl[currActObjIndex as number], {}, true) as SelectionPoint;
            }
        }
        else if (degree === 90) {
            this.rotateObjColl();
        }
        else if (degree === -90) {
            for (let i: number = 0; i < 3; i++) {
                this.rotateObjColl();
            }
        } else if (typeof(degree) === 'number') {
            if (degree > 0) {
                this.rotateObjColl();
            } else {
                for (let i: number = 0; i < 3; i++) {
                    this.rotateObjColl();
                }
            }
        }
    }

    private rotateObjColl(): void {
        for (let i: number = 0; i < this.objColl.length; i++) {
            this.objColl[i as number].activePoint.startY = this.destTop + (this.destHeight * this.objColl[i as number].imageRatio.startX);
            this.objColl[i as number].activePoint.endY = this.destTop + (this.destHeight * this.objColl[i as number].imageRatio.endX);
            this.objColl[i as number].activePoint.startX = (this.destLeft + this.destWidth) -
            (this.destWidth * this.objColl[i as number].imageRatio.endY);
            this.objColl[i as number].activePoint.endX = (this.destLeft + this.destWidth) -
            (this.destWidth * this.objColl[i as number].imageRatio.startY);
            this.objColl[i as number].activePoint.width = this.objColl[i as number].activePoint.endX -
            this.objColl[i as number].activePoint.startX;
            this.objColl[i as number].activePoint.height = this.objColl[i as number].activePoint.endY -
            this.objColl[i as number].activePoint.startY;
            this.updateFontSize(this.objColl[i as number]);
        }
        for (let i: number = 0; i < this.objColl.length; i++) {
            this.updateActiveObject(this.objColl[i as number].activePoint, this.objColl[i as number]);
        }
        // Update current image ratio for all objects
        for (let i: number = 0; i < this.objColl.length; i++) {
            this.objColl[i as number].imageRatio = {startX: ((this.objColl[i as number].activePoint.startX -
                                                              this.destLeft) / this.destWidth),
            startY: ((this.objColl[i as number].activePoint.startY - this.destTop) / this.destHeight),
            endX: ((this.objColl[i as number].activePoint.endX - this.destLeft) / this.destWidth),
            endY: ((this.objColl[i as number].activePoint.endY - this.destTop) / this.destHeight),
            width: this.destWidth / this.objColl[i as number].activePoint.width,
            height: this.destHeight / this.objColl[i as number].activePoint.height };
        }
    }

    private setTextFontSize(obj: SelectionPoint): void {
        if (obj.shape === 'text') {
            const maxText: string = this.getMaxText(null, obj.keyHistory);
            let degree: number;
            if (obj.shapeDegree === 0) {degree = this.degree; }
            else {degree =  this.degree - obj.shapeDegree; }
            let multiplier: number = 2;
            if (maxText.length === 1) {
                multiplier = 1;
            }
            if (degree === 0 || degree === 180 || degree === -180) {
                obj.textSettings.fontSize = (obj.activePoint.width / maxText.length) * multiplier;
            } else {
                obj.textSettings.fontSize = (obj.activePoint.height / maxText.length) * multiplier;
            }
        }
    }

    private redrawShape(obj: SelectionPoint): void {
        for (let i: number = 0; i < this.objColl.length; i++) {
            if (JSON.stringify(obj) === JSON.stringify(this.objColl[i as number])) {
                this.objColl.splice(i, 1);
                break;
            }
        }
        this.upperContext.clearRect(0, 0 , this.upperCanvas.width, this.upperCanvas.height);
        if (this.isPreventDragging) {
            if (this.activeObj.activePoint.startX > this.destLeft) {this.isPreventDragging = false; }
            this.drawObject('duplicate', null, null, null, true);
        }
        else {this.drawObject('duplicate', null, null, null, true); }
    }

    private applyActObj(): void {
        let isActObj: boolean = false;
        if (this.activeObj.shape !== undefined && this.activeObj.shape === 'text' && this.activeObj.keyHistory === '') {
            this.refreshActiveObj();
            this.upperContext.clearRect(0, 0 , this.upperCanvas.width, this.upperCanvas.height);
        } else {
            let splitWords: string[]; let isCropSelection: boolean = false;
            if (this.activeObj.shape !== undefined) {splitWords = this.activeObj.shape.split('-'); }
            if (splitWords === undefined && this.currObjType.isCustomCrop) {
                isCropSelection = true;
            } else if (splitWords !== undefined && splitWords[0] === 'crop'){
                isCropSelection = true;
            }
            if (!isNullOrUndefined(this.activeObj.shape) && !isCropSelection) {
                for (let i: number = 0; i < this.objColl.length; i++) {
                    if (JSON.stringify(this.activeObj) === JSON.stringify(this.objColl[i as number])) {
                        isActObj = true;
                        break;
                    }
                }
                if (!isActObj) {
                    if (isNullOrUndefined(this.activeObj.currIndex)) {
                        this.activeObj.currIndex = 'shape_' + (this.objColl.length + 1);
                    }
                    this.updateImageRatioForActObj();
                    const splitWords: string[] = this.activeObj.currIndex.split('_');
                    let tempObjColl: SelectionPoint[] = this.objColl.splice(0, parseInt(splitWords[1], 10) - 1);
                    tempObjColl.push(extend({}, this.activeObj, {}, true) as SelectionPoint);
                    for (let i: number = 0; i < this.objColl.length; i++) {
                        tempObjColl.push(this.objColl[i as number]);
                    }
                    this.objColl = tempObjColl;
                    tempObjColl = []; this.refreshActiveObj();
                    this.lowerContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
                    this.redrawImgWithObj();
                    //this.zoomFreehandDrawColl();
                    this.clearOuterCanvas(this.lowerContext); this.clearOuterCanvas(this.upperContext);
                    this.currObjType.shape = '';
                    this.refreshActiveObj();
                    if (this.isCircleCrop) {
                        this.cropCircle(this.lowerContext);
                    }
                }
            }
        }
    }

    private apply(shape?: string, obj?: SelectionPoint, canvas?: string): void {
        if (!this.disabled) {
            if ((this.togglePen) && !this.currObjType.isCustomCrop) {
                const destLeft: number = this.destLeft; const destTop: number = this.destTop;
                const destWidth: number = this.destWidth; const destHeight: number = this.destHeight;
                this.callUpdateCurrentTransformedState();
                const temp: string = this.lowerContext.filter;
                this.lowerContext.filter = 'none';
                this.togglePen = false;
                this.iterateObjColl();
                this.freehandRedraw(this.lowerContext); this.togglePen = false;
                if (this.isCircleCrop || (!isNullOrUndefined(this.currSelectionPoint) && this.currSelectionPoint.shape === 'crop-circle')) {
                    this.cropCircle(this.lowerContext);
                }
                this.destLeft = destLeft; this.destTop = destTop; this.destWidth = destWidth; this.destHeight = destHeight;
                this.lowerContext.filter = temp;
            }
            else {
                canvas = canvas ? canvas : 'original';
                this.currObjType.shape = shape !== undefined ? shape : this.currObjType.shape;
                if (this.currObjType.shape !== '') {
                    this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
                    this.drawObject(canvas, obj);
                    this.activeObj.shape = this.currObjType.shape.toLowerCase();
                    if (!shape && this.currObjType.shape !== '' && !this.currObjType.isCustomCrop) {
                        this.objColl.push(extend({}, this.activeObj, {}, true) as SelectionPoint);
                    }
                    this.keyHistory = '';
                }
            }
        }
    }

    private setCenterPoints(text?: boolean, width?: number, height?: number): void {
        let renderWidth: number; let renderHeight: number;
        if (text && width && height) {
            renderWidth = width; renderHeight = height;
        } else {
            renderWidth = this.activeObj.activePoint.width; renderHeight = this.activeObj.activePoint.height;
        }
        this.activeObj.activePoint.startX = (this.lowerCanvas.width / 2) - renderWidth / 2;
        this.activeObj.activePoint.startY = (this.lowerCanvas.height / 2) - renderHeight / 2;
        this.activeObj.activePoint.endX = (this.lowerCanvas.width / 2) + renderWidth / 2;
        this.activeObj.activePoint.endY = (this.lowerCanvas.height / 2) + renderHeight / 2;
        if (text && width && height) {
            this.textStartPoints.x = this.activeObj.activePoint.startX;
            this.textStartPoints.y = this.activeObj.activePoint.startY;
        }
    }

    private drawShape(type: string, strokeWidth?: number, strokeColor?: string, fillColor?: string, start?: Point, width?: number,
                      height?: number): void {
        if (!this.disabled && this.isImageLoaded) {
            this.redrawActObj();
            const objColl: SelectionPoint[] = extend([], this.objColl, [], true) as SelectionPoint[];
            this.togglePen = false;
            this.keyHistory = '';
            this.upperCanvas.style.display = 'block';
            this.refreshActiveObj();
            this.currObjType.shape = type;
            if (this.currObjType.shape.toLowerCase() !== 'freehanddraw' && this.currObjType.shape.toLowerCase() !== '') {
                this.activeObj.shape = this.currObjType.shape.toLowerCase();
                this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
                if (isNullOrUndefined(this.activeObj.strokeSettings)) {
                    this.activeObj.strokeSettings = this.strokeSettings;
                }
                this.activeObj.strokeSettings.strokeWidth = strokeWidth ? strokeWidth : this.activeObj.strokeSettings.strokeWidth;
                this.activeObj.strokeSettings.strokeColor = strokeColor ? strokeColor : this.activeObj.strokeSettings.strokeColor;
                this.activeObj.strokeSettings.fillColor = fillColor ? fillColor : this.activeObj.strokeSettings.fillColor;
                const tempWidth: number = this.destWidth > 100 ? 100 : this.destWidth / 2;
                const tempHeight: number = this.destHeight > 100 ? 100 : this.destHeight / 2;
                this.activeObj.activePoint.width = tempWidth; this.activeObj.activePoint.height = tempHeight;
                if (this.currObjType.shape.toLowerCase() === 'line') {
                    this.activeObj.lineDraw = 'horizontal';
                    this.activeObj.activePoint.height /= 2;
                } else if (this.currObjType.shape.toLowerCase() === 'rectangle') {
                    this.activeObj.activePoint.width += this.activeObj.activePoint.width / 2;
                }
                if (this.currObjType.shape.toLowerCase() === 'ellipse' && width) {
                    this.activeObj.activePoint.width = 2 * width;
                    this.activeObj.activePoint.height = 2 * height;
                }
                if (width && height) {
                    this.activeObj.activePoint.width = width; this.activeObj.activePoint.height = height;
                }
                if (!isNullOrUndefined(start)) {
                    this.activeObj.activePoint.startX = start.x; this.activeObj.activePoint.startY = start.y;
                    this.activeObj.activePoint.endX = this.activeObj.activePoint.startX + this.activeObj.activePoint.width;
                    this.activeObj.activePoint.endY = this.activeObj.activePoint.startY + this.activeObj.activePoint.height;
                } else {
                    this.setCenterPoints();
                }
                this.currObjType.isDragging = this.currObjType.isCustomCrop = false;
                this.activeObj.shapeDegree = this.degree;
                this.activeObj.shapeFlip = this.currFlipState;
                this.activeObj.flipObjColl = [];
                const shapeSettings: ShapeSettings = this.updatePreviousShapeSettings();
                const shapeChangingArgs: ShapeChangeEventArgs = {action: 'insert', previousShapeSettings: shapeSettings,
                    currentShapeSettings: shapeSettings};
                this.trigger('shapeChanging', shapeChangingArgs);
                this.updateShapeChangeEventArgs(shapeChangingArgs.currentShapeSettings);
                this.drawObject('duplicate');
                this.isShapeInserted = true;
                this.updateUndoRedoObj(objColl);
                this.refreshToolbar('shapes');
            }
        }
    }

    private drawShapeText(text?: string, fontFamily?: string, fontSize?: number, bold?: boolean, italic?: boolean,
                          strokeColor?: string, x?: number, y?: number): void {
        if (!this.disabled && this.isImageLoaded) {
            if (this.currObjType.shape === 'freehanddraw') {
                this.apply(); this.upperCanvas.style.cursor = 'default';
                this.currObjType.shape = '';
            }
            this.togglePen = false;
            this.redrawActObj();
            const objColl: SelectionPoint[] = extend([], this.objColl, [], true) as SelectionPoint[];
            this.keyHistory = '';
            this.refreshActiveObj();
            this.activeObj.shape = 'text';
            this.currObjType.isCustomCrop = false;
            this.currObjType.isText = this.currObjType.isInitialText = true;
            this.upperCanvas.style.display = 'block';
            this.currObjType.shape = this.activeObj.shape = 'text';
            if (isNullOrUndefined(this.activeObj.textSettings)) {
                this.activeObj.textSettings = this.textSettings;
            }
            if (isNullOrUndefined(this.activeObj.strokeSettings)) {
                this.activeObj.strokeSettings = this.strokeSettings;
            }
            this.activeObj.strokeSettings.strokeColor = strokeColor ? strokeColor : this.activeObj.strokeSettings.strokeColor;
            this.activeObj.textSettings.text = text ? text : this.activeObj.textSettings.text;
            this.activeObj.textSettings.fontFamily = fontFamily ? fontFamily : this.activeObj.textSettings.fontFamily;
            this.activeObj.textSettings.text = text ? text : this.activeObj.textSettings.text;
            this.activeObj.textSettings.fontFamily = fontFamily ? fontFamily : this.activeObj.textSettings.fontFamily;
            this.activeObj.textSettings.fontSize = fontSize ? fontSize : this.activeObj.textSettings.fontSize;
            this.activeObj.textSettings.bold = bold ? bold : this.activeObj.textSettings.bold;
            this.activeObj.textSettings.italic = italic ? italic : this.activeObj.textSettings.italic;
            if (isNullOrUndefined(this.activeObj.textSettings.fontSize)) {
                if (this.lowerCanvas.width > this.lowerCanvas.height) {
                    this.activeObj.textSettings.fontSize = Math.floor((this.lowerCanvas.width / 20));
                }
                else {
                    this.activeObj.textSettings.fontSize = Math.floor((this.lowerCanvas.height / 20));
                }
                if (this.activeObj.textSettings.fontSize < 20) {
                    this.activeObj.textSettings.fontSize = 20;
                }
            }
            if (this.destWidth < 100) {
                this.activeObj.textSettings.fontSize = Math.floor((this.destWidth / 20));
            } else if (this.destHeight < 100) {
                this.activeObj.textSettings.fontSize = Math.floor((this.destHeight / 20));
            }
            this.activeObj.shapeDegree = this.degree; this.activeObj.shapeFlip = this.currFlipState;
            this.activeObj.flipObjColl = [];
            this.updateFontStyles();
            const width: number = this.upperContext.measureText(this.activeObj.textSettings.text).width +
            this.activeObj.textSettings.fontSize * 0.5;
            const height: number = this.activeObj.textSettings.fontSize + this.activeObj.textSettings.fontSize * 0.25;
            if (!isNullOrUndefined(x) && !isNullOrUndefined(y)) {
                this.activeObj.activePoint.startX = x; this.activeObj.activePoint.startY = y;
                this.activeObj.activePoint.endX = this.activeObj.activePoint.startX + width;
                this.activeObj.activePoint.endY = this.activeObj.activePoint.startY + height;
            } else {
                this.setCenterPoints(true, width, height);
            }
            const shapeSettings: ShapeSettings = this.updatePreviousShapeSettings();
            const shapeChangingArgs: ShapeChangeEventArgs = {action: 'insert', previousShapeSettings: shapeSettings,
                currentShapeSettings: shapeSettings};
            this.trigger('shapeChanging', shapeChangingArgs);
            this.updateShapeChangeEventArgs(shapeChangingArgs.currentShapeSettings);
            this.addLetter(this.activeObj.textSettings.text);
            this.activeObj.textFlip = this.currFlipState;
            this.updateFontRatio(this.activeObj);
            this.objColl.push(this.activeObj);
            this.undoRedoColl.push({operation: 'shapeTransform', value: null,
                currentObj: extend([], this.objColl, [], true) as SelectionPoint[], previousObj: objColl, zoomFactor: this.zoomFactor,
                sharpen: this.adjustmentLevel.sharpen, bw: this.adjustmentLevel.bw});
            this.undoRedoStep++;
            this.redrawShape(this.objColl[this.objColl.length - 1]);
            this.isShapeInserted = true;
            this.refreshToolbar('text');
        }
    }

    private updateShapeChangeEventArgs(shapeSettings: ShapeSettings): void {
        this.activeObj.currIndex = shapeSettings.id;
        this.activeObj.activePoint.startX = shapeSettings.startX;
        this.activeObj.activePoint.startY = shapeSettings.startY;
        this.activeObj.activePoint.width = shapeSettings.width;
        this.activeObj.activePoint.height = shapeSettings.height;
        this.activeObj.strokeSettings.strokeColor = shapeSettings.strokeColor;
        this.activeObj.strokeSettings.fillColor = shapeSettings.fillColor;
        this.activeObj.shape === 'ellipse' ? this.activeObj.activePoint.width = shapeSettings.radius / 2 : null;
        this.activeObj.shape === 'line' ? this.activeObj.activePoint.width = shapeSettings.length : null;
        this.activeObj.shape === 'text' ? this.activeObj.keyHistory = shapeSettings.text : null;
        this.activeObj.shape === 'text' ? this.activeObj.textSettings.fontSize = shapeSettings.fontSize : null;
        this.activeObj.shape === 'text' ? this.activeObj.strokeSettings.strokeColor = shapeSettings.color : null;
        if (this.activeObj.shape === 'text' && !isNullOrUndefined(this.activeObj.textSettings)) {
            for (let i: number = 0; i < shapeSettings.fontStyle.length; i++) {
                if (shapeSettings.fontStyle[i as number] === 'bold') {
                    this.activeObj.textSettings.bold = true;
                } else if (shapeSettings.fontStyle[i as number] === 'italic') {
                    this.activeObj.textSettings.italic = true;
                } else if (shapeSettings.fontStyle[i as number] === 'underline') {
                    this.activeObj.textSettings.underline = true;
                }
            }
        }
    }

    private getObjDetails(obj: SelectionPoint): ShapeSettings {
        const shapeDetails: ShapeSettings = {} as ShapeSettings;
        shapeDetails.id = obj.currIndex;
        shapeDetails.type = this.toPascalCase(obj.shape) as ShapeType;
        shapeDetails.startX = obj.activePoint.startX;
        shapeDetails.startY = obj.activePoint.startY;
        if (obj.shape === 'rectangle') {
            shapeDetails.width = obj.activePoint.width;
            shapeDetails.height = obj.activePoint.height;
            shapeDetails.strokeColor = obj.strokeSettings.strokeColor;
            shapeDetails.fillColor = obj.strokeSettings.fillColor;
            shapeDetails.strokeWidth = obj.strokeSettings.strokeWidth;
        } else if (obj.shape === 'ellipse') {
            shapeDetails.radius = obj.activePoint.width / 2;
            shapeDetails.strokeColor = obj.strokeSettings.strokeColor;
            shapeDetails.fillColor = obj.strokeSettings.fillColor;
            shapeDetails.strokeWidth = obj.strokeSettings.strokeWidth;
        } else if (obj.shape === 'line') {
            shapeDetails.length = obj.activePoint.width;
            shapeDetails.strokeColor = obj.strokeSettings.strokeColor;
            shapeDetails.strokeWidth = obj.strokeSettings.strokeWidth;
        } else if (obj.shape === 'text') {
            shapeDetails.text = obj.keyHistory;
            shapeDetails.fontSize = obj.textSettings.fontSize;
            shapeDetails.color = obj.strokeSettings.strokeColor;
            shapeDetails.fontStyle = [];
            if (obj.textSettings.bold) {
                shapeDetails.fontStyle.push('bold');
            }
            if (obj.textSettings.italic) {
                shapeDetails.fontStyle.push('italic');
            }
        }
        return shapeDetails;
    }

    private getFreehandDrawDetails(index: number): ShapeSettings {
        const shapeDetails: ShapeSettings = {} as ShapeSettings;
        shapeDetails.id = this.pointColl[index].id;
        shapeDetails.type = 'FreehandDraw';
        shapeDetails.points = extend([], this.pointColl[index].points) as Point[];
        shapeDetails.strokeColor = this.pointColl[index].strokeColor;
        shapeDetails.strokeWidth = this.pointColl[index].strokeWidth;
        return shapeDetails;
    }

    private isPointsInRange(x: number, y: number): boolean {
        let inRange: boolean = false;
        if (x >= 0 && y >= 0 && x <= this.lowerCanvas.width && y <= this.lowerCanvas.width) {
            inRange = true;
        }
        return inRange;
    }

    private clearActObj(): void {
        if (this.textArea.style.display === 'none') {
            this.refreshActiveObj();
            this.applyActObj();
            this.refreshActiveObj();
            this.currObjType.isCustomCrop = false;
        }
    }

    private applyPenDraw(): void {
        if (this.currObjType.shape === 'freehanddraw') {
            this.apply(); this.upperCanvas.style.cursor = 'default';
            this.currObjType.shape = '';
        }
        this.clearActObj();
    }

    private drawRotatedImage(degree: number): void {
        if (degree === 0) {
            this.degree = 0;
        } else {
            this.degree += degree;
        }
        if (this.degree === 360 || this.degree === -360) {this.degree = 0; }
        this.setDestinationPoints();
        const tempObjColl: SelectionPoint[] = extend([], this.objColl, [], true) as SelectionPoint[];
        const tempActiveObj: SelectionPoint = extend({}, this.activeObj, {}, true) as SelectionPoint;
        this.objColl = []; this.refreshActiveObj();
        if (!this.isReverseRotate) {
            this.updateCurrentTransformedState('initial');
        }
        this.rotateDegree(degree);
        if (!this.isReverseRotate) {
            this.updateCurrentTransformedState('reverse');
            this.rotateFlipColl.push(degree);
        }
        if (this.rotateFlipColl.length === 1) {
            this.setClientTransformedDimension();
        }
        this.objColl = extend([], tempObjColl, [], true) as SelectionPoint[];
        this.activeObj = extend({}, tempActiveObj, {}, true) as SelectionPoint;
        if (this.isCircleCrop) {this.cropCircle(this.lowerContext); }
        this.redrawObj(degree); this.refreshActiveObj();
        if (degree > 0) {
            this.rotateFreehandDrawColl();
        } else {
            for (let i: number = 0; i < 3; i++) {
                this.rotateFreehandDrawColl();
            }
        }
        this.freehandRedraw(this.lowerContext);
    }

    private setClientTransformedDimension(isPreventDimension?: boolean): void {
        if (this.degree % 90 === 0 && this.degree % 180 !== 0) {
            this.destLeft = (this.lowerCanvas.width - this.destHeight) / 2;
            this.destTop = (this.lowerCanvas.height - this.destWidth) / 2;
            const temp: number = this.destWidth;
            this.destWidth = this.destHeight;
            this.destHeight = temp;
        } else {
            if (isNullOrUndefined(isPreventDimension)) {
                this.destLeft = (this.lowerCanvas.width - this.destWidth) / 2;
                this.destTop = (this.lowerCanvas.height - this.destHeight) / 2;
            }
        }
    }

    private popForDefaultTransformedState(): void {
        let rotateRight: number = 0; let rotateleft: number = 0; let horizontal: number = 0; let vertical: number = 0;
        for (let i: number = 0; i < this.rotateFlipColl.length; i++) {
            if (this.rotateFlipColl[i as number] === 90) {
                rotateRight++; rotateleft = 0; horizontal = 0; vertical = 0;
                if (rotateRight === 4) {
                    this.rotateFlipColl.pop(); this.rotateFlipColl.pop(); this.rotateFlipColl.pop(); this.rotateFlipColl.pop();
                }
            } else if (this.rotateFlipColl[i as number] === -90) {
                rotateleft++; rotateRight = 0; horizontal = 0; vertical = 0;
                if (rotateleft === 4) {
                    this.rotateFlipColl.pop(); this.rotateFlipColl.pop(); this.rotateFlipColl.pop(); this.rotateFlipColl.pop();
                }
            } else if (this.rotateFlipColl[i as number] === 'horizontal') {
                horizontal++; rotateleft = 0; rotateRight = 0; vertical = 0;
                if (horizontal === 2) {
                    this.rotateFlipColl.pop(); this.rotateFlipColl.pop();
                }
            } else if (this.rotateFlipColl[i as number] === 'vertical') {
                vertical++; horizontal = 0; rotateleft = 0; rotateRight = 0;
                if (vertical === 2) {
                    this.rotateFlipColl.pop(); this.rotateFlipColl.pop();
                }
            }
        }
    }

    private popForDefaultFlipState(): void {
        for (let i: number = 0; i < this.rotateFlipColl.length; i++) {
            if (!isNullOrUndefined(this.rotateFlipColl[i + 3])) {
                if (this.rotateFlipColl[i as number] === 'horizontal' && this.rotateFlipColl[i + 1] === 'vertical' &&
                this.rotateFlipColl[i + 2] === 'horizontal' && this.rotateFlipColl[i + 3] === 'vertical') {
                    this.rotateFlipColl.pop(); this.rotateFlipColl.pop(); this.rotateFlipColl.pop(); this.rotateFlipColl.pop();
                } else if (this.rotateFlipColl[i as number] === 'vertical' && this.rotateFlipColl[i + 1] === 'horizontal' &&
                this.rotateFlipColl[i + 2] === 'vertical' && this.rotateFlipColl[i + 3] === 'horizontal') {
                    this.rotateFlipColl.pop(); this.rotateFlipColl.pop(); this.rotateFlipColl.pop(); this.rotateFlipColl.pop();
                }
            }
        }
    }

    private popForDefaultRotateState(): void {
        for (let i: number = 0; i < this.rotateFlipColl.length; i++) {
            if (!isNullOrUndefined(this.rotateFlipColl[i + 1])) {
                if (this.rotateFlipColl[i as number] === 90 && this.rotateFlipColl[i + 1] === -90) {
                    this.rotateFlipColl.pop(); this.rotateFlipColl.pop();
                } else if (this.rotateFlipColl[i as number] === -90 && this.rotateFlipColl[i + 1] === 90) {
                    this.rotateFlipColl.pop(); this.rotateFlipColl.pop();
                }
            }
        }
    }

    private alignRotateFlipColl(): void {
        this.popForDefaultTransformedState();
        this.popForDefaultFlipState();
        this.popForDefaultRotateState();
        if (this.rotateFlipColl.length === 0) {
            this.degree = 0; this.currFlipState = '';
        }
    }

    private updateFlipColl(direction: string): void {
        if (this.flipColl.length === 0) {
            this.flipColl.push(direction);
        } else {
            if (this.flipColl[this.flipColl.length - 1] === 'direction') {
                this.flipColl.pop();
            } else {
                this.flipColl.push(direction);
            }
        }
        if (this.flipColl.length >= 4) {
            if (this.flipColl[this.flipColl.length - 1] === 'horizontal' && this.flipColl[this.flipColl.length - 2] === 'vertical' &&
            this.flipColl[this.flipColl.length - 3] === 'horizontal' && this.flipColl[this.flipColl.length - 4] === 'vertical') {
                for (let i: number = 0; i < 4; i++) {
                    this.flipColl.pop();
                }
            } else if (this.flipColl[this.flipColl.length - 1] === 'vertical' && this.flipColl[this.flipColl.length - 2] === 'horizontal' &&
            this.flipColl[this.flipColl.length - 3] === 'vertical' && this.flipColl[this.flipColl.length - 4] === 'horizontal') {
                for (let i: number = 0; i < 4; i++) {
                    this.flipColl.pop();
                }
            }
        }
    }

    private horizontalFlip(): void {
        this.lowerContext.translate(this.lowerContext.canvas.width, 0);
        this.lowerContext.scale(-1, 1);
        this.upperContext.translate(this.upperContext.canvas.width, 0);
        this.upperContext.scale(-1, 1);
    }

    private verticalFlip(): void {
        this.lowerContext.translate(0, this.lowerContext.canvas.height);
        this.lowerContext.scale(1, -1);
        this.upperContext.translate(0, this.upperContext.canvas.height);
        this.upperContext.scale(1, -1);
    }

    private updateFlipState(direction: string): void {
        if (direction === 'horizontal' && this.degree % 90 === 0 && this.degree % 180 !== 0) {
            this.verticalFlip();
        } else if (direction === 'vertical' && this.degree % 90 === 0 && this.degree % 180 !== 0) {
            this.horizontalFlip();
        } else if (direction === 'horizontal') {
            this.horizontalFlip();
        } else if (direction === 'vertical') {
            this.verticalFlip();
        }
    }

    private setDestinationPoints(): void {
        let maxDimension: Dimension;
        if (this.degree % 90 === 0 && this.degree % 180 !== 0) {
            maxDimension = this.calcMaxDimension(this.srcHeight, this.srcWidth);
            if (this.isRotateZoom) {
                maxDimension.width += (maxDimension.width * this.zoomFactor);
                maxDimension.height += (maxDimension.height * this.zoomFactor);
                this.destWidth = maxDimension.height; this.destHeight = maxDimension.width;
            }
            this.destLeft = (this.lowerCanvas.clientWidth - maxDimension.height) / 2;
            this.destTop = (this.lowerCanvas.clientHeight - maxDimension.width) / 2;
            this.destWidth = maxDimension.height; this.destHeight = maxDimension.width;
        } else {
            maxDimension = this.calcMaxDimension(this.srcWidth, this.srcHeight);
            if (this.isRotateZoom) {
                maxDimension.width += (maxDimension.width * this.zoomFactor);
                maxDimension.height += (maxDimension.height * this.zoomFactor);
                this.destWidth = maxDimension.width; this.destHeight = maxDimension.height;
            }
            this.destLeft = (this.lowerCanvas.clientWidth - maxDimension.width) / 2;
            this.destTop = (this.lowerCanvas.clientHeight - maxDimension.height) / 2;
            this.destWidth = maxDimension.width; this.destHeight = maxDimension.height;
        }
    }

    private rotatedFlip(): void {
        this.isReverseFlip = true;
        let tempCurrFlipState: string = this.currFlipState;
        const tempFlipColl: string[] = this.flipColl;
        const tempObjColl: SelectionPoint[] = extend([], this.objColl, [], true) as SelectionPoint[];
        const tempActiveObj: SelectionPoint = extend({}, this.activeObj, {}, true) as SelectionPoint;
        this.flipColl = []; this.objColl = []; this.refreshActiveObj();
        this.currentTransformedState('initial');
        const temp: string = this.lowerContext.filter;
        this.updateBrightnessFilter();
        this.lowerContext.drawImage(this.baseImg, this.srcLeft, this.srcTop, this.srcWidth, this.srcHeight,
                                    this.destLeft, this.destTop, this.destWidth, this.destHeight);
        this.lowerContext.filter = temp;
        this.currentTransformedState('reverse', true);
        if (tempCurrFlipState === '' && this.currFlipState !== '') {
            tempCurrFlipState = this.currFlipState;
        }
        this.currFlipState = tempCurrFlipState;
        this.flipColl = tempFlipColl;
        this.objColl = extend([], tempObjColl, [], true) as SelectionPoint[];
        this.lowerContext.filter = 'none';
        this.iterateObjColl();
        this.lowerContext.filter = temp;
        if (tempActiveObj.activePoint.width !== 0) {
            this.activeObj = extend({}, tempActiveObj, {}, true) as SelectionPoint;
        }
        this.isReverseFlip = false;
    }

    private getFilterValue(value: number): number {
        let filterValue: number;
        if (value === 0) {filterValue = 1; }
        else {filterValue = 1 + ((value * 0.5) / 100); }
        return filterValue;
    }

    private setFilterValue(value: number): number {
        let filterValue: number;
        if (value === 1) {filterValue = 0; }
        else {filterValue = ((value - 1) * 100) / 0.5; }
        return Math.round(filterValue);
    }

    private getSaturationFilterValue(value: number): number {
        let filterValue: number;
        if (value === 0) {filterValue = 1; }
        else {
            filterValue = 1 + (value / 100);
        }
        return filterValue;
    }

    private setSaturationFilterValue(value: number): number {
        let filterValue: number;
        if (value === 1) {filterValue = 0; }
        else {
            filterValue = (value - 1) * 100;
        }
        return Math.round(filterValue);
    }

    private getBlackAndWhiteData(imageData: ImageData): ImageData {
        for (let i: number = 0; i < imageData.data.length; i += 4) {
            const count: number = imageData.data[i as number] + imageData.data[i + 1] + imageData.data[i + 2];
            let colour: number = 0;
            if (count > 383) {
                colour = 255;
            }
            imageData.data[i as number] = colour;
            imageData.data[i + 1] = colour;
            imageData.data[i + 2] = colour;
            imageData.data[i + 3] = 255;
        }
        return imageData;
    }

    private setBrightness(value: number): void {
        this.applyPenDraw();
        this.adjustmentLevel.brightness = value;
        value = this.getFilterValue(value);
        const temp: string = this.lowerContext.filter;
        this.updateAdjustment('brightness', value);
        this.updateUndoRedoColl('brightness', value, temp, this.lowerContext.filter, this.zoomFactor, this.adjustmentLevel.sharpen, this.adjustmentLevel.bw);
    }

    private setContrast(value: number): void {
        this.applyPenDraw();
        this.adjustmentLevel.contrast = value;
        const temp: string = this.lowerContext.filter;
        value = this.getFilterValue(value);
        value *= 100;
        this.updateAdjustment('contrast', value);
        this.updateUndoRedoColl('contrast', value, temp, this.lowerContext.filter, this.zoomFactor, this.adjustmentLevel.sharpen, this.adjustmentLevel.bw);
    }

    private setHue(value: number): void {
        this.applyPenDraw();
        this.adjustmentLevel.hue = value;
        value *= 3;
        const temp: string = this.lowerContext.filter;
        this.updateAdjustment('hue', value);
        this.updateUndoRedoColl('hue', value, temp, this.lowerContext.filter, this.zoomFactor, this.adjustmentLevel.sharpen, this.adjustmentLevel.bw);
    }

    private setSaturation(value: number): void {
        this.applyPenDraw();
        this.adjustmentLevel.saturation = value;
        value = this.getSaturationFilterValue(value);
        value *= 100;
        const temp: string = this.lowerContext.filter;
        this.updateAdjustment('saturation', value);
        this.updateUndoRedoColl('saturation', value, temp, this.lowerContext.filter, this.zoomFactor, this.adjustmentLevel.sharpen, this.adjustmentLevel.bw);
    }

    private setOpacity(value: number): void {
        this.applyPenDraw();
        this.adjustmentLevel.opacity = value;
        if (value >= 50) {value /= 100; }
        else if (value === 40) {value = 0.45; }
        else if (value === 30) {value = 0.40; }
        else if (value === 20) {value = 0.35; }
        else if (value === 10) {value = 0.30; }
        else if (value === 0) {value = 0.25; }
        const temp: string = this.lowerContext.filter;
        this.updateAdjustment('opacity', value);
        this.updateUndoRedoColl('opacity', value, temp, this.lowerContext.filter, this.zoomFactor, this.adjustmentLevel.sharpen, this.adjustmentLevel.bw);
    }

    private setBlur(value: number): void {
        this.applyPenDraw();
        this.adjustmentLevel.blur = value;
        value /= 20;
        // Since 0.5 is not working in blur we consider from 1
        value += 0.5;
        const temp: string = this.lowerContext.filter;
        this.updateAdjustment('blur', value);
        this.updateUndoRedoColl('blur', value, temp, this.lowerContext.filter, this.zoomFactor, this.adjustmentLevel.sharpen, this.adjustmentLevel.bw);
    }

    private setExposure(value: number): void {
        this.applyPenDraw();
        this.adjustmentLevel.exposure = value;
        value = this.getFilterValue(value);
        const temp: string = this.lowerContext.filter;
        this.updateAdjustment('exposure', value);
        this.updateUndoRedoColl('exposure', value, temp, this.lowerContext.filter, this.zoomFactor, this.adjustmentLevel.sharpen, this.adjustmentLevel.bw);
    }

    private setFilter(type: string): void {
        type = type.toLowerCase();
        this.applyPenDraw();
        const tempFilter: string = this.lowerContext.filter;
        const prevFilter: string = this.currentFilter;
        this.updateAdjustment(type, null);
        this.updateUndoRedoColl(type, prevFilter, tempFilter, this.lowerContext.filter,
                                this.zoomFactor, this.adjustmentLevel.sharpen, this.adjustmentLevel.bw);
    }

    private renderImage(): void {
        const temp: string = this.lowerContext.filter;
        this.applyActObj();
        this.upperContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
        this.lowerContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
        this.updateCurrentTransformedState('initial');
        this.updateBrightnessFilter();
        this.lowerContext.drawImage(this.baseImg, this.srcLeft, this.srcTop, this.srcWidth, this.srcHeight,
                                    this.destLeft, this.destTop, this.destWidth, this.destHeight);
        this.updateCurrentTransformedState('reverse');
        this.lowerContext.filter = 'none';
        this.iterateObjColl(); this.freehandRedraw(this.lowerContext);
        this.lowerContext.filter = temp;
        if (this.isCircleCrop || (!isNullOrUndefined(this.currSelectionPoint) && this.currSelectionPoint.shape === 'crop-circle')) {
            this.cropCircle(this.lowerContext);
        }
    }

    private updateTextBox(obj: SelectionPoint): void {
        this.upperContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
        this.lowerContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
        this.redrawImgWithObj();
        this.textArea.style.display = 'block';
        this.textArea.style.fontFamily = obj.textSettings.fontFamily;
        this.textArea.style.fontSize = obj.textSettings.fontSize + 'px';
        this.textArea.style.color = obj.strokeSettings.strokeColor;
        this.textArea.style.fontWeight = obj.textSettings.bold ? 'bold' : 'normal';
        this.textArea.style.fontStyle = obj.textSettings.italic ? 'italic' : 'normal';
        this.textArea.style.border = '2px solid ' + this.themeColl[this.theme]['primaryColor'];
        this.textArea.value = obj.keyHistory;
        this.activeObj = extend({}, obj, {}, true) as SelectionPoint;
        this.updateFontStyles();
        this.textArea.style.width = this.activeObj.activePoint.width + 'px';
    }

    private setAdjustment(type: string): void {
        this.lowerContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
        const splitWords: string[] = this.lowerContext.filter.split(' ');
        let value: number; let valueArr: string[];
        switch (type) {
        case 'brightness':
            valueArr = splitWords[0].split('(');
            value = parseFloat(valueArr[1].split(')')[0]);
            this.adjustmentLevel.brightness = this.setFilterValue(value);
            break;
        case 'contrast':
            valueArr = splitWords[1].split('(');
            value = parseFloat(valueArr[1].split(')')[0]);
            value /= 100;
            this.adjustmentLevel.contrast = this.setFilterValue(value);
            break;
        case 'hue':
            valueArr = splitWords[2].split('(');
            value = parseFloat(valueArr[1].split(')')[0]);
            value /= 3;
            this.adjustmentLevel.hue = value;
            break;
        case 'saturation':
            valueArr = splitWords[3].split('(');
            value = parseFloat(valueArr[1].split(')')[0]);
            value /= 100;
            this.adjustmentLevel.saturation = this.setSaturationFilterValue(value);
            break;
        case 'opacity':
            valueArr = splitWords[4].split('(');
            value = parseFloat(valueArr[1].split(')')[0]);
            if (value === 0.45) {
                value = 40;
            }
            else if (value === 0.40) {
                value = 30;
            }
            else if (value === 0.35) {
                value = 20;
            }
            else if (value === 0.30) {
                value = 10;
            }
            else if (value === 0.25) {
                value = 0;
            } else {
                value *= 100;
            }
            this.adjustmentLevel.opacity = value;
            break;
        case 'blur':
            valueArr = splitWords[5].split('(');
            value = parseFloat(valueArr[1].split(')')[0]);
            value *= 20;
            this.adjustmentLevel.blur = value;
            break;
        case 'exposure':
            valueArr = splitWords[0].split('(');
            value = parseFloat(valueArr[1].split(')')[0]);
            this.adjustmentLevel.exposure = this.setFilterValue(value);
            break;
        }
        this.callUpdateCurrentTransformedState();
    }

    private updateFilter(obj: Transition): void {
        const selEle: HTMLElement = this.element.querySelector('.e-contextual-toolbar-wrapper .e-toolbar-item.e-selected');
        if (selEle) {selEle.classList.remove('e-selected'); }
        const filterCanvas: HTMLElement = document.getElementById(obj.value + 'Canvas');
        if (filterCanvas) {
            filterCanvas.parentElement.classList.add('e-selected');
        }
        this.currentFilter = obj.value as string;
        this.lowerContext.filter = this.canvasFilter = obj.previousObj as string;
        this.lowerContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
        this.isUndoRedo = true; this.redrawImgWithObj();
    }

    private drawNewSelection(type: string, startX?: number, startY?: number, width?: number, height?: number): void {
        let points: ActivePoint;
        const cropShape: string = 'crop-' + type;
        if (cropShape.toLowerCase() === 'crop-custom') {
            if (this.currObjType.shape === '') {
                this.drawCustomSelection('crop-custom');
            }
            if (startX && startY) {
                this.upperContext.clearRect(0, 0 , this.upperCanvas.width, this.upperCanvas.height);
                this.currObjType.shape = this.activeObj.shape = cropShape.toLowerCase();
                this.activeObj.activePoint.startX = startX; this.activeObj.activePoint.startY = startY;
                this.activeObj.activePoint.endX = this.lowerCanvas.width;
                this.activeObj.activePoint.endY = this.lowerCanvas.height;
                this.activeObj.activePoint.width = this.activeObj.activePoint.endX - this.activeObj.activePoint.startX;
                this.activeObj.activePoint.height = this.activeObj.activePoint.endY - this.activeObj.activePoint.startY;
                this.drawObject('duplicate');
            }
        } else if (cropShape.toLowerCase() === 'crop-canvas') {
            this.upperCanvas.style.display = 'none';
            this.dragCanvas = true;
        } else {
            this.currObjType.isCustomCrop = false;
            this.currObjType.shape = cropShape.toLowerCase();
            if (width && height) {
                points = {startX : startX, startY : startY, endX : startX + width, endY : startY + height,
                    width: width, height: height};
            } else if (width && cropShape === 'crop-circle') {
                points = {startX : startX, startY : startY, endX : startX + width, endY : startY + width,
                    width: width, height: width};
            }
            this.activeObj.shape = cropShape.toLowerCase();
            this.drawObject('duplicate', null, true, points);
        }
    }

    /**
     * Clear a current selection.
     *
     * @returns {void}.
     */
    public clearSelection(): void {
        if (!this.disabled && this.isImageLoaded) {
            this.togglePen = false;
            this.refreshActiveObj();
            this.dragElement = '';
            this.dragPoint.startX = this.dragPoint.startY = this.dragPoint.endX = this.dragPoint.endY = 0;
            this.currObjType.shape = '';
            this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
            this.currObjType.isActiveObj = true; this.currObjType.isCustomCrop = false;
            this.upperCanvas.style.cursor = 'default';
        }
    }

    /**
     * Crops an image based on the selection.
     * The selection can be done through programmatically using the select method or through UI interactions.
     *
     * @returns {boolean}.
     */
    public crop(): boolean {
        let isCrop: boolean = false;
        if (!this.disabled && this.isImageLoaded) {
            if (this.currObjType.isUndoAction) { this.refreshUndoRedoColl(); }
            let splitWords: string[];
            const transitionArgs: CropEventArgs = {startPoint: {x: this.activeObj.activePoint.startX, y:
                this.activeObj.activePoint.startY}, endPoint: {x: this.activeObj.activePoint.endX, y: this.activeObj.activePoint.endY}};
            this.trigger('cropping', transitionArgs);
            if (this.activeObj.shape !== undefined) {splitWords = this.activeObj.shape.split('-'); }
            if (!this.disabled && this.activeObj.horTopLine !== undefined && (this.currObjType.isCustomCrop || splitWords[0] === 'crop')) {
                isCrop = true;
                const shape: string = this.activeObj.shape;
                this.cropImg();
                this.zoomFactor = 0;
                this.enableDisableToolbarBtn();
                this.updateUndoRedoColl('crop', shape);
            }
        }
        return isCrop;
    }

    /**
     * Flips an image by horizontally or vertically.
     *
     * @param {Direction } direction - Specifies the direction to flip the image.
     * @returns {void}.
     */
    public flip(direction: Direction): void {
        if (!this.disabled && this.isImageLoaded) {
            const zoomFactor: number = this.zoomFactor;
            const transitionArgs: FlipEventArgs = {direction: direction};
            this.trigger('flipping', transitionArgs);
            let splitWords: string[] = [];
            let activeObjShape: string;
            if (!isNullOrUndefined(this.activeObj.activePoint)) {
                if (this.activeObj.shape !== undefined) {splitWords = this.activeObj.shape.split('-'); }
                if (this.currObjType.isCustomCrop || splitWords[0] === 'crop') {
                    activeObjShape = this.currObjType.isCustomCrop ? 'custom' : splitWords[1];
                    this.updateImageRatioForActObj();
                    this.objColl.push(this.activeObj);
                    this.refreshActiveObj();
                }
            }
            this.redrawActObj();
            this.lowerContext.clearRect(0, 0, this.lowerCanvas.height, this.lowerCanvas.width);
            this.lowerContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
            this.upperContext.clearRect(0, 0, this.lowerCanvas.height, this.lowerCanvas.width);
            this.upperContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
            let tempObjColl: SelectionPoint[] = extend([], this.objColl, [], true) as SelectionPoint[];
            const tempActiveObj: SelectionPoint = extend({}, this.activeObj, {}, true) as SelectionPoint;
            this.objColl = []; this.refreshActiveObj();
            if (!this.isReverseFlip) {
                this.updateCurrentTransformedState('initial');
            }
            if (direction.toLowerCase() === 'horizontal') {
                this.updateFlipState(direction.toLowerCase());
                if (this.currFlipState.toLowerCase() === 'horizontal') {
                    this.currFlipState = '';
                } else {
                    this.currFlipState = 'horizontal';
                }
            }
            else {
                this.updateFlipState(direction.toLowerCase());
                if (this.currFlipState.toLowerCase() === 'vertical') {
                    this.currFlipState = '';
                } else {
                    this.currFlipState = 'vertical';
                }
            }
            if (this.rotatedFlipCropSelection) {
                this.destLeft += this.totalPannedInternalPoint.x;
                this.destTop += this.totalPannedInternalPoint.y;
            }
            const temp: string = this.lowerContext.filter;
            this.updateBrightnessFilter();
            this.lowerContext.drawImage(this.baseImg, this.srcLeft, this.srcTop, this.srcWidth, this.srcHeight,
                                        this.destLeft, this.destTop, this.destWidth, this.destHeight);
            this.lowerContext.filter = temp;
            this.updateFlipState(direction.toLowerCase());
            if (!this.isReverseFlip) {
                this.updateCurrentTransformedState('reverse');
                this.updateFlipColl(direction.toLocaleLowerCase());
                this.rotateFlipColl.push(direction.toLowerCase());
            }
            if (this.rotateFlipColl.length === 1) {
                this.setClientTransformedDimension();
            }
            if (this.isCircleCrop) {this.cropCircle(this.lowerContext); }
            this.objColl = extend([], tempObjColl, [], true) as SelectionPoint[];
            this.activeObj = extend({}, tempActiveObj, {}, true) as SelectionPoint;
            for (let i: number = 0, len: number = this.objColl.length; i < len; i++) {
                if (this.objColl[i as number].flipObjColl.length === 0) {
                    this.objColl[i as number].flipObjColl.push(direction);
                } else if (this.objColl[i as number].flipObjColl[this.objColl[i as number].flipObjColl.length - 1] === direction) {
                    this.objColl[i as number].flipObjColl.pop();
                } else {
                    this.objColl[i as number].flipObjColl.push(direction);
                }
            }
            this.redrawObj(direction.toLowerCase());
            const tempFilter: string = this.lowerContext.filter;
            this.lowerContext.filter = this.getDefaultFilter();
            this.iterateObjColl();
            if (!isNullOrUndefined(this.currSelectionPoint)) {
                tempObjColl = extend([], this.objColl, [], true) as SelectionPoint[];
                this.objColl = [];
                this.objColl.push(this.currSelectionPoint);
                this.redrawObj(direction.toLowerCase());
                this.currSelectionPoint = extend({}, this.objColl[0], {}, true) as SelectionPoint;
                this.objColl = tempObjColl;
            }
            if (direction.toLowerCase() === 'horizontal' || direction.toLowerCase() === 'vertical') {
                this.flipFreehandrawColl(direction.toLowerCase()); this.freehandRedraw(this.lowerContext);
            } else {
                this.freehandRedraw(this.lowerContext);
            }
            this.lowerContext.filter = tempFilter;
            this.refreshActiveObj();
            if (!this.isUndoRedo) {this.updateUndoRedoColl('flip', direction, this.objColl, null, zoomFactor,
                                                           this.adjustmentLevel.sharpen, this.adjustmentLevel.bw); }
            this.isUndoRedo = false;
            this.clearOuterCanvas(this.lowerContext); this.clearOuterCanvas(this.upperContext);
            if (!isNullOrUndefined(activeObjShape)) {
                this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
                this.activeObj = extend({}, this.objColl[this.objColl.length - 1], {}, true) as SelectionPoint;
                this.objColl.pop();
                this.drawObject('duplicate', this.activeObj);
                if (!this.isReverseFlip) {this.refreshToolbar('main', true, true); }
            }
            if (isNullOrUndefined(this.activeObj.shape) && !this.isReverseFlip) {
                this.refreshToolbar('main');
            } else if (!this.isReverseFlip) {
                this.refreshToolbar('main', true, true);
            }
            this.alignRotateFlipColl();
        }
    }

    /**
     * Return an image as ImageData.
     *
     * @returns {ImageData}.
     */
    public getImageData(): ImageData {
        const data: ImageData = this.lowerContext.getImageData(this.destLeft, this.destTop, this.destWidth, this.destHeight);
        return data;
    }

    /**
     *  Load/opens an image for editing within an image editor.
     *
     * @param {string | ImageData } data - Specifies url of the Image or image data.
     *
     * @returns {void}.
     */
    public open(data: string | ImageData): void {
        if (!this.disabled) {
            showSpinner(this.element);
            this.element.style.opacity = '0.5';
            const toolbar: HTMLInputElement = document.querySelector('#' + this.element.id + '_currPos');
            if (toolbar) {
                toolbar.style.display = 'none';
            }
            if (this.defToolbarItems.length === 0 &&
                (isNullOrUndefined(document.getElementById(this.element.id + '_toolbar')))) {
                this.toolbarHeight = 0;
            }
            if (isNullOrUndefined(this.toolbarTemplate)) {this.reset(); this.update(); }
            this.degree = 0; this.zoomFactor = 0;
            this.isImageLoaded = false;
            this.currSelectionPoint = null;
            const type: string = typeof(data);
            if (type === 'string') {
                let fileName: string[] = (data as string).split('.');
                if (fileName.length > 1) {
                    fileName = fileName[fileName.length - 2].split('/');
                    this.fileName = fileName[fileName.length - 1];
                } else {
                    this.fileName = 'ImageEditor';
                }
                this.imageOnLoad(data as string);
            } else {
                this.fileName = 'ImageEditor';
                this.lowerCanvas = document.querySelector('#' + this.element.id + '_lowerCanvas');
                this.upperCanvas = document.querySelector('#' + this.element.id + '_upperCanvas');
                this.lowerContext = this.lowerCanvas.getContext('2d'); this.upperContext = this.upperCanvas.getContext('2d');
                this.lowerContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
                this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
                this.inMemoryContext.clearRect(0, 0, this.inMemoryCanvas.width, this.inMemoryCanvas.height);
                this.inMemoryCanvas.width = this.baseImg.width = (data as ImageData).width;
                this.inMemoryCanvas.height = this.baseImg.height = (data as ImageData).height;
                this.inMemoryContext.putImageData((data as ImageData), 0, 0);
                this.baseImg.src = this.inMemoryCanvas.toDataURL();
            }
        }
    }

    /**
     * Reset all the changes and revert to original image.
     *
     * @returns {void}.
     */
    public reset(): void {
        if (!this.disabled) {
            this.inMemoryContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
            this.inMemoryContext.clearRect(0, 0, this.lowerCanvas.height, this.lowerCanvas.width);
            this.lowerContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
            this.lowerContext.clearRect(0, 0, this.lowerCanvas.height, this.lowerCanvas.width);
            this.upperContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
            this.upperContext.clearRect(0, 0, this.lowerCanvas.height, this.lowerCanvas.width);
            this.lowerContext.filter = this.getDefaultFilter();
            this.refreshActiveObj(); this.refreshToolbar('main');
            if (Browser.isDevice && document.getElementById(this.element.id + '_bottomToolbar')) {
                (getComponent(document.getElementById(this.element.id + '_bottomToolbar'), 'toolbar') as Toolbar).destroy();
                this.createBottomToolbar();
            }
            this.objColl = []; this.isImageLoaded = false; this.degree = this.undoRedoStep = 0;
            this.keyHistory = this.currFlipState = '';
            this.upperCanvas.style.display = 'none'; this.togglePan = this.togglePen =  false;
            this.upperCanvas.style.cursor = this.lowerCanvas.style.cursor = 'default';
            this.undoRedoColl = []; this.dragCanvas = this.isUndoRedo = false;
            this.tempKeyHistory = '';
            this.lowerContext.lineWidth = this.upperContext.lineWidth = undefined;
            this.touchEndPoint = {} as Point;
            this.currentToolbar = 'main'; this.textStartPoints = {x: 0, y: 0};
            this.fontSizeColl = [];
            this.textArea.value = this.textArea.textContent = ''; this.textArea.style.display = 'none';
            this.strokeSettings = {strokeColor: '#fff', fillColor: '', strokeWidth: null};
            this.textSettings =
            {text: 'Enter Text', fontFamily: 'Arial', fontSize: null, fontRatio: null, bold: false, italic: false, underline: false};
            this.tempStrokeSettings = {strokeColor: '#fff', fillColor: '', strokeWidth: null};
            this.tempTextSettings =
            {text: 'Enter Text', fontFamily: 'Arial', fontSize: null, fontRatio: null, bold: false, italic: false, underline: false};
            this.timer = undefined; this.penStrokeWidth = undefined;
            this.currObjType.isUndoAction = false;
            this.undoRedoStep = 0;
            this.tempObjColl = undefined;
            this.adjustmentLevel = {brightness: 0, contrast: 0, hue: 0, opacity: 100, saturation: 0,
                blur: 0, exposure: 0, sharpen: false, bw: false};
            this.tempAdjustmentLevel = {brightness: 0, contrast: 0, hue: 0, opacity: 100, saturation: 0,
                blur: 0, exposure: 0, sharpen: false, bw: false};
            this.canvasFilter = this.currentFilter = this.tempAdjustmentValue = '';
            this.lowerContext.filter = this.initialAdjustmentValue = this.adjustmentValue = this.getDefaultFilter();
            this.destLeft = this.destTop = this.srcLeft = this.srcTop = 0;
            this.destWidth = this.destHeight = this.srcWidth = this.srcHeight = null;
            this.currSelectionPoint = null;
            this.cropDestPoints = {startX: 0, startY: 0, width: 0, height: 0} as ActivePoint;
            this.panDown = null; this.panMove = null; this.tempPanMove = null;
            this.flipColl = [];
            this.freehandDrawObj.time = this.freehandDrawObj.lastVelocity = 0;
            this.freehandDrawObj.pointX = this.freehandDrawObj.pointY = 0;
            this.points = []; this.pointColl = {};
            this.pointCounter = this.freehandCounter = this.tempFreehandCounter = this.tempCurrentFreehandDrawIndex = 0;
            this.isFreehandDrawing = false;
            this.isReverseRotate = this.isReverseFlip = this.isPreventDragging = this.isRotateZoom = false;
            this.currentPannedPoint = null; this.fileType = undefined;
            this.rotateFlipColl = []; this.isCircleCrop = false; this.isCropTab = false;
            this.rotatedDestPoints = {startX: 0, startY: 0, width: 0, height: 0} as ActivePoint;
            this.croppedDegree = 0; this.freehandDrawHoveredIndex = this.freehandDrawSelectedIndex = null;
            this.isFreehandDrawingPoint = this.isFreehandDrawEditing = false;
            this.tempFreeHandDrawEditingStyles = {strokeColor: null, fillColor: null, strokeWidth: null};
            this.totalPannedInternalPoint = {x: 0, y: 0}; this.totalPannedClientPoint = {x: 0, y: 0};
            this.lowerCanvas.style.left = this.upperCanvas.style.left = '';
            this.lowerCanvas.style.top = this.upperCanvas.style.top = '';
            this.lowerCanvas.style.maxWidth = this.upperCanvas.style.maxWidth = '';
            this.lowerCanvas.style.maxHeight = this.upperCanvas.style.maxHeight = '';
            this.currentSelectionPoint = null; this.totalPannedPoint = {x: 0, y: 0}; this.fileName = '';
            this.isBrightnessAdjusted = this.isInitialLoading = false;
            this.defaultZoomFactor = this.cropZoomFactor = this.zoomFactor = 0;
            this.tempActObj = null; this.lastPan = {x: 0, y: 0};
            this.selectedFreehandColor = '#42a5f5'; this.isFreehandDrawCustomized = false;
            this.isShapeInserted = false;
            this.tempActObj = undefined; this.lastPan = {x: 0, y: 0};
            this.currObjType = { shape: '', isDragging: false, isActiveObj: false, isText: false, isInitialText: false, isLine: false,
                isInitialLine: false, isCustomCrop: false, isZoomed: false, isUndoZoom: false,
                isUndoAction: false, isFiltered: false, isSave: false };
            this.isAllowCropPan = false;
            this.tempPannedPoint = {x: 0, y: 0};
            this.cropObj = {cropZoom: 0, defaultZoom: 0, totalPannedPoint: {x: 0, y: 0}, totalPannedClientPoint: {x: 0, y: 0},
                totalPannedInternalPoint: {x: 0, y: 0}, activeObj: {} as SelectionPoint, rotateFlipColl: [], degree: 0,
                currFlipState: '', destPoints: {startX: 0, startY: 0, width: 0, height: 0} as ActivePoint,
                srcPoints: {startX: 0, startY: 0, width: 0, height: 0} as ActivePoint };
            this.afterCropActions = []; this.isCancelAction = this.preventZoomBtn = this.isFreehandPointMoved = false;
            this.isTouch = false; this.freehandDownPoint = {x: 0, y: 0}; this.tempFlipPanPoint = {x: 0, y: 0};  
            this.currentFreehandDrawIndex = 0; this.tempCurrentFreehandDrawIndex = 0;
            this.cancelObjColl = []; this.cancelPointColl = [];
            this.updateCanvas(); this.refreshDropDownBtn(false); this.enableDisableToolbarBtn();
        }
    }

    /**
     * Rotate an image to clockwise and anti-clockwise.
     *
     * @param {number} degree - Specifies a degree to rotate an image.
     * positive integer value for clockwise and negative integer value for anti-clockwise rotation. 
     *
     * @returns {boolean}.
     */
    public rotate(degree: number): boolean {
        let isRotate: boolean = false;
        if (!this.disabled && this.isImageLoaded && (degree % 90 === 0)) {
            isRotate = true;
            const transitionArgs: RotateEventArgs = {degree: degree};
            this.trigger('rotating', transitionArgs);
            let splitWords: string[] = [];
            let activeObjShape: string;
            if (!isNullOrUndefined(this.activeObj.activePoint) && !isNullOrUndefined(this.activeObj.shape)) {
                if (this.activeObj.shape !== undefined) {splitWords = this.activeObj.shape.split('-'); }
                if (this.currObjType.isCustomCrop || splitWords[0] === 'crop') {
                    activeObjShape = this.currObjType.isCustomCrop ? 'custom' : splitWords[1];
                    this.updateImageRatioForActObj();
                    this.objColl.push(this.activeObj);
                    this.refreshActiveObj();
                }
            }
            this.redrawActObj();
            this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
            const zoomFactor: number = this.zoomFactor;
            this.drawRotatedImage(degree);
            this.clearOuterCanvas(this.lowerContext); this.clearOuterCanvas(this.upperContext);
            if (!isNullOrUndefined(activeObjShape)) {
                this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
                this.activeObj = extend({}, this.objColl[this.objColl.length - 1], {}, true) as SelectionPoint;
                this.objColl.pop();
                this.drawObject('duplicate', this.activeObj);
                if (!this.isReverseRotate) {this.refreshToolbar('main', true, true); }
            }
            if (!this.isUndoRedo) {this.updateUndoRedoColl('rotate', degree, this.objColl, null, zoomFactor, this.adjustmentLevel.sharpen, this.adjustmentLevel.bw); }
            this.isUndoRedo = false;
            if (isNullOrUndefined(this.activeObj.shape) && !this.isReverseRotate) {
                this.refreshToolbar('main');
            }
            else if (!this.isReverseRotate) {
                this.refreshToolbar('main', true, true);
            }
            this.alignRotateFlipColl();
        }
        return isRotate;
    }

    /**
     * Export an image using the specified file name and the extension.
     *
     * @param {string} type - Specifies a format of image to be saved. 
     * @param {string} fileName – Specifies a file name to be saved
     *
     * @returns {void}.
     */
    public export(type?: string, fileName?: string): void {
        if (!this.disabled && this.isImageLoaded) {
            if (this.isFreehandDrawEditing) {
                this.applyFreehandDraw();
            }
            if (this.togglePen) {
                this.currObjType.isZoomed = true;
                this.apply();
            }
            if (this.textArea.style.display === 'block') {
                this.redrawActObj();
            }
            this.applyActObj();
            this.lowerContext.filter = this.canvasFilter;
            type = type ? type : 'Png';
            this.redrawActObj();
            const beforeSave: BeforeSaveEventArgs = { cancel: false, fileName: fileName ? fileName : this.fileName,
                fileType: type as FileType};
            const saved: SaveEventArgs = { fileName: fileName ? fileName : this.fileName, fileType: type as FileType};
            this.trigger('beforeSave', beforeSave, (observableSaveArgs: BeforeSaveEventArgs) => {
                if (!observableSaveArgs.cancel) {
                    this.currObjType.isSave = true;
                    fileName = observableSaveArgs.fileName ? observableSaveArgs.fileName : fileName;
                    if (type.toLowerCase() === 'svg') {
                        fileName = fileName || this.fileName;
                        this.toSVGImg(fileName);
                    } else if (type.toLowerCase() === 'jpeg') {
                        fileName = fileName || this.fileName;
                        this.toBlobFn(fileName, type.toLowerCase());
                    } else {
                        fileName = fileName || this.fileName;
                        this.toBlobFn(fileName, type.toLowerCase());
                    }
                    this.trigger('saved', saved);
                    this.refreshToolbar('main');
                    this.lowerCanvas.style.left = this.upperCanvas.style.left = ''; this.lowerCanvas.style.top = this.upperCanvas.style.top = '';
                    this.lowerCanvas.style.maxWidth = this.upperCanvas.style.maxWidth = ''; this.lowerCanvas.style.maxHeight = this.upperCanvas.style.maxHeight = '';
                }
            });
        }
    }

    /**
     * Perform selection in an image editor. The selection helps to crop an image.
     *
     * @param {string} type - Specifies the shape - circle / square / custom selection / pre-defined ratios.
     * @param {number} startX – Specifies the start x-coordinate point of the selection.
     * @param {number} startY – Specifies the start y-coordinate point of the selection.
     * @param {number} width - Specifies the width of the selection area.
     * @param {number} height - Specifies the height of the selection area.
     * @returns {void}.
     *   ```html
     * <div id='imageeditor'></div>
     * ```
     * ```typescript
     * <script>
     * var imageObj = new ImageEditor({
     *   created : () => {
     *     imageObj.select('16:9', 10, 10);
     *  }
     * });
     * imageObj.appendTo("#imageeditor");
     * </script>
     * ```
     */
    public select(type: string, startX?: number, startY?: number, width?: number, height?: number): void {
        if (!this.disabled && this.isImageLoaded) {
            if (this.zoomFactor > 0 && !isNullOrUndefined(this.activeObj.shape) && this.activeObj.shape.split('-')[0] === 'crop' && isNullOrUndefined(this.currentSelectionPoint)) {
                this.currentSelectionPoint = extend({}, this.activeObj, {}, true) as SelectionPoint;
            }
            let isPrevent: boolean = false; let splitWords: string[];
            if (this.activeObj.shape !== undefined) {splitWords = this.activeObj.shape.split('-'); }
            if (splitWords === undefined && this.currObjType.isCustomCrop) {
                isPrevent = true;
            } else if (splitWords !== undefined && splitWords[0] === 'crop'){
                isPrevent = true;
            }
            this.redrawActObj();
            this.refreshActiveObj();
            this.keyHistory = '';
            this.upperContext.clearRect(0, 0 , this.upperCanvas.width, this.upperCanvas.height);
            this.upperCanvas.style.display = 'block';
            if (!isNullOrUndefined(this.currSelectionPoint) || this.defaultZoomFactor > 0 ||
                (this.degree !== 0 && this.totalPannedInternalPoint.x !== 0 && this.totalPannedInternalPoint.y !== 0 && !isPrevent)) {
                this.isCircleCrop = false;
                if (this.defaultZoomFactor > 0) {
                    const zoomFactor: number = this.zoomFactor = this.defaultZoomFactor;
                    this.isCropTab = false;
                    for (let i: number = 0; i < (zoomFactor * 10); i++) {
                        this.zoom(-0.1);
                    }
                    this.resetPanPoints();
                }
                this.cancelObjColl = extend([], this.objColl, [], true) as SelectionPoint[];
                this.cancelPointColl = extend([], this.pointColl, [], true) as Point[];
                this.isCropTab = true;
                this.setCurrSelectionPoints(true);
                this.zoomFactor = this.cropZoomFactor;
                if (isNullOrUndefined(this.cropObj.activeObj.shape)) {
                    this.drawNewSelection(type, startX, startY, width, height);
                }
            } else {
                if (type === 'custom') {this.currObjType.shape = ''; }
                this.drawNewSelection(type, startX, startY, width, height);
            }
        }
    }

    /**
     * Enable or disable a freehand drawing in an Image Editor.
     *
     * @param {boolean} value - Specifies a value whether enable or disable freehand drawing. 
     *
     * @returns {void}.
     * @private
     */
    public freeHandDraw(value: boolean): void {
        if (value) {
            this.points = [];
            this.refreshActiveObj();
            this.togglePen = true;
            this.upperCanvas.style.cursor = 'crosshair';
            this.upperCanvas.style.display = 'block';
            if (isNullOrUndefined(this.activeObj.strokeSettings)) {
                this.activeObj.strokeSettings = this.strokeSettings;
            }
            if (isNullOrUndefined(this.activeObj.strokeSettings.strokeWidth)) {
                this.activeObj.strokeSettings.strokeWidth =  4;
            }
            this.refreshToolbar('pen');
        } else {
            this.upperCanvas.style.cursor = 'default';
            this.apply();
            this.refreshToolbar('main');
            this.currentToolbar = 'main';
            this.isFreehandDrawCustomized = false;
        }
    }

    /**
     * Enable or disable a freehand drawing in an Image Editor.
     *
     * @param {boolean} value - Specifies a value whether enable or disable freehand drawing. 
     *
     *  @returns {void}.
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
     * @returns {void}.
     */
    public pan(value: boolean): void {
        if (!this.disabled && this.isImageLoaded) {
            if (value) {
                this.togglePan = true;
                this.redrawActObj();
                this.dragCanvas = true;
                this.lowerCanvas.style.cursor = this.upperCanvas.style.cursor = 'grab';
                this.panDown = null;
            } else {
                this.dragCanvas = this.togglePan = this.currObjType.isCustomCrop = false;
                this.lowerCanvas.style.cursor = this.upperCanvas.style.cursor = 'default';
            }
        }
    }

    private setDestPointsForFlipState(isUpdate?: boolean): void {
        if (this.getCurrentPanRegion() !== '') {
            if (this.getCurrentPanRegion() === 'horizontal') {
                this.destLeft = this.lowerCanvas.clientWidth - (this.destWidth + this.destLeft);
            } else if (this.getCurrentPanRegion() === 'vertical') {
                this.destTop = this.lowerCanvas.clientHeight - (this.destHeight + this.destTop);
            } else {
                this.destLeft = this.lowerCanvas.clientWidth - (this.destWidth + this.destLeft);
                this.destTop = this.lowerCanvas.clientHeight - (this.destHeight + this.destTop);
            }
            if (!isNullOrUndefined(isUpdate)) {
                this.updateObjAndFreeHandDrawColl();
            }
        }
    }

    /**
     * Increase / Decrease the magnification of an image.
     *
     * @param {boolean} value - Specifies a value to be zoomed on the image.
     * @returns {void}.
     */
    public zoom(value: number): void {
        if (!this.disabled && this.isImageLoaded) {
            if ((this.zoomFactor === 0 && value < 0) || (this.zoomFactor > 5 && value > 0 ||
                (this.zoomFactor > 0 && value < 0 && this.disableZoomOutBtn()))) {
                return;
            }
            let splitWords: string[]; let tempActiveObj: SelectionPoint; let isShape: boolean = false;
            if (this.activeObj.shape !== undefined) {splitWords = this.activeObj.shape.split('-'); }
            if (splitWords !== undefined && splitWords[0] === 'crop') {
                tempActiveObj = extend({}, this.activeObj, {}, true) as SelectionPoint;
                this.isCropTab = true;
            } else if (!isNullOrUndefined(this.activeObj.shape) && splitWords[0] !== 'crop') {
                isShape = true;
            }
            this.redrawActObj();
            this.refreshActiveObj();
            this.upperContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
            this.lowerContext.filter = this.canvasFilter;
            this.upperCanvas.style.cursor = 'default';
            let zoomState: number; let objColl: SelectionPoint[] = extend([], this.objColl, [], true) as SelectionPoint[];
            if (value === 3.75 || value === 1) {zoomState = 0.1; }
            else if (value === -3.75) {zoomState = -0.1; }
            else {
                zoomState = value;
            }
            if (!this.isCropTab) {
                if (this.degree !== 0) {
                    this.redrawActObj();
                    this.currentPannedPoint = {x: 0, y: 0};
                    this.rotatePan();
                }
                this.setDestPointsForFlipState(true);
            }
            if (this.degree === 0) {
                this.drawZoomImgToCanvas(value, tempActiveObj);
                if (this.getCurrentPanRegion() !== '') {
                    this.tempFlipPanPoint.x += this.totalPannedPoint.x;
                    this.tempFlipPanPoint.y += this.totalPannedPoint.y;
                    objColl = extend([], this.objColl, [], true) as SelectionPoint[];
                    this.objColl = [];
                    this.rotatedFlip();
                    if (this.totalPannedPoint.x !== 0 || this.totalPannedPoint.y !== 0) {
                        this.totalPannedPoint = { x: 0, y: 0 };
                    }
                    if (this.tempPannedPoint.x !== 0 || this.tempPannedPoint.y !== 0) {
                        this.tempPannedPoint = { x: 0, y: 0 };
                    }
                }
            } else {
                this.updateObjAndFreeHandDrawColl();
                this.totalPannedClientPoint = { x: 0, y: 0 };
                this.totalPannedInternalPoint = { x: 0, y: 0 };
                this.rotateZoom(value);
                if (this.getCurrentPanRegion() !== '') {
                    const temp: string = this.lowerContext.filter;
                    this.lowerContext.filter = 'none';
                    this.zoomObjColl();
                    this.zoomFreehandDrawColl();
                    this.lowerContext.filter = temp;
                }
            }
            if (this.getCurrentPanRegion() === '') {
                const temp: string = this.lowerContext.filter;
                this.lowerContext.filter = 'none';
                this.zoomObjColl();
                this.zoomFreehandDrawColl();
                this.lowerContext.filter = temp;
            } else if (this.degree === 0) {
                const temp: string = this.lowerContext.filter;
                this.lowerContext.filter = 'none';
                const destLeft: number = this.destLeft; const destTop: number = this.destTop;
                this.setDestPointsForFlipState();
                this.objColl = objColl;
                this.zoomObjColl();
                this.zoomFreehandDrawColl();
                this.destLeft = destLeft; this.destTop = destTop;
                this.lowerContext.filter = temp;
            }
            if ((!isNullOrUndefined(this.currSelectionPoint) && this.currSelectionPoint.shape === 'crop-circle') || this.isCircleCrop) {
                this.cropCircle(this.lowerContext);
            }
            this.clearOuterCanvas(this.lowerContext);
            this.refreshActiveObj();
            if (!isNullOrUndefined(tempActiveObj)) {
                this.activeObj = extend({}, tempActiveObj, {}, true) as SelectionPoint;
                this.drawObject('duplicate', this.activeObj);
                if (this.currentToolbar === 'crop') {
                    this.refreshToolbar('main', true, true);
                } else {
                    this.refreshToolbar(this.currentToolbar, true, true);
                }
                if (this.zoomFactor === 0) {this.currSelectionPoint = null; }
            }
            if (!this.isUndoRedo) {this.updateUndoRedoColl('zoom', zoomState, this.objColl, null, this.zoomFactor, this.adjustmentLevel.sharpen, this.adjustmentLevel.bw); }
            this.isUndoRedo = false;
            const zoomOut: HTMLElement = document.querySelector('#' + this.element.id + '_zoomOut');
            if (!isNullOrUndefined(zoomOut) && this.zoomFactor === 0) {
                zoomOut.classList.add('e-disabled');
                zoomOut.parentElement.classList.add('e-overlay');
            } else if (!isNullOrUndefined(zoomOut)) {
                zoomOut.classList.remove('e-disabled');
                zoomOut.parentElement.classList.remove('e-overlay');
            }
            if (!this.togglePan) {
                this.callMainToolbar(false, true);
            }
            this.autoEnablePan();
            if (!isNullOrUndefined(tempActiveObj)) {
                this.activeObj = extend({}, tempActiveObj, {}, true) as SelectionPoint;
            }
            if (this.activeObj.shape === 'crop-custom') {this.currObjType.isCustomCrop = true; }
            if (isNullOrUndefined(this.activeObj.activePoint) || this.activeObj.activePoint.width === 0) {
                if (this.currentToolbar === 'crop' || !isNullOrUndefined(tempActiveObj)) {
                    this.refreshToolbar('main', true, true);
                } else {
                    this.refreshToolbar('main');
                    this.currentToolbar = 'main';
                }
            } else {
                if (this.currentToolbar === 'crop' || !isNullOrUndefined(tempActiveObj)) {
                    this.refreshToolbar('main', true, true);
                } else {
                    this.refreshToolbar('main');
                    this.currentToolbar = 'main';
                }
            }
            const panBtn: HTMLElement = this.element.querySelector('.e-img-pan .e-btn');
            if (!isNullOrUndefined(panBtn) && this.togglePan) {
                panBtn.classList.add('e-selected-btn');
            } else if (!isNullOrUndefined(panBtn)) {
                panBtn.classList.remove('e-selected-btn');
            }
            if (isShape) {
                this.activeObj = extend({}, this.objColl[this.objColl.length - 1], {}, true) as SelectionPoint;
                this.objColl.pop();
                this.drawObject('duplicate', this.activeObj);
                if (this.activeObj.shape === 'text') {
                    this.refreshToolbar('text');
                } else {
                    this.refreshToolbar('shapes');
                }
                this.updateToolbarItems();
            }
        }
    }

    /**
     * Draw ellipse on an image.
     *
     * @param {number} x - Specifies x-coordinate of ellipse.
     * @param {number} y - Specifies y-coordinate of ellipse.
     * @param {number} radiusX - the radius x point for the ellipse.
     * @param {number} radiusY - the radius y point for the ellipse.
     * @param {number} strokeWidth - the stroke width of ellipse.
     * @param {string} strokeColor - the stroke color of ellipse.
     * @param {string} fillColor - the fill color of the ellipse.
     * @returns {boolean}.
     *
     * ```html
     * <div id='imageeditor'></div>
     * ```
     * ```typescript
     * <script>
     * * var imageObj = new ImageEditor({
     * created: () => {
     * imageObj.drawEllipse(10, 10, 40, 60);
     * }
     * });
     * imageObj.appendTo("#imageeditor");
     * </script>
     * ```
     */
    public drawEllipse(x?: number, y?: number, radiusX?: number, radiusY?: number, strokeWidth?: number, strokeColor?: string,
                       fillColor?: string): boolean {
        let isEllipse: boolean = false;
        const inRange: boolean = this.isPointsInRange(x, y);
        if (!this.disabled && this.isImageLoaded && inRange) {
            isEllipse = true;
            this.redrawActObj();
            this.activeObj.shape = 'ellipse';
            if (this.currObjType.shape === 'freehanddraw') {
                this.apply(); this.upperCanvas.style.cursor = 'default';
                this.currObjType.shape = '';
            }
            this.currObjType.isCustomCrop = false;
            const start: Point = {x: x, y: y};
            this.drawShape('ellipse', strokeWidth, strokeColor, fillColor, start, radiusX, radiusY);
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
        const inRange: boolean = this.isPointsInRange(startX, startY);
        if (!this.disabled && this.isImageLoaded && inRange) {
            isLine = true;
            this.redrawActObj();
            this.activeObj.shape = 'line';
            if (this.currObjType.shape === 'freehanddraw') {
                this.apply(); this.upperCanvas.style.cursor = 'default';
                this.currObjType.shape = '';
            }
            this.currObjType.isCustomCrop = false;
            const start: Point = {x: startX, y: startY};
            const width: number = endX - startX; const height: number = endY - startY;
            this.drawShape('line', strokeWidth, strokeColor, null, start, width, height);
        }
        return isLine;
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
     * @param {string} fillColor - the fill color of the rectangle.
     * @returns {boolean}.
     */
    public drawRectangle(x?: number, y?: number, width?: number, height?: number, strokeWidth?: number, strokeColor?: string,
                         fillColor?: string): boolean {
        let isRectangle: boolean = false;
        const inRange: boolean = this.isPointsInRange(x, y);
        if (!this.disabled && this.isImageLoaded && inRange) {
            isRectangle = true;
            this.redrawActObj();
            this.activeObj.shape = 'rectangle';
            if (this.currObjType.shape === 'freehanddraw') {
                this.apply(); this.upperCanvas.style.cursor = 'default';
                this.currObjType.shape = '';
            }
            this.currObjType.isCustomCrop = false;
            const start: Point = {x: x, y: y};
            this.drawShape('rectangle', strokeWidth, strokeColor, fillColor, start, width, height);
        }
        return isRectangle;
    }

    /**
     * Draw a text on an image.
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
     * ```html
     * <div id='imageeditor'></div>
     * ```
     * ```typescript
     * <script>
     * var imageObj = new ImageEditor({
     * created: () => {
     *  imageObj.drawText(10, 10, 'Syncfusion', 'Arial', 12, true, true, '#000');
     * }
     * });
     * imageObj.appendTo("#imageeditor");
     *
     * </script>
     * ```
     */
    public drawText(x?: number, y?: number, text?: string, fontFamily?: string, fontSize?: number, bold?: boolean, italic?: boolean,
                    color?: string): boolean {
        let isText: boolean = false;
        const inRange: boolean = this.isPointsInRange(x, y);
        if (!this.disabled && this.isImageLoaded && inRange) {
            isText = true;
            this.drawShapeText(text, fontFamily, fontSize, bold, italic, color, x, y);
        }
        return isText;
    }

    /**
     * Selects a shape based on the given shape id. The id can be got from the public method ‘getShapeSettings’.
     *
     * @param {string} id - Specifies the shape id to select a shape on an image.
     * @returns {boolean}.
     * ```html
     * <div id='imageeditor'></div>
     * ```
     * ```typescript
     * <script>
     * var imageObj = new ImageEditor({
     * created: () => {
     *  imageObj.selectShape('shape_1');
     * }
     * });
     * imageObj.appendTo("#imageeditor");
     * </script>
     * ```
     */
    public selectShape(id: string): boolean {
        let isSelected: boolean = false;
        if (!this.disabled && this.isImageLoaded) {
            this.applyActObj();
            if (id.split('_')[0] === 'shape') {
                let obj: SelectionPoint;
                for (let i: number = 0; i < this.objColl.length; i++) {
                    if (this.objColl[i as number].currIndex === id) {
                        obj = extend({}, this.objColl[i as number], {}, true) as SelectionPoint;
                        break;
                    }
                }
                if (isNullOrUndefined(obj)) {
                    isSelected = false;
                } else {
                    isSelected = true;
                    this.activeObj = obj;
                    this.lowerContext.filter = this.canvasFilter;
                    this.redrawShape(this.activeObj);
                    if (this.activeObj.shape === 'text') {
                        this.refreshToolbar('text');
                    } else if (this.activeObj.shape === 'pen') {
                        this.refreshToolbar('pen');
                    } else {
                        this.refreshToolbar('shapes');
                    }
                    this.updateToolbarItems();
                }
            } else if (id.split('_')[0] === 'pen') {
                if (this.isFreehandDrawEditing) {
                    this.okBtn();
                }
                if (this.isFreehandDrawIndex(parseInt(id.split('_')[1], 10) - 1)) {
                    isSelected = true;
                    this.selectFreehandDraw(parseInt(id.split('_')[1], 10) - 1);
                    this.updateToolbarItems();
                } else {
                    isSelected = false;
                }
            }
        }
        return isSelected;
    }

    /**
     * Deletes a shape based on the given shape id. The id can be got from the public method getShapeSettings.
     *
     * @param {string} id - Specifies the shape id to delete the shape on an image.
     * @returns {void}.
     * ```html
     * <div id='imageeditor'></div>
     * ```
     * ```typescript
     * <script>
     * var imageObj = new ImageEditor({
     * created: () => {
     *  imageObj.deleteShape('shape_1');
     * }
     * });
     * imageObj.appendTo("#imageeditor");
     * </script>
     * ```
     */
    public deleteShape(id: string): void {
        if (!this.disabled && this.isImageLoaded) {
            this.applyActObj();
            if (id.split('_')[0] === 'shape') {
                for (let i: number = 0; i < this.objColl.length; i++) {
                    if (this.objColl[i as number].currIndex === id) {
                        this.objColl.splice(i, 1);
                        break;
                    }
                }
            } else if (id.split('_')[0] === 'pen') {
                if (this.isFreehandDrawIndex(parseInt(id.split('_')[1], 10) - 1)) {
                    this.deleteFreehandDraw(parseInt(id.split('_')[1], 10) - 1, true);
                }
            }
            this.lowerContext.filter = this.canvasFilter;
            this.lowerContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
            this.redrawImgWithObj();
            this.refreshToolbar('main');
        }
    }

    /**
     * Get particular shapes details based on id of the shape which is drawn on an image editor.
     *
     * @param {string} id - Specifies the shape id on an image.
     * @returns {ShapeSettings}.
     * ```html
     * <div id='imageeditor'></div>
     * ```
     * ```typescript
     * <script>
     * var imageObj = new ImageEditor({
     * created: () => {
     *  imageObj.getShapeSetting('shape_1');
     * }
     * });
     * imageObj.appendTo("#imageeditor");
     * </script>
     * ```
     */
    public getShapeSetting(id: string): ShapeSettings {
        let shapeDetails: ShapeSettings;
        if (!this.disabled && this.isImageLoaded) {
            this.applyActObj();
            if (id.split('_')[0] === 'shape') {
                let obj: SelectionPoint;
                for (let i: number = 0; i < this.objColl.length; i++) {
                    if (this.objColl[i as number].currIndex === id) {
                        obj = extend({}, this.objColl[i as number], {}, true) as SelectionPoint;
                        break;
                    }
                }
                shapeDetails = this.getObjDetails(obj);
            } else if (id.split('_')[0] === 'pen') {
                shapeDetails = this.getFreehandDrawDetails(parseInt(id.split('_')[1], 10) - 1);
            }
        }
        return shapeDetails;
    }

    /**
     * Get all the shapes details which is drawn on an image editor.
     *
     * @returns {ShapeSettings[]}.
     */
    public getShapeSettings(): ShapeSettings[] {
        const shapeDetailsColl: ShapeSettings[] = [];
        if (!this.disabled && this.isImageLoaded) {
            this.applyActObj();
            for (let i: number = 0; i < this.objColl.length; i++) {
                const shapeDetails: ShapeSettings = this.getObjDetails(this.objColl[i as number]);
                shapeDetailsColl.push(shapeDetails);
            }
            for (let i: number = 0; i < this.freehandCounter; i++) {
                const shapeDetails: ShapeSettings = this.getFreehandDrawDetails(i as number);
                shapeDetailsColl.push(shapeDetails);
            }
        }
        return shapeDetailsColl;
    }

    /**
     * To refresh the Canvas Wrapper.
     *
     * @returns {void}.
     */
    public update(): void {
        const canvasWrapper: HTMLElement = document.querySelector('#' + this.element.id + '_canvasWrapper');
        if (!isNullOrUndefined(canvasWrapper)) {
            canvasWrapper.style.width = this.element.offsetWidth - 2 + 'px';
        }
        this.lowerCanvas.width = this.upperCanvas.width = this.element.offsetWidth - 2;
        if (Browser.isDevice) {
            if (!isNullOrUndefined(canvasWrapper)) {
                canvasWrapper.style.height = this.element.offsetHeight - (2 * this.toolbarHeight) - 5 + 'px';
            }
            this.lowerCanvas.height = this.upperCanvas.height = this.element.offsetHeight - (2 * this.toolbarHeight) - 5;
        } else {
            if (!isNullOrUndefined(canvasWrapper)) {
                canvasWrapper.style.height = this.element.offsetHeight - this.toolbarHeight - 3 + 'px';
            }
            this.lowerCanvas.height = this.upperCanvas.height = this.element.offsetHeight - this.toolbarHeight - 3;
        }
        this.lowerContext.filter = this.canvasFilter = this.initialAdjustmentValue = this.adjustmentValue = this.getDefaultFilter();
        this.lowerContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
        this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
    }

    /**
     * To apply the filters to an image
     *
     * @param {ImageFinetuneOptions } finetuneOption - Specifies the finetune options to the image.
     * @param {number } value - Specifies the value for finetuning the image.
     * @returns {void}.
     *
     */
    public finetuneImage(finetuneOption: ImageFinetuneOptions, value: number): void {
        if (!this.disabled && this.isImageLoaded) {
            switch (finetuneOption.toLowerCase()) {
            case 'brightness':
                this.setBrightness(value);
                break;
            case 'contrast':
                this.setContrast(value);
                break;
            case 'hue':
                this.setHue(value);
                break;
            case 'saturation':
                this.setSaturation(value);
                break;
            case 'opacity':
                this.setOpacity(value);
                break;
            case 'blur':
                this.setBlur(value);
                break;
            case 'exposure':
                this.setExposure(value);
                break;
            }
            this.canvasFilter = this.lowerContext.filter;
        }
    }

    /**
     * To apply the filters to an image
     *
     * @param {ImageFilterOptions } filterOption - Specifies the filter options to the image.
     * @returns {void}.
     */
    public applyImageFilter(filterOption: ImageFilterOptions): void {
        if (!this.disabled && this.isImageLoaded) {
            this.setFilter(filterOption.toString());
            this.canvasFilter = this.lowerContext.filter;
        }
    }

    /**
     * Undo the last user action.
     *
     * @private
     * @returns {void}.
     */
    public undo(): void {
        if (!this.disabled && this.isImageLoaded) {
            if (this.undoRedoStep > 0) {
                if (!isNullOrUndefined(this.activeObj.shape)) {
                    this.refreshToolbar('shapes');
                } else {
                    this.refreshToolbar('main');
                }
                if (this.activeObj.activePoint.width !== 0) {
                    this.tempActObj = this.activeObj;
                }
                //this.refreshActiveObj();
                this.undoRedoStep--;
                this.enableDisableToolbarBtn();
                this.isUndoRedo = true;
                this.lowerContext.filter = this.canvasFilter;
                const obj: Transition = this.undoRedoColl[this.undoRedoStep];
                if (this.undoRedoColl.length === this.undoRedoStep) { this.currObjType.isUndoAction = false; }
                else { this.currObjType.isUndoAction = true; }
                if (obj.operation !== 'textTransform' && this.textArea.style.display === 'block') {
                    this.textArea.style.display = 'none';
                }
                this.element.querySelector('.e-contextual-toolbar-wrapper').classList.add('e-hide');
                let xDiff: number; let yDiff: number; let tempUndoRedoColl: Transition[] = []; let prevObj: SelectionPoint; let value: string = '';
                switch (obj.operation) {
                case 'rotate':
                    if (obj.value === 90) {
                        value = 'rotateleft';
                    } else if (obj.value === -90) {
                        value = 'rotateright';
                    }
                    this.performTransformation(value);
                    break;
                case 'flip':
                    if ((obj.value as string).toLowerCase() === 'horizontal') {
                        value = 'horizontalflip';
                    } else if ((obj.value as string).toLowerCase() === 'vertical') {
                        value = 'verticalflip';
                    }
                    this.performTransformation(value);
                    break;
                case 'zoom':
                    if (this.zoomFactor === 0 && obj.zoomFactor !== 0) {
                        this.zoomFactor = obj.zoomFactor;
                    }
                    this.zoom(-obj.value as number); this.isUndoRedo = true;
                    break;
                case 'pan':
                    xDiff = this.destLeft; yDiff = this.destTop;
                    this.destLeft = (obj.previousObj as Dimension).x;
                    this.destTop = (obj.previousObj as Dimension).y;
                    xDiff += this.destLeft; yDiff += this.destTop;
                    this.drawPannedImage(xDiff, yDiff);
                    break;
                case 'crop':
                    if (!isNullOrUndefined(this.currSelectionPoint)) {
                        tempUndoRedoColl = extend([], this.undoRedoColl, [], true) as Transition[];
                        this.select('Custom');
                        this.refreshToolbar('main', true, true);
                        (getComponent(this.element.querySelector('#' + this.element.id + '_cropBtn') as HTMLElement, 'dropdown-btn') as DropDownButton).toggle();
                        this.undoRedoColl = tempUndoRedoColl;
                        this.enableDisableToolbarBtn();
                    }
                    break;
                case 'freehanddraw':
                    this.pointColl = obj.previousObj;
                    this.freehandCounter--;
                    this.lowerContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
                    this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
                    this.isUndoRedo = true; this.redrawImgWithObj();
                    break;
                case 'freehanddrawCustomized':
                    this.pointColl = obj.previousObj;
                    this.lowerContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
                    this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
                    this.isUndoRedo = true; this.redrawImgWithObj();
                    break;
                case 'delete':
                    if (obj.value === 'freehanddraw') {
                        this.pointColl = obj.previousObj;
                        this.freehandCounter++;
                    } else if (obj.value === 'shape') {
                        this.objColl = obj.previousObj as SelectionPoint[];
                    }
                    this.lowerContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
                    this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
                    this.isUndoRedo = true; this.redrawImgWithObj();
                    break;
                case 'selectionTransform':
                    this.activeObj = extend({}, obj.previousSelectionObj, {}, true) as SelectionPoint;
                    this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
                    if (this.activeObj.activePoint.width !== 0 && this.activeObj.activePoint.height !== 0) {
                        this.drawObject('duplicate', this.activeObj);
                        this.refreshToolbar('main', true, true);
                    } else {
                        this.refreshToolbar('main');
                    }
                    this.currObjType.isCustomCrop = false;
                    break;
                case 'shapeTransform':
                    this.objColl = extend([], obj.previousObj, [], true) as SelectionPoint[];
                    this.lowerContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
                    this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
                    this.isUndoRedo = true; this.redrawImgWithObj();
                    this.refreshActiveObj();
                    break;
                case 'textTransform':
                    this.objColl = extend([], obj.previousObj, [], true) as SelectionPoint[];
                    for (let i: number = 0; i < (obj.previousObj as SelectionPoint[]).length; i++) {
                        if (this.tempActObj.currIndex === (obj.previousObj as SelectionPoint[])[i as number].currIndex) {
                            prevObj = extend({}, obj.previousObj[i as number], {}, true) as SelectionPoint;
                            this.objColl.splice(i, 1);
                            break;
                        }
                    }
                    if (!isNullOrUndefined(prevObj)) {
                        this.updateTextBox(prevObj);
                    }
                    break;
                case 'text':
                    if (!isNullOrUndefined(this.tempActObj)) {
                        this.activeObj = extend({}, this.tempActObj, {}, true) as SelectionPoint;
                    }
                    if ((obj.value as SelectionPoint[]).length === 0 && this.objColl.length === 1) {
                        this.tempActObj = extend({}, this.objColl[0], {}, true) as SelectionPoint;
                    } else {
                        for (let i: number = 0; i < this.objColl.length; i++) {
                            if (!isNullOrUndefined(this.objColl[i as number]) &&
                            isNullOrUndefined((obj.value as SelectionPoint[])[i as number])) {
                                this.tempActObj = extend({}, (obj.value as SelectionPoint[])[i as number], {}, true) as SelectionPoint;
                                break;
                            }
                            if ((obj.value as SelectionPoint[])[i as number].currIndex !== this.objColl[i as number].currIndex) {
                                this.tempActObj = extend({}, this.objColl[i as number], {}, true) as SelectionPoint;
                                break;
                            }
                        }
                    }
                    this.activeObj = extend({}, this.tempActObj, {}, true) as SelectionPoint;
                    this.objColl = extend([], obj.value, [], true) as SelectionPoint[];
                    this.lowerContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
                    this.isUndoRedo = true; this.redrawImgWithObj();
                    this.textArea.style.display = 'block';
                    this.textArea.value = obj.previousObj as string;
                    break;
                case 'brightness':
                case 'contrast':
                case 'hue':
                case 'saturation':
                case 'opacity':
                case 'blur':
                case 'exposure':
                    this.lowerContext.filter = this.canvasFilter = obj.previousObj as string;
                    if (this.lowerContext.filter.split(' ').length > 1 &&
                        this.lowerContext.filter.split(' ')[0].split('(')[1].split(')')[0] === '1') {
                        this.isBrightnessAdjusted = false;
                    }
                    this.setAdjustment(obj.operation); this.isUndoRedo = true;
                    break;
                case 'default':
                case 'chrome':
                case 'cold':
                case 'warm':
                case 'grayscale':
                case 'sepia':
                case 'invert':
                    this.updateFilter(obj);
                    break;
                }
            }
        }
    }

    /**
     * Redo the last user action.
     *
     * @private
     * @returns {void}.
     */
    public redo(): void {
        if (!this.disabled && this.isImageLoaded) {
            if (this.undoRedoStep < this.undoRedoColl.length) {
                if (!isNullOrUndefined(this.activeObj.shape)) {
                    this.refreshToolbar('shapes');
                } else {
                    this.refreshToolbar('main');
                }
                this.undoRedoStep++;
                this.enableDisableToolbarBtn();
                this.isUndoRedo = true;
                this.lowerContext.filter = this.canvasFilter;
                const obj: Transition = this.undoRedoColl[this.undoRedoStep - 1];
                if (this.undoRedoColl.length === this.undoRedoStep) { this.currObjType.isUndoAction = false; }
                else { this.currObjType.isUndoAction = true; }
                if (obj.operation !== 'textTransform' && this.textArea.style.display === 'block') {
                    this.textArea.style.display = 'none';
                }
                this.element.querySelector('.e-contextual-toolbar-wrapper').classList.add('e-hide');
                const selEle: HTMLElement = this.element.querySelector('.e-contextual-toolbar-wrapper .e-toolbar-item.e-selected');
                let xDiff: number; let yDiff: number; let tempUndoRedoColl: Transition[]; let tempUndoRedoStep: number; let value: string = '';
                let currObj: SelectionPoint;
                switch (obj.operation) {
                case 'rotate':
                    if (obj.value === 90) {
                        value = 'rotateright';
                    } else if (obj.value === -90) {
                        value = 'rotateleft';
                    }
                    this.performTransformation(value);
                    break;
                case 'flip':
                    if ((obj.value as string).toLowerCase() === 'horizontal') {
                        value = 'horizontalflip';
                    } else if ((obj.value as string).toLowerCase() === 'vertical') {
                        value = 'verticalflip';
                    }
                    this.performTransformation(value);
                    break;
                case 'zoom':
                    this.zoom(obj.value as number);
                    break;
                case 'pan':
                    xDiff = this.destLeft; yDiff = this.destTop;
                    this.destLeft = (obj.currentObj as Dimension).x;
                    this.destTop = (obj.currentObj as Dimension).y;
                    xDiff += this.destLeft; yDiff += this.destTop;
                    this.drawPannedImage(xDiff, yDiff);
                    break;
                case 'crop':
                    this.cropImg(); this.refreshToolbar('main');
                    break;
                case 'freehanddraw':
                    this.pointColl = obj.currentObj;
                    this.freehandCounter++;
                    this.lowerContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
                    this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
                    this.isUndoRedo = true; this.redrawImgWithObj();
                    break;
                case 'freehanddrawCustomized':
                    this.pointColl = obj.currentObj;
                    this.lowerContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
                    this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
                    this.isUndoRedo = true; this.redrawImgWithObj();
                    break;
                case 'delete':
                    if (obj.value === 'freehanddraw') {
                        this.pointColl = obj.currentObj;
                        this.freehandCounter--;
                    } else if (obj.value === 'shape') {
                        this.objColl = obj.currentObj as SelectionPoint[];
                    }
                    this.lowerContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
                    this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
                    this.isUndoRedo = true; this.redrawImgWithObj();
                    break;
                case 'selectionTransform':
                    if (this.zoomFactor !== obj.zoomFactor) {
                        if (this.zoomFactor > 0) {
                            this.zoom(-this.zoomFactor);
                        } else {
                            this.zoom(Math.abs(this.zoomFactor));
                        }
                    }
                    this.activeObj = extend({}, obj.currentSelectionObj, {}, true) as SelectionPoint;
                    this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
                    if (this.activeObj.activePoint.width !== 0 && this.activeObj.activePoint.height !== 0) {
                        this.drawObject('duplicate', this.activeObj);
                        this.refreshToolbar('main', true, true);
                    } else {
                        this.refreshToolbar('main');
                    }
                    break;
                case 'shapeTransform':
                    this.objColl = extend([], obj.currentObj, [], true) as SelectionPoint[];
                    this.lowerContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
                    this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
                    this.isUndoRedo = true; this.redrawImgWithObj();
                    this.refreshActiveObj();
                    break;
                case 'textTransform':
                    this.objColl = extend([], obj.currentObj, [], true) as SelectionPoint[];
                    for (let i: number = 0; i < (obj.previousObj as SelectionPoint[]).length; i++) {
                        if (this.tempActObj.currIndex === (obj.currentObj as SelectionPoint[])[i as number].currIndex) {
                            currObj = extend({}, obj.currentObj[i as number], {}, true) as SelectionPoint;
                            this.objColl.splice(i, 1);
                            break;
                        }
                    }
                    if (!isNullOrUndefined(currObj)) {
                        this.updateTextBox(currObj);
                    }
                    break;
                case 'text':
                    if (!isNullOrUndefined(this.tempActObj)) {
                        this.activeObj = extend({}, this.tempActObj, {}, true) as SelectionPoint;
                    }
                    this.objColl = extend([], obj.value, [], true) as SelectionPoint[];
                    this.lowerContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
                    this.isUndoRedo = true; this.redrawImgWithObj();
                    this.textArea.style.display = 'block';
                    this.textArea.value = obj.currentObj as string;
                    tempUndoRedoColl = extend([], this.undoRedoColl, [], true) as Transition[];
                    tempUndoRedoStep = this.undoRedoStep;
                    this.redrawActObj();
                    this.undoRedoColl = tempUndoRedoColl;
                    this.undoRedoStep = tempUndoRedoStep;
                    this.textArea.style.display = 'none';
                    this.textArea.value = '';
                    break;
                case 'brightness':
                case 'contrast':
                case 'hue':
                case 'saturation':
                case 'opacity':
                case 'blur':
                case 'exposure':
                    this.lowerContext.filter = this.canvasFilter = obj.currentObj as string;
                    this.setAdjustment(obj.operation);
                    break;
                case 'default':
                case 'chrome':
                case 'cold':
                case 'warm':
                case 'grayscale':
                case 'sepia':
                case 'invert':
                    if (selEle) {selEle.classList.remove('e-selected'); }
                    if (document.getElementById(this.element.id + '_' + obj.operation + 'Canvas')) {
                        document.getElementById(this.element.id + '_' + obj.operation + 'Canvas').parentElement.classList.add('e-selected');
                    }
                    this.currentFilter = this.element.id + '_' + obj.operation;
                    this.lowerContext.filter = this.canvasFilter = obj.currentObj as string;
                    this.lowerContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
                    this.redrawImgWithObj();
                    break;
                }
                if (this.undoRedoStep === this.undoRedoColl.length) {this.isUndoRedo = false; }
            }
        }
    }
}

/**
 * Defines the Image Editor file type.
 */
export type FileType = 'Png' | 'Jpeg' | 'Svg';

/**
 * Defines the direction to flip the image on Image Editor.
 */
export type Direction = 'Horizontal' | 'Vertical';

/**
 * Defines the Image Editor shape type.
 */
export type ShapeType = 'Rectangle' | 'Ellipse' | 'Line' | 'Text' | 'FreehandDraw';

/**
 * Defines the theme for Image Editor.
 */
export type Theme = 'Bootstrap5' | 'Bootstrap5Dark' | 'Tailwind' | 'TailwindDark' | 'Fluent'
| 'FluentDark' | 'Bootstrap4' | 'Bootstrap' | 'BootstrapDark' | 'Material' | 'MaterialDark'
| 'Fabric' | 'FabricDark' | 'Highcontrast';

/**
 * Defines the toolbar items for Image Editor.
 */
export type ImageEditorCommands = 'Crop' | 'Transform' | 'Annotate' | 'ZoomIn' | 'ZoomOut'
| 'Open' | 'Reset' | 'Save' | 'Pan' | 'Move' | 'Pen' | 'Line' | 'Rectangle' | 'Ellipse' | 'Text'
| 'CustomSelection' | 'CircleSelection' | 'SquareSelection' | 'RatioSelection'
| 'RotateLeft' | 'RotateRight' | 'FlipHorizontal' | 'FlipVertical';

/**
 * Defines the image filter options
 */
export type ImageFilterOptions = 'Default' | 'Chrome' | 'Cold' | 'Warm' | 'Grayscale' | 'Sepia' | 'Invert';

/**
 * Defines the image filter options
 */
export type ImageFinetuneOptions = 'Brightness' | 'Contrast' | 'Hue' | 'Saturation' | 'Exposure' | 'Opacity' | 'Blur';

/**
 * Interface for zoom transition occur in the imageEditor.
 */
export interface ZoomEventArgs {
    /**
     * Returns the (x, y) point to be zoomed.
     */
    zoomPoint: Point;
    /**
     * Specifies the value of zooming. Zoom in or out can be defined based on the value.
     */
    zoomLevel: number;
}

/**
 * Interface for pan transition occur in the imageEditor.
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
}

/**
 * Interface for crop transition occur in the imageEditor.
 */
export interface CropEventArgs {
    /**
     * Returns the start point of the crop region.
     */
    startPoint: Point;
    /**
     * Returns the end point of the crop region.
     */
    endPoint: Point;
}

/**
 * Interface for rotate transition in the imageEditor.
 */
export interface RotateEventArgs {
    /**
     * Returns the degree to be rotated.
     */
    degree: number;
}

/**
 * Interface for flip transition in the imageEditor.
 */
export interface FlipEventArgs {
    /**
     * Returns the direction(Horizontal and vertical) to be flipped.
     */
    direction: string;
}

/**
 * Interface for shape change in imageEditor.
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
 * Interface for Toolbar events.
 */
export interface ToolbarEventArgs {
    /**
     * Defines the cancel option to cancel the toolbar action.
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
     */
    toolbarItems?: (string | ItemModel)[];
}

/**
 * Interface for opening the image.
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
}

/**
 * Interface for saving the canvas as image.
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
 * Interface for before saving the canvas as image.
 */
export interface BeforeSaveEventArgs {
    /**
     * Defines the cancel option to cancel the save action.
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
 * Interface for Point Object in the image editor.
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
     * Gets or sets the time.
     * 
     * @private
     */
    time?: number;
}

/**
 * Interface for ShapeSettings in the imageEditor.
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
     * Returns the length of the line shape.
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
    filter: ImageFilterOptions;
}

/**
 * Interface for filter option for the image.
 */
export interface FinetuneEventArgs {
    /**
     * Specifies the type of fine tunes.
     */
    finetune: ImageFinetuneOptions;
    /**
     * Specifies the value of the fine tunes.
     */
    value: number;
}

/**
 * Defines the cropped value of all Objects for Image Editor.
 *
 * @private
 */
interface CroppedObject {
    /**
     * Gets or sets the stroke color for the object in imageEditor.
     */
    cropZoom: number;
    /**
     * Gets or sets the stroke color for the object in imageEditor.
     */
    defaultZoom: number;
    /**
     * Gets or sets the stroke color for the object in imageEditor.
     */
    totalPannedPoint: Point;
    /**
     * Gets or sets the stroke color for the object in imageEditor.
     */
    totalPannedClientPoint: Point;
    /**
     * Gets or sets the stroke color for the object in imageEditor.
     */
    totalPannedInternalPoint: Point;
    /**
     * Gets or sets the stroke color for the object in imageEditor.
     */
    activeObj: SelectionPoint;
    /**
     * Gets or sets the stroke color for the object in imageEditor.
     */
    rotateFlipColl: string[] | number[];
    /**
     * Gets or sets the stroke color for the object in imageEditor.
     */
    degree: number;
    /**
     * Gets or sets the stroke color for the object in imageEditor.
     */
    currFlipState: string;
    /**
     * Gets or sets the stroke color for the object in imageEditor.
     */
    destPoints: ActivePoint;
    /**
     * Gets or sets the stroke color for the object in imageEditor.
     */
    srcPoints: ActivePoint;
}

/**
 * Defines the stroke color, fillColor and strokeWidth properties for Image Editor.
 *
 * @private
 */
interface StrokeSettings {
    /**
     * Gets or sets the stroke color for the object in imageEditor.
     */
    strokeColor: string;
    /**
     * Gets or sets the background color for the object in imageEditor.
     */
    fillColor: string;
    /**
     * Gets or sets the stroke width for the object in imageEditor.
     */
    strokeWidth: number;
    /**
     * Gets or sets the flip state for the object in imageEditor.
     */
    flipState?: string;
}

/**
 * Defines the text, fontFamily, fontSize, bold, italic and underline properties for Image Editor.
 *
 * @private
 */
interface TextSettings {
    /**
     * Gets or sets pre-defined text on canvas.
     */
    text: string;
    /**
     * Gets or sets the fontFamily for the text content.
     */
    fontFamily: string;
    /**
     * Gets or sets the fontSize for the text content.
     */
    fontSize: number;
    /**
     * Gets or sets the fontSize for the text content.
     */
    fontRatio: number;
    /**
     * Gets or sets the bold styles for the text content.
     */
    bold: boolean;
    /**
     * Gets or sets the italic styles for the text content.
     */
    italic: boolean;
    /**
     * Gets or sets the underline styles for the text content.
     */
    underline: boolean;
}

/**
 * Interface for Transition occur in the imageEditor.
 *
 * @private
 */
interface Transition {
    /**
     * Gets function name called from the canvas.
     */
    operation?: string;
    /**
     * Gets parameter value of respective function called from the canvas.
     */
    value?: string | number | FileList | Dimension | ImageData | Object;
    /**
     * Gets previous object value.
     */
    previousObj?: SelectionPoint[] | Dimension | Object | string;
    /**
     * Gets current object value.
     */
    currentObj?: SelectionPoint[] | Dimension | Object | string;
    /**
     * Gets previous active object value.
     */
    previousSelectionObj?: SelectionPoint;
    /**
     * Gets current active object value.
     */
    currentSelectionObj?: SelectionPoint;
    /**
     * Gets previous zoom value.
     */
    zoomFactor?: number;
    /**
     * Gets previous rotate value.
     */
    degree?: number;
    /**
     * Gets previous flip value.
     */
    flipState?: string;
    /**
     * Gets previous sharpness value.
     */
    sharpen?: boolean;
    /**
     * Gets previous black and white value.
     */
    bw?: boolean;
}

/**
 * Interface for freehand drawing in the imageEditor.
 *
 * @private
 */
interface FreehandDraw {
    /**
     * Gets or sets the last width of freehandraw points in imageEditor.
     */
    lastWidth: number;

    /**
     * Gets or sets the last velocity of freehandraw points in imageEditor.
     */
    lastVelocity: number;

    /**
     * Gets or sets the time of freehandraw points in imageEditor.
     */
    time: number;

    /**
     * Gets or sets the x point of freehandraw points in imageEditor.
     */
    pointX: number;

    /**
     * Gets or sets the y point of freehandraw points in imageEditor.
     */
    pointY: number;
}

/**
 * Interface for Transition occur in the imageEditor.
 *
 * @private
 */
interface Adjustment {
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
 * Interface for interaction occur in the imageEditor.
 *
 * @private
 */
interface Interaction {
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
}

/**
 * Interface for Selection Object in the imageEditor.
 *
 * @private
 */
interface SelectionPoint {
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
}
