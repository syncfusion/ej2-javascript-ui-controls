import { createElement, remove } from '@syncfusion/ej2-base';
import { Pager } from './pager';
import { DropDownList, ChangeEventArgs } from '@syncfusion/ej2-dropdowns';

/**
 * IPager interface
 *
 * @hidden
 */
export interface IPager {
    newProp: {
        value: number | string | boolean
    };
}

/**
 * `PagerDropDown` module handles selected pageSize from DropDownList.
 */
export class PagerDropDown {
    //Internal variables
    private pagerCons: HTMLElement;
    private dropDownListObject: DropDownList;
    private pagerDropDownDiv: HTMLElement;
    //Module declarations
    private pagerModule: Pager;

    /**
     * Constructor for pager module
     *
     * @param {Pager} pagerModule - specifies the pagermodule
     * @hidden
     */
    constructor(pagerModule?: Pager) {
        this.pagerModule = pagerModule;
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {string} returns the module name
     * @private
     * @hidden
     */
    protected getModuleName(): string {
        return 'pagerdropdown';
    }

    /**
     * The function is used to render pager dropdown
     *
     * @returns {void}
     * @hidden
     */
    public render(): void {
        const pagerObj: Pager = this.pagerModule;
        this.pagerDropDownDiv = createElement('div', { className: 'e-pagesizes' });
        const dropDownDiv: Element = createElement('div', { className: 'e-pagerdropdown' });
        const defaultTextDiv: Element = createElement('div', { className: 'e-pagerconstant' });
        const input: HTMLElement = createElement('input', { attrs: { type: 'text', tabindex: '-1' } });
        this.pagerCons = createElement('span', {
            className: 'e-constant', innerHTML:
                this.pagerModule.getLocalizedLabel('pagerDropDown')
        });
        dropDownDiv.appendChild(input);
        defaultTextDiv.appendChild(this.pagerCons);
        this.pagerDropDownDiv.appendChild(dropDownDiv);
        this.pagerDropDownDiv.appendChild(defaultTextDiv);
        this.pagerModule.element.appendChild(this.pagerDropDownDiv);
        const pageSizesModule: boolean | (number | string)[] = this.pagerModule.pageSizes;
        const pageSizesArray: string[] = ((<string[]>pageSizesModule).length ? this.convertValue(pageSizesModule as string[]) :
            [this.pagerModule.getLocalizedLabel('All'), '5', '10', '12', '20']) as string[];
        const defaultValue: number | string = this.pagerModule.pageSize;
        this.dropDownListObject = new DropDownList({
            dataSource: pageSizesArray,
            value: defaultValue.toString() as string,
            change: this.onChange.bind(this),
            placeholder: this.pagerModule.getLocalizedLabel('pagerDropDown'),
            cssClass: this.pagerModule.cssClass ? 'e-alldrop' + ' ' + this.pagerModule.cssClass : 'e-alldrop'
        });
        this.dropDownListObject.appendTo(input);
        if ((<string[]>pageSizesModule).length) {
            (<HTMLInputElement>this.dropDownListObject.element).value = this.pagerModule.pageSize.toString();
        }
        pagerObj.pageSize = defaultValue as number;
        pagerObj.dataBind();
        pagerObj.trigger('dropDownChanged', { pageSize: defaultValue });
        this.addEventListener();
    }

    /**
     * For internal use only - Get the pagesize.
     *
     * @param {ChangeEventArgs} e - specifies the changeeventargs
     * @returns {void}
     * @private
     * @hidden
     */
    private onChange(e: ChangeEventArgs): void {
        if (this.dropDownListObject.value === this.pagerModule.getLocalizedLabel('All')) {
            this.pagerModule.pageSize = this.pagerModule.totalRecordsCount;
            this.pagerModule.isAllPage = true;
            this.refresh();
            e.value = this.pagerModule.pageSize;
            if (document.getElementsByClassName('e-popup-open e-alldrop').length) {
                (<HTMLElement>document.getElementsByClassName('e-popup-open e-alldrop')[0]).style.display = 'none';
            }
        } else {
            this.pagerModule.pageSize = parseInt(this.dropDownListObject.value as string, 10);
            this.pagerModule.isAllPage = false;
            if (this.pagerCons.innerHTML !== this.pagerModule.getLocalizedLabel('pagerDropDown')) {
                this.refresh();
            }
        }
        this.pagerModule.dataBind();
        if (!this.pagerModule.isCancel) {
            this.pagerModule.trigger('dropDownChanged', {
                pageSize: this.pagerModule.isAllPage ||
                    (this.pagerModule.isAllPage === undefined && this.dropDownListObject.value === this.pagerModule.getLocalizedLabel('All')) ?
                    this.pagerModule.totalRecordsCount : parseInt(this.dropDownListObject.value as string, 10)
            });
        }
    }

    public refresh(): void {
        if (this.pagerCons) {
            if (this.isPageSizeAll(this.pagerModule.pageSize)) {
                this.pagerCons.innerHTML = this.pagerModule.getLocalizedLabel('pagerAllDropDown');
                this.pagerCons.parentElement.classList.add('e-page-all');
            } else {
                this.pagerCons.innerHTML = this.pagerModule.getLocalizedLabel('pagerDropDown');
                this.pagerCons.parentElement.classList.remove('e-page-all');
            }
            this.pagerDropDownDiv.classList.remove('e-hide');
        }
    }

    private beforeValueChange(prop: IPager): void {
        if (typeof prop.newProp.value === 'number') {
            const val: string = prop.newProp.value.toString();
            prop.newProp.value = val;
        }
    }
    private convertValue(pageSizeValue: (number | string)[]): (number | string)[] {
        const item: (number | string)[] = pageSizeValue;
        for (let i: number = 0; i < item.length; i++) {
            item[parseInt(i.toString(), 10)] = parseInt(item[parseInt(i.toString(), 10)] as string, 10) ?
                item[parseInt(i.toString(), 10)].toString() : (this.pagerModule.getLocalizedLabel(item[parseInt(i.toString(), 10)] as string) !== '')
                    ? this.pagerModule.getLocalizedLabel(item[parseInt(i.toString(), 10)] as string) : item[parseInt(i.toString(), 10)];
        }
        return item as string[];
    }
    private isPageSizeAll(value: string | number): boolean {
        const pageSizeNum : string | number = typeof(value) === 'string' && value !== this.pagerModule.getLocalizedLabel('All') ?
            parseInt(value, 10) : value;
        if (pageSizeNum === this.pagerModule.totalRecordsCount || value === this.pagerModule.getLocalizedLabel('All')) {
            return true;
        }
        else {
            return false;
        }
    }

    public setDropDownValue(prop: string, value: string | number): void {
        if (this.dropDownListObject) {
            const isbeforeAll: boolean = this.pagerModule.isAllPage;
            this.pagerModule.isAllPage = this.isPageSizeAll(value);
            if (this.pagerModule.isAllPage && typeof this.pagerModule.pageSizes === 'object' &&
                this.pagerModule.pageSizes.indexOf('All') === -1) {
                this.pagerModule.isAllPage = false;
            }
            this.pagerModule.checkAll = (isbeforeAll && this.pagerModule.isAllPage) ? true : false;
            this.dropDownListObject[`${prop}`] = this.pagerModule.isAllPage ? this.pagerModule.getLocalizedLabel('All') : value;
        }
    }
    public addEventListener(): void {
        this.dropDownListObject.on('beforeValueChange', this.beforeValueChange, this);
    }
    public removeEventListener(): void {
        this.dropDownListObject.off('beforeValueChange', this.beforeValueChange);
    }

    /**
     * To destroy the Pagerdropdown
     *
     * @param {string} args - specifies the arguments
     * @param {string} args.requestType - specfies the request type
     * @returns {void}
     * @hidden
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public destroy(args?: { requestType: string }): void {
        if (this.dropDownListObject && !this.dropDownListObject.isDestroyed) {
            this.removeEventListener();
            this.dropDownListObject.destroy();
            if (this.pagerDropDownDiv && this.pagerDropDownDiv.parentNode) {
                remove(this.pagerDropDownDiv);
            }
        }
    }
}
