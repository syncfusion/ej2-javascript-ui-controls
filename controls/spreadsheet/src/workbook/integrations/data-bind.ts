import { DataManager, Query, Deferred, ReturnOption, QueryOptions } from '@syncfusion/ej2-data';
import { Workbook, getCell, CellModel, RowModel, SheetModel, setCell, isFilterHidden } from '../base/index';
import { getRangeIndexes, checkIsFormula, updateSheetFromDataSource, dataSourceChanged } from '../common/index';
import { ExtendedSheet, ExtendedRange, getCellIndexes, dataChanged, getCellAddress, isInRange } from '../common/index';
import { triggerDataChange, UsedRangeModel, getAutoDetectFormatParser } from '../index';
import { extend, isNullOrUndefined } from '@syncfusion/ej2-base';

/**
 * Data binding module
 */
export class DataBind {
    private parent: Workbook;
    private requestedInfo: RequestedInfo[];

    constructor(parent: Workbook) {
        this.parent = parent;
        this.requestedInfo = [];
        this.addEventListener();
    }

    private addEventListener(): void {
        this.parent.on(updateSheetFromDataSource, this.updateSheetFromDataSourceHandler, this);
        this.parent.on(dataSourceChanged, this.dataSourceChangedHandler, this);
        this.parent.on(dataChanged, this.dataChangedHandler, this);
        this.parent.on(triggerDataChange, this.triggerDataChangeHandler, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(updateSheetFromDataSource, this.updateSheetFromDataSourceHandler);
            this.parent.off(dataSourceChanged, this.dataSourceChangedHandler);
            this.parent.off(dataChanged, this.dataChangedHandler);
            this.parent.off(triggerDataChange, this.triggerDataChangeHandler);
        }
    }

    /**
     * Update given data source to sheet.
     *
     * @param {Object} args - Specify the args.
     * @param {ExtendedSheet} args.sheet - Specify the sheet.
     * @param {number[]} args.indexes - Specify the indexes.
     * @param {Promise<CellModel>} args.promise - Specify the promise.
     * @param {number} args.rangeSettingCount - Specify the rangeSettingCount.
     * @param {string} args.formulaCellRef - Specify the formulaCellRef.
     * @param {number} args.sheetIndex - Specify the sheetIndex.
     * @param {boolean} args.dataSourceChange - Specify the dataSourceChange.
     * @param {boolean} args.isFinite - Specify the isFinite.
     * @returns {void} - Update given data source to sheet.
     */

