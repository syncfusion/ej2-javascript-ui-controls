import { IGrid, EJ2Intance, IFilterMUI, IFilterCreate } from '../base/interface';
import { Column } from '../models/column';
import { FilterSettings } from '../base/grid';
import { PredicateModel } from '../base/grid-model';
import { DatePicker, DateTimePicker } from '@syncfusion/ej2-calendars';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { ServiceLocator } from '../services/service-locator';
import { Filter } from '../actions/filter';
import { Dialog, Popup } from '@syncfusion/ej2-popups';
import {getCustomDateFormat} from '../base/util';

/**
 * `datefilterui` render date column.
 * @hidden
 */

export class DateFilterUI implements IFilterMUI {

    private parent: IGrid;
    protected locator: ServiceLocator;
    private inputElem: HTMLElement;
    private value: string;
    private datePickerObj: DatePicker;
    private fltrSettings: FilterSettings;
    private dialogObj: Dialog;
    constructor(parent?: IGrid, serviceLocator?: ServiceLocator, filterSettings?: FilterSettings) {
        this.parent = parent;
        this.locator = serviceLocator;
        this.fltrSettings = filterSettings;
    }

    public create(args: IFilterCreate): void {
        let format: string = getCustomDateFormat(args.column.format, args.column.type);
        this.dialogObj = args.dialogObj;
        this.inputElem = this.parent.createElement('input', { className: 'e-flmenu-input', id: 'dateui-' + args.column.uid });
        args.target.appendChild(this.inputElem);
        if (args.column.type === 'date') {
            this.datePickerObj = new DatePicker({
                format: format,
                cssClass: 'e-popup-flmenu',
                placeholder: args.localizeText.getConstant('ChooseDate'),
                width: '100%',
                locale: this.parent.locale,
                enableRtl: this.parent.enableRtl,
                open: this.openPopup.bind(this),
            });
        } else if (args.column.type === 'datetime') {
            this.datePickerObj = new DateTimePicker({
                format: format,
                cssClass: 'e-popup-flmenu',
                placeholder: args.localizeText.getConstant('ChooseDate'),
                width: '100%',
                locale: this.parent.locale,
                enableRtl: this.parent.enableRtl,
                open: this.openPopup.bind(this),
            });
        }
        this.datePickerObj.appendTo(this.inputElem);
    }

    public write(args: { column: Column, target: Element, parent: IGrid, filteredValue: number | string | Date | boolean }): void {
        let columns: PredicateModel[] = this.fltrSettings.columns;
        let dateuiObj: DatePicker | DateTimePicker = (<EJ2Intance>document.querySelector('#dateui-' + args.column.uid)).ej2_instances[0];
        dateuiObj.value = !isNullOrUndefined(args.filteredValue) ? new Date(args.filteredValue as string) as Date : null as Date;
    }

    public read(element: Element, column: Column, filterOptr: string, filterObj: Filter): void {
        let dateuiObj: DatePicker | DateTimePicker = (<EJ2Intance>document.querySelector('#dateui-' + column.uid)).ej2_instances[0];
        let filterValue: Date = dateuiObj.value;
        filterValue = isNullOrUndefined(filterValue) ? null : filterValue;
        filterObj.filterByColumn(column.field, filterOptr, filterValue, 'and', true);
    }

    private openPopup(args: { popup: Popup }): void {
        args.popup.element.style.zIndex = (this.dialogObj.zIndex + 1).toString();
    }


}