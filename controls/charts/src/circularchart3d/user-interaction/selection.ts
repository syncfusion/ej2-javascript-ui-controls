/**
 * Circular 3D chart selection.
 */
import { Browser, extend, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Rect, SvgRenderer, CanvasRenderer } from '@syncfusion/ej2-svg-base';
import { getElement } from '../../common/utils/helper';
import { CircularChart3DSelectionMode, CircularChart3DHighlightMode } from '../model/enum';
import { CircularChart3D } from '../circularchart3d';
import { CircularChart3DPoints, CircularChart3DSeries } from '../renderer/series';
import { CircularChart3DSeriesModel } from '../renderer/series-model';
import { Indexes, Index } from '../../common/model/base';
import { BaseSelection } from '../../common/user-interaction/selection';
import { CircularChartTooltip3D } from './tooltip';
import { CircularChart3DSelectionCompleteEventArgs } from '../model/pie-interface';
import { selectionComplete } from '../../common/model/constants';

/**
 * The `CircularChart3DSelection` module handles the selection for circular 3D chart.
 */
export class CircularChartSelection3D extends BaseSelection {
    /** @private */
    public renderer: SvgRenderer | CanvasRenderer;
    /** @private */
    public rectPoints: Rect;
    /** @private */
    public selectedDataIndexes: Indexes[];
    /** @private */
    public highlightDataIndexes: Indexes[];
    /** @private */
    public series: CircularChart3DSeries[];
    /** @private */
    public circular3D: CircularChart3D;
    /** @private */
    public currentMode: CircularChart3DSelectionMode | CircularChart3DHighlightMode;
    /** @private */
    public previousSelectedElement: Element[];

    constructor(circular3D: CircularChart3D) {
        super(circular3D);
        this.circular3D = circular3D;
        this.renderer = circular3D.renderer;
        this.addEventListener();
    }

    /**
     * Binding events for selection module.
     *
     * @returns {void}
     */
    private addEventListener(): void {
        if (this.circular3D.isDestroyed) { return; }
        //let cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        this.circular3D.on(Browser.touchMoveEvent, this.mouseMove, this);
        this.circular3D.on('click', this.mouseClick, this);
    }

    /**
     * Unbinding events for selection module.
     *
     * @returns {void}
     */
    private removeEventListener(): void {
        if (this.circular3D.isDestroyed) { return; }
        this.circular3D.off(Browser.touchMoveEvent, this.mouseMove);
        this.circular3D.off('click', this.mouseClick);
    }

    /**
     * Initializes the private variables for selection and deselection.
     *
     * @param {CircularChart3D} circular3D - The instance of the circular 3D chart.
     * @returns {void}
     */
    private initPrivateVariables(circular3D: CircularChart3D): void {
        this.styleId = circular3D.element.id + '_ej2_chart_selection';
        this.unselected = circular3D.element.id + '_ej2_deselected';
        this.selectedDataIndexes = [];
        this.rectPoints = null;
    }

    /**
     * Invoke selection by creating selection style for rendered chart.
     *
     * @param {CircularChart3D} circular3D - The instance of the circular 3D chart.
     * @returns {void}
     */
    public invokeSelection(circular3D: CircularChart3D): void {
        this.initPrivateVariables(circular3D);
        this.series = <CircularChart3DSeries[]>extend({}, circular3D.visibleSeries, null, true);
        this.seriesStyles();
        this.currentMode = circular3D.selectionMode;
        this.selectDataIndex(this.concatIndexes(circular3D.selectedDataIndexes, this.selectedDataIndexes), circular3D);
    }

    /**
     * To get the series selection style class name based on the series and point index.
     *
     * @param {CircularChart3DSeriesModel} series - Specifies the series model.
     * @param {number} point - Specifies the point index.
     * @returns {string} - Returns the style class name.
     */
    private generateStyle(series: CircularChart3DSeriesModel, point?: number): string {
        return (this.styleId + '_series_' + (<CircularChart3DSeries>series).index + '_point_' + point);
    }

