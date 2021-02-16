import { remove, addClass, isNullOrUndefined, isBlazor, extend, isUndefined } from '@syncfusion/ej2-base';
import { IGrid, IRenderer, IModelGenerator, NotifyArgs } from '../base/interface';
import { Column } from '../models/column';
import { HeaderRender } from './header-renderer';
import { ContentRender } from './content-renderer';
import { ServiceLocator } from '../services/service-locator';
import { FreezeRowModelGenerator } from '../services/freeze-row-model-generator';
import * as events from '../base/constant';
import { renderMovable, getScrollBarWidth, wrap } from '../base/util';
import {InputArgs, Input} from '@syncfusion/ej2-inputs';
import { Row } from '../models/row';
import { Cell } from '../models/cell';
import { ColumnWidthService } from '../services/width-controller';
import { freezeTable } from '../base/enum';

/**
 * Freeze module is used to render grid content with frozen rows and columns
 * @hidden
 */
export class FreezeContentRender extends ContentRender implements IRenderer {
    private frozenContent: Element;
    private movableContent: Element;
    private idx: number;
    protected widthService: ColumnWidthService;
    protected isInitialRender: boolean = true;

    constructor(parent?: IGrid, locator?: ServiceLocator) {
        super(parent, locator);
        this.widthService = locator.getService<ColumnWidthService>('widthService');
        this.addEventListener();
    }

    public addEventListener(): void {
        this.parent.addEventListener(events.actionComplete, this.actionComplete.bind(this));
        this.parent.addEventListener(events.batchAdd, this.batchAdd.bind(this));
        this.parent.on(events.batchCancel, this.batchAdd.bind(this));
        this.parent.addEventListener(events.batchDelete, this.batchAdd.bind(this));
        this.parent.on(events.setHeightToFrozenElement, this.refreshScrollOffset);
        this.parent.on(events.columnVisibilityChanged, this.widthService.refreshFrozenScrollbar, this);
    }

    protected batchAdd(args: { name: string }): void {
        let isAdd: boolean = args.name !== 'batchCancel'
            && !(this.parent.frozenRows && this.parent.editSettings.newRowPosition === 'Top');
        if (this.parent.height !== 'auto' && (isAdd || args.name === 'batchCancel' || args.name === 'batchDelete')) {
            this.refreshScrollOffset();
            let height: number = (this.getTable() as HTMLElement).offsetHeight;
            if (args.name === 'add' && this.parent.editSettings.newRowPosition === 'Bottom') {
                (this.parent.getContent().firstChild as HTMLElement).scroll(0, height);
            }
        }
    }

    protected setHeightToContent(height: number): void {
        (this.getFrozenContent() as HTMLElement).style.height = height.toString() + 'px';
        (this.getMovableContent() as HTMLElement).style.height = height.toString() + 'px';
    }

