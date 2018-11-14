import { Component, Property, NotifyPropertyChanges, Internationalization, ModuleDeclaration } from '@syncfusion/ej2-base';
import { EmitType, INotifyPropertyChanged, SvgRenderer, setCulture, Browser } from '@syncfusion/ej2-base';
import { Event, EventHandler, Complex, Collection, isNullOrUndefined, remove, createElement } from '@syncfusion/ej2-base';
import { Border, Font, Container, Margin, Annotation, TooltipSettings } from './model/base';
import { FontModel, BorderModel, ContainerModel, MarginModel, AnnotationModel, TooltipSettingsModel } from './model/base-model';
import { AxisModel } from './axes/axis-model';
import { Axis, Pointer } from './axes/axis';
import { load, loaded, gaugeMouseMove, gaugeMouseLeave, gaugeMouseDown, gaugeMouseUp, resized, valueChange } from './model/constant';
import { LinearGaugeModel } from './linear-gauge-model';
import { ILoadedEventArgs, ILoadEventArgs, IAnimationCompleteEventArgs, IAnnotationRenderEventArgs } from './model/interface';
import { ITooltipRenderEventArgs, IVisiblePointer, IMouseEventArgs, IAxisLabelRenderEventArgs, IMoveCursor } from './model/interface';
import { IResizeEventArgs, IValueChangeEventArgs } from './model/interface';
import { Size, valueToCoefficient, calculateShapes, stringToNumber, removeElement, getElement, VisibleRange } from './utils/helper';
import { measureText, Rect, TextOption, textElement, GaugeLocation, RectOption, PathOption } from './utils/helper';
import { getBox, withInRange, getPointer, convertPixelToValue, isPointerDrag } from './utils/helper';
import { Orientation, LinearGaugeTheme } from './utils/enum';
import { AxisLayoutPanel } from './axes/axis-panel';
import { AxisRenderer } from './axes/axis-renderer';
import { Annotations } from './annotations/annotations';
import { GaugeTooltip } from './user-interaction/tooltip';

