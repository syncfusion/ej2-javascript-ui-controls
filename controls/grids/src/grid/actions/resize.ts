import { EventHandler, detach, formatUnit, Browser, closest } from '@syncfusion/ej2-base';
import { Column } from '../models/column';
import { IGrid, IAction, ResizeArgs } from '../base/interface';
import { ColumnWidthService } from '../services/width-controller';
import * as events from '../base/constant';
import { freezeTable } from '../base/enum';
import { getScrollBarWidth, parentsUntil, gridActionHandler, Global } from '../base/util';
import { OffsetPosition } from '@syncfusion/ej2-popups';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import * as literals from '../base/string-literals';

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
 *
 * @hidden
 * @private
 */
export class Resize implements IAction {
    //Internal variable
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
     *
     * @param {IGrid} parent - specifies the IGrid
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
     *
     * @param  {string|string[]} fName - Defines the field name.
     * @returns {void}
     */
    public autoFitColumns(fName?: string | string[]): void {
        const columnName: string[] = (fName === undefined || fName === null || fName.length <= 0) ?
            this.parent.getColumns().map((x: Column) => x.field) : (typeof fName === 'string') ? [fName] : fName;
        this.findColumn(columnName);
    }

    private autoFit(): void {
        const newarray: string[] = this.parent.getColumns().filter((c: Column) => c.autoFit === true)
            .map((c: Column) => c.field || c.headerText);
        if (newarray.length > 0) {
            this.autoFitColumns(newarray);
        }
        if (this.parent.resizeSettings.mode === 'Auto') {
            this.widthService.setWidthToTable();
        }
    }

