/**
 * AccumulationChart Selection src file
 */
import { SvgRenderer} from '@syncfusion/ej2-base';
import { extend } from '@syncfusion/ej2-base';
import { Rect, indexFinder } from '../../common/utils/helper';
import { AccumulationSelectionMode } from '../model/enum';
import { AccumulationChart } from '../accumulation';
import { AccumulationSeries, pointByIndex, AccPoints } from '../model/acc-base';
import { AccumulationSeriesModel } from '../model/acc-base-model';
import { Indexes, Index } from '../../common/model/base';
import { BaseSelection } from '../../common/user-interaction/selection';
/**
 * `AccumulationSelection` module handles the selection for accumulation chart.
 */
export class AccumulationSelection extends BaseSelection {
    private renderer: SvgRenderer;
    /** @private */
    public rectPoints: Rect;
    public selectedDataIndexes: Indexes[];
    private series: AccumulationSeries[];

    constructor(accumulation: AccumulationChart) {
        super(accumulation);
        this.renderer = accumulation.renderer;
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
     * @param  {AccumulationChart} chart - Define the chart to invoke the selection.
     * @return {void}
     */
    public invokeSelection(accumulation: AccumulationChart): void {
        this.initPrivateVariables(accumulation);
        this.series = <AccumulationSeries[]>extend({}, accumulation.visibleSeries, null, true);
        this.seriesStyles();
        this.selectDataIndex(this.concatIndexes(accumulation.selectedDataIndexes, this.selectedDataIndexes), accumulation);
    }
    /**
     * To get series selection style by series.
     */
    private generateStyle(series: AccumulationSeriesModel): string {
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
        let elementId: string = this.control.element.id + '_Series_' + index.series + '_Point_' + index.point;
        return document.getElementById(elementId);
    }
    /**
     * To calculate selected elements on mouse click or touch
     * @private
     */
    public calculateSelectedElements(accumulation: AccumulationChart, event: Event): void {
        if ((<HTMLElement>event.target).id.indexOf(accumulation.element.id + '_') === -1) {
            return;
        }
        if ((<HTMLElement>event.target).id.indexOf('_Series_') > -1 || (<HTMLElement>event.target).id.indexOf('_datalabel_') > -1) {
            this.performSelection(indexFinder((<HTMLElement>event.target).id), accumulation, <Element>event.target);
        }
    }
    /**
     * To perform the selection process based on index and element.
     */
    private performSelection(index: Index, accumulation: AccumulationChart, element?: Element): void {
        element = element.id.indexOf('datalabel') > -1 ?
        <Element>accumulation.getSeriesElement().childNodes[index.series].childNodes[index.point]
            : element;
        switch (accumulation.selectionMode) {
            case 'Point':
                if (!isNaN(index.point)) {
                    this.selection(accumulation, index, [element]);
                    this.blurEffect(accumulation.element.id, accumulation.visibleSeries);
                }
                break;
        }
    }
    /**
     * To select the element by index. Adding or removing selection style class name.
     */
    private selection(accumulation: AccumulationChart, index: Index, selectedElements: Element[]): void {
        if (!accumulation.isMultiSelect) {
            this.removeMultiSelectEelments(accumulation, this.selectedDataIndexes, index, accumulation.series);
        }
        let className: string = selectedElements[0] && (selectedElements[0].getAttribute('class') || '');
        if (selectedElements[0] && className.indexOf(this.getSelectionClass(selectedElements[0].id)) > -1) {
            this.removeStyles(selectedElements, index);
            this.addOrRemoveIndex(this.selectedDataIndexes, index);
        } else {
            this.applyStyles(selectedElements, index);
            this.addOrRemoveIndex(this.selectedDataIndexes, index, true);
        }
    }
    /**
     * To redraw the selection process on accumulation chart refresh.
     * @private
     */
    public redrawSelection(accumulation: AccumulationChart, oldMode: AccumulationSelectionMode): void {
        let selectedDataIndexes: Indexes[] = <Indexes[]>extend([], this.selectedDataIndexes, null, true);
        this.removeSelectedElements(accumulation, this.selectedDataIndexes);
        this.blurEffect(accumulation.element.id, accumulation.visibleSeries);
        this.selectDataIndex(selectedDataIndexes, accumulation);
    }
    /**
     * To remove the selected elements style classes by indexes.
     */
    private removeSelectedElements(accumulation: AccumulationChart, indexes: Index[]): void {
        let seriesgroup: Element = accumulation.getSeriesElement();
        for (let index of indexes) {
            this.removeStyles([this.getElementByIndex(index)], index);
        }
    }
    /**
     * To perform the selection for legend elements. 
     * @private
     */
    public legendSelection(accumulation: AccumulationChart, series: number, pointIndex: number): void {
        let element: Element = <Element>accumulation.getSeriesElement().childNodes[series].childNodes[pointIndex];
        let seriesStyle: string = this.generateStyle(accumulation.visibleSeries[series]);
        let seriesElements: Element = <Element>accumulation.getSeriesElement().childNodes[series].childNodes[pointIndex];
        this.selection(accumulation, new Index(series, pointIndex), [seriesElements]);
        this.blurEffect(accumulation.element.id, accumulation.visibleSeries);
    }
    /**
     * To select the element by selected data indexes.
     */
    private selectDataIndex(indexes: Index[], accumulation: AccumulationChart): void {
        let element: Element;
        for (let index of indexes) {
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
        let visibility: boolean = this.checkPointVisibility(this.selectedDataIndexes); // legend click scenario
        for (let series of visibleSeries) {
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
        let children: NodeList = element.childNodes[0].childNodes;
        let legendShape: Element;
        let elementClass: string;
        let parentClass: string;
        for (let i: number = 0; i < children.length; i++) {
            elementClass = (children[i] as HTMLElement).getAttribute('class') || '';
            parentClass = (<Element>children[i].parentNode).getAttribute('class') || '';
            if (elementClass.indexOf(className) === -1 && parentClass.indexOf(className) === -1 && visibility) {
                this.addSvgClass(children[i] as HTMLElement, this.unselected);
            } else {
                this.removeSvgClass(children[i] as HTMLElement, this.unselected);
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
        for (let element of elements) {
            let legendShape: Element;
            if (element) {
                if ((this.control as AccumulationChart).accumulationLegendModule && this.control.legendSettings.visible) {
                    legendShape = document.getElementById(this.control.element.id + '_chart_legend_shape_' + index.point);
                    this.removeSvgClass(legendShape, this.unselected);
                    this.addSvgClass(legendShape, this.getSelectionClass(legendShape.id));
                }
                this.removeSvgClass(<Element>element.parentNode, this.unselected);
                this.removeSvgClass(element, this.unselected);
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
        let legendShape: Element;
        for (let element of elements) {
            if (element) {
                if ((this.control as AccumulationChart).accumulationLegendModule && this.control.legendSettings.visible) {
                    legendShape = document.getElementById(this.control.element.id + '_chart_legend_shape_' + index.point);
                    this.removeSvgClass(legendShape, this.getSelectionClass(legendShape.id));
                }
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
    /**
     * To check selected points are visibility
     */
    private checkPointVisibility(selectedDataIndexes: Indexes[]): boolean {
        let visible: boolean = false;
        for (let data of selectedDataIndexes) {
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
     * @return {void}
     * @private
     */
    public destroy(accumulation: AccumulationChart): void {
        // Destroy method performed here
    }
}