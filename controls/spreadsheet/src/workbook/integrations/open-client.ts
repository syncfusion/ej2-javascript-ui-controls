import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Workbook, SheetModel, CellModel, RowModel, ColumnModel, getCell, initSheet, getRowsHeight, getColumnsWidth } from '../base/index';
import { Workbook as XlsxWorkbook, Worksheet as XlsxWorksheet, Cell as XlsxCell, BorderEdge, Alignment, Font, Border, Fill } from '@syncfusion/ej2-xlsx';
import {
    openSuccess, openFailure, CellStyleModel, workbookFormulaOperation, sheetsDestroyed, sheetCreated, MergedCellModel,
    getRangeIndexes, ConditionalFormatModel, ColorScale, DataBar, IconSet, DefineNameModel, FilterCollectionModel,
    SortCollectionModel, importModelUpdate, getCellAddress, FontFamily, beginAction,
    ExtendedSheet, RichTextModel,
    ExtendedThreadedCommentModel
} from '../common/index';
import { clearUndoRedoCollection, removeWorkbookProtection, updateToggleItem } from '../../spreadsheet/common/event';
import { OpenArgs, BeforeOpenEventArgs } from '../../spreadsheet';

export class WorkbookOpenClient {
    private parent: Workbook;

    constructor(parent: Workbook) {
        this.parent = parent;
    }

    private getArrayBuffer(file: File | Blob): Promise<ArrayBuffer> {
        if ((file as any).arrayBuffer) {
            return (file as any).arrayBuffer();
        }
        return new Promise<ArrayBuffer>((resolve: (value: ArrayBuffer) => void, reject: (reason?: any) => void): void => {
            const reader: FileReader = new FileReader();
            reader.onload = (): void => {
                resolve(reader.result as ArrayBuffer);
            };
            reader.onerror = (error: any): void => {
                reject(error);
            };
            reader.readAsArrayBuffer(file);
        });
    }

    private isValidXlsxFile(file: File | Blob): boolean {
        let isValid: boolean = true;
        if (file instanceof File) {
            const fileName: string = file.name ? file.name.toLowerCase() : '';
            isValid = fileName.endsWith('.xlsx');
        }
        return isValid;
    }

    public async parseXlsxFile(file: File | Blob): Promise<XlsxWorkbook> {
        const arrayBuffer: ArrayBuffer = await this.getArrayBuffer(file);
        return await XlsxWorkbook.open(arrayBuffer);
    }

    public open(options: OpenArgs): void {
        const beforeOpenArgs: BeforeOpenEventArgs = {
            file: options.file || null,
            cancel: false,
            requestData: null,
            password: options.password || '',
            requestType: 'initial'
        };
        this.parent.trigger('beforeOpen', beforeOpenArgs);
        this.parent.notify(beginAction, { eventArgs: beforeOpenArgs, action: 'beforeOpen' });
        if (beforeOpenArgs.cancel) {
            this.parent.isOpen = false;
            return;
        }
        this.loadXlsxFile(options.file as File | Blob, options);
    }

    public async loadXlsxFile(file: File | Blob, eventArgs?: OpenArgs, successCallback?: Function): Promise<void> {
        if (!this.isValidXlsxFile(file)) {
            this.parent.notify(openFailure, {
                status: 'Failure',
                statusText: 'Unsupported file format. Please upload a valid .xlsx file.'
            });
            this.parent.isOpen = false;
            return;
        }
        try {
            const xlsxWorkbook: XlsxWorkbook = await this.parseXlsxFile(file);
            const openArgs: OpenArgs = eventArgs || { file: file instanceof File ? file : null };
            this.parent.notify(workbookFormulaOperation, { action: 'unRegisterSheet' });
            this.parent.sheetNameCount = 1;
            this.parent.sheets = [];
            this.parent.notify(sheetsDestroyed, {});
            this.parent.notify(clearUndoRedoCollection, null);
            this.parent.notify(removeWorkbookProtection, null);
            const sheets: SheetModel[] = this.processSheets(xlsxWorkbook);
            let activeSheetIndex: number = (xlsxWorkbook as any).activeSheetIndex || 0;
            if (sheets[activeSheetIndex as number] && sheets[activeSheetIndex as number].state === 'Hidden') {
                const firstVisible: number = sheets.findIndex((s: SheetModel) => s.state !== 'Hidden');
                if (firstVisible !== -1) {
                    activeSheetIndex = firstVisible;
                }
            }
            const definedNames: DefineNameModel[] = this.processDefinedNames(xlsxWorkbook);
            const filterAndSorts: { filters: FilterCollectionModel[], sorts: SortCollectionModel[] } =
                this.processFiltersAndSorts(xlsxWorkbook);
            const wbProtection: any = (xlsxWorkbook as any).workbookProtection;
            const wbProps: any = {
                'isProtected': (wbProtection && wbProtection.isProtected) ? true : false,
                'password': (wbProtection && wbProtection.password) ? String(wbProtection.password) : '',
                'hashValue': (wbProtection && wbProtection.hashValue) ? String(wbProtection.hashValue) : null,
                'saltValue': (wbProtection && wbProtection.saltValue) ? String(wbProtection.saltValue) : null,
                'spinCount': (wbProtection && wbProtection.spinCount) ? wbProtection.spinCount : null,
                'algorithmName': (wbProtection && wbProtection.algorithmName) ? String(wbProtection.algorithmName) : 'SHA-512',
                'sheets': sheets,
                'activeSheetIndex': activeSheetIndex,
                'listSeparator': (xlsxWorkbook as any).listSeparator || this.parent.listSeparator
            };
            if (definedNames.length > 0) {
                wbProps.definedNames = definedNames;
            }
            if (filterAndSorts.filters.length > 0) {
                wbProps.filterCollection = filterAndSorts.filters;
            }
            if (filterAndSorts.sorts.length > 0) {
                wbProps.sortCollection = filterAndSorts.sorts;
            }
            this.parent.setProperties(wbProps, true);
            if (this.parent.isProtected && (this.parent.password && this.parent.password.length > 0 || this.parent.hashValue)) {
                const parentElem: HTMLElement = (this.parent as any).element;
                if (this.parent.showSheetTabs && parentElem) {
                    const addSheetTab: Element = parentElem.querySelector('.e-add-sheet-tab');
                    if (addSheetTab) {
                        addSheetTab.setAttribute('disabled', 'true');
                        addSheetTab.classList.add('e-disabled');
                    }
                }
                this.parent.notify(updateToggleItem, { props: 'Protectworkbook' });
            }
            initSheet(this.parent, undefined, true);
            this.parent.notify(sheetCreated, null);
            this.parent.notify(importModelUpdate, null);
            const successData: any = { sheets: sheets, activeSheetIndex: activeSheetIndex };
            if (definedNames.length > 0) {
                successData.definedNames = definedNames;
            }
            this.parent.notify(openSuccess, {
                context: this,
                data: successData,
                eventArgs: openArgs,
                isOpenFromJson: false
            });
            this.parent.isOpen = false;
            if (successCallback) {
                successCallback(
                    { Workbook: { sheets, activeSheetIndex } },
                    openArgs, file instanceof File ? file : undefined, false, true
                );
            }
        } catch (error) {
            this.parent.notify(openFailure, {
                status: 'Failure',
                statusText: error && (error as any).message ? (error as any).message : 'Error parsing XLSX file'
            });
            this.parent.isOpen = false;
        }
    }

    private processSheets(xlsxWorkbook: XlsxWorkbook): SheetModel[] {
        const sheets: SheetModel[] = [];
        const worksheets: XlsxWorksheet[] = (xlsxWorkbook.worksheets as any) || [];
        for (let sIdx: number = 0; sIdx < worksheets.length; sIdx++) {
            const sheetModel: SheetModel = this.processSheet(worksheets[sIdx as number], sIdx, xlsxWorkbook);
            if (sheetModel) {
                sheets.push(sheetModel);
            }
        }
        return sheets;
    }