    protected actionComplete(args: NotifyArgs): void {
        if (this.parent.editSettings.mode !== 'Dialog' && (args.requestType === 'add' || (args.requestType === 'cancel'
            && (<{ row?: HTMLElement }>args).row.classList.contains('e-addedrow')))
            && (!this.parent.frozenRows || this.parent.editSettings.newRowPosition === 'Bottom') && this.parent.height !== 'auto') {
            this.refreshScrollOffset();
            let height: number = (this.getTable() as HTMLElement).offsetHeight;
            if (args.requestType === 'add' && this.parent.editSettings.newRowPosition === 'Bottom') {
                (this.parent.getContent().firstChild as HTMLElement).scroll(0, height);
            }
        }
    }

    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.removeEventListener(events.actionComplete, this.actionComplete);
        this.parent.removeEventListener(events.batchAdd, this.batchAdd);
        this.parent.off(events.columnVisibilityChanged, this.widthService.refreshFrozenScrollbar);
    }

    public renderPanel(): void {
        super.renderPanel();
        let fDiv: Element = this.parent.element.querySelector('.e-frozencontent');
        let mDiv: Element = this.parent.element.querySelector('.e-movablecontent');
        if (isNullOrUndefined(fDiv)) {
            fDiv = this.parent.createElement('div', { className: 'e-frozencontent e-frozen-left-content' });
            mDiv = this.parent.createElement('div', { className: 'e-movablecontent' });
            this.getPanel().querySelector('.e-content').appendChild(fDiv);
            this.getPanel().querySelector('.e-content').appendChild(mDiv);
        }
        this.setFrozenContent(fDiv);
        this.setMovableContent(mDiv);
    }

    public renderFrozenRigthPanel(): void {
        super.renderPanel();
    }

    public renderEmpty(tbody: HTMLElement): void {
        if (isBlazor() && !this.parent.isJsComponent) { return; }
        super.renderEmpty(tbody);
        this.getMovableContent().querySelector('tbody').innerHTML = '<tr><td></td></tr>';
        addClass([this.getMovableContent().querySelector('tbody').querySelector('tr')], ['e-emptyrow']);
        this.getFrozenContent().querySelector('.e-emptyrow').querySelector('td').colSpan = this.parent.getVisibleFrozenColumns();
        (this.getFrozenContent() as HTMLElement).style.borderRightWidth = '0px';
        if (this.parent.frozenRows) {
            this.parent.getHeaderContent().querySelector('.e-frozenheader').querySelector('tbody').innerHTML = '';
            this.parent.getHeaderContent().querySelector('.e-movableheader').querySelector('tbody').innerHTML = '';
        }
    }

    protected renderFrozenRightEmpty(tbody: HTMLElement): void {
        super.renderEmpty(tbody);
    }

    private setFrozenContent(ele: Element): void {
        this.frozenContent = ele;
    }

    /**
     * @hidden
     */
    public setMovableContent(ele: Element): void {
        this.movableContent = ele;
    }

    public getFrozenContent(): Element {
        return this.frozenContent;
    }

    public getMovableContent(): Element {
        return this.movableContent;
    }

    public getModelGenerator(): IModelGenerator<Column> {
        return new FreezeRowModelGenerator(this.parent);
    }

    protected renderFrozenRightTable(): void {
        super.renderTable();
    }

    public renderTable(): void {
        let mTbl: Element;
        if (this.getFrozenContent().querySelector('.e-table') == null) {
            super.renderTable();
            this.getFrozenContent().appendChild(this.getTable());
            mTbl = this.getTable().cloneNode(true) as Element;
            this.getMovableContent().appendChild(mTbl);
        } else {
            this.setTable(this.getFrozenContent().querySelector('.e-table'));
            this.setColGroup(<Element>this.parent.element.querySelector('.e-gridheader').querySelector('colgroup').cloneNode(true));
            this.getFrozenContent().querySelector('.e-table').appendChild(this.getColGroup());
            mTbl = this.getMovableContent().querySelector('.e-table');
            if (this.parent.frozenRows) {
                this.parent.getHeaderContent().classList.add('e-frozenhdrcont');
            }
        }
        if (this.getMovableContent().querySelector('colgroup')) {
            remove(this.getMovableContent().querySelector('colgroup'));
        }
        let colGroup: Element
            = ((this.parent.getHeaderContent().querySelector('.e-movableheader').querySelector('colgroup')).cloneNode(true)) as Element;
        mTbl.insertBefore(colGroup, mTbl.querySelector('tbody'));
        let style: string = this.parent.enableVirtualization ? '' : 'flex';
        (this.getPanel().firstChild as HTMLElement).style.display = style;
        this.renderHorizontalScrollbar('e-frozenscrollbar e-frozen-left-scrollbar', this.getScrollbarDisplay());
    }

    protected getScrollbarDisplay(): string {
        let frozenDisplay: string = '';
        if ((this.parent.getFrozenColumns() && !this.parent.getVisibleFrozenColumns())
            || (this.parent.getFrozenLeftColumnsCount() && !this.parent.getVisibleFrozenLeftCount())) {
            frozenDisplay = 'none';
        }
        return frozenDisplay;
    }

    protected renderHorizontalScrollbar(className: string, display: string, isRight?: boolean): void {
        let left: Element = this.parent.createElement('div', { className: className, styles: 'display:' + display });
        let movable: Element = this.parent.createElement('div', { className: 'e-movablescrollbar' });
        let child: Element = this.parent.createElement('div', { className: 'e-movablechild' });
        let scrollbarHeight: string = getScrollBarWidth().toString();
        this.setScrollbarHeight(movable as HTMLElement, scrollbarHeight);
        this.setScrollbarHeight(child as HTMLElement, scrollbarHeight);
        movable.appendChild(child);
        this.appendScrollbar(left, movable, isRight);
    }

    protected appendScrollbar(frozen: Element, movable: Element, isRight?: boolean): void {
        let parent: Element = this.parent.createElement('div', { className: 'e-scrollbar', styles: 'display: flex' });
        parent.appendChild(frozen);
        parent.appendChild(movable);
        this.parent.getContent().appendChild(parent);
    }

    private setScrollbarHeight(ele: HTMLElement, height: string): void {
        ele.style.minHeight = height + 'px';
        ele.style.maxHeight = height + 'px';
    }

    /**
     * @hidden
     */
    public setIsFrozen(args: NotifyArgs, tableName: freezeTable): void {
        args.isFrozen = !args.isFrozen;
    }

    /**
     * @hidden
     */
    public setTbody(modelData: Row<Column>[], args: NotifyArgs): freezeTable {
        let tableName: freezeTable;
        if (isNullOrUndefined(modelData[0].cells[0])) {
            this.getMovableContent().querySelector('tbody').innerHTML = '';
        }
        let cell: Cell<Column> =  modelData[0].cells[0];
        let idx: number = cell.index;
        if (isUndefined(idx) && this.parent.isRowDragable()) {
            cell = modelData[0].cells[1];
            idx = cell.index;
        }
        if (idx === 0) {
            (this.getPanel().firstChild as HTMLElement).style.overflowX = 'hidden';
        }
        if (this.parent.enableColumnVirtualization && args.renderMovableContent
            && args.requestType === 'virtualscroll' && this.getMovableContent().scrollLeft > 0 && args.virtualInfo.columnIndexes[0] !== 0) {
            idx = this.parent.getFrozenColumns();
        }
        if (cell && cell.column) {
            tableName = cell.column.getFreezeTableName();
        }
        this.setIdx(idx);
        return tableName;
    }

    /**
     * @hidden
     */
    public splitRows(tableName: string): void {
        if (tableName === 'frozen-left') {
            this.freezeRows = this.rows;
            this.freezeRowElements = this.rowElements;
        } else {
            this.movableRows = this.rows;
        }
    }

    /**
     * @hidden
     */
    public renderNextFrozentPart(args: NotifyArgs, tableName: string): void {
        let isVFTable: boolean = this.parent.enableVirtualization;
        if (tableName === 'frozen-left') {
            if (isVFTable) {
                args.renderMovableContent = true;
            }
            this.refreshContentRows(extend({}, args));
        }
    }

    public appendContent(tbody: Element, frag: DocumentFragment | HTMLElement, args: NotifyArgs, tableName?: string): void {
        if (this.parent.isReact && !isNullOrUndefined(this.parent.rowTemplate)) {
            tbody = frag as HTMLElement;
        } else {
            tbody.appendChild(frag);
        }
        if (tableName === 'frozen-left') {
            this.isLoaded = false;
            this.getFrozenContent().querySelector('table').appendChild(tbody);
        } else {
            this.refreshTbody(tbody);
            this.isLoaded = true;
            this.getMovableContent().querySelector('table').appendChild(tbody);
            this.refreshHeight();
            this.refreshScrollOffset();
            this.widthService.refreshFrozenScrollbar();
        }
        if (this.isInitialRender) {
            this.parent.scrollModule.setHeight();
            this.isInitialRender = false;
        }
    }

    /**
     * @hidden
     */
    public refreshScrollOffset(): void {
        if (this.parent.height !== 'auto') {
            let height: number = (this.getTable() as HTMLElement).offsetHeight + 1;
            this.setHeightToContent(height);
        }
        this.parent.notify(events.refreshFrozenHeight, {});
    }

    /**
     * @hidden
     */
    public getFrozenHeader(tableName: string): HTMLElement {
        if (tableName === 'frozen-left') {
            return this.parent.getHeaderContent().querySelector('.e-frozenheader').querySelector('tbody');
        } else {
            return this.parent.getHeaderContent().querySelector('.e-movableheader').querySelector('tbody');
        }
    }

    protected refreshTbody(tbody: Element): void {
        if (tbody.childElementCount < 1) {
            tbody.appendChild(this.parent.createElement('tr').appendChild(this.parent.createElement('td')));
        }
    }

    protected refreshHeight(): void {
        if (!this.parent.allowTextWrap) {
            this.parent.notify(events.freezeRender, { case: 'refreshHeight' });
        }
        (this.getFrozenContent() as HTMLElement).style.borderRightWidth = '1px';
    }

    private setIdx(idx: number): void {
        this.idx = idx;
    }

    protected getIdx(): number {
        return this.idx;
    }

    /**
     * @hidden
     */
    public getTbody(tableName: freezeTable): Element {
        if (tableName === 'frozen-left') {
            return this.getTable().querySelector('tbody');
        } else {
            return this.getMovableContent().querySelector('tbody');
        }
    }
}

