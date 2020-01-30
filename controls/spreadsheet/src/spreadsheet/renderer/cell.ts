import { Spreadsheet } from '../base/index';
import { ICellRenderer, CellRenderEventArgs, inView, CellRenderArgs } from '../common/index';
import { CellStyleExtendedModel, hasTemplate, createHyperlinkElement } from '../common/index';
import { renderFilterCell } from '../common/index';
import { getColumnHeaderText, CellStyleModel, CellFormatArgs, getCellAddress, getRangeIndexes } from '../../workbook/common/index';
import { CellModel, SheetModel, getCell, skipDefaultValue, isHiddenRow, RangeSettingModel } from '../../workbook/base/index';
import { getRowHeight, setRowHeight } from '../../workbook/base/index';
import { addClass, attributes, getNumberDependable, extend, compile, isNullOrUndefined } from '@syncfusion/ej2-base';
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
    private tableRow: HTMLElement;
    constructor(parent?: Spreadsheet) {
        this.parent = parent;
        this.element = this.parent.createElement('td') as HTMLTableCellElement;
        this.th = this.parent.createElement('th', { className: 'e-header-cell' }) as HTMLTableHeaderCellElement;
        this.tableRow = parent.createElement('tr', { className: 'e-row' });
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
        td.innerHTML = this.processTemplates(args.cell, args.rowIdx, args.colIdx);
        this.updateCell(args.rowIdx, args.colIdx, td, args.cell, args.lastCell, args.row, args.hRow, args.isHeightCheckNeeded);
        if (!hasTemplate(this.parent, args.rowIdx, args.colIdx, this.parent.activeSheetTab - 1)) {
            this.parent.notify(renderFilterCell, { td: td, rowIndex: args.rowIdx, colIndex: args.colIdx });
        }
        let evtArgs: CellRenderEventArgs = {
            cell: args.cell, element: td, address: args.address
        };
        this.parent.trigger('beforeCellRender', evtArgs);
        this.updateRowHeight({
            rowIdx: args.rowIdx as number,
            cell: evtArgs.element as HTMLElement,
            lastCell: args.lastCell,
            rowHgt: 20,
            row: args.row,
            hRow: args.hRow
        });
        return evtArgs.element;
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
        if (!isNullOrUndefined(td)) {
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
                    lastCell: lastCell, row: row, hRow: hRow,
                    isHeightCheckNeeded: isHeightCheckNeeded, manualUpdate: false
                });
            }
        } else {
            if (isRefresh) { this.removeStyle(td); }
        }
        if (cell && cell.hyperlink && !hasTemplate(this.parent, rowIdx, colIdx, this.parent.activeSheetTab - 1)) {
            let hArgs: object = { cell: cell, td: td, rowIdx: rowIdx, colIdx: colIdx };
            this.parent.notify(createHyperlinkElement, hArgs);
        }
    }

    private processTemplates(cell: CellModel, rowIdx: number, colIdx: number): string {
        let sheet: SheetModel = this.parent.getActiveSheet();
        let rangeSettings: RangeSettingModel[] = sheet.rangeSettings;
        let range: number[];
        for (let j: number = 0, len: number = rangeSettings.length; j < len; j++) {
            if (rangeSettings[j].template) {
                range = getRangeIndexes(rangeSettings[j].range.length ? rangeSettings[j].range : rangeSettings[j].startCell);
                if (range[0] <= rowIdx && range[1] <= colIdx && range[2] >= rowIdx && range[3] >= colIdx) {
                    if (cell) {
                        return this.compileCellTemplate(rangeSettings[j].template);
                    } else {
                        if (!getCell(rowIdx, colIdx, sheet, true)) {
                            return this.compileCellTemplate(rangeSettings[j].template);
                        }
                    }
                }
            }
        }
        return '';
    }

    private compileCellTemplate(template: string): string {
        let templateString: string;
        if (template.trim().indexOf('#') === 0) {
            templateString = document.querySelector(template).innerHTML.trim();
        } else {
            templateString = template;
        }
        let compiledStr: Function = compile(templateString);
        return (compiledStr({}, null, null, '', true)[0] as HTMLElement).outerHTML;
    }

    private updateRowHeight(args: {
        row: HTMLElement, rowIdx: number, hRow: HTMLElement, cell: HTMLElement, rowHgt: number, lastCell: boolean
    }): void {
        if (args.cell && args.cell.children.length) {
            let clonedCell: HTMLElement = args.cell.cloneNode(true) as HTMLElement;
            this.tableRow.appendChild(clonedCell);
        }
        if (args.lastCell && this.tableRow.childElementCount) {
            let sheet: SheetModel = this.parent.getActiveSheet();
            let tableRow: HTMLElement = args.row || this.parent.getRow(args.rowIdx);
            let previouseHeight: number = getRowHeight(sheet, args.rowIdx);
            let rowHeight: number = this.getRowHeightOnInit();
            if (rowHeight > previouseHeight) {
                tableRow.style.height = `${rowHeight}px`;
                if (sheet.showHeaders) {
                    (args.hRow || this.parent.getRow(args.rowIdx, this.parent.getRowHeaderTable())).style.height =
                        `${rowHeight}px`;
                }
                setRowHeight(sheet, args.rowIdx, rowHeight);
            }
            this.tableRow.innerHTML = '';
        }
    }

    private getRowHeightOnInit(): number {
        let tTable: HTMLElement = this.parent.createElement('table', { className: 'e-table e-test-table' });
        let tBody: HTMLElement = tTable.appendChild(this.parent.createElement('tbody'));
        tBody.appendChild(this.tableRow);
        this.parent.element.appendChild(tTable);
        let height: number = Math.round(this.tableRow.getBoundingClientRect().height);
        this.parent.element.removeChild(tTable);
        return height < 20 ? 20 : height;
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