    private updateSheetFromDataSourceHandler(
        args: { sheet: ExtendedSheet, indexes: number[], promise: Promise<CellModel>, rangeSettingCount?: number[], formulaCellRef?: string,
            sheetIndex?: number, dataSourceChange?: boolean, isFinite?: boolean, resolveAfterFullDataLoaded?: boolean,
            loadComplete?: Function, isSaveAction?: boolean, autoDetectFormat?: boolean }): void {
        let cell: CellModel; let flds: string[]; let sCellIdx: number[];
        let result: Object[]; let remoteUrl: string; let isLocal: boolean; let dataManager: DataManager;
        const requestedRange: boolean[] = []; const sRanges: number[] = []; let rowIdx: number; let colIdx: number;
        const deferred: Deferred = new Deferred(); let sRowIdx: number; let sColIdx: number;
        let loadedInfo: { isNotLoaded: boolean, unloadedRange: number[] };
        args.promise = deferred.promise; let startCellIndexes: number[];
        const autoDetectFormat: boolean = args.autoDetectFormat;
        const autoDetectFormatFn: (cell: CellModel) => void = autoDetectFormat && getAutoDetectFormatParser(this.parent);
        if (args.sheet && args.sheet.ranges.length) {
            for (let k: number = args.sheet.ranges.length - 1; k >= 0; k--) {
                const range: ExtendedRange = args.sheet.ranges[k as number];
                startCellIndexes = getRangeIndexes(range.startCell);
                if (args.isSaveAction) {
                    args.indexes = startCellIndexes;
                }
                let sRange: number = args.indexes[0]; let eRange: number = args.indexes[2];
                sRowIdx = startCellIndexes[0];
                dataManager = range.dataSource instanceof DataManager ? range.dataSource as DataManager
                    : range.dataSource ? new DataManager(range.dataSource) : new DataManager();
                remoteUrl = remoteUrl || dataManager.dataSource.url; args.sheet.isLocalData = isLocal || !dataManager.dataSource.url;
                if (sRowIdx <= sRange) {
                    sRange = sRange - sRowIdx;
                } else {
                    if (sRowIdx <= eRange) {
                        eRange = eRange - sRowIdx; sRange = 0;
                    } else { sRange = -1; }
                }
                if (range.showFieldAsHeader && sRange !== 0) {
                    sRange -= 1;
                }
                let isEndReached: boolean = false; let insertRowCount: number = 0;
                this.initRangeInfo(range);
                let count: number = this.getMaxCount(range);
                loadedInfo = this.getLoadedInfo(sRange, eRange, range);
                sRange = loadedInfo.unloadedRange[0]; eRange = loadedInfo.unloadedRange[1];
                if (range.info.insertRowRange) {
                    range.info.insertRowRange.forEach((range: number[]): void => {
                        insertRowCount += ((range[1] - range[0]) + 1);
                    });
                    sRange -= insertRowCount; eRange -= insertRowCount;
                }
                if (sRange >= count) {
                    isEndReached = true;
                } else if (eRange > count) {
                    eRange = count;
                }
                if (!args.loadComplete) {
                    this.requestedInfo.push({ deferred: deferred, indexes: args.indexes, isNotLoaded: loadedInfo.isNotLoaded });
                }
                if (sRange >= 0 && loadedInfo.isNotLoaded && !isEndReached) {
                    sRanges[k as number] = sRange; requestedRange[k as number] = false;
                    let fieldsOrder: string[];
                    if (range.fieldsOrder) {
                        fieldsOrder = [].slice.call(range.fieldsOrder);
                    }
                    const query: Query = (range.query ? range.query : new Query()).clone();
                    dataManager.executeQuery(query.range(sRange, eRange >= count ? eRange : eRange + 1)
                        .requiresCount()).then((e: ReturnOption) => {
                        if (!this.parent || this.parent.isDestroyed) { return; }
                        result = (e.result && e.result.result ? e.result.result : e.result) as Object[];
                        sCellIdx = getRangeIndexes(range.startCell);
                        sRowIdx = sCellIdx[0]; sColIdx = sCellIdx[1];
                        if (result && result.length) {
                            if (!range.info.count) { count = e.count; range.info.count = e.count; }
                            flds = range.info.flds || fieldsOrder || Object.keys(result[0]);
                            if (!range.info.fldLen) { range.info.fldLen = flds.length; range.info.flds = flds; }
                            if (range.info.insertColumnRange) {
                                let insertCount: number = 0;
                                range.info.insertColumnRange.forEach((insertRange: number[]): void => {
                                    for (let i: number = insertRange[0]; i <= insertRange[1]; i++) {
                                        if (i <= sColIdx) {
                                            flds.splice(0, 0, `emptyCell${insertCount}`);
                                        } else {
                                            flds.splice(
                                                i - sColIdx, 0, `emptyCell${insertCount}`);
                                        }
                                        insertCount++;
                                    }
                                });
                            }
                            if (sRanges[k as number] === 0 && range.showFieldAsHeader) {
                                rowIdx = sRowIdx + sRanges[k as number] + insertRowCount;
                                flds.forEach((field: string, i: number) => {
                                    cell = getCell(rowIdx, sColIdx + i, args.sheet, true);
                                    if (!cell) {
                                        args.sheet.rows[sRowIdx + sRanges[k as number]].cells[sColIdx + i] = field.includes('emptyCell') ? {}
                                            : { value: field };
                                    } else if (!field.includes('emptyCell')) {
                                        cell.value = field;
                                    }
                                });
                            }
                            result.forEach((item: { [key: string]: string }, i: number) => {
                                rowIdx = sRowIdx + sRanges[k as number] + i + (range.showFieldAsHeader ? 1 : 0) + insertRowCount;
                                flds.forEach((field: string, idx: number) => {
                                    colIdx = sColIdx + idx;
                                    cell = getCell(rowIdx, colIdx, args.sheet, true);
                                    if (cell) {
                                        if (!field.includes('emptyCell')) {
                                            setCell(rowIdx, colIdx, args.sheet, this.getCellDataFromProp(item[field as string]), true);
                                        }
                                    } else {
                                        cell = args.sheet.rows[rowIdx as number].cells[colIdx as number] =
                                            field.includes('emptyCell') ? {} : this.getCellDataFromProp(item[field as string]);
                                    }
                                    if (autoDetectFormat) {
                                        autoDetectFormatFn(cell);
                                    }
                                });
                            });
                        } else {
                            flds = [];
                        }
                        let totalRows: number;
                        if ((sRowIdx + (count || e.count)) > 0) {
                            totalRows = (sRowIdx + (count || e.count) + (range.showFieldAsHeader ? 1 : 0) + insertRowCount) - 1;
                        } else {
                            totalRows = args.sheet.usedRange.rowIndex;
                        }
                        const totalCols: number = sColIdx + flds.length - 1 < 0 ? args.sheet.usedRange.colIndex : sColIdx + flds.length - 1;
                        const usedRange: UsedRangeModel = { rowIndex: totalRows, colIndex: totalCols };
                        if (args.isFinite) {
                            usedRange.rowIndex = totalRows < args.sheet.rowCount ? totalRows : args.sheet.rowCount - 1;
                            usedRange.colIndex = totalCols < args.sheet.colCount ? totalCols : args.sheet.colCount - 1;
                        }
                        if (args.sheet.usedRange.rowIndex < usedRange.rowIndex) {
                            args.sheet.usedRange.rowIndex = usedRange.rowIndex;
                        }
                        if (args.sheet.usedRange.colIndex < usedRange.colIndex) {
                            args.sheet.usedRange.colIndex = usedRange.colIndex;
                        }
                        if (insertRowCount) {
                            loadedInfo = this.getLoadedInfo(sRange, eRange, range);
                            sRange = loadedInfo.unloadedRange[0]; eRange = loadedInfo.unloadedRange[1];
                            if (sRange > count) {
                                loadedInfo.isNotLoaded = false;
                            }
                            if (loadedInfo.isNotLoaded) {
                                if (eRange > count) { eRange = count; }
                                range.info.loadedRange.push([sRange, eRange]);
                            }
                        } else {
                            range.info.loadedRange.push([sRange, eRange]);
                        }
                        requestedRange[k as number] = true;
                        if (requestedRange.indexOf(false) === -1) {
                            let dataLoading: boolean;
                            if (eRange + sRowIdx < sRowIdx + range.info.count) {
                                if (!args.rangeSettingCount) { args.rangeSettingCount = []; }
                                args.rangeSettingCount.push(k);
                                dataLoading = true;
                                //if (remoteUrl) {
                                const unloadedArgs: { sheet: ExtendedSheet, indexes: number[], promise: Promise<CellModel>,
                                    rangeSettingCount?: number[], isFinite?: boolean, resolveAfterFullDataLoaded?: boolean,
                                    loadComplete?: Function, autoDetectFormat?: boolean } = {
                                    sheet: args.sheet, indexes: [0, 0, totalRows, totalCols],
                                    promise: new Promise((resolve: Function) => { resolve((() => { /** */ })()); }),
                                    rangeSettingCount: args.rangeSettingCount, isFinite: args.isFinite, loadComplete: args.loadComplete,
                                    autoDetectFormat: args.autoDetectFormat, resolveAfterFullDataLoaded: args.resolveAfterFullDataLoaded
                                };
                                this.updateSheetFromDataSourceHandler(unloadedArgs);
                                unloadedArgs.promise.then((): void => {
                                    if (this.parent.getModuleName() === 'workbook') { return; }
                                    args.rangeSettingCount.pop();
                                    if (!args.rangeSettingCount.length) { this.parent.notify('created', null); }
                                    if (args.formulaCellRef) {
                                        this.notfyFormulaCellRefresh(args.formulaCellRef, args.sheetIndex);
                                    } else if (args.loadComplete) {
                                        args.loadComplete();
                                    }
                                });
                                //}
                            } else if (args.formulaCellRef) {
                                this.notfyFormulaCellRefresh(args.formulaCellRef, args.sheetIndex);
                            } else if (args.loadComplete) {
                                args.loadComplete();
                            }
                            if (!(dataLoading && args.resolveAfterFullDataLoaded)) {
                                this.checkResolve(args.indexes);
                                if (args.resolveAfterFullDataLoaded) {
                                    this.checkResolve([0, 0, 0, 0]);
                                }
                            }
                        }
                    });
                } else if (k === 0 && requestedRange.indexOf(false) === -1) {
                    this.checkResolve(args.indexes);
                }
            }
        } else { deferred.resolve(); }
    }

