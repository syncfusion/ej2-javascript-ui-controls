import { Component, EventHandler, Property, Event, EmitType, Complex, Collection, isBlazor } from '@syncfusion/ej2-base';
import { L10n, Internationalization, NumberFormatOptions } from '@syncfusion/ej2-base';
import { NotifyPropertyChanges, INotifyPropertyChanged, ChildProperty } from '@syncfusion/ej2-base';
import { attributes, addClass, removeClass, setStyleAttribute, detach, closest } from '@syncfusion/ej2-base';
import { isNullOrUndefined, formatUnit, Browser } from '@syncfusion/ej2-base';
import { Tooltip, Position, TooltipEventArgs } from '@syncfusion/ej2-popups';
import { SliderModel, TicksDataModel, TooltipDataModel, LimitDataModel, ColorRangeDataModel } from './slider-model';

/**
 * Configures the ticks data of the Slider.
 */
export class TicksData extends ChildProperty<TicksData> {
    /**
     * It is used to denote the position of the ticks in the Slider. The available options are:
     *
     *  * before - Ticks are placed in the top of the horizontal slider bar or at the left of the vertical slider bar.
     *  * after - Ticks are placed in the bottom of the horizontal slider bar or at the right of the vertical slider bar.
     *  * both - Ticks are placed on the both side of the Slider bar.
     *  * none - Ticks are not shown.
     *
     * @default 'None'
     */
    @Property('None')
    public placement: Placement;
    /**
     * It is used to denote the distance between two major (large) ticks from the scale of the Slider.
     * @default 10
     */
    @Property(10)
    public largeStep: number;
    /**
     * It is used to denote the distance between two minor (small) ticks from the scale of the Slider.
     * @default 1
     */
    @Property(1)
    public smallStep: number;
    /**
     * We can show or hide the small ticks in the Slider, which will be appeared in between the largeTicks.
     * @default false
     */
    @Property(false)
    public showSmallTicks: boolean;

    /**
     * It is used to customize the Slider scale value to the desired format using Internationalization or events(custom formatting).
     */
    @Property(null)
    public format: string;
}

/**
 * It is used to denote the TooltipChange Event arguments.
 */
export interface SliderTooltipEventArgs {
    /**
     * It is used to get the value of the Slider.
     * @isGenericType true
     */
    value: number | number[];
    /**
     * It is used to get the text shown in the Slider tooltip.
     */
    text: string;
}

/**
 * It is used to denote the Slider Change/Changed Event arguments.
 */
export interface SliderChangeEventArgs {
    /**
     * It is used to get the current value of the Slider.
     * @isGenericType true
     */
    value: number | number[];
    /**
     * It is used to get the previous value of the Slider.
     * @isGenericType true
     */
    previousValue: number | number[];
    /**
     * It is used to get the current text or formatted text of the Slider, which is placed in tooltip.
     */
    text?: string;
    /**
     * It is used to get the action applied on the Slider.
     */
    action: string;
}

/**
 * It is used to denote the TicksRender Event arguments.
 */
export interface SliderTickEventArgs {
    /**
     * It is used to get the value of the tick.
     */
    value: number;
    /**
     * It is used to get the label text of the tick.
     */
    text: string;
    /**
     * It is used to get the current tick element.
     */
    tickElement: Element;
}

/**
 * It is used t denote the ticks rendered Event arguments.
 */
export interface SliderTickRenderedEventArgs {
    /**
     * It returns the wrapper of the ticks element.
     */
    ticksWrapper: HTMLElement;
    /**
     * It returns the collection of tick elements.
     */
    tickElements: HTMLElement[];
}

/**
 * It illustrates the color track data in slider.
 */
export class ColorRangeData extends ChildProperty<ColorRangeData> {
    /**
     * It is used to set the color in the slider bar.
     * @default ''
     */
    @Property(null)
    public color: string;

    /**
     * It is used to get the starting value for applying color.
     * @default null
     */
    @Property(null)
    public start: number;

    /**
     * It is used to get the end value for applying color.
     * @default null
     */
    @Property(null)
    public end: number;
}

/**
 * It illustrates the limit data in slider.
 */
export class LimitData extends ChildProperty<LimitData> {
    /**
     * It is used to enable the limit in the slider.
     * @default false
     */
    @Property(false)
    public enabled: boolean;

    /**
     * It is used to set the minimum start limit value.
     * @default null
     */
    @Property(null)
    public minStart: number;

    /**
     * It is used to set the minimum end limit value.
     * @default null
     */
    @Property(null)
    public minEnd: number;

    /**
     * It is used to set the maximum start limit value.
     * @default null
     */
    @Property(null)
    public maxStart: number;

    /**
     * It is used to set the maximum end limit value.
     * @default null
     */
    @Property(null)
    public maxEnd: number;

    /**
     * It is used to lock the first handle.
     * @default false
     */
    @Property(false)
    public startHandleFixed: boolean;

    /**
     * It is used to lock the second handle.
     * @default false
     */
    @Property(false)
    public endHandleFixed: boolean;
}

/**
 * It illustrates the tooltip data in slider.
 */
export class TooltipData extends ChildProperty<TooltipData> {
    /**
     * It is used to customize the Tooltip which accepts custom CSS class names that define
     *  specific user-defined styles and themes to be applied on the Tooltip element.
     * @default ''
     */
    @Property('')
    public cssClass: string;
    /**
     * It is used to denote the position for the tooltip element in the Slider. The available options are:
     *
     *  * Before - Tooltip is shown in the top of the horizontal slider bar or at the left of the vertical slider bar.
     *  * After - Tooltip is shown in the bottom of the horizontal slider bar or at the right of the vertical slider bar.
     */
    @Property('Before')
    public placement: TooltipPlacement;

    /**
     * It is used to determine the device mode to show the Tooltip.
     * If it is in desktop, it will show the Tooltip content when hovering on the target element.
     * If it is in touch device. It will show the Tooltip content when tap and holding on the target element.
     * @default 'Auto'
     */
    @Property('Focus')
    public showOn: TooltipShowOn;

    /**
     * It is used to show or hide the Tooltip of Slider Component.
     */
    @Property(false)
    public isVisible: boolean;

    /**
     * It is used to customize the Tooltip content to the desired format
     *  using internationalization or events (custom formatting).
     */
    @Property(null)
    public format: string;
}


/**
 * Ticks Placement.
 */
export type Placement = 'Before' | 'After' | 'Both' | 'None';

/**
 * Tooltip Placement.
 */
export type TooltipPlacement = 'Before' | 'After';

/**
 * Tooltip ShowOn.
 */
export type TooltipShowOn = 'Focus' | 'Hover' | 'Always' | 'Auto';


/**
 * Slider type.
 */
export type SliderType = 'Default' | 'MinRange' | 'Range';
/**
 * Slider orientation.
 */
export type SliderOrientation = 'Horizontal' | 'Vertical';

type SliderHandleNumber = 1 | 2;

const bootstrapTooltipOffset: number = 6;
const bootstrap4TooltipOffset: number = 3;

const classNames: { [key: string]: string } = {
    root: 'e-slider',
    rtl: 'e-rtl',
    sliderHiddenInput: 'e-slider-input',
    controlWrapper: 'e-control-wrapper',
    sliderHandle: 'e-handle',
    rangeBar: 'e-range',
    sliderButton: 'e-slider-button',
    firstButton: 'e-first-button',
    secondButton: 'e-second-button',
    scale: 'e-scale',
    tick: 'e-tick',
    large: 'e-large',
    tickValue: 'e-tick-value',
    sliderTooltip: 'e-slider-tooltip',
    sliderHover: 'e-slider-hover',
    sliderFirstHandle: 'e-handle-first',
    sliderSecondHandle: 'e-handle-second',
    sliderDisabled: 'e-disabled',
    sliderContainer: 'e-slider-container',
    horizontalTooltipBefore: 'e-slider-horizontal-before',
    horizontalTooltipAfter: 'e-slider-horizontal-after',
    verticalTooltipBefore: 'e-slider-vertical-before',
    verticalTooltipAfter: 'e-slider-vertical-after',
    materialTooltip: 'e-material-tooltip',
    materialTooltipOpen: 'e-material-tooltip-open',
    materialTooltipActive: 'e-tooltip-active',
    materialSlider: 'e-material-slider',
    sliderTrack: 'e-slider-track',
    sliderHorizantalColor: 'e-slider-horizantal-color',
    sliderVerticalColor: 'e-slider-vertical-color',
    sliderHandleFocused: 'e-handle-focused',
    verticalSlider: 'e-vertical',
    horizontalSlider: 'e-horizontal',
    sliderHandleStart: 'e-handle-start',
    sliderTooltipStart: 'e-material-tooltip-start',
    sliderTabHandle: 'e-tab-handle',
    sliderButtonIcon: 'e-button-icon',
    sliderSmallSize: 'e-small-size',
    sliderTickPosition: 'e-tick-pos',
    sliderFirstTick: 'e-first-tick',
    sliderLastTick: 'e-last-tick',
    sliderButtonClass: 'e-slider-btn',
    sliderTooltipWrapper: 'e-tooltip-wrap',
    sliderTabTrack: 'e-tab-track',
    sliderTabRange: 'e-tab-range',
    sliderActiveHandle: 'e-handle-active',
    sliderMaterialHandle: 'e-material-handle',
    sliderMaterialRange: 'e-material-range',
    sliderMaterialDefault: 'e-material-default',
    materialTooltipShow: 'e-material-tooltip-show',
    materialTooltipHide: 'e-material-tooltip-hide',
    readonly: 'e-read-only',
    limits: 'e-limits',
    limitBarDefault: 'e-limit-bar',
    limitBarFirst: 'e-limit-first',
    limitBarSecond: 'e-limit-second',
    dragHorizontal: 'e-drag-horizontal',
    dragVertical: 'e-drag-vertical'
};


/**
 * The Slider component allows the user to select a value or range
 * of values in-between a min and max range, by dragging the handle over the slider bar.
 * ```html
 * <div id='slider'></div>
 * ```
 * ```typescript
 * <script>
 *   var sliderObj = new Slider({ value: 10 });
 *   sliderObj.appendTo('#slider');
 * </script>
 * ```
 */

@NotifyPropertyChanges
export class Slider extends Component<HTMLElement> implements INotifyPropertyChanged {
    /* Internal variables */
    private hiddenInput: HTMLInputElement;
    private firstHandle: HTMLElement;
    private sliderContainer: HTMLElement;
    private secondHandle: HTMLElement;
    private rangeBar: HTMLElement;
    private onresize: EventListener;
    private isElementFocused: boolean;
    private handlePos1: number;
    private handlePos2: number;
    private rtl: boolean;
    private preHandlePos1: number;
    private preHandlePos2: number;
    private handleVal1: number;
    private handleVal2: number;
    private val: number;
    private activeHandle: number;
    private sliderTrack: HTMLElement;
    private materialHandle: HTMLElement;
    private firstBtn: HTMLElement;
    private tooltipObj: Tooltip;
    private tooltipElement: HTMLElement;
    private isMaterialTooltip: boolean;
    private secondBtn: HTMLElement;
    private ul: HTMLElement;
    private firstChild: Element;
    private tooltipCollidedPosition: string;
    private tooltipTarget: HTMLElement;
    private lastChild: Element;
    private previousTooltipClass: string;
    private horDir: string = 'left';
    private verDir: string = 'bottom';
    private transition: { [key: string]: string } = {
        handle: 'left .4s cubic-bezier(.25, .8, .25, 1), right .4s cubic-bezier(.25, .8, .25, 1), ' +
            'top .4s cubic-bezier(.25, .8, .25, 1) , bottom .4s cubic-bezier(.25, .8, .25, 1)',
        rangeBar: 'all .4s cubic-bezier(.25, .8, .25, 1)'
    };
    private transitionOnMaterialTooltip: { [key: string]: string } = {
        handle: 'left 1ms ease-out, right 1ms ease-out, bottom 1ms ease-out, top 1ms ease-out',
        rangeBar: 'left 1ms ease-out, right 1ms ease-out, bottom 1ms ease-out, width 1ms ease-out, height 1ms ease-out'
    };
    private scaleTransform: string = 'transform .4s cubic-bezier(.25, .8, .25, 1)';
    private previousVal: number | number[];
    private previousChanged: number | number[];
    // tslint:disable-next-line:no-any
    private repeatInterval: any;
    private isMaterial: boolean;
    private isBootstrap: boolean;
    private isBootstrap4: boolean;
    private zIndex: number;
    private l10n: L10n;
    private internationalization: Internationalization;
    private tooltipFormatInfo: NumberFormatOptions;
    private ticksFormatInfo: NumberFormatOptions;
    private customAriaText: string = null;
    private noOfDecimals: number;
    private tickElementCollection: HTMLElement[];
    private limitBarFirst: HTMLElement;
    private limitBarSecond: HTMLElement;
    private firstPartRemain: number;
    private secondPartRemain: number;
    private minDiff: number;
    private drag: boolean = true;
    private isForm: boolean;
    private formElement: HTMLFormElement;
    private formResetValue: number | number[];

    /**
     * It is used to denote the current value of the Slider.
     * The value should be specified in array of number when render Slider type as range.
     *
     * {% codeBlock src="slider/value-api/index.ts" %}{% endcodeBlock %}
     * @default null
     * @isGenericType true
     */
    @Property(null)
    public value: number | number[];

    /**
     * It is used to denote own array of slider values.
     * The value should be specified in array of number or string.The min,max and step value is not considered
     * @default null
     */
    @Property(null)
    public customValues: string[] | number[];

    /**
     * It is used to denote the step value of Slider component which is the amount of Slider value change
     *  when increase / decrease button is clicked or press arrow keys or drag the thumb.
     *  Refer the documentation [here](../../slider/ticks#step)
     *  to know more about this property with demo.
     *
     * {% codeBlock src="slider/step-api/index.ts" %}{% endcodeBlock %}
     * @default 1
     */
    @Property(1)
    public step: number;

    /**
     * It sets the minimum value of Slider Component
     *
     * {% codeBlock src="slider/min-max-api/index.ts" %}{% endcodeBlock %}
     * @default 0
     */
    @Property(0)
    public min: number;

    /**
     * It sets the maximum value of Slider Component
     *
     * {% codeBlock src="slider/min-max-api/index.ts" %}{% endcodeBlock %}
     * @default 100
     */
    @Property(100)
    public max: number;

    /**
     * It is used to render the Slider component in read-only mode.
     * The slider rendered with user defined values and can’t be interacted with user actions.
     * @default false
     */
    @Property(false)
    public readonly: boolean;

    /**
     * It is used to denote the type of the Slider. The available options are:
     *  * default - Used to select a single value in the Slider.
     *  * minRange - Used to select a single value in the Slider. It displays shadow from the start value to the current value.
     *  * range - Used to select a range of values in the Slider. It displays shadow in-between the selection range.
     */
    @Property('Default')
    public type: SliderType;

    /**
     * It is used to render the color to the slider based on the given  value
     */
    @Collection<ColorRangeDataModel>([{}], ColorRangeData)
    public colorRange: ColorRangeDataModel[];

    /**
     * It is used to render the slider ticks options such as placement and step values.
     * Refer the documentation [here](../../slider/ticks)
     *  to know more about this property with demo.
     *
     * {% codeBlock src="slider/ticks-api/index.ts" %}{% endcodeBlock %}
     * @default { placement: 'before' }
     */
    @Complex<TicksDataModel>({}, TicksData)
    public ticks: TicksDataModel;

