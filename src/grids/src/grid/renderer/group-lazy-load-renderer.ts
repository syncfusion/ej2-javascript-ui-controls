import { extend, remove, isNullOrUndefined, setStyleAttribute, removeClass, addClass } from '@syncfusion/ej2-base';
import { Query, Predicate } from '@syncfusion/ej2-data';
import { IRenderer, IGrid, LazyLoadArgs, LazyLoadGroupArgs, NotifyArgs, IRow, VirtualInfo, IValueFormatter } from '../base/interface';
import { ServiceLocator } from '../services/service-locator';
import { ContentRender } from './content-renderer';
import { ReturnType } from '../base/type';
import { Row } from '../models/row';
import { Column } from '../models/column';
import * as events from '../base/constant';
import { isRowEnteredInGrid, parentsUntil, setDisplayValue, generateExpandPredicates, getPredicates, getGroupKeysAndFields } from '../base/util';
import { Grid } from '../base/grid';
import { RowRenderer } from '../renderer/row-renderer';
import { GroupModelGenerator, GroupedData } from '../services/group-model-generator';
import { GroupSummaryModelGenerator, CaptionSummaryModelGenerator } from '../services/summary-model-generator';
import { AggregateColumnModel } from '../models/aggregate-model';
import { Cell } from '../models/cell';
import { VirtualContentRenderer } from './virtual-content-renderer';
import * as literals from '../base/string-literals';

/**
 * GroupLazyLoadRenderer is used to perform lazy load grouping
 *
 * @hidden
 */
export class GroupLazyLoadRenderer extends ContentRender implements IRenderer {
    private locator: ServiceLocator;
    private groupGenerator: GroupModelGenerator;
    private summaryModelGen: GroupSummaryModelGenerator;
    private captionModelGen: CaptionSummaryModelGenerator;
    private rowRenderer: RowRenderer<Column>;

    constructor(parent: IGrid, locator?: ServiceLocator) {
        super(parent, locator);
        this.locator = locator;
        this.groupGenerator = new GroupModelGenerator(this.parent);
        this.summaryModelGen = new GroupSummaryModelGenerator(this.parent);
        this.captionModelGen = new CaptionSummaryModelGenerator(this.parent);
        this.rowRenderer = new RowRenderer<Column>(this.locator, null, this.parent);
        this.eventListener();
    }

    private childCount: number = 0;
    private scrollData: Row<Column>[] = [];
    private rowIndex: number;
    private rowObjectIndex: number;
    private isFirstChildRow: boolean = false;
    private isScrollDown: boolean = false;
    private isScrollUp: boolean = false;
    private uid1: string;
    private uid2: string;
    private uid3: string;
    private blockSize: number;
    private groupCache: { [x: number]: Row<Column>[] } = {};
    private cacheRowsObj: { [x: number]: Row<Column>[] } = {};
    private startIndexes: { [x: number]: number[] } = {};
    private captionCounts: { [x: number]: number[] } = {};
    private rowsByUid: { [x: number]: Row<Column>[] } = {};
    private objIdxByUid: { [x: number]: Row<Column>[] } = {};
    private initialGroupCaptions: { [x: number]: Row<Column>[] } = {};
    private requestType: string[] = ['paging', 'columnstate', 'reorder', 'cancel', 'save', 'beginEdit', 'add', 'delete',
        'filterBeforeOpen', 'filterchoicerequest', 'infiniteScroll', 'virtualscroll', 'columnVisibilityUpdate'];
    private scrollTopCache: number|undefined = undefined;

    /** @hidden */
    public refRowsObj: { [x: number]: Row<Column>[] } = {};
    /** @hidden */
    public pageSize: number;
    /** @hidden */
    public cacheMode: boolean = false;
    /** @hidden */
    public cacheBlockSize: number = 5;
    /** @hidden */
    public ignoreAccent: boolean = this.parent.allowFiltering ? this.parent.filterSettings.ignoreAccent : false;
    /** @hidden */
    public allowCaseSensitive: boolean = false;
    /** @hidden */
    public lazyLoadQuery: Object[] = [];

    private eventListener(): void {
        this.parent.addEventListener(events.actionBegin, this.actionBegin.bind(this));
        this.parent.addEventListener(events.actionComplete, this.actionComplete.bind(this));
        this.parent.on(events.initialEnd, this.setLazyLoadPageSize, this);
        this.parent.on(events.setGroupCache, this.setCache, this);
        this.parent.on(events.lazyLoadScrollHandler, this.scrollHandler, this);
        this.parent.on(events.columnVisibilityChanged, this.setVisible, this);
        this.parent.on(events.groupCollapse, this.collapseShortcut, this);
    }

    /**
     * @param {HTMLTableRowElement} tr - specifies the table row element
     * @returns {void}
     * @hidden
     */
    public captionExpand(tr: HTMLTableRowElement): void {
        const page: number = this.parent.pageSettings.currentPage;
        const rowsObject: Row<Column>[] = this.groupCache[parseInt(page.toString(), 10)];
        const uid: string = tr.getAttribute('data-uid');
        this.refreshCaches();
        if ((!this.scrollTopCache || this.parent.scrollModule['content'].scrollTop > this.scrollTopCache) &&
            !this.parent.enableVirtualization) {
            this.scrollTopCache = this.parent.scrollModule['content'].scrollTop;
        }
        const oriIndex: number = this.getRowObjectIndexByUid(uid);
        let isRowExist: boolean = rowsObject[oriIndex + 1] ?
            rowsObject[parseInt(oriIndex.toString(), 10)].indent < rowsObject[oriIndex + 1].indent : false;
        if (this.parent.enableVirtualization) {
            isRowExist = this.cacheRowsObj[`${uid}`] ? true : false;
        }
        const data: Row<Column> = rowsObject[parseInt(oriIndex.toString(), 10)];
        const key: { fields: string[], keys: string[] } = getGroupKeysAndFields(oriIndex, rowsObject);
        for (let i: number = 0; i < key.fields.length; i++) {
            const column: Column = this.parent.getColumnByField(key.fields[parseInt(i.toString(), 10)]);
            if (column.enableGroupByFormat) {
                key.keys[parseInt(i.toString(), 10)] = this.locator.getService<IValueFormatter>('valueFormatter').fromView(
                    key.keys[parseInt(i.toString(), 10)], column.getParser(), (column.type === 'dateonly' ? 'date' : column.type)) as string;
            }
        }
        const e: LazyLoadGroupArgs = { captionRowElement: tr, groupInfo: data, enableCaching: true, cancel: false };
        this.parent.trigger(events.lazyLoadGroupExpand, e, (args: LazyLoadGroupArgs) => {
            if (args.cancel) {
                return;
            }
            args.keys = key.keys; args.fields = key.fields; args.rowIndex = tr.rowIndex;
            args.makeRequest = !args.enableCaching || !isRowExist;
            if (!args.enableCaching && isRowExist) {
                this.clearCache([uid]);
            }
            args.skip = 0;
            args.take = this.pageSize;
            data.isExpand = true;
            if (this.rowsByUid[parseInt(page.toString(), 10)][data.uid]) {
                this.rowsByUid[parseInt(page.toString(), 10)][data.uid].isExpand = true;
            }
            this.captionRowExpand(args);
        });
    }

    /**
     * @param {HTMLTableRowElement} tr - specifies the table row element
     * @returns {void}
     * @hidden
     */
    public captionCollapse(tr: HTMLTableRowElement): void {
        const cache: Row<Column>[] = this.groupCache[this.parent.pageSettings.currentPage];
        const rowIdx: number = tr.rowIndex;
        const uid: string = tr.getAttribute('data-uid');
        this.refreshCaches();
        const captionIndex: number = this.getRowObjectIndexByUid(uid);
        const e: LazyLoadArgs = {
            captionRowElement: tr, groupInfo: cache[parseInt(captionIndex.toString(), 10)], cancel: false
        };
        this.parent.trigger(events.lazyLoadGroupCollapse, e, (args: LazyLoadGroupArgs) => {
            if (args.cancel) {
                return;
            }
            args.isExpand = false;
            for (let i: number = 0; i < this.lazyLoadQuery.length; i++) {
                const query: object = this.lazyLoadQuery[parseInt(i.toString(), 10)];
                const where: object = query[0];
                const removeCollapse: object = args.groupInfo.data;
                if (removeCollapse['key'] === where['value']) {
                    this.lazyLoadQuery.splice(i, 1);
                }
            }
            this.removeRows(captionIndex, rowIdx, uid);
            if (this.parent.enableInfiniteScrolling || this.parent.enableVirtualization) {
                this.groupCache[this.parent.pageSettings.currentPage] = extend(
                    [], this.refRowsObj[this.parent.pageSettings.currentPage]) as Row<Column>[];
                this.refreshRowObjects([], captionIndex);
            }
        });
    }

