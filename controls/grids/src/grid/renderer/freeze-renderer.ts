import { remove, addClass, isNullOrUndefined, extend, isUndefined, Browser } from '@syncfusion/ej2-base';
import { IGrid, IRenderer, IModelGenerator, NotifyArgs } from '../base/interface';
import { Column } from '../models/column';
import { HeaderRender } from './header-renderer';
import { ContentRender } from './content-renderer';
import { ServiceLocator } from '../services/service-locator';
import { FreezeRowModelGenerator } from '../services/freeze-row-model-generator';
import * as events from '../base/constant';
import { renderMovable, getScrollBarWidth, wrap, addRemoveEventListener } from '../base/util';
import {InputArgs, Input} from '@syncfusion/ej2-inputs';
import { Row } from '../models/row';
import { Cell } from '../models/cell';
import { ColumnWidthService } from '../services/width-controller';
import { freezeTable } from '../base/enum';
import * as literals from '../base/string-literals';

/**
 * Freeze module is used to render grid content with frozen rows and columns
 *
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
        const isAdd: boolean = args.name !== 'batchCancel'
            && !(this.parent.frozenRows && this.parent.editSettings.newRowPosition === 'Top');
        if (this.parent.height !== 'auto' && (isAdd || args.name === 'batchCancel' || args.name === 'batchDelete')) {
            this.refreshScrollOffset();
            const height: number = (this.getTable() as HTMLElement).offsetHeight;
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
            && (<{ row?: HTMLElement }>args).row.classList.contains(literals.addedRow)))
            && (!this.parent.frozenRows || this.parent.editSettings.newRowPosition === 'Bottom') && this.parent.height !== 'auto') {
            this.refreshScrollOffset();
            const height: number = (this.getTable() as HTMLElement).offsetHeight;
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
        let fDiv: Element = this.parent.element.querySelector('.' + literals.frozenContent);
        let mDiv: Element = this.parent.element.querySelector('.' + literals.movableContent);
        if (isNullOrUndefined(fDiv)) {
            fDiv = this.parent.createElement('div', { className: 'e-frozencontent e-frozen-left-content' });
            mDiv = this.parent.createElement('div', { className: literals.movableContent });
            this.getPanel().querySelector('.' + literals.content).appendChild(fDiv);
            this.getPanel().querySelector('.' + literals.content).appendChild(mDiv);
            (<{ scrollbarWidth?: string }>(mDiv as HTMLElement).style).scrollbarWidth = 'none';
        }
        this.setFrozenContent(fDiv);
        this.setMovableContent(mDiv);
        if (Browser.userAgent.indexOf('Mac OS') > -1 && Browser.info.name === 'safari' && !this.parent.enableVirtualization) {
            this.getPanel().firstElementChild.classList.add('e-mac-safari');
        }
    }

    public renderFrozenRigthPanel(): void {
        super.renderPanel();
    }

    public renderEmpty(tbody: HTMLElement): void {
        super.renderEmpty(tbody);
        this.getMovableContent().querySelector( literals.tbody).innerHTML = '<tr><td></td></tr>';
        addClass([this.getMovableContent().querySelector( literals.tbody).querySelector('tr')], ['e-emptyrow']);
        this.getFrozenContent().querySelector('.e-emptyrow').querySelector('td').colSpan = this.parent.getVisibleFrozenColumns();
        (this.getFrozenContent() as HTMLElement).style.borderRightWidth = '0px';
        if (this.parent.frozenRows) {
            this.parent.getHeaderContent().querySelector('.' + literals.frozenHeader).querySelector( literals.tbody).innerHTML = '';
            this.parent.getHeaderContent().querySelector('.' + literals.movableHeader).querySelector( literals.tbody).innerHTML = '';
        }
    }

    protected renderFrozenRightEmpty(tbody: HTMLElement): void {
        super.renderEmpty(tbody);
    }

    private setFrozenContent(ele: Element): void {
        this.frozenContent = ele;
    }

    /**
     * @param {Element} ele - specifies the element
     * @returns {void}
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
        if (this.getFrozenContent().querySelector('.' + literals.table) == null) {
            super.renderTable();
            this.getFrozenContent().appendChild(this.getTable());
            mTbl = this.getTable().cloneNode(true) as Element;
            this.getMovableContent().appendChild(mTbl);
        } else {
            this.setTable(this.getFrozenContent().querySelector('.' + literals.table));
            this.setColGroup(<Element>this.parent.element.querySelector('.' + literals.gridHeader).querySelector(literals.colGroup).cloneNode(true));
            this.getFrozenContent().querySelector('.' + literals.table).appendChild(this.getColGroup());
            mTbl = this.getMovableContent().querySelector('.' + literals.table);
            if (this.parent.frozenRows) {
                this.parent.getHeaderContent().classList.add('e-frozenhdrcont');
            }
        }
        if (this.getMovableContent().querySelector(literals.colGroup)) {
            remove(this.getMovableContent().querySelector(literals.colGroup));
        }
        const colGroup: Element
            = ((this.parent.getHeaderContent().querySelector('.' + literals.movableHeader).querySelector(literals.colGroup)).cloneNode(true)) as Element;
        mTbl.insertBefore(colGroup, mTbl.querySelector( literals.tbody));
        const style: string = this.parent.enableVirtualization ? '' : 'flex';
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
        const left: Element = this.parent.createElement('div', { className: className, styles: 'display:' + display });
        const movable: Element = this.parent.createElement('div', { className: 'e-movablescrollbar' });
        const child: Element = this.parent.createElement('div', { className: 'e-movablechild' });
        const scrollbarHeight: string = getScrollBarWidth().toString();
        this.setScrollbarHeight(movable as HTMLElement, scrollbarHeight);
        this.setScrollbarHeight(child as HTMLElement, scrollbarHeight);
        movable.appendChild(child);
        this.appendScrollbar(left, movable, isRight);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected appendScrollbar(frozen: Element, movable: Element, isRight?: boolean): void {
        const parent: Element = this.parent.createElement('div', { className: 'e-scrollbar', styles: 'display: flex' });
        parent.appendChild(frozen);
        parent.appendChild(movable);
        this.parent.getContent().appendChild(parent);
    }

    private setScrollbarHeight(ele: HTMLElement, height: string): void {
        ele.style.minHeight = height + 'px';
        ele.style.maxHeight = height + 'px';
    }

    /**
     * @param {NotifyArgs} args - specifies the NotifyArgs
     * @param {freezeTable} tableName - specifies the Freeze Table
     * @returns {void}
     * @hidden
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public setIsFrozen(args: NotifyArgs, tableName: freezeTable): void {
        args.isFrozen = !args.isFrozen;
    }

    /**
     * @param {Row<Column>[]} modelData - specifies the modeldata
     * @param {NotifyArgs} args - specifies the args
     * @returns {freezeTable} returns the freeze table
     * @hidden
     */
    public setTbody(modelData: Row<Column>[], args: NotifyArgs): freezeTable {
        let tableName: freezeTable;
        if (isNullOrUndefined(modelData[0].cells[0])) {
            this.getMovableContent().querySelector( literals.tbody).innerHTML = '';
        }
        let cell: Cell<Column> =  modelData[0].cells[0];
        let idx: number = cell.index;
        if (isUndefined(idx) && this.parent.isRowDragable()) {
            cell = modelData[0].cells[1];
            idx = cell.index;
        }
        if (idx === 0) {
            (this.getPanel().firstChild as HTMLElement).style.overflowX = 'hidden';
            if (this.parent.enableColumnVirtualization) {
                (this.getMovableContent() as HTMLElement).style.overflowX = 'hidden';
            }
        }
        if (this.parent.enableColumnVirtualization && args.renderMovableContent
            && args.requestType === 'virtualscroll' && this.getMovableContent().scrollLeft > 0 && args.virtualInfo.columnIndexes[0] !== 0) {
            idx = this.parent.getFrozenColumns();
        }
        if (cell && cell.column) {
            tableName = cell.column.getFreezeTableName();
        }
        this.setIdx(idx);
        (<{ tableName?: freezeTable }>args).tableName = tableName;
        return tableName;
    }

    /**
     * @param {string} tableName - specifies the table name
     * @returns {void}
     * @hidden
     */
    public splitRows(tableName: string): void {
        if (tableName === literals.frozenLeft) {
            this.freezeRows = this.rows;
            this.freezeRowElements = this.rowElements;
        } else {
            this.movableRows = this.rows;
        }
    }

    /**
     * @param {NotifyArgs} args - specifies the notifyargs
     * @param {string} tableName - specifies the tableName
     * @returns {void}
     * @hidden
     */
    public renderNextFrozentPart(args: NotifyArgs, tableName: string): void {
        const isVFTable: boolean = this.parent.enableVirtualization;
        if (tableName === literals.frozenLeft) {
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
        if (tableName === literals.frozenLeft) {
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

    public refreshScrollOffset(): void {
        if (this.parent.height !== 'auto') {
            const height: number = (this.getTable() as HTMLElement).offsetHeight + 1;
            this.setHeightToContent(height);
        }
        this.parent.notify(events.refreshFrozenHeight, {});
    }

    /**
     * @param {string} tableName - specifies the table name
     * @returns {HTMLElement} returns the Html element
     * @hidden
     */
    public getFrozenHeader(tableName: string): HTMLElement {
        if (tableName === literals.frozenLeft) {
            return this.parent.getHeaderContent().querySelector('.' + literals.frozenHeader).querySelector( literals.tbody);
        } else {
            return this.parent.getHeaderContent().querySelector('.' + literals.movableHeader).querySelector( literals.tbody);
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
     * @param {freezeTable} tableName - specifies the table name
     * @returns {Element} returns the element
     * @hidden
     */
    public getTbody(tableName: freezeTable): Element {
        if (tableName === literals.frozenLeft) {
            return this.getTable().querySelector( literals.tbody);
        } else {
            return this.getMovableContent().querySelector( literals.tbody);
        }
    }
}

export class FreezeRender extends HeaderRender implements IRenderer {
    private frozenHeader: Element;
    private movableHeader: Element;
    private eventHandler: { event: string, handler: Function }[];

    constructor(parent?: IGrid, locator?: ServiceLocator) {
        super(parent, locator);
        this.addEventListener();
    }

    public addEventListener(): void {
        this.eventHandler = [{ event: events.freezeRender, handler: this.refreshFreeze },
            { event: events.frozenHeight, handler: this.setFrozenHeight },
            { event: events.uiUpdate, handler: this.enableAfterRender }];
        addRemoveEventListener(this.parent, this.eventHandler, true, this);
    }

    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        addRemoveEventListener(this.parent, this.eventHandler, false);
    }

    public renderTable(): void {
        super.renderTable();
        this.rfshMovable();
        this.updateColgroup();
        this.initializeHeaderDrag();
        this.initializeHeaderDrop();
        this.parent.notify(events.headerRefreshed, { rows: this.rows, args: { isFrozen: false } });
    }

    public renderPanel(): void {
        let fDiv: Element = this.parent.element.querySelector('.' + literals.frozenHeader);
        let mDiv: Element = this.parent.element.querySelector('.' + literals.movableHeader);
        super.renderPanel();
        if (isNullOrUndefined(fDiv)) {
            fDiv = this.parent.createElement('div', { className: 'e-frozenheader e-frozen-left-header' });
            mDiv = this.parent.createElement('div', { className: literals.movableHeader });
            this.getPanel().querySelector('.' + literals.headerContent).appendChild(fDiv);
            this.getPanel().querySelector('.' + literals.headerContent).appendChild(mDiv);
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
        const tbody: Element = this.getMovableHeader().querySelector(literals.tbody);
        remove(this.getMovableHeader().querySelector('table'));
        super.refreshUI();
        this.rfshMovable();
        this.getMovableHeader().querySelector(literals.tbody).innerHTML = tbody.innerHTML;
        this.updateColgroup();
        this.widthService.setWidthToColumns();
        if (!this.parent.enableVirtualization) {
            this.widthService.setWidthToTable();
        }
        if (this.parent.allowTextWrap && this.parent.textWrapSettings.wrapMode === 'Header') {
            wrap([].slice.call(this.movableHeader.querySelectorAll('tr.e-columnheader')), true);
        }
        this.parent.updateDefaultCursor();
        renderMovable(this.parent.getContentTable().querySelector(literals.colGroup), this.parent.getFrozenColumns(), this.parent);
        this.widthService.refreshFrozenScrollbar();
        this.initializeHeaderDrag();
        this.parent.notify(events.headerRefreshed, { rows: this.rows, args: { isFrozen: false } });
    }

    protected refreshFrozenLeftUI(): void {
        super.refreshUI();
    }

    protected rfshMovable(): void {
        this.getFrozenHeader().appendChild(this.getTable());
        this.getMovableHeader().appendChild(this.createHeader(undefined, 'movable'));
        this.refreshStackedHdrHgt();
        this.addMovableFirstCls();
    }

    protected addMovableFirstCls(): void {
        if (this.parent.getVisibleFrozenColumns()) {
            const movablefirstcell: NodeListOf<Element> = [].slice.call(
                this.parent.element.querySelector('.' + literals.movableHeader).querySelector('thead').getElementsByClassName('e-columnheader')
            );
            const len: number = movablefirstcell.length;
            for (let i: number = 0; i < len; i++) {
                const cells: string = 'cells';
                const element: Element = movablefirstcell[i][cells][0];
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
            const filterRow: Element = this.getTable().querySelector('.e-filterbar');
            if (this.parent.allowFiltering && filterRow && this.getMovableHeader().querySelector('thead')) {
                this.getMovableHeader().querySelector('thead')
                    .appendChild(this.filterRenderer(filterRow, this.parent.getFrozenColumns()));
                const elements: HTMLInputElement[] = [].slice.call(this.getMovableHeader().
                    querySelectorAll('thead .e-filterbarcell .e-input'));
                for (const elem of elements) {
                    const args: InputArgs = {
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
        const fHdr: Element = this.getFrozenHeader();
        const mHdr: Element = this.getMovableHeader();
        const cont: Element = this.parent.getContent();
        const wrapMode: string = this.parent.textWrapSettings.wrapMode;
        const hdrClassList: DOMTokenList = (this.parent.getHeaderContent().querySelector('.' + literals.headerContent) as Element).classList;
        if (obj.case === 'textwrap') {
            if (wrapMode !== 'Header' || obj.isModeChg) {
                fRows = cont.querySelector('.' + literals.frozenContent).querySelectorAll('tr') as NodeListOf<HTMLElement>;
                mRows = cont.querySelector('.' + literals.movableContent).querySelectorAll('tr') as NodeListOf<HTMLElement>;
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
                    literals.tbody : 'thead').querySelectorAll('tr') as NodeListOf<HTMLElement>;
                fRows = fHdr.querySelector(wrapMode === 'Content' ?
                    literals.tbody : 'thead').querySelectorAll('tr') as NodeListOf<HTMLElement>;
            }
            if (!this.parent.getHeaderContent().getElementsByClassName('e-stackedheadercell').length) {
                this.setWrapHeight(fRows, mRows, obj.isModeChg, false, this.colDepth > 1);
            }
            this.refreshStackedHdrHgt();
        } else if (obj.case === 'refreshHeight') {
            this.setWrapHeight(
                cont.querySelector('.' + literals.frozenContent).querySelectorAll('tr'),
                cont.querySelector('.' + literals.movableContent).querySelectorAll('tr'), obj.isModeChg);
            if (!this.parent.getHeaderContent().getElementsByClassName('e-stackedheadercell').length) {
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
        const elements: HTMLElement[] = [].slice.call(this.parent.getHeaderContent().getElementsByClassName('e-rhandler'));
        for (let i: number = 0; i < elements.length; i++) {
            elements[i].style.height = elements[i].parentElement.offsetHeight + 'px';
        }
    }

    protected setWrapHeight(
        fRows: NodeListOf<HTMLElement>, mRows: NodeListOf<HTMLElement>, isModeChg: boolean,
        isContReset?: boolean, isStackedHdr?: boolean): void {
        let fRowHgt: number;
        let mRowHgt: number;
        const isWrap: boolean = this.parent.allowTextWrap;
        const wrapMode: string = this.parent.textWrapSettings.wrapMode;
        const tHead: Element = this.parent.getHeaderContent().querySelector('thead');
        const tBody: Element = this.parent.getHeaderContent().querySelector( literals.tbody);
        const height: number[] = [];
        const width: number[] = [];
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
        const movableContentHeight: number = this.parent.element.querySelector('.' + literals.movableContent).getBoundingClientRect().height;
        const movableContent: HTMLElement = this.parent.element.querySelector('.' + literals.movableContent) as HTMLElement;
        const frozenContent: HTMLElement = this.parent.element.querySelector('.' + literals.frozenContent) as HTMLElement;
        const contentScrollWidth: number = this.parent.getContent().scrollWidth;
        const contentTableScrollWidth: number = this.parent.element.querySelector('.e-movablecontent table').scrollWidth +
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
        const fTr: NodeListOf<Element> = [].slice.call(this.getFrozenHeader().getElementsByClassName('e-columnheader'));
        const mTr: NodeListOf<Element> = [].slice.call(this.getMovableHeader().getElementsByClassName('e-columnheader'));
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
     * @param {Element} ele - specifies the element
     * @returns {void}
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
     * @returns {void}
     * @hidden
     */
    public updateColgroup(): void {
        const mTable: Element = this.getMovableHeader().querySelector('table');
        remove(this.getMovableHeader().querySelector(literals.colGroup));
        mTable.insertBefore(
            renderMovable(this.getFrozenHeader().querySelector(literals.colGroup), this.parent.getFrozenColumns(), this.parent),
            mTable.querySelector('thead'));
    }
    protected filterRenderer(ele: Element, frozenColumn: number, total?: number): Element {
        const clone: Element = ele.cloneNode(true) as Element;
        clone.innerHTML = '';
        const end: number = total ? total : this.parent.getColumns().length;
        for (let i: number = frozenColumn; i < end; i++) {
            clone.appendChild(ele.removeChild(ele.children[frozenColumn]));
        }
        return clone;
    }
}
