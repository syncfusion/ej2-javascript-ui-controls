import { IGrid, EJ2Intance, IFilterMUI, IFilterCreate } from '../base/interface';
import { Column } from '../models/column';
import { FilterSettings } from '../base/grid';
import { PredicateModel } from '../base/grid-model';
import { AutoComplete } from '@syncfusion/ej2-dropdowns';
import { DataManager, Query, Deferred } from '@syncfusion/ej2-data';
import { Browser, isNullOrUndefined, extend, getValue } from '@syncfusion/ej2-base';
import { ServiceLocator } from '../services/service-locator';
import { Filter } from '../actions/filter';
import { Dialog, Popup } from '@syncfusion/ej2-popups';
import { getZIndexCalcualtion, eventPromise } from '../base/util';
import * as events from '../base/constant';
import { FilterStateObj } from '../common/filter-interface';

/**
 * `string filterui` render string column.
 * @hidden
 */

export class StringFilterUI implements IFilterMUI {

    private parent: IGrid;
    protected serLocator: ServiceLocator;
    private instance: HTMLElement;
    private value: string;
    public actObj: AutoComplete;
    private filterSettings: FilterSettings;
    private filter: Filter;
    private dialogObj: Dialog;
    constructor(parent?: IGrid, serviceLocator?: ServiceLocator, filterSettings?: FilterSettings) {
        this.parent = parent;
        this.serLocator = serviceLocator;
        this.filterSettings = filterSettings;
    }
    public create(args: IFilterCreate): void {
        let data: DataManager | Object[];
        let floptr: 'Contains' | 'StartsWith' | 'EndsWith';
        this.instance = this.parent.createElement('input', { className: 'e-flmenu-input', id: 'strui-' + args.column.uid });
        args.target.appendChild(this.instance);
        this.dialogObj = args.dialogObj;
        this.actObj = this.getAutoCompleteOptions(args);
        this.actObj.appendTo(this.instance);
    }

    private getAutoCompleteOptions(args: IFilterCreate): AutoComplete {
        let isForeignColumn: boolean = args.column.isForeignColumn();
        let dataSource: Object = isForeignColumn ? args.column.dataSource : this.parent.dataSource;
        let fields: Object = { value: isForeignColumn ? args.column.foreignKeyValue : args.column.field };
        let autoComplete: AutoComplete = new AutoComplete(extend(
        {
            dataSource: dataSource instanceof DataManager ? dataSource : new DataManager(dataSource),
            fields: fields,
            locale: this.parent.locale,
            enableRtl: this.parent.enableRtl,
            query: this.parent.query.clone(),
            sortOrder: 'Ascending',
            open: this.openPopup.bind(this),
            cssClass: 'e-popup-flmenu',
            focus: () => {
                this.actObj.filterType = args.getOptrInstance.getFlOperator() as 'StartsWith' | 'Contains' | 'EndsWith';
            },
            autofill: true,
            placeholder: args.localizeText.getConstant('EnterValue'),
            actionComplete: (e: { result: { [key: string]: Object; }[] }) => {
                e.result = e.result.filter((obj: { [key: string]: Object; }, index: number, arr: { [key: string]: Object; }[]) => {
                    return arr.map((mapObj: Object) => {
                        return (getValue(this.actObj.fields.value, mapObj));
                    }).indexOf(getValue((this.actObj.fields.value), obj)) === index;
                });
            }
        },
        args.column.filter.params
        ));
        if (dataSource && 'result' in dataSource) {
            let query: Query = this.parent.getQuery ? this.parent.getQuery().clone() : new Query();
            let defObj: FilterStateObj = eventPromise({ requestType: 'stringfilterrequest' }, query);
            this.parent.trigger(events.dataStateChange, defObj.state);
            let def: Deferred = defObj.deffered;
            def.promise.then((e: Object[]) => {
                autoComplete.dataSource = new DataManager(e);
            });
        }
        return autoComplete;
    }


    public write(args: { column: Column, target: Element, parent: IGrid, filteredValue: number | string | Date | boolean }): void {
        let columns: PredicateModel[] = this.filterSettings.columns;
        if (args.filteredValue !== '' && !isNullOrUndefined(args.filteredValue)) {
            let struiObj: AutoComplete = (<EJ2Intance>document.querySelector('#strui-' + args.column.uid)).ej2_instances[0];
            struiObj.value = args.filteredValue as string;
        }
    }

    public read(element: Element, column: Column, filterOptr: string, filterObj: Filter): void {
        let actuiObj: AutoComplete = (<EJ2Intance>document.querySelector('#strui-' + column.uid)).ej2_instances[0];
        if (Browser.isDevice) {
            actuiObj.hidePopup();
            actuiObj.focusOut();
        }
        let filterValue: string | number | Date | boolean = actuiObj.value;
        if (isNullOrUndefined(filterValue) || filterValue === '') {
            filterValue = null;
        }
        filterObj.filterByColumn(column.field, filterOptr, filterValue, 'and', this.parent.filterSettings.enableCaseSensitivity);
    }

    private openPopup(args: { popup: Popup }): void {
        getZIndexCalcualtion(args, this.dialogObj);
    }

}