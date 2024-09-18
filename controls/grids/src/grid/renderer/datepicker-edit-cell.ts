import { extend, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { Column } from '../models/column';
import { IEditCell } from '../base/interface';
import { DatePicker, DateTimePicker, PopupEventArgs, MaskedDateTime } from '@syncfusion/ej2-calendars';
import { isEditable, getObject, getCustomDateFormat } from '../base/util';
import { EditCellBase } from './edit-cell-base';
import { Edit } from '../actions/edit';
DatePicker.Inject(MaskedDateTime);

/**
 * `DatePickerEditCell` is used to handle datepicker cell type editing.
 *
 * @hidden
 */
export class DatePickerEditCell extends EditCellBase implements IEditCell {

    /* @hidden */
    public edit: Edit;

    public write(args: { rowData: Object, element: Element, column: Column, type: string, row: HTMLElement, requestType: string }): void {
        this.edit = this.parent.editModule;
        if (args.column.editType === 'datepickeredit') {
            this.obj = new DatePicker(
                extend(
                    dateanddatetimerender(args, this.parent.editSettings.mode, this.parent.enableRtl, this.parent.cssClass, this),
                    args.column.edit.params));
        }
        if (args.column.editType === 'datetimepickeredit') {
            this.obj = new DateTimePicker(
                extend(dateanddatetimerender(args, this.parent.editSettings.mode, this.parent.enableRtl, this.parent.cssClass, this),
                       args.column.edit.params));
        }
        this.obj.appendTo(args.element as HTMLElement);
    }
}

// eslint-disable-next-line
function dateanddatetimerender(args: {
    rowData: Object, element: Element, column: Column, type: string, row: HTMLElement,
    requestType: string
}, mode: string, rtl: boolean, css: string, datePickerEditCell?: DatePickerEditCell): Object {
    const isInline: boolean = mode !== 'Dialog';
    const format: string = getCustomDateFormat(args.column.format, args.column.type);
    let value: Date = getObject(args.column.field, args.rowData);
    value = value ? new Date(value) : null;
    return {
        floatLabelType: isInline ? 'Never' : 'Always',
        value: value,
        format: format,
        placeholder: isInline ?
            '' : args.column.headerText, enableRtl: rtl,
        enabled: isEditable(args.column, args.requestType, args.element),
        cssClass: css ? css : null,
        close: datePickerClose.bind(datePickerEditCell)
    };
}

// eslint-disable-next-line
function datePickerClose(args: PopupEventArgs): void {
    if (args.event && (args.event as KeyboardEventArgs).action === 'escape') {
        (this as DatePickerEditCell).edit.editCellDialogClose = true;
    }
}
