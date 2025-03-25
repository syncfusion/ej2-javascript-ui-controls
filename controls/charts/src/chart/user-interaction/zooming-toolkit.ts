import { EventHandler, isNullOrUndefined } from '@syncfusion/ej2-base';
import { remove } from '@syncfusion/ej2-base';
import { Chart } from '../chart';
import { Axis } from '../axis/axis';
import { AxisModel } from '../axis/axis-model';
import { ZoomMode } from '../utils/enum';
import { removeElement, RectOption, PolygonOption, createTooltip, minMax, getElement } from '../../common/utils/helper';
import { textElement } from '../../common/utils/helper';
import { PathOption, Rect, measureText, TextOption, Size, SvgRenderer, CanvasRenderer } from '@syncfusion/ej2-svg-base';
import { Zoom } from './zooming';
import { zoomComplete, onZooming } from '../../common/model/constants';
import { IZoomCompleteEventArgs, IZoomingEventArgs, IAxisData } from '../../chart/model/chart-interface';

/**
 * The `Toolkit` class provides functionalities for zooming and panning in charts.
 *
 * @private
 */
export class Toolkit {
    private chart: Chart;
    private selectionColor: string;
    private fillColor: string;
    private elementOpacity: string;
    private elementId: string;
    private zoomInElements: Element;
    private zoomOutElements: Element;
    private zoomElements: Element;
    private panElements: Element;
    private iconRect: Rect;
    private enableZoomButton: boolean;
    private hoveredID: string;
    private selectedID: string;
    private iconRectOverFill: string = 'transparent';
    private iconRectSelectionFill: string = 'transparent';
    /** @private */
    public zoomCompleteEvtCollection: IZoomCompleteEventArgs[] = [];
    /** @private */
    public isZoomed: boolean = false;
    /** @private */
    public dragHorizontalRatio: number;
    /** @private */
    public dragVerticalRatio: number;
    /** @private */
    public isDragging: boolean;

