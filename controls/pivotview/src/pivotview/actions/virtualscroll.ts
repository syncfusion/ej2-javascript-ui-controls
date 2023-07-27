import { EventHandler, setStyleAttribute, KeyboardEvents, KeyboardEventArgs, Browser } from '@syncfusion/ej2-base';
import { PivotView } from '../base/pivotview';
import { contentReady } from '../../common/base/constant';
import * as cls from '../../common/base/css-constant';
import { PivotEngine, OlapEngine, IDataOptions } from '../../base';
import { EnginePopulatedEventArgs, EnginePopulatingEventArgs } from '../../common/base/interface';
import { PivotUtil } from '../../base/util';
import * as events from '../../common/base/constant';

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
    private isFireFox: boolean = Browser.userAgent.toLowerCase().indexOf('firefox') > -1;
    /** @hidden */
    public direction: string;
    private keyboardEvents: KeyboardEvents;

    /**
     * Constructor for PivotView scrolling.
     *
     * @param {PivotView} parent - Instance of pivot table.
     * @hidden
     */
    constructor(parent?: PivotView) {
        this.parent = parent;
        this.addInternalEvents();
    }

    /**
     * It returns the Module name.
     *
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
        this.engineModule = this.parent.dataType === 'pivot' ? this.parent.engineModule : this.parent.olapEngineModule;
        if (this.parent.displayOption.view !== 'Chart'&& !this.parent.isVirtualScrollEventsAdded) {
            const mCont: HTMLElement = this.parent.element.querySelector('.' + cls.MOVABLECONTENT_DIV) as HTMLElement;
            const fCont: HTMLElement = this.parent.element.querySelector('.' + cls.FROZENCONTENT_DIV) as HTMLElement;
            const mHdr: HTMLElement = this.parent.element.querySelector('.' + cls.MOVABLEHEADER_DIV) as HTMLElement;
            const mScrollBar: HTMLElement = mCont.parentElement.parentElement.querySelector('.' + cls.MOVABLESCROLL_DIV);
            if (this.parent.mScrollBarEvents.length === 0) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                this.parent.mScrollBarEvents = [...(mScrollBar as any)['__eventList']['events']];
            }
            EventHandler.clearEvents(mCont);
            EventHandler.clearEvents(fCont);
            if (this.isFireFox) {
                EventHandler.clearEvents(mHdr);
            }
            if (this.engineModule) {
                const ele: HTMLElement = this.parent.isAdaptive ? mCont : mCont.parentElement.parentElement.querySelector('.' + cls.MOVABLESCROLL_DIV);
                EventHandler.add(ele, 'scroll touchmove pointermove', this.onHorizondalScroll(mHdr, mCont, fCont), this);
                EventHandler.add(mCont.parentElement, 'scroll wheel touchmove pointermove keyup keydown', this.onVerticalScroll(fCont, mCont), this);
                if (this.isFireFox) {
                    EventHandler.add(mCont, 'mouseup touchend scroll', this.common(mHdr, mCont, fCont), this);
                } else {
                    EventHandler.add(mCont.parentElement.parentElement, 'mouseup touchend', this.common(mHdr, mCont, fCont), this);
                }
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.parent.grid.on('check-scroll-reset', (args: any) => {
                args.cancel = true;
            });
            this.parent.grid.on('prevent-frozen-scroll-refresh', function (args: any) { /* eslint-disable-line */
                args.cancel = true;
            });
            this.parent.grid.isPreventScrollEvent = true;
            this.parent.isVirtualScrollEventsAdded = true;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private onWheelScroll(mCont: HTMLElement, fCont: HTMLElement): Function {
        const element: HTMLElement = mCont;
        return (e: WheelEvent) => {
            const top: number = element.parentElement.scrollTop + (e.deltaMode === 1 ? e.deltaY * 30 : e.deltaY);
            if (this.frozenPreviousValues.top === top) {
                return;
            }
            e.preventDefault();
            this.frozenPreviousValues.top = top;
            this.eventType = e.type;
        };
    }

    private getPointXY(e: PointerEvent | TouchEvent): { x: number; y: number } {
        const pageXY: { x: number; y: number } = { x: 0, y: 0 };
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
        const content: HTMLElement = mCont;
        const header: HTMLElement = mHdr;
        return (e: Event) => {
            const eContent: HTMLElement = (this.parent.element.querySelector('.' + cls.MOVABLECONTENT_DIV) as HTMLElement).parentElement;
            if (eContent.querySelector('tbody') === null) {
                return;
            }
            const target: HTMLElement = <HTMLElement>e.target;
            const left: number = target.scrollLeft;
            if (this.previousValues.left === left || (this.isFireFox && target.classList.contains(cls.MOVABLEHEADER_DIV))) {
                return;
            }
            content.scrollLeft = left;
            header.scrollLeft = left;
            this.previousValues.left = left;
            if (this.parent.isDestroyed) { return; }
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private onTouchScroll(mHdr: HTMLElement, mCont: HTMLElement, fCont: HTMLElement): Function {
        const element: HTMLElement = mCont;
        return (e: PointerEvent | TouchEvent) => {
            if ((e as PointerEvent).pointerType === 'mouse') {
                return;
            }
            const pageXY: { x: number; y: number } = this.getPointXY(e);
            const top: number = element.parentElement.scrollTop + (this.pageXY.y - pageXY.y);
            const ele: HTMLElement = this.parent.isAdaptive ? mCont : element.parentElement.parentElement.querySelector('.' + cls.MOVABLESCROLL_DIV);
            const left: number = ele.scrollLeft + (this.pageXY.x - pageXY.x);
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private update(mHdr: HTMLElement, mCont: HTMLElement, top: number, left: number, e: Event): void {
        this.parent.isScrolling = true;
        const engine: PivotEngine | OlapEngine = this.parent.dataType === 'pivot' ? this.parent.engineModule : this.parent.olapEngineModule;
        const args: EnginePopulatingEventArgs = {
            dataSourceSettings: PivotUtil.getClonedDataSourceSettings(this.parent.dataSourceSettings)
        };
        if (this.parent.pageSettings && engine.pageSettings) {
            if (this.direction === 'vertical') {
                const rowValues: number = this.parent.dataType === 'pivot' ?
                    (this.parent.dataSourceSettings.valueAxis === 'row' ? this.parent.dataSourceSettings.values.length : 1) : 1;
                const exactSize: number = (this.parent.pageSettings.rowPageSize * rowValues * this.parent.gridSettings.rowHeight);
                const section: number = Math.ceil(top / exactSize);
                if ((this.parent.scrollPosObject.vertical === section ||
                    engine.pageSettings.rowPageSize >= engine.rowCount)) {
                    // this.parent.hideWaitingPopup();
                    return;
                }
                this.parent.actionObj.actionName = events.verticalScroll;
                this.parent.actionBeginMethod();
                this.parent.showWaitingPopup();
                this.parent.scrollPosObject.vertical = section;
                this.parent.pageSettings.currentRowPage = engine.pageSettings.currentRowPage = section > 1 ? section : 1;
                let rowStartPos: number = 0;
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this.parent.trigger(events.enginePopulating, args, (observedArgs: EnginePopulatingEventArgs) => {
                    if (this.parent.dataType === 'pivot') {
                        if (this.parent.dataSourceSettings.mode === 'Server') {
                            this.parent.getEngine('onScroll', null, null, null, null, null, null);
                        } else {
                            this.parent.engineModule.generateGridData(
                                this.parent.dataSourceSettings, true, this.parent.engineModule.headerCollection);
                            rowStartPos = this.parent.engineModule.rowStartPos;
                        }
                    } else {
                        this.parent.olapEngineModule.scrollPage();
                        rowStartPos = this.parent.olapEngineModule.pageRowStartPos;
                    }
                    this.enginePopulatedEventMethod(engine);
                });
                const exactPage: number = Math.ceil(rowStartPos / (this.parent.pageSettings.rowPageSize * rowValues));
                const pos: number = exactSize * exactPage -
                    (engine.rowFirstLvl * rowValues * this.parent.gridSettings.rowHeight);
                this.parent.scrollPosObject.verticalSection = pos;
            } else {
                const colValues: number =
                    this.parent.dataType === 'pivot' ?
                        (this.parent.dataSourceSettings.valueAxis === 'column' ? this.parent.dataSourceSettings.values.length : 1) : 1;
                const exactSize: number = (this.parent.pageSettings.columnPageSize *
                    colValues * this.parent.gridSettings.columnWidth);
                const section: number = Math.ceil(left / exactSize);
                if (this.parent.scrollPosObject.horizontal === section) {
                    // this.parent.hideWaitingPopup();
                    return;
                }
                this.parent.actionObj.actionName = events.horizontalScroll;
                this.parent.actionBeginMethod();
                this.parent.showWaitingPopup();
                const pivot: PivotView = this.parent;
                pivot.scrollPosObject.horizontal = section;
                this.parent.pageSettings.currentColumnPage = engine.pageSettings.currentColumnPage = section > 1 ? section : 1;
                let colStartPos: number = 0;
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this.parent.trigger(events.enginePopulating, args, (observedArgs: EnginePopulatingEventArgs) => {
                    if (pivot.dataType === 'pivot') {
                        if (this.parent.dataSourceSettings.mode === 'Server') {
                            this.parent.getEngine('onScroll', null, null, null, null, null, null);
                        } else {
                            pivot.engineModule.generateGridData(pivot.dataSourceSettings, true, pivot.engineModule.headerCollection);
                            colStartPos = pivot.engineModule.colStartPos;
                        }
                    } else {
                        pivot.olapEngineModule.scrollPage();
                        colStartPos = pivot.olapEngineModule.pageColStartPos;
                    }
                    this.enginePopulatedEventMethod(engine);
                });
                const exactPage: number = Math.ceil(colStartPos / (pivot.pageSettings.columnPageSize * colValues));
                const pos: number = exactSize * exactPage - (engine.colFirstLvl *
                    colValues * pivot.gridSettings.columnWidth);
                pivot.scrollPosObject.horizontalSection = pos;
            }
            this.parent.actionObj.actionName = this.parent.getActionCompleteName();
            if (this.parent.actionObj.actionName) {
                this.parent.actionCompleteMethod();
            }
        }
    }
    private enginePopulatedEventMethod(engine: PivotEngine | OlapEngine, control?: PivotView): void {
        const pivot: PivotView = control ? control : this.parent;
        const eventArgs: EnginePopulatedEventArgs = {
            dataSourceSettings: pivot.dataSourceSettings as IDataOptions,
            pivotValues: engine.pivotValues
        };
        pivot.trigger(events.enginePopulated, eventArgs, (observedArgs: EnginePopulatedEventArgs) => {
            this.parent.pivotValues = observedArgs.pivotValues;
        });
    }

    private setPageXY(): Function {
        return (e: PointerEvent | TouchEvent) => {
            if ((e as PointerEvent).pointerType === 'mouse') {
                return;
            }
            this.pageXY = this.getPointXY(e);
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private common(mHdr: HTMLElement, mCont: HTMLElement, fCont: HTMLElement): Function {
        return (e: Event) => {
            const ele: HTMLElement = this.parent.isAdaptive ? mCont : mCont.parentElement.parentElement.querySelector('.' + cls.MOVABLESCROLL_DIV);
            this.update(
                mHdr, mCont, mCont.parentElement.scrollTop * this.parent.verticalScrollScale,
                ele.scrollLeft * this.parent.horizontalScrollScale, e);
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private onHorizondalScroll(mHdr: HTMLElement, mCont: HTMLElement, fCont: HTMLElement): Function {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let timeOutObj: any;
        return (e: Event) => {
            const ele: HTMLElement = this.parent.isAdaptive ? mCont : mCont.parentElement.parentElement.querySelector('.' + cls.MOVABLESCROLL_DIV);
            let left: number = ele.scrollLeft * this.parent.horizontalScrollScale;
            if (e.type === 'wheel' || e.type === 'touchmove' || this.eventType === 'wheel' || this.eventType === 'touchmove') {
                clearTimeout(timeOutObj);
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
            const vertiOffset: string = (mCont.querySelector('.' + cls.TABLE) as HTMLElement).style.transform.split(',').length > 1 ?
                (mCont.querySelector('.' + cls.TABLE) as HTMLElement).style.transform.split(',')[1].trim() : '0px)';
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
            const notLastPage: boolean = Math.ceil(this.parent.scrollPosObject.horizontalSection / this.parent.horizontalScrollScale) <
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
            const hScrollPos: number = (ele.scrollWidth - (ele.scrollLeft + ele.offsetWidth));
            if (hScrollPos <= 0) {
                const virtualDiv: HTMLElement = mCont.querySelector('.' + cls.VIRTUALTRACK_DIV);
                virtualDiv.style.display = 'none';
                const mCntScrollPos: number = (mCont.scrollWidth - (mCont.scrollLeft + mCont.offsetWidth));
                virtualDiv.style.display = '';
                const mCntVScrollPos: number = (mCont.scrollWidth - (mCont.scrollLeft + mCont.offsetWidth));
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
        };
    }

    private onVerticalScroll(fCont: HTMLElement, mCont: HTMLElement): Function {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let timeOutObj: any;
        return (e: Event | KeyboardEventArgs) => {
            const top: number = mCont.parentElement.scrollTop * this.parent.verticalScrollScale;
            if (e.type === 'wheel' || e.type === 'touchmove' || this.eventType === 'wheel' || this.eventType === 'touchmove' || e.type === 'keyup' || e.type === 'keydown') {
                const ele: HTMLElement = this.parent.isAdaptive ? mCont : mCont.parentElement.parentElement.querySelector('.' + cls.MOVABLESCROLL_DIV);
                clearTimeout(timeOutObj);
                timeOutObj = setTimeout(() => {
                    this.update(null, mCont, mCont.parentElement.scrollTop * this.parent.verticalScrollScale,
                                ele.scrollLeft * this.parent.horizontalScrollScale, e);
                }, 300);
            }
            if (this.previousValues.top === top) {
                return;
            }
            this.parent.scrollDirection = this.direction = 'vertical';
            let vertiOffset: number = -((top - this.parent.scrollPosObject.verticalSection - mCont.parentElement.scrollTop));
            const horiOffset: string = (mCont.querySelector('.' + cls.TABLE) as HTMLElement).style.transform.split(',')[0].trim();
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
            const notLastPage: boolean = Math.ceil(this.parent.scrollPosObject.verticalSection / this.parent.verticalScrollScale) <
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
                const movableTable: HTMLElement =
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
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        this.removeInternalEvents();
    }
}