    private processSheet(xlsxSheet: XlsxWorksheet, sheetIndex: number, xlsxWorkbook?: XlsxWorkbook): SheetModel {
        if (!xlsxSheet) {
            return null;
        }
        const internalSheet: any = (xlsxSheet as any).sheet || xlsxSheet;
        const colEntries: ReadonlyArray<any> = xlsxSheet.columns
            ? ((xlsxSheet.columns as any).entries || (xlsxSheet.columns.list ? xlsxSheet.columns.list() : [])) : [];
        const rowEntries: any[] = xlsxSheet.rows && (xlsxSheet.rows as any).entries;
        const usedRange: any = (xlsxSheet as any).usedRange;
        let lastRow: number = (usedRange && usedRange.lastRow) || 0;
        if (rowEntries && rowEntries.length > 0) {
            for (let i: number = 0; i < rowEntries.length; i++) {
                if (rowEntries[i as number] && rowEntries[i as number].index > lastRow) {
                    lastRow = rowEntries[i as number].index;
                }
            }
        }
        let lastColumn: number = (usedRange && usedRange.lastColumn) || 0;
        if (colEntries && colEntries.length > 0) {
            for (let i: number = 0; i < colEntries.length; i++) {
                if (colEntries[i as number] && colEntries[i as number].max > lastColumn) {
                    lastColumn = colEntries[i as number].max;
                }
            }
        }
        if (rowEntries && rowEntries.length > 0) {
            for (let i: number = 0; i < rowEntries.length; i++) {
                const rEntry: any = rowEntries[i as number];
                if (rEntry && rEntry.cells && rEntry.cells.entries) {
                    const cEntries: any[] = rEntry.cells.entries;
                    for (let j: number = 0; j < cEntries.length; j++) {
                        if (cEntries[j as number] && cEntries[j as number].index > lastColumn) {
                            lastColumn = cEntries[j as number].index;
                        }
                    }
                }
            }
        }

        let selectedRange: string = xlsxSheet.selectedRange ? (xlsxSheet.selectedRange.indexOf(':') === -1 ? `${xlsxSheet.selectedRange}:${xlsxSheet.selectedRange}` : xlsxSheet.selectedRange) : 'A1:A1';
        if (selectedRange.indexOf('1048576') !== -1) {
            selectedRange = selectedRange.replace(/1048576/g, '65536');
        }
        const stdHeight: number = Math.round(((xlsxSheet.standardHeight * 96) / 72) * 10) / 10;
        const sheetModel: SheetModel = {
            id: sheetIndex + 1,
            name: xlsxSheet.name || ('Sheet' + (sheetIndex + 1)),
            rowCount: Math.max(100, lastRow),
            colCount: Math.max(100, lastColumn),
            rows: [],
            columns: [],
            selectedRange: selectedRange,
            topLeftCell: (xlsxSheet as any).topLeftCell || 'A1',
            showGridLines: xlsxSheet.isGridLinesVisible !== false,
            showHeaders: xlsxSheet.isRowColumnHeadersVisible !== false,
            state: xlsxSheet.visibility === false ? 'Hidden' : 'Visible',
            standardHeight: stdHeight,
            usedRange: {
                rowIndex: lastRow > 0 ? lastRow - 1 : 0,
                colIndex: lastColumn > 0 ? lastColumn - 1 : 0
            }
        };
        const extSheet: ExtendedSheet = sheetModel as ExtendedSheet;
        extSheet.maxHgts = [];
        extSheet.comments = [];
        extSheet.notes = [];
        if (xlsxSheet.freeze && xlsxSheet.freeze.isFrozen) {
            if (xlsxSheet.freeze.rows) {
                sheetModel.frozenRows = xlsxSheet.freeze.rows;
            }
            if (xlsxSheet.freeze.columns) {
                sheetModel.frozenColumns = xlsxSheet.freeze.columns;
            }
        }
        if ((xlsxSheet as any).paneTopLeftCell && (xlsxSheet as any).paneTopLeftCell !== sheetModel.topLeftCell) {
            sheetModel.paneTopLeftCell = (xlsxSheet as any).paneTopLeftCell;
        }
        const sheetProt: any = (xlsxSheet as any).sheetProtection;
        if (sheetProt && sheetProt.isProtected) {
            sheetModel.isProtected = true;
            sheetModel.hashValue = sheetProt.hashValue ? sheetProt.hashValue : '';
            sheetModel.saltValue = sheetProt.saltValue ? sheetProt.saltValue : '';
            sheetModel.spinCount = sheetProt.spinCount !== undefined ? sheetProt.spinCount : null;
            sheetModel.password = sheetProt.password ? String(sheetProt.password) : '';
            const options: any = sheetProt.options;
            if (options) {
                sheetModel.protectSettings = {
                    selectCells: options.allowsSelectLockedCells !== false,
                    selectUnLockedCells: options.allowsSelectUnlockedCells !== false,
                    formatCells: Boolean(options.allowsFormatCells),
                    formatRows: Boolean(options.allowsFormatRows),
                    formatColumns: Boolean(options.allowsFormatColumns),
                    insertLink: Boolean(options.allowsInsertHyperlinks)
                };
            }
        }
        if (colEntries && colEntries.length > 0) {
            this.processColumns(sheetModel, colEntries, lastColumn);
        }
        this.processRows(xlsxSheet, sheetModel, rowEntries, lastRow, lastColumn, internalSheet);
        this.processMergedCells(sheetModel, xlsxSheet);
        this.processValidations(sheetModel, xlsxSheet);
        this.processConditionalFormats(sheetModel, xlsxSheet, xlsxWorkbook);
        this.processChartsAndImages(sheetModel, xlsxSheet, sheetIndex);
        this.processHyperlinks(sheetModel, xlsxSheet);
        this.processThreadedComments(sheetModel, xlsxSheet);
        this.processNotes(sheetModel, xlsxSheet);
        return sheetModel;
    }

    private processColumns(sheetModel: SheetModel, colEntries: ReadonlyArray<any>, lastColumn: number): void {
        if (!colEntries || colEntries.length === 0 || lastColumn === 0) {
            return;
        }
        let maxColLen: number = 0;
        const colsInfo: Map<number, ColumnModel> = new Map<number, ColumnModel>();
        for (let i: number = 0; i < colEntries.length; i++) {
            const entry: any = colEntries[i as number];
            if (entry) {
                if (entry.max > maxColLen) {
                    maxColLen = entry.max;
                }
                for (let c: number = entry.min; c <= entry.max; c++) {
                    colsInfo.set(c, entry);
                }
            }
        }
        const totalCols: number = Math.max(lastColumn, maxColLen);
        let addIdx: boolean = false;
        for (let colIdx: number = 1; colIdx <= totalCols; colIdx++) {
            const colInfo: ColumnModel = colsInfo.get(colIdx);
            if (!colInfo) {
                addIdx = true;
            } else {
                const isHidden: boolean = Boolean(colInfo.hidden || (colInfo as any).width === 0);
                const rawWidth: number = (colInfo as any).width || 0;
                const colWidth: number = isHidden ? 15 : (rawWidth > 0 ? Math.round(rawWidth * 7 + 5) : 0);
                if (isHidden || (colWidth > 0 && colWidth !== 64)) {
                    const column: ColumnModel = {};
                    if (isHidden) {
                        column.hidden = true;
                        column.width = 15;
                    } else {
                        column.width = colWidth <= 15 ? 15 : colWidth;
                    }
                    if (addIdx) {
                        column.index = colIdx - 1;
                    }
                    sheetModel.columns.push(column);
                    addIdx = false;
                } else {
                    addIdx = true;
                }
            }
        }
    }

    private processRows(
        xlsxSheet: XlsxWorksheet, sheetModel: SheetModel, rowEntries: any[],
        lastRow: number, lastColumn: number, internalSheet: any
    ): void {
        if (!xlsxSheet || lastRow === 0) {
            return;
        }
        const rowMap: Map<number, any> = new Map<number, any>();
        if (rowEntries) {
            for (let i: number = 0; i < rowEntries.length; i++) {
                const entry: any = rowEntries[i as number];
                if (entry) {
                    rowMap.set(entry.index, entry);
                }
            }
        }
        const standardHeight: number = sheetModel.standardHeight || 20;
        for (let rowIndex: number = 1; rowIndex <= lastRow; rowIndex++) {
            const rowModel: RowModel = { cells: [] };
            const rowEntry: any = rowMap.get(rowIndex);
            const isHidden: boolean = rowEntry ? (rowEntry.hidden || rowEntry.height === 0) : false;
            if (isHidden) {
                rowModel.hidden = true;
                rowModel.height = internalSheet && internalSheet.getHiddenRowHeightInPixels
                    ? internalSheet.getHiddenRowHeightInPixels(rowIndex) : 18;
            } else if (rowEntry) {
                if (rowEntry.height !== undefined && rowEntry.height !== null) {
                    const rowHeightPixels: number = Math.round(((rowEntry.height * 96) / 72) * 100) / 100;
                    if (rowHeightPixels !== standardHeight) {
                        rowModel.height = rowHeightPixels;
                    }
                }
                if (rowEntry.customHeight || rowEntry.isBadFontHeight) {
                    rowModel.customHeight = true;
                }
            }
            for (let columnIndex: number = 1; columnIndex <= lastColumn; columnIndex++) {
                rowModel.cells.push(this.processCell(xlsxSheet, rowIndex, columnIndex, internalSheet, rowEntry));
            }
            sheetModel.rows.push(rowModel);
        }
    }