    /**
     * Constructor for the chart touch module.
     *
     * @param {Chart} chart - Specifies the chart instance.
     */
    constructor(chart: Chart) {
        this.chart = chart;
        this.elementId = chart.element.id;
        this.chart.svgRenderer = new SvgRenderer(this.elementId);
    }
    /**
     * Creates a pan button.
     *
     * @param {Element} childElement - Specifies the child element.
     * @param {Element} parentElement - Specifies the parent element.
     * @returns {void}
     */
    public createPanButton(childElement: Element, parentElement: Element): void {
        const render: SvgRenderer | CanvasRenderer = this.chart.svgRenderer;
        const fillColor: string = this.chart.zoomModule.isPanning ? this.chart.themeStyle.toolkitSelectionColor :
            this.chart.themeStyle.toolkitFill;
        let direction: string = 'M5,3h2.3L7.275,5.875h1.4L8.65,3H11L8,0L5,3z M3,11V8.7l2.875,0.025v-1.4L3,7.35V5L0,8L3,';
        direction += '11z M11,13H8.7l0.025-2.875h-1.4L7.35,13H5l3,3L11,13z M13,5v2.3l-2.875-0.025v1.4L13,8.65V11l3-3L13,5z';
        //This is for setting low opacity to PAN Button
        this.elementOpacity = !this.chart.zoomModule.isZoomed && this.chart.zoomSettings.showToolbar ? '0.2' : '1';
        childElement.setAttribute('opacity', this.chart.theme === 'Fluent2HighContrast' ? '1' : this.elementOpacity);
        childElement.id = this.elementId + '_Zooming_Pan';
        childElement.setAttribute('role', this.chart.zoomSettings.accessibility.accessibilityRole ? this.chart.zoomSettings.accessibility.accessibilityRole : 'button');
        childElement.setAttribute('tabindex', this.chart.zoomSettings.accessibility.focusable ? String(this.chart.zoomSettings.accessibility.tabIndex) : '-1');
        childElement.setAttribute('aria-label', this.chart.zoomSettings.accessibility.accessibilityDescription ? this.chart.zoomSettings.accessibility.accessibilityDescription : this.chart.getLocalizedLabel('Pan'));
        this.panElements = childElement;
        childElement.appendChild(render.drawRectangle(
            new RectOption(this.elementId + '_Zooming_Pan_1', 'transparent', {}, 1, this.chart.themeStyle.toolkitIconRect, this.chart.theme.indexOf('Fluent2') > -1 || this.chart.theme.indexOf('Bootstrap5') > -1 ? 4 : 0, this.chart.theme.indexOf('Fluent2') > -1 || this.chart.theme.indexOf('Bootstrap5') > -1 ? 4 : 0)
        ) as HTMLElement);
        childElement.appendChild(render.drawPath(
            new PathOption(
                this.elementId + '_Zooming_Pan_2', this.chart.theme === 'Fluent2HighContrast' && this.elementOpacity === '0.2' ? '#3FF23F' : fillColor, null, null, 1, null,
                direction)) as HTMLElement);
        parentElement.appendChild(childElement);
        this.wireEvents(childElement, this.pan);
    }
    /**
     * Creates a zoom button.
     *
     * @param {Element} childElement - The child element to create.
     * @param {Element} parentElement - The parent element to append the child element.
     * @returns {void}
     */
    public createZoomButton(childElement: Element, parentElement: Element): void {
        const render: SvgRenderer | CanvasRenderer = this.chart.svgRenderer;
        //This is for selecting initial fill color to ZOOM button
        const fillColor: string = this.chart.zoomModule.isPanning || (!this.chart.zoomModule.isZoomed &&
             this.chart.zoomSettings.showToolbar) ? this.chart.themeStyle.toolkitFill : this.chart.themeStyle.toolkitSelectionColor;
        this.elementOpacity = !this.chart.zoomModule.isPanning && !this.chart.zoomModule.isZoomed && this.chart.zoomSettings.showToolbar ? '0.2' : '1';
        const rectColor: string = this.chart.zoomModule.isPanning ? 'transparent' : this.chart.themeStyle.toolkitIconRectSelectionFill;
        let direction: string = 'M0.001,14.629L1.372,16l4.571-4.571v-0.685l0.228-0.274c1.051,0.868,2.423,1.417,3.885,1.417c3.291,0,';
        direction += '5.943-2.651,5.943-5.943S13.395,0,10.103,0S4.16,2.651,4.16,5.943c0,1.508,0.503,2.834,1.417,3.885l-0.274,0.228H4.571';
        direction = direction + 'L0.001,14.629L0.001,14.629z M5.943,5.943c0-2.285,1.828-4.114,4.114-4.114s4.114,1.828,4.114,';
        childElement.id = this.elementId + '_Zooming_Zoom';
        childElement.setAttribute('role', this.chart.zoomSettings.accessibility.accessibilityRole ? this.chart.zoomSettings.accessibility.accessibilityRole : 'button');
        childElement.setAttribute('tabindex', this.chart.zoomSettings.accessibility.focusable ? String(this.chart.zoomSettings.accessibility.tabIndex) : '-1');
        childElement.setAttribute('aria-label', this.chart.zoomSettings.accessibility.accessibilityDescription ? this.chart.zoomSettings.accessibility.accessibilityDescription : this.chart.getLocalizedLabel('Zoom'));
        childElement.setAttribute('opacity', this.elementOpacity);
        this.zoomElements = childElement;
        this.selectedID = this.chart.zoomModule.isPanning ? this.chart.element.id + '_Zooming_Pan_1' : this.elementId + '_Zooming_Zoom_1';
        childElement.appendChild(render.drawRectangle(
            new RectOption(this.elementId + '_Zooming_Zoom_1', rectColor, {}, 1, this.chart.themeStyle.toolkitIconRect, this.chart.theme.indexOf('Fluent2') > -1 || this.chart.theme.indexOf('Bootstrap5') > -1 ? 4 : 0, this.chart.theme.indexOf('Fluent2') > -1 || this.chart.theme.indexOf('Bootstrap5') > -1 ? 4 : 0)
        ) as HTMLElement);
        childElement.appendChild(render.drawPath(new PathOption(
            this.elementId + '_Zooming_Zoom_3', fillColor, null, null, 1, null,
            direction + '4.114s-1.828,4.114-4.114,4.114S5.943,8.229,5.943,5.943z')
        ) as HTMLElement);
        parentElement.appendChild(childElement);
        this.wireEvents(childElement, this.zoom);
    }
    /**
     * Creates a zoom in button.
     *
     * @param {Element} childElement - The child element to create.
     * @param {Element} parentElement - The parent element to append the child element.
     * @param {Chart} chart - The chart instance.
     * @returns {void}
     */
    public createZoomInButton(childElement: Element, parentElement: Element, chart: Chart): void {
        const render: SvgRenderer | CanvasRenderer = this.chart.svgRenderer;
        const fillColor: string = this.chart.themeStyle.toolkitFill;
        let direction: string = 'M10.103,0C6.812,0,4.16,2.651,4.16,5.943c0,1.509,0.503,2.834,1.417,3.885l-0.274,0.229H4.571L0,';
        direction += '14.628l0,0L1.372,16l4.571-4.572v-0.685l0.228-0.275c1.052,0.868,2.423,1.417,3.885,1.417c3.291,0,5.943-2.651,';
        direction += '5.943-5.943C16,2.651,13.395,0,10.103,0z M10.058,10.058c-2.286,0-4.114-1.828-4.114-4.114c0-2.286,1.828-4.114,';
        childElement.id = this.elementId + '_Zooming_ZoomIn';
        childElement.setAttribute('role', this.chart.zoomSettings.accessibility.accessibilityRole ? this.chart.zoomSettings.accessibility.accessibilityRole : 'button');
        childElement.setAttribute('tabindex', this.chart.zoomSettings.accessibility.focusable ? String(this.chart.zoomSettings.accessibility.tabIndex) : '-1');
        childElement.setAttribute('aria-label', this.chart.zoomSettings.accessibility.accessibilityDescription ? this.chart.zoomSettings.accessibility.accessibilityDescription : this.chart.getLocalizedLabel('ZoomIn'));
        const polygonDirection: string = '12.749,5.466 10.749,5.466 10.749,3.466 9.749,3.466 9.749,5.466 7.749,5.466 7.749,6.466';
        childElement.appendChild(render.drawRectangle(
            new RectOption(this.elementId + '_Zooming_ZoomIn_1', 'transparent', {}, 1, this.chart.themeStyle.toolkitIconRect, this.chart.theme.indexOf('Fluent2') > -1 ? 4 : this.chart.theme.indexOf('Bootstrap5') > -1 ? 2 : 0, this.chart.theme.indexOf('Fluent2') > -1 ? 4 : this.chart.theme.indexOf('Bootstrap5') > -1 ? 2 : 0)
        ) as HTMLElement);
        childElement.appendChild(render.drawPath(
            new PathOption(
                this.elementId + '_Zooming_ZoomIn_2', fillColor, null, null, 1, null,
                direction + '4.114-4.114c2.286,0,4.114,1.828,4.114,4.114C14.172,8.229,12.344,10.058,10.058,10.058z')) as HTMLElement);
        childElement.appendChild(render.drawPolygon(
            new PolygonOption(
                this.elementId + '_Zooming_ZoomIn_3',
                polygonDirection + ' 9.749,6.466 9.749,8.466 10.749,8.466 10.749,6.466 12.749,6.466', fillColor)
        ) as HTMLElement);
        this.zoomInElements = childElement;
        //This is for low opacity to ZOOM IN button
        this.elementOpacity = chart.zoomModule.isPanning || (!chart.zoomModule.isZoomed && !chart.zoomSettings.showToolbar && !this.enableZoomButton) ? '0.2' : '1';
        childElement.setAttribute('opacity', this.elementOpacity);
        parentElement.appendChild(childElement);
        this.wireEvents(childElement, this.zoomIn);
    }
    /**
     * Creates a zoom out button.
     *
     * @param {Element} childElement - The child element to create.
     * @param {Element} parentElement - The parent element to append the child element.
     * @param {Chart} chart - The chart instance.
     * @returns {void}
     */
    public createZoomOutButton(childElement: Element, parentElement: Element, chart: Chart): void {
        const render: SvgRenderer | CanvasRenderer = this.chart.svgRenderer;
        const fillColor: string = this.chart.themeStyle.toolkitFill;
        let direction: string = 'M0,14.622L1.378,16l4.533-4.533v-0.711l0.266-0.266c1.022,0.889,2.4,1.422,3.866,';
        direction += '1.422c3.289,0,5.955-2.666,5.955-5.955S13.333,0,10.044,0S4.089,2.667,4.134,5.911c0,1.466,0.533,2.844,';
        direction += '1.422,3.866l-0.266,0.266H4.578L0,14.622L0,14.622z M5.911,5.911c0-2.311,1.822-4.133,4.133-4.133s4.133,1.822,4.133,';
        childElement.id = this.elementId + '_Zooming_ZoomOut';
        childElement.setAttribute('role', this.chart.zoomSettings.accessibility.accessibilityRole ? this.chart.zoomSettings.accessibility.accessibilityRole : 'button');
        childElement.setAttribute('tabindex', this.chart.zoomSettings.accessibility.focusable ? String(this.chart.zoomSettings.accessibility.tabIndex) : '-1');
        childElement.setAttribute('aria-label', this.chart.zoomSettings.accessibility.accessibilityDescription ? this.chart.zoomSettings.accessibility.accessibilityDescription : this.chart.getLocalizedLabel('ZoomOut'));
        childElement.appendChild(render.drawRectangle(
            new RectOption(this.elementId + '_Zooming_ZoomOut_1', 'transparent', {}, 1, this.chart.themeStyle.toolkitIconRect, this.chart.theme.indexOf('Fluent2') > -1 || this.chart.theme.indexOf('Bootstrap5') > -1 ? 4 : 0, this.chart.theme.indexOf('Fluent2') > -1 || this.chart.theme.indexOf('Bootstrap5') > -1 ? 4 : 0)
        ) as HTMLElement);
        childElement.appendChild(render.drawPath(
            new PathOption(
                this.elementId + '_Zooming_ZoomOut_2', (chart.theme === 'Fluent2HighContrast' && !chart.zoomModule.isZoomed) || (chart.theme === 'Fluent2HighContrast' && chart.zoomModule.isPanning) ? '#3FF23F' : fillColor, null, null, 1, null,
                direction + '4.133s-1.866,4.133-4.133,4.133S5.911,8.222,5.911,5.911z M12.567,6.466h-5v-1h5V6.466z')) as HTMLElement);
        this.zoomOutElements = childElement;
        //This is for low opacity of ZOOM OUT button
        this.elementOpacity = chart.zoomModule.isPanning || (!chart.zoomModule.isZoomed && chart.zoomSettings.showToolbar && !this.enableZoomButton) ? '0.2' : '1';
        childElement.setAttribute('opacity', chart.theme === 'Fluent2HighContrast' ? '1' : this.elementOpacity);
        parentElement.appendChild(childElement);
        this.wireEvents(childElement, this.zoomOut);
    }
    /**
     * Creates a reset button.
     *
     * @param {Element} childElement - The child element to create.
     * @param {Element} parentElement - The parent element to append the child element.
     * @param {Chart} chart - The chart instance.
     * @param {boolean} isDevice - Specifies whether the device is mobile or not.
     * @returns {void}
     */
    public createResetButton(childElement: Element, parentElement: Element, chart: Chart, isDevice: boolean): void {
        const render: SvgRenderer | CanvasRenderer = this.chart.svgRenderer;
        const fillColor: string = this.chart.themeStyle.toolkitFill;
        let size: Size;
        let direction: string = 'M12.364,8h-2.182l2.909,3.25L16,8h-2.182c0-3.575-2.618-6.5-5.818-6.5c-1.128,0-2.218,0.366-3.091,';
        direction += '1.016l1.055,1.178C6.581,3.328,7.272,3.125,8,3.125C10.4,3.125,12.363,5.319,12.364,8L12.364,8z M11.091,';
        direction += '13.484l-1.055-1.178C9.419,12.672,8.728,12.875,8,12.875c-2.4,0-4.364-2.194-4.364-4.875h2.182L2.909,4.75L0,8h2.182c0,';
        childElement.id = this.elementId + '_Zooming_Reset';
        childElement.setAttribute('role', this.chart.zoomSettings.accessibility.accessibilityRole ? this.chart.zoomSettings.accessibility.accessibilityRole : 'button');
        childElement.setAttribute('tabindex', this.chart.zoomSettings.accessibility.focusable ? String(this.chart.zoomSettings.accessibility.tabIndex) : '-1');
        childElement.setAttribute('aria-label', this.chart.zoomSettings.accessibility.accessibilityDescription ? this.chart.zoomSettings.accessibility.accessibilityDescription : this.chart.getLocalizedLabel('Reset'));
        //This is for low opacity to RESET button
        this.elementOpacity = !chart.zoomModule.isZoomed && chart.zoomSettings.showToolbar ? '0.2' : '1';
        childElement.setAttribute('opacity', chart.theme === 'Fluent2HighContrast' ? '1' : this.elementOpacity);
        if (!isDevice) {
            childElement.appendChild(render.drawRectangle(
                new RectOption(this.elementId + '_Zooming_Reset_1', 'transparent', {}, 1, this.chart.themeStyle.toolkitIconRect, this.chart.theme.indexOf('Fluent2') > -1 || this.chart.theme.indexOf('Bootstrap5') > -1 ? 4 : 0, this.chart.theme.indexOf('Fluent2') > -1 || this.chart.theme.indexOf('Bootstrap5') > -1 ? 4 : 0)
            ) as HTMLElement);
            childElement.appendChild(render.drawPath(
                new PathOption(
                    this.elementId + '_Zooming_Reset_2', chart.theme === 'Fluent2HighContrast' && this.elementOpacity === '0.2' ? '#3FF23F' : fillColor, null, null, 1, null,
                    direction + '3.575,2.618,6.5,5.818,6.5C9.128,14.5,10.219,14.134,11.091,13.484L11.091,13.484z')) as HTMLElement);
        } else {
            size = measureText(this.chart.getLocalizedLabel('ResetZoom'), { size: '12px' }, { size: '12px', fontStyle: 'Normal', fontWeight: '400', fontFamily: 'Segoe UI'});
            childElement.appendChild(render.drawRectangle(
                new RectOption(this.elementId + '_Zooming_Reset_1', 'transparent', {}, 1, new Rect(0, 0, size.width, size.height))
            ) as HTMLElement);
            textElement(
                chart.renderer,
                new TextOption(
                    this.elementId + '_Zooming_Reset_2',
                    0 + size.width / 2, 0 + size.height * 3 / 4,
                    'middle', this.chart.getLocalizedLabel('ResetZoom'), 'rotate(0,' + (0) + ',' + (0) + ')', 'auto'
                ),
                { size: '12px' }, this.chart.theme === 'Material3Dark' || this.chart.theme === 'Fluent2Dark' || this.chart.theme === 'Fluent2HighContrast' ? 'White' : 'black', childElement, null, null, null, null, null, null, null, null, chart.enableCanvas, null, { size: '12px', fontStyle: 'Normal', fontWeight: '400', fontFamily: 'Segoe UI'}
            );
        }

        parentElement.appendChild(childElement);
        this.wireEvents(childElement, this.reset);
    }
    /**
     * Wires events to the specified element.
     *
     * @param {Element} element - The element to wire the events to.
     * @param {Function} process - The function to be executed when the event occurs.
     * @returns {void}
     */
    public wireEvents(element: Element, process: Function): void {
        EventHandler.add(element, 'mousedown touchstart', process, this);
        EventHandler.add(element, 'mouseover', this.showTooltip, this);
        EventHandler.add(element, 'mouseout', this.removeTooltip, this);
        EventHandler.add(this.chart.element, 'mousemove', this.mouseMoveHandler, this);
        EventHandler.add(this.chart.zoomModule.toolkitElements, 'mousedown', this.mouseDownHandler, this);
        window.addEventListener('mouseup', this.mouseUpHandler.bind(this), true);
    }
    /**
     * Handles the mouse move event on the chart.
     *
     * @param {PointerEvent | TouchEvent} e - The mouse move event or touch event.
     * @returns {void}
     * @private
     */
    private mouseMoveHandler(e: PointerEvent | TouchEvent): void {
        if (this.chart.zoomSettings.toolbarPosition.draggable) {
            if (this.isDragging) {
                this.performDragAndDrop(e);
            } else {
                (this.chart.zoomModule.toolkitElements as HTMLElement).setAttribute('cursor', (e.target as HTMLElement).id.indexOf('Zooming_Rect') > -1 ? 'grab' : 'none');
            }
        }
    }
    /**
     * Handles the mouse down event on the toolkit.
     *
     * @param {PointerEvent} e - The mouse down event.
     * @returns {void}
     * @private
     */
    private mouseDownHandler(e: PointerEvent): void {
        if (this.chart.zoomSettings.toolbarPosition.draggable && !this.isDragging && (e.target as HTMLElement).
            id.indexOf('Zooming_Rect') > -1) {
            this.isDragging = true;
            (this.chart.zoomModule.toolkitElements as HTMLElement).setAttribute('cursor', 'grabbing');
        }
    }
    /**
     * Handles the mouse up event on the window.
     *
     * @param {PointerEvent} e - The mouse up event.
     * @returns {void}
     * @private
     */
    private mouseUpHandler(e: PointerEvent): void {
        if (this.isDragging) {
            this.isDragging = false;
            (this.chart.zoomModule.toolkitElements as HTMLElement).setAttribute('cursor', (e.target as HTMLElement).id.indexOf('Zooming_Rect') > -1 ? 'grab' : 'none');
        }
    }
    /**
     * Handles the drag-and-drop functionality for the toolkit.
     *
     * @param {PointerEvent | TouchEvent} e - The event triggered by the pointer or touch action.
     * @returns {void}
     * @private
     */
    private performDragAndDrop(e: PointerEvent | TouchEvent): void {
        const elementWidth: number = this.chart.zoomModule.toolkitElements.getBoundingClientRect().width;
        const elementHeight: number = this.chart.zoomModule.toolkitElements.getBoundingClientRect().height;
        // Padding to apply when the toolkit is positioned at the chart area border
        const toolkitShadowPadding: number = 2;
        const x: number = e.type.indexOf('touch') > -1 ? (e as TouchEvent & PointerEvent).changedTouches[0].clientX : this.chart.mouseX;
        const y: number = e.type.indexOf('touch') > -1 ? (e as TouchEvent & PointerEvent).changedTouches[0].clientY : this.chart.mouseY;
        const transX: number = Math.max(this.chart.border.width + toolkitShadowPadding, Math.min(x - elementWidth / 2
            , this.chart.availableSize.width - elementWidth - this.chart.border.width - toolkitShadowPadding));
        const transY: number = Math.max(this.chart.border.width + toolkitShadowPadding, Math.min(y - elementHeight / 2
            , this.chart.availableSize.height - elementHeight - this.chart.border.width - toolkitShadowPadding));
        if (x < this.chart.availableSize.width && y < this.chart.availableSize.height) {
            (this.chart.zoomModule.toolkitElements as HTMLElement).setAttribute('transform', 'translate(' + transX + ',' + transY + ')');
            this.dragHorizontalRatio = transX / this.chart.availableSize.width;
            this.dragVerticalRatio = transY / this.chart.availableSize.height;
        }
    }
    /**
     * Displays the tooltip on mouse event.
     *
     * @param {MouseEvent} event - The mouse event.
     * @returns {void}
     */
    private showTooltip(event: MouseEvent): void {
        const text: string = (<HTMLElement>event.currentTarget).id.split('_Zooming_')[1];
        const left: number = (event.pageX - (measureText(text, { size: '10px' }, { size: '10px', fontStyle: 'Normal', fontWeight: '400', fontFamily: 'Segoe UI'}).width + 5));
        const rect: Element = getElement((<HTMLElement>event.currentTarget).id + '_1');
        const icon2: Element = getElement((<HTMLElement>event.currentTarget).id + '_2');
        const icon3: Element = getElement((<HTMLElement>event.currentTarget).id + '_3');
        if ((<HTMLElement>event.currentTarget).getAttribute('opacity') === '1') {
            (<HTMLElement>event.currentTarget).setAttribute('cursor', 'pointer');
        }
        else {
            (<HTMLElement>event.currentTarget).setAttribute('cursor', 'auto');
        }
        if (rect) {
            this.hoveredID = rect.id;
            rect.setAttribute('fill', this.chart.theme === 'Fluent2HighContrast' && ((<HTMLElement>event.currentTarget).childNodes[1] as HTMLElement).getAttribute('fill') === '#3FF23F' ? 'transparent' : this.chart.themeStyle.toolkitIconRectOverFill);
        }
        if (icon2) {
            icon2.setAttribute('fill', this.chart.theme === 'Fluent2HighContrast' && ((<HTMLElement>event.currentTarget).childNodes[1] as HTMLElement).getAttribute('fill') === '#3FF23F' ? '#3FF23F' : this.chart.themeStyle.toolkitSelectionColor);
        }
        if (icon3) {
            icon3.setAttribute('fill', this.chart.theme === 'Fluent2HighContrast' && ((<HTMLElement>event.currentTarget).childNodes[1] as HTMLElement).getAttribute('fill') === '#3FF23F' ? '#3FF23F' : this.chart.themeStyle.toolkitSelectionColor);
        }
        if (!this.chart.isTouch && !this.isDragging) {
            createTooltip('EJ2_Chart_ZoomTip', this.chart.getLocalizedLabel(text), (event.pageY + 10), left, '10px');
        }
    }
    /**
     * Removes the tooltip.
     *
     * @returns {void}
     */
    public removeTooltip(): void {
        if (this.hoveredID && getElement(this.hoveredID)) {
            const rectColor: string = this.chart.zoomModule.isPanning ? (this.hoveredID.indexOf('_Pan_') > -1) ? this.chart.themeStyle.toolkitIconRectSelectionFill : 'transparent' : (this.hoveredID.indexOf('_Zoom_') > -1) && (this.elementOpacity !== '0.2' && this.chart.theme !== 'Fluent2HighContrast') ? this.chart.themeStyle.toolkitIconRectSelectionFill : 'transparent';
            getElement(this.hoveredID).setAttribute('fill', rectColor);
        }
        const icon2: Element = this.hoveredID ? getElement(this.hoveredID.replace('_1', '_2')) : null;
        const icon3: Element = this.hoveredID ? getElement(this.hoveredID.replace('_1', '_3')) : null;
        if (icon2) {
            const iconColor: string = this.chart.zoomModule.isPanning ? (this.hoveredID.indexOf('_Pan_') > -1) ? this.chart.themeStyle.toolkitSelectionColor : this.elementOpacity === '0.2' && this.chart.theme === 'Fluent2HighContrast' && getElement(this.hoveredID).nextElementSibling.getAttribute('fill') === '#3FF23F' ? '#3FF23F' : this.elementOpacity === '1' && this.chart.theme === 'Tailwind3' ? '#212529' : this.chart.themeStyle.toolkitFill : (this.hoveredID.indexOf('_Zoom_') > -1) ? this.chart.themeStyle.toolkitSelectionColor : this.chart.theme === 'Fluent2HighContrast' && getElement(this.hoveredID).nextElementSibling.getAttribute('fill') === '#3FF23F' ? '#3FF23F' : (this.chart.theme === 'Tailwind3Dark' && this.chart.zoomModule.isDevice) ? 'black' : this.chart.themeStyle.toolkitFill;
            icon2.setAttribute('fill', iconColor);
        }
        if (icon3) {
            //This is used for change color while hover on ZOOM button
            const iconColor: string = this.chart.zoomModule.isPanning || (!this.chart.isZoomed && this.chart.zoomSettings.showToolbar) ? this.chart.theme === 'Fluent2HighContrast' && getElement(this.hoveredID).nextElementSibling.getAttribute('fill') === '#3FF23F' && this.elementOpacity === '1' ? '#3FF23F' : this.elementOpacity === '1' && this.chart.theme === 'Tailwind3' ? '#212529' : this.chart.themeStyle.toolkitFill : (this.hoveredID.indexOf('_Zoom_') > -1) ? this.chart.themeStyle.toolkitSelectionColor : this.chart.theme === 'Fluent2HighContrast' && getElement(this.hoveredID).nextElementSibling.getAttribute('fill') === '#3FF23F' ? '#3FF23F' : this.chart.themeStyle.toolkitFill;
            icon3.setAttribute('fill', iconColor);
        }
        removeElement('EJ2_Chart_ZoomTip');
    }

