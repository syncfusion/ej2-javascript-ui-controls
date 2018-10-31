import { Chart } from '../chart';
import { SvgRenderer, EventHandler, Browser, createElement } from '@syncfusion/ej2-base';
import { getRectLocation, minMax, getElement, ChartLocation, Rect, RectOption, measureText } from '../../common/utils/helper';
import { Axis } from '../axis/axis';
import { Toolkit } from './zooming-toolkit';
import { AxisModel } from '../axis/axis-model';
import { VisibleRangeModel } from '../axis/axis';
import { Series } from '../series/chart-series';
import { ZoomMode, ToolbarItems } from '../utils/enum';
import { ZoomSettingsModel } from '../chart-model';
import { CartesianAxisLayoutPanel } from '../axis/cartesian-panel';
import { IZoomCompleteEventArgs, ITouches, IZoomAxisRange } from '../../common/model/interface';
import { zoomComplete } from '../../common/model/constants';
import { withInBounds } from '../../common/utils/helper';

/**
 * `Zooming` module handles the zooming for chart.
 */
export class Zoom {
    private chart: Chart;
    private zooming: ZoomSettingsModel;
    private elementId: string;
    /** @private */
    public zoomingRect: Rect;
    /** @private */
    public toolkit: Toolkit;
    /** @private */
    public toolkitElements: Element;
    /** @private */
    public isPanning: boolean;
    /** @private */
    public isZoomed: boolean;
    /** @private */
    public isPointer: Boolean;
    /** @private */
    public pinchTarget: Element;
    /** @private */
    public isDevice: Boolean;
    /** @private */
    public browserName: string;
    /** @private */
    public touchStartList: ITouches[] | TouchList;
    /** @private */
    public touchMoveList: ITouches[] | TouchList;
    /** @private */
    public offset: Rect;
    /** @private */
    public zoomAxes: IZoomAxisRange[];
    /** @private */
    public isIOS: Boolean;
    /** @private */
    public performedUI: boolean;
    private zoomkitOpacity: number;
    private wheelEvent: string;
    private cancelEvent: string;

    /**
     * Constructor for Zooming module.
     * @private.
     */

    constructor(chart: Chart) {
        this.chart = chart;
        this.isPointer = Browser.isPointer;
        this.browserName = Browser.info.name;
        this.wheelEvent = this.browserName === 'mozilla' ? (this.isPointer ? 'mousewheel' : 'DOMMouseScroll') : 'mousewheel';
        this.cancelEvent = this.isPointer ? 'pointerleave' : 'mouseleave';
        this.addEventListener();
        this.isDevice = Browser.isDevice;
        let zooming: ZoomSettingsModel = chart.zoomSettings;
        this.toolkit = new Toolkit(chart);
        this.zooming = zooming;
        this.elementId = chart.element.id;
        this.zoomingRect = new Rect(0, 0, 0, 0);
        this.zoomAxes = [];
        this.zoomkitOpacity = 0.3;
        this.isIOS = Browser.isIos || Browser.isIos7;
        this.isZoomed = this.performedUI = this.zooming.enablePan && this.zooming.enableSelectionZooming;
        if (zooming.enableScrollbar) {
            chart.scrollElement = createElement(
                'div', { id: chart.element.id + '_scrollElement' }
            );
        }
    }

    /**
     * Function that handles the Rectangular zooming.
     * @return {void}
     */
    public renderZooming(e: PointerEvent | TouchEvent, chart: Chart, isTouch: boolean): void {
        this.calculateZoomAxesRange(chart, chart.axisCollections);
        if (this.zooming.enableSelectionZooming && (!isTouch
            || (chart.isDoubleTap && this.touchStartList.length === 1)) && (!this.isPanning || chart.isDoubleTap)) {
            this.isPanning = this.isDevice ? true : this.isPanning;
            this.performedUI = true;
            this.drawZoomingRectangle(chart);
        } else if (this.isPanning && chart.isChartDrag) {
            if (!isTouch || (isTouch && this.touchStartList.length === 1)) {
                this.pinchTarget = isTouch ? <Element>e.target : null;
                this.doPan(chart, chart.axisCollections);
            }
        }
    }

