import { extend, isNullOrUndefined, select } from '@syncfusion/ej2-base';
import { IGrid, EJ2Intance, IEditCell } from '../base/interface';
import { Column } from '../models/column';
import { DropDownList, DropDownListModel, FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import { Query, DataManager, DataUtil, Predicate } from '@syncfusion/ej2-data';
import { isEditable, getComplexFieldID, getObject } from '../base/util';
import { Dialog, Popup } from '@syncfusion/ej2-popups';
import { parentsUntil } from '../base/util';
import { EditCellBase } from './edit-cell-base';

/**
 * `DropDownEditCell` is used to handle dropdown cell type editing.
 * @hidden
 */
export class DropDownEditCell extends EditCellBase implements IEditCell {

    private column: Column;
    private flag: boolean;

    constructor(parent?: IGrid) {
        //constructor
        super();
        this.parent = parent;
        this.flag = false;
    }

    public write(args: { rowData: Object, element: Element, column: Column, row: HTMLElement, requestType: string }): void {
        let isInline: boolean = this.parent.editSettings.mode !== 'Dialog';
        this.column = args.column;
        let pred: Predicate = new Predicate(args.column.field, 'notequal', null, true, false);
        let params: DropDownListModel = {};
        if (args.column.edit.params) {
            let keys: string[] = Object.keys(args.column.edit.params);
            for (let i = 0; i < keys.length; i++) {
                params[keys[i]] = keys[i] === 'query' ? args.column.edit.params[keys[i]].clone() : args.column.edit.params[keys[i]];
            }
        }
        this.obj = new DropDownList(extend(
            {
                dataSource: this.parent.dataSource instanceof DataManager ?
                    this.parent.dataSource : new DataManager(this.parent.dataSource),
                query: new Query().where(pred).select(args.column.field), enabled: isEditable(args.column, args.requestType, args.element),
                fields: { value: args.column.field },
                value: getObject(args.column.field, args.rowData),
                enableRtl: this.parent.enableRtl, actionComplete: this.ddActionComplete.bind(this),
                created: this.dropdownCreated.bind(this),
                placeholder: isInline ? '' : args.column.headerText, popupHeight: '200px',
                floatLabelType: isInline ? 'Never' : 'Always', open: this.dropDownOpen.bind(this),
                sortOrder: 'Ascending'
            },
            params));
        this.obj.query.params = this.parent.query.params;
        this.obj.appendTo(args.element as HTMLElement);
        /* tslint:disable-next-line:no-any */
        args.element.setAttribute('name', getComplexFieldID(args.column.field));
    }

    private dropdownCreated(e: FilteringEventArgs): void {
        this.flag = true;
    }

    private ddActionComplete(e: { result: Object[] }): void {
        e.result = DataUtil.distinct(e.result, (this.obj as DropDownList).fields.value, true);
        if (this.flag && (<DataManager>this.column.dataSource)) {
            if ('result' in this.column.dataSource) {
                this.column.dataSource.result = e.result;
            } else if (this.column.dataSource instanceof DataManager) {
                (<DataManager>this.column.dataSource).dataSource.json = e.result;
            }
        }
        this.flag = false;
    }

    private dropDownOpen(args: { popup: Popup }): void {
        let dlgElement: Element = parentsUntil(this.obj.element, 'e-dialog');
        if (this.parent.editSettings.mode === 'Dialog' && !isNullOrUndefined(dlgElement)) {
            let dlgObj: Dialog = (<EJ2Intance>select('#' + dlgElement.id, document)).ej2_instances[0];
            args.popup.element.style.zIndex = (dlgObj.zIndex + 1).toString();
        }
    }
}