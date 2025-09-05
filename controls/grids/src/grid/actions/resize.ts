import { EventHandler, detach, formatUnit, Browser, closest } from '@syncfusion/ej2-base';
import { Column } from '../models/column';
import { IGrid, IAction, ResizeArgs, DistributeColWidth } from '../base/interface';
import { ColumnWidthService } from '../services/width-controller';
import * as events from '../base/constant';
import { getScrollBarWidth, parentsUntil, Global, frozenDirection, isChildColumn, applyStickyLeftRightPosition, groupCaptionRowLeftRightPos, addStickyColumnPosition } from '../base/util';
import { OffsetPosition } from '@syncfusion/ej2-popups';
import { isNullOrUndefined, addClass, removeClass } from '@syncfusion/ej2-base';
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
    /** @hidden */
    public resizeProcess: boolean = false;
    //Module declarations
    private parent: IGrid;
    private widthService: ColumnWidthService;
    private isCancelAutoFit: boolean = false;
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
     * @param  {number} startRowIndex - Specifies the start row index.
     * @param  {number} endRowIndex - Specifies the end row index.
     * @returns {void}
     */
    public autoFitColumns(fName?: string | string[], startRowIndex?: number, endRowIndex?: number): void {
        const columnName: string[] = (fName === undefined || fName === null || fName.length <= 0) ?
            this.parent.getColumns().map((x: Column) => {x.autoFit = true; return x.field; }) : (typeof fName === 'string') ? [fName] : fName;
        this.parent.isAutoFitColumns = true;
        if (!isNullOrUndefined(fName) && typeof fName === 'object' && fName.length !== 0 )
        {
            fName.forEach((field: string) => {
                if (this.parent.getColumnByField(field)){
                    this.parent.getColumnByField(field).autoFit = true;
                }
            });
        } else if (typeof fName === 'string' && fName.trim() !== '') {
            this.parent.getColumnByField(fName).autoFit = true;
        }
        if (this.parent.enableAdaptiveUI) {
            this.parent.element.classList.add('e-grid-autofit');
        }
        this.findColumn(columnName, startRowIndex, endRowIndex);
    }

    private autoFit(): void {
        const cols: Column[] = this.parent.getColumns();
        let isMaxWidthCount: number = 0;
        const newarray: string[] = cols.filter((c: Column) => {
            if (!isNullOrUndefined(c.maxWidth)) {
                isMaxWidthCount++;
            }
            return c.autoFit === true;
        }).map((c: Column) => c.field || c.headerText);
        if (newarray.length > 0 && !this.parent.preventAutoFit) {
            this.autoFitColumns(newarray);
        }
        const contentTable: HTMLElement = this.parent.getContentTable() as HTMLElement;
        if (this.parent.allowResizing && isMaxWidthCount && (this.parent.resizeSettings.mode === 'Auto' ||
            (this.parent.resizeSettings.mode === 'Normal' && !this.parent.autoFit && newarray.length === 0))) {
            this.widthService.setWidthToTable(contentTable.style.width.indexOf('px') === -1);
        } else if (this.parent.autoFit && this.parent.resizeSettings.mode === 'Auto') {
            this.widthService.setWidthToTable();
        }
        if (contentTable.style.width.indexOf('px') !== -1
            && contentTable.getBoundingClientRect().width < contentTable.parentElement.clientWidth) {
            addClass([this.parent.getHeaderTable(), contentTable], ['e-tableborder']);
        }
    }

    private getCellElementsByColumnIndex(columnIndex: number): HTMLTableCellElement[] {
        if (this.parent.frozenRows) {
            return [].slice.call(this.parent.getHeaderTable().querySelectorAll(
                `td.e-rowcell:nth-child(${columnIndex + 1}):not(.e-groupcaption):not(.e-detailcell)`)).concat(
                [].slice.call(this.parent.getContentTable().querySelectorAll(
                    `td.e-rowcell:nth-child(${columnIndex + 1}):not(.e-groupcaption):not(.e-detailcell)`)));
        } else {
            return [].slice.call(this.parent.getContentTable().querySelectorAll(
                `td.e-rowcell:nth-child(${columnIndex + 1}):not(.e-groupcaption):not(.e-detailcell)`));
        }
    }

    private resizeColumn(fName: string, index: number, id?: string, startRowIndex?: number, endRowIndex?: number): void {
        const gObj: IGrid = this.parent;
        let tWidth: number = 0;
        const headerTable: Element = gObj.getHeaderTable();
        const contentTable: Element = gObj.getContentTable();
        let footerTable: Element;
        const headerDivTag: string = 'e-gridheader';
        const contentDivTag: string =  literals.gridContent;
        const footerDivTag: string = literals.gridFooter;
        let indentWidth: number = 0;
        const uid: string = id ? id : this.parent.getUidByColumnField(fName);
        const columnIndex: number = this.parent.getNormalizedColumnIndex(uid);
        const headerTextClone: Element = (<HTMLElement>headerTable.querySelector('[data-mappinguid="' + uid + '"]').parentElement.cloneNode(true));
        const contentTextClone: HTMLTableCellElement[] = this.getCellElementsByColumnIndex(columnIndex);
        let footerTextClone: NodeListOf<Element>;
        const columnIndexByField: number = this.parent.getColumnIndexByField(fName);
        if (!isNullOrUndefined(gObj.getFooterContent())) {
            footerTable = gObj.getFooterContentTable();
        }
        if (footerTable) {
            footerTextClone = footerTable.querySelectorAll(`td:nth-child(${columnIndex + 1}):not(.e-groupcaption)`);
        }
        const indentWidthClone: NodeListOf<Element> = [].slice.call(headerTable.querySelector('tr').getElementsByClassName('e-grouptopleftcell'));
        if (indentWidthClone.length > 0) {
            for (let i: number = 0; i < indentWidthClone.length; i++) {
                indentWidth += (<HTMLElement>indentWidthClone[parseInt(i.toString(), 10)]).offsetWidth;
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
                footerText[parseInt(i.toString(), 10)] = footerTextClone[parseInt(i.toString(), 10)].cloneNode(true) as Element;
            }
        }
        for (let i: number = 0; i < contentTextClone.length; i++) {
            contentText[parseInt(i.toString(), 10)] = contentTextClone[parseInt(i.toString(), 10)].cloneNode(true) as Element;
        }
        const wHeader: number = this.createTable(headerTable, headerText, headerDivTag);
        let wFooter: number = null;
        let wContent: number = null;
        if (gObj.getCurrentViewRecords().length) {
            wContent = this.createTable(contentTable, contentText, contentDivTag, startRowIndex, endRowIndex);
        }
        if (footerText.length) {
            wFooter = this.createTable(footerTable, footerText, footerDivTag);
        }
        const columnbyindex: Column = gObj.getColumns()[parseInt(columnIndexByField.toString(), 10)];
        const width: string = columnbyindex.width = formatUnit(Math.max(wHeader, wContent, wFooter));
        const colMaxWidth: number =  columnbyindex.maxWidth && parseFloat(columnbyindex.maxWidth.toString());
        if (parseInt(width, 10) > colMaxWidth) {
            columnbyindex.width = colMaxWidth;
        }
        this.widthService.setColumnWidth(gObj.getColumns()[parseInt(columnIndexByField.toString(), 10)] as Column);
        const result: boolean = gObj.getColumns().some((x: Column) => (x.visible || gObj.groupSettings.columns.length) &&
            (x.width === null || x.width === undefined || (x.width as string).length <= 0));
        if (result === false) {
            const element: Column[] = gObj.getColumns() as Column[];
            for (let i: number = 0; i < element.length; i++) {
                if (element[parseInt(i.toString(), 10)].visible) {
                    tWidth = tWidth + parseFloat(element[parseInt(i.toString(), 10)].width as string);
                }
            }
        }
        let calcTableWidth: string | number = tWidth + indentWidth;
        if (tWidth > 0) {
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
        if (gObj.isFrozenGrid() && gObj.enableColumnVirtualization) {
            this.widthService.refreshFrozenScrollbar();
        }
        const tableWidth: number = (headerTable as HTMLElement).offsetWidth;
        const contentwidth: number = contentTable.parentElement.scrollWidth;
        if (contentwidth > tableWidth) {
            if (!isNullOrUndefined(contentTable.querySelector('.e-emptyrow'))) {
                addClass([headerTable], ['e-tableborder']);
                removeClass([contentTable], ['e-tableborder']);
            }
            else {
                addClass([headerTable, contentTable], ['e-tableborder']);
            }
            removeClass([gObj.element], ['e-left-shadow', 'e-right-shadow']);
        } else {
            removeClass([headerTable, contentTable], ['e-tableborder']);
            if (gObj.getVisibleFrozenRightCount()) {
                addClass([gObj.element], 'e-right-shadow');
            }
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

    private findColumn(fName: string[], startRowIndex?: number, endRowIndex?: number): void {
        for (let i: number = 0; i < fName.length; i++) {
            const fieldName: string = fName[parseInt(i.toString(), 10)] as string;
            const columnIndex: number = this.parent.getColumnIndexByField(fieldName);
            const column: Column = this.parent.getColumns()[parseInt(columnIndex.toString(), 10)];
            if (columnIndex > -1 && !isNullOrUndefined(column) && column.visible === true) {
                this.resizeColumn(fieldName, columnIndex, null, startRowIndex, endRowIndex);
            }
        }
        if (this.parent.allowTextWrap) {
            this.parent.notify(events.freezeRender, { case: 'refreshHeight', isModeChg: true });
        }
        if (this.parent.isFrozenGrid()) {
            this.refreshResizefrzCols(true, true);
        }
    }

    /**
     * To create table for autofit
     *
     * @param {Element} table - specifies the table
     * @param {Element[]} text - specifies the text
     * @param {string} tag - specifies the tag name
     * @param  {number} startRowIndex - Specifies the start row index.
     * @param  {number} endRowIndex - Specifies the end row index.
     * @returns {number} returns the number
     * @hidden
     */
    protected createTable(table: Element, text: Element[], tag: string,
                          startRowIndex: number = 1, endRowIndex: number = text.length): number {
        if (startRowIndex > endRowIndex) {
            startRowIndex ^= endRowIndex;
            endRowIndex ^= startRowIndex;
            startRowIndex ^= endRowIndex;
        }
        const myTableDiv: HTMLDivElement = this.parent.createElement('div') as HTMLDivElement;
        const adaptiveClass: string = this.parent.enableAdaptiveUI ? ' e-bigger' : '';
        myTableDiv.className = this.parent.element.className + adaptiveClass;
        myTableDiv.style.cssText = 'display: inline-block;visibility:hidden;position:absolute';
        const mySubDiv: HTMLDivElement = this.parent.createElement('div') as HTMLDivElement;
        mySubDiv.className = tag;
        const myTable: HTMLTableElement = this.parent.createElement('table', { attrs: { role: 'grid' } }) as HTMLTableElement;
        myTable.className = table.className;
        myTable.classList.add('e-resizetable');
        myTable.style.cssText = 'table-layout: auto;width: auto';
        const myTr: HTMLTableRowElement = this.parent.createElement('tr') as HTMLTableRowElement;
        for (let i: number = (startRowIndex <= 0 ? 1 : startRowIndex); i <= (endRowIndex > text.length ? text.length : endRowIndex); i++) {
            const tr: HTMLTableRowElement = myTr.cloneNode() as HTMLTableRowElement;
            tr.className = table.querySelector('tr').className;
            tr.appendChild(text[parseInt((i - 1).toString(), 10)]);
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
        this.parent.on(events.refreshResizePosition, this.refreshResizePosition, this);
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
        this.parent.off(events.refreshResizePosition, this.refreshResizePosition);
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
                if (element[parseInt(i.toString(), 10)].parentElement.offsetHeight > 0) {
                    element[parseInt(i.toString(), 10)].style.height = '100%';
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
        return [].slice.call(this.parent.getHeaderTable().getElementsByClassName(resizeClassList.root));
    }

    private setHandlerHeight(): void {
        const element: HTMLElement[] = [].slice.call(this.parent.getHeaderTable().getElementsByClassName(resizeClassList.suppress));
        for (let i: number = 0; i < element.length; i++) {
            element[parseInt(i.toString(), 10)].style.height = '100%';
        }
    }

    private callAutoFit(e: PointerEvent | TouchEvent): void {
        if (Browser.isDevice && typeof e.preventDefault === 'function' && this.isDblClk) {
            e.preventDefault();
        }
        if ((e.target as HTMLElement).classList.contains('e-rhandler') && !this.isCancelAutoFit) {
            const col: Column = this.getTargetColumn(e);
            if (col.columns) {
                return;
            }
            this.resizeColumn(col.field, this.parent.getNormalizedColumnIndex(col.uid), col.uid);
            if (this.parent.isFrozenGrid()) {
                this.refreshResizefrzCols(true, true);
            }
            if (this.isDblClk && e.type === 'mousedown') {
                const args: ResizeArgs = { e : e, column: col };
                this.parent.trigger(events.resizeStop, args);
            }
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
            this.isCancelAutoFit = false;
            const args: ResizeArgs = { e : e, column: this.getTargetColumn(e) };
            this.parent.trigger(events.resizeStart, args, (args: ResizeArgs) => {
                if (args.cancel || this.parent.isEdit) {
                    this.cancelResizeAction();
                    this.isCancelAutoFit = true;
                    return;
                }
            });
            if (!this.isCancelAutoFit) {
                if (!this.helper) {
                    if (this.getScrollBarWidth() === 0) {
                        this.resizeProcess = true;
                        for (const col of this.refreshColumnWidth()) {
                            this.widthService.setColumnWidth(col);
                        }
                        if (this.parent.allowGrouping) {
                            for (let i: number = 0; i < this.parent.groupSettings.columns.length; i++) {
                                this.widthService.setColumnWidth(new Column({ width: '30px' }), i);
                            }
                        }
                        if (this.parent.isRowDragable()) {
                            this.widthService.setColumnWidth(new Column({ width: '30px' }));
                        }
                        this.widthService.setWidthToTable();
                        this.resizeProcess = false;
                    }
                    this.refreshStackedColumnWidth();
                    this.element = e.target as HTMLElement;
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
                EventHandler.add(document, Browser.touchEndEvent, this.resizeEnd, this);
                EventHandler.add(this.parent.element, Browser.touchMoveEvent, this.resizing, this);
                if (Browser.isDevice && !this.helper.classList.contains(resizeClassList.icon)) {
                    this.helper.classList.add(resizeClassList.icon);
                    EventHandler.add(document, Browser.touchStartEvent, this.removeHelper, this);
                    EventHandler.add(this.helper, Browser.touchStartEvent, this.resizeStart, this);
                } else {
                    this.updateCursor('add');
                }
            }
        }
    }

    private cancelResizeAction(removeEvents?: boolean): void {
        if (removeEvents) {
            EventHandler.remove(this.parent.element, Browser.touchMoveEvent, this.resizing);
            EventHandler.remove(document, Browser.touchEndEvent, this.resizeEnd);
            this.updateCursor('remove');
        }
        if (Browser.isDevice  && !isNullOrUndefined(this.helper)) {
            EventHandler.remove(document, Browser.touchStartEvent, this.removeHelper);
            EventHandler.remove(this.helper, Browser.touchStartEvent, this.resizeStart);
        }
        if (!isNullOrUndefined(this.helper)) {
            detach(this.helper);
        }
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
            elements[parseInt(i.toString(), 10)].style.height = this.element.parentElement.offsetHeight + 'px';
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

    private refreshResizeFixedCols(pos?: string): void {
        const cols: Column[] = this.parent.getColumns();
        const translateX: number = this.parent.enableColumnVirtualization ? this.parent.translateX : 0;
        const th: HTMLTableCellElement[]  = [].slice.call(this.parent.getHeaderContent().querySelector('tbody').querySelectorAll('.e-fixedfreeze')).concat(
            [].slice.call(this.parent.getContent().querySelectorAll('.e-fixedfreeze')));
        for (let i: number = 0; i < th.length; i++) {
            const node: HTMLTableCellElement = th[parseInt(i.toString(), 10)];
            let column: Column;
            if (node.classList.contains('e-summarycell')) {
                const uid: string = node.getAttribute('data-mappinguid');
                column = this.parent.getColumnByUid(uid);
            } else {
                const index: number = parseInt(node.getAttribute('aria-colindex'), 10) - 1;
                column = cols[parseInt(index.toString(), 10)];
            }
            let width: number = 0;
            if (pos === 'Left') {
                if (this.parent.getVisibleFrozenLeftCount()) {
                    width = this.parent.getIndentCount() * 30;
                } else if (this.parent.getFrozenMode() === 'Right') {
                    width = this.parent.groupSettings.columns.length * 30;
                }
                for (let j: number = 0; j < cols.length; j++) {
                    if (column.index > cols[parseInt(j.toString(), 10)].index) {
                        if (column.uid === cols[parseInt(j.toString(), 10)].uid) {
                            break;
                        }
                        if ((cols[parseInt(j.toString(), 10)].freeze === 'Left' || cols[parseInt(j.toString(), 10)].isFrozen) ||
                            cols[parseInt(j.toString(), 10)].freeze === 'Fixed') {
                            if (cols[parseInt(j.toString(), 10)].visible) {
                                width += parseFloat(cols[parseInt(j.toString(), 10)].width.toString());
                            }
                        }
                    }
                }
                applyStickyLeftRightPosition(node, ((width === 0 ? width : width - 1) - translateX), this.parent.enableRtl, 'Left');
            }
            if (pos === 'Right') {
                width = this.parent.getFrozenMode() === 'Right' && this.parent.isRowDragable() ? 30 : 0;
                for (let j: number = cols.length - 1; j >= 0; j--) {
                    if (column.uid === cols[parseInt(j.toString(), 10)].uid) {
                        break;
                    }
                    if (cols[parseInt(j.toString(), 10)].freeze === 'Right' || cols[parseInt(j.toString(), 10)].freeze === 'Fixed') {
                        if (cols[parseInt(j.toString(), 10)].visible) {
                            width += parseFloat(cols[parseInt(j.toString(), 10)].width.toString());
                        }
                    }
                }
                let colSpanwidth: number = 0;
                if (node.colSpan > 1) {
                    colSpanwidth = this.calculateColspanWidth(cols, node, column.index);

                }
                applyStickyLeftRightPosition(node, (width - colSpanwidth) + translateX, this.parent.enableRtl, 'Right');
            }
        }
    }

    private calculateColspanWidth(cols: Column[], node: HTMLTableCellElement, index: number): number {
        let width: number = 0;
        for (let j: number = index + 1; j < index + node.colSpan; j++) {
            width += parseInt(cols[parseInt(j.toString(), 10)].width.toString(), 10);
        }
        return width;
    }



    private refreshResizePosition(): void {
        this.refreshResizefrzCols(true);
    }

    private refreshResizefrzCols(freezeRefresh?: boolean, isAutoFitCol?: boolean): void {
        const translateX: number = this.parent.enableColumnVirtualization ? this.parent.translateX : 0;
        if (freezeRefresh || ((this.column.freeze === 'Left' || this.column.isFrozen) ||
            (this.column.columns && frozenDirection(this.column) === 'Left'))) {
            let width: number = this.parent.getIndentCount() * 30;
            const columns: Column[] = this.parent.getColumns().filter((col: Column) => col.freeze === 'Left' || col.isFrozen);
            if (!freezeRefresh || isAutoFitCol) {
                this.frzHdrRefresh('Left');
            }
            for (let i: number = 0; i < columns.length; i++) {
                if (freezeRefresh || (columns[parseInt(i.toString(), 10)].index > this.column.index)) {
                    let elements: HTMLTableCellElement[] = [];
                    if (this.parent.frozenRows) {
                        elements = [].slice.call(this.parent.getHeaderContent().querySelectorAll('td[aria-colindex="' + (i + 1) + '"]')).concat(
                            [].slice.call(this.parent.getContent().querySelectorAll('td[aria-colindex="' + (i + 1) + '"]')));
                    } else {
                        elements = [].slice.call(this.parent.getContent().querySelectorAll('td[aria-colindex="' + (i + 1) + '"]'));
                    }
                    elements.filter((cell: HTMLTableCellElement) => {
                        applyStickyLeftRightPosition(cell, width - translateX, this.parent.enableRtl, 'Left');
                    });
                    if (this.parent.enableColumnVirtualization) {
                        (<{ valueX?: number }>columns[parseInt(i.toString(), 10)]).valueX = width;
                    }
                }
                if (columns[parseInt(i.toString(), 10)].visible) {
                    width += parseFloat(columns[parseInt(i.toString(), 10)].width.toString());
                }
            }
            this.refreshResizeFixedCols('Left');
        }
        if (freezeRefresh || (this.column.freeze === 'Right' || (this.column.columns && frozenDirection(this.column) === 'Right'))) {
            let width: number =  this.parent.getFrozenMode() === 'Right' && this.parent.isRowDragable() ? 30 : 0;
            const columns: Column[] = this.parent.getColumns();
            if (!freezeRefresh || isAutoFitCol) {
                this.frzHdrRefresh('Right');
            }
            const columnsRight: Column[] = columns.filter((col: Column) => col.freeze === 'Right');
            for (let i: number = columns.length - 1; i >= columns.length - columnsRight.length; i--) {
                let elements: HTMLTableCellElement[] = [];
                if (this.parent.frozenRows) {
                    elements = [].slice.call(this.parent.getHeaderContent().querySelectorAll('td[aria-colindex="' + (i + 1) + '"]')).concat(
                        [].slice.call(this.parent.getContent().querySelectorAll('td[aria-colindex="' + (i + 1) + '"]')));
                } else {
                    elements = [].slice.call(this.parent.getContent().querySelectorAll('td[aria-colindex="' + (i + 1) + '"]'));
                }
                elements.filter((cell: HTMLTableCellElement) => {
                    let colSpanwidth: number = 0;
                    if (cell.colSpan > 1) {
                        colSpanwidth = this.calculateColspanWidth(columns, cell, columns[parseInt(i.toString(), 10)].index);
                    }
                    applyStickyLeftRightPosition(cell, (width - colSpanwidth) + translateX, this.parent.enableRtl, 'Right');
                });
                if (this.parent.enableColumnVirtualization) {
                    (<{ valueX?: number }>columns[parseInt(i.toString(), 10)]).valueX = width;
                }
                if (columns[parseInt(i.toString(), 10)].visible) {
                    width = width + parseFloat(columns[parseInt(i.toString(), 10)].width.toString());
                }
            }
            this.refreshResizeFixedCols('Right');
        }
        if (this.column && (this.column.freeze === 'Fixed' || (this.column.columns && frozenDirection(this.column) === 'Fixed'))) {
            this.refreshResizeFixedCols('Left');
            this.refreshResizeFixedCols('Right');
            this.frzHdrRefresh('Left');
            this.frzHdrRefresh('Right');

        }
        if (this.parent.groupSettings.columns.length && this.parent.aggregates.length &&
            this.parent.getContent().querySelector('.e-groupcaptionrow')) {
            this.refreshGroupCaptionRow();
        }
    }

    private refreshGroupCaptionRow(): void {
        const capRow: HTMLElement[] = [].slice.call(this.parent.getContent().querySelectorAll('.e-groupcaptionrow'));
        for (let i: number = 0; i < capRow.length; i++) {
            const tr: HTMLElement = capRow[parseInt(i.toString(), 10)];
            if (tr.querySelector('.e-summarycell')) {
                groupCaptionRowLeftRightPos(tr, this.parent);
            }
        }
    }

    private frzHdrRefresh(pos?: string): void {
        const translateX: number = this.parent.enableColumnVirtualization ? this.parent.translateX : 0;
        if (pos === 'Left') {
            const tr: HTMLElement[] = [].slice.call(this.parent.getHeaderContent().querySelector('thead').querySelectorAll('tr'));
            for (let i: number = 0; i < tr.length; i++) {
                const th: HTMLElement[]  = [].slice.call(tr[parseInt(i.toString(), 10)].querySelectorAll('.e-leftfreeze,.e-fixedfreeze'));
                for (let j: number = 0; j < th.length; j++) {
                    const node: HTMLElement = th[parseInt(j.toString(), 10)];
                    if (node.classList.contains('e-rowdragheader') || node.classList.contains('e-dragheadercell') ||
                        node.classList.contains('e-grouptopleftcell')) {
                        continue;
                    }
                    const column: Column = this.getParticularCol(node);
                    const cols: Column[] = this.parent.getColumns();
                    let width: number = 0;
                    let summarycell: HTMLElement[] = [];
                    if (this.parent.aggregates.length && this.parent.getFooterContent())  {
                        if (this.parent.getContent().querySelectorAll('.e-summaryrow').length) {
                            const summaryRows: HTMLElement[] = [].slice.call(this.parent.getContent().querySelectorAll('.e-summaryrow'));
                            summaryRows.filter((row: HTMLElement) => {
                                summarycell.push(row.querySelector('[data-mappinguid="' + column.uid + '"]'));
                            });
                        }
                        summarycell = summarycell.concat(
                            [].slice.call(this.parent.getFooterContent().querySelectorAll('[data-mappinguid="' + column.uid + '"]')));
                    }
                    if (node.classList.contains('e-fixedfreeze')) {
                        if (this.parent.getVisibleFrozenLeftCount()) {
                            width = this.parent.getIndentCount() * 30;
                        } else if (this.parent.getFrozenMode() === 'Right') {
                            width = this.parent.groupSettings.columns.length * 30;
                        }
                        for (let w: number = 0; w < cols.length; w++) {
                            if (column.index > cols[parseInt(w.toString(), 10)].index) {
                                if (column.uid === cols[parseInt(w.toString(), 10)].uid) {
                                    break;
                                }
                                if ((cols[parseInt(w.toString(), 10)].freeze === 'Left' ||  cols[parseInt(w.toString(), 10)].isFrozen) ||
                                    cols[parseInt(w.toString(), 10)].freeze === 'Fixed') {
                                    if (cols[parseInt(w.toString(), 10)].visible) {
                                        width += parseInt(cols[parseInt(w.toString(), 10)].width.toString(), 10);
                                    }
                                }
                            }
                        }
                        if (summarycell && summarycell.length) {
                            summarycell.filter((cell: HTMLTableCellElement) => {
                                applyStickyLeftRightPosition(cell, width - translateX, this.parent.enableRtl, 'Left');
                            });
                        }
                        applyStickyLeftRightPosition(node, ((width === 0 ? width : width - 1) - translateX), this.parent.enableRtl, 'Left');
                    } else {
                        width = this.parent.getIndentCount() * 30;
                        if (column.index === 0) {
                            if (summarycell && summarycell.length) {
                                summarycell.filter((cell: HTMLTableCellElement) => {
                                    applyStickyLeftRightPosition(cell, width - translateX, this.parent.enableRtl, 'Left');
                                });
                            }
                            applyStickyLeftRightPosition(node, width - translateX, this.parent.enableRtl, 'Left');
                            if (this.parent.enableColumnVirtualization) {
                                (<{ valueX?: number }>column).valueX = width;
                            }
                        } else {
                            for (let k: number = 0; k < cols.length; k++) {
                                if (column.index < cols[parseInt(k.toString(), 10)].index ||
                                    column.uid === cols[parseInt(k.toString(), 10)].uid ) {
                                    break;
                                }
                                if (cols[parseInt(k.toString(), 10)].visible) {
                                    width += parseInt(cols[parseInt(k.toString(), 10)].width.toString(), 10);
                                }
                            }
                            if (summarycell && summarycell.length) {
                                summarycell.filter((cell: HTMLTableCellElement) => {
                                    applyStickyLeftRightPosition(cell, width - translateX, this.parent.enableRtl, 'Left');
                                });
                            }
                            applyStickyLeftRightPosition(node, width - translateX, this.parent.enableRtl, 'Left');
                            if (this.parent.enableColumnVirtualization) {
                                (<{ valueX?: number }>column).valueX = width;
                            }
                        }
                        addStickyColumnPosition(this.parent, column, node);
                    }
                }
            }
        }
        if (pos === 'Right') {
            const tr: HTMLElement[] = [].slice.call(this.parent.getHeaderContent().querySelector('thead').querySelectorAll('tr'));
            for (let i: number = 0; i < tr.length; i++) {
                const th: HTMLElement[] = [].slice.call(tr[parseInt(i.toString(), 10)].querySelectorAll('.e-rightfreeze, .e-fixedfreeze'));
                for (let j: number = th.length - 1; j >= 0; j--) {
                    const node: HTMLElement = th[parseInt(j.toString(), 10)];
                    const column: Column = this.getParticularCol(node);
                    const cols: Column[] = this.parent.getColumns();
                    let width: number = 0;
                    let summarycell: HTMLElement[] = [];
                    if (this.parent.aggregates.length && this.parent.getFooterContent()) {
                        if (this.parent.getContent().querySelectorAll('.e-summaryrow').length) {
                            const summaryRows: HTMLElement[] = [].slice.call(this.parent.getContent().querySelectorAll('.e-summaryrow'));
                            summaryRows.filter((row: HTMLElement) => {
                                summarycell.push(row.querySelector('[data-mappinguid="' + column.uid + '"]'));
                            });
                        }
                        summarycell = summarycell.concat([].slice.call(
                            this.parent.getFooterContent().querySelectorAll('[data-mappinguid="' + column.uid + '"]')));
                    }
                    if (node.classList.contains('e-fixedfreeze')) {
                        width = this.parent.getFrozenMode() === 'Right' && this.parent.isRowDragable() ? 30 : 0;
                        for (let w: number = cols.length - 1; w >= 0; w--) {
                            if (column.index < cols[parseInt(w.toString(), 10)].index) {
                                if ((column.columns && isChildColumn(column, cols[parseInt(w.toString(), 10)].uid)) ||
                                    column.index > cols[parseInt(w.toString(), 10)].index) {
                                    break;
                                }
                                if (cols[parseInt(w.toString(), 10)].freeze === 'Right' ||
                                    cols[parseInt(w.toString(), 10)].freeze === 'Fixed') {
                                    if (cols[parseInt(w.toString(), 10)].visible) {
                                        width += parseFloat(cols[parseInt(w.toString(), 10)].width.toString());
                                    }
                                }
                            }
                        }
                        if (summarycell.length) {
                            summarycell.filter((cell: HTMLTableCellElement) => {
                                applyStickyLeftRightPosition(cell, width + translateX, this.parent.enableRtl, 'Right');
                            });
                        }
                        applyStickyLeftRightPosition(node, width + translateX, this.parent.enableRtl, 'Right');
                    } else {
                        width = this.parent.getFrozenMode() === 'Right' && this.parent.isRowDragable() ? 30 : 0;
                        for (let k: number = cols.length - 1; k >= 0; k--) {
                            if ((column.columns && isChildColumn(column, cols[parseInt(k.toString(), 10)].uid)) ||
                                column.index > cols[parseInt(k.toString(), 10)].index ||
                                column.uid === cols[parseInt(k.toString(), 10)].uid) {
                                break;
                            }
                            if (cols[parseInt(k.toString(), 10)].visible) {
                                width += parseInt(cols[parseInt(k.toString(), 10)].width.toString(), 10);
                            }
                        }
                        if (summarycell.length) {
                            summarycell.filter((cell: HTMLTableCellElement) => {
                                applyStickyLeftRightPosition(cell, width + translateX, this.parent.enableRtl, 'Right');
                            });
                        }
                        applyStickyLeftRightPosition(node, width + translateX, this.parent.enableRtl, 'Right');
                        if (this.parent.enableColumnVirtualization) {
                            (<{ valueX?: number }>column).valueX = width;
                        }
                    }
                }
            }
        }

    }

    private getParticularCol(node?: HTMLElement): Column {
        const uid: string = node.classList.contains('e-filterbarcell') ? node.getAttribute('data-mappinguid') :
            node.querySelector('[data-mappinguid]').getAttribute('data-mappinguid');
        return this.parent.getColumnByUid(uid);
    }

    private resizing(e: PointerEvent | TouchEvent): void {
        if (Browser.isDevice && typeof e.preventDefault === 'function') {
            e.preventDefault();
        }
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
        const mousemove: number = this.parent.enableRtl ? -(pageX - this.pageX) : (pageX - this.pageX);
        const prevWidth: number = parseFloat(this.column.width.toString());
        const colData: { [key: string]: number } = this.getColData(this.column, mousemove);
        if (!colData.width) {
            colData.width = (closest(this.element, 'th') as HTMLElement).offsetWidth;
        }
        let width: number = this.getWidth(colData.width, colData.minWidth, colData.maxWidth);
        this.parent.log('resize_min_max', { column: this.column, width });
        if (((!this.parent.enableRtl && this.minMove >= pageX) || (this.parent.enableRtl && this.minMove <= pageX))) {
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
            let columnWidth: number = 0;
            const minMaxCols: Column[] = this.parent.getColumns().filter((col: Column) => {
                if (col.visible) {
                    columnWidth += parseInt(col.width.toString(), 10);
                }
                return col.visible && (col.maxWidth || col.minWidth);
            });
            if (this.parent.resizeSettings.mode === 'Auto' && minMaxCols.length && columnWidth < this.parentElementWidth) {
                const columns: Column[] = this.parent.getColumns().filter((col: Column) => col.visible && col.uid !== this.column.uid);
                const distributedCols: DistributeColWidth = this.distributeColWidth(columns, mousemove, 0);
                if (Math.round(distributedCols.usedWidth) !== Math.abs(mousemove)) {
                    finalColumns[0].width = prevWidth + (distributedCols.usedWidth * Math.sign(mousemove));
                }
                finalColumns = [...finalColumns, ...distributedCols.columns];
            }
            this.resizeProcess = true;
            for (const col of finalColumns) {
                this.widthService.setColumnWidth(col, null, 'resize');
            }
            this.resizeProcess = false;
            this.updateHelper();
        }
        if (this.parent.isFrozenGrid()) {
            this.refreshResizefrzCols();
        }
        this.isDblClk = false;
    }

    private distributeColWidth(columns: Column[], distributeWidth: number, usedWidth: number): DistributeColWidth {
        const incDecWidth: number = distributeWidth / columns.length;
        const absIncDecWidth: number = Math.abs(incDecWidth);
        const appliedColumns: Column[] = [];
        const availableColumns: Column[] = [];
        let extraWidth: number = 0;
        for (const col of columns) {
            const afterIncDec: number = parseFloat(col.width.toString()) - incDecWidth;
            if (col.minWidth && afterIncDec < parseInt(col.minWidth.toString(), 10)) {
                const remainWidth: number = parseFloat((parseInt(col.minWidth.toString(), 10) - afterIncDec).toFixed(3));
                extraWidth += remainWidth;
                usedWidth += (absIncDecWidth - remainWidth);
                col.width = col.minWidth;
                appliedColumns.push(col);
            } else if (col.maxWidth && afterIncDec > parseInt(col.maxWidth.toString(), 10)) {
                const remainWidth: number = parseFloat((afterIncDec - parseInt(col.maxWidth.toString(), 10)).toFixed(3));
                extraWidth += remainWidth;
                usedWidth += (absIncDecWidth - remainWidth);
                col.width = col.maxWidth;
                appliedColumns.push(col);
            } else {
                usedWidth += absIncDecWidth;
                col.width = afterIncDec;
                availableColumns.push(col);
            }
        }
        const distributedCols: DistributeColWidth = extraWidth && availableColumns.length
            ? this.distributeColWidth(availableColumns, extraWidth * Math.sign(distributeWidth), usedWidth)
            : { columns: availableColumns, usedWidth };
        return { columns: [...appliedColumns, ...distributedCols.columns], usedWidth: distributedCols.usedWidth };
    }

    private calulateColumnsWidth(columns: Column[], isUpdate: boolean, mousemove: number): Column[] {
        const finalColumns: Column[] = [];
        for (const col of columns) {
            let totalWidth: number = 0;
            for (let i: number = 0; i < columns.length; i++) {
                totalWidth += parseFloat(columns[parseInt(i.toString(), 10)].width.toString());
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
        const gObj: IGrid = this.parent;
        if (gObj.isFrozenGrid()) {
            this.refreshResizePosition();
        }
        EventHandler.remove(this.parent.element, Browser.touchMoveEvent, this.resizing);
        EventHandler.remove(document, Browser.touchEndEvent, this.resizeEnd);
        if (Browser.isDevice) {
            EventHandler.remove(document, Browser.touchStartEvent, this.removeHelper);
            EventHandler.remove(this.helper, Browser.touchStartEvent, this.resizeStart);
        }
        this.updateCursor('remove');
        detach(this.helper);
        const args: ResizeArgs = { e : e, column: this.column };
        const content: HTMLElement = this.parent.getContent().querySelector('.' + literals.content);
        const cTable: HTMLElement = content;
        if (cTable.scrollHeight > cTable.clientHeight) {
            this.parent.scrollModule.setPadding();
            cTable.style.overflowY = 'scroll';
        }
        if (!Global.timer || !this.isDblClk) {
            this.parent.trigger(events.resizeStop, args);
            closest(this.element, '.e-headercell').classList.add('e-resized');
        }
        this.isFrozenColResized = false;
        if (this.parent.allowTextWrap) {
            this.updateResizeEleHeight();
            this.parent.notify(events.textWrapRefresh, { case: 'textwrap' });
        }
        const headerTable: Element = gObj.getHeaderTable();
        const contentTable: Element = gObj.getContentTable();
        let footerTable: Element;
        if (!isNullOrUndefined(gObj.getFooterContent())) {
            footerTable = gObj.getFooterContentTable();
        }
        const tableWidth: number = (headerTable as HTMLElement).offsetWidth;
        const contentwidth: number = (gObj.getContent().scrollWidth);
        if (contentwidth > tableWidth) {
            if (!isNullOrUndefined(contentTable.querySelector('.e-emptyrow'))) {
                addClass([headerTable], ['e-tableborder']);
                removeClass([contentTable], ['e-tableborder']);
            }
            else {
                addClass([headerTable, contentTable], ['e-tableborder']);
            }
            removeClass([gObj.element], ['e-left-shadow', 'e-right-shadow']);
        } else {
            removeClass([headerTable, contentTable], ['e-tableborder']);
            if (gObj.getVisibleFrozenRightCount()) {
                addClass([gObj.element], 'e-right-shadow');
            }
        }
        if (!isNullOrUndefined(footerTable)) {
            footerTable.classList.add('e-tableborder');
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
                if (ele.querySelector('[data-mappinguid]') &&
                    ele.querySelector('[data-mappinguid]').getAttribute('data-mappinguid') === column.uid && column.visible) {
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
                    width = this.getStackedWidth(col, width);
                } else {
                    width += parseFloat(col.width.toString());
                }
            }
        }
        return width;
    }

    private getTargetColumn(e: PointerEvent | TouchEvent): Column {
        let cell: HTMLElement = <HTMLElement>closest(<HTMLElement>e.target, resizeClassList.header);
        cell = cell.querySelector('.e-headercelldiv') || cell.querySelector('.e-stackedheadercelldiv');
        const uid: string = cell.getAttribute('data-mappinguid');
        return this.parent.getColumnByUid(uid);
    }

    private updateCursor(action: string): void {
        const headerRows: Element[] = [].slice.call(this.parent.getHeaderContent().querySelectorAll('th'));
        headerRows.push(this.parent.element);
        for (const row of headerRows) {
            row.classList[`${action}`](resizeClassList.cursor);
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
        const rect: HTMLElement = closest(this.element, resizeClassList.header) as HTMLElement;
        const tr: HTMLElement[] = [].slice.call(this.parent.getHeaderContent().querySelectorAll('tr'));
        for (let i: number = tr.indexOf(rect.parentElement); i < tr.length && i > -1; i++) {
            height += tr[parseInt(i.toString(), 10)].offsetHeight;
        }
        const pos: OffsetPosition = this.calcPos(rect);
        pos.left += (this.parent.enableRtl ? 0 - 1 : rect.offsetWidth - 2);
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
        left = Math.floor(this.calcPos(rect).left + (this.parent.enableRtl ? 0 - 1 : rect.offsetWidth - 2));
        const borderWidth: number = 2; // to maintain the helper inside of grid element.
        if (left > this.parentElementWidth) {
            left = this.parentElementWidth - borderWidth;
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