    // Zooming rectangle drawn here
    private drawZoomingRectangle(chart: Chart): void {
        let areaBounds: Rect = chart.chartAxisLayoutPanel.seriesClipRect;
        let startLocation: ChartLocation = new ChartLocation(chart.previousMouseMoveX, chart.previousMouseMoveY);
        let endLocation: ChartLocation = new ChartLocation(chart.mouseX, chart.mouseY);
        let rect: Rect = this.zoomingRect = getRectLocation(startLocation, endLocation, areaBounds);
        if (rect.width > 0 && rect.height > 0) {
            this.isZoomed = true;
            chart.disableTrackTooltip = true;
            chart.svgObject.setAttribute('cursor', 'crosshair');
            if (this.zooming.mode === 'X') {
                rect.height = areaBounds.height;
                rect.y = areaBounds.y;
            } else if (this.zooming.mode === 'Y') {
                rect.width = areaBounds.width;
                rect.x = areaBounds.x;
            }
            chart.svgObject.appendChild(chart.renderer.drawRectangle(new RectOption(
                this.elementId + '_ZoomArea', chart.themeStyle.selectionRectFill,
                { color: chart.themeStyle.selectionRectStroke, width: 1 }, 1, rect, 0, 0, '', '3')
            ) as HTMLElement);
        }
    }

    // Panning performed here
    private doPan(chart: Chart, axes: AxisModel[]): void {
        if (chart.startMove && chart.crosshair.enable) {
           return null;
        }
        let currentScale: number;
        let offset: number;
        this.isZoomed = true;
        let translateX: number;
        let translateY: number;
        this.offset = !chart.delayRedraw ? chart.chartAxisLayoutPanel.seriesClipRect : this.offset;
        chart.delayRedraw = true;
        chart.disableTrackTooltip = true;
        axes.forEach((axis: Axis) => {
            currentScale = Math.max(1 / minMax(axis.zoomFactor, 0, 1), 1);
            if (axis.orientation === 'Horizontal') {
                offset = (chart.previousMouseMoveX - chart.mouseX) / axis.rect.width / currentScale;
                axis.zoomPosition = minMax(axis.zoomPosition + offset, 0, (1 - axis.zoomFactor));
            } else {
                offset = (chart.previousMouseMoveY - chart.mouseY) / axis.rect.height / currentScale;
                axis.zoomPosition = minMax(axis.zoomPosition - offset, 0, (1 - axis.zoomFactor));
            }
        });
        if (this.zooming.enableDeferredZooming) {
            translateX = chart.mouseX - chart.mouseDownX;
            translateY = chart.mouseY - chart.mouseDownY;
            switch (this.zooming.mode) {
                case 'X':
                    translateY = 0;
                    break;
                case 'Y':
                    translateX = 0;
                    break;
            }
            this.setTransform(translateX, translateY, null, null, chart, false);
            this.refreshAxis(<CartesianAxisLayoutPanel>chart.chartAxisLayoutPanel, chart, chart.axisCollections);
        } else {
            this.performZoomRedraw(chart);
        }
        chart.previousMouseMoveX = chart.mouseX;
        chart.previousMouseMoveY = chart.mouseY;
    }

    /**
     * Redraw the chart on zooming.
     * @return {void}
     * @private
     */
    public performZoomRedraw(chart: Chart): void {
        let rect: Rect = this.zoomingRect;
        chart.animateSeries = false;
        if (this.isZoomed) {
            if (rect.width > 0 && rect.height > 0) {
                this.performedUI = true;
                chart.svgObject.setAttribute('cursor', 'auto');
                this.doZoom(chart, chart.axisCollections, chart.chartAxisLayoutPanel.seriesClipRect);
                chart.isDoubleTap = false;
            } else if (chart.disableTrackTooltip) {
                chart.disableTrackTooltip = false;
                chart.delayRedraw = false;
                chart.removeSvg();
                chart.refreshAxis();
                chart.refreshBound();
            }
        }
    }

