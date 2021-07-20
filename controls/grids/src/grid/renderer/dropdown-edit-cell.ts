import { extend, isNullOrUndefined, select } from '@syncfusion/ej2-base';
import { IGrid, EJ2Intance, IEditCell } from '../base/interface';
import { Column } from '../models/column';
import { DropDownList, DropDownListModel, FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import { Query, DataManager, DataUtil, Predicate } from '@syncfusion/ej2-data';
import { isEditable, getComplexFieldID, getObject } from '../base/util';
import { Dialog, Popup } from '@syncfusion/ej2-popups';
import { parentsUntil } from '../base/util';
import { EditCellBase } from './edit-cell-base';
import * as literals from '../base/string-literals';
import * as events from '../base/constant';

/**
 * `DropDownEditCell` is used to handle dropdown cell type editing.
 *
 * @hidden
 */
export class DropDownEditCell extends EditCellBase implements IEditCell {

    private column: Column;
    private flag: boolean;
    private ddCreated: Function;
    private ddBeforeOpen: Function;
    private ddOpen: Function;
    private ddComplete: Function;

    constructor(parent?: IGrid) {
        //constructor
        super();
        this.parent = parent;
        this.flag = false;
        this.removeEventHandler = this.removeEventListener;
    }

    public write(args: { rowData: Object, element: Element, column: Column, row: HTMLElement, requestType: string }): void {
        const isInline: boolean = this.parent.editSettings.mode !== 'Dialog';
        this.column = args.column;
        const pred: Predicate = new Predicate(args.column.field, 'notequal', null, true, false);
        const params: DropDownListModel = {};
        if (args.column.edit.params) {
            const keys: string[] = Object.keys(args.column.edit.params);
            for (let i: number = 0; i < keys.length; i++) {
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
                enableRtl: this.parent.enableRtl,
                placeholder: isInline ? '' : args.column.headerText, popupHeight: '200px',
                floatLabelType: isInline ? 'Never' : 'Always',
                sortOrder: 'Ascending'
            },
            params));
        if (this.parent.enableVirtualization) {
            this.obj.dataSource = [args.rowData] as string[];
        }
        this.addEventListener();
        this.obj.query.params = this.parent.query.params;
        this.obj.appendTo(args.element as HTMLElement);
        /* tslint:disable-next-line:no-any */
        args.element.setAttribute('name', getComplexFieldID(args.column.field));
    }

    private addEventListener(): void {
        this.ddCreated = this.dropdownCreated.bind(this);
        this.ddOpen = this.dropDownOpen.bind(this);
        this.ddBeforeOpen = this.dropdownBeforeOpen.bind(this);
        this.ddComplete = this.ddActionComplete.bind(this);

        this.obj.addEventListener(literals.create, this.ddCreated);
        this.obj.addEventListener(literals.open, this.ddOpen);
        this.obj.addEventListener(literals.beforeOpen, this.ddBeforeOpen);
        this.obj.addEventListener(events.actionComplete, this.ddComplete);
    }

    private removeEventListener(): void {
        if (this.obj.isDestroyed) { return; }
        this.obj.removeEventListener(literals.create, this.ddCreated);
        this.obj.removeEventListener(literals.open, this.ddOpen);
        this.obj.removeEventListener(literals.beforeOpen, this.ddBeforeOpen);
        this.obj.removeEventListener(events.actionComplete, this.ddComplete);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private dropdownCreated(e: FilteringEventArgs): void {
        this.flag = true;
    }

    private dropdownBeforeOpen(): void {
        if (this.parent.enableVirtualization) {
            (this.obj as DropDownList).dataSource = this.parent.dataSource instanceof DataManager ?
                this.parent.dataSource : new DataManager(this.parent.dataSource);
        }
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
        const dlgElement: Element = parentsUntil(this.obj.element, 'e-dialog');
        if (this.parent.editSettings.mode === 'Dialog' && !isNullOrUndefined(dlgElement)) {
            const dlgObj: Dialog = (<EJ2Intance>select('#' + dlgElement.id, document)).ej2_instances[0];
            args.popup.element.style.zIndex = (dlgObj.zIndex + 1).toString();
        }
    }
}
