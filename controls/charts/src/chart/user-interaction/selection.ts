/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-constant-condition */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable jsdoc/require-returns */
/* eslint-disable jsdoc/require-param */
/* eslint-disable valid-jsdoc */
/**
 * Selection src file
 */
import { Browser} from '@syncfusion/ej2-base';
import { remove } from '@syncfusion/ej2-base';
import { extend, isNullOrUndefined } from '@syncfusion/ej2-base';
import {
    ChartLocation, RectOption, CircleOption, withInBounds, getDraggedRectLocation,
    removeElement, getElement
} from '../../common/utils/helper';
import { Rect, SvgRenderer, CanvasRenderer, PathOption } from '@syncfusion/ej2-svg-base';
import { SelectionMode, HighlightMode } from '../../common/utils/enum';
import { Chart } from '../chart';
import { Series, Points } from '../series/chart-series';
import { SeriesModel } from '../series/chart-series-model';
import { Indexes, Index } from '../../common/model/base';
import { IDragCompleteEventArgs, ISelectionCompleteEventArgs } from '../../chart/model/chart-interface';
import { dragComplete, selectionComplete } from '../../common/model/constants';
import { BaseSelection } from '../../common/user-interaction/selection';

/**
 * `Selection` module handles the selection for chart.
 *
 * @private
 */
export class Selection extends BaseSelection {
    /** @private */
    public renderer: SvgRenderer | CanvasRenderer;
    /** @private */
    public isSeriesMode: boolean;
    private isdrawRect: boolean = true;
    private resizing: boolean;
    /** @private */
    public rectPoints: Rect;
    private closeIconId: string;
    private closeIcon: Element;
    private draggedRectGroup: string;
    private multiRectGroup: string;
    private draggedRect: string;
    private lassoPath: string;
    /** @private */
    public selectedDataIndexes: Indexes[];
    /** @private */
    public highlightDataIndexes: Indexes[];
    public multiDataIndexes: Points[][] = [];
    public pathIndex: number = 0;
    public seriesIndex: number = 0;
    /** @private */
    public series: Series[];
    private dragging: boolean;
    private count: number = -1;
    private isMultiDrag: boolean;
    private targetIndex: number;
    private dragRect: Rect;
    private dragRectArray: Rect [] = [];
    public filterArray: Rect [] = [];
    private totalSelectedPoints: { x: string, y: number }[][] = [];
    private rectGrabbing: boolean;
    private path: string;
    private resizeMode: number;
    /** @private */
    public chart: Chart;
    /** @private */
    public currentMode: SelectionMode | HighlightMode;
    /** @private */
    public previousSelectedEle: Element[];
    /**
     * Constructor for selection module.
     *
     * @private
     */

    constructor(chart: Chart) {
        super(chart);
        this.chart = chart;
        this.renderer = chart.renderer;
        const mode: SelectionMode = chart.selectionMode;
        this.isMultiDrag = chart.isMultiSelect && (mode.indexOf('Drag') > -1);
        this.addEventListener();
    }
    /**
     * Binding events for selection module.
     */
    private addEventListener(): void {
        if (this.chart.isDestroyed || (this.chart.stockChart && this.chart.stockChart.onPanning)) { return; }
        const cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        this.chart.on(Browser.touchMoveEvent, this.mouseMove, this);
        this.chart.on(cancelEvent, this.mouseLeave, this);
        this.chart.on('click', this.mouseClick, this);
        this.chart.on(Browser.touchStartEvent, this.mousedown, this);
        this.chart.on(Browser.touchEndEvent, this.mouseLeave, this);
    }
    /**
     * Chart mouse down
     */
    private mousedown(e: Event): void {
        const chart: Chart = this.chart;
        if (chart.isPointMouseDown || chart.selectionMode === 'None' || chart.isChartDrag) {
            return;
        }
        if (chart.isDoubleTap || !chart.isTouch || this.rectPoints) {
            this.dragStart(chart, chart.chartAxisLayoutPanel.seriesClipRect, chart.mouseDownX, chart.mouseDownY, e);
        }
    }
    /**
     * UnBinding events for selection module.
     */
    private removeEventListener(): void {
        if (this.chart.isDestroyed) { return; }
        this.chart.off(Browser.touchMoveEvent, this.mouseMove);
        this.chart.off('pointerleave' || 'mouseleave', this.mouseLeave);
        this.chart.off('click', this.mouseClick);
        this.chart.off(Browser.touchStartEvent, this.mousedown);
        this.chart.off(Browser.touchEndEvent, this.mouseLeave);
    }
    /**
     * To find private variable values
     */
    private initPrivateVariables(chart: Chart): void {
        this.styleId = chart.element.id + '_ej2_chart_selection';
        this.unselected = chart.element.id + '_ej2_deselected';
        this.closeIconId = chart.element.id + '_ej2_drag_close';
        this.draggedRectGroup = chart.element.id + '_ej2_drag_group';
        this.multiRectGroup = chart.element.id + '_ej2_drag_multi_group';
        this.draggedRect = chart.element.id + '_ej2_drag_rect';
        this.lassoPath = chart.element.id + '_ej2_drag_path';
        this.selectedDataIndexes = [];
        this.rectPoints = null;
        this.isSeriesMode = chart.selectionMode === 'Series';
    }
    /**
     * Method to select the point and series.
     *
     * @returns {void}
     */
    public invokeSelection(chart: Chart): void {
        this.initPrivateVariables(chart);
        this.series = <Series[]>extend({}, chart.visibleSeries, null, true);
        this.seriesStyles();
        this.currentMode = chart.selectionMode;
        if (!(chart.selectionMode.indexOf('Drag') > -1)) {
            this.selectDataIndex(chart, this.concatIndexes(chart.selectedDataIndexes, this.selectedDataIndexes));
        }
    }
    public generateStyle(series: SeriesModel): string {
        if (series) {
            if (this.styleId.indexOf('selection') > 1 && this.chart.selectionMode !== 'None') {
                this.unselected = series.unSelectedStyle || this.unselected;
            }
            if (this.styleId.indexOf('highlight') > 0 && (this.chart.highlightMode !== 'None' || this.chart.legendSettings.enableHighlight)) {
                this.unselected = series.nonHighlightStyle || this.unselected;
            }
            return (series.selectionStyle || this.styleId + '_series_' + (<Series>series).index);
        }
        return 'undefined';
    }

    /**
     *  Method to get the selected data index
     *
     * @private
     */
    public selectDataIndex(chart: Chart, indexes: Index[]): void {
        for (const index of indexes) {
            this.performSelection(index, chart, this.getElementByIndex(chart, index, '', this.series[index.series].marker.visible)[0]);
        }
    }

    /**
     *  Method to get the selected index element
     *
     * @private
     */
    public  getElementByIndex(chart: Chart, index: Index, suffix: string = '', marker?: boolean): Element[] {
        let elementId: string = chart.element.id + '_Series_' + index.series + '_Point' + '_' + index.point;
        const series: Series = <Series>chart.series[index.series];
        elementId = (series.type !== 'Scatter' && series.type !== 'Bubble' && marker) ? (elementId + '_Symbol' + suffix) : elementId;

        return [getElement(elementId), ((series.type === 'RangeArea' || series.type === 'SplineRangeArea' || series.type === 'RangeStepArea') && series.marker.visible) ?
            getElement(elementId + '1') : null];
    }

    /**
     *  Method to get the selected cluster element
     *
     * @private
     */
    public getClusterElements(chart: Chart, index: Index): Element[] {
        const clusters: Element[] = []; let seriesStyle: string; let selectedElements: NodeListOf<HTMLElement>;
        for (const series of chart.visibleSeries) {
            if (series.visible) {
                index = new Index(series.index, index.point);
                if (series.isRectSeries) {
                    clusters.push(this.getElementByIndex(chart, index)[0]);
                }
                clusters.push(this.getElementByIndex(chart, index, '', series.marker.visible)[0]);
                seriesStyle = this.generateStyle(chart.visibleSeries[index.series]);
                selectedElements = <NodeListOf<HTMLElement>>document.querySelectorAll('.' + seriesStyle);
                this.findTrackballElements(selectedElements, seriesStyle);
                const clusterIndex: number = series.marker.visible && series.isRectSeries ? 2 : 1;
                if (!chart.isMultiSelect && selectedElements.length > 0 &&
                    selectedElements[0].id !== (clusters[clusters.length - clusterIndex] ? clusters[clusters.length - clusterIndex].id : '')) {
                    this.removeSelection(chart, index.series, selectedElements, seriesStyle, true);
                }
            }
        }
        return clusters;
    }

    /**
     *  Method to get trackball elements
     *
     * @private
     */
    public findTrackballElements(selectedElements: Element[] | NodeListOf<HTMLElement>, className: string): void {
        let trackballElements: Element[]; let elements: Element[];
        for (let i: number = 0; i < selectedElements.length; i++) {
            if (!isNullOrUndefined(selectedElements[i as number])) {
                trackballElements = !isNullOrUndefined(selectedElements[i as number].parentNode) ?
                    <Element[]>[].slice.call((<Element>selectedElements[0].parentNode).querySelectorAll('.' + className)) : [];
                if (trackballElements.length > 0) {
                    elements = [];
                    for (let i: number = 0; i < trackballElements.length; i++) {
                        if (trackballElements[i as number].id.indexOf('Trackball') > -1) {
                            elements.push(trackballElements[i as number]);
                        }
                    }
                    this.removeStyles(elements);
                }
            }
        }
    }

