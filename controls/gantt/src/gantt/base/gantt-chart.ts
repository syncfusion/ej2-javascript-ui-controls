import { Gantt } from '../base/gantt';
import {
    createElement, formatUnit, EventHandler, Browser, KeyboardEvents,
    KeyboardEventArgs
} from '@syncfusion/ej2-base';
import { isNullOrUndefined, closest, addClass, removeClass, getValue, setValue } from '@syncfusion/ej2-base';
import * as cls from '../base/css-constants';
import { ChartScroll } from '../actions/chart-scroll';
import { IGanttData, IWorkTimelineRanges } from '../base/interface';
import { click } from '@syncfusion/ej2-grids';
import { ColumnModel } from '../models/column';
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
    public isCollapseAll: boolean = false;
    private focusedElement: HTMLElement;
    public focusedRowIndex: number;
    public debounceTimeoutNext: number = 0;
    public debounceTimeout: number = 0;
    private isGanttElement: boolean = false;
    public keyboardModule: KeyboardEvents;
    public targetElement: Element;
    public previousPinchDistance: number = 0;
    public virtualRender: VirtualContentRenderer;
    public isEditableElement: boolean;
    /* eslint-disable-next-line */
    public tempNextElement: any;
    public nextElementIndex: number;
    public childrenIndex: number;
    private currentToolbarIndex: number = -1;
    private initPinchDistance: number;
    private isPinching: boolean = false;
    constructor(parent: Gantt) {
        this.parent = parent;
        this.chartTimelineContainer = null;
        this.rangeViewContainer =
            createElement('div', { className: cls.rangeContainer });
        this.rangeViewContainer.setAttribute('role', 'button');
        this.rangeViewContainer.setAttribute('aria-label', 'RangeContainer');
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
            const data: IGanttData = this.parent.flatData[i as number];
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
            for (let i: number = 0; i < this.parent.chartRowsModule.ganttChartTableBody.children.length; i++) {
                if (this.parent.chartRowsModule.ganttChartTableBody.children[i as number].children[0].children[1].children[4]) {
                    (<HTMLElement>this.parent.chartRowsModule.ganttChartTableBody.children[i as number].children[0].children[1].children[1]).setAttribute('tabindex', '-1');
                    (<HTMLElement>this.parent.chartRowsModule.ganttChartTableBody.children[i as number].children[0].children[1].children[2]).setAttribute('tabindex', '-1');
                    (<HTMLElement>this.parent.chartRowsModule.ganttChartTableBody.children[i as number].children[0].children[1].children[4]).setAttribute('tabindex', '-1');
                }
                else {
                    if (this.parent.viewType === 'ProjectView') {
                        const node: HTMLElement = this.parent.chartRowsModule.ganttChartTableBody.
                            children[parseInt(i.toString(), 10)].children[0].children[1].children[1] as HTMLElement;
                        if (!isNullOrUndefined(node)) {
                            (<HTMLElement>this.parent.chartRowsModule.ganttChartTableBody.children[i as number].children[0].children[1].children[1]).setAttribute('tabindex', '-1');
                        }
                    }
                    else if (this.parent.chartRowsModule.ganttChartTableBody.children[parseInt(i.toString(), 10)].children[0].
                        children[1].children[0]) {
                        (<HTMLElement>this.parent.chartRowsModule.ganttChartTableBody.children[i as number].children[0].children[1].children[0]).setAttribute('tabindex', '-1');
                    }
                }
            }
            const criticalModule: CriticalPath = this.parent.criticalPathModule;
            if (this.parent.enableCriticalPath && criticalModule && criticalModule.criticalPathCollection) {
                this.parent.criticalPathModule.criticalConnectorLine(criticalModule.criticalPathCollection,
                                                                     criticalModule.detailPredecessorCollection,
                                                                     this.parent.enableCriticalPath,
                                                                     criticalModule.predecessorCollectionTaskIds);
            }
            if (this.parent.showOverAllocation) {
                this.renderOverAllocationContainer();
            }
        }
        this.updateWidthAndHeight();
        if (this.parent.isLoad) {
            this.parent.notify('selectRowByIndex', {});
        }
        if (this.parent.timelineModule.isZoomToFit) {
            this.parent.timelineModule.processZoomToFit();
        }
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
                ganttRecord = records[count as number];
                rangeCollection = ganttRecord.ganttProperties.workTimelineRanges;
                if (rangeCollection) {
                    this.renderRange(rangeCollection, ganttRecord);
                }
            }
        }
    }
    private getTopValue(currentRecord: IGanttData): number {
        const updatedRecords: IGanttData[] = this.parent.getExpandedRecords(this.parent.currentViewData);
        let recordIndex: number = updatedRecords.indexOf(currentRecord);
        if (currentRecord.parentItem && recordIndex === -1) {
            const nestedParent: IGanttData = this.parent.getRecordByID(currentRecord.parentItem.taskId);
            recordIndex = updatedRecords.indexOf(nestedParent);
        }
        if (!currentRecord.expanded ) {
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
        let topValue: number = 0;
        const rowIndex: number = this.parent.currentViewData.indexOf(currentRecord);
        if (!this.parent.allowTaskbarOverlap && this.parent.enableMultiTaskbar) {
            topValue = !currentRecord.expanded ? this.parent.getRowByIndex(rowIndex as number).offsetTop :
                this.parent.getRowByIndex(rowIndex as number).offsetTop + this.parent.rowHeight;
        }
        else {
            topValue = this.getTopValue(currentRecord);
        }
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
        if (currentRecord.level > 0 && currentRecord.expanded && !this.parent.getRecordByID(currentRecord.parentItem.taskId).expanded) {
            return;
        }
        for (let i: number = 0; i < rangeCollection.length; i++) {
            let height: number;
            const node: NodeListOf<ChildNode> = this.parent.chartRowsModule.ganttChartTableBody.childNodes;
            if (!this.parent.allowTaskbarOverlap && !currentRecord.expanded && this.parent.enableMultiTaskbar && !this.isCollapseAll) {
                height = parseInt((node[rowIndex as number] as HTMLElement).style.height, 10) -
                         (this.parent.rowHeight - this.parent.chartRowsModule.taskBarHeight);
            }
            else {
                height = this.getRangeHeight(currentRecord);
            }
            const leftDiv: HTMLElement = createElement('div', {
                className: cls.rangeChildContainer + ' ' + 'e-leftarc', styles: (this.parent.enableRtl ? 'right:' : 'left:') +
                `${(this.parent.enableRtl ? rangeCollection[i as number].left + rangeCollection[i as number].width - 5 : rangeCollection[i as number].left)}px;
                top: ${Math.floor((this.parent.rowHeight - this.parent.chartRowsModule.taskBarHeight) / 2)}px;
                height: ${height + 1}px; border-right: 0px;
                z-index: ${(this.parent.viewType === 'ProjectView') ? currentRecord.childRecords.length > 1 ? currentRecord.childRecords.length + 1 : currentRecord.childRecords.length : 6}`
            });
            const rightDiv: HTMLElement = createElement('div', {
                className: cls.rangeChildContainer + ' ' + 'e-rightarc',
                styles: (this.parent.enableRtl ? 'right:' : 'left:') + `${(this.parent.enableRtl ? rangeCollection[i as number].left :
                    rangeCollection[i as number].left + rangeCollection[i as number].width - 5)}px;
                top: ${Math.floor((this.parent.rowHeight - this.parent.chartRowsModule.taskBarHeight) / 2)}px; height: ${height + 1}px;
                border-left: 0px;
                z-index: ${(this.parent.viewType === 'ProjectView') ? currentRecord.childRecords.length > 1 ? currentRecord.childRecords.length + 1 : currentRecord.childRecords.length : 6}`
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
        if (this.parent.enableRtl) {
            this.chartTimelineContainer.style.borderLeftWidth = '1px';
            this.chartTimelineContainer.style.borderRightWidth = '0px';
        }
        this.chartTimelineContainer.setAttribute('role', 'presentation');
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
        if (this.parent.virtualScrollModule && this.parent.enableVirtualization || this.parent.enableTimelineVirtualization) {
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
        const emptyHeight: number = this.parent.contentHeight === 0 ? this.parent.flatData.length > 1 ? emptydivHeight : 0 :
            this.parent.contentHeight;
        const contentElement: HTMLElement = this.parent.element.getElementsByClassName('e-chart-scroll-container e-content')[0] as HTMLElement;
        if (emptyHeight >= contentElement['offsetHeight'] || this.parent.height === 'auto' || (contentElement['offsetHeight'] - emptyHeight) < emptydivHeight) {
            this.chartBodyContent.style.height = formatUnit(emptyHeight);
        } else {
            const scrollHeight: number =  this.parent.element.getElementsByClassName('e-chart-rows-container')[0]['offsetHeight'];
            if (contentElement['offsetHeight'] >= scrollHeight) {
                this.chartBodyContent.style.height = contentElement['offsetHeight'] - 17 + 'px';
            }
            else {
                this.chartBodyContent.style.height = contentElement['offsetHeight'] + 'px';
            }
        }        //let element: HTMLElement = this.chartTimelineContainer.querySelector('.' + cls.timelineHeaderTableContainer);
        this.chartBodyContent.style.width = (this.parent.enableTimelineVirtualization
            && (this.parent.timelineModule.totalTimelineWidth > this.parent.element.offsetWidth * 3)) ?
            formatUnit(this.parent.element.offsetWidth * 3)
            : formatUnit(this.parent.timelineModule.totalTimelineWidth);
        this.setVirtualHeight();
        this.parent.notify('updateHeight', {});
        this.parent.updateGridLineContainerHeight();
        this.updateLastRowBottomWidth();
    }

    private setVirtualHeight(): void {
        if (this.parent.virtualScrollModule && this.parent.enableVirtualization) {
            const wrapper: HTMLElement = getValue('virtualTrack', this.parent.ganttChartModule.virtualRender);
            wrapper.style.height = (this.parent.treeGrid.element.getElementsByClassName('e-virtualtrack')[0] as HTMLElement).style.height;
            const wrapper1: HTMLElement = getValue('wrapper', this.parent.ganttChartModule.virtualRender);
            const treegridVirtualHeight: string = (this.parent.treeGrid.element.getElementsByClassName('e-virtualtable')[0] as HTMLElement).style.transform;
            const virtualTable: string = (document.getElementsByClassName('e-virtualtable')[1] as HTMLElement).style.transform;
            if (this.parent.enableTimelineVirtualization) {
                let translateXValue: string;
                if (virtualTable !== '') {
                    translateXValue = virtualTable.match(/translate.*\((.+)\)/)[1].split(', ')[0];
                }
                else {
                    const chartTransform: string = (this.parent.ganttChartModule.scrollElement.getElementsByClassName('e-virtualtable')[0] as HTMLElement).style.transform;
                    translateXValue = chartTransform.match(/translate.*\((.+)\)/)[1].split(', ')[0];
                }
                const translateYValue: string = treegridVirtualHeight.match(/translate.*\((.+)\)/)[1].split(', ')[1];
                wrapper1.style.transform = `translate(${translateXValue}, ${translateYValue})`;
            }
            else {
                wrapper1.style.transform = treegridVirtualHeight;
            }
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
                    const emptyHeight: number = this.parent.contentHeight === 0 ? this.parent.flatData.length > 1 ? emptydivHeight : 0 :
                        this.parent.contentHeight;
                    const contentElement: HTMLElement = this.parent.element.getElementsByClassName('e-chart-scroll-container e-content')[0] as HTMLElement;
                    if (emptyHeight >= contentElement['offsetHeight'] || (contentElement['offsetHeight'] - emptyHeight) < emptydivHeight) {
                        this.chartBodyContent.style.height = formatUnit(emptyHeight);
                    } else {
                        const scrollHeight: number =  this.parent.element.getElementsByClassName('e-chart-rows-container')[0]['offsetHeight'];
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
    private ganttChartMouseDown(e: PointerEvent | TouchEvent): void {
        let cancel: boolean = false;
        if (e.type === 'touchstart' && e instanceof TouchEvent && e.touches && e.touches.length === 2) {
            // Calculate initial distance between two Pinch touch points
            this.initPinchDistance = this.calculatePinchDistance(e.touches[0], e.touches[1]);
            this.isPinching = true;
        }
        if (this.parent.allowTaskbarDragAndDrop && this.parent.editModule &&
            this.parent.editSettings.allowTaskbarEditing && !this.isPinching) {
            const editAction: string = this.parent.editModule.taskbarEditModule['getTaskBarAction'](e as PointerEvent);
            if (editAction === 'ChildDrag' || editAction === 'ParentDrag' || editAction === 'MilestoneDrag' || editAction === 'ManualParentDrag') {
                const args: Object = {
                    cancel: cancel,
                    data: this.getRecordByTaskBar(e.target as Element),
                    target: e.target,
                    chartRow: closest(e.target as Element, 'tr')
                };
                this.parent.trigger('rowDragStartHelper', args);
                cancel = args['cancel'];
            }
        }
        if (!cancel && !this.isPinching) {
            if ((e as PointerEvent).which !== 3 && this.parent.editSettings.allowTaskbarEditing) {
                this.parent.notify('chartMouseDown', e);
                this.parent.element.tabIndex = 0;
            }
            let isTaskbarEdited: boolean = false;
            if (this.parent.editSettings.allowTaskbarEditing && (this.parent.element.querySelector('.e-left-resize-gripper') || this.parent.element.querySelector('.e-left-connectorpoint-outer-div') )) {
                isTaskbarEdited = true;
            }
            if (!isTaskbarEdited || (e as PointerEvent).button === 2) {
                if (this.parent.editSettings.allowEditing && this.parent.treeGrid.element.getElementsByClassName('e-editedbatchcell').length > 0) {
                    this.parent.treeGrid.endEdit();
                }
            }
        }
    }

    private calculatePinchDistance(touch1: Touch, touch2: Touch): number {
        const dx: number = touch2.clientX - touch1.clientX;
        const dy: number = touch2.clientY - touch1.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    private ganttChartMouseClick(e: PointerEvent): void {
        if (this.parent.autoFocusTasks) {
            this.scrollToTarget(e); /** Scroll to task */
        }
        this.parent.notify('chartMouseClick', e);
    }

    private ganttChartMouseUp(e: PointerEvent): void {
        if (e.type === 'touchend') {
            this.initPinchDistance = null;
            this.isPinching = false;
            const resizeCheck: HTMLElement = this.parent.ganttChartModule.chartBodyContainer.querySelector('.e-taskbar-resize-div');
            if (!isNullOrUndefined(resizeCheck)) {
                resizeCheck.remove();
            }
            const Check: HTMLElement = this.parent.ganttChartModule.chartBodyContainer.querySelector('.e-clone-taskbar') || this.parent.chartPane.querySelector('.e-clone-taskbar');
            if (!isNullOrUndefined(Check)) {
                const clonetbody: HTMLElement = Check.parentElement;
                const cloneTable: HTMLElement = clonetbody.parentElement;
                cloneTable.remove();
            }
            const falseline: HTMLElement = this.parent.ganttChartModule.chartBodyContainer.querySelector('.e-gantt-false-line');
            if (!isNullOrUndefined(falseline)) {
                this.parent.editModule.taskbarEditModule.removeFalseLine(true);
            }
        }
        if (this.parent.editSettings.allowTaskbarEditing) {
            this.parent.notify('chartMouseUp', e);
        }
        if (!this.parent.editSettings.allowEditing) {
            let isTaskbarEdited: boolean = false;
            if (this.parent.editSettings.allowTaskbarEditing &&
                getValue('editModule.taskbarEditModule.isMouseDragged', this.parent) &&
                getValue('editModule.taskbarEditModule.taskBarEditAction', this.parent)) {
                isTaskbarEdited = true;
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
            const dateObject: Date = this.parent.currentViewData[rowIndex as number].ganttProperties.startDate;
            const dateObjLeft: number = this.parent.currentViewData[rowIndex as number].ganttProperties.left;
            if (!isNullOrUndefined(dateObject)) {
                const left: number | {} = !this.parent.enableTimelineVirtualization ?
                    this.parent.dataOperation.getTaskLeft(dateObject, false) : {};
                if (this.parent.autoFocusTasks) {
                    if (this.parent.enableTimelineVirtualization) {
                        this.updateScrollLeft(dateObjLeft as number);
                    } else {
                        this.updateScrollLeft(left as number);
                    }
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
            this.scrollObject.setScrollLeft(scrollLeft - 50, this.parent.enableRtl ? -1 : 0);
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
        if (e.type === 'touchend') {
            this.initPinchDistance = null;
            this.isPinching = false;
        }
        if (!isNullOrUndefined(this.parent.editModule) && !isNullOrUndefined(this.parent.editModule.taskbarEditModule)){
            this.parent.editModule.taskbarEditModule.removeFalseLine(false);
        }
        const resizeCheck: HTMLElement = this.parent.element.querySelector('.e-taskbar-resize-div');
        if (!isNullOrUndefined(resizeCheck)) {
            resizeCheck.remove();
        }
        if (this.parent.allowTaskbarDragAndDrop && this.parent.editModule && this.parent.editModule.taskbarEditModule) {
            this.parent.editModule.taskbarEditModule['previousLeftValue'] = 0;
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
    private documentMouseUp(e: PointerEvent | TouchEvent): void {
        if (e.type === 'touchend') {
            this.initPinchDistance = null;
            this.isPinching = false;
            this.previousPinchDistance = 0;
        }
        this.isGanttElement = true;
        if ((e.target as HTMLElement).classList.contains('e-treegridexpand') ||
           (e.target as HTMLElement).classList.contains('e-treegridcollapse')) {
            if (getValue('isEditCollapse', this.parent.treeGrid) === true) {
                setValue('isEditCollapse', false, this.parent.treeGrid);
            }
        }
        if (this.parent.allowRowDragAndDrop) {
            const ganttDragElemet: HTMLElement = this.parent.element.querySelector('.e-ganttdrag');
            if (ganttDragElemet) {
                ganttDragElemet.remove();
            }
        }
        if (this.parent.isDestroyed || (e as PointerEvent).which === 3) {
            return;
        }
        const resizeCheck: HTMLElement = this.parent.ganttChartModule.chartBodyContainer.querySelector('.e-taskbar-resize-div');
        if (!isNullOrUndefined(resizeCheck)) {
            resizeCheck.remove();
        }
        const Check: HTMLElement = this.parent.element.getElementsByClassName('e-clone-taskbar')[0] as HTMLElement;
        if (!isNullOrUndefined(Check)) {
            const clonetbody: HTMLElement = Check.parentElement;
            const cloneTable: HTMLElement = clonetbody.parentElement;
            cloneTable.remove();
        }
        let isTaskbarEdited: boolean = false;
        if (this.parent.editSettings.allowTaskbarEditing &&
            getValue('editModule.taskbarEditModule.isMouseDragged', this.parent) &&
            getValue('editModule.taskbarEditModule.taskBarEditAction', this.parent)) {
            isTaskbarEdited = true;
        }
        this.parent.notify('chartMouseUp', e);
        if (this.parent.showActiveElement) {
            this.parent.showIndicator = true;
            if (!isNullOrUndefined(this.parent.loadingIndicator) && this.parent.loadingIndicator.indicatorType === 'Shimmer'){
                this.parent.hideMaskRow();
            } else {
                this.parent.hideSpinner();
            }
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
                this.chartExpandCollapseRequest(e as PointerEvent);
            } else if (!isOnTaskbarElement && this.parent.autoFocusTasks) {
                this.scrollToTarget(e as PointerEvent); /** Scroll to task */
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
                this.onTaskbarClick((e as PointerEvent), target, taskbarElement);
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
        let rowIndex: number;
        const chartRow: Node = closest(target as Element, 'tr');
        if (!isNullOrUndefined(chartRow)) {
            rowIndex = getValue('rowIndex', chartRow);
        }
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
    private ganttChartMove(e: PointerEvent | TouchEvent): void {
        if (e.type === 'touchmove' && this.isPinching === true && e instanceof TouchEvent && e.touches && e.touches.length === 2) {
            // Calculate current distance between two touch points
            const currentPinchDistance: number = this.calculatePinchDistance(e.touches[0], e.touches[1]);
            if (Math.abs(this.previousPinchDistance - currentPinchDistance) > 15) {
                if (currentPinchDistance > this.previousPinchDistance) {
                    // Pinch out detected - Perform Zoom in
                    this.parent.timelineModule.processZooming(true);
                }
                else if (currentPinchDistance < this.previousPinchDistance) {
                    // Pinch in detected - Perform Zoom out
                    this.parent.timelineModule.processZooming(false);
                }
                this.previousPinchDistance = currentPinchDistance;
            }
        }
        if (this.parent.editSettings.allowTaskbarEditing && this.isPinching === false) {
            if (this.parent.element.getElementsByClassName('e-clone-taskbar').length > 0 && !this.parent.enableRtl) {
                let xValue: number;
                if (e.type === 'touchmove' || e.type === 'touchstart' || e.type === 'touchend') {
                    xValue = e['changedTouches'][0].pageX;
                }
                else {
                    xValue = (e as PointerEvent).pageX;
                }
                if (xValue <= this.parent.getOffsetRect(this.parent.ganttChartModule.chartElement).left) {
                    return;
                }
            }
            this.parent.notify('chartMouseMove', e);
            if (!isNullOrUndefined(this.parent.taskFields.dependency) && this.parent.connectorLineEditModule) {
                this.parent.connectorLineEditModule.updateConnectorLineEditElement(e as PointerEvent);
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
        if (this.parent.allowTaskbarDragAndDrop) {
            const Check: HTMLElement = this.parent.chartPane.querySelector('.e-clone-taskbar');
            if (!isNullOrUndefined(Check)) {
                const clonetbody: HTMLElement = Check.parentElement;
                const cloneTable: HTMLElement = clonetbody.parentElement;
                cloneTable.remove();
            }
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
                    args.column = this.parent.treeGrid.columns[cellIndex as number];
                }
                if (closest((<HTMLElement>target), '.e-indicator-span')) {
                    let index: number = 0;
                    const indicators: IIndicator[] = rowData.ganttProperties.indicators;
                    if (indicators.length > 1) {
                        for (index = 0; index < indicators.length; index++) {
                            if (indicators[index as number].name === ((<HTMLElement>element).innerText).trim()) {
                                break;
                            }
                        }
                    }
                    args.indicator = indicators[index as number];
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
        const target: EventTarget = e.target;
        const row: Element = closest(target as Element, 'tr');
        const rowIndex: number = getValue('rowIndex', row);
        const rowData: IGanttData = this.parent.ganttChartModule.getRecordByTarget(e);
        if (this.parent.editSettings.allowEditing && this.parent.treeGrid.element.getElementsByClassName('e-editedbatchcell').length > 0) {
            this.parent.treeGrid.endEdit();
        }
        this.parent.notify('chartDblClick', e);
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
                ganttData = this.parent.currentViewData[rowIndex as number];
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
        if (document.getElementById(this.parent.element.id + 'GanttTaskTableBody') !== null) {
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
        const gridRow: Node = this.parent.treeGrid.getRows()[rowIndex as number];
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
        const criticalModule: CriticalPath = this.parent.criticalPathModule;
        if (this.parent.enableCriticalPath && criticalModule && criticalModule.criticalPathCollection) {
            criticalModule.criticalConnectorLine(criticalModule.criticalPathCollection, criticalModule.detailPredecessorCollection, true,
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
    public collapseGanttRow(args: object): void {
        this.parent.trigger('collapsing', args, (arg: object) => {
            if (this.isExpandCollapseFromChart && !getValue('cancel', arg)) {
                this.collapsedGanttRow(arg);
            }
            this.isExpandCollapseFromChart = false;
        });
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
        let record: IGanttData;
        if (this.parent.loadChildOnDemand && this.parent.taskFields.hasChildMapping) {
            record = this.parent.currentViewData.filter((item: IGanttData) => item.ganttProperties[this.parent.taskFields.id] === args['data'][this.parent.taskFields.id])[0];
        } else {
            record = getValue('data', args);
        }
        if (this.isExpandCollapseFromChart) {
            this.expandCollapseChartRows('collapse', getValue('chartRow', args), record, null);
            const idField: string = this.parent.taskFields.id;
            if (this.parent.loadChildOnDemand && this.parent.taskFields.hasChildMapping) {
                const gridRec: Object = this.parent.treeGrid.getCurrentViewRecords().filter(function (item: Object): boolean { return item[idField as string] === args['data'][idField as string]; })[0];
                this.parent.treeGrid.collapseRow(getValue('gridRow', args), gridRec);
            }
            else {
                this.parent.treeGrid.collapseRow(getValue('gridRow', args), record);
            }
            this.isExpandCollapseFromChart = false;
        } else {
            this.expandCollapseChartRows('collapse', getValue('chartRow', args), record, null);
        }
        // To render the child record on parent row after collapsing
        if (this.parent.viewType === 'ResourceView' || this.parent.viewType === 'ProjectView') {
            this.renderMultiTaskbar(record);
        }
        if (!this.parent.enableVirtualization) {
            this.parent.updateContentHeight();
        }
        this.updateWidthAndHeight();
        this.reRenderConnectorLines();
        getValue('chartRow', args).setAttribute('aria-expanded', 'false');
    }

    /**
     * To expand gantt rows
     *
     * @returns {void} .
     * @param {object} args .
     * @param {boolean} isCancel .
     * @private
     */
    public expandGanttRow(args: object): void {
        this.parent.trigger('expanding', args, (arg: object) => {
            if (this.isExpandCollapseFromChart && !getValue('cancel', arg)) {
                this.expandedGanttRow(arg);
            }
            this.isExpandCollapseFromChart = false;
        });
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
        let record: IGanttData;
        if (this.parent.loadChildOnDemand && this.parent.taskFields.hasChildMapping) {
            record = this.parent.currentViewData.filter((item: IGanttData) => item.ganttProperties.taskId === args['data'][this.parent.taskFields.id])[0];
        } else {
            record = getValue('data', args);
        }
        if (this.isExpandCollapseFromChart) {
            this.expandCollapseChartRows('expand', getValue('chartRow', args), record, null);
            const idField: string = this.parent.taskFields.id;
            if (this.parent.loadChildOnDemand && this.parent.taskFields.hasChildMapping) {
                const gridRec: Object = this.parent.treeGrid.getCurrentViewRecords().filter(function (item: IGanttData): boolean { return item[idField as string] === args['data'][idField as string]; })[0];
                this.parent.treeGrid.expandRow(getValue('gridRow', args), gridRec);
            }
            else {
                this.parent.treeGrid.expandRow(getValue('gridRow', args), record);
            }
            this.isExpandCollapseFromChart = false;
        } else {
            if (!this.parent.isExpandCollapseLevelMethod) {
                this.expandCollapseChartRows('expand', getValue('chartRow', args), record, null);
            }
            this.parent.isExpandCollapseLevelMethod = false;
        }
        // To render the child record on parent row after expanding.
        if (this.parent.viewType === 'ResourceView' || this.parent.viewType === 'ProjectView') {
            this.renderMultiTaskbar(record);
        }
        if (!this.parent.enableVirtualization) {
            this.parent.updateContentHeight();
        }
        this.updateWidthAndHeight();
        this.reRenderConnectorLines();
        getValue('chartRow', args).setAttribute('aria-expanded', 'true');
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
                addClass([targetElement[t as number]], 'e-row-expand');
                removeClass([targetElement[t as number]], 'e-row-collapse');
            }
        } else if (action === 'collapse') {
            displayType = 'none';
            if (!isChild) {
                record.expanded = false;
            }
            const targetElement: NodeListOf<Element> = (rowElement as HTMLElement).querySelectorAll('.e-row-expand');
            for (let t: number = 0; t < targetElement.length; t++) {
                addClass([targetElement[t as number]], 'e-row-collapse');
                removeClass([targetElement[t as number]], 'e-row-expand');
            }
        }
        if (!this.parent.enableVirtualization) {
            const childRecords: IGanttData[] = record.childRecords;
            const chartRows: NodeListOf<Element> = this.getChartRows();
            const rows: HTMLElement[] = [];
            for (let i: number = 0; i < chartRows.length; i++) {
                if ((<HTMLElement>chartRows[i as number]).classList.contains(
                    'gridrowtaskId' +
                    record.ganttProperties.rowUniqueID +
                    'level' +
                    (record.level + 1)
                )
                ) {
                    rows.push(<HTMLElement>chartRows[i as number]);
                }
            }
            for (let i: number = 0; i < rows.length; i++) {
                rows[i as number].style.display = displayType;
                if (childRecords[i as number].childRecords &&
                    childRecords[i as number].childRecords.length &&
                    (action === 'collapse' ||
                        childRecords[i as number].expanded ||
                        this.isExpandAll)
                ) {
                    this.expandCollapseChartRows(
                        action,
                        rows[i as number],
                        childRecords[i as number],
                        true
                    );
                }
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
            this.isCollapseAll = true;
            this.parent.treeGrid.collapseAll();
            if (this.isCollapseAll && !this.parent.allowTaskbarOverlap) {
                const treeGridContentHeight: number = this.parent.enableRtl ? this.parent['element'].getElementsByClassName('e-content')[2].children[0]['offsetHeight'] :
                    this.parent['element'].getElementsByClassName('e-content')[0].children[0]['offsetHeight'];
                this.parent.contentHeight = treeGridContentHeight;
                document.getElementsByClassName('e-chart-rows-container')[0]['style'].height = this.parent.contentHeight + 'px';
            }
        }
        this.isExpandAll = false;
        this.isCollapseAll = false;
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
        EventHandler.add(this.parent.chartPane, 'wheel', this.onWheelZoom, this);
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
        if (!isNullOrUndefined(this.parent.chartRowsModule.ganttChartTableBody)) {
            EventHandler.remove(this.parent.chartRowsModule.ganttChartTableBody, mouseDown, this.ganttChartMouseDown);
        }
        if (!isNullOrUndefined(this.parent.chartPane)) {
            EventHandler.remove(this.parent.chartPane, cancel, this.ganttChartLeave);
            EventHandler.remove(this.parent.chartPane, mouseMove, this.ganttChartMove);
            EventHandler.remove(this.parent.chartPane, 'wheel', this.onWheelZoom);
            EventHandler.remove(this.parent.chartPane, mouseDown, this.ganttChartMouseDown);
        }
        if (this.parent.isAdaptive) {
            if (!isNullOrUndefined(this.parent.chartPane)) {
                EventHandler.remove(this.parent.chartPane, click, this.ganttChartMouseClick);
                EventHandler.remove(this.parent.chartPane, mouseUp, this.ganttChartMouseUp);
            }
        }
        if (!this.parent.isAdaptive) {
            if (!isNullOrUndefined(this.parent.element)) {
                EventHandler.remove(this.parent.element, mouseUp, this.documentMouseUp);
            }
            if (!isNullOrUndefined(document)) {
                EventHandler.remove(document, mouseUp, this.mouseUp);
            }
        }
        if (!isNullOrUndefined(this.parent.element)) {
            EventHandler.remove(this.parent.element, 'mousemove', this.mouseMoveHandler);
        }
        if (!isNullOrUndefined(document)) {
            EventHandler.remove(document, 'mouseup', this.contextClick);
            if (!isNullOrUndefined(document.body)) {
                EventHandler.remove(document.body, 'contextmenu', this.contextClick);
            }
        }
        if (!isNullOrUndefined(this.parent.chartRowsModule.ganttChartTableBody)) {
            EventHandler.remove(this.parent.chartRowsModule.ganttChartTableBody, 'dblclick', this.doubleClickHandler);
        }
    }

    // Triggers while perform ctrl+mouse wheel Pinch IN/OUT actions
    private onWheelZoom(e: WheelEvent): void {
        if (e.ctrlKey) {
            e.preventDefault();
            const zoomIn1: boolean = e.deltaY < 0;
            // Differentiating between touchpad and mouse wheel
            let isTouchpad: boolean = false;
            if (Math.abs(e.deltaY) < 75) {  // Smaller deltaY typically indicates touchpad
                isTouchpad = true;
            }
            if (this.debounceTimeout) {
                if (((this.debounceTimeoutNext + 20) > this.debounceTimeout)) {
                    clearTimeout(this.debounceTimeout);
                }
                if ((this.debounceTimeoutNext + 20) <= this.debounceTimeout || !this.debounceTimeoutNext) {
                    this.debounceTimeoutNext = this.debounceTimeout;
                }
            }
            this.debounceTimeout = setTimeout(function (): void {
                const verticalScrollDelta: number = Math.abs(e.deltaY);
                // Adjust threshold based on the input method
                const isValidScrollDelta: boolean = isTouchpad
                    ? (verticalScrollDelta > 0.5 && verticalScrollDelta < 15)
                    : (verticalScrollDelta > 5 && verticalScrollDelta <= 200);
                if (isValidScrollDelta) {
                    this.parent.timelineModule.processZooming(zoomIn1);
                }
            }.bind(this), 100);
        }
    }

    /**
     * To get record by taskbar element.
     *
     * @param {Element} target .
     * @returns {IGanttData} .
     * @private
     */
    public getRecordByTaskBar(target: Element): IGanttData {
        let item: IGanttData;
        if (this.parent.enableVirtualization && this.parent.enableMultiTaskbar) {
            item = this.parent.flatData[this.getIndexByTaskBar(target)];
        }
        else {
            item = this.parent.currentViewData[this.getIndexByTaskBar(target)];
        }        return item;
    }
    private updateElement(next: Element, currentColumn: ColumnModel, isTab: boolean, isInEditedState: boolean, row: IGanttData): Element {
        if (this.parent.ganttColumns[next.getAttribute('data-colindex')].field === this.parent.taskFields.progress) {
            let rowIndex: number = row.index;
            do {
                if (row.hasChildRecords) {
                    next = this.getNextElement(next as Element, isTab, isInEditedState) as Element;
                }
                currentColumn = this.parent.ganttColumns[(next as Element).getAttribute('data-colindex')];
                rowIndex = this.parent.treeGrid.getRows().indexOf(next.parentElement as HTMLTableRowElement);
            } while (!currentColumn.allowEditing);
            this.parent.treeGrid.saveCell();
            this.parent.treeGrid.editCell(rowIndex, this.parent.ganttColumns[next.getAttribute('data-colindex')].field);
        }
        return next;
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
        const toolbarItems: HTMLCollectionOf<Element> = document.getElementsByClassName('e-toolbar-item');
        const isInEditedState: boolean = this.parent.editModule && this.parent.editModule.cellEditModule &&
            this.parent.editModule.cellEditModule.isCellEdit;
        if (!this.parent.showActiveElement && !isInEditedState) {
            return;
        }
        let $target: Element = isInEditedState ? (e.target as Element).closest('.e-rowcell') : e.target as Element;
        if (this.parent.element.querySelectorAll('.e-focused').length > 0) {
            $target = this.parent.element.querySelectorAll('.e-focused')[0];
        }
        if ($target && !($target.classList.contains('e-toolbar-item') ||
            $target.classList.contains('e-input') || $target.classList.contains('e-btn'))) {
            this.currentToolbarIndex = -1;
        }
        if ($target.closest('.e-rowcell') || $target.closest('.e-chart-row')) {
            this.parent.focusModule.setActiveElement($target as HTMLElement);
        }
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        this.focusedRowIndex = $target.closest('.e-rowcell') ? ($target.parentElement as any).rowIndex :
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            $target.closest('.e-chart-row') ? ($target.closest('.e-chart-row') as any).rowIndex : -1;
        const isTab: boolean = (e.action === 'tab') ? true : false;
        let nextElement: Element | string = this.getNextElement($target, isTab, isInEditedState);
        if (nextElement && (nextElement === 'noNextRow' || (nextElement as HTMLElement).classList.contains('e-rowdragheader'))) {
            // eslint-disable-next-line
            (nextElement === 'noNextRow' && this.parent.treeGrid.element.getElementsByClassName('e-editedbatchcell').length > 0) ? this.parent.treeGrid.saveCell() : '';
            nextElement = null;
        }
        if (nextElement && $target.classList.contains('e-headercell')) {
            let colIndex: number = parseInt((nextElement as HTMLElement).getAttribute('data-colindex'), 10);
            if (e.action === 'shiftTab') {
                while (colIndex !== -1 && !this.parent.treeGrid.columns[colIndex as number]['visible']) {
                    colIndex = colIndex - 1;
                }
                if (colIndex !== -1) {
                    colIndex = this.parent.allowRowDragAndDrop ? colIndex + 1 : colIndex;
                    nextElement = document.getElementsByClassName('e-columnheader')[0].childNodes[colIndex as number] as HTMLElement;
                }
                else {
                    const toolbarItems: HTMLCollectionOf<Element> = document.getElementsByClassName('e-toolbar-item');
                    for (let i: number = toolbarItems.length - 1; i > 0; i--) {
                        if (!document.getElementsByClassName('e-toolbar-item')[i as number].classList.contains('e-hidden')) {
                            nextElement = document.getElementsByClassName('e-toolbar-item')[i as number];
                            this.currentToolbarIndex = i;
                            break;
                        }
                    }
                }
            }
            else {
                while (!this.parent.treeGrid.columns[colIndex as number]['visible']) {
                    colIndex = colIndex + 1;
                }
                colIndex = this.parent.allowRowDragAndDrop ? colIndex + 1 : colIndex;
                nextElement = document.getElementsByClassName('e-columnheader')[0].childNodes[colIndex as number] as HTMLElement;
            }
        }
        if (!nextElement && $target.classList.contains('e-headercell') && e.action === 'tab') {
            nextElement = document.getElementsByClassName('e-timeline-header-container')[0];
        }
        if (!nextElement && ($target.classList.contains('e-headercell') || $target.classList.contains('e-toolbar-item') || $target.classList.contains('e-treegrid') ||
            $target.classList.contains('e-input') || $target.classList.contains('e-btn')) && this.parent.toolbarModule && this.parent.toolbar.length > 0) {
            let itemIndex: number = this.currentToolbarIndex !== -1 ? (e.action === 'tab' ? this.currentToolbarIndex + 1 :
                this.currentToolbarIndex - 1) : (e.action === 'shiftTab' ? toolbarItems.length - 1 : 1);
            let isUpdated: boolean = false;
            if (itemIndex !== -1 && (e.action === 'shiftTab' || (e.action === 'tab' && itemIndex < toolbarItems.length))) {
                do {
                    if (!toolbarItems[itemIndex as number].classList.contains('e-hidden')) {
                        nextElement = toolbarItems[itemIndex as number];
                        nextElement.setAttribute('tabindex', '-1');
                        if (nextElement.querySelector('.e-btn') === $target) {
                            // eslint-disable-next-line
                            e.action === 'tab' ? itemIndex++ : itemIndex--;
                            nextElement = toolbarItems[itemIndex as number];
                        }
                        if (nextElement.querySelector('.e-btn')) {
                            (nextElement.querySelector('.e-btn')).setAttribute('tabindex', '0');
                        }
                        isUpdated = true;
                        this.currentToolbarIndex = itemIndex;
                    }
                    else {
                        // eslint-disable-next-line
                        e.action === 'tab' ? itemIndex++ : itemIndex--;
                    }
                }
                while (!isUpdated);
            }
        }
        if (e.action === 'tab' && !nextElement && (this.currentToolbarIndex === toolbarItems.length - 1 &&
            ($target.classList.contains('e-toolbar-item') || $target.classList.contains('e-input') ||
            $target.classList.contains('e-btn')))) {
            for (let i: number = 0; i < this.parent.treeGrid.columns.length; i++) {
                if (this.parent.treeGrid.columns[i as number]['visible']) {
                    nextElement = document.getElementsByClassName('e-columnheader')[0].childNodes[i as number] as HTMLElement;
                    break;
                }
            }
        }
        if (e.action === 'shiftTab' && !nextElement && !$target.classList.contains('e-headercell')) {
            nextElement = document.getElementsByClassName('e-timeline-header-container')[0];
        }
        if (e.action === 'shiftTab' && $target.classList.contains('e-timeline-header-container')) {
            for (let i: number = this.parent.treeGrid.columns.length; i > 0; i--) {
                if (this.parent.treeGrid.columns[i - 1]['visible']) {
                    nextElement = document.getElementsByClassName('e-columnheader')[0].childNodes[i - 1] as HTMLElement;
                    break;
                }
            }
        }
        this.tempNextElement = nextElement;
        if (!isNullOrUndefined(nextElement) && !isNullOrUndefined(nextElement['cellIndex'])) {
            if (this.parent.allowRowDragAndDrop) {
                this.childrenIndex = nextElement['cellIndex'];
                this.nextElementIndex = nextElement['cellIndex'] - 1;
            }
            else {
                this.childrenIndex = nextElement['cellIndex'];
                this.nextElementIndex = nextElement['cellIndex'];
            }
            if (this.nextElementIndex !== -1 && !this.parent.ganttColumns[this.nextElementIndex]['allowEditing'] &&
                this.parent.ganttColumns[this.nextElementIndex]['field'] !== this.parent.taskFields.id) {
                this.isEditableElement = true;
            }
            else {
                this.isEditableElement = false;
            }
        }
        if (nextElement === 'noNextRow') {
            this.manageFocus($target as HTMLElement, 'remove', true);
            return;
        }
        if (typeof nextElement !== 'string') {
            if ($target.classList.contains('e-rowcell') || $target.closest('.e-chart-row-cell') ||
                $target.classList.contains('e-headercell') || $target.closest('.e-segmented-taskbar') ||
                $target.classList.contains('e-timeline-header-container')) {
                e.preventDefault();
            }
            if (isTab && $target.classList.contains('e-rowdragdrop')) {
                this.parent.treeGrid.grid.notify('key-pressed', e);
                return;
            }
            if ($target.classList.contains('e-rowcell') && (nextElement && nextElement.classList.contains('e-rowcell')) ||
                $target.classList.contains('e-headercell')) {     // eslint-disable-line                                                                                                                                                                                                                                    
                if (isTab) {
                    if (this.parent.editSettings.allowNextRowEdit) {
                        const rowData: IGanttData = this.parent.currentViewData[this.focusedRowIndex];
                        const columnName: string = this.parent.ganttColumns[nextElement.getAttribute('data-colindex')].field;
                        if (rowData.hasChildRecords) {
                            if (columnName === this.parent.taskFields.endDate || columnName ===
                                this.parent.taskFields.duration || columnName === this.parent.taskFields.dependency ||
                                columnName === this.parent.taskFields.progress || columnName === this.parent.taskFields.work ||
                                columnName === this.parent.taskFields.type || columnName === 'taskType') {
                                this.parent.treeGrid.grid.endEdit();
                                this.parent.treeGrid.grid.notify('key-pressed', e);
                            } else if (columnName === this.parent.taskFields.name || columnName === this.parent.taskFields.startDate) {
                                this.parent.treeGrid.grid.notify('key-pressed', e);
                            } else {
                                this.parent.treeGrid.grid.notify('key-pressed', e);
                                if (isInEditedState) {
                                    this.parent.treeGrid.editCell(this.focusedRowIndex, columnName);
                                }
                            }
                        } else {
                            this.parent.treeGrid.grid.notify('key-pressed', e);
                        }
                    } else {
                        if (!nextElement || (nextElement && !nextElement.classList.contains('e-headercell') && !nextElement.classList.contains('e-timeline-header-container'))) {
                            if ($target.classList.contains('e-headercell')) {
                                this.manageFocus($target as HTMLElement, 'remove', false);
                            }
                            /* eslint-disable-next-line */
                            const row: IGanttData = this.parent.currentViewData[($target.parentElement as any).rowIndex];
                            let next: Element = nextElement;
                            if (row.hasChildRecords &&
                                (this.parent.ganttColumns[next.getAttribute('data-colindex')].field === this.parent.taskFields.progress ||
                                !this.parent.ganttColumns[next.getAttribute('data-colindex')].allowEditing) &&
                                this.parent.ganttColumns[next.getAttribute('data-colindex')].field !== this.parent.taskFields.id
                                && $target.classList.contains('e-editedbatchcell')) {
                                let currentColumn: ColumnModel;
                                next = this.updateElement(next, currentColumn, isTab, isInEditedState, row);
                                while (!this.parent.ganttColumns[next.getAttribute('data-colindex')].allowEditing) {
                                    next = this.getNextElement(next as Element, isTab, isInEditedState) as Element;
                                }
                                next = this.updateElement(next, currentColumn, isTab, isInEditedState, row);
                            }
                            else if (!nextElement || $target.classList.contains('e-editedbatchcell')) {
                                this.parent.treeGrid.grid.notify('key-pressed', e);
                            }
                        }
                    }
                } else {
                    if (nextElement && !nextElement.classList.contains('e-headercell') && nextElement.classList.contains('e-rowcell')
                        && !nextElement.classList.contains('e-toolbar-item')) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        const row: IGanttData = this.parent.currentViewData[($target.parentElement as any).rowIndex];
                        let next: Element = nextElement;
                        if (row.hasChildRecords &&
                            (this.parent.ganttColumns[next.getAttribute('data-colindex')].field === this.parent.taskFields.progress ||
                            !this.parent.ganttColumns[next.getAttribute('data-colindex')].allowEditing) &&
                            this.parent.ganttColumns[next.getAttribute('data-colindex')].field !== this.parent.taskFields.id
                            && $target.classList.contains('e-editedbatchcell')) {
                            let currentColumn: ColumnModel;
                            next = this.updateElement(next, currentColumn, isTab, isInEditedState, row);
                            while (!this.parent.ganttColumns[next.getAttribute('data-colindex')].allowEditing) {
                                next = this.getNextElement(next as Element, isTab, isInEditedState) as Element;
                            }
                            next = this.updateElement(next, currentColumn, isTab, isInEditedState, row);
                        }
                        else if (parseInt(next.parentElement.getAttribute('data-rowindex'), 10) !== 0 &&
                        parseInt(next.getAttribute('data-colindex'), 10) === 0 &&
                        this.parent.ganttColumns[next.getAttribute('data-colindex')].field === this.parent.taskFields.id &&
                            $target.classList.contains('e-editedbatchcell')) {
                            /* eslint-disable-next-line */
                            const rowIndex: number = ($target.parentElement as any).rowIndex;
                            const rowElement: Element = this.getNextRowElement(rowIndex, isTab, true);
                            next = this.getChildElement(rowElement, isTab) as Element;
                            const rowData: IGanttData = this.parent.flatData[parseInt(rowElement.getAttribute('data-rowindex'), 10)];
                            if (rowData.hasChildRecords && (!this.parent.ganttColumns[next.getAttribute('data-colindex')].allowEditing ||
                                                            this.parent.ganttColumns[next.getAttribute('data-colindex')].field ===
                                                            this.parent.taskFields.progress)) {
                                let currentColumn: ColumnModel;
                                next = this.updateElement(next, currentColumn, isTab, isInEditedState, rowData);
                                while (!this.parent.ganttColumns[next.getAttribute('data-colindex')].allowEditing) {
                                    next = this.getNextElement(next as Element, isTab, isInEditedState) as Element;
                                }
                                next = this.updateElement(next, currentColumn, isTab, isInEditedState, rowData);
                            }
                            else {
                                this.parent.treeGrid.grid.notify('key-pressed', e);
                            }
                        }
                        else {
                            this.parent.treeGrid.grid.notify('key-pressed', e);
                        }
                    }
                }
            }
            if (this.parent.element.querySelectorAll('.e-focused').length > 0) {
                this.manageFocus(this.parent.element.querySelectorAll('.e-focused')[0] as HTMLElement, 'remove', false);
            }
            if (!(this.parent.editModule && this.parent.editModule.cellEditModule
                && !isNullOrUndefined(this.parent.editModule.cellEditModule.editedColumn))) {
                if (nextElement) {
                    if ($target.classList.contains('e-rowcell')) {
                        this.manageFocus($target as HTMLElement, 'remove', false);
                    } else {
                        this.manageFocus($target as HTMLElement, 'remove', true);
                    }
                    if ((nextElement.classList.contains('e-rowcell') && $target.nextElementSibling && !$target.classList.contains('e-timeline-header-container'))
                        || $target.classList.contains('e-right-label-container')) {
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
                        if (nextElement && (nextElement.classList.contains('e-toolbar-item') || nextElement.classList.contains('e-headercell')
                            || nextElement.classList.contains('e-rowcell'))) {
                            this.manageFocus($target as HTMLElement, 'remove', false);
                            if (!nextElement.classList.contains('e-toolbar-item')) {
                                this.manageFocus(nextElement as HTMLElement, 'add', false);
                            }
                            if ($target.classList.contains('e-treegrid')) {
                                e.preventDefault();
                            }
                        }
                        else {
                            this.manageFocus(nextElement as HTMLElement, 'add', true);
                        }
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
        if ($target.classList.contains('e-timeline-header-container') && isTab) {
            const rowElement: Element = this.getNextRowElement(-1, isTab, true);
            return this.getChildElement(rowElement, isTab);
        }
        let nextElement: Element = isTab ? $target.nextElementSibling : $target.previousElementSibling;
        if ($target.parentElement.classList.contains('e-taskbar-main-container')) {
            if (this.parent.labelSettings.rightLabel && isTab) {
                return $target.parentElement.nextElementSibling;
            }
            else if (!isTab && this.parent.labelSettings.leftLabel) {
                return $target.parentElement.previousElementSibling;
            }
        }
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
                    if (this.parent.treeGrid.element.getElementsByClassName('e-editedbatchcell').length > 0) {
                        rowElement = this.getNextRowElement(rowIndex, isTab, true);
                        const childElement: Element | string = this.getChildElement(rowElement, isTab);
                        return childElement;
                    }
                    else {
                        if (this.validateNextElement(rowElement, 'e-left-label-container')) {
                            return rowElement.getElementsByClassName('e-left-label-container')[0];
                        } else if (this.validateNextElement(rowElement, 'e-taskbar-main-container')) {
                            return rowElement.getElementsByClassName('e-taskbar-main-container')[0];
                        } else if (this.validateNextElement(rowElement, 'e-right-label-container')) {
                            return rowElement.getElementsByClassName('e-right-label-container')[0];
                        }
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
                    if (!isTab && this.parent.virtualScrollModule && this.parent.enableVirtualization) {
                        /* eslint-disable-next-line */
                        const rowRecord: IGanttData = this.parent.currentViewData[rowIndex];
                        rowIndex = this.parent.flatData.indexOf(rowRecord);
                    }
                    rowElement = this.getNextRowElement(rowIndex, isTab, true);
                } else {
                    rowElement = this.parent.treeGrid.getRows()[rowIndex as number];
                }
                const childElement : Element | string = this.getChildElement(rowElement, isTab);
                return childElement;
            }
            nextElement = $target;
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
        const currentItem: IGanttData = this.parent.currentViewData[rowIndex as number];
        const expandedRecordIndex: number = expandedRecords.indexOf(currentItem);
        const nextRecord: IGanttData = isTab ? expandedRecords[expandedRecordIndex + 1] : expandedRecords[expandedRecordIndex - 1];
        const nextRowIndex: number = this.parent.currentViewData.indexOf(nextRecord);
        if (nextRecord) {
            return isChartRow ? this.parent.treeGrid.getRows()[nextRowIndex as number] : this.parent.getRowByIndex(nextRowIndex);
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
     * @param {string} keyAction .
     * @returns {void} .
     */
    public manageFocus(element: HTMLElement, focus: string, isChartElement?: boolean, keyAction?: string): void {
        if (isChartElement) {
            let childElement: Element = null;
            if (element.classList.contains('e-left-label-container') ||
                element.classList.contains('e-right-label-container')) {
                childElement = element.getElementsByTagName('span')[0];
            } else if (element.classList.contains('e-taskbar-main-container')
                || element.classList.contains('e-gantt-child-taskbar-inner-div')) {
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                const rowIndex: number = (closest(element, '.e-chart-row') as any).rowIndex;
                const data: IGanttData = this.parent.currentViewData[rowIndex as number];
                const className: string = data.hasChildRecords ? data.ganttProperties.isAutoSchedule ? 'e-gantt-parent-taskbar' :
                    'e-manualparent-main-container' :
                    data.ganttProperties.isMilestone ? 'e-gantt-milestone' : !isNullOrUndefined(data.ganttProperties.segments)
                        && data.ganttProperties.segments.length > 0 ? 'e-segmented-taskbar' : 'e-gantt-child-taskbar';
                childElement = element.getElementsByClassName(className)[0];
                if (isNullOrUndefined(childElement)) {
                    childElement = element;
                }
            }
            if (element.classList.contains('e-right-label-temp-container') || element.classList.contains('e-left-label-temp-container') || element.classList.contains('e-indicator-span') || element.classList.contains('e-timeline-header-container')) {
                if (focus === 'add') {
                    element.setAttribute('tabIndex', '0');
                    addClass([element], 'e-active-container');
                    element.focus();
                } else {
                    if (keyAction !== 'downArrow' && keyAction !== 'upArrow') {
                        removeClass([element], 'e-active-container');
                        element.setAttribute('tabIndex', '-1');
                        element.blur();
                    }
                }
            }
            if (focus === 'add' && !isNullOrUndefined(childElement)) {
                element.setAttribute('tabIndex', '0');
                addClass([childElement], 'e-active-container');
                element.focus();
                this.focusedElement = childElement as HTMLElement;
            } else if (!isNullOrUndefined(childElement) && (keyAction !== 'downArrow' && keyAction !== 'upArrow')) {
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
            if (this.parent.enableVirtualization && this.parent.enableMultiTaskbar) {
                recordIndex = this.parent.flatData.indexOf(record);
            }
            else {
                if (this.parent.pdfExportModule && this.parent.pdfExportModule.helper.exportProps
                    && this.parent.pdfExportModule.helper.exportProps.fitToWidthSettings
                    && this.parent.pdfExportModule.helper.exportProps.fitToWidthSettings.isFitToWidth
                    && this.parent.pdfExportModule.isPdfExport) {
                    recordIndex = this.parent.ids.indexOf(record.ganttProperties.taskId.toString());
                }
                else {
                    recordIndex = this.parent.currentViewData.indexOf(record);
                }
            }
        }
        return recordIndex;
    }

    private destroy(): void {
        this.removeEventListener();
        this.unWireEvents();
        this.rangeViewContainer = null;
        this.chartBodyContent = null;
        this.scrollElement = null;
        this.chartTimelineContainer = null;
        this.chartBodyContainer = null;
        if (!isNullOrUndefined(this.scrollObject)) {
            this.scrollObject.destroy();
            this.scrollObject = null;
        }
    }
}