    // Toolkit events function calculation here.
    /**
     * Resets the chart.
     *
     * @param {PointerEvent | TouchEvent | KeyboardEvent} event - The event object.
     * @returns {boolean} - Returns false.
     */
    public reset(event: PointerEvent | TouchEvent | KeyboardEvent): boolean {
        if (!this.chart.zoomModule.isZoomed) {
            return false;
        }
        const chart: Chart = this.chart;
        this.enableZoomButton = false;
        chart.redraw = chart.enableCanvas ? chart.redraw : chart.zoomSettings.enableAnimation;
        if (!chart.zoomModule.isDevice) {
            remove(chart.zoomModule.toolkitElements);
        } else if (event.type === 'touchstart') {
            event.stopPropagation();
        }
        let argsData: IZoomCompleteEventArgs;
        this.removeTooltip();
        chart.svgObject.setAttribute('cursor', 'auto');
        const zoomedAxisCollection: IAxisData[] = [];
        this.zoomCompleteEvtCollection = [];
        for (const axis of (chart.axisCollections as Axis[])) {
            argsData = {
                cancel: false, name: zoomComplete, axis: axis, previousZoomFactor: axis.zoomFactor,
                previousZoomPosition: axis.zoomPosition, currentZoomFactor: 1, currentZoomPosition: 0,
                previousVisibleRange: axis.visibleRange, currentVisibleRange: null
            };
            axis.zoomFactor = 1;
            axis.zoomPosition = 0;
            if (axis.zoomingScrollBar) {
                axis.zoomingScrollBar.isScrollUI = false;
            }
            if (!argsData.cancel) {
                axis.zoomFactor = argsData.currentZoomFactor;
                axis.zoomPosition = argsData.currentZoomPosition;
                this.zoomCompleteEvtCollection.push(argsData);
            }
            zoomedAxisCollection.push({
                zoomFactor: axis.zoomFactor, zoomPosition: axis.zoomFactor, axisName: axis.name,
                axisRange: axis.visibleRange
            });
            if (chart.zoomModule.isDevice && !this.chart.isBlazor) {
                chart.trigger(zoomComplete, argsData);
            }
        }
        const zoomingEventArgs: IZoomingEventArgs = { cancel: false, axisCollection: zoomedAxisCollection, name: onZooming };
        if (!zoomingEventArgs.cancel && this.chart.isBlazor) {
            this.chart.trigger(onZooming, zoomingEventArgs, () => {
                this.setDefferedZoom(chart);
            });
            return false;
        } else {
            return (this.setDefferedZoom(chart));
        }
    }

