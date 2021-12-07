import { Browser, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Group } from '@syncfusion/ej2-data';
import { IModelGenerator, IGrid, VirtualInfo, NotifyArgs } from '../base/interface';
import { Row } from '../models/row';
import { Cell } from '../models/cell';
import { isGroupAdaptive } from '../base/util';
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
    public rowModelGenerator: IModelGenerator<Column>;
    public parent: IGrid;
    public cOffsets: { [x: number]: number } = {};
    public cache: { [x: number]: Row<Column>[] } = {};
    public movableCache: { [x: number]: Row<Column>[] } = {};
    public frozenRightCache: { [x: number]: Row<Column>[] } = {};
    public rowCache: { [x: number]: Row<Column> } = {};
    public data: { [x: number]: Object[] } = {};
    public groups: { [x: number]: Object } = {};
    public currentInfo: VirtualInfo = {};
    public includePrevPage: boolean;
    public startIndex: number;

    constructor(parent: IGrid) {
        this.parent = parent;
        this.model = this.parent.pageSettings;
        this.rowModelGenerator = this.parent.allowGrouping ? new GroupModelGenerator(this.parent) : new RowModelGenerator(this.parent);
    }

    public generateRows(data: Object[], e?: NotifyArgs): Row<Column>[] {
        const isFrozen: boolean = this.parent.isFrozenGrid();
        let isManualRefresh: boolean = false;
        const info: VirtualInfo = e.virtualInfo = e.virtualInfo || this.getData();
        const xAxis: boolean = info.sentinelInfo && info.sentinelInfo.axis === 'X';
        const page: number = !xAxis && info.loadNext && !info.loadSelf ? info.nextInfo.page : info.page;
        let result: Row<Column>[] = [];
        let indexes: number[] = this.getBlockIndexes(page); const loadedBlocks: number[] = [];
        if (this.currentInfo.blockIndexes) {
            indexes = info.blockIndexes = e.virtualInfo.blockIndexes = this.includePrevPage ? this.currentInfo.blockIndexes.slice(1)
                : this.currentInfo.blockIndexes.slice(0, this.currentInfo.blockIndexes.length - 1);
            isManualRefresh = true;
        }
        if ((isFrozen && (this.parent.getFrozenMode() !== literals.leftRight && !e.renderMovableContent)
            || this.parent.getFrozenMode() === literals.leftRight && !e.renderMovableContent && !e.renderFrozenRightContent) || !isFrozen) {
            this.checkAndResetCache(e.requestType);
        }
        if (isGroupAdaptive(this.parent) && this.parent.vcRows.length) {
            return result = this.parent.vcRows;
        }
        if (this.parent.enableColumnVirtualization) {
            for (let i: number = 0; i < info.blockIndexes.length; i++) {
                if (this.isBlockAvailable(info.blockIndexes[i])) {
                    this.cache[info.blockIndexes[i]] = this.rowModelGenerator.refreshRows(this.cache[info.blockIndexes[i]]);
                }
                if ((e.renderMovableContent && this.isMovableBlockAvailable(info.blockIndexes[i]))
                    || (e.renderFrozenRightContent && this.isFrozenRightBlockAvailable(info.blockIndexes[i]))) {
                    const cache: { [x: number]: Row<Column>[] } = e.renderMovableContent
                        ? this.movableCache : this.frozenRightCache;
                    cache[info.blockIndexes[i]] = this.rowModelGenerator.refreshRows(cache[info.blockIndexes[i]]);
                }
            }
        }
        const values: number[] = info.blockIndexes;
        for (let i: number = 0; i < values.length; i++) {
            if (!this.isBlockAvailable(values[i])) {
                const startIdx: number = !isNullOrUndefined(this.startIndex) ? this.startIndex : this.getStartIndex(values[i], data);
                const rows: Row<Column>[] = this.rowModelGenerator.generateRows(data, {
                    virtualInfo: info, startIndex: startIdx
                });
                if (isGroupAdaptive(this.parent) && !this.parent.vcRows.length) {
                    this.parent.vRows = rows;
                    this.parent.vcRows = rows;
                    this.parent.notify(events.refreshVirtualMaxPage, {});
                }
                let median: number;
                if (isGroupAdaptive(this.parent)) {
                    this.getGroupVirtualRecordsByIndex(rows);
                } else {
                    if (isManualRefresh) {
                        this.setBlockForManualRefresh(this.cache, indexes, rows);
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
            if (this.parent.groupSettings.columns.length && !xAxis && this.cache[values[i]]) {
                this.cache[values[i]] = this.updateGroupRow(this.cache[values[i]], values[i]);
            }
            if ((e.renderMovableContent && !this.isMovableBlockAvailable(values[i]))
                || (e.renderFrozenRightContent && !this.isFrozenRightBlockAvailable(values[i]))) {
                const cache: { [x: number]: Row<Column>[] } = e.renderMovableContent
                    ? this.movableCache : this.frozenRightCache;
                const startIdx: number = !isNullOrUndefined(this.startIndex) ? this.startIndex : this.getStartIndex(values[i], data);
                const rows: Row<Column>[] = this.rowModelGenerator.generateRows(data, {
                    virtualInfo: info, startIndex: startIdx
                });
                if (isManualRefresh) {
                    this.setBlockForManualRefresh(cache, indexes, rows);
                } else {
                    const median: number = ~~Math.max(rows.length, this.model.pageSize) / 2;
                    if ((e.renderFrozenRightContent && !this.isFrozenRightBlockAvailable(indexes[0]))
                        || (e.renderMovableContent && !this.isMovableBlockAvailable(indexes[0]))) {
                        cache[indexes[0]] = rows.slice(0, median);
                    }
                    if ((e.renderFrozenRightContent && !this.isFrozenRightBlockAvailable(indexes[1]))
                        || (e.renderMovableContent && !this.isMovableBlockAvailable(indexes[1]))) {
                        cache[indexes[1]] = rows.slice(median);
                    }
                }
            }
            if (!e.renderMovableContent && !e.renderFrozenRightContent && this.cache[values[i]]) {
                result.push(...this.cache[values[i]]);
            } else {
                const cache: { [x: number]: Row<Column>[] } = e.renderMovableContent
                    ? this.movableCache : this.frozenRightCache;
                if (cache[values[i]]) {
                    result.push(...cache[values[i]]);
                }
            }
            if (this.isBlockAvailable(values[i])) {
                loadedBlocks.push(values[i]);
            }
        }
        info.blockIndexes = loadedBlocks;
        const grouping: string = 'records';
        if (this.parent.allowGrouping && this.parent.groupSettings.columns.length) {
            this.parent.currentViewData[grouping] = result.map((m: Row<Column>) => m.data);
        } else if (isFrozen) {
            if ((e.renderMovableContent && (this.parent.getFrozenMode() === 'Left'
                || this.parent.getFrozenMode() === 'Right' || this.parent.getFrozenColumns())) || e.renderFrozenRightContent) {
                this.parent.currentViewData = result.map((m: Row<Column>) => m.data);
            }
        } else {
            this.parent.currentViewData = result.map((m: Row<Column>) => m.data);
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

    public isMovableBlockAvailable(value: number): boolean {
        return value in this.movableCache;
    }

    public isFrozenRightBlockAvailable(value: number): boolean {
        return value in this.frozenRightCache;
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
        if (this.parent.isFrozenGrid()) {
            content = content.querySelector('.' + literals.movableHeader);
        }
        const indexes: number[] = []; let sLeft: number = content.scrollLeft | 0;
        const keys: string[] = Object.keys(this.cOffsets); const cWidth: number = content.getBoundingClientRect().width;
        sLeft = Math.min(this.cOffsets[keys.length - 1] - cWidth, sLeft);
        const calWidth: number = Browser.isDevice ? 2 * cWidth : cWidth / 2;
        const left: number = sLeft + cWidth + (sLeft === 0 ? calWidth : 0);
        keys.some((offset: string) => {
            const iOffset: number = Number(offset); const offsetVal: number = this.cOffsets[offset];
            const border: boolean = sLeft - calWidth <= offsetVal && left + calWidth >= offsetVal;
            if (border) {
                indexes.push(iOffset);
            }
            return left + calWidth < offsetVal;
        });
        this.addFrozenIndex(indexes);
        return indexes;
    }

    private addFrozenIndex(indexes: number[]): void {
        if (this.parent.getFrozenColumns() && this.parent.enableColumnVirtualization && indexes[0] === 0) {
            for (let i: number = 0; i < this.parent.getFrozenColumns(); i++) {
                indexes.push(indexes[indexes.length - 1] + 1);
            }
        }
    }

    public checkAndResetCache(action: string): boolean {
        const actions: string[] = ['paging', 'refresh', 'sorting', 'filtering', 'searching', 'grouping', 'ungrouping', 'reorder',
            'save', 'delete'];
        if (this.parent.getFrozenColumns() && this.parent.frozenRows && this.parent.enableColumnVirtualization && action === 'reorder') {
            actions.splice(actions.indexOf(action), 1);
        }
        const clear: boolean = actions.some((value: string) => action === value);
        if (clear) {
            this.cache = {}; this.data = {}; this.groups = {}; this.movableCache = {}; this.frozenRightCache = {};
        }
        return clear;
    }

    public refreshColOffsets(): void {
        let col: number = 0; this.cOffsets = {}; const gLen: number = this.parent.groupSettings.columns.length;
        const cols: Column[] = (<Column[]>this.parent.columns);
        const cLen: number = cols.length;
        const isVisible: Function = (column: Column) => column.visible &&
            (!this.parent.groupSettings.showGroupedColumn ? this.parent.groupSettings.columns.indexOf(column.field) < 0 : column.visible);
        const c: string[] = this.parent.groupSettings.columns;
        for (let i: number = 0; i < c.length; i++) {
            this.cOffsets[i] = (this.cOffsets[i - 1] | 0) + 30;
        }
        // eslint-disable-next-line prefer-spread
        const blocks: number[] = Array.apply(null, Array(cLen)).map(() => col++);
        for (let j: number = 0; j < blocks.length; j++) {
            blocks[j] = blocks[j] + gLen;
            this.cOffsets[blocks[j]] = (this.cOffsets[blocks[j] - 1] | 0) + (isVisible(cols[j]) ? parseInt(<string>cols[j].width, 10) : 0);
        }
    }

    public updateGroupRow(current: Row<Column>[], block: number): Row<Column>[] {
        const currentFirst: Row<Column> = current[0];
        let rows: Row<Column>[] = [];
        const keys: string[] = Object.keys(this.cache);
        for (let i: number = 0; i < keys.length; i++) {
            if (Number(keys[i]) < block) {
                rows = [...rows, ...this.cache[keys[i]]];
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
            rows = [...rows, ...this.cache[keys[i]]];
        }
        return rows;
    }

    public generateCells(foreignKeyData?: Object): Cell<Column>[] {
        const cells: Cell<Column>[] = [];
        const cols: Column[] = (<{ columnModel?: Column[] }>this.parent).columnModel;
        for (let i: number = 0; i < cols.length; i++) {
            cells.push((this.rowModelGenerator as RowModelGenerator).generateCell(cols[i], null, null, null, null, foreignKeyData));
        }
        return cells;
    }

    private getGroupVirtualRecordsByIndex(rows: Row<Column>[]): void {
        const blocks: number = this.parent.contentModule.getGroupedTotalBlocks();
        const blockSize: number = this.parent.contentModule.getBlockSize();
        for (let i: number = 1; i <= blocks; i++) {
            let count: number = 0; this.cache[i] = [];
            for (let j: number = ((i - 1) * blockSize); j < rows.length; j++) {
                if (count === blockSize) {
                    break;
                }
                this.cache[i].push(rows[j]);
                if (rows[j].isDataRow) {
                    count++;
                }
            }
        }
    }
}
