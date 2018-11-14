/**
 * Circular Gauge
 */
import { Property, NotifyPropertyChanges, Component, INotifyPropertyChanged } from '@syncfusion/ej2-base';
import { Complex, Browser, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Event, EmitType, SvgRenderer, EventHandler, Collection, Internationalization, ModuleDeclaration } from '@syncfusion/ej2-base';
import { remove, createElement } from '@syncfusion/ej2-base';
import { CircularGaugeModel } from './circular-gauge-model';
import { ILoadedEventArgs, IAnimationCompleteEventArgs, IVisiblePointer } from './model/interface';
import { IAxisLabelRenderEventArgs, IPointerDragEventArgs, IResizeEventArgs } from './model/interface';
import { ITooltipRenderEventArgs, IAnnotationRenderEventArgs, IMouseEventArgs } from './model/interface';
import { TextOption, textElement, RectOption, getAngleFromLocation, getValueFromAngle, removeElement } from './utils/helper';
import { Size, stringToNumber, measureText, Rect, GaugeLocation, getElement, getPointer, setStyles, toPixel } from './utils/helper';
import { getAngleFromValue, getPathArc } from './utils/helper';
import { GaugeTheme } from './utils/enum';
import { Border, Margin, Font, TooltipSettings } from './model/base';
import { BorderModel, MarginModel, FontModel, TooltipSettingsModel } from './model/base-model';
import { Axis, Range, Pointer, Annotation, VisibleRangeModel } from './axes/axis';
import { Annotations } from './annotations/annotations';
import { GaugeTooltip } from './user-interaction/tooltip';
import { AxisModel } from './axes/axis-model';
import { load, loaded, gaugeMouseMove, gaugeMouseLeave, gaugeMouseDown } from './model/constants';
import { gaugeMouseUp, dragEnd, dragMove, dragStart, resized } from './model/constants';
import { AxisLayoutPanel } from './axes/axis-panel';

