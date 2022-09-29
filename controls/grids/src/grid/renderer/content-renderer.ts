import { Droppable, DropEventArgs } from '@syncfusion/ej2-base';
import { isNullOrUndefined, extend } from '@syncfusion/ej2-base';
import { setStyleAttribute, remove, updateBlazorTemplate } from '@syncfusion/ej2-base';
import { getUpdateUsingRaf, appendChildren, setDisplayValue, clearReactVueTemplates } from '../base/util';
import * as events from '../base/constant';
import { IRenderer, IGrid, NotifyArgs, IModelGenerator, RowDataBoundEventArgs, CellFocusArgs, InfiniteScrollArgs } from '../base/interface';
import { VirtualInfo } from '../base/interface';
import { Column } from '../models/column';
import { Row } from '../models/row';
import { Cell } from '../models/cell';
import { RowRenderer } from './row-renderer';
import { CellMergeRender } from './cell-merge-renderer';
import { ServiceLocator } from '../services/service-locator';
import { AriaService } from '../services/aria-service';
import { RowModelGenerator } from '../services/row-model-generator';
import { GroupModelGenerator } from '../services/group-model-generator';
import { isGroupAdaptive } from '../base/util';
import { Grid } from '../base/grid';
import { VirtualFreezeRenderer } from './virtual-freeze-renderer';
import { VirtualContentRenderer } from '../renderer/virtual-content-renderer';
import { GroupLazyLoadRenderer } from './group-lazy-load-renderer';
import { FreezeContentRender } from './freeze-renderer';
import { freezeTable } from '../base/enum';
import * as literals from '../base/string-literals';


// eslint-disable-next-line valid-jsdoc
/**
 * Content module is used to render grid content
 *
 * @hidden
 */
export class ContentRender implements IRenderer {
    //Internal variables
    private contentTable: Element;
    private contentPanel: Element;
    protected rows: Row<Column>[] = [];
    protected freezeRows: Row<Column>[] = [];
    protected movableRows: Row<Column>[] = [];
    protected rowElements: Element[];
    protected freezeRowElements: Element[] = [];
    private index: number;
    /** @hidden */
    public prevInfo: VirtualInfo;
    /** @hidden */
    public currentInfo: VirtualInfo = {};
    /** @hidden */
    public prevCurrentView: Object[] = [];
    public colgroup: Element;
    protected isLoaded: boolean = true;
    protected tbody: HTMLElement;
    private droppable: Droppable;
    private viewColIndexes: number[] = [];
    private drop: Function = (e: DropEventArgs) => {
        this.parent.notify(events.columnDrop, { target: e.target, droppedElement: e.droppedElement });
        remove(e.droppedElement);
    }
    private args: NotifyArgs;
    private infiniteCache: { [x: number]: Row<Column>[] } | { [x: number]: Row<Column>[][] } = {};
    private isRemove: boolean = false;
    private pressedKey: string;
    /** @hidden */
    public visibleRows: Row<Column>[] = [];
    private visibleFrozenRows: Row<Column>[] = [];
    protected rightFreezeRows: Row<Column>[] = [];
    private isAddRows: boolean = false;
    private currentMovableRows: Object[];
    private initialPageRecords: Object;
    private isInfiniteFreeze: boolean = false;
    private useGroupCache: boolean = false;

    private rafCallback: Function = (args: NotifyArgs) => {
        const arg: NotifyArgs = args;
        return () => {
            if (this.parent.isFrozenGrid() && this.parent.enableVirtualization) {
                const tableName: freezeTable = (<{ tableName?: freezeTable }>args).tableName;
                this.isLoaded = this.parent.getFrozenMode() === literals.leftRight ? tableName === 'frozen-right' : tableName === 'movable';
                if (this.parent.enableColumnVirtualization && args.requestType === 'virtualscroll' && this.isLoaded) {
                    const mHdr: Element[] = [].slice.call(this.parent.getMovableVirtualHeader().getElementsByClassName(literals.row));
                    const fHdr: Element[] = [].slice.call(this.parent.getFrozenVirtualHeader().getElementsByClassName(literals.row));
                    this.isLoaded = mHdr.length === fHdr.length;
                }
            }
            this.ariaService.setBusy(<HTMLElement>this.getPanel().querySelector('.' + literals.content), false);
            if (this.parent.isDestroyed) { return; }
            let rows: Row<Column>[] = this.rows.slice(0);
            if (this.parent.enableInfiniteScrolling) {
                if (this.parent.groupSettings.enableLazyLoading) {
                    for (let i: number = 0; i < this.visibleRows.length; i++) {
                        this.setRowsInLazyGroup(this.visibleRows[i], i);
                    }
                }
                rows = this.parent.getRowsObject(); const prevPage: number = (<{ prevPage: number }>arg).prevPage;
                if (this.parent.infiniteScrollSettings.enableCache && prevPage) {
                    const maxBlock: number = this.parent.infiniteScrollSettings.maxBlocks; rows = [];
                    const rowIdx: number = (parseInt(this.rowElements[0].getAttribute('data-rowindex'), 10) + 1);
                    const startIdx: number = Math.ceil(rowIdx / this.parent.pageSettings.pageSize);
                    for (let i: number = 0, count: number = startIdx; i < maxBlock; i++, count++) {
                        if (this.infiniteCache[count]) {
                            rows = [...rows, ...this.infiniteCache[count]] as Row<Column>[];
                        }
                    }
                }
            }
            if (this.parent.isFrozenGrid()) {
                rows = args.isFrozen ? this.freezeRows : args.renderFrozenRightContent ? this.parent.getFrozenRightRowsObject()
                    : this.movableRows;
            }
            this.parent.notify(events.contentReady, { rows: rows, args: arg });
            if (this.isLoaded) {
                this.parent.isManualRefresh = false;
                if (this.parent.enableInfiniteScrolling && this.parent.groupSettings.enableLazyLoading && args.requestType === 'sorting') {
                    this.parent.infiniteScrollModule['groupCaptionAction'] = undefined;
                }
                this.parent.trigger(events.dataBound, {}, () => {
                    if (this.parent.allowTextWrap) {
                        this.parent.notify(events.freezeRender, { case: 'textwrap' });
                    }
                });
            }
            if (arg) {
                const action: string = (arg.requestType || '').toLowerCase() + '-complete';
                this.parent.notify(action, arg);
                if (args.requestType === 'batchsave') {
                    args.cancel = false;
                    this.parent.trigger(events.actionComplete, args);
                }
            }
            if (this.isLoaded) {
                this.parent.hideSpinner();
            }
        };
    }
    //Module declarations
    protected parent: IGrid;
    private serviceLocator: ServiceLocator;
    private ariaService: AriaService;
    protected generator: IModelGenerator<Column>;

