import { extend } from '@syncfusion/ej2-base';
import { IGrid, EJ2Intance, IEditCell } from '../base/interface';
import { Column } from '../models/column';
import { ComboBox } from '@syncfusion/ej2-dropdowns';
import { Query, DataManager, DataUtil } from '@syncfusion/ej2-data';
import { isEditable, getComplexFieldID, getObject } from '../base/util';



/**
 * `ComboBoxEditCell` is used to handle ComboBoxEdit cell type editing.
 * @hidden
 */
export class ComboboxEditCell implements IEditCell {


    private parent: IGrid;
    private obj: ComboBox;
    private column: Column;

    constructor(parentObject?: IGrid) {
        //constructor
        this.parent = parentObject;
    }

    public create(args: { column: Column, value: string }): Element {
        //create
        let fieldName: string = getComplexFieldID(args.column.field);
        return this.parent.createElement('input', {
            className: 'e-field', attrs: {
                id: this.parent.element.id + fieldName,
                name: fieldName, type: 'text', 'e-mappinguid': args.column.uid,
            }
        });
    }

    public write(args: { rowData: Object, element: Element, column: Column, row: HTMLElement, requestType: string }): void {
        this.column = args.column;
        let isInlineMode: boolean = this.parent.editSettings.mode !== 'Dialog';
        this.obj = new ComboBox(extend(
            {
                dataSource: this.parent.dataSource instanceof DataManager ?
                this.parent.dataSource : new DataManager(this.parent.dataSource),
                query: new Query().select(args.column.field),
                fields: { value: args.column.field },
                value: getObject(args.column.field, args.rowData),
                enableRtl: this.parent.enableRtl, actionComplete: this.finalValue.bind(this),
                placeholder: isInlineMode ? '' : args.column.headerText,
                floatLabelType: isInlineMode ? 'Never' : 'Always',
                enabled: isEditable(args.column, args.requestType, args.element),
            },
            args.column.edit.params));
        this.obj.appendTo(args.element as HTMLElement);
    }

    public read(inputEle: Element): string {
        return (<EJ2Intance>inputEle).ej2_instances[0].value;
    }

    private finalValue(val: { result: Object[] }): void {
        val.result = DataUtil.distinct(val.result, this.obj.fields.value, true);
        if ((<DataManager>this.column.dataSource)) {
            (<DataManager>this.column.dataSource).dataSource.json = val.result;
        }
    }

    public destroy(): void {
        if (this.obj) {
            this.obj.destroy();
        }
    }

}