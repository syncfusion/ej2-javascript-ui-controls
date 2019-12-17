import { extend, isBlazor } from '@syncfusion/ej2-base';
import { Column } from '../models/column';
import { IEditCell, IGrid, EJ2Intance } from '../base/interface';
import { DatePicker, DateTimePicker } from '@syncfusion/ej2-calendars';
import { isEditable, getComplexFieldID, getObject, getCustomDateFormat } from '../base/util';

/**
 * `DatePickerEditCell` is used to handle datepicker cell type editing.
 * @hidden
 */
export class DatePickerEditCell implements IEditCell {
    private parent: IGrid;
    private obj: DatePicker;
    constructor(parent?: IGrid) {
        this.parent = parent;
    }
    public create(args: { column: Column, value: string, type: string }): Element {
        /* tslint:disable-next-line:no-any */
        let complexFieldName: string = getComplexFieldID(args.column.field);
        return this.parent.createElement('input', {
            className: 'e-field', attrs: {
                id: this.parent.element.id + complexFieldName,
                name: complexFieldName, type: 'text', 'e-mappinguid': args.column.uid
            }
        });
    }
    public read(element: Element): string | Date {
        return (<EJ2Intance>element).ej2_instances[0].value;
    }
    public write(args: { rowData: Object, element: Element, column: Column, type: string, row: HTMLElement, requestType: string }): void {
        if (args.column.editType === 'datepickeredit') {
            this.obj = new DatePicker(
                extend(
                    dateanddatetimerender(args, this.parent.editSettings.mode, this.parent.enableRtl),
                    args.column.edit.params));
        } else if (args.column.editType === 'datetimepickeredit') {
            this.obj = new DateTimePicker(
                extend(dateanddatetimerender(args, this.parent.editSettings.mode, this.parent.enableRtl),
                       args.column.edit.params));
        }
        if (isBlazor()) {
            this.obj.locale = this.parent.locale;
        }
        this.obj.appendTo(args.element as HTMLElement);
    }

    public destroy(): void {
        if (this.obj) {
            this.obj.destroy();
        }
    }
}

function dateanddatetimerender(args: { rowData: Object, element: Element, column: Column, type: string, row: HTMLElement,
    requestType: string },     mode: string, rtl: boolean): Object {
    let isInline: boolean = mode !== 'Dialog';
    let format: string = getCustomDateFormat(args.column.format, args.column.type);
    let value: Date = getObject(args.column.field, args.rowData);
    value = value ? new Date(value) : null;
    return{
    floatLabelType: isInline ? 'Never' : 'Always',
    value: value,
    format: format,
    placeholder: isInline ?
        '' : args.column.headerText, enableRtl: rtl,
    enabled: isEditable(args.column, args.requestType, args.element),
};
}