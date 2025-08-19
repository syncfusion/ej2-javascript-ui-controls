import { IGrid, EJ2Intance, IFilterMUI, IFilterCreate } from '../base/interface';
import { Column } from '../models/column';
import { FilterSettings } from '../base/grid';
import { AutoComplete, CheckBoxSelection, MultiSelect, DropDownList } from '@syncfusion/ej2-dropdowns';
import { DataManager, Query, Deferred, Predicate, DataUtil } from '@syncfusion/ej2-data';
import { Browser, isNullOrUndefined, extend, getValue } from '@syncfusion/ej2-base';
import { ServiceLocator } from '../services/service-locator';
import { Filter } from '../actions/filter';
import { Dialog, Popup } from '@syncfusion/ej2-popups';
import { getZIndexCalcualtion, eventPromise, toggleFilterUI } from '../base/util';
import * as events from '../base/constant';
import { FilterStateObj } from '../common/filter-interface';
import * as literals from '../base/string-literals';
import { CheckBoxFilterBase } from '../common/checkbox-filter-base';
import { ReturnType } from '../base/type';

/**
 * `string filterui` render string column.
 *
 * @hidden
 */
MultiSelect.Inject(CheckBoxSelection);

export class StringFilterUI implements IFilterMUI {

    private parent: IGrid;
    protected serLocator: ServiceLocator;
    private instance: HTMLElement;
    private multiSelectCheckBoxInstance: HTMLElement;
    private value: string;
    public actObj: AutoComplete;
    private multiSelectObj: MultiSelect;
    private filterSettings: FilterSettings;
    private filter: Filter;
    private dialogObj: Dialog;
    private dropdownOpen: Function;
    private dropdownComplete: Function;
    private acOpen: Function;
    private acFocus: Function;
    private acComplete: Function;
    constructor(parent?: IGrid, serviceLocator?: ServiceLocator, filterSettings?: FilterSettings) {
        this.parent = parent;
        this.serLocator = serviceLocator;
        this.filterSettings = filterSettings;
        if (this.parent) {
            this.parent.on(events.filterMenuClose, this.destroy, this);
            this.parent.on(events.destroy, this.destroy, this);
        }
    }
    public create(args: IFilterCreate): void {
        this.instance = this.parent.createElement('input', { className: 'e-flmenu-input', id: 'strui-' + args.column.uid });
        args.target.appendChild(this.instance);
        this.multiSelectCheckBoxInstance = this.parent.createElement('input', { className: 'multiselect-input', id: 'multiselectstrui-' + args.column.uid });
        args.target.appendChild(this.multiSelectCheckBoxInstance);
        this.dialogObj = args.dialogObj;
        this.processDataOperation(args);
        this.createMultiSelectDropDown(args);
        toggleFilterUI(args.getOptrInstance.dropOptr.value as string, args.column.uid, args.column, args.column.type, args.dialogObj, args.getOptrInstance.dropOptr['previousValue'] as string);
    }

    private processDataOperation(args: IFilterCreate): void {
        if (args.column.isForeignColumn()) {
            (<Promise<Object>>this.parent.getDataModule().dataManager.executeQuery(this.parent.getDataModule().generateQuery(true)))
                .then((result: ReturnType) => {
                    this.getAutoCompleteOptions(args, result);
                    toggleFilterUI(args.getOptrInstance.dropOptr.value as string, args.column.uid, args.column, args.column.type, args.dialogObj, args.getOptrInstance.dropOptr['previousValue'] as string);
                });
            return;
        }
        this.getAutoCompleteOptions(args);
    }

