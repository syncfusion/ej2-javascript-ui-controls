import { L10n, NumberFormatOptions } from '@syncfusion/ej2-base';
import { remove } from '@syncfusion/ej2-base';
import { isNullOrUndefined, extend, DateFormatOptions } from '@syncfusion/ej2-base';
import { DataManager, Group, Query, Deferred, Predicate, DataUtil } from '@syncfusion/ej2-data';
import { IGrid, NotifyArgs, IValueFormatter } from '../base/interface';
import { ValueFormatter } from '../services/value-formatter';
import { RenderType, CellType, Action } from '../base/enum';
import { ReturnType } from '../base/type';
import { Data } from '../actions/data';
import { Column } from '../models/column';
import { Row } from '../models/row';
import { Cell } from '../models/cell';
import { AggregateRowModel, AggregateColumnModel } from '../models/models';
import * as events from '../base/constant';
import { prepareColumns, setFormatter, getDatePredicate, getObject } from '../base/util';
import { ServiceLocator } from '../services/service-locator';
import { RendererFactory } from '../services/renderer-factory';
import { CellRendererFactory } from '../services/cell-render-factory';
import { ContentRender } from '../renderer/content-renderer';
import { HeaderRender } from '../renderer/header-renderer';
import { CellRenderer } from '../renderer/cell-renderer';
import { HeaderCellRenderer } from '../renderer/header-cell-renderer';
import { StackedHeaderCellRenderer } from '../renderer/stacked-cell-renderer';
import { IndentCellRenderer } from '../renderer/indent-cell-renderer';
import { GroupCaptionCellRenderer, GroupCaptionEmptyCellRenderer } from '../renderer/caption-cell-renderer';
import { ExpandCellRenderer } from '../renderer/expand-cell-renderer';
import { HeaderIndentCellRenderer } from '../renderer/header-indent-renderer';
import { DetailHeaderIndentCellRenderer } from '../renderer/detail-header-indent-renderer';
import { DetailExpandCellRenderer } from '../renderer/detail-expand-cell-renderer';
import { AriaService } from '../services/aria-service';
import { PredicateModel } from '../base/grid-model';

/**
 * Content module is used to render grid content
 * @hidden
 */
export class Render {
    //Internal variables              
    private isColTypeDef: boolean;
    //Module declarations
    private parent: IGrid;
    private locator: ServiceLocator;
    private headerRenderer: HeaderRender;
    private contentRenderer: ContentRender;
    private l10n: L10n;
    public data: Data;
    private ariaService: AriaService;
    private renderer: RendererFactory;
    private emptyGrid: boolean = false;
    private isLayoutRendered: boolean;

    /**
     * Constructor for render module
     */
    constructor(parent?: IGrid, locator?: ServiceLocator) {
        this.parent = parent;
        this.locator = locator;
        this.data = new Data(parent, locator);
        this.l10n = locator.getService<L10n>('localization');
        this.ariaService = this.locator.getService<AriaService>('ariaService');
        this.renderer = this.locator.getService<RendererFactory>('rendererFactory');
        this.addEventListener();
    }

    /**
     * To initialize grid header, content and footer rendering
     */
    public render(): void {
        let gObj: IGrid = this.parent;
        this.headerRenderer = <HeaderRender>this.renderer.getRenderer(RenderType.Header);
        this.contentRenderer = <ContentRender>this.renderer.getRenderer(RenderType.Content);
        this.headerRenderer.renderPanel();
        this.contentRenderer.renderPanel();
        if (gObj.getColumns().length) {
            this.isLayoutRendered = true;
            this.headerRenderer.renderTable();
            this.contentRenderer.renderTable();
            this.emptyRow(false);
        }
        this.refreshDataManager();
    }

    /** 
     * Refresh the entire Grid. 
     * @return {void} 
     */
    public refresh(e: NotifyArgs = { requestType: 'refresh' }): void {
        this.parent.notify(`${e.requestType}-begin`, e);
        this.parent.trigger(events.actionBegin, e);
        if (e.cancel) {
            this.parent.notify(events.cancelBegin, e);
            return;
        }
        this.refreshDataManager(e);
    }

