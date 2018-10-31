import { extend, Internationalization } from '@syncfusion/ej2-base';
import { IGrid, IEditCell } from '../base/interface';
import { Column } from '../models/column';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { isEditable, getComplexFieldID, getObject } from '../base/util';

/**
 * `NumericEditCell` is used to handle numeric cell type editing.
 * @hidden
 */
export class NumericEditCell implements IEditCell {

    private parent: IGrid;
    private obj: NumericTextBox;
    private instances: Internationalization;

    constructor(parent?: IGrid) {
        this.parent = parent;
    }

    public create(args: { column: Column, value: string }): Element {
        let complexFieldName: string = getComplexFieldID(args.column.field);
        this.instances = new Internationalization(this.parent.locale);
        return this.parent.createElement('input', {
            className: 'e-field', attrs: {
                id: this.parent.element.id + complexFieldName,
                name: complexFieldName, 'e-mappinguid': args.column.uid
            }
        });
    }

    public read(element: Element): number {
        let value: number = this.instances.getNumberParser({ format: 'n' })((<HTMLInputElement>element).value);
        return value;
    }

    public write(args: { rowData: Object, element: Element, column: Column, row: HTMLElement, requestType: string }): void {
        let col: Column = args.column;
        let isInline: boolean = this.parent.editSettings.mode !== 'Dialog';
        this.obj = new NumericTextBox(extend(
            {
                value: parseFloat(getObject(args.column.field, args.rowData)),
                enableRtl: this.parent.enableRtl,
                placeholder: isInline ? '' : args.column.headerText,
                enabled: isEditable(args.column, args.requestType, args.element),
                floatLabelType: this.parent.editSettings.mode !== 'Dialog' ? 'Never' : 'Always',
            },
            col.edit.params));
        this.obj.appendTo(args.element as HTMLElement);
        args.element.setAttribute('name', getComplexFieldID(args.column.field));
    }

    public destroy(): void {
        if (this.obj && !this.obj.isDestroyed) {
            this.obj.destroy();
        }
    }
}