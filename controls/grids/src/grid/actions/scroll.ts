import { Browser, EventHandler } from '@syncfusion/ej2-base';
import { addClass, removeClass } from '@syncfusion/ej2-base';
import { formatUnit, isNullOrUndefined } from '@syncfusion/ej2-base';
import { IGrid, IAction, NotifyArgs } from '../base/interface';
import { getScrollBarWidth, getUpdateUsingRaf } from '../base/util';
import {
    scroll, contentReady, uiUpdate, onEmpty, headerRefreshed, textWrapRefresh, virtualScrollEdit, infiniteScrollHandler, closeFilterDialog
} from '../base/constant';
import { lazyLoadScrollHandler, checkScrollReset } from '../base/constant';
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
    public setWidth(uiupdate?: boolean): void {
        this.parent.element.style.width = formatUnit(this.parent.width);
        if (uiupdate) {
            this.widthService.setWidthToColumns();
        }
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
        let content: HTMLElement = (<HTMLElement>this.parent.getContent().querySelector('.e-content'));
        let height: string | number = this.parent.height as string;
        if (this.parent.isFrozenGrid() && this.parent.height !== 'auto' && this.parent.height.toString().indexOf('%') < 0) {
            height = parseInt(height, 10) - Scroll.getScrollBarWidth();
        }
        if (!this.parent.enableVirtualization && this.parent.frozenRows && this.parent.height !== 'auto') {
            let tbody: HTMLElement = (this.parent.getHeaderContent().querySelector('tbody') as HTMLElement);
            mHdrHeight = tbody ? tbody.offsetHeight : 0;
            if (tbody && mHdrHeight) {
                let add: number = tbody.querySelectorAll('.e-addedrow').length;
                let height: number = add * this.parent.getRowHeight();
                mHdrHeight -= height;
            }
            content.style.height = formatUnit((height as number) - mHdrHeight);
        } else {
            content.style.height = formatUnit(height);
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
        let padding: string = this.parent.getFrozenMode() === 'Right' || this.parent.getFrozenMode() === 'Left-Right' ? '0.5px' : '1px';
        (<HTMLElement>content.querySelector('.e-headercontent')).style[cssProps.border] = scrollWidth > 0 ? padding : '0px';
        content.style[cssProps.padding] = scrollWidth > 0 ? scrollWidth + 'px' : '0px';
    }
    /**
     * @hidden
     */
    public removePadding(rtl?: boolean): void {
        let cssProps: ScrollCss = this.getCssProperties(rtl);
        let hDiv: HTMLDivElement = (<HTMLDivElement>this.parent.getHeaderContent().querySelector('.e-headercontent'));
        hDiv.style[cssProps.border] = '';
        hDiv.parentElement.style[cssProps.padding] = '';
        let footerDiv: HTMLDivElement = (<HTMLDivElement>this.parent.getFooterContent());
        if (footerDiv && footerDiv.classList.contains('e-footerpadding')) {
            footerDiv.classList.remove('e-footerpadding');
        }
    }
    /**
     * Refresh makes the Grid adoptable with the height of parent container.
     *  
     * > The [`height`](grid/#height/) must be set to 100%. 
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
        if (this.parent.isFrozenGrid()) {
            (content.firstElementChild as HTMLElement).style.height = 'calc(100% - ' + getScrollBarWidth() + 'px)';
        }
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
        this.parent.on(textWrapRefresh, this.wireEvents, this);
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
        this.parent.off(textWrapRefresh, this.wireEvents);
        this.parent.off(headerRefreshed, this.setScrollLeft);
    }

    private setScrollLeft(): void {
        if (this.parent.isFrozenGrid()) {
            (<HTMLElement>(<Grid>this.parent).headerModule.getMovableHeader()).scrollLeft = this.previousValues.left;
        } else {
            (<HTMLElement>(<Grid>this.parent).getHeaderContent().querySelector('.e-headercontent')).scrollLeft = this.previousValues.left;
        }
    }

    private onFrozenContentScroll(): Function {
        return (e: Event) => {
            if (this.content.querySelector('tbody') === null || this.parent.isPreventScrollEvent) {
                return;
            }
            if (!isNullOrUndefined(this.parent.infiniteScrollModule) && this.parent.enableInfiniteScrolling) {
                this.parent.notify(infiniteScrollHandler, e);
            }
            this.previousValues.top = (<HTMLElement>e.target).scrollTop;
        };
    }

    private onContentScroll(scrollTarget: HTMLElement): Function {
        let element: HTMLElement = scrollTarget;
        let isHeader: boolean = element.classList.contains('e-headercontent');
        return (e: Event) => {
            if (this.content.querySelector('tbody') === null || this.parent.isPreventScrollEvent) {
                return;
            }

            if (!isNullOrUndefined(this.parent.infiniteScrollModule) && this.parent.enableInfiniteScrolling) {
                this.parent.notify(infiniteScrollHandler, e);
            }
            if (this.parent.groupSettings.columns.length && this.parent.groupSettings.enableLazyLoading) {
                let isDown: boolean = this.previousValues.top < this.parent.getContent().firstElementChild.scrollTop;
                this.parent.notify(lazyLoadScrollHandler, { scrollDown: isDown });
            }
            this.parent.notify(virtualScrollEdit, {});
            let target: HTMLElement = (<HTMLElement>e.target);
            let left: number = target.scrollLeft;
            let sLimit: number = target.scrollWidth;
            let isFooter: boolean = target.classList.contains('e-summarycontent');

            if (this.previousValues.left === left) {
                this.previousValues.top = !isHeader ? this.previousValues.top : target.scrollTop;
                return;
            }

            this.parent.notify(closeFilterDialog, e);
            element.scrollLeft = left;
            if (isFooter) { this.header.scrollLeft = left; }
            this.previousValues.left = left;
            this.parent.notify(scroll, { left: left });
        };
    }

    private onCustomScrollbarScroll(mCont: HTMLElement, mHdr: HTMLElement): Function {
        let content: HTMLElement = mCont;
        let header: HTMLElement = mHdr;
        return (e: Event) => {
            if (this.content.querySelector('tbody') === null) {
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
            this.parent.notify(scroll, { left: left });
            if (this.parent.isDestroyed) { return; }
        };
    }

    private onTouchScroll(scrollTarget: HTMLElement): Function {
        let element: HTMLElement = scrollTarget;
        return (e: PointerEvent | TouchEvent) => {
            if ((e as PointerEvent).pointerType === 'mouse') {
                return;
            }
            let isFrozen: boolean = this.parent.isFrozenGrid();
            let pageXY: { x: number, y: number } = this.getPointXY(e);
            let left: number = element.scrollLeft + (this.pageXY.x - pageXY.x);
            let mHdr: Element = isFrozen ?
                this.parent.getHeaderContent().querySelector('.e-movableheader') :
                this.parent.getHeaderContent().querySelector('.e-headercontent') as Element;
            let mCont: Element = isFrozen ?
                this.parent.getContent().querySelector('.e-movablecontent') :
                this.parent.getContent().querySelector('.e-content') as Element;
            if (this.previousValues.left === left || (left < 0 || (mHdr.scrollWidth - mHdr.clientWidth) < left)) {
                return;
            }
            e.preventDefault();
            mHdr.scrollLeft = left;
            mCont.scrollLeft = left;
            if (isFrozen) {
                let scrollBar: HTMLElement = this.parent.getContent().querySelector('.e-movablescrollbar');
                scrollBar.scrollLeft = left;
            }
            this.pageXY.x = pageXY.x;
            this.previousValues.left = left;
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
            let frzCols: boolean = this.parent.isFrozenGrid();
            this.content = <HTMLDivElement>this.parent.getContent().querySelector('.e-content');
            this.header = <HTMLDivElement>this.parent.getHeaderContent().querySelector('.e-headercontent');
            let mCont: HTMLElement = this.content.querySelector('.e-movablecontent') as HTMLElement;
            let fCont: HTMLElement = this.content.querySelector('.e-frozencontent') as HTMLElement;
            let mHdr: HTMLElement = this.header.querySelector('.e-movableheader') as HTMLElement;
            let mScrollBar: HTMLElement = this.parent.getContent().querySelector('.e-movablescrollbar');
            if (this.parent.frozenRows) {
                EventHandler.add(frzCols ? mHdr : this.header, 'touchstart pointerdown', this.setPageXY(), this);
                EventHandler.add(
                    frzCols ? mHdr : this.header, 'touchmove pointermove',
                    this.onTouchScroll(frzCols ? mCont : this.content), this);
            }
            if (this.parent.isFrozenGrid()) {
                EventHandler.add(mScrollBar, 'scroll', this.onCustomScrollbarScroll(mCont, mHdr), this);
                EventHandler.add(mCont, 'scroll', this.onCustomScrollbarScroll(mScrollBar, mHdr), this);
                EventHandler.add(mHdr, 'scroll', this.onCustomScrollbarScroll(mScrollBar, mCont), this);
                EventHandler.add(this.content, 'scroll', this.onFrozenContentScroll(), this);
                EventHandler.add(mHdr, 'touchstart pointerdown', this.setPageXY(), this);
                EventHandler.add(mHdr, 'touchmove pointermove', this.onTouchScroll(mCont), this);
                EventHandler.add(mCont, 'touchstart pointerdown', this.setPageXY(), this);
                EventHandler.add(mCont, 'touchmove pointermove', this.onTouchScroll(mHdr), this);
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
                let args: NotifyArgs = { cancel: false };
                this.parent.notify(checkScrollReset, args);
                if (!this.parent.enableVirtualization && !this.parent.enableInfiniteScrolling) {
                    if (sHeight < clientHeight) {
                        addClass(table.querySelectorAll('tr:last-child td'), 'e-lastrowcell');
                        if (this.parent.isFrozenGrid()) {
                            addClass(
                                this.parent.getContent().querySelector('.e-movablecontent').querySelectorAll('tr:last-child td'),
                                'e-lastrowcell'
                            );
                        }
                    }
                    if (!args.cancel) {
                        if ((this.parent.frozenRows > 0 || this.parent.isFrozenGrid()) && this.header.querySelector('.e-movableheader')) {
                            this.header.querySelector('.e-movableheader').scrollLeft = this.previousValues.left;
                        } else {
                            this.header.scrollLeft = this.previousValues.left;
                        }
                        this.content.scrollLeft = this.previousValues.left;
                        this.content.scrollTop = this.previousValues.top;
                    }
                }
                if (!this.parent.enableColumnVirtualization) {
                    this.content.scrollLeft = sLeft;
                }
                if (this.parent.isFrozenGrid() && this.header.querySelector('.e-movableheader')) {
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
        content.style.overflowY = this.parent.height === 'auto' ? 'auto' : 'scroll';
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
        let width: string = 'width';
        this.setWidth(!isNullOrUndefined(e.properties[width]));
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
        let cont: Element = this.parent.getContent().querySelector('.e-content');
        removeClass([<HTMLDivElement>this.parent.getHeaderContent().querySelector('.e-headercontent')], 'e-headercontent');
        removeClass([cont], 'e-content');

        //Remove height
        (<HTMLDivElement>cont).style.height = '';

        //Remove width
        this.parent.element.style.width = '';

        //Remove Dom event
        EventHandler.remove(<HTMLDivElement>cont, 'scroll', this.onContentScroll);
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
