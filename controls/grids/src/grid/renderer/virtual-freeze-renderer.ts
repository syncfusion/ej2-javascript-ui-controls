import { extend, isNullOrUndefined } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { FreezeContentRender, FreezeRender } from './freeze-renderer';
import { ColumnFreezeContentRenderer } from './column-freeze-renderer';
import { IGrid, IRenderer, NotifyArgs, InterSection, IModelGenerator } from '../base/interface';
import { ServiceLocator } from '../services/service-locator';
import { VirtualContentRenderer, VirtualHeaderRenderer } from './virtual-content-renderer';
import { RowRenderer } from '../renderer/row-renderer';
import { FreezeRowModelGenerator } from '../services/freeze-row-model-generator';
import { RowModelGenerator } from '../services/row-model-generator';
import { RendererFactory } from '../services/renderer-factory';
import { RenderType, freezeTable } from '../base/enum';
import { ReturnType } from '../base/type';
import { InterSectionObserver } from '../services/intersection-observer';
import { Row } from '../models/row';
import { Cell } from '../models/cell';
import { Column } from '../models/column';
import * as events from '../base/constant';
import { getFrozenTableName, splitFrozenRowObjectCells } from '../base/util';
import { ColumnWidthService } from '../services/width-controller';

/**
 * VirtualFreezeRenderer is used to render the virtual table within the frozen and movable content table
 * @hidden
 */
export class VirtualFreezeRenderer extends FreezeContentRender implements IRenderer {
    protected serviceLoc: ServiceLocator;
    public rowModelGenerator: IModelGenerator<Column>;

    constructor(parent?: IGrid, locator?: ServiceLocator) {
        super(parent, locator);
        this.serviceLoc = locator;
        this.eventListener('on');
        this.rowModelGenerator = new RowModelGenerator(this.parent);
    }

    protected freezeRowGenerator: FreezeRowModelGenerator;
    /** @hidden */
    public virtualRenderer: VirtualContentRenderer;
    protected firstPageRecords: Object[];
    protected scrollbar: HTMLElement;
    /** @hidden */
    public frzRows: Row<Column>[] = [];
    /** @hidden */
    public mvblRows: Row<Column>[] = [];
    /** @hidden */
    public frRows: Row<Column>[] = [];

    public eventListener(action: string): void {
        this.parent[action](events.getVirtualData, this.getVirtualData, this);
        this.parent[action](events.setFreezeSelection, this.setFreezeSelection, this);
        this.parent[action](events.refreshVirtualFrozenRows, this.refreshVirtualFrozenRows, this);
        this.parent.addEventListener(events.actionComplete, this.actionComplete.bind(this));
    }

    protected actionComplete(args: NotifyArgs): void {
        if (args.requestType === 'delete' && this.parent.frozenRows) {
            for (let i: number = 0; i < this.parent.frozenRows; i++) {
                setCache(this, i);
            }
        }
    }

    private refreshVirtualFrozenRows(args: NotifyArgs): void {
        let gObj: IGrid = this.parent;
        if (args.requestType === 'delete' && gObj.frozenRows) {
            args.isFrozenRowsRender = true;
            let selectedIdx: number[] = gObj.getSelectedRowIndexes();
            let query: Query = gObj.renderModule.data.generateQuery(true).clone();
            query.page(1, gObj.pageSettings.pageSize);
            gObj.renderModule.data.getData({}, query).then((e: ReturnType) => {
                renderFrozenRows(
                    args, e.result, selectedIdx, gObj, this.rowModelGenerator,
                    this.serviceLoc, this.virtualRenderer, this
                );
            });
        }
    }

    private getVirtualData(data: { virtualData: Object, isAdd: boolean, isCancel: boolean }): void {
        this.virtualRenderer.getVirtualData(data);
    }

    private setFreezeSelection(args: { uid: string, set: boolean, clearAll?: boolean }): void {
        setFreezeSelection(args, this.virtualRenderer);
    }

