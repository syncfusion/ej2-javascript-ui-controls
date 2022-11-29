import { Gantt } from '../base/gantt';
import {
    createElement, formatUnit, EventHandler, Browser, KeyboardEvents, getElement,
    KeyboardEventArgs
} from '@syncfusion/ej2-base';
import { isNullOrUndefined, closest, addClass, removeClass, getValue, setValue } from '@syncfusion/ej2-base';
import * as cls from '../base/css-constants';
import { ChartScroll } from '../actions/chart-scroll';
import { IGanttData, IWorkTimelineRanges } from '../base/interface';
import { click } from '@syncfusion/ej2-grids';
import { ITaskbarClickEventArgs, RecordDoubleClickEventArgs, IMouseMoveEventArgs, IIndicator } from '../base/interface';
import { TooltipEventArgs } from '@syncfusion/ej2-popups';
import { FocusStrategy } from '@syncfusion/ej2-grids/src/grid/services/focus-strategy';
import { VirtualContentRenderer } from '../renderer/virtual-content-render';
import { CriticalPath } from '../actions/critical-path';

/**
 * module to render gantt chart - project view
 */

export class GanttChart {
    private parent: Gantt;
    public chartElement: HTMLElement;
    public chartTimelineContainer: HTMLElement;
    public chartBodyContainer: HTMLElement;
    public chartBodyContent: HTMLElement;
    public rangeViewContainer: HTMLElement;
    public scrollElement: HTMLElement;
    public scrollObject: ChartScroll;
    public isExpandCollapseFromChart: boolean = false;
    public isExpandAll: boolean = false;
    private focusedElement: HTMLElement;
    public focusedRowIndex: number;
    private isGanttElement: boolean = false;
    public keyboardModule: KeyboardEvents;
    public targetElement: Element;
    public virtualRender: VirtualContentRenderer;
    public isEditableElement:any;
    public tempNextElement:any;
    public nextElementIndex:any;
    public childrenIndex:any;
    constructor(parent: Gantt) {
        this.parent = parent;
        this.chartTimelineContainer = null;
        this.rangeViewContainer =
            createElement('div', { className: cls.rangeContainer });
        this.rangeViewContainer.setAttribute("role", "RangeContainer");        
        this.virtualRender = new VirtualContentRenderer(this.parent);
        this.addEventListener();
    }

    private addEventListener(): void {
        this.parent.on('renderPanels', this.renderChartContainer, this);
        this.parent.on('recordsUpdated', this.renderChartElements, this);
        this.parent.on('dataReady', this.renderInitialContents, this);
        this.parent.on('tree-grid-created', this.renderChartContents, this);
        this.parent.on('destroy', this.destroy, this);
    }

    private renderChartContents(): void {
        this.parent.notify('refreshDayMarkers', {});
        this.wireEvents();
    }
    /**
     * Method to render top level containers in Gantt chart
     *
     * @returns {void} .
     * @private
     */
    public renderChartContainer(): void {
        this.chartElement = createElement('div', { id: this.parent.element.id + 'GanttChart', className: cls.ganttChart });
        this.parent.chartPane.appendChild(this.chartElement);
        this.renderTimelineContainer();
        this.renderBodyContainers();
        // render top level div header and content
        // Get timeline header from timeline class file and append to header div
        // render content div
        // Render scroll able div
        // Render container for all element like, table, weekend and holidays
        // Get rows element from rows renderer class
        // Get label related info label renderer class
        // Get baseline from baseline renderer class
        // Get weekend elements from weekend-holidays renderer class
    }
    /**
     * method to render timeline, holidays, weekends at load time
     *
     * @returns {void} .
     */
    private renderInitialContents(): void {
        this.parent.timelineModule.createTimelineSeries();
    }
    /**
     * @returns {void} .
     * @private
     */
    public renderOverAllocationContainer(): void {
        for (let i: number = 0; i < this.parent.flatData.length; i++) {
            const data: IGanttData = this.parent.flatData[i];
            if (data.childRecords.length > 0) {
                this.parent.dataOperation.updateOverlappingValues(data);
            }
        }
        const rangeContainer: HTMLElement = this.parent.element.querySelector('.' + cls.rangeContainer);
        if (rangeContainer) {
            rangeContainer.innerHTML = '';
        }
        if (this.parent.treeGrid.grid.filterSettings.columns.length === 0) {
            this.renderRangeContainer(this.parent.currentViewData);
        }
    }
    private renderChartElements(): void {
        if (this.parent.isFromOnPropertyChange) {
            this.rangeViewContainer.innerHTML = '';
            this.parent.updateProjectDates(
                this.parent.cloneProjectStartDate, this.parent.cloneProjectEndDate, this.parent.isTimelineRoundOff);
            this.parent.isFromOnPropertyChange = false;
        } else {
            this.parent.chartRowsModule.renderChartRows();
            if (this.parent.predecessorModule && this.parent.taskFields.dependency) {
                this.parent.connectorLineIds = [];
                this.parent.updatedConnectorLineCollection = [];
                this.parent.predecessorModule.createConnectorLinesCollection();
            }
            this.parent.connectorLineModule.renderConnectorLines(this.parent.updatedConnectorLineCollection);
            if (this.parent.enableCriticalPath) {
                let crtiticalModule: CriticalPath = this.parent.criticalPathModule;
                this.parent.criticalPathModule.criticalConnectorLine(crtiticalModule.criticalPathCollection,crtiticalModule.detailPredecessorCollection,this.parent.enableCriticalPath,crtiticalModule.predecessorCollectionTaskIds,)
            }
            if (this.parent.viewType === 'ResourceView' && this.parent.showOverAllocation) {
                this.renderOverAllocationContainer();
            }
        }
        this.updateWidthAndHeight();
        this.parent.notify('selectRowByIndex', {});
    }