    private notfyFormulaCellRefresh(formulaCellRef: string, sheetIndex: number): void {
        this.parent.formulaRefCell = null;
        this.parent.notify('updateView', { indexes: getRangeIndexes(formulaCellRef), sheetIndex: sheetIndex, refreshing: true });
    }

    private checkResolve(indexes: number[]): void {
        let resolved: boolean;
        let isSameRng: boolean;
        let cnt: number = 0;
        this.requestedInfo.forEach((info: RequestedInfo, idx: number) => {
            isSameRng = JSON.stringify(info.indexes) === JSON.stringify(indexes);
            if (isSameRng || resolved) {
                if (idx === 0) {
                    info.deferred.resolve();
                    cnt++;
                    resolved = true;
                } else {
                    if (resolved && (info.isLoaded || !info.isNotLoaded)) {
                        info.deferred.resolve();
                        cnt++;
                    } else if (isSameRng && resolved) {
                        info.deferred.resolve();
                        cnt++;
                    } else if (isSameRng) {
                        info.isLoaded = true;
                    } else {
                        resolved = false;
                    }
                }
            }
        });
        this.requestedInfo.splice(0, cnt);
    }

    private getCellDataFromProp(prop: CellModel | string): CellModel {
        const data: CellModel = {};
        if (Object.prototype.toString.call(prop) === '[object Object]') {
            if ((<CellModel>prop).formula) {
                data.formula = (<CellModel>prop).formula;
            } else if (!isNullOrUndefined((<CellModel>prop).value)) {
                if (typeof ((<CellModel>prop).value) === 'string') {
                    if ((<CellModel>prop).value.indexOf('http://') === 0 || (<CellModel>prop).value.indexOf('https://') === 0 ||
                        (<CellModel>prop).value.indexOf('ftp://') === 0 || (<CellModel>prop).value.indexOf('www.') === 0) {
                        data.hyperlink = (<CellModel>prop).value;
                        data.style = { textDecoration: 'underline', color: '#00e' };
                    } else {
                        data.value = (<CellModel>prop).value;
                    }
                } else {
                    data.value = (<CellModel>prop).value;
                }
            }
        } else {
            if (checkIsFormula(<string>prop)) {
                data.formula = <string>prop;
            } else {
                if (typeof ((<string>prop)) === 'string') {
                    if ((<string>prop).indexOf('http://') === 0 || (<string>prop).indexOf('https://') === 0 ||
                        (<string>prop).indexOf('ftp://') === 0 || (<string>prop).indexOf('www.') === 0) {
                        data.hyperlink = <string>prop;
                        data.style = { textDecoration: 'underline', color: '#00e' };
                    } else {
                        data.value = <string>prop;
                    }
                } else {
                    data.value = <string>prop;
                }
            }
        }
        return data;
    }

