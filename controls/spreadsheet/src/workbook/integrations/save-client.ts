import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Workbook, SheetModel, RowModel, CellModel, ColumnModel } from '../base/index';
import {
    Workbook as XlsxWorkbook, Worksheet as XlsxWorksheet, Cell as XlsxCell, ConditionalFormat, DataValidation, CellStyle,
    Fill, Border, BorderEdge, Alignment, Protection, Chart as XlsxChart, ThreadedComment, SheetProtectionOptions,
    AutoFilter, DataSorter
} from '@syncfusion/ej2-xlsx';
import {
    getCellAddress, getCellIndexes, saveCompleted, CellStyleModel, ConditionalFormatModel, ValidationModel, ProtectSettingsModel,
    ImageModel, ChartModel, ThreadedCommentModel, ExtendedNoteModel, ExtendedSheet, MergedCellModel, RichTextModel,
    FilterCollectionModel, SortCollectionModel, setFilteredCollection
} from '../common/index';


/**
 * Handles client-side XLSX file export and generation.
 * Maps Spreadsheet workbook models to ej2-xlsx Workbook and downloads the resulting file.
 */
export class WorkbookSaveClient {
    private parent: Workbook;


    constructor(parent: Workbook) {
        this.parent = parent;
    }

    /**
     * To save or export current workbook as XLSX file.
     *
     * @param {string} fileName - Specifies the output filename.
     * @param {boolean} [needBlobData] - Specifies whether to return Blob instead of triggering browser download.
     * @returns {Promise<Blob | void>} - Returns Promise resolving to Blob or void.
     */
    public async save(fileName: string, needBlobData?: boolean): Promise<Blob | void> {
        const xlsxWorkbook: XlsxWorkbook = this.mapSpreadsheetToXlsx(this.parent);
        const bytes: Uint8Array = await xlsxWorkbook.save();
        const blob: Blob = new Blob([bytes], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        const saveCompleteArgs: { status: string; message: string; fileName: string; saveType: string; blobData: Blob } = {
            status: 'Success',
            message: '',
            fileName: fileName,
            saveType: 'Xlsx',
            blobData: needBlobData ? blob : null
        };
        if (!needBlobData) {
            this.triggerDownload(blob, fileName.endsWith('.xlsx') ? fileName : fileName + '.xlsx');
        }
        this.parent.trigger('saveComplete', saveCompleteArgs);
        this.parent.notify(saveCompleted, saveCompleteArgs);
        if (needBlobData) {
            return blob;
        }
    }

    /**
     * To map Spreadsheet Workbook to ej2-xlsx Workbook.
     *
     * @param {Workbook} workbook - Specifies the spreadsheet workbook instance.
     * @returns {XlsxWorkbook} - Returns ej2-xlsx Workbook model.
     */
    public mapSpreadsheetToXlsx(workbook: Workbook): XlsxWorkbook {
        const xlsxWorkbook: XlsxWorkbook = XlsxWorkbook.create();
        const sheets: SheetModel[] = workbook.sheets || [];
        if (sheets.length > 0) {
            const defaultSheet: XlsxWorksheet = xlsxWorkbook.worksheets[0];
            sheets.forEach((sheetModel: SheetModel, sheetIndex: number): void => {
                const sheetName: string = sheetModel.name || ('Sheet' + (sheetIndex + 1));
                let xlsxSheet: XlsxWorksheet;
                if (sheetIndex === 0 && defaultSheet) {
                    xlsxSheet = defaultSheet;
                    xlsxSheet.name = sheetName;
                } else {
                    xlsxSheet = xlsxWorkbook.addSheet(sheetName);
                }
                this.processSheet(xlsxSheet, sheetModel, sheetIndex, workbook);
            });
        }
        this.processDefinedNames(xlsxWorkbook, workbook);
        if (sheets.length > 0) {
            const rawActiveIndex: number = workbook.activeSheetIndex || 0;
            const activeSheetIndex: number = Math.max(0, Math.min(rawActiveIndex, xlsxWorkbook.worksheets.length - 1));
            const targetActiveSheet: XlsxWorksheet = xlsxWorkbook.worksheets.find(
                (sheet: XlsxWorksheet, index: number): boolean => index === activeSheetIndex
            );
            if (targetActiveSheet) {
                xlsxWorkbook.activeSheet = targetActiveSheet;
            }
        }
        const wbAny: any = workbook;
        if (wbAny.isProtected) {
            if (wbAny.hashValue && wbAny.saltValue) {
                (xlsxWorkbook as any)._protection.replaceFromParse({
                    present: true,
                    options: { lockStructure: true, lockWindows: false, lockRevision: false },
                    algorithmName: wbAny.algorithmName || 'SHA-512',
                    hashValue: wbAny.hashValue,
                    saltValue: wbAny.saltValue,
                    spinCount: wbAny.spinCount || 100000,
                    extraAttrsXml: ''
                });
            } else {
                xlsxWorkbook.protect(wbAny.password || undefined, { lockStructure: true });
            }
        }
        return xlsxWorkbook;
    }

    private processSheet(xlsxSheet: XlsxWorksheet, sheetModel: SheetModel, sheetIndex: number, workbook: Workbook): void {
        if (typeof sheetModel.showGridLines === 'boolean') {
            xlsxSheet.isGridLinesVisible = sheetModel.showGridLines;
        }
        if (typeof sheetModel.showHeaders === 'boolean') {
            xlsxSheet.isRowColumnHeadersVisible = sheetModel.showHeaders;
        }
        if (sheetModel.standardHeight && sheetModel.standardHeight > 0) {
            (xlsxSheet as any).standardHeight = Math.round((sheetModel.standardHeight * 72 / 96) * 10) / 10;
        }
        const extendedSheet: ExtendedSheet = sheetModel as ExtendedSheet;
        if (!sheetModel.rows || sheetModel.rows.length === 0) {
            if (!sheetModel.rows) {
                sheetModel.rows = [];
            }
            sheetModel.rows.push({});
        }
        if (sheetModel.selectedRange) {
            xlsxSheet.selectedRange = sheetModel.selectedRange;
        }
        if (sheetModel.conditionalFormats && sheetModel.conditionalFormats.length > 0) {
            this.processConditionalFormats(xlsxSheet, sheetModel.conditionalFormats);
        }
        if (sheetModel.isProtected) {
            const sheetAny: any = sheetModel;
            const protectSettings: ProtectSettingsModel = sheetModel.protectSettings || {};
            const protectOptions: SheetProtectionOptions = {
                allowsSelectLockedCells: protectSettings.selectCells !== false,
                allowsSelectUnlockedCells: protectSettings.selectUnLockedCells !== false,
                allowsFormatCells: protectSettings.formatCells === true,
                allowsFormatRows: protectSettings.formatRows === true,
                allowsFormatColumns: protectSettings.formatColumns === true,
                allowsInsertHyperlinks: protectSettings.insertLink === true
            };
            if (sheetAny.hashValue && sheetAny.saltValue) {
                (xlsxSheet as any)._protection.replaceFromParse({
                    present: true,
                    sheet: true,
                    options: protectOptions,
                    algorithmName: sheetAny.algorithmName || 'SHA-512',
                    hashValue: sheetAny.hashValue,
                    saltValue: sheetAny.saltValue,
                    spinCount: sheetAny.spinCount || 100000,
                    extraAttrsXml: ''
                });
            } else {
                xlsxSheet.protect(sheetModel.password || undefined, protectOptions);
            }
        }
        if ((sheetModel.frozenRows && sheetModel.frozenRows > 0) ||
            (sheetModel.frozenColumns && sheetModel.frozenColumns > 0)) {
            xlsxSheet.freeze.freezePanes({
                rows: sheetModel.frozenRows || 0,
                columns: sheetModel.frozenColumns || 0,
                topLeftCell: sheetModel.topLeftCell || undefined
            });
        }
        if (sheetModel.columns && sheetModel.columns.length > 0) {
            this.processColumns(xlsxSheet, sheetModel.columns, sheetModel.isProtected, workbook);
        }
        if (extendedSheet.validations && extendedSheet.validations.length > 0) {
            this.processSheetValidations(xlsxSheet, extendedSheet.validations, workbook);
        }
        if (sheetModel.rows && sheetModel.rows.length > 0) {
            this.processRowsAndCells(xlsxSheet, sheetModel.rows, workbook);
        }
        if (extendedSheet.mergedCells && extendedSheet.mergedCells.length > 0) {
            this.processMergedCells(xlsxSheet, extendedSheet.mergedCells);
        }
        if (extendedSheet.imageColl && extendedSheet.imageColl.length > 0) {
            this.processImages(xlsxSheet, extendedSheet.imageColl);
        }
        if (extendedSheet.chartColl && extendedSheet.chartColl.length > 0) {
            this.processCharts(xlsxSheet, extendedSheet.chartColl);
        }
        if (extendedSheet.notes && extendedSheet.notes.length > 0) {
            this.processNotes(xlsxSheet, extendedSheet.notes);
        }
        if (extendedSheet.hyperLinks && extendedSheet.hyperLinks.length > 0) {
            this.processHyperlinks(xlsxSheet, extendedSheet.hyperLinks);
        }
        if (extendedSheet.comments && extendedSheet.comments.length > 0) {
            this.processComments(xlsxSheet, extendedSheet.comments);
        }
        this.processAutoFilterAndSort(xlsxSheet, sheetIndex, workbook);
        if (sheetModel.state === 'Hidden' || sheetModel.state === 'VeryHidden') {
            xlsxSheet.visibility = false;
        } else {
            xlsxSheet.visibility = true;
        }
    }

    private mapSaveFilterOperator(criteria: string): string {
        switch (criteria) {
        case 'Less': return 'lessThan';
        case 'LessOrEqual': return 'lessThanOrEqual';
        case 'Greater': return 'greaterThan';
        case 'GreaterOrEqual': return 'greaterThanOrEqual';
        case 'Notequal': return 'notEqual';
        case 'Equal': return 'equal';
        case 'Contains': return 'contains';
        case 'NotContains': return 'doesNotContain';
        case 'BeginsWith': return 'beginsWith';
        case 'EndsWith': return 'endsWith';
        default: return 'equal';
        }
    }

    private processAutoFilterAndSort(xlsxSheet: XlsxWorksheet, sheetIndex: number, workbook: Workbook): void {
        const liveSaveJson: { filterCollection: FilterCollectionModel[] } = { filterCollection: [] };
        this.parent.notify(setFilteredCollection, { sheetIdx: sheetIndex, isSaveAction: true, saveJson: liveSaveJson });
        const filterCollections: FilterCollectionModel[] = (liveSaveJson.filterCollection && liveSaveJson.filterCollection.length > 0)
            ? liveSaveJson.filterCollection : ((workbook as any).filterCollection || []);
        const filterModel: FilterCollectionModel = filterCollections.find(
            (item: FilterCollectionModel): boolean => (item.sheetIndex || 0) === sheetIndex
        );
        if (filterModel && filterModel.filterRange) {
            const autoFilterHandle: AutoFilter = xlsxSheet.addAutoFilter(filterModel.filterRange);
            if (autoFilterHandle && filterModel.column && filterModel.column.length > 0) {
                const columnValueMap: Map<number, string[]> = new Map<number, string[]>();
                const columnConditionsMap: Map<number, { operator: string; value: string; isAnd?: boolean }[]> = new Map();

                for (let index: number = 0; index < filterModel.column.length; index++) {
                    const columnIndex: number = filterModel.column[index as number];
                    const criteria: string = filterModel.criteria ? filterModel.criteria[index as number] : 'Equal';
                    const filterValue: string = filterModel.value ? String(filterModel.value[index as number]) : '';
                    const predicate: string = filterModel.predicates ? filterModel.predicates[index as number] : 'or';

                    if (criteria === 'Equal' && predicate === 'or' && !filterModel.criteria.some((c: string, idx: number) => filterModel.column[idx as number] === columnIndex && c !== 'Equal')) {
                        if (!columnValueMap.has(columnIndex)) {
                            columnValueMap.set(columnIndex, []);
                        }
                        if (filterValue !== undefined) {
                            columnValueMap.get(columnIndex).push(filterValue);
                        }
                    } else {
                        if (!columnConditionsMap.has(columnIndex)) {
                            columnConditionsMap.set(columnIndex, []);
                        }
                        const mappedOp: string = this.mapSaveFilterOperator(criteria);
                        columnConditionsMap.get(columnIndex).push({
                            operator: mappedOp,
                            value: filterValue,
                            isAnd: predicate === 'and'
                        });
                    }
                }
                columnValueMap.forEach((values: string[], columnIndex: number): void => {
                    const filterColumnHandle: any = autoFilterHandle.addFilterColumn(columnIndex);
                    if (filterColumnHandle && values.length > 0) {
                        filterColumnHandle.addValues(values);
                    }
                });
                columnConditionsMap.forEach((
                    conditions: { operator: string; value: string; isAnd?: boolean }[], columnIndex: number): void => {
                    const filterColumnHandle: any = autoFilterHandle.addFilterColumn(columnIndex);
                    if (filterColumnHandle) {
                        for (let cIdx: number = 0; cIdx < conditions.length; cIdx++) {
                            const cond: { operator: string; value: string; isAnd?: boolean } = conditions[cIdx as number];
                            filterColumnHandle.addCondition(cond.operator, cond.value);
                            if (cond.isAnd && (filterColumnHandle as any).isAnd !== undefined) {
                                (filterColumnHandle as any).isAnd = true;
                            }
                        }
                    }
                });
            }
            const sortCollections: SortCollectionModel[] = (workbook as any).sortCollection || [];
            const sheetSorts: SortCollectionModel[] = sortCollections.filter(
                (item: SortCollectionModel): boolean => (item.sheetIndex || 0) === sheetIndex
            );
            if (sheetSorts.length > 0) {
                const primarySort: SortCollectionModel = sheetSorts[0];
                if (primarySort && primarySort.sortRange) {
                    const sortRangeIndexes: number[] = getCellIndexes(primarySort.sortRange.split(':')[0]);
                    const endIndexes: number[] = getCellIndexes(primarySort.sortRange.split(':')[1]);
                    const dataRange: string = primarySort.sortRange;
                    const dataSorter: DataSorter = autoFilterHandle.addDataSorter(dataRange);
                    if (dataSorter) {
                        const conditionEntries: any[] = [];
                        for (let sIdx: number = 0; sIdx < sheetSorts.length; sIdx++) {
                            const sortItem: SortCollectionModel = sheetSorts[sIdx as number];
                            const sortConditionCol: number = (!isNullOrUndefined(sortItem.columnIndex) ? sortItem.columnIndex : 0);
                            const sortColAddress: string = getCellAddress(sortRangeIndexes[0], sortConditionCol) + ':' + getCellAddress(endIndexes[0], sortConditionCol);
                            const sortCondition: any = dataSorter.add(sortColAddress);
                            if (sortCondition && sortItem.order === 'Descending') {
                                sortCondition.isDescending = true;
                            }
                            if ((dataSorter as any).model && (dataSorter as any).model.conditions) {
                                conditionEntries.push((dataSorter as any).model.conditions[0]);
                            }
                        }
                        if (conditionEntries.length > 0 && (dataSorter as any).model) {
                            (dataSorter as any).model.conditions = conditionEntries;
                            if ((dataSorter as any).host && (dataSorter as any).host.markDirty) {
                                (dataSorter as any).host.markDirty();
                            }
                        }
                    }
                }
            }
        }
    }

    private processColumns(xlsxSheet: XlsxWorksheet, columns: ColumnModel[], isSheetProtected?: boolean, workbook?: Workbook): void {
        columns.forEach((columnModel: ColumnModel, columnIndex: number): void => {
            if (columnModel) {
                const columnOneBased: number = (!isNullOrUndefined(columnModel.index) ? columnModel.index : columnIndex) + 1;
                if (!isNullOrUndefined(columnModel.isLocked) && isSheetProtected && (xlsxSheet as any).setColumnStyle) {
                    (xlsxSheet as any).setColumnStyle(columnOneBased, { protection: { locked: columnModel.isLocked } });
                }
                if (columnModel.hidden) {
                    xlsxSheet.setColumnHidden(columnOneBased, true);
                } else if (columnModel.width && columnModel.width > 0) {
                    const characterWidth: number = Math.max(1, Math.round(((columnModel.width - 5) / 7) * 100) / 100);
                    xlsxSheet.setColumnWidth(columnOneBased, characterWidth);
                }
                if ((columnModel as any).validation) {
                    const colLetter: string = getCellAddress(0, columnOneBased - 1).replace(/[0-9]/g, '');
                    const colRangeString: string = `${colLetter}1:${colLetter}1048576`;
                    const dataValidation: DataValidation = xlsxSheet.dataValidations.add(colRangeString);
                    this.applyValidationToXlsx(dataValidation, (columnModel as any).validation, workbook);
                }
            }
        });
    }

    private processSheetValidations(xlsxSheet: XlsxWorksheet, validations: ValidationModel[], workbook?: Workbook): void {
        validations.forEach((validationItem: any): void => {
            const rangeTarget: string | string[] = validationItem.range || validationItem.address;
            if (rangeTarget) {
                const rangeList: string[] = Array.isArray(rangeTarget) ? rangeTarget : [rangeTarget];
                rangeList.forEach((rangeString: string): void => {
                    const dataValidation: DataValidation = xlsxSheet.dataValidations.add(rangeString);
                    this.applyValidationToXlsx(dataValidation, validationItem, workbook);
                });
            }
        });
    }

    private processDefinedNames(xlsxWorkbook: XlsxWorkbook, workbook: Workbook): void {
        const sheets: SheetModel[] = workbook.sheets || [];
        if (workbook.definedNames && workbook.definedNames.length > 0) {
            workbook.definedNames.forEach((definedName: { name?: string; refersTo?: string; scope?: string }): void => {
                if (definedName.name && definedName.refersTo) {
                    let sheetIndex: number | undefined;
                    if (definedName.scope && definedName.scope !== 'Workbook') {
                        const targetSheetIndex: number = sheets.findIndex(
                            (sheet: SheetModel, idx: number): boolean => (sheet.name || `Sheet${idx + 1}`) === definedName.scope
                        );
                        if (targetSheetIndex >= 0) {
                            sheetIndex = targetSheetIndex;
                        }
                    }
                    xlsxWorkbook.names.add(definedName.name, definedName.refersTo, sheetIndex);
                }
            });
        }
    }

    private processRowsAndCells(xlsxSheet: XlsxWorksheet, rows: RowModel[], workbook?: Workbook): void {
        rows.forEach((rowModel: RowModel, rowIndex: number): void => {
            if (rowModel) {
                const rowOneBased: number = (!isNullOrUndefined(rowModel.index) ? rowModel.index : rowIndex) + 1;
                if (rowModel.hidden) {
                    xlsxSheet.setRowHidden(rowOneBased, true);
                } else if (rowModel.height && rowModel.height > 0) {
                    const pointHeight: number = Math.round(Math.min(rowModel.height, 409.5) * 72 / 96 * 10) / 10;
                    xlsxSheet.setRowHeight(rowOneBased, pointHeight);
                }
                if (rowModel.cells && rowModel.cells.length > 0) {
                    rowModel.cells.forEach((cellModel: CellModel, columnIndex: number): void => {
                        if (cellModel) {
                            const columnOneBased: number = (!isNullOrUndefined(cellModel.index) ? cellModel.index : columnIndex) + 1;
                            const cellWrapper: XlsxCell = xlsxSheet.cell(rowOneBased, columnOneBased);
                            if (cellModel.notes && !cellWrapper.comment && !cellModel.comment && !cellWrapper.threadedComment) {
                                let noteTextString: string = '';
                                let isNoteVisible: boolean = false;
                                if (typeof cellModel.notes === 'string') {
                                    noteTextString = cellModel.notes;
                                } else if (!isNullOrUndefined(cellModel.notes)) {
                                    noteTextString = (cellModel.notes as any).text ? (cellModel.notes as any).text : '';
                                    isNoteVisible = (cellModel.notes as any).isVisible ? true : false;
                                }
                                if (noteTextString) {
                                    cellWrapper.addComment({ text: noteTextString, isVisible: isNoteVisible });
                                }
                            }
                            if (cellModel.comment && !cellWrapper.threadedComment) {
                                const threadedComment: ThreadedCommentModel = cellModel.comment;
                                const commentText: string = threadedComment.text ? threadedComment.text : '';
                                const commentAuthor: string = threadedComment.author ? threadedComment.author : '';
                                const creationTime: Date = threadedComment.createdTime ? new Date(threadedComment.createdTime) : new Date();
                                const threadedCommentObj: ThreadedComment = cellWrapper.addThreadedComment(
                                    commentText, commentAuthor, creationTime
                                );
                                if (threadedComment.replies && threadedComment.replies.length > 0 && threadedCommentObj) {
                                    threadedComment.replies.forEach((replyItem: {
                                        text?: string; author?: string; createdTime?: string | Date
                                    }): void => {
                                        const replyText: string = replyItem.text ? replyItem.text : '';
                                        const replyAuthor: string = replyItem.author ? replyItem.author : '';
                                        threadedCommentObj.addReply(
                                            replyText,
                                            replyAuthor,
                                            replyItem.createdTime ? new Date(replyItem.createdTime) : new Date()
                                        );
                                    });
                                }
                                if (threadedCommentObj && threadedComment.isResolved) {
                                    threadedCommentObj.isResolved = threadedComment.isResolved;
                                }
                            }
                            const cellFormula: string = cellModel.formula;
                            if (!isNullOrUndefined(cellModel.value)) {
                                this.setCellValueDirect(cellWrapper, cellModel);
                            }
                            if (cellFormula) {
                                const expressionString: string = cellFormula.startsWith('=')
                                    ? cellFormula.substring(1) : cellFormula;
                                cellWrapper.formula = expressionString;
                            }
                            let cellStyleObj: CellStyle | undefined = cellModel.style ? this.updateStyles(cellModel.style) : undefined;
                            if (cellModel.wrap) {
                                if (!cellStyleObj) { cellStyleObj = {}; }
                                const alignmentObj: Alignment = cellStyleObj.alignment ? {
                                    horizontal: cellStyleObj.alignment.horizontal,
                                    vertical: cellStyleObj.alignment.vertical,
                                    wrapText: true,
                                    indent: cellStyleObj.alignment.indent
                                } : { wrapText: true };
                                cellStyleObj = {
                                    font: cellStyleObj.font,
                                    fill: cellStyleObj.fill,
                                    border: cellStyleObj.border,
                                    alignment: alignmentObj,
                                    protection: cellStyleObj.protection
                                };
                            }
                            if (cellModel.isLocked === false) {
                                if (!cellStyleObj) { cellStyleObj = {}; }
                                const protectionObj: Protection = { locked: false };
                                cellStyleObj = {
                                    font: cellStyleObj.font,
                                    fill: cellStyleObj.fill,
                                    border: cellStyleObj.border,
                                    alignment: cellStyleObj.alignment,
                                    protection: protectionObj
                                };
                            }
                            if (cellModel.format && cellModel.format.toLowerCase() !== 'general') {
                                cellWrapper.numberFormat = this.updateNumberFormat(cellModel.format);
                            }
                            if (cellStyleObj) {
                                const currentXf: any = (cellWrapper as any).style;
                                if (currentXf && !isNullOrUndefined(currentXf.numFmtId)) {
                                    (cellStyleObj as any).numFmtId = currentXf.numFmtId;
                                }
                                cellWrapper.style = cellStyleObj;
                            }
                            if (cellModel.richText && Array.isArray(cellModel.richText)) {
                                this.applyRichText(cellWrapper, cellModel.richText);
                            }
                            if (cellModel.validation) {
                                const cellAddressString: string = getCellAddress(rowIndex, columnIndex);
                                const dataValidation: DataValidation = xlsxSheet.dataValidations.add(cellAddressString);
                                this.applyValidationToXlsx(dataValidation, cellModel.validation, workbook);
                            }
                            if ((cellModel.rowSpan && cellModel.rowSpan > 1) || (cellModel.colSpan && cellModel.colSpan > 1)) {
                                const rowSpanCount: number = (cellModel.rowSpan || 1) - 1;
                                const colSpanCount: number = (cellModel.colSpan || 1) - 1;
                                const startCellA1: string = getCellAddress(rowOneBased - 1, columnOneBased - 1);
                                const endCellA1: string = getCellAddress(rowOneBased - 1 + rowSpanCount, columnOneBased - 1 + colSpanCount);
                                xlsxSheet.merges.add(startCellA1 + ':' + endCellA1);
                            }
                        }
                    });
                }
            }
        });
    }

    private setCellValueDirect(cellWrapper: XlsxCell, cellModel: CellModel): void {
        const valueString: string = String(cellModel.value);
        if (cellModel.format === '@') {
            cellWrapper.value = valueString;
            return;
        }
        if (valueString.toUpperCase() === 'NAN') {
            cellWrapper.value = valueString;
            return;
        }
        if (valueString.toLowerCase() === 'true') {
            cellWrapper.value = true;
        } else if (valueString.toLowerCase() === 'false') {
            cellWrapper.value = false;
        } else if (!isNaN(Number(valueString)) && valueString.trim() !== '') {
            cellWrapper.value = Number(valueString);
        } else {
            cellWrapper.value = valueString;
        }
    }

    private applyRichText(cellWrapper: XlsxCell, richTextRuns: RichTextModel[]): void {
        let textStartPosition: number = 0;
        const richTextObj: any = cellWrapper.richText;
        for (let runIndex: number = 0; runIndex < richTextRuns.length; runIndex++) {
            const richTextItem: RichTextModel = richTextRuns[runIndex as number];
            if (richTextItem.style) {
                const styleModel: CellStyleModel = richTextItem.style;
                const fontProps: any = {};
                if (styleModel.verticalAlign === 'super') {
                    fontProps.vertAlign = 'superscript';
                } else if (styleModel.verticalAlign === 'sub') {
                    fontProps.vertAlign = 'subscript';
                }
                if (styleModel.fontWeight === 'bold') { fontProps.bold = true; }
                if (styleModel.fontStyle === 'italic') { fontProps.italic = true; }
                if (styleModel.fontFamily) {
                    fontProps.name = styleModel.fontFamily.split(',')[0].trim().replace(/['"]/g, '');
                }
                if (styleModel.fontSize) { fontProps.size = parseFloat(styleModel.fontSize); }
                if (styleModel.color) { fontProps.color = { rgb: this.parseColorToHex(styleModel.color) }; }
                if (styleModel.textDecoration) {
                    if (styleModel.textDecoration.indexOf('underline') >= 0) {
                        fontProps.underline = true;
                    }
                    if (styleModel.textDecoration.indexOf('line-through') >= 0) {
                        fontProps.strike = true;
                    }
                }
                const characterRange: any = richTextObj.characters(textStartPosition, textStartPosition + richTextItem.text.length - 1);
                characterRange.font = fontProps;
            }
            textStartPosition += richTextItem.text.length;
        }
    }

    private updateNumberFormat(format: string): string {
        if (!format) {
            return format;
        }
        if (format === '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)' ||
            format === '_($* #,##0.00_);_($* \\(#,##0.00\\);_($* "-"??_);_(@_)') {
            return '_("$"* #,##0.00_);_("$"* \\(#,##0.00\\);_("$"* "-"??_);_(@_)';
        }
        if (format === '_($* #,##0_);_($* (#,##0);_($* "-"_);_(@_)' ||
            format === '_($* #,##0_);_($* \\(#,##0\\);_($* "-"_);_(@_)') {
            return '_("$"* #,##0_);_("$"* \\(#,##0\\);_("$"* "-"_);_(@_)';
        }
        if (format === '_(* #,##0.00_);_(* (#,##0.00);_(* "-"??_);_(@_)' ||
            format === '_(* #,##0.00_);_(* \\(#,##0.00\\);_(* "-"??_);_(@_)') {
            return '_(* #,##0.00_);_(* \\(#,##0.00\\);_(* "-"??_);_(@_)';
        }
        if (format === '_(* #,##0_);_(* (#,##0);_(* "-"_);_(@_)' ||
            format === '_(* #,##0_);_(* \\(#,##0\\);_(* "-"_);_(@_)') {
            return '_(* #,##0_);_(* \\(#,##0\\);_(* "-"_);_(@_)';
        }
        // Accounting number format update
        if (format === '_(*#,##0.00);(* #,##0.00;_(*"-"??);(@)') {
            return '_(* #,##0.00_);_("$"* \\(#,##0.00\\);_("$"* "-"??_);_(@_)';
        }
        if (format === '_(*#,##0);(* #,##0;_(*"-");(@)') {
            return '_(* #,##0_);_("$"* \\(#,##0\\);_("$"* "-"_);_(@_)';
        }
        return format;
    }

    private applyValidationToXlsx(dataValidation: DataValidation, validationModel: ValidationModel, workbook?: Workbook): void {
        if (validationModel.type) {
            switch (validationModel.type) {
            case 'WholeNumber':
                dataValidation.type = 'whole';
                break;
            case 'Decimal':
                dataValidation.type = 'decimal';
                break;
            case 'Date':
                dataValidation.type = 'date';
                break;
            case 'Time':
                dataValidation.type = 'time';
                break;
            case 'TextLength':
                dataValidation.type = 'textLength';
                break;
            case 'List':
                dataValidation.type = 'list';
                break;
            default:
                break;
            }
        }
        if (validationModel.operator) {
            switch (validationModel.operator) {
            case 'Between':
                dataValidation.operator = 'between';
                break;
            case 'NotBetween':
                dataValidation.operator = 'notBetween';
                break;
            case 'EqualTo':
                dataValidation.operator = 'equal';
                break;
            case 'NotEqualTo':
                dataValidation.operator = 'notEqual';
                break;
            case 'GreaterThan':
                dataValidation.operator = 'greaterThan';
                break;
            case 'LessThan':
                dataValidation.operator = 'lessThan';
                break;
            case 'GreaterThanOrEqualTo':
                dataValidation.operator = 'greaterThanOrEqual';
                break;
            case 'LessThanOrEqualTo':
                dataValidation.operator = 'lessThanOrEqual';
                break;
            default:
                break;
            }
        }
        if (validationModel.value1) {
            if (validationModel.type === 'List') {
                let formulaValue: string = String(validationModel.value1);
                if (formulaValue.indexOf(':') >= 0 || formulaValue.indexOf('=') >= 0) {
                    formulaValue = formulaValue.replace(/^=/, '');
                    dataValidation.firstFormula = formulaValue;
                } else {
                    const listSeparator: string = (workbook && (workbook as any).listSeparator) ? (workbook as any).listSeparator : ',';
                    if (listSeparator && listSeparator !== ',' && formulaValue.indexOf(listSeparator) >= 0 && listSeparator.length === 1) {
                        dataValidation.listValues = formulaValue.split(listSeparator);
                    } else {
                        dataValidation.firstFormula = '"' + formulaValue + '"';
                    }
                }
            } else {
                dataValidation.firstFormula = String(validationModel.value1);
            }
        }
        if (validationModel.value2) {
            dataValidation.secondFormula = String(validationModel.value2);
        }
        if (!isNullOrUndefined(validationModel.ignoreBlank)) {
            dataValidation.allowBlank = validationModel.ignoreBlank;
        }
        if (!isNullOrUndefined(validationModel.inCellDropDown)) {
            dataValidation.showListDropdown = (validationModel.inCellDropDown !== false);
        }
    }

    private processMergedCells(xlsxSheet: XlsxWorksheet, mergedCells: MergedCellModel[]): void {
        mergedCells.forEach((mergedCell: MergedCellModel): void => {
            if (mergedCell && (mergedCell as any).range) {
                xlsxSheet.merges.add((mergedCell as any).range);
            } else if (mergedCell && (mergedCell as any).address) {
                const addressIndexes: number[] = (mergedCell as any).address;
                const startRowIndex: number = addressIndexes[0];
                const startColIndex: number = addressIndexes[1];
                const endRowIndex: number = startRowIndex + (mergedCell.rowSpan || 1) - 1;
                const endColIndex: number = startColIndex + (mergedCell.colSpan || 1) - 1;
                const startA1: string = getCellAddress(startRowIndex, startColIndex);
                const endA1: string = getCellAddress(endRowIndex, endColIndex);
                xlsxSheet.merges.add(`${startA1}:${endA1}`);
            }
        });
    }

    private processCellImages(xlsxSheet: XlsxWorksheet, images: ImageModel[], rowIndex: number, columnIndex: number): void {
        images.forEach((imageDetails: ImageModel): void => {
            if (imageDetails && imageDetails.src) {
                let imageSrc: string = imageDetails.src;
                if (imageSrc.indexOf('data:image') > -1) {
                    const sourceParts: string[] = imageSrc.split(',');
                    imageSrc = sourceParts.length > 1 ? sourceParts[1] : imageSrc;
                }
                const binaryString: string = atob(imageSrc);
                const imageBytes: Uint8Array = new Uint8Array(binaryString.length);
                for (let byteIndex: number = 0; byteIndex < binaryString.length; byteIndex++) {
                    imageBytes[byteIndex as number] = binaryString.charCodeAt(byteIndex as number);
                }
                const widthPt: number = Math.round(imageDetails.width ? (imageDetails.width * 72 / 96) : 100);
                const heightPt: number = Math.round(imageDetails.height ? (imageDetails.height * 72 / 96) : 100);
                xlsxSheet.addImage(
                    imageBytes,
                    rowIndex + 1,
                    columnIndex + 1,
                    widthPt,
                    heightPt
                );
            }
        });
    }

    private processImages(xlsxSheet: XlsxWorksheet, images: ImageModel[]): void {
        images.forEach((imageItem: ImageModel): void => {
            if (imageItem && imageItem.src) {
                const imageItemAny: any = imageItem;
                const rowIndex: number = imageItemAny.address ? imageItemAny.address[0]
                    : (imageItemAny.row ? imageItemAny.row - 1 : 0);
                const columnIndex: number = imageItemAny.address ? imageItemAny.address[1]
                    : (imageItemAny.column ? imageItemAny.column - 1 : 0);
                this.processCellImages(xlsxSheet, [imageItem], rowIndex, columnIndex);
            }
        });
    }

    private mapChartType(type: string): string {
        switch (type) {
        case 'Column': case 'ColumnClustered': return 'columnClustered';
        case 'StackingColumn': case 'ColumnStacked': return 'columnStacked';
        case 'StackingColumn100': case 'ColumnPercentStacked': return 'columnPercentStacked';
        case 'Bar': case 'BarClustered': return 'barClustered';
        case 'StackingBar': case 'BarStacked': return 'barStacked';
        case 'StackingBar100': case 'BarPercentStacked': return 'barPercentStacked';
        case 'Line': return 'line';
        case 'StackingLine': case 'LineStacked': return 'lineStacked';
        case 'StackingLine100': case 'LinePercentStacked': return 'linePercentStacked';
        case 'Area': return 'area';
        case 'StackingArea': case 'AreaStacked': return 'areaStacked';
        case 'StackingArea100': case 'AreaPercentStacked': return 'areaPercentStacked';
        case 'Pie': return 'pie';
        case 'Doughnut': return 'doughnut';
        case 'Scatter': case 'ScatterMarkers': return 'scatterMarkers';
        default:
            return type ? type.charAt(0).toLowerCase() + type.slice(1) : 'columnClustered';
        }
    }

    private processCharts(xlsxSheet: XlsxWorksheet, charts: ChartModel[]): void {
        charts.forEach((chartModel: ChartModel): void => {
            if (chartModel && chartModel.range) {
                const chartAny: any = chartModel;
                const rowIndex: number = chartAny.address && chartAny.address.length > 0
                    ? chartAny.address[0] + 1
                    : (chartModel.top ? Math.max(1, Math.round(chartModel.top / 20) + 1) : 3);
                const columnIndex: number = chartAny.address && chartAny.address.length > 1
                    ? chartAny.address[1] + 1
                    : (chartModel.left ? Math.max(1, Math.round(chartModel.left / 64) + 1) : 8);
                const chartWidth: number = chartModel.width ? chartModel.width : 480;
                const chartHeight: number = chartModel.height ? chartModel.height : 290;
                const chartHandle: XlsxChart = xlsxSheet.addChart(
                    this.mapChartType(chartModel.type) as any, rowIndex, columnIndex, chartWidth, chartHeight, chartModel.range
                );
                if (chartHandle && chartModel.title) {
                    chartHandle.chartTitle = chartModel.title;
                    chartHandle.hasTitle = true;
                }
            }
        });
    }

    private processNotes(xlsxSheet: XlsxWorksheet, notes: ExtendedNoteModel[]): void {
        notes.forEach((noteItem: ExtendedNoteModel): void => {
            if (noteItem) {
                const rowIndex: number = noteItem.address ? noteItem.address[0] : (noteItem as any).rowIdx;
                const columnIndex: number = noteItem.address ? noteItem.address[1] : (noteItem as any).colIdx;
                if (!isNullOrUndefined(rowIndex) && !isNullOrUndefined(columnIndex)) {
                    const cellWrapper: XlsxCell = xlsxSheet.cell(rowIndex + 1, columnIndex + 1);
                    if (cellWrapper && noteItem.text && !cellWrapper.comment && !cellWrapper.threadedComment) {
                        cellWrapper.addComment({ text: noteItem.text, isVisible: noteItem.isVisible ? true : false });
                    }
                }
            }
        });
    }

    private processHyperlinks(xlsxSheet: XlsxWorksheet, hyperlinks: { address: string; range: number[] }[]): void {
        hyperlinks.forEach((hyperlinkItem: { address: string; range: number[] }): void => {
            if (hyperlinkItem && hyperlinkItem.range && hyperlinkItem.address) {
                const cellWrapper: XlsxCell = xlsxSheet.cell(hyperlinkItem.range[0] + 1, hyperlinkItem.range[1] + 1);
                if (cellWrapper && !cellWrapper.hyperlink) {
                    const addressString: string = (hyperlinkItem.address as any).address || (hyperlinkItem.address as string);
                    if (addressString) {
                        cellWrapper.hyperlink = { target: addressString };
                    }
                }
            }
        });
    }

    private processComments(xlsxSheet: XlsxWorksheet, comments: ThreadedCommentModel[]): void {
        comments.forEach((threadedCommentModel: ThreadedCommentModel): void => {
            const commentAny: any = threadedCommentModel;
            if (threadedCommentModel && commentAny.address) {
                const cellWrapper: XlsxCell = xlsxSheet.cell(commentAny.address[0] + 1, commentAny.address[1] + 1);
                if (cellWrapper && !cellWrapper.threadedComment) {
                    const creationTime: Date = threadedCommentModel.createdTime
                        ? new Date(threadedCommentModel.createdTime) : new Date();
                    const commentText: string = threadedCommentModel.text ? threadedCommentModel.text : '';
                    const commentAuthor: string = threadedCommentModel.author ? threadedCommentModel.author : '';
                    const threadedCommentObj: ThreadedComment = cellWrapper.addThreadedComment(
                        commentText, commentAuthor, creationTime
                    );
                    if (threadedCommentModel.replies && threadedCommentModel.replies.length > 0 && threadedCommentObj) {
                        threadedCommentModel.replies.forEach((replyItem: {
                            text?: string; author?: string; createdTime?: string | Date
                        }): void => {
                            const replyText: string = replyItem.text ? replyItem.text : '';
                            const replyAuthor: string = replyItem.author ? replyItem.author : '';
                            threadedCommentObj.addReply(
                                replyText, replyAuthor,
                                replyItem.createdTime ? new Date(replyItem.createdTime) : new Date()
                            );
                        });
                    }
                    if (threadedCommentObj && threadedCommentModel.isResolved) {
                        threadedCommentObj.isResolved = threadedCommentModel.isResolved;
                    }
                }
            }
        });
    }

    private processConditionalFormats(xlsxSheet: XlsxWorksheet, conditionalFormats: ConditionalFormatModel[]): void {
        for (let formatIndex: number = conditionalFormats.length - 1; formatIndex >= 0; formatIndex--) {
            const formatModel: ConditionalFormatModel = conditionalFormats[formatIndex as number];
            if (formatModel && formatModel.range) {
                const formatType: string = String(formatModel.type);
                const colorCode: string = formatModel.cFColor ? String(formatModel.cFColor).toLowerCase() : 'redft';
                if (formatType.endsWith('ColorScale')) {
                    this.applyColorScaleCF(xlsxSheet, formatModel.range, formatType);
                } else if (formatType.endsWith('DataBar')) {
                    this.applyDataBarCF(xlsxSheet, formatModel.range, formatType);
                } else if (this.isIconSetType(formatType)) {
                    this.applyIconSetCF(xlsxSheet, formatModel.range, formatType);
                } else {
                    const rangeList: string[] = formatModel.range.split(',');
                    rangeList.forEach((rangeString: string): void => {
                        const rule: ConditionalFormat = xlsxSheet.conditionalFormats.add(rangeString.trim());
                        const cfValueList: string[] = this.getCFValues(formatModel.value ? formatModel.value : '');
                        const firstInputValue: string = cfValueList[0] ? cfValueList[0] : '';
                        const secondInputValue: string = cfValueList[1] ? cfValueList[1] : '';
                        if (formatType === 'GreaterThan' || formatType === 'LessThan' ||
                            formatType === 'EqualTo' || formatType === 'Between') {
                            rule.type = 'cellIs';
                            rule.operator = formatType === 'GreaterThan' ? 'greaterThan' :
                                formatType === 'LessThan' ? 'lessThan' :
                                    formatType === 'EqualTo' ? 'equal' : 'between';
                            if (firstInputValue) { rule.firstFormula = this.quoteCFValue(firstInputValue); }
                            if (secondInputValue) { rule.secondFormula = this.quoteCFValue(secondInputValue); }
                        } else if (formatType === 'DateOccur') {
                            rule.type = 'timePeriod';
                            (rule as any).timePeriod = firstInputValue || 'today';
                        } else if (formatType === 'ContainsText') {
                            rule.type = 'containsText';
                            rule.operator = 'containsText';
                            (rule as any).text = firstInputValue;
                            const firstCell: string = rangeString.split(':')[0].trim();
                            rule.firstFormula = `NOT(ISERROR(SEARCH("${firstInputValue}",${firstCell})))`;
                        } else if (formatType === 'Duplicate') {
                            rule.type = 'duplicateValues';
                        } else if (formatType === 'Unique') {
                            rule.type = 'uniqueValues';
                        } else if (formatType === 'AboveAverage' || formatType === 'BelowAverage') {
                            rule.type = 'aboveAverage';
                            if (formatType === 'BelowAverage') {
                                (rule as any).aboveAverage = false;
                            }
                        } else if (formatType === 'Top10Items' || formatType === 'Top10Percentage' ||
                            formatType === 'Bottom10Items' || formatType === 'Bottom10Percentage') {
                            rule.type = 'top10';
                            const rankValue: number = firstInputValue ? parseInt(firstInputValue, 10) : 10;
                            (rule as any).rank = isNaN(rankValue) ? 10 : rankValue;
                            (rule as any).percent = formatType === 'Top10Percentage' || formatType === 'Bottom10Percentage';
                            (rule as any).bottom = formatType === 'Bottom10Items' || formatType === 'Bottom10Percentage';
                        }
                        this.applyCFColors(rule, formatModel, colorCode);
                    });
                }
            }
        }
    }

    private getCFormatBG(colorName: string): string {
        switch (colorName) {
        case 'redft': case 'redf': return '#FFC7CE';
        case 'yellowft': return '#FFEB9C';
        case 'greenft': return '#C6EFCE';
        default: return colorName.indexOf('#') > -1 ? colorName : '#FFC7CE';
        }
    }

    private getCFormatFC(colorName: string): string {
        switch (colorName) {
        case 'redft': case 'redt': return '#9C0006';
        case 'yellowft': return '#9C6500';
        case 'greenft': return '#006100';
        default: return colorName.indexOf('#') > -1 ? colorName : '#9C0006';
        }
    }

    private applyCFColors(rule: ConditionalFormat, formatModel: ConditionalFormatModel, colorName: string): void {
        const standardColors: string[] = ['redft', 'redf', 'yellowft', 'greenft', 'redt'];
        const formatSettings: { style?: CellStyleModel } | undefined = formatModel.format;
        const hasCustomStyle: boolean = Boolean(formatSettings && formatSettings.style);
        let fontColor: string = '';
        let bgColor: string = '';
        let isBold: boolean = false;
        let isItalic: boolean = false;
        let isUnderline: boolean = false;

        if (standardColors.indexOf(colorName) >= 0) {
            if (colorName !== 'redt') {
                bgColor = this.getCFormatBG(colorName);
            }
            if (colorName !== 'redf') {
                fontColor = this.getCFormatFC(colorName);
            }
        } else if (hasCustomStyle && formatSettings && formatSettings.style) {
            const cellStyle: CellStyleModel = formatSettings.style;
            if (cellStyle.color) { fontColor = cellStyle.color; }
            if (cellStyle.backgroundColor) { bgColor = cellStyle.backgroundColor; }
            if (cellStyle.fontWeight === 'bold') { isBold = true; }
            if (cellStyle.fontStyle === 'italic') { isItalic = true; }
            if (cellStyle.textDecoration && cellStyle.textDecoration.toLowerCase() === 'underline') { isUnderline = true; }
        }

        const dxfInput: any = {};
        if (fontColor || isBold || isItalic || isUnderline) {
            dxfInput.font = {};
            if (fontColor) {
                const cleanFontHex: string = fontColor.startsWith('#') ? fontColor.substring(1) : fontColor;
                dxfInput.font.color = { rgb: cleanFontHex.length === 6 ? 'FF' + cleanFontHex.toUpperCase() : cleanFontHex.toUpperCase() };
            }
            if (isBold) { dxfInput.font.bold = true; }
            if (isItalic) { dxfInput.font.italic = true; }
            if (isUnderline) { dxfInput.font.underline = 'single'; }
        }
        if (bgColor) {
            const cleanBgHex: string = bgColor.startsWith('#') ? bgColor.substring(1) : bgColor;
            const fullRgb: string = cleanBgHex.length === 6 ? 'FF' + cleanBgHex.toUpperCase() : cleanBgHex.toUpperCase();
            dxfInput.fill = {
                type: 'pattern',
                patternType: 'solid',
                bgColor: { rgb: fullRgb },
                fgColor: { rgb: fullRgb }
            };
        }
        if (dxfInput.font || dxfInput.fill) {
            rule.format = dxfInput;
        }
    }

    private applyColorScaleCF(xlsxSheet: XlsxWorksheet, range: string, typeName: string): void {
        const rangeList: string[] = range.split(',');
        rangeList.forEach((rangeString: string): void => {
            const rule: any = xlsxSheet.conditionalFormats.add(rangeString.trim());
            rule.type = 'colorScale';
            let minColorHex: string = 'FFF8696B';
            let midColorHex: string | undefined;
            let maxColorHex: string = 'FF63BE7B';
            switch (typeName) {
            case 'GYRColorScale':
                minColorHex = 'FFF8696B'; midColorHex = 'FFFFEB84'; maxColorHex = 'FF63BE7B'; break;
            case 'RYGColorScale':
                minColorHex = 'FF63BE7B'; midColorHex = 'FFFFEB84'; maxColorHex = 'FFF8696B'; break;
            case 'GWRColorScale':
                minColorHex = 'FFF8696B'; midColorHex = 'FFFFFFFF'; maxColorHex = 'FF63BE7B'; break;
            case 'RWGColorScale':
                minColorHex = 'FF63BE7B'; midColorHex = 'FFFFFFFF'; maxColorHex = 'FFF8696B'; break;
            case 'BWRColorScale':
                minColorHex = 'FFF8696B'; midColorHex = 'FFFFFFFF'; maxColorHex = 'FF5A8AC6'; break;
            case 'RWBColorScale':
                minColorHex = 'FF5A8AC6'; midColorHex = 'FFFFFFFF'; maxColorHex = 'FFF8696B'; break;
            case 'WRColorScale':
                minColorHex = 'FFF8696B'; midColorHex = undefined; maxColorHex = 'FFFFFFFF'; break;
            case 'RWColorScale':
                minColorHex = 'FFFFFFFF'; midColorHex = undefined; maxColorHex = 'FFF8696B'; break;
            case 'GWColorScale':
                minColorHex = 'FFFFFFFF'; midColorHex = undefined; maxColorHex = 'FF63BE7B'; break;
            case 'WGColorScale':
                minColorHex = 'FF63BE7B'; midColorHex = undefined; maxColorHex = 'FFFFFFFF'; break;
            case 'GYColorScale':
                minColorHex = 'FFFFEB84'; midColorHex = undefined; maxColorHex = 'FF63BE7B'; break;
            case 'YGColorScale':
                minColorHex = 'FF63BE7B'; midColorHex = undefined; maxColorHex = 'FFFFEB84'; break;
            }

            if (rule.colorScale) {
                rule.colorScale.minPoint = { type: 'lowestValue', color: { rgb: minColorHex } };
                rule.colorScale.maxPoint = { type: 'highestValue', color: { rgb: maxColorHex } };
                if (midColorHex) {
                    rule.colorScale.midPoint = { type: 'percentile', value: '50', color: { rgb: midColorHex } };
                } else {
                    rule.colorScale.midPoint = undefined;
                }
            } else if ((rule as any).entry) {
                const stops: any[] = [
                    { type: 'lowestValue', color: { rgb: minColorHex } }
                ];
                if (midColorHex) {
                    stops.push({ type: 'percentile', value: '50', color: { rgb: midColorHex } });
                }
                stops.push({ type: 'highestValue', color: { rgb: maxColorHex } });
                (rule as any).entry.colorScaleData = { stops: stops };
            }
        });
    }

    private applyDataBarCF(xlsxSheet: XlsxWorksheet, range: string, typeName: string): void {
        const barColorHex: string = this.getDataBarColor(typeName);
        const rangeList: string[] = range.split(',');
        rangeList.forEach((rangeString: string): void => {
            const rule: any = xlsxSheet.conditionalFormats.add(rangeString.trim());
            rule.type = 'dataBar';
            if (rule.dataBar) {
                rule.dataBar.barColor = { rgb: barColorHex.replace('#', 'FF') };
                rule.dataBar.hasGradientFill = false;
            } else {
                rule.dataBarData = { barColor: barColorHex, hasGradientFill: false };
            }
        });
    }

    private getDataBarColor(typeName: string): string {
        switch (typeName) {
        case 'GreenDataBar': return '#63be7b';
        case 'RedDataBar': return '#f8696b';
        case 'BlueDataBar': return '#5a8ac6';
        case 'OrangeDataBar': return '#ffb628';
        case 'LightBlueDataBar': return '#008aef';
        case 'PurpleDataBar': return '#d6007b';
        default: return '#5a8ac6';
        }
    }

    private mapIconSetType(typeName: string): string {
        switch (typeName) {
        case 'ThreeArrows': case 'ThreeArrowsColor': return '3Arrows';
        case 'ThreeTriangles': return '3Triangles';
        case 'ThreeArrowsGray': return '3ArrowsGray';
        case 'ThreeFlags': return '3Flags';
        case 'ThreeStars': return '3Stars';
        case 'ThreeSymbols': case 'ThreeSymbols1': return '3Symbols';
        case 'ThreeSymbols2': return '3Symbols2';
        case 'ThreeTrafficLights1': return '3TrafficLights1';
        case 'ThreeTrafficLights2': return '3TrafficLights2';
        case 'ThreeSigns': return '3Signs';
        case 'FourArrows': case 'FourArrowsColor': return '4Arrows';
        case 'FourArrowsGray': return '4ArrowsGray';
        case 'FourRedToBlack': return '4RedToBlack';
        case 'FourRating': case 'FourRatings': return '4Rating';
        case 'FourTrafficLights': return '4TrafficLights';
        case 'FiveArrows': case 'FiveArrowsColor': return '5Arrows';
        case 'FiveArrowsGray': return '5ArrowsGray';
        case 'FiveRating': case 'FiveRatings': return '5Rating';
        case 'FiveBoxes': return '5Boxes';
        case 'FiveQuarters': return '5Quarters';
        default: return typeName;
        }
    }

    private applyIconSetCF(xlsxSheet: XlsxWorksheet, range: string, typeName: string): void {
        const rangeList: string[] = range.split(',');
        const iconType: string = this.mapIconSetType(typeName);
        rangeList.forEach((rangeString: string): void => {
            const rule: any = xlsxSheet.conditionalFormats.add(rangeString.trim());
            rule.type = 'iconSet';
            if (rule.iconSet) {
                rule.iconSet.iconSetType = iconType;
            } else {
                rule.iconSetData = { iconSetType: iconType };
            }
        });
    }

    private isIconSetType(typeName: string): boolean {
        return typeName.startsWith('Three') || typeName.startsWith('Four') || typeName.startsWith('Five');
    }

    private getCFValues(input: string): string[] {
        if (!input) { return ['', '']; }
        const valueArray: string[] = input.split(',');
        if (valueArray.length <= 1) { return [input, '']; }
        if (valueArray[0].indexOf('(') > -1) {
            let combinedValueString: string = '';
            let ruleValue1: string = '';
            valueArray.forEach((valPart: string): void => {
                combinedValueString += valPart + ',';
                const openCount: number = (combinedValueString.match(/\(/g) || []).length;
                const closeCount: number = (combinedValueString.match(/\)/g) || []).length;
                if (openCount === closeCount && ruleValue1.length === 0) {
                    ruleValue1 = combinedValueString.substring(0, combinedValueString.length - 1);
                    combinedValueString = '';
                }
            });
            const ruleValue2: string = combinedValueString ? combinedValueString.substring(0, combinedValueString.length - 1) : '';
            return [ruleValue1, ruleValue2];
        } else {
            return [valueArray[0], valueArray.slice(1).join(',')];
        }
    }

    private quoteCFValue(valueString: string): string {
        if (!valueString) { return valueString; }
        if (isNaN(Number(valueString))) {
            return `"${valueString.replace(/"/g, '""')}"`;
        }
        return valueString;
    }

    private updateStyles(style: CellStyleModel): CellStyle | undefined {
        let xlsxStyle: CellStyle | undefined;
        if (style) {
            let hasProps: boolean = false;
            const fontObj: any = {};
            let hasFontProps: boolean = false;
            if (style.fontFamily) {
                fontObj.name = style.fontFamily.split(',')[0].trim().replace(/['"]/g, '');
                hasFontProps = true;
            }
            if (style.fontSize) {
                const sizeNumber: number = parseFloat(style.fontSize);
                if (!isNaN(sizeNumber)) {
                    fontObj.size = sizeNumber;
                    hasFontProps = true;
                }
            }
            if (style.fontWeight === 'bold') { fontObj.bold = true; hasFontProps = true; }
            if (style.fontStyle === 'italic') { fontObj.italic = true; hasFontProps = true; }
            if (style.textDecoration && style.textDecoration.indexOf('underline') >= 0) {
                fontObj.underline = true; hasFontProps = true;
            }
            if (style.textDecoration && style.textDecoration.indexOf('line-through') >= 0) {
                fontObj.strike = true; hasFontProps = true;
            }
            if (style.color) {
                fontObj.color = { rgb: this.parseColorToHex(style.color) };
                hasFontProps = true;
            }
            let fillObj: Fill | undefined;
            if (style.backgroundColor) {
                fillObj = {
                    type: 'pattern',
                    patternType: 'solid',
                    fgColor: { rgb: this.parseColorToHex(style.backgroundColor) }
                };
                hasProps = true;
            }
            const alignmentObj: Alignment = {};
            let hasAlignProps: boolean = false;
            if (style.textAlign) {
                (alignmentObj as any).horizontal = style.textAlign.toLowerCase();
                hasAlignProps = true;
            }
            if (style.verticalAlign) {
                const verticalAlignStr: string = style.verticalAlign.toLowerCase();
                (alignmentObj as any).vertical = verticalAlignStr === 'middle' ? 'center' : verticalAlignStr;
                hasAlignProps = true;
            }
            if (style.textIndent) {
                const indentPixels: number = parseFloat(style.textIndent);
                if (!isNaN(indentPixels) && indentPixels > 0) {
                    (alignmentObj as any).indent = Math.round(indentPixels / 12);
                    hasAlignProps = true;
                }
            }
            const leftBorder: BorderEdge | undefined = this.parseBorderEdge(style.borderLeft || style.border);
            const rightBorder: BorderEdge | undefined = this.parseBorderEdge(style.borderRight || style.border);
            const topBorder: BorderEdge | undefined = this.parseBorderEdge(style.borderTop || style.border);
            const bottomBorder: BorderEdge | undefined = this.parseBorderEdge(style.borderBottom || style.border);
            let borderObj: Border | undefined;
            if (leftBorder || rightBorder || topBorder || bottomBorder) {
                borderObj = {
                    left: leftBorder,
                    right: rightBorder,
                    top: topBorder,
                    bottom: bottomBorder
                };
                hasProps = true;
            }
            if (hasProps || hasFontProps || hasAlignProps) {
                xlsxStyle = {
                    font: hasFontProps ? fontObj : undefined,
                    fill: fillObj,
                    border: borderObj,
                    alignment: hasAlignProps ? alignmentObj : undefined
                };
            }
        }
        return xlsxStyle;
    }

    private parseBorderEdge(borderStr: string | undefined): { style?: string; color?: { rgb?: string } } | undefined {
        let borderEdgeResult: { style?: string; color?: { rgb?: string } } | undefined;
        if (borderStr && borderStr.trim() !== '') {
            const borderParts: string[] = borderStr.trim().split(/\s+/);
            if (borderParts.length >= 2) {
                const widthPart: string = borderParts[0].toLowerCase();
                const stylePart: string = borderParts[1].toLowerCase();
                const colorPart: string = borderParts.length > 2 ? borderParts.slice(2).join(' ') : '#000000';
                let styleName: string;
                if (stylePart === 'dashed') {
                    styleName = 'dashed';
                } else if (stylePart === 'dotted') {
                    styleName = 'dotted';
                } else if (stylePart === 'double') {
                    styleName = 'double';
                } else if (widthPart === '2px') {
                    styleName = 'medium';
                } else if (widthPart === '3px') {
                    styleName = 'thick';
                } else {
                    styleName = 'thin';
                }
                borderEdgeResult = {
                    style: styleName,
                    color: { rgb: this.parseColorToHex(colorPart) }
                };
            }
        }
        return borderEdgeResult;
    }

    private parseColorToHex(color: string): string {
        if (!color) {
            return 'FF000000';
        }
        const trimmedColor: string = color.trim().toLowerCase();
        switch (trimmedColor) {
        case 'yellow': return 'FFFFFF00';
        case 'red': return 'FFFF0000';
        case 'blue': return 'FF0000FF';
        case 'green': return 'FF008000';
        case 'white': return 'FFFFFFFF';
        case 'black': return 'FF000000';
        case 'cyan': return 'FF00FFFF';
        case 'magenta': return 'FFFF00FF';
        case 'orange': return 'FFFFA500';
        case 'purple': return 'FF800080';
        case 'gray':
        case 'grey': return 'FF808080';
        case 'silver': return 'FFC0C0C0';
        case 'maroon': return 'FF800000';
        case 'olive': return 'FF808000';
        case 'lime': return 'FF00FF00';
        case 'aqua': return 'FF00FFFF';
        case 'teal': return 'FF008080';
        case 'navy': return 'FF000080';
        case 'fuchsia': return 'FFFF00FF';
        case 'windowtext': return 'FF000000';
        default: break;
        }
        if (trimmedColor.startsWith('#')) {
            const hexSubstring: string = trimmedColor.substring(1);
            if (hexSubstring.length === 3) {
                const c0: string = hexSubstring[0];
                const c1: string = hexSubstring[1];
                const c2: string = hexSubstring[2];
                return ('FF' + c0 + c0 + c1 + c1 + c2 + c2).toUpperCase();
            } else if (hexSubstring.length === 6) {
                return ('FF' + hexSubstring).toUpperCase();
            } else if (hexSubstring.length === 8) {
                return hexSubstring.toUpperCase();
            }
        } else if (trimmedColor.startsWith('rgb')) {
            const startIdx: number = trimmedColor.indexOf('(');
            const endIdx: number = trimmedColor.lastIndexOf(')');
            if (startIdx !== -1 && endIdx > startIdx) {
                const parts: string[] = trimmedColor.substring(startIdx + 1, endIdx).split(',');
                if (parts.length >= 3) {
                    const toHexValue: (n: number) => string = (n: number): string => {
                        const hexVal: string = Math.min(255, Math.max(0, Math.round(n))).toString(16);
                        return hexVal.length === 1 ? '0' + hexVal : hexVal;
                    };
                    let alphaChannel: string = 'FF';
                    if (parts.length >= 4) {
                        const aVal: number = parseFloat(parts[3]);
                        const alphaNum: number = aVal <= 1.0 ? Math.round(aVal * 255) : Math.round(aVal);
                        alphaChannel = toHexValue(alphaNum);
                    }
                    const redChannel: string = toHexValue(parseFloat(parts[0]));
                    const greenChannel: string = toHexValue(parseFloat(parts[1]));
                    const blueChannel: string = toHexValue(parseFloat(parts[2]));
                    return (alphaChannel + redChannel + greenChannel + blueChannel).toUpperCase();
                }
            }
        }
        return 'FF000000';
    }

    private triggerDownload(blob: Blob, fileName: string): void {
        const downloadUrl: string = window.URL.createObjectURL(blob);
        const anchorElement: HTMLAnchorElement = document.createElement('a');
        anchorElement.href = downloadUrl;
        anchorElement.download = fileName;
        document.body.appendChild(anchorElement);
        anchorElement.click();
        document.body.removeChild(anchorElement);
        window.URL.revokeObjectURL(downloadUrl);
    }
}
