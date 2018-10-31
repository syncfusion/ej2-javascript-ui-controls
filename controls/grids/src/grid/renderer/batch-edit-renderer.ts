import { IGrid } from '../base/interface';
import { classList } from '@syncfusion/ej2-base';
import { Column } from '../models/column';

/**
 * Edit render module is used to render grid edit row.
 * @hidden
 */
export class BatchEditRender {
    //Internal variables              

    //Module declarations
    private parent: IGrid;

    /**
     * Constructor for render module
     */
    constructor(parent?: IGrid) {
        this.parent = parent;
    }

    public update(elements: Element[], args: { columnObject?: Column, cell?: Element, row?: Element }): void {
        args.cell.innerHTML = '';
        args.cell.appendChild(this.getEditElement(elements, args));
        args.cell.classList.add('e-editedbatchcell');
        classList(args.row, ['e-editedrow', 'e-batchrow'], []);
    }

    private getEditElement(elements: Object, args: { columnObject?: Column, cell?: Element, row?: Element }): Element {
        let gObj: IGrid = this.parent;
        let form: HTMLFormElement = this.parent
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

    public removeEventListener(): void {
        //To destroy the renderer
    }
}