    private processCell(xlsxSheet: XlsxWorksheet, rowIndex: number, columnIndex: number, internalSheet: any, rowEntry?: any): CellModel {
        const cellWrapper: XlsxCell = xlsxSheet.cell(rowIndex, columnIndex);
        if (!cellWrapper) {
            return {};
        }
        const rawValue: any = cellWrapper.value;
        const formulaStr: string = cellWrapper.formula;
        const numberFormatStr: string = cellWrapper.numberFormat;
        const cellStyleObj: any = cellWrapper.style;
        const cellModel: CellModel = {};
        if (numberFormatStr && numberFormatStr.toLowerCase() !== 'general') {
            let formatCode: string = numberFormatStr;
            const strippedQuotes: string = formatCode
                .replace(/""/g, '')
                .replace(/"/g, '')
                .replace(/\[\$-[^\]]+\]/gi, '')
                .trim();
            const stripped: string = strippedQuotes.replace(/\\/g, '');
            if (stripped.indexOf('*') >= 0 && stripped.indexOf('#,##0') >= 0 &&
                (stripped.indexOf('-') >= 0 || stripped.indexOf('@') >= 0)) {
                if (stripped.indexOf('$') >= 0 || (formatCode && formatCode.indexOf('$') >= 0)) {
                    if (stripped.indexOf('.00') >= 0 || stripped.indexOf('.0') >= 0) {
                        formatCode = '_($* #,##0.00_);_($* \\(#,##0.00\\);_($* "-"??_);_(@_)';
                    } else {
                        formatCode = '_($* #,##0_);_($* \\(#,##0\\);_($* "-"_);_(@_)';
                    }
                } else {
                    if (stripped.indexOf('.00') >= 0 || stripped.indexOf('.0') >= 0) {
                        formatCode = '_(* #,##0.00_);_(* \\(#,##0.00\\);_(* "-"??_);_(@_)';
                    } else {
                        formatCode = '_(* #,##0_);_(* \\(#,##0\\);_(* "-"_);_(@_)';
                    }
                }
            } else if (stripped === '$#,##0.00' || stripped === '$#,##0') {
                formatCode = '$#,##0.00';
            } else if (stripped === 'mm-dd-yy' || stripped === 'm-d-yy' || stripped === 'm/d/yy' ||
                stripped === 'mm/dd/yy' || stripped === 'yyyy-mm-dd') {
                formatCode = 'm/d/yyyy';
            } else if (stripped === 'h:mm:ss' || stripped === 'hh:mm:ss') {
                formatCode = 'h:mm:ss';
            } else if (stripped === 'h:mm' || stripped === 'hh:mm') {
                formatCode = 'h:mm';
            } else if (stripped.toLowerCase() === 'h:mm am/pm') {
                formatCode = 'h:mm AM/PM';
            } else if (stripped.toLowerCase() === 'h:mm:ss am/pm') {
                formatCode = 'h:mm:ss AM/PM';
            } else {
                formatCode = strippedQuotes;
            }
            if (formatCode) {
                cellModel.format = formatCode;
            }
        }
        if (formulaStr) {
            const displayText: any = (cellWrapper as any).displayText || rawValue;
            if (formulaStr.indexOf('=[') !== 0) {
                cellModel.formula = formulaStr.startsWith('=') ? formulaStr : '=' + formulaStr;
                if (displayText) {
                    cellModel.value = String(displayText);
                }
            } else if (displayText) {
                cellModel.value = String(displayText);
            }
        } else if (!isNullOrUndefined(rawValue)) {
            const stringValue: string = String(rawValue);
            cellModel.value = stringValue;
            if (cellStyleObj && cellStyleObj.alignment && !cellStyleObj.alignment.wrapText && stringValue.indexOf('\n') !== -1) {
                cellModel.wrap = false;
            }
        }
        let mappedStyle: CellStyleModel = cellStyleObj ? this.processCellStyle(cellStyleObj) : undefined;
        if (isNullOrUndefined(mappedStyle) && !isNullOrUndefined(rowEntry)) {
            const rowStyleObj: any = rowEntry.style || rowEntry.cellFormat || rowEntry.format;
            if (!isNullOrUndefined(rowStyleObj)) {
                mappedStyle = this.processCellStyle(rowStyleObj);
            }
        }
        if (!isNullOrUndefined(mappedStyle)) {
            cellModel.style = mappedStyle;
        }
        if (cellStyleObj) {
            if (cellStyleObj.alignment && cellStyleObj.alignment.wrapText) {
                cellModel.wrap = true;
            }
            if (cellStyleObj.protection && cellStyleObj.protection.locked === false) {
                cellModel.isLocked = false;
            }
        }
        if (cellWrapper.hasRichText) {
            const richText: RichTextModel[] = this.processRichText(cellWrapper);
            if (richText) {
                cellModel.richText = richText;
            }
        }
        return cellModel;
    }

    private processRichText(cellWrapper: XlsxCell): RichTextModel[] {
        const runs: any[] = cellWrapper.richText.getRuns();
        const richTextModels: RichTextModel[] = [];
        for (let i: number = 0; i < runs.length; i++) {
            const run: any = runs[i as number];
            const runModel: RichTextModel = { text: run.text };
            if (run.font) {
                const style: CellStyleModel = {};
                if (run.font.vertAlign === 'superscript') {
                    style.verticalAlign = 'super' as any;
                } else if (run.font.vertAlign === 'subscript') {
                    style.verticalAlign = 'sub' as any;
                }
                if (run.font.bold) { style.fontWeight = 'bold'; }
                if (run.font.italic) { style.fontStyle = 'italic'; }
                if (run.font.size && run.font.size !== 11) { style.fontSize = `${run.font.size}pt`; }
                if (run.font.name && run.font.name !== 'Calibri') { style.fontFamily = run.font.name as FontFamily; }
                if (run.font.color) {
                    const colorHex: string = this.resolveColor(run.font.color);
                    if (colorHex && colorHex !== '#000000') {
                        style.color = colorHex;
                    }
                }
                runModel.style = style;
            }
            richTextModels.push(runModel);
        }
        return richTextModels.length > 0 ? richTextModels : undefined;
    }

    private processCellStyle(cellFormat: any): CellStyleModel {
        if (!cellFormat) {
            return undefined;
        }
        const styleModel: CellStyleModel = {};
        let hasStyle: boolean = false;
        if (cellFormat.alignment) {
            const alignmentObj: Alignment = cellFormat.alignment;
            if (alignmentObj.horizontal && alignmentObj.horizontal.toLowerCase() !== 'general') {
                const horizontalAlign: string = alignmentObj.horizontal.toLowerCase();
                if (horizontalAlign === 'left' || horizontalAlign === 'center' || horizontalAlign === 'right') {
                    styleModel.textAlign = horizontalAlign as 'left' | 'center' | 'right';
                    hasStyle = true;
                }
            }
            if (alignmentObj.vertical && alignmentObj.vertical.toLowerCase() !== 'bottom') {
                const verticalAlign: string = alignmentObj.vertical.toLowerCase();
                styleModel.verticalAlign = verticalAlign === 'center' ? 'middle' : verticalAlign as 'top' | 'middle';
                hasStyle = true;
            }
            if (alignmentObj.indent && alignmentObj.indent > 0 && styleModel.textAlign !== 'right') {
                const fontObj: Font = cellFormat.font;
                const fontSizeValue: number = fontObj && fontObj.size ? fontObj.size : 11;
                const pixelWidth: number = (fontSizeValue * (96 / 72) * 0.35) * 3;
                styleModel.textIndent = String(Math.round(alignmentObj.indent * pixelWidth)) + 'px';
                hasStyle = true;
            }
        }
        const fontObj: Font = cellFormat.font;
        if (fontObj) {
            if (fontObj.name && fontObj.name !== 'Calibri') {
                styleModel.fontFamily = fontObj.name as FontFamily;
                hasStyle = true;
            }
            if (fontObj.size && fontObj.size !== 11) {
                styleModel.fontSize = `${fontObj.size}pt`;
                hasStyle = true;
            }
            if (fontObj.bold) {
                styleModel.fontWeight = 'bold';
                hasStyle = true;
            }
            if (fontObj.italic) {
                styleModel.fontStyle = 'italic';
                hasStyle = true;
            }
            if (fontObj.underline && fontObj.strike) {
                styleModel.textDecoration = 'underline line-through';
                hasStyle = true;
            } else if (fontObj.underline) {
                styleModel.textDecoration = 'underline';
                hasStyle = true;
            } else if (fontObj.strike) {
                styleModel.textDecoration = 'line-through';
                hasStyle = true;
            }
            if (fontObj.vertAlign === 'superscript') {
                styleModel.verticalAlign = 'super' as any;
                hasStyle = true;
            } else if (fontObj.vertAlign === 'subscript') {
                styleModel.verticalAlign = 'sub' as any;
                hasStyle = true;
            }
            if (fontObj.color) {
                const colorHex: string = this.resolveColor(fontObj.color);
                if (colorHex && colorHex !== '#000000' && colorHex !== '#FFFFFF') {
                    styleModel.color = colorHex;
                    hasStyle = true;
                }
            }
        }
        const fillObj: Fill = cellFormat.fill;
        if (fillObj && fillObj.type === 'pattern' && fillObj.patternType && fillObj.patternType !== 'none') {
            const colorSource: any = fillObj.fgColor || fillObj.bgColor;
            if (colorSource) {
                let backgroundHex: string = '';
                if (colorSource.theme !== undefined &&
                    (isNullOrUndefined(colorSource.tint) || colorSource.tint === 0)) {
                    backgroundHex = this.resolveColor(colorSource);
                } else if (colorSource.rgbColor) {
                    backgroundHex = this.formatHexColor(colorSource.rgbColor);
                } else {
                    backgroundHex = this.resolveColor(colorSource);
                }
                if (backgroundHex) {
                    styleModel.backgroundColor = backgroundHex;
                    hasStyle = true;
                }
            }
        }
        const borderObj: Border = cellFormat.borders || cellFormat.border;
        if (borderObj) {
            if (borderObj.left && borderObj.left.style && borderObj.left.style !== 'none') {
                styleModel.borderLeft = this.formatBorderEdge(borderObj.left);
                hasStyle = true;
            }
            if (borderObj.right && borderObj.right.style && borderObj.right.style !== 'none') {
                styleModel.borderRight = this.formatBorderEdge(borderObj.right);
                hasStyle = true;
            }
            if (borderObj.top && borderObj.top.style && borderObj.top.style !== 'none') {
                styleModel.borderTop = this.formatBorderEdge(borderObj.top);
                hasStyle = true;
            }
            if (borderObj.bottom && borderObj.bottom.style && borderObj.bottom.style !== 'none') {
                styleModel.borderBottom = this.formatBorderEdge(borderObj.bottom);
                hasStyle = true;
            }
        }
        return hasStyle ? styleModel : undefined;
    }