    /**
     * Gets series point elements based on the specified series and point index.
     *
     * @param {Index} index - Specifies the index of the series.
     * @returns {Element[]} - Returns the array of elements.
     */
    public getElementByIndex(index: Index): Element[] {
        const pointElements: Element[] = [];
        const elements: NodeListOf<HTMLElement> = document.querySelectorAll('[id*="-region-series-' + index.series + '-point-' + index.point + '"]');
        elements.forEach((pointElement: Element) => {
            if (pointElement.id.indexOf(this.circular3D.element.id + '-') > -1 && this.indexFinder(pointElement.id).point === index.point) {
                pointElements.push(pointElement as Element);
            }
        });
        const element: HTMLElement = document.getElementById(this.control.element.id + '-svg-data-label-text-' + index.point);
        const connectorElement: HTMLElement = document.getElementById(this.control.element.id + '-datalabel-series-0-connector-' + index.point);
        const shapeElement: HTMLElement = document.getElementById(this.control.element.id + '-svg-data-label-series-0-shape-' + index.point);
        if (element) { pointElements.push(element); }
        if (connectorElement) { pointElements.push(connectorElement); }
        if (shapeElement) { pointElements.push(shapeElement); }
        return pointElements;
    }

    /**
     * Checks whether the specified element is already selected based on the given event type and optional index.
     *
     * @param {Element} targetElement - The target element to be checked for selection status.
     * @param {string} eventType - The type of event triggering the selection check (e.g., 'mouse move').
     * @param {Index} [index] - The index to narrow down the selection check for elements with multiple occurrences.
     * @returns {boolean} - Returns true if the element is already selected; otherwise, returns false.
     * @private
     */
    public isAlreadySelected(targetElement: Element, eventType: string, index?: Index): boolean {
        if (eventType === 'mousemove') {
            this.currentMode = this.circular3D.highlightMode;
            this.highlightDataIndexes = [];
            this.styleId = this.circular3D.element.id + '_ej2_chart_highlight';
        } else if (eventType === 'click' || eventType === 'keyup') {
            this.currentMode = this.circular3D.selectionMode;
            this.styleId = this.circular3D.element.id + '_ej2_chart_selection';
        }
        if (this.circular3D.highlightMode !== 'None' && this.circular3D.selectionMode === 'None') {
            if (eventType === 'click') {
                return false;
            }
        }
        if (((this.circular3D.highlightMode !== 'None' || this.circular3D.legendSettings.enableHighlight) && this.previousSelectedElement && this.previousSelectedElement[0])) {
            let isElement: boolean;
            const nodeName: string | null = targetElement.nodeName;
            if (targetElement.parentNode) {
                isElement = ((nodeName === 'path' || nodeName === 'shape') && targetElement.id.indexOf('region') > 1) ? true : false;
            }
            for (let i: number = 0; i < this.previousSelectedElement.length; i++) {
                if (this.previousSelectedElement[i as number].hasAttribute('class')) {
                    if (this.previousSelectedElement[i as number].getAttribute('class').indexOf('highlight') > -1 &&
                        (isElement || eventType === 'click' || eventType === 'keyup')) {
                        let selectionClass: string;
                        this.previousSelectedElement[i as number].classList.forEach((className: string) => {
                            if (className.indexOf('selection') > -1) {
                                selectionClass = className;
                            }
                        });
                        this.previousSelectedElement[i as number].removeAttribute('class');
                        if (selectionClass) {
                            this.addSvgClass(this.previousSelectedElement[i as number], selectionClass);
                        }
                        this.previousSelectedElement[i as number].classList.remove(this.styleId + '_series_' + index.series);
                        this.addOrRemoveIndex(this.highlightDataIndexes,
                                              this.indexFinder((<HTMLElement>this.previousSelectedElement[i as number]).id));
                    } else if (!isElement && this.previousSelectedElement[i as number].getAttribute('class').indexOf('highlight') > -1) {
                        this.performSelection(this.indexFinder(this.previousSelectedElement[i as number].id), this.circular3D,
                                              this.previousSelectedElement[i as number]);
                    }
                }
            }
        }
        return true;
    }

