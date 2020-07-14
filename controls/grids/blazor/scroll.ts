import { Browser, EventHandler } from '@syncfusion/ej2-base';
import { addClass, removeClass } from '@syncfusion/ej2-base';
import { formatUnit, isNullOrUndefined } from '@syncfusion/ej2-base';
import { getScrollBarWidth, getUpdateUsingRaf, getSiblingsHeight } from './util';
import { SfGrid } from './sf-grid-fn';

/**
 * The `Scroll` module is used to handle scrolling behaviour.
 */
export class Scroll {
    private parent: SfGrid;
    //To maintain scroll state on grid actions.
    private previousValues: { top: number, left: number } = { top: 0, left: 0 };
    private oneTimeReady: boolean = true;
    private content: HTMLDivElement;
    private header: HTMLDivElement;
    private pageXY: { x: number, y: number };

    /**
     * Constructor for the Grid scrolling.
     * @hidden
     */
    constructor(parent?: SfGrid) {
        this.parent = parent;
        this.addEventListener();
        this.setHeight();
        this.setPadding();
    }

    /**
     * @hidden
     */
    public setHeight(): void {
        let mHdrHeight: number = 0;
        let content: HTMLElement = (<HTMLElement>this.parent.element.querySelector('.e-content'));
        if (this.parent.options.frozenRows && this.parent.options.height !== 'auto') {
            let tbody: HTMLElement = (this.parent.element.querySelector('.e-headercontent').querySelector('tbody') as HTMLElement);
            mHdrHeight = tbody ? tbody.offsetHeight : 0;
            content.style.height = formatUnit((parseInt(this.parent.options.height) - mHdrHeight));
        }
    }
    /**
     * @hidden
     */
    public setPadding(): void {
        if (this.parent.options.height == "auto") { return; }
        let content: HTMLElement = <HTMLElement>this.parent.element.querySelector('.e-gridheader');
        let scrollWidth: number = Scroll.getScrollBarWidth() - this.getThreshold();
        let cssProps: ScrollCss = this.getCssProperties();
        content.style[cssProps.padding] = scrollWidth > 0 ? scrollWidth + 'px' : '0px';
        (<HTMLElement>content.querySelector('.e-headercontent')).style[cssProps.border] = scrollWidth > 0 ? '1px' : '0px';
        let footer: HTMLElement = this.parent.element.querySelector('.e-gridfooter');
        if (footer) {
            let footerContent: HTMLElement = footer.querySelector('.e-summarycontent');
            footerContent.style[cssProps.border] = scrollWidth > 0 ? '1px' : '0px';
            footer.style[cssProps.padding] = scrollWidth > 0 ? scrollWidth + 'px' : '0px';
        }
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
    }
    /**
     * Refresh makes the Grid adoptable with the height of parent container.
     *  
     * > The [`height`](grid/#height/) must be set to 100%. 
     * @return
     */
    public refresh(): void {
        if (this.parent.options.height !== '100%') {
            return;
        }

        let content: HTMLElement = <HTMLElement>this.parent.element.querySelector(".e-gridcontent");
        let height: number = getSiblingsHeight(content);
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
        this.wireEvents();
        // this.parent.on(onEmpty, this.wireEvents, this);
        // this.parent.on(contentReady, this.wireEvents, this);
        // this.parent.on(uiUpdate, this.onPropertyChanged, this);
        // this.parent.on(textWrapRefresh, this.wireEvents, this);
        // this.parent.on(headerRefreshed, this.setScrollLeft, this);
    }

    // private setScrollLeft(): void {
    //     if (this.parent.options.frozenColumns) {
    //         (<HTMLElement>(<SfGrid>this.parent).headerModule.getMovableHeader()).scrollLeft = this.previousValues.left;
    //     }
    // }

