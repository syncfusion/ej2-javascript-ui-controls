import { Grid, ActionEventArgs } from '@syncfusion/ej2-grids';
import { Page as GridPage } from '@syncfusion/ej2-grids';
import { TreeGrid, ITreeData, RowCollapsedEventArgs } from '../base';
import * as events from '../base/constant';
import { DataManager, Query, Predicate } from '@syncfusion/ej2-data';
import { getValue, isNullOrUndefined, addClass, removeClass } from '@syncfusion/ej2-base';
import { getExpandStatus, isFilterChildHierarchy } from '../utils';

/**
 * The `Page` module is used to render pager and handle paging action.
 *
 * @hidden
 */
export class Page {
    private parent: TreeGrid;
    constructor(parent: TreeGrid) {
        Grid.Inject(GridPage);
        this.parent = parent;
        this.addEventListener();
    }
    /**
     * @hidden
     * @returns {void}
     */
    public addEventListener(): void {
        this.parent.on(events.localPagedExpandCollapse, this.collapseExpandPagedchilds, this);
        this.parent.on(events.pagingActions, this.pageAction, this);
    }
    /**
     * @hidden
     * @returns {void}
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.localPagedExpandCollapse, this.collapseExpandPagedchilds);
        this.parent.off(events.pagingActions, this.pageAction);
    }
    /**
     * For internal use only - Get the module name.
     *
     * @private
     * @returns {string} Returns Pager module name
     */
    protected getModuleName(): string {
        return 'pager';
    }

    /**
     * Refreshes the page count, pager information, and external message.
     *
     * @returns {void}
     */
    public refresh(): void {
        this.parent.grid.pagerModule.refresh();
    }

    /**
     * To destroy the pager
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
    }

    /**
     * Navigates to the target page according to the given number.
     *
     * @param  {number} pageNo - Defines the page number to navigate.
     * @returns {void}
     */
    public goToPage(pageNo: number): void {
        this.parent.grid.pagerModule.goToPage(pageNo);
    }

    /**
     * Defines the text of the external message.
     *
     * @param  {string} message - Defines the message to update.
     * @returns {void}
     */
    public updateExternalMessage(message: string): void {
        this.parent.grid.pagerModule.updateExternalMessage(message);
    }
    /**
     * @param {{action: string, row: HTMLTableRowElement, record: ITreeData, args: RowCollapsedEventArgs}} rowDetails - Expand Collapse details arguments
     * @param {string} rowDetails.action - Expand Collapse action type
     * @param {HTMLTableRowElement} rowDetails.row - Row element
     * @param {ITreeData} rowDetails.record - Row object data
     * @param {RowCollapsedEventArgs} rowDetails.args - Expand Collapse event arguments
     * @hidden
     * @returns {void}
     */
    private collapseExpandPagedchilds(rowDetails: { action: string, row: HTMLTableRowElement,
        record: ITreeData, args: RowCollapsedEventArgs }): void {
        rowDetails.record.expanded = rowDetails.action === 'collapse' ? false : true;
        this.parent.flatData.map((e: ITreeData) => e.expanded = e.uniqueID === rowDetails.record.uniqueID &&
           e.expanded !== rowDetails.record.expanded  ? rowDetails.record.expanded : e.expanded);
        if (this.parent.enableImmutableMode) {
            const primaryKeyField: string = this.parent.getPrimaryKeyFieldNames()[0];
            const record: ITreeData[] = this.parent.flatData.filter((e: ITreeData) => {
                return e[`${primaryKeyField}`] === rowDetails.record[`${primaryKeyField}`];
            });
            if (record.length) {
                record[0].expanded = rowDetails.record.expanded;
            }
        }
        const ret: Object = {
            result: this.parent.flatData,
            row: rowDetails.row,
            action: rowDetails.action,
            record: rowDetails.record,
            count: this.parent.flatData.length
        };
        getValue('grid.renderModule', this.parent).dataManagerSuccess(ret);
        if (this.parent.enableImmutableMode) {
            const row: string = 'row'; const action: string = 'action'; let targetEle: Element;
            if (ret[`${action}`] === 'collapse') {
                targetEle = ret[`${row}`].getElementsByClassName('e-treegridexpand')[0];
                if (!isNullOrUndefined(targetEle)) {
                    removeClass([targetEle], 'e-treegridexpand');
                    addClass([targetEle], 'e-treegridcollapse');
                }
            } else if (ret[`${action}`] === 'expand') {
                targetEle = ret[`${row}`].getElementsByClassName('e-treegridcollapse')[0];
                if (!isNullOrUndefined(targetEle)) {
                    removeClass([targetEle], 'e-treegridcollapse');
                    addClass([targetEle], 'e-treegridexpand');
                }
            }
        }
    }
    private pageRoot(pagedResults: ITreeData[], temp: ITreeData[], result?: ITreeData[]) : ITreeData[] {
        let newResults: ITreeData[] = isNullOrUndefined(result) ? [] : result;
        for (let t: number = 0; t < temp.length; t++) {
            newResults.push(temp[parseInt(t.toString(), 10)]);
            let res: ITreeData[] = [];
            if (temp[parseInt(t.toString(), 10)].hasChildRecords) {
                res = pagedResults.filter((e: ITreeData) => {
                    return temp[parseInt(t.toString(), 10)].uniqueID === e.parentUniqueID;
                });
                newResults = this.pageRoot(pagedResults, res, newResults);
            }
        }
        return newResults;
    }