    /**
     * @param {IGanttData[]} records .
     * @returns {void} .
     * @private
     */
    public renderRangeContainer(records: IGanttData[]): void {
        const recordLength: number = records.length;
        let count: number; let ganttRecord: IGanttData;
        let rangeCollection: IWorkTimelineRanges[];
        if (this.parent.treeGrid.grid.filterSettings.columns.length === 0) {
            for (count = 0; count < recordLength; count++) {
                ganttRecord = records[count];
                rangeCollection = ganttRecord.ganttProperties.workTimelineRanges;
                if (rangeCollection) {
                    this.renderRange(rangeCollection, ganttRecord);
                }
            }
        }
    }
    private getTopValue(currentRecord: IGanttData): number {
        const updatedRecords: IGanttData[] = this.parent.getExpandedRecords(this.parent.currentViewData);
        const recordIndex: number = updatedRecords.indexOf(currentRecord);
        if (!currentRecord.expanded) {
            return (recordIndex * this.parent.rowHeight);
        }
        return ((recordIndex + 1) * this.parent.rowHeight);
    }
    /*get height for range bar*/
    private getRangeHeight(data: IGanttData): number {
        if (!data.expanded && data.hasChildRecords) {
            return (this.parent.rowHeight - Math.floor((this.parent.rowHeight - this.parent.chartRowsModule.taskBarHeight)));
        }
        return (data.childRecords.length * this.parent.rowHeight) -
            Math.floor((this.parent.rowHeight - this.parent.chartRowsModule.taskBarHeight));
    }
    private renderRange(rangeCollection: IWorkTimelineRanges[], currentRecord: IGanttData): void {
        const topValue: number = this.getTopValue(currentRecord);
        const sameIDElement: Element = this.rangeViewContainer.querySelector('.' + 'rangeContainer' + currentRecord.ganttProperties.rowUniqueID);
        if (sameIDElement) {
            sameIDElement.remove();
        }
        const parentDiv: HTMLElement = createElement('div', {
            className: 'rangeContainer' + currentRecord.ganttProperties.rowUniqueID, styles: `top:${topValue}px; position: absolute;`
        });
        if (currentRecord.level === 0 && !currentRecord.expanded && isNullOrUndefined(currentRecord.parentItem)
            && !this.parent.enableMultiTaskbar) {
            return;
        }
        for (let i: number = 0; i < rangeCollection.length; i++) {
            const height: number = this.getRangeHeight(currentRecord);
            const leftDiv: HTMLElement = createElement('div', {
                className: cls.rangeChildContainer + ' ' + 'e-leftarc', styles: `left:${rangeCollection[i].left}px;
                top: ${Math.floor((this.parent.rowHeight - this.parent.chartRowsModule.taskBarHeight) / 2)}px;
                height: ${height + 1}px; border-right: 0px`
            });
            const rightDiv: HTMLElement = createElement('div', {
                className: cls.rangeChildContainer + ' ' + 'e-rightarc',
                styles: `left:${rangeCollection[i].left + rangeCollection[i].width - 5}px;
                top: ${Math.floor((this.parent.rowHeight - this.parent.chartRowsModule.taskBarHeight) / 2)}px; height: ${height + 1}px;
                border-left: 0px`
            });
            parentDiv.appendChild(leftDiv);
            parentDiv.appendChild(rightDiv);
            this.rangeViewContainer.appendChild(parentDiv);
        }
        this.parent.ganttChartModule.chartBodyContent.appendChild(this.rangeViewContainer);
    }
    /**
     * @returns {void} .
     * @private
     */
    public renderTimelineContainer(): void {
        this.chartTimelineContainer =
            createElement('div', { className: cls.timelineHeaderContainer });
        this.chartTimelineContainer.setAttribute("role", "presentation");    
        this.chartElement.appendChild(this.chartTimelineContainer);
    }

    /**
     * initiate chart container
     *
     * @returns {void} .
     */
    private renderBodyContainers(): void {
        this.chartBodyContainer = createElement('div', { className: cls.chartBodyContainer });
        this.chartElement.appendChild(this.chartBodyContainer);
        this.scrollElement = createElement('div', {
            className: cls.chartScrollElement + ' ' + cls.scrollContent, styles: 'position:relative;'
        });
        this.chartBodyContainer.appendChild(this.scrollElement);
        this.chartBodyContent = createElement('div', { className: cls.chartBodyContent, styles: 'position:relative; overflow:hidden ' });
        if (this.parent.virtualScrollModule && this.parent.enableVirtualization) {
            this.parent.ganttChartModule.virtualRender.renderWrapper();
        } else {
            this.scrollElement.appendChild(this.chartBodyContent);
        }
        
        // this.parent.chartRowsModule.createChartTable();
        this.scrollObject = new ChartScroll(this.parent);
        //this.scrollObject.setWidth(this.chartProperties.width);
        let toolbarHeight: number = 0;
        if (!isNullOrUndefined(this.parent.toolbarModule) && !isNullOrUndefined(this.parent.toolbarModule.element)) {
            toolbarHeight = this.parent.toolbarModule.element.offsetHeight;
        }
        this.scrollObject.
            setHeight(this.parent.ganttHeight - this.chartTimelineContainer.offsetHeight - toolbarHeight);
    }
    /**
     * @returns {void} .
     * @private
     */
    public updateWidthAndHeight(): void {
        //empty row height
        const emptydivHeight: number = 36;
        const emptyHeight: number = this.parent.contentHeight === 0 ? this.parent.flatData.length > 1 ? emptydivHeight : 0 : this.parent.contentHeight;
        let contentElement: HTMLElement = this.parent.element.getElementsByClassName('e-chart-scroll-container e-content')[0] as HTMLElement;
        if (emptyHeight >= contentElement['offsetHeight'] || this.parent.height === 'auto') {
            this.chartBodyContent.style.height = formatUnit(emptyHeight);
        } else {
            let scrollHeight: number =  this.parent.element.getElementsByClassName('e-chart-rows-container')[0]['offsetHeight'];
            if (contentElement['offsetHeight'] >= scrollHeight) {
                this.chartBodyContent.style.height = contentElement['offsetHeight'] - 17 + 'px';
            }
            else {
                this.chartBodyContent.style.height = contentElement['offsetHeight'] + 'px';
            }
        }        //let element: HTMLElement = this.chartTimelineContainer.querySelector('.' + cls.timelineHeaderTableContainer);
        this.chartBodyContent.style.width = formatUnit(this.parent.timelineModule.totalTimelineWidth);
        this.setVirtualHeight();
        this.parent.notify('updateHeight', {});
        this.parent.updateGridLineContainerHeight();
        this.updateLastRowBottomWidth();
    }

    private setVirtualHeight(): void {
        if (this.parent.virtualScrollModule && this.parent.enableVirtualization) {
            const wrapper: HTMLElement = getValue('virtualTrack', this.parent.ganttChartModule.virtualRender);
            wrapper.style.height = this.parent.updatedRecords.length * this.parent.rowHeight + 'px';
        }
    }
    /**
     * Method to update bottom border for chart rows
     *
     * @returns {void} .
     */
    public updateLastRowBottomWidth(): void {
        if (this.parent.currentViewData.length > 0 && this.parent.height !== 'auto') {
            const expandedRecords: IGanttData[] = this.parent.virtualScrollModule && this.parent.enableVirtualization ?
                this.parent.currentViewData : this.parent.getExpandedRecords(this.parent.currentViewData);
            const lastExpandedRow: IGanttData = expandedRecords[expandedRecords.length - 1];
            const lastExpandedRowIndex: number = this.parent.currentViewData.indexOf(lastExpandedRow);
            const lastRow: HTMLElement = this.parent.getRowByIndex(lastExpandedRowIndex);
            const table: Element = this.parent.chartRowsModule.ganttChartTableBody;
            if (table.querySelectorAll('.e-chart-row-cell.e-chart-row-border.e-lastrow')) {
                removeClass(table.querySelectorAll('.e-chart-row-cell.e-chart-row-border.e-lastrow'), 'e-lastrow');
            }
            if (this.chartBodyContent.clientHeight < this.chartBodyContainer.clientHeight) {
                if (lastRow) {
                    addClass(lastRow.querySelectorAll('td'), 'e-lastrow');
                    const emptydivHeight: number = 36;
                    const emptyHeight: number = this.parent.contentHeight === 0 ? this.parent.flatData.length > 1 ? emptydivHeight : 0 : this.parent.contentHeight;
                    let contentElement: HTMLElement = this.parent.element.getElementsByClassName('e-chart-scroll-container e-content')[0] as HTMLElement;
                    if (emptyHeight >= contentElement['offsetHeight']) {
                        this.chartBodyContent.style.height = formatUnit(emptyHeight);
                    } else {
                        let scrollHeight: number =  this.parent.element.getElementsByClassName('e-chart-rows-container')[0]['offsetHeight'];
                        if (contentElement['offsetHeight'] >= scrollHeight) {
                            this.chartBodyContent.style.height = contentElement['offsetHeight'] - 17 + 'px';
                        }
                        else {
                            this.chartBodyContent.style.height = contentElement['offsetHeight'] + 'px';
                        }
                    }
                }
            }
        }
    }

