import { extend, isBlazor } from '@syncfusion/ej2-base';
import { IGrid, EJ2Intance, IEditCell } from '../base/interface';
import { Column } from '../models/column';
import { AutoComplete } from '@syncfusion/ej2-dropdowns';
import { Query, DataManager, DataUtil } from '@syncfusion/ej2-data';
import { isEditable, getComplexFieldID, getObject } from '../base/util';

/**
 * `AutoCompleteEditCell` is used to handle autocomplete cell type editing.
 * @hidden
 */
export class AutoCompleteEditCell implements IEditCell {

    private parentObj: IGrid;
    private object: AutoComplete;
    private column: Column;

    constructor(parent?: IGrid) {
        //constructor
        this.parentObj = parent;
    }


    public create(args: { column: Column, values: string }): Element {
    //create 
        let complexFieldName: string = getComplexFieldID(args.column.field);
        return this.parentObj.createElement('input', {
             className: 'e-field', attrs: {
            id: this.parentObj.element.id + complexFieldName,
            name: complexFieldName, type: 'text', 'e-mappinguid': args.column.uid,
        }
    });
}

    public write(args: { rowData: Object, element: Element, column: Column, rowElement: HTMLElement, requestType: string }): void {
        this.column = args.column;
        let isInlineEdit: boolean = this.parentObj.editSettings.mode !== 'Dialog';
        this.object = new AutoComplete(extend(
            {
                dataSource: this.parentObj.dataSource instanceof DataManager ?
                this.parentObj.dataSource : new DataManager(this.parentObj.dataSource),
                query: new Query().select(args.column.field), enabled: isEditable(args.column, args.requestType, args.element),
                fields: { value: args.column.field },
                value: getObject(args.column.field, args.rowData),
               // enableRtl: this.parentObject.enableRtl,
                actionComplete: this.selectedValues.bind(this),
                placeholder: isInlineEdit ? '' : args.column.headerText,
                floatLabelType: isInlineEdit ? 'Never' : 'Always'
            },
            args.column.edit.params));
        if (isBlazor()) {
            this.object.locale = this.parentObj.locale;
        }
        this.object.appendTo(args.element as HTMLElement);
        /* tslint:disable-next-line:no-any */
        args.element.setAttribute('name', getComplexFieldID(args.column.field));
    }

    public read(element: Element): string {
        return (<EJ2Intance>element).ej2_instances[0].value;
    }

    private selectedValues(valObj: {result: Object[] }): void {
        valObj.result = DataUtil.distinct(valObj.result, this.object.fields.value, true);
        if ((<DataManager>this.column.dataSource)) {
            (<DataManager>this.column.dataSource).dataSource.json = valObj.result;
        }
    }

    public destroy(): void {
        if (this.object) {
            this.object.destroy();
        }
    }
}