    /**
     * Constructor for content renderer module
     *
     * @param {IGrid} parent - specifies the Igrid
     * @param {ServiceLocator} serviceLocator - specifies the service locator
     */
    constructor(parent?: IGrid, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        this.ariaService = this.serviceLocator.getService<AriaService>('ariaService');
        this.parent.enableDeepCompare = this.parent.getDataModule().isRemote();
        this.generator = this.getModelGenerator();
        if (this.parent.isDestroyed) { return; }
        if (!this.parent.enableColumnVirtualization && !this.parent.enableVirtualization
            && !this.parent.groupSettings.enableLazyLoading) {
            this.parent.on(events.columnVisibilityChanged, this.setVisible, this);
        }
        this.parent.on(events.colGroupRefresh, this.colGroupRefresh, this);
        this.parent.on(events.uiUpdate, this.enableAfterRender, this);
        this.parent.on(events.refreshInfiniteModeBlocks, this.refreshContentRows, this);
        this.parent.on(events.beforeCellFocused, this.beforeCellFocused, this);
        this.parent.on(events.destroy, this.droppableDestroy, this);
    }

    private beforeCellFocused(e: CellFocusArgs): void {
        if (e.byKey && (e.keyArgs.action === 'upArrow' || e.keyArgs.action === 'downArrow')) {
            this.pressedKey = e.keyArgs.action;
        } else {
            this.pressedKey = undefined;
        }
    }

    /**
     * The function is used to render grid content div
     *
     * @returns {void}
     */
    public renderPanel(): void {
        const gObj: IGrid = this.parent;
        let div: Element =  this.parent.element.querySelector( '.' + literals.gridContent);
        if (div) {
            this.ariaService.setOptions(<HTMLElement>this.parent.element.querySelector('.' + literals.content), { busy: false });
            this.setPanel(div);
            return;
        }
        div = this.parent.createElement('div', { className:  literals.gridContent });
        const innerDiv: Element = this.parent.createElement('div', {
            className: literals.content
        });
        this.ariaService.setOptions(<HTMLElement>innerDiv, { busy: false });
        div.appendChild(innerDiv);
        this.setPanel(div);
        gObj.element.appendChild(div);
    }

    /**
     * The function is used to render grid content table
     *
     * @returns {void}
     */
    public renderTable(): void {
        const contentDiv: Element = this.getPanel();
        const virtualTable: Element = contentDiv.querySelector('.e-virtualtable');
        const virtualTrack: Element = contentDiv.querySelector('.e-virtualtrack');
        if (this.parent.enableVirtualization && !isNullOrUndefined(virtualTable) && !isNullOrUndefined(virtualTrack)) {
            remove(virtualTable);
            remove(virtualTrack);
        }
        contentDiv.appendChild(this.createContentTable('_content_table'));
        this.setTable(contentDiv.querySelector('.' + literals.table));
        this.ariaService.setOptions(<HTMLElement>this.getTable(), {
            multiselectable: this.parent.selectionSettings.type === 'Multiple'
        });
        this.initializeContentDrop();
        if (this.parent.frozenRows) {
            this.parent.getHeaderContent().classList.add('e-frozenhdrcont');
        }
    }

    /**
     * The function is used to create content table elements
     *
     * @param {string} id - specifies the id
     * @returns {Element} returns the element
     * @hidden
     */
    public createContentTable(id: string): Element {
        const innerDiv: Element = <Element>this.getPanel().firstElementChild;
        if (this.getTable()) {
            remove(this.getTable());
        }
        const table: Element = innerDiv.querySelector('.' + literals.table) ? innerDiv.querySelector('.' + literals.table) :
            this.parent.createElement('table', {
                className: literals.table, attrs: {
                    cellspacing: '0.25px', role: 'grid',
                    id: this.parent.element.id + id
                }
            });
        this.setColGroup(<Element>this.parent.getHeaderTable().querySelector(literals.colGroup).cloneNode(true));
        table.appendChild(this.getColGroup());
        table.appendChild(this.parent.createElement( literals.tbody, { attrs: { role: 'rowgroup' } }));
        innerDiv.appendChild(table);
        return innerDiv;
    }