    private processMergedCells(sheetModel: SheetModel, xlsxSheet: XlsxWorksheet): void {
        const mergedAddresses: ReadonlyArray<string> = xlsxSheet.mergedCells ? xlsxSheet.mergedCells.list() : [];
        if (!mergedAddresses || mergedAddresses.length === 0) {
            return;
        }
        const mergedList: MergedCellModel[] = [];
        for (let i: number = 0; i < mergedAddresses.length; i++) {
            const rangeIndexes: number[] = getRangeIndexes(mergedAddresses[i as number]);
            const rowSpan: number = rangeIndexes[2] - rangeIndexes[0] + 1;
            const colSpan: number = rangeIndexes[3] - rangeIndexes[1] + 1;
            mergedList.push({ rowSpan: rowSpan, colSpan: colSpan, address: [rangeIndexes[0], rangeIndexes[1]] });
        }
        (sheetModel as any).mergedCells = mergedList;
    }

    private processHyperlinks(sheetModel: SheetModel, xlsxSheet: XlsxWorksheet): void {
        const linkList: ReadonlyArray<any> = xlsxSheet.hyperlinks ? xlsxSheet.hyperlinks.list() : [];
        if (!linkList || linkList.length === 0) {
            return;
        }
        const sheetLinks: { address: string; range: number[] }[] = [];
        for (let i: number = 0; i < linkList.length; i++) {
            const link: any = linkList[i as number];
            if (link && link.ref && link.target) {
                const cellIdx: number[] = getRangeIndexes(link.ref);
                const r: number = cellIdx[0];
                const c: number = cellIdx[1];
                sheetLinks.push({ address: link.target, range: [r, c] });
                const targetCell: CellModel = getCell(r, c, sheetModel, true, true);
                if (targetCell) {
                    targetCell.hyperlink = link.target;
                }
            }
        }
        if (sheetLinks.length > 0) {
            (sheetModel as any).hyperLinks = sheetLinks;
        }
    }

    private processValidations(sheetModel: SheetModel, xlsxSheet: XlsxWorksheet): void {
        const validations: any[] = xlsxSheet.dataValidations ? (xlsxSheet.dataValidations as any).entries : null;
        if (!validations || validations.length === 0) {
            return;
        }
        const typeMap: { [key: string]: any } = {
            'whole': 'WholeNumber', 'decimal': 'Decimal', 'date': 'Date',
            'time': 'Time', 'textLength': 'TextLength', 'list': 'List', 'custom': 'Custom'
        };
        const operatorMap: { [key: string]: any } = {
            'between': 'Between', 'notBetween': 'NotBetween', 'equal': 'EqualTo',
            'notEqual': 'NotEqualTo', 'greaterThan': 'GreaterThan', 'lessThan': 'LessThan',
            'greaterThanOrEqual': 'GreaterThanOrEqualTo', 'lessThanOrEqual': 'LessThanOrEqualTo'
        };
        for (let i: number = 0; i < validations.length; i++) {
            const dv: any = validations[i as number];
            if (dv && dv.ranges && dv.ranges.length > 0) {
                const validationType: any = typeMap[dv.type] || 'WholeNumber';
                const validationOperator: any = (dv.operator && operatorMap[dv.operator]) || 'Between';
                let val1: string = dv.firstFormula ? String(dv.firstFormula) : '';
                let val2: string = dv.secondFormula ? String(dv.secondFormula) : '';
                if (validationType === 'List') {
                    if (val1.startsWith('"')) {
                        val1 = dv.listOfValues && dv.listOfValues.length > 0 ? dv.listOfValues.join(',') : val1.replace(/^"|"$/g, '');
                    } else if (val1 && !val1.startsWith('=')) {
                        val1 = `=${val1}`;
                    }
                } else {
                    if (val1 && !val1.startsWith('=') && isNaN(Number(val1))) {
                        val1 = `=${val1}`;
                    }
                    if (validationOperator === 'Between' || validationOperator === 'NotBetween') {
                        if (val2 && !val2.startsWith('=') && isNaN(Number(val2))) {
                            val2 = `=${val2}`;
                        }
                    } else {
                        val2 = undefined;
                    }
                }
                const rangeList: string[] = [];
                for (let r: number = 0; r < dv.ranges.length; r++) {
                    const rangeIndexes: number[] = this.processRange(dv.ranges[r as number]);
                    const sRow: number = rangeIndexes[0]; const sCol: number = rangeIndexes[1];
                    const eRow: number = rangeIndexes[2]; const eCol: number = rangeIndexes[3];
                    const startAddr: string = getCellAddress(sRow, sCol);
                    const endAddr: string = getCellAddress(eRow, eCol);
                    rangeList.push(startAddr === endAddr ? startAddr : startAddr + ':' + endAddr);
                    const cellVal: any = {
                        type: validationType,
                        operator: validationOperator,
                        value1: val1,
                        ignoreBlank: dv.allowBlank !== false
                    };
                    if (val2) {
                        cellVal.value2 = val2;
                    }
                    if (validationType === 'List') {
                        cellVal.inCellDropDown = dv.suppressDropDownArrow !== true;
                    }
                    const maxRowLimit: number = eRow >= 1048575 ? Math.min(sheetModel.rows.length, 100) : (eRow + 1);
                    for (let rowIdx: number = sRow; rowIdx < maxRowLimit; rowIdx++) {
                        const row: RowModel = sheetModel.rows[rowIdx as number];
                        if (row && row.cells) {
                            for (let colIdx: number = sCol; colIdx <= eCol; colIdx++) {
                                const cell: CellModel = row.cells[colIdx as number];
                                if (cell) {
                                    cell.validation = cellVal;
                                }
                            }
                        }
                    }
                }
                if (!(sheetModel as any).validations) {
                    (sheetModel as any).validations = [];
                }
                const sheetVal: any = {
                    range: rangeList,
                    ignoreBlank: dv.allowBlank !== false
                };
                if (validationType !== 'WholeNumber') {
                    sheetVal.type = validationType;
                }
                if (val1) {
                    sheetVal.value1 = val1;
                }
                if (val2) {
                    sheetVal.value2 = val2;
                }
                if (validationOperator !== 'Between') {
                    sheetVal.operator = validationOperator;
                }
                if (validationType === 'List') {
                    sheetVal.inCellDropDown = dv.suppressDropDownArrow !== true;
                }
                (sheetModel as any).validations.push(sheetVal);
            }
        }
    }

