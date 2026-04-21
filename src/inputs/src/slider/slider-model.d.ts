import { Component, EventHandler, Property, Event, EmitType, Complex, Collection } from '@syncfusion/ej2-base';import { L10n, Internationalization, NumberFormatOptions } from '@syncfusion/ej2-base';import { NotifyPropertyChanges, INotifyPropertyChanged, ChildProperty } from '@syncfusion/ej2-base';import { attributes, addClass, removeClass, setStyleAttribute, detach, closest } from '@syncfusion/ej2-base';import { isNullOrUndefined, formatUnit, Browser, SanitizeHtmlHelper, initializeCSPTemplate } from '@syncfusion/ej2-base';import { Tooltip, Position, TooltipEventArgs, getZindexPartial } from '@syncfusion/ej2-popups';
import {Placement,TooltipPlacement,TooltipShowOn,SliderType,SliderOrientation,SliderChangeEventArgs,SliderTickEventArgs,SliderTickRenderedEventArgs,SliderTooltipEventArgs} from "./slider";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class TicksData
 */
export interface TicksDataModel {

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
    placement?: Placement;

    /**
     * It is used to denote the distance between two major (large) ticks from the scale of the Slider.
     * {% codeBlock src='slider/largestep/index.md' %}{% endcodeBlock %}
     *
     * @default 10
     */
    largeStep?: number;

    /**
     * It is used to denote the distance between two minor (small) ticks from the scale of the Slider.
     * {% codeBlock src='slider/smallstep/index.md' %}{% endcodeBlock %}
     *
     * @default 1
     */
    smallStep?: number;

    /**
     * We can show or hide the small ticks in the Slider, which will be appeared in between the largeTicks.
     *
     * @default false
     */
    showSmallTicks?: boolean;

    /**
     * It is used to customize the Slider scale value to the desired format using Internationalization or events(custom formatting).
     * {% codeBlock src='slider/format/index.md' %}{% endcodeBlock %}
     */
    format?: string;

}

/**
 * Interface for a class ColorRangeData
 */
export interface ColorRangeDataModel {

    /**
     * It is used to set the color in the slider bar.
     *
     * @default ''
     */
    color?: string;

    /**
     * It is used to get the starting value for applying color.
     *
     * @default null
     */
    start?: number;

    /**
     * It is used to get the end value for applying color.
     *
     * @default null
     */
    end?: number;

}

/**
 * Interface for a class LimitData
 */
export interface LimitDataModel {

    /**
     * It is used to enable the limit in the slider.
     *
     * @default false
     */
    enabled?: boolean;

    /**
     * It is used to set the minimum start limit value.
     *
     * @default null
     */
    minStart?: number;

    /**
     * It is used to set the minimum end limit value.
     *
     * @default null
     */
    minEnd?: number;

    /**
     * It is used to set the maximum start limit value.
     *
     * @default null
     */
    maxStart?: number;

    /**
     * It is used to set the maximum end limit value.
     *
     * @default null
     */
    maxEnd?: number;

    /**
     * It is used to lock the first handle.
     * {% codeBlock src='slider/limitStartHandleFixed/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    startHandleFixed?: boolean;

    /**
     * It is used to lock the second handle.
     * {% codeBlock src='slider/limitEndHandleFixed/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    endHandleFixed?: boolean;

}

/**
 * Interface for a class TooltipData
 */
export interface TooltipDataModel {

    /**
     * It is used to customize the Tooltip which accepts custom CSS class names that define
     *  specific user-defined styles and themes to be applied on the Tooltip element.
     *
     * @default ''
     */
    cssClass?: string;

    /**
     * It is used to denote the position for the tooltip element in the Slider. The available options are:
     * {% codeBlock src='slider/tooltipplacement/index.md' %}{% endcodeBlock %}
     *  * Before - Tooltip is shown in the top of the horizontal slider bar or at the left of the vertical slider bar.
     *  * After - Tooltip is shown in the bottom of the horizontal slider bar or at the right of the vertical slider bar.
     */
    placement?: TooltipPlacement;

    /**
     * It is used to determine the device mode to show the Tooltip.
     * If it is in desktop, it will show the Tooltip content when hovering on the target element.
     * If it is in touch device. It will show the Tooltip content when tap and holding on the target element.
     * {% codeBlock src='slider/tooltipShowOn/index.md' %}{% endcodeBlock %}
     *
     * @default 'Auto'
     */
    showOn?: TooltipShowOn;

    /**
     * It is used to show or hide the Tooltip of Slider Component.
     * {% codeBlock src='slider/tooltipIsVisible/index.md' %}{% endcodeBlock %}
     */
    isVisible?: boolean;

    /**
     * It is used to customize the Tooltip content to the desired format
     *  using internationalization or events (custom formatting).
     */
    format?: string;

}

/**
 * Interface for a class Slider
 */
export interface SliderModel extends ComponentModel{

    /**
     * It is used to denote the current value of the Slider.
     * The value should be specified in array of number when render Slider type as range.
     *
     * {% codeBlock src="slider/value-api/index.ts" %}{% endcodeBlock %}
     *
     * @default null
     * @isGenericType true
     */
    value?: number | number[];

