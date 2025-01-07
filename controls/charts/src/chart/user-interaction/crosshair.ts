import { Chart } from '../chart';
import { AnimationOptions, Animation, Browser, createElement } from '@syncfusion/ej2-base';
import {
    textElement, getValueXByPoint, stopTimer, findCrosshairDirection,
    getValueYByPoint, ChartLocation, withInBounds, removeElement
} from '../../common/utils/helper';

import { PointData } from '../../common/utils/helper';
import { PathOption, Rect, Size, TextOption, measureText, SvgRenderer, CanvasRenderer } from '@syncfusion/ej2-svg-base';
import { Axis } from '../axis/axis';
import { CrosshairSettingsModel } from '../chart-model';
import { ChartData } from '../../chart/utils/get-data';


/**
 * The `Crosshair` module is used to render the crosshair for the chart.
 */
export class Crosshair {

    //Internal variables
    private elementID: string;
    private elementSize: Size;
    private svgRenderer: SvgRenderer;
    private data: ChartData;
    private crosshairInterval: number;
    private arrowLocation: ChartLocation = new ChartLocation(0, 0);
    private isTop: boolean; private isBottom: boolean; private isLeft: boolean; private isRight: boolean;
    /** @private */
    public valueX: number;
    /** @private */
    public valueY: number;
    private rx: number = 2;
    private ry: number = 2;

    //Module declarations
    private chart: Chart;

    /**
     * Constructor for crosshair module.
     *
     * @private
     */

    constructor(chart: Chart) {
        this.chart = chart;
        this.elementID = this.chart.element.id;
        this.svgRenderer = new SvgRenderer(this.chart.element.id);
        if (this.chart.crosshair.snapToData) {
            this.data = new ChartData(this.chart);
        }
        this.addEventListener();
    }

    /**
     * Adds event listeners to the chart elements.
     *
     * @private
     * @returns {void}
     */
    private addEventListener(): void {
        if (this.chart.isDestroyed) { return; }
        const cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        this.chart.on(Browser.touchMoveEvent, this.mouseMoveHandler, this);
        this.chart.on(Browser.touchEndEvent, this.mouseUpHandler, this);
        this.chart.on(cancelEvent, this.mouseLeaveHandler, this);
        this.chart.on('tapHold', this.longPress, this);
    }

    private mouseUpHandler(): void {
        if (this.chart.startMove) {
            this.removeCrosshair(2000);
        }
    }

    private mouseLeaveHandler(): void {
        this.removeCrosshair(1000);
    }

    public mouseMoveHandler(event: PointerEvent | TouchEvent): void {
        const chart: Chart = this.chart;
        if (chart.stockChart && chart.stockChart.onPanning) {
            if (chart.mouseY < chart.chartAxisLayoutPanel.seriesClipRect.y) {
                chart.mouseY = chart.chartAxisLayoutPanel.seriesClipRect.y;
            }
            else if (chart.mouseY > chart.chartAxisLayoutPanel.seriesClipRect.y + chart.chartAxisLayoutPanel.seriesClipRect.height) {
                chart.mouseY = chart.chartAxisLayoutPanel.seriesClipRect.y + chart.chartAxisLayoutPanel.seriesClipRect.height;
            }
        }
        if (event.type === 'touchmove' && (Browser.isIos || Browser.isIos7) && chart.startMove && event.preventDefault) {
            event.preventDefault();
        }
        // Tooltip for chart series.
        if (!chart.disableTrackTooltip) {
            if (withInBounds(chart.mouseX, chart.mouseY, chart.chartAxisLayoutPanel.seriesClipRect)) {
                if (chart.startMove || !chart.isTouch) {
                    this.crosshair();
                }
            } else {
                this.removeCrosshair(1000);
            }
        }
    }

    /**
     * Handles the long press on chart.
     *
     * @returns {boolean} false
     * @private
     */
    private longPress(): boolean {
        const chart: Chart = this.chart;
        if (withInBounds(chart.mouseX, chart.mouseY, chart.chartAxisLayoutPanel.seriesClipRect)) {
            this.crosshair();
        }
        return false;
    }

