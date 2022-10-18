import { NotifyPropertyChanges, INotifyPropertyChanged, Property, addClass, removeClass, extend } from '@syncfusion/ej2-base';
import { Event, EmitType, EventHandler, getComponent, getInstance, isNullOrUndefined, L10n, getUniqueID } from '@syncfusion/ej2-base';
import { SignatureBase, Dimension, ActivePoint } from '@syncfusion/ej2-inputs';
import { ItemModel, Toolbar, ClickEventArgs } from '@syncfusion/ej2-navigations';
import { DropDownButton, ItemModel as DropDownButtonItemModel, MenuEventArgs, OpenCloseMenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { ColorPicker, ColorPickerEventArgs, Uploader } from '@syncfusion/ej2-inputs';
import { createSpinner, showSpinner, hideSpinner, OpenEventArgs } from '@syncfusion/ej2-popups';
import { compile, compile as templateCompiler, Browser } from '@syncfusion/ej2-base';
import { ImageEditorModel } from './image-editor-model';
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
export class ImageEditor extends SignatureBase implements INotifyPropertyChanged {
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
    private textBox: HTMLInputElement;
    private degree : number = 0;  // current rotated state
    private isUndoRedo: boolean = false;
    private dragCanvas: boolean = false;
    private dragElement: string = '';
    private keyHistory: string = '';  // text history
    private flipState: string = '';  // current flip state whether horizontal or vertical or none
    private mouseDownPoint: Point = {x: 0, y: 0};
    private previousPoint: Point = {x: 0, y: 0};  // updates prev x and y points in mouseMove
    private dragPoint: ActivePoint = {startX: 0, startY: 0, endX: 0, endY: 0};  // updates drag start and end points in mousedown and mousemove
    private diffPoint: Point = {x: 0, y: 0};  // updates resize points
    private oldPoint: Point = {} as Point;
    private objColl: SelectionPoint[] = [];  // shapes, text obj collection
    private undoRedoColl: Transition[] = [];
    private imgDataColl: Transition[] = [];  // collection of Image Data mainly used for reset state
    private currImgData: ImageData;  // Storing image data for rotate and flip
    private strokeSettings: StrokeSettings = {strokeColor: '#fff', fillColor: '', strokeWidth: null};
    private textSettings: TextSettings =
    {text: 'Enter Text', fontFamily: 'Arial', fontSize: null, bold: false, italic: false, underline: false};
    private tempStrokeSettings: StrokeSettings = {strokeColor: '#fff', fillColor: '', strokeWidth: null};
    private penStrokeWidth: number;
    private tempTextSettings: TextSettings =
    {text: 'Enter Text', fontFamily: 'Arial', fontSize: null, bold: false, italic: false, underline: false};
    private toolbarHeight: number = 46;
    private pannStart: ActivePoint = {} as ActivePoint;
    private pannEnd: ActivePoint = {} as ActivePoint;
    private togglePan: boolean = false;
    private lastX: number = 0;
    private lastY: number = 0;
    private dragStart: Point = {x: 0, y: 0};
    private dragged: boolean = false;
    private factor: number = 1; // current zoomed state
    private currFlipState: string = '';
    private touchEndPoint: Point = {} as Point;
    private flipMethod: boolean = false;
    private flipDirection: string = '';
    private prevX: number = 0;
    private currX: number = 0;
    private prevY: number = 0;
    private currY: number = 0;
    private togglePen: boolean = false;
    private rotateMethod: boolean = false;
    private isBoldbtn: boolean = false;
    private isItalicbtn: boolean = false;
    private lastAction: string = '';
    private currentToolbar: string = 'main';
    private textStartPoints: Point = {x: 0, y: 0};
    private fontSizeColl: DropDownButtonItemModel[] = [];
    private tempKeyHistory: string = '';
    private penDrawColl: PenPoint[] = [];
    private allowDrag: boolean = false;
    private textRow: number = 1;
    private activeObj: SelectionPoint = {activePoint: {startX: 0, startY: 0, endX: 0, endY: 0, width: 0, height: 0},
        flipObjColl: []} as SelectionPoint;
    private currObjType: Interaction = {shape: '', isDragging: false, isActiveObj: false, isText : false, isInitialText: false, isLine: false,
        isInitialLine: false, isCustomCrop: false, isZoomed: false};
    private defToolbarItems: ItemModel[] = [];
    private defaultLocale: Object;
    private l10n: L10n;
    private themeColl: Object;
    private toolbarFn: Function;
    private baseImgSrc: string = '';
    private isTimer: boolean = false;
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    private timer: any;
    private isScreenOriented: boolean = false;

    /**
     * Defines class/multiple classes separated by a space for customizing Image Editor UI.
     * default ''
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
     * default false
     */
    @Property(false)
    public disabled: boolean;

    /**
     * Specifies the height of the Image Editor.
     * default '100%'
     */
    @Property('100%')
    public height: string;

    /**
     * Specifies the theme of the Image Editor. The shape selection appearance will be decided based on this property.
     * The property supports all the built-in themes of Syncfusion.
     * default 'Bootstrap5'
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
     * default null
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
     * default 100%
     */
    @Property('100%')
    public width: string;

    /**
     * Gets or sets the background color of the component.
     * The background color of the component that accepts hex value, rgb and text (like 'red'). The default value is ''.
     *
     * @default ''
     * @private
     */
    @Property('')
    public backgroundColor: string;

    /**
     * Gets or sets the background image for the component.
     * An image that used to fill the background of the component. The default value is ''.
     *
     * @default ''
     * @private
     */
    @Property('')
    public backgroundImage: string;

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
     * Gets or sets whether to save the signature along with Background Color and background Image while saving.
     * True, if signature component to save with background. The default value is true.
     *
     * @default true
     * @private
     */
    @Property(true)
    public saveWithBackground: boolean;
 
    /**
     * Gets or sets the stroke color of the signature.
     * The color of the signature stroke that accepts hex value, rgb and text (like 'red'). The default value is "#000000".
     *
     * @default '#000000'
     * @private
     */
    @Property('#000000')
    public strokeColor: string;
 
    /**
     * Gets or sets the minimum stroke width for signature.
     * The signature component calculates stroke width based on Velocity, MinStrokeWidth and MaxStrokeWidth.
     * The minimum width of stroke. The default value is 0.5.
     *
     * @default 0.5
     * @private
     */
    @Property(0.5)
    public minStrokeWidth: number;
 
    /**
     * Gets or sets the maximum stroke width for signature.
     * The signature component calculates stroke width based on Velocity, MinStrokeWidth and MaxStrokeWidth.
     * The maximum width of stroke. The default value is 2.0.
     *
     * @default 2
     * @private
     */
    @Property(2)
    public maxStrokeWidth: number;
 
    /**
     * Gets or sets the velocity to calculate the stroke thickness based on the pressure of the contact on the digitizer surface.
     * The Signature component calculates stroke thickness based on Velocity, MinStrokeWidth and MaxStrokeWidth.
     * The default value is 0.7.
     *
     * @default 0.7
     * @private
     */
    @Property(0.7)
    public velocity: number;
 
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
     * Gets or sets the last signature url to maintain the persist state.
     *
     * @private
     */
    public signatureValue: string;

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
     *
     * Constructor for creating the widget
     *
     * @param  {ImageEditorModel} options - Specifies the image editor model
     * @param  {string|HTMLDivElement} element - Specifies the target element
     */

    constructor(options?: ImageEditorModel, element?: string | HTMLCanvasElement) {
        super(options, <string | HTMLCanvasElement>element);
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
            Transform: 'Transform',
            Annotation: 'Annotation',
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
            Default: 'Default',
            Bold: 'Bold',
            Italic: 'Italic',
            BoldItalic: 'Bold Italic',
            XSmall: 'X-Small',
            Small: 'Small',
            Medium: 'Medium',
            Large: 'Large',
            XLarge: 'X-Large',
            ABC: 'ABC'
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
                    removeClass([this.element], oldProperties.cssClass.split(' '));
                }
                if (newProperties.cssClass) {
                    addClass([this.element], newProperties.cssClass.split(' '));
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
            }
        }
    }

    public destroy(): void {
        let classList: string[] = [];
        this.element.removeAttribute('tabindex');
        if (this.cssClass) {classList = classList.concat(this.cssClass.split(' ')); }
        removeClass([this.element], classList);
        if (!this.element.getAttribute('class')) {this.element.removeAttribute('class'); }
        this.unwireEvent();
        super.destroy();
        this.element.innerHTML = '';
        this.trigger('destroyed');
    }

    public initialize(): void {
        this.createToolbar(); this.createCanvas(); this.wireEvent();
        this.updateContext(this.lowerContext); this.updateContext(this.upperContext);
        this.pannStart = {startX: 0, startY: 0, width: 0, height: 0}; this.pannEnd = {startX: 0, startY: 0, width: 0, height: 0};
        if (this.cssClass) {addClass([this.element], this.cssClass.split(' ')); }
        if (this.element) {
            createSpinner({
                target: this.element
            });
        }
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
        EventHandler.add(this.textBox, 'mousedown', this.findTextPoint, this);
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

    private updateTheme(): void {
        if (this.theme !== '') {
            this.theme = this.toPascalCase(this.theme);
        }
    }

    private toPascalCase(str: string): string {
        const strArr: string[] = str.toLowerCase().split('-');
        for (let i: number = 0; i < strArr.length; i++) {
            strArr[i] = strArr[i].charAt(0).toUpperCase() + strArr[i].slice(1);
        }
        return strArr.join('');
    }

    private createCanvas(): void {
        const height: number = this.toolbarHeight;
        this.element.style.width = this.width; this.element.style.height = this.height;
        const canvasWrapper: HTMLElement = this.element.appendChild(this.createElement('div', { id: this.element.id + '_canvasWrapper',
            className: 'e-canvas-wrapper', attrs: { style: 'height:' + (this.element.offsetHeight - height) + 'px; width:' +
        (this.element.offsetWidth)
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
        this.textBox = canvasWrapper.appendChild(this.createElement('textarea', {
            id: this.element.id + '_textBox', attrs: { name: 'textBox' }
        }));
        this.textBox.setAttribute('spellcheck', 'false');
        this.upperCanvas.width = this.lowerCanvas.width = this.inMemoryCanvas.width = this.element.offsetWidth;
        this.upperCanvas.height = this.lowerCanvas.height = this.inMemoryCanvas.height = (this.element.offsetHeight - this.toolbarHeight);
        this.upperCanvas.style.position = this.lowerCanvas.style.position = this.textBox.style.position = 'absolute';
        this.textBox.style.backgroundColor = 'transparent'; this.textBox.style.display = 'none';
        this.textBox.style.resize = 'none';
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
                const toolbarItems: ItemModel = { cssClass: 'e-image-upload', align: 'Left', type: 'Input', template: new Uploader({}) };
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
                        template: new Uploader({
                            selected: () => {
                                if (Browser.isDevice) {
                                    if (this.defToolbarItems.length > 0 &&
                                        (!isNullOrUndefined(document.getElementById(this.element.id + '_toolbar')))) {
                                        (getComponent(document.getElementById(this.element.id + '_toolbar'), 'toolbar') as Toolbar).destroy();
                                    }
                                    if (!isNullOrUndefined(document.getElementById(this.element.id + '_bottomToolbar'))) {
                                        (getComponent(document.getElementById(this.element.id + '_bottomToolbar'), 'toolbar') as Toolbar).destroy();
                                    }
                                    this.initToolbarItem(false, Browser.isDevice);
                                    this.createBottomToolbar();
                                } else {
                                    if (this.defToolbarItems.length > 0 &&
                                        (!isNullOrUndefined(document.getElementById(this.element.id + '_toolbar')))) {
                                        (getComponent(document.getElementById(this.element.id + '_toolbar'), 'toolbar') as Toolbar).destroy();
                                    }
                                    this.initToolbarItem(false, false);
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
            toolbarItems.push({ cssClass: 'e-image-upload', align: 'Left', type: 'Input', template: new Uploader({}) });
            toolbarItems.push({ visible: false, cssClass: 'e-image-position e-btn e-flat', tooltipText: 'Position', align: 'Left' });
        }
        if (isNullOrUndefined(this.toolbar) || (!isNullOrUndefined(this.toolbar) && this.toolbar.indexOf('ZoomOut') > -1)) {
            toolbarItems.push({ id: this.element.id + '_zoomOut', prefixIcon: 'e-icons e-zoom-out', cssClass: 'top-icon e-dec-zoom',
                tooltipText: this.l10n.getConstant('ZoomOut'), align: 'Left' });
        }
        if (isNullOrUndefined(this.toolbar) || (!isNullOrUndefined(this.toolbar) && this.toolbar.indexOf('ZoomIn') > -1)) {
            toolbarItems.push({ id: this.element.id + '_zoomIn', prefixIcon: 'e-icons e-zoom-in', cssClass: 'top-icon e-inc-zoom',
                tooltipText: this.l10n.getConstant('ZoomIn'), align: 'Left' });
        }
        const tempToolbarItems: ItemModel[] = this.processToolbar('left');
        for (let i: number = 0, len: number = tempToolbarItems.length; i < len; i++) {
            toolbarItems.push(tempToolbarItems[i]);
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
            toolbarItems.push(tempToolbarItems[i]);
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
        const tempToolbarItems: ItemModel[] = this.processToolbar('center');
        for (let i: number = 0, len: number = tempToolbarItems.length; i < len; i++) {
            toolbarItems.push(tempToolbarItems[i]);
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
        let toolbarItems: ItemModel[] = [];
        if (this.factor > 1) {
            toolbarItems = [
                { id: this.element.id + '_pan', prefixIcon: 'e-icons e-pan', cssClass: 'top-icon e-img-pan',
                    tooltipText: this.l10n.getConstant('Pan'), align: 'Left' }
            ];
        }
        return toolbarItems;
    }

    private processToolbar(position: string): ItemModel[] {
        const toolbarItems: ItemModel[] = [];
        if (this.toolbar) {
            for (let i: number = 0, len: number = this.toolbar.length; i < len; i++) {
                if (typeof(this.toolbar[i]) === 'object') {
                    if (isNullOrUndefined((this.toolbar[i] as ItemModel).align)) {
                        if (position === 'left') {
                            toolbarItems.push(this.toolbar[i] as ItemModel);
                        }
                    } else if ((this.toolbar[i] as ItemModel).align.toLowerCase() === position) {
                        toolbarItems.push(this.toolbar[i] as ItemModel);
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
                if (typeof(items[i]) === 'object') {
                    (items[i] as ItemModel).align = 'Center';
                    toolbarItems.push(items[i] as ItemModel);
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
                this.defToolbarItems = [...leftItem, ...zoomItem, ...rightItem];
            } else {
                this.defToolbarItems = [...leftItem, ...zoomItem, ...mainItem, ...rightItem];
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
            const zoomIn: HTMLElement = document.querySelector('#' + this.element.id + '_zoomIn');
            if (!isNullOrUndefined(zoomIn) && this.factor >= 8) {
                zoomIn.classList.add('e-disabled');
            } else if (!isNullOrUndefined(zoomIn)) {
                zoomIn.classList.remove('e-disabled');
            }
            const zoomOut: HTMLElement = document.querySelector('#' + this.element.id + '_zoomOut');
            if (!isNullOrUndefined(zoomOut) && this.factor === 1) {
                zoomOut.classList.add('e-disabled');
            } else if (!isNullOrUndefined(zoomOut)) {
                zoomOut.classList.remove('e-disabled');
            }
            const pan: HTMLElement = document.querySelector('#' + this.element.id + '_pan');
            if (!isNullOrUndefined(pan) && this.factor === 1) {
                pan.style.display = 'none';
            } else if (!isNullOrUndefined(pan)) {
                pan.style.display = 'block';
            }
            if (this.isToolbar() && (!isNullOrUndefined(document.getElementById(this.element.id + '_toolbar')))) {
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                const toolbar: any = getComponent(this.element.id + '_toolbar', 'toolbar') as Toolbar;
                toolbar.refreshOverflow();
            }
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
                if (this.togglePan) {
                    this.cancelPan();
                }
                if (Browser.isDevice) {
                    args.element.parentElement.style.top = drpDownBtn.element.getBoundingClientRect().top -
                    args.element.parentElement.offsetHeight + 'px';
                }
            },
            select: (args: MenuEventArgs) => {
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
                this.updateToolbarItems(this.calcRatio());
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
            items.push({ text: this.l10n.getConstant('Circle'), id: 'ellipse', iconCss: 'e-icons e-circle' });
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
                if (this.togglePan) {
                    this.cancelPan();
                }
                if (Browser.isDevice) {
                    args.element.parentElement.style.top = drpDownBtn.element.getBoundingClientRect().top -
                    args.element.parentElement.offsetHeight + 'px';
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
                if (this.togglePan) {
                    this.cancelPan();
                }
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
                    if (this.togglePan) {
                        this.cancelPan();
                    }
                    imageEditorObj.export(args.item.text);
                }
            });
            saveDrpDownBtn.appendTo('#' + this.element.id + '_saveBtn');
        }
    }

    private cropSelect(args: MenuEventArgs): void {
        const text: string = args.item.text;
        this.select(text);
        this.refreshToolbar('main', true, true);
    }

    private transformSelect(args: MenuEventArgs): void {
        const text: string = args.item.id;
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
            toolbarItems.push(tempToolbarItems[i]);
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
                    proxy.activeObj.strokeSettings.fillColor = args.currentValue.hex;
                    proxy.strokeSettings.fillColor = proxy.activeObj.strokeSettings.fillColor;
                    proxy.redrawShape(this.activeObj);
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
                    proxy.activeObj.strokeSettings.strokeColor = args.currentValue.hex;
                    proxy.strokeSettings.strokeColor = proxy.activeObj.strokeSettings.strokeColor;
                    if (!proxy.togglePen) {
                        proxy.redrawShape(this.activeObj);
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
        const ratio: Dimension = this.calcRatio();
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
                    args.element.querySelector('[aria-label = ' + '"' + activeBtn + '"' + ']').classList.add('e-selected-btn');
                },
                select: (args: MenuEventArgs) => {
                    spanElem.textContent = args.item.text;
                    this.activeObj.strokeSettings.strokeWidth = parseInt(args.item.id, 10);
                    if (this.lowerCanvas.width > this.lowerCanvas.height) {
                        this.activeObj.strokeSettings.strokeWidth *= ((ratio.width + ratio.height) / this.factor);
                    } else {
                        this.activeObj.strokeSettings.strokeWidth *= ((ratio.height + ratio.width) / this.factor);
                    }
                    this.strokeSettings.strokeWidth = this.activeObj.strokeSettings.strokeWidth;
                    this.redrawShape(this.activeObj);
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
            toolbarItems.push(tempToolbarItems[i]);
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
                    if (proxy.textBox.style.display === 'none') {
                        proxy.strokeSettings.strokeColor = proxy.activeObj.strokeSettings.strokeColor = args.currentValue.hex;
                        if (!proxy.togglePen) {
                            proxy.redrawShape(this.activeObj);
                        }
                    }
                    else if (proxy.textBox.style.display === 'block') {
                        proxy.textBox.style.color = args.currentValue.hex;
                    } else if (!proxy.togglePen) {
                        proxy.redrawShape(this.activeObj);
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

    private createTextBtn(items: (string | ItemModel)[]): void {
        const ratio: Dimension = this.calcRatio();
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
                    if (this.textBox.style.display === 'block') {
                        fontFamily = this.textBox.style.fontFamily;
                    } else {
                        fontFamily = this.activeObj.textSettings.fontFamily;
                    }
                    args.element.querySelector('[id *= ' + '"' + fontFamily.toLowerCase()
                        + '"' + ']').classList.add('e-selected-btn');
                },
                select: (args: MenuEventArgs) => {
                    spanElem.textContent = args.item.text;
                    if (Browser.isDevice) {
                        spanElem.setAttribute('style', 'font-family:' + args.item.id);
                    }
                    if (this.textBox.style.display === 'block') {
                        const temp: string = this.activeObj.textSettings.fontFamily;
                        this.activeObj.textSettings.fontFamily = this.toPascalCase(args.item.id);
                        this.updateFontStyles();
                        const width: number = this.upperContext.measureText(this.activeObj.keyHistory).width +
                        this.activeObj.textSettings.fontSize * 0.5;
                        this.textBox.style.width = Browser.isDevice ? width + 'px' : (width * ((ratio.width + ratio.height) / 2)) + 'px';
                        this.textBox.style.fontFamily = this.toPascalCase(args.item.id);
                        this.activeObj.textSettings.fontFamily = temp;
                        this.updateFontStyles();
                    } else {
                        this.textSettings.fontFamily = this.activeObj.textSettings.fontFamily = this.toPascalCase(args.item.id);
                        this.redrawText(ratio);
                        this.redrawShape(this.activeObj);
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
                    if (this.textBox.style.display === 'block') {
                        if (this.textBox.style.fontWeight === 'bold') {
                            fontStyle = 'bold';
                        }
                        if (this.textBox.style.fontStyle === 'italic') {
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
                        this.applyFontStyle(args.item.id, ratio);
                    } else {
                        span1Elem.textContent = args.item.text;
                        this.applyFontStyle(args.item.id, ratio);
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
                    fontSizeSpanElem.textContent =  args.item.text;
                    if (this.textBox.style.display === 'block') {
                        const temp: number = this.activeObj.textSettings.fontSize;
                        this.activeObj.textSettings.fontSize = parseInt(this.fontSizeColl[(parseInt(args.item.text, 10) - 1)].text, 10);
                        let textStyle: string = '';
                        if (this.textBox.style.fontWeight === 'bold') {textStyle = 'bold '; }
                        if (this.textBox.style.fontStyle === 'italic') {textStyle = 'italic '; }
                        if (this.textBox.style.fontWeight === 'bold' && this.textBox.style.fontStyle === 'italic') {
                            textStyle = 'italic bold '; }
                        this.upperContext.font = textStyle + this.activeObj.textSettings.fontSize + 'px' + ' ' + this.textBox.style.fontFamily;
                        const rows: string[] = this.textBox.value.split('\n');
                        const text: string = this.getMaxText(true);
                        const width: number = this.upperContext.measureText(text).width +
                        this.activeObj.textSettings.fontSize * 0.5;
                        this.textBox.style.width = width + 'px';
                        this.textBox.style.height = rows.length * (this.activeObj.textSettings.fontSize + this.activeObj.textSettings.fontSize * 0.25) + 'px';
                        this.activeObj.textSettings.fontSize = temp;
                        this.upperContext.font = this.activeObj.textSettings.fontSize + 'px' + ' ' + this.activeObj.textSettings.fontFamily;
                        this.textBox.style.fontSize = parseInt(this.fontSizeColl[(parseInt(args.item.text, 10) - 1)].text, 10) + 'px';
                        if (this.textBox.style.fontFamily === 'georgia') {
                            this.textBox.style.width = parseFloat(this.textBox.style.width) + parseFloat(this.textBox.style.fontSize) + 'px';
                        }
                    } else {
                        this.textSettings.fontSize = this.activeObj.textSettings.fontSize = parseInt(this.fontSizeColl[(
                            parseInt(args.item.text, 10) - 1)].text, 10);
                        this.upperContext.font = this.activeObj.textSettings.fontSize + 'px' + ' ' + this.activeObj.textSettings.fontFamily;
                        const rows: string[] = this.activeObj.keyHistory.split('\n');
                        const text: string = this.getMaxText();
                        const width: number = this.upperContext.measureText(text).width +
                        this.activeObj.textSettings.fontSize * 0.5;
                        const height: number = rows.length * (this.activeObj.textSettings.fontSize + this.activeObj.textSettings.fontSize * 0.25);
                        this.setTextSelection(width, height);
                        this.updateActiveObject(ratio, this.activeObj.activePoint, this.activeObj);
                        this.redrawShape(this.activeObj);
                        this.redrawText(ratio);
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
            fontSize = this.lowerCanvas.width / 20;
        }
        else {
            fontSize = this.lowerCanvas.height / 20;
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
        const width: number = this.upperContext.measureText(this.activeObj.keyHistory).width +
        this.activeObj.textSettings.fontSize * 0.5;
        this.activeObj.textSettings.bold = tempBold;
        this.activeObj.textSettings.italic = tempItalic;
        return width;
    }

    private applyFontStyle(item: string, ratio: Dimension): void {
        switch (item) {
        case 'default':
            if (this.textBox.style.display === 'block') {
                const width: number = this.getTextAreaWidth(item);
                this.textBox.style.width = Browser.isDevice ? width + 'px' : (width * ((ratio.width + ratio.height) / 2)) + 'px';
                this.textBox.style.fontWeight = 'normal';
                this.textBox.style.fontStyle = 'normal';
            } else {
                this.textSettings.bold = this.activeObj.textSettings.bold = false;
                this.textSettings.italic = this.activeObj.textSettings.italic = false;
                this.redrawText(ratio);
            }
            break;
        case 'bold':
            if (this.textBox.style.display === 'block') {
                const width: number = this.getTextAreaWidth(item);
                this.textBox.style.width = Browser.isDevice ? width + 'px' : (width * ((ratio.width + ratio.height) / 2)) + 'px';
                this.textBox.style.fontWeight = 'bold';
                this.textBox.style.fontStyle = 'normal';
            } else {
                this.textSettings.bold = this.activeObj.textSettings.bold = true;
                this.textSettings.italic = this.activeObj.textSettings.italic = false;
                this.redrawText(ratio);
            }
            break;
        case 'italic':
            if (this.textBox.style.display === 'block') {
                const width: number = this.getTextAreaWidth(item);
                this.textBox.style.width = Browser.isDevice ? width + 'px' : (width * ((ratio.width + ratio.height) / 2)) + 'px';
                this.textBox.style.fontWeight = 'normal';
                this.textBox.style.fontStyle = 'italic';
            } else {
                this.textSettings.bold = this.activeObj.textSettings.bold = false;
                this.textSettings.italic = this.activeObj.textSettings.italic = true;
                this.redrawText(ratio);
            }
            break;
        case 'bolditalic':
            if (this.textBox.style.display === 'block') {
                const width: number = this.getTextAreaWidth(item);
                this.textBox.style.width = (width / ratio.width) + 'px';
                this.textBox.style.fontWeight = 'bold';
                this.textBox.style.fontStyle = 'italic';
            } else {
                this.textSettings.bold = this.activeObj.textSettings.bold = true;
                this.textSettings.italic = this.activeObj.textSettings.italic = true;
                this.redrawText(ratio);
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
        if (this.defToolbarItems.length > 0 && (!isNullOrUndefined(document.getElementById(this.element.id + '_toolbar')))) {
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            const toolbar: any = getComponent(this.element.id + '_toolbar', 'toolbar') as Toolbar;
            toolbar.refreshOverflow();
        }
    }

    private defToolbarClicked(args: ClickEventArgs): void {
        const ratio: Dimension = this.calcRatio(); let zoomIn: HTMLElement;
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
        if (!this.disabled) {
            switch (type) {
            case 'zoomin':
                if (this.togglePen) {
                    this.currObjType.isZoomed = true;
                    this.freeHandDraw(false);
                }
                imageEditorObj.zoom(.1);
                if (!this.togglePan) {
                    this.callMainToolbar(false, true);
                }
                if (this.factor > 0.95 && this.factor < 1.05) {
                    this.dragCanvas = this.togglePan = false;
                    this.callMainToolbar(false, true);
                }
                if (isNullOrUndefined(this.activeObj.activePoint) || this.activeObj.activePoint.width === 0) {
                    this.refreshToolbar('main');
                } else {
                    this.refreshToolbar('main', true, true);
                } 
                panBtn = this.element.querySelector('.e-img-pan .e-btn');
                if (!isNullOrUndefined(panBtn) && this.togglePan) {
                    panBtn.classList.add('e-selected-btn');
                } else if (!isNullOrUndefined(panBtn)) {
                    panBtn.classList.remove('e-selected-btn');
                }
                break;
            case 'zoomout':
                if (this.togglePen) {
                    this.currObjType.isZoomed = true;
                    this.freeHandDraw(false);
                }
                imageEditorObj.zoom(-.1);
                if (!this.togglePan) {
                    this.callMainToolbar(false, true);
                }
                if (this.factor > 0.95 && this.factor < 1.05) {
                    this.dragCanvas = this.togglePan = false;
                    this.callMainToolbar(false, true);
                }
                if (isNullOrUndefined(this.activeObj.activePoint) || this.activeObj.activePoint.width === 0) {
                    this.refreshToolbar('main');
                } else {
                    this.refreshToolbar('main', true, true);
                } 
                panBtn = this.element.querySelector('.e-img-pan .e-btn');
                if (!isNullOrUndefined(panBtn) && this.togglePan) {
                    panBtn.classList.add('e-selected-btn');
                } else if (!isNullOrUndefined(panBtn)) {
                    panBtn.classList.remove('e-selected-btn');
                }
                break;
            case 'pan':
                this.currObjType.isCustomCrop = false;
                if (isCropSelection) {
                    this.currObjType.isCustomCrop = false;
                    this.refreshActiveObj(); this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
                    this.refreshToolbar('main');
                }
                if (this.togglePan) {
                    this.cancelPan();
                } else {
                    panBtn = this.element.querySelector('.e-img-pan .e-btn');
                    panBtn.classList.add('e-selected-btn');
                    imageEditorObj.pan(true);
                }
                zoomIn = document.querySelector('#' + this.element.id + '_zoomIn');
                if (!isNullOrUndefined(zoomIn) && this.factor >= 8) {
                    zoomIn.classList.add('e-disabled');
                } else if (!isNullOrUndefined(zoomIn)) {
                    zoomIn.classList.remove('e-disabled');
                }
                break;
            case 'cancel':
                if (this.textBox.style.display === 'block') {
                    this.textBox.style.display = 'none';
                    this.textBox.value = '';
                    this.textBox.style.transform = '';
                    this.activeObj.strokeSettings = this.tempStrokeSettings;
                    this.activeObj.textSettings = this.tempTextSettings;
                }
                this.cancelItems();
                break;
            case 'ok':
                if (isCropSelection) {
                    this.crop();
                } else if (this.togglePen) {
                    this.freeHandDraw(false);
                } else if (this.textBox.style.display === 'block') {
                    this.redrawActObj();
                } else {
                    this.applyActObj();
                }
                this.callMainToolbar(false);
                break;
            case 'text':
                this.currObjType.isCustomCrop = false;
                imageEditorObj.drawShapeText();
                this.refreshToolbar(type);
                break;
            case 'pen':
                this.currObjType.isCustomCrop = false;
                this.freeHandDraw(true);
                this.refreshToolbar(type);
                break;
            case 'reset':
                imageEditorObj.reset();
                break;
            case 'load':
                break;
            case 'save':
                break;
            case 'select':
                break;
            case 'bold':
                this.currObjType.isCustomCrop = false;
                if (!this.isBoldbtn) {
                    this.activeObj.textSettings.bold = true;
                    this.isBoldbtn = true;
                    this.redrawText(ratio);
                }
                else {
                    this.activeObj.textSettings.bold = false;
                    this.isBoldbtn = false;
                    this.redrawText(ratio);
                }
                break;
            case 'italic':
                this.currObjType.isCustomCrop = false;
                if (!this.isItalicbtn) {
                    this.activeObj.textSettings.italic = true;
                    if (this.activeObj.textSettings.bold) {
                        this.upperContext.font = 'italic bold ' + this.activeObj.textSettings.fontSize + 'px' +
                        ' ' + this.activeObj.textSettings.fontFamily;
                    }
                    else {
                        this.upperContext.font = 'italic ' + this.activeObj.textSettings.fontSize + 'px' + ' ' +
                        this.activeObj.textSettings.fontFamily;
                    }
                    const width: number = this.upperContext.measureText(this.activeObj.keyHistory).width +
                    this.activeObj.textSettings.fontSize * 0.5;
                    const height: number = this.activeObj.textSettings.fontSize + this.activeObj.textSettings.fontSize * 0.25;
                    this.setTextSelection(width, height);
                    this.updateActiveObject(ratio, this.activeObj.activePoint, this.activeObj);
                    this.redrawShape(this.activeObj);
                    this.isItalicbtn = true;
                }
                else {
                    this.activeObj.textSettings.italic = false;
                    if (this.activeObj.textSettings.bold) {
                        this.upperContext.font = 'bold ' + this.activeObj.textSettings.fontSize + 'px' + ' ' + this.activeObj.textSettings.fontFamily;
                    }
                    else {
                        this.upperContext.font = this.activeObj.textSettings.fontSize + 'px' + ' ' + this.activeObj.textSettings.fontFamily;
                    }
                    const width: number = this.upperContext.measureText(this.activeObj.keyHistory).width +
                    this.activeObj.textSettings.fontSize * 0.5;
                    const height: number = this.activeObj.textSettings.fontSize + this.activeObj.textSettings.fontSize * 0.25;
                    this.setTextSelection(width, height);
                    this.updateActiveObject(ratio, this.activeObj.activePoint, this.activeObj);
                    this.redrawShape(this.activeObj);
                    this.isItalicbtn = false;
                }
                break;
            }
        }
        this.trigger('toolbarItemClicked', args);
    }

    private cancelPan(): void {
        this.applyActObj();
        const panBtn: HTMLElement = this.element.querySelector('.e-img-pan .e-btn');
        panBtn.classList.remove('e-selected-btn');
        this.pan(false);
    }

    private callMainToolbar(isApplyBtn?: boolean, isZooming?: boolean): void {
        if (this.factor === 1) {
            this.refreshToolbar('main', isApplyBtn, false, isZooming);
        } else {
            this.refreshToolbar('main', isApplyBtn, false, isZooming);
        }
    }

    private cancelItems(): void {
        const ratio: Dimension = this.calcRatio();
        let isCropSelection: boolean = false;
        let splitWords: string[];
        if (this.activeObj.shape !== undefined) {splitWords = this.activeObj.shape.split('-'); }
        if (splitWords === undefined && this.currObjType.isCustomCrop) {
            isCropSelection = true;
        } else if (splitWords !== undefined && splitWords[0] === 'crop'){
            isCropSelection = true;
        }
        if (this.togglePen) {
            this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
            this.togglePen = false;
            this.upperCanvas.style.cursor = 'default'; this.penDrawColl = []; this.imageEditorPointsColl = [];
        } else if (this.activeObj.shape === 'text') {
            this.activeObj.strokeSettings = this.tempStrokeSettings;
            this.activeObj.textSettings = this.tempTextSettings;
            if (this.activeObj.keyHistory === 'Enter Text' && this.activeObj.activePoint.startX === this.textStartPoints.x
            && this.activeObj.activePoint.startY === this.textStartPoints.y) {
                this.refreshActiveObj();
                this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
                this.drawShapeText();
            } else {
                this.redrawText(ratio);
                this.redrawShape(this.activeObj);
                if (!isCropSelection && this.activeObj.topLeftCircle !== undefined) {this.applyActObj(); }
                this.clearSelection();
            }
            this.tempTextSettings = {text: 'Enter Text', fontFamily: 'Arial', fontSize: null, bold: false, italic: false, underline: false};
        } else if (this.activeObj.shape === 'rectangle' || this.activeObj.shape === 'ellipse' || this.activeObj.shape === 'line') {
            this.activeObj.strokeSettings = this.tempStrokeSettings;
            this.redrawShape(this.activeObj);
            this.applyActObj();
        } else {
            this.refreshActiveObj();
            this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
        }
        this.upperCanvas.style.cursor = 'default'; this.currObjType.isCustomCrop = false;
        this.tempStrokeSettings = {strokeColor: '#fff', fillColor: '', strokeWidth: null};
        this.callMainToolbar();
    }

    private gradient(a: Point, b: Point): number {
        return (b.y - a.y) / (b.x - a.x);
    }

    private applyPenDraw(): void {
        if (this.togglePen && this.factor === 1 && !this.currObjType.isZoomed) {
            this.apply();
            this.penDrawColl = []; this.imageEditorPointsColl = [];
        } else {
            const tempCanvas: HTMLCanvasElement = this.lowerCanvas.appendChild(this.createElement('canvas', {
                id: this.element.id + '_tempCanvas', attrs: { name: 'canvasImage' }
            }));
            const tempContext: CanvasRenderingContext2D = tempCanvas.getContext('2d');
            tempCanvas.width = this.lowerCanvas.width; tempCanvas.height = this.lowerCanvas.height;
            tempContext.drawImage(this.inMemoryCanvas, 0, 0);
            this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
            for (let i: number = 0; i < this.penDrawColl.length; i++) {
                tempContext.lineWidth = 2 * this.penDrawColl[i].strokeWidth;
                tempContext.strokeStyle = this.penDrawColl[i].strokeColor;
                let nexP: Point; let preP: Point; const f: number = 0.3; const t: number = 1;
                tempContext.beginPath();
                tempContext.moveTo(this.penDrawColl[i].points[0].x, this.penDrawColl[i].points[0].y);
                let m: number = 0;
                let dx1: number = 0; let dx2: number = 0;
                let dy1: number = 0; let dy2: number = 0;
                preP = this.penDrawColl[i].points[0];
                for (let j: number = 1; j < this.penDrawColl[i].points.length; j++) {
                    const curP: Point = this.penDrawColl[i].points[j];
                    nexP = this.penDrawColl[i].points[j + 1];
                    if (nexP) {
                        m = this.gradient(preP, nexP);
                        dx2 = (nexP.x - curP.x) * -f;
                        dy2 = dx2 * m * t;
                    } else {
                        dx2 = 0;
                        dy2 = 0;
                    }
                    tempContext.bezierCurveTo(preP.x - dx1, preP.y - dy1, curP.x + dx2, curP.y + dy2, curP.x, curP.y);
                    dx1 = dx2;
                    dy1 = dy2;
                    preP = curP;
                    if (this.penDrawColl[i].points.length > 2) {
                        this.penDrawColl[i].points.shift();
                    }
                    tempContext.stroke();
                }
            }
            this.penDrawColl = []; this.imageEditorPointsColl = [];
            this.togglePen = false;
            const imgData: ImageData = tempContext.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
            let tempObj: Transition;
            for (let index: number = 0; index < this.imgDataColl.length; index++ ) {
                if (this.imgDataColl[index].operation !== 'freehanddraw') {
                    tempObj = this.imgDataColl[index];
                    break;
                }
            }
            this.imgDataColl.splice(0, 1, {operation: 'freehanddraw', value: imgData});
            this.imgDataColl.splice(1, 1, tempObj);
            this.inMemoryContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
            this.inMemoryContext.clearRect(0, 0, this.lowerCanvas.height, this.lowerCanvas.width);
            this.inMemoryCanvas.width = imgData.width; this.inMemoryCanvas.height = imgData.height;
            this.inMemoryContext.putImageData(imgData, 0, 0);
            this.lowerContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
            this.lowerContext.drawImage(this.inMemoryCanvas, 0, 0);
            for (let j: number = 0; j < this.objColl.length; j++ ) {
                this.apply(this.objColl[j].shape, this.objColl[j]);
                this.refreshActiveObj();
            }
            this.currObjType.isZoomed = false;
        }
    }

    private refreshToolbar(type: string, isApplyBtn?: boolean, isCropping?: boolean, isZooming?: boolean): void {
        const args: ToolbarEventArgs = { toolbarType: type };
        if (document.getElementById(this.element.id + '_toolbar') && this.defToolbarItems.length > 0) {
            (getComponent(document.getElementById(this.element.id + '_toolbar'), 'toolbar') as Toolbar).destroy();
        }
        if (document.getElementById(this.element.id + '_bottomToolbar') && this.defToolbarItems.length > 0) {
            if (document.getElementById(this.element.id + '_bottomToolbar').className.indexOf('e-control') > -1) {
                (getComponent(document.getElementById(this.element.id + '_bottomToolbar'), 'toolbar') as Toolbar).destroy();
            }
        }
        switch (type) {
        case 'main':
            if (Browser.isDevice) {
                if (isCropping) { this.initToolbarItem(false, true, true); }
                else { this.initToolbarItem(false, true); }
            } else if (!Browser.isDevice || isZooming) {
                this.initToolbarItem(isApplyBtn, Browser.isDevice);
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
        }
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
            toolbarItems.push(tempToolbarItems[i]);
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
                    proxy.activeObj.strokeSettings.strokeColor = args.currentValue.hex;
                    if (!proxy.togglePen) {
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
            (this.element.querySelector('.e-pen-stroke-color.e-template .e-dropdownbtn-preview') as HTMLElement).style.background
            = '#fff';
        }
    }

    private createPenBtn(items: (string | ItemModel)[]): void {
        const ratio: Dimension = this.calcRatio();
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
            spanElem.innerHTML = this.l10n.getConstant('Small');
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
                    spanElem.textContent = args.item.text;
                    this.setPenStroke(args.item.id, ratio);
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

    private setPenStroke(args: string, ratio: Dimension): void {
        switch (parseInt(args, 10)) {
        case 1:
            this.penStrokeWidth = (ratio.width + ratio.height) * 0.4;
            break;
        case 2:
            this.penStrokeWidth = (ratio.width + ratio.height) * 0.8;
            break;
        case 3:
            this.penStrokeWidth = (ratio.width + ratio.height) * 1.2;
            break;
        case 4:
            this.penStrokeWidth = (ratio.width + ratio.height) * 1.6;
            break;
        case 5:
            this.penStrokeWidth = (ratio.width + ratio.height) * 2;
            break;
        }
    }

    private updateCanvas(): void {
        this.lastX = this.baseImg.width / 2; this.lastY = this.baseImg.height / 2;
        let wrapperWidth: number;
        const canvasWrapper: HTMLElement = document.querySelector('#' + this.element.id + '_canvasWrapper');
        if (this.isScreenOriented) {
            wrapperWidth = parseFloat(canvasWrapper.style.width);
        } else {
            wrapperWidth = this.element.clientWidth;
        }
        const maxDimension: Dimension = this.calcMaxDimension(this.baseImg.width, this.baseImg.height);
        let toolbarHeight: number = 0;
        if (!isNullOrUndefined(this.toolbarTemplate) && !isNullOrUndefined(document.querySelector('.e-toolbar'))) {
            toolbarHeight =  document.querySelector('.e-toolbar').clientHeight;
            maxDimension.width -= toolbarHeight; maxDimension.height -= toolbarHeight;
        }
        this.lowerContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
        this.lowerCanvas.width = this.upperCanvas.width = this.inMemoryCanvas.width = this.baseImg.width;
        this.lowerCanvas.height = this.upperCanvas.height = this.inMemoryCanvas.height = this.baseImg.height;
        this.lowerCanvas.style.maxWidth = this.upperCanvas.style.maxWidth = maxDimension.width + 'px';
        this.lowerCanvas.style.maxHeight = this.upperCanvas.style.maxHeight = maxDimension.height + 'px';
        this.lowerCanvas.style.left = this.upperCanvas.style.left = (wrapperWidth - maxDimension.width) / 2 + 1 + 'px';
        if (!isNullOrUndefined(this.toolbarTemplate)) {
            this.lowerCanvas.style.left = parseFloat(this.lowerCanvas.style.left) + (toolbarHeight / 2) + 'px';
        }
        if (canvasWrapper) {
            this.lowerCanvas.style.top = this.upperCanvas.style.top = (parseFloat(canvasWrapper.style.height) - maxDimension.height - 1) / 2 + 'px';
        }
        this.lowerContext.drawImage(this.baseImg, 0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
        this.updateInMemoryCanvas('updateCanvas');
        for (let i: number = 0, len: number = this.objColl.length; i < len; i++ ) {
            this.apply(this.objColl[i].shape, this.objColl[i]);
        }
        if (this.isUndoRedo) {
            if (this.flipState !== '') {
                this.flip(this.flipState as Direction);
            }
        }
        if (this.disabled) { this.element.setAttribute('class', 'e-disabled'); }
        this.trigger('fileOpened');
    }

    private imageOnLoad(src: string): void {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const proxy: ImageEditor = this;
        proxy.baseImg.src = proxy.baseImgSrc = src;
        this.baseImg.onload = () => {
            this.lowerContext.drawImage(this.baseImg, 0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
            if (this.togglePen) {
                // eslint-disable-next-line @typescript-eslint/tslint/config
                this.lowerCanvas.toBlob(function(blob){
                    showSpinner(proxy.element);
                    proxy.baseImg.src = URL.createObjectURL(blob);
                    proxy.togglePen = false;
                }, 'image/png');
                this.inMemoryContext.clearRect(0, 0, this.inMemoryCanvas.width, this.inMemoryCanvas.height);
                const imgData: ImageData = this.lowerContext.getImageData(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
                this.inMemoryContext.putImageData(imgData, 0, 0);
                const temp: Transition = this.imgDataColl[0];
                this.imgDataColl.splice(0, 1, {operation: 'freehanddraw', value: imgData});
                this.imgDataColl.splice(1, 1, temp);
            } else {
                hideSpinner(this.element);
                this.element.style.opacity = '1';
                this.updateCanvas();
                this.isUndoRedo = false;
            }
            if (Browser.isDevice) {
                if (this.isToolbar() && (!isNullOrUndefined(document.getElementById(this.element.id + '_toolbar'))) &&
                (!isNullOrUndefined((getComponent(document.getElementById(this.element.id + '_toolbar'), 'toolbar') as Toolbar)))) {
                    (getComponent(document.getElementById(this.element.id + '_toolbar'), 'toolbar') as Toolbar).destroy();
                }
                if (!isNullOrUndefined(document.getElementById(this.element.id + '_bottomToolbar')) &&
                (!isNullOrUndefined((getComponent(document.getElementById(this.element.id + '_bottomToolbar'), 'toolbar') as Toolbar)))) {
                    (getComponent(document.getElementById(this.element.id + '_bottomToolbar'), 'toolbar') as Toolbar).destroy();
                }
                this.initToolbarItem(false, Browser.isDevice);
                this.createBottomToolbar();
            } else {
                if (this.isToolbar() && (!isNullOrUndefined(document.getElementById(this.element.id + '_toolbar'))) &&
                (!isNullOrUndefined((getComponent(document.getElementById(this.element.id + '_toolbar'), 'toolbar') as Toolbar)))) {
                    (getComponent(document.getElementById(this.element.id + '_toolbar'), 'toolbar') as Toolbar).destroy();
                }
                this.initToolbarItem(false, false);
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

    private redrawText(ratio: Dimension): void {
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
        const text: string = this.textBox.style.display === 'block' ? this.getMaxText(true) : this.getMaxText();
        const width: number = this.upperContext.measureText(text).width + this.activeObj.textSettings.fontSize * 0.5;
        const height: number = rows.length * (this.activeObj.textSettings.fontSize + this.activeObj.textSettings.fontSize * 0.25);
        this.setTextSelection(width, height);
        this.updateActiveObject(ratio, this.activeObj.activePoint, this.activeObj);
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
                if (this.activeObj.flipObjColl[i].toLowerCase() === 'horizontal') {
                    this.activeObj.activePoint = { startX: this.activeObj.activePoint.endX - width,
                        startY: this.activeObj.activePoint.startY,
                        endX: (this.activeObj.activePoint.endX),
                        endY: this.activeObj.activePoint.startY + (height ? height : 0) };
                } else if (this.activeObj.flipObjColl[i].toLowerCase() === 'vertical') {
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
                if (this.activeObj.flipObjColl[i].toLowerCase() === 'vertical') {
                    this.activeObj.activePoint.startX = this.activeObj.activePoint.endX - height;
                    this.activeObj.activePoint = { startX: this.activeObj.activePoint.startX,
                        startY: this.activeObj.activePoint.endY - width,
                        endX: (this.activeObj.activePoint.endX),
                        endY: this.activeObj.activePoint.endY};
                } else if (this.activeObj.flipObjColl[i].toLowerCase() === 'horizontal') {
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
                if (this.activeObj.flipObjColl[i].toLowerCase() === 'horizontal') {
                    this.activeObj.activePoint.startY = this.activeObj.activePoint.endY - height;
                    this.activeObj.activePoint = { startX: this.activeObj.activePoint.startX,
                        startY: this.activeObj.activePoint.startY,
                        endX: (this.activeObj.activePoint.startX + width),
                        endY: this.activeObj.activePoint.endY };
                } else if (this.activeObj.flipObjColl[i].toLowerCase() === 'vertical') {
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
                if (this.activeObj.flipObjColl[i].toLowerCase() === 'vertical') {
                    this.activeObj.activePoint = { startX: this.activeObj.activePoint.startX,
                        startY: this.activeObj.activePoint.startY,
                        endX: (this.activeObj.activePoint.startX + height),
                        endY: this.activeObj.activePoint.startY + (width ? width : 0) };
                } else if (this.activeObj.flipObjColl[i].toLowerCase() === 'horizontal') {
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

    private updateUndoRedoColl(operation: string, value?: string | number | Dimension, previousObj?: SelectionPoint[],
                               currentObj?: SelectionPoint[]): void {
        this.undoRedoColl.push({operation: operation, value: value, previousObj: previousObj, currentObj: currentObj});
    }

    private fileSelect(inputElement: HTMLInputElement, args: Event): void {
        showSpinner(this.element);
        this.element.style.opacity = '0.5';
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const filesData: FileList = (args.target as any).files[0];
        if (this.imgDataColl.length > 0) {this.imgDataColl = []; this.reset(); }
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const URL: any = window.URL; const url: URL = URL.createObjectURL(filesData);
        this.imageOnLoad(url.toString());
        inputElement.value = '';
    }

    private findTextPoint(e: MouseEvent & TouchEvent): void {
        if (this.activeObj.shape === 'text') {
            this.textBox.style.transformOrigin = '0 0';
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
                        scale += this.activeObj.flipObjColl[i].toLowerCase() === 'horizontal' ? 'scale(1, -1)' :
                            'scale(-1, 1)';
                    } else {
                        scale += this.activeObj.flipObjColl[i].toLowerCase() === 'horizontal' ? 'scale(-1, 1)' :
                            'scale(1, -1)';
                    }
                    if (this.activeObj.flipObjColl[i].toLowerCase() === 'horizontal') {
                        this.textBox.style.transform = 'rotate(' + degree + 'deg)' + scale;
                    } else if (this.activeObj.flipObjColl[i].toLowerCase() === 'vertical') {
                        this.textBox.style.transform = 'rotate(' + degree + 'deg)' + scale;
                    }
                }
            } else {
                this.textBox.style.transform = 'rotate(' + degree + 'deg)';
            }
            this.findTextTarget(e);
        }
    }

    private getStrokeWidth(text: string): string {
        let strokeWidth: string;
        switch (text) {
        case '1':
            strokeWidth = this.l10n.getConstant('XSmall');
            break;
        case '2':
            strokeWidth = this.l10n.getConstant('Small');
            break;
        case '3':
            strokeWidth = this.l10n.getConstant('Medium');
            break;
        case '4':
            strokeWidth = this.l10n.getConstant('Large');
            break;
        case '5':
            strokeWidth = this.l10n.getConstant('XLarge');
            break;
        }
        return strokeWidth;
    }

    private updateToolbarItems(ratio: Dimension): void {
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
                if (parseInt(this.fontSizeColl[i].text, 10) >= this.activeObj.textSettings.fontSize) {
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
            const strokeWidth: string = Math.round((this.activeObj.strokeSettings.strokeWidth /
            (ratio.width + ratio.height))).toString();
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

    private touchStartHandler(e: MouseEvent & TouchEvent): void {
        e.preventDefault();
        this.timer = setTimeout(this.setTimer.bind(this), 1000, e);
        this.mouseDownEventHandler(e);
        EventHandler.add(this.lowerCanvas, 'touchend', this.mouseUpEventHandler, this);
        EventHandler.add(this.lowerCanvas, 'touchmove', this.mouseMoveEventHandler, this); // Unbind mousedown to prevent double triggers from touch devices
        EventHandler.add(this.upperCanvas, 'touchend', this.mouseUpEventHandler, this);
        EventHandler.add(this.upperCanvas, 'touchmove', this.mouseMoveEventHandler, this); // Unbind mousedown to prevent double triggers from touch devices
    }

    private mouseDownEventHandler(e: MouseEvent & TouchEvent): void {
        if (e.type === 'touchstart' && e.currentTarget === this.lowerCanvas && this.imgDataColl.length === 0) {
            return;
        }
        const ratio: Dimension = this.calcRatio();
        if (this.dragCanvas) {
            this.canvasMouseDownHandler(e);
        }
        else {
            e.preventDefault();
            let x: number; let y: number;
            if (e.type === 'mousedown') {
                x = e.clientX; y = e.clientY;
            } else {
                this.touchEndPoint.x = x = e.touches[0].clientX;
                this.touchEndPoint.y = y = e.touches[0].clientY;
            }
            this.redrawActObj(x, y);
            if (this.upperCanvas.style.cursor === 'crosshair' || (Browser.isDevice && this.togglePen)) {
                if (this.togglePen) {
                    this.canvasRatio = this.calcRatio();
                    if (isNullOrUndefined(this.activeObj.strokeSettings)) {
                        this.activeObj.strokeSettings = this.strokeSettings;
                    }
                    if (isNullOrUndefined(this.penStrokeWidth)) {
                        this.penStrokeWidth = (ratio.width + ratio.height) * 0.8;
                    }
                    if (this.activeObj.strokeSettings.strokeWidth === (ratio.width + ratio.height) * 0.4 &&
                        this.strokeSettings.strokeWidth === (ratio.width + ratio.height) * 0.4) {
                        this.activeObj.strokeSettings.strokeWidth = this.strokeSettings.strokeWidth =
                        2 * ((ratio.width + ratio.height) / this.factor);
                    }
                    this.minStrokeWidth = this.maxStrokeWidth = this.penStrokeWidth;
                    this.velocity = 0.7;
                    this.upperContext.strokeStyle = this.activeObj.strokeSettings.strokeColor;
                    this.upperContext.fillStyle = this.activeObj.strokeSettings.strokeColor;
                    this.mouseDownHandler(e, this.upperCanvas, this.pannStart, this.factor); // To call signature base
                } else {
                    this.refreshActiveObj();
                    this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
                }
                this.currObjType.isActiveObj = false; this.dragElement = '';
                this.dragPoint.startX = this.dragPoint.startY = this.dragPoint.endX = this.dragPoint.endY = 0;
            }
            if ((this.upperCanvas.style.cursor !== 'crosshair' && e.type.toLowerCase() === 'touchstart') ||
            (this.currObjType.isActiveObj && this.upperCanvas.style.cursor !== 'default' && !this.togglePen)) { this.findTarget(x, y, e.type); }
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
                this.updateToolbarItems(ratio);
            }
        }
    }

    private mouseMoveEventHandler(e: MouseEvent & TouchEvent): void {
        e.preventDefault();
        if (this.textBox.style.display === 'none') {
            this.isTimer = true;
        }
        let x: number; let y: number;
        if (e.type === 'mousemove') {
            x = e.clientX; y = e.clientY;
        } else {
            this.touchEndPoint.x = x = e.touches[0].clientX;
            this.touchEndPoint.y = y = e.touches[0].clientY;
        }
        this.canvasMouseMoveHandler(e);
        if (this.currObjType.isActiveObj && (this.activeObj.activePoint !== undefined || this.objColl.length > 0) &&
        !this.dragCanvas || this.activeObj.activePoint !== undefined) {
            if (this.dragElement === '') {
                this.setCursor(x, y); this.findTarget(x, y, e.type);
            }
        }
        if (this.currObjType.isDragging) {
            this.upperContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
            const initialDraw: boolean = this.updateActivePoint(x, y);
            this.drawObject('duplicate', null, initialDraw);
        }
    }

    private mouseUpEventHandler(e: MouseEvent & TouchEvent): void {
        e.preventDefault();
        let x: number; let y: number;
        if (e.type === 'mouseup') {
            x = e.clientX; y = e.clientY;
        } else {
            x = this.touchEndPoint.x; y = this.touchEndPoint.y;
        }
        if (e.type === 'touchend') {
            if (this.textBox.style.display === 'none') {
                this.isTimer = false; this.timer = 0;
            }
        }
        const bbox: DOMRect = this.upperCanvas.getBoundingClientRect() as DOMRect;
        const ratio: Dimension = this.calcRatio();
        if (this.factor === 1) {
            x = (x - bbox.left) * ratio.width; y = (y - bbox.top) * ratio.height;
        }
        else {
            x = (x - bbox.left) + ((this.pannStart.startX) / ratio.width * this.factor);
            y = (y - bbox.top) + ((this.pannStart.startY) / ratio.height * this.factor);
        }
        if (e.currentTarget === this.upperCanvas) {
            this.currObjType.shape = this.currObjType.shape.toLowerCase();
            if (!this.togglePen && !this.dragCanvas) {
                this.applyCurrActObj(x, y);
            }
        }
        if (this.togglePen && e.currentTarget === this.upperCanvas){
            this.penDrawColl.push({strokeWidth: this.penStrokeWidth, strokeColor:
                this.activeObj.strokeSettings.strokeColor, points: this.imageEditorPointsColl});
            this.imageEditorPointsColl = [];
        } else {this.currObjType.shape = ''; }
        this.dragElement = '';
        this.currObjType.isInitialLine = this.currObjType.isDragging = false;
        this.oldPoint.x = undefined; this.oldPoint.y = undefined;
    }

    private keyDownEventHandler(e: KeyboardEvent): void {
        let shapeChangingArgs: ShapeChangeEventArgs = {};
        const beforeSave: BeforeSaveEventArgs = {fileName: 'ImageEditor', fileType: 'Png', cancel: false};
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
        case 'Delete':
            shapeChangingArgs = {action: 'delete', previousShapeSettings: this.activeObj, currentShapeSettings: null};
            this.keyHistory = '';
            this.clearSelection();
            this.trigger('shapeChanging', shapeChangingArgs);
            this.refreshToolbar('main');
            break;
        case 'Escape':
            if (this.togglePan) {
                this.refreshToolbar(this.currentToolbar);
                this.pan(false);
            } else {
                this.cancelItems();
            }
            break;
        case 'Enter':
            this.crop();
            break;
        default:
            if (Browser.isDevice && this.textBox.style.display === 'block') {
                setTimeout(this.textKeyDown.bind(this), 1, e);
            }
            break;
        }
    }

    private keyUpEventHandler(e: KeyboardEvent): void {
        setTimeout(this.textKeyDown.bind(this), 1, e);
    }

    private canvasMouseDownHandler(e: MouseEvent & TouchEvent): void {
        e.preventDefault();
        const ratio: Dimension = this.calcRatio();
        if (e.type === 'mousedown') {
            this.lastX = e.offsetX || (e.pageX - this.lowerCanvas.offsetLeft);
            this.lastY = e.offsetY || (e.pageY - this.lowerCanvas.offsetTop);
        } else {
            this.lastX = e.touches[0].clientX || (e.touches[0].pageX - this.lowerCanvas.offsetLeft);
            this.lastY = e.touches[0].clientY || (e.touches[0].pageY - this.lowerCanvas.offsetTop);
        }
        this.lastX *= ratio.width; this.lastY *= ratio.height;
        if (this.dragCanvas || this.factor !== 1) {
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            this.dragStart = (this.lowerContext as any).transformedPoint(this.lastX, this.lastY);
            this.dragged = false;
        }
    }

    private canvasMouseMoveHandler(e: MouseEvent & TouchEvent): void {
        if (this.dragCanvas && this.factor > 1) {this.lowerCanvas.style.cursor = 'grab'; }
        else {this.dragCanvas = this.togglePan = false;
            this.lowerCanvas.style.cursor = this.upperCanvas.style.cursor = 'default'; }
        const ratio: Dimension = this.calcRatio();
        if (e.type === 'mousemove') {
            this.lastX = e.offsetX || (e.pageX - this.lowerCanvas.offsetLeft);
            this.lastY = e.offsetY || (e.pageY - this.lowerCanvas.offsetTop);
        } else {
            this.lastX = e.touches[0].clientX || (e.touches[0].pageX - this.lowerCanvas.offsetLeft);
            this.lastY = e.touches[0].clientY || (e.touches[0].pageY - this.lowerCanvas.offsetTop);
        }
        this.lastX *= ratio.width; this.lastY *= ratio.height;
        this.dragged = true;
        if (this.dragStart && this.dragCanvas) {
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            const pt: Point = (this.lowerContext as any).transformedPoint(this.lastX, this.lastY);
            const transitionArgs: PanEventArgs = {startPoint: {x: this.dragStart.x, y: this.dragStart.y},
                endPoint: {x: pt.x, y: pt.y}};
            this.trigger('panning', transitionArgs);
            let xDiff: number = pt.x - this.dragStart.x; let yDiff: number = pt.y - this.dragStart.y;
            const xxDiff: number = xDiff; const yyDiff: number = yDiff;
            this.lowerContext.translate(xDiff, yDiff); this.upperContext.translate(xDiff, yDiff);
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            const pt1: Point = (this.lowerContext as any).transformedPoint(0, 0);
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            const pt2: Point = (this.lowerContext as any).transformedPoint(this.lowerCanvas.width, this.lowerCanvas.height);
            if (xDiff >= 0) {
                if (pt1.x < 1) {
                    xDiff = 0;
                }
            } else {
                if (pt2.x > this.lowerCanvas.width) {
                    xDiff = 0;
                }
            }
            if (yDiff >= 0) {
                if (pt1.y < 1) {
                    yDiff = 0;
                }
            } else {
                if (pt2.y > this.lowerCanvas.height) {
                    yDiff = 0;
                }
            }
            this.lowerContext.translate(-xxDiff, -yyDiff);
            this.upperContext.translate(-xxDiff, -yyDiff);
            this.lowerContext.translate(xDiff, yDiff);
            this.upperContext.translate(xDiff, yDiff);
            this.redraw();
        }
    }

    private canvasMouseUpHandler(e: MouseEvent & TouchEvent): void {
        e.preventDefault();
        this.dragStart = null;
        this.currObjType.isDragging = false;
    }

    private textKeyDown(e: KeyboardEvent): void {
        if (String.fromCharCode(e.which) === '\r') {
            this.textRow += 1;
        }
        this.textBox.setAttribute('rows', this.textRow.toString());
        this.textBox.style.height = 'auto';
        this.textBox.style.height = this.textBox.scrollHeight + 'px';
        this.setTextBoxWidth(e);
        if (Browser.isDevice) {
            this.textBox.style.width = parseFloat(this.textBox.style.width) + this.textBox.style.fontSize + 'px';
        }
        const rows: string[] = this.textBox.value.split('\n');
        this.textRow = rows.length;
        this.textBox.setAttribute('rows', this.textRow.toString());
    }

    private adjustToScreen(): void {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const proxy: ImageEditor = this;
        this.applyActObj(); this.refreshActiveObj();
        if (this.imgDataColl.length > 0) {
            showSpinner(this.element);
            this.element.style.opacity = '0.5';
        }
        this.lowerContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
        this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
        this.lowerCanvas.width = this.upperCanvas.width = this.element.offsetWidth;
        this.lowerCanvas.height = this.upperCanvas.height = this.element.offsetHeight;
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
        this.redrawImg();
        // eslint-disable-next-line @typescript-eslint/tslint/config
        this.lowerCanvas.toBlob(function (blob) {
            proxy.baseImg.src = URL.createObjectURL(blob);
        }, 'image/png');
        if (this.defToolbarItems.length > 0 && (!isNullOrUndefined(document.getElementById(this.element.id + '_toolbar')))) {
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            const toolbar: any = getComponent(proxy.element.id + '_toolbar', 'toolbar') as Toolbar;
            toolbar.refreshOverflow();
        }
    }

    private screenOrientation(): void {
        if (Browser.isDevice) {
            this.isScreenOriented = true;
            setTimeout(this.adjustToScreen.bind(this), 100);
        }
    }

    private windowResizeHandler(): void {
        if (!Browser.isDevice) {
            this.adjustToScreen();
        }
    }

    private redrawImg(): void {
        let wrapperWidth: number;
        const canvasWrapper: HTMLElement = document.querySelector('#' + this.element.id + '_canvasWrapper');
        if (this.isScreenOriented) {
            wrapperWidth = parseFloat(canvasWrapper.style.width);
        } else {
            wrapperWidth = this.element.clientWidth;
        }
        const maxDimension: Dimension = this.calcMaxDimension(this.inMemoryCanvas.width, this.inMemoryCanvas.height);
        this.lowerCanvas.width = this.upperCanvas.width = this.inMemoryCanvas.width;
        this.lowerCanvas.height = this.upperCanvas.height = this.inMemoryCanvas.height;
        this.lowerCanvas.style.maxWidth = this.upperCanvas.style.maxWidth = maxDimension.width + 'px';
        this.lowerCanvas.style.maxHeight = this.upperCanvas.style.maxHeight = maxDimension.height + 'px';
        this.lowerCanvas.style.left = this.upperCanvas.style.left = (wrapperWidth - maxDimension.width) / 2 + 1 + 'px';
        this.lowerCanvas.style.top = this.upperCanvas.style.top = (this.element.offsetHeight - this.toolbarHeight - maxDimension.height) / 2 + 1 + 'px';
        this.lowerContext.drawImage(this.inMemoryCanvas, 0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
    }

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    private updateContext (ctx: any): void {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const proxy: ImageEditor = this;
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        let xform: any = new DOMMatrix();
        ctx.getTransform = () => {
            return xform;
        };
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const savedTransforms: any = [];
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const save: any = ctx.save;
        ctx.save = () => {
            savedTransforms.push(xform.translate(0, 0));
            return save.call(ctx);
        };
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const restore: any = ctx.restore;
        ctx.restore = () => {
            xform = savedTransforms.pop();
            return restore.call(ctx);
        };
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const scale: any = ctx.scale;
        ctx.scale = (sx: number, sy: number) => {
            xform = this.scaleNonUniform(xform, sx, sy);
            proxy.factor = xform.a;
            return scale.call(ctx, sx, sy);
        };
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const rotate: any = ctx.rotate;
        ctx.rotate = (radians: number) => {
            xform = xform.rotate(radians * 180 / Math.PI);
            return rotate.call(ctx, radians);
        };
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const translate: any = ctx.translate;
        ctx.translate = (dx: number, dy: number) => {
            xform = xform.translate(dx, dy);
            return translate.call(ctx, dx, dy);
        };
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const transform: any = ctx.transform;
        ctx.transform = (a: number, b: number, c: number, d: number, e: number, f: number) => {
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            const m2: any = new DOMMatrix();
            m2.a = a; m2.b = b; m2.c = c; m2.d = d; m2.e = e; m2.f = f;
            xform = xform.multiply(m2);
            return transform.call(ctx, a, b, c, d, e, f);
        };
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const setTransform: any = ctx.setTransform;
        ctx.setTransform = (a: number, b: number, c: number, d: number, e: number, f: number) => {
            xform.a = a;
            xform.b = b;
            xform.c = c;
            xform.d = d;
            xform.e = e;
            xform.f = f;
            return setTransform.call(ctx, a, b, c, d, e, f);
        };
        const pt: DOMPoint  = new DOMPoint();
        ctx.transformedPoint = (x: number, y: number) => {
            pt.x = x; pt.y = y;
            return pt.matrixTransform(xform.inverse());
        };
    }

    private scaleNonUniform(xform: any, sx: number, sy: number): any {
        xform.m11 *= sx;
        xform.m12 *= sx;
        xform.m13 *= sx;
        xform.m14 *= sx;
        xform.m21 *= sy;
        xform.m22 *= sy;
        xform.m23 *= sy;
        xform.m24 *= sy;
        return xform;
    }

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    private zoomImg(clicks: any): void {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const pt: Point = (this.lowerContext as any).transformedPoint(this.lastX, this.lastY);
        const scaleFactor: number = 1.1;
        const transitionArgs: ZoomEventArgs = {zoomPoint: {x: pt.x, y: pt.y}, zoomLevel: clicks};
        this.trigger('zooming', transitionArgs);
        this.lowerContext.translate(pt.x, pt.y); this.upperContext.translate(pt.x, pt.y);
        const factor: number = Math.pow(scaleFactor, clicks);
        this.factor += (factor - 1);
        this.lowerContext.scale(factor, factor);
        this.upperContext.scale(factor, factor);
        this.lowerContext.translate(-pt.x, -pt.y);
        this.upperContext.translate(-pt.x, -pt.y);
        const ratio: Dimension = this.calcRatio();
        if (!isNullOrUndefined(this.strokeSettings.strokeWidth)) {
            this.strokeSettings.strokeWidth = 2 * (ratio.width + ratio.height) / this.factor;
        }
        if (this.factor > 0.99 && this.factor < 1.01) {
            this.factor = 1;
            this.lowerContext.setTransform(1, 0, 0, 1, 0, 0);
            this.upperContext.setTransform(1, 0, 0, 1, 0, 0);
            this.lowerContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
            this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
            this.lowerContext.drawImage(this.inMemoryCanvas, 0, 0);
            for (let j: number = 0; j < this.objColl.length; j++ ) {
                this.apply(this.objColl[j].shape, this.objColl[j]);
                this.refreshActiveObj();
            }
        } else {
            if (this.factor > 1) {
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                const pt1: Point = (this.lowerContext as any).transformedPoint(0, 0);
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                const pt2: Point = (this.lowerContext as any).transformedPoint(this.lowerCanvas.width, this.lowerCanvas.height);
                let xDiff: number = pt.x; let yDiff: number = pt.y;
                if (pt1.x < 1) {
                    xDiff = -xDiff;
                } else if (pt2.x > this.lowerCanvas.width) {
                    xDiff = pt2.x - this.lowerCanvas.width;
                }
                if (pt1.y < 1) {
                    yDiff = -yDiff;
                } else if (pt2.y > this.lowerCanvas.height) {
                    yDiff = pt2.y - this.lowerCanvas.height;
                }
                if (xDiff !== pt.x || yDiff !== pt.y) {
                    if (xDiff === pt.x) {
                        xDiff = 0;
                    }
                    if (yDiff === pt.y) {
                        yDiff = 0;
                    }
                    this.lowerContext.translate(xDiff, yDiff);
                    this.upperContext.translate(xDiff, yDiff);
                }
            }
            this.redraw();
        }
    }

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    private handleScroll(e: any): any {
        const delta: number = e.wheelDelta ? e.wheelDelta / 40 : e.detail ? -e.detail : 0;
        if (delta) {
            this.zoom(delta);
        }
        return e.preventDefault() && false;
    }

    private redraw(): void {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const p1: Point =  (this.lowerContext as any).transformedPoint(0, 0);
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const p2: Point =  (this.lowerContext as any).transformedPoint(this.lowerCanvas.width, this.lowerCanvas.height);
        this.pannStart.startX = p1.x; this.pannStart.startY = p1.y;
        this.pannEnd.startX = this.lowerCanvas.width - p2.x;
        this.pannEnd.startY = this.lowerCanvas.height - p2.y;
        this.lowerContext.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);
        this.upperContext.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);
        this.lowerContext.save(); this.upperContext.save();
        this.lowerContext.setTransform(1, 0, 0, 1, 0, 0); this.upperContext.setTransform(1, 0, 0, 1, 0, 0);
        this.lowerContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
        this.upperContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
        this.lowerContext.restore(); this.upperContext.restore();
        this.lowerContext.drawImage(this.inMemoryCanvas, 0, 0);
        for (let j: number = 0; j < this.objColl.length; j++ ) {
            this.apply(this.objColl[j].shape, this.objColl[j]);
            this.refreshActiveObj();
        }
    }

    private applyCurrActObj(x: number, y: number): void {
        let isInside: boolean = false; const ratio: Dimension = this.calcRatio();
        let actObj: SelectionPoint = extend({}, this.activeObj, {}, true) as SelectionPoint;
        if (this.factor !== 1) {
            actObj = this.setCursorForZoomState(actObj, ratio, true);
        }
        if (isNullOrUndefined(actObj.activePoint)) {
            return;
        }
        if ((x >= Math.floor(actObj.activePoint.startX) && x <= Math.ceil(actObj.activePoint.endX) &&
            y >= Math.floor(actObj.activePoint.startY) && y <= Math.ceil(actObj.activePoint.endY)) ||
            (actObj.shape === 'text')) {
            isInside = true;
        }
        if (!isInside) {
            if (this.activeObj.horTopLine !== undefined && this.activeObj.horTopLine.startX !== 0 && this.activeObj.horTopLine.endX !== 0
                && !this.currObjType.isCustomCrop && this.currObjType.shape !== '') {
                this.objColl.push(extend({}, this.activeObj, {}, true) as SelectionPoint);
            }
            if (this.activeObj.shape === 'text' || (this.currObjType.shape === 'ellipse' || this.currObjType.shape === 'rectangle' ||
               this.currObjType.shape === 'line')) {
                for (let j: number = 0; j < this.objColl.length; j++ ) {
                    this.apply(this.objColl[j].shape, this.objColl[j]);
                }
                this.apply('shape');
            }
        }
    }

    private updateTextFromTextArea(ratio: Dimension): void {
        this.activeObj.keyHistory = this.textBox.value;
        this.textBox.style.display = 'none';
        this.textBox.value = '';
        this.updateFontStyles();
        let width: number = this.upperContext.measureText(this.activeObj.keyHistory).width +
        this.activeObj.textSettings.fontSize * 0.5;
        let height: number = this.activeObj.textSettings.fontSize + this.activeObj.textSettings.fontSize * 0.25;
        const rows: string[] = this.activeObj.keyHistory.split('\n');
        if (rows.length > 1) {
            height *= rows.length;
            const widthColl: number[] = [];
            for (let i: number = 0; i < rows.length; i++) {
                widthColl.push(this.upperContext.measureText(rows[i]).width +
                this.activeObj.textSettings.fontSize * 0.5);
            }
            width = Math.max(...widthColl);
        }
        this.setTextSelection(width, height);
        this.updateActiveObject(ratio, this.activeObj.activePoint, this.activeObj);
    }

    private redrawActObj(x?: number, y?: number): void {
        const ratio: Dimension = this.calcRatio();
        let splitWords: string[]; const bbox: DOMRect = this.upperCanvas.getBoundingClientRect() as DOMRect;
        if (this.activeObj.shape !== undefined) {splitWords = this.activeObj.shape.split('-'); }
        if (this.activeObj.horTopLine !== undefined && (this.activeObj.shape !== undefined && splitWords[0] !== 'crop')) {
            if (this.textBox.style.display === 'block') {
                this.activeObj.textSettings.fontFamily = this.textBox.style.fontFamily;
                this.activeObj.strokeSettings.strokeColor = this.textBox.style.color;
                if (this.textBox.style.fontWeight === 'bold') {
                    this.activeObj.textSettings.bold = true;
                } else {
                    this.activeObj.textSettings.bold = false;
                }
                if (this.textBox.style.fontStyle === 'italic') {
                    this.activeObj.textSettings.italic = true;
                } else {
                    this.activeObj.textSettings.italic = false;
                }
                this.activeObj.textSettings.fontSize = (parseFloat(this.textBox.style.fontSize) * ((ratio.width + ratio.height) / 2)) / this.factor;
                if (x && y) {
                    x -= bbox.left; y -= bbox.top;
                    if ((x !== this.activeObj.activePoint.startX / ratio.width) && (y !== this.activeObj.activePoint.startY /
                    ratio.height)) {
                        this.updateTextFromTextArea(ratio);
                        this.applyActObj();
                    }
                } else {
                    this.updateTextFromTextArea(ratio);
                    this.apply(this.activeObj.shape, this.activeObj);
                    this.objColl.push(this.activeObj);
                    this.refreshActiveObj();
                    this.textBox.style.transform = '';
                    this.refreshToolbar('main');
                }
            } else {
                this.applyActObj();
            }
        }
    }

    private setTextBoxPos(actObj: SelectionPoint, degree: number, flip: string, x: number, y: number, ratio: Dimension): Point {
        const point: Point = {x: x, y: y};
        if (degree === 0) {
            if (flip.toLowerCase() === 'horizontal') {
                if (this.factor === 1) {
                    point.x = (actObj.activePoint.startX / ratio.width) + parseFloat(this.lowerCanvas.style.left) +
                        actObj.activePoint.width / ratio.width;
                    point.y = (actObj.activePoint.startY / ratio.height) + parseFloat(this.lowerCanvas.style.top);
                } else {
                    point.x = (actObj.activePoint.startX - ((this.pannStart.startX) / ratio.width * this.factor)) 
                    + parseFloat(this.lowerCanvas.style.left) + actObj.activePoint.width;
                    point.y = (actObj.activePoint.startY - ((this.pannStart.startY) / ratio.height * this.factor))
                    + parseFloat(this.lowerCanvas.style.top);
                }
            }
            else if (flip.toLowerCase() === 'vertical') {
                if (this.factor === 1) {
                    point.x = (actObj.activePoint.endX / ratio.width) + parseFloat(this.lowerCanvas.style.left) -
                        actObj.activePoint.width / ratio.width;
                    point.y = (actObj.activePoint.startY / ratio.height) + parseFloat(this.lowerCanvas.style.top) +
                        actObj.activePoint.height / ratio.height;
                } else {
                    point.x = (actObj.activePoint.endX - ((this.pannStart.startX) / ratio.width * this.factor)) 
                    + parseFloat(this.lowerCanvas.style.left) - actObj.activePoint.width;
                    point.y = (actObj.activePoint.startY - ((this.pannStart.startY) / ratio.height * this.factor))
                    + parseFloat(this.lowerCanvas.style.top) + actObj.activePoint.height;
                }
            }
            else {
                if (this.factor === 1) {
                    point.x = (actObj.activePoint.startX / ratio.width) + parseFloat(this.lowerCanvas.style.left);
                    point.y = (actObj.activePoint.startY / ratio.height) + parseFloat(this.lowerCanvas.style.top);
                } else {
                    point.x = (actObj.activePoint.startX - ((this.pannStart.startX) / ratio.width * this.factor)) 
                    + parseFloat(this.lowerCanvas.style.left);
                    point.y = (actObj.activePoint.startY - ((this.pannStart.startY) / ratio.height * this.factor))
                    + parseFloat(this.lowerCanvas.style.top);
                }
            }
        } else if (degree === 90) {
            if (flip.toLowerCase() === 'horizontal') {
                if (this.factor === 1) {
                    point.x = (actObj.activePoint.startX / ratio.width) + parseFloat(this.lowerCanvas.style.left);
                    point.y = (actObj.activePoint.startY / ratio.height) + parseFloat(this.lowerCanvas.style.top);
                } else {
                    point.x = (actObj.activePoint.startX - ((this.pannStart.startX) / ratio.width * this.factor)) 
                    + parseFloat(this.lowerCanvas.style.left);
                    point.y = (actObj.activePoint.startY - ((this.pannStart.startY) / ratio.height * this.factor))
                    + parseFloat(this.lowerCanvas.style.top);
                }
            }
            else if (flip.toLowerCase() === 'vertical') {
                if (this.factor === 1) {
                    point.x = (actObj.activePoint.endX / ratio.width) + parseFloat(this.lowerCanvas.style.left);
                    point.y = (actObj.activePoint.startY / ratio.height) + parseFloat(this.lowerCanvas.style.top) +
                        actObj.activePoint.height / ratio.height;
                } else {
                    point.x = (actObj.activePoint.endX - ((this.pannStart.startX) / ratio.width * this.factor)) 
                    + parseFloat(this.lowerCanvas.style.left);
                    point.y = (actObj.activePoint.startY - ((this.pannStart.startY) / ratio.height * this.factor))
                    + parseFloat(this.lowerCanvas.style.top) + actObj.activePoint.height;
                }
            }
            else {
                if (this.factor === 1) {
                    point.x = (actObj.activePoint.startX / ratio.width) + parseFloat(this.lowerCanvas.style.left) +
                        actObj.activePoint.width / ratio.width;
                    point.y = (actObj.activePoint.startY / ratio.height) + parseFloat(this.lowerCanvas.style.top);
                } else {
                    point.x = (actObj.activePoint.startX - ((this.pannStart.startX) / ratio.width * this.factor)) 
                    + parseFloat(this.lowerCanvas.style.left) + actObj.activePoint.width;
                    point.y = (actObj.activePoint.startY - ((this.pannStart.startY) / ratio.height * this.factor))
                    + parseFloat(this.lowerCanvas.style.top);
                }
            }
        } else if (degree === 180) {
            if (flip.toLowerCase() === 'horizontal') {
                if (this.factor === 1) {
                    point.x = (actObj.activePoint.startX / ratio.width) + parseFloat(this.lowerCanvas.style.left);
                    point.y = (actObj.activePoint.startY / ratio.height) + parseFloat(this.lowerCanvas.style.top) +
                        actObj.activePoint.height / ratio.height;
                } else {
                    point.x = (actObj.activePoint.startX - ((this.pannStart.startX) / ratio.width * this.factor)) 
                    + parseFloat(this.lowerCanvas.style.left);
                    point.y = (actObj.activePoint.startY - ((this.pannStart.startY) / ratio.height * this.factor))
                    + parseFloat(this.lowerCanvas.style.top) + actObj.activePoint.height;
                }
            }
            else if (flip.toLowerCase() === 'vertical') {
                if (this.factor === 1) {
                    point.x = (actObj.activePoint.endX / ratio.width) + parseFloat(this.lowerCanvas.style.left);
                    point.y = (actObj.activePoint.startY / ratio.height) + parseFloat(this.lowerCanvas.style.top);
                } else {
                    point.x = (actObj.activePoint.endX - ((this.pannStart.startX) / ratio.width * this.factor)) 
                    + parseFloat(this.lowerCanvas.style.left);
                    point.y = (actObj.activePoint.startY - ((this.pannStart.startY) / ratio.height * this.factor))
                    + parseFloat(this.lowerCanvas.style.top);
                }
            }
            else {
                if (this.factor === 1) {
                    point.x = (actObj.activePoint.startX / ratio.width) + parseFloat(this.lowerCanvas.style.left) +
                    actObj.activePoint.width / ratio.width;
                    point.y = (actObj.activePoint.startY / ratio.height) + parseFloat(this.lowerCanvas.style.top) +
                        actObj.activePoint.height / ratio.height;
                } else {
                    point.x = (actObj.activePoint.startX - ((this.pannStart.startX) / ratio.width * this.factor)) 
                    + parseFloat(this.lowerCanvas.style.left) + actObj.activePoint.width;
                    point.y = (actObj.activePoint.startY - ((this.pannStart.startY) / ratio.height * this.factor))
                    + parseFloat(this.lowerCanvas.style.top) + actObj.activePoint.height;
                }
            }
        } else if (degree === 270) {
            if (flip.toLowerCase() === 'horizontal') {
                if (this.factor === 1) {
                    point.x = (actObj.activePoint.startX / ratio.width) + parseFloat(this.lowerCanvas.style.left) +
                        actObj.activePoint.width / ratio.width;
                    point.y = (actObj.activePoint.startY / ratio.height) + parseFloat(this.lowerCanvas.style.top) +
                        actObj.activePoint.height / ratio.height;
                } else {
                    point.x = (actObj.activePoint.startX - ((this.pannStart.startX) / ratio.width * this.factor)) 
                    + parseFloat(this.lowerCanvas.style.left) + actObj.activePoint.width;
                    point.y = (actObj.activePoint.startY - ((this.pannStart.startY) / ratio.height * this.factor))
                    + parseFloat(this.lowerCanvas.style.top) + actObj.activePoint.height;
                }
            }
            else if (flip.toLowerCase() === 'vertical') {
                if (this.factor === 1) {
                    point.x = (actObj.activePoint.endX / ratio.width) + parseFloat(this.lowerCanvas.style.left) -
                        actObj.activePoint.width / ratio.width;
                    point.y = (actObj.activePoint.startY / ratio.height) + parseFloat(this.lowerCanvas.style.top);
                } else {
                    point.x = (actObj.activePoint.endX - ((this.pannStart.startX) / ratio.width * this.factor)) 
                    + parseFloat(this.lowerCanvas.style.left) - actObj.activePoint.width;
                    point.y = (actObj.activePoint.startY - ((this.pannStart.startY) / ratio.height * this.factor))
                    + parseFloat(this.lowerCanvas.style.top);
                }
            }
            else {
                if (this.factor === 1) {
                    point.x = (actObj.activePoint.startX / ratio.width) + parseFloat(this.lowerCanvas.style.left);
                    point.y = (actObj.activePoint.startY / ratio.height) + parseFloat(this.lowerCanvas.style.top) +
                        actObj.activePoint.height / ratio.height;
                } else {
                    point.x = (actObj.activePoint.startX - ((this.pannStart.startX) / ratio.width * this.factor)) 
                    + parseFloat(this.lowerCanvas.style.left);
                    point.y = (actObj.activePoint.startY - ((this.pannStart.startY) / ratio.height * this.factor))
                    + parseFloat(this.lowerCanvas.style.top) + actObj.activePoint.height;
                }
            }
        }
        return point;
    }

    private setTextBoxPoints(actObj: SelectionPoint, degree: number, flip: string, x: number, y: number, ratio: Dimension): Point {
        const point: Point = {x: x, y: y};
        if (degree === 0) {
            if (actObj.flipObjColl[0].toLowerCase() === 'horizontal') {
                if (flip.toLowerCase() === 'horizontal') {
                    if (this.factor === 1) {
                        point.x = (actObj.activePoint.startX / ratio.width) + parseFloat(this.lowerCanvas.style.left);
                        point.y = (actObj.activePoint.startY / ratio.height) + parseFloat(this.lowerCanvas.style.top) +
                        actObj.activePoint.height / ratio.height;
                    } else {
                        point.x = (actObj.activePoint.startX - ((this.pannStart.startX) / ratio.width * this.factor)) 
                        + parseFloat(this.lowerCanvas.style.left);
                        point.y = (actObj.activePoint.startY - ((this.pannStart.startY) / ratio.height * this.factor))
                        + parseFloat(this.lowerCanvas.style.top) + actObj.activePoint.height;
                    }
                }
                else if (flip.toLowerCase() === 'vertical') {
                    if (this.factor === 1) {
                        point.x = (actObj.activePoint.endX / ratio.width) + parseFloat(this.lowerCanvas.style.left);
                        point.y = (actObj.activePoint.startY / ratio.height) + parseFloat(this.lowerCanvas.style.top) +
                        actObj.activePoint.height / ratio.height;
                    } else {
                        point.x = (actObj.activePoint.endX - ((this.pannStart.startX) / ratio.width * this.factor)) 
                        + parseFloat(this.lowerCanvas.style.left);
                        point.y = (actObj.activePoint.startY - ((this.pannStart.startY) / ratio.height * this.factor))
                        + parseFloat(this.lowerCanvas.style.top) + actObj.activePoint.height;
                    }
                }
            } else {
                if (flip.toLowerCase() === 'horizontal') {
                    if (this.factor === 1) {
                        point.x = (actObj.activePoint.endX / ratio.width) + parseFloat(this.lowerCanvas.style.left +
                            actObj.activePoint.width / ratio.width);
                        point.y = (actObj.activePoint.startY / ratio.height) + parseFloat(this.lowerCanvas.style.top) +
                            actObj.activePoint.height / ratio.height;
                    } else {
                        point.x = (actObj.activePoint.endX - ((this.pannStart.startX) / ratio.width * this.factor)) 
                        + parseFloat(this.lowerCanvas.style.left) + actObj.activePoint.width;
                        point.y = (actObj.activePoint.startY - ((this.pannStart.startY) / ratio.height * this.factor))
                        + parseFloat(this.lowerCanvas.style.top) + actObj.activePoint.height;
                    }
                }
                else if (flip.toLowerCase() === 'vertical') {
                    if (this.factor === 1) {
                        point.x = (actObj.activePoint.endX / ratio.width) + parseFloat(this.lowerCanvas.style.left);
                        point.y = (actObj.activePoint.startY / ratio.height) + parseFloat(this.lowerCanvas.style.top);
                    } else {
                        point.x = (actObj.activePoint.endX - ((this.pannStart.startX) / ratio.width * this.factor)) 
                        + parseFloat(this.lowerCanvas.style.left);
                        point.y = (actObj.activePoint.startY - ((this.pannStart.startY) / ratio.height * this.factor))
                        + parseFloat(this.lowerCanvas.style.top);
                    }
                }
            }
        } else if (degree === 90) {
            if (actObj.flipObjColl[0].toLowerCase() === 'horizontal') {
                if (flip.toLowerCase() === 'horizontal') {
                    if (this.factor === 1) {
                        point.x = (actObj.activePoint.endX / ratio.width) + parseFloat(this.lowerCanvas.style.left);
                        point.y = (actObj.activePoint.endY / ratio.height) + parseFloat(this.lowerCanvas.style.top);
                    } else {
                        point.x = (actObj.activePoint.endX - ((this.pannStart.startX) / ratio.width * this.factor)) 
                        + parseFloat(this.lowerCanvas.style.left);
                        point.y = (actObj.activePoint.endY - ((this.pannStart.startY) / ratio.height * this.factor))
                        + parseFloat(this.lowerCanvas.style.top);
                    }
                }
                else if (flip.toLowerCase() === 'vertical') {
                    if (this.factor === 1) {
                        point.x = (actObj.activePoint.startX / ratio.width) + parseFloat(this.lowerCanvas.style.left);
                        point.y = (actObj.activePoint.startY / ratio.height) + parseFloat(this.lowerCanvas.style.top) +
                            actObj.activePoint.height / ratio.height;
                    } else {
                        point.x = (actObj.activePoint.startX - ((this.pannStart.startX) / ratio.width * this.factor)) 
                        + parseFloat(this.lowerCanvas.style.left);
                        point.y = (actObj.activePoint.startY - ((this.pannStart.startY) / ratio.height * this.factor))
                        + parseFloat(this.lowerCanvas.style.top) + actObj.activePoint.height;
                    }
                }
            } else {
                if (flip.toLowerCase() === 'horizontal') {
                    if (this.factor === 1) {
                        point.x = (actObj.activePoint.startX / ratio.width) + parseFloat(this.lowerCanvas.style.left);
                        point.y = (actObj.activePoint.endY / ratio.height) + parseFloat(this.lowerCanvas.style.top);
                    } else {
                        point.x = (actObj.activePoint.startX - ((this.pannStart.startX) / ratio.width * this.factor)) 
                        + parseFloat(this.lowerCanvas.style.left);
                        point.y = (actObj.activePoint.endY - ((this.pannStart.startY) / ratio.height * this.factor))
                        + parseFloat(this.lowerCanvas.style.top);
                    }
                }
                else if (flip.toLowerCase() === 'vertical') {
                    if (this.factor === 1) {
                        point.x = (actObj.activePoint.startX / ratio.width) + parseFloat(this.lowerCanvas.style.left);
                        point.y = (actObj.activePoint.startY / ratio.height) + parseFloat(this.lowerCanvas.style.top);
                    } else {
                        point.x = (actObj.activePoint.startX - ((this.pannStart.startX) / ratio.width * this.factor)) 
                        + parseFloat(this.lowerCanvas.style.left);
                        point.y = (actObj.activePoint.startY - ((this.pannStart.startY) / ratio.height * this.factor))
                        + parseFloat(this.lowerCanvas.style.top);
                    }
                }
            }
        } else if (degree === 180) {
            if (actObj.flipObjColl[0].toLowerCase() === 'horizontal') {
                if (flip.toLowerCase() === 'horizontal') {
                    if (this.factor === 1) {
                        point.x = (actObj.activePoint.startX / ratio.width) + parseFloat(this.lowerCanvas.style.left)
                            + actObj.activePoint.width / ratio.width;
                        point.y = (actObj.activePoint.startY / ratio.height) + parseFloat(this.lowerCanvas.style.top);
                    } else {
                        point.x = (actObj.activePoint.startX - ((this.pannStart.startX) / ratio.width * this.factor)) 
                        + parseFloat(this.lowerCanvas.style.left);
                        point.y = (actObj.activePoint.startY - ((this.pannStart.startY) / ratio.height * this.factor))
                        + parseFloat(this.lowerCanvas.style.top);
                    }
                }
                else if (flip.toLowerCase() === 'vertical') {
                    if (this.factor === 1) {
                        point.x = (actObj.activePoint.startX / ratio.width) + parseFloat(this.lowerCanvas.style.left);
                        point.y = (actObj.activePoint.startY / ratio.height) + parseFloat(this.lowerCanvas.style.top);
                    } else {
                        point.x = (actObj.activePoint.startX - ((this.pannStart.startX) / ratio.width * this.factor)) 
                        + parseFloat(this.lowerCanvas.style.left);
                        point.y = (actObj.activePoint.startY - ((this.pannStart.startY) / ratio.height * this.factor))
                        + parseFloat(this.lowerCanvas.style.top);
                    }
                }
            } else {
                if (flip.toLowerCase() === 'horizontal') {
                    if (this.factor === 1) {
                        point.x = (actObj.activePoint.startX / ratio.width) + parseFloat(this.lowerCanvas.style.left);
                        point.y = (actObj.activePoint.startY / ratio.height) + parseFloat(this.lowerCanvas.style.top);
                    } else {
                        point.x = (actObj.activePoint.startX - ((this.pannStart.startX) / ratio.width * this.factor)) 
                        + parseFloat(this.lowerCanvas.style.left);
                        point.y = (actObj.activePoint.startY - ((this.pannStart.startY) / ratio.height * this.factor))
                        + parseFloat(this.lowerCanvas.style.top);
                    }
                }
                else if (flip.toLowerCase() === 'vertical') {
                    if (this.factor === 1) {
                        point.x = (actObj.activePoint.startX / ratio.width) + parseFloat(this.lowerCanvas.style.left);
                        point.y = (actObj.activePoint.endY / ratio.height) + parseFloat(this.lowerCanvas.style.top);
                    } else {
                        point.x = (actObj.activePoint.startX - ((this.pannStart.startX) / ratio.width * this.factor)) 
                        + parseFloat(this.lowerCanvas.style.left);
                        point.y = (actObj.activePoint.endY - ((this.pannStart.startY) / ratio.height * this.factor))
                        + parseFloat(this.lowerCanvas.style.top);
                    }
                }
            }
        } else if (degree === 270) {
            if (actObj.flipObjColl[0].toLowerCase() === 'horizontal') {
                if (flip.toLowerCase() === 'horizontal') {
                    if (this.factor === 1) {
                        point.x = (actObj.activePoint.startX / ratio.width) + parseFloat(this.lowerCanvas.style.left);
                        point.y = (actObj.activePoint.startY / ratio.height) + parseFloat(this.lowerCanvas.style.top);
                    } else {
                        point.x = (actObj.activePoint.startX - ((this.pannStart.startX) / ratio.width * this.factor)) 
                        + parseFloat(this.lowerCanvas.style.left);
                        point.y = (actObj.activePoint.startY - ((this.pannStart.startY) / ratio.height * this.factor))
                        + parseFloat(this.lowerCanvas.style.top);
                    }
                }
                else if (flip.toLowerCase() === 'vertical') {
                    if (this.factor === 1) {
                        point.x = (actObj.activePoint.endX / ratio.width) + parseFloat(this.lowerCanvas.style.left);
                        point.y = (actObj.activePoint.startY / ratio.height) + parseFloat(this.lowerCanvas.style.top);
                    } else {
                        point.x = (actObj.activePoint.endX - ((this.pannStart.startX) / ratio.width * this.factor)) 
                        + parseFloat(this.lowerCanvas.style.left);
                        point.y = (actObj.activePoint.startY - ((this.pannStart.startY) / ratio.height * this.factor))
                        + parseFloat(this.lowerCanvas.style.top);
                    }
                }
            } else {
                if (flip.toLowerCase() === 'horizontal') {
                    if (this.factor === 1) {
                        point.x = (actObj.activePoint.startX / ratio.width) + parseFloat(this.lowerCanvas.style.left) +
                            actObj.activePoint.width / ratio.width;
                        point.y = (actObj.activePoint.startY / ratio.height) + parseFloat(this.lowerCanvas.style.top);
                    } else {
                        point.x = (actObj.activePoint.startX - ((this.pannStart.startX) / ratio.width * this.factor)) 
                        + parseFloat(this.lowerCanvas.style.left);
                        point.y = (actObj.activePoint.startY - ((this.pannStart.startY) / ratio.height * this.factor))
                        + parseFloat(this.lowerCanvas.style.top);
                    }
                }
                else if (flip.toLowerCase() === 'vertical') {
                    if (this.factor === 1) {
                        point.x = (actObj.activePoint.endX / ratio.width) + parseFloat(this.lowerCanvas.style.left);
                        point.y = (actObj.activePoint.endY / ratio.height) + parseFloat(this.lowerCanvas.style.top);
                    } else {
                        point.x = (actObj.activePoint.endX - ((this.pannStart.startX) / ratio.width * this.factor)) 
                        + parseFloat(this.lowerCanvas.style.left);
                        point.y = (actObj.activePoint.endY - ((this.pannStart.startY) / ratio.height * this.factor))
                        + parseFloat(this.lowerCanvas.style.top);
                    }
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
        const bbox: DOMRect = this.upperCanvas.getBoundingClientRect() as DOMRect;
        const ratio: Dimension = this.calcRatio();
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
        if (this.activeObj.shapeFlip === this.currFlipState) {
            flip = '';
        }
        else {
            flip = this.currFlipState;
        }
        let temp: SelectionPoint;
        if (this.textBox.style.display === 'block') {
            x -= bbox.left; y -= bbox.top;
        } else {
            temp = extend({}, this.activeObj, {}, true) as SelectionPoint;
            for (let i: number = 0; i < this.objColl.length; i++) {
                if (JSON.stringify(this.activeObj) === JSON.stringify(this.objColl[i])) {
                    this.objColl.splice(i, 1);
                }
            }
            this.lowerContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
            this.lowerContext.drawImage(this.inMemoryCanvas, 0, 0);
            for (let i: number = 0; i < this.objColl.length; i++) {
                this.apply(this.objColl[i].shape, this.objColl[i]);
            }
            this.activeObj = temp; this.updateFontStyles();
            if (this.factor === 1) {
                x = (x - bbox.left) * ratio.width;
                y = (y - bbox.top) * ratio.height;
            } else {
                x = (x - bbox.left) + ((this.pannStart.startX) / ratio.width * this.factor);
                y = (y - bbox.top) + ((this.pannStart.startY) / ratio.height * this.factor);
            }
            let actObj: SelectionPoint = extend({}, this.activeObj, {}, true) as SelectionPoint;
            if (this.factor !== 1) {
                actObj = this.setCursorForZoomState(actObj, ratio, true);
            }
            if (x >= (actObj.activePoint.startX - actObj.topLeftCircle.radius) &&
                        x <= (actObj.activePoint.endX + actObj.topLeftCircle.radius) &&
                        y >= (actObj.activePoint.startY - actObj.topLeftCircle.radius) &&
                        y <= (actObj.activePoint.endY + actObj.topLeftCircle.radius)) {
                this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
                if (actObj.flipObjColl.length === 4) {
                    actObj.flipObjColl = [];
                    flip = '';
                }
                if (flip === '' && actObj.flipObjColl.length > 1) {
                    flip = actObj.flipObjColl[actObj.flipObjColl.length - 1];
                }
                if (actObj.flipObjColl.length <= 1) {
                    const points: Point = this.setTextBoxPos(actObj, degree, flip, x, y, ratio);
                    x = points.x; y = points.y;
                } else {
                    const points: Point = this.setTextBoxPoints(actObj, degree, flip, x, y, ratio);
                    x = points.x; y = points.y;
                }
                this.textBox.style.display = 'block';
                this.textBox.style.left = x + 'px';
                this.textBox.style.top = y + 'px';
                this.textBox.style.fontFamily = actObj.textSettings.fontFamily;
                this.textBox.style.fontSize = actObj.textSettings.fontSize / ((ratio.width + ratio.height) / 2) * this.factor + 'px';
                this.textBox.style.color = actObj.strokeSettings.strokeColor;
                this.textBox.style.fontWeight = actObj.textSettings.bold ? 'bold' : 'normal';
                this.textBox.style.fontStyle = actObj.textSettings.italic ? 'italic' : 'normal';
                this.textBox.style.border = '2px solid ' + this.themeColl[this.theme]['primaryColor'];
                this.textBox.value = actObj.keyHistory;
                this.textBox.style.overflow = 'hidden';
                this.textBox.style.height = 'auto';
                if (degree % 90 === 0 && degree % 180 !== 0 && degree !== 0) {
                    if (this.factor === 1) {
                        this.textBox.style.width = (actObj.activePoint.height / ratio.height) + 'px';
                        this.textBox.style.height = (actObj.activePoint.width / ratio.width) + 'px';
                    } else {
                        this.textBox.style.width = actObj.activePoint.height + 'px';
                        this.textBox.style.height = actObj.activePoint.width + 'px';
                    } 
                } else {
                    if (this.factor === 1) {
                        this.textBox.style.width = (actObj.activePoint.width / ratio.width) + 'px';
                        this.textBox.style.height = (actObj.activePoint.height / ratio.height) + 'px';
                    } else {
                        this.textBox.style.width = actObj.activePoint.width + 'px';
                        this.textBox.style.height = actObj.activePoint.height + 'px';
                    }    
                }
                this.setTextBoxWidth();
                this.setTextBoxHeight();
            } else {
                this.applyActObj();
            }
        }
    }

    private setTextBoxHeight(): void {
        const ratio: Dimension = this.calcRatio();
        let textBoxTop: number;
        let degree: number; let flip: string = '';
        let actObj: SelectionPoint = extend({}, this.activeObj, {}, true) as SelectionPoint;
        if (this.factor !== 1) {
            actObj = this.setCursorForZoomState(actObj, ratio, true);
        }
        if (actObj.shapeDegree === 0) {
            degree = this.degree;
        }
        else {
            degree = this.degree - actObj.shapeDegree;
        }
        if (degree < 0) {
            degree = 360 + degree;
        }
        if (actObj.shapeFlip === this.currFlipState) {
            flip = '';
        }
        else {
            flip = this.currFlipState;
        }
        if (degree === 0) {
            if (flip.toLowerCase() === 'vertical') {
                this.textBox.style.maxHeight = (parseFloat(this.lowerCanvas.style.maxHeight) - (parseFloat(this.lowerCanvas.style.maxHeight)
                - parseFloat(this.textBox.style.top))) + 'px';
            }
            else {
                textBoxTop = parseFloat(this.textBox.style.top) - parseFloat(this.lowerCanvas.style.top);
                this.textBox.style.maxHeight = (parseFloat(this.lowerCanvas.style.maxHeight) - textBoxTop) + 'px';
            }
        } else if (degree === 90) {
            if (flip.toLowerCase() === 'horizontal') {
                this.textBox.style.maxHeight = (parseFloat(this.lowerCanvas.style.maxWidth) - (parseFloat(this.textBox.style.left)
                - parseFloat(this.lowerCanvas.style.left))) + 'px';
            }
            else {
                this.textBox.style.maxHeight = (parseFloat(this.textBox.style.left)
                - parseFloat(this.lowerCanvas.style.left)) + 'px';
            }
        } else if (degree === 180) {
            if (flip.toLowerCase() === 'vertical') {
                textBoxTop = parseFloat(this.textBox.style.top) - parseFloat(this.lowerCanvas.style.top);
                this.textBox.style.maxHeight = (parseFloat(this.lowerCanvas.style.maxHeight) - textBoxTop) + 'px';
            }
            else {
                this.textBox.style.maxHeight = (parseFloat(this.textBox.style.top)
                - parseFloat(this.lowerCanvas.style.top)) + 'px';
            }
        } else if (degree === 270) {
            if (flip.toLowerCase() === 'horizontal') {
                this.textBox.style.maxHeight = (parseFloat(this.textBox.style.left)
                - parseFloat(this.lowerCanvas.style.left)) + 'px';
            }
            else {
                this.textBox.style.maxHeight = parseFloat(this.lowerCanvas.style.maxWidth) - (parseFloat(this.textBox.style.left)
                - parseFloat(this.lowerCanvas.style.left)) + 'px';
            }
        }
        this.textBox.style.maxHeight = ((parseFloat(this.textBox.style.maxHeight) - parseFloat(this.textBox.style.fontSize) * 0.5)) + 'px';
    }

    private setTextBoxWidth(e?: KeyboardEvent): void {
        const ratio: Dimension = this.calcRatio();
        const text: string = this.getMaxText(true);
        if (this.textBox.style.display === 'block') {
            this.updateFontStyles(true);
        } else {this.updateFontStyles(); }
        let textBoxWidth: number = (this.upperContext.measureText(text).width + (parseFloat(this.textBox.style.fontSize) / 2));
        let letterWidth: number = e ? this.upperContext.measureText(String.fromCharCode(e.which)).width : 0;
        let actObj: SelectionPoint = extend({}, this.activeObj, {}, true) as SelectionPoint;
        if (this.factor !== 1) {
            actObj = this.setCursorForZoomState(actObj, ratio, true);
        }
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
        if (actObj.shapeFlip === this.currFlipState) {
            flip = '';
        }
        else {
            flip = this.currFlipState;
        }
        if ((!isNullOrUndefined(e) && parseFloat(this.textBox.style.width) < (textBoxWidth + letterWidth)) || isNullOrUndefined(e)) {
            if (degree === 0) {
                if (flip.toLowerCase() === 'horizontal') {
                    if ((parseFloat(this.textBox.style.left) - parseFloat(this.lowerCanvas.style.left)) - textBoxWidth - letterWidth > 0) {
                        this.textBox.style.width = (textBoxWidth + letterWidth) + 'px';
                    }
                }
                else {
                    if ((parseFloat(this.lowerCanvas.style.maxWidth) - (parseFloat(this.textBox.style.left)
                    - parseFloat(this.lowerCanvas.style.left))) > (textBoxWidth + letterWidth)) {
                        this.textBox.style.width = (textBoxWidth + letterWidth) + 'px';
                    }
                }
            } else if (degree === 90) {
                if (flip.toLowerCase() === 'vertical') {
                    if ((parseFloat(this.textBox.style.top) - parseFloat(this.lowerCanvas.style.top)) - textBoxWidth - letterWidth > 0) {
                        this.textBox.style.width = (textBoxWidth + letterWidth) + 'px';
                    }
                }
                else {
                    if ((parseFloat(this.lowerCanvas.style.maxHeight) - (parseFloat(this.textBox.style.top)
                    - parseFloat(this.lowerCanvas.style.top))) > (textBoxWidth + letterWidth)) {
                        this.textBox.style.width = (textBoxWidth + letterWidth) + 'px';
                    }
                }
            } else if (degree === 180) {
                if (flip.toLowerCase() === 'horizontal') {
                    if ((parseFloat(this.lowerCanvas.style.maxWidth) - (parseFloat(this.textBox.style.left)
                    - parseFloat(this.lowerCanvas.style.left))) > (textBoxWidth + letterWidth)) {
                        this.textBox.style.width = (textBoxWidth + letterWidth) + 'px';
                    }
                }
                else {
                    if ((parseFloat(this.textBox.style.left) - parseFloat(this.lowerCanvas.style.left)) - textBoxWidth - letterWidth > 0) {
                        this.textBox.style.width = (textBoxWidth + letterWidth) + 'px';
                    }
                }
            } else if (degree === 270) {
                if (flip.toLowerCase() === 'vertical') {
                    if ((parseFloat(this.lowerCanvas.style.maxHeight) - (parseFloat(this.textBox.style.top)
                    - parseFloat(this.lowerCanvas.style.top))) > (textBoxWidth + letterWidth)) {
                        this.textBox.style.width = (textBoxWidth + letterWidth) + 'px';
                    }
                }
                else {
                    if ((parseFloat(this.textBox.style.top) - parseFloat(this.lowerCanvas.style.top)) - textBoxWidth - letterWidth > 0) {
                        this.textBox.style.width = (textBoxWidth + letterWidth) + 'px';
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

    private updateActivePoint(x: number, y: number):  boolean {
        let initialDraw: boolean = false;
        const bbox: DOMRect = this.lowerCanvas.getBoundingClientRect() as DOMRect;
        const ratio: Dimension = this.calcRatio();
        if (this.dragElement !== '') {
            if (this.factor === 1) {
                x = (x - bbox.left) * ratio.width; y = (y - bbox.top) * ratio.height;
            } else {
                x = ((x - bbox.left) * ratio.width) / this.factor + this.pannStart.startX;
                y = ((y - bbox.top) * ratio.height) / this.factor + this.pannStart.startY;
            }
        }
        const maxDimension: Dimension = this.calcMaxDimension(this.activeObj.activePoint.width, this.activeObj.activePoint.height);
        const shapeResizingArgs: ShapeChangeEventArgs = {action: 'resize',  previousShapeSettings: this.activeObj};
        const shapeMovingArgs: ShapeChangeEventArgs = {action: 'move', previousShapeSettings: this.activeObj};
        switch (this.dragElement.toLowerCase()) {
        case 'nw-resize':
            this.updateNWPoints(x, y, maxDimension);
            break;
        case 'n-resize':
            this.updateNPoints(x, y);
            break;
        case 'ne-resize':
            this.updateNEPoints(x, y, maxDimension);
            break;
        case 'w-resize':
            this.updateWPoints(x, y);
            break;
        case 'e-resize':
            this.updateEPoints(x, y);
            break;
        case 'sw-resize':
            this.updateSWPoints(x, y, maxDimension);
            break;
        case 's-resize':
            this.updateSPoints(x, y);
            break;
        case 'se-resize':
            this.updateSEPoints(x, y, maxDimension);
            break;
        default:
            if (this.dragPoint.startX) {
                let width: number = (this.dragPoint.endX - this.previousPoint.x);
                let height: number = (this.dragPoint.endY - this.previousPoint.y);
                if (this.factor !== 1) {
                    width = (width * ratio.width) / this.factor; height = (height * ratio.height) / this.factor;
                }
                this.activeObj.activePoint.startX += width; this.activeObj.activePoint.endX += width;
                this.activeObj.activePoint.startY += height; this.activeObj.activePoint.endY += height;
                const endPoint: Point = {x: this.lowerCanvas.width - this.pannEnd.startX, y: this.lowerCanvas.height - this.pannEnd.startY};
                if (this.activeObj.shape !== 'text' && !this.allowDrag) {
                    if (this.factor > 1 && (this.activeObj.activePoint.startX < this.pannStart.startX ||
                        this.activeObj.activePoint.endX > endPoint.x) && (this.activeObj.activePoint.startY < this.pannStart.startY ||
                        this.activeObj.activePoint.endY > endPoint.y)) {
                        this.activeObj.activePoint.startX -= width; this.activeObj.activePoint.endX -= width;
                        this.activeObj.activePoint.startY -= height; this.activeObj.activePoint.endY -= height;
                    } else if (this.factor > 1 && (this.activeObj.activePoint.startX < this.pannStart.startX ||
                        this.activeObj.activePoint.endX > endPoint.x)) {
                        this.activeObj.activePoint.startX -= width; this.activeObj.activePoint.endX -= width;
                    } else if (this.factor > 1 && (this.activeObj.activePoint.startY < this.pannStart.startY ||
                        this.activeObj.activePoint.endY > endPoint.y)) {
                        this.activeObj.activePoint.startY -= height; this.activeObj.activePoint.endY -= height;
                    }
                }
                if (this.activeObj.activePoint.startX >= this.pannStart.startX && this.activeObj.activePoint.startY >=
                    this.pannStart.startY && this.activeObj.activePoint.endX <= endPoint.x && this.activeObj.activePoint.endY
                    <= endPoint.y) {
                    this.allowDrag = false;
                }
            } else {
                this.activeObj.activePoint.startX = x < this.mouseDownPoint.x ? x : this.mouseDownPoint.x;
                this.activeObj.activePoint.startY = y < this.mouseDownPoint.y ? y : this.mouseDownPoint.y;
                if (this.factor === 1) {
                    this.activeObj.activePoint.startX = (this.activeObj.activePoint.startX - bbox.left) * ratio.width;
                    this.activeObj.activePoint.startY = (this.activeObj.activePoint.startY - bbox.top) * ratio.height;
                    initialDraw = false;
                }
                else {
                    this.activeObj.activePoint.startX = (this.activeObj.activePoint.startX - bbox.left) + ((this.pannStart.startX)
                    / ratio.width * this.factor);
                    this.activeObj.activePoint.startY = (this.activeObj.activePoint.startY - bbox.top) + ((this.pannStart.startY)
                    / ratio.height * this.factor);
                    initialDraw = true;
                }
                x = x < this.mouseDownPoint.x ? this.mouseDownPoint.x : x;
                y = y < this.mouseDownPoint.y ? this.mouseDownPoint.y : y;
                if (this.factor === 1) {
                    this.activeObj.activePoint.endX = (x - bbox.left) * ratio.width;
                    this.activeObj.activePoint.endY = (y - bbox.top) * ratio.height;
                    initialDraw = false;
                }
                else {
                    this.activeObj.activePoint.endX = (x - bbox.left) + ((this.pannStart.startX) / ratio.width * this.factor);
                    this.activeObj.activePoint.endY = (y - bbox.top) + ((this.pannStart.startY) / ratio.height * this.factor);
                    initialDraw = true;
                }
            }
            break;
        }
        shapeResizingArgs.currentShapeSettings = this.activeObj; shapeMovingArgs.currentShapeSettings = this.activeObj;
        this.trigger('shapeChanging', shapeMovingArgs); this.trigger('shapeChanging', shapeResizingArgs);
        this.activeObj.activePoint.width = this.activeObj.activePoint.endX - this.activeObj.activePoint.startX;
        this.activeObj.activePoint.height = this.activeObj.activePoint.endY - this.activeObj.activePoint.startY;
        return initialDraw;
    }

    private updateNWPoints(x: number, y: number, maxDimension: Dimension): void {
        let diff: number; let width: number; let height: number; let scale: number; let percentage: number;
        const prevDiffX: number = this.diffPoint.x; const prevDiffY: number = this.diffPoint.y;
        if (this.activeObj.shape === 'text') {
            if (this.oldPoint.x === undefined && this.oldPoint.y === undefined) {
                this.diffPoint.x = this.activeObj.activePoint.startX - x; this.diffPoint.y = this.activeObj.activePoint.startY - y;
            }
            else {this.diffPoint.x = this.oldPoint.x - x; this.diffPoint.y = this.oldPoint.y - y; }
            this.oldPoint.x = x; this.oldPoint.y = y;
            if (this.diffPoint.x <= prevDiffX && this.diffPoint.y >= prevDiffY) {diff = Math.min(this.diffPoint.x, this.diffPoint.y); }
            else {diff = Math.max(this.diffPoint.x, this.diffPoint.y); }
            percentage = diff / 10;
            this.activeObj.activePoint.startX -= (maxDimension.width / 100) * percentage;
            this.activeObj.activePoint.startY -= (maxDimension.height / 100) * percentage;
            this.activeObj.activePoint.width = this.activeObj.activePoint.endX - this.activeObj.activePoint.startX;
            this.activeObj.activePoint.height = this.activeObj.activePoint.endY - this.activeObj.activePoint.startY;
            let degree: number;
            const maxText: string = this.getMaxText();
            if (this.activeObj.shapeDegree === 0) {degree = this.degree; }
            else {degree =  this.degree - this.activeObj.shapeDegree; }
            if (degree === 0 || degree === 180) {
                this.activeObj.textSettings.fontSize = (this.activeObj.activePoint.width / maxText.length) * 2;
            } else {
                this.activeObj.textSettings.fontSize = (this.activeObj.activePoint.height / maxText.length) * 2;
            }
        } else {
            let splitWords: string[];
            if (this.activeObj.shape !== undefined) {splitWords = this.activeObj.shape.split('-'); }
            if (this.currObjType.isCustomCrop || (this.activeObj.shape !== undefined && splitWords[0] !== 'crop')) {
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
            }
            else {
                if (this.activeObj.activePoint.startX < x && this.activeObj.activePoint.startY < y) {
                    width = x - this.activeObj.activePoint.startX; height = y - this.activeObj.activePoint.startY;
                    scale = Math.min(width, height);
                    const newScale: Point = this.getScaleRatio(scale);
                    this.activeObj.activePoint.startX += newScale.x; this.activeObj.activePoint.startY += newScale.y;
                    if (this.activeObj.activePoint.startX < 0 || this.activeObj.activePoint.startY < 0) {
                        this.activeObj.activePoint.startX -= newScale.x; this.activeObj.activePoint.startY -= newScale.y;
                    }
                } else {
                    width = this.activeObj.activePoint.startX - x; height = y - this.activeObj.activePoint.endY;
                    scale = Math.max(width, height);
                    const newScale: Point = this.getScaleRatio(scale);
                    this.activeObj.activePoint.startX -= newScale.x; this.activeObj.activePoint.startY -= newScale.y;
                    if (this.activeObj.activePoint.startX < 0 || this.activeObj.activePoint.startY < 0) {
                        this.activeObj.activePoint.startX += newScale.x; this.activeObj.activePoint.startY += newScale.y;
                    }
                }
            }
            this.activeObj.activePoint.width = this.activeObj.activePoint.endX - this.activeObj.activePoint.startX;
            this.activeObj.activePoint.height = this.activeObj.activePoint.endY - this.activeObj.activePoint.startY;
        }
    }

    private updateNPoints(x: number, y: number): void {
        let width: number; let height: number; let scale: number;
        if (this.activeObj.shape !== 'text') {
            let splitWords: string[];
            if (this.activeObj.shape !== undefined) {splitWords = this.activeObj.shape.split('-'); }
            if (this.currObjType.isCustomCrop || (this.activeObj.shape !== undefined && splitWords[0] !== 'crop')) {
                this.activeObj.activePoint.startY = y;
                this.activeObj.activePoint.height = this.activeObj.activePoint.endY - this.activeObj.activePoint.startY;
                if (this.activeObj.activePoint.startY > this.activeObj.activePoint.endY) {
                    const temp: number = this.activeObj.activePoint.startY;
                    this.activeObj.activePoint.startY = this.activeObj.activePoint.endY;
                    this.activeObj.activePoint.endY = temp;
                    this.dragElement = 's-resize';
                }
            }
            else {
                if (this.activeObj.activePoint.endX > x && this.activeObj.activePoint.startY < y) {
                    width = this.activeObj.activePoint.endX - x; height = y - this.activeObj.activePoint.startY;
                    scale = Math.min(width, height);
                    const newScale: Point = this.getScaleRatio(scale);
                    this.activeObj.activePoint.endX -= newScale.x; this.activeObj.activePoint.startY += newScale.y;
                    if (this.activeObj.activePoint.endX > this.lowerCanvas.width || this.activeObj.activePoint.startY < 0) {
                        this.activeObj.activePoint.endX += newScale.x; this.activeObj.activePoint.startY -= newScale.y;
                    }
                } else {
                    width = x - this.activeObj.activePoint.endX; height = this.activeObj.activePoint.startY - y;
                    scale = Math.max(width, height);
                    const newScale: Point = this.getScaleRatio(scale);
                    this.activeObj.activePoint.endX += newScale.x; this.activeObj.activePoint.startY -= newScale.y;
                    if (this.activeObj.activePoint.endX > this.lowerCanvas.width || this.activeObj.activePoint.startY < 0) {
                        this.activeObj.activePoint.endX -= newScale.x; this.activeObj.activePoint.startY += newScale.y
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
            percentage = diff / 10;
            this.activeObj.activePoint.endX += (maxDimension.width / 100) * percentage;
            this.activeObj.activePoint.startY -= (maxDimension.height / 100) * percentage;
            this.activeObj.activePoint.width = this.activeObj.activePoint.endX - this.activeObj.activePoint.startX;
            this.activeObj.activePoint.height = this.activeObj.activePoint.endY - this.activeObj.activePoint.startY;
            let degree: number;
            const maxText: string = this.getMaxText();
            if (this.activeObj.shapeDegree === 0) {degree = this.degree; }
            else {degree =  this.degree - this.activeObj.shapeDegree; }
            if (degree === 0 || degree === 180) {
                this.activeObj.textSettings.fontSize = (this.activeObj.activePoint.width / maxText.length) * 2;
            } else {
                this.activeObj.textSettings.fontSize = (this.activeObj.activePoint.height / maxText.length) * 2;
            }
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
            }
            else {
                if (this.activeObj.activePoint.endX > x && this.activeObj.activePoint.startY < y) {
                    width = this.activeObj.activePoint.endX - x; height = y - this.activeObj.activePoint.startY;
                    scale = Math.min(width, height);
                    const newScale: Point = this.getScaleRatio(scale);
                    this.activeObj.activePoint.endX -= newScale.x; this.activeObj.activePoint.startY += newScale.y;
                    if (this.activeObj.activePoint.endX > this.lowerCanvas.width || this.activeObj.activePoint.startY < 0) {
                        this.activeObj.activePoint.endX += newScale.x; this.activeObj.activePoint.startY -= newScale.y;
                    }
                } else {
                    width = x - this.activeObj.activePoint.endX; height = this.activeObj.activePoint.startY - y;
                    scale = Math.max(width, height);
                    const newScale: Point = this.getScaleRatio(scale);
                    this.activeObj.activePoint.endX += newScale.x; this.activeObj.activePoint.startY -= newScale.y;
                    if (this.activeObj.activePoint.endX > this.lowerCanvas.width || this.activeObj.activePoint.startY < 0) {
                        this.activeObj.activePoint.endX -= newScale.x; this.activeObj.activePoint.startY += newScale.y;
                    }
                }
            }
            this.activeObj.activePoint.width = this.activeObj.activePoint.endX - this.activeObj.activePoint.startX;
            this.activeObj.activePoint.height = this.activeObj.activePoint.endY - this.activeObj.activePoint.startY;
        }
    }

    private updateWPoints(x: number, y: number): void {
        let width: number; let height: number; let scale: number;
        if (this.activeObj.shape !== 'text') {
            let splitWords: string[];
            if (this.activeObj.shape !== undefined) {splitWords = this.activeObj.shape.split('-'); }
            if (this.currObjType.isCustomCrop || (this.activeObj.shape !== undefined && splitWords[0] !== 'crop')) {
                this.activeObj.activePoint.startX = x;
                this.activeObj.activePoint.width = this.activeObj.activePoint.endX - this.activeObj.activePoint.startX;
                if (this.activeObj.activePoint.startX > this.activeObj.activePoint.endX) {
                    const temp: number = this.activeObj.activePoint.startX;
                    this.activeObj.activePoint.startX = this.activeObj.activePoint.endX;
                    this.activeObj.activePoint.endX = temp;
                    this.dragElement = 'e-resize';
                }
            }
            else {
                if (this.activeObj.activePoint.startX < x && this.activeObj.activePoint.endY > y) {
                    width = x - this.activeObj.activePoint.startX; height = this.activeObj.activePoint.endY - y;
                    scale = Math.min(width, height);
                    const newScale: Point = this.getScaleRatio(scale);
                    this.activeObj.activePoint.startX += newScale.x; this.activeObj.activePoint.endY -= newScale.y;
                    if (this.activeObj.activePoint.startX < 0 || this.activeObj.activePoint.endY > this.lowerCanvas.height) {
                        this.activeObj.activePoint.startX -= newScale.x; this.activeObj.activePoint.endY += newScale.y;
                    }
                } else {
                    width = this.activeObj.activePoint.startX - x; height = y - this.activeObj.activePoint.endY;
                    scale = Math.max(width, height);
                    const newScale: Point = this.getScaleRatio(scale);
                    this.activeObj.activePoint.startX -= newScale.x; this.activeObj.activePoint.endY += newScale.y;
                    if (this.activeObj.activePoint.startX < 0 || this.activeObj.activePoint.endY > this.lowerCanvas.height) {
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
            if (this.currObjType.isCustomCrop || (this.activeObj.shape !== undefined && splitWords[0] !== 'crop')) {
                this.activeObj.activePoint.endX = x;
                this.activeObj.activePoint.width = this.activeObj.activePoint.endX - this.activeObj.activePoint.startX;
                if (this.activeObj.activePoint.endX < this.activeObj.activePoint.startX) {
                    const temp: number = this.activeObj.activePoint.endX;
                    this.activeObj.activePoint.endX = this.activeObj.activePoint.startX;
                    this.activeObj.activePoint.startX = temp;
                    this.dragElement = 'w-resize';
                }
            }
            else {
                if (this.activeObj.activePoint.endX > x && this.activeObj.activePoint.endY > y) {
                    width = this.activeObj.activePoint.endX - x; height = this.activeObj.activePoint.endY - y;
                    scale = Math.min(width, height);
                    const newScale: Point = this.getScaleRatio(scale);
                    this.activeObj.activePoint.endX -= newScale.x; this.activeObj.activePoint.endY -= newScale.y;
                    if (this.activeObj.activePoint.endX > this.lowerCanvas.width || this.activeObj.activePoint.endY >
                    this.lowerCanvas.height) {
                        this.activeObj.activePoint.endX += newScale.x; this.activeObj.activePoint.endY += newScale.y;
                    }
                } else {
                    width = x - this.activeObj.activePoint.endX; height = y - this.activeObj.activePoint.endY;
                    scale = Math.max(width, height);
                    const newScale: Point = this.getScaleRatio(scale);
                    this.activeObj.activePoint.endX += newScale.x; this.activeObj.activePoint.endY += newScale.y;
                    if (this.activeObj.activePoint.endX > this.lowerCanvas.width || this.activeObj.activePoint.endY >
                    this.lowerCanvas.height) {
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
            percentage = diff / 10;
            this.activeObj.activePoint.startX -= (maxDimension.width / 100) * percentage;
            this.activeObj.activePoint.endY += (maxDimension.height / 100) * percentage;
            this.activeObj.activePoint.width = this.activeObj.activePoint.endX - this.activeObj.activePoint.startX;
            this.activeObj.activePoint.height = this.activeObj.activePoint.endY - this.activeObj.activePoint.startY;
            let degree: number;
            const maxText: string = this.getMaxText();
            if (this.activeObj.shapeDegree === 0) {degree = this.degree; }
            else {degree =  this.degree - this.activeObj.shapeDegree; }
            if (degree === 0 || degree === 180) {
                this.activeObj.textSettings.fontSize = (this.activeObj.activePoint.width / maxText.length) * 2;
            } else {
                this.activeObj.textSettings.fontSize = (this.activeObj.activePoint.height / maxText.length) * 2;
            }
        } else {
            let splitWords: string[];
            if (this.activeObj.shape !== undefined) {splitWords = this.activeObj.shape.split('-'); }
            if (this.currObjType.isCustomCrop || (this.activeObj.shape !== undefined && splitWords[0] !== 'crop')) {
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
            }
            else {
                if (this.activeObj.activePoint.startX < x && this.activeObj.activePoint.endY > y) {
                    width = x - this.activeObj.activePoint.startX; height = this.activeObj.activePoint.endY - y;
                    scale = Math.min(width, height);
                    const newScale: Point = this.getScaleRatio(scale);
                    this.activeObj.activePoint.startX += newScale.x; this.activeObj.activePoint.endY -= newScale.y;
                    if (this.activeObj.activePoint.startX < 0 || this.activeObj.activePoint.endY > this.lowerCanvas.height) {
                        this.activeObj.activePoint.startX -= newScale.x; this.activeObj.activePoint.endY += newScale.y;
                    }
                } else {
                    width = this.activeObj.activePoint.startX - x; height = y - this.activeObj.activePoint.endY;
                    scale = Math.max(width, height);
                    const newScale: Point = this.getScaleRatio(scale);
                    this.activeObj.activePoint.startX -= newScale.x; this.activeObj.activePoint.endY += newScale.y;
                    if (this.activeObj.activePoint.startX < 0 || this.activeObj.activePoint.endY > this.lowerCanvas.height) {
                        this.activeObj.activePoint.startX += newScale.x; this.activeObj.activePoint.endY -= newScale.y;
                    }
                }
            }
            this.activeObj.activePoint.width = this.activeObj.activePoint.endX - this.activeObj.activePoint.startX;
            this.activeObj.activePoint.height = this.activeObj.activePoint.endY - this.activeObj.activePoint.startY;
        }
    }

    private updateSPoints(x: number, y: number): void {
        let width: number; let height: number; let scale: number;
        if (this.activeObj.shape !== 'text') {
            let splitWords: string[];
            if (this.activeObj.shape !== undefined) {splitWords = this.activeObj.shape.split('-'); }
            if (this.currObjType.isCustomCrop || (this.activeObj.shape !== undefined && splitWords[0] !== 'crop')) {
                this.activeObj.activePoint.endY = y;
                this.activeObj.activePoint.height = this.activeObj.activePoint.endY - this.activeObj.activePoint.startY;
                if (this.activeObj.activePoint.endY < this.activeObj.activePoint.startY) {
                    const temp: number = this.activeObj.activePoint.endY;
                    this.activeObj.activePoint.endY = this.activeObj.activePoint.startY;
                    this.activeObj.activePoint.startY = temp;
                    this.dragElement = 'n-resize';
                }
            }
            else {
                if (this.activeObj.activePoint.endX > x && this.activeObj.activePoint.endY > y) {
                    width = this.activeObj.activePoint.endX - x;
                    height = this.activeObj.activePoint.endY - y;
                    scale = Math.min(width, height);
                    const newScale: Point = this.getScaleRatio(scale);
                    this.activeObj.activePoint.endX -= newScale.x; this.activeObj.activePoint.endY -= newScale.y;
                    if (this.activeObj.activePoint.endX > this.lowerCanvas.width || this.activeObj.activePoint.endY >
                    this.lowerCanvas.height) {
                        this.activeObj.activePoint.endX += newScale.x; this.activeObj.activePoint.endY += newScale.y;
                    }
                } else {
                    width = x - this.activeObj.activePoint.endX; height = y - this.activeObj.activePoint.endY;
                    scale = Math.max(width, height);
                    const newScale: Point = this.getScaleRatio(scale);
                    this.activeObj.activePoint.endX += newScale.x; this.activeObj.activePoint.endY += newScale.x;
                    if (this.activeObj.activePoint.endX > this.lowerCanvas.width || this.activeObj.activePoint.endY >
                    this.lowerCanvas.height) {
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
            percentage = diff / 10;
            this.activeObj.activePoint.endX += (maxDimension.width / 50) * percentage;
            this.activeObj.activePoint.endY += (maxDimension.height / 50) * percentage;
            this.activeObj.activePoint.width = this.activeObj.activePoint.endX - this.activeObj.activePoint.startX;
            this.activeObj.activePoint.height = this.activeObj.activePoint.endY - this.activeObj.activePoint.startY;
            let degree: number;
            const maxText: string = this.getMaxText();
            if (this.activeObj.shapeDegree === 0) {degree = this.degree; }
            else {degree =  this.degree - this.activeObj.shapeDegree; }
            if (degree === 0 || degree === 180) {
                this.activeObj.textSettings.fontSize = (this.activeObj.activePoint.width / maxText.length) * 2;
            } else {
                this.activeObj.textSettings.fontSize = (this.activeObj.activePoint.height / maxText.length) * 2;
            }
        } else {
            let splitWords: string[];
            if (this.activeObj.shape !== undefined) {splitWords = this.activeObj.shape.split('-'); }
            if (this.currObjType.isCustomCrop || (this.activeObj.shape !== undefined && splitWords[0] !== 'crop')) {
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
            }
            else {
                if (this.activeObj.activePoint.endX > x && this.activeObj.activePoint.endY > y) {
                    width = this.activeObj.activePoint.endX - x; height = this.activeObj.activePoint.endY - y;
                    scale = Math.min(width, height);
                    let ratio: string[] = this.activeObj.shape.split('-');
                    ratio = ratio[1].split(':');
                    const newScale: Point = this.getScaleRatio(scale);
                    this.activeObj.activePoint.endX -= newScale.x; this.activeObj.activePoint.endY -= newScale.y;
                    if (this.activeObj.activePoint.endX > this.lowerCanvas.width || this.activeObj.activePoint.endY >
                    this.lowerCanvas.height) {
                        this.activeObj.activePoint.endX += newScale.x; this.activeObj.activePoint.endY += newScale.y;
                    }
                } else {
                    width = x - this.activeObj.activePoint.endX; height = y - this.activeObj.activePoint.endY;
                    scale = Math.max(width, height);
                    const newScale: Point = this.getScaleRatio(scale);
                    this.activeObj.activePoint.endX += newScale.x; this.activeObj.activePoint.endY += newScale.y;
                    if (this.activeObj.activePoint.endX > this.lowerCanvas.width || this.activeObj.activePoint.endY >
                    this.lowerCanvas.height) {
                        this.activeObj.activePoint.endX -= newScale.x; this.activeObj.activePoint.endY -= newScale.y;
                    }
                }
            }
            this.activeObj.activePoint.width = this.activeObj.activePoint.endX - this.activeObj.activePoint.startX;
            this.activeObj.activePoint.height = this.activeObj.activePoint.endY - this.activeObj.activePoint.startY;
        }
    }

    private getScaleRatio(scale: number): Point {
        const point: Point = {x: scale, y: scale};
        if (!this.currObjType.isCustomCrop && this.activeObj.shape !== 'crop-circle' && this.activeObj.shape !== 'crop-square') {
            let ratio: string[] = this.activeObj.shape.split('-');
            ratio = ratio[1].split(':');
            const newScale: number = scale / (parseInt(ratio[1], 10));
            point.x = newScale * (parseInt(ratio[0], 10));
            point.y = newScale * (parseInt(ratio[1], 10));
        }
        return point;
    }

    private getMaxText(isTextBox?: boolean): string {
        const text: string = isTextBox ? this.textBox.value : this.activeObj.keyHistory;
        let maxi: number; const rows: string[] = text.split('\n');
        let maxStr: number = rows[0].length;
        let maxText: string = rows[0];
        for (let i: number = 1; i < rows.length; i++) {
            maxi = rows[i].length;
            if (maxi > maxStr) {
                maxText = rows[i];
                maxStr = maxi;
            }
        }
        return maxText;
    }

    private setDragLimit(): void {
        if (this.factor === 1 && this.activeObj.activePoint !== undefined && this.activeObj.shape !== 'text') {
            if (this.activeObj.activePoint.startX < 0) {
                this.activeObj.activePoint.startX = 0;
                this.activeObj.activePoint.endX = this.activeObj.activePoint.width;
            }
            else if (this.activeObj.activePoint.endX > this.lowerCanvas.width) {
                this.activeObj.activePoint.endX = this.lowerCanvas.width;
                this.activeObj.activePoint.startX = this.lowerCanvas.width - this.activeObj.activePoint.width;
            }
            if (this.activeObj.activePoint.startY < 0) {
                this.activeObj.activePoint.startY = 0;
                this.activeObj.activePoint.endY = this.activeObj.activePoint.height;
            }
            else if (this.activeObj.activePoint.endY > this.lowerCanvas.height) {
                this.activeObj.activePoint.endY = this.lowerCanvas.height;
                this.activeObj.activePoint.startY = this.lowerCanvas.height - this.activeObj.activePoint.height;
            }
        }
    }

    private lineDraw(ratio: Dimension): void {
        if (this.activeObj.activePoint.height < 10 * ratio.height) {
            this.activeObj.activePoint.startY -= 10 * ratio.height;
            this.activeObj.activePoint.endY += 10 * ratio.height;
            this.activeObj.lineDraw = 'horizontal';
        } else if (this.activeObj.activePoint.width < 10 * ratio.width) {
            this.activeObj.activePoint.startX -= 10 * ratio.width;
            this.activeObj.activePoint.endX += 10 * ratio.width;
            this.activeObj.lineDraw = 'vertical';
        }  else if (this.currObjType.isInitialLine) {
            this.activeObj.lineDraw = 'normal';
            this.currObjType.isInitialLine = false;
        }
        this.activeObj.activePoint.width = this.activeObj.activePoint.endX - this.activeObj.activePoint.startX;
        this.activeObj.activePoint.height = this.activeObj.activePoint.endY - this.activeObj.activePoint.startY;
    }

    private shapeCircle(canvasDraw: CanvasRenderingContext2D, selectionWidth: number, selectionHeight: number): void {
        const ratio: Dimension = this.calcRatio();
        canvasDraw.strokeStyle = this.themeColl[this.theme]['primaryColor'];
        canvasDraw.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
        canvasDraw.fillStyle = 'rgb(0, 0, 0, 0.5)';
        canvasDraw.fillRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
        const tempWidth: number = canvasDraw.lineWidth;
        canvasDraw.lineWidth = (2 * (ratio.width + ratio.height)) / this.factor;
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
        this.drawOuterSelection(canvasDraw, null, true);
        this.currObjType.shape = '';
    }

    private drawOuterSelection(canvasDraw: CanvasRenderingContext2D, isInitialDraw?: boolean, isCropCircle?: boolean): void {
        let splitWords: string[];
        const ratio: Dimension = this.calcRatio();
        canvasDraw.lineWidth = (0.5 * (ratio.width + ratio.height)) / this.factor;
        if (this.activeObj.shape !== undefined) {
            splitWords  = this.activeObj.shape.split('-');
        }
        let tempObj: SelectionPoint = extend({}, this.activeObj, {}, true) as SelectionPoint;
        if (this.factor !== 1) {
            if (isInitialDraw) {tempObj = this.getZoomShape(tempObj, ratio); }
        }
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

    private getZoomShape(tempObj: SelectionPoint, ratio: Dimension): SelectionPoint {
        const obj: SelectionPoint = extend({}, tempObj, {}, true) as SelectionPoint;
        obj.activePoint.startX = (obj.activePoint.startX / this.factor) * ratio.width;
        obj.activePoint.startY = (obj.activePoint.startY / this.factor) * ratio.height;
        obj.activePoint.endX = (obj.activePoint.endX / this.factor) * ratio.width;
        obj.activePoint.endY = (obj.activePoint.endY / this.factor) * ratio.height;
        obj.activePoint.width = obj.activePoint.endX - obj.activePoint.startX;
        obj.activePoint.height = obj.activePoint.endY - obj.activePoint.startY;
        this.updateActiveObject(ratio, obj.activePoint, obj);
        return obj;
    }

    private drawObject(canvas: string, obj?: SelectionPoint, isInitialDraw?: boolean, isCropRatio?: boolean, points?: ActivePoint
    ): void {
        let canvasDraw: CanvasRenderingContext2D;
        if (canvas.toLowerCase() === 'original') {
            canvasDraw = this.lowerContext;
        } else {canvasDraw = this.upperContext; }
        this.setDragLimit();
        const ratio: Dimension = this.calcRatio();
        if (this.currObjType.isLine && canvas !== 'original' && !obj) {
            this.lineDraw(ratio);
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
            this.activeObj.strokeSettings.strokeWidth = 2 * (ratio.width + ratio.height) / this.factor;
        }
        if (obj) {
            this.activeObj = extend({}, obj, {}, true) as SelectionPoint;
            if (this.factor !== 1) {
                this.updateActiveObject(ratio);
            }
        }
        else {
            this.updateActiveObject(ratio);
        }
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
                this.upperContext.clearRect(this.activeObj.activePoint.startX + ratio.width,
                                            this.activeObj.activePoint.startY + ratio.height,
                                            this.activeObj.activePoint.width - ratio.width,
                                            this.activeObj.activePoint.height - ratio.height);
            }
            this.drawOuterSelection(canvasDraw, isInitialDraw);
        }
        this.currObjType.isActiveObj = true;
        if (obj) {this.drawShapeObj(canvas, obj.shape); }
        else if (this.keyHistory !== '' && this.currObjType.isText) {this.drawShapeObj(canvas, 'text'); }
        else if (this.activeObj.shape) {this.drawShapeObj(canvas, this.activeObj.shape); }
        else {this.drawShapeObj(canvas, undefined); }
    }

    private updateActiveObject(ratio: Dimension, actPoint?: ActivePoint, obj?: SelectionPoint, isMouseMove?: boolean): void {
        actPoint = actPoint ? actPoint : extend({}, this.activeObj.activePoint, {}, true) as ActivePoint;
        obj = obj ? obj : extend({}, this.activeObj, {}, true) as SelectionPoint;
        const horCircleWidth: number = actPoint.width / 2; const verCircleHeight: number = actPoint.height / 2;
        const radius: number = 7.5;
        obj.horTopLine = {startX : actPoint.startX, startY: actPoint.startY,
            endX: actPoint.endX, endY: actPoint.endY};
        obj.horBottomLine = {startX : actPoint.startX, startY: actPoint.endY,
            endX: actPoint.endX, endY: actPoint.endY};
        obj.verLeftLine = {startX : actPoint.startX, startY: actPoint.startY,
            endX: actPoint.startX, endY: actPoint.endY};
        obj.verRightLine = {startX : actPoint.endX, startY: actPoint.startY,
            endX: actPoint.endX, endY: actPoint.endY};
        obj.topLeftCircle = {startX : actPoint.startX, startY: actPoint.startY,
            radius: obj.horTopLine.endX ? (radius * (ratio.width > ratio.height ? ratio.width : ratio.height)) / this.factor : 0};
        obj.topCenterCircle = {startX : actPoint.startX + horCircleWidth, startY: actPoint.startY,
            radius: obj.horTopLine.endX ? (radius * (ratio.width > ratio.height ? ratio.width : ratio.height)) / this.factor : 0};
        obj.topRightCircle = {startX : actPoint.endX, startY: actPoint.startY,
            radius: obj.horTopLine.endX ? (radius * (ratio.width > ratio.height ? ratio.width : ratio.height)) / this.factor : 0};
        obj.centerLeftCircle = {startX : actPoint.startX, startY: actPoint.startY + verCircleHeight,
            radius: obj.horTopLine.endX ? (radius * (ratio.width > ratio.height ? ratio.width : ratio.height)) / this.factor : 0};
        obj.centerRightCircle = {startX : actPoint.endX, startY: actPoint.startY + verCircleHeight,
            radius: obj.horTopLine.endX ? (radius * (ratio.width > ratio.height ? ratio.width : ratio.height)) / this.factor : 0};
        obj.bottomLeftCircle = {startX : actPoint.startX, startY: actPoint.endY,
            radius: obj.horTopLine.endX ? (radius * (ratio.width > ratio.height ? ratio.width : ratio.height)) / this.factor : 0};
        obj.bottomCenterCircle = {startX : actPoint.startX + horCircleWidth, startY: actPoint.endY,
            radius: obj.horTopLine.endX ? (radius * (ratio.width > ratio.height ? ratio.width : ratio.height)) / this.factor : 0};
        obj.bottomRightCircle = {startX : actPoint.endX, startY: actPoint.endY,
            radius: obj.horTopLine.endX ? (radius * (ratio.width > ratio.height ? ratio.width : ratio.height)) / this.factor : 0};
        obj.activePoint = actPoint;
        if (isNullOrUndefined(isMouseMove)) {
            this.activeObj = extend({}, obj, {}, true) as SelectionPoint;
        }
    }

    private drawShapeObj(canvas: string, shape?: string): void {
        const currentShape: string = shape !== undefined ? shape : this.currObjType.shape;
        this.currObjType.shape = currentShape; let canvasDraw: CanvasRenderingContext2D;
        if (canvas.toLowerCase() === 'original') { canvasDraw = this.lowerContext; }
        else { canvasDraw = this.upperContext; }
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
        const selectionWidth: number = this.activeObj.activePoint.endX - this.activeObj.activePoint.startX;
        const selectionHeight: number = this.activeObj.activePoint.endY - this.activeObj.activePoint.startY;
        switch (this.currObjType.shape.toLowerCase()) {
        case 'rectangle':
            this.drawSquareLines(canvasDraw);
            if (canvasDraw === this.upperContext) {
                this.drawOuterSelection(canvasDraw);
            }
            break;
        case 'ellipse':
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
                               (selectionWidth / 2) - (this.activeObj.strokeSettings.strokeWidth),
                               (selectionHeight / 2) - (this.activeObj.strokeSettings.strokeWidth),
                               0, 0, 2 * Math.PI, false);
            canvasDraw.fillStyle = this.activeObj.strokeSettings.strokeColor;
            canvasDraw.fill('evenodd');
            canvasDraw.closePath();
            if (canvasDraw === this.upperContext) {
                this.drawOuterSelection(canvasDraw);
            }
            break;
        case 'crop-circle':
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
        canvasDraw.lineWidth = (this.activeObj.strokeSettings.strokeWidth) / Math.abs(this.factor);
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
            const text: string = rows[i]; const yPoint: number = ((i + 1) * this.activeObj.textSettings.fontSize * 0.85) + (i * lineHeight);
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
                if (this.activeObj.flipObjColl[j].toLowerCase() === 'horizontal') {
                    this.lowerContext.translate(this.lowerContext.canvas.width, 0);
                    this.lowerContext.scale(-1, 1);
                    this.upperContext.translate(this.upperContext.canvas.width, 0);
                    this.upperContext.scale(-1, 1);
                    this.updateActPoint('horizontal');
                } else if (this.activeObj.flipObjColl[j].toLowerCase() === 'vertical') {
                    this.lowerContext.translate(0, this.lowerContext.canvas.height);
                    this.lowerContext.scale(1, -1);
                    this.upperContext.translate(0, this.upperContext.canvas.height);
                    this.upperContext.scale(1, -1);
                    this.updateActPoint('vertical');
                }
            }
            if (this.activeObj.shapeDegree !== this.degree) {
                this.rotateText(canvasDraw);
            } else {
                canvasDraw.fillText(text, this.activeObj.activePoint.startX + this.activeObj.textSettings.fontSize * 0.1,
                                    this.activeObj.activePoint.startY + yPoint);
            }
            for (let k: number = 0; k < this.activeObj.flipObjColl.length; k++) {
                if (this.activeObj.flipObjColl[k].toLowerCase() === 'horizontal') {
                    this.lowerContext.translate(this.lowerContext.canvas.width, 0);
                    this.lowerContext.scale(-1, 1);
                    this.upperContext.translate(this.upperContext.canvas.width, 0);
                    this.upperContext.scale(-1, 1);
                    this.updateActPoint('horizontal');
                } else if (this.activeObj.flipObjColl[k].toLowerCase() === 'vertical') {
                    this.lowerContext.translate(0, this.lowerContext.canvas.height);
                    this.lowerContext.scale(1, -1);
                    this.upperContext.translate(0, this.upperContext.canvas.height);
                    this.upperContext.scale(1, -1);
                    this.updateActPoint('vertical');
                }
            }
        }
        this.currObjType.isText = false;
    }

    private updateActPoint(degree: string): void {
        const ratio: Dimension = this.calcRatio();
        if (degree.toLowerCase() === 'horizontal') {
            if (this.activeObj.activePoint.startX <= this.lowerCanvas.width / 2) {
                this.activeObj.activePoint.startX = this.lowerCanvas.width / 2 + ((this.lowerCanvas.width / 2) -
                this.activeObj.activePoint.endX);
                this.activeObj.activePoint.endX = this.activeObj.activePoint.startX + this.activeObj.activePoint.width;
                this.updateActiveObject(ratio, this.activeObj.activePoint, this.activeObj);
            } else if (this.activeObj.activePoint.startX >= this.lowerCanvas.width / 2) {
                this.activeObj.activePoint.startX = this.lowerCanvas.width - this.activeObj.activePoint.endX;
                this.activeObj.activePoint.endX = this.activeObj.activePoint.startX + this.activeObj.activePoint.width;
                this.updateActiveObject(ratio, this.activeObj.activePoint, this.activeObj);
            }
        }
        else if (degree.toLowerCase() === 'vertical') {
            if (this.activeObj.activePoint.startY <= this.lowerCanvas.height / 2) {
                this.activeObj.activePoint.startY = this.lowerCanvas.height / 2 + ((this.lowerCanvas.height / 2) -
                this.activeObj.activePoint.endY);
                this.activeObj.activePoint.endY = this.activeObj.activePoint.startY + this.activeObj.activePoint.height;
                this.updateActiveObject(ratio, this.activeObj.activePoint, this.activeObj);
            } else if (this.activeObj.activePoint.startY >= this.lowerCanvas.height / 2) {
                this.activeObj.activePoint.startY = this.lowerCanvas.height - this.activeObj.activePoint.endY;
                this.activeObj.activePoint.endY = this.activeObj.activePoint.startY + this.activeObj.activePoint.height;
                this.updateActiveObject(ratio, this.activeObj.activePoint, this.activeObj);
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
        const bbox: DOMRect = this.upperCanvas.getBoundingClientRect() as DOMRect;
        const ratio: Dimension = this.calcRatio();
        if (this.factor === 1) {
            x = (x - bbox.left) * ratio.width;
            y = (y - bbox.top) * ratio.height;
        } else {
            x = (x - bbox.left) + ((this.pannStart.startX) / ratio.width * this.factor);
            y = (y - bbox.top) + ((this.pannStart.startY) / ratio.height * this.factor);
        }
        if (type.toLowerCase() === 'mousedown' || type.toLowerCase() === 'touchstart') {
            let splitWords: string[]; let isCrop: boolean = false;
            if (this.activeObj.shape) {
                splitWords = this.activeObj.shape.split('-');
                if (splitWords[0] === 'crop') {isCrop = true; }
            }
            this.findTargetObj(x, y, ratio, isCrop);
            this.updateCursorStyles(x, y, ratio, type);
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

    private findTargetObj(x: number, y: number, ratio: Dimension, isCrop: boolean): void {
        if (this.objColl.length !== 0 && !this.currObjType.isCustomCrop && !isCrop) {
            let diffX: number = 0; let i: number;
            for (let index: number = 0; index < this.objColl.length; index++ ) {
                let actObj: SelectionPoint = extend({}, this.objColl[index], {}, true) as SelectionPoint;
                if (this.factor !== 1) {
                    actObj = this.setCursorForZoomState(actObj, ratio);
                }
                if (x >= (actObj.activePoint.startX - actObj.topLeftCircle.radius) &&
                    x <= (actObj.activePoint.endX + actObj.topLeftCircle.radius) &&
                    y >= (actObj.activePoint.startY - actObj.topLeftCircle.radius) &&
                    y <= (actObj.activePoint.endY + actObj.topLeftCircle.radius)) {
                    if (diffX === 0 || diffX > x - actObj.activePoint.startX) {
                        diffX = x - this.objColl[index].activePoint.startX;
                        i = index;
                    }
                }
            }
            if (isNullOrUndefined(i)) {
                this.refreshActiveObj();
                return;
            }
            this.currObjType.isCustomCrop = false;
            const temp: SelectionPoint = this.activeObj = extend({}, this.objColl[i], {}, true) as SelectionPoint;
            this.objColl.splice(i, 1);
            this.inMemoryContext.clearRect(0, 0, this.inMemoryCanvas.width, this.inMemoryCanvas.height);
            this.inMemoryContext.clearRect(0, 0, this.inMemoryCanvas.height, this.inMemoryCanvas.width);
            if (this.degree === 0) {
                this.inMemoryContext.putImageData(this.imgDataColl[0].value as ImageData, 0, 0);
            } else {
                this.inMemoryCanvas.width = this.currImgData.width; this.inMemoryCanvas.height = this.currImgData.height;
                this.inMemoryContext.putImageData(this.currImgData, 0, 0);
            }
            if (this.flipState !== '') {
                this.inMemoryContext.clearRect(0, 0, this.inMemoryCanvas.width, this.inMemoryCanvas.height);
                this.inMemoryContext.clearRect(0, 0, this.inMemoryCanvas.height, this.inMemoryCanvas.width);
                this.inMemoryCanvas.width = this.currImgData.width; this.inMemoryCanvas.height = this.currImgData.height;
                this.inMemoryContext.putImageData(this.currImgData, 0, 0);
            }
            this.setActivePoint();
            this.upperContext.drawImage(this.inMemoryCanvas, 0, 0);
            this.lowerContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
            this.lowerContext.drawImage(this.inMemoryCanvas, 0, 0);
            this.upperContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
            for (let j: number = 0; j < this.objColl.length; j++ ) {
                if (this.objColl[j].shape === 'text' && this.objColl[j].shapeFlip !== this.currFlipState) {this.objColl[j].flippedText = true; }
                this.apply(this.objColl[j].shape, this.objColl[j]);
            }
            this.activeObj = extend({}, temp, {}, true) as SelectionPoint;
            const endPoint: Point = {x: this.lowerCanvas.width - this.pannEnd.startX, y: this.lowerCanvas.height - this.pannEnd.startY};
            if (this.factor !== 1 && (this.activeObj.activePoint.startX < this.pannStart.startX || this.activeObj.activePoint.startY <
            this.pannStart.startY) || (this.activeObj.activePoint.endX > endPoint.x || this.activeObj.activePoint.endY > endPoint.y)) {
                this.allowDrag = true;
            }
            this.tempStrokeSettings = extend({}, this.activeObj.strokeSettings, {}, true) as StrokeSettings;
            this.tempTextSettings = extend({}, this.activeObj.textSettings, {}, true) as TextSettings;
            if (this.activeObj.shape === 'text' && this.activeObj.shapeFlip !== this.currFlipState) {this.activeObj.flippedText = true; }
            if (this.activeObj.activePoint) {
                this.drawObject('duplicate', this.activeObj);
            }
            const shapeChangingArgs: ShapeChangeEventArgs = {action: 'select', previousShapeSettings: this.activeObj, currentShapeSettings: this.activeObj};
            this.trigger('shapeChanging', shapeChangingArgs);
        }
    }

    private updateCursorStyles(x: number, y: number, ratio: Dimension, type: string): void {
        let isResize: boolean = false;
        if (this.activeObj.keyHistory !== '' && this.activeObj.shape === undefined && !this.currObjType.isCustomCrop &&
        !this.currObjType.isLine && this.currObjType.isText) {
            this.activeObj.shape = 'text';
        }
        let actObj: SelectionPoint = extend({}, this.activeObj, {}, true) as SelectionPoint;
        if (isNullOrUndefined(actObj.topLeftCircle)) {
            return;
        }
        if (this.factor !== 1) {
            actObj = this.setCursorForZoomState(actObj, ratio, true);
        }
        if (x >= (actObj.topLeftCircle.startX - actObj.topLeftCircle.radius) &&
            x <= (actObj.topLeftCircle.startX + actObj.topLeftCircle.radius) &&
            y >= (actObj.topLeftCircle.startY - actObj.topLeftCircle.radius) &&
            y <= (actObj.topLeftCircle.startY + actObj.topLeftCircle.radius) && this.dragElement !== 'nw-resize') {
            actObj.topLeftCircle.startX = actObj.topLeftCircle.startY = 0;
            this.upperCanvas.style.cursor = 'nw-resize'; isResize = true;
            this.dragElement = this.upperCanvas.style.cursor;
        } else if (x >= (actObj.topCenterCircle.startX - actObj.topLeftCircle.radius) &&
            x <= (actObj.topCenterCircle.startX + actObj.topLeftCircle.radius) &&
            y >= (actObj.topCenterCircle.startY - actObj.topLeftCircle.radius) &&
            y <= (actObj.topCenterCircle.startY + actObj.topLeftCircle.radius) && this.dragElement !== 'n-resize') {
            actObj.topCenterCircle.startX = actObj.topCenterCircle.startY = 0;
            this.upperCanvas.style.cursor = 'n-resize'; isResize = true;
            this.dragElement = this.upperCanvas.style.cursor;
        } else if (x >= (actObj.topRightCircle.startX - actObj.topLeftCircle.radius) &&
                x <= (actObj.topRightCircle.startX + actObj.topLeftCircle.radius) &&
                y >= (actObj.topRightCircle.startY - actObj.topLeftCircle.radius) &&
                y <= (actObj.topRightCircle.startY + actObj.topLeftCircle.radius) && this.dragElement !== 'ne-resize') {
            actObj.topRightCircle.startX = actObj.topRightCircle.startY = 0;
            this.upperCanvas.style.cursor = 'ne-resize'; isResize = true;
            this.dragElement = this.upperCanvas.style.cursor;
        } else if (x >= (actObj.centerLeftCircle.startX - actObj.topLeftCircle.radius) &&
                x <= (actObj.centerLeftCircle.startX + actObj.topLeftCircle.radius) &&
                y >= (actObj.centerLeftCircle.startY - actObj.topLeftCircle.radius) &&
                y <= (actObj.centerLeftCircle.startY + actObj.topLeftCircle.radius) && this.dragElement !== 'w-resize') {
            actObj.centerLeftCircle.startX = actObj.centerLeftCircle.startY = 0;
            this.upperCanvas.style.cursor = 'w-resize'; isResize = true;
            this.dragElement = this.upperCanvas.style.cursor;
        } else if (x >= (actObj.centerRightCircle.startX - actObj.topLeftCircle.radius) &&
                x <= (actObj.centerRightCircle.startX + actObj.topLeftCircle.radius) &&
                y >= (actObj.centerRightCircle.startY - actObj.topLeftCircle.radius) &&
                y <= (actObj.centerRightCircle.startY + actObj.topLeftCircle.radius) && this.dragElement !== 'e-resize') {
            actObj.centerRightCircle.startX = actObj.centerRightCircle.startY = 0;
            this.upperCanvas.style.cursor = 'e-resize'; isResize = true;
            this.dragElement = this.upperCanvas.style.cursor;
        } else if (x >= (actObj.bottomLeftCircle.startX - actObj.topLeftCircle.radius) &&
                x <= (actObj.bottomLeftCircle.startX + actObj.topLeftCircle.radius) &&
                y >= (actObj.bottomLeftCircle.startY - actObj.topLeftCircle.radius) &&
                y <= (actObj.bottomLeftCircle.startY + actObj.topLeftCircle.radius) && this.dragElement !== 'sw-resize') {
            actObj.bottomLeftCircle.startX = actObj.bottomLeftCircle.startY = 0;
            this.upperCanvas.style.cursor = 'sw-resize'; isResize = true;
            this.dragElement = this.upperCanvas.style.cursor;
        } else if (x >= (actObj.bottomCenterCircle.startX - actObj.topLeftCircle.radius) &&
                x <= (actObj.bottomCenterCircle.startX + actObj.topLeftCircle.radius) &&
                y >= (actObj.bottomCenterCircle.startY - actObj.topLeftCircle.radius) &&
                y <= (actObj.bottomCenterCircle.startY + actObj.topLeftCircle.radius) && this.dragElement !== 's-resize') {
            actObj.bottomCenterCircle.startX = actObj.bottomCenterCircle.startY = 0;
            this.upperCanvas.style.cursor = 's-resize'; isResize = true;
            this.dragElement = this.upperCanvas.style.cursor;
        } else if (x >= (actObj.bottomRightCircle.startX - actObj.topLeftCircle.radius) &&
                x <= (actObj.bottomRightCircle.startX + actObj.topLeftCircle.radius) &&
                y >= (actObj.bottomRightCircle.startY - actObj.topLeftCircle.radius) &&
                y <= (actObj.bottomRightCircle.startY + actObj.topLeftCircle.radius) && this.dragElement !== 'se-resize') {
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
        let x: number; let y: number;
        switch (this.currObjType.shape.toLowerCase()) {
        case 'crop-square':
        case 'crop-circle':
            this.setDragDirection();
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
        if (x !== undefined && y !== undefined) {this.calcShapeRatio(x, y); }
    }

    private setDragDirection(): void {
        const ratio: Dimension = this.calcRatio();
        const arcRadius: number = (7.5 * (ratio.width > ratio.height ? ratio.width : ratio.height)) / this.factor;
        if (this.lowerCanvas.width > this.lowerCanvas.height) {
            if (this.factor === 1) {
                this.activeObj.activePoint.startX = this.dragPoint.startX = ((this.lowerCanvas.width / 2) - (this.lowerCanvas.height / 2))
                 + arcRadius;
                this.activeObj.activePoint.startY = this.dragPoint.startY = ((this.lowerCanvas.height / 2) - (this.lowerCanvas.height / 2))
                 + arcRadius;
                this.activeObj.activePoint.endX = ((this.lowerCanvas.width / 2) + (this.lowerCanvas.height / 2)) - arcRadius;
                this.activeObj.activePoint.endY = ((this.lowerCanvas.height / 2) + (this.lowerCanvas.height / 2)) - arcRadius;
            }
            else {
                const endPoint: Point = {x: this.lowerCanvas.width - this.pannEnd.startX, y: this.lowerCanvas.height - this.pannEnd.startY};
                const visibleWidth: number = endPoint.x - this.pannStart.startX;
                const visibleHeight: number = endPoint.y - this.pannStart.startY;
                const centerX: number = (this.dragPoint.startX = visibleWidth / 2) + this.pannStart.startX;
                const centerY: number = this.dragPoint.startY = visibleHeight / 2;
                this.activeObj.activePoint.startX = (centerX - centerY) + arcRadius;
                this.activeObj.activePoint.startY = (this.pannStart.startY) + arcRadius;
                this.activeObj.activePoint.endX = (this.activeObj.activePoint.startX + visibleHeight) - arcRadius;
                this.activeObj.activePoint.endY = (this.activeObj.activePoint.startY + visibleHeight) - (2 * arcRadius);
            }
        }
        else {
            if (this.factor === 1) {
                this.activeObj.activePoint.startY = this.dragPoint.startX = ((this.lowerCanvas.height / 2) - (this.lowerCanvas.width) / 2)
                 + arcRadius;
                this.activeObj.activePoint.endY = ((this.lowerCanvas.height / 2) + (this.lowerCanvas.width) / 2) - arcRadius;
                this.activeObj.activePoint.startX = this.dragPoint.startX = arcRadius;
                this.activeObj.activePoint.endX = this.lowerCanvas.width - arcRadius;
            }
            else {
                const endPoint: Point = {x: this.lowerCanvas.width - this.pannEnd.startX, y: this.lowerCanvas.height - this.pannEnd.startY};
                const visibleWidth: number = endPoint.x - this.pannStart.startX;
                const visibleHeight: number = endPoint.y - this.pannStart.startY;
                const centerX: number = this.dragPoint.startX = visibleWidth / 2;
                const centerY: number = (this.dragPoint.startY = visibleHeight / 2) + this.pannStart.startY;
                this.activeObj.activePoint.startX = this.pannStart.startX + arcRadius;
                this.activeObj.activePoint.startY = (centerY - centerX) + arcRadius;
                this.activeObj.activePoint.endX = (this.activeObj.activePoint.startX + visibleWidth) - arcRadius;
                this.activeObj.activePoint.endY = (this.activeObj.activePoint.startY + visibleWidth) - arcRadius;
            }
        }
    }

    private calcShapeRatio(x: number, y: number): void {
        const ratio: Dimension = this.calcRatio();
        const arcRadius: number = (7.5 * (ratio.width > ratio.height ? ratio.width : ratio.height)) / this.factor;
        const originalWidth: number = this.factor === 1 ? this.lowerCanvas.width : this.lowerCanvas.width / this.factor;
        const originalHeight: number = this.factor === 1 ? this.lowerCanvas.height : this.lowerCanvas.height / this.factor;
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
        if (this.factor !== 1) {
            this.activeObj.activePoint.startX += this.pannStart.startX;
            this.activeObj.activePoint.startY += this.pannStart.startY;
            this.activeObj.activePoint.endX += this.pannStart.startX;
            this.activeObj.activePoint.endY += this.pannStart.startY;
        }
        this.activeObj.activePoint.width = this.activeObj.activePoint.endX - this.activeObj.activePoint.startX;
        this.activeObj.activePoint.height = this.activeObj.activePoint.endY - this.activeObj.activePoint.startY;
    }

    private getScale(value: number, originalValue: number): number {
        return value > originalValue ? originalValue / value : 1;
    }

    private calcRatio(): Dimension {
        let widthRatio: number; let heightRatio: number;
        if (this.degree === 0 || this.degree % 180 === 0) {
            widthRatio = this.baseImg.width / parseInt(this.lowerCanvas.style.maxWidth, 10);
            heightRatio = this.baseImg.height / parseInt(this.lowerCanvas.style.maxHeight, 10);
        } else {
            widthRatio = this.baseImg.height / parseInt(this.lowerCanvas.style.maxWidth, 10);
            heightRatio = this.baseImg.width / parseInt(this.lowerCanvas.style.maxHeight, 10);
        }
        return {width: widthRatio, height: heightRatio};
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

    private setMaximumDimension(degree: number): void {
        let newWidth: number; let newHeight: number;
        if (degree % 90 === 0 && degree % 180 !== 0) {
            newWidth = this.baseImg.height; newHeight = this.baseImg.width;
        } else if (degree % 180 === 0 || degree === 0) {
            newWidth = this.baseImg.width; newHeight = this.baseImg.height;
        }
        this.lowerCanvas.width = this.upperCanvas.width = newWidth;
        this.lowerCanvas.height = this.upperCanvas.height = newHeight;
        const maxDimension: Dimension = this.calcMaxDimension(newWidth, newHeight);
        this.lowerCanvas.style.maxWidth = this.upperCanvas.style.maxWidth = maxDimension.width + 'px';
        this.lowerCanvas.style.maxHeight = this.upperCanvas.style.maxHeight = maxDimension.height + 'px';
    }

    private setCursor(x: number, y: number): void {
        const bbox: DOMRect = this.upperCanvas.getBoundingClientRect() as DOMRect;
        const ratio: Dimension = this.calcRatio();
        if (this.factor === 1) {
            x = (x - bbox.left) * ratio.width;
            y = (y - bbox.top) * ratio.height;
        } else {
            x = (x - bbox.left) + ((this.pannStart.startX) / ratio.width * this.factor);
            y = (y - bbox.top) + ((this.pannStart.startY) / ratio.height * this.factor);
        }
        if (this.activeObj.horTopLine !== undefined) {
            if (this.togglePan) {
                this.lowerCanvas.style.cursor = this.upperCanvas.style.cursor = 'grab';
            } else {
                let actObj: SelectionPoint = extend({}, this.activeObj, {}, true) as SelectionPoint;
                if (this.factor !== 1) {
                    actObj = this.setCursorForZoomState(actObj, ratio, true);
                }
                if (x >= (actObj.topLeftCircle.startX - (actObj.topLeftCircle.radius)) &&
                    x <= (actObj.topLeftCircle.startX + (actObj.topLeftCircle.radius)) &&
                    y >= (actObj.topLeftCircle.startY - (actObj.topLeftCircle.radius)) &&
                    y <= (actObj.topLeftCircle.startY + (actObj.topLeftCircle.radius))) {
                    this.upperCanvas.style.cursor = 'nw-resize';
                }
                else if (x >= (actObj.topCenterCircle.startX - (actObj.topLeftCircle.radius)) &&
                    x <= (actObj.topCenterCircle.startX + (actObj.topLeftCircle.radius)) &&
                    y >= (actObj.topCenterCircle.startY - (actObj.topLeftCircle.radius)) &&
                    y <= (actObj.topCenterCircle.startY + (actObj.topLeftCircle.radius))) {
                    this.upperCanvas.style.cursor = 'n-resize';
                }
                else if (x >= (actObj.topRightCircle.startX - (actObj.topLeftCircle.radius)) &&
                    x <= (actObj.topRightCircle.startX + (actObj.topLeftCircle.radius)) &&
                    y >= (actObj.topRightCircle.startY - (actObj.topLeftCircle.radius)) &&
                    y <= (actObj.topRightCircle.startY + (actObj.topLeftCircle.radius))) {
                    this.upperCanvas.style.cursor = 'ne-resize';
                }
                else if (x >= (actObj.centerLeftCircle.startX - (actObj.topLeftCircle.radius)) &&
                    x <= (actObj.centerLeftCircle.startX + (actObj.topLeftCircle.radius)) &&
                    y >= (actObj.centerLeftCircle.startY - (actObj.topLeftCircle.radius)) &&
                    y <= (actObj.centerLeftCircle.startY + (actObj.topLeftCircle.radius))) {
                    this.upperCanvas.style.cursor = 'w-resize';
                }
                else if (x >= (actObj.centerRightCircle.startX - (actObj.topLeftCircle.radius)) &&
                    x <= (actObj.centerRightCircle.startX + (actObj.topLeftCircle.radius)) &&
                    y >= (actObj.centerRightCircle.startY - (actObj.topLeftCircle.radius)) &&
                    y <= (actObj.centerRightCircle.startY + (actObj.topLeftCircle.radius))) {
                    this.upperCanvas.style.cursor = 'e-resize';
                }
                else if (x >= (actObj.bottomLeftCircle.startX - (actObj.topLeftCircle.radius)) &&
                    x <= (actObj.bottomLeftCircle.startX + (actObj.topLeftCircle.radius)) &&
                    y >= (actObj.bottomLeftCircle.startY - (actObj.topLeftCircle.radius)) &&
                    y <= (actObj.bottomLeftCircle.startY + (actObj.topLeftCircle.radius))) {
                    this.upperCanvas.style.cursor = 'sw-resize';
                }
                else if (x >= (actObj.bottomCenterCircle.startX - (actObj.topLeftCircle.radius)) &&
                    x <= (actObj.bottomCenterCircle.startX + (actObj.topLeftCircle.radius)) &&
                    y >= (actObj.bottomCenterCircle.startY - (actObj.topLeftCircle.radius)) &&
                    y <= (actObj.bottomCenterCircle.startY + (actObj.topLeftCircle.radius))) {
                    this.upperCanvas.style.cursor = 's-resize';
                }
                else if (x >= (actObj.bottomRightCircle.startX - (actObj.topLeftCircle.radius)) &&
                    x <= (actObj.bottomRightCircle.startX + (actObj.topLeftCircle.radius)) &&
                    y >= (actObj.bottomRightCircle.startY - (actObj.topLeftCircle.radius)) &&
                    y <= (actObj.bottomRightCircle.startY + (actObj.topLeftCircle.radius))) {
                    this.upperCanvas.style.cursor = 'se-resize';
                }
                else if ((x >= actObj.activePoint.startX &&
                    x <= actObj.activePoint.endX) && (y >= actObj.activePoint.startY &&
                    y <= actObj.activePoint.endY)) {
                    this.upperCanvas.style.cursor = 'move';
                }
                else {
                    if (this.currObjType.isCustomCrop) {
                        this.upperCanvas.style.cursor = 'cross-hair';
                    }
                    this.upperCanvas.style.cursor = 'default';
                }
            }
        }
        else if (this.togglePan) {
            this.lowerCanvas.style.cursor = this.upperCanvas.style.cursor = 'grab';
        } else {
            if (this.currObjType.isCustomCrop || this.togglePen) {this.upperCanvas.style.cursor = 'crosshair'; }
            else {this.upperCanvas.style.cursor = 'default'; }
        }
        if (this.upperCanvas.style.cursor === 'default') {
            if (this.objColl.length > 0) {
                this.setCursorFromObj(x, y, this.objColl, ratio);
            }
        }
    }

    private setCursorFromObj(x: number, y: number, obj: SelectionPoint[], ratio: Dimension): void {
        if (this.togglePan) {
            this.lowerCanvas.style.cursor = this.upperCanvas.style.cursor = 'grab';
        } else {
            for (let i: number = 0; i < obj.length; i++) {
                let actObj: SelectionPoint = extend({}, obj[i], {}, true) as SelectionPoint;
                if (this.factor !== 1) {
                    actObj = this.setCursorForZoomState(obj[i], ratio, true);
                }
                if (x >= (actObj.topLeftCircle.startX - (actObj.topLeftCircle.radius)) &&
                    x <= (actObj.topLeftCircle.startX + (actObj.topLeftCircle.radius)) &&
                    y >= (actObj.topLeftCircle.startY - (actObj.topLeftCircle.radius)) &&
                    y <= (actObj.topLeftCircle.startY + (actObj.topLeftCircle.radius))) {
                    this.upperCanvas.style.cursor = 'nw-resize';
                    break;
                }
                else if (x >= (actObj.topCenterCircle.startX - (actObj.topLeftCircle.radius)) &&
                    x <= (actObj.topCenterCircle.startX + (actObj.topLeftCircle.radius)) &&
                    y >= (actObj.topCenterCircle.startY - (actObj.topLeftCircle.radius)) &&
                    y <= (actObj.topCenterCircle.startY + (actObj.topLeftCircle.radius))) {
                    this.upperCanvas.style.cursor = 'n-resize';
                    break;
                }
                else if (x >= (actObj.topRightCircle.startX - (actObj.topLeftCircle.radius)) &&
                    x <= (actObj.topRightCircle.startX + (actObj.topLeftCircle.radius)) &&
                    y >= (actObj.topRightCircle.startY - (actObj.topLeftCircle.radius)) &&
                    y <= (actObj.topRightCircle.startY + (actObj.topLeftCircle.radius))) {
                    this.upperCanvas.style.cursor = 'ne-resize';
                    break;
                }
                else if (x >= (actObj.centerLeftCircle.startX - (actObj.topLeftCircle.radius)) &&
                    x <= (actObj.centerLeftCircle.startX + (actObj.topLeftCircle.radius)) &&
                    y >= (actObj.centerLeftCircle.startY - (actObj.topLeftCircle.radius)) &&
                    y <= (actObj.centerLeftCircle.startY + (actObj.topLeftCircle.radius))) {
                    this.upperCanvas.style.cursor = 'w-resize';
                    break;
                }
                else if (x >= (actObj.centerRightCircle.startX - (actObj.topLeftCircle.radius)) &&
                    x <= (actObj.centerRightCircle.startX + (actObj.topLeftCircle.radius)) &&
                    y >= (actObj.centerRightCircle.startY - (actObj.topLeftCircle.radius)) &&
                    y <= (actObj.centerRightCircle.startY + (actObj.topLeftCircle.radius))) {
                    this.upperCanvas.style.cursor = 'e-resize';
                    break;
                }
                else if (x >= (actObj.bottomLeftCircle.startX - (actObj.topLeftCircle.radius)) &&
                    x <= (actObj.bottomLeftCircle.startX + (actObj.topLeftCircle.radius)) &&
                    y >= (actObj.bottomLeftCircle.startY - (actObj.topLeftCircle.radius)) &&
                    y <= (actObj.bottomLeftCircle.startY + (actObj.topLeftCircle.radius))) {
                    this.upperCanvas.style.cursor = 'sw-resize';
                    break;
                }
                else if (x >= (actObj.bottomCenterCircle.startX - (actObj.topLeftCircle.radius)) &&
                    x <= (actObj.bottomCenterCircle.startX + (actObj.topLeftCircle.radius)) &&
                    y >= (actObj.bottomCenterCircle.startY - (actObj.topLeftCircle.radius)) &&
                    y <= (actObj.bottomCenterCircle.startY + (actObj.topLeftCircle.radius))) {
                    this.upperCanvas.style.cursor = 's-resize';
                    break;
                }
                else if (x >= (actObj.bottomRightCircle.startX - (actObj.topLeftCircle.radius)) &&
                    x <= (actObj.bottomRightCircle.startX + (actObj.topLeftCircle.radius)) &&
                    y >= (actObj.bottomRightCircle.startY - (actObj.topLeftCircle.radius)) &&
                    y <= (actObj.bottomRightCircle.startY + (actObj.topLeftCircle.radius))) {
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
                        this.upperCanvas.style.cursor = 'cross-hair';
                    }
                    this.upperCanvas.style.cursor = 'default';
                }
            }
        }
    }

    private setCursorForZoomState(obj: SelectionPoint, ratio: Dimension, isMouseMove?: boolean): SelectionPoint {
        const tempObj: SelectionPoint = extend({}, obj, {}, true) as SelectionPoint;
        tempObj.activePoint.startX = (tempObj.activePoint.startX / ratio.width) * this.factor;
        tempObj.activePoint.startY = (tempObj.activePoint.startY / ratio.width) * this.factor;
        tempObj.activePoint.endX = (tempObj.activePoint.endX / ratio.width) * this.factor;
        tempObj.activePoint.endY = (tempObj.activePoint.endY / ratio.width) * this.factor;
        tempObj.activePoint.width = tempObj.activePoint.endX - tempObj.activePoint.startX;
        tempObj.activePoint.height = tempObj.activePoint.endY - tempObj.activePoint.startY;
        this.updateActiveObject(ratio, tempObj.activePoint, tempObj, isMouseMove);
        tempObj.topLeftCircle.radius = (tempObj.topLeftCircle.radius / ratio.width) * this.factor;
        return tempObj;
    }

    private downloadImg(blob: string, fileName: string): void {
        const a: HTMLAnchorElement = document.createElement('a');
        a.href = blob; a.target = '_parent';
        a.download = fileName;
        (document.body || document.documentElement).appendChild(a);
        a.click(); a.parentNode.removeChild(a);
    }


    private toSVGImg(fileName?: string): string {
        const dataUrl: string = this.lowerCanvas.toDataURL();
        const svg: SVGSVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', this.lowerCanvas.style.maxWidth); svg.setAttribute('height', this.lowerCanvas.style.maxHeight);
        const XLinkNS: string = 'http://www.w3.org/1999/xlink';
        const img: SVGImageElement = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        img.setAttributeNS(null, 'height', this.lowerCanvas.height.toString());
        img.setAttributeNS(null, 'width', this.lowerCanvas.width.toString());
        img.setAttributeNS(XLinkNS, 'xlink:href', dataUrl); svg.appendChild(img);
        const prefix: string = 'data:image/svg+xml;base64,';
        const header: string = '<svg' + ' xmlns="http://www.w3.org/2000/svg"' + ' xmlns:xlink="http://www.w3.org/1999/xlink"'
         + ` width="${this.lowerCanvas.width}"` + ` height="${this.lowerCanvas.height}"` + '>';
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
        // eslint-disable-next-line @typescript-eslint/tslint/config
        this.lowerCanvas.toBlob(function(blob){
            const blobUrl: string = URL.createObjectURL(blob);
            proxy.baseImg.src = blobUrl;
            proxy.downloadImg(blobUrl, fileName + '.' + type);
        }, 'image/png');
    }

    private addLetter(letter: string): void {
        if (this.textBox.style.display === 'none' && (this.currObjType.isText || this.activeObj.shape === 'text')) {
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
        const fontSize: number = isTextBox ? parseFloat(this.textBox.style.fontSize) : this.activeObj.textSettings.fontSize;
        const fontFamily: string = this.textBox.style.display === 'block' ? this.textBox.style.fontFamily : this.activeObj.textSettings.fontFamily;
        this.upperContext.font = textStyle + fontSize + 'px' + ' ' + fontFamily;
    }

    private updateInMemoryCanvas(operation: string): void {
        if (!this.disabled) {
            const imgData: ImageData = this.lowerContext.getImageData(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
            this.imgDataColl.push({operation: operation, value: imgData});
            this.inMemoryCanvas.width = imgData.width; this.inMemoryCanvas.height = imgData.height;
            this.inMemoryContext.putImageData(imgData, 0, 0);
        }
    }

    private drawBaseImg(): void {
        this.lowerContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
        this.lowerContext.clearRect(0, 0, this.lowerCanvas.height, this.lowerCanvas.width);
        this.inMemoryContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
        this.inMemoryContext.clearRect(0, 0, this.lowerCanvas.height, this.lowerCanvas.width);
        this.inMemoryCanvas.width = this.lowerCanvas.width = (this.imgDataColl[0].value as ImageData).width;
        this.inMemoryCanvas.height = this.lowerCanvas.height = (this.imgDataColl[0].value as ImageData).height;
        this.inMemoryContext.putImageData(this.imgDataColl[0].value as ImageData, 0, 0);
        const maxDimension: Dimension = this.calcMaxDimension(this.inMemoryCanvas.width, this.inMemoryCanvas.height);
        this.lowerCanvas.style.maxWidth = this.upperCanvas.style.maxWidth = maxDimension.width + 'px';
        this.lowerCanvas.style.maxHeight = this.upperCanvas.style.maxHeight = maxDimension.height + 'px';
        this.lowerCanvas.style.left = this.upperCanvas.style.left = (this.element.clientWidth - maxDimension.width) / 2 + 1 + 'px';
        this.lowerCanvas.style.top = this.upperCanvas.style.top = (this.element.clientHeight - this.toolbarHeight - maxDimension.height) / 2 + 1 + 'px';
        this.lowerContext.drawImage(this.inMemoryCanvas, 0, 0);
    }

    private calcPrevRatio(): Dimension {
        let oldWidthRatio: number; let oldHeightRatio: number; let maxDimension: Dimension;
        if (this.degree === 0 || this.degree % 180 === 0) {
            maxDimension = this.calcMaxDimension(this.baseImg.height, this.baseImg.width);
            oldWidthRatio = this.baseImg.height / maxDimension.width;
            oldHeightRatio = this.baseImg.width / maxDimension.height;
        } else {
            maxDimension = this.calcMaxDimension(this.baseImg.width, this.baseImg.height);
            oldWidthRatio = this.baseImg.width / maxDimension.width;
            oldHeightRatio = this.baseImg.height / maxDimension.height;
        }
        return {width: oldWidthRatio, height: oldHeightRatio};
    }

    private textFlipDegree(canvasDraw: CanvasRenderingContext2D, startX: number, startY: number): void {
        const rows: string[] = this.activeObj.keyHistory.split('\n');
        const height: number = this.activeObj.textSettings.fontSize;
        const lineHeight: number = ((height * rows.length) - (this.activeObj.textSettings.fontSize * rows.length)) / rows.length;
        let yPoint: number = (this.activeObj.textSettings.fontSize * 0.85) + lineHeight;
        for (let i: number = 0; i < rows.length; i++) {
            const text: string = rows[i];
            if (i > 0) {
                if (i === 1) {
                    yPoint -= (this.activeObj.textSettings.fontSize * 0.85)
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
                canvasDraw.fillText(rows[i], startX, startY);
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

    private redrawSelection(): void {
        const ratio: Dimension = this.calcRatio();
        this.activeObj.activePoint.startX = 0; this.activeObj.activePoint.startY = 0;
        this.activeObj.activePoint.endX = this.lowerCanvas.width; this.activeObj.activePoint.endY = this.lowerCanvas.height;
        this.activeObj.activePoint.width = this.activeObj.activePoint.endX - this.activeObj.activePoint.startX;
        this.activeObj.activePoint.height = this.activeObj.activePoint.endY - this.activeObj.activePoint.startY;
        this.updateActiveObject(ratio, this.activeObj.activePoint, this.activeObj);
        this.drawObject('duplicate', this.activeObj);
    }

    private redrawObj(degree?: number | string): void {
        if (this.objColl.length > 0) {
            if (degree === 'horizontal' || degree === 'vertical' || degree === 'Horizontal' || degree === 'Vertical') {
                this.updateCurrentActiveObjPoint(degree);
            } else if (degree === 90 || degree === -90) {
                this.updateCurrentActiveObjPoint(degree);
                for (let i: number = 0; i < this.objColl.length; i++) {
                    this.apply(this.objColl[i].shape, this.objColl[i]);
                }
            } else {
                this.updateCurrentActiveObjPoint('zoom');
                for (let i: number = 0; i < this.objColl.length; i++) {
                    this.apply(this.objColl[i].shape, this.objColl[i]);
                }
            }
        } else if (this.objColl.length === 0 && (degree === 'horizontal' || degree === 'vertical' || degree === 'Horizontal' || degree === 'Vertical')) {
            if (this.activeObj.horTopLine !== undefined && (this.activeObj.shape === undefined)) {
                this.redrawSelection();
            } else if (this.activeObj.horTopLine !== undefined && this.activeObj.shape !== undefined) {
                const splitWords: string[] = this.activeObj.shape.split('-');
                if (splitWords[0] === 'crop') {
                    this.select(splitWords[1]);
                }
            }
        } else if ((degree === 'horizontal' || degree === 'vertical' || degree === 'Horizontal' || degree === 'Vertical')) {
            let splitWords: string[];
            if (this.activeObj.shape !== undefined) {
                splitWords = this.activeObj.shape.split('-');
            }
            if (splitWords !== undefined && splitWords[0] === 'crop') {
                this.select(splitWords[1]);
            } else {
                this.redrawSelection();
            }
        }
    }

    private updateCurrentActiveObjPoint(degree: number | string): void {
        const oldRatio: Dimension = this.calcPrevRatio();
        const ratio: Dimension = this.calcRatio();
        let currActObjIndex: number;
        for (let index: number = 0; index < this.objColl.length; index++) {
            if (this.activeObj.shape === this.objColl[index].shape &&
                this.activeObj.activePoint.startX === this.objColl[index].activePoint.startX &&
                this.activeObj.activePoint.startY === this.objColl[index].activePoint.startY &&
                this.activeObj.activePoint.endX === this.objColl[index].activePoint.endX &&
                this.activeObj.activePoint.endY === this.objColl[index].activePoint.endY &&
                this.activeObj.currIndex === this.objColl[index].currIndex) {
                currActObjIndex = index;
                break;
            }
        }
        if (degree === 'horizontal' || degree === 'vertical' || degree === 'Horizontal' || degree === 'Vertical') {
            if (degree === 'horizontal' || degree === 'Horizontal') {
                for (let i: number = 0; i < this.objColl.length; i++) {
                    if (this.objColl[i].activePoint.startX <= this.lowerCanvas.width / 2) {
                        this.objColl[i].activePoint.startX = this.lowerCanvas.width / 2 + ((this.lowerCanvas.width / 2) -
                        this.objColl[i].activePoint.endX);
                        this.objColl[i].activePoint.endX = this.objColl[i].activePoint.startX + this.objColl[i].activePoint.width;
                        this.updateActiveObject(ratio, this.objColl[i].activePoint, this.objColl[i]);
                    } else if (this.objColl[i].activePoint.startX >= this.lowerCanvas.width / 2) {
                        this.objColl[i].activePoint.startX = this.lowerCanvas.width - this.objColl[i].activePoint.endX;
                        this.objColl[i].activePoint.endX = this.objColl[i].activePoint.startX + this.objColl[i].activePoint.width;
                        this.updateActiveObject(ratio, this.objColl[i].activePoint, this.objColl[i]);
                    }
                }
            }
            else if (degree === 'vertical' || degree === 'Vertical') {
                for (let i: number = 0; i < this.objColl.length; i++) {
                    if (this.objColl[i].activePoint.startY <= this.lowerCanvas.height / 2) {
                        this.objColl[i].activePoint.startY = this.lowerCanvas.height / 2 + ((this.lowerCanvas.height / 2) -
                        this.objColl[i].activePoint.endY);
                        this.objColl[i].activePoint.endY = this.objColl[i].activePoint.startY + this.objColl[i].activePoint.height;
                        this.updateActiveObject(ratio, this.objColl[i].activePoint, this.objColl[i]);
                    } else if (this.objColl[i].activePoint.startY >= this.lowerCanvas.height / 2) {
                        this.objColl[i].activePoint.startY = this.lowerCanvas.height - this.objColl[i].activePoint.endY;
                        this.objColl[i].activePoint.endY = this.objColl[i].activePoint.startY + this.objColl[i].activePoint.height;
                        this.updateActiveObject(ratio, this.objColl[i].activePoint, this.objColl[i]);
                    }
                }
            }
            if (currActObjIndex !== undefined) {
                this.activeObj = extend({}, this.objColl[currActObjIndex], {}, true) as SelectionPoint;
            }
        }
        else if (degree === 90 || degree === -90) {
            for (let i: number = 0; i < this.objColl.length; i++) {
                this.objColl[i].activePoint.startX /= oldRatio.width; this.objColl[i].activePoint.startY /= oldRatio.height;
                this.objColl[i].activePoint.endX /= oldRatio.width; this.objColl[i].activePoint.endY /= oldRatio.height;
                this.objColl[i].activePoint.height = this.objColl[i].activePoint.endX - this.objColl[i].activePoint.startX;
                this.objColl[i].activePoint.width = this.objColl[i].activePoint.endY - this.objColl[i].activePoint.startY;
                this.objColl[i].strokeSettings.strokeWidth /= (oldRatio.width / this.factor);
                this.calcCurrPoints(degree as number, this.objColl[i]);
                this.objColl[i].activePoint.endX = this.objColl[i].activePoint.startX + this.objColl[i].activePoint.width;
                this.objColl[i].activePoint.endY = this.objColl[i].activePoint.startY + this.objColl[i].activePoint.height;
                this.objColl[i].activePoint.width = this.objColl[i].activePoint.endX - this.objColl[i].activePoint.startX;
                this.objColl[i].activePoint.height = this.objColl[i].activePoint.endY - this.objColl[i].activePoint.startY;
            }
            for (let i: number = 0; i < this.objColl.length; i++) {
                this.objColl[i].activePoint.startX *= oldRatio.width; this.objColl[i].activePoint.startY *= oldRatio.height;
                this.objColl[i].activePoint.endX *= oldRatio.width; this.objColl[i].activePoint.endY *= oldRatio.height;
                this.objColl[i].activePoint.width = this.objColl[i].activePoint.endX - this.objColl[i].activePoint.startX;
                this.objColl[i].activePoint.height = this.objColl[i].activePoint.endY - this.objColl[i].activePoint.startY;
                this.objColl[i].strokeSettings.strokeWidth *= ratio.width;
            }
            for (let i: number = 0; i < this.objColl.length; i++) {
                this.updateActiveObject(ratio, this.objColl[i].activePoint, this.objColl[i]);
            }
        } else if (degree === 'zoom') {
            for (let i: number = 0; i < this.objColl.length; i++) {
                this.objColl[i].activePoint.startX /= ratio.width; this.objColl[i].activePoint.startY /= ratio.height;
                this.objColl[i].activePoint.endX /= ratio.width; this.objColl[i].activePoint.endY /= ratio.height;
                this.objColl[i].activePoint.height = this.objColl[i].activePoint.endX - this.objColl[i].activePoint.startX;
                this.objColl[i].activePoint.width = this.objColl[i].activePoint.endY - this.objColl[i].activePoint.startY;
                this.objColl[i].activePoint.startX *= ratio.width;
                this.objColl[i].activePoint.startY *= ratio.height;
                this.objColl[i].activePoint.endX *= ratio.width;
                this.objColl[i].activePoint.endY *= ratio.height;
                this.objColl[i].activePoint.width = this.objColl[i].activePoint.endX - this.objColl[i].activePoint.startX;
                this.objColl[i].activePoint.height = this.objColl[i].activePoint.endY - this.objColl[i].activePoint.startY;
            }
        }
    }

    private calcCurrPoints(degree: number, obj: SelectionPoint): void {
        const oldRatio: Dimension = this.calcPrevRatio();
        if (degree > 0) {
            const x: number = obj.activePoint.startX;
            obj.activePoint.startX = (this.lowerCanvas.width / oldRatio.width) - (obj.activePoint.startY + obj.activePoint.width);
            obj.activePoint.startY = x;
        } else {
            const y: number = obj.activePoint.startY;
            obj.activePoint.startY = (this.lowerCanvas.height / oldRatio.height) - (obj.activePoint.startX + obj.activePoint.height);
            obj.activePoint.startX = y;
        }
    }

    private redrawShape(obj: SelectionPoint): void {
        for (let i: number = 0; i < this.objColl.length; i++) {
            if (JSON.stringify(obj) === JSON.stringify(this.objColl[i])) {
                this.objColl.splice(i, 1);
                break;
            }
        }
        this.upperContext.clearRect(0, 0 , this.upperCanvas.width, this.upperCanvas.height);
        this.drawObject('duplicate', obj);
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
            if (this.activeObj.activePoint.width !== 0 && this.activeObj.activePoint.height !== 0 && !isCropSelection) {
                for (let i: number = 0; i < this.objColl.length; i++) {
                    if (JSON.stringify(this.activeObj) === JSON.stringify(this.objColl[i])) {
                        isActObj = true;
                        break;
                    }
                }
                if (!isActObj) {
                    if (isNullOrUndefined(this.activeObj.currIndex)) {
                        this.activeObj.currIndex = 'shape_' + (this.objColl.length + 1);
                    }
                    const splitWords: string[] = this.activeObj.currIndex.split('_');
                    let tempObjColl: SelectionPoint[] = this.objColl.splice(0, parseInt(splitWords[1], 10) - 1);
                    tempObjColl.push(extend({}, this.activeObj, {}, true) as SelectionPoint);
                    for (let i: number = 0; i < this.objColl.length; i++) {
                        tempObjColl.push(this.objColl[i]);
                    }
                    this.objColl = tempObjColl;
                    tempObjColl = []; this.refreshActiveObj();
                    this.lowerContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
                    this.lowerContext.drawImage(this.inMemoryCanvas, 0, 0);
                    for (let i: number = 0; i < this.objColl.length; i++) {
                        this.apply(this.objColl[i].shape, this.objColl[i]);
                    }
                    this.activeObj.flippedText = false;
                    this.currObjType.shape = '';
                    this.refreshActiveObj();
                }
            }
        }
    }

    private apply(shape?: string, obj?: SelectionPoint, canvas?: string): void {
        if (!this.disabled) {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const proxy: ImageEditor = this;
            if ((this.togglePen) && !this.currObjType.isCustomCrop) {
                // eslint-disable-next-line @typescript-eslint/tslint/config
                this.upperCanvas.toBlob(function(blob){
                    showSpinner(proxy.element);
                    proxy.element.style.opacity = '0.5';
                    proxy.lowerContext.clearRect(0, 0, proxy.lowerCanvas.width, proxy.lowerCanvas.height);
                    proxy.lowerContext.drawImage(proxy.inMemoryCanvas, 0, 0);
                    proxy.baseImg.src = URL.createObjectURL(blob);
                    proxy.upperContext.clearRect(0, 0, proxy.upperCanvas.width, proxy.upperCanvas.height);
                    proxy.togglePen = false;
                    proxy.upperCanvas.style.cursor = 'default';
                    for (let i: number = 0, len: number = proxy.objColl.length; i < len; i++ ) {
                        proxy.apply(proxy.objColl[i].shape, proxy.objColl[i], 'duplicate');
                    }
                    proxy.togglePen = true;
                }, 'image/png');
                this.isUndoRedo = false; this.degree = 0;
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
                this.isUndoRedo = false;
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
        if (this.factor === 1) {
            this.activeObj.activePoint.startX = (this.lowerCanvas.width / 2) - renderWidth / 2;
            this.activeObj.activePoint.startY = (this.lowerCanvas.height / 2) - renderHeight / 2;
            this.activeObj.activePoint.endX = (this.lowerCanvas.width / 2) + renderWidth / 2;
            this.activeObj.activePoint.endY = (this.lowerCanvas.height / 2) + renderHeight / 2;
        } else {
            const endPoint: Point = {x: this.lowerCanvas.width - this.pannEnd.startX, y: this.lowerCanvas.height - this.pannEnd.startY};
            const visibleWidth: number = endPoint.x - this.pannStart.startX;
            const visibleHeight: number = endPoint.y - this.pannStart.startY;
            const centerX: number = (this.dragPoint.startX = visibleWidth / 2) + this.pannStart.startX;
            const centerY: number = this.dragPoint.startY = visibleHeight / 2 + this.pannStart.startY;
            this.activeObj.activePoint.startX = centerX - (renderWidth / 2);
            this.activeObj.activePoint.startY = centerY - (renderHeight / 2);
            this.activeObj.activePoint.endX = centerX + (renderWidth / 2);
            this.activeObj.activePoint.endY = centerY + (renderHeight / 2);
        }
        if (text && width && height) {
            this.textStartPoints.x = this.activeObj.activePoint.startX;
            this.textStartPoints.y = this.activeObj.activePoint.startY;
        }
    }

    private drawShape(type: string, strokeWidth?: number, strokeColor?: string, fillColor?: string, start?: Point, width?: number,
                      height?: number): void {
        if (!this.disabled && this.imgDataColl.length > 0) {
            const ratio: Dimension = this.calcRatio();
            this.redrawActObj();
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
                const tempWidth: number = 100 / this.factor; const tempHeight: number = 100 / this.factor;
                this.activeObj.activePoint.width = tempWidth * ratio.width; this.activeObj.activePoint.height = tempHeight * ratio.height;
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
                if (start !== undefined) {
                    this.activeObj.activePoint.startX = start.x; this.activeObj.activePoint.startY = start.y;
                    this.activeObj.activePoint.endX = this.activeObj.activePoint.startX + this.activeObj.activePoint.width;
                    this.activeObj.activePoint.endY = this.activeObj.activePoint.startY + this.activeObj.activePoint.height;
                } else {
                    this.setCenterPoints();
                }
                this.currObjType.isDragging = this.currObjType.isCustomCrop = false;
                this.activeObj.shapeDegree = this.degree;
                this.activeObj.flipObjColl = [];
                this.drawObject('duplicate');
                this.refreshToolbar('shapes');
            }
        }
    }

    private drawShapeText(text?: string, fontFamily?: string, fontSize?: number, bold?: boolean, italic?: boolean,
                          strokeColor?: string, x?: number, y?: number): void {
        if (!this.disabled && this.imgDataColl.length > 0) {
            if (this.currObjType.shape === 'freehanddraw') {
                this.apply(); this.upperCanvas.style.cursor = 'default';
                this.currObjType.shape = '';
            }
            const ratio: Dimension = this.calcRatio();
            this.togglePen = false;
            this.redrawActObj();
            this.keyHistory = '';
            this.refreshActiveObj();
            const shapeChangingArgs: ShapeChangeEventArgs = {action: 'insert', previousShapeSettings: this.activeObj, currentShapeSettings: this.activeObj};
            this.trigger('shapeChanging', shapeChangingArgs);
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
                if (this.activeObj.textSettings.fontSize < 20 * (ratio.width + ratio.height)) {
                    this.activeObj.textSettings.fontSize = 20 * (ratio.width + ratio.height);
                }
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
            this.addLetter(this.activeObj.textSettings.text);
            this.refreshToolbar('text');
        }
    }

    private drawPen(context?: CanvasRenderingContext2D): void {
        const ratio: Dimension = this.calcRatio();
        context = context ? context : this.upperContext;
        this.upperCanvas.style.display = 'block';
        this.canvasRatio = this.calcRatio();
        if (isNullOrUndefined(this.activeObj.strokeSettings)) {
            this.activeObj.strokeSettings = this.strokeSettings;
        }
        if (isNullOrUndefined(this.activeObj.strokeSettings.strokeWidth)) {
            this.activeObj.strokeSettings.strokeWidth = (ratio.width + ratio.height) * 0.4;
        }
        context.strokeStyle = this.activeObj.strokeSettings.strokeColor;
        context.lineWidth = 2 * (this.activeObj.strokeSettings.strokeWidth) / this.factor;
        context.beginPath();
        context.moveTo(this.prevX, this.prevY);
        context.lineTo(this.currX, this.currY);
        context.stroke();
        context.closePath();
    }

    private getObjDetails(obj: SelectionPoint): ShapeSettings {
        const shapeDetails: ShapeSettings = {} as ShapeSettings;
        shapeDetails.id = obj.currIndex;
        shapeDetails.type = obj.shape as ShapeType;
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

    private isPointsInRange(x: number, y: number): boolean {
        let inRange: boolean = false;
        if (this.factor === 1) {
            if (x >= 0 && y >= 0 && x <= this.lowerCanvas.width && y <= this.lowerCanvas.width) {
                inRange = true;
            }
        } else {
            const endPoint: Point = { x: this.lowerCanvas.width - this.pannEnd.startX, y: this.lowerCanvas.height - this.pannEnd.startY };
            if (x >= this.pannStart.startX && y >= this.pannStart.startY && x <= endPoint.x && y <= endPoint.y) {
                inRange = true;
            }
        }
        return inRange;
    }

    /**
     * Clear a current selection.
     *
     * @returns {void}.
     */
    public clearSelection(): void {
        if (!this.disabled && this.imgDataColl.length > 0) {
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
        let splitWords: string[];
        const transitionArgs: CropEventArgs = {startPoint: {x: this.activeObj.activePoint.startX, y:
            this.activeObj.activePoint.startY}, endPoint: {x: this.activeObj.activePoint.endX, y: this.activeObj.activePoint.endY}};
        this.trigger('cropping', transitionArgs);
        if (this.activeObj.shape !== undefined) {splitWords = this.activeObj.shape.split('-'); }
        if (!this.disabled && this.activeObj.horTopLine !== undefined && (this.currObjType.isCustomCrop || splitWords[0] === 'crop')) {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const proxy: ImageEditor = this;
            isCrop = true;
            this.upperCanvas.style.display = 'none';
            let widthRatio: number; let heightRatio: number;
            let imgData: ImageData; let zoomedRotate: boolean = false;
            if (this.factor === 1) {
                imgData = this.lowerContext.getImageData(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
                widthRatio = this.lowerCanvas.width / parseInt(this.lowerCanvas.style.maxWidth, 10);
                heightRatio = this.lowerCanvas.height / parseInt(this.lowerCanvas.style.maxHeight, 10);
            } else {
                this.lowerContext.setTransform(1, 0, 0, 1, 0, 0);
                this.upperContext.setTransform(1, 0, 0, 1, 0, 0);
                imgData = this.imgDataColl[0].value as ImageData;
                widthRatio = this.lowerCanvas.width / parseInt(this.lowerCanvas.style.maxWidth, 10);
                heightRatio = this.lowerCanvas.height / parseInt(this.lowerCanvas.style.maxHeight, 10);
                if (this.degree !== 0 && this.flipState !== '') {
                    this.degree = 0;
                }
                if (this.degree !== 0) {
                    zoomedRotate = true;
                    this.lowerCanvas.width = this.upperCanvas.width = this.baseImg.width;
                    this.lowerCanvas.height = this.upperCanvas.height = this.baseImg.height;
                    const tempObj: SelectionPoint = extend({}, this.activeObj, {}, true) as SelectionPoint;
                    this.factor = 1;
                    this.lowerContext.clearRect(0, 0, this.inMemoryCanvas.height, this.inMemoryCanvas.width);
                    this.lowerContext.clearRect(0, 0, this.inMemoryCanvas.width, this.inMemoryCanvas.height);
                    if (this.degree === 180) {
                        this.updateInMemoryContext(imgData);
                    }
                    const maxDimension: Dimension = this.calcMaxDimension(tempObj.activePoint.width, tempObj.activePoint.height);
                    this.lowerCanvas.style.maxWidth = this.upperCanvas.style.maxWidth = maxDimension.width + 'px';
                    this.lowerCanvas.style.maxHeight = this.upperCanvas.style.maxHeight = maxDimension.height + 'px';
                    this.lowerCanvas.width = this.upperCanvas.width = maxDimension.width * widthRatio;
                    this.lowerCanvas.height = this.upperCanvas.height = maxDimension.height * heightRatio;
                    if (this.degree !== 180) {
                        this.updateInMemoryContext(imgData);
                    }
                    this.degree = 0;
                    this.lowerContext.drawImage(this.inMemoryCanvas, tempObj.activePoint.startX, tempObj.activePoint.startY,
                                                tempObj.activePoint.width, tempObj.activePoint.height, 0, 0, this.lowerCanvas.width,
                                                this.lowerCanvas.height);
                }
                if (this.flipState !== '') {
                    zoomedRotate = true;
                    const tempObj: SelectionPoint = extend({}, this.activeObj, {}, true) as SelectionPoint;
                    this.flipState = '';
                    this.lowerContext.clearRect(0, 0, this.inMemoryCanvas.height, this.inMemoryCanvas.width);
                    this.lowerContext.clearRect(0, 0, this.inMemoryCanvas.width, this.inMemoryCanvas.height);
                    this.updateInMemoryContext(imgData);
                    const maxDimension: Dimension = this.calcMaxDimension(tempObj.activePoint.width, tempObj.activePoint.height);
                    this.lowerCanvas.style.maxWidth = this.upperCanvas.style.maxWidth = maxDimension.width + 'px';
                    this.lowerCanvas.style.maxHeight = this.upperCanvas.style.maxHeight = maxDimension.height + 'px';
                    this.lowerCanvas.width = this.upperCanvas.width = maxDimension.width * widthRatio;
                    this.lowerCanvas.height = this.upperCanvas.height = maxDimension.height * heightRatio;
                    this.lowerContext.drawImage(this.inMemoryCanvas, tempObj.activePoint.startX, tempObj.activePoint.startY,
                                                tempObj.activePoint.width, tempObj.activePoint.height, 0, 0, this.lowerCanvas.width,
                                                this.lowerCanvas.height);
                }
            }
            if (!zoomedRotate) {
                this.inMemoryContext.clearRect(0, 0, this.inMemoryCanvas.width, this.inMemoryCanvas.height);
                this.lowerContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
                this.inMemoryCanvas.width = imgData.width; this.inMemoryCanvas.height = imgData.height;
                this.inMemoryContext.putImageData(imgData, 0, 0);
                this.updateInMemoryContext(imgData);
                const maxDimension: Dimension = this.calcMaxDimension(this.activeObj.activePoint.width, this.activeObj.activePoint.height);
                this.lowerCanvas.style.maxWidth = this.upperCanvas.style.maxWidth = maxDimension.width + 'px';
                this.lowerCanvas.style.maxHeight = this.upperCanvas.style.maxHeight = maxDimension.height + 'px';
                this.lowerCanvas.width = this.upperCanvas.width = maxDimension.width * widthRatio;
                this.lowerCanvas.height = this.upperCanvas.height = maxDimension.height * heightRatio;
                const cssObj: CSSStyleDeclaration = window.getComputedStyle(this.lowerCanvas);
                this.lowerCanvas.style.left = this.upperCanvas.style.left =
                ((this.element.clientWidth - parseInt(cssObj.width, 10) - 18) / 2) + 1 + 'px';
                this.lowerCanvas.style.top = this.upperCanvas.style.top = ((this.element.clientHeight - this.toolbarHeight
                - parseInt(cssObj.height, 10)) / 2) + 1 + 'px';
                this.lowerContext.drawImage(this.inMemoryCanvas, this.activeObj.activePoint.startX, this.activeObj.activePoint.startY,
                                            this.activeObj.activePoint.width, this.activeObj.activePoint.height, 0, 0,
                                            this.lowerCanvas.width, this.lowerCanvas.height);
            }
            if (this.activeObj.shape === 'crop-circle') {
                const imgData: ImageData = this.lowerContext.getImageData(0, 0, this.baseImg.width, this.baseImg.height);
                this.inMemoryCanvas.width = imgData.width; this.inMemoryCanvas.height = imgData.height;
                this.inMemoryContext.putImageData(imgData, 0, 0);
                this.lowerContext.save();
                this.lowerContext.drawImage(this.inMemoryCanvas, 0, 0, this.baseImg.width, this.baseImg.height);
                this.lowerContext.globalCompositeOperation = 'destination-in';
                this.lowerContext.beginPath();
                this.lowerContext.arc(this.lowerCanvas.width / 2, this.lowerCanvas.height / 2, this.lowerCanvas.width / 2, 0, Math.PI * 2);
                this.lowerContext.closePath();
                this.lowerContext.fill();
                this.lowerContext.restore();
                this.currObjType.isActiveObj = true;

            }
            showSpinner(this.element);
            this.element.style.opacity = '0.5';
            let blobUrl: string; let data: ImageData;
            // eslint-disable-next-line @typescript-eslint/tslint/config
            this.lowerCanvas.toBlob(function(blob){
                blobUrl = URL.createObjectURL(blob);
                proxy.isUndoRedo = false;
                proxy.baseImg.src = blobUrl;
                data = proxy.lowerContext.getImageData(0, 0, proxy.lowerCanvas.width, proxy.lowerCanvas.height);
                proxy.imgDataColl = [];
                if (!proxy.isUndoRedo) {proxy.updateUndoRedoColl('crop', data, proxy.objColl); }
                proxy.isUndoRedo = false;
            }, 'image/png');
            this.objColl = [];
            this.refreshActiveObj();
            this.degree = 0; this.flipState = '';
            this.upperContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
            this.lowerContext.globalAlpha = 0; this.lowerContext.fillRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
            this.lowerContext.setTransform(1, 0, 0, 1, 0, 0);
            this.upperContext.setTransform(1, 0, 0, 1, 0, 0);
            this.factor = 1;
        }
        return isCrop;
    }

    private updateInMemoryContext(imgData: ImageData): void {
        this.lowerContext.drawImage(this.inMemoryCanvas, 0, 0);
        const temp: SelectionPoint = extend({}, this.activeObj, {}, true) as SelectionPoint;
        for (let i: number = 0; i < this.objColl.length; i++) {
            this.apply(this.objColl[i].shape, this.objColl[i]);
        }
        this.activeObj = temp;
        imgData = this.lowerContext.getImageData(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
        this.inMemoryContext.clearRect(0, 0, this.inMemoryCanvas.width, this.inMemoryCanvas.height);
        this.lowerContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
        this.inMemoryCanvas.width = imgData.width; this.inMemoryCanvas.height = imgData.height;
        this.inMemoryContext.putImageData(imgData, 0, 0);
    }

    /**
     * Flips an image by horizontally or vertically.
     *
     * @param {Direction } direction - Specifies the direction to flip the image.
     * @returns {void}.
     */
    public flip(direction: Direction): void {
        if (!this.disabled && this.imgDataColl.length > 0) {
            if (this.factor !== 1) {
                this.lowerContext.setTransform(1, 0, 0, 1, 0, 0);
                this.upperContext.setTransform(1, 0, 0, 1, 0, 0);
                this.factor = 1;
                this.refreshToolbar('main');
            }
            const transitionArgs: FlipEventArgs = {direction: direction};
            this.trigger('flipping', transitionArgs);
            this.lastAction = 'flip';
            this.flipMethod = true;
            let splitWords: string[] = [];
            let activeObjShape: string;
            if (!isNullOrUndefined(this.activeObj.activePoint)) {
                if (this.activeObj.shape !== undefined) {splitWords = this.activeObj.shape.split('-'); }
                if (this.currObjType.isCustomCrop || splitWords[0] === 'crop') {
                    activeObjShape = this.currObjType.isCustomCrop ? 'custom' : splitWords[1];
                }
            }
            this.redrawActObj();
            this.lowerContext.clearRect(0, 0, this.lowerCanvas.height, this.lowerCanvas.width);
            this.lowerContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
            this.upperContext.clearRect(0, 0, this.lowerCanvas.height, this.lowerCanvas.width);
            this.upperContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
            if (direction.toLowerCase() === 'horizontal') {
                this.lowerContext.translate(this.lowerContext.canvas.width, 0);
                this.lowerContext.scale(-1, 1);
                this.upperContext.translate(this.upperContext.canvas.width, 0);
                this.upperContext.scale(-1, 1);
                this.flipDirection = 'horizontal';
                if (this.flipState === '' || this.flipState.toLowerCase() === 'vertical') {
                    this.flipState = 'horizontal';
                }
                if (this.currFlipState.toLowerCase() === 'horizontal') {
                    this.currFlipState = '';
                } else {
                    this.currFlipState = 'horizontal';
                }
            }
            else {
                this.lowerContext.translate(0, this.lowerContext.canvas.height);
                this.lowerContext.scale(1, -1);
                this.upperContext.translate(0, this.upperContext.canvas.height);
                this.upperContext.scale(1, -1);
                this.flipDirection = 'vertical';
                if (this.flipState.toLowerCase() === '' || this.flipState.toLowerCase() === 'horizontal') {
                    this.flipState = 'vertical';
                }
                if (this.currFlipState.toLowerCase() === 'vertical') {
                    this.currFlipState = '';
                } else {
                    this.currFlipState = 'vertical';
                }
            }
            this.lowerContext.drawImage(this.inMemoryCanvas, 0, 0);
            this.currImgData = this.lowerContext.getImageData(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
            this.inMemoryContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
            this.inMemoryCanvas.width = this.currImgData.width;
            this.inMemoryCanvas.height = this.currImgData.height;
            this.inMemoryContext.putImageData(this.currImgData, 0, 0);
            if (this.flipState.toLowerCase() === 'horizontal') {
                for (let i: number = 0, len: number = this.objColl.length; i < len; i++) {
                    this.objColl[i].flippedText = false;
                    if (this.objColl[i].shapeFlip !== '' && this.objColl[i].shapeFlip === this.currFlipState) {
                        this.apply(this.objColl[i].shape, this.objColl[i]);
                    } else {
                        this.apply(this.objColl[i].shape, this.objColl[i]);
                    }
                }
                this.lowerContext.translate(this.lowerContext.canvas.width, 0);
                this.lowerContext.scale(-1, 1);
                this.upperContext.translate(this.upperContext.canvas.width, 0);
                this.upperContext.scale(-1, 1);
                this.flipDirection = '';
            } else if (this.flipState.toLowerCase() === 'vertical') {
                for (let i: number = 0, len: number = this.objColl.length; i < len; i++) {
                    this.objColl[i].flippedText = false;
                    if (this.objColl[i].shapeFlip !== '' && this.objColl[i].shapeFlip === this.currFlipState) {
                        this.apply(this.objColl[i].shape, this.objColl[i]);
                    } else {
                        this.apply(this.objColl[i].shape, this.objColl[i]);
                    }
                }
                this.lowerContext.translate(0, this.lowerContext.canvas.height);
                this.lowerContext.scale(1, -1);
                this.upperContext.translate(0, this.upperContext.canvas.height);
                this.upperContext.scale(1, -1);
                this.flipDirection = '';
            }
            for (let i: number = 0, len: number = this.objColl.length; i < len; i++) {
                if (this.objColl[i].flipObjColl.length === 0) {
                    this.objColl[i].flipObjColl.push(direction);
                } else if (this.objColl[i].flipObjColl[this.objColl[i].flipObjColl.length - 1] === direction) {
                    this.objColl[i].flipObjColl.pop();
                } else {
                    this.objColl[i].flipObjColl.push(direction);
                }
            }
            this.redrawObj(direction.toLowerCase());
            if (this.flipState === '') {
                for (let i: number = 0, len: number = this.objColl.length; i < len; i++) {
                    this.apply(this.objColl[i].shape, this.objColl[i]);
                }
            }
            this.refreshActiveObj();
            if (!this.isUndoRedo) {this.updateUndoRedoColl('flip', direction, this.objColl); }
            this.isUndoRedo = this.flipMethod = false;
            if (!isNullOrUndefined(activeObjShape)) {
                if (activeObjShape === 'custom') {
                    this.activeObj.activePoint = {startX: 0, startY: 0, endX: this.lowerCanvas.width,
                    endY: this.lowerCanvas.height, width: this.lowerCanvas.width, height: this.lowerCanvas.height};
                    this.updateActiveObject(this.calcRatio(), this.activeObj.activePoint, this.activeObj);
                    this.drawObject('duplicate', this.activeObj);
                } else {
                    this.select(activeObjShape);
                }
            }
        }
    }

    /**
     * Return an image as ImageData.
     *
     * @returns {ImageData}.
     */
    public getImageData(): ImageData {
        const data: ImageData = this.lowerContext.getImageData(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
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
            if (isNullOrUndefined(this.toolbarTemplate)) {this.update(); }
            const type: string = typeof(data);
            if (type === 'string') {
                this.imageOnLoad(data as string);
            } else {
                this.lowerCanvas = document.querySelector('#' + this.element.id + '_lowerCanvas');
                this.upperCanvas = document.querySelector('#' + this.element.id + '_upperCanvas');
                this.lowerContext = this.lowerCanvas.getContext('2d'); this.upperContext = this.upperCanvas.getContext('2d');
                this.lowerContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
                this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
                this.inMemoryContext.clearRect(0, 0, this.inMemoryCanvas.width, this.inMemoryCanvas.height);
                this.inMemoryCanvas.width = this.baseImg.width = (data as ImageData).width;
                this.inMemoryCanvas.height = this.baseImg.height = (data as ImageData).height;
                this.inMemoryContext.putImageData((data as ImageData), 0, 0);
                this.imgDataColl.push({operation: 'open', value: data});
                this.lowerCanvas.width = this.upperCanvas.width = (data as ImageData).width;
                this.lowerCanvas.height = this.upperCanvas.height = (data as ImageData).height;
                this.lowerContext.drawImage(this.inMemoryCanvas, 0, 0 , this.lowerCanvas.width, this.lowerCanvas.height);
                this.updateCanvas();
                hideSpinner(this.element);
                this.element.style.opacity = '1';  
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
            this.inMemoryContext.clearRect(0, 0, this.inMemoryCanvas.width, this.inMemoryCanvas.height);
            this.inMemoryContext.clearRect(0, 0, this.inMemoryCanvas.height, this.inMemoryCanvas.width);
            this.lowerContext.clearRect(0, 0, this.inMemoryCanvas.width, this.inMemoryCanvas.height);
            this.lowerContext.clearRect(0, 0, this.inMemoryCanvas.height, this.inMemoryCanvas.width);
            this.upperContext.clearRect(0, 0, this.inMemoryCanvas.width, this.inMemoryCanvas.height);
            this.upperContext.clearRect(0, 0, this.inMemoryCanvas.height, this.inMemoryCanvas.width);
            showSpinner(this.element);
            this.element.style.opacity = '0.5';
            if (this.imgDataColl.length > 0) {
                if (this.imgDataColl[0].operation === 'freehanddraw') {
                    this.imgDataColl.splice(0, 1);
                    this.imgDataColl.splice(1, 1);
                }
                this.inMemoryCanvas.width = (this.imgDataColl[0].value as ImageData).width;
                this.inMemoryCanvas.height = (this.imgDataColl[0].value as ImageData).height;
                this.inMemoryContext.putImageData(this.imgDataColl[0].value as ImageData, 0, 0);
                this.redrawImg();
            }
            this.lowerContext.setTransform(1, 0, 0, 1, 0, 0);
            this.upperContext.setTransform(1, 0, 0, 1, 0, 0);
            this.baseImg.src = this.baseImgSrc;
            this.factor = 1;
            this.refreshToolbar('main');
            if (Browser.isDevice && document.getElementById(this.element.id + '_bottomToolbar')) {
                (getComponent(document.getElementById(this.element.id + '_bottomToolbar'), 'toolbar') as Toolbar).destroy();
            }
            this.objColl = []; this.imgDataColl = [];
            this.degree = 0;
            this.flipState = this.keyHistory = this.currFlipState = this.flipDirection = '';
            this.upperCanvas.style.display = 'none';
            this.upperCanvas.style.cursor = this.lowerCanvas.style.cursor = 'default';
            this.undoRedoColl = []; this.dragCanvas = this.dragged = this.isUndoRedo = this.activeObj.flippedText = this.flipMethod = false;
            this.currImgData = {} as ImageData;
            this.pannStart = {startX: 0, startY: 0, width: 0, height: 0};
            this.pannEnd = {startX: 0, startY: 0, width: 0, height: 0};
            this.lowerContext.lineWidth = this.upperContext.lineWidth = undefined;
            this.togglePan = this.togglePen = this.rotateMethod =  false;
            this.lastX = this.lastY =  0;
            this.dragStart = { x: 0, y: 0 };
            this.touchEndPoint = {} as Point;
            this.prevX = this.currX = this.prevY = this.currY = 0;
            this.lastAction = this.tempKeyHistory = '';
            this.isBoldbtn = this.isItalicbtn = false;
            this.currentToolbar = 'main';
            this.textStartPoints = {x: 0, y: 0};
            this.fontSizeColl = this.penDrawColl = [];
            this.textBox.value = this.textBox.textContent = '';
            this.textBox.style.display = 'none';
            this.strokeSettings = {strokeColor: '#fff', fillColor: '', strokeWidth: null};
            this.textSettings =
            {text: 'Enter Text', fontFamily: 'Arial', fontSize: null, bold: false, italic: false, underline: false};
            this.tempStrokeSettings = {strokeColor: '#fff', fillColor: '', strokeWidth: null};
            this.penStrokeWidth = undefined;
            this.tempTextSettings =
            {text: 'Enter Text', fontFamily: 'Arial', fontSize: null, bold: false, italic: false, underline: false};
            this.refreshActiveObj();
            this.timer = undefined;
            this.isScreenOriented = false;
            this.currObjType = { shape: '', isDragging: false, isActiveObj: false, isText: false, isInitialText: false, isLine: false,
                isInitialLine: false, isCustomCrop: false, isZoomed: false };
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
        if (!this.disabled && this.imgDataColl.length > 0 && (degree % 90 === 0)) {
            isRotate = true;
            const transitionArgs: RotateEventArgs = {degree: degree};
            this.trigger('rotating', transitionArgs);
            this.rotateMethod = true;
            this.lastAction = 'rotate';
            let splitWords: string[] = [];
            let activeObjShape: string;
            if (!isNullOrUndefined(this.activeObj.activePoint)) {
                if (this.activeObj.shape !== undefined) {splitWords = this.activeObj.shape.split('-'); }
                if (this.currObjType.isCustomCrop || splitWords[0] === 'crop') {
                    activeObjShape = this.currObjType.isCustomCrop ? 'custom' : splitWords[1];
                }
            }
            this.redrawActObj();
            if (this.factor !== 1) {
                this.lowerContext.setTransform(1, 0, 0, 1, 0, 0);
                this.upperContext.setTransform(1, 0, 0, 1, 0, 0);
                this.factor = 1;
                this.refreshToolbar('main');
            }
            this.degree += degree;
            if (this.degree === 360) {this.degree = 0; }
            this.lowerContext.save();
            this.setMaximumDimension(this.degree);
            this.lowerContext.translate(this.lowerCanvas.width / 2, this.lowerCanvas.height / 2);
            this.lowerContext.rotate(Math.PI / 180 * degree);
            this.lowerCanvas.style.left = this.upperCanvas.style.left = (this.element.clientWidth - parseInt(this.lowerCanvas.style.maxWidth, 10) - 18) / 2 + 1 + 'px';
            this.lowerCanvas.style.top = this.upperCanvas.style.top = (this.element.clientHeight - this.toolbarHeight - parseInt(this.lowerCanvas.style.maxHeight, 10)) / 2 + 1 + 'px';
            this.lowerContext.drawImage(this.inMemoryCanvas, -this.lowerCanvas.height / 2, -this.lowerCanvas.width / 2);
            this.lowerContext.rotate(Math.PI / 180 * -degree);
            this.lowerContext.translate(-this.lowerCanvas.width / 2, -this.lowerCanvas.height / 2);
            this.lowerContext.restore();
            this.currImgData = this.lowerContext.getImageData(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
            this.inMemoryContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
            this.inMemoryCanvas.width = this.currImgData.width; this.inMemoryCanvas.height = this.currImgData.height;
            this.inMemoryContext.putImageData(this.currImgData, 0, 0);
            this.redrawObj(degree);
            if (!isNullOrUndefined(activeObjShape)) {
                if (activeObjShape === 'custom') {
                    const endPoint: Point = {x: this.lowerCanvas.width - this.pannEnd.startX, y: this.lowerCanvas.height - this.pannEnd.startY};
                    this.activeObj.activePoint = {startX: this.pannStart.startX, startY: this.pannStart.startY, endX: endPoint.x,
                    endY: endPoint.y, width: endPoint.x - this.pannStart.startX, height: endPoint.y - this.pannStart.startY};
                    this.updateActiveObject(this.calcRatio(), this.activeObj.activePoint, this.activeObj);
                    this.drawObject('duplicate', this.activeObj);
                } else {
                    this.select(activeObjShape);
                }
                this.refreshToolbar('main', true, true);
            }
            this.factor = 1;
            if (!this.isUndoRedo) {this.updateUndoRedoColl('rotate', degree, this.objColl); }
            this.isUndoRedo = false;
        }
        this.rotateMethod = false;
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
        if (!this.disabled && this.imgDataColl.length > 0) {
            if (this.togglePen) {
                this.currObjType.isZoomed = true;
                this.applyPenDraw();
            }
            this.applyActObj();
            if (this.factor !== 1) {
                this.lowerContext.setTransform(1, 0, 0, 1, 0, 0);
                this.upperContext.setTransform(1, 0, 0, 1, 0, 0);
                this.factor = 1;
                this.lowerContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
                this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
                this.lowerContext.drawImage(this.inMemoryCanvas, 0, 0);
                for (let i: number = 0; i < this.objColl.length; i++ ) {
                    this.apply(this.objColl[i].shape, this.objColl[i]);
                    this.refreshActiveObj();
                }
            }
            type = type ? type : 'Png';
            this.redrawActObj();
            const beforeSave: BeforeSaveEventArgs = { cancel: false, fileName: 'ImageEditor', fileType: type as FileType};
            const saved: SaveEventArgs = { fileName: 'ImageEditor', fileType: type as FileType};
            this.trigger('beforeSave', beforeSave, (observableSaveArgs: BeforeSaveEventArgs) => {
                if (!observableSaveArgs.cancel) {
                    fileName = observableSaveArgs.fileName ? observableSaveArgs.fileName : fileName;
                    if (type.toLowerCase() === 'svg') {
                        fileName = fileName || 'ImageEditor';
                        this.toSVGImg(fileName);
                    } else if (type.toLowerCase() === 'jpeg') {
                        fileName = fileName || 'ImageEditor';
                        this.toBlobFn(fileName, type.toLowerCase());
                    } else {
                        fileName = fileName || 'ImageEditor';
                        this.toBlobFn(fileName, type.toLowerCase());
                    }
                    this.trigger('saved', saved);
                    this.refreshToolbar('main');
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
        if (!this.disabled && this.imgDataColl.length > 0) {
            const ratio: Dimension = this.calcRatio();
            let points: ActivePoint;
            this.redrawActObj();
            this.refreshActiveObj();
            this.keyHistory = '';
            this.upperContext.clearRect(0, 0 , this.upperCanvas.width, this.upperCanvas.height);
            this.upperCanvas.style.display = 'block';
            const cropShape: string = 'crop-' + type;
            if (cropShape.toLowerCase() === 'crop-custom') {
                if (this.currObjType.shape === '') {
                    this.currObjType.isCustomCrop = true;
                    this.upperContext.fillStyle = 'rgb(0, 0, 0, 0.5)';
                    this.upperContext.fillRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
                    this.upperCanvas.style.cursor = 'crosshair';
                    if (Browser.isDevice) {
                        const arcRadius: number = (7.5 * (ratio.width > ratio.height ? ratio.width : ratio.height)) / this.factor;
                        const endPoint: Point = {x: this.lowerCanvas.width - this.pannEnd.startX, y: this.lowerCanvas.height - this.pannEnd.startY};
                        this.activeObj.activePoint = {startX: this.pannStart.startX + arcRadius, startY: this.pannStart.startY + arcRadius,
                            endX: endPoint.x - arcRadius, endY: endPoint.y - arcRadius};
                        this.activeObj.activePoint.width = this.activeObj.activePoint.endX - this.activeObj.activePoint.startX;
                        this.activeObj.activePoint.height = this.activeObj.activePoint.endY - this.activeObj.activePoint.startY;
                        this.updateActiveObject(this.calcRatio(), this.activeObj.activePoint, this.activeObj);
                        this.drawObject('duplicate', this.activeObj);
                        this.upperCanvas.style.cursor = 'default';
                    }
                }
                if (startX && startY) {
                    this.upperContext.clearRect(0, 0 , this.upperCanvas.width, this.upperCanvas.height);
                    this.currObjType.shape = this.activeObj.shape = cropShape.toLowerCase();
                    this.activeObj.activePoint.startX = startX + ratio.width; this.activeObj.activePoint.startY = startY + ratio.height;
                    this.activeObj.activePoint.endX = this.baseImg.width - (2 * ratio.width);
                    this.activeObj.activePoint.endY = this.baseImg.height - (2 * ratio.height);
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
                this.drawObject('duplicate', null, null, true, points);
            }
        }
    }

    /**
     * Enable or disable a freehand drawing in an Image Editor.
     *
     * @param {boolean} value - Specifies a value whether enable or disable freehand drawing. 
     *
     *  @returns {void}.
     */
    public freeHandDraw(value: boolean): void {
        if (value) {
            this.togglePen = true;
            this.upperCanvas.style.cursor = 'cross-hair';
            this.drawPen();
        } else {
            this.upperCanvas.style.cursor = 'default';
            this.applyPenDraw();
        }
        this.refreshToolbar('pen');
    }

    /**
     * Enable or disable a panning on the Image Editor.
     *
     * @param {boolean} value - Specifies a value whether enable or disable panning.
     *
     * @returns {void}.
     */
    public pan(value: boolean): void {
        if (!this.disabled && this.imgDataColl.length > 0) {
            if (value) {
                this.togglePan = true;
                this.redrawActObj();
                this.dragCanvas = true;
                this.lowerCanvas.style.cursor = this.upperCanvas.style.cursor = 'grab';
            } else {
                this.dragCanvas = this.togglePan = false;
                this.refreshActiveObj();
                this.lowerCanvas.style.cursor = this.upperCanvas.style.cursor = 'default';
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
        if (!this.disabled && this.imgDataColl.length > 0) {
            if ((this.factor === 1 && value < 0) || (this.factor > 8 && value > 0)) {
                return;
            }
            let splitWords: string[] = [];
            let activeObjShape: string;
            if (!isNullOrUndefined(this.activeObj.activePoint)) {
                if (this.activeObj.shape !== undefined) {splitWords = this.activeObj.shape.split('-'); }
                if (this.currObjType.isCustomCrop || splitWords[0] === 'crop') {
                    activeObjShape = this.currObjType.isCustomCrop ? 'custom' : splitWords[1];
                }
            }
            this.redrawActObj();
            this.refreshActiveObj();
            this.upperContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
            this.upperCanvas.style.cursor = 'default';
            let zoomState: number;
            if (value === 3.75 || value === 1) {zoomState = 0.1; }
            else if (value === -3.75) {zoomState = -0.1; }
            else {
                zoomState = value;
            }
            if (this.degree !== 0) {
                this.inMemoryContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
                this.inMemoryContext.clearRect(0, 0, this.lowerCanvas.height, this.lowerCanvas.width);
                this.inMemoryCanvas.width = this.currImgData.width;
                this.inMemoryCanvas.height = this.currImgData.height;
                this.inMemoryContext.putImageData(this.currImgData, 0, 0);
            }
            if (value === 0.1 || value === -0.1) {this.lastX = this.lowerCanvas.width / 2; this.lastY = this.lowerCanvas.height / 2; }
            if (value > 0) {
                this.zoomImg(3.75);
            }
            else {
                this.zoomImg(-3.75);
            }
            this.refreshActiveObj();
            if (!isNullOrUndefined(activeObjShape)) {
                if (activeObjShape === 'custom') {
                    const endPoint: Point = {x: this.lowerCanvas.width - this.pannEnd.startX, y: this.lowerCanvas.height - this.pannEnd.startY};
                    this.activeObj.activePoint = {startX: this.pannStart.startX, startY: this.pannStart.startY, endX: endPoint.x,
                    endY: endPoint.y, width: endPoint.x - this.pannStart.startX, height: endPoint.y - this.pannStart.startY};
                    this.updateActiveObject(this.calcRatio(), this.activeObj.activePoint, this.activeObj);
                    this.drawObject('duplicate', this.activeObj);
                } else {
                    this.select(activeObjShape);
                }
                this.refreshToolbar('main', true, true);
            }
            if (!this.isUndoRedo) {this.updateUndoRedoColl('zoom', zoomState, this.objColl); }
            this.isUndoRedo = false;
            const zoomOut: HTMLElement = document.querySelector('#' + this.element.id + '_zoomOut');
            if (!isNullOrUndefined(zoomOut) && this.factor === 1) {
                zoomOut.classList.add('e-disabled');
            } else if (!isNullOrUndefined(zoomOut)) {
                zoomOut.classList.remove('e-disabled');
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
        if (!this.disabled && this.imgDataColl.length > 0 && inRange) {
            isEllipse = true;
            const shapeChangingArgs: ShapeChangeEventArgs = {action: 'insert', previousShapeSettings: this.activeObj, currentShapeSettings: this.activeObj};
            this.trigger('shapeChanging', shapeChangingArgs);
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
        if (!this.disabled && this.imgDataColl.length > 0 && inRange) {
            isLine = true;
            const shapeChangingArgs: ShapeChangeEventArgs = {action: 'insert', previousShapeSettings: this.activeObj, currentShapeSettings: this.activeObj};
            this.trigger('shapeChanging', shapeChangingArgs);
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
        if (!this.disabled && this.imgDataColl.length > 0 && inRange) {
            isRectangle = true;
            const shapeChangingArgs: ShapeChangeEventArgs = {action: 'insert', previousShapeSettings: this.activeObj,
                currentShapeSettings: this.activeObj};
            this.trigger('shapeChanging', shapeChangingArgs);
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
        if (!this.disabled && this.imgDataColl.length > 0 && inRange) {
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
        this.applyActObj();
        let obj: SelectionPoint; let isSelected: boolean;
        for (let i: number = 0; i < this.objColl.length; i++) {
            if (this.objColl[i].currIndex === id) {
                obj = extend({}, this.objColl[i], {}, true) as SelectionPoint;
                break;
            }
        }
        if (isNullOrUndefined(obj)) {
            isSelected = false;
        } else {
            isSelected = true;
            this.activeObj = obj;
            this.redrawShape(this.activeObj);
            this.refreshToolbar('shapes');
            this.updateToolbarItems(this.calcRatio());
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
        this.applyActObj();
        for (let i: number = 0; i < this.objColl.length; i++) {
            if (this.objColl[i].currIndex === id) {
                this.objColl.splice(i, 1);
                break;
            }
        }
        this.lowerContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
        this.lowerContext.drawImage(this.inMemoryCanvas, 0, 0);
        for (let i: number = 0; i < this.objColl.length; i++) {
            this.apply(this.objColl[i].shape, this.objColl[i]);
            this.refreshActiveObj();
        }
        this.refreshToolbar('main');
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
        this.applyActObj();
        let obj: SelectionPoint;
        for (let i: number = 0; i < this.objColl.length; i++) {
            if (this.objColl[i].currIndex === id) {
                obj = extend({}, this.objColl[i], {}, true) as SelectionPoint;
                break;
            }
        }
        const shapeDetails: ShapeSettings = this.getObjDetails(obj);
        return shapeDetails;
    }

    /**
     * Get all the shapes details which is drawn on an image editor.
     *
     * @returns {ShapeSettings[]}.
     */
    public getShapeSettings(): ShapeSettings[] {
        this.applyActObj();
        const shapeDetailsColl: ShapeSettings[] = [];
        for (let i: number = 0; i < this.objColl.length; i++) {
            const shapeDetails: ShapeSettings = this.getObjDetails(this.objColl[i]);
            shapeDetailsColl.push(shapeDetails);
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
        canvasWrapper.style.width = this.element.offsetWidth + 'px';
        this.lowerCanvas.width = this.upperCanvas.width = this.element.offsetWidth;
        if (Browser.isDevice) {
            canvasWrapper.style.height = this.element.offsetHeight - (2 * this.toolbarHeight) - 3 + 'px';
            this.lowerCanvas.height = this.upperCanvas.height = this.element.offsetHeight - (2 * this.toolbarHeight) - 3;
        } else {
            canvasWrapper.style.height = this.element.offsetHeight - this.toolbarHeight - 1 + 'px';
            this.lowerCanvas.height = this.upperCanvas.height = this.element.offsetHeight - this.toolbarHeight - 1;
        }
        this.lowerContext.clearRect(0, 0, this.lowerCanvas.width, this.lowerCanvas.height);
        this.upperContext.clearRect(0, 0, this.upperCanvas.width, this.upperCanvas.height);
    }

    /**
     * To check whether the undo collection is empty or not.
     *
     * @returns {boolean}.
     * @private
     */
    public canUndo(): boolean {
        return super.canUndo();
    }

    /**
     * To check whether the redo collection is empty or not.
     *
     * @returns {boolean}.
     * @private
     */
    public canRedo(): boolean {
        return super.canRedo();
    }

    /**
     * Erases all the signature strokes signed by user.
     *
     * @returns {void}.
     * @private
     */
    public clear(): void {
        super.clear();
    }

    /**
     * To draw the signature based on the given text, with the font family and font size.
     *
     * @param {string} text - specify text to be drawn as signature.
     * @param {string} fontFamily - specify font family of a signature.
     * @param {number} fontSize - specify font size of a signature.
     *
     * @returns {void}.
     * @private
     */
    public draw(text: string, fontFamily?: string, fontSize?: number): void {
        super.draw(text, fontFamily, fontSize);
    }

    /**
     * To get the signature as Blob.
     *
     * @param {string} url - specify the url/base 64 string to get blob of the signature.
     * @returns {Blob}.
     * @private
     */
    public getBlob(url: string): Blob {
        return super.getBlob(url);
    }

    /**
     * To check whether the signature is empty or not.
     *
     * @returns {boolean}.
     * @private
     */
    public isEmpty(): boolean {
        return super.isEmpty();
    }

    /**
     * To load the signature with the given base 64 string, height and width.
     *
     * @param {string} signature - specify the url/base 64 string to be drawn as signature.
     * @param {number} width - specify the width of the loaded signature image.
     * @param {number} height - specify the height of the loaded signature image.
     * @returns {void}.
     * @private
     */
    public load(signature: string, width?: number, height?: number): void {
        super.load(signature, width, height);
    }

    /**
     * Undo the last user action.
     *
     * @returns {void}.
     * @private
     */
    public undo(): void {
        super.undo();
    }

    /**
     * Redo the last user action.
     *
     * @returns {void}.
     * @private
     */
    public redo(): void {
        super.redo();
    }

    /**
     * To save the signature with the given file type and file name.
     *
     * @param {SignatureFileType} type - specify type of the file to be saved a signature.
     * @param {string} fileName - specify name of the file to be saved a signature.
     *
     * @returns {void}.
     * @private
     */
    public save(type?: FileType, fileName?: string): void {
        super.save(type, fileName);
    }

    /**
     * To save the signature as Blob.
     *
     * @returns {Blob}.
     * @private
     */
    public saveAsBlob(): Blob {
        return super.saveAsBlob();
    }

    /**
     * Returns the persistence data for component.
     *
     * @returns any.
     * @private
     */
    public getLocalData(): any {
        return super.getLocalData();
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
 export type ShapeType = 'Rectangle' | 'Ellipse' | 'Line' | 'Text';

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
    previousShapeSettings?: Object; // shapeSettings type
    /**
     * Returns `the object of shape which is inserted or moved or deleted or resized or customized the UI.
     */
    currentShapeSettings?: Object; // shapeSettings type
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
 * Interface for saving the canvas as image.
 */
export interface SaveEventArgs {
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
    operation: string;
    /**
     * Gets parameter value of respective function called from the canvas.
     */
    value: string | number | FileList | Dimension | ImageData;
    /**
     * Gets previous object value.
     */
    previousObj?: SelectionPoint[];
    /**
     * Gets current object value.
     */
    currentObj?: SelectionPoint[];
}

/**
 * Interface for pen points in the imageEditor.
 *
 * @private
 */
interface PenPoint {
    /**
     * Gets or sets the stroke color for the object in imageEditor.
     */
    strokeColor: string;

    /**
     * Gets or sets the stroke width for the object in imageEditor.
     */
    strokeWidth: number;

    /**
     * Gets or sets the points collection of free hand drawing in imageEditor.
     */
    points: Point[];
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
    flippedText?: boolean;
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
