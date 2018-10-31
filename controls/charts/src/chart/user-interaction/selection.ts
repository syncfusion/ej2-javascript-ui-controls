/**
 * Selection src file
 */
import { SvgRenderer, Browser} from '@syncfusion/ej2-base';
import { remove } from '@syncfusion/ej2-base';
import { extend, isNullOrUndefined } from '@syncfusion/ej2-base';
import {
    ChartLocation, Rect, RectOption, CircleOption, withInBounds, getDraggedRectLocation,
    removeElement, getElement
} from '../../common/utils/helper';
import { SelectionMode } from '../utils/enum';
import { Chart } from '../chart';
import { Series, Points } from '../series/chart-series';
import { SeriesModel } from '../series/chart-series-model';
import { Indexes, Index } from '../../common/model/base';
import { IDragCompleteEventArgs } from '../../common/model/interface';
import { dragComplete } from '../../common/model/constants';
import { BaseSelection } from '../../common/user-interaction/selection';
/**
 * `Selection` module handles the selection for chart.
 */
export class Selection extends BaseSelection {

    private renderer: SvgRenderer;
    private isSeriesMode: boolean;
    private resizing: boolean;
    /** @private */
    public rectPoints: Rect;
    private closeIconId: string;
    private closeIcon: Element;
    private draggedRectGroup: string;
    private draggedRect: string;
    /** @private */
    public selectedDataIndexes: Indexes[];
    private series: Series[];
    private dragging: boolean;
    private dragRect: Rect;
    private rectGrabbing: boolean;
    private resizeMode: number;
    private chart: Chart;
    /**
     * Constructor for selection module.
     * @private.
     */