    /**
     *  Method to get the selected element
     *
     * @private
     */
    public findElements(chart: Chart, series: SeriesModel, index: Index, suffix: string = '', marker?: boolean): Element[] {
        if (this.isSeriesMode) {
            return this.getSeriesElements(series);
        } else if (this.currentMode === 'Cluster') {
            return this.getClusterElements(chart, index);
        } else {
            return this.getElementByIndex(chart, index, suffix, marker);
        }
    }
    /**
     * To find the selected element.
     *
     * @returns {void}
     * @private
     */
    public isAlreadySelected(targetElem: Element, eventType: string): boolean {
        if (eventType === 'click') {
            this.currentMode = this.chart.selectionMode;
            this.styleId = this.chart.element.id + '_ej2_chart_selection';
        } else if (eventType === 'mousemove' || eventType === 'pointermove') {
            this.currentMode = this.chart.highlightMode;
            this.highlightDataIndexes = [];
            this.styleId = this.chart.element.id + '_ej2_chart_highlight';
        }
        if (this.chart.highlightMode !== 'None' && this.chart.selectionMode === 'None') {
            if (eventType === 'click') {
                return false;
            }
        }
        if (((this.chart.highlightMode !== 'None' || this.chart.legendSettings.enableHighlight) && this.previousSelectedEle && this.previousSelectedEle[0])) {
            const parentNodeId: string = (<Element>targetElem.parentNode).id;
            let isElement: boolean;
            if (targetElem.parentNode) {
                isElement = (parentNodeId.indexOf('SeriesGroup') > 0 || parentNodeId.indexOf('SymbolGroup') > 0) ? true : false;
            }
            for (let i: number = 0; i < this.previousSelectedEle.length; i++) {
                if (this.previousSelectedEle[i as number] && this.previousSelectedEle[i as number].hasAttribute('class')) {
                    if (this.previousSelectedEle[i as number].getAttribute('class').indexOf('highlight') > -1 &&
                        (isElement || eventType === 'click')) {
                        this.previousSelectedEle[i as number].removeAttribute('class');
                        if (this.chart.highlightColor !== '' && !isNullOrUndefined(this.chart.highlightColor) && this.chart.highlightPattern === 'None') {
                            if (this.previousSelectedEle[i as number].id.indexOf('Group') > 0) {
                                for (let j: number = 0; j < this.previousSelectedEle[i as number].children.length; j++) {
                                    this.previousSelectedEle[i as number].children[j as number].setAttribute('fill', (this.control as Chart).visibleSeries[this.indexFinder(this.previousSelectedEle[i as number].id).series].interior);
                                }
                            } else {
                                this.previousSelectedEle[i as number].setAttribute('fill', (this.control as Chart).visibleSeries[this.indexFinder(this.previousSelectedEle[i as number].id).series].interior);
                            }
                        }
                        this.addOrRemoveIndex(this.highlightDataIndexes, this.indexFinder((<HTMLElement>this.previousSelectedEle[i as number]).id));
                    } else if (!isElement && this.previousSelectedEle[i as number].getAttribute('class').indexOf('highlight') > -1) {
                        this.performSelection(this.indexFinder(this.previousSelectedEle[i as number].id), this.chart, this.previousSelectedEle[i as number]);
                    }
                }
            }
        }
        return true;
    }


    private mouseClick(event: Event): void {
        this.calculateSelectedElements(event.target as HTMLElement, event.type);
    }

    /**
     * To find the selected element.
     *
     * @returns {void}
     * @private
     */
    public calculateSelectedElements(targetElement: HTMLElement, eventType: string): void {
        if (isNullOrUndefined(targetElement)) {
            return;
        }
        if ((this.chart.selectionMode === 'None' && this.chart.highlightMode === 'None') ||
            targetElement.id && targetElement.id.indexOf(this.chart.element.id + '_') === -1) {
            return;
        }
        if (eventType === 'mousemove' || eventType === 'pointermove') {
            if (targetElement.hasAttribute('class') && (targetElement.getAttribute('class').indexOf('highlight') > -1 ||
                targetElement.getAttribute('class').indexOf('selection') > -1)) {
                return;
            }
            if (!isNullOrUndefined(targetElement.parentNode) && (<Element>targetElement.parentNode).hasAttribute('class') &&
                ((<Element>targetElement.parentNode).getAttribute('class').indexOf('highlight') > 0 ||
                    (<Element>targetElement.parentNode).getAttribute('class').indexOf('selection') > 0)) {
                return;
            }
        }
        this.isAlreadySelected(targetElement, eventType);
        if (targetElement.id && targetElement.id.indexOf('_Series_') > -1 && targetElement.id.indexOf('_Text_') === -1) {
            let element: Element;
            if (targetElement.id.indexOf('_Trackball_1') > -1) {
                element = getElement(targetElement.id.split('_Trackball_')[0] + '_Symbol');
                element = isNullOrUndefined(element) ? getElement(targetElement.id.split('_Trackball_')[0]) : element;
            } else if (targetElement.id.indexOf('_Trackball_0') > -1) {
                return null;
            }
            this.performSelection(this.indexFinder(targetElement.id), this.chart, element || <Element>targetElement);
        }
    }
    /**
     *  Method to perform the selection
     *
     * @private
     */
    public performSelection(index: Index, chart: Chart, element?: Element): void {
        this.isSeriesMode = this.currentMode === 'Series';
        if (chart.visibleSeries[index.series].type === 'BoxAndWhisker' && element &&
            element.id === chart.element.id + '_Series_' + index.series + '_Point_' + index.point + '_BoxPath') {
            element = <Element>element.parentNode;
        }
        if (chart.visibleSeries[index.series].type === 'Area' && (this.currentMode === 'Point' || this.currentMode === 'Cluster') && element &&
            (element.id === this.chart.element.id + '_Series_' + index.series)) {
            const className: string = this.generateStyle(chart.series[index.series]);
            const selectionEle: NodeListOf<HTMLElement> = document.querySelectorAll('.' + className);
            this.findTrackballElements(selectionEle, className);
            this.blurEffect(chart.element.id, chart.visibleSeries, false, index.point);
        }
        switch (this.currentMode) {
        case 'Series':
            this.selection(chart, index, this.getSeriesElements(chart.series[index.series]));
            this.selectionComplete(chart, index, this.currentMode);
            this.blurEffect(chart.element.id, chart.visibleSeries, false, index.point);
            break;
        case 'Point':
            if (!isNaN(index.point) && element) {
                const pointElements: Element[] = [];
                pointElements.push(element);
                if (pointElements[0] !== null && chart.series[index.series].marker.visible &&
                    (chart.series[index.series].type.indexOf('Column') !== -1 || chart.series[index.series].type.indexOf('Bar') !== -1)) {
                    if (!(element.id.indexOf('_Symbol') !== -1) && getElement(element.id + '_Symbol')) {
                        pointElements.push(getElement(element.id + '_Symbol'));
                    } else if (element.id.indexOf('_Symbol') !== -1 && getElement(element.id.replace('_Symbol', ''))) {
                        pointElements.push(getElement(element.id.replace('_Symbol', '')));
                    }
                }
                this.selection(chart, index, pointElements);
                this.selectionComplete(chart, index, this.currentMode);
                this.blurEffect(chart.element.id, chart.visibleSeries, false, index.point);
            }
            break;
        case 'Cluster':
            if (!isNaN(index.point)) {
                this.clusterSelection(chart, index);
                this.selectionComplete(chart, index, this.currentMode);
                this.blurEffect(chart.element.id, chart.visibleSeries, false, index.point);
            }
            break;
        }
    }

