import { Browser, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Group } from '@syncfusion/ej2-data';
import { IModelGenerator, IGrid, VirtualInfo, NotifyArgs } from '../base/interface';
import { Row } from '../models/row';
import { Cell } from '../models/cell';
import { getRowIndexFromElement, isGroupAdaptive, checkIsVirtual, getVisiblePage } from '../base/util';
import { Column } from '../models/column';
import { PageSettingsModel } from '../models/page-settings-model';
import { RowModelGenerator } from '../services/row-model-generator';
import { GroupModelGenerator } from '../services/group-model-generator';
import * as events from '../base/constant';
import * as literals from '../base/string-literals';

/**
 * Content module is used to render grid content
 */
export class VirtualRowModelGenerator implements IModelGenerator<Column> {

    private model: PageSettingsModel;
    public recordsCount: number;
    public rowModelGenerator: IModelGenerator<Column>;
    public parent: IGrid;
    public cOffsets: { [x: number]: number } = {};
    public cache: { [x: number]: Row<Column>[] } = {};
    public rowCache: { [x: number]: Row<Column> } = {};
    public data: { [x: number]: Object[] } = {};
    public groups: { [x: number]: Object } = {};
    public currentInfo: VirtualInfo = {};
    private prevInfo: VirtualInfo = {};
    public includePrevPage: boolean;
    public startIndex: number;

    constructor(parent: IGrid) {
        this.parent = parent;
        this.model = this.parent.pageSettings;
        this.rowModelGenerator = this.parent.allowGrouping ? new GroupModelGenerator(this.parent) : new RowModelGenerator(this.parent);
    }

    private columnInfiniteRows(data: Object[], e?: NotifyArgs): Row<Column>[] {
        let result: Row<Column>[] = [];
        if (e.requestType === 'virtualscroll') {
            const rows: Row<Column>[] = this.parent.getRowsObject();
            // eslint-disable-next-line prefer-spread
            result.push.apply(result, this.rowModelGenerator.refreshRows(rows));
            if (this.parent.infiniteScrollSettings.enableCache) {
                const currentRowStartIndex: number = this.parent.frozenRows && this.parent.pageSettings.currentPage === 1 ? 0
                    : getRowIndexFromElement(this.parent.getContentTable().querySelector('.e-row:not(.e-addedrow)'));
                let newResult: Row<Column>[] = result
                    .slice(currentRowStartIndex, currentRowStartIndex + (this.parent.pageSettings.pageSize * 3));
                if (this.parent.frozenRows && this.parent.pageSettings.currentPage !== 1) {
                    newResult = [...result.slice(0, this.parent.frozenRows), ...newResult];
                }
                result = newResult;
            }
        } else {
            // eslint-disable-next-line prefer-spread
            result.push.apply(result, this.rowModelGenerator.generateRows(data, e));
        }
        return result;
    }

