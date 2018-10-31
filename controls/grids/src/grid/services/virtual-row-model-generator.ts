import { Browser } from '@syncfusion/ej2-base';
import { Group } from '@syncfusion/ej2-data';
import { IModelGenerator, IGrid, VirtualInfo, NotifyArgs } from '../base/interface';
import { Row } from '../models/row';
import { Column } from '../models/column';
import { PageSettingsModel } from '../models/page-settings-model';
import { RowModelGenerator } from '../services/row-model-generator';
import { GroupModelGenerator } from '../services/group-model-generator';


/**
 * Content module is used to render grid content
 */
export class VirtualRowModelGenerator implements IModelGenerator<Column> {

    private model: PageSettingsModel;
    public rowModelGenerator: IModelGenerator<Column>;
    public parent: IGrid;
    public cOffsets: { [x: number]: number } = {};
    public cache: { [x: number]: Row<Column>[] } = {};
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

        if (this.parent.enableColumnVirtualization) {
            info.blockIndexes.forEach((value: number) => {
                if (this.isBlockAvailable(value)) {
                    this.cache[value] = this.rowModelGenerator.refreshRows(this.cache[value]);
                }
            });
        }

        info.blockIndexes.forEach((value: number) => {
            if (!this.isBlockAvailable(value)) {
                let rows: Row<Column>[] = this.rowModelGenerator.generateRows(data, {
                    virtualInfo: info, startIndex: this.getStartIndex(value, data)
                });
                let median: number = ~~Math.max(rows.length, this.model.pageSize) / 2;
                if (!this.isBlockAvailable(indexes[0])) {
                    this.cache[indexes[0]] = rows.slice(0, median);
                }
                if (!this.isBlockAvailable(indexes[1])) {
                    this.cache[indexes[1]] = rows.slice(median);
                }
            }
            if (this.parent.groupSettings.columns.length && !xAxis && this.cache[value]) {
                this.cache[value] = this.updateGroupRow(this.cache[value], value);
            }
            result.push(...this.cache[value]);
            if (this.isBlockAvailable(value)) {
                loadedBlocks.push(value);
            }
        });
        info.blockIndexes = loadedBlocks;
        let grouping: string = 'records';
        if (this.parent.allowGrouping) {
            this.parent.currentViewData[grouping] = result.map((m: Row<Column>) => m.data);
        } else {
            this.parent.currentViewData = result.map((m: Row<Column>) => m.data);
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

    public getColumnIndexes(content: HTMLElement = (<HTMLElement>this.parent.getHeaderContent().firstChild)): number[] {
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
        return indexes;
    }

    public checkAndResetCache(action: string): boolean {
        let clear: boolean = ['paging', 'refresh', 'sorting', 'filtering', 'searching', 'grouping', 'ungrouping', 'reorder']
            .some((value: string) => action === value);
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
        this.parent.groupSettings.columns.forEach((c: string, n: number) => this.cOffsets[n] = (this.cOffsets[n - 1] | 0) + 30);
        Array.apply(null, Array(cLen)).map(() => col++).forEach((block: number, i: number) => {
            block = block + gLen;
            this.cOffsets[block] = (this.cOffsets[block - 1] | 0) + (isVisible(cols[i]) ? parseInt(<string>cols[i].width, 10) : 0);
        });
    }

    public updateGroupRow(current: Row<Column>[], block: number): Row<Column>[] {
        let currentFirst: Row<Column> = current[0];
        let rows: Row<Column>[] = [];
        Object.keys(this.cache).forEach((key: string) => {
            if (Number(key) < block) {
                rows = [...rows, ...this.cache[key]];
            }
         });
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
        Object.keys(this.cache).forEach((key: string) => rows = [...rows, ...this.cache[key]]);
        return rows;
    }
}
