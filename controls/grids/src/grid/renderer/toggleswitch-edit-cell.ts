import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { IEditCell, IGrid } from '../base/interface';
import { Row } from '../models/row';
import { Column } from '../models/column';
import { Switch, ChangeEventArgs } from '@syncfusion/ej2-buttons';
import { extend } from '@syncfusion/ej2-base';
import { isEditable, addRemoveActiveClasses, getComplexFieldID, getObject } from '../base/util';

/**
 * `ToggleEditCell` is used to handle boolean cell type editing.
 * @hidden
 */
export class ToggleEditCell implements IEditCell {
    private parent: IGrid;
    private obj: Switch;
    private editRow: HTMLElement;
    private editType: string;
    private activeClasses: string[] = ['e-selectionbackground', 'e-active'];

    constructor(parentObject?: IGrid) {
        this.parent = parentObject;
    }

    public create(args: { column: Column, value: string, type: string }): Element {
        let col: Column = args.column;
        let classNames: string = 'e-field e-boolcell';
        if (col.type === 'checkbox') {
            classNames = 'e-field e-boolcell e-edit-checkselect';
        }
        let complexField: string = getComplexFieldID(args.column.field);
        return this.parent.createElement('input', {
            className: classNames, attrs: {
                type: 'checkbox', value: args.value, 'e-mappinguid': col.uid,
                id: this.parent.element.id + complexField,
                name: complexField
            }
        });
    }

    public read(element: Element): boolean {
        return (<HTMLInputElement>element).checked;
    }

    public write(args: { rowData: Object, element: Element, column: Column, requestType: string, row: Element }): void {
        let chkBoxElement: Element;
        let checkState: boolean;
       // let isAddRow : boolean =  args.requestType === 'add' || args.row.classList.contains('e-addedrow');
        if (!isNullOrUndefined(args.row)) {
            chkBoxElement = args.row.querySelector('.e-edit-checkselect') as Element;
        }
        if (getObject(args.column.field, args.rowData)) {
            checkState = JSON.parse(getObject(args.column.field, args.rowData).toString().toLowerCase());
        }
        if (!isNullOrUndefined(chkBoxElement)) {
            this.editType = this.parent.editSettings.mode;
            this.editRow = args.row as HTMLElement;
            if (args.requestType !== 'add') {
                let row: Row<Column> = this.parent.getRowObjectFromUID(args.row.getAttribute('data-uid'));
                checkState = row ? row.isSelected : false;
            }
            addRemoveActiveClasses([].slice.call(args.row.querySelectorAll('.e-rowcell')), checkState, ...this.activeClasses);
        }
        this.obj = new Switch(
            extend(
                {
                    label: this.parent.editSettings.mode !== 'Dialog' ? ' ' : args.column.headerText,
                    checked: checkState,
                    disabled: !isEditable(args.column, args.requestType, args.element), enableRtl: this.parent.enableRtl,
                    change: this.switchModeChange.bind(this)
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
            addRemoveActiveClasses([].slice.call(this.editRow.querySelectorAll('.e-rowcell')), addClass, ...this.activeClasses);
        }
    }

    public destroy(): void {
        if (this.obj) {
            this.obj.destroy();
        }
    }
}
