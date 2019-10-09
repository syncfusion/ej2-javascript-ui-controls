import { extend } from '@syncfusion/ej2-base';
import { IGrid, EJ2Intance, IEditCell } from '../base/interface';
import { Column } from '../models/column';
import { MaskedTextBox  } from '@syncfusion/ej2-inputs';
import { isEditable, getComplexFieldID, getObject } from '../base/util';

/**
 * `MaskedTextBoxCellEdit` is used to handle masked input cell type editing.
 * @hidden
 */
export class MaskedTextBoxCellEdit implements IEditCell {


    private parent: IGrid;
    private obj: MaskedTextBox;
    private column: Column;

    constructor(parentInstance?: IGrid) {
        //constructor
        this.parent = parentInstance;
    }

    public create(args: { column: Column, value: string }): Element {
        //create
        let columnField: string = getComplexFieldID(args.column.field);
        return this.parent.createElement('input', {
            className: 'e-field', attrs: {
                id: this.parent.element.id + columnField,
                name: columnField, type: 'text', 'e-mappinguid': args.column.uid,
            }
        });
    }

    public write(args: { rowData: Object, element: Element, column: Column, row: HTMLElement, requestType: string }): void {
        this.column = args.column;
        let isInlineEdit: boolean = this.parent.editSettings.mode !== 'Dialog';
        this.obj = new MaskedTextBox(extend(
            {
            fields: { value: args.column.field },
            value: getObject(args.column.field, args.rowData),
            floatLabelType: isInlineEdit ? 'Never' : 'Always',
            mask: '000-000-0000',
            enabled: isEditable(args.column, args.requestType, args.element),
            },
            args.column.edit.params));
        this.obj.appendTo(args.element as HTMLElement);
    }

    public read(element: Element): string {
        return (<EJ2Intance>element).ej2_instances[0].value;
    }


    public destroy(): void {
        if (this.obj) {
            this.obj.destroy();
        }
    }
}