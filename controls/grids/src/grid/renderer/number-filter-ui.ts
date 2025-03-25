import { IGrid, EJ2Intance, IFilterMUI, IFilterCreate } from '../base/interface';
import { Column } from '../models/column';
import { FilterSettings } from '../base/grid';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { ServiceLocator } from '../services/service-locator';
import { Filter } from '../actions/filter';
import { extend, isUndefined, KeyboardEventArgs  } from '@syncfusion/ej2-base';
import * as events from '../base/constant';
import { MultiSelect, CheckBoxSelection, DropDownList } from '@syncfusion/ej2-dropdowns';
import { DataManager, DataUtil, Query } from '@syncfusion/ej2-data';
import { Dialog, Popup } from '@syncfusion/ej2-popups';
import * as literals from '../base/string-literals';
import { getZIndexCalcualtion, toggleFilterUI } from '../base/util';

/**
 * `numberfilterui` render number column.
 *
 * @hidden
 */
MultiSelect.Inject(CheckBoxSelection);

export class NumberFilterUI implements IFilterMUI {

    private parent: IGrid;
    protected serviceLocator: ServiceLocator;
    private numericInstance: HTMLElement;
    private value: string;
    private numericTxtObj: NumericTextBox;
    private multiSelectObj: MultiSelect;
    private filterSettings: FilterSettings;
    private filter: Filter;
    private multiSelectCheckBoxInstance: HTMLElement;
    private dialogObj: Dialog;
    private dropdownOpen: Function;
    private dropdownComplete: Function;

    constructor(parent?: IGrid, serviceLocator?: ServiceLocator, filterSettings?: FilterSettings) {
        this.filterSettings = filterSettings;
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        if (this.parent) {
            this.parent.on(events.filterMenuClose, this.destroy, this);
            this.parent.on(events.destroy, this.destroy, this);
        }
    }

    private keyEventHandler(args: KeyboardEventArgs): void {
        if (args.keyCode === 13 || args.keyCode === 9) {
            const evt: Event = document.createEvent('HTMLEvents');
            evt.initEvent('change', false, true);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this as any).dispatchEvent(evt);
        }
    }

    public create(args: IFilterCreate): void {
        this.numericInstance = this.parent.createElement('input', { className: 'e-flmenu-input', id: 'numberui-' + args.column.uid });
        this.multiSelectCheckBoxInstance = this.parent.createElement('input', { className: 'multiselect-input', id: 'multiselectnumberui-' + args.column.uid });
        args.target.appendChild(this.numericInstance);
        args.target.appendChild(this.multiSelectCheckBoxInstance);
        this.createNumericTextBox(args);
        this.createMultiSelectDropDown(args);
        toggleFilterUI(args.getOptrInstance.dropOptr.value as string, args.column.uid, args.column, args.column.type, args.dialogObj, args.getOptrInstance.dropOptr['previousValue'] as string);
    }

    public write(args: { column: Column, target: Element, parent: IGrid,
        filteredValue: number | string | Date | boolean | (string | number | boolean | Date)[] }): void {
        const operatorDropdown: DropDownList = this.parent.filterModule.filterModule.getOperatorDropdown();
        const numericObject: NumericTextBox = this.getNumericInstance(args.column.uid);
        const multiSelectObject: MultiSelect = this.getMultiSelectInstance(args.column.uid);
        if (operatorDropdown.value === 'in' || operatorDropdown.value === 'notin') {
            (multiSelectObject.value as (string | number | boolean | Date)[]) = Array.isArray(args.filteredValue) ? args.filteredValue : [];
        } else {
            numericObject.element.addEventListener('keydown', this.keyEventHandler);
            if (!Array.isArray(args.filteredValue)) {
                numericObject.value = args.filteredValue as number;
            }
        }
    }

    public read(element: Element, column: Column, filterOptr: string, filterObj: Filter): void {
        if (filterOptr === 'in' || filterOptr === 'notin') {
            const filterValue: number[] = this.getMultiSelectInstance(column.uid).value as number[];
            filterObj.filterByColumn(column.field, filterOptr, filterValue, 'and', true);
        } else {
            const filterValue: number = this.getNumericInstance(column.uid).value;
            filterObj.filterByColumn(column.field, filterOptr, filterValue, 'and', true);
        }
    }

    private createNumericTextBox(args: IFilterCreate): void {
        this.numericTxtObj = new NumericTextBox(extend(
            {
                format: typeof (args.column.format) === 'string' || isUndefined(args.column.format) ? args.column.format :
                    args.column.format.format,
                locale: this.parent.locale,
                cssClass: this.parent.cssClass ? 'e-popup-flmenu' + ' ' + this.parent.cssClass : 'e-popup-flmenu',
                placeholder: args.localizeText.getConstant('EnterValue'),
                enableRtl: this.parent.enableRtl
            },
            args.column.filter.params
        ));
        this.numericTxtObj.appendTo(this.numericInstance);
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
        this.dropdownComplete = this.actionComplete(fields);
        this.multiSelectObj.addEventListener(literals['open'], this.dropdownOpen);
        this.multiSelectObj.addEventListener(events.actionComplete, this.dropdownComplete);
        this.multiSelectObj.appendTo(this.multiSelectCheckBoxInstance);
    }

    private getNumericInstance(uid: string): NumericTextBox {
        return (<EJ2Intance>document.querySelector(`#numberui-${uid}`)).ej2_instances[0];
    }

    private getMultiSelectInstance(uid: string): MultiSelect {
        return (<EJ2Intance>document.querySelector(`#multiselectnumberui-${uid}`)).ej2_instances[0];
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
        if (this.numericTxtObj && !this.numericTxtObj.isDestroyed) {
            this.numericTxtObj.destroy();
        }
        if (this.multiSelectObj && !this.multiSelectObj.isDestroyed) {
            this.multiSelectObj.removeEventListener(literals['open'], this.dropdownOpen);
            this.multiSelectObj.removeEventListener(events.actionComplete, this.dropdownComplete);
            this.multiSelectObj.destroy();
        }
    }
}
