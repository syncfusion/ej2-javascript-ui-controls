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
     *
     * @param {Pager} pagerModule - specifies the pager Module
     * @hidden
     */
    constructor(pagerModule?: Pager) {
        this.pagerModule = pagerModule;
    }

    /**
     * The function is used to render pager message
     *
     * @returns {void}
     * @hidden
     */
    public render(): void {
        const div: Element = createElement('div', { className: 'e-parentmsgbar' });
        this.pageNoMsgElem = createElement('span', { className: 'e-pagenomsg' });
        this.pageNoMsgElem.style.textAlign = 'right';
        this.pageCountMsgElem = createElement('span', { className: 'e-pagecountmsg' });
        this.pageCountMsgElem.style.textAlign = 'right';
        append([this.pageNoMsgElem, this.pageCountMsgElem], div);
        this.pagerModule.element.appendChild(div);
        this.refresh();
    }

    /**
     * Refreshes the pager information.
     *
     * @returns {void}
     */
    public refresh(): void {
        const pagerObj: Pager = this.pagerModule;
        this.pageNoMsgElem.textContent = this.format(
            pagerObj.getLocalizedLabel('currentPageInfo'), [pagerObj.totalRecordsCount === 0 ? 0 :
                pagerObj.currentPage, pagerObj.totalPages || 0, pagerObj.totalRecordsCount || 0]) + ' ';
        this.pageCountMsgElem.textContent = this.format(
            pagerObj.getLocalizedLabel(pagerObj.totalRecordsCount <= 1 ? 'totalItemInfo' : 'totalItemsInfo'),
            [pagerObj.totalRecordsCount || 0, pagerObj.totalRecordsCount ? (pagerObj.pageSize * (pagerObj.currentPage - 1)) + 1 : 0,
                pagerObj.pageSize * pagerObj.currentPage > pagerObj.totalRecordsCount ? pagerObj.totalRecordsCount :
                    pagerObj.pageSize * pagerObj.currentPage]);
        this.pageNoMsgElem.parentElement.classList.remove('e-hide');
    }

    /**
     * Hides the Pager information.
     *
     * @returns {void}
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
     *
     * @returns {void}
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
     *
     * @function destroy
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        //destroy
    }

    /**
     * To format the PagerMessage
     *
     * @function format
     * @param {string} str - specifies the string
     * @param {number[]} args - specifies the argument
     * @returns {string} returns the format string
     * @hidden
     */
    public format(str: string, args: number[]): string {
        let regx: RegExp;
        const regExp: RegExpConstructor = RegExp;
        for (let i: number = 0; i < args.length; i++) {
            regx = new regExp('\\{' + (i) + '\\}', 'gm');
            if (this.isValidLocale(this.pagerModule.locale)) {
                str = str.replace(regx, args[parseInt(i.toString(), 10)].toLocaleString(this.pagerModule.locale));
            } else {
                str = str.replace(regx, args[parseInt(i.toString(), 10)].toString());
            }
        }
        return str;
    }

    private isValidLocale(locale: string): boolean {
        try {
            new Intl.NumberFormat(locale);
            return true;
        } catch (e) {
            return false;
        }
    }
}
