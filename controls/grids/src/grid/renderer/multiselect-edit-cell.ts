import { extend, getValue } from '@syncfusion/ej2-base';
import { IGrid, EJ2Intance, IEditCell } from '../base/interface';
import { Column } from '../models/column';
import { MultiSelect } from '@syncfusion/ej2-dropdowns';
import {  getComplexFieldID, } from '../base/util';
/**
 * `MultiSelectEditCell` is used to handle multiselect dropdown cell type editing.
 * @hidden
 */
export class MultiSelectEditCell implements IEditCell {
    private parent: IGrid;
    private obj: MultiSelect;
    private column: Column;

    constructor(parentObj?: IGrid) {
        //constructor
        this.parent = parentObj;
    }

    public create(args: { column: Column, value: string }): Element {
        //create
        let colName: string = getComplexFieldID(args.column.field);
        return this.parent.createElement('input', {
            className: 'e-field', attrs: {
                id: this.parent.element.id + colName,
                name: colName, type: 'text', 'e-mappinguid': args.column.uid,
            }
        });
    }

    public read(element: Element): string {
        return (<EJ2Intance>element).ej2_instances[0].value;
    }


    public write(args: { rowData: Object, element: Element, column: Column, row: HTMLElement, requestType: string }): void {
        this.column = args.column;
        let isInline: boolean = this.parent.editSettings.mode !== 'Dialog';
        this.obj = new MultiSelect(extend(
            {
                fields: {text: args.column.field, value: args.column.field},
                value: getValue(args.column.field, args.rowData),
                enableRtl: this.parent.enableRtl,
                placeholder: isInline ? '' : args.column.headerText, popupHeight: '200px',
                floatLabelType: isInline ? 'Never' : 'Always'
            },
            args.column.edit.params));
        this.obj.appendTo(args.element as HTMLElement);
        args.element.setAttribute('name', getComplexFieldID(args.column.field));
   }
    public destroy(): void {
        if (this.obj) {
            this.obj.destroy();
        }
    }
}