    /**
     * Handles mouse click events on the specified circular 3D instance instance.
     *
     * @param {CircularChart3D} circular3D - The circular 3D instance where the mouse click event occurred.
     * @param {Event} event - The mouse click event triggering the action.
     * @returns {void}
     */
    public mouseClick(circular3D: CircularChart3D, event: Event): void {
        this.calculateSelectedElements(circular3D, event.target as Element, event.type);
    }

    /**
     * Calculates and processes selected elements based on the specified circular 3D chart instance, target element, and event type.
     *
     * @param {CircularChart3D} circular3D - The circular 3D chart instance to be used in the selection calculation.
     * @param {Element} targetElement - The target element involved in the selection calculation.
     * @param {string} eventType - The type of event triggering the selection calculation (e.g., 'click').
     * @returns {void}
     */
    public calculateSelectedElements(circular3D: CircularChart3D, targetElement: Element, eventType: string): void {
        if (isNullOrUndefined(targetElement)) {
            return;
        }
        if ((circular3D.selectionMode === 'None' && circular3D.highlightMode === 'None') ||
            targetElement.id && targetElement.id.indexOf(circular3D.element.id + '-') === -1) {
            return;
        }
        if (targetElement.getAttribute('id').indexOf('_connector_') > -1) {
            return;
        } else {
            this.isAlreadySelected(targetElement as HTMLElement, eventType, this.indexFinder(targetElement.id));
            if (targetElement.id.indexOf('-series-') > -1 || targetElement.id.indexOf('-data-label-') > -1) {
                this.performSelection(this.indexFinder(targetElement.id), circular3D, targetElement);
            }
        }
    }

    /**
     * Finds and returns the index associated with the specified identifier.
     *
     * @param {string} id - The identifier used to find the associated index.
     * @returns {Index} - The index associated with the specified identifier.
     * @private
     */
    public indexFinder(id: string): Index {
        let ids: string[] = ['NaN', 'NaN'];
        if (id.indexOf('-point-') > -1) {
            ids = id.split('-series-')[1].split('-point-');
        } else if (id.indexOf('-border-') > -1) {
            ids[0] = id.split('-border-')[1];
        } else if (id.indexOf('data-label-series-0-shape-') > -1 && (this.control as CircularChart3D).series[0].dataLabel.position === 'Inside') {
            ids[0] = '0';
            ids[1] = id.split('-shape-')[1];
        } else if (id.indexOf('-series-') > -1) {
            ids[0] = id.split('-series-')[1];
        } else if (id.indexOf('_chart_legend_shape_') > -1) {
            ids = id.split('_chart_legend_shape_');
            ids[0] = '0';
        }
        else if (id.indexOf('_chart_legend_g_') > -1) {
            ids = id.split('_chart_legend_g_');
            ids[0] = '0';
        }
        else if (id.indexOf('-data-label-') > -1) {
            ids[0] = '0';
            ids[1] = id.split('-data-label-text-')[1];
        }
        else if (id.indexOf('-connector-') > -1) {
            ids[0] = '0';
            ids[1] = id.split('-connector-')[1];
        }
        return new Index(parseInt(ids[0], 10), parseInt(ids[1], 10));
    }

    /**
     * Performs the selection based on the specified index, circular 3D instance, and optional element.
     *
     * @param {Index} index - The index used for selection, including the point information.
     * @param {CircularChart3D} circular3D - The circular 3D instance used for the selection operation.
     * @param {Element | undefined} [element] - The target element for selection.
     * @returns {void}
     * @private
     */
    private performSelection(index: Index, circular3D: CircularChart3D, element?: Element): void {
        if (!isNaN(index.point) && this.currentMode === 'Point' && element && this.getElementByIndex(index).length > 0) {
            this.selection(circular3D, index, this.getElementByIndex(index));
            this.selectionComplete(circular3D, <CircularChart3DSeries>circular3D.series[0]);
            this.blurEffect(circular3D.element.id, circular3D.visibleSeries);
        }
    }

