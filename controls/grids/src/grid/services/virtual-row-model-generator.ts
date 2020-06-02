import { Browser, isBlazor, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Group } from '@syncfusion/ej2-data';
import { IModelGenerator, IGrid, VirtualInfo, NotifyArgs } from '../base/interface';
import { Row } from '../models/row';
import { isGroupAdaptive } from '../base/util';
import { Column } from '../models/column';
import { PageSettingsModel } from '../models/page-settings-model';
import { RowModelGenerator } from '../services/row-model-generator';
import { GroupModelGenerator } from '../services/group-model-generator';
import { VirtualContentRenderer } from '../renderer/virtual-content-renderer';

/**
 * Content module is used to render grid content
 */
export class VirtualRowModelGenerator implements IModelGenerator<Column> {

    private model: PageSettingsModel;
    public rowModelGenerator: IModelGenerator<Column>;
    public parent: IGrid;
    public cOffsets: { [x: number]: number } = {};
    public cache: { [x: number]: Row<Column>[] } = {};
    public rowCache: { [x: number]: Row<Column> } = {};
    public data: { [x: number]: Object[] } = {};
    public groups: { [x: number]: Object } = {};

    constructor(parent: IGrid) {
        this.parent = parent;
        this.model = this.parent.pageSettings;
        this.rowModelGenerator = this.parent.allowGrouping ? new GroupModelGenerator(this.parent) : new RowModelGenerator(this.parent);
    }

