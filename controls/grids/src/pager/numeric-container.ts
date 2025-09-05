import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { EventHandler } from '@syncfusion/ej2-base';
import { attributes, createElement, classList, append } from '@syncfusion/ej2-base';
import { Pager, IRender } from './pager';

/**
 * `NumericContainer` module handles rendering and refreshing numeric container.
 */
export class NumericContainer implements IRender {
    //Internal variables
    private element: Element;
    private first: Element;
    private prev: Element;
    private PP: Element;
    private NP: Element;
    private next: Element;
    private last: Element;
    private links: HTMLElement[];
    private pagerElement: Element;
    private target: Element;

    //Module declarations
    private pagerModule: Pager;

    /**
     * Constructor for numericContainer module
     *
     * @param {Pager} pagerModule - specifies the pagerModule
     * @hidden
     */
    constructor(pagerModule?: Pager) {
        this.pagerModule = pagerModule;
    }

    /**
     * The function is used to render numericContainer
     *
     * @returns {void}
     * @hidden
     */
    public render(): void {
        this.pagerElement = this.pagerModule.element;
        this.renderNumericContainer();
        this.refreshNumericLinks();
        this.wireEvents();
    }

    /**
     * Refreshes the numeric container of Pager.
     *
     * @returns {void}
     */
    public refresh(): void {
        this.pagerModule.updateTotalPages();
        if (this.links.length) {
            this.updateLinksHtml();
        }
        this.refreshAriaAttrLabel();
        this.updateStyles();
    }

    /**
     * The function is used to refresh refreshNumericLinks
     *
     * @returns {void}
     * @hidden
     */
    public refreshNumericLinks(): void {
        let link: HTMLElement;
        const pagerObj: Pager = this.pagerModule;
        const div: Element = pagerObj.element.querySelector('.e-numericcontainer');
        const frag: DocumentFragment = document.createDocumentFragment();
        div.innerHTML = '';
        for (let i: number = 1; i <= pagerObj.pageCount; i++) {
            link = createElement('a', {
                className: 'e-link e-numericitem e-spacing e-pager-default',
                attrs: { tabindex: '-1', 'aria-label': pagerObj.getLocalizedLabel('Page') + i + pagerObj.getLocalizedLabel('Of') +
                    pagerObj.totalPages + pagerObj.getLocalizedLabel('Pages'), href: '#' }
            });
            if (pagerObj.currentPage === i) {
                classList(link, ['e-currentitem', 'e-active'], ['e-pager-default']);
                link.setAttribute('aria-current', 'page');
            }
            frag.appendChild(link);
        }
        div.appendChild(frag);
        this.links = [].slice.call((<HTMLElement>div).childNodes);
    }

    /**
     * Binding events to the element while component creation
     *
     * @returns {void}
     * @hidden
     */
    public wireEvents(): void {
        EventHandler.add(this.pagerElement, 'click', this.clickHandler, this);
        EventHandler.add(this.pagerElement, 'auxclick', this.auxiliaryClickHandler, this);
    }

    /**
     * Unbinding events from the element while component destroy
     *
     * @returns {void}
     * @hidden
     */
    public unwireEvents(): void {
        EventHandler.remove(this.pagerModule.element, 'click', this.clickHandler);
        EventHandler.remove(this.pagerModule.element, 'auxclick', this.auxiliaryClickHandler);
    }