    /**
     * @returns {void}
     * @hidden */
    public setLazyLoadPageSize(): void {
        const scrollEle: Element = this.parent.getContent().firstElementChild;
        const blockSize: number = Math.floor((scrollEle as HTMLElement).offsetHeight / this.parent.getRowHeight()) - 1;
        this.pageSize = this.pageSize ? this.pageSize : blockSize * 3;
        this.blockSize = Math.ceil(this.pageSize / 2);
    }

    /**
     * @returns {void}
     * @hidden */
    public clearLazyGroupCache(): void {
        this.clearCache();
    }

    private clearCache(uids?: string[]): void {
        uids = uids ? uids : this.getInitialCaptionIndexes();
        const cache: Row<Column>[] = this.groupCache[this.parent.pageSettings.currentPage];
        if (uids.length) {
            for (let i: number = 0; i < uids.length; i++) {
                const capIdx: number = this.getRowObjectIndexByUid(uids[parseInt(i.toString(), 10)]);
                const capRow: Row<Column> = cache[parseInt(capIdx.toString(), 10)];
                if (!capRow) { continue; }
                if (this.captionCounts[this.parent.pageSettings.currentPage][capRow.uid]) {
                    for (let i: number = capIdx + 1; i < cache.length; i++) {
                        if (cache[parseInt(i.toString(), 10)].indent === capRow.indent
                            || cache[parseInt(i.toString(), 10)].indent < capRow.indent) {
                            delete this.captionCounts[this.parent.pageSettings.currentPage][capRow.uid];
                            break;
                        }
                        if (cache[parseInt(i.toString(), 10)].isCaptionRow) {
                            delete this.captionCounts[this.parent.pageSettings.currentPage][cache[parseInt(i.toString(), 10)].uid];
                        }
                    }
                }
                if (capRow.isExpand) {
                    const tr: Element = this.parent.getRowElementByUID(capRow.uid);
                    if (!tr) { return; }
                    (this.parent as Grid).groupModule.expandCollapseRows(tr.querySelector('.e-recordplusexpand'));
                }
                const child: Row<Column>[] = this.getNextChilds(capIdx);
                if (!child.length) { continue; }
                let subChild: Row<Column>[] = [];
                if (child[child.length - 1].isCaptionRow) {
                    subChild = this.getChildRowsByParentIndex(cache.indexOf(child[child.length - 1]), false, false, null, true, true);
                }
                const start: number = cache.indexOf(child[0]);
                const end: number = subChild.length ? cache.indexOf(subChild[subChild.length - 1]) : cache.indexOf(child[child.length - 1]);
                cache.splice(start, end - (start - 1));
                this.refreshCaches();
            }
        }
    }

    private refreshCaches(): void {
        const page: number = this.parent.pageSettings.currentPage;
        const cache: Row<Column>[] = this.groupCache[parseInt(page.toString(), 10)];
        if (this.parent.enableInfiniteScrolling) {
            this.rowsByUid[parseInt(page.toString(), 10)] = [];
            this.objIdxByUid[parseInt(page.toString(), 10)] = [];
        }
        else {
            this.rowsByUid = {};
            this.objIdxByUid = {};
        }
        for (let i: number = 0; i < cache.length; i++) {
            this.maintainRows(cache[parseInt(i.toString(), 10)], i);
        }
    }

    private getInitialCaptionIndexes(): string[] {
        const page: number = this.parent.pageSettings.currentPage;
        const uids: string[] = [];
        for (let i: number = 0; i < this.initialGroupCaptions[parseInt(page.toString(), 10)].length; i++) {
            uids.push(this.initialGroupCaptions[parseInt(page.toString(), 10)][parseInt(i.toString(), 10)].uid);
        }
        return uids;
    }

    /**
     * @param {string} uid - specifies the uid
     * @returns {number} returns the row object uid
     * @hidden
     */
    public getRowObjectIndexByUid(uid: string): number {
        return this.objIdxByUid[this.parent.pageSettings.currentPage][`${uid}`] as number;
    }

    private collapseShortcut(args: { target: Element, collapse: boolean }): void {
        if (this.parent.groupSettings.columns.length &&
            args.target && parentsUntil(args.target, literals.content) && args.target.parentElement.tagName === 'TR') {
            if (!args.collapse && parentsUntil(args.target, literals.row)) {
                return;
            }
            const row: Element = args.target.parentElement;
            const uid: string = row.getAttribute('data-uid');
            if (args.collapse) {
                const rowObj: Row<Column> = this.getRowByUid(uid);
                const capRow: Row<Column> = this.getRowByUid(rowObj.parentUid);
                if (capRow.isCaptionRow && capRow.isExpand) {
                    const capEle: HTMLTableRowElement = this.getRowElementByUid(rowObj.parentUid);
                    (this.parent as Grid).groupModule.expandCollapseRows(capEle.cells[rowObj.indent - 1]);
                }
            } else {
                const capRow: Row<Column> = this.getRowByUid(uid);
                if (capRow.isCaptionRow && !capRow.isExpand) {
                    const capEle: HTMLTableRowElement = this.getRowElementByUid(uid);
                    (this.parent as Grid).groupModule.expandCollapseRows(capEle.cells[capRow.indent]);
                }
            }
        }
    }

    private getRowByUid(uid: string): Row<Column> {
        return this.rowsByUid[this.parent.pageSettings.currentPage][`${uid}`] as Row<Column>;
    }

    private actionBegin(args: NotifyArgs): void {
        if (!args.cancel) {
            if (!this.requestType.some((value: string) => value === args.requestType)) {
                this.groupCache = {};
                this.resetRowMaintenance();
                if (this.parent.enableVirtualization) {
                    (this.parent.contentModule as VirtualContentRenderer).currentInfo = {};
                }
            }
            if (args.requestType === 'reorder' && this.parent.groupSettings.columns.length) {
                const keys: string[] = Object.keys(this.groupCache);
                for (let j: number = 0; j < keys.length; j++) {
                    const cache: Row<Column>[] = this.groupCache[keys[parseInt(j.toString(), 10)]];
                    for (let i: number = 0; i < cache.length; i++) {
                        if (cache[parseInt(i.toString(), 10)].isCaptionRow && !this.captionModelGen.isEmpty()) {
                            this.changeCaptionRow(cache[parseInt(i.toString(), 10)], null, keys[parseInt(j.toString(), 10)]);
                        }
                        if (cache[parseInt(i.toString(), 10)].isDataRow) {
                            const from: number = (<{ fromIndex?: number }>args).fromIndex + cache[parseInt(i.toString(), 10)].indent;
                            const to: number = (<{ toIndex?: number }>args).toIndex + cache[parseInt(i.toString(), 10)].indent;
                            this.moveCells(cache[parseInt(i.toString(), 10)].cells, from, to);
                        }
                    }
                }
            }
            if (args.requestType === 'delete'
                || ((<{ action?: string }>args).action === 'add' && args.requestType === 'save')) {
                this.groupCache = {};
                this.resetRowMaintenance();
                if (this.parent.enableVirtualization) {
                    (this.parent.contentModule as VirtualContentRenderer).currentInfo = {};
                }
            }
        }
    }

    private actionComplete(args: NotifyArgs): void {
        if (!args.cancel && args.requestType !== 'columnstate' && args.requestType !== 'beginEdit'
            && args.requestType !== 'delete' && args.requestType !== 'save' && args.requestType !== 'reorder'
            && args.requestType !== 'infiniteScroll') {
            this.scrollReset();
        }
    }

    private resetRowMaintenance(): void {
        this.startIndexes = {};
        this.captionCounts = {};
        this.rowsByUid = {};
        this.objIdxByUid = {};
        this.initialGroupCaptions = {};
    }

    private moveCells(arr: Cell<Column>[], from: number, to: number): void {
        if (from >= arr.length) {
            let k: number = from - arr.length;
            while ((k--) + 1) {
                arr.push(undefined);
            }
        }
        arr.splice(from, 0, arr.splice(to, 1)[0]);
    }