    public generateRows(data: Object[], e?: NotifyArgs): Row<Column>[] {
        if (this.parent.enableColumnVirtualization && this.parent.enableInfiniteScrolling) {
            return this.columnInfiniteRows(data, e);
        }
        let isManualRefresh: boolean = false;
        const info: VirtualInfo = e.virtualInfo = e.virtualInfo
            || ((e.requestType === 'sorting' || e.requestType === 'delete') && checkIsVirtual(this.parent) && this.prevInfo)
            || this.getData();
        this.prevInfo = info;
        const xAxis: boolean = info.sentinelInfo && info.sentinelInfo.axis === 'X';
        const page: number = !xAxis && info.loadNext && !info.loadSelf ? info.nextInfo.page : info.page;
        let result: Row<Column>[] = [];
        let indexes: number[] = this.getBlockIndexes(page); const loadedBlocks: number[] = [];
        if (this.currentInfo.blockIndexes) {
            indexes = info.blockIndexes = e.virtualInfo.blockIndexes = this.includePrevPage ? this.currentInfo.blockIndexes.slice(1)
                : this.currentInfo.blockIndexes.slice(0, this.currentInfo.blockIndexes.length - 1);
            isManualRefresh = true;
        }
        this.checkAndResetCache(e.requestType);
        if (isGroupAdaptive(this.parent) && this.parent.vcRows.length) {
            const dataRows: Row<Column>[] = this.parent.vcRows.filter((row: Row<Column>) => row.isDataRow);
            if ((this.parent.isManualRefresh && dataRows.length === data['records'].length) || !this.parent.isManualRefresh) {
                return result = this.parent.vcRows;
            }
        }
        if (this.parent.enableColumnVirtualization) {
            for (let i: number = 0; i < info.blockIndexes.length; i++) {
                if (this.isBlockAvailable(info.blockIndexes[parseInt(i.toString(), 10)])) {
                    this.cache[info.blockIndexes[parseInt(i.toString(), 10)]] =
                        this.rowModelGenerator.refreshRows(this.cache[info.blockIndexes[parseInt(i.toString(), 10)]]);
                }
            }
        }
        const values: number[] = info.blockIndexes;
        for (let i: number = 0; i < values.length; i++) {
            if (!this.isBlockAvailable(values[parseInt(i.toString(), 10)])) {
                let startIdx: number = !isNullOrUndefined(this.startIndex) && !isNaN(this.startIndex) ? this.startIndex :
                    this.getStartIndex(values[parseInt(i.toString(), 10)], data);
                startIdx = isGroupAdaptive(this.parent) && !this.parent.vcRows.length && (e.requestType === 'sorting'
                    || e.requestType === 'delete') ? 0 : startIdx;
                const rows: Row<Column>[] = this.rowModelGenerator.generateRows(data, {
                    virtualInfo: info, startIndex: startIdx
                });
                if (isGroupAdaptive(this.parent) && !this.parent.vcRows.length) {
                    this.recordsCount = (<{records?: Object[]}>data).records.length;
                    this.parent.vRows = rows;
                    this.parent.vcRows = rows;
                    this.parent.notify(events.refreshVirtualMaxPage, {});
                }
                let median: number;
                const isTreeGrid: string = 'isTreeGrid';
                if (isGroupAdaptive(this.parent)) {
                    this.getGroupVirtualRecordsByIndex(rows);
                } else {
                    if (isManualRefresh) {
                        this.setBlockForManualRefresh(this.cache, indexes, rows);
                    } else if (((e.requestType === 'sorting' || e.requestType === 'delete') || (this.parent[`${isTreeGrid}`] && this.parent.getDataModule().isRemote() && e.requestType === 'refresh')) && checkIsVirtual(this.parent)) {
                        const visiblePage: number[] = getVisiblePage(info.blockIndexes);
                        let prevEndIndex: number = 0;
                        for (let i: number = 0; i < visiblePage.length; i++) {
                            const indexes: number[] = this.getBlockIndexes(visiblePage[parseInt(i.toString(), 10)]);
                            let startIndex: number = this.model.pageSize * i;
                            let endIndex: number = startIndex + this.model.pageSize;
                            if (this.parent.allowGrouping && this.parent.groupSettings.columns.length) {
                                const dataRowObject: Row<Column>[] = rows.filter((row: Row<Column>) => row.isDataRow)
                                    .slice(startIndex, endIndex);
                                startIndex = prevEndIndex;
                                endIndex = rows.indexOf(dataRowObject[dataRowObject.length - 1]) + 1;
                            }
                            const pageRecord: Row<Column>[] = rows.slice(startIndex, endIndex);
                            const median: number = ~~Math.max(pageRecord.length, this.model.pageSize) / 2;
                            if (!this.isBlockAvailable(indexes[0])) {
                                this.cache[indexes[0]] = pageRecord.slice(0, median);
                            }
                            if (!this.isBlockAvailable(indexes[1])) {
                                this.cache[indexes[1]] = pageRecord.slice(median);
                            }
                            prevEndIndex = endIndex;
                        }
                    } else {
                        median = ~~Math.max(rows.length, this.model.pageSize) / 2;
                        if (!this.isBlockAvailable(indexes[0])) {
                            this.cache[indexes[0]] = rows.slice(0, median);
                        }
                        if (!this.isBlockAvailable(indexes[1])) {
                            this.cache[indexes[1]] = rows.slice(median);
                        }
                    }
                }
            }
            if (this.parent.groupSettings.columns.length && !xAxis && this.cache[values[parseInt(i.toString(), 10)]] &&
                !this.parent.groupSettings.enableLazyLoading) {
                this.cache[values[parseInt(i.toString(), 10)]] =
                    this.updateGroupRow(this.cache[values[parseInt(i.toString(), 10)]], values[parseInt(i.toString(), 10)]);
            }
            if (!e.renderMovableContent && !e.renderFrozenRightContent && this.cache[values[parseInt(i.toString(), 10)]]) {
                // eslint-disable-next-line prefer-spread
                result.push.apply(result, this.cache[values[parseInt(i.toString(), 10)]]);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const DataRecord: any = [];
                if (this.parent.enableVirtualization && this.parent.groupSettings.columns.length) {
                    result.forEach((data: Row<Column>) => {
                        if (!DataRecord.includes(data)) {
                            DataRecord.push(data);
                        }
                    });
                }
                result = DataRecord.length ? DataRecord : result;
            }
            if (this.isBlockAvailable(values[parseInt(i.toString(), 10)])) {
                loadedBlocks.push(values[parseInt(i.toString(), 10)]);
            }
        }
        if (isGroupAdaptive(this.parent) && this.parent.vcRows.length && e.requestType === 'sorting'
            && (<{top?: number}>e.scrollTop).top !== 0) {
            return result = this.parent.vcRows;
        }
        info.blockIndexes = loadedBlocks;
        const grouping: string = 'records';
        if (this.parent.allowGrouping && this.parent.groupSettings.columns.length) {
            this.parent.currentViewData[`${grouping}`] = result.map((m: Row<Column>) => m.data);
        } else {
            this.parent.currentViewData = result.map((m: Row<Column>) => m.data);
        }
        if (e.requestType === 'grouping') {
            this.parent.currentViewData[`${grouping}`] = this.parent.currentViewData[`${grouping}`].filter((item: Object, index: number) =>
                this.parent.currentViewData[`${grouping}`].indexOf(item) === index);
        }
        if (isGroupAdaptive(this.parent) && this.parent.vcRows.length) {
            if (['save', 'delete'].some((value: string) => { return e.requestType === value; })) {
                return result = this.parent.vcRows;
            }
        }
        return result;
    }

