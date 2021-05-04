import { isNullOrUndefined, extend } from '@syncfusion/ej2-base';
import { IGrid, IEditCell } from '../base/interface';
import { Column } from '../models/column';
import { isEditable, createEditElement } from '../base/util';
import { TextBox }  from '@syncfusion/ej2-inputs';
import { EditCellBase } from './edit-cell-base';

/**
 * `DefaultEditCell` is used to handle default cell type editing.
 * @hidden
 */
export class DefaultEditCell extends EditCellBase implements IEditCell {

    public create(args: { column: Column, value: string, requestType: string }): Element {        
        let attr: { [key: string]: string } = {
            type: 'text', value: !isNullOrUndefined(args.value) ? args.value : '', style: 'text-align:' + args.column.textAlign,
        };
        return createEditElement(this.parent, args.column, 'e-field e-input e-defaultcell', attr);        
    }

    public read(element: Element): string {
        return (<HTMLInputElement>element).value;
    }

    public write(args: { rowData: Object, element: Element, column: Column, requestType: string }): void {
        let col: Column = args.column;
        let isInline: boolean = this.parent.editSettings.mode !== 'Dialog';
        this.obj = new TextBox(extend(
            {
                element: args.element as HTMLInputElement, floatLabelType: this.parent.editSettings.mode !== 'Dialog' ? 'Never' : 'Always',
                enableRtl: this.parent.enableRtl, enabled: isEditable(args.column, args.requestType, args.element),
                placeholder: isInline ? '' : args.column.headerText,
            },
            col.edit.params));
        this.obj.appendTo(args.element as HTMLElement);
    }
}