    private removeRows(idx: number, trIdx: number, uid?: string): void {
        const page: number = this.parent.pageSettings.currentPage;
        const rows: Row<Column>[] = this.groupCache[parseInt(page.toString(), 10)];
        const trs: Element[] = [].slice.call(this.parent.getContent().querySelectorAll('tr'));
        let aggUid: string;
        let count: number = 0;
        if (this.parent.aggregates.length) {
            const agg: Row<Column>[] = this.getAggregateByCaptionIndex(idx);
            aggUid = agg.length ? agg[agg.length - 1].uid : undefined;
        }
        const indent: number = rows[parseInt(idx.toString(), 10)].indent;
        this.addClass(this.getNextChilds(parseInt(idx.toString(), 10)));
        rows[parseInt(idx.toString(), 10)].isExpand = false;
        if (this.rowsByUid[parseInt(page.toString(), 10)][rows[parseInt(idx.toString(), 10)].uid]) {
            this.rowsByUid[parseInt(page.toString(), 10)][rows[parseInt(idx.toString(), 10)].uid].isExpand = false;
        }
        let capUid: string;
        for (let i: number = idx + 1; i < rows.length; i++) {
            if (rows[parseInt(i.toString(), 10)].indent === indent || rows[parseInt(i.toString(), 10)].indent < indent) {
                capUid = rows[parseInt(i.toString(), 10)].uid;
                break;
            }
            if (rows[parseInt(i.toString(), 10)].isCaptionRow && rows[parseInt(i.toString(), 10)].isExpand) {
                this.addClass(this.getNextChilds(i));
            }
        }
        for (let i: number = trIdx + 1; i < trs.length; i++) {
            if (trs[parseInt(i.toString(), 10)].getAttribute('data-uid') === capUid) {
                break;
            } else if (trs[parseInt(i.toString(), 10)].getAttribute('data-uid') === aggUid) {
                remove(trs[parseInt(i.toString(), 10)]);
                break;
            } else {
                remove(trs[parseInt(i.toString(), 10)]);
                this.refRowsObj[parseInt(page.toString(), 10)].splice(trIdx + 1, 1);
                count = count + 1;
            }
        }
        if (this.parent.enableVirtualization) {
            this.cacheRowsObj[`${uid}`] = this.groupCache[parseInt(page.toString(), 10)].slice(idx + 1, idx + 1 + count);
            this.groupCache[parseInt(page.toString(), 10)].splice(idx + 1, count);
            this.parent.notify(events.refreshVirtualLazyLoadCache, { rows: [], uid: rows[parseInt(idx.toString(), 10)].uid, count: count });
            (this.parent.contentModule as VirtualContentRenderer).setVirtualHeight();
            this.parent.islazyloadRequest = false;
        }
        if (this.parent.scrollModule['content'].scrollTop > this.scrollTopCache && !this.parent.enableVirtualization) {
            this.parent.scrollModule['content'].scrollTop = this.scrollTopCache;
        }
        if (this.parent.getContentTable().scrollHeight < this.parent.getContent().clientHeight && this.parent.height !== 'auto') {
            this.parent.scrollModule.setLastRowCell();
        }
        this.parent.notify(events.refreshExpandandCollapse, { rows: this.refRowsObj[parseInt(page.toString(), 10)] });
    }

    private addClass(rows: Row<Column>[]): void {
        const last: Row<Column> = rows[this.blockSize];
        if (last) {
            last.lazyLoadCssClass = 'e-lazyload-middle-down';
        }
    }

    private getNextChilds(index: number, rowObjects?: Row<Column>[]): Row<Column>[] {
        const group: Row<Column>[] = this.groupCache[this.parent.pageSettings.currentPage];
        const rows: Row<Column>[] = rowObjects ? rowObjects : group;
        const indent: number = group[parseInt(index.toString(), 10)].indent + 1;
        const childRows: Row<Column>[] = [];
        for (let i: number = rowObjects ? 0 : index + 1; i < rows.length; i++) {
            if (rows[parseInt(i.toString(), 10)].indent < indent) {
                break;
            }
            if (rows[parseInt(i.toString(), 10)].indent === indent) {
                childRows.push(rows[parseInt(i.toString(), 10)]);
            }
        }
        return childRows;
    }

    private lazyLoadHandler(args:
    {
        data: Object[], count: number, level: number, index: number, isRowExist: boolean,
        isScroll: boolean, up?: boolean, rowIndex?: number
    }
    ): void {
        this.setStartIndexes();
        const tr: HTMLElement = this.parent.getContent().querySelectorAll('tr')[args.index];
        const uid: string = tr.getAttribute('data-uid');
        const captionIndex: number = this.getRowObjectIndexByUid(uid);
        const captionRow: IRow<Column> = this.groupCache[this.parent.pageSettings.currentPage][parseInt(captionIndex.toString(), 10)];
        let rows: Row<Column>[] = args.isRowExist ? args.isScroll ? this.scrollData
            : this.parent.enableVirtualization ? this.cacheRowsObj[`${uid}`] :
                this.getChildRowsByParentIndex(captionIndex, true, true, null, true) : [];
        this.scrollData = [];
        if (!args.isRowExist) {
            this.setRowIndexes(captionIndex, captionRow);
            this.refreshCaptionRowCount(
                this.groupCache[this.parent.pageSettings.currentPage][parseInt(captionIndex.toString(), 10)], args.count);
            if (Object.keys(args.data).indexOf('GroupGuid') !== -1) {
                for (let i: number = 0; i < args.data.length; i++) {
                    const data: Row<Column> = this.groupGenerator.generateCaptionRow(
                        args.data[parseInt(i.toString(), 10)] as GroupedData, args.level, captionRow.parentGid, undefined, 0, captionRow.uid
                    );
                    rows.push(data);
                    if (this.parent.aggregates.length) {
                        rows = rows.concat(
                            <Row<Column>[]>(this.summaryModelGen.generateRows(
                                args.data[parseInt(i.toString(), 10)],
                                { level: args.level + 1, parentUid: data.uid }))
                        );
                    }
                }
            } else {
                this.groupGenerator.index = this.getStartIndex(captionIndex, args.isScroll);
                rows = this.groupGenerator.generateDataRows(args.data, args.level, captionRow.parentGid, 0, captionRow.uid);
            }
        }
        const trIdx: number = args.isScroll ? this.rowIndex : args.index;
        const nxtChild: Row<Column>[] = this.getNextChilds(captionIndex, rows);
        const lastRow: boolean = !args.up ? this.hasLastChildRow(args.isScroll, args.count, nxtChild.length) : true;
        if (!args.isRowExist && !lastRow) {
            nxtChild[this.blockSize].lazyLoadCssClass = 'e-lazyload-middle-down';
        }
        if (!lastRow) {
            nxtChild[nxtChild.length - 1].lazyLoadCssClass = 'e-not-lazyload-end';
        }
        const aggregates: Row<Column>[] = !args.isScroll && !args.isRowExist ? this.getAggregateByCaptionIndex(captionIndex) : [];
        if (!args.up) {
            if (!args.isRowExist || (this.parent.enableVirtualization && args.isRowExist && this.cacheRowsObj[`${uid}`])) {
                this.refreshRowObjects(rows, args.isScroll ? this.rowObjectIndex : captionIndex);
            }
        }

        if (this.parent.enableVirtualization) {
            const uid: string  = args.isScroll ? this.groupCache[this.parent.pageSettings.currentPage][this.rowIndex].uid : captionRow.uid;
            this.parent.notify(events.refreshVirtualLazyLoadCache, { rows: rows, uid: uid });
            (this.parent.contentModule as VirtualContentRenderer).setVirtualHeight();
            (this.parent.contentModule as VirtualContentRenderer).isTop = false;
        }
        this.render(trIdx, rows, lastRow, aggregates);
        if (this.isFirstChildRow && !args.up) {
            this.parent.getContent().firstElementChild.scrollTop = rows.length * this.parent.getRowHeight();
        }
        this.isFirstChildRow = false;
        this.rowIndex = undefined;
        this.rowObjectIndex = undefined;
        this.childCount = 0;
        for (let i: number = 0; i < rows.length; i++) {
            this.refRowsObj[this.parent.pageSettings.currentPage].splice(captionIndex + i + 1, 0, rows[parseInt(i.toString(), 10)]);
        }
        if (lastRow && tr.querySelector('.e-lastrowcell')) {
            (this.parent as Grid).groupModule.lastCaptionRowBorder();
        }
        this.parent.notify(events.refreshExpandandCollapse, { rows: this.refRowsObj[this.parent.pageSettings.currentPage] });
        if (this.parent.enableVirtualMaskRow) {
            this.parent.removeMaskRow();
        }
    }

    private setRowIndexes(capIdx: number, row: IRow<Column>): void {
        if (!this.captionCounts[this.parent.pageSettings.currentPage]) {
            this.captionCounts[this.parent.pageSettings.currentPage] = {} as number[];
        }
        if (row.isCaptionRow) {
            this.captionCounts[this.parent.pageSettings.currentPage][row.uid] = (row.data as GroupedData).count;
        }
    }