/**
 * Represents the EJ2 Linear gauge control.
 * ```html
 * <div id="container"/>
 * <script>
 *   var gaugeObj = new LinearGauge({ });
 *   gaugeObj.appendTo("#container");
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class LinearGauge extends Component<HTMLElement> implements INotifyPropertyChanged {
    //Module declaration for gauge
    /**
     *  annotationModule is used to place the any text or images into the gauge.
     */
    public annotationsModule: Annotations;

    /**
     * tooltipModule is used to display the pointer value.
     */
    public tooltipModule: GaugeTooltip;

    /**
     * The width of the Linear gauge as a string in order to provide input as both like '100px' or '100%'.
     * If specified as '100%, gauge will render to the full width of its parent element.
     * @default null
     */

    @Property(null)
    public width: string;

    /**
     * The height of the Linear gauge as a string in order to provide input as both like '100px' or '100%'.
     * If specified as '100%, gauge will render to the full height of its parent element.
     * @default null
     */

    @Property(null)
    public height: string;

    /**
     * Specifies the gauge will rendered either horizontal or vertical orientation.
     * @default Vertical
     */
    @Property('Vertical')
    public orientation: Orientation;

    /**
     *  Options to customize the left, right, top and bottom margins of the gauge.
     */

    @Complex<MarginModel>({}, Margin)
    public margin: MarginModel;

    /**
     * Options for customizing the color and width of the gauge border.
     */

    @Complex<BorderModel>({ color: '', width: 0 }, Border)
    public border: BorderModel;

    /**
     * The background color of the gauge, which accepts value in hex, rgba as a valid CSS color string.
     * @default 'transparent'
     */
    @Property('transparent')
    public background: string;

    /**
     * Specifies the title for linear gauge.
     */

    @Property('')
    public title: string;

    /**
     * Options for customizing the title appearance of linear gauge.
     */

    @Complex<FontModel>({ size: '15px', color: null }, Font)
    public titleStyle: FontModel;

    /**
     * Options for customizing the container linear gauge.
     */

    @Complex<ContainerModel>({}, Container)
    public container: ContainerModel;

    /**
     *  Options for customizing the axes of linear gauge.
     */

    @Collection<AxisModel>([{}], Axis)
    public axes: AxisModel[];

    /**
     * Options for customizing the tooltip in linear gauge.
     */

    @Complex<TooltipSettingsModel>({}, TooltipSettings)
    public tooltip: TooltipSettingsModel;

    /**
     *  Options for customizing the annotation of linear gauge.
     */
    @Collection<AnnotationModel>([{}], Annotation)
    public annotations: AnnotationModel[];

    /**
     * Specifies color palette for axis ranges.
     * @default []
     */
    @Property([])
    public rangePalettes: string[];

    /**
     * Specifies whether a grouping separator should be used for a number.
     * @default false
     */
    @Property(false)
    public useGroupingSeparator: boolean;

    /**
     * Specifies the description for linear gauge.
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
     * To apply internationalization for gauge
     * @default null
     */
    @Property(null)
    public format: string;

    /**
     * Specifies the theme for the maps.
     * @default Material
     */
    @Property('Material')
    public theme: LinearGaugeTheme;

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
    public load: EmitType<ILoadEventArgs>;

    /**
     * Triggers after complete the animation for pointer.
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
     * Triggers before the tooltip get rendered.
     * @event
     */

    @Event()
    public tooltipRender: EmitType<ITooltipRenderEventArgs>;

    /**
     * Triggers when mouse move on gauge area.
     * @event
     */

    @Event()
    public gaugeMouseMove: EmitType<IMouseEventArgs>;


    /**
     * Triggers when mouse leave from the gauge area .
     * @event
     */

    @Event()
    public gaugeMouseLeave: EmitType<IMouseEventArgs>;

    /**
     * Triggers when mouse down on gauge area.
     * @event
     */

    @Event()
    public gaugeMouseDown: EmitType<IMouseEventArgs>;

    /**
     * Triggers when mouse up on gauge area.
     * @event
     */

    @Event()
    public gaugeMouseUp: EmitType<IMouseEventArgs>;

    /**
     * Triggers while drag the pointer.
     * @event
     */

    @Event()
    public valueChange: EmitType<IValueChangeEventArgs>;

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
    public actualRect: Rect;
    /** @private */
    public intl: Internationalization;
    /** @private* */
    public containerBounds: Rect;
    /**
     * @private
     * Calculate the axes bounds for gauge.
     * @hidden
     */
    public gaugeAxisLayoutPanel: AxisLayoutPanel;
    /**
     * @private
     * Render the axis elements for gauge.
     * @hidden
     */
    public axisRenderer: AxisRenderer;

    /** @private */
    private resizeTo: number;

    /** @private */
    public containerObject: Element;

    /** @private */
    public pointerDrag: boolean = false;

    /** @private */
    public mouseX: number = 0;

    /** @private */
    public mouseY: number = 0;

    /** @private */
    public mouseElement: Element;

    /** @private */
    public gaugeResized: boolean = false;

    /** @private */
    public nearSizes: number[];

    /** @private */
    public farSizes: number[];

    /**
     * @private
     * Constructor for creating the widget
     * @hidden
     */

    constructor(options?: LinearGaugeModel, element?: string | HTMLElement) {
        super(options, element);
    }

    /**
     * Initialize the preRender method. 
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
            this.setThemeColors('#686868', '#a6a6a6');
        }
    }
    private setThemeColors(labelcolor: string, others: string): void {
        for (let axis of this.axes) {
            axis.line.color = axis.line.color || others;
            axis.labelStyle.font.color = axis.labelStyle.font.color || labelcolor;
            axis.majorTicks.color = axis.majorTicks.color || others;
            axis.minorTicks.color = axis.minorTicks.color || others;
            for (let pointer of axis.pointers) {
                pointer.color = pointer.color || others;
            }
        }
        for (let annotation of this.annotations) {
            annotation.font.color = annotation.font.color || labelcolor;
        }
    }
    private initPrivateVariable(): void {
        if (this.element.id === '') {
            let collection: number = document.getElementsByClassName('e-lineargauge').length;
            this.element.id = 'lineargauge_' + 'control_' + collection;
        }
        this.renderer = new SvgRenderer(this.element.id);
        this.gaugeAxisLayoutPanel = new AxisLayoutPanel(this);
        this.axisRenderer = new AxisRenderer(this);
    }

    /**
     * Method to set culture for chart
     */
    private setCulture(): void {
        this.intl = new Internationalization();
    }

    /**
     * Methods to create svg element
     */
    private createSvg(): void {
        this.removeSvg();
        this.calculateSize();
        this.svgObject = this.renderer.createSvg({
            id: this.element.id + '_svg',
            width: this.availableSize.width,
            height: this.availableSize.height
        });
    }

    /**
     * To Remove the SVG. 
     * @return {boolean}
     * @private
     */

    public removeSvg(): void {
        removeElement(this.element.id + '_Secondary_Element');
        if (!(isNullOrUndefined(this.svgObject)) && !isNullOrUndefined(this.svgObject.parentNode)) {
            remove(this.svgObject);
        }
    }

    /**
     * Method to calculate the size of the gauge
     */
    private calculateSize(): void {
        let width: number = stringToNumber(this.width, this.element.offsetWidth) || this.element.offsetWidth || 600;
        let height: number = stringToNumber(this.height, this.element.offsetHeight) || this.element.offsetHeight || 450;
        this.availableSize = new Size(width, height);
    }

    /**
     * To Initialize the control rendering
     */
    protected render(): void {
        this.renderGaugeElements();
        this.calculateBounds();
        this.renderAxisElements();
        this.trigger(loaded, { gauge: this });
    }

    /**
     * @private
     * To render the gauge elements
     */
    public renderGaugeElements(): void {
        this.appendSecondaryElement();
        this.renderBorder();
        this.renderTitle();
        this.renderContainer();
    }

    private appendSecondaryElement(): void {
        if (isNullOrUndefined(getElement(this.element.id + '_Secondary_Element'))) {
            let secondaryElement: Element = createElement('div');
            secondaryElement.id = this.element.id + '_Secondary_Element';
            secondaryElement.setAttribute('style', 'position: relative');
            this.element.appendChild(secondaryElement);
        }
    }

    /**
     * @private
     * To calculate axes bounds
     */
    public calculateBounds(): void {
        this.gaugeAxisLayoutPanel.calculateAxesBounds();
    }

    /**
     * @private
     * To render axis elements
     */
    public renderAxisElements(): void {
        this.axisRenderer.renderAxes();
        this.element.appendChild(this.svgObject);
        if (this.annotationsModule) {
            this.annotationsModule.renderAnnotationElements();
        }
    }

    private renderBorder(): void {
        let width: number = this.border.width;
        if (width > 0) {
            let rect: RectOption = new RectOption(
                this.element.id + '_LinearGaugeBorder', this.background, this.border, 1,
                new Rect(width / 2, width / 2, this.availableSize.width - width, this.availableSize.height - width), null, null);
            this.svgObject.appendChild(this.renderer.drawRectangle(rect) as HTMLElement);
        }
    }

    private renderTitle(): void {
        let x: number; let y: number;
        let height: number; let width: number;
        let titleBounds: Rect;
        if (this.title) {
            let size: Size = measureText(this.title, this.titleStyle);
            let options: TextOption = new TextOption(
                this.element.id + '_LinearGaugeTitle',
                this.availableSize.width / 2,
                this.margin.top + (size.height / 2),
                'middle', this.title
            );
            titleBounds = {
                x: options.x - (size.width / 2),
                y: options.y,
                width: size.width,
                height: size.height
            };
            let element: Element = textElement(options, this.titleStyle, this.titleStyle.color, this.svgObject);
            element.setAttribute('aria-label', this.description || this.title);
            element.setAttribute('tabindex', this.tabIndex.toString());
        }
        x = this.margin.left;
        y = (isNullOrUndefined(titleBounds)) ? this.margin.top : titleBounds.y;
        height = (this.availableSize.height - y - this.margin.bottom);
        width = (this.availableSize.width - this.margin.left - this.margin.right);
        this.actualRect = { x: x, y: y, width: width, height: height };
    }

    /*
     * Method to unbind the gauge events
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
        EventHandler.remove(
            <HTMLElement & Window>window,
            (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize',
            this.gaugeResize.bind(this)
        );
    }

    /*
     * Method to bind the gauge events
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
        EventHandler.add(
            <HTMLElement & Window>window,
            (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize',
            this.gaugeResize, this
        );
        this.setStyle(<HTMLElement>this.element);
    }

    private setStyle(element: HTMLElement): void {
        element.style.touchAction = isPointerDrag(this.axes) ? 'none' : 'element';
        element.style.msTouchAction = isPointerDrag(this.axes) ? 'none' : 'element';
        element.style.msContentZooming = 'none';
        element.style.msUserSelect = 'none';
        element.style.webkitUserSelect = 'none';
        element.style.position = 'relative';
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
        if (this.resizeTo) {
            clearTimeout(this.resizeTo);
        }
        if (this.element.classList.contains('e-lineargauge')) {
            this.resizeTo = setTimeout(
                (): void => {
                    this.gaugeResized = true;
                    this.createSvg();
                    this.refreshing = true;
                    args.currentSize = new Size(this.availableSize.width, this.availableSize.height);
                    this.trigger(resized, args);
                    this.render();
                },
                500);
        }
        return false;
    }

    /**
     * To destroy the gauge element from the DOM.
     */
    public destroy(): void {
        this.unWireEvents();
        this.removeSvg();
        super.destroy();
    }

    /**
     * @private
     * To render the gauge container
     */
    public renderContainer(): void {
        let width: number; let height: number; let x: number; let y: number;
        let options: PathOption;
        let path: string = '';
        let topRadius: number; let bottomRadius: number;
        let fill: string = this.container.backgroundColor;
        let rect: RectOption;
        let radius: number = this.container.width;
        bottomRadius = radius + ((radius / 2) / Math.PI);
        topRadius = radius / 2;
        if (this.orientation === 'Vertical') {
            height = this.actualRect.height;
            height = (this.container.height > 0 ? this.container.height : ((height / 2) - ((height / 2) / 4)) * 2);
            width = this.container.width;
            height = (this.container.type === 'Thermometer') ? height - (bottomRadius * 2) - topRadius : height;
            x = (this.actualRect.x + ((this.actualRect.width / 2) - (this.container.width / 2))) + this.container.offset;
            y = this.actualRect.y + ((this.actualRect.height / 2) - ((this.container.type === 'Thermometer') ?
                ((height + (bottomRadius * 2) - topRadius)) / 2 : height / 2));
            height = height;
        } else {
            width = (this.container.height > 0) ? this.container.height :
                ((this.actualRect.width / 2) - ((this.actualRect.width / 2) / 4)) * 2;
            width = (this.container.type === 'Thermometer') ? width - (bottomRadius * 2) - topRadius : width;
            x = this.actualRect.x + ((this.actualRect.width / 2) - ((this.container.type === 'Thermometer') ?
                (width - (bottomRadius * 2) + topRadius) / 2 : width / 2));
            y = (this.actualRect.y + ((this.actualRect.height / 2) - (this.container.width / 2))) + this.container.offset;
            height = this.container.width;
        }
        this.containerBounds = { x: x, y: y, width: width, height: height };
        if (this.containerBounds.width > 0) {
            this.containerObject = this.renderer.createGroup({ id: this.element.id + '_Container_Group', transform: 'translate( 0, 0)' });
            if (this.container.type === 'Normal') {
                rect = new RectOption(
                    this.element.id + '_' + this.container.type + '_Layout', fill, this.container.border, 1,
                    new Rect(x, y, width, height));
                this.containerObject.appendChild(this.renderer.drawRectangle(rect));
            } else {
                path = getBox(
                    this.containerBounds, this.container.type, this.orientation,
                    new Size(this.container.height, this.container.width), 'container', null, null, this.container.roundedCornerRadius);
                options = new PathOption(
                    this.element.id + '_' + this.container.type + '_Layout', fill,
                    this.container.border.width, this.container.border.color, 1, '', path);
                this.containerObject.appendChild(this.renderer.drawPath(options) as SVGAElement);
            }
            this.svgObject.appendChild(this.containerObject);
        }
    }

    /**
     * Handles the mouse down on gauge. 
     * @return {boolean}
     * @private
     */
    public gaugeOnMouseDown(e: PointerEvent): boolean {
        let pageX: number; let pageY: number;
        let target: Element;
        let element: Element = <Element>e.target;
        let split: string[] = [];
        let clientRect: ClientRect = this.element.getBoundingClientRect();
        let axis: Axis; let isPointer: boolean = false;
        let pointer: Pointer;
        let current: IMoveCursor;
        let top: number; let left: number;
        let pointerElement: Element; let svgPath: SVGPathElement;
        let dragProcess: boolean = false;
        let args: IMouseEventArgs = this.getMouseArgs(e, 'touchstart', gaugeMouseDown);
        this.trigger(gaugeMouseDown, args);
        this.mouseX = args.x;
        this.mouseY = args.y;
        if (args.target) {
            if (!args.cancel && ((args.target.id.indexOf('MarkerPointer') > -1) || (args.target.id.indexOf('BarPointer') > -1))) {
                current = this.moveOnPointer(args.target as HTMLElement);
                if (!(isNullOrUndefined(current)) && current.pointer) {
                    this.pointerDrag = true;
                    this.mouseElement = args.target;
                }
            }
        }
        return true;
    }

    /**
     * Handles the mouse move. 
     * @return {boolean}
     * @private
     */
    public mouseMove(e: PointerEvent): boolean {
        let current: IMoveCursor;
        let element: Element;
        let args: IMouseEventArgs = this.getMouseArgs(e, 'touchmove', gaugeMouseMove);
        this.trigger(gaugeMouseMove, args);
        this.mouseX = args.x;
        this.mouseY = args.y;
        if (args.target && !args.cancel) {
            if ((args.target.id.indexOf('MarkerPointer') > -1) || (args.target.id.indexOf('BarPointer') > -1)) {
                current = this.moveOnPointer(args.target as HTMLElement);
                if (!(isNullOrUndefined(current)) && current.pointer) {
                    this.element.style.cursor = current.style;
                }
            } else {
                this.element.style.cursor = (this.pointerDrag) ? this.element.style.cursor : 'auto';
            }
            this.gaugeOnMouseMove(e);
        }
        this.notify(Browser.touchMoveEvent, e);
        return false;
    }

    /**
     * To find the mouse move on pointer.
     * @param element 
     */

    private moveOnPointer(element: HTMLElement): IMoveCursor {
        let current: IVisiblePointer;
        let clientRect: ClientRect = this.element.getBoundingClientRect();
        let axis: Axis; let isPointer: boolean = false;
        let pointer: Pointer; let top: number; let left: number;
        let pointerElement: Element = getElement(element.id);
        let svgPath: SVGPathElement = <SVGPathElement>pointerElement;
        let cursorStyle: string;
        let process: IMoveCursor;
        current = getPointer(element as HTMLElement, this);
        axis = current.axis;
        pointer = current.pointer;
        if (pointer.enableDrag) {
            if (pointer.type === 'Bar') {
                if (this.orientation === 'Vertical') {
                    top = pointerElement.getBoundingClientRect().top - clientRect.top;
                    top = (!axis.isInversed) ? top : top + svgPath.getBBox().height;
                    isPointer = !axis.isInversed ? (this.mouseY < (top + 10) && this.mouseY >= top) :
                        (this.mouseY <= top && this.mouseY > (top - 10));
                    cursorStyle = 'n-resize';
                } else {
                    left = pointerElement.getBoundingClientRect().left - clientRect.left;
                    left = (!axis.isInversed) ? left + svgPath.getBBox().width : left;
                    isPointer = !axis.isInversed ? (this.mouseX > (left - 10) && this.mouseX <= left) :
                        (this.mouseX >= left && this.mouseX < (left + 10));
                    cursorStyle = 'e-resize';
                }
            } else {
                isPointer = true;
                cursorStyle = 'pointer';
            }
        }
        if (isPointer) {
            process = { pointer: isPointer, style: cursorStyle };
        }
        return process;
    }

    /**
     * @private
     * Handle the right click
     * @param event 
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
     * Handles the mouse leave. 
     * @return {boolean}
     * @private
     */
    public mouseLeave(e: PointerEvent): boolean {
        let parentNode: HTMLElement;
        let args: IMouseEventArgs = this.getMouseArgs(e, 'touchmove', gaugeMouseLeave);
        if (!isNullOrUndefined(this.mouseElement)) {
            parentNode = <HTMLElement>this.element;
            parentNode.style.cursor = '';
            this.mouseElement = null;
            this.pointerDrag = false;
        }
        return false;
    }

    /**
     * Handles the mouse move on gauge. 
     * @return {boolean}
     * @private
     */
    public gaugeOnMouseMove(e: PointerEvent | TouchEvent): boolean {
        let current: IVisiblePointer;
        if (this.pointerDrag) {
            current = getPointer(this.mouseElement as HTMLElement, this);
            if (current.pointer.enableDrag && current.pointer.animationComplete) {
                this[current.pointer.type.toLowerCase() + 'Drag'](current.axis, current.pointer);
            }
        }
        return true;
    }

    /**
     * Handles the mouse up. 
     * @return {boolean}
     * @private
     */
    public mouseEnd(e: PointerEvent): boolean {
        let parentNode: HTMLElement;
        let tooltipInterval: number;
        let isTouch: boolean = e.pointerType === 'touch' || e.pointerType === '2' || e.type === 'touchend';
        let args: IMouseEventArgs = this.getMouseArgs(e, 'touchend', gaugeMouseUp);
        this.trigger(gaugeMouseUp, args);
        if (!isNullOrUndefined(this.mouseElement)) {
            parentNode = <HTMLElement>this.element;
            parentNode.style.cursor = '';
            this.mouseElement = null;
            this.pointerDrag = false;
        }
        this.notify(Browser.touchEndEvent, e);
        return true;
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
            model: this,
            x: location.x, y: location.y,
            target: isTouch ? <Element>(<TouchEvent & PointerEvent>e).target : <Element>e.target
        };
    }

    /**
     * @private
     * @param axis 
     * @param pointer 
     */

    public markerDrag(axis: Axis, pointer: Pointer): void {
        let options: PathOption;
        let value: number = convertPixelToValue(
            this.element, this.mouseElement, this.orientation, axis, 'drag', new GaugeLocation(this.mouseX, this.mouseY));
        let process: boolean = withInRange(value, null, null, axis.visibleRange.max, axis.visibleRange.min, 'pointer');
        if (withInRange(value, null, null, axis.visibleRange.max, axis.visibleRange.min, 'pointer')) {
            this.triggerDragEvent(this.mouseElement);
            options = new PathOption(
                'pointerID', pointer.color,
                pointer.border.width, pointer.border.color, pointer.opacity, null, null, '');
            if (this.orientation === 'Vertical') {
                pointer.bounds.y = this.mouseY;
            } else {
                pointer.bounds.x = this.mouseX;
            }
            pointer.currentValue = value;
            options = calculateShapes(
                pointer.bounds, pointer.markerType, new Size(pointer.width, pointer.height),
                pointer.imageUrl, options, this.orientation, axis, pointer);
            if (pointer.markerType === 'Image') {
                this.mouseElement.setAttribute('x', (pointer.bounds.x - (pointer.bounds.width / 2)).toString());
                this.mouseElement.setAttribute('y', (pointer.bounds.y - (pointer.bounds.height / 2)).toString());
            } else {
                this.mouseElement.setAttribute('d', options.d);
            }
        }
    }

    /**
     * @private
     * @param axis 
     * @param pointer 
     */

    public barDrag(axis: Axis, pointer: Pointer): void {
        let line: Rect = axis.lineBounds;
        let range: VisibleRange = axis.visibleRange;
        let value1: number; let value2: number;
        let isDrag: boolean;
        let lineHeight: number = (this.orientation === 'Vertical') ? line.height : line.width;
        let lineY: number = (this.orientation === 'Vertical') ? line.y : line.x;
        let path: string;
        value1 = ((valueToCoefficient(range.min, axis, this.orientation, range) * lineHeight) + lineY);
        value2 = ((valueToCoefficient(range.max, axis, this.orientation, range) * lineHeight) + lineY);
        if (this.orientation === 'Vertical') {
            isDrag = (!axis.isInversed) ? (this.mouseY > value2 && this.mouseY < value1) : (this.mouseY > value1 && this.mouseY < value2);
            if (isDrag) {
                if (this.container.type === 'Normal') {
                    if (!axis.isInversed) {
                        this.mouseElement.setAttribute('y', this.mouseY.toString());
                    }
                    this.mouseElement.setAttribute('height', Math.abs(value1 - this.mouseY).toString());
                } else {
                    if (!axis.isInversed) {
                        pointer.bounds.y = this.mouseY;
                    }
                    pointer.bounds.height = Math.abs(value1 - this.mouseY);
                }
            }
        } else {
            isDrag = (!axis.isInversed) ? (this.mouseX > value1 && this.mouseX < value2) : (this.mouseX > value2 && this.mouseX < value1);
            if (isDrag) {
                if (this.container.type === 'Normal') {
                    if (axis.isInversed) {
                        this.mouseElement.setAttribute('x', this.mouseX.toString());
                    }
                    this.mouseElement.setAttribute('width', Math.abs(value1 - this.mouseX).toString());
                } else {
                    if (axis.isInversed) {
                        pointer.bounds.x = this.mouseX;
                    }
                    pointer.bounds.width = Math.abs(value1 - this.mouseX);
                }
            }
        }
        if (isDrag && this.mouseElement.tagName === 'path') {
            this.triggerDragEvent(this.mouseElement);
            path = getBox(
                pointer.bounds, this.container.type, this.orientation,
                new Size(pointer.bounds.width, pointer.bounds.height), 'bar', this.container.width, axis, pointer.roundedCornerRadius);
            this.mouseElement.setAttribute('d', path);
        }
    }

    /**
     * Triggers when drag the pointer
     * @param activeElement 
     */

    private triggerDragEvent(activeElement: Element): void {
        let active: IVisiblePointer = getPointer(this.mouseElement as HTMLElement, this);
        let value: number = convertPixelToValue(
            this.element, this.mouseElement, this.orientation, active.axis, 'tooltip', null);
        let dragArgs: IValueChangeEventArgs = {
            name: 'valueChange',
            gauge: this,
            element: this.mouseElement,
            axisIndex: active.axisIndex,
            axis: active.axis,
            pointerIndex: active.pointerIndex,
            pointer: active.pointer,
            value: value
        };
        this.trigger(valueChange, dragArgs);
    }

    /**
     * To set the pointer value using this method
     * @param axisIndex 
     * @param pointerIndex 
     * @param value 
     */

    public setPointerValue(axisIndex: number, pointerIndex: number, value: number): void {
        let axis: Axis = <Axis>this.axes[axisIndex];
        let pointer: Pointer = <Pointer>axis.pointers[pointerIndex];
        let id: string = this.element.id + '_AxisIndex_' + axisIndex + '_' + pointer.type + 'Pointer_' + pointerIndex;
        let pointerElement: Element = getElement(id);
        pointer.currentValue = value;
        if (
            (pointerElement !== null) && withInRange(
                pointer.currentValue, null, null, axis.visibleRange.max, axis.visibleRange.min, 'pointer'
            )
        ) {
            this.gaugeAxisLayoutPanel['calculate' + pointer.type + 'Bounds'](axisIndex, axis, pointerIndex, pointer);
            this.axisRenderer['draw' + pointer.type + 'Pointer'](axis, axisIndex, pointer, pointerIndex, pointerElement.parentElement);
        }
    }

    /**
     * To set the annotation value using this method.
     * @param annotationIndex 
     * @param content 
     */

    public setAnnotationValue(annotationIndex: number, content: string): void {
        let elementExist: boolean = getElement(this.element.id + '_Annotation_' + annotationIndex) === null;
        let element: HTMLElement = <HTMLElement>getElement(this.element.id + '_AnnotationsGroup') ||
            createElement('div', {
                id: this.element.id + '_AnnotationsGroup'
            });
        let annotation: Annotation = <Annotation>this.annotations[annotationIndex];
        if (content !== null) {
            if (getElement(this.element.id + '_Annotation_' + annotationIndex)) {
                getElement(this.element.id + '_Annotation_' + annotationIndex).remove();
            }
            annotation.content = content;
            this.annotationsModule.createAnnotationTemplate(element, annotationIndex);
            if (!elementExist) {
                element.appendChild(getElement(this.element.id + '_Annotation_' + annotationIndex));
            }
        }
    }

    /**
     * To provide the array of modules needed for control rendering
     * @return {ModuleDeclaration[]}
     * @private 
     */
    public requiredModules(): ModuleDeclaration[] {
        let modules: ModuleDeclaration[] = [];
        let annotationEnable: boolean = false;
        let tooltipEnable: boolean = false;
        this.annotations.map((annotation: Annotation, index: number) => {
            annotationEnable = annotation.content != null;
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
        let keyEntity: string[] = ['loaded'];
        return this.addOnPersist(keyEntity);
    }

    /**
     * Get component name
     */
    public getModuleName(): string {
        return 'lineargauge';
    }

    /**
     * Called internally if any of the property value changed.
     * @private
     */
    public onPropertyChanged(newProp: LinearGaugeModel, oldProp: LinearGaugeModel): void {
        let renderer: boolean = false;
        let refreshBounds: boolean = false;
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'height':
                case 'width':
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
                case 'container':
                    refreshBounds = true;
                    break;
            }
        }
        if (!refreshBounds && renderer) {
            this.removeSvg();
            this.renderGaugeElements();
            this.renderAxisElements();
        }
        if (refreshBounds) {
            this.createSvg();
            this.renderGaugeElements();
            this.calculateBounds();
            this.renderAxisElements();
        }
    }
}