/* eslint-disable max-len */
/* eslint-disable brace-style */
/**
 * Circular Gauge
 */
import { Property, NotifyPropertyChanges, Component, INotifyPropertyChanged } from '@syncfusion/ej2-base';
import { Complex, Browser, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Event, EmitType, EventHandler, Collection, Internationalization, ModuleDeclaration } from '@syncfusion/ej2-base';
import { remove, createElement } from '@syncfusion/ej2-base';
import { SvgRenderer } from '@syncfusion/ej2-svg-base';
import { CircularGaugeModel } from './circular-gauge-model';
import { ILoadedEventArgs, IAnimationCompleteEventArgs, IVisiblePointer } from './model/interface';
import { IVisibleRange, IThemeStyle } from './model/interface';
import { IAxisLabelRenderEventArgs, IRadiusCalculateEventArgs, IPointerDragEventArgs, IResizeEventArgs } from './model/interface';
import { ITooltipRenderEventArgs, ILegendRenderEventArgs, IAnnotationRenderEventArgs }from './model/interface';
import { IMouseEventArgs, IPrintEventArgs } from './model/interface';
import { removeElement, getElement, stringToNumber, measureText, toPixel, textElement, getAngleFromValue, getAngleFromLocation, getPathArc, getPointer, RectOption, Size, GaugeLocation, Rect, TextOption } from './utils/helper-common';
import { setStyles, getValueFromAngle, getRange } from './utils/helper-circular-gauge';
import { GaugeTheme } from './utils/enum';
import { Border, Margin, Font, TooltipSettings } from './model/base';
import { BorderModel, MarginModel, FontModel, TooltipSettingsModel } from './model/base-model';
import { Axis, Range, Pointer, Annotation, VisibleRangeModel } from './axes/axis';
import { Annotations } from './annotations/annotations';
import { GaugeTooltip } from './user-interaction/tooltip';
import { AxisModel } from './axes/axis-model';
import { load, loaded, gaugeMouseMove, gaugeMouseLeave, gaugeMouseDown, pointerMove } from './model/constants';
import {  rangeMove, pointerStart, rangeStart, pointerEnd, rangeEnd } from './model/constants';
import { gaugeMouseUp, dragEnd, dragMove, dragStart, resized } from './model/constants';
import { AxisLayoutPanel } from './axes/axis-panel';
import { getThemeStyle } from './model/theme';
import { LegendSettingsModel } from './legend/legend-model';
import { LegendSettings, Legend } from './legend/legend';
import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';
import { ExportType } from '../circular-gauge/utils/enum';
import { PdfExport } from  './model/pdf-export';
import { ImageExport } from './model/image-export';
import { Print } from './model/print';
import { Gradient } from './axes/gradient';

