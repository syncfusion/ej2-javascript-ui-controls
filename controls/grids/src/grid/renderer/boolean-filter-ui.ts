import { IGrid, IFilterMUI, EJ2Intance } from '../base/interface';
import { Column } from '../models/column';
import { FilterSettings } from '../base/grid';
import { L10n } from '@syncfusion/ej2-base';
import { eventPromise, getZIndexCalcualtion, toggleFilterUI } from '../base/util';
import { ServiceLocator } from '../services/service-locator';
import { Query, DataManager, DataUtil, Deferred } from '@syncfusion/ej2-data';
import { CheckBoxSelection, DropDownList, MultiSelect } from '@syncfusion/ej2-dropdowns';
import { Filter } from '../actions/filter';
import { isNullOrUndefined, extend } from '@syncfusion/ej2-base';
import { FlMenuOptrUI } from './filter-menu-operator';
import { Dialog, Popup } from '@syncfusion/ej2-popups';
import * as events from '../base/constant';
import * as literals from '../base/string-literals';
import { FilterStateObj } from '../common/filter-interface';
import { PredicateModel } from '../base/grid-model';

/**
 * `boolfilterui` render boolean column.
 *
 * @hidden
 */
MultiSelect.Inject(CheckBoxSelection);

export class BooleanFilterUI implements IFilterMUI {

    private parent: IGrid;
    protected serviceLocator: ServiceLocator;
    private elem: HTMLElement;
    private multiSelectElement: HTMLElement;
    private value: string;
    private filterSettings: FilterSettings;
    private dropInstance: DropDownList;
    private multiSelectCheckBoxInstance: MultiSelect;
    private dialogObj: Dialog;
    private dropdownOpen: Function;
    private dropdownComplete: Function;
    private multiSelectDropdownOpen: Function;
    private multiSelectDropdownComplete: Function;

    constructor(parent?: IGrid, serviceLocator?: ServiceLocator, filterSettings?: FilterSettings) {
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        this.filterSettings = filterSettings;
        if (this.parent) {
            this.parent.on(events.filterMenuClose, this.destroy, this);
            this.parent.on(events.destroy, this.destroy, this);
        }
    }
    public create(args: {
        column: Column, target: HTMLElement,
        getOptrInstance: FlMenuOptrUI, localizeText: L10n, dialogObj: Dialog
    }): void {
        this.elem = this.parent.createElement('input', { className: 'e-flmenu-input', id: 'bool-ui-' + args.column.uid });
        args.target.appendChild(this.elem);
        this.multiSelectElement = this.parent.createElement('input', { className: 'multiselect-input', id: 'multiselectbool-ui-' + args.column.uid });
        args.target.appendChild(this.multiSelectElement);
        this.createDropDownList(args);
        this.createMultiSelectDropDown(args);
        toggleFilterUI(args.getOptrInstance.dropOptr.value as string, args.column.uid, args.column, args.column.type, args.dialogObj, args.getOptrInstance.dropOptr['previousValue'] as string);
    }

    public write(args: { column: Column, target: Element, parent: IGrid, filteredValue: number | string | Date | boolean }): void {
        const operatorDropdown : DropDownList = this.parent.filterModule.filterModule.getOperatorDropdown();
        const dropdownObject: DropDownList = this.getBooleanInstance(args.column.uid);
        const multiSelectObject: MultiSelect = this.getMultiSelectInstance(args.column.uid);
        if (operatorDropdown .value === 'in' || operatorDropdown .value === 'notin') {
            (multiSelectObject.value as (string | number | boolean | Date)[]) = Array.isArray(args.filteredValue) ? args.filteredValue : [];
        } else {
            if (!isNullOrUndefined(args.filteredValue) && !Array.isArray(args.filteredValue)) {
                dropdownObject.value = args.filteredValue as string;
            }
        }
    }

    public read(element: Element, column: Column, filterOptr: string, filterObj: Filter): void {
        if (filterOptr === 'in' || filterOptr === 'notin') {
            const filterValue: boolean[] = this.getMultiSelectInstance(column.uid).value as boolean[];
            filterObj.filterByColumn(column.field, filterOptr, filterValue, 'and', true);
        } else {
            const dropdownObject: DropDownList = this.getBooleanInstance(column.uid);
            const filterValue: string | number | Date | boolean = (dropdownObject.value) as string | number | Date | boolean;
            filterObj.filterByColumn(column.field, filterOptr, filterValue, 'and', false);
        }
    }

