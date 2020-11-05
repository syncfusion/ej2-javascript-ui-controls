import { TreeGrid } from '..';
import { QueryCellInfoEventArgs, IGrid, RowDataBoundEventArgs, getObject, appendChildren } from '@syncfusion/ej2-grids';
import { templateCompiler, extend } from '@syncfusion/ej2-grids';
import { addClass, createElement, isNullOrUndefined, getValue } from '@syncfusion/ej2-base';
import { ITreeData } from '../base/interface';
import * as events from '../base/constant';
import { isRemoteData, isOffline, getExpandStatus, isFilterChildHierarchy } from '../utils';
import { Column } from '../models';

/**
 * TreeGrid render module
 * @hidden
 */
export class Render {
    //Module declarations
    private parent: TreeGrid;
    private templateResult: NodeList;
    /**
     * Constructor for render module
     */
    constructor(parent?: TreeGrid) {
        this.parent = parent;
        this.templateResult = null;
        this.parent.grid.on('template-result', this.columnTemplateResult, this);
        this.parent.grid.on('reactTemplateRender', this.reactTemplateRender, this);
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
        if (!isNullOrUndefined(data.parentItem) && !isFilterChildHierarchy(this.parent) &&
            (!(this.parent.allowPaging && !(this.parent.pageSettings.pageSizeMode === 'Root')) ||
                (isRemoteData(this.parent) && !isOffline(this.parent))))  {
            index = data.parentItem.index;
            let collapsed: boolean = (this.parent.initialRender && (!(isNullOrUndefined(parentData[this.parent.expandStateMapping]) ||
                             parentData[this.parent.expandStateMapping]) || this.parent.enableCollapseAll)) ||
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
        //addClass([args.row], 'e-gridrowindex' + index + 'level' + (<ITreeData>args.data).level);
        let summaryRow: boolean = getObject('isSummaryRow', args.data);
        if (summaryRow) {
            addClass([args.row], 'e-summaryrow');
        }
        if (args.row.querySelector('.e-treegridexpand')) {
            args.row.setAttribute('aria-expanded', 'true');
        } else if (args.row.querySelector('.e-treegridcollapse')) {
            args.row.setAttribute('aria-expanded', 'false');
        }
        if (this.parent.enableCollapseAll && this.parent.initialRender) {
            if (!isNullOrUndefined(data.parentItem)) {
                (<HTMLTableRowElement>args.row).style.display = 'none';
            }
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
        let grid: IGrid = this.parent.grid; let data: ITreeData = <ITreeData>args.data; let index: number;
        let ispadfilter: boolean = isNullOrUndefined(data.filterLevel);
        let pad: number = ispadfilter ? data.level : data.filterLevel;
        let totalIconsWidth: number = 0; let cellElement: HTMLElement;
        let column: Column = this.parent.getColumnByUid(args.column.uid);
        let summaryRow: boolean = data.isSummaryRow;
        if (!isNullOrUndefined(data.parentItem)) {
            index = data.parentItem.index;
        } else { index = data.index; }
        if (grid.getColumnIndexByUid(args.column.uid) === this.parent.treeColumnIndex
         && (args.requestType === 'add' || args.requestType === 'delete' || isNullOrUndefined(args.cell.querySelector('.e-treecell')))) {
            let container: Element = createElement('div', { className: 'e-treecolumn-container' });
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
            if (iconRequired && !isNullOrUndefined(data.childRecords)) {
                iconRequired = !((<ITreeData>data).childRecords.length === 0 );
                }
            if (iconRequired) {
                addClass([args.cell], 'e-treerowcell');
                let expandIcon: Element = createElement('span', { className: 'e-icons' });
                let expand: boolean;
                if (this.parent.initialRender) {
                    expand = data.expanded &&
                        (isNullOrUndefined(data[this.parent.expandStateMapping]) || data[this.parent.expandStateMapping]) &&
                        !this.parent.enableCollapseAll;
                } else {
                   expand =  !(!data.expanded || !getExpandStatus(this.parent, data, this.parent.grid.getCurrentViewRecords()));
                }
                addClass([expandIcon], (expand ) ? 'e-treegridexpand' : 'e-treegridcollapse');
                totalIconsWidth += 18;
                container.appendChild(expandIcon);
                emptyExpandIcon.style.width = '7px'; totalIconsWidth += 7;
                container.appendChild(emptyExpandIcon.cloneNode());
            } else if (pad || !pad && !data.level) {
                // icons width
                totalIconsWidth += 20;
                container.appendChild(emptyExpandIcon.cloneNode());
                container.appendChild(emptyExpandIcon.cloneNode());
            }
            //should add below code when paging funcitonality implemented
            // if (data.hasChildRecords) {
            //     addClass([expandIcon], data.expanded ? 'e-treegridexpand' : 'e-treegridcollapse');
            // }
            cellElement = createElement('span', { className: 'e-treecell' });
            if (this.parent.allowTextWrap) {
                cellElement.style.width = 'Calc(100% - ' + totalIconsWidth + 'px)';
            }
            addClass([args.cell], 'e-gridrowindex' + index + 'level' + data.level);
            this.updateTreeCell(args, cellElement, container);
            container.appendChild(cellElement);
            args.cell.appendChild(container);
        }
        if (this.parent.frozenColumns > this.parent.treeColumnIndex &&
            grid.getColumnIndexByUid(args.column.uid) === this.parent.frozenColumns + 1) {
                addClass([args.cell], 'e-gridrowindex' + index + 'level' + data.level);
        } else if (this.parent.frozenColumns <= this.parent.treeColumnIndex &&
            grid.getColumnIndexByUid(args.column.uid) === this.parent.frozenColumns - 1) {
                addClass([args.cell], 'e-gridrowindex' + index + 'level' + data.level);
            }
        if (!isNullOrUndefined(column) && column.showCheckbox) {
            this.parent.notify('columnCheckbox', args);
            if (this.parent.allowTextWrap) {
                let checkboxElement: HTMLElement = <HTMLElement>args.cell.querySelectorAll('.e-frame')[0];
                let width: number = parseInt(checkboxElement.style.width, 16);
                totalIconsWidth += width; totalIconsWidth += 10;
                if (grid.getColumnIndexByUid(args.column.uid) === this.parent.treeColumnIndex) {
                    cellElement = <HTMLElement>args.cell.querySelector('.e-treecell');
                } else {
                    cellElement = <HTMLElement>args.cell.querySelector('.e-treecheckbox');
                }
                cellElement.style.width = 'Calc(100% - ' + totalIconsWidth + 'px)';
            }
        }
        if (summaryRow) {
            addClass([args.cell], 'e-summarycell');
            let summaryData: string = getObject(args.column.field, args.data);
            args.cell.querySelector('.e-treecell') != null ?
               args.cell.querySelector('.e-treecell').innerHTML = summaryData : args.cell.innerHTML = summaryData;
        }
        if (isNullOrUndefined(this.parent.rowTemplate)) {
            this.parent.trigger(events.queryCellInfo, args);
            }
    }
    private updateTreeCell(args: QueryCellInfoEventArgs, cellElement: HTMLElement, container: Element): void {
        let treeColumn: Column = this.parent.columns[this.parent.treeColumnIndex] as Column;
        let templateFn: string = 'templateFn';
        let colindex: number = args.column.index;
        if (isNullOrUndefined(treeColumn.field)) {
            args.cell.setAttribute('aria-colindex', colindex + '');
        }
        if (treeColumn.field === args.column.field && !isNullOrUndefined(treeColumn.template)) {
            args.column.template = treeColumn.template;
            args.column[templateFn] = templateCompiler(args.column.template);
            args.cell.classList.add('e-templatecell');
        }
        let textContent: string = args.cell.querySelector('.e-treecell') != null ?
        args.cell.querySelector('.e-treecell').innerHTML : args.cell.innerHTML;
        if ( typeof(args.column.template) === 'object' && this.templateResult ) {
            appendChildren(cellElement , this.templateResult);
            this.templateResult = null;
            args.cell.innerHTML = '';
        } else if (args.cell.classList.contains('e-templatecell')) {
            let len: number = args.cell.children.length;
            let tempID: string = this.parent.element.id + args.column.uid;
            if (treeColumn.field === args.column.field && !isNullOrUndefined(treeColumn.template)) {
                let portals: string = 'portals';
                let renderReactTemplates: string = 'renderReactTemplates';
                if ((<{ isReact?: boolean }>this.parent).isReact) {
                    args.column[templateFn](args.data, this.parent, 'template', tempID, null, null, cellElement);
                    if (isNullOrUndefined(this.parent.grid[portals])) {
                        this.parent.grid[portals] = this.parent[portals];
                    }
                    this.parent[renderReactTemplates]();
                } else {
                    let str: string = 'isStringTemplate';
                    let result: Element[];
                    result = args.column[templateFn](
                        extend({ 'index': '' }, args.data), this.parent, 'template', tempID, this.parent[str]);
                    appendChildren(cellElement, result);
                }
                delete args.column.template;
                delete args.column[templateFn];
                args.cell.innerHTML = '';
            } else {
                for (let i: number = 0; i < len; len = args.cell.children.length) {
                    cellElement.appendChild(args.cell.children[i]);
                }
            }
        } else {
            cellElement.innerHTML = textContent;
            args.cell.innerHTML = '';
        }
    }

    private columnTemplateResult(args: {template : NodeList, name: string}): void {
        this.templateResult = args.template;
    }

    private reactTemplateRender(args: object[]): void {
        let renderReactTemplates: string = 'renderReactTemplates';
        let portals: string = 'portals';
        this.parent[portals] = args;
        this.parent.notify('renderReactTemplate', this.parent[portals]);
        this.parent[renderReactTemplates]();
    }

    public destroy(): void {
        this.parent.grid.off('template-result', this.columnTemplateResult);
        this.parent.grid.off('reactTemplateRender', this.reactTemplateRender);
    }
}