    /**
     *  Method to get the selected data index
     *
     * @private
     */
    public selectionComplete(chart: Chart, index: Index, selectionMode: SelectionMode| HighlightMode): void {
        let points: Points[]; let pointIndex: number; let seriesIndex: number;
        const selectedPointValues: { x?: string | number | Date, y?: number, seriesIndex?: number, pointIndex?: number }[] = [];
        let yValue: number; let selectedPointX: string | number | Date;
        if (selectionMode === 'Cluster') {
            for (const series of chart.visibleSeries) {
                if (series.visible) {
                    for (let i: number = 0; i < this.selectedDataIndexes.length; i++) {
                        pointIndex = chart.isMultiSelect ? this.selectedDataIndexes[i as number].point : index.point;
                        seriesIndex = series.index;
                        points = (<Series>series).points;
                        if (!isNaN(pointIndex) && (pointIndex < points.length)) {
                            yValue = (series.type !== 'RangeArea' || 'SplineRangeArea' || 'RangeStepArea') ? points[pointIndex as number].yValue :
                                points[pointIndex as number].regions[0].y;
                            selectedPointX = points[pointIndex as number].xValue;
                            if (chart.primaryXAxis.valueType === 'Category') {
                                selectedPointX = points[pointIndex as number].x.toLocaleString();
                            } else if (chart.primaryXAxis.valueType === 'DateTime') {
                                selectedPointX = new Date(points[pointIndex as number].xValue);
                            }
                            if (series.category !== 'Indicator') {
                                selectedPointValues.push({
                                    x: selectedPointX, y: yValue, seriesIndex: seriesIndex,
                                    pointIndex: pointIndex
                                });
                            }
                            if (series.type === 'RangeArea' || series.type === 'SplineRangeArea' || series.type === 'RangeStepArea') {
                                selectedPointValues.push({
                                    x: selectedPointX, y: points[pointIndex as number].regions[0].y,
                                    seriesIndex: seriesIndex, pointIndex: pointIndex
                                });
                            }
                        }
                    }
                }
            }
        } else if (selectionMode === 'Series') {
            if (chart.isMultiSelect) {
                for (let i: number = 0; i < this.selectedDataIndexes.length; i++) {
                    seriesIndex = this.selectedDataIndexes[i as number].series;
                    if (this.selectedDataIndexes.length > 0) {
                        selectedPointValues.push({
                            seriesIndex: seriesIndex
                        });
                    }
                }
            } else {
                seriesIndex = (this.selectedDataIndexes.length > 0) ? this.selectedDataIndexes[0].series : (this.highlightDataIndexes && this.highlightDataIndexes.length > 0) ? this.highlightDataIndexes[0].series : 0;
                if (this.selectedDataIndexes.length > 0 || (this.highlightDataIndexes && this.highlightDataIndexes.length > 0)) {
                    selectedPointValues.push({
                        seriesIndex: seriesIndex
                    });
                }
            }
        } else if (selectionMode === 'Point') {
            let selectedData: Indexes[] = [];
            if (this.styleId.indexOf('highlight') > -1) {
                selectedData = this.highlightDataIndexes;
            } else {
                selectedData = this.selectedDataIndexes;
            }
            for (let i: number = 0; i < selectedData.length; i++) {
                pointIndex = selectedData[i as number].point;
                seriesIndex = selectedData[i as number].series;
                const series: SeriesModel = chart.series[seriesIndex as number];
                points = (<Series>series).points;
                if (!isNaN(pointIndex)) {
                    selectedPointX = points[pointIndex as number].xValue;
                    yValue = (series.type !== 'RangeArea' || 'SplineRangeArea' || 'RangeStepArea') ? points[pointIndex as number].yValue :
                        points[pointIndex as number].regions[0].y;
                    if (chart.primaryXAxis.valueType === 'Category') {
                        selectedPointX = points[pointIndex as number].x.toLocaleString();
                    } else if (chart.primaryXAxis.valueType === 'DateTime') {
                        selectedPointX = new Date(points[pointIndex as number].xValue);
                    }
                    selectedPointValues.push({
                        x: selectedPointX, y: yValue, seriesIndex: seriesIndex,
                        pointIndex: pointIndex
                    });
                }
            }
        }
        const args: ISelectionCompleteEventArgs = {
            name: selectionComplete,
            selectedDataValues: selectedPointValues,
            cancel: false,
            chart: chart
        };
        chart.trigger(selectionComplete, args);
    }
    /**
     *  Method to perform selection
     *
     * @private
     */
    public selection(chart: Chart, index: Index, selectedElements: Element[]): void {
        if (!(this.currentMode === 'Lasso')) {
            if (!chart.isMultiSelect && (this.currentMode.indexOf('Drag') === -1 && this.styleId.indexOf('highlight') === -1 &&
                chart.selectionMode !== 'None')) {
                this.removeMultiSelectElements(chart, this.selectedDataIndexes, index, chart.series);
            }
        }
        const indexValue : number = (this.rangeColorMappingEnabled()) ? 0 : index.series;
        if (!isNullOrUndefined(selectedElements[0])) {
            if ((<Series>chart.visibleSeries[indexValue as number]).isRectSeries) {
                if (selectedElements[0].id) {
                    if (document.getElementById(selectedElements[0].id + '_Symbol')) {
                        selectedElements.push(getElement(selectedElements[0].id + '_Symbol'));
                    } else if (selectedElements[0].id.indexOf('SeriesGroup') !== -1) {
                        if (document.getElementById(selectedElements[0].id.replace('SeriesGroup', 'SymbolGroup'))) {
                            selectedElements.push(getElement(selectedElements[0].id.replace('SeriesGroup', 'SymbolGroup')));
                        }
                    }
                }
            }
            let isAdd: boolean;
            const className: string = selectedElements[0] && (selectedElements[0].getAttribute('class') || '');
            const pClassName: string = selectedElements[0].parentNode &&
                ((<Element>selectedElements[0].parentNode).getAttribute('class') || '');
            if (className !== '' && this.currentMode !== 'Cluster') {
                this.findTrackballElements(selectedElements, className);
            }
            if (selectedElements[0] && className.indexOf(this.getSelectionClass(selectedElements[0].id)) > -1) {
                this.removeStyles(selectedElements);
            } else if (selectedElements[0].parentNode && pClassName.indexOf(this.getSelectionClass(selectedElements[0].id)) > -1) {
                this.removeStyles([<Element>selectedElements[0].parentNode]);
            } else {
                this.previousSelectedEle = (chart.highlightMode !== 'None' || chart.legendSettings.enableHighlight) ? selectedElements : [];
                this.applyStyles(selectedElements);
                isAdd = true;
            }
            if (this.styleId.indexOf('highlight') > 0 && (chart.highlightMode !== 'None' || chart.legendSettings.enableHighlight)) {
                this.addOrRemoveIndex(this.highlightDataIndexes, index, isAdd);
            }
            else {
                this.addOrRemoveIndex(this.selectedDataIndexes, index, isAdd);
            }
        }
    }
    /**
     *  Method to get the cluster selection element
     *
     * @private
     */
    public clusterSelection(chart: Chart, index: Index): void {
        this.selection(chart, index, this.getClusterElements(chart, new Index(index.series, index.point)));
    }
    /**
     * Method to remove the multi selected elements
     *
     * @private
     */
    public removeMultiSelectElements(chart: Chart, index: Index[], currentIndex: Index, seriesCollection: SeriesModel[]): void {
        let series: SeriesModel;
        for (let i: number = 0; i < index.length; i++) {
            series = seriesCollection[index[i as number].series];
            if ((this.isSeriesMode && !this.toEquals(index[i as number], currentIndex, this.isSeriesMode)) ||
                (this.currentMode === 'Cluster' && !this.toEquals(index[i as number], currentIndex, false)) ||
                (!this.isSeriesMode && this.toEquals(index[i as number], currentIndex, true) &&
                !this.toEquals(index[i as number], currentIndex, false))) {
                this.removeStyles(this.findElements(chart, series, index[i as number], '', false));
                if (series.marker.visible) {
                    this.removeStyles(this.findElements(chart, series, index[i  as number], '', true));
                }
                index.splice(i, 1);
                i--;
            }
        }
    }
    /**
     * Method to remove the selection
     *
     * @private
     */
    public blurEffect(chartId: string, visibleSeries: Series[], isLegend: boolean = false, index: number = 0): void {
        const visibility: boolean = (this.checkVisibility(this.highlightDataIndexes, this.chart ) ||
            this.checkVisibility(this.selectedDataIndexes, this.chart)); // legend click scenario
        for (const series of visibleSeries) {
            let legendIndex: number; let legendStrokeColor: string;
            if (this.rangeColorMappingEnabled()) {
                if (isLegend === false) {
                    legendIndex = Object.keys(series.rangeColorPoints).indexOf(series.points[index as number].interior);
                    legendStrokeColor = series.points[index as number].interior;
                }
                else {
                    legendIndex = index;
                    legendStrokeColor = document.getElementById(chartId + '_chart_legend_shape_' + index).getAttribute('fill');
                }
            }
            else {
                legendIndex = series.index;
                legendStrokeColor = this.chart.visibleSeries[series.index].interior;
            }
            if (series.visible) {
                this.checkSelectionElements(
                    getElement(chartId + 'SeriesGroup' + series.index),
                    this.generateStyle(series), visibility, isLegend, legendIndex, legendStrokeColor
                );
                if (!isNullOrUndefined(getElement(chartId + 'SymbolGroup' + series.index))) {
                    this.checkSelectionElements(
                        getElement(chartId + 'SymbolGroup' + series.index),
                        this.generateStyle(series), visibility, isLegend, legendIndex, legendStrokeColor
                    );
                }
            }
        }
    }
    /**
     * Method to add the add/remove class to element
     *
     * @private
     */
    public checkSelectionElements(element: Element, className: string, visibility: boolean, isLegend: boolean = true, series: number = 0, legendStrokeColor: string = '#D3D3D3'): void {
        let children: HTMLCollection | Element[] = <Element[]>(this.isSeriesMode ? element.childNodes ||  [element] : element.childNodes || element);
        if (this.chart.selectionMode !== 'None' && (this.chart.highlightMode !== 'None' || this.chart.legendSettings.enableHighlight)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            children = (element.childNodes as any || element);
        }
        let elementClassName: string; let parentClassName: string; let legendShape: Element; let selectElement: Element = element;
        for (let i: number = 0; i < children.length; i++) {
            elementClassName = children[i as number].getAttribute('class') || '';
            parentClassName = (<Element>children[i as number].parentNode).getAttribute('class') || '';
            if (this.chart.selectionMode !== 'None' && (this.chart.highlightMode !== 'None' || this.chart.legendSettings.enableHighlight)) {
                className = elementClassName.indexOf('selection') > 0 ||
                    elementClassName.indexOf('highlight') > 0 ? elementClassName : className;
                className = (parentClassName.indexOf('selection') > 0 ||
                    parentClassName.indexOf('highlight') > 0) ? parentClassName : className;
            }
            if (elementClassName.indexOf(className) === -1 &&
                parentClassName.indexOf(className) === -1 && visibility) {
                this.addSvgClass(children[i as number], this.unselected);
            } else {
                selectElement = children[i as number];
                this.removeSvgClass(children[i as number], this.unselected);
                this.removeSvgClass(<Element>children[i as number].parentNode, this.unselected);
            }
            if (children[i as number].id.indexOf('Trackball') > 0 && selectElement.classList[0] === className) {
                this.removeSvgClass(children[i as number], this.unselected);
                this.removeSvgClass(<Element>children[i as number].parentNode, this.unselected);
                this.addSvgClass(children[i as number], className);
            }
        }
        if (element.id.indexOf('Symbol') > -1) {
            if ((element.querySelectorAll('.' + className)[0]) && element.querySelectorAll('.' + className)[0].getAttribute('class')
                === className) {
                const symbolEle: Element = getElement(this.control.element.id + '_Series_' + element.id[element.id.length - 1]);
                const seriesClassName: string = symbolEle && symbolEle.hasAttribute('class') ? symbolEle.getAttribute('class') : '';
                if (seriesClassName.indexOf(this.unselected) > -1) {
                    this.removeSvgClass(symbolEle, this.unselected);
                }
            }
        }
        if ((this.control as Chart).legendModule && (this.control as Chart).legendSettings.visible) {
            legendShape = getElement(this.control.element.id + '_chart_legend_shape_' + series);
            if (legendShape) {
                if (legendShape.hasAttribute('class')) {
                    this.removeSvgClass(legendShape, legendShape.getAttribute('class'));
                    if (!isNullOrUndefined(this.chart.highlightColor && this.chart.highlightColor !== '') && !this.chart.legendSettings.enableHighlight) {
                        legendShape.setAttribute('stroke', legendStrokeColor);
                        if (this.chart.highlightPattern === 'None') {
                            legendShape.setAttribute('fill', legendStrokeColor);
                        }
                    }
                }
                elementClassName = selectElement.getAttribute('class') || '';
                parentClassName = (<Element>selectElement.parentNode).getAttribute('class') || '';
                if (elementClassName.indexOf(className) === -1 && parentClassName.indexOf(className) === -1 && visibility) {
                    this.addSvgClass(legendShape, (this.chart.highlightMode === 'None' && this.chart.legendSettings.enableHighlight) ? className : this.unselected);
                    this.removeSvgClass(legendShape, className);
                    if (this.chart.highlightColor !== '' && !isNullOrUndefined(this.chart.highlightColor)) {
                        legendShape.setAttribute('stroke', (this.control as Chart).visibleSeries[series as number].interior);
                        if (this.chart.highlightPattern === 'None') {
                            legendShape.setAttribute('fill', (this.control as Chart).visibleSeries[series as number].interior);
                        }
                    }
                } else {
                    this.removeSvgClass(legendShape, this.unselected);
                    if (!isNullOrUndefined(this.chart.highlightColor) && this.chart.highlightColor !== '') {
                        legendShape.setAttribute('stroke', (this.control as Chart).visibleSeries[series as number].interior);
                        if (this.chart.highlightPattern === 'None') {
                            legendShape.setAttribute('fill', (this.control as Chart).visibleSeries[series as number].interior);
                        }
                    }
                    if ((elementClassName === '' && parentClassName === '') || elementClassName.trim() === 'EJ2-Trackball') {
                        this.removeSvgClass(legendShape, className);
                    } else {
                        this.addSvgClass(legendShape, className);
                        if (className.indexOf('highlight') > 0 && this.chart.highlightColor !== '' && this.chart.highlightColor !== 'transparent' && !isNullOrUndefined(this.chart.highlightColor)) {
                            legendShape.setAttribute('stroke', this.chart.highlightColor);
                            if (this.styleId.indexOf('highlight') > 0 && this.chart.highlightPattern === 'None') {
                                legendShape.setAttribute('fill', this.chart.highlightColor);
                            }
                        }
                    }
                }
                let legendItemsId: Element;
                if (this.rangeColorMappingEnabled()) {
                    for (let i: number = 0; i < this.chart.rangeColorSettings.length; i++) {
                        legendItemsId = document.getElementById(this.chart.element.id + '_chart_legend_shape_' + i);
                        if (legendShape !== legendItemsId) {
                            this.addSvgClass(legendItemsId, this.unselected);
                        }
                        else if (isLegend === true) {
                            this.addSvgClass(legendItemsId, className);
                        }
                        if (elementClassName.indexOf(className) === -1 && isLegend === false) {
                            this.removeSvgClass(legendItemsId, this.unselected);
                        }
                    }
                }
                if (isLegend && parentClassName.indexOf(className) > -1) {
                    this.addSvgClass(legendShape, className);
                }
            }
        }
    }
    /**
     *  Method to apply the styles
     *
     * @private
     */
    public applyStyles(elements: Element[]): void {
        for (const element of elements) {
            if (element) {
                this.removeSvgClass(<Element>element.parentNode, this.unselected);
                this.removeSvgClass(element, this.unselected);
                if (this.chart.series[0].pointColorMapping === 'fill' || this.rangeColorMappingEnabled()) {
                    const className: string = this.getSelectionClass(element.id);
                    const index: number = className.indexOf('highlight') > -1 ? parseInt(className.split(this.chart.element.id + '_ej2_chart_highlight_series_')[1], 10) : parseInt(className.split(this.chart.element.id + '_ej2_chart_selection_series_')[1], 10);
                    const patternName: string = this.styleId.indexOf('highlight') > 0 ? this.chart.highlightPattern : this.chart.selectionPattern;
                    let pattern: Element;
                    if (className.indexOf('highlight') > -1 || className.indexOf('selection') > -1) {
                        pattern = document.getElementById(this.chart.element.id + '_' + patternName + '_' + 'Selection' + '_' + index);
                    }
                    if (element.id.indexOf('legend') === -1 && element.id.indexOf('Group') === -1 && pattern != null) {
                        for (let i: number = 1; i < pattern.children.length; i++) {
                            pattern.children[i as number].setAttribute('fill', element.getAttribute('fill'));
                            pattern.children[i as number].setAttribute('stroke', element.getAttribute('fill'));
                        }
                    }
                }
                this.addSvgClass(element, this.getSelectionClass(element.id));
                if (this.styleId.indexOf('highlight') > 0 && this.chart.highlightColor !== '' && !isNullOrUndefined(this.chart.highlightColor) && this.chart.highlightPattern === 'None' && this.chart.highlightColor !== 'transparent') {
                    if (element.id.indexOf('Group') > 0) {
                        for (let i: number = 0; i < element.children.length; i++) {
                            element.children[i as number].setAttribute('fill', this.chart.highlightColor);
                        }
                    } else {
                        element.setAttribute('fill', this.chart.highlightColor);
                    }
                }
            }
        }
    }
    /**
     *  Method to get the selection class
     *
     * @private
     */
    public getSelectionClass(id: string): string {
        return this.generateStyle((this.control as Chart).visibleSeries[this.indexFinder(id).series]);
    }
    /**
     *  Method to remove styles
     *
     * @private
     */
    public removeStyles(elements: Element[]): void {
        for (const element of elements) {
            if (element) {
                this.removeSvgClass(
                    element, this.getSelectionClass(element.id)
                );
                if (this.chart.highlightPattern === 'None' && this.chart.highlightColor !== '' && !isNullOrUndefined(this.chart.highlightColor) && this.chart.highlightColor !== 'transparent') {
                    if (element.id.indexOf('Group') > 0) {
                        for (let i: number = 0; i < element.children.length; i++) {
                            element.children[i as number].setAttribute('fill', (this.control as Chart).visibleSeries[this.indexFinder(element.id).series].interior);
                        }
                    } else {
                        element.setAttribute('fill', (this.control as Chart).visibleSeries[this.indexFinder(element.id).series].interior);
                    }
                }
            }
        }
    }
    /**
     *  Method to remove the selected data index
     *
     * @private
     */
    public addOrRemoveIndex(indexes: Index[], index: Index, isAdd?: boolean): void {
        for (let i: number = 0; i < indexes.length; i++) {
            if (this.toEquals(indexes[i as number], index, this.isSeriesMode)) {
                indexes.splice(i, 1);
                i--;
            }
        }
        if (isAdd) { indexes.push(index); }
    }
    /**
     *  Method to get the equal index
     *
     * @private
     */
    public toEquals(first: Index, second: Index, checkSeriesOnly: boolean): boolean {
        return ((first.series === second.series || (this.currentMode === 'Cluster' && !checkSeriesOnly))
            && (checkSeriesOnly || (first.point === second.point)));
    }
    /**
     * To redraw the selected points.
     *
     * @returns {void}
     * @private
     */
    public redrawSelection(chart: Chart, oldMode: SelectionMode | HighlightMode, chartRedraw?: boolean): void {
        this.isSeriesMode = oldMode === 'Series';
        if (!isNullOrUndefined(oldMode)) {
            if (oldMode.indexOf('Drag') !== -1 || oldMode === 'Lasso' || chartRedraw) {
                chart.isRedrawSelection = false;
            } else {
                chart.isRedrawSelection = true;
            }
        }
        let selectedDataIndexes: Indexes[] = <Indexes[]>extend([], this.selectedDataIndexes, null, true);
        const highlightDataIndexes: Indexes[] = <Indexes[]>extend([], this.highlightDataIndexes, null, true);
        if (this.styleId.indexOf('highlight') > 0 && highlightDataIndexes.length > 0 ) {
            this.removeSelectedElements(chart, this.highlightDataIndexes, chart.series);
            selectedDataIndexes = highlightDataIndexes;
        } else {
            this.removeSelectedElements(chart, this.selectedDataIndexes, chart.series);
        }
        this.blurEffect(chart.element.id, chart.visibleSeries, false);
        this.selectDataIndex(chart, selectedDataIndexes);
    }
    /** @private */
    public legendSelection(chart: Chart, series: number, targetElement: Element, eventType: string): void {
        if (eventType === 'mousemove') {
            if (targetElement.id.indexOf('text') > 1) {
                targetElement = getElement(targetElement.id.replace('text', 'shape'));
            }
            if (targetElement.id.indexOf('marker') > 1) {
                targetElement = getElement(targetElement.id.replace('_marker', ''));
            }
            if (targetElement.id.indexOf('g') > 1) {
                targetElement = getElement(targetElement.id.replace('_g_', '_shape_'));
            }
            if (targetElement.hasAttribute('class') && (targetElement.getAttribute('class').indexOf('highlight') > -1 ||
                targetElement.getAttribute('class').indexOf('selection') > -1)) {
                return;
            }
            this.currentMode = this.chart.highlightMode;
        }
        const isPreSelected: boolean = this.isAlreadySelected(targetElement, eventType);
        if (isPreSelected) {
            let seriesStyle: string = this.generateStyle(chart.visibleSeries[series as number]);
            let selectedElements: NodeListOf<HTMLElement> =  <NodeListOf<HTMLElement>>(document.querySelectorAll('.' + seriesStyle));
            this.isSeriesMode = this.currentMode === 'Series';
            const isBlurEffectNeeded: boolean = true;
            if (selectedElements.length > 0) {
                this.removeSelection(chart, series, selectedElements, seriesStyle, isBlurEffectNeeded);
            } else {
                for (const element of chart.visibleSeries) {
                    if (element.index !== series && !chart.isMultiSelect) {
                        seriesStyle = this.generateStyle(chart.visibleSeries[element.index]);
                        selectedElements = document.querySelectorAll('.' + seriesStyle);
                        this.removeSelection(chart, series, selectedElements, seriesStyle, isBlurEffectNeeded);
                    }
                }
                let seriesElements: Element[] = [];
                if (this.rangeColorMappingEnabled()) {
                    // eslint-disable-next-line @typescript-eslint/tslint/config
                    for (let i: number = 0, a = chart.visibleSeries[0].seriesElement.children; i < a.length; i++) {
                        const point: Element = a[i as number];
                        if (targetElement.getAttribute('fill') === point.getAttribute('fill')) {
                            seriesElements.push(point);
                        }
                    }
                    for (const element of seriesElements) {
                        if (isNullOrUndefined(element)) {
                            return;
                        }
                        this.checkSelectionElements(element, seriesStyle, false, true, series);
                    }
                }
                else {
                    seriesElements = this.getSeriesElements(chart.visibleSeries[series as number]);
                    for (const seriesElement of seriesElements) {
                        if (isNullOrUndefined(seriesElement)) {
                            return;
                        }
                        this.checkSelectionElements(seriesElement,  seriesStyle, false, true, series);
                    }
                }
                this.isSeriesMode = true;
                this.selection(chart, new Index(series, NaN), seriesElements);
                this.isSeriesMode = chart.selectionMode === 'Series';
                this.blurEffect(chart.element.id, chart.visibleSeries, true, series);
            }
        }
    }
    /** @private */
    public rangeColorMappingEnabled(): boolean {
        if ((this.chart.rangeColorSettings && this.chart.rangeColorSettings.length > 0 && this.chart.visibleSeries.length === 1 &&
            this.chart.rangeColorSettings[0].colors.length > 0  &&
            (this.chart.series[0].type === 'Column' || this.chart.series[0].type === 'Bar' ||
                this.chart.series[0].type === 'Scatter' || this.chart.series[0].type === 'Bubble'))) {
            return true;
        }
        else {
            return false;
        }
    }
    public removeSelection(
        chart: Chart, series: number, selectedElements: NodeListOf<HTMLElement>,
        seriesStyle: string, isBlurEffectNeeded: boolean): void {
        if (selectedElements.length > 0) {
            const elements: Element[] = [];
            for (let i: number = 0; i < selectedElements.length; i++) {
                elements.push(selectedElements[i as number]);
            }
            this.removeStyles(elements);
            this.isSeriesMode = true;
            this.addOrRemoveIndex(this.selectedDataIndexes, new Index(series, NaN));
            for (const value of chart.visibleSeries) {
                seriesStyle = this.generateStyle(value);
                if (document.querySelectorAll('.' + seriesStyle).length > 0) {
                    for (const element of elements) {
                        this.checkSelectionElements(element, seriesStyle, true, true, series);
                    }
                    isBlurEffectNeeded = false;
                    break;
                }
            }
            if (isBlurEffectNeeded) {
                this.isSeriesMode = chart.selectionMode === 'Series';
                this.blurEffect(chart.element.id, chart.visibleSeries);
            }
        }
    }
    /** @private */
    public getSeriesElements(series: SeriesModel): Element[] {
        const seriesElements: Element[] = [(<Series>series).seriesElement];
        if (series.marker.visible && series.type !== 'Scatter' && series.type !== 'Bubble' && !(<Series>series).isRectSeries) {
            seriesElements.push((<Series>series).symbolElement);
        } else if (series.marker.visible && (<Series>series).isRectSeries) {
            seriesElements.push((<Series>series).symbolElement);
        }
        return seriesElements;
    }
    /** @private */
    public indexFinder(id: string): Index {
        let ids: string[] = ['NaN', 'NaN'];
        if (id.indexOf('SeriesGroup') > -1) {
            ids = id.split('SeriesGroup');
            ids[0] = ids[1];
        } else if (id.indexOf('SymbolGroup') > -1) {
            ids = id.split('SymbolGroup');
            ids[0] = ids[1];
        } else if (id.indexOf('_Point_') > -1) {
            ids = id.split('_Series_')[1].split('_Point_');
        }else if (id.indexOf('_border_') > -1) {
            ids[0] = id.split('_border_')[1];
        }else if (id.indexOf('_Series_') > -1) {
            ids[0] = id.split('_Series_')[1];
        } else if (id.indexOf('_chart_legend_shape_') > -1) {
            ids = id.split('_chart_legend_shape_');
            ids[0] = ids[1];
        }
        return new Index(parseInt(ids[0], 10), parseInt(ids[1], 10));
    }
    /**
     * Drag selection that returns the selected data.
     *
     * @returns {void}
     * @private
     */
    public calculateDragSelectedElements(chart: Chart, dragRect: Rect, isClose?: boolean): void {
        this.removeSelectedElements(chart, this.selectedDataIndexes, chart.series);
        const isLasso: boolean = chart.selectionMode === 'Lasso';
        const rect: Rect = new Rect(dragRect.x, dragRect.y, dragRect.width, dragRect.height);
        const axisOffset: ChartLocation = new ChartLocation(
            chart.chartAxisLayoutPanel.seriesClipRect.x,
            chart.chartAxisLayoutPanel.seriesClipRect.y
        );
        this.removeOffset(rect, axisOffset);
        let points: Points[];
        let index: Index;
        let selectedPointValues: { x: string | number | Date, y: number }[] = [];
        const selectedSeriesValues: { x: string | number | Date, y: number }[][] = [];
        this.isSeriesMode = false;
        const isDragResize: boolean = (chart.allowMultiSelection) && (this.rectGrabbing || this.resizing);
        this.rectPoints = this.dragRectArray[isDragResize ? this.targetIndex : this.count] =
            new Rect(dragRect.x, dragRect.y, dragRect.width, dragRect.height);
        if (dragRect.width && dragRect.height && !isClose) {
            const rt: Rect = new Rect(dragRect.x, dragRect.y, dragRect.width, dragRect.height);
            this.removeOffset(rt, axisOffset);
            this.filterArray[isDragResize ? this.targetIndex : this.count] = rt;
        }
        for (const series of chart.visibleSeries) {
            if (series.visible) {
                points = (<Series>series).points;
                selectedPointValues = [];
                let xAxisOffset: number;
                let yAxisOffset: number;
                if ((chart.isTransposed || series.type.indexOf('Bar') !== -1) &&
                    !(chart.isTransposed && series.type.indexOf('Bar') !== -1)) {
                    xAxisOffset = series.xAxis.rect.y - axisOffset.y;
                    yAxisOffset = series.yAxis.rect.x - axisOffset.x;
                } else {
                    xAxisOffset = series.xAxis.rect.x - axisOffset.x;
                    yAxisOffset = series.yAxis.rect.y - axisOffset.y;
                }
                for (let j: number = 0; j < points.length; j++) {
                    const yValue: number = (series.type !== 'RangeArea' || 'SplineRangeArea' || 'RangeStepArea') ? points[j as number].yValue :
                        points[j as number].regions[0].y;
                    let isCurrentPoint: boolean;
                    let selectedPointX: string | number | Date = points[j as number].xValue;
                    if (chart.primaryXAxis.valueType === 'Category') {
                        selectedPointX = points[j as number].x.toLocaleString();
                    } else if (chart.primaryXAxis.valueType === 'DateTime') {
                        selectedPointX = new Date(points[j as number].xValue);
                    }
                    if (series.type === 'BoxAndWhisker') {
                        isCurrentPoint = points[j as number].regions.some((region: Rect): boolean => {
                            return withInBounds(
                                region.x + xAxisOffset,
                                region.y + yAxisOffset, rect
                            );
                        });
                    } else {
                        if (chart.selectionMode === 'Lasso') {
                            isCurrentPoint = points[j as number].isSelect;
                        } else {
                            isCurrentPoint = (chart.allowMultiSelection) ?
                                this.isPointSelect(points[j as number], xAxisOffset, yAxisOffset, this.filterArray) :
                                points[j as number].symbolLocations.some((location: ChartLocation) => {
                                    return location && withInBounds(location.x + xAxisOffset, location.y + yAxisOffset, rect);
                                });
                        }
                    }
                    if (isCurrentPoint && series.category !== 'Indicator') {
                        index = new Index((<Series>series).index, points[j as number].index);
                        this.selection(chart, index, this.findElements(chart, series, index, '', !series.isRectSeries ? series.marker.visible : false));
                        selectedPointValues.push({ x: selectedPointX, y: yValue });
                    }
                    if (isCurrentPoint && (series.type === 'RangeArea' || series.type === 'SplineRangeArea' || series.type === 'RangeStepArea')) {
                        selectedPointValues.push({ x: selectedPointX, y: points[j as number].regions[0].y });
                    }
                }
                selectedSeriesValues.push(selectedPointValues);
            }
        }
        this.blurEffect(chart.element.id, chart.visibleSeries);
        const x: number = isLasso ? chart.mouseDownX : (dragRect.x + dragRect.width);
        const y: number = isLasso ? chart.mouseDownY : dragRect.y;
        if (!isClose) {
            this.createCloseButton(x, y);
        }
        const args: IDragCompleteEventArgs = {
            name: dragComplete,
            selectedDataValues: selectedSeriesValues,
            cancel: false
        };
        chart.trigger(dragComplete, args);
    }