    /**
     * Finds the data points closest to the mouse position for all visible series in the chart.
     * Updates the `data` object with the nearest data point to be used for mouse interactions.
     *
     * @param {Chart} chart - The chart instance containing the visible series and mouse position.
     * @returns {boolean} -  True if chart has atleast one visible series.
     * @private
     */
    private findMousePoints(chart: Chart): boolean {
        let data: PointData = this.data.getData();
        const pointLocations: number[] = [];
        const axisCoordinate: string = chart.isTransposed ? 'x' : 'y';
        let nearestDataPoint: PointData | null = null;
        let nearestValue: number | null = null;
        let minDifference: number = Infinity; // For finding the nearest value
        const mouseCoordinate: number = axisCoordinate === 'x' ? chart.mouseX : chart.mouseY;
        let seriesVisibility: boolean = false ;
        const commonXvalues: number[] = this.data.mergeXvalues(this.chart.visibleSeries);

        for (const series of chart.visibleSeries) {
            seriesVisibility = seriesVisibility ? seriesVisibility : series.visible;
            if (series.visible && series.category !== 'TrendLine') {
                // Get the closest X value and store the data point
                const closestData: PointData = this.data.getClosestX(chart, series, commonXvalues) || data;
                if (closestData && closestData.point && closestData.point.symbolLocations[0]) {
                    const pointLocation: number = closestData.point.symbolLocations[0][axisCoordinate as string] +
                        closestData.series.clipRect[axisCoordinate as string];
                    if (chart.crosshair.snapToData) {
                        pointLocations.push(pointLocation); // Store point locations for nearest calculation
                        // Calculate the nearest point to the mouse
                        const difference: number = Math.abs(pointLocation - mouseCoordinate);
                        if (difference < minDifference) {
                            minDifference = difference;
                            nearestValue = pointLocation;
                            nearestDataPoint = closestData;
                        }
                    }
                }
            }
        }
        // Use the nearest data point
        if (chart.crosshair.snapToData && nearestDataPoint) {
            data = nearestDataPoint;
        }
        if (data && data.point) {
            this.data.findMouseValues(data, chart, this);
        }
        return seriesVisibility;
    }

