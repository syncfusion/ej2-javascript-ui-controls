import { EventHandler, detach, formatUnit, Browser, closest, classList, isBlazor, extend } from '@syncfusion/ej2-base';
import { Column } from '../models/column';
import { IGrid, IAction, ResizeArgs } from '../base/interface';
import { ColumnWidthService } from '../services/width-controller';
import * as events from '../base/constant';
import { getScrollBarWidth, parentsUntil } from '../base/util';
import { OffsetPosition } from '@syncfusion/ej2-popups';
import { isNullOrUndefined } from '@syncfusion/ej2-base';

export const resizeClassList: ResizeClasses = {
    root: 'e-rhandler',
    suppress: 'e-rsuppress',
    icon: 'e-ricon',
    helper: 'e-rhelper',
    header: 'th.e-headercell',
    cursor: 'e-rcursor'
};

export interface ResizeClasses {
    root: string;
    suppress: string;
    icon: string;
    helper: string;
    header: string;
    cursor: string;
}

/**
 * `Resize` module is used to handle Resize to fit for columns.
 * @hidden
 * @private
 */
export class Resize implements IAction {
    //Internal variable    
    private content: HTMLDivElement;
    private header: HTMLDivElement;
    private pageX: number;
    private column: Column;
    private element: HTMLElement;
    private helper: HTMLElement;
    private tapped: boolean | number = false;
    private isDblClk: boolean | number = true;
    private minMove: number;
    private parentElementWidth: number;
    public isFrozenColResized: boolean;
    //Module declarations
    private parent: IGrid;
    private widthService: ColumnWidthService;

    /**
     * Constructor for the Grid resize module
     * @hidden
     */
    constructor(parent?: IGrid) {
        this.parent = parent;
        if (this.parent.isDestroyed) {
            return;
        }
        this.widthService = new ColumnWidthService(parent);
        this.addEventListener();
    }

    /** 
     * Resize by field names. 
     * @param  {string|string[]} fName - Defines the field name.  
     * @return {void} 
     */
    public autoFitColumns(fName?: string | string[]): void {
        let columnName: string[] = (fName === undefined || fName === null || fName.length <= 0) ?
            this.parent.getColumns().map((x: Column) => x.field) : (typeof fName === 'string') ? [fName] : fName;
        this.findColumn(columnName);
    }

    private autoFit(): void {
        let newarray: string[] = this.parent.getColumns().filter((c: Column) => c.autoFit === true)
            .map((c: Column) => c.field || c.headerText);
        if (newarray.length > 0) {
            this.autoFitColumns(newarray);
        }
        if (this.parent.resizeSettings.mode === 'Auto') {
            this.widthService.setWidthToTable();
        }
    }