    private removeOffset(rect: Rect, clip: ChartLocation): void {
        rect.x -= clip.x;
        rect.y -= clip.y;
    }
    private isPointSelect(
        points: Points, xAxisOffset: number, yAxisOffset: number,
        rectCollection: Rect[]): boolean {
        const location: ChartLocation = points.symbolLocations[0];
        for (const rect of rectCollection) {
            if (rect && location && withInBounds(location.x + xAxisOffset, location.y + yAxisOffset, rect)) {
                return true;
            }
        }
        return false;
    }
    /**
     * Method to draw dragging rect.
     *
     * @returns {void}
     * @private
     */
    public drawDraggingRect(chart: Chart, dragRect: Rect): void {
        const cartesianLayout: Rect = chart.chartAxisLayoutPanel.seriesClipRect;
        const border: number = chart.chartArea.border.width;
        const rectFill: string = chart.themeStyle.selectionRectFill;
        const rectStroke: string = chart.themeStyle.selectionRectStroke;
        const isLasso: boolean = chart.selectionMode === 'Lasso';
        if (this.isdrawRect) {
            cartesianLayout.x = cartesianLayout.x - border / 2;
            cartesianLayout.y = cartesianLayout.y - border / 2;
            cartesianLayout.width = cartesianLayout.width + border;
            cartesianLayout.height = cartesianLayout.height + border;
            this.isdrawRect = false;
        }
        switch (chart.selectionMode) {
        case 'DragX':
            dragRect.y = cartesianLayout.y;
            dragRect.height = cartesianLayout.height;
            break;
        case 'DragY':
            dragRect.x = cartesianLayout.x;
            dragRect.width = cartesianLayout.width;
            break;
        }
        if ((dragRect.width < 5 || dragRect.height < 5) && !isLasso) {
            return null;
        }
        const isDragMode: boolean = chart.selectionMode.indexOf('Drag') > -1 || chart.selectionMode === 'Lasso';
        if ((chart.allowMultiSelection) && isDragMode) {
            let element: Element;
            let dragGroup: Element;
            let multiGroup: Element = getElement(this.multiRectGroup);
            if (!multiGroup) {
                multiGroup = chart.svgRenderer.createGroup({ id: this.multiRectGroup });
                chart.svgObject.appendChild(multiGroup);
            }
            if (this.rectGrabbing || this.resizing) {
                const rectElement: Element = getElement(this.draggedRect + this.targetIndex);
                if (rectElement.nextSibling) {
                    remove(rectElement.nextSibling);
                }
                this.setAttributes(rectElement, dragRect);
            } else if (!getElement(this.draggedRectGroup + this.count)) {
                dragGroup = chart.svgRenderer.createGroup({ id: this.draggedRectGroup + this.count });
                const svgElement: HTMLElement = document.getElementById(chart.element.id + '_series_svg');
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                chart.enableCanvas ? svgElement.appendChild(dragGroup) : multiGroup.appendChild(dragGroup);
            }
            if (!(chart.selectionMode === 'Lasso')) {
                element = chart.svgRenderer.drawRectangle(new RectOption(
                    this.draggedRect + this.count, rectFill, { color: rectStroke, width: 1 }, 1, dragRect));
                (element as HTMLElement).style.cursor = 'move';
            } else {
                element = chart.svgRenderer.drawPath(
                    new PathOption(
                        this.lassoPath + this.count, rectFill, 3,
                        rectStroke, 1, '', this.path
                    )
                );
            }
            if (!dragGroup && !this.rectGrabbing && !this.resizing) {
                getElement(this.draggedRectGroup + this.count).appendChild(element);
            } else if (!this.rectGrabbing && !this.resizing) {
                dragGroup.appendChild(element);
            }
        } else {
            let element: Element = isLasso ?
                getElement(this.lassoPath) : getElement(this.draggedRect);
            if (this.closeIcon) { removeElement(this.closeIconId); }
            if (element) {
                if (isLasso) {
                    element.setAttribute('d', this.path);
                } else {
                    this.setAttributes(element, dragRect);
                }
            } else {
                const dragGroup: Element = chart.svgRenderer.createGroup({ id: this.draggedRectGroup });
                const svgElement: HTMLElement = document.getElementById(chart.element.id + '_series_svg');
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                chart.enableCanvas ? svgElement.appendChild(dragGroup) : chart.svgObject.appendChild(dragGroup);
                if (!(chart.selectionMode === 'Lasso')) {
                    element = chart.svgRenderer.drawRectangle(new RectOption(
                        this.draggedRect, rectFill, { color: rectStroke, width: 1 }, 1, dragRect));
                } else {
                    element = chart.svgRenderer.drawPath(new PathOption(this.lassoPath, rectFill, 3, rectStroke, 1, '', this.path));
                }
                //element.setAttribute('style', 'cursor:move;');
                dragGroup.appendChild(element);
            }
        }
    }