/**
 * Represents the circular gauge control.
 * ```html
 * <div id="gauge"/>
 * <script>
 *   var gaugeObj = new CircularGauge();
 *   gaugeObj.appendTo("#gauge");
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class CircularGauge extends Component<HTMLElement> implements INotifyPropertyChanged {

    //Module Declaration of circular gauge

    /**
     * Sets and gets the module that is used to add annotation in the circular gauge.
     */
    public annotationsModule: Annotations;

    /**
     * Sets and gets the module that is used to add Print in the circular gauge.
     *
     * @private
     */
    public printModule : Print;

    /**
     * Sets and gets the module that is used to add ImageExport in the circular gauge.
     *
     * @private
     */
    public imageExportModule: ImageExport;

    /**
     * Sets and gets the module that is used to add pdfExport in the circular gauge.
     *
     * @private
     */
    public pdfExportModule: PdfExport;

    /**
     * Sets and gets the module that is used to show the tooltip in the circular gauge.
     */
    public tooltipModule: GaugeTooltip;

    /**
     * Sets and gets the module that is used to manipulate and add legend to the circular gauge.
     */
    public legendModule: Legend;

    /**
     * Sets and gets the module that enables the gradient option for pointer and ranges.
     *
     * @private
     */
    public gradientModule: Gradient;

    /**
     * Sets and gets the width of the circular gauge as a string in order to provide input as both like '100px' or '100%'.
     * If specified as '100%, gauge will render to the full width of its parent element.
     *
     * @default null
     */

    @Property(null)
    public width: string;

    /**
     * Sets and gets the height of the circular gauge as a string in order to provide input as both like '100px' or '100%'.
     * If specified as '100%, gauge will render to the full height of its parent element.
     *
     * @default null
     */

    @Property(null)
    public height: string;

    /**
     * Sets and gets the options for customizing the color and width of the gauge border.
     */
    @Complex<BorderModel>({ color: 'transparent', width: 0 }, Border)
    public border: BorderModel;

    /**
     *
     */

    /**
     * Sets and gets the background color of the gauge. This property accepts value in hex code, rgba string as a valid CSS color string.
     *
     * @default null
     */
    @Property(null)
    public background: string;

    /**
     * Sets and gets the title for circular gauge.
     *
     * @default ''
     */
    @Property('')
    public title: string;

    /**
     * Sets and gets the options for customizing the title for circular gauge.
     */
    @Complex<FontModel>({ size: null, color: null, fontWeight: null, fontFamily: null }, Font)
    public titleStyle: FontModel;

    /**
     * Sets and gets the options to customize the left, right, top and bottom margins of the circular gauge.
     */
    @Complex<MarginModel>({}, Margin)
    public margin: MarginModel;

    /**
     * Sets and gets the options for customizing the axes of circular gauge.
     */
    @Collection<AxisModel>([{}], Axis)
    public axes: AxisModel[];

    /**
     * Sets and gets the options for customizing the tooltip of gauge.
     */
    @Complex<TooltipSettingsModel>({}, TooltipSettings)
    public tooltip: TooltipSettingsModel;

    /**
     * Enables and disables drag movement of the pointer in the circular gauge.
     *
     * @default false
     */
    @Property(false)
    public enablePointerDrag: boolean;

    /**
     * Enables and disables the drag movement of the ranges in the circular gauge.
     *
     * @default false
     */
    @Property(false)
    public enableRangeDrag: boolean;

    /**
     * Enables and disables the print functionality in circular gauge.
     *
     * @default false
     */
    @Property(false)
    public allowPrint: boolean;

    /**
     * Enables and disables the export to image functionality in circular gauge.
     *
     * @default false
     */
    @Property(false)
    public allowImageExport: boolean;

    /**
     * Enables and disables the export to pdf functionality in circular gauge.
     *
     * @default false
     */
    @Property(false)
    public allowPdfExport: boolean;

    /**
     * Sets and gets the X coordinate of the circular gauge.
     *
     * @default null
     */

    @Property(null)
    public centerX: string;

    /**
     * Sets and gets the Y coordinate of the circular gauge.
     *
     * @default null
     */

    @Property(null)
    public centerY: string;

    /**
     * Enables and disables to place the half or quarter circle in center position, if values not specified for centerX and centerY.
     *
     * @default false
     */
    @Property(false)
    public moveToCenter: boolean;

    /**
     * Sets and gets the themes supported for circular gauge.
     *
     * @default Material
     */
    @Property('Material')
    public theme: GaugeTheme;

    /**
     * Enables and disables the grouping separator should be used for a number.
     *
     * @default false
     */
    @Property(false)
    public useGroupingSeparator: boolean;

    /**
     * Sets and gets the information about gauge for assistive technology.
     *
     * @default null
     */
    @Property(null)
    public description: string;

    /**
     * Sets and gets the tab index value for the circular gauge.
     *
     * @default 1
     */
    @Property(1)
    public tabIndex: number;

    /**
     * Enables and disables left, right, top and bottom spacing in the circular gauge.
     *
     * @default true
     */
    @Property(true)
    public allowMargin: boolean;

    /**
     * Sets and gets the options for customizing the legend of the circular gauge.
     */
    @Complex<LegendSettingsModel>({}, LegendSettings)
    public legendSettings: LegendSettingsModel;

    /**
     * Triggers after the circular gauge gets loaded.
     *
     * @event
     */
    @Event()
    public loaded: EmitType<ILoadedEventArgs>;

    /**
     * Triggers before the circular gauge gets loaded.
     *
     * @event
     */
    @Event()
    public load: EmitType<ILoadedEventArgs>;

    /**
     * Triggers after the animation gets completed for pointers.
     *
     * @event
     */
    @Event()
    public animationComplete: EmitType<IAnimationCompleteEventArgs>;

    /**
     * Triggers before each axis label gets rendered.
     *
     * @event
     */
    @Event()
    public axisLabelRender: EmitType<IAxisLabelRenderEventArgs>;

    /**
     * Triggers before the radius for the circular gauge gets calculated.
     *
     * @event
     */
    @Event()
    public radiusCalculate: EmitType<IRadiusCalculateEventArgs>;


    /**
     * Triggers before each annotation for the circular gauge gets rendered.
     *
     * @event
     */
    @Event()
    public annotationRender: EmitType<IAnnotationRenderEventArgs>;

    /**
     * Triggers before each legend for the circular gauge gets rendered.
     *
     * @event
     * @deprecated
     */
    @Event()
    public legendRender: EmitType<ILegendRenderEventArgs>;

    /**
     * Triggers before the tooltip for pointer of the circular gauge gets rendered.
     *
     * @event
     */

    @Event()
    public tooltipRender: EmitType<ITooltipRenderEventArgs>;

    /**
     * Triggers before the pointer is dragged.
     *
     * @event
     */

    @Event()
    public dragStart: EmitType<IPointerDragEventArgs>;

    /**
     * Triggers while dragging the pointers.
     *
     * @event
     */

    @Event()
    public dragMove: EmitType<IPointerDragEventArgs>;

    /**
     * Triggers after the pointer is dragged.
     *
     * @event
     */
    @Event()
    public dragEnd: EmitType<IPointerDragEventArgs>;

    /**
     * Triggers on hovering the circular gauge.
     *
     * @event
     */

    @Event()
    public gaugeMouseMove: EmitType<IMouseEventArgs>;


    /**
     * Triggers while cursor leaves the circular gauge.
     *
     * @event
     */

    @Event()
    public gaugeMouseLeave: EmitType<IMouseEventArgs>;

    /**
     * Triggers on mouse down.
     *
     * @event
     */

    @Event()
    public gaugeMouseDown: EmitType<IMouseEventArgs>;

    /**
     * Triggers on mouse up.
     *
     * @event
     */

    @Event()
    public gaugeMouseUp: EmitType<IMouseEventArgs>;

    /**
     * Triggers after window resize.
     *
     * @event
     */

    @Event()
    public resized: EmitType<IResizeEventArgs>;

    /**
     * Triggers before the prints gets started.
     *
     * @event
     */

    @Event()
    public beforePrint: EmitType<IPrintEventArgs>;

    /** @private */
    public renderer: SvgRenderer;
    /** @private */
    public svgObject: Element;
    /** @private */
    public availableSize: Size;
    /** @private */
    public intl: Internationalization;
    /** @private */
    private resizeTo: number;
    /** @private */
    public midPoint: GaugeLocation;
    /** @private */
    public activePointer: Pointer;
    /** @private */
    public activeAxis: Axis;
    /** @private */
    public activeRange: Range;
    /** @private */
    public gaugeRect: Rect;
    /** @private */
    public animatePointer: boolean;
    /** @private */
    public startValue: number;
    /** @private */
    public endValue: number;
    /** @private */
    private isRangeUpdate: boolean = false;
    /** @private */
    public centerXpoint: string;
    /** @private */
    public centerYpoint: string;
    /** @private */
    public allowComponentRender: boolean;
    /** @private */
    public isPropertyChange: boolean;
    /**
     * Render axis panel for gauge.
     *
     * @hidden
     * @private
     */
    public gaugeAxisLayoutPanel: AxisLayoutPanel;
    /**
     * @private
     */
    public themeStyle: IThemeStyle;
    /** @private */
    public isDrag: boolean = false;
    /** @private */
    public isTouch: boolean;
    /** @private Mouse position x */
    public mouseX: number;
    /** @private Mouse position y */
    public mouseY: number;

    /**
     * @private
     */
    public gradientCount: number = 0;


    /**
     * Constructor for creating the widget
     *
     * @param {CircularGaugeModel} options - Specifies the options
     * @param {string} element - Specifies the element
     * @hidden
     */
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    constructor(options?: CircularGaugeModel, element?: string | HTMLElement) {
        super(options, element);
    }

    /**
     * To create svg object, renderer and binding events for the container.
     *
     * @returns {void}
     */
    protected preRender(): void {
        this.unWireEvents();
        this.trigger(load, { gauge: this });
        this.initPrivateVariable();
        this.setCulture();
        this.createSvg();
        this.wireEvents();
    }
    /**
     * To render the circular gauge elements
     *
     * @returns {void}
     */
    protected render(): void {

        this.setTheme();

        this.calculateBounds();

        this.isPropertyChange = false;

        this.renderElements();

        this.renderComplete();
    }

    private setTheme(): void {

        this.themeStyle = getThemeStyle(this.theme);

    }

    /**
     * Method to unbind events for circular gauge
     *
     * @returns {void}
     */
    private unWireEvents(): void {
        EventHandler.remove(this.element, Browser.touchStartEvent, this.gaugeOnMouseDown);
        EventHandler.remove(this.element, Browser.touchMoveEvent, this.mouseMove);
        EventHandler.remove(this.element, Browser.touchEndEvent, this.mouseEnd);
        EventHandler.remove(this.element, 'click', this.gaugeOnMouseClick);
        EventHandler.remove(this.element, 'contextmenu', this.gaugeRightClick);
        EventHandler.remove(
            this.element, (Browser.isPointer ? 'pointerleave' : 'mouseleave'),
            this.mouseLeave
        );
        window.removeEventListener(
            (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize',
            this.gaugeResize
        );
    }

    /**
     * Method to bind events for circular gauge
     *
     * @returns {void}
     */
    private wireEvents(): void {
        /*! Bind the Event handler */
        EventHandler.add(this.element, Browser.touchStartEvent, this.gaugeOnMouseDown, this);
        EventHandler.add(this.element, Browser.touchMoveEvent, this.mouseMove, this);
        EventHandler.add(this.element, Browser.touchEndEvent, this.mouseEnd, this);
        EventHandler.add(this.element, 'click', this.gaugeOnMouseClick, this);
        EventHandler.add(this.element, 'contextmenu', this.gaugeRightClick, this);
        EventHandler.add(
            this.element,
            (Browser.isPointer ? 'pointerleave' : 'mouseleave'), this.mouseLeave, this
        );
        window.addEventListener(
            (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize',
            this.gaugeResize.bind(this)
        );
        /*! Apply the style for circular gauge */
        this.setGaugeStyle(<HTMLElement>this.element);
    }
    /**
     * Handles the mouse click on accumulation chart.
     *
     * @param {PointerEvent} e - Specifies the pointer event
     * @returns {boolean} - Returns the boolean value
     * @private
     */
    public gaugeOnMouseClick(e: PointerEvent): boolean {
        this.setMouseXY(e);
        if (this.legendModule && this.legendSettings.visible) {
            this.legendModule.click(e);
        }
        return false;
    }

    /**
     * Handles the mouse move.
     *
     * @param {PointerEvent} e - Specifies the pointer event
     * @returns {boolean} - Returns the boolean value
     * @private
     */
    public mouseMove(e: PointerEvent): boolean {
        this.setMouseXY(e);
        const args: IMouseEventArgs = this.getMouseArgs(e, 'touchmove', gaugeMouseMove);
        this.trigger('gaugeMouseMove', args, (observedArgs: IMouseEventArgs) => {
            let dragArgs: IPointerDragEventArgs;
            const tooltip: GaugeTooltip = this.tooltipModule;
            if (!args.cancel) {
                if ((this.enablePointerDrag || this.enableRangeDrag) && this.svgObject.getAttribute('cursor') !== 'grabbing') {
                    if ((args.target.id.indexOf('_Pointer_') !== -1 && this.enablePointerDrag) || (this.enableRangeDrag && args.target.id.indexOf('_Range_') !== -1)) {
                        this.svgObject.setAttribute('cursor', 'pointer');
                    } else {
                        this.svgObject.setAttribute('cursor', 'auto');
                    }
                }
                const svgElement: HTMLElement = <HTMLElement>getElement(this.element.id + '_svg');
                const extraWidth: number = this.element.getBoundingClientRect().left - svgElement.getBoundingClientRect().left;
                if (this.enablePointerDrag && this.activePointer) {
                    this.isDrag = true;
                    const dragPointInd: number = parseInt(this.activePointer.pathElement[0].id.slice(-1), 10);
                    const dragAxisInd: number = parseInt(this.activePointer.pathElement[0].id.split('_Axis_')[1], 10);
                    dragArgs = {
                        axis: this.activeAxis,
                        pointer: this.activePointer,
                        previousValue: this.activePointer.currentValue,
                        name: dragMove,
                        type: pointerMove,
                        currentValue: null,
                        axisIndex: dragAxisInd,
                        pointerIndex: dragPointInd
                    };
                    this.pointerDrag(new GaugeLocation(args.x + extraWidth, args.y), dragAxisInd, dragPointInd);
                    dragArgs.currentValue = this.activePointer.currentValue;
                    this.trigger(dragMove, dragArgs);
                    this.activeRange = null;
                }
                else if ( this.enableRangeDrag && this.activeRange) {
                    this.isDrag = true;
                    const dragAxisInd: number = parseInt(this.activeRange.pathElement[0].id.split('_Axis_')[1], 10);
                    const dragRangeInd: number = parseInt(this.activeRange.pathElement[0].id.split('Range_')[1], 10);
                    dragArgs = {
                        axis: this.activeAxis,
                        name: dragMove,
                        type: rangeMove,
                        range: this.activeRange,
                        axisIndex: dragAxisInd,
                        rangeIndex: dragRangeInd
                    };
                    this.rangeDrag(new GaugeLocation(args.x + extraWidth, args.y), dragAxisInd, dragRangeInd);
                    this.trigger(dragMove, dragArgs);
                }
            }
        });
        if (!this.isTouch) {
            if (this.legendModule && this.legendSettings.visible) {
                this.legendModule.move(e);
            }
        }
        this.notify(Browser.touchMoveEvent, e);
        return false;
    }

    /**
     * Handles the mouse leave.
     *
     * @param {PointerEvent} e - Specifies the pointer event
     * @returns {boolean} - Returns the boolean value
     * @private
     */
    public mouseLeave(e: PointerEvent): boolean {
        this.setMouseXY(e);
        this.activeAxis = null;
        this.activePointer = null;
        this.activeRange = null;
        this.svgObject.setAttribute('cursor', 'auto');
        const args: IMouseEventArgs = this.getMouseArgs(e, 'touchmove', gaugeMouseLeave);
        this.trigger(gaugeMouseLeave, args);
        return false;
    }

    /**
     * Handles the mouse right click.
     *
     * @param {MouseEvent | PointerEvent} event - Specifies the pointer or mouse event.
     * @returns {boolean} - Returns the boolean value.
     * @private
     */
    public gaugeRightClick(event: MouseEvent | PointerEvent): boolean {
        if (event.buttons === 2 || (<PointerEvent>event).pointerType === 'touch') {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
        return true;
    }

    /**
     * Handles the pointer draf while mouse move on gauge.
     *
     * @param {GaugeLocation} location - Specifies the location of the gauge
     * @param {number} axisIndex - Specifies the axis index
     * @param {number} pointerIndex - Specifies the pointer index
     * @returns {void}
     * @private
     */
    public pointerDrag(location: GaugeLocation, axisIndex?: number, pointerIndex?: number): void {
        const axis: Axis = this.activeAxis;
        const range: VisibleRangeModel = axis.visibleRange;
        const value: number = getValueFromAngle(
            getAngleFromLocation(this.midPoint, location), range.max, range.min,
            axis.startAngle, axis.endAngle,
            axis.direction === 'ClockWise'
        );
        if (value >= range.min && value <= range.max) {
            this.axes[axisIndex].pointers[pointerIndex].value = value;
            this.activePointer.currentValue = value;
            this.gaugeAxisLayoutPanel.pointerRenderer.setPointerValue(axis, this.activePointer, value);
        }
    }

    /**
     * Handles the range draf while mouse move on gauge.
     *
     * @param {GaugeLocation} location - Specifies the gauge location
     * @param {number} axisIndex - Specifies the axis index
     * @param {number} rangeIndex - Specifies the range index
     * @returns {void}
     * @private
     */
    public rangeDrag(location: GaugeLocation, axisIndex: number, rangeIndex: number): void {
        if (this.activeAxis) {
            const axis: Axis = this.activeAxis;
            const range: VisibleRangeModel = axis.visibleRange;
            const value : number = getValueFromAngle(
                getAngleFromLocation(this.midPoint, location), range.max, range.min,
                axis.startAngle, axis.endAngle,
                axis.direction === 'ClockWise'
            );
            if (value >= range.min && value <= range.max) {
                const previousValue1: number = this.activeRange.currentValue;
                this.activeRange.currentValue = value;
                const add : number = (this.activeRange.end - this.activeRange.start);
                const div : number = add / 2;
                const avg: number = parseFloat(this.activeRange.start.toString()) + div;
                const start: number = typeof this.activeRange.start === 'string' ? parseFloat(<string>this.activeRange.start) : this.activeRange.start;
                const end: number = typeof this.activeRange.end === 'string' ? parseFloat(<string>this.activeRange.end) : this.activeRange.end;
                this.startValue = (value < avg) ? value : ((previousValue1 < avg) ? previousValue1 : ((start < end) ? this.activeRange.start : this.activeRange.end));
                this.endValue  = (value < avg) ? ((previousValue1 > avg) ? previousValue1 : ((start < end) ? this.activeRange.end : this.activeRange.start)) : value;
                this.axes[axisIndex].ranges[rangeIndex].start = this.startValue;
                this.axes[axisIndex].ranges[rangeIndex].end = this.endValue;
            }
        }
    }
    /**
     * Handles the mouse down on gauge.
     *
     * @param {PointerEvent} e - Specifies the pointer event
     * @returns {boolean} - Returns the boolean value
     * @private
     */
    public gaugeOnMouseDown(e: PointerEvent): boolean {
        this.setMouseXY(e);
        let currentPointer: IVisiblePointer;
        let currentRange: IVisibleRange;
        const args: IMouseEventArgs = this.getMouseArgs(e, 'touchstart', gaugeMouseDown);
        this.trigger('gaugeMouseDown', args, (observedArgs: IMouseEventArgs) => {
            if (!args.cancel &&
                args.target.id.indexOf(this.element.id + '_Axis_') >= 0 &&
                args.target.id.indexOf('_Pointer_') >= 0 ) {
                currentPointer = getPointer(args.target.id, this);
                this.activeAxis = <Axis>this.axes[currentPointer.axisIndex];
                this.activePointer = <Pointer>this.activeAxis.pointers[currentPointer.pointerIndex];
                if (isNullOrUndefined(this.activePointer.pathElement)) {
                    this.activePointer.pathElement = [e.target as Element];
                }
                if (this.activePointer.type === 'Marker' && this.activePointer.markerShape === 'Text' && this.activePointer.pathElement.length === 0) {
                    this.activePointer.pathElement = [e.target as Element];
                }
                const pointInd: number = parseInt(this.activePointer.pathElement[0].id.slice(-1), 10);
                const axisInd: number = parseInt(this.activePointer.pathElement[0].id.split('_Axis_')[1], 10);
                this.trigger(dragStart, 
				{
                    axis: this.activeAxis,
                    name: dragStart,
                    type: pointerStart,
                    pointer: this.activePointer,
                    currentValue: this.activePointer.currentValue,
                    pointerIndex: pointInd,
                    axisIndex: axisInd
                } as IPointerDragEventArgs);
                if (this.enablePointerDrag) {
                    this.svgObject.setAttribute('cursor', 'grabbing');
                }
            }
            else if (!args.cancel &&
                args.target.id.indexOf(this.element.id + '_Axis_') >= 0 &&
                args.target.id.indexOf('_Range_') >= 0
            )
            {
                currentRange = getRange(args.target.id, this);
                this.activeAxis = <Axis>this.axes[currentRange.axisIndex];
                this.activeRange = <Range>this.activeAxis.ranges[currentRange.rangeIndex];
                if (isNullOrUndefined(this.activeRange.pathElement )) {
                    this.activeRange.pathElement = [e.target as Element];
                }
                const rangeInd: number = parseInt(this.activeRange.pathElement[0].id.split('Range_')[1], 10);
                const axisInd: number = parseInt(this.activeRange.pathElement[0].id.split('_Axis_')[1], 10);
                this.trigger(dragStart, 
				{
                    axis: this.activeAxis,
                    name: dragStart,
                    type: rangeStart,
                    range: this.activeRange,
                    axisIndex: axisInd,
                    rangeIndex: rangeInd
                } as IPointerDragEventArgs);
                if (this.enableRangeDrag) {
                    this.svgObject.setAttribute('cursor', 'grabbing');
                }
            }

        });
        return false;
    }

    /**
     * Handles the mouse end.
     *
     * @param {PointerEvent} e - Specifies the pointer event
     * @returns {boolean} - Returns the boolean value
     * @private
     */
    public mouseEnd(e: PointerEvent): boolean {
        this.setMouseXY(e);
        const args: IMouseEventArgs = this.getMouseArgs(e, 'touchend', gaugeMouseUp);
        this.isTouch = e.pointerType === 'touch' || e.pointerType === '2' || e.type === 'touchend';
        const tooltip: GaugeTooltip = this.tooltipModule;
        this.trigger(gaugeMouseUp, args);
        if (this.activeAxis && this.activePointer && this.enablePointerDrag) {
            this.svgObject.setAttribute('cursor', 'auto');
            const pointerInd: number = parseInt(this.activePointer.pathElement[0].id.slice(-1), 10);
            const axisInd: number = parseInt(this.activePointer.pathElement[0].id.split('_Axis_')[1], 10);
            this.trigger(dragEnd,
                {
                    name: dragEnd,
                    type: pointerEnd,
                    axis: this.activeAxis,
                    pointer: this.activePointer,
                    currentValue: this.activePointer.currentValue,
                    axisIndex: axisInd,
                    pointerIndex: pointerInd
                } as IPointerDragEventArgs);
            this.activeAxis = null;
            this.activePointer = null;
            this.isDrag = false;
        }
        else if (this.activeAxis && this.activeRange && this.enableRangeDrag) {
            this.svgObject.setAttribute('cursor', 'auto');
            const rangeInd: number = parseInt(this.activeRange.pathElement[0].id.slice(-1), 10);
            const axisInd: number = parseInt(this.activeRange.pathElement[0].id.split('_Axis_')[1], 10);
            this.trigger(dragEnd,
                {
                    name: dragEnd,
                    type: rangeEnd,
                    axis: this.activeAxis,
                    range: this.activeRange,
                    axisIndex: axisInd,
                    rangeIndex: rangeInd
                } as IPointerDragEventArgs);
            this.activeAxis = null;
            this.activeRange = null;
            this.isDrag = false;
        }
        if (!isNullOrUndefined(this.activePointer)) {
            this.activePointer = null;
        }
        this.svgObject.setAttribute('cursor', 'auto');
        this.notify(Browser.touchEndEvent, e);
        return false;
    }

    /**
     * Handles the mouse event arguments.
     *
     * @param {PointerEvent} e - Specifies the pointer event
     * @param {string} type - Specifies the type
     * @param {string} name - Specifies the name
     * @returns {IMouseEventArgs} - Returns the mouse event args
     * @private
     */
    private getMouseArgs(e: PointerEvent, type: string, name: string): IMouseEventArgs {
        const rect: ClientRect = this.element.getBoundingClientRect();
        const location: GaugeLocation = new GaugeLocation(-rect.left, -rect.top);
        const isTouch: boolean = (e.type === type);
        location.x += isTouch ? (<TouchEvent & PointerEvent>e).changedTouches[0].clientX : e.clientX;
        location.y += isTouch ? (<TouchEvent & PointerEvent>e).changedTouches[0].clientY : e.clientY;
        return {
            cancel: false, name: name,
            x: location.x, y: location.y,
            target: isTouch ? <Element>(<TouchEvent & PointerEvent>e).target : <Element>e.target
        };
    }

    /**
     * Handles the gauge resize.
     *
     * @param {Event} e - Specifies the event
     * @returns {boolean} - Returns the boolean value
     * @private
     */
    public gaugeResize(e: Event): boolean {
        let args: IResizeEventArgs = {
            gauge: this,
            previousSize: this.availableSize,
            name: resized,
            cancel: false,
            currentSize: this.calculateSvgSize()
        };
        this.trigger(resized, args);
        if (!args.cancel) {
            if (this.resizeTo) {
                clearTimeout(this.resizeTo);
            }
            if (!isNullOrUndefined(this.element) && this.element.classList.contains('e-circulargauge')) {            
                this.animatePointer = false;
                this.resizeTo = window.setTimeout(
                    (): void => {
                        this.createSvg();
                        this.calculateBounds();
                        this.renderElements();            
                    },
                    500);
            }
        }
        return false;
    }

    /**
     * Applying styles for circular gauge elements
     *
     * @param {HTMLElement} element - Specifies the html element
     * @returns {void}
     */
    private setGaugeStyle(element: HTMLElement): void {
        element.style.touchAction = this.enablePointerDrag ? 'none' : 'element';
        element.style.msTouchAction = this.enablePointerDrag ? 'none' : 'element';
        element.style.msContentZooming = 'none';
        element.style.msUserSelect = 'none';
        element.style.webkitUserSelect = 'none';
        element.style.position = 'relative';
    }

    /**
     * Method to set culture for gauge
     *
     * @returns {void}
     */
    private setCulture(): void {
        this.intl = new Internationalization();
    }

    /**
     * Methods to create svg element for circular gauge.
     *
     * @returns {void}
     */
    private createSvg(): void {
        this.removeSvg();
        if (isNullOrUndefined(this.renderer)) {
            this.renderer = new SvgRenderer(this.element.id);
        }
        if (isNullOrUndefined(this.gaugeAxisLayoutPanel)) {
            this.gaugeAxisLayoutPanel = new AxisLayoutPanel(this);
        }
        this.availableSize = this.calculateSvgSize();
        this.svgObject = this.renderer.createSvg({
            id: this.element.id + '_svg',
            width: this.availableSize.width,
            height: this.availableSize.height
        });
    }

    /**
     * To Remove the SVG from circular gauge.
     *
     * @returns {void}
     * @private
     */
    public removeSvg(): void {
        removeElement(this.element.id + '_Secondary_Element');
        if (this.svgObject) {
            while (this.svgObject.childNodes.length > 0) {
                while (this.svgObject.childNodes.length > 0) {
                    this.svgObject.removeChild(this.svgObject.firstChild);
                }
                if (!this.svgObject.hasChildNodes() && this.svgObject.parentNode) {
                    remove(this.svgObject);
                }
            }
            if (!this.svgObject.hasChildNodes() && this.svgObject.parentNode) {
                remove(this.svgObject);
            }
        }
        removeElement(this.element.id + '_svg');
        this.clearTemplate();
    }

    /**
     * To initialize the circular gauge private variable.
     *
     * @returns {void}
     * @private
     */
    private initPrivateVariable(): void {
        if (this.element.id === '') {
            const collection: number = document.getElementsByClassName('e-circulargauge').length;
            this.element.id = 'circulargauge_control_' + collection;
        }
        this.renderer = new SvgRenderer(this.element.id);
        this.gaugeAxisLayoutPanel = new AxisLayoutPanel(this);
        this.animatePointer = true;
    }

    /**
     * To calculate the size of the circular gauge element.
     *
     * @returns {void}
     */
    private calculateSvgSize(): Size {
        const containerWidth: number = this.element.offsetWidth;
        const containerHeight: number = this.element.offsetHeight;
        const borderWidth: number = parseInt(this.element.style.borderWidth.split('px').join(''), 10) * 2;
        let width: number = stringToNumber(this.width, containerWidth) || containerWidth || 600;
        let height: number = stringToNumber(this.height, containerHeight) || containerHeight || 450;
        width = !isNaN(borderWidth) ? (width - borderWidth) : width;
        height = !isNaN(borderWidth) ? (height - borderWidth) : height;
        return new Size(width, height);
    }

    /**
     * To calculate the spacing of the circular gauge element.
     *
     * @param {number} top - Specifies the top value
     * @param {number} left - Specifies the left value
     * @param {number} width - Specifies the width
     * @param {number} height - Specifies the height
     * @param {number} radius - Specifies the radius
     * @param {number} titleHeight - Specifies the titleHeight
     * @param {number} isUpperAngle - Specifies the isUpperAngle
     * @param {number} isLowerAngle - Specifies the isLowerAngle
     * @param {number} isFullPercent - Specifies the boolean value
     * @param {number} isUpper - Specifies the boolean value
     * @param {number} isLower - Specifies the boolean value
     * @returns {void}
     */
    /* eslint-disable max-len */
    private radiusAndCenterCalculation(top: number, left: number, width: number, height: number,
                                       radius: number, titleHeight: number, isUpperAngle: boolean, isLowerAngle: boolean,
                                       isFullPercent: boolean, radiusPercent: number, isUpper: boolean, isLower: boolean): void {
        let rect: Rect; const bottom : number = this.margin.bottom + this.border.width; let minRadius : number;
        let widthRadius : number; let centerX: number; let centerY: number;
        if (this.moveToCenter && this.axes.length === 1 &&
            isNullOrUndefined(this.centerXpoint) && isNullOrUndefined(this.centerYpoint)) {
            rect = new Rect(left, top, width, height);
        } else {
            if (!this.allowMargin) {
                if (!isNullOrUndefined(this.legendModule) && (width > height) && (this.legendSettings.position === 'Top' || this.legendSettings.position === 'Bottom')) {
                    minRadius = Math.min(width, height) / 2;
                    rect = new Rect(
                        (left + (width / 2) - minRadius), (top + (height / 2) - minRadius),
                        minRadius * 2, minRadius * 2
                    );
                } else {
                    if (width > height && (isLowerAngle && isLower || isUpperAngle && isUpper)) {
                        widthRadius = ((width) / 2);
                        const heightValue : number = isUpper && isLower ? (height / 2)  : (height * (3 / 4));
                        if (widthRadius > heightValue) {
                            widthRadius =  heightValue;
                        }
                        rect = new Rect(
                            (left + (width / 2) - widthRadius), (top + (height / 2) - widthRadius),
                            widthRadius * 2, widthRadius * 2
                        );
                    } else {
                        if (height > width) {
                            const heightRadius : number = height / 2;
                            rect = new Rect((left + (width / 2) - radius), (top + (height / 2) - heightRadius), radius * 2, heightRadius * 2);
                        } else {
                            rect = new Rect(
                                (left + (width / 2) - radius), (top + (height / 2) - radius),
                                radius * 2, radius * 2
                            );
                        }
                    }
                }
            } else {
                rect = new Rect(
                    (left + (width / 2) - radius), (top + (height / 2) - radius),
                    radius * 2, radius * 2
                );
            }
        }
        this.gaugeRect = rect;
        if (this.legendModule && this.legendSettings.visible) {
            this.legendModule.getLegendOptions(this.axes as Axis[]);
            this.legendModule.calculateLegendBounds(this.gaugeRect, this.availableSize);
        }
        if (!this.allowMargin) {
            if (!isNullOrUndefined(this.legendModule) && (isUpperAngle || isLowerAngle) && (width > height) && (this.legendSettings.position === 'Top' || this.legendSettings.position === 'Bottom')) {
                const difference : number = height - this.gaugeRect.height;
                this.gaugeRect.width =  width - ((this.availableSize.width - this.gaugeRect.width) / 2);
                this.gaugeRect.y = this.gaugeRect.y - difference;
                this.gaugeRect.height = this.gaugeRect.height + difference + ((this.availableSize.height - this.gaugeRect.height) / 2);
            }
            else if (!isNullOrUndefined(this.legendModule) && (isUpperAngle || isLowerAngle) && (width > height) && (this.legendSettings.position === 'Left' || this.legendSettings.position === 'Right')) {
                const difference : number = this.gaugeRect.height - this.gaugeRect.width;
                this.gaugeRect.x = this.legendSettings.position === 'Right'
                    ? this.gaugeRect.x + this.margin.right : this.gaugeRect.x;
                this.gaugeRect.width = this.legendSettings.position === 'Left' ?
                    Math.abs(width - ((this.availableSize.width - this.gaugeRect.width + difference)  / 2))
                    : Math.abs(width - ((this.availableSize.width - this.gaugeRect.width) / 2) - 10);
            }
            centerX = this.centerXpoint !== null ?
                stringToNumber(this.centerXpoint, this.availableSize.width) : this.gaugeRect.x + (this.gaugeRect.width / 2);
            if ((isUpperAngle || isLowerAngle) && !isNullOrUndefined(this.legendModule)) {
                centerX = (this.legendSettings.position === 'Top' || this.legendSettings.position === 'Bottom')
                    ? this.availableSize.width / 2 : this.legendSettings.position === 'Right' ? (this.gaugeRect.width / 2) + this.margin.right :
                        centerX;
            }
            centerY = ((isUpperAngle || isLowerAngle) ? (isUpperAngle ?
                (( (this.gaugeRect.height * (3 / 4) + this.gaugeRect.y) - bottom))
                : (((this.gaugeRect.height * (1 / 4)) + (this.gaugeRect.y)) )) : this.gaugeRect.y + (this.gaugeRect.height / 2));
            centerY = !isFullPercent && (isUpperAngle || isLowerAngle) ? (this.gaugeRect.height / 2) + this.gaugeRect.y + (radiusPercent * (3 / 4) * (1 / 2)) : centerY;
            if (!isNullOrUndefined(this.axes) && this.axes.length > 1 && !isNullOrUndefined(this.midPoint)) {
                isUpper = isUpperAngle ? isUpperAngle : isUpper;
                isLower = isLowerAngle ? isLowerAngle : isLower;
                if (isUpper && isLower) {
                    centerY = (this.availableSize.height / 2) - bottom;
                }
            }
        } else {
            centerX = this.centerXpoint !== null ?
                stringToNumber(this.centerXpoint, this.availableSize.width) : this.gaugeRect.x + (this.gaugeRect.width / 2);
            centerY =  this.centerYpoint !== null ?
                stringToNumber(this.centerYpoint, this.availableSize.height) : this.gaugeRect.y + (this.gaugeRect.height / 2);
        }
        this.midPoint = new GaugeLocation(centerX, centerY);
    }

    /**
     * Method to calculate the availble size for circular gauge.
     *
     * @returns {void}
     */
    private calculateBounds(): void {
        const padding: number = 5; let rect: Rect;
        const margin: MarginModel = this.margin;
        let titleHeight: number = 0;
        if (this.title) {
            titleHeight = measureText(this.title, this.titleStyle).height + padding;
        }
        const top: number = margin.top + titleHeight + this.border.width;
        const bottom : number = margin.bottom + this.border.width;
        const left: number = margin.left + this.border.width; let isUpper : boolean = false ; let isLower : boolean = false;
        const width: number = this.availableSize.width - left - margin.right - this.border.width;
        const height: number = this.availableSize.height - top - this.border.width - margin.bottom;
        const radius: number = Math.min(width, height) / 2;
        this.centerXpoint = (this.centerX === '') ? null : this.centerX;
        this.centerYpoint = (this.centerY === '') ? null : this.centerY;
        if (this.moveToCenter && this.axes.length === 1 &&
            isNullOrUndefined(this.centerXpoint) && isNullOrUndefined(this.centerYpoint)) {
            rect = new Rect(left, top, width, height);
        }
        if (!this.allowMargin) {
            for (let j: number = 0; j < this.axes.length; j++) {
                const isUpperAngle : boolean = 270 <= this.axes[j].startAngle && this.axes[j].startAngle <= 360 &&
                0 <= this.axes[j].endAngle && this.axes[j].endAngle <= 90;
                const isLowerAngle : boolean = 90 >= this.axes[j].startAngle && this.axes[j].startAngle <= 180 &&
                180 <= this.axes[j].endAngle && 270 <= this.axes[j].endAngle && 0 !== this.axes[j].startAngle &&
                360 !== this.axes[j].endAngle;
                isUpper = isUpperAngle ? isUpperAngle : isUpper;
                isLower = isLowerAngle ? isLowerAngle : isLower;
                const isFullPercent : boolean = this.axes[j].radius !== null ?  parseInt(this.axes[0].radius.split('%')[0], 10) >= 100 : true;
                const radiusPercent : number = this.axes[j].radius !== null ? radius * (parseInt(this.axes[0].radius.split('%')[0], 10) / 100) : radius;
                this.radiusAndCenterCalculation(top, left, width, height, radius, titleHeight, isUpperAngle, isLowerAngle, isFullPercent, radiusPercent, isUpper, isLower);
            }
        } else {
            rect = new Rect(
                (left + (width / 2) - radius), (top + (height / 2) - radius),
                radius * 2, radius * 2
            );
            this.radiusAndCenterCalculation(top, left, width, height, radius, titleHeight, false, false, null, null, false, false);
        }
        this.gaugeAxisLayoutPanel.measureAxis(this.gaugeRect);
    }

    /**
     * To render elements for circular gauge
     *
     * @param {boolean} animate - Specifies whether animation is true or false
     * @returns {void}
     */
    private renderElements(animate: boolean = true): void {

        this.renderBorder();

        this.renderTitle();

        this.gaugeAxisLayoutPanel.renderAxes(animate);

        this.renderLegend();

        this.element.appendChild(this.svgObject);

        this.trigger(loaded, { gauge: this });

        removeElement('gauge-measuretext');

    }

    /**
     * Method to render legend for accumulation chart
     *
     * @returns {void}
     */
    private renderLegend(): void {
        if (!this.legendModule || !this.legendSettings.visible) {
            return null;
        }
        if (this.legendModule.legendCollection.length) {
            this.legendModule.renderLegend(this.legendSettings, this.legendModule.legendBounds, true);
        }
    }
    /**
     * Method to render the title for circular gauge.
     *
     * @returns {void}
     */
    private renderTitle(): void {
        if (this.title) {
            let style: FontModel = {
                color: this.titleStyle.color,
                size: this.titleStyle.size || this.themeStyle.fontSize,
                fontFamily: this.titleStyle.fontFamily || this.themeStyle.fontFamily,
                fontStyle: this.titleStyle.fontStyle,
                fontWeight: this.titleStyle.fontWeight || this.themeStyle.titleFontWeight,
                opacity: this.titleStyle.opacity
            };
            const titleSize: string = style.size;
            if (!isNaN(Number(titleSize))) {
                style.size = titleSize + 'px';
            }
            const size: Size = measureText(this.title, style);
            const options: TextOption = new TextOption(
                this.element.id + '_CircularGaugeTitle',
                this.availableSize.width / 2,
                this.margin.top + 3 * (size.height / 4),
                'middle', this.title
            );
            const element: Element = textElement(
                options, style, style.color || this.themeStyle.titleFontColor, this.svgObject, ''
            );
            element.setAttribute('aria-label', this.description || this.title);
            element.setAttribute('role', '');
            element.setAttribute('tabindex', this.tabIndex.toString());
        }
    }

    /**
     * Method to render the border for circular gauge.
     *
     * @returns {void}
     */
    private renderBorder(): void {
        const borderWidth: number = this.border.width;
        if (borderWidth > 0 || (this.background || this.themeStyle.backgroundColor)) {
            this.svgObject.appendChild(this.renderer.drawRectangle(
                new RectOption(
                    this.element.id + '_CircularGaugeBorder', this.background || this.themeStyle.backgroundColor, this.border, null,
                    new Rect(
                        borderWidth / 2, borderWidth / 2, this.availableSize.width - borderWidth,
                        this.availableSize.height - borderWidth
                    ))
            ) as HTMLElement);
        }
    }
    /* eslint-disable valid-jsdoc */
    /**
     * This method is used to set the pointer value dynamically for circular gauge.
     *
     * @param axisIndex - Specifies the index value for the axis in circular gauge.
     * @param pointerIndex - Specifies the index value for the pointer in circular gauge.
     * @param value - Specifies the value for the pointer in circular gauge.
     */
    public setPointerValue(axisIndex: number, pointerIndex: number, value: number): void {
        const axis: Axis = <Axis>this.axes[axisIndex];
        const pointer: Pointer = <Pointer>axis.pointers[pointerIndex];
        const pointerRadius: number = pointer.currentRadius;
        if (pointer.currentValue != value) {
            const enableAnimation: boolean = pointer.animation.enable;
            value = value < axis.visibleRange.min ? axis.visibleRange.min : value;
            value = value > axis.visibleRange.max ? axis.visibleRange.max : value;
            pointer['isPointerAnimation'] = true;
            pointer.pathElement.map((element: Element) => {
                if (pointer.type === 'RangeBar') {
                    setStyles(element as HTMLElement, pointer.color, pointer.border);
                    if (enableAnimation) {
                        this.gaugeAxisLayoutPanel.pointerRenderer.performRangeBarAnimation(
                            element as HTMLElement, pointer.currentValue, value, axis, pointer,
                            pointerRadius, (pointerRadius - pointer.pointerWidth)
                        );
                    } else {
                        this.gaugeAxisLayoutPanel.pointerRenderer.setPointerValue(axis, pointer, value);
                    }
                } else {
                    if (element.id.indexOf('_Pointer_NeedleCap_') >= 0) {
                        setStyles(element as HTMLElement, pointer.cap.color, pointer.cap.border);
                    } else if (element.id.indexOf('_Pointer_NeedleTail_') >= 0) {
                        setStyles(element as HTMLElement, pointer.needleTail.color, pointer.needleTail.border);
                    } else if (element.id.indexOf('_Pointer_NeedleRect_') >= 0) {
                        setStyles(element as HTMLElement, 'transparent', { color: 'transparent', width: 0 });
                    } else if(pointer.type === 'Marker' && pointer.markerShape !== 'Text') {
                        setStyles(element as HTMLElement, pointer.color, pointer.border);
                    }
                    if (enableAnimation) {
                        if (pointer.type === 'Marker' && pointer.markerShape === 'Text') {
                            this.gaugeAxisLayoutPanel.pointerRenderer.performTextAnimation(element as HTMLElement, pointer.currentValue, value, axis, pointer);
                        }
                        else {
                            this.gaugeAxisLayoutPanel.pointerRenderer.performNeedleAnimation(
                                element as HTMLElement, pointer.currentValue, value, axis, pointer,
                                pointerRadius, (pointerRadius - pointer.pointerWidth)
                            );
                        }
                    } else {
                        this.gaugeAxisLayoutPanel.pointerRenderer.setPointerValue(axis, pointer, value);
                    }
                }
            });
        }
        this.isProtectedOnChange = true;
        pointer.previousValue = pointer.currentValue;
        pointer.currentValue = value;
        pointer.value = value;
        this.isProtectedOnChange = false;
    }

    // eslint-disable-next-line valid-jsdoc
    /**
     * This method is used to set the annotation content dynamically for circular gauge.
     *
     * @param axisIndex - Specifies the index value for the axis in circular gauge.
     * @param annotationIndex - Specifies the index value for the annotation in circular gauge.
     * @param content - Specifies the content for the annotation in circular gauge.
     */
    public setAnnotationValue(axisIndex: number, annotationIndex: number, content: string): void {
        const isElementExist: boolean = getElement(this.element.id + '_Annotations_' + axisIndex) !== null;
        const element: HTMLElement = <HTMLElement>getElement(this.element.id + '_Annotations_' + axisIndex) ||
            createElement('div', {
                id: this.element.id + '_Annotations_' + axisIndex
            });
        const annotation: Annotation = <Annotation>this.axes[axisIndex].annotations[annotationIndex];
        if (content !== null) {
            removeElement(this.element.id + '_Axis_' + axisIndex + '_Annotation_' + annotationIndex);
            annotation.content = content;
            this.annotationsModule.createTemplate(element, annotationIndex, axisIndex, this);
            const secondaryElement: Element = getElement(this.element.id + '_Secondary_Element');
            if (!isElementExist && !isNullOrUndefined(secondaryElement)) {
                secondaryElement.appendChild(element);
            }
        }
    }

    /**
     * This method is used to print the rendered circular gauge.
     *
     * @param id - Specifies the element to print the circular gauge.
     */
    public print (id?: string[] | string | Element): void {
        if (this.allowPrint && this.printModule){
            this.printModule.print(this, id);
        }
    }

    /**
     * This method is used to perform the export functionality for the circular gauge.
     *
     * @param type - Specifies the type of the export.
     * @param fileName - Specifies the file name for the exported file.
     * @param  orientation - Specified the orientation for the exported pdf document.
     * @param allowDownload - Specifies whether to download as a file.
     */
    public export(type: ExportType, fileName: string, orientation?: PdfPageOrientation, allowDownload?: boolean): Promise<string> {
        if (isNullOrUndefined(allowDownload)) {
            allowDownload = true;
        }
        if (type === 'PDF' && this.allowPdfExport && this.pdfExportModule) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return new Promise((resolve: any, reject: any) => {
                resolve(this.pdfExportModule.export(this, type, fileName, orientation, allowDownload));
            });
        }
        else if (this.allowImageExport && (type !== 'PDF') && this.imageExportModule)
        {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return new Promise((resolve: any, reject: any) => {
                resolve(this.imageExportModule.export(this, type, fileName, allowDownload));
            });
        }
        return null;
    }
    /**
     * Method to set mouse x, y from events
     *
     * @param {PointerEvent} e - Specifies the pointer event
     * @returns {void}
     */
    private setMouseXY(e: PointerEvent): void {
        let pageX: number;
        let pageY: number;
        const svgRect: ClientRect = getElement(this.element.id + '_svg').getBoundingClientRect();
        const rect: ClientRect = this.element.getBoundingClientRect();
        if (e.type.indexOf('touch') > -1) {
            this.isTouch = true;
            const touchArg: TouchEvent = <TouchEvent & PointerEvent>e;
            pageY = touchArg.changedTouches[0].clientY;
            pageX = touchArg.changedTouches[0].clientX;
        } else {
            this.isTouch = e.pointerType === 'touch' || e.pointerType === '2';
            pageX = e.clientX;
            pageY = e.clientY;
        }
        this.mouseY = (pageY - rect.top) - Math.max(svgRect.top - rect.top, 0);
        this.mouseX = (pageX - rect.left) - Math.max(svgRect.left - rect.left, 0);
    }

    /**
     * This method is used to set the range values dynamically for circular gauge.
     *
     * @param axisIndex - Specifies the index value for the axis in circular gauge.
     * @param rangeIndex - Specifies the index value for the range in circular gauge.
     * @param start - Specifies the start value for the current range in circular gauge.
     * @param end - Specifies the end value for the current range i circular gauge.
     */
    public setRangeValue(axisIndex: number, rangeIndex: number, start: number, end: number): void {
        const element: Element = getElement(
            this.element.id + '_Axis_' + axisIndex + '_Range_' + rangeIndex
        );
        const axis: Axis = <Axis>this.axes[axisIndex];
        const range: Range = <Range>axis.ranges[rangeIndex];
        const axisRange: VisibleRangeModel = axis.visibleRange;
        const isClockWise: boolean = axis.direction === 'ClockWise';
        const startValue: number = Math.min(Math.max(start, axisRange.min), end);
        const endValue: number = Math.min(Math.max(start, end), axisRange.max);
        const oldRangeStart: number = range.start;
        const oldRangeEnd: number = range.end;
        range.start = start;
        range.end = end;
        if (range.start !== range.end && oldRangeStart === oldRangeEnd && this.legendModule && this.legendSettings.visible) {
            this.legendModule.getLegendOptions(this.axes as Axis[]);
            let height: number = this.legendModule.legendBounds.height + this.legendSettings.margin.top + this.legendSettings.margin.bottom + this.legendSettings.border.width;
            let width: number = this.legendModule.legendBounds.width + this.legendSettings.margin.left + this.legendSettings.margin.right + this.legendSettings.border.width;
            let rect: Rect = this.gaugeRect;
            let position: string = this.legendModule.position;
            if (position === 'Bottom') {
                rect.height = rect.height + height;
            }
            if (position === 'Top') {
                rect.height = rect.height + height;
                rect.y = rect.y - height;
            }
            if (position === 'Left') {
                rect.width = rect.width + width;
                rect.x = rect.x - width;
            }
            if (position === 'Right') {
                rect.width = rect.width + width;
            }
            this.legendModule.calculateLegendBounds(rect, this.availableSize);
            if (this.legendModule.legendCollection.length) {
                this.legendModule.renderLegend(this.legendSettings, this.legendModule.legendBounds, true);
            }
        }
        this.isRangeUpdate = true;
        let startAngle: number = getAngleFromValue(startValue, axisRange.max, axisRange.min, axis.startAngle, axis.endAngle, isClockWise);
        let endAngle: number = getAngleFromValue(endValue, axisRange.max, axisRange.min, axis.startAngle, axis.endAngle, isClockWise);
        let startWidth: number;
        if ((<string>range.startWidth).length > 0) {
            startWidth = toPixel(<string>range.startWidth, range.currentRadius);
        } else {
            startWidth = <number>range.startWidth;
        }
        let endWidth: number;
        if ((<string>range.endWidth).length > 0) {
            endWidth = toPixel(<string>range.endWidth, range.currentRadius);
        } else {
            endWidth = <number>range.endWidth;
        }
        endAngle = isClockWise ? endAngle : [startAngle, startAngle = endAngle][0];
        endWidth = isClockWise ? endWidth : [startWidth, startWidth = endWidth][0];
        element.setAttribute('d', getPathArc(
            this.midPoint, Math.round(startAngle), Math.round(endAngle), range.currentRadius,
            startWidth, endWidth, range, axis
        ));
        setStyles(element as HTMLElement, (range.color ? range.color : range.rangeColor), {
            color: (range.color ? range.color : range.rangeColor),
            width: 0
        });
    }

    /**
     * To destroy the widget
     *
     * @method destroy
     * @return {void}
     * @member of Circular-Gauge
     */
    public destroy(): void {
        this.unWireEvents();
        super.destroy();
        if (!isNullOrUndefined(this.gaugeAxisLayoutPanel)) {
            this.gaugeAxisLayoutPanel.destroy();
        }
        this.availableSize = null;
        this.midPoint = null;
        this.activePointer = null;
        this.activeAxis = null;
        this.activeRange = null;
        this.gaugeRect = null;
        this.gaugeAxisLayoutPanel = null;
        this.themeStyle = null;
        this.removeSvg();
        this.svgObject = null;
        this.renderer = null;
    }

    /**
     * To provide the array of modules needed for control rendering
     *
     * @returns {ModuleDeclaration[]} - Returns the modules
     * @private
     */
    public requiredModules(): ModuleDeclaration[] {
        const modules: ModuleDeclaration[] = [];
        let annotationEnable: boolean = false;
        const axes: Axis[] = <Axis[]>this.axes;
        axes.map((axis: Axis) => {
            axis.annotations.map((annotation: Annotation) => {
                annotationEnable = annotationEnable || annotation.content !== null;
            });
        });
        if (annotationEnable) {
            modules.push({
                member: 'Annotations',
                args: [this, Annotations]
            });
        }
        if (this.tooltip.enable) {
            modules.push({
                member: 'Tooltip',
                args: [this, GaugeTooltip]
            });
        }
        if (this.allowPrint) {
            modules.push({
                member: 'Print',
                args: [this, Print]
            });
        }
        if (this.allowImageExport) {
            modules.push({
                member: 'ImageExport',
                args: [this, ImageExport]
            });
        }
        if (this.allowPdfExport) {
            modules.push({
                member: 'PdfExport',
                args: [this, PdfExport]
            });
        }
        if (this.legendSettings.visible) {
            modules.push({
                member: 'Legend',
                args: [this, Legend]
            });
        }
        modules.push({
            member: 'Gradient',
            args: [this, Gradient]
        });
        return modules;
    }



    /**
     * Get the properties to be maintained in the persisted state.
     *
     * @returns {string} - Returns the string
     * @private
     */
    public getPersistData(): string {
        return this.addOnPersist([]);
    }

    /**
     * Called internally if any of the property value changed.
     *
     * @param {CircularGaugeModel} newProp - Specifies the new property
     * @param {CircularGaugeModel} oldProp - Specifies the old property
     * @returns {void}
     * @private
     */
    public onPropertyChanged(newProp: CircularGaugeModel, oldProp: CircularGaugeModel): void {
        // property method calculated
        this.isPropertyChange = true;
        let renderer: boolean = false;
        let refreshBounds: boolean = false;
        let refreshWithoutAnimation: boolean = false;
        const isPointerValueSame: boolean = (Object.keys(newProp).length === 1 && newProp instanceof Object &&
            !isNullOrUndefined(this.activePointer));
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'height':
            case 'width':
            case 'centerX':
            case 'centerY':
            case 'margin':
                this.createSvg();
                refreshBounds = true;
                break;
            case 'title':
                refreshBounds = (newProp.title === '' || oldProp.title === '');
                renderer = !(newProp.title === '' || oldProp.title === '');
                break;
            case 'titleStyle':
                if (newProp.titleStyle && newProp.titleStyle.size) {
                    refreshBounds = true;
                } else {
                    renderer = true;
                }
                break;
            case 'border':
                renderer = true;
                break;
            case 'background':
                renderer = true;
                break;
            case 'legendSettings':
                refreshWithoutAnimation = true;
                break;
            case 'axes':
                const axesPropertyLength: number = Object.keys(newProp.axes).length;
                for (let x: number = 0; x < axesPropertyLength; x++) {
                    if (!isNullOrUndefined(newProp.axes[x])) {
                        const collection: string[] = Object.keys(newProp.axes[x]);
                        for (const collectionProp of collection) {
                            if (collectionProp === 'pointers') {
                                const pointerPropertyLength: number = Object.keys(newProp.axes[x].pointers).length;
                                for (let y: number = 0; y < pointerPropertyLength; y++) {
                                    let index: number = parseInt(Object.keys(newProp.axes[x].pointers)[y]);
                                    if (!isNullOrUndefined(Object.keys(newProp.axes[x].pointers[index]))) {
                                        this.axes[x].pointers[index]['previousValue'] = this.axes[x].pointers[index]['currentValue'];
                                        this.axes[x].pointers[index]['isPointerAnimation'] = Object.keys(newProp.axes[x].pointers[index]).indexOf('value') > -1;
                                    }
                                }
                            }
                        }
                    }
                }
                refreshWithoutAnimation = true;
                break;
            }
        }
        if (!isPointerValueSame && !this.isRangeUpdate) {
            if (!refreshBounds && renderer) {
                this.removeSvg();
                this.renderElements();
            }
            if (refreshBounds) {
                this.removeSvg();
                this.calculateBounds();
                this.renderElements();
            }
            if (refreshWithoutAnimation && !renderer && !refreshBounds) {
                this.removeSvg();
                this.calculateBounds();
                this.renderElements(false);
            }
        }
        this.isRangeUpdate = false;
    }

    /**
     * Get component name for circular gauge
     *
     * @returns {string} - Returns the module name
     * @private
     */
    public getModuleName(): string {
        return 'circulargauge';
    }
}