    private setBlockForManualRefresh(cache: { [x: number]: Row<Column>[] }, blocks: number[], rows: Row<Column>[]): void {
        const size: number = this.model.pageSize / 2;
        if (this.includePrevPage) {
            cache[blocks[0] - 1] = rows.slice(0, size);
            cache[blocks[0]] = rows.slice(size, size * 2);
            cache[blocks[1]] = rows.slice(size * 2, size * 3);
            cache[blocks[2]] = rows.slice(size * 3, size * 4);
        } else {
            cache[blocks[0]] = rows.slice(0, size);
            cache[blocks[1]] = rows.slice(size, size * 2);
            cache[blocks[2]] = rows.slice(size * 2, size * 3);
            cache[blocks[2] + 1] = rows.slice(size * 3, size * 4);
        }
    }

    public getBlockIndexes(page: number): number[] {
        return [page + (page - 1), page * 2];
    }

    public getPage(block: number): number {
        return block % 2 === 0 ? block / 2 : (block + 1) / 2;
    }

    public isBlockAvailable(value: number): boolean {
        return value in this.cache;
    }

    public getData(): VirtualInfo {
        return {
            page: this.model.currentPage,
            blockIndexes: this.getBlockIndexes(this.model.currentPage),
            direction: 'down',
            columnIndexes: this.parent.getColumnIndexesInView()
        };
    }

    private getStartIndex(blk: number, data: Object[], full: boolean = true): number {
        const page: number = this.getPage(blk); const even: boolean = blk % 2 === 0;
        const index: number = (page - 1) * this.model.pageSize;
        return full || !even ? index : index + ~~(this.model.pageSize / 2);
    }

    public getColumnIndexes(content: HTMLElement =
    (<HTMLElement>this.parent.getHeaderContent().querySelector('.' + literals.headerContent))): number[] {
        const indexes: number[] = []; let sLeft: number = content.scrollLeft | 0;
        const keys: string[] = Object.keys(this.cOffsets); const cWidth: number = content.getBoundingClientRect().width;
        sLeft = Math.min(this.cOffsets[keys.length - 1] - cWidth, sLeft);
        const calWidth: number = Browser.isDevice ? 2 * cWidth : cWidth / 2;
        const left: number = sLeft + cWidth + (sLeft === 0 ? calWidth : 0);
        let frzLeftWidth: number = 0;
        const diffWidth: number = sLeft - calWidth;
        if (this.parent.isFrozenGrid()) {
            frzLeftWidth = this.parent.leftrightColumnWidth('left');
            if (diffWidth > 0) {
                for (let i: number = this.parent.getVisibleFrozenLeftCount() - 1; i >= 0; i--) {
                    if (diffWidth <= this.cOffsets[parseInt(i.toString(), 10)]) {
                        frzLeftWidth = frzLeftWidth - this.cOffsets[parseInt(i.toString(), 10)];
                        break;
                    }
                }
            }
            if (this.parent.getFrozenMode() === literals.leftRight) {
                const rightCol: number =  this.parent.getVisibleFrozenRightCount();
                keys.splice((keys.length - 1) -  rightCol, rightCol);
            }
        }
        const frozenLeftCount: number = this.parent.getVisibleFrozenLeftCount();
        keys.some((offset: string) => {
            const iOffset: number = Number(offset); const offsetVal: number = this.cOffsets[`${offset}`];
            const border: boolean = (diffWidth < 0 && iOffset < frozenLeftCount) || ((diffWidth + frzLeftWidth) <= offsetVal &&
                (left + calWidth) >= offsetVal);
            if (border) {
                indexes.push(iOffset);
            }
            return left + calWidth < offsetVal;
        });
        return indexes;
    }

