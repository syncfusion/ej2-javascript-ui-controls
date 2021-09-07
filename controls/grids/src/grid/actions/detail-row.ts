import { KeyboardEventArgs, removeClass, addClass, extend } from '@syncfusion/ej2-base';
import { closest, classList, isNullOrUndefined } from '@syncfusion/ej2-base';
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
import * as literals from '../base/string-literals';

/**
 * The `DetailRow` module is used to handle detail template and hierarchy Grid operations.
 */
export class DetailRow {

    //Internal variables
    private aria: AriaService = new AriaService();

    //Module declarations
    private parent: IGrid;
    private focus: FocusStrategy;
    private lastrowcell: boolean;
    private childRefs: Grid[] = [];

    /**
     * Constructor for the Grid detail template module
     *
     * @param {IGrid} parent - specifies the IGrid
     * @param {ServiceLocator} locator - specifes the serviceLocator
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
        this.parent.on(events.destroy, this.destroyChildGrids, this);
        this.parent.on(events.destroyChildGrid, this.destroyChildGrids, this);
    }

    private clickHandler(e: MouseEvent): void {
        this.toogleExpandcollapse(closest(e.target as Element, 'td'));
    }

    private toogleExpandcollapse(target: Element): void {
        const gObj: IGrid = this.parent;
        const table: Element = this.parent.getContentTable();
        const lastrowIdx: number = this.parent.getCurrentViewRecords().length - 1;
        const parent: string = 'parentDetails';
        let childGrid: Grid;
        const isExpanded: boolean = target &&  target.classList.contains('e-detailrowcollapse') ;
        if (!(target && (target.classList.contains('e-detailrowcollapse') || target.classList.contains('e-detailrowexpand')))) {
            return;
        }
        const tr: HTMLTableRowElement = target.parentElement as HTMLTableRowElement;
        const uid: string = tr.getAttribute('data-uid');
        const rowObj: Row<Column> = gObj.getRowObjectFromUID(uid);
        const nextRow: HTMLElement =
            this.parent.getContentTable().querySelector( literals.tbody).children[tr.rowIndex + 1] as HTMLElement;
        if (target.classList.contains('e-detailrowcollapse')) {
            const data: Object = rowObj.data;
            if (this.isDetailRow(nextRow)) {
                nextRow.style.display = '';
                gObj.notify(events.detailStateChange, {data: data,
                    childGrid: gObj.childGrid, detailElement: target, isExpanded: isExpanded });
            } else if (gObj.getDetailTemplate() || gObj.childGrid) {
                const rowId: string = getUid('grid-row');
                const detailRow: Element = this.parent.createElement('tr', { className: 'e-detailrow', attrs: {'data-uid': rowId} });
                const detailCell: Element = this.parent.createElement('td', { className: 'e-detailcell' });
                let colSpan: number = this.parent.getVisibleColumns().length;
                if (this.parent.allowRowDragAndDrop) {
                    colSpan++;
                }
                detailCell.setAttribute('colspan', colSpan.toString());
                const row: Row<Column> = new Row<Column>({
                    isDataRow: true,
                    isExpand: true,
                    uid: rowId,
                    isDetailRow: true,
                    cells: [new Cell<Column>({ cellType: CellType.Indent }), new Cell<Column>({ isDataCell: true, visible: true })]
                });
                row.parentUid = rowObj.uid;
                for (let i: number = 0, len: number = gObj.groupSettings.columns.length; i < len; i++) {
                    detailRow.appendChild(this.parent.createElement('td', { className: 'e-indentcell' }));
                    row.cells.unshift(new Cell<Column>({ cellType: CellType.Indent }));
                }
                detailRow.appendChild(this.parent.createElement('td', { className: 'e-detailindentcell' }));
                detailRow.appendChild(detailCell);
                tr.parentNode.insertBefore(detailRow, tr.nextSibling);
                if (gObj.detailTemplate) {
                    const isReactCompiler: boolean = this.parent.isReact && typeof (gObj.detailTemplate) !== 'string';
                    const detailTemplateID: string = gObj.element.id + 'detailTemplate';
                    if (isReactCompiler) {
                        gObj.getDetailTemplate()(data, gObj, 'detailTemplate', detailTemplateID, null, null, detailCell);
                        this.parent.renderTemplates();
                    } else {
                        appendChildren(detailCell, gObj.getDetailTemplate()(data, gObj, 'detailTemplate', detailTemplateID));
                    }
                } else {
                    childGrid = new Grid(this.getGridModel(gObj, rowObj, gObj.printMode));
                    this.childRefs.push(childGrid);
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
                    (<{ isLegacyTemplate?: boolean }>childGrid).isLegacyTemplate = gObj.isReact
                        || (<{ isLegacyTemplate?: boolean }>gObj).isLegacyTemplate;
                    if (gObj.isPrinting) {
                        (childGrid as IGrid).isPrinting = true;
                        childGrid.on(events.contentReady, this.promiseResolve(childGrid), this);
                        childGrid.on(events.onEmpty, this.promiseResolve(childGrid), this);
                    }
                    rowObj.childGrid = childGrid;
                    const modules: Function[] = childGrid.getInjectedModules();
                    const injectedModues: Function[] = gObj.getInjectedModules();
                    if (!modules || modules.length !== injectedModues.length) {
                        childGrid.setInjectedModules(injectedModues);
                    }
                    const gridElem: HTMLElement = this.parent.createElement('div', {
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
                const rowElems: Element[] = gObj.getRows();
                const rowObjs: Row<Column>[] = gObj.getRowsObject();
                rowElems.splice(rowElems.indexOf(tr) + 1, 0, detailRow);
                rowObjs.splice(rowObjs.indexOf(rowObj) + 1, 0, row);
                gObj.trigger(events.detailDataBound, { detailElement: detailCell, data: data, childGrid: childGrid });
                gObj.notify(events.detailDataBound, { rows: rowObjs });
            }
            classList(target, ['e-detailrowexpand'], ['e-detailrowcollapse']);
            classList(target.firstElementChild, ['e-dtdiagonaldown', 'e-icon-gdownarrow'], ['e-dtdiagonalright', 'e-icon-grightarrow']);
            rowObj.isExpand = true;
            if (target.classList.contains('e-lastrowcell') && this.parent.getContent().clientHeight > table.scrollHeight) {
                removeClass(target.parentElement.querySelectorAll('td'), 'e-lastrowcell');
                const detailrowIdx: number = table.querySelector(literals.tbody).getElementsByClassName('e-detailrow').length - 1;
                addClass(table.querySelector(literals.tbody).getElementsByClassName('e-detailrow')[detailrowIdx].childNodes, ['e-lastrowcell']);
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
            if (parseInt(tr.getAttribute(literals.ariaRowIndex), 10) === lastrowIdx && this.lastrowcell) {
                addClass(target.parentElement.querySelectorAll('td'), 'e-lastrowcell');
                this.lastrowcell = false;
            }
            rowObj.isExpand = false;
            this.aria.setExpand(target as HTMLElement, false);
        }
        if (!isNullOrUndefined(gObj.detailTemplate)) {
            gObj.updateVisibleExpandCollapseRows();
            gObj.notify(events.refreshExpandandCollapse, { rows: gObj.getRowsObject() });
        }
    }

    /**
     * @hidden
     * @param {IGrid} gObj - specifies the grid Object
     * @param {Row<Column>}rowObj - specifies the row object
     * @param {string} printMode - specifies the printmode
     * @returns {Object} returns the object
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
            }
            gridModel = extend({}, {}, gObj.childGrid, true);
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
        const gridElement: Element = this.parent.element;
        if (this.parent.isDestroyed || !gridElement || (!gridElement.querySelector('.' + literals.gridHeader) &&
            !gridElement.querySelector( '.' + literals.gridContent))) { return; }
        this.parent.off(events.click, this.clickHandler);
        this.parent.off(events.destroy, this.destroy);
        this.parent.off(events.keyPressed, this.keyPressHandler);
        this.parent.off(events.expandChildGrid, this.expand);
        this.parent.off(events.columnVisibilityChanged, this.refreshColSpan);
        this.parent.off(events.destroy, this.destroyChildGrids);
        this.parent.off(events.destroyChildGrid, this.destroyChildGrids);
    }

    private getTDfromIndex(index: number, className: string): Element {
        const tr: Element = this.parent.getDataRows()[index];
        if (tr && tr.querySelector(className)) {
            return tr.querySelector(className);
        }
        return null;
    }

    /**
     * Expands a detail row with the given target.
     *
     * @param  {Element} target - Defines the collapsed element to expand.
     * @returns {void}
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
     *
     * @param  {Element} target - Defines the expanded element to collapse.
     * @returns {void}
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
     *
     * @returns {void}
     */
    public expandAll(): void {
        this.expandCollapse(true);
        this.parent.trigger(events.actionComplete, { requestType: 'expandAllComplete', type: events.actionComplete, moduleObj: this });
    }