    constructor(chart: Chart) {
        super(chart);
        this.chart = chart;
        this.renderer = chart.renderer;
        this.addEventListener();
    }
    /**
     * Binding events for selection module.
     */
    private addEventListener(): void {
        if (this.chart.isDestroyed) { return; }
        let cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        this.chart.on(Browser.touchMoveEvent, this.mouseMove, this);
        this.chart.on(cancelEvent, this.completeSelection, this);
        this.chart.on('click', this.calculateSelectedElements, this);
        this.chart.on(Browser.touchStartEvent, this.mousedown, this);
        this.chart.on(Browser.touchEndEvent, this.completeSelection, this);
    }
    /**
     * Chart mouse down 
     */
    private mousedown(e: Event): void {
        let chart: Chart = this.chart;
        if (chart.selectionMode === 'None' || chart.isChartDrag) {
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
        this.chart.off('pointerleave' || 'mouseleave', this.completeSelection);
        this.chart.off('click', this.calculateSelectedElements);
        this.chart.off(Browser.touchStartEvent, this.mousedown);
        this.chart.off(Browser.touchEndEvent, this.completeSelection);
    }
    /**
     * To find private variable values 
     */
    private initPrivateVariables(chart: Chart): void {
        this.styleId = chart.element.id + '_ej2_chart_selection';
        this.unselected = chart.element.id + '_ej2_deselected';
        this.closeIconId = chart.element.id + '_ej2_drag_close';
        this.draggedRectGroup = chart.element.id + '_ej2_drag_group';
        this.draggedRect = chart.element.id + '_ej2_drag_rect';
        this.selectedDataIndexes = [];
        this.rectPoints = null;
        this.isSeriesMode = chart.selectionMode === 'Series';
    }
    /**
     * Method to select the point and series.
     * @return {void}
     */
    public invokeSelection(chart: Chart): void {
        this.initPrivateVariables(chart);
        this.series = <Series[]>extend({}, chart.visibleSeries, null, true);
        this.seriesStyles();
        if (!(chart.selectionMode.indexOf('Drag') > -1)) {
            this.selectDataIndex(chart, this.concatIndexes(chart.selectedDataIndexes, this.selectedDataIndexes));
        }
    }
    private generateStyle(series: SeriesModel): string {
        if (series) {
            return (series.selectionStyle || this.styleId + '_series_' + (<Series>series).index);
        }
        return 'undefined';
    }
    private selectDataIndex(chart: Chart, indexes: Index[]): void {
        for (let index of indexes) {
            this.performSelection(index, chart, this.getElementByIndex(chart, index)[0]);
        }
    }
    private getElementByIndex(chart: Chart, index: Index, suffix: string = ''): Element[] {
        let elementId: string = chart.element.id + '_Series_' + index.series + '_Point' + '_' + index.point;
        let series: Series = <Series>chart.series[index.series];
        elementId = (!series.isRectSeries && series.type !== 'Scatter' && series.type !== 'Bubble' &&
        series.marker.visible) ? (elementId + '_Symbol' + suffix) : elementId;

        return [getElement(elementId), (series.type === 'RangeArea' && series.marker.visible) ? getElement(elementId + '1') : null];
    }
    private getClusterElements(chart: Chart, index: Index): Element[] {
        let clusters: Element[] = [];
        for (let series of chart.visibleSeries) {
            index = new Index(series.index, index.point);
            clusters.push(this.getElementByIndex(chart, index)[0]);
        }
        return clusters;
    }
    private findElements(chart: Chart, series: SeriesModel, index: Index, suffix: string = ''): Element[] {
        if (this.isSeriesMode) {
            return this.getSeriesElements(series);
        } else if (chart.selectionMode === 'Cluster') {
            return this.getClusterElements(chart, index);
        } else {
            return this.getElementByIndex(chart, index, suffix);
        }
    }
    /**
     * To find the selected element.
     * @return {void}
     * @private
     */
    public calculateSelectedElements(event: Event): void {
        if (this.chart.selectionMode === 'None' || (<HTMLElement>event.target).id.indexOf(this.chart.element.id + '_') === -1) {
            return;
        }
        if ((<HTMLElement>event.target).id.indexOf('_Series_') > -1) {
            this.performSelection(this.indexFinder((<HTMLElement>event.target).id), this.chart, <Element>event.target);
        }
    }
    private performSelection(index: Index, chart: Chart, element?: Element): void {
        this.isSeriesMode = chart.selectionMode === 'Series';
        if (chart.series[index.series].type === 'BoxAndWhisker' &&
            element.id === chart.element.id + '_Series_' + index.series + '_Point_' + index.point + '_BoxPath') {
            element = element.parentElement;
        }
        switch (chart.selectionMode) {
            case 'Series':
                this.selection(chart, index, this.getSeriesElements(chart.series[index.series]));
                this.blurEffect(chart.element.id, chart.visibleSeries);
                break;
            case 'Point':
                if (!isNaN(index.point)) {
                    this.selection(chart, index, [element]);
                    this.blurEffect(chart.element.id, chart.visibleSeries);
                }
                break;
            case 'Cluster':
                if (!isNaN(index.point)) {
                    this.clusterSelection(chart, <Series[]>chart.series, index);
                    this.blurEffect(chart.element.id, chart.visibleSeries);
                }
                break;
        }
    }
    private selection(chart: Chart, index: Index, selectedElements: Element[]): void {
        if (!chart.isMultiSelect && (chart.selectionMode.indexOf('Drag') === -1)) {
            this.removeMultiSelectEelments(chart, this.selectedDataIndexes, index, chart.series);
        }
        let className: string = selectedElements[0] && (selectedElements[0].getAttribute('class') || '');
        if (selectedElements[0] && className.indexOf(this.getSelectionClass(selectedElements[0].id)) > -1) {
            this.removeStyles(selectedElements);
            this.addOrRemoveIndex(this.selectedDataIndexes, index);
        } else {
            this.applyStyles(selectedElements);
            this.addOrRemoveIndex(this.selectedDataIndexes, index, true);
        }
    }
    private clusterSelection(chart: Chart, series: Series[], index: Index): void {
        this.selection(chart, index, this.getClusterElements(chart, new Index(index.series, index.point)));
    }
    private removeMultiSelectEelments(chart: Chart, index: Index[], currentIndex: Index, seriesCollection: SeriesModel[]): void {
        let series: SeriesModel;
        for (let i: number = 0; i < index.length; i++) {
            series = seriesCollection[index[i].series];
            if ((this.isSeriesMode && !this.toEquals(index[i], currentIndex, this.isSeriesMode)) ||
                (this.control.selectionMode === 'Cluster' && !this.toEquals(index[i], currentIndex, false)) ||
                (!this.isSeriesMode && this.toEquals(index[i], currentIndex, true) && !this.toEquals(index[i], currentIndex, false))) {
                this.removeStyles(this.findElements(chart, series, index[i]));
                index.splice(i, 1);
                i--;
            }
        }
    }
    private blurEffect(chartId: string, visibleSeries: Series[]): void {
        let visibility: boolean = this.checkVisibility(this.selectedDataIndexes); // legend click scenario
        for (let series of visibleSeries) {
            if (series.visible) {
                this.checkSelectionElements(
                    getElement(chartId + 'SeriesGroup' + series.index),
                    this.generateStyle(series), visibility
                );
                if (!isNullOrUndefined(getElement(chartId + 'SymbolGroup' + series.index))) {
                    this.checkSelectionElements(
                        getElement(chartId + 'SymbolGroup' + series.index),
                        this.generateStyle(series), visibility
                    );
                }
            }
        }
    }
    private checkSelectionElements(element: Element, className: string, visibility: boolean): void {
        let children: HTMLCollection | Element[] = <Element[]>(this.isSeriesMode ? [element] : element.childNodes);
        let elementClassName: string;
        let parentClassName: string;
        let legendShape: Element;
        let selectElement: Element = element;
        for (let i: number = 0; i < children.length; i++) {
            elementClassName = children[i].getAttribute('class') || '';
            parentClassName = (<Element>children[i].parentNode).getAttribute('class') || '';
            if (elementClassName.indexOf(className) === -1 &&
                parentClassName.indexOf(className) === -1 && visibility) {
                this.addSvgClass(children[i], this.unselected);
            } else {
                selectElement = children[i];
                this.removeSvgClass(children[i], this.unselected);
            }
        }
        if ((this.control as Chart).legendModule && this.control.legendSettings.visible) {
            legendShape = document.getElementById(this.control.element.id + '_chart_legend_shape_' + className.split('_series_')[1]);
            if (legendShape) {
                elementClassName = selectElement.getAttribute('class') || '';
                parentClassName = (<Element>selectElement.parentNode).getAttribute('class') || '';
                if (elementClassName.indexOf(className) === -1 && parentClassName.indexOf(className) === -1 && visibility) {
                    this.addSvgClass(legendShape, this.unselected);
                } else {
                    this.removeSvgClass(legendShape, this.unselected);
                }
            }
        }
    }
    private applyStyles(elements: Element[]): void {
        for (let element of elements) {
            if (element) {
                this.removeSvgClass(<Element>element.parentNode, this.unselected);
                this.removeSvgClass(element, this.unselected);
                this.addSvgClass(element, this.getSelectionClass(element.id));
            }
        }
    }
    private getSelectionClass(id: string): string {
        return this.generateStyle((this.control as Chart).series[this.indexFinder(id).series]);
    }
    private removeStyles(elements: Element[]): void {
        for (let element of elements) {
            if (element) {
                this.removeSvgClass(
                    element, this.getSelectionClass(element.id)
                );
            }
        }
    }
    private addOrRemoveIndex(indexes: Index[], index: Index, add?: boolean): void {
        for (let i: number = 0; i < indexes.length; i++) {
            if (this.toEquals(indexes[i], index, this.isSeriesMode)) {
                indexes.splice(i, 1);
                i--;
            }
        }
        if (add) { indexes.push(index); }
    }
    private toEquals(first: Index, second: Index, checkSeriesOnly: boolean): boolean {
        return ((first.series === second.series || (this.control.selectionMode === 'Cluster' && !checkSeriesOnly))
            && (checkSeriesOnly || (first.point === second.point)));
    }
    /**
     * To redraw the selected points.
     * @return {void}
     * @private
     */
    public redrawSelection(chart: Chart, oldMode: SelectionMode): void {
        this.isSeriesMode = oldMode === 'Series';
        let selectedDataIndexes: Indexes[] = <Indexes[]>extend([], this.selectedDataIndexes, null, true);
        this.removeSelectedElements(chart, this.selectedDataIndexes, chart.series);
        this.blurEffect(chart.element.id, chart.visibleSeries);
        this.selectDataIndex(chart, selectedDataIndexes);
    }
    /** @private */
    public legendSelection(chart: Chart, series: number): void {
        let seriesStyle: string = this.generateStyle(chart.visibleSeries[series]);
        let selectedElements: HTMLCollection = document.getElementsByClassName(seriesStyle);
        this.isSeriesMode = chart.selectionMode === 'Series';
        let isBlurEffectNeeded: boolean = true;
        if (selectedElements.length > 0) {
            let elements: Element[] = [];
            for (let i: number = 0; i < selectedElements.length; i++) {
                elements.push(selectedElements[i]);
            }
            this.removeStyles(elements);
            this.isSeriesMode = true;
            this.addOrRemoveIndex(this.selectedDataIndexes, new Index(series, NaN));
            for (let series of chart.visibleSeries) {
                seriesStyle = this.generateStyle(series);
                if (document.getElementsByClassName(seriesStyle).length > 0) {
                    for (let element of elements) {
                        this.checkSelectionElements(element, seriesStyle, true);
                    }
                    isBlurEffectNeeded = false;
                    break;
                }
            }
            if (isBlurEffectNeeded) {
                this.isSeriesMode = chart.selectionMode === 'Series';
                this.blurEffect(chart.element.id, chart.visibleSeries);
            }
        } else {
            let seriesElements: Element[] = this.getSeriesElements(chart.visibleSeries[series]);
            for (let seriesElement of seriesElements) {
                this.checkSelectionElements(seriesElement, seriesStyle, false);
            }
            this.isSeriesMode = true;
            this.selection(chart, new Index(series, NaN), seriesElements);
            this.isSeriesMode = chart.selectionMode === 'Series';
            this.blurEffect(chart.element.id, chart.visibleSeries);
        }
    }
    private getSeriesElements(series: SeriesModel): Element[] {
        let seriesElements: Element[] = [(<Series>series).seriesElement];
        if (series.marker.visible && series.type !== 'Scatter' && series.type !== 'Bubble' && !(<Series>series).isRectSeries) {
            seriesElements.push((<Series>series).symbolElement);
        }
        return seriesElements;
    }
    private indexFinder(id: string): Index {
        let ids: string[] = ['NaN', 'NaN'];
        if (id.indexOf('SeriesGroup') > -1) {
            ids = id.split('SeriesGroup');
            ids[0] = ids[1];
        } else if (id.indexOf('SymbolGroup') > -1) {
            ids = id.split('SymbolGroup');
            ids[0] = ids[1];
        } else if (id.indexOf('_Point_') > -1) {
            ids = id.split('_Series_')[1].split('_Point_');
        } else if (id.indexOf('_Series_') > -1) {
            ids[0] = id.split('_Series_')[1];
        }
        return new Index(parseInt(ids[0], 10), parseInt(ids[1], 10));
    }
    /**
     * Drag selection that returns the selected data.
     * @return {void}
     * @private
     */
    public calculateDragSelectedElements(chart: Chart, dragRect: Rect): void {
        this.removeSelectedElements(chart, this.selectedDataIndexes, chart.series);
        let rect: Rect = new Rect(dragRect.x, dragRect.y, dragRect.width, dragRect.height);
        let axisOffset: ChartLocation = new ChartLocation(
            chart.chartAxisLayoutPanel.seriesClipRect.x,
            chart.chartAxisLayoutPanel.seriesClipRect.y
        );
        this.removeOffset(rect, axisOffset);
        let points: Points[];
        let index: Index;
        let selectedPointValues: { x: string, y: number }[] = [];
        let selectedSeriesValues: { x: string, y: number }[][] = [];
        this.isSeriesMode = false;
        let symbolLocation: ChartLocation;
        for (let series of chart.visibleSeries) {
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
                    let yValue: number = series.type !== 'RangeArea' ? points[j].yValue :
                        points[j].regions[0].y;
                    let isCurrentPoint: boolean;
                    if (series.type === 'BoxAndWhisker') {
                        isCurrentPoint = points[j].regions.some((region: Rect): boolean => {
                            return withInBounds(
                                region.x + xAxisOffset,
                                region.y + yAxisOffset, rect
                            );
                        });
                    } else {
                        isCurrentPoint = points[j].symbolLocations.some((location: ChartLocation) => {
                            return location && withInBounds(location.x + xAxisOffset, location.y + yAxisOffset, rect);
                        });
                    }
                    if (isCurrentPoint && series.category !== 'Indicator') {
                        index = new Index((<Series>series).index, points[j].index);
                        this.selection(chart, index, this.findElements(chart, series, index));
                        selectedPointValues.push({ x: points[j].xValue.toString(), y: yValue });
                    }
                    if (isCurrentPoint && series.type === 'RangeArea') {
                        selectedPointValues.push({ x: points[j].xValue.toString(), y: points[j].regions[0].y });
                    }
                }
                selectedSeriesValues.push(selectedPointValues);
            }
        }
        this.blurEffect(chart.element.id, chart.visibleSeries);
        this.rectPoints = new Rect(dragRect.x, dragRect.y, dragRect.width, dragRect.height);
        this.createCloseButton((dragRect.x + dragRect.width), dragRect.y);
        let args: IDragCompleteEventArgs = {
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
    /**
     * Method to draw dragging rect.
     * @return {void}
     * @private
     */
    public drawDraggingRect(chart: Chart, dragRect: Rect): void {
        let cartesianLayout: Rect = chart.chartAxisLayoutPanel.seriesClipRect;
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
        if (dragRect.width < 5 || dragRect.height < 5) {
            return null;
        }
        let element: Element = getElement(this.draggedRect);
        if (this.closeIcon) { removeElement(this.closeIconId); }
        if (element) {
            this.setAttributes(element, dragRect);
        } else {
            let dragGroup: Element = chart.renderer.createGroup({ id: this.draggedRectGroup });
            chart.svgObject.appendChild(dragGroup);
            element = chart.renderer.drawRectangle(new RectOption(
                this.draggedRect, chart.themeStyle.selectionRectFill,
                { color: chart.themeStyle.selectionRectStroke, width: 1 }, 1, dragRect));
            element.setAttribute('style', 'cursor:move;');
            dragGroup.appendChild(element);
        }
    }
    private createCloseButton(x: number, y: number): void {
        let closeIcon: Element = this.chart.renderer.createGroup({
            id: this.closeIconId,
            style: 'cursor:pointer; visibility: visible;'
        });
        closeIcon.appendChild(this.chart.renderer.drawCircle(
            new CircleOption(
                this.closeIconId + '_circle', '#FFFFFF',
                { color: this.chart.themeStyle.selectionCircleStroke, width: 1 }, 1, x, y, 10, )
        ));
        let direction: string = 'M ' + (x - 4) + ' ' + (y - 4) + ' L ' + (x + 4) + ' ' + (y + 4) + ' M ' + (x - 4) + ' ' + (y + 4) +
            ' L ' + (x + 4) + ' ' + (y - 4);
        closeIcon.appendChild(this.chart.renderer.drawPath({
            id: this.closeIconId + '_cross', d: direction,
            stroke: this.chart.themeStyle.selectionCircleStroke,
            'stroke-width': 2, fill: this.chart.themeStyle.selectionCircleStroke
        }));
        this.closeIcon = closeIcon;
        getElement(this.draggedRectGroup).appendChild(closeIcon);
    }
    /**
     * Method to remove dragged element.
     * @return {void}
     * @private
     */

    public removeDraggedElements(chart: Chart, event: Event): void {
        if (((<HTMLElement>event.target).id.indexOf(this.closeIconId) > -1) && (event.type.indexOf('move') === -1)) {
            this.removeSelectedElements(chart, this.selectedDataIndexes, chart.series);
            this.blurEffect(chart.element.id, chart.visibleSeries);
            remove(getElement(this.draggedRectGroup));
            this.changeCursorStyle(false, chart.svgObject, 'auto');
            this.rectPoints = null;
        }
    }
    /**
     * Method to resize the drag rect.
     * @return {void}
     * @private
     */
    public resizingSelectionRect(chart: Chart, location: ChartLocation, tapped?: boolean): void {
        let rect: Rect = new Rect(this.rectPoints.x, this.rectPoints.y, this.rectPoints.width, this.rectPoints.height);
        let resize: boolean = this.findResizeMode(chart.svgObject, rect, location);
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

    }
    private findResizeMode(chartSvgObject: Element, rect: Rect, location: ChartLocation): boolean {
        let cursorStyle: string = 'se-resize';
        let resize: boolean = false;
        if (!this.resizing) {
            let resizeEdges: Rect[] = [new Rect(rect.x, (rect.y - 10), rect.width - 5, 20), // top
            new Rect((rect.x - 10), rect.y, 20, rect.height), //left
            new Rect(rect.x, (rect.y + rect.height - 10), rect.width - 10, 20), //bottom
            new Rect((rect.x + rect.width - 10), rect.y + 5, 20, rect.height - 15), //right
            new Rect((rect.x + rect.width - 10), (rect.y + rect.height - 10), 20, 20)]; //corner
            for (let i: number = 0; i < resizeEdges.length; i++) {
                if (withInBounds(location.x, location.y, resizeEdges[i])) {
                    cursorStyle = (i === 4) ? cursorStyle : (i % 2 === 0) ? 'ns-resize' : 'ew-resize';
                    resize = true;
                    this.resizeMode = i;
                    break;
                }
            }
        } else {
            let x: number = rect.x;
            let y: number = rect.y;
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
        this.changeCursorStyle(resize, getElement(this.draggedRect), cursorStyle);
        this.changeCursorStyle(resize, chartSvgObject, cursorStyle);
        return resize;
    }
    private changeCursorStyle(isResize: boolean, rectelement: Element, cursorStyle: string): void {
        cursorStyle = isResize ? cursorStyle : (this.control.svgObject === rectelement) ? 'auto' : 'move';
        rectelement.setAttribute('style', 'cursor:' + cursorStyle + ';');
    }
    private removeSelectedElements(chart: Chart, index: Index[], seriesCollection: SeriesModel[]): void {
        index.splice(0, index.length);
        let seriesElements: Element[];
        for (let series of seriesCollection) {
            seriesElements = this.getSeriesElements(series);
            this.removeStyles(seriesElements);
            for (let seriesElement of seriesElements) {
                this.removeStyles(this.getChildren(seriesElement));
            }
        }
    }
    private setAttributes(ele: Element, object: Object): void {
        let keys: string[] = Object.keys(object);
        for (let key of keys) {
            ele.setAttribute(key, object[key]);
        }
    }
    /**
     * Method to move the dragged rect.
     * @return {void}
     * @private
     */
    public draggedRectMoved(chart: Chart, grabbedPoint: Rect, doDrawing?: boolean): void {
        let rect: Rect = new Rect(this.rectPoints.x, this.rectPoints.y, this.rectPoints.width, this.rectPoints.height);
        rect.x -= (grabbedPoint.x - chart.mouseX);
        rect.y -= (grabbedPoint.y - chart.mouseY);
        rect = getDraggedRectLocation(rect.x, rect.y, rect.x + rect.width, rect.height + rect.y, chart.chartAxisLayoutPanel.seriesClipRect);
        if (doDrawing) {
            this.drawDraggingRect(chart, rect);
        } else {
            this.calculateDragSelectedElements(chart, rect);
        }
    }
    /**
     * To complete the selection.
     * @return {void}
     * @private
     */
    public completeSelection(e: Event): void {
        let chart: Chart = this.chart;
        if (chart.selectionMode === 'None') {
            return;
        }
        if ((this.dragging || this.resizing) && this.dragRect.width > 5 && this.dragRect.height > 5) {
            this.calculateDragSelectedElements(chart, this.dragRect);
        } else if (this.rectGrabbing && this.rectPoints.width && this.rectPoints.height) {
            this.draggedRectMoved(chart, this.dragRect);
        }
        this.dragging = false;
        this.rectGrabbing = false;
        this.resizing = false;
        this.removeDraggedElements(chart, e);
    }
    private getDragRect(chart: Chart, seriesClipRect: Rect): Rect {
        return getDraggedRectLocation(chart.mouseDownX, chart.mouseDownY, chart.mouseX, chart.mouseY, seriesClipRect);
    }

    /** @private */
    public dragStart(chart: Chart, seriesClipRect: Rect, mouseDownX: number, mouseDownY: number, event: Event): void {
        this.dragging = (chart.selectionMode.indexOf('Drag') > - 1) && (chart.isDoubleTap || !chart.isTouch) &&
            chart.chartAreaType !== 'PolarRadar';
        if (this.dragging) {
            this.dragRect = new Rect(chart.mouseDownX, chart.mouseDownY, 0, 0);
            if (chart.mouseDownX < seriesClipRect.x || chart.mouseDownX > (seriesClipRect.x + seriesClipRect.width) ||
                chart.mouseDownY < seriesClipRect.y || chart.mouseDownY > (seriesClipRect.y + seriesClipRect.height)) {
                this.dragging = false;
            }
        }
        if (this.rectPoints) {
            this.dragRect = new Rect(chart.mouseDownX, chart.mouseDownY, 0, 0);
            this.resizingSelectionRect(chart, new ChartLocation(mouseDownX, mouseDownY), true);
            this.rectGrabbing = withInBounds(mouseDownX, mouseDownY, this.rectPoints);
        }
    }
    /** @private */
    public mouseMove(event: PointerEvent | TouchEvent): void {
        let chart: Chart = this.chart;
        if (chart.selectionMode === 'None') {
            return;
        }
        if (event.type === 'touchmove' && (Browser.isIos || Browser.isIos7) && this.dragging && event.preventDefault) {
            event.preventDefault();
        }
        let insideMoving: boolean = withInBounds(chart.mouseX, chart.mouseY, chart.chartAxisLayoutPanel.seriesClipRect);
        if (insideMoving) {
            if (this.rectGrabbing && !this.resizing) {
                this.draggedRectMoved(chart, this.dragRect, true);
            } else if (this.dragging && !this.resizing) {
                this.dragRect = this.getDragRect(chart, chart.chartAxisLayoutPanel.seriesClipRect);
                this.drawDraggingRect(chart, this.dragRect);
            }
            if (this.rectPoints) {
                this.resizingSelectionRect(chart, new ChartLocation(chart.mouseX, chart.mouseY));
            }
        } else {
            this.completeSelection(event);
        }
    }
    /**
     * Get module name.
     * @private
     */
    public getModuleName(): string {
        return 'Selection';
    }
    /**
     * To destroy the selection.
     * @return {void}
     * @private
     */
    public destroy(chart: Chart): void {
        this.removeEventListener();
        // Destroy method performed here
    }
}