/**
 * Represents the Circular gauge control.
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
     * annotationModule is used to add annotation in gauge.
     */
    public annotationsModule: Annotations;

    /**
     * `tooltipModule` is used to show the tooltip to the circular gauge..
     */
    public tooltipModule: GaugeTooltip;

    /**
     * The width of the circular gauge as a string in order to provide input as both like '100px' or '100%'.
     * If specified as '100%, gauge will render to the full width of its parent element.
     * @default null
     */

    @Property(null)
    public width: string;

    /**
     * The height of the circular gauge as a string in order to provide input as both like '100px' or '100%'.
     * If specified as '100%, gauge will render to the full height of its parent element.
     * @default null
     */

    @Property(null)
    public height: string;

    /**
     * Options for customizing the color and width of the gauge border.
     */

    @Complex<BorderModel>({ color: 'transparent', width: 0 }, Border)
    public border: BorderModel;

    /**
     * The background color of the gauge, which accepts value in hex, rgba as a valid CSS color string.
     * @default 'transparent'
     */
    @Property('transparent')
    public background: string;

    /**
     * Title for gauge
     * @default ''
     */

    @Property('')
    public title: string;

    /**
     * Options for customizing the title of Gauge.
     */

    @Complex<FontModel>({ size: '15px', color: null }, Font)
    public titleStyle: FontModel;

    /**
     *  Options to customize the left, right, top and bottom margins of the gauge.
     */

    @Complex<MarginModel>({}, Margin)
    public margin: MarginModel;

    /**
     * Options for customizing the axes of gauge
     */

    @Collection<AxisModel>([{}], Axis)
    public axes: AxisModel[];

    /**
     * Options for customizing the tooltip of gauge.
     */

    @Complex<TooltipSettingsModel>({}, TooltipSettings)
    public tooltip: TooltipSettingsModel;

    /**
     * If set true, pointers can able to drag on interaction.
     * @default false
     */
    @Property(false)
    public enablePointerDrag: boolean;

    /**
     * X coordinate of the circular gauge center point, which takes values either in pixels or in percentage.
     * @default null
     */

    @Property(null)
    public centerX: string;

    /**
     * Y coordinate of the circular gauge center point, which takes values either in pixels or in percentage.
     * @default null
     */

    @Property(null)
    public centerY: string;

    /**
     * To place the half or quarter circle in center position, if values not specified for centerX and centerY.
     * @default false
     */
    @Property(false)
    public moveToCenter: boolean;

    /**
     * Specifies the theme for circular gauge.
     * * Material - Gauge render with material theme.
     * * Fabric - Gauge render with fabric theme.
     * @default Material
     */
    @Property('Material')
    public theme: GaugeTheme;

    /**
     * Specifies whether a grouping separator should be used for a number.
     * @default false
     */
    @Property(false)
    public useGroupingSeparator: boolean;

    /**
     * Information about gauge for assistive technology.
     * @default null
     */
    @Property(null)
    public description: string;

    /**
     * TabIndex value for the gauge.
     * @default 1
     */
    @Property(1)
    public tabIndex: number;

    /**
     * Triggers after gauge loaded.
     * @event
     */
    @Event()
    public loaded: EmitType<ILoadedEventArgs>;

    /**
     * Triggers before gauge load.
     * @event
     */
    @Event()
    public load: EmitType<ILoadedEventArgs>;

    /**
     * Triggers after animation gets completed for pointers.
     * @event
     */
    @Event()
    public animationComplete: EmitType<IAnimationCompleteEventArgs>;

    /**
     * Triggers before each axis label gets rendered.
     * @event
     */
    @Event()
    public axisLabelRender: EmitType<IAxisLabelRenderEventArgs>;

    /**
     * Triggers before each annotation gets rendered.
     * @event
     */
    @Event()
    public annotationRender: EmitType<IAnnotationRenderEventArgs>;

    /**
     * Triggers before the tooltip for pointer gets rendered.
     * @event
     */

    @Event()
    public tooltipRender: EmitType<ITooltipRenderEventArgs>;

    /**
     * Triggers before the pointer is dragged.
     * @event
     */

    @Event()
    public dragStart: EmitType<IPointerDragEventArgs>;

    /**
     * Triggers while dragging the pointers.
     * @event
     */

    @Event()
    public dragMove: EmitType<IPointerDragEventArgs>;

    /**
     * Triggers after the pointer is dragged.
     * @event
     */

    @Event()
    public dragEnd: EmitType<IPointerDragEventArgs>;

    /**
     * Triggers on hovering the circular gauge.
     * @event
     */

    @Event()
    public gaugeMouseMove: EmitType<IMouseEventArgs>;


    /**
     * Triggers while cursor leaves the circular gauge.
     * @event
     */

    @Event()
    public gaugeMouseLeave: EmitType<IMouseEventArgs>;

    /**
     * Triggers on mouse down.
     * @event
     */

    @Event()
    public gaugeMouseDown: EmitType<IMouseEventArgs>;

    /**
     * Triggers on mouse up.
     * @event
     */

    @Event()
    public gaugeMouseUp: EmitType<IMouseEventArgs>;

    /**
     * Triggers after window resize.
     * @event
     */

    @Event()
    public resized: EmitType<IResizeEventArgs>;

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
    public gaugeRect: Rect;
    /** @private */
    public animatePointer: boolean;
    /** @private */
    /**
     * Render axis panel for gauge.
     * @hidden
     */
    public gaugeAxisLayoutPanel: AxisLayoutPanel;

    /**
     * Constructor for creating the widget
     * @hidden
     */
    constructor(options?: CircularGaugeModel, element?: string | HTMLElement) {
        super(options, element);
    }

    /**
     *  To create svg object, renderer and binding events for the container.
     */
    protected preRender(): void {
        this.unWireEvents();
        this.trigger(load, { gauge: this });
        this.themeEffect();
        this.initPrivateVariable();
        this.setCulture();
        this.createSvg();
        this.wireEvents();
    }
    private themeEffect(): void {
        if (this.theme === 'Highcontrast') {
            this.titleStyle.color = this.titleStyle.color || '#FFFFFF';
            this.setThemeColors('#FFFFFF', '#FFFFFF');
        } else {
            this.titleStyle.color = this.titleStyle.color || '#424242';
            this.setThemeColors('#212121', '#757575');
        }
    }
    private setThemeColors(labelcolor: string, others: string): void {
        for (let axis of this.axes) {
            axis.lineStyle.color = axis.lineStyle.color || others;
            axis.labelStyle.font.color = axis.labelStyle.font.color || labelcolor;
            axis.majorTicks.color = axis.majorTicks.color || others;
            axis.minorTicks.color = axis.minorTicks.color || others;
            for (let pointer of axis.pointers) {
                pointer.color = pointer.color || others;
                pointer.needleTail.color = pointer.needleTail.color || others;
                pointer.needleTail.border.color = pointer.needleTail.border.color || others;
                pointer.cap.color = pointer.cap.color || others;
                pointer.cap.border.color = pointer.cap.border.color || others;
            }
        }
    }
    /**
     * To render the circular gauge elements
     */
    protected render(): void {

        this.calculateBounds();

        this.renderElements();

    }

    /**
     * Method to unbind events for circular gauge
     */
    private unWireEvents(): void {
        EventHandler.remove(this.element, Browser.touchStartEvent, this.gaugeOnMouseDown);
        EventHandler.remove(this.element, Browser.touchMoveEvent, this.mouseMove);
        EventHandler.remove(this.element, Browser.touchEndEvent, this.mouseEnd);
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
     */
    private wireEvents(): void {
        /*! Bind the Event handler */
        EventHandler.add(this.element, Browser.touchStartEvent, this.gaugeOnMouseDown, this);
        EventHandler.add(this.element, Browser.touchMoveEvent, this.mouseMove, this);
        EventHandler.add(this.element, Browser.touchEndEvent, this.mouseEnd, this);
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
     * Handles the mouse move. 
     * @return {boolean}
     * @private
     */
    public mouseMove(e: PointerEvent): boolean {
        let args: IMouseEventArgs = this.getMouseArgs(e, 'touchmove', gaugeMouseMove);
        this.trigger(gaugeMouseMove, args);
        let dragArgs: IPointerDragEventArgs;
        let tooltip: GaugeTooltip = this.tooltipModule;
        if (!args.cancel) {
            if (this.enablePointerDrag && this.activePointer) {
                dragArgs = {
                    axis: this.activeAxis,
                    pointer: this.activePointer,
                    previousValue: this.activePointer.currentValue,
                    name: dragMove,
                    currentValue: null
                };
                this.pointerDrag(new GaugeLocation(args.x, args.y));
                dragArgs.currentValue = this.activePointer.currentValue;
                this.trigger(dragMove, dragArgs);
            }
        }
        this.notify(Browser.touchMoveEvent, e);
        return false;
    }

    /**
     * Handles the mouse leave. 
     * @return {boolean}
     * @private
     */
    public mouseLeave(e: PointerEvent): boolean {
        this.activeAxis = null;
        this.activePointer = null;
        this.svgObject.setAttribute('cursor', 'auto');
        let args: IMouseEventArgs = this.getMouseArgs(e, 'touchmove', gaugeMouseLeave);
        this.trigger(gaugeMouseLeave, args);
        return false;
    }

    /**
     * Handles the mouse right click. 
     * @return {boolean}
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
     * @private
     */
    public pointerDrag(location: GaugeLocation): void {
        let axis: Axis = this.activeAxis;
        let range: VisibleRangeModel = axis.visibleRange;
        let value: number = getValueFromAngle(
            getAngleFromLocation(this.midPoint, location), range.max, range.min,
            axis.startAngle, axis.endAngle,
            axis.direction === 'ClockWise'
        );
        if (value >= range.min && value <= range.max) {
            this.activePointer.currentValue = value;
            this.activePointer.value = value;
            this.gaugeAxisLayoutPanel.pointerRenderer.setPointerValue(axis, this.activePointer, value);
        }
    }

    /**
     * Handles the mouse down on gauge. 
     * @return {boolean}
     * @private
     */
    public gaugeOnMouseDown(e: PointerEvent): boolean {
        let currentPointer: IVisiblePointer;
        let args: IMouseEventArgs = this.getMouseArgs(e, 'touchstart', gaugeMouseDown);
        this.trigger(gaugeMouseDown, args);
        if (!args.cancel && args.target.id.indexOf('_Pointer_') >= 0 &&
            args.target.id.indexOf(this.element.id + '_Axis_') >= 0) {
            currentPointer = getPointer(args.target.id, this);
            this.activeAxis = <Axis>this.axes[currentPointer.axisIndex];
            this.activePointer = <Pointer>this.activeAxis.pointers[currentPointer.pointerIndex];
            this.trigger(dragStart, {
                axis: this.activeAxis,
                name: dragStart,
                pointer: this.activePointer,
                currentValue: this.activePointer.currentValue
            } as IPointerDragEventArgs);
            this.svgObject.setAttribute('cursor', 'pointer');
        }
        return false;
    }

    /**
     * Handles the mouse end. 
     * @return {boolean}
     * @private
     */
    public mouseEnd(e: PointerEvent): boolean {
        let args: IMouseEventArgs = this.getMouseArgs(e, 'touchend', gaugeMouseUp);
        let isTouch: boolean = e.pointerType === 'touch' || e.pointerType === '2' || e.type === 'touchend';
        let tooltipInterval: number;
        let tooltip: GaugeTooltip = this.tooltipModule;
        this.trigger(gaugeMouseUp, args);
        if (this.activeAxis && this.activePointer) {
            this.trigger(dragEnd, {
                name: dragEnd,
                axis: this.activeAxis,
                pointer: this.activePointer,
                currentValue: this.activePointer.currentValue
            } as IPointerDragEventArgs);
            this.activeAxis = null;
            this.activePointer = null;
        }
        this.svgObject.setAttribute('cursor', 'auto');
        this.notify(Browser.touchEndEvent, e);
        return false;
    }

    /**
     * Handles the mouse event arguments. 
     * @return {IMouseEventArgs}
     * @private
     */
    private getMouseArgs(e: PointerEvent, type: string, name: string): IMouseEventArgs {
        let rect: ClientRect = this.element.getBoundingClientRect();
        let location: GaugeLocation = new GaugeLocation(-rect.left, -rect.top);
        let isTouch: boolean = (e.type === type);
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
     * @return {boolean}
     * @private
     */
    public gaugeResize(e: Event): boolean {
        let args: IResizeEventArgs = {
            gauge: this,
            previousSize: new Size(
                this.availableSize.width,
                this.availableSize.height
            ),
            name: resized,
            currentSize: new Size(0, 0)
        };
        this.animatePointer = false;
        if (this.resizeTo) {
            clearTimeout(this.resizeTo);
        }
        if (this.element.classList.contains('e-circulargauge')) {
            this.resizeTo = window.setTimeout(
                (): void => {
                    this.createSvg();
                    this.calculateBounds();
                    this.renderElements();
                    args.currentSize = this.availableSize;
                    this.trigger(resized, args);
                },
                500);
        }
        return false;
    }

    /**
     * Applying styles for circular gauge elements
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
     */
    private setCulture(): void {
        this.intl = new Internationalization();
    }

    /**
     * Methods to create svg element for circular gauge.
     */
    private createSvg(): void {
        this.removeSvg();
        this.calculateSvgSize();
        this.svgObject = this.renderer.createSvg({
            id: this.element.id + '_svg',
            width: this.availableSize.width,
            height: this.availableSize.height
        });
    }

    /**
     * To Remove the SVG from circular gauge. 
     * @return {boolean}
     * @private
     */
    public removeSvg(): void {
        removeElement(this.element.id + '_Secondary_Element');
        if (this.svgObject) {
            while (this.svgObject.childNodes.length > 0) {
                this.svgObject.removeChild(this.svgObject.firstChild);
            }
            if (!this.svgObject.hasChildNodes() && this.svgObject.parentNode) {
                remove(this.svgObject);
            }
        }
    }

    /**
     * To initialize the circular gauge private variable.
     * @private
     */
    private initPrivateVariable(): void {
        this.renderer = new SvgRenderer(this.element.id);
        this.gaugeAxisLayoutPanel = new AxisLayoutPanel(this);
        this.animatePointer = true;
    }

    /**
     * To calculate the size of the circular gauge element.
     */
    private calculateSvgSize(): void {
        let containerWidth: number = this.element.offsetWidth;
        let containerHeight: number = this.element.offsetHeight;
        let width: number = stringToNumber(this.width, containerWidth) || containerWidth || 600;
        let height: number = stringToNumber(this.height, containerHeight) || containerHeight || 450;
        this.availableSize = new Size(width, height);
    }

    /**
     * Method to calculate the availble size for circular gauge.
     */
    private calculateBounds(): void {
        let padding: number = 5; let rect: Rect;
        let margin: MarginModel = this.margin;
        let titleHeight: number = 0;
        if (this.title) {
            titleHeight = measureText(this.title, this.titleStyle).height + padding;
        }
        let top: number = margin.top + titleHeight + this.border.width;
        let left: number = margin.left + this.border.width;
        let width: number = this.availableSize.width - left - margin.right - this.border.width;
        let height: number = this.availableSize.height - top - this.border.width - margin.bottom;
        let radius: number = Math.min(width, height) / 2;
        if (this.moveToCenter && this.axes.length === 1 &&
            isNullOrUndefined(this.centerX) && isNullOrUndefined(this.centerY)) {
            rect = new Rect(left, top, width, height);
        } else {
            rect = new Rect(
                (left + (width / 2) - radius), (top + (height / 2) - radius),
                radius * 2, radius * 2
            );
        }
        this.gaugeRect = rect;
        let centerX: number = this.centerX !== null ?
            stringToNumber(this.centerX, this.availableSize.width) : rect.x + (rect.width / 2);
        let centerY: number = this.centerY !== null ?
            stringToNumber(this.centerY, this.availableSize.height) : rect.y + (rect.height / 2);
        this.midPoint = new GaugeLocation(centerX, centerY);
        this.gaugeAxisLayoutPanel.measureAxis(rect);
    }

    /**
     * To render elements for circular gauge
     */
    private renderElements(animate: boolean = true): void {

        this.renderBorder();

        this.renderTitle();

        this.gaugeAxisLayoutPanel.renderAxes(animate);

        this.element.appendChild(this.svgObject);

        this.trigger(loaded, { gauge: this });

    }

    /**
     * Method to render the title for circular gauge.
     */
    private renderTitle(): void {
        if (this.title) {
            let size: Size = measureText(this.title, this.titleStyle);
            let options: TextOption = new TextOption(
                this.element.id + '_CircularGaugeTitle',
                this.availableSize.width / 2,
                this.margin.top + 3 * (size.height / 4),
                'middle', this.title
            );
            let element: Element = textElement(options, this.titleStyle, this.titleStyle.color, this.svgObject, '');
            element.setAttribute('aria-label', this.description || this.title);
            element.setAttribute('tabindex', this.tabIndex.toString());
        }
    }

    /**
     * Method to render the border for circular gauge.
     */
    private renderBorder(): void {
        let borderWidth: number = this.border.width;
        if (borderWidth > 0 || (this.background !== null && this.background !== 'transparent')) {
            this.svgObject.appendChild(this.renderer.drawRectangle(
                new RectOption(
                    this.element.id + '_CircularGaugeBorder', this.background, this.border, null,
                    new Rect(
                        borderWidth / 2, borderWidth / 2, this.availableSize.width - borderWidth,
                        this.availableSize.height - borderWidth
                    ))
            ) as HTMLElement);
        }
    }

    /**
     * Method to set the pointer value dynamically for circular gauge.
     */
    public setPointerValue(axisIndex: number, pointerIndex: number, value: number): void {
        let axis: Axis = <Axis>this.axes[axisIndex];
        let pointer: Pointer = <Pointer>axis.pointers[pointerIndex];
        let pointerRadius: number = pointer.currentRadius;
        let enableAnimation: boolean = pointer.animation.enable;
        value = value < axis.visibleRange.min ? axis.visibleRange.min : value;
        value = value > axis.visibleRange.max ? axis.visibleRange.max : value;
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
                } else {
                    setStyles(element as HTMLElement, pointer.color, pointer.border);
                }
                if (enableAnimation) {
                    this.gaugeAxisLayoutPanel.pointerRenderer.performNeedleAnimation(
                        element as HTMLElement, pointer.currentValue, value, axis, pointer,
                        pointerRadius, (pointerRadius - pointer.pointerWidth)
                    );
                } else {
                    this.gaugeAxisLayoutPanel.pointerRenderer.setPointerValue(axis, pointer, value);
                }
            }
        });
        pointer.currentValue = value;
        pointer.value = value;
    }

    /**
     * Method to set the annotation content dynamically for circular gauge.
     */
    public setAnnotationValue(axisIndex: number, annotationIndex: number, content: string): void {
        let isElementExist: boolean = getElement(this.element.id + '_Annotations_' + axisIndex) !== null;
        let element: HTMLElement = <HTMLElement>getElement(this.element.id + '_Annotations_' + axisIndex) ||
            createElement('div', {
                id: this.element.id + '_Annotations_' + axisIndex
            });
        let annotation: Annotation = <Annotation>this.axes[axisIndex].annotations[annotationIndex];
        if (content !== null) {
            removeElement(this.element.id + '_Axis_' + axisIndex + '_Annotation_' + annotationIndex);
            annotation.content = content;
            this.annotationsModule.createTemplate(element, annotationIndex, axisIndex);
            if (!isElementExist) {
                getElement(this.element.id + '_Secondary_Element').appendChild(element);
            }
        }
    }

    /**
     * Method to set the range values dynamically for circular gauge.
     */
    public setRangeValue(axisIndex: number, rangeIndex: number, start: number, end: number): void {
        let element: Element = getElement(
            this.element.id + '_Axis_' + axisIndex + '_Range_' + rangeIndex
        );
        let axis: Axis = <Axis>this.axes[axisIndex];
        let range: Range = <Range>axis.ranges[rangeIndex];
        let axisRange: VisibleRangeModel = axis.visibleRange;
        let isClockWise: boolean = axis.direction === 'ClockWise';
        let startValue: number = Math.min(Math.max(start, axisRange.min), end);
        let endValue: number = Math.min(Math.max(start, end), axisRange.max);
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
            startWidth, endWidth
        ));
        setStyles(element as HTMLElement, (range.color ? range.color : range.rangeColor), {
            color: (range.color ? range.color : range.rangeColor),
            width: 0
        });
    }

    /**
     * To destroy the widget
     * @method destroy
     * @return {void}
     * @member of Circular-Gauge
     */
    public destroy(): void {
        this.unWireEvents();
        this.removeSvg();
        super.destroy();
    }

    /**
     * To provide the array of modules needed for control rendering
     * @return {ModuleDeclaration[]}
     * @private 
     */
    public requiredModules(): ModuleDeclaration[] {
        let modules: ModuleDeclaration[] = [];
        let annotationEnable: boolean = false;
        let axes: Axis[] = <Axis[]>this.axes;
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
        return modules;
    }



    /**
     * Get the properties to be maintained in the persisted state.
     * @private
     */
    public getPersistData(): string {
        return this.addOnPersist([]);
    }

    /**
     * Called internally if any of the property value changed.
     * @private
     */
    public onPropertyChanged(newProp: CircularGaugeModel, oldProp: CircularGaugeModel): void {
        // property method calculated
        let renderer: boolean = false;
        let refreshBounds: boolean = false;
        let refreshWithoutAnimation: boolean = false;
        for (let prop of Object.keys(newProp)) {
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
                case 'axes':
                    refreshWithoutAnimation = true;
                    break;
            }
        }
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

    /**
     * Get component name for circular gauge
     * @private
     */
    public getModuleName(): string {
        return 'circulargauge';
    }
}
