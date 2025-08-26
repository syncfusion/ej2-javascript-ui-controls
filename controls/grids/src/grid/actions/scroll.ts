import { Browser, EventHandler } from '@syncfusion/ej2-base';
import { addClass, removeClass } from '@syncfusion/ej2-base';
import { formatUnit, isNullOrUndefined } from '@syncfusion/ej2-base';
import { IGrid, IAction, NotifyArgs } from '../base/interface';
import { getScrollBarWidth, getUpdateUsingRaf } from '../base/util';
import {
    scroll, contentReady, uiUpdate, onEmpty, headerRefreshed, textWrapRefresh, virtualScrollEdit, infiniteScrollHandler, closeFilterDialog
} from '../base/constant';
import { lazyLoadScrollHandler, checkScrollReset, lastRowCellBorderUpdated } from '../base/constant';
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
    private eventElement: HTMLElement | Document;
    private contentScrollHandler: Function;
    private headerScrollHandler: Function;

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
            const tlbrElement: Element = (<Grid>this.parent).toolbarModule.toolbar.element;
            const tlbrLeftElement: Element = tlbrElement.querySelector('.e-toolbar-left');
            const tlbrCenterElement: Element = tlbrElement.querySelector('.e-toolbar-center');
            const tlbrRightElement: Element = tlbrElement.querySelector('.e-toolbar-right');
            const tlbrItems: Element = tlbrElement.querySelector('.e-toolbar-items');
            const tlbrLeftWidth: number = tlbrLeftElement ? tlbrLeftElement.clientWidth : 0;
            const tlbrCenterWidth: number = tlbrCenterElement ? tlbrCenterElement.clientWidth : 0;
            const tlbrRightWidth: number = tlbrRightElement ? tlbrRightElement.clientWidth : 0;
            const tlbrItemsWidth: number = tlbrItems ? tlbrItems.clientWidth : 0;
            const tlbrWidth: number = tlbrElement ? tlbrElement.clientWidth : 0;
            if (!this.parent.enableAdaptiveUI || tlbrLeftWidth > tlbrWidth || tlbrCenterWidth > tlbrWidth || tlbrRightWidth > tlbrWidth ||
                tlbrItemsWidth > tlbrWidth) {
                (<Grid>this.parent).toolbarModule.toolbar.refreshOverflow();
            }
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
        if (this.parent.enableColumnVirtualization && this.parent.isFrozenGrid()) {
            if (this.parent.height !== 'auto' && this.parent.height.toString().indexOf('%') < 0) {
                height = parseInt(height, 10) - Scroll.getScrollBarWidth();
            }
            const movableScrollbarElement: Element = this.parent.getContent().querySelector('.e-movablescrollbar');
            if (this.parent.height.toString().indexOf('%') > 0 && !isNullOrUndefined(movableScrollbarElement)) {
                height = 'calc(' + height + ' - ' + movableScrollbarElement.scrollHeight + 'px)';
            }
        }
        if (!this.parent.enableVirtualization && this.parent.frozenRows && this.parent.height !== 'auto' &&
            this.parent.height !== '100%') {
            const tbody: HTMLElement = (this.parent.getHeaderContent()
                .querySelector( literals.tbody + ':not(.e-masked-tbody)') as HTMLElement);
            mHdrHeight = tbody ? tbody.offsetHeight : 0;
            if (tbody && mHdrHeight) {
                const add: number = tbody.getElementsByClassName(literals.addedRow).length;
                const height: number = add * this.parent.getRowHeight();
                mHdrHeight -= height;
            } else if (!this.parent.isInitialLoad && this.parent.loadingIndicator.indicatorType === 'Shimmer'
                && this.parent.getHeaderContent().querySelector('.e-masked-table')) {
                height = parseInt(height as string, 10) - (this.parent.frozenRows * this.parent.getRowHeight());
            }
            content.style.height = formatUnit(parseInt(height as string, 10) - mHdrHeight);
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
        (<HTMLElement>content.querySelector('.' + literals.headerContent)).style[cssProps.border] = scrollWidth > 0 ? '1px' : '0px';
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
     * > The [`height`](./#height) must be set to 100%.
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
        this.unwireEvents();
    }

    private unwireEvents(): void {
        if (this.parent.frozenRows && this.header) {
            EventHandler.remove(this.header, 'touchstart pointerdown', this.setPageXY);
            EventHandler.remove(this.header, 'touchmove pointermove', this.onTouchScroll);
        }
        const mScrollBar: HTMLElement = this.parent.getContent() ? this.parent.getContent().querySelector('.e-movablescrollbar') : null;
        if (this.parent.isFrozenGrid() && this.parent.enableColumnVirtualization) {
            if (mScrollBar) {
                EventHandler.remove(mScrollBar, 'scroll', this.onCustomScrollbarScroll);
            }
            if (this.content) {
                EventHandler.remove(this.content, 'scroll', this.onCustomScrollbarScroll);
                EventHandler.remove(this.content, 'touchstart pointerdown', this.setPageXY);
                if (!((/macintosh|ipad/ as RegExp).test(Browser.userAgent.toLowerCase()) && Browser.isDevice)) {
                    EventHandler.remove(this.content, 'touchmove pointermove', this.onTouchScroll);
                }
            }
            if (this.header) {
                EventHandler.remove(this.header, 'scroll', this.onCustomScrollbarScroll);
                EventHandler.remove(this.header, 'touchstart pointerdown', this.setPageXY);
                EventHandler.remove(this.header, 'touchmove pointermove', this.onTouchScroll);
            }
        }
        if (this.content) {
            EventHandler.remove(this.content, 'scroll', this.contentScrollHandler);
        }
        if (this.header) {
            EventHandler.remove(this.header, 'scroll', this.headerScrollHandler);
        }
        this.contentScrollHandler = null;
        this.headerScrollHandler = null;
        if (this.parent.aggregates.length && this.parent.getFooterContent()) {
            EventHandler.remove(<HTMLDivElement>this.parent.getFooterContent().firstChild, 'scroll', this.onContentScroll);
        }
    }

    private setScrollLeft(): void {
        (<HTMLElement>(<Grid>this.parent).getHeaderContent().querySelector('.' + literals.headerContent)).scrollLeft = this.previousValues.left;
    }

    private onContentScroll(scrollTarget: HTMLElement): Function {
        const element: HTMLElement = scrollTarget;
        const isHeader: boolean = element.classList.contains(literals.headerContent);
        return (e: Event) => {
            if (this.content.querySelector( literals.tbody) === null || this.parent.isPreventScrollEvent) {
                return;
            }
            const target: HTMLElement = (<HTMLElement>e.target);
            if (this.parent.frozenRows) {
                if (this.content.scrollTop > 0 && this.parent.frozenRows) {
                    addClass([this.parent.element], 'e-top-shadow');
                } else {
                    removeClass([this.parent.element], 'e-top-shadow');
                }
            }
            if (this.parent.element.querySelectorAll('.e-leftfreeze,.e-fixedfreeze,.e-rightfreeze').length) {
                const errorFreeze: NodeListOf<Element> = this.parent.getContent().querySelectorAll('.e-freezeerror:not([style*="display: none"])');
                const errorFixed: NodeListOf<Element> = this.parent.getContent().querySelectorAll('.e-fixederror:not([style*="display: none"])');
                const scrollLeft: number =  this.parent.enableRtl ? Math.abs(target.scrollLeft) : target.scrollLeft;
                const isStartOfScroll: boolean = scrollLeft <= 1;
                if (!isStartOfScroll && this.parent.getVisibleFrozenLeftCount()) {
                    addClass([this.parent.element], 'e-left-shadow');
                } else {
                    removeClass([this.parent.element], 'e-left-shadow');
                }
                const scrollRight: number = this.parent.enableRtl ? Math.abs(target.scrollLeft) : target.scrollLeft;
                const isEndOfScroll: boolean = Math.round(scrollRight + target.clientWidth) >= target.scrollWidth - 1;
                if (isEndOfScroll && this.parent.getVisibleFrozenRightCount()) {
                    removeClass([this.parent.element], 'e-right-shadow');
                } else {
                    addClass([this.parent.element], 'e-right-shadow');
                }
                const rows: Element[] = [].slice.call(this.parent.getContent().querySelectorAll('.e-row:not(.e-hiddenrow)'));
                if (((rows.length === 1 && errorFreeze.length) ||
                    (this.parent.element.querySelector('.e-freeze-autofill:not([style*="display: none"])')) ||
                    errorFixed.length) && target.scrollLeft !== this.previousValues.left) {
                    target.scrollLeft = this.previousValues.left;
                    return;
                }
                if (rows.length !== 1 && (errorFreeze.length || errorFixed.length) && target.scrollTop !== this.previousValues.top) {
                    target.scrollTop = this.previousValues.top;
                    return;
                }
            }
            const left: number = target.scrollLeft;
            if (!isNullOrUndefined(this.parent.infiniteScrollModule) && this.parent.enableInfiniteScrolling && (!this.parent.isEdit
                || (this.parent.editSettings.showAddNewRow && !this.parent.element.querySelector('.e-editedrow')))) {
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

    private onCustomScrollbarScroll(cont: HTMLElement, hdr: HTMLElement): Function {
        const content: HTMLElement = cont;
        const header: HTMLElement = hdr;
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
            const mHdr: Element =  this.parent.getHeaderContent().querySelector('.' + literals.headerContent) as Element;
            const mCont: Element = this.parent.getContent().querySelector('.' + literals.content) as Element;
            if (this.previousValues.left === left || (left < 0 || (mHdr.scrollWidth - mHdr.clientWidth) < left)) {
                return;
            }
            e.preventDefault();
            mHdr.scrollLeft = left;
            mCont.scrollLeft = left;
            if (isFrozen && this.parent.enableColumnVirtualization) {
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const parent: HTMLElement = isNullOrUndefined(node.tagName) ? (node as any).scrollingElement : node;
        const overflowY: string = document.defaultView.getComputedStyle(parent, null).overflowY;
        if (parent.scrollHeight > parent.clientHeight && overflowY !== 'hidden'
            && overflowY !== 'visible' || node.tagName === 'HTML' || node.tagName === 'BODY') {
            return node;
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
        this.parentElement = this.getScrollbleParent(this.parent.element.parentElement);
        if (isAdd && this.parentElement) {
            this.eventElement = this.parentElement.tagName === 'HTML' || this.parentElement.tagName === 'BODY' ? document :
                this.parentElement;
            EventHandler.add(this.eventElement, 'scroll', this.makeStickyHeader, this);
        } else if (this.eventElement) {
            EventHandler.remove(this.eventElement, 'scroll', this.makeStickyHeader);
            this.eventElement = null;
        }
    }

    /**
     * @returns {void}
     * @hidden
     */
    public resizeFrozenRowBorder(): void {
        let div: HTMLElement;
        if (!this.parent.element.querySelector('.e-frozenrow-border')) {
            div = this.parent.createElement('div', { className: 'e-frozenrow-border' });
            this.parent.element.insertBefore(div, this.parent.element.querySelector('.e-gridcontent'));
        } else {
            div = this.parent.element.querySelector('.e-frozenrow-border') as HTMLElement;
        }
        const scrollWidth: number = this.parent.height !== 'auto' ? Scroll.getScrollBarWidth() : 0;
        div.style.width = (this.parent.element.offsetWidth - scrollWidth) - 0.5 + 'px';
    }

    private wireEvents(): void {
        if (this.oneTimeReady) {
            const frzCols: boolean = this.parent.isFrozenGrid();
            this.content = <HTMLDivElement>this.parent.getContent().querySelector('.' + literals.content);
            this.header = <HTMLDivElement>this.parent.getHeaderContent().querySelector('.' + literals.headerContent);
            const mScrollBar: HTMLElement = this.parent.getContent().querySelector('.e-movablescrollbar');
            if (this.parent.frozenRows && this.header && this.content) {
                EventHandler.add(this.header, 'touchstart pointerdown', this.setPageXY(), this);
                EventHandler.add(this.header, 'touchmove pointermove', this.onTouchScroll( this.content), this);
            }
            if (frzCols && mScrollBar && this.parent.enableColumnVirtualization) {
                EventHandler.add(mScrollBar, 'scroll', this.onCustomScrollbarScroll(this.content, this.header), this);
                EventHandler.add(this.content, 'scroll', this.onCustomScrollbarScroll(mScrollBar, this.header), this);
                EventHandler.add(this.header, 'scroll', this.onCustomScrollbarScroll(mScrollBar, this.content), this);
                EventHandler.add(this.header, 'touchstart pointerdown', this.setPageXY(), this);
                EventHandler.add(this.header, 'touchmove pointermove', this.onTouchScroll(this.content), this);
                EventHandler.add(this.content, 'touchstart pointerdown', this.setPageXY(), this);
                if (!((/macintosh|ipad/ as RegExp).test(Browser.userAgent.toLowerCase()) && Browser.isDevice)) {
                    EventHandler.add(this.content, 'touchmove pointermove', this.onTouchScroll(this.header), this);
                }
            }
            this.contentScrollHandler = this.onContentScroll(this.header);
            this.headerScrollHandler = this.onContentScroll(this.content);
            EventHandler.add(this.content, 'scroll', this.contentScrollHandler, this);
            EventHandler.add(this.header, 'scroll', this.headerScrollHandler, this);
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
                if (sHeight < clientHeight && this.parent.height !== 'auto') {
                    this.setLastRowCell();
                    this.parent.notify(lastRowCellBorderUpdated, args);
                }
                if (this.parent.frozenRows) {
                    this.resizeFrozenRowBorder();
                }
                if (!this.parent.enableVirtualization && !this.parent.enableInfiniteScrolling) {
                    if (!args.cancel) {
                        this.header.scrollLeft = this.previousValues.left;
                        this.content.scrollLeft = this.previousValues.left;
                        this.content.scrollTop = this.previousValues.top;
                    }
                }
                if (!this.parent.enableColumnVirtualization) {
                    this.content.scrollLeft = sLeft;
                    if (this.parent.isFrozenGrid()) {
                        this.previousValues.left = sLeft;
                    }
                }
            }
        );
        this.parent.isPreventScrollEvent = false;
    }

    /**
     * @returns {void} returns void
     * @hidden
     */
    public setLastRowCell(): void {
        const table: Element = this.parent.getContentTable();
        removeClass(table.querySelectorAll('td'), 'e-lastrowcell');
        if (table.querySelector('tr:nth-last-child(2)')) {
            if (this.parent.editSettings.showAddNewRow && this.parent.editSettings.newRowPosition === 'Bottom') {
                addClass(table.querySelector('tr:nth-last-child(2)').querySelectorAll('td'), 'e-lastrowcell');
            }
        }
        addClass(table.querySelectorAll('tr:last-child td'), 'e-lastrowcell');
        if (this.parent.isSpan) {
            addClass(table.querySelectorAll('.e-row-span-lastrowcell'), 'e-lastrowcell');
        }
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
        this.setWidth(!isNullOrUndefined(e.properties[`${width}`]));
    }

    /**
     * @returns {void}
     * @hidden
     */
    public makeStickyHeader(): void {
        if (this.parent.enableStickyHeader && this.parent.element && this.parent.getContent()) {
            const contentRect: ClientRect = this.parent.getContent().getClientRects()[0];
            if (contentRect) {
                const windowScale: number = window.devicePixelRatio;
                const headerEle: HTMLElement = this.parent.getHeaderContent() as HTMLElement;
                const toolbarEle: HTMLElement = this.parent.element.querySelector('.e-toolbar') as HTMLElement;
                const groupHeaderEle: HTMLElement = this.parent.element.querySelector('.e-groupdroparea') as HTMLElement;
                const height: number = headerEle.offsetHeight + (toolbarEle ? toolbarEle.offsetHeight : 0) +
                    (groupHeaderEle ? groupHeaderEle.offsetHeight : 0);
                const parentTop: number = this.parentElement.getClientRects()[0].top;
                let top: number = contentRect.top - (parentTop < 0 ? 0 : parentTop);
                const left: number = contentRect.left;
                const colMenuEle: HTMLElement = document.body.querySelector('#' + this.parent.element.id + '_columnmenu');
                if (windowScale !== 1) {
                    top = Math.ceil(top);
                }
                if (top < height && contentRect.bottom > 0) {
                    headerEle.classList.add('e-sticky');
                    let elemTop: number = 0;
                    if (groupHeaderEle && this.parent.groupSettings.showDropArea) {
                        this.setSticky(groupHeaderEle, elemTop, contentRect.width, left, true);
                        elemTop += groupHeaderEle.getClientRects()[0].height;
                    }
                    if (toolbarEle) {
                        this.setSticky(toolbarEle, elemTop, contentRect.width, left, true);
                        elemTop += toolbarEle.getClientRects()[0].height;
                    }
                    this.setSticky(headerEle, elemTop, contentRect.width, left, true);
                    if (!isNullOrUndefined(colMenuEle)) {
                        colMenuEle.style.position = 'fixed';
                        colMenuEle.style.top = height + 'px';
                    }
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
                        if (!isNullOrUndefined(colMenuEle)) {
                            colMenuEle.style.position = 'absolute';
                            const topStyle: number = contentRect.top - parentTop;
                            colMenuEle.style.top = topStyle + 'px';
                        }
                    }
                }
                this.parent.notify(events.stickyScrollComplete, {});
            }
        }
    }

    private setSticky(ele: HTMLElement, top?: number, width?: number, left?: number, isAdd?: boolean): void {
        if (isAdd) {
            ele.classList.add('e-sticky');
        } else {
            ele.classList.remove('e-sticky');
        }
        ele.style.width = width != null ? width + 'px' : '';
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

        //Remove Dom event
        const cont: Element = this.parent.getContent().querySelector('.' + literals.content);
        EventHandler.remove(<HTMLDivElement>cont, 'scroll', this.onContentScroll);
        if (this.parent.enableStickyHeader) {
            this.addStickyListener(false);
        }

        //Remove padding
        this.removePadding();
        removeClass([<HTMLDivElement>this.parent.getHeaderContent().querySelector('.' + literals.headerContent)], literals.headerContent);
        removeClass([cont], literals.content);

        //Remove height
        (<HTMLDivElement>cont).style.height = '';

        //Remove width
        this.parent.element.style.width = '';
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
