import { EventHandler, setStyleAttribute, isBlazor, KeyboardEvents, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { PivotView } from '../base/pivotview';
import { contentReady } from '../../common/base/constant';
import * as cls from '../../common/base/css-constant';
import { PivotEngine, OlapEngine } from '../../base';

/**
 * `VirtualScroll` module is used to handle scrolling behavior.
 */
export class VirtualScroll {
    private parent: PivotView;
    private previousValues: { top: number; left: number } = { top: 0, left: 0 };
    private frozenPreviousValues: { top: number; left: number } = { top: 0, left: 0 };
    private pageXY: { x: number; y: number };
    private eventType: string = '';
    private engineModule: PivotEngine | OlapEngine;
    /** @hidden */
    public direction: string;
    private keyboardEvents: KeyboardEvents;

    /**
     * Constructor for PivotView scrolling.
     * @param {PivotView} parent - Instance of pivot table.
     * @hidden
     */
    constructor(parent?: PivotView) {   /* eslint-disable-line */
        this.parent = parent;
        this.engineModule = this.parent.dataType === 'pivot' ? this.parent.engineModule : this.parent.olapEngineModule;
        this.addInternalEvents();
    }

    /**
     * It returns the Module name.
     * @returns {string} - string.
     * @hidden
     */
    public getModuleName(): string {
        return 'virtualscroll';
    }

    private addInternalEvents(): void {
        this.parent.on(contentReady, this.wireEvents, this);
    }

    private wireEvents(): void {
        if (this.parent.displayOption.view !== 'Chart') {
            let mCont: HTMLElement = this.parent.element.querySelector('.' + cls.MOVABLECONTENT_DIV) as HTMLElement;
            let fCont: HTMLElement = this.parent.element.querySelector('.' + cls.FROZENCONTENT_DIV) as HTMLElement;
            let mHdr: HTMLElement = this.parent.element.querySelector('.' + cls.MOVABLEHEADER_DIV) as HTMLElement;
            let mScrollBar: HTMLElement = mCont.parentElement.parentElement.querySelector('.' + cls.MOVABLESCROLL_DIV);
            EventHandler.clearEvents(mCont);
            EventHandler.clearEvents(fCont);
            if (this.engineModule) {
                let ele: HTMLElement = this.parent.isAdaptive ? mCont : mCont.parentElement.parentElement.querySelector('.' + cls.MOVABLESCROLL_DIV);
                EventHandler.add(ele, 'scroll touchmove pointermove', this.onHorizondalScroll(mHdr, mCont, fCont), this);
                EventHandler.add(mCont.parentElement, 'scroll wheel touchmove pointermove keyup keydown', this.onVerticalScroll(fCont, mCont), this);
                EventHandler.add(mCont.parentElement.parentElement, 'mouseup touchend', this.common(mHdr, mCont, fCont), this);
                EventHandler.add(mScrollBar, 'scroll', this.onCustomScrollbarScroll(mCont, mHdr), this);
                EventHandler.add(mCont, 'scroll', this.onCustomScrollbarScroll(mScrollBar, mHdr), this);
                EventHandler.add(mHdr, 'scroll', this.onCustomScrollbarScroll(mScrollBar, mCont), this);
                // EventHandler.add(fCont.parentElement, 'wheel', this.onWheelScroll(mCont, fCont), this);
                // EventHandler.add(fCont.parentElement, 'touchstart pointerdown', this.setPageXY(), this);
                // EventHandler.add(fCont.parentElement, 'touchmove pointermove', this.onTouchScroll(mHdr, mCont, fCont), this);
                EventHandler.add(mHdr, 'touchstart pointerdown', this.setPageXY(), this);
                EventHandler.add(mHdr, 'touchmove pointermove', this.onTouchScroll(mHdr, mCont, fCont), this);
                EventHandler.add(mCont, 'touchstart pointerdown', this.setPageXY(), this);
                EventHandler.add(mCont, 'touchmove pointermove', this.onTouchScroll(mHdr, mCont, fCont), this);
            }
            this.parent.grid.on('check-scroll-reset', (args: any) => {  /* eslint-disable-line */
                args.cancel = true;
            });
            this.parent.grid.on('prevent-frozen-scroll-refresh', function (args: any) { /* eslint-disable-line */
                args.cancel = true;
            });
            this.parent.grid.isPreventScrollEvent = true;
        }
    }
    private onWheelScroll(mCont: HTMLElement, fCont: HTMLElement): Function {   /* eslint-disable-line */
        let element: HTMLElement = mCont;
        return (e: WheelEvent) => {
            let top: number = element.parentElement.scrollTop + (e.deltaMode === 1 ? e.deltaY * 30 : e.deltaY);
            if (this.frozenPreviousValues.top === top) {
                return;
            }
            e.preventDefault();
            this.frozenPreviousValues.top = top;
            this.eventType = e.type;
        };
    }

    private getPointXY(e: PointerEvent | TouchEvent): { x: number; y: number } {
        let pageXY: { x: number; y: number } = { x: 0, y: 0 };
        if (!((e as TouchEvent).touches && (e as TouchEvent).touches.length)) {
            pageXY.x = (e as PointerEvent).pageX;
            pageXY.y = (e as PointerEvent).pageY;
        } else {
            pageXY.x = (e as TouchEvent).touches[0].pageX;
            pageXY.y = (e as TouchEvent).touches[0].pageY;
        }
        return pageXY;
    }

    private onCustomScrollbarScroll(mCont: HTMLElement, mHdr: HTMLElement): Function {
        let content: HTMLElement = mCont;
        let header: HTMLElement = mHdr;
        return (e: Event) => {
            let eContent: HTMLElement = (this.parent.element.querySelector('.' + cls.MOVABLECONTENT_DIV) as HTMLElement).parentElement;
            if (eContent.querySelector('tbody') === null) {
                return;
            }
            let target: HTMLElement = <HTMLElement>e.target;
            let left: number = target.scrollLeft;
            if (this.previousValues.left === left) {
                return;
            }
            content.scrollLeft = left;
            header.scrollLeft = left;
            this.previousValues.left = left;
            if (this.parent.isDestroyed) { return; }
        };
    }


    private onTouchScroll(mHdr: HTMLElement, mCont: HTMLElement, fCont: HTMLElement): Function {    /* eslint-disable-line */
        let element: HTMLElement = mCont;
        return (e: PointerEvent | TouchEvent) => {
            if ((e as PointerEvent).pointerType === 'mouse') {
                return;
            }
            let pageXY: { x: number; y: number } = this.getPointXY(e);
            let top: number = element.parentElement.scrollTop + (this.pageXY.y - pageXY.y);
            let ele: HTMLElement = this.parent.isAdaptive ? mCont : element.parentElement.parentElement.querySelector('.' + cls.MOVABLESCROLL_DIV);
            let left: number = ele.scrollLeft + (this.pageXY.x - pageXY.x);
            if (this.frozenPreviousValues.left === left || left < 0) {
                return;
            }
            mHdr.scrollLeft = left;
            ele.scrollLeft = left;
            this.pageXY.x = pageXY.x;
            this.frozenPreviousValues.left = left;
            if (this.frozenPreviousValues.top === top || top < 0) {
                return;
            }
            this.pageXY.y = pageXY.y;
            this.frozenPreviousValues.top = top;
            this.eventType = e.type;
        };
    }

    private update(mHdr: HTMLElement, mCont: HTMLElement, top: number, left: number, e: Event): void {  /* eslint-disable-line */
        this.parent.isScrolling = true;
        let engine: PivotEngine | OlapEngine = this.parent.dataType === 'pivot' ? this.parent.engineModule : this.parent.olapEngineModule;
        if (isBlazor() || this.parent.dataSourceSettings.mode === 'Server') {
            engine.pageSettings = this.parent.pageSettings;
        }
        if (this.parent.pageSettings && engine.pageSettings) {
            if (this.direction === 'vertical') {
                let rowValues: number = this.parent.dataType === 'pivot' ?
                    (this.parent.dataSourceSettings.valueAxis === 'row' ? this.parent.dataSourceSettings.values.length : 1) : 1;
                let exactSize: number = (this.parent.pageSettings.rowSize * rowValues * this.parent.gridSettings.rowHeight);
                let section: number = Math.ceil(top / exactSize);
                if ((this.parent.scrollPosObject.vertical === section ||
                    engine.pageSettings.rowSize >= engine.rowCount)) {
                    // this.parent.hideWaitingPopup();
                    return;
                }
                this.parent.showWaitingPopup();
                this.parent.scrollPosObject.vertical = section;
                engine.pageSettings.rowCurrentPage = section > 1 ? section : 1;
                let rowStartPos: number = 0;
                if (this.parent.dataType === 'pivot') {
                    if (isBlazor()) {
                        let pivot: PivotView = this.parent;
                        let sfBlazor: string = 'sfBlazor';
                        /* eslint-disable-next-line */
                        let dataSourceSettings: any = (window as any)[sfBlazor].
                            copyWithoutCircularReferences([pivot.dataSourceSettings], pivot.dataSourceSettings);
                        /* eslint-disable-next-line */
                        let pageSettings: any = (window as any)[sfBlazor].
                            copyWithoutCircularReferences([engine.pageSettings], engine.pageSettings);
                        /* eslint-disable-next-line */
                        (pivot as any).interopAdaptor.invokeMethodAsync(
                            'PivotInteropMethod', 'generateGridData', {
                            'dataSourceSettings': dataSourceSettings,
                            'pageSettings': pageSettings, 'isScrolling': true
                        }).then(
                            /* eslint-disable-next-line */
                            (data: any) => {
                                pivot.updateBlazorData(data, pivot);
                                pivot.pivotValues = engine.pivotValues;
                                rowStartPos = this.parent.engineModule.rowStartPos;
                                let exactPage: number = Math.ceil(rowStartPos / (pivot.pageSettings.rowSize * rowValues));
                                let pos: number = exactSize * exactPage -
                                    (engine.rowFirstLvl * rowValues * pivot.gridSettings.rowHeight);
                                pivot.scrollPosObject.verticalSection = pos;
                            });
                    } else if (this.parent.dataSourceSettings.mode === 'Server') {
                        this.parent.getEngine('onScroll', null, null, null, null, null, null);
                    } else {
                        this.parent.engineModule.generateGridData(
                            this.parent.dataSourceSettings, this.parent.engineModule.headerCollection);
                        rowStartPos = this.parent.engineModule.rowStartPos;
                    }
                } else {
                    this.parent.olapEngineModule.scrollPage('scroll');
                    rowStartPos = this.parent.olapEngineModule.pageRowStartPos;
                }
                if (!(isBlazor() && this.parent.dataType === 'pivot')) {
                    this.parent.pivotValues = engine.pivotValues;
                    let exactPage: number = Math.ceil(rowStartPos / (this.parent.pageSettings.rowSize * rowValues));
                    let pos: number = exactSize * exactPage -
                        (engine.rowFirstLvl * rowValues * this.parent.gridSettings.rowHeight);
                    this.parent.scrollPosObject.verticalSection = pos;
                }
            } else {
                let colValues: number =
                    this.parent.dataType === 'pivot' ?
                        (this.parent.dataSourceSettings.valueAxis === 'column' ? this.parent.dataSourceSettings.values.length : 1) : 1;
                let exactSize: number = (this.parent.pageSettings.columnSize *
                    colValues * this.parent.gridSettings.columnWidth);
                let section: number = Math.ceil(left / exactSize);
                if (this.parent.scrollPosObject.horizontal === section) {
                    // this.parent.hideWaitingPopup();
                    return;
                }
                this.parent.showWaitingPopup();
                let pivot: PivotView = this.parent;
                pivot.scrollPosObject.horizontal = section;
                engine.pageSettings.columnCurrentPage = section > 1 ? section : 1;
                let colStartPos: number = 0;
                if (pivot.dataType === 'pivot') {
                    if (isBlazor()) {
                        let sfBlazor: string = 'sfBlazor';
                        let pivot: PivotView = this.parent;
                        /* eslint-disable-next-line */
                        let pageSettings: any = (window as any)[sfBlazor].
                            copyWithoutCircularReferences([engine.pageSettings], engine.pageSettings);
                        /* eslint-disable-next-line */
                        let dataSourceSettings: any = (window as any)[sfBlazor].
                            copyWithoutCircularReferences([pivot.dataSourceSettings], pivot.dataSourceSettings);
                        /* eslint-disable-next-line */
                        (pivot as any).interopAdaptor.invokeMethodAsync(
                            'PivotInteropMethod', 'generateGridData', {
                            'dataSourceSettings': dataSourceSettings,
                            'pageSettings': pageSettings, 'isScrolling': true
                        }).then(
                            /* eslint-disable-next-line */
                            (data: any) => {
                                pivot.updateBlazorData(data, pivot);
                                colStartPos = pivot.engineModule.colStartPos;
                                pivot.pivotValues = engine.pivotValues;
                                let exactPage: number = Math.ceil(colStartPos / (pivot.pageSettings.columnSize * colValues));
                                let pos: number = exactSize * exactPage - (engine.colFirstLvl *
                                    colValues * pivot.gridSettings.columnWidth);
                                pivot.scrollPosObject.horizontalSection = pos;
                            });
                    } else if (this.parent.dataSourceSettings.mode === 'Server') {
                        this.parent.getEngine('onScroll', null, null, null, null, null, null);
                    } else {
                        pivot.engineModule.generateGridData(pivot.dataSourceSettings, pivot.engineModule.headerCollection);
                        colStartPos = pivot.engineModule.colStartPos;
                    }
                } else {
                    pivot.olapEngineModule.scrollPage('scroll');
                    colStartPos = pivot.olapEngineModule.pageColStartPos;
                }
                if (!(isBlazor() && pivot.dataType === 'pivot')) {
                    pivot.pivotValues = engine.pivotValues;
                    let exactPage: number = Math.ceil(colStartPos / (pivot.pageSettings.columnSize * colValues));
                    let pos: number = exactSize * exactPage - (engine.colFirstLvl *
                        colValues * pivot.gridSettings.columnWidth);
                    pivot.scrollPosObject.horizontalSection = pos;
                }
            }
        }
    }

    private setPageXY(): Function { /* eslint-disable-line */
        return (e: PointerEvent | TouchEvent) => {
            if ((e as PointerEvent).pointerType === 'mouse') {
                return;
            }
            this.pageXY = this.getPointXY(e);
        };
    }

    private common(mHdr: HTMLElement, mCont: HTMLElement, fCont: HTMLElement): Function {   /* eslint-disable-line */
        return (e: Event) => {
            let ele: HTMLElement = this.parent.isAdaptive ? mCont : mCont.parentElement.parentElement.querySelector('.' + cls.MOVABLESCROLL_DIV);
            this.update(
                mHdr, mCont, mCont.parentElement.scrollTop * this.parent.verticalScrollScale,
                ele.scrollLeft * this.parent.horizontalScrollScale, e);
        };
    }

    private onHorizondalScroll(mHdr: HTMLElement, mCont: HTMLElement, fCont: HTMLElement): Function {   /* eslint-disable-line */
        /* eslint-disable-next-line */
        let timeOutObj: any;
        return (e: Event) => {
            let ele: HTMLElement = this.parent.isAdaptive ? mCont : mCont.parentElement.parentElement.querySelector('.' + cls.MOVABLESCROLL_DIV);
            let left: number = ele.scrollLeft * this.parent.horizontalScrollScale;
            if (e.type === 'wheel' || e.type === 'touchmove' || this.eventType === 'wheel' || this.eventType === 'touchmove') {
                clearTimeout(timeOutObj);
                /* eslint-disable */
                timeOutObj = setTimeout(() => {
                    left = e.type === 'touchmove' ? ele.scrollLeft : left;
                    this.update(mHdr, mCont, mCont.parentElement.scrollTop * this.parent.verticalScrollScale, left, e);
                }, 300);
            }
            if (this.previousValues.left === left) {
                return;
            }
            this.parent.scrollDirection = this.direction = 'horizondal';
            let horiOffset: number = -((left - this.parent.scrollPosObject.horizontalSection - ele.scrollLeft));
            let vertiOffset: string = (mCont.querySelector('.' + cls.TABLE) as HTMLElement).style.transform.split(',').length > 1 ?
                (mCont.querySelector('.' + cls.TABLE) as HTMLElement).style.transform.split(',')[1].trim() : "0px)";
            if (ele.scrollLeft < this.parent.scrollerBrowserLimit) {
                setStyleAttribute(mCont.querySelector('.e-table') as HTMLElement, {
                    transform: 'translate(' + horiOffset + 'px,' + vertiOffset
                });
                setStyleAttribute(mHdr.querySelector('.e-table') as HTMLElement, {
                    transform: 'translate(' + horiOffset + 'px,' + 0 + 'px)'
                });
            }
            let excessMove: number = this.parent.scrollPosObject.horizontalSection > left ?
                -(this.parent.scrollPosObject.horizontalSection - left) : ((left + mHdr.offsetWidth) -
                    (this.parent.scrollPosObject.horizontalSection + (mCont.querySelector('.e-table') as HTMLElement).offsetWidth));
            let notLastPage: boolean = Math.ceil(this.parent.scrollPosObject.horizontalSection / this.parent.horizontalScrollScale) <
                this.parent.scrollerBrowserLimit;
            if (this.parent.scrollPosObject.horizontalSection > left ? true : (excessMove > 1 && notLastPage)) {
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
                horiOffset = -((left - (this.parent.scrollPosObject.horizontalSection + excessMove) - mCont.parentElement.parentElement.querySelector('.' + cls.MOVABLESCROLL_DIV).scrollLeft));
                let vWidth: number = (this.parent.gridSettings.columnWidth * this.engineModule.columnCount);
                if (vWidth > this.parent.scrollerBrowserLimit) {
                    this.parent.horizontalScrollScale = vWidth / this.parent.scrollerBrowserLimit;
                    vWidth = this.parent.scrollerBrowserLimit;
                }
                if (horiOffset > vWidth && horiOffset > left) {
                    horiOffset = left;
                    excessMove = 0;
                }
                setStyleAttribute(mCont.querySelector('.e-table') as HTMLElement, {
                    transform: 'translate(' + horiOffset + 'px,' + vertiOffset
                });
                setStyleAttribute(mHdr.querySelector('.e-table') as HTMLElement, {
                    transform: 'translate(' + horiOffset + 'px,' + 0 + 'px)'
                });
                this.parent.scrollPosObject.horizontalSection = this.parent.scrollPosObject.horizontalSection + excessMove;
            }
            let hScrollPos: number = (ele.scrollWidth - (ele.scrollLeft + ele.offsetWidth));
            if (hScrollPos <= 0) {
                let virtualDiv: HTMLElement = mCont.querySelector('.' + cls.VIRTUALTRACK_DIV);
                virtualDiv.style.display = 'none';
                let mCntScrollPos: number = (mCont.scrollWidth - (mCont.scrollLeft + mCont.offsetWidth));
                virtualDiv.style.display = '';
                let mCntVScrollPos: number = (mCont.scrollWidth - (mCont.scrollLeft + mCont.offsetWidth));
                this.parent.scrollPosObject.horizontalSection -= mCntScrollPos > hScrollPos ? mCntScrollPos : -mCntVScrollPos;
                horiOffset = (ele.scrollLeft > this.parent.scrollerBrowserLimit) ?
                    Number((mCont.querySelector('.' + cls.TABLE) as HTMLElement).style.transform.split(',')[0].split('px')[0].trim()) :
                    -(((ele.scrollLeft * this.parent.horizontalScrollScale) -
                        this.parent.scrollPosObject.horizontalSection - ele.scrollLeft));
                setStyleAttribute(mCont.querySelector('.e-table') as HTMLElement, {
                    transform: 'translate(' + horiOffset + 'px,' + vertiOffset
                });
                setStyleAttribute(mHdr.querySelector('.e-table') as HTMLElement, {
                    transform: 'translate(' + horiOffset + 'px,' + 0 + 'px)'
                });
            }
            this.previousValues.left = left;
            this.frozenPreviousValues.left = left;
            this.eventType = '';
            mHdr.scrollLeft = ele.scrollLeft;
        }
    }

    private onVerticalScroll(fCont: HTMLElement, mCont: HTMLElement): Function {
        let timeOutObj: any;
        return (e: Event | KeyboardEventArgs) => {
            let top: number = mCont.parentElement.scrollTop * this.parent.verticalScrollScale;
            if (e.type === 'wheel' || e.type === 'touchmove' || this.eventType === 'wheel' || this.eventType === 'touchmove' || e.type === 'keyup' || e.type === 'keydown') {
                let ele: HTMLElement = this.parent.isAdaptive ? mCont : mCont.parentElement.parentElement.querySelector('.' + cls.MOVABLESCROLL_DIV);
                clearTimeout(timeOutObj);
                timeOutObj = setTimeout(() => {
                    this.update(null, mCont, mCont.parentElement.scrollTop * this.parent.verticalScrollScale,
                        ele.scrollLeft * this.parent.horizontalScrollScale, e);
                }, 300);
            }
            /* eslint-enable */
            if (this.previousValues.top === top) {
                return;
            }
            this.parent.scrollDirection = this.direction = 'vertical';
            let vertiOffset: number = -((top - this.parent.scrollPosObject.verticalSection - mCont.parentElement.scrollTop));
            let horiOffset: string = (mCont.querySelector('.' + cls.TABLE) as HTMLElement).style.transform.split(',')[0].trim();
            if (vertiOffset > this.parent.virtualDiv.clientHeight) {
                vertiOffset = this.parent.virtualDiv.clientHeight;
            }
            if (mCont.parentElement.scrollTop < this.parent.scrollerBrowserLimit) {
                setStyleAttribute(fCont.querySelector('.e-table') as HTMLElement, {
                    transform: 'translate(' + 0 + 'px,' + vertiOffset + 'px)'
                });
                setStyleAttribute(mCont.querySelector('.e-table') as HTMLElement, {
                    transform: horiOffset + ',' + vertiOffset + 'px)'
                });
            }
            let excessMove: number = this.parent.scrollPosObject.verticalSection > top ?
                -(this.parent.scrollPosObject.verticalSection - top) : ((top + fCont.parentElement.clientHeight) -
                    (this.parent.scrollPosObject.verticalSection + (fCont.querySelector('.e-table') as HTMLElement).offsetHeight));
            let notLastPage: boolean = Math.ceil(this.parent.scrollPosObject.verticalSection / this.parent.verticalScrollScale) <
                this.parent.scrollerBrowserLimit;
            if (this.parent.scrollPosObject.verticalSection > top ? true : (excessMove > 1 && notLastPage)) {
                //  showSpinner(this.parent.element);
                if (top > fCont.parentElement.clientHeight) {
                    if (this.parent.scrollPosObject.top < 1) {
                        this.parent.scrollPosObject.top = fCont.parentElement.clientHeight;
                    }
                    this.parent.scrollPosObject.top = this.parent.scrollPosObject.top - 50;
                    excessMove = this.parent.scrollPosObject.verticalSection > top ?
                        (excessMove - this.parent.scrollPosObject.top) : (excessMove + this.parent.scrollPosObject.top);
                } else {
                    excessMove = -this.parent.scrollPosObject.verticalSection;
                }
                let movableTable: HTMLElement =
                    this.parent.element.querySelector('.' + cls.MOVABLECONTENT_DIV).querySelector('.e-table') as HTMLElement;
                vertiOffset = -((top - (this.parent.scrollPosObject.verticalSection + excessMove) - mCont.parentElement.scrollTop));
                let vHeight: number = (this.parent.gridSettings.rowHeight * this.engineModule.rowCount + 0.1
                    - movableTable.clientHeight);
                if (vHeight > this.parent.scrollerBrowserLimit) {
                    this.parent.verticalScrollScale = vHeight / this.parent.scrollerBrowserLimit;
                    vHeight = this.parent.scrollerBrowserLimit;
                }
                if (vertiOffset > vHeight && vertiOffset > top) {
                    vertiOffset = top;
                    excessMove = 0;
                }
                if (vertiOffset > this.parent.virtualDiv.clientHeight) {
                    vertiOffset = this.parent.virtualDiv.clientHeight;
                }
                setStyleAttribute(fCont.querySelector('.e-table') as HTMLElement, {
                    transform: 'translate(' + 0 + 'px,' + vertiOffset + 'px)'
                });
                setStyleAttribute(mCont.querySelector('.e-table') as HTMLElement, {
                    transform: horiOffset + ',' + vertiOffset + 'px)'
                });
                this.parent.scrollPosObject.verticalSection = this.parent.scrollPosObject.verticalSection + excessMove;
            }
            this.previousValues.top = top;
            this.frozenPreviousValues.top = top;
            this.eventType = '';
        };
    }

    /* eslint-disable-next-line */
    /**
     * @hidden
     */
    public removeInternalEvents(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(contentReady, this.wireEvents);
    }

    /**
     * To destroy the virtualscrolling event listener
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        this.removeInternalEvents();
    }
}
