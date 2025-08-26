import { IGrid } from '../base/interface';
import { classList } from '@syncfusion/ej2-base';
import { Column } from '../models/column';
import * as literals from '../base/string-literals';

/**
 * Edit render module is used to render grid edit row.
 *
 * @hidden
 */
export class BatchEditRender {
    //Internal variables

    //Module declarations
    private parent: IGrid;

    /**
     * Constructor for render module
     *
     * @param {IGrid} parent - specifies the IGrid
     */
    constructor(parent?: IGrid) {
        this.parent = parent;
    }

    public update(elements: Element[], args: { columnObject?: Column, cell?: Element, row?: Element }): void {
        if (this.parent.isReact && args.columnObject && args.columnObject.template) {
            const parentRow: HTMLTableRowElement = args.cell.parentElement as HTMLTableRowElement;
            const newTd: HTMLTableCellElement = args.cell.cloneNode(true) as HTMLTableCellElement;
            parentRow.insertBefore(newTd, args.cell);
            newTd.focus();
            args.cell.remove();
            args.cell = newTd;
        }
        args.cell.setAttribute('aria-label', args.cell.innerHTML + this.parent.localeObj.getConstant('ColumnHeader') + args.columnObject.field);
        args.cell.innerHTML = '';
        args.cell.appendChild(this.getEditElement(elements, args));
        args.cell.classList.add('e-editedbatchcell');
        classList(args.row, [literals.editedRow, 'e-batchrow'], []);
    }

    private getEditElement(elements: Object, args: { columnObject?: Column, cell?: Element, row?: Element }): Element {
        const gObj: IGrid = this.parent;
        const form: HTMLFormElement = this.parent
            .createElement('form', { id: gObj.element.id + 'EditForm', className: 'e-gridform' }) as HTMLFormElement;
        form.appendChild(elements[args.columnObject.uid]);
        if (args.columnObject.editType === 'booleanedit') {
            args.cell.classList.add('e-boolcell');
        }
        if (!args.columnObject.editType) {
            args.cell.classList.add('e-inputbox');
        }
        return form;
    }
}