    /**
     * It is used to limit the slider movement within certain limits.
     * Refer the documentation [here](../../slider/limits)
     *  to know more about this property with demo
     *
     * {% codeBlock src="slider/limits-api/index.ts" %}{% endcodeBlock %}
     * @default { enabled: false }
     */
    @Complex<LimitDataModel>({}, LimitData)
    public limits: LimitDataModel;

    /**
     * It is used to enable or disable the slider.
     * @default true
     */
    @Property(true)
    public enabled: boolean;

    /**
     * It is used to denote the slider tooltip and it's position.
     *
     * {% codeBlock src="slider/tooltip-api/index.ts" %}{% endcodeBlock %}
     * @default { placement: 'Before', isVisible: false, showOn: 'Focus', format: null }
     */
    @Complex<TooltipDataModel>({}, TooltipData)
    public tooltip: TooltipDataModel;

    /**
     * It is used to show or hide the increase and decrease button of Slider Component,
     *  which is used to change the slider value.
     * Refer the documentation [here](../../slider/getting-started#buttons)
     *  to know more about this property with demo.
     *
     * {% codeBlock src="slider/showButtons-api/index.ts" %}{% endcodeBlock %}
     * @default false
     */
    @Property(false)
    public showButtons: boolean;

    /**
     * It is used to enable or disable the Slider handle moving animation.
     * @default true
     */
    @Property(true)
    public enableAnimation: boolean;

    /**
     * It is used to render Slider in either horizontal or vertical orientation.
     *  Refer the documentation [here](../../slider/getting-started#orientation)
     *  to know more about this property with demo.
     * @default 'Horizontal'
     */
    @Property('Horizontal')
    public orientation: SliderOrientation;

    /**
     * This property sets the CSS classes to root element of the Slider
     *  which helps to customize the UI styles.
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * We can trigger created event when the Slider is created.
     * @event
     * @blazorProperty 'Created'
     */
    @Event()
    public created: EmitType<Object>;

    /**
     * We can trigger change event whenever Slider value is changed.
     *  In other term, this event will be triggered while drag the slider thumb.
     * @event
     * @blazorProperty 'OnChange'
     */
    @Event()
    public change: EmitType<SliderChangeEventArgs>;

    /**
     * We can trigger changed event when Slider component action is completed while we change the Slider value.
     *  In other term, this event will be triggered, while drag the slider thumb completed.
     * @event
     * @blazorProperty 'ValueChange'
     */
    @Event()
    public changed: EmitType<SliderChangeEventArgs>;

    /**
     * We can trigger renderingTicks event when the ticks rendered on Slider,
     *  which is used to customize the ticks labels dynamically.
     * @event
     * @blazorProperty 'TicksRendering'
     */
    @Event()
    public renderingTicks: EmitType<SliderTickEventArgs>;

    /**
     * We can trigger renderedTicks event when the ticks are rendered on the Slider.
     * @event
     * @blazorProperty 'TicksRendered'
     */
    @Event()
    public renderedTicks: EmitType<SliderTickRenderedEventArgs>;

    /**
     * We can trigger tooltipChange event when we change the Sider tooltip value.
     * @deprecated
     * @event
     * @blazorProperty 'OnTooltipChange'
     */
    @Event()
    public tooltipChange: EmitType<SliderTooltipEventArgs>;

    constructor(options?: SliderModel, element?: string | HTMLElement) {
        super(options, <HTMLElement | string>element);
    }

    protected preRender(): void {
        let localeText: object = { incrementTitle: 'Increase', decrementTitle: 'Decrease' };
        this.l10n = new L10n('slider', localeText, this.locale);
        this.isElementFocused = false;
        this.tickElementCollection = [];
        this.tooltipFormatInfo = {};
        this.ticksFormatInfo = {};
        this.initCultureInfo();
        this.initCultureFunc();
        this.formChecker();
    }

    private formChecker(): void {
        const formElement: Element = closest(this.element, 'form');
        if (formElement) {
            this.isForm = true;
            // this condition needs to be checked, if the slider is going to be refreshed by `refresh()`
            // then we need to revert the slider `value` back to `formResetValue` to preserve the initial value
            if (!isNullOrUndefined(this.formResetValue)) {
                this.setProperties({ 'value': this.formResetValue }, true);
            }
            this.formResetValue = this.value;
            if (this.type === 'Range' &&
                (isNullOrUndefined(this.formResetValue) || typeof (this.formResetValue) !== 'object')) {
                this.formResetValue = [parseFloat(formatUnit(this.min)), parseFloat(formatUnit(this.max))];
            } else if (isNullOrUndefined(this.formResetValue)) {
                this.formResetValue = parseFloat(formatUnit(this.min));
            }
            this.formElement = formElement as HTMLFormElement;
        } else {
            this.isForm = false;
        }
    }

    private initCultureFunc(): void {
        this.internationalization = new Internationalization(this.locale);
    }

    private initCultureInfo(): void {
        this.tooltipFormatInfo.format = (!isNullOrUndefined(this.tooltip.format)) ? this.tooltip.format : null;
        this.ticksFormatInfo.format = (!isNullOrUndefined(this.ticks.format)) ? this.ticks.format : null;
    }

    private formatString(value: number, formatInfo: NumberFormatOptions): { elementVal: string, formatString: string } {
        let formatValue: string = null;
        let formatString: string = null;
        if ((value || value === 0)) {
            formatValue = this.formatNumber(value);
            let numberOfDecimals: number = this.numberOfDecimals(value);
            formatString = this.internationalization.getNumberFormat(formatInfo)(this.makeRoundNumber(value, numberOfDecimals));
        }
        return { elementVal: formatValue, formatString: formatString };
    };

    private formatNumber(value: number): string {
        let numberOfDecimals: number = this.numberOfDecimals(value);
        return this.internationalization.getNumberFormat({
            maximumFractionDigits: numberOfDecimals,
            minimumFractionDigits: numberOfDecimals, useGrouping: false
        })(value);
    };

    private numberOfDecimals(value: number | string): number {
        let decimalPart: string = value.toString().split('.')[1];
        let numberOfDecimals: number = !decimalPart || !decimalPart.length ? 0 : decimalPart.length;
        return numberOfDecimals;
    }

    private makeRoundNumber(value: number, precision: number): number {
        let decimals: number = precision || 0;
        return Number(value.toFixed(decimals));
    };

    private fractionalToInteger(value: number | string): number {
        value = (this.numberOfDecimals(value) === 0) ? Number(value).toFixed(this.noOfDecimals) : value;
        let tens: number = 1;
        for (let i: number = 0; i < this.noOfDecimals; i++) { tens *= 10; }
        value = Number((<number>value * tens).toFixed(0));
        return value;
    }

    /**
     * To Initialize the control rendering
     * @private
     */
    public render(): void {
        this.initialize();
        this.initRender();
        this.wireEvents();
        this.setZindex();
        this.renderComplete();
    }

    private initialize(): void {
        addClass([this.element], classNames.root);
        this.setCSSClass();
    }

    private setCSSClass(oldCSSClass?: string): void {
        if (oldCSSClass) {
            removeClass([this.element], oldCSSClass.split(' '));
        }
        if (this.cssClass) {
            addClass([this.element], this.cssClass.split(' '));
        }
    }

    private setEnabled(): void {
        if (!this.enabled) {
            addClass([this.sliderContainer], [classNames.sliderDisabled]);
            if (this.tooltip.isVisible && this.tooltipElement && this.tooltip.showOn === 'Always') {
                this.tooltipElement.classList.add(classNames.sliderDisabled);
            }
            this.unwireEvents();
        } else {
            removeClass([this.sliderContainer], [classNames.sliderDisabled]);
            if (this.tooltip.isVisible && this.tooltipElement && this.tooltip.showOn === 'Always') {
                this.tooltipElement.classList.remove(classNames.sliderDisabled);
            }
            this.wireEvents();
        }
    }

