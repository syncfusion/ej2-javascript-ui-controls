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
     * @param  {{ [x: string]: string }} attr  
     * @param {boolean} isExpand   
     */
    public render(cell: Cell<Column>, data: { field: string, key: string }, attr?: { [x: string]: string }, isExpand?: boolean): Element {
        let node: Element = this.element.cloneNode() as Element;
        node.className = isExpand ? 'e-recordplusexpand' : 'e-recordpluscollapse';
        node.setAttribute('ej-mappingname', data.field);
        node.setAttribute('ej-mappingvalue', data.key);
        node.setAttribute('aria-expanded', isExpand ? 'true' : 'false');
        node.setAttribute('tabindex', '-1');
        node.appendChild(this.parent.createElement('div', {
            className: isExpand ? 'e-icons e-gdiagonaldown e-icon-gdownarrow' : 'e-icons e-gnextforward e-icon-grightarrow'
        }));
        return node;
    }

}