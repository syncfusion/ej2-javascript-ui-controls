import { remove, extend } from '@syncfusion/ej2-base';
import { FreezeContentRender, FreezeRender } from './freeze-renderer';
import { IGrid, IRenderer, NotifyArgs } from '../base/interface';
import { ServiceLocator } from '../services/service-locator';
import { VirtualContentRenderer, VirtualHeaderRenderer, VirtualElementHandler } from './virtual-content-renderer';
import { FreezeRowModelGenerator } from '../services/freeze-row-model-generator';
import { Row } from '../models/row';
import { Column } from '../models/column';
import * as events from '../base/constant';
/**
 * VirtualFreezeRenderer is used to render the virtual table within the frozen table
 * @hidden
 */
export class VirtualFreezeRenderer extends FreezeContentRender implements IRenderer {
    private serviceLoc: ServiceLocator;

    constructor(parent?: IGrid, locator?: ServiceLocator) {
        super(parent, locator);
        this.serviceLoc = locator;
    }

    private freezeRowGenerator: FreezeRowModelGenerator;
    private virtualRenderer: VirtualContentRenderer;
    private frzeeLoad: number = 1;
    private firstPageRecords: Object[];

    /**
     * @hidden
     */
    public renderTable(): void {
        this.freezeRowGenerator = new FreezeRowModelGenerator(this.parent);
        this.virtualRenderer = new VirtualContentRenderer(this.parent, this.serviceLoc);

        this.virtualRenderer.setPanel(this.parent.getContent());
        this.virtualRenderer.renderTable();
        let virtualTable: HTMLElement = this.parent.getContent().querySelector('.e-virtualtable');
        let virtualTrack: HTMLElement = this.parent.getContent().querySelector('.e-virtualtrack');
        virtualTrack.style.position = '';
        this.getFrozenContent().appendChild(virtualTable);
        this.getFrozenContent().appendChild(virtualTrack);
        let mTbl: Element = virtualTable.cloneNode(true) as Element;
        let mTblT: Element = virtualTrack.cloneNode(true) as Element;
        this.getMovableContent().appendChild(mTbl);
        this.getMovableContent().appendChild(mTblT);
        remove(this.getMovableContent().querySelector('colgroup'));
        let colGroup: Element = this.parent.getMovableVirtualHeader().querySelector('colgroup')
            .cloneNode(true) as Element;
        mTbl.firstElementChild.insertBefore(colGroup, mTbl.firstElementChild.querySelector('tbody'));
        this.setTable(<Element>this.parent.element.querySelector('.e-frozencontent').querySelector('.e-table'));
    }

    /**
     * @hidden
     */
    public appendContent(target: HTMLElement, newChild: DocumentFragment, e: NotifyArgs): void {
        this.virtualRenderer.appendContent(target, newChild, e);
    }

