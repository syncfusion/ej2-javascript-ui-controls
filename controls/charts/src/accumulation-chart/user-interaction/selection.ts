/* eslint-disable jsdoc/require-returns */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable jsdoc/require-param */
/* eslint-disable valid-jsdoc */
/**
 * AccumulationChart Selection src file
 */
import { Browser, extend, isNullOrUndefined  } from '@syncfusion/ej2-base';
import { Rect, SvgRenderer, CanvasRenderer } from '@syncfusion/ej2-svg-base';
import { indexFinder, getElement } from '../../common/utils/helper';
import { AccumulationSelectionMode, AccumulationHighlightMode } from '../model/enum';
import { AccumulationChart } from '../accumulation';
import { AccumulationSeries, pointByIndex, AccPoints } from '../model/acc-base';
import { AccumulationSeriesModel } from '../model/acc-base-model';
import { Indexes, Index } from '../../common/model/base';
import { BaseSelection } from '../../common/user-interaction/selection';
import { AccumulationTooltip } from './tooltip';
import { IAccSelectionCompleteEventArgs } from '../model/pie-interface';
import { selectionComplete } from '../../common/model/constants';

/**
 * `AccumulationSelection` module handles the selection for accumulation chart.
 */
export class AccumulationSelection extends BaseSelection {
    /** @private */
    public renderer: SvgRenderer | CanvasRenderer;
    /** @private */
    public rectPoints: Rect;
    /** @private */
    public selectedDataIndexes: Indexes[];
    /** @private */
    public highlightDataIndexes: Indexes[];
    /** @private */
    public series: AccumulationSeries[];
    /** @private */
    public accumulation: AccumulationChart;    
    /** @private */
    public currentMode: AccumulationSelectionMode | AccumulationHighlightMode;
    /** @private */
    public previousSelectedElement: Element[];

    constructor(accumulation: AccumulationChart) {
        super(accumulation);
        this.accumulation = accumulation;
        this.renderer = accumulation.renderer;
        this.addEventListener();
    }
    /**
     * Binding events for selection module.
     */
    private addEventListener(): void {
        if (this.accumulation.isDestroyed) { return; }
        let cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        this.accumulation.on(Browser.touchMoveEvent, this.mouseMove, this);
        this.accumulation.on('click', this.mouseClick, this);
    }
    /**
     * UnBinding events for selection module.
     */
    private removeEventListener(): void {
        if (this.accumulation.isDestroyed) { return; }
        this.accumulation.off(Browser.touchMoveEvent, this.mouseMove);
        this.accumulation.off('click', this.mouseClick);
    }
    /**
     * To initialize the private variables
     */
    private initPrivateVariables(accumulation: AccumulationChart): void {
        this.styleId = accumulation.element.id + '_ej2_chart_selection';
        this.unselected = accumulation.element.id + '_ej2_deselected';
        this.selectedDataIndexes = [];
        this.rectPoints = null;
    }
    /**
     * Invoke selection for rendered chart.
     *
     * @param {AccumulationChart} accumulation Define the chart to invoke the selection.
     * @returns {void}
     */
    public invokeSelection(accumulation: AccumulationChart): void {
        this.initPrivateVariables(accumulation);
        this.series = <AccumulationSeries[]>extend({}, accumulation.visibleSeries, null, true);
        this.seriesStyles();
        this.currentMode = accumulation.selectionMode;
        this.selectDataIndex(this.concatIndexes(accumulation.selectedDataIndexes, this.selectedDataIndexes), accumulation);
    }
    /**
     * To get series selection style by series.
     */
    private generateStyle(series: AccumulationSeriesModel): string {
        return (series.selectionStyle || this.styleId + '_series_' + (<AccumulationSeries>series).index);
    }
    /**
     * To get series selection style while hovering legend
     */
     private generateLegendClickStyle(series: AccumulationSeriesModel, eventType: string): string {
        if (eventType === 'mousemove') {
            this.styleId = this.accumulation.element.id + '_ej2_chart_highlight';
        } else if (eventType === 'click') {
            this.styleId = this.accumulation.element.id + '_ej2_chart_selection';
        }
        return (series.selectionStyle || this.styleId + '_series_' + (<AccumulationSeries>series).index);
    }
    /**
     * To get elements by index, series
     */
    private findElements(accumulation: AccumulationChart, series: AccumulationSeriesModel, index: Index): Element[] {
        return [this.getElementByIndex(index)];
    }
    /**
     * To get series point element by index
     */
    private getElementByIndex(index: Index): Element {
        const elementId: string = this.control.element.id + '_Series_' + index.series + '_Point_' + index.point;
        return document.getElementById(elementId);
    }
    /**
    * To find the selected element.
     * @return {void}
     * @private
     */
     public isAlreadySelected(targetElement: Element, eventType: string): boolean {
        if (eventType === 'mousemove') {
            this.currentMode = this.accumulation.highlightMode;
            this.highlightDataIndexes = [];
            this.styleId = this.accumulation.element.id + '_ej2_chart_highlight';
        } else if (eventType === 'click') {
            this.currentMode = this.accumulation.selectionMode;
            this.styleId = this.accumulation.element.id + '_ej2_chart_selection';
        }  
        if (this.accumulation.highlightMode !== 'None' && this.accumulation.selectionMode === 'None') {
            if (eventType === 'click') {
                return false;
            }
        }
        if ((this.accumulation.highlightMode !== 'None' && this.previousSelectedElement && this.previousSelectedElement[0])) {
            let parentNodeId: string = (<Element>targetElement.parentNode).id; let isValidElement: boolean;
            if (targetElement.parentNode) {
                isValidElement = (parentNodeId.indexOf('SeriesGroup') > 0 ||
                parentNodeId.indexOf('SymbolGroup') > 0) ? true : false;
            }
            for (let i: number = 0; i < this.previousSelectedElement.length; i++) {
                if (this.previousSelectedElement[i].hasAttribute('class')) {
                    if (this.previousSelectedElement[i].getAttribute('class').indexOf('highlight') > -1 && (isValidElement || eventType === 'click')) {
                        this.previousSelectedElement[i].removeAttribute('class');
                        this.addOrRemoveIndex(this.highlightDataIndexes, indexFinder((<HTMLElement>this.previousSelectedElement[i]).id));
                    } else if (!isValidElement && this.previousSelectedElement[i].getAttribute('class').indexOf('highlight') > -1) {
                        this.performSelection(indexFinder(this.previousSelectedElement[i].id), this.accumulation, this.previousSelectedElement[i]);
                    }
                }
            }
        }
        return true;
    }

