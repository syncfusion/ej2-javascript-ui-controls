import { Component, Property, NotifyPropertyChanges, Internationalization, ModuleDeclaration, isBlazor } from '@syncfusion/ej2-base';import { EmitType, INotifyPropertyChanged, setCulture, Browser, resetBlazorTemplate } from '@syncfusion/ej2-base';import { Event, EventHandler, Complex, Collection, isNullOrUndefined, remove, createElement } from '@syncfusion/ej2-base';import { Border, Font, Container, Margin, Annotation, TooltipSettings } from './model/base';import { FontModel, BorderModel, ContainerModel, MarginModel, AnnotationModel, TooltipSettingsModel } from './model/base-model';import { AxisModel } from './axes/axis-model';import { Axis, Pointer } from './axes/axis';import { load, loaded, gaugeMouseMove, gaugeMouseLeave, gaugeMouseDown, gaugeMouseUp, resized, valueChange } from './model/constant';import { ILoadedEventArgs, ILoadEventArgs, IAnimationCompleteEventArgs, IAnnotationRenderEventArgs } from './model/interface';import { ITooltipRenderEventArgs, IVisiblePointer, IMouseEventArgs, IAxisLabelRenderEventArgs, IMoveCursor } from './model/interface';import { IResizeEventArgs, IValueChangeEventArgs, IThemeStyle, IPrintEventArgs, IPointerDragEventArgs } from './model/interface';import { Size, valueToCoefficient, calculateShapes, stringToNumber, removeElement, getElement, VisibleRange } from './utils/helper';import { measureText, Rect, TextOption, textElement, GaugeLocation, RectOption, PathOption } from './utils/helper';import { getBox, withInRange, getPointer, convertPixelToValue, isPointerDrag } from './utils/helper';import { Orientation, LinearGaugeTheme, LabelPlacement } from './utils/enum';import { dragEnd, dragMove, dragStart } from './model/constant';import { AxisLayoutPanel } from './axes/axis-panel';import { SvgRenderer } from '@syncfusion/ej2-svg-base';import { AxisRenderer } from './axes/axis-renderer';import { Annotations } from './annotations/annotations';import { GaugeTooltip } from './user-interaction/tooltip';import { getThemeStyle } from './model/theme';import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';import { ExportType } from '../linear-gauge/utils/enum';import { Print } from './model/print';import { PdfExport } from './model/pdf-export';import { ImageExport } from './model/image-export';import { Gradient } from './axes/gradient';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class LinearGauge
 */
export interface LinearGaugeModel extends ComponentModel{

    /**
     * Specifies the width of the linear gauge as a string in order to provide input as both like '100px' or '100%'.
     * If specified as '100%, gauge will render to the full width of its parent element.
     * @default null
     */

    width?: string;

    /**
     * Enables or disables the gauge to be rendered to the complete width.
     * @default true
     */
    allowMargin?: boolean;

    /**
     * Specifies the height of the linear gauge as a string in order to provide input as both like '100px' or '100%'.
     * If specified as '100%, gauge will render to the full height of its parent element.
     * @default null
     */

    height?: string;

    /**
     * Specifies the orientation of the rendering of the linear gauge.
     * @default Vertical
     */
    orientation?: Orientation;

    /**
     * Specifies the placement of the label in linear gauge.
     * @default None
     */
    edgeLabelPlacement?: LabelPlacement;

    /**
     * Enables or disables the print functionality in linear gauge.
     * @default false
     */
    allowPrint?: boolean;

    /**
      * Enables or disables the export to image functionality in linear gauge.
      * @default false
      */
    allowImageExport?: boolean;

    /**
      * Enables or disables the export to PDF functionality in linear gauge.
      * @default false
      */
    allowPdfExport?: boolean;

    /**
     * Specifies the options to customize the margins of the linear gauge.
     */

    margin?: MarginModel;

    /**
     * Specifies the options for customizing the color and width of the border for linear gauge.
     */

    border?: BorderModel;

    /**
     * Specifies the background color of the gauge. This property accepts value in hex code, rgba string as a valid CSS color string.
     * @default 'transparent'
     */
    background?: string;

    /**
     * Specifies the title for linear gauge.
     */

    title?: string;

    /**
     * Specifies the options for customizing the appearance of title for linear gauge.
     */

    titleStyle?: FontModel;

    /**
     * Specifies the options for customizing the container in linear gauge.
     */

    container?: ContainerModel;

    /**
     * Specifies the options for customizing the axis in linear gauge.
     */

    axes?: AxisModel[];

    /**
     * Specifies the options for customizing the tooltip in linear gauge.
     */

    tooltip?: TooltipSettingsModel;

    /**
     * Specifies the options for customizing the annotation of linear gauge.
     */
    annotations?: AnnotationModel[];

    /**
     * Specifies the color palette for axis ranges in linear gauge.
     * @default []
     */
    rangePalettes?: string[];

    /**
     * Enables or disables a grouping separator should be used for a number.
     * @default false
     */
    useGroupingSeparator?: boolean;

    /**
     * Specifies the description for linear gauge.
     * @default null
     */
    description?: string;

    /**
     * Specifies the tab index value for the linear gauge.
     * @default 1
     */
    tabIndex?: number;

    /**
     * Specifies the format to apply for internationalization in linear gauge.
     * @default null
     */
    format?: string;

    /**
     * Specifies the theme supported for the linear gauge.
     * @default Material
     */
    theme?: LinearGaugeTheme;

    /**
     * Triggers after the gauge gets rendered.
     * @event
     * @blazorProperty 'Loaded'
     */
    loaded?: EmitType<ILoadedEventArgs>;

    /**
     * Triggers before the gauge gets rendered.
     * @event
     * @blazorProperty 'OnLoad'
     */
    load?: EmitType<ILoadEventArgs>;

    /**
     * Triggers after completing the animation for pointer.
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
     * Triggers when performing the mouse move operation on gauge area.
     * @event
     * @blazorProperty 'OnGaugeMouseMove'
     */

    gaugeMouseMove?: EmitType<IMouseEventArgs>;

    /**
     * Triggers when performing the mouse leave operation from the gauge area.
     * @event
     * @blazorProperty 'OnGaugeMouseLeave'
     */

    gaugeMouseLeave?: EmitType<IMouseEventArgs>;

    /**
     * Triggers when performing the mouse down operation on gauge area.
     * @event
     * @blazorProperty 'OnGaugeMouseDown'
     */

    gaugeMouseDown?: EmitType<IMouseEventArgs>;

    /**
     * Triggers when performing mouse up operation on gauge area.
     * @event
     * @blazorProperty 'OnGaugeMouseUp'
     */

    gaugeMouseUp?: EmitType<IMouseEventArgs>;

    /**
     * Triggers while changing the value of the pointer by UI interaction.
     * @event
     * @blazorProperty 'ValueChange'
     */

    valueChange?: EmitType<IValueChangeEventArgs>;

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