    private setDefferedZoom(chart: Chart): boolean  {
        chart.disableTrackTooltip = false;
        const chartDuration: number = chart.duration;
        chart.duration = 600;
        chart.zoomModule.isZoomed = chart.zoomModule.isPanning = chart.isChartDrag = chart.delayRedraw = false;
        chart.zoomModule.touchMoveList = chart.zoomModule.touchStartList = [];
        chart.zoomModule.pinchTarget = null;
        chart.zoomRedraw = chart.zoomSettings.enableAnimation;
        if (chart.redraw) {
            const zoomToolBar: Element = getElement(chart.element.id + '_Zooming_KitCollection');
            if (zoomToolBar) {
                zoomToolBar.remove();
            }
            if (chart.tooltipModule) {
                if (getElement(chart.element.id + '_tooltip')) {
                    getElement(chart.element.id + '_tooltip').remove();
                }
                for (const series of chart.visibleSeries) {
                    if (!isNullOrUndefined(series) && (series.marker.visible || chart.tooltip.shared || series.type === 'Scatter' || series.type === 'Bubble')) {
                        chart.markerRender.removeHighlightedMarker(series, null, true);
                    }
                }
            }
        }
        else {
            chart.removeSvg();
        }
        chart.refreshAxis();
        chart.refreshBound();
        this.elementOpacity = '1';
        chart.duration = chartDuration;
        chart.redraw = false;
        return false;
    }

