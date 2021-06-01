import { isNullOrUndefined  } from '@syncfusion/ej2-base';
import { ICellRenderer } from '../base/interface';
import { CellRenderer } from './cell-renderer';
import { Column } from '../models/column';
import { Cell } from '../models/cell';

/**
 * ExpandCellRenderer class which responsible for building group expand cell.
 *
 * @hidden
 */
export class DetailExpandCellRenderer extends CellRenderer implements ICellRenderer<Column> {

    public element: HTMLElement = this.parent.createElement('TD', {
        className: 'e-detailrowcollapse',
        attrs: { 'aria-expanded': 'false', role: 'gridcell', tabindex: '-1' }
    });

    /**
     * Function to render the detail expand cell
     *
     * @param {Cell<Column>} cell - specifies the cell
     * @param {Object} data - specifies the data
     * @param {Object} attributes - specifies the attributes
     * @returns {Element} returns the element
     */
    public render(cell: Cell<Column>, data: Object, attributes?: Object): Element {
        const node: Element = this.element.cloneNode() as Element;
        if (attributes && !isNullOrUndefined(attributes['class'])) {
            node.className = '';
            node.className = attributes['class'];
            node.appendChild(this.parent.createElement('div', { className: 'e-icons e-dtdiagonaldown e-icon-gdownarrow' }));
        } else {

            node.appendChild(this.parent.createElement('div', { className: 'e-icons e-dtdiagonalright e-icon-grightarrow' }));
        }

        return node;
    }

}
