import { formatUnit, EventHandler, getValue, isNullOrUndefined} from '@syncfusion/ej2-base';
import { Gantt } from '../base/gantt';
import { ScrollArgs } from '../base/interface';
import { NonWorkingDay } from '../renderer/nonworking-day';

/**
 * To handle scroll event on chart and from TreeGrid
 *
 * @hidden
 */
export class ChartScroll {
    private parent: Gantt;
    public element: HTMLElement;
    private isScrolling: number;
    private isFromTreeGrid: boolean;
    public previousCount: number = -1;
    public isBackwardScrolled: boolean;
    private nonworkingDayRender: NonWorkingDay;
    private isSetScrollLeft: boolean = false;
    public previousScroll: { top: number, left: number } = { top: 0, left: 0 };
    /**
     * Constructor for the scrolling.
     *
     * @param {Gantt} parent .
     * @hidden
     */
    constructor(parent: Gantt) {
        this.parent = parent;
        this.element = this.parent.ganttChartModule.scrollElement;
        this.addEventListeners();
    }
    /**
     * Bind event
     *
     * @returns {void} .
     */
    private addEventListeners(): void {
        this.parent.on('grid-scroll', this.gridScrollHandler, this);
        EventHandler.add(this.element, 'scroll' , this.onScroll, this);
        this.parent.treeGrid.grid.on('showGanttShimmer', this.updateShimmer, this);
        this.parent.treeGrid.grid.on('removeGanttShimmer', this.removeShimmer, this);
        this.element.addEventListener('wheel', (event) => {
            if (event.deltaY !== 0) {
                this.onWheelScroll(event);
            }
        });
    }
    /**
     * Unbind events
     *
     * @returns {void} .
     */
    private removeEventListeners(): void {
        EventHandler.remove(this.element, 'scroll', this.onScroll);
        this.parent.off('grid-scroll', this.gridScrollHandler);
        this.parent.treeGrid.grid.off('showGanttShimmer', this.updateShimmer);
        this.parent.treeGrid.grid.off('removeGanttShimmer', this.removeShimmer);
        EventHandler.remove(this.element, 'wheel', this.onWheelScroll);
    }
    /**
     *
     * @param {object} args .
     * @returns {void} .
     */
    private gridScrollHandler(args: object ): void {
        this.element.scrollTop = getValue('top', args);
        this.isFromTreeGrid = true;
    }
    /**
     * Method to update vertical grid line, holiday, event markers and weekend container's top position on scroll action
     *
     * @returns {void} .
     * @private
     */
    public updateContent(): void {
        let ganttElement: HTMLElement = this.parent.element;
        let currentCount: number = Math.round(this.element.scrollLeft / ganttElement.offsetWidth);
        if (this.previousCount != currentCount || this.parent.timelineModule['performedTimeSpanAction']) {
            this.deleteTableElements();
            this.parent.timelineModule.createTimelineSeries();
            if (this.parent.gridLines === 'Vertical' || this.parent.gridLines === 'Both') {
                this.parent['renderChartVerticalLines']();
            }
            if (this.parent.dayMarkersModule) {
                this.parent.dayMarkersModule['eventMarkerRender'].renderEventMarkers();
            }
            this.parent.timelineModule['performedTimeSpanAction'] = false;
            if (this.parent.dayMarkersModule) {
                this.parent.dayMarkersModule.nonworkingDayRender.renderWeekends();
                this.parent.dayMarkersModule.nonworkingDayRender.renderHolidays();
            }
            this.updateChartElementStyles();
            this.previousCount = currentCount;
            if (this.isSetScrollLeft) {
                this.parent.ganttChartModule.chartTimelineContainer.scrollLeft = this.element.scrollLeft;
            }
        }
    } 