    private getTheme(container: HTMLElement): string {
        let theme: string = window.getComputedStyle(container as Element, ':after').getPropertyValue('content');
        return theme.replace(/['"]+/g, '');
    }

    /**
     * Initialize the rendering
     * @private
     */
    private initRender(): void {
        this.sliderContainer = this.createElement('div', { className: classNames.sliderContainer + ' ' + classNames.controlWrapper });
        this.element.parentNode.insertBefore(this.sliderContainer, this.element);
        this.sliderContainer.appendChild(this.element);
        this.sliderTrack = this.createElement('div', { className: classNames.sliderTrack });
        this.element.appendChild(this.sliderTrack);
        this.element.tabIndex = -1;
        this.getThemeInitialization();
        this.setHandler();
        this.createRangeBar();
        if (this.limits.enabled) {
            this.createLimitBar();
        }
        this.setOrientClass();
        this.hiddenInput = <HTMLInputElement>(this.createElement('input', {
            attrs: {
                type: 'hidden', value: (isNullOrUndefined(this.value) ? this.min.toString() : this.value.toString()),
                name: this.element.getAttribute('name') || this.element.getAttribute('id') ||
                    '_' + (Math.random() * 1000).toFixed(0) + 'slider', class: classNames.sliderHiddenInput
            }
        }));
        this.hiddenInput.tabIndex = -1;
        this.sliderContainer.appendChild(this.hiddenInput);
        if (this.showButtons) { this.setButtons(); }
        this.setEnableRTL();
        if (this.type === 'Range') {
            this.rangeValueUpdate();
        } else {
            this.value = isNullOrUndefined(this.value) ? parseFloat(formatUnit(this.min.toString())) : this.value;
        }
        this.previousVal = this.type !== 'Range' ? this.checkHandleValue(parseFloat(formatUnit(this.value.toString()))) :
            [this.checkHandleValue(parseFloat(formatUnit((this.value as number[])[0].toString()))),
            this.checkHandleValue(parseFloat(formatUnit((this.value as number[])[1].toString())))];
        this.previousChanged = this.previousVal;
        if (!isNullOrUndefined(this.element.hasAttribute('name'))) {
            this.element.removeAttribute('name');
        }
        this.setValue();
        if (this.limits.enabled) {
            this.setLimitBar();
        }
        if (this.ticks.placement !== 'None') {
            this.renderScale();
        }
        if (this.tooltip.isVisible) {
            this.renderTooltip();
        }
        if (!this.enabled) {
            addClass([this.sliderContainer], [classNames.sliderDisabled]);
        } else {
            removeClass([this.sliderContainer], [classNames.sliderDisabled]);
        }
        if (this.readonly) {
            addClass([this.sliderContainer], [classNames.readonly]);
        } else {
            removeClass([this.sliderContainer], [classNames.readonly]);
        }
    }

    private getThemeInitialization(): void {
        this.isMaterial = this.getTheme(this.sliderContainer) === 'material'
            || this.getTheme(this.sliderContainer) === 'material-dark';
        this.isBootstrap = this.getTheme(this.sliderContainer) === 'bootstrap'
            || this.getTheme(this.sliderContainer) === 'bootstrap-dark';
        this.isBootstrap4 = this.getTheme(this.sliderContainer) === 'bootstrap4';
        this.isMaterialTooltip = this.isMaterial && this.type !== 'Range' && this.tooltip.isVisible;
    }

    private createRangeBar(): void {
        if (this.type !== 'Default') {
            this.rangeBar = <HTMLElement>(this.createElement('div', { attrs: { class: classNames.rangeBar } }));
            this.element.appendChild(this.rangeBar);

            if (this.drag && this.type === 'Range') {
                if (this.orientation === 'Horizontal') {
                    this.rangeBar.classList.add(classNames.dragHorizontal);
                } else {
                    this.rangeBar.classList.add(classNames.dragVertical);
                }
            }
        }
    }

    private createLimitBar(): void {
        let firstElementClassName: string = this.type !== 'Range' ? classNames.limitBarDefault :
            classNames.limitBarFirst;
        firstElementClassName += ' ' + classNames.limits;
        this.limitBarFirst = <HTMLElement>(this.createElement('div', {
            attrs: { class: firstElementClassName }
        }));
        this.element.appendChild(this.limitBarFirst);
        if (this.type === 'Range') {
            this.limitBarSecond = <HTMLElement>(this.createElement('div', {
                attrs: {
                    class: classNames.limitBarSecond + ' ' + classNames.limits
                }
            }));
            this.element.appendChild(this.limitBarSecond);
        }
    }

    private setOrientClass(): void {
        if (this.orientation !== 'Vertical') {
            this.sliderContainer.classList.remove(classNames.verticalSlider);
            this.sliderContainer.classList.add(classNames.horizontalSlider);
            this.firstHandle.setAttribute('aria-orientation', 'horizontal');
            if (this.type === 'Range') {
                this.secondHandle.setAttribute('aria-orientation', 'horizontal');
            }
        } else {
            this.sliderContainer.classList.remove(classNames.horizontalSlider);
            this.sliderContainer.classList.add(classNames.verticalSlider);
            this.firstHandle.setAttribute('aria-orientation', 'vertical');
            if (this.type === 'Range') {
                this.secondHandle.setAttribute('aria-orientation', 'vertical');
            }
        }
    }

    private setAriaAttributes(element: Element, ): void {
        let min: string | number = this.min; let max: string | number = this.max;
        if (!isNullOrUndefined(this.customValues) && this.customValues.length > 0) {
            min = this.customValues[0];
            max = this.customValues[this.customValues.length - 1];
        }
        if (this.type !== 'Range') {
            attributes(element, {
                'aria-valuemin': min.toString(), 'aria-valuemax': max.toString()
            });
        } else {
            let range: string[][] = !isNullOrUndefined(this.customValues) && this.customValues.length > 0 ?
                [[min.toString(), (this.customValues[(this.value as number[])[1]]).toString()],
                [(this.customValues[(this.value as number[])[0]]).toString(), max.toString()]] :
                [[min.toString(), (this.value as number[])[1].toString()], [(this.value as number[])[0].toString(), max.toString()]];
            range.forEach((range: string[], index: number) => {
                let element: Element = index === 0 ? this.firstHandle : this.secondHandle;
                if (element) {
                    attributes(element, {
                        'aria-valuemin': range[0], 'aria-valuemax': range[1]
                    });
                }
            });
        }
    }
    private createSecondHandle(): void {
        this.secondHandle = this.createElement('div', {
            attrs: {
                class: classNames.sliderHandle, 'role': 'slider', 'aria-labelledby':
                    this.element.id + '_title', tabIndex: '0'
            }
        });
        this.secondHandle.classList.add(classNames.sliderSecondHandle);
        this.element.appendChild(this.secondHandle);
    }

    private createFirstHandle(): void {
        this.firstHandle = this.createElement('div', {
            attrs: {
                class: classNames.sliderHandle, 'role': 'slider', 'aria-labelledby':
                    this.element.id + '_title', tabIndex: '0'
            }
        });
        this.firstHandle.classList.add(classNames.sliderFirstHandle);
        this.element.appendChild(this.firstHandle);
        if (this.isMaterialTooltip) {
            this.materialHandle = this.createElement('div', {
                attrs: {
                    class: classNames.sliderHandle + ' ' +
                        classNames.sliderMaterialHandle
                }
            });
            this.element.appendChild(this.materialHandle);
        }
    }

    private wireFirstHandleEvt(destroy: boolean): void {
        if (!destroy) {
            EventHandler.add(this.firstHandle, 'mousedown touchstart', this.handleFocus, this);
            EventHandler.add(this.firstHandle, 'transitionend', this.transitionEnd, this);
            EventHandler.add(this.firstHandle, 'mouseenter touchenter', this.handleOver, this);
            EventHandler.add(this.firstHandle, 'mouseleave touchend', this.handleLeave, this);
        } else {
            EventHandler.remove(this.firstHandle, 'mousedown touchstart', this.handleFocus);
            EventHandler.remove(this.firstHandle, 'transitionend', this.transitionEnd);
            EventHandler.remove(this.firstHandle, 'mouseenter touchenter', this.handleOver);
            EventHandler.remove(this.firstHandle, 'mouseleave touchend', this.handleLeave);
        }
    }

    private wireSecondHandleEvt(destroy: boolean): void {
        if (!destroy) {
            EventHandler.add(this.secondHandle, 'mousedown touchstart', this.handleFocus, this);
            EventHandler.add(this.secondHandle, 'transitionend', this.transitionEnd, this);
            EventHandler.add(this.secondHandle, 'mouseenter touchenter', this.handleOver, this);
            EventHandler.add(this.secondHandle, 'mouseleave touchend', this.handleLeave, this);
        } else {
            EventHandler.remove(this.secondHandle, 'mousedown touchstart', this.handleFocus);
            EventHandler.remove(this.secondHandle, 'transitionend', this.transitionEnd);
            EventHandler.remove(this.secondHandle, 'mouseenter touchenter', this.handleOver);
            EventHandler.remove(this.secondHandle, 'mouseleave touchend', this.handleLeave);
        }
    }

    private handleStart(): void {
        if (this.type !== 'Range') {
            this.firstHandle.classList[this.handlePos1 === 0 ? 'add' : 'remove'](classNames.sliderHandleStart);
            if (this.isMaterialTooltip) {
                this.materialHandle.classList[this.handlePos1 === 0 ? 'add' : 'remove'](classNames.sliderHandleStart);
                if (this.tooltipElement) {
                    this.tooltipElement.classList[this.handlePos1 === 0 ? 'add' : 'remove'](classNames.sliderTooltipStart);
                }
            }
        }
    }

    private transitionEnd(e: TransitionEvent): void {
        if (e.propertyName !== 'transform') {
            this.handleStart();
            this.getHandle().style.transition = 'none';
            if (this.type !== 'Default') {
                this.rangeBar.style.transition = 'none';
            }
            if (this.isMaterial && this.tooltip.isVisible && this.type === 'Default') {
                this.tooltipElement.style.transition = this.transition.handle;
            }
            this.tooltipToggle(this.getHandle());
            this.closeTooltip();
        }
    }

    private handleFocusOut(): void {
        if (this.firstHandle.classList.contains(classNames.sliderHandleFocused)) {
            this.firstHandle.classList.remove(classNames.sliderHandleFocused);
        }
        if (this.type === 'Range') {
            if (this.secondHandle.classList.contains(classNames.sliderHandleFocused)) {
                this.secondHandle.classList.remove(classNames.sliderHandleFocused);
            }
        }
    }
    private handleFocus(e: MouseEvent): void {
        if (e.currentTarget === this.firstHandle) {
            this.firstHandle.classList.add(classNames.sliderHandleFocused);
        } else {
            this.secondHandle.classList.add(classNames.sliderHandleFocused);
        }
    }
    private handleOver(e: MouseEvent): void {
        if (this.tooltip.isVisible && this.tooltip.showOn === 'Hover') {
            this.tooltipToggle(e.currentTarget as HTMLElement);
        }
    }
    private handleLeave(e: MouseEvent): void {
        if (this.tooltip.isVisible && this.tooltip.showOn === 'Hover' &&
            !(e.currentTarget as HTMLElement).classList.contains(classNames.sliderHandleFocused) &&
            !(e.currentTarget as HTMLElement).classList.contains(classNames.sliderTabHandle)) {
            this.closeTooltip();
        }

    }
    private setHandler(): void {
        if (this.min > this.max) {
            this.min = this.max;
        }
        this.createFirstHandle();
        if (this.type === 'Range') {
            this.createSecondHandle();
        }
    }

    private setEnableRTL(): void {
        this.enableRtl && this.orientation !== 'Vertical' ? addClass([this.sliderContainer], classNames.rtl) :
            removeClass([this.sliderContainer], classNames.rtl);
        let preDir: string = (this.orientation !== 'Vertical') ? this.horDir : this.verDir;
        if (this.enableRtl) {
            this.horDir = 'right';
            this.verDir = 'bottom';
        } else {
            this.horDir = 'left';
            this.verDir = 'bottom';
        }
        let currDir: string = (this.orientation !== 'Vertical') ? this.horDir : this.verDir;
        if (preDir !== currDir) {
            if (this.orientation === 'Horizontal') {
                setStyleAttribute(this.firstHandle, { 'right': '', 'left': 'auto' });
                if (this.type === 'Range') {
                    setStyleAttribute(this.secondHandle, { 'top': '', 'left': 'auto' });
                }
            }
        }
        this.setBarColor();
    }

    private tooltipValue(): void {
        let text: string;
        let args: SliderTooltipEventArgs = {
            value: this.value,
            text: ''
        };
        this.setTooltipContent();
        args.text = text = this.tooltipObj.content as string;
        this.trigger('tooltipChange', args, (observedArgs: SliderChangeEventArgs) => {
            this.addTooltipClass(observedArgs.text);
            if (text !== observedArgs.text) {
                this.customAriaText = observedArgs.text;
                this.tooltipObj.content = observedArgs.text;
                this.setAriaAttrValue(this.firstHandle);
                if (this.type === 'Range') {
                    this.setAriaAttrValue(this.secondHandle);
                }
            }
        });
    }

    private setTooltipContent(): void {
        let content: string;
        content = this.formatContent(this.tooltipFormatInfo, false);
        this.tooltipObj.content = content;
    }

    private formatContent(formatInfo: NumberFormatOptions, ariaContent: boolean): string {
        let content: string = '';
        let handle1: number = this.handleVal1;
        let handle2: number = this.handleVal2;
        if (!isNullOrUndefined(this.customValues) && this.customValues.length > 0) {
            handle1 = <number>this.customValues[this.handleVal1];
            handle2 = <number>this.customValues[this.handleVal2];
        }
        if (!ariaContent) {
            if (this.type === 'Range') {
                if (this.enableRtl && this.orientation !== 'Vertical') {
                    content = (!isNullOrUndefined(formatInfo.format)) ? (this.formatString(handle2, formatInfo)
                        .formatString + ' - ' + this.formatString(handle1, formatInfo).formatString) :
                        (handle2.toString() + ' - ' + handle1.toString());
                } else {
                    content = (!isNullOrUndefined(formatInfo.format)) ? (this.formatString(handle1, formatInfo)
                        .formatString + ' - ' + this.formatString(handle2, formatInfo).formatString) :
                        (handle1.toString() + ' - ' + handle2.toString());
                }
            } else {
                if (!isNullOrUndefined(handle1)) {
                    content = (!isNullOrUndefined(formatInfo.format)) ?
                        this.formatString(handle1, formatInfo).formatString : handle1.toString();
                }
            }
            return content;
        } else {
            if (this.type === 'Range') {
                if (this.enableRtl && this.orientation !== 'Vertical') {
                    content = (!isNullOrUndefined(this.tooltip) && !isNullOrUndefined(this.tooltip.format)) ?
                        (this.formatString(handle2, formatInfo).elementVal + ' - ' +
                            this.formatString(handle1, formatInfo).elementVal) :
                        (handle2.toString() + ' - ' + handle1.toString());
                } else {
                    content = (!isNullOrUndefined(this.tooltip) && !isNullOrUndefined(this.tooltip.format)) ?
                        (this.formatString(handle1, formatInfo).elementVal + ' - ' +
                            this.formatString(handle2, formatInfo).elementVal) :
                        (handle1.toString() + ' - ' + handle2.toString());
                }
            } else {
                if (!isNullOrUndefined(handle1)) {
                    content = (!isNullOrUndefined(this.tooltip) && !isNullOrUndefined(this.tooltip.format)) ?
                        this.formatString(handle1, formatInfo).elementVal : handle1.toString();
                }
            }
            return content;
        }
    }

    private addTooltipClass(content: string): void {
        if (this.isMaterialTooltip) {
            let count: number = content.toString().length;
            if (!this.tooltipElement) {
                let cssClass: string = count > 4 ? classNames.sliderMaterialRange : classNames.sliderMaterialDefault;
                this.tooltipObj.cssClass = classNames.sliderTooltip + ' ' + cssClass;
            } else {
                let cssClass: { [key: string]: string } = count > 4 ?
                    { oldCss: classNames.sliderMaterialDefault, newCss: classNames.sliderMaterialRange } :
                    { oldCss: classNames.sliderMaterialRange, newCss: classNames.sliderMaterialDefault };
                this.tooltipElement.classList.remove(cssClass.oldCss);
                if (!this.tooltipElement.classList.contains(cssClass.newCss)) {
                    this.tooltipElement.classList.add(cssClass.newCss);
                    this.tooltipElement.style.transform = count > 4 ? 'scale(1)' :
                        this.getTooltipTransformProperties(this.previousTooltipClass).rotate;
                }
            }
        }
    }

    private tooltipPlacement(): Position {
        return this.orientation === 'Horizontal' ? (this.tooltip.placement === 'Before' ? 'TopCenter' : 'BottomCenter') :
            (this.tooltip.placement === 'Before' ? 'LeftCenter' : 'RightCenter');
    }

    private tooltipBeforeOpen(args: TooltipEventArgs): void {
        this.tooltipElement = args.element;
        if (this.tooltip.cssClass) {
            addClass([this.tooltipElement], this.tooltip.cssClass.split(' ').filter((css: string) => css));
        }
        args.target.removeAttribute('aria-describedby');
        if (this.isMaterialTooltip) {
            (this.tooltipElement.firstElementChild as HTMLElement).classList.add(classNames.materialTooltipHide);
            this.handleStart();
            this.setTooltipTransform();
        }
    }

    private tooltipCollision(position: string): void {
        if (this.isBootstrap || this.isBootstrap4 || (this.isMaterial && !this.isMaterialTooltip)) {
            const tooltipOffsetValue: number = this.isBootstrap4 ? bootstrap4TooltipOffset : bootstrapTooltipOffset;
            switch (position) {
                case 'TopCenter':
                    this.tooltipObj.setProperties({ 'offsetY': -(tooltipOffsetValue) }, false);
                    break;

                case 'BottomCenter':
                    this.tooltipObj.setProperties({ 'offsetY': tooltipOffsetValue }, false);
                    break;

                case 'LeftCenter':
                    this.tooltipObj.setProperties({ 'offsetX': -(tooltipOffsetValue) }, false);
                    break;

                case 'RightCenter':
                    this.tooltipObj.setProperties({ 'offsetX': tooltipOffsetValue }, false);
                    break;
            }
        }
    }

    private wireMaterialTooltipEvent(destroy: boolean): void {
        if (this.isMaterialTooltip) {
            if (!destroy) {
                EventHandler.add(this.tooltipElement, 'mousedown touchstart', this.sliderDown, this);
            } else {
                EventHandler.remove(this.tooltipElement, 'mousedown touchstart', this.sliderDown);
            }
        }
    }

    private tooltipPositionCalculation(position: string): string {
        let cssClass: string;
        switch (position) {
            case 'TopCenter':
                cssClass = classNames.horizontalTooltipBefore;
                break;

            case 'BottomCenter':
                cssClass = classNames.horizontalTooltipAfter;
                break;
            case 'LeftCenter':
                cssClass = classNames.verticalTooltipBefore;
                break;

            case 'RightCenter':
                cssClass = classNames.verticalTooltipAfter;
                break;
        }
        return cssClass;
    }

    private getTooltipTransformProperties(className: string): { [key: string]: string } {
        let transformProperties: { [key: string]: string };
        if (this.tooltipElement) {
            let position: number = this.orientation === 'Horizontal' ?
                ((this.tooltipElement.clientHeight + 14) - (this.tooltipElement.clientHeight / 2)) :
                ((this.tooltipElement.clientWidth + 14) - (this.tooltipElement.clientWidth / 2));
            transformProperties = this.orientation === 'Horizontal' ?
                (className === classNames.horizontalTooltipBefore ? { rotate: 'rotate(45deg)', translate: `translateY(${position}px)` } :
                    { rotate: 'rotate(225deg)', translate: `translateY(${-(position)}px)` }) :
                (className === classNames.verticalTooltipBefore ? { rotate: 'rotate(-45deg)', translate: `translateX(${position}px)` } :
                    { rotate: 'rotate(-225deg)', translate: `translateX(${(-position)}px)` });
        }
        return transformProperties;
    }

    private openMaterialTooltip(): void {
        if (this.isMaterialTooltip) {
            this.refreshTooltip(this.firstHandle);
            let tooltipContentElement: HTMLElement = this.tooltipElement.firstElementChild as HTMLElement;
            tooltipContentElement.classList.remove(classNames.materialTooltipHide);
            tooltipContentElement.classList.add(classNames.materialTooltipShow);
            this.firstHandle.style.cursor = 'default';
            this.tooltipElement.style.transition = this.scaleTransform;
            this.tooltipElement.classList.add(classNames.materialTooltipOpen);
            this.materialHandle.style.transform = 'scale(0)';
            if (tooltipContentElement.innerText.length > 4) {
                this.tooltipElement.style.transform = 'scale(1)';
            } else {
                this.tooltipElement.style.transform = this.getTooltipTransformProperties(this.previousTooltipClass).rotate;
            }
            if (this.type === 'Default') {
                setTimeout(() => { this.tooltipElement.style.transition = this.transition.handle; }, 2500);
            } else {
                setTimeout(() => { this.tooltipElement.style.transition = 'none'; }, 2500);
            }

        }
    }

    private closeMaterialTooltip(): void {
        if (this.isMaterialTooltip) {
            let tooltipContentElement: HTMLElement = this.tooltipElement.firstElementChild as HTMLElement;
            this.tooltipElement.style.transition = this.scaleTransform;
            tooltipContentElement.classList.remove(classNames.materialTooltipShow);
            tooltipContentElement.classList.add(classNames.materialTooltipHide);
            this.firstHandle.style.cursor = '-webkit-grab';
            this.firstHandle.style.cursor = 'grab';
            this.materialHandle.style.transform = 'scale(1)';
            this.tooltipElement.classList.remove(classNames.materialTooltipOpen);
            this.setTooltipTransform();
            this.tooltipTarget = undefined;
            setTimeout(() => { this.tooltipElement.style.transition = 'none'; }, 2500);
        }
    }

    private checkTooltipPosition(args: TooltipEventArgs): void {
        if (this.tooltipCollidedPosition === undefined ||
            this.tooltipCollidedPosition !== args.collidedPosition) {
            if (this.isMaterialTooltip) {
                let tooltipClass: string = this.tooltipPositionCalculation(args.collidedPosition);
                args.element.classList.remove(this.previousTooltipClass);
                args.element.classList.add(tooltipClass);
                this.previousTooltipClass = tooltipClass;
                if (args.element.style.transform && args.element.classList.contains(classNames.materialTooltipOpen) &&
                    (args.element.firstElementChild as HTMLElement).innerText.length <= 4) {
                    args.element.style.transform = this.getTooltipTransformProperties(this.previousTooltipClass).rotate;
                }
            }
            this.tooltipCollidedPosition = args.collidedPosition;
        }
        if (this.isMaterialTooltip && this.tooltipElement && this.tooltipElement.style.transform.indexOf('translate') !== -1) {
            this.setTooltipTransform();
        }
    }

    private setTooltipTransform(): void {
        let transformProperties: { [key: string]: string } = this.getTooltipTransformProperties(this.previousTooltipClass);
        if ((this.tooltipElement.firstElementChild as HTMLElement).innerText.length > 4) {
            this.tooltipElement.style.transform = `${transformProperties.translate} scale(0.01)`;
        } else {
            this.tooltipElement.style.transform = `${transformProperties.translate} ${transformProperties.rotate} scale(0.01)`;
        }
    }

    private renderTooltip(): void {
        this.tooltipObj = new Tooltip({
            showTipPointer: this.isBootstrap || this.isMaterial || this.isBootstrap4,
            cssClass: classNames.sliderTooltip,
            height: this.isMaterial ? 30 : 'auto',
            animation: { open: { effect: 'None' }, close: { effect: 'FadeOut', duration: 500 } },
            opensOn: 'Custom',
            beforeOpen: this.tooltipBeforeOpen.bind(this),
            beforeCollision: this.checkTooltipPosition.bind(this),
            beforeClose: this.tooltipBeforeClose.bind(this)
        });
        this.tooltipObj.appendTo(this.firstHandle);
        this.initializeTooltipProps();
    }

    private initializeTooltipProps(): void {
        let tooltipShowOn: string = this.isMaterialTooltip ? 'Always' : (this.tooltip.showOn === 'Auto' ? 'Hover' : this.tooltip.showOn);
        this.setProperties({ tooltip: { showOn: tooltipShowOn } }, true);
        this.tooltipObj.position = this.tooltipPlacement();
        this.tooltipCollision(this.tooltipObj.position);
        [this.firstHandle, this.rangeBar, this.secondHandle].forEach((handle: HTMLElement) => {
            if (!isNullOrUndefined(handle)) {
                handle.style.transition = 'none';
            }
        });
        if (this.isMaterialTooltip) {
            this.sliderContainer.classList.add(classNames.materialSlider);
            this.tooltipValue();
            this.tooltipObj.animation.close.effect = 'None';
            this.tooltipObj.open(this.firstHandle);
        }
    }
    private tooltipBeforeClose(): void {
        this.tooltipElement = undefined;
        this.tooltipCollidedPosition = undefined;
    }

    private setButtons(): void {
        this.firstBtn = this.createElement('div', { className: classNames.sliderButton + ' ' + classNames.firstButton });
        this.firstBtn.appendChild(this.createElement('span', { className: classNames.sliderButtonIcon }));
        this.firstBtn.tabIndex = -1;
        this.secondBtn = this.createElement('div', { className: classNames.sliderButton + ' ' + classNames.secondButton });
        this.secondBtn.appendChild(this.createElement('span', { className: classNames.sliderButtonIcon }));
        this.secondBtn.tabIndex = -1;
        this.sliderContainer.classList.add(classNames.sliderButtonClass);
        this.sliderContainer.appendChild(this.firstBtn);
        this.sliderContainer.appendChild(this.secondBtn);
        this.sliderContainer.appendChild(this.element);
        this.buttonTitle();
    }

    private buttonTitle(): void {
        let enabledRTL: boolean = this.enableRtl && this.orientation !== 'Vertical';
        this.l10n.setLocale(this.locale);
        let decrementTitle: string = this.l10n.getConstant('decrementTitle');
        let incrementTitle: string = this.l10n.getConstant('incrementTitle');
        attributes(enabledRTL ? this.secondBtn : this.firstBtn, { 'aria-label': decrementTitle, title: decrementTitle });
        attributes(enabledRTL ? this.firstBtn : this.secondBtn, { 'aria-label': incrementTitle, title: incrementTitle });
    }

    private buttonFocusOut(): void {
        if (this.isMaterial) {
            this.getHandle().classList.remove('e-large-thumb-size');
        }
    }
    private repeatButton(args: MouseEvent): void {
        let hVal: number = this.handleValueUpdate();
        let enabledRTL: boolean = this.enableRtl && this.orientation !== 'Vertical';
        let value: number;
        if ((<HTMLElement>args.target).parentElement.classList.contains(classNames.firstButton)
            || (<HTMLElement>args.target).classList.contains(classNames.firstButton)) {
            enabledRTL ? (value = this.add(hVal, parseFloat(this.step.toString()), true)) :
                (value = this.add(hVal, parseFloat(this.step.toString()), false));
        } else if ((<HTMLElement>args.target).parentElement.classList.contains(classNames.secondButton)
            || ((<HTMLElement>args.target).classList.contains(classNames.secondButton))) {
            enabledRTL ? (value = this.add(hVal, parseFloat(this.step.toString()), false)) :
                (value = this.add(hVal, parseFloat(this.step.toString()), true));
        }
        if (this.limits.enabled) {
            value = this.getLimitCorrectedValues(value);
        }
        if (value >= this.min && value <= this.max) {
            this.changeHandleValue(value);
            this.tooltipToggle(this.getHandle());
        }
    }

    private repeatHandlerMouse(args: MouseEvent): void {
        args.preventDefault();
        if (args.type === ('mousedown') || args.type === ('touchstart')) {
            this.buttonClick(args);
            this.repeatInterval = setInterval(this.repeatButton.bind(this), 180, args);
        }
    }

    private materialChange(): void {
        if (!this.getHandle().classList.contains('e-large-thumb-size')) {
            this.getHandle().classList.add('e-large-thumb-size');
        }
    }
    private repeatHandlerUp(e: MouseEvent): void {
        this.changeEvent('changed');
        this.closeTooltip();
        clearInterval(this.repeatInterval);
        this.getHandle().focus();

    }

    private customTickCounter(bigNum: number): number {
        let tickCount: number = 4;
        if (!isNullOrUndefined(this.customValues) && this.customValues.length > 0) {
            if (bigNum > 4) {
                tickCount = 3;
            }
            if (bigNum > 7) {
                tickCount = 2;
            }
            if (bigNum > 14) {
                tickCount = 1;
            }
            if (bigNum > 28) {
                tickCount = 0;
            }
        }
        return tickCount;
    }

    // tslint:disable-next-line:max-func-body-length
    private renderScale(): void {
        let orien: string = this.orientation === 'Vertical' ? 'v' : 'h';
        let spanText: number;
        this.noOfDecimals = this.numberOfDecimals(this.step);
        this.ul = this.createElement('ul', {
            className: classNames.scale + ' ' + 'e-' + orien + '-scale ' + classNames.tick + '-' + this.ticks.placement.toLowerCase(),
            attrs: { role: 'presentation', tabIndex: '-1', 'aria-hidden': 'true' }
        });
        this.ul.style.zIndex = '-1';
        if (Browser.isAndroid && orien === 'h') {
            this.ul.classList.add(classNames.sliderTickPosition);
        }
        let smallStep: number = this.ticks.smallStep;
        if (!this.ticks.showSmallTicks) {
            this.ticks.largeStep > 0 ? (smallStep = this.ticks.largeStep) :
                (smallStep = (parseFloat(formatUnit(this.max))) - (parseFloat(formatUnit(this.min))));
        } else if (smallStep <= 0) {
            smallStep = parseFloat(formatUnit(this.step));
        }
        let min: number = this.fractionalToInteger(<number>this.min);
        let max: number = this.fractionalToInteger(<number>this.max);
        let steps: number = this.fractionalToInteger(<number>smallStep);
        let bigNum: number = !isNullOrUndefined(this.customValues) && this.customValues.length > 0 && this.customValues.length - 1;
        let customStep: number = this.customTickCounter(bigNum);
        let count: number = !isNullOrUndefined(this.customValues) && this.customValues.length > 0 ?
            (bigNum * customStep) + bigNum : Math.abs((max - min) / steps);
        this.element.appendChild(this.ul);
        let li: HTMLElement; let start: number = parseFloat(this.min.toString());
        if (orien === 'v') { start = parseFloat(this.max.toString()); }
        let left: number = 0;
        let islargeTick: boolean;
        let tickWidth: number = 100 / count;
        if (tickWidth === Infinity) {
            tickWidth = 5;
        }
        for (let i: number = 0, y: number = !isNullOrUndefined(this.customValues) && this.customValues.length > 0 ?
            this.customValues.length - 1 : 0, k: number = 0; i <= count; i++) {
            li = (this.createElement('li', {
                attrs: {
                    class: classNames.tick, role: 'presentation', tabIndex: '-1',
                    'aria-hidden': 'true'
                }
            }));
            if (!isNullOrUndefined(this.customValues) && this.customValues.length > 0) {
                islargeTick = i % (customStep + 1) === 0;
                if (islargeTick) {
                    if (orien === 'h') {
                        start = <number>this.customValues[k];
                        k++;
                    } else {
                        start = <number>this.customValues[y];
                        y--;
                    }
                    li.setAttribute('title', start.toString());
                }
            } else {
                li.setAttribute('title', start.toString());
                if (this.numberOfDecimals(this.max) === 0 && this.numberOfDecimals(this.min) === 0 &&
                    this.numberOfDecimals(this.step) === 0) {
                    if (orien === 'h') {
                        islargeTick = ((start - parseFloat(this.min.toString())) % this.ticks.largeStep === 0) ? true : false;
                    } else {
                        islargeTick = (Math.abs(start - parseFloat(this.max.toString())) % this.ticks.largeStep === 0) ? true : false;
                    }
                } else {
                    let largestep: number = this.fractionalToInteger(<number>this.ticks.largeStep);
                    let startValue: number = this.fractionalToInteger(<number>start);
                    if (orien === 'h') {
                        islargeTick = ((startValue - min) % largestep === 0) ? true : false;
                    } else {
                        islargeTick = (Math.abs(startValue - parseFloat(max.toString())) % largestep === 0) ? true : false;
                    }
                }
            }
            if (islargeTick) {
                li.classList.add(classNames.large);
            }
            (orien === 'h') ? (li.style.width = tickWidth + '%') : (li.style.height = tickWidth + '%');
            let repeat: number = islargeTick ? (this.ticks.placement === 'Both' ? 2 : 1) : 0;
            if (islargeTick) {
                for (let j: number = 0; j < repeat; j++) {
                    this.createTick(li, start, tickWidth);
                }
            } else if (isNullOrUndefined(this.customValues)) {
                this.formatTicksValue(li, start);
            }
            this.ul.appendChild(li);
            this.tickElementCollection.push(li);
            let decimalPoints: number;
            if (isNullOrUndefined(this.customValues)) {
                if (this.numberOfDecimals(smallStep) > this.numberOfDecimals(start)) {
                    decimalPoints = this.numberOfDecimals(smallStep);
                } else {
                    decimalPoints = this.numberOfDecimals(start);
                }
                if (orien === 'h') {
                    start = this.makeRoundNumber(start + smallStep, decimalPoints);
                } else {
                    start = this.makeRoundNumber(start - smallStep, decimalPoints);
                }
                left = this.makeRoundNumber(left + smallStep, decimalPoints);
            }
        }
        this.ticksAlignment(orien, tickWidth);
    }

    private ticksAlignment(orien: string, tickWidth: number, triggerEvent: boolean = true): void {
        this.firstChild = this.ul.firstElementChild;
        this.lastChild = this.ul.lastElementChild;
        this.firstChild.classList.add(classNames.sliderFirstTick);
        this.lastChild.classList.add(classNames.sliderLastTick);
        this.sliderContainer.classList.add(classNames.scale + '-' + this.ticks.placement.toLowerCase());
        if (orien === 'h') {
            (this.firstChild as HTMLElement).style.width = tickWidth / 2 + '%';
            (this.lastChild as HTMLElement).style.width = tickWidth / 2 + '%';
        } else {
            (this.firstChild as HTMLElement).style.height = tickWidth / 2 + '%';
            (this.lastChild as HTMLElement).style.height = tickWidth / 2 + '%';
        }
        let eventArgs: SliderTickRenderedEventArgs = { ticksWrapper: this.ul, tickElements: this.tickElementCollection };
        if (triggerEvent) {
            this.trigger('renderedTicks', eventArgs);
        }
        this.scaleAlignment();
    }

    private createTick(li: HTMLElement, start: number | string, tickWidth: number): void {
        let span: HTMLElement = this.createElement('span', {
            className: classNames.tickValue + ' ' + classNames.tick + '-' + this.ticks.placement.toLowerCase(),
            attrs: { role: 'presentation', tabIndex: '-1', 'aria-hidden': 'true' }
        });
        li.appendChild(span);
        if (isNullOrUndefined(this.customValues)) {
            this.formatTicksValue(li, <number>start, span, tickWidth);
        } else {
            span.innerHTML = start.toString();
        }
    }

    private formatTicksValue(li: HTMLElement, start: number, spanElement?: HTMLElement, tickWidth?: number): void {
        const tickText: string = this.formatNumber(start);
        const text: string = !isNullOrUndefined(this.ticks) && !isNullOrUndefined(this.ticks.format) ?
            this.formatString(start, this.ticksFormatInfo).formatString : tickText;
        const eventArgs: SliderTickEventArgs = { value: start, text: text, tickElement: li };
        this.trigger('renderingTicks', eventArgs, (observedArgs: SliderTickEventArgs) => {
            li.setAttribute('title', observedArgs.text.toString());
            if (spanElement) {
                spanElement.innerHTML = observedArgs.text.toString();
            }
            if (!isNullOrUndefined(this.renderingTicks) && isBlazor()) {
                const orien: string = this.orientation === 'Horizontal' ? 'h' : 'v';
                this.ticksAlignment(orien, tickWidth, false);
            }
        });
    }

    private scaleAlignment(): void {
        this.tickValuePosition();
        let smallTick: number = 12;
        let largeTick: number = 20;
        let half: number = largeTick / 2;
        let orien: string = this.orientation === 'Vertical' ? 'v' : 'h';
        if (this.orientation === 'Vertical') {
            (this.element.getBoundingClientRect().width <= 15) ?
                this.sliderContainer.classList.add(classNames.sliderSmallSize) :
                this.sliderContainer.classList.remove(classNames.sliderSmallSize);
        } else {
            (this.element.getBoundingClientRect().height <= 15) ?
                this.sliderContainer.classList.add(classNames.sliderSmallSize) :
                this.sliderContainer.classList.remove(classNames.sliderSmallSize);
        }
    }

    private tickValuePosition(): void {
        let first: { width: number, height: number } = (this.firstChild as HTMLElement).getBoundingClientRect();
        let firstChild: { width: number, height: number };
        let smallStep: number = this.ticks.smallStep;
        let count: number = Math.abs((parseFloat(formatUnit(this.max))) - (parseFloat(formatUnit(this.min)))) / smallStep;
        if (this.firstChild.children.length > 0) {
            firstChild = (this.firstChild.children[0] as HTMLElement).getBoundingClientRect();
        }
        let tickElements: NodeListOf<Element>[] = [this.sliderContainer.querySelectorAll('.' + classNames.tick + '.' +
            classNames.large + ' .' + classNames.tickValue)];
        let other: NodeListOf<Element>;
        if (this.ticks.placement === 'Both') {
            other = [].slice.call(tickElements[0], 2);
        } else {
            other = [].slice.call(tickElements[0], 1);
        }
        let tickWidth: number = this.orientation === 'Vertical' ?
            (first.height * 2) : (first.width * 2);
        for (let i: number = 0; i < this.firstChild.children.length; i++) {
            if (this.orientation === 'Vertical') {
                (this.firstChild.children[i] as HTMLElement).style.top = -(firstChild.height / 2) + 'px';
            } else {
                if (!this.enableRtl) {
                    (this.firstChild.children[i] as HTMLElement).style.left = -(firstChild.width / 2) + 'px';
                } else {
                    (this.firstChild.children[i] as HTMLElement).style.left = (tickWidth -
                        this.firstChild.children[i].getBoundingClientRect().width) / 2 + 'px';
                }
            }
        }
        for (let i: number = 0; i < other.length; i++) {
            let otherChild: { width: number, height: number } = (other[i] as HTMLElement).getBoundingClientRect();
            if (this.orientation === 'Vertical') {
                setStyleAttribute(other[i] as HTMLElement, { top: (tickWidth - otherChild.height) / 2 + 'px' });
            } else {
                setStyleAttribute(other[i] as HTMLElement, { left: (tickWidth - otherChild.width) / 2 + 'px' });
            }
        }
        if (this.enableRtl && this.lastChild.children.length && count !== 0) {
            (this.lastChild.children[0] as HTMLElement).style.left = -(this.lastChild.getBoundingClientRect().width / 2) + 'px';
            if (this.ticks.placement === 'Both') {
                (this.lastChild.children[1] as HTMLElement).style.left = -(this.lastChild.getBoundingClientRect().width / 2) + 'px';
            }
        }
        if (count === 0) {
            if (this.orientation === 'Horizontal') {
                if (!this.enableRtl) {
                    (this.firstChild as HTMLElement).classList.remove(classNames.sliderLastTick);
                    (this.firstChild as HTMLElement).style.left = this.firstHandle.style.left;
                } else {
                    (this.firstChild as HTMLElement).classList.remove(classNames.sliderLastTick);
                    (this.firstChild as HTMLElement).style.right = this.firstHandle.style.right;
                    (this.firstChild.children[0] as HTMLElement).style.left =
                        (this.firstChild.getBoundingClientRect().width / 2) + 2 + 'px';
                    if (this.ticks.placement === 'Both') {
                        (this.firstChild.children[1] as HTMLElement).style.left =
                            (this.firstChild.getBoundingClientRect().width / 2) + 2 + 'px';
                    }
                }
            }
            if (this.orientation === 'Vertical') {
                (this.firstChild as HTMLElement).classList.remove(classNames.sliderLastTick);
            }
        }
    }

    private setAriaAttrValue(element: Element): void {
        let ariaValueText: string[];
        let isTickFormatted: boolean = ((!isNullOrUndefined(this.ticks) && !isNullOrUndefined(this.ticks.format))) ? true : false;
        let text: string = !isTickFormatted ?
            this.formatContent(this.ticksFormatInfo, false) : this.formatContent(this.tooltipFormatInfo, false);
        let valuenow: string = isTickFormatted ? this.formatContent(this.ticksFormatInfo, true) :
            this.formatContent(this.tooltipFormatInfo, true);
        text = (!this.customAriaText) ? (text) : (this.customAriaText);
        if (text.split(' - ').length === 2) {
            ariaValueText = text.split(' - ');
        } else {
            ariaValueText = [text, text];
        }
        this.setAriaAttributes(element);
        if (this.type !== 'Range') {
            attributes(element, { 'aria-valuenow': valuenow, 'aria-valuetext': text });
        } else {
            (!this.enableRtl) ? ((element === this.firstHandle) ?
                attributes(element, { 'aria-valuenow': valuenow.split(' - ')[0], 'aria-valuetext': ariaValueText[0] }) :
                attributes(element, { 'aria-valuenow': valuenow.split(' - ')[1], 'aria-valuetext': ariaValueText[1] })) :
                ((element === this.firstHandle) ?
                    attributes(element, { 'aria-valuenow': valuenow.split(' - ')[1], 'aria-valuetext': ariaValueText[1] }) :
                    attributes(element, { 'aria-valuenow': valuenow.split(' - ')[0], 'aria-valuetext': ariaValueText[0] }));
        }
    }


    private handleValueUpdate(): number {
        let hVal: number;
        if (this.type === 'Range') {
            if (this.activeHandle === 1) {
                hVal = this.handleVal1;
            } else {
                hVal = this.handleVal2;
            }
        } else {
            hVal = this.handleVal1;
        }
        return hVal;
    }

    private getLimitCorrectedValues(value: number): number {
        if (this.type === 'MinRange' || this.type === 'Default') {
            value = (this.getLimitValueAndPosition(value, this.limits.minStart, this.limits.minEnd))[0];
        } else {
            if (this.activeHandle === 1) {
                value = (this.getLimitValueAndPosition(value, this.limits.minStart, this.limits.minEnd))[0];
            } else {
                value = (this.getLimitValueAndPosition(value, this.limits.maxStart, this.limits.maxEnd))[0];
            }
        }
        return value;
    }

    private focusSliderElement(): void {
        if (!this.isElementFocused) {
            this.element.focus();
            this.isElementFocused = true;
        }
    }
    private buttonClick(args: KeyboardEvent | MouseEvent): void {
        this.focusSliderElement();
        let value: number;
        let enabledRTL: boolean = this.enableRtl && this.orientation !== 'Vertical';
        let hVal: number = this.handleValueUpdate();
        if (((<KeyboardEvent>args).keyCode === 40) || ((<KeyboardEvent>args).keyCode === 37)
            || (args.currentTarget as HTMLElement).classList.contains(classNames.firstButton)) {
            enabledRTL ? (value = this.add(hVal, parseFloat(this.step.toString()), true)) :
                (value = this.add(hVal, parseFloat(this.step.toString()), false));
        } else if (((<KeyboardEvent>args).keyCode === 38) || ((<KeyboardEvent>args).keyCode === 39) ||
            (args.currentTarget as HTMLElement).classList.contains(classNames.secondButton)) {
            enabledRTL ? (value = this.add(hVal, parseFloat(this.step.toString()), false)) :
                (value = this.add(hVal, parseFloat(this.step.toString()), true));
        } else if (((<KeyboardEvent>args).keyCode === 33
            || (args.currentTarget as HTMLElement).classList.contains(classNames.firstButton))) {
            enabledRTL ? (value = this.add(hVal, parseFloat(this.ticks.largeStep.toString()), false)) :
                (value = this.add(hVal, parseFloat(this.ticks.largeStep.toString()), true));
        } else if (((<KeyboardEvent>args).keyCode === 34) ||
            (args.currentTarget as HTMLElement).classList.contains(classNames.secondButton)) {
            enabledRTL ? (value = this.add(hVal, parseFloat(this.ticks.largeStep.toString()), true)) :
                (value = this.add(hVal, parseFloat(this.ticks.largeStep.toString()), false));
        } else if (((<KeyboardEvent>args).keyCode === 36)) {
            value = parseFloat(this.min.toString());

        } else if (((<KeyboardEvent>args).keyCode === 35)) {
            value = parseFloat(this.max.toString());
        }
        if (this.limits.enabled) {
            value = this.getLimitCorrectedValues(value);
        }
        this.changeHandleValue(value);
        if (this.isMaterial && !this.tooltip.isVisible &&
            !(this.getHandle() as HTMLElement).classList.contains(classNames.sliderTabHandle)) {
            this.materialChange();
        }
        this.tooltipToggle(this.getHandle());
        this.getHandle().focus();
        if ((args.currentTarget as HTMLElement).classList.contains(classNames.firstButton)) {
            EventHandler.add(this.firstBtn, 'mouseup touchend', this.buttonUp, this);
        }
        if ((args.currentTarget as HTMLElement).classList.contains(classNames.secondButton)) {
            EventHandler.add(this.secondBtn, 'mouseup touchend', this.buttonUp, this);
        }
    }

    private tooltipToggle(target?: HTMLElement): void {
        if (this.isMaterialTooltip) {
            !this.tooltipElement.classList.contains(classNames.materialTooltipOpen) ?
                this.openMaterialTooltip() : this.refreshTooltip(this.firstHandle);
        } else {
            !this.tooltipElement ? this.openTooltip(target) : this.refreshTooltip(target);
        }

    }

    private buttonUp(args: KeyboardEvent | MouseEvent): void {
        if ((args.currentTarget as HTMLElement).classList.contains(classNames.firstButton)) {
            EventHandler.remove(this.firstBtn, 'mouseup touchend', this.buttonUp);
        }
        if ((args.currentTarget as HTMLElement).classList.contains(classNames.secondButton)) {
            EventHandler.remove(this.secondBtn, 'mouseup touchend', this.buttonUp);
        }
    }

    private setRangeBar(): void {
        if (this.orientation === 'Horizontal') {
            if (this.type === 'MinRange') {
                this.enableRtl ? (this.rangeBar.style.right = '0px') : (this.rangeBar.style.left = '0px');
                setStyleAttribute(this.rangeBar, { 'width': isNullOrUndefined(this.handlePos1) ? 0 : this.handlePos1 + 'px' });
            } else {
                this.enableRtl ? (this.rangeBar.style.right =
                    this.handlePos1 + 'px') : (this.rangeBar.style.left = this.handlePos1 + 'px');
                setStyleAttribute(this.rangeBar, { 'width': this.handlePos2 - this.handlePos1 + 'px' });
            }
        } else {
            if (this.type === 'MinRange') {
                this.rangeBar.style.bottom = '0px';
                setStyleAttribute(this.rangeBar, { 'height': isNullOrUndefined(this.handlePos1) ? 0 : this.handlePos1 + 'px' });
            } else {
                this.rangeBar.style.bottom = this.handlePos1 + 'px';
                setStyleAttribute(this.rangeBar, { 'height': this.handlePos2 - this.handlePos1 + 'px' });
            }
        }
    }

    private checkValidValueAndPos(value: number): number {
        value = this.checkHandleValue(value);
        value = this.checkHandlePosition(value);
        return value;
    }

    private setLimitBarPositions(fromMinPostion: number, fromMaxpostion: number, toMinPostion?: number, toMaxpostion?: number): void {
        if (this.orientation === 'Horizontal') {
            if (!this.enableRtl) {
                this.limitBarFirst.style.left = fromMinPostion + 'px';
                this.limitBarFirst.style.width = (fromMaxpostion - fromMinPostion) + 'px';
            } else {
                this.limitBarFirst.style.right = fromMinPostion + 'px';
                this.limitBarFirst.style.width = (fromMaxpostion - fromMinPostion) + 'px';
            }
        } else {
            this.limitBarFirst.style.bottom = fromMinPostion + 'px';
            this.limitBarFirst.style.height = (fromMaxpostion - fromMinPostion) + 'px';
        }
        if (this.type === 'Range') {
            if (this.orientation === 'Horizontal') {
                if (!this.enableRtl) {
                    this.limitBarSecond.style.left = toMinPostion + 'px';
                    this.limitBarSecond.style.width = (toMaxpostion - toMinPostion) + 'px';
                } else {
                    this.limitBarSecond.style.right = toMinPostion + 'px';
                    this.limitBarSecond.style.width = (toMaxpostion - toMinPostion) + 'px';
                }
            } else {
                this.limitBarSecond.style.bottom = toMinPostion + 'px';
                this.limitBarSecond.style.height = (toMaxpostion - toMinPostion) + 'px';
            }
        }
    }

    private setLimitBar(): void {
        if (this.type === 'Default' || this.type === 'MinRange') {
            let fromPosition: number =
                (this.getLimitValueAndPosition(this.limits.minStart, this.limits.minStart, this.limits.minEnd, true))[0];
            fromPosition = this.checkValidValueAndPos(fromPosition);
            let toPosition: number = (this.getLimitValueAndPosition(this.limits.minEnd, this.limits.minStart, this.limits.minEnd, true))[0];
            toPosition = this.checkValidValueAndPos(toPosition);
            this.setLimitBarPositions(fromPosition, toPosition);
        } else if (this.type === 'Range') {
            let fromMinPostion: number =
                (this.getLimitValueAndPosition(this.limits.minStart, this.limits.minStart, this.limits.minEnd, true))[0];
            fromMinPostion = this.checkValidValueAndPos(fromMinPostion);
            let fromMaxpostion: number =
                (this.getLimitValueAndPosition(this.limits.minEnd, this.limits.minStart, this.limits.minEnd, true))[0];
            fromMaxpostion = this.checkValidValueAndPos(fromMaxpostion);
            let toMinPostion: number =
                (this.getLimitValueAndPosition(this.limits.maxStart, this.limits.maxStart, this.limits.maxEnd, true))[0];
            toMinPostion = this.checkValidValueAndPos(toMinPostion);
            let toMaxpostion: number =
                (this.getLimitValueAndPosition(this.limits.maxEnd, this.limits.maxStart, this.limits.maxEnd, true))[0];
            toMaxpostion = this.checkValidValueAndPos(toMaxpostion);

            this.setLimitBarPositions(fromMinPostion, fromMaxpostion, toMinPostion, toMaxpostion);
        }
    }

    private getLimitValueAndPosition(currentValue: number, minValue: number, maxValue: number, limitBar?: boolean): number[] {
        if (isNullOrUndefined(minValue)) {
            minValue = this.min;
            if (isNullOrUndefined(currentValue) && limitBar) {
                currentValue = minValue;
            }
        }
        if (isNullOrUndefined(maxValue)) {
            maxValue = this.max;
            if (isNullOrUndefined(currentValue) && limitBar) {
                currentValue = maxValue;
            }
        }
        if (currentValue < minValue) {
            currentValue = minValue;
        }
        if (currentValue > maxValue) {
            currentValue = maxValue;
        }
        return [currentValue, this.checkHandlePosition(currentValue)];
    }

    private setValue(): void {
        if (!isNullOrUndefined(this.customValues) && this.customValues.length > 0) {
            this.min = 0;
            this.max = this.customValues.length - 1;
            this.setBarColor();
        }
        this.setAriaAttributes(this.firstHandle);
        this.handleVal1 = isNullOrUndefined(this.value) ? this.checkHandleValue(parseFloat(this.min.toString())) :
            this.checkHandleValue(parseFloat(this.value.toString()));
        this.handlePos1 = this.checkHandlePosition(this.handleVal1);
        this.preHandlePos1 = this.handlePos1;
        isNullOrUndefined(this.activeHandle) ? (this.type === 'Range' ? this.activeHandle = 2 : this.activeHandle = 1) :
            this.activeHandle = this.activeHandle;
        if (this.type === 'Default' || this.type === 'MinRange') {
            if (this.limits.enabled) {
                let values: number[] = this.getLimitValueAndPosition(this.handleVal1, this.limits.minStart, this.limits.minEnd);
                this.handleVal1 = values[0];
                this.handlePos1 = values[1];
                this.preHandlePos1 = this.handlePos1;
            }
            this.setHandlePosition();
            this.handleStart();
            this.value = this.handleVal1;
            this.setAriaAttrValue(this.firstHandle);
            this.changeEvent('changed');
        } else {
            this.validateRangeValue();
        }
        if (this.type !== 'Default') {
            this.setRangeBar();
        }
        if (this.limits.enabled) {
            this.setLimitBar();
        }
    }

    private rangeValueUpdate(): void {
        if (this.value === null || typeof (this.value) !== 'object') {
            this.value = [parseFloat(formatUnit(this.min)), parseFloat(formatUnit(this.max))];
        }
    }

    private validateRangeValue(): void {
        this.rangeValueUpdate();
        this.setRangeValue();
    }

    private modifyZindex(): void {
        if (this.type === 'Range') {
            if (this.activeHandle === 1) {
                this.firstHandle.style.zIndex = (this.zIndex + 4) + '';
                this.secondHandle.style.zIndex = (this.zIndex + 3) + '';
            } else {
                this.firstHandle.style.zIndex = (this.zIndex + 3) + '';
                this.secondHandle.style.zIndex = (this.zIndex + 4) + '';
            }
        } else if (this.isMaterialTooltip && this.tooltipElement) {
            this.tooltipElement.style.zIndex = (this.zIndex + 4) + '';
        }
    }

    private setHandlePosition(): void {
        let handle: HTMLElement[];
        let pos: number = (this.activeHandle === 1) ? this.handlePos1 : this.handlePos2;
        if (this.isMaterialTooltip) {
            handle = [this.firstHandle, this.materialHandle];
        } else {
            handle = [this.getHandle()];
        }
        this.handleStart();
        handle.forEach((handle: HTMLElement) => {
            if (this.orientation === 'Horizontal') {
                this.enableRtl ? (handle.style.right =
                    `${pos}px`) : (handle.style.left = `${pos}px`);
            } else {
                handle.style.bottom = `${pos}px`;
            }
        });
        this.changeEvent('change');
    }

    private getHandle(): HTMLElement {
        return (this.activeHandle === 1) ? this.firstHandle : this.secondHandle;
    }

    private setRangeValue(): void {
        this.updateRangeValue();
        this.activeHandle = 1;
        this.setHandlePosition();
        this.activeHandle = 2;
        this.setHandlePosition();
        this.activeHandle = 1;
    }

    private changeEvent(eventName: string): void {
        let previous: number | number[] = eventName === 'change' ? this.previousVal : this.previousChanged;
        if (this.type !== 'Range') {
            this.setProperties({ 'value': this.handleVal1 }, true);
            if (previous !== this.value) {
                this.trigger(eventName, this.changeEventArgs(eventName));
                this.setPreviousVal(eventName, this.value);
            }
            this.setAriaAttrValue(this.firstHandle);
        } else {
            let value: number | number[] = this.value = [this.handleVal1, this.handleVal2];
            this.setProperties({ 'value': value }, true);
            if ((<number[]>previous).length === (<number[]>this.value).length
                && (this.value as number[])[0] !== (<number[]>previous)[0] || (this.value as number[])[1] !== (<number[]>previous)[1]
            ) {
                this.trigger(eventName, this.changeEventArgs(eventName));
                this.setPreviousVal(eventName, this.value);
            }
            this.setAriaAttrValue(this.getHandle());
        }
        this.hiddenInput.value = this.value.toString();
    }

    private changeEventArgs(eventName: string): SliderChangeEventArgs {
        let eventArgs: SliderChangeEventArgs;
        if (this.tooltip.isVisible && this.tooltipObj) {
            this.tooltipValue();
            eventArgs = {
                value: this.value,
                previousValue: eventName === 'change' ? this.previousVal : this.previousChanged,
                action: eventName, text: <string>this.tooltipObj.content
            };
        } else {
            eventArgs = {
                value: this.value,
                previousValue: eventName === 'change' ? this.previousVal : this.previousChanged,
                action: eventName, text: isNullOrUndefined(this.ticksFormatInfo.format) ? this.value.toString() :
                    (this.type !== 'Range' ? this.formatString(this.value as number, this.ticksFormatInfo).formatString :
                        (this.formatString((this.value as number[])[0], this.ticksFormatInfo).formatString + ' - ' +
                            this.formatString((this.value as number[])[1], this.ticksFormatInfo).formatString))
            };
        }
        return eventArgs;
    }

    private setPreviousVal(eventName: string, value: number | number[]): void {
        if (eventName === 'change') {
            this.previousVal = value;
        } else {
            this.previousChanged = value;
        }
    }

    private updateRangeValue(): void {
        let values: number[] = this.value.toString().split(',').map(Number);
        if ((this.enableRtl && this.orientation !== 'Vertical') || this.rtl) {
            this.value = [values[1], values[0]];
        } else {
            this.value = [values[0], values[1]];
        }
        if (this.enableRtl && this.orientation !== 'Vertical') {
            this.handleVal1 = this.checkHandleValue(this.value[1]);
            this.handleVal2 = this.checkHandleValue(this.value[0]);
        } else {
            this.handleVal1 = this.checkHandleValue(this.value[0]);
            this.handleVal2 = this.checkHandleValue(this.value[1]);
        }
        this.handlePos1 = this.checkHandlePosition(this.handleVal1);
        this.handlePos2 = this.checkHandlePosition(this.handleVal2);

        if (this.handlePos1 > this.handlePos2) {
            this.handlePos1 = this.handlePos2;
            this.handleVal1 = this.handleVal2;
        }
        this.preHandlePos1 = this.handlePos1;
        this.preHandlePos2 = this.handlePos2;

        if (this.limits.enabled) {
            this.activeHandle = 1;
            let values: number[] = this.getLimitValueAndPosition(this.handleVal1, this.limits.minStart, this.limits.minEnd);
            this.handleVal1 = values[0];
            this.handlePos1 = values[1];
            this.preHandlePos1 = this.handlePos1;

            this.activeHandle = 2;
            values = this.getLimitValueAndPosition(this.handleVal2, this.limits.maxStart, this.limits.maxEnd);
            this.handleVal2 = values[0];
            this.handlePos2 = values[1];
            this.preHandlePos2 = this.handlePos2;
        }
    }

    private checkHandlePosition(value: number): number {
        let pos: number;
        value = (100 *
            (value - (parseFloat(formatUnit(this.min))))) / ((parseFloat(formatUnit(this.max))) - (parseFloat(formatUnit(this.min))));

        if (this.orientation === 'Horizontal') {
            pos = this.element.getBoundingClientRect().width * (value / 100);
        } else {
            pos = this.element.getBoundingClientRect().height * (value / 100);
        }
        if (((parseFloat(formatUnit(this.max))) === (parseFloat(formatUnit(this.min))))) {
            if (this.orientation === 'Horizontal') {
                pos = this.element.getBoundingClientRect().width;
            } else {
                pos = this.element.getBoundingClientRect().height;
            }
        }
        return pos;

    }

    private checkHandleValue(value: number): number {
        if (this.min > this.max) {
            this.min = this.max;
        }
        if (this.min === this.max) {
            return (parseFloat(formatUnit(this.max)));
        }
        let handle: { [key: string]: Object } = this.tempStartEnd() as { [key: string]: Object };
        if (value < handle.start) {
            value = handle.start as number;
        } else if (value > handle.end) { value = handle.end as number; }
        return value;
    }

    /**
     * It is used to reposition slider.
     * @returns void
     */
    public reposition(): void {
        this.firstHandle.style.transition = 'none';
        if (this.type !== 'Default') {
            this.rangeBar.style.transition = 'none';
        }
        if (this.type === 'Range') {
            this.secondHandle.style.transition = 'none';
        }
        this.handlePos1 = this.checkHandlePosition(this.handleVal1);
        if (this.handleVal2) {
            this.handlePos2 = this.checkHandlePosition(this.handleVal2);
        }
        if (this.orientation === 'Horizontal') {
            this.enableRtl ? this.firstHandle.style.right =
                `${this.handlePos1}px` : this.firstHandle.style.left = `${this.handlePos1}px`;
            if (this.isMaterialTooltip) {
                this.enableRtl ? this.materialHandle.style.right =
                    `${this.handlePos1}px` : this.materialHandle.style.left = `${this.handlePos1}px`;
            }
            if (this.type === 'MinRange') {
                this.enableRtl ? (this.rangeBar.style.right = '0px') : (this.rangeBar.style.left = '0px');
                setStyleAttribute(this.rangeBar, { 'width': isNullOrUndefined(this.handlePos1) ? 0 : this.handlePos1 + 'px' });
            } else if (this.type === 'Range') {
                this.enableRtl ? this.secondHandle.style.right =
                    `${this.handlePos2}px` : this.secondHandle.style.left = `${this.handlePos2}px`;
                this.enableRtl ? (this.rangeBar.style.right =
                    this.handlePos1 + 'px') : (this.rangeBar.style.left = this.handlePos1 + 'px');
                setStyleAttribute(this.rangeBar, { 'width': this.handlePos2 - this.handlePos1 + 'px' });
            }
        } else {
            this.firstHandle.style.bottom = `${this.handlePos1}px`;
            if (this.isMaterialTooltip) {
                this.materialHandle.style.bottom = `${this.handlePos1}px`;
            }
            if (this.type === 'MinRange') {
                this.rangeBar.style.bottom = '0px';
                setStyleAttribute(this.rangeBar, { 'height': isNullOrUndefined(this.handlePos1) ? 0 : this.handlePos1 + 'px' });
            } else if (this.type === 'Range') {
                this.secondHandle.style.bottom = `${this.handlePos2}px`;
                this.rangeBar.style.bottom = this.handlePos1 + 'px';
                setStyleAttribute(this.rangeBar, { 'height': this.handlePos2 - this.handlePos1 + 'px' });
            }
        }
        if (this.limits.enabled) {
            this.setLimitBar();
        }
        if (this.ticks.placement !== 'None' && this.ul) {
            this.removeElement(this.ul);
            this.ul = undefined;
            this.renderScale();
        }
        this.handleStart();
        if (!this.tooltip.isVisible) {
            setTimeout(() => {
                this.firstHandle.style.transition = this.scaleTransform;
                if (this.type === 'Range') {
                    this.secondHandle.style.transition = this.scaleTransform;
                }
            });
        }
        this.refreshTooltip(this.tooltipTarget);
        this.setBarColor();
    }

    private changeHandleValue(value: number): void {
        let position: number = null;
        if (this.activeHandle === 1) {
            if (!(this.limits.enabled && this.limits.startHandleFixed)) {
                this.handleVal1 = this.checkHandleValue(value);
                this.handlePos1 = this.checkHandlePosition(this.handleVal1);

                if (this.type === 'Range' && this.handlePos1 > this.handlePos2) {
                    this.handlePos1 = this.handlePos2;
                    this.handleVal1 = this.handleVal2;
                }
                if (this.handlePos1 !== this.preHandlePos1) {
                    position = this.preHandlePos1 = this.handlePos1;
                }
            }
            this.modifyZindex();
        } else {
            if (!(this.limits.enabled && this.limits.endHandleFixed)) {
                this.handleVal2 = this.checkHandleValue(value);
                this.handlePos2 = this.checkHandlePosition(this.handleVal2);

                if (this.type === 'Range' && this.handlePos2 < this.handlePos1) {
                    this.handlePos2 = this.handlePos1;
                    this.handleVal2 = this.handleVal1;
                }
                if (this.handlePos2 !== this.preHandlePos2) {
                    position = this.preHandlePos2 = this.handlePos2;
                }
            }
            this.modifyZindex();
        }

        if (position !== null) {
            if (this.type !== 'Default') {
                this.setRangeBar();
            }
            this.setHandlePosition();
        }
    }

    private tempStartEnd(): Object {
        if (this.min > this.max) {
            return {
                start: this.max,
                end: this.min
            };
        } else {
            return {
                start: this.min,
                end: this.max
            };
        }
    }

    private xyToPosition(position: { [key: string]: Object }): number {
        let pos: number;
        if (this.min === this.max) {
            return 100;
        }
        if (this.orientation === 'Horizontal') {
            let left: number = position.x as number - this.element.getBoundingClientRect().left;
            let num: number = this.element.offsetWidth / 100;
            this.val = (left / num);
        } else {
            let top: number = position.y as number - this.element.getBoundingClientRect().top;
            let num: number = this.element.offsetHeight / 100;
            this.val = 100 - (top / num);
        }
        let val: number = this.stepValueCalculation(this.val);
        if (val < 0) {
            val = 0;
        } else if (val > 100) {
            val = 100;
        }
        if (this.enableRtl && this.orientation !== 'Vertical') {
            val = 100 - val;
        }
        if (this.orientation === 'Horizontal') {
            pos = this.element.getBoundingClientRect().width * (val / 100);
        } else {
            pos = this.element.getBoundingClientRect().height * (val / 100);
        }
        return pos;
    }

    private stepValueCalculation(value: number): number {
        if (this.step === 0) {
            this.step = 1;
        }
        let percentStep: number =
            (parseFloat(formatUnit(this.step))) / ((parseFloat(formatUnit(this.max)) - parseFloat(formatUnit(this.min))) / 100);
        let remain: number = value % Math.abs(percentStep);
        if (remain !== 0) {
            if ((percentStep / 2) > remain) {
                value -= remain;
            } else {
                value += Math.abs(percentStep) - remain;
            }
        }
        return value;
    }

    private add(a: number, b: number, addition: boolean): number {
        let precision: number;
        let x: number = Math.pow(10, precision || 3);
        let val: number;
        if (addition) {
            val = (Math.round(a * x) + Math.round(b * x)) / x;
        } else {
            val = (Math.round(a * x) - Math.round(b * x)) / x;
        }
        return val;
    }

    private positionToValue(pos: number): number {
        let val: number;
        let diff: number = parseFloat(formatUnit(this.max)) - parseFloat(formatUnit(this.min));
        if (this.orientation === 'Horizontal') {
            val = (pos / this.element.getBoundingClientRect().width) * diff;
        } else {
            val = (pos / this.element.getBoundingClientRect().height) * diff;
        }
        let total: number = this.add(val, parseFloat(this.min.toString()), true);
        return (total);
    }

    private sliderBarClick(evt: MouseEvent & TouchEvent): void {
        evt.preventDefault();
        let pos: { [key: string]: Object };
        if (evt.type === 'mousedown' || evt.type === 'click') {
            pos = { x: evt.clientX, y: evt.clientY };
        } else if (evt.type === 'touchstart') {
            pos = { x: evt.changedTouches[0].clientX, y: evt.changedTouches[0].clientY };
        }
        let handlepos: number = this.xyToPosition(pos);
        let handleVal: number = this.positionToValue(handlepos);
        if (this.type === 'Range' && (this.handlePos2 - handlepos) < (handlepos - this.handlePos1)) {
            this.activeHandle = 2;
            if (!(this.limits.enabled && this.limits.endHandleFixed)) {
                if (this.limits.enabled) {
                    let value: number[] = this.getLimitValueAndPosition(handleVal, this.limits.maxStart, this.limits.maxEnd);
                    handleVal = value[0];
                    handlepos = value[1];
                }
                this.secondHandle.classList.add(classNames.sliderActiveHandle);
                this.handlePos2 = this.preHandlePos2 = handlepos;
                this.handleVal2 = handleVal;
            }
            this.modifyZindex();
            this.secondHandle.focus();
        } else {
            this.activeHandle = 1;
            if (!(this.limits.enabled && this.limits.startHandleFixed)) {
                if (this.limits.enabled) {
                    let value: number[] = this.getLimitValueAndPosition(handleVal, this.limits.minStart, this.limits.minEnd);
                    handleVal = value[0];
                    handlepos = value[1];
                }
                this.firstHandle.classList.add(classNames.sliderActiveHandle);
                this.handlePos1 = this.preHandlePos1 = handlepos;
                this.handleVal1 = handleVal;
            }
            this.modifyZindex();
            this.firstHandle.focus();
        }
        if (this.isMaterialTooltip) {
            this.tooltipElement.classList.add(classNames.materialTooltipActive);
        }
        let focusedElement: Element = this.element.querySelector('.' + classNames.sliderTabHandle);
        if (focusedElement && this.getHandle() !== focusedElement) {
            focusedElement.classList.remove(classNames.sliderTabHandle);
        }
        let handle: HTMLElement = this.activeHandle === 1 ? this.firstHandle : this.secondHandle;
        if (evt.target === handle) {
            if (this.isMaterial && !this.tooltip.isVisible &&
                !(this.getHandle() as HTMLElement).classList.contains(classNames.sliderTabHandle)) {
                this.materialChange();
            }
            this.tooltipToggle(this.getHandle());
            return;
        }
        if (!this.checkRepeatedValue(handleVal)) {
            return;
        }
        let transition: { [key: string]: string } = this.isMaterial && this.tooltip.isVisible ?
            this.transitionOnMaterialTooltip : this.transition;
        this.getHandle().style.transition = transition.handle;
        if (this.type !== 'Default') {
            this.rangeBar.style.transition = transition.rangeBar;
        }
        this.setHandlePosition();
        if (this.type !== 'Default') {
            this.setRangeBar();
        }
    }

    private sliderDown(event: MouseEvent & TouchEvent): void {
        event.preventDefault();
        this.focusSliderElement();
        if (this.type === 'Range' && this.drag && event.target === this.rangeBar) {
            let xPostion: number; let yPostion: number;
            if (event.type === 'mousedown') {
                [xPostion, yPostion] = [event.clientX, event.clientY];
            } else if (event.type === 'touchstart') {
                [xPostion, yPostion] = [event.changedTouches[0].clientX, event.changedTouches[0].clientY];
            }
            if (this.orientation === 'Horizontal') {
                this.firstPartRemain = xPostion - this.rangeBar.getBoundingClientRect().left;
                this.secondPartRemain = this.rangeBar.getBoundingClientRect().right - xPostion;
            } else {
                this.firstPartRemain = yPostion - this.rangeBar.getBoundingClientRect().top;
                this.secondPartRemain = this.rangeBar.getBoundingClientRect().bottom - yPostion;
            }
            this.minDiff = this.handleVal2 - this.handleVal1;
            this.tooltipToggle(this.rangeBar);
            let focusedElement: Element = this.element.querySelector('.' + classNames.sliderTabHandle);
            if (focusedElement) {
                focusedElement.classList.remove(classNames.sliderTabHandle);
            }
            EventHandler.add(document, 'mousemove touchmove', this.dragRangeBarMove, this);
            EventHandler.add(document, 'mouseup touchend', this.dragRangeBarUp, this);
        } else {
            this.sliderBarClick(event);
            EventHandler.add(document, 'mousemove touchmove', this.sliderBarMove, this);
            EventHandler.add(document, 'mouseup touchend', this.sliderBarUp, this);
        }
    }

    private handleValueAdjust(handleValue: number, assignValue: number, handleNumber: SliderHandleNumber): void {
        if (handleNumber === 1) {
            this.handleVal1 = assignValue;
            this.handleVal2 = this.handleVal1 + this.minDiff;
        } else if (handleNumber === 2) {
            this.handleVal2 = assignValue;
            this.handleVal1 = this.handleVal2 - this.minDiff;
        }
        this.handlePos1 = this.checkHandlePosition(this.handleVal1);
        this.handlePos2 = this.checkHandlePosition(this.handleVal2);
    }

    private dragRangeBarMove(event: MouseEvent & TouchEvent): void {
        if (event.type !== 'touchmove') {
            event.preventDefault();
        }
        let pos: { [key: string]: number };
        this.rangeBar.style.transition = 'none';
        this.firstHandle.style.transition = 'none';
        this.secondHandle.style.transition = 'none';
        let xPostion: number; let yPostion: number;
        if (event.type === 'mousemove') {
            [xPostion, yPostion] = [event.clientX, event.clientY];
        } else {
            [xPostion, yPostion] = [event.changedTouches[0].clientX, event.changedTouches[0].clientY];
        }
        if (!(this.limits.enabled && this.limits.startHandleFixed) && !(this.limits.enabled && this.limits.endHandleFixed)) {
            if (!this.enableRtl) {
                pos = { x: xPostion - this.firstPartRemain, y: yPostion + this.secondPartRemain };
            } else {
                pos = { x: xPostion + this.secondPartRemain, y: yPostion + this.secondPartRemain };
            }
            this.handlePos1 = this.xyToPosition(pos);
            this.handleVal1 = this.positionToValue(this.handlePos1);
            if (!this.enableRtl) {
                pos = { x: xPostion + this.secondPartRemain, y: yPostion - this.firstPartRemain };
            } else {
                pos = { x: xPostion - this.firstPartRemain, y: yPostion - this.firstPartRemain };
            }
            this.handlePos2 = this.xyToPosition(pos);
            this.handleVal2 = this.positionToValue(this.handlePos2);
            if (this.limits.enabled) {
                let value: number[] = this.getLimitValueAndPosition(this.handleVal1, this.limits.minStart, this.limits.minEnd);
                this.handleVal1 = value[0];
                this.handlePos1 = value[1];
                if (this.handleVal1 === this.limits.minEnd) {
                    this.handleValueAdjust(this.handleVal1, this.limits.minEnd, 1);
                }
                if (this.handleVal1 === this.limits.minStart) {
                    this.handleValueAdjust(this.handleVal1, this.limits.minStart, 1);
                }
                value = this.getLimitValueAndPosition(this.handleVal2, this.limits.maxStart, this.limits.maxEnd);
                this.handleVal2 = value[0];
                this.handlePos2 = value[1];
                if (this.handleVal2 === this.limits.maxStart) {
                    this.handleValueAdjust(this.handleVal2, this.limits.maxStart, 2);
                }
                if (this.handleVal2 === this.limits.maxEnd) {
                    this.handleValueAdjust(this.handleVal2, this.limits.maxEnd, 2);
                }
            }
            if (this.handleVal2 === this.max) {
                this.handleValueAdjust(this.handleVal2, this.max, 2);
            }
            if (this.handleVal1 === this.min) {
                this.handleValueAdjust(this.handleVal1, this.min, 1);
            }
        }
        this.activeHandle = 1;
        this.setHandlePosition();
        this.activeHandle = 2;
        this.setHandlePosition();
        this.tooltipToggle(this.rangeBar);
        this.setRangeBar();
    }

    private sliderBarUp(): void {
        this.changeEvent('changed');
        this.handleFocusOut();
        this.firstHandle.classList.remove(classNames.sliderActiveHandle);
        if (this.type === 'Range') {
            this.secondHandle.classList.remove(classNames.sliderActiveHandle);
        }
        this.closeTooltip();
        if (this.isMaterial) {
            this.getHandle().classList.remove('e-large-thumb-size');
            if (this.isMaterialTooltip) {
                this.tooltipElement.classList.remove(classNames.materialTooltipActive);
            }
        }
        EventHandler.remove(document, 'mousemove touchmove', this.sliderBarMove);
        EventHandler.remove(document, 'mouseup touchend', this.sliderBarUp);
    }

    private sliderBarMove(evt: MouseEvent & TouchEvent): void {
        if (evt.type !== 'touchmove') {
            evt.preventDefault();
        }
        let pos: { [key: string]: Object };
        if (evt.type === 'mousemove') {
            pos = { x: evt.clientX, y: evt.clientY };
        } else {
            pos = { x: evt.changedTouches[0].clientX, y: evt.changedTouches[0].clientY };
        }
        let handlepos: number = this.xyToPosition(pos);
        let handleVal: number = this.positionToValue(handlepos);
        handlepos = Math.round(handlepos);
        if (this.type !== 'Range' && this.activeHandle === 1) {
            if (!(this.limits.enabled && this.limits.startHandleFixed)) {
                if (this.limits.enabled) {
                    let valueAndPostion: number[] = this.getLimitValueAndPosition(handleVal, this.limits.minStart, this.limits.minEnd);
                    handlepos = valueAndPostion[1];
                    handleVal = valueAndPostion[0];
                }
                this.handlePos1 = handlepos;
                this.handleVal1 = handleVal;
            }
            this.firstHandle.classList.add(classNames.sliderActiveHandle);
        }
        if (this.type === 'Range') {
            if (this.activeHandle === 1) {
                this.firstHandle.classList.add(classNames.sliderActiveHandle);
                if (!(this.limits.enabled && this.limits.startHandleFixed)) {
                    if (handlepos > this.handlePos2) {
                        handlepos = this.handlePos2;
                        handleVal = this.handleVal2;
                    }
                    if (handlepos !== this.preHandlePos1) {
                        if (this.limits.enabled) {
                            let value: number[] = this.getLimitValueAndPosition(handleVal, this.limits.minStart, this.limits.minEnd);
                            handleVal = value[0];
                            handlepos = value[1];
                        }
                        this.handlePos1 = this.preHandlePos1 = handlepos;
                        this.handleVal1 = handleVal;
                        this.activeHandle = 1;
                    }
                }
            } else if (this.activeHandle === 2) {
                this.secondHandle.classList.add(classNames.sliderActiveHandle);
                if (!(this.limits.enabled && this.limits.endHandleFixed)) {
                    if (handlepos < this.handlePos1) {
                        handlepos = this.handlePos1;
                        handleVal = this.handleVal1;
                    }
                    if (handlepos !== this.preHandlePos2) {
                        if (this.limits.enabled) {
                            let value: number[] = this.getLimitValueAndPosition(handleVal, this.limits.maxStart, this.limits.maxEnd);
                            handleVal = value[0];
                            handlepos = value[1];
                        }
                        this.handlePos2 = this.preHandlePos2 = handlepos;
                        this.handleVal2 = handleVal;
                        this.activeHandle = 2;
                    }
                }
            }
        }
        if (!this.checkRepeatedValue(handleVal)) {
            return;
        }
        this.getHandle().style.transition = this.scaleTransform;
        if (this.type !== 'Default') {
            this.rangeBar.style.transition = 'none';
        }
        this.setHandlePosition();
        if (this.isMaterial && !this.tooltip.isVisible &&
            !(this.getHandle() as HTMLElement).classList.contains(classNames.sliderTabHandle)) {
            this.materialChange();
        }
        this.tooltipToggle(this.getHandle());
        if (this.type !== 'Default') {
            this.setRangeBar();
        }
    }

    private dragRangeBarUp(event: MouseEvent & TouchEvent): void {
        this.changeEvent('changed');
        this.closeTooltip();
        EventHandler.remove(document, 'mousemove touchmove', this.dragRangeBarMove);
        EventHandler.remove(document, 'mouseup touchend', this.dragRangeBarUp);
    }

    private checkRepeatedValue(currentValue: number): number {
        if (this.type === 'Range') {
            let previousVal: number = this.enableRtl && this.orientation !== 'Vertical' ? (this.activeHandle === 1 ?
                (this.previousVal as number[])[1] : (this.previousVal as number[])[0]) :
                (this.activeHandle === 1 ? (this.previousVal as number[])[0] : (this.previousVal as number[])[1]);
            if (currentValue === previousVal) {
                return 0;
            }
        } else {
            if (currentValue === this.previousVal) {
                return 0;
            }
        }
        return 1;
    }
    private refreshTooltip(target: HTMLElement): void {
        if (this.tooltip.isVisible && this.tooltipObj) {
            this.tooltipValue();
            if (target) {
                this.tooltipObj.refresh(target);
                this.tooltipTarget = target;
            }
        }
    }

    private openTooltip(target?: HTMLElement): void {
        if (this.tooltip.isVisible && this.tooltipObj && !this.isMaterialTooltip) {
            this.tooltipValue();
            this.tooltipObj.open(target);
            this.tooltipTarget = target;
        }
    }

    private closeTooltip(): void {
        if (this.tooltip.isVisible && this.tooltipObj && this.tooltip.showOn !== 'Always' && !this.isMaterialTooltip) {
            this.tooltipValue();
            this.tooltipObj.close();
            this.tooltipTarget = undefined;
        }
    }

    private keyDown(event: KeyboardEvent): void {
        switch (event.keyCode) {
            case 37:
            case 38:
            case 39:
            case 40:
            case 33:
            case 34:
            case 36:
            case 35:
                event.preventDefault();
                this.buttonClick(event);
                break;
        }

    }

    private wireButtonEvt(destroy: boolean): void {
        if (!destroy) {
            EventHandler.add(this.firstBtn, 'mouseleave touchleave', this.buttonFocusOut, this);
            EventHandler.add(this.secondBtn, 'mouseleave touchleave', this.buttonFocusOut, this);
            EventHandler.add(this.firstBtn, 'mousedown touchstart', this.repeatHandlerMouse, this);
            EventHandler.add(this.firstBtn, 'mouseup mouseleave touchup touchend', this.repeatHandlerUp, this);
            EventHandler.add(this.secondBtn, 'mousedown touchstart', this.repeatHandlerMouse, this);
            EventHandler.add(this.secondBtn, 'mouseup mouseleave touchup touchend', this.repeatHandlerUp, this);
            EventHandler.add(this.firstBtn, 'focusout', this.sliderFocusOut, this);
            EventHandler.add(this.secondBtn, 'focusout', this.sliderFocusOut, this);

        } else {
            EventHandler.remove(this.firstBtn, 'mouseleave touchleave', this.buttonFocusOut);
            EventHandler.remove(this.secondBtn, 'mouseleave touchleave', this.buttonFocusOut);
            EventHandler.remove(this.firstBtn, 'mousedown touchstart', this.repeatHandlerMouse);
            EventHandler.remove(this.firstBtn, 'mouseup mouseleave touchup touchend', this.repeatHandlerUp);
            EventHandler.remove(this.secondBtn, 'mousedown touchstart', this.repeatHandlerMouse);
            EventHandler.remove(this.secondBtn, 'mouseup mouseleave touchup touchend', this.repeatHandlerUp);
            EventHandler.remove(this.firstBtn, 'focusout', this.sliderFocusOut);
            EventHandler.remove(this.secondBtn, 'focusout', this.sliderFocusOut);
        }
    }

    private wireEvents(): void {
        this.onresize = this.reposition.bind(this);
        window.addEventListener('resize', this.onresize);
        if (this.enabled && !this.readonly) {
            EventHandler.add(this.element, 'mousedown touchstart', this.sliderDown, this);
            EventHandler.add(this.sliderContainer, 'keydown', this.keyDown, this);
            EventHandler.add(this.sliderContainer, 'keyup', this.keyUp, this);
            EventHandler.add(this.element, 'focusout', this.sliderFocusOut, this);
            EventHandler.add(this.sliderContainer, 'mouseover mouseout touchstart touchend', this.hover, this);
            this.wireFirstHandleEvt(false);
            if (this.type === 'Range') {
                this.wireSecondHandleEvt(false);
            }
            if (this.showButtons) {
                this.wireButtonEvt(false);
            }
            this.wireMaterialTooltipEvent(false);
            if (this.isForm) {
                EventHandler.add(this.formElement, 'reset', this.formResetHandler, this);
            }
        }
    }

    private unwireEvents(): void {
        EventHandler.remove(this.element, 'mousedown touchstart', this.sliderDown);
        EventHandler.remove(this.sliderContainer, 'keydown', this.keyDown);
        EventHandler.remove(this.sliderContainer, 'keyup', this.keyUp);
        EventHandler.remove(this.element, 'focusout', this.sliderFocusOut);
        EventHandler.remove(this.sliderContainer, 'mouseover mouseout touchstart touchend', this.hover);
        this.wireFirstHandleEvt(true);
        if (this.type === 'Range') {
            this.wireSecondHandleEvt(true);
        }
        if (this.showButtons) {
            this.wireButtonEvt(true);
        }
        this.wireMaterialTooltipEvent(true);
        EventHandler.remove(this.element, 'reset', this.formResetHandler);
    }

    private formResetHandler(): void {
        this.setProperties({ 'value': this.formResetValue }, true);
        this.setValue();
    }

    private keyUp(event: KeyboardEvent): void {
        if (event.keyCode === 9 && (event.target as HTMLElement).classList.contains(classNames.sliderHandle)) {
            this.focusSliderElement();
            if (!(event.target as HTMLElement).classList.contains(classNames.sliderTabHandle)) {
                if (this.element.querySelector('.' + classNames.sliderTabHandle)) {
                    this.element.querySelector('.' + classNames.sliderTabHandle).classList.remove(classNames.sliderTabHandle);
                }
                (event.target as HTMLElement).classList.add(classNames.sliderTabHandle);
                let parentElement: HTMLElement = (event.target as HTMLElement).parentElement;
                if (parentElement === this.element) {
                    (parentElement.querySelector('.' + classNames.sliderTrack) as HTMLElement).classList.add(classNames.sliderTabTrack);
                    if (this.type === 'Range' || this.type === 'MinRange') {
                        (parentElement.querySelector('.' + classNames.rangeBar) as HTMLElement).classList.add(classNames.sliderTabRange);
                    }
                }
                if (this.type === 'Range') {
                    (((event.target as Element).previousSibling) as Element).classList.contains(classNames.sliderHandle) ?
                        this.activeHandle = 2 : this.activeHandle = 1;
                }
                this.getHandle().focus();
                this.tooltipToggle(this.getHandle());
            }
        }
        this.closeTooltip();
        this.changeEvent('changed');
    }

    private hover(event: MouseEvent): void {
        if (!isNullOrUndefined(event)) {
            if (event.type === 'mouseover' || event.type === 'touchmove' || event.type === 'mousemove' ||
                event.type === 'pointermove' || event.type === 'touchstart') {
                this.sliderContainer.classList.add(classNames.sliderHover);
            } else {
                this.sliderContainer.classList.remove(classNames.sliderHover);
            }
        }
    }

    private sliderFocusOut(event: MouseEvent): void {
        if (event.relatedTarget !== this.secondHandle && event.relatedTarget !== this.firstHandle &&
            event.relatedTarget !== this.element && event.relatedTarget !== this.firstBtn && event.relatedTarget !== this.secondBtn) {
            this.closeMaterialTooltip();
            if (this.element.querySelector('.' + classNames.sliderTabHandle)) {
                this.element.querySelector('.' + classNames.sliderTabHandle).classList.remove(classNames.sliderTabHandle);
            }
            if (this.element.querySelector('.' + classNames.sliderTabTrack)) {
                this.element.querySelector('.' + classNames.sliderTabTrack).classList.remove(classNames.sliderTabTrack);
                if ((this.type === 'Range' || this.type === 'MinRange') &&
                    this.element.querySelector('.' + classNames.sliderTabRange)) {
                    this.element.querySelector('.' + classNames.sliderTabRange).classList.remove(classNames.sliderTabRange);
                }
            }
            this.hiddenInput.focus();
            this.hiddenInput.blur();
            this.isElementFocused = false;
        }
    }

    private removeElement(element: Element): void {
        if (element.parentNode) {
            element.parentNode.removeChild(element);
        }
    }
    private changeSliderType(type: SliderType): void {
        if (this.isMaterialTooltip && this.materialHandle) {
            this.sliderContainer.classList.remove(classNames.materialSlider);
            this.removeElement(this.materialHandle);
            this.materialHandle = undefined;
        }
        this.removeElement(this.firstHandle);
        this.firstHandle = undefined;
        if (type !== 'Default') {
            if (type === 'Range') {
                this.removeElement(this.secondHandle);
                this.secondHandle = undefined;
            }
            this.removeElement(this.rangeBar);
            this.rangeBar = undefined;
        }
        if (this.tooltip.isVisible && !isNullOrUndefined(this.tooltipObj)) {
            this.tooltipObj.destroy();
            this.tooltipElement = undefined;
            this.tooltipCollidedPosition = undefined;
        }
        if (this.limits.enabled) {
            if (type === 'MinRange' || type === 'Default') {
                if (!isNullOrUndefined(this.limitBarFirst)) {
                    this.removeElement(this.limitBarFirst);
                    this.limitBarFirst = undefined;
                }
            } else {
                if (!isNullOrUndefined(this.limitBarSecond)) {
                    this.removeElement(this.limitBarSecond);
                    this.limitBarSecond = undefined;
                }
            }
        }
        this.activeHandle = 1;
        this.getThemeInitialization();
        if (this.type === 'Range') {
            this.rangeValueUpdate();
        }
        this.createRangeBar();
        if (this.limits.enabled) {
            this.createLimitBar();
        }
        this.setHandler();
        this.setOrientClass();
        this.wireFirstHandleEvt(false);
        if (this.type === 'Range') {
            this.wireSecondHandleEvt(false);
        }
        this.setValue();
        if (this.tooltip.isVisible) {
            this.renderTooltip();
            this.wireMaterialTooltipEvent(false);
        }
        this.updateConfig();
    }

    private changeRtl(): void {
        if (!this.enableRtl && this.type === 'Range') {
            this.value = [this.handleVal2, this.handleVal1];
        }
        this.updateConfig();
        if (this.tooltip.isVisible) {
            this.tooltipObj.refresh(this.firstHandle);
        }
        if (this.showButtons) {
            let enabledRTL: boolean = this.enableRtl && this.orientation !== 'Vertical';
            attributes(enabledRTL ? this.secondBtn : this.firstBtn, { 'aria-label': 'Decrease', title: 'Decrease' });
            attributes(enabledRTL ? this.firstBtn : this.secondBtn, { 'aria-label': 'Increase', title: 'Increase' });
        }
    }

    private changeOrientation(): void {
        this.changeSliderType(this.type);
    }

    private updateConfig(): void {
        this.setEnableRTL();
        this.setValue();
        if (this.tooltip.isVisible) {
            this.refreshTooltip(this.tooltipTarget);
        }
        if (this.ticks.placement !== 'None') {
            if (this.ul) {
                this.removeElement(this.ul);
                this.ul = undefined;
                this.renderScale();
            }
        }
        this.limitsPropertyChange();
    }

    private limitsPropertyChange(): void {
        if (this.limits.enabled) {
            if (isNullOrUndefined(this.limitBarFirst) && this.type !== 'Range') {
                this.createLimitBar();
            }
            if (isNullOrUndefined(this.limitBarFirst) && isNullOrUndefined(this.limitBarSecond) && this.type === 'Range') {
                this.createLimitBar();
            }
            this.setLimitBar();
            this.setValue();
        } else {
            if (!isNullOrUndefined(this.limitBarFirst)) {
                detach(this.limitBarFirst);
            }
            if (!isNullOrUndefined(this.limitBarSecond)) {
                detach(this.limitBarSecond);
            }
        }
    }

    /**
     * Get the properties to be maintained in the persisted state.
     * @private
     */
    protected getPersistData(): string {
        let keyEntity: string[] = ['value'];
        return this.addOnPersist(keyEntity);
    }

    /**
     * Prepares the slider for safe removal from the DOM.
     * Detaches all event handlers, attributes, and classes to avoid memory leaks.
     * @method destroy
     * @return {void}
     */
    public destroy(): void {
        super.destroy();
        this.unwireEvents();
        window.removeEventListener('resize', this.onresize);
        removeClass([this.sliderContainer], [classNames.sliderDisabled]);
        this.firstHandle.removeAttribute('aria-orientation');
        if (this.type === 'Range') {
            this.secondHandle.removeAttribute('aria-orientation');
        }
        this.sliderContainer.parentNode.insertBefore(this.element, this.sliderContainer);
        detach(this.sliderContainer);
        if (this.tooltip.isVisible) {
            this.tooltipObj.destroy();
        }
        this.element.innerHTML = '';
    }

    /**
     * Calls internally if any of the property value is changed.
     * @private
     */
    // tslint:disable-next-line
    public onPropertyChanged(newProp: SliderModel, oldProp: SliderModel): void {
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'cssClass':
                    this.setCSSClass(oldProp.cssClass);
                    break;
                case 'value':
                    if (newProp && oldProp) {
                        let value: number | number[] = isNullOrUndefined(newProp.value) ?
                            (this.type === 'Range' ? [this.min, this.max] : this.min) : newProp.value;
                        this.setProperties({ 'value': value }, true);
                        if (!isNullOrUndefined(oldProp.value) && oldProp.value.toString() !== value.toString()) {
                            this.setValue();
                            this.refreshTooltip(this.tooltipTarget);
                            if (this.type === 'Range') {
                                if (isNullOrUndefined(newProp.value) || (oldProp.value as number[])[1] === (value as number[])[1]) {
                                    this.activeHandle = 1;
                                } else {
                                    this.activeHandle = 2;
                                }
                            }
                        }
                    }
                    break;
                case 'min':
                case 'step':
                case 'max':
                    this.setMinMaxValue();
                    break;
                case 'tooltip':
                    if (!isNullOrUndefined(newProp.tooltip) && !isNullOrUndefined(oldProp.tooltip)) {
                        this.setTooltip();
                    }
                    break;
                case 'type':
                    if (!isNullOrUndefined(oldProp) && Object.keys(oldProp).length
                        && !isNullOrUndefined(oldProp.type)) {
                        this.changeSliderType(oldProp.type);
                        this.setZindex();
                    }
                    break;
                case 'enableRtl':
                    if (oldProp.enableRtl !== newProp.enableRtl && this.orientation !== 'Vertical') {
                        this.rtl = oldProp.enableRtl;
                        this.changeRtl();
                    }
                    break;
                case 'limits':
                    this.limitsPropertyChange();
                    break;
                case 'orientation':
                    this.changeOrientation();
                    break;
                case 'ticks':
                    if (!isNullOrUndefined(this.sliderContainer.querySelector('.' + classNames.scale))) {
                        detach(this.ul);
                        Array.prototype.forEach.call(this.sliderContainer.classList, (className: string) => {
                            if (className.match(/e-scale-/)) {
                                this.sliderContainer.classList.remove(className);
                            }
                        });
                    }
                    if (this.ticks.placement !== 'None') {
                        this.renderScale();
                        this.setZindex();
                    }
                    break;
                case 'locale':
                    if (this.showButtons) {
                        this.buttonTitle();
                    }
                    break;
                case 'showButtons':
                    if (newProp.showButtons) {
                        this.setButtons();
                        this.reposition();
                        if (this.enabled && !this.readonly) {
                            this.wireButtonEvt(false);
                        }
                    } else {
                        if (this.firstBtn && this.secondBtn) {
                            this.sliderContainer.removeChild(this.firstBtn);
                            this.sliderContainer.removeChild(this.secondBtn);
                            this.sliderContainer.classList.remove(classNames.sliderButtonClass);
                            this.firstBtn = undefined;
                            this.secondBtn = undefined;
                            this.reposition();
                        }
                    }
                    break;
                case 'enabled':
                    this.setEnabled();
                    break;
                case 'readonly':
                    this.setReadOnly();
                    break;
                case 'customValues':
                    this.setValue();
                    this.reposition();
                    break;
                case 'colorRange':
                    this.reposition();
                    break;
            }
        }
    }

