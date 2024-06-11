/**
 * Selection source file
 */
import { Browser } from '@syncfusion/ej2-base';
import { extend, isNullOrUndefined } from '@syncfusion/ej2-base';
import { getElement } from '../../common/utils/helper';
import { HighlightMode } from '../../common/utils/enum';
import { Chart3DSelectionMode } from '../utils/enum';
import { Chart3D } from '../../chart3d';
import { Chart3DSeries, Chart3DPoint } from '../series/chart-series';
import { Chart3DSeriesModel } from '../series/chart-series-model';
import { Indexes, Index } from '../../common/model/base';
import { selectionComplete } from '../../common/model/constants';
import { BaseSelection } from '../../common/user-interaction/selection';
import { Chart3DSelectionCompleteEventArgs } from '../model/chart3d-Interface';

/**
 * The `Selection` module handles the selection for chart.
 *
 * @private
 */
export class Selection3D extends BaseSelection {
    /** @private */
    public isSeriesMode: boolean;
    /** @private */
    public selectedDataIndexes: Indexes[];
    /** @private */
    public highlightDataIndexes: Indexes[];
    public seriesIndex: number = 0;
    /** @private */
    public series: Chart3DSeries[];
    /** @private */
    public chart: Chart3D;
    /** @private */
    public currentMode: Chart3DSelectionMode | HighlightMode;
    /** @private */
    public previousSelectedEle: Element[];

    /**
     * Constructor for selection module.
     *
     * @param {Chart3D} chart - Chart3D instance.
     * @private
     */
    constructor(chart: Chart3D) {
        super(chart);
        this.chart = chart;
        this.addEventListener();
    }

    /**
     * Binding events for selection module.
     *
     * @returns {void}
     */
    private addEventListener(): void {
        if (this.chart.isDestroyed) { return; }
        const cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        this.chart.on(Browser.touchMoveEvent, this.mouseMove, this);
        this.chart.on(cancelEvent, this.mouseLeave, this);
        this.chart.on('click', this.mouseClick, this);
        this.chart.on(Browser.touchStartEvent, this.mousedown, this);
        this.chart.on(Browser.touchEndEvent, this.mouseLeave, this);
    }

    /**
     * Handles the mouse down event.
     *
     * @returns {void}
     */
    private mousedown(): void {
        const chart: Chart3D = this.chart;
        if (chart.isPointMouseDown || chart.selectionMode === 'Point') {
            return;
        }
    }

    /**
     * Unbinding events for selection module.
     *
     * @returns {void}
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
     *
     * @param {Chart3D} chart - Chart3D instance.
     * @returns {void}
     */
    private initPrivateVariables(chart: Chart3D): void {
        this.styleId = chart.element.id + '_ej2_chart_selection';
        this.unselected = chart.element.id + '_ej2_deselected';
        this.selectedDataIndexes = [];
        this.isSeriesMode = chart.selectionMode === 'Series';
    }

    /**
     * Method to select the point and series.
     *
     * @param {Chart3D} chart - Chart3D instance
     * @returns {void}
     */
    public invokeSelection(chart: Chart3D): void {
        this.initPrivateVariables(chart);
        this.series = <Chart3DSeries[]>extend({}, chart.visibleSeries, null, true);
        this.seriesStyles();
        this.currentMode = chart.selectionMode;
        this.selectDataIndex(chart, this.concatIndexes(chart.selectedDataIndexes, this.selectedDataIndexes));
    }

    /**
     * Generates the style for the series.
     *
     * @param {Chart3DSeriesModel} series - The series for which the style is generated.
     * @returns {string} - The generated style string.
     */
    public generateStyle(series: Chart3DSeriesModel): string {
        if (series) {
            return (this.styleId + '_series_' + (<Chart3DSeries>series).index);
        }
        return 'undefined';
    }

    /**
     * Selects the specified data indexes in the Chart3D.
     * This method is responsible for handling the selection of specific data indexes in the Chart3D.
     *
     * @param {Chart3D} chart - The Chart3D instance in which the data indexes are selected.
     * @param {Index[]} indexes - An array of Index objects representing the data indexes to be selected.
     * @returns {void}
     */
    public selectDataIndex(chart: Chart3D, indexes: Index[]): void {
        for (const index of indexes) {
            this.performSelection(index, chart, this.getElementByIndex(chart, index)[0]);
        }
    }