    private onContentScroll(scrollTarget: HTMLElement): Function {
        let element: HTMLElement = scrollTarget;
        let isHeader: boolean = element.classList.contains('e-headercontent');
        return (e: Event) => {
            if (this.content.querySelector('tbody') === null) {
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
            let footer: HTMLElement = this.parent.options.frozenColumns != 0 ? this.parent.element.querySelector('.e-movablefootercontent') :
              this.parent.element.querySelector('.e-summarycontent');
            if (footer) {
                footer.scrollLeft = left;
            }
            if (isFooter) { this.header.scrollLeft = left; }
            this.previousValues.left = left;
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
                mHdr = this.parent.options.frozenColumns ?
                    this.parent.getHeaderContent().querySelector('.e-movableheader') :
                    this.parent.getHeaderContent().querySelector('.e-headercontent') as Element;
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
                if (this.previousValues.top === top && (top < 0 || (cont.scrollHeight - cont.clientHeight) < top)
                    || (top < 0 || (cont.scrollHeight - cont.clientHeight) < top)) {
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
            let frzCols: number = this.parent.options.frozenColumns;
            this.content = <HTMLDivElement>this.parent.getContent();
            this.header = <HTMLDivElement>this.parent.getHeaderContent();
            let mCont: HTMLElement = this.content.querySelector('.e-movablecontent') as HTMLElement;
            let fCont: HTMLElement = this.content.querySelector('.e-frozencontent') as HTMLElement;
            let mHdr: HTMLElement = this.header.querySelector('.e-movableheader') as HTMLElement;
            if (this.parent.options.frozenColumns) {
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
            if (this.parent.options.aggregatesCount) {
                let footer: HTMLElement = this.parent.options.frozenColumns ? this.parent.element.querySelector('.e-movablefootercontent') :
                    this.parent.element.querySelector('.e-summarycontent');
                if (!isNullOrUndefined(footer)) {
                    EventHandler.add(footer, 'scroll', this.onContentScroll(this.content), this);
                }
            }
            this.refresh();
            this.oneTimeReady = false;
        }
        let table: Element = this.parent.getContent().querySelector(".e-table");
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
                if (!this.parent.options.enableVirtualization) {
                    if (sHeight < clientHeight) {
                        addClass(table.querySelectorAll('tr:last-child td'), 'e-lastrowcell');
                        if (this.parent.options.frozenColumns) {
                            addClass(
                                this.parent.getContent().querySelector('.e-movablecontent').querySelectorAll('tr:last-child td'),
                                'e-lastrowcell'
                            );
                        }
                    }
                    if ((this.parent.options.frozenColumns > 0 || this.parent.options.frozenColumns > 0) && this.header.querySelector('.e-movableheader')) {
                        this.header.querySelector('.e-movableheader').scrollLeft = this.previousValues.left;
                    } else {
                        this.header.scrollLeft = this.previousValues.left;
                    }
                    this.content.scrollLeft = this.previousValues.left;
                    this.content.scrollTop = this.previousValues.top;
                }
                if (!this.parent.options.enableColumnVirtualization) {
                    this.content.scrollLeft = sLeft;
                }
                if (this.parent.options.frozenColumns && this.header.querySelector('.e-movableheader')) {
                    (this.header.querySelector('.e-movableheader') as HTMLElement).scrollLeft =
                        (this.content.querySelector('.e-movablecontent') as HTMLElement).scrollLeft;
                }
            },
        );
    }

    /** 
     * @hidden
     */
    public getCssProperties(rtl?: boolean): ScrollCss {
        let css: ScrollCss = {};
        let enableRtl: boolean = isNullOrUndefined(rtl) ? this.parent.options.enableRtl : rtl;
        css.border = enableRtl ? 'borderLeftWidth' : 'borderRightWidth';
        css.padding = enableRtl ? 'paddingLeft' : 'paddingRight';
        return css;
    }

    /**
     * @hidden
     */
    public destroy(): void {
        let gridElement: Element = this.parent.element;
        if (!gridElement || (!gridElement.querySelector('.e-gridheader') && !gridElement.querySelector('.e-gridcontent'))) { return; }

        //Remove padding
        this.removePadding();

        //Remove Dom event
        EventHandler.remove(<HTMLDivElement>this.parent.getContent(), 'scroll', this.onContentScroll);
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
