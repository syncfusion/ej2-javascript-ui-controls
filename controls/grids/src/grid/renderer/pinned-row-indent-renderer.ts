import { Cell } from '../models/cell';
import { ICellRenderer } from '../base/interface';
import { CellRenderer } from './cell-renderer';
import { Column } from '../models/column';

/**
 * PinnedRowIndentCellRenderer class which responsible for building indent cell for pinned rows at top.
 *
 * @hidden
 */
export class PinnedRowIndentCellRenderer extends CellRenderer implements ICellRenderer<Column> {

    public element: HTMLElement = this.parent.createElement('TD', {
        className: 'e-pindentcell',
        attrs: { tabindex: '-1', role: 'gridcell' }
    });

    /**
     * Function to render the pinned row indent cell.
     *
     * @param  {Cell} cell - specifies the cell
     * @param  {Object} data - specifies the data
     * @returns {Element} returns the element
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public render(cell: Cell<Column>, data: Object): Element {
        const node: Element = this.element.cloneNode() as Element;
        node.appendChild(this.parent.createElement('div', { className: 'e-emptycell', innerHTML: '' }));
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
