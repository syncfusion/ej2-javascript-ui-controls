import { IGrid, IFilterMUI, EJ2Intance } from '../base/interface';
import { Column } from '../models/column';
import { FilterSettings } from '../base/grid';
import { L10n, } from '@syncfusion/ej2-base';
import { getZIndexCalcualtion } from '../base/util';
import { ServiceLocator } from '../services/service-locator';
import { Query, DataManager, DataUtil } from '@syncfusion/ej2-data';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { Filter } from '../actions/filter';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { FlMenuOptrUI } from './filter-menu-operator';
import { Dialog, Popup } from '@syncfusion/ej2-popups';
/**
 * `boolfilterui` render boolean column.
 * @hidden
 */

export class BooleanFilterUI implements IFilterMUI {

    private parent: IGrid;
    protected serviceLocator: ServiceLocator;
    private elem: HTMLElement;
    private value: string;
    private filterSettings: FilterSettings;
    private dropInstance: DropDownList;
    private dialogObj: Dialog;

    constructor(parent?: IGrid, serviceLocator?: ServiceLocator, filterSettings?: FilterSettings) {
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        this.filterSettings = filterSettings;
    }
    public create(args: {
        column: Column, target: HTMLElement,
        getOptrInstance: FlMenuOptrUI, localizeText: L10n, dialogObj: Dialog
    }): void {
        let isForeignColumn: boolean = args.column.isForeignColumn();
        let dataSource: Object = isForeignColumn ? args.column.dataSource : this.parent.dataSource;
        let fields: string = isForeignColumn ? args.column.foreignKeyValue : args.column.field;
        this.elem = this.parent.createElement('input', { className: 'e-flmenu-input', id: 'bool-ui-' + args.column.uid });
        args.target.appendChild(this.elem);
        this.dialogObj = args.dialogObj;
        this.dropInstance = new DropDownList({
            dataSource: dataSource instanceof DataManager ?
            dataSource : new DataManager(dataSource),
            query: new Query().select(fields),
            fields: { text: fields, value: fields },
            placeholder: args.localizeText.getConstant('SelectValue'),
            cssClass: 'e-popup-flmenu',
            locale: this.parent.locale,
            enableRtl: this.parent.enableRtl,
            open: this.openPopup.bind(this),
            actionComplete: (e: { result: string[] }) => {
                e.result  = DataUtil.distinct(e.result, fields, true ) as string[];
            }

        });
        this.dropInstance.appendTo(this.elem);
    }

    public write(args: { column: Column, target: Element, parent: IGrid, filteredValue: number | string | Date | boolean }): void {
        let drpuiObj: DropDownList = (<EJ2Intance>document.querySelector('#bool-ui-' + args.column.uid)).ej2_instances[0];
        if (!isNullOrUndefined(args.filteredValue) ) {
            drpuiObj.text = args.filteredValue as string;
        }
    }

    public read(element: Element, column: Column, filterOptr: string, filterObj: Filter): void {
        let drpuiObj: DropDownList = (<EJ2Intance>document.querySelector('#bool-ui-' + column.uid)).ej2_instances[0];
        let filterValue: string | number | Date | boolean = drpuiObj.value;
        filterObj.filterByColumn(column.field, filterOptr, filterValue, 'and', false);
    }

    private openPopup(args: { popup: Popup }): void {
        getZIndexCalcualtion(args, this.dialogObj);
    }
}