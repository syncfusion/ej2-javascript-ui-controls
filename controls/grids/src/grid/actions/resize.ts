import { EventHandler, detach, formatUnit, Browser, closest, classList } from '@syncfusion/ej2-base';
import { Column } from '../models/column';
import { IGrid, IAction, ResizeArgs } from '../base/interface';
import { ColumnWidthService } from '../services/width-controller';
import * as events from '../base/constant';
import { getScrollBarWidth, parentsUntil  } from '../base/util';
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
    private resizeColumn(fName: string, index: number, id?: string): void {
        let gObj: IGrid = this.parent;
        let tWidth: number = 0;
        let headerTable: Element;
        let contentTable: Element;
        let footerTable: Element;
        let headerDivTag: string = 'e-gridheader';
        let contentDivTag: string = 'e-gridcontent';
        let indentWidth: number = 0;
        let uid: string = id ? id : this.parent.getUidByColumnField(fName);
        let columnIndex: number = this.parent.getNormalizedColumnIndex(uid);
        let headerTextClone: Element;
        let contentTextClone: NodeListOf<Element>;
        let frzCols: number = gObj.getFrozenColumns();
        if (!isNullOrUndefined(gObj.getFooterContent())) {
        footerTable = gObj.getFooterContentTable();
        }
        if (frzCols) {
            if (index < frzCols) {
                headerTable = gObj.getHeaderTable();
                contentTable = gObj.getContentTable();
                headerTextClone = (<HTMLElement>headerTable.querySelectorAll('th')[columnIndex].cloneNode(true));
                contentTextClone = contentTable.querySelectorAll(`td:nth-child(${columnIndex + 1})`);
            } else {
                headerTable = gObj.getHeaderContent().querySelector('.e-movableheader').children[0];
                contentTable = gObj.getContent().querySelector('.e-movablecontent').children[0];
                headerTextClone = (<HTMLElement>headerTable.querySelectorAll('th')[columnIndex - frzCols].cloneNode(true));
                contentTextClone = contentTable.querySelectorAll(`td:nth-child(${(columnIndex - frzCols) + 1})`);
            }
        } else {
            headerTable = gObj.getHeaderTable();
            contentTable = gObj.getContentTable();
            headerTextClone = (<HTMLElement>headerTable.querySelectorAll('th')[columnIndex].cloneNode(true));
            contentTextClone = contentTable.querySelectorAll(`td:nth-child(${columnIndex + 1}):not(.e-groupcaption)`);
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
        for (let i: number = 0; i < contentTextClone.length; i++) {
            contentText[i] = contentTextClone[i].cloneNode(true) as Element;
        }
        let wHeader: number = this.createTable(headerTable, headerText, headerDivTag);
        let wContent: number = this.createTable(contentTable, contentText, contentDivTag);
        let columnbyindex: Column = gObj.getColumns()[index];
        let result: Boolean;
        let width: string = (wHeader > wContent) ? columnbyindex.width = formatUnit(wHeader) : columnbyindex.width = formatUnit(wContent);
        this.widthService.setColumnWidth(gObj.getColumns()[index] as Column);
        result = gObj.getColumns().some((x: Column) => x.width === null || x.width === undefined || (x.width as string).length <= 0);
        if (result === false) {
            (gObj.getColumns() as Column[]).forEach((element: Column) => {
                if (element.visible) {
                    tWidth = tWidth + parseInt(element.width as string, 10);
                }
            });
        }
        let calcTableWidth: number = tWidth + indentWidth;
        if (tWidth > 0 && !gObj.getFrozenColumns()) {
            if (this.parent.detailTemplate || this.parent.childGrid) {
                this.widthService.setColumnWidth(new Column({ width: '30px' }));
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
        fName.forEach((element: string) => {
            let fieldName: string = element as string;
            let columnIndex: number = this.parent.getColumnIndexByField(fieldName);
            if (this.parent.getColumns()[columnIndex].visible === true) {
                this.resizeColumn(fieldName, columnIndex);
            }
        });
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
        text.forEach((element: Element) => {
            let tr: HTMLTableRowElement = myTr.cloneNode() as HTMLTableRowElement;
            tr.className = table.querySelector('tr').className;
            tr.appendChild(element);
            myTable.appendChild(tr);
        });
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
    public addEventListener() : void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.headerRefreshed, this.refreshHeight, this);
        this.parent.on(events.initialEnd, this.wireEvents, this);
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
        this.getResizeHandlers().forEach((ele: HTMLElement) => {
            if (ele.parentElement.offsetHeight > 0) {
                ele.style.height = ele.parentElement.offsetHeight + 'px';
            }
        });
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
        [].slice.call(this.parent.getHeaderTable().querySelectorAll('.' + resizeClassList.suppress)).forEach((ele: HTMLElement) => {
            ele.style.height = ele.parentElement.offsetHeight + 'px';
        });
    }

    private callAutoFit(e: PointerEvent | TouchEvent): void {
        if ((e.target as HTMLElement).classList.contains('e-rhandler')) {
            let col: Column = this.getTargetColumn(e);
            this.resizeColumn(col.field, this.parent.getNormalizedColumnIndex(col.uid), col.uid);
            let header: HTMLElement = <HTMLElement>closest(<HTMLElement>e.target, resizeClassList.header);
            header.classList.add('e-resized');
        }
    }

    private resizeStart(e: PointerEvent | TouchEvent): void {
        if ((e.target as HTMLElement).classList.contains('e-rhandler')) {
            if (!this.helper) {
                if (this.getScrollBarWidth() === 0) {
                    for (let col of this.refreshColumnWidth()) {
                        this.widthService.setColumnWidth(col);
                    }
                    this.widthService.setWidthToTable();
                }
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
                    this.minMove = parseInt(this.column.width.toString(), 10)
                        - (this.column.minWidth ? parseInt(this.column.minWidth.toString(), 10) : 0);
                } else {
                    this.minMove = (this.column.minWidth ? parseInt(this.column.minWidth.toString(), 10) : 0)
                        - parseInt(this.column.width.toString(), 10);
                }
                this.minMove += this.pageX;
            }
            if (Browser.isDevice && !this.helper.classList.contains(resizeClassList.icon)) {
                this.helper.classList.add(resizeClassList.icon);
                EventHandler.add(document, Browser.touchStartEvent, this.removeHelper, this);
                EventHandler.add(this.helper, Browser.touchStartEvent, this.resizeStart, this);
            } else {
                let args: ResizeArgs = {
                    e: e,
                    column: this.column
                };
                this.parent.trigger(events.resizeStart, args);
                if (args.cancel) {
                    this.cancelResizeAction();
                    return;
                }
                EventHandler.add(document, Browser.touchEndEvent, this.resizeEnd, this);
                EventHandler.add(this.parent.element, Browser.touchMoveEvent, this.resizing, this);
                this.updateCursor('add');
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

    private resizing(e: PointerEvent | TouchEvent): void {
        if (this.parent.allowTextWrap) {
            this.element.style.height = this.element.parentElement.offsetHeight + 'px';
            this.setHelperHeight();
        }
        let pageX: number = this.getPointX(e);
        let mousemove: number = this.parent.enableRtl ? -(pageX - this.pageX) : (pageX - this.pageX);
        let colData: { [key: string]: number } = {
            width: parseInt(this.widthService.getWidth(this.column).toString(), 10) + mousemove,
            minWidth: this.column.minWidth ? parseInt(this.column.minWidth.toString(), 10) : null,
            maxWidth: this.column.maxWidth ? parseInt(this.column.maxWidth.toString(), 10) : null
        };
        let width: number = this.getWidth(colData.width, colData.minWidth, colData.maxWidth);
        if ((!this.parent.enableRtl && this.minMove >= pageX) || (this.parent.enableRtl && this.minMove <= pageX)) {
            width = this.column.minWidth ? parseInt(this.column.minWidth.toString(), 10) : 0;
            this.pageX = pageX = this.minMove;
        }
        if (width !== parseInt(this.column.width.toString(), 10)) {
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
            this.widthService.setColumnWidth(this.column, null, 'resize');
            this.updateHelper();
        }
        this.isDblClk = false;
    }

    private resizeEnd(e: PointerEvent): void {
        if (!this.helper || this.parent.isDestroyed) { return; }
        EventHandler.remove(this.parent.element, Browser.touchMoveEvent, this.resizing);
        EventHandler.remove(document, Browser.touchEndEvent, this.resizeEnd);
        this.updateCursor('remove');
        detach(this.helper);
        let args: ResizeArgs = {
            e: e,
            column: this.column
        };
        this.parent.trigger(events.resizeStop, args);
        closest(this.element, '.e-headercell').classList.add('e-resized');
        if (parentsUntil(this.element, 'e-frozenheader')) {
            this.isFrozenColResized = true;
        } else {
            this.isFrozenColResized = false;
        }
        if (this.parent.getFrozenColumns()) {
            this.parent.notify(events.freezeRender, { case: 'textwrap'});
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
        for (let ele of [].slice.apply(this.parent.getHeaderTable().querySelectorAll('th.e-headercell'))) {
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

    private getTargetColumn(e: PointerEvent | TouchEvent): Column {
        let cell: HTMLElement = <HTMLElement>closest(<HTMLElement>e.target, resizeClassList.header);
        let uid: string = cell.querySelector('.e-headercelldiv').getAttribute('e-mappinguid');
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
        for (let i: number = tr.indexOf(rect.parentElement); i < tr.length; i++) {
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
        let offsetParent: Node = elem.offsetParent || doc.documentElement;
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