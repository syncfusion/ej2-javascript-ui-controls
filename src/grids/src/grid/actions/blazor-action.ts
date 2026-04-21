import { IGrid, ActionArgs, NotifyArgs } from '../base/interface';
import { Observer, isBlazor, isNullOrUndefined } from '@syncfusion/ej2-base';
import * as events from '../base/constant';
import { Column } from '../models/column';
import { Row } from '../models/row';
import { AriaService } from '../services/aria-service';
import { Cell } from '../models/cell';
import { CellType, AggregateType } from '../base/enum';
import { ReturnType } from '../base/type';
import { AggregateRow } from '../models/aggregate';
import { DataUtil } from '@syncfusion/ej2-data';
import { VirtualContentRenderer } from '../renderer/virtual-content-renderer';
import { SortSettingsModel, GroupSettingsModel } from '../base/grid-model';
import { PageSettingsModel } from '../models/models';

export const gridObserver: Observer = new Observer();

/**
 * BlazorAction is used for performing Blazor related Grid Actions.
 *
 * @hidden
 */
export class BlazorAction {
    private parent: IGrid;

    private aria: AriaService = new AriaService();
    private actionArgs: ActionArgs = {};
    private dataSourceChanged: boolean;
    private virtualContentModule: VirtualContentRenderer;
    private virtualHeight: number = 0;

    constructor(parent?: IGrid) {
        this.parent = parent;
        this.addEventListener();
    }