    /* tslint:disable-next-line:max-func-body-length */
    private resizeColumn(fName: string, index: number, id?: string): void {
        let gObj: IGrid = this.parent;
        let tWidth: number = 0;
        let headerTable: Element;
        let contentTable: Element;
        let footerTable: Element;
        let headerDivTag: string = 'e-gridheader';
        let contentDivTag: string = 'e-gridcontent';
        let footerDivTag: string = 'e-gridfooter';
        let indentWidth: number = 0;
        let uid: string = id ? id : this.parent.getUidByColumnField(fName);
        let columnIndex: number = this.parent.getNormalizedColumnIndex(uid);
        let headerTextClone: Element;
        let contentTextClone: NodeListOf<Element>;
        let footerTextClone: NodeListOf<Element>;
        let columnIndexByField: number = this.parent.getColumnIndexByField(fName);
        let frzCols: number = gObj.getFrozenColumns();
        if (!isNullOrUndefined(gObj.getFooterContent())) {
            footerTable = gObj.getFooterContentTable();
        }
        if (frzCols) {
            if (index < frzCols) {
                headerTable = gObj.getHeaderTable();
                contentTable = gObj.getContentTable();
                headerTextClone = (<HTMLElement>headerTable.querySelector('[e-mappinguid="' + uid + '"]').parentElement.cloneNode(true));
                contentTextClone = contentTable.querySelectorAll(`td:nth-child(${columnIndex + 1})`);
                if (footerTable) {
                    footerTextClone = footerTable.querySelectorAll(`td:nth-child(${columnIndex + 1})`);
                }
            } else {
                headerTable = gObj.getHeaderContent().querySelector('.e-movableheader').children[0];
                contentTable = gObj.getContent().querySelector('.e-movablecontent').children[0];
                headerTextClone = (<HTMLElement>headerTable.querySelector('[e-mappinguid="' + uid + '"]').parentElement.cloneNode(true));
                contentTextClone = contentTable.querySelectorAll(`td:nth-child(${(columnIndex - frzCols) + 1})`);
                if (footerTable) {
                    footerTable = gObj.getFooterContent().querySelector('.e-movablefootercontent').children[0];
                    footerTextClone = footerTable.querySelectorAll(`td:nth-child(${(columnIndex - frzCols) + 1})`);
                }
            }
        } else {
            headerTable = gObj.getHeaderTable();
            contentTable = gObj.getContentTable();
            headerTextClone = (<HTMLElement>headerTable.querySelector('[e-mappinguid="' + uid + '"]').parentElement.cloneNode(true));
            contentTextClone = contentTable.querySelectorAll(`td:nth-child(${columnIndex + 1}):not(.e-groupcaption)`);
            if (footerTable) {
                footerTextClone = footerTable.querySelectorAll(`td:nth-child(${columnIndex + 1}):not(.e-groupcaption)`);
            }
        }
        let indentWidthClone: NodeListOf<Element> = headerTable.querySelector('tr').querySelectorAll('.e-grouptopleftcell');
        if (indentWidthClone.length > 0) {
            for (let i: number = 0; i < indentWidthClone.length; i++) {
                indentWidth += (<HTMLElement>indentWidthClone[i]).offsetWidth;
            }
        }
        let detailsElement: HTMLElement = <HTMLElement>contentTable.querySelector('.e-detailrowcollapse') ||
            <HTMLElement>contentTable.querySelector('.e-detailrowexpand');
        if ((this.parent.detailTemplate || this.parent.childGrid) && detailsElement) {
            indentWidth += detailsElement.offsetWidth;
        }
        let headerText: Element[] = [headerTextClone];
        let contentText: Element[] = [];
        let footerText: Element[] = [];
        if (footerTable) {
            for (let i: number = 0; i < footerTextClone.length; i++) {
                footerText[i] = footerTextClone[i].cloneNode(true) as Element;
            }
        }
        for (let i: number = 0; i < contentTextClone.length; i++) {
            contentText[i] = contentTextClone[i].cloneNode(true) as Element;
        }
        let wHeader: number = this.createTable(headerTable, headerText, headerDivTag);
        let wContent: number = this.createTable(contentTable, contentText, contentDivTag);
        let wFooter: number = null;
        if (footerText.length) {
            wFooter = this.createTable(footerTable, footerText, footerDivTag);
        }
        let columnbyindex: Column = gObj.getColumns()[columnIndexByField];
        let result: Boolean;
        let width: string = columnbyindex.width = formatUnit(Math.max(wHeader, wContent, wFooter));
        let colMaxWidth: number =  columnbyindex.maxWidth && parseFloat(columnbyindex.maxWidth.toString());
        if (parseInt(width, 10) > colMaxWidth) {
            columnbyindex.width = colMaxWidth;
        }
        this.widthService.setColumnWidth(gObj.getColumns()[columnIndexByField] as Column);
        result = gObj.getColumns().some((x: Column) => x.width === null || x.width === undefined || (x.width as string).length <= 0);
        if (result === false) {
            let element: Column[] = (gObj.getColumns() as Column[]);
            for (let i: number = 0; i < element.length; i++) {
                if (element[i].visible) {
                    tWidth = tWidth + parseFloat(element[i].width as string);
                }
            }
        }
        let calcTableWidth: string | number = tWidth + indentWidth;
        if (tWidth > 0 && !gObj.getFrozenColumns()) {
            if (this.parent.detailTemplate || this.parent.childGrid) {
                this.widthService.setColumnWidth(new Column({ width: '30px' }));
            }
            if (this.parent.resizeSettings.mode === 'Auto') {
                calcTableWidth = '100%';
            }
            (<HTMLTableElement>headerTable).style.width = formatUnit(calcTableWidth);
            (<HTMLTableElement>contentTable).style.width = formatUnit(calcTableWidth);
            if (!isNullOrUndefined(footerTable)) {
                (<HTMLTableElement>footerTable).style.width = formatUnit(calcTableWidth);
            }
        }
        let tableWidth: number = (headerTable as HTMLElement).offsetWidth;
        let contentwidth: number = (gObj.getContent().scrollWidth);
        if (contentwidth > tableWidth) {
            headerTable.classList.add('e-tableborder');
            contentTable.classList.add('e-tableborder');
        } else {
            headerTable.classList.remove('e-tableborder');
            contentTable.classList.remove('e-tableborder');
        }
        if (!isNullOrUndefined(footerTable)) {
            footerTable.classList.add('e-tableborder');
        }
    }