    public checkAndResetCache(action: string): boolean {
        const actions: string[] = ['paging', 'refresh', 'sorting', 'filtering', 'searching', 'grouping', 'ungrouping', 'reorder',
            'save', 'delete'];
        const clear: boolean = actions.some((value: string) => action === value);
        if (clear) {
            this.cache = {}; this.data = {}; this.groups = {};
        }
        return clear;
    }

    public refreshColOffsets(): void {
        let col: number = 0; this.cOffsets = {}; const gLen: number = this.parent.groupSettings.columns.length;
        const cols: Column[] = (<Column[]>this.parent.getVisibleColumns());
        const cLen: number = cols.length;
        const isVisible: Function = (column: Column) => column.visible &&
            (!this.parent.groupSettings.showGroupedColumn ? this.parent.groupSettings.columns.indexOf(column.field) < 0 : column.visible);
        const c: string[] = this.parent.groupSettings.columns;
        for (let i: number = 0; i < c.length; i++) {
            this.cOffsets[parseInt(i.toString(), 10)] = (this.cOffsets[i - 1] | 0) + 30;
        }
        // eslint-disable-next-line prefer-spread
        const blocks: number[] = Array.apply(null, Array(cLen)).map(() => col++);
        for (let j: number = 0; j < blocks.length; j++) {
            blocks[parseInt(j.toString(), 10)] = blocks[parseInt(j.toString(), 10)] + gLen;
            this.cOffsets[blocks[parseInt(j.toString(), 10)]] =
                (this.cOffsets[blocks[parseInt(j.toString(), 10)] - 1] | 0) + (isVisible(cols[parseInt(j.toString(), 10)]) ?
                    parseInt(<string>cols[parseInt(j.toString(), 10)].width, 10) : 0);
        }
    }

    public updateGroupRow(current: Row<Column>[], block: number): Row<Column>[] {
        const currentFirst: Row<Column> = current[0];
        let rows: Row<Column>[] = [];
        const keys: string[] = Object.keys(this.cache);
        for (let i: number = 0; i < keys.length; i++) {
            if (Number(keys[parseInt(i.toString(), 10)]) < block) {
                rows = [...rows, ...this.cache[keys[parseInt(i.toString(), 10)]]];
            }
        }
        if ((currentFirst && currentFirst.isDataRow) || block % 2 === 0) {
            return current;
        }
        return this.iterateGroup(current, rows);
    }

    private iterateGroup(current: Row<Column>[], rows: Row<Column>[]): Row<Column>[] {
        const currentFirst: Row<Column> = current[0]; let offset: number = 0;
        if (currentFirst && currentFirst.isDataRow) {
            return current;
        }
        const isPresent: boolean = current.some((row: Row<Column>) => {
            return rows.some((oRow: Row<Column>, index: number) => {
                const res: boolean = oRow && (<Group>oRow.data).field !== undefined
                    && (<Group>oRow.data).field === (<Group>row.data).field &&
                    (<Group>oRow.data).key === (<Group>row.data).key;
                if (res) { offset = index; }
                return res;
            });
        });
        if (isPresent) {
            current.shift();
            current = this.iterateGroup(current, rows.slice(offset));
        }
        return current;
    }

    public getRows(): Row<Column>[] {
        let rows: Row<Column>[] = [];
        const keys: string[] = Object.keys(this.cache);
        for (let i: number = 0; i < keys.length; i++) {
            rows = [...rows, ...this.cache[keys[parseInt(i.toString(), 10)]]];
        }
        return rows;
    }

    public generateCells(foreignKeyData?: Object): Cell<Column>[] {
        const cells: Cell<Column>[] = [];
        const cols: Column[] = (<{ columnModel?: Column[] }>this.parent).columnModel;
        for (let i: number = 0; i < cols.length; i++) {
            cells.push(
                (this.rowModelGenerator as RowModelGenerator).generateCell(
                    cols[parseInt(i.toString(), 10)],
                    null, null, null, null, foreignKeyData));
        }
        return cells;
    }

    private getGroupVirtualRecordsByIndex(rows: Row<Column>[]): void {
        const blocks: number = this.parent.contentModule.getGroupedTotalBlocks();
        const blockSize: number = this.parent.contentModule.getBlockSize();
        if (Object.keys(this.cache).length === 0) {
            let countGroupRow: number = 0;
            for (let i: number = 1; i <= blocks; i++) {
                let count: number = 0; this.cache[parseInt(i.toString(), 10)] = [];
                for (let j: number = ((i - 1) * blockSize + countGroupRow); j < rows.length; j++) {
                    if (count === blockSize) {
                        break;
                    }
                    this.cache[parseInt(i.toString(), 10)].push(rows[parseInt(j.toString(), 10)]);
                    if (rows[parseInt(j.toString(), 10)].isDataRow) {
                        count++;
                    }
                    countGroupRow++;
                }
                countGroupRow -= count;
            }
        }
    }
}