    private getStartIndex(capIdx: number, isScroll: boolean): number {
        const page: number = this.parent.pageSettings.currentPage;
        const cache: Row<Column>[] = this.groupCache[parseInt(page.toString(), 10)];
        if (isScroll) {
            return cache[this.rowObjectIndex].index + 1;
        }
        let count: number = 0;
        let idx: number = 0;
        const prevCapRow: Row<Column> = this.getRowByUid(cache[parseInt(capIdx.toString(), 10)].parentUid);
        if (prevCapRow) {
            idx = this.prevCaptionCount(prevCapRow);
        }
        if (cache[parseInt(capIdx.toString(), 10)].indent > 0) {
            for (let i: number = capIdx - 1; i >= 0; i--) {
                if (cache[parseInt(i.toString(), 10)].indent < cache[parseInt(capIdx.toString(), 10)].indent) {
                    break;
                }
                if (cache[parseInt(i.toString(), 10)].isCaptionRow && cache[parseInt(i.toString(), 10)]
                    .indent === cache[parseInt(capIdx.toString(), 10)].indent) {
                    count = count + (cache[parseInt(i.toString(), 10)].data as GroupedData).count;
                }
            }
        }
        const index: number = count + idx
            + this.startIndexes[parseInt(page.toString(), 10)][(cache[parseInt(capIdx.toString(), 10)] as IRow<Column>).parentGid];
        return index;
    }

    private prevCaptionCount(prevCapRow: Row<Column>): number {
        const page: number = this.parent.pageSettings.currentPage;
        const cache: Row<Column>[] = this.groupCache[parseInt(page.toString(), 10)];
        let idx: number = 0;
        for (let i: number = cache.indexOf(prevCapRow) - 1; i >= 0; i--) {
            if (cache[parseInt(i.toString(), 10)].indent === 0) {
                break;
            }
            if (cache[parseInt(i.toString(), 10)].indent < prevCapRow.indent) {
                break;
            }
            if (cache[parseInt(i.toString(), 10)].isCaptionRow && cache[parseInt(i.toString(), 10)].indent === prevCapRow.indent) {
                const count: number = this.captionCounts[parseInt(page.toString(), 10)][cache[parseInt(i.toString(), 10)].uid];
                idx = idx + (count ? count : (cache[parseInt(i.toString(), 10)].data as GroupedData).count);
            }
        }
        const capRow: Row<Column> = this.getRowByUid(prevCapRow.parentUid);
        if (capRow) {
            idx = idx + this.prevCaptionCount(capRow);
        }
        return idx;
    }

    private setStartIndexes(): void {
        const cache: Row<Column>[] = this.groupCache[this.parent.pageSettings.currentPage];
        if (!this.startIndexes[this.parent.pageSettings.currentPage]) {
            const indexes: number[] = [];
            let idx: number;
            for (let i: number = 0; i < cache.length; i++) {
                if (cache[parseInt(i.toString(), 10)].isCaptionRow) {
                    if (!indexes.length) {
                        indexes.push(0);
                    } else {
                        indexes.push((cache[parseInt(idx.toString(), 10)].data as GroupedData).count + indexes[indexes.length - 1]);
                    }
                    idx = i;
                }
            }
            this.startIndexes[this.parent.pageSettings.currentPage] = indexes;
        }
    }

    private hasLastChildRow(isScroll: boolean, captionCount: number, rowCount: number): boolean {
        return isScroll ? captionCount === this.childCount + rowCount : captionCount === rowCount;
    }

    private refreshCaptionRowCount(row: Row<Column>, count: number): void {
        (row.data as GroupedData).count = count;
    }

    private render(trIdx: number, rows: Row<Column>[], hasLastChildRow: boolean, aggregates: Row<Column>[]): void {
        const tr: HTMLElement = this.parent.getContent().querySelectorAll('tr')[parseInt(trIdx.toString(), 10)];
        const scrollEle: Element = this.parent.getContent().firstElementChild;
        const rowHeight: number = this.parent.getRowHeight();
        if (tr && aggregates.length) {
            for (let i: number = aggregates.length - 1; i >= 0; i--) {
                tr.insertAdjacentElement('afterend', this.rowRenderer.render(aggregates[parseInt(i.toString(), 10)], this.parent.getColumns()));
            }
        }
        if (tr && rows.length) {
            for (let i: number = rows.length - 1; i >= 0; i--) {
                if (this.confirmRowRendering(rows[parseInt(i.toString(), 10)])) {
                    tr.insertAdjacentElement('afterend', this.rowRenderer.render(rows[parseInt(i.toString(), 10)], this.parent.getColumns()));
                    if (this.isScrollDown) {
                        scrollEle.scrollTop = scrollEle.scrollTop - rowHeight;
                    }
                    if (this.isScrollUp) {
                        scrollEle.scrollTop = scrollEle.scrollTop + rowHeight;
                    }
                }
            }
        }
        this.isScrollDown = false;
        this.isScrollUp = false;
    }

    /**
     * @param {Row<Column>} row - specifies the row
     * @param {number} index - specifies the index
     * @returns {void}
     * @hidden
     */
    public maintainRows(row: Row<Column>, index?: number): void {
        const page: number = this.parent.pageSettings.currentPage;
        if (!this.rowsByUid[parseInt(page.toString(), 10)]) {
            this.rowsByUid[parseInt(page.toString(), 10)] = {} as Row<Column>[];
            this.objIdxByUid[parseInt(page.toString(), 10)] = {} as Row<Column>[];
        }
        if (row.uid) {
            this.rowsByUid[parseInt(page.toString(), 10)][row.uid] = row;
        }
        this.objIdxByUid[parseInt(page.toString(), 10)][row.uid] = index;
    }

    private confirmRowRendering(row: Row<Column>): boolean {
        let check: boolean = true;
        if (isNullOrUndefined(row.indent) && !row.isDataRow && !row.isCaptionRow) {
            const cap: Row<Column> = this.getRowByUid(row.parentUid);
            if (cap.isCaptionRow && !cap.isExpand) {
                check = false;
            }
        }
        return check;
    }

    private refreshRowObjects(newRows: Row<Column>[], index: number): void {
        const page: number = this.parent.pageSettings.currentPage;
        const rowsObject: Row<Column>[] = this.groupCache[parseInt(page.toString(), 10)];
        this.rowsByUid[parseInt(page.toString(), 10)] = {} as Row<Column>[];
        this.objIdxByUid[parseInt(page.toString(), 10)] = {} as Row<Column>[];
        const newRowsObject: Row<Column>[] = [];
        let k: number = 0;
        for (let i: number = 0; i < rowsObject.length; i++) {
            if (i === index) {
                this.maintainRows(rowsObject[parseInt(i.toString(), 10)], k);
                newRowsObject.push(rowsObject[parseInt(i.toString(), 10)]);
                k++;
                for (let j: number = 0; j < newRows.length; j++) {
                    this.maintainRows(newRows[parseInt(j.toString(), 10)], k);
                    newRowsObject.push(newRows[parseInt(j.toString(), 10)]);
                    k++;
                }
            } else {
                this.maintainRows(rowsObject[parseInt(i.toString(), 10)], k);
                newRowsObject.push(rowsObject[parseInt(i.toString(), 10)]);
                k++;
            }
        }
        this.groupCache[this.parent.pageSettings.currentPage] = extend([], newRowsObject) as Row<Column>[];
        this.updateCurrentViewData();
    }

    private getAggregateByCaptionIndex(index: number): Row<Column>[] {
        const cache: Row<Column>[] = this.groupCache[this.parent.pageSettings.currentPage];
        const parent: Row<Column> = cache[parseInt(index.toString(), 10)];
        const indent: number = parent.indent;
        const uid: string = parent.uid;
        const agg: Row<Column>[] = [];
        for (let i: number = index + 1; i < cache.length; i++) {
            if (cache[parseInt(i.toString(), 10)].indent === indent) {
                break;
            }
            if (isNullOrUndefined(cache[parseInt(i.toString(), 10)].indent) && cache[parseInt(i.toString(), 10)].parentUid === uid) {
                agg.push(cache[parseInt(i.toString(), 10)]);
            }
        }
        return agg;
    }

    private getChildRowsByParentIndex(
        index: number, deep?: boolean, block?: boolean, data?: Row<Column>[],
        includeAgg?: boolean, includeCollapseAgg?: boolean
    ): Row<Column>[] {
        const cache: Row<Column>[] = data ? data : this.groupCache[this.parent.pageSettings.currentPage];
        const parentRow: Row<Column> = cache[parseInt(index.toString(), 10)];
        let agg: Row<Column>[] = [];
        if (!parentRow.isCaptionRow || (parentRow.isCaptionRow && !parentRow.isExpand && !includeCollapseAgg)) {
            return [];
        }
        if (includeAgg && this.parent.aggregates.length) {
            agg = this.getAggregateByCaptionIndex(index);
        }
        const indent: number = parentRow.indent;
        const uid: string = parentRow.uid;
        let rows: Row<Column>[] = [];
        let count: number = 0;
        for (let i: number = index + 1; i < cache.length; i++) {
            if (cache[parseInt(i.toString(), 10)].parentUid === uid) {
                if (isNullOrUndefined(cache[parseInt(i.toString(), 10)].indent)) {
                    continue;
                }
                count++;
                rows.push(cache[parseInt(i.toString(), 10)]);
                if (deep && cache[parseInt(i.toString(), 10)].isCaptionRow) {
                    rows = rows.concat(this.getChildRowsByParentIndex(i, deep, block, data, includeAgg));
                }
                if (block && count === this.pageSize) {
                    break;
                }
            }
            if (cache[parseInt(i.toString(), 10)].indent === indent) {
                break;
            }
        }
        return rows.concat(agg);
    }

