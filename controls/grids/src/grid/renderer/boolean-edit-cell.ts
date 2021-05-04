import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { IEditCell, IGrid } from '../base/interface';
import { Row } from '../models/row';
import { Column } from '../models/column';
import { CheckBox, ChangeEventArgs } from '@syncfusion/ej2-buttons';
import { extend } from '@syncfusion/ej2-base';
import { isEditable, addRemoveActiveClasses, createEditElement, getObject } from '../base/util';
import * as literals from '../base/string-literals';
import { EditCellBase } from './edit-cell-base';

/**
 * `BooleanEditCell` is used to handle boolean cell type editing.
 * @hidden
 */
export class BooleanEditCell extends EditCellBase implements IEditCell {
    private editRow: HTMLElement;
    private editType: string;
    private activeClasses: string[] = ['e-selectionbackground', 'e-active'];

    public create(args: { column: Column, value: string, type: string }): Element {
        let col: Column = args.column;
        let classNames: string = 'e-field e-boolcell';
        if (col.type === 'checkbox') {
            classNames = 'e-field e-boolcell e-edit-checkselect';
        }
        return createEditElement(this.parent, args.column, classNames, { type: 'checkbox', value: args.value });
    }

    public read(element: Element): boolean {
        return (<HTMLInputElement>element).checked;
    }

    public write(args: { rowData: Object, element: Element, column: Column, requestType: string, row: Element }): void {
        let selectChkBox: Element;
        let chkState: boolean;
        if (!isNullOrUndefined(args.row)) {
            selectChkBox = args.row.querySelector('.e-edit-checkselect') as Element;
        }
        if (getObject(args.column.field, args.rowData)) {
            chkState = JSON.parse(getObject(args.column.field, args.rowData).toString().toLowerCase());
        }
        if (!isNullOrUndefined(selectChkBox) && args.column.type === 'checkbox') {
            this.editType = this.parent.editSettings.mode;
            this.editRow = args.row as HTMLElement;
            if (args.requestType !== 'add') {
                let row: Row<Column> = this.parent.getRowObjectFromUID(args.row.getAttribute('data-uid'));
                chkState = row ? row.isSelected : false;
            }
            addRemoveActiveClasses([].slice.call(args.row.getElementsByClassName(literals.rowCell)), chkState, ...this.activeClasses);
        }
        this.obj = new CheckBox(
            extend(
                {
                    label: this.parent.editSettings.mode !== 'Dialog' ? ' ' : args.column.headerText,
                    checked: chkState,
                    disabled: !isEditable(args.column, args.requestType, args.element), enableRtl: this.parent.enableRtl,
                    change: this.checkBoxChange.bind(this)
                },
                args.column.edit.params));
        this.obj.appendTo(args.element as HTMLElement);
    }

    private checkBoxChange(args: ChangeEventArgs): void {
        if (this.editRow && this.editType !== 'Dialog') {
            let add: boolean = false;
            if (!args.checked) {
                this.editRow.removeAttribute('aria-selected');
            } else {
                add = true;
                this.editRow.setAttribute('aria-selected', add.toString());
            }
            addRemoveActiveClasses([].slice.call(this.editRow.getElementsByClassName(literals.rowCell)), add, ...this.activeClasses);
        }
    }
}
