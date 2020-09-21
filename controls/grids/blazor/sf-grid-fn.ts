import { BlazorDotnetObject, extend, isNullOrUndefined, print } from '@syncfusion/ej2-base';
import { EventHandler, MouseEventArgs, KeyboardEventArgs, KeyboardEvents, closest } from '@syncfusion/ej2-base';
import { Scroll } from './scroll';
import { Freeze } from './freeze';
import { BlazorGridElement, IGridOptions, Column, ScrollPositionType } from './interfaces';
import { iterateArrayOrObject, parentsUntil, getRowHeight } from './util';
import { HeaderDragDrop } from './header-drag-drop';
import { ContentDragDrop } from './content-drag-drop';
import { Reorder } from './reorder';
import { Resize } from './resize';
import { Group } from './group';
import { ColumnChooser } from './column-chooser';
import { ColumnMenu } from './column-menu';
import { Filter } from './filter';
import { Edit } from './edit';
import { Clipboard } from './clipboard';
import { CustomToolTip } from './tooltip';
import { RowDD } from './row-reorder';
import { Selection } from './selection';
import { VirtualHeaderRenderer, VirtualContentRenderer } from './virtual-scroll';
import { IGrid } from '../src';

/**
 * SfGrid client constructor
 */
export class SfGrid {
    public element: BlazorGridElement;
    public dotNetRef: BlazorDotnetObject;
    public options: IGridOptions;
    public header: HTMLElement;
    public content: HTMLElement;
    public footer: HTMLElement;
    public columnModel: Column[] = [];
    public scrollModule: Scroll;
    public freezeModule: Freeze;
    public headerDragDrop: HeaderDragDrop;
    public contentDragDrop: ContentDragDrop;
    public reorderModule: Reorder;
    public groupModule: Group;
    public columnChooserModule: ColumnChooser;
    public columnMenuModule: ColumnMenu;
    public filterModule: Filter;
    public resizeModule: Resize;
    public editModule: Edit;
    public clipboardModule : Clipboard;
    public virtualHeaderModule: VirtualHeaderRenderer;
    public virtualContentModule: VirtualContentRenderer;
    public keyModule: KeyboardEvents;
    private toolTipModule: CustomToolTip;
    public rowDragAndDropModule: RowDD;
    public selectionModule : Selection;

    private stackedColumn: Column;
    private inViewIndexes: number[] = [];
    /** @hidden */
    public scrollPosition: ScrollPositionType;
    private isRendered: boolean = false;

    constructor(element: BlazorGridElement, options: IGridOptions, dotnetRef: BlazorDotnetObject) {
        this.element = element;
        if (isNullOrUndefined(element)) { return; }
        if (!isNullOrUndefined(element)) {
            this.element.blazor__instance = this;
        }
        this.dotNetRef = dotnetRef;
        this.options = options;
        this.header = this.element.querySelector('.e-headercontent');
        this.content = this.element.querySelector('.e-gridcontent .e-content');
        this.footer = this.element.querySelector('.e-summarycontent');
        this.initModules();
    }

    public initModules() {
        this.scrollModule = new Scroll(this);
        this.freezeModule = new Freeze(this);
        this.headerDragDrop = new HeaderDragDrop(this);
        this.contentDragDrop =  new ContentDragDrop(this);
        this.reorderModule = new Reorder(this);
        this.groupModule = new Group(this);
        this.resizeModule = new Resize(this);
        this.editModule = new Edit(this);
        this.columnChooserModule = new ColumnChooser(this);
        this.clipboardModule = new Clipboard(this);
        this.columnMenuModule = new ColumnMenu(this);
        this.filterModule = new Filter(this);
        this.virtualContentModule = new VirtualContentRenderer(this);
        this.virtualHeaderModule = new VirtualHeaderRenderer(this);
        this.toolTipModule = new CustomToolTip(this);
        this.rowDragAndDropModule = new RowDD(this);
        this.selectionModule = new Selection(this);
        this.isRendered = this.options.isPrerendered;
        this.keyModule = new KeyboardEvents(
            this.element,
            {
                keyAction: this.keyActionHandler.bind(this),
                keyConfigs: gridKeyConfigs,
                eventName: 'keydown'
            }
            )
        if (this.options.enableColumnVirtualization){
            this.virtualHeaderModule.renderTable();
        }
        if (this.options.enableVirtualization) {
            this.virtualContentModule.renderTable();
        }
        if (this.options.allowResizing){
            this.resizeModule.render();
        }
        // needClientAction should only be used for virtual scroll and hideAtMedia features
        if (!this.options.needClientAction) {
            this.contentReady();
        } else {
            this.clientActions();
        }
        this.wireEvents();
    }