    /**
     * @param {boolean} isReorder - specifies the isreorder
     * @returns {Row<Column>[]} returns the row
     * @hidden
     */
    public initialGroupRows(isReorder?: boolean): Row<Column>[] {
        let rows: Row<Column>[] = [];
        const cache: Row<Column>[] = this.groupCache[this.parent.pageSettings.currentPage];
        if (isReorder) {
            return this.getRenderedRowsObject();
        }
        for (let i: number = 0; i < cache.length; i++) {
            if (cache[parseInt(i.toString(), 10)].indent === 0) {
                rows.push(cache[parseInt(i.toString(), 10)]);
                rows = rows.concat(this.getChildRowsByParentIndex(i, true, true, cache, true));
            }
        }
        return rows;
    }

    /**
     * @returns {Row<Column>[]} retruns the row
     * @hidden */
    public getRenderedRowsObject(): Row<Column>[] {
        const rows: Row<Column>[] = [];
        const trs: HTMLTableRowElement[] = [].slice.call(this.parent.getContent().querySelectorAll('tr'));
        for (let i: number = 0; i < trs.length; i++) {
            rows.push(this.getRowByUid(trs[parseInt(i.toString(), 10)].getAttribute('data-uid')));
        }
        return rows;
    }

    private getCacheRowsOnDownScroll(index: number): Row<Column>[] {
        let rows: Row<Column>[] = [];
        const rowsObject: Row<Column>[] = this.groupCache[this.parent.pageSettings.currentPage];
        let k: number = index;
        for (let i: number = 0; i < this.pageSize; i++) {
            if (!rowsObject[parseInt(k.toString(), 10)] || rowsObject[parseInt(k.toString(), 10)]
                .indent < rowsObject[parseInt(index.toString(), 10)].indent) {
                break;
            }
            if (rowsObject[parseInt(k.toString(), 10)].indent === rowsObject[parseInt(index.toString(), 10)].indent) {
                rows.push(rowsObject[parseInt(k.toString(), 10)]);
                if (rowsObject[parseInt(k.toString(), 10)].isCaptionRow && rowsObject[parseInt(k.toString(), 10)].isExpand) {
                    rows = rows.concat(this.getChildRowsByParentIndex(k, true, true, null, true));
                }
            }
            if (rowsObject[parseInt(k.toString(), 10)].indent > rowsObject[parseInt(index.toString(), 10)].indent
                || isNullOrUndefined(rowsObject[parseInt(k.toString(), 10)].indent)) {
                i--;
            }
            k++;
        }
        return rows;
    }

    private getCacheRowsOnUpScroll(start: string, end: string, index: number): Row<Column>[] {
        let rows: Row<Column>[] = [];
        const rowsObject: Row<Column>[] = this.groupCache[this.parent.pageSettings.currentPage];
        let str: boolean = false;
        for (let i: number = 0; i < rowsObject.length; i++) {
            if (str && (!rowsObject[parseInt(i.toString(), 10)] || rowsObject[parseInt(i.toString(), 10)]
                .indent < rowsObject[parseInt(index.toString(), 10)].indent || rowsObject[parseInt(i.toString(), 10)].uid === end)) {
                break;
            }
            if (!str && rowsObject[parseInt(i.toString(), 10)].uid === start) {
                str = true;
            }
            if (str && rowsObject[parseInt(i.toString(), 10)].indent === rowsObject[parseInt(index.toString(), 10)].indent) {
                rows.push(rowsObject[parseInt(i.toString(), 10)]);
                if (rowsObject[parseInt(i.toString(), 10)].isCaptionRow && rowsObject[parseInt(i.toString(), 10)].isExpand) {
                    rows = rows.concat(this.getChildRowsByParentIndex(i, true, true, null, true));
                }
            }
        }
        return rows;
    }

    private scrollHandler(e: { scrollDown: boolean }): void {
        if (this.parent.isDestroyed || this.childCount) { return; }
        const downTrs: Element[] = [].slice.call(this.parent.getContent().getElementsByClassName('e-lazyload-middle-down'));
        const upTrs: Element[] = [].slice.call(this.parent.getContent().getElementsByClassName('e-lazyload-middle-up'));
        const endTrs: Element[] = [].slice.call(this.parent.getContent().getElementsByClassName('e-not-lazyload-end'));
        let tr: Element;
        let lazyLoadDown: boolean = false; let lazyLoadUp: boolean = false; let lazyLoadEnd: boolean = false;
        if (e.scrollDown && downTrs.length) {
            const result: { entered: boolean, tr: Element } = this.findRowElements(downTrs);
            tr = result.tr;
            lazyLoadDown = result.entered;
        }
        if (!e.scrollDown && endTrs) {
            for (let i: number = 0; i < endTrs.length; i++) {
                const top: number = endTrs[parseInt(i.toString(), 10)].getBoundingClientRect().top;
                const scrollHeight: number = this.parent.getContent().scrollHeight;
                if (top > 0 && top < scrollHeight) {
                    tr = endTrs[parseInt(i.toString(), 10)];
                    lazyLoadEnd = true;
                    this.rowIndex = (tr as HTMLTableRowElement).rowIndex;
                    break;
                }
            }
        }
        if (!e.scrollDown && upTrs.length && !lazyLoadEnd) {
            const result: { entered: boolean, tr: Element } = this.findRowElements(upTrs);
            tr = result.tr;
            lazyLoadUp = result.entered;
        }

        if (tr && !tr.classList.contains('e-masked-row')) {
            if (lazyLoadDown && e.scrollDown && lazyLoadDown && tr) {
                this.scrollDownHandler(tr);
            }
            if (!e.scrollDown && lazyLoadEnd && tr) {
                this.scrollUpEndRowHandler(tr);
            }
            if (this.cacheMode && !e.scrollDown && !lazyLoadEnd && lazyLoadUp && tr) {
                this.scrollUpHandler(tr);
            }
        }
    }

    private scrollUpEndRowHandler(tr: Element): void {
        const page: number = this.parent.pageSettings.currentPage;
        const rows: Row<Column>[] = this.groupCache[parseInt(page.toString(), 10)];
        const uid: string = tr.getAttribute('data-uid');
        let index: number = this.rowObjectIndex = this.getRowObjectIndexByUid(uid);
        const idx: number = index;
        const childRow: Row<Column> = rows[parseInt(index.toString(), 10)];
        const parentCapRow: Row<Column> = this.getRowByUid(childRow.parentUid);
        const capRowObjIdx: number = this.getRowObjectIndexByUid(parentCapRow.uid);
        const captionRowEle: Element = this.parent.getContent().querySelector('tr[data-uid=' + parentCapRow.uid + ']');
        const capRowEleIndex: number = (captionRowEle as HTMLTableRowElement).rowIndex;
        const child: Row<Column>[] = this.getChildRowsByParentIndex(capRowObjIdx);
        const childIdx: number = child.indexOf(childRow);
        const currentPage: number = Math.ceil(childIdx / this.pageSize);
        if (currentPage === 1) {
            return;
        }
        this.childCount = currentPage * this.pageSize;
        index = this.getCurrentBlockEndIndex(childRow, index);
        if (this.childCount < (parentCapRow.data as GroupedData).count) {
            tr.classList.remove('e-not-lazyload-end');
            childRow.lazyLoadCssClass = '';
            const isRowExist: boolean = rows[index + 1] ? childRow.indent === rows[index + 1].indent : false;
            this.scrollData = isRowExist ? this.getCacheRowsOnDownScroll(index + 1) : [];
            const key: { fields: string[], keys: string[] } = getGroupKeysAndFields(capRowObjIdx, rows);
            const args: LazyLoadGroupArgs = {
                rowIndex: capRowEleIndex, makeRequest: !isRowExist, groupInfo: parentCapRow, fields: key.fields,
                keys: key.keys, skip: this.childCount, take: this.pageSize, isScroll: true
            };
            if (this.cacheMode && this.childCount >= (this.pageSize * this.cacheBlockSize)) {
                const child: Row<Column>[] = this.getChildRowsByParentIndex(capRowObjIdx);
                const currenBlock: number = Math.ceil((child.indexOf(rows[parseInt(idx.toString(), 10)]) / this.pageSize));
                const removeBlock: number = currenBlock - (this.cacheBlockSize - 1);
                this.removeBlock(uid, isRowExist, removeBlock, child);
                args.cachedRowIndex = (removeBlock * this.pageSize);
            }
            this.captionRowExpand(args);
        } else {
            this.childCount = 0;
        }
    }

