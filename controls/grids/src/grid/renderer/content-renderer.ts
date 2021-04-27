import { Droppable, DropEventArgs, isBlazor, addClass } from '@syncfusion/ej2-base';
import { isNullOrUndefined, extend } from '@syncfusion/ej2-base';
import { setStyleAttribute, remove, updateBlazorTemplate, removeClass } from '@syncfusion/ej2-base';
import { getUpdateUsingRaf, appendChildren, setDisplayValue } from '../base/util';
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
import { getScrollBarWidth, isGroupAdaptive } from '../base/util';
import { Grid } from '../base/grid';
import { VirtualFreezeRenderer } from './virtual-freeze-renderer';
import { VirtualContentRenderer } from '../renderer/virtual-content-renderer';
import { GroupLazyLoadRenderer } from './group-lazy-load-renderer';
import { FreezeContentRender } from './freeze-renderer';
import { freezeTable } from '../base/enum';


/**
 * Content module is used to render grid content
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
    private visibleRows: Row<Column>[] = [];
    private visibleFrozenRows: Row<Column>[] = [];
    protected rightFreezeRows: Row<Column>[] = [];
    private isAddRows: boolean = false;
    private currentMovableRows: Object[];
    private initialPageRecords: Object;
    private isInfiniteFreeze: boolean = false;
    private useGroupCache: boolean = false;
    private mutableData: boolean = false;

    private rafCallback: Function = (args: NotifyArgs) => {
        let arg: NotifyArgs = args;
        return () => {
            if (this.parent.isFrozenGrid() && this.parent.enableVirtualization) {
                let mContentRows: Element[] = [].slice.call(this.parent.getMovableVirtualContent().querySelectorAll('.e-row'));
                let fContentRows: Element[] = [].slice.call(this.parent.getFrozenVirtualContent().querySelectorAll('.e-row'));
                this.isLoaded = !mContentRows ? false : mContentRows.length === fContentRows.length;
                if (this.parent.enableColumnVirtualization && args.requestType === 'virtualscroll' && this.isLoaded) {
                    let mHdr: Element[] = [].slice.call(this.parent.getMovableVirtualHeader().querySelectorAll('.e-row'));
                    let fHdr: Element[] = [].slice.call(this.parent.getFrozenVirtualHeader().querySelectorAll('.e-row'));
                    this.isLoaded = mHdr.length === fHdr.length;
                }
            }
            this.ariaService.setBusy(<HTMLElement>this.getPanel().querySelector('.e-content'), false);
            if (this.parent.isDestroyed) { return; }
            let rows: Row<Column>[] = this.rows.slice(0);
            if (this.parent.isFrozenGrid()) {
                rows = args.isFrozen ? this.freezeRows : args.renderFrozenRightContent ? this.parent.getFrozenRightRowsObject()
                    : this.movableRows;
            }
            this.parent.notify(events.contentReady, { rows: rows, args: arg });
            if (this.isLoaded) {
                this.parent.trigger(events.dataBound, {}, () => {
                    if (this.parent.allowTextWrap) {
                        this.parent.notify(events.freezeRender, { case: 'textwrap' });
                    }
                });
            }
            if (arg) {
                let action: string = (arg.requestType || '').toLowerCase() + '-complete';
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
     */
    constructor(parent?: IGrid, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        this.ariaService = this.serviceLocator.getService<AriaService>('ariaService');
        this.mutableData = this.parent.getDataModule().isRemote();
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
     */
    public renderPanel(): void {
        let gObj: IGrid = this.parent;
        let div: Element =  this.parent.element.querySelector('.e-gridcontent');
        if (div) {
            this.ariaService.setOptions(<HTMLElement>this.parent.element.querySelector('.e-content'), { busy: false });
            this.setPanel(div);
            return;
        }
        div = this.parent.createElement('div', { className: 'e-gridcontent' });
        let innerDiv: Element = this.parent.createElement('div', {
            className: 'e-content'
        });
        this.ariaService.setOptions(<HTMLElement>innerDiv, { busy: false });
        div.appendChild(innerDiv);
        this.setPanel(div);
        gObj.element.appendChild(div);
    }

    /**
     * The function is used to render grid content table    
     */
    public renderTable(): void {
        let contentDiv: Element = this.getPanel();
        let virtualTable: Element = contentDiv.querySelector('.e-virtualtable');
        let virtualTrack: Element = contentDiv.querySelector('.e-virtualtrack');
        if (this.parent.enableVirtualization && !isNullOrUndefined(virtualTable) && !isNullOrUndefined(virtualTrack)
            && (!isBlazor() || (isBlazor() && !this.parent.isServerRendered))) {
            remove(virtualTable);
            remove(virtualTrack);
        }
        contentDiv.appendChild(this.createContentTable('_content_table'));
        this.setTable(contentDiv.querySelector('.e-table'));
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
     * @return {Element} 
     * @hidden
     */
    public createContentTable(id: String): Element {
        let innerDiv: Element = <Element>this.getPanel().firstElementChild;
        if (!isBlazor()) {
            if (this.getTable()) {
                remove(this.getTable());
            }
        }
        let table: Element = innerDiv.querySelector('.e-table') ? innerDiv.querySelector('.e-table') :
                             this.parent.createElement('table', {className: 'e-table', attrs: {
                cellspacing: '0.25px', role: 'grid',
                id: this.parent.element.id + id
            }
        });
        this.setColGroup(<Element>this.parent.getHeaderTable().querySelector('colgroup').cloneNode(true));
        table.appendChild(this.getColGroup());
        table.appendChild(this.parent.createElement('tbody'));
        innerDiv.appendChild(table);
        return innerDiv;
    }

    /** 
     * Refresh the content of the Grid. 
     * @return {void}  
     */
    // tslint:disable-next-line:max-func-body-length
    public refreshContentRows(args: NotifyArgs = {}): void {
        let gObj: IGrid = this.parent;
        if (gObj.currentViewData.length === 0) { return; }
        let dataSource: Object = this.currentMovableRows || gObj.currentViewData;
        let contentModule: FreezeContentRender = (this.parent.contentModule as FreezeContentRender);
        let isReact: boolean = gObj.isReact && !isNullOrUndefined(gObj.rowTemplate);
        let frag: DocumentFragment | HTMLElement = isReact ? gObj.createElement('tbody') : document.createDocumentFragment();
        if (!this.initialPageRecords) {
            this.initialPageRecords = extend([], dataSource);
        }
        let hdrfrag: DocumentFragment = isReact ? gObj.createElement('tbody') : document.createDocumentFragment();
        let columns: Column[] = <Column[]>gObj.getColumns();
        let tr: Element; let hdrTbody: HTMLElement; let frzCols: number = gObj.getFrozenColumns();
        let isFrozenGrid: boolean = this.parent.isFrozenGrid();
        let trElement: Element;
        let row: RowRenderer<Column> = new RowRenderer<Column>(this.serviceLocator, null, this.parent);
        let isInfiniteScroll: boolean = this.parent.enableInfiniteScrolling
            && (args as InfiniteScrollArgs).requestType === 'infiniteScroll';
        this.rowElements = [];
        this.rows = [];
        let fCont: Element = this.getPanel().querySelector('.e-frozencontent');
        let mCont: HTMLElement = this.getPanel().querySelector('.e-movablecontent') as HTMLElement;
        let cont: HTMLElement = this.getPanel().querySelector('.e-content') as HTMLElement;
        let tbdy: Element;
        let tableName: freezeTable;
        if (isGroupAdaptive(gObj)) {
            if (['sorting', 'filtering', 'searching', 'grouping', 'ungrouping', 'reorder']
                .some((value: string) => { return args.requestType === value; })) {
                this.emptyVcRows();
            }
        }
        let modelData: Row<Column>[];
        let isServerRendered: string = 'isServerRendered';
        if (isBlazor() && this.parent[isServerRendered]) {
            modelData = this.generator.generateRows(dataSource, args);
            if (this.parent.enableVirtualization) {
                this.prevInfo = this.prevInfo ? this.prevInfo : args.virtualInfo;
                this.prevInfo = args.virtualInfo.sentinelInfo && args.virtualInfo.sentinelInfo.axis === 'Y' && this.currentInfo.page &&
                                this.currentInfo.page !== args.virtualInfo.page ? this.currentInfo : args.virtualInfo;
            }
            this.rows = modelData;
            this.freezeRows = modelData;
            this.rowElements = <Element[]>[].slice.call(this.getTable().querySelectorAll('tr.e-row[data-uid]'));
            if (frzCols) {
                this.movableRows = <Row<Column>[]>modelData.map((mRow: Row<Column>) => {
                    let sRow: Row<Column> = new Row<Column>(<{}>mRow);
                    sRow.cells = mRow.cells.slice(frzCols, mRow.cells.length);
                    mRow.cells = mRow.cells.slice(0, frzCols);
                    return sRow;
                });
                this.freezeRowElements = this.rowElements;
            }
            this.isLoaded = true;
            this.parent.hideSpinner();
            args.isFrozen = this.parent.getFrozenColumns() !== 0 && !args.isFrozen;
            let arg: object = extend({ rows: this.rows }, args);
            if (this.getTable().querySelector('.e-emptyrow')) {
                remove(this.getTable().querySelector('.e-emptyrow'));
                if (!isNullOrUndefined(this.getTable().querySelectorAll('.e-table > tbody')[1])) {
                    remove(this.getTable().querySelectorAll('.e-table > tbody')[1]);
                }
            }
            this.parent.notify('contentcolgroup', {});
            this.rafCallback(arg)();
            if (frzCols) {
                cont.style.overflowY = 'hidden';
                (fCont as HTMLElement).style.height = ((mCont.offsetHeight) - getScrollBarWidth()) + 'px';
                mCont.style.overflowY = this.parent.height !== 'auto' ? 'scroll' : 'auto';
                (fCont as HTMLElement).style.borderRightWidth = '1px';
                this.parent.notify(events.contentReady, { rows: this.movableRows, args: extend({}, arg, { isFrozen: false }) });
            }
            if (!(this.parent.isCheckBoxSelection || this.parent.selectionSettings.type === 'Multiple')
            || (!this.parent.isPersistSelection && !this.parent.enableVirtualization)) {
                let rowIndex: string = 'editRowIndex';
                if (this.parent.editSettings.mode === 'Normal' && !isNullOrUndefined(args[rowIndex])) {
                    this.parent.selectRow(args[rowIndex]);
                }
            }
            if (this.parent.enableVirtualization && !this.parent.getHeaderContent().querySelectorAll('.e-check').length) {
                let removeClassByUid: string[] = this.parent.getRows().filter((x: Element) => x.getAttribute('aria-selected'))
                                                            .map((y: Element) => y.getAttribute('data-uid'));
                let addClassByUid: string[] = this.parent.getRows().filter((x: Element) => x.getAttribute('aria-selected') === null)
                                                            .map((y: Element) => y.getAttribute('data-uid'));
                for (let i: number = 0; i < removeClassByUid.length; i++) {
                    if (!isNullOrUndefined(this.parent.getRowObjectFromUID(removeClassByUid[i])) &&
                        !this.parent.getRowObjectFromUID(removeClassByUid[i]).isSelected) {
                        this.parent.getRowElementByUID(removeClassByUid[i]).removeAttribute('aria-selected');
                        if (!isNullOrUndefined(this.parent.getRowElementByUID(removeClassByUid[i]).querySelector('.e-check'))) {
                            removeClass([this.parent.getRowElementByUID(removeClassByUid[i]).querySelector('.e-check')], ['e-check']);
                        }
                        for (let j: number = 0; j < this.parent.getRowElementByUID(removeClassByUid[i]).children.length; j++) {
                            this.parent.getRowElementByUID(removeClassByUid[i])
                                                           .children[j].classList.remove('e-selectionbackground', 'e-active');
                        }
                    }
                }
                for (let i: number = 0; i < addClassByUid.length; i++) {
                    if (!isNullOrUndefined(this.parent.getRowObjectFromUID(addClassByUid[i]))
                        && this.parent.getRowObjectFromUID(addClassByUid[i]).isSelected) {
                        this.parent.getRowElementByUID(addClassByUid[i]).setAttribute('aria-selected', 'true');
                        if (!isNullOrUndefined(this.parent.getRowElementByUID(addClassByUid[i]).querySelector('.e-frame'))) {
                            addClass([this.parent.getRowElementByUID(addClassByUid[i]).querySelector('.e-frame')], ['e-check']);
                        }
                        for (let j: number = 0; j < this.parent.getRowElementByUID(addClassByUid[i]).children.length; j++) {
                            this.parent.getRowElementByUID(addClassByUid[i])
                                                           .children[j].classList.add('e-selectionbackground', 'e-active');
                        }
                    }
                }
            }
            return;
        }
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
        let idx: number = modelData[0].cells[0].index;
        if (isFrozenGrid) {
            tableName = contentModule.setTbody(modelData, args);
            tbdy = contentModule.getTbody(tableName);
        }
        let isFrozenLeft: boolean = this.parent.getFrozenMode() === 'Left-Right' && tableName === 'frozen-right';
        /* tslint:disable:no-any */
        if (args.requestType !== 'infiniteScroll' && (this.parent as any).registeredTemplate
            && (this.parent as any).registeredTemplate.template && !args.isFrozen && !isFrozenLeft) {
            let templatetoclear: any = [];
            for (let i: number = 0; i < (this.parent as any).registeredTemplate.template.length; i++) {
                for (let j: number = 0; j < (this.parent as any).registeredTemplate.template[i].rootNodes.length; j++) {
                    if (isNullOrUndefined((this.parent as any).registeredTemplate.template[i].rootNodes[j].parentNode)) {
                        templatetoclear.push((this.parent as any).registeredTemplate.template[i]);
                        /* tslint:enable:no-any */
                    }
                }
            }
            this.parent.destroyTemplate(['template'], templatetoclear);
        }
        if (this.parent.isReact && args.requestType !== 'infiniteScroll' && !args.isFrozen) {
            this.parent.destroyTemplate(['columnTemplate', 'rowTemplate', 'detailTemplate', 'captionTemplate', 'commandsTemplate']);
            this.parent.renderTemplates();
        }
        if (this.parent.enableColumnVirtualization) {
            let cellMerge: CellMergeRender<Column> = new CellMergeRender(this.serviceLocator, this.parent);
            cellMerge.updateVirtualCells(modelData);
        }
        if (!isFrozenGrid) {
            this.tbody = this.getTable().querySelector('tbody');
        }
        let startIndex: number = 0;
        let blockLoad: boolean = true;
        if (isGroupAdaptive(gObj) && gObj.vcRows.length) {
            let top: string = 'top';
            let scrollTop: number = !isNullOrUndefined(args.virtualInfo.offsets) ? args.virtualInfo.offsets.top :
                (!isNullOrUndefined(args.scrollTop) ? args.scrollTop[top] : 0);
            if (scrollTop !== 0) {
                let offsets: { [x: number]: number } = gObj.vGroupOffsets;
                let bSize: number = gObj.pageSettings.pageSize / 2;
                let values: number[] = Object.keys(offsets).map((key: string) => offsets[key]);
                for (let m: number = 0; m < values.length; m++) {
                    if (scrollTop < values[m]) {
                        if (!isNullOrUndefined(args.virtualInfo) && args.virtualInfo.direction === 'up') {
                            args.virtualInfo.blockIndexes = m === 0 || m === 1 ? [1, 2] : [m, m + 1];
                            startIndex = m === 0 || m === 1 ? 0 : (m * bSize);
                            break;
                        } else {
                            args.virtualInfo.blockIndexes = m === 0 || m === 1 ? [1, 2] : [m, m + 1];
                            startIndex = m === 0 || m === 1 ? 0 : (m) * bSize;
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
        let isVFFrozenOnly: boolean = gObj.frozenRows && !gObj.isFrozenGrid() && this.parent.enableVirtualization
            && args.requestType === 'reorder';
        if ((gObj.frozenRows && args.requestType === 'virtualscroll' && args.virtualInfo.sentinelInfo.axis === 'X') || isVFFrozenOnly) {
            let bIndex: number[] = args.virtualInfo.blockIndexes;
            let page: number = args.virtualInfo.page;
            args.virtualInfo.blockIndexes = [1, 2];
            if (isVFFrozenOnly) {
                args.virtualInfo.page = 1;
            }
            let data: Object = isVFFrozenOnly ? this.initialPageRecords : dataSource;
            let mhdrData: Row<Column>[] = (<{ generateRows?: Function }>(<{ vgenerator?: Function }>this).vgenerator)
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
        for (let i: number = startIndex, len: number = modelData.length; i < len; i++) {
            this.rows.push(modelData[i]);
            if (this.parent.groupSettings.enableLazyLoading && !this.useGroupCache && this.parent.groupSettings.columns.length) {
                this.setRowsInLazyGroup(modelData[i], i);
                if (isNullOrUndefined(modelData[i].indent)) {
                    continue;
                }
            }
            this.setInfiniteVisibleRows(args, modelData[i], tableName);
            if (isGroupAdaptive(gObj) && this.rows.length >= (gObj.pageSettings.pageSize) && blockLoad) {
                break;
            }
            if (!gObj.rowTemplate) {
                tr = row.render(modelData[i], columns);
                let isVFreorder: boolean = this.ensureFrozenHeaderRender(args);
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
                let rowTemplateID: string = gObj.element.id + 'rowTemplate';
                let elements: NodeList;
                if (gObj.isReact) {
                    let isHeader: boolean = gObj.frozenRows && i < gObj.frozenRows;
                    let copied: Object = extend({ index: i }, dataSource[i]);
                    gObj.getRowTemplate()(copied, gObj, 'rowTemplate', rowTemplateID, null, null, isHeader ? hdrfrag : frag);
                    gObj.renderTemplates();
                } else {
                    elements = gObj.getRowTemplate()(extend({ index: i }, dataSource[i]), gObj, 'rowTemplate', rowTemplateID);
                }
                if (!gObj.isReact && (elements[0] as Element).tagName === 'TBODY') {
                    for (let j: number = 0; j < elements.length; j++) {
                        let isTR: boolean = elements[j].nodeName.toLowerCase() === 'tr';
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
                let arg: RowDataBoundEventArgs = { data: modelData[i].data, row: trElement ? trElement : tr };
                this.parent.trigger(events.rowDataBound, arg);
            }
            if (modelData[i].isDataRow) {
                this.rowElements.push(tr);
            }
            this.ariaService.setOptions(this.getTable() as HTMLElement, { colcount: gObj.getColumns().length.toString() });
        }
        if (isFrozenGrid) {
            contentModule.splitRows(tableName);
        }
        if ((gObj.frozenRows && args.requestType !== 'virtualscroll' && !isInfiniteScroll && this.ensureVirtualFrozenHeaderRender(args))
            || (args.requestType === 'virtualscroll' && args.virtualInfo.sentinelInfo && args.virtualInfo.sentinelInfo.axis === 'X')) {
            hdrTbody = isFrozenGrid ? contentModule.getFrozenHeader(tableName) : gObj.getHeaderTable().querySelector('tbody');
            if (isReact) {
                let parentTable: HTMLElement = hdrTbody.parentElement;
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
        if (!isBlazor() || this.parent.isJsComponent) {
            args.rows = this.rows.slice(0);
        }
        if (isFrozenGrid) {
            contentModule.setIsFrozen(args, tableName);
        }
        this.index = idx;
        getUpdateUsingRaf<HTMLElement>(
            () => {
                this.parent.notify(events.beforeFragAppend, args);
                let isVFTable: boolean = this.parent.enableVirtualization && this.parent.isFrozenGrid();
                if (!this.parent.enableVirtualization && !isInfiniteScroll) {
                    if (this.parent.isFrozenGrid()) {
                        remove(tbdy);
                        tbdy = this.parent.createElement('tbody');
                    } else {
                        remove(this.tbody);
                        this.tbody = this.parent.createElement('tbody');
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
                            let frCont: Element = gObj.getContent().querySelector('.e-frozen-right-content').querySelector('tbody');
                            this.appendContent(frCont, frag as DocumentFragment, args);
                        } else if (!args.renderMovableContent) {
                            this.appendContent(fCont.querySelector('tbody'), frag as DocumentFragment, args);
                        } else {
                            this.appendContent(mCont.querySelector('tbody'), frag as DocumentFragment, args);
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
                                if ((gObj.getFrozenMode() !== 'Left-Right'
                                    && (tableName === 'frozen-left' || tableName === 'frozen-right'))
                                    || (gObj.getFrozenMode() === 'Left-Right'
                                        && (tableName === 'frozen-left' || tableName === 'movable'))) {
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

    public appendContent(tbody: Element, frag: DocumentFragment, args: NotifyArgs, tableName?: string): void {
        let isReact: boolean = this.parent.isReact && !isNullOrUndefined(this.parent.rowTemplate);
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
            let index: number = args.isFrozen ? 1 : 0;
            let frozenCols: boolean = this.parent.isFrozenGrid();
            this.isAddRows = !isNullOrUndefined(this.infiniteCache[this.parent.pageSettings.currentPage]);
            if (frozenCols && !isNullOrUndefined(this.infiniteCache[this.parent.pageSettings.currentPage])) {
                this.isAddRows = (this.infiniteCache[this.parent.pageSettings.currentPage][index] as Row<Column>[]).length !== 0;
            }
            if (this.isAddRows) {
                let data: Row<Column>[] = !frozenCols ? this.infiniteCache[this.parent.pageSettings.currentPage] as Row<Column>[]
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
        let frozenCols: boolean = this.parent.isFrozenGrid();
        if (this.parent.enableInfiniteScrolling && !this.parent.infiniteScrollSettings.enableCache) {
            if (frozenCols) {
                if (tableName === 'frozen-left' || (this.parent.getFrozenMode() === 'Right' && tableName === 'frozen-right')) {
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
            let frozenCols: boolean = this.parent.isFrozenGrid();
            let rows: Element[] = this.parent.getRows();
            let index: number = parseInt(rows[this.parent.frozenRows].getAttribute('aria-rowindex'), 10);
            let first: number = Math.ceil((index + 1) / this.parent.pageSettings.pageSize);
            index = parseInt(rows[rows.length - 1].getAttribute('aria-rowindex'), 10);
            let last: number = Math.ceil(index / this.parent.pageSettings.pageSize);
            if (frozenCols) {
                let idx: number = isFreeze ? 0 : 1;
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
        let frozenCols: boolean = this.parent.isFrozenGrid();
        if (this.parent.enableInfiniteScrolling) {
            if (this.parent.infiniteScrollSettings.enableCache) {
                let keys: string[] = Object.keys(this.infiniteCache);
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
        let infiniteCacheRows: Row<Column>[] = this.getCurrentBlockInfiniteRecords();
        let infiniteRows: Row<Column>[] = this.parent.enableInfiniteScrolling ? infiniteCacheRows.length ? infiniteCacheRows
            : this.visibleRows : [];
        return infiniteRows;
    }

    /**
     * Get the content div element of grid
     * @return {Element} 
     */
    public getPanel(): Element {
        return this.contentPanel;
    }

    /**
     * Set the content div element of grid
     * @param  {Element} panel   
     */
    public setPanel(panel: Element): void {
        this.contentPanel = panel;
    }

    /**
     * Get the content table element of grid
     * @return {Element} 
     */
    public getTable(): Element {
        return this.contentTable;
    }

    /**
     * Set the content table element of grid
     * @param  {Element} table   
     */
    public setTable(table: Element): void {
        this.contentTable = table;
    }

    /**
     * Get the Row collection in the Grid.
     * @returns {Row[] | HTMLCollectionOf<HTMLTableRowElement>}
     */
    public getRows(): Row<Column>[] | HTMLCollectionOf<HTMLTableRowElement> {
        let infiniteRows: Row<Column>[] = this.getInfiniteRows();
        return infiniteRows.length ? infiniteRows : this.parent.getFrozenColumns() ? this.freezeRows : this.rows;
    }

    /**
     * Get the Movable Row collection in the Freeze pane Grid.
     * @returns {Row[] | HTMLCollectionOf<HTMLTableRowElement>}
     */
    public getMovableRows(): Row<Column>[] | HTMLCollectionOf<HTMLTableRowElement> {
        let infiniteRows: Row<Column>[] = this.getInfiniteMovableRows();
        return infiniteRows.length ? infiniteRows : this.movableRows;
    }

    /**
     * Get the content table data row elements
     * @return {Element} 
     */
    public getRowElements(): Element[] {
        return this.parent.getFrozenColumns() ? this.freezeRowElements : this.rowElements;
    }

    /**
     * Get the Freeze pane movable content table data row elements
     * @return {Element} 
     */
    public getMovableRowElements(): Element[] {
        return this.rowElements;
    }

    /**
     * Get the content table data row elements
     * @return {Element} 
     */
    public setRowElements(elements: Element[]): void {
        this.rowElements = elements;
    }

    /**
     * Get the header colgroup element
     * @returns {Element}
     */
    public getColGroup(): Element {
        return this.colgroup;
    }

    /**
     * Set the header colgroup element
     * @param {Element} colgroup
     * @returns {Element}
     */
    public setColGroup(colGroup: Element): Element {
        if (!isNullOrUndefined(colGroup)) {
            colGroup.id = 'content-' + colGroup.id;
        }
        return this.colgroup = colGroup;
    }
    /**
     * Function to hide content table column based on visible property
     * @param  {Column[]} columns?
     */
    public setVisible(columns?: Column[]): void {
        let gObj: IGrid = this.parent;
        if (isBlazor() && gObj.isServerRendered) {
            this.parent.notify('setvisibility', columns);
        }
        let isFrozenGrid: boolean = this.parent.isFrozenGrid();
        let frzCols: number = gObj.getFrozenColumns();
        let rows: Row<Column>[] = [];
        if (isFrozenGrid) {
            let fRows: Row<Column>[] = this.freezeRows;
            let mRows: Row<Column>[] = this.movableRows;
            let rowLen: number = fRows.length;
            let cellLen: number;
            let rightRows: Row<Column>[] = [];
            if (gObj.getFrozenMode() === 'Left-Right') {
                rightRows = gObj.getFrozenRightRowsObject();
            }
            for (let i: number = 0, row: Row<Column>; i < rowLen; i++) {
                cellLen = mRows[i].cells.length;
                let rightLen: number = rightRows.length ? rightRows[i].cells.length : 0;
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
        let element: Row<Column>;
        let testRow: Row<Column>;
        rows.some((r: Row<Column>) => { if (r.isDataRow) { testRow = r; } return r.isDataRow; });
        let tasks: Function[] = [];

        let needFullRefresh: boolean = true;
        if (!gObj.groupSettings.columns.length && testRow) {
            needFullRefresh = false;
        }
        let tr: Object = gObj.getDataRows();
        let args: NotifyArgs = {};
        let infiniteData: Row<Column>[] = this.infiniteRowVisibility();
        let contentrows: Row<Column>[] = infiniteData ? infiniteData
            : this.rows.filter((row: Row<Column>) => !row.isDetailRow);
        for (let c: number = 0, clen: number = columns.length; c < clen; c++) {
            let column: Column = columns[c];
            let idx: number = this.parent.getNormalizedColumnIndex(column.uid);
            let colIdx: number = this.parent.getColumnIndexByUid(column.uid);
            let displayVal: string = column.visible === true ? '' : 'none';
            if (idx !== -1 && testRow && idx < testRow.cells.length) {
                if (isFrozenGrid) {
                    if (column.getFreezeTableName() !== 'movable') {
                        if (column.getFreezeTableName() === 'frozen-right') {
                            let left: number = this.parent.getFrozenLeftColumnsCount();
                            let movable: number = this.parent.getMovableColumnsCount();
                            colIdx = idx = idx - (left + movable);
                            let colG: Element = this.parent.getContent().querySelector('.e-frozen-right-content').querySelector('colgroup');
                            setStyleAttribute(<HTMLElement>colG.childNodes[idx], { 'display': displayVal });
                            contentrows = gObj.getFrozenRightRowsObject();
                            tr = gObj.getFrozenRightDataRows();
                        } else {
                            setStyleAttribute(<HTMLElement>this.getColGroup().childNodes[idx], { 'display': displayVal });
                            let infiniteFreezeData: Row<Column>[] = this.infiniteRowVisibility(true);
                            contentrows = infiniteFreezeData ? infiniteFreezeData : this.freezeRows;
                            tr = gObj.getDataRows();
                        }
                    } else {
                        let mTable: Element = gObj.getContent().querySelector('.e-movablecontent').querySelector('colgroup');
                        colIdx = idx = idx - frzCols - this.parent.getFrozenLeftColumnsCount();
                        setStyleAttribute(<HTMLElement>mTable.childNodes[idx], { 'display': displayVal });
                        tr = (<Grid>gObj).getMovableDataRows();
                        let infiniteMovableData: Row<Column>[] = this.infiniteRowVisibility();
                        contentrows = infiniteMovableData ? infiniteMovableData : this.movableRows;
                    }
                } else {
                    setStyleAttribute(<HTMLElement>this.getColGroup().childNodes[idx], { 'display': displayVal });
                }
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
            if (!this.parent.getFrozenColumns()) {
                this.parent.notify(events.partialRefresh, { rows: contentrows, args: args });
            } else {
                this.parent.notify(events.partialRefresh, { rows: this.freezeRows, args: { isFrozen: true, rows: this.freezeRows } });
                this.parent.notify(events.partialRefresh, { rows: this.movableRows, args: { isFrozen: false, rows: this.movableRows } });
            }
        }
    }

    /** 
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
                colGroup = <Element>this.parent.getMovableVirtualHeader().querySelector('colgroup').cloneNode(true);
            } else {
                colGroup = this.getHeaderColGroup();
            }
            this.getTable().replaceChild(colGroup, this.getColGroup());
            this.setColGroup(colGroup);
        }
    }

    protected getHeaderColGroup(): Element {
        return isBlazor() ? <Element>this.parent.getHeaderTable().querySelector('colgroup').cloneNode(true) :
            <Element>this.parent.element.querySelector('.e-gridheader').querySelector('colgroup').cloneNode(true);
    }

    private initializeContentDrop(): void {
        let gObj: IGrid = this.parent;
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
        if (isBlazor() && !this.parent.isJsComponent && this.parent.frozenRows) { return; }
        this.getTable().appendChild(tbody);
        if (this.parent.frozenRows) {
            this.parent.getHeaderContent().querySelector('tbody').innerHTML = '';
        }
    }

    public setSelection(uid: string, set: boolean, clearAll?: boolean): void {
        this.parent.notify(events.setFreezeSelection, { uid: uid, set: set, clearAll: clearAll });
        let isFrozen: boolean = this.parent.isFrozenGrid();
        if (isFrozen && this.parent.enableVirtualization) {
            return;
        }
        if (isFrozen) {
            let rows: Row<Column>[] = (<Row<Column>[]>this.getMovableRows()).filter((row: Row<Column>) => clearAll || uid === row.uid);
            for (let i: number = 0; i < rows.length; i++) {
                rows[i].isSelected = set;
            }
        }
        let row: Row<Column>[] = (<Row<Column>[]>this.getRows()).filter((row: Row<Column>) => clearAll || uid === row.uid);
        for (let j: number = 0; j < row.length; j++) {
            row[j].isSelected = set;
            let cells: Cell<Column>[] = row[j].cells;
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
            let fRows: number = this.parent.frozenRows;
            let idx: number = fRows > index ? 0 : fRows;
            let firstRowIndex: number = parseInt(this.parent.getRows()[idx].getAttribute('aria-rowindex'), 10);
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

    /** @hidden */
    public immutableModeRendering(args: NotifyArgs = {}): void {
        let gObj: IGrid = this.parent;
        gObj.hideSpinner();
        let key: string = gObj.getPrimaryKeyFieldNames()[0];
        let oldKeys: object = {}; let newKeys: object = {}; let newRowObjs: Row<Column>[] = [];
        let oldIndexes: Object = {};
        let oldRowObjs: Row<Column>[] = gObj.getRowsObject().slice();
        let batchChangeKeys: Object = this.getBatchEditedRecords(key, oldRowObjs); let newIndexes: Object = {};
        let hasBatch: boolean = Object.keys(batchChangeKeys).length !== 0;
        if (gObj.getContent().querySelector('.e-emptyrow') || args.requestType === 'reorder'
            || this.parent.groupSettings.columns.length) {
            this.refreshContentRows(args);
        } else {
            if (gObj.currentViewData.length === 0) { return; }
            let oldRowElements: Object = {};
            let tbody: Element = gObj.createElement('tbody');
            let dataSource: Object[] = gObj.currentViewData;
            let trs: Element[] = [].slice.call(this.getTable().querySelector('tbody').children);
            if (this.prevCurrentView.length) {
                let prevLen: number = this.prevCurrentView.length;
                let currentLen: number = dataSource.length;
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
                let oldIndex: number = oldKeys[dataSource[i][key]];
                if (!isNullOrUndefined(oldIndex)) {
                    let isEqual: boolean = false;
                    if (this.mutableData) {
                        isEqual = this.objectEqualityChecker(this.prevCurrentView[i], dataSource[i]);
                    }
                    let tr: HTMLTableRowElement = oldRowElements[oldRowObjs[oldIndex].uid] as HTMLTableRowElement;
                    newRowObjs.push(oldRowObjs[oldIndex]);
                    if (this.rowElements[i] && this.rowElements[i].getAttribute('data-uid') === newRowObjs[i].uid
                        && ((hasBatch && isNullOrUndefined(batchChangeKeys[newIndexes[i]]))
                            || (!hasBatch && (isEqual || this.prevCurrentView[i] === dataSource[i])))) {
                        if (oldIndex !== i) {
                            this.refreshImmutableContent(i, tr, newRowObjs[i]);
                        }
                        tbody.appendChild(tr);
                        continue;
                    }
                    if ((hasBatch && !isNullOrUndefined(batchChangeKeys[newIndexes[i]]))
                        || (!this.mutableData && dataSource[i] !== this.prevCurrentView[oldIndex])
                        || (this.mutableData && !isEqual)) {
                        oldRowObjs[oldIndex].setRowValue(dataSource[i]);
                    }
                    tbody.appendChild(tr);
                    this.refreshImmutableContent(i, tr, newRowObjs[i]);
                } else {
                    let row: RowRenderer<Column> = new RowRenderer<Column>(this.serviceLocator, null, gObj);
                    let modelData: Row<Column>[] = this.generator.generateRows([dataSource[i]]);
                    newRowObjs.push(modelData[0]);
                    let tr: HTMLTableRowElement = row.render(modelData[0], gObj.getColumns()) as HTMLTableRowElement;
                    tbody.appendChild(tr);
                    this.refreshImmutableContent(i, tr, newRowObjs[i]);
                }
            }
            this.rows = newRowObjs;
            this.rowElements = [].slice.call(tbody.children);
            remove(this.getTable().querySelector('tbody'));
            this.getTable().appendChild(tbody);
            this.parent.trigger(events.dataBound, {}, () => {
                if (this.parent.allowTextWrap) {
                    this.parent.notify(events.freezeRender, { case: 'textwrap' });
                }
            });
            if (args) {
                let action: string = (args.requestType || '').toLowerCase() + '-complete';
                this.parent.notify(action, args);
            }
        }
    }

    /** @hidden */
    public objectEqualityChecker(old: Object, next: Object): boolean {
        let keys: string[] = Object.keys(old);
        let isEqual: boolean = true;
        for (let i: number = 0; i < keys.length; i++) {
            if (old[keys[i]] !== next[keys[i]]) {
                isEqual = false; break;
            }
        }
        return isEqual;
    }

    private getBatchEditedRecords(primaryKey: string, rows: Row<Column>[]): Object {
        let keys: Object = {};
        let changes: Object = (this.parent as Grid).getBatchChanges();
        let changedRecords: Object[] = [];
        let addedRecords: Object[] = [];
        if (Object.keys(changes).length) {
            changedRecords = (<{ changedRecords?: Object[] }>changes).changedRecords;
            addedRecords = (<{ addedRecords?: Object[] }>changes).addedRecords;
        }
        let args: NotifyArgs = { cancel: false };
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
        row.isAltRow ? tr.classList.add('e-altrow') : tr.classList.remove('e-altrow');
        row.index = index;
        row.edit = undefined;
        row.isDirty = false;
        tr.setAttribute('aria-rowindex', index.toString());
        this.updateCellIndex(tr, index);
    }

    private updateCellIndex(rowEle: HTMLTableRowElement, index: number): void {
        for (let i: number = 0; i < rowEle.cells.length; i++) {
            rowEle.cells[i].setAttribute('index', index.toString());
        }
    }
}
