import { TreeGrid } from '../base/treegrid';
import { Grid, VirtualScroll as GridVirtualScroll, NotifyArgs, ActionEventArgs, IGrid, ServiceLocator } from '@syncfusion/ej2-grids';
import { RenderType } from '@syncfusion/ej2-grids';
import { getValue, isNullOrUndefined } from '@syncfusion/ej2-base';
import * as events from '../base/constant';
import { ITreeData, RowCollapsedEventArgs } from '../base';
import { DataManager, Predicate, Query } from '@syncfusion/ej2-data';
import { getExpandStatus } from '../utils';
import { VirtualTreeContentRenderer } from '../renderer/virtual-tree-content-render';

/**
 * TreeGrid Virtual Scroll module will handle Virtualization
 *
 * @hidden
 */
export class VirtualScroll {
    private parent: TreeGrid;
    private expandCollapseRec: ITreeData;
    private prevstartIndex: number = -1;
    private prevendIndex: number = -1;
    private visualData: ITreeData[];

    /**
     * Constructor for VirtualScroll module
     *
     * @param {TreeGrid} parent - Tree Grid instance
     */
    constructor(parent?: TreeGrid) {
        this.parent = parent;
        Grid.Inject(TreeVirtual);
        this.addEventListener();
    }

    private returnVisualData(args: {data: Object[]}) : void {
        args.data = this.visualData;
    }
    /**
     * For internal use only - Get the module name.
     *
     * @private
     * @returns {string} - Returns VirtualScroll module name
     */
    protected getModuleName(): string {
        return 'virtualScroll';
    }
    /**
     * @hidden
     * @returns {void}
     */
    public addEventListener(): void {
        this.parent.on(events.localPagedExpandCollapse, this.collapseExpandVirtualchilds, this);
        this.parent.on(events.pagingActions, this.virtualPageAction, this);
    }
    /**
     * @hidden
     * @returns {void}
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.localPagedExpandCollapse, this.collapseExpandVirtualchilds);
        this.parent.off(events.pagingActions, this.virtualPageAction);
    }
    private collapseExpandVirtualchilds(row: { action: string, row: HTMLTableRowElement,
        record: ITreeData, args: RowCollapsedEventArgs }): void {
        this.parent.grid.notify(events.virtualActionArgs, { isExpandCollapse: true });
        this.expandCollapseRec = row.record;
        row.record.expanded = row.action === 'collapse' ? false : true;
        const ret: Object = {
            result: this.parent.flatData,
            row: row.row,
            action: row.action,
            record: row.record,
            count: this.parent.flatData.length
        };
        this.parent.grid.clearSelection();
        const requestType: string = getValue('isCollapseAll', this.parent) ? 'collapseAll' : 'refresh';
        getValue('grid.renderModule', this.parent).dataManagerSuccess(ret, <NotifyArgs>{ requestType: requestType });
    }
    private virtualPageAction(pageingDetails: {result: ITreeData[], count: number, actionArgs: ActionEventArgs}): void {
        const dm: DataManager = new DataManager(pageingDetails.result);
        const expanded: Predicate = new Predicate('expanded', 'notequal', null).or('expanded', 'notequal', undefined);
        const parents: ITreeData[] = dm.executeLocal(new Query().where(expanded));
        const visualData: ITreeData[] = parents.filter((e: ITreeData) => {
            return getExpandStatus(this.parent, e, parents);
        });
        this.visualData = visualData;
        this.parent.grid.notify(events.dataListener, {data: visualData});
        const counts: {startIndex: number, endIndex: number, count: number} = { startIndex: -1, endIndex: -1, count: pageingDetails.count };
        this.parent.grid.notify(events.indexModifier, counts);
        let startIndex: number = counts.startIndex;
        let endIndex: number = counts.endIndex;
        pageingDetails.count = visualData.length;
        if (startIndex === -1 && endIndex === -1) {
            let query: Query = new Query();
            const size: number = this.parent.grid.pageSettings.pageSize;
            const current: number = this.parent.grid.pageSettings.currentPage;
            const skip: number = size * (current - 1);
            query = query.skip(skip).take(size);
            dm.dataSource.json = visualData;
            pageingDetails.result = dm.executeLocal(query);
        } else {
            const requestType: string = pageingDetails.actionArgs.requestType;
            if (requestType === 'filtering' || requestType === 'collapseAll' ||
                (requestType === 'refresh' && this.parent.enableCollapseAll && endIndex > visualData.length)) {
                startIndex = 0;
                endIndex = this.parent.grid.pageSettings.pageSize - 1;
                (this.parent.grid.getContent() as HTMLElement).firstElementChild.scrollTop = 0;
                this.parent.grid.notify(events.virtualActionArgs, { setTop: true });
            }
            //if ((this.prevendIndex !== -1 && this.prevstartIndex !== -1) &&
            //this.prevendIndex === endIndex && this.prevstartIndex === startIndex) {
            if (!isNullOrUndefined(this.expandCollapseRec)) {
                const resourceCount: HTMLTableRowElement[] = this.parent.getRows();
                let sIndex: number = visualData.indexOf(this.expandCollapseRec);
                const tempdata: ITreeData[] = visualData.slice(sIndex, sIndex + resourceCount.length);
                if (tempdata.length < resourceCount.length && sIndex >= 0) {
                    sIndex = visualData.length - resourceCount.length;
                    sIndex = sIndex > 0 ? sIndex : 0;
                    startIndex = sIndex;
                    endIndex = visualData.length;
                } else if ( getValue('isCollapseAll', this.parent)) {
                    startIndex = 0;
                    endIndex = this.parent.grid.pageSettings.pageSize - 1;
                    this.parent.grid.notify(events.virtualActionArgs, { setTop: true });
                }
            }
            //}
            if (!isNullOrUndefined(this.expandCollapseRec) && this.parent.enableCollapseAll) {
                if (pageingDetails.count < this.parent.getRows()[0].getBoundingClientRect().height) {
                    startIndex = visualData[0].index;
                } else {
                    startIndex = this.prevstartIndex === -1 ? 0 : this.prevstartIndex;
                }
            }
            this.expandCollapseRec = null;
            pageingDetails.result = visualData.slice(startIndex, endIndex);
            this.prevstartIndex = startIndex;
            this.prevendIndex = endIndex;
        }
        this.parent.notify('updateAction', pageingDetails);
    }
    /**
     * To destroy the virtualScroll module
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
    }
}

export class TreeVirtual extends GridVirtualScroll {
    constructor(parent: IGrid, locator?: ServiceLocator) {
        super(parent, locator);
        getValue('parent', this).off('initial-load', getValue('instantiateRenderer', this), this);
        getValue('parent', this).on('initial-load', this.instantiateRenderers, this);
    }
    public getModuleName(): string {
        return 'treeVirtualScroll';
    }
    protected instantiateRenderers(): void {
        getValue('parent', this).log(['limitation', 'virtual_height'], 'virtualization');
        const renderer: Object = getValue('locator', this).getService('rendererFactory');
        getValue('addRenderer', renderer)
            .apply(renderer, [RenderType.Content, new VirtualTreeContentRenderer(getValue('parent', this), getValue('locator', this))]);
        //renderer.addRenderer(RenderType.Content, new VirtualTreeContentRenderer(getValue('parent', this), getValue('locator', this)));
        this.ensurePageSize();
    }
    public ensurePageSize(): void {
        const parentGrid: IGrid = getValue('parent', this);
        const rowHeight: number = parentGrid.getRowHeight();
        if (!isNullOrUndefined(parentGrid.height) && typeof (parentGrid.height) === 'string' && parentGrid.height.indexOf('%') !== -1) {
            parentGrid.element.style.height = parentGrid.height;
        }
        const vHeight: string | number = parentGrid.height.toString().indexOf('%') < 0 ? parentGrid.height :
            parentGrid.element.getBoundingClientRect().height;
        const blockSize: number = ~~(<number>vHeight / rowHeight);
        const height: number = blockSize * 2;
        const size: number = parentGrid.pageSettings.pageSize;
        parentGrid.setProperties({ pageSettings: { pageSize: size < height ? height : size } }, true);
    }
}