    private getAutoCompleteOptions(args: IFilterCreate, result?: ReturnType): void {
        const isForeignColumn: boolean = args.column.isForeignColumn();
        let foreignColumnQuery: Query;
        if (isForeignColumn) {
            const filteredData: Object[] = (CheckBoxFilterBase.getDistinct(result.result, args.column.field) as { records: Object[] })
                .records || [];
            let filterQuery: Predicate;
            for (let i: number = 0; i < filteredData.length; i++) {
                if (filterQuery) {
                    filterQuery = filterQuery.or(args.column.field, 'contains', filteredData[parseInt(i.toString(), 10)][args.column.field], this.parent
                        .filterSettings.enableCaseSensitivity, this.parent.filterSettings.ignoreAccent);
                } else {
                    filterQuery = new Predicate(args.column.field, 'contains', filteredData[parseInt(i.toString(), 10)][args.column.field], this.parent
                        .filterSettings.enableCaseSensitivity, this.parent.filterSettings.ignoreAccent);
                }
            }
            foreignColumnQuery = new Query().where(filterQuery);
            foreignColumnQuery.params = this.parent.query.params;
        }
        const dataSource: Object = isForeignColumn ? args.column.dataSource : this.parent.dataSource;
        const fields: Object = { value: isForeignColumn ? args.column.foreignKeyValue : args.column.field };
        const autoComplete: AutoComplete = new AutoComplete(extend(
            {
                dataSource: dataSource instanceof DataManager ? dataSource : new DataManager(dataSource),
                fields: fields,
                locale: this.parent.locale,
                enableRtl: this.parent.enableRtl,
                query: isForeignColumn ? foreignColumnQuery : this.parent.getDataModule().generateQuery(true, true),
                sortOrder: 'Ascending',
                cssClass: this.parent.cssClass ? 'e-popup-flmenu' + ' ' + this.parent.cssClass : 'e-popup-flmenu',
                autofill: true,
                placeholder: args.localizeText.getConstant('EnterValue'),
                actionBegin: function () : void {
                    if (this.query.queries.length && this.query.queries[0].fn === 'onWhere' && this.query.queries[0].e
                        && this.query.queries[0].e.predicates) {
                        for (let i : number = 0; i < this.query.queries[0].e.predicates.length; i++) {
                            if (this.properties.fields.value === this.query.queries[0].e.predicates[`${i}`].field) {
                                this.query.queries[0].e.predicates.splice(i, 1);
                                i = i - 1;
                            }
                        }
                        if (!this.query.queries[0].e.predicates.length) {
                            this.query.queries.splice(0, 1);
                        }
                    }
                }
            },
            args.column.filter.params
        ));
        this.acFocus = this.focus(autoComplete, args);
        this.acComplete = this.actionComplete(autoComplete);
        this.acOpen = this.openPopup.bind(this);
        autoComplete.addEventListener(literals.focus, this.acFocus);
        autoComplete.addEventListener(literals['open'], this.acOpen);
        autoComplete.addEventListener(events.actionComplete, this.acComplete);
        if (dataSource && 'result' in dataSource) {
            const query: Query = this.parent.getQuery ? this.parent.getQuery().clone() : new Query();
            const defObj: FilterStateObj = eventPromise({ requestType: 'stringfilterrequest' }, query);
            this.parent.trigger(events.dataStateChange, defObj.state);
            const def: Deferred = defObj.deffered;
            def.promise.then((e: Object[]) => {
                autoComplete.dataSource = new DataManager(e);
            });
        }
        this.actObj = autoComplete;
        this.actObj.appendTo(this.instance);
        if (isForeignColumn) {
            this.parent.filterModule.filterModule.afterRenderFilterUI();
        }
    }

    public write(args: { column: Column, target: Element, parent: IGrid,
        filteredValue: number | string | Date | boolean | (string | number | boolean | Date)[] }): void {
        const operatorDropdown: DropDownList = this.parent.filterModule.filterModule.getOperatorDropdown();
        const stringObject: AutoComplete = this.getAutoCompleteInstance(args.column.uid);
        const multiSelectObject: MultiSelect = this.getMultiSelectInstance(args.column.uid);
        if (operatorDropdown.value === 'in' || operatorDropdown.value === 'notin') {
            (multiSelectObject.value as (string | number | boolean | Date)[]) = Array.isArray(args.filteredValue) ? args.filteredValue : [];
        } else {
            if (args.filteredValue !== '' && !isNullOrUndefined(args.filteredValue) && !Array.isArray(args.filteredValue)) {
                stringObject.value = args.filteredValue as string;
            }
        }
    }