    public getTimelineLeft(): number {
        let tLeft : number;
        let ganttElement: HTMLElement = this.parent.element;
        let resultantWidth: number = this.parent.timelineModule.wholeTimelineWidth > (ganttElement.offsetWidth * 3) ? this.parent.timelineModule.wholeTimelineWidth - ganttElement.offsetWidth * 3 : 0;
        if (this.element.scrollLeft == (this.parent.enableRtl ? -resultantWidth : resultantWidth)) {
            tLeft = this.element.scrollLeft;
        } else {
            let left: number = this.parent.enableRtl ? -this.element.scrollLeft : this.element.scrollLeft;
            tLeft = (left > ganttElement.offsetWidth) ? left - ganttElement.offsetWidth : 0;
        }
        if(tLeft >= resultantWidth ){
            tLeft = resultantWidth;
        }
        if((tLeft <= ganttElement.offsetWidth) && this.isBackwardScrolled){
            tLeft = 0;
        }
        if (this.parent.timelineModule.isZoomToFit || this.parent.timelineModule.isZooming) {
            tLeft = 0;
        }
        return tLeft;
    }
    
    public deleteTableElements(): void {
        const tableContainer: HTMLCollectionOf<Element> = this.parent.element.getElementsByClassName('e-timeline-header-table-container');
        do {
            tableContainer[0].remove();
        }
        while(tableContainer.length > 0)
        if (this.parent.element.querySelector('#ganttContainerline-container')) {
            this.parent.element.querySelector('#ganttContainerline-container').innerHTML = '';
        }
        if (this.parent.element.querySelector('.e-nonworking-day-container')) {
            this.parent.element.querySelector('.e-nonworking-day-container').outerHTML = null;
        }
      }

