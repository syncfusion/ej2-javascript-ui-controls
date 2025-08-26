import { IGrid, EJ2Intance, IFilterMUI, IFilterCreate } from '../base/interface';
import { Column } from '../models/column';
import { FilterSettings } from '../base/grid';
import { DatePicker, DateTimePicker } from '@syncfusion/ej2-calendars';
import { isNullOrUndefined, extend } from '@syncfusion/ej2-base';
import { ServiceLocator } from '../services/service-locator';
import { Filter } from '../actions/filter';
import { Dialog, Popup } from '@syncfusion/ej2-popups';
import {getCustomDateFormat} from '../base/util';
import * as events from '../base/constant';
import * as literals from '../base/string-literals';

/**
 * `datefilterui` render date column.
 *
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
    private dpOpen: Function = this.openPopup.bind(this);

    constructor(parent?: IGrid, serviceLocator?: ServiceLocator, filterSettings?: FilterSettings) {
        this.parent = parent;
        this.locator = serviceLocator;
        this.fltrSettings = filterSettings;
        if (this.parent) {
            this.parent.on(events.filterMenuClose, this.destroy, this);
            this.parent.on(events.destroy, this.destroy, this);
        }
    }

    public create(args: IFilterCreate): void {
        const format: string = getCustomDateFormat(args.column.format, args.column.type);
        this.dialogObj = args.dialogObj;
        this.inputElem = this.parent.createElement('input', { className: 'e-flmenu-input', id: 'dateui-' + args.column.uid });
        args.target.appendChild(this.inputElem);
        if (args.column.type === 'date' || args.column.type === 'dateonly') {
            this.datePickerObj = new DatePicker(extend(
                {
                    format: format,
                    cssClass: this.parent.cssClass ? 'e-popup-flmenu' + ' ' + this.parent.cssClass : 'e-popup-flmenu',
                    placeholder: args.localizeText.getConstant('ChooseDate'),
                    width: '100%',
                    locale: this.parent.locale,
                    enableRtl: this.parent.enableRtl
                },
                args.column.filter.params
            ));
        } else if (args.column.type === 'datetime') {
            this.datePickerObj = new DateTimePicker(extend(
                {
                    format: format,
                    cssClass: this.parent.cssClass ? 'e-popup-flmenu' + ' ' + this.parent.cssClass : 'e-popup-flmenu',
                    placeholder: args.localizeText.getConstant('ChooseDate'),
                    width: '100%',
                    locale: this.parent.locale,
                    enableRtl: this.parent.enableRtl
                },
                args.column.filter.params)
            );
        }
        this.datePickerObj.addEventListener(literals['open'], this.dpOpen);
        this.datePickerObj.appendTo(this.inputElem);
    }

    public write(args: { column: Column, target: Element, parent: IGrid,
        filteredValue: number | string | Date | boolean | (string | number | boolean | Date)[] }): void {
        const dateuiObj: DatePicker | DateTimePicker = (<EJ2Intance>document.querySelector('#dateui-' + args.column.uid)).ej2_instances[0];
        dateuiObj.value = !isNullOrUndefined(args.filteredValue) ? new Date(args.filteredValue as string) as Date : null as Date;
    }

    public read(element: Element, column: Column, filterOptr: string, filterObj: Filter): void {
        const dateuiObj: DatePicker | DateTimePicker = (<EJ2Intance>document.querySelector('#dateui-' + column.uid)).ej2_instances[0];
        let filterValue: Date = dateuiObj.value;
        filterValue = isNullOrUndefined(filterValue) ? null : filterValue;
        filterObj.filterByColumn(column.field, filterOptr, filterValue, 'and', true);
    }

    private openPopup(args: { popup: Popup }): void {
        args.popup.element.style.zIndex = (this.dialogObj.zIndex + 1).toString();
    }

    public destroy(): void {
        this.parent.off(events.filterMenuClose, this.destroy);
        this.parent.off(events.destroy, this.destroy);
        if (isNullOrUndefined(this.datePickerObj) || this.datePickerObj.isDestroyed) { return; }
        this.datePickerObj.removeEventListener(literals['open'], this.dpOpen);
        this.datePickerObj.destroy();
    }
}
