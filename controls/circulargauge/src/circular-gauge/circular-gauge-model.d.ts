import { Property, NotifyPropertyChanges, Component, INotifyPropertyChanged } from '@syncfusion/ej2-base';import { Complex, Browser, isNullOrUndefined } from '@syncfusion/ej2-base';import { Event, EmitType, SvgRenderer, EventHandler, Collection, Internationalization, ModuleDeclaration } from '@syncfusion/ej2-base';import { remove, createElement } from '@syncfusion/ej2-base';import { ILoadedEventArgs, IAnimationCompleteEventArgs, IVisiblePointer } from './model/interface';import { IAxisLabelRenderEventArgs, IRadiusCalculateEventArgs, IPointerDragEventArgs, IResizeEventArgs } from './model/interface';import { ITooltipRenderEventArgs, IAnnotationRenderEventArgs, IMouseEventArgs } from './model/interface';import { TextOption, textElement, RectOption, getAngleFromLocation, getValueFromAngle, removeElement } from './utils/helper';import { Size, stringToNumber, measureText, Rect, GaugeLocation, getElement, getPointer, setStyles, toPixel } from './utils/helper';import { getAngleFromValue, getPathArc } from './utils/helper';import { GaugeTheme } from './utils/enum';import { Border, Margin, Font, TooltipSettings } from './model/base';import { BorderModel, MarginModel, FontModel, TooltipSettingsModel } from './model/base-model';import { Axis, Range, Pointer, Annotation, VisibleRangeModel } from './axes/axis';import { Annotations } from './annotations/annotations';import { GaugeTooltip } from './user-interaction/tooltip';import { AxisModel } from './axes/axis-model';import { load, loaded, gaugeMouseMove, gaugeMouseLeave, gaugeMouseDown } from './model/constants';import { gaugeMouseUp, dragEnd, dragMove, dragStart, resized } from './model/constants';import { AxisLayoutPanel } from './axes/axis-panel';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class CircularGauge
 */
export interface CircularGaugeModel extends ComponentModel{

    /**
     * The width of the circular gauge as a string in order to provide input as both like '100px' or '100%'.
     * If specified as '100%, gauge will render to the full width of its parent element.
     * @default null
     */

    width?: string;

    /**
     * The height of the circular gauge as a string in order to provide input as both like '100px' or '100%'.
     * If specified as '100%, gauge will render to the full height of its parent element.
     * @default null
     */

    height?: string;

    /**
     * Options for customizing the color and width of the gauge border.
     */

    border?: BorderModel;

    /**
     * The background color of the gauge, which accepts value in hex, rgba as a valid CSS color string.
     * @default 'transparent'
     */
    background?: string;

    /**
     * Title for gauge
     * @default ''
     */

    title?: string;

    /**
     * Options for customizing the title of Gauge.
     */

    titleStyle?: FontModel;

    /**
     *  Options to customize the left, right, top and bottom margins of the gauge.
     */

    margin?: MarginModel;

    /**
     * Options for customizing the axes of gauge
     */

    axes?: AxisModel[];

    /**
     * Options for customizing the tooltip of gauge.
     */

    tooltip?: TooltipSettingsModel;

    /**
     * If set true, pointers can able to drag on interaction.
     * @default false
     */
    enablePointerDrag?: boolean;

    /**
     * X coordinate of the circular gauge center point, which takes values either in pixels or in percentage.
     * @default null
     */

    centerX?: string;

    /**
     * Y coordinate of the circular gauge center point, which takes values either in pixels or in percentage.
     * @default null
     */

    centerY?: string;

    /**
     * To place the half or quarter circle in center position, if values not specified for centerX and centerY.
     * @default false
     */
    moveToCenter?: boolean;

    /**
     * Specifies the theme for circular gauge.
     * * Material - Gauge render with material theme.
     * * Fabric - Gauge render with fabric theme.
     * @default Material
     */
    theme?: GaugeTheme;

    /**
     * Specifies whether a grouping separator should be used for a number.
     * @default false
     */
    useGroupingSeparator?: boolean;

    /**
     * Information about gauge for assistive technology.
     * @default null
     */
    description?: string;

    /**
     * TabIndex value for the gauge.
     * @default 1
     */
    tabIndex?: number;

    /**
     * Triggers after gauge loaded.
     * @event
     */
    loaded?: EmitType<ILoadedEventArgs>;

    /**
     * Triggers before gauge load.
     * @event
     */
    load?: EmitType<ILoadedEventArgs>;

    /**
     * Triggers after animation gets completed for pointers.
     * @event
     */
    animationComplete?: EmitType<IAnimationCompleteEventArgs>;

    /**
     * Triggers before each axis label gets rendered.
     * @event
     */
    axisLabelRender?: EmitType<IAxisLabelRenderEventArgs>;

    /**
     * Triggers before the radius gets rendered
     * @event
     */
    radiusCalculate?: EmitType<IRadiusCalculateEventArgs>;

    /**
     * Triggers before each annotation gets rendered.
     * @event
     */
    annotationRender?: EmitType<IAnnotationRenderEventArgs>;

    /**
     * Triggers before the tooltip for pointer gets rendered.
     * @event
     */

    tooltipRender?: EmitType<ITooltipRenderEventArgs>;

    /**
     * Triggers before the pointer is dragged.
     * @event
     */

    dragStart?: EmitType<IPointerDragEventArgs>;

    /**
     * Triggers while dragging the pointers.
     * @event
     */

    dragMove?: EmitType<IPointerDragEventArgs>;

    /**
     * Triggers after the pointer is dragged.
     * @event
     */

    dragEnd?: EmitType<IPointerDragEventArgs>;

    /**
     * Triggers on hovering the circular gauge.
     * @event
     */

    gaugeMouseMove?: EmitType<IMouseEventArgs>;

    /**
     * Triggers while cursor leaves the circular gauge.
     * @event
     */

    gaugeMouseLeave?: EmitType<IMouseEventArgs>;

    /**
     * Triggers on mouse down.
     * @event
     */

    gaugeMouseDown?: EmitType<IMouseEventArgs>;

    /**
     * Triggers on mouse up.
     * @event
     */

    gaugeMouseUp?: EmitType<IMouseEventArgs>;

    /**
     * Triggers after window resize.
     * @event
     */

    resized?: EmitType<IResizeEventArgs>;

}