    /**
     * To get drag selected group element index from its id
     *
     * @param {string} id element id
     */
    private getIndex(id: string): number {
        let i: number;
        for (i = id.length - 1; i > 0; i--) {
            const x: number = Number(id[i as number]);
            if (!isNaN(x)) {
                continue;
            } else {
                break;
            }
        }
        const index: number = +id.substr(i + 1, id.length - 1);
        return index;
    }
    private createCloseButton(x: number, y: number): void {
        const isMultiDrag: boolean = this.chart.allowMultiSelection;
        const circleStroke: string = this.chart.themeStyle.selectionCircleStroke;
        const isDrag: boolean = this.rectGrabbing || this.resizing;
        const closeIcon: Element = this.chart.svgRenderer.createGroup({
            id: this.closeIconId + (isMultiDrag ? (isDrag ? this.targetIndex : this.count) : ''),
            style: 'cursor:pointer; visibility: visible;'
        });
        closeIcon.appendChild(this.chart.svgRenderer.drawCircle(
            new CircleOption(
                this.closeIconId + '_circle' + (isMultiDrag ? (isDrag ? this.targetIndex : this.count) : ''), '#FFFFFF',
                { color: circleStroke, width: 1 }, 1, x, y, 10)
        ));
        const direction: string = 'M ' + (x - 4) + ' ' + (y - 4) + ' L ' + (x + 4) + ' ' + (y + 4) + ' M ' + (x - 4) + ' ' + (y + 4) +
            ' L ' + (x + 4) + ' ' + (y - 4);
        closeIcon.appendChild(this.chart.svgRenderer.drawPath(
            {
                id: this.closeIconId + '_cross' +
                    (isMultiDrag ? (isDrag ? this.targetIndex : this.count) : ''), d: direction,
                stroke: circleStroke, 'stroke-width': 2, fill: circleStroke
            })
        );
        this.closeIcon = closeIcon;
        const pathElement: Element = getElement(this.draggedRectGroup + (isMultiDrag ? (isDrag ? this.targetIndex : this.count) : ''));
        if (pathElement) {
            pathElement.appendChild(closeIcon);
        }
    }
    /**
     * Method to remove dragged element.
     *
     * @returns {void}
     * @private
     */

