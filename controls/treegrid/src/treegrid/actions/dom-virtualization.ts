import { TreeGrid } from '../base/treegrid';
import { IGrid, RenderType, ServiceLocator, Grid, DomVirtualContentRenderer, modelChanged, ActionEventArgs } from '@syncfusion/ej2-grids';
import { DomVirtualization as GridDomVirtualization } from '@syncfusion/ej2-grids';
import { initialLoad, destroy } from '@syncfusion/ej2-grids';
import { DomVirtualTreeContentRenderer } from '../renderer/dom-virtual-tree-content-renderer';
import { getValue, initializeTelemetryFeature, isNullOrUndefined } from '@syncfusion/ej2-base';
import { ITreeData, RowCollapsedEventArgs } from '../base';
import * as events from '../base/constant';
import { DataManager, Query, QueryOptions } from '@syncfusion/ej2-data';
import { getExpandStatus, isOffline, isRemoteData } from '../utils';

/**
 * TreeGrid DOM Virtualization module handles high-performance rendering of large hierarchical datasets.
 *
 * @hidden
 */
export class DomVirtualization {
    private parent: TreeGrid;
    private locator: ServiceLocator;
    private visualData: ITreeData[];
    /** @hidden */
    public startIndex: number = -1;
    /** @hidden */
    public endIndex: number = -1;

    /**
     * Constructor for DomVirtualization module
     *
     * @param {TreeGrid} parent - TreeGrid instance
     * @param {ServiceLocator} locator - Service locator for dependency injection
     */
    constructor(parent: TreeGrid, locator?: ServiceLocator) {
        initializeTelemetryFeature('DomVirtualization', 'TreeGrid');
        this.parent = parent;
        this.locator = locator as ServiceLocator;
        Grid.Inject(DomVirtualTreeExtension);
        this.addEventListener();
    }


    public getModuleName(): string {
        return 'domVirtualization';
    }

