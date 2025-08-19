import { KeyboardEventArgs, removeClass, addClass, extend, L10n, EventHandler } from '@syncfusion/ej2-base';
import { closest, classList, isNullOrUndefined } from '@syncfusion/ej2-base';
import { DetailTemplateDetachArgs, IGrid, InfiniteScrollArgs, NotifyArgs } from '../base/interface';
import { Grid } from '../base/grid';
import { parents, getUid, appendChildren, isComplexField, getObject } from '../base/util';
import * as events from '../base/constant';
import { AriaService } from '../services/aria-service';
import { ServiceLocator } from '../services/service-locator';
import { FocusStrategy } from '../services/focus-strategy';
import { Row } from '../models/row';
import { Cell } from '../models/cell';
import { Column } from '../models/column';
import { CellType } from '../base/enum';
import * as literals from '../base/string-literals';
import { ContentRender } from '../renderer';

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
    private l10n: L10n;
    private serviceLocator: ServiceLocator;
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
        this.serviceLocator = locator;
        this.focus = locator.getService<FocusStrategy>('focus');
        this.addEventListener();
    }

    /**
     * @returns {void}
     * @hidden
     */
    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        EventHandler.add(this.parent.element, 'auxclick', this.auxilaryclickHandler, this);
        this.parent.on(events.click, this.clickHandler, this);
        this.parent.on(events.destroy, this.destroy, this);
        this.parent.on(events.keyPressed, this.keyPressHandler, this);
        this.parent.on(events.expandChildGrid, this.expand, this);
        this.parent.on(events.columnVisibilityChanged, this.refreshColSpan, this);
        this.parent.on(events.destroy, this.destroyChildGrids, this);
        this.parent.on(events.destroyChildGrid, this.destroyChildGrids, this);
        this.parent.on(events.destroy, this.detachDetailTemplate, this);
        this.parent.on(events.detachDetailTemplate, this.detachDetailTemplate, this);
    }

    private clickHandler(e: MouseEvent): void {
        if (((e.target as Element).classList.contains('e-icon-grightarrow') || (e.target as Element).classList.contains('e-icon-gdownarrow'))
            && !this.parent.allowGrouping) {
            e.preventDefault();
        }
        this.toogleExpandcollapse(closest(e.target as Element, 'td'));
    }

    private auxilaryclickHandler(e: MouseEvent): void {
        if (((e.target as Element).classList.contains('e-icon-grightarrow') || (e.target as Element).classList.contains('e-icon-gdownarrow'))
            && !this.parent.allowGrouping && (e.button === 1)) {
            e.preventDefault();
        }
    }

    private toogleExpandcollapse(target: Element): void {
        this.l10n = this.serviceLocator.getService<L10n>('localization');
        const gObj: IGrid = this.parent;
        const table: Element = this.parent.getContentTable();
        const lastrowIdx: number = this.parent.getCurrentViewRecords().length - 1;
        const parent: string = 'parentDetails';
        let childGrid: Grid;
        const isExpanded: boolean = target &&  target.classList.contains('e-detailrowcollapse') ;
        if (!(target && (target.classList.contains('e-detailrowcollapse') || target.classList.contains('e-detailrowexpand')))
         || (target && target.classList.contains('e-masked-cell'))) {
            return;
        }
        const tr: HTMLTableRowElement = target.parentElement as HTMLTableRowElement;
        const uid: string = tr.getAttribute('data-uid');
        const rowObj: Row<Column> = gObj.getRowObjectFromUID(uid);
        if (isNullOrUndefined(rowObj)) {
            return;
        }
        let needToRefresh: boolean = false;
        const nextRow: HTMLElement =
            this.parent.getContentTable().querySelector( literals.tbody).children[tr.rowIndex + 1] as HTMLElement;
        if (target.classList.contains('e-detailrowcollapse')) {
            const data: Object = rowObj.data;
            if (this.isDetailRow(nextRow)) {
                nextRow.style.display = '';
                gObj.notify(events.detailStateChange, {data: data,
                    childGrid: gObj.childGrid, detailElement: target, isExpanded: isExpanded });
                needToRefresh = true;
            } else if (gObj.getDetailTemplate() || gObj.childGrid) {
                const rowId: string = getUid('grid-row');
                const detailRow: Element = this.parent.createElement('tr', { className: 'e-detailrow', attrs: {'data-uid': rowId, role: 'row'} });
                const detailCell: Element = this.parent.createElement('th', { className: 'e-detailcell', attrs: {'scope': 'col', role: 'columnheader'} });
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
                detailRow.appendChild(this.parent.createElement('th', { className: 'e-detailindentcell', attrs: {'scope': 'col'} }));
                detailRow.appendChild(detailCell);
                tr.parentNode.insertBefore(detailRow, tr.nextSibling);
                let isReactCompiler: boolean;
                let isReactChild: boolean;
                if (gObj.detailTemplate) {
                    isReactCompiler = this.parent.isReact && typeof (gObj.detailTemplate) !== 'string' &&
                        !(gObj.detailTemplate.prototype && gObj.detailTemplate.prototype.CSPTemplate);
                    isReactChild = this.parent.parentDetails && this.parent.parentDetails.parentInstObj &&
                        this.parent.parentDetails.parentInstObj.isReact;
                    const isReactPrintGrid: boolean = this.parent.printGridParent && this.parent.printGridParent.isReact;
                    const detailTemplateID: string = gObj.element.id + 'detailTemplate';
                    if (isReactCompiler || isReactChild || isReactPrintGrid) {
                        gObj.getDetailTemplate()(data, gObj, 'detailTemplate', detailTemplateID, null, null, detailCell);
                        this.parent.renderTemplates(function(): void {
                            gObj.trigger(events.detailDataBound, { detailElement: detailCell, data: data, childGrid: childGrid });
                        });
                    } else {
                        appendChildren(detailCell, gObj.getDetailTemplate()(data, gObj, 'detailTemplate', detailTemplateID,
                                                                            undefined, undefined, undefined, this.parent['root']));
                    }
                } else {
                    childGrid = new Grid(this.getGridModel(gObj, rowObj, gObj.printMode));
                    childGrid.height = gObj.enableInfiniteScrolling && childGrid.height === 'auto' ? 300 : childGrid.height;
                    childGrid.root = gObj.root ? gObj.root : gObj;
                    this.childRefs.push(childGrid);
                    if (childGrid.query) {
                        childGrid.query = childGrid.query.clone();
                    }
                    childGrid[`${parent}`] = {
                        parentID: gObj.element.id,
                        parentPrimaryKeys: gObj.getPrimaryKeyFieldNames(),
                        parentKeyField: gObj.childGrid.queryString,
                        parentKeyFieldValue: gObj.childGrid.queryString && isComplexField(gObj.childGrid.queryString) ?
                            getObject(gObj.childGrid.queryString, data) : data[gObj.childGrid.queryString],
                        parentRowData: data
                    };
                    if (gObj.isReact || gObj.isVue) {
                        childGrid.parentDetails.parentInstObj = gObj;
                    }
                    else if (gObj.parentDetails && gObj.parentDetails.parentInstObj && (gObj.parentDetails.parentInstObj.isReact
                        || gObj.parentDetails.parentInstObj.isVue)) {
                        childGrid.parentDetails.parentInstObj = gObj.parentDetails.parentInstObj;
                    }
                    if (gObj.printGridParent && gObj.printGridParent.isReact) {
                        childGrid.printGridParent = gObj.printGridParent;
                    }
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
                        '_grid' + tr.rowIndex + getUid(''), className: 'e-childgrid'
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
                if (gObj.enableInfiniteScrolling && gObj.infiniteScrollSettings.enableCache) {
                    const infiniteCache: { [x: number]: Row<Column>[]; } = (gObj.contentModule as ContentRender)
                        .infiniteCache as { [x: number]: Row<Column>[]; };
                    const keys: string[] = Object.keys(infiniteCache);
                    for (let i: number = 0; i < keys.length; i++) {
                        const cacheIndex: number = infiniteCache[parseInt(keys[parseInt(i.toString(), 10)], 10)].indexOf(rowObj);
                        if (cacheIndex !== -1) {
                            infiniteCache[parseInt(keys[parseInt(i.toString(), 10)], 10)].splice(cacheIndex + 1, 0, row);
                            break;
                        }
                    }
                } else {
                    rowObjs.splice(rowObjs.indexOf(rowObj) + 1, 0, row);
                }
                if (!isReactCompiler || !isReactChild) {
                    gObj.trigger(events.detailDataBound, { detailElement: detailCell, data: data, childGrid: childGrid });
                }
                gObj.notify(events.detailDataBound, { rows: rowObjs });
            }
            classList(target, ['e-detailrowexpand'], ['e-detailrowcollapse']);
            classList(target.firstElementChild, ['e-dtdiagonaldown', 'e-icon-gdownarrow'], ['e-dtdiagonalright', 'e-icon-grightarrow']);
            rowObj.isExpand = true;
            if (target.classList.contains('e-lastrowcell') && this.parent.getContent().clientHeight > table.scrollHeight) {
                removeClass(target.parentElement.querySelectorAll('td'), 'e-lastrowcell');
                const detailrowIdx: number = table.querySelector(literals.tbody).getElementsByClassName('e-detailrow').length - 1;
                addClass(table.querySelector(literals.tbody).getElementsByClassName('e-detailrow')[parseInt(detailrowIdx.toString(), 10)].childNodes, ['e-lastrowcell']);
                this.lastrowcell = true;
            }
            this.aria.setExpand(target as HTMLElement, true);
            target.firstElementChild.setAttribute('title', this.l10n.getConstant('Expanded'));
        } else {
            if (this.isDetailRow(nextRow)) {
                nextRow.style.display = 'none';
                gObj.notify(events.detailStateChange, { data: rowObj.data,
                    childGrid: gObj.childGrid, detailElement: target, isExpanded: isExpanded });
            }
            classList(target, ['e-detailrowcollapse'], ['e-detailrowexpand']);
            classList(target.firstElementChild, ['e-dtdiagonalright', 'e-icon-grightarrow'], ['e-dtdiagonaldown', 'e-icon-gdownarrow']);
            if (parseInt(tr.getAttribute(literals.ariaRowIndex), 10) - 1 === lastrowIdx && this.lastrowcell) {
                addClass(target.parentElement.querySelectorAll('td'), 'e-lastrowcell');
                this.lastrowcell = false;
            }
            rowObj.isExpand = false;
            needToRefresh = true;
            this.aria.setExpand(target as HTMLElement, false);
            target.firstElementChild.setAttribute('title', this.l10n.getConstant('Collapsed'));
        }
        if (!isNullOrUndefined(gObj.detailTemplate) || (gObj.childGrid && needToRefresh)) {
            gObj.updateVisibleExpandCollapseRows();
            gObj.notify(events.refreshExpandandCollapse, { rows: gObj.getRowsObject() });
        }
        if (this.parent.allowTextWrap && this.parent.height === 'auto'){
            if (this.parent.getContentTable().scrollHeight > this.parent.getContent().clientHeight) {
                this.parent.scrollModule.setPadding();
            }
            else{
                this.parent.scrollModule.removePadding();
            }
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
            gridModel = extend({}, gObj.expandedRows[rowObj.index].gridModel, gObj.childGrid, true);
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
        EventHandler.remove(this.parent.element, 'auxclick', this.auxilaryclickHandler);
        this.parent.off(events.click, this.clickHandler);
        this.parent.off(events.destroy, this.destroy);
        this.parent.off(events.keyPressed, this.keyPressHandler);
        this.parent.off(events.expandChildGrid, this.expand);
        this.parent.off(events.columnVisibilityChanged, this.refreshColSpan);
        this.parent.off(events.destroy, this.destroyChildGrids);
        this.parent.off(events.destroyChildGrid, this.destroyChildGrids);
        this.parent.off(events.destroy, this.detachDetailTemplate);
        this.parent.off(events.detachDetailTemplate, this.detachDetailTemplate);
    }

    private getTDfromIndex(index: number, className: string): Element {
        const tr: Element = !isNullOrUndefined(index) ? this.parent.getDataRows()[parseInt(index.toString(), 10)] : undefined;
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
            td = rows[parseInt(i.toString(), 10)].querySelector('.e-detailrowcollapse, .e-detailrowexpand');
            if (isExpand) {
                this.expand(td);
            } else {
                this.collapse(td);
            }
        }
    }

    private keyPressHandler(e: KeyboardEventArgs): void {
        const gObj: IGrid = this.parent;
        const isMacLike: boolean = /(Mac)/i.test(navigator.platform);
        if (isMacLike && e.metaKey) {
            if (e.action === 'downArrow') {
                e.action = 'ctrlDownArrow';
            } else if (e.action === 'upArrow') {
                e.action = 'ctrlUpArrow';
            }
        }
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
            let element: HTMLElement = this.focus.getFocusedElement();
            if (element && (element.classList.contains('e-icon-grightarrow') || element.classList.contains('e-icon-gdownarrow'))) {
                element = element.parentElement;
            }
            if (element && !element.classList.contains('e-detailrowcollapse') &&
                !element.classList.contains('e-detailrowexpand')) { break; }
            this.toogleExpandcollapse(element);
            break;
        }
    }

    private refreshColSpan(): void {
        const detailrows: NodeListOf<Element> = (<Grid>this.parent).contentModule.getTable().querySelectorAll('tr.e-detailrow');
        const colSpan: number = (<Grid>this.parent).getVisibleColumns().length;
        for (let i: number = 0; i < detailrows.length; i++) {
            (<HTMLElement>detailrows[parseInt(i.toString(), 10)]).querySelector('.e-detailcell').setAttribute('colspan', colSpan + '');
        }
    }

    private destroyChildGrids(args?: NotifyArgs): void {
        const gObj: IGrid = this.parent;
        if (gObj.enableInfiniteScrolling && (gObj.childGrid || gObj.detailTemplate) && args.requestType === 'infiniteScroll'
            && gObj.infiniteScrollSettings.enableCache) {
            const cacheIndex: number = (args as InfiniteScrollArgs).direction === 'down'
                ? (args as InfiniteScrollArgs).currentPage - gObj.infiniteScrollSettings.initialBlocks
                : (args as InfiniteScrollArgs).currentPage + gObj.infiniteScrollSettings.initialBlocks;
            const infiniteCache: Row<Column>[] = (gObj.contentModule as ContentRender)
                .infiniteCache[parseInt(cacheIndex.toString(), 10)] as Row<Column>[];
            const detailRows: Row<Column>[] = infiniteCache.filter((data: Row<Column>) => data.isDetailRow && data.parentUid);
            if (gObj.childGrid) {
                for (let i: number = 0; i < detailRows.length; i++) {
                    const detailRow: Element = gObj.getContentTable()
                        .querySelector('[data-uid="' + detailRows[parseInt(i.toString(), 10)].uid + '"]');
                    const childGridElement: Element = detailRow.querySelector('.e-childgrid');
                    const childGridIndex: number = this.childRefs.findIndex((grid: Grid) => grid.element.id === childGridElement.id);
                    if (!this.childRefs[parseInt(childGridIndex.toString(), 10)].isDestroyed) {
                        this.childRefs[parseInt(childGridIndex.toString(), 10)].destroy();
                        this.childRefs.splice(childGridIndex, 1);
                    }
                    const detailRowIndex: number = infiniteCache.indexOf(detailRows[parseInt(i.toString(), 10)]);
                    infiniteCache.splice(detailRowIndex, 1);
                    infiniteCache[detailRowIndex - 1].childGrid = null;
                    infiniteCache[detailRowIndex - 1].isExpand = false;
                    detailRow.remove();
                }
            }
            if (gObj.detailTemplate && detailRows.length) {
                const args: DetailTemplateDetachArgs = [];
                for (let i: number = 0; i < detailRows.length; i++) {
                    args.push({
                        detailRow: gObj.getContentTable().querySelector('[data-uid="' + detailRows[parseInt(i.toString(), 10)].uid + '"]'),
                        detailRowObject: detailRows[parseInt(i.toString(), 10)],
                        parentRowObject: infiniteCache.find((parent: Row<Column>) => detailRows[parseInt(i.toString(), 10)]
                            .parentUid === parent.uid)
                    });
                }
                this.parent.trigger(events.beforeDetailTemplateDetach, args, () => {
                    for (let i: number = 0; i < detailRows.length; i++) {
                        const detailRow: Element = gObj.getContentTable()
                            .querySelector('[data-uid="' + detailRows[parseInt(i.toString(), 10)].uid + '"]');
                        const detailRowIndex: number = infiniteCache.indexOf(detailRows[parseInt(i.toString(), 10)]);
                        infiniteCache.splice(detailRowIndex, 1);
                        infiniteCache[detailRowIndex - 1].isExpand = false;
                        detailRow.remove();
                    }
                });
            }
            return;
        }
        const rows: Row<Column>[] = this.parent.getRowsObject();
        for (let i: number = 0; i < rows.length; i++) {
            rows[parseInt(i.toString(), 10)].childGrid = null;
        }
        for (let i: number = 0; i < this.childRefs.length; i++) {
            if (!this.childRefs[parseInt(i.toString(), 10)].isDestroyed) {
                this.childRefs[parseInt(i.toString(), 10)].destroy();
            }
        }
        this.childRefs = [];
    }

    private detachDetailTemplate(): void {
        const gObj: IGrid = this.parent;
        if (gObj.detailTemplate) {
            const rowsObject: Row<Column>[] = gObj.getRowsObject();
            const detailRows: Row<Column>[] = rowsObject.filter((data: Row<Column>) => data.isDetailRow && data.parentUid);
            if (detailRows.length) {
                const args: DetailTemplateDetachArgs = [];
                detailRows.map((data: Row<Column>) => {
                    args.push({
                        detailRow: gObj.getContentTable().querySelector('[data-uid="' + data.uid + '"]'),
                        detailRowObject: data,
                        parentRowObject: rowsObject.find((parent: Row<Column>) => data.parentUid === parent.uid)
                    });
                });
                gObj.trigger(events.beforeDetailTemplateDetach, args, () => {
                    detailRows.map((data: Row<Column>) => {
                        gObj.getContentTable().querySelector('[data-uid="' + data.uid + '"]').remove();
                    });
                });
            }
        }
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