    public removeDraggedElements(chart: Chart, targetElement: HTMLElement, eventType: string): void {
        if ((targetElement.id && targetElement.id.indexOf(this.closeIconId) > -1) && (eventType.indexOf('move') === -1)) {
            let isSelectedvalues: boolean = true;
            if ((chart.allowMultiSelection)) {
                const index: number = this.getIndex(targetElement.id);
                const multiRectGroupElement: Element = getElement(this.multiRectGroup);
                remove(getElement(this.draggedRectGroup + index));
                this.dragRectArray[index as number] = null;
                this.filterArray[index as number] = null;
                this.totalSelectedPoints[index as number] = null;
                if (multiRectGroupElement && multiRectGroupElement.childElementCount === 0) {
                    removeElement(multiRectGroupElement);
                    this.dragRectArray = [];
                    this.filterArray = [];
                    this.totalSelectedPoints = [];
                }
                if (this.currentMode === 'Lasso') {
                    if (this.multiDataIndexes[index as number] != null) {
                        for (let i: number = 0; i < this.multiDataIndexes[index as number].length; i++) {
                            this.multiDataIndexes[index as number][i as number].isSelect = false;
                        }
                    }
                    this.multiDataIndexes[index as number] = null;
                    for (let j: number = 0; j < this.multiDataIndexes.length; j++) {
                        if (this.multiDataIndexes[j as number] != null) {
                            isSelectedvalues = false;
                            for (let k: number = 0; k < this.multiDataIndexes[j as number].length; k++) {
                                this.multiDataIndexes[j as number][k as number].isSelect = true;
                            }
                        }
                    }
                    this.calculateDragSelectedElements(chart, this.dragRect, true);
                } else if (this.filterArray.length) {
                    for (let i: number = 0; i < this.filterArray.length; i++) {
                        if (this.filterArray[i as number]) {
                            isSelectedvalues = false;
                            this.calculateDragSelectedElements(chart, this.filterArray[i as number], true);
                        }
                    }
                } else {
                    this.calculateDragSelectedElements(chart, new Rect(0, 0, 0, 0), true);
                }
            } else {
                remove(getElement(this.draggedRectGroup));
                this.removeSelectedElements(chart, this.selectedDataIndexes, chart.series);
            }
            this.blurEffect(chart.element.id, chart.visibleSeries);
            this.changeCursorStyle(false, chart.svgObject, 'auto');
            if (!(chart.allowMultiSelection) || isSelectedvalues) {
                this.rectPoints = null;
            }
        }
    }
    /**
     * Method to resize the drag rect.
     *
     * @returns {void}
     * @private
     */
    public resizingSelectionRect(chart: Chart, location: ChartLocation, tapped?: boolean, target?: Element): void {
        let rect: Rect;
        if (((chart.allowMultiSelection) && (target.id.indexOf('_ej2_drag_rect') > -1)) ||
            this.dragRectArray[this.targetIndex]) {
            if (target.id.indexOf('_ej2_drag_rect') > -1) {
                this.targetIndex = this.getIndex(target.id);
            }
            const r: Rect = this.dragRectArray[this.targetIndex];
            rect = new Rect(r.x, r.y, r.width, r.height);
        }
        if (!(chart.allowMultiSelection)) {
            rect = new Rect(this.rectPoints.x, this.rectPoints.y, this.rectPoints.width, this.rectPoints.height);
        }
        if (rect) {
            const resize: boolean = this.findResizeMode(chart.svgObject, rect, location);
            if (this.resizing) {
                rect = getDraggedRectLocation(
                    rect.x, rect.y, (rect.x + rect.width), (rect.y + rect.height),
                    chart.chartAxisLayoutPanel.seriesClipRect
                );
                this.drawDraggingRect(chart, rect);
                this.dragRect = rect;
            }
            if (tapped) {
                this.resizing = resize;
            }
        } else {
            return;
        }
    }
    private findResizeMode(chartSvgObject: Element, rect: Rect, location: ChartLocation): boolean {
        let cursorStyle: string = 'se-resize';
        let resize: boolean = false;
        if (!this.resizing) {
            const resizeEdges: Rect[] = [new Rect(rect.x, (rect.y), rect.width - 5, 5), // top
                new Rect((rect.x), rect.y, 5, rect.height), //left
                new Rect(rect.x, (rect.y + rect.height - 5), rect.width - 5, 5), //bottom
                new Rect((rect.x + rect.width - 5), rect.y + 5, 5, rect.height - 15), //right
                new Rect((rect.x + rect.width - 10), (rect.y + rect.height - 10), 10, 10)]; //corner
            for (let i: number = 0; i < resizeEdges.length; i++) {
                if (withInBounds(location.x, location.y, resizeEdges[i as number])) {
                    cursorStyle = (i === 4) ? cursorStyle : (i % 2 === 0) ? 'ns-resize' : 'ew-resize';
                    resize = true;
                    this.resizeMode = i;
                    break;
                }
            }
        } else {
            const x: number = rect.x;
            const y: number = rect.y;
            let width: number = (location.x - x);
            let height: number = (location.y - y);
            switch (this.resizeMode) {
            case 0:
                height = Math.abs((rect.height + rect.y) - location.y);
                rect.y = Math.min((rect.height + rect.y), location.y);
                rect.height = height;
                break;
            case 1:
                width = Math.abs((rect.width + rect.x) - location.x);
                rect.x = Math.min((rect.width + rect.x), location.x);
                rect.width = width;
                break;
            case 2:
                rect.height = Math.abs(height);
                rect.y = Math.min(location.y, y);
                break;
            case 3:
                rect.width = Math.abs(width);
                rect.x = Math.min(location.x, x);
                break;
            case 4:
                rect.width = Math.abs(width);
                rect.height = Math.abs(height);
                rect.x = Math.min(location.x, x);
                rect.y = Math.min(location.y, y);
                break;
            }
        }
        if (this.currentMode !== 'Lasso') {
            this.changeCursorStyle(
                resize, getElement((this.chart.allowMultiSelection) ? this.draggedRect +
                    this.targetIndex : this.draggedRect),
                cursorStyle
            );
        }
        this.changeCursorStyle(resize, chartSvgObject, cursorStyle);
        return resize;
    }
    private changeCursorStyle(isResize: boolean, rectelement: Element, cursorStyle: string): void {
        cursorStyle = isResize ? cursorStyle : (this.control.svgObject === rectelement) ? 'auto' : 'move';
        if (rectelement) {
            (rectelement as HTMLElement).style.cursor = cursorStyle;
        }
    }
    private removeSelectedElements(chart: Chart, index: Index[], seriesCollection: SeriesModel[]): void {
        index = chart.isRedrawSelection ? index : index.splice(0, index.length); // No need to remove selected indexes while redrawing
        let seriesElements: Element[];
        for (const series of seriesCollection) {
            if (series.visible) {
                seriesElements = this.getSeriesElements(series);
                this.removeStyles(seriesElements);
                for (const seriesElement of seriesElements) {
                    this.removeStyles(this.getChildren(seriesElement));
                }
            }
        }
    }
    private setAttributes(ele: Element, object: Object): void {
        const keys: string[] = Object.keys(object);
        for (const key of keys) {
            ele.setAttribute(key, object[key as string]);
        }
    }
    /**
     * Method to move the dragged rect.
     *
     * @returns {void}
     * @private
     */
    public draggedRectMoved(chart: Chart, grabbedPoint: Rect, doDrawing?: boolean, target?: Element): void {
        let rect: Rect;
        if ((this.resizing || this.rectGrabbing) && (chart.allowMultiSelection)) {
            const r: Rect = this.dragRectArray[this.targetIndex];
            rect = new Rect(r.x, r.y, r.width, r.height);
        } else {
            rect = new Rect(this.rectPoints.x, this.rectPoints.y, this.rectPoints.width, this.rectPoints.height);
        }
        rect.x -= (grabbedPoint.x - chart.mouseX);
        rect.y -= (grabbedPoint.y - chart.mouseY);
        rect = getDraggedRectLocation(rect.x, rect.y, rect.x + rect.width, rect.height + rect.y, chart.chartAxisLayoutPanel.seriesClipRect);
        if (doDrawing) {
            this.drawDraggingRect(chart, rect);
        } else {
            this.calculateDragSelectedElements(chart, rect);
        }
    }