    /**
     * @hidden
     */
    public renderTable(): void {
        this.freezeRowGenerator = new FreezeRowModelGenerator(this.parent);
        this.virtualRenderer = new VirtualContentRenderer(this.parent, this.serviceLoc);
        this.virtualRenderer.header = (this.serviceLoc.getService<RendererFactory>('rendererFactory')
            .getRenderer(RenderType.Header) as VirtualFreezeHdrRenderer).virtualHdrRenderer;

        super.renderTable();
        this.virtualRenderer.setPanel(this.parent.getContent());
        this.scrollbar = this.parent.getContent().querySelector('.e-movablescrollbar');
        let frzCont: Element = this.getFrozenContent();
        let movableCont: Element = this.getMovableContent();
        let minHeight: number = <number>this.parent.height;
        this.virtualRenderer.virtualEle.content = this.virtualRenderer.content = <HTMLElement>this.getPanel().querySelector('.e-content');
        (this.virtualRenderer.virtualEle.content as HTMLElement).style.overflowX = 'hidden';
        this.virtualRenderer.virtualEle.renderFrozenWrapper(minHeight);
        this.virtualRenderer.virtualEle.renderFrozenPlaceHolder();
        if (this.parent.enableColumnVirtualization) {
            this.virtualRenderer.virtualEle.movableContent = this.virtualRenderer.movableContent
                = <HTMLElement>this.getPanel().querySelector('.e-movablecontent');
            this.virtualRenderer.virtualEle.renderMovableWrapper(minHeight);
            this.virtualRenderer.virtualEle.renderMovablePlaceHolder();
            let tbl: HTMLElement = movableCont.querySelector('table');
            this.virtualRenderer.virtualEle.movableTable = tbl;
            this.virtualRenderer.virtualEle.movableWrapper.appendChild(tbl);
            movableCont.appendChild(this.virtualRenderer.virtualEle.movableWrapper);
            movableCont.appendChild(this.virtualRenderer.virtualEle.movablePlaceholder);
        }
        this.virtualRenderer.virtualEle.wrapper.appendChild(frzCont);
        this.virtualRenderer.virtualEle.wrapper.appendChild(movableCont);
        this.virtualRenderer.virtualEle.table = <HTMLElement>this.getTable();
        setDebounce(this.parent, this.virtualRenderer, this.scrollbar, this.getMovableContent());
    }

    /**
     * @hidden
     */
    public appendContent(target: HTMLElement, newChild: DocumentFragment, e: NotifyArgs): void {
        appendContent(this.virtualRenderer, this.widthService, target, newChild, e);
    }

    /**
     * @hidden
     */
    public generateRows(data: Object[], notifyArgs?: NotifyArgs): Row<Column>[] {
        if (!this.firstPageRecords) {
            this.firstPageRecords = data;
        }
        return generateRows(this.virtualRenderer, data, notifyArgs, this.freezeRowGenerator, this.parent);
    }

    /**
     * @hidden
     */
    public getRowByIndex(index: number): Element {
        return this.virtualRenderer.getRowByIndex(index);
    }

    /**
     * @hidden
     */
    public getMovableRowByIndex(index: number): Element {
        return this.virtualRenderer.getMovableVirtualRowByIndex(index);
    }

    private collectRows(tableName: freezeTable): Row<Column>[] {
        return collectRows(tableName, this.virtualRenderer, this.parent);
    }

    /**
     * @hidden
     */
    public getMovableRows(): Row<Column>[] | HTMLCollectionOf<HTMLTableRowElement> {
        return this.collectRows('movable');
    }

    /**
     * @hidden
     */
    public getRows(): Row<Column>[] | HTMLCollectionOf<HTMLTableRowElement> {
        return this.collectRows('frozen-left');
    }

    /**
     * @hidden
     */
    public getColGroup(): Element {
        let mCol: Element = this.parent.getMovableVirtualContent();
        return this.isXaxis() ? mCol.querySelector('colgroup') : this.colgroup;
    }

    /**
     * @hidden
     */
    public getReorderedFrozenRows(args: NotifyArgs): Row<Column>[] {
        return getReorderedFrozenRows(args, this.virtualRenderer, this.parent, this.freezeRowGenerator, this.firstPageRecords);
    }

    protected isXaxis(): boolean {
       return isXaxis(this.virtualRenderer);
    }

