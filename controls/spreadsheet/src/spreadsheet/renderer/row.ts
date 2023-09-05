import { Spreadsheet } from '../base/index';
import { IRowRenderer, ICellRenderer, CellRenderArgs, isImported } from '../common/index';
import { getRowHeight, SheetModel, getCell, isHiddenRow, isHiddenCol } from '../../workbook/base/index';
import { attributes } from '@syncfusion/ej2-base';
import { getCellAddress, getCellIndexes, skipHiddenIdx } from '../../workbook/common/index';

/**
 * RowRenderer module is used for creating row element
 *
 * @hidden
 */
export class RowRenderer implements IRowRenderer {
    private parent: Spreadsheet;
    private element: HTMLTableRowElement;
    private cellRenderer: ICellRenderer;

    constructor(parent?: Spreadsheet) {
        this.parent = parent;
        this.element = this.parent.createElement('tr') as HTMLTableRowElement;
        this.cellRenderer = parent.serviceLocator.getService<ICellRenderer>('cell');
    }

    public render(index?: number, isRowHeader?: boolean, preventHiddenCls?: boolean): Element {
        const row: HTMLElement = this.element.cloneNode() as HTMLElement;
        if (index === undefined) {
            row.classList.add('e-header-row');
            return row;
        }
        row.classList.add('e-row');
        const sheet: SheetModel = this.parent.getActiveSheet();
        attributes(row, { 'aria-rowindex': (index + 1).toString() });
        const rowHeight: number = getRowHeight(sheet, index, true);
        row.style.height = `${rowHeight}px`;
        if (rowHeight < 20 ) {
            row.style.lineHeight =  rowHeight > 1 ? (rowHeight - 1) + 'px' : rowHeight + 'px';
        }
        if (isRowHeader && !preventHiddenCls) {
            if ( rowHeight < 20 ) {
                row.style.lineHeight = rowHeight >= 4 ? (rowHeight - 4) + 'px' :
                    rowHeight > 0 ? (rowHeight - 1) + 'px' : '0px';
                if (!row.classList.contains('e-reach-fntsize')) {
                    row.classList.add('e-reach-fntsize');
                }
            }
            if (isHiddenRow(sheet, index + 1) && !isHiddenRow(sheet, index - 1)) {
                row.classList.add('e-hide-start');
            }
            if (index !== 0 && isHiddenRow(sheet, index - 1) && !isHiddenRow(sheet, index + 1)) {
                row.classList.add('e-hide-end');
            }
        }
        return row;
    }

    public refresh(index: number, pRow: Element, hRow?: Element, header?: boolean, preventHiddenCls?: boolean): Element {
        const sheet: SheetModel = this.parent.getActiveSheet();
        let row: Element;
        if (header) {
            row = this.render(index, header, preventHiddenCls);
            this.cellRenderer.renderRowHeader(index, row);
        } else {
            let i: number; let len: number;
            const updateCells: Function = (): void => {
                while (i <= len) {
                    if (!isHiddenCol(sheet, i)) {
                        this.cellRenderer.render(
                            <CellRenderArgs>{ colIdx: i, rowIdx: index, cell: getCell(index, i, sheet), address: getCellAddress(index, i),
                                lastCell: i === len, row: row, hRow: hRow, isHeightCheckNeeded: true, pRow: pRow, first:
                                index === this.parent.viewport.topIndex && skipHiddenIdx(sheet, index, true) !==
                                skipHiddenIdx(sheet, 0, true) ? 'Row' : '', skipFormatCheck: isImported(this.parent), checkCF: true });
                    }
                    i++;
                }
            };
            const frozenCol: number = this.parent.frozenColCount(sheet);
            if (frozenCol) {
                row = hRow;
                i = getCellIndexes(sheet.topLeftCell)[0];
                len = frozenCol - 1;
                updateCells();
            }
            row = this.render(index, header, preventHiddenCls);
            i = this.parent.viewport.leftIndex + frozenCol;
            len = this.parent.viewport.rightIndex;
            updateCells();
        }
        return row;
    }

    /**
     * Clears the internal properties of RowRenderer module.
     *
     * @returns {void}
     */
    public destroy(): void {
        this.parent = null; this.element = null;
    }
}
