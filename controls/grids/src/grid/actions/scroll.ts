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
import * as literals from '../base/string-literals';
import * as events from '../base/constant';

/**
 * The `Scroll` module is used to handle scrolling behaviour.
 */
export class Scroll implements IAction {
    private parent: IGrid;
    //To maintain scroll state on grid actions.
    private previousValues: { top: number, left: number } = { top: 0, left: 0 };
    private oneTimeReady: boolean = true;
    private content: HTMLDivElement;
    private header: HTMLDivElement;
    private widthService: ColumnWidthService;
    private pageXY: { x: number, y: number };
    private parentElement: HTMLElement;

    /**
     * Constructor for the Grid scrolling.
     *
     * @param {IGrid} parent - specifies the IGrid
     * @hidden
     */
    constructor(parent?: IGrid) {
        this.parent = parent;
        this.widthService = new ColumnWidthService(parent);
        this.addEventListener();
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {string} returns the module name
     * @private
     */
    protected getModuleName(): string {
        return 'scroll';
    }

    /**
     * @param {boolean} uiupdate - specifies the uiupdate
     * @returns {void}
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
     * @returns {void}
     * @hidden
     */
    public setHeight(): void {
        let mHdrHeight: number = 0;
        const content: HTMLElement = (<HTMLElement>this.parent.getContent().querySelector('.' + literals.content));
        let height: string | number = this.parent.height as string;
        if (this.parent.isFrozenGrid() && this.parent.height !== 'auto' && this.parent.height.toString().indexOf('%') < 0) {
            height = parseInt(height, 10) - Scroll.getScrollBarWidth();
        }
        if (!this.parent.enableVirtualization && this.parent.frozenRows && this.parent.height !== 'auto') {
            const tbody: HTMLElement = (this.parent.getHeaderContent().querySelector( literals.tbody) as HTMLElement);
            mHdrHeight = tbody ? tbody.offsetHeight : 0;
            if (tbody && mHdrHeight) {
                const add: number = tbody.getElementsByClassName(literals.addedRow).length;
                const height: number = add * this.parent.getRowHeight();
                mHdrHeight -= height;
            }
            content.style.height = formatUnit((height as number) - mHdrHeight);
        } else {
            content.style.height = formatUnit(height);
        }
        this.ensureOverflow(content);
        if (this.parent.isFrozenGrid()) {
            this.refresh();
        }
    }

    /**
     * @returns {void}
     * @hidden
     */
    public setPadding(): void {
        const content: HTMLElement = <HTMLElement>this.parent.getHeaderContent();
        const scrollWidth: number = Scroll.getScrollBarWidth() - this.getThreshold();
        const cssProps: ScrollCss = this.getCssProperties();
        const padding: string = this.parent.getFrozenMode() === 'Right' || this.parent.getFrozenMode() === literals.leftRight ? '0.5px' : '1px';
        (<HTMLElement>content.querySelector('.' + literals.headerContent)).style[cssProps.border] = scrollWidth > 0 ? padding : '0px';
        content.style[cssProps.padding] = scrollWidth > 0 ? scrollWidth + 'px' : '0px';
    }

    /**
     * @param {boolean} rtl - specifies the rtl
     * @returns {void}
     * @hidden
     */
    public removePadding(rtl?: boolean): void {
        const cssProps: ScrollCss = this.getCssProperties(rtl);
        const hDiv: HTMLDivElement = (<HTMLDivElement>this.parent.getHeaderContent().querySelector('.' + literals.headerContent));
        hDiv.style[cssProps.border] = '';
        hDiv.parentElement.style[cssProps.padding] = '';
        const footerDiv: HTMLDivElement = (<HTMLDivElement>this.parent.getFooterContent());
        if (footerDiv && footerDiv.classList.contains('e-footerpadding')) {
            footerDiv.classList.remove('e-footerpadding');
        }
    }

    /**
     * Refresh makes the Grid adoptable with the height of parent container.
     *
     * > The [`height`](grid/#height/) must be set to 100%.
     *
     * @returns {void}
     */
    public refresh(): void {
        if (this.parent.height !== '100%') {
            return;
        }
        const content: HTMLElement = <HTMLElement>this.parent.getContent();
        this.parent.element.style.height = '100%';
        const height: number = this.widthService.getSiblingsHeight(content);
        content.style.height = 'calc(100% - ' + height + 'px)'; //Set the height to the  '.' + literals.gridContent;
        if (this.parent.isFrozenGrid()) {
            (content.firstElementChild as HTMLElement).style.height = 'calc(100% - ' + getScrollBarWidth() + 'px)';
        }
    }

    private getThreshold(): number {
        /* Some browsers places the scroller outside the content,
         * hence the padding should be adjusted.*/
        const appName: string = Browser.info.name;
        if (appName === 'mozilla') {
            return 0.5;
        }
        return 1;
    }

    /**
     * @returns {void}
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
     * @returns {void}
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
            (<HTMLElement>(<Grid>this.parent).getHeaderContent().querySelector('.' + literals.headerContent)).scrollLeft = this.previousValues.left;
        }
    }

    private onFrozenContentScroll(): Function {
        return (e: Event) => {
            if (this.content.querySelector( literals.tbody) === null || this.parent.isPreventScrollEvent) {
                return;
            }
            if (!isNullOrUndefined(this.parent.infiniteScrollModule) && this.parent.enableInfiniteScrolling) {
                this.parent.notify(infiniteScrollHandler, e);
            }
            this.previousValues.top = (<HTMLElement>e.target).scrollTop;
        };
    }

    private onContentScroll(scrollTarget: HTMLElement): Function {
        const element: HTMLElement = scrollTarget;
        const isHeader: boolean = element.classList.contains(literals.headerContent);
        return (e: Event) => {
            if (this.content.querySelector( literals.tbody) === null || this.parent.isPreventScrollEvent) {
                return;
            }

            const target: HTMLElement = (<HTMLElement>e.target);
            const left: number = target.scrollLeft;
            if (!isNullOrUndefined(this.parent.infiniteScrollModule) && this.parent.enableInfiniteScrolling) {
                this.parent.notify(infiniteScrollHandler, { target: e.target, isLeft: this.previousValues.left !== left });
            }
            if (this.parent.groupSettings.columns.length && this.parent.groupSettings.enableLazyLoading) {
                const isDown: boolean = this.previousValues.top < this.parent.getContent().firstElementChild.scrollTop;
                this.parent.notify(lazyLoadScrollHandler, { scrollDown: isDown });
            }
            this.parent.notify(virtualScrollEdit, {});
            const isFooter: boolean = target.classList.contains('e-summarycontent');
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
        const content: HTMLElement = mCont;
        const header: HTMLElement = mHdr;
        return (e: Event) => {
            if (this.content.querySelector( literals.tbody) === null) {
                return;
            }
            const target: HTMLElement = <HTMLElement>e.target;
            const left: number = target.scrollLeft;
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
        const element: HTMLElement = scrollTarget;
        return (e: PointerEvent | TouchEvent) => {
            if ((e as PointerEvent).pointerType === 'mouse') {
                return;
            }
            const isFrozen: boolean = this.parent.isFrozenGrid();
            const pageXY: { x: number, y: number } = this.getPointXY(e);
            const left: number = element.scrollLeft + (this.pageXY.x - pageXY.x);
            const mHdr: Element = isFrozen ?
                this.parent.getHeaderContent().querySelector('.' + literals.movableHeader) :
                this.parent.getHeaderContent().querySelector('.' + literals.headerContent) as Element;
            const mCont: Element = isFrozen ?
                this.parent.getContent().querySelector('.' + literals.movableContent) :
                this.parent.getContent().querySelector('.' + literals.content) as Element;
            if (this.previousValues.left === left || (left < 0 || (mHdr.scrollWidth - mHdr.clientWidth) < left)) {
                return;
            }
            e.preventDefault();
            mHdr.scrollLeft = left;
            mCont.scrollLeft = left;
            if (isFrozen) {
                const scrollBar: HTMLElement = this.parent.getContent().querySelector('.e-movablescrollbar');
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
        const pageXY: { x: number, y: number } = { x: 0, y: 0 };
        if ((e as TouchEvent).touches && (e as TouchEvent).touches.length) {
            pageXY.x = (e as TouchEvent).touches[0].pageX;
            pageXY.y = (e as TouchEvent).touches[0].pageY;
        } else {
            pageXY.x = (e as PointerEvent).pageX;
            pageXY.y = (e as PointerEvent).pageY;
        }
        return pageXY;
    }

    private getScrollbleParent(node: HTMLElement): HTMLElement {
        if (node === null) {
            return null;
        }
        const parent = isNullOrUndefined(node.tagName) ? (node as any).scrollingElement : node;
        const overflowY = document.defaultView.getComputedStyle(parent, null).overflowY;
        if (parent.scrollHeight > parent.clientHeight && overflowY !== 'hidden'
            && overflowY !== 'visible' || node.tagName === "HTML" || node.tagName === "BODY") {
            return node
        } else {
            return this.getScrollbleParent(node.parentNode as HTMLElement);
        }
    }

    /**
     * @param {boolean} isAdd - specifies whether adding/removing the event
     * @returns {void}
     * @hidden
     */
    public addStickyListener(isAdd: boolean): void {
        if (isAdd) {
            this.parentElement = this.getScrollbleParent(this.parent.element.parentElement);
            if (this.parentElement) {
                EventHandler.add(this.parentElement.tagName === 'HTML' || this.parentElement.tagName === 'BODY' ? document :
                    this.parentElement, 'scroll', this.makeStickyHeader, this);
            }
        } else {
            EventHandler.remove(this.parentElement, 'scroll', this.makeStickyHeader);
        }
    }

    private wireEvents(): void {
        if (this.oneTimeReady) {
            const frzCols: boolean = this.parent.isFrozenGrid();
            this.content = <HTMLDivElement>this.parent.getContent().querySelector('.' + literals.content);
            this.header = <HTMLDivElement>this.parent.getHeaderContent().querySelector('.' + literals.headerContent);
            const mCont: HTMLElement = this.content.querySelector('.' + literals.movableContent) as HTMLElement;
            const mHdr: HTMLElement = this.header.querySelector('.' + literals.movableHeader) as HTMLElement;
            const mScrollBar: HTMLElement = this.parent.getContent().querySelector('.e-movablescrollbar');
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
            if (this.parent.enableStickyHeader) {
                this.addStickyListener(true);
            }
            this.refresh();
            this.oneTimeReady = false;
        }
        const table: Element = this.parent.getContentTable();
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
                const args: NotifyArgs = { cancel: false };
                this.parent.notify(checkScrollReset, args);
                if (!this.parent.enableVirtualization && !this.parent.enableInfiniteScrolling) {
                    if (sHeight < clientHeight) {
                        addClass(table.querySelectorAll('tr:last-child td'), 'e-lastrowcell');
                        if (this.parent.isFrozenGrid()) {
                            addClass(
                                this.parent.getContent().querySelector('.' + literals.movableContent).querySelectorAll('tr:last-child td'),
                                'e-lastrowcell'
                            );
                        }
                    }
                    if (!args.cancel) {
                        if ((this.parent.frozenRows > 0 || this.parent.isFrozenGrid()) && this.header.querySelector('.' + literals.movableHeader)) {
                            this.header.querySelector('.' + literals.movableHeader).scrollLeft = this.previousValues.left;
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
                if (this.parent.isFrozenGrid() && this.header.querySelector('.' + literals.movableHeader)) {
                    (this.header.querySelector('.' + literals.movableHeader) as HTMLElement).scrollLeft =
                        (this.content.querySelector('.' + literals.movableContent) as HTMLElement).scrollLeft;
                }
            }
        );
        this.parent.isPreventScrollEvent = false;
    }

    /**
     * @param {boolean} rtl - specifies the rtl
     * @returns {ScrollCss} returns the ScrollCss
     * @hidden
     */
    public getCssProperties(rtl?: boolean): ScrollCss {
        const css: ScrollCss = {};
        const enableRtl: boolean = isNullOrUndefined(rtl) ? this.parent.enableRtl : rtl;
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
        const width: string = 'width';
        this.setWidth(!isNullOrUndefined(e.properties[width]));
    }

    private makeStickyHeader(): void {
        if (this.parent.enableStickyHeader && this.parent.element && this.parent.getContent()) {
            const contentRect: ClientRect = this.parent.getContent().getClientRects()[0];
            if (contentRect) {
            const headerEle: HTMLElement = this.parent.getHeaderContent() as HTMLElement;
            const toolbarEle: HTMLElement = this.parent.element.querySelector('.e-toolbar') as HTMLElement;
            const groupHeaderEle: HTMLElement = this.parent.element.querySelector('.e-groupdroparea') as HTMLElement;
            const height: number = headerEle.offsetHeight + (toolbarEle ? toolbarEle.offsetHeight : 0) +
                (groupHeaderEle ? groupHeaderEle.offsetHeight : 0);
            const parentTop: number = this.parentElement.getClientRects()[0].top;
            const top: number = contentRect.top - (parentTop < 0 ? 0 : parentTop);
            const left: number = contentRect.left;
            if (top < height && contentRect.bottom > 0) {
                headerEle.classList.add('e-sticky');
                let elemTop: number = 0;
                if (groupHeaderEle) {
                    this.setSticky(groupHeaderEle, elemTop, contentRect.width, left, true);
                    elemTop += groupHeaderEle.getClientRects()[0].height;
                }
                if (toolbarEle) {
                    this.setSticky(toolbarEle, elemTop, contentRect.width, left, true);
                    elemTop += toolbarEle.getClientRects()[0].height;
                }
                this.setSticky(headerEle, elemTop, contentRect.width, left, true);
            }
            else {
                if (headerEle.classList.contains('e-sticky')) {
                    this.setSticky(headerEle, null, null, null, false);
                    if (toolbarEle) {
                        this.setSticky(toolbarEle, null, null, null, false);
                    }
                    if (groupHeaderEle) {
                        this.setSticky(groupHeaderEle, null, null, null, false);
                    }
                    const ccDlg: HTMLElement = this.parent.element.querySelector('.e-ccdlg');
                    if (ccDlg) {
                        ccDlg.classList.remove('e-sticky');
                    }
                }
            }
            this.parent.notify(events.stickyScrollComplete, {});
        }
        }
    }

    private setSticky(ele: HTMLElement, top?: number, width?: number, left?: number, isAdd?: boolean): void {
        if (isAdd) {
            ele.style.width = width + 'px';
            ele.classList.add('e-sticky');
        } else {
            ele.classList.remove('e-sticky');
        }
        ele.style.top = top != null ? top + 'px' : '';
        ele.style.left = left !== null ? parseInt(ele.style.left, 10) !== left ? left + 'px' : ele.style.left : '';
    }

    /**
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        const gridElement: Element = this.parent.element;
        if (!gridElement || (!gridElement.querySelector('.' + literals.gridHeader) && !gridElement.querySelector( '.' + literals.gridContent))) { return; }
        this.removeEventListener();

        //Remove padding
        this.removePadding();
        const cont: Element = this.parent.getContent().querySelector('.' + literals.content);
        removeClass([<HTMLDivElement>this.parent.getHeaderContent().querySelector('.' + literals.headerContent)], literals.headerContent);
        removeClass([cont], literals.content);

        //Remove height
        (<HTMLDivElement>cont).style.height = '';

        //Remove width
        this.parent.element.style.width = '';

        //Remove Dom event
        EventHandler.remove(<HTMLDivElement>cont, 'scroll', this.onContentScroll);
        if (this.parent.enableStickyHeader) {
            this.addStickyListener(false);
        }
    }

    /**
     * Function to get the scrollbar width of the browser.
     *
     * @returns {number} return the width
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
