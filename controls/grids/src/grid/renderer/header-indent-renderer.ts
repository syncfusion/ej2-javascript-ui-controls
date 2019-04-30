import { Cell } from '../models/cell';
import { ICellRenderer } from '../base/interface';
import { CellRenderer } from './cell-renderer';
import { Column } from '../models/column';

/**
 * HeaderIndentCellRenderer class which responsible for building header indent cell. 
 * @hidden
 */
export class HeaderIndentCellRenderer extends CellRenderer implements ICellRenderer<Column> {

    public element: HTMLElement = this.parent.createElement('TH', { className: 'e-grouptopleftcell' });

    /**
     * Function to render the indent cell
     * @param  {Cell} cell
     * @param  {Object} data        
     */
    public render(cell: Cell<Column>, data: Object): Element {
        let node: Element = this.element.cloneNode() as Element;
        node.appendChild(this.parent.createElement('div', { className: 'e-headercelldiv e-emptycell', innerHTML: '' }));
        return node;
    }

}