import { detach, closest, Browser, isNullOrUndefined as isNOU, createElement, selectAll } from '@syncfusion/ej2-base';
import { EventHandler, addClass, removeClass, KeyboardEventArgs } from '@syncfusion/ej2-base';
import * as events from '../constant';
import * as classes from '../classes';
import { dispatchEvent, hasClass } from '../util';
import { QuickToolbar } from '../actions/quick-toolbar';
import { EditorManager } from '../../src/editor-manager';
import { SfRichTextEditor } from '../sf-richtexteditor-fn';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { NodeSelection } from '../../src/selection/selection';
import { ITableNotifyArgs, EditTableModel } from '../interfaces';
import { IDropDownItemModel, OffsetPosition, ResizeArgs } from '../../src/rich-text-editor/base/interface';
import { IColorPickerEventArgs, ITableArgs, IToolbarItemModel, NotifyArgs } from '../../src/rich-text-editor/base/interface';

/**
 * `Table` module is used to handle table actions.
 */
export class Table {
    private colIndex: number;
    private helper: HTMLElement;
    private pageX: number = null;
    private pageY: number = null;
    private parent: SfRichTextEditor;
    private quickToolObj: QuickToolbar;
    private curTable: HTMLTableElement;
    private rowEle: HTMLTableRowElement;
    private moveEle: HTMLElement = null;
    private tableNotifyArgs: ITableNotifyArgs;
    private columnEle: HTMLTableDataCellElement;
    public ensureInsideTableList: boolean = true;
    private resizeBtnStat: { [key: string]: boolean };
    constructor(parent?: SfRichTextEditor) {
        this.parent = parent;
        this.addEventListener();
    }

