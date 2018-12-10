import { Grid } from '@syncfusion/ej2-grids';
import { Page as GridPage } from '@syncfusion/ej2-grids';
import { TreeGrid, ITreeData, RowCollapsedEventArgs } from '../base';
import * as events from '../base/constant';
import { DataManager, Query, Predicate } from '@syncfusion/ej2-data';
import { getValue, isNullOrUndefined } from '@syncfusion/ej2-base';
import { getExpandStatus } from '../utils';

/**
 * The `Page` module is used to render pager and handle paging action.
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
     */
    public addEventListener(): void {
        this.parent.on(events.localPagedExpandCollapse, this.collapseExpandPagedchilds, this);
        this.parent.on(events.pagingActions, this.pageAction, this);
      }
      /**
       * @hidden
       */
      public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.localPagedExpandCollapse, this.collapseExpandPagedchilds);
        this.parent.off(events.pagingActions, this.pageAction);
      }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'pager';
    }

    /** 
     * Refreshes the page count, pager information, and external message. 
     * @return {void} 
     */
    public refresh(): void {
        this.parent.grid.pagerModule.refresh();
    }

    /**
     * To destroy the pager 
     * @return {void}
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
    }

    /** 
     * Navigates to the target page according to the given number. 
     * @param  {number} pageNo - Defines the page number to navigate. 
     * @return {void} 
     */
    public goToPage(pageNo: number): void {
        this.parent.grid.pagerModule.goToPage(pageNo);
    }

    /** 
     * Defines the text of the external message.
     * @param  {string} message - Defines the message to update. 
     * @return {void} 
     */
    public updateExternalMessage(message: string): void {
        this.parent.grid.pagerModule.updateExternalMessage(message);
    }
    /**
     * @hidden
     */
    private collapseExpandPagedchilds(rowDetails: { action: string, row: HTMLTableRowElement,
             record: ITreeData, args: RowCollapsedEventArgs }): void {
        rowDetails.record.expanded = rowDetails.action === 'collapse' ? false : true;
        let ret: Object = {
            result: this.parent.flatData,
            row: rowDetails.row,
            action: rowDetails.action,
            record: rowDetails.record,
            count: this.parent.flatData.length
        };
        getValue('grid.renderModule', this.parent).dataManagerSuccess(ret);
    }
    private pageAction(pageingDetails: {result: ITreeData[], count: number}): void {
      let dm: DataManager = new DataManager(pageingDetails.result);
      if (this.parent.pageSettings.pageSizeMode === 'Root') {
        let temp: ITreeData[] = [];
        let propname: string =
          (this.parent.grid.filterSettings.columns.length > 0) &&
              (this.parent.filterSettings.hierarchyMode === 'Child' || this.parent.filterSettings.hierarchyMode === 'None') ?
            'filterLevel' : 'level';
        let query: Query = new Query().where(propname, 'equal', 0);
        temp = dm.executeLocal(query);
        pageingDetails.count = temp.length;
        let size: number = this.parent.grid.pageSettings.pageSize;
        let current: number = this.parent.grid.pageSettings.currentPage;
        let skip: number = size * (current - 1);
        query = query.skip(skip).take(size);
        temp = dm.executeLocal(query);
        let child: ITreeData[] = [];
        for (let r: number = 0; r < temp.length; r++) {
          child = pageingDetails.result.filter((e: ITreeData) => {
            if (!isNullOrUndefined(temp[r].filterIndex)) {
              return e.filterRootIndex === temp[r].filterIndex;
            } else {
              return e.rootIndex === temp[r].index;
            }
          });
          for (let c: number = 0; c < child.length; c++) {
            temp.splice(r + c + 1, 0, child[c]);
          }
        }
        pageingDetails.result = temp;
      } else {
        let dm: DataManager = new DataManager(pageingDetails.result);
        let expanded: Predicate = new Predicate('expanded', 'notequal', null).or('expanded', 'notequal', undefined);
        let parents: ITreeData[] = dm.executeLocal(new Query().where(expanded));
        let visualData: ITreeData[] = parents.filter((e: ITreeData) => {
            return getExpandStatus(e, parents);
        });
        pageingDetails.count = visualData.length;
        let query: Query = new Query();
        let size: number = this.parent.grid.pageSettings.pageSize;
        let current: number = this.parent.grid.pageSettings.currentPage;
        let skip: number = size * (current - 1);
        query = query.skip(skip).take(size);
        dm.dataSource.json = visualData;
        pageingDetails.result = dm.executeLocal(query);
      }
      this.parent.notify('updateAction', pageingDetails);
    }
}