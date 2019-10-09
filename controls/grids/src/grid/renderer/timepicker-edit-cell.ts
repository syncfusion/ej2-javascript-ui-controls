import { extend } from '@syncfusion/ej2-base';
import { Column } from '../models/column';
import { IEditCell, IGrid, EJ2Intance } from '../base/interface';
import { TimePicker } from '@syncfusion/ej2-calendars';
import { isEditable, getComplexFieldID, getObject } from '../base/util';

/**
 * `TimePickerEditCell` is used to handle Timepicker cell type editing.
 * @hidden
 */
export class TimePickerEditCell implements IEditCell {
    private parent: IGrid;
    private obj: TimePicker;
    constructor(grid?: IGrid) {
        this.parent = grid;
    }
    public create(args: { column: Column, value: string, type: string }): Element {
        /* tslint:disable-next-line:no-any */
        let complexField: string = getComplexFieldID(args.column.field);
        return this.parent.createElement('input', {
            className: 'e-field', attrs: {
                id: this.parent.element.id + complexField,
                name: complexField, type: 'text', 'e-mappinguid': args.column.uid
            }
        });
    }
    public read(element: Element): Date | string {
        return (<EJ2Intance>element).ej2_instances[0].value;
    }
    public write(args: { rowData: Object, element: Element, column: Column, type: string, row: HTMLElement, requestType: string }): void {
        let isInlineEdit: boolean = this.parent.editSettings.mode !== 'Dialog';
        let rowDataValue: Date = getObject(args.column.field, args.rowData);
        rowDataValue = rowDataValue ? new Date(rowDataValue) : null;
        this.obj = new TimePicker(
            extend(
                {
                    floatLabelType: isInlineEdit ? 'Never' : 'Always',
                    value: rowDataValue,
                    placeholder: isInlineEdit ?
                        '' : args.column.headerText, enableRtl: this.parent.enableRtl,
                    enabled: isEditable(args.column, args.requestType, args.element),
                },
                args.column.edit.params));
        this.obj.appendTo(args.element as HTMLElement);
    }

    public destroy(): void {
        if (this.obj) {
            this.obj.destroy();
        }
    }
}