    public updateChartElementStyles(): void {
        let translateXValue: number = this.getTimelineLeft();
        if (this.parent.enableTimelineVirtualization) {
            // updating connector line & task table styles
            let dependencyViewer: HTMLElement =  this.parent.connectorLineModule.dependencyViewContainer;
            let taskTable: HTMLElement = this.parent.chartRowsModule.taskTable;
            if (!this.parent.enableRtl) {
                dependencyViewer.style.left = -translateXValue + "px";
                taskTable.style.left = -translateXValue + "px";
            }
            else {
                dependencyViewer.style.left = translateXValue + "px";
            }
            taskTable.style.width = this.parent.timelineModule.wholeTimelineWidth + "px";
        }
    }
    public updateTopPosition(): void {
        const content: HTMLElement = this.parent.treeGrid.element.querySelector('.e-content');
        const contentScrollTop: number = content.scrollTop;
        let scrollTop: number;
        if (this.parent.virtualScrollModule && this.parent.enableVirtualization) {
            const top: number = this.parent.virtualScrollModule.getTopPosition();
            scrollTop = contentScrollTop - top;
        } else {
            scrollTop = contentScrollTop;
        }
        if (!isNullOrUndefined(this.parent.dayMarkersModule)) {
            const holidayContainer: HTMLElement = getValue('nonworkingDayRender.holidayContainer', this.parent.dayMarkersModule);
            const weekendContainer: HTMLElement = getValue('nonworkingDayRender.weekendContainer', this.parent.dayMarkersModule);
            const eventMarkersContainer: HTMLElement = getValue('eventMarkerRender.eventMarkersContainer', this.parent.dayMarkersModule);
            if (holidayContainer) {
                holidayContainer.style.top = formatUnit(scrollTop);
            }
            if (weekendContainer) {
                weekendContainer.style.top = formatUnit(scrollTop);
            }
            if (eventMarkersContainer) {
                eventMarkersContainer.style.top = formatUnit(scrollTop);
            }
        }
        if (this.parent.chartVerticalLineContainer) {
            this.parent.chartVerticalLineContainer.style.top = formatUnit(scrollTop);
        }
    }
    private removeShimmer(): void {
        const parent: any = this.parent;
        setTimeout(function () {
            parent.hideMaskRow();
            if (!parent.allowTaskbarOverlap && parent.showOverAllocation) {
                for (let i: number = 0; i < parent.currentViewData.length; i++) {
                    const tr: Element = parent.chartRowsModule.ganttChartTableBody.childNodes[i as number];
                    if (tr['style'].display !== 'none' && parent.currentViewData[i as number].hasChildRecords && !parent.currentViewData[i as number].expanded) {
                        if (parent.ganttChartModule.isExpandAll || parent.ganttChartModule.isCollapseAll) {
                           parent.treeGrid.getRowByIndex(i as number)['style'].height = tr['style'].height;
                        }
                        else {
                            parent.treeGrid.getRows()[i as number]['style'].height = tr['style'].height;
                        }
                    }
                }
                parent.contentHeight = parent.enableRtl ? parent['element'].getElementsByClassName('e-content')[2].children[0]['offsetHeight'] :
                    parent['element'].getElementsByClassName('e-content')[0].children[0]['offsetHeight'];
                parent.element.getElementsByClassName('e-chart-rows-container')[0]['style'].height = parent.contentHeight + 'px';
            }
        }, 0);
    }
    private updateShimmer(): void {
        const parent: any = this.parent;
        setTimeout(function () {
            parent.showMaskRow();
        }, 0);
    }
    private updateSpinner(): void {
        const parent: any = this.parent;
        this.parent.showSpinner();
        window.clearTimeout(this.isScrolling);
        this.isScrolling = setTimeout(function () {
            parent.hideSpinner();
        }, 200);
    }
    private onWheelScroll(event: WheelEvent): void {
        event.preventDefault();
        const delta = event.deltaY;
        const scrollSpeed = 1;
        const targetElement = this.element;
        const gridElement = this.parent.treeGrid.element.querySelector('.e-content');
        const scrollStep = delta * scrollSpeed;
        const maxScrollTarget = targetElement.scrollHeight - targetElement.clientHeight;
        const maxScrollGrid = gridElement.scrollHeight - gridElement.clientHeight;
        const maxScroll = Math.min(maxScrollTarget, maxScrollGrid);
        const limitedScrollStep = Math.max(-maxScroll, Math.min(maxScroll, scrollStep));
        targetElement.scrollTop += limitedScrollStep;
        gridElement.scrollTop += limitedScrollStep;
    }
    /**
     * Scroll event handler
     *
     * @returns {void} .
     */
    private onScroll(): void {
        const scrollArgs: ScrollArgs = {};
        if (this.element.scrollTop !== this.previousScroll.top) {
            // eslint-disable-next-line
            !this.isFromTreeGrid ? this.parent.notify('chartScroll', { top: this.element.scrollTop }) : (this.isFromTreeGrid = false);
            scrollArgs.previousScrollTop = this.previousScroll.top;
            this.previousScroll.top = this.element.scrollTop;
            scrollArgs.scrollTop = this.element.scrollTop;
            scrollArgs.scrollDirection = 'Vertical';
            scrollArgs.action = 'VerticalScroll';
            this.updateTopPosition();
        }
        if (this.element.scrollLeft !== this.previousScroll.left) {
            this.isBackwardScrolled = (this.element.scrollLeft < this.previousScroll.left && !this.parent.enableRtl);
            this.parent.ganttChartModule.chartTimelineContainer.scrollLeft = this.element.scrollLeft;
            scrollArgs.previousScrollLeft = this.previousScroll.left;
            this.previousScroll.left = this.element.scrollLeft;
            scrollArgs.scrollLeft = this.element.scrollLeft;
            scrollArgs.scrollDirection = 'Horizontal';
            scrollArgs.action = 'HorizontalScroll';
            if (this.parent.enableTimelineVirtualization && this.parent.timelineModule.wholeTimelineWidth > this.parent.element.offsetWidth * 3) {
                this.isSetScrollLeft = true;
                if (this.parent.timelineModule.totalTimelineWidth > this.parent.element.offsetWidth * 3) {
                    this.updateContent();
                }
                this.parent.ganttChartModule.updateWidthAndHeight();
                if (this.parent.element.getElementsByClassName('e-weekend-container')[0]) {
                    this.parent.element.getElementsByClassName('e-weekend-container')[0]['style'].height = '100%';
                }
                if (this.parent.element.getElementsByClassName('e-holiday-container')[0]) {
                   this.parent.element.getElementsByClassName('e-holiday-container')[0]['style'].height = '100%';
                }
            }
        }
        this.parent.timelineModule['performedTimeSpanAction'] = false;
        if ((!isNullOrUndefined(scrollArgs.scrollDirection)) && (this.parent.enableVirtualization === true || this.parent.enableTimelineVirtualization === true) && (this.parent.isToolBarClick
            || isNullOrUndefined(this.parent.isToolBarClick))) {
            this.parent.isVirtualScroll = true;
            if (this.parent.showIndicator || isNullOrUndefined(this.parent.showIndicator)) {
                if (!this.parent.enableVirtualMaskRow && this.parent.enableVirtualization && this.parent.loadingIndicator.indicatorType === 'Spinner') {
                    this.updateSpinner();
                }
                else if (this.parent.enableTimelineVirtualization && !this.parent['isRowSelected'] && Math.abs(this.element.scrollLeft - scrollArgs.previousScrollLeft) > 1000) {
                    if (!this.parent.enableVirtualMaskRow && this.parent.loadingIndicator.indicatorType === 'Spinner') {
                        this.updateSpinner();
                    }
                    else {
                        this.parent.showMaskRow();
                        const parent: any = this;
                        setTimeout(function () {
                            parent.removeShimmer();
                        }, 0);
                    }
                }
                this.parent['isRowSelected'] = false;
            }
        }
        this.isSetScrollLeft = false;
        this.parent.isToolBarClick = true;
        scrollArgs.requestType = 'scroll';
        this.parent.trigger('actionComplete', scrollArgs);
    }
    /**
     * To set height for chart scroll container
     *
     * @param {string | number} height - To set height for scroll container in chart side
     * @returns {void} .
     * @private
     */
    public setHeight(height: string | number): void {
        this.element.style.height = formatUnit(height);
    }
    /**
     * To set width for chart scroll container
     *
     * @param {string | number} width - To set width to scroll container
     * @returns {void} .
     * @private
     */
    public setWidth(width: string | number): void {
        this.element.style.width = formatUnit(width);
    }
    /**
     * To set scroll top for chart scroll container
     *
     * @param {number} scrollTop - To set scroll top for scroll container
     * @returns {void} .
     * @private
     */
    public setScrollTop(scrollTop: number): void {
        this.element.scrollTop = scrollTop;
        this.parent.treeGrid.element.querySelector('.e-content').scrollTop = scrollTop;
    }
    /**
     * To set scroll left for chart scroll container
     *
     * @param {number} scrollLeft  - To set scroll left for scroll container
     * @param {number} leftSign - specifies left sign
     * @returns {void} .
     */
    public setScrollLeft(scrollLeft: number, leftSign?: number): void {
        if (leftSign) {
            scrollLeft = leftSign === -1 && this.parent.enableRtl ? -scrollLeft : scrollLeft;
        }
        this.isSetScrollLeft = true;
        this.element.scrollLeft = scrollLeft;
        this.parent.ganttChartModule.chartTimelineContainer.scrollLeft = this.element.scrollLeft;
        if (!this.parent.enableTimelineVirtualization || (!this.parent.enableTimelineVirtualization && this.parent.timelineModule.totalTimelineWidth > this.parent.element.offsetWidth * 3)) {
           this.previousScroll.left = this.element.scrollLeft;
        }
    }

    /**
     * Destroy scroll related elements and unbind the events
     *
     * @returns {void} .
     * @private
     */
    public destroy(): void {
        this.removeEventListeners();
    }
}
