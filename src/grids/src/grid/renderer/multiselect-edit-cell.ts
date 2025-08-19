import { extend, getValue } from '@syncfusion/ej2-base';
import { IEditCell } from '../base/interface';
import { Column } from '../models/column';
import { MultiSelect } from '@syncfusion/ej2-dropdowns';
import {  getComplexFieldID} from '../base/util';
import { EditCellBase } from './edit-cell-base';
/**
 * `MultiSelectEditCell` is used to handle multiselect dropdown cell type editing.
 *
 * @hidden
 */
export class MultiSelectEditCell extends EditCellBase implements IEditCell {
    private column: Column;

    public write(args: { rowData: Object, element: Element, column: Column, row: HTMLElement, requestType: string }): void {
        this.column = args.column;
        const isInline: boolean = this.parent.editSettings.mode !== 'Dialog';
        this.obj = new MultiSelect(extend(
            {
                fields: {text: args.column.field, value: args.column.field},
                value: getValue(args.column.field, args.rowData),
                enableRtl: this.parent.enableRtl,
                placeholder: isInline ? '' : args.column.headerText, popupHeight: '200px',
                floatLabelType: isInline ? 'Never' : 'Always',
                cssClass: this.parent.cssClass ? this.parent.cssClass : null
            },
            args.column.edit.params));
        this.obj.appendTo(args.element as HTMLElement);
        args.element.setAttribute('name', getComplexFieldID(args.column.field));
    }
}