    protected getHeaderCells(): Element[] {
        return getHeaderCells(this.virtualRenderer, this.parent);
    }

    protected getVirtualFreezeHeader(): Element {
        return getVirtualFreezeHeader(this.virtualRenderer, this.parent);
    }

    protected ensureFrozenCols(columns: Column[]): Column[] {
        return ensureFrozenCols(columns, this.parent);
    }

    /**
     * @hidden
     */
    public getRowObjectByIndex(index: number): Object {
        return this.virtualRenderer.getRowObjectByIndex(index);
    }

    /**
     * Set the header colgroup element
     * @param {Element} colgroup
     * @returns {Element}
     */
    public setColGroup(colGroup: Element): Element {
        return setColGroup(colGroup, this.virtualRenderer, this);
    }
}

/**
 * VirtualFreezeHdrRenderer is used to render the virtual table within the frozen and movable header table
 * @hidden
 */
export class VirtualFreezeHdrRenderer extends FreezeRender implements IRenderer {
    protected serviceLoc: ServiceLocator;
    constructor(parent?: IGrid, locator?: ServiceLocator) {
        super(parent, locator);
        this.serviceLoc = locator;
    }

    public virtualHdrRenderer: VirtualHeaderRenderer;

    /**
     * @hidden
     */
    public renderTable(): void {
        this.virtualHdrRenderer = new VirtualHeaderRenderer(this.parent, this.serviceLoc);

        this.virtualHdrRenderer.gen.refreshColOffsets();
        this.parent.setColumnIndexesInView(this.virtualHdrRenderer.gen.getColumnIndexes(<HTMLElement>this.getPanel()
            .querySelector('.e-headercontent')));
        this.virtualHdrRenderer.virtualEle.content = <HTMLElement>this.getPanel().querySelector('.e-headercontent');
        this.virtualHdrRenderer.virtualEle.renderFrozenWrapper();
        this.virtualHdrRenderer.virtualEle.renderFrozenPlaceHolder();
        if (this.parent.enableColumnVirtualization) {
            this.virtualHdrRenderer.virtualEle.movableContent = <HTMLElement>this.getPanel().querySelector('.e-movableheader');
            this.virtualHdrRenderer.virtualEle.renderMovableWrapper();
            this.virtualHdrRenderer.virtualEle.renderMovablePlaceHolder();
        }
        super.renderTable();
        this.virtualHdrRenderer.setPanel(this.parent.getHeaderContent());
    }

    protected rfshMovable(): void {
        this.getFrozenHeader().appendChild(this.getTable());
        this.virtualHdrRenderer.virtualEle.wrapper.appendChild(this.getFrozenHeader());
        if (this.parent.enableColumnVirtualization) {
            this.virtualHdrRenderer.virtualEle.movableWrapper.appendChild(this.createTable());
        } else {
            this.getMovableHeader().appendChild(this.createTable());
        }
        this.virtualHdrRenderer.virtualEle.wrapper.appendChild(this.getMovableHeader());
    }
}