    /**
     * To calculate selected elements on mouse click or touch
     *
     * @private
     */
     public mouseClick(accumulation: AccumulationChart, event: Event): void {
       this.calculateSelectedElements(accumulation, event.target as Element, event.type)
     }

    /**
     * To calculate selected elements on mouse click or touch
     *
     * @private
     */
    public calculateSelectedElements(accumulation: AccumulationChart, targetEle: Element, eventType: string): void {
        if (isNullOrUndefined(targetEle)) {
            return;
        }       
        if ((accumulation.highlightMode === 'None' && accumulation.selectionMode === 'None') ||
            targetEle.id.indexOf(accumulation.element.id + '_') === -1) {
            return;
        }
        if (eventType === 'mousemove') {
            if (!isNullOrUndefined(targetEle.parentNode) && (
                <Element>targetEle.parentNode).hasAttribute('class') &&
                ((<Element>targetEle.parentNode).getAttribute('class').indexOf('highlight') > 0 ||
                    (<Element>targetEle.parentNode).getAttribute('class').indexOf('selection') > 0)) {
                return;
            }
        } if (targetEle.getAttribute('id').indexOf('_connector_') > -1) {
            return;
        } else {
            this.isAlreadySelected(targetEle as HTMLElement, eventType);
            if (targetEle.id.indexOf('_Series_') > -1 || targetEle.id.indexOf('_datalabel_') > -1) {
                this.performSelection(indexFinder(targetEle.id), accumulation, targetEle);
            }
        }
    }
    /**
     * To perform the selection process based on index and element.
     */
    private performSelection(index: Index, accumulation: AccumulationChart, element?: Element): void {
        element = element.id.indexOf('datalabel') > -1 ?
        <Element>accumulation.getSeriesElement().childNodes[index.series].childNodes[index.point]
            : element;
        switch (this.currentMode) {
        case 'Point':
            if (!isNaN(index.point)) {
                this.selection(accumulation, index, [element]);
                this.selectionComplete(accumulation, <AccumulationSeries>accumulation.series[0]);
                this.blurEffect(accumulation.element.id, accumulation.visibleSeries);
            }
            break;
        }
    }

