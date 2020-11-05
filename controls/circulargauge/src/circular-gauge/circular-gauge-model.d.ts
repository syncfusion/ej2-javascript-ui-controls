import { Property, NotifyPropertyChanges, Component, INotifyPropertyChanged, isBlazor } from '@syncfusion/ej2-base';import { Complex, Browser, isNullOrUndefined, resetBlazorTemplate } from '@syncfusion/ej2-base';import { Event, EmitType, EventHandler, Collection, Internationalization, ModuleDeclaration } from '@syncfusion/ej2-base';import { remove, createElement } from '@syncfusion/ej2-base';import { SvgRenderer } from '@syncfusion/ej2-svg-base';import { ILoadedEventArgs, IAnimationCompleteEventArgs, IVisiblePointer } from './model/interface';import { IVisibleRange, IThemeStyle } from './model/interface';import { IAxisLabelRenderEventArgs, IRadiusCalculateEventArgs, IPointerDragEventArgs, IResizeEventArgs } from './model/interface';import { ITooltipRenderEventArgs, ILegendRenderEventArgs, IAnnotationRenderEventArgs }from './model/interface';import { IMouseEventArgs, IPrintEventArgs } from './model/interface';import { TextOption, textElement, RectOption, getAngleFromLocation }from './utils/helper';import { getValueFromAngle, removeElement, getRange } from './utils/helper';import { Size, stringToNumber, measureText, Rect, GaugeLocation, getElement, getPointer, setStyles, toPixel } from './utils/helper';import { getAngleFromValue, getPathArc } from './utils/helper';import { GaugeTheme } from './utils/enum';import { Border, Margin, Font, TooltipSettings } from './model/base';import { BorderModel, MarginModel, FontModel, TooltipSettingsModel } from './model/base-model';import { Axis, Range, Pointer, Annotation, VisibleRangeModel } from './axes/axis';import { Annotations } from './annotations/annotations';import { GaugeTooltip } from './user-interaction/tooltip';import { AxisModel } from './axes/axis-model';import { load, loaded, gaugeMouseMove, gaugeMouseLeave, gaugeMouseDown, pointerMove,  } from './model/constants';import {  rangeMove, pointerStart, rangeStart, pointerEnd, rangeEnd } from './model/constants';import { gaugeMouseUp, dragEnd, dragMove, dragStart, resized } from './model/constants';import { AxisLayoutPanel } from './axes/axis-panel';import { getThemeStyle } from './model/theme';import { LegendSettingsModel } from './legend/legend-model';import { LegendSettings, Legend } from './legend/legend';import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';import { ExportType } from '../circular-gauge/utils/enum';import { PdfExport } from  './model/pdf-export';import { ImageExport } from './model/image-export';import { Print } from './model/print';import { Gradient } from './axes/gradient';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class CircularGauge
 */
export interface CircularGaugeModel extends ComponentModel{

    /**
     * Sets and gets the width of the circular gauge as a string in order to provide input as both like '100px' or '100%'.
     * If specified as '100%, gauge will render to the full width of its parent element.
     * @default null
     */

    width?: string;

    /**
     * Sets and gets the height of the circular gauge as a string in order to provide input as both like '100px' or '100%'.
     * If specified as '100%, gauge will render to the full height of its parent element.
     * @default null
     */

    height?: string;

    /**
     * Sets and gets the options for customizing the color and width of the gauge border.
     */
    border?: BorderModel;

    /**
     * Sets and gets the background color of the gauge. This property accepts value in hex code, rgba string as a valid CSS color string.
     * @default null
     */
    background?: string;

    /**
     * Sets and gets the title for circular gauge.
     * @default ''
     */
    title?: string;

    /**
     * Sets and gets the options for customizing the title for circular gauge.
     */
    titleStyle?: FontModel;

    /**
     * Sets and gets the options to customize the left, right, top and bottom margins of the circular gauge.
     */
    margin?: MarginModel;

    /**
     * Sets and gets the options for customizing the axes of circular gauge.
     */
    axes?: AxisModel[];

    /**
     * Sets and gets the options for customizing the tooltip of gauge.
     */
    tooltip?: TooltipSettingsModel;

    /**
     * Enables and disables drag movement of the pointer in the circular gauge.
     * @default false
     */
    enablePointerDrag?: boolean;

    /**
     * Enables and disables the drag movement of the ranges in the circular gauge.
     * @default false
     */
    enableRangeDrag?: boolean;

    /**
     * Enables and disables the print functionality in circular gauge.
     * @default false
     */
    allowPrint?: boolean;

    /**
     * Enables and disables the export to image functionality in circular gauge.
     * @default false
     */
    allowImageExport?: boolean;