    public getHeaderContent() { return this.header; }
    public getHeaderTable() { return this.header.querySelector('.e-table'); }
    public getContent() { return this.content; }
    public getContentTable() { return this.content.querySelector('.e-table'); }
    public getFooterContent() { return this.footer; }

    public getColumns(isRefresh?: boolean): Column[] {
        // let inview: number[] = this.inViewIndexes.map((v: number) => v - this.groupSettings.columns.length).filter((v: number) => v > -1);
        // let vLen: number = inview.length;
        // if (!this.enableColumnVirtualization || isNullOrUndefined(this.columnModel) || this.columnModel.length === 0 || isRefresh) {
        //     this.columnModel = [];
        //     this.updateColumnModel(this.columns as Column[]);
        // }
        // let columns: Column[] = vLen === 0 ? this.columnModel :
        //     this.columnModel.slice(inview[0], inview[vLen - 1] + 1);
        this.columnModel = [];
        this.updateColumnModel(this.options.columns as Column[]);
        return this.columnModel;
    }

    private updateColumnModel(columns: Column[]): void {
        for (let i: number = 0, len: number = columns.length; i < len; i++) {
            if (columns[i].columns) {
                this.updateColumnModel(columns[i].columns as Column[]);
            } else {
                this.columnModel.push(columns[i] as Column);
            }
        }
        // this.updateFrozenColumns();
        // this.updateLockableColumns();
    }

    public getColumnByIndex(index: number): Column {
        let column: Column;
        this.getColumns().some((col: Column, i: number) => {
            column = col;
            return i === index;
        });
        return column;
    }

    public getDataRows(): Element[] {
        if (isNullOrUndefined(this.getContentTable().querySelector('tbody'))) { return []; }
        let rows: HTMLElement[] = [].slice.call(this.getContentTable().querySelector('tbody').children);
        if (this.options.frozenRows) {
            let freezeRows: HTMLElement[] = [].slice.call(this.getHeaderTable().querySelector('tbody').children);
            rows = this.addMovableRows(freezeRows, rows);
        }
        let dataRows: Element[] = this.generateDataRows(rows);
        return dataRows;
    }

    public addMovableRows(fRows: HTMLElement[], mrows: HTMLElement[]): HTMLElement[] {
        for (let i: number = 0, len: number = mrows.length; i < len; i++) {
            fRows.push(mrows[i]);
        }
        return fRows;
    }

    private generateDataRows(rows: HTMLElement[]): Element[] {
        let dRows: Element[] = [];
        for (let i: number = 0, len: number = rows.length; i < len; i++) {
            if (rows[i].classList.contains('e-row') && !rows[i].classList.contains('e-hiddenrow')) {
                dRows.push(rows[i] as Element);
            }
        }
        return dRows;
    }

    public getMovableDataRows(): Element[] {
        let rows: HTMLElement[] =
            [].slice.call(this.getContent().querySelector('.e-movablecontent').querySelector('tbody').children);
        if (this.options.frozenRows) {
            let freezeRows: HTMLElement[] =
                [].slice.call(this.getHeaderContent().querySelector('.e-movableheader').querySelector('tbody').children);
            rows = this.addMovableRows(freezeRows, rows);
        }
        let dataRows: Element[] = this.generateDataRows(rows);
        return dataRows;
    }

    public getFrozenDataRows(): Element[] {
        let rows: HTMLElement[] =
            [].slice.call(this.getContent().querySelector('.e-frozencontent').querySelector('tbody').children);
        if (this.options.frozenRows) {
            let freezeRows: HTMLElement[] =
                [].slice.call(this.getHeaderContent().querySelector('.e-frozenheader').querySelector('tbody').children);
            rows = this.addMovableRows(freezeRows, rows);
        }
        let dataRows: Element[] = this.generateDataRows(rows);
        return dataRows;
    }