    /**
     * @hidden
     */
    public generateRows(data: Object[], notifyArgs?: NotifyArgs): Row<Column>[] {
        let virtualRows: Row<Column>[] = this.virtualRenderer.vgenerator.generateRows(data, notifyArgs);
        let arr: Row<Column>[] = [];
        arr = virtualRows.map((row: Row<Column>) => extend({}, row) as Row<Column>);
        if (!this.firstPageRecords) {
            this.firstPageRecords = data;
        }
        let rows: Row<Column>[] = this.freezeRowGenerator.generateRows(data, notifyArgs, arr);
        return rows;
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

    /**
     * @hidden
     */
    public getMovableRows(): Row<Column>[] | HTMLCollectionOf<HTMLTableRowElement> {
        return this.virtualRenderer.vgenerator.getRows();
    }

    /**
     * @hidden
     */
    public getRows(): Row<Column>[] | HTMLCollectionOf<HTMLTableRowElement> {
        return this.getMovableRows();
    }

    /**
     * @hidden
     */
    public getColGroup(): Element {
        let mCol: Element = this.parent.getMovableVirtualContent().querySelector('colgroup');
        let fCol: Element = this.parent.getFrozenVirtualContent().querySelector('colgroup');
        let colGroup: Element = this.isXaxis() ? mCol : fCol;
        return colGroup;
    }

    /**
     * @hidden
     */
    public getReorderedFrozenRows(args: NotifyArgs): Row<Column>[] {
        let rows: Row<Column>[];
        let bIndex: number[] = args.virtualInfo.blockIndexes;
        let colIndex: number[] = args.virtualInfo.columnIndexes;
        let page: number = args.virtualInfo.page;
        args.virtualInfo.blockIndexes = [1, 2];
        args.virtualInfo.page = 1;
        if (!args.renderMovableContent) {
            args.virtualInfo.columnIndexes = [];
        }
        let virtualRows: Row<Column>[] = this.virtualRenderer.vgenerator.generateRows(this.firstPageRecords, args);
        rows = this.splitReorderedRows(virtualRows);
        args.virtualInfo.blockIndexes = bIndex;
        args.virtualInfo.columnIndexes = colIndex;
        args.virtualInfo.page = page;
        return rows.splice(0, this.parent.frozenRows);
    }

    private splitReorderedRows(rows: Row<Column>[]): Row<Column>[] {
        let frzCols: number = this.parent.getFrozenColumns();
        for (let i: number = 0, len: number = rows.length; i < len; i++) {
            if (this.frzeeLoad % 2 === 0) {
                rows[i].cells = rows[i].cells.slice(frzCols, rows[i].cells.length);
            } else {
                rows[i].isFreezeRow = true;
                rows[i].cells = rows[i].cells.slice(0, frzCols);
            }
        }
        this.frzeeLoad++;
        return rows;
    }

    private isXaxis(): boolean {
        let value: boolean = false;
        if (this.virtualRenderer) {
            value = this.virtualRenderer.requestType === 'virtualscroll'
                && this.virtualRenderer.currentInfo.sentinelInfo.axis === 'X';
        }
        return value;
    }

    private getHeaderCells(): Element[] {
        let content: Element = this.isXaxis() ? this.parent.getMovableVirtualHeader() : this.parent.getHeaderContent();
        return content ? [].slice.call(content.querySelectorAll('.e-headercell:not(.e-stackedheadercell)')) : [];
    }

    private getVirtualFreezeHeader(): Element {
        let headerTable: Element;
        if (this.isXaxis()) {
            headerTable = this.parent.getMovableVirtualHeader().querySelector('.e-table');
        } else {
            headerTable = this.parent.getFrozenVirtualHeader().querySelector('.e-table');
        }
        return headerTable;
    }

    private ensureFrozenCols(columns: Column[]): Column[] {
        let frozenCols: Column[] = this.parent.columns.slice(0, this.parent.getFrozenColumns()) as Column[];
        columns = frozenCols.concat(columns);
        return columns;
    }

    /**
     * @hidden
     */
    public getRowObjectByIndex(index: number): Object {
        return this.virtualRenderer.getRowObjectByIndex(index);
    }
}

export class VirtualFreezeHdrRenderer extends FreezeRender implements IRenderer {
    private serviceLoc: ServiceLocator;
    constructor(parent?: IGrid, locator?: ServiceLocator) {
        super(parent, locator);
        this.serviceLoc = locator;
    }

    private virtualHdrRenderer: VirtualHeaderRenderer;
    private virtualEle: VirtualElementHandler;

    /**
     * @hidden
     */
    public renderTable(): void {
        this.virtualHdrRenderer = new VirtualHeaderRenderer(this.parent, this.serviceLoc);
        this.virtualEle = this.virtualHdrRenderer.virtualEle;

        this.virtualHdrRenderer.setPanel(this.parent.getHeaderContent());
        this.virtualHdrRenderer.renderTable();
        this.rfhMovable();
        this.updateColgroup();
        this.initializeHeaderDrag();
        this.initializeHeaderDrop();
        this.setTable(this.parent.element.querySelector('.e-frozenheader').querySelector('.e-table'));
        this.parent.notify(events.headerRefreshed, { rows: this.rows, args: { isFrozen: false } });
    }

    private rfhMovable(): void {
        let fvTbl: HTMLElement = this.parent.getHeaderContent().querySelector('.e-virtualtable');
        let fvTck: HTMLElement = this.parent.getHeaderContent().querySelector('.e-virtualtrack');
        this.getFrozenHeader().appendChild(fvTbl);
        this.getFrozenHeader().appendChild(fvTck);
        this.virtualHdrRenderer.virtualEle.table = this.createTable() as HTMLElement;
        this.virtualHdrRenderer.virtualEle.renderWrapper();
        this.virtualHdrRenderer.virtualEle.renderPlaceHolder();
        let mvTbl: HTMLElement[] = [].slice.call(this.parent.getHeaderContent().querySelectorAll('.e-virtualtable'));
        let mvTck: HTMLElement[] = [].slice.call(this.parent.getHeaderContent().querySelectorAll('.e-virtualtrack'));
        this.getMovableHeader().appendChild(mvTbl[1]);
        this.getMovableHeader().appendChild(mvTck[1]);
    }

    /**
     * @hidden
     */
    public getTable(): Element {
        return this.virtualHdrRenderer.getTable();
    }
}