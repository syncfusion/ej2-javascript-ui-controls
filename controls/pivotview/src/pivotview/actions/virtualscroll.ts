import { EventHandler, setStyleAttribute } from '@syncfusion/ej2-base';
import { PivotView } from '../base/pivotview';
import { contentReady, scroll } from '../../common/base/constant';
import * as cls from '../../common/base/css-constant';
import { IAxisSet } from '../../base';
import { showSpinner, hideSpinner } from '@syncfusion/ej2-popups';

/**
 * `VirtualScroll` module is used to handle scrolling behavior.
 */
export class VirtualScroll {
    private parent: PivotView;
    private previousValues: { top: number, left: number } = { top: 0, left: 0 };
    /** @hidden */
    public direction: string;

    /**
     * Constructor for PivotView scrolling.
     * @hidden
     */
    constructor(parent?: PivotView) {
        this.parent = parent;
        this.addInternalEvents();
    }

    /**
     * It returns the Module name.
     * @returns string
     * @hidden
     */
    public getModuleName(): string {
        return 'virtualscroll';
    }

    private addInternalEvents(): void {
        this.parent.on(contentReady, this.wireEvents, this);
    }

    private wireEvents(): void {
        let mCont: HTMLElement = this.parent.element.querySelector('.' + cls.MOVABLECONTENT_DIV) as HTMLElement;
        let fCont: HTMLElement = this.parent.element.querySelector('.' + cls.FROZENCONTENT_DIV) as HTMLElement;
        let mHdr: HTMLElement = this.parent.element.querySelector('.' + cls.MOVABLEHEADER_DIV) as HTMLElement;
        EventHandler.clearEvents(mCont);
        EventHandler.clearEvents(fCont);
        if (this.parent.engineModule) {
            EventHandler.add(mCont, 'scroll touchmove pointermove', this.onHorizondalScroll(mHdr, mCont, fCont), this);
            EventHandler.add(mCont, 'scroll wheel touchmove pointermove', this.onVerticalScroll(fCont, mCont), this);
            EventHandler.add(mCont, 'mouseup touchend', this.common(mHdr, mCont, fCont), this);
        }
        this.parent.grid.isPreventScrollEvent = true;
    }

    private update(mHdr: HTMLElement, mCont: HTMLElement, top: number, left: number, e: Event): void {
        if (this.direction === 'vertical') {
            let rowValues: number = this.parent.dataSource.valueAxis === 'row' ? this.parent.dataSource.values.length : 1;
            let exactSize: number = (this.parent.pageSettings.rowSize * rowValues * this.parent.gridSettings.rowHeight);
            let section: number = Math.ceil(top / exactSize);
            if (this.parent.scrollPosObject.vertical === section) {
                hideSpinner(this.parent.element);
                return;
            }
            showSpinner(this.parent.element);
            this.parent.scrollPosObject.vertical = section;
            this.parent.engineModule.pageSettings.rowCurrentPage = section > 1 ? section : 1;
            this.parent.engineModule.generateGridData(this.parent.dataSource, this.parent.engineModule.headerCollection);
            this.parent.pivotValues = this.parent.engineModule.pivotValues;
            let exactPage: number = Math.ceil(this.parent.engineModule.rowStartPos / (this.parent.pageSettings.rowSize * rowValues));
            let pos: number = exactSize * exactPage -
                (this.parent.engineModule.rowFirstLvl * rowValues * this.parent.gridSettings.rowHeight);
            this.parent.scrollPosObject.verticalSection = pos;
        } else {
            let colValues: number = this.parent.dataSource.valueAxis === 'column' ? this.parent.dataSource.values.length : 1;
            let exactSize: number = (this.parent.pageSettings.columnSize *
                colValues * this.parent.gridSettings.columnWidth);
            let section: number = Math.ceil(left / exactSize);
            if (this.parent.scrollPosObject.horizontal === section) {
                hideSpinner(this.parent.element);
                return;
            }
            showSpinner(this.parent.element);
            this.parent.scrollPosObject.horizontal = section;
            this.parent.engineModule.pageSettings.columnCurrentPage = section > 1 ? section : 1;
            this.parent.engineModule.generateGridData(this.parent.dataSource, this.parent.engineModule.headerCollection);
            // let isLastPage: boolean =
            //     (this.parent.engineModule.pivotValues[0] as IAxisSet[])[this.parent.engineModule.pivotValues[0].length - 1].type
            //     === 'grand sum' && section > 0;
            this.parent.pivotValues = this.parent.engineModule.pivotValues;
            let exactPage: number = Math.ceil(this.parent.engineModule.colStartPos / (this.parent.pageSettings.columnSize * colValues));
            // let pos: number = isLastPage ?
            //     ((left + mHdr.clientWidth) - ((mHdr.querySelector('.' + cls.TABLE) as HTMLElement).offsetWidth)) :
            //     exactSize * exactPage - (this.parent.engineModule.colFirstLvl *
            //         colValues * this.parent.gridSettings.columnWidth);
            let pos: number = exactSize * exactPage - (this.parent.engineModule.colFirstLvl *
                colValues * this.parent.gridSettings.columnWidth);
            this.parent.scrollPosObject.horizontalSection = pos;
        }
    }

    private common(mHdr: HTMLElement, mCont: HTMLElement, fCont: HTMLElement): Function {
        return (e: Event) => {
            this.update(mHdr, mCont, mCont.scrollTop, mCont.scrollLeft, e);
        };
    }