    private removeEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('renderPanels', this.renderChartContainer);
        this.parent.off('recordsUpdated', this.renderChartElements);
        this.parent.off('dataReady', this.renderInitialContents);
        this.parent.off('tree-grid-created', this.renderChartContents);
        this.parent.off('destroy', this.destroy);
    }
    /**
     * Click event handler in chart side
     *
     * @param {PointerEvent} e .
     * @returns {void} .
     */
    private ganttChartMouseDown(e: PointerEvent): void {
        if (e.which !== 3 && this.parent.editSettings.allowTaskbarEditing) {
            this.parent.notify('chartMouseDown', e);
            this.parent.element.tabIndex = 0;
        }
    }

    private ganttChartMouseClick(e: PointerEvent): void {
        if (this.parent.autoFocusTasks) {
                this.scrollToTarget(e); /** Scroll to task */
            }
            this.parent.notify('chartMouseClick', e);
        }

    private ganttChartMouseUp(e: PointerEvent): void {
        if (this.parent.editSettings.allowTaskbarEditing) {
            this.parent.notify('chartMouseUp', e);
        }
    }

    /**
     *
     * @param {PointerEvent} e .
     * @returns {void} .
     */
    private scrollToTarget(e: PointerEvent): void {
        const row: Element = closest(e.target as Element, 'tr');
        if (row && this.parent.element.contains(row) &&
            (this.parent.element.querySelectorAll('.e-chart-rows-container')[0].contains(e.target as Element) ||
                this.parent.element.querySelectorAll('.e-gridcontent')[0].contains(e.target as Element)) &&
            this.parent.currentViewData.length > 0) {
            const rowIndex: number = getValue('rowIndex', closest(e.target as Element, 'tr'));
            const dateObject: Date = this.parent.currentViewData[rowIndex].ganttProperties.startDate;
            if (!isNullOrUndefined(dateObject)) {
                const left: number = this.parent.dataOperation.getTaskLeft(dateObject, false);
                if (this.parent.autoFocusTasks) {
                    this.updateScrollLeft(left);
                }
            }
        }
    }
    /**
     * To focus selected task in chart side
     *
     * @param {number} scrollLeft .
     * @returns {void} .
     * @private
     */
    public updateScrollLeft(scrollLeft: number): void {
        scrollLeft = scrollLeft > 0 ? scrollLeft : 0;
        scrollLeft = this.scrollElement.scrollWidth <= scrollLeft ? this.scrollElement.scrollWidth : scrollLeft;
        if ((this.scrollElement.offsetWidth + this.parent.ganttChartModule.scrollElement.scrollLeft) < scrollLeft
            || (this.scrollElement.scrollLeft > scrollLeft)) {
            this.scrollObject.setScrollLeft(scrollLeft - 50);
        }
      //  this.parent.ganttChartModule.scrollObject.updateLeftPosition();
    }

    /**
     *  Method trigger while perform mouse up action.
     *
     * @param {PointerEvent} e .
     * @returns {void}
     * @private
     */
    private mouseUp(e: PointerEvent): void {
        if (!isNullOrUndefined(this.parent.editModule) && !isNullOrUndefined(this.parent.editModule.taskbarEditModule)) {
            this.parent.editModule.taskbarEditModule.removeFalseLine(false);
        }
        if (this.parent.allowRowDragAndDrop) {
            const ganttDragElemet: HTMLElement = this.parent.element.querySelector('.e-ganttdrag');
            if (ganttDragElemet) {
                ganttDragElemet.remove();
            }
        }
        if (!this.isGanttElement) {
            this.parent.notify('chartMouseUp', e);
        }
        this.isGanttElement = false;
    }
    /**
     *  Method trigger while perform mouse up action.
     *
     * @param {PointerEvent} e .
     * @returns {void} .
     * @private
     */
    private documentMouseUp(e: PointerEvent): void {
        this.isGanttElement = true;
        if (this.parent.allowRowDragAndDrop) {
            const ganttDragElemet: HTMLElement = this.parent.element.querySelector('.e-ganttdrag');
            if (ganttDragElemet) {
                ganttDragElemet.remove();
            }
        }
        if (this.parent.isDestroyed || e.which === 3) {
            return;
        }
        let isTaskbarEdited: boolean = false;
        if (this.parent.editSettings.allowTaskbarEditing &&
            getValue('editModule.taskbarEditModule.isMouseDragged', this.parent) &&
            getValue('editModule.taskbarEditModule.taskBarEditAction', this.parent)) {
            isTaskbarEdited = true;
        }
        this.parent.notify('chartMouseUp', e);
        if (this.parent.showActiveElement) {
            if (this.focusedElement && !(e.target as HTMLElement).classList.contains('e-split-bar')) {
                this.focusedElement.tabIndex = this.focusedElement.tabIndex === 0 ? -1 : this.focusedElement.tabIndex;
                removeClass([this.focusedElement], 'e-active-container');
            }
        }
        if (!isTaskbarEdited) {
            /** Expand/collapse action */
            const target: EventTarget = e.target;
            const isOnTaskbarElement: boolean | Element = (e.target as HTMLElement).classList.contains(cls.taskBarMainContainer)
                || closest(e.target as Element, '.' + cls.taskBarMainContainer);
            if (closest((<HTMLElement>target), '.e-gantt-parent-taskbar') && !this.parent.editSettings.allowEditing) {
                this.chartExpandCollapseRequest(e);
            } else if (!isOnTaskbarElement && this.parent.autoFocusTasks) {
                this.scrollToTarget(e); /** Scroll to task */
            }
        }
        if (this.parent.editModule && this.parent.editModule.taskbarEditModule) {
            this.parent.editModule.taskbarEditModule.removeFalseLine(true);
        }
        if (!isNullOrUndefined(this.parent.onTaskbarClick) && !isTaskbarEdited) {
            const target: EventTarget = e.target;
            const taskbarElement: Element =
                closest((<HTMLElement>target), '.e-gantt-parent-taskbar,.e-gantt-child-taskbar,.e-gantt-milestone');
            if (taskbarElement) {
                this.onTaskbarClick(e, target, taskbarElement);
            }
        }
    }

    /**
     * This event triggered when click on taskbar element
     *
     * @param {PointerEvent | KeyboardEventArgs} e .
     * @param {EventTarget} target .
     * @param {Element} taskbarElement .
     * @returns {void}
     */
    public onTaskbarClick(e: PointerEvent | KeyboardEventArgs, target: EventTarget, taskbarElement: Element): void {
        const chartRow: Node = closest(target as Element, 'tr');
        const rowIndex: number = getValue('rowIndex', chartRow);
        const data: IGanttData = this.getRecordByTarget(e);
        const args: ITaskbarClickEventArgs = {
            data: data,
            taskbarElement: taskbarElement,
            rowIndex: rowIndex,
            target: target as Element
        };
        this.parent.trigger('onTaskbarClick', args);
    }

    /**
     *  Method trigger while perform mouse leave action.
     *
     * @param {PointerEvent} e .
     * @returns {void} .
     * @private
     */
    private ganttChartLeave(e: PointerEvent): void {
        if (this.parent.editSettings.allowTaskbarEditing) {
            this.parent.notify('chartMouseLeave', e);
        }
    }

    /**
     *  Method trigger while perform mouse move action.
     *
     * @param {PointerEvent} e .
     * @returns {void} .
     * @private
     */
    private ganttChartMove(e: PointerEvent): void {
        if (this.parent.editSettings.allowTaskbarEditing) {
            this.parent.notify('chartMouseMove', e);
            if (!isNullOrUndefined(this.parent.taskFields.dependency) && this.parent.connectorLineEditModule) {
                this.parent.connectorLineEditModule.updateConnectorLineEditElement(e);
            }
        }
    }

    /**
     *  Method trigger while perform right click action.
     *
     * @param {PointerEvent} e .
     * @returns {void} .
     * @private
     */
    private contextClick(e: PointerEvent): void {
        if (this.parent.allowFiltering && this.parent.filterModule) {
            this.parent.filterModule.closeFilterOnContextClick(e.srcElement as Element);
        }
    }

    /**
     * Method to trigger while perform mouse move on Gantt.
     *
     * @param {PointerEvent} e .
     * @returns {void} .
     * @private
     */
    public mouseMoveHandler(e: PointerEvent): void {
        if (!isNullOrUndefined(this.parent.onMouseMove) &&
            (this.parent.flatData.length ||
                (<HTMLElement>e.target).classList.contains('e-header-cell-label') ||
                (<HTMLElement>e.target).classList.contains('e-headercell'))) {
            const target: EventTarget = e.target;
            const args: IMouseMoveEventArgs = { originalEvent: e };
            const element: Element = closest((<HTMLElement>target), '.e-chart-row-cell,.e-connector-line-container,' +
                '.e-event-markers,.e-header-cell-label,.e-rowcell,.e-headercell,.e-indicator-span');
            if (element) {
                let rowData: IGanttData;
                const rowElement: Element = closest((<HTMLElement>target), '.e-rowcell,.e-chart-row-cell');
                const columnElement: Element = closest((<HTMLElement>target), '.e-rowcell,.e-headercell');
                if (rowElement) {
                    rowData = this.parent.ganttChartModule.getRecordByTarget(e);
                    args.data = rowData;
                }
                if (columnElement) {
                    const cellIndex: number = getValue('cellIndex', columnElement);
                    args.column = this.parent.treeGrid.columns[cellIndex];
                }
                if (closest((<HTMLElement>target), '.e-indicator-span')) {
                    let index: number = 0;
                    const indicators: IIndicator[] = rowData.ganttProperties.indicators;
                    if (indicators.length > 1) {
                        for (index = 0; index < indicators.length; index++) {
                            if (indicators[index].name === ((<HTMLElement>element).innerText).trim()) {
                                break;
                            }
                        }
                    }
                    args.indicator = indicators[index];
                }
                if (closest((<HTMLElement>target), '.e-connector-line-container')) {
                    const obj: TooltipEventArgs = {} as TooltipEventArgs;
                    obj.target = element as HTMLElement;
                    args.predecessor = this.parent.tooltipModule.getPredecessorTooltipData(obj);
                }
                if (closest((<HTMLElement>target), '.e-event-markers')) {
                    const obj: TooltipEventArgs = {} as TooltipEventArgs;
                    obj.target = element as HTMLElement;
                    args.eventMarkers = this.parent.tooltipModule.getMarkerTooltipData(obj);
                }
                if ((<HTMLElement>target).classList.contains('e-header-cell-label')) {
                    args.date = new Date((<HTMLElement>target).dataset.content);
                }
            }
            this.parent.trigger('onMouseMove', args);
        }
    }

    /**
     * Double click handler for chart
     *
     * @param {PointerEvent} e .
     * @returns {void} .
     */
    private doubleClickHandler(e: PointerEvent): void {
        this.parent.notify('chartDblClick', e);
        const target: EventTarget = e.target;
        const row: Element = closest(target as Element, 'tr');
        const rowIndex: number = getValue('rowIndex', row);
        const rowData: IGanttData = this.parent.ganttChartModule.getRecordByTarget(e);
        const args: RecordDoubleClickEventArgs = {
            row: row,
            rowData: rowData,
            rowIndex: rowIndex,
            target: target as Element
        };
        this.recordDoubleClick(args);
    }

    /**
     * To trigger record double click event.
     *
     * @param {RecordDoubleClickEventArgs} args .
     * @returns {void} .
     * @private
     */
    public recordDoubleClick(args: RecordDoubleClickEventArgs): void {
        this.parent.trigger('recordDoubleClick', args);
    }

    /**
     * @param {PointerEvent | KeyboardEventArgs} e .
     * @returns {IGanttData} .
     * @private
     */
    public getRecordByTarget(e: PointerEvent | KeyboardEventArgs): IGanttData {
        let ganttData: IGanttData;
        let row: Element = closest(e.target as Element, 'div.' + cls.taskBarMainContainer);
        if (!isNullOrUndefined(row)) {
            const id: string = row.getAttribute('rowUniqueId');
            ganttData = this.parent.getRecordByID(id);
        } else {
            row = closest(e.target as Element, 'tr');
            if (row) {
                const rowIndex: number = getValue('rowIndex', closest(e.target as Element, 'tr'));
                ganttData = this.parent.currentViewData[rowIndex];
            }
        }
        return ganttData;
    }

    /**
     * To get gantt chart row elements
     *
     * @returns {NodeListOf<Element>} .
     * @private
     */
    public getChartRows(): NodeListOf<Element> {
        if(document.getElementById(this.parent.element.id + 'GanttTaskTableBody') != null){
            return document.getElementById(this.parent.element.id + 'GanttTaskTableBody').querySelectorAll('.e-chart-row');
            } else {
                return null;
            }
    }

    /**
     * Expand Collapse operations from gantt chart side
     *
     * @param {PointerEvent} e .
     * @returns {void} .
     * @private
     */
    private chartExpandCollapseRequest(e: PointerEvent): void {
        if (this.parent.enableMultiTaskbar) {
            return;
        }
        const target: EventTarget = e.target;
        const parentElement: Element = closest((<HTMLElement>target), '.e-gantt-parent-taskbar');
        const record: IGanttData = this.getRecordByTarget(e);
        const chartRow: Node = closest(target as Element, 'tr');
        const rowIndex: number = getValue('rowIndex', chartRow);
        const gridRow: Node = this.parent.treeGrid.getRows()[rowIndex];
        const args: object = { data: record, gridRow: gridRow, chartRow: chartRow, cancel: false };
        this.isExpandCollapseFromChart = true;
        if (parentElement.classList.contains('e-row-expand')) {
            this.collapseGanttRow(args);
        } else if (parentElement.classList.contains('e-row-collapse')) {
            this.expandGanttRow(args);
        }
    }
    /**
     * @returns {void} .
     * @private
     */
    public reRenderConnectorLines(): void {
        this.parent.connectorLineModule.dependencyViewContainer.innerHTML = '';
        this.parent.connectorLineIds = [];
        this.parent.updatedConnectorLineCollection = [];
        this.parent.predecessorModule.createConnectorLinesCollection();
        this.parent.connectorLineModule.renderConnectorLines(this.parent.updatedConnectorLineCollection);
        if (this.parent.enableCriticalPath && this.parent.criticalPathModule) {
            let criticalModule: CriticalPath = this.parent.criticalPathModule;
            criticalModule.criticalConnectorLine(criticalModule.criticalPathCollection,criticalModule.detailPredecessorCollection,true,
                                                 criticalModule.predecessorCollectionTaskIds);
        }
    }

    /**
     * To collapse gantt rows
     *
     * @param {object} args .
     * @param {boolean} isCancel .
     * @returns {void} .
     * @private
     */
    public collapseGanttRow(args: object, isCancel?: boolean): void {
        if (isCancel) {
            this.collapsedGanttRow(args);
        } else {
            this.parent.trigger('collapsing', args, (arg: object) => {
                if (this.isExpandCollapseFromChart && !getValue('cancel', arg)) {
                    this.collapsedGanttRow(arg);
                }
                this.isExpandCollapseFromChart = false;
            });
        }
    }

    /**
     * @returns {void} .
     * @param {object} args .
     * @private
     */
    public collapsedGanttRow(args: object): void {
        if ((isNullOrUndefined(args['gridRow']) && this.parent.enableVirtualization) || isNullOrUndefined(args['chartRow'])) {
            return;
        }
        const record: IGanttData = getValue('data', args);
        if (this.isExpandCollapseFromChart) {
            this.expandCollapseChartRows('collapse', getValue('chartRow', args), record, null);
            this.parent.treeGrid.collapseRow(getValue('gridRow', args), record);
            this.isExpandCollapseFromChart = false;
        } else {
            this.expandCollapseChartRows('collapse', getValue('chartRow', args), record, null);
        }
        // To render the child record on parent row after collapsing
        if (this.parent.viewType === 'ResourceView') {
            this.renderMultiTaskbar(record);
        }
        if (!this.parent.enableVirtualization) {
            this.parent.updateContentHeight();
        }
        this.updateWidthAndHeight();
        this.reRenderConnectorLines();
        getValue('chartRow', args).setAttribute('aria-expanded', 'false');
        this.parent.trigger('collapsed', args);
    }

    /**
     * To expand gantt rows
     *
     * @returns {void} .
     * @param {object} args .
     * @param {boolean} isCancel .
     * @private
     */
    public expandGanttRow(args: object, isCancel?: boolean): void {
        if (isCancel) {
            this.expandedGanttRow(args);
        } else {
            this.parent.trigger('expanding', args, (arg: object) => {
                if (this.isExpandCollapseFromChart && !getValue('cancel', arg)) {
                    this.expandedGanttRow(arg);
                }
                this.isExpandCollapseFromChart = false;
            });
        }
    }

    /**
     * @returns {void} .
     * @param {object} args .
     * @private
     */
    public expandedGanttRow(args: object): void {
        if ((isNullOrUndefined(args['gridRow']) && this.parent.enableVirtualization) || isNullOrUndefined(args['chartRow'])) {
            return;
        }
        const record: IGanttData = getValue('data', args);
        if (this.isExpandCollapseFromChart) {
            this.expandCollapseChartRows('expand', getValue('chartRow', args), record, null);
            this.parent.treeGrid.expandRow(getValue('gridRow', args), record);
            this.isExpandCollapseFromChart = false;
        } else {
            if (!this.parent.isExpandCollapseLevelMethod) {
                this.expandCollapseChartRows('expand', getValue('chartRow', args), record, null);
            }
            this.parent.isExpandCollapseLevelMethod = false;
        }
        // To render the child record on parent row after expanding.
        if (this.parent.viewType === 'ResourceView') {
            this.renderMultiTaskbar(record);
        }
        if (!this.parent.enableVirtualization) {
            this.parent.updateContentHeight();
        }
        this.updateWidthAndHeight();
        this.reRenderConnectorLines();
        getValue('chartRow', args).setAttribute('aria-expanded', 'true');
        this.parent.trigger('expanded', args);
    }
    private renderMultiTaskbar(record: IGanttData): void {
        if (this.parent.enableMultiTaskbar) {
            this.parent.chartRowsModule.refreshRecords([record], true);
        } else if (this.parent.showOverAllocation) {
            this.parent.ganttChartModule.renderRangeContainer(this.parent.currentViewData);
        }
    }

    /**
     * On expand collapse operation row properties will be updated here.
     *
     * @param {string} action .
     * @param {Node} rowElement .
     * @param {IGanttData} record .
     * @param {boolean} isChild .
     * @returns {void} .
     * @private
     */
    private expandCollapseChartRows(action: string, rowElement: Node, record: IGanttData, isChild: boolean): void {
        let displayType: string;
        if (action === 'expand') {
            displayType = 'table-row';
            if (!isChild) {
                record.expanded = true;
            }
            const targetElement: NodeListOf<Element> = (rowElement as HTMLElement).querySelectorAll('.e-row-collapse');
            for (let t: number = 0; t < targetElement.length; t++) {
                addClass([targetElement[t]], 'e-row-expand');
                removeClass([targetElement[t]], 'e-row-collapse');
            }
        } else if (action === 'collapse') {
            displayType = 'none';
            if (!isChild) {
                record.expanded = false;
            }
            const targetElement: NodeListOf<Element> = (rowElement as HTMLElement).querySelectorAll('.e-row-expand');
            for (let t: number = 0; t < targetElement.length; t++) {
                addClass([targetElement[t]], 'e-row-collapse');
                removeClass([targetElement[t]], 'e-row-expand');
            }
        }
        const childRecords: IGanttData[] = record.childRecords;
        const chartRows: NodeListOf<Element> = this.getChartRows();
        const rows: HTMLElement[] = [];
        for (let i: number = 0; i < chartRows.length; i++) {
            if ((<HTMLElement>chartRows[i]).classList.contains('gridrowtaskId'
                + record.ganttProperties.rowUniqueID + 'level' + (record.level + 1))) {
                rows.push(<HTMLElement>chartRows[i]);
            }
        }
        for (let i: number = 0; i < rows.length; i++) {
            rows[i].style.display = displayType;
            if ((childRecords[i].childRecords && childRecords[i].childRecords.length)
                && (action === 'collapse' || childRecords[i].expanded || this.isExpandAll)) {
                this.expandCollapseChartRows(action, rows[i], childRecords[i], true);
            }
        }
    }

    /**
     * Public method to expand or collapse all the rows of Gantt
     *
     * @returns {void}
     * @param {string} action .
     * @private
     */
    public expandCollapseAll(action: string): void {
        if (action === 'expand') {
            this.isExpandAll = true;
            this.parent.treeGrid.expandAll();
        } else {
            this.parent.treeGrid.collapseAll();
        }
        this.isExpandAll = false;
    }

    /**
     * Public method to expand particular level of rows.
     *
     * @returns {void} .
     * @param {number} level .
     * @private
     */
    public expandAtLevel(level: number): void {
        this.parent.treeGrid.expandAtLevel(level);
    }

    /**
     * Public method to collapse particular level of rows.
     *
     * @returns {void} .
     * @param {number} level .
     * @private
     */
    public collapseAtLevel(level: number): void {
        if (this.parent.enableVirtualization) {
            this.parent.isExpandCollapseLevelMethod = true;
        }
        this.parent.treeGrid.collapseAtLevel(level);
    }

    /**
     * Event Binding for gantt chart click
     *
     * @returns {void} .
     */
    private wireEvents(): void {
        const isIE11Pointer: Boolean = Browser.isPointer; // eslint-disable-line
        const mouseDown: string = Browser.touchStartEvent;
        const mouseUp: string = Browser.touchEndEvent;
        const mouseMove: string = Browser.touchMoveEvent;
        const cancel: string = isIE11Pointer ? 'pointerleave' : 'mouseleave';
        EventHandler.add(this.parent.chartPane, mouseDown, this.ganttChartMouseDown, this);
        EventHandler.add(this.parent.chartPane, cancel, this.ganttChartLeave, this);
        EventHandler.add(this.parent.chartPane, mouseMove, this.ganttChartMove, this);
        if (this.parent.isAdaptive) {
            EventHandler.add(this.parent.chartPane, click, this.ganttChartMouseClick, this);
            EventHandler.add(this.parent.chartPane, mouseUp, this.ganttChartMouseUp, this);
        }
        if (!this.parent.isAdaptive) {
            EventHandler.add(this.parent.element, mouseUp, this.documentMouseUp, this);
            EventHandler.add(document, mouseUp, this.mouseUp, this);
        }
        EventHandler.add(this.parent.element, 'mousemove', this.mouseMoveHandler, this);
        EventHandler.add(document.body, 'contextmenu', this.contextClick, this);
        EventHandler.add(document, 'mouseup', this.contextClick, this);
        EventHandler.add(this.parent.chartRowsModule.ganttChartTableBody, 'dblclick', this.doubleClickHandler, this);
    }

    private unWireEvents(): void {
        const isIE11Pointer: Boolean = Browser.isPointer; // eslint-disable-line
        const mouseDown: string = Browser.touchStartEvent;
        const mouseUp: string = Browser.touchEndEvent;
        const mouseMove: string = Browser.touchMoveEvent;
        const cancel: string = isIE11Pointer ? 'pointerleave' : 'mouseleave';
        EventHandler.remove(this.parent.chartRowsModule.ganttChartTableBody, mouseDown, this.ganttChartMouseDown);
        EventHandler.remove(this.parent.chartPane, cancel, this.ganttChartLeave);
        EventHandler.remove(this.parent.chartPane, mouseMove, this.ganttChartMove);
        if (this.parent.isAdaptive) {
            EventHandler.remove(this.parent.chartPane, click, this.ganttChartMouseClick);
            EventHandler.remove(this.parent.chartPane, mouseUp, this.ganttChartMouseUp);
        }
        if (!this.parent.isAdaptive) {
            EventHandler.remove(this.parent.element, mouseUp, this.documentMouseUp);
            EventHandler.remove(document, mouseUp, this.mouseUp);
        }
        EventHandler.remove(this.parent.element, 'mousemove', this.mouseMoveHandler);
        EventHandler.remove(document.body, 'contextmenu', this.contextClick);
        EventHandler.remove(document, 'mouseup', this.contextClick);
        EventHandler.remove(this.parent.chartRowsModule.ganttChartTableBody, 'dblclick', this.doubleClickHandler);
    }

    /**
     * To get record by taskbar element.
     *
     * @param {Element} target .
     * @returns {IGanttData} .
     * @private
     */
    public getRecordByTaskBar(target: Element): IGanttData {
        const item: IGanttData = this.parent.currentViewData[this.getIndexByTaskBar(target)];
        return item;
    }
    /**
     * Trigger Tab & Shift + Tab keypress to highlight active element.
     *
     * @param {KeyboardEventArgs} e .
     * @returns {void} .
     * @private
     */
    public onTabAction(e: KeyboardEventArgs): void {
        this.parent.treeGrid.grid.enableHeaderFocus = this.parent.enableHeaderFocus;
        const isInEditedState: boolean = this.parent.editModule && this.parent.editModule.cellEditModule &&
            this.parent.editModule.cellEditModule.isCellEdit;
        if (!this.parent.showActiveElement && !isInEditedState) {
            return;
        }
        const $target: Element = isInEditedState ? (e.target as Element).closest('.e-rowcell') : e.target as Element;
        if ($target.closest('.e-rowcell') || $target.closest('.e-chart-row')) {
            this.parent.focusModule.setActiveElement($target as HTMLElement);
        }
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        this.focusedRowIndex = $target.closest('.e-rowcell') ? ($target.parentElement as any).rowIndex :
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            $target.closest('.e-chart-row') ? ($target.closest('.e-chart-row') as any).rowIndex : -1;
        const isTab: boolean = (e.action === 'tab') ? true : false;
        const nextElement: Element | string = this.getNextElement($target, isTab, isInEditedState);
        this.tempNextElement=nextElement;
        if(!isNullOrUndefined(nextElement['cellIndex'])){
            if(this.parent.allowRowDragAndDrop){
            this.childrenIndex=nextElement['cellIndex'];
            this.nextElementIndex=nextElement['cellIndex']-1;
        }
        else{
            this.childrenIndex=nextElement['cellIndex'];
            this.nextElementIndex=nextElement['cellIndex'];
        }
        if(!this.parent.ganttColumns[this.nextElementIndex]['allowEditing'] && this.parent.ganttColumns[this.nextElementIndex]['field']!==this.parent.taskFields.id){
            this.isEditableElement=true;
        }
        else{
            this.isEditableElement=false;
        }
    }
        if (nextElement === 'noNextRow') {
            this.manageFocus($target as HTMLElement, 'remove', true);
            return;
        }
        if (typeof nextElement !== 'string') {
            if ($target.classList.contains('e-rowcell') || $target.closest('.e-chart-row-cell') ||
                $target.classList.contains('e-headercell') || $target.closest('.e-segmented-taskbar')) {
                e.preventDefault();
            }
            if(isTab && $target.classList.contains('e-rowdragdrop')){
                this.parent.treeGrid.grid.notify('key-pressed', e);
                return;
            }
            if ($target.classList.contains('e-rowcell') && (nextElement && nextElement.classList.contains('e-rowcell')) ||
                $target.classList.contains('e-headercell')){     // eslint-disable-line                                                                                                                                                                                                                                    
                if (isTab) {
                    if (this.parent.editSettings.allowNextRowEdit) {
                        const rowData: IGanttData = this.parent.currentViewData[this.focusedRowIndex];
                        const columnName: string = this.parent.ganttColumns[nextElement.getAttribute('data-colindex')].field;
                        if (rowData.hasChildRecords) {
                            if (columnName === this.parent.taskFields.endDate || columnName ===
                                     this.parent.taskFields.duration || columnName === this.parent.taskFields.dependency ||
                                     columnName === this.parent.taskFields.progress || columnName === this.parent.taskFields.work ||
                                     columnName === 'taskType') {
                                this.parent.treeGrid.grid.endEdit();
                                this.parent.treeGrid.grid.notify('key-pressed', e);
                            } else if (columnName === this.parent.taskFields.name || columnName === this.parent.taskFields.startDate) {
                                this.parent.treeGrid.grid.notify('key-pressed', e);
                            } else {
                                this.parent.treeGrid.grid.notify('key-pressed', e);
                                if (isInEditedState) {
                                    this.parent.treeGrid.editCell(this.focusedRowIndex,columnName);   // eslint-disable-line
                                }
                            }
                        } else {
                            this.parent.treeGrid.grid.notify('key-pressed', e);
                        }
                    } else {
                        this.parent.treeGrid.grid.notify('key-pressed', e);
                    }
                } else {
                    this.parent.treeGrid.grid.notify('key-pressed', e);
                }
            }
            if (!(this.parent.editModule && this.parent.editModule.cellEditModule 
                && !isNullOrUndefined(this.parent.editModule.cellEditModule.editedColumn))) {
                if (nextElement) {
                    if ($target.classList.contains('e-rowcell')) {
                        this.manageFocus($target as HTMLElement, 'remove', false);
                    } else {
                        this.manageFocus($target as HTMLElement, 'remove', true);
                    }
                    if ((nextElement.classList.contains('e-rowcell') && $target.nextElementSibling) || $target.classList.contains('e-right-label-container')) {
                        if (!$target.classList.contains('e-rowcell')) {
                            this.parent.treeGrid.grid.notify('key-pressed', e);
                            const fmodule: FocusStrategy = getValue('focusModule', this.parent.treeGrid.grid);
                            fmodule.currentInfo.element = nextElement as HTMLElement;
                            fmodule.currentInfo.elementToFocus = nextElement as HTMLElement;
                            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                            fmodule.content.matrix.current = [(nextElement.parentElement as any).rowIndex, (nextElement as any).cellIndex];
                        }
                        this.manageFocus(nextElement as HTMLElement, 'add', false);
                    } else {
                        this.manageFocus(nextElement as HTMLElement, 'add', true);
                    }
                    this.parent.focusModule.setActiveElement(nextElement as HTMLElement);
                }
            }
        }
    }
    /**
     * Get next/previous sibling element.
     *
     * @param {Element} $target .
     * @param {boolean} isTab .
     * @param {boolean} isInEditedState .
     * @returns {Element | string} .
     */
    private getNextElement($target: Element, isTab: boolean, isInEditedState: boolean): Element | string {
        let nextElement: Element = isTab ? $target.nextElementSibling : $target.previousElementSibling;
        while (nextElement && nextElement.parentElement.classList.contains('e-row')) {
            if (!nextElement.matches('.e-hide') && !nextElement.matches('.e-rowdragdrop')) {
                return nextElement;
            }
            nextElement = isTab ? nextElement.nextElementSibling : nextElement.previousElementSibling;
        }
        if (!isNullOrUndefined(nextElement) && (nextElement.classList.contains('e-taskbar-main-container')
            || nextElement.classList.contains('e-right-connectorpoint-outer-div'))) {
            const record: IGanttData = this.parent.currentViewData[this.focusedRowIndex];
            if (!isNullOrUndefined(record.ganttProperties.segments) && record.ganttProperties.segments.length > 0) {
                nextElement = nextElement.classList.contains('e-right-connectorpoint-outer-div')
                    ? nextElement.parentElement.nextElementSibling
                    : nextElement.getElementsByClassName('e-gantt-child-taskbar-inner-div')[0];
            }
        }
        if (this.validateNextElement(nextElement)) {
            return nextElement;
        } else {
            let rowIndex: number = -1;
            let rowElement: Element = null;
            let childElement: Element | string;
            if ($target.classList.contains('e-rowcell') && isInEditedState && this.parent.editSettings.allowNextRowEdit) {
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                rowIndex = ($target.parentElement as any).rowIndex;
                rowElement = this.getNextRowElement(rowIndex, isTab, true);
                childElement = this.getChildElement(rowElement, isTab);
                return childElement;
            } else if ($target.classList.contains('e-rowcell')) {
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                rowIndex = ($target.parentElement as any).rowIndex;
                if (isTab) {
                    rowElement = this.parent.getRowByIndex(rowIndex);
                    if (this.validateNextElement(rowElement, 'e-left-label-container')) {
                        return rowElement.getElementsByClassName('e-left-label-container')[0];
                    } else if (this.validateNextElement(rowElement, 'e-taskbar-main-container')) {
                        return rowElement.getElementsByClassName('e-taskbar-main-container')[0];
                    } else if (this.validateNextElement(rowElement, 'e-right-label-container')) {
                        return rowElement.getElementsByClassName('e-right-label-container')[0];
                    }
                } else {
                    rowElement = this.getNextRowElement(rowIndex, isTab, false);
                    if (this.validateNextElement(rowElement, 'e-right-label-container')) {
                        return rowElement.getElementsByClassName('e-right-label-container')[0];
                    } else if (this.validateNextElement(rowElement, 'e-taskbar-main-container')) {
                        return rowElement.getElementsByClassName('e-taskbar-main-container')[0];
                    } else if (this.validateNextElement(rowElement, 'e-left-label-container')) {
                        return rowElement.getElementsByClassName('e-left-label-container')[0];
                    }
                }
            } else if ($target.parentElement.classList.contains('e-chart-row-cell') ||
                $target.parentElement.parentElement.classList.contains('e-chart-row-cell')) {
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                rowIndex = (closest($target, '.e-chart-row') as any).rowIndex;
                if (isTab) {
                    rowElement = this.getNextRowElement(rowIndex, isTab, true);
                } else {
                    rowElement = this.parent.treeGrid.grid.getRowByIndex(rowIndex);
                }
                const childElement : Element | string = this.getChildElement(rowElement, isTab);
                return childElement;
            }
        }
        return null;
    }
    /**
     * Get next/previous row element.
     *
     * @param {number} rowIndex .
     * @param {boolean} isTab .
     * @param {boolean} isChartRow .
     * @returns {Element} .
     */
    private getNextRowElement(rowIndex: number, isTab: boolean, isChartRow: boolean): Element {
        const expandedRecords: IGanttData[] = this.parent.getExpandedRecords(this.parent.currentViewData);
        const currentItem: IGanttData = this.parent.currentViewData[rowIndex];
        const expandedRecordIndex: number = expandedRecords.indexOf(currentItem);
        const nextRecord: IGanttData = isTab ? expandedRecords[expandedRecordIndex + 1] : expandedRecords[expandedRecordIndex - 1];
        const nextRowIndex: number = this.parent.currentViewData.indexOf(nextRecord);
        if (nextRecord) {
            return isChartRow ? this.parent.treeGrid.grid.getRowByIndex(nextRowIndex) : this.parent.getRowByIndex(nextRowIndex);
        } else {
            return null;
        }
    }
    /**
     * Validate next/previous sibling element haschilds.
     *
     * @param {Element} $target .
     * @param {string} className .
     * @returns {boolean} .
     */
    private validateNextElement($target: Element, className?: string): boolean {
        if ($target && $target.classList.contains('e-rowcell')) {
            return true;
        }
        if ($target && className) {
            const elementByClass: Element = $target.getElementsByClassName(className)[0];
            return (elementByClass && elementByClass.hasChildNodes()) ? true : false;
        } else if ($target) {
            return (!isNullOrUndefined($target) && $target.hasChildNodes()) ? true : false;
        }
        return false;
    }
    /**
     * Getting child element based on row element.
     *
     * @param {Element} rowElement .
     * @param {boolean} isTab .
     * @returns {Element | string} .
     */
    private getChildElement(rowElement: Element, isTab?: boolean): Element | string {
        let childElement: Element;
        if (rowElement) {
            childElement = isTab ? rowElement.children[0] : rowElement.children[rowElement.children.length - 1];
            while (childElement) {
                if (!childElement.matches('.e-hide') && !childElement.matches('.e-rowdragdrop')) {
                    return childElement;
                }
                childElement = isTab ? childElement.nextElementSibling : childElement.previousElementSibling;
            }
        } else {
            return 'noNextRow';
        }
        return childElement;
    }
    /**
     * Add/Remove active element.
     *
     * @private
     * @param {HTMLElement} element .
     * @param {string} focus .
     * @param {boolean} isChartElement .
     * @returns {void} .
     */
    public manageFocus(element: HTMLElement, focus: string, isChartElement?: boolean): void {
        if (isChartElement) {
            let childElement: Element = null;
            if (element.classList.contains('e-left-label-container') ||
                element.classList.contains('e-right-label-container')) {
                childElement = element.getElementsByTagName('span')[0];
            } else if (element.classList.contains('e-taskbar-main-container')
                || element.classList.contains('e-gantt-child-taskbar-inner-div')) {
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                const rowIndex: number = (closest(element, '.e-chart-row') as any).rowIndex;
                const data: IGanttData = this.parent.currentViewData[rowIndex];
                const className: string = data.hasChildRecords ? data.ganttProperties.isAutoSchedule ? 'e-gantt-parent-taskbar' :
                    'e-manualparent-main-container' :
                    data.ganttProperties.isMilestone ? 'e-gantt-milestone' : !isNullOrUndefined(data.ganttProperties.segments)
                        && data.ganttProperties.segments.length > 0 ? 'e-segmented-taskbar' : 'e-gantt-child-taskbar';
                childElement = element.getElementsByClassName(className)[0];
                if (isNullOrUndefined(childElement)) {
                    childElement = element;
                }
            }
            if (element.classList.contains('e-right-label-temp-container') || element.classList.contains('e-left-label-temp-container') || element.classList.contains('e-indicator-span')) {
                if (focus === 'add') {
                    element.setAttribute('tabIndex', '0');
                    addClass([element], 'e-active-container');
                    element.focus();
                } else {
                    removeClass([element], 'e-active-container');
                    element.setAttribute('tabIndex', '-1');
                    element.blur();
                }
            }
            if (focus === 'add' && !isNullOrUndefined(childElement)) {
                element.setAttribute('tabIndex', '0');
                addClass([childElement], 'e-active-container');
                element.focus();
                this.focusedElement = childElement as HTMLElement;
            } else if (!isNullOrUndefined(childElement)) {
                removeClass([childElement], 'e-active-container');
                element.setAttribute('tabIndex', '-1');
                element.blur();
            }
        } else {
            if (focus === 'add') {
                element.setAttribute('tabIndex', '0');
                addClass([element], ['e-focused', 'e-focus']);
                element.focus();
            } else {
                element.setAttribute('tabIndex', '-1');
                removeClass([element], ['e-focused', 'e-focus']);
                element.blur();
            }
        }
    }
    /**
     * To get index by taskbar element.
     *
     * @param {Element} target .
     * @returns {number} .
     * @private
     */
    public getIndexByTaskBar(target: Element): number {
        let row: Element;
        let recordIndex: number;
        if (!target.classList.contains(cls.taskBarMainContainer)) {
            row = closest(target, 'div.' + cls.taskBarMainContainer);
        } else {
            row = target;
        }
        if (isNullOrUndefined(row)) {
            row = closest(target, 'tr.' + cls.chartRow);
            recordIndex = [].slice.call(this.parent.chartRowsModule.ganttChartTableBody.childNodes).indexOf(row);
        } else {
            const id: string = row.getAttribute('rowUniqueId');
            const record: IGanttData = this.parent.getRecordByID(id);
            recordIndex = this.parent.currentViewData.indexOf(record);
        }
        return recordIndex;
    }

    private destroy(): void {
        this.removeEventListener();
        this.unWireEvents();
        this.scrollObject.destroy();
        this.scrollObject = null;
    }
}
