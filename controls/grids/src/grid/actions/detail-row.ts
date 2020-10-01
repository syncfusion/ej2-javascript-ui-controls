import { KeyboardEventArgs, isBlazor, removeClass, addClass } from '@syncfusion/ej2-base';
import { closest, classList, updateBlazorTemplate } from '@syncfusion/ej2-base';
import { IGrid } from '../base/interface';
import { Grid } from '../base/grid';
import { parents, getUid, appendChildren } from '../base/util';
import * as events from '../base/constant';
import { AriaService } from '../services/aria-service';
import { ServiceLocator } from '../services/service-locator';
import { FocusStrategy } from '../services/focus-strategy';
import { Row } from '../models/row';
import { Cell } from '../models/cell';
import { Column } from '../models/column';
import { CellType } from '../base/enum';

/**
 * The `DetailRow` module is used to handle detail template and hierarchy Grid operations.
 */
export class DetailRow {

    //Internal variables
    private aria: AriaService = new AriaService();

    //Module declarations
    private parent: IGrid;
    private focus: FocusStrategy;
    private lastrowcell: Boolean;
    /**
     * Constructor for the Grid detail template module
     * @hidden
     */
    constructor(parent?: IGrid, locator?: ServiceLocator) {
        this.parent = parent;
        if (this.parent.isDestroyed) { return; }
        this.focus = locator.getService<FocusStrategy>('focus');
        this.parent.on(events.click, this.clickHandler, this);
        this.parent.on(events.destroy, this.destroy, this);
        this.parent.on(events.keyPressed, this.keyPressHandler, this);
        this.parent.on(events.expandChildGrid, this.expand, this);
        this.parent.on(events.columnVisibilityChanged, this.refreshColSpan, this);
    }

    private clickHandler(e: MouseEvent): void {
        this.toogleExpandcollapse(closest(e.target as Element, 'td'));
    }

