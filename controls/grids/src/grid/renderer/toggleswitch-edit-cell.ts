import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { IEditCell } from '../base/interface';
import { Row } from '../models/row';
import { Column } from '../models/column';
import { Switch, ChangeEventArgs } from '@syncfusion/ej2-buttons';
import { extend } from '@syncfusion/ej2-base';
import { isEditable, addRemoveActiveClasses, createEditElement, getObject } from '../base/util';
import * as literals from '../base/string-literals';
import { EditCellBase } from './edit-cell-base';

/**
 * `ToggleEditCell` is used to handle boolean cell type editing.
 *
 * @hidden
 */
export class ToggleEditCell extends EditCellBase implements IEditCell {
    private editRow: HTMLElement;
    private editType: string;
    private activeClasses: string[] = ['e-selectionbackground', 'e-active'];

    public create(args: { column: Column, value: string, type: string }): Element {
        let clsNames: string = 'e-field e-boolcell';
        if (args.column.type === 'checkbox') {
            clsNames = 'e-field e-boolcell e-edit-checkselect';
        }
        return createEditElement(this.parent, args.column, clsNames, { type: 'checkbox', value: args.value });
    }

    public read(element: Element): boolean {
        return (<HTMLInputElement>element).checked;
    }

    public write(args: { rowData: Object, element: Element, column: Column, requestType: string, row: Element }): void {
        const chkBoxElement: Element = !isNullOrUndefined(args.row) && args.row.querySelector('.e-edit-checkselect') as Element;
        const data: object = getObject(args.column.field, args.rowData);
        let checkState: boolean = data && JSON.parse(data.toString().toLowerCase());
        if (!isNullOrUndefined(chkBoxElement)) {
            this.editType = this.parent.editSettings.mode;
            this.editRow = args.row as HTMLElement;
            if (args.requestType !== 'add') {
                const row: Row<Column> = this.parent.getRowObjectFromUID(args.row.getAttribute('data-uid'));
                checkState = row ? row.isSelected : false;
            }
            addRemoveActiveClasses([].slice.call(args.row.getElementsByClassName(literals.rowCell)), checkState, ...this.activeClasses);
        }
        this.obj = new Switch(
            extend(
                {
                    label: this.parent.editSettings.mode !== 'Dialog' ? ' ' : args.column.headerText,
                    checked: checkState,
                    disabled: !isEditable(args.column, args.requestType, args.element), enableRtl: this.parent.enableRtl,
                    change: this.switchModeChange.bind(this),
                    cssClass: this.parent.cssClass ? this.parent.cssClass : ''
                },
                args.column.edit.params));
        this.obj.appendTo(args.element as HTMLElement);
    }

    private switchModeChange(args: ChangeEventArgs): void {
        if (this.editRow && this.editType !== 'Dialog') {
            let addClass: boolean = false;
            if (!args.checked) {
                this.editRow.removeAttribute('aria-selected');
            } else {
                addClass = true;
                this.editRow.setAttribute('aria-selected', addClass.toString());
            }
            addRemoveActiveClasses([].slice.call(this.editRow.getElementsByClassName(literals.rowCell)), addClass, ...this.activeClasses);
        }
    }
}
