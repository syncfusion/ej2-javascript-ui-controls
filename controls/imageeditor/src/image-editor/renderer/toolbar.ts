import { extend, Browser, detach, select, MouseEventArgs } from '@syncfusion/ej2-base';
import { EventHandler, getComponent, isNullOrUndefined, L10n } from '@syncfusion/ej2-base';
import { ActivePoint, ModeSwitchEventArgs, NumericTextBox, PaletteTileEventArgs, SliderChangeEventArgs } from '@syncfusion/ej2-inputs';
import { ItemModel, Toolbar, ClickEventArgs, BeforeOpenCloseMenuEventArgs } from '@syncfusion/ej2-navigations';
import { Button } from '@syncfusion/ej2-buttons';
import { DropDownButton, ItemModel as DropDownButtonItemModel, MenuEventArgs, OpenCloseMenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { ColorPicker, ColorPickerEventArgs, Uploader, Slider, TextBox } from '@syncfusion/ej2-inputs';
import { ImageEditor, SelectionPoint, ToolbarEventArgs, Point, ImageFilterEventArgs, ZoomTrigger, Transition, CurrentObject, FrameValue,
    ImageDimension, FrameSettings, FrameType, FrameLineStyle, ShapeSettings, ShapeChangeEventArgs, ShapeType,
    EditCompleteEventArgs } from '../index';
import { QuickAccessToolbarEventArgs, ImageFilterOption } from '../index';
import { Dialog, hideSpinner, showSpinner } from '@syncfusion/ej2-popups';
import { addClass, removeClass } from '@syncfusion/ej2-base';

export class ToolbarModule {
    private parent: ImageEditor;
    private defaultLocale: Object;
    private defToolbarItems: ItemModel[] = [];
    private toolbarHeight: number = 46;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private zoomBtnHold: any;
    private l10n: L10n;
    private currToolbar: string = '';
    private preventZoomBtn: boolean = false;
    private currentToolbar: string = 'main';
    private selFhdColor: string = '#42a5f5';
    private preventEnableDisableUr: boolean = false;
    private isAspectRatio: boolean = true;
    private isFrameToolbar: boolean = false;
    private presetColors: { [key: string]: string[]; } = {
        'custom': ['#000000', '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#2196f3',
            '#03a9f4', '#00bcd4', '#009688', '#ffeb3b', '#ffffff', '#ffebee', '#fce4ec', '#f3e5f5', '#ede7f6', '#e3f2fd',
            '#e1f5fe', '#e0f7fa', '#e0f2f1', '#fffde7', '#f2f2f2', '#ffcdd2', '#f8bbd0', '#e1bee7', '#d1c4e9', '#bbdefb',
            '#b3e5fc', '#b2ebf2', '#b2dfdb', '#fff9c4', '#e6e6e6', '#ef9a9a', '#f48fb1', '#ce93d8', '#b39ddb', '#90caf9',
            '#81d4fa', '#80deea', '#80cbc4', '#fff59d', '#cccccc', '#e57373', '#f06292', '#ba68c8', '#9575cd', '#64b5f6',
            '#4fc3f7', '#4dd0e1', '#4db6ac', '#fff176', '#b3b3b3', '#ef5350', '#ec407a', '#ab47bc', '#7e57c2', '#42a5f5',
            '#29b6f6', '#26c6da', '#26a69a', '#ffee58', '#999999', '#e53935', '#d81b60', '#8e24aa', '#5e35b1', '#1e88e5',
            '#039be5', '#00acc1', '#00897b', '#fdd835', '#808080', '#d32f2f', '#c2185b', '#7b1fa2', '#512da8', '#1976d2',
            '#0288d1', '#0097a7', '#00796b', '#fbc02d', '#666666', '#c62828', '#ad1457', '#6a1b9a', '#4527a0', '#1565c0',
            '#0277bd', '#00838f', '#00695c', '#f9a825', '#4d4d4d', '#b71c1c', '#880e4f', '#4a148c', '#311b92', '#0d47a1',
            '#01579b', '#006064', '#004d40', '#f57f17']
    }

    // For element purpose
    private lowerContext: CanvasRenderingContext2D;
    private upperContext: CanvasRenderingContext2D;
    private inMemoryCanvas: HTMLCanvasElement;
    private inMemoryContext: CanvasRenderingContext2D;
    public imageWidth: number;
    public imageHeight: number;
    private popupLeft: string;
    public fileName: string;
    public fileSize: number;
    private isSlider: boolean = false;
    private currentQuality: number = 1;
    private initialSize: number;
    private fileType: string;
    private imageQuality: string = 'highest';

    constructor(parent: ImageEditor) {
        this.parent = parent;
        this.addEventListener();
        this.initLocale();
    }

    public destroy(): void {
        if (this.parent.isDestroyed) { return; }
        this.removeEventListener();
    }

    private addEventListener(): void {
        this.parent.on('toolbar', this.toolbar, this);
        this.parent.on('destroyed', this.destroy, this);
    }

    private removeEventListener(): void {
        this.parent.off('toolbar', this.toolbar);
        this.parent.off('destroyed', this.destroy);
    }

    private initLocale(): void {
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
            OK: 'Apply',
            Cancel: 'Discard',
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
            Arrow: 'Arrow',
            Path: 'Path',
            Bold: 'Bold',
            Italic: 'Italic',
            BoldItalic: 'Bold Italic',
            XSmall: 'X-Small',
            Small: 'Small',
            Medium: 'Medium',
            Large: 'Large',
            XLarge: 'X-Large',
            ABC: 'ABC',
            Browse: 'Browse',
            Duplicate: 'Duplicate',
            Remove: 'Remove',
            EditText: 'Edit Text',
            Start: 'Start',
            End: 'End',
            Bar: 'Bar',
            ArrowSolid: 'Arrow Solid',
            CircleSolid: 'Circle Solid',
            SquareSolid: 'Square Solid',
            None: 'None',
            CropAndTransform: 'Crop and Transform',
            CropSelection: 'Crop Selection',
            Image: 'Add Image',
            Transparency: 'Transparency',
            Height: 'Height',
            Width: 'Width',
            AspectRatio: 'Maintain aspect ratio',
            W: 'W',
            H: 'H',
            DragText: 'Drag and drop your image here or',
            DropText: 'Drop your image here or',
            BrowseText: 'Browse here...',
            SupportText: 'Supports:',
            Frame: 'Frame',
            Mat: 'Mat',
            Bevel: 'Bevel',
            Inset: 'Inset',
            Hook: 'Hook',
            Color: 'Color',
            Size: 'Size',
            Offset: 'Offset',
            Radius: 'Radius',
            Amount: 'Amount',
            Resize: 'Resize',
            0: '0%',
            20: '20%',
            40: '40%',
            60: '60%',
            80: '80%',
            100: '100%',
            1: '1',
            2: '2',
            3: '3',
            4: '4',
            5: '5',
            Border: 'Border',
            Solid: 'Solid',
            Dashed: 'Dashed',
            Dotted: 'Dotted',
            GradientColor: 'Gradient Color',
            ConfirmDialogHeader: 'Confirm Save Changes',
            ConfirmDialogContent: 'Do you want to save the changes you made to the image?',
            AlertDialogHeader: 'Unsupported file',
            AlertDialogContent: 'The selected file is unsupported.',
            MinMaxSize: 'with file size between',
            MinMaxSizeAlert: 'File size between',
            MinSize: 'with minimum file size of',
            MinSizeAlert: 'A minimum file size of',
            MaxSize: 'with maximum file size of',
            MaxSizeAlert: 'A maximum file size of',
            To: 'to',
            Bytes: 'bytes',
            Yes: 'Yes',
            No: 'No',
            ImageErrorDialogHeader: 'Image Selection Error',
            ImageErrorDialogContent: 'Please select only one image to open.',
            Straighten: 'Straighten',
            NoOutline: 'No outline',
            DlgOK: 'OK',
            SaveAs : 'Save As',
            ImageName: 'Image name',
            Format: 'Format',
            Quality: 'Quality',
            Download: 'Download',
            Close: 'Close',
            ImageSize: 'Image Size',
            QualityInfo: 'The image quality option is only available for JPEG format',
            Good: 'Good',
            Great: 'Great',
            Highest: 'Highest',
            BringForward: 'Bring Forward',
            SendBackward: 'Send Backward',
            SendToBack: 'Send to Back',
            BringToFront: 'Bring to Front',
            ZOrder: 'Z-Order',
            Redact: 'Redact',
            Pixelate: 'Pixelate',
            BorderRadius: 'Border Radius',
            TextOutlineColor: 'Outline Color',
            TextOutlineWidth: 'Outline Width',
            PixelSize: 'Pixel Size',
            And: 'and'
        };
        this.l10n = new L10n('image-editor', this.defaultLocale, this.parent.locale);
    }

    private toolbar(args?: { onPropertyChange: boolean, prop: string, value?: object }): void {
        const parent: ImageEditor = this.parent;
        this.updatePrivateVariables();
        switch (args.prop) {
        case 'create-toolbar':
            this.createToolbar();
            break;
        case 'create-contextual-toolbar':
            this.createContextualToolbar();
            break;
        case 'update-toolbar-items':
            this.updateToolbarItems();
            break;
        case 'refresh-toolbar':
            this.refreshToolbar(args.value['type'], args.value['isApplyBtn'], args.value['isCropping'],
                                args.value['isZooming'], args.value['cType']);
            break;
        case 'renderQAT':
            this.renderQAT(args.value['isPenEdit']);
            break;
        case 'enable-disable-btns':
            this.enableDisableTbrBtn();
            break;
        case 'init-main-toolbar':
            this.initMainToolbar(args.value['isApplyBtn'], args.value['isDevice'], args.value['isOkBtn'],
                                 args.value['isResize'], args.value['isFrame'], args.value['isMainToolbar']);
            break;
        case 'create-bottom-toolbar':
            this.createBottomToolbar();
            break;
        case 'refresh-main-toolbar':
            this.refreshMainToolbar();
            break;
        case 'create-qa-toolbar':
            this.createQuickAccessToolbar();
            break;
        case 'destroy-qa-toolbar':
            this.destroyQuickAccessToolbar();
            break;
        case 'zoom-up-handler':
            this.zoomBtnMouseUpHandler();
            break;
        case 'refresh-dropdown-btn':
            this.refreshDropDownBtn(args.value['isDisabled']);
            break;
        case 'close-contextual-toolbar':
            this.closeContextualToolbar();
            break;
        case 'destroy-bottom-toolbar':
            this.destroyBottomToolbar();
            break;
        case 'destroy-top-toolbar':
            this.destroyTopToolbar();
            break;
        case 'destroySubComponents':
            this.destroySubComponents();
            break;
        case 'setLocale':
            this.l10n.setLocale(args.value['locale']);
            break;
        case 'setPreventZoomBtn':
            this.preventZoomBtn = args.value['isPrevent'];
            break;
        case 'getToolbarHeight':
            args.value['obj']['toolbarHeight'] = this.toolbarHeight;
            break;
        case 'setToolbarHeight':
            if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.length > 0 && parent.toolbar.indexOf('Open') > -1)) {
                this.toolbarHeight = args.value['height'];
            }
            break;
        case 'setCurrentToolbar':
            this.currentToolbar = args.value['type'];
            break;
        case 'setSelectedFreehandColor':
            this.selFhdColor = args.value['color'];
            break;
        case 'setInitialAdjustmentValue':
            parent.initialAdjustmentValue = args.value['value'];
            break;
        case 'getCanvasFilter':
            args.value['obj']['canvasFilter'] = parent.canvasFilter;
            break;
        case 'getDefToolbarItems':
            args.value['obj']['defToolbarItems'] = this.defToolbarItems;
            break;
        case 'getPenStroke':
            this.getPenStroke(args.value['value']);
            break;
        case 'performDefToolbarClickAction':
            this.performDefTbrClick(args.value['type'], args.value['isContextualToolbar'], args.value['isDisabledAdjustment'],
                                    args.value['isDisabledFilter'], args.value['isFilterFinetune']);
            break;
        case 'setTempFilterProperties':
            parent.setTempFilterProperties();
            break;
        case 'refreshSlider':
            this.refreshSlider();
            break;
        case 'getCurrAdjustmentValue':
            parent.getCurrAdjustmentValue(args.value['type']);
            break;
        case 'setCurrAdjustmentValue':
            parent.setCurrAdjustmentValue(args.value['type'], args.value['value']);
            break;
        case 'refreshShapeDrawing':
            this.refreshShapeDrawing();
            break;
        case 'setEnableDisableUndoRedo':
            this.preventEnableDisableUr = args.value['isPrevent'];
            break;
        case 'reset':
            this.reset();
            break;
        case 'getLocaleText':
            args.value['obj']['value'] = this.l10n.getConstant(args.value['obj']['key']);
            break;
        case 'initResizeToolbar':
            this.initResizeToolbar();
            break;
        case 'getFrameToolbar':
            args.value['obj']['bool'] = this.isFrameToolbar;
            break;
        case 'resizeClick':
            this.resizeClick();
            break;
        case 'frameToolbarClick':
            this.frameToolbarClick();
            break;
        case 'performCropTransformClick':
            this.performCropTransformClick(args.value['shape'], args.value['isTransform']);
            break;
        case 'duplicateShape':
            this.duplicateShape(args.value['isPreventUndoRedo'], true);
            break;
        case 'editText':
            this.editText();
            break;
        case 'setInitialSize':
            this.initialSize = Number(args.value['value']);
            break;
        case 'widthPress':
            this.widthPress(args.value['e']);
            break;
        case 'heightPress':
            this.heightPress(args.value['e']);
            break;
        case 'widthAspectRatio':
            this.widthAspectRatio(args.value['e']);
            break;
        case 'heightAspectRatio':
            this.heightAspectRatio(args.value['e']);
            break;
        case 'cancelPan':
            this.cancelPan();
            break;
        case 'zoomInBtnMouseDownHandler':
            this.zoomInBtnMouseDownHandler(args.value['event']);
            break;
        case 'zoomOutBtnMouseDownHandler':
            this.zoomOutBtnMouseDownHandler(args.value['event']);
            break;
        case 'drawDashedLine':
            this.drawDashedLine(args.value['context']);
            break;
        case 'saveDialogClosed':
            this.saveDialogClosed(args.value['id']);
            break;
        case 'getIndex':
            this.getIndex(args.value['item']);
            break;
        case 'getRectRadius':
            this.getRectRadius(args.value['text']);
            break;
        case 'applyPreviewFilter':
            this.applyPreviewFilter();
            break;
        case 'renderSlider':
            this.renderSlider(args.value['type'], args.value['isSelect']);
            break;
        case 'zoomInBtnClickHandler':
            this.zoomInBtnClickHandler(args.value['e']);
            break;
        case 'zoomOutBtnClickHandler':
            this.zoomOutBtnClickHandler(args.value['e']);
            break;
        case 'getAdjustmentToolbarItem':
            this.getAdjustmentToolbarItem();
            break;
        case 'getFilterToolbarItem':
            this.getFilterToolbarItem();
            break;
        case 'renderCropBtn':
            this.renderCropBtn();
            break;
        }
    }

    private updatePrivateVariables(): void {
        const parent: ImageEditor = this.parent;
        this.inMemoryCanvas = parent.inMemoryCanvas;
        if (parent.lowerCanvas) {this.lowerContext = parent.lowerCanvas.getContext('2d'); }
        if (parent.upperCanvas) {this.upperContext = parent.upperCanvas.getContext('2d'); }
        if (this.inMemoryCanvas) {this.inMemoryContext = this.inMemoryCanvas.getContext('2d'); }
    }

    private reset(): void {
        const parent: ImageEditor = this.parent;
        this.toolbarHeight = 46; parent.prevCurrSelectionPoint = null;
        this.zoomBtnHold = null; this.currToolbar = ''; parent.cxtTbarHeight = null;
        this.currentToolbar = 'main'; this.selFhdColor = '#42a5f5'; parent.currentFilter = '';
        this.preventZoomBtn = parent.isCropToolbar = this.preventEnableDisableUr = this.isFrameToolbar = false;
        parent.initialAdjustmentValue = parent.canvasFilter =
                'brightness(' + 1 + ') ' + 'contrast(' + 100 + '%) ' + 'hue-rotate(' + 0 + 'deg) ' +
                'saturate(' + 100 + '%) ' + 'opacity(' + 1 + ') ' + 'blur(' + 0 + 'px) ' + 'sepia(0%) ' + 'grayscale(0%) ' + 'invert(0%)';
        parent.tempStraighten = 0; parent.isStraightening = false;
    }

    private destroyTopToolbar(): void {
        const parent: ImageEditor = this.parent;
        const toolbar: HTMLElement = document.getElementById(parent.element.id + '_toolbar');
        if (this.isToolbar() && toolbar && toolbar.classList.contains('e-control')) {
            (getComponent(toolbar, 'toolbar') as Toolbar).destroy();
        }
    }

    private destroyBottomToolbar(): void {
        const parent: ImageEditor = this.parent;
        const toolbar: HTMLElement = document.getElementById(parent.element.id + '_bottomToolbar');
        if (toolbar && toolbar.classList.contains('e-control')) {
            (getComponent(toolbar, 'toolbar') as Toolbar).destroy();
        }
    }

    private isToolbar(): boolean {
        const parent: ImageEditor = this.parent;
        return (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.length > 0)
        || !isNullOrUndefined(parent.toolbarTemplate));
    }

    private createToolbar(): void {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.length > 0)) {
            parent.element.appendChild(parent.createElement('div', {
                id: id + '_toolbarArea', className: 'e-toolbar-area'
            }));
            const toolbarItems: ItemModel = { cssClass: 'e-image-upload', align: 'Left', type: 'Input',
                tooltipText: this.l10n.getConstant('Browse'), template: new Uploader({allowedExtensions: parent.uploadSettings.allowedExtensions, multiple: false }) };
            if (isNullOrUndefined(this.defToolbarItems)) {
                this.defToolbarItems = [];
            }
            this.defToolbarItems.push(toolbarItems);
            const toolbarArea: HTMLElement = document.getElementById(id + '_toolbarArea');
            const toolbar: HTMLElement = parent.createElement('div', { id: id + '_toolbar' });
            toolbarArea.appendChild(toolbar);
            const uploadItems: ItemModel[] = [
                {
                    cssClass: 'e-image-upload',
                    align: 'Left', type: 'Input',
                    tooltipText: this.l10n.getConstant('Browse'),
                    template: new Uploader({
                        allowedExtensions: parent.uploadSettings.allowedExtensions,
                        multiple: false,
                        selected: () => {
                            const toolbar: HTMLElement = document.getElementById(id + '_toolbar');
                            const bToolbar: HTMLElement = document.getElementById(id + '_bottomToolbar');
                            if (!parent.disabled) {
                                if (Browser.isDevice) {
                                    if (this.defToolbarItems.length > 0 && toolbar) {
                                        (getComponent(toolbar, 'toolbar') as Toolbar).destroy();
                                    }
                                    if (bToolbar) {
                                        (getComponent(bToolbar, 'toolbar') as Toolbar).destroy();
                                    }
                                    this.initMainToolbar(false, Browser.isDevice, null);
                                    this.createBottomToolbar();
                                } else {
                                    if (this.defToolbarItems.length > 0 && toolbar) {
                                        (getComponent(toolbar, 'toolbar') as Toolbar).destroy();
                                    }
                                    this.initMainToolbar(false, false, null);
                                }
                            }
                        }
                    })
                }
            ];
            const toolbarObj: Toolbar = new Toolbar({ items: uploadItems, width: '100%',
                created: () => {
                    parent.trigger('toolbarCreated', {toolbarType: 'main'});
                },
                clicked: this.defToolbarClicked.bind(this)});
            toolbarObj.appendTo('#' + id + '_toolbar');
            this.createLeftToolbarControls();
            const mToolbar: HTMLElement = document.getElementById(id + '_toolbar');
            if (toolbar) {
                this.toolbarHeight = mToolbar.clientHeight;
                if (parent.toolbar && parent.toolbar.length > 0 && parent.toolbar.indexOf('Open') === -1) {
                    const toolabr: Toolbar = (getComponent(document.getElementById(parent.element.id + '_toolbar'), 'toolbar') as Toolbar);
                    if (toolabr) {
                        toolabr.destroy();
                        document.getElementById(parent.element.id + '_toolbar').innerHTML = '';
                    }
                }
            }
        } else {
            this.toolbarHeight = 0;
        }
    }

    private createContextualToolbar(): void {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.length > 0)) {
            const contextualToolbarArea: HTMLElement = parent.createElement('div', { id: id + '_contextualToolbarArea', className: 'e-contextual-toolbar-wrapper e-hide' });
            contextualToolbarArea.style.position = 'absolute';
            parent.element.appendChild(contextualToolbarArea);
            const toolbarArea: HTMLElement = document.getElementById(id + '_contextualToolbarArea');
            const toolbar: HTMLElement = parent.createElement('div', { id: id + '_contextualToolbar' });
            toolbarArea.appendChild(toolbar);
        }
    }

    private createBottomToolbar(): void {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        if (parent.element.querySelector('#' + id + '_bottomToolbarArea')) {
            parent.element.querySelector('#' + id + '_bottomToolbarArea').remove();
        }
        if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.length > 0)) {
            parent.element.appendChild(parent.createElement('div', {
                id: id + '_bottomToolbarArea', className: 'e-bottom-toolbar'
            }));
            if (!parent.toolbarTemplate) {
                const toolbarArea: HTMLElement = document.getElementById(id + '_bottomToolbarArea');
                const toolbarElem: HTMLElement = parent.createElement('div', {
                    id: id + '_bottomToolbar'
                });
                toolbarArea.appendChild(toolbarElem);
            }
            this.initBottomToolbar();
        }
    }

    private createQuickAccessToolbar(): void {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        if (parent.showQuickAccessToolbar) {
            const toolbarItems: ItemModel = { cssClass: 'e-image-upload', align: 'Left', type: 'Input',
                tooltipText: this.l10n.getConstant('Browse'), template: new Uploader({allowedExtensions: parent.uploadSettings.allowedExtensions, multiple: false }) };
            if (isNullOrUndefined(this.defToolbarItems)) {
                this.defToolbarItems = [];
            }
            this.defToolbarItems.push(toolbarItems);
            const toolbarArea: HTMLElement = document.getElementById(id + '_quickAccessToolbarArea');
            const toolbar: HTMLElement = parent.createElement('div', {
                id: id + '_quickAccessToolbar'
            });
            toolbarArea.appendChild(toolbar);
            const toolbarObj: Toolbar = new Toolbar({clicked: this.defToolbarClicked.bind(this)});
            toolbarObj.appendTo('#' + id + '_quickAccessToolbar');
        }
    }

    private initMainToolbar(isApplyOption?: boolean, isDevice?: boolean, isOkBtn?: boolean, isResize?: boolean,
                            isFrame?: boolean, isMainToolbar?: boolean, isRedact?: boolean): void {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        if (this.isToolbar()) {
            const leftItem: ItemModel[] = this.getLeftToolbarItem(isOkBtn, isResize);
            const rightItem: ItemModel[] = this.getRightToolbarItem(isOkBtn, isMainToolbar, isRedact);
            const mainItem: ItemModel[] = this.getMainToolbarItem(isApplyOption, isFrame, isRedact);
            const zoomItem: ItemModel[] = this.getZoomToolbarItem();
            if (isDevice) {
                if (isFrame || isRedact) {
                    this.defToolbarItems = mainItem;
                } else {
                    this.defToolbarItems = [...leftItem, ...rightItem];
                }
            } else {
                this.defToolbarItems = [...leftItem, ...mainItem, ...rightItem, ...zoomItem];
            }
            const args: ToolbarEventArgs = {toolbarType: 'main', toolbarItems: this.defToolbarItems };
            parent.trigger('toolbarUpdating', args);
            this.defToolbarItems = args.toolbarItems as ItemModel[];
            if (this.defToolbarItems.length > 0) {
                const toolbarObj: Toolbar = new Toolbar({
                    width: '100%',
                    items: this.defToolbarItems,
                    clicked: this.defToolbarClicked.bind(this),
                    created: () => {
                        if (!isDevice) {
                            this.renderAnnotationBtn();
                        }
                        this.wireZoomBtnEvents();
                        parent.trigger('toolbarCreated', {toolbarType: 'main'});
                    }
                });
                if ((isDevice && isFrame) || (isDevice && isRedact)) {
                    toolbarObj.appendTo('#' + id + '_bottomToolbar');
                } else {
                    toolbarObj.appendTo('#' + id + '_toolbar');
                }
                this.createLeftToolbarControls();
                this.enableDisableTbrBtn();
                if (this.isToolbar() && document.getElementById(id + '_toolbar')) {
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    const toolbar: any = getComponent(id + '_toolbar', 'toolbar') as Toolbar;
                    toolbar.refreshOverflow();
                }
            }
        }
    }

    private initBottomToolbar(): void {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.length > 0)) {
            let items: ItemModel[] = this.getMainToolbarItem();
            const args: ToolbarEventArgs = {toolbarType: 'bottom-toolbar', toolbarItems: items };
            parent.trigger('toolbarUpdating', args);
            items = args.toolbarItems as ItemModel[];
            const toolbarObj: Toolbar = new Toolbar({ items: items, width: '100%',
                created: () => {
                    this.renderAnnotationBtn();
                    this.renderCropBtn();
                    this.renderTransformBtn();
                    parent.trigger('toolbarCreated', {toolbarType: 'main'});
                },
                clicked: this.defToolbarClicked.bind(this)
            });
            toolbarObj.appendTo('#' + id + '_bottomToolbar');
            if (this.defToolbarItems.length > 0 && document.getElementById(id + '_bottomToolbar')) {
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                const toolbar: any = getComponent(id + '_bottomToolbar', 'toolbar') as Toolbar;
                toolbar.refreshOverflow();
            }
        }
    }

    private getLeftToolbarItem(isOkBtn?: boolean, isResize?: boolean): ItemModel[] {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        const toolbarItems: ItemModel[] = [];
        if (!isOkBtn || isResize) {
            if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('Open') > -1)) {
                toolbarItems.push({ id: id + '_upload', cssClass: 'e-image-upload', align: 'Left', type: 'Input', template: new Uploader({allowedExtensions: parent.uploadSettings.allowedExtensions, multiple: false }) });
                toolbarItems.push({ visible: false, cssClass: 'e-image-position e-btn e-flat', tooltipText: this.l10n.getConstant('Browse'), align: 'Left' });
            } else if (Browser.isDevice && (parent.toolbar && parent.toolbar.indexOf('Open') === -1)) {
                toolbarItems.push({ visible: false, id: id + '_upload', cssClass: 'e-image-upload', align: 'Left', type: 'Input', template: new Uploader({allowedExtensions: parent.uploadSettings.allowedExtensions, multiple: false }) });
                toolbarItems.push({ visible: false, cssClass: 'e-image-position e-btn e-flat', tooltipText: this.l10n.getConstant('Browse'), align: 'Left' });
            }
        }
        if (parent.allowUndoRedo && !isResize) {
            if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('Undo') > -1)) {
                toolbarItems.push({ id: id + '_undo', prefixIcon: 'e-icons e-undo', cssClass: 'top-icon e-undo',
                    tooltipText: this.l10n.getConstant('Undo'), align: 'Left' });
            }
            if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('Redo') > -1)) {
                toolbarItems.push({ id: id + '_redo', prefixIcon: 'e-icons e-redo', cssClass: 'top-icon e-redo',
                    tooltipText: this.l10n.getConstant('Redo'), align: 'Left' });
            }
        }
        if (!this.preventZoomBtn && (parent.zoomSettings.zoomTrigger & ZoomTrigger.Toolbar) === ZoomTrigger.Toolbar && !isResize) {
            if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('ZoomOut') > -1)) {
                toolbarItems.push({ id: id + '_zoomOut', prefixIcon: 'e-icons e-zoom-out', cssClass: 'top-icon e-dec-zoom',
                    tooltipText: this.l10n.getConstant('ZoomOut'), align: 'Left' });
            }
            if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('ZoomIn') > -1)) {
                toolbarItems.push({ id: id + '_zoomIn', prefixIcon: 'e-icons e-zoom-in', cssClass: 'top-icon e-inc-zoom',
                    tooltipText: this.l10n.getConstant('ZoomIn'), align: 'Left' });
            }
        }
        const tempToolbarItems: ItemModel[] = this.processToolbar('left');
        for (let i: number = 0, len: number = tempToolbarItems.length; i < len; i++) {
            toolbarItems.push(tempToolbarItems[i as number]);
        }
        return toolbarItems;
    }

    private getRightToolbarItem(isOkBtn?: boolean, isMainToolbar?: boolean, isRedact?: boolean): ItemModel[] {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        const toolbarItems: ItemModel[] = [];
        if (isOkBtn || isRedact) {
            toolbarItems.push({ id: id + '_ok', prefixIcon: 'e-icons e-check', cssClass: 'top-icon e-tick',
                tooltipText: this.l10n.getConstant('OK'), align: 'Right', tabIndex: 0 });
            toolbarItems.push({ id: id + '_cancel', prefixIcon: 'e-icons e-close', cssClass: 'top-icon e-save',
                tooltipText: this.l10n.getConstant('Cancel'), align: 'Right' });
        }
        if ((isMainToolbar || !Browser.isDevice) && (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('Reset') > -1))) {
            toolbarItems.push({ id: id + '_reset', prefixIcon: 'e-icons e-btn-reset', cssClass: 'top-icon e-img-reset',
                tooltipText: this.l10n.getConstant('Reset'), align: 'Right' });
        }
        if (!isOkBtn) {
            if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('Save') > -1)) {
                toolbarItems.push({ id: id + '_save', prefixIcon: 'e-icons e-btn-save', cssClass: 'e-caret-hide top-icon e-save',
                    tooltipText: this.l10n.getConstant('Save'), align: 'Right' });
            }
        }
        const tempToolbarItems: ItemModel[] = this.processToolbar('right');
        for (let i: number = 0, len: number = tempToolbarItems.length; i < len; i++) {
            toolbarItems.push(tempToolbarItems[i as number]);
        }
        return toolbarItems;
    }

    private getMainToolbarItem(isApplyOption?: boolean, isFrame?: boolean, isRedact?: boolean): ItemModel[] {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        const toolbarItems: ItemModel[] = [];
        if (isFrame) {
            if (isNullOrUndefined(parent.toolbar) || (!isNullOrUndefined(parent.toolbar) && parent.toolbar.indexOf('None') > -1) || parent.toolbar.indexOf('Frame') > -1) {
                toolbarItems.push({ id: id + '_none', prefixIcon: 'e-icons e-frame-none', cssClass: 'top-icon e-frame-none',
                    tooltipText: this.l10n.getConstant('None'), align: 'Center' });
            }
            if (isNullOrUndefined(parent.toolbar) || (!isNullOrUndefined(parent.toolbar) && parent.toolbar.indexOf('Mat') > -1) || parent.toolbar.indexOf('Frame') > -1) {
                toolbarItems.push({ id: id + '_mat', prefixIcon: 'e-icons e-frame-mat', cssClass: 'top-icon e-frame-mat',
                    tooltipText: this.l10n.getConstant('Mat'), align: 'Center' });
            }
            if (isNullOrUndefined(parent.toolbar) || (!isNullOrUndefined(parent.toolbar) && parent.toolbar.indexOf('Bevel') > -1) || parent.toolbar.indexOf('Frame') > -1) {
                toolbarItems.push({ id: id + '_bevel', prefixIcon: 'e-icons e-frame-bevel', cssClass: 'top-icon e-frame-bevel',
                    tooltipText: this.l10n.getConstant('Bevel'), align: 'Center' });
            }
            if (isNullOrUndefined(parent.toolbar) || (!isNullOrUndefined(parent.toolbar) && parent.toolbar.indexOf('Line') > -1) || parent.toolbar.indexOf('Frame') > -1) {
                toolbarItems.push({ id: id + '_line', prefixIcon: 'e-icons e-frame-line', cssClass: 'top-icon e-frame-line',
                    tooltipText: this.l10n.getConstant('Line'), align: 'Center' });
            }
            if (isNullOrUndefined(parent.toolbar) || (!isNullOrUndefined(parent.toolbar) && parent.toolbar.indexOf('Inset') > -1) || parent.toolbar.indexOf('Frame') > -1) {
                toolbarItems.push({ id: id + '_inset', prefixIcon: 'e-icons e-frame-inset', cssClass: 'top-icon e-frame-inset',
                    tooltipText: this.l10n.getConstant('Inset'), align: 'Center' });
            }
            if (isNullOrUndefined(parent.toolbar) || (!isNullOrUndefined(parent.toolbar) && parent.toolbar.indexOf('Hook') > -1) || parent.toolbar.indexOf('Frame') > -1) {
                toolbarItems.push({ id: id + '_hook', prefixIcon: 'e-icons e-frame-hook', cssClass: 'top-icon e-frame-hook',
                    tooltipText: this.l10n.getConstant('Hook'), align: 'Center' });
            }
        } else if (isRedact) {
            toolbarItems.push({ id: id + '_redactBlur', prefixIcon: 'e-icons e-tint', cssClass: 'top-icon e-opacity',
                tooltipText: this.l10n.getConstant('Blur'), align: 'Center' });
            toolbarItems.push({ id: id + '_pixelate', prefixIcon: 'e-icons e-opacity', cssClass: 'top-icon e-opacity',
                tooltipText: this.l10n.getConstant('Pixelate'), align: 'Center' });
            toolbarItems.push({ id: id + '_duplicate', prefixIcon: 'e-icons e-order', cssClass: 'top-icon e-order',
                tooltipText: this.l10n.getConstant('Duplicate'), align: 'Center' });
            toolbarItems.push({ id: id + '_remove', prefixIcon: 'e-icons e-trash', cssClass: 'top-icon e-trash',
                tooltipText: this.l10n.getConstant('Remove'), align: 'Center' });
        } else {
            if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('Crop') > -1)) {
                toolbarItems.push({ id: id + '_cropTransform', prefixIcon: 'e-icons e-crop', cssClass: 'top-icon e-crop',
                    tooltipText: this.l10n.getConstant('CropAndTransform'), align: 'Center' });
            }
            if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('Annotate') > -1)) {
                toolbarItems.push({ id: id + '_annotation', tooltipText: this.l10n.getConstant('Annotation'), align: 'Center',
                    template: '<button id="' + id + '_annotationBtn"></button>' });
            }
            if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('Finetune') > -1)) {
                toolbarItems.push({ id: id + '_adjustment', prefixIcon: 'e-icons e-adjustment', cssClass: 'top-icon e-adjustment',
                    tooltipText: this.l10n.getConstant('Finetune'), align: 'Center' });
            }
            if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('Filter') > -1)) {
                toolbarItems.push({ id: id + '_filter', prefixIcon: 'e-icons e-filters', cssClass: 'top-icon e-filters',
                    tooltipText: this.l10n.getConstant('Filter'), align: 'Center' });
            }
            if (isNullOrUndefined(parent.toolbar) || (!isNullOrUndefined(parent.toolbar) && parent.toolbar.indexOf('Frame') > -1)) {
                toolbarItems.push({ id: id + '_frame', prefixIcon: 'e-icons e-border-frame', cssClass: 'top-icon e-border-frame',
                    tooltipText: this.l10n.getConstant('Frame'), align: 'Center' });
            }
            if (isNullOrUndefined(parent.toolbar) || (!isNullOrUndefined(parent.toolbar) && parent.toolbar.indexOf('Resize') > -1)) {
                toolbarItems.push({ id: id + '_resize', prefixIcon: 'e-icons e-resize', cssClass: 'top-icon e-resize',
                    tooltipText: this.l10n.getConstant('Resize'), align: 'Center' });
            }
            if (isNullOrUndefined(parent.toolbar) || (!isNullOrUndefined(parent.toolbar) && parent.toolbar.indexOf('Redact') > -1)) {
                toolbarItems.push({ id: id + '_redact', prefixIcon: 'e-icons e-redact', cssClass: 'top-icon e-opacity',
                    tooltipText: this.l10n.getConstant('Redact'), align: 'Center' });
            }
        }
        const tempToolbarItems: ItemModel[] = this.processToolbar('center');
        for (let i: number = 0, len: number = tempToolbarItems.length; i < len; i++) {
            toolbarItems.push(tempToolbarItems[i as number]);
        }
        if (isApplyOption) {
            toolbarItems.push({ id: id + '_ok', prefixIcon: 'e-icons e-check', cssClass: 'top-icon e-tick',
                tooltipText: this.l10n.getConstant('OK'), align: 'Right', tabIndex: 0 });
            toolbarItems.push({ id: id + '_cancel', prefixIcon: 'e-icons e-close', cssClass: 'top-icon e-save',
                tooltipText: this.l10n.getConstant('Cancel'), align: 'Right' });
        }
        return toolbarItems;
    }

    private getZoomToolbarItem(): ItemModel[] {
        const toolbarItems: ItemModel[] = [];
        return toolbarItems;
    }

    private updateContextualToolbar(type: string, cType?: string, isSelect?: boolean): void {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        const toolbarArea: Element = parent.element.querySelector('#' + id + '_toolbarArea');
        const contextualToolbarArea: Element = parent.element.querySelector('#' + id + '_contextualToolbarArea');
        if (!contextualToolbarArea) { return; }
        contextualToolbarArea.classList.remove('e-hide');
        (contextualToolbarArea as HTMLElement).style.left = (toolbarArea as HTMLElement).offsetLeft + 'px';
        if (type === 'filter') {
            const toolbar: HTMLElement = document.getElementById(id + '_toolbar');
            if (toolbar && this.defToolbarItems.length > 0) {
                (getComponent(toolbar, 'toolbar') as Toolbar).destroy();
            }
            if (Browser.isDevice) {
                this.initMainToolbar(false, true, true);
            } else {
                this.initMainToolbar(true, null, null);
            }
            this.refreshSlider();
            this.initFilterToolbarItem();
        } else {
            const ctxToolbar: HTMLElement = document.querySelector('#' + id + '_contextualToolbar');
            if (ctxToolbar.classList.contains('e-control')) {
                (getComponent(ctxToolbar, 'toolbar') as Toolbar).destroy();
            }
            this.refreshSlider();
            if (type === 'frame') {this.initFrameToolbarItem(); }
            else {this.renderSlider(cType, isSelect); }
        }
        if (parent.toolbarTemplate) {
            this.toolbarHeight = (parent.element.querySelector('#' + id + '_toolbarArea') as HTMLElement).clientHeight;
        } else if (parent.element.querySelector('#' + id + '_toolbar')) {
            this.toolbarHeight = (parent.element.querySelector('#' + id + '_toolbar') as HTMLElement).clientHeight;
        }
        parent.toolbarHeight = this.toolbarHeight;
        if (Browser.isDevice) {
            let cHt: number = (contextualToolbarArea as HTMLElement).offsetHeight + 1;
            const cusWrapper: HTMLElement = parent.element.querySelector('#' + id + '_customizeWrapper');
            if (this.isFrameToolbar && cusWrapper) {
                cHt = cusWrapper.offsetHeight + 2;
            }
            const ht: number = (parent.element.querySelector('#' + id + '_canvasWrapper') as HTMLElement).offsetHeight;
            (contextualToolbarArea as HTMLElement).style.top = this.toolbarHeight + 1 + ht - cHt + 'px';
            if (cType === 'straighten') {
                parent.isStraightening = true;
                const ctxToolbar: HTMLElement = parent.element.querySelector('#' + id + '_contextualToolbarArea') as HTMLElement;
                if (ctxToolbar.style.position === 'absolute') {
                    ctxToolbar.style.position = '';
                    parent.element.insertBefore(ctxToolbar, parent.element.querySelector('#' + id + '_bottomToolbarArea'));
                    parent.update();
                    if (isSelect) {
                        parent.notify('draw', { prop: 'select', onPropertyChange: false,
                            value: {type: this.getCropTextContent(document.getElementById(id + '_cropBtn')).toLowerCase(),
                                startX: null, startY: null, width: null, height: null}});
                    }
                }
            }
        } else {
            (contextualToolbarArea as HTMLElement).style.top = this.toolbarHeight + 1 + 'px';
        }
    }

    private processToolbar(position: string): ItemModel[] {
        const parent: ImageEditor = this.parent;
        const toolbarItems: ItemModel[] = [];
        if (parent.toolbar) {
            for (let i: number = 0, len: number = parent.toolbar.length; i < len; i++) {
                if (typeof(parent.toolbar[i as number]) === 'object') {
                    if (isNullOrUndefined((parent.toolbar[i as number] as ItemModel).align)) {
                        if (position === 'left') {
                            toolbarItems.push(parent.toolbar[i as number] as ItemModel);
                        }
                    } else if ((parent.toolbar[i as number] as ItemModel).align.toLowerCase() === position) {
                        toolbarItems.push(parent.toolbar[i as number] as ItemModel);
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

    private wireZoomBtnEvents(): void {
        const zoomIn: HTMLElement = document.querySelector('#' + this.parent.element.id + '_zoomIn');
        const zoomOut: HTMLElement = document.querySelector('#' + this.parent.element.id + '_zoomOut');
        if (zoomIn) {
            zoomIn.addEventListener('mousedown', this.zoomInBtnMouseDownHandler.bind(this));
            zoomIn.addEventListener('mouseup', this.zoomBtnMouseUpHandler.bind(this));
            zoomIn.addEventListener('click', this.zoomInBtnClickHandler.bind(this));
        }
        if (zoomOut) {
            zoomOut.addEventListener('mousedown', this.zoomOutBtnMouseDownHandler.bind(this));
            zoomOut.addEventListener('mouseup', this.zoomBtnMouseUpHandler.bind(this));
            zoomOut.addEventListener('click', this.zoomOutBtnClickHandler.bind(this));
        }
    }

    private widthPress(e: KeyboardEvent): void {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        if ((e as any).keyCode === 109) {e.preventDefault(); return; }
    }

    private heightPress(e: KeyboardEvent): void {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        if ((e as any).keyCode === 109) {e.preventDefault(); return; }
    }

    private widthAspectRatio(e: MouseEvent & TouchEvent): void {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        if ((e as any).keyCode === 109 || (e as any).keyCode === 9) {return; }
        const parent: ImageEditor = this.parent;
        const id: string = parent.element.id;
        const aspectRatioHeight: HTMLInputElement = parent.element.querySelector('#' + id + '_resizeHeight');
        const aspectRatioWidth: HTMLElement = parent.element.querySelector('#' + id + '_resizeWidth');
        const icon: HTMLElement = parent.element.querySelector('#' + id + '_aspectratio');
        const originalWidth: number = parent.img.destWidth;
        const originalHeight: number = parent.img.destHeight;
        const aspectRatioHeightValue: number = parseFloat(aspectRatioHeight.value);
        const val: number = aspectRatioHeightValue / (originalHeight / originalWidth);
        const width: number = val % 1 >= 0.5 || val % 1 <= -0.5 ? Math.round(val) : (val < 0) ? Math.ceil(val) : Math.floor(val);
        const widthNumeric: NumericTextBox = getComponent(aspectRatioWidth, 'numerictextbox') as NumericTextBox;
        const heightNumeric: NumericTextBox = getComponent(aspectRatioWidth, 'numerictextbox') as NumericTextBox;
        if (icon) {
            if (width != null && !isNaN(width)) {
                if (isNullOrUndefined((widthNumeric).value)) {
                    (widthNumeric).placeholder = width + ' px';
                    (aspectRatioWidth as HTMLInputElement).placeholder = width.toString() + ' px';
                } else {
                    (widthNumeric).value = width;
                    (aspectRatioWidth as HTMLInputElement).value = width.toString() + ' px';
                }
            } else {
                if (isNullOrUndefined((widthNumeric).value)) {
                    (widthNumeric).placeholder = '0 px';
                    (aspectRatioWidth as HTMLInputElement).placeholder = '0 px';
                    if (isNullOrUndefined(heightNumeric.value) && !isNullOrUndefined(heightNumeric.placeholder)) {
                        (widthNumeric).placeholder = `${parent.img.srcWidth}`;
                        (aspectRatioWidth as HTMLInputElement).placeholder = `${parent.img.srcWidth}`;
                    }
                } else {
                    (widthNumeric).value = 0;
                    (aspectRatioWidth as HTMLInputElement).value = '0 px';
                }
            }
        }
    }

    private heightAspectRatio(e: MouseEvent & TouchEvent):  void {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        if ((e as any).keyCode === 109 || (e as any).keyCode === 9) {return; }
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        const aspectRatioHeight: HTMLElement = parent.element.querySelector('#' + id + '_resizeHeight');
        const aspectRatioWidth: HTMLInputElement = parent.element.querySelector('#' + id + '_resizeWidth');
        const icon: HTMLElement = parent.element.querySelector('#' + id + '_aspectratio');
        const originalWidth: number = parent.img.destWidth;
        const originalHeight: number = parent.img.destHeight;
        const aspectRatioWidthValue: number = parseFloat(aspectRatioWidth.value);
        const value: number = aspectRatioWidthValue / (originalWidth / originalHeight);
        const ht: number = value % 1 >= 0.5 || value % 1 <= -0.5 ? Math.round(value) : (value < 0) ? Math.ceil(value) : Math.floor(value);
        const heightNumeric: NumericTextBox = getComponent(aspectRatioHeight, 'numerictextbox') as NumericTextBox;
        const widthNumeric: NumericTextBox = getComponent(aspectRatioWidth, 'numerictextbox') as NumericTextBox;
        if (icon) {
            if (!isNaN(ht)) {
                if (isNullOrUndefined((heightNumeric).value)) {
                    (heightNumeric).placeholder = ht + ' px';
                    (aspectRatioHeight as HTMLInputElement).placeholder = ht.toString() + ' px';
                } else {
                    (heightNumeric).value = ht;
                    (aspectRatioHeight as HTMLInputElement).value = ht.toString() + ' px';
                }
            } else {
                if (isNullOrUndefined((heightNumeric).value)) {
                    (heightNumeric).placeholder = '0 px';
                    (aspectRatioHeight as HTMLInputElement).placeholder = '0 px';
                    if (isNullOrUndefined(widthNumeric.value) && !isNullOrUndefined(widthNumeric.placeholder)) {
                        (heightNumeric).placeholder = `${parent.img.srcHeight}`;
                        (aspectRatioHeight as HTMLInputElement).placeholder = `${parent.img.srcHeight}`;
                    }
                } else {
                    (heightNumeric).value = 0;
                    (aspectRatioHeight as HTMLInputElement).value = '0 px';
                }
            }
        }
    }

    private getResizeToolbarItem(): ItemModel[] {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        const isResize: boolean = parent.aspectWidth && parent.aspectHeight ? true : false;
        const width: string = this.parent.transform.degree % 90 === 0 && this.parent.transform.degree % 180 !== 0 ?
            Math.ceil(this.parent.img.srcHeight).toString() : Math.ceil(this.parent.img.srcWidth).toString();
        const height: string = this.parent.transform.degree % 90 === 0 && this.parent.transform.degree % 180 !== 0 ?
            Math.ceil(this.parent.img.srcWidth).toString() : Math.ceil(this.parent.img.srcHeight).toString();
        const toolbarItems: ItemModel[] = [];
        const spanWidth: HTMLElement = document.createElement('span');
        spanWidth.innerHTML = this.l10n.getConstant('W');
        toolbarItems.push({ id: id + '_width', cssClass: 'e-ie-resize-width', template: spanWidth, align: 'Center' });
        toolbarItems.push({ id: id + '_resizeWidth', prefixIcon: 'e-icons e-anti-clock-wise',
            tooltipText: this.l10n.getConstant('Width'), align: 'Center', type: 'Input', template: new NumericTextBox({ width: 75, htmlAttributes: {  maxLength: '4' },
                showSpinButton: false, value: isResize ? parent.aspectWidth : null,
                placeholder: isResize ? null : width, format: '###.## px' })
        });
        const spanHeight: HTMLElement = document.createElement('span');
        spanHeight.innerHTML = this.l10n.getConstant('H');
        toolbarItems.push({ id: id + '_height', cssClass: 'e-ie-resize-height', template: spanHeight , align: 'Center' });
        toolbarItems.push({ id: id + '_resizeHeight', prefixIcon: 'e-icons e-clock-wise',
            tooltipText: this.l10n.getConstant('Height'), align: 'Center', type: 'Input', template: new NumericTextBox({ width: 75, htmlAttributes: {  maxLength: '4' },
                showSpinButton: false, value: isResize ? parent.aspectHeight : null,
                placeholder: isResize ? null : height, format: '###.## px' })
        });
        if (!this.isAspectRatio) {
            toolbarItems.push({ id: id + '_aspectratio', prefixIcon: 'e-icons e-lock', align: 'Center',
                tooltipText: this.l10n.getConstant('AspectRatio'), type: 'Button', tabIndex: 0 });
            this.isAspectRatio = true;
        } else {
            toolbarItems.push({ id: id + '_nonaspectratio', prefixIcon: 'e-icons e-unlock', align: 'Center', tooltipText: this.l10n.getConstant('AspectRatio'), type: 'Button'});
            this.isAspectRatio = false;
        }
        if (!Browser.isDevice) {
            toolbarItems.push({ id: id + '_ok', prefixIcon: 'e-icons e-check', cssClass: 'top-icon e-tick',
                tooltipText: this.l10n.getConstant('OK'), align: 'Right', tabIndex: 0 });
            toolbarItems.push({ id: id + '_cancel', prefixIcon: 'e-icons e-close', cssClass: 'top-icon e-save',
                tooltipText: this.l10n.getConstant('Cancel'), align: 'Right' });
        }
        return toolbarItems;
    }

    private initResizeToolbar(): void {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        const leftItem: ItemModel[] = this.getLeftToolbarItem(false, true);
        const rightItem: ItemModel[] = this.getRightToolbarItem();
        const mainItem: ItemModel[] = this.getResizeToolbarItem();
        const zoomItem: ItemModel[] = this.getZoomToolbarItem();
        if (Browser.isDevice) {
            this.defToolbarItems = mainItem;
        } else {
            this.defToolbarItems = [...leftItem, ...zoomItem, ...mainItem, ...rightItem];
        }
        const args: ToolbarEventArgs = {toolbarType: 'resize', toolbarItems: this.defToolbarItems };
        parent.trigger('toolbarUpdating', args);
        this.defToolbarItems = args.toolbarItems as ItemModel[];
        const toolbar: Toolbar = new Toolbar({
            width: '100%',
            items: this.defToolbarItems,
            clicked: this.defToolbarClicked.bind(this),
            created: () => {
                this.wireResizeBtnEvents();
                parent.trigger('toolbarCreated', {toolbarType: 'shapes'});
                if (Browser.isDevice) {
                    if (this.defToolbarItems.length > 0 && (!isNullOrUndefined(document.getElementById(id + '_bottomToolbar')))) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        (toolbar as any).refreshOverflow();
                    }
                } else {
                    this.createLeftToolbarControls();
                    if (this.defToolbarItems.length > 0 && (!isNullOrUndefined(document.getElementById(id + '_toolbar')))) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        (toolbar as any).refreshOverflow();
                    }
                }
            }
        });
        if (Browser.isDevice) {
            toolbar.appendTo('#' + id + '_bottomToolbar');
        } else {
            toolbar.appendTo('#' + id + '_toolbar');
        }
        parent.isResize = false;
        this.enableDisableTbrBtn();
        parent.isResize = true;
        parent.notify('transform', { prop: 'disableZoomOutBtn', value: {isZoomOut: true }});
    }

    private wireResizeBtnEvents(): void {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        const aspectRatioHeight: HTMLInputElement = parent.element.querySelector('#' + id + '_resizeHeight');
        const aspectRatioWidth: HTMLInputElement = parent.element.querySelector('#' + id + '_resizeWidth');
        if (!isNullOrUndefined(aspectRatioHeight)) {
            aspectRatioHeight.addEventListener('keydown', this.widthPress.bind(this));
            aspectRatioWidth.addEventListener('keyup', this.heightAspectRatio.bind(this));
        }
        if (!isNullOrUndefined(aspectRatioWidth)) {
            aspectRatioWidth.addEventListener('keydown', this.heightPress.bind(this));
            aspectRatioHeight.addEventListener('keyup', this.widthAspectRatio.bind(this));
        }
    }

    private enableDisableTbrBtn(): void {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        if (!this.preventEnableDisableUr) {
            const object: Object = {appliedUndoRedoColl: [] as Transition[] };
            parent.notify('undo-redo', {prop: 'getAppliedUndoRedoColl', value: {obj: object }});
            const undoRedoObj: Object = {undoRedoStep: null };
            parent.notify('undo-redo', {prop: 'getUndoRedoStep', value: {obj: undoRedoObj }});
            const undo: HTMLElement = parent.element.querySelector('#' + id + '_undo');
            if (undo && undoRedoObj['undoRedoStep'] === 0) {
                undo.classList.add('e-disabled');
                undo.parentElement.classList.add('e-overlay');
            } else if (undo && undoRedoObj['undoRedoStep'] > 0) {
                undo.classList.remove('e-disabled');
                undo.parentElement.classList.remove('e-overlay');
            }
            const redo: HTMLElement = parent.element.querySelector('#' + id + '_redo');
            if (redo && (undoRedoObj['undoRedoStep'] === object['appliedUndoRedoColl'].length)) {
                redo.classList.add('e-disabled');
                redo.parentElement.classList.add('e-overlay');
            } else if (redo && (undoRedoObj['undoRedoStep'] === 0 && object['appliedUndoRedoColl'].length > 0 )) {
                redo.classList.remove('e-disabled');
                redo.parentElement.classList.remove('e-overlay');
            } else if (redo && undoRedoObj['undoRedoStep'] > 0) {
                redo.classList.remove('e-disabled');
                redo.parentElement.classList.remove('e-overlay');
            }
        }
        const zoomIn: HTMLElement = document.querySelector('#' + id + '_zoomIn');
        if (zoomIn && parent.zoomSettings.zoomFactor >= parent.zoomSettings.maxZoomFactor) {
            zoomIn.classList.add('e-disabled');
            zoomIn.parentElement.classList.add('e-overlay');
        } else if (zoomIn) {
            zoomIn.classList.remove('e-disabled');
            zoomIn.parentElement.classList.remove('e-overlay');
        }
        const zoomOut: HTMLElement = document.querySelector('#' + id + '_zoomOut');
        if (zoomOut && parent.zoomSettings.zoomFactor <= parent.zoomSettings.minZoomFactor) {
            zoomOut.classList.add('e-disabled');
            zoomOut.parentElement.classList.add('e-overlay');
        } else if (zoomOut) {
            zoomOut.classList.remove('e-disabled');
            zoomOut.parentElement.classList.remove('e-overlay');
        }
        const frame: HTMLElement = document.querySelector('#' + id + '_frame');
        if (frame && ((parent.currSelectionPoint && parent.currSelectionPoint.shape === 'crop-circle') || parent.isCircleCrop)) {
            frame.classList.add('e-overlay');
        } else if (frame) {
            frame.classList.remove('e-overlay');
        }
        const ratio: HTMLElement = document.querySelector('#' + id + '_aspectratio');
        if (ratio && ((parent.currSelectionPoint && parent.currSelectionPoint.shape === 'crop-circle') || parent.isCircleCrop)) {
            ratio.classList.add('e-overlay');
        } else if (ratio) {
            ratio.classList.remove('e-overlay');
        }
    }

    private createLeftToolbarControls(): void {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        if (this.defToolbarItems !== undefined && this.defToolbarItems.length > 0 &&
            (document.getElementById(id + '_toolbar'))) {
            const uploadDiv: HTMLElement = document.getElementById(id + '_toolbar')
                .querySelector('.e-image-upload');
            if (uploadDiv) {
                const uploadElem: HTMLInputElement = uploadDiv.getElementsByTagName('input')[0];
                const uploadBtnElem: HTMLElement = uploadDiv.getElementsByTagName('button')[0];
                uploadBtnElem.className = 'e-tbar-btn e-tbtn-txt top-icon';
                uploadBtnElem.innerHTML = '';
                uploadBtnElem.title = this.l10n.getConstant('Browse');
                uploadBtnElem.appendChild(parent.createElement('span', {
                    className: 'e-btn-icon e-icons e-upload-icon e-icon-left'
                }));
                uploadElem.onchange = this.fileSelect.bind(this, uploadElem);
            }
        }
    }

    private fileSelect(inputElement: HTMLInputElement, args: Event): void {
        const parent: ImageEditor = this.parent;
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const type: string = (inputElement as any).files[0].type.split('/')[1];
        const filesTypes: string[] = this.parent.getExtensionArray();
        const isJPG: boolean = ((type === 'jpg' || type === 'jpeg') &&
                        (parent.uploadSettings.allowedExtensions.indexOf('jpg') > -1 ||
                        parent.uploadSettings.allowedExtensions.indexOf('jpeg') > -1));
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        this.fileName = (inputElement as any).files[0].name.split('.')[0];
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const size: number = (inputElement as any).files[0].size;
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        this.parent.notify('toolbar', { prop: 'setInitialSize', value: {value: (inputElement as any).files[0].size }});
        if ((filesTypes.indexOf(type) > -1 || isJPG || (type.indexOf('svg') > -1 && filesTypes.indexOf('svg') > -1)) &&
            (!this.parent.uploadSettings.minFileSize || size > this.parent.uploadSettings.minFileSize) &&
            (!this.parent.uploadSettings.maxFileSize || size < this.parent.uploadSettings.maxFileSize)) {
            this.parent.notify('draw', {prop: 'fileSelect', value: {inputElement: inputElement, args: args }});
        } else {
            if (!this.parent.isImageLoaded) {
                this.destroyTopToolbar();
                this.createToolbar();
                if (Browser.isDevice) {
                    this.destroyBottomToolbar();
                }
            }
            this.parent.showDialogPopup('unsupported', !((filesTypes.indexOf(type) > -1 || isJPG || (type.indexOf('svg') > -1 && filesTypes.indexOf('svg') > -1))));
        }
    }

    private triggerTbarClickEvent(args: MenuEventArgs): void {
        const clickEvent: ClickEventArgs = { item: args.item, originalEvent: args.event };
        this.parent.trigger('toolbarItemClicked', clickEvent);
    }

    private renderAnnotationBtn(isContextualToolbar?: boolean): void {
        const parent: ImageEditor = this.parent; let isCustomized: boolean = false;
        const items: DropDownButtonItemModel[] = []; const id: string = parent.element.id;
        const defItems: string[] = ['Ellipse', 'Arrow', 'Line', 'Rectangle', 'Pen', 'Path', 'Text', 'Image'];
        if (parent.toolbar) {
            for (let i: number = 0; i < defItems.length; i++) {
                if (parent.toolbar.indexOf(defItems[i as number]) !== -1) {
                    isCustomized = true;
                    break;
                }
            }
        }
        if (isNullOrUndefined(parent.toolbar) || !isCustomized || (parent.toolbar && parent.toolbar.indexOf('Pen') > -1)) {
            items.push({ text: this.l10n.getConstant('Pen'), id: 'pen', iconCss: 'e-icons e-free-pen' });
        }
        if (isNullOrUndefined(parent.toolbar) || !isCustomized || (parent.toolbar && parent.toolbar.indexOf('Line') > -1)) {
            items.push({ text: this.l10n.getConstant('Line'), id: 'line', iconCss: 'e-icons e-line' });
        }
        if (isNullOrUndefined(parent.toolbar) || !isCustomized || (parent.toolbar && parent.toolbar.indexOf('Rectangle') > -1)) {
            items.push({ text: this.l10n.getConstant('Rectangle'), id: 'rectangle', iconCss: 'e-icons e-rectangle' });
        }
        if (isNullOrUndefined(parent.toolbar) || !isCustomized || (parent.toolbar && parent.toolbar.indexOf('Ellipse') > -1)) {
            items.push({ text: this.l10n.getConstant('Ellipse'), id: 'ellipse', iconCss: 'e-icons e-circle' });
        }
        if (isNullOrUndefined(parent.toolbar) || !isCustomized || (parent.toolbar && parent.toolbar.indexOf('Arrow') > -1)) {
            items.push({ text: this.l10n.getConstant('Arrow'), id: 'arrow', iconCss: 'e-icons e-arrow-right-up' });
        }
        if (isNullOrUndefined(parent.toolbar) || !isCustomized || (parent.toolbar && parent.toolbar.indexOf('Path') > -1)) {
            items.push({ text: this.l10n.getConstant('Path'), id: 'path', iconCss: 'e-icons e-critical-path' });
        }
        if (isNullOrUndefined(parent.toolbar) || !isCustomized || (parent.toolbar && parent.toolbar.indexOf('Text') > -1)) {
            items.push({ text: this.l10n.getConstant('Text'), id: 'text', iconCss: 'e-icons e-add-text' });
        }
        if (isNullOrUndefined(parent.toolbar) || !isCustomized  || (parent.toolbar && parent.toolbar.indexOf('Image') > -1)) {
            items.push({ text: this.l10n.getConstant('Image'), id: 'image', iconCss: 'e-icons e-image' });
        }
        const obj: Object = {freehandDrawSelectedId: null };
        parent.notify('freehand-draw', { prop: 'getFreehandDrawSelectedId', onPropertyChange: false, value: {obj: obj }});
        const toolbarId: string = Browser.isDevice ? '#' + id + '_bottomToolbar ' + '#' + id : '#' + id ;
        this.enableDisableCloneBtn(toolbarId, obj);
        const iconCss: string = isContextualToolbar ? this.getCurrentShapeIcon(parent.activeObj.shape) : 'e-annotation';
        const drpDownBtn: DropDownButton = new DropDownButton({ items: items, iconCss: 'e-icons ' + iconCss,
            cssClass: 'e-image-popup',
            open: (args: OpenCloseMenuEventArgs) => {
                if (parent.currObjType.isFiltered || parent.currObjType.isRedact) {
                    parent.okBtn();
                    (parent.element.querySelector('#' + id + '_annotationBtn') as HTMLInputElement).click();
                }
                if (Browser.isDevice) {
                    args.element.parentElement.style.top = drpDownBtn.element.getBoundingClientRect().top -
                    args.element.parentElement.offsetHeight + 'px';
                }
                if (parent.activeObj.shape) {
                    document.getElementById(parent.activeObj.shape).classList.add('e-selected');
                } else if (parent.togglePen) {
                    document.getElementById('pen').classList.add('e-selected');
                }
            },
            select: (args: MenuEventArgs) => {
                parent.noPushUndo = false;
                this.triggerTbarClickEvent(args);
                parent.okBtn();
                let isCropSelection: boolean = false;
                let splitWords: string[];
                if (parent.activeObj.shape !== undefined) {splitWords = parent.activeObj.shape.split('-'); }
                if (splitWords === undefined && parent.currObjType.isCustomCrop) {
                    isCropSelection = true;
                } else if (splitWords !== undefined && splitWords[0] === 'crop') {
                    isCropSelection = true;
                }
                parent.currObjType.isCustomCrop = false;
                if (isCropSelection || parent.togglePan) {
                    parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
                    this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
                    this.refreshToolbar('main');
                }
                const obj: Object = {currentFreehandDrawIndex: null };
                parent.notify('freehand-draw', {prop: 'getCurrentFreehandDrawIndex', value: {obj: obj }});
                const prevObj: Object = {shapeSettingsObj: {} as ShapeSettings };
                let shapeSettings: ShapeSettings; let shapeChangingArgs: ShapeChangeEventArgs;
                const shapes: string[] = ['ellipse', 'rectangle', 'text', 'image'];
                let allowOutofBound: boolean;
                drpDownBtn.iconCss = 'e-icons ' + this.getCurrentShapeIcon(args.item.id);
                parent.notify('draw', { prop: 'updateTempObjColl'});
                parent.notify('draw', { prop: 'updateTempPointColl'});
                const penStrokeWidthObj: Object = {penStrokeWidth: 2 };
                switch (args.item.id) {
                case 'pen':
                    parent.notify('freehand-draw', {prop: 'getPenStrokeWidth', onPropertyChange: false, value: {obj: penStrokeWidthObj }});
                    parent.notify('draw', {prop: 'setTempStrokeWidth', value: {strokeWidth: penStrokeWidthObj['penStrokeWidth'] }});
                    parent.drawingShape = null;
                    parent.notify('draw', {prop: 'setTempFreehandCounter', value: {tempFreehandCounter: parent.freehandCounter }});
                    parent.notify('draw', {prop: 'setTempCurrentFreehandDrawIndex', value: {tempCurrentFreehandDrawIndex: obj['currentFreehandDrawIndex'] }});
                    this.currentToolbar = 'pen';
                    parent.freeHandDraw(true);
                    parent.notify('selection', { prop: 'updatePrevShapeSettings', onPropertyChange: false, value: {obj: prevObj}});
                    shapeSettings = prevObj['shapeSettingsObj'];
                    parent.notify('freehand-draw', {prop: 'getPenStrokeWidth', onPropertyChange: false, value: {obj: penStrokeWidthObj }});
                    shapeSettings.strokeWidth = penStrokeWidthObj['penStrokeWidth'];
                    shapeSettings.type = ShapeType.FreehandDraw;
                    shapeChangingArgs = {cancel: false, action: 'insert', previousShapeSettings: shapeSettings,
                        currentShapeSettings: shapeSettings};
                    parent.notify('freehand-draw', {prop: 'triggerShapeChanging', value: {shapeChangingArgs: shapeChangingArgs }});
                    break;
                case 'text':
                    this.currentToolbar = 'text';
                    parent.drawingShape = args.item.id;
                    this.currentToolbar = 'text';
                    this.setInitialShapeSettings(args);
                    parent.notify('selection', {prop: 'annotate', value: {shape: args.item.id }});
                    parent.notify('toolbar', { prop: 'refresh-toolbar', onPropertyChange: false, value: {type: 'text',
                        isApplyBtn: null, isCropping: null, isZooming: null, cType: null}});
                    break;
                case 'image':
                    parent.drawingShape = null;
                    this.currentToolbar = 'shapes';
                    (parent.element.querySelector('#' + id + '_fileUpload') as HTMLInputElement).click();
                    break;
                case 'ellipse':
                case 'arrow':
                case 'line':
                case 'rectangle':
                case 'path':
                    parent.drawingShape = args.item.id;
                    this.currentToolbar = 'shapes';
                    this.setInitialShapeSettings(args);
                    parent.notify('selection', {prop: 'annotate', value: {shape: args.item.id }});
                    parent.notify('toolbar', { prop: 'refresh-toolbar', onPropertyChange: false, value: {type: 'shapes',
                        isApplyBtn: null, isCropping: null, isZooming: null, cType: null}});
                    parent.notify('selection', { prop: 'updatePrevShapeSettings', onPropertyChange: false, value: {obj: prevObj}});
                    shapeSettings = prevObj['shapeSettingsObj'];
                    allowOutofBound = shapes.indexOf(this.parent.activeObj.shape) !== -1 ? false : true;
                    shapeChangingArgs = {cancel: false, action: 'insert', previousShapeSettings: shapeSettings,
                        currentShapeSettings: shapeSettings, allowShapeOverflow: allowOutofBound};
                    parent.trigger('shapeChanging', shapeChangingArgs);
                    parent.editCompleteArgs = shapeChangingArgs;
                    parent.notify('shape', {prop: 'updateShapeChangeEventArgs', value: { shapeSettings: shapeChangingArgs.currentShapeSettings}});
                    break;
                }
                this.updateToolbarItems();
                const tempTogglePen: boolean = parent.togglePen;
                if (args.item.id === 'pen') {parent.togglePen = false; }
                parent.notify('draw', { prop: 'redrawDownScale' });
                parent.togglePen = tempTogglePen;
            }
        });
        // Render initialized DropDownButton.
        drpDownBtn.appendTo('#' + id + '_annotationBtn');
    }

    private enableDisableCloneBtn(toolbarId: string, obj: Object): void {
        const parent: ImageEditor = this.parent;
        let isDummyTextClick: boolean = false;
        const width: number = Math.floor(parent.activeObj.activePoint.width);
        if (parent.activeObj.shape && parent.activeObj.shape === 'text' &&
            parent.activeObj.textSettings.fontSize === 11 && (width === 55 || (parent.activeObj.textSettings.bold && width === 58)) &&
            Math.floor(parent.activeObj.activePoint.height) === 11) {
            isDummyTextClick = true;
        }
        const duplicateElement: HTMLElement = document.querySelector(toolbarId + '_duplicate');
        const removeElement: HTMLElement = document.querySelector(toolbarId + '_remove');
        const editTextElement: HTMLElement = document.querySelector(toolbarId + '_editText');
        const zOrderElement: HTMLElement = document.querySelector(toolbarId + '_zOrderBtn');
        if (isDummyTextClick || (parent.activeObj.activePoint.width === 0 && parent.activeObj.activePoint.height === 0) &&
            (isNullOrUndefined(parent.activeObj.pointColl) || (parent.activeObj.pointColl
            && parent.activeObj.pointColl.length === 0)) &&
            isNullOrUndefined(obj['freehandDrawSelectedId'])) {
            if (duplicateElement) {duplicateElement.classList.add('e-overlay'); }
            if (removeElement) {removeElement.classList.add('e-overlay'); }
            if (editTextElement) {editTextElement.classList.add('e-overlay'); }
            if (zOrderElement) {zOrderElement.classList.add('e-overlay'); }
        } else {
            if (duplicateElement) {duplicateElement.classList.remove('e-overlay'); }
            if (removeElement) {removeElement.classList.remove('e-overlay'); }
            if (editTextElement) {editTextElement.classList.remove('e-overlay'); }
            if (zOrderElement) {zOrderElement.classList.remove('e-overlay'); }
        }
        if (zOrderElement && (parent.shapeColl.length === 0 || (obj['freehandDrawSelectedId'] && parent.shapeColl.length === 1))) {
            zOrderElement.classList.add('e-overlay');
        }
    }

    private renderStraightenSlider(): void {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        if ((isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('Straightening') > -1)) &&
            parent.element.querySelector('#' + id + '_straightenSlider')) {
            const slider: Slider = this.createSlider(-45, 45, parent.cropObj.straighten, 'straighten');
            slider.appendTo('#' + id + '_straightenSlider');
            const sliderHandle: HTMLElement = slider.element.querySelector('.e-handle');
            if (sliderHandle && !Browser.isDevice) {
                sliderHandle.addEventListener('mousedown', function (e: MouseEvent): void {
                    e.preventDefault(); e.stopPropagation();
                });
                sliderHandle.addEventListener('touchstart', function (e: MouseEvent): void {
                    e.preventDefault(); e.stopPropagation();
                });
            }
        }
    }

    private renderCropBtn(shapeString?: string): void {
        const parent: ImageEditor = this.parent;
        const items: DropDownButtonItemModel[] = []; let isCustomized: boolean = false;
        const defItems: string[] = ['CustomSelection', 'CircleSelection', 'SquareSelection', 'RatioSelection'];
        if (parent.toolbar) {
            for (let i: number = 0; i < defItems.length; i++) {
                if (parent.toolbar.indexOf(defItems[i as number]) !== -1) {
                    isCustomized = true;
                    break;
                }
            }
        }
        if (isNullOrUndefined(parent.toolbar) || !isCustomized || (parent.toolbar && parent.toolbar.indexOf('CustomSelection') > -1)) {
            items.push({ text: this.l10n.getConstant('Custom'), id: 'custom', iconCss: 'e-icons e-custom' });
        }
        if (isNullOrUndefined(parent.toolbar) || !isCustomized || (parent.toolbar && parent.toolbar.indexOf('CircleSelection') > -1)) {
            items.push({ text: this.l10n.getConstant('Circle'), id: 'circle', iconCss: 'e-icons e-circle' });
        }
        if (isNullOrUndefined(parent.toolbar) || !isCustomized || (parent.toolbar && parent.toolbar.indexOf('SquareSelection') > -1)) {
            items.push({ text: this.l10n.getConstant('Square'), id: 'square', iconCss: 'e-icons e-square' });
        }
        if (isNullOrUndefined(parent.toolbar) || !isCustomized || (parent.toolbar && parent.toolbar.indexOf('RatioSelection') > -1)) {
            items.push({ text: '2:3', id: '2:3', iconCss: 'e-icons e-custom-f' });
            items.push({ text: '3:2', id: '3:2', iconCss: 'e-icons e-custom-a' });
            items.push({ text: '3:4', id: '3:4', iconCss: 'e-icons e-custom-g' });
            items.push({ text: '4:3', id: '4:3', iconCss: 'e-icons e-custom-b' });
            items.push({ text: '4:5', id: '4:5', iconCss: 'e-icons e-custom-h' });
            items.push({ text: '5:4', id: '5:4', iconCss: 'e-icons e-custom-c' });
            items.push({ text: '5:7', id: '5:7', iconCss: 'e-icons e-custom-i' });
            items.push({ text: '7:5', id: '7:5', iconCss: 'e-icons e-custom-d' });
            items.push({ text: '9:16', id: '9:16', iconCss: 'e-icons e-custom-j' });
            items.push({ text: '16:9', id: '16:9', iconCss: 'e-icons e-custom-e' });
        }
        let iconCss: string; let shape: string;
        if (shapeString) {
            iconCss = this.getCurrentShapeIcon(shapeString);
            shape = shapeString;
        } else if (parent.activeObj.shape &&
            (parent.activeObj.activePoint.width !== 0 || parent.activeObj.activePoint.height !== 0) ||
            (parent.activeObj.shape === 'path' && parent.activeObj.pointColl.length > 0)) {
            iconCss = this.getCurrentShapeIcon(parent.activeObj.shape);
            shape = parent.activeObj.shape;
        } else if (parent.currSelectionPoint) {
            iconCss = this.getCurrentShapeIcon(parent.currSelectionPoint.shape);
            shape = parent.currSelectionPoint.shape;
        } else {
            iconCss = items[0].iconCss;
            shape = items[0].id;
        }
        const drpDownBtn: DropDownButton = new DropDownButton({
            open: (args: OpenCloseMenuEventArgs) => {
                if (parent.togglePan) {
                    this.cancelPan();
                }
                if (Browser.isDevice) {
                    args.element.parentElement.style.top = drpDownBtn.element.getBoundingClientRect().top -
                    args.element.parentElement.offsetHeight + 'px';
                }
                if (parent.activeObj.shape && parent.activeObj.shape.split('-').length > 1) {
                    const elem: HTMLElement = document.getElementById(parent.activeObj.shape.split('-')[1]);
                    if (elem) {
                        elem.classList.add('e-selected'); elem.focus();
                    }
                }
                parent.notify('transform', { prop: 'disableZoomOutBtn', value: {isZoomOut: true }});
            },
            items: items,
            select: (args: MenuEventArgs) => {
                this.triggerTbarClickEvent(args);
                this.cropSelect(args);
                drpDownBtn.iconCss = 'e-icons ' + this.getCurrentShapeIcon('crop-' + args.item.id);
                drpDownBtn.content = Browser.isDevice ? null : parent.toPascalCase(args.item.id);
            },
            iconCss: 'e-icons ' + iconCss, cssClass: 'e-image-popup e-ie-crop-ddb-popup',
            content: Browser.isDevice ? null : parent.toPascalCase(shape.replace('crop-', ''))
        });
        drpDownBtn.appendTo('#' + parent.element.id + '_cropBtn');
    }

    private renderTransformBtn(): void {
        const parent: ImageEditor = this.parent;
        const items: DropDownButtonItemModel[] = [];
        if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('RotateLeft') > -1)) {
            items.push({ text: this.l10n.getConstant('RotateLeft'), id: 'rotateleft', iconCss: 'e-icons e-anti-clock-wise' });
        }
        if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('RotateRight') > -1)) {
            items.push({ text: this.l10n.getConstant('RotateRight'), id: 'rotateright', iconCss: 'e-icons e-clock-wise' });
        }
        if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('FlipHorizontal') > -1)) {
            items.push({ text: this.l10n.getConstant('HorizontalFlip'), id: 'horizontalflip', iconCss: 'e-icons e-horizontal-flip' });
        }
        if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('FlipVertical') > -1)) {
            items.push({ text: this.l10n.getConstant('VerticalFlip'), id: 'verticalflip', iconCss: 'e-icons e-vertical-flip' });
        }
        const drpDownBtn: DropDownButton = new DropDownButton({
            open: (args: OpenCloseMenuEventArgs) => {
                if (Browser.isDevice) {
                    const elem: HTMLElement = args.element.parentElement;
                    const ht: number = elem.offsetHeight;
                    elem.style.display = 'none';
                    elem.style.top = drpDownBtn.element.getBoundingClientRect().top - ht + 'px';
                    elem.style.display = 'block';
                }
            },
            items: items,
            select: (args: MenuEventArgs) => {
                this.triggerTbarClickEvent(args);
                parent.transformSelect.bind(this);
            },
            iconCss: 'e-icons e-transform', cssClass: 'e-image-popup'
        });
        drpDownBtn.appendTo('#' + parent.element.id + '_transformBtn');
    }

    private saveDialogPopup(): void {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        const quality: string[] = ['Good', 'Great', 'Highest'];
        parent.element.appendChild(parent.createElement('div', { id: id + '_saveDialog' }));
        const dialogContent: HTMLElement = parent.createElement('div', {
            id: id + '_dialogContent'
        });
        dialogContent.style.display = 'flex';
        const dialogImgContent: HTMLElement = dialogContent.appendChild(parent.createElement('div', {
            id: id + '_dialogImgContent', className: 'e-ie-dlg-img-content'
        }));
        dialogImgContent.appendChild(parent.createElement('canvas', {
            id: id + '_imgPic', className: 'e-ie-img-dlg-canvas'
        }));
        const imageNameContainer: HTMLElement  = dialogImgContent.appendChild(parent.createElement('div', {
            id: id + '_imageNameContainer', className: 'e-ie-img-size'
        }));
        imageNameContainer.appendChild(parent.createElement('span', {
            id: id + '_imageNameLabel', className: 'e-ie-quality-info'
        }));
        const dialogRightContent: HTMLElement = dialogContent.appendChild(parent.createElement('div', {
            id: id + '_dialogRightContent', className: 'e-ie-dlg-right-content'
        }));
        const imageNameDiv: HTMLElement = dialogRightContent.appendChild(parent.createElement('div', {
            id: id + '_namediv', className: 'e-ie-img-save-name' }));
        imageNameDiv.appendChild(parent.createElement('span', {
            id: id + '_labelImgname', className: 'e-ie-img-label-name', innerHTML: this.l10n.getConstant('ImageName')
        }));
        imageNameDiv.appendChild(parent.createElement('input', {
            id: id + '_imgNametext', className: 'e-ie-img-input', attrs: { type: 'text' } }));
        const formatNameDiv: HTMLElement = dialogRightContent.appendChild(parent.createElement('div', {
            id: id + '_imgNamediv', className: 'e-ie-img-save-dlg'
        }));
        formatNameDiv.appendChild(parent.createElement('span', {
            id: id + '_labelname', className: 'e-ie-img-label-name', innerHTML: this.l10n.getConstant('Format')
        }));
        formatNameDiv.appendChild(parent.createElement('button', {
            id: id + '_saveDropdownbtn', attrs: { tabindex: '1' }
        }));
        const qualityNameDiv: HTMLElement = dialogRightContent.appendChild(parent.createElement('div', {
            id: id + '_imgQualitydiv', className: 'e-ie-img-quality-name'
        }));
        const qualityDiv: HTMLElement = parent.createElement('div', {
            id: id + '_qualityContainer'
        });
        qualityDiv.appendChild(parent.createElement('span', {
            id: id + '_qualityLabel', className: 'e-ie-img-quality-label',
            innerHTML: this.l10n.getConstant('Quality')
        }));
        qualityDiv.appendChild(parent.createElement('span', {
            id: id + '_qualityInfo', className: 'e-circle-info e-icons e-ie-quality-span',
            attrs: { title: this.l10n.getConstant('QualityInfo') }
        }));
        const qualityValueElem: HTMLElement = qualityDiv.appendChild(parent.createElement('div', {
            id: id + '_imgsizeSpan',
            className: 'e-ie-img-size-value-span'
        }));
        qualityValueElem.appendChild(parent.createElement('span', {
            id: id + '_imgsizeValueSpan', className: ''
        }));
        qualityNameDiv.appendChild(qualityDiv);
        const qualityOptionDiv: HTMLElement = parent.createElement('div', {
            id: id + '_qualityOptionContainer', className: 'e-ie-quality-option-container'
        });
        const buttonGroup: HTMLElement = qualityNameDiv.appendChild(parent.createElement('div', {
            id: id + '_qualityButtonGroup', className: 'e-btn-group'
        }));
        // eslint-disable-next-line @typescript-eslint/tslint/config
        quality.forEach(option => {
            const input: HTMLInputElement = document.createElement('input');
            input.type = 'radio'; input.id = id + '_' + option.toLowerCase(); input.name = 'quality'; input.value = option.toLowerCase();
            const label: HTMLLabelElement = document.createElement('label');
            label.className = 'e-btn'; label.htmlFor = option.toLowerCase(); label.textContent = this.l10n.getConstant(option);
            buttonGroup.appendChild(input); buttonGroup.appendChild(label);
        });
        qualityOptionDiv.appendChild(buttonGroup);
        qualityOptionDiv.appendChild(parent.createElement('div', {
            id: id + '_qualitySlider', className: 'e-ie-img-quality-slider'
        }));
        qualityOptionDiv.appendChild(parent.createElement('button', { id: id + '_qualitybuttonIcon', className: 'e-ie-img-icon-button', attrs: { type: 'button' } }));
        qualityNameDiv.appendChild(qualityOptionDiv);
        if (Browser.isDevice) {
            dialogRightContent.appendChild(parent.createElement('span', {
                id: id + '_qualitySize', className: 'e-ie-img-quality-size'
            }));
        }
        (parent.element.querySelector('#' + id + '_saveDialog') as HTMLElement).style.display = 'block';
        parent.element.appendChild(dialogContent);
        const dialog: Dialog = new Dialog({
            target: parent.element,
            header: this.l10n.getConstant('SaveAs'),
            closeOnEscape: true, content: document.getElementById(id + '_dialogContent'),
            width: Browser.isDevice ? '345px' : '570px', isModal: true, animationSettings: { effect: 'Zoom' }, beforeOpen: this.onBeforeopen(),
            close: this.saveDialogClosed.bind(this, id),
            cssClass: 'e-ie-save-dialog',
            buttons: [
                {
                    'click': () => {
                        dialog.hide();
                    },
                    buttonModel: {
                        content: this.l10n.getConstant('Close'), cssClass: 'e-save-cancel-btn'
                    }
                },
                {
                    'click': () => {
                        this.download(); dialog.hide(); this.isSlider = false;
                    },
                    buttonModel: {
                        isPrimary: true, content: this.l10n.getConstant('Download'), cssClass: 'e-flat e-save-download-btn'
                    }
                }
            ]
        });
        dialog.appendTo('#' + id + '_saveDialog');
        this.updateSavePreviewImage();
    }

    private updateSavePreviewImage(): void {
        const parent: ImageEditor = this.parent;
        const id: string = parent.element.id;
        const elem: HTMLElement = parent.element.querySelector('#' + id + '_saveDialog');
        if (Browser.isDevice || !elem) {
            return;
        }
        const dialogWidth: number = elem.offsetWidth;
        const dialogMaxHeight: number = parseInt(elem.style.maxHeight, 10);
        const headerHeight: number = (elem.querySelector('.e-dlg-header-content') as HTMLElement).offsetHeight;
        const footerHeight: number = (elem.querySelector('.e-footer-content') as HTMLElement).offsetHeight;
        const padding: number = parseInt(window.getComputedStyle(elem.querySelector('#' + id + '_saveDialog_dialog-content')).padding, 10);
        const imageSizeContent: number = 20; // Image size text container div height
        const canvasMaxWidth: number = dialogWidth * (35 / 100); // 35% of dialog's width
        const canvasMaxHeight: number = dialogMaxHeight - headerHeight - footerHeight - imageSizeContent - (padding * 2);
        const canvas: HTMLCanvasElement = parent.element.querySelector('#' + id + '_imgPic');
        const width: number = canvas.width;
        const height: number = canvas.height;
        const widthScale: number = canvasMaxWidth / width;
        const heightScale: number = canvasMaxHeight / height;
        let cssMaxWidth: number = Math.min(width, canvasMaxWidth);
        let cssMaxHeight: number = Math.min(height, canvasMaxHeight);
        if (widthScale < 1 && widthScale < heightScale) {
            cssMaxWidth = width * widthScale;
            cssMaxHeight = height * widthScale;
        }
        else if (heightScale < 1 && heightScale < widthScale) {
            cssMaxWidth = width * heightScale;
            cssMaxHeight = height * heightScale;
        }
        const imageObj: Object = { canvas: null };
        parent.notify('export', { prop: 'exportToCanvas', value: { object: imageObj } });
        const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = cssMaxWidth; canvas.height = cssMaxHeight;
        const tempCanvas: HTMLCanvasElement = imageObj['canvas'];
        ctx.imageSmoothingQuality = 'medium';
        ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, 0, 0, cssMaxWidth, cssMaxHeight);
    }

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    private saveDialogClosed(id: string): any {
        if ((getComponent(document.getElementById(id + '_saveDropdownbtn'), 'dropdownbutton') as DropDownButton)) {
            (getComponent(document.getElementById(id + '_saveDropdownbtn'), 'dropdownbutton') as DropDownButton).destroy();
        }
        this.isSlider = false;
        if (document.querySelector('#' + id + '_qualityButtonGroup') &&
            document.querySelector('#' + id + '_qualitySlider')) {
            document.querySelector('#' + id + '_qualityButtonGroup').remove();
            document.querySelector('#' + id + '_qualitySlider').remove();
            document.querySelector('#' + id + '_imgsizeValueSpan').remove();
            document.querySelector('#' + id + '_imageNameLabel').remove();
            document.querySelector('#' + id + '_imgsizeSpan').remove();
        }
        document.getElementById(id + '_dialogContent').remove();
        (getComponent(document.getElementById(id + '_saveDialog'), 'dialog') as Dialog).destroy();
        document.getElementById(id + '_saveDialog').remove();
    }

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    private onBeforeopen(): any {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        const obj: Object = { canvas: null };
        const items: DropDownButtonItemModel[] = [
            { id: 'jpeg', text: 'JPEG' },
            { id: 'png', text: 'PNG' },
            { id: 'svg', text: 'SVG' },
            { id: 'webp', text: 'WebP' }
        ];
        const inputObj: TextBox = new TextBox({
            placeholder: this.l10n.getConstant('ImageName')
        });
        inputObj.appendTo('#' + id + '_imgNametext');
        const qualityContainer: HTMLElement = document.getElementById(id + '_imgQualitydiv');
        const slider: HTMLElement = document.getElementById(id + '_qualitySlider');
        const qualityBtnGrp: HTMLElement = (document.querySelector('#' + id + '_qualityButtonGroup') as HTMLElement);
        const qualityBtnIcon: HTMLElement = (document.querySelector('#' + id + '_qualitybuttonIcon') as HTMLElement);
        const qualitySliderValue: HTMLElement = (document.querySelector('#' + id + '_imgsizeSpan') as HTMLElement);
        let imageNameLabel: HTMLElement;
        if (Browser.isDevice) {
            imageNameLabel = document.getElementById(id + '_qualitySize');
        } else {
            imageNameLabel = document.getElementById(id + '_imageNameLabel');
        }
        const fileObj: Object = { fileName: '', fileType: '' };
        parent.notify('draw', { prop: 'getFileName', onPropertyChange: false, value: { obj: fileObj } });
        this.fileType = fileObj['fileType'] ? fileObj['fileType'] : 'JPEG';
        parent.notify('export', { prop: 'exportToCanvas', value: { object: obj } });
        const tempCanvas: HTMLCanvasElement = obj['canvas'];
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const canvas: any = document.getElementById(id + '_imgPic');
        canvas.width = tempCanvas.width; canvas.height = tempCanvas.height;
        const buttonIcon: Button = new Button({ iconCss: 'e-icons e-settings' });
        buttonIcon.appendTo('#' + id + '_qualitybuttonIcon');
        const ddbElem: Element = document.getElementById(id + '_saveDropdownbtn');
        if (ddbElem) {
            const spanElem: HTMLElement = document.createElement('span');
            spanElem.innerHTML = this.fileType === 'Webp' ? 'Webp' : this.fileType.toUpperCase();
            if (ddbElem) {
                ddbElem.appendChild(spanElem);
            }
            const drpDownBtn: DropDownButton = new DropDownButton({
                items: items,
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
                    qualitySliderValue.style.display = 'none';
                    this.fileType = spanElem.innerHTML = args.item.text;
                    if (args.item.id !== 'jpeg') {
                        qualityContainer.style.display = 'none';
                        imageNameLabel.style.display = 'block';
                        this.updateImageSize(1, obj['canvas'], this.fileType);
                        if (slider) {
                            if (this.isSlider) {
                                (getComponent(slider, 'slider') as Slider).destroy();
                            }
                            slider.style.display = 'none';
                        }
                        this.isSlider = false;
                    } else {
                        qualityContainer.style.display = 'block';
                        removeClass([qualityBtnGrp], 'e-hide');
                        slider.style.display = 'none'; imageNameLabel.style.display = 'block';
                        this.updateImageSize(isNullOrUndefined(this.currentQuality) ? 1 : this.currentQuality, obj['canvas'], this.fileType);
                        (document.getElementById(id + '_' + this.imageQuality) as HTMLInputElement).checked = true;
                    }
                    this.updateSavePreviewImage();
                }
            });
            drpDownBtn.appendTo('#' + id + '_saveDropdownbtn');
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            const imgName: any = document.getElementById(id + '_imgNametext');
            imgName.value = this.fileName ? this.fileName : fileObj['fileName'];
            if (fileObj['fileType'] && fileObj['fileType'].toUpperCase() !== 'JPEG') {
                qualityContainer.style.display = 'none';
                qualitySliderValue.style.display = 'none';
            }
            if (Browser.isDevice) {
                (document.getElementById(id + '_dialogImgContent') as HTMLElement).style.display = 'none';
                document.getElementById(id + '_dialogRightContent').style.width = '100%';
                this.updateImageSize(1, obj['canvas'], this.fileType);
            } else {
                this.updateImageSize(1, obj['canvas'], this.fileType);
            }
        }
        (document.getElementById(id + '_' + this.imageQuality) as HTMLInputElement).checked = true;
        qualityBtnGrp.addEventListener('click', this.qualityBtnClickHandler.bind(this));
        qualityBtnIcon.addEventListener('click', this.qualityBtnClickHandler.bind(this));
    }

    private qualityBtnClickHandler(event: MouseEventArgs): void {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        const target: HTMLElement = event.target as HTMLElement;
        const fileObj: Object = { fileName: '' };
        const obj: Object = { canvas: null };
        const compressionValues: object = {
            'Good': 0.8,
            'Great': 0.9,
            'Highest': 1
        };
        const qualityBtnGrp: HTMLElement = (document.querySelector('#' + id + '_qualityButtonGroup') as HTMLElement);
        const qualitySlider: HTMLElement = (document.querySelector('#' + id + '_qualitySlider') as HTMLElement);
        const qualityOption: HTMLElement = (document.querySelector('#' + id + '_qualityOptionContainer') as HTMLElement);
        const qualitySliderValueDiv: HTMLElement = (document.querySelector('#' + id + '_imgsizeSpan') as HTMLElement);
        const qualitySliderValueSpan: HTMLElement = (document.querySelector('#' + id + '_imgsizeValueSpan') as HTMLElement);
        parent.notify('draw', { prop: 'getFileName', onPropertyChange: false, value: { obj: fileObj } });
        parent.notify('export', { prop: 'exportToCanvas', value: { object: obj } });
        if ((event.currentTarget as HTMLElement).id === id + '_qualitybuttonIcon' && !this.isSlider ) {
            addClass([qualityBtnGrp], 'e-hide');
            qualitySlider.style.display = 'block';
            qualitySliderValueDiv.style.display = 'inline-block';
            qualityOption.style.display = 'flex';
            const sliderObj: Slider = new Slider ({
                tooltip: { placement: 'Before', isVisible: true, format: 'P0', showOn: 'Focus' },
                min: 0.01, max: 1, step: 0.01, value: this.currentQuality,
                type: 'MinRange',
                width: Browser.isDevice ? '80%' : '190px',
                created: () => {
                    this.updateImageSize(this.currentQuality, obj['canvas'], 'jpeg');
                    qualitySliderValueSpan.innerHTML = (Math.round(this.currentQuality * 100)).toString();
                    this.updateSavePreviewImage();
                },
                changed: (args: SliderChangeEventArgs) => {
                    this.currentQuality = args.value as number;
                    qualitySliderValueSpan.innerHTML = (Math.round(this.currentQuality * 100)).toString();
                    parent.notify('export', { prop: 'setImageQuality', value: {value: args.value }});
                    this.updateImageSize(args.value, obj['canvas'], 'jpeg');
                    this.updateSavePreviewImage();
                }
            });
            sliderObj.appendTo('#' + id + '_qualitySlider');
            sliderObj.element.parentElement.classList.add('e-ie-quality-slider');
            this.isSlider = true;
        } else if ((event.currentTarget as HTMLElement).id === id + '_qualitybuttonIcon' && this.isSlider) {
            (getComponent(qualitySlider, 'slider') as Slider).destroy();
            qualitySlider.style.display = 'none';
            qualitySliderValueDiv.style.display = 'none';
            removeClass([qualityBtnGrp], 'e-hide');
            qualityOption.style.display = 'block';
            this.isSlider = false;
        // eslint-disable-next-line no-prototype-builtins
        } else if (compressionValues.hasOwnProperty(target.textContent) && !this.isSlider) {
            ((event.target as HTMLElement).previousElementSibling as HTMLInputElement).checked = true;
            this.currentQuality = compressionValues[target.textContent];
            this.imageQuality = target.textContent.toLowerCase();
            this.updateImageSize(compressionValues[target.textContent], obj['canvas'], 'jpeg');
            this.updateSavePreviewImage();
        }

    }

    private updateImageSize(quality: number | number[], tempCanvas: HTMLCanvasElement, fileType: string): void {
        let fileSize: number;
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const canvas: any = document.getElementById(id + '_imgPic');
        const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
        let imageNameLabel: HTMLElement;
        if (Browser.isDevice) {
            imageNameLabel = document.getElementById(id + '_qualitySize');
        } else {
            imageNameLabel = document.getElementById(id + '_imageNameLabel');
        }
        const imageSmoothingEnabled: boolean = parent.imageSmoothingEnabled;
        ctx.canvas.getContext('2d').imageSmoothingQuality = imageSmoothingEnabled ? 'high' : 'low';
        if (fileType.toLowerCase() === 'jpeg') {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(tempCanvas, 0, 0);
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            tempCanvas.toBlob((function (blob: any): void {
                fileSize = Math.floor(blob.size / 1024);
                if (fileSize > 1000) {
                    const megabytes: number = fileSize / 1024;
                    imageNameLabel.innerHTML = this.l10n.getConstant('ImageSize') + ': ' + megabytes.toFixed(2) + ' MB';
                    fileSize = +megabytes.toFixed(2);
                } else {
                    imageNameLabel.innerHTML = this.l10n.getConstant('ImageSize') + ': ' + fileSize.toFixed(2) + ' KB';
                    fileSize = +fileSize.toFixed(2);
                }
                if (Browser.isDevice) {
                    canvas.style.display = 'none';
                }
                this.fileSize = fileSize;
            }).bind(this), 'image/jpeg', quality);
        } else if (!isNullOrUndefined(fileType) && (fileType.toLowerCase() === 'png' || fileType.toLowerCase() === 'webp')) {
            const type: string = 'image/' + fileType.toLowerCase();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(tempCanvas, 0, 0);
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            tempCanvas.toBlob((function (blob: any): void {
                fileSize = Math.floor(blob.size / 1024);
                if (fileSize > 1000) {
                    const megabytes: number = fileSize / 1024;
                    imageNameLabel.innerHTML = this.l10n.getConstant('ImageSize') + ': ' + megabytes.toFixed(2) + ' MB';
                    fileSize = +megabytes.toFixed(2);
                } else {
                    imageNameLabel.innerHTML = this.l10n.getConstant('ImageSize') + ': ' + fileSize.toFixed(2) + ' KB';
                    fileSize = +fileSize.toFixed(2);
                }
                if (Browser.isDevice) {
                    canvas.style.display = 'none';
                }
                this.fileSize = fileSize;
            }).bind(this), type, 1);
        } else if (!isNullOrUndefined(fileType) && fileType.toLowerCase() === 'svg') {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(tempCanvas, 0, 0);
            const svgDataUrl: string = tempCanvas.toDataURL('image/svg+xml');
            const base64Data: string = svgDataUrl.split(',')[1];
            const binaryStringLength: number = base64Data.length;
            const rawByteSize: number = binaryStringLength;
            let fileSize: number = Math.floor(rawByteSize / 1024); // KB
            if (fileSize > 1000) {
                const megabytes: number = fileSize / 1024; // Convert to MB
                imageNameLabel.innerHTML = this.l10n.getConstant('ImageSize') + ': ' + megabytes.toFixed(2) + ' MB';
                fileSize = +megabytes.toFixed(2);
            } else {
                imageNameLabel.innerHTML = this.l10n.getConstant('ImageSize') + ': ' + fileSize.toFixed(2) + ' KB';
                fileSize = +fileSize.toFixed(2);
            }
            if (Browser.isDevice) {
                canvas.style.display = 'none';
            }
            this.fileSize = fileSize;
        } else {
            if (Browser.isDevice) {
                canvas.style.display = 'none';
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(tempCanvas, 0, 0);
                if (this.initialSize > 1000) {
                    const megabytes: number = this.initialSize / 1048576;
                    imageNameLabel.innerHTML = this.l10n.getConstant('ImageSize') + ': ' + megabytes.toFixed(2) + ' MB';
                } else {
                    imageNameLabel.innerHTML = this.l10n.getConstant('ImageSize') + ': ' + this.initialSize.toFixed(2) + ' KB';
                }
            }
        }
    }

    private download(): void {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        if (this.fileType === 'JPEG' && this.isSlider) {
            const value: number | number[] = (getComponent(document.getElementById(id + '_qualitySlider'), 'slider') as Slider).value;
            parent.notify('export', { prop: 'setImageQuality', value: {value: value }});
        } else {
            parent.notify('export', { prop: 'setImageQuality', value: {value: this.currentQuality }});
        }
        const fileName: string = (document.getElementById(id + '_imgNametext') as HTMLInputElement).value;
        parent.export(this.fileType, fileName as string);
    }

    private getCropTransformToolbarItem(): ItemModel[] {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        const toolbarItems: ItemModel[] = [];
        toolbarItems.push({ id: id + '_crop', tooltipText: this.l10n.getConstant('CropSelection'), align: 'Center',
            template: '<button id="' + id + '_cropBtn"></button>'
        });
        toolbarItems.push({ align: 'Center', type: 'Separator' });
        if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && (parent.toolbar.indexOf('Transform') > -1 || parent.toolbar.indexOf('RotateLeft') > -1))) {
            toolbarItems.push({ id: id + '_rotateLeft', prefixIcon: 'e-icons e-anti-clock-wise', tooltipText: this.l10n.getConstant('RotateLeft'), align: 'Center' });
        }
        if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && (parent.toolbar.indexOf('Transform') > -1 || parent.toolbar.indexOf('RotateRight') > -1))) {
            toolbarItems.push({ id: id + '_rotateRight', prefixIcon: 'e-icons e-clock-wise', tooltipText: this.l10n.getConstant('RotateRight'), align: 'Center' });
        }
        if (toolbarItems.length > 2) {
            toolbarItems.push({ align: 'Center', type: 'Separator' });
        }
        if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && (parent.toolbar.indexOf('Transform') > -1 || parent.toolbar.indexOf('HorizontalFlip') > -1))) {
            toolbarItems.push({ id: id + '_horizontalFlip', prefixIcon: 'e-icons e-horizontal-flip', tooltipText: this.l10n.getConstant('HorizontalFlip'), align: 'Center' });
        }
        if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && (parent.toolbar.indexOf('Transform') > -1 || parent.toolbar.indexOf('VerticalFlip') > -1))) {
            toolbarItems.push({ id: id + '_verticalFlip', prefixIcon: 'e-icons e-vertical-flip', tooltipText: this.l10n.getConstant('VerticalFlip'), align: 'Center' });
        }
        if ((isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('Straightening') > -1)) && !Browser.isDevice) {
            toolbarItems.push({ align: 'Center', type: 'Separator' });
            if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('Straightening') > -1)) {
                const spanWidth: HTMLElement = document.createElement('span');
                spanWidth.innerHTML = this.l10n.getConstant('Straighten');
                toolbarItems.push({ id: id + '_straightenSpan', cssClass: 'e-ie-straighten-span', template: spanWidth, align: 'Center' });
                toolbarItems.push({ id: id + '_straighten',
                    cssClass: 'top-icon e-straighten', tooltipText: this.l10n.getConstant('Straighten'), align: 'Center', type: 'Input',
                    template: '<div id="' + id + '_straightenSlider"></div>' });
                const straightenSpan: HTMLElement = document.createElement('span');
                straightenSpan.innerHTML = parent.transform.straighten.toString() + '&#176';
                toolbarItems.push({ id: id + '_straightenSpan', cssClass: 'e-ie-straighten-value-span',
                    template: straightenSpan, align: 'Center' });
            }
        }
        if (!Browser.isDevice) {
            toolbarItems.push({ id: id + '_ok', prefixIcon: 'e-icons e-check', cssClass: 'top-icon e-tick',
                tooltipText: this.l10n.getConstant('OK'), align: 'Right', tabIndex: 0 });
            toolbarItems.push({ id: id + '_cancel', prefixIcon: 'e-icons e-close', cssClass: 'top-icon e-save',
                tooltipText: this.l10n.getConstant('Cancel'), align: 'Right' });
        }
        return toolbarItems;
    }

    private getShapesToolbarItem(items: (string | ItemModel)[]): ItemModel[] {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        const toolbarItems: ItemModel[] = [];
        if (isNullOrUndefined(parent.toolbar) || (parent.toolbar)) {
            toolbarItems.push({ id: id + '_annotation', tooltipText: this.l10n.getConstant('Annotation'), align: 'Center',
                template: '<button id="' + id + '_annotationBtn"></button>' });
        }
        if (items.indexOf('fillColor') > -1) {
            toolbarItems.push({ prefixIcon: 'e-icons e-copy', id: id + '_fillcolor',
                cssClass: 'top-icon e-fill', tooltipText: this.l10n.getConstant('FillColor'), align: 'Center', type: 'Input',
                template: '<button id="' + id + '_fillColorBtn"></button>' });
        }
        if (items.indexOf('strokeColor') > -1) {
            toolbarItems.push({ prefixIcon: 'e-icons e-copy', id: id + '_strokecolor',
                cssClass: 'top-icon e-stroke', tooltipText: this.l10n.getConstant('StrokeColor'), align: 'Center', type: 'Input',
                template: '<button id="' + id + '_borderColorBtn"></button>' });
        }
        if (items.indexOf('strokeWidth') > -1) {
            toolbarItems.push({ id: id + '_strokeWidth', cssClass: 'top-icon e-size', tooltipText: this.l10n.getConstant('StrokeWidth'), align: 'Center',
                type: 'Input', template: '<button id="' + id + '_borderWidthBtn"></button>' });
        }
        if (items.indexOf('start') > -1) {
            toolbarItems.push({ id: id + '_start', cssClass: 'top-icon e-size', tooltipText: this.l10n.getConstant('Start'), align: 'Center',
                type: 'Input', template: '<button id="' + id + '_startBtn"></button>' });
        }
        if (items.indexOf('borderRadius') > -1) {
            toolbarItems.push({ id: id + '_rectangleRadius', cssClass: 'top-icon e-size', tooltipText: this.l10n.getConstant('BorderRadius'), align: 'Center',
                type: 'Input', template: '<button id="' + id + '_rectangleRadiusBtn"></button>' });
        }
        if (items.indexOf('end') > -1) {
            toolbarItems.push({ id: id + '_end', cssClass: 'top-icon e-size', tooltipText: this.l10n.getConstant('End'), align: 'Center',
                type: 'Input', template: '<button id="' + id + '_endBtn"></button>' });
        }
        if (items.indexOf('flip') > -1) {
            toolbarItems.push({ id: id + '_rotLeft', prefixIcon: 'e-anti-clock-wise',
                tooltipText: this.l10n.getConstant('RotateLeft'), align: 'Center' });
            toolbarItems.push({ id: id + '_rotRight', prefixIcon: 'e-clock-wise',
                tooltipText: this.l10n.getConstant('RotateRight'), align: 'Center' });
            toolbarItems.push({ id: id + '_hFlip', prefixIcon: 'e-horizontal-flip',
                tooltipText: this.l10n.getConstant('HorizontalFlip'), align: 'Center' });
            toolbarItems.push({ id: id + '_vFlip', prefixIcon: 'e-vertical-flip',
                tooltipText: this.l10n.getConstant('VerticalFlip'), align: 'Center' });
        }
        if (items.indexOf('transparency') > -1) {
            toolbarItems.push({ align: 'Center', type: 'Separator' });
            toolbarItems.push({ id: id + '_transparency', prefixIcon: 'e-opacity',
                tooltipText: this.l10n.getConstant('Opacity'), align: 'Center' });
        }
        toolbarItems.push({ align: 'Center', type: 'Separator' });
        if (items.indexOf('z-order') > -1) {
            toolbarItems.push({ id: id + '_zOrder', cssClass: 'top-icon e-list-unordered-3', tooltipText: this.l10n.getConstant('ZOrder'), align: 'Center',
                type: 'Input', template: '<button id="' + id + '_zOrderBtn"></button>' });
        }
        if (items.indexOf('duplicate') > -1) {
            toolbarItems.push({ id: id + '_duplicate', prefixIcon: 'e-icons e-order', cssClass: 'top-icon e-order',
                tooltipText: this.l10n.getConstant('Duplicate'), align: 'Center' });
        }
        if (items.indexOf('remove') > -1) {
            toolbarItems.push({ id: id + '_remove', prefixIcon: 'e-icons e-trash', cssClass: 'top-icon e-trash',
                tooltipText: this.l10n.getConstant('Remove'), align: 'Center' });
        }
        if (items.indexOf('text') > -1) {
            toolbarItems.push({ id: id + '_editText', prefixIcon: 'e-icons e-annotation-edit', cssClass: 'top-icon e-annotation-edit',
                tooltipText: this.l10n.getConstant('EditText'), align: 'Center' });
        }
        const tempToolbarItems: ItemModel[] = this.processSubToolbar(items);
        for (let i: number = 0, len: number = tempToolbarItems.length; i < len; i++) {
            toolbarItems.push(tempToolbarItems[i as number]);
        }
        if (!Browser.isDevice) {
            const obj: Object = {shape: null };
            parent.notify('selection', { prop: 'getCurrentDrawingShape', value: {obj: obj }});
            if (obj['shape'] !== 'path') {
                toolbarItems.push({ id: id + '_ok', prefixIcon: 'e-icons e-check', cssClass: 'top-icon e-tick',
                    tooltipText: this.l10n.getConstant('OK'), align: 'Right', tabIndex: 0 });
                toolbarItems.push({ id: id + '_cancel', prefixIcon: 'e-icons e-close', cssClass: 'top-icon e-save',
                    tooltipText: this.l10n.getConstant('Cancel'), align: 'Right' });
            }
        }
        return toolbarItems;
    }

    private initCropTransformToolbar(shape?: string, isTransform?: boolean): void {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        const leftItem: ItemModel[] = this.getLeftToolbarItem();
        const rightItem: ItemModel[] = this.getRightToolbarItem();
        const mainItem: ItemModel[] = this.getCropTransformToolbarItem();
        const zoomItem: ItemModel[] = this.getZoomToolbarItem();
        if (Browser.isDevice) {
            this.defToolbarItems = mainItem;
        } else {
            this.defToolbarItems = [...leftItem, ...zoomItem, ...mainItem, ...rightItem];
        }
        const args: ToolbarEventArgs = {toolbarType: 'crop-transform', toolbarItems: this.defToolbarItems };
        parent.trigger('toolbarUpdating', args);
        this.defToolbarItems = args.toolbarItems as ItemModel[];
        const toolbar: Toolbar = new Toolbar({
            width: '100%',
            items: this.defToolbarItems,
            clicked: this.defToolbarClicked.bind(this),
            created: () => {
                this.renderCropBtn(shape);
                this.renderStraightenSlider();
                this.wireZoomBtnEvents();
                parent.trigger('toolbarCreated', {toolbarType: 'shapes'});
                if (Browser.isDevice) {
                    if (this.defToolbarItems.length > 0 && document.getElementById(id + '_bottomToolbar')) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        (toolbar as any).refreshOverflow(); (toolbar as any).refreshOverflow(); (toolbar as any).refreshOverflow();
                    }
                } else {
                    this.createLeftToolbarControls();
                    if (this.defToolbarItems.length > 0 && document.getElementById(id + '_toolbar')) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        (toolbar as any).refreshOverflow();
                    }
                }
                if (document.getElementById(id + '_cropBtn') && isNullOrUndefined(isTransform)) {
                    if (!Browser.isDevice) {
                        parent.notify('draw', { prop: 'select', onPropertyChange: false,
                            value: {type: this.getCropTextContent(document.getElementById(id + '_cropBtn')).toLowerCase(),
                                startX: null, startY: null, width: null, height: null}});
                    }
                }
            }
        });
        if (Browser.isDevice) {
            toolbar.appendTo('#' + id + '_bottomToolbar');
        } else {
            toolbar.appendTo('#' + id + '_toolbar');
        }
        const slider: HTMLElement = parent.element.querySelector('#' + id + '_straightenSlider');
        if ((isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('Straightening') > -1))
        && slider && slider.parentElement.clientHeight > this.toolbarHeight) {
            this.toolbarHeight = parent.toolbarHeight = slider.parentElement.clientHeight;
        }
        this.enableDisableTbrBtn();
        parent.notify('transform', { prop: 'disableZoomOutBtn', value: {isZoomOut: true }});
    }

    private getCropTextContent(elem: HTMLElement): string {
        if (elem) {
            const classToContentMap: { [key: string]: string } = {'e-custom': 'Custom', 'e-circle': 'Circle',
                'e-square': 'Square', 'e-custom-a': '3:2', 'e-custom-b': '4:3', 'e-custom-c': '5:4', 'e-custom-d': '7:5',
                'e-custom-e': '16:9', 'e-custom-f': '2:3', 'e-custom-g': '3:4', 'e-custom-h': '4:5', 'e-custom-i': '5:7',
                'e-custom-j': '9:16'
            };
            const classList: DOMTokenList = elem.children[0].classList;
            for (const className in classToContentMap) {
                if (classList.contains(className)) {
                    return classToContentMap[className as string];
                }
            }
        }
        return '';
    }

    private getCurrentShapeIcon(shape: string): string {
        // eslint-disable-next-line @typescript-eslint/tslint/config
        const shapeIcons = {
            rectangle: 'e-rectangle',
            ellipse: 'e-circle',
            line: 'e-line',
            arrow: 'e-arrow-right-up',
            path: 'e-critical-path',
            text: 'e-add-text',
            image: 'e-image',
            pen: 'e-free-pen',
            'crop-custom': 'e-custom',
            'crop-circle': 'e-circle',
            'crop-square': 'e-square',
            'crop-3:2': 'e-custom-a',
            'crop-4:3': 'e-custom-b',
            'crop-5:4': 'e-custom-c',
            'crop-7:5': 'e-custom-d',
            'crop-16:9': 'e-custom-e',
            'crop-2:3': 'e-custom-f',
            'crop-3:4': 'e-custom-g',
            'crop-4:5': 'e-custom-h',
            'crop-5:7': 'e-custom-i',
            'crop-9:16': 'e-custom-j'
        };
        return shapeIcons[shape as string] ? shapeIcons[shape as string] : (shape && shape.indexOf('crop-') !== -1) ? 'e-custom' : 'e-free-pen';
    }

    private initShapesToolbarItem(items: (string | ItemModel)[]): void {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        const leftItem: ItemModel[] = this.getLeftToolbarItem();
        const rightItem: ItemModel[] = this.getRightToolbarItem();
        const mainItem: ItemModel[] = this.getShapesToolbarItem(items);
        const zoomItem: ItemModel[] = this.getZoomToolbarItem();
        if (Browser.isDevice) {
            this.defToolbarItems = mainItem;
        } else {
            this.defToolbarItems = [...leftItem, ...zoomItem, ...mainItem, ...rightItem];
        }
        const args: ToolbarEventArgs = {toolbarType: parent.activeObj.shape ? parent.activeObj.shape : 'shapes',
            toolbarItems: this.defToolbarItems };
        parent.trigger('toolbarUpdating', args);
        if (this.isToolbarString(args.toolbarItems)) {
            items = args.toolbarItems;
            this.excludeItems(args.toolbarItems);
        } else {
            this.defToolbarItems = args.toolbarItems as ItemModel[];
        }
        const toolbar: Toolbar = new Toolbar({
            width: '100%',
            items: this.defToolbarItems,
            clicked: this.defToolbarClicked.bind(this),
            created: () => {
                this.renderAnnotationBtn(true);
                this.createRectangleRadius(items);
                this.createShapeColor(items);
                this.createShapeBtn(items);
                this.createZOrderBtn(items);
                if (parent.activeObj.shape === 'arrow') {
                    // eslint-disable-next-line @typescript-eslint/tslint/config
                    if ((items as string[]).some(item => item.toLowerCase().indexOf('start') > -1)) {
                        this.createStartBtn();
                    }
                    // eslint-disable-next-line @typescript-eslint/tslint/config
                    if ((items as string[]).some(item => item.toLowerCase().indexOf('end') > -1)) {
                        this.createEndBtn();
                    }
                }
                this.wireZoomBtnEvents();
                parent.trigger('toolbarCreated', {toolbarType: 'shapes'});
                if (Browser.isDevice) {
                    if (this.defToolbarItems.length > 0 && document.getElementById(id + '_bottomToolbar')) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        (toolbar as any).refreshOverflow(); (toolbar as any).refreshOverflow(); (toolbar as any).refreshOverflow();
                    }
                } else {
                    this.createLeftToolbarControls();
                    if (this.defToolbarItems.length > 0 && document.getElementById(id + '_toolbar')) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        (toolbar as any).refreshOverflow();
                    }
                }
            }
        });
        if (Browser.isDevice) {
            toolbar.appendTo('#' + id + '_bottomToolbar');
        } else {
            toolbar.appendTo('#' + id + '_toolbar');
        }
        this.enableDisableTbrBtn();
    }

    private createRectangleRadius(items: (string | ItemModel)[]): void {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        if (items.indexOf('borderRadius') > -1) {
            const strokeWidthItems: DropDownButtonItemModel[] = [
                { id: '1', text: this.l10n.getConstant('0') },
                { id: '2', text: this.l10n.getConstant('20') },
                { id: '3', text: this.l10n.getConstant('40') },
                { id: '4', text: this.l10n.getConstant('60') },
                { id: '5', text: this.l10n.getConstant('80') },
                { id: '6', text: this.l10n.getConstant('100') }
            ];
            const strokeWidthBtn: HTMLElement = document.getElementById(id + '_rectangleRadiusBtn');
            const spanElem: HTMLElement = document.createElement('span');
            spanElem.innerHTML = this.l10n.getConstant(parent.frameObj.radius.toString());
            spanElem.className = 'e-shape-rectangle-radius';
            strokeWidthBtn.appendChild(spanElem);
            // Initialize the DropDownButton component.
            const drpDownBtn: DropDownButton = new DropDownButton({ items: strokeWidthItems,
                open: (args: OpenCloseMenuEventArgs) => {
                    if (Browser.isDevice) {
                        const parentElem: HTMLElement = args.element.parentElement;
                        parentElem.style.top = drpDownBtn.element.getBoundingClientRect().top -
                        parentElem.offsetHeight + 'px';
                    }
                    const activeBtn: string = drpDownBtn.element.childNodes[0].textContent;
                    if (activeBtn !== '') {
                        args.element.querySelector('[aria-label = ' + '"' + activeBtn + '"' + ']').classList.add('e-selected-btn');
                    }
                },
                select: (args: MenuEventArgs) => {
                    this.triggerTbarClickEvent(args);
                    spanElem.textContent = args.item.text;
                    parent.updateStrokeWidth(args.item.id, 'radius');
                    if (Browser.isDevice) {
                        if (document.getElementById(id + '_bottomToolbar')) {
                            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                            const toolbar: any = getComponent(id + '_bottomToolbar', 'toolbar') as Toolbar;
                            toolbar.refreshOverflow();
                        }
                    } else {
                        if (document.getElementById(id + '_toolbar')) {
                            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                            const toolbar: any = getComponent(id + '_toolbar', 'toolbar') as Toolbar;
                            toolbar.refreshOverflow();
                        }
                    }
                    parent.notify('undo-redo', { prop: 'updateUndoRedoStack', onPropertyChange: false});
                }
            });
            // Render initialized DropDownButton.
            drpDownBtn.appendTo('#' + id + '_rectangleRadiusBtn');
        }
    }

    private beforeModeSwitch(args: ModeSwitchEventArgs, inst: ColorPicker): void {
        this.popupLeft = (args.element.offsetParent as HTMLElement).style.left;
        if (args.mode === 'Picker') {
            inst.showButtons = true; inst.dataBind();
            (args.element.querySelector('.e-apply') as HTMLElement).title = this.l10n.getConstant('Apply');
            (args.element.querySelector('.e-cancel') as HTMLElement).title = this.l10n.getConstant('Cancel');
            (args.element.querySelector('.e-mode-switch-btn') as HTMLElement).title = this.l10n.getConstant('StandardColors');
        } else {
            inst.showButtons = false; inst.dataBind();
            (args.element.querySelector('.e-mode-switch-btn') as HTMLElement).title = this.l10n.getConstant('MoreColors');
        }
    }

    private createShapeColor(items: (string | ItemModel)[]): void {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        if (items.indexOf('fillColor') > -1) {
            parent.element.querySelector('.e-template.e-fill').appendChild(parent.createElement('input', {
                id: id + '_shape_fill'
            }));
            const fillColor: ColorPicker = new ColorPicker({
                modeSwitcher: true, noColor: true, value: '', inline: true,
                showButtons: false, mode: 'Palette', cssClass: 'e-shape-fill-color',
                beforeModeSwitch: (args: ModeSwitchEventArgs): void => this.beforeModeSwitch(args, fillColor),
                presetColors: {
                    'custom': ['', '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#2196f3',
                        '#03a9f4', '#00bcd4', '#009688', '#ffeb3b', '#ffffff', '#ffebee', '#fce4ec', '#f3e5f5', '#ede7f6', '#e3f2fd',
                        '#e1f5fe', '#e0f7fa', '#e0f2f1', '#fffde7', '#f2f2f2', '#ffcdd2', '#f8bbd0', '#e1bee7', '#d1c4e9', '#bbdefb',
                        '#b3e5fc', '#b2ebf2', '#b2dfdb', '#fff9c4', '#e6e6e6', '#ef9a9a', '#f48fb1', '#ce93d8', '#b39ddb', '#90caf9',
                        '#81d4fa', '#80deea', '#80cbc4', '#fff59d', '#cccccc', '#e57373', '#f06292', '#ba68c8', '#9575cd', '#64b5f6',
                        '#4fc3f7', '#4dd0e1', '#4db6ac', '#fff176', '#b3b3b3', '#ef5350', '#ec407a', '#ab47bc', '#7e57c2', '#42a5f5',
                        '#29b6f6', '#26c6da', '#26a69a', '#ffee58', '#999999', '#e53935', '#d81b60', '#8e24aa', '#5e35b1', '#1e88e5',
                        '#039be5', '#00acc1', '#00897b', '#fdd835', '#808080', '#d32f2f', '#c2185b', '#7b1fa2', '#512da8', '#1976d2',
                        '#0288d1', '#0097a7', '#00796b', '#fbc02d', '#666666', '#c62828', '#ad1457', '#6a1b9a', '#4527a0', '#1565c0',
                        '#0277bd', '#00838f', '#00695c', '#f9a825', '#4d4d4d', '#b71c1c', '#880e4f', '#4a148c', '#311b92', '#0d47a1',
                        '#01579b', '#006064', '#004d40', '#f57f17']
                },
                beforeTileRender: (args: PaletteTileEventArgs): void => {
                    if (args.value === '') {
                        args.element.classList.add('e-nocolor-item');
                    }
                },
                change: (args: ColorPickerEventArgs): void => {
                    parent.updateFillColor(args.value);
                    if (args.currentValue.rgba === '') {
                        (fillDDB.element.children[0] as HTMLElement).classList.add('e-nocolor-item');
                    } else {
                        (fillDDB.element.children[0] as HTMLElement).classList.remove('e-nocolor-item');
                        (fillDDB.element.children[0] as HTMLElement).style.backgroundColor = args.currentValue.rgba;
                    }
                    fillDDB.toggle();
                    parent.notify('undo-redo', { prop: 'updateUndoRedoStack', onPropertyChange: false});
                },
                onModeSwitch: (args: ModeSwitchEventArgs): void => {
                    if (Browser.isDevice) {
                        args.element.parentElement.parentElement.style.left = this.popupLeft;
                        args.element.parentElement.parentElement.style.top = (fillDDB.element.getBoundingClientRect().top - args.element.parentElement.parentElement.offsetHeight) + 'px';
                    }
                },
                beforeClose: (): void => {
                    fillDDB.toggle();
                }
            }, '#' + id + '_shape_fill');
            const fillDDB: DropDownButton = new DropDownButton({
                open: (args: OpenCloseMenuEventArgs) => {
                    const parenElem: HTMLElement = args.element.parentElement;
                    if (Browser.isDevice) {
                        parenElem.style.top = fillDDB.element.getBoundingClientRect().top -
                        parenElem.offsetHeight + 'px';
                        if (window.innerWidth <= 520) { parenElem.style.left = parent.element.offsetLeft + 'px'; }
                    }
                },
                target: '.e-shape-fill-color',
                iconCss: 'e-dropdownbtn-preview',
                cssClass: 'e-ie-ddb-popup'
            }, '#' + id + '_fillColorBtn');
            fillColor.inline = true;
            fillColor.value = fillColor.getValue(fillColor.value, 'rgba');
            (parent.element.querySelector('.e-fill.e-template .e-dropdownbtn-preview') as HTMLElement).classList.add('e-nocolor-item');
        }
        if (items.indexOf('strokeColor') > -1) {
            parent.element.querySelector('.e-template.e-stroke').appendChild(parent.createElement('input', {
                id: id + '_shape_stroke'
            }));
            const strokeColor: ColorPicker = new ColorPicker({
                modeSwitcher: true, noColor: false, value: '#fff', inline: true,
                showButtons: false, mode: 'Palette', cssClass: 'e-shape-stroke-color',
                beforeModeSwitch: (args: ModeSwitchEventArgs): void => {
                    this.popupLeft = (args.element.offsetParent as HTMLElement).style.left;
                    strokeColor.value = parent.activeObj.strokeSettings.strokeColor !== '#fff' ? parent.activeObj.strokeSettings.strokeColor : '#008000ff';
                    this.beforeModeSwitch(args, strokeColor);
                },
                presetColors: this.presetColors,
                change: (args: ColorPickerEventArgs): void => {
                    parent.updateStrokeColor(args.value);
                    (strokeDDB.element.children[0] as HTMLElement).style.backgroundColor = args.currentValue.rgba;
                    strokeDDB.toggle();
                    parent.notify('undo-redo', { prop: 'updateUndoRedoStack', onPropertyChange: false});
                },
                onModeSwitch: (args: ModeSwitchEventArgs): void => {
                    if (Browser.isDevice) {
                        args.element.parentElement.parentElement.style.left = this.popupLeft;
                        args.element.parentElement.parentElement.style.top = (strokeDDB.element.getBoundingClientRect().top - args.element.parentElement.parentElement.offsetHeight) + 'px';
                    }
                },
                beforeClose: (): void => {
                    strokeDDB.toggle();
                }
            }, '#' + id + '_shape_stroke');
            const strokeDDB: DropDownButton = new DropDownButton({
                open: (args: OpenCloseMenuEventArgs) => {
                    const parenElem: HTMLElement = args.element.parentElement;
                    if (Browser.isDevice) {
                        parenElem.style.top = strokeDDB.element.getBoundingClientRect().top -
                        parenElem.offsetHeight + 'px';
                        if (window.innerWidth <= 520) { parenElem.style.left = parent.element.offsetLeft + 'px'; }
                    }
                },
                target: '.e-shape-stroke-color',
                iconCss: 'e-dropdownbtn-preview',
                cssClass: 'e-ie-ddb-popup'
            }, '#' + id + '_borderColorBtn');
            strokeColor.inline = true;
            strokeColor.value = strokeColor.getValue(strokeColor.value, 'rgba');
            (parent.element.querySelector('.e-stroke.e-template .e-dropdownbtn-preview') as HTMLElement).style.background = '#fff';
        }
    }

    private createShapeBtn(items: (string | ItemModel)[]): void {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        if (items.indexOf('strokeWidth') > -1) {
            let strokeWidthItems: DropDownButtonItemModel[] = [
                { id: '1', text: this.l10n.getConstant('XSmall') },
                { id: '2', text: this.l10n.getConstant('Small') },
                { id: '3', text: this.l10n.getConstant('Medium') },
                { id: '4', text: this.l10n.getConstant('Large') },
                { id: '5', text: this.l10n.getConstant('XLarge') }
            ];
            if (parent.activeObj.shape && (parent.activeObj.shape === 'rectangle' || parent.activeObj.shape === 'ellipse')) {
                strokeWidthItems = [
                    { id: '1', text: this.l10n.getConstant('NoOutline') },
                    { id: '2', text: this.l10n.getConstant('XSmall') },
                    { id: '3', text: this.l10n.getConstant('Small') },
                    { id: '4', text: this.l10n.getConstant('Medium') },
                    { id: '5', text: this.l10n.getConstant('Large') },
                    { id: '6', text: this.l10n.getConstant('XLarge') }
                ];
            }
            const strokeWidthBtn: HTMLElement = document.getElementById(id + '_borderWidthBtn');
            const spanElem: HTMLElement = document.createElement('span');
            spanElem.innerHTML = this.l10n.getConstant('XSmall');
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
                    this.triggerTbarClickEvent(args);
                    spanElem.textContent = args.item.text;
                    parent.updateStrokeWidth(args.item.id, 'width', parent.activeObj.shape);
                    if (Browser.isDevice) {
                        if (document.getElementById(id + '_bottomToolbar')) {
                            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                            const toolbar: any = getComponent(id + '_bottomToolbar', 'toolbar') as Toolbar;
                            toolbar.refreshOverflow();
                        }
                    } else {
                        if (document.getElementById(id + '_toolbar')) {
                            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                            const toolbar: any = getComponent(id + '_toolbar', 'toolbar') as Toolbar;
                            toolbar.refreshOverflow();
                        }
                    }
                    parent.notify('undo-redo', { prop: 'updateUndoRedoStack', onPropertyChange: false});
                }
            });
            // Render initialized DropDownButton.
            drpDownBtn.appendTo('#' + id + '_borderWidthBtn');
        }
    }

    private createZOrderBtn(items: (string | ItemModel)[]): void {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        if (items.indexOf('z-order') > -1) {
            const zOrderItems: DropDownButtonItemModel[] = [
                { text: this.l10n.getConstant('BringForward'), id: 'bringForward', iconCss: 'e-icons e-bring-forward' },
                { text: this.l10n.getConstant('SendBackward'), id: 'sendBackward', iconCss: 'e-icons e-send-backward' },
                { text: this.l10n.getConstant('BringToFront'), id: 'bringToFront', iconCss: 'e-icons e-bring-to-front' },
                { text: this.l10n.getConstant('SendToBack'), id: 'sendToBack', iconCss: 'e-icons e-send-to-back' }
            ];
            // Initialize the DropDownButton component.
            const drpDownBtn: DropDownButton = new DropDownButton({ items: zOrderItems, iconCss: 'e-icons e-layers',
                beforeOpen: (args: BeforeOpenCloseMenuEventArgs) => {
                    if (document.getElementById(parent.element.id + '_zOrderBtn').classList.contains('e-disabled')) {
                        args.cancel = true;
                    }
                    const indexObj: Object = {freehandSelectedIndex: -1 };
                    parent.notify('freehand-draw', {prop: 'getFreehandSelectedIndex', onPropertyChange: false, value: {obj: indexObj }});
                    const orderObj: Object = {order: null };
                    parent.notify('shape', { prop: 'getHighestOrder', onPropertyChange: false, value: {obj: orderObj } });
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const order: number = parent.activeObj.order ? parent.activeObj.order : (parent.getObjFromId(parent.pointColl[indexObj['freehandSelectedIndex']].id) as any).order;
                    if (order && order >= orderObj['order']) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (args.items[0] as any).disabled = true; (args.items[2] as any).disabled = true;
                    } else {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (args.items[0] as any).disabled = false; (args.items[2] as any).disabled = false;
                    }
                    parent.notify('shape', { prop: 'getLowestOrder', onPropertyChange: false, value: {obj: orderObj } });
                    if (order && order <= orderObj['order']) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (args.items[1] as any).disabled = true; (args.items[3] as any).disabled = true;
                    } else{
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (args.items[1] as any).disabled = false; (args.items[3] as any).disabled = false;
                    }
                },
                open: (args: OpenCloseMenuEventArgs) => {
                    if (Browser.isDevice) {
                        args.element.parentElement.style.top = drpDownBtn.element.getBoundingClientRect().top -
                        args.element.parentElement.offsetHeight + 'px';
                    }
                },
                select: (args: MenuEventArgs) => {
                    this.triggerTbarClickEvent(args);
                    const obj: Object = {freehandDrawSelectedId: null };
                    parent.notify('freehand-draw', { prop: 'getFreehandDrawSelectedId', onPropertyChange: false, value: {obj: obj }});
                    const shapeId: string = obj['freehandDrawSelectedId'] ? obj['freehandDrawSelectedId'] : parent.activeObj.currIndex;
                    parent.updateShapeOrder(shapeId, args.item.id);
                    if (Browser.isDevice) {
                        if (document.getElementById(id + '_bottomToolbar')) {
                            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                            const toolbar: any = getComponent(id + '_bottomToolbar', 'toolbar') as Toolbar;
                            toolbar.refreshOverflow();
                        }
                    } else {
                        if (document.getElementById(id + '_toolbar')) {
                            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                            const toolbar: any = getComponent(id + '_toolbar', 'toolbar') as Toolbar;
                            toolbar.refreshOverflow();
                        }
                    }
                    if (shapeId.indexOf('shape') > -1) {
                        parent.notify('undo-redo', { prop: 'updateUndoRedoStack', onPropertyChange: false });
                    } else if (shapeId.indexOf('pen') > -1) {
                        parent.notify('undo-redo', { prop: 'updateUndoRedoStack', value: { isPenDraw: true }});
                    }
                }
            });
            // Render initialized DropDownButton.
            drpDownBtn.appendTo('#' + id + '_zOrderBtn');
        }
    }

    private createStartBtn(): void {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        const strokeWidthItems: DropDownButtonItemModel[] = [
            { id: '1', text: this.l10n.getConstant('None') },
            { id: '2', text: this.l10n.getConstant('Bar') },
            { id: '3', text: this.l10n.getConstant('Arrow') },
            { id: '4', text: this.l10n.getConstant('ArrowSolid') },
            { id: '5', text: this.l10n.getConstant('Circle') },
            { id: '6', text: this.l10n.getConstant('CircleSolid') },
            { id: '7', text: this.l10n.getConstant('Square') },
            { id: '8', text: this.l10n.getConstant('SquareSolid') }
        ];
        const strokeWidthBtn: HTMLElement = document.getElementById(id + '_startBtn');
        const spanElem: HTMLElement = document.createElement('span');
        if (isNullOrUndefined(parent.activeObj.start)) {
            parent.activeObj.start = 'none';
        }
        spanElem.innerHTML = parent.pascalToSplitWords(parent.activeObj.start);
        spanElem.className = 'e-shape-start';
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
                const idToValue: Object = {'1': 'none', '2': 'bar', '3': 'arrow', '4': 'arrowSolid',
                    '5': 'circle', '6': 'circleSolid', '7': 'square', '8': 'squareSolid' };
                parent.notify('selection', { prop: 'setArrowShape', value: {type: 'initial', shape: idToValue[`${args.item.id}`] }});
                this.triggerTbarClickEvent(args);
                spanElem.textContent = args.item.text;
                parent.updateArrow('startArrow', args.item.id);
                parent.notify('undo-redo', { prop: 'updateUndoRedoStack', onPropertyChange: false});
            }
        });
        // Render initialized DropDownButton.
        drpDownBtn.appendTo('#' + id + '_startBtn');
    }

    private createEndBtn(): void {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        const strokeWidthItems: DropDownButtonItemModel[] = [
            { id: '1', text: this.l10n.getConstant('None') },
            { id: '2', text: this.l10n.getConstant('Bar') },
            { id: '3', text: this.l10n.getConstant('Arrow') },
            { id: '4', text: this.l10n.getConstant('ArrowSolid') },
            { id: '5', text: this.l10n.getConstant('Circle') },
            { id: '6', text: this.l10n.getConstant('CircleSolid') },
            { id: '7', text: this.l10n.getConstant('Square') },
            { id: '8', text: this.l10n.getConstant('SquareSolid') }
        ];
        const strokeEndBtn: HTMLElement = document.getElementById(id + '_endBtn');
        const spanElem: HTMLElement = document.createElement('span');
        if (isNullOrUndefined(parent.activeObj.end)) {
            parent.activeObj.end = 'arrowSolid';
        }
        spanElem.innerHTML = parent.pascalToSplitWords(parent.activeObj.end);
        spanElem.className = 'e-shape-end';
        strokeEndBtn.appendChild(spanElem);
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
                const idToValue: Object = {'1': 'none', '2': 'bar', '3': 'arrow', '4': 'arrowSolid',
                    '5': 'circle', '6': 'circleSolid', '7': 'square', '8': 'squareSolid' };
                parent.notify('selection', { prop: 'setArrowShape', value: {type: 'final', shape: idToValue[`${args.item.id}`] }});
                this.triggerTbarClickEvent(args);
                spanElem.textContent = args.item.text;
                parent.updateArrow('endArrow', args.item.id);
                parent.notify('undo-redo', { prop: 'updateUndoRedoStack', onPropertyChange: false});
            }
        });
            // Render initialized DropDownButton.
        drpDownBtn.appendTo('#' + id + '_endBtn');
    }

    private getTextToolbarItem(items: (string | ItemModel)[]): ItemModel[] {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        const toolbarItems: ItemModel[] = [];
        if (isNullOrUndefined(parent.toolbar) || (parent.toolbar)) {
            toolbarItems.push({ id: id + '_annotation', tooltipText: this.l10n.getConstant('Annotation'), align: 'Center',
                template: '<button id="' + id + '_annotationBtn"></button>' });
        }
        if (items.indexOf('fontFamily') > -1) {
            toolbarItems.push({ id: id + '_fontFamily', cssClass: 'top-icon e-img-font-family',
                tooltipText: this.l10n.getConstant('FontFamily'), align: 'Center',
                template: '<button id="' + id + '_fontFamilyBtn"></button>' });
        }
        if (items.indexOf('fontSize') > -1) {
            toolbarItems.push({ id: id + '_fontSize', cssClass: 'top-icon e-img-font-size',
                tooltipText: this.l10n.getConstant('FontSize'), align: 'Center',
                template: '<button id="' + id + '_fontSizeBtn"></button>' });
        }
        if (items.indexOf('fontColor') > -1) {
            toolbarItems.push({ cssClass: 'top-icon e-text-font-color', id: id + '_text_strokecolor',
                tooltipText: this.l10n.getConstant('FontColor'), align: 'Center',
                type: 'Input', template: '<button id="' + id + '_fontColorBtn"></button>' });
        }
        if (items.indexOf('strokeColor') > -1) {
            toolbarItems.push({ cssClass: 'top-icon e-stroke-text-font-color', id: id + '_stroke_text_color',
                tooltipText: this.l10n.getConstant('TextOutlineColor'), align: 'Center',
                type: 'Input', template: '<button id="' + id + '_strokeTextColorBtn"></button>' });
        }
        if (items.indexOf('fillColor') > -1) {
            toolbarItems.push({ cssClass: 'top-icon e-text-background-color', id: id + '_text_backgroundcolor',
                tooltipText: this.l10n.getConstant('FillColor'), align: 'Center',
                type: 'Input', template: '<button id="' + id + '_bgColorBtn"></button>'
            });
        }
        if (items.indexOf('bold') > -1) {
            toolbarItems.push({ id: id + '_bold', prefixIcon: 'e-icons e-bold', cssClass: 'top-icon e-bold',
                tooltipText: this.l10n.getConstant('Bold'), align: 'Center' });
        }
        if (items.indexOf('italic') > -1) {
            toolbarItems.push({ id: id + '_italic', prefixIcon: 'e-icons e-italic', cssClass: 'top-icon e-italic',
                tooltipText: this.l10n.getConstant('Italic'), align: 'Center' });
        }
        if (items.indexOf('strokeWidth') > -1) {
            toolbarItems.push({ id: id + '_strokeWidth', cssClass: 'top-icon e-size', tooltipText: this.l10n.getConstant('TextOutlineWidth'), align: 'Center',
                type: 'Input', template: '<button id="' + id + '_borderWidthBtn"></button>' });
        }
        if (items.indexOf('transparency') > -1) {
            toolbarItems.push({ id: id + '_transparency', prefixIcon: 'e-opacity',
                tooltipText: this.l10n.getConstant('Opacity'), align: 'Center' });
        }
        toolbarItems.push({ align: 'Center', type: 'Separator' });
        if (items.indexOf('z-order') > -1) {
            toolbarItems.push({ id: id + '_zOrder', cssClass: 'top-icon e-list-unordered-3', tooltipText: this.l10n.getConstant('ZOrder'), align: 'Center',
                type: 'Input', template: '<button id="' + id + '_zOrderBtn"></button>' });
        }
        if (items.indexOf('duplicate') > -1) {
            toolbarItems.push({ id: id + '_duplicate', prefixIcon: 'e-icons e-order', cssClass: 'top-icon e-order',
                tooltipText: this.l10n.getConstant('Duplicate'), align: 'Center', disabled: (parent.textArea.style.display === 'block' || parent.textArea.style.display === 'inline-block') ? true : false });
        }
        if (items.indexOf('remove') > -1) {
            toolbarItems.push({ id: id + '_remove', prefixIcon: 'e-icons e-trash', cssClass: 'top-icon e-trash',
                tooltipText: this.l10n.getConstant('Remove'), align: 'Center', disabled: (parent.textArea.style.display === 'block' || parent.textArea.style.display === 'inline-block') ? true : false });
        }
        if (items.indexOf('text') > -1) {
            toolbarItems.push({ id: id + '_editText', prefixIcon: 'e-icons e-annotation-edit', cssClass: 'top-icon e-annotation-edit',
                tooltipText: this.l10n.getConstant('EditText'), align: 'Center', disabled: (parent.textArea.style.display === 'block' || parent.textArea.style.display === 'inline-block') ? true : false });
        }
        const tempToolbarItems: ItemModel[] = this.processSubToolbar(items);
        for (let i: number = 0, len: number = tempToolbarItems.length; i < len; i++) {
            toolbarItems.push(tempToolbarItems[i as number]);
        }
        if (!Browser.isDevice) {
            toolbarItems.push({ id: id + '_ok', prefixIcon: 'e-icons e-check', cssClass: 'top-icon e-tick',
                tooltipText: this.l10n.getConstant('OK'), align: 'Right', tabIndex: 0 });
            toolbarItems.push({ id: id + '_cancel', prefixIcon: 'e-icons e-close', cssClass: 'top-icon e-save',
                tooltipText: this.l10n.getConstant('Cancel'), align: 'Right' });
        }
        return toolbarItems;
    }

    private getFontFamilyItems(): ItemModel[] {
        const parent: ImageEditor = this.parent;
        let items: ItemModel[] = [];
        if (parent.fontFamily && parent.fontFamily.items && parent.fontFamily.items.length > 0) {
            items = parent.fontFamily.items;
        } else {
            if (Browser.isDevice) {
                items = [{ id: 'arial', text: 'ABC' }, { id: 'calibri', text: 'ABC' }, { id: 'georgia', text: 'ABC' },
                    { id: 'roboto', text: 'ABC' }, { id: 'tahoma', text: 'ABC' }];
            } else {
                items = [{ id: 'arial', text: 'Arial' }, { id: 'calibri', text: 'Calibri' }, { id: 'georgia', text: 'Georgia' },
                    { id: 'roboto', text: 'Roboto' }, { id: 'tahoma', text: 'Tahoma' }];
            }
        }
        return items;
    }

    private initTextToolbarItem(items: (string | ItemModel)[]): void {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        const leftItem: ItemModel[] = this.getLeftToolbarItem();
        const rightItem: ItemModel[] = this.getRightToolbarItem();
        const mainItem: ItemModel[] = this.getTextToolbarItem(items);
        const zoomItem: ItemModel[] = this.getZoomToolbarItem();
        if (Browser.isDevice) {
            this.defToolbarItems = mainItem;
        } else {
            this.defToolbarItems = [...leftItem, ...zoomItem, ...mainItem, ...rightItem];
        }
        const args: ToolbarEventArgs = {toolbarType: 'text', toolbarItems: this.defToolbarItems };
        parent.trigger('toolbarUpdating', args);
        if (this.isToolbarString(args.toolbarItems)) {
            items = args.toolbarItems;
            this.excludeItems(args.toolbarItems);
        } else {
            this.defToolbarItems = args.toolbarItems as ItemModel[];
        }
        const toolbar: Toolbar = new Toolbar({
            width: '100%',
            items: this.defToolbarItems,
            clicked: this.defToolbarClicked.bind(this),
            created: () => {
                this.renderAnnotationBtn(true);
                this.createTextColor(items);
                this.createStrokeTextColor(items);
                this.createShapeBtn(items);
                this.createBackgroundColor(items);
                this.createTextBtn(items);
                this.createZOrderBtn(items);
                this.wireZoomBtnEvents();
                parent.trigger('toolbarCreated', {toolbarType: 'text'});
                if (Browser.isDevice) {
                    if (this.defToolbarItems.length > 0 && document.getElementById(id + '_bottomToolbar')) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        (toolbar as any).refreshOverflow(); (toolbar as any).refreshOverflow(); (toolbar as any).refreshOverflow();
                    }
                } else {
                    this.createLeftToolbarControls();
                    if (this.defToolbarItems.length > 0 && document.getElementById(id + '_toolbar')) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        (toolbar as any).refreshOverflow();
                    }
                }
            }
        });
        if (Browser.isDevice) {
            toolbar.appendTo('#' + id + '_bottomToolbar');
        } else {
            toolbar.appendTo('#' + id + '_toolbar');
        }
        this.enableDisableTbrBtn();
    }

    private createTextColor(items: (string | ItemModel)[]): void {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        if (items.indexOf('fontColor') > -1 && parent.element.querySelector('.e-template.e-text-font-color')) {
            parent.element.querySelector('.e-template.e-text-font-color').appendChild(parent.createElement('input', {
                id: id + '_text_font'
            }));
            const fontColor: ColorPicker = new ColorPicker({
                modeSwitcher: true, noColor: false, value: '#fff', inline: true,
                showButtons: false, mode: 'Palette', cssClass: 'e-text-fontt-color',
                beforeModeSwitch: (args: ModeSwitchEventArgs): void => {
                    this.popupLeft = (args.element.offsetParent as HTMLElement).style.left;
                    fontColor.value = parent.activeObj.strokeSettings.strokeColor !== '#fff' ? parent.activeObj.strokeSettings.strokeColor : '#008000ff';
                    this.beforeModeSwitch(args, fontColor);
                },
                presetColors: this.presetColors,
                change: (args: ColorPickerEventArgs): void => {
                    parent.updateFontColor(args.value, 'Text');
                    (strokeDDB.element.children[0] as HTMLElement).style.backgroundColor = args.currentValue.rgba;
                    strokeDDB.toggle();
                    if (parent.activeObj.activePoint.width !== 0 || parent.activeObj.activePoint.height !== 0) {
                        parent.notify('undo-redo', { prop: 'updateUndoRedoStack', onPropertyChange: false});
                    }
                },
                onModeSwitch: (args: ModeSwitchEventArgs): void => {
                    if (Browser.isDevice) {
                        args.element.parentElement.parentElement.style.left = this.popupLeft;
                        args.element.parentElement.parentElement.style.top = (strokeDDB.element.getBoundingClientRect().top - args.element.parentElement.parentElement.offsetHeight) + 'px';
                    }
                },
                beforeClose: (): void => {
                    strokeDDB.toggle();
                }
            }, '#' + id + '_text_font');
            const strokeDDB: DropDownButton = new DropDownButton({
                open: (args: OpenCloseMenuEventArgs) => {
                    const parenElem: HTMLElement = args.element.parentElement;
                    if (Browser.isDevice) {
                        parenElem.style.top = strokeDDB.element.getBoundingClientRect().top -
                        parenElem.offsetHeight + 'px';
                        if (window.innerWidth <= 520) { parenElem.style.left = parent.element.offsetLeft + 'px'; }
                    }
                },
                target: '.e-text-fontt-color',
                iconCss: 'e-dropdownbtn-preview',
                cssClass: 'e-ie-ddb-popup'
            }, '#' + id + '_fontColorBtn');
            fontColor.inline = true;
            fontColor.value = fontColor.getValue(fontColor.value, 'rgba');
            (parent.element.querySelector('.e-text-font-color.e-template .e-dropdownbtn-preview') as HTMLElement).style.background
                = '#fff';
        }
    }

    private createBackgroundColor(items: (string | ItemModel)[]): void {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        if (items.indexOf('fillColor') > -1 && parent.element.querySelector('.e-template.e-text-background-color')) {
            parent.element.querySelector('.e-template.e-text-background-color').appendChild(parent.createElement('input', {
                id: id + '_text_bgColor'
            }));
            const backgroundColor: ColorPicker = new ColorPicker({
                modeSwitcher: true, noColor: true, value: '', inline: true,
                showButtons: false, mode: 'Palette', cssClass: 'e-text-fontt-color',
                beforeModeSwitch: (args: ModeSwitchEventArgs): void => {
                    this.popupLeft = (args.element.offsetParent as HTMLElement).style.left;
                    this.beforeModeSwitch(args, backgroundColor);
                },
                presetColors: {
                    'custom': ['', '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#2196f3',
                        '#03a9f4', '#00bcd4', '#009688', '#ffeb3b', '#ffffff', '#ffebee', '#fce4ec', '#f3e5f5', '#ede7f6', '#e3f2fd',
                        '#e1f5fe', '#e0f7fa', '#e0f2f1', '#fffde7', '#f2f2f2', '#ffcdd2', '#f8bbd0', '#e1bee7', '#d1c4e9', '#bbdefb',
                        '#b3e5fc', '#b2ebf2', '#b2dfdb', '#fff9c4', '#e6e6e6', '#ef9a9a', '#f48fb1', '#ce93d8', '#b39ddb', '#90caf9',
                        '#81d4fa', '#80deea', '#80cbc4', '#fff59d', '#cccccc', '#e57373', '#f06292', '#ba68c8', '#9575cd', '#64b5f6',
                        '#4fc3f7', '#4dd0e1', '#4db6ac', '#fff176', '#b3b3b3', '#ef5350', '#ec407a', '#ab47bc', '#7e57c2', '#42a5f5',
                        '#29b6f6', '#26c6da', '#26a69a', '#ffee58', '#999999', '#e53935', '#d81b60', '#8e24aa', '#5e35b1', '#1e88e5',
                        '#039be5', '#00acc1', '#00897b', '#fdd835', '#808080', '#d32f2f', '#c2185b', '#7b1fa2', '#512da8', '#1976d2',
                        '#0288d1', '#0097a7', '#00796b', '#fbc02d', '#666666', '#c62828', '#ad1457', '#6a1b9a', '#4527a0', '#1565c0',
                        '#0277bd', '#00838f', '#00695c', '#f9a825', '#4d4d4d', '#b71c1c', '#880e4f', '#4a148c', '#311b92', '#0d47a1',
                        '#01579b', '#006064', '#004d40', '#f57f17']
                },
                beforeTileRender: (args: PaletteTileEventArgs): void => {
                    if (args.value === '') {
                        args.element.classList.add('e-nocolor-item');
                    }
                },
                change: (args: ColorPickerEventArgs): void => {
                    parent.updateFontColor(args.value, 'Background');
                    if (args.currentValue.rgba === '') {
                        (strokeDDB.element.children[0] as HTMLElement).classList.add('e-nocolor-item');
                    }
                    else {
                        (strokeDDB.element.children[0] as HTMLElement).classList.remove('e-nocolor-item');
                        (strokeDDB.element.children[0] as HTMLElement).style.backgroundColor = args.currentValue.rgba;
                    }
                    strokeDDB.toggle();
                    if (parent.activeObj.activePoint.width !== 0 || parent.activeObj.activePoint.height !== 0) {
                        parent.notify('undo-redo', { prop: 'updateUndoRedoStack', onPropertyChange: false});
                    }
                },
                onModeSwitch: (args: ModeSwitchEventArgs): void => {
                    if (Browser.isDevice) {
                        args.element.parentElement.parentElement.style.left = this.popupLeft;
                        args.element.parentElement.parentElement.style.top = (strokeDDB.element.getBoundingClientRect().top - args.element.parentElement.parentElement.offsetHeight) + 'px';
                    }
                },
                beforeClose: (): void => {
                    strokeDDB.toggle();
                }
            }, '#' + id + '_text_bgColor');
            const strokeDDB: DropDownButton = new DropDownButton({
                open: (args: OpenCloseMenuEventArgs) => {
                    const parenElem: HTMLElement = args.element.parentElement;
                    if (Browser.isDevice) {
                        parenElem.style.top = strokeDDB.element.getBoundingClientRect().top -
                        parenElem.offsetHeight + 'px';
                        if (window.innerWidth <= 520) { parenElem.style.left = parent.element.offsetLeft + 'px'; }
                    }
                },
                target: '.e-text-fontt-color',
                iconCss: 'e-dropdownbtn-preview',
                cssClass: 'e-ie-ddb-popup'
            }, '#' + id + '_bgColorBtn');
            backgroundColor.inline = true;
            backgroundColor.value = backgroundColor.getValue(backgroundColor.value, 'rgba');
            (parent.element.querySelector('.e-text-background-color.e-template .e-dropdownbtn-preview') as HTMLElement).style.background
                = '#fff';
        }
    }

    private createStrokeTextColor(items: (string | ItemModel)[]): void {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        if (items.indexOf('strokeColor') > -1 && parent.element.querySelector('.e-template.e-stroke-text-font-color')) {
            parent.element.querySelector('.e-template.e-stroke-text-font-color').appendChild(parent.createElement('input', {
                id: id + '_stroke_text'
            }));
            const fontColor: ColorPicker = new ColorPicker({
                modeSwitcher: true, noColor: true, value: '', inline: true,
                showButtons: false, mode: 'Palette', cssClass: 'e-text-fontt-color',
                beforeModeSwitch: (args: ModeSwitchEventArgs): void => {
                    this.popupLeft = (args.element.offsetParent as HTMLElement).style.left;
                    this.beforeModeSwitch(args, fontColor);
                },
                presetColors: {
                    'custom': ['', '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#2196f3',
                        '#03a9f4', '#00bcd4', '#009688', '#ffeb3b', '#ffffff', '#ffebee', '#fce4ec', '#f3e5f5', '#ede7f6', '#e3f2fd',
                        '#e1f5fe', '#e0f7fa', '#e0f2f1', '#fffde7', '#f2f2f2', '#ffcdd2', '#f8bbd0', '#e1bee7', '#d1c4e9', '#bbdefb',
                        '#b3e5fc', '#b2ebf2', '#b2dfdb', '#fff9c4', '#e6e6e6', '#ef9a9a', '#f48fb1', '#ce93d8', '#b39ddb', '#90caf9',
                        '#81d4fa', '#80deea', '#80cbc4', '#fff59d', '#cccccc', '#e57373', '#f06292', '#ba68c8', '#9575cd', '#64b5f6',
                        '#4fc3f7', '#4dd0e1', '#4db6ac', '#fff176', '#b3b3b3', '#ef5350', '#ec407a', '#ab47bc', '#7e57c2', '#42a5f5',
                        '#29b6f6', '#26c6da', '#26a69a', '#ffee58', '#999999', '#e53935', '#d81b60', '#8e24aa', '#5e35b1', '#1e88e5',
                        '#039be5', '#00acc1', '#00897b', '#fdd835', '#808080', '#d32f2f', '#c2185b', '#7b1fa2', '#512da8', '#1976d2',
                        '#0288d1', '#0097a7', '#00796b', '#fbc02d', '#666666', '#c62828', '#ad1457', '#6a1b9a', '#4527a0', '#1565c0',
                        '#0277bd', '#00838f', '#00695c', '#f9a825', '#4d4d4d', '#b71c1c', '#880e4f', '#4a148c', '#311b92', '#0d47a1',
                        '#01579b', '#006064', '#004d40', '#f57f17']
                },
                beforeTileRender: (args: PaletteTileEventArgs): void => {
                    if (args.value === '') {
                        args.element.classList.add('e-nocolor-item');
                    }
                },
                change: (args: ColorPickerEventArgs): void => {
                    parent.updateStrokeTextColor(args.value);
                    if (args.currentValue.rgba === '') {
                        (strokeDDB.element.children[0] as HTMLElement).classList.add('e-nocolor-item');
                    }
                    else {
                        (strokeDDB.element.children[0] as HTMLElement).classList.remove('e-nocolor-item');
                        (strokeDDB.element.children[0] as HTMLElement).style.backgroundColor = args.currentValue.rgba;
                    }
                    strokeDDB.toggle();
                    if (parent.activeObj.activePoint.width !== 0 || parent.activeObj.activePoint.height !== 0) {
                        parent.notify('undo-redo', { prop: 'updateUndoRedoStack', onPropertyChange: false});
                    }
                },
                onModeSwitch: (args: ModeSwitchEventArgs): void => {
                    if (Browser.isDevice) {
                        args.element.parentElement.parentElement.style.left = this.popupLeft;
                        args.element.parentElement.parentElement.style.top = (strokeDDB.element.getBoundingClientRect().top - args.element.parentElement.parentElement.offsetHeight) + 'px';
                    }
                },
                beforeClose: (): void => {
                    strokeDDB.toggle();
                }
            }, '#' + id + '_stroke_text');
            const strokeDDB: DropDownButton = new DropDownButton({
                open: (args: OpenCloseMenuEventArgs) => {
                    const parenElem: HTMLElement = args.element.parentElement;
                    if (Browser.isDevice) {
                        parenElem.style.top = strokeDDB.element.getBoundingClientRect().top -
                        parenElem.offsetHeight + 'px';
                        if (window.innerWidth <= 520) { parenElem.style.left = parent.element.offsetLeft + 'px'; }
                    }
                },
                target: '.e-text-fontt-color',
                iconCss: 'e-dropdownbtn-preview',
                cssClass: 'e-ie-ddb-popup'
            }, '#' + id + '_strokeTextColorBtn');
            fontColor.inline = true;
            fontColor.value = fontColor.getValue(fontColor.value, 'rgba');
            (parent.element.querySelector('.e-stroke-text-font-color.e-template .e-dropdownbtn-preview') as HTMLElement).style.background
                = '#fff';
        }
    }

    private createTextBtn(items: (string | ItemModel)[]): void {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        if (items.indexOf('fontFamily') > -1) {
            const fontNameBtn: HTMLElement = document.getElementById(id + '_fontFamilyBtn');
            const spanElem: HTMLElement = document.createElement('span');
            if (Browser.isDevice) {
                spanElem.innerHTML = 'ABC';
                spanElem.setAttribute('style', 'font-family: ' + parent.fontFamily.default.toLowerCase() + '\'');
            } else {
                spanElem.innerHTML = parent.fontFamily.default;
            }
            spanElem.className = 'e-text-font-family';
            if (fontNameBtn) {
                fontNameBtn.appendChild(spanElem);
            }
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
                    if (parent.textArea.style.display === 'block' || parent.textArea.style.display === 'inline-block') {
                        fontFamily = parent.textArea.style.fontFamily;
                    } else {
                        fontFamily = parent.activeObj.textSettings.fontFamily;
                    }
                    const elem: HTMLElement = args.element.querySelector('[id *= ' + '"' + fontFamily.toLowerCase() + '"' + ']');
                    if (elem) {
                        elem.classList.add('e-selected-btn');
                    }
                },
                select: (args: MenuEventArgs) => {
                    this.triggerTbarClickEvent(args);
                    spanElem.textContent = args.item.text;
                    if (Browser.isDevice) {
                        spanElem.setAttribute('style', 'font-family:' + args.item.id);
                    }
                    parent.updateFontFamily(args.item.id);
                    parent.notify('undo-redo', { prop: 'updateUndoRedoStack', onPropertyChange: false});
                    const toolbar: HTMLElement = document.getElementById(parent.element.id + '_toolbar');
                    if (toolbar && toolbar.classList.contains('e-control')) {
                        (getComponent(toolbar, 'toolbar') as Toolbar).refreshOverflow();
                    }
                }
            });
            fontFamilyBtn.appendTo('#' + id + '_fontFamilyBtn');
        }
        if (items.indexOf('fontSize') > -1) {
            const fontSizeBtnElem: HTMLElement = document.getElementById(id + '_fontSizeBtn');
            const fontSizeSpanElem: HTMLElement = document.createElement('span');
            const fontSizes: DropDownButtonItemModel[] = parent.getFontSizes();
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
                    this.triggerTbarClickEvent(args);
                    fontSizeSpanElem.textContent =  args.item.text;
                    parent.updateFontSize(args.item.text);
                    parent.notify('undo-redo', { prop: 'updateUndoRedoStack', onPropertyChange: false});
                }
            });
            fontSizeBtn.appendTo('#' + id + '_fontSizeBtn');
        }
    }

    private refreshToolbar(type: string, isApplyBtn?: boolean, isCropping?: boolean, isZooming?: boolean,
                           cType?: string, shape?: string, isTransform?: boolean): void {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        if (!parent.isImageLoaded || parent.isCropToolbar) {
            return;
        }
        const args: ToolbarEventArgs = {};
        let aspectIcon: HTMLInputElement; let nonAspectIcon: HTMLInputElement;
        if (type !== 'filter' && type !== 'color') {
            const toolbarElement: HTMLElement = document.getElementById(id + '_toolbar');
            const cusWrapper: HTMLElement = document.getElementById(id + '_customizeWrapper');
            const bottomToolbar: HTMLElement = document.getElementById(id + '_bottomToolbar');
            if (cusWrapper && (getComponent(cusWrapper, 'toolbar')) && this.defToolbarItems.length > 0) {
                (getComponent(cusWrapper, 'toolbar') as Toolbar).destroy();
                cusWrapper.innerHTML = '';
            }
            if (toolbarElement && toolbarElement.classList.contains('e-control') && this.defToolbarItems.length > 0) {
                (getComponent(toolbarElement, 'toolbar') as Toolbar).destroy();
                toolbarElement.innerHTML = '';
            }
            if (toolbarElement && (this.defToolbarItems.length > 0 || parent.toolbar && parent.toolbar.length > 0 && parent.toolbar.indexOf('Open') === -1)) {
                const toolbar: Toolbar = (getComponent(toolbarElement, 'toolbar') as Toolbar);
                if (!isNullOrUndefined(toolbar)) {
                    toolbar.destroy();
                    document.getElementById(parent.element.id + '_toolbar').innerHTML = '';
                }
            }
            if (bottomToolbar && this.defToolbarItems.length > 0) {
                if (bottomToolbar.className.indexOf('e-control') > -1) {
                    (getComponent(bottomToolbar, 'toolbar') as Toolbar).destroy();
                    bottomToolbar.innerHTML = '';
                }
            }
        }
        this.refreshSlider();
        if (document.querySelector('.e-slider-tooltip')) {
            document.querySelector('.e-slider-tooltip').remove();
        }
        this.isFrameToolbar = parent.isCropTab = false;
        switch (type) {
        case 'main':
            if (Browser.isDevice) {
                if (isCropping) { this.initMainToolbar(false, true, true, false, false, true); }
                else { this.initMainToolbar(false, true, null, false, false, true); }
            } else if (!Browser.isDevice || isZooming) {
                if (isZooming) {
                    this.initMainToolbar(isApplyBtn, Browser.isDevice, null);
                } else {
                    this.initMainToolbar(isApplyBtn, Browser.isDevice, null);
                }
            }
            if (Browser.isDevice) { this.initBottomToolbar(); }
            break;
        case 'shapes':
            if (!parent.isPublicMethod) { parent.noPushUndo = true; }
            if (Browser.isDevice) {
                this.initMainToolbar(false, true, true);
            }
            if (parent.activeObj.shape === 'line' || parent.activeObj.shape === 'path') {
                args.toolbarItems = ['strokeColor', 'strokeWidth', 'z-order', 'duplicate', 'remove'];
            } else if (parent.activeObj.shape === 'arrow') {
                args.toolbarItems = ['strokeColor', 'strokeWidth', 'start', 'end', 'z-order', 'duplicate', 'remove'];
            } else if (parent.activeObj.shape === 'image') {
                args.toolbarItems = ['flip', 'z-order', 'duplicate', 'remove', 'transparency'];
            } else if (parent.activeObj.shape === 'rectangle'){
                args.toolbarItems = ['fillColor', 'strokeColor', 'strokeWidth', 'borderRadius', 'z-order', 'duplicate', 'remove'];
            } else {
                args.toolbarItems = ['fillColor', 'strokeColor', 'strokeWidth', 'z-order', 'duplicate', 'remove'];
            }
            this.initShapesToolbarItem(args.toolbarItems);
            if (parent.activeObj.shape === 'image') {
                const actObj: SelectionPoint = extend({}, parent.activeObj, {}, true) as SelectionPoint;
                parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false });
                parent.notify('draw', { prop: 'render-image', value: { isMouseWheel: null, isPreventClearRect: null, isFrame: true } });
                parent.activeObj = actObj;
                parent.notify('draw', { prop: 'drawObject', onPropertyChange: false, value: { canvas: 'duplicate', obj: parent.activeObj,
                    isCropRatio: null, points: null, isPreventDrag: true } });
                this.renderQAT(false);
            }
            break;
        case 'text':
            if (Browser.isDevice) {
                this.initMainToolbar(false, true, true);
            }
            args.toolbarItems = ['fontFamily', 'fontSize', 'fontColor', 'fillColor', 'strokeColor', 'strokeWidth', 'bold', 'italic', 'z-order', 'duplicate', 'remove', 'text'];
            this.initTextToolbarItem(args.toolbarItems);
            break;
        case 'pen':
            if (Browser.isDevice) {
                this.initMainToolbar(false, true, true);
            }
            args.toolbarItems = ['strokeColor', 'strokeWidth', 'z-order', 'remove', 'transparency'];
            this.initPenToolbarItem(args.toolbarItems);
            break;
        case 'adjustment':
            if (Browser.isDevice) {
                this.initMainToolbar(false, true, true);
            }
            this.initAdjustmentToolbarItem();
            break;
        case 'filter':
            this.updateContextualToolbar(type);
            break;
        case 'resize':
            if (parent.isCircleCrop || (parent.currSelectionPoint && parent.currSelectionPoint.shape === 'crop-circle')) {
                parent.aspectHeight = parent.aspectWidth; this.isAspectRatio = false;
            }
            this.initResizeToolbar();
            if (Browser.isDevice) {
                this.initMainToolbar(false, true, true, true);
            }
            aspectIcon = (parent.element.querySelector('#' + id + '_aspectratio') as HTMLInputElement);
            nonAspectIcon = (parent.element.querySelector('#' + id + '_nonaspectratio') as HTMLInputElement);
            if (parent.aspectWidth && parent.aspectHeight) {
                if (nonAspectIcon) {
                    parent.notify('transform', {prop: 'resize', value: {width: parent.aspectWidth, height: parent.aspectHeight, isAspectRatio: false }});
                }
                else if (aspectIcon) {
                    parent.notify('transform', {prop: 'resize', value: {width: parent.aspectWidth, height: null, isAspectRatio: true }});
                }
            }
            break;
        case 'color':
            this.updateContextualToolbar(type, cType);
            break;
        case 'croptransform':
            if (isNullOrUndefined(isTransform)) {
                parent.allowDownScale = false; parent.isCropTab = true;
            }
            if (Browser.isDevice) {this.initMainToolbar(false, true, true); }
            if (isNullOrUndefined(isTransform)) {parent.updateCropTransformItems(); }
            this.initCropTransformToolbar(shape, isTransform);
            if (Browser.isDevice && this.isToolbar()) {this.updateContextualToolbar('color', 'straighten', true); }
            if (parent.isMaskImage) {
                this.refreshToolbar('main');
            }
            break;
        case 'frame':
            this.isFrameToolbar = true;
            if (Browser.isDevice) {
                this.initMainToolbar(false, true, true);
                this.initMainToolbar(false, true, true, false, true);
            } else {
                this.initMainToolbar(true, null, null, false, true);
            }
            // eslint-disable-next-line no-case-declarations
            const frameElem: HTMLElement = parent.element.querySelector('#' + id + '_' + parent.frameObj.type);
            if (frameElem) {
                frameElem.classList.add('e-selected-btn');
            }
            if (parent.frameObj.type !== 'none') {
                this.updateContextualToolbar(type, cType);
            }
            parent.notify('draw', { prop: 'render-image', value: { isMouseWheel: null, isPreventClearRect: null, isFrame: true } });
            break;
        case 'redact':
            if (Browser.isDevice) {
                this.initMainToolbar(false, true, true);
                this.initMainToolbar(false, true, true, null, null, null, true);
            } else {
                this.initMainToolbar(isApplyBtn, Browser.isDevice, null, null, null, null, true);
            }
            this.enableDisableTbrBtn();
            if (parent.activeObj.redactType === 'blur') {
                const redactBlurElement: HTMLElement = parent.element.querySelector('#' + id + '_' + 'redactBlur') as HTMLElement;
                if (redactBlurElement) {
                    redactBlurElement.classList.add('e-selected-btn');
                }
            } else {
                const pixelateElement: HTMLElement = parent.element.querySelector('#' + id + '_' + 'pixelate') as HTMLElement;
                if (pixelateElement) {
                    pixelateElement.classList.add('e-selected-btn');
                }
            }
            this.redactSlider(parent.activeObj.redactType);
            break;
        }
        this.refreshDropDownBtn(isCropping);
        this.updateKBDNavigation(type);
        this.currToolbar = type;
    }

    private updateRedactObj(): void {
        const parent: ImageEditor = this.parent;
        const objColl: SelectionPoint[] = extend([], parent.objColl, [], true) as SelectionPoint[];
        parent.objColl = [];
        const activeObj: SelectionPoint = extend({}, parent.activeObj, {}, true) as SelectionPoint;
        parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false });
        parent.notify('draw', { prop: 'render-image', value: { isMouseWheel: null, isPreventClearRect: null, isFrame: true } });
        parent.objColl = objColl;
        for (let i: number = 0; i < parent.objColl.length; i++) {
            const obj: SelectionPoint = parent.objColl[i as number];
            if (obj.shape === 'redact') {
                obj.redactImage = parent.createElement('canvas');
                obj.redactImage.width = obj.activePoint.width;
                obj.redactImage.height = obj.activePoint.height;
                obj.redactImage.getContext('2d').drawImage(parent.lowerCanvas, obj.activePoint.startX,
                                                           obj.activePoint.startY, obj.activePoint.width, obj.activePoint.height, 0, 0,
                                                           obj.redactImage.width, obj.redactImage.height);
            }
        }
        parent.isCropTab = false;
        parent.notify('draw', { prop: 'render-image', value: { isMouseWheel: null, isPreventClearRect: null, isFrame: true } });
        parent.isCropTab = true;
        if (activeObj) {
            parent.notify('draw', { prop: 'drawObject', onPropertyChange: false, value: { canvas: 'duplicate', obj: activeObj,
                isCropRatio: null, points: null, isPreventDrag: true } });
        }
        const panMoveObj: Object = {panMove: null };
        parent.notify('transform', { prop: 'getPanMove', onPropertyChange: false,
            value: {obj: panMoveObj }});
        if (panMoveObj['panMove']) {
            parent.notify('transform', { prop: 'drawPannedImage', onPropertyChange: false,
                value: { xDiff: null, yDiff: null } });
        }
    }

    private updateKBDNavigation(type: string): void {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        if (!parent.isKBDNavigation || this.currToolbar === type) { return; }
        if (this.isToolbar()) {
            const tbar: Element = parent.element.querySelectorAll('#' + id + '_toolbar')[0];
            let tbarInitialChild: Element; let tbarInitialBtn: HTMLButtonElement;
            if (tbar) {
                tbarInitialChild = tbar.querySelector('.e-toolbar-center');
                if (!tbarInitialChild || !tbarInitialChild.children[0]) {
                    return;
                }
                tbarInitialBtn = tbarInitialChild.children[0].querySelector('.e-btn');
                let tempElem: Element = tbarInitialChild.children[1];
                if (tempElem) {
                    tempElem = tempElem.children[0];
                }
                if (tempElem) {
                    tempElem = tempElem.children[0];
                }
                if (type === 'resize' && tempElem) {
                    tbarInitialBtn = tempElem as HTMLButtonElement;
                }
                if (type === 'filter') {
                    const defaultFilter: HTMLElement = document.querySelector('#' + id + '_defaultCanvas') as HTMLElement;
                    if (defaultFilter) {
                        setTimeout(() => defaultFilter.focus(), 50);
                    }
                }
                if (tbarInitialBtn) {
                    if (type === 'main') {
                        setTimeout(() => tbarInitialBtn.focus(), 50);
                    } else {
                        tbarInitialBtn.focus();
                    }
                }
            }
        }
    }

    private performCropTransformClick(shape?: string, isTransform?: boolean): void {
        const parent: ImageEditor = this.parent;
        if (isNullOrUndefined(isTransform)) {
            parent.notify('draw', {prop: 'setTempStraightenZoomDeg' });
            parent.tempStraighten = parent.transform.straighten;
            if (parent.currObjType.isFiltered || parent.currObjType.isRedact) {parent.okBtn(); }
            parent.isStraightening = true;
        }
        this.refreshToolbar('croptransform', null, null, null, null, shape, isTransform);
        if (isNullOrUndefined(isTransform)) {
            parent.notify('draw', { prop: 'setDestForStraighten' });
            parent.notify('draw', { prop: 'setTempDestForStraighten' });
        }
    }

    private getAdjustmentToolbarItem(): ItemModel[] {
        const toolbarItems: ItemModel[] = []; const parent: ImageEditor = this.parent;
        let isCustomized: boolean = false; const id: string = parent.element.id;
        const defItems: string[] = ['Brightness', 'Contrast', 'Hue', 'Saturation', 'Exposure', 'Opacity', 'Blur'];
        if (parent.toolbar) {
            for (let i: number = 0; i < defItems.length; i++) {
                if (parent.toolbar.indexOf(defItems[i as number]) !== -1) {
                    isCustomized = true;
                    break;
                }
            }
        }
        if (isNullOrUndefined(parent.toolbar) || !isCustomized || (parent.toolbar && parent.toolbar.indexOf('Brightness') > -1)) {
            toolbarItems.push({ id: id + '_brightness', prefixIcon: 'e-icons e-brightness', cssClass: 'top-icon e-brightness',
                tooltipText: this.l10n.getConstant('Brightness'), align: 'Center' });
        }
        if (isNullOrUndefined(parent.toolbar) || !isCustomized || (parent.toolbar && parent.toolbar.indexOf('Contrast') > -1)) {
            toolbarItems.push({ id: id + '_contrast', prefixIcon: 'e-icons e-contrast', cssClass: 'top-icon e-contrast',
                tooltipText: this.l10n.getConstant('Contrast'), align: 'Center' });
        }
        if (isNullOrUndefined(parent.toolbar) || !isCustomized || (parent.toolbar && parent.toolbar.indexOf('Hue') > -1)) {
            toolbarItems.push({ id: id + '_hue', prefixIcon: 'e-icons e-fade', cssClass: 'top-icon e-fade',
                tooltipText: this.l10n.getConstant('Hue'), align: 'Center' });
        }
        if (isNullOrUndefined(parent.toolbar) || !isCustomized || (parent.toolbar && parent.toolbar.indexOf('Saturation') > -1)) {
            toolbarItems.push({ id: id + '_saturation', prefixIcon: 'e-icons e-saturation', cssClass: 'top-icon e-saturation',
                tooltipText: this.l10n.getConstant('Saturation'), align: 'Center' });
        }
        if (isNullOrUndefined(parent.toolbar) || !isCustomized || (parent.toolbar && parent.toolbar.indexOf('Exposure') > -1)) {
            toolbarItems.push({ id: id + '_exposure', prefixIcon: 'e-icons e-grain', cssClass: 'top-icon e-grain',
                tooltipText: this.l10n.getConstant('Exposure'), align: 'Center' });
        }
        if (isNullOrUndefined(parent.toolbar) || !isCustomized || (parent.toolbar && parent.toolbar.indexOf('Opacity') > -1)) {
            toolbarItems.push({ id: id + '_opacity', prefixIcon: 'e-icons e-opacity', cssClass: 'top-icon e-opacity',
                tooltipText: this.l10n.getConstant('Opacity'), align: 'Center' });
        }
        if (isNullOrUndefined(parent.toolbar) || !isCustomized || (parent.toolbar && parent.toolbar.indexOf('Blur') > -1)) {
            toolbarItems.push({ id: id + '_blur', prefixIcon: 'e-icons e-tint', cssClass: 'top-icon e-tint',
                tooltipText: this.l10n.getConstant('Blur'), align: 'Center' });
        }
        const tempToolbarItems: ItemModel[] = this.processToolbar('center');
        for (let i: number = 0, len: number = tempToolbarItems.length; i < len; i++) {
            toolbarItems.push(tempToolbarItems[i as number]);
        }
        if (!Browser.isDevice) {
            toolbarItems.push({ id: id + '_ok', prefixIcon: 'e-icons e-check', cssClass: 'top-icon e-tick',
                tooltipText: this.l10n.getConstant('OK'), align: 'Right', tabIndex: 0 });
            toolbarItems.push({ id: id + '_cancel', prefixIcon: 'e-icons e-close', cssClass: 'top-icon e-save',
                tooltipText: this.l10n.getConstant('Cancel'), align: 'Right' });
        }
        return toolbarItems;
    }

    private getFrameToolbarItem(): ItemModel[] {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        const toolbarItems: ItemModel[] = [];
        toolbarItems.push({ prefixIcon: 'e-icons e-copy', id: id + '_frameColor',
            cssClass: 'top-icon e-stroke', tooltipText: this.l10n.getConstant('Color'), align: 'Center', type: 'Input',
            template: '<span>' + this.l10n.getConstant('Color') + '</span><button id="' + id + '_frameColorBtn"></button>' });
        toolbarItems.push({ prefixIcon: 'e-icons e-copy', id: id + '_frameGradient',
            cssClass: 'top-icon e-frame-stroke', tooltipText: this.l10n.getConstant('GradientColor'), align: 'Center', type: 'Input',
            template: '<span>' + this.l10n.getConstant('GradientColor') + '</span><button id="' + id + '_frameGradientColorBtn"></button>' });
        toolbarItems.push({ id: id + '_frameSize', cssClass: 'top-icon e-size', tooltipText: this.l10n.getConstant('Size'), align: 'Center',
            type: 'Input', template: '<span>' + this.l10n.getConstant('Size') + '</span><button id="' + id + '_frameSizeBtn"></button>' });
        if (parent.frameObj.type === 'line' || parent.frameObj.type === 'inset' || parent.frameObj.type === 'hook') {
            toolbarItems.push({ id: id + '_frameInset', cssClass: 'top-icon e-size', tooltipText: this.l10n.getConstant('Inset'), align: 'Center',
                type: 'Input', template: '<span>' + this.l10n.getConstant('Inset') + '</span><button id="' + id + '_frameInsetBtn"></button>' });
        }
        if (parent.frameObj.type === 'line' || parent.frameObj.type === 'inset') {
            toolbarItems.push({ id: id + '_frameOffset', cssClass: 'top-icon e-size', tooltipText: this.l10n.getConstant('Offset'), align: 'Center',
                type: 'Input', template: '<span>' + this.l10n.getConstant('Offset') + '</span><button id="' + id + '_frameOffsetBtn"></button>' });
        }
        if (parent.frameObj.type === 'line') {
            toolbarItems.push({ id: id + '_frameRadius', cssClass: 'top-icon e-size', tooltipText: this.l10n.getConstant('Radius'), align: 'Center',
                type: 'Input', template: '<span>' + this.l10n.getConstant('Radius') + '</span><button id="' + id + '_frameRadiusBtn"></button>' });
            toolbarItems.push({ id: id + '_frameAmount', cssClass: 'top-icon e-size', tooltipText: this.l10n.getConstant('Amount'), align: 'Center',
                type: 'Input', template: '<span>' + this.l10n.getConstant('Amount') + '</span><button id="' + id + '_frameAmountBtn"></button>' });
            toolbarItems.push({ id: id + '_frameBorder', cssClass: 'top-icon e-size', tooltipText: this.l10n.getConstant('Border'), align: 'Center',
                type: 'Input', template: '<span>' + this.l10n.getConstant('Border') + '</span><button id="' + id + '_frameBorderBtn"></button>' });
        }
        return toolbarItems;
    }

    private getFilterToolbarItem(): ItemModel[] {
        const toolbarItems: ItemModel[] = []; const parent: ImageEditor = this.parent; let isCustomized: boolean = false;
        const id: string = parent.element.id;
        const defItems: string[] = ['Default', 'Chrome', 'Cold', 'Warm', 'Grayscale', 'Sepia', 'Invert'];
        if (parent.toolbar) {
            for (let i: number = 0; i < defItems.length; i++) {
                if (parent.toolbar.indexOf(defItems[i as number]) !== -1) {
                    isCustomized = true;
                    break;
                }
            }
        }
        if (isNullOrUndefined(parent.toolbar) || !isCustomized || (parent.toolbar && parent.toolbar.indexOf('Default') > -1)) {
            toolbarItems.push({ id: id + '_default', prefixIcon: 'e-icons e-none', cssClass: 'top-icon e-none',
                tooltipText: this.l10n.getConstant('Default'), align: 'Center',
                template: '<div class="filter-wrapper"><canvas id=' + id + '_defaultCanvas' + ' tabindex=0></canvas><div><span>' + this.l10n.getConstant('Default') + '</span></div></div>' });
        }
        if (isNullOrUndefined(parent.toolbar) || !isCustomized || (parent.toolbar && parent.toolbar.indexOf('Chrome') > -1)) {
            toolbarItems.push({ id: id + '_chrome', prefixIcon: 'e-icons e-none', cssClass: 'top-icon e-none',
                tooltipText: this.l10n.getConstant('Chrome'), align: 'Center',
                template: '<div class="filter-wrapper"><canvas id=' + id + '_chromeCanvas' + '></canvas><div><span>' + this.l10n.getConstant('Chrome') + '</span></div></div>' });
        }
        if (isNullOrUndefined(parent.toolbar) || !isCustomized || (parent.toolbar && parent.toolbar.indexOf('Cold') > -1)) {
            toolbarItems.push({ id: id + '_cold', prefixIcon: 'e-icons e-none', cssClass: 'top-icon e-none',
                tooltipText: this.l10n.getConstant('Cold'), align: 'Center',
                template: '<div class="filter-wrapper"><canvas id=' + id + '_coldCanvas' + '></canvas><div><span>' + this.l10n.getConstant('Cold') + '</span></div></div>' });
        }
        if (isNullOrUndefined(parent.toolbar) || !isCustomized || (parent.toolbar && parent.toolbar.indexOf('Warm') > -1)) {
            toolbarItems.push({ id: id + '_warm', prefixIcon: 'e-icons e-none', cssClass: 'top-icon e-none',
                tooltipText: this.l10n.getConstant('Warm'), align: 'Center',
                template: '<div class="filter-wrapper"><canvas id=' + id + '_warmCanvas' + '></canvas><div><span>' + this.l10n.getConstant('Warm') + '</span></div></div>' });
        }
        if (isNullOrUndefined(parent.toolbar) || !isCustomized || (parent.toolbar && parent.toolbar.indexOf('Grayscale') > -1)) {
            toolbarItems.push({ id: id + '_grayscale', prefixIcon: 'e-icons e-none', cssClass: 'top-icon e-none',
                tooltipText: this.l10n.getConstant('Grayscale'), align: 'Center',
                template: '<div class="filter-wrapper"><canvas id=' + id + '_grayscaleCanvas' + '></canvas><div><span>' + this.l10n.getConstant('Grayscale') + '</span></div></div>' });
        }
        if (isNullOrUndefined(parent.toolbar) || !isCustomized || (parent.toolbar && parent.toolbar.indexOf('Sepia') > -1)) {
            toolbarItems.push({ id: id + '_sepia', prefixIcon: 'e-icons e-none', cssClass: 'top-icon e-none',
                tooltipText: this.l10n.getConstant('Sepia'), align: 'Center',
                template: '<div class="filter-wrapper"><canvas id=' + id + '_sepiaCanvas' + '></canvas><div><span>' + this.l10n.getConstant('Sepia') + '</span></div></div>' });
        }
        if (isNullOrUndefined(parent.toolbar) || !isCustomized || (parent.toolbar && parent.toolbar.indexOf('Invert') > -1)) {
            toolbarItems.push({ id: id + '_invert', prefixIcon: 'e-icons e-none', cssClass: 'top-icon e-none',
                tooltipText: this.l10n.getConstant('Invert'), align: 'Center',
                template: '<div class="filter-wrapper"><canvas id=' + id + '_invertCanvas' + '></canvas><div><span>' + this.l10n.getConstant('Invert') + '</span></div></div>' });
        }
        const tempToolbarItems: ItemModel[] = this.processToolbar('center');
        for (let i: number = 0, len: number = tempToolbarItems.length; i < len; i++) {
            toolbarItems.push(tempToolbarItems[i as number]);
        }
        return toolbarItems;
    }

    private getPenToolbarItem(items: (string | ItemModel)[]): ItemModel[] {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        const toolbarItems: ItemModel[] = [];
        if (isNullOrUndefined(parent.toolbar) || parent.toolbar) {
            toolbarItems.push({ id: id + '_annotation', tooltipText: this.l10n.getConstant('Annotation'), align: 'Center',
                template: '<button id="' + id + '_annotationBtn"></button>' });
        }
        if (items.indexOf('strokeColor') > -1) {
            toolbarItems.push({ prefixIcon: 'e-icons e-copy', id: id + '_pen_strokecolor',
                cssClass: 'top-icon e-pen-stroke-color',
                tooltipText: this.l10n.getConstant('StrokeColor'), align: 'Center', type: 'Input',
                template: '<button id="' + id + '_penColorBtn"></button>' });
        }
        if (items.indexOf('strokeWidth') > -1) {
            toolbarItems.push({ prefixIcon: 'e-icons e-copy', id: id + '_pen_strokewidth',
                cssClass: 'top-icon e-size',
                tooltipText: this.l10n.getConstant('StrokeWidth'),
                align: 'Center', type: 'Input', template: '<button id="' + id + '_penStrokeWidth"></button>' });
        }
        toolbarItems.push({ align: 'Center', type: 'Separator' });
        if (items.indexOf('z-order') > -1) {
            toolbarItems.push({ id: id + '_zOrder', cssClass: 'top-icon e-list-unordered-3', tooltipText: this.l10n.getConstant('ZOrder'), align: 'Center',
                type: 'Input', template: '<button id="' + id + '_zOrderBtn"></button>' });
        }
        if (items.indexOf('remove') > -1) {
            toolbarItems.push({ id: id + '_remove', prefixIcon: 'e-icons e-trash', cssClass: 'top-icon e-trash',
                tooltipText: this.l10n.getConstant('Remove'), align: 'Center' });
        }
        const tempToolbarItems: ItemModel[] = this.processSubToolbar(items);
        for (let i: number = 0, len: number = tempToolbarItems.length; i < len; i++) {
            toolbarItems.push(tempToolbarItems[i as number]);
        }
        if (!Browser.isDevice) {
            toolbarItems.push({ id: id + '_ok', prefixIcon: 'e-icons e-check', cssClass: 'top-icon e-tick',
                tooltipText: this.l10n.getConstant('OK'), align: 'Right', tabIndex: 0 });
            toolbarItems.push({ id: id + '_cancel', prefixIcon: 'e-icons e-close', cssClass: 'top-icon e-save',
                tooltipText: this.l10n.getConstant('Cancel'), align: 'Right' });
        }
        return toolbarItems;
    }

    private initPenToolbarItem(items: (string | ItemModel)[]): void {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        const leftItem: ItemModel[] = this.getLeftToolbarItem();
        const rightItem: ItemModel[] = this.getRightToolbarItem();
        const mainItem: ItemModel[] = this.getPenToolbarItem(items);
        const zoomItem: ItemModel[] = this.getZoomToolbarItem();
        if (Browser.isDevice) {
            this.defToolbarItems = mainItem;
        } else {
            this.defToolbarItems = [...leftItem, ...zoomItem, ...mainItem, ...rightItem];
        }
        const args: ToolbarEventArgs = {toolbarType: 'pen', toolbarItems: this.defToolbarItems };
        parent.trigger('toolbarUpdating', args);
        if (this.isToolbarString(args.toolbarItems)) {
            items = args.toolbarItems;
            this.excludeItems(args.toolbarItems);
        } else {
            this.defToolbarItems = args.toolbarItems as ItemModel[];
        }
        const toolbar: Toolbar = new Toolbar({
            width: '100%',
            items: this.defToolbarItems,
            clicked: this.defToolbarClicked.bind(this),
            created: () => {
                this.renderAnnotationBtn(true);
                this.createPenColor(items);
                this.createPenBtn(items);
                this.createZOrderBtn(items);
                this.wireZoomBtnEvents();
                parent.trigger('toolbarCreated', {toolbarType: 'pen'});
                if (Browser.isDevice) {
                    if (this.defToolbarItems.length > 0 && document.getElementById(id + '_toolbar')) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        (toolbar as any).refreshOverflow(); (toolbar as any).refreshOverflow();
                    }
                } else {
                    this.createLeftToolbarControls();
                    if (this.defToolbarItems.length > 0 && document.getElementById(id + '_toolbar')) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        (toolbar as any).refreshOverflow();
                    }
                }
            }
        });
        if (Browser.isDevice) {
            toolbar.appendTo('#' + id + '_bottomToolbar');
        } else {
            toolbar.appendTo('#' + id + '_toolbar');
        }
        this.enableDisableTbrBtn();
    }

    private createPenColor(items: (string | ItemModel)[]): void {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        if (items.indexOf('strokeColor') > -1) {
            parent.element.querySelector('.e-template.e-pen-stroke-color').appendChild(parent.createElement('input', {
                id: id + '_pen_stroke'
            }));
            const presentVal: string = parent.activeObj.strokeSettings.strokeColor;
            const penColor: ColorPicker = new ColorPicker({
                modeSwitcher: false, value: '#fff',
                showButtons: false, mode: 'Palette', cssClass: 'e-pen-color',
                change: (args: ColorPickerEventArgs): void => {
                    parent.updatePenStrokeColor(args.currentValue.hex);
                    this.selFhdColor = args.currentValue.hex;
                    (strokeDDB.element.children[0] as HTMLElement).style.backgroundColor = args.currentValue.rgba;
                    strokeDDB.toggle();
                    parent.notify('undo-redo', { prop: 'updateUndoRedoStack', value: { isPenDraw: true }});
                }
            }, '#' + id + '_pen_stroke');
            const strokeDDB: DropDownButton = new DropDownButton({
                open: (args: OpenCloseMenuEventArgs) => {
                    const parentElem: HTMLElement = args.element.parentElement;
                    if (Browser.isDevice) {
                        parentElem.style.top = strokeDDB.element.getBoundingClientRect().top -
                        parentElem.offsetHeight + 'px';
                        if (window.innerWidth <= 520) { parentElem.style.left = parent.element.offsetLeft + 'px'; }
                    }
                },
                target: '.e-pen-color',
                iconCss: 'e-dropdownbtn-preview',
                cssClass: 'e-ie-ddb-popup'
            }, '#' + id + '_penColorBtn');
            penColor.inline = true;
            penColor.value = penColor.getValue(parent.activeObj.strokeSettings.strokeColor, 'rgba');
            if (penColor.value === 'null') { penColor.value = presentVal; }
            const obj: Object = {tempFreeHandDrawEditingStyles: null };
            parent.notify('freehand-draw', {prop: 'getTempFreeHandDrawEditingStyles', value: {obj: obj }});
            const indexObj: Object = {freehandSelectedIndex: null };
            parent.notify('freehand-draw', {prop: 'getFreehandSelectedIndex', onPropertyChange: false, value: {obj: indexObj }});
            if (!isNullOrUndefined(indexObj['freehandSelectedIndex']) && indexObj['freehandSelectedIndex'] > -1) {
                (parent.element.querySelector('.e-pen-stroke-color.e-template .e-dropdownbtn-preview') as HTMLElement).style.background
                = this.selFhdColor === '#42a5f5' ? obj['tempFreeHandDrawEditingStyles'].strokeColor :
                        parent.pointColl[indexObj['freehandSelectedIndex']].strokeColor;
            } else {
                (parent.element.querySelector('.e-pen-stroke-color.e-template .e-dropdownbtn-preview') as HTMLElement).style.background
                = penColor.value;
            }
        }
    }

    private createPenBtn(items: (string | ItemModel)[]): void {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        const strokeWidthItems: DropDownButtonItemModel[] = [
            { id: '1', text: this.l10n.getConstant('XSmall') },
            { id: '2', text: this.l10n.getConstant('Small') },
            { id: '3', text: this.l10n.getConstant('Medium') },
            { id: '4', text: this.l10n.getConstant('Large') },
            { id: '5', text: this.l10n.getConstant('XLarge') }
        ];
        if (items.indexOf('strokeWidth') > -1) {
            const strokeWidthBtn: HTMLElement = document.getElementById(id + '_penStrokeWidth');
            const spanElem: HTMLElement = document.createElement('span');
            const indexObj: Object = {freehandSelectedIndex: null };
            parent.notify('freehand-draw', {prop: 'getFreehandSelectedIndex', onPropertyChange: false, value: {obj: indexObj }});
            if (!isNullOrUndefined(indexObj['freehandSelectedIndex']) && indexObj['freehandSelectedIndex'] > -1) {
                spanElem.innerHTML = this.getPenStroke(parent.pointColl[indexObj['freehandSelectedIndex']].strokeWidth);
            } else {
                const obj: Object = {penStrokeWidth: 2 };
                parent.notify('freehand-draw', {prop: 'getPenStrokeWidth', onPropertyChange: false, value: {obj: obj }});
                if (obj['penStrokeWidth']) {
                    spanElem.innerHTML = this.getPenStroke(obj['penStrokeWidth']);
                } else {
                    spanElem.innerHTML = this.l10n.getConstant('Small');
                }
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
                    this.triggerTbarClickEvent(args);
                    spanElem.textContent = args.item.text;
                    parent.updatePenStrokeWidth(args.item.id);
                    if (Browser.isDevice) {
                        if (document.getElementById(id + '_bottomToolbar')) {
                            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                            const toolbar: any = getComponent(id + '_bottomToolbar', 'toolbar') as Toolbar;
                            toolbar.refreshOverflow();
                        }
                    } else {
                        if (document.getElementById(id + '_toolbar')) {
                            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                            const toolbar: any = getComponent(id + '_toolbar', 'toolbar') as Toolbar;
                            toolbar.refreshOverflow();
                        }
                    }
                    const widthObj: Object = {penStrokeWidth: null };
                    parent.notify('freehand-draw', {prop: 'getPenStrokeWidth', onPropertyChange: false, value: {obj: widthObj }});
                    parent.notify('undo-redo', { prop: 'updateUndoRedoStack', value: { isPenDraw: true }});
                    parent.notify('freehand-draw', {prop: 'setPenStrokeWidth', onPropertyChange: false, value: {value: widthObj['penStrokeWidth'] }});
                }
            });
            // Render initialized DropDownButton.
            drpDownBtn.appendTo('#' + id + '_penStrokeWidth');
        }
    }

    private getPenStroke(value: number): string {
        let textContent: string = '';
        const valueToTextContent: object = {
            1: this.l10n.getConstant('XSmall'),
            2: this.l10n.getConstant('Small'),
            3: this.l10n.getConstant('Medium'),
            4: this.l10n.getConstant('Large'),
            5: this.l10n.getConstant('XLarge')
        };
        if (value >= 1 && value <= 5) {
            textContent = valueToTextContent[value as number];
        }
        return textContent;
    }

    private initAdjustmentToolbarItem(): void {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        const leftItem: ItemModel[] = this.getLeftToolbarItem(null);
        const rightItem: ItemModel[] = this.getRightToolbarItem();
        const mainItem: ItemModel[] = this.getAdjustmentToolbarItem();
        const zoomItem: ItemModel[] = this.getZoomToolbarItem();
        if (Browser.isDevice) {
            this.defToolbarItems = mainItem;
        } else {
            this.defToolbarItems = [...leftItem, ...zoomItem, ...mainItem, ...rightItem];
        }
        const args: ToolbarEventArgs = {toolbarType: 'finetune', toolbarItems: this.defToolbarItems };
        parent.trigger('toolbarUpdating', args);
        this.defToolbarItems = args.toolbarItems as ItemModel[];
        const toolbar: Toolbar = new Toolbar({
            width: '100%',
            items: this.defToolbarItems,
            clicked: this.defToolbarClicked.bind(this),
            created: () => {
                this.wireZoomBtnEvents();
                if (Browser.isDevice) {
                    if (this.defToolbarItems.length > 0 && document.getElementById(id + '_toolbar')) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        (toolbar as any).refreshOverflow();
                    }
                } else {
                    this.createLeftToolbarControls();
                    if (this.defToolbarItems.length > 0 && document.getElementById(id + '_toolbar')) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        (toolbar as any).refreshOverflow();
                    }
                }
            }
        });
        if (Browser.isDevice) {
            toolbar.appendTo('#' + id + '_bottomToolbar');
        } else {
            toolbar.appendTo('#' + id + '_toolbar');
        }
        this.enableDisableTbrBtn();
    }

    private initFrameToolbarItem(): void {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        const canvasWrapper: HTMLElement = document.querySelector('#' + id + '_contextualToolbarArea');
        let frameWrapper: HTMLElement = document.querySelector('#' + id + '_frameWrapper');
        if (frameWrapper) {
            frameWrapper.style.display = 'block';
        } else {
            frameWrapper = canvasWrapper.appendChild(parent.createElement('div', {
                id: id + '_frameWrapper', className: 'e-frame-wrapper', styles: 'position: relative'
            }));
        }
        frameWrapper.appendChild(parent.createElement('div', {
            id: id + '_customizeWrapper',
            styles: 'position: absolute'
        }));
        let mainItem: ItemModel[] = this.getFrameToolbarItem();
        const args: ToolbarEventArgs = {toolbarType: 'frame', toolbarItems: mainItem };
        parent.trigger('toolbarUpdating', args);
        mainItem = args.toolbarItems as ItemModel[];
        const toolbar: Toolbar = new Toolbar({
            width: '100%',
            items: mainItem,
            clicked: this.defToolbarClicked.bind(this),
            created: () => {
                this.createFrameColor();
                this.createFrameSize();
                const frameType: string = parent.frameObj.type;
                if (frameType === 'line') {
                    this.createFrameRadius();
                }
                if (frameType === 'line' || frameType === 'inset' || frameType === 'hook') {
                    this.createFrameInset();
                }
                if (frameType === 'line' || frameType === 'inset') {
                    this.createFrameOffset();
                }
                if (frameType === 'line') {
                    this.createFrameAmount();
                    this.createFrameBorder();
                }
                this.createFrameGradientColor();
                if (Browser.isDevice) {
                    if (this.defToolbarItems.length > 0 && document.getElementById(id + '_bottomToolbar')) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        (toolbar as any).refreshOverflow(); (toolbar as any).refreshOverflow(); (toolbar as any).refreshOverflow();
                    }
                } else {
                    this.createLeftToolbarControls();
                    if (this.defToolbarItems.length > 0 && document.getElementById(id + '_toolbar')) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        (toolbar as any).refreshOverflow();
                    }
                }
                (parent.element.querySelector('#' + id + '_' + frameType) as HTMLElement).focus();
            }
        });
        toolbar.appendTo('#' + id + '_customizeWrapper');
    }

    private createFrameGradientColor(): void {
        const parent: ImageEditor = this.parent; let prevFrameSettings: FrameSettings; const obj: Object = {frameChangeEventArgs: null };
        const id: string = parent.element.id;
        parent.element.querySelector('.e-template.e-frame-stroke').appendChild(parent.createElement('input', {
            id: id + '_frame_gradient_fill'
        }));
        const fillColor: ColorPicker = new ColorPicker({
            modeSwitcher: false, noColor: true, value: parent.frameObj.gradientColor,
            showButtons: false, mode: 'Palette', cssClass: 'e-frame-gradient-fill-color',
            change: (args: ColorPickerEventArgs): void => {
                prevFrameSettings = {type: parent.toPascalCase(parent.frameObj.type) as FrameType, color: parent.frameObj.color,
                    gradientColor: parent.frameObj.gradientColor, size: parent.frameObj.size, inset: parent.frameObj.inset,
                    offset: parent.frameObj.offset, borderRadius: parent.frameObj.radius,
                    frameLineStyle: parent.toPascalCase(parent.frameObj.border) as FrameLineStyle, lineCount: parent.frameObj.amount};
                const temp: string = parent.frameObj.gradientColor;
                const object: Object = {currObj: {} as CurrentObject };
                parent.notify('filter', { prop: 'getCurrentObj', onPropertyChange: false, value: {object: object }});
                parent.frameObj.gradientColor = args.currentValue.hex;
                parent.notify('draw', { prop: 'triggerFrameChange', value: { prevFrameSettings: prevFrameSettings, obj: obj }});
                if (obj['frameChangeEventArgs'] && !obj['frameChangeEventArgs'].cancel) {
                    parent.notify('undo-redo', {prop: 'updateUndoRedoColl', onPropertyChange: false, value: {
                        operation: 'frame', previousObj: object['currObj'], previousObjColl: object['currObj']['objColl'],
                        previousPointColl: object['currObj']['pointColl'], previousSelPointColl: object['currObj']['selPointColl'],
                        previousCropObj: extend({}, parent.cropObj, {}, true) as CurrentObject, previousText: null, currentText: null,
                        previousFilter: null, isCircleCrop: null }});
                    parent.notify('draw', { prop: 'render-image', value: { isMouseWheel: null, isPreventClearRect: null, isFrame: true } });
                    parent.notify('draw', { prop: 'redrawDownScale' });
                    if (args.currentValue.rgba === '') {
                        (fillDDB.element.children[0] as HTMLElement).classList.add('e-nocolor-item');
                    } else {
                        (fillDDB.element.children[0] as HTMLElement).classList.remove('e-nocolor-item');
                        (fillDDB.element.children[0] as HTMLElement).style.backgroundColor = args.currentValue.rgba;
                    }
                    parent.curFrameObjEvent = {previousFrameSetting: obj['frameChangeEventArgs'].previousFrameSetting,
                        currentFrameSetting: obj['frameChangeEventArgs'].currentFrameSetting };
                    parent.isFrameBtnClick = true;
                } else {
                    parent.frameObj.gradientColor = temp;
                }
                fillDDB.toggle();
            }
        }, '#' + id + '_frame_gradient_fill');
        const fillDDB: DropDownButton = new DropDownButton({
            open: (args: OpenCloseMenuEventArgs) => {
                if (Browser.isDevice) {
                    const parentElem: HTMLElement = args.element.parentElement;
                    parentElem.style.top = fillDDB.element.getBoundingClientRect().top -
                    parentElem.offsetHeight + 'px';
                    if (window.innerWidth <= 520) { parentElem.style.left = parent.element.offsetLeft + 'px'; }
                }
            },
            target: '.e-frame-gradient-fill-color',
            iconCss: 'e-dropdownbtn-preview',
            cssClass: 'e-ie-ddb-popup'
        }, '#' + id + '_frameGradientColorBtn');
        fillColor.inline = true;
        if (parent.frameObj.gradientColor === '') {
            parent.element.querySelector('.e-frame-stroke.e-template .e-dropdownbtn-preview').classList.add('e-nocolor-item');
        } else {
            (parent.element.querySelector('.e-frame-stroke.e-template .e-dropdownbtn-preview') as HTMLElement).style.background
            = parent.frameObj.gradientColor;
        }
    }

    private createFrameColor(): void {
        const parent: ImageEditor = this.parent; let prevFrameSettings: FrameSettings; const obj: Object = {frameChangeEventArgs: null };
        const id: string = parent.element.id;
        parent.element.querySelector('.e-template.e-stroke').appendChild(parent.createElement('input', {
            id: id + '_frame_fill'
        }));
        const fillColor: ColorPicker = new ColorPicker({
            modeSwitcher: false, value: parent.frameObj.color,
            showButtons: false, mode: 'Palette', cssClass: 'e-frame-fill-color',
            change: (args: ColorPickerEventArgs): void => {
                prevFrameSettings = {type: parent.toPascalCase(parent.frameObj.type) as FrameType, color: parent.frameObj.color,
                    gradientColor: parent.frameObj.gradientColor, size: parent.frameObj.size, inset: parent.frameObj.inset,
                    offset: parent.frameObj.offset, borderRadius: parent.frameObj.radius,
                    frameLineStyle: parent.toPascalCase(parent.frameObj.border) as FrameLineStyle, lineCount: parent.frameObj.amount};
                const temp: string = parent.frameObj.color;
                const object: Object = {currObj: {} as CurrentObject };
                parent.notify('filter', { prop: 'getCurrentObj', onPropertyChange: false, value: {object: object }});
                parent.frameObj.color = args.currentValue.hex;
                parent.notify('draw', { prop: 'triggerFrameChange', value: { prevFrameSettings: prevFrameSettings, obj: obj }});
                if (obj['frameChangeEventArgs'] && !obj['frameChangeEventArgs'].cancel) {
                    parent.notify('undo-redo', {prop: 'updateUndoRedoColl', onPropertyChange: false, value: {
                        operation: 'frame', previousObj: object['currObj'], previousObjColl: object['currObj']['objColl'],
                        previousPointColl: object['currObj']['pointColl'], previousSelPointColl: object['currObj']['selPointColl'],
                        previousCropObj: extend({}, parent.cropObj, {}, true) as CurrentObject, previousText: null, currentText: null,
                        previousFilter: null, isCircleCrop: null }});
                    parent.notify('draw', { prop: 'render-image', value: { isMouseWheel: null, isPreventClearRect: null, isFrame: true } });
                    parent.notify('draw', { prop: 'redrawDownScale' });
                    if (args.currentValue.rgba === '') {
                        (fillDDB.element.children[0] as HTMLElement).classList.add('e-nocolor-item');
                    } else {
                        (fillDDB.element.children[0] as HTMLElement).classList.remove('e-nocolor-item');
                        (fillDDB.element.children[0] as HTMLElement).style.backgroundColor = args.currentValue.rgba;
                    }
                    parent.curFrameObjEvent = {previousFrameSetting: obj['frameChangeEventArgs'].previousFrameSetting,
                        currentFrameSetting: obj['frameChangeEventArgs'].currentFrameSetting };
                    parent.isFrameBtnClick = true;
                } else {
                    parent.frameObj.color = temp;
                }
                fillDDB.toggle();
            }
        }, '#' + id + '_frame_fill');
        const fillDDB: DropDownButton = new DropDownButton({
            open: (args: OpenCloseMenuEventArgs) => {
                if (Browser.isDevice) {
                    const parentElem: HTMLElement = args.element.parentElement;
                    parentElem.style.top = fillDDB.element.getBoundingClientRect().top -
                    parentElem.offsetHeight + 'px';
                    if (window.innerWidth <= 520) { parentElem.style.left = parent.element.offsetLeft + 'px'; }
                }
            },
            target: '.e-frame-fill-color',
            iconCss: 'e-dropdownbtn-preview',
            cssClass: 'e-ie-ddb-popup'
        }, '#' + id + '_frameColorBtn');
        fillColor.inline = true;
        (parent.element.querySelector('.e-stroke.e-template .e-dropdownbtn-preview') as HTMLElement).style.background = parent.frameObj.color;
    }

    private createFrameSize(): void {
        const parent: ImageEditor = this.parent; let prevFrameSettings: FrameSettings; const obj: Object = {frameChangeEventArgs: null };
        const id: string = parent.element.id;
        const strokeWidthItems: DropDownButtonItemModel[] = [
            { id: '1', text: this.l10n.getConstant('20') },
            { id: '2', text: this.l10n.getConstant('40') },
            { id: '3', text: this.l10n.getConstant('60') },
            { id: '4', text: this.l10n.getConstant('80') },
            { id: '5', text: this.l10n.getConstant('100') }
        ];
        const strokeWidthBtn: HTMLElement = document.getElementById(id + '_frameSizeBtn');
        const spanElem: HTMLElement = document.createElement('span');
        spanElem.innerHTML = this.l10n.getConstant(parent.frameObj.size.toString());
        spanElem.className = 'e-frame-stroke-width';
        strokeWidthBtn.appendChild(spanElem);
        // Initialize the DropDownButton component.
        const drpDownBtn: DropDownButton = new DropDownButton({ items: strokeWidthItems,
            open: (args: OpenCloseMenuEventArgs) => {
                if (Browser.isDevice) {
                    const parentElem: HTMLElement = args.element.parentElement;
                    parentElem.style.top = drpDownBtn.element.getBoundingClientRect().top -
                    parentElem.offsetHeight + 'px';
                }
                const activeBtn: string = drpDownBtn.element.childNodes[0].textContent;
                if (activeBtn !== '') {
                    args.element.querySelector('[aria-label = ' + '"' + activeBtn + '"' + ']').classList.add('e-selected-btn');
                }
            },
            select: (args: MenuEventArgs) => {
                this.triggerTbarClickEvent(args);
                prevFrameSettings = {type: parent.toPascalCase(parent.frameObj.type) as FrameType, color: parent.frameObj.color,
                    gradientColor: parent.frameObj.gradientColor, size: parent.frameObj.size, inset: parent.frameObj.inset,
                    offset: parent.frameObj.offset, borderRadius: parent.frameObj.radius,
                    frameLineStyle: parent.toPascalCase(parent.frameObj.border) as FrameLineStyle, lineCount: parent.frameObj.amount};
                const temp: number = parent.frameObj.size;
                const object: Object = {currObj: {} as CurrentObject };
                parent.notify('filter', { prop: 'getCurrentObj', onPropertyChange: false, value: {object: object }});
                parent.frameObj.size = parseInt(args.item.text, 10);
                parent.notify('draw', { prop: 'triggerFrameChange', value: { prevFrameSettings: prevFrameSettings, obj: obj }});
                if (obj['frameChangeEventArgs'] && !obj['frameChangeEventArgs'].cancel) {
                    parent.notify('undo-redo', {prop: 'updateUndoRedoColl', onPropertyChange: false, value: {
                        operation: 'frame', previousObj: object['currObj'], previousObjColl: object['currObj']['objColl'],
                        previousPointColl: object['currObj']['pointColl'], previousSelPointColl: object['currObj']['selPointColl'],
                        previousCropObj: extend({}, parent.cropObj, {}, true) as CurrentObject, previousText: null, currentText: null,
                        previousFilter: null, isCircleCrop: null }});
                    parent.notify('draw', { prop: 'render-image', value: { isMouseWheel: null, isPreventClearRect: null, isFrame: true } });
                    parent.notify('draw', { prop: 'redrawDownScale' });
                    drpDownBtn.content = args.item.text;
                    parent.curFrameObjEvent = {previousFrameSetting: obj['frameChangeEventArgs'].previousFrameSetting,
                        currentFrameSetting: obj['frameChangeEventArgs'].currentFrameSetting };
                    parent.isFrameBtnClick = true;
                } else {
                    parent.frameObj.size = temp;
                }
                if (Browser.isDevice) {
                    if (document.getElementById(id + '_bottomToolbar')) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        const toolbar: any = getComponent(id + '_bottomToolbar', 'toolbar') as Toolbar;
                        toolbar.refreshOverflow();
                    }
                } else {
                    if (document.getElementById(id + '_toolbar')) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        const toolbar: any = getComponent(id + '_toolbar', 'toolbar') as Toolbar;
                        toolbar.refreshOverflow();
                    }
                }
            }
        });
        // Render initialized DropDownButton.
        drpDownBtn.appendTo('#' + id + '_frameSizeBtn');
    }

    private createFrameInset(): void {
        const parent: ImageEditor = this.parent; let prevFrameSettings: FrameSettings; const obj: Object = {frameChangeEventArgs: null };
        const id: string = parent.element.id;
        const strokeWidthItems: DropDownButtonItemModel[] = [
            { id: '1', text: this.l10n.getConstant('20') },
            { id: '2', text: this.l10n.getConstant('40') },
            { id: '3', text: this.l10n.getConstant('60') },
            { id: '4', text: this.l10n.getConstant('80') },
            { id: '5', text: this.l10n.getConstant('100') }
        ];
        const strokeWidthBtn: HTMLElement = document.getElementById(id + '_frameInsetBtn');
        const spanElem: HTMLElement = document.createElement('span');
        spanElem.innerHTML = this.l10n.getConstant(parent.frameObj.inset.toString());
        spanElem.className = 'e-frame-inset';
        strokeWidthBtn.appendChild(spanElem);
        // Initialize the DropDownButton component.
        const drpDownBtn: DropDownButton = new DropDownButton({ items: strokeWidthItems,
            open: (args: OpenCloseMenuEventArgs) => {
                if (Browser.isDevice) {
                    const parentElem: HTMLElement = args.element.parentElement;
                    parentElem.style.top = drpDownBtn.element.getBoundingClientRect().top -
                    parentElem.offsetHeight + 'px';
                }
                const activeBtn: string = drpDownBtn.element.childNodes[0].textContent;
                if (activeBtn !== '') {
                    args.element.querySelector('[aria-label = ' + '"' + activeBtn + '"' + ']').classList.add('e-selected-btn');
                }
            },
            select: (args: MenuEventArgs) => {
                this.triggerTbarClickEvent(args);
                prevFrameSettings = {type: parent.toPascalCase(parent.frameObj.type) as FrameType, color: parent.frameObj.color,
                    gradientColor: parent.frameObj.gradientColor, size: parent.frameObj.size, inset: parent.frameObj.inset,
                    offset: parent.frameObj.offset, borderRadius: parent.frameObj.radius,
                    frameLineStyle: parent.toPascalCase(parent.frameObj.border) as FrameLineStyle, lineCount: parent.frameObj.amount};
                const temp: number = parent.frameObj.inset;
                const object: Object = {currObj: {} as CurrentObject };
                parent.notify('filter', { prop: 'getCurrentObj', onPropertyChange: false, value: {object: object }});
                parent.frameObj.inset = parseInt(args.item.text, 10);
                parent.notify('draw', { prop: 'triggerFrameChange', value: { prevFrameSettings: prevFrameSettings, obj: obj }});
                if (obj['frameChangeEventArgs'] && !obj['frameChangeEventArgs'].cancel) {
                    parent.notify('undo-redo', {prop: 'updateUndoRedoColl', onPropertyChange: false, value: {
                        operation: 'frame', previousObj: object['currObj'], previousObjColl: object['currObj']['objColl'],
                        previousPointColl: object['currObj']['pointColl'], previousSelPointColl: object['currObj']['selPointColl'],
                        previousCropObj: extend({}, parent.cropObj, {}, true) as CurrentObject, previousText: null, currentText: null,
                        previousFilter: null, isCircleCrop: null }});
                    parent.notify('draw', { prop: 'render-image', value: { isMouseWheel: null, isPreventClearRect: null, isFrame: true } });
                    parent.notify('draw', { prop: 'redrawDownScale' });
                    drpDownBtn.content = args.item.text;
                    parent.curFrameObjEvent = {previousFrameSetting: obj['frameChangeEventArgs'].previousFrameSetting,
                        currentFrameSetting: obj['frameChangeEventArgs'].currentFrameSetting };
                    parent.isFrameBtnClick = true;
                } else {
                    parent.frameObj.inset = temp;
                }
                if (Browser.isDevice) {
                    if (document.getElementById(id + '_bottomToolbar')) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        const toolbar: any = getComponent(id + '_bottomToolbar', 'toolbar') as Toolbar;
                        toolbar.refreshOverflow();
                    }
                } else {
                    if (document.getElementById(id + '_toolbar')) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        const toolbar: any = getComponent(id + '_toolbar', 'toolbar') as Toolbar;
                        toolbar.refreshOverflow();
                    }
                }
            }
        });
        // Render initialized DropDownButton.
        drpDownBtn.appendTo('#' + id + '_frameInsetBtn');
    }

    private createFrameOffset(): void {
        const parent: ImageEditor = this.parent; let prevFrameSettings: FrameSettings; const obj: Object = {frameChangeEventArgs: null };
        const id: string = parent.element.id;
        const strokeWidthItems: DropDownButtonItemModel[] = [
            { id: '1', text: this.l10n.getConstant('20') },
            { id: '2', text: this.l10n.getConstant('40') },
            { id: '3', text: this.l10n.getConstant('60') },
            { id: '4', text: this.l10n.getConstant('80') },
            { id: '5', text: this.l10n.getConstant('100') }
        ];
        const strokeWidthBtn: HTMLElement = document.getElementById(id + '_frameOffsetBtn');
        const spanElem: HTMLElement = document.createElement('span');
        spanElem.innerHTML = this.l10n.getConstant(parent.frameObj.offset.toString());
        spanElem.className = 'e-frame-offset';
        strokeWidthBtn.appendChild(spanElem);
        // Initialize the DropDownButton component.
        const drpDownBtn: DropDownButton = new DropDownButton({ items: strokeWidthItems,
            open: (args: OpenCloseMenuEventArgs) => {
                if (Browser.isDevice) {
                    const parentElem: HTMLElement = args.element.parentElement;
                    parentElem.style.top = drpDownBtn.element.getBoundingClientRect().top -
                    parentElem.offsetHeight + 'px';
                }
                const activeBtn: string = drpDownBtn.element.childNodes[0].textContent;
                if (activeBtn !== '') {
                    args.element.querySelector('[aria-label = ' + '"' + activeBtn + '"' + ']').classList.add('e-selected-btn');
                }
            },
            select: (args: MenuEventArgs) => {
                this.triggerTbarClickEvent(args);
                prevFrameSettings = {type: parent.toPascalCase(parent.frameObj.type) as FrameType, color: parent.frameObj.color,
                    gradientColor: parent.frameObj.gradientColor, size: parent.frameObj.size, inset: parent.frameObj.inset,
                    offset: parent.frameObj.offset, borderRadius: parent.frameObj.radius,
                    lineCount: parent.frameObj.amount, frameLineStyle: parent.toPascalCase(parent.frameObj.border) as FrameLineStyle };
                const temp: number = parent.frameObj.offset;
                const object: Object = {currObj: {} as CurrentObject };
                parent.notify('filter', { prop: 'getCurrentObj', onPropertyChange: false, value: {object: object }});
                parent.frameObj.offset = parseInt(args.item.text, 10);
                parent.notify('draw', { prop: 'triggerFrameChange', value: { prevFrameSettings: prevFrameSettings, obj: obj }});
                if (obj['frameChangeEventArgs'] && !obj['frameChangeEventArgs'].cancel) {
                    parent.notify('undo-redo', {prop: 'updateUndoRedoColl', onPropertyChange: false, value: {
                        operation: 'frame', previousObj: object['currObj'], previousObjColl: object['currObj']['objColl'],
                        previousPointColl: object['currObj']['pointColl'], previousSelPointColl: object['currObj']['selPointColl'],
                        previousCropObj: extend({}, parent.cropObj, {}, true) as CurrentObject, previousText: null, currentText: null,
                        previousFilter: null, isCircleCrop: null }});
                    parent.notify('draw', { prop: 'render-image', value: { isMouseWheel: null, isPreventClearRect: null, isFrame: true } });
                    parent.notify('draw', { prop: 'redrawDownScale' });
                    drpDownBtn.content = args.item.text;
                    parent.curFrameObjEvent = {previousFrameSetting: obj['frameChangeEventArgs'].previousFrameSetting,
                        currentFrameSetting: obj['frameChangeEventArgs'].currentFrameSetting };
                    parent.isFrameBtnClick = true;
                } else {
                    parent.frameObj.offset = temp;
                }
                if (Browser.isDevice) {
                    if (document.getElementById(id + '_bottomToolbar')) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        const toolbar: any = getComponent(id + '_bottomToolbar', 'toolbar') as Toolbar;
                        toolbar.refreshOverflow();
                    }
                } else {
                    if (document.getElementById(id + '_toolbar')) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        const toolbar: any = getComponent(id + '_toolbar', 'toolbar') as Toolbar;
                        toolbar.refreshOverflow();
                    }
                }
            }
        });
        // Render initialized DropDownButton.
        drpDownBtn.appendTo('#' + id + '_frameOffsetBtn');
    }

    private createFrameRadius(): void {
        const parent: ImageEditor = this.parent; let prevFrameSettings: FrameSettings; const obj: Object = {frameChangeEventArgs: null };
        const id: string = parent.element.id;
        const strokeWidthItems: DropDownButtonItemModel[] = [
            { id: '1', text: this.l10n.getConstant('0') },
            { id: '2', text: this.l10n.getConstant('20') },
            { id: '3', text: this.l10n.getConstant('40') },
            { id: '4', text: this.l10n.getConstant('60') },
            { id: '5', text: this.l10n.getConstant('80') },
            { id: '6', text: this.l10n.getConstant('100') }
        ];
        const strokeWidthBtn: HTMLElement = document.getElementById(id + '_frameRadiusBtn');
        const spanElem: HTMLElement = document.createElement('span');
        spanElem.innerHTML = this.l10n.getConstant(parent.frameObj.radius.toString());
        spanElem.className = 'e-frame-radius';
        strokeWidthBtn.appendChild(spanElem);
        // Initialize the DropDownButton component.
        const drpDownBtn: DropDownButton = new DropDownButton({ items: strokeWidthItems,
            open: (args: OpenCloseMenuEventArgs) => {
                if (Browser.isDevice) {
                    const parentElem: HTMLElement = args.element.parentElement;
                    parentElem.style.top = drpDownBtn.element.getBoundingClientRect().top -
                    parentElem.offsetHeight + 'px';
                }
                const activeBtn: string = drpDownBtn.element.childNodes[0].textContent;
                if (activeBtn !== '') {
                    args.element.querySelector('[aria-label = ' + '"' + activeBtn + '"' + ']').classList.add('e-selected-btn');
                }
            },
            select: (args: MenuEventArgs) => {
                this.triggerTbarClickEvent(args);
                prevFrameSettings = {type: parent.toPascalCase(parent.frameObj.type) as FrameType, color: parent.frameObj.color,
                    gradientColor: parent.frameObj.gradientColor, size: parent.frameObj.size, inset: parent.frameObj.inset,
                    offset: parent.frameObj.offset, borderRadius: parent.frameObj.radius,
                    frameLineStyle: parent.toPascalCase(parent.frameObj.border) as FrameLineStyle,
                    lineCount: parent.frameObj.amount};
                const temp: number = parent.frameObj.radius;
                const object: Object = {currObj: {} as CurrentObject };
                parent.notify('filter', { prop: 'getCurrentObj', onPropertyChange: false, value: {object: object }});
                parent.frameObj.radius = parseInt(args.item.text, 10);
                parent.notify('draw', { prop: 'triggerFrameChange', value: { prevFrameSettings: prevFrameSettings, obj: obj }});
                if (obj['frameChangeEventArgs'] && !obj['frameChangeEventArgs'].cancel) {
                    parent.notify('undo-redo', {prop: 'updateUndoRedoColl', onPropertyChange: false, value: {
                        operation: 'frame', previousObj: object['currObj'], previousObjColl: object['currObj']['objColl'],
                        previousPointColl: object['currObj']['pointColl'], previousSelPointColl: object['currObj']['selPointColl'],
                        previousCropObj: extend({}, parent.cropObj, {}, true) as CurrentObject, previousText: null, currentText: null,
                        previousFilter: null, isCircleCrop: null }});
                    parent.notify('draw', { prop: 'render-image', value: { isMouseWheel: null, isPreventClearRect: null, isFrame: true } });
                    parent.notify('draw', { prop: 'redrawDownScale' });
                    drpDownBtn.content = args.item.text;
                    parent.curFrameObjEvent = {previousFrameSetting: obj['frameChangeEventArgs'].previousFrameSetting,
                        currentFrameSetting: obj['frameChangeEventArgs'].currentFrameSetting };
                    parent.isFrameBtnClick = true;
                } else {
                    parent.frameObj.radius = temp;
                }
                if (Browser.isDevice) {
                    if (document.getElementById(id + '_bottomToolbar')) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        const toolbar: any = getComponent(id + '_bottomToolbar', 'toolbar') as Toolbar;
                        toolbar.refreshOverflow();
                    }
                } else {
                    if (document.getElementById(id + '_toolbar')) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        const toolbar: any = getComponent(id + '_toolbar', 'toolbar') as Toolbar;
                        toolbar.refreshOverflow();
                    }
                }
            }
        });
        // Render initialized DropDownButton.
        drpDownBtn.appendTo('#' + id + '_frameRadiusBtn');
    }

    private createFrameAmount(): void {
        const parent: ImageEditor = this.parent; let prevFrameSettings: FrameSettings; const obj: Object = {frameChangeEventArgs: null };
        const id: string = parent.element.id;
        const strokeWidthItems: DropDownButtonItemModel[] = [
            { id: '1', text: this.l10n.getConstant('1') },
            { id: '2', text: this.l10n.getConstant('2') },
            { id: '3', text: this.l10n.getConstant('3') },
            { id: '4', text: this.l10n.getConstant('4') },
            { id: '5', text: this.l10n.getConstant('5') }
        ];
        const strokeWidthBtn: HTMLElement = document.getElementById(id + '_frameAmountBtn');
        const spanElem: HTMLElement = document.createElement('span');
        spanElem.innerHTML = this.l10n.getConstant(parent.frameObj.amount.toString());
        spanElem.className = 'e-frame-amount';
        strokeWidthBtn.appendChild(spanElem);
        // Initialize the DropDownButton component.
        const drpDownBtn: DropDownButton = new DropDownButton({ items: strokeWidthItems,
            open: (args: OpenCloseMenuEventArgs) => {
                if (Browser.isDevice) {
                    const parentElem: HTMLElement = args.element.parentElement;
                    parentElem.style.top = drpDownBtn.element.getBoundingClientRect().top -
                    parentElem.offsetHeight + 'px';
                }
                const activeBtn: string = drpDownBtn.element.childNodes[0].textContent;
                if (activeBtn !== '') {
                    args.element.querySelector('[aria-label = ' + '"' + activeBtn + '"' + ']').classList.add('e-selected-btn');
                }
            },
            select: (args: MenuEventArgs) => {
                this.triggerTbarClickEvent(args);
                prevFrameSettings = {type: parent.toPascalCase(parent.frameObj.type) as FrameType, color: parent.frameObj.color,
                    gradientColor: parent.frameObj.gradientColor, size: parent.frameObj.size, inset: parent.frameObj.inset,
                    offset: parent.frameObj.offset, borderRadius: parent.frameObj.radius,
                    lineCount: parent.frameObj.amount, frameLineStyle: parent.toPascalCase(parent.frameObj.border) as FrameLineStyle };
                const temp: number = parent.frameObj.amount;
                const object: Object = {currObj: {} as CurrentObject };
                parent.notify('filter', { prop: 'getCurrentObj', onPropertyChange: false, value: {object: object }});
                parent.frameObj.amount = parseInt(args.item.text, 10);
                parent.notify('draw', { prop: 'triggerFrameChange', value: { prevFrameSettings: prevFrameSettings, obj: obj }});
                if (obj['frameChangeEventArgs'] && !obj['frameChangeEventArgs'].cancel) {
                    parent.notify('undo-redo', {prop: 'updateUndoRedoColl', onPropertyChange: false, value: {
                        operation: 'frame', previousObj: object['currObj'], previousObjColl: object['currObj']['objColl'],
                        previousPointColl: object['currObj']['pointColl'], previousSelPointColl: object['currObj']['selPointColl'],
                        previousCropObj: extend({}, parent.cropObj, {}, true) as CurrentObject, previousText: null, currentText: null,
                        previousFilter: null, isCircleCrop: null }});
                    parent.notify('draw', { prop: 'render-image', value: { isMouseWheel: null, isPreventClearRect: null, isFrame: true } });
                    parent.notify('draw', { prop: 'redrawDownScale' });
                    drpDownBtn.content = args.item.text;
                    parent.curFrameObjEvent = {previousFrameSetting: obj['frameChangeEventArgs'].previousFrameSetting, currentFrameSetting: obj['frameChangeEventArgs'].currentFrameSetting };
                    parent.isFrameBtnClick = true;
                } else {
                    parent.frameObj.amount = temp;
                }
                if (Browser.isDevice) {
                    if (document.getElementById(id + '_bottomToolbar')) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        const toolbar: any = getComponent(id + '_bottomToolbar', 'toolbar') as Toolbar;
                        toolbar.refreshOverflow();
                    }
                } else {
                    if (document.getElementById(id + '_toolbar')) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        const toolbar: any = getComponent(id + '_toolbar', 'toolbar') as Toolbar;
                        toolbar.refreshOverflow();
                    }
                }
            }
        });
        // Render initialized DropDownButton.
        drpDownBtn.appendTo('#' + id + '_frameAmountBtn');
    }

    private createFrameBorder(): void {
        const parent: ImageEditor = this.parent; let prevFrameSettings: FrameSettings; const obj: Object = {frameChangeEventArgs: null };
        const id: string = parent.element.id;
        const strokeWidthItems: DropDownButtonItemModel[] = [
            { id: '1', text: this.l10n.getConstant('Solid') },
            { id: '2', text: this.l10n.getConstant('Dashed') },
            { id: '3', text: this.l10n.getConstant('Dotted') }
        ];
        const strokeWidthBtn: HTMLElement = document.getElementById(id + '_frameBorderBtn');
        const spanElem: HTMLElement = document.createElement('span');
        spanElem.innerHTML = this.l10n.getConstant(parent.toPascalCase(parent.frameObj.border));
        spanElem.className = 'e-frame-border';
        strokeWidthBtn.appendChild(spanElem);
        // Initialize the DropDownButton component.
        const drpDownBtn: DropDownButton = new DropDownButton({ items: strokeWidthItems,
            open: (args: OpenCloseMenuEventArgs) => {
                if (Browser.isDevice) {
                    const parentElem: HTMLElement = args.element.parentElement;
                    parentElem.style.top = drpDownBtn.element.getBoundingClientRect().top -
                    parentElem.offsetHeight + 'px';
                }
                const activeBtn: string = drpDownBtn.element.childNodes[0].textContent;
                if (activeBtn !== '') {
                    args.element.querySelector('[aria-label = ' + '"' + activeBtn + '"' + ']').classList.add('e-selected-btn');
                }
            },
            select: (args: MenuEventArgs) => {
                this.triggerTbarClickEvent(args);
                prevFrameSettings = {lineCount: parent.frameObj.amount, color: parent.frameObj.color, borderRadius: parent.frameObj.radius,
                    gradientColor: parent.frameObj.gradientColor, size: parent.frameObj.size, inset: parent.frameObj.inset,
                    offset: parent.frameObj.offset, frameLineStyle: parent.toPascalCase(parent.frameObj.border) as FrameLineStyle,
                    type: parent.toPascalCase(parent.frameObj.type) as FrameType };
                const temp: string = parent.frameObj.border;
                const object: Object = {currObj: {} as CurrentObject };
                parent.notify('filter', { prop: 'getCurrentObj', onPropertyChange: false, value: {object: object }});
                parent.frameObj.border = args.item.text.toLowerCase();
                parent.notify('draw', { prop: 'triggerFrameChange', value: { prevFrameSettings: prevFrameSettings, obj: obj }});
                if (obj['frameChangeEventArgs'] && !obj['frameChangeEventArgs'].cancel) {
                    parent.notify('undo-redo', {prop: 'updateUndoRedoColl', onPropertyChange: false, value: {
                        operation: 'frame', previousObj: object['currObj'], previousObjColl: object['currObj']['objColl'],
                        previousPointColl: object['currObj']['pointColl'], previousSelPointColl: object['currObj']['selPointColl'],
                        previousCropObj: extend({}, parent.cropObj, {}, true) as CurrentObject, previousText: null, currentText: null,
                        previousFilter: null, isCircleCrop: null }});
                    parent.notify('draw', { prop: 'render-image', value: { isMouseWheel: null, isPreventClearRect: null, isFrame: true } });
                    parent.notify('draw', { prop: 'redrawDownScale' });
                    drpDownBtn.content = args.item.text;
                    parent.curFrameObjEvent = {previousFrameSetting: obj['frameChangeEventArgs'].previousFrameSetting, currentFrameSetting: obj['frameChangeEventArgs'].currentFrameSetting };
                    parent.isFrameBtnClick = true;
                } else {
                    parent.frameObj.border = temp;
                }
                if (Browser.isDevice) {
                    if (document.getElementById(id + '_bottomToolbar')) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        const toolbar: any = getComponent(id + '_bottomToolbar', 'toolbar') as Toolbar;
                        toolbar.refreshOverflow();
                    }
                } else {
                    if (document.getElementById(id + '_toolbar')) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        const toolbar: any = getComponent(id + '_toolbar', 'toolbar') as Toolbar;
                        toolbar.refreshOverflow();
                    }
                }
            }
        });
        // Render initialized DropDownButton.
        drpDownBtn.appendTo('#' + id + '_frameBorderBtn');
    }

    private initFilterToolbarItem(): void {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        let mainItem: ItemModel[] = this.getFilterToolbarItem();
        const args: ToolbarEventArgs = {toolbarType: 'filter', toolbarItems: mainItem };
        parent.trigger('toolbarUpdating', args);
        mainItem = args.toolbarItems as ItemModel[];
        if (document.querySelector('#' + id + '_contextualToolbar').classList.contains('e-control')) {
            (getComponent(document.getElementById(id + '_contextualToolbar'), 'toolbar') as Toolbar).destroy();
        }
        const toolbar: Toolbar = new Toolbar({
            width: '100%',
            items: mainItem,
            clicked: this.contextualToolbarClicked.bind(this),
            created: () => {
                this.updatePrivateVariables();
                this.createCanvasFilter();
                if (parent.currentFilter === '') {
                    parent.currentFilter = id + '_default';
                }
                const hdrWrapper: HTMLElement = document.querySelector('#' + id + '_headWrapper');
                if (hdrWrapper) {
                    hdrWrapper.style.display = 'none';
                }
                const filterElem: HTMLElement = document.getElementById(parent.currentFilter + 'Canvas');
                if (filterElem) {
                    filterElem.parentElement.parentElement.classList.add('e-selected');
                }
                this.enableDisableTbrBtn();
                toolbar.refreshOverflow();
            }
        });
        toolbar.appendTo('#' + id + '_contextualToolbar');
    }

    private drawDashedLine(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.setLineDash([5]);
        ctx.rect(10, 10, 280, 130);
        ctx.stroke();
        ctx.closePath();
    }

    private createCanvasFilter(): void {
        const parent: ImageEditor = this.parent;
        showSpinner(parent.element); parent.element.style.opacity = '0.5';
        const imageData: ImageData = parent.getCurrentCanvasData();
        this.inMemoryCanvas.width = imageData.width; this.inMemoryCanvas.height = imageData.height;
        this.inMemoryContext.putImageData(imageData, 0, 0);
        this.updateFilterCanvas('_defaultCanvas', 'default');
        this.updateFilterCanvas('_chromeCanvas', 'chrome');
        this.updateFilterCanvas('_coldCanvas', 'cold');
        this.updateFilterCanvas('_warmCanvas', 'warm');
        this.updateFilterCanvas('_grayscaleCanvas', 'grayscale');
        this.updateFilterCanvas('_sepiaCanvas', 'sepia');
        this.updateFilterCanvas('_invertCanvas', 'invert');
        hideSpinner(parent.element); parent.element.style.opacity = '1';
        parent.initialAdjustmentValue = this.lowerContext.filter;
    }

    private updateFilterCanvas(selector: string, type: string): void {
        const parent: ImageEditor = this.parent;
        const filter: HTMLCanvasElement = parent.element.querySelector('#' + parent.element.id + selector);
        if (filter) {
            let ctx: CanvasRenderingContext2D = filter.getContext('2d');
            ctx = filter.getContext('2d');
            ctx.imageSmoothingQuality = parent.imageSmoothingEnabled ? 'high' : 'low';
            filter.style.width = '100px'; filter.style.height = '100px';
            parent.notify('filter', {prop: 'updateAdj', value: { type: type, value: null, isPreview: true, ctx: ctx }});
            ctx.drawImage(this.inMemoryCanvas, 0, 0, 300, 150);
            if (parent.isSafari) {
                parent.notify('filter', { prop: 'apply-filter', onPropertyChange: false, value: {context: ctx}});
            }
        }
    }

    private getQuickAccessToolbarItem(isPenEdit: boolean): ItemModel[] {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        const args: QuickAccessToolbarEventArgs = {cancel: false, toolbarItems: []};
        const toolbarItems: (string | ItemModel)[] = [];
        if (isNullOrUndefined(isPenEdit)) {
            if (parent.activeObj.shape === 'image') {toolbarItems.push('Flip'); }
            if (parent.activeObj.shape !== 'redact') {
                toolbarItems.push('BringToFront');
            }
            toolbarItems.push('Clone'); toolbarItems.push('Delete');
            if (parent.activeObj.shape === 'text') {
                toolbarItems.push('EditText');
            }
            args.shape = parent.toPascalCase(parent.activeObj.shape);
        } else if (isPenEdit) {
            toolbarItems.push('BringToFront'); toolbarItems.push('Delete');
            args.shape = 'Freehand draw';
        }
        args.toolbarItems = extend([], toolbarItems, null, true) as ItemModel[];
        parent.trigger('quickAccessToolbarOpen', args);
        let orgToolbarItems: ItemModel[] = [];
        if (args.cancel) {
            orgToolbarItems = [];
        } else {
            for (let i: number = 0; i < args.toolbarItems.length; i++) {
                switch (args.toolbarItems[i as number]) {
                case 'BringToFront':
                    orgToolbarItems.push({ id: id + '_bringToFront', prefixIcon: 'e-icons e-bring-to-front',
                        tooltipText: this.l10n.getConstant('BringToFront'), align: 'Left' });
                    break;
                case 'Clone':
                    orgToolbarItems.push({ id: id + '_duplicate', prefixIcon: 'e-icons e-order', cssClass: 'top-icon e-order',
                        tooltipText: this.l10n.getConstant('Duplicate'), align: 'Left' });
                    break;
                case 'Delete':
                    orgToolbarItems.push({ id: id + '_remove', prefixIcon: 'e-icons e-trash', cssClass: 'top-icon e-trash',
                        tooltipText: this.l10n.getConstant('Remove'), align: 'Left' });
                    break;
                case 'EditText':
                    orgToolbarItems.push({ id: id + '_editText', prefixIcon: 'e-icons e-annotation-edit', cssClass: 'top-icon e-annotation-edit',
                        tooltipText: this.l10n.getConstant('EditText'), align: 'Left' });
                    break;
                case 'Flip':
                    orgToolbarItems.push({ id: id + '_hFlip', prefixIcon: 'e-icons e-horizontal-flip',
                        tooltipText: this.l10n.getConstant('HorizontalFlip'), align: 'Left' });
                    orgToolbarItems.push({ id: id + '_vFlip', prefixIcon: 'e-icons e-vertical-flip',
                        tooltipText: this.l10n.getConstant('VerticalFlip'), align: 'Left' });
                    break;
                default:
                    orgToolbarItems.push(args.toolbarItems[i as number] as ItemModel);
                    break;
                }
            }
        }
        return orgToolbarItems as ItemModel[];
    }

    private renderQAT(isPenEdit?: boolean): void {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        if (parent.activeObj && parent.showQuickAccessToolbar) {
            const qtArea: HTMLElement = document.getElementById(id + '_quickAccessToolbarArea');
            if (qtArea) {
                this.destroyQuickAccessToolbar();
                qtArea.style.display = 'block';
            }
            const items: ItemModel[] = this.getQuickAccessToolbarItem(isPenEdit);
            if (items.length === 0) {return; }
            if (isNullOrUndefined(parent.quickAccessToolbarTemplate)) {
                const toolbarObj: Toolbar = new Toolbar({
                    items: items,
                    clicked: this.quickAccessToolbarClicked.bind(this)
                });
                toolbarObj.appendTo('#' + id + '_quickAccessToolbar');
            }
            let height: number = this.toolbarHeight && this.toolbarHeight !== 0 ? this.toolbarHeight : qtArea.clientHeight;
            const wrapperElement: Element =  parent.element.querySelector('#' + id + '_headWrapper') as HTMLElement;
            if (isNullOrUndefined(isPenEdit) && (parent.activeObj.activePoint.width !== 0 ||
                parent.activeObj.activePoint.height !== 0 ||
                (parent.activeObj.shape && parent.activeObj.shape === 'path' && parent.activeObj.pointColl.length > 0))) {
                const orderObj: Object = {order: null };
                parent.notify('shape', { prop: 'getHighestOrder', onPropertyChange: false, value: {obj: orderObj } });
                if (parent.activeObj.order > orderObj['order'] && document.getElementById(parent.element.id + '_bringToFront')) {
                    document.getElementById(parent.element.id + '_bringToFront').classList.add('e-overlay');
                } else {
                    if (document.getElementById(parent.element.id + '_bringToFront')) {
                        document.getElementById(parent.element.id + '_bringToFront').classList.remove('e-overlay');
                    }
                }
                qtArea.style.width = 'auto';
                parent.activeObj.activePoint.width = Math.abs(parent.activeObj.activePoint.width);
                parent.activeObj.activePoint.height = Math.abs(parent.activeObj.activePoint.height);
                let x: number = parent.activeObj.activePoint.startX < parent.activeObj.activePoint.endX ?
                    parent.activeObj.activePoint.startX : parent.activeObj.activePoint.endX;
                let y: number = parent.activeObj.activePoint.startY < parent.activeObj.activePoint.endY ?
                    parent.activeObj.activePoint.startY : parent.activeObj.activePoint.endY;
                let width: number = parent.activeObj.activePoint.width;
                if (parent.activeObj.rotatedAngle !== 0 && parent.activeObj.shape !== 'arrow') {
                    const object: Object = {activePoint: null};
                    parent.notify('shape', {prop: 'getSquarePointForRotatedShape', onPropertyChange: false,
                        value: {obj: parent.activeObj, object: object }});
                    const point: ActivePoint = object['activePoint'];
                    x = point.startX; y = point.startY; width = point.width;
                } else if (parent.activeObj.shape === 'path') {
                    const path: ActivePoint = parent.getSquarePointForPath(parent.activeObj);
                    x = path.startX; y = path.startY; width = path.width;
                }
                qtArea.style.left = (x + (width / 2)) - (items.length * 25) + 'px';
                if (parseFloat(qtArea.style.left) + (qtArea.clientWidth / 2) !== x + (width / 2)) {
                    const diff: number = (x + (width / 2)) - (parseFloat(qtArea.style.left) + (qtArea.clientWidth / 2));
                    qtArea.style.left = parseFloat(qtArea.style.left) + diff + 'px';
                }
                if (wrapperElement) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    height = (wrapperElement as any).offsetHeight + height;
                }
                if (y - (height + (height / 1.5)) < parent.img.destTop) {
                    qtArea.style.top = parent.img.destTop + 'px';
                    if (wrapperElement) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        qtArea.style.top = (parent.img.destTop < 0 ? 0 : parent.img.destTop) + (wrapperElement as any).offsetHeight + 'px';
                    }
                } else {
                    height = this.toolbarHeight;
                    qtArea.style.top = y - (height + (height / 1.5)) + 'px';
                }
            } else if (isPenEdit) {
                const indexObj: Object = {freehandSelectedIndex: -1 };
                parent.notify('freehand-draw', {prop: 'getFreehandSelectedIndex', onPropertyChange: false, value: {obj: indexObj }});
                const orderObj: Object = {order: null };
                parent.notify('shape', { prop: 'getHighestOrder', onPropertyChange: false, value: {obj: orderObj } });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if ((parent.getObjFromId(parent.pointColl[indexObj['freehandSelectedIndex']].id) as any).order >= orderObj['order'] && document.getElementById(parent.element.id + '_bringToFront')) {
                    document.getElementById(parent.element.id + '_bringToFront').classList.add('e-overlay');
                } else {
                    if (document.getElementById(parent.element.id + '_bringToFront')) {
                        document.getElementById(parent.element.id + '_bringToFront').classList.remove('e-overlay');
                    }
                }
                const obj: Object = {activePoint: null };
                parent.notify('freehand-draw', {prop: 'getSqPtFD',
                    value: { idx: indexObj['freehandSelectedIndex'], obj: obj }});
                const point: ActivePoint = obj['activePoint'];
                qtArea.style.width = 'auto';
                qtArea.style.left = (point.startX + (point.width / 2)) - (items.length * 24) + 'px';
                if (point.startY - (height + (height / 1.5)) < parent.img.destTop) {
                    qtArea.style.top = parent.img.destTop + 'px';
                } else {
                    qtArea.style.top = point.startY - (height + (height / 1.5)) + 'px';
                }
            } else {
                qtArea.style.display = 'none';
            }
            if (parseFloat(qtArea.style.top) < 0) {
                qtArea.style.top = '0px';
            }
        }
    }

    private refreshDropDownBtn(isDisabled: boolean): void {
        if (isNullOrUndefined(isDisabled)) {
            return;
        }
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        const annotation: HTMLElement = document.querySelector('#' + id + '_annotationBtn');
        if (annotation) {
            if (isDisabled) {
                annotation.classList.add('e-disabled');
                annotation.parentElement.classList.add('e-overlay');
            } else {
                annotation.classList.remove('e-disabled');
                annotation.parentElement.classList.remove('e-overlay');
            }
            (getComponent(annotation as HTMLElement, 'dropdown-btn') as DropDownButton).disabled = isDisabled;
        }
        const transform: HTMLElement = document.querySelector('#' + id + '_transformBtn');
        if (transform) {
            if (isDisabled) {
                transform.classList.add('e-disabled');
                transform.parentElement.classList.add('e-overlay');
            } else {
                transform.classList.remove('e-disabled');
                transform.parentElement.classList.remove('e-overlay');
            }
            (getComponent(transform as HTMLElement, 'dropdown-btn') as DropDownButton).disabled = isDisabled;
        }
        const adjustment: HTMLElement = document.querySelector('#' + id + '_adjustment');
        if (adjustment) {
            if (isDisabled) {
                adjustment.classList.add('e-disabled');
                adjustment.parentElement.classList.add('e-overlay');
            } else {
                adjustment.classList.remove('e-disabled');
                adjustment.parentElement.classList.remove('e-overlay');
            }
            (getComponent(adjustment as HTMLElement, 'btn') as Button).disabled = isDisabled;
        }
        const filter: HTMLElement = document.querySelector('#' + id + '_filter');
        if (filter) {
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

    private cropSelect(args: MenuEventArgs): void {
        const parent: ImageEditor = this.parent;
        parent.isCropTab = true;
        if (isNullOrUndefined(parent.transform.cropZoomFactor)) {
            parent.transform.cropZoomFactor = parent.transform.zoomFactor;
            parent.notify('draw', { prop: 'setTempZoomFactor', onPropertyChange: false, value: {tempZoomFactor: parent.transform.zoomFactor }});
        }
        parent.transform.zoomFactor = parent.transform.cropZoomFactor;
        const text: string = args.item.id;
        this.currentToolbar = 'crop';
        parent.currSelectionPoint = null;
        parent.notify('draw', { prop: 'setIsCropSelect', value: {bool: true }});
        const obj: Object = {prevObj: null };
        parent.notify('crop', { prop: 'getPreviousCropCurrentObj', value: {obj: obj }});
        parent.notify('draw', { prop: 'select', onPropertyChange: false,
            value: {type: text, startX: null, startY: null, width: null, height: null}});
        parent.notify('crop', { prop: 'setPreviousCropCurrentObj', value: {obj: obj['prevObj'] }});
        this.enableDisableTbrBtn();
        parent.notify('transform', { prop: 'disableZoomOutBtn', value: {isZoomOut: true }});
    }

    private quickAccessToolbarClicked(args: ClickEventArgs, isContextualToolbar?: boolean): void {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        if (args.item) {
            let isPreventUndoRedo: boolean = null;
            const obj: Object = {prevActObj: null }; const object: Object = {tempObj: null };
            parent.notify('draw', { prop: 'getPrevActObj', onPropertyChange: false, value: {obj: obj }});
            parent.notify('selection', { prop: 'getTempActObj', onPropertyChange: false, value: {obj: object }});
            object['tempObj']['activePoint']['height'] = Math.abs(object['tempObj']['activePoint']['height']);
            const pathObject: Object = {isNewPath: null }; let ctx: CanvasRenderingContext2D;
            parent.notify('draw', {prop: 'getNewPath', value: {obj: pathObject}});
            const type: string = args.item.id.replace(id + '_', '').toLowerCase();
            let left: HTMLElement; let right: HTMLElement; const indexObj: Object = {freehandSelectedIndex: null };
            let shapeId: string; let isDisabled: boolean; const orderObj: Object = {order: null };
            switch (type) {
            case 'duplicate':
                if (!parent.element.querySelector('#' + id + '_duplicate').classList.contains('e-overlay')) {
                    this.refreshSlider();
                    if (!pathObject['isNewPath'] && JSON.stringify(object['tempObj']) === JSON.stringify(parent.activeObj)) {
                        isPreventUndoRedo = true;
                    }
                    this.duplicateShape(isPreventUndoRedo);
                }
                break;
            case 'remove':
                if (!parent.element.querySelector('#' + id + '_remove').classList.contains('e-overlay')) {
                    parent.noPushUndo = false;
                    this.refreshSlider();
                    parent.notify('selection', { prop: 'deleteItem', onPropertyChange: false});
                }
                break;
            case 'edittext':
                if (!parent.element.querySelector('#' + id + '_editText').classList.contains('e-overlay')) {
                    this.editText();
                }
                break;
            case 'rotleft':
            case 'rotright':
                left = parent.element.querySelector('#' + id + '_rotLeft');
                right = parent.element.querySelector('#' + id + '_rotRight');
                if ((left && !left.classList.contains('e-disabled')) ||
                    (right && !right.classList.contains('e-disabled'))) {
                    parent.rotateImage(args.item.id.replace(id + '_', '').toLowerCase());
                }
                parent.notify('undo-redo', { prop: 'updateUndoRedoStack', onPropertyChange: false});
                break;
            case 'hflip':
                if (!parent.element.querySelector('#' + id + '_hFlip').classList.contains('e-disabled')) {
                    ctx = parent.activeObj.imageCanvas.getContext('2d');
                    parent.horizontalFlip(ctx);
                }
                parent.notify('undo-redo', { prop: 'updateUndoRedoStack', onPropertyChange: false});
                break;
            case 'vflip':
                if (!parent.element.querySelector('#' + id + '_vFlip').classList.contains('e-disabled')) {
                    ctx = parent.activeObj.imageCanvas.getContext('2d');
                    parent.verticalFlip(ctx);
                }
                parent.notify('undo-redo', { prop: 'updateUndoRedoStack', onPropertyChange: false});
                break;
            case 'bringtofront':
                if (!parent.element.querySelector('#' + id + '_bringToFront').classList.contains('e-overlay')) {
                    parent.notify('freehand-draw', {prop: 'getFreehandSelectedIndex', onPropertyChange: false, value: {obj: indexObj }});
                    shapeId = indexObj['freehandSelectedIndex'] !== null ? parent.pointColl[indexObj['freehandSelectedIndex']].id :
                        parent.activeObj.currIndex;
                    parent.updateShapeOrder(shapeId, type);
                    isDisabled = false;
                    parent.notify('shape', { prop: 'getHighestOrder', onPropertyChange: false, value: {obj: orderObj } });
                    if (shapeId.indexOf('pen') > -1) {
                        parent.notify('shape', { prop: 'updateShapeColl', onPropertyChange: false });
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        const order: number = (parent.getObjFromId(shapeId) as any).order;
                        isDisabled = order >= orderObj['order'] ? true : false;
                    } else {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        const order: number = (parent.getObjFromId(shapeId) as any).order;
                        isDisabled = order > orderObj['order'] ? true : false;
                    }
                    if (isDisabled) {
                        document.getElementById(parent.element.id + '_bringToFront').classList.add('e-overlay');
                    } else {
                        document.getElementById(parent.element.id + '_bringToFront').classList.remove('e-overlay');
                    }
                    parent.notify('undo-redo', { prop: 'updateUndoRedoStack', onPropertyChange: false});
                }
                break;
            }
            if (type === 'duplicate' || type === 'remove') {
                parent.notify('draw', { prop: 'redrawDownScale' });
            }
        }
        if (isNullOrUndefined(isContextualToolbar)) {
            parent.trigger('quickAccessToolbarItemClick', args);
        }
    }

    private editText(): void {
        const parent: ImageEditor = this.parent;
        const points: Point = {x: parent.activeObj.activePoint.startX, y: parent.activeObj.activePoint.startY};
        this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
        parent.notify('selection', { prop: 'setTempActObj', onPropertyChange: false,
            value: { obj: extend({}, parent.activeObj, {}, true) }});
        parent.notify('selection', { prop: 'setInitialTextEdit', onPropertyChange: false,
            value: { bool: true }});
        parent.notify('draw', { prop: 'setPrevActObj', onPropertyChange: false,
            value: { prevActObj: extend({}, parent.activeObj, {}, true) }});
        if (parent.activeObj.rotatedAngle !== 0) {
            const object: Object = {x: points.x, y: points.y };
            parent.notify('shape', { prop: 'getTextBoxPosition', onPropertyChange: false,
                value: {obj: parent.activeObj, object: object }});
            points.x = object['x']; points.y = object['y'];
            const object1: Object = {x: points.x, y: points.y };
            parent.notify('shape', { prop: 'setFlipState', onPropertyChange: false,
                value: {x: points.x, y: points.y, obj: parent.activeObj, object: object1 }});
            points.x = object1['x']; points.y = object1['y'];
        }
        const tempActiveObj: SelectionPoint = extend({}, parent.activeObj, {}, true) as SelectionPoint;
        parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false });
        this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
        this.lowerContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
        parent.notify('draw', { prop: 'redrawImgWithObj', onPropertyChange: false });
        parent.notify('draw', { prop: 'redrawDownScale' });
        parent.notify('draw', { prop: 'clearOuterCanvas', onPropertyChange: false, value: { context: this.lowerContext } });
        parent.notify('draw', { prop: 'clearOuterCanvas', onPropertyChange: false, value: { context: this.upperContext } });
        parent.activeObj = tempActiveObj;
        parent.notify('shape', { prop: 'renderTextArea', onPropertyChange: false,
            value: {x: points.x, y: points.y, actObj: parent.activeObj}});
        if (isNullOrUndefined(parent.activeObj.currIndex)) {
            parent.notify('draw', { prop: 'setShapeTextInsert', onPropertyChange: false, value: {bool: true } });
        }
        if (document.getElementById(parent.element.id + '_quickAccessToolbarArea')) {
            document.getElementById(parent.element.id + '_quickAccessToolbarArea').style.display = 'none';
        }
    }

    private duplicateShape(isPreventUndoRedo: boolean, isPublicMethod?: boolean): void {
        const parent: ImageEditor = this.parent;
        const tempObj: SelectionPoint = {activePoint: {startX: 0, startY: 0, endX: 0, endY: 0, width: 0, height: 0},
            flipObjColl: [], triangle: [], triangleRatio: []} as SelectionPoint;
        parent.notify('selection', { prop: 'setTempActObj', onPropertyChange: false,
            value: { obj: tempObj }});
        const obj: Object = {prevActObj: null };
        parent.notify('draw', { prop: 'getPrevActObj', onPropertyChange: false, value: {obj: obj }});
        const pathObject: Object = {isNewPath: null };
        parent.notify('draw', {prop: 'getNewPath', value: {obj: pathObject}});
        let objColl: SelectionPoint[];
        const duplicateObj: SelectionPoint = extend({}, parent.activeObj, {}, true) as SelectionPoint;
        const orderObj: Object = {order: null };
        parent.notify('shape', { prop: 'getHighestOrder', onPropertyChange: false, value: {obj: orderObj } });
        if (duplicateObj.order) {
            parent.notify('shape', {prop: 'updateShapeColl', onPropertyChange: false });
            duplicateObj.order = orderObj['order'] > duplicateObj.order ? orderObj['order'] + 1 : duplicateObj.order + 1;
        } else {
            parent.noPushUndo = true;
            parent.okBtn();
            parent.noPushUndo = false;
            parent.selectShape(duplicateObj.currIndex);
            duplicateObj.order = orderObj['order'] > duplicateObj.order ? orderObj['order'] + 1 : duplicateObj.order + 1;
        }
        if (duplicateObj.shape === 'image') {
            objColl = extend([], parent.objColl, [], true) as SelectionPoint[];
            parent.notify('undo-redo', { prop: 'updateUrObj', onPropertyChange: false, value: {objColl: objColl}});
        }
        if (isNullOrUndefined(parent.activeObj.currIndex)) {
            parent.notify('shape', { prop: 'applyActObj', onPropertyChange: false, value: {isMouseDown: isPreventUndoRedo}});
        } else if (obj['prevActObj'] || isPublicMethod) {
            parent.activeObj.currIndex = null; duplicateObj.currIndex = null;
            parent.notify('shape', { prop: 'applyActObj', onPropertyChange: false, value: {isMouseDown: isPreventUndoRedo}});
        } else {
            parent.notify('shape', { prop: 'applyActObj', onPropertyChange: false, value: {isMouseDown: true}});
        }
        const noPushUndo: boolean = parent.noPushUndo;
        parent.noPushUndo = false;
        parent.notify('undo-redo', { prop: 'updateCurrUrc', value: { type: 'ok' } });
        parent.noPushUndo = noPushUndo;
        objColl = extend([], parent.objColl, [], true) as SelectionPoint[];
        duplicateObj.activePoint.startX += 10; duplicateObj.activePoint.startY -= 10;
        duplicateObj.activePoint.endX += 10; duplicateObj.activePoint.endY -= 10;
        if (duplicateObj.shape === 'path') {
            for (let i: number = 0; i < duplicateObj.pointColl.length; i++) {
                duplicateObj.pointColl[i as number].x += 10;
                duplicateObj.pointColl[i as number].y -= 10;
            }
        } else if (duplicateObj.shape === 'image') {
            duplicateObj.imageCanvas = parent.createElement('canvas');
        }
        const shapeIDObj: Object = {id: 'shape_' + (parent.objColl.length + 1) };
        parent.notify('shape', { prop: 'getNewShapeId', onPropertyChange: false, value: {obj: shapeIDObj }});
        duplicateObj.currIndex = shapeIDObj['id'];
        parent.activeObj = extend({}, duplicateObj, {}, true) as SelectionPoint;
        if (parent.activeObj.shape === 'image') {
            const activePoint: ActivePoint = extend({}, duplicateObj.activePoint, {}, true) as ActivePoint;
            const dimObj: Object = {width: 0, height: 0 };
            parent.notify('transform', { prop: 'calcMaxDimension', onPropertyChange: false,
                value: {width: parent.activeObj.imageElement.width, height: parent.activeObj.imageElement.height,
                    obj: dimObj, isImgShape: null }});
            parent.activeObj.activePoint.width = dimObj['width']; parent.activeObj.activePoint.height = dimObj['height'];
            if (parent.activeObj.isHorImageFlip && parent.activeObj.isVerImageFlip) {
                parent.activeObj.isHorImageFlip = parent.activeObj.isVerImageFlip = false;
                parent.notify('draw', { prop: 'downScaleImgCanvas', onPropertyChange: false,
                    value: {ctx: duplicateObj.imageCanvas.getContext('2d'), isImgAnnotation: true, isHFlip: true, isVFlip: true }});
                parent.activeObj.isHorImageFlip = parent.activeObj.isVerImageFlip = true;
            } else if (parent.activeObj.isHorImageFlip) {
                parent.activeObj.isHorImageFlip = false;
                parent.notify('draw', { prop: 'downScaleImgCanvas', onPropertyChange: false,
                    value: {ctx: duplicateObj.imageCanvas.getContext('2d'), isImgAnnotation: true, isHFlip: true, isVFlip: null }});
                parent.activeObj.isHorImageFlip = true;
            } else if (parent.activeObj.isVerImageFlip) {
                parent.activeObj.isVerImageFlip = false;
                parent.notify('draw', { prop: 'downScaleImgCanvas', onPropertyChange: false,
                    value: {ctx: duplicateObj.imageCanvas.getContext('2d'), isImgAnnotation: true, isHFlip: null, isVFlip: true }});
                parent.activeObj.isVerImageFlip = true;
            } else {
                parent.notify('draw', { prop: 'downScaleImgCanvas', onPropertyChange: false,
                    value: {ctx: duplicateObj.imageCanvas.getContext('2d'), isImgAnnotation: true, isHFlip: null, isVFlip: null }});
            }
            parent.activeObj.activePoint = activePoint;
        }
        if (parent.activeObj.shape === 'line' || parent.activeObj.shape === 'arrow') {
            parent.notify('shape', { prop: 'setPointCollForLineArrow', onPropertyChange: false,
                value: {obj: parent.activeObj }});
        }
        parent.notify('draw', { prop: 'drawObject', onPropertyChange: false, value: {canvas: 'duplicate', obj: parent.activeObj,
            isCropRatio: null, points: null, isPreventDrag: true }});
        parent.notify('undo-redo', { prop: 'updateUrObj', onPropertyChange: false, value: {objColl: objColl}});
        parent.notify('shape', { prop: 'applyActObj', onPropertyChange: false, value: { isMouseDown: true } });
        parent.noPushUndo = false;
        parent.notify('undo-redo', { prop: 'updateCurrUrc', value: { type: 'ok' } });
        parent.noPushUndo = true;
        parent.notify('selection', { prop: 'redrawShape', onPropertyChange: false,
            value: { obj: parent.objColl[parent.objColl.length - 1] } });
        const id: string = parent.element.id;
        const toolbarId: string = Browser.isDevice ? '#' + id + '_bottomToolbar ' + '#' + id : '#' + id ;
        const object: Object = {freehandDrawSelectedId: null };
        parent.notify('freehand-draw', { prop: 'getFreehandDrawSelectedId', onPropertyChange: false, value: {obj: object }});
        this.enableDisableCloneBtn(toolbarId, object);
        this.renderQAT();
        if (parent.activeObj.shape && parent.activeObj.shape === 'redact') {
            this.redactSlider(parent.activeObj.redactType);
        }
    }

    private defToolbarClicked(args: ClickEventArgs): void {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        let isContextualToolbar: boolean = false;
        let isFilterFinetune: boolean = false;
        if (!this.isFrameToolbar && parent.element.querySelector('.e-contextual-toolbar-wrapper')) {
            if (!parent.element.querySelector('.e-contextual-toolbar-wrapper').classList.contains('e-hide')) {
                isContextualToolbar = isFilterFinetune = true;
            }
            const straightenObj: Object = {bool: parent.isStraightening };
            if (!Browser.isDevice || (Browser.isDevice && !straightenObj['bool'])) {
                parent.element.querySelector('.e-contextual-toolbar-wrapper').classList.add('e-hide');
            }
        }
        if (args.item) {
            const type: string = args.item.id.replace(id + '_', '').toLowerCase();
            if (type === 'duplicate' || type === 'remove' || type === 'edittext' ||
                type === 'hflip' || type === 'vflip' || type === 'rotleft' || type === 'rotright') {
                this.quickAccessToolbarClicked(args, true);
                parent.trigger('toolbarItemClicked', args);
            } else {
                let isDisabledFilter: boolean = false; let isDisabledAdjustment: boolean = false;
                const adjustment: HTMLElement = document.querySelector('#' + id + '_adjustment');
                if (adjustment && adjustment.classList.contains('e-disabled')) {
                    isDisabledAdjustment = true;
                }
                const filter: HTMLElement = document.querySelector('#' + id + '_filter');
                if (filter && filter.classList.contains('e-disabled')) {
                    isDisabledFilter = true;
                }
                this.enableDisableTbrBtn();
                this.performDefTbrClick(type, isContextualToolbar, isDisabledAdjustment, isDisabledFilter, isFilterFinetune);
                parent.trigger('toolbarItemClicked', args);
                if (parent.isStraightening) {
                    parent.notify('transform', { prop: 'disableZoomOutBtn', value: {isZoomOut: true }});
                }
                const validTypes: string[] = ['undo', 'redo', 'cancel', 'aspectratio', 'nonaspectratio',
                    'save', 'duplicate', 'filter', 'frame', 'none', 'mat', 'bevel', 'line', 'inset', 'hook', 'resize',
                    'remove'];
                if (validTypes.indexOf(type) !== -1) {
                    parent.notify('draw', { prop: 'redrawDownScale' });
                }
            }
        }
    }

    private performDefTbrClick(type: string, isContextualToolbar: boolean, isDisabledAdjustment: boolean,
                               isDisabledFilter: boolean, isFilterFinetune: boolean): void {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        const zoomIn: HTMLElement = parent.element.querySelector('#' + id + '_zoomIn');
        const aspectRatioHeight: HTMLInputElement = parent.element.querySelector('#' + id + '_resizeHeight');
        const aspectRatioWidth: HTMLElement = parent.element.querySelector('#' + id + '_resizeWidth');
        let isCropSelection: boolean = false;  let panBtn: HTMLElement; let splitWords: string[];
        let actionType: string; let actionArgs: EditCompleteEventArgs; let isRedactClick: boolean = false;
        let zoomLevel: number = 0; let actObj: SelectionPoint; let isRedact: boolean = false;
        if (parent.activeObj.shape !== undefined) {splitWords = parent.activeObj.shape.split('-'); }
        if (splitWords === undefined && parent.currObjType.isCustomCrop) {
            isCropSelection = true;
        } else if (splitWords !== undefined && splitWords[0] === 'crop'){
            isCropSelection = true;
        }
        if (!parent.disabled) {
            switch (type) {
            case 'pan':
                parent.currObjType.isCustomCrop = parent.currObjType.isFiltered = false;
                parent.currObjType.isRedact = false;
                if (parent.currObjType.isUndoAction) {
                    parent.notify('undo-redo', {prop: 'refreshUrc', value: {bool: null }});
                }
                if (isCropSelection) {
                    parent.currObjType.isCustomCrop = false;
                    parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
                    this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
                    this.refreshToolbar('main');
                }
                if (parent.togglePan) {
                    this.cancelPan();
                    parent.notify('transform', { prop: 'setDisablePan', onPropertyChange: false, value: {bool: true }});
                    if (this.currentToolbar === 'pen') {
                        parent.freeHandDraw(true);
                    }
                } else {
                    panBtn = parent.element.querySelector('.e-img-pan .e-btn');
                    if (panBtn) {
                        panBtn.classList.add('e-selected-btn');
                    }
                    parent.pan(true);
                    parent.notify('transform', { prop: 'setDisablePan', onPropertyChange: false, value: {bool: false }});
                }
                if (zoomIn && parent.zoomSettings.zoomFactor >= parent.zoomSettings.maxZoomFactor) {
                    zoomIn.classList.add('e-disabled');
                    zoomIn.parentElement.classList.add('e-overlay');
                } else if (zoomIn) {
                    zoomIn.classList.remove('e-disabled');
                    zoomIn.parentElement.classList.remove('e-overlay');
                }
                this.refreshToolbar('main');
                break;
            case 'cancel':
                if (parent.currObjType.isRedact) {
                    parent.currObjType.isRedact = false;
                }
                if (this.isFrameToolbar && parent.element.querySelector('.e-contextual-toolbar-wrapper') && !parent.element.querySelector('.e-contextual-toolbar-wrapper').classList.contains('e-hide')) {
                    parent.element.querySelector('.e-contextual-toolbar-wrapper').classList.add('e-hide');
                }
                parent.notify('draw', {prop: 'performCancel', value: {isContextualToolbar: isContextualToolbar, isFinalCancel: true}});
                break;
            case 'ok':
                if (Browser.isDevice && this.isFrameToolbar && parent.element.querySelector('.e-contextual-toolbar-wrapper') && !parent.element.querySelector('.e-contextual-toolbar-wrapper').classList.contains('e-hide')) {
                    parent.element.querySelector('.e-contextual-toolbar-wrapper').classList.add('e-hide');
                }
                parent.okBtn(null, true);
                parent.drawingShape = null;
                this.refreshDropDownBtn(false);
                this.currentToolbar = 'main';
                parent.isStraightening = false;
                parent.notify('draw', { prop: 'resetTempObjColl'});
                parent.notify('draw', { prop: 'resetTempPointColl'});
                break;
            case 'crop':
                parent.notify('transform', { prop: 'disableZoomOutBtn', value: {isZoomOut: true }});
                if (Browser.isDevice) {this.updateContextualToolbar('color', 'straighten'); }
                break;
            case 'reset':
                parent.reset();
                this.imageHeight = null; this.imageWidth = null;
                parent.aspectHeight = null; parent.aspectWidth = null;
                this.isAspectRatio = true;
                this.currentToolbar = 'main';
                break;
            case 'undo':
                parent.noPushUndo = false;
                if (parent.togglePen || parent.drawingShape) {
                    parent.okBtn();
                    parent.drawingShape = null;
                }
                parent.notify('undo-redo', {prop: 'call-undo'});
                break;
            case 'redo':
                parent.noPushUndo = false;
                if (parent.togglePen || parent.drawingShape) {
                    parent.okBtn();
                    parent.drawingShape = null;
                }
                parent.notify('undo-redo', {prop: 'call-redo'});
                break;
            case 'aspectratio':
                if (!parent.isCircleCrop && (isNullOrUndefined(parent.currSelectionPoint)) ||
                    (parent.currSelectionPoint && parent.currSelectionPoint.shape !== 'crop-circle')) {
                    if ((getComponent(aspectRatioWidth, 'numerictextbox') as NumericTextBox).value) {
                        parent.aspectWidth = (getComponent(aspectRatioWidth, 'numerictextbox') as NumericTextBox).value;
                        parent.aspectHeight = (getComponent(aspectRatioHeight, 'numerictextbox') as NumericTextBox).value;
                        parent.notify('transform', {prop: 'resize', value: {width: parent.aspectWidth, height: null, isAspectRatio: true }});
                    } else if ((getComponent(aspectRatioHeight, 'numerictextbox') as NumericTextBox).value) {
                        parent.aspectWidth = parseFloat((getComponent(aspectRatioWidth, 'numerictextbox') as NumericTextBox).placeholder);
                        parent.aspectHeight = (getComponent(aspectRatioHeight, 'numerictextbox') as NumericTextBox).value;
                        parent.notify('transform', {prop: 'resize', value: {width: parent.aspectWidth, height: parent.aspectHeight, isAspectRatio: true }});
                    }
                    parent.resizeSrc = { startX: parent.img.srcLeft, startY: parent.img.srcTop, width: parent.img.srcWidth,
                        height: parent.img.srcHeight };
                    this.refreshToolbar('resize');
                }
                break;
            case 'nonaspectratio':
                if ((getComponent(aspectRatioWidth, 'numerictextbox') as NumericTextBox).value ||
                    (getComponent(aspectRatioHeight, 'numerictextbox') as NumericTextBox).value) {
                    parent.aspectWidth = (getComponent(aspectRatioWidth, 'numerictextbox') as NumericTextBox).value ?
                        (getComponent(aspectRatioWidth, 'numerictextbox') as NumericTextBox).value :
                        parseFloat((getComponent(aspectRatioWidth, 'numerictextbox') as NumericTextBox).placeholder);
                    parent.aspectHeight = (getComponent(aspectRatioHeight, 'numerictextbox') as NumericTextBox).value ?
                        (getComponent(aspectRatioHeight, 'numerictextbox') as NumericTextBox).value :
                        parseFloat((getComponent(aspectRatioHeight, 'numerictextbox') as NumericTextBox).placeholder);
                    parent.notify('transform', {prop: 'resize', value: {width: parent.aspectWidth, height: parent.aspectHeight, isAspectRatio: false }});
                }
                parent.resizeSrc = { startX: parent.img.srcLeft, startY: parent.img.srcTop, width: parent.img.srcWidth,
                    height: parent.img.srcHeight };
                this.refreshToolbar('resize');
                break;
            case 'resize':
                if (parent.currObjType.isFiltered || parent.currObjType.isRedact) {parent.okBtn(); }
                this.resizeClick();
                break;
            case 'adjustment':
                if (!isDisabledAdjustment) {
                    if (parent.currObjType.isFiltered || parent.currObjType.isRedact) {parent.okBtn(); }
                    this.refreshToolbar('adjustment');
                    parent.setTempFilterProperties();
                    parent.notify('draw', {prop: 'updateFinetune' });
                    parent.notify('filter', { prop: 'setTempAdjVal' });
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
                    showSpinner(parent.element);
                    this.refreshToolbar('filter');
                    parent.setTempFilterProperties();
                    hideSpinner(parent.element);
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
                parent.currObjType.isFiltered = true;
                parent.notify('filter', {prop: 'applyImageFilter', value: {option: type }});
                break;
            case 'upload':
                if (isFilterFinetune) {
                    parent.element.querySelector('.e-contextual-toolbar-wrapper').classList.remove('e-hide');
                }
                break;
            case 'bold':
                parent.notify('selection', { prop: 'setInitialTextEdit', value: {bool: false }});
                if (parent.activeObj.textSettings.bold && parent.activeObj.textSettings.italic) {
                    parent.notify('shape', { prop: 'applyFontStyle', onPropertyChange: false,
                        value: {item: 'italic' }});
                } else if (parent.activeObj.textSettings.bold && !parent.activeObj.textSettings.italic) {
                    parent.notify('shape', { prop: 'applyFontStyle', onPropertyChange: false,
                        value: {item: 'default' }});
                } else if (!parent.activeObj.textSettings.bold && parent.activeObj.textSettings.italic) {
                    parent.notify('shape', { prop: 'applyFontStyle', onPropertyChange: false,
                        value: {item: 'bolditalic' }});
                } else if (!parent.activeObj.textSettings.bold && !parent.activeObj.textSettings.italic) {
                    parent.notify('shape', { prop: 'applyFontStyle', onPropertyChange: false,
                        value: {item: 'bold' }});
                }
                if (parent.element.querySelector('#' + id + '_bold').classList.contains('e-selected-btn')) {
                    parent.element.querySelector('#' + id + '_bold').classList.remove('e-selected-btn');
                } else {
                    parent.element.querySelector('#' + id + '_bold').classList.add('e-selected-btn');
                }
                if (parent.activeObj.activePoint.width !== 0 || parent.activeObj.activePoint.height !== 0) {
                    parent.notify('undo-redo', { prop: 'updateUndoRedoStack', onPropertyChange: false});
                }
                break;
            case 'italic':
                parent.notify('selection', { prop: 'setInitialTextEdit', value: {bool: false }});
                if (parent.activeObj.textSettings.bold && parent.activeObj.textSettings.italic) {
                    parent.notify('shape', { prop: 'applyFontStyle', onPropertyChange: false,
                        value: {item: 'bold' }});
                } else if (parent.activeObj.textSettings.bold && !parent.activeObj.textSettings.italic) {
                    parent.notify('shape', { prop: 'applyFontStyle', onPropertyChange: false,
                        value: {item: 'bolditalic' }});
                } else if (!parent.activeObj.textSettings.bold && parent.activeObj.textSettings.italic) {
                    parent.notify('shape', { prop: 'applyFontStyle', onPropertyChange: false,
                        value: {item: 'default' }});
                } else if (!parent.activeObj.textSettings.bold && !parent.activeObj.textSettings.italic) {
                    parent.notify('shape', { prop: 'applyFontStyle', onPropertyChange: false,
                        value: {item: 'italic' }});
                }
                if (parent.element.querySelector('#' + id + '_italic').classList.contains('e-selected-btn')) {
                    parent.element.querySelector('#' + id + '_italic').classList.remove('e-selected-btn');
                } else {
                    parent.element.querySelector('#' + id + '_italic').classList.add('e-selected-btn');
                }
                if (parent.activeObj.activePoint.width !== 0 || parent.activeObj.activePoint.height !== 0) {
                    parent.notify('undo-redo', { prop: 'updateUndoRedoStack', onPropertyChange: false});
                }
                break;
            case 'croptransform':
                this.performCropTransformClick();
                break;
            case 'rotateleft':
            case 'rotateright':
            case 'horizontalflip':
            case 'verticalflip':
                parent.transformSelect(type);
                for (let i: number = 0; i < parent.objColl.length; i++) {
                    if (parent.objColl[i as number].shape === 'redact') {
                        isRedact = true;
                        break;
                    }
                }
                if (isRedact) {
                    parent.notify('draw', { prop: 'setRedactStraighten', value: { bool: true } });
                    actObj = extend({}, parent.activeObj, {}, true) as SelectionPoint;
                    while (parent.img.destLeft < 0 || parent.img.destTop < 0) {
                        parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false });
                        parent.notify('transform', { prop: 'zoomAction', onPropertyChange: false,
                            value: { zoomFactor: -.125, zoomPoint: null, isResize: false } });
                        zoomLevel += 1;
                    }
                }
                this.updateRedactObj();
                if (isRedact) {
                    if (zoomLevel > 0) {
                        parent.isCropTab = true;
                        for (let i: number = 0; i < zoomLevel; i++) {
                            parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false });
                            parent.notify('transform', { prop: 'zoomAction', onPropertyChange: false,
                                value: { zoomFactor: .125, zoomPoint: null, isResize: false } });
                        }
                        parent.activeObj = actObj;
                        parent.notify('draw', { prop: 'drawObject', onPropertyChange: false, value: { canvas: 'duplicate' } });
                    }
                    parent.notify('draw', { prop: 'setRedactStraighten', value: { bool: false } });
                }
                if (type === 'rotateleft' || type === 'rotateright') {
                    parent.notify('draw', { prop: 'resetStraightenDestPoints' });
                    parent.notify('draw', { prop: 'setDestForStraighten' });
                }
                parent.notify('transform', { prop: 'disableZoomOutBtn', value: {isZoomOut: true }});
                if (Browser.isDevice) {this.updateContextualToolbar('color', 'straighten'); }
                actionType = type === 'rotateleft' || type === 'rotateright' ?
                    'rotate' : 'flip';
                actionArgs = { action: actionType, actionEventArgs: parent.editCompleteArgs };
                parent.triggerEditCompleteEvent(actionArgs);
                break;
            case 'save':
                parent.noPushUndo = false; parent.okBtn(); parent.drawingShape = null;
                this.saveDialogPopup();
                break;
            case 'transparency':
                this.updateContextualToolbar('transparency', 'transparency');
                break;
            case 'frame':
                this.frameToolbarClick();
                break;
            case 'none':
            case 'mat':
            case 'bevel':
            case 'line':
            case 'inset':
            case 'hook':
                this.unselectFrameBtn();
                if (parent.element.querySelector('#' + id + '_' + type)) {
                    parent.element.querySelector('#' + id + '_' + type).classList.add('e-selected-btn');
                }
                parent.frameObj.type = type;
                parent.frameObj.size = 20;
                parent.frameObj.inset = 20;
                parent.frameObj.radius = 0;
                parent.frameObj.amount = 1;
                if (type === 'inset') {parent.frameObj.offset = 60; }
                else {parent.frameObj.offset = 20; }
                this.refreshToolbar('frame');
                parent.notify('draw', { prop: 'render-image', value: { isMouseWheel: null, isPreventClearRect: null, isFrame: true } });
                parent.isFrameBtnClick = true;
                parent.curFrameObjEvent = {previousFrameSetting: parent.tempFrameObj, currentFrameSetting: parent.frameObj };
                parent.notify('draw', { prop: 'triggerFrameChange', value: { prevFrameSettings: parent.tempFrameObj, obj: {frameChangeEventArgs: null } }});
                break;
            case 'redact':
                parent.currObjType.isRedact = isRedactClick = true;
                parent.drawingShape = 'redact';
                if (isNullOrUndefined(parent.activeObj.redactBlur)) {
                    parent.activeObj.redactBlur = 20;
                }
                if (isNullOrUndefined(parent.activeObj.redactPixelate)) {
                    parent.activeObj.redactPixelate = 20;
                }
                parent.notify('selection', { prop: 'annotate', value: { shape: 'redact' } });
                this.refreshToolbar('redact');
                this.redactSlider(parent.activeObj.redactType);
                break;
            case 'pixelate':
                parent.currObjType.isRedact = isRedactClick = true;
                parent.drawingShape = 'redact';
                parent.notify('selection', { prop: 'annotate', value: { shape: 'redact' } });
                if (parent.activeObj.redactType === 'blur') {
                    this.updateRedactType('pixelate');
                }
                parent.notify('shape', { prop: 'setRedactType', onPropertyChange: false,
                    value: { redactType: 'pixelate'}});
                if (parent.activeObj.redactType === 'pixelate') {
                    const pixelateBtn: HTMLElement = parent.element.querySelector('#' + id + '_' + 'pixelate') as HTMLElement;
                    const redactBlurBtn: HTMLElement = parent.element.querySelector('#' + id + '_' + 'redactBlur') as HTMLElement;
                    if (pixelateBtn) { pixelateBtn.classList.add('e-selected-btn'); }
                    if (redactBlurBtn && redactBlurBtn.classList.contains('e-selected-btn')) {
                        redactBlurBtn.classList.remove('e-selected-btn');
                    }
                } else {
                    const redactBlurBtn: HTMLElement = parent.element.querySelector('#' + id + '_' + 'redactBlur') as HTMLElement;
                    if (redactBlurBtn) { redactBlurBtn.classList.add('e-selected-btn'); }
                }
                this.redactSlider(parent.activeObj.redactType);
                if (parent.activeObj.activePoint.width !== 0 || parent.activeObj.activePoint.height !== 0) {
                    parent.notify('undo-redo', { prop: 'updateUndoRedoColl', onPropertyChange: false,
                        value: {operation: 'shapeTransform', previousObj: null, previousObjColl: null,
                            previousPointColl: null, previousSelPointColl: null,
                            previousCropObj: null, previousText: null,
                            currentText: null, previousFilter: null, isCircleCrop: null}});
                }
                break;
            case 'redactblur':
                parent.currObjType.isRedact = isRedactClick = true;
                parent.drawingShape = 'redact';
                parent.notify('selection', { prop: 'annotate', value: { shape: 'redact' } });
                parent.notify('shape', { prop: 'setRedactType', onPropertyChange: false,
                    value: {redactType: 'blur'}});
                if (parent.activeObj.redactType === 'pixelate') {
                    this.updateRedactType('blur');
                }
                parent.notify('shape', { prop: 'setRedactType', onPropertyChange: false, value: {redactType: 'blur'}});
                if (parent.activeObj.redactType === 'blur') {
                    const redactBlurBtn: HTMLElement = parent.element.querySelector('#' + id + '_' + 'redactBlur') as HTMLElement;
                    const pixelateBtn: HTMLElement = parent.element.querySelector('#' + id + '_' + 'pixelate') as HTMLElement;
                    if (redactBlurBtn) { redactBlurBtn.classList.add('e-selected-btn'); }
                    if (pixelateBtn && pixelateBtn.classList.contains('e-selected-btn')) {
                        pixelateBtn.classList.remove('e-selected-btn');
                    }
                } else {
                    const pixelateBtn: HTMLElement = parent.element.querySelector('#' + id + '_' + 'pixelate') as HTMLElement;
                    if (pixelateBtn) {
                        pixelateBtn.classList.add('e-selected-btn');
                    }
                }
                this.redactSlider(parent.activeObj.redactType);
                if (parent.activeObj.activePoint.width !== 0 || parent.activeObj.activePoint.height !== 0) {
                    parent.notify('undo-redo', { prop: 'updateUndoRedoColl', onPropertyChange: false,
                        value: {operation: 'shapeTransform', previousObj: null, previousObjColl: null,
                            previousPointColl: null, previousSelPointColl: null,
                            previousCropObj: null, previousText: null,
                            currentText: null, previousFilter: null, isCircleCrop: null}});
                }
                break;
            }
            if (isRedactClick) {
                parent.notify('draw', { prop: 'updateTempObjColl'});
                parent.notify('draw', { prop: 'updateTempPointColl'});
            }
        }
    }

    private updateRedactType(value: string): void {
        const parent: ImageEditor = this.parent;
        parent.activeObj.redactType = value;
        parent.notify('shape', {prop: 'setRedactType', value: {type: value }});
        this.parent.objColl.push(parent.activeObj);
        parent.notify('selection', { prop: 'redrawShape', value: { obj: parent.objColl[parent.objColl.length - 1] }});
    }

    private frameToolbarClick(): void {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        const frame: HTMLElement = document.querySelector('#' + id + '_frame');
        let zoom: number; let frameObj: FrameValue; let tempFrameObj: FrameValue;
        parent.notify('draw', { prop: 'updateCropSelection', onPropertyChange: false });
        if (parent.currObjType.isFiltered || parent.currObjType.isRedact) {parent.okBtn(); }
        if (frame && !frame.classList.contains('e-overlay')) {
            zoom = parent.transform.zoomFactor;
            parent.frameDestPoints = extend({}, parent.img, {}, true) as ImageDimension;
            if (isNullOrUndefined(parent.cxtTbarHeight)) {
                frameObj = extend({}, parent.frameObj, {}, true) as FrameValue;
                tempFrameObj = extend({}, parent.tempFrameObj, {}, true) as FrameValue;
                this.callFrameToolbar(); parent.frameObj.type = 'mat'; this.callFrameToolbar();
                parent.cxtTbarHeight = parent.element.querySelector('#' + id + '_customizeWrapper').scrollHeight;
                parent.frameObj = frameObj; parent.tempFrameObj = tempFrameObj;
            }
            this.zoomToFrameRange();
            parent.tempFrameZoomLevel = zoom;
            if (Browser.isDevice) {parent.img.destTop -= (parent.cxtTbarHeight / 2); }
            else {parent.img.destTop += (parent.cxtTbarHeight / 2); }
            this.callFrameToolbar();
            parent.notify('draw', { prop: 'triggerFrameChange', value: { prevFrameSettings: parent.frameObj, obj: {frameChangeEventArgs: null } }});
        }
    }

    private zoomToFrameRange(): void {
        const parent: ImageEditor = this.parent;
        this.isFrameToolbar = false;
        parent.notify('transform', { prop: 'resetZoom', onPropertyChange: false });
        let isSmaller: boolean = true;
        while (isSmaller) {
            if (this.toolbarHeight + parent.img.destTop >= (this.toolbarHeight + parent.cxtTbarHeight)) {
                isSmaller = false;
                break;
            }
            parent.notify('transform', { prop: 'zoomAction', onPropertyChange: false,
                value: { zoomFactor: -.1, zoomPoint: null, isResize: true } });
        }
        this.isFrameToolbar = true;
    }

    private resizeClick(): void {
        const parent: ImageEditor = this.parent;
        parent.notify('draw', { prop: 'updateCropSelection', onPropertyChange: false });
        parent.upperCanvas.style.cursor = 'default';
        parent.notify('transform', { prop: 'updateResize', value: {bool: false }});
        if (this.isAspectRatio) {
            this.isAspectRatio = false;
        }
        else {
            this.isAspectRatio = true;
        }
        parent.isResize = true;
        this.refreshToolbar('resize');
    }

    private callFrameToolbar(): void {
        const parent: ImageEditor = this.parent;
        extend(parent.tempFrameObj, parent.frameObj);
        const undoRedoObj: Object = {appliedUndoRedoColl: [] as Transition[] };
        parent.notify('undo-redo', {prop: 'getAppliedUndoRedoColl', value: {obj: undoRedoObj }});
        if (undoRedoObj['appliedUndoRedoColl']['length'] === 0) {
            const object: Object = {currObj: {} as CurrentObject };
            parent.notify('filter', { prop: 'getCurrentObj', onPropertyChange: false, value: {object: object }});
            parent.notify('undo-redo', {prop: 'updateUndoRedoColl', onPropertyChange: false, value: {
                operation: 'frame', previousObj: object['currObj'], previousObjColl: object['currObj']['objColl'],
                previousPointColl: object['currObj']['pointColl'], previousSelPointColl: object['currObj']['selPointColl'],
                previousCropObj: extend({}, parent.cropObj, {}, true) as CurrentObject, previousText: null, currentText: null,
                previousFilter: null, isCircleCrop: null }});
        }
        this.refreshToolbar('frame');
    }

    private contextualToolbarClicked(args: ClickEventArgs): void {
        const parent: ImageEditor = this.parent;
        const selEle: HTMLElement = parent.element.querySelector('.e-contextual-toolbar-wrapper .e-toolbar-item.e-selected');
        if (selEle) {
            selEle.classList.remove('e-selected');
        }
        const type: string = args.item.id.replace(parent.element.id, '').split('_')[1];
        const imageFiltering: ImageFilterEventArgs = { filter: parent.toPascalCase(type) as ImageFilterOption, cancel: false};
        parent.trigger('imageFiltering', imageFiltering);
        parent.editCompleteArgs = imageFiltering;
        if (imageFiltering.cancel) { return; }
        document.getElementById(args.item.id + 'Canvas').parentElement.parentElement.classList.add('e-selected');
        parent.currObjType.isFiltered = true;
        parent.notify('filter', { prop: 'applyImageFilter', value: { option: type.toLowerCase() } });
        parent.notify('draw', { prop: 'redrawDownScale' });
        parent.currentFilter = args.item.id;
        this.enableDisableTbrBtn();
        parent.isFilterCanvasClick = true;
        parent.curFilterObjEvent = imageFiltering;
    }

    private refreshShapeDrawing(): void {
        const parent: ImageEditor = this.parent;
        const object: Object = {shape: '' };
        parent.notify('selection', { prop: 'getCurrentDrawingShape', onPropertyChange: false, value: {obj: object }});
        if (object['shape'] !== '') {
            parent.notify('selection', { prop: 'setCurrentDrawingShape', onPropertyChange: false, value: {value: '' }});
            parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
            this.refreshToolbar('main', false);
        }
    }

    private zoomInBtnClickHandler(e: MouseEvent & TouchEvent): void {
        if (e) {
            const parent: ImageEditor = this.parent;
            if ((parent.zoomSettings.zoomTrigger & ZoomTrigger.Toolbar) === ZoomTrigger.Toolbar) {
                parent.noPushUndo = false;
                if (parent.currObjType.isFiltered) {parent.okBtn(); }
                const drawingShape: string = parent.drawingShape;
                if (parent.drawingShape) {
                    const id: string = parent.activeObj.currIndex;
                    parent.noPushUndo = true;
                    parent.okBtn();
                    parent.noPushUndo = false;
                    parent.drawingShape = null;
                    if (id) {parent.selectShape(id); }
                }
                this.refreshShapeDrawing();
                if (Browser.isDevice && e.type === 'touchstart') {
                    if (!e.returnValue) {
                        return;
                    }
                    e.preventDefault();
                }
                const zoomIn: HTMLElement = document.querySelector('#' + parent.element.id + '_zoomIn');
                EventHandler.trigger(zoomIn, 'click');
                const obj: Object = {bool: false };
                parent.notify('selection', { prop: 'getFreehandDrawEditing', onPropertyChange: false, value: {obj: obj }});
                if (obj['bool']) {
                    parent.notify('freehand-draw', {prop: 'applyFhd', onPropertyChange: false});
                    this.destroyQuickAccessToolbar();
                }
                parent.isZoomBtnClick = true;
                this.applyPreviewFilter();
                parent.currObjType.isFiltered = false;
                parent.currObjType.isRedact = false;
                if (parent.togglePen) {
                    parent.currObjType.isZoomed = true;
                    parent.freeHandDraw(false);
                    parent.notify('undo-redo', {prop: 'updateCurrUrc', value: {type: 'ok' }});
                }
                parent.notify('draw', {prop: 'resetCurrentSelectionPoint' });
                parent.drawingShape = drawingShape;
                parent.notify('transform', { prop: 'zoomAction', onPropertyChange: false,
                    value: {zoomFactor: .1, zoomPoint: null, isResize: null }});
                parent.notify('draw', { prop: 'redrawDownScale' });
                if (parent.isCropTab || parent.activeObj.shape) {
                    parent.notify('draw', { prop: 'setStraightenActObj', value: {activeObj: null }});
                    parent.notify('freehand-draw', { prop: 'resetStraightenPoint' });
                }
                if (parent.isStraightening) {
                    parent.notify('draw', { prop: 'resetStraightenDestPoints' });
                    parent.notify('draw', { prop: 'setDestForStraighten' });
                }
                const actionArgs: EditCompleteEventArgs  = { action: 'zoom-in',
                    actionEventArgs: parent.editCompleteArgs };
                parent.triggerEditCompleteEvent(actionArgs);
                if (Browser.isDevice) {zoomIn.focus(); }
            }
        }
    }

    private zoomOutBtnClickHandler(e: MouseEvent & TouchEvent): void {
        if (e) {
            const parent: ImageEditor = this.parent;
            if ((parent.zoomSettings.zoomTrigger & ZoomTrigger.Toolbar) === ZoomTrigger.Toolbar) {
                parent.noPushUndo = false;
                if (parent.currObjType.isFiltered) {parent.okBtn(); }
                const drawingShape: string = parent.drawingShape;
                if (parent.drawingShape) {
                    const id: string = parent.activeObj.currIndex;
                    parent.noPushUndo = true;
                    parent.okBtn();
                    parent.noPushUndo = false;
                    parent.drawingShape = null;
                    if (id) {parent.selectShape(id); }
                }
                this.refreshShapeDrawing();
                if (Browser.isDevice && e.type === 'touchstart') {
                    if (!e.returnValue) {
                        return;
                    }
                    e.preventDefault();
                }
                const zoomOut: HTMLElement = document.querySelector('#' + parent.element.id + '_zoomOut');
                EventHandler.trigger(zoomOut, 'click');
                const obj: Object = {bool: false };
                parent.notify('selection', { prop: 'getFreehandDrawEditing', onPropertyChange: false, value: {obj: obj }});
                if (obj['bool']) {
                    parent.notify('freehand-draw', {prop: 'applyFhd', onPropertyChange: false});
                    this.destroyQuickAccessToolbar();
                }
                parent.isZoomBtnClick = true;
                this.applyPreviewFilter();
                parent.currObjType.isFiltered = false;
                parent.currObjType.isRedact = false;
                if (parent.togglePen) {
                    parent.currObjType.isZoomed = true;
                    parent.freeHandDraw(false);
                    parent.notify('undo-redo', {prop: 'updateCurrUrc', value: {type: 'ok' }});
                }
                parent.notify('draw', {prop: 'resetCurrentSelectionPoint' });
                parent.drawingShape = drawingShape;
                parent.notify('transform', { prop: 'zoomAction', onPropertyChange: false,
                    value: {zoomFactor: -.1, zoomPoint: null, isResize: null }});
                parent.notify('draw', { prop: 'redrawDownScale' });
                if (parent.isCropTab || parent.activeObj.shape) {
                    parent.notify('draw', { prop: 'setStraightenActObj', value: {activeObj: null }});
                    parent.notify('freehand-draw', { prop: 'resetStraightenPoint' });
                }
                if (parent.isStraightening) {
                    parent.notify('draw', { prop: 'resetStraightenDestPoints' });
                    parent.notify('draw', { prop: 'setDestForStraighten' });
                }
                const actionArgs: EditCompleteEventArgs  = { action: 'zoom-out',
                    actionEventArgs: parent.editCompleteArgs };
                parent.triggerEditCompleteEvent(actionArgs);
                if (Browser.isDevice) {zoomOut.focus(); }
            }
        }
    }

    private zoomInBtnMouseDownHandler(e: MouseEvent & TouchEvent): void {
        e.preventDefault();
        this.zoomBtnHold = setInterval(this.zoomInBtnClickHandler.bind(this), 250);
    }

    private zoomOutBtnMouseDownHandler(e: MouseEvent & TouchEvent): void {
        e.preventDefault();
        this.zoomBtnHold = setInterval(this.zoomOutBtnClickHandler.bind(this), 250);
    }

    private zoomBtnMouseUpHandler(): void {
        clearInterval(this.zoomBtnHold);
        this.zoomBtnHold = 0;
    }

    private closeContextualToolbar(): boolean {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        let isContextualToolbar: boolean = false;
        const straightenObj: Object = {bool: parent.isStraightening };
        if (!Browser.isDevice || (Browser.isDevice && !straightenObj['bool'])) {
            if ((parent.element.querySelector('#' + id + '_contextualToolbar') &&
                !parent.element.querySelector('#' + id + '_contextualToolbar').parentElement.classList.contains('e-hide')) ||
                (parent.element.querySelector('#' + id + '_headWrapper')
                && !parent.element.querySelector('#' + id + '_headWrapper').parentElement.classList.contains('e-hide'))) {
                parent.element.querySelector('.e-contextual-toolbar-wrapper').classList.add('e-hide');
                parent.okBtn();
                this.refreshMainToolbar();
                isContextualToolbar = true;
            }
        }
        return isContextualToolbar;
    }

    private destroyQuickAccessToolbar(): void {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        const quickToolbar: HTMLElement = document.getElementById(id + '_quickAccessToolbar');
        if (quickToolbar && quickToolbar.classList.contains('e-control')) {
            (getComponent(quickToolbar, 'toolbar') as Toolbar).destroy();
        }
        const qatArea: HTMLElement = document.getElementById(id + '_quickAccessToolbarArea');
        if (qatArea) {
            qatArea.style.display = 'none';
        }
    }

    private renderSlider(type: string, isSelect?: boolean): void {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        const canvasWrapper: HTMLElement = document.querySelector('#' + id + '_contextualToolbarArea');
        let hdrWrapper: HTMLElement = document.querySelector('#' + id + '_headWrapper');
        let labelWrapper: HTMLElement = document.querySelector('#' + id + '_labelWrapper');
        if (hdrWrapper) {
            hdrWrapper.remove(); labelWrapper.remove();
        }
        hdrWrapper = canvasWrapper.appendChild(parent.createElement('div', {
            id: id + '_headWrapper',
            styles: 'position: relative'
        }));
        if (type === 'transparency') {
            labelWrapper = hdrWrapper.appendChild(parent.createElement('label', {
                id: id + '_labelWrapper',
                className: 'e-ie-finetune-slider-label',
                styles: Browser.isDevice ? 'position: absolute; top: 31%; left: calc(50% - 150px); font-size: 15px; text-transform: capitalize; font-weight: 400;'
                    : 'position: absolute; top: 31%; left: calc(50% - 220px); font-size: 15px; text-transform: capitalize; font-weight: 400;'
            }));
        } else {
            labelWrapper = hdrWrapper.appendChild(parent.createElement('label', {
                id: id + '_labelWrapper',
                className: 'e-ie-finetune-slider-label',
                styles: Browser.isDevice ? ('position: absolute; top: 31%; left: calc(50% - 160px); font-size: 15px; text-transform: capitalize; font-weight: 400;')
                    : 'position: absolute; top: 25%; left: calc(50% - 226px); font-size: 15px; text-transform: capitalize; font-weight: 400;'
            }));
        }
        labelWrapper.textContent = this.l10n.getConstant(parent.toPascalCase(type === 'transparency' ? 'opacity' : type));
        const sliderWrapper: HTMLElement = hdrWrapper.appendChild(parent.createElement('div', {
            id: id + '_sliderWrapper',
            className: 'e-ie-finetune-slider-wrap',
            styles: 'position: absolute'
        }));
        let value: number = parent.getCurrAdjustmentValue(type);
        if (isSelect && type === 'straighten' && Browser.isDevice) {
            value = parent.cropObj.straighten;
        }
        let min: number; let max: number;
        let slider: Slider;
        if (type === 'brightness' || type === 'contrast' || type === 'saturation' || type === 'exposure') {
            if (parent.finetuneSettings) {
                if (type === 'brightness' && parent.finetuneSettings.brightness) {
                    min = parent.finetuneSettings.brightness.min; max = parent.finetuneSettings.brightness.max;
                } else if (type === 'contrast' && parent.finetuneSettings.contrast) {
                    min = parent.finetuneSettings.contrast.min; max = parent.finetuneSettings.contrast.max;
                } else if (type === 'saturation' && parent.finetuneSettings.saturation) {
                    min = parent.finetuneSettings.saturation.min; max = parent.finetuneSettings.saturation.max;
                } else if (type === 'exposure' && parent.finetuneSettings.exposure) {
                    min = parent.finetuneSettings.exposure.min; max = parent.finetuneSettings.exposure.max;
                } else {
                    min = -100; max = 100;
                }
            } else {
                min = -100; max = 100;
            }
            slider = this.createSlider(min, max, value, type);
        }
        else if (type === 'hue' || type === 'blur' || type === 'opacity') {
            if (parent.finetuneSettings) {
                if (type === 'hue' && parent.finetuneSettings.hue) {
                    min = parent.finetuneSettings.hue.min; max = parent.finetuneSettings.hue.max;
                } else if (type === 'blur' && parent.finetuneSettings.blur) {
                    min = parent.finetuneSettings.blur.min; max = parent.finetuneSettings.blur.max;
                } else if (type === 'opacity' && parent.finetuneSettings.opacity) {
                    min = parent.finetuneSettings.opacity.min; max = parent.finetuneSettings.opacity.max;
                } else {
                    min = 0; max = 100;
                }
            } else {
                min = 0; max = 100;
            }
            slider = this.createSlider(min, max, value, type);
        } else if (type === 'transparency') {
            min = 0; max = 100;
            slider = this.createSlider(min, max, value, type);
        } else if (type === 'straighten') {
            min = -45; max = 45;
            slider = this.createSlider(min, max, value, type);
        }
        slider.appendTo('#' + id + '_sliderWrapper');
        sliderWrapper.style.left = (parseFloat(canvasWrapper.style.width) - parseFloat(slider.width as string)) / 2 + 'px';
        if (type === 'straighten' && Browser.isDevice) {
            const sLabelWrapper: HTMLElement = hdrWrapper.appendChild(parent.createElement('label', {
                id: id + '_sLabelWrapper',
                className: 'e-ie-straighten-value-span e-ie-finetune-value-span',
                styles: 'position: absolute; top: 31%; margin-left: 20px; font-size: 15px; text-transform: capitalize; font-weight: 400;'
            }));
            sLabelWrapper.innerHTML = parent.transform.straighten.toString() + '&#176';
            sliderWrapper.parentElement.classList.add('e-straighten-slider');
        }
        if (type !== 'straighten') {
            hdrWrapper.appendChild(parent.createElement('label', {
                id: id + '_finetuneSpan',
                className: 'e-ie-finetune-value-span',
                styles: Browser.isDevice ? ('position: absolute; top: 25%; margin-left: 20px; font-size: 15px; text-transform: capitalize; font-weight: 400;') :
                    'position: absolute; top: 25%; left: calc(50% + 190px); font-size: 15px; text-transform: capitalize; font-weight: 400;'
            }));
            sliderWrapper.parentElement.classList.add('e-finetune-slider');
            if (type === 'transparency' && Browser.isDevice) {
                sliderWrapper.parentElement.classList.add('e-ie-device-transparency-slider');
            }
            this.updateFinetuneSpan(type);
        }
    }

    private createSlider(min: number, max: number, value: number, type: string): Slider {
        const parent: ImageEditor = this.parent;
        const step: number = type === 'straighten' ? 3 : 1;
        return new Slider({
            value: value, type: 'MinRange', min: min, max: max,
            step: step, width: Browser.isDevice ? '180px' : (type === 'straighten' ? '200px' : '300px'),
            cssClass: 'e-slider',
            change: (args: SliderChangeEventArgs): void => {
                parent.notify('selection', { prop: 'setSliderActive', onPropertyChange: false, value: {bool: true }});
                if (type === 'transparency') {
                    if (parent.activeObj.shape) {
                        if (isNullOrUndefined(parent.activeObj.imageRatio)) {
                            parent.notify('shape', { prop: 'updImgRatioForActObj', onPropertyChange: false});
                        }
                        parent.notify('shape', { prop: 'pushActItemIntoObj'});
                        const prevCropObj: CurrentObject = extend({}, parent.cropObj, {}, true) as CurrentObject;
                        const object: Object = {currObj: {} as CurrentObject };
                        parent.notify('filter', { prop: 'getCurrentObj', onPropertyChange: false, value: {object: object }});
                        const prevObj: CurrentObject = object['currObj'];
                        prevObj.objColl = extend([], parent.objColl, [], true) as SelectionPoint[];
                        prevObj.pointColl = extend([], parent.pointColl, [], true) as Point[];
                        prevObj.afterCropActions = extend([], parent.afterCropActions, [], true) as string[];
                        const selPointCollObj: Object = {selPointColl: null };
                        parent.notify('freehand-draw', { prop: 'getSelPointColl', onPropertyChange: false,
                            value: {obj: selPointCollObj }});
                        prevObj.selPointColl = extend([], selPointCollObj['selPointColl'], [], true) as Point[];
                        parent.objColl.pop();
                        parent.activeObj.opacity = args.value as number / 100;
                        this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
                        parent.notify('draw', { prop: 'drawObject', onPropertyChange: false, value: {canvas: 'duplicate' }});
                        parent.objColl.push(parent.activeObj);
                        parent.notify('undo-redo', { prop: 'updateUndoRedoColl', onPropertyChange: false,
                            value: {operation: 'shapeTransform', previousObj: prevObj, previousObjColl: prevObj.objColl,
                                previousPointColl: prevObj.pointColl, previousSelPointColl: prevObj.selPointColl,
                                previousCropObj: prevCropObj, previousText: null,
                                currentText: null, previousFilter: null, isCircleCrop: null}});
                        parent.notify('selection', { prop: 'redrawShape', value: { obj: parent.objColl[parent.objColl.length - 1] }});
                        this.updateFinetuneSpan(type);
                    }
                } else if (type === 'straighten') {
                    parent.setStraighten(args.value as number);
                } else {
                    if (parent.transform.zoomFactor && parent.transform.zoomFactor < 0) {parent.isFinetuning = true; }
                    parent.notify('selection', { prop: 'setSliding', value: { bool: true }});
                    parent.setCurrAdjustmentValue(type, args.value as number);
                    this.updateFinetuneSpan(type);
                    this.enableDisableTbrBtn();
                    parent.isFinetuning = false;
                }
            },
            changed: (): void => {
                if (type !== 'transparency' && type !== 'straighten') {
                    parent.notify('selection', { prop: 'setSliding', value: { bool: false }});
                    parent.notify('draw', { prop: 'redrawDownScale' });
                }
                parent.notify('selection', { prop: 'setSliderActive', onPropertyChange: false, value: {bool: false }});
                if (type === 'transparency') {
                    setTimeout((): void => {
                        parent.notify('undo-redo', { prop: 'updateUndoRedoStack', onPropertyChange: false});
                        (parent.element.querySelector('#' + parent.element.id + '_transparency') as HTMLInputElement).click();
                    }, 50);
                }
            }
        });
    }

    private updateFinetuneSpan(type: string): void {
        const parent: ImageEditor = this.parent;
        const ftValPan: HTMLElement = parent.element.querySelector('.e-ie-finetune-value-span');
        if (ftValPan) {
            const adjObj: Object = {adjustmentLevel: null  };
            parent.notify('filter', { prop: 'getAdjustmentLevel', onPropertyChange: false, value: {obj: adjObj }});
            ftValPan.innerHTML = Math.round(adjObj['adjustmentLevel'][type as string]).toString();
        }
    }

    private applyPreviewFilter(): void {
        const parent: ImageEditor = this.parent;
        if (document.querySelector('#' + parent.element.id + '_sliderWrapper') ||
            parent.currObjType.isFiltered) {
            parent.initialAdjustmentValue = this.lowerContext.filter;
            parent.canvasFilter = this.lowerContext.filter;
            parent.currObjType.isFiltered = false;
        }
    }

    private unselectBtn(): void {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        const selectors: string[] = [
            '#' + id + '_brightness',
            '#' + id + '_contrast',
            '#' + id + '_hue',
            '#' + id + '_saturation',
            '#' + id + '_opacity',
            '#' + id + '_blur',
            '#' + id + '_exposure'
        ];
        for (const selector of selectors) {
            const element: HTMLElement = document.querySelector(selector);
            if (element && element.classList.contains('e-selected-btn')) {
                element.classList.remove('e-selected-btn');
                break;
            }
        }
    }

    private openSlider(type: string): void {
        this.unselectBtn();
        this.parent.currObjType.isFiltered = true;
        this.refreshToolbar('color', null, null, null, type);
        document.getElementById(this.parent.element.id + '_' + type).classList.add('e-selected-btn');
    }

    private refreshSlider():  void {
        const id: string = this.parent.element.id;
        const sliderWrapper: HTMLElement = document.querySelector('#' + id + '_sliderWrapper');
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const slider: any = document.querySelector('.e-slider');
        const hdrWrapper: HTMLElement = document.querySelector('#' + id + '_headWrapper');
        if (hdrWrapper) {
            hdrWrapper.style.display = 'none';
        }
        if (sliderWrapper && slider) {
            slider.ej2_instances[0].destroy();
            sliderWrapper.remove();
        }
    }

    private unselectFrameBtn(): void {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        const selectors: string[] = [
            '#' + id + '_none',
            '#' + id + '_mat',
            '#' + id + '_line',
            '#' + id + '_inset',
            '#' + id + '_bevel',
            '#' + id + '_hook'
        ];
        for (const selector of selectors) {
            const element: HTMLElement = document.querySelector(selector);
            if (element.classList.contains('e-selected-btn')) {
                element.classList.remove('e-selected-btn');
                break;
            }
        }
    }

    private updateToolbarItems(): void {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        if (!parent.isImageLoaded) {return; }
        if (this.isToolbar()) {
            const selFillElem: HTMLElement = parent.element.querySelector('.e-fill.e-template .e-dropdownbtn-preview') as HTMLElement;
            const selStrokeElem: HTMLElement = parent.element.querySelector('.e-stroke.e-template .e-dropdownbtn-preview') as HTMLElement;
            const selTextStrokeElem: HTMLElement = parent.element.querySelector('.e-text-font-color.e-template .e-dropdownbtn-preview') as HTMLElement;
            const selStrokeTextColorElem: HTMLElement = parent.element.querySelector('.e-stroke-text-font-color.e-template .e-dropdownbtn-preview') as HTMLElement;
            const selTextBGElem: HTMLElement = parent.element.querySelector('.e-text-background-color.e-template .e-dropdownbtn-preview') as HTMLElement;
            const selPenStrokeElem: HTMLElement = parent.element.querySelector('.e-pen-stroke-color.e-template .e-dropdownbtn-preview') as HTMLElement;
            const strokeWidthElem: HTMLElement = parent.element.querySelector('.e-shape-stroke-width') as HTMLElement;
            const rectangleRadiusElem: HTMLElement = parent.element.querySelector('.e-shape-rectangle-radius') as HTMLElement;
            const fontFamilyElem: HTMLElement = parent.element.querySelector('.e-text-font-family') as HTMLElement;
            const fontSizeElem: HTMLElement = parent.element.querySelector('.e-text-font-size') as HTMLElement;
            const boldBtn: HTMLElement = parent.element.querySelector('#' + id + '_bold') as HTMLElement;
            const italicBtn: HTMLElement = parent.element.querySelector('#' + id + '_italic') as HTMLElement;
            if (parent.activeObj.strokeSettings && parent.activeObj.textSettings) {
                if (isNullOrUndefined(parent.activeObj.strokeSettings.strokeWidth)) {
                    parent.activeObj.strokeSettings.strokeWidth = 2;
                }
                if (isNullOrUndefined(parent.activeObj.strokeSettings.outlineWidth)) {
                    parent.activeObj.strokeSettings.outlineWidth = 2;
                }
                if (selFillElem) {
                    const value: string = parent.activeObj.strokeSettings.fillColor;
                    if (parent.activeObj.strokeSettings.fillColor === '') {
                        selFillElem.classList.add('e-nocolor-item');
                    } else {
                        selFillElem.classList.remove('e-nocolor-item');
                        selFillElem.style.background = value;
                    }
                    if (document.querySelector('#' + id + '_shape_fill')) {
                        (getComponent(id + '_shape_fill', 'colorpicker') as ColorPicker).value = value;
                    }
                }
                if (selStrokeElem) {
                    const value: string = parent.activeObj.strokeSettings.strokeColor;
                    selStrokeElem.style.background = value;
                    if (document.querySelector('#' + id + '_shape_stroke')) {
                        (getComponent(id + '_shape_stroke', 'colorpicker') as ColorPicker).value = value;
                    }
                }
                if (selTextStrokeElem) {
                    const value: string = parent.activeObj.strokeSettings.strokeColor;
                    selTextStrokeElem.style.background = value;
                    if (document.querySelector('#' + id + '_text_font')) {
                        (getComponent(id + '_text_font', 'colorpicker') as ColorPicker).value = value;
                    }
                }
                if (selStrokeTextColorElem) {
                    const value: string = parent.activeObj.strokeSettings.outlineColor;
                    if (!/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$|^[a-zA-Z]+$/.test(parent.activeObj.strokeSettings.outlineColor)) {
                        selStrokeTextColorElem.classList.add('e-nocolor-item');
                    } else {
                        selStrokeTextColorElem.classList.remove('e-nocolor-item');
                        selStrokeTextColorElem.style.background = value;
                    }
                    if (document.querySelector('#' + id + '_stroke_text')) {
                        (getComponent(id + '_stroke_text', 'colorpicker') as ColorPicker).value = value;
                    }
                }
                if (selTextBGElem) {
                    const value: string = parent.activeObj.strokeSettings.fillColor;
                    if (parent.activeObj.strokeSettings.fillColor === '' || parent.activeObj.strokeSettings.fillColor === 'transparent') {
                        selTextBGElem.classList.add('e-nocolor-item');
                    } else {
                        selTextBGElem.classList.remove('e-nocolor-item');
                        selTextBGElem.style.background = value;
                    }
                    if (document.querySelector('#' + id + '_text_bgColor')) {
                        (getComponent(id + '_text_bgColor', 'colorpicker') as ColorPicker).value = value;
                    }
                }
                if (selPenStrokeElem) {
                    const value: string = parent.activeObj.strokeSettings.strokeColor;
                    selPenStrokeElem.style.background = value;
                    if (document.querySelector('#' + id + '_pen_stroke')) {
                        (getComponent(id + '_pen_stroke', 'colorpicker') as ColorPicker).value = value;
                    }
                    const obj: Object = {penOpacity: 1 };
                    parent.notify('freehand-draw', { prop: 'getPenOpacity', onPropertyChange: false, value: { obj: obj } });
                }
                if (fontFamilyElem) {
                    if (Browser.isDevice) {
                        fontFamilyElem.setAttribute('style', 'font-family:' + parent.activeObj.textSettings.fontFamily.toLowerCase());
                    } else {
                        fontFamilyElem.textContent = parent.activeObj.textSettings.fontFamily;
                    }
                }
                if (fontSizeElem) {
                    for (let i: number = 0; i < parent.fontSizeColl.length; i++) {
                        if (parseInt(parent.fontSizeColl[i as number].text, 10) >= Math.round(parent.activeObj.textSettings.fontSize)) {
                            fontSizeElem.textContent = (i + 1).toString();
                            break;
                        } else {
                            if (Math.round(parent.activeObj.textSettings.fontSize) < parseInt(parent.fontSizeColl[0].text, 10)) {
                                fontSizeElem.textContent = '1';
                                break;
                            } else if (Math.round(parent.activeObj.textSettings.fontSize) >
                                parseInt(parent.fontSizeColl[parent.fontSizeColl.length - 1].text, 10)) {
                                fontSizeElem.textContent = ((parent.fontSizeColl.length - 1) + 1).toString();
                                break;
                            }
                        }
                    }
                }
                if (boldBtn) {
                    if (parent.activeObj.textSettings.bold) {
                        boldBtn.classList.add('e-selected-btn');
                    } else {
                        boldBtn.classList.remove('e-selected-btn');
                    }
                }
                if (italicBtn) {
                    if (parent.activeObj.textSettings.italic) {
                        italicBtn.classList.add('e-selected-btn');
                    } else {
                        italicBtn.classList.remove('e-selected-btn');
                    }
                }
                if (strokeWidthElem) {
                    const width: number = parent.activeObj.shape === 'text' ? parent.activeObj.strokeSettings.outlineWidth : parent.activeObj.strokeSettings.strokeWidth;
                    const strokeWidth: string = Math.round(width).toString();
                    strokeWidthElem.textContent = this.getStrokeWidth(strokeWidth);
                }
                if (rectangleRadiusElem) {
                    const rectRadius: string = Math.round((parent.activeObj.strokeSettings.radius)).toString();
                    rectangleRadiusElem.textContent = this.getRectRadius(rectRadius);
                }
            }
        }
    }

    private getStrokeWidth(text: string): string {
        let strokeWidth: string;
        const currentWidth: number = parseInt(text, 10) / 2;
        switch (currentWidth) {
        case 0:
            strokeWidth = this.l10n.getConstant('NoOutline');
            break;
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

    private getRectRadius(text: string): string {
        let rectRadius: string;
        const currentWidth: number = parseInt(text, 10) / 2;
        switch (currentWidth) {
        case 0:
            rectRadius = this.l10n.getConstant('0');
            break;
        case 1:
            rectRadius = this.l10n.getConstant('20');
            break;
        case 2:
            rectRadius = this.l10n.getConstant('40');
            break;
        case 3:
            rectRadius = this.l10n.getConstant('60');
            break;
        case 4:
            rectRadius = this.l10n.getConstant('80');
            break;
        case 5:
            rectRadius = this.l10n.getConstant('100');
            break;
        }
        return rectRadius;
    }

    private cancelPan(): void {
        const parent: ImageEditor = this.parent;
        parent.notify('shape', { prop: 'applyActObj', onPropertyChange: false, value: {isMouseDown: true}});
        const panBtn: HTMLElement = parent.element.querySelector('.e-img-pan .e-btn');
        if (panBtn) {
            panBtn.classList.remove('e-selected-btn');
        }
        parent.pan(false);
    }

    private refreshMainToolbar(): void {
        if (this.currToolbar !== 'main') {
            this.refreshToolbar('main');
        }
    }

    private destroySubComponents(): void {
        const parent: ImageEditor = this.parent;
        const inputElement: NodeListOf<HTMLElement> = parent.element.querySelectorAll('input.e-control') as NodeListOf<HTMLElement>;
        const btnElement: NodeListOf<HTMLElement> = parent.element.querySelectorAll('button.e-control');
        for (let i: number = 0, len: number = inputElement.length; i < len; i++) {
            if (inputElement[i as number].classList.contains('e-color-picker')) {
                (getComponent(inputElement[i as number], 'color-picker') as ColorPicker).destroy();
                detach(select('input#' + inputElement[i as number].id, parent.element));
            }
        }
        for (let i: number = 0, len: number = btnElement.length; i < len; i++) {
            if (btnElement[i as number].classList.contains('e-dropdown-btn')) {
                (getComponent(btnElement[i as number], 'dropdown-btn') as DropDownButton).destroy();
                detach(select('button#' + btnElement[i as number].id, parent.element));
            } else if (btnElement[i as number].classList.contains('e-btn')) {
                (getComponent(btnElement[i as number], 'btn') as Button).destroy();
                detach(select('button#' + btnElement[i as number].id, parent.element));
            }
        }
    }

    private setInitialShapeSettings(args: MenuEventArgs): void {
        const parent: ImageEditor = this.parent;
        parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
        parent.currObjType.shape = args.item.id;
        parent.activeObj.shape = parent.currObjType.shape.toLowerCase();
        parent.currObjType.isDragging = parent.currObjType.isCustomCrop = false;
        parent.activeObj.shapeDegree = parent.transform.degree;
        parent.activeObj.shapeFlip = parent.transform.currFlipState;
        parent.activeObj.textFlip = parent.transform.currFlipState;
        parent.activeObj.flipObjColl = [];
        const orderObj: Object = {order: null };
        parent.notify('shape', { prop: 'getNewOrder', onPropertyChange: false, value: {obj: orderObj } });
        parent.activeObj.order = orderObj['order'];
    }

    private isToolbarString(items: (string | ItemModel)[]): boolean {
        let isString: boolean = false;
        for (let i: number = 0; i < items.length; i++) {
            if (typeof(items[i as number]) === 'string') {
                isString = true;
                break;
            }
        }
        return isString;
    }

    private excludeItems(items: (string | ItemModel)[]): void {
        const indexArr: number[] = [];
        for (let i: number = 0; i < items.length; i++) {
            const index: number = this.getIndex(items[i as number]);
            if (index !== -1) {
                indexArr.push(index);
            }
        }
        const negativeIndexArr: number[] = [];
        for (let i: number = 0; i < this.defToolbarItems.length; i++) {
            if (this.defToolbarItems[i as number].align === 'Center' && !this.isSameIndex(indexArr, i) &&
                this.defToolbarItems[i as number].id !== this.parent.element.id + '_' + 'annotation') {
                negativeIndexArr.push(i);
            }
        }
        for (let i: number = negativeIndexArr.length - 1; i >= 0; i--) {
            this.defToolbarItems.splice(negativeIndexArr[i as number], 1);
        }
    }

    private isSameIndex(indexArr: number[], index: number): boolean {
        for (let i: number = 0; i < indexArr.length; i++) {
            if (indexArr[i as number] === index) {
                return true;
            }
        }
        return false;
    }

    private getIndex(item: string | ItemModel): number {
        let index: number = -1; let isFontColor: boolean = false;
        if (item === 'rotateLeft') {item = 'rotLeft'; }
        if (item === 'rotateRight') {item = 'rotRight'; }
        if (item === 'horizontalFlip') {item = 'hflip'; }
        if (item === 'verticalFlip') {item = 'vflip'; }
        if (item === 'arrowStart') {item = 'start'; }
        if (item === 'arrowEnd') {item = 'end'; }
        if (item === 'fontColor') {item = 'strokeColor'; isFontColor = true; }
        for (let i: number = 0; i < this.defToolbarItems.length; i++) {
            const id: string = this.defToolbarItems[i as number].id;
            if (id && id.toLowerCase().indexOf((item as string).toLowerCase()) !== -1) {
                index = i;
                break;
            }
        }
        if (isFontColor) {item = 'fontColor'; }
        return index;
    }

    public getModuleName(): string {
        return 'toolbar-module';
    }

    private redactSlider(type: string): void {
        const parent: ImageEditor = this.parent; const id: string = parent.element.id;
        const toolbarArea: Element = parent.element.querySelector('#' + id + '_toolbarArea');
        const contextualToolbarArea: Element = parent.element.querySelector('#' + id + '_contextualToolbarArea');
        if (!contextualToolbarArea) { return; }
        contextualToolbarArea.classList.remove('e-hide');
        (contextualToolbarArea as HTMLElement).style.left = (toolbarArea as HTMLElement).offsetLeft + 'px';
        const canvasWrapper: HTMLElement = document.querySelector('#' + id + '_contextualToolbarArea');
        let hdrWrapper: HTMLElement = document.querySelector('#' + id + '_headWrapper');
        let labelWrapper: HTMLElement = document.querySelector('#' + id + '_labelWrapper');
        const ctxTbar: HTMLElement = document.querySelector('#' + id + '_contextualToolbar');
        if (hdrWrapper) {
            hdrWrapper.remove(); labelWrapper.remove();
        }
        if (ctxTbar) {
            ctxTbar.remove();
            this.createContextualToolbar();
        }
        hdrWrapper = canvasWrapper.appendChild(parent.createElement('div', {
            id: id + '_headWrapper',
            styles: 'position: relative'
        }));
        labelWrapper = hdrWrapper.appendChild(parent.createElement('label', {
            id: id + '_labelWrapper',
            className: 'e-ie-finetune-slider-label',
            styles: Browser.isDevice ? ('position: absolute; top: 31%; left: calc(50% - 160px); font-size: 15px; text-transform: capitalize; font-weight: 400;')
                : 'position: absolute; top: 25%; left: calc(50% - 226px); font-size: 15px; text-transform: capitalize; font-weight: 400;'
        }));
        const text: string = type === 'blur' ? this.l10n.getConstant('Blur') : this.l10n.getConstant('PixelSize');
        labelWrapper.textContent = text;
        const sliderWrapper: HTMLElement = hdrWrapper.appendChild(parent.createElement('div', {
            id: id + '_sliderWrapper',
            className: 'e-ie-finetune-slider-wrap',
            styles: 'position: absolute'
        }));
        hdrWrapper.appendChild(parent.createElement('label', {
            id: id + '_redactSpan',
            className: 'e-ie-redact-value-span',
            styles: Browser.isDevice ? ('position: absolute; top: 30%; margin-left: 20px; font-size: 15px; text-transform: capitalize; font-weight: 400;') :
                'position: absolute; top: 30%; left: calc(50% + 190px); font-size: 15px; text-transform: capitalize; font-weight: 400;'
        }));
        sliderWrapper.parentElement.classList.add('e-finetune-slider');
        const value: number = parent.activeObj.redactType === 'blur' ? parent.activeObj.redactBlur :
            parent.activeObj.redactPixelate;
        const redactSlider: Slider = new Slider({
            tooltip: { placement: 'Before', isVisible: true, showOn: 'Focus' },
            min: 10, max: 100, step: 1, value: value,
            type: 'MinRange',
            width: Browser.isDevice ? '130px' : '300px',
            created: () => {
                (parent.element.querySelector('.e-ie-redact-value-span') as HTMLSpanElement).innerText = value.toString();
            },
            change: (args: SliderChangeEventArgs) => {
                (parent.element.querySelector('.e-ie-redact-value-span') as HTMLSpanElement).innerText = args.value.toString();
                if (parent.activeObj.redactType === 'blur') {
                    parent.activeObj.redactBlur = parent.tempRedactBlur = args.value as number;
                } else if (parent.activeObj.redactType === 'pixelate') {
                    parent.activeObj.redactPixelate = parent.tempRedactPixel = args.value as number;
                }
                parent.notify('draw', { prop: 'drawObject', onPropertyChange: false, value: {canvas: 'duplicate', obj: parent.activeObj, isCropRatio: null,
                    points: null, isPreventDrag: true, saveContext: null, isPreventSelection: true} });
            },
            changed: (): void => {
                setTimeout((): void => {
                    parent.notify('undo-redo', { prop: 'updateUndoRedoStack', onPropertyChange: false});
                }, 50);
            }
        });
        redactSlider.appendTo('#' + id + '_sliderWrapper');
        if (Browser.isDevice) {
            let cHt: number = (contextualToolbarArea as HTMLElement).offsetHeight + 1;
            const cusWrapper: HTMLElement = parent.element.querySelector('#' + id + '_customizeWrapper');
            if (this.isFrameToolbar && cusWrapper) {
                cHt = cusWrapper.offsetHeight + 2;
            }
            const ht: number = (parent.element.querySelector('#' + id + '_canvasWrapper') as HTMLElement).offsetHeight;
            (contextualToolbarArea as HTMLElement).style.top = this.toolbarHeight + 1 + ht - cHt + 'px';
        }
    }
}
