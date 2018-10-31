import { SvgRenderer, EventHandler } from '@syncfusion/ej2-base';
import { remove } from '@syncfusion/ej2-base';
import { Chart } from '../chart';
import { Axis } from '../axis/axis';
import { AxisModel } from '../axis/axis-model';
import { ZoomMode } from '../utils/enum';
import { removeElement, measureText, RectOption, Rect, PolygonOption, PathOption, createTooltip, minMax } from '../../common/utils/helper';
import { Size, textElement, TextOption } from '../../common/utils/helper';
import { Zoom } from './zooming';

/**
 * Zooming Toolkit created here
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


    /** @private */
    constructor(chart: Chart) {
        this.chart = chart;
        this.elementId = chart.element.id;
        this.selectionColor = '#ff4081';
        this.fillColor = '#737373';
    }
    /**
     * To create the pan button.
     * @return {void}
     * @private
     */
    public createPanButton(childElement: Element, parentElement: Element, chart: Chart): void {
        let render: SvgRenderer = this.chart.renderer;
        let fillColor: string = this.chart.zoomModule.isPanning ? this.selectionColor : this.fillColor;
        let direction: string = 'M5,3h2.3L7.275,5.875h1.4L8.65,3H11L8,0L5,3z M3,11V8.7l2.875,0.025v-1.4L3,7.35V5L0,8L3,';
        direction += '11z M11,13H8.7l0.025-2.875h-1.4L7.35,13H5l3,3L11,13z M13,5v2.3l-2.875-0.025v1.4L13,8.65V11l3-3L13,5z';
        childElement.id = this.elementId + '_Zooming_Pan';
        childElement.setAttribute('aria-label', this.chart.getLocalizedLabel('Pan'));
        this.panElements = childElement;
        childElement.appendChild(render.drawRectangle(
            new RectOption(this.elementId + '_Zooming_Pan_1', 'transparent', {}, 1, new Rect(0, 0, 16, 16))
        ) as HTMLElement);
        childElement.appendChild(render.drawPath(new PathOption(
            this.elementId + '_Zooming_Pan_2', fillColor, null, null, 1, null,
            direction)
        ) as HTMLElement);
        parentElement.appendChild(childElement);
        this.wireEvents(childElement, this.pan);
    }
    /**
     * To create the zoom button.
     * @return {void}
     * @private
     */
    public createZoomButton(childElement: Element, parentElement: Element, chart: Chart): void {
        let render: SvgRenderer = this.chart.renderer;
        let fillColor: string = this.chart.zoomModule.isPanning ? this.fillColor : this.selectionColor;
        let direction: string = 'M0.001,14.629L1.372,16l4.571-4.571v-0.685l0.228-0.274c1.051,0.868,2.423,1.417,3.885,1.417c3.291,0,';
        direction += '5.943-2.651,5.943-5.943S13.395,0,10.103,0S4.16,2.651,4.16,5.943c0,1.508,0.503,2.834,1.417,3.885l-0.274,0.228H4.571';
        direction = direction + 'L0.001,14.629L0.001,14.629z M5.943,5.943c0-2.285,1.828-4.114,4.114-4.114s4.114,1.828,4.114,';
        childElement.id = this.elementId + '_Zooming_Zoom';
        childElement.setAttribute('aria-label', this.chart.getLocalizedLabel('Zoom'));
        this.zoomElements = childElement;
        childElement.appendChild(render.drawRectangle(
            new RectOption(this.elementId + '_Zooming_Zoom_1', 'transparent', {}, 1, new Rect(0, 0, 16, 16))
        ) as HTMLElement);
        childElement.appendChild(render.drawPath(new PathOption(
            this.elementId + '_Zooming_Zoom_3', fillColor, null, null, 1, null,
            direction + '4.114s-1.828,4.114-4.114,4.114S5.943,8.229,5.943,5.943z')
        ) as HTMLElement);
        parentElement.appendChild(childElement);
        this.wireEvents(childElement, this.zoom);
    }
    /**
     * To create the ZoomIn button.
     * @return {void}
     * @private
     */
    public createZoomInButton(childElement: Element, parentElement: Element, chart: Chart): void {
        let render: SvgRenderer = this.chart.renderer;
        let fillColor: string = this.fillColor;
        let direction: string = 'M10.103,0C6.812,0,4.16,2.651,4.16,5.943c0,1.509,0.503,2.834,1.417,3.885l-0.274,0.229H4.571L0,';
        direction += '14.628l0,0L1.372,16l4.571-4.572v-0.685l0.228-0.275c1.052,0.868,2.423,1.417,3.885,1.417c3.291,0,5.943-2.651,';
        direction += '5.943-5.943C16,2.651,13.395,0,10.103,0z M10.058,10.058c-2.286,0-4.114-1.828-4.114-4.114c0-2.286,1.828-4.114,';
        childElement.id = this.elementId + '_Zooming_ZoomIn';
        childElement.setAttribute('aria-label', this.chart.getLocalizedLabel('ZoomIn'));
        let polygonDirection: string = '12.749,5.466 10.749,5.466 10.749,3.466 9.749,3.466 9.749,5.466 7.749,5.466 7.749,6.466';
        childElement.appendChild(render.drawRectangle(
            new RectOption(this.elementId + '_Zooming_ZoomIn_1', 'transparent', {}, 1, new Rect(0, 0, 16, 16))
        ) as HTMLElement);
        childElement.appendChild(render.drawPath(new PathOption(
            this.elementId + '_Zooming_ZoomIn_2', fillColor, null, null, 1, null,
            direction + '4.114-4.114c2.286,0,4.114,1.828,4.114,4.114C14.172,8.229,12.344,10.058,10.058,10.058z')
        ) as HTMLElement);
        childElement.appendChild(render.drawPolygon(
            new PolygonOption(
                this.elementId + '_Zooming_ZoomIn_3',
                polygonDirection + ' 9.749,6.466 9.749,8.466 10.749,8.466 10.749,6.466 12.749,6.466', fillColor)
        ) as HTMLElement);
        this.zoomInElements = childElement;
        this.elementOpacity = chart.zoomModule.isPanning ? '0.2' : '1';
        childElement.setAttribute('opacity', this.elementOpacity);
        parentElement.appendChild(childElement);
        this.wireEvents(childElement, this.zoomIn);
    }
    /**
     * To create the ZoomOut button.
     * @return {void}
     * @private
     */
    public createZoomOutButton(childElement: Element, parentElement: Element, chart: Chart): void {
        let render: SvgRenderer = this.chart.renderer;
        let fillColor: string = this.fillColor;
        let direction: string = 'M0,14.622L1.378,16l4.533-4.533v-0.711l0.266-0.266c1.022,0.889,2.4,1.422,3.866,';
        direction += '1.422c3.289,0,5.955-2.666,5.955-5.955S13.333,0,10.044,0S4.089,2.667,4.134,5.911c0,1.466,0.533,2.844,';
        direction += '1.422,3.866l-0.266,0.266H4.578L0,14.622L0,14.622z M5.911,5.911c0-2.311,1.822-4.133,4.133-4.133s4.133,1.822,4.133,';
        childElement.id = this.elementId + '_Zooming_ZoomOut';
        childElement.setAttribute('aria-label', this.chart.getLocalizedLabel('ZoomOut'));
        childElement.appendChild(render.drawRectangle(
            new RectOption(this.elementId + '_Zooming_ZoomOut_1', 'transparent', {}, 1, new Rect(0, 0, 16, 16))
        ) as HTMLElement);
        childElement.appendChild(render.drawPath(new PathOption(
            this.elementId + '_Zooming_ZoomOut_2', fillColor, null, null, 1, null,
            direction + '4.133s-1.866,4.133-4.133,4.133S5.911,8.222,5.911,5.911z M12.567,6.466h-5v-1h5V6.466z')
        ) as HTMLElement);
        this.zoomOutElements = childElement;
        this.elementOpacity = chart.zoomModule.isPanning ? '0.2' : '1';
        childElement.setAttribute('opacity', this.elementOpacity);
        parentElement.appendChild(childElement);
        this.wireEvents(childElement, this.zoomOut);
    }
    /**
     * To create the Reset button.
     * @return {void}
     * @private
     */
    public createResetButton(childElement: Element, parentElement: Element, chart: Chart, isDevice: Boolean): void {
        let render: SvgRenderer = this.chart.renderer;
        let fillColor: string = this.fillColor;
        let size: Size;
        let direction: string = 'M12.364,8h-2.182l2.909,3.25L16,8h-2.182c0-3.575-2.618-6.5-5.818-6.5c-1.128,0-2.218,0.366-3.091,';
        direction += '1.016l1.055,1.178C6.581,3.328,7.272,3.125,8,3.125C10.4,3.125,12.363,5.319,12.364,8L12.364,8z M11.091,';
        direction += '13.484l-1.055-1.178C9.419,12.672,8.728,12.875,8,12.875c-2.4,0-4.364-2.194-4.364-4.875h2.182L2.909,4.75L0,8h2.182c0,';
        childElement.id = this.elementId + '_Zooming_Reset';
        childElement.setAttribute('aria-label', this.chart.getLocalizedLabel('Reset'));
        if (!isDevice) {
            childElement.appendChild(render.drawRectangle(
                new RectOption(this.elementId + '_Zooming_Reset_1', 'transparent', {}, 1, new Rect(0, 0, 16, 16))
            ) as HTMLElement);
            childElement.appendChild(render.drawPath(new PathOption(
                this.elementId + '_Zooming_Reset_2', fillColor, null, null, 1, null,
                direction + '3.575,2.618,6.5,5.818,6.5C9.128,14.5,10.219,14.134,11.091,13.484L11.091,13.484z')
            ) as HTMLElement);
        } else {
            size = measureText(this.chart.getLocalizedLabel('ResetZoom'), { size: '12px' });
            childElement.appendChild(render.drawRectangle(
                new RectOption(this.elementId + '_Zooming_Reset_1', 'transparent', {}, 1, new Rect(0, 0, size.width, size.height))
            ) as HTMLElement);
            textElement(
                new TextOption(
                    this.elementId + '_Zooming_Reset_2',
                    0 + size.width / 2, 0 + size.height * 3 / 4,
                    'middle', this.chart.getLocalizedLabel('ResetZoom'), 'rotate(0,' + (0) + ',' + (0) + ')', 'auto'
                ),
                { size: '12px' }, 'black', childElement);
        }

        parentElement.appendChild(childElement);
        this.wireEvents(childElement, this.reset);
    }
    /**
     * To bind events.
     * @return {void}
     * @private
     */
    public wireEvents(element: Element, process: Function): void {
        EventHandler.add(element, 'mousedown touchstart', process, this);
        EventHandler.add(element, 'mouseover', this.showTooltip, this);
        EventHandler.add(element, 'mouseout', this.removeTooltip, this);
    }
    /**
     * To show tooltip.
     * @return {void}
     * @private
     */
    private showTooltip(event: MouseEvent): void {
        let text: string = (<HTMLElement>event.currentTarget).id.split('_Zooming_')[1];
        let left: number = (event.pageX - (measureText(text, { size: '10px' }).width + 5));
        if (!this.chart.isTouch) {
            createTooltip('EJ2_Chart_ZoomTip', this.chart.getLocalizedLabel(text), (event.pageY + 10), left, '10px');
        }
    }
    /** @private */
    public removeTooltip(): void {
        removeElement('EJ2_Chart_ZoomTip');
    }

    // Toolkit events function calculation here.
    /** @private */
    public reset(): boolean {
        let chart: Chart = this.chart;
        if (!chart.zoomModule.isDevice) {
            remove(chart.zoomModule.toolkitElements);
        }
        this.removeTooltip();
        chart.svgObject.setAttribute('cursor', 'auto');
        chart.axisCollections.forEach((axis: Axis) => {
            axis.zoomFactor = 1;
            axis.zoomPosition = 0;
            if (axis.zoomingScrollBar) {
                axis.zoomingScrollBar.isScrollUI = false;
            }
        });
        chart.disableTrackTooltip = false;
        chart.zoomModule.isZoomed = chart.zoomModule.isPanning = chart.isChartDrag = chart.delayRedraw = false;
        chart.zoomModule.touchMoveList = chart.zoomModule.touchStartList = [];
        chart.zoomModule.pinchTarget = null;
        chart.removeSvg();
        chart.refreshAxis();
        chart.refreshBound();
        this.elementOpacity = '1';
        return false;
    }

    private zoomIn(e: PointerEvent): boolean {
        this.zoomInOutCalculation(1, this.chart, this.chart.axisCollections, this.chart.zoomSettings.mode);
        return false;
    }

    private zoomOut(e: PointerEvent): boolean {
        this.zoomInOutCalculation(-1, this.chart, this.chart.axisCollections, this.chart.zoomSettings.mode);
        return false;
    }

    private zoom(e: PointerEvent): boolean {
        this.chart.zoomModule.isPanning = false;
        let zoomModule: Zoom = this.chart.zoomModule;
        this.elementOpacity = '1';
        this.chart.svgObject.setAttribute('cursor', 'auto');
        this.zoomInElements.setAttribute('opacity', this.elementOpacity);
        this.zoomOutElements.setAttribute('opacity', this.elementOpacity);
        this.applySelection(this.zoomElements.childNodes, this.selectionColor);
        this.applySelection(this.panElements.childNodes, '#737373');
        return false;
    }
    /** @private */
    public pan(): boolean {
        let element: void;
        this.chart.zoomModule.isPanning = true;
        this.chart.svgObject.setAttribute('cursor', 'pointer');
        this.elementOpacity = '0.2';
        element = this.zoomInElements ? this.zoomInElements.setAttribute('opacity', this.elementOpacity) : null;
        element = this.zoomOutElements ? this.zoomOutElements.setAttribute('opacity', this.elementOpacity) : null;
        element = this.panElements ? this.applySelection(this.panElements.childNodes, this.selectionColor) : null;
        element = this.zoomElements ? this.applySelection(this.zoomElements.childNodes, '#737373') : null;
        return false;
    }

    private zoomInOutCalculation(scale: number, chart: Chart, axes: AxisModel[], mode: ZoomMode): void {
        if (!chart.zoomModule.isPanning && this.elementOpacity !== '0.2') {
            let zoomFactor: number;
            let zoomPosition: number;
            let cumulative: number;
            chart.disableTrackTooltip = true;
            chart.delayRedraw = true;
            axes.forEach((axis: Axis) => {
                if ((axis.orientation === 'Horizontal' && mode !== 'Y') ||
                    (axis.orientation === 'Vertical' && mode !== 'X')) {
                    cumulative = Math.max(Math.max(1 / minMax(axis.zoomFactor, 0, 1), 1) + (0.25 * scale), 1);
                    zoomFactor = (cumulative === 1) ? 1 : minMax(1 / cumulative, 0, 1);
                    zoomPosition = (cumulative === 1) ? 0 : axis.zoomPosition + ((axis.zoomFactor - zoomFactor) * 0.5);
                    if (axis.zoomPosition !== zoomPosition || axis.zoomFactor !== zoomFactor) {
                        zoomFactor = (zoomPosition + zoomFactor) > 1 ? (1 - zoomPosition) : zoomFactor;
                    }
                    axis.zoomFactor = zoomFactor;
                    axis.zoomPosition = zoomPosition;
                }
            });
        }
    }

    private applySelection(elements: NodeList, color: string): void {
        for (let i: number = 1, length: number = elements.length; i < length; i++) {
            (elements[i] as HTMLElement).setAttribute('fill', color);
        }
    }
}