    /**
     * Retrieves the elements in the Chart3D associated with the specified data index.
     *
     * This method is responsible for obtaining the elements in the Chart3D related to the specified data index.
     *
     * @param {Chart3D} chart - The Chart3D instance containing the elements.
     * @param {Index} index - An Index object representing the data index.
     * @returns {Element[]} An array of Element objects representing the elements associated with the specified data index.
     */
    public getElementByIndex(chart: Chart3D, index: Index): Element[] {
        const pointElements: Element[] = [];
        const elements: NodeListOf<HTMLElement> = document.querySelectorAll('[id*="-region-series-' + index.series + '-point-' + index.point + '"]');
        elements.forEach((pointElement: Element) => {
            pointElements.push(pointElement as Element);
        });
        return pointElements;
    }

    /**
     * This method is responsible for obtaining the clustered elements in the Chart3D related to the specified data index.
     * Clustering typically involves obtaining a group of related elements for a specific data index.
     *
     * @param {Chart3D} chart - The Chart3D instance containing the clustered elements.
     * @param {Index} index - An Index object representing the data index.
     * @returns {Element[]} An array of Element objects representing the clustered elements associated with the specified data index.
     */
    public getClusterElements(chart: Chart3D, index: Index): Element[] {
        const clusters: Element[] = [];
        for (const series of chart.visibleSeries) {
            if (series.visible) {
                index = new Index(series.index, index.point);
                const pointElements: Element[] = this.getElementByIndex(chart, index);
                for (let i: number = 0; i < pointElements.length; i++) {
                    clusters.push(pointElements[i as number]);
                }
            }
        }
        return clusters;
    }

    /**
     * Method to get the selected element.
     *
     * @param {Chart3D} chart - The Chart3D instance to which the series belongs.
     * @param {Chart3DSeriesModel} series - The series in which the data point is located.
     * @param {Index} index - The index or position of the data point within the series.
     * @returns {Element[]} An array of elements associated with the specified data point in the Chart3D.
     * @private
     */
    public findElements(chart: Chart3D, series: Chart3DSeriesModel, index: Index): Element[] {
        if (this.isSeriesMode) {
            return this.getSeriesElements(series);
        } else if (this.currentMode === 'Cluster') {
            return this.getClusterElements(chart, index);
        } else {
            return this.getElementByIndex(chart, index);
        }
    }

