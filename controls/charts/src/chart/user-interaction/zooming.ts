import { Chart } from '../chart';
import { EventHandler, Browser, createElement } from '@syncfusion/ej2-base';
import { getRectLocation, minMax, getElement, ChartLocation, RectOption } from '../../common/utils/helper';
import { Rect, measureText, SvgRenderer, CanvasRenderer } from '@syncfusion/ej2-svg-base';
import { Axis } from '../axis/axis';
import { Toolkit } from './zooming-toolkit';
import { AxisModel } from '../axis/axis-model';
import { VisibleRangeModel } from '../../common/model/interface';
import { ZoomMode, ToolbarItems } from '../utils/enum';
import { ZoomSettingsModel } from '../chart-model';
import { CartesianAxisLayoutPanel } from '../axis/cartesian-panel';
import { IZoomCompleteEventArgs, ITouches, IZoomAxisRange, IAxisData, IZoomingEventArgs } from '../../chart/model/chart-interface';
import { zoomComplete, onZooming } from '../../common/model/constants';
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
    public isPointer: boolean;
    /** @private */
    public pinchTarget: Element;
    /** @private */
    public isDevice: boolean;
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
    public isIOS: boolean;
    /** @private */
    public performedUI: boolean;
    private zoomkitOpacity: number;
    private wheelEvent: string;
    private cancelEvent: string;
    private zoomCompleteEvtCollection: IZoomCompleteEventArgs[] = [];

    /**
     * Constructor for Zooming module.
     *
     * @private
     */

    constructor(chart: Chart) {
        this.chart = chart;
        this.isPointer = Browser.isPointer;
        this.browserName = Browser.info.name;
        this.wheelEvent = this.browserName === 'mozilla' ? (this.isPointer ? 'mousewheel' : 'DOMMouseScroll') : 'mousewheel';
        this.cancelEvent = this.isPointer ? 'pointerleave' : 'mouseleave';
        this.addEventListener();
        this.isDevice = Browser.isDevice;
        const zooming: ZoomSettingsModel = chart.zoomSettings;
        this.toolkit = new Toolkit(chart);
        this.zooming = zooming;
        this.elementId = chart.element.id;
        this.zoomingRect = new Rect(0, 0, 0, 0);
        this.zoomAxes = [];
        this.zoomkitOpacity = 1;
        this.isIOS = Browser.isIos || Browser.isIos7;
        this.isZoomed = this.performedUI = this.zooming.enablePan ||
            ((this.chart.primaryXAxis.zoomFactor < 1 && this.chart.primaryXAxis.zoomPosition > 0) ||
                (this.chart.primaryYAxis.zoomFactor < 1 && this.chart.primaryYAxis.zoomPosition > 0) || this.isAxisZoomed(this.chart.axes));
        if (zooming.enableScrollbar) {
            chart.scrollElement = createElement(
                'div', { id: chart.element.id + '_scrollElement' }
            );
        }
    }

    /**
     * Renders the zooming functionality for the chart.
     *
     * @param {PointerEvent | TouchEvent} e - The pointer or touch event.
     * @param {Chart} chart - The chart instance.
     * @param {boolean} isTouch - Indicates whether the event is a touch event.
     * @returns {void}
     */
    public renderZooming(e: PointerEvent | TouchEvent, chart: Chart, isTouch: boolean): void {
        this.calculateZoomAxesRange(chart);
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
        const areaBounds: Rect = chart.chartAxisLayoutPanel.seriesClipRect;
        const startLocation: ChartLocation = new ChartLocation(chart.previousMouseMoveX, chart.previousMouseMoveY);
        const endLocation: ChartLocation = new ChartLocation(chart.mouseX, chart.mouseY);
        const rect: Rect = this.zoomingRect = getRectLocation(startLocation, endLocation, areaBounds);
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
            const svg: Element = chart.enableCanvas ? document.getElementById(this.elementId + '_tooltip_svg') : chart.svgObject;
            svg.appendChild(chart.svgRenderer.drawRectangle(new RectOption(
                this.elementId + '_ZoomArea', chart.themeStyle.selectionRectFill,
                { color: chart.themeStyle.selectionRectStroke, width: 1 }, 1, rect, 0, 0, '', '3')
            ) as HTMLElement);
        }
    }

    // Panning performed here
    public doPan(chart: Chart, axes: AxisModel[], xDifference: number = 0, yDifference: number = 0): void {
        if (chart.startMove && chart.crosshair.enable) {
            return null;
        }
        let currentScale: number;
        let offset: number;
        this.isZoomed = true;
        this.offset = !chart.delayRedraw ? chart.chartAxisLayoutPanel.seriesClipRect : this.offset;
        chart.delayRedraw = true;
        this.zoomCompleteEvtCollection = [];
        chart.disableTrackTooltip = true;
        let argsData: IZoomCompleteEventArgs;
        const zoomedAxisCollection: IAxisData[] = [];
        for (const axis of (axes as Axis[])) {
            argsData = {
                cancel: false, name: zoomComplete, axis: axis, previousZoomFactor: axis.zoomFactor,
                previousZoomPosition: axis.zoomPosition, currentZoomFactor: axis.zoomFactor,
                currentZoomPosition: axis.zoomPosition, previousVisibleRange: axis.visibleRange,
                currentVisibleRange: null
            };
            currentScale = Math.max(1 / minMax(axis.zoomFactor, 0, 1), 1);
            if (axis.orientation === 'Horizontal') {
                offset = (xDifference !== 0 ? xDifference : (chart.previousMouseMoveX - chart.mouseX)) / axis.rect.width / currentScale;
                argsData.currentZoomPosition = minMax(axis.zoomPosition + offset, 0, (1 - axis.zoomFactor));
            } else {
                offset = (yDifference !== 0 ? yDifference : (chart.previousMouseMoveY - chart.mouseY)) / axis.rect.height / currentScale;
                argsData.currentZoomPosition = minMax(axis.zoomPosition - offset, 0, (1 - axis.zoomFactor));
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
        }
        const zoomingEventArgs: IZoomingEventArgs = { cancel: false, axisCollection: zoomedAxisCollection, name: onZooming };
        if (!zoomingEventArgs.cancel && this.chart.isBlazor) {
            this.chart.trigger(onZooming, zoomingEventArgs, () => {
                if (zoomingEventArgs.cancel) {
                    this.zoomCancel(axes, this.zoomCompleteEvtCollection);
                }
                else {
                    this.performDefferedZoom(chart);
                }
            });
        } else {
            this.chart.trigger(onZooming, zoomingEventArgs, () => {
                if (zoomingEventArgs.cancel) {
                    this.zoomCancel(axes, this.zoomCompleteEvtCollection);
                }
                else {
                    this.performDefferedZoom(chart);
                    this.redrawOnZooming(chart, false);
                }
            });
        }
    }

    private performDefferedZoom(chart: Chart): void {
        let translateX: number;
        let translateY: number;
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
            if (chart.enableCanvas) {
                this.performZoomRedraw(chart);
            }
        } else {
            this.performZoomRedraw(chart);
        }
        chart.previousMouseMoveX = chart.mouseX;
        chart.previousMouseMoveY = chart.mouseY;
    }

    /**
     * Redraw the chart on zooming.
     *
     * @param {Chart} chart - The chart instance.
     * @returns {void}
     * @private
     */
    public performZoomRedraw(chart: Chart): void {
        const rect: Rect = this.zoomingRect;
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
                if (chart.enableCanvas) {
                    chart.createChartSvg();
                }
                else {
                    chart.removeSvg();
                }
                // chart.enableCanvas ? chart.createChartSvg() : chart.removeSvg();
                chart.refreshAxis();
                chart.refreshBound();
            }
        }
    }

    private refreshAxis(layout: CartesianAxisLayoutPanel, chart: Chart, axes: AxisModel[]): void {
        const mode: ZoomMode = chart.zoomSettings.mode;
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
        const zoomRect: Rect = this.zoomingRect;
        const mode: ZoomMode = this.zooming.mode;
        let argsData: IZoomCompleteEventArgs;
        this.isPanning = chart.zoomSettings.enablePan || this.isPanning;
        const zoomedAxisCollections: IAxisData[] = []; this.zoomCompleteEvtCollection = [];
        for (const axis of (axes as Axis[])) {
            argsData = {
                cancel: false, name: zoomComplete, axis: axis,
                previousZoomFactor: axis.zoomFactor,
                previousZoomPosition: axis.zoomPosition,
                currentZoomFactor: axis.zoomFactor,
                currentZoomPosition: axis.zoomPosition,
                previousVisibleRange: axis.visibleRange, currentVisibleRange: null
            };
            if (axis.orientation === 'Horizontal') {
                if (mode !== 'Y') {
                    argsData.currentZoomPosition += Math.abs((zoomRect.x - bounds.x) / (bounds.width)) * axis.zoomFactor;
                    argsData.currentZoomFactor *= (zoomRect.width / bounds.width);
                }
            } else {
                if (mode !== 'X') {
                    argsData.currentZoomPosition += (1 - Math.abs((zoomRect.height + (zoomRect.y - bounds.y)) / (bounds.height)))
                        * axis.zoomFactor;
                    argsData.currentZoomFactor *= (zoomRect.height / bounds.height);
                }
            }
            if (parseFloat(argsData.currentZoomFactor.toFixed(3)) <= 0.001) {
                argsData.currentZoomFactor = argsData.previousZoomFactor;
                argsData.currentZoomPosition = argsData.previousZoomPosition;
            }
            if (!argsData.cancel) {
                axis.zoomFactor = argsData.currentZoomFactor;
                axis.zoomPosition = argsData.currentZoomPosition;
                this.zoomCompleteEvtCollection.push(argsData);
            }
            zoomedAxisCollections.push({
                zoomFactor: axis.zoomFactor, zoomPosition: axis.zoomFactor, axisName: axis.name,
                axisRange: axis.visibleRange
            });
        }

        const onZoomingEventArg: IZoomingEventArgs = { cancel: false, axisCollection: zoomedAxisCollections, name: onZooming };
        if (!onZoomingEventArg.cancel && this.chart.isBlazor) {
            this.chart.trigger(onZooming, onZoomingEventArg, () => {
                if (onZoomingEventArg.cancel) {
                    this.zoomCancel(axes, this.zoomCompleteEvtCollection);
                }
                else {
                    this.zoomingRect = new Rect(0, 0, 0, 0);
                    this.performZoomRedraw(chart);
                }
            });
        } else {
            this.chart.trigger(onZooming, onZoomingEventArg, () => {
                if (onZoomingEventArg.cancel) {
                    this.zoomCancel(axes, this.zoomCompleteEvtCollection);
                }
                else {
                    this.zoomingRect = new Rect(0, 0, 0, 0);
                    this.redrawOnZooming(chart);
                }
            });
        }
    }

    /**
     * Redraws the chart on zooming.
     *
     * @param {Chart} chart - The chart instance.
     * @param {boolean} [isRedraw=true] - Indicates whether to redraw the chart.
     * @param {boolean} [isMouseUp=false] - Indicates whether the mouse button is released.
     * @returns {void}
     */
    private redrawOnZooming(chart: Chart, isRedraw: boolean = true, isMouseUp: boolean = false): void {
        const zoomCompleteCollection: IZoomCompleteEventArgs[] = isMouseUp ? this.toolkit.zoomCompleteEvtCollection :
            this.zoomCompleteEvtCollection;
        if (isRedraw) {
            this.performZoomRedraw(chart);
        }
        let argsData: IZoomCompleteEventArgs;
        for (let i: number = 0; i < zoomCompleteCollection.length; i++) {
            if (!zoomCompleteCollection[i as number].cancel) {
                argsData = {
                    cancel: false, name: zoomComplete,
                    axis: chart.axisCollections[i as number],
                    previousZoomFactor: zoomCompleteCollection[i as number].previousZoomFactor,
                    previousZoomPosition: zoomCompleteCollection[i as number].previousZoomPosition,
                    currentZoomFactor: chart.axisCollections[i as number].zoomFactor,
                    currentZoomPosition: chart.axisCollections[i as number].zoomPosition,
                    currentVisibleRange: chart.axisCollections[i as number].visibleRange,
                    previousVisibleRange: zoomCompleteCollection[i as number].previousVisibleRange
                };
                chart.trigger(zoomComplete, argsData);
            }
        }
    }

    /**
     * Performs mouse wheel zooming on the chart.
     *
     * @param {WheelEvent} e - The wheel event.
     * @param {number} mouseX - The X-coordinate of the mouse pointer.
     * @param {number} mouseY - The Y-coordinate of the mouse pointer.
     * @param {Chart} chart - The chart instance.
     * @param {AxisModel[]} axes - The axes in the chart.
     * @returns {void}
     */
    public performMouseWheelZooming(e: WheelEvent, mouseX: number, mouseY: number, chart: Chart, axes: AxisModel[]): void {
        const direction: number = (this.browserName === 'mozilla' && !this.isPointer) ?
            -(e.detail) / 3 > 0 ? 1 : -1 : (e['wheelDelta'] > 0 ? 1 : -1);
        const mode: ZoomMode = this.zooming.mode;
        let origin: number = 0.5;
        let cumulative: number;
        let zoomFactor: number;
        let zoomPosition: number;
        this.isZoomed = true;
        this.calculateZoomAxesRange(chart);
        chart.disableTrackTooltip = true;
        this.performedUI =  true;
        this.isPanning = chart.zoomSettings.enablePan || this.isPanning;
        this.zoomCompleteEvtCollection = [];
        let argsData: IZoomCompleteEventArgs;
        const zoomedAxisCollection: IAxisData[] = [];
        for (const axis of (axes as Axis[])) {
            argsData = {
                cancel: false, name: zoomComplete, axis: axis, previousZoomFactor: axis.zoomFactor,
                previousZoomPosition: axis.zoomPosition,
                currentZoomFactor: axis.zoomFactor,
                currentZoomPosition: axis.zoomPosition, currentVisibleRange: null,
                previousVisibleRange: axis.visibleRange
            };
            if ((axis.orientation === 'Vertical' && mode !== 'X') ||
                (axis.orientation === 'Horizontal' && mode !== 'Y')) {
                cumulative = Math.max(Math.max(1 / minMax(axis.zoomFactor, 0, 1), 1) + (0.25 * direction), 1);
                cumulative = (cumulative > 50000000000) ? 50000000000 : cumulative;
                if (cumulative >= 1) {
                    origin = axis.orientation === 'Horizontal' ? mouseX / axis.rect.width : 1 - (mouseY / axis.rect.height);
                    origin = origin > 1 ? 1 : origin < 0 ? 0 : origin;
                    zoomFactor = (cumulative === 1) ? 1 : minMax((direction > 0 ? 0.9 : 1.1) / cumulative, 0, 1);
                    zoomPosition = (cumulative === 1) ? 0 : axis.zoomPosition + ((axis.zoomFactor - zoomFactor) * origin);
                    if (axis.zoomPosition !== zoomPosition || axis.zoomFactor !== zoomFactor) {
                        zoomFactor = (zoomPosition + zoomFactor) > 1 ? (1 - zoomPosition) : zoomFactor;
                    }
                    argsData.currentZoomFactor = zoomFactor;
                    argsData.currentZoomPosition = zoomPosition;
                }
                if (argsData.currentZoomFactor === argsData.previousZoomFactor &&
                    argsData.currentZoomPosition === argsData.previousZoomPosition) {
                    chart.disableTrackTooltip = false;
                }
                if (!argsData.cancel) {
                    axis.zoomFactor = argsData.currentZoomFactor;
                    axis.zoomPosition = argsData.currentZoomPosition;
                    this.zoomCompleteEvtCollection.push(argsData);
                }
            }
            zoomedAxisCollection.push({
                zoomFactor: axis.zoomFactor, zoomPosition: axis.zoomFactor, axisName: axis.name,
                axisRange: axis.visibleRange
            });
        }
        const onZoomingEventArgs: IZoomingEventArgs = { cancel: false, axisCollection: zoomedAxisCollection, name: onZooming };
        if (!onZoomingEventArgs.cancel && this.chart.isBlazor) {
            this.chart.trigger(onZooming, onZoomingEventArgs, () => {
                if (onZoomingEventArgs.cancel) {
                    this.zoomCancel(axes, this.zoomCompleteEvtCollection);
                }
                else {
                    this.performZoomRedraw(chart);
                }
            });
        } else {
            this.chart.trigger(onZooming, onZoomingEventArgs, () => {
                if (onZoomingEventArgs.cancel) {
                    this.zoomCancel(axes, this.zoomCompleteEvtCollection);
                }
                else {
                    this.redrawOnZooming(chart);
                }
            });
        }
    }

    /**
     * Performs pinch zooming on the chart.
     *
     * @param {TouchEvent} e - The touch event.
     * @param {Chart} chart - The chart instance.
     * @returns {boolean} - Indicates whether pinch zooming is performed.
     */
    public performPinchZooming(e: TouchEvent, chart: Chart): boolean {
        if ((this.zoomingRect.width > 0 && this.zoomingRect.height > 0) || (chart.startMove && chart.crosshair.enable)) {
            return false;
        }
        this.calculateZoomAxesRange(chart);
        this.isZoomed = true;
        this.isPanning = true;
        this.performedUI = true;
        this.offset = !chart.delayRedraw ? chart.chartAxisLayoutPanel.seriesClipRect : this.offset;
        chart.delayRedraw = true;
        chart.disableTrackTooltip = true;
        const elementOffset: ClientRect = chart.element.getBoundingClientRect();
        const touchDown: TouchList = <TouchList>this.touchStartList;
        const touchMove: TouchList = <TouchList>this.touchMoveList;
        const touch0StartX: number = touchDown[0].pageX - elementOffset.left;
        const touch0StartY: number = touchDown[0].pageY - elementOffset.top;
        const touch0EndX: number = touchMove[0].pageX - elementOffset.left;
        const touch0EndY: number = touchMove[0].pageY - elementOffset.top;
        const touch1StartX: number = touchDown[1].pageX - elementOffset.left;
        const touch1StartY: number = touchDown[1].pageY - elementOffset.top;
        const touch1EndX: number = touchMove[1].pageX - elementOffset.left;
        const touch1EndY: number = touchMove[1].pageY - elementOffset.top;
        const scaleX: number = Math.abs(touch0EndX - touch1EndX) / Math.abs(touch0StartX - touch1StartX);
        const scaleY: number = Math.abs(touch0EndY - touch1EndY) / Math.abs(touch0StartY - touch1StartY);
        const clipX: number = ((this.offset.x - touch0EndX) / scaleX) + touch0StartX;
        const clipY: number = ((this.offset.y - touch0EndY) / scaleY) + touch0StartY;
        const pinchRect: Rect = new Rect(clipX, clipY, this.offset.width / scaleX, this.offset.height / scaleY);
        const translateXValue: number = (touch0EndX - (scaleX * touch0StartX));
        const translateYValue: number = (touch0EndY - (scaleY * touch0StartY));
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
        if (!this.calculatePinchZoomFactor(chart, pinchRect)) {
            this.refreshAxis(<CartesianAxisLayoutPanel>chart.chartAxisLayoutPanel, chart, chart.axisCollections);
            this.redrawOnZooming(chart, false);
        }
        return true;
    }

    private calculatePinchZoomFactor(chart: Chart, pinchRect: Rect): boolean {
        const mode: ZoomMode = this.zooming.mode;
        let selectionMin: number;
        let selectionMax: number;
        let rangeMin: number;
        let rangeMax: number;
        let value: number;
        let axisTrans: number;
        let argsData: IZoomCompleteEventArgs;
        let currentZF: number;
        let currentZP: number;
        const zoomedAxisCollection: IAxisData[] = [];
        this.zoomCompleteEvtCollection = [];
        for (let index: number = 0; index < chart.axisCollections.length; index++) {
            const axis: Axis = chart.axisCollections[index as number];
            if ((axis.orientation === 'Horizontal' && mode !== 'Y') ||
                (axis.orientation === 'Vertical' && mode !== 'X')) {
                currentZF = axis.zoomFactor;
                currentZP = axis.zoomPosition;
                argsData = {
                    cancel: false, name: zoomComplete, axis: axis, previousZoomFactor: axis.zoomFactor,
                    previousZoomPosition: axis.zoomPosition, currentZoomFactor: currentZF,
                    currentZoomPosition: currentZP, previousVisibleRange: axis.visibleRange,
                    currentVisibleRange: null
                };
                if (axis.orientation === 'Horizontal') {
                    value = pinchRect.x - this.offset.x;
                    axisTrans = axis.rect.width / this.zoomAxes[index as number].delta;
                    rangeMin = value / axisTrans + this.zoomAxes[index as number].min;
                    value = pinchRect.x + pinchRect.width - this.offset.x;
                    rangeMax = value / axisTrans + this.zoomAxes[index as number].min;
                } else {
                    value = pinchRect.y - this.offset.y;
                    axisTrans = axis.rect.height / this.zoomAxes[index as number].delta;
                    rangeMin = (value * -1 + axis.rect.height) / axisTrans + this.zoomAxes[index as number].min;
                    value = pinchRect.y + pinchRect.height - this.offset.y;
                    rangeMax = (value * -1 + axis.rect.height) / axisTrans + this.zoomAxes[index as number].min;
                }
                selectionMin = Math.min(rangeMin, rangeMax);
                selectionMax = Math.max(rangeMin, rangeMax);
                currentZP = (selectionMin - this.zoomAxes[index as number].actualMin) / this.zoomAxes[index as number].actualDelta;
                currentZF = (selectionMax - selectionMin) / this.zoomAxes[index as number].actualDelta;
                argsData.currentZoomPosition = currentZP < 0 ? 0 : currentZP;
                argsData.currentZoomFactor = currentZF > 1 ? 1 : (currentZF < 0.03) ? 0.03 : currentZF;
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
        const onZoomingEventArgs: IZoomingEventArgs = { cancel: false, axisCollection: zoomedAxisCollection, name: onZooming };
        if (!onZoomingEventArgs.cancel) {
            this.chart.trigger(onZooming, onZoomingEventArgs);
            if (onZoomingEventArgs.cancel) {
                this.zoomCancel(chart.axisCollections, this.zoomCompleteEvtCollection);
                return true;
            }
        }
        return false;
    }

    // Series transformation style applied here.
    private setTransform(transX: number, transY: number, scaleX: number, scaleY: number, chart: Chart, isPinch: boolean): void {
        if (!chart.enableCanvas) {
            chart.seriesElements.setAttribute('clip-path', 'url(#' + this.elementId + '_ChartAreaClipRect_)');
        }
        if (chart.indicatorElements) {
            chart.indicatorElements.setAttribute('clip-path', 'url(#' + this.elementId + '_ChartAreaClipRect_)');
        }
        let translate: string;
        let xAxisLoc: number;
        let yAxisLoc: number;
        let element: Element;
        if (transX !== null && transY !== null) {
            for (const value of chart.visibleSeries) {
                xAxisLoc = chart.requireInvertedAxis ? value.yAxis.rect.x : value.xAxis.rect.x;
                yAxisLoc = chart.requireInvertedAxis ? value.xAxis.rect.y : value.yAxis.rect.y;
                translate = 'translate(' + (transX + (isPinch ? (scaleX * xAxisLoc) : xAxisLoc)) +
                    ',' + (transY + (isPinch ? (scaleY * yAxisLoc) : yAxisLoc)) + ')';
                translate = (scaleX || scaleY) ? translate + ' scale(' + scaleX + ' ' + scaleY + ')' : translate;
                if (value.visible) {
                    if (value.category === 'Indicator') {
                        (value.seriesElement.parentNode as HTMLInputElement).setAttribute('transform', translate);
                    } else {
                        if (!chart.enableCanvas) {
                            value.seriesElement.setAttribute('transform', translate);
                        }
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
            }
        }
    }

    private calculateZoomAxesRange(chart: Chart): void {
        let range: IZoomAxisRange;
        let axisRange: VisibleRangeModel;
        for (let index: number = 0; index < chart.axisCollections.length; index++) {
            const axis: Axis = chart.axisCollections[index as number];
            axisRange = axis.visibleRange;
            if (this.zoomAxes[index as number]) {
                if (!chart.delayRedraw) {
                    this.zoomAxes[index as number].min = axisRange.min;
                    this.zoomAxes[index as number].delta = axisRange.delta;
                }
            } else {
                range = {
                    actualMin: axis.actualRange.min,
                    actualDelta: axis.actualRange.delta,
                    min: axisRange.min,
                    delta: axisRange.delta
                };
                this.zoomAxes[index as number] = range;
            }
        }
    }
    // Zooming Toolkit created here
    private showZoomingToolkit(chart: Chart): boolean {
        let toolboxItems: ToolbarItems[] = this.zooming.toolbarItems;
        const areaBounds: Rect = chart.chartAxisLayoutPanel.seriesClipRect;
        const spacing: number = 10;
        const render: SvgRenderer | CanvasRenderer = chart.svgRenderer;
        const length: number = this.isDevice ? 1 : toolboxItems.length;
        const iconSize: number = this.isDevice ? measureText('Reset Zoom', { size: '12px' }, { size: '12px', fontStyle: 'Normal', fontWeight: '400', fontFamily: 'Segoe UI'}).width : 16;
        const height: number = this.isDevice ? measureText('Reset Zoom', { size: '12px' }, { size: '12px', fontStyle: 'Normal', fontWeight: '400', fontFamily: 'Segoe UI'}).height : chart.theme.indexOf('Fluent2') > -1 ? 18 : 22;
        const width: number = (length * iconSize) + ((length + 1) * spacing) + ((length - 1) * spacing);
        const transX: number = areaBounds.x + areaBounds.width - width - spacing;
        const transY: number = (areaBounds.y + spacing);
        let xPosition: number = spacing;
        const toolkit: Toolkit = this.toolkit; let element: Element;
        let shadowElement: string = '<filter id="chart_shadow" height="130%"><feGaussianBlur in="SourceAlpha" stdDeviation="5"/>';
        shadowElement += '<feOffset dx="-3" dy="4" result="offsetblur"/><feComponentTransfer><feFuncA type="linear" slope="1"/>';
        shadowElement += '</feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
        if (length === 0 || getElement(this.elementId + '_Zooming_KitCollection')) {
            return false;
        }
        const defElement: Element = render.createDefs();
        toolboxItems = this.isDevice ? ['Reset'] : toolboxItems;
        defElement.innerHTML = shadowElement;
        this.toolkitElements = render.createGroup({
            id: this.elementId + '_Zooming_KitCollection',
            transform: 'translate(' + transX + ',' + transY + ')'
        });
        this.toolkitElements.appendChild(defElement);
        const zoomFillColor: string = this.chart.theme === 'Tailwind' ? '#F3F4F6' : this.chart.theme === 'Fluent' ? '#F3F2F1' :
            (this.chart.theme === 'Material3' ? '#FFFFFF' : this.chart.theme === 'Material3Dark' ? '#1C1B1F' : this.chart.theme === 'Fluent2' ? '#F5F5F5' : this.chart.theme === 'Fluent2Dark' ? '#141414' : '#fafafa');
        this.toolkitElements.appendChild(render.drawRectangle(new RectOption(
            this.elementId + '_Zooming_Rect', zoomFillColor, { color: 'transparent', width: 1 },
            1, new Rect(0, 0, width, (height + (spacing * 2))), 4, 4
        )) as HTMLElement);
        const outerElement: Element = render.drawRectangle(new RectOption(
            this.elementId + '_Zooming_Rect', zoomFillColor, { color: 'transparent', width: 1 },
            0.1, new Rect(0, 0, width, (height + (spacing * 2))), 4, 4
        ));
        if (this.chart.theme === 'Tailwind' || this.chart.theme === 'TailwindDark') {
            outerElement.setAttribute('box-shadow', '0px 1px 2px rgba(0, 0, 0, 0.06), 0px 1px 3px rgba(0, 0, 0, 0.1)');
        }
        else if (this.chart.theme === 'Material3' || this.chart.theme === 'Material3Dark' || this.chart.theme === 'Fluent2' || this.chart.theme === 'Fluent2Dark') {
            outerElement.setAttribute('filter', 'drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.15)) drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.3))');
            outerElement.setAttribute('fill', this.chart.theme === 'Material3' ? '#FFFFFF' : this.chart.theme === 'Fluent2' ? '#F5F5F5' : '#1C1B1F');
            outerElement.setAttribute('rx', '4px');
            outerElement.setAttribute('ry', '4px');
            outerElement.setAttribute('opacity', '1');
        }
        else {
            outerElement.setAttribute('filter', 'url(#chart_shadow)');
        }
        this.toolkitElements.appendChild(outerElement);
        let currentItem: ToolbarItems;
        let panIcon: boolean = false;
        for (let i: number = 1; i <= length; i++) {
            currentItem = toolboxItems[i - 1];
            element = render.createGroup({
                transform: 'translate(' + xPosition + ',' + (this.isDevice ? spacing : chart.theme.indexOf('Fluent2') > -1 ? (spacing + 1) : (spacing + 3)) + ')'
            });
            // for desktop toolkit hight is 32 and top padding is 8 icon size 16
            switch (currentItem) {
            case 'Pan': toolkit.createPanButton(element, this.toolkitElements); panIcon = true; break;
            case 'Zoom': toolkit.createZoomButton(element, this.toolkitElements); break;
            case 'ZoomIn': toolkit.createZoomInButton(element, this.toolkitElements, chart); break;
            case 'ZoomOut': toolkit.createZoomOutButton(element, this.toolkitElements, chart); break;
            case 'Reset': toolkit.createResetButton(element, this.toolkitElements, chart, this.isDevice); break;
            }
            xPosition += iconSize + (spacing * 2);
        }
        this.toolkitElements.setAttribute('opacity', this.isDevice ? '1' : '' + this.zoomkitOpacity);
        this.toolkitElements.setAttribute('cursor', 'auto');
        if (chart.enableCanvas) {
            const zoomDiv: HTMLElement = document.createElement('div');
            zoomDiv.id = chart.element.id + '_zoom';
            zoomDiv.style.cssText = 'position:absolute; z-index:1';
            const zoomheight: number = chart.availableSize.height / 2;
            const svg: Element = chart.svgRenderer.createSvg({
                id: chart.element.id + '_zoomkit_svg',
                width: chart.availableSize.width,
                height: zoomheight
            });
            (svg as SVGElement).style.position = 'absolute';
            svg.appendChild(this.toolkitElements);
            zoomDiv.appendChild(svg);
            document.getElementById(this.elementId + '_Secondary_Element').appendChild(zoomDiv);
        } else {
            chart.svgObject.appendChild(this.toolkitElements);
        }
        if (!this.isDevice) {
            EventHandler.add(this.toolkitElements, 'mousemove touchstart', this.zoomToolkitMove, this);
            EventHandler.add(this.toolkitElements, 'mouseleave touchend', this.zoomToolkitLeave, this);
            if (this.isPanning && panIcon) {
                toolkit.pan();
            }
        }

        return true;
    }
    /**
     * Applies the zoom toolkit on the chart.
     *
     * @param {Chart} chart - The chart instance.
     * @param {AxisModel[]} axes - The axis models.
     * @returns {void}
     */
    public applyZoomToolkit(chart: Chart, axes: AxisModel[]): void {
        const showToolkit: boolean = this.isAxisZoomed(axes);
        if (showToolkit) {
            this.showZoomingToolkit(chart);
            this.isZoomed = true;
        }
        else if (chart.zoomSettings.showToolbar) {
            this.isZoomed = showToolkit;
            this.showZoomingToolkit(chart);
        }
        else {
            this.toolkit.removeTooltip();
            this.isPanning = false;
            this.isZoomed = false;
            chart.isZoomed = false;
            chart.svgObject.setAttribute('cursor', 'auto');
        }
    }

    /**
     * Cancels the zoom action.
     *
     * @param {AxisModel[]} axes - The axis models.
     * @param {IZoomCompleteEventArgs[]} zoomCompleteEventCollection - The collection of zoom complete events.
     * @returns {void}
     */
    public zoomCancel(axes: AxisModel[], zoomCompleteEventCollection: IZoomCompleteEventArgs[]): void {
        for (const zoomCompleteEvent of (zoomCompleteEventCollection as IZoomCompleteEventArgs[])) {
            for (const axis of (axes as Axis[])) {
                if (axis.name === zoomCompleteEvent.axis.name) {
                    axis.zoomFactor = zoomCompleteEvent.previousZoomFactor;
                    axis.zoomPosition = zoomCompleteEvent.previousZoomPosition;
                    axis.visibleRange = zoomCompleteEvent.previousVisibleRange;
                    break;
                }
            }
        }
    }

    /**
     * Checks if any of the axes is zoomed.
     *
     * @param {AxisModel[]} axes - The axis models.
     * @returns {boolean} - True if any axis is zoomed; otherwise, false.
     */
    public isAxisZoomed(axes: AxisModel[]): boolean {
        let showToolkit: boolean = false;
        for (const axis of (axes as Axis[])) {
            showToolkit = (showToolkit || (axis.zoomFactor !== 1 || axis.zoomPosition !== 0));
        }
        return showToolkit;
    }

    private zoomToolkitMove(): boolean {
        const element: HTMLElement = <HTMLElement>this.toolkitElements;
        this.zoomkitOpacity = 1;
        element.setAttribute('opacity', '' + this.zoomkitOpacity);
        return false;
    }

    private zoomToolkitLeave(): boolean {
        const element: HTMLElement = <HTMLElement>this.toolkitElements;
        this.zoomkitOpacity = 1;
        element.setAttribute('opacity', '' + this.zoomkitOpacity);
        return false;
    }
    /**
     * Adds event listeners for the chart.
     *
     * @returns {void}
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
     * Remove event listeners for the chart.
     *
     * @returns {void}
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
     * Handles the mouse wheel event on the chart.
     *
     * @param {WheelEvent} e - The wheel event.
     * @returns {boolean} - Returns false.
     */
    public chartMouseWheel(e: WheelEvent): boolean {
        const chart: Chart = this.chart;
        const offset: ClientRect = chart.element.getBoundingClientRect();
        const svgRect: ClientRect = getElement(chart.svgId).getBoundingClientRect();
        const mouseX: number = (e.clientX - offset.left) - Math.max(svgRect.left - offset.left, 0);
        const mouseY: number = (e.clientY - offset.top) - Math.max(svgRect.top - offset.top, 0);

        if (this.zooming.enableMouseWheelZooming &&
            withInBounds(mouseX, mouseY, chart.chartAxisLayoutPanel.seriesClipRect)) {
            e.preventDefault();
            this.performMouseWheelZooming(e, mouseX, mouseY, chart, chart.axisCollections);
        }
        return false;
    }
    /**
     * Handles the mouse move event on the chart.
     *
     * @param {PointerEvent | TouchEvent} e - The mouse move event or touch event.
     * @returns {void}
     * @private
     */
    private mouseMoveHandler(e: PointerEvent | TouchEvent): void {
        //Zooming for chart
        const chart: Chart = this.chart;
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
     * Handles the mouse down event on the chart.
     *
     * @param {PointerEvent} e - The mouse down event.
     * @returns {void}
     * @private
     */
    private mouseDownHandler(e: PointerEvent): void {
        //Zooming for chart
        const chart: Chart = this.chart;
        let touches: TouchList = null;
        let target: Element;
        if (e.type === 'touchstart') {
            touches = (<TouchEvent & PointerEvent>e).touches;
            target = <Element>(<TouchEvent & PointerEvent>e).target;
        } else {
            target = <Element>e.target;
        }
        if (target.id.indexOf(chart.element.id + '_Zooming_') === -1 &&
            (chart.zoomSettings.enablePinchZooming || chart.zoomSettings.enableSelectionZooming) &&
            withInBounds(chart.previousMouseMoveX, chart.previousMouseMoveY, chart.chartAxisLayoutPanel.seriesClipRect)) {
            chart.isChartDrag = true;
        }
        if (chart.isTouch) {
            this.touchStartList = this.addTouchPointer(<ITouches[]>this.touchStartList, e, touches);
        }
    }
    /**
     * Handles the mouse up event on the chart.
     *
     * @param {PointerEvent} e - The mouse up event.
     * @returns {void}
     * @private
     */
    private mouseUpHandler(e: PointerEvent): void {
        const chart: Chart = this.chart;
        const performZoomRedraw: boolean = (<Element>e.target).id.indexOf(chart.element.id + '_ZoomOut_') === -1 ||
            (<Element>e.target).id.indexOf(chart.element.id + '_ZoomIn_') === -1;
        if (chart.isChartDrag || performZoomRedraw) {
            this.redrawOnZooming(chart, true, true);
        }
        if (chart.isTouch) {
            if (chart.isDoubleTap && withInBounds(chart.mouseX, chart.mouseY, chart.chartAxisLayoutPanel.seriesClipRect)
                && this.touchStartList.length === 1 && this.isZoomed) {
                this.toolkit.reset(e);
            }
            this.touchStartList = [];
            chart.isDoubleTap = false;
        }
    }
    /**
     * Handles the mouse cancel event on the chart.
     *
     * @returns {void}
     * @private
     */
    private mouseCancelHandler(): void {
        if (this.isZoomed) {
            this.performZoomRedraw(this.chart);
        }
        this.pinchTarget = null;
        this.touchStartList = [];
        this.touchMoveList = [];
    }
    /**
     * Adds touch pointer to the touch list.
     *
     * @param {ITouches[]} touchList - The touch list.
     * @param {PointerEvent} e - The pointer event.
     * @param {TouchList} touches - The touch list.
     * @returns {ITouches[]} - The updated touch list.
     */
    public addTouchPointer(touchList: ITouches[], e: PointerEvent, touches: TouchList): ITouches[] {
        if (touches) {
            touchList = [];
            for (let i: number = 0, length: number = touches.length; i < length; i++) {
                touchList.push({ pageX: touches[i as number].clientX, pageY: touches[i as number].clientY, pointerId: null });
            }
        } else {
            touchList = touchList ? touchList : [];
            if (touchList.length === 0) {
                touchList.push({ pageX: e.clientX, pageY: e.clientY, pointerId: e.pointerId });
            } else {
                for (let i: number = 0, length: number = touchList.length; i < length; i++) {
                    if (touchList[i as number].pointerId === e.pointerId) {
                        touchList[i as number] = { pageX: e.clientX, pageY: e.clientY, pointerId: e.pointerId };
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
     *
     * @returns {string} - Returns the module name.
     */
    protected getModuleName(): string {
        // Returns te module name
        return 'Zoom';
    }
    /**
     * To destroy the zooming.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        // Destroy method performed here.
        this.removeEventListener();
    }

}