    /**
     *  Method to get the selected data index
     *
     * @private
     */
    private selectionComplete(accumulation: AccumulationChart, series: AccumulationSeries): void {
        let pointIndex: number;
        const selectedPointValues: { x?: string | number | Date, y?: number, seriesIndex?: number, pointIndex?: number }[] = [];
        for (let i: number = 0; i < this.selectedDataIndexes.length; i++) {
            pointIndex = this.selectedDataIndexes[i].point;
            if (!isNaN(pointIndex)) {
                selectedPointValues.push({
                    x: series.dataSource[pointIndex][series.xName], y: series.points[pointIndex].y,
                    seriesIndex: this.selectedDataIndexes[i].series, pointIndex: pointIndex
                });
            }
        }
        const args: IAccSelectionCompleteEventArgs = {
            name: selectionComplete,
            selectedDataValues: selectedPointValues,
            cancel: false
        };
        accumulation.trigger(selectionComplete, args);
    }

    /**
     * To select the element by index. Adding or removing selection style class name.
     */
    private selection(accumulation: AccumulationChart, index: Index, selectedElements: Element[]): void {
        if (!accumulation.isMultiSelect && this.styleId.indexOf('highlight') === -1 &&
            accumulation.selectionMode !== 'None') {
            this.removeMultiSelectEelments(accumulation, this.selectedDataIndexes, index, accumulation.series);
        }
        const className: string = selectedElements[0] && (selectedElements[0].getAttribute('class') || '');
        if (selectedElements[0] && className.indexOf(this.getSelectionClass(selectedElements[0].id)) > -1) {
            this.removeStyles(selectedElements, index);
            if (this.styleId.indexOf('highlight') > 0 && accumulation.highlightMode !== 'None') {
                this.addOrRemoveIndex(this.highlightDataIndexes, index);
            } else {
                this.addOrRemoveIndex(this.selectedDataIndexes, index);
            }
            if (accumulation.enableBorderOnMouseMove) {
                const borderElement: Element = document.getElementById(selectedElements[0].id.split('_')[0] + 'PointHover_Border');
                if (!isNullOrUndefined(borderElement)) {
                    this.removeSvgClass(borderElement, borderElement.getAttribute('class'));
                }
            }
        } else {
            this.previousSelectedElement = accumulation.highlightMode !== 'None' ? selectedElements : [];
            if (className.indexOf('selection') < 0) {
                this.applyStyles(selectedElements, index);
            }
            if (accumulation.enableBorderOnMouseMove) {
                const borderElement: Element = document.getElementById(selectedElements[0].id.split('_')[0] + 'PointHover_Border');
                if (!isNullOrUndefined(borderElement)) {
                    this.removeSvgClass(borderElement, borderElement.getAttribute('class'));
                    this.addSvgClass(borderElement, selectedElements[0].getAttribute('class'));
                }
            }
            if (this.styleId.indexOf('highlight') > 0 && accumulation.highlightMode !== 'None') {
                this.addOrRemoveIndex(this.highlightDataIndexes, index, true);
            } else {
                this.addOrRemoveIndex(this.selectedDataIndexes, index, true);
            }
        }
    }
    /**
     * To redraw the selection process on accumulation chart refresh.
     *
     * @private
     */
    public redrawSelection(accumulation: AccumulationChart): void {
        let selectedDataIndexes: Indexes[] = <Indexes[]>extend([], this.selectedDataIndexes, null, true);
        let highlightDataIndexes: Indexes[] = <Indexes[]>extend([], this.highlightDataIndexes, null, true);
        if (this.styleId.indexOf('highlight') > 0 && highlightDataIndexes.length > 0 ) {
            this.removeSelectedElements(accumulation, this.highlightDataIndexes);
            selectedDataIndexes = highlightDataIndexes;
        } else {
            this.removeSelectedElements(accumulation, this.selectedDataIndexes);
        }
        this.blurEffect(accumulation.element.id, accumulation.visibleSeries);
        this.selectDataIndex(selectedDataIndexes, accumulation);
    }
    /**
     * To remove the selected elements style classes by indexes.
     */
    private removeSelectedElements(accumulation: AccumulationChart, indexes: Index[]): void {
        for (const index of indexes) {
            this.removeStyles([this.getElementByIndex(index)], index);
        }
    }
    /**
     * To perform the selection for legend elements.
     *
     * @private
     */
    public legendSelection(accumulation: AccumulationChart, series: number, pointIndex: number, targetEle: Element, eventType: string): void {
        if (eventType === 'mousemove') {
            if (targetEle.id.indexOf('text') > 1) {
                targetEle = getElement(targetEle.id.replace('text', 'shape'));
            }
            if (targetEle.hasAttribute('class') && (targetEle.getAttribute('class').indexOf('highlight') > -1 ||
                targetEle.getAttribute('class').indexOf('selection') > -1)) {
                return;
            }
            this.currentMode = this.accumulation.highlightMode;
        }
        let isPreSelected: boolean = this.isAlreadySelected(targetEle, eventType);
        if (isPreSelected) {
            let element: Element = <Element>accumulation.getSeriesElement().childNodes[series].childNodes[pointIndex];
            let seriesStyle: string = this.generateLegendClickStyle(accumulation.visibleSeries[series], eventType);
            let seriesElements: Element = <Element>accumulation.getSeriesElement().childNodes[series].childNodes[pointIndex];
            this.selection(accumulation, new Index(series, pointIndex), [seriesElements]);
            this.blurEffect(accumulation.element.id, accumulation.visibleSeries);            
        }
    }
    /**
     * To select the element by selected data indexes.
     */
    private selectDataIndex(indexes: Index[], accumulation: AccumulationChart): void {
        let element: Element;
        for (const index of indexes) {
            element = this.getElementByIndex(index);
            if (element) {
                this.performSelection(index, accumulation, element);
            }
        }
    }
    /**
     * To remove the selection styles for multi selection process.
     */
    private removeMultiSelectEelments(accumulation: AccumulationChart, index: Index[], currentIndex: Index,
                                      seriesCollection: AccumulationSeriesModel[]): void {
        let series: AccumulationSeriesModel;
        for (let i: number = 0; i < index.length; i++) {
            series = seriesCollection[index[i].series];
            if (!this.checkEquals(index[i], currentIndex)) {
                this.removeStyles(this.findElements(accumulation, series, index[i]), index[i]);
                index.splice(i, 1);
                i--;
            }
        }
    }
    /**
     * To apply the opacity effect for accumulation chart series elements.
     */
    private blurEffect(pieId: string, visibleSeries: AccumulationSeries[]): void {
        const visibility: boolean = (this.checkVisibility(this.highlightDataIndexes) ||
            this.checkVisibility(this.selectedDataIndexes)); // legend click scenario
        for (const series of visibleSeries) {
            if (series.visible) {
                this.checkSelectionElements(document.getElementById(pieId + '_SeriesCollection'),
                                            this.generateStyle(series), visibility);
            }
        }
    }
    /**
     * To check selection elements by style class name.
     */
    private checkSelectionElements(element: Element, className: string, visibility: boolean): void {
        const children: NodeList = element.childNodes[0].childNodes;
        let legendShape: Element;
        let elementClass: string;
        let parentClass: string;
        let selectElement: Element = element;
        for (let i: number = 0; i < children.length; i++) {
            elementClass = (children[i] as HTMLElement).getAttribute('class') || '';
            parentClass = (<Element>children[i].parentNode).getAttribute('class') || '';
            if (this.accumulation.selectionMode !== 'None' && this.accumulation.highlightMode !== 'None') {
                className = elementClass.indexOf('selection') > 0 ||
                    elementClass.indexOf('highlight') > 0 ? elementClass : className;
                className = (parentClass.indexOf('selection') > 0 ||
                    parentClass.indexOf('highlight') > 0) ? parentClass : className;
            }
            if (elementClass.indexOf(className) === -1 && parentClass.indexOf(className) === -1 && visibility) {
                this.addSvgClass(children[i] as HTMLElement, this.unselected);
            } else {
                this.removeSvgClass(children[i] as HTMLElement, this.unselected);
            }
            if (elementClass.indexOf(className) === -1 &&
                parentClass.indexOf(className) === -1 && visibility) {
                this.addSvgClass(children[i] as HTMLElement, this.unselected);
            } else {
                selectElement = children[i] as HTMLElement;
                this.removeSvgClass(children[i] as HTMLElement, this.unselected);
                this.removeSvgClass(<Element>children[i].parentNode, this.unselected);
            }
            if ((this.control as AccumulationChart).accumulationLegendModule && this.control.legendSettings.visible) {
                legendShape = document.getElementById(this.control.element.id + '_chart_legend_shape_' + i);
                if (legendShape) {
                    if (elementClass.indexOf(className) === -1 && parentClass.indexOf(className) === -1 && visibility) {
                        this.addSvgClass(legendShape, this.unselected);
                    } else {
                        this.removeSvgClass(legendShape, this.unselected);
                    }
                }
            }
        }
    }
    /**
     * To apply selection style for elements.
     */
    private applyStyles(elements: Element[], index: Index): void {
        const accumulationTooltip: AccumulationTooltip = (this.control as AccumulationChart).accumulationTooltipModule;
        for (const element of elements) {
            let legendShape: Element;
            if (element) {
                if ((this.control as AccumulationChart).accumulationLegendModule && this.control.legendSettings.visible) {
                    legendShape = document.getElementById(this.control.element.id + '_chart_legend_shape_' + index.point);
                    this.removeSvgClass(legendShape, legendShape.getAttribute('class'));
                    this.addSvgClass(legendShape, this.getSelectionClass(legendShape.id));
                }
                this.removeSvgClass(<Element>element.parentNode, this.unselected);
                this.removeSvgClass(element, this.unselected);
                const opacity: number = accumulationTooltip && (accumulationTooltip.previousPoints.length > 0 &&
                    accumulationTooltip.previousPoints[0].point.index !== index.point) ?
                    accumulationTooltip.svgTooltip.opacity : this.series[index.series].opacity;
                element.setAttribute('opacity', opacity.toString());
                this.addSvgClass(element, this.getSelectionClass(element.id));
            }
        }
    }
    /**
     * To get selection style class name by id
     */
    private getSelectionClass(id: string): string {
        return this.generateStyle((this.control as AccumulationChart).series[indexFinder(id).series]);
    }
    /**
     * To remove selection style for elements.
     */
    private removeStyles(elements: Element[], index: Index): void {
        const accumulationTooltip: AccumulationTooltip = (this.control as AccumulationChart).accumulationTooltipModule;
        let legendShape: Element;
        for (const element of elements) {
            if (element) {
                if ((this.control as AccumulationChart).accumulationLegendModule && this.control.legendSettings.visible) {
                    legendShape = document.getElementById(this.control.element.id + '_chart_legend_shape_' + index.point);
                    this.removeSvgClass(legendShape, this.getSelectionClass(legendShape.id));
                }
                const opacity: number = accumulationTooltip && accumulationTooltip.previousPoints.length > 0
                    && (accumulationTooltip.previousPoints[0].point.index === index.point) ?
                    accumulationTooltip.svgTooltip.opacity : this.series[index.series].opacity;
                element.setAttribute('opacity', opacity.toString());
                this.removeSvgClass(element, this.getSelectionClass(element.id));
            }
        }
    }
    /**
     * To apply or remove selected elements index.
     */
    private addOrRemoveIndex(indexes: Index[], index: Index, add?: boolean): void {
        for (let i: number = 0; i < indexes.length; i++) {
            if (this.checkEquals(indexes[i], index)) {
                indexes.splice(i, 1);
                i--;
            }
        }
        if (add) { indexes.push(index); }
    }
    /**
     * To check two index, point and series are equal
     */
    private checkEquals(first: Index, second: Index): boolean {
        return ((first.point === second.point) && (first.series === second.series));
    }
    /** @private */
    public mouseMove(event: PointerEvent | TouchEvent): void{
        let accumulation: AccumulationChart = this.accumulation;
        let targetElement: Element = <Element>event.target;
        if (accumulation.highlightMode !== 'None') {
            if (!isNullOrUndefined(targetElement)) {
                if ((<Element>event.target).id.indexOf('text') > 1) {
                    targetElement = getElement((<Element>event.target).id.replace('text', 'shape'));
                }
                if ((targetElement).hasAttribute('class') && (targetElement).getAttribute('class').indexOf('highlight') > -1) {
                    return;
                }
                this.calculateSelectedElements(accumulation, event.target as Element, event.type);
                return;
            }
        }
        if (accumulation.selectionMode === 'None') {
            return;
        }
    }
    /**
     * To check selected points are visibility
     */
    private checkPointVisibility(selectedDataIndexes: Indexes[]): boolean {
        let visible: boolean = false;
        for (const data of selectedDataIndexes) {
            if (pointByIndex(data.point, <AccPoints[]>this.control.visibleSeries[0].points).visible) {
                visible = true;
                break;
            }
        }
        return visible;
    }
    /**
     * Get module name.
     */
    public getModuleName(): string {
        return 'AccumulationSelection';
    }
    /**
     * To destroy the selection.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        // Destroy method performed here
        this.removeEventListener();
    }
}
