import { Spreadsheet } from '../base/index';
import { ICellRenderer, CellRenderEventArgs, inView, CellRenderArgs, CellStyleExtendedModel } from '../common/index';
import { getColumnHeaderText, CellStyleModel, CellFormatArgs, getCellAddress } from '../../workbook/common/index';
import { CellModel, SheetModel, getCell, skipDefaultValue } from '../../workbook/base/index';
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
        attributes(headerCell, { 'role': 'columnheader', 'columnheader': index.toString(), 'tabindex': '-1' });
        headerCell.innerHTML = getColumnHeaderText(index + 1);
        return headerCell;
    }
    public renderRowHeader(index: number): Element {
        let headerCell: Element = this.element.cloneNode() as Element;
        attributes(headerCell, { 'role': 'rowheader', 'tabindex': '-1' });
        addClass([headerCell], 'e-header-cell');
        headerCell.innerHTML = (index + 1).toString();
        return headerCell;
    }
    public render(args: CellRenderArgs): Element {
        let td: HTMLElement = this.element.cloneNode() as HTMLElement;
        td.className = 'e-cell';
        td.setAttribute('aria-colindex', args.colIdx.toString());
        let eventArgs: CellRenderEventArgs = { cell: args.cell, element: td, address: args.address };
        this.parent.trigger('beforeCellRender', eventArgs);
        this.updateCell(
            args.rowIdx, args.colIdx, td, args.cell, eventArgs, args.lastCell, args.row, args.hRow, args.isHeightCheckNeeded);
        return eventArgs.element;
    }
    private updateCell(
        rowIdx: number, colIdx: number, td: Element, cell: CellModel,
        eventArgs?: { cell: CellModel, element: Element }, lastCell?: boolean, row?: HTMLElement, hRow?: HTMLElement,
        isHeightCheckNeeded?: boolean, isRefresh?: boolean
    ): void {
        if (!eventArgs) {
            eventArgs = { cell: cell, element: td };
        }
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
        td.textContent = eventArgs.cell ? <string>formatArgs.formattedText : '';
        this.parent.refreshNode(td, {
            type: formatArgs.type as string,
            result: formatArgs.formattedText as string,
            curSymbol: getNumberDependable(this.parent.locale, 'USD'),
            isRightAlign: formatArgs.isRightAlign as boolean,
            value: <string>formatArgs.value || ''
        });
        let style: CellStyleModel = {};
        if (eventArgs.cell && eventArgs.cell.style) {
            if ((eventArgs.cell.style as CellStyleExtendedModel).properties) {
                style = skipDefaultValue(eventArgs.cell.style, true);
            } else {
                style = eventArgs.cell.style;
            }
        }
        if (Object.keys(style).length || Object.keys(this.parent.commonCellStyle).length || lastCell) {
            if (isRefresh) {
                this.parent.notify(setCellFormat, { style: style, range: getCellAddress(rowIdx, colIdx) });
            } else {
                this.parent.notify(applyCellFormat, <CellFormatArgs>{
                    style: extend({}, this.parent.commonCellStyle, style), rowIdx: rowIdx, colIdx: colIdx, cell: eventArgs.element,
                    lastCell: lastCell, row: row, hRow: hRow, isHeightCheckNeeded: isHeightCheckNeeded, manualUpdate: false
                });
            }
        }
    }
    /** @hidden */
    public refreshRange(range: number[]): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        let cRange: number[] = range.slice();
        if (inView(this.parent, cRange, true)) {
            for (let i: number = cRange[0]; i <= cRange[2]; i++) {
                for (let j: number = cRange[1]; j <= cRange[3]; j++) {
                    this.updateCell(
                        i, j, this.parent.getCell(i, j), getCell(i, j, sheet), null, false, null,
                        null, true, true);
                }
            }
        }
    }
}
