import { Component, EventHandler, Property, Event, EmitType, Complex, Collection } from '@syncfusion/ej2-base';
import { L10n, Internationalization, NumberFormatOptions } from '@syncfusion/ej2-base';
import { NotifyPropertyChanges, INotifyPropertyChanged, ChildProperty } from '@syncfusion/ej2-base';
import { attributes, addClass, removeClass, setStyleAttribute, detach, closest } from '@syncfusion/ej2-base';
import { isNullOrUndefined, formatUnit, Browser, SanitizeHtmlHelper, initializeCSPTemplate } from '@syncfusion/ej2-base';
import { Tooltip, Position, TooltipEventArgs, getZindexPartial } from '@syncfusion/ej2-popups';
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
     * {% codeBlock src='slider/placement/index.md' %}{% endcodeBlock %}
     *
     * @default 'None'
     */
    @Property('None')
    public placement: Placement;
    /**
     * It is used to denote the distance between two major (large) ticks from the scale of the Slider.
     * {% codeBlock src='slider/largestep/index.md' %}{% endcodeBlock %}
     *
     * @default 10
     */
    @Property(10)
    public largeStep: number;
    /**
     * It is used to denote the distance between two minor (small) ticks from the scale of the Slider.
     * {% codeBlock src='slider/smallstep/index.md' %}{% endcodeBlock %}
     *
     * @default 1
     */
    @Property(1)
    public smallStep: number;
    /**
     * We can show or hide the small ticks in the Slider, which will be appeared in between the largeTicks.
     *
     * @default false
     */
    @Property(false)
    public showSmallTicks: boolean;

    /**
     * It is used to customize the Slider scale value to the desired format using Internationalization or events(custom formatting).
     * {% codeBlock src='slider/format/index.md' %}{% endcodeBlock %}
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
     *
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
     *
     * @isGenericType true
     */
    value: number | number[];
    /**
     * It is used to get the previous value of the Slider.
     *
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
    /**
     * It is used to check whether the event triggered is via user or programmatic way.
     */
    isInteracted: boolean;
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
 * {% codeBlock src='slider/colorrange/index.md' %}{% endcodeBlock %}
 */
export class ColorRangeData extends ChildProperty<ColorRangeData> {
    /**
     * It is used to set the color in the slider bar.
     *
     * @default ''
     */
    @Property(null)
    public color: string;

    /**
     * It is used to get the starting value for applying color.
     *
     * @default null
     */
    @Property(null)
    public start: number;

    /**
     * It is used to get the end value for applying color.
     *
     * @default null
     */
    @Property(null)
    public end: number;
}

/**
 * It illustrates the limit data in slider.
 * {% codeBlock src='slider/limits/index.md' %}{% endcodeBlock %}
 */
export class LimitData extends ChildProperty<LimitData> {
    /**
     * It is used to enable the limit in the slider.
     *
     * @default false
     */
    @Property(false)
    public enabled: boolean;

    /**
     * It is used to set the minimum start limit value.
     *
     * @default null
     */
    @Property(null)
    public minStart: number;

    /**
     * It is used to set the minimum end limit value.
     *
     * @default null
     */
    @Property(null)
    public minEnd: number;

    /**
     * It is used to set the maximum start limit value.
     *
     * @default null
     */
    @Property(null)
    public maxStart: number;

    /**
     * It is used to set the maximum end limit value.
     *
     * @default null
     */
    @Property(null)
    public maxEnd: number;

    /**
     * It is used to lock the first handle.
     * {% codeBlock src='slider/limitStartHandleFixed/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(false)
    public startHandleFixed: boolean;

    /**
     * It is used to lock the second handle.
     * {% codeBlock src='slider/limitEndHandleFixed/index.md' %}{% endcodeBlock %}
     *
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
     *
     * @default ''
     */
    @Property('')
    public cssClass: string;
    /**
     * It is used to denote the position for the tooltip element in the Slider. The available options are:
     * {% codeBlock src='slider/tooltipplacement/index.md' %}{% endcodeBlock %}
     *  * Before - Tooltip is shown in the top of the horizontal slider bar or at the left of the vertical slider bar.
     *  * After - Tooltip is shown in the bottom of the horizontal slider bar or at the right of the vertical slider bar.
     */
    @Property('Before')
    public placement: TooltipPlacement;

    /**
     * It is used to determine the device mode to show the Tooltip.
     * If it is in desktop, it will show the Tooltip content when hovering on the target element.
     * If it is in touch device. It will show the Tooltip content when tap and holding on the target element.
     * {% codeBlock src='slider/tooltipShowOn/index.md' %}{% endcodeBlock %}
     *
     * @default 'Auto'
     */
    @Property('Focus')
    public showOn: TooltipShowOn;

    /**
     * It is used to show or hide the Tooltip of Slider Component.
     * {% codeBlock src='slider/tooltipIsVisible/index.md' %}{% endcodeBlock %}
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
 * ```props
 * Before :- Ticks are placed in the top of the horizontal slider bar or at the left of the vertical slider bar.
 * After :- Ticks are placed in the bottom of the horizontal slider bar or at the right of the vertical slider bar.
 * Both :- Ticks are placed on the both side of the slider bar.
 * None :- Ticks are not shown.
 * ```
 */
export type Placement = 'Before' | 'After' | 'Both' | 'None';

/**
 * Tooltip Placement.
 * ```props
 * Before :- Tooltip is shown in the top of the horizontal slider bar or at the left of the vertical slider bar.
 * After :- Tooltip is shown in the bottom of the horizontal slider bar or at the right of the vertical slider bar.
 * ```
 */
export type TooltipPlacement = 'Before' | 'After';

/**
 * Tooltip ShowOn.
 * ```props
 * Focus :- Tooltip is shown while focusing the Slider handle.
 * Hover :- Tooltip is shown while hovering the Slider handle.
 * Always :- Tooltip is shown always.
 * Auto :- Tooltip is shown while hovering the Slider handle in desktop and tap and hold in touch devices.
 * ```
 */
export type TooltipShowOn = 'Focus' | 'Hover' | 'Always' | 'Auto';

/**
 * Slider type.
 * ```props
 * Default :- Allows to select a single value in the Slider.
 * MinRange :- Allows to select a single value in the Slider, it display’s a shadow from the start to the current value.
 * Range :- Allows to select a range of values in the Slider.
 * ```
 */
export type SliderType = 'Default' | 'MinRange' | 'Range';

/**
 * Slider orientation.
 * ```props
 * Horizontal :- Renders the slider in horizontal orientation.
 * Vertical :- Renders the slider in vertical orientation.
 * ```
 */
export type SliderOrientation = 'Horizontal' | 'Vertical';

type SliderHandleNumber = 1 | 2;

const bootstrapTooltipOffset: number = 6;
const bootstrap4TooltipOffset: number = 3;
const tolerance: number = 1e-10;

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
    // eslint-disable-next-line
    private repeatInterval: any;
    private isMaterial: boolean;
    private isMaterial3: boolean;
    private isBootstrap: boolean;
    private isBootstrap4: boolean;
    private isTailwind: boolean;
    private isTailwind3: boolean;
    private isBootstrap5: boolean;
    private isFluent: boolean;
    private isFluent2: boolean;
    private isBootstrap5Dot3: boolean;
    private zIndex: number;
    private l10n: L10n;
    private internationalization: Internationalization;
    private tooltipFormatInfo: NumberFormatOptions;
    private ticksFormatInfo: NumberFormatOptions;
    private customAriaText: string = null;
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
    private rangeBarDragged: boolean;
    private isDragComplete: boolean = false;
    public initialTooltip: boolean = true;
    /**
     * It is used to denote the current value of the Slider.
     * The value should be specified in array of number when render Slider type as range.
     *
     * {% codeBlock src="slider/value-api/index.ts" %}{% endcodeBlock %}
     *
     * @default null
     * @isGenericType true
     */
    @Property(null)
    public value: number | number[];

    /**
     * Specifies an array of slider values in number or string type.
     * The min and max step values are not considered.
     *
     * @default null
     */
    @Property(null)
    public customValues: string[] | number[];

    /**
     * Specifies the step value for each value change when the increase / decrease
     *  button is clicked or on arrow keys press or on dragging the thumb.
     *  Refer the documentation [here](../../slider/ticks#step)
     *  to know more about this property.
     *
     * {% codeBlock src="slider/step-api/index.ts" %}{% endcodeBlock %}
     *
     * @default 1
     */
    @Property(1)
    public step: number;

    /**
     * Specifies the width of the Slider.
     *
     * @default null
     */
    @Property(null)
    public width: number | string;

    /**
     * Gets/Sets the minimum value of the slider.
     *
     * {% codeBlock src="slider/min-max-api/index.ts" %}{% endcodeBlock %}
     *
     * @default 0
     */
    @Property(0)
    public min: number;

    /**
     * Gets/Sets the maximum value of the slider.
     *
     * {% codeBlock src="slider/min-max-api/index.ts" %}{% endcodeBlock %}
     *
     * @default 100
     */
    @Property(100)
    public max: number;

    /**
     * Specifies whether the render the slider in read-only mode to restrict any user interaction.
     * The slider rendered with user defined values and can’t be interacted with user actions.
     *
     * @default false
     */
    @Property(false)
    public readonly: boolean;

