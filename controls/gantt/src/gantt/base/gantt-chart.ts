import { Gantt } from '../base/gantt';
import { createElement, formatUnit, EventHandler, Browser, KeyboardEvents } from '@syncfusion/ej2-base';
import { isNullOrUndefined, closest, addClass, removeClass, getValue } from '@syncfusion/ej2-base';
import * as cls from '../base/css-constants';
import { ChartScroll } from '../actions/chart-scroll';
import { IGanttData } from '../base/interface';

/**
 * module to render gantt chart - project view
 */

export class GanttChart {
    private parent: Gantt;
    public chartElement: HTMLElement;
    public chartTimelineContainer: HTMLElement;
    public chartBodyContainer: HTMLElement;
    public chartBodyContent: HTMLElement;
    public scrollElement: HTMLElement;
    public scrollObject: ChartScroll;
    public isExpandCollapseFromChart: boolean = false;
    public isExpandAll: boolean = false;
    public keyboardModule: KeyboardEvents;
    constructor(parent: Gantt) {
        this.parent = parent;
        this.chartTimelineContainer = null;
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
     */
    private renderInitialContents(): void {
        this.parent.timelineModule.createTimelineSeries();
    }
    private renderChartElements(): void {
        this.parent.chartRowsModule.renderChartRows();
        this.parent.connectorLineModule.renderConnectorLines(this.parent.updatedConnectorLineCollection);
        this.updateWidthAndHeight();
        this.parent.notify('selectRowByIndex', {});
    }
    /**
     * @private
     */
    public renderTimelineContainer(): void {
        this.chartTimelineContainer =
            createElement('div', { className: cls.timelineHeaderContainer });
        this.chartElement.appendChild(this.chartTimelineContainer);
    }

    /**
     * initiate chart container
     */
    private renderBodyContainers(): void {
        this.chartBodyContainer = createElement('div', { className: cls.chartBodyContainer });
        this.chartElement.appendChild(this.chartBodyContainer);
        this.scrollElement = createElement('div', {
            className: cls.chartScrollElement + ' ' + cls.scrollContent, styles: 'position:relative;'
        });
        this.chartBodyContainer.appendChild(this.scrollElement);
        this.chartBodyContent = createElement('div', { className: cls.chartBodyContent });
        this.scrollElement.appendChild(this.chartBodyContent);
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

    private updateWidthAndHeight(): void {
        this.chartBodyContent.style.height = formatUnit(this.parent.contentHeight);
        //let element: HTMLElement = this.chartTimelineContainer.querySelector('.' + cls.timelineHeaderTableContainer);
        this.chartBodyContent.style.width = formatUnit(this.parent.timelineModule.totalTimelineWidth);
        this.parent.notify('updateHeight', {});
        this.parent.updateGridLineContainerHeight();
        this.updateLastRowBottomWidth();
    }
    /**
     * Method to update bottom border for chart rows
     */
    public updateLastRowBottomWidth(): void {
        if (this.parent.currentViewData.length > 0 && this.parent.height !== 'auto') {
            let expandedRecords: IGanttData[] = this.parent.getExpandedRecords(this.parent.currentViewData);
            let lastExpandedRow: IGanttData = expandedRecords[expandedRecords.length - 1];
            let lastExpandedRowIndex: number = this.parent.currentViewData.indexOf(lastExpandedRow);
            let lastRow: HTMLElement = this.parent.getRowByIndex(lastExpandedRowIndex);
            let table: Element = this.parent.chartRowsModule.ganttChartTableBody;
            if (table.querySelectorAll('.e-chart-row-cell.e-chart-row-border.e-lastrow')) {
                removeClass(table.querySelectorAll('.e-chart-row-cell.e-chart-row-border.e-lastrow'), 'e-lastrow');
            }
            if (this.chartBodyContent.clientHeight < this.chartBodyContainer.clientHeight) {
                if (lastRow) {
                    addClass(lastRow.querySelectorAll('td'), 'e-lastrow');
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
     */
    private ganttChartMouseDown(e: PointerEvent): void {
        this.parent.notify('chartMouseDown', e);
        this.parent.element.tabIndex = 0;
    }

    /**
     * 
     * @param e 
     */
    private scrollToTarget(e: PointerEvent): void {
        let row: Element = closest(e.target as Element, 'tr');
        if (row && this.parent.element.contains(row) &&
            (this.parent.element.querySelectorAll('.e-chart-rows-container')[0].contains(e.target as Element) ||
                this.parent.element.querySelectorAll('.e-gridcontent')[0].contains(e.target as Element)) &&
            this.parent.currentViewData.length > 0) {
            let rowIndex: number = getValue('rowIndex', closest(e.target as Element, 'tr'));
            let dateObject: Date = this.parent.currentViewData[rowIndex].ganttProperties.startDate;
            if (!isNullOrUndefined(dateObject)) {
                let left: number = this.parent.dataOperation.getTaskLeft(dateObject, false);
                if (this.parent.autoFocusTasks) {
                    this.updateScrollLeft(left);
                }
            }
        }
    }
    /**
     * To focus selected task in chart side
     * @private
     */
    public updateScrollLeft(scrollLeft: number): void {
        scrollLeft = scrollLeft - 50 > 0 ? scrollLeft - 50 : 0;
        scrollLeft = this.scrollElement.scrollWidth <= scrollLeft ? this.scrollElement.scrollWidth : scrollLeft;
        if ((this.scrollElement.offsetWidth + this.parent.ganttChartModule.scrollElement.scrollLeft) < scrollLeft
            || (this.scrollElement.scrollLeft > scrollLeft)) {
            this.scrollObject.setScrollLeft(scrollLeft);
        }
    }

    /**
     *  Method trigger while perform mouse up action.
     * @return {void}
     * @private
     */
    private documentMouseUp(e: PointerEvent): void {
        if (this.parent.isDestroyed) {
            return;
        }
        let isTaskbarEdited: boolean = false;
        if (this.parent.editSettings.allowTaskbarEditing &&
            getValue('editModule.taskbarEditModule.isMouseDragged', this.parent) &&
            getValue('editModule.taskbarEditModule.taskBarEditAction', this.parent)) {
            isTaskbarEdited = true;
        }
        this.parent.notify('chartMouseUp', e);
        if (!isTaskbarEdited) {
            /** Expand/collapse action */
            let target: EventTarget = e.target;
            let isOnTaskbarElement: boolean | Element = (e.target as HTMLElement).classList.contains(cls.taskBarMainContainer)
                || closest(e.target as Element, '.' + cls.taskBarMainContainer);
            if ((<HTMLElement>target).closest('.e-gantt-parent-taskbar')) {
                this.chartExpandCollapseRequest(e);
            } else if (!isOnTaskbarElement && this.parent.autoFocusTasks) {
                this.scrollToTarget(e); /** Scroll to task */
            }
        }
        if (this.parent.editModule && this.parent.editModule.taskbarEditModule) {
            this.parent.editModule.taskbarEditModule.removeFalseLine(true);
        }
    }

    /**
     *  Method trigger while perform mouse leave action.
     * @return {void}
     * @private
     */
    private ganttChartLeave(e: PointerEvent): void {
        this.parent.notify('chartMouseLeave', e);
    }

    /**
     *  Method trigger while perform mouse move action.
     * @return {void}
     * @private
     */
    private ganttChartMove(e: PointerEvent): void {
        this.parent.notify('chartMouseMove', e);
        if (!isNullOrUndefined(this.parent.taskFields.dependency)) {
            this.parent.connectorLineEditModule.updateConnectorLineEditElement(e);
        }
    }

    /**
     * Double click handler for chart
     * @param e 
     */
    private doubleClickHandler(e: PointerEvent): void {
        this.parent.notify('chartDblClick', e);
    }

    /**
     * @private
     */
    public getRecordByTarget(e: PointerEvent): IGanttData {
        let row: Element = closest(e.target as Element, 'tr');
        let ganttData: IGanttData;
        if (row) {
            let rowIndex: number = getValue('rowIndex', closest(e.target as Element, 'tr'));
            ganttData = this.parent.currentViewData[rowIndex];
        }
        return ganttData;
    }

    /**
     * To get gantt chart row elements
     * @return {NodeListOf<Element>}
     * @private
     */
    public getChartRows(): NodeListOf<Element> {
        return document.getElementById(this.parent.element.id + 'GanttTaskTableBody').querySelectorAll('.e-chart-row');
    }

    /**
     * Expand Collapse operations from gantt chart side
     * @return {void}
     * @param target
     * @private
     */
    private chartExpandCollapseRequest(e: PointerEvent): void {
        let target: EventTarget = e.target;
        let parentElement: Element = (<HTMLElement>target).closest('.e-gantt-parent-taskbar');
        let record: IGanttData = this.getRecordByTarget(e);
        let chartRow: Node = closest(target as Element, 'tr');
        let rowIndex: number = getValue('rowIndex', chartRow);
        let gridRow: Node = this.parent.treeGrid.getRows()[rowIndex];
        let args: object = { data: record, gridRow: gridRow, chartRow: chartRow, cancel: false };
        this.isExpandCollapseFromChart = true;
        if (parentElement.classList.contains('e-row-expand')) {
            this.collapseGanttRow(args);
        } else if (parentElement.classList.contains('e-row-collapse')) {
            this.expandGanttRow(args);
        }
    }
    /**
     * @private
     */
    public reRenderConnectorLines(): void {
        this.parent.connectorLineModule.dependencyViewContainer.innerHTML = '';
        let expandedRecords: IGanttData[] = this.parent.getExpandedRecords(this.parent.currentViewData);
        this.parent.connectorLineIds = [];
        this.parent.updatedConnectorLineCollection = [];
        this.parent.predecessorModule.createConnectorLinesCollection(expandedRecords);
        this.parent.connectorLineModule.renderConnectorLines(this.parent.updatedConnectorLineCollection);
    }

    /**
     * To collapse gantt rows
     * @return {void}
     * @param args
     * @private
     */
    public collapseGanttRow(args: object): void {
        let record: IGanttData = getValue('data', args);
        this.parent.trigger('collapsing', args);
        if (getValue('cancel', args)) {
            return;
        }
        if (this.isExpandCollapseFromChart) {
            this.expandCollapseChartRows('collapse', getValue('chartRow', args), record, null);
            this.parent.treeGrid.collapseRow(getValue('gridRow', args), record);
            this.isExpandCollapseFromChart = false;
        } else {
            this.expandCollapseChartRows('collapse', getValue('chartRow', args), record, null);
        }
        this.parent.updateContentHeight();
        this.updateWidthAndHeight();
        this.reRenderConnectorLines();
        this.parent.trigger('collapsed', args);
    }

    /**
     * To expand gantt rows
     * @return {void}
     * @param args
     * @private
     */
    public expandGanttRow(args: object): void {
        let record: IGanttData = getValue('data', args);
        this.parent.trigger('expanding', args);
        if (getValue('cancel', args)) {
            return;
        }
        if (this.isExpandCollapseFromChart) {
            this.expandCollapseChartRows('expand', getValue('chartRow', args), record, null);
            this.parent.treeGrid.expandRow(getValue('gridRow', args), record);
            this.isExpandCollapseFromChart = false;
        } else {
            this.expandCollapseChartRows('expand', getValue('chartRow', args), record, null);
        }
        this.parent.updateContentHeight();
        this.updateWidthAndHeight();
        this.reRenderConnectorLines();
        this.parent.trigger('expanded', args);
    }

    /**
     * On expand collapse operation row properties will be updated here.
     * @return {void}
     * @param action
     * @param rowElement
     * @param record
     * @param isChild
     * @private
     */
    private expandCollapseChartRows(action: string, rowElement: Node, record: IGanttData, isChild: boolean): void {
        let displayType: string;
        if (action === 'expand') {
            displayType = 'table-row';
            if (!isChild) {
                record.expanded = true;
            }
            let targetElement: NodeListOf<Element> = (rowElement as HTMLElement).querySelectorAll('.e-row-collapse');
            for (let t: number = 0; t < targetElement.length; t++) {
                addClass([targetElement[t]], 'e-row-expand');
                removeClass([targetElement[t]], 'e-row-collapse');
            }
        } else if (action === 'collapse') {
            displayType = 'none';
            if (!isChild) {
                record.expanded = false;
            }
            let targetElement: NodeListOf<Element> = (rowElement as HTMLElement).querySelectorAll('.e-row-expand');
            for (let t: number = 0; t < targetElement.length; t++) {
                addClass([targetElement[t]], 'e-row-collapse');
                removeClass([targetElement[t]], 'e-row-expand');
            }
        }
        let childRecords: IGanttData[] = record.childRecords;
        let chartRows: NodeListOf<Element> = this.getChartRows();
        let rows: HTMLElement[] = [];
        chartRows.forEach((item: HTMLElement) => {
            if ((<HTMLElement>item).classList.contains('gridrowtaskId' + record.ganttProperties.taskId + 'level' + (record.level + 1))) {
                rows.push(<HTMLElement>item);
            }
        });
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
     * @return {void}
     * @param action
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
     * @return {void}
     * @param level
     * @private
     */
    public expandAtLevel(level: number): void {
        this.parent.treeGrid.expandAtLevel(level);
    }

    /**
     * Public method to collapse particular level of rows.
     * @return {void}
     * @param level
     * @private
     */
    public collapseAtLevel(level: number): void {
        this.parent.treeGrid.collapseAtLevel(level);
    }

    /**
     * Event Binding for gantt chart click 
     */
    private wireEvents(): void {
        let isIE11Pointer: Boolean = Browser.isPointer;
        let mouseDown: string = Browser.touchStartEvent;
        let mouseUp: string = Browser.touchEndEvent;
        let mouseMove: string = Browser.touchMoveEvent;
        let cancel: string = isIE11Pointer ? 'pointerleave' : 'mouseleave';
        if (this.parent.editSettings.allowTaskbarEditing) {
            EventHandler.add(this.parent.chartPane, mouseDown, this.ganttChartMouseDown, this);
            EventHandler.add(this.parent.chartPane, cancel, this.ganttChartLeave, this);
            EventHandler.add(this.parent.chartPane, mouseMove, this.ganttChartMove, this);
        }
        EventHandler.add(document.body, mouseUp, this.documentMouseUp, this);
        if (this.parent.editSettings.allowEditing) {
            EventHandler.add(this.parent.chartRowsModule.ganttChartTableBody, 'dblclick', this.doubleClickHandler, this);
        }
    }

    private unWireEvents(): void {
        let isIE11Pointer: Boolean = Browser.isPointer;
        let mouseDown: string = Browser.touchStartEvent;
        let mouseUp: string = Browser.touchEndEvent;
        let mouseMove: string = Browser.touchMoveEvent;
        let cancel: string = isIE11Pointer ? 'pointerleave' : 'mouseleave';
        if (this.parent.editSettings.allowTaskbarEditing) {
            EventHandler.remove(this.parent.chartRowsModule.ganttChartTableBody, mouseDown, this.ganttChartMouseDown);
            EventHandler.remove(this.parent.chartPane, cancel, this.ganttChartLeave);
            EventHandler.remove(this.parent.chartPane, mouseMove, this.ganttChartMove);
        }
        EventHandler.remove(document.body, mouseUp, this.documentMouseUp);
        if (this.parent.editSettings.allowEditing) {
            EventHandler.remove(this.parent.chartPane, 'dblclick', this.doubleClickHandler);
        }
    }

    /**
     * To get record by taskbar element.
     * @return {IGanttData}
     * @private
     */
    public getRecordByTaskBar(target: Element): IGanttData {
        let item: IGanttData = this.parent.currentViewData[this.getIndexByTaskBar(target)];
        return item;
    }

    /**
     * To get index by taskbar element.
     * @return {number}
     * @private
     */
    public getIndexByTaskBar(target: Element): number {
        let row: Element = closest(target, 'tr.' + cls.chartRow);
        let recordIndex: number = [].slice.call(this.parent.chartRowsModule.ganttChartTableBody.childNodes).indexOf(row);
        return recordIndex;
    }

    private destroy(): void {
        this.removeEventListener();
        this.unWireEvents();
        this.scrollObject.destroy();
        this.scrollObject = null;
    }
}