    private refreshComplete(e?: NotifyArgs): void {
        this.parent.trigger(events.actionComplete, e);
    }

    /**
     * The function is used to refresh the dataManager
     * @return {void}
     */
    private refreshDataManager(args: NotifyArgs = {}): void {
        if (args.requestType !== 'virtualscroll') {
            this.parent.showSpinner();
        }
        this.emptyGrid = false;
        let dataManager: Promise<Object>;
        let isFActon: boolean = this.isNeedForeignAction();
        this.ariaService.setBusy(<HTMLElement>this.parent.getContent().firstChild, true);
        if (isFActon) {
            let deffered: Deferred = new Deferred();
            dataManager = this.getFData(deffered);
        }
        if (!dataManager) {
            dataManager = this.data.getData(args as NotifyArgs, this.data.generateQuery().requiresCount());
        } else {
            dataManager = dataManager.then((e: Object) => {
                let query: Query = this.data.generateQuery().requiresCount();
                if (this.emptyGrid) {
                    let def: Deferred = new Deferred();
                    def.resolve(<ReturnType>{ result: [], count: 0 });
                    return def.promise;
                }
                return this.data.getData(args as NotifyArgs, query);
            });
        }
        if (this.parent.getForeignKeyColumns().length && (!isFActon || this.parent.searchSettings.key.length)) {
            let deffered: Deferred = new Deferred();
            dataManager = dataManager.then((e: ReturnType) => {
                this.parent.notify(events.getForeignKeyData, { dataManager: dataManager, result: e, promise: deffered });
                return deffered.promise;
            });
        }
        if (this.parent.groupSettings.disablePageWiseAggregates && this.parent.groupSettings.columns.length) {
            dataManager = dataManager.then((e: ReturnType) => this.validateGroupRecords(e));
        }
        dataManager.then((e: ReturnType) => this.dataManagerSuccess(e, args))
            .catch((e: ReturnType) => this.dataManagerFailure(e, args));
    }

    private getFData(deferred: Deferred): Promise<Object> {
        this.parent.notify(events.getForeignKeyData, { isComplex: true, promise: deferred });
        return deferred.promise;
    }

    private isNeedForeignAction(): boolean {
        let gObj: IGrid = this.parent;
        return !!((gObj.allowFiltering && gObj.filterSettings.columns.length) ||
            (gObj.searchSettings.key.length)) && this.foreignKey(this.parent.getForeignKeyColumns());
    }

    private foreignKey(columns: Column[]): boolean {
        return columns.some((col: Column) => {
            let fbool: boolean = false;
            fbool = this.parent.filterSettings.columns.some((value: PredicateModel) => {
                return col.foreignKeyValue === value.field;
            });
            return !!(fbool || this.parent.searchSettings.key.length);
        });
    }

    private sendBulkRequest(args?: NotifyArgs): void {
        args.requestType = 'batchsave';
        let promise: Promise<Object> = this.data.saveChanges((<{ changes?: Object }>args).changes,
                                                             this.parent.getPrimaryKeyFieldNames()[0],
                                                             (<{ original?: Object }>args).original);
        let query: Query = this.data.generateQuery().requiresCount();
        if (this.data.dataManager.dataSource.offline) {
            this.refreshDataManager({ requestType: 'batchsave' });
            return;
        } else {
            promise.then((e: ReturnType) => {
                this.data.getData(args, query)
                    .then((e: { result: Object[], count: number }) => this.dmSuccess(e, args))
                    .catch((e: { result: Object[] }) => this.dmFailure(e as { result: Object[] }, args));
            })
                .catch((e: { result: Object[] }) => this.dmFailure(e as { result: Object[] }, args));
        }
    }

    private dmSuccess(e: ReturnType, args: NotifyArgs): void {
        this.dataManagerSuccess(e, args);
    }

    private dmFailure(e: { result: Object[] }, args: NotifyArgs): void {
        this.dataManagerFailure(e, args);
    }