    private mouseLeave(event: Event): void {
        this.completeSelection(event.target as HTMLElement, event.type);
    }
    /**
     * To complete the selection.
     *
     * @returns {void}
     * @private
     */
    public completeSelection(target: HTMLElement, eventType: string): void {
        const chart: Chart = this.chart;
        if (chart.selectionMode === 'None') {
            return;
        }
        this.currentMode = chart.selectionMode;
        if ((this.dragging || this.resizing) && this.dragRect.width > 5 && this.dragRect.height > 5) {
            this.calculateDragSelectedElements(chart, this.dragRect);
        } else if (!(chart.allowMultiSelection) && this.rectGrabbing &&
            this.rectPoints.width && this.rectPoints.height) {
            this.draggedRectMoved(chart, this.dragRect);
        } else if (this.rectGrabbing && this.dragRectArray[this.targetIndex].width && this.dragRectArray[this.targetIndex].height) {
            this.draggedRectMoved(chart, this.dragRect);
        }
        if (chart.selectionMode === 'Lasso' && this.dragging && this.path) {
            if ((this.path as String).indexOf('L') !== -1) {
                if (!(chart.allowMultiSelection)) {
                    getElement(this.lassoPath).setAttribute('d', this.path + 'Z');
                    this.pointChecking(getElement(this.lassoPath) as SVGPathElement);
                } else if (getElement(this.lassoPath + this.count)) {
                    getElement(this.lassoPath + this.count).setAttribute('d', this.path + 'Z');
                    this.pointChecking(getElement(this.lassoPath + this.count) as SVGPathElement);
                }
                if (this.dragging || this.resizing) {
                    this.calculateDragSelectedElements(chart, this.dragRect);
                }
            }
        }
        this.dragging = false;
        this.rectGrabbing = false;
        this.resizing = false;
        this.removeDraggedElements(chart, target, eventType);
    }
    private getDragRect(chart: Chart, seriesClipRect: Rect): Rect {
        return getDraggedRectLocation(chart.mouseDownX, chart.mouseDownY, chart.mouseX, chart.mouseY, seriesClipRect);
    }

