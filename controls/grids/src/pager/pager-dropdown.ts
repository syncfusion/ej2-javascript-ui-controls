import { createElement, remove, isBlazor } from '@syncfusion/ej2-base';
import { Pager } from './pager';
import { DropDownList, ChangeEventArgs } from '@syncfusion/ej2-dropdowns';

/**
 * IPager interface
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
     * @hidden
     */
    constructor(pagerModule?: Pager) {
        this.pagerModule = pagerModule;
    }

    /**
     * For internal use only - Get the module name. 
     * @private
     * @hidden
     */
    protected getModuleName(): string {
        return 'pagerdropdown';
    }

    /**
     * The function is used to render pager dropdown
     * @hidden
     */
    public render(): void {
        let pagerObj: Pager = this.pagerModule;
        this.pagerDropDownDiv = createElement('div', { className: 'e-pagesizes' });
        let dropDownDiv: Element = createElement('div', { className: 'e-pagerdropdown' });
        let defaultTextDiv: Element = createElement('div', { className: 'e-pagerconstant' });
        let input: HTMLElement = createElement('input', { attrs: { type: 'text', tabindex: '1' } });
        this.pagerCons = createElement('span', { className: 'e-constant', innerHTML: isBlazor() ?
        this.pagerModule.getLocalizedLabel('PagerDropDown') :
        this.pagerModule.getLocalizedLabel('pagerDropDown') });
        dropDownDiv.appendChild(input);
        defaultTextDiv.appendChild(this.pagerCons);
        this.pagerDropDownDiv.appendChild(dropDownDiv);
        this.pagerDropDownDiv.appendChild(defaultTextDiv);
        this.pagerModule.element.appendChild(this.pagerDropDownDiv);
        let pageSizesModule: boolean | (number | string)[] = this.pagerModule.pageSizes;
        let pageSizesArray: string[] = ((<string[]>pageSizesModule).length ? this.convertValue(pageSizesModule as string[]) :
            [this.pagerModule.getLocalizedLabel('All'), '5', '10', '12', '20']) as string[];
        let defaultValue: Number | String = this.pagerModule.pageSize;
        this.dropDownListObject = new DropDownList({
            dataSource: pageSizesArray,
            value: defaultValue.toString() as string,
            change: this.onChange.bind(this),
            cssClass: 'e-alldrop'
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
     * @private
     * @hidden
     */
    private onChange(e: ChangeEventArgs): void {
        if (this.dropDownListObject.value === this.pagerModule.getLocalizedLabel('All')) {
            this.pagerModule.pageSize = this.pagerModule.totalRecordsCount;
            this.refresh();
            e.value = this.pagerModule.pageSize;
            if (document.getElementsByClassName('e-popup-open e-alldrop').length) {
                (<HTMLElement>document.getElementsByClassName('e-popup-open e-alldrop')[0]).style.display = 'none';
            }
        } else {
            this.pagerModule.pageSize = parseInt(this.dropDownListObject.value as string, 10);
            if (this.pagerCons.innerHTML !== this.pagerModule.getLocalizedLabel('pagerDropDown')) {
                this.refresh();
            }
        }
        this.pagerModule.dataBind();
        this.pagerModule.trigger('dropDownChanged', { pageSize: parseInt(this.dropDownListObject.value as string, 10) });
    }
    public refresh(): void {
        if (this.pagerModule.pageSize === this.pagerModule.totalRecordsCount) {
            this.pagerCons.innerHTML = isBlazor() ? this.pagerModule.getLocalizedLabel('PagerAllDropDown') :
                this.pagerModule.getLocalizedLabel('pagerAllDropDown');
        } else {
            this.pagerCons.innerHTML = isBlazor() ? this.pagerModule.getLocalizedLabel('PagerDropDown') :
                this.pagerModule.getLocalizedLabel('pagerDropDown');
        }
    }

    private beforeValueChange(prop: IPager): void {
        if (typeof prop.newProp.value === 'number') {
            let val: string = prop.newProp.value.toString();
            prop.newProp.value = val;
        }
    }
    private convertValue(pageSizeValue: (number | string)[]): (number | string)[] {
        let item: (number | string)[] = pageSizeValue;
        for (let i: number = 0; i < item.length; i++) {
            item[i] = typeof item[i] === 'number' ? item[i].toString() : item[i];
        }
        return item as string[];
    }

    public setDropDownValue(prop: string, value: string | number | Object | boolean): void {
        if (this.dropDownListObject) {
            this.dropDownListObject[prop] = value;
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
     * @method destroy
     * @return {void} 
     * @hidden 
     */
    public destroy(args?: { requestType: string }): void {
        if (this.dropDownListObject && !this.dropDownListObject.isDestroyed) {
            this.removeEventListener();
            this.dropDownListObject.destroy();
            remove(this.pagerDropDownDiv);
        }
    }
}