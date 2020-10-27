import { Spreadsheet } from '../base/index';
import { ICellRenderer, CellRenderEventArgs, inView, CellRenderArgs, renderFilterCell, checkConditionalFormat } from '../common/index';
import { hasTemplate, createHyperlinkElement, checkPrevMerge, getTextHeight, createImageElement } from '../common/index';
import { getColumnHeaderText, CellStyleModel, CellFormatArgs, getRangeIndexes, getRangeAddress } from '../../workbook/common/index';
import { CellStyleExtendedModel } from '../../workbook/common/index';
import { CellModel, SheetModel, getCell, skipDefaultValue, isHiddenRow, RangeModel, isHiddenCol } from '../../workbook/base/index';
import { getRowHeight, setRowHeight } from '../../workbook/base/index';
import { addClass, attributes, getNumberDependable, extend, compile, isNullOrUndefined } from '@syncfusion/ej2-base';
import { getFormattedCellObject, applyCellFormat, workbookFormulaOperation, wrapEvent, cFRender } from '../../workbook/common/event';
import { getTypeFromFormat, wrap as wrapText } from '../../workbook/index';
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
        this.parent.on('updateView', this.updateView, this);
    }
    public renderColHeader(index: number): Element {
        let headerCell: Element = this.th.cloneNode() as Element;
        attributes(headerCell, { 'role': 'columnheader', 'aria-colindex': (index + 1).toString(), 'tabindex': '-1' });
        headerCell.innerHTML = getColumnHeaderText(index + 1);
        let sheet: SheetModel = this.parent.getActiveSheet();
        if (isHiddenCol(sheet, index + 1)) { headerCell.classList.add('e-hide-start'); }
        if (index !== 0 && isHiddenCol(sheet, index - 1)) { headerCell.classList.add('e-hide-end'); }
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
        args.td = this.element.cloneNode() as HTMLTableCellElement;
        args.td.className = 'e-cell';
        attributes(args.td, { 'role': 'gridcell', 'aria-colindex': (args.colIdx + 1).toString(), 'tabindex': '-1' });
        if (this.checkMerged(args)) { return args.td; }
        args.td.innerHTML = this.processTemplates(args.cell, args.rowIdx, args.colIdx);
        args.isRefresh = false;
        this.update(args);
        if (args.cell && args.td) {
            this.parent.notify(
             cFRender, { rowIdx: args.rowIdx, colIdx: args.colIdx, cell: args.cell, td: args.td, isChecked: false });
        }
        if (!hasTemplate(this.parent, args.rowIdx, args.colIdx, this.parent.activeSheetIndex)) {
            this.parent.notify(renderFilterCell, { td: args.td, rowIndex: args.rowIdx, colIndex: args.colIdx });
        }
        let evtArgs: CellRenderEventArgs = { cell: args.cell, element: args.td, address: args.address };
        this.parent.trigger('beforeCellRender', evtArgs);
        this.updateRowHeight({
            rowIdx: args.rowIdx as number,
            cell: evtArgs.element as HTMLElement,
            lastCell: args.lastCell,
            rowHgt: 20,
            row: args.row,
            hRow: args.hRow
        });
        let isWrap: boolean = args.td.classList.contains('e-wraptext');
        let cellValue: string = args.td.innerHTML;
        if (cellValue.indexOf('\n') > -1 && !isWrap) {
            let splitVal: string[] = cellValue.split('\n');
            if (splitVal.length > 1) {
                wrapText(args.address, true, this.parent);
                let ht: number = getTextHeight(this.parent, args.cell.style || this.parent.cellStyle, splitVal.length);
                this.parent.setRowHeight(ht, args.rowIdx, this.parent.activeSheetIndex + 1, true);
                this.parent.getRow(args.rowIdx, this.parent.getRowHeaderTable()).style.height = `${ht}px`;
            }
        }
        return evtArgs.element;
    }
    private update(args: CellRenderArgs): void {
        if (args.isRefresh) {
            if (args.td.rowSpan) { args.td.removeAttribute('rowSpan'); } if (args.td.colSpan) { args.td.removeAttribute('colSpan'); }
            if (this.checkMerged(args)) { return; }
        }
        if (args.cell && args.cell.formula && !args.cell.value) {
            let isFormula: boolean = checkIsFormula(args.cell.formula);
            let eventArgs: { [key: string]: string | number | boolean } = {
                action: 'refreshCalculate', value: args.cell.formula, rowIndex: args.rowIdx, colIndex: args.colIdx, isFormula: isFormula };
            this.parent.notify(workbookFormulaOperation, eventArgs);
            args.cell.value = getCell(args.rowIdx, args.colIdx, this.parent.getActiveSheet()).value; }
        let formatArgs: { [key: string]: string | boolean | CellModel } = {
            type: args.cell && getTypeFromFormat(args.cell.format),
            value: args.cell && args.cell.value, format: args.cell && args.cell.format ? args.cell.format : 'General',
            formattedText: args.cell && args.cell.value, onLoad: true, isRightAlign: false, cell: args.cell,
            rowIdx: args.rowIdx.toString(), colIdx: args.colIdx.toString() };
        if (args.cell) { this.parent.notify(getFormattedCellObject, formatArgs); }
        if (!isNullOrUndefined(args.td)) {
            this.parent.refreshNode(args.td, { type: formatArgs.type as string, result: formatArgs.formattedText as string,
                curSymbol: getNumberDependable(this.parent.locale, 'USD'), isRightAlign: formatArgs.isRightAlign as boolean,
                value: <string>formatArgs.value || ''
            });
        }
        let style: CellStyleModel = {};
        if (args.cell) {
            if (args.cell.style) {
                if ((args.cell.style as CellStyleExtendedModel).properties) {
                    style = skipDefaultValue(args.cell.style, true);
                } else { style = args.cell.style; }
            }
            if (args.cell.hyperlink) {
                this.parent.notify(createHyperlinkElement, { cell: args.cell, td: args.td, rowIdx: args.rowIdx, colIdx: args.colIdx });
            }
            if (args.cell.wrap) {
                this.parent.notify(wrapEvent, {
                    range: [args.rowIdx, args.colIdx, args.rowIdx, args.colIdx], wrap: true, sheet:
                        this.parent.getActiveSheet(), initial: true, td: args.td, row: args.row, hRow: args.hRow
                });
            }
            if (args.cell.rowSpan > 1) {
                let rowSpan: number = args.cell.rowSpan - this.parent.hiddenCount(args.rowIdx, args.rowIdx + (args.cell.rowSpan - 1));
                if (rowSpan > 1) { args.td.rowSpan = rowSpan; }
            }
            if (args.cell.colSpan > 1) {
                let colSpan: number = args.cell.colSpan -
                    this.parent.hiddenCount(args.colIdx, args.colIdx + (args.cell.colSpan - 1), 'columns');
                if (colSpan > 1) { args.td.colSpan = colSpan; }
            }
            if (args.cell.image) {
                for (let i: number = 0; i < args.cell.image.length; i++) {
                    this.parent.notify(createImageElement, {
                        options: {
                            src: args.cell.image[i].src, imageId: args.cell.image[i].id,
                            height: args.cell.image[i].height, width: args.cell.image[i].width,
                            top: args.cell.image[i].top, left: args.cell.image[i].left
                        },
                        range: getRangeAddress([args.rowIdx, args.colIdx, args.rowIdx, args.colIdx]), isPublic: false
                    });
                }
            }
        }
        if (args.isRefresh) { this.removeStyle(args.td, args.rowIdx, args.colIdx); }
        if (this.parent.allowConditionalFormat && args.lastCell) {
            this.parent.notify(checkConditionalFormat, { rowIdx: args.rowIdx , colIdx: args.colIdx, cell: args.cell });
        }
        if (Object.keys(style).length || Object.keys(this.parent.commonCellStyle).length || args.lastCell) {
            this.parent.notify(applyCellFormat, <CellFormatArgs>{
                style: extend({}, this.parent.commonCellStyle, style), rowIdx: args.rowIdx, colIdx: args.colIdx, cell: args.td,
                first: args.first, row: args.row, lastCell: args.lastCell, hRow: args.hRow, pRow: args.pRow, isHeightCheckNeeded:
                args.isHeightCheckNeeded, manualUpdate: args.manualUpdate });
        }
        if (args.checkNextBorder === 'Row') {
            let borderTop: string = this.parent.getCellStyleValue(
                ['borderTop'], [Number(this.parent.getContentTable().rows[0].getAttribute('aria-rowindex')) - 1, args.colIdx]).borderTop;
            if (borderTop !== '' && (!args.cell || !args.cell.style || !(args.cell.style as CellStyleExtendedModel).bottomPriority)) {
                this.parent.notify(applyCellFormat, { style: { borderBottom: borderTop }, rowIdx: args.rowIdx,
                    colIdx: args.colIdx, cell: args.td });
            }
        }
        if (args.checkNextBorder === 'Column') {
            let borderLeft: string = this.parent.getCellStyleValue(['borderLeft'], [args.rowIdx, args.colIdx + 1]).borderLeft;
            if (borderLeft !== '' && (!args.cell || !args.cell.style || (!args.cell.style.borderRight && !args.cell.style.border))) {
                this.parent.notify(applyCellFormat, { style: { borderRight: borderLeft }, rowIdx: args.rowIdx, colIdx: args.colIdx,
                    cell: args.td });
            }
        }
        if (args.cell && args.cell.hyperlink && !hasTemplate(this.parent, args.rowIdx, args.colIdx, this.parent.activeSheetIndex)) {
            let address: string; if (typeof (args.cell.hyperlink) === 'string') {
                address = args.cell.hyperlink;
                if (address.indexOf('http://') !== 0 && address.indexOf('https://') !== 0 && address.indexOf('ftp://') !== 0) {
                    args.cell.hyperlink = address.indexOf('www.') === 0 ? 'http://' + address : address;
                }
            } else {
                address = args.cell.hyperlink.address;
                if (address.indexOf('http://') !== 0 && address.indexOf('https://') !== 0 && address.indexOf('ftp://') !== 0) {
                    args.cell.hyperlink.address = address.indexOf('www.') === 0 ? 'http://' + address : address;
                }
            }
            this.parent.notify(createHyperlinkElement, { cell: args.cell, td: args.td, rowIdx: args.rowIdx, colIdx: args.colIdx });
        }
    }
    private checkMerged(args: CellRenderArgs): boolean {
        if (args.cell && (args.cell.colSpan < 0 || args.cell.rowSpan < 0)) {
            args.td.style.display = 'none';
            if (args.cell.colSpan < 0) { this.parent.notify(checkPrevMerge, args); }
            if (args.cell.rowSpan < 0) { args.isRow = true; this.parent.notify(checkPrevMerge, args); }
            return true;
        }
        return false;
    }

    private processTemplates(cell: CellModel, rowIdx: number, colIdx: number): string {
        let sheet: SheetModel = this.parent.getActiveSheet();
        let ranges: RangeModel[] = sheet.ranges;
        let range: number[];
        for (let j: number = 0, len: number = ranges.length; j < len; j++) {
            if (ranges[j].template) {
                range = getRangeIndexes(ranges[j].address.length ? ranges[j].address : ranges[j].startCell);
                if (range[0] <= rowIdx && range[1] <= colIdx && range[2] >= rowIdx && range[3] >= colIdx) {
                    if (cell) {
                        return this.compileCellTemplate(ranges[j].template);
                    } else {
                        if (!getCell(rowIdx, colIdx, sheet, true)) {
                            return this.compileCellTemplate(ranges[j].template);
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

    private removeStyle(element: HTMLElement, rowIdx: number, colIdx: number): void {
        if (element.style.length) { element.removeAttribute('style'); }
        let prevRowCell: HTMLElement = this.parent.getCell(rowIdx - 1, colIdx);
        if (prevRowCell && prevRowCell.style.borderBottom) {
            rowIdx = Number(prevRowCell.parentElement.getAttribute('aria-rowindex')) - 1;
            if (!this.parent.getCellStyleValue(['borderBottom'], [rowIdx, colIdx]).borderBottom) { prevRowCell.style.borderBottom = ''; }
        }
        let prevColCell: HTMLElement = <HTMLElement>element.previousElementSibling;
        if (prevColCell && prevColCell.style.borderRight) {
            colIdx = Number(prevColCell.getAttribute('aria-colindex')) - 1;
            if (!this.parent.getCellStyleValue(['borderRight'], [rowIdx, colIdx]).borderRight) { prevColCell.style.borderRight = ''; }
        }
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
                        this.update(<CellRenderArgs>{ rowIdx: i, colIdx: j, td: cell, cell: getCell(i, j, sheet), lastCell:
                            j === cRange[3], isRefresh: true, isHeightCheckNeeded: true, manualUpdate: true, first: '' });
                        this.parent.notify(renderFilterCell, { td: cell, rowIndex: i, colIndex: j });
                    }
                }
            }
        }
    }
    public refresh(rowIdx: number, colIdx: number, lastCell?: boolean, element?: Element): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        if (!element && (isHiddenRow(sheet, rowIdx) || isHiddenCol(sheet, colIdx))) { return; }
        if (element || !this.parent.scrollSettings.enableVirtualization || (rowIdx >= this.parent.viewport.topIndex && rowIdx <=
            this.parent.viewport.bottomIndex && colIdx >= this.parent.viewport.leftIndex && colIdx <=
            this.parent.viewport.rightIndex)) {
            let cell: HTMLElement = <HTMLElement>element || this.parent.getCell(rowIdx, colIdx);
            this.update(<CellRenderArgs>{ rowIdx: rowIdx, colIdx: colIdx, td: cell, cell: getCell(
                rowIdx, colIdx, sheet), lastCell: lastCell, isRefresh: true, isHeightCheckNeeded: true,
                manualUpdate: true, first: '' });
            this.parent.notify(renderFilterCell, { td: cell, rowIndex: rowIdx, colIndex: colIdx });
        }
    }

    private updateView(args: { indexes: number[] }): void {
        this.refreshRange(args.indexes);
    }
}