    /**
     * Defines the type of the Slider. The available options are:
     *  * default - Allows to a single value in the Slider.
     *  * minRange - Allows to select a single value in the Slider. It display’s a shadow from the start to the current value.
     *  * range - Allows to select a range of values in the Slider. It displays shadow in-between the selection range.
     * {% codeBlock src='slider/types/index.md' %}{% endcodeBlock %}
     *
     * @default 'Default'
     */
    @Property('Default')
    public type: SliderType;

    /**
     * Specifies the color to the slider based on given value.
     */
    @Collection<ColorRangeDataModel>([{}], ColorRangeData)
    public colorRange: ColorRangeDataModel[];

    /**
     * It is used to render the slider ticks options such as placement and step values.
     * Refer the documentation [here](../../slider/ticks)
     *  to know more about this property with demo.
     * {% codeBlock src='slider/ticks/index.md' %}{% endcodeBlock %}
     * {% codeBlock src="slider/ticks-api/index.ts" %}{% endcodeBlock %}
     *
     * @default { placement: 'before' }
     */
    @Complex<TicksDataModel>({}, TicksData)
    public ticks: TicksDataModel;

    /**
     * Specified the limit within which the slider to be moved.
     * Refer the documentation [here](../../slider/limits)
     *  to know more about this property.
     *
     * {% codeBlock src="slider/limits-api/index.ts" %}{% endcodeBlock %}
     *
     * @default { enabled: false }
     */
    @Complex<LimitDataModel>({}, LimitData)
    public limits: LimitDataModel;

    /**
     * Enable or Disable the slider.
     *
     * @default true
     */
    @Property(true)
    public enabled: boolean;

    /**
     * Specifies the visibility, position of the tooltip over the slider element.
     *
     * {% codeBlock src="slider/tooltip-api/index.ts" %}{% endcodeBlock %}
     *
     * @default { placement: 'Before', isVisible: false, showOn: 'Focus', format: null }
     */
    @Complex<TooltipDataModel>({}, TooltipData)
    public tooltip: TooltipDataModel;

    /**
     * Specifies whether to show or hide the increase/decrease buttons
     * of Slider to change the slider value.
     * Refer the documentation [here](../../slider/getting-started#buttons)
     *  to know more about this property.
     *
     * {% codeBlock src="slider/showButtons-api/index.ts" %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(false)
    public showButtons: boolean;

    /**
     * Enable or Disable the animation for slider movement.
     *
     * @default true
     */
    @Property(true)
    public enableAnimation: boolean;

    /**
     *  Specifies whether to render the slider in vertical or horizontal orientation.
     *  Refer the documentation [here](../../slider/orientation/)
     *  to know more about this property.
     *
     * @default 'Horizontal'
     */
    @Property('Horizontal')
    public orientation: SliderOrientation;

    /**
     * Specifies the custom classes to be added to the element used to customize the slider.
     * {% codeBlock src='slider/cssClass/index.md' %}{% endcodeBlock %}
     *
     * @default ''
     */
    @Property('')
    public cssClass: string;
    /**
     * Specifies whether to display or remove the untrusted HTML values in the Slider component.
     * If 'enableHtmlSanitizer' set to true, the component will sanitize any suspected untrusted strings and scripts before rendering them.
     *
     * @default true
     */
    @Property(true)
    public enableHtmlSanitizer: boolean;
    /**
     * Triggers when the Slider is successfully created.
     *
     * @event created
     */
    @Event()
    public created: EmitType<Object>;

    /**
     * We can trigger change event whenever Slider value is changed.
     *  In other term, this event will be triggered while drag the slider thumb.
     * {% codeBlock src='slider/changeEvent/index.md' %}{% endcodeBlock %}
     *
     * @event change
     */
    @Event()
    public change: EmitType<SliderChangeEventArgs>;

    /**
     * Fires whenever the Slider value is changed.
     * In other term, this event will be triggered, while drag the slider thumb completed.
     *
     * @event changed
     */
    @Event()
    public changed: EmitType<SliderChangeEventArgs>;

    /**
     * Triggers on rendering the ticks element in the Slider,
     * which is used to customize the ticks labels dynamically.
     * {% codeBlock src='slider/renderingticksEvent/index.md' %}{% endcodeBlock %}
     *
     * @event renderingTicks
     */
    @Event()
    public renderingTicks: EmitType<SliderTickEventArgs>;

    /**
     * Triggers when the ticks are rendered on the Slider.
     * {% codeBlock src='slider/renderedticksEvent/index.md' %}{% endcodeBlock %}
     *
     * @event renderedTicks
     */
    @Event()
    public renderedTicks: EmitType<SliderTickRenderedEventArgs>;

    /**
     * Triggers when the Sider tooltip value is changed.
     * {% codeBlock src='slider/tooltipChangeEvent/index.md' %}{% endcodeBlock %}
     *
     * @event tooltipChange
     */
    @Event()
    public tooltipChange: EmitType<SliderTooltipEventArgs>;

    constructor(options?: SliderModel, element?: string | HTMLElement) {
        super(options, <HTMLElement | string>element);
    }