    private setReadOnly(): void {
        if (this.readonly) {
            this.unwireEvents();
            this.sliderContainer.classList.add(classNames.readonly);
        } else {
            this.wireEvents();
            this.sliderContainer.classList.remove(classNames.readonly);
        }
    }

    private setMinMaxValue(): void {
        this.setValue();
        this.refreshTooltip(this.tooltipTarget);
        if (!isNullOrUndefined(this.sliderContainer.querySelector('.' + classNames.scale))) {
            if (this.ul) {
                detach(this.ul);
                Array.prototype.forEach.call(this.sliderContainer.classList, (className: string) => {
                    if (className.match(/e-scale-/)) {
                        this.sliderContainer.classList.remove(className);
                    }
                });
            }
        }
        if (this.ticks.placement !== 'None') {
            this.renderScale();
            this.setZindex();
        }
    }

    private setZindex(): void {
        this.zIndex = 6;
        if (!isNullOrUndefined(this.ticks) && this.ticks.placement !== 'None') {
            this.ul.style.zIndex = (this.zIndex + -7) + '';
            this.element.style.zIndex = (this.zIndex + 2) + '';
        }
        if (!this.isMaterial && !isNullOrUndefined(this.ticks) && this.ticks.placement === 'Both') {
            this.element.style.zIndex = (this.zIndex + 2) + '';
        }
        this.firstHandle.style.zIndex = (this.zIndex + 3) + '';
        if (this.type === 'Range') {
            this.secondHandle.style.zIndex = (this.zIndex + 4) + '';
        }
    }