    private scrollDownHandler(tr: Element): void {
        const page: number = this.parent.pageSettings.currentPage;
        const rows: Row<Column>[] = this.groupCache[parseInt(page.toString(), 10)];
        const uid: string = tr.getAttribute('data-uid');
        let index: number = this.getRowObjectIndexByUid(uid);
        const idx: number = index;
        const childRow: Row<Column> = rows[parseInt(index.toString(), 10)];
        const parentCapRow: Row<Column> = this.getRowByUid(childRow.parentUid);
        const capRowObjIdx: number = this.getRowObjectIndexByUid(parentCapRow.uid);
        const captionRowEle: Element = this.getRowElementByUid(parentCapRow.uid);
        const capRowEleIndex: number = (captionRowEle as HTMLTableRowElement).rowIndex;
        const child: Row<Column>[] = this.getChildRowsByParentIndex(capRowObjIdx);
        if (child.length === 0) {
            return;
        }
        const childIdx: number = child.indexOf(childRow);
        const currentPage: number = Math.ceil(childIdx / this.pageSize);
        this.childCount = currentPage * this.pageSize;
        if (isNullOrUndefined(child[this.childCount - 1])) {
            return;
        }
        if (this.parent.enableVirtualization) {
            this.parent.islazyloadRequest = true;
        }
        index = this.rowObjectIndex = this.getRowObjectIndexByUid(child[this.childCount - 1].uid);
        const lastchild: Row<Column> = rows[parseInt(index.toString(), 10)];
        const lastRow: HTMLTableRowElement = this.getRowElementByUid(lastchild.uid);
        this.rowIndex = lastRow.rowIndex;
        index = this.getCurrentBlockEndIndex(lastchild, index);
        if (this.childCount === (parentCapRow.data as GroupedData).count) {
            this.parent.islazyloadRequest = false;
        }
        if (this.childCount < (parentCapRow.data as GroupedData).count) {
            const isRowExist: boolean = rows[index + 1] ? childRow.indent === rows[index + 1].indent : false;
            if (isRowExist && !isNullOrUndefined(this.getRowElementByUid(rows[index + 1].uid))) {
                this.parent.islazyloadRequest = false;
                this.childCount = 0;
                return;
            }
            if (currentPage > 1 || !this.cacheMode) {
                tr.classList.remove('e-lazyload-middle-down');
                lastRow.classList.remove('e-not-lazyload-end');
                lastchild.lazyLoadCssClass = '';
            }
            this.scrollData = isRowExist ? this.getCacheRowsOnDownScroll(this.rowObjectIndex + 1) : [];
            const query: { fields: string[], keys: string[] } = getGroupKeysAndFields(capRowObjIdx, rows);
            const args: LazyLoadGroupArgs = {
                rowIndex: capRowEleIndex, makeRequest: !isRowExist, groupInfo: parentCapRow, fields: query.fields,
                keys: query.keys, skip: this.childCount, take: this.pageSize, isScroll: true
            };
            if (this.cacheMode && (this.childCount - this.pageSize) >= (this.pageSize * this.cacheBlockSize)) {
                this.isScrollDown = true;
                const child: Row<Column>[] = this.getChildRowsByParentIndex(capRowObjIdx);
                const currenBlock: number = Math.ceil((child.indexOf(rows[parseInt(idx.toString(), 10)]) / this.pageSize)) - 1;
                const removeBlock: number = (currenBlock - (this.cacheBlockSize - 1)) + 1;
                this.removeBlock(uid, isRowExist, removeBlock, child, lastchild);
                args.cachedRowIndex = (removeBlock * this.pageSize);
            }
            this.captionRowExpand(args);
        } else {
            this.childCount = 0;
            this.parent.islazyloadRequest = false;
        }
    }

    private getCurrentBlockEndIndex(row: Row<Column>, index: number): number {
        const page: number = this.parent.pageSettings.currentPage;
        const rows: Row<Column>[] = this.groupCache[parseInt(page.toString(), 10)];
        if (row.isCaptionRow) {
            if (row.isExpand) {
                const childCount: number = this.getChildRowsByParentIndex(index, true).length;
                this.rowIndex = this.rowIndex + childCount;
            }
            const agg: Row<Column>[] = this.getAggregateByCaptionIndex(index);
            this.rowObjectIndex = this.rowObjectIndex + agg.length;
            let idx: number = index;
            for (let i: number = idx + 1; i < rows.length; i++) {
                if (rows[parseInt(i.toString(), 10)].indent === rows[parseInt(index.toString(), 10)].indent
                    || rows[parseInt(i.toString(), 10)].indent < rows[parseInt(index.toString(), 10)].indent) {
                    index = idx;
                    break;
                } else {
                    idx++;
                }
            }
        }
        return index;
    }

    private removeBlock(uid: string, isRowExist: boolean, removeBlock: number, child: Row<Column>[], lastchild?: Row<Column>): void {
        const page: number = this.parent.pageSettings.currentPage;
        const rows: Row<Column>[] = this.groupCache[parseInt(page.toString(), 10)];
        const uid1: string = child[(((removeBlock + 1) * this.pageSize) - 1) - this.blockSize].uid;
        const uid2: string = child[(removeBlock * this.pageSize) - this.pageSize].uid;
        const uid3: string = child[(removeBlock * this.pageSize)].uid;
        const firstIdx: number = this.getRowObjectIndexByUid(uid1);
        rows[parseInt(firstIdx.toString(), 10)].lazyLoadCssClass = 'e-lazyload-middle-up';
        this.getRowElementByUid(uid1).classList.add('e-lazyload-middle-up');
        if (lastchild) {
            this.getRowElementByUid(uid3).classList.add('e-not-lazyload-first');
            this.getRowByUid(uid3).lazyLoadCssClass = 'e-not-lazyload-first';
            this.getRowByUid(uid2).lazyLoadCssClass = '';
        }
        if (isRowExist) {
            this.removeTopRows(lastchild ? lastchild.uid : uid, uid2, uid3);
        } else {
            this.uid1 = uid2;
            this.uid2 = uid3;
            this.uid3 = lastchild ? lastchild.uid : uid;
        }
    }

    private scrollUpHandler(tr: Element): void {
        const page: number = this.parent.pageSettings.currentPage;
        const rows: Row<Column>[] = this.groupCache[parseInt(page.toString(), 10)];
        const uid: string = tr.getAttribute('data-uid');
        const row: IRow<Column> = this.getRowByUid(uid);
        const index: number = this.rowObjectIndex = this.getRowObjectIndexByUid(uid);
        const parentCapRow: Row<Column> = this.getRowByUid(row.parentUid);
        const capRowObjIdx: number = this.rowIndex = this.getRowObjectIndexByUid(parentCapRow.uid);
        const captionRowEle: Element = this.parent.getRowElementByUID(parentCapRow.uid) as HTMLTableRowElement;
        const capRowEleIndex: number = (captionRowEle as HTMLTableRowElement).rowIndex;
        const child: Row<Column>[] = this.getChildRowsByParentIndex(capRowObjIdx);
        const childIdx: number = child.indexOf(rows[parseInt(index.toString(), 10)]);
        const currenBlock: number = Math.floor((childIdx / this.pageSize));
        let idx: number = this.blockSize;
        if ((this.blockSize * 2) > this.pageSize) {
            idx = (this.blockSize * 2) - this.pageSize;
            idx = this.blockSize - idx;
        }
        const start: string = child[(childIdx - (idx - 1)) - this.pageSize].uid;
        const end: string = child[childIdx - (idx - 1)].uid;
        this.scrollData = this.getCacheRowsOnUpScroll(start, end, index - (idx - 1));
        this.isFirstChildRow = currenBlock > 1;
        if (this.isFirstChildRow) {
            this.scrollData[0].lazyLoadCssClass = 'e-not-lazyload-first';
        }
        this.getRowByUid(end).lazyLoadCssClass = '';
        this.getRowElementByUid(end).classList.remove('e-not-lazyload-first');
        const removeBlock: number = currenBlock + this.cacheBlockSize;
        if (child.length !== (parentCapRow.data as GroupedData).count && (removeBlock * this.pageSize > child.length)) {
            this.isFirstChildRow = false;
            this.scrollData[0].lazyLoadCssClass = '';
            this.getRowElementByUid(end).classList.add('e-not-lazyload-first');
            return;
        }
        const count: number = removeBlock * this.pageSize > (parentCapRow.data as GroupedData).count
            ? (parentCapRow.data as GroupedData).count : removeBlock * this.pageSize;
        const size: number = removeBlock * this.pageSize > (parentCapRow.data as GroupedData).count
            ? (this.pageSize - ((this.pageSize * removeBlock) - (parentCapRow.data as GroupedData).count)) : this.pageSize;
        const childRows: Row<Column>[] = this.getChildRowsByParentIndex(rows.indexOf(child[count - 1]), true, false, null, true);
        const uid1: string = childRows.length ? childRows[childRows.length - 1].uid : child[(count - 1)].uid;
        const uid2: string = child[count - size].uid;
        const uid3: string = child[(count - size) - 1].uid;
        const lastIdx: number = this.objIdxByUid[parseInt(page.toString(), 10)][`${uid2}`] - idx;
        if (rows[parseInt(lastIdx.toString(), 10)].lazyLoadCssClass === 'e-lazyload-middle-down') {
            const trEle: Element = this.getRowElementByUid(rows[parseInt(lastIdx.toString(), 10)].uid);
            if (trEle) {
                trEle.classList.add('e-lazyload-middle-down');
            }
        }
        this.getRowByUid(uid1).lazyLoadCssClass = '';
        this.getRowByUid(uid3).lazyLoadCssClass = 'e-not-lazyload-end';
        this.getRowElementByUid(uid3).classList.add('e-not-lazyload-end');
        this.removeBottomRows(uid1, uid2, uid3);
        this.rowIndex = (tr as HTMLTableRowElement).rowIndex - idx;
        if (tr.classList.length > 1) {
            tr.classList.remove('e-lazyload-middle-up');
        } else {
            tr.removeAttribute('class');
        }
        if (!isNullOrUndefined(this.getRowElementByUid(start))) {
            this.childCount = 0;
            this.scrollData = [];
            return;
        }
        const key: { fields: string[], keys: string[] } = getGroupKeysAndFields(this.getRowObjectIndexByUid(parentCapRow.uid), rows);
        const args: LazyLoadGroupArgs = {
            rowIndex: capRowEleIndex, makeRequest: false, groupInfo: parentCapRow, fields: key.fields,
            keys: key.keys, skip: this.childCount, take: this.pageSize, isScroll: true, scrollUp: true
        };
        this.isScrollUp = true;
        this.captionRowExpand(args);
    }