/** @hidden */
export function renderFrozenRows(
    args: NotifyArgs, data: Object[], selectedIdx: number[], parent: IGrid, rowModelGenerator: IModelGenerator<Column>,
    locator: ServiceLocator, virtualRenderer: VirtualContentRenderer, instance: VirtualFreezeRenderer | ColumnVirtualFreezeRenderer
): void {
    parent.clearSelection();
    (<{ startIndex?: number }>args).startIndex = 0;
    let rowRenderer: RowRenderer<Column> = new RowRenderer<Column>(locator, null, parent);
    let rows: Row<Column>[] = rowModelGenerator.generateRows(data, args);
    if (args.renderMovableContent) {
        virtualRenderer.vgenerator.movableCache[1] = rows;
        rows = parent.getMovableRowsObject();
    } else if (!args.renderFrozenRightContent && !args.renderMovableContent) {
        virtualRenderer.vgenerator.cache[1] = rows;
        rows = parent.getRowsObject();
    } else if (args.renderFrozenRightContent) {
        virtualRenderer.vgenerator.frozenRightCache[1] = rows;
        rows = parent.getFrozenRightRowsObject();
    }
    let hdr: Element = !args.renderMovableContent && !args.renderFrozenRightContent
        ? parent.getHeaderContent().querySelector('.e-frozenheader').querySelector('tbody') : args.renderMovableContent
            ? parent.getHeaderContent().querySelector('.e-movableheader').querySelector('tbody')
            : parent.getHeaderContent().querySelector('.e-frozen-right-header').querySelector('tbody');
    hdr.innerHTML = '';
    for (let i: number = 0; i < parent.frozenRows; i++) {
        hdr.appendChild(rowRenderer.render(rows[i], parent.getColumns()));
        if (selectedIdx.indexOf(i) > -1) {
            rows[i].isSelected = true;
            for (let k: number = 0; k < rows[i].cells.length; k++) {
                rows[i].cells[k].isSelected = true;
            }
        }
    }
    if (args.renderMovableContent) {
        instance.mvblRows = virtualRenderer.vgenerator.movableCache[1];
    } else if (!args.renderMovableContent && !args.renderFrozenRightContent) {
        instance.frzRows = virtualRenderer.vgenerator.cache[1];
    } else if (args.renderFrozenRightContent) {
        instance.frRows = virtualRenderer.vgenerator.frozenRightCache[1];
    }
    args.renderMovableContent = !args.renderMovableContent && !args.renderFrozenRightContent;
    args.renderFrozenRightContent = parent.getFrozenMode() === 'Left-Right'
        && !args.renderMovableContent && !args.renderFrozenRightContent;
    if (args.renderMovableContent || args.renderFrozenRightContent) {
        renderFrozenRows(args, data, selectedIdx, parent, rowModelGenerator, locator, virtualRenderer, instance);
        if (!args.renderMovableContent && !args.renderFrozenRightContent) {
            args.isFrozenRowsRender = false;
        }
    }
}

/** @hidden */
export function splitCells(data: Row<Column>[], tableName: freezeTable, parent: IGrid): Row<Column>[] {
    let rows: Row<Column>[] = [];
    for (let i: number = 0; i < data.length; i++) {
        rows.push(extend({}, data[i]) as Row<Column>);
        rows[i].cells = splitFrozenRowObjectCells(parent, rows[i].cells, tableName);
    }
    return rows;
}

/** @hidden */
export function collectRows(tableName: freezeTable, virtualRenderer: VirtualContentRenderer, parent: IGrid): Row<Column>[] {
    let rows: Row<Column>[] = [];
    let cache: { [x: number]: Row<Column>[] };
    if (tableName === 'frozen-left') {
        cache = virtualRenderer.vgenerator.cache;
    } else if (tableName === 'movable') {
        cache = virtualRenderer.vgenerator.movableCache;
    } else if (tableName === 'frozen-right') {
        cache = parent.getFrozenMode() === 'Right' ? virtualRenderer.vgenerator.cache : virtualRenderer.vgenerator.frozenRightCache;
    }
    let keys: string[] = Object.keys(cache);
    for (let i: number = 0; i < keys.length; i++) {
        rows = [...rows, ...splitCells(cache[keys[i]], tableName, parent)];
    }
    return rows;
}

/** @hidden */
export function setFreezeSelection(args: { uid: string, set: boolean, clearAll?: boolean }, virtualRenderer: VirtualContentRenderer): void {
    let leftKeys: string[] = Object.keys(virtualRenderer.vgenerator.cache);
    let movableKeys: string[] = Object.keys(virtualRenderer.vgenerator.movableCache);
    let rightKeys: string[] = Object.keys(virtualRenderer.vgenerator.frozenRightCache);
    for (let i: number = 0; i < leftKeys.length; i++) {
        selectFreezeRows(args, virtualRenderer.vgenerator.cache[leftKeys[i]]);
    }
    for (let i: number = 0; i < movableKeys.length; i++) {
        selectFreezeRows(args, virtualRenderer.vgenerator.movableCache[movableKeys[i]]);
    }
    for (let i: number = 0; i < rightKeys.length; i++) {
        selectFreezeRows(args, virtualRenderer.vgenerator.frozenRightCache[rightKeys[i]]);
    }
}

