import { Cell } from '../models/cell';
import { ICellRenderer } from '../base/interface';
import { IndentCellRenderer } from './indent-cell-renderer';
import { Column } from '../models/column';

/**
 * ExpandCellRenderer class which responsible for building group expand cell. 
 * @hidden
 */
export class ExpandCellRenderer extends IndentCellRenderer implements ICellRenderer<Column> {
    /**
     * Function to render the expand cell
     * @param  {Cell} cell
     * @param  {Object} data      
     */
    public render(cell: Cell<Column>, data: { field: string, key: string }): Element {
        let node: Element = this.element.cloneNode() as Element;
        node.className = 'e-recordplusexpand';
        node.setAttribute('ej-mappingname', data.field);
        node.setAttribute('ej-mappingvalue', data.key);
        node.setAttribute('aria-expanded', 'true');
        node.setAttribute('tabindex', '-1');
        node.appendChild(this.parent.createElement('div', { className: 'e-icons e-gdiagonaldown e-icon-gdownarrow' }));
        return node;
    }

}