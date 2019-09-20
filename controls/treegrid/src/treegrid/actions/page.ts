import { Grid } from '@syncfusion/ej2-grids';
import { Page as GridPage } from '@syncfusion/ej2-grids';
import { TreeGrid, ITreeData, RowCollapsedEventArgs } from '../base';
import * as events from '../base/constant';
import { DataManager, Query, Predicate } from '@syncfusion/ej2-data';
import { getValue, isNullOrUndefined, isBlazor } from '@syncfusion/ej2-base';
import { getExpandStatus, isFilterChildHierarchy } from '../utils';

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
        if (isBlazor()) {
          (this.parent.flatData.filter((e: ITreeData) => {
            return e.uniqueID === rowDetails.record.uniqueID;
          })[0] as ITreeData).expanded = rowDetails.action === 'collapse' ? false : true;
        }
        let ret: Object = {
            result: this.parent.flatData,
            row: rowDetails.row,
            action: rowDetails.action,
            record: rowDetails.record,
            count: this.parent.flatData.length
        };
        getValue('grid.renderModule', this.parent).dataManagerSuccess(ret);
    }
    private pageRoot(pagedResults: ITreeData[], temp: ITreeData[], result?: ITreeData[]) : ITreeData[] {
      let newResults: ITreeData[] = isNullOrUndefined(result) ? [] : result;
      for (let t: number = 0; t < temp.length; t++) {
          newResults.push(temp[t]);
          let res: ITreeData[] = [];
          if (temp[t].hasChildRecords) {
              res = pagedResults.filter((e: ITreeData) => {
                  return temp[t].uniqueID === e.parentUniqueID;
              });
              newResults = this.pageRoot(pagedResults, res, newResults);
          }
      }
      return newResults;
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
        let newResults: ITreeData[] = this.pageRoot(pageingDetails.result, temp);
        pageingDetails.result = newResults;
      } else {
        let dm: DataManager = new DataManager(pageingDetails.result);
        let expanded: Predicate = new Predicate('expanded', 'notequal', null).or('expanded', 'notequal', undefined);
        let parents: ITreeData[] = dm.executeLocal(new Query().where(expanded));
        let visualData: ITreeData[];
        if (isFilterChildHierarchy(this.parent)) {
          visualData = parents;
        } else {
          visualData = parents.filter((e: ITreeData) => {
            return getExpandStatus(this.parent, e, parents);
          });
        }
        pageingDetails.count = visualData.length;
        let query: Query = new Query();
        let size: number = this.parent.grid.pageSettings.pageSize;
        let current: number = this.parent.grid.pageSettings.currentPage;
        if (visualData.length < (current * size)) {
            current = (Math.floor(visualData.length / size)) + ((visualData.length % size) ? 1 : 0);
            current = current ? current : 1;
            this.parent.grid.setProperties({pageSettings: {currentPage: current}}, true);
        }
        let skip: number = size * (current - 1);
        query = query.skip(skip).take(size);
        dm.dataSource.json = visualData;
        pageingDetails.result = dm.executeLocal(query);
      }
      this.parent.notify('updateAction', pageingDetails);
    }
}