import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Column } from '../models/column';
import { FilterSettings } from '../base/grid';
import { PredicateModel } from '../base/grid-model';
import { IGrid } from '../base/interface';
import { ServiceLocator } from '../services/service-locator';
import { Query, DataManager } from '@syncfusion/ej2-data';
import { Dialog, Popup } from '@syncfusion/ej2-popups';
import * as events from '../base/constant';
import * as literals from '../base/string-literals';
import { toggleFilterUI } from '../base/util';

/**
 * `filter operators` render boolean column.
 *
 * @hidden
 */

export class FlMenuOptrUI {
    private parent: IGrid;
    private customFilterOperators: Object;
    private serviceLocator: ServiceLocator;
    private filterSettings: FilterSettings;
    public dropOptr: DropDownList;
    private customOptr: { [key: string]: Object }[];
    private optrData: Object;
    private dialogObj: Dialog;
    private ddOpen: Function = this.dropDownOpen.bind(this);

    constructor(parent?: IGrid, customFltrOperators?: Object, serviceLocator?: ServiceLocator, filterSettings?: FilterSettings) {
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        this.filterSettings = filterSettings;
        this.customFilterOperators = customFltrOperators;
        if (this.parent) {
            this.parent.on(events.filterMenuClose, this.destroyDropDownList, this);
            this.parent.on(events.destroy, this.destroyDropDownList, this);
        }
    }

    /**
     * @param {Element} dlgConetntEle - specifies the content element
     * @param {Element} target - specifies the target
     * @param {Column} column - specifies the column
     * @param {Dialog} dlgObj - specifies the dialog
     * @param {Object[]} operator - specifies the operator list
     * @returns {void}
     * @hidden
     */
    // eslint-disable-next-line max-len
    public renderOperatorUI(dlgConetntEle: Element, target: Element, column: Column, dlgObj: Dialog, operator?: { [key: string]: Object }[]): void {
        this.dialogObj = dlgObj;
        const optr: string = column.type + 'Operator';
        this.optrData = this.customOptr = !isNullOrUndefined(operator) ? operator :
            (!isNullOrUndefined(this.parent.filterSettings.operators) && !isNullOrUndefined(this.parent.filterSettings.operators[`${optr}`])) ?
                this.parent.filterSettings.operators[`${optr}`] : this.customFilterOperators[`${optr}`];
        const dropDatasource: { [key: string]: Object }[] = this.customOptr;
        const selectedValue: string = this.dropSelectedVal(column, optr);
        const optrDiv: HTMLElement = this.parent.createElement('div', { className: 'e-flm_optrdiv' });
        dlgConetntEle.appendChild(optrDiv);
        const optrInput: Element = this.parent.createElement('input', { id: column.uid + '-floptr' });
        optrDiv.appendChild(optrInput);
        this.dropOptr = new DropDownList({
            dataSource: dropDatasource,
            fields: { text: 'text', value: 'value' },
            cssClass: this.parent.cssClass ? 'e-popup-flmenu' + ' ' + this.parent.cssClass : 'e-popup-flmenu',
            enableRtl: this.parent.enableRtl,
            text: selectedValue,
            change: () => {
                const valInput: HTMLInputElement = document.querySelector('.e-flmenu-valuediv').querySelector('input');
                if (this.dropOptr.value === 'isempty' || this.dropOptr.value === 'isnotempty' ||
                    this.dropOptr.value === 'isnotnull' || this.dropOptr.value === 'isnull') {
                    if (!isNullOrUndefined(valInput['ej2_instances'])) {
                        valInput['ej2_instances'][0]['enabled'] = false ;
                    } else {
                        valInput.setAttribute('disabled', 'true');
                    }
                } else if (!isNullOrUndefined(valInput.getAttribute('disabled'))) {
                    if (!isNullOrUndefined(valInput['ej2_instances'])) {
                        valInput['ej2_instances'][0]['enabled'] = true ;
                    } else {
                        valInput.removeAttribute('disabled');
                    }
                }
                toggleFilterUI(this.dropOptr.value as string, column.uid, column, column.type, dlgObj, this.dropOptr['previousValue'] as string);
            }
        });
        this.dropOptr.addEventListener(literals['open'], this.ddOpen);
        this.dropOptr.appendTo('#' + column.uid + '-floptr');
    }

    private renderResponsiveDropDownList(args: { popup: Popup }): void {
        args.popup.element.style.width = '100%';
    }

    private dropDownOpen(args: { popup: Popup }): void {
        args.popup.element.style.zIndex = (this.dialogObj.zIndex + 1).toString();
        if (this.parent.enableAdaptiveUI) {
            this.renderResponsiveDropDownList(args);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private dropSelectedVal(col: Column, optr: string): string {
        let selValue: string = '';
        const columns: PredicateModel[] = this.parent.filterSettings.columns;
        for (const column of columns) {
            if (col.field === column.field || (col.isForeignColumn() && col.foreignKeyValue === column.field)) {
                const selectedField: Object = new DataManager(this.optrData).executeLocal(
                    new Query().where('value', 'equal', column.operator));
                selValue = !isNullOrUndefined(selectedField[0]) ? selectedField[0].text : '';
            }
        }
        if (selValue === '') {// rewuired or not
            if (col.filter.operator) {
                const optrLen: number = Object.keys(this.optrData).length;
                for (let i: number = 0; i < optrLen; i++) {
                    if (this.optrData[parseInt(i.toString(), 10)].value === col.filter.operator) {
                        selValue = this.optrData[parseInt(i.toString(), 10)].text;
                    }
                }
            } else {
                selValue = this.optrData[0].text;
            }

        }

        return selValue;
    }

    /**
     * @returns {string} returns the operator
     * @hidden
     */
    public getFlOperator(): string {
        return (this.dropOptr.value as string);
    }

    private destroyDropDownList(): void {
        if (this.dropOptr.isDestroyed) { return; }
        this.dropOptr.removeEventListener(literals['open'], this.ddOpen);
        this.dropOptr.destroy();
        this.parent.off(events.filterMenuClose, this.destroyDropDownList);
        this.parent.off(events.destroy, this.destroyDropDownList);
    }
}