    /**
     * To destroy the PagerMessage
     *
     * @function destroy
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        this.unwireEvents();
    }

    private refreshAriaAttrLabel(): void {
        const pagerObj: Pager = this.pagerModule;
        const numericContainer: Element = pagerObj.element.querySelector('.e-numericcontainer');
        const links: NodeList = numericContainer.querySelectorAll('a');
        for (let i: number = 0; i < links.length; i++) {
            if ((<Element>links[parseInt(i.toString(), 10)]).hasAttribute('aria-label') && (<Element>links[parseInt(i.toString(), 10)]).hasAttribute('data-index')) {
                (<Element>links[parseInt(i.toString(), 10)]).setAttribute('aria-label', pagerObj.getLocalizedLabel('Page') + (<Element>links[parseInt(i.toString(), 10)]).getAttribute('data-index')
                    + pagerObj.getLocalizedLabel('Of') + pagerObj.totalPages + pagerObj.getLocalizedLabel('Pages'));
            }
        }
    }

    private renderNumericContainer(): void {
        this.element = createElement('div', {
            className: 'e-pagercontainer', attrs: { 'role': 'navigation' }
        });
        this.renderFirstNPrev(this.element);
        this.renderPrevPagerSet(this.element);
        this.element.appendChild(createElement('div', { className: 'e-numericcontainer' }));
        this.renderNextPagerSet(this.element);
        this.renderNextNLast(this.element);
        this.pagerModule.element.appendChild(this.element);
    }

    private renderFirstNPrev(pagerContainer: Element): void {
        this.first = createElement(
            'div', {
                className: 'e-first e-icons e-icon-first',
                attrs: {
                    title: this.pagerModule.getLocalizedLabel('firstPageTooltip'),
                    tabindex: '-1', role: 'button'
                }
            });
        this.prev = createElement(
            'div', {
                className: 'e-prev e-icons e-icon-prev',
                attrs: {
                    title: this.pagerModule.getLocalizedLabel('previousPageTooltip'),
                    tabindex: '-1', role: 'button'
                }
            });
        append([this.first, this.prev], pagerContainer);
    }

    private renderPrevPagerSet(pagerContainer: Element): void {
        const prevPager: Element = createElement('div');
        this.PP = createElement(
            'a', {
                className: 'e-link e-pp e-spacing', innerHTML: '...',
                attrs: {
                    title: this.pagerModule.getLocalizedLabel('previousPagerTooltip'),
                    'aria-label': this.pagerModule.getLocalizedLabel('previousPagerTooltip'),
                    tabindex: '-1',
                    href: '#'
                }
            });
        prevPager.appendChild(this.PP);
        pagerContainer.appendChild(prevPager);
    }

    private renderNextPagerSet(pagerContainer: Element): void {
        const nextPager: Element = createElement('div');
        this.NP = createElement(
            'a', {
                className: 'e-link e-np e-spacing',
                innerHTML: '...', attrs: {
                    title: this.pagerModule.getLocalizedLabel('nextPagerTooltip'),
                    'aria-label': this.pagerModule.getLocalizedLabel('nextPagerTooltip'),
                    tabindex: '-1',
                    href: '#'
                }
            });
        nextPager.appendChild(this.NP);
        pagerContainer.appendChild(nextPager);
    }

    private renderNextNLast(pagerContainer: Element): void {
        this.next = createElement(
            'div', {
                className: 'e-next e-icons e-icon-next',
                attrs: {
                    title: this.pagerModule.getLocalizedLabel('nextPageTooltip'),
                    tabindex: '-1', role: 'button'
                }
            });
        this.last = createElement(
            'div', {
                className: 'e-last e-icons e-icon-last',
                attrs: {
                    title: this.pagerModule.getLocalizedLabel('lastPageTooltip'),
                    tabindex: '-1', role: 'button'
                }
            });
        append([this.next, this.last], pagerContainer);
    }

    private clickHandler(e: Event): boolean {
        const pagerObj: Pager = this.pagerModule;
        this.target = <Element>e.target as Element;
        if (this.target.classList.contains('e-numericitem')) {
            e.preventDefault();
        }
        pagerObj.previousPageNo = pagerObj.currentPage;
        if (!this.target.classList.contains('e-disable') && !isNullOrUndefined(this.target.getAttribute('data-index'))) {
            pagerObj.currentPage = parseInt(this.target.getAttribute('data-index'), 10);
            this.pagerModule.isInteracted = true;
            pagerObj.dataBind();
        }
        return false;
    }

    private auxiliaryClickHandler(e: MouseEvent): void {
        this.target = <Element>e.target as Element;
        if (this.target.classList.contains('e-numericitem') && (e.button === 1)) {
            e.preventDefault();
        }
    }

    private updateLinksHtml(): void {
        const pagerObj: Pager = this.pagerModule;
        let currentPageSet: number;
        let isLastSet: boolean;
        let pageNo: number;
        let numItems: NodeListOf<HTMLElement> = this.pagerElement.querySelectorAll(
            '.e-numericitem:not(.e-hide):not([style*="display: none"]):not(.e-np):not(.e-pp)');
        pagerObj.currentPage = pagerObj.totalPages === 1 ? 1 : pagerObj.currentPage;
        if (pagerObj.currentPage > pagerObj.totalPages && pagerObj.totalPages) {
            pagerObj.currentPage = pagerObj.totalPages;
        }
        currentPageSet = parseInt((pagerObj.currentPage / pagerObj.pageCount).toString(), 10);
        if (pagerObj.currentPage % pagerObj.pageCount === 0 && currentPageSet > 0) {
            currentPageSet = currentPageSet - 1;
        }
        for (let i: number = 0; i < pagerObj.pageCount; i++) {
            if (pagerObj.isPagerResized) {
                const focusedItem: HTMLElement = this.pagerElement.querySelector('.e-focus');
                const focusedorTarget: Element = this.target ? this.target : focusedItem ? focusedItem : null;
                let prevFocused: boolean  = false;
                let nextFocused: boolean  = false;
                let firstFocused: boolean  = false;
                let lastFocused: boolean  = false;
                let numItemFocused: boolean  = false;
                let npFocused: boolean  = false;
                let ppFocused: boolean  = false;

                if (focusedorTarget) {
                    const classList: DOMTokenList = focusedorTarget.classList;
                    if (classList.contains('e-icons')) {
                        switch (true) {
                        case classList.contains('e-prev'):
                            prevFocused = true;
                            break;
                        case classList.contains('e-next'):
                            nextFocused = true;
                            break;
                        case classList.contains('e-first'):
                            firstFocused = true;
                            break;
                        case classList.contains('e-last'):
                            lastFocused = true;
                            break;
                        }
                    } else if (classList.contains('e-numericitem')) {
                        switch (true) {
                        case classList.contains('e-np'):
                            npFocused = true;
                            break;
                        case classList.contains('e-pp'):
                            ppFocused = true;
                            break;
                        default:
                            numItemFocused = classList.contains('e-numericitem');
                            break;
                        }
                    }
                }
                isLastSet = lastFocused || (this.pagerModule.keyAction === 'End');
                numItems = this.pagerElement.querySelectorAll(
                    '.e-numericitem:not(.e-hide):not([style*="display: none"]):not(.e-np):not(.e-pp)');
                const isPageAvailable: boolean = Array.from(numItems).some((item: HTMLElement) => parseInt(item.getAttribute('data-index'), 10) === pagerObj.currentPage);

                //Setting pageNo to render based on key action or click action.
                if (firstFocused || this.pagerModule.keyAction === 'Home') {
                    pageNo = 1 + i;
                } else if (lastFocused || this.pagerModule.keyAction === 'End') {
                    pageNo = (currentPageSet * pagerObj.pageCount) + 1 + i;
                } else if (nextFocused || this.pagerModule.keyAction === 'ArrowRight' || prevFocused || this.pagerModule.keyAction === 'ArrowLeft') {
                    if (isPageAvailable) {
                        pageNo = parseInt(numItems[0].getAttribute('data-index'), 10) + i;
                    } else if (prevFocused || this.pagerModule.keyAction === 'ArrowLeft') {
                        pageNo = parseInt(this.PP.getAttribute('data-index'), 10) + i;
                    } else {
                        pageNo = pagerObj.currentPage + i;
                    }
                } else if (npFocused || ppFocused) {
                    pageNo = pagerObj.currentPage + i;
                } else if (numItemFocused) {
                    pageNo = (parseInt(numItems[0].getAttribute('data-index'), 10) + i);
                } else {
                    pageNo = (currentPageSet * pagerObj.pageCount) + 1 + i;
                }
            }
            else {
                pageNo = (currentPageSet * pagerObj.pageCount) + 1 + i;
            }

            if (pageNo <= pagerObj.totalPages) {
                this.links[parseInt(i.toString(), 10)].classList.remove('e-hide');
                this.links[parseInt(i.toString(), 10)].style.display = '';
                this.links[parseInt(i.toString(), 10)].setAttribute('data-index', pageNo.toString());
                this.links[parseInt(i.toString(), 10)].innerHTML = !pagerObj.customText ? pageNo.toString() : pagerObj.customText + pageNo;
                if (pagerObj.currentPage !== pageNo) {
                    this.links[parseInt(i.toString(), 10)].classList.add('e-pager-default');
                } else {
                    this.links[parseInt(i.toString(), 10)].classList.remove('e-pager-default');
                }
            } else {
                this.links[parseInt(i.toString(), 10)].innerHTML = !pagerObj.customText ? pageNo.toString() : pagerObj.customText + pageNo;
                this.links[parseInt(i.toString(), 10)].style.display = 'none';
            }
            classList(this.links[parseInt(i.toString(), 10)], [], ['e-currentitem', 'e-active']);
            this.links[parseInt(i.toString(), 10)].removeAttribute('aria-current');
        }
        attributes(this.first, {
            'data-index': '1',
            'title': this.pagerModule.getLocalizedLabel('firstPageTooltip')
        });
        attributes(this.pagerElement.querySelector('.e-mfirst'), {
            'data-index': '1',
            'title': this.pagerModule.getLocalizedLabel('firstPageTooltip')
        });
        attributes(this.last, {
            'data-index': pagerObj.totalPages.toString(),
            'title': this.pagerModule.getLocalizedLabel('lastPageTooltip')
        });
        attributes(this.pagerElement.querySelector('.e-mlast'), {
            'data-index': pagerObj.totalPages.toString(),
            'title': this.pagerModule.getLocalizedLabel('lastPageTooltip')
        });
        attributes(this.prev, {
            'data-index': (pagerObj.currentPage - 1).toString(),
            'title': this.pagerModule.getLocalizedLabel('previousPageTooltip')
        });
        attributes(this.pagerElement.querySelector('.e-mprev'), {
            'data-index': (pagerObj.currentPage - 1).toString(),
            'title': this.pagerModule.getLocalizedLabel('previousPageTooltip')
        });
        attributes(this.next, {
            'data-index': (pagerObj.currentPage + 1).toString(),
            'title': this.pagerModule.getLocalizedLabel('nextPageTooltip')
        });
        attributes(this.pagerElement.querySelector('.e-mnext'), {
            'data-index': (pagerObj.currentPage + 1).toString(),
            'title': this.pagerModule.getLocalizedLabel('nextPageTooltip')
        });
        const ppIndex: number = (this.pagerModule.isPagerResized && numItems.length)
            ? isLastSet
                ? parseInt(numItems[0].getAttribute('data-index'), 10) - pagerObj.avgNumItems
                : parseInt(numItems[0].getAttribute('data-index'), 10) - numItems.length
            : parseInt(this.links[0].getAttribute('data-index'), 10) - pagerObj.pageCount;
        attributes(this.PP, {
            'data-index': ((ppIndex < 1) ? '1' : ppIndex.toString()),
            'title': this.pagerModule.getLocalizedLabel('previousPagerTooltip'),
            'aria-label': this.pagerModule.getLocalizedLabel('previousPagerTooltip')
        });
        const NPIndex: number = (this.pagerModule.isPagerResized && numItems.length)
            ? parseInt(numItems[numItems.length - 1].getAttribute('data-index'), 10)
            : parseInt(this.links[this.links.length - 1].getAttribute('data-index'), 10);
        attributes(this.NP, {
            'data-index': (NPIndex + 1).toString(),
            'title': this.pagerModule.getLocalizedLabel('nextPagerTooltip'),
            'aria-label': this.pagerModule.getLocalizedLabel('nextPagerTooltip')
        });
        this.target = undefined;
    }

    private updateStyles(): void {
        this.updateFirstNPrevStyles();
        this.updatePrevPagerSetStyles();
        this.updateNextPagerSetStyles();
        this.updateNextNLastStyles();
        if (this.links.length) {
            const currentPageIndex: number = this.links.findIndex((link: HTMLElement) => link.getAttribute('data-index') === this.pagerModule.currentPage.toString());
            const currentPage: number = (this.pagerModule.isPagerResized && currentPageIndex !== -1) ? currentPageIndex
                : ((this.pagerModule.currentPage - 1) % this.pagerModule.pageCount);
            if (this.links[parseInt(currentPage.toString(), 10)]) {
                classList(this.links[parseInt(currentPage.toString(), 10)], ['e-currentitem', 'e-active'], []);
                this.links[parseInt(currentPage.toString(), 10)].setAttribute('aria-current', 'page');
            }
        }
    }

    private updateFirstNPrevStyles(): void {
        const firstPage: string[] = ['e-firstpage', 'e-pager-default'];
        const firstPageDisabled: string[] = ['e-firstpagedisabled', 'e-disable'];
        const prevPage: string[] = ['e-prevpage', 'e-pager-default'];
        const prevPageDisabled: string[] = ['e-prevpagedisabled', 'e-disable'];
        if (this.pagerModule.totalPages > 0 && this.pagerModule.currentPage > 1) {
            classList(this.prev, prevPage, prevPageDisabled);
            classList(this.first, firstPage, firstPageDisabled);
            classList(this.pagerElement.querySelector('.e-mfirst'), firstPage, firstPageDisabled);
            classList(this.pagerElement.querySelector('.e-mprev'), prevPage, prevPageDisabled);
        } else {
            classList(this.prev, prevPageDisabled, prevPage);
            classList(this.first, firstPageDisabled, firstPage);
            classList(this.pagerElement.querySelector('.e-mprev'), prevPageDisabled, prevPage);
            classList(this.pagerElement.querySelector('.e-mfirst'), firstPageDisabled, firstPage);
        }
    }

    private updatePrevPagerSetStyles(): void {
        if (this.pagerModule.currentPage > this.pagerModule.pageCount || (this.pagerModule.isPagerResized
            && this.links.findIndex((link: HTMLElement) => parseInt(link.getAttribute('data-index'), 10) === 1))) {
            classList(this.PP, ['e-numericitem', 'e-pager-default'], ['e-nextprevitemdisabled', 'e-disable']);
        } else {
            classList(this.PP, ['e-nextprevitemdisabled', 'e-disable'], ['e-numericitem', 'e-pager-default']);
        }
    }

    private updateNextPagerSetStyles(): void {
        const pagerObj: Pager = this.pagerModule;
        const firstPage: string = this.links[0].innerHTML.replace(pagerObj.customText, '');
        const numItems: NodeListOf<HTMLElement> = this.pagerElement.querySelectorAll('.e-numericitem:not(.e-hide):not([style*="display: none"]):not(.e-np):not(.e-pp)');
        if (!firstPage.length || !this.links.length || (parseInt(firstPage, 10) + pagerObj.pageCount > pagerObj.totalPages)
         || (pagerObj.isPagerResized && Array.from(numItems).some((item: HTMLElement) => parseInt(item.getAttribute('data-index'), 10) === pagerObj.totalPages))) {
            classList(this.NP, ['e-nextprevitemdisabled', 'e-disable'], ['e-numericitem', 'e-pager-default']);
        } else {
            classList(this.NP, ['e-numericitem', 'e-pager-default'], ['e-nextprevitemdisabled', 'e-disable']);
        }
    }

    private updateNextNLastStyles(): void {
        const lastPage: string[] = ['e-lastpage', 'e-pager-default'];
        const lastPageDisabled: string[] = ['e-lastpagedisabled', 'e-disable'];
        const nextPage: string[] = ['e-nextpage', 'e-pager-default'];
        const nextPageDisabled: string[] = ['e-nextpagedisabled', 'e-disable'];
        const pagerObj: Pager = this.pagerModule;
        if (pagerObj.currentPage === pagerObj.totalPages || pagerObj.totalRecordsCount === 0) {
            classList(this.last, lastPageDisabled, lastPage);
            classList(this.next, nextPageDisabled, nextPage);
            classList(this.pagerElement.querySelector('.e-mlast'), lastPageDisabled, lastPage);
            classList(this.pagerElement.querySelector('.e-mnext'), nextPageDisabled, nextPage);
        } else {
            classList(this.last, lastPage, lastPageDisabled);
            classList(this.next, nextPage, nextPageDisabled);
            classList(this.pagerElement.querySelector('.e-mlast'), lastPage, lastPageDisabled);
            classList(this.pagerElement.querySelector('.e-mnext'), nextPage, nextPageDisabled);
        }
    }
}
