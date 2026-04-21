import { Cell } from '../models/cell';
import { ICellRenderer } from '../base/interface';
import { CellRenderer } from './cell-renderer';
import { Column } from '../models/column';

/**
 * DetailHeaderIndentCellRenderer class which responsible for building detail header indent cell.
 *
 * @hidden
 */
export class DetailHeaderIndentCellRenderer extends CellRenderer implements ICellRenderer<Column> {

    public element: HTMLElement = this.parent.createElement('TH', { className: 'e-detailheadercell' });

    /**
     * Function to render the detail indent cell
     *
     * @param  {Cell} cell - specifies the cell
     * @param  {Object} data - specifies the data
     * @returns {Element} returns the element
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public render(cell: Cell<Column>, data: Object): Element {
        const node: Element = this.element.cloneNode() as Element;
        node.appendChild(this.parent.createElement('div', { className: 'e-emptycell' }));
        if (cell) {
            if (cell.rowSpan) {
                node.setAttribute('rowspan', cell.rowSpan.toString());
            }
            if (cell.rowSpan === 0) {
                (node as HTMLElement).style.display = 'none';
            }
        }
        return node;
    }

}