    // tslint:disable-next-line:max-func-body-length
    private toogleExpandcollapse(target: Element): void {
        let gObj: IGrid = this.parent;
        let table: Element = this.parent.getContentTable();
        let lastrowIdx: number = this.parent.getCurrentViewRecords().length - 1;
        let parent: string = 'parentDetails';
        let isServerRendered: string = 'isServerRendered';
        let childGrid: Grid;
        let isExpanded: boolean = target &&  target.classList.contains('e-detailrowcollapse') ;
        if (!(target && (target.classList.contains('e-detailrowcollapse') || target.classList.contains('e-detailrowexpand')))) {
            return;
        }
        if (isBlazor() && this.parent[isServerRendered]) {
            this.parent.notify('detailclick', target);
            return;
        }
        let tr: HTMLTableRowElement = target.parentElement as HTMLTableRowElement;
        let uid: string = tr.getAttribute('data-uid');
        let rowObj: Row<Column> = gObj.getRowObjectFromUID(uid);
        let nextRow: HTMLElement =
            this.parent.getContentTable().querySelector('tbody').children[tr.rowIndex + 1] as HTMLElement;
        if (target.classList.contains('e-detailrowcollapse')) {
            let data: Object = rowObj.data;
            if (this.isDetailRow(nextRow)) {
                nextRow.style.display = '';
                gObj.notify(events.detailStateChange, {data: data,
                    childGrid: gObj.childGrid, detailElement: target, isExpanded: isExpanded });
            } else if (gObj.getDetailTemplate() || gObj.childGrid) {
                let rowId: string = getUid('grid-row');
                let detailRow: Element = this.parent.createElement('tr', { className: 'e-detailrow', attrs: {'data-uid': rowId} });
                let detailCell: Element = this.parent.createElement('td', { className: 'e-detailcell' });
                let colSpan: number = this.parent.getVisibleColumns().length;
                if (this.parent.allowRowDragAndDrop) {
                    colSpan++;
                }
                detailCell.setAttribute('colspan', colSpan.toString());
                let row: Row<Column> = new Row<Column>({
                    isDataRow: true,
                    isExpand: true,
                    uid: rowId,
                    isDetailRow: true,
                    cells: [new Cell<Column>({ cellType: CellType.Indent }), new Cell<Column>({ isDataCell: true, visible: true })]
                });
                for (let i: number = 0, len: number = gObj.groupSettings.columns.length; i < len; i++) {
                    detailRow.appendChild(this.parent.createElement('td', { className: 'e-indentcell' }));
                    row.cells.unshift(new Cell<Column>({ cellType: CellType.Indent }));
                }
                detailRow.appendChild(this.parent.createElement('td', { className: 'e-detailindentcell' }));
                detailRow.appendChild(detailCell);
                tr.parentNode.insertBefore(detailRow, tr.nextSibling);
                if (gObj.detailTemplate) {
                    let isReactCompiler: boolean = this.parent.isReact && typeof (gObj.detailTemplate) !== 'string';
                    let detailTemplateID: string = gObj.element.id + 'detailTemplate';
                    if (isReactCompiler) {
                        gObj.getDetailTemplate()(data, gObj, 'detailTemplate', detailTemplateID, null, null, detailCell);
                        this.parent.renderTemplates();
                    } else {
                        appendChildren(detailCell, gObj.getDetailTemplate()(data, gObj, 'detailTemplate', detailTemplateID));
                    }
                    if (isBlazor()) {
                        updateBlazorTemplate(detailTemplateID, 'DetailTemplate', gObj, false);
                    }
                } else {
                    childGrid = new Grid(this.getGridModel(gObj, rowObj, gObj.printMode));
                    if (childGrid.query) {
                        childGrid.query = childGrid.query.clone();
                    }
                    childGrid[parent] = {
                        parentID: gObj.element.id,
                        parentPrimaryKeys: gObj.getPrimaryKeyFieldNames(),
                        parentKeyField: gObj.childGrid.queryString,
                        parentKeyFieldValue: data[gObj.childGrid.queryString],
                        parentRowData: data
                    };
                    if (gObj.isPrinting) {
                        (childGrid as IGrid).isPrinting = true;
                        childGrid.on(events.contentReady, this.promiseResolve(childGrid), this);
                        childGrid.on(events.onEmpty, this.promiseResolve(childGrid), this);
                    }
                    rowObj.childGrid = childGrid;
                    let modules: Function[] = childGrid.getInjectedModules();
                    let injectedModues: Function[] = gObj.getInjectedModules();
                    if (!modules || modules.length !== injectedModues.length) {
                        childGrid.setInjectedModules(injectedModues);
                    }
                    let gridElem: HTMLElement = this.parent.createElement('div', {
                        id: 'child' + parents(tr, 'e-grid').length +
                        '_grid' + tr.rowIndex + getUid('')
                    });
                    detailCell.appendChild(gridElem);
                    childGrid.appendTo(gridElem);
                }
                detailRow.appendChild(detailCell);
                if (tr.nextSibling) {
                    tr.parentNode.insertBefore(detailRow, tr.nextSibling);
                } else {
                    tr.parentNode.appendChild(detailRow);
                }
                gObj.getRows().splice(tr.rowIndex + 1, 0, detailRow);
                gObj.getRowsObject().splice(rowObj.index + 1, 0, row);
                gObj.trigger(events.detailDataBound, { detailElement: detailCell, data: data, childGrid: childGrid });
                gObj.notify(events.detailDataBound, { rows: gObj.getRowsObject() });
            }
            classList(target, ['e-detailrowexpand'], ['e-detailrowcollapse']);
            classList(target.firstElementChild, ['e-dtdiagonaldown', 'e-icon-gdownarrow'], ['e-dtdiagonalright', 'e-icon-grightarrow']);
            rowObj.isExpand = true;
            if (target.classList.contains('e-lastrowcell') && this.parent.getContent().clientHeight > table.scrollHeight) {
                removeClass(target.parentElement.querySelectorAll('td'), 'e-lastrowcell');
                let detailrowIdx: number = table.querySelector('tbody').querySelectorAll('.e-detailrow').length - 1;
                addClass(table.querySelector('tbody').querySelectorAll('.e-detailrow')[detailrowIdx].childNodes, ['e-lastrowcell']);
                this.lastrowcell = true;
            }
            this.aria.setExpand(target as HTMLElement, true);
        } else {
            if (this.isDetailRow(nextRow)) {
                nextRow.style.display = 'none';
                gObj.notify(events.detailStateChange, { data: rowObj.data,
                    childGrid: gObj.childGrid, detailElement: target, isExpanded: isExpanded });
            }
            classList(target, ['e-detailrowcollapse'], ['e-detailrowexpand']);
            classList(target.firstElementChild, ['e-dtdiagonalright', 'e-icon-grightarrow'], ['e-dtdiagonaldown', 'e-icon-gdownarrow']);
            if (parseInt(tr.getAttribute('aria-rowindex'), 10) === lastrowIdx && this.lastrowcell) {
                addClass(target.parentElement.querySelectorAll('td'), 'e-lastrowcell');
                this.lastrowcell = false;
            }
            rowObj.isExpand = false;
            this.aria.setExpand(target as HTMLElement, false);
        }
    }
    /**
     * @hidden
     * @param gObj 
     * @param rowObj 
     */
    public getGridModel(gObj: IGrid, rowObj: Row<Column>, printMode: string): Object {
        let gridModel: Object;
        if (gObj.isPrinting && rowObj.isExpand && gObj.expandedRows &&
            gObj.expandedRows[rowObj.index] && gObj.expandedRows[rowObj.index].gridModel) {
                (gObj.expandedRows[rowObj.index].gridModel as IGrid).hierarchyPrintMode = gObj.childGrid.hierarchyPrintMode;
                gridModel = gObj.expandedRows[rowObj.index].gridModel;
        } else {
            if (gObj.isPrinting && gObj.childGrid.allowPaging) {
                gObj.childGrid.allowPaging = printMode === 'CurrentPage';
                gridModel = gObj.childGrid;
            } else {
                gridModel = gObj.childGrid;
            }
        }
        return gridModel;
    }

