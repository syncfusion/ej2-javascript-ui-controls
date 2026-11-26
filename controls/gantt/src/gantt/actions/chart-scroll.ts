import { formatUnit, EventHandler, getValue, isNullOrUndefined, createElement} from '@syncfusion/ej2-base';
import { Gantt } from '../base/gantt';
import { ScrollArgs, IGanttData  } from '../base/interface';
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
    // Scroll arrow handling properties
    private isScrollArrowPressed: boolean = false;
    private scrollArrowDirection: 'left' | 'right' | null = null;
    private scrollArrowInterval: number = 0;
    private lastScrollLeft: number = 0;
    private virtualScrollbar: HTMLElement;
    private virtualScrollbarInner: HTMLElement;
    private pendingScrollRaf: number = 0;
    private latestScrollTop: number = 0;
    private latestFromTreeGrid: boolean = false;
    public currentScrollTop: number = 0;
    public isDomVirtualScrolling: boolean = false;
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
        // T-9 follow-on: also guard virtual scrollbar setup so it is skipped when
        // DomVirtualization was NOT injected (domVirtualizationModule is undefined).
        if ((this.parent as any).enableDomVirtualization && (this.parent as any).domVirtualizationModule) {
            this.setupVirtualScrollbar();
            EventHandler.add(this.virtualScrollbar, 'scroll', this.onVirtualScroll, this);
            EventHandler.add(this.element, 'wheel', this.onChartWheel, this);
            EventHandler.add(this.virtualScrollbar, 'pointerup', this.virtualScrollStop, this);
            EventHandler.add(this.element, 'scroll', this.onHorizontalScroll, this);
        } else {
            EventHandler.add(this.element, 'scroll', this.onScroll, this);
        }
        // Use pointerdown for consistent mouse + touch handling
        EventHandler.add(this.element, 'pointerdown', this.startHold, this);
        // Use pointerup (not mouseup) to handle both mouse and touch releases consistently
        EventHandler.add(this.element, 'pointerup', this.stopHold, this);
        // Also listen for pointercancel to handle cases where touch is interrupted (swipe, system gesture)
        EventHandler.add(this.element, 'pointercancel', this.stopHold, this);
        this.parent.treeGrid.grid.on('showGanttShimmer', this.updateShimmer, this);
        this.parent.treeGrid.grid.on('removeGanttShimmer', this.removeShimmer, this);
        this.parent.treeGrid.grid.on('virtualTransform', this.transformChange, this);
    }
    private virtualScrollStop(): void {
        if (this.parent.enableDomVirtualization) {
            this.isDomVirtualScrolling = false;
        }
    }
    /**
     * Unbind events
     *
     * @returns {void} .
     */
    private removeEventListeners(): void {
        if ((this.parent as any).enableDomVirtualization) {
            if (this.virtualScrollbar) {
                EventHandler.remove(this.virtualScrollbar, 'scroll', this.onVirtualScroll);
                EventHandler.remove(this.virtualScrollbar, 'pointerup', this.virtualScrollStop);
                if (this.virtualScrollbar.parentNode) {
                    this.virtualScrollbar.parentNode.removeChild(this.virtualScrollbar);
                }
                this.virtualScrollbar = null;
                this.virtualScrollbarInner = null;
            }
            EventHandler.remove(this.element, 'wheel', this.onChartWheel);
            EventHandler.remove(this.element, 'scroll', this.onHorizontalScroll);
            this.element.style.overflowY = '';
            this.element.style.width = '';
            this.element.style.marginLeft = '';
            if (this.pendingScrollRaf) {
                cancelAnimationFrame(this.pendingScrollRaf);
                this.pendingScrollRaf = 0;
            }
        } else {
            EventHandler.remove(this.element, 'scroll', this.onScroll);
        }
        EventHandler.remove(this.element, 'pointerdown', this.startHold);
        EventHandler.remove(this.element, 'pointerup', this.stopHold);
        EventHandler.remove(this.element, 'pointercancel', this.stopHold);
        this.parent.off('grid-scroll', this.gridScrollHandler);
        this.parent.treeGrid.grid.off('showGanttShimmer', this.updateShimmer);
        this.parent.treeGrid.grid.off('removeGanttShimmer', this.removeShimmer);
        this.parent.treeGrid.grid.off('virtualTransform', this.transformChange);
    }
    /**
     *
     * @param {object} args .
     * @returns {void} .
     */
    private gridScrollHandler(args: object ): void {
        const top: number = getValue('top', args);
        this.isFromTreeGrid = true;
        if ((this.parent as any).enableDomVirtualization && this.virtualScrollbar) {
            this.virtualScrollbar.scrollTop = top;
            // Apply translateY synchronously here too — programmatic scrollTop assignments
            // may be coalesced by the browser on fast thumb drags, causing the scroll event
            // on virtualScrollbar to fire fewer times than expected (white space on fast scroll).
            if (this.parent.chartRowsModule && (this.parent.chartRowsModule as any).taskTable) {
                const rowH: number = (this.parent.rowHeight as number) || 36;
                const domVirtSettings: { rowBuffer?: number } =
                    (this.parent as any).domVirtualizationSettings || {};
                const rowBuf: number = domVirtSettings.rowBuffer != null ? domVirtSettings.rowBuffer : 20;
                const startIdx: number = Math.max(0, Math.floor(top / rowH) - rowBuf);
                (this.parent.chartRowsModule as any).taskTable.style.transform =
                    'translateY(' + (startIdx * rowH) + 'px)';
            }
        } else {
            this.element.scrollTop = top;
        }
    }
    /**
     * Method to update vertical grid line, holiday, event markers and weekend container's top position on scroll action
     *
     * @returns {void} .
     * @private
     */
    public updateContent(): void {
        const ganttElement: HTMLElement = this.parent.element;
        const currentCount: number = Math.round(this.element.scrollLeft / ganttElement.offsetWidth);
        if (this.previousCount !== currentCount || this.parent.timelineModule['performedTimeSpanAction'] || this.parent.timelineModule.isZoomingAction) {
            this.parent.timelineModule.isZoomingAction = false;
            this.deleteTableElements();
            this.parent.timelineModule.createTimelineSeries();
            if (!this.parent.isLoad && this.parent.isReact && !isNullOrUndefined(this.parent.timelineTemplate)) {
                this.parent.renderTemplates();
            }
            else {
                void 0;
            }
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
        else {
            void 0;
        }
    }

    public getTimelineLeft(): number {
        let tLeft : number;
        const ganttElement: HTMLElement = this.parent.element;
        const resultantWidth: number = this.parent.timelineModule.wholeTimelineWidth > (ganttElement.offsetWidth * 3) ?
            this.parent.timelineModule.wholeTimelineWidth - ganttElement.offsetWidth * 3 : 0;
        if (this.element.scrollLeft === (this.parent.enableRtl ? -resultantWidth : resultantWidth)) {
            tLeft = this.element.scrollLeft;
        } else {
            const left: number = this.parent.enableRtl ? -this.element.scrollLeft : this.element.scrollLeft;
            tLeft = (left > ganttElement.offsetWidth) ? left - ganttElement.offsetWidth : 0;
        }
        if (tLeft >= resultantWidth ) {
            tLeft = resultantWidth;
        }
        if ((tLeft <= ganttElement.offsetWidth) && this.isBackwardScrolled) {
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
        while (tableContainer.length > 0);
        if (this.parent.element.querySelector('#ganttContainerline-container')) {
            this.parent.element.querySelector('#ganttContainerline-container').innerHTML = '';
        }
        if (this.parent.element.querySelector('.e-nonworking-day-container')) {
            this.parent.element.querySelector('.e-nonworking-day-container').outerHTML = null;
        }
    }

    public updateChartElementStyles(): void {
        const translateXValue: number = this.getTimelineLeft();
        if (this.parent.enableTimelineVirtualization) {
            // updating connector line & task table styles
            const dependencyViewer: HTMLElement =  this.parent.connectorLineModule.dependencyViewContainer;
            const taskTable: HTMLElement = this.parent.chartRowsModule.taskTable;
            if (!this.parent.enableRtl) {
                dependencyViewer.style.left = -translateXValue + 'px';
                taskTable.style.left = -translateXValue + 'px';
            }
            else {
                dependencyViewer.style.left = translateXValue + 'px';
                taskTable.style.right = -translateXValue + 'px';
            }
            taskTable.style.width = this.parent.timelineModule.wholeTimelineWidth + 'px';
        }
    }
    /**
     * Creates the virtual scrollbar element — the single native scroll source for DOM virt mode.
     * Chart content becomes overflow:hidden; the virtual scrollbar's scroll event drives all scroll.
     * @returns {void}
     */
    private setupVirtualScrollbar(): void {
        this.element.style.overflowY = 'hidden';
        // Measure native scrollbar width at runtime (0 on macOS overlay scrollbars).
        const probeStyle: string = 'position:absolute;visibility:hidden;overflow-y:scroll;width:50px;height:50px;';
        const probe: HTMLElement = createElement('div', { styles: probeStyle });
        document.body.appendChild(probe);
        const sbWidth: number = probe.offsetWidth - probe.clientWidth || 15;
        document.body.removeChild(probe);
        const side: string = this.parent.enableRtl ? 'left' : 'right';
        this.element.style.width = 'calc(100% - ' + sbWidth + 'px)';
        if (this.parent.enableRtl) {
            this.element.style.marginLeft = sbWidth + 'px';
        }
        const container: HTMLElement = this.element.parentElement;
        if (container.style.position !== 'relative' && container.style.position !== 'absolute') {
            container.style.position = 'relative';
        }
        this.virtualScrollbar = createElement('div', { className: 'e-gantt-virtual-scrollbar' });
        this.virtualScrollbar.style.cssText =
            'position:absolute;' + side + ':0;top:0;width:' + sbWidth + 'px;' +
            'height:100%;overflow-y:scroll;overflow-x:hidden;z-index:5;';
        this.virtualScrollbarInner = createElement('div', { className: 'e-gantt-virtual-scrollbar-inner' });
        this.virtualScrollbarInner.style.width = '1px';
        this.virtualScrollbar.appendChild(this.virtualScrollbarInner);
        container.appendChild(this.virtualScrollbar);
        this.updateVirtualScrollbarHeight();
    }

    /**
     * Sync virtual scrollbar inner height and chartBodyContent height to the full virtual content height.
     * In DOM virt mode the virtual height = all expanded records × rowHeight (NOT parent.contentHeight,
     * which reflects only the rendered DOM rows and is undefined in dom-virt mode).
     * Call whenever the expanded record set changes (data load, expand/collapse, filter).
     * @returns {void}
     */
    public updateVirtualScrollbarHeight(): void {
        let virtualH: number = 0;
        if ((this.parent as any).enableDomVirtualization) {
            const rowCount: number = this.parent.currentViewData ? this.parent.currentViewData.length : 0;
            const rowH: number = (this.parent.rowHeight as number) || 36;
            virtualH = rowCount * rowH;
        } else {
            virtualH = (this.parent as any).contentHeight || 0;
        }
        if (virtualH <= 0) { return; }
        const chartBodyContent: HTMLElement = this.parent.ganttChartModule &&
            this.parent.ganttChartModule.chartBodyContent;
        if (chartBodyContent) {
            // chartBodyContent defines the element's true scroll range — must NOT include the
            // horizontal-scrollbar padding or it stretches the container (breaking height:100%
            // on the virtual scrollbar's outer div).
            chartBodyContent.style.height = virtualH + 'px';
        }
        if (this.virtualScrollbarInner) {
            // The virtual scrollbar's inner height is padded by the horizontal scrollbar
            // height so the two scroll ranges match:
            //   vscroll max scrollTop = innerH - vscroll.clientHeight
            //   element  max scrollTop = virtualH - element.clientHeight
            // When a horizontal scrollbar is present, element.clientHeight < vscroll.clientHeight
            // by the scrollbar track height, so innerH must be virtualH + that difference.
            // We approximate the difference as element.offsetHeight - element.clientHeight.
            let innerH: number = virtualH;
            if ((this.parent as any).enableDomVirtualization && this.element) {
                const hScrollbarHeight: number = this.element.offsetHeight - this.element.clientHeight;
                if (hScrollbarHeight > 0) { innerH += hScrollbarHeight; }
            }
            this.virtualScrollbarInner.style.height = innerH + 'px';
        }
    }

    /**
     * Main scroll handler — fires on the virtual scrollbar element (the only native scroll source).
     * Sets element.scrollTop to clip content (overflow:hidden — no scroll event fires on element).
     * Defers row recycling and tree grid sync to rAF so they never block the visual frame.
     * @returns {void}
     */
    private onVirtualScroll(): void {
        if (!this.virtualScrollbar) { return; }
        const scrollTop: number = this.virtualScrollbar.scrollTop;
        const wasFromTreeGrid: boolean = this.isFromTreeGrid;
        this.isFromTreeGrid = false;

        const hadVerticalScroll: boolean = scrollTop !== this.previousScroll.top;
        const prevTop: number = this.previousScroll.top;

        if (hadVerticalScroll) {
            this.previousScroll.top = scrollTop;
            this.currentScrollTop = scrollTop;
            this.updateTopPositionDomVirt(scrollTop);
            // Move taskTable synchronously so the chart rows track the scrollbar
            // with zero visual lag. Row add/remove stays deferred in rAF.
            const domVirtModuleSync: any = (this.parent as any).domVirtualizationModule;
            if (domVirtModuleSync && this.parent.chartRowsModule &&
                    (this.parent.chartRowsModule as any).taskTable) {
                const rowHSync: number = (this.parent.rowHeight as number) || 36;
                const settingsSync: { rowBuffer?: number } =
                    (this.parent as any).domVirtualizationSettings || {};
                const rowBufferSync: number = settingsSync.rowBuffer != null ? settingsSync.rowBuffer : 20;
                const startIndexSync: number = Math.max(0, Math.floor(scrollTop / rowHSync) - rowBufferSync);
                (this.parent.chartRowsModule as any).taskTable.style.transform =
                    'translateY(' + (startIndexSync * rowHSync) + 'px)';
            }
        }

        // Always update the shared latest values so the rAF sees the most recent position.
        this.latestScrollTop = scrollTop;
        this.latestFromTreeGrid = wasFromTreeGrid;

        // Do NOT cancel a pending rAF — let it fire once per frame using latestScrollTop.
        // Cancelling on every event means the rAF never fires during fast thumb drags,
        // leaving stale rows that do not cover the visible area (white space).
        if (!this.pendingScrollRaf) {
            this.pendingScrollRaf = requestAnimationFrame(() => {
                this.pendingScrollRaf = 0;
                if (!this.parent.element) { return; }
                const rafScrollTop: number = this.latestScrollTop;
                const rafFromTreeGrid: boolean = this.latestFromTreeGrid;
                this.element.scrollTop = rafScrollTop;
                const domVirtModule: any = (this.parent as any).domVirtualizationModule;
                if (domVirtModule && this.parent.chartRowsModule) {
                    const result: { records: IGanttData[], startIndex: number } =
                        domVirtModule.getVisibleRecordsFromScroll(rafScrollTop);
                    if (result.records.length > 0) {
                        const previousStartIndex: number =
                            (this.parent.chartRowsModule as any).domVirtPrevStartIndex;
                        const viewportChanged: boolean = this.parent.enableDomVirtualization &&
                            result.startIndex !== previousStartIndex;
                        if (viewportChanged) {
                            this.isDomVirtualScrolling = true;
                        }
                        this.parent.chartRowsModule.refreshDomVirtualRows(result.records, result.startIndex);
                        if (!viewportChanged) {
                            this.isDomVirtualScrolling = false;
                        }
                        if (this.parent.queryTaskbarInfo) {
                            this.parent.chartRowsModule.triggerQueryTaskbarInfoForWindow(result.startIndex);
                        }
                        if (this.parent.taskFields && this.parent.taskFields.dependency) {
                            this.parent.ganttChartModule.reRenderConnectorLines();
                        }
                        if (this.parent.enableCriticalPath && this.parent.criticalPathModule &&
                                (this.parent.criticalPathModule as any).criticalPathCollection) {
                            const cp: any = this.parent.criticalPathModule;
                            const cpColl: any = cp.criticalPathCollection;
                            const dpColl: any = cp.detailPredecessorCollection;
                            const predIds: any = cp.predecessorCollectionTaskIds;
                            cp.criticalConnectorLine(cpColl, dpColl, true, predIds);
                        }
                        this.parent.renderTemplates();
                    }
                }
                if (!rafFromTreeGrid && this.parent.element) {
                    this.parent.notify('chartScroll', { top: rafScrollTop });
                }
                if (this.parent.domVirtualizationModule) {
                    this.parent.treeGridModule['restoreDomVirtualSelection']();
                }
            });
        }
        this.parent.timelineModule['performedTimeSpanAction'] = false;
        this.parent.isToolBarClick = true;
        if (hadVerticalScroll && !wasFromTreeGrid) {
            const scrollArgs: ScrollArgs = {
                requestType: 'scroll',
                scrollDirection: 'Vertical',
                action: 'VerticalScroll',
                scrollTop: scrollTop,
                previousScrollTop: prevTop
            };
            this.parent.trigger('actionComplete', scrollArgs);
        }
        this.parent.timelineModule.isZoomOut = false;
    }

    /**
     * Forward wheel events from the chart content area to the virtual scrollbar.
     * Only intercepts vertical-dominant gestures; horizontal gestures (touchpad
     * two-finger swipe) are left for the browser to handle as native scrollLeft.
     * @param {WheelEvent} e - The wheel event from the chart content area.
     * @returns {void}
     */
    private onChartWheel(e: WheelEvent): void {
        if (!this.virtualScrollbar) { return; }
        const absX: number = Math.abs(e.deltaX);
        const absY: number = Math.abs(e.deltaY);
        if (absX > absY) {
            // Horizontal-dominant gesture — let browser scroll element.scrollLeft natively;
            // onHorizontalScroll will sync the timeline header.
            const scrollArgs: ScrollArgs = {};
            this.onScrollHelper(scrollArgs);
            return;
        }
        e.preventDefault();
        const delta: number = e.deltaMode === 1 ? e.deltaY * 33 : e.deltaMode === 2 ? e.deltaY * 300 : e.deltaY;
        this.virtualScrollbar.scrollTop += delta;
    }

    /**
     * Reposition overlay elements using the already-known scrollTop.
     * Never reads content.scrollTop — avoids FSL after TreeGrid DOM mutations.
     * @param {number} scrollTop - The current virtual scroll position in pixels.
     * @returns {void}
     */
    private updateTopPositionDomVirt(scrollTop: number): void {
        if (!isNullOrUndefined(this.parent.dayMarkersModule)) {
            const holidayContainer: HTMLElement =
                getValue('nonworkingDayRender.holidayContainer', this.parent.dayMarkersModule);
            const weekendContainer: HTMLElement =
                getValue('nonworkingDayRender.weekendContainer', this.parent.dayMarkersModule);
            const eventMarkersContainer: HTMLElement =
                getValue('eventMarkerRender.eventMarkersContainer', this.parent.dayMarkersModule);
            if (holidayContainer) { holidayContainer.style.top = formatUnit(scrollTop); }
            if (weekendContainer) { weekendContainer.style.top = formatUnit(scrollTop); }
            if (eventMarkersContainer) { eventMarkersContainer.style.top = formatUnit(scrollTop); }
        }
        if (this.parent.sCurveModule) {
            this.parent.sCurveModule.updateTop(scrollTop);
        }
        if (this.parent.chartVerticalLineContainer) {
            this.parent.chartVerticalLineContainer.style.top = formatUnit(scrollTop);
        }
    }
    public updateTopPosition(): void {
        if ((this.parent as any).enableDomVirtualization) {
            return;
        }
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
        if (this.parent.sCurveModule) {
            this.parent.sCurveModule.updateTop(scrollTop);
        }
        if (this.parent.chartVerticalLineContainer) {
            this.parent.chartVerticalLineContainer.style.top = formatUnit(scrollTop);
        }
    }
    private removeShimmer(): void {
        const parent: Gantt = this.parent;
        setTimeout(() => {
            parent.hideMaskRow();
            if (!parent.allowTaskbarOverlap && parent.showOverAllocation && !(parent as any).enableDomVirtualization) {
                for (let i: number = 0; i < parent.currentViewData.length; i++) {
                    // T-12: null-guard both the chart body node and the tree-grid row.
                    const tr: ChildNode = parent.chartRowsModule.ganttChartTableBody.childNodes[i as number];
                    if (!tr) { continue; }
                    if (tr['style'].display !== 'none' && parent.currentViewData[i as number].hasChildRecords && !parent.currentViewData[i as number].expanded) {
                        if (parent.ganttChartModule.isExpandAll || parent.ganttChartModule.isCollapseAll) {
                            const treeRow: Element | null = parent.treeGrid.getRowByIndex(i as number);
                            if (treeRow) { treeRow['style'].height = tr['style'].height; }
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
    private transformChange(): void {
        this.parent.ganttChartModule.virtualRender.adjustTable();
        this.parent.ganttChartModule.scrollObject.updateTopPosition();
    }
    private updateShimmer(): void {
        const parent: Gantt = this.parent;
        setTimeout(() => {
            parent.showMaskRow();
        }, 0);
    }
    private updateSpinner(): void {
        const parent: Gantt = this.parent;
        this.parent.showSpinner();
        window.clearTimeout(this.isScrolling);
        this.isScrolling = setTimeout(() => {
            parent.hideSpinner();
        }, 200);
    }
    /**
     * Scroll event handler
     *
     * @returns {void}
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
        this.onScrollHelper(scrollArgs);
    }

    private onHorizontalScroll(): void {
        if (this.element.scrollLeft === this.previousScroll.left) { return; }
        const scrollArgs: ScrollArgs = {};
        this.onScrollHelper(scrollArgs);
    }
    private onScrollHelper(scrollArgs: ScrollArgs): void {
        if (this.element.scrollLeft !== this.previousScroll.left) {
            // In RTL, the visual scroll direction is opposite for `scrollLeft` comparison
            // (browser-specific behavior). Flip the comparison when RTL is enabled.
            this.isBackwardScrolled = this.parent.enableRtl ?
                (this.element.scrollLeft > this.previousScroll.left) :
                (this.element.scrollLeft < this.previousScroll.left);
            this.parent.ganttChartModule.chartTimelineContainer.scrollLeft = this.element.scrollLeft;
            scrollArgs.previousScrollLeft = this.previousScroll.left;
            this.previousScroll.left = this.element.scrollLeft;
            scrollArgs.scrollLeft = this.element.scrollLeft;
            scrollArgs.scrollDirection = 'Horizontal';
            scrollArgs.action = 'HorizontalScroll';
            if (this.parent.enableTimelineVirtualization && this.parent.timelineModule.wholeTimelineWidth >
                this.parent.element.offsetWidth * 3) {
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
            else if (this.parent.enableTimelineVirtualization && this.parent.timelineModule.wholeTimelineWidth <
                this.parent.element.offsetWidth * 3) {
                this.parent.connectorLineModule.svgObject.setAttribute('width', '100%');
            }
            if (this.parent.enableInfiniteTimelineScroll && !this.parent.timelineModule.isZoomedToFit &&
                !this.parent.ganttChartModule.scrollObject.isBackwardScrolled) {
                this.parent.timelineModule.handleInfiniteTimelineScroll('right');
            }
            if (!isNullOrUndefined(document.body.className) && document.body.className.includes('e-bigger') &&
                this.parent.enableInfiniteTimelineScroll) {
                this.trimTimelines();
            }
        }
        this.parent.timelineModule['performedTimeSpanAction'] = false;
        if (!(this.parent.enableDomVirtualization && this.parent.domVirtualizationModule)) {
            if ((!isNullOrUndefined(scrollArgs.scrollDirection)) && (this.parent.enableVirtualization === true ||
                this.parent.enableTimelineVirtualization === true) && (this.parent.isToolBarClick ||
                    isNullOrUndefined(this.parent.isToolBarClick))) {
                this.parent.isVirtualScroll = true;
                this.parent['isVirtualScrollAction'] = true;
                if (this.parent.showIndicator || isNullOrUndefined(this.parent.showIndicator)) {
                    if (scrollArgs.scrollDirection === 'Vertical' && !this.parent.enableVirtualMaskRow && this.parent.enableVirtualization && this.parent.loadingIndicator.indicatorType === 'Spinner') {
                        this.updateSpinner();
                    }
                    else if (this.parent.enableTimelineVirtualization && !this.parent['isRowSelected'] && Math.abs(this.element.scrollLeft - scrollArgs.previousScrollLeft) > 1000) {
                        if (!this.parent.enableVirtualMaskRow && this.parent.loadingIndicator.indicatorType === 'Spinner') {
                            this.updateSpinner();
                        }
                        else {
                            this.parent.showMaskRow();
                            setTimeout(() => {
                                this.removeShimmer();
                            }, 0);
                        }
                    }
                    this.parent['isRowSelected'] = false;
                }
            }
        }
        this.isSetScrollLeft = false;
        this.parent.isToolBarClick = true;
        scrollArgs.requestType = 'scroll';
        this.parent.trigger('actionComplete', scrollArgs);
        this.parent.timelineModule.isZoomOut = false;
    }
    /**
     * Handle mouse down on scroll element to detect scroll arrow clicks
     * This method detects when user clicks and holds scroll arrows (left or right)
     * and triggers continuous infinite timeline scrolling
     *
     * @param {MouseEvent} e - Mouse event
     * @returns {void}
     */
    private startHold(e: MouseEvent): void {
        if (!this.parent.enableInfiniteTimelineScroll || this.parent.timelineModule.isZoomedToFit) {
            return;
        }
        const scrollElement: HTMLElement = this.element;
        // Get scrollbar metrics for horizontal scrollbar
        const scrollbarHeight: number = 16; // Standard scrollbar height
        // Check if click is in the horizontal scrollbar area (bottom of element)
        const scrollbarTop: number = scrollElement.offsetHeight - scrollbarHeight;
        const isOnHorizontalScrollbar: boolean = e.clientY >= scrollElement.getBoundingClientRect().top + scrollbarTop;
        // Check if a horizontal scrollbar exists
        if (scrollElement.scrollWidth <= scrollElement.clientWidth) {
            // No horizontal scrollbar present
            return;
        }
        this.extendStartHold(isOnHorizontalScrollbar, e, scrollElement);
    }
    private extendStartHold(isOnHorizontalScrollbar: boolean, e: MouseEvent, scrollElement: HTMLElement): void {
        if (isOnHorizontalScrollbar) {
            this.isScrollArrowPressed = true;
            const rect: DOMRect = scrollElement.getBoundingClientRect() as DOMRect;
            if (e.clientX < rect.left + 30) {
                this.scrollArrowDirection = 'left';
                this.startContinuousScroll('left');
            } else if (e.clientX > rect.right - 30) {
                this.scrollArrowDirection = 'right';
                this.startContinuousScroll('right');
            }
        }
    }
    /**
     * Start continuous scrolling when scroll arrow is held
     * Triggers infinite timeline scroll methods at intervals
     *
     * @param {string} direction - Direction to scroll ('left' or 'right')
     * @returns {void}
     */
    private startContinuousScroll(direction: 'left' | 'right'): void {
        // Clear any existing interval
        if (this.scrollArrowInterval) {
            clearInterval(this.scrollArrowInterval);
        }
        // Start interval for continuous scrolling
        this.scrollArrowInterval = window.setInterval(() => {
            if (!this.isScrollArrowPressed) {
                clearInterval(this.scrollArrowInterval);
                this.scrollArrowInterval = 0;
                return;
            }
            this.extendContinuousScrolling(direction);
        }, 100); // Update every 100ms for smooth continuous scrolling
    }
    private extendContinuousScrolling(direction: 'left' | 'right'): void {
        if (direction === 'left') {
            // Trigger reverse infinite timeline scroll
            if (this.parent.enableInfiniteTimelineScroll && this.parent.timelineModule) {
                if (!this.parent.enableRtl) {
                    this.parent.timelineModule.handleInfiniteTimelineScroll('left');
                } else {
                    this.parent.timelineModule.handleInfiniteTimelineScroll('right');
                }
            }
        } else if (direction === 'right') {
            // Trigger forward infinite timeline scroll
            if (this.parent.enableInfiniteTimelineScroll && this.parent.timelineModule) {
                if (!this.parent.enableRtl) {
                    this.parent.timelineModule.handleInfiniteTimelineScroll('right');
                } else {
                    this.parent.timelineModule.handleInfiniteTimelineScroll('left');
                }
            }
        }
    }
    /**
     * Handle mouse up to stop scroll arrow continuous scrolling
     * This method is called when user releases the mouse button
     *
     * @param {MouseEvent} e - Mouse event
     * @returns {void}
     */
    private stopHold(e: MouseEvent): void {
        // Only perform infinite timeline trimming after a continuous scroll-arrow hold.
        if (!this.isScrollArrowPressed) {
            return;
        }
        this.isScrollArrowPressed = false;
        this.scrollArrowDirection = null;
        // Clear the continuous scroll interval
        if (this.scrollArrowInterval) {
            clearInterval(this.scrollArrowInterval);
            this.scrollArrowInterval = 0;
        }
        // Handle reverse (backward) infinite timeline trimming
        this.trimTimelines();
    }
    private trimTimelines(): void {
        if (this.parent.enableInfiniteTimelineScroll && !this.parent.timelineModule.isZoomedToFit &&
            this.parent.ganttChartModule.scrollObject.isBackwardScrolled) {
            this.parent.timelineModule.trimInfiniteTimelineRightCells();
        } else if (this.parent.enableInfiniteTimelineScroll && !this.parent.timelineModule.isZoomedToFit &&
            !this.parent.ganttChartModule.scrollObject.isBackwardScrolled) {
            this.parent.timelineModule.trimInfiniteTimelineLeftCells();
        }
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
        if (this.virtualScrollbar) {
            this.virtualScrollbar.style.height = formatUnit(height);
        }
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
        if (this.parent.enableVirtualization) {
            this.parent['isVirtualScrollAction'] = true;
        }
        if ((this.parent as any).enableDomVirtualization && this.virtualScrollbar) {
            this.virtualScrollbar.scrollTop = scrollTop;
            return;
        }
        this.element.scrollTop = scrollTop;
        if (!(this.parent as any).enableDomVirtualization) {
            const treeGridContent: HTMLElement = this.parent.treeGrid && this.parent.treeGrid.element ?
                this.parent.treeGrid.element.querySelector('.e-content') : null;
            if (treeGridContent) {
                treeGridContent.scrollTop = scrollTop;
            }
        }
    }
    /**
     * To set scroll left for chart scroll container
     *
     * @param {number} scrollLeft  - To set scroll left for scroll container
     * @param {number} leftSign - specifies left sign
     * @returns {void} .
     */
    public setScrollLeft(scrollLeft: number, leftSign?: number): void {
        scrollLeft = leftSign === -1 && this.parent.enableRtl ? -scrollLeft : scrollLeft;
        this.isSetScrollLeft = true;
        this.element.scrollLeft = scrollLeft;
        this.parent.ganttChartModule.chartTimelineContainer.scrollLeft = this.element.scrollLeft;
        if (!this.parent.enableTimelineVirtualization) {
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
