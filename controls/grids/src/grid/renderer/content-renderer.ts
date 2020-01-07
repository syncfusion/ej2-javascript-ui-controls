import { Droppable, DropEventArgs, isBlazor } from '@syncfusion/ej2-base';
import { isNullOrUndefined, extend } from '@syncfusion/ej2-base';
import { setStyleAttribute, remove, updateBlazorTemplate, removeClass } from '@syncfusion/ej2-base';
import { getUpdateUsingRaf, appendChildren } from '../base/util';
import * as events from '../base/constant';
import { IRenderer, IGrid, NotifyArgs, IModelGenerator, RowDataBoundEventArgs } from '../base/interface';
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


/**
 * Content module is used to render grid content
 * @hidden
 */
export class ContentRender implements IRenderer {
    //Internal variables             
    private contentTable: Element;
    private contentPanel: Element;
    private rows: Row<Column>[] = [];
    private freezeRows: Row<Column>[] = [];
    private movableRows: Row<Column>[] = [];
    private rowElements: Element[];
    private freezeRowElements: Element[] = [];
    private index: number;
    public colgroup: Element;
    private isLoaded: boolean = true;
    private tbody: HTMLElement;
    private viewColIndexes: number[] = [];
    private drop: Function = (e: DropEventArgs) => {
        this.parent.notify(events.columnDrop, { target: e.target, droppedElement: e.droppedElement });
        remove(e.droppedElement);
    }
    private args: NotifyArgs;
    private rafCallback: Function = (args: NotifyArgs) => {
        let arg: NotifyArgs = args;
        return () => {
            if (this.parent.getFrozenColumns() && this.parent.enableVirtualization) {
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
            if (this.parent.getFrozenColumns() !== 0) {
                rows = args.isFrozen ? this.freezeRows : this.movableRows;
            }
            this.parent.notify(events.contentReady, { rows: rows, args: arg });
            if (this.isLoaded) {
                this.parent.trigger(events.dataBound, {});
                if (this.parent.allowTextWrap) {
                    this.parent.notify(events.freezeRender, { case: 'textwrap' });
                }
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
        this.generator = this.getModelGenerator();
        if (this.parent.isDestroyed) { return; }
        if (!this.parent.enableColumnVirtualization && !this.parent.enableVirtualization) {
            this.parent.on(events.columnVisibilityChanged, this.setVisible, this);
        }
        this.parent.on(events.colGroupRefresh, this.colGroupRefresh, this);
        this.parent.on(events.uiUpdate, this.enableAfterRender, this);
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
        if (this.parent.enableVirtualization && !isNullOrUndefined(virtualTable) && !isNullOrUndefined(virtualTrack)) {
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
        this.setColGroup(<Element>this.parent.element.querySelector('.e-gridheader').querySelector('colgroup').cloneNode(true));
        table.appendChild(this.getColGroup());
        table.appendChild(this.parent.createElement('tbody'));
        innerDiv.appendChild(table);
        return innerDiv;
    }

    private splitRows(idx: number): void {
        if (this.parent.getFrozenColumns()) {
            if (idx === 0) {
                this.freezeRows = this.rows;
                this.freezeRowElements = this.rowElements;
            } else {
                this.movableRows = this.rows;
            }
        }
    }

    /** 
     * Refresh the content of the Grid. 
     * @return {void}  
     */
    // tslint:disable-next-line:max-func-body-length
    public refreshContentRows(args: NotifyArgs = {}): void {
        let gObj: IGrid = this.parent;
        if (gObj.currentViewData.length === 0) { return; }
        let dataSource: Object = gObj.currentViewData; let frag: DocumentFragment = document.createDocumentFragment();
        let hdrfrag: DocumentFragment = document.createDocumentFragment(); let columns: Column[] = <Column[]>gObj.getColumns();
        let tr: Element; let hdrTbody: HTMLElement; let frzCols: number = gObj.getFrozenColumns();
        let trElement: Element;
        let row: RowRenderer<Column> = new RowRenderer<Column>(this.serviceLocator, null, this.parent);
        this.rowElements = []; this.rows = [];
        let fCont: Element = this.getPanel().querySelector('.e-frozencontent');
        let mCont: HTMLElement = this.getPanel().querySelector('.e-movablecontent') as HTMLElement;
        let cont: HTMLElement = this.getPanel().querySelector('.e-content') as HTMLElement;
        if (isGroupAdaptive(gObj)) {
            if (['sorting', 'filtering', 'searching', 'grouping', 'ungrouping', 'reorder']
                .some((value: string) => { return args.requestType === value; })) {
                gObj.vcRows = [];
                gObj.vRows = [];
            }
        }
        let modelData: Row<Column>[];
        let isServerRendered: string = 'isServerRendered';
        if (isBlazor() && this.parent[isServerRendered]) {
            modelData = this.generator.generateRows(dataSource, args);
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
            }
            if (frzCols) {
                cont.style.overflowY = 'hidden';
                (fCont as HTMLElement).style.height = ((mCont.offsetHeight) - getScrollBarWidth()) + 'px';
                mCont.style.overflowY = this.parent.height !== 'auto' ? 'scroll' : 'auto';
                (fCont as HTMLElement).style.borderRightWidth = '1px';
                this.parent.notify(events.contentReady, { rows: this.movableRows, args: extend({}, arg, { isFrozen: false }) });
            }
            if (!(this.parent.isCheckBoxSelection || this.parent.selectionSettings.type === 'Multiple')
            || (!this.parent.isPersistSelection)) {
                if (this.parent.editSettings.mode === 'Normal') {
                    let rowIndex: string = 'editRowIndex';
                    this.parent.selectRow(args[rowIndex]);
                }
            }
            this.rafCallback(arg)();
            return;
        }
        if (this.parent.enableVirtualization && this.parent.getFrozenColumns()) {
            if (this.parent.enableColumnVirtualization) {
                if (args.requestType === 'virtualscroll' && args.virtualInfo.sentinelInfo.axis === 'X') {
                    modelData = (<{ generateRows?: Function }>(<Grid>this.parent).contentModule).generateRows(dataSource, args);
                    args.renderMovableContent = true;
                } else if (mCont.scrollLeft > 0 && !args.renderMovableContent) {
                    this.viewColIndexes = args.virtualInfo.columnIndexes;
                    let indexes: number[] = [];
                    for (let i: number = 0; i < this.parent.getFrozenColumns(); i++) {
                        indexes.push(i);
                    }
                    this.parent.setColumnIndexesInView(indexes);
                    args.virtualInfo.columnIndexes = indexes;
                }
            }
            modelData = (<{ generateRows?: Function }>(<Grid>this.parent).contentModule).generateRows(dataSource as Object[], args);
        } else {
            modelData = this.generator.generateRows(dataSource, args);
        }
        if (isNullOrUndefined(modelData[0].cells[0])) {
            mCont.querySelector('tbody').innerHTML = '';
        }
        let idx: number = modelData[0].cells[0].index;
        if (this.parent.enableColumnVirtualization && this.parent.getFrozenColumns() && args.renderMovableContent
            && args.requestType === 'virtualscroll' && mCont.scrollLeft > 0 && args.virtualInfo.columnIndexes[0] !== 0) {
            idx = this.parent.getFrozenColumns();
        }
        /* tslint:disable:no-any */
        if ((this.parent as any).registeredTemplate && (this.parent as any).registeredTemplate.template && !args.isFrozen) {
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
        if (this.parent.enableColumnVirtualization) {
            let cellMerge: CellMergeRender<Column> = new CellMergeRender(this.serviceLocator, this.parent);
            cellMerge.updateVirtualCells(modelData);
        }
        if (frzCols && idx >= frzCols) {
            this.tbody = mCont.querySelector('tbody');
        } else {
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
                if (scrollTop + (this.contentPanel.firstElementChild as HTMLElement).offsetHeight ===
                    this.contentPanel.firstElementChild.scrollHeight && !args.rowObject) {
                    blockLoad = false;
                }
            }
        }
        if (gObj.frozenRows && args.requestType === 'virtualscroll' && args.virtualInfo.sentinelInfo.axis === 'X') {
            let bIndex: number[] = args.virtualInfo.blockIndexes;
            args.virtualInfo.blockIndexes = [1, 2];
            let mhdrData: Row<Column>[] = (<{ generateRows?: Function }>(<{ vgenerator?: Function }>this).vgenerator)
                .generateRows(dataSource, args);
            mhdrData.splice(this.parent.frozenRows);
            for (let i: number = 0; i < this.parent.frozenRows; i++) {
                if (args.virtualInfo.columnIndexes[0] === 0) {
                    mhdrData[i].cells.splice(0, this.parent.getFrozenColumns());
                }
                tr = row.render(mhdrData[i], columns);
                hdrfrag.appendChild(tr);
            }
            args.virtualInfo.blockIndexes = bIndex;
        }
        for (let i: number = startIndex, len: number = modelData.length; i < len; i++) {
            this.rows.push(modelData[i]);
            if (isGroupAdaptive(gObj) && this.rows.length >= (gObj.pageSettings.pageSize) && blockLoad) {
                break;
            }
            if (!gObj.rowTemplate) {
                tr = row.render(modelData[i], columns);
                if (gObj.frozenRows && i < gObj.frozenRows && args.requestType !== 'virtualscroll') {
                    hdrfrag.appendChild(tr);
                } else {
                    frag.appendChild(tr);
                }
                if (modelData[i].isExpand) {
                    gObj.notify(events.expandChildGrid, (<HTMLTableRowElement>tr).cells[gObj.groupSettings.columns.length]);
                }
            } else {
                let rowTemplateID: string = gObj.element.id + 'rowTemplate';
                let elements: NodeList = gObj.getRowTemplate()(extend({ index: i }, dataSource[i]), gObj, 'rowTemplate', rowTemplateID);
                if ((elements[0] as Element).tagName === 'TBODY') {
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
                        tr = appendChildren(hdrfrag, elements);
                    } else {
                        // frag.appendChild(tr);
                        tr = appendChildren(frag, elements);
                        trElement = tr.lastElementChild;
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
        this.splitRows(idx);
        if ((gObj.frozenRows && args.requestType !== 'virtualscroll') || (args.requestType === 'virtualscroll'
            && args.virtualInfo.sentinelInfo && args.virtualInfo.sentinelInfo.axis === 'X')) {
            hdrTbody = frzCols ? gObj.getHeaderContent().querySelector(idx === 0 ? '.e-frozenheader'
                : '.e-movableheader').querySelector('tbody') : gObj.getHeaderTable().querySelector('tbody');
            hdrTbody.innerHTML = '';
            hdrTbody.appendChild(hdrfrag);
        }
        if (gObj.frozenRows && idx === 0 && cont.offsetHeight === Number(gObj.height)) {
            cont.style.height = (cont.offsetHeight - hdrTbody.offsetHeight) + 'px';
        }
        if (frzCols && idx === 0) {
            (this.getPanel().firstChild as HTMLElement).style.overflowY = 'hidden';
        }
        if (!isBlazor() || this.parent.isJsComponent) {
            args.rows = this.rows.slice(0);
        }
        args.isFrozen = this.parent.getFrozenColumns() !== 0 && !args.isFrozen;
        this.index = idx;
        getUpdateUsingRaf<HTMLElement>(
            () => {
                this.parent.notify(events.beforeFragAppend, args);
                let isVFTable: boolean = this.parent.enableVirtualization && this.parent.getFrozenColumns() !== 0;
                if (!this.parent.enableVirtualization) {
                    remove(this.tbody);
                    this.tbody = this.parent.createElement('tbody');
                }
                if (frzCols && !isVFTable) {
                    this.tbody.appendChild(frag);
                    if (this.index === 0) {
                        this.isLoaded = false;
                        fCont.querySelector('table').appendChild(this.tbody);
                    } else {
                        if (this.tbody.childElementCount < 1) {
                            this.tbody.appendChild(this.parent.createElement('tr').appendChild(this.parent.createElement('td')));
                        }
                        this.isLoaded = true;
                        mCont.querySelector('table').appendChild(this.tbody);
                        if (this.parent.getFrozenColumns() !== 0  && !this.parent.allowTextWrap) {
                            this.parent.notify(events.freezeRender, { case: 'refreshHeight' });
                        }
                        (fCont as HTMLElement).style.height = ((mCont.offsetHeight) - getScrollBarWidth()) + 'px';
                        mCont.style.overflowY = this.parent.height !== 'auto' ? 'scroll' : 'auto';
                        (fCont as HTMLElement).style.borderRightWidth = '1px';
                    }
                } else {
                    if (gObj.rowTemplate) {
                        updateBlazorTemplate(gObj.element.id + 'rowTemplate', 'RowTemplate', gObj);
                    }
                    if (isVFTable) {
                        if (!args.renderMovableContent) {
                            this.appendContent(fCont.querySelector('tbody'), frag, args);
                            if (this.parent.enableColumnVirtualization && mCont.scrollLeft > 0) {
                                this.parent.setColumnIndexesInView(this.viewColIndexes);
                                args.virtualInfo.columnIndexes = this.viewColIndexes;
                            }
                        } else {
                            this.appendContent(mCont.querySelector('tbody'), frag, args);
                            if (args.virtualInfo && args.virtualInfo.direction !== 'right' && args.virtualInfo.direction !== 'left') {
                                (fCont as HTMLElement).style.height = ((mCont.offsetHeight) - getScrollBarWidth()) + 'px';
                            }
                            args.renderMovableContent = false;
                        }
                    } else {
                        this.appendContent(this.tbody, frag, args);
                    }
                }
                if (frzCols && idx === 0) {
                    if (isVFTable) {
                        args.renderMovableContent = true;
                    }
                    this.refreshContentRows(extend({}, args));
                }
                frag = null;
            },
            this.rafCallback(extend({}, args)));
    }
    public appendContent(tbody: Element, frag: DocumentFragment, args: NotifyArgs): void {
        tbody.appendChild(frag);
        this.getTable().appendChild(tbody);
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
        return this.parent.getFrozenColumns() ? this.freezeRows : this.rows;
    }

    /**
     * Get the Movable Row collection in the Freeze pane Grid.
     * @returns {Row[] | HTMLCollectionOf<HTMLTableRowElement>}
     */
    public getMovableRows(): Row<Column>[] | HTMLCollectionOf<HTMLTableRowElement> {
        return this.movableRows;
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
        let frzCols: number = gObj.getFrozenColumns();
        let rows: Row<Column>[] = [];
        if (frzCols) {
            let fRows: Row<Column>[] = this.freezeRows;
            let mRows: Row<Column>[] = this.movableRows;
            let rowLen: number = fRows.length;
            let cellLen: number;
            for (let i: number = 0, row: Row<Column>; i < rowLen; i++) {
                cellLen = mRows[i].cells.length;
                row = fRows[i].clone();
                for (let j: number = 0; j < cellLen; j++) {
                    row.cells.push(mRows[i].cells[j]);
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
        let contentrows: Row<Column>[] = this.rows.filter((row: Row<Column>) => !row.isDetailRow);
        for (let c: number = 0, clen: number = columns.length; c < clen; c++) {
            let column: Column = columns[c];
            let idx: number = this.parent.getNormalizedColumnIndex(column.uid);
            let displayVal: string = column.visible === true ? '' : 'none';
            if (idx !== -1 && testRow && idx < testRow.cells.length) {
                if (frzCols) {
                    if (idx < frzCols) {
                        setStyleAttribute(<HTMLElement>this.getColGroup().childNodes[idx], { 'display': displayVal });
                        contentrows = this.freezeRows;
                    } else {
                        let mTable: Element = gObj.getContent().querySelector('.e-movablecontent').querySelector('colgroup');
                        idx = idx - frzCols;
                        setStyleAttribute(<HTMLElement>mTable.childNodes[idx], { 'display': displayVal });
                        tr = (<Grid>gObj).getMovableDataRows();
                        contentrows = this.movableRows;
                    }
                } else {
                    if (gObj.isRowDragable()) { idx++; }
                    setStyleAttribute(<HTMLElement>this.getColGroup().childNodes[idx], { 'display': displayVal });
                    if (gObj.isRowDragable()) { idx--; }
                }
            }
            idx = gObj.isDetail() ? idx - 1 : idx;
            if (!needFullRefresh) {
                this.setDisplayNone(tr, idx, displayVal, contentrows);
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
        Object.keys(tr).forEach((i: string) => {
            if (tr[i].querySelectorAll('td.e-rowcell').length) {
                setStyleAttribute(<HTMLElement>tr[i].querySelectorAll('td.e-rowcell')[idx], { 'display': displayVal });
                if (tr[i].querySelectorAll('td.e-rowcell')[idx].classList.contains('e-hide')) {
                    removeClass([tr[i].querySelectorAll('td.e-rowcell')[idx]], ['e-hide']);
                }
                rows[i].cells[idx].visible = displayVal === '' ? true : false;
            }
        });
    }

    private colGroupRefresh(): void {
        if (this.getColGroup()) {
            let colGroup: Element;
            if (this.parent.enableColumnVirtualization && this.parent.getFrozenColumns()) {
                colGroup = <Element>this.parent.getMovableVirtualHeader().querySelector('colgroup').cloneNode(true);
            } else {
                colGroup = isBlazor() ? <Element>this.parent.getHeaderTable().querySelector('colgroup').cloneNode(true) :
                    <Element>this.parent.element.querySelector('.e-gridheader').querySelector('colgroup').cloneNode(true);
            }
            this.getTable().replaceChild(colGroup, this.getColGroup());
            this.setColGroup(colGroup);
        }
    }

    private initializeContentDrop(): void {
        let gObj: IGrid = this.parent;
        let drop: Droppable = new Droppable(gObj.getContent() as HTMLElement, {
            accept: '.e-dragclone',
            drop: this.drop as (e: DropEventArgs) => void
        });
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
        if (this.parent.getFrozenColumns()) {
            (<Row<Column>[]>this.getMovableRows()).filter(
                (row: Row<Column>) => clearAll || uid === row.uid).forEach((row: Row<Column>) => row.isSelected = set);
        }
        (<Row<Column>[]>this.getRows()).filter((row: Row<Column>) => clearAll || uid === row.uid)
            .forEach((row: Row<Column>) => {
                row.isSelected = set;
                row.cells.forEach((cell: Cell<Column>) => cell.isSelected = set);
            });
    }

    public getRowByIndex(index: number): Element {
        return this.parent.getDataRows()[index];
    }

    public getVirtualRowIndex(index: number): number {
        return index;
    }

    public getMovableRowByIndex(index: number): Element {
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
}