    private refreshAxis(layout: CartesianAxisLayoutPanel, chart: Chart, axes: AxisModel[]): void {
        let mode: ZoomMode = chart.zoomSettings.mode;
        layout.measureAxis(new Rect(
            chart.initialClipRect.x, chart.initialClipRect.y, chart.initialClipRect.width, chart.initialClipRect.height));
        axes.map((axis: Axis, index: number) => {
            if (axis.orientation === 'Horizontal' && mode !== 'Y') {
                layout.drawXAxisLabels(axis, index, null,  (axis.placeNextToAxisLine ? axis.updatedRect : axis.rect));
            }
            if (axis.orientation === 'Vertical' && mode !== 'X') {
                layout.drawYAxisLabels(axis, index, null, (axis.placeNextToAxisLine ? axis.updatedRect : axis.rect));
            }
        });
    }

    // Rectangular zoom calculated here performed here
    private doZoom(chart: Chart, axes: AxisModel[], bounds: Rect): void {
        let zoomRect: Rect = this.zoomingRect;
        let mode: ZoomMode = this.zooming.mode;
        let argsData: IZoomCompleteEventArgs;
        let previousZF: number;
        let previousZP: number;
        let currentZF: number;
        let currentZP: number;
        this.isPanning = chart.zoomSettings.enablePan || this.isPanning;
        axes.forEach((axis: Axis) => {
            previousZF = currentZF = axis.zoomFactor;
            previousZP = currentZP = axis.zoomPosition;
            argsData = {
                cancel: false, name: zoomComplete, axis: axis, previousZoomFactor: previousZF, previousZoomPosition: previousZP,
                currentZoomFactor: currentZF, currentZoomPosition: currentZP
            };
            if (axis.orientation === 'Horizontal') {
                if (mode !== 'Y') {
                    currentZP += Math.abs((zoomRect.x - bounds.x) / (bounds.width)) * axis.zoomFactor;
                    currentZF *= (zoomRect.width / bounds.width);
                    argsData.currentZoomPosition = currentZP;
                    argsData.currentZoomFactor = currentZF;
                    chart.trigger(zoomComplete, argsData);
                }
            } else {
                if (mode !== 'X') {
                    currentZP += (1 - Math.abs((zoomRect.height + (zoomRect.y - bounds.y)) / (bounds.height))) * axis.zoomFactor;
                    currentZF *= (zoomRect.height / bounds.height);
                    argsData.currentZoomFactor = currentZF;
                    argsData.currentZoomPosition = currentZP;
                    chart.trigger(zoomComplete, argsData);
                }
            }
            if (!argsData.cancel) {
                axis.zoomFactor = argsData.currentZoomFactor;
                axis.zoomPosition = argsData.currentZoomPosition;
            }
        });
        this.zoomingRect = new Rect(0, 0, 0, 0);
        this.performZoomRedraw(chart);
    }

    /**
     * Function that handles the Mouse wheel zooming.
     * @return {void}
     * @private
     */
    public performMouseWheelZooming(e: WheelEvent, mouseX: number, mouseY: number, chart: Chart, axes: AxisModel[]): void {
        let direction: number = (this.browserName === 'mozilla' && !this.isPointer) ?
            -(e.detail) / 3 > 0 ? 1 : -1 : (e.wheelDelta / 120) > 0 ? 1 : -1;
        let mode: ZoomMode = this.zooming.mode;
        let origin: number = 0.5;
        let cumulative: number;
        let zoomFactor: number;
        let zoomPosition: number;
        this.isZoomed = true;
        this.calculateZoomAxesRange(chart, chart.axisCollections);
        chart.disableTrackTooltip = true;
        this.performedUI =  true;
        this.isPanning = chart.zoomSettings.enablePan || this.isPanning;
        axes.forEach((axis: Axis) => {
            if ((axis.orientation === 'Vertical' && mode !== 'X') ||
                (axis.orientation === 'Horizontal' && mode !== 'Y')) {
                cumulative = Math.max(Math.max(1 / minMax(axis.zoomFactor, 0, 1), 1) + (0.25 * direction), 1);
                if (cumulative >= 1) {
                    origin = axis.orientation === 'Horizontal' ? mouseX / axis.rect.width : 1 - (mouseY / axis.rect.height);
                    origin = origin > 1 ? 1 : origin < 0 ? 0 : origin;
                    zoomFactor = (cumulative === 1) ? 1 : minMax(1 / cumulative, 0, 1);
                    zoomPosition = (cumulative === 1) ? 0 : axis.zoomPosition + ((axis.zoomFactor - zoomFactor) * origin);
                    if (axis.zoomPosition !== zoomPosition || axis.zoomFactor !== zoomFactor) {
                        zoomFactor = (zoomPosition + zoomFactor) > 1 ? (1 - zoomPosition) : zoomFactor;
                    }
                }
                axis.zoomFactor = zoomFactor;
                axis.zoomPosition = zoomPosition;
            }
        });
        this.performZoomRedraw(chart);
    }

