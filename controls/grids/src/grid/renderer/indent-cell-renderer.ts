import { setStyleAndAttributes } from '../base/util';
import { Cell } from '../models/cell';
import { Column } from '../models/column';
import { ICellRenderer } from '../base/interface';
import { CellRenderer } from './cell-renderer';

/**
 * IndentCellRenderer class which responsible for building group indent cell.
 *
 * @hidden
 */
export class IndentCellRenderer extends CellRenderer implements ICellRenderer<Column> {

    public element: HTMLElement = this.parent.createElement('TD', { className: 'e-indentcell' });

    /**
     * Function to render the indent cell
     *
     * @param  {Cell} cell - specifies the cell
     * @param  {Object} data - specifies the data
     * @returns {Element} returns the element
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public render(cell: Cell<Column>, data: Object): Element {
        const node: Element = this.element.cloneNode() as Element;

        setStyleAndAttributes(node, cell.attributes);

        return node;
    }

}
