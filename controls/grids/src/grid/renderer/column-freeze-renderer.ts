import { remove, addClass, isNullOrUndefined, extend, setStyleAttribute } from '@syncfusion/ej2-base';
import { IGrid, IRenderer, NotifyArgs, FrozenReorderArgs } from '../base/interface';
import { Column } from '../models/column';
import { FreezeContentRender, FreezeRender } from './freeze-renderer';
import { ServiceLocator } from '../services/service-locator';
import * as events from '../base/constant';
import { wrap, parentsUntil, addRemoveEventListener } from '../base/util';
import {InputArgs, Input} from '@syncfusion/ej2-inputs';
import { Row } from '../models/row';
import { ColumnWidthService } from '../services/width-controller';
import { freezeTable } from '../base/enum';
import { Grid } from '../base/grid';
import * as literals from '../base/string-literals';

/**
 * ColumnFreezeHeaderRenderer is used to freeze the columns header at right and left
 *
 * @hidden
 */
export class ColumnFreezeHeaderRenderer extends FreezeRender implements IRenderer {
    private frozenRightHeader: Element;
    private destEle: Element;
    private evtHandlers: { event: string, handler: Function }[];

    constructor(parent?: IGrid, locator?: ServiceLocator) {
        super(parent, locator);
        this.addEventListener();
    }