    private getLoadedInfo(sRange: number, eRange: number, range: ExtendedRange): { isNotLoaded: boolean, unloadedRange: number[] } {
        let isNotLoaded: boolean = true;
        range.info.loadedRange.forEach((range: number[]) => {
            if (range[0] <= sRange && sRange <= range[1]) {
                if (range[0] <= eRange && eRange <= range[1]) {
                    isNotLoaded = false;
                } else {
                    sRange = range[1] + 1;
                }
            } else if (range[0] <= eRange && eRange <= range[1]) {
                eRange = range[0] - 1;
            }
        });
        return { isNotLoaded: isNotLoaded, unloadedRange: [sRange, eRange] };
    }

    private getMaxCount(range: ExtendedRange): number {
        if (range.query) {
            const query: QueryOptions[] = range.query.queries;
            for (let i: number = 0; i < query.length; i++) {
                if (query[i as number].fn === 'onTake') {
                    return Math.min(query[i as number].e.nos, range.info.count || query[i as number].e.nos);
                }
            }
        }
        return range.info.count;
    }

    private initRangeInfo(range: ExtendedRange): void {
        if (!range.info) {
            range.info = { loadedRange: [] };
        }
    }

    /**
     * Remove old data from sheet.
     *
     * @param {Object} args - Specify the args.
     * @param {number} args.sheetIdx - Specify the sheetIdx.
     * @param {number} args.rangeIdx - Specify the rangeIdx.
     * @param {Object[]} args.changedData - Specify the changedData.
     * @returns {void} - Remove old data from sheet.
     */
    private dataSourceChangedHandler(args: { sheetIdx: number, rangeIdx: number, changedData: Object[] }): void {
        let row: RowModel;
        const sheet: SheetModel = this.parent.sheets[args.sheetIdx];
        const range: ExtendedRange = sheet.ranges[args.rangeIdx];
        if (range && (this.checkRangeHasChanges(sheet, args.rangeIdx) || !range.info)) {
            const showFieldAsHeader: boolean = range.showFieldAsHeader;
            const indexes: number[] = getCellIndexes(range.startCell);
            if (range.info) {
                range.info.loadedRange.forEach((loadedRange: number[]) => {
                    for (let i: number = loadedRange[0]; i <= loadedRange[1] && (i < range.info.count + (showFieldAsHeader ? 1 : 0)); i++) {
                        row = sheet.rows[i + indexes[0]];
                        if (row) {
                            for (let j: number = indexes[1]; j < indexes[1] + range.info.fldLen; j++) {
                                if (row.cells && row.cells[j as number]) {
                                    delete row.cells[j as number];
                                }
                            }
                        }
                    }
                });
                range.info = null;
            }
            interface Viewport { topIndex: number; bottomIndex: number; leftIndex: number; rightIndex: number; }
            const viewport: Viewport = (this.parent as unknown as { viewport: Viewport }).viewport;
            const refreshRange: number[] = [viewport.topIndex, viewport.leftIndex, viewport.bottomIndex, viewport.rightIndex];
            const eventArgs: { sheet: ExtendedSheet, indexes: number[], promise: Promise<CellModel>, dataSourceChange?: boolean } = {
                sheet: sheet as ExtendedSheet, indexes: refreshRange, dataSourceChange: true, promise:
                    new Promise((resolve: Function) => { resolve((() => { /** */ })()); })
            };
            this.updateSheetFromDataSourceHandler(eventArgs);
            eventArgs.promise.then(() => {
                this.parent.trigger(
                    'dataSourceChanged', { data: args.changedData, action: 'dataSourceChanged', rangeIndex: args.rangeIdx,
                        sheetIndex: args.sheetIdx });
                this.parent.notify('updateView', { indexes: refreshRange, checkWrap: true, checkCF: true });
            });
        }
    }

