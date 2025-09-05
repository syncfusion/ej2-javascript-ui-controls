import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Column } from '../models/column';
import { Cell } from '../models/cell';
import { ICellRenderer } from '../base/interface';
import { CellRenderer } from './cell-renderer';
import { headerCellInfo } from '../base/constant';
import { setStyleAndAttributes, appendChildren, frozenDirection, isChildColumn, applyStickyLeftRightPosition } from '../base/util';

/**
 * StackedHeaderCellRenderer class which responsible for building stacked header cell content.
 *
 * @hidden
 */
export class StackedHeaderCellRenderer extends CellRenderer implements ICellRenderer<Column> {

    public element: HTMLElement = this.parent.createElement('TH', {
        className: 'e-headercell e-stackedheadercell', attrs: {
            tabindex: '-1', role: 'columnheader'
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
            attrs: { 'data-mappinguid': cell.column.uid }
        });
        const column: Column = cell.column;
        node.appendChild(div);
        if (!isNullOrUndefined(column.headerTemplate)) {
            appendChildren(div, column.getHeaderTemplate()(
                column, this.parent, 'headerTemplate', null, null, null, null, this.parent.root));
        } else {
            this.appendHtml(div, this.parent.sanitize(column.headerText), column.getDomSetter());
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
            const alignmentClassMap: { [key in string]?: string } = { right: 'e-rightalign', left: 'e-leftalign', center: 'e-centeralign', justify: 'e-justifyalign' };
            if (alignmentClassMap[cell.column.textAlign.toLowerCase()]) {
                node.classList.add(alignmentClassMap[cell.column.textAlign.toLowerCase()]);
            }
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
        if (cell.className) {
            node.classList.add(cell.className);
        }
        this.parent.trigger(headerCellInfo, {cell, node});
        if (frozenDirection(column) === 'Left' ) {
            node.classList.add('e-leftfreeze');
            if ((<{ border?: string }>column).border === 'Left') {
                node.classList.add('e-freezeleftborder');
            }
            if (column.index === 0) {
                applyStickyLeftRightPosition(node as HTMLElement, (this.parent.getIndentCount() * 30) , this.parent.enableRtl, 'Left');
            } else {
                const cols: Column[] = this.parent.getColumns();
                let width: number = this.parent.getIndentCount() * 30;
                for (let i: number = 0; i < cols.length; i++) {
                    if (column.index < cols[parseInt(i.toString(), 10)].index) {
                        break;
                    }
                    if (cols[parseInt(i.toString(), 10)].visible) {
                        width += parseFloat(cols[parseInt(i.toString(), 10)].width.toString());
                    }
                }
                applyStickyLeftRightPosition(node as HTMLElement, width, this.parent.enableRtl, 'Left');
            }
        } else if (frozenDirection(column) === 'Right') {
            node.classList.add('e-rightfreeze');
            const cols: Column[] = this.parent.getColumns();
            let width: number = this.parent.getFrozenMode() === 'Right' && this.parent.isRowDragable() ? 30 : 0;
            for (let i: number = cols.length - 1; i >= 0; i--) {
                if (isChildColumn(column, cols[parseInt(i.toString(), 10)].uid) || column.index > cols[parseInt(i.toString(), 10)].index) {
                    break;
                }
                if (cols[parseInt(i.toString(), 10)].visible) {
                    width += parseFloat(cols[parseInt(i.toString(), 10)].width.toString());
                }
            }
            applyStickyLeftRightPosition(node as HTMLElement, width, this.parent.enableRtl, 'Right');
            if ((<{ border?: string }>column).border === 'Right') {
                node.classList.add('e-freezerightborder');
            }
        } else if (frozenDirection(column) === 'Fixed') {
            node.classList.add('e-fixedfreeze');
            const cols: Column[] = this.parent.getColumns();
            let width: number = 0;
            if (this.parent.getVisibleFrozenLeftCount()) {
                width = this.parent.getIndentCount() * 30;
            } else if (this.parent.getFrozenMode() === 'Right') {
                width = this.parent.groupSettings.columns.length * 30;
            }
            for (let i: number = 0; i < cols.length; i++) {
                if (column.index > cols[parseInt(i.toString(), 10)].index) {
                    if ((cols[parseInt(i.toString(), 10)].freeze === 'Left' || cols[parseInt(i.toString(), 10)].isFrozen) ||
                        cols[parseInt(i.toString(), 10)].freeze === 'Fixed') {
                        if (cols[parseInt(i.toString(), 10)].visible) {
                            width += parseFloat(cols[parseInt(i.toString(), 10)].width.toString());
                        }
                    }
                }
            }
            applyStickyLeftRightPosition(node as HTMLElement, width - 1, this.parent.enableRtl, 'Left');
            width = this.parent.getFrozenMode() === 'Right' && this.parent.isRowDragable() ? 30 : 0;
            for (let i: number = cols.length - 1; i >= 0; i--) {
                if (column.index < cols[parseInt(i.toString(), 10)].index) {
                    if (isChildColumn(column, cols[parseInt(i.toString(), 10)].uid) ||
                        column.index > cols[parseInt(i.toString(), 10)].index) {
                        break;
                    }
                    if (cols[parseInt(i.toString(), 10)].freeze === 'Right' || cols[parseInt(i.toString(), 10)].freeze === 'Fixed') {
                        if (cols[parseInt(i.toString(), 10)].visible) {
                            width += parseFloat(cols[parseInt(i.toString(), 10)].width.toString());
                        }
                    }
                }
            }
            applyStickyLeftRightPosition(node as HTMLElement, width - 1, this.parent.enableRtl, 'Right');
        }
        else {
            node.classList.add('e-unfreeze');
        }
        return node;
    }
}