    public addEventListener(): void {
        this.evtHandlers = [{ event: events.freezeRender, handler: this.refreshFreeze },
            { event: events.refreshFrozenColumns, handler: this.refreshFrozenColumns },
            { event: events.setReorderDestinationElement, handler: this.setReorderElement },
            { event: events.columnVisibilityChanged, handler: this.setVisible }];
        addRemoveEventListener(this.parent, this.evtHandlers, true, this);
    }

    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        addRemoveEventListener(this.parent, this.evtHandlers, false);
    }

    private setReorderElement(args: { ele: Element }): void {
        this.destEle = args.ele;
    }

    private refreshFrozenColumns(args: FrozenReorderArgs): void {
        if (!args.parent) {
            this.parent.setProperties({ columns: args.columns }, true);
        }
        const isFrozenLeft: Element = parentsUntil(this.destEle, 'e-frozen-left-header');
        const isFrozenRight: Element = parentsUntil(this.destEle, 'e-frozen-right-header');
        const left: number = this.parent.getFrozenLeftColumnsCount();
        const right: number = this.parent.getFrozenRightColumnsCount();
        args.column.freeze = null;
        if (isFrozenLeft) {
            args.column.freeze = 'Left';
        } else if (isFrozenRight) {
            args.column.freeze = 'Right';
        }
        this.parent.setFrozenCount();
        args.cancel = left !== this.parent.getFrozenLeftColumnsCount() || right !== this.parent.getFrozenRightColumnsCount();
        if (args.cancel) { (this.parent as Grid).refreshColumns(); }
    }

    protected setWrapHeight(
        fRows: NodeListOf<HTMLElement>, mRows: NodeListOf<HTMLElement>, isModeChg: boolean,
        isContReset?: boolean, isStackedHdr?: boolean, frRows?: NodeListOf<HTMLElement>): void {
        let fRowHgt: number;
        let mRowHgt: number;
        let frRowHgt: number;
        const isWrap: boolean = this.parent.allowTextWrap;
        const tBody: Element = this.parent.getHeaderContent().querySelector( literals.tbody);
        const wrapMode: string = this.parent.textWrapSettings.wrapMode;
        const tHead: Element = this.parent.getHeaderContent().querySelector('thead');
        const height: number[] = [];
        const width: number[] = [];
        const rightHeight: number[] = [];
        for (let i: number = 0, len: number = fRows.length; i < len; i++) { //separate loop for performance issue
            if (!isNullOrUndefined(fRows[i]) && !isNullOrUndefined(mRows[i])) {
                if (frRows) {
                    rightHeight[i] = frRows[i].getBoundingClientRect().height;
                }
                width[i] = mRows[i].getBoundingClientRect().height;
                height[i] = fRows[i].getBoundingClientRect().height; //https://pagebuildersandwich.com/increased-plugins-performance-200/
            }
        }
        for (let i: number = 0, len: number = fRows.length; i < len; i++) {
            if (isModeChg && (((wrapMode === 'Content' && tHead.contains(fRows[i]))
                || (wrapMode === 'Header' && tBody.contains(fRows[i]))) || (wrapMode === 'Header' && isContReset)) || isStackedHdr) {
                if (frRows[i]) { frRows[i].style.height = null; }
                fRows[i].style.height = null;
                mRows[i].style.height = null;
            }
            fRowHgt = height[i];
            mRowHgt = width[i];
            frRowHgt = rightHeight[i] ? rightHeight[i] : 0;
            const maxHeight: number = Math.max(fRowHgt, mRowHgt, frRowHgt);
            if (!isNullOrUndefined(fRows[i]) && fRows[i].childElementCount && ((isWrap && fRowHgt < maxHeight) ||
                (!isWrap && fRowHgt < maxHeight) || (this.parent.allowResizing && this.parent.resizeModule &&
                    this.parent.resizeModule.isFrozenColResized === false))) {
                fRows[i].style.height = maxHeight + 'px';
            }
            if (mRows && !isNullOrUndefined(mRows[i]) && mRows[i].childElementCount && ((isWrap && maxHeight > mRowHgt) ||
                (!isWrap && maxHeight > mRowHgt) || (this.parent.allowResizing && this.parent.resizeModule &&
                    this.parent.resizeModule.isFrozenColResized === true))) {
                mRows[i].style.height = maxHeight + 'px';
            }
            if (frRows && !isNullOrUndefined(frRows[i]) && frRows[i].childElementCount && ((isWrap && maxHeight > frRowHgt) ||
                (!isWrap && maxHeight > frRowHgt) || (this.parent.allowResizing && this.parent.resizeModule &&
                    this.parent.resizeModule.isFrozenColResized === true))) {
                frRows[i].style.height = maxHeight + 'px';
            }
        }
        if (isWrap) {
            this.setFrozenHeight();
        }
    }

    protected refreshHeight(obj: { case: string, isModeChg?: boolean }): void {
        const isLeftRight: boolean = this.parent.getFrozenMode() === literals.leftRight;
        let fRows: NodeListOf<HTMLElement>;
        let frRows: NodeListOf<HTMLElement>;
        let mRows: NodeListOf<HTMLElement>;
        const frHdr: Element = this.getFrozenRightHeader();
        const fHdr: Element = this.parent.getHeaderContent().querySelector('.' + literals.frozenHeader);
        const cont: Element = this.parent.getContent();
        const mHdr: Element = this.getMovableHeader();
        const hdrClassList: DOMTokenList = (this.parent.getHeaderContent().querySelector('.' + literals.headerContent) as Element).classList;
        const wrapMode: string = this.parent.textWrapSettings.wrapMode;
        if (obj.case === 'textwrap') {
            if (wrapMode !== 'Header' || obj.isModeChg) {
                if (isLeftRight) {
                    frRows = cont.querySelector('.e-frozen-right-content').querySelectorAll('tr') as NodeListOf<HTMLElement>;
                }
                mRows = cont.querySelector('.' + literals.movableContent).querySelectorAll('tr') as NodeListOf<HTMLElement>;
                fRows = cont.querySelector('.' + literals.frozenContent).querySelectorAll('tr') as NodeListOf<HTMLElement>;
                this.setWrapHeight(fRows, mRows, obj.isModeChg, true, false, frRows);
            }
            if (wrapMode === 'Content' && this.parent.allowTextWrap) {
                hdrClassList.add('e-wrap');
            } else {
                hdrClassList.remove('e-wrap');
            }
            if (wrapMode === 'Both' || obj.isModeChg) {
                if (isLeftRight) {
                    frRows = frHdr.querySelectorAll('tr') as NodeListOf<HTMLElement>;
                }
                fRows = fHdr.querySelectorAll('tr') as NodeListOf<HTMLElement>;
                mRows = mHdr.querySelectorAll('tr') as NodeListOf<HTMLElement>;
            } else {
                if (isLeftRight) {
                    frRows = frHdr.querySelector(wrapMode === 'Content' ?
                        literals.tbody : 'thead').querySelectorAll('tr') as NodeListOf<HTMLElement>;
                }
                fRows = fHdr.querySelector(wrapMode === 'Content' ?
                    literals.tbody : 'thead').querySelectorAll('tr') as NodeListOf<HTMLElement>;
                mRows = mHdr.querySelector(wrapMode === 'Content' ?
                    literals.tbody : 'thead').querySelectorAll('tr') as NodeListOf<HTMLElement>;
            }
            if (!this.parent.getHeaderContent().getElementsByClassName('e-stackedheadercell').length) {
                this.setWrapHeight(fRows, mRows, obj.isModeChg, false, this.colDepth > 1, frRows);
            }
            this.refreshStackedHdrHgt();
        } else if (obj.case === 'refreshHeight') {
            mRows = cont.querySelector('.' + literals.movableContent).querySelectorAll('tr') as NodeListOf<HTMLElement>;
            fRows = cont.querySelector('.' + literals.frozenContent).querySelectorAll('tr') as NodeListOf<HTMLElement>;
            if (isLeftRight) {
                frRows = cont.querySelector('.e-frozen-right-content').querySelectorAll('tr') as NodeListOf<HTMLElement>;
            }
            this.setWrapHeight(fRows, mRows, obj.isModeChg, false, false, frRows);
            if (!this.parent.getHeaderContent().getElementsByClassName('e-stackedheadercell').length) {
                if (isLeftRight) {
                    frRows = frHdr.querySelectorAll('tr') as NodeListOf<HTMLElement>;
                }
                fRows = fHdr.querySelectorAll('tr') as NodeListOf<HTMLElement>;
                mRows = mHdr.querySelectorAll('tr') as NodeListOf<HTMLElement>;
                this.setWrapHeight(fRows, mRows, obj.isModeChg, false, false, frRows);
            }
        }
    }

    /**
     * Function to hide header table column based on visible property
     *
     * @param {Column[]} columns - specifies the column[]
     * @returns {void}
     */
    public setVisible(columns?: Column[]): void {
        const gObj: IGrid = this.parent;
        let displayVal: string;
        let idx: number;
        const left: number = this.parent.getFrozenLeftColumnsCount();
        const right: number = this.parent.getFrozenRightColumnsCount();
        const movable: number = this.parent.getMovableColumnsCount();
        for (let c: number = 0, clen: number = columns.length; c < clen; c++) {
            const column: Column = columns[c];
            idx = gObj.getNormalizedColumnIndex(column.uid);
            displayVal = column.visible ? '' : 'none';
            if (column.freeze === 'Left' || column.freeze === 'Right') {
                if (left && !right) {
                    const leftColGrp: Element = gObj.getHeaderContent().querySelector('.e-frozen-left-header').querySelector(literals.colGroup);
                    setStyleAttribute(<HTMLElement>leftColGrp.children[idx], { 'display': displayVal });
                } else if (!left && right) {
                    const rightColGrp: Element = gObj.getHeaderContent().querySelector('.e-frozen-right-header').querySelector(literals.colGroup);
                    setStyleAttribute(<HTMLElement>rightColGrp.children[idx - movable], { 'display': displayVal });
                }
            } else {
                const mTblColGrp: Element = gObj.getHeaderContent().querySelector('.' + literals.movableHeader).querySelector(literals.colGroup);
                setStyleAttribute(<HTMLElement>mTblColGrp.children[idx - left], { 'display': displayVal });
            }
        }
        this.refreshUI();
    }

    protected filterRenderer(ele: Element, frozenColumn: number, total?: number): Element {
        return super.filterRenderer(ele, frozenColumn, total);
    }

    public refreshUI(): void {
        let frTbody: Element;
        const tbody: Element = this.getMovableHeader().querySelector( literals.tbody);
        remove(this.getMovableHeader().querySelector('table'));
        if (this.parent.getFrozenMode() === literals.leftRight) {
            frTbody = this.getFrozenRightHeader().querySelector( literals.tbody);
            remove(this.getFrozenRightHeader().querySelector('table'));
        }
        super.refreshFrozenLeftUI();
        this.rfshMovable();
        this.getMovableHeader().querySelector( literals.tbody).innerHTML = tbody.innerHTML;
        if (frTbody) { this.getFrozenRightHeader().querySelector( literals.tbody).innerHTML = frTbody.innerHTML; }
        this.updateColgroup();
        this.widthService.setWidthToColumns();
        this.parent.notify(events.colGroupRefresh, {});
        if (this.parent.allowTextWrap && this.parent.textWrapSettings.wrapMode === 'Header') {
            wrap([].slice.call(this.getMovableHeader().querySelectorAll('tr.e-columnheader')), true);
        }
        this.parent.updateDefaultCursor();
        const mTbl: Element = this.parent.getContent().querySelector('.' + literals.movableContent).querySelector('.' + literals.table);
        remove(mTbl.querySelector(literals.colGroup));
        const mColGroup: Element
            = (this.getMovableHeader().querySelector(literals.colGroup).cloneNode(true)) as Element;
        mTbl.insertBefore(mColGroup, mTbl.querySelector( literals.tbody));
        if (frTbody) {
            const frtbl: Element = this.parent.getContent().querySelector('.e-frozen-right-content').querySelector('.' + literals.table);
            remove(frtbl.querySelector(literals.colGroup));
            const frtblColGroup: Element
                = (this.getFrozenRightHeader().querySelector(literals.colGroup).cloneNode(true)) as Element;
            frtbl.insertBefore(frtblColGroup, frtbl.querySelector( literals.tbody));
        }
        this.widthService.refreshFrozenScrollbar();
        this.initializeHeaderDrag();
        this.parent.notify(events.headerRefreshed, { rows: this.rows, args: { isFrozen: false } });
    }

    protected refreshFreeze(obj: { case: string, isModeChg?: boolean }): void {
        const left: number = this.parent.getFrozenLeftColumnsCount();
        const right: number = this.parent.getFrozenRightColumnsCount();
        const movable: number = this.parent.getMovableColumnsCount();
        if (obj.case === 'filter') {
            const filterRow: Element = this.getTable().querySelector('.e-filterbar');
            if (this.parent.allowFiltering && filterRow && this.getMovableHeader().querySelector('thead')) {
                const isDraggable: boolean = this.parent.isRowDragable();
                const index: number = left ? isDraggable ? left + 1 : left : 0;
                const total: number = left + movable + (left && isDraggable ? 1 : 0);
                this.getMovableHeader().querySelector('thead')
                    .appendChild(this.filterRenderer(filterRow, index, total));
                if (this.parent.getFrozenMode() === literals.leftRight) {
                    const ele: HTMLInputElement[] = [].slice.call(this.getMovableHeader().
                        querySelectorAll('thead .e-filterbarcell .e-input'));
                    this.getFrozenRightHeader().querySelector('thead').appendChild(this.filterRenderer(filterRow, index, index + right));
                    this.adjudtFilterBarCell(ele);
                }
                const elements: HTMLInputElement[] = [].slice.call(this.getMovableHeader().
                    querySelectorAll('thead .e-filterbarcell .e-input'));
                this.adjudtFilterBarCell(elements);
            }
        } else if (obj.case === 'textwrap' || obj.case === 'refreshHeight') {
            this.refreshHeight(obj);
            (<{ refreshScrollOffset?: Function }>this.parent.contentModule).refreshScrollOffset();
        }
    }

    private updateFrozenColGroup(cols: Column, colGroup: HTMLElement): void {
        if (cols && cols.visible === false) {
            setStyleAttribute(colGroup, { 'display': 'none' });
        }
    }

    private adjudtFilterBarCell(elements: HTMLElement[]): void {
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

    public renderPanel(): void {
        if (this.parent.getFrozenLeftColumnsCount()) {
            super.renderPanel();
            if (this.parent.getFrozenRightColumnsCount()) {
                this.renderLeftWithRightFrozenPanel();
            }
        } else {
            this.renderRightFrozenPanelAlone();
        }
        (this.getPanel().firstChild as HTMLElement).style.display = 'flex';
        (this.getMovableHeader() as HTMLElement).style.flex = '1';
    }

    public renderTable(): void {
        if (this.parent.getFrozenLeftColumnsCount()) {
            super.renderTable();
        } else {
            this.renderFrozenRightTableAlone();
        }
    }

    protected rfshMovable(): void {
        if (this.parent.getFrozenLeftColumnsCount()) {
            super.rfshMovable();
            if (this.parent.getFrozenRightColumnsCount()) {
                const rows: Row<Column>[] = this.rows;
                this.getFrozenRightHeader().appendChild(this.createHeader(undefined, 'frozen-right'));
                this.refreshStackedHdrHgt();
                this.parent.notify(events.headerRefreshed, { rows: this.rows, args: { renderFrozenRightContent: true } });
                this.rows = rows;
            }
        } else {
            this.getFrozenRightHeader().appendChild(this.getTable());
            this.getMovableHeader().appendChild(this.createHeader(undefined, 'movable'));
            this.refreshStackedHdrHgt();
            this.addMovableFirstCls();
        }
    }

    protected refreshStackedHdrHgt(): void {
        if (this.parent.getFrozenLeftColumnsCount()) {
            super.refreshStackedHdrHgt();
            if (this.parent.getFrozenRightColumnsCount()) {
                this.refreshFrozenRightStackedHdrHgt();
            }
        } else {
            this.refreshFrozenRightStackedHdrHgt();
        }
    }

    private refreshFrozenRightStackedHdrHgt(): void {
        let fRowSpan: { min: number, max: number };
        const frTr: NodeListOf<Element> = [].slice.call(this.getFrozenRightHeader().getElementsByClassName('e-columnheader'));
        const mTr: NodeListOf<Element> = [].slice.call(this.getMovableHeader().getElementsByClassName('e-columnheader'));
        for (let i: number = 0, len: number = frTr.length; i < len; i++) {
            fRowSpan = this.getRowSpan(frTr[i]);
            if (fRowSpan.min > 1) {
                this.updateStackedHdrRowHgt(i, fRowSpan.max, frTr[i], mTr);
            }
        }
    }

    /**
     * @returns {void}
     * @hidden
     */
    public updateColgroup(): void {
        this.updateMovableColGroup();
        if (this.parent.getFrozenLeftColumnsCount()) {
            this.updateFrozenLeftColGroup();
        }
        if (this.parent.getFrozenRightColumnsCount()) {
            this.updateFrozenRightColGroup();
        }
    }

    private renderRightFrozenPanelAlone(): void {
        let mDiv: Element = this.parent.element.querySelector('.' + literals.movableHeader);
        let fRightDiv: Element = this.parent.element.querySelector('.e-frozen-right-header');
        super.renderFrozenRightPanel();
        if (isNullOrUndefined(fRightDiv)) {
            mDiv = this.parent.createElement('div', { className: literals.movableHeader });
            fRightDiv = this.parent.createElement('div', { className: 'e-frozenheader e-frozen-right-header' });
            this.getPanel().querySelector('.' + literals.headerContent).appendChild(mDiv);
            this.getPanel().querySelector('.' + literals.headerContent).appendChild(fRightDiv);
        }
        super.setMovableHeader(mDiv);
        this.setFrozenRightHeader(fRightDiv);
    }

    private renderLeftWithRightFrozenPanel(): void {
        let fRightDiv: Element = this.parent.element.querySelector('.e-frozen-right-header');
        super.renderFrozenRightPanel();
        if (isNullOrUndefined(fRightDiv)) {
            fRightDiv = this.parent.createElement('div', { className: 'e-frozenheader e-frozen-right-header' });
            this.getPanel().querySelector('.' + literals.headerContent).appendChild(fRightDiv);
        }
        this.setFrozenRightHeader(fRightDiv);
    }

    private renderFrozenRightTableAlone(): void {
        super.renderFrozenRightTable();
        this.rfshMovable();
        this.updateColgroup();
        this.initializeHeaderDrag();
        this.initializeHeaderDrop();
        this.parent.notify(events.headerRefreshed, { rows: this.rows, args: { isFrozen: false } });
    }

    private updateFrozenLeftColGroup(): void {
        const leftColGroup: HTMLCollection = this.getFrozenHeader().querySelector(literals.colGroup).children;
        const start: number = this.parent.isRowDragable() ? 1 : 0;
        const count: number = this.parent.isRowDragable() ? this.parent.getFrozenLeftColumnsCount() + 1
            : this.parent.getFrozenLeftColumnsCount();
        for (let i: number = start; i < leftColGroup.length; i++) {
            if (i >= count) {
                remove(leftColGroup[i]);
                i--;
            }
        }
    }

    private updateMovableColGroup(): void {
        const movableColGroup: HTMLCollection = this.getMovableHeader().querySelector(literals.colGroup).children;
        if (this.parent.isRowDragable()) {
            remove(movableColGroup[0]);
        }
        const length: number = movableColGroup.length;
        const left: number = this.parent.getFrozenLeftColumnsCount();
        const movable: number = this.parent.getMovableColumnsCount();
        let k: number = 0;
        for (let i: number = 0; i < length; i++, k++) {
            if (i < left || i >= left + movable) {
                remove(movableColGroup[k]);
                k--;
            }
        }
    }

    private updateFrozenRightColGroup(): void {
        const isDraggable: boolean = this.parent.isRowDragable();
        const rightColumns: Column[] = this.parent.getFrozenRightColumns();
        const rightColGroup: HTMLCollection = this.getFrozenRightHeader().querySelector(literals.colGroup).children;
        if (this.parent.getFrozenMode() === literals.leftRight && isDraggable) {
            remove(rightColGroup[0]);
        }
        const length: number = rightColGroup.length;
        const left: number = this.parent.getFrozenLeftColumnsCount();
        const movable: number = this.parent.getMovableColumnsCount();
        let k: number = 0;
        for (let i: number = 0; i < length; i++) {
            if (i < left + movable) {
                remove(rightColGroup[0]);
            } else {
                this.updateFrozenColGroup(rightColumns[k], rightColGroup[k] as HTMLElement);
                k++;
            }
        }
    }

    private setFrozenRightHeader(ele: Element): void {
        this.frozenRightHeader = ele;
    }

    public getFrozenRightHeader(): Element {
        return this.frozenRightHeader;
    }
}