    /**
     * Function that handles the Pinch zooming.
     * @return {void}
     * @private
     */
    public performPinchZooming(e: TouchEvent, chart: Chart): boolean {
        if ((this.zoomingRect.width > 0 && this.zoomingRect.height > 0) || (chart.startMove && chart.crosshair.enable)) {
            return false;
        }
        this.calculateZoomAxesRange(chart, chart.axisCollections);
        this.isZoomed = true;
        this.isPanning = true;
        this.performedUI = true;
        this.offset = !chart.delayRedraw ? chart.chartAxisLayoutPanel.seriesClipRect : this.offset;
        chart.delayRedraw = true;
        chart.disableTrackTooltip = true;
        let elementOffset: ClientRect = chart.element.getBoundingClientRect();
        let touchDown: TouchList = <TouchList>this.touchStartList;
        let touchMove: TouchList = <TouchList>this.touchMoveList;
        let touch0StartX: number = touchDown[0].pageX - elementOffset.left;
        let touch0StartY: number = touchDown[0].pageY - elementOffset.top;
        let touch0EndX: number = touchMove[0].pageX - elementOffset.left;
        let touch0EndY: number = touchMove[0].pageY - elementOffset.top;
        let touch1StartX: number = touchDown[1].pageX - elementOffset.left;
        let touch1StartY: number = touchDown[1].pageY - elementOffset.top;
        let touch1EndX: number = touchMove[1].pageX - elementOffset.left;
        let touch1EndY: number = touchMove[1].pageY - elementOffset.top;
        let scaleX: number;
        let scaleY: number;
        let translateXValue: number;
        let translateYValue: number;
        let pinchRect: Rect;
        let clipX: number;
        let clipY: number;
        scaleX = Math.abs(touch0EndX - touch1EndX) / Math.abs(touch0StartX - touch1StartX);
        scaleY = Math.abs(touch0EndY - touch1EndY) / Math.abs(touch0StartY - touch1StartY);
        clipX = ((this.offset.x - touch0EndX) / scaleX) + touch0StartX;
        clipY = ((this.offset.y - touch0EndY) / scaleY) + touch0StartY;
        pinchRect = new Rect(clipX, clipY, this.offset.width / scaleX, this.offset.height / scaleY);
        translateXValue = (touch0EndX - (scaleX * touch0StartX));
        translateYValue = (touch0EndY - (scaleY * touch0StartY));
        if (!isNaN(scaleX - scaleX) && !isNaN(scaleY - scaleY)) {
            switch (this.zooming.mode) {
                case 'XY':
                    this.setTransform(translateXValue, translateYValue, scaleX, scaleY, chart, true);
                    break;
                case 'X':
                    this.setTransform(translateXValue, 0, scaleX, 1, chart, true);
                    break;
                case 'Y':
                    this.setTransform(0, translateYValue, 1, scaleY, chart, true);
                    break;
            }
        }
        this.calculatePinchZoomFactor(chart, pinchRect);
        this.refreshAxis(<CartesianAxisLayoutPanel>chart.chartAxisLayoutPanel, chart, chart.axisCollections);
        return true;
    }