    /**
     * @hidden
     * @returns {void}
     */
    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(destroy, this.destroy, this);
        this.parent.on(events.virtualExpandCollapse, this.collapseExpandVirtualchilds, this);
        this.parent.on(events.pagingActions, this.virtualPageAction, this);
        this.parent.grid.on(events.beforeDomVirtualRenderRows, this.updateCurrentDomVirtualRecords, this);
    }

    /**
     * @hidden
     * @returns {void}
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(destroy, this.destroy);
        this.parent.off(events.virtualExpandCollapse, this.collapseExpandVirtualchilds);
        this.parent.off(events.pagingActions, this.virtualPageAction);
        this.parent.grid.off(events.beforeDomVirtualRenderRows, this.updateCurrentDomVirtualRecords);
    }

    /**
     * Handles the action related to virtual scrolling with paging details.
     *
     * @param {Object} pageingDetails - Contains the result data, count of results, and action arguments.
     * @param {ITreeData[]} pageingDetails.result - The result data to be handled.
     * @param {number} pageingDetails.count - The count of results.
     * @param {ActionEventArgs} pageingDetails.actionArgs - The action arguments related to the virtual page action.
     * @returns {void}
     */
    private virtualPageAction(pageingDetails: { result: ITreeData[], count: number, actionArgs: ActionEventArgs }): void {
        const actionArgs: ActionEventArgs = getValue('actionArgs', pageingDetails.actionArgs);
        const action: string = getValue('action', pageingDetails.actionArgs);
        const isFiltering: boolean = (pageingDetails.actionArgs.requestType === 'filtering' && (pageingDetails.actionArgs.action !== 'clear-filter' && pageingDetails.actionArgs.action !== 'clearFilter')) ||
            (!isNullOrUndefined(this.parent['filterModule']) && (this.parent['filterModule'].filteredResult && (this.parent['filterModule'].filteredResult as object[]).length > 0));
        const isFlatHierarchy: boolean = this.parent.filterSettings.hierarchyMode === 'Child' ||
            this.parent.filterSettings.hierarchyMode === 'None';
        let parents: ITreeData[] = pageingDetails.result;
        parents = isFiltering && isFlatHierarchy ? parents.filter((e: ITreeData) => {
            if (isNullOrUndefined(e.parentItem)) {
                return true;
            }
            const hasParentInFilteredList: boolean = parents.some((p: ITreeData) => p.uniqueID === e.parentItem.uniqueID);
            return hasParentInFilteredList ? getExpandStatus(this.parent, e, parents) : true;
        }) : parents.filter((e: ITreeData) => getExpandStatus(this.parent, e, parents));
        this.parent.virtualDomScrollData = parents;
        const dm: DataManager = new DataManager(parents);
        this.visualData = parents;
        let query: Query = new Query();
        if (this.parent.allowPaging || this.parent.enableVirtualization) {
            let take: number = isNullOrUndefined(actionArgs.requestType) || actionArgs.requestType === 'dom-virtualscroll' ?
                (pageingDetails.actionArgs as any).result.length : pageingDetails.result.length;
            if (action === 'collapse') {
                take = this.parent.grid.currentViewData.length;
            }
            let skip: number = this.parent.grid.pageSettings.currentPage <= 1 ? 0 :
                (this.parent.grid.pageSettings.currentPage - 1) * this.parent.grid.pageSettings.pageSize;
            if (actionArgs.requestType === 'dom-virtualscroll') {
                const pagingQueries: QueryOptions[] = (pageingDetails.actionArgs && (pageingDetails.actionArgs as any).query
                    && ((pageingDetails.actionArgs as any).query as Query).queries) || [];
                const takeQuery: QueryOptions[] = pagingQueries.filter((q: QueryOptions) => q.fn === 'onTake');
                const explicitTake: QueryOptions = takeQuery.length > 0
                    ? takeQuery[parseInt((takeQuery.length - 1).toString(), 10)] : undefined;
                if (!isNullOrUndefined(explicitTake) && typeof (explicitTake.e as { nos: number }).nos === 'number') {
                    take = (explicitTake.e as { nos: number }).nos;
                }

            } else if ((actionArgs.requestType === 'filtering' || actionArgs.requestType === 'searching') && skip > 0) {
                skip = 0;
                this.parent.grid.setProperties({ pageSettings: { currentPage: 1 } }, true);
            }
            query = query.skip(skip).take(take);
        }
        dm.dataSource.json = this.visualData;
        pageingDetails.result = dm.executeLocal(query);
        pageingDetails.count = this.visualData.length;
        this.parent.notify('updateAction', pageingDetails);
    }

    private calculateChildCount(startIndex: number, level: number, records: ITreeData[]): number {
        let count: number = 0;
        for (let i: number = startIndex; i < records.length; i++) {
            if (records[i + 1] && (level === records[i + 1].level || level === records[i + 1].level + 1)) {
                break;
            }
            count++;
        }
        return count;
    }


    /**
     * Handles the virtual child collapse or expand action in a tree grid.
     *
     * @param {object} row - Object containing information about the collapse/expand action.
     * @param {string} row.action - The type of action, either "collapse" or "expand".
     * @param {HTMLTableRowElement} row.row - The HTML row element that is affected by the action.
     * @param {ITreeData} row.record - The tree data record associated with the row.
     * @param {RowCollapsedEventArgs} row.args - Additional event arguments related to the row collapse or expand.
     *
     * @returns {void} No return value as the function executes a procedure.
     */
    private collapseExpandVirtualchilds(row: {
        action: string, row: HTMLTableRowElement,
        record: ITreeData, args: RowCollapsedEventArgs
    }): void {
        const contentModule: DomVirtualContentRenderer = (this.parent.grid.contentModule as DomVirtualContentRenderer);
        const isRemote: boolean = isRemoteData(this.parent) && !isOffline(this.parent);
        const flatData: ITreeData[] = isRemote ? this.parent.getCurrentViewRecords() : this.parent.enableVirtualization ?
            this.parent.virtualDomScrollData.slice() : this.parent.grid.currentViewData.slice();
        const totalflatData: ITreeData[] = this.parent.infiniteScrollData;
        const uniqueIDCollpaseCollection: { [key: string]: ITreeData[] } = this.parent.uniqueIDCollpaseCollection;
        const startIndex: number = contentModule.currentStartIndex;
        if (getValue('isCollapseAll', this.parent) || getValue('isExpandAll', this.parent)) {
            if (row.action === 'collapse') {
                flatData.filter((e: ITreeData) => {
                    if (e.hasChildRecords) {
                        e.expanded = row.action === 'collapse' ? false : true;
                    }
                });
                flatData.splice(0, flatData.length, ...this.parent.parentData);
                // this.parent.pageSettings.totalRecordsCount = this.parent.parentData.length;
            } else {
                totalflatData.filter((e: ITreeData) => {
                    if (e.hasChildRecords) {
                        e.expanded = row.action === 'collapse' ? false : true;
                    }
                });
                flatData.splice(0, flatData.length, ...totalflatData);
                // this.parent.pageSettings.totalRecordsCount = totalflatData.length;
            }
        } else {
            row.record.expanded = row.action === 'collapse' ? false : true;
            for (let i: number = startIndex; i < flatData.length; i++) {
                if (row.record.uniqueID === flatData[parseInt(i.toString(), 10)].uniqueID &&
                    (row.record as ITreeData).childRecords.length > 0) {
                    if (row.action === 'collapse') {
                        const level: number = flatData[parseInt(i.toString(), 10)].level as number;
                        const count: number = this.calculateChildCount(i, level, flatData);
                        // this.parent.pageSettings.totalRecordsCount -= count;
                        uniqueIDCollpaseCollection[row.record.uniqueID] = flatData.splice(i + 1, count);
                    } else {
                        if (uniqueIDCollpaseCollection[row.record.uniqueID] && uniqueIDCollpaseCollection[row.record.uniqueID].length) {
                            flatData.splice(i + 1, 0, ...uniqueIDCollpaseCollection[row.record.uniqueID]);
                            // this.parent.pageSettings.totalRecordsCount += uniqueIDCollpaseCollection[row.record.uniqueID].length;
                        } else {
                            uniqueIDCollpaseCollection[row.record.uniqueID] = row.record.childRecords;
                            flatData.splice(i + 1, 0, ...uniqueIDCollpaseCollection[row.record.uniqueID]);
                            // this.parent.pageSettings.totalRecordsCount += uniqueIDCollpaseCollection[row.record.uniqueID].length;
                        }
                    }
                    break;
                }
            }
        }
        const actionDetails: Object = {
            result: flatData,
            row: row.row,
            action: row.action,
            record: row.record,
            count: flatData.length
        };
        getValue('grid.renderModule', this.parent).dataManagerSuccess(actionDetails, { requestType: 'refresh' });
    }

    private updateCurrentDomVirtualRecords(args: { startIndex: number, endIndex: number }): void {
        this.startIndex = args.startIndex;
        this.endIndex = args.endIndex;
        this.parent.currentDomVirtualRecords = this.parent.virtualDomScrollData.slice(this.startIndex, this.endIndex);
    }

    public destroy(): void {
        this.removeEventListener();
    }
}

export class DomVirtualTreeExtension extends GridDomVirtualization {
    /**
     * Constructor for DomVirtualTreeExtension
     *
     * @param {IGrid} parent - Grid instance (actually TreeGrid)
     * @param {ServiceLocator} locator - Service locator for dependency injection
     */
    constructor(parent: IGrid, locator?: ServiceLocator) {
        super(parent, locator);
        getValue('parent', this).off(initialLoad, getValue('instantiateRenderer', this), this);
        getValue('parent', this).on(initialLoad, this.instantiateRenderers, this);
    }

    public getModuleName(): string {
        return 'treeDomVirtualization';
    }

    protected instantiateRenderers(): void {
        const rendererFactory: object = getValue('locator', this).getService('rendererFactory');
        getValue('addRenderer', rendererFactory)
            .apply(rendererFactory, [RenderType.Content, new DomVirtualTreeContentRenderer(getValue('parent', this), getValue('locator', this))]);
    }
}