    /**
     * Handles the completion of the selection process in the specified circular 3D chart instance and Circular3DSeries.
     *
     * @param {CircularChart3D} circular3D - The circular 3D chart instance where the selection is completed.
     * @param {CircularChart3DSeries} series - The Circular3DSeries associated with the completed selection.
     * @returns {void}
     * @private
     */
    private selectionComplete(circular3D: CircularChart3D, series: CircularChart3DSeries): void {
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
        const args: CircularChart3DSelectionCompleteEventArgs = {
            name: selectionComplete,
            selectedDataValues: selectedPointValues,
            cancel: false
        };
        circular3D.trigger(selectionComplete, args);
    }

    /**
     * Handles the selection process in the specified circular 3D instance based on the provided index and selected elements.
     *
     * @param {CircularChart3D} circular3D - The circular 3D chart instance where the selection is being performed.
     * @param {Index} index - The index used for selection, including point information.
     * @param {Element[]} selectedElements - The array of elements that have been selected.
     * @returns {void}
     * @private
     */
    private selection(circular3D: CircularChart3D, index: Index, selectedElements: Element[]): void {
        if (!circular3D.isMultiSelect && this.styleId.indexOf('highlight') === -1 &&
            circular3D.selectionMode !== 'None') {
            this.removeMultiSelectElements(circular3D, this.selectedDataIndexes, index);
        }
        const className: string = selectedElements[0] && (selectedElements[0].getAttribute('class') || '');
        if (selectedElements[0] && className.indexOf(this.getSelectionClass(selectedElements[0].id)) > -1) {
            this.removeStyles(selectedElements);
            if (this.styleId.indexOf('highlight') > 0 && (circular3D.highlightMode !== 'None' || circular3D.legendSettings.enableHighlight)) {
                this.addOrRemoveIndex(this.highlightDataIndexes, index);
            } else {
                this.addOrRemoveIndex(this.selectedDataIndexes, index);
            }
        } else {
            this.previousSelectedElement = circular3D.highlightMode !== 'None' ? selectedElements : [];
            if (className.indexOf('selection') < 0) {
                this.applyStyles(selectedElements, index);
            }
            if (this.styleId.indexOf('highlight') > 0 && (circular3D.highlightMode !== 'None' || circular3D.legendSettings.enableHighlight)) {
                this.addOrRemoveIndex(this.highlightDataIndexes, index, true);
            } else {
                this.addOrRemoveIndex(this.selectedDataIndexes, index, true);
            }
        }
    }

    /**
     * Redraws the selection in the specified circular 3D chart instance based on the selected data indexes.
     *
     * @param {CircularChart3D} circular3D - The circular 3D chart  instance where the selection is to be redrawn.
     * @returns {void}
     */
    public redrawSelection(circular3D: CircularChart3D): void {
        let selectedDataIndexes: Indexes[] = <Indexes[]>extend([], this.selectedDataIndexes, null, true);
        const highlightDataIndexes: Indexes[] = <Indexes[]>extend([], this.highlightDataIndexes, null, true);
        if (this.styleId.indexOf('highlight') > 0 && highlightDataIndexes.length > 0) {
            this.removeSelectedElements(circular3D, this.highlightDataIndexes);
            selectedDataIndexes = highlightDataIndexes;
        } else {
            this.removeSelectedElements(circular3D, this.selectedDataIndexes);
        }
        this.blurEffect(circular3D.element.id, circular3D.visibleSeries);
        this.selectDataIndex(selectedDataIndexes, circular3D);
    }