    private processConditionalFormats(sheetModel: SheetModel, xlsxSheet: XlsxWorksheet, xlsxWorkbook?: XlsxWorkbook): void {
        const cfEntries: any[] = xlsxSheet.conditionalFormats ? (xlsxSheet.conditionalFormats as any).entries : null;
        if (!cfEntries || cfEntries.length === 0) {
            return;
        }
        const parseFormula: (val: any) => string = (val: any): string => {
            if (val == null) { return ''; }
            let str: string = String(val);
            if (str.startsWith('"') && str.endsWith('"') && str.length >= 2) {
                str = str.substring(1, str.length - 1).replace(/""/g, '"');
            }
            return str;
        };
        sheetModel.conditionalFormats = [];
        for (let i: number = 0; i < cfEntries.length; i++) {
            const cf: any = cfEntries[i as number];
            if (cf && cf.ranges && cf.ranges.length > 0) {
                const rangeList: string[] = [];
                for (let r: number = 0; r < cf.ranges.length; r++) {
                    const rangeIndexes: number[] = this.processRange(cf.ranges[r as number]);
                    const startAddr: string = getCellAddress(rangeIndexes[0], rangeIndexes[1]);
                    const endAddr: string = getCellAddress(rangeIndexes[2], rangeIndexes[3]);
                    rangeList.push(startAddr === endAddr ? startAddr : startAddr + ':' + endAddr);
                }
                const rangeStr: string = rangeList.join(',');
                if (cf.type === 'colorScale') {
                    sheetModel.conditionalFormats.push({ type: this.processColorScaleType(cf), range: rangeStr });
                } else if (cf.type === 'dataBar') {
                    sheetModel.conditionalFormats.push({ type: this.processDataBarType(cf) || 'BlueDataBar', range: rangeStr });
                } else if (cf.type === 'iconSet') {
                    const parsedIconSet: IconSet = this.processIconSetType(cf);
                    sheetModel.conditionalFormats.push({ type: parsedIconSet, range: rangeStr });
                } else {
                    let type: any = null;
                    let ruleValue: string = '';
                    if (cf.type === 'cellIs') {
                        if (cf.operator === 'greaterThan') {
                            type = 'GreaterThan';
                            ruleValue = cf.formulas ? parseFormula(cf.formulas[0]) : '';
                        } else if (cf.operator === 'lessThan') {
                            type = 'LessThan';
                            ruleValue = cf.formulas ? parseFormula(cf.formulas[0]) : '';
                        } else if (cf.operator === 'equal') {
                            type = 'EqualTo';
                            ruleValue = cf.formulas ? parseFormula(cf.formulas[0]) : '';
                        } else if (cf.operator === 'between') {
                            type = 'Between';
                            if (cf.formulas && cf.formulas.length >= 2) {
                                ruleValue = parseFormula(cf.formulas[0]) + ',' + parseFormula(cf.formulas[1]);
                            } else if (cf.formulas && cf.formulas.length === 1) {
                                ruleValue = parseFormula(cf.formulas[0]);
                            }
                        }
                    } else if (cf.type === 'containsText') {
                        type = 'ContainsText';
                        ruleValue = parseFormula(cf.text || (cf.formulas ? cf.formulas[0] : ''));
                    } else if (cf.type === 'beginsWith') {
                        type = 'BeginsWith';
                        ruleValue = parseFormula(cf.text || (cf.formulas ? cf.formulas[0] : ''));
                    } else if (cf.type === 'endsWith') {
                        type = 'EndsWith';
                        ruleValue = parseFormula(cf.text || (cf.formulas ? cf.formulas[0] : ''));
                    } else if (cf.type === 'timePeriod') {
                        type = 'DateOccur';
                        ruleValue = cf.timePeriod || (cf.formulas ? parseFormula(cf.formulas[0]) : '');
                    } else if (cf.type === 'duplicateValues') {
                        type = 'Duplicate';
                    } else if (cf.type === 'uniqueValues') {
                        type = 'Unique';
                    } else if (cf.type === 'top10') {
                        type = cf.percent ? (cf.bottom ? 'Bottom10Percentage' : 'Top10Percentage') : (cf.bottom ? 'Bottom10Items' : 'Top10Items');
                        if (cf.rank !== undefined) { ruleValue = String(cf.rank); }
                    } else if (cf.type === 'aboveAverage') {
                        type = (cf.bottom === true || (cf as any).aboveAverage === false) ? 'BelowAverage' : 'AboveAverage';
                    }
                    if (type) {
                        const model: ConditionalFormatModel = { type: type, range: rangeStr };
                        if (ruleValue) {
                            model.value = ruleValue;
                        }
                        let cfStyleObj: any = null;
                        if (cf.dxfId !== undefined && xlsxWorkbook && (xlsxWorkbook as any).styles) {
                            const stylesHost: any = (xlsxWorkbook as any).styles;
                            cfStyleObj = stylesHost.getDifferentialFormat(cf.dxfId);
                        }
                        let bgHex: string = '';
                        let fontHex: string = '';
                        let isBold: boolean = false;
                        let isItalic: boolean = false;
                        let isUnderline: boolean = false;
                        if (cfStyleObj) {
                            if (cfStyleObj.fill && (cfStyleObj.fill.bgColor || cfStyleObj.fill.fgColor)) {
                                bgHex = this.resolveColor(cfStyleObj.fill.bgColor || cfStyleObj.fill.fgColor);
                            }
                            if (cfStyleObj.font) {
                                if (cfStyleObj.font.color) {
                                    fontHex = this.resolveColor(cfStyleObj.font.color);
                                }
                                isBold = Boolean(cfStyleObj.font.bold);
                                isItalic = Boolean(cfStyleObj.font.italic);
                                isUnderline = Boolean(cfStyleObj.font.underline);
                            } else if (cfStyleObj.color) {
                                fontHex = this.resolveColor(cfStyleObj.color);
                            }
                            if (cfStyleObj.fontWeight === 'bold') { isBold = true; }
                            if (cfStyleObj.fontStyle === 'italic') { isItalic = true; }
                            if (cfStyleObj.textDecoration && cfStyleObj.textDecoration.indexOf('underline') >= 0) { isUnderline = true; }
                        }
                        const bgUpper: string = bgHex ? bgHex.toUpperCase().replace('#', '') : '';
                        const fontUpper: string = fontHex ? fontHex.toUpperCase().replace('#', '') : '';
                        let cFColorApplied: boolean = false;
                        if (bgUpper && fontUpper) {
                            if ((bgUpper === 'FFC7CE' || bgUpper === 'C7CE') && (fontUpper === '9C0006' || fontUpper === '0006')) {
                                model.cFColor = 'RedFT';
                                cFColorApplied = true;
                            } else if ((bgUpper === 'FFEB9C' || bgUpper === 'FFEF9C') &&
                                (fontUpper === '9C6500' || fontUpper === '9C5700' || fontUpper === '9C6100')) {
                                model.cFColor = 'YellowFT';
                                cFColorApplied = true;
                            } else if ((bgUpper === 'C6EFCE' || bgUpper === 'EFCE') &&
                                (fontUpper === '006100' || fontUpper === '006200' || fontUpper === '006000')) {
                                model.cFColor = 'GreenFT';
                                cFColorApplied = true;
                            }
                        } else if (bgUpper && (bgUpper === 'FFC7CE' || bgUpper === 'C7CE')) {
                            model.cFColor = 'RedF';
                            cFColorApplied = true;
                        } else if (fontUpper && (fontUpper === '9C0006' || fontUpper === '0006')) {
                            model.cFColor = 'RedT';
                            cFColorApplied = true;
                        }
                        if (!cFColorApplied) {
                            if (bgHex || fontHex || isBold || isItalic || isUnderline) {
                                const customStyle: CellStyleModel = {};
                                if (bgHex) { customStyle.backgroundColor = bgHex; }
                                if (fontHex) { customStyle.color = fontHex; }
                                if (isBold) { customStyle.fontWeight = 'bold'; }
                                if (isItalic) { customStyle.fontStyle = 'italic'; }
                                if (isUnderline) { customStyle.textDecoration = 'underline'; }
                                model.format = { style: customStyle };
                            } else {
                                model.cFColor = 'RedFT';
                            }
                        }
                        sheetModel.conditionalFormats.push(model);
                    }
                }
            }
        }
    }

    private processDefinedNames(xlsxWorkbook: XlsxWorkbook): DefineNameModel[] {
        const definedNames: DefineNameModel[] = [];
        const worksheets: any[] = (xlsxWorkbook.worksheets as any) ? (xlsxWorkbook.worksheets as any) : [];
        for (let sheetIndex: number = 0; sheetIndex < worksheets.length; sheetIndex++) {
            const currentWorksheet: any = worksheets[sheetIndex as number];
            const listObjectsList: any[] = currentWorksheet.listObjects ? currentWorksheet.listObjects : null;
            if (listObjectsList && listObjectsList.length > 0) {
                const sheetPrefix: string = currentWorksheet.name ? currentWorksheet.name : `Sheet${sheetIndex + 1}`;
                for (let tableIndex: number = 0; tableIndex < listObjectsList.length; tableIndex++) {
                    const tableObj: any = listObjectsList[tableIndex as number];
                    if (tableObj && tableObj.name && tableObj.range) {
                        definedNames.push({
                            name: tableObj.name,
                            refersTo: sheetPrefix + '!' + tableObj.range,
                            scope: 'Workbook'
                        });
                    }
                }
            }
        }
        if (xlsxWorkbook.names && typeof xlsxWorkbook.names.list === 'function') {
            const namesList: any = xlsxWorkbook.names.list();
            if (namesList && namesList.length > 0) {
                for (let i: number = 0; i < namesList.length; i++) {
                    const item: any = namesList[i as number];
                    if (item && item.name && item.content) {
                        definedNames.push({
                            name: item.name,
                            refersTo: item.content,
                            scope: item.sheetIndex !== undefined ? `Sheet${item.sheetIndex + 1}` : 'Workbook'
                        });
                    }
                }
            }
        }
        return definedNames;
    }

    private mapFilterOperator(operator: string): string {
        switch (operator) {
        case 'lessThan': return 'Less';
        case 'lessThanOrEqual': return 'LessOrEqual';
        case 'greaterThan': return 'Greater';
        case 'greaterThanOrEqual': return 'GreaterOrEqual';
        case 'notEqual': return 'Notequal';
        case 'equal': return 'Equal';
        case 'contains': return 'Contains';
        case 'doesNotContain': return 'NotContains';
        case 'beginsWith': return 'BeginsWith';
        case 'endsWith': return 'EndsWith';
        default: return 'Equal';
        }
    }

