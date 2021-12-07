import { extend } from '@syncfusion/ej2-base';
import { IEditCell } from '../base/interface';
import { Column } from '../models/column';
import { AutoComplete } from '@syncfusion/ej2-dropdowns';
import { Query, DataManager, DataUtil } from '@syncfusion/ej2-data';
import { isEditable, getComplexFieldID, getObject } from '../base/util';
import { EditCellBase } from './edit-cell-base';

/**
 * `AutoCompleteEditCell` is used to handle autocomplete cell type editing.
 *
 * @hidden
 */
export class AutoCompleteEditCell extends EditCellBase implements IEditCell {
    private object: AutoComplete;
    private column: Column;

    public write(args: { rowData: Object, element: Element, column: Column, rowElement: HTMLElement, requestType: string }): void {
        this.column = args.column;
        const isInlineEdit: boolean = this.parent.editSettings.mode !== 'Dialog';
        this.object = new AutoComplete(extend(
            {
                dataSource: this.parent.dataSource instanceof DataManager ?
                    this.parent.dataSource : new DataManager(this.parent.dataSource),
                query: new Query().select(args.column.field), enabled: isEditable(args.column, args.requestType, args.element),
                fields: { value: args.column.field },
                value: getObject(args.column.field, args.rowData),
                // enableRtl: this.parentect.enableRtl,
                actionComplete: this.selectedValues.bind(this),
                placeholder: isInlineEdit ? '' : args.column.headerText,
                floatLabelType: isInlineEdit ? 'Never' : 'Always'
            },
            args.column.edit.params));
        this.object.appendTo(args.element as HTMLElement);
        /* tslint:disable-next-line:no-any */
        args.element.setAttribute('name', getComplexFieldID(args.column.field));
    }

    private selectedValues(valObj: {result: Object[] }): void {
        valObj.result = DataUtil.distinct(valObj.result, this.object.fields.value, true);
        if ((<DataManager>this.column.dataSource)) {
            (<DataManager>this.column.dataSource).dataSource.json = valObj.result;
        }
    }
}