    /** 
     * Render empty row to Grid which is used at the time to represent to no records. 
     * @return {void} 
     * @hidden
     */
    public renderEmptyRow(): void {
        this.emptyRow(true);
    }

    private emptyRow(isTrigger?: boolean): void {
        let gObj: IGrid = this.parent;
        let tbody: Element = this.contentRenderer.getTable().querySelector('tbody');
        let tr: Element;
        if (!isNullOrUndefined(tbody)) {
            remove(tbody);
        }
        tbody = this.parent.createElement('tbody');
        tr = this.parent.createElement('tr', { className: 'e-emptyrow' });
        tr.appendChild(this.parent.createElement('td', {
            innerHTML: this.l10n.getConstant('EmptyRecord'),
            attrs: { colspan: gObj.getColumns().length.toString() }
        }));
        tbody.appendChild(tr);
        this.contentRenderer.renderEmpty(<HTMLElement>tbody);
        if (isTrigger) {
            this.parent.trigger(events.dataBound, {});
            this.parent.notify(
                events.onEmpty,
                { rows: [new Row<Column>({ isDataRow: true, cells: [new Cell<Column>({ isDataCell: true, visible: true })] })] }
            );
        }
    }

    private dynamicColumnChange(): void {
        if (this.parent.getCurrentViewRecords().length) {
            this.updateColumnType(this.parent.getCurrentViewRecords()[0]);
        }
    }

    private updateColumnType(record: Object): void {
        let columns: Column[] = this.parent.getColumns() as Column[];
        let value: Date;
        let data: Object = record && (<{ items: Object[] }>record).items ? (<{ items: Object[] }>record).items[0] : record;
        let fmtr: IValueFormatter = this.locator.getService<IValueFormatter>('valueFormatter');
        for (let i: number = 0, len: number = columns.length; i < len; i++) {
            value = getObject(columns[i].field || '', data);
            if (columns[i].isForeignColumn() && columns[i].columnData) {
                value = getObject(columns[i].foreignKeyValue || '', columns[i].columnData[0]);
            }
            if (!isNullOrUndefined(value)) {
                this.isColTypeDef = true;
                if (!columns[i].type) {
                    columns[i].type = value.getDay ? (value.getHours() > 0 || value.getMinutes() > 0 ||
                        value.getSeconds() > 0 || value.getMilliseconds() > 0 ? 'datetime' : 'date') : typeof (value);
                }
            } else {
                columns[i].type = columns[i].type || null;
            }
            let valueFormatter: ValueFormatter = new ValueFormatter();
            if (columns[i].format && ((<DateFormatOptions>columns[i].format).skeleton || (<DateFormatOptions>columns[i].format).format)) {
                columns[i].setFormatter(valueFormatter.getFormatFunction(columns[i].format as DateFormatOptions));
                columns[i].setParser(valueFormatter.getParserFunction(columns[i].format as DateFormatOptions));
            }
            if (typeof (columns[i].format) === 'string') {
                setFormatter(this.locator, columns[i]);
            } else if (!columns[i].format && columns[i].type === 'number') {
                columns[i].setParser(
                    fmtr.getParserFunction({ format: 'n2' } as NumberFormatOptions));
            }
        }
    }

