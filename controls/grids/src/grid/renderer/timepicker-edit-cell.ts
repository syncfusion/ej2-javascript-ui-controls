import { extend } from '@syncfusion/ej2-base';
import { Column } from '../models/column';
import { IEditCell } from '../base/interface';
import { TimePicker } from '@syncfusion/ej2-calendars';
import { isEditable, getObject,  parentsUntil, isCellHaveWidth } from '../base/util';
import { EditCellBase } from './edit-cell-base';

/**
 * `TimePickerEditCell` is used to handle Timepicker cell type editing.
 *
 * @hidden
 */
export class TimePickerEditCell extends EditCellBase implements IEditCell {

    public write(args: { rowData: Object, element: Element, column: Column, type: string, row: HTMLElement, requestType: string }): void {
        const isInlineEdit: boolean = this.parent.editSettings.mode !== 'Dialog';
        let rowDataValue: Date = getObject(args.column.field, args.rowData);
        rowDataValue = rowDataValue ? new Date(rowDataValue) : null;
        this.obj = new TimePicker(
            extend(
                {
                    floatLabelType: isInlineEdit ? 'Never' : 'Always',
                    value: rowDataValue,
                    placeholder: isInlineEdit ?
                        '' : args.column.headerText, enableRtl: this.parent.enableRtl,
                    enabled: isEditable(args.column, args.requestType, args.element) &&
                        isCellHaveWidth(parentsUntil(args.element, 'e-rowcell'), this.parent),
                    cssClass: this.parent.cssClass ? this.parent.cssClass : null
                },
                args.column.edit.params));
        this.obj.appendTo(args.element as HTMLElement);
    }
}