    /**
     * Enables and disables the export to pdf functionality in circular gauge.
     * @default false
     */
    allowPdfExport?: boolean;

    /**
     * Sets and gets the X coordinate of the circular gauge.
     * @default null
     */

    centerX?: string;

    /**
     * Sets and gets the Y coordinate of the circular gauge.
     * @default null
     */

    centerY?: string;

    /**
     * Enables and disables to place the half or quarter circle in center position, if values not specified for centerX and centerY.
     * @default false
     */
    moveToCenter?: boolean;

    /**
     * Sets and gets the themes supported for circular gauge.
     * @default Material
     */
    theme?: GaugeTheme;

    /**
     * Enables and disables the grouping separator should be used for a number.
     * @default false
     */
    useGroupingSeparator?: boolean;

    /**
     * Sets and gets the information about gauge for assistive technology.
     * @default null
     */
    description?: string;

    /**
     * Sets and gets the tab index value for the circular gauge.
     * @default 1
     */
    tabIndex?: number;

    /**
     * Enables and disables left, right, top and bottom spacing in the circular gauge.
     * @default true
     */
    allowMargin?: boolean;

    /**
     * Sets and gets the options for customizing the legend of the circular gauge.
     */
    legendSettings?: LegendSettingsModel;

    /**
     * Triggers after the circular gauge gets loaded.
     * @event
     * @blazorProperty 'Loaded'
     */
    loaded?: EmitType<ILoadedEventArgs>;

    /**
     * Triggers before the circular gauge gets loaded.
     * @event
     * @blazorProperty 'OnLoad'
     */
    load?: EmitType<ILoadedEventArgs>;

    /**
     * Triggers after the animation gets completed for pointers.
     * @event
     * @blazorProperty 'AnimationCompleted'
     */
    animationComplete?: EmitType<IAnimationCompleteEventArgs>;

    /**
     * Triggers before each axis label gets rendered.
     * @event
     * @blazorProperty 'AxisLabelRendering'
     */
    axisLabelRender?: EmitType<IAxisLabelRenderEventArgs>;

    /**
     * Triggers before the radius for the circular gauge gets calculated.
     * @event
     * @blazorProperty 'OnRadiusCalculate'
     */
    radiusCalculate?: EmitType<IRadiusCalculateEventArgs>;

    /**
     * Triggers before each annotation for the circular gauge gets rendered.
     * @event
     * @blazorProperty 'AnnotationRendering'
     */
    annotationRender?: EmitType<IAnnotationRenderEventArgs>;

    /**
     * Triggers before each legend for the circular gauge gets rendered.
     * @event
     * @deprecated
     * @blazorProperty 'legendRender'
     */
    legendRender?: EmitType<ILegendRenderEventArgs>;

    /**
     * Triggers before the tooltip for pointer of the circular gauge gets rendered.
     * @event
     * @blazorProperty 'TooltipRendering'
     */

    tooltipRender?: EmitType<ITooltipRenderEventArgs>;

    /**
     * Triggers before the pointer is dragged.
     * @event
     * @blazorProperty 'OnDragStart'
     */

    dragStart?: EmitType<IPointerDragEventArgs>;

    /**
     * Triggers while dragging the pointers.
     * @event
     * @blazorProperty 'OnDragMove'
     */

    dragMove?: EmitType<IPointerDragEventArgs>;

    /**
     * Triggers after the pointer is dragged.
     * @event
     * @blazorProperty 'OnDragEnd'
     */
    dragEnd?: EmitType<IPointerDragEventArgs>;

    /**
     * Triggers on hovering the circular gauge.
     * @event
     * @blazorProperty 'OnGaugeMouseMove'
     */

    gaugeMouseMove?: EmitType<IMouseEventArgs>;

    /**
     * Triggers while cursor leaves the circular gauge.
     * @event
     * @blazorProperty 'OnGaugeMouseLeave'
     */

    gaugeMouseLeave?: EmitType<IMouseEventArgs>;

    /**
     * Triggers on mouse down.
     * @event
     * @blazorProperty 'OnGaugeMouseDown'
     */

    gaugeMouseDown?: EmitType<IMouseEventArgs>;

    /**
     * Triggers on mouse up.
     * @event
     * @blazorProperty 'OnGaugeMouseUp'
     */

    gaugeMouseUp?: EmitType<IMouseEventArgs>;

    /**
     * Triggers after window resize.
     * @event
     * @blazorProperty 'Resizing'
     */

    resized?: EmitType<IResizeEventArgs>;

    /**
     * Triggers before the prints gets started.
     * @event
     * @blazorProperty 'OnPrint'
     */

    beforePrint?: EmitType<IPrintEventArgs>;

}