/** @hidden */
export function selectFreezeRows(args: { uid: string, set: boolean, clearAll?: boolean }, cache: Row<Column>[]): void {
    let rows: Row<Column>[] = cache.filter((row: Row<Column>) => args.clearAll || args.uid === row.uid);
    for (let j: number = 0; j < rows.length; j++) {
        rows[j].isSelected = args.set;
        let cells: Cell<Column>[] = rows[j].cells;
        for (let k: number = 0; k < cells.length; k++) {
            cells[k].isSelected = args.set;
        }
    }
}

/** @hidden */
export function appendContent(
    virtualRenderer: VirtualContentRenderer, widthService: ColumnWidthService, target: HTMLElement,
    newChild: DocumentFragment, e: NotifyArgs
): void {
    virtualRenderer.appendContent(target, newChild, e);
    widthService.refreshFrozenScrollbar();
}

/** @hidden */
export function generateRows(
    virtualRenderer: VirtualContentRenderer, data: Object[], notifyArgs: NotifyArgs,
    freezeRowGenerator: FreezeRowModelGenerator, parent: IGrid
): Row<Column>[] {
    let virtualRows: Row<Column>[] = virtualRenderer.vgenerator.generateRows(data, notifyArgs);
    let arr: Row<Column>[] = [];
    arr = virtualRows.map((row: Row<Column>) => extend({}, row) as Row<Column>);
    let rows: Row<Column>[] = freezeRowGenerator.generateRows(data, notifyArgs, arr);
    if (parent.frozenRows && notifyArgs.requestType === 'delete' && parent.pageSettings.currentPage === 1) {
        rows = rows.slice(parent.frozenRows);
    }
    return rows;
}

/** @hidden */
export function getReorderedFrozenRows(
    args: NotifyArgs, virtualRenderer: VirtualContentRenderer, parent: IGrid, freezeRowGenerator: FreezeRowModelGenerator,
    firstPageRecords: Object[]
): Row<Column>[] {
    let rows: Row<Column>[];
    let bIndex: number[] = args.virtualInfo.blockIndexes;
    let colIndex: number[] = args.virtualInfo.columnIndexes;
    let page: number = args.virtualInfo.page;
    args.virtualInfo.blockIndexes = [1, 2];
    args.virtualInfo.page = 1;
    if (!args.renderMovableContent) {
        args.virtualInfo.columnIndexes = [];
    }
    let virtualRows: Row<Column>[] = virtualRenderer.vgenerator.generateRows(firstPageRecords, args);
    rows = splitReorderedRows(virtualRows, parent, freezeRowGenerator);
    args.virtualInfo.blockIndexes = bIndex;
    args.virtualInfo.columnIndexes = colIndex;
    args.virtualInfo.page = page;
    return rows.splice(0, parent.frozenRows);
}

/** @hidden */
export function splitReorderedRows(rows: Row<Column>[], parent: IGrid, freezeRowGenerator: FreezeRowModelGenerator): Row<Column>[] {
    let tableName: freezeTable = getFrozenTableName(parent, parent.tableIndex);
    for (let i: number = 0, len: number = rows.length; i < len; i++) {
        rows[i].cells = splitFrozenRowObjectCells(parent, rows[i].cells, tableName);
    }
    return rows;
}

/** @hidden */
export function isXaxis(virtualRenderer: VirtualContentRenderer): boolean {
    let value: boolean = false;
    if (virtualRenderer) {
        value = virtualRenderer.requestType === 'virtualscroll'
            && virtualRenderer.currentInfo.sentinelInfo.axis === 'X';
    }
    return value;
}

/** @hidden */
export function getHeaderCells(virtualRenderer: VirtualContentRenderer, parent: IGrid): Element[] {
    let content: Element = isXaxis(virtualRenderer) ? parent.getMovableVirtualHeader() : parent.getHeaderContent();
    return content ? [].slice.call(content.querySelectorAll('.e-headercell:not(.e-stackedheadercell)')) : [];
}