    private calculatePinchZoomFactor(chart: Chart, pinchRect: Rect): void {
        let mode: ZoomMode = this.zooming.mode;
        let selectionMin: number;
        let selectionMax: number;
        let rangeMin: number;
        let rangeMax: number;
        let value: number;
        let axisTrans: number;
        chart.axisCollections.forEach((axis: Axis, index: number) => {
            if ((axis.orientation === 'Horizontal' && mode !== 'Y') ||
                (axis.orientation === 'Vertical' && mode !== 'X')) {
                if (axis.orientation === 'Horizontal') {
                    value = pinchRect.x - this.offset.x;
                    axisTrans = axis.rect.width / this.zoomAxes[index].delta;
                    rangeMin = value / axisTrans + this.zoomAxes[index].min;
                    value = pinchRect.x + pinchRect.width - this.offset.x;
                    rangeMax = value / axisTrans + this.zoomAxes[index].min;
                } else {
                    value = pinchRect.y - this.offset.y;
                    axisTrans = axis.rect.height / this.zoomAxes[index].delta;
                    rangeMin = (value * -1 + axis.rect.height) / axisTrans + this.zoomAxes[index].min;
                    value = pinchRect.y + pinchRect.height - this.offset.y;
                    rangeMax = (value * -1 + axis.rect.height) / axisTrans + this.zoomAxes[index].min;
                }
                selectionMin = Math.min(rangeMin, rangeMax);
                selectionMax = Math.max(rangeMin, rangeMax);
                axis.zoomPosition = (selectionMin - this.zoomAxes[index].actualMin) / this.zoomAxes[index].actualDelta;
                axis.zoomFactor = (selectionMax - selectionMin) / this.zoomAxes[index].actualDelta;
                axis.zoomPosition = axis.zoomPosition < 0 ? 0 : axis.zoomPosition;
                axis.zoomFactor = axis.zoomFactor > 1 ? 1 : axis.zoomFactor;
            }
        });
    }

    // Series transformation style applied here.
    private setTransform(transX: number, transY: number, scaleX: number, scaleY: number, chart: Chart, isPinch: boolean): void {
        chart.seriesElements.setAttribute('clip-path', 'url(#' + this.elementId + '_ChartAreaClipRect_)');
        if (chart.indicatorElements) {
            chart.indicatorElements.setAttribute('clip-path', 'url(#' + this.elementId + '_ChartAreaClipRect_)');
        }
        let translate: string;
        let xAxisLoc: number;
        let yAxisLoc: number;
        let element: Element;
        if (transX !== null && transY !== null) {
            chart.visibleSeries.forEach((value: Series) => {
                xAxisLoc = chart.requireInvertedAxis ? value.yAxis.rect.x : value.xAxis.rect.x;
                yAxisLoc = chart.requireInvertedAxis ? value.xAxis.rect.y : value.yAxis.rect.y;
                translate = 'translate(' + (transX + (isPinch ? (scaleX * xAxisLoc) : xAxisLoc)) +
                    ',' + (transY + (isPinch ? (scaleY * yAxisLoc) : yAxisLoc)) + ')';
                translate = (scaleX || scaleY) ? translate + ' scale(' + scaleX + ' ' + scaleY + ')' : translate;
                if (value.visible) {
                    if (value.category === 'Indicator') {
                        (value.seriesElement.parentNode as HTMLInputElement).setAttribute('transform', translate);
                    } else {
                        value.seriesElement.setAttribute('transform', translate);
                    }
                    element = getElement(chart.element.id + '_Series_' + value.index + '_DataLabelCollections');
                    if (value.errorBarElement) {
                        value.errorBarElement.setAttribute('transform', translate);
                    }
                    if (value.symbolElement) {
                        value.symbolElement.setAttribute('transform', translate);
                    }
                    if (value.textElement) {
                        value.textElement.setAttribute('visibility', 'hidden');
                        value.shapeElement.setAttribute('visibility', 'hidden');
                    }
                    if (element) {
                        (element as HTMLElement).style.visibility = 'hidden';
                    }
                }
            });
        }
    }