export class FreezeRender extends HeaderRender implements IRenderer {
    private frozenHeader: Element;
    private movableHeader: Element;

    constructor(parent?: IGrid, locator?: ServiceLocator) {
        super(parent, locator);
        this.addEventListener();
    }

    public addEventListener(): void {
        this.parent.on(events.freezeRender, this.refreshFreeze, this);
        this.parent.on(events.frozenHeight, this.setFrozenHeight, this);
        this.parent.on(events.uiUpdate, this.enableAfterRender, this);
    }

    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.frozenHeight, this.setFrozenHeight);
        this.parent.off(events.uiUpdate, this.enableAfterRender);
    }

    public renderTable(): void {
        if (!isBlazor()) {
            super.renderTable();
        } else {
            this.setTable(this.createTable(this.getFrozenHeader().querySelector('.e-table')));
            this.parent.notify(events.headerRefreshed, { rows: this.rows, args: { isFrozen: true } });
            this.createTable(this.getMovableHeader().querySelector('.e-table'));
        }
        this.rfshMovable();
        this.updateColgroup();
        this.initializeHeaderDrag();
        this.initializeHeaderDrop();
        this.parent.notify(events.headerRefreshed, { rows: this.rows, args: { isFrozen: false } });
    }

    public renderPanel(): void {
        let fDiv: Element = this.parent.element.querySelector('.e-frozenheader');
        let mDiv: Element = this.parent.element.querySelector('.e-movableheader');
        super.renderPanel();
        if (isNullOrUndefined(fDiv)) {
            fDiv = this.parent.createElement('div', { className: 'e-frozenheader e-frozen-left-header' });
            mDiv = this.parent.createElement('div', { className: 'e-movableheader' });
            this.getPanel().querySelector('.e-headercontent').appendChild(fDiv);
            this.getPanel().querySelector('.e-headercontent').appendChild(mDiv);
        }
        this.setFrozenHeader(fDiv);
        this.setMovableHeader(mDiv);
    }

    public renderFrozenRightPanel(): void {
        super.renderPanel();
    }

    public renderFrozenRightTable(): void {
        super.renderTable();
    }

    public refreshUI(): void {
        if (!(isBlazor() && this.parent.isServerRendered) || this.parent.frozenRows === 0) {
            let tbody: Element = this.getMovableHeader().querySelector('tbody');
            remove(this.getMovableHeader().querySelector('table'));
            super.refreshUI();
            this.rfshMovable();
            this.getMovableHeader().querySelector('tbody').innerHTML = tbody.innerHTML;
        } else {
            if (this.parent.getFrozenColumns() && this.freezeReorder) {
                super.refreshUI();
                this.freezeReorder = false;
                super.refreshUI();
            }
            this.rfshMovable();
        }
        if (!isBlazor() || this.parent.frozenRows === 0) {
            this.updateColgroup();
        }
        if (!this.parent.enableVirtualization) {
            this.widthService.setWidthToTable();
        }
        if (this.parent.allowTextWrap && this.parent.textWrapSettings.wrapMode === 'Header') {
            wrap([].slice.call(this.movableHeader.querySelectorAll('tr.e-columnheader')), true);
        }
        this.parent.updateDefaultCursor();
        if (!isBlazor() || this.parent.frozenRows === 0) {
            renderMovable(this.parent.getContentTable().querySelector('colgroup'), this.parent.getFrozenColumns(), this.parent);
        }
        this.widthService.refreshFrozenScrollbar();
        this.initializeHeaderDrag();
        this.parent.notify(events.headerRefreshed, { rows: this.rows, args: { isFrozen: false } });
    }

    protected refreshFrozenLeftUI(): void {
        super.refreshUI();
    }

    protected rfshMovable(): void {
        if (!isBlazor() || this.parent.frozenRows === 0) {
            this.getFrozenHeader().appendChild(this.getTable());
            this.getMovableHeader().appendChild(this.createTable());
        }
        this.refreshStackedHdrHgt();
        this.addMovableFirstCls();
    }

    protected addMovableFirstCls(): void {
        if (this.parent.getVisibleFrozenColumns()) {
            let movablefirstcell: NodeListOf<Element> =
                this.parent.element.querySelector('.e-movableheader').querySelector('thead').querySelectorAll('.e-columnheader');
            let len: number = movablefirstcell.length;
            for (let i: number = 0; i < len; i++) {
                let cells: string = 'cells';
                let element: Element = movablefirstcell[i][cells][0];
                if (element) {
                    addClass([element], ['e-movablefirst']);
                    if (movablefirstcell[i][cells][0].rowSpan > 1) {
                        i = i + (movablefirstcell[i][cells][0].rowSpan - 1);
                    }
                }
            }
        }
    }

    protected refreshFreeze(obj: { case: string, isModeChg?: boolean }): void {
        if (obj.case === 'filter') {
            let filterRow: Element = this.getTable().querySelector('.e-filterbar');
            if (this.parent.allowFiltering && filterRow && this.getMovableHeader().querySelector('thead')) {
                this.getMovableHeader().querySelector('thead')
                    .appendChild(this.filterRenderer(filterRow, this.parent.getFrozenColumns()));
                let elements: HTMLInputElement[] = [].slice.call(this.getMovableHeader().
                querySelectorAll('thead .e-filterbarcell .e-input'));
                for (let elem of elements) {
                    let args: InputArgs = {
                        element: elem as HTMLInputElement, floatLabelType: 'Never',
                        properties: {
                            enableRtl: this.parent.enableRtl, showClearButton: true
                        }
                    };
                    Input.bindInitialEvent(args);
                }
            }
        } else if (obj.case === 'textwrap' || obj.case === 'refreshHeight') {
            this.refreshHeight(obj);
            (<{ refreshScrollOffset?: Function }>this.parent.contentModule).refreshScrollOffset();
        }
    }

    protected refreshHeight(obj: { case: string, isModeChg?: boolean }): void {
        let fRows: NodeListOf<HTMLElement>;
        let mRows: NodeListOf<HTMLElement>;
        let fHdr: Element = this.getFrozenHeader();
        let mHdr: Element = this.getMovableHeader();
        let cont: Element = this.parent.getContent();
        let wrapMode: string = this.parent.textWrapSettings.wrapMode;
        let hdrClassList: DOMTokenList = (this.parent.getHeaderContent().querySelector('.e-headercontent') as Element).classList;
        if (obj.case === 'textwrap') {
            if (wrapMode !== 'Header' || obj.isModeChg) {
                fRows = cont.querySelector('.e-frozencontent').querySelectorAll('tr') as NodeListOf<HTMLElement>;
                mRows = cont.querySelector('.e-movablecontent').querySelectorAll('tr') as NodeListOf<HTMLElement>;
                this.setWrapHeight(fRows, mRows, obj.isModeChg, true);
            }
            if (wrapMode === 'Content' && this.parent.allowTextWrap) {
                hdrClassList.add('e-wrap');
            } else {
                hdrClassList.remove('e-wrap');
            }
            if (wrapMode === 'Both' || obj.isModeChg) {
                fRows = fHdr.querySelectorAll('tr') as NodeListOf<HTMLElement>;
                mRows = mHdr.querySelectorAll('tr') as NodeListOf<HTMLElement>;
            } else {
                mRows = mHdr.querySelector(wrapMode === 'Content' ?
                    'tbody' : 'thead').querySelectorAll('tr') as NodeListOf<HTMLElement>;
                fRows = fHdr.querySelector(wrapMode === 'Content' ?
                    'tbody' : 'thead').querySelectorAll('tr') as NodeListOf<HTMLElement>;
            }
            if (!this.parent.getHeaderContent().querySelectorAll('.e-stackedheadercell').length) {
                this.setWrapHeight(fRows, mRows, obj.isModeChg, false, this.colDepth > 1);
            }
            this.refreshStackedHdrHgt();
        } else if (obj.case === 'refreshHeight') {
            this.setWrapHeight(
                cont.querySelector('.e-frozencontent').querySelectorAll('tr'),
                cont.querySelector('.e-movablecontent').querySelectorAll('tr'), obj.isModeChg);
            if (!this.parent.getHeaderContent().querySelectorAll('.e-stackedheadercell').length) {
                this.setWrapHeight(fHdr.querySelectorAll('tr'), mHdr.querySelectorAll('tr'), obj.isModeChg);
            }
        }
    }

    private enableAfterRender(e: NotifyArgs): void {
        if (e.module === 'scroll') {
            this.setFrozenHeight();
        }
    }

    private updateResizeHandler(): void {
        let elements: HTMLElement[] = [].slice.call(this.parent.getHeaderContent().querySelectorAll('.e-rhandler'));
        for (let i: number = 0; i < elements.length; i++) {
            elements[i].style.height = elements[i].parentElement.offsetHeight + 'px';
        }
    }

    protected setWrapHeight(
        fRows: NodeListOf<HTMLElement>, mRows: NodeListOf<HTMLElement>, isModeChg: boolean,
        isContReset?: boolean, isStackedHdr?: boolean): void {
        let fRowHgt: number;
        let mRowHgt: number;
        let isWrap: boolean = this.parent.allowTextWrap;
        let wrapMode: string = this.parent.textWrapSettings.wrapMode;
        let tHead: Element = this.parent.getHeaderContent().querySelector('thead');
        let tBody: Element = this.parent.getHeaderContent().querySelector('tbody');
        let height: number[] = [];
        let width: number[] = [];
        for (let i: number = 0, len: number = fRows.length; i < len; i++) { //separate loop for performance issue 
            if (!isNullOrUndefined(fRows[i]) && !isNullOrUndefined(mRows[i])) {
                height[i] = fRows[i].getBoundingClientRect().height; //https://pagebuildersandwich.com/increased-plugins-performance-200/
                width[i] = mRows[i].getBoundingClientRect().height;
            }
        }
        for (let i: number = 0, len: number = fRows.length; i < len; i++) {
            if (isModeChg && ((wrapMode === 'Header' && isContReset) || ((wrapMode === 'Content' && tHead.contains(fRows[i]))
                || (wrapMode === 'Header' && tBody.contains(fRows[i])))) || isStackedHdr) {
                fRows[i].style.height = null;
                mRows[i].style.height = null;
            }
            fRowHgt = height[i];
            mRowHgt = width[i];
            if (!isNullOrUndefined(fRows[i]) && fRows[i].childElementCount && ((isWrap && fRowHgt < mRowHgt) ||
                (!isWrap && fRowHgt < mRowHgt) || (this.parent.allowResizing && this.parent.resizeModule &&
                this.parent.resizeModule.isFrozenColResized === false))) {
                fRows[i].style.height = mRowHgt + 'px';
            }
            if (mRows && !isNullOrUndefined(mRows[i]) && mRows[i].childElementCount && ((isWrap && fRowHgt > mRowHgt) ||
                (!isWrap && fRowHgt > mRowHgt) || (this.parent.allowResizing && this.parent.resizeModule &&
                this.parent.resizeModule.isFrozenColResized === true))) {
                mRows[i].style.height = fRowHgt + 'px';
            }
        }
        if (isWrap && this.parent.height !== 'auto') {
            this.setFrozenHeight();
        }
    }

    protected setFrozenHeight(height: number = getScrollBarWidth()): void {
        let movableContentHeight: number = this.parent.element.querySelector('.e-movablecontent').getBoundingClientRect().height;
        let movableContent: HTMLElement = this.parent.element.querySelector('.e-movablecontent') as HTMLElement;
        let frozenContent: HTMLElement = this.parent.element.querySelector('.e-frozencontent') as HTMLElement;
        let contentScrollWidth: number = this.parent.getContent().scrollWidth;
        let contentTableScrollWidth: number = this.parent.element.querySelector('.e-movablecontent table').scrollWidth +
            this.parent.getContentTable().scrollWidth;
        if (movableContent.scrollWidth - movableContent.clientWidth) {
            frozenContent.style.height = movableContentHeight -
                height + 'px';
            frozenContent.style.borderBottom = '';
        } else {
            frozenContent.style.height = movableContentHeight + 'px';
            if (((frozenContent.scrollHeight <= frozenContent.clientHeight) ||
                (movableContent.scrollHeight <= movableContent.clientHeight))
                && contentScrollWidth === contentTableScrollWidth) {
                this.parent.scrollModule.removePadding();
            }
            frozenContent.style.borderBottom = '0px';
        }
    }

    protected refreshStackedHdrHgt(): void {
        let fRowSpan: { min: number, max: number };
        let mRowSpan: { min: number, max: number };
        let fTr: NodeListOf<Element> = this.getFrozenHeader().querySelectorAll('.e-columnheader');
        let mTr: NodeListOf<Element> = this.getMovableHeader().querySelectorAll('.e-columnheader');
        for (let i: number = 0, len: number = fTr.length; i < len; i++) {
            fRowSpan = this.getRowSpan(fTr[i]);
            mRowSpan = this.getRowSpan(mTr[i]);
            if (fRowSpan.min > 1) {
                this.updateStackedHdrRowHgt(i, fRowSpan.max, fTr[i], mTr);
            } else if (mRowSpan.min > 1) {
                this.updateStackedHdrRowHgt(i, mRowSpan.max, mTr[i], fTr);
            }
        }
        if (this.parent.allowResizing) {
            this.updateResizeHandler();
        }
    }

    protected getRowSpan(row: Element): { min: number, max: number } {
        let rSpan: number;
        let minRowSpan: number;
        let maxRowSpan: number;
        for (let i: number = 0, len: number = row.childElementCount; i < len; i++) {
            if (i === 0) {
                minRowSpan = (row.children[0] as HTMLTableDataCellElement).rowSpan;
            }
            rSpan = (row.children[i] as HTMLTableDataCellElement).rowSpan;
            minRowSpan = Math.min(rSpan, minRowSpan);
            maxRowSpan = Math.max(rSpan, minRowSpan);
        }
        return { min: minRowSpan, max: maxRowSpan };
    }

    protected updateStackedHdrRowHgt(idx: number, maxRowSpan: number, row: Element, rows: NodeListOf<Element>): void {
        let height: number = 0;
        for (let i: number = 0; i < maxRowSpan; i++) {
            height += (rows[idx + i] as HTMLElement).style.height ?
                parseInt((rows[idx + i] as HTMLElement).style.height, 10) : (rows[idx + i] as HTMLElement).offsetHeight;
        }
        (row as HTMLElement).style.height = height + 'px';
    }

    private setFrozenHeader(ele: Element): void {
        this.frozenHeader = ele;
    }

    /**
     * @hidden
     */
    public setMovableHeader(ele: Element): void {
        this.movableHeader = ele;
    }

    protected getFrozenHeader(): Element {
        return this.frozenHeader;
    }

    public getMovableHeader(): Element {
        return this.movableHeader;
    }
    /**
     * @hidden
     */
    public updateColgroup(): void {
        let mTable: Element = this.getMovableHeader().querySelector('table');
        remove(this.getMovableHeader().querySelector('colgroup'));
        mTable.insertBefore(
            renderMovable(this.getFrozenHeader().querySelector('colgroup'), this.parent.getFrozenColumns(), this.parent),
            mTable.querySelector('thead'));
    }
    protected filterRenderer(ele: Element, frozenColumn: number, total?: number): Element {
        let clone: Element = ele.cloneNode(true) as Element;
        clone.innerHTML = '';
        let end: number = total ? total : this.parent.getColumns().length;
        for (let i: number = frozenColumn; i < end; i++) {
            clone.appendChild(ele.removeChild(ele.children[frozenColumn]));
        }
        return clone;
    }
}