    /**
     * Refresh the content of the Grid.
     *
     * @param {NotifyArgs} args - specifies the args
     * @returns {void}
     */
    // tslint:disable-next-line:max-func-body-length
    public refreshContentRows(args: NotifyArgs = {}): void {
        const gObj: IGrid = this.parent;
        if (gObj.currentViewData.length === 0) { return; }
        const dataSource: Object = this.currentMovableRows || gObj.currentViewData;
        const contentModule: FreezeContentRender = (this.parent.contentModule as FreezeContentRender);
        const isReact: boolean = gObj.isReact && !isNullOrUndefined(gObj.rowTemplate);
        let frag: DocumentFragment | HTMLElement = isReact ? gObj.createElement( literals.tbody, { attrs: { role: 'rowgroup' } }) : document.createDocumentFragment();
        if (!this.initialPageRecords) {
            this.initialPageRecords = extend([], dataSource);
        }
        const hdrfrag: DocumentFragment = isReact ? gObj.createElement( literals.tbody, { attrs: { role: 'rowgroup' } }) : document.createDocumentFragment();
        const columns: Column[] = <Column[]>gObj.getColumns();
        let tr: Element; let hdrTbody: HTMLElement; const frzCols: number = gObj.getFrozenColumns();
        const isFrozenGrid: boolean = this.parent.isFrozenGrid();
        let trElement: Element;
        const row: RowRenderer<Column> = new RowRenderer<Column>(this.serviceLocator, null, this.parent);
        const isInfiniteScroll: boolean = this.parent.enableInfiniteScrolling
            && (args as InfiniteScrollArgs).requestType === 'infiniteScroll';
        gObj.notify(events.destroyChildGrid, {});
        this.rowElements = [];
        this.rows = [];
        const fCont: Element = this.getPanel().querySelector('.' + literals.frozenContent);
        const mCont: HTMLElement = this.getPanel().querySelector('.' + literals.movableContent) as HTMLElement;
        const cont: HTMLElement = this.getPanel().querySelector('.' + literals.content) as HTMLElement;
        let tbdy: Element;
        let tableName: freezeTable;
        if (isGroupAdaptive(gObj)) {
            if (['sorting', 'filtering', 'searching', 'grouping', 'ungrouping', 'reorder']
                .some((value: string) => { return args.requestType === value; })) {
                this.emptyVcRows();
            }
        }
        let modelData: Row<Column>[];
        if (this.parent.enableVirtualization && this.parent.isFrozenGrid()) {
            if (this.parent.enableColumnVirtualization && args.requestType === 'virtualscroll'
                && args.virtualInfo.sentinelInfo.axis === 'X') {
                modelData = (<{ generateRows?: Function }>(<Grid>this.parent).contentModule).generateRows(dataSource, args);
                args.renderMovableContent = true;
            }
            modelData = (<{ generateRows?: Function }>(<Grid>this.parent).contentModule).generateRows(dataSource as Object[], args);
        } else {
            modelData = this.checkCache(modelData, args);
            if (!this.isAddRows && !this.useGroupCache) {
                modelData = this.generator.generateRows(dataSource, args);
            }
        }
        this.setGroupCache(modelData, args);
        this.parent.notify(events.setInfiniteCache, { isInfiniteScroll: isInfiniteScroll, modelData: modelData, args: args });
        const idx: number = modelData[0].cells[0].index;
        if (isFrozenGrid) {
            tableName = contentModule.setTbody(modelData, args);
            tbdy = contentModule.getTbody(tableName);
        }
        const isFrozenLeft: boolean = this.parent.getFrozenMode() === literals.leftRight && tableName === literals.frozenRight;
        /* eslint-disable */
        if (args.requestType !== 'infiniteScroll' && (this.parent as any).registeredTemplate
            && (this.parent as any).registeredTemplate.template && !args.isFrozen && !isFrozenLeft) {
            const templatetoclear: any = [];
            for (let i: number = 0; i < (this.parent as any).registeredTemplate.template.length; i++) {
                for (let j: number = 0; j < (this.parent as any).registeredTemplate.template[i].rootNodes.length; j++) {
                    if (isNullOrUndefined((this.parent as any).registeredTemplate.template[i].rootNodes[j].parentNode)) {
                        templatetoclear.push((this.parent as any).registeredTemplate.template[i]);
                        /* eslint-enable */
                    }
                }
            }
            this.parent.destroyTemplate(['template'], templatetoclear);
        }
        if ((this.parent.isReact || this.parent.isVue) && args.requestType !== 'infiniteScroll' && !args.isFrozen) {
            const templates: string[] = [
                this.parent.isVue ? 'template' : 'columnTemplate', 'rowTemplate', 'detailTemplate',
                'captionTemplate', 'commandsTemplate', 'groupFooterTemplate', 'groupCaptionTemplate'
            ];
            clearReactVueTemplates(this.parent, templates);
        }
        if (this.parent.enableColumnVirtualization) {
            const cellMerge: CellMergeRender<Column> = new CellMergeRender(this.serviceLocator, this.parent);
            cellMerge.updateVirtualCells(modelData);
        }
        if (!isFrozenGrid) {
            this.tbody = this.getTable().querySelector( literals.tbody);
        }
        let startIndex: number = 0;
        let blockLoad: boolean = true;
        if (isGroupAdaptive(gObj) && gObj.vcRows.length) {
            const top: string = 'top';
            const scrollTop: number = !isNullOrUndefined(args.virtualInfo.offsets) ? args.virtualInfo.offsets.top :
                (!isNullOrUndefined(args.scrollTop) ? args.scrollTop[top] : 0);
            if (scrollTop !== 0) {
                const offsets: { [x: number]: number } = gObj.vGroupOffsets;
                const bSize: number = gObj.pageSettings.pageSize / 2;
                const values: number[] = Object.keys(offsets).map((key: string) => offsets[key]);
                for (let m: number = 0; m < values.length; m++) {
                    if (scrollTop < values[m]) {
                        if (!isNullOrUndefined(args.virtualInfo) && args.virtualInfo.direction === 'up') {
                            startIndex = m > 0 ? ((m - 1) * bSize) : (m * bSize);
                            break;
                        } else {
                            startIndex = m * bSize;
                            if (this.parent.contentModule.isEndBlock(m) || this.parent.contentModule.isEndBlock(m + 1)) {
                                args.virtualInfo.blockIndexes = [m, m + 1];
                            }
                            break;
                        }
                    }
                }
                if (Math.round(scrollTop + (this.contentPanel.firstElementChild as HTMLElement).offsetHeight) >=
                    this.contentPanel.firstElementChild.scrollHeight && !args.rowObject) {
                    blockLoad = false;
                }
            }
        }
        const isVFFrozenOnly: boolean = gObj.frozenRows && !gObj.isFrozenGrid() && this.parent.enableVirtualization
            && args.requestType === 'reorder';
        if ((gObj.frozenRows && args.requestType === 'virtualscroll' && args.virtualInfo.sentinelInfo.axis === 'X') || isVFFrozenOnly) {
            const bIndex: number[] = args.virtualInfo.blockIndexes;
            const page: number = args.virtualInfo.page;
            args.virtualInfo.blockIndexes = [1, 2];
            if (isVFFrozenOnly) {
                args.virtualInfo.page = 1;
            }
            const data: Object = isVFFrozenOnly ? this.initialPageRecords : dataSource;
            const mhdrData: Row<Column>[] = (<{ generateRows?: Function }>(<{ vgenerator?: Function }>this).vgenerator)
                .generateRows(data, args);
            mhdrData.splice(this.parent.frozenRows);
            for (let i: number = 0; i < this.parent.frozenRows; i++) {
                mhdrData[i].cells.splice(0, this.parent.getFrozenColumns());
                tr = row.render(mhdrData[i], columns);
                hdrfrag.appendChild(tr);
            }
            args.virtualInfo.blockIndexes = bIndex;
            args.virtualInfo.page = page;
            if (isVFFrozenOnly && args.virtualInfo.page === 1) {
                modelData.splice(0, this.parent.frozenRows);
            }
        }
        this.virtualFrozenHdrRefresh(hdrfrag, modelData, row, args, dataSource, columns);
        if (this.parent.groupSettings.enableLazyLoading && !this.useGroupCache && this.parent.groupSettings.columns.length) {
            (this.parent.contentModule as GroupLazyLoadRenderer).refRowsObj[this.parent.pageSettings.currentPage] = [];
        }
        if (this.parent.enableInfiniteScrolling && this.parent.groupSettings.enableLazyLoading && args.requestType === 'delete') {//  || (this.parent.infiniteScrollSettings && this.parent.infiniteScrollSettings.enableCache))
            this.visibleRows = [];
        }
        for (let i: number = startIndex, len: number = modelData.length; i < len; i++) {
            this.rows.push(modelData[i]);
            if (this.parent.groupSettings.enableLazyLoading && !this.useGroupCache && this.parent.groupSettings.columns.length) {
                (this.parent.contentModule as GroupLazyLoadRenderer).refRowsObj[this.parent.pageSettings.currentPage].push(modelData[i]);
                this.setRowsInLazyGroup(modelData[i], i);
                if (isNullOrUndefined(modelData[i].indent)) {
                    continue;
                }
            }
            this.setInfiniteVisibleRows(args, modelData[i], tableName);
            if (isGroupAdaptive(gObj) && args.virtualInfo && args.virtualInfo.blockIndexes
                && (this.rowElements.length >= (args.virtualInfo.blockIndexes.length * this.parent.contentModule.getBlockSize()))
                && blockLoad) {
                this.parent.currentViewData['records'] = this.rows.map((m: Row<Column>) => m.data);
                break;
            }
            if (!gObj.rowTemplate) {
                tr = row.render(modelData[i], columns);
                const isVFreorder: boolean = this.ensureFrozenHeaderRender(args);
                if (gObj.frozenRows && i < gObj.frozenRows && !isInfiniteScroll && args.requestType !== 'virtualscroll' && isVFreorder
                    && this.ensureVirtualFrozenHeaderRender(args)) {
                    hdrfrag.appendChild(tr);
                } else {
                    frag.appendChild(tr);
                }
                if (modelData[i].isExpand) {
                    gObj.notify(events.expandChildGrid, (<HTMLTableRowElement>tr).cells[gObj.groupSettings.columns.length]);
                }
            } else {
                const rowTemplateID: string = gObj.element.id + 'rowTemplate';
                let elements: NodeList;
                if (gObj.isReact) {
                    const isHeader: boolean = gObj.frozenRows && i < gObj.frozenRows;
                    const copied: Object = extend({ index: i }, dataSource[i]);
                    gObj.getRowTemplate()(copied, gObj, 'rowTemplate', rowTemplateID, null, null, isHeader ? hdrfrag : frag);
                    gObj.renderTemplates();
                } else {
                    elements = gObj.getRowTemplate()(extend({ index: i }, dataSource[i]), gObj, 'rowTemplate', rowTemplateID,
                                                     undefined, undefined, undefined, this.parent['root']);
                }
                if (!gObj.isReact && (elements[0] as Element).tagName ===  'TBODY') {
                    for (let j: number = 0; j < elements.length; j++) {
                        const isTR: boolean = elements[j].nodeName.toLowerCase() === 'tr';
                        if (isTR || ((elements[j] as Element).querySelectorAll && (elements[j] as Element).querySelectorAll('tr').length)) {
                            tr = isTR ? elements[j] as Element : (elements[j] as Element).querySelector('tr');
                        }
                    }
                    if (gObj.frozenRows && i < gObj.frozenRows) {
                        hdrfrag.appendChild(tr);
                    } else {

                        frag.appendChild(tr);
                    }
                } else {
                    if (gObj.frozenRows && i < gObj.frozenRows) {
                        tr = !gObj.isReact ? appendChildren(hdrfrag, elements) : hdrfrag.lastElementChild;
                    } else {
                        // frag.appendChild(tr);
                        if (!gObj.isReact) {
                            tr = appendChildren(frag, elements);
                        }
                        trElement = gObj.isReact ? frag.lastElementChild : tr.lastElementChild;
                    }
                }
                const arg: RowDataBoundEventArgs = { data: modelData[i].data, row: trElement ? trElement : tr };
                this.parent.trigger(events.rowDataBound, arg);
            }
            if (modelData[i].isDataRow) {
                this.rowElements.push(tr);
            }
            this.ariaService.setOptions(this.getTable() as HTMLElement, { colcount: gObj.getColumns().length.toString() });
        }
        if (this.parent.enableInfiniteScrolling && this.parent.groupSettings.enableLazyLoading) {
            (this.parent.contentModule as GroupLazyLoadRenderer).refRowsObj[this.parent.pageSettings.currentPage] =
                (this.parent.contentModule as GroupLazyLoadRenderer)['groupCache'][this.parent.pageSettings.currentPage];
        }
        if (this.parent.groupSettings.enableLazyLoading && !this.useGroupCache && this.parent.groupSettings.columns.length) {
            this.parent.notify(events.refreshExpandandCollapse, {
                rows: (this.parent.contentModule as GroupLazyLoadRenderer).refRowsObj[this.parent.pageSettings.currentPage]
            });
        }
        if (isFrozenGrid) {
            contentModule.splitRows(tableName);
        }
        gObj.removeMaskRow();
        if ((gObj.frozenRows && args.requestType !== 'virtualscroll' && !isInfiniteScroll && this.ensureVirtualFrozenHeaderRender(args))
            || (args.requestType === 'virtualscroll' && args.virtualInfo.sentinelInfo && args.virtualInfo.sentinelInfo.axis === 'X')) {
            hdrTbody = isFrozenGrid ? contentModule.getFrozenHeader(tableName) : gObj.getHeaderTable().querySelector( literals.tbody);
            if (isReact) {
                const parentTable: HTMLElement = hdrTbody.parentElement;
                remove(hdrTbody);
                parentTable.appendChild(hdrfrag);
            } else {
                hdrTbody.innerHTML = '';
                hdrTbody.appendChild(hdrfrag);
            }
        }
        if (!gObj.enableVirtualization && gObj.frozenRows && idx === 0 && cont.offsetHeight === Number(gObj.height)) {
            cont.style.height = (cont.offsetHeight - hdrTbody.offsetHeight) + 'px';
        }
        args.rows = this.rows.slice(0);
        if (isFrozenGrid) {
            contentModule.setIsFrozen(args, tableName);
        }
        this.index = idx;
        getUpdateUsingRaf<HTMLElement>(
            () => {
                this.parent.notify(events.beforeFragAppend, args);
                const isVFTable: boolean = this.parent.enableVirtualization && this.parent.isFrozenGrid();
                if (!this.parent.enableVirtualization && !isInfiniteScroll) {
                    if (this.parent.isFrozenGrid()) {
                        remove(contentModule.getTbody(tableName));
                        tbdy = this.parent.createElement( literals.tbody, { attrs: { role: 'rowgroup' } });
                    } else {
                        this.tbody.innerHTML = '';
                        remove(this.tbody);
                        this.tbody = this.parent.createElement( literals.tbody, { attrs: { role: 'rowgroup' } });
                    }
                }
                if (isFrozenGrid && !isVFTable && !this.parent.enableInfiniteScrolling) {
                    this.appendContent(tbdy, frag as DocumentFragment, args, tableName);
                } else {
                    if (gObj.rowTemplate) {
                        updateBlazorTemplate(gObj.element.id + 'rowTemplate', 'RowTemplate', gObj);
                    }
                    if (isVFTable) {
                        if (args.renderFrozenRightContent) {
                            const frCont: Element = gObj.getContent().querySelector('.e-frozen-right-content').querySelector( literals.tbody);
                            this.appendContent(frCont, frag as DocumentFragment, args);
                        } else if (!args.renderMovableContent) {
                            this.appendContent(fCont.querySelector( literals.tbody), frag as DocumentFragment, args);
                        } else {
                            this.appendContent(mCont.querySelector( literals.tbody), frag as DocumentFragment, args);
                            args.renderMovableContent = false;
                        }
                        if (!this.parent.getFrozenColumns()) {
                            contentModule.renderNextFrozentPart(args, tableName);
                        }
                    } else {
                        if (!isNullOrUndefined(this.parent.infiniteScrollModule) && this.parent.enableInfiniteScrolling) {
                            this.isAddRows = false;
                            this.parent.notify(events.removeInfiniteRows, { args: args });
                            this.parent.notify(events.appendInfiniteContent, {
                                tbody: tbdy ? tbdy : this.tbody, frag: frag, args: args, rows: this.rows,
                                rowElements: this.rowElements, visibleRows: this.visibleRows,
                                tableName: tableName
                            });
                            if (!frzCols && isFrozenGrid) {
                                if ((gObj.getFrozenMode() !== literals.leftRight
                                    && (tableName === literals.frozenLeft || tableName === literals.frozenRight))
                                    || (gObj.getFrozenMode() === literals.leftRight
                                        && (tableName === literals.frozenLeft || tableName === 'movable'))) {
                                    this.refreshContentRows(extend({}, args));
                                }
                            }
                        } else {
                            this.useGroupCache = false;
                            this.appendContent(this.tbody, frag as DocumentFragment, args);
                        }
                    }
                }
                if (frzCols) {
                    contentModule.renderNextFrozentPart(args, tableName);
                }
                frag = null;
            },
            this.rafCallback(extend({}, args)));
    }