    /**
     * Collapses all the detail rows of the Grid.
     *
     * @returns {void}
     */
    public collapseAll(): void {
        this.expandCollapse(false);
        this.parent.trigger(events.actionComplete, { requestType: 'collapseAllComplete', type: events.actionComplete, moduleObj: this });
    }

    private expandCollapse(isExpand: boolean): void {
        let td: Element;
        const rows: Element[] = this.parent.getDataRows();
        for (let i: number = 0, len: number = rows.length; i < len; i++) {
            td = rows[i].querySelector('.e-detailrowcollapse, .e-detailrowexpand');
            if (isExpand) {
                this.expand(td);
            } else {
                this.collapse(td);
            }
        }
    }

    private keyPressHandler(e: KeyboardEventArgs): void {
        const gObj: IGrid = this.parent;
        switch (e.action) {
        case 'ctrlDownArrow':
            this.expandAll();
            break;
        case 'ctrlUpArrow':
            this.collapseAll();
            break;
        case 'altUpArrow':
        case 'altDownArrow':
            // eslint-disable-next-line no-case-declarations
            const selected: number[] = gObj.allowSelection ? gObj.getSelectedRowIndexes() : [];
            if (selected.length) {
                const dataRow: HTMLTableRowElement = gObj.getDataRows()[selected[selected.length - 1]] as HTMLTableRowElement;
                const td: Element = dataRow.querySelector('.e-detailrowcollapse, .e-detailrowexpand');
                if (e.action === 'altDownArrow') {
                    this.expand(td);
                } else {
                    this.collapse(td);
                }
            }
            break;
        case 'enter':
            if (this.parent.isEdit) { return; }
            // eslint-disable-next-line no-case-declarations
            const element: HTMLElement = this.focus.getFocusedElement();
            if (!(<Element>e.target).classList.contains('e-detailrowcollapse') &&
                !(<Element>e.target).classList.contains('e-detailrowexpand')) { break; }
            this.toogleExpandcollapse(element);
            break;
        }
    }

    private refreshColSpan(): void {
        const detailrows: NodeListOf<Element> = (<Grid>this.parent).contentModule.getTable().querySelectorAll('tr.e-detailrow');
        const colSpan: number = (<Grid>this.parent).getVisibleColumns().length;
        for (let i: number = 0; i < detailrows.length; i++) {
            (<HTMLElement>detailrows[i]).querySelector('.e-detailcell').setAttribute('colspan', colSpan + '');
        }
    }

    private destroyChildGrids(): void {
        const rows: Row<Column>[] = this.parent.getRowsObject();
        for (let i: number = 0; i < rows.length; i++) {
            rows[i].childGrid = null;
        }
        for (let i: number = 0; i < this.childRefs.length; i++) {
            if (!this.childRefs[i].isDestroyed) {
                this.childRefs[i].destroy();
            }
        }
        this.childRefs = [];
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {string} returns the module name
     * @private
     */
    protected getModuleName(): string {
        return 'detailRow';
    }

}