    private resizeColumn(fName: string, index: number, id?: string): void {
        const gObj: IGrid = this.parent;
        let tWidth: number = 0;
        let headerTable: Element;
        let contentTable: Element;
        let footerTable: Element;
        const headerDivTag: string = 'e-gridheader';
        const contentDivTag: string =  literals.gridContent;
        const footerDivTag: string = literals.gridFooter;
        let indentWidth: number = 0;
        const uid: string = id ? id : this.parent.getUidByColumnField(fName);
        const columnIndex: number = this.parent.getNormalizedColumnIndex(uid);
        let headerTextClone: Element;
        let contentTextClone: NodeListOf<Element>;
        let footerTextClone: NodeListOf<Element>;
        const columnIndexByField: number = this.parent.getColumnIndexByField(fName);
        const left: number = gObj.getFrozenColumns() || gObj.getFrozenLeftColumnsCount();
        const movable: number = gObj.getMovableColumnsCount();
        if (!isNullOrUndefined(gObj.getFooterContent())) {
            footerTable = gObj.getFooterContentTable();
        }
        if (gObj.isFrozenGrid()) {
            const col: Column = gObj.getColumnByField(fName);
            if (col.getFreezeTableName() === literals.frozenLeft) {
                headerTable = gObj.getHeaderTable();
                contentTable = gObj.getContentTable();
                headerTextClone = (<HTMLElement>headerTable.querySelector('[e-mappinguid="' + uid + '"]').parentElement.cloneNode(true));
                contentTextClone = contentTable.querySelectorAll(`td:nth-child(${columnIndex + 1})`);
                if (footerTable) {
                    footerTextClone = footerTable.querySelectorAll(`td:nth-child(${columnIndex + 1})`);
                }
            } else if (col.getFreezeTableName() === 'movable') {
                headerTable = gObj.getHeaderContent().querySelector('.' + literals.movableHeader).children[0];
                contentTable = gObj.getContent().querySelector('.' + literals.movableContent).children[0];
                headerTextClone = (<HTMLElement>headerTable.querySelector('[e-mappinguid="' + uid + '"]').parentElement.cloneNode(true));
                contentTextClone = contentTable.querySelectorAll(`td:nth-child(${(columnIndex - left) + 1})`);
                if (footerTable) {
                    footerTable = gObj.getFooterContent().querySelector('.e-movablefootercontent').children[0];
                    footerTextClone = footerTable.querySelectorAll(`td:nth-child(${(columnIndex - left) + 1})`);
                }
            } else if (col.getFreezeTableName() === literals.frozenRight) {
                headerTable = gObj.getHeaderContent().querySelector('.e-frozen-right-header').children[0];
                contentTable = gObj.getContent().querySelector('.e-frozen-right-content').children[0];
                headerTextClone = (<HTMLElement>headerTable.querySelector('[e-mappinguid="' + uid + '"]').parentElement.cloneNode(true));
                contentTextClone = contentTable.querySelectorAll(`td:nth-child(${(columnIndex - (left + movable)) + 1})`);
                if (footerTable) {
                    footerTable = gObj.getFooterContent().querySelector('.e-movablefootercontent').children[0];
                    footerTextClone = footerTable.querySelectorAll(`td:nth-child(${(columnIndex - (left + movable)) + 1})`);
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
        const indentWidthClone: NodeListOf<Element> = [].slice.call(headerTable.querySelector('tr').getElementsByClassName('e-grouptopleftcell'));
        if (indentWidthClone.length > 0) {
            for (let i: number = 0; i < indentWidthClone.length; i++) {
                indentWidth += (<HTMLElement>indentWidthClone[i]).offsetWidth;
            }
        }
        const detailsElement: HTMLElement = <HTMLElement>contentTable.querySelector('.e-detailrowcollapse') ||
            <HTMLElement>contentTable.querySelector('.e-detailrowexpand');
        if ((this.parent.detailTemplate || this.parent.childGrid) && detailsElement) {
            indentWidth += detailsElement.offsetWidth;
        }
        const headerText: Element[] = [headerTextClone];
        const contentText: Element[] = [];
        const footerText: Element[] = [];
        if (footerTable) {
            for (let i: number = 0; i < footerTextClone.length; i++) {
                footerText[i] = footerTextClone[i].cloneNode(true) as Element;
            }
        }
        for (let i: number = 0; i < contentTextClone.length; i++) {
            contentText[i] = contentTextClone[i].cloneNode(true) as Element;
        }
        const wHeader: number = this.createTable(headerTable, headerText, headerDivTag);
        let wFooter: number = null;
        let wContent: number = null;
        if (gObj.getCurrentViewRecords().length) {
            wContent = this.createTable(contentTable, contentText, contentDivTag);
        }
        if (footerText.length) {
            wFooter = this.createTable(footerTable, footerText, footerDivTag);
        }
        const columnbyindex: Column = gObj.getColumns()[columnIndexByField];
        const width: string = columnbyindex.width = formatUnit(Math.max(wHeader, wContent, wFooter));
        const colMaxWidth: number =  columnbyindex.maxWidth && parseFloat(columnbyindex.maxWidth.toString());
        if (parseInt(width, 10) > colMaxWidth) {
            columnbyindex.width = colMaxWidth;
        }
        this.widthService.setColumnWidth(gObj.getColumns()[columnIndexByField] as Column);
        const result: boolean = gObj.getColumns().some((x: Column) => x.width === null
            || x.width === undefined || (x.width as string).length <= 0);
        if (result === false) {
            const element: Column[] = (gObj.getColumns() as Column[]);
            for (let i: number = 0; i < element.length; i++) {
                if (element[i].visible) {
                    tWidth = tWidth + parseFloat(element[i].width as string);
                }
            }
        }
        let calcTableWidth: string | number = tWidth + indentWidth;
        if (tWidth > 0 && !gObj.isFrozenGrid()) {
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
        if (gObj.isFrozenGrid()) {
            this.widthService.refreshFrozenScrollbar();
        }
        const tableWidth: number = (headerTable as HTMLElement).offsetWidth;
        const contentwidth: number = (gObj.getContent().scrollWidth);
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
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        const gridElement: Element = this.parent.element;
        if (!gridElement || (!gridElement.querySelector('.' + literals.gridHeader) && !gridElement.querySelector( '.' + literals.gridContent))) { return; }
        this.widthService = null;
        this.unwireEvents();
        this.removeEventListener();
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {string} returns the module name
     * @private
     */
    protected getModuleName(): string {
        return 'resize';
    }

    private findColumn(fName: string[]): void {
        for (let i: number = 0; i < fName.length; i++) {
            const fieldName: string = fName[i] as string;
            const columnIndex: number = this.parent.getColumnIndexByField(fieldName);
            const column: Column = this.parent.getColumns()[columnIndex];
            if (columnIndex > -1 && !isNullOrUndefined(column) && column.visible === true) {
                this.resizeColumn(fieldName, columnIndex);
            }
        }
    }

    /**
     * To create table for autofit
     *
     * @param {Element} table - specifies the table
     * @param {Element[]} text - specifies the text
     * @param {string} tag - specifies the tag name
     * @returns {number} returns the number
     * @hidden
     */
    protected createTable(table: Element, text: Element[], tag: string): number {
        const myTableDiv: HTMLDivElement = this.parent.createElement('div') as HTMLDivElement;
        myTableDiv.className = this.parent.element.className;
        myTableDiv.style.cssText = 'display: inline-block;visibility:hidden;position:absolute';
        const mySubDiv: HTMLDivElement = this.parent.createElement('div') as HTMLDivElement;
        mySubDiv.className = tag;
        const myTable: HTMLTableElement = this.parent.createElement('table') as HTMLTableElement;
        myTable.className = table.className;
        myTable.classList.add('e-resizetable');
        myTable.style.cssText = 'table-layout: auto;width: auto';
        const myTr: HTMLTableRowElement = this.parent.createElement('tr') as HTMLTableRowElement;
        for (let i: number = 0; i < text.length; i++) {
            const tr: HTMLTableRowElement = myTr.cloneNode() as HTMLTableRowElement;
            tr.className = table.querySelector('tr').className;
            tr.appendChild(text[i]);
            myTable.appendChild(tr);
        }
        mySubDiv.appendChild(myTable);
        myTableDiv.appendChild(mySubDiv);
        document.body.appendChild(myTableDiv);
        const offsetWidthValue: number = myTable.getBoundingClientRect().width;
        document.body.removeChild(myTableDiv);
        return Math.ceil(offsetWidthValue);
    }

    /**
     * @returns {void}
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
        this.parent.on(events.destroy, this.destroy, this);
    }

    /**
     * @returns {void}
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.headerRefreshed, this.refreshHeight);
        this.parent.off(events.initialEnd, this.wireEvents);
        this.parent.off(events.refreshHandlers, this.refreshHeight);
        this.parent.off(events.destroy, this.destroy);
    }

    /**
     * @returns {void}
     * @hidden
     */
    public render(): void {
        this.unwireEvents();
        this.wireEvents();
        this.setHandlerHeight();
    }

    private refreshHeight(): void {
        if (this.parent.getHeaderTable()) {
            const element: HTMLElement[] = this.getResizeHandlers();
            for (let i: number = 0; i < element.length; i++) {
                if (element[i].parentElement.offsetHeight > 0) {
                    element[i].style.height = element[i].parentElement.offsetHeight + 'px';
                }
            }
            this.setHandlerHeight();
        }
    }

    private wireEvents(): void {
        EventHandler.add(this.parent.getHeaderContent(), Browser.touchStartEvent, this.touchResizeStart, this);
        EventHandler.add(this.parent.getHeaderContent(), events.dblclick, this.callAutoFit, this);
    }

    private unwireEvents(): void {
        EventHandler.remove(this.parent.getHeaderContent(), Browser.touchStartEvent, this.touchResizeStart);
        EventHandler.remove(this.parent.getHeaderContent(), events.dblclick, this.callAutoFit);
    }

    private getResizeHandlers(): HTMLElement[] {
        return this.parent.isFrozenGrid() ?
            [].slice.call(this.parent.getHeaderContent().getElementsByClassName(resizeClassList.root))
            : [].slice.call(this.parent.getHeaderTable().getElementsByClassName(resizeClassList.root));
    }

    private setHandlerHeight(): void {
        const element: HTMLElement[] = [].slice.call(this.parent.getHeaderTable().getElementsByClassName(resizeClassList.suppress));
        for (let i: number = 0; i < element.length; i++) {
            element[i].style.height = element[i].parentElement.offsetHeight + 'px';
        }
    }

    private callAutoFit(e: PointerEvent | TouchEvent): void {
        if ((e.target as HTMLElement).classList.contains('e-rhandler')) {
            const col: Column = this.getTargetColumn(e);
            if (col.columns) {
                return;
            }
            this.resizeColumn(col.field, this.parent.getNormalizedColumnIndex(col.uid), col.uid);
            const header: HTMLElement = <HTMLElement>closest(<HTMLElement>e.target, resizeClassList.header);
            header.classList.add('e-resized');
        }
    }

    private touchResizeStart(e: PointerEvent | TouchEvent): void {
        if (!Global.timer) {
            Global.timer = (setTimeout(
                () => {
                    Global.timer = null;
                },
                300) as Object);
            return this.resizeStart(e);
        } else {
            clearTimeout(Global.timer as number);
            Global.timer = null;
            this.callAutoFit(e);
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
                    for (const col of this.refreshColumnWidth()) {
                        this.widthService.setColumnWidth(col);
                    }
                    this.widthService.setWidthToTable();
                }
                this.refreshStackedColumnWidth();
                this.element = e.target as HTMLElement;
                if (this.parent.getVisibleFrozenColumns()) {
                    const mtbody: Element = this.parent.getMovableContentTbody();
                    const ftbody: Element = this.parent.getFrozenLeftContentTbody();
                    const frtbody: Element = this.parent.getFrozenRightContentTbody();
                    const mtr: Element[] = [].slice.call(mtbody.querySelectorAll('tr'));
                    const ftr: Element[] = [].slice.call(ftbody.querySelectorAll('tr'));
                    let frTr: HTMLElement[] = [];
                    if (this.parent.getFrozenMode() === literals.leftRight && frtbody) {
                        frTr = [].slice.call(frtbody.querySelectorAll('tr'));
                    }
                    for (let i: number = 0; i < mtr.length; i++) {
                        gridActionHandler(
                            this.parent,
                            (tableName: freezeTable, row: Element) => {
                                if (this.parent.rowHeight) {
                                    row[i].style.height = this.parent.rowHeight + 'px';
                                } else {
                                    row[i].style.removeProperty('height');
                                }
                            },
                            [ftr, mtr, frTr]
                        );
                    }
                }
                this.parentElementWidth = this.parent.element.getBoundingClientRect().width;
                this.appendHelper();
                this.column = this.getTargetColumn(e);
                this.pageX = this.getPointX(e);
                if (this.column.getFreezeTableName() === literals.frozenRight) {
                    if (this.parent.enableRtl) {
                        this.minMove = (this.column.minWidth ? parseFloat(this.column.minWidth.toString()) : 0)
                            - parseFloat(isNullOrUndefined(this.column.width) ? '' : this.column.width.toString());
                    } else {
                        this.minMove = parseFloat(isNullOrUndefined(this.column.width) ? '' : this.column.width.toString())
                            - (this.column.minWidth ? parseFloat(this.column.minWidth.toString()) : 0);
                    }
                } else if (this.parent.enableRtl) {
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
                const args: ResizeArgs = { e : e, column: this.column };
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
        const elements: HTMLElement[] = [].slice.call(this.parent.getHeaderContent().getElementsByClassName('e-rhandler'));
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
        if (this.column.getFreezeTableName() === literals.frozenRight) {
            mousemove = this.parent.enableRtl ? (pageX - this.pageX) : (this.pageX - pageX);
        }
        const colData: { [key: string]: number } = this.getColData(this.column, mousemove);
        if (!colData.width) {
            colData.width = (closest(this.element, 'th') as HTMLElement).offsetWidth;
        }
        let width: number = this.getWidth(colData.width, colData.minWidth, colData.maxWidth);
        this.parent.log('resize_min_max', { column: this.column, width });
        if (this.column.getFreezeTableName() === literals.frozenRight) {
            if ((this.parent.enableRtl && this.minMove >= pageX) || (!this.parent.enableRtl && this.minMove <= pageX)) {
                width = this.column.minWidth ? parseFloat(this.column.minWidth.toString()) : 10;
                this.pageX = pageX = this.minMove;
            }
        }
        if ((this.column.getFreezeTableName() !== literals.frozenRight
            && ((!this.parent.enableRtl && this.minMove >= pageX) || (this.parent.enableRtl && this.minMove <= pageX)))
            || (this.column.getFreezeTableName() === literals.frozenRight && ((this.parent.enableRtl && this.minMove >= pageX)
                || (!this.parent.enableRtl && this.minMove <= pageX)))) {
            width = this.column.minWidth ? parseFloat(this.column.minWidth.toString()) : 10;
            this.pageX = pageX = this.minMove;
        }
        if (width !== parseFloat(isNullOrUndefined(this.column.width) || this.column.width === 'auto' ?
            offsetWidth.toString() : this.column.width.toString())) {
            this.pageX = pageX;
            this.column.width = formatUnit(width);
            const args: ResizeArgs = {
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
        const finalColumns: Column[] = [];
        for (const col of columns) {
            let totalWidth: number = 0;
            for (let i: number = 0; i < columns.length; i++) {
                totalWidth += parseFloat(columns[i].width.toString());
            }
            const colData: { [key: string]: number } = this.getColData(col, (parseFloat(col.width as string)) * mousemove / totalWidth);
            const colWidth: number = this.getWidth(colData.width, colData.minWidth, colData.maxWidth);
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
        const args: ResizeArgs = { e : e, column: this.column };
        const content: HTMLElement = this.parent.getContent().querySelector('.' + literals.content);
        const cTable: HTMLElement = content.querySelector('.' + literals.movableContent) ? content.querySelector('.' + literals.movableContent) : content;
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
        if (this.parent.isFrozenGrid()) {
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
        const columns: Column[] = this.parent.getColumns();
        for (const ele of [].slice.apply(this.parent.getHeaderContent().querySelectorAll('th.e-headercell'))) {
            for (const column of columns) {
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
        const uid: string = cell.getAttribute('e-mappinguid');
        return this.parent.getColumnByUid(uid);
    }

    private updateCursor(action: string): void {
        const headerRows: Element[] = [].slice.call(this.parent.getHeaderContent().querySelectorAll('th'));
        headerRows.push(this.parent.element);
        for (const row of headerRows) {
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
        const isFrozen: boolean = this.parent.isFrozenGrid();
        let height: number = isFrozen ? (<HTMLElement>this.parent.getContent().querySelector('.' + literals.content)).offsetHeight
            : (<HTMLElement>this.parent.getContent()).offsetHeight - this.getScrollBarWidth();
        const rect: HTMLElement = closest(this.element, resizeClassList.header) as HTMLElement;
        let tr: HTMLElement[] = [].slice.call(this.parent.getHeaderContent().querySelectorAll('tr'));
        const right: number = this.parent.getFrozenRightColumnsCount();
        if (isFrozen) {
            if (parentsUntil(rect, literals.movableHeader)) {
                tr = [].slice.call(this.parent.getHeaderContent().querySelector('.' + literals.movableHeader).querySelectorAll('tr'));
            } else if (right && parentsUntil(rect, 'e-frozen-right-header')) {
                tr = [].slice.call(this.parent.getHeaderContent().querySelector('.e-frozen-right-header').querySelectorAll('tr'));
            } else {
                tr = [].slice.call(this.parent.getHeaderContent().querySelector('.e-frozen-left-header').querySelectorAll('tr'));
            }
        }
        for (let i: number = tr.indexOf(rect.parentElement); i < tr.length && i > -1; i++) {
            height += tr[i].offsetHeight;
        }
        const pos: OffsetPosition = this.calcPos(rect);
        if (parentsUntil(rect, 'e-frozen-right-header')) {
            pos.left += (this.parent.enableRtl ? rect.offsetWidth - 2 : 0 - 1);
        } else {
            pos.left += (this.parent.enableRtl ? 0 - 1 : rect.offsetWidth - 2);
        }
        this.helper.style.cssText = 'height: ' + height + 'px; top: ' + pos.top + 'px; left:' + Math.floor(pos.left) + 'px;';
        if (this.parent.enableVirtualization) {
            this.helper.classList.add('e-virtual-rhandler');
        }
    }

    private getScrollBarWidth(height?: boolean): number {
        const ele: HTMLElement = this.parent.getContent().firstChild as HTMLElement;
        return (ele.scrollHeight > ele.clientHeight && height) ||
            ele.scrollWidth > ele.clientWidth ? getScrollBarWidth() : 0;
    }

    private removeHelper(e: MouseEvent): void {
        const cls: DOMTokenList = (e.target as HTMLElement).classList;
        if (!(cls.contains(resizeClassList.root) || cls.contains(resizeClassList.icon)) && this.helper) {
            EventHandler.remove(document, Browser.touchStartEvent, this.removeHelper);
            EventHandler.remove(this.helper, Browser.touchStartEvent, this.resizeStart);
            detach(this.helper);
            this.refresh();
        }
    }

    private updateHelper(): void {
        const rect: HTMLElement = closest(this.element, resizeClassList.header) as HTMLElement;
        let left: number;
        if (parentsUntil(rect, 'e-frozen-right-header')) {
            left = Math.floor(this.calcPos(rect).left + (this.parent.enableRtl ? rect.offsetWidth - 2 : 0 - 1));
        } else {
            left = Math.floor(this.calcPos(rect).left + (this.parent.enableRtl ? 0 - 1 : rect.offsetWidth - 2));
        }
        const borderWidth: number = 2; // to maintain the helper inside of grid element.
        if (left > this.parentElementWidth) {
            left = this.parentElementWidth - borderWidth;
        }
        if (this.parent.isFrozenGrid()) {
            const table: HTMLElement = closest(rect, '.' + literals.table) as HTMLElement;
            const fLeft: number = table.offsetLeft;
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
        const offset: OffsetPosition = elem.getBoundingClientRect();
        const doc: Document = elem.ownerDocument;
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
                this.tapped = setTimeout(
                    () => {
                        this.tapped = null;
                    },
                    300);
            } else {
                clearTimeout(this.tapped as number);
                this.callAutoFit(e);
                this.tapped = null;
            }
        }
    }

    private getUserAgent(): boolean {
        const userAgent: string = Browser.userAgent.toLowerCase();
        return (/iphone|ipod|ipad/ as RegExp).test(userAgent);
    }

    private timeoutHandler(): void {
        this.tapped = null;
    }
}
