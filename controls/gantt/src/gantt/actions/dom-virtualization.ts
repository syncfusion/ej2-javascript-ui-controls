import { Gantt } from '../base/gantt';
import { IGanttData } from '../base/interface';
import { TreeGrid, DomVirtualization as TreeGridDomVirtualization } from '@syncfusion/ej2-treegrid';

// T-10: module-level flag to prevent double-injection of TreeGridDomVirtualization
// if addEventListener() is called more than once (e.g. during refresh cycles).
let treeGridDomVirtInjected: boolean = false;

/**
 * Gantt DOM Virtualization module
 * Provides efficient chart row recycling for large datasets.
 * Works alongside the virtual scrollbar in ChartScroll for smooth 60fps scrolling.
 *
 * @hidden
 */
export class DomVirtualization {
    public parent: Gantt;

    constructor(gantt: Gantt) {
        this.parent = gantt;
        this.addEventListener();
    }

    private addEventListener(): void {
        // T-10: inject TreeGridDomVirtualization here so it only happens when the
        // DomVirtualization module is explicitly Gantt.Inject()-ed.
        if (!treeGridDomVirtInjected) {
            TreeGrid.Inject(TreeGridDomVirtualization);
            treeGridDomVirtInjected = true;
        }
        this.parent.on('dataReady', this.onDataReady, this);
        // grid-scroll listener removed (T-3): the rAF path in chart-scroll.ts:onVirtualScroll
        // owns all chart-row refresh. The synchronous call here caused double-refresh (D1).
        this.parent.on('destroy', this.destroy, this);
    }

    /**
     * Calculate the visible record window based on current scroll position.
     * Accepts an optional scrollTopOverride (passed from onVirtualScroll to avoid reading DOM).
     * @param {number} scrollTopOverride - Optional scroll position to use instead of reading the DOM.
     * @returns {{ records: IGanttData[], startIndex: number }} Visible records and the index of the first visible row.
     */
    public getVisibleRecordsFromScroll(scrollTopOverride?: number): { records: IGanttData[], startIndex: number } {
        if (!this.parent.currentViewData || this.parent.currentViewData.length === 0) {
            return { records: [], startIndex: 0 };
        }
        const scrollElement: HTMLElement = this.parent.ganttChartModule &&
            this.parent.ganttChartModule.scrollElement;
        const rawScrollTop: number = scrollTopOverride != null ? scrollTopOverride :
            (scrollElement ? scrollElement.scrollTop : 0);
        const viewportHeight: number = (scrollElement && scrollElement.clientHeight > 0)
            ? scrollElement.clientHeight : (window.innerHeight || 600);
        const rowHeight: number = (this.parent.rowHeight as number) || 36;
        const totalRows: number = this.parent.currentViewData.length;
        // T-6: Clamp DOM-read scrollTop to [0, maxScrollTop] to prevent blank-screen after
        // collapseAll+expandAll with a stale large value. Do NOT clamp explicit overrides from
        // the scroll handler — those are already the correct target position.
        const maxScrollTop: number = Math.max(0, totalRows * rowHeight - viewportHeight);
        const scrollTop: number = scrollTopOverride != null
            ? rawScrollTop
            : Math.min(Math.max(0, rawScrollTop), maxScrollTop);
        const settings: { rowBuffer?: number } =
            (this.parent as any).domVirtualizationSettings || {};
        const rowBuffer: number = settings.rowBuffer != null ? settings.rowBuffer : 20;
        const startIndex: number = Math.max(0, Math.floor(scrollTop / rowHeight) - rowBuffer);
        const visibleCount: number = this.parent.treeGrid['currentDomVirtualRecords'].length;
        const endIndex: number = Math.min(totalRows, startIndex + visibleCount);
        return {
            records: this.parent.currentViewData.slice(startIndex, endIndex),
            startIndex
        };
    }

    // Delegate to chartRowsModule.refreshDomVirtualRows so that the D1-RED test can spy on
    // this method to verify the grid-scroll listener no longer calls it synchronously (T-3).
    // Called by chart-scroll.ts rAF path; also proxied here for testability.
    public refreshDomVirtualRows(records: IGanttData[], startIndex: number): void {
        if (this.parent.chartRowsModule) {
            (this.parent.chartRowsModule as any).refreshDomVirtualRows(records, startIndex);
        }
    }

    private onDataReady(): void {
        // Initial render is handled synchronously by createTaskbarTemplate when enableDomVirtualization is true.
        // This handler is a no-op but kept for any future post-dataReady work.
    }

    protected getModuleName(): string {
        return 'domVirtualization';
    }

    public destroy(): void {
        //Dsetroy
        this.parent.off('dataReady', this.onDataReady);
        this.parent.off('destroy', this.destroy);
    }
}