    private checkRangeHasChanges(sheet: SheetModel, rangeIdx: number): boolean {
        if (this.parent.isAngular) {
            if (sheet['changedRangeIdx'] === rangeIdx) {
                delete sheet['changedRangeIdx'];
                return true;
            }
            return false;
        } else {
            return true;
        }
    }

    /**
     * Triggers dataSourceChange event when cell data changes
     *
     * @param {Object} args - Specify the args.
     * @param {number} args.sheetIdx - Specify the sheetIdx.
     * @param {number} args.activeSheetIndex - Specify the activeSheetIndex.
     * @param {string} args.address - Specify the address.
     * @param {number} args.startIndex - Specify the startIndex.
     * @param {number} args.endIndex - Specify the endIndex.
     * @param {string} args.modelType - Specify the modelType.
     * @param {RowModel[]} args.deletedModel - Specify the deletedModel.
     * @param {RowModel[]} args.model - Specify the model.
     * @param {string} args.insertType - Specify the insertType.
     * @param {number} args.index - Specify the index.
     * @param {string} args.type - Specify the type.
     * @param {boolean} args.isMethod - Specify the isMethod.
     * @param {string} args.fillRange - Specify the fill range.
     * @param {string} args.range - Specify the range.
     * @param {string} args.requestType - Specify the requestType.
     * @param {Object[]} args.data - Specify the data.
     * @param {boolean}  args.isDataRequest - Specify the isDataRequest.
     * @param {string} args.pastedRange - Specify the pasted range.
     * @param {boolean} args.skipFilterCheck - Specify the skip filter check.
     * @returns {void} - Triggers dataSourceChange event when cell data changes
     */
    private dataChangedHandler(args: {
        sheetIdx: number, activeSheetIndex: number, address: string, startIndex: number, endIndex: number, modelType: string,
        deletedModel: RowModel[], model: RowModel[], insertType: string, index: number, type: string, isMethod?: boolean, fillRange?: string
        range: string, requestType: string, data?: Object[], isDataRequest?: boolean, pastedRange: string,
        skipFilterCheck?: boolean
    }): void {
        const changedData: Object[] = [{}];
        let action: string;
        let cell: CellModel;
        let dataRange: number[];
        let startCell: number[];
        let inRange: boolean;
        let inRangeCut: boolean;
        let deleteRowDetails: { count: number, index: number };
        const sheetIdx: number = args.sheetIdx === undefined ? this.parent.activeSheetIndex : args.sheetIdx;
        const sheet: SheetModel = this.parent.sheets[sheetIdx as number];
        let cellIndices: number[];
        let cutIndices: number[];
        sheet.ranges.forEach((range: ExtendedRange, idx: number) => {
            if (range.dataSource) {
                let isNewRow: boolean;
                startCell = getCellIndexes(range.startCell);
                dataRange = [...startCell, startCell[0] + range.info.count + (range.showFieldAsHeader ? 0 : -1),
                    startCell[1] + range.info.fldLen - 1];
                if (args.modelType === 'Row' || args.modelType === 'Column') {
                    if (args.modelType === 'Column') {
                        if (args.insertType) {
                            inRange = dataRange[1] < args.index && dataRange[3] >= args.index;
                            cellIndices = [args.index];
                            if (!inRange) {
                                if ((dataRange[3] + 1 === args.index && args.insertType === 'after')) {
                                    args.model.forEach((): void => {
                                        range.info.flds.splice(args.index - startCell[1], 0, '');
                                    });
                                    range.info.fldLen += args.model.length;
                                } else if (dataRange[1] >= args.index) {
                                    range.startCell = getCellAddress(startCell[0], startCell[1] + args.model.length);
                                }
                            } else {
                                args.model.forEach((): void => {
                                    range.info.flds.splice(args.index - startCell[1], 0, '');
                                });
                                range.info.fldLen += args.model.length;
                            }
                        } else {
                            inRange = dataRange[1] <= args.startIndex && dataRange[3] >= args.startIndex;
                            if (inRange) {
                                for (let i: number = args.startIndex; i <= args.endIndex; i++) {
                                    if (i <= dataRange[3]) {
                                        range.info.flds.splice(args.startIndex, 1);
                                        range.info.fldLen -= 1;
                                    }
                                }
                            }
                        }
                        return;
                    } else {
                        if (args.insertType) {
                            inRange = ((!range.showFieldAsHeader && (args.insertType === 'above' || args.isMethod)) ? dataRange[0] <=
                                args.index : dataRange[0] < args.index) && dataRange[2] >= args.index;
                            cellIndices = [args.index];
                            if (!inRange) {
                                if ((dataRange[2] + 1 === args.index && args.insertType === 'below')) {
                                    isNewRow = true;
                                    range.info.count += args.model.length;
                                } else if (dataRange[0] >= args.index) {
                                    range.startCell = getCellAddress(startCell[0] + args.model.length, startCell[1]);
                                }
                            } else {
                                isNewRow = true;
                                range.info.count += args.model.length;
                            }
                            if (args.isMethod) { return; }
                        } else {
                            inRange = dataRange[0] <= args.startIndex && dataRange[2] >= args.startIndex;
                            if (args.isDataRequest) {
                                cellIndices = [args.startIndex, dataRange[1], args.startIndex, dataRange[1]];
                            } else {
                                action = 'delete';
                            }
                        }
                    }
                } else {
                    cellIndices = getRangeIndexes(
                        args.requestType && args.requestType.toLowerCase().includes('paste') ? args.pastedRange.split('!')[1] :
                            args.sheetIdx > -1 ? args.address : (args.address || args.range || args.fillRange).split('!')[1]);
                    const dataRangeIndices: number[] =
                        [...[range.showFieldAsHeader ? dataRange[0] + 1 : dataRange[0]], ...dataRange.slice(1, 4)];
                    if (range.showFieldAsHeader && cellIndices[0] === startCell[0]) {
                        for (let i: number = cellIndices[1]; i <= cellIndices[3]; i++) {
                            if (i >= dataRangeIndices[1] && i <= dataRangeIndices[3]) {
                                range.info.flds[i - startCell[1]] = getCell(startCell[0], i, sheet, false, true).value || '';
                            }
                        }
                    }
                    inRange = isInRange(dataRangeIndices, cellIndices, true);
                    if (args.requestType === 'paste' && (args as unknown as { copiedInfo: { isCut: boolean } }).copiedInfo.isCut) {
                        cutIndices = [].slice.call((args as unknown as { copiedInfo: { range: number[] } }).copiedInfo.range);
                        if (range.showFieldAsHeader && cutIndices[0] === startCell[0]) {
                            for (let i: number = cutIndices[1]; i <= cutIndices[3]; i++) {
                                if (i >= dataRangeIndices[1] && i <= dataRangeIndices[3]) {
                                    range.info.flds[i - startCell[1]] = '';
                                }
                            }
                            inRange = false;
                        }
                        inRangeCut = isInRange(dataRangeIndices, cutIndices, true);
                    }
                }
                if (inRange || isNewRow || inRangeCut) {
                    if (args.modelType === 'Row' && !args.insertType && !args.isDataRequest) {
                        args.deletedModel.forEach((row: RowModel, rowIdx: number) => {
                            changedData[rowIdx as number] = {};
                            range.info.flds.forEach((fld: string, idx: number) => {
                                if (row.cells) {
                                    cell = row.cells[startCell[1] + idx];
                                    changedData[rowIdx as number][`${fld}`] = this.getFormattedValue(cell);
                                } else {
                                    changedData[rowIdx as number][`${fld}`] = null;
                                }
                            });
                            range.info.count -= 1;
                        });
                        if (args.isMethod) { return; }
                        deleteRowDetails = { count: args.deletedModel.length, index: args.endIndex };
                    } else {
                        action = isNewRow ? 'add' : 'edit';
                        let addedCutData: number = 0;
                        if (inRangeCut) {
                            addedCutData = cutIndices[2] - cutIndices[0] + 1;
                            for (let i: number = 0; i < addedCutData; i++) {
                                changedData[i as number] = {};
                                range.info.flds.forEach((fld: string, idx: number) => {
                                    if (fld) {
                                        cell = getCell(cutIndices[0] + i, startCell[1] + idx, sheet);
                                        changedData[i as number][`${fld}`] = this.getFormattedValue(cell);
                                    }
                                });
                            }
                        }
                        if (inRange || isNewRow) {
                            const filterCheck: boolean = !args.isDataRequest && !inRangeCut && !isNewRow && !args.skipFilterCheck;
                            for (let i: number = 0, count: number = 0; i < (isNewRow ? args.model.length : (cellIndices[2] - cellIndices[0])
                                + 1 || 1); i++) {
                                if (filterCheck && isFilterHidden(sheet, cellIndices[0] + i)) { continue; }
                                changedData[count + addedCutData] = {};
                                range.info.flds.forEach((fld: string, idx: number) => {
                                    if (fld) {
                                        cell = getCell(cellIndices[0] + i, startCell[1] + idx, sheet);
                                        changedData[count + addedCutData][`${fld}`] = this.getFormattedValue(cell);
                                    }
                                });
                                count++;
                            }
                        }
                    }
                    if (args.isDataRequest) {
                        args.data = changedData;
                    } else {
                        this.parent.trigger(
                            'dataSourceChanged', { data: changedData, action: action, rangeIndex: idx, sheetIndex: sheetIdx });
                    }
                } else if (deleteRowDetails && deleteRowDetails.count && dataRange[0] > deleteRowDetails.index) {
                    range.startCell = getCellAddress(startCell[0] - deleteRowDetails.count, startCell[1]);
                }
            }
        });
    }

