import { detach, closest, Browser, L10n, isNullOrUndefined as isNOU, isBlazor } from '@syncfusion/ej2-base';
import { isNullOrUndefined, EventHandler, addClass, removeClass, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { IRichTextEditor, IRenderer, IDropDownItemModel, OffsetPosition, ResizeArgs } from '../base/interface';
import { IColorPickerEventArgs, ITableArgs, ITableNotifyArgs, IToolbarItemModel, NotifyArgs } from '../base/interface';
import { Dialog, Popup } from '@syncfusion/ej2-popups';
import { DialogModel } from '@syncfusion/ej2-popups';
import { Button } from '@syncfusion/ej2-buttons';
import * as events from '../base/constant';
import { ServiceLocator } from '../services/service-locator';
import { NodeSelection } from '../../selection/selection';
import { RendererFactory } from '../services/renderer-factory';
import { RenderType } from '../base/enum';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import * as classes from '../base/classes';
import { dispatchEvent, parseHtml, hasClass } from '../base/util';
import { EditorManager } from '../../editor-manager';
import { DialogRenderer } from './dialog-renderer';
/**
 * `Table` module is used to handle table actions.
 */
export class Table {
    public ensureInsideTableList: boolean = true;
    public element: HTMLElement;
    private rteID: string;
    private parent: IRichTextEditor;
    private dlgDiv: HTMLElement;
    private tblHeader: HTMLElement;
    public popupObj: Popup;
    public editdlgObj: Dialog;
    private contentModule: IRenderer;
    private rendererFactory: RendererFactory;
    private quickToolObj: IRenderer;
    private resizeBtnStat: { [key: string]: boolean };
    private pageX: number = null;
    private pageY: number = null;
    private curTable: HTMLTableElement;
    private activeCell: HTMLElement;
    private colIndex: number;
    private columnEle: HTMLTableDataCellElement;
    private rowTextBox: NumericTextBox;
    private columnTextBox: NumericTextBox;
    private rowEle: HTMLTableRowElement;
    private l10n: L10n;
    private moveEle: HTMLElement = null;
    private helper: HTMLElement;
    private dialogRenderObj: DialogRenderer;
    private constructor(parent?: IRichTextEditor, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.rteID = parent.element.id;
        this.l10n = serviceLocator.getService<L10n>('rteLocale');
        this.rendererFactory = serviceLocator.getService<RendererFactory>('rendererFactory');
        this.dialogRenderObj = serviceLocator.getService<DialogRenderer>('dialogRenderObject');
        this.addEventListener();

    }

    protected addEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.createTable, this.renderDlgContent, this);
        this.parent.on(events.initialEnd, this.afterRender, this);
        this.parent.on(events.dynamicModule, this.afterRender, this);
        this.parent.on(events.docClick, this.docClick, this);
        this.parent.on(events.editAreaClick, this.editAreaClickHandler, this);
        this.parent.on(events.clearDialogObj, this.clearDialogObj, this);
        this.parent.on(events.tableToolbarAction, this.onToolbarAction, this);
        this.parent.on(events.dropDownSelect, this.dropdownSelect, this);
        this.parent.on(events.keyDown, this.keyDown, this);
        this.parent.on(events.mouseUp, this.selectionTable, this);
        this.parent.on(events.destroy, this.destroy, this);
    }

    protected removeEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.createTable, this.renderDlgContent);
        this.parent.off(events.initialEnd, this.afterRender);
        this.parent.off(events.dynamicModule, this.afterRender);
        this.parent.off(events.docClick, this.docClick);
        this.parent.off(events.editAreaClick, this.editAreaClickHandler);
        this.parent.off(events.clearDialogObj, this.clearDialogObj);
        this.parent.off(events.tableToolbarAction, this.onToolbarAction);
        this.parent.off(events.dropDownSelect, this.dropdownSelect);
        this.parent.off(events.mouseDown, this.cellSelect);
        this.parent.off(events.tableColorPickerChanged, this.setBGColor);
        this.parent.off(events.keyDown, this.keyDown);
        this.parent.off(events.mouseUp, this.selectionTable);
        this.parent.off(events.destroy, this.destroy);
    }

    private selectionTable(e: ITableNotifyArgs): void {
        const target: HTMLTableCellElement = (e.args as MouseEvent).target as HTMLTableCellElement;
        if (Browser.info.name === 'mozilla' && !isNOU(closest(target, 'table')) && closest(target, 'table').tagName === 'TABLE') {
            this.parent.contentModule.getEditPanel().setAttribute('contenteditable', 'true');
        }
    }

    private afterRender(): void {
        this.contentModule = this.rendererFactory.getRenderer(RenderType.Content);
        this.parent.on(events.tableColorPickerChanged, this.setBGColor, this);
        this.parent.on(events.mouseDown, this.cellSelect, this);
        if (this.parent.tableSettings.resize) {
            EventHandler.add(this.parent.contentModule.getEditPanel(), Browser.touchStartEvent, this.resizeStart, this);
        }
        if (!Browser.isDevice && this.parent.tableSettings.resize) {
            EventHandler.add(this.contentModule.getEditPanel(), 'mouseover', this.resizeHelper, this);
        }
    }

    private dropdownSelect(e: ClickEventArgs): void {
        const item: IDropDownItemModel = e.item as IDropDownItemModel;
        if (!document.body.contains(document.body.querySelector('.e-rte-quick-toolbar')) || item.command !== 'Table') {
            return;
        }
        const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
        const args: ITableNotifyArgs = {
            args: e,
            selection: this.parent.formatter.editorManager.nodeSelection.save(range, this.contentModule.getDocument()),
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
        case 'Merge':
        case 'VerticalSplit':
        case 'HorizontalSplit':
            this.UpdateCells(args.selection , e);
            break;
        
        }
    }

    private UpdateCells(selectCell: NodeSelection, e: ClickEventArgs): void {
        this.parent.formatter.process(this.parent, e, e, { selection: selectCell, subCommand: (e.item as IDropDownItemModel).subCommand });
        this.hideTableQuickToolbar();
    }

    private keyDown(e: NotifyArgs): void {
        const event: KeyboardEventArgs = e.args as KeyboardEventArgs;
        // eslint-disable-next-line
        const proxy: this = this;
        switch (event.action) {
        case 'escape':
            break;
        case 'insert-table':
            if (this.parent.editorMode === 'HTML') {
                const docElement: Document = this.parent.contentModule.getDocument();
                const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(docElement);
                const selection: NodeSelection = this.parent.formatter.editorManager.nodeSelection.save(range, docElement);
                const  args: ClickEventArgs = <ClickEventArgs>{
                    originalEvent: e.args,
                    item: {
                        command: 'Table',
                        subCommand: 'CreateTable'
                    }
                };
                this.insertTableDialog({
                    self: this,
                    args: args, selection: selection
                } as NotifyArgs);
            }
            event.preventDefault();
            break;
        }
        if (!isNullOrUndefined(this.parent.formatter.editorManager.nodeSelection) && this.contentModule
        && event.code !== 'KeyK') {
            const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
            const selection: NodeSelection = this.parent.formatter.editorManager.
                nodeSelection.save(range, this.contentModule.getDocument());
            let ele: HTMLElement = this.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range)[0] as HTMLElement;
            ele = (ele && ele.tagName !== 'TD' && ele.tagName !== 'TH') ? ele.parentElement : ele;
            if (((event as KeyboardEventArgs).keyCode === 8 || (event as KeyboardEventArgs).keyCode === 46) ||
            (event.ctrlKey && (event as KeyboardEventArgs).keyCode === 88)) {
                if (ele && ele.tagName === 'TBODY') {
                    event.preventDefault();
                    proxy.removeTable(selection, event as KeyboardEventArgs, true);
                } else if (ele && ele.querySelectorAll('table').length > 0) {
                    this.removeResizeElement();
                }
            }
            if (ele && ele.tagName !== 'TD' && ele.tagName !== 'TH') {
                const closestTd: HTMLElement = closest(ele, 'td') as HTMLElement;
                ele = !isNullOrUndefined(closestTd) && this.parent.inputElement.contains(closestTd) ? closestTd : ele;
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

    private onToolbarAction(args: ITableNotifyArgs): void {
        const item: IToolbarItemModel = (args.args as ClickEventArgs).item as IToolbarItemModel;
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
    private verticalAlign(args: ITableNotifyArgs, e: ClickEventArgs): void {
        const tdEle : Element = closest(args.selectParent[0], 'td') || closest(args.selectParent[0], 'th');
        if (tdEle) {
            this.parent.formatter.process(this.parent, e, e, { tableCell: tdEle, subCommand: (e.item as IDropDownItemModel).subCommand });
        }
    }

    private tableStyles(args: ITableNotifyArgs, command: string): void {
        const table: HTMLTableElement = closest(args.selectParent[0], 'table') as HTMLTableElement;
        if (command === 'Dashed') {
            /* eslint-disable */
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
                /* eslint-enable */
        }
        this.parent.formatter.saveData();
        this.parent.formatter.editorManager.nodeSelection.restore();
    }
    private insideList(range: Range): boolean {
        const blockNodes: Element[] = <Element[]>(this.parent.formatter.editorManager as EditorManager).domNode.blockNodes();
        const nodes: Element[] = [];
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

    private tabSelection(event: KeyboardEvent, selection: NodeSelection, ele: HTMLElement): void {
        const insideList: boolean = this.insideList(selection.range);
        if ((event.keyCode === 37 || event.keyCode === 39) && selection.range.startContainer.nodeType === 3 ||
            insideList) {
            return;
        }
        event.preventDefault();
        ele.classList.remove(classes.CLS_TABLE_SEL);
        if (!event.shiftKey && event.keyCode !== 37) {
            let nextElement: HTMLElement | Element | Node = (!isNullOrUndefined(ele.nextSibling)) ? ele.nextSibling :
                (!isNullOrUndefined(closest(ele, 'tr').nextSibling) ? closest(ele, 'tr').nextSibling.childNodes[0] :
                    (!isNullOrUndefined(closest(ele, 'table').nextSibling)) ?
                        (closest(ele, 'table').nextSibling.nodeName.toLowerCase() === 'td') ?
                            closest(ele, 'table').nextSibling : ele : ele);
            if (ele === nextElement && ele.nodeName === 'TH') {
                nextElement = (closest(ele, 'table') as HTMLTableElement).rows[1].cells[0];
            }
            if (event.keyCode === 39 && ele === nextElement) {
                nextElement = closest(ele, 'table').nextSibling;
            }
            if (nextElement) {
                // eslint-disable-next-line
                (nextElement.textContent.trim() !== '' && closest(nextElement, 'td')) ?
                    selection.setSelectionNode(this.contentModule.getDocument(), nextElement) :
                    selection.setSelectionText(this.contentModule.getDocument(), nextElement, nextElement, 0, 0);
            }
            if (ele === nextElement && event.keyCode !== 39 && nextElement) {
                ele.classList.add(classes.CLS_TABLE_SEL);
                this.addRow(selection, event, true);
                ele.classList.remove(classes.CLS_TABLE_SEL);
                nextElement = nextElement.parentElement.nextSibling.firstChild as HTMLElement;
                // eslint-disable-next-line
                (nextElement.textContent.trim() !== '' && closest(nextElement, 'td')) ?
                    selection.setSelectionNode(this.contentModule.getDocument(), nextElement) :
                    selection.setSelectionText(this.contentModule.getDocument(), nextElement, nextElement, 0, 0);
            }
        } else {
            let prevElement: HTMLElement | Node = (!isNullOrUndefined(ele.previousSibling)) ? ele.previousSibling :
                (!isNullOrUndefined(closest(ele, 'tr').previousSibling) ?
                    closest(ele, 'tr').previousSibling.childNodes[closest(ele, 'tr').previousSibling.childNodes.length - 1] :
                    (!isNullOrUndefined(closest(ele, 'table').previousSibling)) ?
                        (closest(ele, 'table').previousSibling.nodeName.toLowerCase() === 'td') ? closest(ele, 'table').previousSibling :
                            ele : ele);
            if (ele === prevElement && (ele as HTMLTableDataCellElement).cellIndex === 0 &&
                (closest(ele, 'table') as HTMLTableElement).tHead) {
                const clsTble: HTMLTableElement = closest(ele, 'table') as HTMLTableElement;
                prevElement = clsTble.rows[0].cells[clsTble.rows[0].cells.length - 1];
            }
            if (event.keyCode === 37 && ele === prevElement) {
                prevElement = closest(ele, 'table').previousSibling;
            }
            if (prevElement) {
                // eslint-disable-next-line
                (prevElement.textContent.trim() !== '' && closest(prevElement, 'td')) ?
                    selection.setSelectionNode(this.contentModule.getDocument(), prevElement) :
                    selection.setSelectionText(this.contentModule.getDocument(), prevElement, prevElement, 0, 0);
            }
        }
    }
    private tableArrowNavigation(event: KeyboardEvent, selection: NodeSelection, ele: HTMLElement): void {
        const selText: Node = selection.range.startContainer;
        if ((event.keyCode === 40 && selText.nodeType === 3 && (selText.nextSibling && selText.nextSibling.nodeName === 'BR' ||
            selText.parentNode && selText.parentNode.nodeName !== 'TD')) ||
            (event.keyCode === 38 && selText.nodeType === 3 && (selText.previousSibling && selText.previousSibling.nodeName === 'BR' ||
                selText.parentNode && selText.parentNode.nodeName !== 'TD'))) {
            return;
        }
        event.preventDefault();
        ele.classList.remove(classes.CLS_TABLE_SEL);
        if (event.keyCode === 40) {
            ele = (!isNullOrUndefined(closest(ele, 'tr').nextElementSibling)) ?
                (closest(ele, 'tr').nextElementSibling as Element).children[(ele as HTMLTableDataCellElement).cellIndex] as HTMLElement :
                ((closest(ele, 'table') as HTMLTableElement).tHead && ele.nodeName === 'TH') ?
                    (closest(ele, 'table') as HTMLTableElement).rows[1].cells[(ele as HTMLTableDataCellElement).cellIndex] :
                    (!isNullOrUndefined(closest(ele, 'table').nextSibling)) ? closest(ele, 'table').nextSibling as HTMLElement :
                        ele as HTMLElement;
        } else {
            ele = (!isNullOrUndefined(closest(ele, 'tr').previousElementSibling)) ?
                (closest(ele, 'tr').previousElementSibling as Element).children[(ele as HTMLTableDataCellElement).cellIndex] as HTMLElement :
                ((closest(ele, 'table') as HTMLTableElement).tHead && ele.nodeName !== 'TH') ?
                    (closest(ele, 'table') as HTMLTableElement).tHead.rows[0].cells[(ele as HTMLTableDataCellElement).cellIndex] :
                    (!isNullOrUndefined(closest(ele, 'table').previousSibling)) ? closest(ele, 'table').previousSibling as HTMLElement :
                        ele as HTMLElement;
        }
        if (ele) {
            selection.setSelectionText(this.contentModule.getDocument(), ele, ele, 0, 0);
        }
    }
    private setBGColor(args: IColorPickerEventArgs): void {
        const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.contentModule.getDocument());
        const selection: NodeSelection = this.parent.formatter.editorManager.nodeSelection.save(range, this.contentModule.getDocument());
        let selectedCells = this.curTable.querySelectorAll(".e-cell-select");
        for (let i: number = 0; i < selectedCells.length; i++) {
            (selectedCells[i] as HTMLElement).style.backgroundColor = args.item.value;
        }
        this.parent.formatter.saveData();
    }

    private hideTableQuickToolbar(): void {
        if (this.quickToolObj && this.quickToolObj.tableQTBar && document.body.contains(this.quickToolObj.tableQTBar.element)) {
            this.quickToolObj.tableQTBar.hidePopup();
        }
    }

    private tableHeader(selection: NodeSelection, e: ClickEventArgs | KeyboardEvent): void {
        this.parent.formatter.process(
            this.parent, e,
            (e as ClickEventArgs).originalEvent,
            { selection: selection, subCommand: ((e as ClickEventArgs).item as IDropDownItemModel).subCommand });
    }
    private editAreaClickHandler(e: ITableNotifyArgs): void {
        if (this.parent.readonly) {
            return;
        }
        const args: MouseEvent = e.args as MouseEvent;
        const showOnRightClick: boolean = this.parent.quickToolbarSettings.showOnRightClick;
        if (args.which === 2 || (showOnRightClick && args.which === 1) || (!showOnRightClick && args.which === 3)) {
            return;
        }
        if (this.parent.editorMode === 'HTML' && this.parent.quickToolbarModule && this.parent.quickToolbarModule.tableQTBar) {
            this.quickToolObj = this.parent.quickToolbarModule;
            const target: HTMLElement = args.target as HTMLElement;
            this.contentModule = this.rendererFactory.getRenderer(RenderType.Content);
            const isPopupOpen: boolean = this.quickToolObj.tableQTBar.element.classList.contains('e-rte-pop');
            if (isPopupOpen) {
                return;
            }
            const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.contentModule.getDocument());
            const closestTable: Element = closest(target, 'table');
            if (target && target.nodeName !== 'A' && target.nodeName !== 'IMG' && (target.nodeName === 'TD' || target.nodeName === 'TH' ||
                target.nodeName === 'TABLE' || (closestTable && this.parent.contentModule.getEditPanel().contains(closestTable)))
                && !(range.startContainer.nodeType === 3 && !range.collapsed)) {
                const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.contentModule.getDocument());
                this.parent.formatter.editorManager.nodeSelection.save(range, this.contentModule.getDocument());
                this.parent.formatter.editorManager.nodeSelection.Clear(this.contentModule.getDocument());
                const pageY: number = (this.parent.iframeSettings.enable) ? window.pageYOffset +
                    this.parent.element.getBoundingClientRect().top + args.clientY : args.pageY;
                this.quickToolObj.tableQTBar.showPopup(args.pageX, pageY, target as Element);
                this.parent.formatter.editorManager.nodeSelection.restore();
            } else {
                this.hideTableQuickToolbar();
            }
        }
    }
    private tableCellSelect(e?: MouseEvent): void {
        const target: EventTarget = e.target;
        const row: number = Array.prototype.slice.call(
            (target as HTMLElement).parentElement.parentElement.children).indexOf((target as HTMLElement).parentElement);
        const col: number = Array.prototype.slice.call((target as HTMLElement).parentElement.children).indexOf(target);
        const list: Element[] = <NodeListOf<Element> & Element[]>this.dlgDiv.querySelectorAll('.e-rte-tablecell');
        Array.prototype.forEach.call(list, (item: HTMLElement): void => {
            const parentIndex: number = Array.prototype.slice.call(item.parentElement.parentElement.children).indexOf(item.parentElement);
            const cellIndex: number = Array.prototype.slice.call(item.parentElement.children).indexOf(item);
            removeClass([item], 'e-active');
            if (parentIndex <= row && cellIndex <= col) {
                addClass([item], 'e-active');
            }
        });
        this.tblHeader.innerHTML = (col + 1) + 'x' + (row + 1);
    }

    private tableMouseUp(e?: MouseEvent): void {
         EventHandler.remove(this.curTable, 'mousemove', this.tableMove);
    }

    // eslint-disable-next-line
    private tableCellLeave(e?: MouseEvent): void {
        removeClass(this.dlgDiv.querySelectorAll('.e-rte-tablecell'), 'e-active');
        addClass([this.dlgDiv.querySelector('.e-rte-tablecell')], 'e-active');
        this.tblHeader.innerHTML = 1 + 'x' + 1;
    }
    private tableCellClick(e: MouseEvent): void {
        const target: EventTarget = e.target;
        const row: number = Array.prototype.slice.call(
            (target as HTMLElement).parentElement.parentElement.children).indexOf((target as HTMLElement).parentElement) + 1;
        const col: number = Array.prototype.slice.call((target as HTMLElement).parentElement.children).indexOf(target) + 1;
        (this as ITableNotifyArgs).self.tableInsert(row, col, e, this as ITableNotifyArgs);
    }

    private tableInsert(row: number, col: number, e: MouseEvent, selectionObj?: ITableNotifyArgs): void {
        const proxy: Table = (selectionObj.self) ? selectionObj.self : this;
        const startContainer: Node = selectionObj.selection.range.startContainer;
        if (startContainer.nodeName === 'P' && startContainer.textContent.trim() === '' && !(startContainer.childNodes.length > 0)) {
            (startContainer as Element).innerHTML = '<br />';
        }
        const parentNode: Node = startContainer.parentNode;
        if (proxy.parent.editorMode === 'HTML' &&
            ((proxy.parent.iframeSettings.enable && !hasClass(parentNode.ownerDocument.querySelector('body'), 'e-lib')) ||
                (!proxy.parent.iframeSettings.enable && isNOU(closest(parentNode, '[id=' + "'" + proxy.contentModule.getPanel().id + "'" +']'))))) {
            (proxy.contentModule.getEditPanel() as HTMLElement).focus();
            const range: Range = proxy.parent.formatter.editorManager.nodeSelection.getRange(proxy.contentModule.getDocument());
            selectionObj.selection = proxy.parent.formatter.editorManager.nodeSelection.save(
                range, proxy.contentModule.getDocument());
        }
        const value: ITableArgs = {
            row: row, columns: col, width: {
                minWidth: proxy.parent.tableSettings.minWidth,
                maxWidth: proxy.parent.tableSettings.maxWidth,
                width: proxy.parent.tableSettings.width
            },
            selection: selectionObj.selection
        };
        if (proxy.popupObj) {
            proxy.popupObj.hide();
        }
        if (proxy.editdlgObj) {
            proxy.editdlgObj.hide();
        }
        proxy.parent.formatter.process(
            proxy.parent, selectionObj.args, (selectionObj.args as ClickEventArgs).originalEvent, value);
        (proxy.contentModule.getEditPanel() as HTMLElement).focus();
        proxy.parent.on(events.mouseDown, proxy.cellSelect, proxy);
    }

    private cellSelect(e: ITableNotifyArgs): void {
        let target: HTMLTableCellElement = (e.args as MouseEvent).target as HTMLTableCellElement;
        const tdNode: Element = closest(target, 'td,th') as HTMLTableCellElement;
        target = (target.nodeName !== 'TD' && tdNode && this.parent.contentModule.getEditPanel().contains(tdNode)) ?
            tdNode as HTMLTableCellElement : target;
        removeClass(this.contentModule.getEditPanel().querySelectorAll('table td, table th'), classes.CLS_TABLE_SEL);
        if (target && (target.tagName === 'TD' || target.tagName === 'TH')) {
            target.removeAttribute('class');
            addClass([target], classes.CLS_TABLE_SEL);
            this.activeCell = target;
            this.curTable = (this.curTable) ? this.curTable : closest(target, 'table') as HTMLTableElement;
            EventHandler.add(this.curTable, 'mousemove', this.tableMove, this);
            EventHandler.add(this.curTable, 'mouseup', this.tableMouseUp, this);
            this.removeResizeElement();
            if (this.helper && this.contentModule.getEditPanel().contains(this.helper)) {
                detach(this.helper);
            }
        }
        if (Browser.info.name === 'mozilla' && !isNOU(closest(target, 'table')) &&
        closest(target, 'table').tagName === 'TABLE') {
            this.parent.contentModule.getEditPanel().setAttribute('contenteditable', 'false');
        }
    }

    private tableMove(event: MouseEvent) : void {
        this.parent.formatter.editorManager.observer.notify('TABLE_MOVE', {event: event , selectNode : [this.activeCell]});
    }

    private resizeHelper(e: PointerEvent | TouchEvent): void {
        if (this.parent.readonly) {
            return;
        }
        const target: HTMLElement = e.target as HTMLElement || (e as TouchEvent).targetTouches[0].target as HTMLElement;
        const closestTable: Element = closest(target, 'table');
        if (!isNOU(this.curTable) && !isNOU(closestTable) && closestTable !== this.curTable) {
            this.removeResizeElement();
            this.removeHelper(e as MouseEvent);
            this.cancelResizeAction();
        }
        if (target.nodeName === 'TABLE' || target.nodeName === 'TD' || target.nodeName === 'TH') {
            this.curTable = (closestTable && this.parent.contentModule.getEditPanel().contains(closestTable))
                && (target.nodeName === 'TD' || target.nodeName === 'TH') ?
                (closestTable as HTMLTableElement) : target as HTMLTableElement;
            this.removeResizeElement();
            this.tableResizeEleCreation(this.curTable, e as PointerEvent);
        }
    }

    private tableResizeEleCreation(table: HTMLTableElement, e: MouseEvent): void {
        this.parent.preventDefaultResize(e);
        const columns: NodeListOf<Element> = Array.prototype.slice.call(table.rows[0].cells, 1);
        const rows: Element[] = [];
        for (let i: number = 0; i < table.rows.length; i++) {
            rows.push(Array.prototype.slice.call(table.rows[i].cells, 0, 1)[0]);
        }
        const height: number = parseInt(getComputedStyle(table).height, 10);
        const width: number = parseInt(getComputedStyle(table).width, 10);
        const pos: OffsetPosition = this.calcPos(table);
        for (let i: number = 0; columns.length > i; i++) {
            const colReEle: HTMLElement = this.parent.createElement('span', {
                attrs: {
                    'data-col': (i + 1).toString(), 'unselectable': 'on', 'contenteditable': 'false'
                }
            });
            colReEle.classList.add(classes.CLS_RTE_TABLE_RESIZE, classes.CLS_TB_COL_RES);
            colReEle.style.cssText = 'height: ' + height + 'px; width: 4px; top: ' + pos.top +
                'px; left:' + (pos.left + this.calcPos(columns[i] as HTMLElement).left) + 'px;';
            this.contentModule.getEditPanel().appendChild(colReEle);
        }
        for (let i: number = 0; rows.length > i; i++) {
            const rowReEle: HTMLElement = this.parent.createElement('span', {
                attrs: {
                    'data-row': (i).toString(), 'unselectable': 'on', 'contenteditable': 'false'
                }
            });
            rowReEle.classList.add(classes.CLS_RTE_TABLE_RESIZE, classes.CLS_TB_ROW_RES);
            const rowPosLeft: number = !isNOU(table.getAttribute('cellspacing')) || table.getAttribute('cellspacing') !== '' ?
                0 : this.calcPos(rows[i] as HTMLElement).left;
            rowReEle.style.cssText = 'width: ' + width + 'px; height: 4px; top: ' +
                (this.calcPos(rows[i] as HTMLElement).top + pos.top + (rows[i] as HTMLElement).offsetHeight - 2) +
                'px; left:' + (rowPosLeft + pos.left) + 'px;';
            this.contentModule.getEditPanel().appendChild(rowReEle);
        }
        const tableReBox: HTMLElement = this.parent.createElement('span', {
            className: classes.CLS_TB_BOX_RES, attrs: {
                'data-col': columns.length.toString(), 'unselectable': 'on', 'contenteditable': 'false'
            }
        });
        tableReBox.style.cssText = 'top: ' + (pos.top + height - 4) +
            'px; left:' + (pos.left + width - 4) + 'px;';
        if (Browser.isDevice) {
            tableReBox.classList.add('e-rmob');
        }
        this.contentModule.getEditPanel().appendChild(tableReBox);
    }

    public removeResizeElement(): void {
        const item: NodeListOf<Element> = this.parent.contentModule.getEditPanel().
            querySelectorAll('.e-column-resize, .e-row-resize, .e-table-box');
        if (item.length > 0) {
            for (let i: number = 0; i < item.length; i++) {
                detach(item[i]);
            }
        }
    }
    private calcPos(elem: HTMLElement): OffsetPosition {
        let parentOffset: OffsetPosition = {
            top: 0,
            left: 0
        };
        const offset: OffsetPosition = elem.getBoundingClientRect();
        const doc: Document = elem.ownerDocument;
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

    private resizeStart(e: PointerEvent | TouchEvent): void {
        if (this.parent.readonly) {
            return;
        }
        if (Browser.isDevice) {
            this.resizeHelper(e);
        }
        const target: HTMLElement = e.target as HTMLElement;
        if (target.classList.contains(classes.CLS_TB_COL_RES) ||
            target.classList.contains(classes.CLS_TB_ROW_RES) ||
            target.classList.contains(classes.CLS_TB_BOX_RES)) {
            e.preventDefault();
            this.parent.preventDefaultResize(e as PointerEvent);
            removeClass(this.curTable.querySelectorAll('td,th'), classes.CLS_TABLE_SEL);
            this.parent.formatter.editorManager.nodeSelection.Clear(this.contentModule.getDocument());
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
            if (target.classList.contains(classes.CLS_TB_BOX_RES)) {
                this.resizeBtnStat.tableBox = true;
            }

            if (Browser.isDevice && this.helper && !this.helper.classList.contains('e-reicon')) {
                this.helper.classList.add('e-reicon');
                EventHandler.add(document, Browser.touchStartEvent, this.removeHelper, this);
                EventHandler.add(this.helper, Browser.touchStartEvent, this.resizeStart, this);
            } else {
                const args: ResizeArgs = isBlazor() ? { requestType: 'Table' } : { event: e, requestType: 'Table' };
                this.parent.trigger(events.resizeStart, args, (resizeStartArgs: ResizeArgs) => {
                    if (resizeStartArgs.cancel) {
                        this.cancelResizeAction();
                    }
                });
            }
            EventHandler.add(this.contentModule.getDocument(), Browser.touchMoveEvent, this.resizing, this);
            EventHandler.add(this.contentModule.getDocument(), Browser.touchEndEvent, this.resizeEnd, this);
        }
    }
    private removeHelper(e: MouseEvent): void {
        const cls: DOMTokenList = (e.target as HTMLElement).classList;
        if (!(cls.contains('e-reicon')) && this.helper) {
            EventHandler.remove(document, Browser.touchStartEvent, this.removeHelper);
            EventHandler.remove(this.helper, Browser.touchStartEvent, this.resizeStart);
            if (this.helper && this.contentModule.getEditPanel().contains(this.helper)) {
                detach(this.helper);
            }
            this.pageX = null;
            this.helper = null;
        }
    }
    private appendHelper(): void {
        this.helper = this.parent.createElement('div', {
            className: 'e-table-rhelper'
        });
        if (Browser.isDevice) {
            this.helper.classList.add('e-reicon');
        }
        this.contentModule.getEditPanel().appendChild(this.helper);
        this.setHelperHeight();
    }

    private setHelperHeight(): void {
        const pos: OffsetPosition = this.calcPos(this.curTable);
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
        const pos: OffsetPosition = this.calcPos(this.curTable);
        if (this.resizeBtnStat.column) {
            const left: number = pos.left + this.calcPos(this.columnEle as HTMLElement).left - 1;
            this.helper.style.left = left + 'px';
        } else {
            const top: number = this.calcPos(this.rowEle).top + pos.top + (this.rowEle as HTMLElement).offsetHeight;
            this.helper.style.top = top + 'px';
        }
    }

    private resizing(e: PointerEvent | TouchEvent): void {
        const pageX: number = this.getPointX(e);
        const pageY: number = this.getPointY(e);
        const mouseX: number = (this.parent.enableRtl) ? -(pageX - this.pageX) : (pageX - this.pageX);
        const mouseY: number = (this.parent.enableRtl) ? -(pageY - this.pageY) : (pageY - this.pageY);
        this.pageX = pageX;
        this.pageY = pageY;
        const args: ResizeArgs = isBlazor() ? { requestType: 'table' } : { event: e, requestType: 'table' };
        this.parent.trigger(events.onResize, args, (resizingArgs: ResizeArgs) => {
            if (resizingArgs.cancel) {
                this.cancelResizeAction();
            } else {
                const tableReBox: HTMLElement = this.contentModule.getEditPanel().querySelector('.e-table-box') as HTMLElement;
                const tableWidth: number = parseInt(getComputedStyle(this.curTable).width as string, 10);
                const tableHeight: number = parseInt(getComputedStyle(this.curTable).height as string, 10);
                const paddingSize: number = +getComputedStyle(this.contentModule.getEditPanel()).paddingRight.match(/\d/g).join('');
                const rteWidth: number = (this.contentModule.getEditPanel() as HTMLElement).offsetWidth - paddingSize * 2;
                if (this.resizeBtnStat.column) {
                    const cellColl: HTMLCollectionOf<Element> = this.curTable.rows[0].cells;
                    const width: number = parseFloat(this.columnEle.offsetWidth.toString());
                    const actualwid: number = width - mouseX;
                    const totalwid: number = parseFloat(this.columnEle.offsetWidth.toString()) +
                            parseFloat((cellColl[this.colIndex - 1] as HTMLElement).offsetWidth.toString());
                    for (let i: number = 0; i < this.curTable.rows.length; i++) {
                        if ((totalwid - actualwid) > 20 && actualwid > 20) {
                            const leftColumnWidth: number = totalwid - actualwid;
                            const rightColWidth: number = actualwid;
                            (this.curTable.rows[i].cells[this.colIndex - 1] as HTMLTableDataCellElement).style.width =
                                this.convertPixelToPercentage(leftColumnWidth, tableWidth) + '%';
                            (this.curTable.rows[i].cells[this.colIndex] as HTMLTableDataCellElement).style.width =
                                this.convertPixelToPercentage(rightColWidth, tableWidth) + '%';
                        }
                    }
                    this.updateHelper();
                } else if (this.resizeBtnStat.row) {
                    this.parent.preventDefaultResize(e as PointerEvent);
                    const height: number = parseFloat(this.rowEle.clientHeight.toString()) + mouseY;
                    if (height > 20) {
                        this.rowEle.style.height = height + 'px';
                    }
                    this.curTable.style.height = '';
                    if (!isNOU(tableReBox)) {
                        tableReBox.style.cssText = 'top: ' + (this.calcPos(this.curTable).top + tableHeight - 4) +
                        'px; left:' + (this.calcPos(this.curTable).left + tableWidth - 4) + 'px;';
                    }
                    this.updateHelper();
                } else if (this.resizeBtnStat.tableBox) {
                    if (!Browser.isDevice) {
                        EventHandler.remove(this.contentModule.getEditPanel(), 'mouseover', this.resizeHelper);
                    }
                    const widthType: boolean = this.curTable.style.width.indexOf('%') > -1;
                    this.curTable.style.width = widthType ? this.convertPixelToPercentage(tableWidth + mouseX, rteWidth) + '%'
                        : tableWidth + mouseX + 'px';
                    this.curTable.style.height = tableHeight + mouseY + 'px';
                    tableReBox.classList.add('e-rbox-select');
                    tableReBox.style.cssText = 'top: ' + (this.calcPos(this.curTable).top + tableHeight - 4) +
                        'px; left:' + (this.calcPos(this.curTable).left + tableWidth - 4) + 'px;';
                }
            }
        });
    }

    private convertPixelToPercentage(value: number, offsetValue: number): number {
        return (value / offsetValue) * 100;
    }

    private cancelResizeAction(): void {
        EventHandler.remove(this.contentModule.getDocument(), Browser.touchMoveEvent, this.resizing);
        EventHandler.remove(this.contentModule.getDocument(), Browser.touchEndEvent, this.resizeEnd);
        this.removeResizeElement();
    }
    private resizeEnd(e: PointerEvent | TouchEvent): void {
        this.resizeBtnInit();
        EventHandler.remove(this.contentModule.getDocument(), Browser.touchMoveEvent, this.resizing);
        EventHandler.remove(this.contentModule.getDocument(), Browser.touchEndEvent, this.resizeEnd);
        if (this.contentModule.getEditPanel().querySelector('.e-table-box') &&
            this.contentModule.getEditPanel().contains(this.contentModule.getEditPanel().querySelector('.e-table-box'))) {
            if (!Browser.isDevice) {
                EventHandler.add(this.contentModule.getEditPanel(), 'mouseover', this.resizeHelper, this);
            }
            this.removeResizeElement();
            if (this.helper && this.contentModule.getEditPanel().contains(this.helper)) {
                detach(this.helper); this.helper = null;
            }
            this.pageX = null;
            this.pageY = null;
            this.moveEle = null;
        }
        const args: ResizeArgs = isBlazor() ? { requestType: 'table' } : { event: e, requestType: 'table' };
        this.parent.trigger(events.resizeStop, args);
        this.parent.formatter.saveData();
    }

    private resizeBtnInit(): { [key: string]: boolean } {
        return this.resizeBtnStat = { column: false, row: false, tableBox: false };
    }
    private addRow(selectCell: NodeSelection, e: ClickEventArgs | KeyboardEvent, tabkey?: boolean): void {
        // eslint-disable-next-line
        let cmd: { [key: string]: object };
        if (tabkey) {
            cmd = {
                item: { command: 'Table', subCommand: 'InsertRowAfter' }
            };
        }
        const value: ITableArgs = {
            selection: selectCell,
            subCommand: (tabkey) ? (cmd.item as ITableArgs).subCommand : ((e as ClickEventArgs).item as IDropDownItemModel).subCommand
        };
        this.parent.formatter.process(this.parent, (tabkey) ? cmd : e, e, value);
    }
    private addColumn(selectCell: NodeSelection, e: ClickEventArgs): void {
        this.parent.formatter.process(
            this.parent, e, e,
            { selection: selectCell, width: this.parent.tableSettings.width, subCommand: (e.item as IDropDownItemModel).subCommand });
    }
    private removeRowColumn(selectCell: NodeSelection, e: ClickEventArgs): void {
        this.parent.formatter.process(this.parent, e, e, { selection: selectCell, subCommand: (e.item as IDropDownItemModel).subCommand });
        this.hideTableQuickToolbar();
    }
    private removeTable(selection: NodeSelection, args?: ClickEventArgs | KeyboardEventArgs, delKey?: boolean): void {
        // eslint-disable-next-line
        let cmd: { [key: string]: object };
        if (delKey) {
            cmd = { item: { command: 'Table', subCommand: 'TableRemove' }};
        }
        const value: ITableArgs = {
            selection: selection,
            subCommand: (delKey) ? (cmd.item as ITableArgs).subCommand : ((args as ClickEventArgs).item as IDropDownItemModel).subCommand
        };
        this.parent.formatter.process(
            this.parent, (delKey) ? cmd : args, (args as ClickEventArgs).originalEvent, value);
        (this.contentModule.getEditPanel() as HTMLElement).focus();
        this.removeResizeElement();
        this.hideTableQuickToolbar();
    }

    private renderDlgContent(args?: ITableNotifyArgs): void {
        if (Browser.isDevice || this.parent.inlineMode.enable) {
            this.insertTableDialog(args as MouseEvent);
            return;
        }
        if (this.popupObj) {
            this.popupObj.hide();
            return;
        }
        this.hideTableQuickToolbar();
        const header: string = '1X1';
        const insertbtn: string = this.l10n.getConstant('inserttablebtn');
        this.dlgDiv = this.parent.createElement('div', { className: 'e-rte-table-popup', id: this.rteID + '_table' });
        this.tblHeader = this.parent.createElement('div', { className: 'e-rte-popup-header' });
        this.tblHeader.innerHTML = header;
        this.dlgDiv.appendChild(this.tblHeader);
        const tableDiv: HTMLElement = this.parent.createElement('div', { className: 'e-rte-table-span' });
        this.drawTable(tableDiv, args);
        this.dlgDiv.appendChild(tableDiv);
        this.dlgDiv.appendChild(this.parent.createElement('span', { className: 'e-span-border' }));
        const btnEle: HTMLElement = this.parent.createElement('button', {
            className: 'e-insert-table-btn', id: this.rteID + '_insertTable',
            attrs: { type: 'button', tabindex: '0' }
        });
        if (!isNOU(this.parent.getToolbarElement().querySelector('.e-expended-nav') as HTMLElement)) {
            (this.parent.getToolbarElement().querySelector('.e-expended-nav') as HTMLElement).setAttribute('tabindex', '1');
        }
        this.dlgDiv.appendChild(btnEle);
        const button: Button = new Button({
            iconCss: 'e-icons e-create-table', content: insertbtn, cssClass: 'e-flat',
            enableRtl: this.parent.enableRtl, locale: this.parent.locale
        });
        button.isStringTemplate = true;
        button.appendTo(btnEle);
        EventHandler.add(btnEle, 'click', this.insertTableDialog, { self: this, args: args.args, selection: args.selection });
        this.parent.getToolbar().appendChild(this.dlgDiv);
        let target: HTMLElement = (((args as ITableNotifyArgs).args as ClickEventArgs).originalEvent.target as HTMLElement);
        target = target.classList.contains('e-toolbar-item') ? target.firstChild as HTMLElement : target.parentElement;
        this.popupObj = new Popup(this.dlgDiv, {
            targetType: 'relative',
            relateTo: target,
            collision: { X: 'fit', Y: 'none' },
            offsetY: 8,
            viewPortElement: this.parent.element,
            position: { X: 'left', Y: 'bottom' },
            enableRtl: this.parent.enableRtl,
            zIndex: 10001,
            // eslint-disable-next-line
            close: (event: { [key: string]: object }) => {
                this.parent.isBlur = false;
                this.popupObj.destroy();
                detach(this.popupObj.element);
                this.popupObj = null;
            }
        });
        addClass([this.popupObj.element], 'e-popup-open');
        this.popupObj.refreshPosition(target);
    }
    // eslint-disable-next-line
    private docClick(e: { [key: string]: object }): void {
        const target: HTMLElement = <HTMLElement>(e.args as MouseEvent).target;
        if (target && target.classList && ((this.popupObj && !closest(target, '[id=' + "'" + this.popupObj.element.id + "'" +']') ||
            (this.editdlgObj && !closest(target, '#' + this.editdlgObj.element.id)))) && !target.classList.contains('e-create-table') &&
            target.offsetParent && !target.offsetParent.classList.contains('e-rte-backgroundcolor-dropdown')) {
            if (this.popupObj) {
                this.popupObj.hide();
            }
            if (this.editdlgObj) {
                this.editdlgObj.hide();
            }
            this.parent.isBlur = true;
            dispatchEvent(this.parent.element, 'focusout');
        }
        const closestEle: Element = closest(target, 'td');
        const isExist: boolean = closestEle && this.parent.contentModule.getEditPanel().contains(closestEle) ? true : false;
        if (target && target.tagName !== 'TD' && target.tagName !== 'TH' && !isExist &&
            closest(target, '.e-rte-quick-popup') === null && target.offsetParent &&
            !target.offsetParent.classList.contains('e-quick-dropdown') &&
            !target.offsetParent.classList.contains('e-rte-backgroundcolor-dropdown') && !closest(target, '.e-rte-dropdown-popup')
            && !closest(target, '.e-rte-elements')) {
            removeClass(this.parent.element.querySelectorAll('table td'), classes.CLS_TABLE_SEL);
            if (!Browser.isIE) {
                this.hideTableQuickToolbar();
            }
        }
        if (target && target.classList && !target.classList.contains(classes.CLS_TB_COL_RES) &&
            !target.classList.contains(classes.CLS_TB_ROW_RES) && !target.classList.contains(classes.CLS_TB_BOX_RES)) {
            this.removeResizeElement();
        }

    }

    private drawTable(tableDiv: HTMLElement, args?: ITableNotifyArgs): void {
        let rowDiv: HTMLElement;
        let tableCell: HTMLElement;
        for (let row: number = 0; row < 3; row++) {
            rowDiv = this.parent.createElement('div', { className: 'e-rte-table-row', attrs: { 'data-column': '' + row } });
            for (let col: number = 0; col < 10; col++) {
                const display: string = (row > 2) ? 'none' : 'inline-block';
                tableCell = this.parent.createElement('div', { className: 'e-rte-tablecell e-default', attrs: { 'data-cell': '' + col } });
                rowDiv.appendChild(tableCell);
                tableCell.style.display = display;
                if (col === 0 && row === 0) {
                    addClass([tableCell], 'e-active');
                }
                EventHandler.add(tableCell, 'mousemove', this.tableCellSelect, this);
                EventHandler.add(rowDiv, 'mouseleave', this.tableCellLeave, this);
                EventHandler.add(tableCell, 'mouseup', this.tableCellClick, { self: this, args: args.args, selection: args.selection });
            }
            tableDiv.appendChild(rowDiv);
        }
    }
    private editTable(args: ITableArgs): void {
        this.createDialog(args as ITableArgs);
        const editContent: HTMLElement = this.tableDlgContent(args);
        const update: string = this.l10n.getConstant('dialogUpdate');
        const cancel: string = this.l10n.getConstant('dialogCancel');
        const editHeader: string = this.l10n.getConstant('tableEditHeader');
        this.editdlgObj.setProperties({
            height: 'initial', width: '290px', content: editContent, header: editHeader,
            buttons: [{
                click: this.applyProperties.bind(this, args),
                buttonModel: { content: update, cssClass: 'e-flat e-size-update', isPrimary: true }
            },
            {
                click: (e: MouseEvent) => {
                    this.cancelDialog(e);
                },
                buttonModel: { cssClass: 'e-flat e-cancel', content: cancel }
            }]
        });
        this.editdlgObj.element.style.maxHeight = 'none';
        (this.editdlgObj.content as HTMLElement).querySelector('input').focus();
        this.hideTableQuickToolbar();
    }

    private insertTableDialog(args: MouseEvent | NotifyArgs): void {
        const proxy: Table = ((this as ITableNotifyArgs).self) ? (this as ITableNotifyArgs).self : this;
        if (proxy.popupObj) {
            proxy.popupObj.hide();
        }
        proxy.createDialog(args);
        const dlgContent: HTMLElement = proxy.tableCellDlgContent();
        const insert: string = proxy.l10n.getConstant('dialogInsert');
        const cancel: string = proxy.l10n.getConstant('dialogCancel');
        if (isNullOrUndefined(proxy.editdlgObj)) { return; }
        proxy.editdlgObj.setProperties({
            height: 'initial', width: '290px', content: dlgContent,
            buttons: [{
                click: proxy.customTable.bind(this, args),
                buttonModel: { content: insert, cssClass: 'e-flat e-insert-table', isPrimary: true }
            },
            {
                click: (e: MouseEvent) => {
                    proxy.cancelDialog(e);
                },
                buttonModel: { cssClass: 'e-flat e-cancel', content: cancel }
            }]
        });
        proxy.editdlgObj.element.style.maxHeight = 'none';
        (proxy.editdlgObj.content as HTMLElement).querySelector('input').focus();
    }

    private tableCellDlgContent(): HTMLElement {
        const tableColumn: string = this.l10n.getConstant('columns');
        const tableRow: string = this.l10n.getConstant('rows');
        const tableWrap: HTMLElement = this.parent.createElement('div', { className: 'e-cell-wrap' });
        const content: string = '<div class="e-rte-field"><input type="text" '
            + ' data-role ="none" id="tableColumn" class="e-table-column"/></div>'
            + '<div class="e-rte-field"><input type="text" data-role ="none" id="tableRow" class="e-table-row" /></div>';
        const contentElem: DocumentFragment = parseHtml(content);
        tableWrap.appendChild(contentElem);
        this.columnTextBox = new NumericTextBox({
            format: 'n0',
            min: 1,
            value: 3,
            placeholder: tableColumn,
            floatLabelType: 'Auto',
            max: 50,
            enableRtl: this.parent.enableRtl, locale: this.parent.locale
        });
        this.columnTextBox.isStringTemplate = true;
        this.columnTextBox.appendTo(tableWrap.querySelector('#tableColumn') as HTMLElement);
        this.rowTextBox = new NumericTextBox({
            format: 'n0',
            min: 1,
            value: 3,
            placeholder: tableRow,
            floatLabelType: 'Auto',
            max: 50,
            enableRtl: this.parent.enableRtl, locale: this.parent.locale
        });
        this.rowTextBox.isStringTemplate = true;
        this.rowTextBox.appendTo(tableWrap.querySelector('#tableRow') as HTMLElement);
        return tableWrap;
    }
    private clearDialogObj(): void {
        if (this.editdlgObj) {
            this.editdlgObj.destroy();
            detach(this.editdlgObj.element);
            this.editdlgObj = null;
        }
    }
    // eslint-disable-next-line
    private createDialog(args: ITableArgs | ClickEventArgs | MouseEvent): void {
        if (this.editdlgObj) {
            this.editdlgObj.hide({ returnValue: true } as Event);
            return;
        }
        const tableDialog: HTMLElement = this.parent.createElement('div', {
            className: 'e-rte-edit-table', id: this.rteID + '_tabledialog' });
        this.parent.element.appendChild(tableDialog);
        const insert: string = this.l10n.getConstant('dialogInsert');
        const cancel: string = this.l10n.getConstant('dialogCancel');
        const header: string = this.l10n.getConstant('tabledialogHeader');
        const dialogModel: DialogModel = {
            header: header,
            cssClass: classes.CLS_RTE_ELEMENTS,
            enableRtl: this.parent.enableRtl,
            locale: this.parent.locale,
            showCloseIcon: true, closeOnEscape: true, width: (Browser.isDevice) ? '290px' : '340px', height: 'initial',
            position: { X: 'center', Y: (Browser.isDevice) ? 'center' : 'top' },
            isModal: (Browser.isDevice as boolean),
            buttons: [{
                buttonModel: { content: insert, cssClass: 'e-flat e-insert-table', isPrimary: true }
            },
            {
                click: (e: MouseEvent) => {
                    this.cancelDialog(e);
                },
                buttonModel: { cssClass: 'e-flat e-cancel', content: cancel }
            }],
            target: (Browser.isDevice) ? document.body : this.parent.element,
            animationSettings: { effect: 'None' },
            // eslint-disable-next-line
            close: (event: { [key: string]: object }) => {
                this.parent.isBlur = false;
                this.editdlgObj.destroy();
                detach(this.editdlgObj.element);
                this.dialogRenderObj.close(event);
                this.editdlgObj = null;
            }
        };
        this.editdlgObj = this.dialogRenderObj.render(dialogModel);
        this.editdlgObj.appendTo(tableDialog);
        if (this.quickToolObj && this.quickToolObj.inlineQTBar && document.body.contains(this.quickToolObj.inlineQTBar.element)) {
            this.quickToolObj.inlineQTBar.hidePopup();
        }
    }

    private customTable(args: ITableNotifyArgs, e: MouseEvent): void {
        const proxy: Table = ((this as ITableNotifyArgs).self) ? (this as ITableNotifyArgs).self : this;
        if (proxy.rowTextBox.value && proxy.columnTextBox.value) {
            const argument: ITableNotifyArgs = ((Browser.isDevice || (!isNullOrUndefined(args.args as ClickEventArgs)
                && !isNullOrUndefined((args.args as ClickEventArgs).originalEvent) &&
                ((args.args as ClickEventArgs).originalEvent as KeyboardEventArgs).action === 'insert-table')
                || proxy.parent.inlineMode.enable) ? args : this as ITableNotifyArgs);
            proxy.tableInsert(proxy.rowTextBox.value, proxy.columnTextBox.value, e, argument);
        }
    }

    // eslint-disable-next-line
    private cancelDialog(e: MouseEvent): void {
        this.parent.isBlur = false;
        this.editdlgObj.hide({ returnValue: true } as Event);
    }

    // eslint-disable-next-line
    private applyProperties(args: ITableNotifyArgs, e: MouseEvent): void {
        const dialogEle: Element = this.editdlgObj.element;
        const table: HTMLTableElement = closest((args as ITableNotifyArgs).selectNode[0] as HTMLElement, 'table') as HTMLTableElement;
        table.style.width = (dialogEle.querySelector('.e-table-width') as HTMLInputElement).value + 'px';
        if ((dialogEle.querySelector('.e-cell-padding') as HTMLInputElement).value !== '') {
            const tdElm: NodeListOf<HTMLElement> = table.querySelectorAll('td');
            for (let i: number = 0; i < tdElm.length; i++) {
                let padVal: string = '';
                if (tdElm[i].style.padding === '') {
                    padVal = tdElm[i].getAttribute('style') + ' padding:' +
                    (dialogEle.querySelector('.e-cell-padding') as HTMLInputElement).value + 'px;';
                } else {
                    tdElm[i].style.padding = (dialogEle.querySelector('.e-cell-padding') as HTMLInputElement).value + 'px';
                    padVal = tdElm[i].getAttribute('style');
                }
                tdElm[i].setAttribute('style', padVal);
            }
        }
        table.cellSpacing = (dialogEle.querySelector('.e-cell-spacing') as HTMLInputElement).value;
        if (!isNOU(table.cellSpacing) || table.cellSpacing !== '0')  {
            addClass([table], classes.CLS_TABLE_BORDER);
        } else {
            removeClass([table], classes.CLS_TABLE_BORDER);
        }
        this.parent.formatter.saveData();
        this.editdlgObj.hide({ returnValue: true } as Event);
    }
    private tableDlgContent(e: ITableNotifyArgs): HTMLElement {
        const selectNode: HTMLElement = (e as ITableNotifyArgs).selectParent[0] as HTMLElement;
        const tableWidth: string = this.l10n.getConstant('tableWidth');
        const cellPadding: string = this.l10n.getConstant('cellpadding');
        const cellSpacing: string = this.l10n.getConstant('cellspacing');
        const tableWrap: HTMLElement = this.parent.createElement('div', { className: 'e-table-sizewrap' });
        const widthVal: string | number = closest(selectNode, 'table').getClientRects()[0].width;
        const padVal: string | number = (closest(selectNode, 'td') as HTMLElement).style.padding;
        const brdSpcVal: string | number = (closest(selectNode, 'table') as HTMLElement).getAttribute('cellspacing');
        const content: string = '<div class="e-rte-field"><input type="text" data-role ="none" id="tableWidth" class="e-table-width" '
            + ' /></div>' + '<div class="e-rte-field"><input type="text" data-role ="none" id="cellPadding" class="e-cell-padding" />'
            + ' </div><div class="e-rte-field"><input type="text" data-role ="none" id="cellSpacing" class="e-cell-spacing" /></div>';
        const contentElem: DocumentFragment = parseHtml(content);
        tableWrap.appendChild(contentElem);
        const widthNum: NumericTextBox = new NumericTextBox({
            format: 'n0',
            min: 0,
            value: widthVal,
            placeholder: tableWidth,
            floatLabelType: 'Auto',
            enableRtl: this.parent.enableRtl, locale: this.parent.locale
        });
        widthNum.isStringTemplate = true;
        widthNum.appendTo(tableWrap.querySelector('#tableWidth') as HTMLElement);
        const padding: NumericTextBox = new NumericTextBox({
            format: 'n0',
            min: 0,
            // eslint-disable-next-line
            value: padVal !== '' ? parseInt(padVal, null) : 0,
            placeholder: cellPadding,
            floatLabelType: 'Auto',
            enableRtl: this.parent.enableRtl, locale: this.parent.locale
        });
        padding.isStringTemplate = true;
        padding.appendTo(tableWrap.querySelector('#cellPadding') as HTMLElement);
        const spacing: NumericTextBox = new NumericTextBox({
            format: 'n0',
            min: 0,
            // eslint-disable-next-line
            value:  brdSpcVal !== '' && !isNOU(brdSpcVal) ? parseInt(brdSpcVal, null) : 0,
            placeholder: cellSpacing,
            floatLabelType: 'Auto',
            enableRtl: this.parent.enableRtl, locale: this.parent.locale
        });
        spacing.isStringTemplate = true;
        spacing.appendTo(tableWrap.querySelector('#cellSpacing') as HTMLElement);
        return tableWrap;
    }
    /**
     * Destroys the ToolBar.
     *
     * @function destroy
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public destroy(): void {
        this.removeEventListener();
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {void}
     */
    private getModuleName(): string {
        return 'table';
    }

}