    public emptyVcRows(): void {
        this.parent.vcRows = [];
        this.parent.vRows = [];
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public appendContent(tbody: Element, frag: DocumentFragment, args: NotifyArgs, tableName?: string): void {
        const isReact: boolean = this.parent.isReact && !isNullOrUndefined(this.parent.rowTemplate);
        if (isReact) {
            this.getTable().appendChild(frag);
        } else {
            tbody.appendChild(frag);
            this.getTable().appendChild(tbody);
        }
    }

    private setRowsInLazyGroup(row: Row<Column>, index: number): void {
        if (this.parent.groupSettings.enableLazyLoading && !this.useGroupCache && this.parent.groupSettings.columns.length) {
            (this.parent.contentModule as GroupLazyLoadRenderer).maintainRows(row, index);
        }
    }

    private setGroupCache(data: Row<Column>[], args: NotifyArgs): void {
        if (!this.useGroupCache && this.parent.groupSettings.enableLazyLoading) {
            this.parent.notify(events.setGroupCache, { args: args, data: data });
        }
    }

    private ensureFrozenHeaderRender(args: NotifyArgs): boolean {
        return !((this.parent.enableVirtualization
            && (args.requestType === 'reorder' || args.requestType === 'refresh')) || (this.parent.infiniteScrollSettings.enableCache
                && this.parent.frozenRows && this.parent.infiniteScrollModule.requestType === 'delete'
                && this.parent.pageSettings.currentPage !== 1));
    }

    private ensureVirtualFrozenHeaderRender(args: NotifyArgs): boolean {
        return !(this.parent.enableVirtualization && args.requestType === 'delete');
    }

    private checkCache(modelData: Row<Column>[], args: InfiniteScrollArgs): Row<Column>[] {
        if (this.parent.infiniteScrollSettings.enableCache && args.requestType === 'infiniteScroll') {
            const index: number = args.isFrozen ? 1 : 0;
            const frozenCols: boolean = this.parent.isFrozenGrid();
            this.isAddRows = !isNullOrUndefined(this.infiniteCache[this.parent.pageSettings.currentPage]);
            if (frozenCols && !isNullOrUndefined(this.infiniteCache[this.parent.pageSettings.currentPage])) {
                this.isAddRows = (this.infiniteCache[this.parent.pageSettings.currentPage][index] as Row<Column>[]).length !== 0;
            }
            if (this.isAddRows) {
                const data: Row<Column>[] = !frozenCols ? this.infiniteCache[this.parent.pageSettings.currentPage] as Row<Column>[]
                    : this.infiniteCache[this.parent.pageSettings.currentPage][index] as Row<Column>[];
                modelData = this.parent.pageSettings.currentPage === 1 ? data.slice(this.parent.frozenRows) : data;
            }
            return modelData;
        }
        if (this.parent.groupSettings.enableLazyLoading && this.parent.groupSettings.columns.length &&
            (args.requestType === 'paging' || args.requestType === 'columnstate' || args.requestType === 'reorder')
            && (this.parent.contentModule as GroupLazyLoadRenderer).getGroupCache()[this.parent.pageSettings.currentPage]) {
            this.useGroupCache = true;
            return (this.parent.contentModule as GroupLazyLoadRenderer).initialGroupRows(args.requestType === 'reorder');
        }
        return null;
    }

    private setInfiniteVisibleRows(args: InfiniteScrollArgs, data: Row<Column>, tableName: freezeTable): void {
        const frozenCols: boolean = this.parent.isFrozenGrid();
        if (this.parent.enableInfiniteScrolling && !this.parent.infiniteScrollSettings.enableCache) {
            if (frozenCols) {
                if (tableName === literals.frozenLeft || (this.parent.getFrozenMode() === 'Right' && tableName === literals.frozenRight)) {
                    this.visibleFrozenRows.push(data);
                } else if (tableName === 'movable') {
                    this.visibleRows.push(data);
                } else {
                    this.rightFreezeRows.push(data);
                }
            } else if (!this.parent.infiniteScrollSettings.enableCache) {
                this.visibleRows.push(data);
            }
        }
    }

    private getCurrentBlockInfiniteRecords(isFreeze?: boolean): Row<Column>[] {
        let data: Row<Column>[] = [];
        if (this.parent.infiniteScrollSettings.enableCache) {
            if (!Object.keys(this.infiniteCache).length) {
                return [];
            }
            const frozenCols: boolean = this.parent.isFrozenGrid();
            const rows: Element[] = this.parent.getRows();
            let index: number = parseInt(rows[this.parent.frozenRows].getAttribute(literals.dataRowIndex), 10);
            const first: number = Math.ceil((index + 1) / this.parent.pageSettings.pageSize);
            index = parseInt(rows[rows.length - 1].getAttribute(literals.dataRowIndex), 10);
            const last: number = Math.ceil(index / this.parent.pageSettings.pageSize);
            if (frozenCols) {
                const idx: number = isFreeze ? 0 : 1;
                for (let i: number = first; i <= last; i++) {
                    data = !data.length ? this.infiniteCache[i][idx] as Row<Column>[]
                        : data.concat(this.infiniteCache[i][idx] as Row<Column>[]);
                }
                if (this.parent.frozenRows && this.parent.pageSettings.currentPage > 1) {
                    data = ((this.infiniteCache[1][idx] as Row<Column>[]).slice(0, this.parent.frozenRows) as Row<Column>[]).concat(data);
                }
            } else {
                for (let i: number = first; i <= last; i++) {
                    data = !data.length ? this.infiniteCache[i] as Row<Column>[] : data.concat(this.infiniteCache[i] as Row<Column>[]);
                }
                if (this.parent.frozenRows && this.parent.pageSettings.currentPage > 1) {
                    data = (this.infiniteCache[1].slice(0, this.parent.frozenRows) as Row<Column>[]).concat(data);
                }
            }
        }
        return data;
    }

    private getReorderedVFRows(args: NotifyArgs): Row<Column>[] {
        return (this.parent.contentModule as VirtualFreezeRenderer).getReorderedFrozenRows(args);
    }
    private getReorderedRows(args: NotifyArgs): Row<Column>[] {
        return (this.parent.contentModule as VirtualContentRenderer).getReorderedFrozenRows(args);
    }

    private virtualFrozenHdrRefresh(
        hdrfrag: DocumentFragment, modelData: Row<Column>[],
        row: RowRenderer<Column>, args: NotifyArgs, dataSource: Object, columns: Column[]
    ): void {
        if (this.parent.frozenRows && this.parent.enableVirtualization
            && (args.requestType === 'reorder' || args.requestType === 'refresh')) {
            let tr: Element;
            let fhdrData: Row<Column>[] = [];
            if (this.parent.isFrozenGrid()) {
                this.currentMovableRows = dataSource as Object[];
                fhdrData = this.getReorderedVFRows(args);
            } else {
                fhdrData = this.getReorderedRows(args);
            }
            for (let i: number = 0; i < fhdrData.length; i++) {
                tr = row.render(fhdrData[i], columns);
                hdrfrag.appendChild(tr);
            }
            if (args.virtualInfo.page === 1) {
                modelData.splice(0, this.parent.frozenRows);
            }
            if (args.renderMovableContent) {
                this.parent.currentViewData = this.currentMovableRows;
                this.currentMovableRows = null;
            }
        }
    }

    protected getInfiniteRows(): Row<Column>[] {
        let rows: Row<Column>[] = [];
        const frozenCols: boolean = this.parent.isFrozenGrid();
        if (this.parent.enableInfiniteScrolling) {
            if (this.parent.infiniteScrollSettings.enableCache) {
                const keys: string[] = Object.keys(this.infiniteCache);
                for (let i: number = 0; i < keys.length; i++) {
                    rows = !frozenCols ? [...rows, ...this.infiniteCache[keys[i]]] : [...rows, ...this.infiniteCache[keys[i]][0]];
                }
            } else {
                rows = frozenCols ? this.visibleFrozenRows : this.visibleRows;
            }
        }
        return rows;
    }

    private getInfiniteMovableRows(): Row<Column>[] {
        const infiniteCacheRows: Row<Column>[] = this.getCurrentBlockInfiniteRecords();
        const infiniteRows: Row<Column>[] = this.parent.enableInfiniteScrolling ? infiniteCacheRows.length ? infiniteCacheRows
            : this.visibleRows : [];
        return infiniteRows;
    }

    /**
     * Get the content div element of grid
     *
     * @returns {Element} returns the element
     */
    public getPanel(): Element {
        return this.contentPanel;
    }

    /**
     * Set the content div element of grid
     *
     * @param  {Element} panel - specifies the panel
     * @returns {void}
     */
    public setPanel(panel: Element): void {
        this.contentPanel = panel;
    }

    /**
     * Get the content table element of grid
     *
     * @returns {Element} returns the element
     */
    public getTable(): Element {
        return this.contentTable;
    }

    /**
     * Set the content table element of grid
     *
     * @param  {Element} table - specifies the table
     * @returns {void}
     */
    public setTable(table: Element): void {
        this.contentTable = table;
    }

    /**
     * Get the Movable Row collection in the Freeze pane Grid.
     *
     * @returns {Row[] | HTMLCollectionOf<HTMLTableRowElement>} returns the row
     */
    public getRows(): Row<Column>[] | HTMLCollectionOf<HTMLTableRowElement> {
        const infiniteRows: Row<Column>[] = this.getInfiniteRows();
        return infiniteRows.length ? infiniteRows : this.parent.getFrozenColumns() ? this.freezeRows : this.rows;
    }

    /**
     * Get the Movable Row collection in the Freeze pane Grid.
     *
     * @returns {Row[] | HTMLCollectionOf<HTMLTableRowElement>} returns the row
     */
    public getMovableRows(): Row<Column>[] | HTMLCollectionOf<HTMLTableRowElement> {
        const infiniteRows: Row<Column>[] = this.getInfiniteMovableRows();
        return infiniteRows.length ? infiniteRows : this.movableRows;
    }

    /**
     * Get the content table data row elements
     *
     * @returns {Element} returns the element
     */
    public getRowElements(): Element[] {
        return this.parent.getFrozenColumns() ? this.freezeRowElements : this.rowElements;
    }

    /**
     * Get the Freeze pane movable content table data row elements
     *
     * @returns {Element} returns the element
     */
    public getMovableRowElements(): Element[] {
        return this.rowElements;
    }

    /**
     * Get the content table data row elements
     *
     * @param {Element[]} elements - specifies the elements
     * @returns {void}
     */
    public setRowElements(elements: Element[]): void {
        this.rowElements = elements;
    }

    /**
     * Get the header colgroup element
     *
     * @returns {Element} returns the element
     */
    public getColGroup(): Element {
        return this.colgroup;
    }

    /**
     * Set the header colgroup element
     *
     * @param {Element} colGroup - specifies the colgroup
     * @returns {Element} returns the element
     */
    public setColGroup(colGroup: Element): Element {
        if (!isNullOrUndefined(colGroup)) {
            colGroup.id = 'content-' + colGroup.id;
        }
        return this.colgroup = colGroup;
    }

    /**
     * Function to hide content table column based on visible property
     *
     * @param {Column[]} columns - specifies the column
     * @returns {void}
     */
    public setVisible(columns?: Column[]): void {
        const gObj: IGrid = this.parent;
        const isFrozenGrid: boolean = this.parent.isFrozenGrid();
        const frzCols: number = gObj.getFrozenColumns();
        let rows: Row<Column>[] = [];
        if (isFrozenGrid) {
            const fRows: Row<Column>[] = this.freezeRows;
            const mRows: Row<Column>[] = this.movableRows;
            const rowLen: number = fRows.length;
            let cellLen: number;
            let rightRows: Row<Column>[] = [];
            if (gObj.getFrozenMode() === literals.leftRight) {
                rightRows = gObj.getFrozenRightRowsObject();
            }
            for (let i: number = 0, row: Row<Column>; i < rowLen; i++) {
                cellLen = mRows[i].cells.length;
                const rightLen: number = rightRows.length ? rightRows[i].cells.length : 0;
                row = fRows[i].clone();
                for (let j: number = 0; j < cellLen; j++) {
                    row.cells.push(mRows[i].cells[j]);
                }
                for (let k: number = 0; k < rightLen; k++) {
                    row.cells.push(rightRows[i].cells[k]);
                }
                rows.push(row);
            }
        } else {
            rows = <Row<Column>[]>this.getRows();
        }
        let testRow: Row<Column>;
        rows.some((r: Row<Column>) => { if (r.isDataRow) { testRow = r; } return r.isDataRow; });

        let needFullRefresh: boolean = true;
        if (!gObj.groupSettings.columns.length && testRow) {
            needFullRefresh = false;
        }
        let tr: Object = gObj.getDataRows();
        const args: NotifyArgs = {};
        const infiniteData: Row<Column>[] = this.infiniteRowVisibility();
        let contentrows: Row<Column>[] = infiniteData ? infiniteData
            : this.rows.filter((row: Row<Column>) => !row.isDetailRow);
        for (let c: number = 0, clen: number = columns.length; c < clen; c++) {
            const column: Column = columns[c];
            let idx: number = this.parent.getNormalizedColumnIndex(column.uid);
            let colIdx: number = this.parent.getColumnIndexByUid(column.uid);
            const displayVal: string = column.visible === true ? '' : 'none';
            if (idx !== -1 && testRow && idx < testRow.cells.length) {
                if (isFrozenGrid) {
                    if (column.getFreezeTableName() !== 'movable') {
                        if (column.getFreezeTableName() === literals.frozenRight) {
                            const left: number = this.parent.getFrozenLeftColumnsCount();
                            const movable: number = this.parent.getMovableColumnsCount();
                            colIdx = idx = idx - (left + movable);
                            const colG: Element = this.parent.getContent().querySelector('.e-frozen-right-content').querySelector(literals.colGroup);
                            setStyleAttribute(<HTMLElement>colG.childNodes[idx], { 'display': displayVal });
                            contentrows = gObj.getFrozenRightRowsObject();
                            tr = gObj.getFrozenRightDataRows();
                        } else {
                            setStyleAttribute(<HTMLElement>this.getColGroup().childNodes[idx], { 'display': displayVal });
                            const infiniteFreezeData: Row<Column>[] = this.infiniteRowVisibility(true);
                            contentrows = infiniteFreezeData ? infiniteFreezeData : this.freezeRows;
                            tr = gObj.getDataRows();
                        }
                    } else {
                        const mTable: Element = gObj.getContent().querySelector('.' + literals.movableContent).querySelector(literals.colGroup);
                        colIdx = idx = idx - frzCols - this.parent.getFrozenLeftColumnsCount();
                        setStyleAttribute(<HTMLElement>mTable.childNodes[idx], { 'display': displayVal });
                        tr = (<Grid>gObj).getMovableDataRows();
                        const infiniteMovableData: Row<Column>[] = this.infiniteRowVisibility();
                        contentrows = infiniteMovableData ? infiniteMovableData : this.movableRows;
                    }
                } else {
                    setStyleAttribute(<HTMLElement>this.getColGroup().childNodes[idx], { 'display': displayVal });
                }
            }
            if (!needFullRefresh) {
                this.setDisplayNone(tr, colIdx, displayVal, contentrows);
                if (isFrozenGrid) {
                    this.parent.notify(events.freezeRender, { case: 'refreshHeight', isModeChg: true });
                }
            }
            if (!this.parent.invokedFromMedia && column.hideAtMedia) {
                this.parent.updateMediaColumns(column);
            }
            this.parent.invokedFromMedia = false;
        }
        if (needFullRefresh) {
            this.refreshContentRows({ requestType: 'refresh' });
        } else {
            if (!this.parent.getFrozenColumns()) {
                this.parent.notify(events.partialRefresh, { rows: contentrows, args: args });
            } else {
                this.parent.notify(events.partialRefresh, { rows: this.freezeRows, args: { isFrozen: true, rows: this.freezeRows } });
                this.parent.notify(events.partialRefresh, { rows: this.movableRows, args: { isFrozen: false, rows: this.movableRows } });
            }
        }
    }

    /**
     * @param {Object} tr - specifies the trr
     * @param {number} idx - specifies the idx
     * @param {string} displayVal - specifies the displayval
     * @param {Row<Column>} rows - specifies the rows
     * @returns {void}
     * @hidden
     */
    public setDisplayNone(tr: Object, idx: number, displayVal: string, rows: Row<Column>[]): void {
        setDisplayValue(tr, idx, displayVal, rows, this.parent, this.parent.isRowDragable());
        this.parent.notify(events.infiniteShowHide, { visible: displayVal, index: idx, isFreeze: this.isInfiniteFreeze });
    }

    private infiniteRowVisibility(isFreeze?: boolean): Row<Column>[] {
        let infiniteData: Row<Column>[];
        if (this.parent.enableInfiniteScrolling) {
            this.isInfiniteFreeze = isFreeze;
            if (this.parent.infiniteScrollSettings.enableCache) {
                infiniteData = isFreeze ? this.getCurrentBlockInfiniteRecords(true) : this.getCurrentBlockInfiniteRecords();
            } else {
                infiniteData = isFreeze ? this.visibleFrozenRows : this.visibleRows;
            }
        }
        return infiniteData;
    }

    private colGroupRefresh(): void {
        if (this.getColGroup()) {
            let colGroup: Element;
            if (this.parent.enableColumnVirtualization && this.parent.getFrozenColumns()
                && (<{ isXaxis?: Function }>this.parent.contentModule).isXaxis()) {
                colGroup = <Element>this.parent.getMovableVirtualHeader()
                    .querySelector(literals.colGroup + ':not(.e-masked-colgroup)').cloneNode(true);
            } else {
                colGroup = this.getHeaderColGroup();
            }
            this.getTable().replaceChild(colGroup, this.getColGroup());
            this.setColGroup(colGroup);
        }
    }

    protected getHeaderColGroup(): Element {
        return <Element>this.parent.element.querySelector('.' + literals.gridHeader)
            .querySelector(literals.colGroup + ':not(.e-masked-colgroup)').cloneNode(true);
    }

    private initializeContentDrop(): void {
        const gObj: IGrid = this.parent;
        this.droppable = new Droppable(gObj.element as HTMLElement, {
            accept: '.e-dragclone',
            drop: this.drop as (e: DropEventArgs) => void
        });
    }

    private droppableDestroy(): void {
        if (this.droppable && !this.droppable.isDestroyed) {
            this.droppable.destroy();
        }
    }


    private canSkip(column: Column, row: Row<Column>, index: number): boolean {
        /**
         * Skip the toggle visiblity operation when one of the following success
         * 1. Grid has empty records
         * 2. column visible property is unchanged
         * 3. cell`s isVisible property is same as column`s visible property.
         */
        return isNullOrUndefined(row) ||           //(1)
            isNullOrUndefined(column.visible) ||   //(2)
            row.cells[index].visible === column.visible;  //(3)
    }

    public getModelGenerator(): IModelGenerator<Column> {
        return this.generator = this.parent.allowGrouping ? new GroupModelGenerator(this.parent) : new RowModelGenerator(this.parent);
    }

    public renderEmpty(tbody: HTMLElement): void {
        this.getTable().appendChild(tbody);
        if (this.parent.frozenRows) {
            this.parent.getHeaderContent().querySelector( literals.tbody).innerHTML = '';
        }
    }

    public setSelection(uid: string, set: boolean, clearAll?: boolean): void {
        this.parent.notify(events.setFreezeSelection, { uid: uid, set: set, clearAll: clearAll });
        const isFrozen: boolean = this.parent.isFrozenGrid();
        if (isFrozen && this.parent.enableVirtualization) {
            return;
        }
        if (isFrozen) {
            const rows: Row<Column>[] = (<Row<Column>[]>this.getMovableRows()).filter((row: Row<Column>) => clearAll || uid === row.uid);
            for (let i: number = 0; i < rows.length; i++) {
                rows[i].isSelected = set;
            }
        }
        const row: Row<Column>[] = (<Row<Column>[]>this.getRows()).filter((row: Row<Column>) => clearAll || uid === row.uid);
        for (let j: number = 0; j < row.length; j++) {
            row[j].isSelected = set;
            const cells: Cell<Column>[] = row[j].cells;
            for (let k: number = 0; k < cells.length; k++) {
                cells[k].isSelected = set;
            }
        }
    }

    public getRowByIndex(index: number): Element {
        index = this.getInfiniteRowIndex(index);
        return this.parent.getDataRows()[index];
    }

    private getInfiniteRowIndex(index: number): number {
        if (this.parent.infiniteScrollSettings.enableCache) {
            const fRows: number = this.parent.frozenRows;
            const idx: number = fRows > index ? 0 : fRows;
            const firstRowIndex: number = parseInt(this.parent.getRows()[idx].getAttribute(literals.dataRowIndex), 10);
            index = fRows > index ? index : (index - firstRowIndex) + fRows;
        }
        return index;
    }


    public getVirtualRowIndex(index: number): number {
        return index;
    }

    public getMovableRowByIndex(index: number): Element {
        index = this.getInfiniteRowIndex(index);
        return this.parent.getMovableDataRows()[index];
    }

    private enableAfterRender(e: NotifyArgs): void {
        if (e.module === 'group' && e.enable) {
            this.generator = this.getModelGenerator();
        }
    }

    public setRowObjects(rows: Row<Column>[]): void {
        this.rows = rows;
    }

    /**
     * @param {NotifyArgs} args - specifies the args
     * @returns {void}
     * @hidden
     */
    public immutableModeRendering(args: NotifyArgs = {}): void {
        const gObj: IGrid = this.parent;
        gObj.hideSpinner();
        const key: string = gObj.getPrimaryKeyFieldNames()[0];
        const oldKeys: object = {}; const newKeys: object = {}; const newRowObjs: Row<Column>[] = [];
        const oldIndexes: Object = {};
        const oldRowObjs: Row<Column>[] = gObj.getRowsObject().slice();
        const batchChangeKeys: Object = this.getBatchEditedRecords(key, oldRowObjs); const newIndexes: Object = {};
        const hasBatch: boolean = Object.keys(batchChangeKeys).length !== 0;
        if (gObj.getContent().querySelector('.e-emptyrow') || args.requestType === 'reorder'
            || this.parent.groupSettings.columns.length) {
            this.refreshContentRows(args);
        } else {
            if (gObj.currentViewData.length === 0) { return; }
            const oldRowElements: Object = {};
            const tbody: Element = gObj.createElement( literals.tbody, { attrs: { role: 'rowgroup' } });
            const dataSource: Object[] = gObj.currentViewData;
            const trs: Element[] = [].slice.call(this.getTable().querySelector( literals.tbody).children);
            if (this.prevCurrentView.length) {
                const prevLen: number = this.prevCurrentView.length;
                const currentLen: number = dataSource.length;
                if (prevLen === currentLen) {
                    for (let i: number = 0; i < currentLen; i++) {
                        if (this.parent.editSettings.mode === 'Batch'
                            && trs[i].classList.contains('e-insertedrow')) {
                            trs.splice(i, 1);
                            --i;
                            continue;
                        }
                        newKeys[dataSource[i][key]] = oldKeys[this.prevCurrentView[i][key]] = i;
                        newIndexes[i] = dataSource[i][key];
                        oldRowElements[oldRowObjs[i].uid] = trs[i];
                        oldIndexes[i] = this.prevCurrentView[i][key];
                    }
                } else {
                    for (let i: number = 0; i < currentLen; i++) {
                        newKeys[dataSource[i][key]] = i;
                        newIndexes[i] = dataSource[i][key];
                    }
                    for (let i: number = 0; i < prevLen; i++) {
                        if (this.parent.editSettings.mode === 'Batch'
                            && trs[i].classList.contains('e-insertedrow')) {
                            trs.splice(i, 1);
                            --i;
                            continue;
                        }
                        oldRowElements[oldRowObjs[i].uid] = trs[i];
                        oldKeys[this.prevCurrentView[i][key]] = i;
                        oldIndexes[i] = this.prevCurrentView[i][key];
                    }
                }
            }
            for (let i: number = 0; i < dataSource.length; i++) {
                const oldIndex: number = oldKeys[dataSource[i][key]];
                if (!isNullOrUndefined(oldIndex)) {
                    let isEqual: boolean = false;
                    if (this.parent.enableDeepCompare) {
                        isEqual = this.objectEqualityChecker(this.prevCurrentView[oldIndex], dataSource[i]);
                    }
                    const tr: HTMLTableRowElement = oldRowElements[oldRowObjs[oldIndex].uid] as HTMLTableRowElement;
                    newRowObjs.push(oldRowObjs[oldIndex]);
                    if (this.rowElements[oldIndex] && this.rowElements[oldIndex].getAttribute('data-uid') === newRowObjs[i].uid
                        && ((hasBatch && isNullOrUndefined(batchChangeKeys[newIndexes[i]]))
                            || (!hasBatch && (isEqual || this.prevCurrentView[oldIndex] === dataSource[i])))) {
                        if (oldIndex !== i) {
                            this.refreshImmutableContent(i, tr, newRowObjs[i]);
                        }
                        tbody.appendChild(tr);
                        continue;
                    }
                    if ((hasBatch && !isNullOrUndefined(batchChangeKeys[newIndexes[i]]))
                        || (!this.parent.enableDeepCompare && dataSource[i] !== this.prevCurrentView[oldIndex])
                        || (this.parent.enableDeepCompare && !isEqual)) {
                        oldRowObjs[oldIndex].setRowValue(dataSource[i]);
                    }
                    tbody.appendChild(tr);
                    this.refreshImmutableContent(i, tr, newRowObjs[i]);
                } else {
                    const row: RowRenderer<Column> = new RowRenderer<Column>(this.serviceLocator, null, gObj);
                    const modelData: Row<Column>[] = this.generator.generateRows([dataSource[i]]);
                    newRowObjs.push(modelData[0]);
                    const tr: HTMLTableRowElement = row.render(modelData[0], gObj.getColumns()) as HTMLTableRowElement;
                    tbody.appendChild(tr);
                    this.refreshImmutableContent(i, tr, newRowObjs[i]);
                }
            }
            this.rows = newRowObjs;
            this.rowElements = [].slice.call(tbody.children);
            remove(this.getTable().querySelector( literals.tbody));
            this.getTable().appendChild(tbody);
            this.parent.trigger(events.dataBound, {}, () => {
                if (this.parent.allowTextWrap) {
                    this.parent.notify(events.freezeRender, { case: 'textwrap' });
                }
            });
            if (args) {
                const action: string = (args.requestType || '').toLowerCase() + '-complete';
                this.parent.notify(action, args);
            }
        }
    }

    private objectEqualityChecker(old: Object, next: Object): boolean {
        const keys: string[] = Object.keys(old);
        let isEqual: boolean = true;
        for (let i: number = 0; i < keys.length; i++) {
            if (old[keys[i]] !== next[keys[i]]) {
                const isDate: boolean = old[keys[i]] instanceof Date && next[keys[i]] instanceof Date;
                if (!isDate || ((old[keys[i]] as Date).getTime() !== (next[keys[i]] as Date).getTime())) {
                    isEqual = false; break;
                }
            }
        }
        return isEqual;
    }

    private getBatchEditedRecords(primaryKey: string, rows: Row<Column>[]): Object {
        const keys: Object = {};
        const changes: Object = (this.parent as Grid).getBatchChanges();
        let changedRecords: Object[] = [];
        let addedRecords: Object[] = [];
        if (Object.keys(changes).length) {
            changedRecords = (<{ changedRecords?: Object[] }>changes).changedRecords;
            addedRecords = (<{ addedRecords?: Object[] }>changes).addedRecords;
        }
        const args: NotifyArgs = { cancel: false };
        this.parent.notify(events.immutableBatchCancel, { rows: rows, args: args });
        if (addedRecords.length) {
            if (this.parent.editSettings.newRowPosition === 'Bottom') {
                rows.splice(rows.length - 1, addedRecords.length);
            } else {
                if (!args.cancel) {
                    rows.splice(0, addedRecords.length);
                }
            }
        }
        for (let i: number = 0; i < changedRecords.length; i++) {
            keys[changedRecords[i][primaryKey]] = i;
        }
        return keys;
    }

    private refreshImmutableContent(index: number, tr: HTMLTableRowElement, row: Row<Column>): void {
        row.isAltRow = this.parent.enableAltRow ? index % 2 !== 0 : false;
        if (row.isAltRow) {
            tr.classList.add('e-altrow');
        } else {
            tr.classList.remove('e-altrow');
        }
        row.index = index;
        row.edit = undefined;
        row.isDirty = false;
        tr.setAttribute(literals.dataRowIndex, index.toString());
        tr.setAttribute(literals.ariaRowIndex, (index + 1).toString());
        this.updateCellIndex(tr, index);
    }

    private updateCellIndex(rowEle: HTMLTableRowElement, index: number): void {
        for (let i: number = 0; i < rowEle.cells.length; i++) {
            rowEle.cells[i].setAttribute('index', index.toString());
        }
    }
}
