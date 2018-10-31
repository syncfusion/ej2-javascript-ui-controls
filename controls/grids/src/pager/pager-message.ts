import { createElement, append } from '@syncfusion/ej2-base';
import { Pager, IRender } from './pager';

/**
 * `PagerMessage` module is used to display pager information.
 */
export class PagerMessage implements IRender {
    //Internal variables    
    private pageNoMsgElem: HTMLElement;
    private pageCountMsgElem: HTMLElement;


    //Module declarations
    private pagerModule: Pager;

    /**
     * Constructor for externalMessage module
     * @hidden
     */
    constructor(pagerModule?: Pager) {
        this.pagerModule = pagerModule;
    }

    /**
     * The function is used to render pager message
     * @hidden
     */
    public render(): void {
        let div: Element = createElement('div', { className: 'e-parentmsgbar', attrs: { 'aria-label': 'Pager Information' } });
        this.pageNoMsgElem = createElement('span', { className: 'e-pagenomsg', styles: 'textalign:right' });
        this.pageCountMsgElem = createElement('span', { className: 'e-pagecountmsg', styles: 'textalign:right' });
        append([this.pageNoMsgElem, this.pageCountMsgElem], div);
        this.pagerModule.element.appendChild(div);
        this.refresh();
    }

    /**
     * Refreshes the pager information. 
     */
    public refresh(): void {
        let pagerObj: Pager = this.pagerModule;
        this.pageNoMsgElem.textContent = this.format(pagerObj.getLocalizedLabel('currentPageInfo'), [pagerObj.totalRecordsCount === 0 ? 0 :
            pagerObj.currentPage, pagerObj.totalPages || 0]) + ' ';
        this.pageCountMsgElem.textContent = this.format(pagerObj.getLocalizedLabel('totalItemsInfo'), [pagerObj.totalRecordsCount || 0]);
        this.pageNoMsgElem.parentElement.setAttribute('aria-label', this.pageNoMsgElem.textContent + this.pageCountMsgElem.textContent);

    }

    /**
     * Hides the Pager information.
     */
    public hideMessage(): void {
        if (this.pageNoMsgElem) {
            this.pageNoMsgElem.style.display = 'none';
        }
        if (this.pageCountMsgElem) {
            this.pageCountMsgElem.style.display = 'none';
        }
    }

    /**
     * Shows the Pager information. 
     */
    public showMessage(): void {
        if (!this.pageNoMsgElem) {
            this.render();
        }
        this.pageNoMsgElem.style.display = '';
        this.pageCountMsgElem.style.display = '';

    }

    /**
     * To destroy the PagerMessage
     * @method destroy
     * @return {void}  
     * @hidden
     */
    public destroy(): void {
        //destroy
    }

    private format(str: string, args: number[]): string {
        let regx: RegExp;
        for (let i: number = 0; i < args.length; i++) {
            regx = new RegExp('\\{' + (i) + '\\}', 'gm');
            str = str.replace(regx, args[i].toString());
        }
        return str;
    }
}