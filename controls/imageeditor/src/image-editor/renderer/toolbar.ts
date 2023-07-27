import { extend, Browser, detach, select } from '@syncfusion/ej2-base';
import { EventHandler, getComponent, isNullOrUndefined, L10n } from '@syncfusion/ej2-base';
import { ActivePoint, SliderChangeEventArgs } from '@syncfusion/ej2-inputs';
import { ItemModel, Toolbar, ClickEventArgs } from '@syncfusion/ej2-navigations';
import { Button } from '@syncfusion/ej2-buttons';
import { DropDownButton, ItemModel as DropDownButtonItemModel, MenuEventArgs, OpenCloseMenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { ColorPicker, ColorPickerEventArgs, Uploader, Slider } from '@syncfusion/ej2-inputs';
import { ImageEditor, SelectionPoint, ToolbarEventArgs, Point, ImageFilterEventArgs, ZoomTrigger, Transition } from '../index';
import { QuickAccessToolbarEventArgs, ImageFilterOption } from '../index';
import { hideSpinner, showSpinner } from '@syncfusion/ej2-popups';

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

    // For element purpose
    private lowerContext: CanvasRenderingContext2D;
    private upperContext: CanvasRenderingContext2D;
    private inMemoryCanvas: HTMLCanvasElement;
    private inMemoryContext: CanvasRenderingContext2D;

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
            CropSelection: 'Crop Selection'
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
            this.initMainToolbar(args.value['isApplyBtn'], args.value['isDevice'], args.value['isOkBtn']);
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
            this.toolbarHeight = args.value['height'];
            break;
        case 'setCurrentToolbar':
            this.currentToolbar = args.value['type'];
            break;
        case 'setSelectedFreehandColor':
            this.selFhdColor = args.value['color'];
            break;
        case 'getCurrentFilter':
            args.value['obj']['currentFilter'] = parent.currentFilter;
            break;
        case 'setCurrentFilter':
            parent.currentFilter = args.value['filter'];
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
        case 'renderSlider':
            this.renderSlider(args.value['type']);
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
        case 'getCropToolbar':
            args.value['obj']['isCropToolbar'] = parent.isCropToolbar;
            break;
        case 'getPrevCurrSelectionPoint':
            args.value['obj']['prevCurrSelectionPoint'] = parent.prevCurrSelectionPoint;
            break;
        case 'setPrevCurrSelectionPoint':
            parent.prevCurrSelectionPoint = args.value['point'];
            break;
        case 'updateCropTransformItems':
            parent.updateCropTransformItems();
            break;
        case 'setEnableDisableUndoRedo':
            this.preventEnableDisableUr = args.value['isPrevent'];
            break;
        case 'reset':
            this.reset();
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
        this.defToolbarItems = []; this.toolbarHeight = 46; parent.prevCurrSelectionPoint = null;
        this.zoomBtnHold = null; this.currToolbar = '';
        this.currentToolbar = 'main'; this.selFhdColor = '#42a5f5'; parent.currentFilter = '';
        this.preventZoomBtn = parent.isCropToolbar = this.preventEnableDisableUr = false;
        parent.initialAdjustmentValue = parent.canvasFilter =
                'brightness(' + 1 + ') ' + 'contrast(' + 100 + '%) ' + 'hue-rotate(' + 0 + 'deg) ' +
                'saturate(' + 100 + '%) ' + 'opacity(' + 1 + ') ' + 'blur(' + 0 + 'px) ' + 'sepia(0%) ' + 'grayscale(0%) ' + 'invert(0%)';
    }

    private destroyTopToolbar(): void {
        const parent: ImageEditor = this.parent;
        const toolbar: HTMLElement = document.getElementById(parent.element.id + '_toolbar');
        if (this.isToolbar() && toolbar && toolbar.classList.contains('e-control')) {
            (getComponent(document.getElementById(parent.element.id + '_toolbar'), 'toolbar') as Toolbar).destroy();
        }
    }

    private destroyBottomToolbar(): void {
        const parent: ImageEditor = this.parent;
        const toolbar: HTMLElement = document.getElementById(parent.element.id + '_bottomToolbar');
        if (toolbar && toolbar.classList.contains('e-control')) {
            (getComponent(document.getElementById(parent.element.id + '_bottomToolbar'), 'toolbar') as Toolbar).destroy();
        }
    }

    private isToolbar(): boolean {
        const parent: ImageEditor = this.parent;
        return (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.length > 0)
        || !isNullOrUndefined(parent.toolbarTemplate));
    }

    private createToolbar(): void {
        const parent: ImageEditor = this.parent;
        if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.length > 0)) {
            parent.element.appendChild(parent.createElement('div', {
                id: parent.element.id + '_toolbarArea', className: 'e-toolbar-area'
            }));
            const toolbarItems: ItemModel = { cssClass: 'e-image-upload', align: 'Left', type: 'Input',
                tooltipText: this.l10n.getConstant('Browse'), template: new Uploader({allowedExtensions: '.jpg, .jpeg, .png,.svg'}) };
            if (isNullOrUndefined(this.defToolbarItems)) {
                this.defToolbarItems = [];
            }
            this.defToolbarItems.push(toolbarItems);
            const toolbarArea: HTMLElement = document.getElementById(parent.element.id + '_toolbarArea');
            const toolbar: HTMLElement = parent.createElement('div', {
                id: parent.element.id + '_toolbar'
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
                            if (!parent.disabled) {
                                if (Browser.isDevice) {
                                    if (this.defToolbarItems.length > 0 &&
                                        document.getElementById(parent.element.id + '_toolbar')) {
                                        (getComponent(document.getElementById(parent.element.id + '_toolbar'), 'toolbar') as Toolbar).destroy();
                                    }
                                    if (document.getElementById(parent.element.id + '_bottomToolbar')) {
                                        (getComponent(document.getElementById(parent.element.id + '_bottomToolbar'), 'toolbar') as Toolbar).destroy();
                                    }
                                    this.initMainToolbar(false, Browser.isDevice, null);
                                    this.createBottomToolbar();
                                } else {
                                    if (this.defToolbarItems.length > 0 &&
                                        document.getElementById(parent.element.id + '_toolbar')) {
                                        (getComponent(document.getElementById(parent.element.id + '_toolbar'), 'toolbar') as Toolbar).destroy();
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
            toolbarObj.appendTo('#' + parent.element.id + '_toolbar');
            this.createLeftToolbarControls();
            if (document.getElementById(parent.element.id + '_toolbar')) {
                this.toolbarHeight = document.getElementById(parent.element.id + '_toolbar').clientHeight;
            }
        } else {
            this.toolbarHeight = 0;
        }
    }

    private createContextualToolbar(): void {
        const parent: ImageEditor = this.parent;
        if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.length > 0)) {
            parent.element.appendChild(parent.createElement('div', { id: parent.element.id + '_contextualToolbarArea',
                className: 'e-contextual-toolbar-wrapper e-hide', attrs: { style: 'position: absolute;' }
            }));
            const toolbarArea: HTMLElement = document.getElementById(parent.element.id + '_contextualToolbarArea');
            const toolbar: HTMLElement = parent.createElement('div', { id: parent.element.id + '_contextualToolbar' });
            toolbarArea.appendChild(toolbar);
        }
    }

    private createBottomToolbar(): void {
        const parent: ImageEditor = this.parent;
        if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.length > 0)) {
            parent.element.appendChild(parent.createElement('div', {
                id: parent.element.id + '_bottomToolbarArea', className: 'e-bottom-toolbar'
            }));
            if (!parent.toolbarTemplate) {
                document.getElementById(parent.element.id + '_canvasWrapper').style.height = (parent.element.offsetHeight
                - this.toolbarHeight * 2) - 3 + 'px';
                const toolbarArea: HTMLElement = document.getElementById(parent.element.id + '_bottomToolbarArea');
                const toolbarElem: HTMLElement = parent.createElement('div', {
                    id: parent.element.id + '_bottomToolbar'
                });
                toolbarArea.appendChild(toolbarElem);
            }
            this.initBottomToolbar();
        }
    }

    private createQuickAccessToolbar(): void {
        const parent: ImageEditor = this.parent;
        if (parent.showQuickAccessToolbar) {
            const toolbarItems: ItemModel = { cssClass: 'e-image-upload', align: 'Left', type: 'Input',
                tooltipText: this.l10n.getConstant('Browse'), template: new Uploader({allowedExtensions: '.jpg, .jpeg, .png,.svg'}) };
            if (isNullOrUndefined(this.defToolbarItems)) {
                this.defToolbarItems = [];
            }
            this.defToolbarItems.push(toolbarItems);
            const toolbarArea: HTMLElement = document.getElementById(parent.element.id + '_quickAccessToolbarArea');
            const toolbar: HTMLElement = parent.createElement('div', {
                id: parent.element.id + '_quickAccessToolbar'
            });
            toolbarArea.appendChild(toolbar);
            const toolbarObj: Toolbar = new Toolbar({clicked: this.defToolbarClicked.bind(this)});
            toolbarObj.appendTo('#' + parent.element.id + '_quickAccessToolbar');
        }
    }

    private initMainToolbar(isApplyOption?: boolean, isDevice?: boolean, isOkBtn?: boolean): void {
        const parent: ImageEditor = this.parent;
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
            const toolbarObj: Toolbar = new Toolbar({
                width: '100%',
                items: this.defToolbarItems,
                clicked: this.defToolbarClicked.bind(this),
                created: () => {
                    if (!isDevice) {
                        this.renderAnnotationBtn();
                    }
                    this.wireZoomBtnEvents();
                    this.renderSaveBtn();
                    parent.trigger('toolbarCreated', {toolbarType: 'main'});
                }
            });
            toolbarObj.appendTo('#' + parent.element.id + '_toolbar');
            this.createLeftToolbarControls();
            this.enableDisableTbrBtn();
            if (this.isToolbar() && document.getElementById(parent.element.id + '_toolbar')) {
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                const toolbar: any = getComponent(parent.element.id + '_toolbar', 'toolbar') as Toolbar;
                toolbar.refreshOverflow();
            }
        }
    }

    private initBottomToolbar(): void {
        const parent: ImageEditor = this.parent;
        if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.length > 0)) {
            const items: ItemModel[] = this.getMainToolbarItem();
            const toolbarObj: Toolbar = new Toolbar({ items: items, width: '100%',
                created: () => {
                    this.renderAnnotationBtn();
                    this.renderCropBtn();
                    this.renderTransformBtn();
                    parent.trigger('toolbarCreated', {toolbarType: 'main'});
                },
                clicked: this.defToolbarClicked.bind(this)
            });
            toolbarObj.appendTo('#' + parent.element.id + '_bottomToolbar');
            if (this.defToolbarItems.length > 0 && document.getElementById(parent.element.id + '_bottomToolbar')) {
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                const toolbar: any = getComponent(parent.element.id + '_bottomToolbar', 'toolbar') as Toolbar;
                toolbar.refreshOverflow();
            }
        }
    }

    private getLeftToolbarItem(isOkBtn?: boolean): ItemModel[] {
        const parent: ImageEditor = this.parent;
        const toolbarItems: ItemModel[] = [];
        if (!isOkBtn) {
            toolbarItems.push({ id: parent.element.id + '_upload', cssClass: 'e-image-upload', align: 'Left', type: 'Input', template: new Uploader({allowedExtensions: '.jpg, .jpeg, .png,.svg'}) });
            toolbarItems.push({ visible: false, cssClass: 'e-image-position e-btn e-flat', tooltipText: this.l10n.getConstant('Browse'), align: 'Left' });
        }
        if (parent.allowUndoRedo) {
            if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('Undo') > -1)) {
                toolbarItems.push({ id: parent.element.id + '_undo', prefixIcon: 'e-icons e-undo', cssClass: 'top-icon e-undo',
                    tooltipText: this.l10n.getConstant('Undo'), align: 'Left' });
            }
            if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('Redo') > -1)) {
                toolbarItems.push({ id: parent.element.id + '_redo', prefixIcon: 'e-icons e-redo', cssClass: 'top-icon e-redo',
                    tooltipText: this.l10n.getConstant('Redo'), align: 'Left' });
            }
        }
        if (!this.preventZoomBtn && (parent.zoomSettings.zoomTrigger & ZoomTrigger.Toolbar) === ZoomTrigger.Toolbar) {
            if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('ZoomOut') > -1)) {
                toolbarItems.push({ id: parent.element.id + '_zoomOut', prefixIcon: 'e-icons e-zoom-out', cssClass: 'top-icon e-dec-zoom',
                    tooltipText: this.l10n.getConstant('ZoomOut'), align: 'Left' });
            }
            if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('ZoomIn') > -1)) {
                toolbarItems.push({ id: parent.element.id + '_zoomIn', prefixIcon: 'e-icons e-zoom-in', cssClass: 'top-icon e-inc-zoom',
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
        const parent: ImageEditor = this.parent;
        const toolbarItems: ItemModel[] = [];
        if (isOkBtn) {
            toolbarItems.push({ id: parent.element.id + '_ok', prefixIcon: 'e-icons e-check', cssClass: 'top-icon e-tick',
                tooltipText: this.l10n.getConstant('OK'), align: 'Right' });
            toolbarItems.push({ id: parent.element.id + '_cancel', prefixIcon: 'e-icons e-close', cssClass: 'top-icon e-save',
                tooltipText: this.l10n.getConstant('Cancel'), align: 'Right' });
        }
        if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('Reset') > -1)) {
            toolbarItems.push({ id: parent.element.id + '_reset', prefixIcon: 'e-icons e-btn-reset', cssClass: 'top-icon e-img-reset',
                tooltipText: this.l10n.getConstant('Reset'), align: 'Right' });
        }
        if (!isOkBtn) {
            if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('Save') > -1)) {
                toolbarItems.push({ id: parent.element.id + '_save', prefixIcon: 'e-icons e-btn-save', cssClass: 'top-icon e-save',
                    tooltipText: this.l10n.getConstant('Save'), align: 'Right', template:
                    '<button id="' + parent.element.id + '_saveBtn"></button>' });
            }
        }
        const tempToolbarItems: ItemModel[] = this.processToolbar('right');
        for (let i: number = 0, len: number = tempToolbarItems.length; i < len; i++) {
            toolbarItems.push(tempToolbarItems[i as number]);
        }
        return toolbarItems;
    }

    private getMainToolbarItem(isApplyOption?: boolean): ItemModel[] {
        const parent: ImageEditor = this.parent;
        const toolbarItems: ItemModel[] = [];
        if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('Crop') > -1)) {
            toolbarItems.push({ id: parent.element.id + '_cropTransform', prefixIcon: 'e-icons e-crop', cssClass: 'top-icon e-crop',
                tooltipText: this.l10n.getConstant('CropAndTransform'), align: 'Center' });
        }
        if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('Annotate') > -1)) {
            toolbarItems.push({ id: parent.element.id + '_annotation', tooltipText: this.l10n.getConstant('Annotation'), align: 'Center',
                template: '<button id="' + parent.element.id + '_annotationBtn"></button>' });
        }
        if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('Finetune') > -1)) {
            toolbarItems.push({ id: parent.element.id + '_adjustment', prefixIcon: 'e-icons e-adjustment', cssClass: 'top-icon e-adjustment',
                tooltipText: this.l10n.getConstant('Finetune'), align: 'Center' });
        }
        if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('Filter') > -1)) {
            toolbarItems.push({ id: parent.element.id + '_filter', prefixIcon: 'e-icons e-filters', cssClass: 'top-icon e-filters',
                tooltipText: this.l10n.getConstant('Filter'), align: 'Center' });
        }
        const tempToolbarItems: ItemModel[] = this.processToolbar('center');
        for (let i: number = 0, len: number = tempToolbarItems.length; i < len; i++) {
            toolbarItems.push(tempToolbarItems[i as number]);
        }
        if (isApplyOption) {
            toolbarItems.push({ id: parent.element.id + '_ok', prefixIcon: 'e-icons e-check', cssClass: 'top-icon e-tick',
                tooltipText: this.l10n.getConstant('OK'), align: 'Right' });
            toolbarItems.push({ id: parent.element.id + '_cancel', prefixIcon: 'e-icons e-close', cssClass: 'top-icon e-save',
                tooltipText: this.l10n.getConstant('Cancel'), align: 'Right' });
        }
        return toolbarItems;
    }

    private getZoomToolbarItem(): ItemModel[] {
        const toolbarItems: ItemModel[] = [];
        return toolbarItems;
    }

    private updateContextualToolbar(type: string, cType?: string): void {
        const parent: ImageEditor = this.parent;
        const toolbarArea: Element = parent.element.querySelector('#' + parent.element.id + '_toolbarArea');
        const contextualToolbarArea: Element = parent.element.querySelector('#' + parent.element.id + '_contextualToolbarArea');
        contextualToolbarArea.classList.remove('e-hide');
        (contextualToolbarArea as HTMLElement).style.left = (toolbarArea as HTMLElement).offsetLeft + 'px';
        if (type === 'filter') {
            if (document.getElementById(parent.element.id + '_toolbar') && this.defToolbarItems.length > 0) {
                (getComponent(document.getElementById(parent.element.id + '_toolbar'), 'toolbar') as Toolbar).destroy();
            }
            if (Browser.isDevice) {
                this.initMainToolbar(false, true, true);
            } else {
                this.initMainToolbar(true, null, null);
            }
            this.refreshSlider();
            this.initFilterToolbarItem();
        } else {
            if (document.querySelector('#' + parent.element.id + '_contextualToolbar').classList.contains('e-control')) {
                (getComponent(document.getElementById(parent.element.id + '_contextualToolbar'), 'toolbar') as Toolbar).destroy();
            }
            this.refreshSlider(); this.renderSlider(cType);
        }
        if (Browser.isDevice) {
            const cHt: number = (contextualToolbarArea as HTMLElement).offsetHeight;
            const ht: number = (parent.element.querySelector('#' + parent.element.id + '_canvasWrapper') as HTMLElement).offsetHeight;
            (contextualToolbarArea as HTMLElement).style.top = this.toolbarHeight + ht - cHt + 'px';
        } else {
            (contextualToolbarArea as HTMLElement).style.top = this.toolbarHeight + 'px';
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
            zoomIn.addEventListener('touchstart', this.zoomInBtnClickHandler.bind(this));
        }
        if (zoomOut) {
            zoomOut.addEventListener('mousedown', this.zoomOutBtnMouseDownHandler.bind(this));
            zoomOut.addEventListener('mouseup', this.zoomBtnMouseUpHandler.bind(this));
            zoomOut.addEventListener('click', this.zoomOutBtnClickHandler.bind(this));
            zoomIn.addEventListener('touchstart', this.zoomInBtnClickHandler.bind(this));
        }
    }

    private enableDisableTbrBtn(): void {
        const parent: ImageEditor = this.parent;
        if (!this.preventEnableDisableUr) {
            const object: Object = {appliedUndoRedoColl: [] as Transition[] };
            parent.notify('undo-redo', {prop: 'getAppliedUndoRedoColl', value: {obj: object }});
            const undoRedoObj: Object = {undoRedoStep: null };
            parent.notify('undo-redo', {prop: 'getUndoRedoStep', value: {obj: undoRedoObj }});
            const undo: HTMLElement = document.querySelector('#' + parent.element.id + '_undo');
            if (undo && undoRedoObj['undoRedoStep'] === 0) {
                undo.classList.add('e-disabled');
                undo.parentElement.classList.add('e-overlay');
            } else if (undo && undoRedoObj['undoRedoStep'] > 0) {
                undo.classList.remove('e-disabled');
                undo.parentElement.classList.remove('e-overlay');
            }
            const redo: HTMLElement = document.querySelector('#' + parent.element.id + '_redo');
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
        const zoomIn: HTMLElement = document.querySelector('#' + parent.element.id + '_zoomIn');
        if (zoomIn && parent.zoomSettings.zoomFactor >= parent.zoomSettings.maxZoomFactor) {
            zoomIn.classList.add('e-disabled');
            zoomIn.parentElement.classList.add('e-overlay');
        } else if (zoomIn) {
            zoomIn.classList.remove('e-disabled');
            zoomIn.parentElement.classList.remove('e-overlay');
        }
        const zoomOut: HTMLElement = document.querySelector('#' + parent.element.id + '_zoomOut');
        if (zoomOut && parent.zoomSettings.zoomFactor <= parent.zoomSettings.minZoomFactor) {
            zoomOut.classList.add('e-disabled');
            zoomOut.parentElement.classList.add('e-overlay');
        } else if (zoomOut) {
            zoomOut.classList.remove('e-disabled');
            zoomOut.parentElement.classList.remove('e-overlay');
        }
        const pan: HTMLElement = document.querySelector('#' + parent.element.id + '_pan');
        if (pan && parent.zoomSettings.zoomFactor <= parent.zoomSettings.minZoomFactor) {
            pan.style.display = 'none';
        } else if (pan) {
            pan.style.display = 'block';
        }
    }

    private createLeftToolbarControls(): void {
        const parent: ImageEditor = this.parent;
        if (this.defToolbarItems !== undefined && this.defToolbarItems.length > 0 &&
            (document.getElementById(parent.element.id + '_toolbar'))) {
            const uploadDiv: HTMLElement = document.getElementById(parent.element.id + '_toolbar')
                .querySelector('.e-image-upload');
            if (uploadDiv) {
                const uploadElem: HTMLInputElement = uploadDiv.getElementsByTagName('input')[0];
                const uploadBtnElem: HTMLElement = uploadDiv.getElementsByTagName('button')[0];
                uploadBtnElem.className = 'e-tbar-btn e-tbtn-txt top-icon';
                uploadBtnElem.innerHTML = '';
                uploadBtnElem.appendChild(parent.createElement('span', {
                    className: 'e-btn-icon e-icons e-upload-icon e-icon-left'
                }));
                uploadElem.onchange = this.fileSelect.bind(this, uploadElem);
            }
        }
    }

    private fileSelect(inputElement: HTMLInputElement, args: Event): void {
        this.parent.notify('draw', {prop: 'fileSelect', value: {inputElement: inputElement, args: args }});
    }

    private renderAnnotationBtn(isContextualToolbar?: boolean): void {
        const parent: ImageEditor = this.parent;
        const items: DropDownButtonItemModel[] = [];
        if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('Pen') > -1)) {
            items.push({ text: this.l10n.getConstant('Pen'), id: 'pen', iconCss: 'e-icons e-free-pen' });
        }
        if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('Line') > -1)) {
            items.push({ text: this.l10n.getConstant('Line'), id: 'line', iconCss: 'e-icons e-line' });
        }
        if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('Rectangle') > -1)) {
            items.push({ text: this.l10n.getConstant('Rectangle'), id: 'rectangle', iconCss: 'e-icons e-rectangle' });
        }
        if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('Ellipse') > -1)) {
            items.push({ text: this.l10n.getConstant('Ellipse'), id: 'ellipse', iconCss: 'e-icons e-circle' });
        }
        if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('Arrow') > -1)) {
            items.push({ text: this.l10n.getConstant('Arrow'), id: 'arrow', iconCss: 'e-icons e-arrow-right-up' });
        }
        if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('Path') > -1)) {
            items.push({ text: this.l10n.getConstant('Path'), id: 'path', iconCss: 'e-icons e-critical-path' });
        }
        if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('Text') > -1)) {
            items.push({ text: this.l10n.getConstant('Text'), id: 'text', iconCss: 'e-icons e-add-text' });
        }
        const obj: Object = {freehandDrawSelectedId: null };
        parent.notify('freehand-draw', { prop: 'getFreehandDrawSelectedId', onPropertyChange: false, value: {obj: obj }});
        const duplicateElement: HTMLElement = document.querySelector('#' + parent.element.id + '_duplicate');
        const removeElement: HTMLElement = document.querySelector('#' + parent.element.id + '_remove');
        const editTextElement: HTMLElement = document.querySelector('#' + parent.element.id + '_editText');
        if ((parent.activeObj.activePoint.width === 0 && parent.activeObj.activePoint.height === 0) &&
            (isNullOrUndefined(parent.activeObj.pointColl) || (parent.activeObj.pointColl
            && parent.activeObj.pointColl.length === 0)) &&
            isNullOrUndefined(obj['freehandDrawSelectedId'])) {
            if (duplicateElement) {
                duplicateElement.classList.add('e-disabled');
            }
            if (removeElement) {
                removeElement.classList.add('e-disabled');
            }
            if (editTextElement) {
                editTextElement.classList.add('e-disabled');
            }
        } else {
            if (duplicateElement) {
                duplicateElement.classList.remove('e-disabled');
            }
            if (removeElement) {
                removeElement.classList.remove('e-disabled');
            }
            if (editTextElement) {
                editTextElement.classList.remove('e-disabled');
            }
        }
        const iconCss: string = isContextualToolbar ? this.getCurrentShapeIcon(parent.activeObj.shape) : 'e-annotation';
        const drpDownBtn: DropDownButton = new DropDownButton({ items: items, iconCss: 'e-icons ' + iconCss,
            cssClass: 'e-image-popup',
            open: (args: OpenCloseMenuEventArgs) => {
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
                parent.okBtn();
                let isCropSelection: boolean = false;
                let splitWords: string[];
                if (parent.activeObj.shape !== undefined) {splitWords = parent.activeObj.shape.split('-'); }
                if (splitWords === undefined && parent.currObjType.isCustomCrop) {
                    isCropSelection = true;
                } else if (splitWords !== undefined && splitWords[0] === 'crop'){
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
                drpDownBtn.iconCss = 'e-icons ' + this.getCurrentShapeIcon(args.item.id);
                switch (args.item.id) {
                case 'pen':
                    parent.notify('draw', {prop: 'setTempFreehandCounter', value: {tempFreehandCounter: parent.freehandCounter }});
                    parent.notify('draw', {prop: 'setTempCurrentFreehandDrawIndex', value: {tempCurrentFreehandDrawIndex: obj['currentFreehandDrawIndex'] }});
                    this.currentToolbar = 'pen';
                    parent.freeHandDraw(true);
                    break;
                case 'text':
                    this.currentToolbar = 'text';
                    parent.notify('shape', { prop: 'draw-shape-text'});
                    // this.setInitialShapeSettings(args);
                    // parent.activeObj.textFlip = parent.transform.currFlipState;
                    // parent.notify('selection', {prop: 'annotate', value: {shape: args.item.id }});
                    // parent.notify('toolbar', { prop: 'refresh-toolbar', onPropertyChange: false, value: {type: 'text',
                    //     isApplyBtn: null, isCropping: null, isZooming: null, cType: null}});
                    break;
                default:
                    this.currentToolbar = 'shapes';
                    /// parent.notify('shape', { prop: 'draw-shape', value: {obj: (args.item.id).toLowerCase()}});
                    this.setInitialShapeSettings(args);
                    parent.notify('selection', {prop: 'annotate', value: {shape: args.item.id }});
                    parent.notify('toolbar', { prop: 'refresh-toolbar', onPropertyChange: false, value: {type: 'shapes',
                        isApplyBtn: null, isCropping: null, isZooming: null, cType: null}});
                    break;
                }
                this.updateToolbarItems();
            }
        });
        // Render initialized DropDownButton.
        drpDownBtn.appendTo('#' + parent.element.id + '_annotationBtn');
    }

    private renderCropBtn(): void {
        const parent: ImageEditor = this.parent;
        const items: DropDownButtonItemModel[] = [];
        if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('CustomSelection') > -1)) {
            items.push({ text: this.l10n.getConstant('Custom'), id: 'custom', iconCss: 'e-icons e-custom' });
        }
        if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('CircleSelection') > -1)) {
            items.push({ text: this.l10n.getConstant('Circle'), id: 'circle', iconCss: 'e-icons e-circle' });
        }
        if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('SquareSelection') > -1)) {
            items.push({ text: this.l10n.getConstant('Square'), id: 'square', iconCss: 'e-icons e-square' });
        }
        if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('RatioSelection') > -1)) {
            items.push({ text: '3:2', id: '3:2', iconCss: 'e-icons e-custom-a' });
            items.push({ text: '4:3', id: '4:3', iconCss: 'e-icons e-custom-b' });
            items.push({ text: '5:4', id: '5:4', iconCss: 'e-icons e-custom-c' });
            items.push({ text: '7:5', id: '7:5', iconCss: 'e-icons e-custom-d' });
            items.push({ text: '16:9', id: '16:9', iconCss: 'e-icons e-custom-e' });
        }
        let iconCss: string; let shape: string;
        if (parent.activeObj.shape) {
            iconCss = this.getCurrentShapeIcon(parent.activeObj.shape);
            shape = parent.activeObj.shape;
        } else if (parent.currSelectionPoint) {
            iconCss = this.getCurrentShapeIcon(parent.currSelectionPoint.shape);
            shape = parent.currSelectionPoint.shape;
        } else {
            iconCss = 'e-custom';
            shape = 'custom';
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
                    document.getElementById(parent.activeObj.shape.split('-')[1]).classList.add('e-selected');
                }
                parent.notify('transform', { prop: 'disableZoomOutBtn', value: {isZoomOut: true }});
            },
            items: items,
            select: (args: MenuEventArgs) => {
                this.cropSelect(args);
                drpDownBtn.iconCss = 'e-icons ' + this.getCurrentShapeIcon('crop-' + args.item.id);
                drpDownBtn.content = parent.toPascalCase(args.item.id);
            },
            iconCss: 'e-icons ' + iconCss, cssClass: 'e-image-popup',
            content: parent.toPascalCase(shape.replace('crop-', ''))
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
                    const ht: number = args.element.parentElement.offsetHeight;
                    args.element.parentElement.style.display = 'none';
                    args.element.parentElement.style.top = drpDownBtn.element.getBoundingClientRect().top -
                    ht + 'px';
                    args.element.parentElement.style.display = 'block';
                }
            },
            items: items, select: parent.transformSelect.bind(this),
            iconCss: 'e-icons e-transform', cssClass: 'e-image-popup'
        });
        drpDownBtn.appendTo('#' + parent.element.id + '_transformBtn');
    }

    private renderSaveBtn(): void {
        const parent: ImageEditor = this.parent;
        const saveItems: DropDownButtonItemModel[] = [
            { text: 'JPEG', id: 'jpeg' },
            { text: 'PNG', id: 'png' },
            { text: 'SVG', id: 'svg' }
        ];
        const ddbElem: Element = document.getElementById(parent.element.id + '_saveBtn');
        if (ddbElem) {
            // Initialize the DropDownButton component.
            const saveDrpDownBtn: DropDownButton = new DropDownButton({ items: saveItems, cssClass: 'e-caret-hide e-image-popup', iconCss: 'e-icons e-save',
                select: (args: MenuEventArgs) => {
                    parent.export(args.item.text);
                }
            });
            saveDrpDownBtn.appendTo('#' + parent.element.id + '_saveBtn');
        }
    }

    private getCropTransformToolbarItem(): ItemModel[] {
        const parent: ImageEditor = this.parent;
        const toolbarItems: ItemModel[] = [];
        toolbarItems.push({ id: parent.element.id + '_crop', tooltipText: this.l10n.getConstant('CropSelection'), align: 'Center',
            template: '<button id="' + parent.element.id + '_cropBtn"></button>'
        });
        toolbarItems.push({ align: 'Center', type: 'Separator' });
        toolbarItems.push({ id: parent.element.id + '_rotateLeft', prefixIcon: 'e-icons e-anti-clock-wise',
            tooltipText: this.l10n.getConstant('RotateLeft'), align: 'Center' });
        toolbarItems.push({ id: parent.element.id + '_rotateRight', prefixIcon: 'e-icons e-clock-wise',
            tooltipText: this.l10n.getConstant('RotateRight'), align: 'Center' });
        toolbarItems.push({ align: 'Center', type: 'Separator' });
        toolbarItems.push({ id: parent.element.id + '_horizontalFlip', prefixIcon: 'e-icons e-horizontal-flip',
            tooltipText: this.l10n.getConstant('HorizontalFlip'), align: 'Center' });
        toolbarItems.push({ id: parent.element.id + '_verticalFlip', prefixIcon: 'e-icons e-vertical-flip',
            tooltipText: this.l10n.getConstant('VerticalFlip'), align: 'Center' });
        if (!Browser.isDevice) {
            toolbarItems.push({ id: parent.element.id + '_ok', prefixIcon: 'e-icons e-check', cssClass: 'top-icon e-tick',
                tooltipText: this.l10n.getConstant('OK'), align: 'Right' });
            toolbarItems.push({ id: parent.element.id + '_cancel', prefixIcon: 'e-icons e-close', cssClass: 'top-icon e-save',
                tooltipText: this.l10n.getConstant('Cancel'), align: 'Right' });
        }
        return toolbarItems;
    }

    private getShapesToolbarItem(items: (string | ItemModel)[]): ItemModel[] {
        const parent: ImageEditor = this.parent;
        const toolbarItems: ItemModel[] = [];
        if (isNullOrUndefined(parent.toolbar) || (parent.toolbar)) {
            toolbarItems.push({ id: parent.element.id + '_annotation', tooltipText: this.l10n.getConstant('Annotation'), align: 'Center',
                template: '<button id="' + parent.element.id + '_annotationBtn"></button>' });
        }
        if (items.indexOf('fillColor') > -1) {
            toolbarItems.push({ prefixIcon: 'e-icons e-copy', id: parent.element.id + '_fillcolor',
                cssClass: 'top-icon e-fill', tooltipText: this.l10n.getConstant('FillColor'), align: 'Center', type: 'Input',
                template: '<button id="' + parent.element.id + '_fillColorBtn"></button>' });
        }
        if (items.indexOf('strokeColor') > -1) {
            toolbarItems.push({ prefixIcon: 'e-icons e-copy', id: parent.element.id + '_strokecolor',
                cssClass: 'top-icon e-stroke', tooltipText: this.l10n.getConstant('StrokeColor'), align: 'Center', type: 'Input',
                template: '<button id="' + parent.element.id + '_borderColorBtn"></button>' });
        }
        if (items.indexOf('strokeWidth') > -1) {
            toolbarItems.push({ id: parent.element.id + '_strokeWidth', cssClass: 'top-icon e-size', tooltipText: 'Stroke Width', align: 'Center',
                type: 'Input', template: '<button id="' + parent.element.id + '_borderWidthBtn"></button>' });
        }
        if (items.indexOf('start') > -1) {
            toolbarItems.push({ id: parent.element.id + '_start', cssClass: 'top-icon e-size', tooltipText: 'Start', align: 'Center',
                type: 'Input', template: '<button id="' + parent.element.id + '_startBtn"></button>' });
        }
        if (items.indexOf('end') > -1) {
            toolbarItems.push({ id: parent.element.id + '_end', cssClass: 'top-icon e-size', tooltipText: 'End', align: 'Center',
                type: 'Input', template: '<button id="' + parent.element.id + '_endBtn"></button>' });
        }
        toolbarItems.push({ align: 'Center', type: 'Separator' });
        if (items.indexOf('duplicate') > -1) {
            toolbarItems.push({ id: parent.element.id + '_duplicate', prefixIcon: 'e-icons e-order', cssClass: 'top-icon e-order',
                tooltipText: this.l10n.getConstant('Duplicate'), align: 'Center' });
        }
        if (items.indexOf('remove') > -1) {
            toolbarItems.push({ id: parent.element.id + '_remove', prefixIcon: 'e-icons e-trash', cssClass: 'top-icon e-trash',
                tooltipText: this.l10n.getConstant('Remove'), align: 'Center' });
        }
        if (items.indexOf('text') > -1) {
            toolbarItems.push({ id: parent.element.id + '_editText', prefixIcon: 'e-icons e-annotation-edit', cssClass: 'top-icon e-annotation-edit',
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
                toolbarItems.push({ id: parent.element.id + '_ok', prefixIcon: 'e-icons e-check', cssClass: 'top-icon e-tick',
                    tooltipText: this.l10n.getConstant('OK'), align: 'Right' });
                toolbarItems.push({ id: parent.element.id + '_cancel', prefixIcon: 'e-icons e-close', cssClass: 'top-icon e-save',
                    tooltipText: this.l10n.getConstant('Cancel'), align: 'Right' });
            }
        }
        return toolbarItems;
    }

    private initCropTransformToolbar(): void {
        const parent: ImageEditor = this.parent;
        const leftItem: ItemModel[] = this.getLeftToolbarItem();
        const rightItem: ItemModel[] = this.getRightToolbarItem();
        const mainItem: ItemModel[] = this.getCropTransformToolbarItem();
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
                this.renderCropBtn();
                this.wireZoomBtnEvents();
                if (!Browser.isDevice) {
                    this.renderSaveBtn();
                }
                parent.trigger('toolbarCreated', {toolbarType: 'shapes'});
                if (Browser.isDevice) {
                    if (this.defToolbarItems.length > 0 && document.getElementById(parent.element.id + '_bottomToolbar')) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        (toolbar as any).refreshOverflow(); (toolbar as any).refreshOverflow(); (toolbar as any).refreshOverflow();
                    }
                } else {
                    this.createLeftToolbarControls();
                    if (this.defToolbarItems.length > 0 && document.getElementById(parent.element.id + '_toolbar')) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        (toolbar as any).refreshOverflow();
                    }
                }
                parent.select('custom');
            }
        });
        if (Browser.isDevice) {
            toolbar.appendTo('#' + parent.element.id + '_bottomToolbar');
        } else {
            toolbar.appendTo('#' + parent.element.id + '_toolbar');
        }
        this.enableDisableTbrBtn();
        parent.notify('transform', { prop: 'disableZoomOutBtn', value: {isZoomOut: true }});
    }

    private getCurrentShapeIcon(shape: string): string {
        let icon: string = '';
        switch (shape) {
        case 'rectangle':
            icon = 'e-rectangle';
            break;
        case 'ellipse':
            icon = 'e-circle';
            break;
        case 'line':
            icon = 'e-line';
            break;
        case 'arrow':
            icon = 'e-arrow-right-up';
            break;
        case 'path':
            icon = 'e-critical-path';
            break;
        case 'text':
            icon = 'e-add-text';
            break;
        case 'pen':
            icon = 'e-free-pen';
            break;
        case 'crop-custom':
            icon = 'e-custom';
            break;
        case 'crop-circle':
            icon = 'e-circle';
            break;
        case 'crop-square':
            icon = 'e-square';
            break;
        case 'crop-3:2':
            icon = 'e-custom-a';
            break;
        case 'crop-4:3':
            icon = 'e-custom-b';
            break;
        case 'crop-5:4':
            icon = 'e-custom-c';
            break;
        case 'crop-7:5':
            icon = 'e-custom-d';
            break;
        case 'crop-16:9':
            icon = 'e-custom-e';
            break;
        default:
            icon = 'e-free-pen';
            break;
        }
        return icon;
    }

    private initShapesToolbarItem(items: (string | ItemModel)[]): void {
        const parent: ImageEditor = this.parent;
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
                this.renderAnnotationBtn(true);
                this.createShapeColor(items);
                this.createShapeBtn(items);
                if (parent.activeObj.shape === 'arrow') {
                    this.createStartBtn();
                    this.createEndBtn();
                }
                this.wireZoomBtnEvents();
                if (!Browser.isDevice) {
                    this.renderSaveBtn();
                }
                parent.trigger('toolbarCreated', {toolbarType: 'shapes'});
                if (Browser.isDevice) {
                    if (this.defToolbarItems.length > 0 && document.getElementById(parent.element.id + '_bottomToolbar')) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        (toolbar as any).refreshOverflow(); (toolbar as any).refreshOverflow(); (toolbar as any).refreshOverflow();
                    }
                } else {
                    this.createLeftToolbarControls();
                    if (this.defToolbarItems.length > 0 && document.getElementById(parent.element.id + '_toolbar')) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        (toolbar as any).refreshOverflow();
                    }
                }
            }
        });
        if (Browser.isDevice) {
            toolbar.appendTo('#' + parent.element.id + '_bottomToolbar');
        } else {
            toolbar.appendTo('#' + parent.element.id + '_toolbar');
        }
        this.enableDisableTbrBtn();
    }

    private createShapeColor(items: (string | ItemModel)[]): void {
        const parent: ImageEditor = this.parent;
        if (items.indexOf('fillColor') > -1) {
            parent.element.querySelector('.e-template.e-fill').appendChild(parent.createElement('input', {
                id: parent.element.id + '_shape_fill'
            }));
            const fillColor: ColorPicker = new ColorPicker({
                modeSwitcher: false, noColor: true, value: '',
                showButtons: false, mode: 'Palette', cssClass: 'e-shape-fill-color',
                change: (args: ColorPickerEventArgs): void => {
                    parent.updateFillColor(args.currentValue.hex);
                    if (args.currentValue.rgba === '') {
                        (fillDDB.element.children[0] as HTMLElement).classList.add('e-nocolor-item');
                    } else {
                        (fillDDB.element.children[0] as HTMLElement).classList.remove('e-nocolor-item');
                        (fillDDB.element.children[0] as HTMLElement).style.backgroundColor = args.currentValue.rgba;
                    }
                    fillDDB.toggle();
                }
            }, '#' + parent.element.id + '_shape_fill');
            const fillDDB: DropDownButton = new DropDownButton({
                open: (args: OpenCloseMenuEventArgs) => {
                    if (Browser.isDevice) {
                        args.element.parentElement.style.top = fillDDB.element.getBoundingClientRect().top -
                        args.element.parentElement.offsetHeight + 'px';
                        args.element.parentElement.style.left = parent.element.offsetLeft + 'px';
                    }
                },
                target: '.e-shape-fill-color',
                iconCss: 'e-dropdownbtn-preview'
            }, '#' + parent.element.id + '_fillColorBtn');
            fillColor.inline = true;
            (parent.element.querySelector('.e-fill.e-template .e-dropdownbtn-preview') as HTMLElement).classList.add('e-nocolor-item');
        }
        if (items.indexOf('strokeColor') > -1) {
            parent.element.querySelector('.e-template.e-stroke').appendChild(parent.createElement('input', {
                id: parent.element.id + '_shape_stroke'
            }));
            const strokeColor: ColorPicker = new ColorPicker({
                modeSwitcher: false, noColor: false, value: '#fff',
                showButtons: false, mode: 'Palette', cssClass: 'e-shape-stroke-color',
                change: (args: ColorPickerEventArgs): void => {
                    parent.updateStrokeColor(args.currentValue.hex);
                    (strokeDDB.element.children[0] as HTMLElement).style.backgroundColor = args.currentValue.rgba;
                    strokeDDB.toggle();
                }
            }, '#' + parent.element.id + '_shape_stroke');
            const strokeDDB: DropDownButton = new DropDownButton({
                open: (args: OpenCloseMenuEventArgs) => {
                    if (Browser.isDevice) {
                        args.element.parentElement.style.top = strokeDDB.element.getBoundingClientRect().top -
                        args.element.parentElement.offsetHeight + 'px';
                        args.element.parentElement.style.left = parent.element.offsetLeft + 'px';
                    }
                },
                target: '.e-shape-stroke-color',
                iconCss: 'e-dropdownbtn-preview'
            }, '#' + parent.element.id + '_borderColorBtn');
            strokeColor.inline = true;
            (parent.element.querySelector('.e-stroke.e-template .e-dropdownbtn-preview') as HTMLElement).style.background = '#fff';
        }
    }

    private createShapeBtn(items: (string | ItemModel)[]): void {
        const parent: ImageEditor = this.parent;
        const strokeWidthItems: DropDownButtonItemModel[] = [
            { id: '1', text: this.l10n.getConstant('XSmall') },
            { id: '2', text: this.l10n.getConstant('Small') },
            { id: '3', text: this.l10n.getConstant('Medium') },
            { id: '4', text: this.l10n.getConstant('Large') },
            { id: '5', text: this.l10n.getConstant('XLarge') }
        ];
        if (items.indexOf('strokeWidth') > -1) {
            const strokeWidthBtn: HTMLElement = document.getElementById(parent.element.id + '_borderWidthBtn');
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
                    spanElem.textContent = args.item.text;
                    parent.updateStrokeWidth(args.item.id);
                    if (Browser.isDevice) {
                        if (document.getElementById(parent.element.id + '_bottomToolbar')) {
                            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                            const toolbar: any = getComponent(parent.element.id + '_bottomToolbar', 'toolbar') as Toolbar;
                            toolbar.refreshOverflow();
                        }
                    } else {
                        if (document.getElementById(parent.element.id + '_toolbar')) {
                            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                            const toolbar: any = getComponent(parent.element.id + '_toolbar', 'toolbar') as Toolbar;
                            toolbar.refreshOverflow();
                        }
                    }
                }
            });
            // Render initialized DropDownButton.
            drpDownBtn.appendTo('#' + parent.element.id + '_borderWidthBtn');
        }
    }

    private createStartBtn(): void {
        const parent: ImageEditor = this.parent;
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
        const strokeWidthBtn: HTMLElement = document.getElementById(parent.element.id + '_startBtn');
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
                spanElem.textContent = args.item.text;
                parent.updateArrow('startArrow', args.item.id);
            }
        });
        // Render initialized DropDownButton.
        drpDownBtn.appendTo('#' + parent.element.id + '_startBtn');
    }

    private createEndBtn(): void {
        const parent: ImageEditor = this.parent;
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
        const strokeEndBtn: HTMLElement = document.getElementById(parent.element.id + '_endBtn');
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
                spanElem.textContent = args.item.text;
                parent.updateArrow('endArrow', args.item.id);
            }
        });
            // Render initialized DropDownButton.
        drpDownBtn.appendTo('#' + parent.element.id + '_endBtn');
    }

    private getTextToolbarItem(items: (string | ItemModel)[]): ItemModel[] {
        const parent: ImageEditor = this.parent;
        const toolbarItems: ItemModel[] = [];
        if (isNullOrUndefined(parent.toolbar) || (parent.toolbar)) {
            toolbarItems.push({ id: parent.element.id + '_annotation', tooltipText: this.l10n.getConstant('Annotation'), align: 'Center',
                template: '<button id="' + parent.element.id + '_annotationBtn"></button>' });
        }
        if (items.indexOf('fontFamily') > -1) {
            toolbarItems.push({ id: parent.element.id + '_fontFamily', cssClass: 'top-icon e-img-font-family',
                tooltipText: this.l10n.getConstant('FontFamily'), align: 'Center',
                template: '<button id="' + parent.element.id + '_fontFamilyBtn"></button>' });
        }
        if (items.indexOf('fontSize') > -1) {
            toolbarItems.push({ id: parent.element.id + '_fontSize', cssClass: 'top-icon e-img-font-size',
                tooltipText: this.l10n.getConstant('FontSize'), align: 'Center',
                template: '<button id="' + parent.element.id + '_fontSizeBtn"></button>' });
        }
        if (items.indexOf('fontColor') > -1) {
            toolbarItems.push({ cssClass: 'top-icon e-text-font-color', id: parent.element.id + '_text_strokecolor',
                tooltipText: this.l10n.getConstant('FontColor'), align: 'Center',
                type: 'Input', template: '<button id="' + parent.element.id + '_fontColorBtn"></button>' });
        }
        if (items.indexOf('bold') > -1) {
            toolbarItems.push({ id: parent.element.id + '_bold', prefixIcon: 'e-icons e-bold', cssClass: 'top-icon e-bold',
                tooltipText: this.l10n.getConstant('Bold'), align: 'Center' });
        }
        if (items.indexOf('italic') > -1) {
            toolbarItems.push({ id: parent.element.id + '_italic', prefixIcon: 'e-icons e-italic', cssClass: 'top-icon e-italic',
                tooltipText: this.l10n.getConstant('Italic'), align: 'Center' });
        }
        toolbarItems.push({ align: 'Center', type: 'Separator' });
        if (items.indexOf('duplicate') > -1) {
            toolbarItems.push({ id: parent.element.id + '_duplicate', prefixIcon: 'e-icons e-order', cssClass: 'top-icon e-order',
                tooltipText: this.l10n.getConstant('Duplicate'), align: 'Center' });
        }
        if (items.indexOf('remove') > -1) {
            toolbarItems.push({ id: parent.element.id + '_remove', prefixIcon: 'e-icons e-trash', cssClass: 'top-icon e-trash',
                tooltipText: this.l10n.getConstant('Remove'), align: 'Center' });
        }
        if (items.indexOf('text') > -1) {
            toolbarItems.push({ id: parent.element.id + '_editText', prefixIcon: 'e-icons e-annotation-edit', cssClass: 'top-icon e-annotation-edit',
                tooltipText: this.l10n.getConstant('EditText'), align: 'Center' });
        }
        const tempToolbarItems: ItemModel[] = this.processSubToolbar(items);
        for (let i: number = 0, len: number = tempToolbarItems.length; i < len; i++) {
            toolbarItems.push(tempToolbarItems[i as number]);
        }
        if (!Browser.isDevice) {
            toolbarItems.push({ id: parent.element.id + '_ok', prefixIcon: 'e-icons e-check', cssClass: 'top-icon e-tick',
                tooltipText: this.l10n.getConstant('OK'), align: 'Right' });
            toolbarItems.push({ id: parent.element.id + '_cancel', prefixIcon: 'e-icons e-close', cssClass: 'top-icon e-save',
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

    private initTextToolbarItem(items: (string | ItemModel)[]): void {
        const parent: ImageEditor = this.parent;
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
                this.renderAnnotationBtn(true);
                this.createTextColor(items);
                this.createTextBtn(items);
                this.wireZoomBtnEvents();
                if (!Browser.isDevice) {
                    this.renderSaveBtn();
                }
                parent.trigger('toolbarCreated', {toolbarType: 'text'});
                if (Browser.isDevice) {
                    if (this.defToolbarItems.length > 0 && document.getElementById(parent.element.id + '_bottomToolbar')) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        (toolbar as any).refreshOverflow(); (toolbar as any).refreshOverflow(); (toolbar as any).refreshOverflow();
                    }
                } else {
                    this.createLeftToolbarControls();
                    if (this.defToolbarItems.length > 0 && document.getElementById(parent.element.id + '_toolbar')) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        (toolbar as any).refreshOverflow();
                    }
                }
            }
        });
        if (Browser.isDevice) {
            toolbar.appendTo('#' + parent.element.id + '_bottomToolbar');
        } else {
            toolbar.appendTo('#' + parent.element.id + '_toolbar');
        }
        this.enableDisableTbrBtn();
    }

    private createTextColor(items: (string | ItemModel)[]): void {
        const parent: ImageEditor = this.parent;
        if (items.indexOf('fontColor') > -1 && parent.element.querySelector('.e-template.e-text-font-color')) {
            parent.element.querySelector('.e-template.e-text-font-color').appendChild(parent.createElement('input', {
                id: parent.element.id + '_text_font'
            }));
            const fontColor: ColorPicker = new ColorPicker({
                modeSwitcher: false, value: '#fff',
                showButtons: false, mode: 'Palette', cssClass: 'e-text-fontt-color',
                change: (args: ColorPickerEventArgs): void => {
                    parent.updateFontColor(args.currentValue.hex);
                    (strokeDDB.element.children[0] as HTMLElement).style.backgroundColor = args.currentValue.rgba;
                    strokeDDB.toggle();
                }
            }, '#' + parent.element.id + '_text_font');
            const strokeDDB: DropDownButton = new DropDownButton({
                open: (args: OpenCloseMenuEventArgs) => {
                    if (Browser.isDevice) {
                        args.element.parentElement.style.top = strokeDDB.element.getBoundingClientRect().top -
                        args.element.parentElement.offsetHeight + 'px';
                        args.element.parentElement.style.left = parent.element.offsetLeft + 'px';
                    }
                },
                target: '.e-text-fontt-color',
                iconCss: 'e-dropdownbtn-preview'
            }, '#' + parent.element.id + '_fontColorBtn');
            fontColor.inline = true;
            (parent.element.querySelector('.e-text-font-color.e-template .e-dropdownbtn-preview') as HTMLElement).style.background
                = '#fff';
        }
    }

    private createTextBtn(items: (string | ItemModel)[]): void {
        const parent: ImageEditor = this.parent;
        if (items.indexOf('fontFamily') > -1) {
            const fontNameBtn: HTMLElement = document.getElementById(parent.element.id + '_fontFamilyBtn');
            const spanElem: HTMLElement = document.createElement('span');
            if (Browser.isDevice) {
                spanElem.innerHTML = 'ABC';
                spanElem.setAttribute('style', 'font-family: arial');
            } else {
                spanElem.innerHTML = 'Arial';
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
                    if (parent.textArea.style.display === 'block') {
                        fontFamily = parent.textArea.style.fontFamily;
                    } else {
                        fontFamily = parent.activeObj.textSettings.fontFamily;
                    }
                    args.element.querySelector('[id *= ' + '"' + fontFamily.toLowerCase()
                        + '"' + ']').classList.add('e-selected-btn');
                },
                select: (args: MenuEventArgs) => {
                    spanElem.textContent = args.item.text;
                    if (Browser.isDevice) {
                        spanElem.setAttribute('style', 'font-family:' + args.item.id);
                    }
                    parent.updateFontFamily(args.item.id);
                }
            });
            fontFamilyBtn.appendTo('#' + parent.element.id + '_fontFamilyBtn');
        }
        if (items.indexOf('fontSize') > -1) {
            const fontSizeBtnElem: HTMLElement = document.getElementById(parent.element.id + '_fontSizeBtn');
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
                    fontSizeSpanElem.textContent =  args.item.text;
                    parent.updateFontSize(args.item.text);
                }
            });
            fontSizeBtn.appendTo('#' + parent.element.id + '_fontSizeBtn');
        }
    }

    private refreshToolbar(type: string, isApplyBtn?: boolean, isCropping?: boolean, isZooming?: boolean, cType?: string): void {
        const parent: ImageEditor = this.parent;
        if (!parent.isImageLoaded || parent.isCropToolbar) {
            return;
        }
        const item: string = type === 'shapes' && parent.activeObj.shape ? parent.activeObj.shape : type;
        const args: ToolbarEventArgs = { toolbarType: item };
        if (type !== 'filter' && type !== 'color') {
            if (document.getElementById(parent.element.id + '_toolbar') && this.defToolbarItems.length > 0) {
                (getComponent(document.getElementById(parent.element.id + '_toolbar'), 'toolbar') as Toolbar).destroy();
                document.getElementById(parent.element.id + '_toolbar').innerHTML = '';
            }
            if (document.getElementById(parent.element.id + '_bottomToolbar') && this.defToolbarItems.length > 0) {
                if (document.getElementById(parent.element.id + '_bottomToolbar').className.indexOf('e-control') > -1) {
                    (getComponent(document.getElementById(parent.element.id + '_bottomToolbar'), 'toolbar') as Toolbar).destroy();
                    document.getElementById(parent.element.id + '_bottomToolbar').innerHTML = '';
                }
            }
        }
        this.refreshSlider();
        parent.isCropTab = false;
        switch (type) {
        case 'main':
            if (Browser.isDevice) {
                if (isCropping) { this.initMainToolbar(false, true, true); }
                else { this.initMainToolbar(false, true, null); }
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
            if (Browser.isDevice) {
                this.initMainToolbar(false, true, true);
            }
            if (parent.activeObj.shape === 'line' || parent.activeObj.shape === 'path') {
                args.toolbarItems = ['strokeColor', 'strokeWidth', 'duplicate', 'remove'];
            } else if (parent.activeObj.shape === 'arrow') {
                args.toolbarItems = ['strokeColor', 'strokeWidth', 'start', 'end', 'duplicate', 'remove'];
            } else {
                args.toolbarItems = ['fillColor', 'strokeColor', 'strokeWidth', 'duplicate', 'remove'];
            }
            parent.trigger('toolbarUpdating', args);
            this.initShapesToolbarItem(args.toolbarItems);
            break;
        case 'text':
            if (Browser.isDevice) {
                this.initMainToolbar(false, true, true);
            }
            args.toolbarItems = ['fontFamily', 'fontSize', 'fontColor', 'bold', 'italic', 'duplicate', 'remove', 'text'];
            parent.trigger('toolbarUpdating', args);
            this.initTextToolbarItem(args.toolbarItems);
            break;
        case 'pen':
            if (Browser.isDevice) {
                this.initMainToolbar(false, true, true);
            }
            args.toolbarItems = ['strokeColor', 'strokeWidth', 'remove'];
            parent.trigger('toolbarUpdating', args);
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
        case 'color':
            this.updateContextualToolbar(type, cType);
            break;
        case 'croptransform':
            parent.isCropTab = true;
            if (Browser.isDevice) {
                this.initMainToolbar(false, true, true);
            }
            parent.updateCropTransformItems();
            this.initCropTransformToolbar();
            break;
        }
        this.currToolbar = type;
        this.refreshDropDownBtn(isCropping);
    }

    private getAdjustmentToolbarItem(): ItemModel[] {
        const toolbarItems: ItemModel[] = []; const parent: ImageEditor = this.parent;
        if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('Brightness') > -1)) {
            toolbarItems.push({ id: parent.element.id + '_brightness', prefixIcon: 'e-icons e-brightness', cssClass: 'top-icon e-brightness',
                tooltipText: this.l10n.getConstant('Brightness'), align: 'Center' });
        }
        if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('Contrast') > -1)) {
            toolbarItems.push({ id: parent.element.id + '_contrast', prefixIcon: 'e-icons e-contrast', cssClass: 'top-icon e-contrast',
                tooltipText: this.l10n.getConstant('Contrast'), align: 'Center' });
        }
        if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('Hue') > -1)) {
            toolbarItems.push({ id: parent.element.id + '_hue', prefixIcon: 'e-icons e-fade', cssClass: 'top-icon e-fade',
                tooltipText: this.l10n.getConstant('Hue'), align: 'Center' });
        }
        if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('Saturation') > -1)) {
            toolbarItems.push({ id: parent.element.id + '_saturation', prefixIcon: 'e-icons e-saturation', cssClass: 'top-icon e-saturation',
                tooltipText: this.l10n.getConstant('Saturation'), align: 'Center' });
        }
        if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('Exposure') > -1)) {
            toolbarItems.push({ id: parent.element.id + '_exposure', prefixIcon: 'e-icons e-grain', cssClass: 'top-icon e-grain',
                tooltipText: this.l10n.getConstant('Exposure'), align: 'Center' });
        }
        if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('Opacity') > -1)) {
            toolbarItems.push({ id: parent.element.id + '_opacity', prefixIcon: 'e-icons e-opacity', cssClass: 'top-icon e-opacity',
                tooltipText: this.l10n.getConstant('Opacity'), align: 'Center' });
        }
        if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('Blur') > -1)) {
            toolbarItems.push({ id: parent.element.id + '_blur', prefixIcon: 'e-icons e-tint', cssClass: 'top-icon e-tint',
                tooltipText: this.l10n.getConstant('Blur'), align: 'Center' });
        }
        const tempToolbarItems: ItemModel[] = this.processToolbar('center');
        for (let i: number = 0, len: number = tempToolbarItems.length; i < len; i++) {
            toolbarItems.push(tempToolbarItems[i as number]);
        }
        if (!Browser.isDevice) {
            toolbarItems.push({ id: parent.element.id + '_ok', prefixIcon: 'e-icons e-check', cssClass: 'top-icon e-tick',
                tooltipText: this.l10n.getConstant('OK'), align: 'Right' });
            toolbarItems.push({ id: parent.element.id + '_cancel', prefixIcon: 'e-icons e-close', cssClass: 'top-icon e-save',
                tooltipText: this.l10n.getConstant('Cancel'), align: 'Right' });
        }
        return toolbarItems;
    }

    private getFilterToolbarItem(): ItemModel[] {
        const toolbarItems: ItemModel[] = []; const parent: ImageEditor = this.parent;
        if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('Default') > -1)) {
            toolbarItems.push({ id: parent.element.id + '_default', prefixIcon: 'e-icons e-none', cssClass: 'top-icon e-none',
                tooltipText: this.l10n.getConstant('Default'), align: 'Center',
                template: '<div class="filter-wrapper" style="box-sizing: content-box;"><canvas id=' + parent.element.id + '_defaultCanvas' + '></canvas><div style="text-align:center;"><span>' + this.l10n.getConstant('Default') + '</span></div></div>' });
        }
        if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('Chrome') > -1)) {
            toolbarItems.push({ id: parent.element.id + '_chrome', prefixIcon: 'e-icons e-none', cssClass: 'top-icon e-none',
                tooltipText: this.l10n.getConstant('Chrome'), align: 'Center',
                template: '<div class="filter-wrapper" style="box-sizing: content-box;"><canvas id=' + parent.element.id + '_chromeCanvas' + '></canvas><div style="text-align:center;"><span>' + this.l10n.getConstant('Chrome') + '</span></div></div>' });
        }
        if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('Cold') > -1)) {
            toolbarItems.push({ id: parent.element.id + '_cold', prefixIcon: 'e-icons e-none', cssClass: 'top-icon e-none',
                tooltipText: this.l10n.getConstant('Cold'), align: 'Center',
                template: '<div class="filter-wrapper" style="box-sizing: content-box;"><canvas id=' + parent.element.id + '_coldCanvas' + '></canvas><div style="text-align:center;"><span>' + this.l10n.getConstant('Cold') + '</span></div></div>' });
        }
        if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('Warm') > -1)) {
            toolbarItems.push({ id: parent.element.id + '_warm', prefixIcon: 'e-icons e-none', cssClass: 'top-icon e-none',
                tooltipText: this.l10n.getConstant('Warm'), align: 'Center',
                template: '<div class="filter-wrapper" style="box-sizing: content-box;"><canvas id=' + parent.element.id + '_warmCanvas' + '></canvas><div style="text-align:center;"><span>' + this.l10n.getConstant('Warm') + '</span></div></div>' });
        }
        if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('Grayscale') > -1)) {
            toolbarItems.push({ id: parent.element.id + '_grayscale', prefixIcon: 'e-icons e-none', cssClass: 'top-icon e-none',
                tooltipText: this.l10n.getConstant('Grayscale'), align: 'Center',
                template: '<div class="filter-wrapper" style="box-sizing: content-box;"><canvas id=' + parent.element.id + '_grayscaleCanvas' + '></canvas><div style="text-align:center;"><span>' + this.l10n.getConstant('Grayscale') + '</span></div></div>' });
        }
        if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('Sepia') > -1)) {
            toolbarItems.push({ id: parent.element.id + '_sepia', prefixIcon: 'e-icons e-none', cssClass: 'top-icon e-none',
                tooltipText: this.l10n.getConstant('Sepia'), align: 'Center',
                template: '<div class="filter-wrapper" style="box-sizing: content-box;"><canvas id=' + parent.element.id + '_sepiaCanvas' + '></canvas><div style="text-align:center;"><span>' + this.l10n.getConstant('Sepia') + '</span></div></div>' });
        }
        if (isNullOrUndefined(parent.toolbar) || (parent.toolbar && parent.toolbar.indexOf('Invert') > -1)) {
            toolbarItems.push({ id: parent.element.id + '_invert', prefixIcon: 'e-icons e-none', cssClass: 'top-icon e-none',
                tooltipText: this.l10n.getConstant('Invert'), align: 'Center',
                template: '<div class="filter-wrapper" style="box-sizing: content-box;"><canvas id=' + parent.element.id + '_invertCanvas' + '></canvas><div style="text-align:center;"><span>' + this.l10n.getConstant('Invert') + '</span></div></div>' });
        }
        const tempToolbarItems: ItemModel[] = this.processToolbar('center');
        for (let i: number = 0, len: number = tempToolbarItems.length; i < len; i++) {
            toolbarItems.push(tempToolbarItems[i as number]);
        }
        return toolbarItems;
    }

    private getPenToolbarItem(items: (string | ItemModel)[]): ItemModel[] {
        const parent: ImageEditor = this.parent;
        const toolbarItems: ItemModel[] = [];
        if (isNullOrUndefined(parent.toolbar) || parent.toolbar) {
            toolbarItems.push({ id: parent.element.id + '_annotation', tooltipText: this.l10n.getConstant('Annotation'), align: 'Center',
                template: '<button id="' + parent.element.id + '_annotationBtn"></button>' });
        }
        if (items.indexOf('strokeColor') > -1) {
            toolbarItems.push({ prefixIcon: 'e-icons e-copy', id: parent.element.id + '_pen_strokecolor',
                cssClass: 'top-icon e-pen-stroke-color',
                tooltipText: this.l10n.getConstant('StrokeColor'), align: 'Center', type: 'Input',
                template: '<button id="' + parent.element.id + '_penColorBtn"></button>' });
        }
        if (items.indexOf('strokeWidth') > -1) {
            toolbarItems.push({ prefixIcon: 'e-icons e-copy', cssClass: 'top-icon e-size',
                tooltipText: this.l10n.getConstant('StrokeWidth'),
                align: 'Center', type: 'Input', template: '<button id="' + parent.element.id + '_penStrokeWidth"></button>' });
        }
        toolbarItems.push({ align: 'Center', type: 'Separator' });
        if (items.indexOf('remove') > -1) {
            toolbarItems.push({ id: parent.element.id + '_remove', prefixIcon: 'e-icons e-trash', cssClass: 'top-icon e-trash',
                tooltipText: this.l10n.getConstant('Remove'), align: 'Center' });
        }
        const tempToolbarItems: ItemModel[] = this.processSubToolbar(items);
        for (let i: number = 0, len: number = tempToolbarItems.length; i < len; i++) {
            toolbarItems.push(tempToolbarItems[i as number]);
        }
        if (!Browser.isDevice) {
            toolbarItems.push({ id: parent.element.id + '_ok', prefixIcon: 'e-icons e-check', cssClass: 'top-icon e-tick',
                tooltipText: this.l10n.getConstant('OK'), align: 'Right' });
            toolbarItems.push({ id: parent.element.id + '_cancel', prefixIcon: 'e-icons e-close', cssClass: 'top-icon e-save',
                tooltipText: this.l10n.getConstant('Cancel'), align: 'Right' });
        }
        return toolbarItems;
    }

    private initPenToolbarItem(items: (string | ItemModel)[]): void {
        const parent: ImageEditor = this.parent;
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
                this.renderAnnotationBtn(true);
                this.createPenColor(items);
                this.createPenBtn(items);
                this.wireZoomBtnEvents();
                if (!Browser.isDevice) {
                    this.renderSaveBtn();
                }
                parent.trigger('toolbarCreated', {toolbarType: 'pen'});
                if (Browser.isDevice) {
                    if (this.defToolbarItems.length > 0 && document.getElementById(parent.element.id + '_toolbar')) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        (toolbar as any).refreshOverflow(); (toolbar as any).refreshOverflow();
                    }
                } else {
                    this.createLeftToolbarControls();
                    if (this.defToolbarItems.length > 0 && document.getElementById(parent.element.id + '_toolbar')) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        (toolbar as any).refreshOverflow();
                    }
                }
            }
        });
        if (Browser.isDevice) {
            toolbar.appendTo('#' + parent.element.id + '_bottomToolbar');
        } else {
            toolbar.appendTo('#' + parent.element.id + '_toolbar');
        }
        this.enableDisableTbrBtn();
    }

    private createPenColor(items: (string | ItemModel)[]): void {
        const parent: ImageEditor = this.parent;
        if (items.indexOf('strokeColor') > -1) {
            parent.element.querySelector('.e-template.e-pen-stroke-color').appendChild(parent.createElement('input', {
                id: parent.element.id + '_pen_stroke'
            }));
            const penColor: ColorPicker = new ColorPicker({
                modeSwitcher: false, value: '#fff',
                showButtons: false, mode: 'Palette', cssClass: 'e-pen-color',
                change: (args: ColorPickerEventArgs): void => {
                    parent.updatePenStrokeColor(args.currentValue.hex);
                    this.selFhdColor = args.currentValue.hex;
                    (strokeDDB.element.children[0] as HTMLElement).style.backgroundColor = args.currentValue.rgba;
                    strokeDDB.toggle();
                }
            }, '#' + parent.element.id + '_pen_stroke');
            const strokeDDB: DropDownButton = new DropDownButton({
                open: (args: OpenCloseMenuEventArgs) => {
                    if (Browser.isDevice) {
                        args.element.parentElement.style.top = strokeDDB.element.getBoundingClientRect().top -
                        args.element.parentElement.offsetHeight + 'px';
                        args.element.parentElement.style.left = parent.element.offsetLeft + 'px';
                    }
                },
                target: '.e-pen-color',
                iconCss: 'e-dropdownbtn-preview'
            }, '#' + parent.element.id + '_penColorBtn');
            penColor.inline = true;
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
                = '#fff';
            }
        }
    }

    private createPenBtn(items: (string | ItemModel)[]): void {
        const parent: ImageEditor = this.parent;
        const strokeWidthItems: DropDownButtonItemModel[] = [
            { id: '1', text: this.l10n.getConstant('XSmall') },
            { id: '2', text: this.l10n.getConstant('Small') },
            { id: '3', text: this.l10n.getConstant('Medium') },
            { id: '4', text: this.l10n.getConstant('Large') },
            { id: '5', text: this.l10n.getConstant('XLarge') }
        ];
        if (items.indexOf('strokeWidth') > -1) {
            const strokeWidthBtn: HTMLElement = document.getElementById(parent.element.id + '_penStrokeWidth');
            const spanElem: HTMLElement = document.createElement('span');
            const indexObj: Object = {freehandSelectedIndex: null };
            parent.notify('freehand-draw', {prop: 'getFreehandSelectedIndex', onPropertyChange: false, value: {obj: indexObj }});
            if (!isNullOrUndefined(indexObj['freehandSelectedIndex']) && indexObj['freehandSelectedIndex'] > -1) {
                spanElem.innerHTML = this.getPenStroke(parent.pointColl[indexObj['freehandSelectedIndex']].strokeWidth);
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
                    spanElem.textContent = args.item.text;
                    parent.updatePenStrokeWidth(args.item.id);
                    if (Browser.isDevice) {
                        if (document.getElementById(parent.element.id + '_bottomToolbar')) {
                            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                            const toolbar: any = getComponent(parent.element.id + '_bottomToolbar', 'toolbar') as Toolbar;
                            toolbar.refreshOverflow();
                        }
                    } else {
                        if (document.getElementById(parent.element.id + '_toolbar')) {
                            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                            const toolbar: any = getComponent(parent.element.id + '_toolbar', 'toolbar') as Toolbar;
                            toolbar.refreshOverflow();
                        }
                    }
                }
            });
            // Render initialized DropDownButton.
            drpDownBtn.appendTo('#' + parent.element.id + '_penStrokeWidth');
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
        const parent: ImageEditor = this.parent;
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
                this.wireZoomBtnEvents();
                if (!Browser.isDevice) {
                    this.renderSaveBtn();
                }
                if (Browser.isDevice) {
                    if (this.defToolbarItems.length > 0 && document.getElementById(parent.element.id + '_toolbar')) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        (toolbar as any).refreshOverflow();
                    }
                } else {
                    this.createLeftToolbarControls();
                    if (this.defToolbarItems.length > 0 && document.getElementById(parent.element.id + '_toolbar')) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        (toolbar as any).refreshOverflow();
                    }
                }
            }
        });
        if (Browser.isDevice) {
            toolbar.appendTo('#' + parent.element.id + '_bottomToolbar');
        } else {
            toolbar.appendTo('#' + parent.element.id + '_toolbar');
        }
        this.enableDisableTbrBtn();
    }

    private initFilterToolbarItem(): void {
        const parent: ImageEditor = this.parent;
        const mainItem: ItemModel[] = this.getFilterToolbarItem();
        if (document.querySelector('#' + parent.element.id + '_contextualToolbar').classList.contains('e-control')) {
            (getComponent(document.getElementById(parent.element.id + '_contextualToolbar'), 'toolbar') as Toolbar).destroy();
        }
        const toolbar: Toolbar = new Toolbar({
            width: '100%',
            items: mainItem,
            clicked: this.contextualToolbarClicked.bind(this),
            created: () => {
                this.updatePrivateVariables();
                this.createCanvasFilter();
                if (parent.currentFilter === '') {
                    parent.currentFilter = parent.element.id + '_default';
                }
                const hdrWrapper: HTMLElement = document.querySelector('#' + parent.element.id + '_headWrapper');
                if (hdrWrapper) {
                    hdrWrapper.style.display = 'none';
                }
                document.getElementById(parent.currentFilter + 'Canvas').parentElement.parentElement.classList.add('e-selected');
                this.enableDisableTbrBtn();
                toolbar.refreshOverflow();
            }
        });
        toolbar.appendTo('#' + parent.element.id + '_contextualToolbar');
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
            filter.style.width = '100px'; filter.style.height = '100px';
            parent.notify('filter', {prop: 'updateAdj', value: { type: type, value: null, isPreview: true, ctx: ctx }});
            ctx.drawImage(this.inMemoryCanvas, 0, 0, 300, 150);
        }
    }

    private getQuickAccessToolbarItem(isPenEdit: boolean): ItemModel[] {
        const parent: ImageEditor = this.parent;
        const args: QuickAccessToolbarEventArgs = {cancel: false, toolbarItems: []};
        const toolbarItems: (string | ItemModel)[] = [];
        if (isNullOrUndefined(isPenEdit)) {
            toolbarItems.push('Clone'); toolbarItems.push('Delete');
            if (parent.activeObj.shape === 'text') {
                toolbarItems.push('EditText');
            }
            args.shape = parent.toPascalCase(parent.activeObj.shape);
        } else if (isPenEdit) {
            toolbarItems.push('Delete');
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
                case 'Clone':
                    orgToolbarItems.push({ id: parent.element.id + '_duplicate', prefixIcon: 'e-icons e-order', cssClass: 'top-icon e-order',
                        tooltipText: this.l10n.getConstant('Duplicate'), align: 'Left' });
                    break;
                case 'Delete':
                    orgToolbarItems.push({ id: parent.element.id + '_remove', prefixIcon: 'e-icons e-trash', cssClass: 'top-icon e-trash',
                        tooltipText: this.l10n.getConstant('Remove'), align: 'Left' });
                    break;
                case 'EditText':
                    orgToolbarItems.push({ id: parent.element.id + '_editText', prefixIcon: 'e-icons e-annotation-edit', cssClass: 'top-icon e-annotation-edit',
                        tooltipText: this.l10n.getConstant('EditText'), align: 'Left' });
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
        const parent: ImageEditor = this.parent;
        if (parent.activeObj && parent.showQuickAccessToolbar) {
            const qtArea: HTMLElement = document.getElementById(parent.element.id + '_quickAccessToolbarArea');
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
                toolbarObj.appendTo('#' + parent.element.id + '_quickAccessToolbar');
            }
            if (isNullOrUndefined(isPenEdit)) {
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
                if (y - 60 < parent.img.destTop) {
                    qtArea.style.top = parent.img.destTop + 'px';
                } else {
                    qtArea.style.top = y - 60 + 'px';
                }
            } else if (isPenEdit) {
                const obj: Object = {activePoint: null };
                const indexObj: Object = {freehandSelectedIndex: null };
                parent.notify('freehand-draw', {prop: 'getFreehandSelectedIndex', onPropertyChange: false, value: {obj: indexObj }});
                parent.notify('freehand-draw', {prop: 'getSqPtFD',
                    value: { idx: indexObj['freehandSelectedIndex'], obj: obj }});
                const point: ActivePoint = obj['activePoint'];
                qtArea.style.width = 'auto';
                qtArea.style.left = (point.startX + (point.width / 2)) - (items.length * 27) + 'px';
                if (point.startY - 60 < parent.img.destTop) {
                    qtArea.style.top = parent.img.destTop + 'px';
                } else {
                    qtArea.style.top = point.startY - 60 + 'px';
                }
            }
        }
    }

    private refreshDropDownBtn(isDisabled: boolean): void {
        if (isNullOrUndefined(isDisabled)) {
            return;
        }
        const parent: ImageEditor = this.parent;
        const annotation: HTMLElement = document.querySelector('#' + parent.element.id + '_annotationBtn');
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
        const transform: HTMLElement = document.querySelector('#' + parent.element.id + '_transformBtn');
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
        const adjustment: HTMLElement = document.querySelector('#' + parent.element.id + '_adjustment');
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
        const filter: HTMLElement = document.querySelector('#' + parent.element.id + '_filter');
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
        parent.select(text);
        this.enableDisableTbrBtn();
        parent.notify('transform', { prop: 'disableZoomOutBtn', value: {isZoomOut: true }});
    }

    private quickAccessToolbarClicked(args: ClickEventArgs, isContextualToolbar?: boolean): void {
        const parent: ImageEditor = this.parent;
        const points: Point = {x: parent.activeObj.activePoint.startX, y: parent.activeObj.activePoint.startY};
        if (args.item) {
            let duplicateObj: SelectionPoint; let objColl: SelectionPoint[]; let isPreventUndoRedo: boolean = null;
            const obj: Object = {prevActObj: null }; const object: Object = {tempObj: null };
            parent.notify('draw', { prop: 'getPrevActObj', onPropertyChange: false, value: {obj: obj }});
            parent.notify('selection', { prop: 'getTempActObj', onPropertyChange: false, value: {obj: object }});
            object['tempObj']['activePoint']['height'] = Math.abs(object['tempObj']['activePoint']['height']);
            const pathObject: Object = {isNewPath: null };
            parent.notify('draw', {prop: 'getNewPath', value: {obj: pathObject}});
            switch (args.item.id.replace(parent.element.id + '_', '').toLowerCase()) {
            case 'duplicate':
                if (!parent.element.querySelector('#' + parent.element.id + '_duplicate').classList.contains('e-disabled')) {
                    if (!pathObject['isNewPath'] && JSON.stringify(object['tempObj']) === JSON.stringify(parent.activeObj)) {
                        isPreventUndoRedo = true;
                    }
                    duplicateObj = extend({}, parent.activeObj, {}, true) as SelectionPoint;
                    if (isNullOrUndefined(parent.activeObj.currIndex)) {
                        parent.notify('shape', { prop: 'applyActObj', onPropertyChange: false, value: {isMouseDown: isPreventUndoRedo}});
                    } else if (obj['prevActObj']) {
                        parent.activeObj.currIndex = null; duplicateObj.currIndex = null;
                        parent.notify('shape', { prop: 'applyActObj', onPropertyChange: false, value: {isMouseDown: isPreventUndoRedo}});
                    } else {
                        parent.notify('shape', { prop: 'applyActObj', onPropertyChange: false, value: {isMouseDown: true}});
                    }
                    if (pathObject['isNewPath']) {
                        parent.notify('undo-redo', { prop: 'updateCurrUrc', value: { type: 'ok' } });
                    }
                    objColl = extend([], parent.objColl, [], true) as SelectionPoint[];
                    duplicateObj.activePoint.startX += 10; duplicateObj.activePoint.startY -= 10;
                    duplicateObj.activePoint.endX += 10; duplicateObj.activePoint.endY -= 10;
                    if (duplicateObj.shape === 'path') {
                        for (let i: number = 0; i < duplicateObj.pointColl.length; i++) {
                            duplicateObj.pointColl[i as number].x += 10;
                            duplicateObj.pointColl[i as number].y -= 10;
                        }
                    }
                    parent.activeObj = duplicateObj;
                    if (parent.activeObj.shape === 'line' || parent.activeObj.shape === 'arrow') {
                        parent.notify('shape', { prop: 'setPointCollForLineArrow', onPropertyChange: false,
                            value: {obj: parent.activeObj }});
                    }
                    // parent.updateTrianglePoints(parent.activeObj); Invoke
                    parent.notify('draw', { prop: 'drawObject', onPropertyChange: false, value: {canvas: 'duplicate', obj: parent.activeObj} });
                    parent.notify('undo-redo', { prop: 'updateUrObj', onPropertyChange: false, value: {objColl: objColl}});
                    this.renderQAT();
                }
                break;
            case 'remove':
                if (!parent.element.querySelector('#' + parent.element.id + '_remove').classList.contains('e-disabled')) {
                    parent.notify('selection', { prop: 'deleteItem', onPropertyChange: false});
                }
                break;
            case 'edittext':
                if (!parent.element.querySelector('#' + parent.element.id + '_editText').classList.contains('e-disabled')) {
                    this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
                    parent.notify('selection', { prop: 'setTempActObj', onPropertyChange: false,
                        value: { obj: extend({}, parent.activeObj, {}, true) }});
                    parent.notify('selection', { prop: 'setInitialTextEdit', onPropertyChange: false,
                        value: { bool: true }});
                    parent.notify('draw', { prop: 'setPrevActObj', onPropertyChange: false,
                        value: { prevActObj: extend({}, parent.activeObj, {}, true) }});
                    if (parent.activeObj.rotatedAngle !== 0) {
                        points.x = parent.activeObj.horTopLinePointColl[0].x;
                        points.y = parent.activeObj.horTopLinePointColl[0].y;
                    }
                    parent.notify('shape', { prop: 'renderTextArea', onPropertyChange: false,
                        value: {x: points.x, y: points.y, actObj: parent.activeObj}});
                    if (isNullOrUndefined(parent.activeObj.currIndex)) {
                        parent.notify('draw', { prop: 'setShapeTextInsert', onPropertyChange: false, value: {bool: true } });
                    }else if (obj['prevActObj']) {
                        parent.notify('draw', { prop: 'setShapeTextInsert', onPropertyChange: false, value: {bool: true } });
                    }
                    if (document.getElementById(parent.element.id + '_quickAccessToolbarArea')) {
                        document.getElementById(parent.element.id + '_quickAccessToolbarArea').style.display = 'none';
                    }
                }
                break;
            }
        }
        if (isNullOrUndefined(isContextualToolbar)) {
            parent.trigger('quickAccessToolbarItemClick', args);
        }
    }

    private defToolbarClicked(args: ClickEventArgs): void {
        const parent: ImageEditor = this.parent;
        let isContextualToolbar: boolean = false;
        let isFilterFinetune: boolean = false;
        if (parent.element.querySelector('.e-contextual-toolbar-wrapper')) {
            if (!parent.element.querySelector('.e-contextual-toolbar-wrapper').classList.contains('e-hide')) {
                isContextualToolbar = isFilterFinetune = true;
            }
            parent.element.querySelector('.e-contextual-toolbar-wrapper').classList.add('e-hide');
        }
        if (args.item) {
            const type: string = args.item.id.replace(parent.element.id + '_', '').toLowerCase();
            if (type === 'duplicate' || type === 'remove' || type === 'edittext') {
                this.quickAccessToolbarClicked(args, true);
                parent.trigger('toolbarItemClicked', args);
            } else {
                let isDisabledFilter: boolean = false; let isDisabledAdjustment: boolean = false;
                const adjustment: HTMLElement = document.querySelector('#' + parent.element.id + '_adjustment');
                if (adjustment && adjustment.classList.contains('e-disabled')) {
                    isDisabledAdjustment = true;
                }
                const filter: HTMLElement = document.querySelector('#' + parent.element.id + '_filter');
                if (filter && filter.classList.contains('e-disabled')) {
                    isDisabledFilter = true;
                }
                this.enableDisableTbrBtn();
                this.performDefTbrClick(type, isContextualToolbar, isDisabledAdjustment, isDisabledFilter, isFilterFinetune);
                parent.trigger('toolbarItemClicked', args);
            }
        }
    }

    private performDefTbrClick(type: string, isContextualToolbar: boolean, isDisabledAdjustment: boolean,
                               isDisabledFilter: boolean, isFilterFinetune: boolean): void {
        const parent: ImageEditor = this.parent;
        const zoomIn: HTMLElement = parent.element.querySelector('#' + parent.element.id + '_zoomIn');
        let isCropSelection: boolean = false;  let panBtn: HTMLElement;
        let splitWords: string[];
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
                        parent.freehandDraw(true);
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
                parent.notify('draw', {prop: 'performCancel', value: {isContextualToolbar: isContextualToolbar}});
                break;
            case 'ok':
                parent.okBtn();
                this.refreshDropDownBtn(false);
                this.currentToolbar = 'main';
                break;
            case 'crop':
                parent.notify('transform', { prop: 'disableZoomOutBtn', value: {isZoomOut: true }});
                break;
            case 'reset':
                parent.reset();
                this.currentToolbar = 'main';
                break;
            case 'undo':
                parent.notify('undo-redo', {prop: 'call-undo'});
                break;
            case 'redo':
                parent.notify('undo-redo', {prop: 'call-redo'});
                break;
            case 'adjustment':
                if (!isDisabledAdjustment) {
                    if (parent.currObjType.isFiltered) {parent.okBtn(); }
                    this.refreshToolbar('adjustment');
                    parent.setTempFilterProperties();
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
                if (parent.element.querySelector('#' + parent.element.id + '_bold').classList.contains('e-selected-btn')) {
                    parent.element.querySelector('#' + parent.element.id + '_bold').classList.remove('e-selected-btn');
                } else {
                    parent.element.querySelector('#' + parent.element.id + '_bold').classList.add('e-selected-btn');
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
                if (parent.element.querySelector('#' + parent.element.id + '_italic').classList.contains('e-selected-btn')) {
                    parent.element.querySelector('#' + parent.element.id + '_italic').classList.remove('e-selected-btn');
                } else {
                    parent.element.querySelector('#' + parent.element.id + '_italic').classList.add('e-selected-btn');
                }
                break;
            case 'croptransform':
                this.refreshToolbar('croptransform');
                break;
            case 'rotateleft':
            case 'rotateright':
            case 'horizontalflip':
            case 'verticalflip':
                parent.transformSelect(type);
                parent.notify('transform', { prop: 'disableZoomOutBtn', value: {isZoomOut: true }});
                break;
            case 'save':
                if ((parent.element.querySelector('#' + parent.element.id + '_saveBtn') as HTMLElement).classList.contains('e-hide')) {
                    (parent.element.querySelector('#' + parent.element.id + '_saveBtn') as HTMLElement).classList.remove('e-hide');
                    break;
                } else {parent.okBtn(); }
                (parent.element.querySelector('#' + parent.element.id + '_saveBtn') as HTMLElement).classList.add('e-hide');
                (parent.element.querySelector('#' + parent.element.id + '_saveBtn') as HTMLElement).click();
                break;
            }
        }
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
        if (imageFiltering.cancel) { return; }
        document.getElementById(args.item.id + 'Canvas').parentElement.parentElement.classList.add('e-selected');
        parent.currObjType.isFiltered = true;
        parent.notify('filter', { prop: 'applyImageFilter', value: { option: type.toLowerCase() } });
        parent.currentFilter = args.item.id;
        this.enableDisableTbrBtn();
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
        const parent: ImageEditor = this.parent;
        if ((parent.zoomSettings.zoomTrigger & ZoomTrigger.Toolbar) === ZoomTrigger.Toolbar) {
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
            this.applyPreviewFilter();
            parent.currObjType.isFiltered = false;
            if (parent.togglePen) {
                parent.currObjType.isZoomed = true;
                parent.freeHandDraw(false);
                parent.notify('undo-redo', {prop: 'updateCurrUrc', value: {type: 'ok' }});
            }
            parent.notify('draw', {prop: 'resetCurrentSelectionPoint' });
            parent.notify('transform', { prop: 'zoomAction', onPropertyChange: false,
                value: {zoomFactor: .1, zoomPoint: null}});
        }
    }

    private zoomOutBtnClickHandler(e: MouseEvent & TouchEvent): void {
        const parent: ImageEditor = this.parent;
        if ((parent.zoomSettings.zoomTrigger & ZoomTrigger.Toolbar) === ZoomTrigger.Toolbar) {
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
            this.applyPreviewFilter();
            parent.currObjType.isFiltered = false;
            if (parent.togglePen) {
                parent.currObjType.isZoomed = true;
                parent.freeHandDraw(false);
                parent.notify('undo-redo', {prop: 'updateCurrUrc', value: {type: 'ok' }});
            }
            parent.notify('draw', {prop: 'resetCurrentSelectionPoint' });
            parent.notify('transform', { prop: 'zoomAction', onPropertyChange: false,
                value: {zoomFactor: -.1, zoomPoint: null}});
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
        const parent: ImageEditor = this.parent;
        let isContextualToolbar: boolean = false;
        if ((parent.element.querySelector('#' + parent.element.id + '_contextualToolbar') &&
            !parent.element.querySelector('#' + parent.element.id + '_contextualToolbar').parentElement.classList.contains('e-hide')) ||
            (parent.element.querySelector('#' + parent.element.id + '_headWrapper')
            && !parent.element.querySelector('#' + parent.element.id + '_headWrapper').parentElement.classList.contains('e-hide'))) {
            parent.element.querySelector('.e-contextual-toolbar-wrapper').classList.add('e-hide');
            parent.okBtn();
            this.refreshMainToolbar();
            isContextualToolbar = true;
        }
        return isContextualToolbar;
    }

    private destroyQuickAccessToolbar(): void {
        const parent: ImageEditor = this.parent;
        const quickToolbar: HTMLElement = document.getElementById(parent.element.id + '_quickAccessToolbar');
        if (quickToolbar && quickToolbar.classList.contains('e-control')) {
            (getComponent(quickToolbar, 'toolbar') as Toolbar).destroy();
        }
        const qatArea: HTMLElement = document.getElementById(parent.element.id + '_quickAccessToolbarArea');
        if (qatArea) {
            qatArea.style.display = 'none';
        }
    }

    private renderSlider(type: string): void {
        const parent: ImageEditor = this.parent;
        const canvasWrapper: HTMLElement = document.querySelector('#' + parent.element.id + '_contextualToolbarArea');
        let hdrWrapper: HTMLElement = document.querySelector('#' + parent.element.id + '_headWrapper');
        let labelWrapper: HTMLElement = document.querySelector('#' + parent.element.id + '_labelWrapper');
        if (!hdrWrapper) {
            hdrWrapper = canvasWrapper.appendChild(parent.createElement('div', {
                id: parent.element.id + '_headWrapper',
                styles: 'position: relative'
            }));
            labelWrapper = hdrWrapper.appendChild(parent.createElement('label', {
                id: parent.element.id + '_labelWrapper',
                styles: Browser.isDevice ? 'position: absolute; top: 25%; left: calc(50% - 150px); font-size: 15px; text-transform: capitalize; font-weight: 400;'
                    : 'position: absolute; top: 25%; left: calc(50% - 226px); font-size: 15px; text-transform: capitalize; font-weight: 400;'
            }));
        } else {
            hdrWrapper.style.display = 'block';
        }
        labelWrapper.textContent = this.l10n.getConstant(parent.toPascalCase(type));
        const sliderWrapper: HTMLElement = hdrWrapper.appendChild(parent.createElement('div', {
            id: parent.element.id + '_sliderWrapper',
            styles: 'position: absolute'
        }));
        const value: number = parent.getCurrAdjustmentValue(type);
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
        }
        slider.appendTo('#' + parent.element.id + '_sliderWrapper');
        sliderWrapper.style.left = (parseFloat(canvasWrapper.style.width) - parseFloat(slider.width as string)) / 2 + 'px';
    }

    private createSlider(min: number, max: number, value: number, type: string): Slider {
        const parent: ImageEditor = this.parent;
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
                parent.setCurrAdjustmentValue(type, args.value as number);
                this.enableDisableTbrBtn();
            }
        });
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
        const parent: ImageEditor = this.parent;
        const selectors: string[] = [
            '#' + parent.element.id + '_brightness',
            '#' + parent.element.id + '_contrast',
            '#' + parent.element.id + '_hue',
            '#' + parent.element.id + '_saturation',
            '#' + parent.element.id + '_opacity',
            '#' + parent.element.id + '_blur',
            '#' + parent.element.id + '_exposure'
        ];
        for (const selector of selectors) {
            const element: HTMLElement = document.querySelector(selector);
            if (element.classList.contains('e-selected-btn')) {
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
        const sliderWrapper: HTMLElement = document.querySelector('#' + this.parent.element.id + '_sliderWrapper');
        // eslint-disable-next-line
        const slider: any = document.querySelector('.e-slider');
        const hdrWrapper: HTMLElement = document.querySelector('#' + this.parent.element.id + '_headWrapper');
        if (hdrWrapper) {
            hdrWrapper.style.display = 'none';
        }
        if (sliderWrapper && slider) {
            slider.ej2_instances[0].destroy();
            sliderWrapper.remove();
        }
    }

    private updateToolbarItems(): void {
        const parent: ImageEditor = this.parent;
        const selFillElem: HTMLElement = parent.element.querySelector('.e-fill.e-template .e-dropdownbtn-preview') as HTMLElement;
        const selStrokeElem: HTMLElement = parent.element.querySelector('.e-stroke.e-template .e-dropdownbtn-preview') as HTMLElement;
        const selTextStrokeElem: HTMLElement = parent.element.querySelector('.e-text-font-color.e-template .e-dropdownbtn-preview') as HTMLElement;
        const selPenStrokeElem: HTMLElement = parent.element.querySelector('.e-pen-stroke-color.e-template .e-dropdownbtn-preview') as HTMLElement;
        const strokeWidthElem: HTMLElement = parent.element.querySelector('.e-shape-stroke-width') as HTMLElement;
        const fontFamilyElem: HTMLElement = parent.element.querySelector('.e-text-font-family') as HTMLElement;
        const fontSizeElem: HTMLElement = parent.element.querySelector('.e-text-font-size') as HTMLElement;
        const boldBtn: HTMLElement = parent.element.querySelector('#' + parent.element.id + '_bold') as HTMLElement;
        const italicBtn: HTMLElement = parent.element.querySelector('#' + parent.element.id + '_italic') as HTMLElement;
        if (isNullOrUndefined(parent.activeObj.strokeSettings.strokeWidth)) {
            parent.activeObj.strokeSettings.strokeWidth = 2;
        }
        if (selFillElem) {
            if (parent.activeObj.strokeSettings.fillColor === '') {
                selFillElem.classList.add('e-nocolor-item');
            } else {
                selFillElem.classList.remove('e-nocolor-item');
                selFillElem.style.background = parent.activeObj.strokeSettings.fillColor;
            }
            (getComponent(parent.element.id + '_shape_fill', 'colorpicker') as ColorPicker).value
            = parent.activeObj.strokeSettings.fillColor + 'ff';
        }
        if (selStrokeElem) {
            selStrokeElem.style.background = parent.activeObj.strokeSettings.strokeColor;
            (getComponent(parent.element.id + '_shape_stroke', 'colorpicker') as ColorPicker).value
            = parent.activeObj.strokeSettings.strokeColor + 'ff';
        }
        if (selTextStrokeElem) {
            selTextStrokeElem.style.background = parent.activeObj.strokeSettings.strokeColor;
            (getComponent(parent.element.id + '_text_font', 'colorpicker') as ColorPicker).value
            = parent.activeObj.strokeSettings.strokeColor + 'ff';
        }
        if (selPenStrokeElem) {
            selPenStrokeElem.style.background = parent.activeObj.strokeSettings.strokeColor;
            (getComponent(parent.element.id + '_pen_stroke', 'colorpicker') as ColorPicker).value
            = parent.activeObj.strokeSettings.strokeColor + 'ff';
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
            const strokeWidth: string = Math.round((parent.activeObj.strokeSettings.strokeWidth)).toString();
            strokeWidthElem.textContent = this.getStrokeWidth(strokeWidth);
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
    }

    public getModuleName(): string {
        return 'toolbar-module';
    }
}