    /**
     * Removes the selected elements from the specified circular 3D chart instance based on the given indexes.
     *
     * @param {CircularChart3D} circular3D - The circular 3D instance from which selected elements will be removed.
     * @param {Index[]} indexes - The indexes representing the selected elements to be removed.
     * @returns {void}
     * @private
     */
    private removeSelectedElements(circular3D: CircularChart3D, indexes: Index[]): void {
        for (const index of indexes) {
            this.removeStyles(this.getElementByIndex(index));
        }
        const points: CircularChart3DPoints[] = circular3D.visibleSeries[0].points;
        for (let i: number = 0; i < points.length; i++) {
            const index: Index = new Index(0, points[i as number].index);
            this.removeStyles(this.getElementByIndex(index).length === 0 ? [document.getElementById(this.control.element.id + '_chart_legend_shape_' + index.point)] : this.getElementByIndex(index));
        }
    }

    /**
     * Handles legend item selection in the specified circular 3D chart based on the target element and event type.
     *
     * @param {CircularChart3D} chart - The circular 3D chart instance where legend item selection is being processed.
     * @param {Element} targetElement - The target element associated with the legend item.
     * @param {string} eventType - The type of event triggering the legend item selection (e.g., 'mouse move').
     * @returns {void}
     */
    public legendSelection(chart: CircularChart3D, targetElement: Element, eventType: string): void {
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
            this.currentMode = this.circular3D.highlightMode;
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
            let seriesStyle: string = this.generateStyle(chart.visibleSeries[index.series as number], index.point);
            let selectedElements: NodeListOf<HTMLElement> = <NodeListOf<HTMLElement>>(document.querySelectorAll('.' + seriesStyle));
            const isBlurEffectNeeded: boolean = true;
            if (selectedElements.length > 0) {
                this.removeSelection(chart, index.series, selectedElements, seriesStyle, isBlurEffectNeeded, index);
            } else {
                for (const element of chart.visibleSeries[0].points) {
                    if (element.index !== index.point && (!chart.isMultiSelect || seriesStyle.indexOf('highlight') > 0)) {
                        seriesStyle = this.generateStyle(chart.visibleSeries[index.series], element.index);
                        selectedElements = document.querySelectorAll('.' + seriesStyle);
                        this.removeSelection(chart, index.series, selectedElements, seriesStyle, isBlurEffectNeeded, index);
                    }
                }
                let seriesElements: Element[] = [];
                seriesElements = this.getElementByIndex(index);
                if (seriesElements.length > 0) {
                    this.checkSelectionElements(seriesElements, seriesStyle, false, index.point);
                    this.selection(chart, index, seriesElements);
                    this.blurEffect(chart.element.id, chart.visibleSeries);
                }
            }
        }
    }

    /**
     * Selects elements based on the specified data indexes in the given circular 3D chart instance.
     *
     * @param {Index[]} indexes - The data indexes used for element selection.
     * @param {CircularChart3D} circular3D - The circular 3D instance where elements are to be selected.
     * @returns {void}
     * @private
     */
    private selectDataIndex(indexes: Index[], circular3D: CircularChart3D): void {
        let element: Element;
        for (const index of indexes) {
            [element] = this.getElementByIndex(index);
            if (element) {
                this.performSelection(index, circular3D, element);
            }
        }
    }

    /**
     * Removes selection styles for elements in a multi-selection process based on the specified data indexes and current index.
     *
     * @param {CircularChart3D} circular3D - The circular 3D chart instance from which selection styles will be removed.
     * @param {Index[]} index - The data indexes representing the elements to remove selection styles from.
     * @param {Index} currentIndex - The current index used as a reference during the multi-selection process.
     * @returns {void}
     * @private
     */
    private removeMultiSelectElements(circular3D: CircularChart3D, index: Index[], currentIndex: Index): void {
        for (let i: number = 0; i < index.length; i++) {
            if (!this.checkEquals(index[i as number], currentIndex)) {
                this.removeStyles(this.getElementByIndex(index[i as number]));
                index.splice(i, 1);
                i--;
            }
        }
    }

    /**
     * Applies the opacity effect to circular 3D chart series elements based on the specified pieId and visible series.
     *
     * @param {string} pieId - The identifier associated with the circular 3D chart series.
     * @param {CircularChart3DSeries[]} visibleSeries - The array of visible series in the circular 3D chart.
     * @returns {void}
     * @private
     */
    private blurEffect(pieId: string, visibleSeries: CircularChart3DSeries[]): void {
        const visibility: boolean = (this.checkVisibility(this.highlightDataIndexes) ||
            this.checkVisibility(this.selectedDataIndexes)); // legend click scenario
        for (const point of visibleSeries[0].points) {
            let pointElements: Element[] = [];
            if (point.visible) {
                pointElements = this.getElementByIndex({ series: 0, point: point.index });
                this.checkSelectionElements(pointElements, this.generateStyle(visibleSeries[0], point.index), visibility,
                                            point.index);
            }
        }
    }

    /**
     * Checks for selection elements based on the specified style class name, visibility, and other parameters.
     *
     * @param {Element[] | Element} element - The element or array of elements to be checked for selection.
     * @param {string} className - The style class name used for identifying selection elements.
     * @param {boolean} visibility - The visibility status of the selection elements.
     * @param {number} [point=0] - The point value associated with the selection elements.
     * @returns {void}
     * @public
     */
    public checkSelectionElements(
        element: Element[] | Element, className: string, visibility: boolean, point: number = 0): void {
        let children: HTMLCollection | Element[] = <Element[]>element;
        if (this.circular3D.selectionMode !== 'None' && (this.circular3D.highlightMode !== 'None' || this.circular3D.legendSettings.enableHighlight)) {
            children = element as Element[];
        }
        let elementClassName: string;
        let legendShape: Element;
        let selectElement: Element | Element[] = element;
        for (let i: number = 0; i < children.length; i++) {
            elementClassName = children[i as number].getAttribute('class') || '';
            if (this.circular3D.selectionMode !== 'None' && (this.circular3D.highlightMode !== 'None' || this.circular3D.legendSettings.enableHighlight)) {
                className = elementClassName.indexOf('selection') > 0 ||
                    elementClassName.indexOf('highlight') > 0 ? elementClassName : className;
            }
            if (elementClassName.indexOf(className) === -1 && visibility) {
                this.addSvgClass(children[i as number], this.unselected);
            } else {
                selectElement = children[i as number];
                if (elementClassName.indexOf(this.unselected) !== -1 && className.indexOf('highlight') > 0) {
                    this.circular3D.highlightAnimation(children[i as number] as HTMLElement, 700, 0.3);
                }
                this.removeSvgClass(children[i as number], this.unselected);
                this.removeSvgClass(<Element>children[i as number].parentNode, this.unselected);
            }
            if (children[i as number].id.indexOf('-data-label-text-') !== -1 || children[i as number].id.indexOf('-connector-') !== -1 || children[i as number].id.indexOf('-data-label-series-0-shape-') !== -1) {
                if (this.highlightDataIndexes && this.highlightDataIndexes[0] && point === this.highlightDataIndexes[0].point) {
                    this.removeSvgClass(children[i as number], this.unselected);
                }
                if (this.selectedDataIndexes) {
                    for (let j: number = 0; j < this.selectedDataIndexes.length; j++) {
                        if (point === this.selectedDataIndexes[j as number].point) {
                            this.removeSvgClass(children[i as number], this.unselected);
                        }
                    }
                }
            }
        }
        if ((this.control as CircularChart3D).circularChartLegend3DModule && (this.control as CircularChart3D).legendSettings.visible) {
            legendShape = getElement(this.control.element.id + '_chart_legend_shape_' + point);
            if (legendShape) {
                if (legendShape.hasAttribute('class')) {
                    this.removeSvgClass(legendShape, legendShape.getAttribute('class'));
                }
                if ((selectElement as Element[]).length > 0) {
                    elementClassName = selectElement[0].getAttribute('class');
                }
                else if (selectElement as Element) {
                    elementClassName = (selectElement as Element).getAttribute('class') || '';
                }
                if (elementClassName.indexOf(className) === -1 && visibility) {
                    this.addSvgClass(legendShape, this.unselected);
                } else {
                    this.removeSvgClass(legendShape, this.unselected);
                    if (elementClassName === '') {
                        this.removeSvgClass(legendShape, className);
                    } else {
                        this.addSvgClass(legendShape, className);
                    }
                }
            }
        }
    }

    /**
     * Applies selection style to the specified elements based on the provided data index.
     *
     * @param {Element[]} elements - The array of elements to which the selection style will be applied.
     * @param {Index} index - The data index used for selection.
     * @returns {void}
     * @private
     */
    private applyStyles(elements: Element[], index: Index): void {
        const circular3DTooltip: CircularChartTooltip3D = (this.control as CircularChart3D).circularChartTooltip3DModule;
        for (const element of elements) {
            if (element) {
                this.removeSvgClass(<Element>element.parentNode, this.unselected);
                this.removeSvgClass(element, this.unselected);
                const opacity: number = circular3DTooltip && (circular3DTooltip.previousPoints.length > 0 &&
                    circular3DTooltip.previousPoints[0].point.index !== index.point) ?
                    circular3DTooltip.svgTooltip.opacity : this.series[index.series].opacity;
                element.setAttribute('opacity', opacity.toString());
                if (element.id.indexOf('-data-label-text-') === -1 && element.id.indexOf('-connector-') === -1 && element.id.indexOf('-data-label-series-0-shape-') === -1) {
                    this.addSvgClass(element, this.getSelectionClass(element.id));
                }
                if (this.getSelectionClass(element.id).indexOf('highlight') > 0) {
                    this.circular3D.stopElementAnimation(element as HTMLElement);
                }
            }
        }
        if ((this.control as CircularChart3D).circularChartLegend3DModule && (this.control as CircularChart3D).legendSettings.visible) {
            const legendShape: Element = document.getElementById(this.control.element.id + '_chart_legend_shape_' + index.point);
            this.removeSvgClass(legendShape, legendShape.getAttribute('class'));
            this.addSvgClass(legendShape, this.getSelectionClass(legendShape.id));
        }
    }

    /**
     * Retrieves the selection style class name based on the specified element ID.
     *
     * @param {string} id - The identifier used to determine the series and point for generating the selection style.
     * @returns {string} - The selection style class name.
     * @private
     */
    private getSelectionClass(id: string): string {
        return this.generateStyle((this.control as CircularChart3D).series[this.indexFinder(id).series], this.indexFinder(id).point);
    }

    /**
     * Handles the removal of selection style class from the selected point in the circular 3D chart.
     *
     * @param {CircularChart3D} chart - The 3D chart instance where the selection needs to be removed.
     * @param {number} series - The index of the series for which the selection is being removed.
     * @param {NodeListOf<HTMLElement>} selectedElements - The HTML elements representing the selected items.
     * @param {string} seriesStyle - The style to be applied to the series after the removal of selection.
     * @param {boolean} isBlurEffectNeeded - A flag indicating whether a blur effect is needed after the removal of selection.
     * @param {Index} index - The index representing the specific data point for which selection is being removed (optional).
     * @returns {void}
     */
    public removeSelection(
        chart: CircularChart3D, series: number, selectedElements: NodeListOf<HTMLElement>,
        seriesStyle: string, isBlurEffectNeeded: boolean, index?: Index): void {
        if (selectedElements.length > 0) {
            const elements: Element[] = [];
            for (let i: number = 0; i < selectedElements.length; i++) {
                elements.push(selectedElements[i as number]);
            }
            this.removeStyles(elements);
            this.addOrRemoveIndex(this.selectedDataIndexes, new Index(series, index.point));
            for (const value of chart.visibleSeries[0].points) {
                seriesStyle = this.generateStyle(chart.visibleSeries[0], value.index);
                if (document.querySelectorAll('.' + seriesStyle).length > 0) {
                    for (const element of elements) {
                        this.checkSelectionElements(element, seriesStyle, true, index.point);
                    }
                    isBlurEffectNeeded = false;
                    break;
                }
            }
            if (isBlurEffectNeeded) {
                this.blurEffect(chart.element.id, chart.visibleSeries);
            }
        }
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
            }
        }
    }

    /**
     * Adds or removes the specified index from the provided array of indexes based on the 'add' parameter.
     *
     * @param {Index[]} indexes - The array of indexes where the specified index will be added or removed.
     * @param {Index} index - The index to be added or removed.
     * @param {boolean} [add=true] - Indicates whether to add or remove the index. Defaults to true (add).
     * @returns {void}
     * @private
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
     * Checks if two indexes are equal in terms of their point and series values.
     *
     * @param {Index} first - The first index to be compared.
     * @param {Index} second - The second index to be compared.
     * @returns {boolean} - Returns true if the indexes are equal; otherwise, returns false.
     * @private
     */
    private checkEquals(first: Index, second: Index): boolean {
        return ((first.point === second.point) && (first.series === second.series));
    }

    /**
     * Handles the mouse move event in the context of the circular 3D chart.
     *
     * @param {PointerEvent | TouchEvent} event - The pointer or touch event triggering the mouse move action.
     * @returns {void}
     * @public
     */
    public mouseMove(event: PointerEvent | TouchEvent): void {
        const circular3D: CircularChart3D = this.circular3D;
        let targetElement: Element = <Element>event.target;
        if (!circular3D.rotateActivate && circular3D.circularChartHighlight3DModule && (circular3D.highlightMode !== 'None' || circular3D.legendSettings.enableHighlight)) {
            if (!isNullOrUndefined(targetElement)) {
                if ((<Element>event.target).id.indexOf('text') > 1 && (<Element>event.target).id.indexOf('legend') > -1) {
                    targetElement = getElement((<Element>event.target).id.replace('text', 'shape'));
                }
                if ((targetElement).hasAttribute('class') && ((targetElement).getAttribute('class').indexOf('highlight') > -1 ||
                targetElement.getAttribute('class').indexOf('selection') > -1)) {
                    return;
                }
                this.calculateSelectedElements(circular3D, event.target as Element, event.type);
                if (this.highlightDataIndexes && (targetElement.id.indexOf('_chart_legend_') === -1 || targetElement.id.indexOf('_legend_element') !== -1) &&
                    this.highlightDataIndexes.length > 0 && targetElement.id.indexOf('-series-') === -1 &&
                    targetElement.id.indexOf('-data-label-') === -1) {
                    this.removeLegendHighlightStyles();
                }
                return;
            }
        }
        if (circular3D.selectionMode === 'None') {
            return;
        }
    }

    /**
     * Removes the highlighted legend and respective points when the legend is not focused.
     *
     * @returns {void}
     * @private
     */
    public removeLegendHighlightStyles(): void {
        this.circular3D.circularChartHighlight3DModule.highlightDataIndexes = [];
        let elementCollection: HTMLCollection;
        for (let i: number = 0; i < this.circular3D.visibleSeries[0].points.length; i++) {
            elementCollection = document.getElementsByClassName(this.generateStyle(this.circular3D.visibleSeries[0], i));
            if (this.selectedDataIndexes.length === 0) {
                elementCollection = document.getElementsByClassName(this.generateStyle(this.circular3D.visibleSeries[0], i));
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
                        if (this.generateStyle(this.circular3D.visibleSeries[0], i).indexOf('highlight') > -1) {
                            this.circular3D.highlightAnimation(element as HTMLElement, 700, 0.3);
                        }
                    }
                }
            } else {
                elementCollection = document.getElementsByClassName(this.generateStyle(this.circular3D.visibleSeries[0], i));
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
     * Gets the module name for circular 3D chart selection.
     *
     * @returns {string} - The module name.
     * @public
     */
    public getModuleName(): string {
        return 'CircularChartSelection3D';
    }

    /**
     * Destroys the `CircularChartSelection3D` module.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        // Destroy method performed here
        this.removeEventListener();
    }
}