/** @hidden */
export function getVirtualFreezeHeader(virtualRenderer: VirtualContentRenderer, parent: IGrid): Element {
    let headerTable: Element;
    if (isXaxis(virtualRenderer)) {
        headerTable = parent.getMovableVirtualHeader().querySelector('.e-table');
    } else {
        headerTable = parent.getFrozenVirtualHeader().querySelector('.e-table');
    }
    return headerTable;
}

/** @hidden */
export function ensureFrozenCols(columns: Column[], parent: IGrid): Column[] {
    let frozenCols: Column[] = parent.columns.slice(0, parent.getFrozenColumns()) as Column[];
    columns = frozenCols.concat(columns);
    return columns;
}

/** @hidden */
export function setColGroup(
    colGroup: Element, virtualRenderer: VirtualContentRenderer, instance: ColumnVirtualFreezeRenderer | VirtualFreezeRenderer
): Element {
    if (!isXaxis(virtualRenderer)) {
        if (!isNullOrUndefined(colGroup)) {
            colGroup.id = 'content-' + colGroup.id;
        }
        instance.colgroup = colGroup;
    }
    return instance.colgroup;
}

/** @hidden */
export function setCache(instance: VirtualFreezeRenderer | ColumnVirtualFreezeRenderer, index: number): void {
    if (instance.virtualRenderer.vgenerator.cache[1]) {
        instance.virtualRenderer.vgenerator.cache[1][index] = instance.frzRows[index];
    } else {
        instance.virtualRenderer.vgenerator.cache[1] = instance.frzRows;
    }
    if (instance.virtualRenderer.vgenerator.movableCache[1]) {
        instance.virtualRenderer.vgenerator.movableCache[1][index] = instance.mvblRows[index];
    } else {
        instance.virtualRenderer.vgenerator.movableCache[1] = instance.mvblRows;
    }
}

/** @hidden */
export function setDebounce(parent: IGrid, virtualRenderer: VirtualContentRenderer, scrollbar: Element, mCont: Element): void {
    let debounceEvent: boolean = (parent.dataSource instanceof DataManager && !parent.dataSource.dataSource.offline);
    let opt: InterSection = {
        container: virtualRenderer.content, pageHeight: virtualRenderer.getBlockHeight() * 2, debounceEvent: debounceEvent,
        axes: parent.enableColumnVirtualization ? ['X', 'Y'] : ['Y'], scrollbar: scrollbar,
        movableContainer: mCont
    };
    virtualRenderer.observer = new InterSectionObserver(
        virtualRenderer.virtualEle.wrapper, opt, virtualRenderer.virtualEle.movableWrapper
    );
}


/**
 * ColumnVirtualFreezeRenderer is used to render the virtual table within the frozen and movable content table
 * @hidden
 */
export class ColumnVirtualFreezeRenderer extends ColumnFreezeContentRenderer implements IRenderer {
    protected serviceLoc: ServiceLocator;
    public rowModelGenerator: IModelGenerator<Column>;

    constructor(parent?: IGrid, locator?: ServiceLocator) {
        super(parent, locator);
        this.serviceLoc = locator;
        this.eventListener('on');
        this.rowModelGenerator = new RowModelGenerator(this.parent);
    }

    /** @hidden */
    public virtualRenderer: VirtualContentRenderer;
    protected freezeRowGenerator: FreezeRowModelGenerator;
    protected firstPageRecords: Object[];
    protected scrollbar: HTMLElement;
    /** @hidden */
    public frRows: Row<Column>[] = [];
    /** @hidden */
    public frzRows: Row<Column>[] = [];
    /** @hidden */
    public mvblRows: Row<Column>[] = [];

    protected actionComplete(args: NotifyArgs): void {
        if (args.requestType === 'delete' && this.parent.frozenRows) {
            for (let i: number = 0; i < this.parent.frozenRows; i++) {
                if (this.virtualRenderer.vgenerator.frozenRightCache[1]) {
                    this.virtualRenderer.vgenerator.frozenRightCache[1][i] = this.frRows.length ? this.frRows[i] : this.frzRows[i];
                } else {
                    this.virtualRenderer.vgenerator.frozenRightCache[1] = this.frRows.length ? this.frRows : this.frzRows;
                    break;
                }
                setCache(this, i);
            }
        }
    }