    private createDropDownList(args: { column: Column, target: HTMLElement, getOptrInstance: FlMenuOptrUI,
        localizeText: L10n, dialogObj: Dialog }): void {
        const isForeignColumn: boolean = args.column.isForeignColumn();
        const dataSource: Object = isForeignColumn ? args.column.dataSource : this.parent.dataSource;
        const fields: string = isForeignColumn ? args.column.foreignKeyValue : args.column.field;
        this.dialogObj = args.dialogObj;
        this.dropInstance = new DropDownList(extend(
            {
                dataSource: dataSource instanceof DataManager ?
                    dataSource : new DataManager(dataSource),
                query: new Query().select(fields),
                fields: { text: fields, value: fields },
                placeholder: args.localizeText.getConstant('SelectValue'),
                cssClass: this.parent.cssClass ? 'e-popup-flmenu' + ' ' + this.parent.cssClass : 'e-popup-flmenu',
                locale: this.parent.locale,
                enableRtl: this.parent.enableRtl
            },
            args.column.filter.params
        ));
        this.dropdownOpen = this.openPopup.bind(this);
        this.dropdownComplete = this.actionComplete(fields);
        this.dropInstance.addEventListener(literals['open'], this.dropdownOpen);
        this.dropInstance.addEventListener(events.actionComplete, this.dropdownComplete);
        if (dataSource && 'result' in dataSource) {
            const query: Query = this.parent.getQuery ? this.parent.getQuery().clone() : new Query();
            const defObj: FilterStateObj = eventPromise({ requestType: 'booleanfilterrequest' }, query);
            this.parent.trigger(events.dataStateChange, defObj.state);
            const def: Deferred = defObj.deffered;
            def.promise.then((e: Object[]) => {
                this.dropInstance.dataSource = new DataManager(e);
                this.dropInstance.dataBind();
                const columns: PredicateModel[] = this.parent.filterSettings.columns;
                for (const column of columns) {
                    if (args.column.uid === column.uid) {
                        this.dropInstance.value = column.value;
                    }
                }
            });
        }
        this.dropInstance.appendTo(this.elem);
    }

    private createMultiSelectDropDown(args: { column: Column, target: HTMLElement, getOptrInstance: FlMenuOptrUI,
        localizeText: L10n, dialogObj: Dialog }): void {
        const isForeignColumn: boolean = args.column.isForeignColumn();
        const dataSource: Object = isForeignColumn ? args.column.dataSource : this.parent.dataSource;
        const fields: string = isForeignColumn ? args.column.foreignKeyValue : args.column.field;
        this.multiSelectCheckBoxInstance =  new MultiSelect(extend(
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
        this.multiSelectDropdownOpen = this.openPopup.bind(this);
        this.multiSelectDropdownComplete = this.actionComplete(fields);
        this.multiSelectCheckBoxInstance.addEventListener(literals['open'], this.multiSelectDropdownOpen);
        this.multiSelectCheckBoxInstance.addEventListener(events.actionComplete, this.multiSelectDropdownComplete);
        this.multiSelectCheckBoxInstance.appendTo(this.multiSelectElement);
    }

    private getBooleanInstance(uid: string): DropDownList {
        return (<EJ2Intance>document.querySelector(`#bool-ui-${uid}`)).ej2_instances[0];
    }

    private getMultiSelectInstance(uid: string): MultiSelect {
        return (<EJ2Intance>document.querySelector(`#multiselectbool-ui-${uid}`)).ej2_instances[0];
    }

    private openPopup(args: { popup: Popup }): void {
        getZIndexCalcualtion(args, this.dialogObj);
    }

    private actionComplete(fields: string): Function {
        return (e: { result: string[] }) => {
            e.result = DataUtil.distinct(e.result, fields, true) as string[];
        };
    }

    public destroy(): void {
        this.parent.off(events.filterMenuClose, this.destroy);
        this.parent.off(events.destroy, this.destroy);
        if (this.dropInstance && !this.dropInstance.isDestroyed) {
            this.dropInstance.removeEventListener(literals['open'], this.dropdownOpen);
            this.dropInstance.removeEventListener(events.actionComplete, this.dropdownComplete);
            this.dropInstance.destroy();
        }
        if (this.multiSelectCheckBoxInstance && !this.multiSelectCheckBoxInstance.isDestroyed) {
            this.multiSelectCheckBoxInstance.removeEventListener(literals['open'], this.multiSelectDropdownOpen);
            this.multiSelectCheckBoxInstance.removeEventListener(events.actionComplete, this.multiSelectDropdownComplete);
            this.multiSelectCheckBoxInstance.destroy();
        }
    }
}