    private promiseResolve(grid: IGrid): Function {
        return () => {
            grid.off(events.contentReady, this.promiseResolve);
            grid.off(events.onEmpty, this.promiseResolve);
            grid.notify(events.hierarchyPrint, {});
        };
    }

    private isDetailRow(row: Element): boolean {
        return row && row.classList.contains('e-detailrow');
    }

    private destroy(): void {
        let gridElement: Element = this.parent.element;
        if (this.parent.isDestroyed || !gridElement || (!gridElement.querySelector('.e-gridheader') &&
            !gridElement.querySelector('.e-gridcontent'))) { return; }
        this.parent.off(events.click, this.clickHandler);
        this.parent.off(events.destroy, this.destroy);
        this.parent.off(events.keyPressed, this.keyPressHandler);
        this.parent.off(events.expandChildGrid, this.expand);
        this.parent.off(events.columnVisibilityChanged, this.refreshColSpan);
    }

    private getTDfromIndex(index: number, className: string): Element {
        let tr: Element = this.parent.getDataRows()[index];
        if (tr && tr.querySelector(className)) {
            return tr.querySelector(className);
        }
        return null;
    }

    /** 
     * Expands a detail row with the given target.  
     * @param  {Element} target - Defines the collapsed element to expand.
     * @return {void} 
     */
    public expand(target: number | Element): void {
        if (!isNaN(target as number)) {
            target = this.getTDfromIndex(target as number, '.e-detailrowcollapse');
        }
        if (target && (target as Element).classList.contains('e-detailrowcollapse')) {
            this.toogleExpandcollapse(target as Element);
        }
    }

    /** 
     * Collapses a detail row with the given target.     
     * @param  {Element} target - Defines the expanded element to collapse.
     * @return {void} 
     */
    public collapse(target: number | Element): void {
        if (!isNaN(target as number)) {
            target = this.getTDfromIndex(target as number, '.e-detailrowexpand');
        }
        if (target && (target as Element).classList.contains('e-detailrowexpand')) {
            this.toogleExpandcollapse(target as Element);
        }
    }

    /** 
     * Expands all the detail rows of the Grid.          
     * @return {void} 
     */
    public expandAll(): void {
        this.expandCollapse(true);
        this.parent.trigger(events.actionComplete, { requestType: 'expandAllComplete', type: events.actionComplete, moduleObj: this });
    }

    /** 
     * Collapses all the detail rows of the Grid.         
     * @return {void} 
     */
    public collapseAll(): void {
        this.expandCollapse(false);
        this.parent.trigger(events.actionComplete, { requestType: 'collapseAllComplete', type: events.actionComplete, moduleObj: this });
    }

    private expandCollapse(isExpand: boolean): void {
        let td: Element;
        let rows: Element[] = this.parent.getDataRows();
        for (let i: number = 0, len: number = rows.length; i < len; i++) {
            td = rows[i].querySelector('.e-detailrowcollapse, .e-detailrowexpand');
            isExpand ? this.expand(td) : this.collapse(td);
        }
    }

    private keyPressHandler(e: KeyboardEventArgs): void {
        let gObj: IGrid = this.parent;
        switch (e.action) {
            case 'ctrlDownArrow':
                this.expandAll();
                break;
            case 'ctrlUpArrow':
                this.collapseAll();
                break;
            case 'altUpArrow':
            case 'altDownArrow':
                let selected: number[] = gObj.allowSelection ? gObj.getSelectedRowIndexes() : [];
                if (selected.length) {
                    let dataRow: HTMLTableRowElement = gObj.getDataRows()[selected[selected.length - 1]] as HTMLTableRowElement;
                    let td: Element = dataRow.querySelector('.e-detailrowcollapse, .e-detailrowexpand');
                    e.action === 'altDownArrow' ? this.expand(td) : this.collapse(td);
                }
                break;
            case 'enter':
                if (this.parent.isEdit) { return; }
                let element: HTMLElement = this.focus.getFocusedElement();
                if (!(<Element>e.target).classList.contains('e-detailrowcollapse') &&
                     !(<Element>e.target).classList.contains('e-detailrowexpand')) { break; }
                this.toogleExpandcollapse(element);
                break;
        }
    }

    private refreshColSpan(): void {
        let detailrows: NodeListOf<Element> = (<Grid>this.parent).contentModule.getTable().querySelectorAll('tr.e-detailrow');
        let colSpan: number = (<Grid>this.parent).getVisibleColumns().length;
        for (let i: number = 0; i < detailrows.length; i++) {
            (<HTMLElement>detailrows[i]).querySelector('.e-detailcell').setAttribute('colspan', colSpan + '');
        }
    }

    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'detailRow';
    }

}