    public eventListener(action: string): void {
        this.parent.addEventListener(events.actionComplete, this.actionComplete.bind(this));
        this.parent[action](events.refreshVirtualFrozenRows, this.refreshVirtualFrozenRows, this);
        this.parent[action](events.getVirtualData, this.getVirtualData, this);
        this.parent[action](events.setFreezeSelection, this.setFreezeSelection, this);
    }

    private refreshVirtualFrozenRows(args: NotifyArgs): void {
        if (args.requestType === 'delete' && this.parent.frozenRows) {
            args.isFrozenRowsRender = true;
            let query: Query = this.parent.renderModule.data.generateQuery(true).clone();
            query.page(1, this.parent.pageSettings.pageSize);
            let selectedIdx: number[] = this.parent.getSelectedRowIndexes();
            this.parent.renderModule.data.getData({}, query).then((e: ReturnType) => {
                renderFrozenRows(
                    args, e.result, selectedIdx, this.parent, this.rowModelGenerator, this.serviceLoc, this.virtualRenderer, this
                );
            });
        }
    }

    private setFreezeSelection(args: { uid: string, set: boolean, clearAll?: boolean }): void {
        setFreezeSelection(args, this.virtualRenderer);
    }

    private getVirtualData(data: { virtualData: Object, isAdd: boolean, isCancel: boolean }): void {
        this.virtualRenderer.getVirtualData(data);
    }

    public renderNextFrozentPart(e: NotifyArgs): void {
        if (this.parent.getFrozenMode() === 'Left' || this.parent.getFrozenMode() === 'Right') {
            if (this.parent.tableIndex === 1) {
                e.renderMovableContent = true;
                this.refreshContentRows(extend({}, e));
            }
        }
        if (this.parent.getFrozenMode() === 'Left-Right') {
            if (this.parent.tableIndex === 1 || this.parent.tableIndex === 2) {
                e.renderMovableContent = this.parent.tableIndex === 1;
                e.renderFrozenRightContent = this.parent.tableIndex === 2;
                this.refreshContentRows(extend({}, e));
            }
        }
    }

    /**
     * @hidden
     */
    public renderTable(): void {
        this.virtualRenderer = new VirtualContentRenderer(this.parent, this.serviceLoc);
        this.virtualRenderer.header = (this.serviceLoc.getService<RendererFactory>('rendererFactory')
            .getRenderer(RenderType.Header) as VirtualFreezeHdrRenderer).virtualHdrRenderer;
        this.freezeRowGenerator = new FreezeRowModelGenerator(this.parent);

        super.renderTable();
        this.virtualRenderer.setPanel(this.parent.getContent());
        this.scrollbar = this.parent.getContent().querySelector('.e-movablescrollbar');
        let frozenRightCont: Element = this.getFrozenRightContent();
        let frzCont: Element = this.getFrozenContent();
        let movableCont: Element = this.getMovableContent();
        if (this.parent.getFrozenMode() === 'Right') {
            frzCont = frozenRightCont;
        }
        this.virtualRenderer.virtualEle.content = this.virtualRenderer.content = <HTMLElement>this.getPanel().querySelector('.e-content');
        (this.virtualRenderer.virtualEle.content as HTMLElement).style.overflowX = 'hidden';
        let minHeight: number = <number>this.parent.height;
        this.virtualRenderer.virtualEle.renderFrozenWrapper(minHeight);
        this.virtualRenderer.virtualEle.renderFrozenPlaceHolder();
        this.renderVirtualFrozenLeft(frzCont, movableCont);
        this.renderVirtualFrozenRight(frzCont, movableCont);
        this.renderVirtualFrozenLeftRight(frzCont, movableCont, frozenRightCont);
        this.virtualRenderer.virtualEle.table = <HTMLElement>this.getTable();
        setDebounce(this.parent, this.virtualRenderer, this.scrollbar, this.getMovableContent());
    }

    private renderVirtualFrozenLeft(frzCont: Element, movableCont: Element): void {
        if (this.parent.getFrozenMode() === 'Left') {
            this.virtualRenderer.virtualEle.wrapper.appendChild(frzCont);
            this.virtualRenderer.virtualEle.wrapper.appendChild(movableCont);
        }
    }