    private calculateZoomAxesRange(chart: Chart, axes: AxisModel[]): void {
        let range: IZoomAxisRange;
        let axisRange: VisibleRangeModel;
        chart.axisCollections.forEach((axis: Axis, index: number) => {
            axisRange = axis.visibleRange;
            if (this.zoomAxes[index]) {
                if (!chart.delayRedraw) {
                    this.zoomAxes[index].min = axisRange.min;
                    this.zoomAxes[index].delta = axisRange.delta;
                }
            } else {
                range = {
                    actualMin: axis.actualRange.min,
                    actualDelta: axis.actualRange.delta,
                    min: axisRange.min,
                    delta: axisRange.delta
                };
                this.zoomAxes[index] = range;
            }
        });
    }
    // Zooming Toolkit created here
    private showZoomingToolkit(chart: Chart): boolean {
        let toolboxItems: ToolbarItems[] = this.zooming.toolbarItems;
        let areaBounds: Rect = chart.chartAxisLayoutPanel.seriesClipRect;
        let spacing: number = 5;
        let render: SvgRenderer = chart.renderer;
        let length: number = this.isDevice ? 1 : toolboxItems.length;
        let iconSize: number = this.isDevice ? measureText('Reset Zoom', { size: '12px' }).width : 16;
        let height: number = this.isDevice ? measureText('Reset Zoom', { size: '12px' }).height : 22;
        let width: number = (length * iconSize) + ((length + 1) * spacing) + ((length - 1) * spacing);
        let transX: number = areaBounds.x + areaBounds.width - width - spacing;
        let transY: number = (areaBounds.y + spacing);
        let xPosition: number = spacing;
        let outerElement: Element;
        let toolkit: Toolkit = this.toolkit; let element: Element;
        let shadowElement: string = '<filter id="chart_shadow" height="130%"><feGaussianBlur in="SourceAlpha" stdDeviation="5"/>';
        shadowElement += '<feOffset dx="-3" dy="4" result="offsetblur"/><feComponentTransfer><feFuncA type="linear" slope="1"/>';
        shadowElement += '</feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
        if (length === 0 || getElement(this.elementId + '_Zooming_KitCollection')) {
            return false;
        }
        let defElement: Element = render.createDefs();
        toolboxItems = this.isDevice ? ['Reset'] : toolboxItems;
        defElement.innerHTML = shadowElement;
        this.toolkitElements = render.createGroup({
            id: this.elementId + '_Zooming_KitCollection',
            transform: 'translate(' + transX + ',' + transY + ')'
        });
        this.toolkitElements.appendChild(defElement);
        this.toolkitElements.appendChild(render.drawRectangle(new RectOption(
            this.elementId + '_Zooming_Rect', '#fafafa', { color: 'transparent', width: 1 },
            1, new Rect(0, 0, width, (height + (spacing * 2))), 0, 0
        )) as HTMLElement);
        outerElement = render.drawRectangle(new RectOption(
            this.elementId + '_Zooming_Rect', '#fafafa', { color: 'transparent', width: 1 },
            0.1, new Rect(0, 0, width, (height + (spacing * 2))), 0, 0
        ));
        outerElement.setAttribute('filter', 'url(#chart_shadow)');
        this.toolkitElements.appendChild(outerElement);
        let currentItem: ToolbarItems;
        for (let i: number = 1; i <= length; i++) {
            currentItem = toolboxItems[i - 1];
            element = render.createGroup({
                transform: 'translate(' + xPosition + ',' + (this.isDevice ? spacing : (spacing + 3)) + ')'
            });
            // for desktop toolkit hight is 32 and top padding is 8 icon size 16
            switch (currentItem) {
                case 'Pan': toolkit.createPanButton(element, this.toolkitElements, chart); break;
                case 'Zoom': toolkit.createZoomButton(element, this.toolkitElements, chart); break;
                case 'ZoomIn': toolkit.createZoomInButton(element, this.toolkitElements, chart); break;
                case 'ZoomOut': toolkit.createZoomOutButton(element, this.toolkitElements, chart); break;
                case 'Reset': toolkit.createResetButton(element, this.toolkitElements, chart, this.isDevice); break;
            }
            xPosition += iconSize + (spacing * 2);
        }
        this.toolkitElements.setAttribute('opacity', this.isDevice ? '1' : '' + this.zoomkitOpacity);
        this.toolkitElements.setAttribute('cursor', 'auto');
        chart.svgObject.appendChild(this.toolkitElements);
        if (!this.isDevice) {
            EventHandler.add(this.toolkitElements, 'mousemove touchstart', this.zoomToolkitMove, this);
            EventHandler.add(this.toolkitElements, 'mouseleave touchend', this.zoomToolkitLeave, this);
            if (this.isPanning) {
                toolkit.pan();
            }
        }

        return true;
    }
    /**
     * To the show the zooming toolkit.
     * @return {void}
     * @private
     */
    public applyZoomToolkit(chart: Chart, axes: AxisModel[]): void {
        let showToolkit: boolean = this.isAxisZoomed(axes);
        if (showToolkit) {
            this.showZoomingToolkit(chart);
            this.isZoomed = true;
        } else {
            this.toolkit.removeTooltip();
            this.isPanning = false;
            this.isZoomed = false;
            chart.svgObject.setAttribute('cursor', 'auto');
        }
    }