    private getFormattedValue(cell: CellModel): string {
        const value: string = this.parent.getDisplayText(cell);
        if (value === '') {
            return null;
        } else if (cell && !cell.format && typeof cell.value === 'number') {
            return cell.value;
        }
        return value;
    }

    private triggerDataChangeHandler(args: {
        action: string, isUndo: boolean, isUndoRedo?: boolean, eventArgs: {
            modelType: string, type: string, index: number,
            startIndex: number, endIndex: number, model: object[], deletedModel: object[], insertType: string, requestType: string
        }
    }): void {
        const dataChangingActions: string[] = ['insert', 'delete', 'edit', 'cellDelete', 'cellSave', 'autofill', 'clipboard', 'clear'];
        let triggerDataChange: boolean = true;
        if ((args.action === 'delete' || args.action === 'insert') && ['Sheet'].indexOf(args.eventArgs.modelType) > -1) {
            triggerDataChange = false;
        } else if (args.action === 'clear' && ['Clear Formats', 'Clear Hyperlinks'].indexOf(args.eventArgs.type) > -1) {
            triggerDataChange = false;
        } else if (args.action === 'clipboard' && args.eventArgs.requestType === 'Formats') {
            triggerDataChange = false;
        }
        if (triggerDataChange && dataChangingActions.indexOf(args.action) > -1) {
            let evtArgs: { [key: string]: object | object[] | boolean | string | number };
            if (args.isUndo && (args.action === 'delete' || args.action === 'insert')) {
                evtArgs = extend({}, args.eventArgs) as { [key: string]: object | object[] | boolean | string | number };
                if (args.action === 'delete') {
                    evtArgs.index = evtArgs.startIndex;
                    evtArgs.model = evtArgs.deletedModel;
                    evtArgs.insertType = 'below';
                } else {
                    evtArgs.startIndex = evtArgs.index;
                    evtArgs.endIndex = args.eventArgs.index + args.eventArgs.model.length - 1;
                    evtArgs.deletedModel = evtArgs.model;
                    delete evtArgs.insertType;
                }
            } else {
                evtArgs = args.eventArgs;
            }
            this.parent.notify(dataChanged, evtArgs);
        }
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {string} - Get the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'dataBind';
    }

    /**
     * Destroys the Data binding module.
     *
     * @returns {void} - Destroys the Data binding module.
     */
    public destroy(): void {
        this.removeEventListener();
        this.parent = null;
        this.requestedInfo = [];
    }
}

interface RequestedInfo {
    deferred: Deferred;
    indexes: number[];
    isLoaded?: boolean;
    isNotLoaded?: boolean;
}