    protected addEventListener(): void {
        this.parent.observer.on(events.keyDown, this.keyDown, this);
        this.parent.observer.on(events.destroy, this.destroy, this);
        this.parent.observer.on(events.docClick, this.docClick, this);
        this.parent.observer.on(events.initialEnd, this.afterRender, this);
        this.parent.observer.on(events.createTable, this.renderDlgContent, this);
        this.parent.observer.on(events.dropDownSelect, this.dropdownSelect, this);
        this.parent.observer.on(events.editAreaClick, this.editAreaClickHandler, this);
        this.parent.observer.on(events.tableToolbarAction, this.onToolbarAction, this);
    }
    protected removeEventListener(): void {
        this.parent.observer.off(events.keyDown, this.keyDown);
        this.parent.observer.off(events.destroy, this.destroy);
        this.parent.observer.off(events.docClick, this.docClick);
        this.parent.observer.off(events.mouseDown, this.cellSelect);
        this.parent.observer.off(events.initialEnd, this.afterRender);
        this.parent.observer.off(events.createTable, this.renderDlgContent);
        this.parent.observer.off(events.dropDownSelect, this.dropdownSelect);
        this.parent.observer.off(events.tableColorPickerChanged, this.setBGColor);
        this.parent.observer.off(events.editAreaClick, this.editAreaClickHandler);
        this.parent.observer.off(events.tableToolbarAction, this.onToolbarAction);
    }
    private afterRender(): void {
        this.parent.observer.on(events.mouseDown, this.cellSelect, this);
        this.parent.observer.on(events.tableColorPickerChanged, this.setBGColor, this);
        if (this.parent.tableSettings.resize) {
            EventHandler.add(this.parent.getEditPanel(), Browser.touchStartEvent, this.resizeStart, this);
        }
        if (!Browser.isDevice && this.parent.tableSettings.resize) {
            EventHandler.add(this.parent.getEditPanel(), 'mouseover', this.resizeHelper, this);
        }
    }
    private tabSelection(event: KeyboardEvent, selection: NodeSelection, ele: HTMLElement): void {
        let insideList: boolean = this.insideList(selection.range);
        if ((event.keyCode === 37 || event.keyCode === 39) && selection.range.startContainer.nodeType === 3 ||
            insideList) {
            return;
        }
        event.preventDefault();
        ele.classList.remove(classes.CLS_TABLE_SEL);
        if (!event.shiftKey && event.keyCode !== 37) {
            let nextElement: HTMLElement | Element | Node = (!isNOU(ele.nextSibling)) ? ele.nextSibling :
                (!isNOU(closest(ele, 'tr').nextSibling) ? closest(ele, 'tr').nextSibling.childNodes[0] :
                    (!isNOU(closest(ele, 'table').nextSibling)) ?
                        (closest(ele, 'table').nextSibling.nodeName.toLowerCase() === 'td') ?
                            closest(ele, 'table').nextSibling : ele : ele);
            if (ele === nextElement && ele.nodeName === 'TH') {
                nextElement = (closest(ele, 'table') as HTMLTableElement).rows[1].cells[0];
            }
            if (event.keyCode === 39 && ele === nextElement) {
                nextElement = closest(ele, 'table').nextSibling;
            }
            if (nextElement) {
                (nextElement.textContent.trim() !== '' && closest(nextElement, 'td')) ?
                    selection.setSelectionNode(this.parent.getDocument(), nextElement) :
                    selection.setSelectionText(this.parent.getDocument(), nextElement, nextElement, 0, 0);
            }
            if (ele === nextElement && event.keyCode !== 39 && nextElement) {
                this.addRow(selection, event, true);
                nextElement = nextElement.parentElement.nextSibling.firstChild as HTMLElement;
                (nextElement.textContent.trim() !== '' && closest(nextElement, 'td')) ?
                    selection.setSelectionNode(this.parent.getDocument(), nextElement) :
                    selection.setSelectionText(this.parent.getDocument(), nextElement, nextElement, 0, 0);
            }
        } else {
            let prevElement: HTMLElement | Node = (!isNOU(ele.previousSibling)) ? ele.previousSibling :
                (!isNOU(closest(ele, 'tr').previousSibling) ?
                    closest(ele, 'tr').previousSibling.childNodes[closest(ele, 'tr').previousSibling.childNodes.length - 1] :
                    (!isNOU(closest(ele, 'table').previousSibling)) ?
                        (closest(ele, 'table').previousSibling.nodeName.toLowerCase() === 'td') ? closest(ele, 'table').previousSibling :
                            ele : ele);
            if (ele === prevElement && (ele as HTMLTableDataCellElement).cellIndex === 0 &&
                (closest(ele, 'table') as HTMLTableElement).tHead) {
                let clsTable: HTMLTableElement = closest(ele, 'table') as HTMLTableElement;
                prevElement = clsTable.rows[0].cells[clsTable.rows[0].cells.length - 1];
            }
            if (event.keyCode === 37 && ele === prevElement) {
                prevElement = closest(ele, 'table').previousSibling;
            }
            if (prevElement) {
                (prevElement.textContent.trim() !== '' && closest(prevElement, 'td')) ?
                    selection.setSelectionNode(this.parent.getDocument(), prevElement) :
                    selection.setSelectionText(this.parent.getDocument(), prevElement, prevElement, 0, 0);
            }
        }
    }
    private insideList(range: Range): boolean {
        let blockNodes: Element[] = <Element[]>(this.parent.formatter.editorManager as EditorManager).domNode.blockNodes();
        let nodes: Element[] = [];
        for (let i: number = 0; i < blockNodes.length; i++) {
            if ((blockNodes[i].parentNode as Element).tagName === 'LI') {
                nodes.push(blockNodes[i].parentNode as Element);
            } else if (blockNodes[i].tagName === 'LI' && (blockNodes[i].childNodes[0] as Element).tagName !== 'P' &&
                ((blockNodes[i].childNodes[0] as Element).tagName !== 'OL' &&
                    (blockNodes[i].childNodes[0] as Element).tagName !== 'UL')) {
                nodes.push(blockNodes[i]);
            }
        }
        if (nodes.length > 1 || nodes.length && ((range.startOffset === 0 && range.endOffset === 0))) {
            this.ensureInsideTableList = true;
            return true;
        } else {
            this.ensureInsideTableList = false;
            return false;
        }
    }
    private tableArrowNavigation(event: KeyboardEvent, selection: NodeSelection, ele: HTMLElement): void {
        let selText: Node = selection.range.startContainer;
        if ((event.keyCode === 40 && selText.nodeType === 3 && (selText.nextSibling && selText.nextSibling.nodeName === 'BR' ||
            selText.parentNode && selText.parentNode.nodeName !== 'TD')) ||
            (event.keyCode === 38 && selText.nodeType === 3 && (selText.previousSibling && selText.previousSibling.nodeName === 'BR' ||
                selText.parentNode && selText.parentNode.nodeName !== 'TD'))) {
            return;
        }
        event.preventDefault();
        ele.classList.remove(classes.CLS_TABLE_SEL);
        if (event.keyCode === 40) {
            ele = (!isNOU(closest(ele, 'tr').nextSibling)) ?
                (closest(ele, 'tr').nextSibling as Element).children[(ele as HTMLTableDataCellElement).cellIndex] as HTMLElement :
                ((closest(ele, 'table') as HTMLTableElement).tHead && ele.nodeName === 'TH') ?
                    (closest(ele, 'table') as HTMLTableElement).rows[1].cells[(ele as HTMLTableDataCellElement).cellIndex] :
                    (!isNOU(closest(ele, 'table').nextSibling)) ? closest(ele, 'table').nextSibling as HTMLElement :
                        ele as HTMLElement;
        } else {
            ele = (!isNOU(closest(ele, 'tr').previousSibling)) ?
                (closest(ele, 'tr').previousSibling as Element).children[(ele as HTMLTableDataCellElement).cellIndex] as HTMLElement :
                ((closest(ele, 'table') as HTMLTableElement).tHead && ele.nodeName !== 'TH') ?
                    (closest(ele, 'table') as HTMLTableElement).tHead.rows[0].cells[(ele as HTMLTableDataCellElement).cellIndex] :
                    (!isNOU(closest(ele, 'table').previousSibling)) ? closest(ele, 'table').previousSibling as HTMLElement :
                        ele as HTMLElement;
        }
        if (ele) {
            selection.setSelectionText(this.parent.getDocument(), ele, ele, 0, 0);
        }
    }
    private cellSelect(e: ITableNotifyArgs): void {
        let target: HTMLTableCellElement = (e.args as MouseEvent).target as HTMLTableCellElement;
        let tdNode: Element = closest(target, 'td,th') as HTMLTableCellElement;
        target = (target.nodeName !== 'TD' && tdNode && this.parent.getEditPanel().contains(tdNode)) ?
            tdNode as HTMLTableCellElement : target;
        removeClass(this.parent.getEditPanel().querySelectorAll('table td, table th'), classes.CLS_TABLE_SEL);
        if (target && (target.tagName === 'TD' || target.tagName === 'TH')) {
            target.removeAttribute('class');
            addClass([target], classes.CLS_TABLE_SEL);
            this.curTable = (this.curTable) ? this.curTable : closest(target, 'table') as HTMLTableElement;
            this.removeResizeEle();
            if (this.helper && this.parent.getEditPanel().contains(this.helper)) { detach(this.helper); }
        }
    }
    private renderDlgContent(args?: ITableNotifyArgs): void {
        this.tableNotifyArgs = args;
        this.parent.observer.notify(events.selectionSave, {});
        if (Browser.isDevice || this.parent.inlineMode.enable) {
            this.insertTableDialog();
            return;
        }
        this.hideTableQuickToolbar();
        let tbEle: HTMLElement = this.parent.getToolbarElement() as HTMLElement;
        let tbTableEle: HTMLElement = this.parent.element.querySelector('#' + this.parent.element.id + '_toolbar_CreateTable');
        let top: number = 0;
        if (this.parent.getToolbar().classList.contains(classes.CLS_EXPAND_OPEN)) {
            top = tbTableEle.offsetTop + tbTableEle.offsetHeight + tbEle.offsetHeight;
        } else {
            top = tbTableEle.offsetTop + tbTableEle.offsetHeight;
        }
        this.parent.dotNetRef.invokeMethodAsync('ShowCreateTableDialog', tbTableEle.offsetLeft, top);
    }
    public createTablePopupOpened(): void {
        let rowElements: HTMLElement[] = selectAll('.e-rte-table-popup .e-rte-table-row', this.parent.element);
        for (let i: number = 0; i < rowElements.length; i++) {
            EventHandler.add(rowElements[i], 'mouseleave', this.tableCellLeave, this);
            let tableCells: HTMLElement[] = selectAll('.e-rte-tablecell', rowElements[i]);
            for (let j: number = 0; j < tableCells.length; j++) {
                EventHandler.add(tableCells[j], 'mouseup', this.tableCellClick, this);
                EventHandler.add(tableCells[j], 'mousemove', this.tableCellSelect, this);
            }
        }
        if (!isNOU(this.parent.getToolbarElement().querySelector('.e-expended-nav') as HTMLElement)) {
            (this.parent.getToolbarElement().querySelector('.e-expended-nav') as HTMLElement).setAttribute('tabindex', '1');
        }
    }
    private insertTableDialog(): void {
        this.createDialog();
    }
    private createDialog(model?: object, mode?: string): void {
        this.parent.dotNetRef.invokeMethodAsync('ShowTableDialog', model, mode);
        if (this.quickToolObj && this.quickToolObj.inlineQTBar && document.body.contains(this.quickToolObj.inlineQTBar.element)) {
            this.quickToolObj.hideInlineQTBar();
        }
    }
    private tableCellSelect(e?: MouseEvent): void {
        let target: EventTarget = e.target;
        let dlgDiv: HTMLElement = this.parent.element.querySelector('.e-rte-table-popup');
        let tblHeader: HTMLElement = this.parent.element.querySelector('.e-rte-table-popup .e-rte-popup-header');
        let row: number = Array.prototype.slice.call(
            (target as HTMLElement).parentElement.parentElement.children).indexOf((target as HTMLElement).parentElement);
        let col: number = Array.prototype.slice.call((target as HTMLElement).parentElement.children).indexOf(target);
        let list: Element[] = <NodeListOf<Element> & Element[]>dlgDiv.querySelectorAll('.e-rte-tablecell');
        Array.prototype.forEach.call(list, (item: HTMLElement): void => {
            let parentIndex: number = Array.prototype.slice.call(item.parentElement.parentElement.children).indexOf(item.parentElement);
            let cellIndex: number = Array.prototype.slice.call(item.parentElement.children).indexOf(item);
            removeClass([item], 'e-active');
            if (parentIndex <= row && cellIndex <= col) { addClass([item], 'e-active'); }
        });
        tblHeader.innerHTML = (col + 1) + 'x' + (row + 1);
    }
    private tableCellLeave(e?: MouseEvent): void {
        let dlgDiv: HTMLElement = this.parent.element.querySelector('.e-rte-table-popup');
        let tblHeader: HTMLElement = this.parent.element.querySelector('.e-rte-table-popup .e-rte-popup-header');
        removeClass(dlgDiv.querySelectorAll('.e-rte-tablecell'), 'e-active');
        addClass([dlgDiv.querySelector('.e-rte-tablecell')], 'e-active');
        tblHeader.innerHTML = 1 + 'x' + 1;
    }
    private tableCellClick(e: MouseEvent): void {
        let target: EventTarget = e.target;
        let row: number = Array.prototype.slice.call(
            (target as HTMLElement).parentElement.parentElement.children).indexOf((target as HTMLElement).parentElement) + 1;
        let col: number = Array.prototype.slice.call((target as HTMLElement).parentElement.children).indexOf(target) + 1;
        this.tableInsert(row, col, 'Create', this as ITableNotifyArgs);
    }
    private tableInsert(row: number, col: number, dlgTarget: string, selectionObj?: ITableNotifyArgs): void {
        let proxy: Table = (selectionObj.self) ? selectionObj.self : this;
        let startContainer: Node = this.tableNotifyArgs.selection.range.startContainer;
        if (startContainer.nodeName === 'P' && startContainer.textContent.trim() === '' && !(startContainer.childNodes.length > 0)) {
            (startContainer as Element).innerHTML = '<br />';
        }
        let parentNode: Node = startContainer.parentNode;
        if (proxy.parent.editorMode === 'HTML' &&
            ((proxy.parent.iframeSettings.enable && !hasClass(parentNode.ownerDocument.querySelector('body'), 'e-lib')) ||
                (!proxy.parent.iframeSettings.enable && isNOU(closest(parentNode, '#' + proxy.parent.getPanel().id))))) {
            (proxy.parent.getEditPanel() as HTMLElement).focus();
            let range: Range = proxy.parent.formatter.editorManager.nodeSelection.getRange(proxy.parent.getDocument());
            this.tableNotifyArgs.selection = proxy.parent.formatter.editorManager.nodeSelection.save(
                range, proxy.parent.getDocument());
        }
        let value: ITableArgs = {
            row: row, columns: col, width: {
                minWidth: proxy.parent.tableSettings.minWidth,
                maxWidth: proxy.parent.tableSettings.maxWidth,
                width: proxy.parent.tableSettings.width,
            },
            selection: this.tableNotifyArgs.selection
        };
        if (dlgTarget === 'Create') {
            this.parent.dotNetRef.invokeMethodAsync('CloseCreateTableDialog');
        } else {
            this.parent.dotNetRef.invokeMethodAsync('CloseTableDialog');
        }
        this.parent.observer.notify(events.selectionRestore, {});
        proxy.parent.formatter.process(
            proxy.parent, this.tableNotifyArgs.args, (this.tableNotifyArgs.args as ClickEventArgs).originalEvent, value);
        (proxy.parent.getEditPanel() as HTMLElement).focus();
        proxy.parent.observer.on(events.mouseDown, proxy.cellSelect, proxy);
    }
    public customTable(rowValue: number, columnValue: number): void {
        if (rowValue && columnValue) {
            let argument: ITableNotifyArgs = ((Browser.isDevice || (!isNOU(this.tableNotifyArgs.args as ClickEventArgs)
                && !isNOU((this.tableNotifyArgs.args as ClickEventArgs).originalEvent) &&
                ((this.tableNotifyArgs.args as ClickEventArgs).originalEvent as KeyboardEventArgs).action === 'insert-table')
                || this.parent.inlineMode.enable) ? this.tableNotifyArgs : this as ITableNotifyArgs);
            this.tableInsert(rowValue, columnValue, '', argument);
        }
    }
    public applyTableProperties(model: EditTableModel): void {
        let table: HTMLTableElement = closest(this.tableNotifyArgs.selectNode[0] as HTMLElement, 'table') as HTMLTableElement;
        table.style.width = model.width + 'px';
        if (model.padding.toString() !== '') {
            let tdElm: NodeListOf<HTMLElement> = table.querySelectorAll('td');
            for (let i: number = 0; i < tdElm.length; i++) {
                let padVal: string = '';
                if (tdElm[i].style.padding === '') {
                    padVal = tdElm[i].getAttribute('style') + ' padding:' +
                        model.padding + 'px;';
                } else {
                    tdElm[i].style.padding = model.padding + 'px';
                    padVal = tdElm[i].getAttribute('style');
                }
                tdElm[i].setAttribute('style', padVal);
            }
        }
        table.cellSpacing = model.spacing.toString();
        if (!isNOU(table.cellSpacing) || table.cellSpacing !== '0') {
            addClass([table], classes.CLS_TABLE_BORDER);
        } else {
            removeClass([table], classes.CLS_TABLE_BORDER);
        }
        this.parent.formatter.saveData();
        this.parent.dotNetRef.invokeMethodAsync('CloseTableDialog');
    }
    //#region Resize methods
    private resizeHelper(e: PointerEvent | TouchEvent): void {
        if (this.parent.readonly) {
            return;
        }
        let target: HTMLElement = e.target as HTMLElement || (e as TouchEvent).targetTouches[0].target as HTMLElement;
        let closestTable: Element = closest(target, 'table');
        if (target.nodeName === 'TABLE' || target.nodeName === 'TD' || target.nodeName === 'TH') {
            this.curTable = (closestTable && this.parent.getEditPanel().contains(closestTable))
                && (target.nodeName === 'TD' || target.nodeName === 'TH') ?
                (closestTable as HTMLTableElement) : target as HTMLTableElement;
            this.removeResizeEle();
            this.tableResizeEleCreation(this.curTable, e as PointerEvent);
        }
    }
    private tableResizeEleCreation(table: HTMLTableElement, e: MouseEvent): void {
        this.parent.defaultResize(e, false);
        let columns: NodeListOf<Element> = Array.prototype.slice.call(table.rows[0].cells, 1);
        let rows: Element[] = [];
        for (let i: number = 0; i < table.rows.length; i++) {
            rows.push(Array.prototype.slice.call(table.rows[i].cells, 0, 1)[0]);
        }
        let height: number = parseInt(getComputedStyle(table).height, 10);
        let width: number = parseInt(getComputedStyle(table).width, 10);
        let pos: OffsetPosition = this.calcPos(table);
        for (let i: number = 0; columns.length > i; i++) {
            let colReEle: HTMLElement = createElement('span', {
                attrs: {
                    'data-col': (i + 1).toString(), 'unselectable': 'on', 'contenteditable': 'false'
                }
            });
            colReEle.classList.add(classes.CLS_RTE_TABLE_RESIZE, classes.CLS_TB_COL_RES);
            colReEle.style.cssText = 'height: ' + height + 'px; width: 4px; top: ' + pos.top +
                'px; left:' + (pos.left + this.calcPos(columns[i] as HTMLElement).left) + 'px;';
            this.parent.getEditPanel().appendChild(colReEle);
        }
        for (let i: number = 0; rows.length > i; i++) {
            let rowReEle: HTMLElement = createElement('span', {
                attrs: {
                    'data-row': (i).toString(), 'unselectable': 'on', 'contenteditable': 'false'
                }
            });
            rowReEle.classList.add(classes.CLS_RTE_TABLE_RESIZE, classes.CLS_TB_ROW_RES);
            let rowPosLeft: number = !isNOU(table.getAttribute('cellspacing')) || table.getAttribute('cellspacing') !== '' ?
                0 : this.calcPos(rows[i] as HTMLElement).left;
            rowReEle.style.cssText = 'width: ' + width + 'px; height: 4px; top: ' +
                (this.calcPos(rows[i] as HTMLElement).top + pos.top + (rows[i] as HTMLElement).offsetHeight - 2) +
                'px; left:' + (rowPosLeft + pos.left) + 'px;';
            this.parent.getEditPanel().appendChild(rowReEle);
        }
        let tableReBox: HTMLElement = createElement('span', {
            className: classes.CLS_TB_BOX_RES, attrs: {
                'data-col': columns.length.toString(), 'unselectable': 'on', 'contenteditable': 'false'
            }
        });
        tableReBox.style.cssText = 'top: ' + (pos.top + height - 4) +
            'px; left:' + (pos.left + width - 4) + 'px;';
        if (Browser.isDevice) { tableReBox.classList.add('e-rmob'); }
        this.parent.getEditPanel().appendChild(tableReBox);
    }
    private resizeStart(e: PointerEvent | TouchEvent): void {
        if (this.parent.readonly) {
            return;
        }
        if (Browser.isDevice) {
            this.resizeHelper(e);
        }
        let target: HTMLElement = e.target as HTMLElement;
        if (target.classList.contains(classes.CLS_TB_COL_RES) ||
            target.classList.contains(classes.CLS_TB_ROW_RES) ||
            target.classList.contains(classes.CLS_TB_BOX_RES)) {
            e.preventDefault();
            this.parent.defaultResize(e as PointerEvent, false);
            removeClass(this.curTable.querySelectorAll('td,th'), classes.CLS_TABLE_SEL);
            this.parent.formatter.editorManager.nodeSelection.Clear(this.parent.getDocument());
            this.pageX = this.getPointX(e);
            this.pageY = this.getPointY(e);
            this.resizeBtnInit();
            this.hideTableQuickToolbar();
            if (target.classList.contains(classes.CLS_TB_COL_RES)) {
                this.resizeBtnStat.column = true;
                this.columnEle = this.curTable.rows[0].cells[parseInt(target.getAttribute('data-col'), 10)] as HTMLTableDataCellElement;
                this.colIndex = this.columnEle.cellIndex;
                this.moveEle = e.target as HTMLElement;
                this.appendHelper();
            }
            if (target.classList.contains(classes.CLS_TB_ROW_RES)) {
                this.rowEle = this.curTable.rows[parseInt(target.getAttribute('data-row'), 10)] as HTMLTableRowElement;
                this.resizeBtnStat.row = true;
                this.appendHelper();
            }
            if (target.classList.contains(classes.CLS_TB_BOX_RES)) { this.resizeBtnStat.tableBox = true; }

            if (Browser.isDevice && this.helper && !this.helper.classList.contains('e-reicon')) {
                this.helper.classList.add('e-reicon');
                EventHandler.add(document, Browser.touchStartEvent, this.removeHelper, this);
                EventHandler.add(this.helper, Browser.touchStartEvent, this.resizeStart, this);
            } else {
                let args: ResizeArgs = { requestType: 'Table' };
                // @ts-ignore-start
                this.parent.dotNetRef.invokeMethodAsync('ResizeStartEvent', args).then((resizeStartArgs: ResizeArgs) => {
                    // @ts-ignore-end
                    if (resizeStartArgs.cancel) {
                        this.cancelResizeAction();
                    }
                });
            }
            EventHandler.add(this.parent.getDocument(), Browser.touchMoveEvent, this.resizing, this);
            EventHandler.add(this.parent.getDocument(), Browser.touchEndEvent, this.resizeEnd, this);
        }
    }
    private resizing(e: PointerEvent | TouchEvent): void {
        let pageX: number = this.getPointX(e);
        let pageY: number = this.getPointY(e);
        let mouseX: number = (this.parent.enableRtl) ? -(pageX - this.pageX) : (pageX - this.pageX);
        let mouseY: number = (this.parent.enableRtl) ? -(pageY - this.pageY) : (pageY - this.pageY);
        this.pageX = pageX;
        this.pageY = pageY;
        let args: ResizeArgs = { requestType: 'Table' };
        let tableReBox: HTMLElement = this.parent.getEditPanel().querySelector('.e-table-box') as HTMLElement;
        let tableWidth: number = parseInt(getComputedStyle(this.curTable).width as string, 10);
        let tableHeight: number = parseInt(getComputedStyle(this.curTable).height as string, 10);
        let paddingSize: number = +getComputedStyle(this.parent.getEditPanel()).paddingRight.match(/\d/g).join('');
        let rteWidth: number = (this.parent.getEditPanel() as HTMLElement).offsetWidth - paddingSize * 2;
        if (this.resizeBtnStat.column) {
            let cellColl: HTMLCollection = this.curTable.rows[0].cells;
            let width: number = parseFloat(this.columnEle.offsetWidth.toString());
            let actualWidth: number = width - mouseX;
            let totalWidth: number = parseFloat(this.columnEle.offsetWidth.toString()) +
                parseFloat((cellColl[this.colIndex - 1] as HTMLElement).offsetWidth.toString());
            for (let i: number = 0; i < this.curTable.rows.length; i++) {
                if ((totalWidth - actualWidth) > 20 && actualWidth > 20) {
                    let leftColumnWidth: number = totalWidth - actualWidth;
                    let rightColWidth: number = actualWidth;
                    (this.curTable.rows[i].cells[this.colIndex - 1] as HTMLTableDataCellElement).style.width =
                        this.convertPixelToPercentage(leftColumnWidth, tableWidth) + '%';
                    (this.curTable.rows[i].cells[this.colIndex] as HTMLTableDataCellElement).style.width =
                        this.convertPixelToPercentage(rightColWidth, tableWidth) + '%';
                }
            }
            this.updateHelper();
        } else if (this.resizeBtnStat.row) {
            this.parent.defaultResize(e as PointerEvent, false);
            let height: number = parseFloat(this.rowEle.clientHeight.toString()) + mouseY;
            if (height > 20) {
                this.rowEle.style.height = height + 'px';
            }
            this.curTable.style.height = '';
            tableReBox.style.cssText = 'top: ' + (this.calcPos(this.curTable).top + tableHeight - 4) +
                'px; left:' + (this.calcPos(this.curTable).left + tableWidth - 4) + 'px;';
            this.updateHelper();
        } else if (this.resizeBtnStat.tableBox) {
            if (!Browser.isDevice) {
                EventHandler.remove(this.parent.getEditPanel(), 'mouseover', this.resizeHelper);
            }
            let widthType: boolean = this.curTable.style.width.indexOf('%') > -1;
            this.curTable.style.width = widthType ? this.convertPixelToPercentage(tableWidth + mouseX, rteWidth) + '%'
                : tableWidth + mouseX + 'px';
            this.curTable.style.height = tableHeight + mouseY + 'px';
            tableReBox.classList.add('e-rbox-select');
            tableReBox.style.cssText = 'top: ' + (this.calcPos(this.curTable).top + tableHeight - 4) +
                'px; left:' + (this.calcPos(this.curTable).left + tableWidth - 4) + 'px;';
        }
    }
    private resizeEnd(e: PointerEvent | TouchEvent): void {
        this.resizeBtnInit();
        EventHandler.remove(this.parent.getDocument(), Browser.touchMoveEvent, this.resizing);
        EventHandler.remove(this.parent.getDocument(), Browser.touchEndEvent, this.resizeEnd);
        if (this.parent.getEditPanel().querySelector('.e-table-box') &&
            this.parent.getEditPanel().contains(this.parent.getEditPanel().querySelector('.e-table-box'))) {
            if (!Browser.isDevice) {
                EventHandler.add(this.parent.getEditPanel(), 'mouseover', this.resizeHelper, this);
            }
            this.removeResizeEle();
            if (this.helper && this.parent.getEditPanel().contains(this.helper)) { detach(this.helper); this.helper = null; }
            this.pageX = null;
            this.pageY = null;
            this.moveEle = null;
        }
        let args: ResizeArgs = { requestType: 'Table' };
        this.parent.dotNetRef.invokeMethodAsync('ResizeStopEvent', args);
        this.parent.formatter.saveData();
    }
    private resizeBtnInit(): { [key: string]: boolean } {
        return this.resizeBtnStat = { column: false, row: false, tableBox: false };
    }
    private removeResizeEle(): void {
        let item: NodeListOf<Element> = this.parent.getEditPanel().
            querySelectorAll('.e-column-resize, .e-row-resize, .e-table-box');
        if (item.length > 0) {
            for (let i: number = 0; i < item.length; i++) {
                detach(item[i]);
            }
        }
    }
    private appendHelper(): void {
        this.helper = createElement('div', {
            className: 'e-table-rhelper'
        });
        if (Browser.isDevice) { this.helper.classList.add('e-reicon'); }
        this.parent.getEditPanel().appendChild(this.helper);
        this.setHelperHeight();
    }
    private setHelperHeight(): void {
        let pos: OffsetPosition = this.calcPos(this.curTable);
        if (this.resizeBtnStat.column) {
            this.helper.classList.add('e-column-helper');
            (this.helper as HTMLElement).style.cssText = 'height: ' + getComputedStyle(this.curTable).height + '; top: ' +
                pos.top + 'px; left:' + (pos.left + this.calcPos(this.columnEle).left - 1) + 'px;';
        } else {
            this.helper.classList.add('e-row-helper');
            (this.helper as HTMLElement).style.cssText = 'width: ' + getComputedStyle(this.curTable).width + '; top: ' +
                (this.calcPos(this.rowEle).top + pos.top + (this.rowEle as HTMLElement).offsetHeight) +
                'px; left:' + (this.calcPos(this.rowEle).left + pos.left) + 'px;';
        }
    }
    private updateHelper(): void {
        let pos: OffsetPosition = this.calcPos(this.curTable);
        if (this.resizeBtnStat.column) {
            let left: number = pos.left + this.calcPos(this.columnEle as HTMLElement).left - 1;
            this.helper.style.left = left + 'px';
        } else {
            let top: number = this.calcPos(this.rowEle).top + pos.top + (this.rowEle as HTMLElement).offsetHeight;
            this.helper.style.top = top + 'px';
        }
    }
    private removeHelper(e: MouseEvent): void {
        let cls: DOMTokenList = (e.target as HTMLElement).classList;
        if (!(cls.contains('e-reicon')) && this.helper) {
            EventHandler.remove(document, Browser.touchStartEvent, this.removeHelper);
            EventHandler.remove(this.helper, Browser.touchStartEvent, this.resizeStart);
            if (this.helper && this.parent.getEditPanel().contains(this.helper)) { detach(this.helper); }
            this.pageX = null;
            this.helper = null;
        }
    }
    private convertPixelToPercentage(value: number, offsetValue: number): number {
        return (value / offsetValue) * 100;
    }
    private cancelResizeAction(): void {
        EventHandler.remove(this.parent.getDocument(), Browser.touchMoveEvent, this.resizing);
        EventHandler.remove(this.parent.getDocument(), Browser.touchEndEvent, this.resizeEnd);
        this.removeResizeEle();
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
        if (offsetParent.nodeName === 'TD' && elem.nodeName === 'TABLE') {
            offsetParent = closest(offsetParent, '.e-control');
        }
        if (offsetParent && offsetParent !== elem && offsetParent.nodeType === 1) {
            parentOffset = (<HTMLElement>offsetParent).getBoundingClientRect();
        }
        return {
            top: offset.top - parentOffset.top,
            left: offset.left - parentOffset.left
        };
    }
    private getPointX(e: PointerEvent | TouchEvent): number {
        if ((e as TouchEvent).touches && (e as TouchEvent).touches.length) {
            return (e as TouchEvent).touches[0].pageX;
        } else {
            return (e as PointerEvent).pageX;
        }
    }
    private getPointY(e: PointerEvent | TouchEvent): number {
        if ((e as TouchEvent).touches && (e as TouchEvent).touches.length) {
            return (e as TouchEvent).touches[0].pageY;
        } else {
            return (e as PointerEvent).pageY;
        }
    }
    //#endregion
    //#region Quick toolbar related methods
    private editAreaClickHandler(e: ITableNotifyArgs): void {
        if (this.parent.readonly) {
            return;
        }
        let args: MouseEvent = e.args as MouseEvent;
        let showOnRightClick: boolean = this.parent.quickToolbarSettings.showOnRightClick;
        if (args.which === 2 || (showOnRightClick && args.which === 1) || (!showOnRightClick && args.which === 3)) { return; }
        if (this.parent.editorMode === 'HTML' && this.parent.quickToolbarModule) {
            this.quickToolObj = this.parent.quickToolbarModule;
            let target: HTMLElement = args.target as HTMLElement;
            let isPopupOpen: boolean;
            isPopupOpen = document.body.querySelector('#' + this.parent.id + '_Table_Quick_Popup').classList.contains('e-rte-pop');
            if (isPopupOpen) { return; }
            let range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.getDocument());
            let closestTable: Element = closest(target, 'table');
            if (target && target.nodeName !== 'A' && target.nodeName !== 'IMG' && (target.nodeName === 'TD' || target.nodeName === 'TH' ||
                target.nodeName === 'TABLE' || (closestTable && this.parent.getEditPanel().contains(closestTable)))
                && !(range.startContainer.nodeType === 3 && !range.collapsed)) {
                let range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.getDocument());
                this.parent.formatter.editorManager.nodeSelection.save(range, this.parent.getDocument());
                this.parent.formatter.editorManager.nodeSelection.Clear(this.parent.getDocument());
                let pageY: number = (this.parent.iframeSettings.enable) ? window.pageYOffset +
                    this.parent.element.getBoundingClientRect().top + args.clientY : args.pageY;
                this.quickToolObj.showTableQTBar(args.pageX, pageY, target as HTMLElement, 'Table');
                this.parent.formatter.editorManager.nodeSelection.restore();
            } else {
                this.hideTableQuickToolbar();
            }
        }
    }
    private hideTableQuickToolbar(): void {
        if (this.quickToolObj) {
            this.quickToolObj.hideTableQTBar();
        }
    }
    private onToolbarAction(args: ITableNotifyArgs): void {
        let item: IToolbarItemModel = (args.args as ClickEventArgs).item as IToolbarItemModel;
        switch (item.subCommand) {
            case 'TableHeader':
                this.tableHeader(args.selection, args.args as ClickEventArgs);
                break;
            case 'TableRemove':
                this.removeTable(args.selection, args.args as ClickEventArgs);
                break;
            case 'TableEditProperties':
                this.editTable(args);
                break;
        }
    }
    private tableHeader(selection: NodeSelection, e: ClickEventArgs | KeyboardEvent): void {
        this.parent.formatter.process(
            this.parent, e,
            (e as ClickEventArgs).originalEvent,
            { selection: selection, subCommand: ((e as ClickEventArgs).item as IDropDownItemModel).subCommand });
    }
    private removeTable(selection: NodeSelection, args?: ClickEventArgs | KeyboardEventArgs, delKey?: boolean): void {
        let cmd: { [key: string]: object };
        if (delKey) { cmd = { item: { command: 'Table', subCommand: 'TableRemove' } }; }
        let value: ITableArgs = {
            selection: selection,
            subCommand: (delKey) ? (cmd.item as ITableArgs).subCommand : ((args as ClickEventArgs).item as IDropDownItemModel).subCommand
        };
        this.parent.formatter.process(
            this.parent, (delKey) ? cmd : args, (args as ClickEventArgs).originalEvent, value);
        (this.parent.getEditPanel() as HTMLElement).focus();
        this.removeResizeEle();
        this.hideTableQuickToolbar();
    }
    private editTable(args: ITableArgs): void {
        let selectNode: HTMLElement = (args as ITableNotifyArgs).selectParent[0] as HTMLElement;
        this.tableNotifyArgs.selectNode = (args as ITableNotifyArgs).selectParent;
        let width: string | number = closest(selectNode, 'table').getClientRects()[0].width;
        let padding: string | number = (closest(selectNode, 'td') as HTMLElement).style.padding;
        let spacing: string | number = (closest(selectNode, 'table') as HTMLElement).getAttribute('cellspacing');
        this.hideTableQuickToolbar();
        this.createDialog(
            {
                width: width,
                padding: parseFloat((padding !== '' ? parseInt(padding, null) : 0).toString()),
                spacing: parseFloat((spacing !== '' && !isNOU(spacing) ? parseInt(spacing, null) : 0).toString())
            },
            'Edit'
        );
    }
    private dropdownSelect(e: ClickEventArgs): void {
        this.parent.observer.notify(events.selectionSave, {});
        let item: IDropDownItemModel = e.item as IDropDownItemModel;
        if (!document.body.contains(document.body.querySelector('.e-rte-quick-toolbar')) || item.command !== 'Table') {
            return;
        }
        let range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.getDocument());
        let args: ITableNotifyArgs = {
            args: e,
            selection: this.parent.formatter.editorManager.nodeSelection.save(range, this.parent.getDocument()),
            selectParent: this.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range)
        };
        switch (item.subCommand) {
            case 'InsertRowBefore':
            case 'InsertRowAfter':
                this.addRow(args.selection, e);
                break;
            case 'InsertColumnLeft':
            case 'InsertColumnRight':
                this.addColumn(args.selection, e);
                break;
            case 'DeleteColumn':
            case 'DeleteRow':
                this.removeRowColumn(args.selection, e);
                break;
            case 'AlignTop':
            case 'AlignMiddle':
            case 'AlignBottom':
                this.verticalAlign(args, e);
                break;
            case 'Dashed':
            case 'Alternate':
                this.tableStyles(args, item.subCommand);
                break;
        }
    }
    private addRow(selectCell: NodeSelection, e: ClickEventArgs | KeyboardEvent, tabKey?: boolean): void {
        let cmd: { [key: string]: object };
        if (tabKey) {
            cmd = {
                item: { command: 'Table', subCommand: 'InsertRowAfter' }
            };
        }
        let value: ITableArgs = {
            selection: selectCell,
            subCommand: (tabKey) ? (cmd.item as ITableArgs).subCommand : ((e as ClickEventArgs).item as IDropDownItemModel).subCommand
        };
        this.parent.formatter.process(this.parent, (tabKey) ? cmd : e, e, value);
    }
    private addColumn(selectCell: NodeSelection, e: ClickEventArgs): void {
        this.parent.formatter.process(
            this.parent, e, e,
            { selection: selectCell, width: this.parent.tableSettings.width, subCommand: (e.item as IDropDownItemModel).subCommand });
    }
    private removeRowColumn(selectCell: NodeSelection, e: ClickEventArgs): void {
        this.parent.observer.notify(events.selectionRestore, {});
        this.parent.formatter.process(this.parent, e, e, { selection: selectCell, subCommand: (e.item as IDropDownItemModel).subCommand });
        this.hideTableQuickToolbar();
        this.parent.observer.notify(events.selectionSave, {});
    }
    private verticalAlign(args: ITableNotifyArgs, e: ClickEventArgs): void {
        let tdEle: Element = closest(args.selectParent[0], 'td') || closest(args.selectParent[0], 'th');
        if (tdEle) {
            this.parent.formatter.process(this.parent, e, e, { tableCell: tdEle, subCommand: (e.item as IDropDownItemModel).subCommand });
        }
    }
    private tableStyles(args: ITableNotifyArgs, command: string): void {
        let table: HTMLTableElement = closest(args.selectParent[0], 'table') as HTMLTableElement;
        if (command === 'Dashed') {
            (this.parent.element.classList.contains(classes.CLS_TB_DASH_BOR)) ?
                this.parent.element.classList.remove(classes.CLS_TB_DASH_BOR) : this.parent.element.classList.add(classes.CLS_TB_DASH_BOR);
            (table.classList.contains(classes.CLS_TB_DASH_BOR)) ? table.classList.remove(classes.CLS_TB_DASH_BOR) :
                table.classList.add(classes.CLS_TB_DASH_BOR);
        }
        if (command === 'Alternate') {
            (this.parent.element.classList.contains(classes.CLS_TB_ALT_BOR)) ?
                this.parent.element.classList.remove(classes.CLS_TB_ALT_BOR) : this.parent.element.classList.add(classes.CLS_TB_ALT_BOR);
            (table.classList.contains(classes.CLS_TB_ALT_BOR)) ? table.classList.remove(classes.CLS_TB_ALT_BOR) :
                table.classList.add(classes.CLS_TB_ALT_BOR);
        }
        this.parent.formatter.saveData();
        this.parent.formatter.editorManager.nodeSelection.restore();
        this.hideTableQuickToolbar();
    }
    private setBGColor(args: IColorPickerEventArgs): void {
        let range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.getDocument());
        let selection: NodeSelection = this.parent.formatter.editorManager.nodeSelection.save(range, this.parent.getDocument());
        let selectedCell: Node = selection.range.startContainer;
        selectedCell = (selectedCell.nodeType === 3) ? closest(selectedCell.parentNode, 'td,th') : closest(selectedCell, 'td, th');
        if (selectedCell && (selectedCell.nodeName === 'TD' || selectedCell.nodeName === 'TH')) {
            let items: NodeListOf<Element> = closest(selectedCell, 'table').querySelectorAll('.' + classes.CLS_TABLE_SEL);
            for (let i: number = 0; i < items.length; i++) {
                (items[i] as HTMLElement).style.backgroundColor = args.item.value;
            }
            this.parent.formatter.saveData();
        }
        this.hideTableQuickToolbar();
    }
    //#endregion
    //#region Event handler methods
    private keyDown(e: NotifyArgs): void {
        let event: KeyboardEventArgs = e.args as KeyboardEventArgs;
        let proxy: this = this;
        switch (event.action) {
            case 'escape':
                break;
            case 'insert-table':
                if (this.parent.editorMode === 'HTML') {
                    let docElement: Document = this.parent.getDocument();
                    let range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(docElement);
                    let selection: NodeSelection = this.parent.formatter.editorManager.nodeSelection.save(range, docElement);
                    this.parent.observer.notify(events.selectionSave, {});
                    let args: ClickEventArgs = <ClickEventArgs>{
                        originalEvent: e.args,
                        item: {
                            command: 'Table',
                            subCommand: 'CreateTable'
                        }
                    };
                    this.tableNotifyArgs = { args: args, selection: selection };
                    this.insertTableDialog();
                }
                event.preventDefault();
                break;
        }
        if (!isNOU(this.parent.formatter.editorManager.nodeSelection) && this.parent.getEditPanel()
            && event.code !== 'KeyK') {
            let range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.getDocument());
            let selection: NodeSelection = this.parent.formatter.editorManager.nodeSelection.save(range, this.parent.getDocument());
            let ele: HTMLElement = this.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range)[0] as HTMLElement;
            ele = (ele && ele.tagName !== 'TD' && ele.tagName !== 'TH') ? ele.parentElement : ele;
            if (((event as KeyboardEventArgs).keyCode === 8 || (event as KeyboardEventArgs).keyCode === 46) ||
                (event.ctrlKey && (event as KeyboardEventArgs).keyCode === 88)) {
                if (ele && ele.tagName === 'TBODY') {
                    event.preventDefault();
                    proxy.removeTable(selection, event as KeyboardEventArgs, true);
                } else if (ele && ele.querySelectorAll('table').length > 0) {
                    this.removeResizeEle();
                }
            }
            if (ele && ele.tagName !== 'TD' && ele.tagName !== 'TH') {
                let closestTd: HTMLElement = closest(ele, 'td') as HTMLElement;
                ele = !isNOU(closestTd) && this.parent.inputElement.contains(closestTd) ? closestTd : ele;
            }
            if (ele && (ele.tagName === 'TD' || ele.tagName === 'TH')) {
                switch ((event as KeyboardEventArgs).keyCode) {
                    case 9:
                    case 37:
                    case 39:
                        proxy.tabSelection(event, selection, ele);
                        break;
                    case 40:
                    case 38:
                        proxy.tableArrowNavigation(event, selection, ele);
                        break;
                }
            }
        }
    }
    private docClick(e: { [key: string]: object }): void {
        let target: HTMLElement = <HTMLElement>(e.args as MouseEvent).target;
        let createDlg: HTMLElement = this.parent.element.querySelector('.e-rte-table-popup');
        let insertDlg: HTMLElement = this.parent.element.querySelector('.e-rte-edit-table');
        if (target && target.classList && ((createDlg && !closest(target, '#' + createDlg.id) ||
            (insertDlg && !closest(target, '#' + insertDlg.id)))) && !target.classList.contains('e-create-table') &&
            target.offsetParent && !target.offsetParent.classList.contains('e-rte-backgroundcolor-dropdown')) {
            if (createDlg) {
                this.parent.dotNetRef.invokeMethodAsync('CloseCreateTableDialog');
            }
            if (insertDlg) {
                this.parent.dotNetRef.invokeMethodAsync('CloseTableDialog');
            }
            this.parent.isBlur = true;
            dispatchEvent(this.parent.element, 'focusout');
        }
        let closestEle: Element = closest(target, 'td');
        let isExist: boolean = closestEle && this.parent.getEditPanel().contains(closestEle) ? true : false;
        if (target && target.tagName !== 'TD' && target.tagName !== 'TH' && !isExist &&
            closest(target, '.e-rte-quick-popup') === null && target.offsetParent &&
            !target.offsetParent.classList.contains('e-quick-dropdown') &&
            !target.offsetParent.classList.contains('e-rte-backgroundcolor-dropdown') && !closest(target, '.e-rte-dropdown-popup')
            && !closest(target, '.e-rte-elements')) {
            removeClass(this.parent.element.querySelectorAll('table td'), classes.CLS_TABLE_SEL);
            if (!Browser.isIE) { this.hideTableQuickToolbar(); }
        }
        if (target && target.classList && !target.classList.contains(classes.CLS_TB_COL_RES) &&
            !target.classList.contains(classes.CLS_TB_ROW_RES) && !target.classList.contains(classes.CLS_TB_BOX_RES)) {
            this.removeResizeEle();
        }
    }
    //#endregion
    public destroy(): void {
        this.removeEventListener();
    }
}