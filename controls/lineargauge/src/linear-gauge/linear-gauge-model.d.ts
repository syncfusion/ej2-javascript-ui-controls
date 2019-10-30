import { Component, Property, NotifyPropertyChanges, Internationalization, ModuleDeclaration, isBlazor } from '@syncfusion/ej2-base';import { EmitType, INotifyPropertyChanged, setCulture, Browser, resetBlazorTemplate } from '@syncfusion/ej2-base';import { Event, EventHandler, Complex, Collection, isNullOrUndefined, remove, createElement } from '@syncfusion/ej2-base';import { Border, Font, Container, Margin, Annotation, TooltipSettings } from './model/base';import { FontModel, BorderModel, ContainerModel, MarginModel, AnnotationModel, TooltipSettingsModel } from './model/base-model';import { AxisModel } from './axes/axis-model';import { Axis, Pointer } from './axes/axis';import { load, loaded, gaugeMouseMove, gaugeMouseLeave, gaugeMouseDown, gaugeMouseUp, resized, valueChange } from './model/constant';import { ILoadedEventArgs, ILoadEventArgs, IAnimationCompleteEventArgs, IAnnotationRenderEventArgs } from './model/interface';import { ITooltipRenderEventArgs, IVisiblePointer, IMouseEventArgs, IAxisLabelRenderEventArgs, IMoveCursor } from './model/interface';import { IResizeEventArgs, IValueChangeEventArgs, IThemeStyle } from './model/interface';import { Size, valueToCoefficient, calculateShapes, stringToNumber, removeElement, getElement, VisibleRange } from './utils/helper';import { measureText, Rect, TextOption, textElement, GaugeLocation, RectOption, PathOption } from './utils/helper';import { getBox, withInRange, getPointer, convertPixelToValue, isPointerDrag } from './utils/helper';import { Orientation, LinearGaugeTheme } from './utils/enum';import { AxisLayoutPanel } from './axes/axis-panel';import { SvgRenderer } from '@syncfusion/ej2-svg-base';import { AxisRenderer } from './axes/axis-renderer';import { Annotations } from './annotations/annotations';import { GaugeTooltip } from './user-interaction/tooltip';import { getThemeStyle } from './model/theme';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class LinearGauge
 */
export interface LinearGaugeModel extends ComponentModel{

    /**
     * The width of the Linear gauge as a string in order to provide input as both like '100px' or '100%'.
     * If specified as '100%, gauge will render to the full width of its parent element.
     * @default null
     */

    width?: string;

    /**
     * The height of the Linear gauge as a string in order to provide input as both like '100px' or '100%'.
     * If specified as '100%, gauge will render to the full height of its parent element.
     * @default null
     */

    height?: string;

    /**
     * Specifies the gauge will rendered either horizontal or vertical orientation.
     * @default Vertical
     */
    orientation?: Orientation;

    /**
     *  Options to customize the left, right, top and bottom margins of the gauge.
     */

    margin?: MarginModel;

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
     * Specifies the title for linear gauge.
     */

    title?: string;

    /**
     * Options for customizing the title appearance of linear gauge.
     */

    titleStyle?: FontModel;

    /**
     * Options for customizing the container linear gauge.
     */

    container?: ContainerModel;

    /**
     *  Options for customizing the axes of linear gauge.
     */

    axes?: AxisModel[];

    /**
     * Options for customizing the tooltip in linear gauge.
     */

    tooltip?: TooltipSettingsModel;

    /**
     *  Options for customizing the annotation of linear gauge.
     */
    annotations?: AnnotationModel[];

    /**
     * Specifies color palette for axis ranges.
     * @default []
     */
    rangePalettes?: string[];

    /**
     * Specifies whether a grouping separator should be used for a number.
     * @default false
     */
    useGroupingSeparator?: boolean;

    /**
     * Specifies the description for linear gauge.
     * @default null
     */
    description?: string;

    /**
     * TabIndex value for the gauge.
     * @default 1
     */
    tabIndex?: number;

    /**
     * To apply internationalization for gauge
     * @default null
     */
    format?: string;

    /**
     * Specifies the theme for the maps.
     * @default Material
     */
    theme?: LinearGaugeTheme;

    /**
     * Triggers after gauge loaded.
     * @event
     * @blazorProperty 'Loaded'
     */
    loaded?: EmitType<ILoadedEventArgs>;

    /**
     * Triggers before gauge load.
     * @event
     * @blazorProperty 'OnLoad'
     */
    load?: EmitType<ILoadEventArgs>;

    /**
     * Triggers after complete the animation for pointer.
     * @event
     * @blazorProperty 'AnimationCompleted'
     */
    animationComplete?: EmitType<IAnimationCompleteEventArgs>;

    /**
     * Triggers before each axis label gets rendered.
     * @event
     * @deprecated
     * @blazorProperty 'AxisLabelRendering'
     */
    axisLabelRender?: EmitType<IAxisLabelRenderEventArgs>;

    /**
     * Triggers before each annotation gets rendered.
     * @event
     * @blazorProperty 'AnnotationRendering'
     */
    annotationRender?: EmitType<IAnnotationRenderEventArgs>;

    /**
     * Triggers before the tooltip get rendered.
     * @event
     * @deprecated
     * @blazorProperty 'TooltipRendering'
     */

    tooltipRender?: EmitType<ITooltipRenderEventArgs>;

    /**
     * Triggers when mouse move on gauge area.
     * @event
     * @blazorProperty 'OnGaugeMouseMove'
     */

    gaugeMouseMove?: EmitType<IMouseEventArgs>;

    /**
     * Triggers when mouse leave from the gauge area .
     * @event
     * @blazorProperty 'OnGaugeMouseLeave'
     */

    gaugeMouseLeave?: EmitType<IMouseEventArgs>;

    /**
     * Triggers when mouse down on gauge area.
     * @event
     * @blazorProperty 'OnGaugeMouseDown'
     */

    gaugeMouseDown?: EmitType<IMouseEventArgs>;

    /**
     * Triggers when mouse up on gauge area.
     * @event
     * @blazorProperty 'OnGaugeMouseUp'
     */

    gaugeMouseUp?: EmitType<IMouseEventArgs>;

    /**
     * Triggers while drag the pointer.
     * @event
     * @deprecated
     * @blazorProperty 'ValueChange'
     */

    valueChange?: EmitType<IValueChangeEventArgs>;

    /**
     * Triggers after window resize.
     * @event
     * @blazorProperty 'Resizing'
     */

    resized?: EmitType<IResizeEventArgs>;

}