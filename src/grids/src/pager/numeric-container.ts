import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { EventHandler } from '@syncfusion/ej2-base';
import { createElement, classList, append } from '@syncfusion/ej2-base';
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
                attrs: { role: 'link', tabindex: '-1', 'aria-label': 'Goto Page ' + i,
                    href: 'javascript:void(0);' , name: 'Goto page' + i }
            });
            if (pagerObj.currentPage === i) {
                classList(link, ['e-currentitem', 'e-active'], ['e-pager-default']);
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
    }

    /**
     * Unbinding events from the element while component destroy
     *
     * @returns {void}
     * @hidden
     */
    public unwireEvents(): void {
        EventHandler.remove(this.pagerModule.element, 'click', this.clickHandler);
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
                    'aria-label': this.pagerModule.getLocalizedLabel('firstPageTooltip'),
                    tabindex: '-1'
                }
            });
        this.prev = createElement(
            'div', {
                className: 'e-prev e-icons e-icon-prev',
                attrs: {
                    title: this.pagerModule.getLocalizedLabel('previousPageTooltip'),
                    'aria-label': this.pagerModule.getLocalizedLabel('previousPageTooltip'),
                    tabindex: '-1'
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
                    title: this.pagerModule.getLocalizedLabel('previousPagerTooltip'), role: 'link',
                    'aria-label': this.pagerModule.getLocalizedLabel('previousPagerTooltip'),
                    tabindex: '-1',
                    name: this.pagerModule.getLocalizedLabel('previousPagerTooltip'),
                    href: 'javascript:void(0);'
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
                    title: this.pagerModule.getLocalizedLabel('nextPagerTooltip'), role: 'link',
                    'aria-label': this.pagerModule.getLocalizedLabel('nextPagerTooltip'),
                    tabindex: '-1',
                    name: this.pagerModule.getLocalizedLabel('nextPagerTooltip'),
                    href: 'javascript:void(0);'
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
                    'aria-label': this.pagerModule.getLocalizedLabel('nextPageTooltip'),
                    tabindex: '-1'
                }
            });
        this.last = createElement(
            'div', {
                className: 'e-last e-icons e-icon-last',
                attrs: {
                    title: this.pagerModule.getLocalizedLabel('lastPageTooltip'),
                    'aria-label': this.pagerModule.getLocalizedLabel('lastPageTooltip'),
                    tabindex: '-1'
                }
            });
        append([this.next, this.last], pagerContainer);
    }

    private clickHandler(e: Event): boolean {
        const pagerObj: Pager = this.pagerModule;
        const target: Element = <Element>e.target as Element;
        pagerObj.previousPageNo = pagerObj.currentPage;
        if (!target.classList.contains('e-disable') && !isNullOrUndefined(target.getAttribute('index'))) {
            pagerObj.currentPage = parseInt(target.getAttribute('index'), 10);
            pagerObj.dataBind();
        }
        return false;
    }

    private updateLinksHtml(): void {
        const pagerObj: Pager = this.pagerModule;
        let currentPageSet: number;
        let pageNo: number;
        pagerObj.currentPage = pagerObj.totalPages === 1 ? 1 : pagerObj.currentPage;
        if (pagerObj.currentPage > pagerObj.totalPages && pagerObj.totalPages) {
            pagerObj.currentPage = pagerObj.totalPages;
        }
        currentPageSet = parseInt((pagerObj.currentPage / pagerObj.pageCount).toString(), 10);
        if (pagerObj.currentPage % pagerObj.pageCount === 0 && currentPageSet > 0) {
            currentPageSet = currentPageSet - 1;
        }
        for (let i: number = 0; i < pagerObj.pageCount; i++) {
            pageNo = (currentPageSet * pagerObj.pageCount) + 1 + i;
            if (pageNo <= pagerObj.totalPages) {
                this.links[i].style.display = '';
                this.links[i].setAttribute('index', pageNo.toString());
                this.links[i].innerHTML = !pagerObj.customText ? pageNo.toString() : pagerObj.customText + pageNo;
                if (pagerObj.currentPage !== pageNo) {
                    this.links[i].classList.add('e-pager-default');
                } else {
                    this.links[i].classList.remove('e-pager-default');
                }
            } else {
                this.links[i].innerHTML = !pagerObj.customText ? pageNo.toString() : pagerObj.customText + pageNo;
                this.links[i].style.display = 'none';
            }
            classList(this.links[i], [], ['e-currentitem', 'e-active']);
        }
        this.first.setAttribute('index', '1');
        this.last.setAttribute('index', pagerObj.totalPages.toString());
        this.prev.setAttribute('index', (pagerObj.currentPage - 1).toString());
        this.next.setAttribute('index', (pagerObj.currentPage + 1).toString());
        this.pagerElement.querySelector('.e-mfirst').setAttribute('index', '1');
        this.pagerElement.querySelector('.e-mlast').setAttribute('index', pagerObj.totalPages.toString());
        this.pagerElement.querySelector('.e-mprev').setAttribute('index', (pagerObj.currentPage - 1).toString());
        this.pagerElement.querySelector('.e-mnext').setAttribute('index', (pagerObj.currentPage + 1).toString());
        this.PP.setAttribute('index', (parseInt(this.links[0].getAttribute('index'), 10) - pagerObj.pageCount).toString());
        this.NP.setAttribute('index', (parseInt(this.links[this.links.length - 1].getAttribute('index'), 10) + 1).toString());
    }

    private updateStyles(): void {
        this.updateFirstNPrevStyles();
        this.updatePrevPagerSetStyles();
        this.updateNextPagerSetStyles();
        this.updateNextNLastStyles();
        if (this.links.length) {
            classList(this.links[(this.pagerModule.currentPage - 1) % this.pagerModule.pageCount], ['e-currentitem', 'e-active'], []);
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
        if (this.pagerModule.currentPage > this.pagerModule.pageCount) {
            classList(this.PP, ['e-numericitem', 'e-pager-default'], ['e-nextprevitemdisabled', 'e-disable']);
        } else {
            classList(this.PP, ['e-nextprevitemdisabled', 'e-disable'], ['e-numericitem', 'e-pager-default']);
        }
    }

    private updateNextPagerSetStyles(): void {
        const pagerObj: Pager = this.pagerModule;
        const firstPage: string = this.links[0].innerHTML.replace(pagerObj.customText, '');
        if (!firstPage.length || !this.links.length || (parseInt(firstPage, 10) + pagerObj.pageCount > pagerObj.totalPages)) {
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
