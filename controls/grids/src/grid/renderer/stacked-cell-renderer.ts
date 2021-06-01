import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Column } from '../models/column';
import { Cell } from '../models/cell';
import { ICellRenderer } from '../base/interface';
import { CellRenderer } from './cell-renderer';
import { headerCellInfo } from '../base/constant';
import { setStyleAndAttributes, appendChildren } from '../base/util';

/**
 * StackedHeaderCellRenderer class which responsible for building stacked header cell content.
 *
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
     *
     * @param {Cell<Column>} cell - specifies the cell
     * @param {Object} data - specifies the data
     * @param {object} attributes - specifies the attributes
     * @returns {Element} returns the element
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public render(cell: Cell<Column>, data: Object, attributes?: { [x: string]: Object }): Element {

        const node: Element = this.element.cloneNode() as Element;
        const div : Element = this.parent.createElement('div', {
            className: 'e-stackedheadercelldiv',
            attrs: { 'e-mappinguid': cell.column.uid }
        });
        const column: Column = cell.column;
        node.appendChild(div);
        if (!isNullOrUndefined(column.headerTemplate)) {
            appendChildren(div, column.getHeaderTemplate()(column, this.parent, 'headerTemplate'));
        } else {
            this.appendHtml(div, column.headerText, column.getDomSetter());
        }

        if (cell.column.toolTip) {
            node.setAttribute('title', cell.column.toolTip);
        }

        if (column.clipMode === 'Clip' || (!column.clipMode && this.parent.clipMode === 'Clip')) {
            node.classList.add('e-gridclip');
        } else if (column.clipMode === 'EllipsisWithTooltip' || (!column.clipMode && this.parent.clipMode === 'EllipsisWithTooltip')) {
            node.classList.add('e-ellipsistooltip');
        }

        if (!isNullOrUndefined(cell.column.textAlign)) {
            (div as HTMLElement).style.textAlign = cell.column.textAlign;
        }

        if (cell.column.customAttributes) {
            setStyleAndAttributes(node as HTMLElement, cell.column.customAttributes);
        }

        node.setAttribute('colspan', cell.colSpan.toString());
        node.setAttribute('aria-colspan', cell.colSpan.toString());
        node.setAttribute('aria-rowspan', '1');
        if (this.parent.allowResizing) {
            const handler: HTMLElement = this.parent.createElement('div');
            handler.className = cell.column.allowResizing ? 'e-rhandler e-rcursor' : 'e-rsuppress';
            node.appendChild(handler);
        }
        this.parent.trigger(headerCellInfo, {cell, node});
        return node;
    }
}
