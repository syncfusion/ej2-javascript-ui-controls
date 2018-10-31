import { Browser, EventHandler } from '@syncfusion/ej2-base';
import { addClass, removeClass } from '@syncfusion/ej2-base';
import { formatUnit, isNullOrUndefined } from '@syncfusion/ej2-base';
import { IGrid, IAction, NotifyArgs } from '../base/interface';
import { getScrollBarWidth, getUpdateUsingRaf } from '../base/util';
import { scroll, contentReady, uiUpdate, onEmpty, headerRefreshed } from '../base/constant';
import { ColumnWidthService } from '../services/width-controller';
import { Grid } from '../base/grid';

/**
 * The `Scroll` module is used to handle scrolling behaviour.
 */
export class Scroll implements IAction {
    private parent: IGrid;
    private lastScrollTop: number = 0;
    //To maintain scroll state on grid actions.
    private previousValues: { top: number, left: number } = { top: 0, left: 0 };
    private oneTimeReady: boolean = true;
    private content: HTMLDivElement;
    private header: HTMLDivElement;
    private widthService: ColumnWidthService;
    private pageXY: { x: number, y: number };

    /**
     * Constructor for the Grid scrolling.
     * @hidden
     */
    constructor(parent?: IGrid) {
        this.parent = parent;
        this.widthService = new ColumnWidthService(parent);
        this.addEventListener();
    }

    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'scroll';
    }
    /**
     * @hidden
     */
    public setWidth(): void {
        this.parent.element.style.width = formatUnit(this.parent.width);
        if ((<Grid>this.parent).toolbarModule && (<Grid>this.parent).toolbarModule.toolbar &&
            (<Grid>this.parent).toolbarModule.toolbar.element) {
            (<Grid>this.parent).toolbarModule.toolbar.refreshOverflow();
        }
    }
    /**
     * @hidden
     */
    public setHeight(): void {
        let mHdrHeight: number = 0;
        let content: HTMLElement = (<HTMLElement>this.parent.getContent().firstChild);
        if (this.parent.frozenRows && this.parent.height !== 'auto') {
            mHdrHeight =
                (this.parent.getHeaderContent().querySelector('tbody') as HTMLElement).offsetHeight;
            content.style.height = formatUnit((this.parent.height as number) - mHdrHeight);
        } else {
            content.style.height = formatUnit(this.parent.height);
        }
        this.ensureOverflow(content);
    }
    /**
     * @hidden
     */
    public setPadding(): void {
        let content: HTMLElement = <HTMLElement>this.parent.getHeaderContent();
        let scrollWidth: number = Scroll.getScrollBarWidth() - this.getThreshold();

        let cssProps: ScrollCss = this.getCssProperties();
        (<HTMLElement>content.firstChild).style[cssProps.border] = scrollWidth > 0 ? '1px' : '0px';

        content.style[cssProps.padding] = scrollWidth > 0 ? scrollWidth + 'px' : '0px';
    }
    /**
     * @hidden
     */
    public removePadding(rtl?: boolean): void {
        let cssProps: ScrollCss = this.getCssProperties(rtl);
        (<HTMLDivElement>this.parent.getHeaderContent().firstChild).style[cssProps.border] = '';
        (<HTMLDivElement>this.parent.getHeaderContent().firstChild).parentElement.style[cssProps.padding] = '';
    }
    /**
     * Refresh makes the Grid adoptable with the height of parent container.
     *  
     * > The [`height`](./api-grid.html#height) must be set to 100%. 
     * @return
     */
    public refresh(): void {
        if (this.parent.height !== '100%') {
            return;
        }

        let content: HTMLElement = <HTMLElement>this.parent.getContent();
        this.parent.element.style.height = '100%';

        let height: number = this.widthService.getSiblingsHeight(content);
        content.style.height = 'calc(100% - ' + height + 'px)'; //Set the height to the '.e-gridcontent';
    }

    private getThreshold(): number {
        /* Some browsers places the scroller outside the content, 
         * hence the padding should be adjusted.*/
        let appName: string = Browser.info.name;
        if (appName === 'mozilla') {
            return 0.5;
        }
        return 1;
    }
    /**
     * @hidden
     */
    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(onEmpty, this.wireEvents, this);
        this.parent.on(contentReady, this.wireEvents, this);
        this.parent.on(uiUpdate, this.onPropertyChanged, this);
        this.parent.on(headerRefreshed, this.setScrollLeft, this);
    }
    /**
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(onEmpty, this.wireEvents);
        this.parent.off(contentReady, this.wireEvents);
        this.parent.off(uiUpdate, this.onPropertyChanged);
        this.parent.off(headerRefreshed, this.setScrollLeft);
    }

    private setScrollLeft(): void {
        if (this.parent.frozenColumns) {
            (<HTMLElement>(<Grid>this.parent).headerModule.getMovableHeader()).scrollLeft = this.previousValues.left;
        }
    }

    private onContentScroll(scrollTarget: HTMLElement): Function {
        let element: HTMLElement = scrollTarget;
        let isHeader: boolean = element.classList.contains('e-headercontent');
        return (e: Event) => {
            if (this.content.querySelector('tbody') === null || this.parent.isPreventScrollEvent) {
                return;
            }

            let target: HTMLElement = (<HTMLElement>e.target);
            let left: number = target.scrollLeft;
            let sLimit: number = target.scrollWidth;
            let isFooter: boolean = target.classList.contains('e-summarycontent');

            if (this.previousValues.left === left) {
                this.previousValues.top = !isHeader ? this.previousValues.top : target.scrollTop;
                return;
            }

            element.scrollLeft = left;
            if (isFooter) { this.header.scrollLeft = left; }
            this.previousValues.left = left;
            this.parent.notify(scroll, { left: left });
        };
    }

    private onFreezeContentScroll(scrollTarget: HTMLElement): Function {
        let element: HTMLElement = scrollTarget;
        return (e: Event) => {
            if (this.content.querySelector('tbody') === null) {
                return;
            }
            let target: HTMLElement = <HTMLElement>e.target;
            let top: number = target.scrollTop;
            if (this.previousValues.top === top) {
                return;
            }
            element.scrollTop = top;
            this.previousValues.top = top;
            if (this.parent.isDestroyed) { return; }
        };
    }

    private onWheelScroll(scrollTarget: HTMLElement): Function {
        let element: HTMLElement = scrollTarget;
        return (e: WheelEvent) => {
            if (this.content.querySelector('tbody') === null) {
                return;
            }
            let top: number = element.scrollTop + (e.deltaMode === 1 ? e.deltaY * 30 : e.deltaY);
            if (this.previousValues.top === top) {
                return;
            }
            e.preventDefault();
            this.parent.getContent().querySelector('.e-frozencontent').scrollTop = top;
            element.scrollTop = top;
            this.previousValues.top = top;
        };
    }

    private onTouchScroll(scrollTarget: HTMLElement): Function {
        let element: HTMLElement = scrollTarget;
        return (e: PointerEvent | TouchEvent) => {
            if ((e as PointerEvent).pointerType === 'mouse') {
                return;
            }
            let cont: Element;
            let mHdr: Element;
            let pageXY: { x: number, y: number } = this.getPointXY(e);
            let top: number = element.scrollTop + (this.pageXY.y - pageXY.y);
            let left: number = element.scrollLeft + (this.pageXY.x - pageXY.x);
            if (this.parent.getHeaderContent().contains(e.target as Element)) {
                mHdr = this.parent.getFrozenColumns() ?
                    this.parent.getHeaderContent().querySelector('.e-movableheader') : this.parent.getHeaderContent().firstChild as Element;
                if (this.previousValues.left === left || (left < 0 || (mHdr.scrollWidth - mHdr.clientWidth) < left)) {
                    return;
                }
                e.preventDefault();
                mHdr.scrollLeft = left;
                element.scrollLeft = left;
                this.pageXY.x = pageXY.x;
                this.previousValues.left = left;
            } else {
                cont = this.parent.getContent().querySelector('.e-frozencontent');
                if (this.previousValues.top === top || (top < 0 || (cont.scrollHeight - cont.clientHeight) < top)) {
                    return;
                }
                e.preventDefault();
                cont.scrollTop = top;
                element.scrollTop = top;
                this.pageXY.y = pageXY.y;
                this.previousValues.top = top;
            }
        };
    }

    private setPageXY(): Function {
        return (e: PointerEvent | TouchEvent) => {
            if ((e as PointerEvent).pointerType === 'mouse') {
                return;
            }
            this.pageXY = this.getPointXY(e);
        };
    }

    private getPointXY(e: PointerEvent | TouchEvent): { x: number, y: number } {
        let pageXY: { x: number, y: number } = { x: 0, y: 0 };
        if ((e as TouchEvent).touches && (e as TouchEvent).touches.length) {
            pageXY.x = (e as TouchEvent).touches[0].pageX;
            pageXY.y = (e as TouchEvent).touches[0].pageY;
        } else {
            pageXY.x = (e as PointerEvent).pageX;
            pageXY.y = (e as PointerEvent).pageY;
        }
        return pageXY;
    }

    private wireEvents(): void {
        if (this.oneTimeReady) {
            let frzCols: number = this.parent.getFrozenColumns();
            this.content = <HTMLDivElement>this.parent.getContent().firstChild;
            this.header = <HTMLDivElement>this.parent.getHeaderContent().firstChild;
            let mCont: HTMLElement = this.content.querySelector('.e-movablecontent') as HTMLElement;
            let fCont: HTMLElement = this.content.querySelector('.e-frozencontent') as HTMLElement;
            let mHdr: HTMLElement = this.header.querySelector('.e-movableheader') as HTMLElement;
            if (this.parent.frozenRows) {
                EventHandler.add(frzCols ? mHdr : this.header, 'touchstart pointerdown', this.setPageXY(), this);
                EventHandler.add(
                    frzCols ? mHdr : this.header, 'touchmove pointermove',
                    this.onTouchScroll(frzCols ? mCont : this.content), this);
            }
            if (frzCols) {
                EventHandler.add(mCont, 'scroll', this.onContentScroll(mHdr), this);
                EventHandler.add(mCont, 'scroll', this.onFreezeContentScroll(fCont), this);
                EventHandler.add(fCont, 'scroll', this.onFreezeContentScroll(mCont), this);
                EventHandler.add(mHdr, 'scroll', this.onContentScroll(mCont), this);
                EventHandler.add(fCont, 'wheel', this.onWheelScroll(mCont), this);
                EventHandler.add(fCont, 'touchstart pointerdown', this.setPageXY(), this);
                EventHandler.add(fCont, 'touchmove pointermove', this.onTouchScroll(mCont), this);
            } else {
                EventHandler.add(this.content, 'scroll', this.onContentScroll(this.header), this);
                EventHandler.add(this.header, 'scroll', this.onContentScroll(this.content), this);
            }
            if (this.parent.aggregates.length) {
                EventHandler.add(
                    <HTMLDivElement>this.parent.getFooterContent().firstChild, 'scroll', this.onContentScroll(this.content), this);
            }
            this.refresh();
            this.oneTimeReady = false;
        }
        let table: Element = this.parent.getContentTable();
        let sLeft: number;
        let sHeight: number;
        let clientHeight: number;
        getUpdateUsingRaf(
            () => {
                sLeft = this.header.scrollLeft;
                sHeight = table.scrollHeight;
                clientHeight = this.parent.getContent().clientHeight;
            },
            () => {
                if (!this.parent.enableVirtualization) {
                    if (sHeight < clientHeight) {
                        addClass(table.querySelectorAll('tr:last-child td'), 'e-lastrowcell');
                        if (this.parent.getFrozenColumns()) {
                            addClass(
                                this.parent.getContent().querySelector('.e-movablecontent').querySelectorAll('tr:last-child td'),
                                'e-lastrowcell'
                            );
                        }
                    }
                    if ((this.parent.frozenRows > 0 || this.parent.frozenColumns > 0) && this.header.querySelector('.e-movableheader')) {
                        this.header.querySelector('.e-movableheader').scrollLeft = this.previousValues.left;
                    } else {
                        this.header.scrollLeft = this.previousValues.left;
                    }
                    this.content.scrollLeft = this.previousValues.left;
                    this.content.scrollTop = this.previousValues.top;
                }
                if (!this.parent.enableColumnVirtualization) {
                    this.content.scrollLeft = sLeft;
                }
                if (this.parent.frozenColumns && this.header.querySelector('.e-movableheader')) {
                    (this.header.querySelector('.e-movableheader') as HTMLElement).scrollLeft =
                    (this.content.querySelector('.e-movablecontent') as HTMLElement).scrollLeft;
                }
            },
        );
        this.parent.isPreventScrollEvent = false;
    }

    /** 
     * @hidden
     */
    public getCssProperties(rtl?: boolean): ScrollCss {
        let css: ScrollCss = {};
        let enableRtl: boolean = isNullOrUndefined(rtl) ? this.parent.enableRtl : rtl;
        css.border = enableRtl ? 'borderLeftWidth' : 'borderRightWidth';
        css.padding = enableRtl ? 'paddingLeft' : 'paddingRight';
        return css;
    }

    private ensureOverflow(content: HTMLElement): void {
        if (this.parent.getFrozenColumns()) {
            (content.querySelector('.e-movablecontent') as HTMLElement).style.overflowY = this.parent.height === 'auto' ? 'auto' : 'scroll';
        } else {
            content.style.overflowY = this.parent.height === 'auto' ? 'auto' : 'scroll';
        }
    }

    private onPropertyChanged(e: NotifyArgs): void {
        if (e.module !== this.getModuleName()) {
            return;
        }
        this.setPadding();
        this.oneTimeReady = true;
        if (this.parent.height === 'auto') {
            this.removePadding();
        }
        this.wireEvents();
        this.setHeight();
        this.setWidth();
    }
    /**
     * @hidden
     */
    public destroy(): void {
        let gridElement: Element = this.parent.element;
        if (!gridElement || (!gridElement.querySelector('.e-gridheader') && !gridElement.querySelector('.e-gridcontent'))) { return; }
        this.removeEventListener();

        //Remove padding
        this.removePadding();
        removeClass([<HTMLDivElement>this.parent.getHeaderContent().firstChild], 'e-headercontent');
        removeClass([<HTMLDivElement>this.parent.getContent().firstChild], 'e-content');

        //Remove height
        (<HTMLDivElement>this.parent.getContent().firstChild).style.height = '';

        //Remove width
        this.parent.element.style.width = '';

        //Remove Dom event
        EventHandler.remove(<HTMLDivElement>this.parent.getContent().firstChild, 'scroll', this.onContentScroll);
    }

    /**
     * Function to get the scrollbar width of the browser.
     * @return {number} 
     * @hidden
     */
    public static getScrollBarWidth(): number {
        return getScrollBarWidth();
    }
}

/**
 * @hidden
 */
export interface ScrollCss {
    padding?: string;
    border?: string;
}
