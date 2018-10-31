import { Droppable, DropEventArgs } from '@syncfusion/ej2-base';
import { isNullOrUndefined, extend } from '@syncfusion/ej2-base';
import { setStyleAttribute, remove } from '@syncfusion/ej2-base';
import { getUpdateUsingRaf, appendChildren } from '../base/util';
import * as events from '../base/constant';
import { IRenderer, IGrid, NotifyArgs, IModelGenerator } from '../base/interface';
import { Column } from '../models/column';
import { Row } from '../models/row';
import { Cell } from '../models/cell';
import { RowRenderer } from './row-renderer';
import { CellMergeRender } from './cell-merge-renderer';
import { ServiceLocator } from '../services/service-locator';
import { AriaService } from '../services/aria-service';
import { RowModelGenerator } from '../services/row-model-generator';
import { GroupModelGenerator } from '../services/group-model-generator';
import { getScrollBarWidth } from '../base/util';


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
    private freezeRowElements: Element[];
    private index: number;
    public colgroup: Element;
    private isLoaded: boolean = true;
    private tbody: HTMLElement;
    private drop: Function = (e: DropEventArgs) => {
        this.parent.notify(events.columnDrop, { target: e.target, droppedElement: e.droppedElement });
        remove(e.droppedElement);
    }
    private args: NotifyArgs;
    private rafCallback: Function = (args: NotifyArgs) => {
        let arg: NotifyArgs = args;
        return () => {
            this.ariaService.setBusy(<HTMLElement>this.getPanel().firstChild, false);
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
        this.parent.on(events.columnVisibilityChanged, this.setVisible, this);
        this.parent.on(events.colGroupRefresh, this.colGroupRefresh, this);
        this.parent.on(events.uiUpdate, this.enableAfterRender, this);
    }

    /**
     * The function is used to render grid content div    
     */
    public renderPanel(): void {
        let gObj: IGrid = this.parent;
        let div: Element = this.parent.createElement('div', { className: 'e-gridcontent' });
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
        let innerDiv: Element = <Element>this.getPanel().firstChild;
        let table: Element = this.parent.createElement('table', {
            className: 'e-table', attrs: {
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
        let row: RowRenderer<Column> = new RowRenderer<Column>(this.serviceLocator, null, this.parent);
        this.rowElements = []; this.rows = [];
        let fCont: Element = this.getPanel().querySelector('.e-frozencontent');
        let mCont: HTMLElement = this.getPanel().querySelector('.e-movablecontent') as HTMLElement;
        let cont: HTMLElement = this.getPanel().querySelector('.e-content') as HTMLElement;
        let modelData: Row<Column>[] = this.generator.generateRows(dataSource, args);
        if (isNullOrUndefined(modelData[0].cells[0])) {
            mCont.querySelector('tbody').innerHTML = '';
        }
        let idx: number = modelData[0].cells[0].index;
        // tslint:disable-next-line:no-any
        if ((this.parent as any).registeredTemplate && (this.parent as any).registeredTemplate.template && !args.isFrozen) {
            this.parent.destroyTemplate(['template']);
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
        for (let i: number = 0, len: number = modelData.length; i < len; i++) {
            if (!gObj.rowTemplate) {
                tr = row.render(modelData[i], columns);
                if (gObj.frozenRows && i < gObj.frozenRows) {
                    hdrfrag.appendChild(tr);
                } else {
                    frag.appendChild(tr);
                }
            } else {
                let elements: NodeList = gObj.getRowTemplate()(extend({ index: i }, dataSource[i]), gObj, 'rowTemplate');
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
                    }
                }
            }

            this.rows.push(modelData[i]);
            if (modelData[i].isDataRow) {
                //detailrowvisible 
                let td: Element = tr.querySelectorAll('.e-rowcell:not(.e-hide)')[0];
                if (td) {
                    td.classList.add('e-detailrowvisible');
                }
                this.rowElements.push(tr);
            }
            this.ariaService.setOptions(this.getTable() as HTMLElement, { colcount: gObj.getColumns().length.toString() });
        }
        this.splitRows(idx);
        if (gObj.frozenRows) {
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
        args.rows = this.rows.slice(0);
        args.isFrozen = this.parent.getFrozenColumns() !== 0 && !args.isFrozen;
        this.index = idx;
        getUpdateUsingRaf<HTMLElement>(
            () => {
                this.parent.notify(events.beforeFragAppend, args);
                if (!this.parent.enableVirtualization) {
                    remove(this.tbody);
                    this.tbody = this.parent.createElement('tbody');
                }
                if (frzCols) {
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
                        (fCont as HTMLElement).style.height = ((mCont.offsetHeight) - getScrollBarWidth()) + 'px';
                        mCont.style.overflowY = this.parent.height !== 'auto' ? 'scroll' : 'auto';
                        (fCont as HTMLElement).style.borderRightWidth = '1px';
                    }
                } else {
                    this.appendContent(this.tbody, frag, args);
                }
                if (frzCols && idx === 0) {
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
        return this.colgroup = colGroup;
    }
    /**
     * Function to hide content table column based on visible property
     * @param  {Column[]} columns?
     */
    public setVisible(columns?: Column[]): void {
        let gObj: IGrid = this.parent;
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

        for (let c: number = 0, clen: number = columns.length; c < clen; c++) {
            let column: Column = columns[c];
            let idx: number = this.parent.getNormalizedColumnIndex(column.uid);

            //used canSkip method to skip unwanted visible toggle operation. 
            if (this.canSkip(column, testRow, idx)) {
                continue;
            }

            let displayVal: string = column.visible === true ? '' : 'none';
            if (frzCols) {
                if (idx < frzCols) {
                    setStyleAttribute(<HTMLElement>this.getColGroup().childNodes[idx], { 'display': displayVal });
                } else {
                    let mTable: Element = gObj.getContent().querySelector('.e-movablecontent').querySelector('colgroup');
                    setStyleAttribute(<HTMLElement>mTable.childNodes[idx - frzCols], { 'display': displayVal });
                }
            } else {
                setStyleAttribute(<HTMLElement>this.getColGroup().childNodes[idx], { 'display': displayVal });
            }
        }

        this.refreshContentRows({ requestType: 'refresh' });
    }

    private colGroupRefresh(): void {
        if (this.getColGroup()) {
            let colGroup: Element = <Element>this.parent.element.querySelector('.e-gridheader').querySelector('colgroup').cloneNode(true);
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