    public getRowByIndex(index: number): Element {
        return this.getDataRows()[index];
    }

    public getCellFromIndex(rowIndex: number, columnIndex: number): Element {
        let frzCols: number = this.options.frozenColumns;
        return frzCols && columnIndex >= frzCols ?
            this.getMovableDataRows()[rowIndex] && this.getMovableDataRows()[rowIndex].querySelectorAll('.e-rowcell')[columnIndex - frzCols] :
            this.getDataRows()[rowIndex] && this.getDataRows()[rowIndex].querySelectorAll('.e-rowcell')[columnIndex];
    }

    public getColumnHeaderByIndex(index: number): Element {
        return this.getHeaderTable().querySelectorAll('.e-headercell')[index];
    }

    public getRows(): Element[] {
        return this.options.frozenColumns ? this.getFrozenDataRows() : <Element[]>[].slice.call(this.getContentTable().querySelectorAll('tr.e-row[data-uid]'));
    }

    public getSelectedRows(): Element[] {
       return this.getRows().filter(row => row.getAttribute('aria-selected') === 'true');
    }

    public getSelectedRowIndexes(): number[] {
        let selectedIndexes: number[] = [];
        let rows : Element[] = this.getRows();
        for(let i: number = 0; i < rows.length; i++) {
            if (rows[i].hasAttribute('aria-selected') && rows[i].getAttribute('aria-selected') === "true") {
                selectedIndexes.push(i);
            }
        }
        return selectedIndexes;
    }

    public getVisibleColumns(): Column[] {
        let cols: Column[] = [];
        for (let col of this.columnModel) {
            if (col.visible) {
                cols.push(col);
            }
        }
        return cols;
    }
    /**
     * Gets a Column by column name.
     * @param  {string} field - Specifies the column name.
     * @return {Column}
     * @blazorType GridColumn
     */
    public getColumnByField(field: string): Column {
        return iterateArrayOrObject<Column, Column>(<Column[]>this.getColumns(), (item: Column, index: number) => {
            if (item.field === field) {
                return item;
            }
            return undefined;
        })[0];
    }