    private renderVirtualFrozenRight(frzCont: Element, movableCont: Element): void {
        if (this.parent.getFrozenMode() === 'Right') {
            this.virtualRenderer.virtualEle.wrapper.appendChild(movableCont);
            this.virtualRenderer.virtualEle.wrapper.appendChild(frzCont);
        }
    }

    private renderVirtualFrozenLeftRight(frzCont: Element, movableCont: Element, frozenRightCont: Element): void {
        if (this.parent.getFrozenMode() === 'Left-Right') {
            this.virtualRenderer.virtualEle.wrapper.appendChild(frzCont);
            this.virtualRenderer.virtualEle.wrapper.appendChild(movableCont);
            this.virtualRenderer.virtualEle.wrapper.appendChild(frozenRightCont);
        }
    }

    /**
     * @hidden
     */
    public appendContent(target: HTMLElement, newChild: DocumentFragment, e: NotifyArgs): void {
        appendContent(this.virtualRenderer, this.widthService, target, newChild, e);
        this.refreshScrollOffset();
    }

    /**
     * @hidden
     */
    public generateRows(data: Object[], e?: NotifyArgs): Row<Column>[] {
        if (!this.firstPageRecords) {
            this.firstPageRecords = data;
        }
        return generateRows(this.virtualRenderer, data, e, this.freezeRowGenerator, this.parent);
    }

    /**
     * @hidden
     */
    public getRowByIndex(index: number): Element {
        return this.virtualRenderer.getRowByIndex(index);
    }

    /**
     * @hidden
     */
    public getFrozenRightRowByIndex(index: number): Element {
        return this.virtualRenderer.getFrozenRightVirtualRowByIndex(index);
    }

    private collectRows(tableName: freezeTable): Row<Column>[] {
        return collectRows(tableName, this.virtualRenderer, this.parent);
    }

    /**
     * @hidden
     */
    public getMovableRowByIndex(index: number): Element {
        return this.virtualRenderer.getMovableVirtualRowByIndex(index);
    }

    /**
     * @hidden
     */
    public getFrozenRightRows(): Row<Column>[] | HTMLCollectionOf<HTMLTableRowElement> {
        return this.collectRows('frozen-right');
    }

    /**
     * @hidden
     */
    public getMovableRows(): Row<Column>[] | HTMLCollectionOf<HTMLTableRowElement> {
        return this.collectRows('movable');
    }

    /**
     * @hidden
     */
    public getColGroup(): Element {
        let mCol: Element = this.parent.getMovableVirtualContent();
        return isXaxis(this.virtualRenderer) ? mCol.querySelector('colgroup') : this.colgroup;
    }

    /**
     * @hidden
     */
    public getRows(): Row<Column>[] | HTMLCollectionOf<HTMLTableRowElement> {
        return this.collectRows(this.parent.getFrozenMode() === 'Right' ? 'frozen-right' : 'frozen-left');
    }

    /**
     * @hidden
     */
    public getReorderedFrozenRows(args: NotifyArgs): Row<Column>[] {
       return getReorderedFrozenRows(args, this.virtualRenderer, this.parent, this.freezeRowGenerator, this.firstPageRecords);
    }

    protected getHeaderCells(): Element[] {
        return getHeaderCells(this.virtualRenderer, this.parent);
    }

    protected isXaxis(): boolean {
        return isXaxis(this.virtualRenderer);
    }

    protected getVirtualFreezeHeader(): Element {
        return getVirtualFreezeHeader(this.virtualRenderer, this.parent);
    }

    /**
     * @hidden
     */
    public getRowObjectByIndex(index: number): Object {
        return this.virtualRenderer.getRowObjectByIndex(index);
    }

    protected ensureFrozenCols(columns: Column[]): Column[] {
        return ensureFrozenCols(columns, this.parent);
    }

    /**
     * Set the header colgroup element
     * @param {Element} colgroup
     * @returns {Element}
     */
    public setColGroup(colGroup: Element): Element {
        return setColGroup(colGroup, this.virtualRenderer, this);
    }
}