    private dataManagerSuccess(e: ReturnType, args?: NotifyArgs): void {
        let gObj: IGrid = this.parent;
        gObj.trigger(events.beforeDataBound, e);
        let len: number = Object.keys(e.result).length;
        if (this.parent.isDestroyed) { return; }
        if ((!gObj.getColumns().length && !len) && !(gObj.columns.length && gObj.columns[0] instanceof Column)) {
            gObj.hideSpinner();
            return;
        }
        this.parent.isEdit = false;
        this.parent.notify(events.tooltipDestroy, {});
        gObj.currentViewData = <Object[]>e.result;
        if (!len && e.count && gObj.allowPaging) {
            gObj.prevPageMoving = true;
            gObj.pageSettings.totalRecordsCount = e.count;
            gObj.pageSettings.currentPage = Math.ceil(e.count / gObj.pageSettings.pageSize);
            gObj.dataBind();
            return;
        }
        if (!gObj.getColumns().length && len || !this.isLayoutRendered) {
            this.updatesOnInitialRender(e);
        }
        if (!this.isColTypeDef && gObj.getCurrentViewRecords()) {
            this.updateColumnType(gObj.getCurrentViewRecords()[0]);
        }
        this.parent.notify(events.dataReady, extend({ count: e.count, result: e.result, aggregates: e.aggregates }, args));
        if (gObj.groupSettings.columns.length || (args && args.requestType === 'ungrouping')) {
            this.headerRenderer.refreshUI();
        }
        if (len) {
            this.contentRenderer.refreshContentRows(args);
        } else {
            if (!gObj.getColumns().length) {
                gObj.element.innerHTML = '';
                alert(this.l10n.getConstant('EmptyDataSourceError')); //ToDO: change this alert as dialog
                return;
            }
            this.contentRenderer.setRowElements([]);
            this.contentRenderer.setRowObjects([]);
            this.renderEmptyRow();
            if (args) {
                let action: string = (args.requestType || '').toLowerCase() + '-complete';
                this.parent.notify(action, args);
            }
            this.parent.hideSpinner();
        }
        this.parent.notify(events.toolbarRefresh, {});
    }

    private dataManagerFailure(e: { result: Object[] }, args: NotifyArgs): void {
        this.ariaService.setOptions(<HTMLElement>this.parent.getContent().firstChild, { busy: false, invalid: true });
        this.parent.trigger(events.actionFailure, { error: e });
        this.parent.hideSpinner();
        if (args.requestType === 'save' as Action || args.requestType === 'delete' as Action
            || (<{ name: string }>args).name === 'bulk-save' as Action) {
            return;
        }
        this.parent.currentViewData = [];
        this.renderEmptyRow();
    }

    private updatesOnInitialRender(e: { result: Object, count: number }): void {
        this.isLayoutRendered = true;
        if (this.parent.columns.length < 1) {
            this.buildColumns(e.result[0]);
        }
        prepareColumns(this.parent.columns);
        this.headerRenderer.renderTable();
        this.contentRenderer.renderTable();
        this.parent.notify(events.autoCol, {});
    }

    private buildColumns(record: Object): void {
        let columns: string[] = Object.keys(record);
        let cols: Column[] = [];
        for (let i: number = 0, len: number = columns.length; i < len; i++) {
            cols[i] = { 'field': columns[i] } as Column;
            if (this.parent.enableColumnVirtualization) {
                cols[i].width = !isNullOrUndefined(cols[i].width) ? cols[i].width : 200;
            }
        }
        this.parent.columns = cols;
    }

    private instantiateRenderer(): void {
        this.renderer.addRenderer(RenderType.Header, new HeaderRender(this.parent, this.locator));
        this.renderer.addRenderer(RenderType.Content, new ContentRender(this.parent, this.locator));

        let cellrender: CellRendererFactory = this.locator.getService<CellRendererFactory>('cellRendererFactory');
        cellrender.addCellRenderer(CellType.Header, new HeaderCellRenderer(this.parent, this.locator));
        cellrender.addCellRenderer(CellType.Data, new CellRenderer(this.parent, this.locator));
        cellrender.addCellRenderer(CellType.StackedHeader, new StackedHeaderCellRenderer(this.parent, this.locator));
        cellrender.addCellRenderer(CellType.Indent, new IndentCellRenderer(this.parent, this.locator));
        cellrender.addCellRenderer(CellType.GroupCaption, new GroupCaptionCellRenderer(this.parent, this.locator));
        cellrender.addCellRenderer(CellType.GroupCaptionEmpty, new GroupCaptionEmptyCellRenderer(this.parent, this.locator));
        cellrender.addCellRenderer(CellType.Expand, new ExpandCellRenderer(this.parent, this.locator));
        cellrender.addCellRenderer(CellType.HeaderIndent, new HeaderIndentCellRenderer(this.parent, this.locator));
        cellrender.addCellRenderer(CellType.StackedHeader, new StackedHeaderCellRenderer(this.parent, this.locator));
        cellrender.addCellRenderer(CellType.DetailHeader, new DetailHeaderIndentCellRenderer(this.parent, this.locator));
        cellrender.addCellRenderer(CellType.DetailExpand, new DetailExpandCellRenderer(this.parent, this.locator));

    }