    /**
     * Return boolean property to show zooming toolkit.
     * @return {void}
     * @private
     */
    public isAxisZoomed(axes: AxisModel[]): boolean {
        let showToolkit: boolean = false;
        axes.forEach((axis: Axis) => {
            showToolkit = (showToolkit || (axis.zoomFactor !== 1 || axis.zoomPosition !== 0));
        });

        return showToolkit;
    }

    private zoomToolkitMove(e: PointerEvent): boolean {
        let element: HTMLElement = <HTMLElement>this.toolkitElements;
        let opacity: number = +element.getAttribute('opacity');
        this.zoomkitOpacity = 1;
        element.setAttribute('opacity', '' + this.zoomkitOpacity);
        return false;
    }

    private zoomToolkitLeave(e: PointerEvent): boolean {
        let element: HTMLElement = <HTMLElement>this.toolkitElements;
        this.zoomkitOpacity = 0.3;
        element.setAttribute('opacity', '' + this.zoomkitOpacity);
        return false;
    }
    /**
     * @hidden
     */
    public addEventListener(): void {
        if (this.chart.isDestroyed) { return; }
        EventHandler.add(this.chart.element, this.wheelEvent, this.chartMouseWheel, this);
        this.chart.on(Browser.touchMoveEvent, this.mouseMoveHandler, this);
        this.chart.on(Browser.touchStartEvent, this.mouseDownHandler, this);
        this.chart.on(Browser.touchEndEvent, this.mouseUpHandler, this);
        this.chart.on(this.cancelEvent, this.mouseCancelHandler, this);
    }
    /**
     * @hidden
     */
    public removeEventListener(): void {
        if (this.chart.isDestroyed) { return; }
        EventHandler.remove(this.chart.element, this.wheelEvent, this.chartMouseWheel);
        this.chart.off(Browser.touchMoveEvent, this.mouseMoveHandler);
        this.chart.off(Browser.touchStartEvent, this.mouseDownHandler);
        this.chart.off(Browser.touchEndEvent, this.mouseUpHandler);
        this.chart.off(this.cancelEvent, this.mouseCancelHandler);
    }