    /**
     * Gets a column index by column name.
     * @param  {string} field - Specifies the column name.
     * @return {number}
     */
    public getColumnIndexByField(field: string): number {
        let cols: Column[] = this.getColumns();
        for (let i: number = 0; i < cols.length; i++) {
            if (cols[i].field === field) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Gets a column by UID.
     * @param  {string} uid - Specifies the column UID.
     * @return {Column}
     * @blazorType GridColumn
     */
    public getColumnByUid(uid: string): Column {
        return iterateArrayOrObject<Column, Column>(
            [...<Column[]>this.getColumns(), ...this.getStackedColumns(this.options.columns as Column[])],
            (item: Column, index: number) => {
                if (item.uid === uid) {
                    return item;
                }
                return undefined;
            })[0];
    }

    /**
     * @hidden   
     */
    public getStackedColumns(columns: Column[], stackedColumn: Column[] = []): Column[] {
        for (const column of columns) {
            if (column.columns) {
                stackedColumn.push(column);
                this.getStackedColumns(column.columns as Column[], stackedColumn);
            }
        }
        return stackedColumn;
    }

    /**
     * Gets a column index by UID.
     * @param  {string} uid - Specifies the column UID.
     * @return {number}
     */
    public getColumnIndexByUid(uid: string): number {
        let index: number = iterateArrayOrObject<number, Column>
            (<Column[]>this.getColumns(), (item: Column, index: number) => {
                if (item.uid === uid) {
                    return index;
                }
                return undefined;
            })[0];

        return !isNullOrUndefined(index) ? index : -1;
    }

    /**
     * Gets a column header by UID.
     * @param  {string} field - Specifies the column uid.
     * @return {Element} 
     */
    public getColumnHeaderByUid(uid: string): Element {
        return this.getHeaderContent().querySelector('[e-mappinguid=' + uid + ']').parentElement;
    }

    /**
     * Gets UID by column name.
     * @param  {string} field - Specifies the column name.
     * @return {string}
     */
    public getUidByColumnField(field: string): string {
        return iterateArrayOrObject<string, Column>(<Column[]>this.getColumns(), (item: Column, index: number) => {
            if (item.field === field) {
                return item.uid;
            }
            return undefined;
        })[0];
    }

    public getStackedHeaderColumnByHeaderText(stackedHeader: string, col: Column[]): Column {
        for (let i: number = 0; i < col.length; i++) {
            let individualColumn: Column = col[i];
            if (individualColumn.field === stackedHeader || individualColumn.headerText === stackedHeader) {
                this.stackedColumn = individualColumn;
                break;
            } else if (individualColumn.columns) {
                this.getStackedHeaderColumnByHeaderText(stackedHeader, <Column[]>individualColumn.columns);
            }
        }
        return this.stackedColumn;
    }

        /**
     * Gets TH index by column uid value.
     * @private
     * @param  {string} uid - Specifies the column uid.
     * @return {number}
     */
    public getNormalizedColumnIndex(uid: string): number {
        let index: number = this.getColumnIndexByUid(uid);        
        return index + this.getIndentCount();
    }

     /**
     * Gets indent cell count.
     * @private
     * @return {number}
     */
    public getIndentCount():number {
        let index: number = 0;
        if (this.options.allowGrouping) {
            index += this.options.groupCount;
        }
        if (this.options.hasDetailTemplate) {
            index++;
        }
        if (this.options.allowRowDragAndDrop && this.options.hasDropTarget) {
            index++;
        }
        /**
         * TODO: index normalization based on the stacked header, grouping and detailTemplate 
         * and frozen should be handled here 
         */
        return index;
    }

    /**  
     * Gets indent Cell Width  
     * @hidden
     */
    public recalcIndentWidth(): void {
        if (!this.isRendered || !this.getHeaderTable().querySelector('.e-emptycell')) {
            return;
        }
        // Handle Detail and DragDrop
        if ((!this.options.groupCount && !this.options.hasDetailTemplate && 
            (this.options.allowRowDragAndDrop && this.options.hasDropTarget)) || !this.getContentTable()
        || this.getHeaderTable().querySelector('.e-emptycell').getAttribute("indentRefreshed")) {
            return;
        }
        let indentWidth: number = (this.getHeaderTable().querySelector('.e-emptycell').parentElement as HTMLElement).offsetWidth;
        let perPixel: number = indentWidth / 30;
        let i: number = 0;
        if (perPixel >= 1) {
            indentWidth = (30 / perPixel);
        }
        // if (this.enableColumnVirtualization || this.isAutoGen) { indentWidth = 30; }
        // if (this.isDetail()) {
        //     applyWidth(i, indentWidth);
        //     i++;
        // }
        // if (this.isRowDragable()) {
        //     applyWidth(i, indentWidth);
        // }
        this.getHeaderTable().querySelector('.e-emptycell').setAttribute('indentRefreshed', 'true');
        this.dotNetRef.invokeMethodAsync('SetIndentWidth', indentWidth + 'px');
    }

    public contentReady(action: string = null): void {
        if (this.getColumns().some(x => x.autoFit)) {
            this.resizeModule.autoFit();
        }
        if (this.options.frozenColumns) {
            this.freezeModule.refreshRowHeight();
            this.freezeModule.setFrozenHeight();
        }
        if (this.options.enableVirtualization) {
            this.virtualContentModule.onDataReady();
        }
        this.recalcIndentWidth();
        if (action === 'Paging') { //restore focus on paging.
            if (!parentsUntil(document.activeElement, 'e-grid')) {
                this.element.focus();
            }
        }
    }

    public wireEvents(): void {
        EventHandler.add(this.element,'mousedown', this.mouseDownHandler, this);
        EventHandler.add(this.element,'focus', this.gridFocus, this);
        EventHandler.add(document,'click', this.documentClickHandler, this);
        EventHandler.add(this.element,'keydown', this.gridKeyDownHandler, this);
        EventHandler.add(this.element, 'keydown', this.keyDownHandler, this);
        EventHandler.add(document.body,'keydown', this.documentKeyHandler, this);
    }

    public unWireEvents(): void {
        EventHandler.remove(this.element, 'mousedown', this.mouseDownHandler);
        EventHandler.remove(this.element, 'focus', this.gridFocus);
        EventHandler.remove(document, 'click', this.documentClickHandler);
        EventHandler.remove(this.element, 'keydown', this.gridKeyDownHandler);
        EventHandler.remove(this.element, 'keydown', this.keyDownHandler);
        EventHandler.remove(document.body,'keydown', this.documentKeyHandler);
    }

    public setOptions(newOptions: IGridOptions, options: IGridOptions) {
        let oldOptions: IGridOptions = <IGridOptions>extend(options, {});
        this.options = newOptions;
        if (!oldOptions.allowResizing && newOptions.allowResizing) {
            this.resizeModule.render();
        }
        if ((!oldOptions.allowGrouping && newOptions.allowGrouping)
            || (!oldOptions.allowReordering && newOptions.allowReordering)) {
            this.headerDragDrop.initializeHeaderDrag();
            this.headerDragDrop.initializeHeaderDrop();
            this.groupModule.initializeGHeaderDrag();
            this.groupModule.initializeGHeaderDrop();
        }

        if (!oldOptions.allowGrouping && newOptions.allowGrouping) {
            this.contentDragDrop.initializeContentDrop();
        }

        if (!oldOptions.allowRowDragAndDrop && newOptions.allowRowDragAndDrop) {
            this.rowDragAndDropModule.initializeDrag();
        } else if (oldOptions.allowRowDragAndDrop && !newOptions.allowRowDragAndDrop){
            this.rowDragAndDropModule.destroy();
        }

        if (!this.isRendered) {
            this.isRendered = this.options.isPrerendered;
        }

        if (oldOptions.groupCount != newOptions.groupCount) {
            let cell: Element = this.getHeaderTable().querySelector('.e-emptycell');
            if (!cell) { return; }
            cell.removeAttribute('indentRefreshed');
        }
    }
    public documentClickHandler(e: MouseEventArgs): void {
        let popupElement: Element = parentsUntil(<Element>e.target, 'e-popup-open');
        let CCButton: Element = parentsUntil(<Element>e.target,'e-cc-toolbar');
        if (!popupElement && !((<Element>e.target).classList.contains('e-cc-cancel')) && !((<Element>e.target).classList.contains('e-choosercheck')) && !((<Element>e.target).classList.contains('e-fltrcheck')) && !((<Element>e.target).classList.contains('e-icon-filter')) && !CCButton && (this.element.querySelectorAll('.e-filter-popup.e-popup-open').length || this.element.querySelectorAll('.e-ccdlg.e-popup-open').length)) {
            this.dotNetRef.invokeMethodAsync('FilterPopupClose');
        }
    }
    private documentKeyHandler(e: KeyboardEventArgs): void {
        //TODO: handle alt+w
        // 74 - J
        if (e.altKey && e.keyCode === 74 && !isNullOrUndefined(this.element))
        {
            this.element.focus();
            this.dotNetRef.invokeMethodAsync("GridFocus", e);
        }
    }

    public keyDownHandler(e: KeyboardEventArgs): void {
        var gridElement = parentsUntil(<Element>e.target, 'e-grid');

        if ((gridElement && gridElement.id !== this.element.id) ||  
            (e.key == "Shift" || e.key == "Control" || e.key == "Alt")) {
            return;
        }
        
        if((e.target as HTMLElement).tagName == "INPUT" && e.code == "Delete") {
            return;
        }

        this.dotNetRef.invokeMethodAsync("GridKeyDown", { 
            key: e.key,
            code: e.code,
            ctrlKey: e.ctrlKey,
            shiftKey: e.shiftKey,
            altKey: e.altKey
        });
    }

    public gridKeyDownHandler(e: KeyboardEventArgs): void {
        let popupElement: Element = parentsUntil(<Element>e.target, 'e-filter-popup');
        if (!isNullOrUndefined(popupElement) && popupElement.classList.contains('e-popup-open') && e.key != 'Escape') {
            e.stopPropagation();
            if ((e.key == "Tab" || e.key == "shiftTab" || e.key == "Enter" || e.key == "shiftEnter") && 
                (e.target as HTMLElement).tagName == "INPUT") {
                let evt = document.createEvent('HTMLEvents');
                evt.initEvent('change', false, true);
                e.target.dispatchEvent(evt);
            }
        }

        if (e.key == "Shift" || e.key == "Control" || e.key == "Alt") { 
            e.stopPropagation(); //dont let execute c# keydown handler for meta keys.
        }

        if (e.keyCode === 67 && e.ctrlKey) {
            this.clipboardModule.copy();
        } else if (e.keyCode === 72 && e.ctrlKey && e.shiftKey) {
            this.clipboardModule.copy(true);
        }
        if (e.keyCode === 86 && e.ctrlKey && !this.options.isEdit) {
            this.clipboardModule.pasteHandler();
        }

        if (this.element.querySelector('.e-batchrow')) {
            if (e.key != "Tab" && e.key != "shiftTab" && e.key != "Enter" && e.key != "shiftEnter"
                && e.key != "Escape")
            {
                e.stopPropagation();
            }
            //new
            if (e.key == "Tab" || e.key == "shiftTab" || e.key == "Enter" || e.key == "shiftEnter") {
                e.preventDefault();
                if ((e.target as HTMLElement).tagName == "INPUT") {
                    let evt = document.createEvent('HTMLEvents');
                    evt.initEvent('change', false, true);
                    e.target.dispatchEvent(evt);
                }
            }

        }
    }

    public mouseDownHandler(e: MouseEventArgs): void {
        let gridElement: Element = parentsUntil(<Element>e.target, 'e-grid');
        if (gridElement && gridElement.id !== this.element.id) {
            return;
        }
        if (e.shiftKey || e.ctrlKey) {
            e.preventDefault(); //prevent user select on shift pressing during selection
        }
        // e.button = 2 for right mouse button click
        if ((e.button !== 2 && parentsUntil(<Element>e.target, 'e-headercell')) || parentsUntil(<Element>e.target, 'e-detailrowexpand') || parentsUntil(<Element>e.target, 'e-detailrowcollapse') || closest(<Element>e.target, ".e-groupdroparea") || closest(<Element>e.target, ".e-gridpopup")
            || closest(<Element>e.target, ".e-summarycell") || closest(<Element>e.target, ".e-rhandler")
            || closest(<Element>e.target, ".e-filtermenudiv") || closest(<Element>e.target, ".e-filterbarcell")
            || closest(<Element>e.target, ".e-groupcaption")) {
                this.dotNetRef.invokeMethodAsync("MouseDownHandler", null, null);
        } else {
            let target: string = null;
            let cellUid: string = null;
            let editForm: Element = parentsUntil(parentsUntil(<Element>e.target, 'e-gridform'), 'e-grid');
            if (parentsUntil(<Element>e.target, 'e-editcell') || editForm && editForm.id == gridElement.id) {
                target = "Edit"
            } else if (parentsUntil(<Element>e.target, 'e-pager')) {
                target = "Pager"
            } else if (parentsUntil(<Element>e.target, 'e-headercontent')) {
                target = "Header";
                cellUid = parentsUntil(<Element>e.target, 'e-headercell') ? parentsUntil(<Element>e.target, 'e-headercell').getAttribute('data-uid') : null;
            } else if (parentsUntil(<Element>e.target, 'e-content')) {
                target = "Content";
                cellUid = parentsUntil(<Element>e.target, 'e-rowcell') ? parentsUntil(<Element>e.target, 'e-rowcell').getAttribute('data-uid') : null;
            }
            if (target == "Header" || target == "Content" || target == "Pager" || target == "Edit") {
                this.dotNetRef.invokeMethodAsync("MouseDownHandler", target, cellUid);
            }
        }
    }

    public gridFocus(e: FocusEvent) { //new
        if (!isNullOrUndefined(this.element.querySelector(".e-gridform")) && 
            this.element.querySelector(".e-gridform").classList.contains("e-editing")) { return; }
        this.dotNetRef.invokeMethodAsync("GridFocus", e);
    }

    public keyActionHandler(e: KeyboardEventArgs) {
        if (e.action === 'pageUp' || e.action === 'pageDown' || e.action === 'ctrlAltPageUp' 
        || e.action === 'ctrlAltPageDown' || e.action === 'altPageUp' || e.action === 'altPageDown' 
        || e.action === 'altDownArrow' || e.action === 'ctrlPlusP') { 
            e.preventDefault();
        }
        if (e.action === 'enter' && !isNullOrUndefined(this.element.querySelector(".e-gridform"))
            && this.element.querySelector(".e-gridform").classList.contains("e-editing")
            && this.options.editMode !== "Batch") {
            setTimeout(() => 
                {
                    (e.target as HTMLElement).blur();
                    this.dotNetRef.invokeMethodAsync("EndEdit");
                }, 40);
        }
    }

    public destroy() {
        this.unWireEvents();
        this.toolTipModule.destroy();
        this.keyModule.destroy();
        this.virtualContentModule.removeEventListener();
        this.columnChooserModule.removeMediaListener();
        this.selectionModule.removeEventListener();
        this.rowDragAndDropModule.destroy();
    }
/**
     * @private
     */
    public getColumnIndexesInView(): number[] {
        return this.inViewIndexes;
    }

    /**
     * @private
     */
    public setColumnIndexesInView(indexes: number[]): void {
        this.inViewIndexes = indexes;
    }

    public getRowHeight(): number {
        return this.options.rowHeight ? this.options.rowHeight : getRowHeight(this.element);
    }

    private clientActions(): void {
        if (this.options.enableVirtualization && (this.options.pageSize === 12 || this.options.width === 'auto')) {
            this.virtualContentModule.ensurePageSize();
        }
        if (this.getColumns().some((col: Column) =>  col.hideAtMedia !== '')) {
            this.columnChooserModule.setMediaColumns();
        }
    }

    public print(): void {
        this.removeColGroup();
        let printWind: Window = window.open('', 'print', 'height=' + window.outerHeight + ',width=' + window.outerWidth + ',tabbar=no');
        printWind.moveTo(0, 0);
        printWind.resizeTo(screen.availWidth, screen.availHeight);
        print(this.element, printWind);
    }

    private removeColGroup() : void {
        let depth: number = this.options.groupCount;
        let element: HTMLElement = this.element;
        let id: string = '#' + this.element.id;
        if (!depth) {
            return;
        }
        let groupCaption: NodeList = element.querySelectorAll(`.e-groupcaption`);
        let colSpan: string = (<HTMLElement>groupCaption[depth - 1]).getAttribute('colspan');
        for (let i: number = 0; i < groupCaption.length; i++) {
            (<HTMLElement>groupCaption[i]).setAttribute('colspan', colSpan);
        }
        let colGroups: NodeList = element.querySelectorAll(`colgroup${id}colGroup`);
        let contentColGroups: NodeList = element.querySelector('.e-content').querySelectorAll('colgroup');
        this.hideColGroup(colGroups, depth);
        this.hideColGroup(contentColGroups, depth);
    }

    private hideColGroup(colGroups: NodeList, depth: number): void {
        for (let i: number = 0; i < colGroups.length; i++) {
            for (let j: number = 0; j < depth; j++) {
                (<HTMLElement>(<HTMLElement>colGroups[i]).children[j]).style.display = 'none';
            }
        }
    }

    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'grid';
    }
}

const gridKeyConfigs: { [x: string]: string } = {
    pageUp: 'pageup',
    pageDown: 'pagedown',
    ctrlAltPageUp: 'ctrl+alt+pageup',
    ctrlAltPageDown: 'ctrl+alt+pagedown',
    altPageUp: 'alt+pageup',
    altPageDown: 'alt+pagedown',
    altDownArrow: 'alt+downarrow',
    altUpArrow: 'alt+uparrow',
    ctrlDownArrow: 'ctrl+downarrow',
    ctrlUpArrow: 'ctrl+uparrow',
    ctrlPlusA: 'ctrl+A',
    ctrlPlusP: 'ctrl+P',
    ctrlPlusC: 'ctrl+C',
    ctrlShiftPlusH: 'ctrl+shift+H',
    enter: 'enter',
};