/**
 * ColumnFreezeContentRenderer is used to freeze the columns content at right and left
 *
 * @hidden
 */
export class ColumnFreezeContentRenderer extends FreezeContentRender implements IRenderer {
    private frozenRigthContent: Element;
    private movableRowElements: Element[];
    private frozenRightRows: Row<Column>[];
    private frozenRightRowElements: Element[];
    private frzCount: number = 0;
    private isColGroupRefresh: boolean = false;
    protected widthService: ColumnWidthService;

    constructor(parent?: IGrid, locator?: ServiceLocator) {
        super(parent, locator);
        this.widthService = locator.getService<ColumnWidthService>('widthService');
    }

    public renderPanel(): void {
        if (this.parent.getFrozenLeftColumnsCount()) {
            super.renderPanel();
            if (this.parent.getFrozenRightColumnsCount()) {
                this.renderFrozenLeftWithRightPanel();
            }
        } else {
            this.renderFrozenRightPanelAlone();
        }
        const display: string = this.parent.enableVirtualization ? '' : 'flex';
        (this.getPanel().firstChild as HTMLElement).style.display = display;
    }

    public renderTable(): void {
        if (this.parent.getFrozenLeftColumnsCount()) {
            super.renderTable();
            if (this.parent.getFrozenRightColumnsCount()) {
                this.renderFrozenLeftWithRightTable();
                const display: string = !this.parent.getVisibleFrozenRightCount() ? 'none' : '';
                this.renderHorizontalScrollbar('e-frozenscrollbar e-frozen-right-scrollbar', display, true);
            }
        } else {
            this.renderFrozenRightTableAlone();
            const display: string = !this.parent.getVisibleFrozenRightCount() ? 'none' : '';
            this.renderHorizontalScrollbar('e-frozenscrollbar e-frozen-right-scrollbar', display);
        }
        (this.getMovableContent() as HTMLElement).style.flex = '1';
    }