    private zoomIn(): boolean {
        this.zoomInOutCalculation(1, this.chart, this.chart.axisCollections, this.chart.zoomSettings.mode);
        return false;
    }

    private zoomOut(): boolean {
        this.enableZoomButton = false;
        this.zoomInOutCalculation(-1, this.chart, this.chart.axisCollections, this.chart.zoomSettings.mode);
        return false;
    }

    private zoom(): boolean {
        this.chart.zoomModule.isPanning = false;
        // const zoomModule: Zoom = this.chart.zoomModule;
        this.elementOpacity = '1';
        this.chart.svgObject.setAttribute('cursor', 'auto');
        if (this.zoomInElements) {
            this.zoomInElements.setAttribute('opacity', this.elementOpacity);
        }
        this.elementOpacity = (!this.chart.zoomModule.isZoomed && this.chart.zoomSettings.showToolbar) ? '0.2' : '1';
        if (this.zoomOutElements) {
            this.zoomOutElements.setAttribute('opacity', this.elementOpacity);
        }
        this.applySelection(this.zoomElements.childNodes, this.chart.themeStyle.toolkitSelectionColor);
        if (this.chart.theme === 'Fluent2HighContrast') {
            if (this.zoomInElements) {
                this.applySelection(this.zoomInElements.childNodes, this.chart.themeStyle.toolkitFill);
            }
            if (this.zoomOutElements) {
                this.applySelection(this.zoomOutElements.childNodes, this.chart.themeStyle.toolkitFill);
            }
        }
        if (this.panElements) {
            this.applySelection(this.panElements.childNodes, this.chart.theme === 'Tailwind3Dark' ? '#FFFFFF' : '#737373');
        }
        if (getElement(this.selectedID)) {
            getElement(this.selectedID).setAttribute('fill', 'transparent');
        }
        this.selectedID = this.chart.element.id + '_Zooming_Zoom_1';
        getElement(this.selectedID).setAttribute('fill', this.chart.themeStyle.toolkitIconRectSelectionFill);
        return false;
    }
    /**
     * Enables panning for the chart.
     *
     * @returns {boolean} - Returns false.
     */
    public pan(): boolean {
        if (!this.chart.zoomModule.isZoomed) {
            return false;
        }
        let element: void;
        this.chart.zoomModule.isPanning = true;
        this.chart.svgObject.setAttribute('cursor', 'pointer');
        this.elementOpacity = '0.2';
        element = this.zoomInElements ? this.zoomInElements.setAttribute('opacity', this.elementOpacity) : null;
        element = this.zoomOutElements ? this.zoomOutElements.setAttribute('opacity', this.elementOpacity) : null;
        if (this.chart.theme === 'Fluent2HighContrast') {
            const zoomOut: Element = getElement(this.chart.element.id + '_Zooming_ZoomOut');
            if (zoomOut) { zoomOut.setAttribute('opacity', '1'); }
            const zoomIn: Element = getElement(this.chart.element.id + '_Zooming_ZoomIn');
            if (zoomIn) { zoomIn.setAttribute('opacity', '1'); }
            const zoomOut2: Element = getElement(this.chart.element.id + '_Zooming_ZoomOut_2');
            if (zoomOut2) { zoomOut2.setAttribute('fill', '#3FF23F'); }
            const zoomIn2: Element = getElement(this.chart.element.id + '_Zooming_ZoomIn_2');
            if (zoomIn2) { (zoomIn2.setAttribute('fill', '#3FF23F')); }
            const zoomIn3: Element = getElement(this.chart.element.id + '_Zooming_ZoomIn_3');
            if (zoomIn3) { zoomIn3.setAttribute('fill', '#3FF23F'); }
        }
        element = this.panElements ? this.applySelection(this.panElements.childNodes, this.chart.themeStyle.toolkitSelectionColor) : null;
        element = this.zoomElements ? this.applySelection(this.zoomElements.childNodes, this.chart.theme === 'Tailwind3Dark' ? '#FFFFFF' : '#737373') : null;
        if (getElement(this.selectedID)) {
            getElement(this.selectedID).setAttribute('fill', 'transparent');
        }

        this.selectedID = this.chart.element.id + '_Zooming_Pan_1';
        getElement(this.selectedID).setAttribute('fill', this.chart.themeStyle.toolkitIconRectSelectionFill);
        return false;
    }

