import { Spreadsheet } from '../base/index';
import { IRowRenderer, ICellRenderer, CellRenderArgs } from '../common/index';
import { getRowHeight, SheetModel, getCell, isHiddenRow } from '../../workbook/base/index';
import { attributes } from '@syncfusion/ej2-base';
import { getCellAddress } from '../../workbook/common/index';

/**
 * Sheet module is used for creating row element
 * @hidden
 */
export class RowRenderer implements IRowRenderer {
    private parent: Spreadsheet;
    private element: HTMLTableRowElement;
    private cellRenderer: ICellRenderer;

    constructor(parent?: Spreadsheet) {
        this.parent = parent;
        this.element = this.parent.createElement('tr', { attrs: { 'role': 'row' } }) as HTMLTableRowElement;
        this.cellRenderer = parent.serviceLocator.getService<ICellRenderer>('cell');
    }

    public render(index?: number, isRowHeader?: boolean, skipHidden?: boolean): Element {
        let row: HTMLElement = this.element.cloneNode() as HTMLElement;
        if (index === undefined) {
            row.classList.add('e-header-row');
            return row;
        }
        row.classList.add('e-row');
        let sheet: SheetModel = this.parent.getActiveSheet();
        attributes(row, { 'aria-rowindex': (index + 1).toString() });
        row.style.height = `${getRowHeight(sheet, index)}px`;
        if (isRowHeader && !skipHidden) {
            if (isHiddenRow(sheet, index + 1) && !isHiddenRow(sheet, index - 1)) {
                row.classList.add('e-hide-start');
            }
            if (index !== 0 && isHiddenRow(sheet, index - 1) && !isHiddenRow(sheet, index + 1)) {
                row.classList.add('e-hide-end');
            }
        }
        return row;
    }

    public refresh(index: number, hRow?: Element): Element {
        let row: Element; let sheet: SheetModel = this.parent.getActiveSheet();
        if (hRow) {
            row = this.render(index);
            let len: number = this.parent.viewport.leftIndex + this.parent.viewport.colCount + (this.parent.getThreshold('col') * 2);
            for (let i: number = this.parent.viewport.leftIndex; i <= len; i++) {
                row.appendChild(this.cellRenderer.render(<CellRenderArgs>{ colIdx: i, rowIdx: index, cell: getCell(index, i, sheet),
                    address: getCellAddress(index, i), lastCell: i === len, row: row, hRow: hRow, isHeightCheckNeeded: true }));
            }
        } else {
            row = this.render(index, true, true);
            row.appendChild(this.cellRenderer.renderRowHeader(index));
        }
        return row;
    }
}