    protected appendScrollbar(frozen: Element, movable: Element, isRight?: boolean): void {
        const parent: Element = this.parent.createElement('div', { className: 'e-scrollbar', styles: 'display: flex' });
        if (this.parent.getFrozenLeftColumnsCount()) {
            if (!isRight) {
                parent.appendChild(frozen);
                parent.appendChild(movable);
            } else {
                this.parent.getContent().querySelector('.e-scrollbar').appendChild(frozen);
                return;
            }
        } else {
            parent.appendChild(movable);
            parent.appendChild(frozen);
        }
        this.parent.getContent().appendChild(parent);
    }

    private renderFrozenRightPanelAlone(): void {
        this.renderFrozenRigthPanel();
        let mDiv: Element = this.parent.element.querySelector('.' + literals.movableContent);
        let fRightContent: Element = this.parent.element.querySelector('.e-frozen-right-content');
        if (isNullOrUndefined(fRightContent)) {
            mDiv = this.parent.createElement('div', { className: literals.movableContent });
            fRightContent = this.parent.createElement('div', { className: 'e-frozencontent e-frozen-right-content' });
            this.getPanel().querySelector('.' + literals.content).appendChild(mDiv);
            this.getPanel().querySelector('.' + literals.content).appendChild(fRightContent);
        }
        super.setMovableContent(mDiv);
        this.setFrozenRightContent(fRightContent);
    }

