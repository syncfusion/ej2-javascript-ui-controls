import { Spreadsheet } from '../base/index';
import { ICellRenderer, CellRenderEventArgs, inView, CellRenderArgs, renderFilterCell } from '../common/index';
import { hasTemplate, createHyperlinkElement, checkPrevMerge, createImageElement, IRenderer, getDPRValue } from '../common/index';
import { removeAllChildren } from '../common/index';
import { getColumnHeaderText, CellStyleModel, CellFormatArgs, getRangeIndexes, getRangeAddress } from '../../workbook/common/index';
import { CellStyleExtendedModel, setChart, refreshChart, getCellAddress, ValidationModel, MergeArgs } from '../../workbook/common/index';
import { CellModel, SheetModel, skipDefaultValue, isHiddenRow, RangeModel, isHiddenCol, ColumnModel} from '../../workbook/base/index';
import { getRowHeight, setRowHeight, getCell, getColumn, getColumnWidth, getSheet, setCell, Workbook  } from '../../workbook/base/index';
import { addClass, attributes, getNumberDependable, extend, compile, isNullOrUndefined, detach } from '@syncfusion/ej2-base';
import { getFormattedCellObject, applyCellFormat, workbookFormulaOperation, wrapEvent, cFRender } from '../../workbook/common/index';
import { getTypeFromFormat, activeCellMergedRange, addHighlight, getCellIndexes, updateView } from '../../workbook/index';
import { checkIsFormula, checkConditionalFormat } from '../../workbook/common/index';
/**
 * CellRenderer class which responsible for building cell content.
 *
 * @hidden
 */
export class CellRenderer implements ICellRenderer {
    private parent: Spreadsheet;
    private element: HTMLTableCellElement;
    private th: HTMLTableHeaderCellElement;
    private tableRow: HTMLElement;
    private borderTd: CellModel;
    constructor(parent?: Spreadsheet) {
        this.parent = parent;
        this.element = this.parent.createElement('td') as HTMLTableCellElement;
        this.th = this.parent.createElement('th', { className: 'e-header-cell' }) as HTMLTableHeaderCellElement;
        this.tableRow = parent.createElement('tr', { className: 'e-row' });
        this.parent.on(updateView, this.updateView, this);
        this.parent.on('calculateFormula', this.calculateFormula, this);
    }

    public renderColHeader(index: number): Element {
        const headerCell: Element = this.th.cloneNode() as Element;
        attributes(headerCell, { 'role': 'columnheader', 'aria-colindex': (index + 1).toString(), 'tabindex': '-1' });
        headerCell.innerHTML = getColumnHeaderText(index + 1);
        const sheet: SheetModel = this.parent.getActiveSheet();
        if (isHiddenCol(sheet, index + 1)) { headerCell.classList.add('e-hide-start'); }
        if (index !== 0 && isHiddenCol(sheet, index - 1)) { headerCell.classList.add('e-hide-end'); }
        return headerCell;
    }
    public renderRowHeader(index: number): Element {
        const headerCell: Element = this.element.cloneNode() as Element;
        addClass([headerCell], 'e-header-cell');
        attributes(headerCell, { 'role': 'rowheader', 'tabindex': '-1' });
        headerCell.innerHTML = (index + 1).toString();
        return headerCell;
    }
    public render(args: CellRenderArgs): Element {
        const sheet: SheetModel = this.parent.getActiveSheet();
        const cell: CellModel = getCell(args.rowIdx, args.colIdx, sheet);
        const column: ColumnModel = getColumn(sheet, args.colIdx);
        let validation: ValidationModel;
        if (cell && cell.validation) {
            validation = cell.validation;
        } else if (column && column.validation) {
            validation = column.validation;
        }
        args.td = this.element.cloneNode() as HTMLTableCellElement;
        args.td.className = 'e-cell';
        attributes(args.td, { 'role': 'gridcell', 'aria-colindex': (args.colIdx + 1).toString(), 'tabindex': '-1' });
        if (this.checkMerged(args)) {
            return args.td;
        }
        args.isRefresh = false;
        this.update(args);
        if (args.cell && args.td) {
            if (validation && validation.isHighlighted) {
                this.parent.notify(addHighlight, { range: getRangeAddress([args.rowIdx, args.colIdx]), td: args.td });
            }
            this.parent.notify(
                cFRender, { rowIdx: args.rowIdx, colIdx: args.colIdx, cell: args.cell, td: args.td, isChecked: false });
            if (args.td && args.td.children[0] && args.td.children[0].className === 'e-cf-databar') {
                if (args.cell.style && args.cell.style.fontSize) {
                    (args.td.children[0].querySelector('.e-databar-value') as HTMLElement).style.fontSize = args.cell.style.fontSize;
                }
                (args.td.children[0] as HTMLElement).style.height = '100%';
                (args.td.children[0].firstElementChild.nextElementSibling as HTMLElement).style.height = '100%';
            }
        }
        if (!hasTemplate(this.parent as Workbook, args.rowIdx, args.colIdx, this.parent.activeSheetIndex)) {
            this.parent.notify(renderFilterCell, { td: args.td, rowIndex: args.rowIdx, colIndex: args.colIdx });
        }
        const evtArgs: CellRenderEventArgs = { cell: args.cell, element: args.td, address: args.address, rowIndex: args.rowIdx, colIndex:
            args.colIdx, needHeightCheck: false };
        this.parent.trigger('beforeCellRender', evtArgs);
        this.updateRowHeight({
            rowIdx: args.rowIdx as number,
            cell: evtArgs.element as HTMLElement,
            lastCell: args.lastCell,
            rowHgt: 20,
            row: args.row,
            hRow: args.hRow,
            colIdx: args.colIdx,
            sheet: sheet,
            needHeightCheck: evtArgs.needHeightCheck
        });
        this.setWrapByValue(sheet, args);
        return evtArgs.element;
    }