    /**
     * Renders the crosshair.
     *
     * @returns {void}
     * @private
     */
    public crosshair(): void {
        let seriesVisible: boolean = true;
        if (this.chart.crosshair.snapToData) {
            seriesVisible = this.findMousePoints(this.chart);
        }
        const chart: Chart = this.chart; let horizontalCross: string = ''; let verticalCross: string = '';
        let options: PathOption; let axisTooltipGroup: Element = document.getElementById( this.elementID + '_crosshair_axis');
        const crosshair: CrosshairSettingsModel = chart.crosshair;
        let tooltipdiv: Element = document.getElementById(this.elementID + '_tooltip');
        const chartRect: Rect = chart.chartAxisLayoutPanel.seriesClipRect;
        const crossGroup: HTMLElement = chart.enableCanvas ? document.getElementById(this.elementID + '_Secondary_Element') :
            document.getElementById(this.elementID + '_UserInteraction');
        let crosshairsvg: Element;
        let cross: HTMLElement = document.getElementById(this.elementID + '_Crosshair');
        if (chart.enableCanvas) {
            if (!cross) {
                cross = createElement('div', {
                    id: this.elementID + '_Crosshair', styles: 'position: absolute; pointer-events: none'
                });
                crossGroup.appendChild(cross);
            }
        }
        this.stopAnimation();
        if ((chart.crosshair.snapToData && this.valueY === undefined) || chart.isCrosshair && chart.tooltip.enable && chart.tooltipModule &&
            !withInBounds(chart.tooltipModule.valueX, chart.tooltipModule.valueY, chartRect) ||
            (chart.crosshair.snapToData && !seriesVisible)) {
            return null;
        }

        this.valueX = chart.crosshair.snapToData ? this.valueX :
            (chart.tooltip.enable && chart.tooltipModule && chart.tooltipModule.valueX ? chart.tooltipModule.valueX : chart.mouseX);
        this.valueY = chart.crosshair.snapToData ? this.valueY :
            (chart.tooltip.enable && chart.tooltipModule && chart.tooltipModule.valueY ? chart.tooltipModule.valueY : chart.mouseY);
        if (!chart.enableCanvas) {
            crossGroup.setAttribute('opacity', '1');
        }
        if (crosshair.lineType === 'Both' || crosshair.lineType === 'Horizontal') {
            horizontalCross += 'M ' + chartRect.x + ' ' + this.valueY +
                ' L ' + (chartRect.x + chartRect.width) + ' ' + this.valueY;
        }
        if (crosshair.lineType === 'Both' || crosshair.lineType === 'Vertical') {
            verticalCross += 'M ' + this.valueX + ' ' + chartRect.y +
                ' L ' + this.valueX + ' ' + (chartRect.y + chartRect.height);
        }
        if (chart.enableCanvas) {
            if (!axisTooltipGroup) {
                axisTooltipGroup = this.svgRenderer.createGroup({ 'id': this.elementID + '_crosshair_axis' });
            }
            const elementID: string = chart.tooltip.enable ? chart.element.id + '_tooltip_svg' : chart.element.id + '_svg';
            crosshairsvg = this.svgRenderer.createSvg({
                id: elementID,
                width: chart.availableSize.width,
                height: chart.availableSize.height
            });
            if (chart.tooltip.enable) {
                tooltipdiv = !tooltipdiv ? chart.tooltipModule.createElement() : tooltipdiv;
                tooltipdiv.appendChild(crosshairsvg);
                crossGroup.appendChild(tooltipdiv);
            }
            options = new PathOption(
                this.elementID + '_HorizontalLine', 'none', crosshair.line.width,
                crosshair.horizontalLineColor || crosshair.line.color || chart.themeStyle.crosshairLine,
                crosshair.opacity, (chart.theme.indexOf('Bootstrap5') > -1 || chart.theme === 'Fluent2HighContrast' || chart.theme.indexOf('Tailwind3') > -1) ? crosshair.dashArray || '2.5' :  crosshair.dashArray, horizontalCross
            );
            this.drawCrosshairLine(options, cross, chartRect.x, this.valueY, chartRect.width, 0, horizontalCross);
            /**
             * due to not working for vertical line side I added new option
             * options.d = verticalCross; options.id = this.elementID + '_VerticalLine';
             */
            options = new PathOption(
                this.elementID + '_VerticalLine', 'none', crosshair.line.width,
                crosshair.verticalLineColor || crosshair.line.color || chart.themeStyle.crosshairLine,
                crosshair.opacity, (chart.theme.indexOf('Bootstrap5') > -1 || chart.theme === 'Fluent2HighContrast' || chart.theme.indexOf('Tailwind3') > -1) ? crosshair.dashArray || '2.5' :  crosshair.dashArray, verticalCross
            );
            this.drawCrosshairLine(options, cross, this.valueX, chartRect.y, 0, chartRect.height, verticalCross);
            this.renderAxisTooltip(chart, chartRect, <Element>axisTooltipGroup);
            crosshairsvg.appendChild(axisTooltipGroup);
            if (!chart.tooltip.enable) {
                cross.appendChild(crosshairsvg);
            }
        } else {
            if (crossGroup.childNodes.length === 0) {
                axisTooltipGroup = chart.renderer.createGroup({ 'id': this.elementID + '_crosshair_axis' });
                options = new PathOption(
                    this.elementID + '_HorizontalLine', 'none', crosshair.line.width,
                    crosshair.horizontalLineColor || crosshair.line.color || chart.themeStyle.crosshairLine,
                    crosshair.opacity, (chart.theme.indexOf('Bootstrap5') > -1 || chart.theme === 'Fluent2HighContrast' || chart.theme.indexOf('Tailwind3') > -1) ? crosshair.dashArray || '2.5' :  crosshair.dashArray, horizontalCross
                );
                this.renderCrosshairLine(options, crossGroup);
                options = new PathOption(
                    this.elementID + '_VerticalLine', 'none', crosshair.line.width,
                    crosshair.verticalLineColor || crosshair.line.color || chart.themeStyle.crosshairLine,
                    crosshair.opacity, (chart.theme.indexOf('Bootstrap5') > -1 || chart.theme === 'Fluent2HighContrast' || chart.theme.indexOf('Tailwind3') > -1) ? crosshair.dashArray || '2.5' :  crosshair.dashArray, verticalCross
                );
                this.renderCrosshairLine(options, crossGroup);
                crossGroup.appendChild(axisTooltipGroup);
                this.renderAxisTooltip(chart, chartRect, <Element>crossGroup.lastChild);
            } else {
                document.getElementById(this.elementID + '_HorizontalLine').setAttribute('d', horizontalCross);
                document.getElementById(this.elementID + '_VerticalLine').setAttribute('d', verticalCross);
                this.renderAxisTooltip(chart, chartRect, <Element>crossGroup.lastChild);
            }
        }
    }