    private renderFrozenLeftWithRightPanel(): void {
        this.renderFrozenRigthPanel();
        let fRightContent: Element = this.parent.element.querySelector('.e-frozen-right-content');
        if (isNullOrUndefined(fRightContent)) {
            fRightContent = this.parent.createElement('div', { className: 'e-frozencontent e-frozen-right-content' });
            this.getPanel().querySelector('.' + literals.content).appendChild(fRightContent);
        }
        this.setFrozenRightContent(fRightContent);
    }

    private renderFrozenRightTableAlone(): void {
        let mTbl: Element;
        if (this.getFrozenRightContent().querySelector('.' + literals.table) == null) {
            super.renderFrozenRightTable();
            this.getFrozenRightContent().appendChild(this.getTable());
            mTbl = this.getTable().cloneNode(true) as Element;
            this.getMovableContent().appendChild(mTbl);
        } else {
            if (this.parent.frozenRows) {
                this.parent.getHeaderContent().classList.add('e-frozenhdrcont');
            }
            this.setTable(this.getFrozenRightContent().querySelector('.' + literals.table));
            this.setColGroup(this.getFrozenRightHeaderColGroup());
            mTbl = this.getMovableContent().querySelector('.' + literals.table);
            this.getFrozenRightContent().querySelector('.' + literals.table).appendChild(this.getColGroup());
        }
        if (this.getMovableContent().querySelector(literals.colGroup)) {
            remove(this.getMovableContent().querySelector(literals.colGroup));
        }
        const colgroup: Element = ((this.parent.getHeaderContent().querySelector('.' + literals.movableHeader)
            .querySelector(literals.colGroup)).cloneNode(true)) as Element;
        mTbl.insertBefore(colgroup, mTbl.querySelector( literals.tbody));
    }