    private processFiltersAndSorts(xlsxWorkbook: XlsxWorkbook): { filters: FilterCollectionModel[], sorts: SortCollectionModel[] } {
        const filters: FilterCollectionModel[] = [];
        const sorts: SortCollectionModel[] = [];
        const worksheets: any[] = (xlsxWorkbook.worksheets as any) || [];
        for (let sheetIndex: number = 0; sheetIndex < worksheets.length; sheetIndex++) {
            const currentWorksheet: any = worksheets[sheetIndex as number];
            const autoFilter: any = currentWorksheet.autoFilter;
            if (autoFilter && autoFilter.range) {
                const filterEntry: FilterCollectionModel = {
                    filterRange: autoFilter.range,
                    column: [],
                    criteria: [],
                    value: [],
                    dataType: [],
                    predicates: []
                };
                if (sheetIndex !== 0) {
                    filterEntry.sheetIndex = sheetIndex;
                }
                const filterCols: any[] = autoFilter.list ? autoFilter.list() : (autoFilter.columns || []);
                for (let cIdx: number = 0; cIdx < filterCols.length; cIdx++) {
                    const col: any = filterCols[cIdx as number];
                    const colValues: string[] = col.values ? col.values() : [];
                    for (let vIdx: number = 0; vIdx < colValues.length; vIdx++) {
                        filterEntry.column.push(col.columnIndex);
                        filterEntry.criteria.push('Equal');
                        filterEntry.value.push(colValues[vIdx as number]);
                        filterEntry.dataType.push('string');
                        filterEntry.predicates.push('or');
                    }
                    if (col.firstCondition) {
                        filterEntry.column.push(col.columnIndex);
                        filterEntry.criteria.push(this.mapFilterOperator(col.firstCondition.operator));
                        filterEntry.value.push(col.firstCondition.value !== undefined ? String(col.firstCondition.value) : '');
                        filterEntry.dataType.push('string');
                        filterEntry.predicates.push('or');
                    }
                    if (col.secondCondition) {
                        filterEntry.column.push(col.columnIndex);
                        filterEntry.criteria.push(this.mapFilterOperator(col.secondCondition.operator));
                        filterEntry.value.push(col.secondCondition.value !== undefined ? String(col.secondCondition.value) : '');
                        filterEntry.dataType.push('string');
                        filterEntry.predicates.push(col.isAnd ? 'and' : 'or');
                    }
                }
                if (filterEntry.column.length > 0) {
                    filters.push(filterEntry);
                } else if (autoFilter.range) {
                    const emptyFilter: FilterCollectionModel = {
                        filterRange: autoFilter.range
                    };
                    if (sheetIndex !== 0) {
                        emptyFilter.sheetIndex = sheetIndex;
                    }
                    filters.push(emptyFilter);
                }
            }
            const dataSorter: any = currentWorksheet.dataSorter || (autoFilter && autoFilter.dataSorter);
            if (dataSorter && dataSorter.range && dataSorter.list) {
                const conditions: any[] = dataSorter.list();
                for (let condIdx: number = 0; condIdx < conditions.length; condIdx++) {
                    const cond: any = conditions[condIdx as number];
                    const condIndexes: number[] = this.processRange(cond.range || dataSorter.range);
                    const sortRangeString: string = (dataSorter && dataSorter.range) ? dataSorter.range : autoFilter.range;
                    const sortEntry: SortCollectionModel = {
                        sortRange: sortRangeString,
                        columnIndex: condIndexes[1],
                        order: cond.isDescending ? 'Descending' : 'Ascending'
                    };
                    if (sheetIndex !== 0) {
                        sortEntry.sheetIndex = sheetIndex;
                    }
                    sorts.push(sortEntry);
                }
            }
        }
        return { filters: filters, sorts: sorts };
    }