    private onHorizondalScroll(mHdr: HTMLElement, mCont: HTMLElement, fCont: HTMLElement): Function {
        /* tslint:disable-next-line */
        let timeOutObj: any;
        return (e: Event) => {
            let left: number = mCont.scrollLeft;
            if (e.type === 'wheel' || e.type === 'touchmove') {
                clearTimeout(timeOutObj);
                /* tslint:disable */
                timeOutObj = setTimeout(() => {
                    left = e.type === 'touchmove' ? mCont.scrollLeft : left;
                    this.update(mHdr, mCont, mCont.scrollTop, left, e);
                }, 300);
            }
            if (this.previousValues.left === left) {
                fCont.scrollTop = mCont.scrollTop;
                return;
            }
            this.direction = 'horizondal';
            let excessMove: number = this.parent.scrollPosObject.horizontalSection > left ?
                -(this.parent.scrollPosObject.horizontalSection - left) : ((left + mHdr.offsetWidth) -
                    (this.parent.scrollPosObject.horizontalSection + (mCont.querySelector('.e-table') as HTMLElement).offsetWidth));
            if (this.parent.scrollPosObject.horizontalSection > left ? true : excessMove > 1) {
                //  showSpinner(this.parent.element);
                if (left > mHdr.clientWidth) {
                    if (this.parent.scrollPosObject.left < 1) {
                        this.parent.scrollPosObject.left = mHdr.clientWidth;
                    }
                    this.parent.scrollPosObject.left = this.parent.scrollPosObject.left - 50;
                    excessMove = this.parent.scrollPosObject.horizontalSection > left ?
                        (excessMove - this.parent.scrollPosObject.left) : (excessMove + this.parent.scrollPosObject.left);
                } else {
                    excessMove = -this.parent.scrollPosObject.horizontalSection;
                }
                setStyleAttribute(mCont.querySelector('.e-table') as HTMLElement, {
                    transform:
                        'translate(' + (this.parent.scrollPosObject.horizontalSection + excessMove) + 'px,' +
                        this.parent.scrollPosObject.verticalSection + 'px)'
                });
                setStyleAttribute(mHdr.querySelector('.e-table') as HTMLElement, {
                    transform:
                        'translate(' + (this.parent.scrollPosObject.horizontalSection + excessMove) + 'px,' + 0 + 'px)'
                });
                this.parent.scrollPosObject.horizontalSection = this.parent.scrollPosObject.horizontalSection + excessMove;
            }
            this.previousValues.left = left;
            mHdr.scrollLeft = mCont.scrollLeft;
        }
    }

    private onVerticalScroll(fCont: HTMLElement, mCont: HTMLElement): Function {
        /* tslint:disable-next-line */
        let timeOutObj: any;
        return (e: Event) => {
            let top: number = mCont.scrollTop;
            if (e.type === 'wheel' || e.type === 'touchmove') {
                clearTimeout(timeOutObj);
                /* tslint:disable */
                timeOutObj = setTimeout(() => {
                    this.update(null, mCont, mCont.scrollTop, mCont.scrollLeft, e);
                }, 300);
            }
            if (this.previousValues.top === top) {
                return;
            }
            this.direction = 'vertical';
            let excessMove: number = this.parent.scrollPosObject.verticalSection > top ?
                -(this.parent.scrollPosObject.verticalSection - top) : ((top + fCont.clientHeight) -
                    (this.parent.scrollPosObject.verticalSection + (fCont.querySelector('.e-table') as HTMLElement).offsetHeight));
            if (this.parent.scrollPosObject.verticalSection > top ? true : excessMove > 1) {
                //  showSpinner(this.parent.element);
                if (top > fCont.clientHeight) {
                    if (this.parent.scrollPosObject.top < 1) {
                        this.parent.scrollPosObject.top = fCont.clientHeight;
                    }
                    this.parent.scrollPosObject.top = this.parent.scrollPosObject.top - 50;
                    excessMove = this.parent.scrollPosObject.verticalSection > top ?
                        (excessMove - this.parent.scrollPosObject.top) : (excessMove + this.parent.scrollPosObject.top);
                } else {
                    excessMove = -this.parent.scrollPosObject.verticalSection;
                }
                setStyleAttribute(fCont.querySelector('.e-table') as HTMLElement, {
                    transform:
                        'translate(' + 0 + 'px,' + (this.parent.scrollPosObject.verticalSection + excessMove) + 'px)'
                });
                setStyleAttribute(mCont.querySelector('.e-table') as HTMLElement, {
                    transform:
                        'translate(' + this.parent.scrollPosObject.horizontalSection + 'px,' +
                        (this.parent.scrollPosObject.verticalSection + excessMove) + 'px)'
                });
                this.parent.scrollPosObject.verticalSection = this.parent.scrollPosObject.verticalSection + excessMove;
            }
            this.previousValues.top = top;
            fCont.scrollTop = mCont.scrollTop;
            mCont.scrollTop = fCont.scrollTop;
        };
    }

    /**
     * @hidden
     */
    public removeInternalEvents(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(contentReady, this.wireEvents);
    }

    /**
     * To destroy the virtualscrolling event listener
     * @return {void}
     * @hidden
     */

    public destroy(): void {
        this.removeInternalEvents();
    }
}