    public generateRows(data: Object[], notifyArgs?: NotifyArgs): Row<Column>[] {
        let info: VirtualInfo = notifyArgs.virtualInfo = notifyArgs.virtualInfo || this.getData();
        let xAxis: boolean = info.sentinelInfo && info.sentinelInfo.axis === 'X';
        let page: number = !xAxis && info.loadNext && !info.loadSelf ? info.nextInfo.page : info.page;
        let result: Row<Column>[] = []; let center: number = ~~(this.model.pageSize / 2);
        let indexes: number[] = this.getBlockIndexes(page); let loadedBlocks: number[] = [];
        this.checkAndResetCache(notifyArgs.requestType);
        if (isGroupAdaptive(this.parent) && this.parent.vcRows.length) {
            return result = this.parent.vcRows;
        }
        if (this.parent.enableColumnVirtualization) {
            for (let i: number = 0; i < info.blockIndexes.length; i++) {
                if (this.isBlockAvailable(info.blockIndexes[i])) {
                    this.cache[info.blockIndexes[i]] = this.rowModelGenerator.refreshRows(this.cache[info.blockIndexes[i]]);
                }
            }
        }
        if (isBlazor() && this.parent.isServerRendered) {
            let virtualStartIdx: string = 'virtualStartIndex'; let startIndex: string = 'startIndex'; let endIndex: string = 'endIndex';
            if (!notifyArgs[virtualStartIdx] && Object.keys(this.rowCache).length === 0) {
                for (let i: number = 0 ; i < data.length; i++) {
                    let args: Object[] = [];
                    args.push(data[i]);
                    this.rowCache[i] = this.rowModelGenerator.generateRows(args, {startIndex: i})[0];
                }
                let j: number = 0;
                for (let i: number = 0; i < this.parent.pageSettings.pageSize ; i++) {
                    result[j] = this.rowCache[i];
                    j++;
                }
            } else if (notifyArgs[virtualStartIdx]) {
                let virtualStartIndex: number = notifyArgs[startIndex]; let cacheindex: number[] = [];
                for (let i: number = 0; i < Object.keys(this.rowCache).length ; i++) {
                     cacheindex.push(Number(Object.keys(this.rowCache)[i]));
                }
                for (let i: number = 0 ; i < data.length; i++) {
                    let args: Object[] = []; let check: number = cacheindex.indexOf(virtualStartIndex);
                    args.push(data[i]);
                    if (check === -1) {
                        this.rowCache[virtualStartIndex] = this.rowModelGenerator.generateRows(args, {startIndex: virtualStartIndex})[0];
                    }
                    virtualStartIndex++;
                }
            }
            if (!isNullOrUndefined(notifyArgs[virtualStartIdx])) {
                let j: number = 0;
                for (let i: number = notifyArgs[startIndex]; i < notifyArgs[endIndex]; i++) {
                    result[j] = this.rowCache[i];
                    j++;
                }
            }
        } else {
            let values: number[] = info.blockIndexes;
            for (let i: number = 0; i < values.length; i++) {
                if (!this.isBlockAvailable(values[i])) {
                    let rows: Row<Column>[] = this.rowModelGenerator.generateRows(data, {
                        virtualInfo: info, startIndex: this.getStartIndex(values[i], data)
                    });
                    if (isGroupAdaptive(this.parent) && !this.parent.vcRows.length) {
                        this.parent.vRows = rows;
                        this.parent.vcRows = rows;
                    }
                    let median: number;
                    if (isGroupAdaptive(this.parent)) {
                        median = this.model.pageSize / 2;
                        if (!this.isBlockAvailable(indexes[0])) {
                            this.cache[indexes[0]] = rows.slice(0, median);
                        }
                        if (!this.isBlockAvailable(indexes[1])) {
                            this.cache[indexes[1]] = rows.slice(median, this.model.pageSize);
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
                if (this.parent.groupSettings.columns.length && !xAxis && this.cache[values[i]]) {
                    this.cache[values[i]] = this.updateGroupRow(this.cache[values[i]], values[i]);
                }
                result.push(...this.cache[values[i]]);
                if (this.isBlockAvailable(values[i])) {
                    loadedBlocks.push(values[i]);
                }
            }
            info.blockIndexes = loadedBlocks;
        }
        if (!isBlazor() || (isBlazor() && !this.parent.isServerRendered)) {
            let grouping: string = 'records';
            if (this.parent.allowGrouping) {
                this.parent.currentViewData[grouping] = result.map((m: Row<Column>) => m.data);
            } else {
                this.parent.currentViewData = result.map((m: Row<Column>) => m.data);
            }
        }
        return result;
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
        let page: number = this.getPage(blk); let even: boolean = blk % 2 === 0;
        let index: number = (page - 1) * this.model.pageSize;
        return full || !even ? index : index + ~~(this.model.pageSize / 2);
    }

    public getColumnIndexes(content: HTMLElement =
        (<HTMLElement>this.parent.getHeaderContent().querySelector('.e-headercontent'))): number[] {
        if (this.parent.getFrozenColumns()) {
            content = content.querySelector('.e-movableheader');
        }
        let indexes: number[] = []; let sLeft: number = content.scrollLeft | 0;
        let keys: string[] = Object.keys(this.cOffsets); let cWidth: number = content.getBoundingClientRect().width;
        sLeft = Math.min(this.cOffsets[keys.length - 1] - cWidth, sLeft); let calWidth: number = Browser.isDevice ? 2 * cWidth : cWidth / 2;
        let left: number = sLeft + cWidth + (sLeft === 0 ? calWidth : 0);
        keys.some((offset: string, indx: number, input: string[]) => {
            let iOffset: number = Number(offset); let offsetVal: number = this.cOffsets[offset];
            let border: boolean = sLeft - calWidth <= offsetVal && left + calWidth >= offsetVal;
            if (border) {
                indexes.push(iOffset);
            }
            return left + calWidth < offsetVal;
        });
        if (isBlazor() && this.parent.isServerRendered) {
            (<VirtualContentRenderer>this.parent.contentModule).startColIndex = indexes[0];
            (<VirtualContentRenderer>this.parent.contentModule).endColIndex = indexes[indexes.length - 1];
        }
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
        let actions: string[] = ['paging', 'refresh', 'sorting', 'filtering', 'searching', 'grouping', 'ungrouping', 'reorder',
            'save', 'delete'];
        if (this.parent.getFrozenColumns() && this.parent.frozenRows && this.parent.enableColumnVirtualization && action === 'reorder') {
            actions.splice(actions.indexOf(action), 1);
        }
        let clear: boolean = actions.some((value: string) => action === value);
        if (clear) {
            this.cache = {}; this.data = {}; this.groups = {};
        }
        return clear;
    }

    public refreshColOffsets(): void {
        let col: number = 0; this.cOffsets = {}; let gLen: number = this.parent.groupSettings.columns.length;
        let cols: Column[] = (<Column[]>this.parent.columns);
        let cLen: number = cols.length;
        let isVisible: Function = (column: Column) => column.visible &&
            (!this.parent.groupSettings.showGroupedColumn ? this.parent.groupSettings.columns.indexOf(column.field) < 0 : column.visible);
        let c: string[] = this.parent.groupSettings.columns;
        for (let i: number = 0; i < c.length; i++) {
            this.cOffsets[i] = (this.cOffsets[i - 1] | 0) + 30;
        }
        let blocks: number[] = Array.apply(null, Array(cLen)).map(() => col++);
        for (let j: number = 0; j < blocks.length; j++) {
            blocks[j] = blocks[j] + gLen;
            this.cOffsets[blocks[j]] = (this.cOffsets[blocks[j] - 1] | 0) + (isVisible(cols[j]) ? parseInt(<string>cols[j].width, 10) : 0);
        }
    }

    public updateGroupRow(current: Row<Column>[], block: number): Row<Column>[] {
        let currentFirst: Row<Column> = current[0];
        let rows: Row<Column>[] = [];
        let keys: string[] = Object.keys(this.cache);
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
        let currentFirst: Row<Column> = current[0]; let offset: number = 0;
        if (currentFirst && currentFirst.isDataRow) {
            return current;
        }
        let isPresent: boolean = current.some((row: Row<Column>) => {
            return rows.some((oRow: Row<Column>, index: number) => {
                let res: boolean = oRow && (<Group>oRow.data).field !== undefined && (<Group>oRow.data).field === (<Group>row.data).field &&
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
        let isBlazorServerRendered: boolean = isBlazor() && this.parent.isServerRendered ? true : false;
        let keys: string[] = isBlazorServerRendered ? Object.keys(this.rowCache) : Object.keys(this.cache);
        for (let i: number = 0; i < keys.length; i++) {
            rows = isBlazorServerRendered ? [...rows, ...this.rowCache[keys[i]]] : [...rows, ...this.cache[keys[i]]];
        }
        return rows;
    }
}