    /**
     * Specifies an array of slider values in number or string type.
     * The min and max step values are not considered.
     *
     * @default null
     */
    customValues?: string[] | number[];

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
    step?: number;

    /**
     * Specifies the width of the Slider.
     *
     * @default null
     */
    width?: number | string;

    /**
     * Gets/Sets the minimum value of the slider.
     *
     * {% codeBlock src="slider/min-max-api/index.ts" %}{% endcodeBlock %}
     *
     * @default 0
     */
    min?: number;

    /**
     * Gets/Sets the maximum value of the slider.
     *
     * {% codeBlock src="slider/min-max-api/index.ts" %}{% endcodeBlock %}
     *
     * @default 100
     */
    max?: number;

    /**
     * Specifies whether the render the slider in read-only mode to restrict any user interaction.
     * The slider rendered with user defined values and can’t be interacted with user actions.
     *
     * @default false
     */
    readonly?: boolean;

    /**
     * Defines the type of the Slider. The available options are:
     *  * default - Allows to a single value in the Slider.
     *  * minRange - Allows to select a single value in the Slider. It display’s a shadow from the start to the current value.
     *  * range - Allows to select a range of values in the Slider. It displays shadow in-between the selection range.
     * {% codeBlock src='slider/types/index.md' %}{% endcodeBlock %}
     *
     * @default 'Default'
     */
    type?: SliderType;

    /**
     * Specifies the color to the slider based on given value.
     */
    colorRange?: ColorRangeDataModel[];

    /**
     * It is used to render the slider ticks options such as placement and step values.
     * Refer the documentation [here](../../slider/ticks)
     *  to know more about this property with demo.
     * {% codeBlock src='slider/ticks/index.md' %}{% endcodeBlock %}
     * {% codeBlock src="slider/ticks-api/index.ts" %}{% endcodeBlock %}
     *
     * @default { placement: 'before' }
     */
    ticks?: TicksDataModel;

    /**
     * Specified the limit within which the slider to be moved.
     * Refer the documentation [here](../../slider/limits)
     *  to know more about this property.
     *
     * {% codeBlock src="slider/limits-api/index.ts" %}{% endcodeBlock %}
     *
     * @default { enabled: false }
     */
    limits?: LimitDataModel;

    /**
     * Enable or Disable the slider.
     *
     * @default true
     */
    enabled?: boolean;

    /**
     * Specifies the visibility, position of the tooltip over the slider element.
     *
     * {% codeBlock src="slider/tooltip-api/index.ts" %}{% endcodeBlock %}
     *
     * @default { placement: 'Before', isVisible: false, showOn: 'Focus', format: null }
     */
    tooltip?: TooltipDataModel;

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
    showButtons?: boolean;

    /**
     * Enable or Disable the animation for slider movement.
     *
     * @default true
     */
    enableAnimation?: boolean;

    /**
     *  Specifies whether to render the slider in vertical or horizontal orientation.
     *  Refer the documentation [here](../../slider/orientation/)
     *  to know more about this property.
     *
     * @default 'Horizontal'
     */
    orientation?: SliderOrientation;

    /**
     * Specifies the custom classes to be added to the element used to customize the slider.
     * {% codeBlock src='slider/cssClass/index.md' %}{% endcodeBlock %}
     *
     * @default ''
     */
    cssClass?: string;

    /**
     * Specifies whether to display or remove the untrusted HTML values in the Slider component.
     * If 'enableHtmlSanitizer' set to true, the component will sanitize any suspected untrusted strings and scripts before rendering them.
     *
     * @default true
     */
    enableHtmlSanitizer?: boolean;

    /**
     * Triggers when the Slider is successfully created.
     *
     * @event created
     */
    created?: EmitType<Object>;

    /**
     * We can trigger change event whenever Slider value is changed.
     *  In other term, this event will be triggered while drag the slider thumb.
     * {% codeBlock src='slider/changeEvent/index.md' %}{% endcodeBlock %}
     *
     * @event change
     */
    change?: EmitType<SliderChangeEventArgs>;

    /**
     * Fires whenever the Slider value is changed.
     * In other term, this event will be triggered, while drag the slider thumb completed.
     *
     * @event changed
     */
    changed?: EmitType<SliderChangeEventArgs>;

    /**
     * Triggers on rendering the ticks element in the Slider,
     * which is used to customize the ticks labels dynamically.
     * {% codeBlock src='slider/renderingticksEvent/index.md' %}{% endcodeBlock %}
     *
     * @event renderingTicks
     */
    renderingTicks?: EmitType<SliderTickEventArgs>;

    /**
     * Triggers when the ticks are rendered on the Slider.
     * {% codeBlock src='slider/renderedticksEvent/index.md' %}{% endcodeBlock %}
     *
     * @event renderedTicks
     */
    renderedTicks?: EmitType<SliderTickRenderedEventArgs>;

    /**
     * Triggers when the Sider tooltip value is changed.
     * {% codeBlock src='slider/tooltipChangeEvent/index.md' %}{% endcodeBlock %}
     *
     * @event tooltipChange
     */
    tooltipChange?: EmitType<SliderTooltipEventArgs>;

}