    private addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.initialLoad, this.instantiateRenderer, this);
        this.parent.on(events.modelChanged, this.refresh, this);
        this.parent.on(events.refreshComplete, this.refreshComplete, this);
        this.parent.on(events.bulkSave, this.sendBulkRequest, this);
        this.parent.on(events.showEmptyGrid, () => { this.emptyGrid = true; }, this);
        this.parent.on(events.autoCol, this.dynamicColumnChange, this);
    }

    /** @hidden */
    public validateGroupRecords(e: ReturnType): Promise<Object> {
        let index: number = e.result.length - 1;
        if (index < 0) { return Promise.resolve(e); }
        let group0: Group = <Group>e.result[0];
        let groupN: Group = <Group>e.result[index]; let predicate: Predicate[] = [];
        let addWhere: (query: Query) => void =
            (input: Query) => {
                [group0, groupN].forEach((group: Group) =>
                    predicate.push(new Predicate('field', '==', group.field).and(this.getPredicate('key', 'equal', group.key))));
                input.where(Predicate.or(predicate));
            };
        let query: Query = new Query(); addWhere(query);
        let curDm: DataManager = new DataManager(e.result as JSON[]);
        let curFilter: Object[] = <Object[]>curDm.executeLocal(query);
        let newQuery: Query = this.data.generateQuery(true); let rPredicate: Predicate[] = [];
        if (this.data.isRemote()) {
            [group0, groupN].forEach((group: Group) =>
                rPredicate.push(this.getPredicate(group.field, 'equal', group.key)));
            newQuery.where(Predicate.or(rPredicate));
        } else {
            addWhere(newQuery);
        }
        let deferred: Deferred = new Deferred();
        this.data.getData({}, newQuery).then((r: ReturnType) => {
            this.updateGroupInfo(curFilter, r.result);
            deferred.resolve(e);
        }).catch((e: Object) => deferred.reject(e));
        return deferred.promise;
    }

    private getPredicate(key: string, operator: string, value: string | number | Date): Predicate {
        if (value instanceof Date) {
            return getDatePredicate({ field: key, operator: operator, value: value });
        }
        return new Predicate(key, operator, value);
    }

    private updateGroupInfo(current: Object[], untouched: Object[]): Object[] {
        let dm: DataManager = new DataManager(<JSON[]>untouched);
        current.forEach((element: Group, index: number, array: Object[]) => {
            let uGroup: Group = dm.executeLocal(new Query()
                .where(new Predicate('field', '==', element.field).and(this.getPredicate('key', 'equal', element.key))))[0];
            element.count = uGroup.count; let itemGroup: Group = (<Group>element.items); let uGroupItem: Group = (<Group>uGroup.items);
            if (itemGroup.GroupGuid) {
                element.items = <Object[]>this.updateGroupInfo(element.items, uGroup.items);
            }
            this.parent.aggregates.forEach((row: AggregateRowModel) =>
                row.columns.forEach((column: AggregateColumnModel) => {
                    let types: string[] = column.type instanceof Array ? column.type : [column.type];
                    types.forEach((type: string) => {
                        let key: string = column.field + ' - ' + type.toLowerCase();
                        let data: Object[] = itemGroup.level ? uGroupItem.records : uGroup.items;
                        let context: Object = this.parent;
                        if (type === 'Custom') {
                            let data: Group = itemGroup.level ? uGroupItem : uGroup;
                            element.aggregates[key] = column.customAggregate ?
                                (<Function>column.customAggregate).call(context, data, column) : '';
                        } else {
                            element.aggregates[key] = DataUtil.aggregates[type.toLowerCase()](data, column.field);
                        }
                    });
                }));
        });
        return current;
    }
}

