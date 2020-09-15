import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { SfGrid } from "./sf-grid-fn";
import { BlazorGridElement } from "./interfaces";
import { getScrollBarWidth } from './util';
/**
 * Frozen rows and column handling
 */
export class Freeze {
    private frozenHeader: HTMLElement;
    private movableHeader: HTMLElement;
    private element: BlazorGridElement;
    private parent: SfGrid;
    constructor(parent?: SfGrid) {
        this.parent = parent;
        this.frozenHeader = parent.element.querySelector('.e-frozenheader');
        this.movableHeader = parent.element.querySelector('.e-movableheader');
        this.addEventListener();
    }

    public addEventListener(): void {
        if (this.parent.options.frozenColumns) {
            this.setFrozenHeight();
            this.refreshFreeze({ case: 'textwrap' });
            this.refreshFreeze({ case: 'refreshHeight' });
        }
    }

    public refreshFreeze(obj: { case: string, isModeChg?: boolean }): void {
        if (obj.case === 'textwrap' || obj.case === 'refreshHeight') {
            let fRows: NodeListOf<HTMLElement>;
            let mRows: NodeListOf<HTMLElement>;
            let fHdr: Element = this.getFrozenHeader();
            let mHdr: Element = this.getMovableHeader();
            let cont: Element = this.parent.getContent();
            let wrapMode: string = this.parent.options.wrapMode;
            if (obj.case === 'textwrap') {
                if (wrapMode !== 'Header' || obj.isModeChg) {
                    fRows = cont.querySelector('.e-frozencontent').querySelectorAll('tr') as NodeListOf<HTMLElement>;
                    mRows = cont.querySelector('.e-movablecontent').querySelectorAll('tr') as NodeListOf<HTMLElement>;
                    this.setWrapHeight(fRows, mRows, obj.isModeChg, true);
                }

                if (wrapMode === 'Both' || obj.isModeChg) {
                    fRows = fHdr.querySelectorAll('tr') as NodeListOf<HTMLElement>;
                    mRows = mHdr.querySelectorAll('tr') as NodeListOf<HTMLElement>;
                } else {
                    fRows = fHdr.querySelector(wrapMode === 'Content' ?
                        'tbody' : 'thead').querySelectorAll('tr') as NodeListOf<HTMLElement>;
                    mRows = mHdr.querySelector(wrapMode === 'Content' ?
                        'tbody' : 'thead').querySelectorAll('tr') as NodeListOf<HTMLElement>;
                }
                if (!this.parent.getHeaderContent().querySelectorAll('.e-stackedheadercell').length) {
                    this.setWrapHeight(fRows, mRows, obj.isModeChg, false, false);
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
    }

    private updateResizeHandler(): void {
        let elements: HTMLElement[] = [].slice.call(this.parent.getHeaderContent().querySelectorAll('.e-rhandler'));
        for (let i: number = 0; i < elements.length; i++) {
            elements[i].style.height = elements[i].parentElement.offsetHeight + 'px';
        }
    }

    private setWrapHeight(
        fRows: NodeListOf<HTMLElement>, mRows: NodeListOf<HTMLElement>, isModeChg: boolean,
        isContReset?: boolean, isStackedHdr?: boolean): void {
        let fRowHgt: number;
        let mRowHgt: number;
        let isWrap: boolean = this.parent.options.allowTextWrap;
        let wrapMode: string = this.parent.options.wrapMode;
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

            if (fRowHgt > mRowHgt) { mRows[i].style.height = fRowHgt + 'px'; }
            else if (mRowHgt > fRowHgt) { fRows[i].style.height = mRowHgt + 'px'; }

            //TODO: check below commented code is not working hence used above
            // if (!isNullOrUndefined(fRows[i]) && fRows[i].childElementCount && ((isWrap && fRowHgt < mRowHgt) ||
            //     (!isWrap && fRowHgt < mRowHgt))) {
            //     fRows[i].style.height = mRowHgt + 'px';
            // }
            // if (mRows && !isNullOrUndefined(mRows[i]) && mRows[i].childElementCount && ((isWrap && fRowHgt > mRowHgt) ||
            //     (!isWrap && fRowHgt > mRowHgt))) {
            //     mRows[i].style.height = fRowHgt + 'px';
            // }
        }
        if (isWrap) {
            this.setFrozenHeight();
        }
    }

    public setFrozenHeight(height: number = getScrollBarWidth()): void {
        let movableContentHeight: number = this.parent.element.querySelector('.e-movablecontent').getBoundingClientRect().height;
        let movableContent: HTMLElement = this.parent.element.querySelector('.e-movablecontent') as HTMLElement;
        let frozenContent: HTMLElement = this.parent.element.querySelector('.e-frozencontent') as HTMLElement;
        //if (movableContent.scrollWidth - movableContent.clientWidth) {
        //TODO: why we need commented code?
        frozenContent.style.height = movableContentHeight - height + 'px';
        frozenContent.style.borderBottom = '';
        // } else {
        //     frozenContent.style.height = movableContentHeight + 'px';
        //     if ((frozenContent.scrollHeight <= frozenContent.clientHeight) ||
        //         (movableContent.scrollHeight <= movableContent.clientHeight)) {
        //         this.parent.scrollModule.removePadding();
        //     }
        //     frozenContent.style.borderBottom = '0px';
        // }
    }

    private refreshStackedHdrHgt(): void {
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
        if (this.parent.options.allowResizing) {
            this.updateResizeHandler();
        }
    }

    private getRowSpan(row: Element): { min: number, max: number } {
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

    private updateStackedHdrRowHgt(idx: number, maxRowSpan: number, row: Element, rows: NodeListOf<Element>): void {
        let height: number = 0;
        for (let i: number = 0; i < maxRowSpan; i++) {
            height += (rows[idx + i] as HTMLElement).style.height ?
                parseInt((rows[idx + i] as HTMLElement).style.height, 10) : (rows[idx + i] as HTMLElement).offsetHeight;
        }
        (row as HTMLElement).style.height = height + 'px';
    }

    public getFrozenHeader(): Element {
        return this.frozenHeader;
    }

    public getMovableHeader(): Element {
        return this.movableHeader;
    }

    public refreshRowHeight(): void {
        if (this.parent.options.rowHeight != 0) { return;}
        if (this.parent.options.frozenColumns || this.parent.options.frozenRows) {
            this.clearWrapHeight();
            this.refreshStackedHdrHgt();
            this.refreshFreeze({ case: 'refreshHeight' });
            if (this.parent.options.allowResizing) {
                this.updateResizeHandler();
            }
        }
    }

    public clearWrapHeight(): void {
        var fn: Function = (fRows: NodeListOf<HTMLElement>, mRows: NodeListOf<HTMLElement>) => {
            for (var i: number = 0, len = fRows.length; i < len; i++) {
                if (!isNullOrUndefined(fRows[i]) && !isNullOrUndefined(mRows[i])) {
                    fRows[i].style.height = null;
                    mRows[i].style.height = null;
                }
            }
        };
        var fRows: NodeListOf<HTMLElement>; var mRows: NodeListOf<HTMLElement>;
        if (this.parent.options.frozenColumns) {
            if (this.parent.options.frozenRows) {
                fRows = this.parent.element.querySelector('.e-frozenheader').querySelectorAll('tr');
                mRows = this.parent.element.querySelector('.e-movableheader').querySelectorAll('tr');
                fn(fRows, mRows);
            }
            fRows = this.parent.element.querySelector('.e-frozencontent').querySelectorAll('tr');
            mRows = this.parent.element.querySelector('.e-movablecontent').querySelectorAll('tr');
            fn(fRows, mRows);
        }

        if (this.parent.options.frozenRows && this.parent.options.frozenColumns == 0) {
            fRows = this.parent.element.querySelector('.e-headercontent').querySelectorAll('tr');
            mRows = this.parent.element.querySelector('.e-content').querySelectorAll('tr');
            fn(fRows, mRows);
        }
    }
}
