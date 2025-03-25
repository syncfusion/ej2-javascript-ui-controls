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
import { Index, Indexes } from '../../common/model/base';
import { BaseSelection } from '../../common/user-interaction/selection';
import { AccumulationTooltip } from './tooltip';
import { IAccSelectionCompleteEventArgs } from '../model/pie-interface';
import { selectionComplete } from '../../common/model/constants';

/**
 * The `AccumulationSelection` module handles selection for the accumulation chart.
 *
 * @private
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
     *
     * @returns {void}
     */
    private addEventListener(): void {
        if (this.accumulation.isDestroyed) { return; }
        //let cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        this.accumulation.on(Browser.touchMoveEvent, this.mouseMove, this);
        this.accumulation.on('click', this.mouseClick, this);
    }
    /**
     * UnBinding events for selection module.
     *
     * @returns {void}
     */
    private removeEventListener(): void {
        if (this.accumulation.isDestroyed) { return; }
        this.accumulation.off(Browser.touchMoveEvent, this.mouseMove);
        this.accumulation.off('click', this.mouseClick);
    }
    /**
     * To initialize the private variables.
     *
     * @param {AccumulationChart} accumulation - The accumulation chart control.
     * @returns {void}
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
     * @param {AccumulationChart} accumulation - Define the chart to invoke the selection.
     * @returns {void}
     * @private
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
     *
     * @param {AccumulationSeriesModel} series - The series for which to get the selection style.
     * @param {number} point - The index of the point within the series.
     * @returns {string} - The selection style for the specified series.
     */
    private generateStyle(series: AccumulationSeriesModel, point?: number): string {
        return (series.selectionStyle || this.styleId + '_series_' + (<AccumulationSeries>series).index + '_point_' + point);
    }
    // /**
    //  * To get series selection style while hovering legend.
    //  *
    //  * @param {AccumulationSeriesModel} series - The series for which to get the selection style.
    //  * @param {string} eventType - The event type indicating the legend interaction (e.g., hover).
    //  * @returns {string} - The selection style for the specified series.
    //  */
    // private generateLegendClickStyle(series: AccumulationSeriesModel, eventType: string): string {
    //     if (eventType === 'mousemove') {
    //         this.styleId = this.accumulation.element.id + '_ej2_chart_highlight';
    //     } else if (eventType === 'click') {
    //         this.styleId = this.accumulation.element.id + '_ej2_chart_selection';
    //     }
    //     return (series.selectionStyle || this.styleId + '_series_' + (<AccumulationSeries>series).index);
    // }

    /**
     * To get elements by index, series.
     *
     * @param {AccumulationChart} accumulation - The accumulation chart control.
     * @param {AccumulationSeriesModel} series - The series for which to get the elements.
     * @param {Index} index - The index of the element within the series.
     * @returns {Element[]} - The elements corresponding to the specified index and series.
     */
    private findElements(accumulation: AccumulationChart, series: AccumulationSeriesModel, index: Index): Element[] {
        return [this.getElementByIndex(index)];
    }
    /**
     * To get series point element by index.
     *
     * @param {Index} index - The index of the element within the series.
     * @returns {Element} - The elements corresponding to the specified index.
     */
    private getElementByIndex(index: Index): Element {
        const elementId: string = this.control.element.id + '_Series_' + index.series + '_Point_' + index.point;
        return document.getElementById(elementId);
    }
    /**
     * To find the selected element.
     *
     * @param {Element} targetElement - The target element to check for selection.
     * @param {string} eventType - The type of event that triggered the selection.
     * @returns {boolean} - Indicates whether the element is selected.
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
            const parentNodeId: string = (<Element>targetElement.parentNode).id; let isValidElement: boolean;
            if (targetElement.parentNode) {
                isValidElement = (parentNodeId.indexOf('SeriesGroup') > 0 ||
                parentNodeId.indexOf('SymbolGroup') > 0) ? true : false;
            }
            for (let i: number = 0; i < this.previousSelectedElement.length; i++) {
                if (this.previousSelectedElement[i as number].hasAttribute('class')) {
                    if (this.previousSelectedElement[i as number].getAttribute('class').indexOf('highlight') > -1 && (isValidElement || eventType === 'click')) {
                        this.previousSelectedElement[i as number].removeAttribute('class');
                        this.addOrRemoveIndex(this.highlightDataIndexes,
                                              indexFinder((<HTMLElement>this.previousSelectedElement[i as number]).id));
                    } else if (!isValidElement && this.previousSelectedElement[i as number].getAttribute('class').indexOf('highlight') > -1) {
                        this.performSelection(indexFinder(this.previousSelectedElement[i as number].id),
                                              this.accumulation, this.previousSelectedElement[i as number]);
                    }
                }
            }
        }
        return true;
    }

    /**
     * To calculate selected elements on mouse click or touch.
     *
     * @private
     * @param {AccumulationChart} accumulation - The accumulation chart control.
     * @param {Event} event - The event object representing the mouse click or touch event.
     * @returns {void}
     */
    public mouseClick(accumulation: AccumulationChart, event: Event): void {
        this.calculateSelectedElements(accumulation, event.target as Element, event.type);
    }

    /**
     * To calculate selected elements on mouse click or touch.
     *
     * @private
     * @param {AccumulationChart} accumulation - The accumulation chart control.
     * @param {Element} targetEle - The target element that triggered the event.
     * @param {string} eventType - The type of event that triggered the selection.
     * @returns {void}
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
            if (this.accumulation.selectionMode === 'Point' && eventType === 'mousemove' && this.accumulation.accumulationLegendModule
                && this.accumulation.accumulationHighlightModule.highlightDataIndexes
                && this.accumulation.accumulationHighlightModule.highlightDataIndexes.length > 0 &&
                targetEle.id.indexOf('_chart_legend_') === -1 && targetEle.id.indexOf('_Series_') === -1) {
                for (let i: number = 0; i < this.accumulation.accumulationHighlightModule.previousSelectedElement.length; i++) {
                    this.removeStyles(this.accumulation.accumulationHighlightModule.previousSelectedElement,
                                      indexFinder(this.accumulation.accumulationHighlightModule.previousSelectedElement[i as number].id));
                    this.blurEffect(this.accumulation.element.id, this.accumulation.visibleSeries);
                }
            }
            if (targetEle.id.indexOf('_Series_') > -1 || targetEle.id.indexOf('_datalabel_') > -1) {
                this.performSelection(indexFinder(targetEle.id), accumulation, targetEle);
            }
        }
    }
    /**
     * To perform the selection process based on index and element.
     *
     * @param {Index} index - The index of the data to select.
     * @param {AccumulationChart} accumulation - The accumulation chart control.
     * @param {Element} element - The element representing the selected data.
     * @returns {void}
     */
    private performSelection(index: Index, accumulation: AccumulationChart, element?: Element): void {
        element = element.id.indexOf('datalabel') > -1 ?
        <Element>accumulation.getSeriesElement().childNodes[index.series].childNodes[index.point]
            : element;
        switch (this.currentMode) {
        case 'Point':
            if (!isNaN(index.point)) {
                const dataLabelElement: HTMLElement = document.getElementById(accumulation.element.id + '_datalabel_Series_' + index.series + '_g_' + index.point);
                if (this.series[0].dataLabel.visible && dataLabelElement) {
                    dataLabelElement.setAttribute('class', element && element.hasAttribute('class') ? element.getAttribute('class') : dataLabelElement.hasAttribute('class') ? dataLabelElement.getAttribute('class') : '');
                    this.selection(accumulation, index, [dataLabelElement]);
                }
                this.selection(accumulation, index, [element]);
                this.selectionComplete(accumulation, <AccumulationSeries>accumulation.series[0]);
                this.blurEffect(accumulation.element.id, accumulation.visibleSeries);
            }
            break;
        }
    }

    /**
     * Method to get the selected data index.
     *
     * @private
     * @param {AccumulationChart} accumulation - The accumulation chart control.
     * @param {AccumulationSeries} series - The series to retrieve the selected data from index.
     * @returns {void}
     */
    private selectionComplete(accumulation: AccumulationChart, series: AccumulationSeries): void {
        let pointIndex: number;
        const selectedPointValues: { x?: string | number | Date, y?: number, seriesIndex?: number, pointIndex?: number }[] = [];
        for (let i: number = 0; i < this.selectedDataIndexes.length; i++) {
            pointIndex = this.selectedDataIndexes[i as number].point;
            if (!isNaN(pointIndex)) {
                selectedPointValues.push({
                    x: series.dataSource[pointIndex as number][series.xName], y: series.points[pointIndex as number].y,
                    seriesIndex: this.selectedDataIndexes[i as number].series, pointIndex: pointIndex
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
     *
     * @param {AccumulationChart} accumulation - The accumulation chart control.
     * @param {Index} index - The index of the element to select or deselect.
     * @param {Element[]} selectedElements - The array of selected elements.
     * @returns {void}
     */
    private selection(accumulation: AccumulationChart, index: Index, selectedElements: Element[]): void {
        if (!accumulation.isMultiSelect && this.styleId.indexOf('highlight') === -1 &&
            accumulation.selectionMode !== 'None') {
            this.removeMultiSelectEelments(accumulation, this.selectedDataIndexes, index, accumulation.series);
        }
        const className: string = selectedElements[0] && (selectedElements[0].getAttribute('class') || '');
        if (selectedElements[0] && className.indexOf(this.getSelectionClass(selectedElements[0].id, index.point)) > -1) {
            this.removeStyles(selectedElements, index);
            if (this.styleId.indexOf('highlight') > 0 && accumulation.highlightMode !== 'None') {
                this.addOrRemoveIndex(this.highlightDataIndexes, index);
            } else {
                this.addOrRemoveIndex(this.selectedDataIndexes, index);
            }
            if (accumulation.enableBorderOnMouseMove && selectedElements[0].id.indexOf('datalabel') === -1) {
                const borderElement: Element = document.getElementById(selectedElements[0].id.split('_')[0] + 'PointHover_Border');
                if (!isNullOrUndefined(borderElement)) {
                    this.removeSvgClass(borderElement, borderElement.getAttribute('class'));
                }
            }
        } else {
            this.previousSelectedElement = accumulation.highlightMode !== 'None' ? selectedElements : [];
            if (selectedElements[0] && className.indexOf('selection') < 0) {
                this.applyStyles(selectedElements, index);
            }
            if (accumulation.enableBorderOnMouseMove && selectedElements[0].id.indexOf('datalabel') === -1) {
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
     * @param {AccumulationChart} accumulation - The accumulation chart control.
     * @returns {void}
     */
    public redrawSelection(accumulation: AccumulationChart): void {
        let selectedDataIndexes: Indexes[] = <Indexes[]>extend([], this.selectedDataIndexes, null, true);
        const highlightDataIndexes: Indexes[] = <Indexes[]>extend([], this.highlightDataIndexes, null, true);
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
     *
     * @param {AccumulationChart} accumulation - The accumulation chart control.
     * @param {Index[]} indexes - The array of indexes representing elements to remove selection styles.
     * @returns {void}
     */
    private removeSelectedElements(accumulation: AccumulationChart, indexes: Index[]): void {
        for (const index of indexes) {
            this.removeStyles([this.getElementByIndex(index)], index);
        }
        const points: AccPoints[] = accumulation.visibleSeries[0].points;
        for (let i: number = 0; i < points.length; i++) {
            const index: Index = new Index(0, points[i as number].index);
            this.removeStyles([this.getElementByIndex(index)], index);
        }
    }
    /**
     * To perform the selection for legend elements.
     *
     * @private
     */

    public legendSelection(accumulation: AccumulationChart, series: number, pointIndex: number,
                           targetEle: Element, eventType: string): void {
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
        const isPreSelected: boolean = this.isAlreadySelected(targetEle, eventType);
        if (isPreSelected) {
            //let element: Element = <Element>accumulation.getSeriesElement().childNodes[series as number].childNodes[pointIndex as number];
            //let seriesStyle: string = this.generateLegendClickStyle(accumulation.visibleSeries[series as number], eventType);
            const seriesElements: Element = <Element>accumulation.getSeriesElement().
                childNodes[series as number].childNodes[pointIndex as number];
            const dataLabelElement: HTMLElement = document.getElementById(accumulation.element.id + '_datalabel_Series_' + series + '_g_' + pointIndex);
            if (this.series[0].dataLabel.visible && dataLabelElement) {
                this.selection(accumulation, new Index(series, pointIndex), [dataLabelElement]);
            }
            this.selection(accumulation, new Index(series, pointIndex), [seriesElements]);
            this.blurEffect(accumulation.element.id, accumulation.visibleSeries);
        }
    }
    /**
     * To select the element by selected data indexes.
     *
     * @param {Index[]} indexes - The array of indexes representing elements to select.
     * @param {AccumulationChart} accumulation - The accumulation chart control.
     * @returns {void}
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
     *
     * @param {AccumulationChart} accumulation - The Accumulation Chart control.
     * @param {Index[]} index - The array of indexes representing elements to remove selection styles for multi selection process.
     * @param {Index} currentIndex - The current index to remove from selection.
     * @param {AccumulationSeriesModel[]} seriesCollection - The array of visible series in the accumulation chart.
     * @returns {void}
     */
    private removeMultiSelectEelments(accumulation: AccumulationChart, index: Index[], currentIndex: Index,
                                      seriesCollection: AccumulationSeriesModel[]): void {
        let series: AccumulationSeriesModel;
        for (let i: number = 0; i < index.length; i++) {
            series = seriesCollection[index[i as number].series];
            if (!this.checkEquals(index[i as number], currentIndex)) {
                this.removeStyles(this.findElements(accumulation, series, index[i as number]), index[i as number]);
                if (series.dataLabel.visible) {
                    this.removeStyles([document.getElementById(accumulation.element.id + '_datalabel_Series_0_g_' + index[i as number].point)], index[i as number]);
                }
                index.splice(i, 1);
                i--;
            }
        }
    }
    /**
     * To apply the opacity effect for accumulation chart series elements.
     *
     * @param  {string} pieId - The id of the pie element.
     * @param  {AccumulationSeries[]} visibleSeries - The array of visible series in the accumulation chart.
     * @returns {void}
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
     *
     * @param  {Element} element - The element to check selection elements by style class name.
     * @param  {string} className - The class name to check.
     * @param  {boolean} visibility - Indicates whether the element should be visible.
     * @returns {void}
     */
    private checkSelectionElements(element: Element, className: string, visibility: boolean): void {
        const selectionElements: Node[] = [];
        const children: NodeList = element.childNodes[0].childNodes;
        children.forEach((child: Node) => selectionElements.push(child));
        const dataLabelElement: HTMLElement | null = document.getElementById(this.control.element.id + '_datalabel_Series_0');
        if (dataLabelElement) {
            const dataLabelChildren: NodeList = dataLabelElement.childNodes;
            dataLabelChildren.forEach((child: Node) => selectionElements.push(child));
        }
        let legendShape: Element;
        let elementClass: string;
        let parentClass: string;
        //let selectElement: Element = element;
        for (let i: number = 0; i < selectionElements.length; i++) {
            elementClass = (selectionElements[i as number] as HTMLElement).getAttribute('class') || '';
            parentClass = (<Element>selectionElements[i as number].parentNode).getAttribute('class') || '';
            if (this.accumulation.selectionMode !== 'None' || this.accumulation.highlightMode !== 'None') {
                className = elementClass.indexOf('selection') > 0 ||
                    elementClass.indexOf('highlight') > 0 ? elementClass : className;
                className = (parentClass.indexOf('selection') > 0 ||
                    parentClass.indexOf('highlight') > 0) ? parentClass : className;
            }
            if (elementClass.indexOf(className) === -1 && parentClass.indexOf(className) === -1 && visibility) {
                this.addSvgClass(selectionElements[i as number] as HTMLElement, this.unselected);
            } else {
                this.removeSvgClass(selectionElements[i as number] as HTMLElement, this.unselected);
            }
            if (elementClass.indexOf(className) === -1 &&
                parentClass.indexOf(className) === -1 && visibility) {
                this.addSvgClass(selectionElements[i as number] as HTMLElement, this.unselected);
            } else {
                // selectElement = children[i as number] as HTMLElement;
                this.removeSvgClass(selectionElements[i as number] as HTMLElement, this.unselected);
                this.removeSvgClass(<Element>selectionElements[i as number].parentNode, this.unselected);
            }
            if ((this.control as AccumulationChart).accumulationLegendModule &&
            (this.control as AccumulationChart).legendSettings.visible) {
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
     *
     * @param  {Element[]} elements - The array of elements to apply the selection style.
     * @param  {Index} index - The index to apply the selection style.
     * @returns {void}
     */
    private applyStyles(elements: Element[], index: Index): void {
        const accumulationTooltip: AccumulationTooltip = (this.control as AccumulationChart).accumulationTooltipModule;
        for (const element of elements) {
            let legendShape: Element;
            if (element) {
                if ((this.control as AccumulationChart).accumulationLegendModule &&
                (this.control as AccumulationChart).legendSettings.visible) {
                    legendShape = document.getElementById(this.control.element.id + '_chart_legend_shape_' + index.point);
                    this.removeSvgClass(legendShape, legendShape.getAttribute('class'));
                    this.addSvgClass(legendShape, this.getSelectionClass(legendShape.id, index.point));
                }
                this.removeSvgClass(<Element>element.parentNode, this.unselected);
                this.removeSvgClass(element, this.unselected);
                const opacity: number = accumulationTooltip && (accumulationTooltip.previousPoints.length > 0 &&
                    accumulationTooltip.previousPoints[0].point.index !== index.point) ?
                    accumulationTooltip.svgTooltip.opacity : this.series[index.series].opacity;
                element.setAttribute('opacity', opacity.toString());
                this.addSvgClass(element, this.getSelectionClass(element.id, index.point));
            }
        }
    }
    /**
     * To get selection style class name by id.
     *
     * @param  {string} id - The id of the element to retrieve the selection style class name.
     * @param  {number} point - The point for the selection.
     * @returns {string} - The selection style class name.
     */
    private getSelectionClass(id: string, point?: number): string {
        return this.generateStyle((this.control as AccumulationChart).series[indexFinder(id).series], point);
    }
    /**
     * To remove selection style for elements.
     *
     * @param  {Element[]} elements - The array of elements from which to remove the selection style.
     * @param  {Index} index - The index to remove from the selection.
     * @returns {void}
     */
    private removeStyles(elements: Element[], index: Index): void {
        const accumulationTooltip: AccumulationTooltip = (this.control as AccumulationChart).accumulationTooltipModule;
        let legendShape: Element;
        for (const element of elements) {
            if (element) {
                if ((this.control as AccumulationChart).accumulationLegendModule &&
                (this.control as AccumulationChart).legendSettings.visible) {
                    legendShape = document.getElementById(this.control.element.id + '_chart_legend_shape_' + index.point);
                    this.removeSvgClass(legendShape, this.getSelectionClass(legendShape.id, index.point));
                }
                const opacity: number = accumulationTooltip && accumulationTooltip.previousPoints.length > 0
                    && (accumulationTooltip.previousPoints[0].point.index === index.point) ?
                    accumulationTooltip.svgTooltip.opacity : this.series[index.series].opacity;
                element.setAttribute('opacity', opacity.toString());
                this.removeSvgClass(element, this.getSelectionClass(element.id, index.point));
            }
        }
    }
    /**
     * To apply or remove selected elements index.
     *
     * @param  {Index[]} indexes - The array of indexes representing elements to apply or remove selection.
     * @param  {Index} index - The index to add or remove from the selection.
     * @param  {boolean} add - Indicates whether to add or remove the index.
     * @returns {void}
     */
    private addOrRemoveIndex(indexes: Index[], index: Index, add?: boolean): void {
        for (let i: number = 0; i < indexes.length; i++) {
            if (this.checkEquals(indexes[i as number], index)) {
                indexes.splice(i, 1);
                i--;
            }
        }
        if (add) { indexes.push(index); }
    }
    /**
     * To check two index, point and series are equal.
     *
     * @param  {Index} first - The first index.
     * @param  {Index} second - The second index.
     * @returns {boolean} - Indicates whether the two indexes are equal.
     */
    private checkEquals(first: Index, second: Index): boolean {
        return ((first.point === second.point) && (first.series === second.series));
    }
    /**
     *The mouse move event.
     *
     * @private
     * @param  {PointerEvent | TouchEvent} event - The mouse move event or touch event.
     * @returns {void}
     */
    public mouseMove(event: PointerEvent | TouchEvent): void{
        const accumulation: AccumulationChart = this.accumulation;
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
    // /**
    //  * To check selected points are visibility.
    //  *
    //  * @param  {Indexes[]} selectedDataIndexes - The array of indexes representing selected points.
    //  * @returns {boolean} - Indicates whether the selected points are visible.
    //  */
    // private checkPointVisibility(selectedDataIndexes: Indexes[]): boolean {
    //     let visible: boolean = false;
    //     for (const data of selectedDataIndexes) {
    //         if (pointByIndex(data.point, <AccPoints[]>this.control.visibleSeries[0].points).visible) {
    //             visible = true;
    //             break;
    //         }
    //     }
    //     return visible;
    // }
    /**
     * Get module name.
     *
     * @private
     * @returns {string} - Returns the module name.
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