    private renderFrozenLeftWithRightTable(): void {
        const frozenRight: Element = this.getTable().cloneNode(true) as Element;
        this.getFrozenRightContent().appendChild(frozenRight);
        const oldColGroup: Element = this.getFrozenRightContent().querySelector(literals.colGroup);
        if (oldColGroup) {
            remove(oldColGroup);
        }
        const rightTable: Element = this.getFrozenRightContent().querySelector('.' + literals.table);
        rightTable.insertBefore(this.getFrozenRightHeaderColGroup(), rightTable.querySelector( literals.tbody));
    }

    private renderFrozenRightEmptyRowAlone(tbody: HTMLElement): void {
        super.renderFrozenRightEmpty(tbody);
        this.getMovableContent().querySelector( literals.tbody).innerHTML = '<tr><td></td></tr>';
        addClass([this.parent.getMovableContentTbody().querySelector('tr')], ['e-emptyrow']);
        this.getFrozenRightContent().querySelector('.e-emptyrow').querySelector('td').colSpan = this.parent.getVisibleFrozenRightCount();
        if (this.parent.frozenRows) {
            this.parent.getFrozenRightHeaderTbody().innerHTML = '';
            this.parent.getMovableHeaderTbody().innerHTML = '';
        }
    }

    /**
     * @param {string} tableName - specfies the table name
     * @returns {HTMLElement} returns the element
     * @hidden
     */
    public getFrozenHeader(tableName: string): HTMLElement {
        if (tableName === literals.frozenLeft) {
            return this.parent.getHeaderContent().querySelector('.e-frozen-left-header').querySelector( literals.tbody);
        } else if (tableName === 'movable') {
            return this.parent.getHeaderContent().querySelector('.' + literals.movableHeader).querySelector( literals.tbody);
        } else {
            return this.parent.getHeaderContent().querySelector('.e-frozen-right-header').querySelector( literals.tbody);
        }
    }

    private renderFrozenLeftWithRightEmptyRow(): void {
        this.getFrozenRightContent().querySelector( literals.tbody).innerHTML = '<tr><td></td></tr>';
        addClass([this.getFrozenRightContent().querySelector( literals.tbody).querySelector('tr')], ['e-emptyrow']);
        if (this.parent.frozenRows) {
            this.parent.getHeaderContent().querySelector('.e-frozen-right-header').querySelector( literals.tbody).innerHTML = '';
        }
    }

