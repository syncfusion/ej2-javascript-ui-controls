import { ICellRenderer } from '../base/interface';
import { CellRenderer } from './cell-renderer';
import { Column } from '../models/column';
import { Cell } from '../models/cell';
import { applyStickyLeftRightPosition } from '../base/util';

/**
 * ExpandCellRenderer class which responsible for building group expand cell.
 *
 * @hidden
 */
export class RowDragDropRenderer extends CellRenderer implements ICellRenderer<Column> {

    public element: HTMLElement = this.parent.createElement('TD', {
        className: 'e-rowdragdrop e-rowdragdropcell',
        attrs: { tabindex: '-1', role: 'gridcell' }
    });

    /**
     * Function to render the detail expand cell
     *
     * @param {Cell<Column>} cell - specifies the cell
     * @param {Object} data - specifies the data
     * @returns {Element} returns the element
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public render(cell: Cell<Column>, data: Object): Element {
        const nodeElement: Element = this.element.cloneNode() as Element;
        nodeElement.appendChild(this.parent.createElement('div', {
            className: 'e-icons e-rowcelldrag e-dtdiagonalright e-icon-rowdragicon',
            attrs: { 'aria-hidden': 'true' }
        }));
        if (cell.isSelected) {
            nodeElement.classList.add('e-selectionbackground');
            nodeElement.classList.add('e-active');
        }
        if (this.parent.getVisibleFrozenRightCount() || this.parent.getVisibleFrozenLeftCount()) {
            nodeElement.classList.add('e-leftfreeze');
            const width: number = this.parent.getFrozenMode() === 'Right' ? 0 : this.parent.groupSettings.columns.length * 30;
            applyStickyLeftRightPosition(nodeElement as HTMLElement, width, this.parent.enableRtl,
                                         this.parent.getFrozenMode() === 'Right' ? 'Right' : 'Left');
        }
        return nodeElement;
    }
}
