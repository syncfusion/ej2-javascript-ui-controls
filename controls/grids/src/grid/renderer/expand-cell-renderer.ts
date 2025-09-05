import { Cell } from '../models/cell';
import { ICellRenderer } from '../base/interface';
import { IndentCellRenderer } from './indent-cell-renderer';
import { Column } from '../models/column';
import { CellType } from '../base/enum';

/**
 * ExpandCellRenderer class which responsible for building group expand cell.
 *
 * @hidden
 */
export class ExpandCellRenderer extends IndentCellRenderer implements ICellRenderer<Column> {
    /**
     * Function to render the expand cell
     *
     * @param {Cell} cell - specifies the cell
     * @param {Object} data - specifies the data
     * @param {string} data.field - Defines the field
     * @param {string} data.key - Defines the key
     * @param {Object} attr - specifies the attribute
     * @param {boolean} isExpand - specifies isexpand
     * @returns {Element} returns the element
     */
    public render(cell: Cell<Column>, data: { field: string, key: string }, attr?: { [x: string]: string }, isExpand?: boolean): Element {
        const node: Element = this.element.cloneNode() as Element;
        node.setAttribute('data-mappingname', data.field);
        node.setAttribute('data-mappingvalue', data.key);
        node.setAttribute('aria-expanded', isExpand ? 'true' : 'false');
        node.setAttribute('tabindex', '-1');
        if (this.parent.infiniteScrollSettings && this.parent.infiniteScrollSettings.enableCache &&
            !this.parent.groupSettings.enableLazyLoading) {
            cell.cellType = CellType.Indent;
            node.className = isExpand ? 'e-recordplusexpand e-disablepointer' : 'e-recordpluscollapse e-disablepointer';
        }
        else {
            node.className = isExpand ? 'e-recordplusexpand' : 'e-recordpluscollapse';
            node.appendChild(this.parent.createElement('a', {
                className: isExpand ? 'e-icons e-gdiagonaldown e-icon-gdownarrow' : 'e-icons e-gnextforward e-icon-grightarrow',
                attrs: { href: '#', 'title': isExpand ? this.localizer.getConstant('Expanded') : this.localizer.getConstant('Collapsed') }
            }));
        }
        return node;
    }

}