    private setWrapByValue(sheet: SheetModel, args: CellRenderArgs): void {
        const isWrap: boolean = args.td.classList.contains('e-wraptext');
        const cellValue: string = args.td.innerHTML;
        if (cellValue.indexOf('\n') > -1 && !isWrap) {
            const splitVal: string[] = cellValue.split('\n');
            if (splitVal.length > 1) {
                setCell(args.rowIdx, args.colIdx, sheet, { wrap: true }, true);
                this.parent.notify(
                    wrapEvent, { range: [args.rowIdx, args.colIdx, args.rowIdx, args.colIdx], wrap: true, initial: true, sheet: sheet,
                        td: args.td, row: args.row, hRow: args.hRow });
            }
        }
    }

    private update(args: CellRenderArgs): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        const compiledTemplate: string = this.processTemplates(args.cell, args.rowIdx, args.colIdx);
        if (compiledTemplate) {
            if (typeof compiledTemplate === 'string') {
                args.td.innerHTML = compiledTemplate;
            } else {
                removeAllChildren(args.td);
                args.td.appendChild(compiledTemplate);
            }
        }
        if (args.isRefresh) {
            if (args.td.rowSpan) {
                this.mergeFreezeRow(sheet, args.rowIdx, args.colIdx, args.td.rowSpan, args.row, true);
                args.td.removeAttribute('rowSpan');
            }
            if (args.td.colSpan) {
                this.mergeFreezeCol(sheet, args.rowIdx, args.colIdx, args.td.colSpan, true);
                args.td.removeAttribute('colSpan');
            }
            if (this.checkMerged(args)) { return; }
            if (args.cell && !args.cell.hyperlink && args.td.querySelector('.e-hyperlink')) {
                args.td.removeChild(args.td.querySelector('.e-hyperlink'));
            }
        }
        if (args.cell && args.cell.formula && args.cell.formula.indexOf('UNIQUE') === - 1) {
            this.calculateFormula(args);
        }
        const formatArgs: { [key: string]: string | boolean | number | CellModel } = {
            type: args.cell && getTypeFromFormat(args.cell.format),
            value: args.cell && args.cell.value, format: args.cell && args.cell.format ? args.cell.format : 'General',
            formattedText: args.cell && args.cell.value, onLoad: true, isRightAlign: false, cell: args.cell,
            rowIndex: args.rowIdx, colIndex: args.colIdx, isRowFill: false };
        if (args.cell) { this.parent.notify(getFormattedCellObject, formatArgs); }
        if (!isNullOrUndefined(args.td)) {
            this.parent.refreshNode(args.td, { type: formatArgs.type as string, result: formatArgs.formattedText as string,
                curSymbol: getNumberDependable(this.parent.locale, 'USD'), isRightAlign: formatArgs.isRightAlign as boolean,
                value: <string>formatArgs.value || '', isRowFill: <boolean>formatArgs.isRowFill
            });
        }
        let style: CellStyleModel = {};
        if (args.cell) {
            if (args.cell.style) {
                if ((args.cell.style as CellStyleExtendedModel).properties) {
                    style = skipDefaultValue(args.cell.style, true);
                } else { style = args.cell.style; }
            }
            if (args.cell.chart && args.cell.chart.length > 0) {
                this.parent.notify(setChart, { chart : args.cell.chart, isInitCell: true, range: getCellAddress(args.rowIdx, args.colIdx)});
            }
            if (args.cell.hyperlink) {
                this.parent.notify(createHyperlinkElement, { cell: args.cell, td: args.td, rowIdx: args.rowIdx, colIdx: args.colIdx });
            }
            if (args.cell.rowSpan > 1) {
                const rowSpan: number = args.cell.rowSpan - this.parent.hiddenCount(args.rowIdx, args.rowIdx + (args.cell.rowSpan - 1));
                if (rowSpan > 1) {
                    args.td.rowSpan = rowSpan; this.mergeFreezeRow(sheet, args.rowIdx, args.colIdx, rowSpan, args.row);
                }
            }
            if (args.cell.colSpan > 1) {
                const colSpan: number = args.cell.colSpan -
                    this.parent.hiddenCount(args.colIdx, args.colIdx + (args.cell.colSpan - 1), 'columns');
                if (colSpan > 1) {
                    args.td.colSpan = colSpan;
                    this.mergeFreezeCol(sheet, args.rowIdx, args.colIdx, colSpan);
                }
            }
            if (args.cell.image) {
                for (let i: number = 0; i < args.cell.image.length; i++) {
                    if (args.cell.image[i]) {
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
        }
        if (args.isRefresh) { this.removeStyle(args.td, args.rowIdx, args.colIdx); }
        if (this.parent.allowChart && args.lastCell) {
            this.parent.notify(refreshChart, {
                cell: args.cell, rIdx: args.rowIdx, cIdx: args.colIdx, sheetIdx: this.parent.activeSheetIndex
            });
        }
        this.applyStyle(args, style);
        if (this.parent.allowConditionalFormat && args.lastCell) {
            this.parent.notify(checkConditionalFormat, { rowIdx: args.rowIdx , colIdx: args.colIdx, cell: args.cell, td: args.td });
        }
        if (args.checkNextBorder === 'Row') {
            const borderTop: string = this.parent.getCellStyleValue(
                ['borderTop'], [Number(this.parent.getContentTable().rows[0].getAttribute('aria-rowindex')) - 1, args.colIdx]).borderTop;
            if (borderTop !== '' && (!args.cell || !args.cell.style || !(args.cell.style as CellStyleExtendedModel).bottomPriority)) {
                this.parent.notify(applyCellFormat, { style: { borderBottom: borderTop }, rowIdx: args.rowIdx,
                    colIdx: args.colIdx, cell: args.td });
            }
        }
        if (args.checkNextBorder === 'Column') {
            const borderLeft: string = this.parent.getCellStyleValue(['borderLeft'], [args.rowIdx, args.colIdx + 1]).borderLeft;
            if (borderLeft !== '' && (!args.cell || !args.cell.style || (!args.cell.style.borderRight && !args.cell.style.border))) {
                this.parent.notify(applyCellFormat, { style: { borderRight: borderLeft }, rowIdx: args.rowIdx, colIdx: args.colIdx,
                    cell: args.td });
            }
        }
        if (args.cell && args.cell.hyperlink && !hasTemplate(this.parent as Workbook,
                                                             args.rowIdx, args.colIdx, this.parent.activeSheetIndex)) {
            let address: string; if (typeof (args.cell.hyperlink) === 'string') {
                address = args.cell.hyperlink;
                if (address.indexOf('http://') !== 0 && address.indexOf('https://') !== 0 && address.indexOf('ftp://') !== 0) {
                    args.cell.hyperlink = address.toLowerCase().indexOf('www.') === 0 ? 'http://' + address : address;
                }
            } else {
                address = args.cell.hyperlink.address;
                if (address.indexOf('http://') !== 0 && address.indexOf('https://') !== 0 && address.indexOf('ftp://') !== 0) {
                    args.cell.hyperlink.address = address.toLowerCase().indexOf('www.') === 0 ? 'http://' + address : address;
                }
            }
            this.parent.notify(createHyperlinkElement, { cell: args.cell, td: args.td, rowIdx: args.rowIdx, colIdx: args.colIdx });
        }
        if (args.cell && args.cell.wrap) {
            const prevHgt: number = getRowHeight(sheet, args.rowIdx);
            this.parent.notify(wrapEvent, {
                range: [args.rowIdx, args.colIdx, args.rowIdx, args.colIdx], wrap: true, sheet:
                sheet, initial: true, td: args.td, row: args.row, hRow: args.hRow, isCustomHgt: !args.isRefresh && prevHgt > 20
            });
        }
        if (args.cell && args.cell.validation && args.cell.validation.isHighlighted) {
            this.parent.notify(addHighlight, { range: getRangeAddress([args.rowIdx, args.colIdx]), td: args.td });
        }
    }
    private applyStyle(args: CellRenderArgs, style: CellStyleModel): void {
        if (Object.keys(style).length || Object.keys(this.parent.commonCellStyle).length || args.lastCell) {
            this.parent.notify(applyCellFormat, <CellFormatArgs>{
                style: extend({}, this.parent.commonCellStyle, style), rowIdx: args.rowIdx, colIdx: args.colIdx, cell: args.td,
                first: args.first, row: args.row, lastCell: args.lastCell, hRow: args.hRow, pRow: args.pRow, isHeightCheckNeeded:
                args.isHeightCheckNeeded, manualUpdate: args.manualUpdate});
        }
    }
    private calculateFormula(args: CellRenderArgs): void {
        if (args.cell.value !== undefined && args.cell.value !== null) {
            const eventArgs: { [key: string]: string | number | boolean } = { action: 'checkFormulaAdded', added: true, address: args.address, sheetId:
                (args.sheetIndex === undefined ? this.parent.getActiveSheet() : getSheet(this.parent, args.sheetIndex)).id.toString() };
            this.parent.notify(workbookFormulaOperation, eventArgs);
            if (eventArgs.added) { return; }
        }
        const isFormula: boolean = checkIsFormula(args.cell.formula);
        const eventArgs: { [key: string]: string | number | boolean } = { action: 'refreshCalculate', value: args.cell.formula, rowIndex:
            args.rowIdx, colIndex: args.colIdx, isFormula: isFormula, sheetIndex: args.sheetIndex, isRefreshing: args.isRefreshing };
        this.parent.notify(workbookFormulaOperation, eventArgs);
        args.cell.value = getCell(
            args.rowIdx, args.colIdx, isNullOrUndefined(args.sheetIndex) ? this.parent.getActiveSheet() :
                getSheet(this.parent, args.sheetIndex)).value;
    }
    private checkMerged(args: CellRenderArgs): boolean {
        if (args.cell && (args.cell.colSpan < 0 || args.cell.rowSpan < 0)) {
            const sheet: SheetModel = this.parent.getActiveSheet();
            if (sheet.frozenRows || sheet.frozenColumns) {
                const mergeArgs: MergeArgs = { range: [args.rowIdx, args.colIdx, args.rowIdx, args.colIdx] };
                this.parent.notify(activeCellMergedRange, mergeArgs);
                const frozenRow: number = this.parent.frozenRowCount(sheet); const frozenCol: number = this.parent.frozenColCount(sheet);
                let setDisplay: boolean;
                if (sheet.frozenRows && sheet.frozenColumns) {
                    if (mergeArgs.range[0] < frozenRow && mergeArgs.range[1] < frozenCol) {
                        setDisplay = args.rowIdx < frozenRow && args.colIdx < frozenCol;
                    } else if (mergeArgs.range[0] < frozenRow) {
                        setDisplay = args.rowIdx < frozenRow;
                    } else if (mergeArgs.range[1] < frozenCol) {
                        setDisplay = args.colIdx < frozenCol;
                    } else {
                        setDisplay = true;
                    }
                } else {
                    setDisplay = frozenRow ? (mergeArgs.range[0] >= frozenRow || args.rowIdx < frozenRow) : (mergeArgs.range[1] >= frozenCol
                        || args.colIdx < frozenCol);
                }
                if (setDisplay) { args.td.style.display = 'none'; }
            } else {
                args.td.style.display = 'none';
            }
            if (args.cell.colSpan < 0) {
                this.parent.notify(checkPrevMerge, args);
                if (args.cell.style && args.cell.style.borderTop) { this.applyStyle(args, { borderTop: args.cell.style.borderTop }); }
            }
            if (args.cell.rowSpan < 0) {
                args.isRow = true; this.parent.notify(checkPrevMerge, args);
                if (args.cell.style && args.cell.style.borderLeft) { this.applyStyle(args, { borderLeft: args.cell.style.borderLeft }); }
            }
            return true;
        }
        return false;
    }
    private mergeFreezeRow(sheet: SheetModel, rowIdx: number, colIdx: number, rowSpan: number, tr: Element, unMerge?: boolean): void {
        const frozenRow: number = this.parent.frozenRowCount(sheet);
        if (frozenRow && rowIdx < frozenRow && rowIdx + (rowSpan - 1) >= frozenRow) {
            let rowEle: HTMLElement; let spanRowTop: number = 0; let height: number;
            const frozenCol: number = this.parent.frozenColCount(sheet);
            const row: HTMLTableRowElement = tr as HTMLTableRowElement || this.parent.getRow(rowIdx, null, colIdx);
            const emptyRows: Element[] = [].slice.call(row.parentElement.querySelectorAll('.e-empty'));
            if (unMerge) {
                const curEmptyLength: number = rowIdx + rowSpan - frozenRow;
                if (curEmptyLength < emptyRows.length) {
                    return;
                } else {
                    let curSpan: number = 0;
                    if (curEmptyLength === emptyRows.length) {
                        let curCell: CellModel; let i: number; let len: number;
                        if (frozenCol && colIdx < frozenCol) {
                            i = getCellIndexes(sheet.topLeftCell)[1]; len = frozenCol;
                        } else {
                            i = this.parent.viewport.leftIndex + frozenCol; len = this.parent.viewport.rightIndex;
                        }
                        for (i; i < len; i++) {
                            if (i === colIdx) { continue; }
                            curCell = getCell(rowIdx, i, sheet, false, true);
                            if (curCell.rowSpan && rowIdx + curCell.rowSpan - frozenRow > curSpan) {
                                curSpan = rowIdx + curCell.rowSpan - frozenRow;
                            }
                        }
                        if (curSpan === curEmptyLength) { return; }
                    } else {
                        curSpan = curEmptyLength;
                    }
                    let lastRowIdx: number = rowIdx + (rowSpan - 1);
                    for (let i: number = curSpan, len: number = emptyRows.length; i < len; i++) {
                        spanRowTop += getRowHeight(sheet, lastRowIdx);
                        lastRowIdx--; detach(emptyRows.pop());
                    }
                    this.updateSpanTop(colIdx, frozenCol, spanRowTop, true);
                    if (!emptyRows.length) { this.updateColZIndex(colIdx, frozenCol, true); }
                    return;
                }
            }
            this.updateColZIndex(colIdx, frozenCol);
            for (let i: number = frozenRow, len: number = rowIdx + (rowSpan - 1); i <= len; i++) {
                height = getRowHeight(sheet, i); spanRowTop += -height;
                if (frozenRow + emptyRows.length > i) { continue; }
                rowEle = row.cloneNode() as HTMLElement;
                rowEle.classList.add('e-empty'); rowEle.style.visibility = 'hidden';
                rowEle.style.height = height + 'px';
                row.parentElement.appendChild(rowEle);
            }
            this.updateSpanTop(colIdx, frozenCol, spanRowTop);
        }
    }

    private updateSpanTop(colIdx: number, frozenCol: number, top: number, update?: boolean): void {
        const mainPanel: HTMLElement = this.parent.serviceLocator.getService<IRenderer>('sheet').contentPanel;
        if (update) {
            if (!parseInt(mainPanel.style.top, 10)) { return; }
            top = parseInt(mainPanel.style.top, 10) + top;
        }
        if (frozenCol && colIdx < frozenCol && (update || !parseInt(mainPanel.style.top, 10) || top <
            parseInt(mainPanel.style.top, 10))) {
            mainPanel.style.top = top + 'px';
            const scroll: HTMLElement = mainPanel.nextElementSibling as HTMLElement;
            if (scroll) { scroll.style.top = top + 'px'; }
        }
    }

    private mergeFreezeCol(sheet: SheetModel, rowIdx: number, colIdx: number, colSpan: number, unMerge?: boolean): void {
        const frozenCol: number = this.parent.frozenColCount(sheet);
        if (frozenCol && colIdx < frozenCol && colIdx + (colSpan - 1) >= frozenCol) {
            let col: HTMLElement; let width: number; const frozenRow: number = this.parent.frozenRowCount(sheet);
            const colGrp: Element = (rowIdx < frozenRow ? this.parent.getSelectAllContent() : this.parent.getRowHeaderContent()).querySelector('colgroup');
            const emptyCols: Element[] = [].slice.call(colGrp.querySelectorAll('.e-empty'));
            if (unMerge) {
                const curEmptyLength: number = colIdx + colSpan - frozenCol;
                if (curEmptyLength < emptyCols.length) {
                    return;
                } else {
                    let curSpan: number = 0;
                    if (curEmptyLength === emptyCols.length) {
                        let curCell: CellModel; let len: number; let i: number;
                        if (frozenRow && rowIdx < frozenCol) {
                            len = frozenRow; i = getCellIndexes(sheet.topLeftCell)[0];
                        } else {
                            len = this.parent.viewport.bottomIndex; i = this.parent.viewport.topIndex + frozenRow;
                        }
                        for (i; i < len; i++) {
                            if (i === rowIdx) { continue; }
                            curCell = getCell(i, colIdx, sheet, false, true);
                            if (curCell.colSpan && colIdx + curCell.colSpan - frozenCol > curSpan) {
                                curSpan = colIdx + curCell.colSpan - frozenCol;
                            }
                        }
                        if (curSpan === curEmptyLength) { return; }
                    } else {
                        curSpan = curEmptyLength;
                    }
                    for (let i: number = curSpan, len: number = emptyCols.length; i < len; i++) { detach(emptyCols.pop()); }
                    this.parent.serviceLocator.getService<IRenderer>('sheet').setPanelWidth(sheet, this.parent.getRowHeaderContent());
                    if (!emptyCols.length) { this.updateRowZIndex(rowIdx, frozenRow, true); }
                    return;
                }
            }
            this.updateRowZIndex(rowIdx, frozenRow);
            for (let i: number = frozenCol, len: number = colIdx + (colSpan - 1); i <= len; i++) {
                if (frozenCol + emptyCols.length > i) { continue; }
                col = colGrp.childNodes[0].cloneNode() as HTMLElement;
                col.classList.add('e-empty'); col.style.visibility = 'hidden';
                width = getColumnWidth(sheet, i, null, true); col.style.width = width + 'px';
                colGrp.appendChild(col);
                if (i === len) {
                    this.parent.serviceLocator.getService<IRenderer>('sheet').setPanelWidth(
                        sheet, this.parent.getRowHeaderContent());
                }
            }
        }
    }

    private updateColZIndex(colIdx: number, frozenCol: number, remove?: boolean): void {
        if (colIdx < frozenCol) {
            this.updateSelectAllZIndex(remove);
        } else {
            this.parent.getColumnHeaderContent().style.zIndex = remove ? '' : '2';
            this.updatedHeaderZIndex(remove);
        }
    }

    private updateSelectAllZIndex(remove: boolean): void {
        const frozenRowEle: HTMLElement = this.parent.element.querySelector('.e-frozen-row');
        const frozenColEle: HTMLElement = this.parent.element.querySelector('.e-frozen-column');
        if (remove) {
            this.parent.getSelectAllContent().style.zIndex = '';
            if (frozenRowEle) { frozenRowEle.style.zIndex = ''; }
            if (frozenColEle) { frozenColEle.style.zIndex = ''; }
        } else {
            if (this.parent.getRowHeaderContent().style.zIndex || this.parent.getColumnHeaderContent().style.zIndex) {
                this.parent.getSelectAllContent().style.zIndex = '3';
                if (frozenRowEle) { frozenRowEle.style.zIndex = '4'; }
                if (frozenColEle) { frozenColEle.style.zIndex = '4'; }
            } else {
                this.parent.getSelectAllContent().style.zIndex = '2';
            }
        }
    }

    private updatedHeaderZIndex(remove: boolean): void {
        if (!remove && this.parent.getSelectAllContent().style.zIndex === '2') {
            this.parent.getSelectAllContent().style.zIndex = '3';
            const frozenRowEle: HTMLElement = this.parent.element.querySelector('.e-frozen-row');
            const frozenColEle: HTMLElement = this.parent.element.querySelector('.e-frozen-column');
            if (frozenColEle) { frozenColEle.style.zIndex = '4'; }
            if (frozenRowEle) { frozenRowEle.style.zIndex = '4'; }
        }
    }

    private updateRowZIndex(rowIdx: number, frozenRow: number, remove?: boolean): void {
        if (rowIdx < frozenRow) {
            this.updateSelectAllZIndex(remove);
        } else {
            this.parent.getRowHeaderContent().style.zIndex = remove ? '' : '2';
            this.updatedHeaderZIndex(remove);
        }
    }

    private processTemplates(cell: CellModel, rowIdx: number, colIdx: number): string {
        const sheet: SheetModel = this.parent.getActiveSheet();
        const ranges: RangeModel[] = sheet.ranges;
        let range: number[];
        for (let j: number = 0, len: number = ranges.length; j < len; j++) {
            if (ranges[j].template) {
                range = getRangeIndexes(ranges[j].address.length ? ranges[j].address : ranges[j].startCell);
                if (range[0] <= rowIdx && range[1] <= colIdx && range[2] >= rowIdx && range[3] >= colIdx) {
                    if (cell) {
                        return this.compileCellTemplate(ranges[j].template, cell);
                    } else {
                        if (!getCell(rowIdx, colIdx, sheet, true)) {
                            return this.compileCellTemplate(ranges[j].template, getCell(rowIdx, colIdx, sheet, null, true));
                        }
                    }
                }
            }
        }
        return '';
    }

    private compileCellTemplate(template: string, cell: CellModel): string {
        let compiledStr: Function;
        if (typeof template === 'string') {
            let templateString: string;
            if (template.trim().indexOf('#') === 0) {
                templateString = document.querySelector(template).innerHTML.trim();
            } else {
                templateString = template;
            }
            compiledStr = compile(templateString);
            return (compiledStr(cell, null, null, '', true)[0] as HTMLElement).outerHTML;
        } else {
            compiledStr = compile(template);
            return compiledStr(cell, this.parent, 'ranges', '')[0];
        }
    }

    private updateRowHeight(
        args: { row: HTMLElement, rowIdx: number, hRow: HTMLElement, cell: HTMLElement, rowHgt: number, lastCell: boolean, colIdx: number,
            sheet: SheetModel, needHeightCheck?: boolean, }): void {
        if ((args.cell && args.cell.children.length) || args.needHeightCheck) {
            const clonedCell: HTMLElement = args.cell.cloneNode(true) as HTMLElement;
            clonedCell.style.width = getColumnWidth(args.sheet, args.colIdx, true) + 'px';
            this.tableRow.appendChild(clonedCell);
        }
        if ((args.lastCell && this.tableRow.childElementCount) || args.needHeightCheck) {
            const tableRow: HTMLElement = args.row || this.parent.getRow(args.rowIdx);
            const previouseHeight: number = getRowHeight(args.sheet, args.rowIdx);
            const rowHeight: number = this.getRowHeightOnInit();
            if (rowHeight > previouseHeight) {
                const dprHgt: number = getDPRValue(rowHeight);
                tableRow.style.height = `${dprHgt}px`;
                (args.hRow || this.parent.getRow(args.rowIdx, this.parent.getRowHeaderTable())).style.height = `${dprHgt}px`;
                setRowHeight(args.sheet, args.rowIdx, rowHeight);
            }
            this.tableRow.innerHTML = '';
        }
    }

    private getRowHeightOnInit(): number {
        const tTable: HTMLElement = this.parent.createElement('table', { className: 'e-table e-test-table' });
        const tBody: HTMLElement = tTable.appendChild(this.parent.createElement('tbody'));
        tBody.appendChild(this.tableRow);
        this.parent.element.appendChild(tTable);
        const height: number = Math.round(this.tableRow.getBoundingClientRect().height);
        this.parent.element.removeChild(tTable);
        return height < 20 ? 20 : height;
    }

    private removeStyle(element: HTMLElement, rowIdx: number, colIdx: number): void {
        let cellStyle: CellStyleModel;
        if (element.style.length) {
            cellStyle = this.parent.getCellStyleValue(['borderLeft', 'border'], [rowIdx, colIdx + 1]);
            const rightBorder: string = cellStyle.borderLeft || cellStyle.border;
            cellStyle = this.parent.getCellStyleValue(['borderTop', 'border'], [rowIdx + 1, colIdx]);
            const bottomBorder: string = cellStyle.borderTop || cellStyle.border;
            if (rightBorder || bottomBorder) {
                [].slice.call(element.style).forEach((style: string) => {
                    if (rightBorder && bottomBorder) {
                        if (!style.includes('border-right') && !style.includes('border-bottom')) {
                            element.style.removeProperty(style);
                        }
                    } else if ((rightBorder && !(style.indexOf('border-right') > -1) && (!bottomBorder || bottomBorder === 'none')) ||
                        (bottomBorder && !(style.indexOf('border-bottom') > -1) && (!rightBorder || rightBorder === 'none'))) {
                        element.style.removeProperty(style);
                    }
                });
            } else {
                element.removeAttribute('style');
            }
        }
        const prevRowCell: HTMLElement = this.parent.getCell(rowIdx - 1, colIdx);
        if (prevRowCell && prevRowCell.style.borderBottom) {
            const prevRowIdx: number = Number(prevRowCell.parentElement.getAttribute('aria-rowindex')) - 1;
            cellStyle = this.parent.getCellStyleValue(['borderBottom', 'border'], [prevRowIdx, colIdx]);
            if (!(cellStyle.borderBottom || cellStyle.border)) { prevRowCell.style.borderBottom = ''; }
        }
        const prevColCell: HTMLElement = <HTMLElement>element.previousElementSibling;
        if (prevColCell && prevColCell.style.borderRight) {
            colIdx = Number(prevColCell.getAttribute('aria-colindex')) - 1;
            cellStyle = this.parent.getCellStyleValue(['borderRight', 'border'], [rowIdx, colIdx]);
            if (!(cellStyle.borderRight || cellStyle.border)) { prevColCell.style.borderRight = ''; }
        }
    }
    /**
     * @hidden
     * @param {number[]} range - Specifies the range.
     * @param {boolean} refreshing - Specifies the refresh.
     * @param {boolean} checkWrap - Specifies the range.
     * @returns {void}
     */
    public refreshRange(range: number[], refreshing?: boolean, checkWrap?: boolean): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        const cRange: number[] = range.slice(); let args: CellRenderArgs; let cell: HTMLTableCellElement;
        if (inView(this.parent, cRange, true)) {
            for (let i: number = cRange[0]; i <= cRange[2]; i++) {
                if (isHiddenRow(sheet, i)) { continue; }
                for (let j: number = cRange[1]; j <= cRange[3]; j++) {
                    if (isHiddenCol(sheet, j)) { continue; }
                    cell = this.parent.getCell(i, j) as HTMLTableCellElement;
                    if (cell) {
                        args = { rowIdx: i, colIdx: j, td: cell, cell: getCell(i, j, sheet), isRefreshing: refreshing, lastCell: j ===
                            cRange[3], isRefresh: true, isHeightCheckNeeded: true, manualUpdate: true, first: '' };
                        this.update(args);
                        this.parent.notify(renderFilterCell, { td: cell, rowIndex: i, colIndex: j });
                        if (checkWrap) { this.setWrapByValue(sheet, args); }
                    }
                }
            }
        }
    }

    public refresh(rowIdx: number, colIdx: number, lastCell?: boolean, element?: Element): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        if (!element && (isHiddenRow(sheet, rowIdx) || isHiddenCol(sheet, colIdx))) { return; }
        if (element || !this.parent.scrollSettings.enableVirtualization || this.parent.insideViewport(rowIdx, colIdx)) {
            const cell: HTMLElement = <HTMLElement>element || this.parent.getCell(rowIdx, colIdx);
            if (!cell) { return; }
            this.update(<CellRenderArgs>{ rowIdx: rowIdx, colIdx: colIdx, td: cell, cell: getCell(
                rowIdx, colIdx, sheet), lastCell: lastCell, isRefresh: true, isHeightCheckNeeded: true,
            manualUpdate: true, first: '' });
            this.parent.notify(renderFilterCell, { td: cell, rowIndex: rowIdx, colIndex: colIdx });
        }
    }

    private updateView(args: { indexes: number[], sheetIndex?: number, refreshing?: boolean, checkWrap?: boolean }): void {
        if (isNullOrUndefined(args.sheetIndex) || (args.sheetIndex === this.parent.activeSheetIndex)) {
            this.refreshRange(args.indexes, args.refreshing, args.checkWrap);
        } else if (args.refreshing) {
            this.calculateFormula(
                { cell: getCell(args.indexes[0], args.indexes[1], getSheet(this.parent, args.sheetIndex), true), rowIdx: args.indexes[0],
                    colIdx: args.indexes[1], sheetIndex: args.sheetIndex });
        }
    }
}