    private renderCrosshairLine(options: PathOption, crossGroup: HTMLElement): void {

        const htmlObject: HTMLElement = this.chart.renderer.drawPath(options) as HTMLElement;

        crossGroup.appendChild(htmlObject);
    }

    private drawCrosshairLine(options: PathOption, crossGroup: HTMLElement, left: number,
                              top: number, width: number, height: number, direction: string): void {
        if (!document.getElementById(options.id) && direction) {
            const line: HTMLElement = createElement('div', {
                id: options.id
            });
            crossGroup.appendChild(line);
        }
        if (document.getElementById(options.id)) {
            const style: string = 'top:' + top.toString() + 'px;' +
                'left:' + left.toString() + 'px;' +
                'width:' + width + 'px;' +
                'height:' + height + 'px;' +
                'fill:' + options.stroke + ';' +
                'border: 0.5px solid ' + options.stroke + ';' +
                'opacity: ' + options.opacity + ' ; ' +
                'position: absolute';
            const crosshairline: HTMLElement = document.getElementById(options.id);
            const crosshairtooltip: HTMLElement = document.getElementById(this.elementID + '_crosshair_axis');
            crosshairline.style.cssText = style;
            crossGroup.style.opacity = '1';
            if (crosshairtooltip) {
                crosshairtooltip.style.opacity = '1';
            }
        }
    }