    private setFrozenRightContent(ele: Element): void {
        this.frozenRigthContent = ele;
    }

    public getFrozenRightContent(): Element {
        return this.frozenRigthContent;
    }

    protected getHeaderColGroup(): Element {
        let colGroup: Element = <Element>this.parent.element.querySelector('.' + literals.gridHeader).querySelector(literals.colGroup).cloneNode(true);
        if (!this.parent.getFrozenLeftColumnsCount()) {
            const right: Element = this.getFrozenRightHeaderColGroup();
            colGroup = right && this.frzCount ? right.cloneNode(true) as Element : colGroup;
            this.frzCount++;
            this.isColGroupRefresh = true;
        }
        return colGroup;
    }

    private getFrozenRightHeaderColGroup(): Element {
        let col: Element = this.parent.getHeaderContent().querySelector('.e-frozen-right-header').querySelector(literals.colGroup);
        if (!col) {
            col = this.parent.getHeaderContent().querySelector(literals.colGroup);
        }
        return col.cloneNode(true) as Element;
    }

    public setColGroup(colGroup: Element): Element {
        if (this.parent.getFrozenLeftColumnsCount()) {
            return super.setColGroup(colGroup);
        } else {
            colGroup = !this.isColGroupRefresh ? this.getFrozenRightHeaderColGroup() : colGroup;
            if (!isNullOrUndefined(colGroup)) {
                colGroup.id = 'content-' + colGroup.id;
            }
            this.isColGroupRefresh = false;
            if (this.frzCount === 2) { this.frzCount = 0; }
            return this.colgroup = colGroup;
        }
    }

    public renderEmpty(tbody: HTMLElement): void {
        if (this.parent.getFrozenLeftColumnsCount()) {
            super.renderEmpty(tbody);
            this.getFrozenContent().querySelector('.e-emptyrow').querySelector('td').colSpan = this.parent.getVisibleFrozenLeftCount();
            if (this.parent.getFrozenRightColumnsCount()) {
                this.renderFrozenLeftWithRightEmptyRow();
            }
        } else {
            this.renderFrozenRightEmptyRowAlone(tbody);
        }
        this.parent.notify(events.freezeRender, { case: 'refreshHeight' });
    }

    protected setHeightToContent(height: number): void {
        if (this.parent.getFrozenRightColumnsCount()) {
            (this.getFrozenRightContent() as HTMLElement).style.height = height.toString() + 'px';
        }
        if (this.parent.getFrozenLeftColumnsCount()) {
            (this.getFrozenContent() as HTMLElement).style.height = height.toString() + 'px';
        }
        (this.getMovableContent() as HTMLElement).style.height = height.toString() + 'px';
    }

    protected actionComplete(args: NotifyArgs): void {
        super.actionComplete(args);
    }

    protected batchAdd(args: { name: string }): void {
        super.batchAdd(args);
    }

    /**
     * @param {freezeTable} tableName - specfies the table name
     * @returns {Element} - returns the element
     * @hidden
     */
    public getTbody(tableName: freezeTable): Element {
        let tbody: Element;
        if (tableName === literals.frozenLeft) {
            tbody = this.parent.getFrozenLeftContentTbody() as HTMLElement;
        } else if (tableName === 'movable') {
            tbody = this.parent.getMovableContentTbody() as HTMLElement;
        } else if (tableName === literals.frozenRight) {
            tbody = this.parent.getFrozenRightContentTbody() as HTMLElement;
        }
        return tbody;
    }

    /**
     * @param {NotifyArgs} args - specfies the args
     * @param {freezeTable} tableName - specfies the freeze table
     * @returns {void}
     * @hidden
     */
    public setIsFrozen(args: NotifyArgs, tableName: freezeTable): void {
        args.isFrozen = (tableName === literals.frozenLeft || (this.parent.getFrozenMode() === 'Right'
            && tableName === literals.frozenRight));
        args.renderFrozenRightContent = this.parent.getFrozenMode() === literals.leftRight && tableName === literals.frozenRight;
        args.renderMovableContent = tableName === 'movable';
    }

