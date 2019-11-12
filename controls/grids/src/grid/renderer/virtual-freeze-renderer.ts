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
        let isSplit: boolean = false;
        let virtualRows: Row<Column>[] = this.virtualRenderer.vgenerator.generateRows(data, notifyArgs);
        let arr: Row<Column>[] = [];
        arr = virtualRows.map((row: Row<Column>) => extend({}, row) as Row<Column>);
        if (this.parent.enableColumnVirtualization && this.parent.getFrozenColumns() && notifyArgs.renderMovableContent) {
            let left: number = this.parent.getMovableVirtualContent().scrollLeft;
            isSplit = notifyArgs.requestType === 'virtualscroll' && left > 0 && notifyArgs.virtualInfo.columnIndexes[0] !== 0;
        }
        let rows: Row<Column>[] = this.freezeRowGenerator.generateRows(data, notifyArgs, arr);
        return isSplit ? virtualRows : rows;
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
        let colGroup: Element = this.parent.getMovableVirtualContent().querySelector('colgroup');
        return colGroup;
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