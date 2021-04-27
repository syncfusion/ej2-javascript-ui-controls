import { DataManager, Query, Deferred, ReturnOption, QueryOptions } from '@syncfusion/ej2-data';
import { Workbook, getCell, CellModel, RowModel, SheetModel, setCell } from '../base/index';
import { getRangeIndexes, checkIsFormula, updateSheetFromDataSource, checkDateFormat, dataSourceChanged } from '../common/index';
import { ExtendedSheet, ExtendedRange, AutoDetectInfo, getCellIndexes, dataChanged, getCellAddress, isInRange } from '../common/index';
import { triggerDataChange } from '../common/index';
import { getFormatFromType } from './number-format';

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
     * @returns {void} - Update given data source to sheet.
     */
    // eslint-disable-next-line
    private updateSheetFromDataSourceHandler(args: { sheet: ExtendedSheet, indexes: number[], promise: Promise<CellModel>, rangeSettingCount?: number[] }): void {
        let cell: CellModel; let flds: string[]; let sCellIdx: number[];
        let result: Object[]; let remoteUrl: string; let isLocal: boolean; let dataManager: DataManager;
        const requestedRange: boolean[] = []; const sRanges: number[] = []; let rowIdx: number;
        const deferred: Deferred = new Deferred(); let sRowIdx: number; let sColIdx: number;
        let loadedInfo: { isNotLoaded: boolean, unloadedRange: number[] };
        args.promise = deferred.promise;
        if (args.sheet && args.sheet.ranges.length) {
            for (let k: number = args.sheet.ranges.length - 1; k >= 0; k--) {
                let sRange: number = args.indexes[0]; let eRange: number = args.indexes[2];
                const range: ExtendedRange = args.sheet.ranges[k];
                sRowIdx = getRangeIndexes(range.startCell)[0];
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
                if (sRange > count) {
                    isEndReached = true;
                } else if (eRange > count) {
                    eRange = count;
                }
                this.requestedInfo.push({ deferred: deferred, indexes: args.indexes, isNotLoaded: loadedInfo.isNotLoaded });
                if (sRange >= 0 && loadedInfo.isNotLoaded && !isEndReached) {
                    sRanges[k] = sRange; requestedRange[k] = false;
                    const query: Query = (range.query ? range.query : new Query()).clone();
                    dataManager.executeQuery(query.range(sRange, eRange >= count ? eRange : eRange + 1)
                        .requiresCount()).then((e: ReturnOption) => {
                        if (!this.parent || this.parent.isDestroyed) { return; }
                        result = (e.result && e.result.result ? e.result.result : e.result) as Object[];
                        sCellIdx = getRangeIndexes(range.startCell);
                        sRowIdx = sCellIdx[0]; sColIdx = sCellIdx[1];
                        if (result && result.length) {
                            if (!range.info.count) { count = e.count; range.info.count = e.count; }
                            flds = Object.keys(result[0]);
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
                            if (sRanges[k] === 0 && range.showFieldAsHeader) {
                                rowIdx = sRowIdx + sRanges[k] + insertRowCount;
                                flds.forEach((field: string, i: number) => {
                                    cell = getCell(rowIdx, sColIdx + i, args.sheet, true);
                                    if (!cell) {
                                        args.sheet.rows[sRowIdx + sRanges[k]].cells[sColIdx + i] = field.includes('emptyCell') ? {}
                                            : { value: field };
                                    } else if (!cell.value && !field.includes('emptyCell')) {
                                        cell.value = field;
                                    }
                                });
                            }
                            result.forEach((item: { [key: string]: string }, i: number) => {
                                rowIdx = sRowIdx + sRanges[k] + i + (range.showFieldAsHeader ? 1 : 0) + insertRowCount;
                                for (let j: number = 0; j < flds.length; j++) {
                                    cell = getCell(rowIdx, sColIdx + j, args.sheet, true);
                                    if (cell) {
                                        if (!cell.value && !flds[j].includes('emptyCell')) {
                                            setCell(rowIdx, sColIdx + j, args.sheet, this.getCellDataFromProp(item[flds[j]]), true);
                                        }
                                    } else {
                                        args.sheet.rows[rowIdx].cells[sColIdx + j] =
                                            flds[j].includes('emptyCell') ? {} : this.getCellDataFromProp(item[flds[j]]);
                                    }
                                    this.checkDataForFormat({
                                        args: args, cell: cell, colIndex: sColIdx + j, rowIndex: rowIdx, i: i, j: j, k: k,
                                        range: range, sRanges: sRanges, value: item[flds[j]]
                                    });
                                }
                            });
                        } else {
                            flds = [];
                        }
                        args.sheet.usedRange.rowIndex = Math.max(
                            (sRowIdx + (count || e.count) + (range.showFieldAsHeader ? 1 : 0) + insertRowCount) - 1,
                            args.sheet.usedRange.rowIndex);
                        args.sheet.usedRange.colIndex = Math.max(sColIdx + flds.length - 1, args.sheet.usedRange.colIndex);
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
                        requestedRange[k] = true;
                        if (requestedRange.indexOf(false) === -1) {
                            if (eRange + sRowIdx < sRowIdx + range.info.count) {
                                if (!args.rangeSettingCount) { args.rangeSettingCount = []; }
                                args.rangeSettingCount.push(k);
                                //if (remoteUrl) {
                                const unloadedArgs: { sheet: ExtendedSheet, indexes: number[], promise: Promise<CellModel>,
                                    rangeSettingCount?: number[] } = {
                                    sheet: args.sheet, indexes: [0, 0, args.sheet.usedRange.rowIndex, args.sheet.usedRange.colIndex],
                                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                    promise: new Promise((resolve: Function, reject: Function) => { resolve((() => { /** */ })()); }),
                                    rangeSettingCount: args.rangeSettingCount
                                };
                                this.updateSheetFromDataSourceHandler(unloadedArgs);
                                unloadedArgs.promise.then((): void => {
                                    if (this.parent.getModuleName() === 'workbook') { return; }
                                    args.rangeSettingCount.pop();
                                    if (!args.rangeSettingCount.length) { this.parent.notify('created', null); }
                                });
                                //}
                            }
                            this.checkResolve(args.indexes);
                        }
                    });
                } else if (k === 0 && requestedRange.indexOf(false) === -1) {
                    this.checkResolve(args.indexes);
                }
            }
        } else { deferred.resolve(); }
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
            } else if ((<CellModel>prop).value) {
                if (typeof ((<CellModel>prop).value) === 'string') {
                    if ((<CellModel>prop).value.indexOf('http://') === 0 || (<CellModel>prop).value.indexOf('https://') === 0 ||
                        (<CellModel>prop).value.indexOf('ftp://') === 0 || (<CellModel>prop).value.indexOf('www.') === 0) {
                        data.hyperlink = (<CellModel>prop).value;
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

    private checkDataForFormat(args: AutoDetectInfo): void {
        if (args.value !== '') {
            const dateEventArgs: { [key: string]: string | number | boolean } = {
                value: args.value,
                rowIndex: args.rowIndex,
                colIndex: args.colIndex,
                isDate: false,
                updatedVal: args.value,
                isTime: false
            };
            this.parent.notify(checkDateFormat, dateEventArgs);
            if (dateEventArgs.isDate) {
                if (args.cell) {
                    args.cell.format = getFormatFromType('ShortDate');
                    args.cell.value = <string>dateEventArgs.updatedVal;
                } else {
                    args.args.sheet.rows[args.rowIndex]
                        .cells[args.colIndex].format = getFormatFromType('ShortDate');
                    args.args.sheet.rows[args.rowIndex]
                        .cells[args.colIndex].value = <string>dateEventArgs.updatedVal;
                }
            } else if (dateEventArgs.isTime) {
                if (args.cell) {
                    args.cell.format = getFormatFromType('Time');
                    args.cell.value = <string>dateEventArgs.updatedVal;
                } else {
                    args.args.sheet.rows[args.rowIndex]
                        .cells[args.colIndex].format = getFormatFromType('Time');
                    args.args.sheet.rows[args.rowIndex]
                        .cells[args.colIndex].value = <string>dateEventArgs.updatedVal;
                }
            }
        }
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
                if (query[i].fn === 'onTake') {
                    return Math.min(query[i].e.nos, range.info.count || query[i].e.nos);
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
     * @param {Workbook} args.oldProp - Specify the oldProp.
     * @param {string} args.sheetIdx - Specify the sheetIdx.
     * @param {string} args.rangeIdx - Specify the rangeIdx.
     * @param {boolean} args.isLastRange - Specify the isLastRange.
     * @returns {void} - Remove old data from sheet.
     */
    private dataSourceChangedHandler(args: { oldProp: Workbook, sheetIdx: string, rangeIdx: string, isLastRange: boolean }): void {
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
                                if (row.cells && row.cells[j]) {
                                    delete row.cells[j];
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
            const args: { sheet: ExtendedSheet, indexes: number[], promise: Promise<CellModel> } = {
                sheet: sheet as ExtendedSheet, indexes: refreshRange, promise:
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    new Promise((resolve: Function, reject: Function) => { resolve((() => { /** */ })()); })
            };
            this.updateSheetFromDataSourceHandler(args);
            args.promise.then(() => {
                this.parent.notify('updateView', { indexes: refreshRange });
            });
        }
    }

    private checkRangeHasChanges(sheet: SheetModel, rangeIdx: string): boolean {
        if ((this.parent as unknown as { isAngular: boolean }).isAngular) {
            const changedRangeIdx: string = 'changedRangeIdx';
            if (sheet[changedRangeIdx] === parseInt(rangeIdx, 10)) {
                delete sheet[changedRangeIdx];
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
     * @param {string} args.pastedRange - Specify the pasted range.
     * @param {string} args.range - Specify the range.
     * @param {boolean}  args.isUndoRedo - Specify the boolean value.
     * @param {string} args.requestType - Specify the requestType.
     * @returns {void} - Triggers dataSourceChange event when cell data changes
     */
    private dataChangedHandler(args: {
        sheetIdx: number, activeSheetIndex: number, address: string, startIndex: number, endIndex: number, modelType: string,
        deletedModel: RowModel[], model: RowModel[], insertType: string, index: number, type: string, pastedRange: string,
        range: string, isUndoRedo: boolean, requestType: string
    }): void {
        const changedData: Object[] = [{}];
        let action: string;
        let cell: CellModel;
        let dataRange: number[];
        let startCell: number[];
        let inRange: boolean;
        let inRangeCut: boolean;
        let deleteRowDetails: { count: number, index: number };
        const sheetIdx: number = this.parent.activeSheetIndex;
        const sheet: SheetModel = this.parent.sheets[sheetIdx];
        let cellIndices: number[];
        let cutIndices: number[];
        sheet.ranges.forEach((range: ExtendedRange, idx: number) => {
            if (range.dataSource) {
                let isNewRow: boolean;
                startCell = getCellIndexes(range.startCell);
                dataRange = [...startCell, startCell[0] + range.info.count + (range.showFieldAsHeader ? 0 : -1),
                    startCell[1] + range.info.fldLen - 1];
                if (args.modelType === 'Row') {
                    if (args.insertType) {
                        inRange = ((!range.showFieldAsHeader && args.insertType === 'above') ? dataRange[0] <= args.index
                            : dataRange[0] < args.index) && dataRange[2] >= args.index;
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
                    } else {
                        inRange = dataRange[0] <= args.startIndex && dataRange[2] >= args.startIndex;
                        action = 'delete';
                    }
                } else {
                    cellIndices = getRangeIndexes(args.requestType === 'paste' ? args.pastedRange.split('!')[1] : args.sheetIdx > -1 ? args.address : (args.address || args.range).split('!')[1]);
                    const dataRangeIndices: number[] =
                        [...[range.showFieldAsHeader ? dataRange[0] + 1 : dataRange[0]], ...dataRange.slice(1, 4)];
                    inRange = isInRange(dataRangeIndices, cellIndices, true);
                    if (args.requestType === 'paste' && (args as unknown as { copiedInfo: { isCut: boolean } }).copiedInfo.isCut) {
                        cutIndices = [].slice.call((args as unknown as { copiedInfo: { range: number[] } }).copiedInfo.range);
                        inRangeCut = isInRange(dataRangeIndices, cutIndices, true);
                    }
                }
                if (inRange || isNewRow || inRangeCut) {
                    if (args.modelType === 'Row' && !args.insertType) {
                        args.deletedModel.forEach((row: RowModel, rowIdx: number) => {
                            changedData[rowIdx] = {};
                            range.info.flds.forEach((fld: string, idx: number) => {
                                if (row.cells) {
                                    cell = row.cells[startCell[1] + idx];
                                    changedData[rowIdx][fld] = (cell && cell.value) || null;
                                } else {
                                    changedData[rowIdx][fld] = null;
                                }
                            });
                            range.info.count -= 1;
                        });
                        deleteRowDetails = { count: args.deletedModel.length, index: args.endIndex };
                    } else {
                        action = isNewRow ? 'add' : 'edit';
                        let addedCutData: number = 0;
                        if (inRangeCut) {
                            addedCutData = cutIndices[2] - cutIndices[0] + 1;
                            for (let i: number = 0; i < addedCutData; i++) {
                                changedData[i] = {};
                                range.info.flds.forEach((fld: string, idx: number) => {
                                    cell = getCell(cutIndices[0] + i, startCell[1] + idx, sheet);
                                    changedData[i][fld] = (cell && cell.value) || null;
                                });
                            }
                        }
                        if (inRange || isNewRow) {
                            for (let i: number = 0; i < (isNewRow ? args.model.length : (cellIndices[2] - cellIndices[0]) + 1 || 1); i++) {
                                changedData[i + addedCutData] = {};
                                range.info.flds.forEach((fld: string, idx: number) => {
                                    cell = getCell(cellIndices[0] + i, startCell[1] + idx, sheet);
                                    changedData[i + addedCutData][fld] = (cell && cell.value) || null;
                                });
                            }
                        }
                    }
                    this.parent.trigger('dataSourceChanged', { data: changedData, action: action, rangeIndex: idx, sheetIndex: sheetIdx });
                } else if (deleteRowDetails && deleteRowDetails.count && dataRange[0] > deleteRowDetails.index) {
                    range.startCell = getCellAddress(startCell[0] - deleteRowDetails.count, startCell[1]);
                }
            }
        });
    }

    private triggerDataChangeHandler(args: {
        action: string, isUndo: boolean, eventArgs: {
            modelType: string, type: string, index: number,
            startIndex: number, endIndex: number, model: object[], deletedModel: object[], insertType: string, requestType: string
        }
    }): void {
        const dataChangingActions: string[] = ['insert', 'delete', 'edit', 'cellDelete', 'cellSave', 'clipboard', 'clear'];
        let triggerDataChange: boolean = true;
        if ((args.action === 'delete' || args.action === 'insert') && ['Column', 'Sheet'].indexOf(args.eventArgs.modelType) > -1) {
            triggerDataChange = false;
        } else if (args.action === 'clear' && ['Clear Formats', 'Clear Hyperlinks'].indexOf(args.eventArgs.type) > -1) {
            triggerDataChange = false;
        } else if (args.action === 'clipboard' && args.eventArgs.requestType === 'Formats') {
            triggerDataChange = false;
        }
        if (args.isUndo && (args.action === 'delete' || args.action === 'insert')) {
            if (args.action === 'delete') {
                args.eventArgs.index = args.eventArgs.startIndex;
                args.eventArgs.model = args.eventArgs.deletedModel;
                args.eventArgs.insertType = 'below';
            } else {
                args.eventArgs.startIndex = args.eventArgs.index;
                args.eventArgs.endIndex = args.eventArgs.index + args.eventArgs.model.length - 1;
                args.eventArgs.deletedModel = args.eventArgs.model;
                delete args.eventArgs.insertType;
            }
        }
        if (triggerDataChange && dataChangingActions.indexOf(args.action) > -1) {
            this.parent.notify(dataChanged, args.eventArgs);
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