    protected preRender(): void {
        const localeText: object = { incrementTitle: 'Increase', decrementTitle: 'Decrease' };
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
            const numberOfDecimals: number = this.numberOfDecimals(value);
            formatString = this.internationalization.getNumberFormat(formatInfo)(this.makeRoundNumber(value, numberOfDecimals));
        }
        return { elementVal: formatValue, formatString: formatString };
    }

    private formatNumber(value: number): string {
        const numberOfDecimals: number = this.numberOfDecimals(value);
        return this.internationalization.getNumberFormat({
            maximumFractionDigits: numberOfDecimals,
            minimumFractionDigits: numberOfDecimals, useGrouping: false
        })(value);
    }

    private numberOfDecimals(value: number | string): number {
        const decimalPart: string = value.toString().split('.')[1];
        const numberOfDecimals: number = !decimalPart || !decimalPart.length ? 0 : decimalPart.length;
        return numberOfDecimals;
    }

    private makeRoundNumber(value: number, precision: number): number {
        const decimals: number = precision || 0;
        return Number(value.toFixed(decimals));
    }

    /**
     * To Initialize the control rendering
     *
     * @returns {void}
     * @private
     */
    public render(): void {
        this.initialize();
        this.initRender();
        this.wireEvents();
        this.setZindex();
        this.renderComplete();
        if (this.element.tagName === 'EJS-SLIDER') {
            if (this.getTheme(this.sliderContainer) === 'none') {
                setTimeout(() => {
                    this.refresh();
                }, 0);
            }
        }
    }

    private initialize(): void {
        addClass([this.element], classNames.root);
        this.setCSSClass();
    }

    private setElementWidth(width: number | string): void {
        if (!isNullOrUndefined(width) && !isNullOrUndefined(this.sliderContainer)) {
            if (typeof width === 'number') {
                this.sliderContainer.style.width = formatUnit(width);
            } else if (typeof width === 'string') {
                this.sliderContainer.style.width = (width.match(/px|%|em/)) ? <string>(width) : <string>(formatUnit(width));
            }
        }
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
        const theme: string = window.getComputedStyle(container as Element, ':after').getPropertyValue('content');
        return theme.replace(/['"]+/g, '');
    }

    /**
     * Initialize the rendering
     *
     * @returns {void}
     * @private
     */
    private initRender(): void {
        this.sliderContainer = this.createElement('div', { className: classNames.sliderContainer + ' ' + classNames.controlWrapper });
        this.element.parentNode.insertBefore(this.sliderContainer, this.element);
        this.sliderContainer.appendChild(this.element);
        this.sliderTrack = this.createElement('div', { className: classNames.sliderTrack });
        this.element.appendChild(this.sliderTrack);
        this.setElementWidth(this.width);
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
                type: 'hidden', value: (isNullOrUndefined(this.value) ? (isNullOrUndefined(this.min) ? '0' : this.min.toString()) : this.value.toString()),
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
            this.value = isNullOrUndefined(this.value) ? (isNullOrUndefined(this.min) ? 0 :
                parseFloat(formatUnit(this.min.toString()))) : this.value;
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
        this.isMaterial3 = this.getTheme(this.sliderContainer) === 'Material3'
            || this.getTheme(this.sliderContainer) === 'Material3-dark';
        this.isBootstrap = this.getTheme(this.sliderContainer) === 'bootstrap'
            || this.getTheme(this.sliderContainer) === 'bootstrap-dark';
        this.isBootstrap4 = this.getTheme(this.sliderContainer) === 'bootstrap4';
        this.isTailwind = this.getTheme(this.sliderContainer) === 'tailwind' || this.getTheme(this.sliderContainer) === 'tailwind-dark';
        this.isTailwind3 = this.getTheme(this.sliderContainer) === 'tailwind3' || this.getTheme(this.sliderContainer) === 'tailwind3-dark';
        this.isBootstrap5 = this.getTheme(this.sliderContainer) === 'bootstrap5';
        this.isFluent = this.getTheme(this.sliderContainer) === 'FluentUI';
        this.isFluent2 = this.getTheme(this.sliderContainer) === 'fluent2';
        this.isBootstrap5Dot3 = this.getTheme(this.sliderContainer) === 'bootstrap5.3';
        this.isMaterialTooltip = (this.isMaterial || this.isMaterial3) && this.type !== 'Range' && this.tooltip.isVisible;
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

    private setAriaAttributes(element: Element): void {
        let min: string | number = this.min; let max: string | number = this.max;
        if (!isNullOrUndefined(this.customValues) && this.customValues.length > 0) {
            min = this.customValues[0];
            max = this.customValues[this.customValues.length - 1];
        }
        if (this.type !== 'Range') {
            attributes(element, {
                'aria-valuemin': isNullOrUndefined(min) ? '0' : min.toString(), 'aria-valuemax': (isNullOrUndefined(max) ? '100' : max.toString())
            });
        } else {
            const range: string[][] = !isNullOrUndefined(this.customValues) && this.customValues.length > 0 ?
                [[!isNullOrUndefined(min) ? min.toString() : '', (this.value as number[]).length > 1 && !isNullOrUndefined(this.customValues[(this.value as number[])[1]]) ?
                    (this.customValues[(this.value as number[])[1]]).toString() : ''], [(this.value as number[]).length > 0 && !isNullOrUndefined(this.customValues[(this.value as number[])[0]]) ?
                    (this.customValues[(this.value as number[])[0]]).toString() : '', !isNullOrUndefined(max) ? max.toString() : '']] : [[
                    !isNullOrUndefined(min) ? min.toString() : '', (this.value as number[]).length > 1 && !isNullOrUndefined((this.value as number[])[1]) ? (this.value as number[])[1].toString() : ''],
                [(this.value as number[]).length > 0 && !isNullOrUndefined((this.value as number[])[0]) ? (this.value as number[])[0].toString() : '',
                    !isNullOrUndefined(max) ? max.toString() : '']];
            range.forEach((range: string[], index: number) => {
                const element: Element = index === 0 ? this.firstHandle : this.secondHandle;
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
                class: classNames.sliderHandle, 'role': 'slider', tabIndex: '0', 'aria-label': 'slider'
            }
        });
        this.secondHandle.classList.add(classNames.sliderSecondHandle);
        this.element.appendChild(this.secondHandle);
    }

    private createFirstHandle(): void {
        this.firstHandle = this.createElement('div', {
            attrs: {
                class: classNames.sliderHandle, 'role': 'slider', tabIndex: '0', 'aria-label': 'slider'
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
            if (!this.enableAnimation) {
                this.getHandle().style.transition = 'none';
            }
            if (this.type !== 'Default') {
                this.rangeBar.style.transition = 'none';
            }
            if ((this.isMaterial || this.isMaterial3) && this.tooltip.isVisible && this.type === 'Default') {
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
    private handleFocus(e: MouseEvent & TouchEvent): void {
        this.focusSliderElement();
        this.sliderBarClick(e);
        if (e.currentTarget === this.firstHandle) {
            this.firstHandle.classList.add(classNames.sliderHandleFocused);
            this.firstHandle.classList.add(classNames.sliderTabHandle);
        } else {
            this.secondHandle.classList.add(classNames.sliderHandleFocused);
            this.secondHandle.classList.add(classNames.sliderTabHandle);
        }
        EventHandler.add(document, 'mousemove touchmove', this.sliderBarMove, this);
        EventHandler.add(document, 'mouseup touchend', this.sliderBarUp, this);
    }
    private handleOver(e: MouseEvent): void {
        if (this.tooltip.isVisible && this.tooltip.showOn === 'Hover') {
            this.tooltipToggle(e.currentTarget as HTMLElement);
        } if (this.type === 'Default') {
            this.tooltipToggle(this.getHandle());
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
        this.createFirstHandle();
        if (this.type === 'Range') {
            this.createSecondHandle();
        }
    }

    private setEnableRTL(): void {
        if (this.enableRtl && this.orientation !== 'Vertical') {
            addClass([this.sliderContainer], classNames.rtl);
        } else {
            removeClass([this.sliderContainer], classNames.rtl);
        }
        const preDir: string = (this.orientation !== 'Vertical') ? this.horDir : this.verDir;
        if (this.enableRtl) {
            this.horDir = 'right';
            this.verDir = 'bottom';
        } else {
            this.horDir = 'left';
            this.verDir = 'bottom';
        }
        const currDir: string = (this.orientation !== 'Vertical') ? this.horDir : this.verDir;
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
        const args: SliderTooltipEventArgs = {
            value: this.value,
            text: ''
        };
        if (this.initialTooltip) {
            this.initialTooltip = false;
            this.setTooltipContent();
            args.text = text = (typeof (this.tooltipObj.content) === 'function' ? this.tooltipObj.content() : this.tooltipObj.content) as string;
            this.trigger('tooltipChange', args, (observedArgs: SliderChangeEventArgs) => {
                this.addTooltipClass(observedArgs.text);
                if (text !== observedArgs.text) {
                    this.customAriaText = observedArgs.text;
                    if (this.enableHtmlSanitizer) {
                        observedArgs.text = SanitizeHtmlHelper.sanitize(observedArgs.text.toString());
                    } else {
                        observedArgs.text = observedArgs.text.toString();
                    }
                    const contentTemp: Function = function (): string {
                        return observedArgs.text;
                    };
                    this.tooltipObj.content = initializeCSPTemplate(contentTemp);
                    this.setAriaAttrValue(this.firstHandle);
                    if (this.type === 'Range') {
                        this.setAriaAttrValue(this.secondHandle);
                    }
                }
            });
            if (this.isMaterialTooltip) {
                this.setPreviousVal('change', this.value);
            }
        }
    }

    private setTooltipContent(): void {
        const content: string = this.formatContent(this.tooltipFormatInfo, false);
        const contentTemp: Function = function (): string {
            return content;
        };
        this.tooltipObj.content = initializeCSPTemplate(contentTemp);
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
            const count: number = content.toString().length;
            if (!this.tooltipElement) {
                const cssClass: string = count > 4 ? classNames.sliderMaterialRange : classNames.sliderMaterialDefault;
                this.tooltipObj.cssClass = classNames.sliderTooltip + ' ' + cssClass;
            } else {
                const cssClass: { [key: string]: string } = count > 4 ?
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
        if (this.isBootstrap || this.isBootstrap4 || ((this.isMaterial || this.isMaterial3) && !this.isMaterialTooltip)) {
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

    private materialTooltipEventCallBack(event: MouseEvent & TouchEvent): void {
        this.sliderBarClick(event);
        EventHandler.add(document, 'mousemove touchmove', this.sliderBarMove, this);
        EventHandler.add(document, 'mouseup touchend', this.sliderBarUp, this);
    }

    private wireMaterialTooltipEvent(destroy: boolean): void {
        if (this.isMaterialTooltip) {
            if (!destroy) {
                EventHandler.add(this.tooltipElement, 'mousedown touchstart', this.materialTooltipEventCallBack, this);
            } else {
                EventHandler.remove(this.tooltipElement, 'mousedown touchstart', this.materialTooltipEventCallBack);
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
            const position: number = this.orientation === 'Horizontal' ?
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
            const tooltipContentElement: HTMLElement = this.tooltipElement.firstElementChild as HTMLElement;
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
                setTimeout(() => { if (this.tooltipElement) {this.tooltipElement.style.transition = this.transition.handle; } }, 2500);
            } else {
                setTimeout(() => { if (this.tooltipElement) {this.tooltipElement.style.transition = 'none'; } }, 2500);
            }

        }
    }

    private closeMaterialTooltip(): void {
        if (this.isMaterialTooltip) {
            const tooltipContentElement: HTMLElement = this.tooltipElement.firstElementChild as HTMLElement;
            this.tooltipElement.style.transition = this.scaleTransform;
            tooltipContentElement.classList.remove(classNames.materialTooltipShow);
            tooltipContentElement.classList.add(classNames.materialTooltipHide);
            this.firstHandle.style.cursor = '-webkit-grab';
            this.firstHandle.style.cursor = 'grab';
            if (this.materialHandle) { this.materialHandle.style.transform = 'scale(1)'; }
            this.tooltipElement.classList.remove(classNames.materialTooltipOpen);
            this.setTooltipTransform();
            this.tooltipTarget = undefined;
            setTimeout(() => { if (this.tooltipElement) {this.tooltipElement.style.transition = 'none'; } }, 2500);
        }
    }

    private checkTooltipPosition(args: TooltipEventArgs): void {
        const tooltipClass: string = this.tooltipPositionCalculation(args.collidedPosition);
        if (this.tooltipCollidedPosition === undefined ||
            this.tooltipCollidedPosition !== args.collidedPosition || !args.element.classList.contains(tooltipClass)) {
            if (this.isMaterialTooltip) {
                if (tooltipClass !== undefined) {
                    args.element.classList.remove(this.previousTooltipClass);
                    args.element.classList.add(tooltipClass);
                    this.previousTooltipClass = tooltipClass;
                }
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
        const transformProperties: { [key: string]: string } = this.getTooltipTransformProperties(this.previousTooltipClass);
        if (isNullOrUndefined(this.tooltipElement)) {return; }
        if ((this.tooltipElement.firstElementChild as HTMLElement).innerText.length > 4) {
            this.tooltipElement.style.transform = `${transformProperties.translate} scale(0.01)`;
        } else {
            this.tooltipElement.style.transform = `${transformProperties.translate} ${transformProperties.rotate} scale(0.01)`;
        }
    }

    private renderTooltip(): void {
        this.tooltipObj = new Tooltip({
            showTipPointer: this.isBootstrap || this.isMaterial || this.isMaterial3 || this.isBootstrap4 || this.isTailwind
                || this.isTailwind3 || this.isBootstrap5 || this.isFluent || this.isFluent2 || this.isBootstrap5Dot3,
            cssClass: classNames.sliderTooltip,
            height: (this.isMaterial || this.isMaterial3) ? 30 : 'auto',
            animation: { open: { effect: 'None' }, close: { effect: 'FadeOut', duration: 500 } },
            opensOn: 'Custom',
            beforeOpen: this.tooltipBeforeOpen.bind(this),
            beforeCollision: this.checkTooltipPosition.bind(this),
            beforeClose: this.tooltipBeforeClose.bind(this),
            enableHtmlSanitizer: this.enableHtmlSanitizer
        });
        this.tooltipObj.appendTo(this.firstHandle);
        this.initializeTooltipProps();
    }

    private initializeTooltipProps(): void {
        const tooltipShowOn: string = (this.tooltip.showOn === 'Auto' ? 'Hover' : this.tooltip.showOn);
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
        if (this.isTailwind || this.isTailwind3) {
            this.firstBtn.querySelector('span').classList.add('e-icons');
        }
        this.firstBtn.tabIndex = -1;
        this.secondBtn = this.createElement('div', { className: classNames.sliderButton + ' ' + classNames.secondButton });
        this.secondBtn.appendChild(this.createElement('span', { className: classNames.sliderButtonIcon }));
        if (this.isTailwind || this.isTailwind3) {
            this.secondBtn.querySelector('span').classList.add('e-icons');
        }
        this.secondBtn.tabIndex = -1;
        this.sliderContainer.classList.add(classNames.sliderButtonClass);
        this.sliderContainer.appendChild(this.firstBtn);
        this.sliderContainer.appendChild(this.secondBtn);
        this.sliderContainer.appendChild(this.element);
        this.buttonTitle();
    }

    private buttonTitle(): void {
        const enabledRTL: boolean = this.enableRtl && this.orientation !== 'Vertical';
        this.l10n.setLocale(this.locale);
        const decrementTitle: string = this.l10n.getConstant('decrementTitle');
        const incrementTitle: string = this.l10n.getConstant('incrementTitle');
        attributes(enabledRTL ? this.secondBtn : this.firstBtn, { 'aria-label': decrementTitle, title: decrementTitle });
        attributes(enabledRTL ? this.firstBtn : this.secondBtn, { 'aria-label': incrementTitle, title: incrementTitle });
    }

    private buttonFocusOut(): void {
        if (this.isMaterial || this.isMaterial3) {
            this.getHandle().classList.remove('e-large-thumb-size');
        }
    }
    private repeatButton(args: MouseEvent): void {
        const hVal: number = this.handleValueUpdate();
        const enabledRTL: boolean = this.enableRtl && this.orientation !== 'Vertical';
        let value: number;
        if ((<HTMLElement>args.target).parentElement.classList.contains(classNames.firstButton)
            || (<HTMLElement>args.target).classList.contains(classNames.firstButton)) {
            if (enabledRTL) {
                value = this.add(hVal, parseFloat(this.step.toString()), true);
            } else {
                value = this.add(hVal, parseFloat(this.step.toString()), false);
            }
        } else if ((<HTMLElement>args.target).parentElement.classList.contains(classNames.secondButton)
            || ((<HTMLElement>args.target).classList.contains(classNames.secondButton))) {
            if (enabledRTL) {
                value = this.add(hVal, parseFloat(this.step.toString()), false);
            } else {
                value = this.add(hVal, parseFloat(this.step.toString()), true);
            }
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

    private focusHandle(): void {
        if (!this.getHandle().classList.contains(classNames.sliderTabHandle)) {
            this.getHandle().classList.add(classNames.sliderTabHandle);
        }
    }

    private repeatHandlerUp(e: MouseEvent): void {
        this.changeEvent('changed', e);
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

    private renderScale(): void {
        const orien: string = this.orientation === 'Vertical' ? 'v' : 'h';
        this.ul = this.createElement('ul', {
            className: classNames.scale + ' ' + 'e-' + orien + '-scale ' + classNames.tick + '-' + this.ticks.placement.toLowerCase(),
            attrs: { role: 'presentation', 'aria-hidden': 'true' }
        });
        this.ul.style.zIndex = '-1';
        if (Browser.isAndroid && orien === 'h') {
            this.ul.classList.add(classNames.sliderTickPosition);
        }
        let smallStep: number = this.ticks.smallStep;
        if (!this.ticks.showSmallTicks) {
            if (this.ticks.largeStep > 0) {
                smallStep = this.ticks.largeStep;
            } else {
                smallStep = (parseFloat(formatUnit(this.max))) - (parseFloat(formatUnit(this.min)));
            }
        } else if (smallStep <= 0) {
            smallStep = parseFloat(formatUnit(this.step));
        }
        const min: number = parseFloat(formatUnit(this.min));
        const max: number = parseFloat(formatUnit(this.max));
        const steps: number = parseFloat(formatUnit(smallStep));
        const bigNum: number = !isNullOrUndefined(this.customValues) && this.customValues.length > 0 && this.customValues.length - 1;
        const customStep: number = this.customTickCounter(bigNum);
        const count: number = !isNullOrUndefined(this.customValues) && this.customValues.length > 0 ?
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
                    class: classNames.tick, role: 'presentation',
                    'aria-hidden': 'true'
                }
            }));
            if (!isNullOrUndefined(this.customValues) && this.customValues.length > 0) {
                islargeTick = i % (customStep + 1) === 0;
                if (islargeTick) {
                    if (orien === 'h') {
                        start = <number>this.customValues[k as number];
                        k++;
                    } else {
                        start = <number>this.customValues[y as number];
                        y--;
                    }
                    li.setAttribute('title', start.toString());
                }
            } else {
                li.setAttribute('title', start.toString());
                if (this.numberOfDecimals(this.max) === 0 && this.numberOfDecimals(this.min) === 0 &&
                    this.numberOfDecimals(this.step) === 0) {
                    if (orien === 'h') {
                        const reminder: number = (start - parseFloat(this.min.toString())) % this.ticks.largeStep;
                        islargeTick = (Math.abs(reminder) < tolerance || Math.abs(this.ticks.largeStep - reminder) < tolerance);
                    } else {
                        const reminder: number = Math.abs(start - parseFloat(this.max.toString())) % this.ticks.largeStep;
                        islargeTick = (Math.abs(reminder) < tolerance || Math.abs(this.ticks.largeStep - reminder) < tolerance);
                    }
                } else {
                    const largestep: number = this.ticks.largeStep;
                    const startValue: number = start;
                    if (orien === 'h') {
                        const reminder: number = ((startValue - min) % largestep);
                        islargeTick = Math.abs(reminder) < tolerance || Math.abs(largestep - reminder) < tolerance;
                    } else {
                        const reminder: number = Math.abs(startValue - parseFloat(max.toString())) % largestep;
                        islargeTick = Math.abs(reminder) < tolerance || Math.abs(largestep - reminder) < tolerance;
                    }
                }
            }
            if (islargeTick) {
                li.classList.add(classNames.large);
            }
            if (orien === 'h') {
                li.style.width = tickWidth + '%';
            } else {
                li.style.height = tickWidth + '%';
            }
            const repeat: number = islargeTick ? (this.ticks.placement === 'Both' ? 2 : 1) : 0;
            if (islargeTick) {
                for (let j: number = 0; j < repeat; j++) {
                    this.createTick(li, start);
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
                    if (this.min > this.max) {
                        start = this.makeRoundNumber(start + smallStep, decimalPoints);
                    }
                    else {
                        start = this.makeRoundNumber(start - smallStep, decimalPoints);
                    }
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
        const eventArgs: SliderTickRenderedEventArgs = { ticksWrapper: this.ul, tickElements: this.tickElementCollection };
        if (triggerEvent) {
            this.trigger('renderedTicks', eventArgs);
        }
        this.scaleAlignment();
    }

    private createTick(li: HTMLElement, start: number | string): void {
        const span: HTMLElement = this.createElement('span', {
            className: classNames.tickValue + ' ' + classNames.tick + '-' + this.ticks.placement.toLowerCase(),
            attrs: { role: 'presentation', 'aria-hidden': 'true' }
        });
        li.appendChild(span);
        if (isNullOrUndefined(this.customValues)) {
            this.formatTicksValue(li, <number>start, span);
        } else {
            if (this.enableHtmlSanitizer) {
                span.innerHTML = SanitizeHtmlHelper.sanitize(start.toString());
            } else {
                span.innerHTML = start.toString();
            }
        }
    }

    private formatTicksValue(li: HTMLElement, start: number, spanElement?: HTMLElement): void {
        const tickText: string = this.formatNumber(start);
        const text: string = !isNullOrUndefined(this.ticks) && !isNullOrUndefined(this.ticks.format) ?
            this.formatString(start, this.ticksFormatInfo).formatString : tickText;
        const eventArgs: SliderTickEventArgs = { value: start, text: text, tickElement: li };
        this.trigger('renderingTicks', eventArgs, (observedArgs: SliderTickEventArgs) => {
            li.setAttribute('title', observedArgs.text.toString());
            if (spanElement) {
                if (this.enableHtmlSanitizer) {
                    spanElement.innerHTML = SanitizeHtmlHelper.sanitize(observedArgs.text.toString());
                } else {
                    spanElement.innerHTML = observedArgs.text.toString();
                }
            }
        });
    }

    private scaleAlignment(): void {
        this.tickValuePosition();
        if (this.orientation === 'Vertical') {
            if (this.element.getBoundingClientRect().width <= 15) {
                this.sliderContainer.classList.add(classNames.sliderSmallSize);
            } else {
                this.sliderContainer.classList.remove(classNames.sliderSmallSize);
            }
        } else {
            if (this.element.getBoundingClientRect().height <= 15) {
                this.sliderContainer.classList.add(classNames.sliderSmallSize);
            } else {
                this.sliderContainer.classList.remove(classNames.sliderSmallSize);
            }
        }
    }

    private tickValuePosition(): void {
        this.firstChild = this.element.querySelector('ul').children[0];
        const first: { width: number, height: number } = (this.firstChild as HTMLElement).getBoundingClientRect();
        let firstChild: { width: number, height: number };
        let otherChild: { width: number, height: number };
        const smallStep: number = this.ticks.smallStep;
        const count: number = Math.abs((parseFloat(formatUnit(this.max))) - (parseFloat(formatUnit(this.min)))) / smallStep;
        if (this.firstChild.children.length > 0) {
            firstChild = (this.firstChild.children[0] as HTMLElement).getBoundingClientRect();
        }
        const tickElements: NodeListOf<Element>[] = [this.sliderContainer.querySelectorAll('.' + classNames.tick + '.' +
            classNames.large + ' .' + classNames.tickValue)];
        let other: NodeListOf<Element>;
        if (this.ticks.placement === 'Both') {
            other = [].slice.call(tickElements[0], 2);
        } else {
            other = [].slice.call(tickElements[0], 1);
        }
        const tickWidth: number = this.orientation === 'Vertical' ?
            (first.height * 2) : (first.width * 2);
        for (let i: number = 0; i < this.firstChild.children.length; i++) {
            if (this.orientation === 'Vertical') {
                (this.firstChild.children[i as number] as HTMLElement).style.top = -(firstChild.height / 2) + 'px';
            } else {
                if (!this.enableRtl) {
                    (this.firstChild.children[i as number] as HTMLElement).style.left = -(firstChild.width / 2) + 'px';
                } else {
                    (this.firstChild.children[i as number] as HTMLElement).style.left = (tickWidth -
                        this.firstChild.children[i as number].getBoundingClientRect().width) / 2 + 'px';
                }
            }
        }
        for (let i: number = 0; i < other.length; i++) {
            otherChild = (other[i as number] as HTMLElement).getBoundingClientRect();
            if (this.orientation === 'Vertical') {
                setStyleAttribute(other[i as number] as HTMLElement, { top: (tickWidth - otherChild.height) / 2 + 'px' });
            } else {
                setStyleAttribute(other[i as number] as HTMLElement, { left: (tickWidth - otherChild.width) / 2 + 'px' });
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
        const isTickFormatted: boolean = ((!isNullOrUndefined(this.ticks) && !isNullOrUndefined(this.ticks.format))) ? true : false;
        let text: string = !isTickFormatted ?
            this.formatContent(this.ticksFormatInfo, false) : this.formatContent(this.tooltipFormatInfo, false);
        const valuenow: string = isTickFormatted ? this.formatContent(this.ticksFormatInfo, true) :
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
            if (!this.enableRtl) {
                if (element === this.firstHandle) {
                    attributes(element, { 'aria-valuenow': valuenow.split(' - ')[0], 'aria-valuetext': ariaValueText[0] });
                } else {
                    attributes(element, { 'aria-valuenow': valuenow.split(' - ')[1], 'aria-valuetext': ariaValueText[1] });
                }
            } else {
                if (element === this.firstHandle) {
                    attributes(element, { 'aria-valuenow': valuenow.split(' - ')[1], 'aria-valuetext': ariaValueText[1] });
                } else {
                    attributes(element, { 'aria-valuenow': valuenow.split(' - ')[0], 'aria-valuetext': ariaValueText[0] });
                }
            }
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
        const enabledRTL: boolean = this.enableRtl && this.orientation !== 'Vertical';
        const hVal: number = this.handleValueUpdate();
        if (((<KeyboardEvent>args).keyCode === 40) || ((<KeyboardEvent>args).keyCode === 37)
            || (args.currentTarget as HTMLElement).classList.contains(classNames.firstButton)) {
            if (enabledRTL) {
                value = this.add(hVal, parseFloat(this.step.toString()), true);
            } else {
                value = this.add(hVal, parseFloat(this.step.toString()), false);
            }
        } else if (((<KeyboardEvent>args).keyCode === 38) || ((<KeyboardEvent>args).keyCode === 39) ||
            (args.currentTarget as HTMLElement).classList.contains(classNames.secondButton)) {
            if (enabledRTL) {
                value = this.add(hVal, parseFloat(this.step.toString()), false);
            } else {
                value = this.add(hVal, parseFloat(this.step.toString()), true);
            }
        } else if (((<KeyboardEvent>args).keyCode === 33
            || (args.currentTarget as HTMLElement).classList.contains(classNames.firstButton))) {
            if (enabledRTL) {
                value = this.add(hVal, parseFloat(this.ticks.largeStep.toString()), false);
            } else {
                value = this.add(hVal, parseFloat(this.ticks.largeStep.toString()), true);
            }
        } else if (((<KeyboardEvent>args).keyCode === 34) ||
            (args.currentTarget as HTMLElement).classList.contains(classNames.secondButton)) {
            if (enabledRTL) {
                value = this.add(hVal, parseFloat(this.ticks.largeStep.toString()), true);
            } else {
                value = this.add(hVal, parseFloat(this.ticks.largeStep.toString()), false);
            }
        } else if (((<KeyboardEvent>args).keyCode === 36)) {
            value = parseFloat(this.min < this.max ? this.min.toString() : this.max.toString());

        } else if (((<KeyboardEvent>args).keyCode === 35)) {
            value = parseFloat(this.min < this.max ? this.max.toString() : this.min.toString());
        }
        if (this.limits.enabled) {
            value = this.getLimitCorrectedValues(value);
        }
        this.changeHandleValue(value);
        if ((this.isMaterial || this.isMaterial3) && !this.tooltip.isVisible &&
            !(this.getHandle() as HTMLElement).classList.contains(classNames.sliderTabHandle)) {
            this.materialChange();
        }
        this.tooltipToggle(this.getHandle());
        this.getHandle().focus();
        this.focusHandle();
        if ((args.currentTarget as HTMLElement).classList.contains(classNames.firstButton)) {
            EventHandler.add(this.firstBtn, 'mouseup touchend', this.buttonUp, this);
        }
        if ((args.currentTarget as HTMLElement).classList.contains(classNames.secondButton)) {
            EventHandler.add(this.secondBtn, 'mouseup touchend', this.buttonUp, this);
        }
    }

    private tooltipToggle(target?: HTMLElement): void {
        if (this.isMaterialTooltip) {
            if (!this.tooltipElement.classList.contains(classNames.materialTooltipOpen)) {
                this.openMaterialTooltip();
            } else {
                this.refreshTooltip(this.firstHandle);
            }
        } else {
            if (!this.tooltipElement) {
                this.openTooltip(target);
            } else {
                this.refreshTooltip(target);
            }
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
        if (this.orientation === 'Horizontal' && !isNullOrUndefined(this.rangeBar)) {
            if (this.type === 'MinRange') {
                if (this.enableRtl) {
                    this.rangeBar.style.right = '0px';
                } else {
                    this.rangeBar.style.left = '0px';
                }
                setStyleAttribute(this.rangeBar, { 'width': isNullOrUndefined(this.handlePos1) ? 0 : this.handlePos1 + 'px' });
            } else {
                if (this.enableRtl) {
                    this.rangeBar.style.right = this.handlePos1 + 'px';
                } else {
                    this.rangeBar.style.left = this.handlePos1 + 'px';
                }
                setStyleAttribute(this.rangeBar, { 'width': this.handlePos2 - this.handlePos1 + 'px' });
            }
        } else if (!isNullOrUndefined(this.rangeBar)) {
            if (this.type === 'MinRange') {
                this.rangeBar.style.bottom = this.min > this.max ? this.handlePos1 + 'px' : '0px';
                setStyleAttribute(this.rangeBar, { 'height': isNullOrUndefined(this.handlePos1) ? 0 : this.min > this.max ? this.element.clientHeight - this.handlePos1 + 'px' : this.handlePos1 + 'px' });
            } else {
                this.rangeBar.style.bottom = this.min > this.max ? this.handlePos2 + 'px' : this.handlePos1 + 'px';
                setStyleAttribute(this.rangeBar, { 'height': this.min > this.max ? this.handlePos1 - this.handlePos2 + 'px' : this.handlePos2 - this.handlePos1 + 'px' });
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
            this.limitBarFirst.style.bottom = (this.min < this.max ? fromMinPostion : fromMaxpostion) + 'px';
            this.limitBarFirst.style.height = (this.min < this.max ? (fromMaxpostion - fromMinPostion) : (fromMinPostion - fromMaxpostion)) + 'px';
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
                this.limitBarSecond.style.bottom = (this.min < this.max ? toMinPostion : toMaxpostion) + 'px';
                this.limitBarSecond.style.height = (this.min < this.max ? (toMaxpostion - toMinPostion) : (toMinPostion - toMaxpostion)) + 'px';
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
            minValue = this.min < this.max ? this.min : this.max;
            if (isNullOrUndefined(currentValue) && limitBar) {
                currentValue = minValue;
            }
        }
        if (isNullOrUndefined(maxValue)) {
            maxValue = this.min < this.max ? this.max : this.min;
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
        if (isNullOrUndefined(this.activeHandle)) {
            this.activeHandle = this.type === 'Range' ? 2 : 1;
        }
        if (this.type === 'Default' || this.type === 'MinRange') {
            if (this.limits.enabled) {
                const values: number[] = this.getLimitValueAndPosition(this.handleVal1, this.limits.minStart, this.limits.minEnd);
                this.handleVal1 = values[0];
                this.handlePos1 = values[1];
                this.preHandlePos1 = this.handlePos1;
            }
            this.setHandlePosition(null);
            this.handleStart();
            this.value = this.handleVal1;
            this.setAriaAttrValue(this.firstHandle);
            this.changeEvent('changed', null);
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
        if (this.type === 'Range' && !isNullOrUndefined(this.firstHandle) && !isNullOrUndefined(this.secondHandle)) {
            if (this.activeHandle === 1) {
                this.firstHandle.style.zIndex = (this.zIndex + 4) + '';
                this.secondHandle.style.zIndex = (this.zIndex + 3) + '';
            } else {
                this.firstHandle.style.zIndex = (this.zIndex + 3) + '';
                this.secondHandle.style.zIndex = (this.zIndex + 4) + '';
            }
        } else if (this.isMaterialTooltip && this.tooltipElement) {
            this.tooltipElement.style.zIndex = getZindexPartial(this.element) + '';
        }
    }

    private setHandlePosition(event: MouseEvent | TouchEvent): void {
        let handle: HTMLElement[];
        const pos: number = (this.activeHandle === 1) ? this.handlePos1 : this.handlePos2;
        if (this.isMaterialTooltip) {
            handle = [this.firstHandle, this.materialHandle];
        } else {
            handle = [this.getHandle()];
        }
        this.handleStart();
        handle.forEach((handle: HTMLElement) => {
            if (isNullOrUndefined(handle)) { return; }
            if (this.orientation === 'Horizontal') {
                if (this.enableRtl) {
                    handle.style.right = `${pos}px`;
                } else {
                    handle.style.left = `${pos}px`;
                }
            } else {
                handle.style.bottom = `${pos}px`;
            }
        });
        this.changeEvent('change', event);
    }

    private getHandle(): HTMLElement {
        return (this.activeHandle === 1) ? this.firstHandle : this.secondHandle;
    }

    private setRangeValue(): void {
        this.updateRangeValue();
        this.activeHandle = 1;
        this.setHandlePosition(null);
        this.activeHandle = 2;
        this.setHandlePosition(null);
        this.activeHandle = 1;
    }

    private changeEvent(eventName: string, e: MouseEvent | TouchEvent | KeyboardEvent): void {
        const previous: number | number[] = eventName === 'change' ? this.previousVal : this.previousChanged;
        if (this.type !== 'Range') {
            this.setProperties({ 'value': this.handleVal1 }, true);
            if (previous !== this.value && (!this.isMaterialTooltip || !this.initialTooltip)) {
                this.trigger(eventName, this.changeEventArgs(eventName, e));
                this.initialTooltip = true;
                this.setPreviousVal(eventName, this.value);
            }
            this.setAriaAttrValue(this.firstHandle);
        } else {
            const value: number | number[] = this.value = [this.handleVal1, this.handleVal2];
            this.setProperties({ 'value': value }, true);
            if ((<number[]>previous).length === (<number[]>this.value).length
                && (this.value as number[])[0] !== (<number[]>previous)[0] || (this.value as number[])[1] !== (<number[]>previous)[1]
            ) {
                this.initialTooltip = false;
                this.trigger(eventName, this.changeEventArgs(eventName, e));
                this.initialTooltip = true;
                this.setPreviousVal(eventName, this.value);
            }
            this.setAriaAttrValue(this.getHandle());
        }
        this.hiddenInput.value = this.value.toString();
    }

    private changeEventArgs(eventName: string, e: MouseEvent | TouchEvent | KeyboardEvent): SliderChangeEventArgs {
        let eventArgs: SliderChangeEventArgs;
        if (this.tooltip.isVisible && this.tooltipObj && this.initialTooltip) {
            this.tooltipValue();
            eventArgs = {
                value: this.value,
                previousValue: eventName === 'change' ? this.previousVal : this.previousChanged,
                action: eventName, text: <string>(typeof (this.tooltipObj.content) === 'function' ? this.tooltipObj.content() : this.tooltipObj.content), isInteracted: isNullOrUndefined(e) ? false : true
            };
        } else {
            eventArgs = {
                value: this.value,
                previousValue: eventName === 'change' ? this.previousVal : this.previousChanged,
                action: eventName, text: isNullOrUndefined(this.ticksFormatInfo.format) ? this.value.toString() :
                    (this.type !== 'Range' ? this.formatString(this.value as number, this.ticksFormatInfo).formatString :
                        (this.formatString((this.value as number[])[0], this.ticksFormatInfo).formatString + ' - ' +
                            this.formatString((this.value as number[])[1], this.ticksFormatInfo).formatString)),
                isInteracted: isNullOrUndefined(e) ? false : true
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
        const values: number[] = this.value.toString().split(',').map(Number);
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

        if (this.min < this.max && this.handlePos1 > this.handlePos2) {
            this.handlePos1 = this.handlePos2;
            this.handleVal1 = this.handleVal2;
        }
        if (this.min > this.max && this.handlePos1 < this.handlePos2) {
            this.handlePos2 = this.handlePos1;
            this.handleVal2 = this.handleVal1;
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
        if (this.min === this.max) {
            return (parseFloat(formatUnit(this.max)));
        }
        const handle: { [key: string]: Object } = this.tempStartEnd() as { [key: string]: Object };
        if (value < handle.start) {
            value = handle.start as number;
        } else if (value > handle.end) { value = handle.end as number; }
        return value;
    }

    /**
     * It is used to reposition slider.
     *
     * @returns {void}
     */
    public reposition(): void {
        if (!isNullOrUndefined(this.firstHandle)) {this.firstHandle.style.transition = 'none'; }
        if (this.type !== 'Default' && !isNullOrUndefined(this.rangeBar)) {
            this.rangeBar.style.transition = 'none';
        }
        if (this.type === 'Range' && !isNullOrUndefined(this.secondHandle)) {
            this.secondHandle.style.transition = 'none';
        }
        this.handlePos1 = this.checkHandlePosition(this.handleVal1);
        if (this.handleVal2) {
            this.handlePos2 = this.checkHandlePosition(this.handleVal2);
        }
        if (this.orientation === 'Horizontal') {
            if (this.enableRtl) {
                this.firstHandle.style.right = `${this.handlePos1}px`;
            } else {
                this.firstHandle.style.left = `${this.handlePos1}px`;
            }
            if (this.isMaterialTooltip && !isNullOrUndefined(this.materialHandle)) {
                if (this.enableRtl) {
                    this.materialHandle.style.right = `${this.handlePos1}px`;
                } else {
                    this.materialHandle.style.left = `${this.handlePos1}px`;
                }
            }
            if (this.type === 'MinRange' && !isNullOrUndefined(this.rangeBar)) {
                if (this.enableRtl) {
                    this.rangeBar.style.right = '0px';
                } else {
                    this.rangeBar.style.left = '0px';
                }
                setStyleAttribute(this.rangeBar, { 'width': isNullOrUndefined(this.handlePos1) ? 0 : this.handlePos1 + 'px' });
            } else if (this.type === 'Range' && !isNullOrUndefined(this.secondHandle) && !isNullOrUndefined(this.rangeBar)) {
                if (this.enableRtl) {
                    this.secondHandle.style.right = `${this.handlePos2}px`;
                    this.rangeBar.style.right = this.handlePos1 + 'px';
                } else {
                    this.secondHandle.style.left = `${this.handlePos2}px`;
                    this.rangeBar.style.left = this.handlePos1 + 'px';
                }
                setStyleAttribute(this.rangeBar, { 'width': this.handlePos2 - this.handlePos1 + 'px' });
            }
        } else {
            this.firstHandle.style.bottom = `${this.handlePos1}px`;
            if (this.isMaterialTooltip) {
                this.materialHandle.style.bottom = `${this.handlePos1}px`;
            }
            if (this.type === 'MinRange') {
                this.rangeBar.style.bottom = this.min > this.max ? this.handlePos1 + 'px' : '0px';
                setStyleAttribute(this.rangeBar, { 'height': isNullOrUndefined(this.handlePos1) ? 0 : this.min > this.max ? this.element.clientHeight - this.handlePos1 + 'px' : this.handlePos1 + 'px' });
            } else if (this.type === 'Range') {
                this.secondHandle.style.bottom = `${this.handlePos2}px`;
                this.rangeBar.style.bottom = this.min > this.max ? this.handlePos2 + 'px' : this.handlePos1 + 'px';
                setStyleAttribute(this.rangeBar, { 'height': this.min > this.max ? this.handlePos1 - this.handlePos2 + 'px' : this.handlePos2 - this.handlePos1 + 'px' });
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
                if (!isNullOrUndefined(this.firstHandle)) {this.firstHandle.style.transition = this.scaleTransform; }
                if (this.type === 'Range' && !isNullOrUndefined(this.secondHandle)) {
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

                if (this.type === 'Range' && ((this.handlePos1 > this.handlePos2 && this.min < this.max) || (this.handlePos1 < this.handlePos2 && this.min > this.max))) {
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

                if (this.type === 'Range' && ((this.handlePos2 < this.handlePos1 && this.min < this.max) || (this.handlePos2 > this.handlePos1 && this.min > this.max))) {
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
            this.setHandlePosition(null);
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
            const left: number = position.x as number - this.element.getBoundingClientRect().left;
            const num: number = this.element.offsetWidth / 100;
            this.val = (left / num);
        } else {
            const top: number = position.y as number - this.element.getBoundingClientRect().top;
            const num: number = this.element.offsetHeight / 100;
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
        const percentStep: number =
            (parseFloat(formatUnit(this.step))) / ((parseFloat(formatUnit(this.max)) - parseFloat(formatUnit(this.min))) / 100);
        const remain: number = value % Math.abs(percentStep);
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
        const x: number = Math.pow(10, precision || 3);
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
        const diff: number = parseFloat(formatUnit(this.max)) - parseFloat(formatUnit(this.min));
        if (this.orientation === 'Horizontal') {
            val = (pos / this.element.getBoundingClientRect().width) * diff;
        } else {
            val = (pos / this.element.getBoundingClientRect().height) * diff;
        }
        const total: number = this.add(val, parseFloat(this.min.toString()), true);
        return (total);
    }

    private sliderBarClick(evt: MouseEvent & TouchEvent): void {
        evt.preventDefault();
        let pos: { [key: string]: Object };
        if (evt.type === 'mousedown' || evt.type === 'mouseup' || evt.type === 'click') {
            pos = { x: evt.clientX, y: evt.clientY };
        } else if (evt.type === 'touchend' || evt.type === 'touchstart') {
            pos = { x: evt.changedTouches[0].clientX, y: evt.changedTouches[0].clientY };
        }
        let handlepos: number = this.xyToPosition(pos);
        let handleVal: number = this.positionToValue(handlepos);
        if (this.type === 'Range' && (this.min < (this.max) && (this.handlePos2 - handlepos) < (handlepos - this.handlePos1) || (this.min > this.max) && (this.handlePos1 - handlepos) > (handlepos - this.handlePos2))) {
            this.activeHandle = 2;
            if (!(this.limits.enabled && this.limits.endHandleFixed)) {
                if (this.limits.enabled) {
                    const value: number[] = this.getLimitValueAndPosition(handleVal, this.limits.maxStart, this.limits.maxEnd);
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
                    const value: number[] = this.getLimitValueAndPosition(handleVal, this.limits.minStart, this.limits.minEnd);
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
        const focusedElement: Element = this.element.querySelector('.' + classNames.sliderTabHandle);
        if (focusedElement && this.getHandle() !== focusedElement) {
            focusedElement.classList.remove(classNames.sliderTabHandle);
        }
        const handle: HTMLElement = this.activeHandle === 1 ? this.firstHandle : this.secondHandle;
        let behindElement: Element;
        if ((evt.type === 'click' || evt.type === 'mousedown') && evt.target === handle) {
            const { clientX: eventX, clientY: eventY } = evt;
            behindElement = document.elementFromPoint(eventX, eventY);
        }
        if (!this.checkRepeatedValue(handleVal)) {
            return;
        }
        const transition: { [key: string]: string } = (this.isMaterial || this.isMaterial3) && this.tooltip.isVisible ?
            this.transitionOnMaterialTooltip : this.transition;
        this.getHandle().style.transition = transition.handle;
        if (this.type !== 'Default') {
            this.rangeBar.style.transition = transition.rangeBar;
        }
        this.setHandlePosition(evt);
        if (this.isMaterialTooltip) {
            this.initialTooltip = false;
        }
        if (evt.target !== handle) {
            this.changeEvent('changed', evt);
        }
        if (this.type !== 'Default') {
            this.setRangeBar();
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
        this.rangeBarDragged = true;
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
            if (this.min > this.max) {
                this.handlePos2 = this.xyToPosition(pos);
                this.handleVal2 = this.positionToValue(this.handlePos2);
            }
            else {
                this.handlePos1 = this.xyToPosition(pos);
                this.handleVal1 = this.positionToValue(this.handlePos1);
            }
            if (!this.enableRtl) {
                pos = { x: xPostion + this.secondPartRemain, y: yPostion - this.firstPartRemain };
            } else {
                pos = { x: xPostion - this.firstPartRemain, y: yPostion - this.firstPartRemain };
            }
            if (this.min > this.max) {
                this.handlePos1 = this.xyToPosition(pos);
                this.handleVal1 = this.positionToValue(this.handlePos1);
            }
            else {
                this.handlePos2 = this.xyToPosition(pos);
                this.handleVal2 = this.positionToValue(this.handlePos2);
            }
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
            if (this.handleVal2 === (this.min > this.max ? this.min : this.max)) {
                this.handleValueAdjust(this.handleVal2, (this.min > this.max ? this.min : this.max), 2);
            }
            if (this.handleVal1 === (this.min > this.max ? this.max : this.min)) {
                this.handleValueAdjust(this.handleVal1, (this.min > this.max ? this.max : this.min), 1);
            }
        }
        this.activeHandle = 1;
        this.setHandlePosition(event);
        this.activeHandle = 2;
        this.setHandlePosition(event);
        this.tooltipToggle(this.rangeBar);
        this.setRangeBar();
    }

    private sliderBarUp(event: MouseEvent): void {
        this.changeEvent('changed', event);
        this.handleFocusOut();
        this.firstHandle.classList.remove(classNames.sliderActiveHandle);
        if (this.type === 'Range') {
            this.initialTooltip = false;
            this.secondHandle.classList.remove(classNames.sliderActiveHandle);
        }
        this.closeTooltip();
        if (this.isMaterial || this.isMaterial3) {
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
                    const valueAndPostion: number[] = this.getLimitValueAndPosition(handleVal, this.limits.minStart, this.limits.minEnd);
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
                    if ((this.min < this.max && handlepos > this.handlePos2 || (this.min > this.max && handlepos < this.handlePos2))) {
                        handlepos = this.handlePos2;
                        handleVal = this.handleVal2;
                    }
                    if (handlepos !== this.preHandlePos1) {
                        if (this.limits.enabled) {
                            const value: number[] = this.getLimitValueAndPosition(handleVal, this.limits.minStart, this.limits.minEnd);
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
                    if ((this.min < this.max && handlepos < this.handlePos1) || (this.min > this.max && handlepos > this.handlePos1)) {
                        handlepos = this.handlePos1;
                        handleVal = this.handleVal1;
                    }
                    if (handlepos !== this.preHandlePos2) {
                        if (this.limits.enabled) {
                            const value: number[] = this.getLimitValueAndPosition(handleVal, this.limits.maxStart, this.limits.maxEnd);
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
        this.setHandlePosition(evt);
        if ((this.isMaterial || this.isMaterial3) && !this.tooltip.isVisible &&
            !(this.getHandle() as HTMLElement).classList.contains(classNames.sliderTabHandle)) {
            this.materialChange();
        }
        this.tooltipToggle(this.getHandle());
        if (this.type !== 'Default') {
            this.setRangeBar();
        }
    }

    private dragRangeBarUp(event: MouseEvent & TouchEvent): void {
        if (!this.rangeBarDragged) {
            this.focusSliderElement();
            this.sliderBarClick(event);
        } else {
            this.isDragComplete = true;
        }
        this.changeEvent('changed', event);
        this.closeTooltip();
        EventHandler.remove(document, 'mousemove touchmove', this.dragRangeBarMove);
        EventHandler.remove(document, 'mouseup touchend', this.dragRangeBarUp);
        this.rangeBarDragged = false;
    }

    private checkRepeatedValue(currentValue: number): number {
        if (this.type === 'Range') {
            const previousVal: number = this.enableRtl && this.orientation !== 'Vertical' ? (this.activeHandle === 1 ?
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

    private rangeBarMousedown(event: MouseEvent & TouchEvent): void {
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
            const focusedElement: Element = this.element.querySelector('.' + classNames.sliderTabHandle);
            if (focusedElement) {
                focusedElement.classList.remove(classNames.sliderTabHandle);
            }
            EventHandler.add(document, 'mousemove touchmove', this.dragRangeBarMove, this);
            EventHandler.add(document, 'mouseup touchend', this.dragRangeBarUp, this);
        }
    }

    private elementClick(event: MouseEvent & TouchEvent): void {
        if (this.isDragComplete) {
            this.isDragComplete = false;
            return;
        }
        event.preventDefault();
        this.focusSliderElement();
        this.sliderBarClick(event);
        this.focusHandle();
    }

    private wireEvents(): void {
        this.onresize = this.reposition.bind(this);
        window.addEventListener('resize', this.onresize);
        if (this.enabled && !this.readonly) {
            EventHandler.add(this.element, 'click', this.elementClick, this);
            if (this.type === 'Range' && this.drag) {
                EventHandler.add(this.rangeBar, 'mousedown touchstart', this.rangeBarMousedown, this);
            }
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
        EventHandler.remove(this.element, 'click', this.elementClick);
        if (this.type === 'Range' && this.drag) {
            EventHandler.remove(this.rangeBar, 'mousedown touchstart', this.rangeBarMousedown);
        }
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
                const parentElement: HTMLElement = (event.target as HTMLElement).parentElement;
                if (parentElement === this.element) {
                    (parentElement.querySelector('.' + classNames.sliderTrack) as HTMLElement).classList.add(classNames.sliderTabTrack);
                    if (this.type === 'Range' || this.type === 'MinRange') {
                        (parentElement.querySelector('.' + classNames.rangeBar) as HTMLElement).classList.add(classNames.sliderTabRange);
                    }
                }
                if (this.type === 'Range') {
                    const previousSibling: Element = (event.target as Element).previousSibling as Element;
                    if (previousSibling && previousSibling.classList.contains(classNames.sliderHandle)) {
                        this.activeHandle = 2;
                    } else {
                        this.activeHandle = 1;
                    }
                }
                this.getHandle().focus();
                this.tooltipToggle(this.getHandle());
            }
        }
        this.closeTooltip();
        this.changeEvent('changed', event);
    }

    private hover(event: MouseEvent): void {
        if (!isNullOrUndefined(event)) {
            if (event.type === 'mouseover' || event.type === 'touchmove' || event.type === 'mousemove' ||
                event.type === 'pointermove' || event.type === 'touchstart') {
                this.sliderContainer.classList.add(classNames.sliderHover);
            } else {
                this.sliderContainer.classList.remove(classNames.sliderHover);
                const curTarget: HTMLElement = event.currentTarget as HTMLElement;
                if (this.tooltip.isVisible && this.tooltip.showOn !== 'Always' && this.tooltipObj && this.isMaterialTooltip &&
                    !curTarget.classList.contains(classNames.sliderHandleFocused) &&
                    !curTarget.classList.contains(classNames.sliderTabHandle)) {
                    this.closeMaterialTooltip();
                }
            }
        }
    }

    private sliderFocusOut(event: MouseEvent): void {
        if (event.relatedTarget !== this.secondHandle && event.relatedTarget !== this.firstHandle &&
            event.relatedTarget !== this.element && event.relatedTarget !== this.firstBtn && event.relatedTarget !== this.secondBtn) {
            this.closeMaterialTooltip();
            this.closeTooltip();
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
    private changeSliderType(type: SliderType, args: string): void {
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
        this.wireFirstHandleEvt(!this.enabled);
        if (this.type === 'Range') {
            this.wireSecondHandleEvt(!this.enabled);
        }
        this.setValue();
        if (this.tooltip.isVisible) {
            this.renderTooltip();
            this.wireMaterialTooltipEvent(false);
        }
        this.setBarColor();
        if (args !== 'tooltip') {
            this.updateConfig();
        }
        if (this.readonly) {
            this.sliderContainer.classList.remove(classNames.readonly);
            this.setReadOnly();
        }
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
            const enabledRTL: boolean = this.enableRtl && this.orientation !== 'Vertical';
            attributes(enabledRTL ? this.secondBtn : this.firstBtn, { 'aria-label': 'Decrease', title: 'Decrease' });
            attributes(enabledRTL ? this.firstBtn : this.secondBtn, { 'aria-label': 'Increase', title: 'Increase' });
        }
    }

    private changeOrientation(): void {
        this.changeSliderType(this.type, 'null');
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
     *
     * @returns {string} - Returns the string
     * @private
     */
    protected getPersistData(): string {
        const keyEntity: string[] = ['value'];
        return this.addOnPersist(keyEntity);
    }

    /**
     * Removes the component from the DOM and detaches all its related event handlers.
     * Also it removes the attributes and classes.
     *
     * @method destroy
     * @returns {void}
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
        if (this.sliderContainer.parentNode) {
            this.sliderContainer.parentNode.insertBefore(this.element, this.sliderContainer);
        }
        detach(this.sliderContainer);
        if (this.tooltip.isVisible) {
            this.tooltipObj.destroy();
        }
        this.element.innerHTML = '';
        this.hiddenInput = null;
        this.sliderContainer = null;
        this.sliderTrack = null;
        this.rangeBar = null;
        this.firstHandle = null;
        this.secondHandle = null;
        this.tickElementCollection = null;
        this.ul = null;
        this.firstBtn = null;
        this.secondBtn = null;
        this.materialHandle = null;
        this.tooltipObj = null;
        this.tooltipTarget = null;
        this.limitBarFirst = null;
        this.limitBarSecond = null;
        this.firstChild = null;
        this.lastChild = null;
        this.tooltipElement = null;
    }

    /**
     * Calls internally if any of the property value is changed.
     *
     * @param {SliderModel} newProp - Specifies the new properties
     * @param {SliderModel} oldProp - Specifies the old properties
     * @returns {void}
     * @private
     */
    public onPropertyChanged(newProp: SliderModel, oldProp: SliderModel): void {
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'cssClass':
                this.setCSSClass(oldProp.cssClass);
                break;
            case 'value':
                if (newProp && oldProp) {
                    const value: number | number[] = isNullOrUndefined(newProp.value) ?
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
                    this.initialTooltip = true;
                    this.setTooltip(prop);
                    if (!this.showButtons) {
                        this.wireEvents();
                    }
                }
                break;
            case 'type':
                if (!isNullOrUndefined(oldProp) && Object.keys(oldProp).length
                        && !isNullOrUndefined(oldProp.type)) {
                    this.changeSliderType(oldProp.type, prop);
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
            case 'width':
                this.setElementWidth(newProp.width);
                this.setMinMaxValue();
                if (this.limits) {
                    this.limitsPropertyChange();
                }
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
        if (!isNullOrUndefined(this.ticks) && this.ticks.placement !== 'None' && !isNullOrUndefined(this.ul) && !isNullOrUndefined(this.element)) {
            this.ul.style.zIndex = (this.zIndex + -7) + '';
            this.element.style.zIndex = (this.zIndex + 2) + '';
        }
        if (!this.isMaterial && !this.isMaterial3 && !isNullOrUndefined(this.ticks) && this.ticks.placement === 'Both') {
            this.element.style.zIndex = (this.zIndex + 2) + '';
        }
        if (!isNullOrUndefined(this.firstHandle)) {this.firstHandle.style.zIndex = (this.zIndex + 3) + ''; }
        if (this.type === 'Range' && !isNullOrUndefined(this.secondHandle)) {
            this.secondHandle.style.zIndex = (this.zIndex + 4) + '';
        }
    }

    public setTooltip(args?: string): void {
        this.changeSliderType(this.type, args);
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

            if (!isNullOrUndefined(this.colorRange[i as number].start) && !isNullOrUndefined(this.colorRange[i as number].end)) {
                if (this.colorRange[i as number].end > this.colorRange[i as number].start) {
                    if (this.colorRange[i as number].start < this.min) {
                        this.colorRange[i as number].start = this.min;
                    }
                    if (this.colorRange[i as number].end > this.max) {
                        this.colorRange[i as number].end = this.max;
                    }
                    const startingPosition: number = this.checkHandlePosition(this.colorRange[i as number].start);
                    const endPosition: number = this.checkHandlePosition(this.colorRange[i as number].end);
                    const trackContainer: HTMLElement = this.createElement('div');
                    trackContainer.style.backgroundColor = this.colorRange[i as number].color;
                    trackContainer.style.border = '1px solid ' + this.colorRange[i as number].color;
                    if (this.orientation === 'Horizontal') {
                        trackClassName = classNames.sliderHorizantalColor;
                        if (this.enableRtl) {
                            if (isNullOrUndefined(this.customValues)) {
                                trackPosition =
                                    this.checkHandlePosition(this.max) - this.checkHandlePosition(this.colorRange[i as number].end);
                            } else {
                                trackPosition = this.checkHandlePosition(this.customValues.length - this.colorRange[i as number].end - 1);
                            }
                        } else {
                            trackPosition = this.checkHandlePosition(this.colorRange[i as number].start);
                        }
                        trackContainer.style.width = endPosition - startingPosition + 'px';
                        trackContainer.style.left = trackPosition + 'px';

                    } else {
                        trackClassName = classNames.sliderVerticalColor;
                        trackPosition = this.checkHandlePosition(this.colorRange[i as number].start);
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
     *
     * @returns {string} - Returns the string
     * @private
     */
    public getModuleName(): string {
        return 'slider';
    }
}
