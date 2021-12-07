import { L10n, NumberFormatOptions } from '@syncfusion/ej2-base';
import { remove, resetBlazorTemplate, blazorTemplates, getValue } from '@syncfusion/ej2-base';
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
import { prepareColumns, setFormatter, isGroupAdaptive, getDatePredicate, getObject, clearReactVueTemplates } from '../base/util';
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
import { GroupLazyLoadRenderer } from '../renderer/group-lazy-load-renderer';
import { AriaService } from '../services/aria-service';
import { PredicateModel } from '../base/grid-model';
import { RowDragDropRenderer } from './row-drag-drop-renderer';
import { RowDragDropHeaderRenderer } from '../renderer/row-drag-header-indent-render';
import * as literals from '../base/string-literals';

/**
 * Content module is used to render grid content
 *
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
    private counter: number = 0;

    /**
     * Constructor for render module
     *
     * @param {IGrid} parent - specifies the IGrid
     * @param {ServiceLocator} locator - specifies the serviceLocator
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
     *
     * @returns {void}
     */
    public render(): void {
        const gObj: IGrid = this.parent;
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
        this.parent.scrollModule.setWidth();
        this.parent.scrollModule.setHeight();
        if (this.parent.height !== 'auto') {
            this.parent.scrollModule.setPadding();
        }
        this.refreshDataManager();
    }

    /**
     * Refresh the entire Grid.
     *
     * @param {NotifyArgs} e - specifies the NotifyArgs
     * @returns {void}
     */
    public refresh(e: NotifyArgs = { requestType: 'refresh' }): void {
        const gObj: IGrid = this.parent;
        gObj.notify(`${e.requestType}-begin`, e);
        gObj.trigger(events.actionBegin, e, (args: NotifyArgs = { requestType: 'refresh' }) => {
            if (args.cancel) {
                gObj.notify(events.cancelBegin, args);
                return;
            }
            if (args.requestType === 'delete' as Action && gObj.allowPaging) {
                const dataLength: number = (<{ data?: NotifyArgs[] }>args).data.length;
                const count: number = gObj.pageSettings.totalRecordsCount - dataLength;
                const currentViewData: number = gObj.getCurrentViewRecords().length;
                // eslint-disable-next-line max-len
                if (!(currentViewData - dataLength) && count && ((gObj.pageSettings.currentPage - 1) * gObj.pageSettings.pageSize) === count) {
                    gObj.prevPageMoving = true;
                    gObj.setProperties({
                        pageSettings: {
                            totalRecordsCount: count, currentPage: Math.ceil(count / gObj.pageSettings.pageSize)
                        }
                    },                 true);
                    gObj.pagerModule.pagerObj.totalRecordsCount = count;
                }
            }
            if (args.requestType === 'reorder' && this.parent.dataSource && 'result' in this.parent.dataSource ) {
                this.contentRenderer.refreshContentRows(args);
            } else if ((args.requestType === 'paging' || args.requestType === 'columnstate' || args.requestType === 'reorder')
                && this.parent.groupSettings.enableLazyLoading && this.parent.groupSettings.columns.length
                && (this.parent.contentModule as GroupLazyLoadRenderer).getGroupCache()[this.parent.pageSettings.currentPage]) {
                this.contentRenderer.refreshContentRows(args);
            } else {
                this.refreshDataManager(args);
            }
        });
    }

    /**
     * @returns {void}
     * @hidden
     */
    public resetTemplates(): void {
        const gObj: IGrid = this.parent;
        const gridColumns: Column[] = gObj.getColumns();
        if (gObj.detailTemplate) {
            const detailTemplateID: string = gObj.element.id + 'detailTemplate';
            blazorTemplates[detailTemplateID] = [];
            resetBlazorTemplate(detailTemplateID, 'DetailTemplate');
        }
        if (gObj.groupSettings.captionTemplate) {
            resetBlazorTemplate(gObj.element.id + 'captionTemplate', 'CaptionTemplate');
        }
        if (gObj.rowTemplate) {
            resetBlazorTemplate(gObj.element.id + 'rowTemplate', 'RowTemplate');
        }
        if (gObj.toolbarTemplate) {
            resetBlazorTemplate(gObj.element.id + 'toolbarTemplate', 'ToolbarTemplate');
        }
        if (gObj.pageSettings.template) {
            resetBlazorTemplate(gObj.element.id + '_template', 'pageSettings');
        }
        for (let i: number = 0; i < gridColumns.length; i++) {
            if (gridColumns[i].template) {
                blazorTemplates[gObj.element.id + gridColumns[i].uid] = [];
                resetBlazorTemplate(gObj.element.id + gridColumns[i].uid, 'Template');
            }
            if (gridColumns[i].headerTemplate) {
                resetBlazorTemplate(gObj.element.id + gridColumns[i].uid + 'headerTemplate', 'HeaderTemplate');
            }
            if (gridColumns[i].filterTemplate) {
                resetBlazorTemplate(gObj.element.id + gridColumns[i].uid + 'filterTemplate', 'FilterTemplate');
            }
        }
        const guid: string = 'guid';
        for (let k: number = 0; k < gObj.aggregates.length; k++) {

            for (let j: number = 0; j < gObj.aggregates[k].columns.length; j++) {
                if (gObj.aggregates[k].columns[j].footerTemplate) {
                    const tempID: string = gObj.element.id + gObj.aggregates[k].columns[j][guid] + 'footerTemplate';
                    resetBlazorTemplate(tempID, 'FooterTemplate');
                }
                if (gObj.aggregates[k].columns[j].groupFooterTemplate) {
                    const tempID: string = gObj.element.id + gObj.aggregates[k].columns[j][guid] + 'groupFooterTemplate';
                    resetBlazorTemplate(tempID, 'GroupFooterTemplate');
                }
                if (gObj.aggregates[k].columns[j].groupCaptionTemplate) {
                    const tempID: string = gObj.element.id + gObj.aggregates[k].columns[j][guid] + 'groupCaptionTemplate';
                    resetBlazorTemplate(tempID, 'GroupCaptionTemplate');
                }
            }
        }
    }
    private refreshComplete(e?: NotifyArgs): void {
        this.parent.trigger(events.actionComplete, e);
    }

    /**
     * The function is used to refresh the dataManager
     *
     * @param {NotifyArgs} args - specifies the args
     * @returns {void}
     */
    private refreshDataManager(args: NotifyArgs = {}): void {
       if (args.requestType !== 'virtualscroll' && !(<{ isCaptionCollapse?: boolean }>args).isCaptionCollapse) {
            this.parent.showSpinner();
        }
        this.parent.notify(events.resetInfiniteBlocks, args);
        this.emptyGrid = false;
        let dataManager: Promise<Object>;
        const isFActon: boolean = this.isNeedForeignAction();
        this.ariaService.setBusy(<HTMLElement>this.parent.getContent().querySelector('.' + literals.content), true);
        if (isFActon) {
            const deffered: Deferred = new Deferred();
            dataManager = this.getFData(deffered, args);
        }
        if (!dataManager) {
            dataManager = this.data.getData(args as NotifyArgs, this.data.generateQuery().requiresCount());
        } else {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            dataManager = dataManager.then((e: Object) => {
                const query: Query = this.data.generateQuery().requiresCount();
                if (this.emptyGrid) {
                    const def: Deferred = new Deferred();
                    def.resolve(<ReturnType>{ result: [], count: 0 });
                    return def.promise;
                }
                return this.data.getData(args as NotifyArgs, query);
            });
        }
        if (this.parent.getForeignKeyColumns().length && (!isFActon || this.parent.searchSettings.key.length)) {
            const deffered: Deferred = new Deferred();
            dataManager = dataManager.then((e: ReturnType) => {
                this.parent.notify(events.getForeignKeyData, { dataManager: dataManager, result: e, promise: deffered, action: args});
                return deffered.promise;
            });
        }
        if (this.parent.groupSettings.disablePageWiseAggregates && this.parent.groupSettings.columns.length) {
            dataManager = dataManager.then((e: ReturnType) => this.validateGroupRecords(e));
        }
        dataManager.then((e: ReturnType) => this.dataManagerSuccess(e, args))
            .catch((e: ReturnType) => this.dataManagerFailure(e, args));
    }

    private getFData(deferred: Deferred, args?: Object): Promise<Object> {
        this.parent.notify(events.getForeignKeyData, { isComplex: true, promise: deferred, action: args });
        return deferred.promise;
    }

    private isNeedForeignAction(): boolean {
        const gObj: IGrid = this.parent;
        return !!((gObj.allowFiltering && gObj.filterSettings.columns.length) ||
            (gObj.searchSettings.key.length)) && this.foreignKey(this.parent.getForeignKeyColumns());
    }

    private foreignKey(columns: Column[]): boolean {
        return columns.some((col: Column) => {
            let fbool: boolean = false;
            fbool = this.parent.filterSettings.columns.some((value: PredicateModel) => {
                return col.uid === value.uid;
            });
            return !!(fbool || this.parent.searchSettings.key.length);
        });
    }

    private sendBulkRequest(args?: NotifyArgs): void {
        args.requestType = 'batchsave';
        const promise: Promise<Object> = this.data.saveChanges(
            (<{ changes?: Object }>args).changes, this.parent.getPrimaryKeyFieldNames()[0],
            (<{ original?: Object }>args).original);
        const query: Query = this.data.generateQuery().requiresCount();
        if (this.data.dataManager.dataSource.offline) {
            this.refreshDataManager({ requestType: 'batchsave' });
            return;
        } else {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
     *
     * @returns {void}
     * @hidden
     */
    public renderEmptyRow(): void {
        this.emptyRow(true);
    }

    public emptyRow(isTrigger?: boolean): void {
        const gObj: IGrid = this.parent;
        let tbody: Element = this.contentRenderer.getTable().querySelector( literals.tbody);
        if (!isNullOrUndefined(tbody)) {
            remove(tbody);
        }
        tbody = this.parent.createElement( literals.tbody);
        let spanCount: number = 0;
        if (gObj.detailTemplate || gObj.childGrid) {
            ++spanCount;
        }
        const tr: Element = this.parent.createElement('tr', { className: 'e-emptyrow' });
        tr.appendChild(this.parent.createElement('td', {
            innerHTML: this.l10n.getConstant('EmptyRecord'),
            attrs: { colspan: (gObj.getVisibleColumns().length + spanCount + gObj.groupSettings.columns.length).toString() }
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
        const columns: Column[] = this.parent.getColumns() as Column[];
        let value: Date;
        const cFormat: string = 'customFormat';
        const equalTo: string = 'equalTo';
        const data: Object = record && (<{ items: Object[] }>record).items ? (<{ items: Object[] }>record).items[0] : record;
        const fmtr: IValueFormatter = this.locator.getService<IValueFormatter>('valueFormatter');
        for (let i: number = 0, len: number = columns.length; i < len; i++) {
            value = getObject(columns[i].field || '', data);
            if (!isNullOrUndefined(columns[i][cFormat])) {
                columns[i].format = columns[i][cFormat];
            }
            if (!isNullOrUndefined(columns[i].validationRules) && !isNullOrUndefined(columns[i].validationRules[equalTo])) {
                columns[i].validationRules[equalTo][0] = this.parent.element.id + columns[i].validationRules[equalTo][0];
            }
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
            const valueFormatter: ValueFormatter = new ValueFormatter();
            if (columns[i].format && ((<DateFormatOptions>columns[i].format).skeleton || ((<DateFormatOptions>columns[i].format).format &&
                typeof (<DateFormatOptions>columns[i].format).format === 'string'))) {
                columns[i].setFormatter(valueFormatter.getFormatFunction(extend({}, columns[i].format as DateFormatOptions)));
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

    /**
     * @param {ReturnType} e - specifies the return type
     * @param {NotifyArgs} args - specifies the Notifyargs
     * @returns {void}
     * @hidden
     */
    // tslint:disable-next-line:max-func-body-length
    public dataManagerSuccess(e: ReturnType, args?: NotifyArgs): void {
        const gObj: IGrid = this.parent;
        this.contentRenderer = <ContentRender>this.renderer.getRenderer(RenderType.Content);
        this.headerRenderer = <HeaderRender>this.renderer.getRenderer(RenderType.Header);
        (<{ actionArgs?: NotifyArgs }>e).actionArgs = args;
        const isInfiniteDelete: boolean = this.parent.enableInfiniteScrolling && !this.parent.infiniteScrollSettings.enableCache
            && (args.requestType === 'delete' || (args.requestType === 'save' && this.parent.infiniteScrollModule.requestType === 'add'));
        // tslint:disable-next-line:max-func-body-length
        gObj.trigger(events.beforeDataBound, e, (dataArgs: ReturnType) => {
            if ((<{ cancel?: boolean }>dataArgs).cancel) {
                return;
            }
            dataArgs.result = isNullOrUndefined(dataArgs.result) ? [] : dataArgs.result;
            const len: number = Object.keys(dataArgs.result).length;
            if (this.parent.isDestroyed) { return; }
            if ((!gObj.getColumns().length && !len) && !(gObj.columns.length && gObj.columns[0] instanceof Column)) {
                gObj.hideSpinner();
                return;
            }
            if (this.isInfiniteEnd(args) && !len) {
                this.parent.notify(events.infiniteEditHandler, { e: args, result: e.result, count: e.count, agg: e.aggregates });
                return;
            }
            this.parent.isEdit = false;
            this.parent.notify(events.editReset, {});
            this.parent.notify(events.tooltipDestroy, {});
            this.contentRenderer.prevCurrentView = this.parent.currentViewData.slice();
            gObj.currentViewData = <Object[]>dataArgs.result;
            gObj.notify(events.refreshInfiniteCurrentViewData, { args: args, data: dataArgs.result });
            if (!len && dataArgs.count && gObj.allowPaging && args && args.requestType !== 'delete' as Action) {
                if (this.parent.groupSettings.enableLazyLoading
                    && (args.requestType === 'grouping' || args.requestType === 'ungrouping')) {
                    this.parent.notify(events.groupComplete, args);
                }
                gObj.prevPageMoving = true;
                gObj.pageSettings.totalRecordsCount = dataArgs.count;
                if (args.requestType !== 'paging' as Action) {
                    gObj.pageSettings.currentPage = Math.ceil(dataArgs.count / gObj.pageSettings.pageSize);
                }
                gObj.dataBind();
                return;
            }
            if ((!gObj.getColumns().length && len || !this.isLayoutRendered) && !isGroupAdaptive(gObj)) {
                this.updatesOnInitialRender(dataArgs);
            }
            if (!this.isColTypeDef && gObj.getCurrentViewRecords()) {
                if (this.data.dataManager.dataSource.offline && gObj.dataSource && (gObj.dataSource as object[]).length) {
                    this.updateColumnType(gObj.dataSource[0]);
                } else { this.updateColumnType(gObj.getCurrentViewRecords()[0]); }
            }
            if (!this.parent.isInitialLoad && this.parent.groupSettings.disablePageWiseAggregates &&
                !this.parent.groupSettings.columns.length) {
                dataArgs.result = this.parent.dataSource instanceof Array ? this.parent.dataSource : this.parent.currentViewData;
            }
            if ((this.parent.isReact || this.parent.isVue) && !isNullOrUndefined(args) && args.requestType !== 'infiniteScroll' && !args.isFrozen) {
                clearReactVueTemplates(this.parent, ['footerTemplate']);
            }
            this.parent.notify(
                events.dataReady,
                extend({ count: dataArgs.count, result: dataArgs.result, aggregates: dataArgs.aggregates }, args));
            if ((gObj.groupSettings.columns.length || (args && args.requestType === 'ungrouping'))
                && (args && args.requestType !== 'filtering')) {
                this.headerRenderer.refreshUI();
            }
            if (len) {
                if (isGroupAdaptive(gObj)) {
                    const content: string = 'content';
                    args.scrollTop = { top: this.contentRenderer[content].scrollTop };
                }
                if (!isInfiniteDelete) {
                    if (this.parent.enableImmutableMode) {
                        this.contentRenderer.immutableModeRendering(args);
                    } else {
                        this.contentRenderer.refreshContentRows(args);
                    }
                } else {
                    this.parent.notify(events.infiniteEditHandler, { e: args, result: e.result, count: e.count, agg: e.aggregates });
                }
            } else {
                if (args && (<{ isCaptionCollapse?: boolean }>args).isCaptionCollapse) { return; }
                if (!gObj.getColumns().length) {
                    gObj.element.innerHTML = '';
                    alert(this.l10n.getConstant('EmptyDataSourceError')); //ToDO: change this alert as dialog
                    return;
                }
                this.contentRenderer.setRowElements([]);
                this.contentRenderer.setRowObjects([]);
                this.ariaService.setBusy(<HTMLElement>this.parent.getContent().querySelector('.' + literals.content), false);
                this.renderEmptyRow();
                if (args) {
                    const action: string = (args.requestType || '').toLowerCase() + '-complete';
                    this.parent.notify(action, args);
                    if (args.requestType === 'batchsave') {
                        args.cancel = false;
                        args.rows = [];
                        args.isFrozen = this.parent.getFrozenColumns() !== 0 && !args.isFrozen;
                        this.parent.trigger(events.actionComplete, args);
                    }
                }
                this.parent.hideSpinner();
            }
            this.parent.notify(events.toolbarRefresh, {});
            this.setRowCount(this.parent.getCurrentViewRecords().length);
            this.parent.getDataModule().isQueryInvokedFromData = false;
        });
    }

    /**
     * @param {object} e - specifies the object
     * @param {Object[]} e.result - specifies the result
     * @param {NotifyArgs} args - specifies the args
     * @returns {void}
     * @hidden
     */
    public dataManagerFailure(e: { result: Object[] }, args: NotifyArgs): void {
        this.ariaService.setOptions(<HTMLElement>this.parent.getContent().querySelector('.' + literals.content), { busy: false, invalid: true });
        this.setRowCount(1);
        this.parent.trigger(events.actionFailure, { error: e });
        this.parent.hideSpinner();
        if (args.requestType === 'save' as Action || args.requestType === 'delete' as Action
            || (<{ name: string }>args).name === 'bulk-save' as Action) {
            return;
        }
        this.parent.currentViewData = [];
        this.renderEmptyRow();
        this.parent.log('actionfailure', { error: e });
    }

    private setRowCount(dataRowCount: number): void {
        this.ariaService.setOptions(<HTMLElement>this.parent.getHeaderTable() as HTMLElement, {
            rowcount: dataRowCount ? dataRowCount.toString() : '1'
        });
    }

    private isInfiniteEnd(args: NotifyArgs): boolean {
        return this.parent.enableInfiniteScrolling && !this.parent.infiniteScrollSettings.enableCache && args.requestType === 'delete';
    }

    private updatesOnInitialRender(e: { result: Object, count: number }): void {
        this.isLayoutRendered = true;
        if (this.parent.columns.length < 1) {
            this.buildColumns(e.result[0]);
        }
        prepareColumns(this.parent.columns, null, this.parent);
        this.headerRenderer.renderTable();
        this.contentRenderer.renderTable();
        this.parent.isAutoGen = true;
        this.parent.notify(events.autoCol, {});
    }

    private iterateComplexColumns(obj: Object, field: string, split: Object): void {
        const keys: string[] = Object.keys(obj);
        for (let i: number = 0; i < keys.length; i++) {
            const childKeys: string[] = typeof obj[keys[i]] === 'object' && obj[keys[i]] && !(obj[keys[i]] instanceof Date) ?
                Object.keys(obj[keys[i]]) : [];
            if (childKeys.length) {
                this.iterateComplexColumns(obj[keys[i]], field + (keys[i] + '.'), split);
            } else {
                split[this.counter] = field + keys[i];
                this.counter++;
            }
        }
    }

    private buildColumns(record: Object): void {
        const cols: Column[] = [];
        const complexCols: Object = {};
        this.iterateComplexColumns(record, '', complexCols);
        const columns: string[] = Object.keys(complexCols).filter((e: string) => complexCols[e] !== 'BlazId').
            map((field: string) => complexCols[field]);
        for (let i: number = 0, len: number = columns.length; i < len; i++) {
            cols[i] = { 'field': columns[i] } as Column;
            if (this.parent.enableColumnVirtualization) {
                cols[i].width = !isNullOrUndefined(cols[i].width) ? cols[i].width : 200;
            }
        }
        this.parent.setProperties({ 'columns': cols }, true);
    }

    private instantiateRenderer(): void {
        this.renderer.addRenderer(RenderType.Header, new HeaderRender(this.parent, this.locator));
        this.renderer.addRenderer(RenderType.Content, new ContentRender(this.parent, this.locator));

        const cellrender: CellRendererFactory = this.locator.getService<CellRendererFactory>('cellRendererFactory');
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
        cellrender.addCellRenderer(CellType.RowDragHIcon, new RowDragDropHeaderRenderer(this.parent, this.locator));
        cellrender.addCellRenderer(CellType.DetailExpand, new DetailExpandCellRenderer(this.parent, this.locator));
        cellrender.addCellRenderer(CellType.DetailFooterIntent, new IndentCellRenderer(this.parent, this.locator));
        cellrender.addCellRenderer(CellType.RowDragIcon, new RowDragDropRenderer(this.parent, this.locator));
    }

    private addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.initialLoad, this.instantiateRenderer, this);
        this.parent.on('refreshdataSource', this.dataManagerSuccess, this);
        this.parent.on(events.modelChanged, this.refresh, this);
        this.parent.on(events.refreshComplete, this.refreshComplete, this);
        this.parent.on(events.bulkSave, this.sendBulkRequest, this);
        this.parent.on(events.showEmptyGrid, () => { this.emptyGrid = true; }, this);
        this.parent.on(events.autoCol, this.dynamicColumnChange, this);
    }

    /**
     * @param {ReturnType} e - specifies the Return type
     * @returns {Promise<Object>} returns the object
     * @hidden
     */
    public validateGroupRecords(e: ReturnType): Promise<Object> {
        const index: number = e.result.length - 1;
        if (index < 0) { return Promise.resolve(e); }
        const group0: Group = <Group>e.result[0];
        const groupN: Group = <Group>e.result[index]; const predicate: Predicate[] = [];
        const addWhere: (query: Query) => void =
            (input: Query) => {
                const groups: Group[] = [group0, groupN];
                for (let i: number = 0; i < groups.length; i++) {
                    predicate.push(new Predicate('field', '==', groups[i].field).and(this.getPredicate('key', 'equal', groups[i].key)));
                }
                input.where(Predicate.or(predicate));
            };
        const query: Query = new Query(); addWhere(query);
        const curDm: DataManager = new DataManager(e.result as JSON[]);
        const curFilter: Object[] = <Object[]>curDm.executeLocal(query);
        const newQuery: Query = this.data.generateQuery(true); const rPredicate: Predicate[] = [];
        if (this.data.isRemote()) {
            const groups: Group[] = [group0, groupN];
            for (let i: number = 0; i < groups.length; i++) {
                rPredicate.push(this.getPredicate((groups[i] as Group).field, 'equal', (groups[i] as Group).key));
            }
            newQuery.where(Predicate.or(rPredicate));
        } else {
            addWhere(newQuery);
        }
        const deferred: Deferred = new Deferred();
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
        const dm: DataManager = new DataManager(<JSON[]>untouched);
        const elements: Group[] = current;
        for (let i: number = 0; i < elements.length; i++) {
            const uGroup: Group = dm.executeLocal(new Query()
                .where(new Predicate('field', '==', elements[i].field).and(this.getPredicate('key', 'equal', elements[i].key))))[0];
            elements[i].count = uGroup.count; const itemGroup: Group = (<Group>elements[i].items);
            const uGroupItem: Group = (<Group>uGroup.items);
            if (itemGroup.GroupGuid) {
                elements[i].items = <Object[]>this.updateGroupInfo(elements[i].items, uGroup.items);
            }
            const rows: AggregateRowModel[] = this.parent.aggregates;
            for (let j: number = 0; j < rows.length; j++) {
                const row: AggregateRowModel = (rows as AggregateRowModel)[j];
                for (let k: number = 0; k < row.columns.length; k++) {
                    const types: string[] = row.columns[k].type instanceof Array ? (row.columns[k].type) as string[] :
                        [(row.columns[k].type)] as string[];
                    for (let l: number = 0; l < types.length; l++) {
                        const key: string = (row.columns[k] as AggregateColumnModel).field + ' - ' + types[l].toLowerCase();
                        const data: Object[] = itemGroup.level ? uGroupItem.records : uGroup.items;
                        const context: Object = this.parent;
                        if (types[l] === 'Custom') {
                            const data: Group = itemGroup.level ? uGroupItem : uGroup;
                            let temp: Function = (row.columns[k] as AggregateColumnModel).customAggregate as Function;
                            if (typeof temp === 'string') {
                                temp = getValue(temp, window);
                            }
                            elements[i].aggregates[key] = temp ? (temp as Function).call(context, data, (row.columns[k] as AggregateColumnModel)) : '';
                        } else {
                            // eslint-disable-next-line max-len
                            elements[i].aggregates[key] = DataUtil.aggregates[types[l].toLowerCase()](data, (row.columns[k] as AggregateColumnModel).field);
                        }
                    }
                }
            }
        }
        return current;
    }
}