    public read(element: Element, column: Column, filterOptr: string, filterObj: Filter): void {
        if (filterOptr === 'in' || filterOptr === 'notin') {
            const filterValue: string[] = this.getMultiSelectInstance(column.uid).value as string[];
            filterObj.filterByColumn(column.field, filterOptr, filterValue, 'and', this.parent.filterSettings.enableCaseSensitivity);
        } else {
            const autoCompleteObject: AutoComplete = this.getAutoCompleteInstance(column.uid);
            let filterValue: string | number | Date | boolean = autoCompleteObject.value as string | number | Date | boolean;
            if (Browser.isDevice) {
                autoCompleteObject.hidePopup();
                autoCompleteObject.focusOut();
            }
            if (isNullOrUndefined(filterValue) || filterValue === '') {
                filterValue = null;
            }
            filterObj.filterByColumn(column.field, filterOptr, filterValue, 'and', this.parent.filterSettings.enableCaseSensitivity);
        }
    }

    private getAutoCompleteInstance(uid: string): AutoComplete {
        return (<EJ2Intance>document.querySelector(`#strui-${uid}`)).ej2_instances[0];
    }

    private getMultiSelectInstance(uid: string): MultiSelect {
        return (<EJ2Intance>document.querySelector(`#multiselectstrui-${uid}`)).ej2_instances[0];
    }

    private createMultiSelectDropDown(args: IFilterCreate): void {
        const isForeignColumn: boolean = args.column.isForeignColumn();
        const dataSource: Object = isForeignColumn ? args.column.dataSource : this.parent.dataSource;
        const fields: string = isForeignColumn ? args.column.foreignKeyValue : args.column.field;
        this.multiSelectObj =  new MultiSelect(extend(
            {
                dataSource: dataSource instanceof DataManager ? dataSource : new DataManager(dataSource),
                fields: { text: fields, value: fields },
                mode: 'CheckBox',
                showDropDownIcon: true,
                popupHeight: '300px',
                showSelectAll: true,
                query: new Query().select(fields),
                cssClass: this.parent.cssClass ? 'e-multiselect-flmenu' + ' ' + this.parent.cssClass : 'e-multiselect-flmenu',
                locale: this.parent.locale,
                enableRtl: this.parent.enableRtl
            },
            args.column.filter.params
        ));
        this.dialogObj = args.dialogObj;
        this.dropdownOpen = this.openPopup.bind(this);
        this.dropdownComplete = this.actionCompleteMultiCheckBox(fields);
        this.multiSelectObj.addEventListener(literals['open'], this.dropdownOpen);
        this.multiSelectObj.addEventListener(events.actionComplete, this.dropdownComplete);
        this.multiSelectObj.appendTo(this.multiSelectCheckBoxInstance);
    }

    private openPopup(args: { popup: Popup }): void {
        getZIndexCalcualtion(args, this.dialogObj);
    }

    private focus(actObj: AutoComplete, args: IFilterCreate): Function {
        return () => {
            actObj.filterType = args.getOptrInstance.getFlOperator() as 'StartsWith' | 'Contains' | 'EndsWith';
        };
    }

    private actionComplete(actObj: AutoComplete): Function {
        return (e: { result: { [key: string]: Object; }[] }) => {
            e.result = e.result.filter((obj: { [key: string]: Object; }, index: number, arr: { [key: string]: Object; }[]) => {
                return arr.map((mapObj: Object) => {
                    return (getValue(actObj.fields.value, mapObj));
                }).indexOf(getValue((actObj.fields.value), obj)) === index;
            });
        };
    }

    private actionCompleteMultiCheckBox(fields: string): Function {
        return (e: { result: string[] }) => {
            e.result = DataUtil.distinct(e.result, fields, true) as string[];
        };
    }

    public destroy(): void {
        this.parent.off(events.filterMenuClose, this.destroy);
        this.parent.off(events.destroy, this.destroy);
        if (this.actObj && !this.actObj.isDestroyed) {
            this.actObj.removeEventListener(literals.focus, this.acFocus);
            this.actObj.removeEventListener(literals['open'], this.acOpen);
            this.actObj.removeEventListener(events.actionComplete, this.acComplete);
            this.actObj.destroy();
        }
        if (this.multiSelectObj && !this.multiSelectObj.isDestroyed) {
            this.multiSelectObj.removeEventListener(literals['open'], this.dropdownOpen);
            this.multiSelectObj.removeEventListener(events.actionComplete, this.dropdownComplete);
            this.multiSelectObj.destroy();
        }
    }

}
