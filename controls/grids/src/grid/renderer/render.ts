import { L10n, NumberFormatOptions } from '@syncfusion/ej2-base';
import { remove, resetBlazorTemplate, blazorTemplates, getValue } from '@syncfusion/ej2-base';
import { isNullOrUndefined, extend, DateFormatOptions } from '@syncfusion/ej2-base';
import { DataManager, Group, Query, Deferred, Predicate, DataUtil } from '@syncfusion/ej2-data';
import { IGrid, NotifyArgs, IValueFormatter, GroupEventArgs } from '../base/interface';
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
import { VirtualRowModelGenerator } from '../services/virtual-row-model-generator';
import { Grid } from '../base/grid';
import { VirtualContentRenderer } from './virtual-content-renderer';

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
     * @hidden
     */
    public vgenerator: VirtualRowModelGenerator;
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
                if (args.action === 'clearFilter' && this.parent.filterSettings.type === 'Menu') {
                    this.parent.filterSettings.columns[this.parent.filterModule.filterObjIndex] = this.parent.filterModule.prevFilterObject;
                    const iconClass: string = this.parent.showColumnMenu && this.parent.filterModule['column'].showColumnMenu ? '.e-columnmenu' : '.e-icon-filter';
                    const col: Element = this.parent.element.querySelector('[data-mappinguid="' + this.parent.filterModule['column'].uid + '"]').parentElement;
                    const flIcon: Element = col.querySelector(iconClass);
                    if (!isNullOrUndefined(this.parent.filterModule.prevFilterObject)) {
                        flIcon.classList.add('e-filtered');
                    }

                }
                if (args.action === 'clear-filter' && (this.parent.filterSettings.type === 'CheckBox' || this.parent.filterSettings.type === 'Excel')){
                    this.parent.filterSettings.columns = this.parent.filterModule.checkboxPrevFilterObject;
                }
                if (args.requestType === 'grouping') {
                    // Remove the dropped column name from groupsettings.columns if args.cancel is true
                    const index: number = gObj.groupSettings.columns.indexOf((args as GroupEventArgs).columnName);
                    if (index !== -1) {
                        gObj.setProperties({ groupSettings: { Columns: gObj.groupSettings.columns.splice(index, 1) } }, true);
                        gObj.setProperties({ sortSettings: { Columns: gObj.sortSettings.columns.splice(index, 1) } }, true);
                        const column: Column = gObj.getColumnByField((args as GroupEventArgs).columnName);
                        const headerCell: Element = gObj.getColumnHeaderByField(column.field);
                        column.visible = (!isNullOrUndefined(headerCell) && !headerCell.classList.contains('e-hide'));
                    }
                }
                return;
            }
            this.parent.notify(events.destroyEditForm, args);
            if (args.requestType === 'virtualscroll' && (this.parent.getDataModule().isRemote() || 'result' in this.parent.dataSource)
                && args.virtualInfo && args.virtualInfo.direction === 'down') {
                (this.parent.contentModule as VirtualContentRenderer).prevInfo = args.virtualInfo;
            }
            if ((this.parent as Grid).groupModule && args.preventFocusOnGroup) {
                (this.parent as Grid).groupModule.preventFocusOnGroup = args.preventFocusOnGroup;
            }
            const actions: string[] = ['filter', 'clearFilter', 'clear-filter', 'add'];
            const requestTypes: string[] = ['searching', 'sorting', 'grouping', 'ungrouping', 'delete'];
            if (gObj.allowSelection && (actions.indexOf(args.action) !== -1 || requestTypes.indexOf(args.requestType) !== -1)) {
                gObj.selectionModule['rmtHdrChkbxClicked'] = false;
                if (gObj.selectionModule.isPartialSelection) {
                    gObj.selectionModule['isHdrSelectAllClicked'] = false;
                }
            }
            if (gObj.allowPaging && gObj.pageSettings.pageSizes && gObj.pagerModule.pagerObj.isAllPage &&
                (args.action === 'add' && args.requestType === 'save' as Action) && gObj.pagerModule.pagerObj.checkAll) {
                gObj.setProperties({pageSettings: {pageSize : gObj.pageSettings.pageSize + 1 }}, true);
            }
            if (args.requestType === 'delete' as Action && gObj.allowPaging) {
                const dataLength: number = (<{ data?: NotifyArgs[] }>args).data.length;
                const count: number = gObj.pageSettings.totalRecordsCount - dataLength;
                const currentViewData: number = gObj.getCurrentViewRecords().length;
                // eslint-disable-next-line max-len
                if ((!(currentViewData - dataLength) && count && ((gObj.pageSettings.currentPage - 1) * gObj.pageSettings.pageSize) === count) || (count && count <= dataLength)) {
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
                && (this.parent.enableVirtualization ? this.parent.lazyLoadRender as GroupLazyLoadRenderer :
                    this.parent.contentModule as GroupLazyLoadRenderer).getGroupCache()[this.parent.pageSettings.currentPage]) {
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
            blazorTemplates[`${detailTemplateID}`] = [];
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
            if (gridColumns[parseInt(i.toString(), 10)].template) {
                blazorTemplates[gObj.element.id + gridColumns[parseInt(i.toString(), 10)].uid] = [];
                resetBlazorTemplate(gObj.element.id + gridColumns[parseInt(i.toString(), 10)].uid, 'Template');
            }
            if (gridColumns[parseInt(i.toString(), 10)].headerTemplate) {
                resetBlazorTemplate(gObj.element.id + gridColumns[parseInt(i.toString(), 10)].uid + 'headerTemplate', 'HeaderTemplate');
            }
            if (gridColumns[parseInt(i.toString(), 10)].filterTemplate) {
                resetBlazorTemplate(gObj.element.id + gridColumns[parseInt(i.toString(), 10)].uid + 'filterTemplate', 'FilterTemplate');
            }
        }
        const guid: string = 'guid';
        for (let k: number = 0; k < gObj.aggregates.length; k++) {
            for (let j: number = 0; j < gObj.aggregates[parseInt(k.toString(), 10)].columns.length; j++) {
                if (gObj.aggregates[parseInt(k.toString(), 10)].columns[parseInt(j.toString(), 10)].footerTemplate) {
                    const tempID: string = gObj.element.id + gObj.aggregates[parseInt(k.toString(), 10)].columns[parseInt(j.toString(), 10)][`${guid}`] + 'footerTemplate';
                    resetBlazorTemplate(tempID, 'FooterTemplate');
                }
                if (gObj.aggregates[parseInt(k.toString(), 10)].columns[parseInt(j.toString(), 10)].groupFooterTemplate) {
                    const tempID: string = gObj.element.id + gObj.aggregates[parseInt(k.toString(), 10)].columns[parseInt(j.toString(), 10)][`${guid}`] + 'groupFooterTemplate';
                    resetBlazorTemplate(tempID, 'GroupFooterTemplate');
                }
                if (gObj.aggregates[parseInt(k.toString(), 10)].columns[parseInt(j.toString(), 10)].groupCaptionTemplate) {
                    const tempID: string = gObj.element.id + gObj.aggregates[parseInt(k.toString(), 10)].columns[parseInt(j.toString(), 10)][`${guid}`] + 'groupCaptionTemplate';
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
        const gObj: IGrid = this.parent;
        const maskRow: boolean = (gObj.loadingIndicator.indicatorType === 'Shimmer' && args.requestType !== 'virtualscroll'
            && args.requestType !== 'infiniteScroll') || ((args.requestType === 'virtualscroll' || args.requestType === 'infiniteScroll')
            && gObj.enableVirtualMaskRow);
        if (args.requestType !== 'virtualscroll' && !(<{ isCaptionCollapse?: boolean }>args).isCaptionCollapse && !maskRow) {
            this.parent.showSpinner();
        }
        if (maskRow) {
            gObj.showMaskRow(args.requestType === 'virtualscroll' ? args.virtualInfo.sentinelInfo.axis
                : args.requestType === 'infiniteScroll' ? (<{direction?: string}>args).direction : undefined);
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
            if (gObj.allowPaging && !gObj.getDataModule().dataManager.dataSource.offline && gObj.pageSettings
                && gObj.pageSettings.pageSizes && gObj.pagerModule && gObj.pagerModule.pagerObj && gObj.pagerModule.pagerObj.isAllPage) {
                gObj.pagerModule.pagerObj.isAllPage = undefined;
            }
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
        const foreignKeyColumns: Column[] = this.parent.getForeignKeyColumns();
        let foreignKeyLength: number = foreignKeyColumns.length;
        if (this.parent.columnQueryMode === 'ExcludeHidden' && foreignKeyLength) {
            foreignKeyLength = foreignKeyColumns.filter((col: Column) => col.visible !== false).length;
        }
        if (foreignKeyLength && (!isFActon || this.parent.searchSettings.key.length)) {
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
            (!isNullOrUndefined(gObj.searchSettings.key) && gObj.searchSettings.key.length))
            && this.foreignKey(this.parent.getForeignKeyColumns());
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
        const gObj: IGrid = this.parent;
        if (gObj.allowPaging && gObj.pageSettings.pageSizes && gObj.pagerModule.pagerObj.isAllPage && gObj.pagerModule.pagerObj.checkAll) {
            const dataLength: number = args['changes'].addedRecords.length;
            if (dataLength) {
                gObj.setProperties({pageSettings: {pageSize : gObj.pageSettings.pageSize + dataLength }}, true);
            }
        }
        if (gObj.allowPaging && ((<{ addedRecords?: Object[] }>(<{ changes?: Object }>args).changes).addedRecords.length ||
            (<{ deletedRecords?: Object[] }>(<{ changes?: Object }>args).changes).deletedRecords.length ||
            (<{ changedRecords?: Object[] }>(<{ changes?: Object }>args).changes).changedRecords.length) && gObj.pageSettings
            && gObj.pageSettings.pageSizes && gObj.pagerModule && gObj.pagerModule.pagerObj
            && !gObj.getDataModule().dataManager.dataSource.offline && gObj.pagerModule.pagerObj.isAllPage) {
            gObj.pagerModule.pagerObj.isAllPage = undefined;
        }
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
        tbody = this.parent.createElement( literals.tbody, { attrs: { role: 'rowgroup' } } );
        let spanCount: number = gObj.allowRowDragAndDrop && isNullOrUndefined(gObj.rowDropSettings.targetID) ? 1 : 0;
        if (gObj.detailTemplate || gObj.childGrid) {
            ++spanCount;
        }
        const className: string = gObj.editSettings.showAddNewRow && gObj.editSettings.newRowPosition === 'Bottom' ?
            'e-emptyrow e-show-added-row' : 'e-emptyrow';
        const tr: Element = this.parent.createElement('tr', { className: className, attrs: { role: 'row' } });
        let td: HTMLElement;
        if (gObj.emptyRecordTemplate) {
            const emptyRecordTemplateID: string = gObj.element.id + 'emptyRecordTemplate';
            td = this.parent.createElement('td', { attrs: { colspan: (gObj.getVisibleColumns().length +
                spanCount + gObj.groupSettings.columns.length).toString() }});
            if (gObj.isVue || (gObj.parentDetails && gObj.parentDetails.parentInstObj && gObj.parentDetails.parentInstObj.isVue)) {
                td.appendChild(gObj.getEmptyRecordTemplate()(gObj.dataSource, gObj, 'emptyRecordTemplate', emptyRecordTemplateID,
                                                             undefined, undefined, undefined, this.parent['root'])[1]);
            } else {
                td.appendChild(gObj.getEmptyRecordTemplate()(gObj.dataSource, gObj, 'emptyRecordTemplate', emptyRecordTemplateID,
                                                             undefined, undefined, undefined, this.parent['root'])[0]);
            }
            if (gObj.isReact) {
                this.parent.renderTemplates();
            }
        } else {
            td = this.parent.createElement('td', {
                innerHTML: this.l10n.getConstant('EmptyRecord'),
                attrs: { colspan: (gObj.getVisibleColumns().length + spanCount + (!isNullOrUndefined(gObj.groupSettings.columns) ?
                    gObj.groupSettings.columns.length : 0)).toString()}
            });
        }
        if (gObj.isFrozenGrid()) {
            td.classList.add('e-leftfreeze');
            (td as HTMLElement).style.left = 0 + 'px';
        }
        if (gObj.frozenRows && gObj.element.querySelector('.e-frozenrow-border')) {
            this.parent.element.querySelector('.e-frozenrow-border').classList.add('e-frozenrow-empty');
        }
        tr.appendChild(td);
        tbody.appendChild(tr);
        this.contentRenderer.renderEmpty(<HTMLElement>tbody);
        if (isTrigger) {
            if (!this.parent.isInitialLoad) {
                this.parent.focusModule.setFirstFocusableTabIndex();
            }
            this.parent.trigger(events.dataBound, {});
            this.parent.notify(
                events.onEmpty,
                { rows: [new Row<Column>({ isDataRow: true, cells: [new Cell<Column>({ isDataCell: true, visible: true })] })] }
            );
            if (gObj.editSettings.showAddNewRow) {
                gObj.addRecord();
                this.parent.notify(events.showAddNewRowFocus, {});
            }
        }
    }

    private dynamicColumnChange(): void {
        if (this.parent.getCurrentViewRecords().length) {
            this.updateColumnType(this.parent.getCurrentViewRecords()[0]);
        }
    }

    private updateColumnType(record: Object): void {
        const columns: Column[] = this.parent.enableColumnVirtualization ? this.parent.columns as Column[] :
            this.parent.getColumns() as Column[];
        let value: Date;
        const cFormat: string = 'customFormat';
        const equalTo: string = 'equalTo';
        const data: Object = record && (<{ items: Object[] }>record).items ? (<{ items: Object[] }>record).items[0] : record;
        const fmtr: IValueFormatter = this.locator.getService<IValueFormatter>('valueFormatter');
        for (let i: number = 0, len: number = columns.length; i < len; i++) {
            value = getObject(columns[parseInt(i.toString(), 10)].field || '', data);
            if (!isNullOrUndefined(columns[parseInt(i.toString(), 10)][`${cFormat}`])) {
                columns[parseInt(i.toString(), 10)].format = columns[parseInt(i.toString(), 10)][`${cFormat}`];
            }
            if (!isNullOrUndefined(columns[parseInt(i.toString(), 10)].validationRules)
                && !isNullOrUndefined(columns[parseInt(i.toString(), 10)].validationRules[`${equalTo}`])) {
                columns[parseInt(i.toString(), 10)].validationRules[`${equalTo}`][0] = this.parent.element.id + columns[parseInt(i.toString(), 10)].validationRules[`${equalTo}`][0];
            }
            if (columns[parseInt(i.toString(), 10)].isForeignColumn() && columns[parseInt(i.toString(), 10)].columnData) {
                value = getObject(columns[parseInt(i.toString(), 10)].foreignKeyValue || '', columns[parseInt(i.toString(), 10)].columnData[0]);
            }
            if (!isNullOrUndefined(value)) {
                this.isColTypeDef = true;
                if (!columns[parseInt(i.toString(), 10)].type) {
                    columns[parseInt(i.toString(), 10)].type = value.getDay ? (value.getHours() > 0 || value.getMinutes() > 0 ||
                        value.getSeconds() > 0 || value.getMilliseconds() > 0 ? 'datetime' : 'date') : typeof (value);
                }
            } else {
                columns[parseInt(i.toString(), 10)].type = columns[parseInt(i.toString(), 10)].type || null;
            }
            const valueFormatter: ValueFormatter = new ValueFormatter();
            if (columns[parseInt(i.toString(), 10)].format && ((<DateFormatOptions>columns[parseInt(i.toString(), 10)].format).skeleton
                || ((<DateFormatOptions>columns[parseInt(i.toString(), 10)].format).format &&
                typeof (<DateFormatOptions>columns[parseInt(i.toString(), 10)].format).format === 'string'))) {
                columns[parseInt(i.toString(), 10)].setFormatter(
                    valueFormatter.getFormatFunction(extend({}, columns[parseInt(i.toString(), 10)].format as DateFormatOptions)));
                columns[parseInt(i.toString(), 10)].setParser(
                    valueFormatter.getParserFunction(columns[parseInt(i.toString(), 10)].format as DateFormatOptions));
            }
            if (typeof (columns[parseInt(i.toString(), 10)].format) === 'string') {
                setFormatter(this.locator, columns[parseInt(i.toString(), 10)]);
            } else if (!columns[parseInt(i.toString(), 10)].format && columns[parseInt(i.toString(), 10)].type === 'number') {
                columns[parseInt(i.toString(), 10)].setParser(
                    fmtr.getParserFunction({ format: 'n2' } as NumberFormatOptions));
            }
            if (columns[parseInt(i.toString(), 10)].type === 'dateonly' && !columns[parseInt(i.toString(), 10)].format){
                columns[parseInt(i.toString(), 10)].format = 'yMd';
                setFormatter(this.locator, columns[parseInt(i.toString(), 10)]);
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
        const detailGrid: boolean = gObj.childGrid || gObj.detailTemplate ? true : false;
        const isInfiniteDelete: boolean = this.parent.enableInfiniteScrolling && !this.parent.infiniteScrollSettings.enableCache &&
            !gObj.groupSettings.enableLazyLoading && ((args.requestType === 'delete' && !detailGrid) || (args.requestType === 'save' &&
            this.parent.infiniteScrollModule.requestType === 'add' && !(gObj.sortSettings.columns.length ||
            gObj.filterSettings.columns.length || this.parent.groupSettings.columns.length || gObj.searchSettings.key || detailGrid)));
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
            if (this.parent.isReact && !isNullOrUndefined(args) && !(args.requestType === 'infiniteScroll' && !this.parent.infiniteScrollSettings.enableCache) && !args.isFrozen) {
                let templates: string[] = [
                    'columnTemplate', 'rowTemplate', 'detailTemplate',
                    'captionTemplate', 'commandsTemplate', 'groupFooterTemplate', 'groupCaptionTemplate'
                ];
                if (args.requestType === 'infiniteScroll' && this.parent.infiniteScrollSettings.enableCache) {
                    templates = [
                        'columnTemplate', 'commandsTemplate'
                    ];
                }
                clearReactVueTemplates(this.parent, templates, () => {
                    this.extendDataManagerSuccess(e, args, len, dataArgs, isInfiniteDelete);
                });
            } else {
                this.extendDataManagerSuccess(e, args, len, dataArgs, isInfiniteDelete);
            }
        });
    }

    private extendDataManagerSuccess(e: ReturnType, args?: NotifyArgs, len?: number, dataArgs?: ReturnType,
                                     isInfiniteDelete?: boolean): void {
        const gObj: IGrid = this.parent;
        if (this.isInfiniteEnd(args) && !len) {
            this.parent.notify(events.infiniteEditHandler, { e: args, result: e.result, count: e.count, agg: e.aggregates });
            return;
        }
        this.parent.isEdit = false;
        this.parent.notify(events.editReset, {});
        this.parent.notify(events.tooltipDestroy, {});
        if (args && !((args.requestType === 'infiniteScroll' || args.requestType === 'delete' || args.action === 'add') &&
            gObj.enableInfiniteScrolling)) {
            this.parent.notify(events.commandColumnDestroy, { type : 'refreshCommandColumn' } );
        }
        this.contentRenderer.prevCurrentView = !isNullOrUndefined(this.parent.currentViewData) && this.parent.currentViewData.slice();
        gObj.currentViewData = <Object[]>dataArgs.result;
        gObj.notify(events.refreshInfiniteCurrentViewData, { args: args, data: dataArgs.result });
        if (dataArgs.count && !gObj.allowPaging && (gObj.enableVirtualization || gObj.enableInfiniteScrolling)) {
            gObj.totalDataRecordsCount = dataArgs.count;
        }
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
            gObj.removeMaskRow();
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
        if (this.parent.isAngular && this.parent.allowGrouping && this.parent.groupSettings.captionTemplate
            && !(!isNullOrUndefined(args) && args.requestType === 'infiniteScroll')) {
            this.parent.destroyTemplate(['groupSettings_captionTemplate']);
        }
        this.parent.notify(
            events.dataReady,
            extend({ count: dataArgs.count, result: dataArgs.result, aggregates: dataArgs.aggregates, loadSummaryOnEmpty: false },
                   args));
        if ((gObj.groupSettings.columns.length || (args && args.requestType === 'ungrouping'))
            && (args && args.requestType !== 'filtering')) {
            this.headerRenderer.refreshUI();
        }
        if (len) {
            if (isGroupAdaptive(gObj)) {
                const content: string = 'content';
                args.scrollTop = { top: this.contentRenderer[`${content}`].scrollTop };
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
            gObj.removeMaskRow();
            this.renderEmptyRow();
            if (gObj.enableColumnVirtualization && !len) {
                this.parent.notify(events.contentReady, { rows: gObj.getRowsObject(), args: {} });
            }
            if (args) {
                const action: string = (args.requestType || '').toLowerCase() + '-complete';
                this.parent.notify(action, args);
                if (args.requestType === 'batchsave') {
                    args.cancel = false;
                    args.rows = [];
                    args.isFrozen = !args.isFrozen;
                    this.parent.trigger(events.actionComplete, args);
                }
            }
            if (this.parent.autoFit) {
                this.parent.preventAdjustColumns();
            }
            this.parent.hideSpinner();
        }
        this.parent.notify(events.toolbarRefresh, {});
        this.setRowCount(this.parent.getCurrentViewRecords().length);
        if ('query' in e) {
            this.parent.getDataModule().isQueryInvokedFromData = false;
        }
    }

    /**
     * @param {object} e - specifies the object
     * @param {Object[]} e.result - specifies the result
     * @param {NotifyArgs} args - specifies the args
     * @returns {void}
     * @hidden
     */
    public dataManagerFailure(e: { result: Object[] }, args: NotifyArgs): void {
        if (!isNullOrUndefined(this.parent.contentModule)) {
            this.ariaService.setOptions(<HTMLElement>this.parent.getContent().querySelector('.' + literals.content), { busy: false, invalid: true });
            this.setRowCount(1);
        }
        this.parent.trigger(events.actionFailure, e && (<{ error?: Error }>e).error ? e : { error: e });
        this.parent.hideSpinner();
        this.parent.removeMaskRow();
        if (args.requestType === 'save' as Action || args.requestType === 'delete' as Action
            || (<{ name: string }>args).name === 'bulk-save' as Action) {
            return;
        }
        this.parent.currentViewData = [];
        this.renderEmptyRow();
        if (!this.parent.isInitialLoad) {
            this.parent.focusModule.setFirstFocusableTabIndex();
        }
        this.parent.log('actionfailure', { error: e });
    }

    private setRowCount(dataRowCount: number): void {
        this.ariaService.setOptions(<HTMLElement>this.parent.element as HTMLElement, {
            rowcount: dataRowCount ? dataRowCount.toString() : '1'
        });
    }

    private isInfiniteEnd(args: NotifyArgs): boolean {
        return this.parent.enableInfiniteScrolling && !this.parent.infiniteScrollSettings.enableCache && args.requestType === 'delete';
    }

    private updatesOnInitialRender(e: { result: Object, count: number }): void {
        this.isLayoutRendered = true;
        let isEmptyCol: boolean = false;
        if (this.parent.columns.length < 1) {
            this.buildColumns(e.result[0]);
            isEmptyCol = true;
        }
        prepareColumns(this.parent.columns, null, this.parent);
        if (isEmptyCol) {
            this.parent.notify(events.refreshSplitFrozenColumn, {});
        }
        this.headerRenderer.renderTable();
        this.contentRenderer.renderTable();
        this.parent.isAutoGen = true;
        this.parent.notify(events.autoCol, {});
    }

    private iterateComplexColumns(obj: Object, field: string, split: Object): void {
        const keys: string[] = Object.keys(obj);
        for (let i: number = 0; i < keys.length; i++) {
            const childKeys: string[] = typeof obj[keys[parseInt(i.toString(), 10)]] === 'object'
                && obj[keys[parseInt(i.toString(), 10)]] && !(obj[keys[parseInt(i.toString(), 10)]] instanceof Date) ?
                Object.keys(obj[keys[parseInt(i.toString(), 10)]]) : [];
            if (childKeys.length) {
                this.iterateComplexColumns(obj[keys[parseInt(i.toString(), 10)]], field + (keys[parseInt(i.toString(), 10)] + '.'), split);
            } else {
                split[this.counter] = field + keys[parseInt(i.toString(), 10)];
                this.counter++;
            }
        }
    }

    private buildColumns(record: Object): void {
        const cols: Column[] = [];
        const complexCols: Object = {};
        this.iterateComplexColumns(record, '', complexCols);
        const columns: string[] = Object.keys(complexCols).filter((e: string) => complexCols[`${e}`] !== 'BlazId').
            map((field: string) => complexCols[`${field}`]);
        for (let i: number = 0, len: number = columns.length; i < len; i++) {
            cols[parseInt(i.toString(), 10)] = { 'field': columns[parseInt(i.toString(), 10)] } as Column;
            if (this.parent.enableColumnVirtualization) {
                cols[parseInt(i.toString(), 10)].width = !isNullOrUndefined(cols[parseInt(i.toString(), 10)].width) ?
                    cols[parseInt(i.toString(), 10)].width : 200;
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
        const groupN: Group = <Group>e.result[parseInt(index.toString(), 10)]; const predicate: Predicate[] = [];
        const addWhere: (query: Query) => void =
            (input: Query) => {
                const groups: Group[] = [group0, groupN];
                for (let i: number = 0; i < groups.length; i++) {
                    predicate.push(new Predicate('field', '==', groups[parseInt(i.toString(), 10)].field).and(this.getPredicate('key', 'equal', groups[parseInt(i.toString(), 10)].key)));
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
                rPredicate.push(this.getPredicate((groups[parseInt(i.toString(), 10)] as Group).field, 'equal', (groups[parseInt(i.toString(), 10)] as Group).key));
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

    /**
     * @param {string} key - Defines the key
     * @param {string} operator - Defines the operator
     * @param {string | number | Date} value - Defines the value
     * @returns {Predicate} - Returns the predicate
     * @hidden */
    public getPredicate(key: string, operator: string, value: string | number | Date): Predicate {
        if (value instanceof Date) {
            return getDatePredicate({ field: key, operator: operator, value: value });
        }
        return new Predicate(key, operator, value);
    }

    /**
     * @param {Object[]} current - Defines the current object
     * @param {Object[]} untouched - Defines the object needs to merge
     * @returns {Object[]} - Returns the updated group information
     * @hidden */
    public updateGroupInfo(current: Object[], untouched: Object[]): Object[] {
        const dm: DataManager = new DataManager(<JSON[]>untouched);
        const elements: Group[] = current;
        for (let i: number = 0; i < elements.length; i++) {
            const updatedGroup: Group = dm.executeLocal(new Query()
                .where(new Predicate('field', '==', elements[parseInt(i.toString(), 10)].field).and(this.getPredicate('key', 'equal', elements[parseInt(i.toString(), 10)].key))))[0];
            if (!isNullOrUndefined(updatedGroup)) {
                elements[parseInt(i.toString(), 10)].count = updatedGroup.count; const itemGroup: Group =
                    (<Group>elements[parseInt(i.toString(), 10)].items);
                const updatedGroupItem: Group = (<Group>updatedGroup.items);
                if (itemGroup.GroupGuid) {
                    elements[parseInt(i.toString(), 10)].items =
                        <Object[]>this.updateGroupInfo(elements[parseInt(i.toString(), 10)].items, updatedGroup.items);
                }
                const rows: AggregateRowModel[] = this.parent.aggregates;
                for (let j: number = 0; j < rows.length; j++) {
                    const row: AggregateRowModel = (rows as AggregateRowModel)[parseInt(j.toString(), 10)];
                    for (let k: number = 0; k < row.columns.length; k++) {
                        const column: AggregateColumnModel = row.columns[parseInt(k.toString(), 10)];
                        const types: string[] = column.type instanceof Array ? (column.type) as string[] : [(column.type)] as string[];
                        for (let l: number = 0; l < types.length; l++) {
                            const key: string = (column as AggregateColumnModel).field + ' - ' + types[parseInt(l.toString(), 10)].toLowerCase();
                            const data: Object[] = itemGroup.level ? updatedGroupItem.records : updatedGroup.items;
                            const context: Object = this.parent;
                            if (types[parseInt(l.toString(), 10)] === 'Custom') {
                                const data: Group = itemGroup.level ? updatedGroupItem : updatedGroup;
                                let temp: Function = (column as AggregateColumnModel)
                                    .customAggregate as Function;
                                if (typeof temp === 'string') {
                                    temp = getValue(temp, window);
                                }
                                elements[parseInt(i.toString(), 10)].aggregates[`${key}`] = temp ? (temp as Function).call(context, data, (row.columns[parseInt(k.toString(), 10)] as AggregateColumnModel)) : '';
                            } else {
                                elements[parseInt(i.toString(), 10)].aggregates[`${key}`] = DataUtil.aggregates[types[parseInt(l.toString(), 10)].toLowerCase()](data, (row.columns[parseInt(k.toString(), 10)] as AggregateColumnModel).field);
                            }
                        }
                    }
                }
            }
        }
        return current;
    }
}