    /**
     * To destroy the resize 
     * @return {void}
     * @hidden
     */
    public destroy(): void {
        let gridElement: Element = this.parent.element;
        if (!gridElement || (!gridElement.querySelector('.e-gridheader') && !gridElement.querySelector('.e-gridcontent'))) { return; }
        this.widthService = null;
        this.unwireEvents();
        this.removeEventListener();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'resize';
    }
    private findColumn(fName: string[]): void {
        for (let i: number = 0; i < fName.length; i++) {
            let fieldName: string = fName[i] as string;
            let columnIndex: number = this.parent.getColumnIndexByField(fieldName);
            let column: Column = this.parent.getColumns()[columnIndex];
            if (columnIndex > -1 && !isNullOrUndefined(column) && column.visible === true) {
                this.resizeColumn(fieldName, columnIndex);
            }
        }
    }
    /**
     * To create table for autofit 
     * @hidden
     */
    protected createTable(table: Element, text: Element[], tag: string): number {
        let myTableDiv: HTMLDivElement = this.parent.createElement('div') as HTMLDivElement;
        myTableDiv.className = this.parent.element.className;
        myTableDiv.style.cssText = 'display: inline-block;visibility:hidden;position:absolute';
        let mySubDiv: HTMLDivElement = this.parent.createElement('div') as HTMLDivElement;
        mySubDiv.className = tag;
        let myTable: HTMLTableElement = this.parent.createElement('table') as HTMLTableElement;
        myTable.className = table.className;
        myTable.classList.add('e-resizetable');
        myTable.style.cssText = 'table-layout: auto;width: auto';
        let myTr: HTMLTableRowElement = this.parent.createElement('tr') as HTMLTableRowElement;
        for (let i: number = 0; i < text.length; i++) {
            let tr: HTMLTableRowElement = myTr.cloneNode() as HTMLTableRowElement;
            tr.className = table.querySelector('tr').className;
            tr.appendChild(text[i]);
            myTable.appendChild(tr);
        }
        mySubDiv.appendChild(myTable);
        myTableDiv.appendChild(mySubDiv);
        document.body.appendChild(myTableDiv);
        let offsetWidthValue: number = myTable.getBoundingClientRect().width;
        document.body.removeChild(myTableDiv);
        return Math.ceil(offsetWidthValue);
    }
    /**
     * @hidden
     */
    public addEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.headerRefreshed, this.refreshHeight, this);
        this.parent.on(events.initialEnd, this.wireEvents, this);
        this.parent.on(events.contentReady, this.autoFit, this);
        this.parent.on(events.refreshHandlers, this.refreshHeight, this);
    }
    /**
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.headerRefreshed, this.refreshHeight);
        this.parent.off(events.initialEnd, this.wireEvents);
        this.parent.off(events.refreshHandlers, this.refreshHeight);
    }
    /**
     * @hidden
     */
    public render(): void {
        this.unwireEvents();
        this.wireEvents();
        this.setHandlerHeight();
    }

    private refreshHeight(): void {
        let element: HTMLElement[] = this.getResizeHandlers();
        for (let i: number = 0; i < element.length; i++) {
            if (element[i].parentElement.offsetHeight > 0) {
                element[i].style.height = element[i].parentElement.offsetHeight + 'px';
            }
        }
        this.setHandlerHeight();
    }

    private wireEvents(): void {
        EventHandler.add(this.parent.getHeaderContent(), Browser.touchStartEvent, this.resizeStart, this);
        EventHandler.add(this.parent.getHeaderContent(), events.dblclick, this.callAutoFit, this);
    }

    private unwireEvents(): void {
        EventHandler.remove(this.parent.getHeaderContent(), Browser.touchStartEvent, this.resizeStart);
        EventHandler.remove(this.parent.getHeaderContent(), events.dblclick, this.callAutoFit);
    }

    private getResizeHandlers(): HTMLElement[] {
        return this.parent.getFrozenColumns() ?
            [].slice.call(this.parent.getHeaderContent().querySelectorAll('.' + resizeClassList.root))
            : [].slice.call(this.parent.getHeaderTable().querySelectorAll('.' + resizeClassList.root));
    }

    private setHandlerHeight(): void {
        let element: HTMLElement[] = [].slice.call(this.parent.getHeaderTable().querySelectorAll('.' + resizeClassList.suppress));
        for (let i: number = 0; i < element.length; i++) {
            element[i].style.height = element[i].parentElement.offsetHeight + 'px';
        }
    }

    private callAutoFit(e: PointerEvent | TouchEvent): void {
        if ((e.target as HTMLElement).classList.contains('e-rhandler')) {
            let col: Column = this.getTargetColumn(e);
            if (col.columns) {
                return;
            }
            this.resizeColumn(col.field, this.parent.getNormalizedColumnIndex(col.uid), col.uid);
            let header: HTMLElement = <HTMLElement>closest(<HTMLElement>e.target, resizeClassList.header);
            header.classList.add('e-resized');
        }
    }

    private resizeStart(e: PointerEvent | TouchEvent): void {
        if ((e.target as HTMLElement).classList.contains('e-rhandler')) {
            if (!this.helper) {
                if (this.getScrollBarWidth() === 0) {
                    if (this.parent.allowGrouping) {
                        for (let i: number = 0; i < this.parent.groupSettings.columns.length; i++) {
                            this.widthService.setColumnWidth(new Column({ width: '30px' }), i);
                        }
                    }
                    for (let col of this.refreshColumnWidth()) {
                        this.widthService.setColumnWidth(col);
                    }
                    this.widthService.setWidthToTable();
                }
                this.refreshStackedColumnWidth();
                this.element = e.target as HTMLElement;
                if (this.parent.getVisibleFrozenColumns()) {
                    let mtbody: Element = this.parent.getContent().querySelector('.e-movablecontent').querySelector('tbody');
                    let ftbody: Element = this.parent.getContent().querySelector('.e-frozencontent').querySelector('tbody');
                    let mtr: NodeListOf<HTMLElement> = mtbody.querySelectorAll('tr');
                    let ftr: NodeListOf<HTMLElement> = ftbody.querySelectorAll('tr');
                    for (let i: number = 0; i < mtr.length; i++) {
                        if (this.parent.rowHeight) {
                            mtr[i].style.height = this.parent.rowHeight + 'px';
                            ftr[i].style.height = this.parent.rowHeight + 'px';
                        } else {
                            mtr[i].style.removeProperty('height');
                            ftr[i].style.removeProperty('height');
                        }
                    }
                }
                this.parentElementWidth = this.parent.element.getBoundingClientRect().width;
                this.appendHelper();
                this.column = this.getTargetColumn(e);
                this.pageX = this.getPointX(e);
                if (this.parent.enableRtl) {
                    this.minMove = parseFloat(this.column.width.toString())
                        - (this.column.minWidth ? parseFloat(this.column.minWidth.toString()) : 0);
                } else {
                    this.minMove = (this.column.minWidth ? parseFloat(this.column.minWidth.toString()) : 0)
                        - parseFloat(isNullOrUndefined(this.column.width) ? '' : this.column.width.toString());
                }
                this.minMove += this.pageX;
            }
            if (Browser.isDevice && !this.helper.classList.contains(resizeClassList.icon)) {
                this.helper.classList.add(resizeClassList.icon);
                EventHandler.add(document, Browser.touchStartEvent, this.removeHelper, this);
                EventHandler.add(this.helper, Browser.touchStartEvent, this.resizeStart, this);
            } else {
                let args: ResizeArgs;
                if (!isBlazor() || this.parent.isJsComponent) {
                    args = { e : e, column: this.column };
                } else {
                    let clonedColumn: Column = extend({}, this.column) as Column;
                    args = { column: clonedColumn };
                }
                this.parent.trigger(events.resizeStart, args, (args: ResizeArgs) => {
                    if (args.cancel || this.parent.isEdit) {
                        this.cancelResizeAction();
                        return;
                    }
                    EventHandler.add(document, Browser.touchEndEvent, this.resizeEnd, this);
                    EventHandler.add(this.parent.element, Browser.touchMoveEvent, this.resizing, this);
                    this.updateCursor('add');
                });
            }
        }
    }

    private cancelResizeAction(removeEvents?: boolean): void {
        if (removeEvents) {
            EventHandler.remove(this.parent.element, Browser.touchMoveEvent, this.resizing);
            EventHandler.remove(document, Browser.touchEndEvent, this.resizeEnd);
            this.updateCursor('remove');
        }
        if (Browser.isDevice) {
            EventHandler.remove(document, Browser.touchStartEvent, this.removeHelper);
            EventHandler.remove(this.helper, Browser.touchStartEvent, this.resizeStart);
        }
        detach(this.helper);
        this.refresh();
    }

    private getWidth(width: number, minWidth: number, maxWidth: number): number {
        if (minWidth && width < minWidth) {
            return minWidth;
        } else if ((maxWidth && width > maxWidth)) {
            return maxWidth;
        } else {
            return width;
        }
    }

    private updateResizeEleHeight(): void {
        let elements: HTMLElement[] = [].slice.call(this.parent.getHeaderContent().querySelectorAll('.e-rhandler'));
        for (let i: number = 0; i < elements.length; i++) {
            elements[i].style.height = this.element.parentElement.offsetHeight + 'px';
        }
    }

    private getColData(column: Column, mousemove: number): { [key: string]: number } {
        return {
            width: parseFloat(isNullOrUndefined(this.widthService.getWidth(column)) || this.widthService.getWidth(column) === 'auto'  ? '0'
                : this.widthService.getWidth(column).toString()) + mousemove,
            minWidth: column.minWidth ? parseFloat(column.minWidth.toString()) : null,
            maxWidth: column.maxWidth ? parseFloat(column.maxWidth.toString()) : null
        };
    }

    private resizing(e: PointerEvent | TouchEvent): void {
        if (isNullOrUndefined(this.column)) {
            return;
        }
        let offsetWidth: number = 0;
        if (isNullOrUndefined(this.column)) {
            offsetWidth = (parentsUntil(this.element, 'th') as HTMLTableCellElement).offsetWidth;
        }
        if (this.parent.allowTextWrap) {
            this.updateResizeEleHeight();
            this.setHelperHeight();
        }
        let pageX: number = this.getPointX(e);
        let mousemove: number = this.parent.enableRtl ? -(pageX - this.pageX) : (pageX - this.pageX);
        let colData: { [key: string]: number } = this.getColData(this.column, mousemove);
        if (!colData.width) {
            colData.width = (closest(this.element, 'th') as HTMLElement).offsetWidth;
        }
        let width: number = this.getWidth(colData.width, colData.minWidth, colData.maxWidth);
        this.parent.log('resize_min_max', { column: this.column, width });
        if ((!this.parent.enableRtl && this.minMove >= pageX) || (this.parent.enableRtl && this.minMove <= pageX)) {
            width = this.column.minWidth ? parseFloat(this.column.minWidth.toString()) : 10;
            this.pageX = pageX = this.minMove;
        }
        if (width !== parseFloat(isNullOrUndefined(this.column.width) || this.column.width === 'auto' ?
            offsetWidth.toString() : this.column.width.toString())) {
            this.pageX = pageX;
            this.column.width = formatUnit(width);
            let args: ResizeArgs = {
                e: e,
                column: this.column
            };
            this.parent.trigger(events.onResize, args);
            if (args.cancel) {
                this.cancelResizeAction(true);
                return;
            }
            let columns: Column[] = [this.column];
            let finalColumns: Column[] = [this.column];
            if (this.column.columns) {
                columns = this.getSubColumns(this.column, []);
                columns = this.calulateColumnsWidth(columns, false, mousemove);
                finalColumns = this.calulateColumnsWidth(columns, true, mousemove);
            }
            for (const col of finalColumns) {
                this.widthService.setColumnWidth(col, null, 'resize');
            }
            this.updateHelper();
        }
        this.isDblClk = false;
    }

    private calulateColumnsWidth(columns: Column[], isUpdate: boolean, mousemove: number): Column[] {
        let finalColumns: Column[] = [];
        for (const col of columns) {
            let totalWidth: number = 0;
            for (let i: number = 0; i < columns.length; i++) {
                totalWidth += parseFloat(columns[i].width.toString());
            }
            let colData: { [key: string]: number } = this.getColData(col, (parseFloat(col.width as string)) * mousemove / totalWidth);
            let colWidth: number = this.getWidth(colData.width, colData.minWidth, colData.maxWidth);
            if ((colWidth !== parseFloat(col.width.toString()))) {
                if (isUpdate) {
                    col.width = formatUnit(colWidth < 1 ? 1 : colWidth);
                }
                finalColumns.push(col);
            }
        }
        return finalColumns;
    }

    private getSubColumns(column: Column, subColumns: Column[]): Column[] {
        for (const col of column.columns as Column[]) {
            if (col.visible !== false && col.allowResizing) {
                if (col.columns) {
                    this.getSubColumns(col, subColumns);
                } else {
                    subColumns.push(col);
                }
            }
        }
        return subColumns;
    }

    private resizeEnd(e: PointerEvent): void {
        if (!this.helper || this.parent.isDestroyed) { return; }
        EventHandler.remove(this.parent.element, Browser.touchMoveEvent, this.resizing);
        EventHandler.remove(document, Browser.touchEndEvent, this.resizeEnd);
        this.updateCursor('remove');
        detach(this.helper);
        let args: ResizeArgs;
        if (!isBlazor() || this.parent.isJsComponent) {
            args = { e : e, column: this.column };
        } else {
            let clonedColumn: Column = extend({}, this.column) as Column;
            args = { column: clonedColumn };
        }
        let content: HTMLElement = this.parent.getContent().querySelector('.e-content');
        let cTable: HTMLElement = content.querySelector('.e-movablecontent') ? content.querySelector('.e-movablecontent') : content;
        if (cTable.scrollHeight > cTable.clientHeight) {
            this.parent.scrollModule.setPadding();
            cTable.style.overflowY = 'scroll';
        }
        this.parent.trigger(events.resizeStop, args);
        closest(this.element, '.e-headercell').classList.add('e-resized');
        if (parentsUntil(this.element, 'e-frozenheader')) {
            this.isFrozenColResized = true;
        } else {
            this.isFrozenColResized = false;
        }
        if (this.parent.getFrozenColumns()) {
            this.parent.notify(events.freezeRender, { case: 'textwrap' });
        }
        if (this.parent.allowTextWrap) {
            this.updateResizeEleHeight();
            this.parent.notify(events.textWrapRefresh, { case: 'textwrap' });
        }
        this.refresh();
        this.doubleTapEvent(e);
        this.isDblClk = true;
    }

    private getPointX(e: PointerEvent | TouchEvent): number {
        if ((e as TouchEvent).touches && (e as TouchEvent).touches.length) {
            return (e as TouchEvent).touches[0].pageX;
        } else {
            return (e as PointerEvent).pageX;
        }
    }

    private refreshColumnWidth(): Column[] {
        let columns: Column[] = this.parent.getColumns();
        for (let ele of [].slice.apply(this.parent.getHeaderContent().querySelectorAll('th.e-headercell'))) {
            for (let column of columns) {
                if (ele.querySelector('[e-mappinguid]') &&
                    ele.querySelector('[e-mappinguid]').getAttribute('e-mappinguid') === column.uid && column.visible) {
                    column.width = ele.getBoundingClientRect().width;
                    break;
                }
            }
        }
        return columns;
    }

    private refreshStackedColumnWidth(): void {
        for (const stackedColumn of this.parent.getStackedColumns(this.parent.columns as Column[])) {
            stackedColumn.width = this.getStackedWidth(stackedColumn, 0);
        }
    }

    private getStackedWidth(column: Column, width: number): number {
        for (const col of column.columns as Column[]) {
            if (col.visible !== false) {
                if (col.columns) {
                    this.getStackedWidth(col, width);
                } else {
                    width += col.width as number;
                }
            }
        }
        return width;
    }

    private getTargetColumn(e: PointerEvent | TouchEvent): Column {
        let cell: HTMLElement = <HTMLElement>closest(<HTMLElement>e.target, resizeClassList.header);
        cell = cell.querySelector('.e-headercelldiv') || cell.querySelector('.e-stackedheadercelldiv');
        let uid: string = cell.getAttribute('e-mappinguid');
        return this.parent.getColumnByUid(uid);
    }

    private updateCursor(action: string): void {
        let headerRows: Element[] = [].slice.call(this.parent.getHeaderContent().querySelectorAll('th'));
        headerRows.push(this.parent.element);
        for (let row of headerRows) {
            row.classList[action](resizeClassList.cursor);
        }
    }

    private refresh(): void {
        this.column = null;
        this.pageX = null;
        this.element = null;
        this.helper = null;
    }

    private appendHelper(): void {
        this.helper = this.parent.createElement('div', {
            className: resizeClassList.helper
        });
        this.parent.element.appendChild(this.helper);
        this.setHelperHeight();
    }

    private setHelperHeight(): void {
        let height: number = (<HTMLElement>this.parent.getContent()).offsetHeight - this.getScrollBarWidth();
        let rect: HTMLElement = closest(this.element, resizeClassList.header) as HTMLElement;
        let tr: HTMLElement[] = [].slice.call(this.parent.getHeaderContent().querySelectorAll('tr'));
        let frzCols: number = this.parent.getFrozenColumns();
        if (frzCols) {
            if (rect.parentElement.children.length !== frzCols) {
                tr.splice(0, tr.length / 2);
            } else {
                tr.splice(tr.length / 2, tr.length / 2);
            }
        }
        for (let i: number = tr.indexOf(rect.parentElement); i < tr.length && i > -1; i++) {
            height += tr[i].offsetHeight;
        }
        let pos: OffsetPosition = this.calcPos(rect);
        pos.left += (this.parent.enableRtl ? 0 - 1 : rect.offsetWidth - 2);
        this.helper.style.cssText = 'height: ' + height + 'px; top: ' + pos.top + 'px; left:' + Math.floor(pos.left) + 'px;';
    }

    private getScrollBarWidth(height?: boolean): number {
        let ele: HTMLElement = this.parent.getFrozenColumns() ? this.parent.getContent().querySelector('.e-movablecontent') as HTMLElement
            : this.parent.getContent().firstChild as HTMLElement;
        return (ele.scrollHeight > ele.clientHeight && height) ||
            ele.scrollWidth > ele.clientWidth ? getScrollBarWidth() : 0;
    }

    private removeHelper(e: MouseEvent): void {
        let cls: DOMTokenList = (e.target as HTMLElement).classList;
        if (!(cls.contains(resizeClassList.root) || cls.contains(resizeClassList.icon)) && this.helper) {
            EventHandler.remove(document, Browser.touchStartEvent, this.removeHelper);
            EventHandler.remove(this.helper, Browser.touchStartEvent, this.resizeStart);
            detach(this.helper);
            this.refresh();
        }
    }

    private updateHelper(): void {
        let rect: HTMLElement = closest(this.element, resizeClassList.header) as HTMLElement;
        let left: number = Math.floor(this.calcPos(rect).left + (this.parent.enableRtl ? 0 - 1 : rect.offsetWidth - 2));
        let borderWidth: number = 2; // to maintain the helper inside of grid element.
        if (left > this.parentElementWidth) {
            left = this.parentElementWidth - borderWidth;
        }
        if (this.parent.getFrozenColumns()) {
            let table: HTMLElement = closest(rect, '.e-table') as HTMLElement;
            let fLeft: number = table.offsetLeft;
            if (left < fLeft) {
                left = fLeft;
            }
        }
        this.helper.style.left = left + 'px';
    }

    private calcPos(elem: HTMLElement): OffsetPosition {
        let parentOffset: OffsetPosition = {
            top: 0,
            left: 0
        };
        let offset: OffsetPosition = elem.getBoundingClientRect();
        let doc: Document = elem.ownerDocument;
        let offsetParent: Node = parentsUntil(elem, 'e-grid') || doc.documentElement;
        while (offsetParent &&
            (offsetParent === doc.body || offsetParent === doc.documentElement) &&
            (<HTMLElement>offsetParent).style.position === 'static') {
            offsetParent = offsetParent.parentNode;
        }
        if (offsetParent && offsetParent !== elem && offsetParent.nodeType === 1) {
            parentOffset = (<HTMLElement>offsetParent).getBoundingClientRect();
        }
        return {
            top: offset.top - parentOffset.top,
            left: offset.left - parentOffset.left
        };
    }

    private doubleTapEvent(e: TouchEvent | PointerEvent): void {
        if (this.getUserAgent() && this.isDblClk) {
            if (!this.tapped) {
                this.tapped = setTimeout(this.timeoutHandler(), 300);
            } else {
                clearTimeout(this.tapped as number);
                this.callAutoFit(e);
                this.tapped = null;
            }
        }
    }

    private getUserAgent(): boolean {
        let userAgent: string = Browser.userAgent.toLowerCase();
        return (/iphone|ipod|ipad/ as RegExp).test(userAgent);
    }

    private timeoutHandler(): void {
        this.tapped = null;
    }
}