    public addEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on('detailclick', this.onDetailRowClick, this);
        this.parent.on('add-delete-success', this.addDeleteSuccess, this);
        this.parent.on('editsuccess', this.editSuccess, this);
        this.parent.on('setvisibility', this.setColumnVisibility, this);
        this.parent.on('offset', this.setServerOffSet, this);
        this.parent.on('updateaction', this.modelChanged, this);
        this.parent.on(events.modelChanged, this.modelChanged, this);
        this.parent.on('group-expand-collapse', this.onGroupClick, this);
        this.parent.on('setcolumnstyles', this.setColVTableWidthAndTranslate, this);
        this.parent.on('refresh-virtual-indices', this.invokeServerDataBind, this);
        this.parent.on('contentcolgroup', this.contentColGroup, this);
        this.parent.on(events.dataSourceModified, this.dataSourceModified, this);
    }

    public removeEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('detailclick', this.onDetailRowClick);
        this.parent.off('add-delete-success', this.addDeleteSuccess);
        this.parent.off('editsuccess', this.editSuccess);
        this.parent.off('setvisibility', this.setColumnVisibility);
        this.parent.off('offset', this.setServerOffSet);
        this.parent.off('updateaction', this.modelChanged);
        this.parent.off(events.modelChanged, this.modelChanged);
        this.parent.off('group-expand-collapse', this.onGroupClick);
        this.parent.off('setcolumnstyles', this.setColVTableWidthAndTranslate);
        this.parent.off('refresh-virtual-indices', this.invokeServerDataBind);
        this.parent.off('contentcolgroup', this.contentColGroup);
        this.parent.off(events.dataSourceModified, this.dataSourceModified);
    }

    public getModuleName(): string { return 'blazor'; }

    public modelChanged(args: ActionArgs): void {
        this.actionArgs = args;
        this.parent.currentAction = args;
    }

    public addDeleteSuccess(args: NotifyArgs): void {

        const action: string = 'action';
        const data: string = 'data';
        const index: string = 'index';
        const editArgs: Object = {
            requestType: args.requestType,
            data: args[`${data}`],
            action: args[`${action}`]
        };
        if (!isNullOrUndefined(args[`${index}`])) {
            editArgs[`${index}`] = args[`${index}`];
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        args.promise.then((e: ReturnType) => this.editSuccess(editArgs)
        ).catch((e: Error) => {
            if (isBlazor() && this.parent.isServerRendered) {
                const error: string = 'error';
                const message: string = 'message';
                if (!isNullOrUndefined(e[`${error}`]) && !isNullOrUndefined(e[`${error}`][`${message}`])) {
                    e[`${error}`] = e[`${error}`][`${message}`];
                }
            }
            this.parent.trigger(events.actionFailure, ((isBlazor() && e instanceof Array) ? e[0] : e));
            this.parent.hideSpinner();
            this.parent.log('actionfailure', { error: e });
        });
    }
    public editSuccess(args: ActionArgs): void {
        this.parent.renderModule.resetTemplates();
        this.invokeServerDataBind(args);
    }

    public invokeServerDataBind(args: ActionArgs): void {
        this.actionArgs = args;
        this.parent.currentAction = args;
        this.parent.allowServerDataBinding = true;
        this.parent.serverDataBind();
        this.parent.allowServerDataBinding = false;
    }

    public onDetailRowClick(target: Element): void {
        const gObj: IGrid = this.parent;
        const adaptor: string = 'interopAdaptor'; const rIndex: string = 'rowIndex';
        const invokeMethodAsync: string = 'invokeMethodAsync';
        const tr: HTMLTableRowElement = target.parentElement as HTMLTableRowElement;
        const uid: string = tr.getAttribute('data-uid');
        const rowObj: Row<Column> = gObj.getRowObjectFromUID(uid);
        const args: Object = {
            uid: uid, classList: target.classList[0], index: (parseInt(tr.getAttribute('aria-rowindex'), 10) - 1).toString(),
            rowIndex: gObj.getRowsObject().indexOf(rowObj), colSpan: this.parent.getVisibleColumns().length
        };
        gObj[`${adaptor}`][`${invokeMethodAsync}`]('OnDetailClick', args);
        if (target.classList.contains('e-detailrowcollapse')) {
            const rows: Row<Column>[] = gObj.getRowsObject();
            const rowData: Object = rowObj.data;
            const gridRowId: string = this.parent.getRowUid('grid-row');
            const len: number = gObj.groupSettings.columns.length;
            const gridRow: Row<Column> = new Row<Column>({
                isDataRow: true,
                isExpand: true,
                uid: gridRowId,
                isDetailRow: true,
                cells: [new Cell<Column>({ cellType: CellType.Indent }), new Cell<Column>({ isDataCell: true, visible: true })]
            });
            for (let i: number = 0; i < len; i++) {
                gridRow.cells.unshift(new Cell({ cellType: CellType.Indent }));
            }
            rows.splice(args[`${rIndex}`] + 1, 0, gridRow);
            gObj.trigger(events.detailDataBound, { data: rowData});
            gObj.notify(events.detailDataBound, { rows: gObj.getRowsObject() });
            rowObj.isExpand = true;
            this.aria.setExpand(target as HTMLElement, true);
        } else {
            gObj.getRowsObject().splice(args[`${rIndex}`] + 1, 1);
            gObj.notify(events.detailDataBound, { rows: gObj.getRowsObject() });
            rowObj.isExpand = false;
            this.aria.setExpand(target as HTMLElement, false);
        }
    }

    public setColumnVisibility(columns: Column[]): void {
        const visible: Object = {};
        const adaptor: string = 'interopAdaptor';
        const invokeMethodAsync: string = 'invokeMethodAsync';
        for (let i: number = 0; i < columns.length; i++) {
            visible[columns[parseInt(i.toString(), 10)].uid] = columns[parseInt(i.toString(), 10)].visible;
        }
        this.parent[`${adaptor}`][`${invokeMethodAsync}`]('setColumnVisibility', {visible: visible});
    }

    public dataSuccess(args: ReturnType): void {
        if (this.parent.enableVirtualization && Object.keys(this.actionArgs).length === 0) {
            this.actionArgs.requestType = 'virtualscroll';
        }
        const startIndex: string = 'startIndex'; const endIndex: string = 'endIndex';
        this.actionArgs[`${startIndex}`] = args[`${startIndex}`];
        this.actionArgs[`${endIndex}`] = args[`${endIndex}`];
        if (this.parent.enableVirtualization) {
            this.virtualContentModule = (<VirtualContentRenderer>this.parent.contentModule);
            if (this.virtualContentModule.activeKey === 'downArrow' || this.virtualContentModule.activeKey === 'upArrow') {
                const row: Element = this.parent.getRowByIndex(this.virtualContentModule.blzRowIndex);
                if (row) {
                    this.parent.selectRow(parseInt(row.getAttribute('aria-rowindex'), 10) - 1);
                    // eslint-disable-next-line
                    ((<HTMLTableRowElement>row).cells[0] as any).focus({ preventScroll: true });
                }
            }
            this.virtualContentModule.blazorDataLoad = false;
        }
        if (args.foreignColumnsData) {
            const columns: Column[] = this.parent.getColumns();
            for (let i: number = 0; i < columns.length; i++) {
                if (args.foreignColumnsData[columns[parseInt(i.toString(), 10)].field]) {
                    columns[parseInt(i.toString(), 10)].columnData = args.foreignColumnsData[columns[parseInt(i.toString(), 10)].field];
                }
            }
        }
        if (this.parent.allowGrouping && this.parent.groupSettings.columns) {
            const agg: Object[] = [];
            const aggRows: AggregateRow | Object[] = this.parent.aggregates;
            for (let i: number = 0; i < aggRows.length; i++) {
                const aggRow: AggregateRow = aggRows[parseInt(i.toString(), 10)] as AggregateRow;
                for ( let j: number = 0; j < aggRow.columns.length; j++) {
                    let aggr: Object = {};
                    const type: string | AggregateType[] = aggRow.columns[parseInt(j.toString(), 10)].type.toString();
                    aggr = { type: type.toLowerCase(), field: aggRow.columns[parseInt(j.toString(), 10)].field };
                    agg.push(aggr);
                }
            }
            let data: Object[];
            let aggrds: Object[];
            const groupedCols: string[] = this.parent.groupSettings.columns;
            for ( let k: number = 0; k < groupedCols.length; k++) {
                aggrds = data ? data : args.result;
                data = DataUtil.group(aggrds, groupedCols[parseInt(k.toString(), 10)], agg, null, null);
            }
            args.result = data ? data : args.result;
        }
        const rowUid: string = 'rowUid';
        const offsetTime: string = 'offsetTime'; const off: string = 'offset';
        this.parent[`${rowUid}`] = args[`${rowUid}`];
        args[`${off}`] = Math.sign(args[`${off}`]) === 1 ? -Math.abs(args[`${off}`]) : Math.abs(args[`${off}`]);
        this.parent[`${offsetTime}`] = args[`${off}`];
        if (this.parent[`${offsetTime}`] !== new Date().getTimezoneOffset() / 60) {
            if (this.parent.editSettings.mode !== 'Batch') {
                const action: string = 'action';
                const rowIndex: string = 'rowIndex';
                const index: string = 'index';
                if (this.actionArgs[`${action}`] === 'edit') {
                    this.setClientOffSet(args, this.actionArgs[`${rowIndex}`]);
                } else if (this.actionArgs[`${action}`] === 'add') {
                    this.setClientOffSet(args, this.actionArgs[`${index}`]);
                }
            } else if (this.parent.editSettings.mode === 'Batch') {
                const changes: string = 'changes';
                const changedRecords: string = 'changedRecords';
                const addedRecords: string = 'addedRecords';
                const keyField: string = this.parent.getPrimaryKeyFieldNames()[0];
                const batchChanges: Object = this.actionArgs[`${changes}`] || { changedRecords: [], addedRecords: [] };
                for (let i: number = 0; i < batchChanges[`${changedRecords}`].length; i++) {
                    for (let j: number = 0; j < args.result.length; j++) {
                        if (batchChanges[`${changedRecords}`][parseInt(i.toString(), 10)][`${keyField}`] === args.result[parseInt(j.toString(), 10)][`${keyField}`]) {
                            this.setClientOffSet(args, j);
                        }
                    }
                }
                for (let i: number = 0; i < batchChanges[`${addedRecords}`].length; i++) {
                    for (let j: number = 0; j < args.result.length; j++) {
                        if (batchChanges[`${addedRecords}`][parseInt(i.toString(), 10)][`${keyField}`] === args.result[parseInt(j.toString(), 10)][`${keyField}`]) {
                            this.setClientOffSet(args, j);
                        }
                    }
                }
            }
        }
        this.parent.renderModule.dataManagerSuccess(args, <NotifyArgs>this.actionArgs);
        this.parent.getMediaColumns();
        if (this.parent.enableVirtualization) {
            this.virtualContentModule = (<VirtualContentRenderer>this.parent.contentModule);
            this.setColVTableWidthAndTranslate();
            if (this.parent.groupSettings.columns.length) {
                this.virtualContentModule.setVirtualHeight(this.virtualHeight);
            }
        }
        this.actionArgs = this.parent.currentAction = {};
    }

    public removeDisplayNone(): void {
        const renderedContentRows: NodeListOf<HTMLElement> = this.parent.getContentTable().querySelectorAll('tr');
        for (let i: number = 0; i < renderedContentRows.length; i++) {
            const renderedContentCells: NodeListOf<HTMLElement> = renderedContentRows[parseInt(i.toString(), 10)].querySelectorAll('td');
            for (let j: number = 0; j < renderedContentCells.length; j++) {
                renderedContentCells[parseInt(j.toString(), 10)].style.display = '';
            }
        }
    }

    public setVirtualTrackHeight(args: {VisibleGroupedRowsCount: number}): void {
        this.virtualHeight = args.VisibleGroupedRowsCount * this.parent.getRowHeight();
        this.virtualContentModule.setVirtualHeight(this.virtualHeight);
    }

    public setColVTableWidthAndTranslate(args?: {refresh: boolean}): void {
        if (this.parent.enableColumnVirtualization && this.virtualContentModule.prevInfo &&
            (JSON.stringify(this.virtualContentModule.currentInfo.columnIndexes) !==
            JSON.stringify(this.virtualContentModule.prevInfo.columnIndexes)) || ((args && args.refresh))) {
            const translateX: number = this.virtualContentModule.getColumnOffset(this.virtualContentModule.startColIndex - 1);
            const width: string =  this.virtualContentModule.getColumnOffset(this.virtualContentModule.endColIndex - 1) - translateX + '';
            this.virtualContentModule.header.virtualEle.setWrapperWidth(width);
            this.virtualContentModule.virtualEle.setWrapperWidth(width);
            this.virtualContentModule.header.virtualEle.adjustTable(translateX, 0);
            this.parent.getContentTable().parentElement.style.width = width + 'px';
        }
        if (this.dataSourceChanged) {
            this.virtualContentModule.getPanel().firstElementChild.scrollTop = 0;
            this.virtualContentModule.getPanel().firstElementChild.scrollLeft = 0;
            if (this.virtualContentModule.header.virtualEle) {
                this.virtualContentModule.header.virtualEle.adjustTable(0, 0);
            }
            this.parent.getContentTable().parentElement.style.transform = 'translate(0px,0px)';
            this.virtualContentModule.refreshOffsets();
            this.virtualContentModule.refreshVirtualElement();
            this.dataSourceChanged = false;
        }
    }

    private dataSourceModified(): void {
        this.dataSourceChanged = true;
    }

    private setClientOffSet(args: ReturnType, index: number): void {
        const timeZone: number = DataUtil.serverTimezoneOffset;
        DataUtil.serverTimezoneOffset = 0;
        args.result[parseInt(index.toString(), 10)] = DataUtil.parse.parseJson(JSON.stringify(args.result[parseInt(index.toString(), 10)]));
        DataUtil.serverTimezoneOffset = timeZone;
    }

    private setServerOffSet(args: Object): void {
        const serverTimeZone: number = DataUtil.serverTimezoneOffset;
        const offsetTime: string = 'offsetTime';
        const data: string = 'data';
        const timeZone: number = new Date().getTimezoneOffset() / 60 * 2 + this.parent[`${offsetTime}`];
        DataUtil.serverTimezoneOffset = timeZone;
        args[`${data}`] = DataUtil.parse.parseJson(JSON.stringify(args[`${data}`]));
        DataUtil.serverTimezoneOffset = serverTimeZone;
    }

    public onGroupClick(args: object): void {
        const adaptor: string = 'interopAdaptor'; const content: string = 'contentModule';
        const invokeMethodAsync: string = 'invokeMethodAsync';
        const exactTopIndex: string = 'exactTopIndex';
        args[`${exactTopIndex}`] = Math.round((this.parent.element.querySelector('.e-content').scrollTop) / this.parent.getRowHeight());
        const rowHeight: string = 'rowHeight';
        args[`${rowHeight}`] = this.parent.getRowHeight();
        this.parent[`${adaptor}`][`${invokeMethodAsync}`]('OnGroupExpandClick', args).then(() => {
            this.parent[`${content}`].rowElements = [].slice.call(this.parent.getContentTable().querySelectorAll('tr.e-row[data-uid]'));
        });
    }

    public setPersistData(args: Object): void {
        const gObj: IGrid = this.parent;
        gObj.mergePersistGridData(args);
        const bulkChanges: string = 'bulkChanges';
        if (gObj[`${bulkChanges}`].columns) {
            delete gObj[`${bulkChanges}`].columns;
        }
        gObj.headerModule.refreshUI();
        gObj.notify('persist-data-changed', {});
        gObj.notify(events.columnVisibilityChanged, gObj.getColumns());
    }

    public resetPersistData(args: string): void {
        const gObj: IGrid = this.parent;
        const bulkChanges: string = 'bulkChanges';
        const parseArgs: IGrid = JSON.parse(args);
        const persistArgs: {filterSettings: Object, groupSettings: GroupSettingsModel, pageSettings: PageSettingsModel,
            sortSettings: SortSettingsModel, searchSettings: Object, columns: Object} = {filterSettings: parseArgs.filterSettings,
            groupSettings: parseArgs.groupSettings, pageSettings: parseArgs.pageSettings, sortSettings: parseArgs.sortSettings,
            searchSettings: parseArgs.searchSettings, columns: parseArgs.columns};
        if (!persistArgs.sortSettings.columns) {
            persistArgs.sortSettings.columns = [];
        }
        if (!persistArgs.groupSettings.columns) {
            persistArgs.groupSettings.columns = [];
        }
        if (!persistArgs.pageSettings.currentPage) {
            gObj.pageSettings.currentPage = 1;
        }
        for (let i: number = 0; i < gObj.columns.length; i++) {
            if (gObj.groupSettings.columns.indexOf((gObj.columns[parseInt(i.toString(), 10)] as Column).field) > -1) {
                (gObj.columns[parseInt(i.toString(), 10)] as Column).visible = true;
            }
        }
        gObj.mergePersistGridData(persistArgs);
        gObj.notify('persist-data-changed', {});
        if (gObj[`${bulkChanges}`].columns) {
            delete gObj[`${bulkChanges}`].columns;
        }
        gObj.headerModule.refreshUI();
        for (let i: number = 0; i < gObj.columns.length; i++) {
            (gObj.columns[parseInt(i.toString(), 10)] as Column).editType = (gObj.columns[parseInt(i.toString(), 10)] as Column)
                .editType.toLowerCase();
        }
        gObj.setProperties({filterSettings: {columns: []}}, true);
    }

    private contentColGroup(): void {
        const gObj: IGrid = this.parent;
        const contentTable: Element = gObj.getContent().querySelector('.e-table');
        contentTable.insertBefore(contentTable.querySelector(`#content-${gObj.element.id}colGroup`), contentTable.querySelector('tbody'));
        if (gObj.frozenRows) {
            const headerTable: Element =  gObj.getHeaderContent().querySelector('.e-table');
            headerTable.insertBefore(headerTable.querySelector(`#${gObj.element.id}colGroup`), headerTable.querySelector('tbody'));
        }
    }

    public dataFailure(args: { result: Object[] }): void {
        this.parent.renderModule.dataManagerFailure(args, <NotifyArgs>this.actionArgs);
        this.actionArgs = this.parent.currentAction = {};
    }

    public destroy(): void {
        this.removeEventListener();
    }
}
