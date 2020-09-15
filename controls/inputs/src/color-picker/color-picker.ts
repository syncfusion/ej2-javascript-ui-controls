import { BaseEventArgs, Component, EmitType, Event, INotifyPropertyChanged, NotifyPropertyChanges, Property } from '@syncfusion/ej2-base';
import { Browser, closest, detach, EventHandler, getInstance, select, selectAll, formatUnit } from '@syncfusion/ej2-base';
import { addClass, attributes, classList, isNullOrUndefined, L10n } from '@syncfusion/ej2-base';
import { remove, removeClass, rippleEffect } from '@syncfusion/ej2-base';
import { SplitButton, BeforeOpenCloseMenuEventArgs, getModel, ClickEventArgs, OpenCloseMenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { Deferred } from '@syncfusion/ej2-splitbuttons';
import { Tooltip, TooltipEventArgs, getZindexPartial, Popup } from '@syncfusion/ej2-popups';
import { Input } from './../input/index';
import { NumericTextBox, NumericTextBoxModel, ChangeEventArgs } from './../numerictextbox/index';
import { Slider, SliderChangeEventArgs } from './../slider/slider';
import { ColorPickerModel } from './color-picker-model';

/**
 * ColorPicker Mode
 */
export type ColorPickerMode = 'Picker' | 'Palette';

const APPLY: string = 'e-apply';
const CANCEL: string = 'e-cancel';
const CURRENT: string = 'e-current';
const CONTAINER: string = 'e-container';
const CTRLBTN: string = 'e-ctrl-btn';
const CTRLSWITCH: string = 'e-switch-ctrl-btn';
const DISABLED: string = 'e-disabled';
const FORMATSWITCH: string = 'e-value-switch-btn';
const HANDLER: string = 'e-handler';
const HEX: string = 'e-hex';
const HIDEHEX: string = 'e-hide-hex-value';
const HIDEOPACITY: string = 'e-hide-opacity';
const HIDERGBA: string = 'e-hide-switchable-value';
const HIDEVALUE: string = 'e-hide-value';
const HIDEVALUESWITCH: string = 'e-hide-valueswitcher';
const HSVAREA: string = 'e-hsv-color';
const HSVCONTAINER: string = 'e-hsv-container';
const INPUTWRAPPER: string = 'e-selected-value';
const MODESWITCH: string = 'e-mode-switch-btn';
const NOCOLOR: string = 'e-nocolor-item';
const OPACITY: string = 'e-opacity-value';
const PALETTES: string = 'e-palette';
const PALETTECONTENT: string = 'e-color-palette';
const PICKERCONTENT: string = 'e-color-picker';
const PREVIEW: string = 'e-preview-container';
const PREVIOUS: string = 'e-previous';
const RTL: string = 'e-rtl';
const SHOWVALUE: string = 'e-show-value';
const SELECT: string = 'e-selected';
const SPLITPREVIEW: string = 'e-split-preview';
const TILE: string = 'e-tile';

const presets: { [key: string]: string[] } = {
    default: ['#000000', '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#ffeb3b',
        '#ffffff', '#ffebee', '#fce4ec', '#f3e5f5', '#ede7f6', '#e3f2fd', '#e1f5fe', '#e0f7fa', '#e0f2f1', '#fffde7',
        '#f2f2f2', '#ffcdd2', '#f8bbd0', '#e1bee7', '#d1c4e9', '#bbdefb', '#b3e5fc', '#b2ebf2', '#b2dfdb', '#fff9c4',
        '#e6e6e6', '#ef9a9a', '#f48fb1', '#ce93d8', '#b39ddb', '#90caf9', '#81d4fa', '#80deea', '#80cbc4', '#fff59d',
        '#cccccc', '#e57373', '#f06292', '#ba68c8', '#9575cd', '#64b5f6', '#4fc3f7', '#4dd0e1', '#4db6ac', '#fff176',
        '#b3b3b3', '#ef5350', '#ec407a', '#ab47bc', '#7e57c2', '#42a5f5', '#29b6f6', '#26c6da', '#26a69a', '#ffee58',
        '#999999', '#e53935', '#d81b60', '#8e24aa', '#5e35b1', '#1e88e5', '#039be5', '#00acc1', '#00897b', '#fdd835',
        '#808080', '#d32f2f', '#c2185b', '#7b1fa2', '#512da8', '#1976d2', '#0288d1', '#0097a7', '#00796b', '#fbc02d',
        '#666666', '#c62828', '#ad1457', '#6a1b9a', '#4527a0', '#1565c0', '#0277bd', '#00838f', '#00695c', '#f9a825',
        '#4d4d4d', '#b71c1c', '#880e4f', '#4a148c', '#311b92', '#0d47a1', '#01579b', '#006064', '#004d40', '#f57f17']
};

/**
 * ColorPicker component is a user interface to select and adjust color values. It provides supports for various
 * color specification like Red Green Blue, Hue Saturation Value and Hex codes.
 * ```html
 * <input type="color" id="color-picker">
 * ```
 * ```typescript
 * <script>
 *   let colorPickerObj: ColorPicker = new ColorPicker(null , "#color-picker");
 * </script>
 * ```
 */

@NotifyPropertyChanges
export class ColorPicker extends Component<HTMLInputElement> implements INotifyPropertyChanged {
    /* Private variables */
    private splitBtn: SplitButton;
    private hueSlider: Slider;
    private opacitySlider: Slider;
    private tooltipEle: HTMLElement;
    private container: HTMLElement;
    private modal: HTMLElement;
    private isRgb: boolean;
    private l10n: L10n;
    private tileRipple: Function;
    private ctrlBtnRipple: Function;
    private clientX: number;
    private clientY: number;
    private rgb: number[];
    private hsv: number[];
    private formElement: HTMLFormElement;
    private initialInputValue: string;
    /**
     * It is used to set the color value for ColorPicker. It should be specified as Hex code.
     * @default '#008000ff'
     */
    @Property('#008000ff')
    public value: string;

    /**
     * This property sets the CSS classes to root element of the ColorPicker
     *  which helps to customize the UI styles.
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * It is used to enable / disable ColorPicker component. If it is disabled the ColorPicker popup won’t open.
     * @default false
     */
    @Property(false)
    public disabled: boolean;

    /**
     * It is used to render the ColorPicker with the specified mode.
     * @default 'Picker'
     */
    @Property('Picker')
    public mode: ColorPickerMode;

    /**
     * It is used to show / hide the mode switcher button of ColorPicker component.
     * @default true
     */
    @Property(true)
    public modeSwitcher: boolean;

    /**
     * It is used to load custom colors to palette.
     * @default null
     */
    @Property(null)
    public presetColors: { [key: string]: string[] };

    /**
     * It is used to show / hide the control buttons (apply / cancel) of  ColorPicker component.
     * @default true
     */
    @Property(true)
    public showButtons: boolean;

    /**
     * It is used to render the ColorPicker palette with specified columns.
     * @default 10
     */
    @Property(10)
    public columns: number;

    /**
     * It is used to render the ColorPicker component as inline.
     * @default false
     */
    @Property(false)
    public inline: boolean;

    /**
     * It is used to enable / disable the no color option of ColorPicker component.
     * @default false
     */
    @Property(false)
    public noColor: boolean;

    /**
     * To enable or disable persisting component's state between page reloads and it is extended from component class.
     * @default false
     */
    @Property(false)
    public enablePersistence: boolean;

    /**
     * It is used to enable / disable the opacity option of ColorPicker component.
     * @default true
     */
    @Property(true)
    public enableOpacity: boolean;

    /**
     * Triggers while selecting the color in picker / palette, when showButtons property is enabled.
     * @event
     * @blazorProperty 'Selected'
     */
    @Event()
    public select: EmitType<ColorPickerEventArgs>;

    /**
     * Triggers while changing the colors. It will be triggered based on the showButtons property.
     * If the property is false, the event will be triggered while selecting the colors.
     * If the property is true, the event will be triggered while apply the selected color.
     * @event
     * @blazorProperty 'ValueChange'
     */
    @Event()
    public change: EmitType<ColorPickerEventArgs>;

    /**
     * Trigger while rendering each palette tile.
     * @event 
     * @blazorProperty 'OnTileRender'
     */
    @Event()
    public beforeTileRender: EmitType<PaletteTileEventArgs>;

    /**
     * Triggers before opening the ColorPicker popup.
     * @event
     * @blazorProperty 'OnOpen'
     */
    @Event()
    public beforeOpen: EmitType<BeforeOpenCloseEventArgs>;

    /**
     * Triggers while opening the ColorPicker popup.
     * @event
     * @blazorProperty 'Opened'
     */
    @Event()
    public open: EmitType<OpenEventArgs>;

    /**
     * Triggers before closing the ColorPicker popup.
     * @event
     * @blazorProperty 'OnClose'
     */
    @Event()
    public beforeClose: EmitType<BeforeOpenCloseEventArgs>;

    /**
     * Triggers before Switching between ColorPicker mode.
     * @event
     * @blazorProperty 'OnModeSwitch'
     */
    @Event()
    public beforeModeSwitch: EmitType<ModeSwitchEventArgs>;

    /**
     * Triggers after Switching between ColorPicker mode.
     * @event
     * @blazorProperty 'ModeSwitched'
     */
    @Event()
    public onModeSwitch: EmitType<ModeSwitchEventArgs>;

    /**
     * Triggers once the component rendering is completed.
     * @event
     * @blazorProperty 'Created'
     */
    @Event()
    public created: EmitType<Event>;

    constructor(options?: ColorPickerModel, element?: string | HTMLInputElement) {
        super(options, <HTMLInputElement | string>element);
    }

    protected preRender(): void {
        let ele: Element = this.element;
        this.formElement = <HTMLFormElement>closest(this.element, 'form');
        if (this.formElement) {
            EventHandler.add(this.formElement, 'reset', this.formResetHandler, this);
        }
        let localeText: object = { Apply: 'Apply', Cancel: 'Cancel', ModeSwitcher: 'Switch Mode' };
        this.l10n = new L10n('colorpicker', localeText, this.locale);
        if (ele.getAttribute('ejs-for') && !ele.getAttribute('name')) {
            ele.setAttribute('name', ele.id);
        }
    }

    /**
     * To Initialize the component rendering
     * @private
     */
    public render(): void {
        this.initWrapper();
        if (this.inline) {
            this.createWidget();
        } else {
            this.createSplitBtn();
        }
        if (!this.enableOpacity) {
            addClass([this.container.parentElement], HIDEOPACITY);
        }
        this.renderComplete();
    }

    private initWrapper(): void {
        let wrapper: HTMLElement = this.createElement('div', { className: 'e-' + this.getModuleName() + '-wrapper' });
        this.element.parentNode.insertBefore(wrapper, this.element);
        wrapper.appendChild(this.element);
        attributes(this.element, { 'tabindex': '-1', 'spellcheck': 'false' });
        this.container = this.createElement('div', { className: CONTAINER });
        this.getWrapper().appendChild(this.container);
        let value: string = this.value ? this.roundValue(this.value).toLowerCase() : '#008000ff';
        if (this.noColor && this.mode === 'Palette' && this.value === '') {
            value = '';
        }
        let slicedValue: string = value.slice(0, 7);
        if (isNullOrUndefined(this.initialInputValue)) {
            this.initialInputValue = slicedValue;
        }
        this.element.value = slicedValue;
        if (this.enableOpacity) {
            this.setProperties({ 'value': value }, true);
        } else {
            this.setProperties({ 'value': slicedValue }, true);
        }

        if (this.enableRtl) {
            wrapper.classList.add(RTL);
        }
        if (this.cssClass) {
            addClass([wrapper], this.cssClass.split(' '));
        }
        this.tileRipple = rippleEffect(this.container, { selector: '.' + TILE });
        this.ctrlBtnRipple = rippleEffect(this.container, { selector: '.e-btn' });
    }

    private getWrapper(): HTMLElement {
        return this.element.parentElement;
    }

    private createWidget(): void {
        if (this.mode === 'Palette') {
            this.createPalette();
            if (!this.inline) {
                this.firstPaletteFocus();
            }
        } else {
            this.createPicker();
            if (!this.inline) {
                this.getDragHandler().focus();
            }
        }
        this.isRgb = true;
        this.createInput();
        this.createCtrlBtn();
        if (!this.disabled) {
            this.wireEvents();
        }
        if (this.inline && this.disabled) {
            this.toggleDisabled(true);
        }
        if (Browser.isDevice) {
            this.refreshPopupPos();
        }
    }

    private createSplitBtn(): void {
        let splitButton: HTMLButtonElement = this.createElement('button', { className: 'e-split-colorpicker' }) as HTMLButtonElement;
        this.getWrapper().appendChild(splitButton);
        this.splitBtn = new SplitButton(
            {
                iconCss: 'e-selected-color',
                target: this.container,
                disabled: this.disabled,
                enableRtl: this.enableRtl,
                open: this.onOpen.bind(this),
                click: (args: ClickEventArgs) => {
                    this.trigger('change', {
                        currentValue: { hex: this.value.slice(0, 7), rgba: this.convertToRgbString(this.hexToRgb(this.value)) },
                        previousValue: { hex: null, rgba: null }, value: this.value
                    });
                }
            });
        this.splitBtn.createElement = this.createElement;
        this.splitBtn.appendTo(splitButton);
        let preview: HTMLElement = this.createElement('span', { className: SPLITPREVIEW });
        select('.e-selected-color', splitButton).appendChild(preview);
        preview.style.backgroundColor = this.convertToRgbString(this.hexToRgb(this.value));
        let popupEle: HTMLElement = this.getPopupEle();
        addClass([popupEle], 'e-colorpicker-popup');
        if (this.cssClass) {
            addClass([popupEle], this.cssClass.split(' '));
        }
        if (Browser.isDevice) {
            let popupInst: Popup = this.getPopupInst();
            popupInst.relateTo = document.body;
            popupInst.position = { X: 'center', Y: 'center' };
            popupInst.targetType = 'container';
            popupInst.collision = { X: 'fit', Y: 'fit' };
            popupInst.offsetY = 4;
            popupEle.style.zIndex = getZindexPartial(this.splitBtn.element).toString();
        }
        this.bindCallBackEvent();
    }

    private onOpen(args: OpenCloseMenuEventArgs): void {
        this.trigger('open', <OpenEventArgs>{ element: this.container });
    }

    private getPopupInst(): Popup {
        return getInstance(this.getPopupEle(), Popup) as Popup;
    }

    private bindCallBackEvent() : void {
        this.splitBtn.beforeOpen = (args: BeforeOpenCloseMenuEventArgs): Deferred | void => {
            let callBackPromise: Deferred = new Deferred();
            this.trigger('beforeOpen', args, (observeOpenArgs: BeforeOpenCloseMenuEventArgs) => {
              if (!observeOpenArgs.cancel) {
                let popupEle: HTMLElement = this.getPopupEle();
                popupEle.style.top = formatUnit(0 + pageYOffset);
                popupEle.style.left = formatUnit(0 + pageXOffset);
                popupEle.style.display = 'block';
                this.createWidget();
                popupEle.style.display = '';
                if (Browser.isDevice) {
                    this.modal = this.createElement('div');
                    this.modal.className = 'e-' + this.getModuleName() + ' e-modal';
                    this.modal.style.display = 'none';
                    document.body.insertBefore(this.modal, popupEle);
                    document.body.className += ' e-colorpicker-overflow';
                    this.modal.style.display = 'block';
                    this.modal.style.zIndex = (Number(popupEle.style.zIndex) - 1).toString();
                }
              }
              args.cancel = observeOpenArgs.cancel;
              callBackPromise.resolve(observeOpenArgs);
            });
            return callBackPromise;
        };
        this.splitBtn.beforeClose = (args: BeforeOpenCloseMenuEventArgs): Deferred | void => {
            let callBackPromise: Deferred = new Deferred();
            if (!isNullOrUndefined(args.event)) {
                let beforeCloseArgs: BeforeOpenCloseEventArgs = { element: this.container, event: args.event, cancel: false };
                this.trigger('beforeClose', beforeCloseArgs, (observedCloseArgs: BeforeOpenCloseMenuEventArgs) => {
                    if (Browser.isDevice && args.event.target === this.modal) {
                        observedCloseArgs.cancel = true;
                    }
                    if (!observedCloseArgs.cancel) {
                        this.onPopupClose();
                    }
                    args.cancel = observedCloseArgs.cancel;
                    callBackPromise.resolve(observedCloseArgs);
                });
            } else {
                callBackPromise.resolve(args);
            }
            return callBackPromise;
        };
    }

    private onPopupClose(): void {
        this.unWireEvents();
        this.destroyOtherComp();
        this.container.style.width = '';
        (select('.' + SPLITPREVIEW, this.splitBtn.element) as HTMLElement).style.backgroundColor
            = this.convertToRgbString(this.hexToRgb(this.value));
        this.container.innerHTML = '';
        removeClass([this.container], [PICKERCONTENT, PALETTECONTENT]);
        if (Browser.isDevice && this.modal) {
            removeClass([document.body], 'e-colorpicker-overflow');
            this.modal.style.display = 'none';
            this.modal.outerHTML = '';
            this.modal = null;
        }
    }

    private createPalette(): void {
        classList(this.container, [PALETTECONTENT], [PICKERCONTENT]);
        if (this.presetColors) {
            let paletteGroup: HTMLElement = this.createElement('div', { className: 'e-custom-palette' });
            this.appendElement(paletteGroup);
            let keys: string[] = Object.keys(this.presetColors as Object);
            if (keys.length === 1) {
                this.appendPalette(this.presetColors[keys[0]], keys[0], paletteGroup);
            } else {
                for (let i: number = 0, len: number = keys.length; i < len; i++) {
                    this.appendPalette(this.presetColors[keys[i]], keys[i], paletteGroup);
                }
            }
            if (selectAll('.e-row', paletteGroup).length > 10) {
                addClass([paletteGroup], 'e-palette-group');
            }

        } else {
            this.appendPalette(presets.default, 'default');
        }
        if (this.mode === 'Palette' && !this.modeSwitcher && this.noColor) {
            this.setNoColor();
        }
        let width: number = parseInt(getComputedStyle(this.container).borderBottomWidth, 10);
        this.container.style.width = formatUnit((this.container.children[0] as HTMLElement).offsetWidth + width + width);
        this.rgb = this.hexToRgb(this.roundValue(this.value));
        this.hsv = this.rgbToHsv.apply(this, this.rgb);
    }

    private firstPaletteFocus(): void {
        if (!select('.' + SELECT, this.container.children[0])) {
            selectAll('.' + PALETTES, this.container)[0].focus();
        }
    }

    private appendPalette(colors: string[], key: string, refEle?: HTMLElement): void {
        let palette: HTMLElement = this.createElement('div', { className: PALETTES, attrs: { 'tabindex': '0' } });
        if (refEle) {
            refEle.appendChild(palette);
        } else {
            this.appendElement(palette);
        }
        let row: HTMLElement; let tile: HTMLElement; let roundedColor: string;
        for (let i: number = 0, len: number = colors.length; i < len; i++) {
            if (i === 0 || i % this.columns === 0) {
                row = this.createElement('div', {
                    className: 'e-row', attrs: { 'role': 'row' }
                });
                palette.appendChild(row);
            }
            roundedColor = this.roundValue(colors[i]).toLowerCase();
            tile = this.createElement('span', {
                className: TILE, attrs: { 'role': 'gridcell', 'aria-label': roundedColor, 'aria-selected': 'false' }
            });
            this.trigger('beforeTileRender', <PaletteTileEventArgs>{ element: tile, presetName: key, value: colors[i] });
            row.appendChild(tile);
            if (this.value === roundedColor) {
                this.addTileSelection(tile);
                palette.focus();
            }
            tile.style.backgroundColor = this.convertToRgbString(this.hexToRgb(roundedColor));
        }
    }

    private setNoColor(): void {
        let noColorEle: HTMLElement = this.container.querySelector('.e-row').children[0] as HTMLElement;
        noColorEle.classList.add(NOCOLOR);
        if (!this.value) {
            noColorEle.classList.add(SELECT);
            (closest(noColorEle, '.' + PALETTES) as HTMLElement).focus();
        }
        ['aria-selected', 'aria-label'].forEach((attr: string): void => { noColorEle.removeAttribute(attr); });
        noColorEle.style.backgroundColor = '';
    }

    private appendElement(ele: Element, insertPos: number = 0): void {
        let refEle: Element = this.container.children[insertPos];
        refEle ? this.container.insertBefore(ele, refEle) : this.container.appendChild(ele);
    }

    private addTileSelection(ele: Element): void {
        ele.classList.add(SELECT);
        ele.setAttribute('aria-selected', 'true');
    }

    private createPicker(): void {
        classList(this.container, [PICKERCONTENT], [PALETTECONTENT]);
        let hsvContainer: HTMLElement = this.createElement('div', { className: HSVCONTAINER });
        this.appendElement(hsvContainer);
        hsvContainer.appendChild(this.createElement('div', { className: HSVAREA }));
        let dragHandler: HTMLElement = this.createElement('span', { className: HANDLER, attrs: { 'tabindex': '0' } });
        hsvContainer.appendChild(dragHandler);
        this.rgb = this.hexToRgb(this.value);
        this.hsv = this.rgbToHsv.apply(this, this.rgb);
        this.setHsvContainerBg();
        this.setHandlerPosition();
        this.createSlider();
        this.createDragTooltip();
    }

    private setHsvContainerBg(h: number = this.hsv[0]): void {
        this.getHsvContainer().style.backgroundColor = this.convertToRgbString(this.hsvToRgb(h, 100, 100, 1));
    }

    private getHsvContainer(): HTMLElement {
        return select('.' + HSVCONTAINER, this.container) as HTMLElement;
    }

    private setHandlerPosition(): void {
        let dragHandler: HTMLElement = this.getDragHandler();
        let hsvArea: HTMLElement = select('.' + HSVAREA, this.container) as HTMLElement;
        if (this.enableRtl) {
            dragHandler.style.left = formatUnit(hsvArea.offsetWidth * Math.abs(100 - this.hsv[1]) / 100);
        } else {
            dragHandler.style.left = formatUnit(hsvArea.offsetWidth * this.hsv[1] / 100);
        }
        dragHandler.style.top = formatUnit(hsvArea.offsetHeight * (100 - this.hsv[2]) / 100);
    }

    private createSlider(): void {
        let sliderPreviewWrapper: Element = this.createElement('div', { className: 'e-slider-preview' });
        this.appendElement(sliderPreviewWrapper, 1);
        this.createPreview(sliderPreviewWrapper);
        let sliderWrapper: Element = this.createElement('div', { className: 'e-colorpicker-slider' });
        sliderPreviewWrapper.insertBefore(sliderWrapper, sliderPreviewWrapper.children[0]);
        let slider: HTMLElement = this.createElement('div', { className: 'e-hue-slider' });
        sliderWrapper.appendChild(slider);
        this.hueSlider = new Slider(
            {
                value: this.hsv[0],
                min: 0,
                max: 359,
                enableRtl: this.enableRtl,
                enabled: !this.disabled,
                change: this.hueChange.bind(this)
            });
        this.hueSlider.createElement = this.createElement;
        this.hueSlider.appendTo(slider);
        if (this.enableOpacity) {
            slider = this.createElement('div', { className: 'e-opacity-slider' });
            sliderWrapper.appendChild(slider);
            this.createOpacitySlider(slider);
        }
    }

    private createOpacitySlider(slider: HTMLElement): void {
        this.opacitySlider = new Slider(
            {
                value: this.rgb[3] * 100,
                min: 0,
                max: 100,
                enableRtl: this.enableRtl,
                enabled: !this.disabled,
                change: this.opacityChange.bind(this)
            });
        this.opacitySlider.createElement = this.createElement;
        this.opacitySlider.appendTo(slider);
        let opacityBgTrack: HTMLElement = this.createElement('div', { className: 'e-opacity-empty-track' });
        slider.appendChild(opacityBgTrack);
        this.updateOpacitySliderBg();
    }

    private updateOpacitySliderBg(): void {
        let direction: string = this.enableRtl ? 'to left' : 'to right';
        (select('.e-slider-track', this.opacitySlider.element) as HTMLElement).style.background =
            'linear-gradient(' + direction + ', rgba(' + this.rgb.slice(0, 3) + ', 0) 0%, ' +
            this.convertToRgbString(this.rgb.slice(0, 3)) + ' 100%)';
    }

    private hueChange(args: SliderChangeEventArgs): void {
        this.hsv[0] = args.value as number;
        this.setHsvContainerBg();
        this.convertToOtherFormat();
    }

    private opacityChange(args: SliderChangeEventArgs): void {
        let value: number = args.value as number;
        let pValue: string = this.rgbToHex(this.rgb);
        this.hsv[3] = value / 100; this.rgb[3] = value / 100;
        let cValue: string = this.rgbToHex(this.rgb);
        this.updateOpacityInput(value);
        let rgb: string = this.convertToRgbString(this.rgb);
        this.updatePreview(rgb);
        this.triggerEvent(cValue, pValue, rgb);
    }

    private updateOpacityInput(value: number): void {
        if (this.enableOpacity && !this.getWrapper().classList.contains(HIDEVALUE)) {
            let opacityTextBoxInst: NumericTextBox = getInstance(
                select('.' + OPACITY, this.container) as HTMLInputElement, NumericTextBox) as NumericTextBox;
            opacityTextBoxInst.value = value; opacityTextBoxInst.dataBind();
        }
    }

    private createPreview(parentEle?: Element): void {
        let previewContainer: HTMLElement = this.createElement('div', { className: PREVIEW });
        parentEle.appendChild(previewContainer);
        let preview: HTMLElement = this.createElement('span', { className: 'e-preview ' + CURRENT });
        previewContainer.appendChild(preview);
        let colorValue: string = this.convertToRgbString(this.rgb);
        preview.style.backgroundColor = colorValue;
        preview = this.createElement('span', { className: 'e-preview ' + PREVIOUS });
        previewContainer.appendChild(preview);
        preview.style.backgroundColor = colorValue;
    }

    private isPicker(): boolean {
        return !this.container.classList.contains(PALETTECONTENT);
    }

    private getPopupEle(): HTMLElement {
        return this.container.parentElement;
    }

    private createNumericInput(element: HTMLElement, value: number, label: string, max: number): void {
        let numericInput: NumericTextBox = new NumericTextBox(<NumericTextBoxModel>{
            value: value,
            placeholder: label,
            min: 0,
            max: max,
            format: '###.##',
            showSpinButton: false,
            floatLabelType: 'Always',
            enableRtl: this.enableRtl,
            enabled: !this.disabled,
            readonly: this.isPicker() ? false : true,
            change: (args: ChangeEventArgs) => {
                if (args.event) {
                    this.inputHandler(args.event);
                }
            }
        });
        numericInput.createElement = this.createElement;
        numericInput.appendTo(element as HTMLInputElement);
    }

    private createInput(): void {
        let isPicker: boolean = this.isPicker();
        let wrapper: HTMLElement = this.getWrapper();
        if ((isPicker && !wrapper.classList.contains(HIDEVALUE)) || (!isPicker && wrapper.classList.contains(SHOWVALUE))) {
            let inputWrap: HTMLElement = this.createElement('div', { className: INPUTWRAPPER });
            isPicker ? this.appendElement(inputWrap, 2) : this.appendElement(inputWrap, 1);
            let container: HTMLElement = this.createElement('div', { className: 'e-input-container' });
            inputWrap.appendChild(container);
            if (!wrapper.classList.contains(HIDEVALUESWITCH)) {
                this.appendValueSwitchBtn(inputWrap);
            }
            if (!wrapper.classList.contains(HIDEHEX)) {
                let hexInput: HTMLInputElement = this.createElement('input', {
                    className: HEX,
                    attrs: { 'maxlength': '7', 'spellcheck': 'false' }
                }) as HTMLInputElement;
                container.appendChild(hexInput);
                Input.createInput(
                    {
                        element: hexInput,
                        floatLabelType: 'Always',
                        properties: {
                            placeholder: 'HEX',
                            enableRtl: this.enableRtl,
                            enabled: !this.disabled,
                            readonly: this.isPicker() ? false : true
                        }
                    },
                    this.createElement);
                Input.setValue(this.value.slice(0, 7), hexInput);
                hexInput.addEventListener('input', this.inputHandler.bind(this));
            }
            if (!wrapper.classList.contains(HIDERGBA)) {
                let label: string;
                let value: number[];
                if (this.isRgb) {
                    label = 'RGB';
                    value = this.rgb;
                } else {
                    label = 'HSV';
                    value = this.hsv;
                }
                let clsName: string[] = ['rh', 'gs', 'bv'];
                for (let i: number = 0; i < 3; i++) {
                    this.createNumericInput(
                        container.appendChild(this.createElement('input', { className: 'e-' + clsName[i] + '-value' })),
                        value[i], label[i], 255);
                }
                if (this.enableOpacity) {
                    this.appendOpacityValue(container);
                }
            }
        }
    }

    private appendOpacityValue(container: HTMLElement): void {
        this.createNumericInput(
            container.appendChild(this.createElement('input', { className: OPACITY })), this.rgb[3] * 100, 'A', 100);
    }

    private appendValueSwitchBtn(targetEle: Element): void {
        let valueSwitchBtn: HTMLElement = this.createElement('button', {
            className: 'e-icons e-css e-btn e-flat e-icon-btn ' + FORMATSWITCH
        });
        targetEle.appendChild(valueSwitchBtn);
        if (this.isPicker() && !this.getWrapper().classList.contains(HIDERGBA)) {
            valueSwitchBtn.addEventListener('click', this.formatSwitchHandler.bind(this));
        }
    }

    private createCtrlBtn(): void {
        if (this.modeSwitcher || this.showButtons) {
            this.l10n.setLocale(this.locale);
            let btnWrapper: Element = this.createElement('div', { className: CTRLSWITCH });
            this.container.appendChild(btnWrapper);
            if (this.showButtons) {
                let controlBtnWrapper: Element = this.createElement('div', { className: CTRLBTN });
                btnWrapper.appendChild(controlBtnWrapper);
                let apply: string = this.l10n.getConstant('Apply');
                controlBtnWrapper.appendChild(this.createElement('button', {
                    innerHTML: apply,
                    className: 'e-btn e-css e-flat e-primary e-small ' + APPLY,
                    attrs: { 'title': apply }
                }));
                let cancel: string = this.l10n.getConstant('Cancel');
                controlBtnWrapper.appendChild(this.createElement('button', {
                    innerHTML: cancel,
                    className: 'e-btn e-css e-flat e-small ' + CANCEL,
                    attrs: { 'title': cancel }
                }));
            }
            if (this.modeSwitcher) {
                this.appendModeSwitchBtn();
            }
        }
    }

    private appendModeSwitchBtn(): void {
        let modeSwitcher: HTMLElement = this.createElement('button', {
            className: 'e-icons e-btn e-flat e-icon-btn ' + MODESWITCH, attrs: { title: this.l10n.getConstant('ModeSwitcher') }
        });
        select('.' + CTRLSWITCH, this.container).insertBefore(modeSwitcher, select('.' + CTRLBTN, this.container));
    }

    private createDragTooltip(): void {
        let tooltip: Tooltip = new Tooltip({
            opensOn: 'Custom',
            showTipPointer: false,
            cssClass: 'e-color-picker-tooltip',
            beforeOpen: (args: TooltipEventArgs) => {
                this.tooltipEle = args.element;
            },
            animation: { open: { effect: 'None' }, close: { effect: 'None' } }
        });
        tooltip.createElement = this.createElement;
        tooltip.appendTo(this.container);
        tooltip.open(this.container);
        this.tooltipEle.style.zIndex = getZindexPartial(this.tooltipEle).toString();
        select('.e-tip-content', this.tooltipEle).appendChild(this.createElement('div', { className: 'e-tip-transparent' }));
    }

    private getTooltipInst(): Tooltip {
        return getInstance(this.container, Tooltip) as Tooltip;
    }

    private setTooltipOffset(value: number): void {
        this.getTooltipInst().offsetY = value;
    }

    private toggleDisabled(enable: boolean): void {
        enable ? this.getWrapper().classList.add(DISABLED) : this.getWrapper().classList.remove(DISABLED);
        if (this.showButtons) {
            ([].slice.call(selectAll('.e-btn', this.container))).forEach((ele: HTMLElement) => {
                enable ? attributes(ele, { 'disabled': '' }) : ele.removeAttribute('disabled');
            });
        }
    }

    private convertToRgbString(rgb: number[]): string {
        return rgb.length ? rgb.length === 4 ? 'rgba(' + rgb.join() + ')' : 'rgb(' + rgb.join() + ')' : '';
    }

    private convertToHsvString(hsv: number[]): string {
        return hsv.length === 4 ? 'hsva(' + hsv.join() + ')' : 'hsv(' + hsv.join() + ')';
    }

    private updateHsv(): void {
        this.hsv[1] = this.hsv[1] > 100 ? 100 : this.hsv[1];
        this.hsv[2] = this.hsv[2] > 100 ? 100 : this.hsv[2];
        this.setHandlerPosition();
    }

    private convertToOtherFormat(isKey: boolean = false): void {
        let pValue: string = this.rgbToHex(this.rgb);
        this.rgb = this.hsvToRgb.apply(this, this.hsv);
        let cValue: string = this.rgbToHex(this.rgb);
        let rgba: string = this.convertToRgbString(this.rgb);
        this.updatePreview(rgba);
        this.updateInput(cValue);
        this.triggerEvent(cValue, pValue, rgba, isKey);
    }

    private updateInput(value: string): void {
        let wrapper: HTMLElement = this.getWrapper();
        if (!wrapper.classList.contains(HIDEVALUE)) {
            if (!wrapper.classList.contains(HIDEHEX)) {
                Input.setValue(value.substr(0, 7), select('.' + HEX, this.container) as HTMLInputElement);
            }
            if (!wrapper.classList.contains(HIDERGBA)) {
                if (this.isRgb) {
                    this.updateValue(this.rgb, false);
                } else {
                    this.updateValue(this.hsv, false);
                }
            }
        }
    }

    private updatePreview(value: string): void {
        if (this.enableOpacity) {
            this.updateOpacitySliderBg();
        }
        (select('.e-tip-transparent', this.tooltipEle) as HTMLElement).style.backgroundColor = value;
        (select('.' + PREVIEW + ' .' + CURRENT, this.container) as HTMLElement).style.backgroundColor = value;
        (select('.' + PREVIEW + ' .' + PREVIOUS, this.container) as HTMLElement).style.backgroundColor
            = this.convertToRgbString(this.hexToRgb(this.value));
    }

    private getDragHandler(): HTMLElement {
        return select('.' + HANDLER, this.container) as HTMLElement;
    }

    private removeTileSelection(): void {
        let selectedEle: Element[] = [].slice.call(selectAll('.' + SELECT, this.container.children[0]));
        selectedEle.forEach((ele: Element): void => {
            ele.classList.remove(SELECT);
            ele.setAttribute('aria-selected', 'false');
        });
    }

    private convertRgbToNumberArray(value: string): number[] {
        return (value.slice(value.indexOf('(') + 1, value.indexOf(')'))).split(',').map(
            (n: string, i: number) => {
                return (i !== 3) ? parseInt(n, 10) : parseFloat(n);
            });
    }

    /**
     * To get color value in specified type.
     * @param value - Specify the color value.
     * @param type - Specify the type to which the specified color needs to be converted.
     * @method getValue
     * @return {string}
     */
    public getValue(value?: string, type?: string): string {
        if (!value) { value = this.value; }
        type = !type ? 'hex' : type.toLowerCase();
        if (value[0] === 'r') {
            let cValue: number[] = this.convertRgbToNumberArray(value);
            if (type === 'hex' || type === 'hexa') {
                let hex: string = this.rgbToHex(cValue);
                return type === 'hex' ? hex.slice(0, 7) : hex;
            } else {
                if (type === 'hsv') {
                    return this.convertToHsvString(this.rgbToHsv.apply(this, cValue.slice(0, 3)));
                } else {
                    if (type === 'hsva') {
                        return this.convertToHsvString(this.rgbToHsv.apply(this, cValue));
                    } else {
                        return 'null';
                    }
                }
            }
        } else {
            if (value[0] === 'h') {
                let cValue: number[] = this.hsvToRgb.apply(this, this.convertRgbToNumberArray(value));
                if (type === 'rgba') {
                    return this.convertToRgbString(cValue);
                } else {
                    if (type === 'hex' || type === 'hexa') {
                        let hex: string = this.rgbToHex(cValue);
                        return type === 'hex' ? hex.slice(0, 7) : hex;
                    } else {
                        if (type === 'rgb') {
                            return this.convertToRgbString(cValue.slice(0, 3));
                        } else {
                            return 'null';
                        }
                    }
                }
            } else {
                value = this.roundValue(value);
                let rgb: number[] = this.hexToRgb(value);
                if (type === 'rgb' || type === 'hsv') {
                    rgb = rgb.slice(0, 3);
                }
                if (type === 'rgba' || type === 'rgb') {
                    return this.convertToRgbString(rgb);
                } else {
                    if (type === 'hsva' || type === 'hsv') {
                        return this.convertToHsvString(this.rgbToHsv.apply(this, rgb));
                    } else {
                        if (type === 'hex') {
                            return value.slice(0, 7);
                        } else {
                            if (type === 'a') {
                                return rgb[3].toString();
                            } else {
                                return 'null';
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * To show/hide ColorPicker popup based on current state of the SplitButton.
     * @method toggle
     * @return {void}
     */
    public toggle(): void {
        this.container.parentElement.classList.contains('e-popup-close') ? this.splitBtn.toggle() : this.closePopup(null);
    }

    /**
     * Get component name.
     * @returns string
     * @private
     */
    public getModuleName(): string {
        return 'colorpicker';
    }

    /**
     * Gets the properties to be maintained in the persisted state.
     * @return {string}
     */
    public getPersistData(): string {
        return this.addOnPersist(['value']);
    }

    protected wireEvents(): void {
        if (this.isPicker()) {
            let dragHandler: HTMLElement = this.getDragHandler();
            EventHandler.add(dragHandler, 'keydown', this.pickerKeyDown, this);
            EventHandler.add(this.getHsvContainer(), 'mousedown touchstart', this.handlerDown, this);
            if (this.modeSwitcher || this.showButtons) {
                this.addCtrlSwitchEvent();
            }
            EventHandler.add(select('.' + PREVIOUS, this.container), 'click', this.previewHandler, this);
        } else {
            EventHandler.add(this.container, 'click', this.paletteClickHandler, this);
            EventHandler.add(this.container, 'keydown', this.paletteKeyDown, this);
        }
    }

    private formResetHandler(): void {
        this.value = this.initialInputValue;
        attributes(this.element, { 'value' : this.initialInputValue });
    }

    private addCtrlSwitchEvent(): void {
        let ctrlSwitchBtn: Element = select('.' + CTRLSWITCH, this.container);
        if (ctrlSwitchBtn) { EventHandler.add(ctrlSwitchBtn, 'click', this.btnClickHandler, this); }
    }

    private pickerKeyDown(e: KeyboardEvent): void {
        switch (e.keyCode) {
            case 39:
                this.handlerDragPosition(1, this.enableRtl ? -1 : 1, e);
                break;
            case 37:
                this.handlerDragPosition(1, this.enableRtl ? 1 : -1, e);
                break;
            case 38:
                this.handlerDragPosition(2, 1, e);
                break;
            case 40:
                this.handlerDragPosition(2, -1, e);
                break;
            case 13:
                e.preventDefault();
                let cValue: string = this.rgbToHex(this.rgb);
                this.enterKeyHandler(cValue, e);
        }
    }

    private enterKeyHandler(value: string, e: MouseEvent | KeyboardEvent): void {
        this.triggerChangeEvent(value);
        if (!this.inline) {
            this.closePopup(e);
            this.splitBtn.element.focus();
        }
    }

    private closePopup(e: MouseEvent | KeyboardEvent): void {
        let beforeCloseArgs: BeforeOpenCloseEventArgs = { element: this.container, event: e, cancel: false };
        this.trigger('beforeClose', beforeCloseArgs, (observedcloseArgs: BeforeOpenCloseEventArgs) => {
            if (!observedcloseArgs.cancel) {
                this.splitBtn.toggle();
                this.onPopupClose();
            }
        });
    }

    private triggerChangeEvent(value: string): void {
        let hex: string = value.slice(0, 7);
        this.trigger('change', {
            currentValue: { hex: hex, rgba: this.convertToRgbString(this.rgb) },
            previousValue: { hex: this.value.slice(0, 7), rgba: this.convertToRgbString(this.hexToRgb(this.value)) },
            value: this.enableOpacity ? value : hex
        });
        if (this.enableOpacity) {
            this.setProperties({ 'value': value }, true);
        } else {
            this.setProperties({ 'value': hex }, true);
        }
        this.element.value = hex ? hex : '#000000';
    }

    private handlerDragPosition(prob: number, value: number, e: KeyboardEvent): void {
        e.preventDefault();
        this.hsv[prob] += value * (e.ctrlKey ? 1 : 3);
        if (this.hsv[prob] < 0) { this.hsv[prob] = 0; }
        this.updateHsv();
        this.convertToOtherFormat(true);
    }

    private handlerDown(e: MouseEvent & TouchEvent): void {
        e.preventDefault();
        let x: number; let y: number;
        if (e.type === 'mousedown') {
            this.clientX = Math.abs(e.pageX - pageXOffset); this.clientY = Math.abs(e.pageY - pageYOffset);
            this.setTooltipOffset(8);
        } else {
            this.clientX = Math.abs(e.changedTouches[0].pageX - pageXOffset);
            this.clientY = Math.abs(e.changedTouches[0].pageY - pageYOffset);
            this.setTooltipOffset(-8);
        }
        this.setHsv(this.clientX, this.clientY);
        this.getDragHandler().style.transition = 'left .4s cubic-bezier(.25, .8, .25, 1), top .4s cubic-bezier(.25, .8, .25, 1)';
        this.updateHsv();
        this.convertToOtherFormat();
        this.getDragHandler().focus();
        EventHandler.add(document, 'mousemove touchmove', this.handlerMove, this);
        EventHandler.add(document, 'mouseup touchend', this.handlerEnd, this);
    }

    private handlerMove(e: MouseEvent & TouchEvent): void {
        if (e.type !== 'touchmove') {
            e.preventDefault();
        }
        let x: number; let y: number;
        if (e.type === 'mousemove') {
            x = Math.abs(e.pageX - pageXOffset); y = Math.abs(e.pageY - pageYOffset);
        } else {
            x = Math.abs(e.changedTouches[0].pageX - pageXOffset); y = Math.abs(e.changedTouches[0].pageY - pageYOffset);
        }
        this.setHsv(x, y);
        let dragHandler: HTMLElement = this.getDragHandler();
        let left: number = parseInt(dragHandler.style.left, 10); let top: number = parseInt(dragHandler.style.top, 10);
        this.updateHsv();
        this.convertToOtherFormat();
        this.getTooltipInst().refresh(dragHandler);
        if (!this.tooltipEle.style.transform) {
            if (Math.abs(this.clientX - x) > 8 || Math.abs(this.clientY - y) > 8) {
                (select('.' + HSVAREA, this.container) as HTMLElement).style.cursor = 'pointer';
                dragHandler.style.transition = 'none';
                if (!this.inline) {
                    this.tooltipEle.style.zIndex = (parseInt(this.getPopupEle().style.zIndex, 10) + 1).toString();
                }
                this.tooltipEle.style.transform = 'rotate(45deg)';
                dragHandler.classList.add('e-hide-handler');
            }
        }
    }

    private setHsv(clientX: number, clientY: number): void {
        let ele: HTMLElement = select('.' + HSVAREA, this.container) as HTMLElement;
        let position: ClientRect = ele.getBoundingClientRect();
        if (this.enableRtl) {
            clientX = clientX > position.right ? 0 : Math.abs(clientX - position.right);
        } else {
            clientX = clientX > position.left ? Math.abs(clientX - position.left) : 0;
        }
        clientY = clientY > position.top ? Math.abs(clientY - position.top) : 0;
        this.hsv[2] = Math.round(Number(100 * (ele.offsetHeight -
            Math.max(0, Math.min(ele.offsetHeight, (clientY - ele.offsetTop)))) / ele.offsetHeight) * 10) / 10;
        this.hsv[1] =
            Math.round(Number(100 * (Math.max(0, Math.min(ele.offsetWidth, (clientX - ele.offsetLeft)))) / ele.offsetWidth) * 10) / 10;
    }

    private handlerEnd(e: MouseEvent & TouchEvent): void {
        if (e.type !== 'touchend') {
            e.preventDefault();
        }
        EventHandler.remove(document, 'mousemove touchmove', this.handlerMove);
        EventHandler.remove(document, 'mouseup touchend', this.handlerEnd);
        let dragHandler: HTMLElement = this.getDragHandler();
        (select('.' + HSVAREA, this.container) as HTMLElement).style.cursor = '';
        if (this.tooltipEle.style.transform) {
            this.tooltipEle.style.transform = '';
            dragHandler.classList.remove('e-hide-handler');
        }
        if (!this.inline && !this.showButtons) {
            this.closePopup(e);
        }
    }

    private btnClickHandler(e: MouseEvent): void {
        let target: HTMLElement = (e.target as HTMLElement);
        if (closest(target, '.' + MODESWITCH)) {
            e.stopPropagation();
            this.switchToPalette();
        } else {
            if (target.classList.contains(APPLY) || target.classList.contains(CANCEL)) {
                this.ctrlBtnClick(target, e);
            }
        }
    }

    private switchToPalette(): void {
        this.trigger('beforeModeSwitch', <ModeSwitchEventArgs>{ element: this.container, mode: 'Palette' });
        this.unWireEvents();
        this.destroyOtherComp();
        detach(select('.e-slider-preview', this.container));
        if (!this.getWrapper().classList.contains(HIDEVALUE)) {
            remove(select('.' + INPUTWRAPPER, this.container));
        }
        detach(this.getHsvContainer());
        this.createPalette();
        this.firstPaletteFocus();
        this.createInput();
        this.refreshPopupPos();
        this.wireEvents();
        this.trigger('onModeSwitch', <ModeSwitchEventArgs>{ element: this.container, mode: 'Palette'});
    }

    private refreshPopupPos(): void {
        if (!this.inline) {
            let popupEle: HTMLElement = this.getPopupEle();
            popupEle.style.left = formatUnit(0 + pageXOffset);
            popupEle.style.top = formatUnit(0 + pageYOffset);
            this.getPopupInst().refreshPosition(this.splitBtn.element.parentElement);
        }
    }

    private formatSwitchHandler(e: MouseEvent | KeyboardEvent): void {
        let target: HTMLElement = (e.target as HTMLElement).parentElement;
        if (this.isRgb) {
            this.updateValue(this.hsv, true, 3, [360, 100, 100]);
            this.isRgb = false;
        } else {
            this.updateValue(this.rgb, true, 2);
            this.isRgb = true;
        }
    }

    private updateValue(value: number[], format: boolean, idx?: number, max?: number[]): void {
        let clsName: string[] = ['e-rh-value', 'e-gs-value', 'e-bv-value'];
        let inst: NumericTextBox;
        for (let i: number = 0, len: number = clsName.length; i < len; i++) {
            inst = getInstance(select('.' + clsName[i], this.container) as HTMLInputElement, NumericTextBox) as NumericTextBox;
            inst.value = Math.round(value[i]);
            if (format) {
                inst.placeholder = clsName[i].substr(idx, 1).toUpperCase();
                inst.max = max ? max[i] : 255;
            }
            inst.dataBind();
        }
    }

    private previewHandler(e: MouseEvent): void {
        let target: HTMLElement = e.target as HTMLElement;
        let pValue: string = this.rgbToHex(this.rgb);
        this.rgb = this.convertRgbToNumberArray(target.style.backgroundColor);
        if (!this.rgb[3]) {
            this.rgb[3] = 1;
        }
        let cValue: string = this.rgbToHex(this.rgb);
        let hsv: number[] = this.rgbToHsv.apply(this, this.rgb);
        if (hsv[0] !== this.hsv[0]) {
            this.hueSlider.setProperties({ 'value': hsv[0] }, true);
            this.hueSlider.refresh();
        }
        this.setHsvContainerBg(hsv[0]);
        if (this.enableOpacity && hsv[3] !== this.hsv[3]) {
            this.opacitySlider.setProperties({ 'value': hsv[3] * 100 }, true);
            this.opacitySlider.refresh();
            this.updateOpacitySliderBg();
        }
        this.hsv = hsv;
        this.setHandlerPosition();
        this.updateInput(cValue);
        (select('.' + PREVIEW + ' .' + CURRENT, this.container) as HTMLElement).style.backgroundColor = this.convertToRgbString(this.rgb);
        this.triggerEvent(cValue, pValue, this.convertToRgbString(this.rgb));
    }

    private paletteClickHandler(e: MouseEvent): void {
        e.preventDefault();
        let target: HTMLElement = e.target as HTMLElement;
        if (target.classList.contains(TILE)) {
            this.removeTileSelection();
            this.addTileSelection(target);
            if (target.classList.contains(NOCOLOR)) {
                this.noColorTile();
            } else {
                let cValue: string = target.getAttribute('aria-label');
                let pValue: string = this.rgbToHex(this.rgb);
                this.rgb = this.hexToRgb(this.roundValue(cValue));
                this.hsv = this.rgbToHsv.apply(this, this.rgb);
                if (this.getWrapper().classList.contains(SHOWVALUE)) {
                    this.updateInput(cValue);
                }
                this.triggerEvent(cValue, pValue, this.convertToRgbString(this.rgb));
            }
            if (!this.inline && !this.showButtons) {
                this.closePopup(e);
            }
        } else {
            if (closest(target, '.' + MODESWITCH)) {
                this.switchToPicker();
            } else {
                if (target.classList.contains(APPLY) || target.classList.contains(CANCEL)) {
                    this.ctrlBtnClick(target, e);
                } else {
                    if (this.getWrapper().classList.contains(SHOWVALUE) && closest(target, '.' + FORMATSWITCH)) {
                        this.formatSwitchHandler(e);
                    }
                }
            }
        }
    }

    private noColorTile(isKey: boolean = false): void {
        let pValue: string = this.rgbToHex(this.rgb);
        this.rgb = [];
        this.hsv = [];
        this.triggerEvent('', pValue, '', isKey);
    }

    private switchToPicker(): void {
        let wrapper: Element = this.getWrapper();
        this.trigger('beforeModeSwitch', <ModeSwitchEventArgs>{ element: this.container, mode: 'Picker' });
        this.unWireEvents();
        ([].slice.call(selectAll('.' + PALETTES, this.container))).forEach((ele: HTMLElement) => {
            detach(ele);
        });
        if (wrapper.classList.contains(SHOWVALUE)) {
            detach(select('.' + INPUTWRAPPER, this.container));
        }
        this.container.style.width = '';
        let grpEle: Element = select('.e-custom-palette', this.container);
        if (this.presetColors) {
            remove(grpEle);
        }
        this.createPicker();
        this.getDragHandler().focus();
        this.createInput();
        this.refreshPopupPos();
        this.wireEvents();
        this.trigger('onModeSwitch', <ModeSwitchEventArgs>{ element: this.container, mode: 'Picker'});
    }

    private ctrlBtnClick(ele: HTMLElement, e: MouseEvent): void {
        if (ele.classList.contains(APPLY)) {
            let cValue: string = this.rgbToHex(this.rgb);
            this.triggerChangeEvent(cValue);
        }
        if (!this.inline) {
            this.closePopup(e);
            this.splitBtn.element.focus();
        }
    }

    private paletteKeyDown(e: KeyboardEvent): void {
        let target: HTMLElement = e.target as HTMLElement;
        if (!target.classList.contains(PALETTES)) {
            return;
        }
        let selectedEle: Element;
        let idx: number;
        let tiles: Element[] = [].slice.call(selectAll('.' + TILE, target));
        let prevSelectedEle: Element = (tiles.filter((tile: Element) => tile.classList.contains('e-selected'))).pop();
        switch (!e.altKey && e.keyCode) {
            case 39:
                e.preventDefault();
                selectedEle = prevSelectedEle ? tiles[this.tilePosition(tiles, prevSelectedEle, this.enableRtl ? -1 : 1)]
                    : tiles[this.enableRtl ? tiles.length - 1 : 0];
                this.keySelectionChanges(selectedEle);
                break;
            case 37:
                e.preventDefault();
                selectedEle = prevSelectedEle ? tiles[this.tilePosition(tiles, prevSelectedEle, this.enableRtl ? 1 : -1)]
                    : tiles[this.enableRtl ? 0 : tiles.length - 1];
                this.keySelectionChanges(selectedEle);
                break;
            case 38:
                e.preventDefault();
                idx = prevSelectedEle ? this.tilePosition(tiles, prevSelectedEle, -this.columns) : 0;
                selectedEle = tiles[idx] ? tiles[idx] : tiles[idx - this.columns];
                this.keySelectionChanges(selectedEle);
                break;
            case 40:
                e.preventDefault();
                idx = prevSelectedEle ? this.tilePosition(tiles, prevSelectedEle, this.columns) : tiles.length - 1;
                if (tiles[idx]) {
                    selectedEle = tiles[idx];
                } else {
                    idx %= tiles.length;
                    idx += tiles[tiles.length - 1].parentElement.childElementCount;
                    selectedEle = tiles[idx];
                }
                this.keySelectionChanges(selectedEle);
                break;
            case 13:
                e.preventDefault();
                if (prevSelectedEle) {
                    let cValue: string = prevSelectedEle.getAttribute('aria-label');
                    this.enterKeyHandler(cValue ? cValue : '', e);
                }
        }
    }

    private keySelectionChanges(newEle: Element): void {
        this.removeTileSelection();
        this.addTileSelection(newEle);
        if (newEle.classList.contains(NOCOLOR)) {
            this.noColorTile(true);
        } else {
            let cValue: string = newEle.getAttribute('aria-label');
            let pValue: string = this.rgbToHex(this.rgb);
            this.rgb = this.hexToRgb(cValue);
            this.hsv = this.rgbToHsv.apply(this, this.rgb);
            if (this.getWrapper().classList.contains(SHOWVALUE)) {
                this.updateInput(cValue);
            }
            this.triggerEvent(cValue, pValue, this.convertToRgbString(this.rgb), true);
        }
    }

    private tilePosition(items: Element[], element: Element, cIdx: number): number {
        items = Array.prototype.slice.call(items);
        let n: number = items.length;
        let emptyCount: number = this.columns - items[n - 1].parentElement.childElementCount;
        let idx: number = items.indexOf(element);
        idx += cIdx;
        idx < 0 ? idx += n + emptyCount : idx %= n + emptyCount;
        return idx;
    }

    private inputHandler(e: MouseEvent | Event): void {
        let target: HTMLInputElement = e.target as HTMLInputElement;
        if (!target.value.length) {
            return;
        }
        let hsv: number[]; let pValue: string;
        let label: string = select('.e-float-text', target.parentElement).textContent;
        switch (label) {
            case 'HEX':
                let value: string = '';
                if ((target.value[0] === '#' && target.value.length !== 5) || (target.value[0] !== '#' && target.value.length !== 4)) {
                    value = this.roundValue(target.value);
                }
                if (value.length === 9) {
                    pValue = this.rgbToHex(this.rgb);
                    this.rgb = this.hexToRgb(value + value.substr(-2));
                    this.inputValueChange(this.rgbToHsv.apply(this, this.rgb), pValue, target.value);
                } else {
                    return;
                }
                break;
            case 'R':
                if (this.rgb[0] !== Number(target.value)) {
                    pValue = this.rgbToHex(this.rgb);
                    this.rgb[0] = Number(target.value);
                    hsv = this.rgbToHsv.apply(this, this.rgb);
                    this.inputValueChange(hsv, pValue);
                }
                break;
            case 'G':
                if (this.rgb[1] !== Number(target.value)) {
                    pValue = this.rgbToHex(this.rgb);
                    this.rgb[1] = Number(target.value);
                    hsv = this.rgbToHsv.apply(this, this.rgb);
                    this.inputValueChange(hsv, pValue);
                }
                break;
            case 'B':
                if (this.rgb[2] !== Number(target.value)) {
                    pValue = this.rgbToHex(this.rgb);
                    this.rgb[2] = Number(target.value);
                    hsv = this.rgbToHsv.apply(this, this.rgb);
                    this.inputValueChange(hsv, pValue);
                }
                break;
            case 'H':
                this.hueSlider.value = Number(target.value);
                break;
            case 'S':
                if (this.hsv[1] !== Number(target.value)) {
                    this.hsv[1] = Number(target.value);
                    this.updateHsv();
                    this.convertToOtherFormat();
                }
                break;
            case 'V':
                if (this.hsv[2] !== Number(target.value)) {
                    this.hsv[2] = Number(target.value);
                    this.updateHsv();
                    this.convertToOtherFormat();
                }
                break;
            case 'A':
                this.opacitySlider.value = Number(target.value);
                break;
        }

    }

    private inputValueChange(hsv: number[], pValue: string, value?: string): void {
        if (hsv[0] !== this.hsv[0]) {
            this.hueSlider.setProperties({ 'value': hsv[0] }, true);
            this.hueSlider.refresh();
            this.setHsvContainerBg(hsv[0]);
        }
        this.hsv = hsv;
        let cValue: string = this.rgbToHex(this.rgb);
        this.setHandlerPosition();
        this.updateInput(value ? value : cValue);
        let rgba: string = this.convertToRgbString(this.rgb);
        this.updatePreview(rgba);
        this.triggerEvent(cValue, pValue, rgba);
    }

    private triggerEvent(cValue: string, pValue: string, rgba: string, isKey: boolean = false): void {
        let hex: string = cValue.slice(0, 7);
        if (!this.showButtons && !isKey) {
            this.trigger('change', { currentValue: { hex: hex, rgba: rgba },
                previousValue: { hex: this.value.slice(0, 7), rgba: this.convertToRgbString(this.hexToRgb(this.value)) }, value: cValue });
            this.setProperties({ 'value': cValue }, true);
            this.element.value = hex ? hex : '#000000';
        } else {
            this.trigger('select', {
                currentValue: { hex: hex, rgba: rgba },
                previousValue: { hex: pValue.slice(0, 7), rgba: this.convertToRgbString(this.hexToRgb(pValue)) }
            });
        }
    }

    /**
     * Removes the component from the DOM and detaches all its related event handlers.
     * Also it maintains the initial input element from the DOM.
     * @method destroy
     * @return {void}
     */
    public destroy(): void {
        let wrapper: Element = this.getWrapper();
        super.destroy();
        ['tabindex', 'spellcheck'].forEach((attr: string): void => { this.element.removeAttribute(attr); });
        if (this.inline) {
            this.unWireEvents();
            this.destroyOtherComp();
        } else {
            if (this.isPopupOpen()) {
                this.unWireEvents();
                this.destroyOtherComp();
            }
            this.splitBtn.destroy();
            this.splitBtn = null;
        }
        this.tileRipple();
        this.tileRipple = null;
        this.ctrlBtnRipple();
        this.ctrlBtnRipple = null;
        if (this.element.nextElementSibling) {
            detach(this.element.nextElementSibling);
        }
        if (wrapper) {
            wrapper.parentElement.insertBefore(this.element, wrapper);
            detach(wrapper);
        }
        this.container = null;
        if (this.formElement) {
            EventHandler.remove(this.formElement, 'reset', this.formResetHandler);
        }
    }

    private destroyOtherComp(): void {
        if (this.isPicker()) {
            this.hueSlider.destroy();
            if (this.enableOpacity) { this.opacitySlider.destroy(); this.opacitySlider = null; }
            this.hueSlider = null;
            let tooltipInst: Tooltip = this.getTooltipInst();
            tooltipInst.close();
            tooltipInst.destroy();
            this.tooltipEle = null;
        }
    }

    private isPopupOpen(): boolean {
        return this.getPopupEle().classList.contains('e-popup-open');
    }

    protected unWireEvents(): void {
        if (this.isPicker()) {
            let wrapper: HTMLElement = this.getWrapper();
            let dragHandler: HTMLElement = this.getDragHandler();
            EventHandler.remove(dragHandler, 'keydown', this.pickerKeyDown);
            EventHandler.remove(this.getHsvContainer(), 'mousedown touchstart', this.handlerDown);
            if (this.modeSwitcher || this.showButtons) {
                EventHandler.remove(select('.' + CTRLSWITCH, this.container), 'click', this.btnClickHandler);
            }
            EventHandler.remove(select('.' + PREVIOUS, this.container), 'click', this.previewHandler);
        } else {
            EventHandler.remove(this.container, 'click', this.paletteClickHandler);
            EventHandler.remove(this.container, 'keydown', this.paletteKeyDown);
        }
    }

    private roundValue(value: string): string {
        if (!value) { return ''; }
        if (value[0] !== '#') {
            value = '#' + value;
        }
        let len: number = value.length;
        if (len === 4) {
            value += 'f';
            len = 5;
        }
        if (len === 5) {
            let tempValue: string = '';
            for (let i: number = 1, len: number = value.length; i < len; i++) {
                tempValue += (value.charAt(i) + value.charAt(i));
            }
            value = '#' + tempValue;
            len = 9;
        }
        if (len === 7) {
            value += 'ff';
        }
        return value;
    }

    private hexToRgb(hex: string): number[] {
        if (!hex) { return []; }
        hex = hex.trim();
        if (hex.length !== 9) {
            hex = this.roundValue(hex);
        }
        let opacity: number = Number((parseInt(hex.slice(-2), 16) / 255).toFixed(2));
        hex = hex.slice(1, 7);
        let bigInt: number = parseInt(hex, 16); let h: number[] = [];
        h.push((bigInt >> 16) & 255);
        h.push((bigInt >> 8) & 255);
        h.push(bigInt & 255);
        h.push(opacity);
        return h;
    }

    private rgbToHsv(r: number, g: number, b: number, opacity?: number): number[] {
        if (this.rgb && !this.rgb.length) { return []; }
        r /= 255; g /= 255; b /= 255;
        let max: number = Math.max(r, g, b); let min: number = Math.min(r, g, b);
        let h: number; let s: number; let v: number = max;

        let d: number = max - min;
        s = max === 0 ? 0 : d / max;

        if (max === min) {
            h = 0;
        } else {
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        let hsv: number[] = [Math.round(h * 360), Math.round(s * 1000) / 10, Math.round(v * 1000) / 10];
        if (!isNullOrUndefined(opacity)) {
            hsv.push(opacity);
        }
        return hsv;
    }

    private hsvToRgb(h: number, s: number, v: number, opacity?: number): number[] {
        let r: number; let g: number; let b: number;
        let i: number;
        let f: number; let p: number; let q: number; let t: number;
        s /= 100; v /= 100;
        if (s === 0) {
            r = g = b = v;
            return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), opacity];
        }
        h /= 60;
        i = Math.floor(h);
        f = h - i;
        p = v * (1 - s);
        q = v * (1 - s * f);
        t = v * (1 - s * (1 - f));
        switch (i) {
            case 0: r = v; g = t; b = p; break;
            case 1: r = q; g = v; b = p; break;
            case 2: r = p; g = v; b = t; break;
            case 3: r = p; g = q; b = v; break;
            case 4: r = t; g = p; b = v; break;
            default: r = v; g = p; b = q;
        }
        let rgb: number[] = [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        if (!isNullOrUndefined(opacity)) {
            rgb.push(opacity);
        }
        return rgb;
    }

    private rgbToHex(rgb: number[]): string {
        return rgb.length ? ('#' + this.hex(rgb[0]) + this.hex(rgb[1]) + this.hex(rgb[2]) +
            (!isNullOrUndefined(rgb[3]) ? (rgb[3] !== 0 ? (Math.round(rgb[3] * 255) + 0x10000).toString(16).substr(-2) : '00') : '')) : '';
    }

    private hex(x: number): string {
        return ('0' + x.toString(16)).slice(-2);
    }

    private changeModeSwitcherProp(prop: boolean): void {
        let ctrlSwitchWrapper: Element = select('.' + CTRLSWITCH, this.container);
        if (prop) {
            if (ctrlSwitchWrapper) {
                this.appendModeSwitchBtn();
            } else {
                this.createCtrlBtn();
                if (this.isPicker() && !this.disabled) {
                    this.addCtrlSwitchEvent();
                }
            }
        } else {
            if (ctrlSwitchWrapper) {
                if (this.showButtons) {
                    detach(select('.' + MODESWITCH, ctrlSwitchWrapper));
                } else {
                    remove(ctrlSwitchWrapper);
                }
            }
        }
    }

    private changeShowBtnProps(prop: boolean): void {
        let ctrlBtnWrapper: Element = select('.' + CTRLSWITCH, this.container);
        if (prop) {
            if (ctrlBtnWrapper) {
                remove(ctrlBtnWrapper);
            }
            this.createCtrlBtn();
            if (this.isPicker() && !this.disabled) {
                this.addCtrlSwitchEvent();
            }
        } else {
            if (this.modeSwitcher) {
                detach(select('.' + CTRLBTN, ctrlBtnWrapper));
            } else {
                remove(ctrlBtnWrapper);
            }
        }
    }

    private changeValueProp(newProp: string): void {
        if (this.isPicker()) {
            this.rgb = this.hexToRgb(newProp);
            this.hsv = this.rgbToHsv.apply(this, this.rgb);
            this.setHandlerPosition();
            detach(closest(this.hueSlider.element, '.e-slider-preview'));
            this.createSlider();
            this.setHsvContainerBg();
            this.updateInput(newProp);
            if (this.rgb.length === 4) { this.updateOpacityInput(this.rgb[3] * 100); }
        } else {
            this.removeTileSelection();
            let ele: Element = select('span[aria-label="' + this.roundValue(newProp) + '"]', this.container);
            if (ele) { this.addTileSelection(ele); }
        }
    }

    private setInputEleProps(prop: boolean): void {
        remove(select('.' + INPUTWRAPPER, this.container));
        this.createInput();
    }

    private changeDisabledProp(newProp: boolean): void {
        if (this.isPicker()) {
            this.hueSlider.enabled = !newProp;
            this.opacitySlider.enabled = !newProp;
            this.setInputEleProps(newProp);
        }
        if (newProp) {
            this.toggleDisabled(true);
            this.unWireEvents();
        } else {
            this.toggleDisabled(false);
            this.wireEvents();
        }
    }

    private changeCssClassProps(newProp: string, oldProp: string): void {
        let wrapper: Element = this.getWrapper();
        let popupWrapper: HTMLElement = this.getPopupEle();
        if (oldProp) {
            removeClass([wrapper, popupWrapper], oldProp.split(' '));
        }
        if (newProp) {
            addClass([wrapper, popupWrapper], newProp.split(' '));
        }
    }

    private changeRtlProps(newProp: boolean): void {
        if (newProp) {
            addClass([this.getWrapper()], 'e-rtl');
        } else {
            removeClass([this.getWrapper()], 'e-rtl');
        }
    }

    private changePaletteProps(): void {
        detach(this.container.children[0]);
        this.container.style.width = '';
        this.createPalette();
    }

    private changeOpacityProps(newProp: boolean): void {
        let wrapper: HTMLElement = this.getWrapper();
        if (newProp) {
            removeClass([this.container.parentElement], HIDEOPACITY);
            this.createOpacitySlider(
                select('.e-colorpicker-slider', this.container).appendChild(this.createElement('div', { className: 'e-opacity-slider' })));
            if (!wrapper.classList.contains(HIDEVALUE) && !wrapper.classList.contains(HIDERGBA)) {
                this.appendOpacityValue(select('.e-input-container', this.container) as HTMLElement);
            }
        } else {
            addClass([this.container.parentElement], HIDEOPACITY);
            this.opacitySlider.destroy();
            remove(this.opacitySlider.element);
            this.opacitySlider = null;
            if (!wrapper.classList.contains(HIDEVALUE) && !wrapper.classList.contains(HIDERGBA)) {
                remove(select('.' + OPACITY, this.container).parentElement);
            }
        }
    }

    /**
     * Called internally if any of the property value changed.
     * @param  {ColorPickerModel} newProp
     * @param  {ColorPickerModel} oldProp
     * @returns void
     * @private
     */
    public onPropertyChanged(newProp: ColorPickerModel, oldProp: ColorPickerModel): void {
        if (!isNullOrUndefined(newProp.value)) {
            let value: string = this.roundValue(newProp.value);
            if (value.length === 9) {
                this.element.value = this.roundValue(value).slice(0, 7);
                let preview: HTMLElement = this.splitBtn && select('.' + SPLITPREVIEW, this.splitBtn.element) as HTMLElement;
                if (preview) { preview.style.backgroundColor = this.convertToRgbString(this.hexToRgb(newProp.value)); }
            } else {
                this.value = oldProp.value;
            }
        }
        if (!this.inline && isNullOrUndefined(newProp.inline)) {
            let otherCompModel: string[] = ['disabled', 'enableRtl'];
            this.splitBtn.setProperties(getModel(newProp, otherCompModel));
            if (!this.isPopupOpen()) {
                this.changeCssClassProps(newProp.cssClass, oldProp.cssClass);
                this.changeRtlProps(newProp.enableRtl);
                return;
            }
        }
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'inline':
                    if (newProp.inline) {
                        this.getWrapper().appendChild(this.container);
                        this.splitBtn.destroy();
                        detach(this.element.nextElementSibling);
                        if (!this.container.children.length) {
                            this.createWidget();
                        }
                    } else {
                        this.destroyOtherComp();
                        this.unWireEvents();
                        this.container.innerHTML = '';
                        this.createSplitBtn();
                    }
                    break;
                case 'cssClass':
                    this.changeCssClassProps(newProp.cssClass, oldProp.cssClass);
                    let props: string[] = newProp.cssClass.split(' ').concat(oldProp.cssClass.split(' '));
                    props = props.reduce((a: string[], b: string): string[] => { if (a.indexOf(b) < 0) { a.push(b); } return a; }, []);
                    let count: number = 0;
                    props.forEach((cls: string) => {
                        if (count === 0 &&
                            (cls === HIDEVALUE || cls === HIDEVALUESWITCH || cls === SHOWVALUE || cls === HIDEHEX || cls === HIDERGBA)) {
                            let inputWrap: Element = select('.' + INPUTWRAPPER, this.container);
                            if (inputWrap) { remove(select('.' + INPUTWRAPPER, this.container)); }
                            this.createInput();
                            count++;
                        }
                    });
                    break;
                case 'enableRtl':
                    if (this.isPicker()) {
                        this.hueSlider.enableRtl = newProp.enableRtl;
                        if (this.enableOpacity) { this.opacitySlider.enableRtl = newProp.enableRtl; }
                        this.setInputEleProps(newProp.enableRtl);
                    }
                    this.changeRtlProps(newProp.enableRtl);
                    break;
                case 'disabled':
                    this.changeDisabledProp(newProp.disabled);
                    break;
                case 'value':
                    if (this.value !== oldProp.value) { this.changeValueProp(newProp.value); }
                    break;
                case 'showButtons':
                    this.changeShowBtnProps(newProp.showButtons);
                    break;
                case 'mode':
                    if (newProp.mode === 'Picker') {
                        this.switchToPicker();
                    } else {
                        this.switchToPalette();
                    }
                    break;
                case 'modeSwitcher':
                    this.changeModeSwitcherProp(newProp.modeSwitcher);
                    break;
                case 'columns':
                case 'presetColors':
                    if (!this.isPicker()) {
                        this.changePaletteProps();
                    }
                    break;
                case 'noColor':
                    if (newProp.noColor) {
                        if (this.mode === 'Palette' && !this.modeSwitcher) {
                            this.setNoColor();
                        }
                    } else {
                        this.changePaletteProps();
                    }
                    break;
                case 'enableOpacity':
                    this.changeOpacityProps(newProp.enableOpacity);
                    break;
            }
        }
    }

    /**
     * Sets the focus to Colorpicker
     * its native method
     * @public
     */
    public focusIn(): void {
        this.element.parentElement.focus();
}
}

/**
 * Interface for change / select event.
 */
export interface ColorPickerEventArgs extends BaseEventArgs {
    currentValue: { hex: string, rgba: string };
    previousValue: { hex: string, rgba: string };
}

/**
 * Interface for before change event.
 */
export interface PaletteTileEventArgs extends BaseEventArgs {
    element: HTMLElement;
    presetName: string;
    value: string;
}

/**
 * Interface for before open / close event.
 */
export interface BeforeOpenCloseEventArgs extends BaseEventArgs {
    element: HTMLElement;
    event: Event;
    cancel: boolean;
}

/**
 * Interface for open event.
 */
export interface OpenEventArgs extends BaseEventArgs {
    element: HTMLElement;
}

/**
 * Interface for mode switching event.
 */
export interface ModeSwitchEventArgs extends BaseEventArgs {
    element: HTMLElement;
    mode: string;
}