    private updatePageSize(pageingDetails: {result: ITreeData[], count: number}) : void {
        const updateSize: number = pageingDetails.result.length;
        const gridPagerModule: GridPage = this.parent.grid.pagerModule;
        if (this.parent.pageSettings.pageSizes === true) {
            if (gridPagerModule.pagerObj.pagerdropdownModule['dropDownListObject'].value === gridPagerModule.pagerObj.getLocalizedLabel('All')) {
                gridPagerModule['pagerObj'].totalRecordsCount = updateSize;
                this.parent.grid.pageSettings.pageSize = updateSize;
            }
        }
    }

    private pageAction(pageingDetails: {result: ITreeData[], count: number, actionArgs: ActionEventArgs}): void {
        const dm: DataManager = new DataManager(pageingDetails.result);
        if (this.parent.pageSettings.pageSizeMode === 'Root') {
            let temp: ITreeData[] = [];
            const propname: string =
          (this.parent.grid.filterSettings.columns.length > 0) &&
              (this.parent.filterSettings.hierarchyMode === 'Child' || this.parent.filterSettings.hierarchyMode === 'None') ?
              'filterLevel' : 'level';
            let query: Query = new Query().where(propname, 'equal', 0);
            temp = dm.executeLocal(query);
            pageingDetails.count = temp.length;
            const size: number = this.parent.grid.pageSettings.pageSize;
            const current: number = this.parent.grid.pageSettings.currentPage;
            const skip: number = size * (current - 1);
            query = query.skip(skip).take(size);
            temp = dm.executeLocal(query);
            const newResults: ITreeData[] = this.pageRoot(pageingDetails.result, temp);
            pageingDetails.result = newResults;
        } else {
            const dm: DataManager = new DataManager(pageingDetails.result);
            const expanded: Predicate = new Predicate('expanded', 'notequal', null).or('expanded', 'notequal', undefined);
            const parents: ITreeData[] = dm.executeLocal(new Query().where(expanded));
            let visualData: ITreeData[];
            if (isFilterChildHierarchy(this.parent) && (pageingDetails.actionArgs.action !== 'collapse' &&
                pageingDetails.actionArgs.action !== 'expand')){
                visualData = parents;
            } else {
                visualData = parents.filter((e: ITreeData) => {
                    return getExpandStatus(this.parent, e, parents);
                });
            }
            pageingDetails.count = visualData.length;
            let query: Query = new Query();
            const size: number = this.parent.grid.pageSettings.pageSize;
            this.updatePageSize(pageingDetails);
            let current: number = this.parent.grid.pageSettings.currentPage;
            if (visualData.length < (current * size)) {
                current = (Math.floor(visualData.length / size)) + ((visualData.length % size) ? 1 : 0);
                current = current ? current : 1;
                this.parent.grid.setProperties({pageSettings: {currentPage: current}}, true);
            }
            const skip: number = size * (current - 1);
            query = query.skip(skip).take(size);
            dm.dataSource.json = visualData;
            pageingDetails.result = dm.executeLocal(query);
        }
        this.parent.notify('updateAction', pageingDetails);
    }
}