    /**
     * @param {Element} tbody - specfies the element
     * @param {DocumentFragment | HTMLElement} frag - specfies the frag
     * @param {NotifyArgs} args - specfies the args
     * @param {freezeTable} tableName - specfies the tableName
     * @returns {void}
     * @hidden
     */
    public appendContent(tbody: Element, frag: DocumentFragment | HTMLElement, args: NotifyArgs, tableName?: freezeTable): void {
        if (!isNullOrUndefined(this.parent.rowTemplate) && this.parent.isReact) {
            tbody = frag as HTMLElement;
        } else {
            tbody.appendChild(frag);
        }
        if (this.parent.getFrozenMode() === 'Left') {
            if (tableName === literals.frozenLeft) {
                this.isLoaded = false;
                this.getFrozenContent().querySelector('table').appendChild(tbody);
                this.refreshContentRows(extend({}, args));
            } else {
                this.refreshTbody(tbody);
                this.isLoaded = true;
                this.getMovableContent().querySelector('table').appendChild(tbody);
                this.refreshHeight();
                this.refreshScrollOffset();
            }
        } else if (this.parent.getFrozenMode() === 'Right') {
            if (tableName === 'movable') {
                this.refreshTbody(tbody);
                this.isLoaded = true;
                this.getMovableContent().querySelector('table').appendChild(tbody);
                this.refreshHeight();
                this.refreshScrollOffset();
            } else {
                this.isLoaded = false;
                this.getFrozenRightContent().querySelector('table').appendChild(tbody);
                this.refreshContentRows(extend({}, args));
            }
        } else if (this.parent.getFrozenMode() === literals.leftRight) {
            if (tableName === literals.frozenLeft) {
                this.isLoaded = false;
                this.getFrozenContent().querySelector('table').appendChild(tbody);
                this.refreshContentRows(extend({}, args));
            } else if (tableName === 'movable') {
                this.refreshTbody(tbody);
                this.isLoaded = false;
                this.getMovableContent().querySelector('table').appendChild(tbody);
                this.refreshContentRows(extend({}, args));
            } else {
                this.isLoaded = true;
                this.getFrozenRightContent().querySelector('table').appendChild(tbody);
                this.refreshHeight();
                this.refreshScrollOffset();
            }
        }
        if (this.isInitialRender) {
            this.parent.scrollModule.setHeight();
            this.isInitialRender = false;
        }
        this.widthService.refreshFrozenScrollbar();
    }

    protected refreshHeight(): void {
        if (!this.parent.allowTextWrap) {
            this.parent.notify(events.freezeRender, { case: 'refreshHeight' });
        }
    }

    /**
     * @param {freezeTable} tableName - specifies the table
     * @returns {void}
     * @hidden
     */
    public splitRows(tableName: freezeTable): void {
        const left: number = this.parent.getFrozenLeftColumnsCount();
        const right: number = this.parent.getFrozenRightColumnsCount();
        if (left && !right) {
            if (tableName === literals.frozenLeft) {
                this.freezeRows = this.rows;
                this.freezeRowElements = this.rowElements;
            } else {
                this.movableRows = this.rows;
            }
        } else if (!left && right) {
            if (tableName === 'movable') {
                this.movableRows = this.rows;
            } else {
                this.freezeRows = this.rows;
                this.freezeRowElements = this.rowElements;
            }
        } else if (left && right) {
            if (tableName === literals.frozenLeft) {
                this.freezeRows = this.rows;
                this.freezeRowElements = this.rowElements;
            } else if (tableName === 'movable') {
                this.movableRows = this.rows;
                this.movableRowElements = this.rowElements;
            } else {
                this.frozenRightRows = this.rows;
                this.frozenRightRowElements = this.rowElements;
            }
        }
    }

    /**
     * Get the Freeze pane movable content table data row elements
     *
     * @returns {Element} returns the element
     */
    public getMovableRowElements(): Element[] {
        if (this.parent.getFrozenMode() !== literals.leftRight) {
            return this.rowElements;
        } else {
            return this.movableRowElements;
        }
    }

    /**
     * Get the Freeze pane frozen right content table data row elements
     *
     * @returns {Element} returns the Element
     */
    public getFrozenRightRowElements(): Element[] {
        if (this.parent.getFrozenMode() !== literals.leftRight) {
            return this.freezeRowElements;
        } else {
            return this.frozenRightRowElements;
        }
    }

    /**
     * Get the frozen right row collection in the Freeze pane Grid.
     *
     * @returns {Row[] | HTMLCollectionOf<HTMLTableRowElement>} returns the row object
     */
    public getFrozenRightRows(): Row<Column>[] | HTMLCollectionOf<HTMLTableRowElement> {
        if (this.parent.getFrozenMode() === literals.leftRight) {
            if (this.parent.enableInfiniteScrolling) {
                return this.rightFreezeRows;
            }
            return this.frozenRightRows;
        } else {
            return this.getRows();
        }
    }

    /**
     * @param {number} index - specifies the index
     * @returns {Element} returns the element
     * @hidden
     */
    public getFrozenRightRowByIndex(index: number): Element {
        return this.parent.getFrozenRightDataRows()[index];
    }

    /**
     * Get the Row collection in the Grid.
     *
     * @returns {Row[] | HTMLCollectionOf<HTMLTableRowElement>} returns the row object
     */
    public getRows(): Row<Column>[] | HTMLCollectionOf<HTMLTableRowElement> {
        const infiniteRows: Row<Column>[] = this.getInfiniteRows();
        return infiniteRows.length ? infiniteRows : this.freezeRows;
    }

    /**
     * Get the content table data row elements
     *
     * @returns {Element} returns the element
     */
    public getRowElements(): Element[] {
        return this.freezeRowElements;
    }
}