    private findRowElements(rows: Element[]): { entered: boolean, tr: Element } {
        let entered: boolean = false; let tr: Element;
        for (let i: number = 0; i < rows.length; i++) {
            let rowIdx: number = (rows[parseInt(i.toString(), 10)] as HTMLTableRowElement).rowIndex;
            if (this.parent.enableVirtualization) {
                const currentInfo: VirtualInfo = (this.parent.contentModule as VirtualContentRenderer).currentInfo;
                if (currentInfo && currentInfo.blockIndexes && currentInfo.blockIndexes[0] > 1 ) {
                    rowIdx = rowIdx + ((this.parent.contentModule as VirtualContentRenderer).offsets[currentInfo.blockIndexes[0] - 1] /
                        this.parent.getRowHeight());
                }
            }
            if (isRowEnteredInGrid(rowIdx, this.parent)) {
                entered = true;
                this.rowIndex = rowIdx;
                tr = rows[parseInt(i.toString(), 10)];
                break;
            }
        }
        return { entered, tr };
    }

    private getRowElementByUid(uid: string): HTMLTableRowElement {
        return this.parent.getContent().querySelector('tr[data-uid=' + uid + ']');
    }

    private removeTopRows(uid1: string, uid2: string, uid3: string): void {
        const trs: Element[] = [].slice.call(this.parent.getContent().querySelectorAll('tr'));
        let start: boolean = false;
        for (let i: number = 0; i < trs.length; i++) {
            if (trs[parseInt(i.toString(), 10)].getAttribute('data-uid') === uid3) {
                const tr: HTMLTableRowElement = this.parent.getContent().querySelector('tr[data-uid=' + uid1 + ']') as HTMLTableRowElement;
                if (tr) {
                    this.rowIndex = tr.rowIndex;
                }
                break;
            }
            if (trs[parseInt(i.toString(), 10)].getAttribute('data-uid') === uid2) {
                start = true;
            }
            if (start) {
                remove(trs[parseInt(i.toString(), 10)]);
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private removeBottomRows(uid1: string, uid2: string, uid3: string): void {
        const trs: Element[] = [].slice.call(this.parent.getContent().querySelectorAll('tr'));
        let trigger: boolean = false;
        for (let i: number = 0; i < trs.length; i++) {
            if (trs[parseInt(i.toString(), 10)].getAttribute('data-uid') === uid2) {
                trigger = true;
            }
            if (trigger) {
                remove(trs[parseInt(i.toString(), 10)]);
                if (trs[parseInt(i.toString(), 10)].getAttribute('data-uid') === uid1) {
                    break;
                }
            }
        }
    }

    private setCache(e?: { args: NotifyArgs, data: Row<Column>[] }): void {
        const page: number = this.parent.pageSettings.currentPage;
        if (this.parent.enableVirtualization) {
            this.parent.lazyLoadRender = this;
        }
        if (this.parent.enableInfiniteScrolling && e.args.requestType === 'infiniteScroll' &&
            e.args['prevPage'] !== e.args['currentPage']) {
            this.groupCache[parseInt(page.toString(), 10)] = this.initialGroupCaptions[parseInt(page.toString(), 10)] = this.groupCache[e.args['prevPage']]
                .concat(extend([], e.data) as Row<Column>[]);
            const groupCacheKeys: string[] = Object.keys(this.groupCache);
            for (let i: number = 0; i < groupCacheKeys.length; i++) {
                if (e.args['currentPage'] !== parseInt(groupCacheKeys[parseInt(i.toString(), 10)], 10)) {
                    delete this.groupCache[`${groupCacheKeys[parseInt(i.toString(), 10)]}`];
                    delete this.initialGroupCaptions[`${groupCacheKeys[parseInt(i.toString(), 10)]}`];
                }
            }
        }
        else {
            this.groupCache[parseInt(page.toString(), 10)] =
                this.initialGroupCaptions[parseInt(page.toString(), 10)] = extend([], e.data) as Row<Column>[];
        }
    }

    private captionRowExpand(args: LazyLoadGroupArgs): void {
        const captionRow: Row<Column> = args.groupInfo;
        const level: number = this.parent.groupSettings.columns.indexOf((captionRow.data as GroupedData).field) + 1;
        const pred: Predicate = generateExpandPredicates(args.fields, args.keys, this);
        const predicateList: Predicate[] = getPredicates(pred);
        const lazyLoad: Object = { level: level, skip: args.skip, take: args.take, where: predicateList };
        args.lazyLoadQuery = lazyLoad;
        args.requestType = 'onDemandGroupInfo';
        if (args.makeRequest) {
            const query: Query = this.parent.renderModule.data.generateQuery(true);
            if (!query.isCountRequired) {
                query.isCountRequired = true;
            }
            query.lazyLoad.push({ key: 'onDemandGroupInfo', value: lazyLoad });
            this.lazyLoadQuery.push(lazyLoad['where']);
            if (args.isScroll && this.parent.enableVirtualMaskRow) {
                this.parent.showMaskRow();
            } else {
                this.parent.showSpinner();
            }
            this.parent.renderModule.data.getData(args, query).then((e: ReturnType) => {
                if (this.parent.enableVirtualization) {
                    this.parent.islazyloadRequest = true;
                }
                this.parent.hideSpinner();
                this.parent.removeMaskRow();
                if (e.result.length === 0) {
                    return;
                }
                if (this.cacheMode && this.uid1 && this.uid2) {
                    this.removeTopRows(this.uid3, this.uid1, this.uid2);
                    this.uid1 = this.uid2 = this.uid3 = undefined;
                }
                this.lazyLoadHandler(
                    {
                        data: e.result, count: e.count, level: level, index: args.rowIndex,
                        isRowExist: false, isScroll: args.isScroll, up: false, rowIndex: args.cachedRowIndex
                    });
            })
                .catch((e: ReturnType) => this.parent.renderModule.dataManagerFailure(e, { requestType: 'grouping' }));
        } else {
            this.lazyLoadHandler(
                {
                    data: null, count: (args.groupInfo.data as GroupedData).count, level: level, index: args.rowIndex,
                    isRowExist: true, isScroll: args.isScroll, up: args.scrollUp, rowIndex: args.cachedRowIndex
                });
        }
    }

    private scrollReset(top?: number): void {
        this.parent.getContent().firstElementChild.scrollTop = top ? this.parent.getContent().firstElementChild.scrollTop + top : 0;
    }

    private updateCurrentViewData(): void {
        const records: Object[] = [];
        this.getRows().filter((row: Row<Column>) => {
            if (row.isDataRow) {
                records[row.index] = row.data;
            }
        });
        this.parent.currentViewData = records.length ? records : this.parent.currentViewData;
    }

    /**
     * @returns {Row<Column>[]} returns the row
     * @hidden */
    public getGroupCache(): { [x: number]: Row<Column>[] } {
        return this.groupCache;
    }

    /**
     * @returns {Row<Column>[]} returns the row
     * @hidden */
    public getRows(): Row<Column>[] {
        return this.groupCache[this.parent.pageSettings.currentPage] || [];
    }

    /**
     * @returns {Element} returns the element
     * @hidden */
    public getRowElements(): Element[] {
        return [].slice.call(this.parent.getContent().getElementsByClassName(literals.row));
    }

    /**
     * @param {number} index - specifies the index
     * @returns {Element} returns the element
     * @hidden
     */
    public getRowByIndex(index: number): Element {
        const tr: Element[] = [].slice.call(this.parent.getContent().getElementsByClassName(literals.row));
        let row: Element;
        for (let i: number = 0; !isNullOrUndefined(index) && i < tr.length; i++) {
            const rowIndex: number = parseInt(tr[parseInt(i.toString(), 10)].getAttribute(literals.ariaRowIndex), 10);
            if (rowIndex && rowIndex - 1 === index) {
                row = tr[parseInt(i.toString(), 10)];
                break;
            }
        }
        return row;
    }

    /**
     * Tucntion to set the column visibility
     *
     * @param {Column[]} columns - specifies the column
     * @returns {void}
     * @hidden
     */

    public setVisible(columns?: Column[]): void {
        const gObj: IGrid = this.parent;
        const rows: Row<Column>[] = this.getRows();
        let testRow: Row<Column>;
        rows.some((r: Row<Column>) => { if (r.isDataRow) { testRow = r; } return r.isDataRow; });
        const contentrows: Row<Column>[] = this.getRows().filter((row: Row<Column>) => !row.isDetailRow);
        for (let i: number = 0; i < columns.length; i++) {
            const column: Column = columns[parseInt(i.toString(), 10)];
            const idx: number = this.parent.getNormalizedColumnIndex(column.uid);
            const colIdx: number = this.parent.getColumnIndexByUid(column.uid);
            const displayVal: string = column.visible === true ? '' : 'none';
            const colGroup: Element = this.getColGroup();
            if (idx !== -1 && testRow && idx < testRow.cells.length && !isNullOrUndefined(colGroup)) {
                setStyleAttribute(<HTMLElement>colGroup.childNodes[parseInt(idx.toString(), 10)], { 'display': displayVal });
            }
            this.setDisplayNone(gObj.getDataRows(), colIdx, displayVal, contentrows, idx);
            if (!this.parent.invokedFromMedia && column.hideAtMedia) {
                this.parent.updateMediaColumns(column);
            }
            this.parent.invokedFromMedia = false;
        }
    }

    /**
     * Function to set display.
     *
     * @param {Object} tr - specifies the row object
     * @param {number} idx - specifies the index
     * @param {string} displayVal - specifies the display value
     * @param {Row<Column>[]} rows - specifies the array of rows
     * @param {number} oriIdx - specifies the index
     * @returns {void}
     * @hidden
     */
    public setDisplayNone(tr: Object, idx: number, displayVal: string, rows: Row<Column>[], oriIdx?: number): void {
        if (!this.parent.groupSettings.columns.length) {
            setDisplayValue(tr, idx, displayVal, rows);
        } else {
            let isColSpanAdded: boolean = false;
            if (this.parent.enableVirtualization && this.parent.groupSettings.enableLazyLoading &&
                    (<{vgenerator?: Row<Column>[]}>this.parent.contentModule).vgenerator) {
                const vgenerator: Record<string, Row<Column>[]> =
                    (<{ vgenerator?: { cache?: Record<string, Row<Column>[]> }}>this.parent.contentModule).vgenerator.cache;
                const cacheKeys: string[] = Object.keys(vgenerator);
                const visibleColumnsLength: number = this.parent.getVisibleColumns().length;
                for (let i: number = 0; i < cacheKeys.length; i++) {
                    const cacheRows: Row<Column>[] = vgenerator[cacheKeys[parseInt(i.toString(), 10)]];
                    for (let k: number = 0; k < cacheRows.length; k++) {
                        const cacheRow: Row<Column> = cacheRows[parseInt(k.toString(), 10)];
                        if (cacheRow.isCaptionRow) {
                            cacheRow.cells[cacheRow.indent + 1].colSpan = this.parent.enableColumnVirtualization ? 1 :
                                (visibleColumnsLength + this.parent.groupSettings.columns.length
                                    + (this.parent.detailTemplate || this.parent.childGrid ? 1 : 0) - cacheRow.indent
                                    + (visibleColumnsLength ? -1 : 0));
                        }
                        if (cacheRow.isDataRow) {
                            cacheRow.cells[parseInt(oriIdx.toString(), 10)].visible = displayVal === '' ? true : false;
                        }
                    }
                }
                isColSpanAdded = true;
            }
            const keys: string[] = Object.keys(this.groupCache);
            for (let j: number = 0; j < keys.length; j++) {
                const uids: Row<Column>[] = this.rowsByUid[keys[parseInt(j.toString(), 10)]] as Row<Column>[];
                if (!isNullOrUndefined(uids)) {
                    const idxs: string[] = Object.keys(uids);
                    for (let i: number = 0; i < idxs.length; i++) {
                        const tr: HTMLTableRowElement = this.parent.getContent()
                            .querySelector('tr[data-uid=' + idxs[parseInt(i.toString(), 10)] + ']');
                        const row: Row<Column> = uids[idxs[parseInt(i.toString(), 10)]];
                        if (row.isCaptionRow) {
                            if (!this.captionModelGen.isEmpty()) {
                                this.changeCaptionRow(row, tr, keys[parseInt(j.toString(), 10)]);
                            } else {
                                if (!isColSpanAdded) {
                                    row.cells[row.indent + 1].colSpan = displayVal === '' ? row.cells[row.indent + 1].colSpan + 1
                                        : row.cells[row.indent + 1].colSpan - 1;
                                }
                                if (tr) {
                                    tr.cells[row.indent + 1].colSpan = row.cells[row.indent + 1].colSpan;
                                }
                            }
                        }
                        if (row.isDataRow) {
                            this.showAndHideCells(tr, idx, displayVal, false);
                            row.cells[parseInt(oriIdx.toString(), 10)].visible = displayVal === '' ? true : false;
                        }
                        if (!row.isCaptionRow && !row.isDataRow && isNullOrUndefined(row.indent)) {
                            row.cells[parseInt(oriIdx.toString(), 10)].visible = displayVal === '' ? true : false;
                            row.visible = row.cells.some((cell: Cell<AggregateColumnModel>) => cell.isDataCell && cell.visible);
                            this.showAndHideCells(tr, idx, displayVal, true, row);
                        }
                    }
                }
            }
        }
    }

    private changeCaptionRow(row: Row<Column>, tr: HTMLTableRowElement, index: string): void {
        const capRow: IRow<Column> = row;
        const captionData: GroupedData = row.data as GroupedData;
        const data: Row<Column> = this.groupGenerator.generateCaptionRow(
            captionData, capRow.indent, capRow.parentGid, undefined, capRow.tIndex, capRow.parentUid
        );
        data.uid = row.uid;
        data.isExpand = row.isExpand;
        data.lazyLoadCssClass = row.lazyLoadCssClass;
        this.rowsByUid[parseInt(index.toString(), 10)][row.uid] = data;
        this.groupCache[parseInt(index.toString(), 10)][this.objIdxByUid[parseInt(index.toString(), 10)][row.uid]] = data;
        if (tr) {
            const tbody: Element = this.parent.getContentTable().querySelector( literals.tbody);
            tbody.replaceChild(this.rowRenderer.render(data, this.parent.getColumns()), tr);
        }
    }

    private showAndHideCells(tr: HTMLTableRowElement, idx: number, displayVal: string, isSummary: boolean, row?: Row<Column>): void {
        if (tr) {
            const cls: string = isSummary ? 'td.e-summarycell' : 'td.e-rowcell';
            setStyleAttribute(tr.querySelectorAll(cls)[parseInt(idx.toString(), 10)] as HTMLElement, { 'display': displayVal });
            if (tr.querySelectorAll(cls)[parseInt(idx.toString(), 10)].classList.contains('e-hide')) {
                removeClass([tr.querySelectorAll(cls)[parseInt(idx.toString(), 10)]], ['e-hide']);
            }
            if (isSummary) {
                if (row.visible && tr.classList.contains('e-hide')) {
                    removeClass([tr], ['e-hide']);
                } else if (!row.visible) {
                    addClass([tr], ['e-hide']);
                }
            }
        }
    }
}
