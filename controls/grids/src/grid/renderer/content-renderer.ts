import { Droppable, DropEventArgs } from '@syncfusion/ej2-base';
import { isNullOrUndefined, extend } from '@syncfusion/ej2-base';
import { setStyleAttribute, remove, updateBlazorTemplate } from '@syncfusion/ej2-base';
import { getUpdateUsingRaf, appendChildren, setDisplayValue, clearReactVueTemplates, getScrollBarWidth, getScrollWidth, getTransformValues } from '../base/util';
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
import { isGroupAdaptive, addFixedColumnBorder } from '../base/util';
import { Grid } from '../base/grid';
import { VirtualContentRenderer } from '../renderer/virtual-content-renderer';
import { ColumnWidthService } from '../services/width-controller';
import { GroupLazyLoadRenderer } from './group-lazy-load-renderer';
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
    private widthService: ColumnWidthService;
    protected rows: Row<Column>[] = [];
    protected freezeRows: Row<Column>[] = [];
    protected movableRows: Row<Column>[] = [];
    protected rowElements: Element[];
    protected freezeRowElements: Element[] = [];
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
    private drop: Function = (e: DropEventArgs) => {
        this.parent.notify(events.columnDrop, { target: e.target, droppedElement: e.droppedElement });
        remove(e.droppedElement);
    }
    private infiniteCache: { [x: number]: Row<Column>[] } | { [x: number]: Row<Column>[][] } = {};
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
    /** @hidden */
    public tempFreezeRows: Row<Column>[] = [];

    private rafCallback: Function = (args: NotifyArgs) => {
        const arg: NotifyArgs = args;
        return () => {
            this.ariaService.setBusy(<HTMLElement>this.getPanel().querySelector('.' + literals.content), false);
            if (this.parent.isDestroyed) { return; }
            let rows: Row<Column>[] = this.rows.slice(0);
            if (this.parent.enableInfiniteScrolling) {
                if (this.parent.groupSettings.enableLazyLoading) {
                    for (let i: number = 0; i < this.visibleRows.length; i++) {
                        this.setRowsInLazyGroup(this.visibleRows[parseInt(i.toString(), 10)], i);
                    }
                }
                rows = this.parent.getRowsObject(); const prevPage: number = (<{ prevPage: number }>arg).prevPage;
                if (this.parent.infiniteScrollSettings.enableCache && prevPage) {
                    const maxBlock: number = this.parent.infiniteScrollSettings.maxBlocks; rows = [];
                    const rowIdx: number = (parseInt(this.rowElements[0].getAttribute('data-rowindex'), 10) + 1);
                    const startIdx: number = Math.ceil(rowIdx / this.parent.pageSettings.pageSize);
                    for (let i: number = 0, count: number = startIdx; i < maxBlock; i++, count++) {
                        if (this.infiniteCache[parseInt(count.toString(), 10)]) {
                            rows = [...rows, ...this.infiniteCache[parseInt(count.toString(), 10)]] as Row<Column>[];
                        }
                    }
                }
            }
            this.parent.notify(events.contentReady, { rows: rows, args: arg });
            if (this.parent.editSettings.showAddNewRow && this.parent.addNewRowFocus) {
                this.parent.notify(events.showAddNewRowFocus, {});
                this.parent.addNewRowFocus = false;
            }
            if (this.parent.autoFit) {
                this.parent.preventAdjustColumns();
            }
            if (!this.parent.isInitialLoad) {
                this.parent.focusModule.setFirstFocusableTabIndex();
            }
            if (this.isLoaded) {
                this.parent.isManualRefresh = false;
                if (this.parent.enableInfiniteScrolling && this.parent.groupSettings.enableLazyLoading && args.requestType === 'sorting') {
                    this.parent.infiniteScrollModule['groupCaptionAction'] = undefined;
                }
                const isReactChild: boolean = this.parent.parentDetails && this.parent.parentDetails.parentInstObj &&
                        this.parent.parentDetails.parentInstObj.isReact;
                if ((this.parent.isReact || isReactChild) && this.parent.element.querySelectorAll('.e-templatecell').length) {
                    // eslint-disable-next-line @typescript-eslint/no-this-alias
                    const thisRef: ContentRender = this;
                    thisRef.parent.renderTemplates(function(): void {
                        thisRef.parent.trigger(events.dataBound, {}, () => {
                            if (thisRef.parent.allowTextWrap) {
                                thisRef.parent.notify(events.freezeRender, { case: 'textwrap' });
                            }
                        });
                    });
                }
                else {
                    this.parent.trigger(events.dataBound, {}, () => {
                        if (this.parent.allowTextWrap) {
                            this.parent.notify(events.freezeRender, { case: 'textwrap' });
                        }
                    });
                }
                if (this.parent.allowTextWrap && this.parent.height === 'auto'){
                    if (this.parent.getContentTable().scrollHeight > this.parent.getContent().clientHeight) {
                        this.parent.scrollModule.setPadding();
                    }
                    else{
                        this.parent.scrollModule.removePadding();
                    }
                }
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
        this.widthService = serviceLocator.getService<ColumnWidthService>('widthService');
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
        if (this.parent.enableColumnVirtualization && this.parent.isFrozenGrid()) {
            this.renderHorizontalScrollbar(div);
            innerDiv.classList.add('e-virtual-content');
        }
        div.appendChild(innerDiv);
        this.setPanel(div);
        gObj.element.appendChild(div);
    }


    protected renderHorizontalScrollbar(element?: Element): void {
        const parent: Element = this.parent.createElement('div', { className: 'e-movablescrollbar' });
        const child: Element = this.parent.createElement('div', { className: 'e-movablechild' });
        const scrollbarHeight: string = getScrollBarWidth().toString();
        this.setScrollbarHeight(child as HTMLElement, scrollbarHeight);
        this.setScrollbarHeight(parent as HTMLElement, scrollbarHeight);
        parent.appendChild(child);
        element.appendChild(parent);
    }

    private setScrollbarHeight(ele: HTMLElement, height: string): void {
        ele.style.minHeight = height + 'px';
        ele.style.maxHeight = height + 'px';
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
        if (this.parent.selectionSettings.type === 'Multiple') {
            this.ariaService.setOptions(this.parent.element, {
                multiselectable: true
            });
        }
        this.initializeContentDrop();
        if (this.parent.frozenRows) {
            this.parent.getHeaderContent().classList.add('e-frozenhdr');
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
                    cellspacing: '0.25px', role: 'presentation',
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
        if (gObj.editSettings && gObj.editModule && gObj.editSettings.mode === 'Batch' && gObj.editModule.formObj
            && gObj.editSettings.showConfirmDialog === false) {
            gObj.editModule.destroyForm();
        }
        const dataSource: Object = this.currentMovableRows || gObj.currentViewData;
        const isReact: boolean = gObj.isReact && !isNullOrUndefined(gObj.rowTemplate);
        let frag: DocumentFragment | HTMLElement = isReact ? gObj.createElement( literals.tbody, { attrs: { role: 'rowgroup' } }) : document.createDocumentFragment();
        if (!this.initialPageRecords) {
            this.initialPageRecords = extend([], dataSource);
        }
        const hdrfrag: DocumentFragment = isReact ? gObj.createElement( literals.tbody, { attrs: { role: 'rowgroup' } }) : document.createDocumentFragment();
        let refFrag: DocumentFragment | HTMLElement;
        let refHdrfrag: DocumentFragment;
        if (gObj.isReact && gObj.rowTemplate) {
            refFrag = frag;
            refHdrfrag = hdrfrag;
        }
        const columns: Column[] = <Column[]>gObj.getColumns();
        let tr: Element; let hdrTbody: HTMLElement;
        let trElement: Element;
        const row: RowRenderer<Column> = new RowRenderer<Column>(this.serviceLocator, null, this.parent);
        const isInfiniteScroll: boolean = this.parent.enableInfiniteScrolling
            && (args as InfiniteScrollArgs).requestType === 'infiniteScroll';
        const isColumnVirtualInfiniteProcess: boolean = this.isInfiniteColumnvirtualization() && args.requestType !== 'virtualscroll';
        gObj.notify(events.destroyChildGrid, {});
        this.rowElements = [];
        this.rows = [];
        this.tempFreezeRows = [];
        let tbdy: Element;
        let tableName: freezeTable;
        let isGroupFrozenHdr: boolean = this.parent.frozenRows && this.parent.groupSettings.columns.length ? true : false;
        if (isGroupAdaptive(gObj)) {
            if (['sorting', 'filtering', 'searching', 'grouping', 'ungrouping', 'reorder', 'save', 'delete']
                .some((value: string) => { return args.requestType === value; })) {
                this.emptyVcRows();
            }
        }
        let modelData: Row<Column>[];
        modelData = this.checkCache(modelData, args);
        if (!this.isAddRows && !this.useGroupCache) {
            modelData = this.generator.generateRows(dataSource, args);
        }
        this.setGroupCache(modelData, args);
        this.parent.notify(events.setInfiniteCache, { isInfiniteScroll: isInfiniteScroll, modelData: modelData, args: args });
        const isFrozenLeft: boolean = false;
        /* eslint-disable */
        if (!(args.requestType === 'infiniteScroll' && !this.parent.infiniteScrollSettings.enableCache) && (this.parent as any).registeredTemplate
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
        if ((this.parent.isReact || this.parent.isVue) && !(args.requestType === 'infiniteScroll' && !this.parent.infiniteScrollSettings.enableCache) && !args.isFrozen) {
            let templates: string[] = [
                this.parent.isVue ? 'template' : 'columnTemplate', 'rowTemplate', 'detailTemplate',
                'captionTemplate', 'commandsTemplate', 'groupFooterTemplate', 'groupCaptionTemplate'
            ];
            if (args.requestType === 'infiniteScroll' && this.parent.infiniteScrollSettings.enableCache) {
                templates = [
                    this.parent.isVue ? 'template' : 'columnTemplate', 'commandsTemplate'
                ];
            }
            clearReactVueTemplates(this.parent, templates);
        }
        if (this.parent.enableColumnVirtualization) {
            const cellMerge: CellMergeRender<Column> = new CellMergeRender(this.serviceLocator, this.parent);
            cellMerge.updateVirtualCells(modelData);
        }
        this.tbody = this.getTable().querySelector( literals.tbody);
        let startIndex: number = 0;
        let blockLoad: boolean = true;
        if (isGroupAdaptive(gObj) && gObj.vcRows.length) {
            const top: string = 'top';
            const scrollTop: number = !isNullOrUndefined(args.virtualInfo.offsets) ? args.virtualInfo.offsets.top :
                (!isNullOrUndefined(args.scrollTop) ? args.scrollTop[`${top}`] : 0);
            if (scrollTop !== 0) {
                const offsets: { [x: number]: number } = gObj.vGroupOffsets;
                const bSize: number = gObj.pageSettings.pageSize / 2;
                const values: number[] = Object.keys(offsets).map((key: string) => offsets[`${key}`]);
                for (let m: number = 0; m < values.length; m++) {
                    if (scrollTop < values[parseInt(m.toString(), 10)]) {
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
        const isVFFrozenOnly: boolean = gObj.frozenRows && this.parent.enableVirtualization
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
                // mhdrData[parseInt(i.toString(), 10)].cells.splice(0, this.parent.getFrozenColumns());
                tr = row.render(mhdrData[parseInt(i.toString(), 10)], columns);
                addFixedColumnBorder(tr);
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
            (this.parent.enableVirtualization ? this.parent.lazyLoadRender as GroupLazyLoadRenderer :
                this.parent.contentModule as GroupLazyLoadRenderer).refRowsObj[this.parent.pageSettings.currentPage] = [];
        }
        if (this.parent.enableInfiniteScrolling && this.parent.groupSettings.enableLazyLoading && args.requestType === 'delete') {//  || (this.parent.infiniteScrollSettings && this.parent.infiniteScrollSettings.enableCache))
            this.visibleRows = [];
        }
        for (let i: number = startIndex, len: number = modelData.length; i < len; i++) {
            this.rows.push(modelData[parseInt(i.toString(), 10)]);
            if (this.parent.groupSettings.enableLazyLoading && !this.useGroupCache && this.parent.groupSettings.columns.length) {
                (this.parent.enableVirtualization ? this.parent.lazyLoadRender as GroupLazyLoadRenderer :
                    this.parent.contentModule as GroupLazyLoadRenderer).refRowsObj[this.parent.pageSettings.currentPage].push(
                    modelData[parseInt(i.toString(), 10)]);
                this.setRowsInLazyGroup(modelData[parseInt(i.toString(), 10)], i);
                if (isNullOrUndefined(modelData[parseInt(i.toString(), 10)].indent)) {
                    continue;
                }
            }
            this.setInfiniteVisibleRows(args, modelData[parseInt(i.toString(), 10)]);
            if (isGroupAdaptive(gObj) && args.virtualInfo && args.virtualInfo.blockIndexes
                && (this.rowElements.length >= (args.virtualInfo.blockIndexes.length * this.parent.contentModule.getBlockSize()))
                && blockLoad) {
                this.parent.currentViewData['records'] = this.rows.map((m: Row<Column>) => m.data);
                break;
            }
            if (!gObj.rowTemplate) {
                tr = row.render(modelData[parseInt(i.toString(), 10)], columns);
                addFixedColumnBorder(tr);
                const isVFreorder: boolean = this.ensureFrozenHeaderRender(args);
                if (gObj.frozenRows && (i < gObj.frozenRows || isGroupFrozenHdr) && !isInfiniteScroll && args.requestType !== 'virtualscroll' && isVFreorder
                    && this.ensureVirtualFrozenHeaderRender(args)) {
                    hdrfrag.appendChild(tr);
                } else {
                    frag.appendChild(tr);
                }
                const rowIdx: number = parseInt(tr.getAttribute('data-rowindex'), 10);
                if (rowIdx + 1 === gObj.frozenRows) {
                    isGroupFrozenHdr = false;
                }
                if (modelData[parseInt(i.toString(), 10)].isExpand) {
                    gObj.notify(events.expandChildGrid, (<HTMLTableRowElement>tr).cells[gObj.groupSettings.columns.length]);
                }
            } else {
                const rowTemplateID: string = gObj.element.id + 'rowTemplate';
                let elements: NodeList;
                if (gObj.isReact) {
                    const isHeader: boolean = gObj.frozenRows && i < gObj.frozenRows;
                    const copied: Object = extend({ index: i }, dataSource[parseInt(i.toString(), 10)]);
                    gObj.getRowTemplate()(copied, gObj, 'rowTemplate', rowTemplateID, null, null, isHeader ? hdrfrag : frag);
                    if (gObj.requireTemplateRef) {
                        // eslint-disable-next-line @typescript-eslint/no-this-alias
                        const thisRef: ContentRender = this;
                        thisRef.parent.renderTemplates(function (): void {
                            if (gObj.frozenRows && i < gObj.frozenRows) {
                                tr = refHdrfrag.childNodes[parseInt(i.toString(), 10)] as Element;
                            } else {
                                trElement = refFrag.childNodes[parseInt(i.toString(), 10)] as Element;
                            }
                            const arg: RowDataBoundEventArgs = { data: modelData[parseInt(i.toString(), 10)].data,
                                row: trElement ? trElement : tr };
                            thisRef.parent.trigger(events.rowDataBound, arg);
                            if (modelData[parseInt(i.toString(), 10)].isDataRow || (thisRef.parent.enableVirtualization &&
                                thisRef.parent.groupSettings.enableLazyLoading)) {
                                thisRef.rowElements.push(arg.row);
                            }
                            thisRef.ariaService.setOptions(thisRef.parent.element, {
                                colcount: gObj.getColumns().length.toString() });
                            if (i === modelData.length - 1) {
                                refFrag = null;
                                refHdrfrag = null;
                            }
                        });
                        continue;
                    }
                } else {
                    elements = gObj.getRowTemplate()(extend({ index: i }, dataSource[parseInt(i.toString(), 10)]), gObj, 'rowTemplate', rowTemplateID,
                                                     undefined, undefined, undefined, this.parent['root']);
                }
                if (!gObj.isReact && (elements[0] as Element).tagName ===  'TBODY') {
                    for (let j: number = 0; j < elements.length; j++) {
                        const isTR: boolean = elements[parseInt(j.toString(), 10)].nodeName.toLowerCase() === 'tr';
                        if (isTR || ((elements[parseInt(j.toString(), 10)] as Element).querySelectorAll && (elements[parseInt(j.toString(), 10)] as Element).querySelectorAll('tr').length)) {
                            tr = isTR ? elements[parseInt(j.toString(), 10)] as Element : (elements[parseInt(j.toString(), 10)] as Element).querySelector('tr');
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
                const arg: RowDataBoundEventArgs = { data: modelData[parseInt(i.toString(), 10)].data, row: trElement ? trElement : tr };
                this.parent.trigger(events.rowDataBound, arg);
            }
            if (modelData[parseInt(i.toString(), 10)].isDataRow || (this.parent.enableVirtualization &&
                this.parent.groupSettings.enableLazyLoading)) {
                if (!isNullOrUndefined(gObj.rowTemplate) && (gObj.isAngular || gObj.isVue3 || gObj.isVue)) {
                    this.rowElements.push(trElement ? trElement : tr);
                } else {
                    this.rowElements.push(tr);
                }
            }
            this.ariaService.setOptions(this.parent.element, { colcount: gObj.getColumns().length.toString() });
        }
        const isReactChild: boolean = gObj.parentDetails && gObj.parentDetails.parentInstObj && gObj.parentDetails.parentInstObj.isReact;
        if ((gObj.isReact || isReactChild) && !gObj.requireTemplateRef) {
            gObj.renderTemplates();
        }
        if (this.parent.enableInfiniteScrolling && this.parent.groupSettings.enableLazyLoading) {
            (this.parent.contentModule as GroupLazyLoadRenderer).refRowsObj[this.parent.pageSettings.currentPage] =
                (this.parent.contentModule as GroupLazyLoadRenderer)['groupCache'][this.parent.pageSettings.currentPage];
        }
        if (this.parent.groupSettings.enableLazyLoading && !this.useGroupCache && this.parent.groupSettings.columns.length) {
            this.parent.notify(events.refreshExpandandCollapse, {
                rows: (this.parent.enableVirtualization ? this.parent.lazyLoadRender as GroupLazyLoadRenderer :
                    this.parent.contentModule as GroupLazyLoadRenderer).refRowsObj[this.parent.pageSettings.currentPage]
            });
        }
        gObj.removeMaskRow();
        this.parent.notify('removeGanttShimmer', { requestType: 'hideShimmer'});
        if ((gObj.frozenRows && args.requestType !== 'virtualscroll' && !isInfiniteScroll && this.ensureVirtualFrozenHeaderRender(args))
            || (args.requestType === 'virtualscroll' && args.virtualInfo.sentinelInfo && args.virtualInfo.sentinelInfo.axis === 'X')) {
            hdrTbody = gObj.getHeaderTable().querySelector( literals.tbody);
            if (isReact) {
                const parentTable: HTMLElement = hdrTbody.parentElement;
                remove(hdrTbody);
                parentTable.appendChild(hdrfrag);
            } else {
                hdrTbody.innerHTML = '';
                hdrTbody.appendChild(hdrfrag);
            }
            if (!gObj.isInitialLoad) {
                gObj.scrollModule.setHeight();
            }
        }
        // if (!gObj.enableVirtualization && hdrTbody && gObj.frozenRows && idx === 0 && cont.offsetHeight === Number(gObj.height)) {
        //     cont.style.height = (cont.offsetHeight - hdrTbody.offsetHeight) + 'px';
        // }
        args.rows = this.rows.slice(0);
        getUpdateUsingRaf<HTMLElement>(
            () => {
                this.parent.notify(events.beforeFragAppend, args);
                if (!this.parent.enableVirtualization && (!this.parent.enableColumnVirtualization || isColumnVirtualInfiniteProcess)
                    && !isInfiniteScroll) {
                    if (!gObj.isReact) {
                        this.tbody.innerHTML = '';
                    }
                    if (!isNullOrUndefined(this.tbody.parentElement)) {
                        remove(this.tbody);
                    }
                    else {
                        remove(gObj.getContentTable().querySelector(literals.tbody));
                    }
                    this.tbody = this.parent.createElement(literals.tbody, { attrs: { role: 'rowgroup' } });
                }
                if (gObj.rowTemplate) {
                    updateBlazorTemplate(gObj.element.id + 'rowTemplate', 'RowTemplate', gObj);
                }
                if (!isNullOrUndefined(this.parent.infiniteScrollModule) && ((this.parent.enableInfiniteScrolling
                    && !this.isInfiniteColumnvirtualization()) || isColumnVirtualInfiniteProcess)) {
                    this.isAddRows = false;
                    this.parent.notify(events.removeInfiniteRows, { args: args });
                    this.parent.notify(events.appendInfiniteContent, {
                        tbody: tbdy ? tbdy : this.tbody, frag: frag, args: args, rows: this.rows,
                        rowElements: this.rowElements, visibleRows: this.visibleRows,
                        tableName: tableName
                    });
                    if (this.isInfiniteColumnvirtualization() && this.parent.isFrozenGrid()) {
                        const virtualTable: Element = this.parent.getContent().querySelector('.e-virtualtable');
                        const transform: { width: number, height: number } = getTransformValues(virtualTable);
                        (this.parent.contentModule as VirtualContentRenderer).resetStickyLeftPos(transform.width);
                        this.widthService.refreshFrozenScrollbar();
                    }
                } else {
                    this.useGroupCache = false;
                    this.appendContent(this.tbody, frag as DocumentFragment, args);
                }
                
                if (this.parent.editSettings.showAddNewRow && (this.parent.enableVirtualization || this.parent.enableInfiniteScrolling)) {
                    const newRow: Element = this.parent.element.querySelector('.e-addrow-removed');
                    if (newRow) {
                        remove(newRow);
                    }
                }
                const startAdd: boolean = !this.parent.element.querySelector('.' + literals.addedRow);
                if (this.parent.editSettings.showAddNewRow && this.parent.editSettings.mode === 'Normal') {
                    if (startAdd) {
                        if (this.parent.enableVirtualization || this.parent.enableInfiniteScrolling) {
                            this.parent.isAddNewRow = true;
                        }
                        this.parent.isEdit = false;
                        this.parent.addRecord();
                    }
                    if (startAdd || ((this.parent.enableVirtualization || this.parent.enableInfiniteScrolling) &&
                        ['sorting', 'filtering', 'searching', 'grouping', 'ungrouping', 'reorder']
                            .some(function (value) { return args.requestType === value; }))) {
                        this.parent.notify(events.showAddNewRowFocus, {});
                    }
                }
                if (this.parent.getVisibleFrozenRightCount() && this.parent.getContent() && getScrollWidth(this.parent) > 0) {
                    this.parent.element.classList.add('e-right-shadow');
                }
                frag = null;
            },
            this.rafCallback(extend({}, args)));
    }

    protected isInfiniteColumnvirtualization(): boolean {
        return this.parent.enableColumnVirtualization && this.parent.enableInfiniteScrolling;
    }

    protected enableCacheOnInfiniteColumnVirtual(): boolean {
        return this.isInfiniteColumnvirtualization() && this.parent.infiniteScrollSettings.enableCache;
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
        if (this.parent.rowRenderingMode === 'Vertical' && this.parent.allowTextWrap && (this.parent.textWrapSettings.wrapMode === 'Header'
            || this.parent.textWrapSettings.wrapMode === 'Both')) {
            const cells: NodeListOf<HTMLTableCellElement> = tbody.querySelectorAll('td');
            for (let i: number = 0; i < cells.length; i++) {
                const headerCellHeight: number = parseFloat(document.defaultView.getComputedStyle(cells[parseInt(i.toString(), 10)], '::before').getPropertyValue('height'));
                const cellHeight: number = cells[parseInt(i.toString(), 10)].offsetHeight;
                if (headerCellHeight > cellHeight) {
                    cells[parseInt(i.toString(), 10)].style.height = headerCellHeight + 'px';
                    cells[parseInt(i.toString(), 10)].style.boxSizing = 'content-box';
                }
            }
        }
        if (this.parent.getVisibleFrozenLeftCount() && this.parent.enableColumnVirtualization) {
            this.widthService.refreshFrozenScrollbar();
        }
    }

    private setRowsInLazyGroup(row: Row<Column>, index: number): void {
        if (this.parent.groupSettings.enableLazyLoading && !this.useGroupCache && this.parent.groupSettings.columns.length) {
            (this.parent.enableVirtualization ? this.parent.lazyLoadRender as GroupLazyLoadRenderer :
                this.parent.contentModule as GroupLazyLoadRenderer).maintainRows(row, index);
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
            this.isAddRows = !isNullOrUndefined(this.infiniteCache[this.parent.pageSettings.currentPage]);
            if (this.isAddRows) {
                const data: Row<Column>[] = this.infiniteCache[this.parent.pageSettings.currentPage] as Row<Column>[];
                modelData = this.parent.pageSettings.currentPage === 1 ? data.slice(this.parent.frozenRows) : data;
            }
            return modelData;
        }
        if (this.parent.groupSettings.enableLazyLoading && this.parent.groupSettings.columns.length && (args.requestType === 'paging'
            || args.requestType === 'columnstate' || args.requestType === 'reorder' || args.requestType === 'virtualscroll')
            && (this.parent.enableVirtualization ? this.parent.lazyLoadRender as GroupLazyLoadRenderer :
                this.parent.contentModule as GroupLazyLoadRenderer).getGroupCache()[this.parent.pageSettings.currentPage]) {
            if (!this.parent.enableVirtualization) {
                this.useGroupCache = true;
            }
            return this.parent.enableVirtualization ? this.parent.getRowsObject() :
                (this.parent.contentModule as GroupLazyLoadRenderer).initialGroupRows(args.requestType === 'reorder');
        }
        return null;
    }

    private setInfiniteVisibleRows(args: InfiniteScrollArgs, data: Row<Column>): void {
        if (this.parent.enableInfiniteScrolling && !this.parent.infiniteScrollSettings.enableCache
            && !(this.isInfiniteColumnvirtualization() && args.requestType === 'virtualscroll')) {
            this.visibleRows.push(data);
        }
    }

    private getCurrentBlockInfiniteRecords(): Row<Column>[] {
        let data: Row<Column>[] = [];
        if (this.parent.infiniteScrollSettings.enableCache) {
            if (!Object.keys(this.infiniteCache).length) {
                return [];
            }
            const rows: Element[] = this.parent.getRows();
            let index: number = parseInt(rows[this.parent.frozenRows].getAttribute(literals.dataRowIndex), 10);
            const first: number = Math.ceil((index + 1) / this.parent.pageSettings.pageSize);
            index = parseInt(rows[rows.length - 1].getAttribute(literals.dataRowIndex), 10);
            const last: number = Math.ceil((index + (rows.length ? 1 : 0)) / this.parent.pageSettings.pageSize);
            for (let i: number = first; i <= last; i++) {
                data = !data.length ? this.infiniteCache[parseInt(i.toString(), 10)] as Row<Column>[]
                    : data.concat(this.infiniteCache[parseInt(i.toString(), 10)] as Row<Column>[]);
            }
            if (this.parent.frozenRows && this.parent.pageSettings.currentPage > 1) {
                data = (this.infiniteCache[1].slice(0, this.parent.frozenRows) as Row<Column>[]).concat(data);
            }
        }
        return data;
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
            const fhdrData: Row<Column>[] = this.getReorderedRows(args);
            for (let i: number = 0; i < fhdrData.length; i++) {
                tr = row.render(fhdrData[parseInt(i.toString(), 10)], columns);
                hdrfrag.appendChild(tr);
            }
            if (args.virtualInfo.page === 1) {
                modelData.splice(0, this.parent.frozenRows);
            }
        }
    }

    protected getInfiniteRows(): Row<Column>[] {
        let rows: Row<Column>[] = [];
        if (this.parent.enableInfiniteScrolling) {
            if (this.parent.infiniteScrollSettings.enableCache) {
                const keys: string[] = Object.keys(this.infiniteCache);
                for (let i: number = 0; i < keys.length; i++) {
                    rows = [...rows, ...this.infiniteCache[keys[parseInt(i.toString(), 10)]]];
                }
            } else {
                rows = this.visibleRows;
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
        return infiniteRows.length ? infiniteRows : this.rows;
    }

    /**
     * Get the content table data row elements
     *
     * @returns {Element} returns the element
     */
    public getRowElements(): Element[] {
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
        const rows: Row<Column>[] = <Row<Column>[]>this.getRows();
        let testRow: Row<Column>;
        rows.some((r: Row<Column>) => { if (r.isDataRow) { testRow = r; } return r.isDataRow; });
        let needFullRefresh: boolean = true;
        if (!gObj.groupSettings.columns.length && testRow) {
            needFullRefresh = false;
        }
        const tr: Object = gObj.getDataRows();
        const args: NotifyArgs = {};
        const infiniteData: Row<Column>[] = this.infiniteRowVisibility();
        const contentrows: Row<Column>[] = infiniteData ? infiniteData
            : this.rows.filter((row: Row<Column>) => !row.isDetailRow);
        for (let c: number = 0, clen: number = columns.length; c < clen; c++) {
            const column: Column = columns[parseInt(c.toString(), 10)];
            const idx: number = this.parent.getNormalizedColumnIndex(column.uid);
            const colIdx: number = this.parent.getColumnIndexByUid(column.uid);
            const displayVal: string = column.visible === true ? '' : 'none';
            if (idx !== -1 && testRow && idx < testRow.cells.length) {
                setStyleAttribute(<HTMLElement>this.getColGroup().childNodes[parseInt(idx.toString(), 10)], { 'display': displayVal });
            }
            if (!needFullRefresh) {
                this.setDisplayNone(tr, colIdx, displayVal, contentrows);
            }
            if (!this.parent.invokedFromMedia && column.hideAtMedia) {
                this.parent.updateMediaColumns(column);
            }
            this.parent.invokedFromMedia = false;
        }
        if (needFullRefresh) {
            this.refreshContentRows({ requestType: 'refresh' });
        } else {
            this.parent.notify(events.partialRefresh, { rows: contentrows, args: args });
            if (this.parent.editSettings.showAddNewRow && (this.parent.enableVirtualization || this.parent.enableInfiniteScrolling)) {
                this.parent.notify(events.showAddNewRowFocus, {});
                
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
                infiniteData = isFreeze ? this.getCurrentBlockInfiniteRecords() : this.getCurrentBlockInfiniteRecords();
            } else {
                infiniteData = isFreeze ? this.visibleFrozenRows : this.visibleRows;
            }
        }
        return infiniteData;
    }

    private colGroupRefresh(): void {
        if (this.getColGroup()) {
            const colGroup: Element = this.getHeaderColGroup();
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
            row.cells[parseInt(index.toString(), 10)].visible === column.visible;  //(3)
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
        const row: Row<Column>[] = (<Row<Column>[]>this.getRows()).filter((row: Row<Column>) => clearAll || uid === row.uid);
        for (let j: number = 0; j < row.length; j++) {
            row[parseInt(j.toString(), 10)].isSelected = set;
            const cells: Cell<Column>[] = row[parseInt(j.toString(), 10)].cells;
            for (let k: number = 0; k < cells.length; k++) {
                cells[parseInt(k.toString(), 10)].isSelected = set;
            }
        }
    }

    public getRowByIndex(index: number): Element {
        index = this.getInfiniteRowIndex(index);
        return !isNullOrUndefined(index) ? this.parent.getDataRows()[parseInt(index.toString(), 10)] : undefined;
    }

    private getInfiniteRowIndex(index: number): number {
        if (this.parent.infiniteScrollSettings.enableCache && !isNullOrUndefined(index)) {
            const fRows: number = this.parent.frozenRows;
            const idx: number = fRows > index ? 0 : fRows;
            const firstRowIndex: number = parseInt(this.parent.getRows()[parseInt(idx.toString(), 10)]
                .getAttribute(literals.dataRowIndex), 10);
            index = fRows > index ? index : (index - firstRowIndex) + fRows;
        }
        return index;
    }


    public getVirtualRowIndex(index: number): number {
        return index;
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
                            && trs[parseInt(i.toString(), 10)].classList.contains('e-insertedrow')) {
                            trs.splice(i, 1);
                            --i;
                            continue;
                        }
                        newKeys[dataSource[parseInt(i.toString(), 10)][`${key}`]] = oldKeys[this.prevCurrentView[parseInt(i.toString(), 10)][`${key}`]] = i;
                        newIndexes[parseInt(i.toString(), 10)] = dataSource[parseInt(i.toString(), 10)][`${key}`];
                        oldRowElements[oldRowObjs[parseInt(i.toString(), 10)].uid] = trs[parseInt(i.toString(), 10)];
                        oldIndexes[parseInt(i.toString(), 10)] = this.prevCurrentView[parseInt(i.toString(), 10)][`${key}`];
                    }
                } else {
                    for (let i: number = 0; i < currentLen; i++) {
                        newKeys[dataSource[parseInt(i.toString(), 10)][`${key}`]] = i;
                        newIndexes[parseInt(i.toString(), 10)] = dataSource[parseInt(i.toString(), 10)][`${key}`];
                    }
                    for (let i: number = 0; i < prevLen; i++) {
                        if (this.parent.editSettings.mode === 'Batch'
                            && trs[parseInt(i.toString(), 10)].classList.contains('e-insertedrow')) {
                            trs.splice(i, 1);
                            --i;
                            continue;
                        }
                        oldRowElements[oldRowObjs[parseInt(i.toString(), 10)].uid] = trs[parseInt(i.toString(), 10)];
                        oldKeys[this.prevCurrentView[parseInt(i.toString(), 10)][`${key}`]] = i;
                        oldIndexes[parseInt(i.toString(), 10)] = this.prevCurrentView[parseInt(i.toString(), 10)][`${key}`];
                    }
                }
            }
            for (let i: number = 0; i < dataSource.length; i++) {
                const oldIndex: number = oldKeys[dataSource[parseInt(i.toString(), 10)][`${key}`]];
                if (!isNullOrUndefined(oldIndex)) {
                    let isEqual: boolean = false;
                    if (this.parent.enableDeepCompare) {
                        isEqual = this.objectEqualityChecker(
                            this.prevCurrentView[parseInt(oldIndex.toString(), 10)], dataSource[parseInt(i.toString(), 10)]);
                    }
                    const tr: HTMLTableRowElement = oldRowElements[oldRowObjs[parseInt(oldIndex.toString(), 10)]
                        .uid] as HTMLTableRowElement;
                    newRowObjs.push(oldRowObjs[parseInt(oldIndex.toString(), 10)]);
                    if (this.rowElements[parseInt(oldIndex.toString(), 10)] && this.rowElements[parseInt(oldIndex.toString(), 10)].getAttribute('data-uid') === newRowObjs[parseInt(i.toString(), 10)].uid
                        && ((hasBatch && isNullOrUndefined(batchChangeKeys[newIndexes[parseInt(i.toString(), 10)]]))
                        || (!hasBatch && (isEqual
                        || this.prevCurrentView[parseInt(oldIndex.toString(), 10)] === dataSource[parseInt(i.toString(), 10)])))) {
                        if (oldIndex !== i) {
                            this.refreshImmutableContent(i, tr, newRowObjs[parseInt(i.toString(), 10)]);
                        }
                        tbody.appendChild(tr);
                        continue;
                    }
                    if ((hasBatch && !isNullOrUndefined(batchChangeKeys[newIndexes[parseInt(i.toString(), 10)]]))
                        || (!this.parent.enableDeepCompare
                        && dataSource[parseInt(i.toString(), 10)] !== this.prevCurrentView[parseInt(oldIndex.toString(), 10)])
                        || (this.parent.enableDeepCompare && !isEqual)) {
                        oldRowObjs[parseInt(oldIndex.toString(), 10)].setRowValue(dataSource[parseInt(i.toString(), 10)]);
                    }
                    tbody.appendChild(tr);
                    this.refreshImmutableContent(i, tr, newRowObjs[parseInt(i.toString(), 10)]);
                } else {
                    const row: RowRenderer<Column> = new RowRenderer<Column>(this.serviceLocator, null, gObj);
                    const args: Object = { startIndex: i };
                    const modelData: Row<Column>[] = this.generator.generateRows([dataSource[parseInt(i.toString(), 10)]], args);
                    newRowObjs.push(modelData[0]);
                    const tr: HTMLTableRowElement = row.render(modelData[0], gObj.getColumns()) as HTMLTableRowElement;
                    tbody.appendChild(tr);
                    this.refreshImmutableContent(i, tr, newRowObjs[parseInt(i.toString(), 10)]);
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
            if (old[keys[parseInt(i.toString(), 10)]] !== next[keys[parseInt(i.toString(), 10)]]) {
                const isDate: boolean = old[keys[parseInt(i.toString(), 10)]] instanceof Date
                    && next[keys[parseInt(i.toString(), 10)]] instanceof Date;
                if (!isDate || ((old[keys[parseInt(i.toString(), 10)]] as Date)
                    .getTime() !== (next[keys[parseInt(i.toString(), 10)]] as Date).getTime())) {
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
            keys[changedRecords[parseInt(i.toString(), 10)][`${primaryKey}`]] = i;
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
            rowEle.cells[parseInt(i.toString(), 10)].setAttribute('index', index.toString());
        }
    }
}
