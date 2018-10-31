import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Column } from '../models/column';
import { Cell } from '../models/cell';
import { ICellRenderer } from '../base/interface';
import { CellRenderer } from './cell-renderer';
import { headerCellInfo } from '../base/constant';

/**
 * StackedHeaderCellRenderer class which responsible for building stacked header cell content.
 * @hidden 
 */
export class StackedHeaderCellRenderer extends CellRenderer implements ICellRenderer<Column> {

    public element: HTMLElement = this.parent.createElement('TH', {
        className: 'e-headercell e-stackedheadercell', attrs: {
            role: 'columnheader',
            tabindex: '-1'
        }
    });

    /**
     * Function to render the cell content based on Column object.
     * @param  {Column} column
     * @param  {Object} data     
     * @param  {Element}
     */
    public render(cell: Cell<Column>, data: Object, attributes?: { [x: string]: Object }): Element {

        let node: Element = this.element.cloneNode() as Element;
        let div : Element = this.parent.createElement('div', {className: 'e-stackedheadercelldiv'});
        node.appendChild(div);
        div.innerHTML = cell.column.headerText;

        if (cell.column.toolTip) {
            node.setAttribute('title', cell.column.toolTip);
        }

        if (!isNullOrUndefined(cell.column.textAlign)) {
            (div as HTMLElement).style.textAlign = cell.column.textAlign;
        }

        node.setAttribute('colspan', cell.colSpan.toString());
        node.setAttribute('aria-colspan', cell.colSpan.toString());
        node.setAttribute('aria-rowspan', '1');
        this.parent.trigger(headerCellInfo, {cell, node});
        return node;
    }

}