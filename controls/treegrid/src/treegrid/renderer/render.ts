import { TreeGrid } from '..';
import { QueryCellInfoEventArgs, IGrid, RowDataBoundEventArgs, getObject } from '@syncfusion/ej2-grids';
import { addClass, createElement, isNullOrUndefined, getValue } from '@syncfusion/ej2-base';
import { ITreeData } from '../base/interface';
import * as events from '../base/constant';
import { isRemoteData, isOffline, getExpandStatus } from '../utils';

/**
 * TreeGrid render module
 * @hidden
 */
export class Render {
    //Module declarations
    private parent: TreeGrid;
    /**
     * Constructor for render module
     */
    constructor(parent?: TreeGrid) {
        this.parent = parent;
    }
    /**
     * Updated row elements for TreeGrid
     */
    public RowModifier(args: RowDataBoundEventArgs): void {
        if  (!args.data) {
            return;
        }
        let data: ITreeData = <ITreeData>args.data;
        let parentData: ITreeData = <ITreeData>data.parentItem;
        let index: number;
        if (!isNullOrUndefined(data.parentIndex) &&
            (!(this.parent.allowPaging && !(this.parent.pageSettings.pageSizeMode === 'Root')) ||
                (isRemoteData(this.parent) && !isOffline(this.parent))))  {
            index = data.parentIndex;
            let collapsed: boolean = !(isNullOrUndefined(parentData[this.parent.expandStateMapping]) ||
                             parentData[this.parent.expandStateMapping]) || this.parent.enableCollapseAll ||
                            !getExpandStatus(this.parent, args.data, this.parent.grid.getCurrentViewRecords());
            if (collapsed) {
                (<HTMLTableRowElement>args.row).style.display = 'none';
            }
        } else {
            index = +args.row.getAttribute('aria-rowindex');
        }
        if (isRemoteData(this.parent) && !isOffline(this.parent)) {
            let proxy: TreeGrid = this.parent;
            let parentrec: ITreeData[] = this.parent.getCurrentViewRecords().filter((rec: ITreeData) => {
                return getValue(proxy.idMapping, rec) === getValue(proxy.parentIdMapping, data);
            });
            if (parentrec.length > 0) {
                let display: string = parentrec[0].expanded ? 'table-row' : 'none';
                args.row.setAttribute('style', 'display: ' + display  + ';');
            }
        }
        addClass([args.row], 'e-gridrowindex' + index + 'level' + (<ITreeData>args.data).level);
        let summaryRow: boolean = getObject('isSummaryRow', args.data);
        if (summaryRow) {
            addClass([args.row], 'e-summaryrow');
        }
        this.parent.trigger(events.rowDataBound, args);
    }
    /**
     * cell renderer for tree column index cell
     */
    public cellRender(args: QueryCellInfoEventArgs): void {
        if  (!args.data) {
            return;
        }
        let grid: IGrid = this.parent.grid;
        let data: ITreeData = <ITreeData>args.data;
        let ispadfilter: boolean = isNullOrUndefined(data.filterLevel);
        let pad: number = ispadfilter ? data.level : data.filterLevel;
        let totalIconsWidth: number = 0;
        if (grid.getColumnIndexByUid(args.column.uid) === this.parent.treeColumnIndex) {
            let container: Element = createElement('div', {
                className: 'e-treecolumn-container'
            });
            let emptyExpandIcon: HTMLElement = createElement('span', {
                className: 'e-icons e-none',
                styles: 'width: 10px; display: inline-block'
            });
            for (let n: number = 0; n < pad; n++) {
                totalIconsWidth += 10;
                container.appendChild(emptyExpandIcon.cloneNode());
            }
            let iconRequired: boolean = !isNullOrUndefined(data.hasFilteredChildRecords)
                ? data.hasFilteredChildRecords : data.hasChildRecords;
            if (iconRequired) {
                addClass([args.cell], 'e-treerowcell');
                let expandIcon: Element = createElement('span', {
                    className: 'e-icons'
                });
                let expand: boolean;
                if (this.parent.initialRender) {
                    expand = data.expanded &&
                        (isNullOrUndefined(data[this.parent.expandStateMapping]) || data[this.parent.expandStateMapping]) &&
                        !this.parent.enableCollapseAll;
                } else {
                    expand = data.expanded;
                }
                let collapsed: boolean = true;
                if (!isNullOrUndefined(data.parentIndex) && (!isNullOrUndefined(data[this.parent.expandStateMapping])
                    && data[this.parent.expandStateMapping])
                    && !(this.parent.allowPaging && !(this.parent.pageSettings.pageSizeMode === 'Root'))) {
                    collapsed = !getExpandStatus(this.parent, args.data, this.parent.grid.getCurrentViewRecords());
                }
                addClass([expandIcon], (expand && collapsed) ? 'e-treegridexpand' : 'e-treegridcollapse');
                totalIconsWidth += 18;
                container.appendChild(expandIcon);
                emptyExpandIcon.style.width = '7px';
                totalIconsWidth += 7;
                container.appendChild(emptyExpandIcon.cloneNode());
            } else if (pad) {
                // icons width
                totalIconsWidth += 20;
                container.appendChild(emptyExpandIcon.cloneNode());
                container.appendChild(emptyExpandIcon.cloneNode());
            }
            //should add below code when paging funcitonality implemented
            // if (data.hasChildRecords) {
            //     addClass([expandIcon], data.expanded ? 'e-treegridexpand' : 'e-treegridcollapse');
            // }
            let cellElement: HTMLElement = createElement('span', {
                className: 'e-treecell'
            });
            if (this.parent.allowTextWrap) {
                cellElement.style.width = 'Calc(100% - ' + totalIconsWidth + 'px)';
            }
            let textContent: string = args.cell.querySelector('.e-treecell') != null ?
            args.cell.querySelector('.e-treecell').innerHTML : args.cell.innerHTML;
            cellElement.innerHTML = textContent;
            container.appendChild(cellElement);
            args.cell.innerHTML = '';
            args.cell.appendChild(container);
        }
        let summaryRow: boolean = getObject('isSummaryRow', args.data);
        if (summaryRow) {
            addClass([args.cell], 'e-summarycell');
            let summaryData: string = getObject(args.column.field, args.data);
            args.cell.querySelector('.e-treecell') != null ?
               args.cell.querySelector('.e-treecell').innerHTML = summaryData : args.cell.innerHTML = summaryData;
        }
        this.parent.trigger(events.queryCellInfo, args);
    }
}