    /**
     * Handles the mouse wheel on chart. 
     * @return {boolean}
     * @private
     */
    public chartMouseWheel(e: WheelEvent): boolean {
        let chart: Chart = this.chart;
        let offset: ClientRect = chart.element.getBoundingClientRect();
        let svgRect: ClientRect = getElement(chart.element.id + '_svg').getBoundingClientRect();
        let mouseX: number = (e.clientX - offset.left) - Math.max(svgRect.left - offset.left, 0);
        let mouseY: number = (e.clientY - offset.top) - Math.max(svgRect.top - offset.top, 0);

        if (this.zooming.enableMouseWheelZooming &&
            withInBounds(mouseX, mouseY, chart.chartAxisLayoutPanel.seriesClipRect)) {
            e.preventDefault();
            this.performMouseWheelZooming(e, mouseX, mouseY, chart, chart.axisCollections);
        }
        return false;
    }
    /**
     * @hidden
     */
    private mouseMoveHandler(e: PointerEvent | TouchEvent): void {
        //Zooming for chart
        let chart: Chart = this.chart;
        let touches: TouchList = null;
        if (e.type === 'touchmove') {
            if (e.preventDefault && this.isIOS &&
                (this.isPanning || (chart.isDoubleTap)
                 || (this.zooming.enablePinchZooming && this.touchStartList.length > 1))) {
                e.preventDefault();
            }
            touches = (<TouchEvent & PointerEvent>e).touches;
        }
        if (chart.isChartDrag) {
            if (chart.isTouch) {
                this.touchMoveList = this.addTouchPointer(<ITouches[]>this.touchMoveList, (<PointerEvent>e), touches);
                if (this.zooming.enablePinchZooming && this.touchMoveList.length > 1
                    && this.touchStartList.length > 1) {
                    this.performPinchZooming(<TouchEvent>e, chart);
                }
            }
            this.renderZooming(e, chart, chart.isTouch);
        }
    }
    /**
     * @hidden
     */
    private mouseDownHandler(e: PointerEvent): void {
        //Zooming for chart
        let chart: Chart = this.chart;
        let touches: TouchList = null;
        let target: Element;
        if (e.type === 'touchstart') {
            touches = (<TouchEvent & PointerEvent>e).touches;
            target = <Element>(<TouchEvent & PointerEvent>e).target;
        } else {
            target = <Element>e.target;
        }
        if (target.id.indexOf(chart.element.id + '_Zooming_') === -1 &&
            withInBounds(chart.previousMouseMoveX, chart.previousMouseMoveY, chart.chartAxisLayoutPanel.seriesClipRect)) {
            chart.isChartDrag = true;
        }
        if (chart.isTouch) {
            this.touchStartList = this.addTouchPointer(<ITouches[]>this.touchStartList, e, touches);
        }
    }
    /**
     * @hidden
     */
    private mouseUpHandler(e: PointerEvent): void {
        let chart: Chart = this.chart;
        let performZoomRedraw: boolean = (<Element>e.target).id.indexOf(chart.element.id + '_ZoomOut_') === -1 ||
            (<Element>e.target).id.indexOf(chart.element.id + '_ZoomIn_') === -1;
        if (chart.isChartDrag || performZoomRedraw) {
            this.performZoomRedraw(chart);
        }
        if (chart.isTouch) {
            if (chart.isDoubleTap && withInBounds(chart.mouseX, chart.mouseY, chart.chartAxisLayoutPanel.seriesClipRect)
                && this.touchStartList.length === 1 && this.isZoomed) {
                this.toolkit.reset();
            }
            this.touchStartList = [];
            chart.isDoubleTap = false;
        }
    }
    /**
     * @hidden
     */
    private mouseCancelHandler(e: PointerEvent): void {
        if (this.isZoomed) {
            this.performZoomRedraw(this.chart);
        }
        this.pinchTarget = null;
        this.touchStartList = [];
        this.touchMoveList = [];
    }
    /**
     * Handles the touch pointer. 
     * @return {boolean}
     * @private
     */
    public addTouchPointer(touchList: ITouches[], e: PointerEvent, touches: TouchList): ITouches[] {
        if (touches) {
            touchList = [];
            for (let i: number = 0, length: number = touches.length; i < length; i++) {
                touchList.push({ pageX: touches[i].clientX, pageY: touches[i].clientY, pointerId: null });
            }
        } else {
            touchList = touchList ? touchList : [];
            if (touchList.length === 0) {
                touchList.push({ pageX: e.clientX, pageY: e.clientY, pointerId: e.pointerId });
            } else {
                for (let i: number = 0, length: number = touchList.length; i < length; i++) {
                    if (touchList[i].pointerId === e.pointerId) {
                        touchList[i] = { pageX: e.clientX, pageY: e.clientY, pointerId: e.pointerId };
                    } else {
                        touchList.push({ pageX: e.clientX, pageY: e.clientY, pointerId: e.pointerId });
                    }
                }
            }
        }
        return touchList;
    }
    /**
     * Get module name.
     */
    protected getModuleName(): string {
        // Returns te module name
        return 'Zoom';
    }
    /**
     * To destroy the zooming. 
     * @return {void}
     * @private
     */
    public destroy(chart: Chart): void {
        // Destroy method performed here
        this.removeEventListener();
    }

}