    private renderAxisTooltip(chart: Chart, chartRect: Rect, axisGroup: Element): void {
        let axis: Axis; let text: string | string[] ;
        let rect: Rect;
        let pathElement: Element;
        let textElem: Element;
        let options: TextOption;
        const padding: number = 5;
        let direction: string;
        let axisRect: Rect;
        for (let k: number = 0, length: number = chart.axisCollections.length; k < length; k++) {
            axis = chart.axisCollections[k as number];
            axisRect = !axis.placeNextToAxisLine ? axis.rect : axis.updatedRect;
            if (axis.crosshairTooltip.enable) {
                if (axisRect && ((this.valueX <= (axisRect.x + axisRect.width) && axisRect.x <= this.valueX) ||
                    (this.valueY <= (axisRect.y + axisRect.height) && axisRect.y <= this.valueY))) {
                    pathElement = document.getElementById(this.elementID + '_axis_tooltip_' + k);
                    textElem = document.getElementById(this.elementID + '_axis_tooltip_text_' + k);
                    text = this.getAxisText(axis);
                    if (text && text.indexOf('<br') > -1) {
                        text = this.getAxisText(axis).split(/<br.*?>/g);
                    }
                    if (!text) {
                        continue;
                    }
                    rect = this.tooltipLocation(text, axis, chartRect, axisRect);
                    if (rect.y + rect.height / 2 > chart.availableSize.height || rect.y < 0) {
                        continue;
                    }
                    if (pathElement === null) {
                        if (chart.enableCanvas) {
                            pathElement = this.svgRenderer.drawPath(
                                {
                                    'id': this.elementID + '_axis_tooltip_' + k,
                                    'fill': axis.crosshairTooltip.fill || chart.themeStyle.crosshairFill
                                });
                        } else {
                            pathElement = chart.renderer.drawPath(
                                {
                                    'id': this.elementID + '_axis_tooltip_' + k,
                                    'fill': axis.crosshairTooltip.fill || chart.themeStyle.crosshairFill},
                                null);
                        }
                        axisGroup.appendChild(pathElement);
                        options = new TextOption(this.elementID + '_axis_tooltip_text_' + k, 0, 0, (chart.stockChart && chart.enableRtl) ? 'end' : 'start', text);
                        const render: SvgRenderer | CanvasRenderer = chart.enableCanvas ? this.svgRenderer : chart.renderer;
                        textElem = textElement(
                            render, options, axis.crosshairTooltip.textStyle,
                            axis.crosshairTooltip.textStyle.color || chart.themeStyle.crosshairLabelFont.color, axisGroup, null, null, null,
                            null, null, null, null, null, chart.enableCanvas, null, this.chart.themeStyle.crosshairLabelFont
                        );
                    }
                    direction = findCrosshairDirection(
                        this.rx, this.ry, rect, this.arrowLocation, 9,
                        this.isTop, this.isBottom, this.isLeft, this.valueX, this.valueY
                    );
                    pathElement.setAttribute('d', direction);
                    if (typeof text !== 'string' && text.length > 1) {
                        for (let i: number = 0; i < text.length; i++) {
                            textElem.childNodes[i as number].textContent = text[i as number];
                        }
                    } else {
                        textElem.textContent = text as string;
                    }
                    textElem.setAttribute('x', (rect.x + padding + (chart.enableRtl ? this.elementSize.width : 0)).toString());
                    textElem.setAttribute('y', (rect.y + padding + 3 * this.elementSize.height / 4).toString());
                    const shadowId: string = this.chart.element.id + '_shadow';
                    if (typeof text !== 'string' && text.length > 1) {
                        let height: number = 0;
                        textElem.setAttribute('y', (rect.y + padding + 3 * this.elementSize.height / (4 * text.length)).toString());
                        for (let i: number = 0; i < textElem.children.length; i++) {
                            height += this.elementSize.height / text.length;
                            textElem.children[i as number].setAttribute('x', (rect.x + padding + (chart.enableRtl ? this.elementSize.width : 0) + this.elementSize.width / 2).toString());
                            textElem.children[i as number].setAttribute('y', ((parseInt(textElem.getAttribute('y'), 10) + height).toString()));
                            textElem.children[i as number].setAttribute('style', 'text-anchor: middle');
                        }
                    }
                    if (this.chart.theme === 'Fluent' || this.chart.theme === 'FluentDark' || this.chart.theme === 'Fabric' || this.chart.theme === 'FabricDark' || this.chart.theme === 'Fluent2HighContrast') {
                        const defElement: Element = this.chart.renderer.createDefs();
                        const bordercolor: string = this.chart.theme === 'Fluent' || this.chart.theme === 'Fabric' ? '#D2D0CE' : this.chart.theme === 'Fluent2HighContrast' ? '#FFFFFF' : null;
                        const borderwidth: number = this.chart.theme === 'Fluent' || this.chart.theme === 'Fabric' || this.chart.theme === 'Fluent2HighContrast' ? 1 : null;
                        defElement.setAttribute('id', this.chart.element.id + 'SVG_tooltip_definition');
                        axisGroup.appendChild(defElement);
                        pathElement.setAttribute('stroke', bordercolor);
                        pathElement.setAttribute('stroke-width', ' ' + borderwidth);
                    }
                    else if (this.chart.theme.indexOf('Fluent2') > -1) {
                        let shadow: string = '<filter id="' + shadowId + '" height="130%"><feGaussianBlur in="SourceAlpha" stdDeviation="3"/>';
                        shadow += '<feOffset dx="-1" dy="3.6" result="offsetblur"/><feComponentTransfer><feFuncA type="linear" slope="0.2"/>';
                        shadow += '</feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
                        const defElement: Element = this.chart.renderer.createDefs();
                        defElement.setAttribute('id', this.chart.element.id + 'SVG_tooltip_definition');
                        pathElement.setAttribute('filter', Browser.isIE ? '' : 'url(#' + shadowId + ')');
                        pathElement.appendChild(defElement);
                        defElement.innerHTML = shadow;
                    }
                } else {
                    removeElement(this.elementID + '_axis_tooltip_' + k);
                    removeElement(this.elementID + '_axis_tooltip_text_' + k);
                }
            }
        }
    }

