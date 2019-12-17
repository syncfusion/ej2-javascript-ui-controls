import { Spreadsheet } from '../base/index';
import { ICellRenderer, CellRenderEventArgs, inView, CellRenderArgs, CellStyleExtendedModel, renderFilterCell } from '../common/index';
import { createHyperlinkElement } from '../common/index';
import { getColumnHeaderText, CellStyleModel, CellFormatArgs, getCellAddress } from '../../workbook/common/index';
import { CellModel, SheetModel, getCell, skipDefaultValue, isHiddenRow } from '../../workbook/base/index';
import { addClass, attributes, getNumberDependable, extend } from '@syncfusion/ej2-base';
import { getFormattedCellObject, applyCellFormat, workbookFormulaOperation, setCellFormat } from '../../workbook/common/event';
import { getTypeFromFormat } from '../../workbook/index';
import { checkIsFormula } from '../../workbook/common/util';
/**
 * CellRenderer class which responsible for building cell content.
 * @hidden
 */
export class CellRenderer implements ICellRenderer {
    private parent: Spreadsheet;
    private element: HTMLTableCellElement;
    private th: HTMLTableHeaderCellElement;
    constructor(parent?: Spreadsheet) {
        this.parent = parent;
        this.element = this.parent.createElement('td') as HTMLTableCellElement;
        this.th = this.parent.createElement('th', { className: 'e-header-cell' }) as HTMLTableHeaderCellElement;
    }
    public renderColHeader(index: number): Element {
        let headerCell: Element = this.th.cloneNode() as Element;
        attributes(headerCell, { 'role': 'columnheader', 'aria-colindex': (index + 1).toString(), 'tabindex': '-1' });
        headerCell.innerHTML = getColumnHeaderText(index + 1);
        return headerCell;
    }
    public renderRowHeader(index: number): Element {
        let headerCell: Element = this.element.cloneNode() as Element;
        addClass([headerCell], 'e-header-cell');
        attributes(headerCell, { 'role': 'rowheader', 'tabindex': '-1' });
        headerCell.innerHTML = (index + 1).toString();
        return headerCell;
    }
    public render(args: CellRenderArgs): Element {
        let td: HTMLElement = this.element.cloneNode() as HTMLElement;
        td.className = 'e-cell';
        attributes(td, { 'role': 'gridcell', 'aria-colindex': (args.colIdx + 1).toString(), 'tabindex': '-1' });
        this.updateCell(args.rowIdx, args.colIdx, td, args.cell, args.lastCell, args.row, args.hRow, args.isHeightCheckNeeded);
        this.parent.notify(renderFilterCell, { td: td, rowIndex: args.rowIdx, colIndex: args.colIdx });
        this.parent.trigger('beforeCellRender', <CellRenderEventArgs>{ cell: args.cell, element: td, address: args.address });
        return td;
    }
    private updateCell(
        rowIdx: number, colIdx: number, td: HTMLElement, cell: CellModel,
        lastCell?: boolean, row?: HTMLElement, hRow?: HTMLElement, isHeightCheckNeeded?: boolean, isRefresh?: boolean): void {
        if (cell && cell.formula && !cell.value) {
            let isFormula: boolean = checkIsFormula(cell.formula);
            let eventArgs: { [key: string]: string | number | boolean } = {
                action: 'refreshCalculate',
                value: cell.formula,
                rowIndex: rowIdx,
                colIndex: colIdx,
                isFormula: isFormula
            };
            this.parent.notify(workbookFormulaOperation, eventArgs);
        }
        let formatArgs: { [key: string]: string | boolean | CellModel } = {
            type: cell && getTypeFromFormat(cell.format),
            value: cell && cell.value, format: cell && cell.format ? cell.format : 'General',
            formattedText: cell && cell.value, onLoad: true, isRightAlign: false, cell: cell
        };
        if (cell) {
            this.parent.notify(getFormattedCellObject, formatArgs);
        }
        if (td) {
            td.textContent = td ? <string>formatArgs.formattedText : '';
            this.parent.refreshNode(td, {
                type: formatArgs.type as string,
                result: formatArgs.formattedText as string,
                curSymbol: getNumberDependable(this.parent.locale, 'USD'),
                isRightAlign: formatArgs.isRightAlign as boolean,
                value: <string>formatArgs.value || ''
            });
        }
        let style: CellStyleModel = {};
        if (cell && cell.style) {
            if ((cell.style as CellStyleExtendedModel).properties) {
                style = skipDefaultValue(cell.style, true);
            } else {
                style = cell.style;
            }
        }
        if (Object.keys(style).length || Object.keys(this.parent.commonCellStyle).length || lastCell) {
            if (isRefresh) {
                this.removeStyle(td);
                this.parent.notify(setCellFormat, { style: style, range: getCellAddress(rowIdx, colIdx) });
            } else {
                this.parent.notify(applyCellFormat, <CellFormatArgs>{
                    style: extend({}, this.parent.commonCellStyle, style), rowIdx: rowIdx, colIdx: colIdx, cell: td,
                    lastCell: lastCell, row: row, hRow: hRow, isHeightCheckNeeded: isHeightCheckNeeded, manualUpdate: false
                });
            }
        } else {
            if (isRefresh) { this.removeStyle(td); }
        }
        if (cell && cell.hyperlink) {
            let args: object = { cell: cell, td: td, rowIdx: rowIdx, colIdx: colIdx };
            this.parent.notify(createHyperlinkElement, args);
        }
    }
    private removeStyle(element: HTMLElement): void {
        if (element.style.length) { element.removeAttribute('style'); }
    }
    /** @hidden */
    public refreshRange(range: number[]): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        let cRange: number[] = range.slice();
        if (inView(this.parent, cRange, true)) {
            for (let i: number = cRange[0]; i <= cRange[2]; i++) {
                if (isHiddenRow(sheet, i)) { continue; }
                for (let j: number = cRange[1]; j <= cRange[3]; j++) {
                    let cell: HTMLElement = this.parent.getCell(i, j);
                    if (cell) {
                        this.updateCell(
                            i, j, cell, getCell(i, j, sheet), false, null,
                            null, true, cell ? true : false);
                        this.parent.notify(renderFilterCell, { td: cell, rowIndex: i, colIndex: j });
                    }
                }
            }
        }
    }
}
