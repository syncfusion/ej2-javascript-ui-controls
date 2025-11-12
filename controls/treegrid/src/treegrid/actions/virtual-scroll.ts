import { TreeGrid } from '../base/treegrid';
import { Grid, VirtualScroll as GridVirtualScroll, NotifyArgs, ActionEventArgs, IGrid, ServiceLocator, RowDeselectEventArgs } from '@syncfusion/ej2-grids';
import { RenderType } from '@syncfusion/ej2-grids';
import { getValue, isNullOrUndefined } from '@syncfusion/ej2-base';
import * as events from '../base/constant';
import { ITreeData, RowCollapsedEventArgs } from '../base';
import { DataManager, Predicate, Query } from '@syncfusion/ej2-data';
import { getExpandStatus } from '../utils';
import { VirtualTreeContentRenderer } from '../renderer/virtual-tree-content-render';
import { VirtualHeaderRenderer, getTransformValues, VirtualContentRenderer } from '@syncfusion/ej2-grids';

/**
 * TreeGrid Virtual Scroll module will handle Virtualization
 *
 * @hidden
 */
export class VirtualScroll {
    private parent: TreeGrid;
    private expandCollapseRec: ITreeData;
    private prevstartIndex: number = -1;
    public setEndIndexToGantt : boolean = true;
    public ganttEndIndex : number;
    private prevendIndex: number = -1;
    private visualData: ITreeData[];
    private prevrequestType: string;
    public prevSelectedRecord: object = [];

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
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.localPagedExpandCollapse, this.collapseExpandVirtualchilds, this);
        this.parent.on(events.pagingActions, this.virtualPageAction, this);
        this.parent.on(events.destroy, this.destroy, this);
    }
    /**
     * @hidden
     * @returns {void}
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.localPagedExpandCollapse, this.collapseExpandVirtualchilds);
        this.parent.off(events.pagingActions, this.virtualPageAction);
        this.parent.off(events.destroy, this.destroy);
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
    private collapseExpandVirtualchilds(row: { action: string, row: HTMLTableRowElement,
        record: ITreeData, args: RowCollapsedEventArgs }): void {
        this.parent.grid.notify(events.virtualActionArgs, { isExpandCollapse: true });
        this.expandCollapseRec = row.record;
        row.record.expanded = row.action === 'collapse' ? false : true;
        this.parent.flatData.map((e: ITreeData) => e.expanded = e.uniqueID === row.record.uniqueID &&
            e.expanded !== row.record.expanded  ? row.record.expanded : e.expanded);
        const actionDetails : Object = {
            result: this.parent.flatData,
            row: row.row,
            action: row.action,
            record: row.record,
            count: this.parent.flatData.length
        };
        this.handleSelection();
        const requestType: string = getValue('isCollapseAll', this.parent) ? 'collapseAll' : 'refresh';
        getValue('grid.renderModule', this.parent).dataManagerSuccess(actionDetails , <NotifyArgs>{ requestType: requestType });
    }

    /**
     * Handles selection logic for the TreeGrid component.
     *
     * @returns {void}
     */
    private handleSelection(): void {
        if ((this.parent.selectionSettings.mode === 'Cell' ||
            (this.parent.selectionSettings.mode === 'Row' && !this.parent.selectionSettings.persistSelection))) {
            this.parent.grid.clearSelection();
        }
        if (getValue('isCollapseAll', this.parent) && this.parent.selectionSettings.persistSelection && this.parent.getSelectedRecords().length > 0) {
            this.prevSelectedRecord = this.parent.getSelectedRecords();
            this.parent.grid.clearSelection();
        }
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
    private virtualPageAction(pageingDetails: {result: ITreeData[], count: number, actionArgs: ActionEventArgs}): void {
        const dm: DataManager = new DataManager(pageingDetails.result);
        const expanded: Predicate = new Predicate('expanded', 'notequal', null).or('expanded', 'notequal', undefined);
        const parents: ITreeData[] = dm.executeLocal(new Query().where(expanded));
        const visualData: ITreeData[] = parents.filter((e: ITreeData) => {
            return getExpandStatus(this.parent, e, parents);
        });
        this.visualData = visualData;
        pageingDetails.count = visualData.length;
        this.parent.grid.notify(events.dataListener, {data: visualData});
        const counts: { startIndex: number, endIndex: number, count: number, requestType: string } =
            { startIndex: -1, endIndex: -1, count: pageingDetails.count, requestType: pageingDetails.actionArgs.requestType };
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
            if (requestType === 'filtering' || requestType === 'collapseAll' || requestType === 'searching' || (requestType === 'refresh' && getValue('isExpandAll', this.parent)) ||
                (requestType === 'refresh' && this.parent.enableCollapseAll && endIndex > visualData.length && isNullOrUndefined(this.expandCollapseRec))) {
                startIndex = 0;
                endIndex = this.parent.grid.pageSettings.pageSize;
                (this.parent.grid.getContent() as HTMLElement).firstElementChild.scrollTop = 0;
                this.parent.grid.notify(events.virtualActionArgs, { setTop: true });
            }
            if ((requestType === 'save' && pageingDetails.actionArgs.index >= (counts.count - this.parent.grid.pageSettings.pageSize)) || (requestType === 'refresh' && this.parent['isGantt'] && this.parent['isAddedFromGantt'])) {
                if (this.setEndIndexToGantt) {
                    this.ganttEndIndex = counts.endIndex;
                }
                if (
                    (
                        (counts.endIndex + this.parent.pageSettings.pageSize >= counts.count) &&
                        (this.parent.root && counts.count !== this.ganttEndIndex) && this.parent['isAddedFromGantt']
                    ) || !(this.parent['isGantt'] && this.parent['isAddedFromGantt'])
                ) {
                    startIndex = counts.startIndex + (counts.count - counts.endIndex);
                    endIndex = counts.count;
                    this.setEndIndexToGantt = false;
                }
                this.ganttEndIndex = endIndex;
                this.parent['isAddedFromGantt'] = false;
            }
            //if ((this.prevendIndex !== -1 && this.prevstartIndex !== -1) &&
            //this.prevendIndex === endIndex && this.prevstartIndex === startIndex) {
            const virtualWrapperElement: HTMLElement = (this.parent.grid.contentModule as VirtualContentRenderer).virtualEle.wrapper;
            const translateY: number = getTransformValues(virtualWrapperElement).height;
            if (!isNullOrUndefined(this.expandCollapseRec) && (pageingDetails.actionArgs.requestType === 'virtualscroll' ||
            (pageingDetails.actionArgs.requestType === 'refresh' && startIndex !== this.prevstartIndex)) &&
            (startIndex < this.parent.getRows().length && endIndex <= startIndex + this.parent.getRows().length) && translateY === 0) {
                startIndex = 0;
            }
            if ((pageingDetails.actionArgs.requestType === 'save' && startIndex !== this.prevstartIndex) &&
                (startIndex < this.parent.getRows().length && endIndex <= startIndex + this.parent.getRows().length) && translateY === 0) {
                startIndex = 0;
                endIndex = startIndex + this.parent.grid.pageSettings.pageSize;
            }
            if (!isNullOrUndefined(this.expandCollapseRec)) {
                const resourceCount: number = this.parent.grid.pageSettings.pageSize;
                let sIndex: number = visualData.indexOf(this.expandCollapseRec);
                const tempdata: ITreeData[] = visualData.slice(sIndex, sIndex + resourceCount);
                if (tempdata.length < resourceCount && sIndex >= 0 && startIndex !== 0) {
                    sIndex = visualData.length - resourceCount;
                    sIndex = sIndex > 0 ? sIndex : 0;
                    endIndex = visualData.length;
                    if (endIndex - startIndex < resourceCount) {
                        const newRowsCount: number = sIndex - startIndex;
                        startIndex = sIndex;
                        if (visualData.indexOf(this.expandCollapseRec) > visualData.length - resourceCount / 2) {
                            const newTranslateY: number = startIndex * this.parent.grid.getRowHeight();
                            (this.parent.grid.contentModule as VirtualTreeContentRenderer)['translateY'] = newTranslateY;
                            (this.parent.grid.contentModule as VirtualContentRenderer).virtualEle.adjustTable(0, newTranslateY);
                        }
                    }
                } else if ( getValue('isCollapseAll', this.parent)) {
                    startIndex = 0;
                    endIndex = this.parent.grid.pageSettings.pageSize - 1;
                    this.parent.grid.notify(events.virtualActionArgs, { setTop: true });
                }
            }
            //}
            if (this.prevrequestType === 'collapseAll' && pageingDetails.actionArgs.requestType === 'virtualscroll'
                && !isNullOrUndefined(this.parent.idMapping) && startIndex === 0) {
                startIndex = 0;
                endIndex = this.parent.grid.pageSettings.pageSize - 1;
                this.parent.grid.notify(events.virtualActionArgs, { setTop: true });
            }
            if ((this.parent.enableCollapseAll || this.parent.expandStateMapping) && !isNullOrUndefined(this.expandCollapseRec)) {
                if (pageingDetails.count < this.parent.getRows()[0].getBoundingClientRect().height) {
                    startIndex = 0;
                } else if (!this.parent['isExpandAll'] && (this.parent.grid.contentModule as VirtualTreeContentRenderer)['translateY'] === 0) {
                    startIndex = this.prevstartIndex === -1 ? 0 : this.prevstartIndex;
                }
            }
            this.expandCollapseRec = null;
            startIndex = startIndex < 0 ? 0 : startIndex;
            if (endIndex === 0 && visualData.length > 0) {
                pageingDetails.result = visualData;
            }
            else {
                pageingDetails.result = visualData.slice(startIndex, endIndex);
            }
            this.prevstartIndex = startIndex;
            this.prevendIndex = endIndex;
            this.prevrequestType = pageingDetails.actionArgs.requestType;
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

    /**
     * Updates the row selection when the header checkbox is clicked and the number of selected rows
     * does not match the current view data length.
     *
     * @param {RowDeselectEventArgs} args - The arguments containing details of the row deselection event.
     * @returns {void} - This method does not return a value.
     */
    private updateSelection(args: RowDeselectEventArgs): void {
        if (args.isHeaderCheckboxClicked &&
            this.parent.grid.currentViewData.length !== this.parent.grid.selectionModule.selectedRowIndexes.length &&
            args.target.classList.contains('e-uncheck')) {
            const updateRowSelection: string = 'updateRowSelection';
            for (let i: number = 0; i < this.parent.getRows().length; i++) {
                if (this.parent.getRows()[parseInt(i.toString(), 10)].getElementsByClassName('e-frame e-icons e-uncheck').length &&
                !this.parent.getRows()[parseInt(i.toString(), 10)].querySelector('.e-checkbox-disabled')) {
                    this.parent.grid.selectionModule[`${updateRowSelection}`](this.parent.getRows()[parseInt(i.toString(), 10)],
                                                                              // eslint-disable-next-line max-len
                                                                              (this.parent.getCurrentViewRecords()[parseInt(i.toString(), 10)] as
                                                                              ITreeData).index);
                }
            }
        }
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
        const parentGrid: IGrid = getValue('parent', this);
        getValue('parent', this).log(['limitation', 'virtual_height'], 'virtualization');
        const renderer: Object = getValue('locator', this).getService('rendererFactory');
        if (parentGrid.enableColumnVirtualization) {
            getValue('addRenderer', renderer)
                .apply(renderer, [RenderType.Header, new VirtualHeaderRenderer(getValue('parent', this), getValue('locator', this))]);
        }
        getValue('addRenderer', renderer)
            .apply(renderer, [RenderType.Content, new VirtualTreeContentRenderer(getValue('parent', this), getValue('locator', this))]);
        this.ensurePageSize();
    }
    public ensurePageSize(): void {
        const parentGrid: IGrid = getValue('parent', this);
        const rowHeight: number = parentGrid.getRowHeight();
        if (!isNullOrUndefined(parentGrid.height) && typeof (parentGrid.height) === 'string' && parentGrid.height.indexOf('%') !== -1) {
            parentGrid.element.style.height = parentGrid.height;
        }
        const vHeight: string | number = parentGrid.height.toString().indexOf('%') < 0 ? parseInt(parentGrid.height.toString(), 10) :
            parentGrid.element.getBoundingClientRect().height;
        const blockSize: number = ~~(<number>vHeight / rowHeight);
        const height: number = blockSize * 2;
        const size: number = parentGrid.pageSettings.pageSize;
        parentGrid.setProperties({ pageSettings: { pageSize: size < height ? height : size } }, true);
    }
}