    public setTooltip(): void {
        this.changeSliderType(this.type);
    }
    private setBarColor(): void {
        let trackPosition: number;
        let trackClassName: string;
        let child: Element = this.sliderTrack.lastElementChild;
        while (child) {
            this.sliderTrack.removeChild(child);
            child = this.sliderTrack.lastElementChild;
        }
        for (let i: number = 0; i < this.colorRange.length; i++) {

            if (!isNullOrUndefined(this.colorRange[i].start) && !isNullOrUndefined(this.colorRange[i].end)) {
                if (this.colorRange[i].end > this.colorRange[i].start) {
                    if (this.colorRange[i].start < this.min) {
                        this.colorRange[i].start = this.min;
                    }
                    if (this.colorRange[i].end > this.max) {
                        this.colorRange[i].end = this.max;
                    }
                    let startingPosition: number = this.checkHandlePosition(this.colorRange[i].start);
                    let endPosition: number = this.checkHandlePosition(this.colorRange[i].end);
                    let trackContainer: HTMLElement = this.createElement('div');
                    trackContainer.style.backgroundColor = this.colorRange[i].color;
                    trackContainer.style.border = '1px solid ' + this.colorRange[i].color;
                    if (this.orientation === 'Horizontal') {
                        trackClassName = classNames.sliderHorizantalColor;
                        if (this.enableRtl) {
                            if (isNullOrUndefined(this.customValues)) {
                                trackPosition = this.checkHandlePosition(this.max) - this.checkHandlePosition(this.colorRange[i].end);
                            } else {
                                trackPosition = this.checkHandlePosition(this.customValues.length - this.colorRange[i].end - 1);
                            }
                        } else {
                            trackPosition = this.checkHandlePosition(this.colorRange[i].start);
                        }
                        trackContainer.style.width = endPosition - startingPosition + 'px';
                        trackContainer.style.left = trackPosition + 'px';

                    } else {
                        trackClassName = classNames.sliderVerticalColor;
                        trackPosition = this.checkHandlePosition(this.colorRange[i].start);
                        trackContainer.style.height = endPosition - startingPosition + 'px';
                        trackContainer.style.bottom = trackPosition + 'px';
                    }
                    trackContainer.classList.add(trackClassName);
                    this.sliderTrack.appendChild(trackContainer);
                }
            }
        }
    }
    /**
     * Gets the component name
     * @private
     */
    public getModuleName(): string {
        return 'slider';
    }
}