    private getAxisText(axis: Axis): string {
        let value: number;
        this.isBottom = false; this.isTop = false; this.isLeft = false; this.isRight = false;
        const labelValue: number = (axis.valueType === 'Category' && axis.labelPlacement === 'BetweenTicks')
            ? 0.5 : 0;
        const isOpposed: boolean = axis.isAxisOpposedPosition;
        if (axis.orientation === 'Horizontal') {
            value = getValueXByPoint(Math.abs(this.valueX - axis.rect.x), axis.rect.width, axis) + labelValue;
            this.isBottom = !isOpposed; this.isTop = isOpposed;
        } else {
            value = getValueYByPoint(Math.abs(this.valueY - axis.rect.y), axis.rect.height, axis) + labelValue;
            this.isRight = isOpposed; this.isLeft = !isOpposed;
        }
        if (axis.valueType === 'DateTime') {
            return axis.format(new Date(value));
        } else if (axis.valueType === 'Category') {
            return axis.labels[Math.floor(<number>value)];
        } else if (axis.valueType === 'DateTimeCategory') {
            return this.chart.dateTimeCategoryModule.getIndexedAxisLabel(axis.labels[Math.round(<number>value)], axis.format);
        } else if (axis.valueType === 'Logarithmic') {
            return value = axis.format(Math.pow(axis.logBase, value));
        } else {
            const customLabelFormat: boolean = axis.labelFormat && axis.labelFormat.match('{value}') !== null;
            return customLabelFormat ? axis.labelFormat.replace('{value}', axis.format(value)) : axis.format(value);
        }
    }



    private tooltipLocation(text: string[] | string, axis: Axis, bounds: Rect, axisRect: Rect): Rect {

        const padding: number = 5; const arrowPadding: number = 9;
        let tooltipRect: Rect;
        const boundsX: number = bounds.x;
        const boundsY: number = bounds.y;
        const islabelInside: boolean = axis.labelPosition === 'Inside';
        let scrollBarHeight: number = axis.scrollbarSettings.enable || (axis.zoomingScrollBar && axis.zoomingScrollBar.svgObject)
            ? axis.scrollBarHeight : 0;
        this.elementSize = measureText(text as string, axis.crosshairTooltip.textStyle, this.chart.themeStyle.crosshairLabelFont);
        if (typeof text !== 'string' && text.length > 1) {
            this.elementSize.width = 0; this.elementSize.height = 0;
            for (let i: number = 0; i < text.length; i++) {
                const size: Size = measureText(text[i as number], axis.crosshairTooltip.textStyle,
                                               this.chart.themeStyle.crosshairLabelFont);
                this.elementSize.height += size.height;
                if (this.elementSize.width < size.width) {
                    this.elementSize.width = size.width;
                }
            }
        }
        const isOpposed: boolean = axis.isAxisOpposedPosition;
        if (axis.orientation === 'Horizontal') {
            const yLocation: number = islabelInside ? axisRect.y - this.elementSize.height - (padding * 2 + arrowPadding) :
                axisRect.y + scrollBarHeight;
            const height: number = islabelInside ? axisRect.y - this.elementSize.height - arrowPadding : axisRect.y + arrowPadding;
            this.arrowLocation = new ChartLocation(this.valueX, yLocation);

            tooltipRect = new Rect(
                (this.valueX - (this.elementSize.width / 2) - padding), height + (!islabelInside ? scrollBarHeight : 0),
                this.elementSize.width + padding * 2, this.elementSize.height + padding * 2
            );
            if (isOpposed) {
                tooltipRect.y = islabelInside ? axisRect.y : axisRect.y -
                    (this.elementSize.height + padding * 2 + arrowPadding) - scrollBarHeight;
            }
            if (tooltipRect.x < boundsX) {
                tooltipRect.x = boundsX;
            }
            if (tooltipRect.x + tooltipRect.width > boundsX + bounds.width) {
                tooltipRect.x -= ((tooltipRect.x + tooltipRect.width) - (boundsX + bounds.width));
            }
            if (this.arrowLocation.x + arrowPadding / 2 > tooltipRect.x + tooltipRect.width - this.rx) {
                this.arrowLocation.x = tooltipRect.x + tooltipRect.width - this.rx - arrowPadding;
            }
            if (this.arrowLocation.x - arrowPadding < tooltipRect.x + this.rx) {
                this.arrowLocation.x = tooltipRect.x + this.rx + arrowPadding;
            }
        } else {
            scrollBarHeight = scrollBarHeight * (isOpposed ? 1 : -1);
            this.arrowLocation = new ChartLocation(axisRect.x, this.valueY);
            const width: number = islabelInside ? axisRect.x - scrollBarHeight :
                axisRect.x - (this.elementSize.width) - (padding * 2 + arrowPadding);
            tooltipRect = new Rect(
                width + scrollBarHeight, this.valueY - (this.elementSize.height / 2) - padding,
                this.elementSize.width + (padding * 2), this.elementSize.height + padding * 2
            );
            if (isOpposed) {
                tooltipRect.x = islabelInside ? axisRect.x - this.elementSize.width - arrowPadding :
                    axisRect.x + arrowPadding + scrollBarHeight;
                if ((tooltipRect.x + tooltipRect.width) > this.chart.availableSize.width) {
                    this.arrowLocation.x -= ((tooltipRect.x + tooltipRect.width) - this.chart.availableSize.width);
                    tooltipRect.x -= ((tooltipRect.x + tooltipRect.width) - this.chart.availableSize.width);
                }
            } else {
                if (tooltipRect.x < 0) {
                    this.arrowLocation.x -= tooltipRect.x;
                    tooltipRect.x = 0;
                }
            }
            if (tooltipRect.y < boundsY) {
                tooltipRect.y = boundsY;
            }
            if (tooltipRect.y + tooltipRect.height >= boundsY + bounds.height) {
                tooltipRect.y -= ((tooltipRect.y + tooltipRect.height) - (boundsY + bounds.height));
            }
            if (this.arrowLocation.y + arrowPadding / 2 > tooltipRect.y + tooltipRect.height - this.ry) {
                this.arrowLocation.y = tooltipRect.y + tooltipRect.height - this.ry - arrowPadding / 2;
            }
            if (this.arrowLocation.y - arrowPadding / 2 < tooltipRect.y + this.ry) {
                this.arrowLocation.y = tooltipRect.y + this.ry + arrowPadding / 2;
            }
        }
        return tooltipRect;
    }
    private stopAnimation(): void {
        stopTimer(this.crosshairInterval);
    }
    private progressAnimation(): void {
        stopTimer(this.crosshairInterval);
    }
    /**
     * Removes the crosshair on mouse leave.
     *
     * @returns {void}
     * @private
     */

