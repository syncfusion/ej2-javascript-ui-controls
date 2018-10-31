import { extend, isNullOrUndefined } from '@syncfusion/ej2-base';
import { IGrid, EJ2Intance, IEditCell } from '../base/interface';
import { Column } from '../models/column';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { Query, DataManager, DataUtil } from '@syncfusion/ej2-data';
import { isEditable, getComplexFieldID, getObject } from '../base/util';
import { Dialog, Popup } from '@syncfusion/ej2-popups';
import { parentsUntil } from '../base/util';

/**
 * `DropDownEditCell` is used to handle dropdown cell type editing.
 * @hidden
 */
export class DropDownEditCell implements IEditCell {


    private parent: IGrid;
    private obj: DropDownList;
    private column: Column;

    constructor(parent?: IGrid) {
        //constructor
        this.parent = parent;
    }

    public create(args: { column: Column, value: string }): Element {
        //create
        let complexFieldName: string = getComplexFieldID(args.column.field);
        return this.parent.createElement('input', {
            className: 'e-field', attrs: {
                id: this.parent.element.id + complexFieldName,
                name: complexFieldName, type: 'text', 'e-mappinguid': args.column.uid,
            }
        });
    }

    public write(args: { rowData: Object, element: Element, column: Column, row: HTMLElement, requestType: string }): void {
        this.column = args.column;
        let isInline: boolean = this.parent.editSettings.mode !== 'Dialog';
        this.obj = new DropDownList(extend(
            {
                dataSource: this.parent.dataSource instanceof DataManager ?
                    this.parent.dataSource : new DataManager(this.parent.dataSource),
                query: new Query().select(args.column.field), enabled: isEditable(args.column, args.requestType, args.element),
                fields: { value: args.column.field },
                value: getObject(args.column.field, args.rowData),
                enableRtl: this.parent.enableRtl, actionComplete: this.ddActionComplete.bind(this),
                placeholder: isInline ? '' : args.column.headerText, popupHeight: '200px',
                floatLabelType: isInline ? 'Never' : 'Always', open: this.dropDownOpen.bind(this),
                sortOrder: 'Ascending'
            },
            args.column.edit.params));
        this.obj.appendTo(args.element as HTMLElement);
        /* tslint:disable-next-line:no-any */
        args.element.setAttribute('name', getComplexFieldID(args.column.field));
    }

    public read(element: Element): string {
        return (<EJ2Intance>element).ej2_instances[0].value;
    }

    private ddActionComplete(e: { result: Object[] }): void {
        e.result = DataUtil.distinct(e.result, this.obj.fields.value, true);
        if ((<DataManager>this.column.dataSource)) {
            (<DataManager>this.column.dataSource).dataSource.json = e.result;
        }
    }

    private dropDownOpen(args: { popup: Popup }): void {
        let dlgElement: Element = parentsUntil(this.obj.element, 'e-dialog');
        if (this.parent.editSettings.mode === 'Dialog' && !isNullOrUndefined(dlgElement)) {
            let dlgObj: Dialog = (<EJ2Intance>this.parent.element.querySelector('#' + dlgElement.id)).ej2_instances[0];
            args.popup.element.style.zIndex = (dlgObj.zIndex + 1).toString();
        }
    }

    public destroy(): void {
        if (this.obj) {
            this.obj.destroy();
        }
    }

}