    /**
     * Checks whether the specified element is already selected in the Chart3D.
     *
     * @param {Element} targetElem - The target element to check for selection status.
     * @param {string} eventType - The type of event triggering the selection check (e.g., 'click', 'hover').
     * @param {Index} [index] - Optional. The index or position of the data point within the series.
     * @returns {boolean} A boolean indicating whether the specified element is already selected.
     */
    public isAlreadySelected(targetElem: Element, eventType: string, index?: Index): boolean {
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
            let isElement: boolean;
            const nodeName: string | null = targetElem.nodeName;
            if (targetElem.parentNode) {
                isElement = ((nodeName === 'path' || nodeName === 'shape') && targetElem.id.indexOf('region') > 1) ? true : false;
            }
            for (let i: number = 0; i < this.previousSelectedEle.length; i++) {
                if (this.previousSelectedEle[i as number].hasAttribute('class')) {
                    if (this.previousSelectedEle[i as number].getAttribute('class').indexOf('highlight') > -1 &&
                        (isElement || eventType === 'click')) {
                        let selectionClass: string;
                        this.previousSelectedEle[i as number].classList.forEach((className: string) => {
                            if (className.indexOf('selection') > -1) {
                                selectionClass = className;
                            }
                        });
                        this.previousSelectedEle[i as number].removeAttribute('class');
                        if (selectionClass) {
                            this.addSvgClass(this.previousSelectedEle[i as number], selectionClass);
                        }
                        this.previousSelectedEle[i as number].classList.remove(this.styleId + '_series_' + index.series);
                        if (this.chart.highlightColor !== '' && !isNullOrUndefined(this.chart.highlightColor) && this.chart.highlightPattern === 'None') {
                            this.previousSelectedEle[i as number].setAttribute('fill', (this.control as Chart3D).visibleSeries[this.indexFinder(this.previousSelectedEle[i as number].id).series].interior);
                        }
                        this.addOrRemoveIndex(this.highlightDataIndexes,
                                              this.indexFinder((<HTMLElement>this.previousSelectedEle[i as number]).id));
                    } else if (!isElement && this.previousSelectedEle[i as number].getAttribute('class').indexOf('highlight') > -1) {
                        this.performSelection(this.indexFinder(this.previousSelectedEle[i as number].id), this.chart,
                                              this.previousSelectedEle[i as number]);
                    }
                }
            }
        }
        return true;
    }

    /**
     * Handles the mouse click event in the Chart3D, triggering the calculation of selected elements.
     *
     * @param {Event} event - The mouse click event object.
     * @returns {void}
     */
    private mouseClick(event: Event): void {
        if (!this.chart.rotateActivate) {
            this.calculateSelectedElements(event.target as HTMLElement, event.type);
        }
    }

    /**
     * Calculates the selected elements based on the provided target element and event type.
     *
     * @param {HTMLElement} targetElement - The target HTML element that triggered the selection.
     * @param {string} eventType - The type of the event that triggered the selection (e.g., mouse click).
     * @returns {void}
     */
    public calculateSelectedElements(targetElement: HTMLElement, eventType: string): void {
        if (isNullOrUndefined(targetElement)) {
            return;
        }
        if ((this.chart.selectionMode === 'None' && this.chart.highlightMode === 'None') ||
            targetElement.id && targetElement.id.indexOf(this.chart.element.id + '-') === -1) {
            return;
        }
        if (eventType === 'mousemove' || eventType === 'pointermove') {
            if (targetElement.hasAttribute('class') && (targetElement.getAttribute('class').indexOf('highlight') > -1 ||
                targetElement.getAttribute('class').indexOf('selection') > -1)) {
                return;
            }
        }
        this.isAlreadySelected(targetElement, eventType, this.indexFinder(targetElement.id));
        if (targetElement.id && targetElement.id.indexOf('-series-') > -1 && targetElement.id.indexOf('_Text_') === -1) {
            let element: Element;
            this.performSelection(this.indexFinder(targetElement.id), this.chart, element || <Element>targetElement);
        }
    }

    /**
     * Performs selection based on the provided index, chart, and optional element.
     *
     * @param {Index} index - The index or indices specifying the data points or elements to be selected.
     * @param {Chart3D} chart - The Chart3D instance where the selection is being performed.
     * @param {Element} [element] - Optional. The specific HTML element that triggered the selection.
     * @returns {void}
     */
    public performSelection(index: Index, chart: Chart3D, element?: Element): void {
        this.isSeriesMode = this.currentMode === 'Series';
        switch (this.currentMode) {
        case 'Series':
            this.selection(chart, index, this.getSeriesElements(chart.series[index.series as number]));
            this.selectionComplete(chart, index, this.currentMode);
            this.blurEffect(chart.element.id, chart.visibleSeries);
            break;
        case 'Point':
            if (!isNaN(index.point) && element) {
                this.selection(chart, index, this.getElementByIndex(chart, index));
                this.selectionComplete(chart, index, this.currentMode);
                this.blurEffect(chart.element.id, chart.visibleSeries);
            }
            break;
        case 'Cluster':
            if (!isNaN(index.point)) {
                this.clusterSelection(chart, index);
                this.selectionComplete(chart, index, this.currentMode);
                this.blurEffect(chart.element.id, chart.visibleSeries);
            }
            break;
        }
    }

    /**
     * Handles the completion of a selection process in the Chart3D.
     *
     * @param {Chart3D} chart - The Chart3D instance where the selection process is completed.
     * @param {Index} index - The selected index or indices representing the data points or elements.
     * @param {Chart3DSelectionMode  | HighlightMode} selectionMode - The mode of selection, either SelectionMode or HighlightMode.
     * @returns {void}
     */
    public selectionComplete(chart: Chart3D, index: Index, selectionMode: Chart3DSelectionMode  | HighlightMode): void {
        let points: Chart3DPoint[]; let pointIndex: number; let seriesIndex: number;
        const selectedPointValues: { x?: string | number | Date, y?: number, seriesIndex?: number, pointIndex?: number }[] = [];
        let yValue: number; let selectedPointX: string | number | Date;
        if (selectionMode === 'Cluster') {
            for (const series of chart.visibleSeries) {
                if (series.visible) {
                    for (let i: number = 0; i < this.selectedDataIndexes.length; i++) {
                        pointIndex = chart.isMultiSelect ? this.selectedDataIndexes[i as number].point : index.point;
                        seriesIndex = series.index;
                        points = (<Chart3DSeries>series).points;
                        if (!isNaN(pointIndex)) {
                            yValue =  points[pointIndex as number].yValue;
                            selectedPointX = points[pointIndex as number].xValue;
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
                seriesIndex = (this.selectedDataIndexes.length > 0) ? this.selectedDataIndexes[0].series :
                    (this.highlightDataIndexes && this.highlightDataIndexes.length > 0) ? this.highlightDataIndexes[0].series : 0;
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
                const series: Chart3DSeriesModel = chart.series[seriesIndex as number];
                points = (<Chart3DSeries>series).points;
                if (!isNaN(pointIndex)) {
                    selectedPointX = points[pointIndex as number].xValue;
                    yValue = points[pointIndex as number].yValue;
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
        const args: Chart3DSelectionCompleteEventArgs = {
            selectedDataValues: selectedPointValues,
            cancel: false,
            chart: chart
        };
        chart.trigger(selectionComplete, args);
    }

    /**
     * Handles the selection process in the Chart3D.
     *
     * @param {Chart3D} chart - The Chart3D instance where the selection is taking place.
     * @param {Index} index - The selected index or indices representing the data points or elements.
     * @param {Element[]} selectedElements - The corresponding elements that are selected during the process.
     * @returns {void}
     */
    public selection(chart: Chart3D, index: Index, selectedElements: Element[]): void {
        if (!chart.isMultiSelect && (this.styleId.indexOf('highlight') === -1 &&
            chart.selectionMode !== 'None')) {
            this.removeMultiSelectElements(chart, this.selectedDataIndexes, index, chart.series);
        }
        const indexValue: number = index.series;
        if (!isNullOrUndefined(selectedElements[0])) {
            if ((<Chart3DSeries>chart.visibleSeries[indexValue as number]).isRectSeries) {
                if (selectedElements[0].id) {
                    if (document.getElementById(selectedElements[0].id + '_Symbol')) {
                        selectedElements.push(getElement(selectedElements[0].id + '_Symbol'));
                    }
                }
            }
            let isAdd: boolean;
            const className: string = selectedElements[0] && (selectedElements[0].getAttribute('class') || '');
            if (selectedElements[0] && className.indexOf(this.getSelectionClass(selectedElements[0].id)) > -1) {
                this.removeStyles(selectedElements);
            } else {
                this.previousSelectedEle = (chart.highlightMode !== 'None' || chart.legendSettings.enableHighlight) ? selectedElements : [];
                if (this.chart.selection3DModule) {
                    this.chart.selection3DModule.previousSelectedEle = selectedElements;
                }
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
     * Handles the cluster selection process in the Chart3D.
     *
     * @param {Chart3D} chart - The Chart3D instance where the cluster selection is taking place.
     * @param {Index} index - The selected index or indices representing the cluster.
     * @returns {void}
     */
    public clusterSelection(chart: Chart3D, index: Index): void {
        this.selection(chart, index, this.getClusterElements(chart, new Index(index.series, index.point)));
    }

    /**
     * Removes the selected elements during a multi-select operation in the Chart3D.
     *
     * @param {Chart3D} chart - The Chart3D instance where the multi-select operation is taking place.
     * @param {Index[]} index - An array of selected indices to be removed.
     * @param {Index} currentIndex - The current index representing the selection.
     * @param {Chart3DSeriesModel[]} seriesCollection - The collection of series in the Chart3D.
     * @returns {void}
     */
    public removeMultiSelectElements(
        chart: Chart3D, index: Index[], currentIndex: Index, seriesCollection: Chart3DSeriesModel[]): void {
        let series: Chart3DSeriesModel;
        for (let i: number = 0; i < index.length; i++) {
            series = seriesCollection[index[i as number].series];
            if ((this.isSeriesMode && !this.toEquals(index[i as number], currentIndex, this.isSeriesMode)) ||
                (this.currentMode === 'Cluster' && !this.toEquals(index[i as number], currentIndex, false)) ||
                (!this.isSeriesMode && this.toEquals(index[i as number], currentIndex, true) &&
                    !this.toEquals(index[i as number], currentIndex, false))) {
                this.removeStyles(this.findElements(chart, series, index[i as number]));
                index.splice(i, 1);
                i--;
            }
        }
    }

    /**
     * Applies a blur effect to the specified chart elements for visual emphasis.
     *
     * @param {string} chartId - The unique identifier of the target chart where the blur effect is applied.
     * @param {Chart3DSeries[]} visibleSeries - An array of visible series in the chart.
     * @returns {void}
     */
    public blurEffect(chartId: string, visibleSeries: Chart3DSeries[]): void {
        const visibility: boolean = (this.checkVisibility(this.highlightDataIndexes, this.chart) ||
            this.checkVisibility(this.selectedDataIndexes, this.chart));
        for (const series of visibleSeries) {
            const legendIndex: number = series.index;
            const legendStrokeColor: string = this.chart.visibleSeries[series.index].interior;
            const pointElements: Element[] = [];

            if (series.visible) {
                const elements: NodeListOf<HTMLElement> = document.querySelectorAll(`[id*="region-series-${series.index}"]`);
                elements.forEach((el: Element) => {
                    pointElements.push(el as HTMLElement);
                });
                this.checkSelectionElements(
                    pointElements,
                    this.generateStyle(series), visibility, legendIndex, legendStrokeColor
                );
                if (!isNullOrUndefined(getElement(chartId + 'SymbolGroup' + series.index))) {
                    this.checkSelectionElements(
                        pointElements,
                        this.generateStyle(series), visibility, legendIndex, legendStrokeColor
                    );
                }
            }
        }
    }

    /**
     * Checks the selection status of specified chart elements and updates their appearance.
     *
     * @param {Element[] | Element} element - The chart elements or a single element to be checked for selection.
     * @param {string} className - The CSS class name used to identify selected elements.
     * @param {boolean} visibility - A boolean indicating whether the elements should be visible or hidden based on selection.
     * @param {number} [series=0] - The index of the series if the specified elements are series.
     * @param {string} [legendStrokeColor='#D3D3D3'] - The stroke color used for legends when they are selected.
     * @returns {void}
     */
    public checkSelectionElements(element: Element[] | Element, className: string, visibility: boolean, series: number = 0, legendStrokeColor: string = '#D3D3D3'): void {
        let children: HTMLCollection | Element[] = <Element[]>(this.isSeriesMode ? element || [element] : element);
        if (this.chart.selectionMode !== 'None' && (this.chart.highlightMode !== 'None' || this.chart.legendSettings.enableHighlight)) {
            children = element as Element[];
        }
        let elementClassName: string; let parentClassName: string; let legendShape: Element;
        let selectElement: Element | Element[] = element;
        for (let i: number = 0; i < children.length; i++) {
            elementClassName = children[i as number].getAttribute('class') || '';
            parentClassName = (<Element>children[i as number].parentNode).getAttribute('class') || '';
            if (this.chart.selectionMode !== 'None' && (this.chart.highlightMode !== 'None' || this.chart.legendSettings.enableHighlight)) {
                className = elementClassName.indexOf('selection') > 0 ||
                    elementClassName.indexOf('highlight') > 0 ? elementClassName : className;
            }
            if (elementClassName.indexOf(className) === -1 &&
                parentClassName.indexOf(className) === -1 && visibility) {
                this.addSvgClass(children[i as number], this.unselected);
            } else {
                selectElement = children[i as number];
                if (elementClassName.indexOf(this.unselected) !== -1 && this.chart.tooltip3DModule &&  className.indexOf('highlight') > 0 ){
                    this.chart.highlightAnimation(children[i as number] as HTMLElement, series, 700, 0.3);
                }
                this.removeSvgClass(children[i as number], this.unselected);
                this.removeSvgClass(<Element>children[i as number].parentNode, this.unselected);
            }
        }
        if ((this.control as Chart3D).legend3DModule && (this.control as Chart3D).legendSettings.visible) {
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
                if ((selectElement as Element[]).length > 0) {
                    elementClassName = selectElement[0].getAttribute('class');
                    parentClassName = (<Element>selectElement[0].parentNode).getAttribute('class') || '';
                }
                else if (selectElement as Element) {
                    elementClassName = (selectElement as Element).getAttribute('class') || '';
                    parentClassName = (<Element>(selectElement as Element).parentNode).getAttribute('class') || '';
                }
                if (elementClassName.indexOf(className) === -1 && parentClassName.indexOf(className) === -1 && visibility) {
                    this.addSvgClass(legendShape, (this.chart.highlightMode === 'None' && this.chart.legendSettings.enableHighlight) ? className : this.unselected);
                    this.removeSvgClass(legendShape, className);
                    if (this.chart.highlightColor !== '' && !isNullOrUndefined(this.chart.highlightColor)) {
                        legendShape.setAttribute('stroke', (this.control as Chart3D).visibleSeries[series as number].interior);
                        if (this.chart.highlightPattern === 'None') {
                            legendShape.setAttribute('fill', (this.control as Chart3D).visibleSeries[series as number].interior);
                        }
                    }
                } else {
                    this.removeSvgClass(legendShape, this.unselected);
                    if (!isNullOrUndefined(this.chart.highlightColor) && this.chart.highlightColor !== '') {
                        legendShape.setAttribute('stroke', (this.control as Chart3D).visibleSeries[series as number].interior);
                        if (this.chart.highlightPattern === 'None') {
                            legendShape.setAttribute('fill', (this.control as Chart3D).visibleSeries[series as number].interior);
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
            }
        }
    }

    /**
     * Applies custom styles to the specified chart elements.
     *
     * @param {Element[]} elements - An array of chart elements to which custom styles will be applied.
     * @returns {void}
     */
    public applyStyles(elements: Element[]): void {
        for (const element of elements) {
            if (element) {
                this.removeSvgClass(<Element>element.parentNode, this.unselected);
                this.removeSvgClass(element, this.unselected);
                if (this.chart.series[0].pointColorMapping === 'fill') {
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
                if (this.chart.tooltip3DModule && this.getSelectionClass(element.id).indexOf('highlight') > 0) {
                    const index: number = parseFloat(element.id.split('-series-')[1].split('-point-')[0]);
                    this.chart.stopElementAnimation(element as HTMLElement, index);
                }
                if (this.styleId.indexOf('highlight') > 0 && this.chart.highlightColor !== '' && !isNullOrUndefined(this.chart.highlightColor) && this.chart.highlightPattern === 'None' && this.chart.highlightColor !== 'transparent') {
                    element.setAttribute('fill', this.chart.highlightColor);
                }
            }
        }
    }

    /**
     * Gets the CSS class name associated with the selection for a specific chart element.
     *
     * @param {string} id - A unique identifier for the selected element.
     * @returns {string} The CSS class name associated with the selection for the selected element.
     */
    public getSelectionClass(id: string): string {
        return this.generateStyle((this.control as Chart3D).visibleSeries[this.indexFinder(id).series]);
    }

    /**
     * Removes styles associated with the selection from the selected elements.
     *
     *
     * @param {Element[]} elements - An array of chart elements from which selection styles should be removed.
     * @returns {void}
     */
    public removeStyles(elements: Element[]): void {
        for (const element of elements) {
            if (element) {
                this.removeSvgClass(
                    element, this.getSelectionClass(element.id)
                );
                if (this.chart.highlightPattern === 'None' && this.chart.highlightColor !== '' && !isNullOrUndefined(this.chart.highlightColor) && this.chart.highlightColor !== 'transparent') {
                    let color: string = (this.control as Chart3D).visibleSeries[this.indexFinder(element.id).series].interior;
                    if (element.getAttribute('name') === 'ZLight') {
                        color = this.chart.polygon.applyZLight(color, this.control as Chart3D);
                    }
                    if (element.getAttribute('name') === 'XLight') {
                        color = this.chart.polygon.applyXLight(color, this.control as Chart3D);
                    }
                    element.setAttribute('fill', color);
                }
            }
        }
    }

    /**
     * Adds or removes an index from the specified array based on the provided condition.
     *
     * @param {Index[]} indexes - The array of indexes to be modified.
     * @param {Index} index - The index to be added or removed.
     * @param {boolean} [isAdd=true] - A boolean flag indicating whether to add or remove the index.
     * @returns {void}
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
     * Compares two Index objects for equality.
     *
     * @param {Index} first - The first Index object to compare.
     * @param {Index} second - The second Index object to compare.
     * @param {boolean} [checkSeriesOnly=false] - A boolean flag indicating whether to
     * @returns {boolean} - True if the Index objects are equal; otherwise, false.
     */
    public toEquals(first: Index, second: Index, checkSeriesOnly: boolean): boolean {
        return ((first.series === second.series || (this.currentMode === 'Cluster' && !checkSeriesOnly))
            && (checkSeriesOnly || (first.point === second.point)));
    }

    /**
     * Redraws the selection in the 3D chart.
     *
     * @param {Chart3D} chart - The 3D chart instance where the selection needs to be redrawn.
     * @param {Chart3DSelectionMode | HighlightMode} oldMode - The previous selection mode ('Series', 'Point', etc.).
     * @param {boolean} [chartRedraw=false] - A boolean flag indicating whether to trigger a chart redraw.
     * @returns {void}
     */
    public redrawSelection(chart: Chart3D, oldMode: Chart3DSelectionMode  | HighlightMode, chartRedraw?: boolean): void {
        this.isSeriesMode = oldMode === 'Series';
        if (!isNullOrUndefined(oldMode)) {
            if (chartRedraw) {
                chart.isRedrawSelection = false;
            } else {
                chart.isRedrawSelection = true;
            }
        }
        let selectedDataIndexes: Indexes[] = <Indexes[]>extend([], this.selectedDataIndexes, null, true);
        const highlightDataIndexes: Indexes[] = <Indexes[]>extend([], this.highlightDataIndexes, null, true);
        if (this.styleId.indexOf('highlight') > 0 && highlightDataIndexes.length > 0) {
            this.removeSelectedElements(chart, this.highlightDataIndexes, chart.series);
            selectedDataIndexes = highlightDataIndexes;
        } else {
            this.removeSelectedElements(chart, this.selectedDataIndexes, chart.series);
        }
        this.blurEffect(chart.element.id, chart.visibleSeries);
        this.selectDataIndex(chart, selectedDataIndexes);
    }

    /**
     * Handles the selection in the legend for the 3D chart.
     *
     * @param {Chart3D} chart - The 3D chart instance associated with the legend.
     * @param {number} series - The index of the series in the legend.
     * @param {Element} targetElement - The HTML element that triggered the selection event.
     * @param {string} eventType - The type of event that triggered the selection.
     * @returns {void}
     */
    public legendSelection(chart: Chart3D, series: number, targetElement: Element, eventType: string): void {
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
        else if (eventType === 'click') {
            if (targetElement.id.indexOf('text') > 1) {
                targetElement = getElement(targetElement.id.replace('text', 'shape'));
            }
            if (targetElement.id.indexOf('g') > 1) {
                targetElement = getElement(targetElement.id.replace('_g_', '_shape_'));
            }
        }
        const index: Index = this.indexFinder(targetElement.id);
        const isPreSelected: boolean = this.isAlreadySelected(targetElement, eventType, index);
        if (isPreSelected) {
            let seriesStyle: string = this.generateStyle(chart.visibleSeries[series as number]);
            let selectedElements: NodeListOf<HTMLElement> = <NodeListOf<HTMLElement>>(document.querySelectorAll('.' + seriesStyle));
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
                if (this.chart.legendSettings.mode === 'Point') {
                    seriesElements = this.getElementByIndex(chart, index);
                } else {
                    seriesElements = this.getSeriesElements(chart.visibleSeries[series as number]);
                }
                if (seriesElements.length > 0) {
                    this.checkSelectionElements(seriesElements, seriesStyle, false, series, '');
                    this.isSeriesMode = true;
                    this.selection(chart, new Index(index.series, NaN), seriesElements);
                    this.isSeriesMode = chart.selectionMode === 'Series';
                    this.blurEffect(chart.element.id, chart.visibleSeries);
                }
            }
        }
    }

    /**
     * Handles the removal of selection in the 3D chart.
     *
     * @param {Chart3D} chart - The 3D chart instance where the selection needs to be removed.
     * @param {number} series - The index of the series for which the selection is being removed.
     * @param {NodeListOf<HTMLElement>} selectedElements - The HTML elements representing the selected items.
     * @param {string} seriesStyle - The style to be applied to the series after the removal of selection.
     * @param {boolean} isBlurEffectNeeded - A flag indicating whether a blur effect is needed after the removal of selection.
     * @returns {void}
     */
    public removeSelection(
        chart: Chart3D, series: number, selectedElements: NodeListOf<HTMLElement>,
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
                        this.checkSelectionElements(element, seriesStyle, true, series, '');
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

    /**
     * Retrieves the HTML elements associated with a specific 3D chart series.
     *
     * @param {Chart3DSeriesModel | Chart3DSeries} series - The 3D chart series for which HTML elements are to be retrieved.
     * @returns {Element[]} An array of HTML elements representing the graphical elements of the specified 3D chart series.
     * @private
     */
    public getSeriesElements(series: Chart3DSeriesModel | Chart3DSeries): Element[] {
        const seriesElements: Element[] = [];
        if (series.visible) {
            const elements: NodeListOf<HTMLElement> = document.querySelectorAll(`[id*="region-series-${(series as Chart3DSeries).index}"]`);
            elements.forEach((seriesElement: Element) => {
                seriesElements.push(seriesElement as Element);
            });
        }
        return seriesElements;
    }

    /**
     * Finds and returns the index associated with the specified identifier.
     *
     * @param {string} id - The identifier used to find the associated index.
     * @returns {Index} The index associated with the specified identifier.
     * @private
     */
    public indexFinder(id: string): Index {
        let ids: string[] = ['NaN', 'NaN'];
        if (id.indexOf('-point-') > -1) {
            ids = id.split('-series-')[1].split('-point-');
        } else if (id.indexOf('-border-') > -1) {
            ids[0] = id.split('-border-')[1];
        } else if (id.indexOf('-series-') > -1) {
            ids[0] = id.split('-series-')[1];
        } else if (id.indexOf('_chart_legend_shape_') > -1) {
            ids = id.split('_chart_legend_shape_');
            ids[0] = ids[1];
        }
        return new Index(parseInt(ids[0], 10), parseInt(ids[1], 10));
    }

    /**
     * Removes the selected elements from the chart based on the specified indices.
     *
     * @param {Chart3D} chart - The 3D chart instance.
     * @param {Index[]} index - The array of indices representing the selected elements to be removed.
     * @param {Chart3DSeriesModel[]} seriesCollection - The collection of series models.
     * @returns {void}
     * @private
     */
    private removeSelectedElements(chart: Chart3D, index: Index[], seriesCollection: Chart3DSeriesModel[]): void {
        index = chart.isRedrawSelection ? index : index.splice(0, index.length);
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

    /**
     * Handles the mouse leave event for the 3D chart.
     *
     * @returns {void}
     * @private
     */
    private mouseLeave(): void {
        this.completeSelection();
    }

    /**
     * Completes the selection process based on the specified target element and event type.
     *
     * @returns {void}
     * @private
     */
    public completeSelection(): void {
        const chart: Chart3D = this.chart;
        if (chart.selectionMode === 'None') {
            return;
        }
        this.currentMode = chart.selectionMode;
    }

    /**
     * Handles the mouse move event, typically used for tracking the movement of the mouse pointer.
     * This method is marked as private to indicate that it should not be used externally.
     *
     * @param {PointerEvent | TouchEvent} event - The event object representing the mouse move or touch event.
     * @returns {void}
     * @private
     */
    public mouseMove(event: PointerEvent | TouchEvent): void {
        const chart: Chart3D = this.chart;
        const target: Element = <Element>event.target;
        const eventType: string = event.type;
        this.highlightChart(target, eventType);
        if (chart.selectionMode === 'None') {
            return;
        }
        if (eventType === 'touchmove' && (Browser.isIos || Browser.isIos7) && event.preventDefault) {
            event.preventDefault();
        }
    }

    /**
     * Highlights the series elements based on the specified target element and event type.
     *
     * @param {Element} target - The target element on which the highlight action is performed.
     * @param {string} eventType - The type of the event.
     * @returns {void}
     */
    public highlightChart(target: Element, eventType: string): void {
        if (!this.chart.rotateActivate && (this.chart.highlightMode !== 'None' || this.chart.legendSettings.enableHighlight)) {
            if (!isNullOrUndefined(target)) {
                if (target.id.indexOf('_legend_text') > 1) {
                    target = getElement(target.id.replace('text', 'shape'));
                }
                if ((target).hasAttribute('class') && ((target).getAttribute('class').indexOf('highlight') > -1 ||
                    target.getAttribute('class').indexOf('selection') > -1)) {
                    return;
                }
                this.calculateSelectedElements(target as HTMLElement, eventType);
                if (this.chart.highlight3DModule.highlightDataIndexes && this.chart.highlight3DModule.highlightDataIndexes.length > 0 &&
                    target.id.indexOf('_chart_legend_') === -1 && target.id.indexOf('-series-') === -1) {
                    this.removeLegendHighlightStyles();
                }
            }
            return;
        }
    }

    /**
     * remove highlighted legend when not focused.
     *
     * @returns {void}
     * @private
     */
    public removeLegendHighlightStyles(): void {
        this.chart.highlight3DModule.highlightDataIndexes = [];
        let elementCollection: HTMLCollection;
        for (let i: number = 0; i < this.chart.visibleSeries.length; i++) {
            elementCollection = document.getElementsByClassName(this.generateStyle(this.chart.visibleSeries[i as number]));
            if (this.selectedDataIndexes.length === 0) {
                elementCollection = document.getElementsByClassName(this.generateStyle(this.chart.visibleSeries[i as number]));
                while (elementCollection.length > 0) {
                    const element: HTMLElement = elementCollection[0] as HTMLElement;
                    if (element) {
                        this.removeSvgClass(element, element.getAttribute('class'));
                        if (this.chart.highlightPattern === 'None' && this.chart.highlightColor !== '' && !isNullOrUndefined(this.chart.highlightColor) && this.chart.highlightColor !== 'transparent') {
                            let color: string = (this.control as Chart3D).visibleSeries[i as number].interior;
                            if (element.getAttribute('name') === 'ZLight') {
                                color = this.chart.polygon.applyZLight(color, this.control as Chart3D);
                            }
                            if (element.getAttribute('name') === 'XLight') {
                                color = this.chart.polygon.applyXLight(color, this.control as Chart3D);
                            }
                            if (element.id.indexOf('_chart_legend_shape') !== -1 && element.getAttribute('stroke')) {
                                element.setAttribute('stroke', color);
                            }
                            element.setAttribute('fill', color);
                        }
                    }
                }
                elementCollection = document.getElementsByClassName(this.unselected);
                while (elementCollection.length > 0) {
                    const element: HTMLElement = elementCollection[0] as HTMLElement;
                    if (element) {
                        this.removeSvgClass(element, element.getAttribute('class'));
                        if (this.chart.tooltip3DModule && this.generateStyle(this.chart.visibleSeries[i as number]).indexOf('highlight') > -1){
                            this.chart.highlightAnimation(element as HTMLElement, i as number, 700, 0.3);
                        }
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

    /**
     * Get module name.
     *
     * @returns {string} - Returns the module name.
     * @private
     */
    public getModuleName(): string {
        return 'Selection3D';
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