    public removeCrosshair(duration: number): void {
        const chart: Chart = this.chart;
        const crosshair: HTMLElement = chart.enableCanvas ? document.getElementById(this.elementID + '_Crosshair') :
            document.getElementById(this.elementID + '_UserInteraction');
        const crosshairtooltip: HTMLElement = chart.enableCanvas ? document.getElementById(this.elementID + '_crosshair_axis') : null;
        this.stopAnimation();
        if (crosshair && crosshair.getAttribute('opacity') !== '0') {
            this.crosshairInterval = +setTimeout(
                (): void => {
                    new Animation({}).animate(crosshair, {
                        duration: 200,
                        progress: (args: AnimationOptions): void => {
                            // crosshair.removeAttribute('e-animate');
                            crosshair.style.animation = '';
                            if (!chart.enableCanvas) {
                                crosshair.setAttribute('opacity', (1 - (args.timeStamp / args.duration)).toString());
                            } else {
                                crosshair.style.opacity = (1 - (args.timeStamp / args.duration)).toString();
                                crosshairtooltip.style.opacity = (1 - (args.timeStamp / args.duration)).toString();
                            }
                        },
                        end: (): void => {
                            if (chart.enableCanvas) {
                                crosshair.style.opacity = '0';
                                crosshairtooltip.style.opacity = '0';
                            } else {
                                crosshair.setAttribute('opacity', '0');
                            }
                            chart.startMove = false;
                            if (chart.tooltipModule) {
                                chart.tooltipModule.valueX = null;
                                chart.tooltipModule.valueY = null;
                            }
                        }
                    });
                },
                duration);
        }
    }
    /**
     * Get module name.
     *
     * @returns {string} module name
     */
    protected getModuleName(): string {
        /**
         * Returns the module name.
         */
        return 'Crosshair';
    }
    /**
     * To destroy the crosshair.
     *
     * @returns {void}
     * @private
     */

    public destroy(): void {
        /**
         * Destroy method performed here.
         */
    }
}