    /** @private */
    public dragStart(chart: Chart, seriesClipRect: Rect, mouseDownX: number, mouseDownY: number, event: Event): void {
        const mode: SelectionMode = chart.selectionMode;
        this.currentMode = chart.selectionMode;
        this.dragging = (mode.indexOf('Drag') > - 1 || mode === 'Lasso') && (chart.isDoubleTap || !chart.isTouch) &&
            chart.chartAreaType !== 'PolarRadar';
        const target: HTMLElement = <HTMLElement>event.target;
        this.path = undefined;
        if (this.dragging) {
            this.count = getElement(this.multiRectGroup) ? (this.count + 1) : 0;
            this.dragRect = new Rect(chart.mouseDownX, chart.mouseDownY, 0, 0);
            if (chart.mouseDownX < seriesClipRect.x || chart.mouseDownX > (seriesClipRect.x + seriesClipRect.width) ||
                chart.mouseDownY < seriesClipRect.y || chart.mouseDownY > (seriesClipRect.y + seriesClipRect.height)) {
                this.dragging = false;
            }
        }
        if (mode === 'Lasso') {
            for (const series of chart.visibleSeries) {
                if (series.visible) {
                    for (const point of series.points) {
                        if (!(chart.allowMultiSelection)) {
                            point.isSelect = false;
                        }
                    }
                }
            }
        }
        if (!(mode === 'Lasso')) {
            if (this.rectPoints && !(chart.allowMultiSelection)) {
                this.dragRect = new Rect(chart.mouseDownX, chart.mouseDownY, 0, 0);
                this.resizingSelectionRect(chart, new ChartLocation(mouseDownX, mouseDownY), true);
                this.rectGrabbing = withInBounds(mouseDownX, mouseDownY, this.rectPoints);
            }
            if ((chart.allowMultiSelection)) {
                const index: number = this.getIndex(target.id);
                this.targetIndex = this.isDragRect(target.id) ? index : undefined;
                if (this.dragRectArray.length && this.isDragRect(target.id)) {
                    this.resizingSelectionRect(chart, new ChartLocation(mouseDownX, mouseDownY), true, target);
                    this.rectGrabbing = withInBounds(mouseDownX, mouseDownY, this.dragRectArray[index as number]);
                }
            }
        }
    }

    private isDragRect(id: string): boolean {
        return id.indexOf('_ej2_drag_rect') > -1;
    }
    /** @private */
    public mouseMove(event: PointerEvent | TouchEvent): void {
        const chart: Chart = this.chart;
        const target: Element = <Element>event.target;
        const eventType: string = event.type;
        this.highlightChart(target, eventType);
        if (chart.selectionMode === 'None') {
            return;
        }
        if (eventType === 'touchmove' && (Browser.isIos || Browser.isIos7) && this.dragging && event.preventDefault) {
            event.preventDefault();
        }
        this.selectionAndDrag(chart, target, eventType);
    }

    /**
     * highlight parts
     *
     * @private
     */
    public highlightChart(target: Element, eventType: string): void {
        if (this.chart.highlightMode !== 'None' || this.chart.legendSettings.enableHighlight) {
            if (!isNullOrUndefined(target)) {
                if (target.id.indexOf('_legend_text') > 1) {
                    target = getElement(target.id.replace('text', 'shape'));
                }
                if ((target).hasAttribute('class') && ((target).getAttribute('class').indexOf('highlight') > -1 ||
                    target.getAttribute('class').indexOf('selection') > -1)) {
                    return;
                }
                this.calculateSelectedElements(target as HTMLElement, eventType);
                if (this.chart.highlightModule.highlightDataIndexes && this.chart.highlightModule.highlightDataIndexes.length > 0 &&
                    target.id.indexOf('_chart_legend_') === -1 && target.id.indexOf('_Series_') === -1) {
                    this.removeLegendHighlightStyles();
                }
            }
            return;
        }
    }

    /**
     * selection and drag selection
     *
     * @private
     */
    public selectionAndDrag(chart: Chart, target: Element, eventType: string): void {
        const insideMoving: boolean = withInBounds(chart.mouseX, chart.mouseY, chart.chartAxisLayoutPanel.seriesClipRect);
        if (insideMoving && !this.chart.enableCanvas) {
            if (this.rectGrabbing && !this.resizing) {
                this.draggedRectMoved(chart, this.dragRect, true, target);
            } else if (this.dragging && !this.resizing) {
                if (chart.selectionMode === 'Lasso') {
                    this.getPath(chart.mouseDownX, chart.mouseDownY, chart.mouseX, chart.mouseY);
                    this.drawDraggingRect(chart, this.dragRect);
                } else {
                    this.dragRect = this.getDragRect(chart, chart.chartAxisLayoutPanel.seriesClipRect);
                    this.drawDraggingRect(chart, this.dragRect);
                }
            }
            if (this.rectPoints && !(chart.allowMultiSelection)) {
                this.resizingSelectionRect(chart, new ChartLocation(chart.mouseX, chart.mouseY), null, target);
            } else if (((chart.allowMultiSelection) && !this.dragging) || this.resizing) {
                this.resizingSelectionRect(chart, new ChartLocation(chart.mouseX, chart.mouseY), null, target);
            }
        } else {
            this.completeSelection(target as HTMLElement, eventType);
        }
    }
    /**
     * remove highlighted legend when not focused.
     *
     * @private
     */
    public removeLegendHighlightStyles(): void {
        this.chart.highlightModule.highlightDataIndexes = [];
        let elementCollection: HTMLCollection;
        for (let i: number = 0; i < this.chart.visibleSeries.length; i++) {
            elementCollection = document.getElementsByClassName(this.generateStyle(this.chart.visibleSeries[i as number]));
            if (this.selectedDataIndexes.length === 0) {
                elementCollection = document.getElementsByClassName(this.generateStyle(this.chart.visibleSeries[i as number]));
                while (elementCollection.length > 0) {
                    const element: HTMLElement = elementCollection[0] as HTMLElement;
                    if (element) {
                        this.removeSvgClass(element, element.getAttribute('class'));
                    }
                }
                elementCollection = document.getElementsByClassName(this.unselected);
                while (elementCollection.length > 0) {
                    const element: HTMLElement = elementCollection[0] as HTMLElement;
                    if (element) {
                        this.removeSvgClass(element, element.getAttribute('class'));
                    }
                }
            } else {
                elementCollection = document.getElementsByClassName(this.generateStyle(this.chart.visibleSeries[i as number]));
                while (elementCollection.length > 0) {
                    const element: HTMLElement = elementCollection[0] as HTMLElement;
                    if (element) {
                        this.removeSvgClass(element, element.getAttribute('class'));
                        this.addSvgClass(element, this.unselected);
                    }
                }
            }
        }
    }

    private getPath(startX: number, startY: number, endX: number, endY: number): void {
        if (this.dragging) {
            if (this.path) {
                this.path = this.path + ' L' + endX + ' ' + endY;
            } else {
                this.path = 'M ' + startX + ' ' + startY;
            }
        }
    }

    private pointChecking(path: SVGPathElement): void {
        const chart: Chart = this.chart;
        let element: SVGPathElement;
        const svgRect: ClientRect = getElement(chart.svgId).getBoundingClientRect();
        const offsetX: number = chart.chartAxisLayoutPanel.seriesClipRect.x + Math.max(svgRect.left, 0);
        const offsetY: number = chart.chartAxisLayoutPanel.seriesClipRect.y + Math.max(svgRect.top, 0);
        this.multiDataIndexes[this.count] = [];
        for (const series of chart.visibleSeries) {
            series.points.filter((point: Points) => {
                // To check whether the point have symbol location value or not.
                if (point.symbolLocations && point.symbolLocations.length) {
                    element = document.elementFromPoint(
                        point.symbolLocations[0].x + offsetX,
                        point.symbolLocations[0].y + offsetY
                    ) as SVGPathElement;
                }
                if (element === path) {
                    point.isSelect = true;
                    if ((this.chart.allowMultiSelection) && this.currentMode === 'Lasso') {
                        this.multiDataIndexes[this.count][this.seriesIndex] = point;
                        this.seriesIndex++;
                    }
                } else if (!(chart.allowMultiSelection)) {
                    point.isSelect = false;
                }
            });
        }
        this.seriesIndex = 0;
    }

    /**
     * Get module name.
     *
     * @private
     */
    public getModuleName(): string {
        return 'Selection';
    }
    /**
     * To destroy the selection.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        this.removeEventListener();
        // Destroy method performed here
    }
}