    public zoomInOutCalculation(scale: number, chart: Chart, axes: AxisModel[], mode: ZoomMode): void {
        this.isZoomed = true;
        if (chart.zoomSettings.showToolbar) {
            this.elementOpacity = this.zoomInElements.getAttribute('opacity');
        }
        if (!chart.zoomModule.isPanning && this.elementOpacity !== '0.2') {
            if ((chart.zoomSettings.showToolbar && !chart.isZoomed)) {
                chart.zoomModule.isZoomed = true;
            }
            let zoomFactor: number;
            let zoomPosition: number;
            let cumulative: number;
            chart.disableTrackTooltip = true;
            chart.delayRedraw = true;
            let argsData: IZoomCompleteEventArgs;
            this.zoomCompleteEvtCollection = [];
            const zoomedAxisCollection: IAxisData[] = [];
            for (const axis of (axes as Axis[])) {
                argsData = {
                    cancel: false, name: zoomComplete, axis: axis, previousZoomFactor: axis.zoomFactor,
                    previousZoomPosition: axis.zoomPosition, currentZoomFactor: axis.zoomFactor, currentZoomPosition: axis.zoomPosition,
                    previousVisibleRange: axis.visibleRange, currentVisibleRange: null
                };
                if ((axis.orientation === 'Horizontal' && mode !== 'Y') ||
                    (axis.orientation === 'Vertical' && mode !== 'X')) {
                    cumulative = Math.max(Math.max(1 / minMax(axis.zoomFactor, 0, 1), 1) + (0.25 * scale), 1);
                    zoomFactor = (cumulative === 1) ? 1 : minMax(1 / cumulative, 0, 1);
                    zoomPosition = (cumulative === 1) ? 0 : axis.zoomPosition + ((axis.zoomFactor - zoomFactor) * 0.5);
                    if (axis.zoomPosition !== zoomPosition || axis.zoomFactor !== zoomFactor) {
                        zoomFactor = (zoomPosition + zoomFactor) > 1 ? (1 - zoomPosition) : zoomFactor;
                    }
                    argsData.currentZoomFactor = zoomFactor;
                    argsData.currentZoomPosition = zoomPosition;
                    if (!argsData.cancel) {
                        axis.zoomFactor = argsData.currentZoomFactor;
                        axis.zoomPosition = argsData.currentZoomPosition;
                        this.zoomCompleteEvtCollection.push(argsData);
                    }
                    zoomedAxisCollection.push({
                        zoomFactor: axis.zoomFactor, zoomPosition: axis.zoomFactor, axisName: axis.name,
                        axisRange: axis.visibleRange
                    });
                }
            }
            const zoomingEventArgs: IZoomingEventArgs = { cancel: false, axisCollection: zoomedAxisCollection, name: onZooming };
            this.chart.trigger(onZooming, zoomingEventArgs, () => {
                if (zoomingEventArgs.cancel) {
                    const zoom: Zoom = new Zoom(chart);
                    zoom.zoomCancel(axes, this.zoomCompleteEvtCollection);
                }
            });
        }
    }

    private applySelection(elements: NodeList, color: string): void {
        for (let i: number = 1, length: number = elements.length; i < length; i++) {
            (elements[i as number] as HTMLElement).setAttribute('fill', color);
        }
    }
}