    private processChartsAndImages(sheetModel: SheetModel, xlsxSheet: XlsxWorksheet, sheetIndex: number): void {
        const charts: any[] = (xlsxSheet as any).charts ? (xlsxSheet as any).charts : [];
        if (charts.length > 0) {
            const chartColl: any[] = [];
            for (let i: number = 0; i < charts.length; i++) {
                const chart: any = charts[i as number];
                const sheetName: string = sheetModel.name;
                if (!chart.preservedPivotSource) {
                    const rIdx: number = chart.row - 1;
                    const cIdx: number = chart.column - 1;
                    let computedRange: string = chart.dataRange ? chart.dataRange : '';
                    if (computedRange) {
                        const cleanRange: string = computedRange.replace(/'/g, '');
                        const rangeParts: string[] = cleanRange.split(' ').map((p: string) => {
                            const tokenIdx: number = p.lastIndexOf('!');
                            return (tokenIdx > -1 ? p.substring(tokenIdx + 1) : p).replace(/\$/g, '');
                        });
                        computedRange = '\'' + sheetName + '\'!' + rangeParts.join(' ');
                    } else if (chart.series && Array.isArray(chart.series) && chart.series.length > 0) {
                        const seriesRanges: string[] = [];
                        const catAxis: any = chart.primaryCategoryAxis;
                        if (catAxis && catAxis.categoryLabels) {
                            let catRange: string = String(catAxis.categoryLabels).replace(/\$/g, '').replace(/'/g, '');
                            if (catRange.indexOf('!') > -1) {
                                catRange = catRange.substring(catRange.lastIndexOf('!') + 1);
                            }
                            if (catRange) {
                                seriesRanges.push(catRange.replace(/,/g, ' '));
                            }
                        }
                        for (let sIdx: number = 0; sIdx < chart.series.length; sIdx++) {
                            const sItem: any = chart.series[sIdx as number];
                            if (sItem && sItem.values) {
                                let valRange: string = String(sItem.values).replace(/\$/g, '').replace(/'/g, '');
                                if (valRange.indexOf('!') > -1) {
                                    valRange = valRange.substring(valRange.lastIndexOf('!') + 1);
                                }
                                seriesRanges.push(valRange.replace(/,/g, ' '));
                            }
                        }
                        if (seriesRanges.length > 0) {
                            computedRange = '\'' + sheetName + '\'!' + seriesRanges.join(' ');
                        }
                    }
                    const chartTypeStr: string = chart.type ? String(chart.type) : 'columnClustered';
                    const mappedType: string = this.mapOpenChartType(chartTypeStr);
                    const chartTop: number = rIdx > 0 ? getRowsHeight(sheetModel, 0, rIdx - 1, true) : 0;
                    const chartLeft: number = cIdx > 0 ? getColumnsWidth(sheetModel, 0, cIdx - 1, true) : 0;
                    const chartModel: any = {
                        type: mappedType,
                        title: chart.chartTitle ? chart.chartTitle : '',
                        range: computedRange,
                        width: chart.width ? Math.round(chart.width * 96 / 72) : 480,
                        height: chart.height ? Math.round(chart.height * 96 / 72) : 290,
                        top: chartTop,
                        left: chartLeft,
                        address: [rIdx, cIdx]
                    };
                    if (chart.isSeriesInRows) {
                        chartModel.isSeriesInRows = true;
                    }
                    if (chart.hasLegend === false) {
                        chartModel.legendSettings = { visible: false };
                    } else if (chart.hasLegend === true || chart.legend) {
                        const legendPos: string = chart.legend && chart.legend.position ? chart.legend.position : 'Right';
                        chartModel.legendSettings = { position: legendPos, visible: true };
                    }
                    if (chartTypeStr.indexOf('Markers') >= 0) {
                        chartModel.markerSettings = { visible: true, isFilled: true };
                    }
                    if (chart.primaryCategoryAxis && mappedType !== 'Pie' && mappedType !== 'Doughnut') {
                        const xAxisObj: any = chart.primaryCategoryAxis;
                        const primaryXAxis: any = {};
                        if (xAxisObj.title) { primaryXAxis.title = xAxisObj.title; }
                        if (xAxisObj.visible === false) { primaryXAxis.visible = false; }
                        if (xAxisObj.hasMajorGridLines) { primaryXAxis.majorGridLines = { width: 1 }; }
                        if (xAxisObj.hasMinorGridLines) { primaryXAxis.minorGridLines = { width: 1 }; }
                        chartModel.primaryXAxis = primaryXAxis;
                    }
                    if (chart.primaryValueAxis && mappedType !== 'Pie' && mappedType !== 'Doughnut') {
                        const yAxisObj: any = chart.primaryValueAxis;
                        const primaryYAxis: any = {};
                        if (yAxisObj.title) { primaryYAxis.title = yAxisObj.title; }
                        if (yAxisObj.visible === false) { primaryYAxis.visible = false; }
                        if (yAxisObj.hasMajorGridLines) { primaryYAxis.majorGridLines = { width: 1 }; }
                        if (yAxisObj.hasMinorGridLines) { primaryYAxis.minorGridLines = { width: 1 }; }
                        chartModel.primaryYAxis = primaryYAxis;
                    }
                    chartColl.push(chartModel);
                    const targetCell: CellModel = getCell(rIdx, cIdx, sheetModel, true, true);
                    if (targetCell) {
                        if (!targetCell.chart) {
                            targetCell.chart = [];
                        }
                        targetCell.chart.push(chartModel);
                    }
                }
            }
            if (chartColl.length > 0) {
                (sheetModel as any).chartColl = chartColl;
            }
        }
        const images: any[] = (xlsxSheet as any).images ? (xlsxSheet as any).images : [];
        if (images.length > 0) {
            const imageColl: any[] = [];
            for (let i: number = 0; i < images.length; i++) {
                const image: any = images[i as number];
                const rIdx: number = image.row - 1;
                const cIdx: number = image.column - 1;
                let dataUrl: string = '';
                if (image.bytes && image.bytes.length > 0) {
                    let binaryString: string = '';
                    const bytes: Uint8Array = image.bytes;
                    const chunkSize: number = 8192;
                    for (let bIdx: number = 0; bIdx < bytes.length; bIdx += chunkSize) {
                        const sub: Uint8Array = bytes.subarray(bIdx as number, bIdx + chunkSize);
                        binaryString += String.fromCharCode.apply(null, Array.from(sub) as unknown as number[]);
                    }
                    const base64: string = btoa(binaryString);
                    const imageMime: string = image.contentType || 'image/png';
                    dataUrl = base64 ? 'data:' + imageMime + ';base64,' + base64 : '';
                }
                const imageTop: number = rIdx > 0 ? getRowsHeight(sheetModel, 0, rIdx - 1, true) : 0;
                const imageLeft: number = cIdx > 0 ? getColumnsWidth(sheetModel, 0, cIdx - 1, true) : 0;
                const imageModel: any = {
                    src: dataUrl,
                    width: image.width ? image.width * 96 / 72 : 400,
                    height: image.height ? image.height * 96 / 72 : 300,
                    top: imageTop,
                    left: imageLeft,
                    preservePos: true,
                    address: [rIdx, cIdx]
                };
                imageColl.push(imageModel);
                const targetCell: CellModel = getCell(rIdx, cIdx, sheetModel, true, true);
                if (targetCell) {
                    if (!targetCell.image) {
                        targetCell.image = [];
                    }
                    targetCell.image.push(imageModel);
                }
            }
            if (imageColl.length > 0) {
                (sheetModel as any).imageColl = imageColl;
            }
        }
    }

    private processThreadedComments(sheetModel: SheetModel, xlsxSheet: XlsxWorksheet): void {
        const threadedComments: any[] = (xlsxSheet as any).threadedComments;
        if (threadedComments && threadedComments.length > 0) {
            const commentsList: ExtendedThreadedCommentModel[] = [];
            for (let index: number = 0; index < threadedComments.length; index++) {
                const commentItem: any = threadedComments[index as number];
                if (commentItem) {
                    const rowIndex: number = commentItem.row - 1;
                    const columnIndex: number = commentItem.column - 1;
                    const commentDate: any = (commentItem.entry && commentItem.entry.dT) || commentItem.dT ||
                        (commentItem.createdAt ? new Date(commentItem.createdAt).toISOString() : new Date().toISOString());
                    const commentModel: ExtendedThreadedCommentModel = {
                        author: commentItem.author || '',
                        text: commentItem.text ? String(commentItem.text).replace(/\r\n/g, '\n') : '',
                        createdTime: commentDate,
                        isResolved: Boolean(commentItem.isResolved),
                        replies: [],
                        address: [rowIndex, columnIndex]
                    };
                    if (commentItem.replies && commentItem.replies.length > 0) {
                        for (let replyIndex: number = 0; replyIndex < commentItem.replies.length; replyIndex++) {
                            const replyItem: any = commentItem.replies[replyIndex as number];
                            if (replyItem) {
                                const replyDate: any = (replyItem.entry && replyItem.entry.dT) || replyItem.dT ||
                                    (replyItem.createdAt ? new Date(replyItem.createdAt).toISOString() : new Date().toISOString());
                                commentModel.replies.push({
                                    author: replyItem.author || '',
                                    text: replyItem.text ? String(replyItem.text).replace(/\r\n/g, '\n') : '',
                                    createdTime: replyDate
                                });
                            }
                        }
                    }
                    const targetCell: CellModel = getCell(rowIndex, columnIndex, sheetModel, true, true);
                    if (targetCell) {
                        targetCell.comment = commentModel;
                    }
                    commentsList.push(commentModel);
                }
            }
            if (commentsList.length > 0) {
                (sheetModel as any).comments = commentsList;
            }
        }
    }

    private processNotes(sheetModel: SheetModel, xlsxSheet: XlsxWorksheet): void {
        const comments: any = (xlsxSheet as any).comments;
        if (comments) {
            const commentList: any[] = Array.isArray(comments) ? comments : (comments.entries || []);
            if (commentList.length > 0) {
                const noteList: any[] = [];
                for (let index: number = 0; index < commentList.length; index++) {
                    const noteItem: any = commentList[index as number];
                    if (noteItem && noteItem.text && !(comments.item && comments.item(index).isThreadedComments)) {
                        const rowIndex: number = !isNullOrUndefined(noteItem.row) ? noteItem.row - 1 : noteItem.row0;
                        const columnIndex: number = !isNullOrUndefined(noteItem.column) ? noteItem.column - 1 : noteItem.col0;
                        const targetCell: CellModel = getCell(rowIndex, columnIndex, sheetModel, true, true);
                        if (targetCell && targetCell.comment) {
                            continue;
                        }
                        const noteText: string = String(noteItem.text).replace(/\r\n/g, '\n');
                        if (targetCell) {
                            targetCell.notes = noteText;
                        }
                        noteList.push({
                            text: noteText,
                            isVisible: Boolean(noteItem.isVisible),
                            address: [rowIndex, columnIndex]
                        });
                    }
                }
                if (noteList.length > 0) {
                    (sheetModel as any).notes = noteList;
                }
            }
        }
    }

    private processRange(range: any): number[] {
        if (Array.isArray(range)) {
            return range.map((value: number): number => (value as number) - 1);
        }
        if (typeof range === 'string') {
            return getRangeIndexes(range);
        }
        const sRow: number = range.startRow !== undefined ? range.startRow : (range.row !== undefined ? range.row : 1);
        const sCol: number = range.startCol !== undefined ? range.startCol : (range.col !== undefined ? range.col : 1);
        const eRow: number = range.endRow !== undefined ? range.endRow : sRow;
        const eCol: number = range.endCol !== undefined ? range.endCol : sCol;
        return [sRow - 1, sCol - 1, eRow - 1, eCol - 1];
    }

    private resolveColor(colorObj: any): string {
        if (!colorObj) {
            return '';
        }
        if (typeof colorObj === 'string') {
            return this.formatHexColor(colorObj);
        }
        if (colorObj.rgb || colorObj.argb) {
            return this.formatHexColor(colorObj.rgb || colorObj.argb);
        }
        if (colorObj.theme !== undefined) {
            const themeColors: string[] = [
                '#FFFFFF', '#000000', '#E7E6E6', '#44546A', '#4472C4',
                '#ED7D31', '#A5A5A5', '#FFC000', '#5B9BD5', '#70AD47',
                '#0563C1', '#954F72'
            ];
            const baseHex: string = themeColors[colorObj.theme] || '#000000';
            if (colorObj.tint !== undefined && colorObj.tint !== null) {
                return this.applyColorTint(baseHex, Number(colorObj.tint));
            }
            return baseHex;
        }
        return '';
    }

    private applyColorTint(hex: string, tint: number): string {
        const cleanHex: string = hex.startsWith('#') ? hex.slice(1) : hex;
        let r: number = parseInt(cleanHex.substring(0, 2), 16);
        let g: number = parseInt(cleanHex.substring(2, 4), 16);
        let b: number = parseInt(cleanHex.substring(4, 6), 16);
        if (tint > 0) {
            r = Math.round(r * (1.0 - tint) + 255 * tint);
            g = Math.round(g * (1.0 - tint) + 255 * tint);
            b = Math.round(b * (1.0 - tint) + 255 * tint);
        } else if (tint < 0) {
            r = Math.round(r * (1.0 + tint));
            g = Math.round(g * (1.0 + tint));
            b = Math.round(b * (1.0 + tint));
        }
        const redHex: string = Math.min(255, Math.max(0, r)).toString(16);
        const greenHex: string = Math.min(255, Math.max(0, g)).toString(16);
        const blueHex: string = Math.min(255, Math.max(0, b)).toString(16);
        const rStr: string = redHex.length < 2 ? '0' + redHex : redHex;
        const gStr: string = greenHex.length < 2 ? '0' + greenHex : greenHex;
        const bStr: string = blueHex.length < 2 ? '0' + blueHex : blueHex;
        return ('#' + rStr + gStr + bStr).toUpperCase();
    }

    private formatHexColor(rgb: string): string {
        let hexColor: string = '#000000';
        if (rgb) {
            const hexString: string = rgb.startsWith('#') ? rgb.substring(1) : rgb;
            if (hexString.length === 8) {
                hexColor = `#${hexString.substring(2)}`;
            } else if (hexString.length === 6) {
                hexColor = `#${hexString}`;
            } else if (hexString.length === 3) {
                hexColor = '#' + hexString[0] + hexString[0] + hexString[1] + hexString[1] + hexString[2] + hexString[2];
            } else {
                hexColor = rgb.startsWith('#') ? rgb : `#${rgb}`;
            }
        }
        return hexColor.toUpperCase();
    }

    private processColorScaleType(cf: any): ColorScale {
        const colorStops: any[] = cf.colorScaleData && cf.colorScaleData.stops && cf.colorScaleData.stops.length >= 2
            ? cf.colorScaleData.stops : null;
        if (!colorStops || (colorStops.length !== 2 && colorStops.length !== 3)) {
            return 'GYRColorScale';
        }
        const minHex: string = this.stopHex(colorStops[0]);
        const maxHex: string = this.stopHex(colorStops[colorStops.length - 1]);
        const midHex: string = colorStops.length === 3 ? this.stopHex(colorStops[1]) : '';
        const isGreen: (h: string) => boolean = (h: string): boolean => h.indexOf('63BE7B') >= 0 || h.indexOf('63C384') >= 0;
        const isRed: (h: string) => boolean = (h: string): boolean => h.indexOf('F8696B') >= 0 || h.indexOf('FF555A') >= 0;
        const isYellow: (h: string) => boolean = (h: string): boolean => h.indexOf('FFEB84') >= 0 || h.indexOf('FFEF9C') >= 0 || h.indexOf('FFEB9C') >= 0;
        const isWhite: (h: string) => boolean = (h: string): boolean => h.indexOf('FFFFFF') >= 0 || h.indexOf('FCFCFF') >= 0;
        const isBlue: (h: string) => boolean = (h: string): boolean => h.indexOf('5A8AC6') >= 0 || h.indexOf('638EC6') >= 0;
        if (colorStops.length === 3) {
            if (isRed(minHex) && isYellow(midHex) && isGreen(maxHex)) { return 'GYRColorScale'; }
            if (isGreen(minHex) && isYellow(midHex) && isRed(maxHex)) { return 'RYGColorScale'; }
            if (isRed(minHex) && isWhite(midHex) && isGreen(maxHex)) { return 'GWRColorScale'; }
            if (isGreen(minHex) && isWhite(midHex) && isRed(maxHex)) { return 'RWGColorScale'; }
            if (isRed(minHex) && isWhite(midHex) && isBlue(maxHex)) { return 'BWRColorScale'; }
            if (isBlue(minHex) && isWhite(midHex) && isRed(maxHex)) { return 'RWBColorScale'; }
        } else if (colorStops.length === 2) {
            if (isRed(minHex) && isWhite(maxHex)) { return 'WRColorScale'; }
            if (isWhite(minHex) && isRed(maxHex)) { return 'RWColorScale'; }
            if (isWhite(minHex) && isGreen(maxHex)) { return 'GWColorScale'; }
            if (isGreen(minHex) && isWhite(maxHex)) { return 'WGColorScale'; }
            if (isYellow(minHex) && isGreen(maxHex)) { return 'GYColorScale'; }
            if (isGreen(minHex) && isYellow(maxHex)) { return 'YGColorScale'; }
        }
        return colorStops.length === 2 ? 'GYColorScale' : 'GYRColorScale';
    }

    private stopHex(colorStop: any): string {
        if (!colorStop || !colorStop.color) { return ''; }
        const rgb: string = colorStop.color.rgb || colorStop.color.argb || '';
        if (!rgb) { return ''; }
        return (rgb.length === 8 ? rgb.substring(2) : rgb).toUpperCase();
    }

    private processDataBarType(cf: any): DataBar | undefined {
        let rgbHex: string = '';
        if (cf.dataBarData && cf.dataBarData.barColor) {
            rgbHex = (cf.dataBarData.barColor.rgb || cf.dataBarData.barColor.argb || '').toUpperCase();
        }
        if (rgbHex.length === 8 && rgbHex.startsWith('FF')) { rgbHex = rgbHex.substring(2); }
        if (rgbHex.indexOf('63C384') >= 0 || rgbHex.indexOf('63BE7B') >= 0) { return 'GreenDataBar'; }
        if (rgbHex.indexOf('FF555A') >= 0 || rgbHex.indexOf('F8696B') >= 0) { return 'RedDataBar'; }
        if (rgbHex.indexOf('5A8AC6') >= 0 || rgbHex.indexOf('638EC6') >= 0) { return 'BlueDataBar'; }
        if (rgbHex.indexOf('FFB628') >= 0) { return 'OrangeDataBar'; }
        if (rgbHex.indexOf('008AEF') >= 0) { return 'LightBlueDataBar'; }
        if (rgbHex.indexOf('D6007B') >= 0) { return 'PurpleDataBar'; }
        return undefined;
    }

    private processIconSetType(cf: any): IconSet {
        let rawType: string = '';
        if (cf.iconSetData) {
            rawType = cf.iconSetData.iconSetType || cf.iconSetData.type || cf.iconSetData.iconSet || '';
        } else if (cf.iconSet) {
            rawType = typeof cf.iconSet === 'string' ? cf.iconSet : (cf.iconSet.iconSetType || cf.iconSet.type || cf.iconSet.iconSet || '');
        } else if (cf.iconSetType) {
            rawType = cf.iconSetType;
        }
        const normalized: string = String(rawType).toLowerCase().replace(/[\s_-]+/g, '');
        const iconSetMap: { [key: string]: IconSet } = {
            'threearrows': 'ThreeArrows', '3arrows': 'ThreeArrows',
            'threearrowsgray': 'ThreeArrowsGray', '3arrowsgray': 'ThreeArrowsGray',
            'threetriangles': 'ThreeTriangles', '3triangles': 'ThreeTriangles',
            'fourarrowsgray': 'FourArrowsGray', '4arrowsgray': 'FourArrowsGray',
            'fourarrows': 'FourArrows', '4arrows': 'FourArrows',
            'fivearrowsgray': 'FiveArrowsGray', '5arrowsgray': 'FiveArrowsGray',
            'fivearrows': 'FiveArrows', '5arrows': 'FiveArrows',
            'threetrafficlights1': 'ThreeTrafficLights1', '3trafficlights1': 'ThreeTrafficLights1',
            'threetrafficlights2': 'ThreeTrafficLights2', '3trafficlights2': 'ThreeTrafficLights2',
            'threesigns': 'ThreeSigns', '3signs': 'ThreeSigns',
            'fourtrafficlights': 'FourTrafficLights', '4trafficlights': 'FourTrafficLights',
            'fourredtoblack': 'FourRedToBlack', '4redtoblack': 'FourRedToBlack',
            'threesymbols': 'ThreeSymbols', '3symbols': 'ThreeSymbols',
            'threesymbols2': 'ThreeSymbols2', '3symbols2': 'ThreeSymbols2',
            'threeflags': 'ThreeFlags', '3flags': 'ThreeFlags',
            'threestars': 'ThreeStars', '3stars': 'ThreeStars',
            'fourrating': 'FourRating', '4rating': 'FourRating',
            'fivequarters': 'FiveQuarters', '5quarters': 'FiveQuarters',
            'fiverating': 'FiveRating', '5rating': 'FiveRating',
            'fiveboxes': 'FiveBoxes', '5boxes': 'FiveBoxes'
        };
        return iconSetMap[normalized as string] || 'ThreeArrows';
    }

    private formatBorderEdge(edge: BorderEdge): string {
        let colorString: string = '#000000';
        if (edge.color) {
            const resolvedColor: string = this.resolveColor(edge.color);
            if (resolvedColor && resolvedColor !== '#FFFFFF') {
                colorString = resolvedColor;
            }
        }
        const edgeStyle: string = edge.style ? edge.style.toLowerCase() : '';
        const widthString: string = (edgeStyle.indexOf('thick') >= 0 || edgeStyle.indexOf('double') >= 0)
            ? '3px' : edgeStyle.indexOf('medium') >= 0 ? '2px' : '1px';
        let styleString: string = 'solid';
        if (edgeStyle.indexOf('dash') >= 0) {
            styleString = 'dashed';
        } else if (edgeStyle.indexOf('dot') >= 0) {
            styleString = 'dotted';
        } else if (edgeStyle.indexOf('double') >= 0) {
            styleString = 'double';
        }
        return `${widthString} ${styleString} ${colorString}`;
    }

    private mapOpenChartType(type: string): string {
        switch (type) {
        case 'columnStacked': return 'StackingColumn';
        case 'columnPercentStacked': return 'StackingColumn100';
        case 'barClustered': return 'Bar';
        case 'barStacked': return 'StackingBar';
        case 'barPercentStacked': return 'StackingBar100';
        case 'line': case 'lineMarkers': return 'Line';
        case 'lineStacked': case 'lineStackedMarkers': return 'StackingLine';
        case 'linePercentStacked': case 'linePercentStackedMarkers': return 'StackingLine100';
        case 'area': return 'Area';
        case 'areaStacked': return 'StackingArea';
        case 'areaPercentStacked': return 'StackingArea100';
        case 'pie': return 'Pie';
        case 'doughnut': return 'Doughnut';
        case 'scatterMarkers': case 'scatterLine': case 'scatterLineMarkers': case 'scatterSmooth': return 'Scatter';
        default: return 'Column';
        }
    }
}
