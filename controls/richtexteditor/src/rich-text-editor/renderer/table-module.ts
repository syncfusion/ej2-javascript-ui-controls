import { createElement, detach, closest, Browser, L10n, isNullOrUndefined as isNOU, getComponent } from '@syncfusion/ej2-base';
import { isNullOrUndefined, EventHandler, addClass, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { IRichTextEditor, IRenderer, IDropDownItemModel, OffsetPosition, ResizeArgs } from '../base/interface';
import { IColorPickerEventArgs, ITableArgs, ITableNotifyArgs, IToolbarItemModel, NotifyArgs, ICssClassArgs } from '../base/interface';
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
import { removeClassWithAttr } from '../../common/util';
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
    private createTableButton: Button;
    private contentModule: IRenderer;
    private rendererFactory: RendererFactory;
    private quickToolObj: IRenderer;
    private resizeBtnStat: { [key: string]: boolean };
    private pageX: number = null;
    private pageY: number = null;
    private curTable: HTMLTableElement;
    private activeCell: HTMLElement;
    private keyDownEventInstance: KeyboardEventArgs;
    private colIndex: number;
    private columnEle: HTMLTableDataCellElement;
    private rowTextBox: NumericTextBox;
    private columnTextBox: NumericTextBox;
    private tableWidthNum: NumericTextBox;
    private tableCellPadding: NumericTextBox;
    private tableCellSpacing: NumericTextBox;
    private rowEle: HTMLTableRowElement;
    private l10n: L10n;
    private moveEle: HTMLElement = null;
    private helper: HTMLElement;
    private dialogRenderObj: DialogRenderer;
    private currentColumnResize: string = '';
    private previousTableElement: HTMLElement;
    private resizeEndTime: number = 0;
    private isTableMoveActive: boolean = false;
    private resizeIconPositionTime: number;
    private isResizeBind: boolean = true;
    private isDestroyed: boolean;
    private createTablePopupBoundFn: () => void
    private constructor(parent?: IRichTextEditor, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.rteID = parent.element.id;
        this.l10n = serviceLocator.getService<L10n>('rteLocale');
        this.rendererFactory = serviceLocator.getService<RendererFactory>('rendererFactory');
        this.dialogRenderObj = serviceLocator.getService<DialogRenderer>('dialogRenderObject');
        this.addEventListener();
        this.isDestroyed = false;
    }

    protected addEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.createTable, this.renderDlgContent, this);
        this.parent.on(events.initialEnd, this.afterRender, this);
        this.parent.on(events.dynamicModule, this.afterRender, this);
        this.parent.on(events.showTableDialog, this.showDialog, this);
        this.parent.on(events.closeTableDialog, this.closeDialog, this);
        this.parent.on(events.docClick, this.docClick, this);
        this.parent.on(events.iframeMouseDown, this.onIframeMouseDown, this);
        this.parent.on(events.editAreaClick, this.editAreaClickHandler, this);
        this.parent.on(events.clearDialogObj, this.clearDialogObj, this);
        this.parent.on(events.tableToolbarAction, this.onToolbarAction, this);
        this.parent.on(events.dropDownSelect, this.dropdownSelect, this);
        this.parent.on(events.keyDown, this.keyDown, this);
        this.parent.on(events.tableModulekeyUp, this.tableModulekeyUp, this);
        this.parent.on(events.bindCssClass, this.setCssClass, this);
        this.parent.on(events.destroy, this.destroy, this);
        this.parent.on(events.afterKeyDown, this.afterKeyDown, this);
    }

    protected removeEventListener(): void {
        this.parent.off(events.createTable, this.renderDlgContent);
        this.parent.off(events.initialEnd, this.afterRender);
        this.parent.off(events.dynamicModule, this.afterRender);
        this.parent.off(events.docClick, this.docClick);
        this.parent.off(events.iframeMouseDown, this.onIframeMouseDown);
        this.parent.off(events.showTableDialog, this.showDialog);
        this.parent.off(events.closeTableDialog, this.closeDialog);
        this.parent.off(events.editAreaClick, this.editAreaClickHandler);
        this.parent.off(events.clearDialogObj, this.clearDialogObj);
        this.parent.off(events.tableToolbarAction, this.onToolbarAction);
        this.parent.off(events.dropDownSelect, this.dropdownSelect);
        this.parent.off(events.mouseDown, this.cellSelect);
        this.parent.off(events.tableColorPickerChanged, this.setBGColor);
        this.parent.off(events.keyDown, this.keyDown);
        this.parent.off(events.tableModulekeyUp, this.tableModulekeyUp);
        this.parent.off(events.bindCssClass, this.setCssClass);
        this.parent.off(events.destroy, this.destroy);
        this.parent.off(events.afterKeyDown, this.afterKeyDown);
        if (!Browser.isDevice && this.parent.tableSettings.resize) {
            EventHandler.remove(this.contentModule.getEditPanel(), 'mouseover', this.resizeHelper);
            EventHandler.remove(this.contentModule.getEditPanel(), Browser.touchStartEvent, this.resizeStart);
        }
    }

    private updateCss(currentObj: Button | Dialog | NumericTextBox, e: ICssClassArgs) : void {
        if (currentObj && e.cssClass) {
            if (isNullOrUndefined(e.oldCssClass)) {
                currentObj.setProperties({ cssClass: (currentObj.cssClass + ' ' + e.cssClass).trim() });
            } else {
                currentObj.setProperties({ cssClass: (currentObj.cssClass.replace(e.oldCssClass, '').trim() + ' ' + e.cssClass).trim() });
            }
        }
    }

    private setCssClass(e: ICssClassArgs): void {
        if (this.popupObj && e.cssClass) {
            if (isNullOrUndefined(e.oldCssClass)) {
                addClass([this.popupObj.element], e.cssClass);
            } else {
                removeClassWithAttr([this.popupObj.element], e.oldCssClass);
                addClass([this.popupObj.element], e.cssClass);
            }
        }
        this.updateCss(this.createTableButton, e);
        this.updateCss(this.editdlgObj, e);
        const numericTextBoxObj: NumericTextBox[] = [
            this.columnTextBox, this.rowTextBox, this.tableWidthNum, this.tableCellPadding, this.tableCellSpacing
        ];
        for (let i: number = 0; i < numericTextBoxObj.length; i++) {
            this.updateCss(numericTextBoxObj[i as number], e);
        }
    }

    private afterRender(): void {
        if (isNullOrUndefined(this.contentModule)) {
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
        case 'Custom':
            this.tableStyles(args, e);
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
            this.openDialog(true, e);
            event.preventDefault();
            break;
        }
        if (!isNullOrUndefined(this.parent.formatter.editorManager.nodeSelection) && this.contentModule
        && event.code !== 'KeyK') {
            let selection: NodeSelection;
            const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
            let ele: HTMLElement = this.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range)[0] as HTMLElement;
            ele = (ele && ele.tagName !== 'TD' && ele.tagName !== 'TH') ? ele.parentElement : ele;
            if (((event as KeyboardEventArgs).keyCode === 8 || (event as KeyboardEventArgs).keyCode === 46) ||
            (event.ctrlKey && (event as KeyboardEventArgs).keyCode === 88)) {
                if (ele && ele.tagName === 'TBODY') {
                    if (!isNullOrUndefined(this.parent.formatter.editorManager.nodeSelection) && this.contentModule) {
                        selection = this.parent.formatter.editorManager.nodeSelection.save(range, this.contentModule.getDocument());
                    }
                    event.preventDefault();
                    proxy.removeTable(selection, event as KeyboardEventArgs, true);
                } else if (ele && ele.querySelectorAll('table').length > 0) {
                    this.removeResizeElement();
                    this.hideTableQuickToolbar();
                }
            }
            if (ele && ele.tagName !== 'TD' && ele.tagName !== 'TH') {
                const closestTd: HTMLElement = closest(ele, 'td') as HTMLElement;
                ele = !isNullOrUndefined(closestTd) && this.parent.inputElement.contains(closestTd) ? closestTd : ele;
            }
            if (ele && (ele.tagName === 'TD' || ele.tagName === 'TH')) {
                const selectedEndCell: NodeListOf<HTMLElement> = this.contentModule.getEditPanel().querySelectorAll('.e-cell-select-end');
                if ((isNOU(this.activeCell) || this.activeCell !== ele) && !isNOU(selectedEndCell) && selectedEndCell.length === 0) {
                    this.activeCell = ele;
                }
                if (!isNOU(this.parent.formatter.editorManager.nodeSelection) && this.contentModule) {
                    selection = this.parent.formatter.editorManager.nodeSelection.save(range, this.contentModule.getDocument());
                }
                if (!(event as KeyboardEventArgs).shiftKey ||
                    ((event as KeyboardEventArgs).shiftKey && (event as KeyboardEventArgs).keyCode === 9)) {
                    switch ((event as KeyboardEventArgs).keyCode) {
                    case 9:
                    case 37:
                    case 39:
                        this.removeCellSelectClasses();
                        proxy.tabSelection(event, selection, ele);
                        break;
                    case 40:
                    case 38:
                        this.removeCellSelectClasses();
                        proxy.tableArrowNavigation(event, selection, ele);
                        break;
                    }
                }
            }
        }
        if ((event as KeyboardEventArgs).shiftKey && ((event as KeyboardEventArgs).keyCode === 39 ||
            (event as KeyboardEventArgs).keyCode === 37
            || (event as KeyboardEventArgs).keyCode === 38 || (event as KeyboardEventArgs).keyCode === 40))
        {
            this.keyDownEventInstance = event;
            EventHandler.add(this.parent.contentModule.getDocument(), 'selectionchange', this.tableCellsKeyboardSelection, this);
        }
        if (event.ctrlKey && event.key === 'a') {
            this.handleSelectAll();
        }
        if (((event.code === 'Delete' && event.which === 46) || (event.code === 'Backspace' && event.which === 8)) && this.parent.editorMode === 'HTML') {
            const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
            if (range.startContainer.nodeType === Node.ELEMENT_NODE && range.startContainer.nodeName === 'DIV' && (range.startContainer as HTMLElement).classList.contains('e-table-fake-selection'))
            {
                this.deleteTable();
                event.preventDefault();
            } else {
                const table: HTMLElement = (event.code === 'Delete' && event.which === 46) ? this.getAdjacentTableElement(range, true) : this.getAdjacentTableElement(range, false);
                if (table)
                {
                    this.updateTableSelection(table);
                    event.preventDefault();
                }
            }
        } else {
            const isShiftEnter: boolean = event.shiftKey && event.key === 'Enter';
            const isActionKey: boolean = classes.ALLOWED_ACTIONKEYS.indexOf(event.key) !== -1;
            if (isShiftEnter || isActionKey || (event.key && event.key.length === 1)) {
                const table: HTMLElement = this.parent.contentModule.getEditPanel().querySelector('table.e-cell-select');
                if (table) {
                    if ((event as KeyboardEventArgs).keyCode === 39 || (event as KeyboardEventArgs).keyCode === 37) {
                        this.parent.formatter.editorManager.nodeSelection.setCursorPoint(this.contentModule.getDocument(), table, 0);
                    } else {
                        const firstTd: HTMLElement = table.querySelector('tr').cells[0];
                        this.parent.formatter.editorManager.nodeSelection.setSelectionText(this.contentModule.getDocument(),
                                                                                           firstTd, firstTd, 0, 0);
                    }
                }
                this.removeTableSelection();
            }
        }
    }
    private tableCellsKeyboardSelection(e: Event): void {
        EventHandler.remove(this.parent.contentModule.getDocument(), 'selectionchange', this.tableCellsKeyboardSelection);
        const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
        const event: KeyboardEventArgs = this.keyDownEventInstance;
        const isMultiSelect: boolean = !isNullOrUndefined(range) && !isNullOrUndefined(range.commonAncestorContainer) &&
                                       range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
                                       && ((range.commonAncestorContainer as Element).tagName === 'TR'
                                       || (range.commonAncestorContainer as Element).tagName === 'TBODY') && !isNullOrUndefined(this.activeCell);
        const selectedEndCell: NodeListOf<HTMLElement> = this.contentModule.getEditPanel().querySelectorAll('.e-cell-select-end');
        if (!isNullOrUndefined(selectedEndCell) && selectedEndCell.length > 0)
        {
            this.parent.formatter.editorManager.nodeSelection.Clear(this.parent.contentModule.getDocument());
            this.parent.formatter.editorManager.nodeSelection.setSelectionText(this.parent.contentModule.getDocument(),
                                                                               selectedEndCell[0], selectedEndCell[0], 0, 0);
            this.parent.formatter.editorManager.nodeSelection.setCursorPoint(this.parent.contentModule.getDocument(),
                                                                             selectedEndCell[0], 0);
        }
        if (isMultiSelect || (!isNullOrUndefined(selectedEndCell) && selectedEndCell.length > 0)) {
            const cells: HTMLElement[][] = this.getCorrespondingColumns();
            const cell: HTMLElement = !isNullOrUndefined(selectedEndCell)
                && selectedEndCell.length > 0 ? selectedEndCell[0] : this.activeCell;
            const activeIndexes: number[] = this.getCorrespondingIndex(cell, cells);
            const activeCellRowIndex: number = activeIndexes[0 as number];
            const activeCellColIndex: number = activeIndexes[1 as number];
            let target: HTMLElement;
            if ((event as KeyboardEventArgs).keyCode === 39) {
                if (activeCellColIndex < cells[0].length - 1) {
                    target = cells[activeCellRowIndex as number][(activeCellColIndex + 1) as number];
                } else if (activeCellRowIndex < cells.length - 1) {
                    target = cells[(activeCellRowIndex + 1) as number][activeCellColIndex as number];
                    if (selectedEndCell.length === 0 && activeCellRowIndex < cells.length - 1) {
                        this.activeCell = cells[activeCellRowIndex as number][0 as number];
                    }
                } else {
                    this.resetTableSelection();
                }
            } else if ((event as KeyboardEventArgs).keyCode === 37) {
                if (0 < activeCellColIndex) {
                    target = cells[activeCellRowIndex as number][(activeCellColIndex - 1) as number];
                } else if (0 < activeCellRowIndex){
                    target = cells[(activeCellRowIndex - 1) as number][activeCellColIndex as number];
                    if (selectedEndCell.length === 0 && 0 < activeCellRowIndex) {
                        this.activeCell = cells[activeCellRowIndex as number][(cells[activeCellRowIndex as number].length - 1) as number];
                    }
                } else {
                    this.resetTableSelection();
                }
            } else if ((event as KeyboardEventArgs).keyCode === 38 ) {
                if (0 < activeCellRowIndex) {
                    target = cells[(activeCellRowIndex - 1) as number][activeCellColIndex as number];
                } else {
                    this.resetTableSelection();
                }
            } else if ((event as KeyboardEventArgs).keyCode === 40) {
                if (activeCellRowIndex < cells.length - 1) {
                    target = cells[(activeCellRowIndex + 1) as number][activeCellColIndex as number];
                } else {
                    this.resetTableSelection();
                }
            }
            if (target) {
                this.parent.formatter.editorManager.observer.notify('TABLE_MOVE', {
                    event: { target: target },
                    selectNode: [this.activeCell]
                });
            }
        }
        if (selectedEndCell.length > 0) {
            event.preventDefault();
            e.preventDefault();
        }
    }

    private resetTableSelection(): void {
        const selectedEndCell: NodeListOf<HTMLElement> = this.contentModule.getEditPanel().querySelectorAll('.e-cell-select-end');
        if (!isNullOrUndefined(selectedEndCell) && selectedEndCell.length > 0) {
            this.parent.formatter.editorManager.nodeSelection.setSelectionNode(this.parent.contentModule.getDocument(), this.curTable);
        }
        this.activeCell = null;
        this.removeCellSelectClasses();
        this.removeTableSelection();
    }

    private getCorrespondingColumns(): HTMLElement[][] {
        const elementArray: HTMLElement[][] = [];
        const colspan: number = 0;
        const allRows: HTMLCollectionOf<HTMLTableRowElement> = this.curTable.rows;
        for (let i: number = 0; i <= allRows.length - 1; i++) {
            const ele: HTMLElement = allRows[i as number];
            let index: number = 0;
            for (let j: number = 0; j <= ele.children.length - 1; j++) {
                const colEle: Element = ele.children[j as number];
                for (let ele: HTMLElement = colEle as HTMLElement, colspan: number = parseInt(ele.getAttribute('colspan'), 10) || 1,
                    rowSpan: number = parseInt(ele.getAttribute('rowspan'), 10) || 1, rowIndex: number = i; rowIndex < i + rowSpan; rowIndex++) {
                    for (let colIndex: number = index; colIndex < index + colspan; colIndex++) {
                        if (!elementArray[rowIndex as number]) {
                            elementArray[rowIndex as number] = [];
                        }
                        if (elementArray[rowIndex as number][colIndex as number]) {
                            index++;
                        } else {
                            elementArray[rowIndex as number][colIndex as number] = colEle as HTMLElement;
                        }
                    }
                }
                index += colspan;
            }
        }
        return elementArray;
    }

    private getCorrespondingIndex(cell: HTMLElement, allCells: HTMLElement[][]): number[] {
        for (let i: number = 0; i < allCells.length; i++) {
            for (let j: number = 0; j < allCells[i as number].length; j++) {
                if (allCells[i as number][j as number] === cell) {
                    return [i as number, j as number];
                }
            }
        }
        return [];
    }

    private getAdjacentTableElement(range: Range, isdelKey: boolean): HTMLElement | null {
        if (!range.collapsed || (!isdelKey && this.quickToolObj && this.quickToolObj.tableQTBar
            && document.body.contains(this.quickToolObj.tableQTBar.element))) {
            return null;
        }
        const nodeCollection: Node[] = this.getNodeCollection(range);
        const startContainer: HTMLElement = (range.collapsed && this.parent.contentModule.getEditPanel() === range.startContainer
            && nodeCollection && nodeCollection.length > 0 && nodeCollection[0] ?
            nodeCollection[0] : range.startContainer) as HTMLElement;
        let adjacentElement: HTMLElement = this.getSelectedTableEle(nodeCollection);
        const isBrEle: HTMLElement = this.getBrElement(range, nodeCollection);

        if (startContainer && startContainer.nodeType === Node.ELEMENT_NODE) {
            if (startContainer.tagName === 'IMG' || startContainer.querySelector('img') || startContainer.tagName === 'AUDIO'
                || startContainer.querySelector('audio') || startContainer.tagName === 'VIDEO' || startContainer.querySelector('video')
                || startContainer.querySelector('.e-video-clickelem'))
            {
                const compareRange: Range = this.contentModule.getDocument().createRange();
                compareRange.collapse(true);
                compareRange.selectNodeContents(startContainer);
                const nodeIndex: number = this.parent.formatter.editorManager.nodeSelection.getIndex(startContainer);
                if ((isdelKey && compareRange.startOffset >= range.startOffset) ||
                    (!isdelKey && (startContainer.tagName !== 'IMG' && compareRange.startOffset !== range.startOffset
                     || startContainer.tagName === 'IMG' && nodeIndex !== range.startOffset))) {
                    return null;
                }
            }
        }

        if (startContainer && startContainer.nodeType === Node.TEXT_NODE) {
            if (isdelKey) {
                if (range.endOffset !== range.endContainer.textContent.length) {
                    if (range.endOffset !== range.endContainer.textContent.trim().length) {
                        return null;
                    }
                }
            } else if (range.startOffset !== 0) {
                return null;
            }
        }

        if (startContainer && startContainer.nodeType === Node.ELEMENT_NODE && startContainer.tagName === 'TABLE') {
            adjacentElement = startContainer;
        }
        if (adjacentElement) {
            const currentEleIndex: number = this.parent.formatter.editorManager.nodeSelection.getIndex(adjacentElement);
            if (!((range.startOffset === currentEleIndex && isdelKey) || (range.startOffset !== currentEleIndex && !isdelKey))) {
                adjacentElement = null;
            }
        }
        if (!adjacentElement && startContainer) {
            adjacentElement = this.getAdjacentElementFromDom(startContainer, isBrEle, isdelKey);
        }
        if (adjacentElement && adjacentElement.nodeType === Node.ELEMENT_NODE && adjacentElement.tagName === 'TABLE')
        {
            this.setSelection(adjacentElement, isBrEle);
            return adjacentElement;
        }
        return null;
    }

    private getAdjacentElementFromDom(startContainer: HTMLElement, isBrEle: HTMLElement, isdelKey: boolean): HTMLElement {
        let adjacentElement: HTMLElement;
        let parentElement: HTMLElement = (isBrEle ? isBrEle : startContainer.parentNode) as HTMLElement;
        let currentElement: HTMLElement = startContainer;
        while (parentElement && !adjacentElement && parentElement.parentNode) {
            const childNodes: ChildNode[] = Array.from(parentElement.childNodes);
            const startContainerIndex: number = childNodes.indexOf(currentElement);
            if (startContainerIndex !== -1 && ((isdelKey && startContainerIndex < childNodes.length - 1)
                || (!isdelKey && startContainerIndex > 0))) {
                adjacentElement = (childNodes[isdelKey ? startContainerIndex + 1 : startContainerIndex - 1]) as HTMLElement;
            } else {
                adjacentElement = (isdelKey ? parentElement.nextSibling : parentElement.previousSibling) as HTMLElement;
                currentElement = parentElement;
            }
            if (!isBrEle && startContainer.nodeType === Node.TEXT_NODE && adjacentElement && adjacentElement.tagName && adjacentElement.tagName.toUpperCase() === 'BR') {
                isBrEle = currentElement = parentElement = adjacentElement;
                adjacentElement = null;
            }
            if (!isBrEle && adjacentElement && !(adjacentElement.nodeType === Node.ELEMENT_NODE && adjacentElement.tagName === 'TABLE') && !isNullOrUndefined(adjacentElement.textContent) && !adjacentElement.textContent.trim()) {
                currentElement = parentElement = adjacentElement.parentNode as HTMLElement;
                adjacentElement = null;
            }
            if (adjacentElement && adjacentElement.tagName && ['UL', 'OL', 'LI'].indexOf(adjacentElement.tagName.toUpperCase()) !== -1) {
                adjacentElement = this.getAdjacentElementFromList(adjacentElement, isdelKey);
                if (!adjacentElement) {
                    return null;
                }
            }
            if (parentElement && parentElement.tagName && parentElement.tagName.toUpperCase() === 'LI' && !isdelKey) {
                adjacentElement = parentElement;
            }
            parentElement = parentElement.parentNode as HTMLElement;
        }
        return adjacentElement;
    }

    private getAdjacentElementFromList(adjacentElement: HTMLElement, isdelKey: boolean): HTMLElement {
        while (adjacentElement) {
            if (adjacentElement.tagName && ['UL', 'OL', 'LI'].indexOf(adjacentElement.tagName.toUpperCase()) === -1) {
                if (!(adjacentElement.nodeType === Node.ELEMENT_NODE && adjacentElement.tagName === 'TABLE')) {
                    adjacentElement = (isdelKey ? adjacentElement.firstChild : adjacentElement.lastChild) as HTMLElement;
                }
                break;
            }
            adjacentElement = (isdelKey ? adjacentElement.firstChild : adjacentElement.lastChild) as HTMLElement;
        }
        return adjacentElement;
    }

    private getNodeCollection(range: Range): Node[] {
        let nodes: Node[] = [];
        if (range.collapsed && this.parent.contentModule.getEditPanel() === range.startContainer
            && range.startContainer.childNodes.length > 0) {
            const index: number = Math.max(0, Math.min(range.startContainer.childNodes.length - 1, range.endOffset - 1));
            nodes.push(range.startContainer.childNodes[index as number]);
        } else {
            nodes = this.parent.formatter.editorManager.nodeSelection.getNodeCollection(range);
        }
        return nodes;
    }

    private getSelectedTableEle(nodeCollection: Node[]): HTMLElement | null {
        if (nodeCollection && nodeCollection.length > 0) {
            for (const element of Array.from(nodeCollection)) {
                if (element && (element as HTMLElement).tagName === 'TABLE') {
                    return element as HTMLElement;
                }
            }
        }
        return null;
    }

    private getBrElement(range: Range, nodeCollection: Node[]): HTMLElement | null {
        if ((range.endContainer as HTMLElement).tagName === 'BR') {
            return range.endContainer as HTMLElement;
        }
        if (nodeCollection.length === 1 && nodeCollection[0]
            && (nodeCollection[0] as HTMLElement).tagName === 'BR') {
            return nodeCollection[0] as HTMLElement;
        }
        return null;
    }

    private setSelection(nextElement: HTMLElement, isBrEle: HTMLElement): void {
        if (!nextElement.classList.contains('e-cell-select')) {
            this.parent.formatter.editorManager.nodeSelection.Clear(this.contentModule.getDocument());
            if (isBrEle) {
                if (isBrEle.parentNode && isBrEle.parentNode.childNodes.length === 1 && isBrEle.parentNode.firstChild.nodeName === 'BR') {
                    detach(isBrEle.parentNode);
                } else {
                    detach(isBrEle);
                }
            }
            const fakeSelectionEle: HTMLElement = this.parent.createElement('div', { className: 'e-table-fake-selection'});
            fakeSelectionEle.setAttribute('contenteditable', 'false');
            this.contentModule.getEditPanel().appendChild(fakeSelectionEle);
            this.parent.formatter.editorManager.nodeSelection.setSelectionNode(this.contentModule.getDocument(), fakeSelectionEle);
        }
    }

    private removeAllFakeSelectionEles(): void {
        const fakeSelectionEles: NodeListOf<HTMLElement> = this.parent.contentModule.getEditPanel().querySelectorAll('.e-table-fake-selection');
        if (fakeSelectionEles && fakeSelectionEles.length > 0)
        {
            fakeSelectionEles.forEach((element: HTMLElement) => {
                detach(element);
            });
        }
    }

    private deleteTable(): void {
        const table: HTMLElement = this.parent.contentModule.getEditPanel().querySelector('table.e-cell-select');
        this.removeResizeElement();
        if (table) {
            const brElement: HTMLBRElement = document.createElement('br');
            let containerEle: HTMLElement | null = brElement;
            if (this.parent.enterKey === 'DIV') {
                containerEle = document.createElement('div');
                containerEle.appendChild(brElement);
            }
            else if (this.parent.enterKey === 'P') {
                containerEle = document.createElement('p');
                containerEle.appendChild(brElement);
            }
            table.parentNode.replaceChild(containerEle, table);
            this.parent.formatter.editorManager.nodeSelection.setSelectionText(this.contentModule.getDocument(),
                                                                               containerEle, containerEle, 0, 0);
            this.removeTableSelection();
        }
    }

    private removeTableSelection(): void {
        const table: HTMLElement = this.parent.contentModule.getEditPanel().querySelector('table.e-cell-select');
        if (table) {
            removeClassWithAttr([table], classes.CLS_TABLE_SEL);
        }
        this.removeAllFakeSelectionEles();
    }

    private updateTableSelection(table: HTMLElement): void {
        addClass([table], 'e-cell-select');
    }

    private handleSelectAll(): void {
        this.cancelResizeAction();
        const selectedCells: NodeListOf<Element> = this.parent.inputElement.querySelectorAll('.' + classes.CLS_TABLE_SEL);
        removeClassWithAttr(selectedCells, classes.CLS_TABLE_SEL);
        this.removeTableSelection();
    }

    private tableModulekeyUp(e: NotifyArgs): void {
        if (!isNullOrUndefined(this.parent.formatter.editorManager.nodeSelection) && this.contentModule) {
            const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
            let ele: HTMLElement = this.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range)[0] as HTMLElement;
            ele = (ele && ele.tagName !== 'TD' && ele.tagName !== 'TH') ? ele.parentElement : ele;
            if (ele && ele.tagName !== 'TD' && ele.tagName !== 'TH') {
                const closestTd: HTMLElement = closest(ele, 'td') as HTMLElement;
                ele = !isNullOrUndefined(closestTd) && this.parent.inputElement.contains(closestTd) ? closestTd : ele;
            }
            const eventArgs: KeyboardEventArgs = e.args as KeyboardEventArgs;
            if (this.previousTableElement !== ele && !isNullOrUndefined(this.previousTableElement)
                && !eventArgs.shiftKey && (eventArgs.keyCode === 39 || eventArgs.keyCode === 37 ||
                eventArgs.keyCode === 38 || eventArgs.keyCode === 40)) {
                removeClassWithAttr([this.previousTableElement], classes.CLS_TABLE_SEL);
                this.removeTableSelection();
            }
        }
    }
    private openDialog(isInternal?: boolean, e?: NotifyArgs): void {
        if (!isInternal) { (this.parent.contentModule.getEditPanel() as HTMLElement).focus(); }
        if (this.parent.editorMode === 'HTML') {
            const docElement: Document = this.parent.contentModule.getDocument();
            const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(docElement);
            const selection: NodeSelection = this.parent.formatter.editorManager.nodeSelection.save(range, docElement);
            const  args: ClickEventArgs = <ClickEventArgs>{
                originalEvent: e ? e.args : { action: 'insert-table' },
                item: {
                    command: 'Table',
                    subCommand: 'CreateTable'
                },
                name: !isInternal ? 'showDialog' : null
            };
            this.insertTableDialog({ self: this, args: args, selection: selection } as NotifyArgs);
        }
    }
    private showDialog(): void {
        this.openDialog(false);
        this.setCssClass({cssClass: this.parent.getCssClass()});
    }
    private closeDialog(): void {
        if (this.editdlgObj) { this.editdlgObj.hide({ returnValue: true } as Event); }
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
        const tdEle : Element = closest(args.selectParent[0], 'th') || closest(args.selectParent[0], 'td');
        if (tdEle) {
            this.parent.formatter.process(this.parent, e, e, { tableCell: tdEle, subCommand: (e.item as IDropDownItemModel).subCommand });
        }
    }

    private tableStyles(args: ITableNotifyArgs, e: ClickEventArgs): void {
        const command: string = (e.item as IDropDownItemModel).subCommand;
        const table: HTMLTableElement = closest(args.selectParent[0], 'table') as HTMLTableElement;
        if (command === 'Dashed') {
            /* eslint-disable */
            (this.parent.element.classList.contains(classes.CLS_TB_DASH_BOR)) ?
                removeClassWithAttr([this.parent.element],classes.CLS_TB_DASH_BOR) : this.parent.element.classList.add(classes.CLS_TB_DASH_BOR);
            (table.classList.contains(classes.CLS_TB_DASH_BOR)) ? removeClassWithAttr([table],classes.CLS_TB_DASH_BOR) :
                table.classList.add(classes.CLS_TB_DASH_BOR);
        }
        if (command === 'Alternate') {
            (this.parent.element.classList.contains(classes.CLS_TB_ALT_BOR)) ?
            removeClassWithAttr([this.parent.element], classes.CLS_TB_ALT_BOR) : this.parent.element.classList.add(classes.CLS_TB_ALT_BOR);
            (table.classList.contains(classes.CLS_TB_ALT_BOR)) ? removeClassWithAttr([table],classes.CLS_TB_ALT_BOR) :
                table.classList.add(classes.CLS_TB_ALT_BOR);
                /* eslint-enable */
        }
        if ((args.args as ClickEventArgs) && (args.args as ClickEventArgs).item.cssClass) {
            const classList: string[] = (args.args as ClickEventArgs).item.cssClass.split(' ');
            for (let i: number = 0; i < classList.length; i++) {
                if (table.classList.contains(classList[i as number])) {
                    removeClassWithAttr([table], (classList[i as number]));
                } else {
                    table.classList.add(classList[i as number]);
                }
            }
        }
        this.parent.formatter.process(this.parent, e, e, { subCommand: (e.item as IDropDownItemModel).subCommand });
        this.parent.formatter.saveData();
        this.hideTableQuickToolbar();
        this.parent.formatter.editorManager.nodeSelection.restore();
    }
    private insideList(range: Range): boolean {
        const blockNodes: Element[] = this.getBlockNodesInSelection(range);
        const nodes: Element[] = [];
        for (let i: number = 0; i < blockNodes.length; i++) {
            if ((blockNodes[i as number].parentNode as Element).tagName === 'LI') {
                nodes.push(blockNodes[i as number].parentNode as Element);
            } else if (blockNodes[i as number].tagName === 'LI' && (blockNodes[i as number].childNodes[0] as Element).tagName !== 'P' &&
                ((blockNodes[i as number].childNodes[0] as Element).tagName !== 'OL' &&
                    (blockNodes[i as number].childNodes[0] as Element).tagName !== 'UL')) {
                nodes.push(blockNodes[i as number]);
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

    private getBlockNodesInSelection(range: Range): Element[] {
        const blockTags: string[] = [
            'DIV', 'SECTION', 'HEADER', 'FOOTER', 'ARTICLE', 'NAV',
            'P', 'H1', 'H2', 'H3', 'BLOCKQUOTE', 'LI', 'PRE',
            'TD', 'TH', 'FORM', 'FIELDSET', 'LEGEND', 'LABEL', 'TEXTAREA'
        ];
        const blockNodes: Set<Element> = new Set();
        const treeWalker: TreeWalker = this.contentModule.getDocument().createTreeWalker(
            range.commonAncestorContainer,
            NodeFilter.SHOW_TEXT, {
                acceptNode: (node: Node) => (range.intersectsNode(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT)
            }
        );
        // If selection is collapsed, handle the case explicitly
        if (range.collapsed) {
            const blockNode: Element = this.getImmediateBlockNode(range.startContainer, blockTags);
            if (blockNode) {
                blockNodes.add(blockNode);
            }
        } else {
            while (treeWalker.nextNode()) {
                const blockNode: Element = this.getImmediateBlockNode(treeWalker.currentNode, blockTags);
                if (blockNode) {
                    blockNodes.add(blockNode);
                }
            }
        }
        return Array.from(blockNodes);
    }
    private getImmediateBlockNode(node: Node, blockTags: string[]): Element | null {
        let parentNode: Node = node.nodeType === Node.TEXT_NODE ? node.parentNode : node;
        while (parentNode && parentNode.nodeType === Node.ELEMENT_NODE) {
            const element: Element = parentNode as Element;
            if (blockTags.indexOf(element.tagName) > -1) {
                return element;
            }
            parentNode = parentNode.parentNode;
        }
        return null;
    }

    private removeEmptyTextNodes(element: HTMLTableRowElement): void {
        const children: NodeListOf<ChildNode> = element.childNodes;
        for (let i: number = children.length - 1; i >= 0; i--) {
            const node: ChildNode = children[i as number];
            if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() === '') {
                element.removeChild(node);
            }
        }
    }
    private tabSelection(event: KeyboardEvent, selection: NodeSelection, ele: HTMLElement): void {
        const allHeadBodyTRElements: NodeListOf<HTMLTableRowElement> = ele.closest('table').querySelectorAll('thead, tbody, tr');
        for (let i: number = 0; i < allHeadBodyTRElements.length; i++) {
            this.removeEmptyTextNodes(allHeadBodyTRElements[i as number]);
        }
        this.previousTableElement = ele;
        const insideList: boolean = this.insideList(selection.range);
        if ((event.keyCode === 37 || event.keyCode === 39) ||
            insideList) {
            return;
        }
        event.preventDefault();
        removeClassWithAttr([ele], classes.CLS_TABLE_SEL);
        this.removeTableSelection();
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
                removeClassWithAttr([ele], classes.CLS_TABLE_SEL);
                this.removeTableSelection();
                nextElement = nextElement.parentElement.nextSibling ? nextElement.parentElement.nextSibling.firstChild as HTMLElement :
                    nextElement.parentElement.firstChild;
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
                (closest(ele, 'table') as HTMLTableElement).tHead && ele.nodeName !== 'TH') {
                const clsTble: HTMLTableElement = closest(ele, 'table') as HTMLTableElement;
                prevElement = clsTble.rows[0].cells[clsTble.rows[0].cells.length - 1];
            }
            if (event.keyCode === 37 && ele === prevElement) {
                prevElement = closest(ele, 'table').previousSibling;
            }
            if (!isNOU(prevElement) && (prevElement as HTMLElement).firstChild.nodeName === 'TABLE') {
                let tableChild: Node = (prevElement as Node);
                while (!isNOU(tableChild.firstChild) && tableChild.firstChild.nodeName === 'TABLE' && (tableChild.firstChild as HTMLTableElement).rows.length > 0 && (tableChild.firstChild as HTMLTableElement).rows[0].cells.length > 0) {
                    tableChild = (tableChild.firstChild as HTMLTableElement).rows[0].cells[0];
                }
                prevElement = tableChild;
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
        removeClassWithAttr([ele], classes.CLS_TABLE_SEL);
        this.removeTableSelection();
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
        // eslint-disable-next-line
        const selection: NodeSelection = this.parent.formatter.editorManager.nodeSelection.save(range, this.contentModule.getDocument());
        // eslint-disable-next-line
        const selectedCells = this.curTable.querySelectorAll('.e-cell-select');
        for (let i: number = 0; i < selectedCells.length; i++) {
            (selectedCells[i as number] as HTMLElement).style.backgroundColor = args.item.value;
        }
        this.parent.formatter.process(this.parent, args, (args as IColorPickerEventArgs).originalEvent, args.item.value);
        this.parent.formatter.saveData();
        this.hideTableQuickToolbar();
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

    private getAnchorNode(element: HTMLElement): HTMLElement {
        const selectParent: HTMLElement = closest(element, 'a') as HTMLElement;
        return <HTMLElement>(selectParent ? selectParent : element);
    }

    private editAreaClickHandler(e: ITableNotifyArgs): void {
        if (this.parent.readonly || !isNOU(closest((e.args as MouseEvent).target as Element, '.e-img-caption'))) {
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
            if (!range.collapsed) {
                return; // Should not open Table quick toolbar when collapsed is equal to false.
            }
            const closestTable: Element = closest(target, 'table');
            const startNode: HTMLElement = this.parent.getRange().startContainer.parentElement;
            const endNode: HTMLElement = this.parent.getRange().endContainer.parentElement;
            const isAnchorEle: HTMLElement = this.getAnchorNode(target);
            const currentTime: number = new Date().getTime();
            const ismacRightClick: boolean = /Version\/\d+\.\d+.*Safari/.test(Browser.userAgent) && !/Chrome|Edg|Firefox/.test(Browser.userAgent) && args.which === 3;
            if (target && target.nodeName !== 'A' && isAnchorEle.nodeName !== 'A' && target.nodeName !== 'IMG' && target.nodeName !== 'VIDEO' && !target.classList.contains(classes.CLS_CLICKELEM) &&
                target.nodeName !== 'AUDIO' && (startNode === endNode || ismacRightClick) && (target.nodeName === 'TD' || target.nodeName === 'TH' ||
                target.nodeName === 'TABLE' || (closestTable && this.parent.contentModule.getEditPanel().contains(closestTable)))
                && !(range.startContainer.nodeType === 3 && !(range.collapsed || ismacRightClick)) &&
                currentTime - this.resizeEndTime > 100 && !(ismacRightClick && (range.collapsed && range.startOffset !== 0)) && !(ismacRightClick && range.endContainer.nodeName === '#text')) {
                const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.contentModule.getDocument());
                this.parent.formatter.editorManager.nodeSelection.save(range, this.contentModule.getDocument());
                this.parent.formatter.editorManager.nodeSelection.Clear(this.contentModule.getDocument());
                let pageX : number;
                let pageY : number;
                if (Browser.isDevice && (e.args as TouchEvent).touches) {
                    pageX = (this.parent.iframeSettings.enable) ? window.pageXOffset + this.parent.element.getBoundingClientRect().left +
                    (e.args as TouchEvent).changedTouches[0].clientX : (e.args as TouchEvent).changedTouches[0].pageX;
                    pageY = (this.parent.iframeSettings.enable) ? window.pageYOffset + this.parent.element.getBoundingClientRect().top +
                    (!this.parent.inlineMode.enable ? this.parent.toolbarModule.getToolbarHeight() : 0)
                     + (e.args as TouchEvent).changedTouches[0].clientY : (e.args as TouchEvent).changedTouches[0].pageY;
                } else {
                    pageX = (this.parent.iframeSettings.enable) ? window.pageXOffset
                    + this.parent.element.getBoundingClientRect().left + args.clientX : args.pageX;
                    pageY = (this.parent.iframeSettings.enable) ? window.pageYOffset + this.parent.element.getBoundingClientRect().top +
                    this.parent.toolbarModule.getToolbarHeight() + args.clientY : args.pageY;
                }
                this.quickToolObj.tableQTBar.showPopup(pageX, pageY, target as Element);
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
            removeClassWithAttr([item], 'e-active');
            if (parentIndex <= row && cellIndex <= col) {
                addClass([item], 'e-active');
            }
        });
        this.tblHeader.innerHTML = (col + 1) + 'x' + (row + 1);
    }

    private tableMouseUp(): void {
        this.unwireTableSelectionEvents();
        this.isTableMoveActive = false;
    }

    private tableMouseLeave(): void {
        this.unwireTableSelectionEvents();
        this.isTableMoveActive = false;
        this.resetTableSelection();
    }

    // eslint-disable-next-line
    private tableCellLeave(e?: MouseEvent): void {
        removeClassWithAttr(this.dlgDiv.querySelectorAll('.e-rte-tablecell'), 'e-active');
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
                // eslint-disable-next-line
                (!proxy.parent.iframeSettings.enable && isNOU(closest(parentNode, '[id=' + "'" + proxy.contentModule.getPanel().id + "'" + ']'))))) {
            (proxy.contentModule.getEditPanel() as HTMLElement).focus();
            const range: Range = proxy.parent.formatter.editorManager.nodeSelection.getRange(proxy.contentModule.getDocument());
            selectionObj.selection = proxy.parent.formatter.editorManager.nodeSelection.save(
                range, proxy.contentModule.getDocument());
        }
        const value: ITableArgs = {
            rows: row, columns: col, width: {
                minWidth: proxy.parent.tableSettings.minWidth,
                maxWidth: proxy.parent.tableSettings.maxWidth,
                width: proxy.parent.tableSettings.width
            },
            selection: selectionObj.selection
        };
        if (proxy.popupObj) {
            const rows: HTMLElement[] = Array.prototype.slice.call((e.target as HTMLElement).parentElement.parentElement.children);
            for (let i: number = 0; i < rows.length; i++) {
                EventHandler.remove(rows[i as number], 'mouseleave', this.tableCellLeave);
                const cells: HTMLElement[] = Array.prototype.slice.call(rows[i as number].children);
                for (let j: number = 0; j < cells.length; j++) {
                    EventHandler.remove(cells[j as number], 'mousemove', this.tableCellSelect);
                    EventHandler.remove(cells[j as number], 'mouseup', this.tableCellClick);
                }
            }
            proxy.popupObj.hide();
        }
        if (proxy.editdlgObj) {
            proxy.editdlgObj.hide();
        }
        const x: number = window.scrollX;
        const y: number = window.scrollY;
        proxy.parent.formatter.process(
            proxy.parent, selectionObj.args, (selectionObj.args as ClickEventArgs).originalEvent, value);
        (proxy.contentModule.getEditPanel() as HTMLElement).focus();
        window.scrollTo(x, y);
        proxy.parent.on(events.mouseDown, proxy.cellSelect, proxy);
        const selection: Selection = proxy.parent.formatter.editorManager.nodeSelection.get(proxy.contentModule.getDocument());
        if (!isNullOrUndefined(selection) && !isNullOrUndefined(selection.anchorNode) &&
            selection.anchorNode.nodeType === Node.ELEMENT_NODE && ((selection.anchorNode as HTMLElement).tagName === 'TD'
            || (selection.anchorNode as HTMLElement).tagName === 'TH')) {
            proxy.curTable = closest(selection.anchorNode, 'table') as HTMLTableElement;
            proxy.activeCell = selection.anchorNode as HTMLElement;
        }
    }

    private cellSelect(e: ITableNotifyArgs): void {
        let target: HTMLTableCellElement = (e.args as MouseEvent).target as HTMLTableCellElement;
        const tdNode: Element = closest(target, 'td,th') as HTMLTableCellElement;
        target = (target.nodeName !== 'TD' && tdNode && this.parent.contentModule.getEditPanel().contains(tdNode)) ?
            tdNode as HTMLTableCellElement : target;
        if (!isNOU(this.activeCell) && (e.args as MouseEvent).shiftKey && !isNOU(target) && !isNOU(target.tagName)
            && (target.tagName === 'TD' || target.tagName === 'TH') && this.activeCell !== target) {
            this.parent.formatter.editorManager.observer.notify('TABLE_MOVE', { event: e.args, selectNode: [this.activeCell] });
            (e.args as MouseEvent).preventDefault();
            return;
        }
        if (!(this.parent.quickToolbarSettings.showOnRightClick && (e.args as MouseEvent).which === 3 &&
            target.classList.contains(classes.CLS_TABLE_SEL))) {
            if (this.isTableMoveActive) {
                this.unwireTableSelectionEvents();
                this.isTableMoveActive = false;
            }
            this.activeCell = null;
            this.heightcheck();
            this.removeCellSelectClasses();
            this.removeTableSelection();
        }
        if (target && (target.tagName === 'TD' || target.tagName === 'TH')) {
            addClass([target], classes.CLS_TABLE_SEL);
            this.activeCell = target;
            this.curTable = (this.curTable) ? this.curTable : closest(target, 'table') as HTMLTableElement;
            this.wireTableSelectionEvents();
            this.isTableMoveActive = true;
            this.removeResizeElement();
            if (this.helper && this.contentModule.getEditPanel().contains(this.helper)) {
                detach(this.helper);
            }
        }
    }

    private heightcheck(): void {
        const table: HTMLElement = this.parent.contentModule.getEditPanel().querySelector('td.e-cell-select');
        if (table && table.querySelector('img') && table.querySelector('img').style.height.includes('%')) {
            table.style.height = 'inherit';
        }
    }

    private wireTableSelectionEvents() : void {
        EventHandler.add(this.curTable, 'mousemove', this.tableMove, this);
        EventHandler.add(this.curTable, 'mouseup', this.tableMouseUp, this);
        EventHandler.add(this.curTable, 'mouseleave', this.tableMouseLeave, this);
    }

    private unwireTableSelectionEvents() : void {
        EventHandler.remove(this.curTable, 'mousemove', this.tableMove);
        EventHandler.remove(this.curTable, 'mouseup', this.tableMouseUp);
        EventHandler.remove(this.curTable, 'mouseleave', this.tableMouseLeave);
    }

    private removeCellSelectClasses() : void {
        removeClassWithAttr(this.contentModule.getEditPanel().querySelectorAll('table td, table th'), classes.CLS_TABLE_SEL_END);
        removeClassWithAttr(this.contentModule.getEditPanel().querySelectorAll('table td, table th'), classes.CLS_TABLE_MULTI_CELL);
        removeClassWithAttr(this.contentModule.getEditPanel().querySelectorAll('table td, table th'), classes.CLS_TABLE_SEL);
    }

    private tableMove(event: MouseEvent) : void {
        this.parent.formatter.editorManager.observer.notify('TABLE_MOVE', {event: event , selectNode : [this.activeCell]});
    }

    private resizeHelper(e: PointerEvent | TouchEvent): void {
        if (this.parent.readonly) {
            return;
        }
        if (this.isTableMoveActive) {
            return;
        }
        if (e && (e as PointerEvent).buttons && (e as PointerEvent).buttons > 0) {
            return;
        }
        const target: HTMLElement = e.target as HTMLElement || (e as TouchEvent).targetTouches[0].target as HTMLElement;
        const closestTable: Element = closest(target, 'table.e-rte-table, table.e-rte-paste-table, table.e-rte-custom-table');
        const isResizing: boolean = this.parent.contentModule.getEditPanel().querySelectorAll('.e-table-box.e-rbox-select, .e-table-rhelper.e-column-helper, .e-table-rhelper.e-row-helper').length > 0;
        if (!isResizing && !isNOU(this.curTable) && !isNOU(closestTable) && closestTable !== this.curTable &&
            this.parent.contentModule.getEditPanel().contains(closestTable)) {
            this.removeResizeElement();
            this.removeHelper(e as MouseEvent);
            this.cancelResizeAction();
        }
        if (!isResizing && (target.nodeName === 'TABLE' || target.nodeName === 'TD' || target.nodeName === 'TH')) {
            this.curTable = (closestTable && this.parent.contentModule.getEditPanel().contains(closestTable))
                && (target.nodeName === 'TD' || target.nodeName === 'TH') ?
                (closestTable as HTMLTableElement) : target as HTMLTableElement;
            this.removeResizeElement();
            this.tableResizeEleCreation(this.curTable, e as PointerEvent);
        }
    }

    private tableResizeEleCreation(table: HTMLTableElement, e: MouseEvent): void {
        this.parent.preventDefaultResize(e);
        const columns: HTMLTableDataCellElement[] = this.calMaxCol(this.curTable);
        const rows: Element[] = [];
        for (let i: number = 0; i < table.rows.length; i++) {
            for (let j: number = 0; j < table.rows[i as number].cells.length; j++) {
                if (!table.rows[i as number].cells[j as number].hasAttribute('rowspan')) {
                    rows.push(Array.prototype.slice.call(table.rows[i as number].cells, 0,
                                                         table.rows[i as number].cells.length)[j as number]);
                    break;
                }
            }
        }
        const height: number = parseInt(getComputedStyle(table).height, 10);
        const width: number = parseInt(getComputedStyle(table).width, 10);
        const pos: OffsetPosition = this.calcPos(table);
        for (let i: number = 0; columns.length >= i; i++) {
            const colReEle: HTMLElement = this.parent.createElement('span', {
                attrs: {
                    'data-col': (i).toString(), 'unselectable': 'on', 'contenteditable': 'false'
                }
            });
            colReEle.classList.add(classes.CLS_RTE_TABLE_RESIZE, classes.CLS_TB_COL_RES);
            if (columns.length === i) {
                colReEle.style.cssText = 'height: ' + height + 'px; width: 4px; top: ' + pos.top +
                'px; left:' + ((columns[i - 1].classList.contains('e-multi-cells-select') ? 0 : pos.left) + this.calcPos(columns[i - 1] as HTMLElement).left + (columns[i - 1] as HTMLElement).offsetWidth - 2) + 'px;';
            } else {
                colReEle.style.cssText = 'height: ' + height + 'px; width: 4px; top: ' + pos.top +
                'px; left:' + ((columns[i as number].classList.contains('e-multi-cells-select') ? 0 : pos.left) + this.calcPos(columns[i as number] as HTMLElement).left - 2) + 'px;';
            }
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
                0 : this.calcPos(rows[i as number] as HTMLElement).left;
            rowReEle.style.cssText = 'width: ' + width + 'px; height: 4px; top: ' +
                (this.calcPos(rows[i as number] as HTMLElement).top + (rows[i as number].classList.contains('e-multi-cells-select') ? 0 : pos.top) + (rows[i as number] as HTMLElement).offsetHeight - 2) +
                'px; left:' + (rowPosLeft + pos.left) + 'px;';
            this.contentModule.getEditPanel().appendChild(rowReEle);
        }
        const tableReBox: HTMLElement = this.parent.createElement('span', {
            className: classes.CLS_TB_BOX_RES + this.parent.getCssClass(true), attrs: {
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
                detach(item[i as number]);
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
        let isNestedTable: boolean = false;
        while (offsetParent &&
            (offsetParent === doc.body || offsetParent === doc.documentElement) &&
            (<HTMLElement>offsetParent).style.position === 'static') {
            offsetParent = offsetParent.parentNode;
        }
        if (offsetParent.nodeName === 'TD' && elem.nodeName === 'TABLE') {
            offsetParent = closest(offsetParent, '.e-rte-content');
            isNestedTable = true;
        }
        if (offsetParent && offsetParent !== elem && offsetParent.nodeType === 1) {
            parentOffset = (<HTMLElement>offsetParent).getBoundingClientRect();
        }
        if (isNestedTable) {
            isNestedTable = false;
            const topValue: number = this.parent.inputElement && this.parent.inputElement.scrollTop > 0 ?
                (this.parent.inputElement.scrollTop + offset.top) - parentOffset.top : offset.top - parentOffset.top;
            const leftValue: number = this.parent.inputElement && this.parent.inputElement.scrollLeft > 0 ?
                (this.parent.inputElement.scrollLeft + offset.left) - parentOffset.left : offset.left - parentOffset.left;
            return {
                top: topValue,
                left: leftValue
            };
        } else {
            return {
                top: elem.offsetTop,
                left: elem.offsetLeft
            };
        }
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
            this.resetResizeHelper(this.curTable);
            e.preventDefault();
            this.parent.preventDefaultResize(e as PointerEvent);
            removeClassWithAttr(this.curTable.querySelectorAll('td,th'), classes.CLS_TABLE_SEL);
            this.removeTableSelection();
            this.pageX = this.getPointX(e);
            this.pageY = this.getPointY(e);
            this.resizeBtnInit();
            this.hideTableQuickToolbar();
            if (target.classList.contains(classes.CLS_TB_COL_RES)) {
                this.resizeBtnStat.column = true;
                if (parseInt(target.getAttribute('data-col'), 10) === this.calMaxCol(this.curTable).length) {
                    this.currentColumnResize = 'last';
                    this.colIndex = parseInt(target.getAttribute('data-col'), 10) - 1;
                    this.columnEle = this.calMaxCol(this.curTable)[this.colIndex] as HTMLTableDataCellElement;
                } else {
                    if (parseInt(target.getAttribute('data-col'), 10) === 0) {
                        this.currentColumnResize = 'first';
                    } else {
                        this.currentColumnResize = 'middle';
                        const cellColl: HTMLCollectionOf<HTMLTableDataCellElement> = this.curTable.rows[0].cells;
                        let cellCount: number = 0;
                        for (let cell: number = 0; cell < cellColl.length; cell++) {
                            cellCount = cellCount + cellColl[cell as number].colSpan;
                        }
                        const sizes: number[] = new Array(cellCount);
                        const colGroupEle: HTMLElement = createElement('colgroup');
                        const rowSpanCells: Map<string, HTMLTableDataCellElement> = new Map();
                        for (let i: number = 0; i < this.curTable.rows.length; i++) {
                            let currentColIndex: number = 0;
                            for (let k: number = 0; k < this.curTable.rows[i as number].cells.length; k++) {
                                for (let l: number = 1; l < this.curTable.rows[i as number].cells[k as number].rowSpan; l++) {
                                    const key: string = `${i + l}${currentColIndex}`;
                                    rowSpanCells.set(key, this.curTable.rows[i as number].cells[k as number]);
                                }
                                const cellIndex: number = this.getCellIndex(rowSpanCells, i, k);
                                if (cellIndex > currentColIndex) {
                                    currentColIndex = cellIndex;
                                }
                                const width: number = this.curTable.rows[i as number].cells[k as number].offsetWidth;
                                if (!sizes[currentColIndex as number] || width < sizes[currentColIndex as number]) {
                                    sizes[currentColIndex as number] = width;
                                }
                                currentColIndex += 1 + this.curTable.rows[i as number].cells[k as number].colSpan - 1;
                            }
                        }
                        for (let size: number = 0; size < sizes.length; size++) {
                            const cell: HTMLElement = createElement('col');
                            cell.appendChild(createElement('br'));
                            cell.style.width = this.convertPixelToPercentage(sizes[size as number], parseInt(getComputedStyle(this.curTable).width as string, 10)) + '%';
                            colGroupEle.appendChild(cell);
                        }
                        this.curTable.insertBefore(colGroupEle, this.curTable.firstChild);
                        for (let i: number = 0; i < this.curTable.rows.length; i++) {
                            for (let k: number = 0; k < this.curTable.rows[i as number].cells.length; k++) {
                                this.curTable.rows[i as number].cells[k as number].style.width = '';
                            }
                        }
                    }
                    this.colIndex = parseInt(target.getAttribute('data-col'), 10);
                    this.columnEle = this.calMaxCol(this.curTable)[this.colIndex] as HTMLTableDataCellElement;
                }
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
                const args: ResizeArgs = { event: e, requestType: 'Table' };
                this.parent.trigger(events.resizeStart, args, (resizeStartArgs: ResizeArgs) => {
                    if (resizeStartArgs.cancel) {
                        this.cancelResizeAction();
                    }
                });
            }
            if (this.isResizeBind) {
                EventHandler.add(this.contentModule.getDocument(), Browser.touchMoveEvent, this.resizing, this);
                EventHandler.add(this.contentModule.getDocument(), Browser.touchEndEvent, this.resizeEnd, this);
                this.isResizeBind = false;
            }
        }
    }
    private getCellIndex(rowSpanCells: Map<string, HTMLTableDataCellElement>, rowIndex: number, colIndex: number): number {
        const cellKey: string = `${rowIndex}${colIndex}`;
        const spannedCell: HTMLTableDataCellElement = rowSpanCells.get(cellKey);
        if (spannedCell) {
            return this.getCellIndex(rowSpanCells, rowIndex, colIndex + spannedCell.colSpan);
        } else {
            return colIndex;
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
            className: 'e-table-rhelper' + this.parent.getCssClass(true)
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
                pos.top + 'px; left:' + ((pos.left + this.calcPos(this.columnEle).left) +
                (this.currentColumnResize === 'last' ? this.columnEle.offsetWidth : 0) - 1) + 'px;';
        } else {
            this.helper.classList.add('e-row-helper');
            (this.helper as HTMLElement).style.cssText = 'width: ' + getComputedStyle(this.curTable).width + '; top: ' +
                (this.calcPos(this.rowEle).top + pos.top + (this.rowEle as HTMLElement).offsetHeight - 1) +
                'px; left:' + (this.calcPos(this.rowEle).left + pos.left) + 'px;';
        }
    }

    private updateHelper(): void {
        const pos: OffsetPosition = this.calcPos(this.curTable);
        if (this.resizeBtnStat.column) {
            const left: number = (pos.left + this.calcPos(this.columnEle as HTMLElement).left) +
            (this.currentColumnResize === 'last' ? this.columnEle.offsetWidth : 0) - 1;
            this.helper.style.left = left + 'px';
            this.helper.style.height = this.curTable.offsetHeight + 'px';
        } else {
            const top: number = this.calcPos(this.rowEle).top + pos.top + (this.rowEle as HTMLElement).offsetHeight - 1;
            this.helper.style.top = top + 'px';
        }
    }

    private calMaxCol(curTable: HTMLTableElement): HTMLTableDataCellElement[] {
        const cellColl: HTMLCollectionOf<HTMLTableDataCellElement> = curTable.rows[0].cells;
        let cellCount: number = 0;
        for (let cell: number = 0; cell < cellColl.length; cell++) {
            cellCount = cellCount + cellColl[cell as number].colSpan;
        }
        const cells: HTMLTableDataCellElement[] = new Array(cellCount);
        const rowSpanCells: Map<string, HTMLTableDataCellElement> = new Map();
        for (let i: number = 0; i < curTable.rows.length; i++) {
            let currentColIndex: number = 0;
            for (let k: number = 0; k < curTable.rows[i as number].cells.length; k++) {
                for (let l: number = 1; l < curTable.rows[i as number].cells[k as number].rowSpan; l++) {
                    const key: string = `${i + l}${currentColIndex}`;
                    rowSpanCells.set(key, curTable.rows[i as number].cells[k as number]);
                }
                const cellIndex: number = this.getCellIndex(rowSpanCells, i, k);
                if (cellIndex > currentColIndex) {
                    currentColIndex = cellIndex;
                }
                const width: number = curTable.rows[i as number].cells[k as number].offsetWidth;
                if (!cells[currentColIndex as number] || width < cells[currentColIndex as number].offsetWidth) {
                    cells[currentColIndex as number] = curTable.rows[i as number].cells[k as number];
                }
                currentColIndex += 1 + curTable.rows[i as number].cells[k as number].colSpan - 1;
            }
        }
        return cells;
    }

    private resizing(e: PointerEvent | TouchEvent): void {
        const pageX: number = this.getPointX(e);
        const pageY: number = this.getPointY(e);
        let mouseX: number = (this.parent.enableRtl) ? -(pageX - this.pageX) : (pageX - this.pageX);
        const mouseY: number = (this.parent.enableRtl) ? -(pageY - this.pageY) : (pageY - this.pageY);
        this.pageX = pageX;
        this.pageY = pageY;
        let maxiumWidth: number;
        const currentTdElement: HTMLElement = this.curTable.closest('td');
        const args: ResizeArgs = { event: e, requestType: 'table' };
        this.parent.trigger(events.onResize, args, (resizingArgs: ResizeArgs) => {
            if (resizingArgs.cancel) {
                this.cancelResizeAction();
            } else {
                const tableReBox: HTMLElement = this.contentModule.getEditPanel().querySelector('.e-table-box') as HTMLElement;
                const tableWidth: number = parseInt(getComputedStyle(this.curTable).width as string, 10);
                const tableHeight: number = !isNaN(parseInt(this.curTable.style.height, 10)) ?
                    parseInt(this.curTable.style.height, 10) : parseInt(getComputedStyle(this.curTable).height, 10);
                const paddingSize: number = +getComputedStyle(this.contentModule.getEditPanel()).paddingRight.match(/\d/g).join('');
                const rteWidth: number = (this.contentModule.getEditPanel() as HTMLElement).offsetWidth -
                    ((this.contentModule.getEditPanel() as HTMLElement).offsetWidth -
                    (this.contentModule.getEditPanel() as HTMLElement).clientWidth) - paddingSize * 2;
                let widthCompare: number;
                if (!isNOU(this.curTable.parentElement.closest('table')) && !isNOU(this.curTable.closest('td')) &&
                (this.contentModule.getEditPanel() as HTMLElement).contains(this.curTable.closest('td'))) {
                    const currentTd: HTMLElement = this.curTable.closest('td');
                    const currentTDPad: number = +getComputedStyle(currentTd).paddingRight.match(/\d/g).join('');
                    // Padding of the current table with the parent element multiply with 2.
                    widthCompare = currentTd.offsetWidth - (currentTd.offsetWidth - currentTd.clientWidth) - currentTDPad * 2;
                } else {
                    widthCompare = rteWidth;
                }
                if (this.resizeBtnStat.column) {
                    if (this.curTable.closest('li')) {
                        widthCompare = this.curTable.closest('li').offsetWidth;
                    }
                    const colGroup: NodeListOf<HTMLTableColElement> = this.curTable.querySelectorAll('colgroup > col');
                    let currentTableWidth: number;
                    if (this.curTable.style.width !== '' && this.curTable.style.width.includes('%')){
                        currentTableWidth =  parseFloat(this.curTable.style.width.split('%')[0]);
                    }
                    else {
                        currentTableWidth =  this.getCurrentTableWidth(this.curTable.offsetWidth, this.parent.inputElement.offsetWidth);
                    }
                    const currentCol: HTMLTableDataCellElement = this.calMaxCol(this.curTable)[this.colIndex];
                    const currentColResizableWidth: number = this.getCurrentColWidth(currentCol, tableWidth);
                    if (this.currentColumnResize === 'first') {
                        mouseX = mouseX - 0.75; //This was done for to make the gripper and the table first/last column will be close.
                        this.removeResizeElement();
                        if (currentTdElement) {
                            maxiumWidth = this.curTable.getBoundingClientRect().right - this.calcPos(currentTdElement).left;
                            this.curTable.style.maxWidth = maxiumWidth + 'px';
                        }
                        // Below the value '100' is the 100% width of the parent element.
                        if (((mouseX !== 0 && 5 < currentColResizableWidth) || mouseX < 0) && currentTableWidth <= 100 &&
                            this.convertPixelToPercentage(tableWidth - mouseX, widthCompare) <= 100) {
                            const firstColumnsCell: HTMLTableDataCellElement[] =  this.findFirstLastColCells(this.curTable, true);
                            this.curTable.style.width = this.convertPixelToPercentage(tableWidth - mouseX, widthCompare) > 100 ? (100 + '%') :
                                (this.convertPixelToPercentage(tableWidth - mouseX, widthCompare) + '%');
                            const differenceWidth: number = currentTableWidth - this.convertPixelToPercentage(
                                tableWidth - mouseX, widthCompare);
                            let preMarginLeft: number = 0;
                            const widthType: boolean = this.curTable.style.width.indexOf('%') > -1;
                            if (!widthType && this.curTable.offsetWidth > (this.contentModule.getEditPanel() as HTMLElement).offsetWidth) {
                                this.curTable.style.width = rteWidth + 'px';
                                return;
                            }
                            if (widthType && parseFloat(this.curTable.style.width.split('%')[0]) > 100) {
                                this.curTable.style.width = '100%';
                                return;
                            }
                            if (!isNOU(this.curTable.style.marginLeft) && this.curTable.style.marginLeft !== '') {
                                const regex: RegExp = /[-+]?\d*\.\d+|\d+/;
                                const value: RegExpMatchArray | null = this.curTable.style.marginLeft.match(regex);
                                if (!isNOU(value)) {
                                    preMarginLeft = parseFloat(value[0]);
                                }
                            }
                            let currentMarginLeft: number = preMarginLeft + differenceWidth;
                            if (currentMarginLeft && currentMarginLeft > 100) {
                                const width: number = parseFloat(this.curTable.style.width);
                                currentMarginLeft = 100 - width;
                            }
                            // For table pasted from word, Margin left can be anything so we are avoiding the below process.
                            if (!this.curTable.classList.contains('e-rte-paste-table') && currentMarginLeft && currentMarginLeft < 1) {
                                this.curTable.style.marginLeft = null;
                                this.curTable.style.width = '100%';
                                return;
                            }
                            this.curTable.style.marginLeft = 'calc(' + (this.curTable.style.width === '100%' ? 0 : currentMarginLeft) + '%)';
                            for (let i: number = 0; i < firstColumnsCell.length; i++) {
                                const currentColumnCellWidth: number = this.getCurrentColWidth(firstColumnsCell[i as number], tableWidth);
                                (firstColumnsCell[i as number] as HTMLTableDataCellElement).style.width = (currentColumnCellWidth - differenceWidth) + '%';
                            }
                        }
                    } else if (this.currentColumnResize === 'last') {
                        mouseX = mouseX + 0.75; //This was done for to make the gripper and the table first/last column will be close.
                        this.removeResizeElement();
                        if (currentTdElement) {
                            maxiumWidth = currentTdElement.getBoundingClientRect().right -  this.curTable.getBoundingClientRect().left;
                            this.curTable.style.maxWidth = maxiumWidth + 'px';
                        }
                        // Below the value '100' is the 100% width of the parent element.
                        if (((mouseX !== 0 && 5 < currentColResizableWidth) || mouseX > 0) &&
                            currentTableWidth <= 100 && this.convertPixelToPercentage(tableWidth + mouseX, widthCompare) <= 100) {
                            const lastColumnsCell: HTMLTableDataCellElement[] = this.findFirstLastColCells(this.curTable, false);
                            this.curTable.style.width = this.convertPixelToPercentage(tableWidth + mouseX, widthCompare) > 100 ? (100 + '%') : (this.convertPixelToPercentage(tableWidth + mouseX, widthCompare) + '%');
                            const differenceWidth: number = currentTableWidth - this.convertPixelToPercentage(
                                tableWidth + mouseX, widthCompare);
                            for (let i: number = 0; i < lastColumnsCell.length; i++) {
                                const currentColumnCellWidth: number = this.getCurrentColWidth(lastColumnsCell[i as number], tableWidth);
                                (lastColumnsCell[i as number] as HTMLTableDataCellElement).style.width = (currentColumnCellWidth - differenceWidth) + '%';
                            }
                        }
                    } else {
                        const actualwid: number = colGroup[this.colIndex].offsetWidth - mouseX;
                        // eslint-disable-next-line
                        const totalwid: number = (colGroup[this.colIndex] as HTMLTableColElement).offsetWidth + colGroup[this.colIndex - 1].offsetWidth;
                        if ((totalwid - actualwid) > 20 && actualwid > 20) {
                            const leftColumnWidth: number = totalwid - actualwid;
                            const rightColWidth: number = actualwid;
                            colGroup[this.colIndex - 1].style.width = this.convertPixelToPercentage(leftColumnWidth, tableWidth) + '%';
                            colGroup[this.colIndex].style.width = this.convertPixelToPercentage(rightColWidth, tableWidth) + '%';
                        }
                    }
                    this.updateHelper();
                } else if (this.resizeBtnStat.row) {
                    this.parent.preventDefaultResize(e as PointerEvent);
                    const tableTrElementPixel: number[] = [];
                    const currentTableTrElement: NodeListOf<Element> = this.curTable.querySelectorAll('tr');
                    for (let i: number = 0; i < currentTableTrElement.length; i++) {
                        if (this.rowEle !== currentTableTrElement[i as number]) {
                            tableTrElementPixel[i as number] = (parseFloat(currentTableTrElement[i as number].clientHeight.toString()));
                        }
                    }
                    this.curTable.style.height = (parseFloat(this.curTable.clientHeight.toString()) + ((mouseY > 0) ? 0 : mouseY)) + 'px';
                    for (let i: number = 0; i < currentTableTrElement.length; i++) {
                        if (this.rowEle === currentTableTrElement[i as number]) {
                            (currentTableTrElement[i as number] as HTMLElement).style.height = (parseFloat(currentTableTrElement[i as number].clientHeight.toString()) + mouseY) + 'px';
                        }
                        else {
                            (currentTableTrElement[i as number] as HTMLElement).style.height = tableTrElementPixel[i as number] + 'px';
                        }
                    }
                    if (!isNOU(tableReBox)) {
                        tableReBox.style.cssText = 'top: ' + (this.calcPos(this.curTable).top + tableHeight - 4) +
                        'px; left:' + (this.calcPos(this.curTable).left + tableWidth - 4) + 'px;';
                    }
                    this.updateHelper();
                } else if (this.resizeBtnStat.tableBox) {
                    if (currentTdElement) {
                        const tableBoxPosition: number = this.curTable.getBoundingClientRect().left
                        - currentTdElement.getBoundingClientRect().left;
                        maxiumWidth = Math.abs(tableBoxPosition - currentTdElement.getBoundingClientRect().width) - 5;
                        this.curTable.style.maxWidth = maxiumWidth + 'px';
                    }
                    this.curTable.style.height = tableHeight + mouseY + 'px';
                    if (!isNOU(tableReBox)) {
                        tableReBox.classList.add('e-rbox-select');
                        tableReBox.style.cssText = 'top: ' + (this.calcPos(this.curTable).top + parseInt(getComputedStyle(this.curTable).height, 10) - 4) +
                            'px; left:' + (this.calcPos(this.curTable).left + tableWidth - 4) + 'px;';
                    }
                    if (this.curTable.closest('li')) {
                        widthCompare = this.curTable.closest('li').offsetWidth;
                    }
                    const widthType: boolean = this.curTable.style.width.indexOf('%') > -1;
                    if (widthType && parseFloat(this.curTable.style.width.split('%')[0]) > 100) {
                        this.curTable.style.width = '100%';
                        return;
                    }
                    if (!widthType && this.curTable.offsetWidth > (this.contentModule.getEditPanel() as HTMLElement).offsetWidth) {
                        this.curTable.style.width = rteWidth + 'px';
                        return;
                    }
                    this.curTable.style.width = widthType ? this.convertPixelToPercentage(tableWidth + mouseX, widthCompare) + '%'
                        : tableWidth + mouseX + 'px';
                }
            }
        });
    }

    private getCurrentColWidth(col: HTMLTableCellElement, tableWidth: number): number {
        let currentColWidth: number = 0;
        if (col.style.width !== '' && col.style.width.includes('%')){
            currentColWidth =  parseFloat(col.style.width.split('%')[0]);
        }
        else {
            currentColWidth = this.convertPixelToPercentage(col.offsetWidth, tableWidth);
        }
        return currentColWidth;
    }

    private getCurrentTableWidth(tableWidth: number, parentWidth: number): number {
        let currentTableWidth: number = 0;
        currentTableWidth = tableWidth / parentWidth * 100;
        return currentTableWidth;
    }

    private findFirstLastColCells(table: HTMLTableElement, isFirst: boolean): HTMLTableDataCellElement[] {
        const resultColumns: HTMLTableDataCellElement[] = [];
        const rows: HTMLCollectionOf<HTMLTableRowElement> = (table as HTMLTableElement).rows;
        const rowSpanCellIndexs: string [] = [];
        for (let i : number = 0; i < rows.length; i++) {
            const cellIndex: number = isFirst ? 0 : rows[i as number].cells.length - 1;
            const column: HTMLTableCellElement = rows[i as number].cells[cellIndex as number];
            for (let rowSpan: number = 1; rowSpan < column.rowSpan; rowSpan++)
            {
                const key: string = `${i + rowSpan}-${cellIndex}`;
                rowSpanCellIndexs.push(key);
            }
            const spannedCellKey: string = `${i}-${cellIndex}`;
            if (rowSpanCellIndexs.length === 0 || (isFirst && rowSpanCellIndexs.indexOf(spannedCellKey) === -1) || (!isFirst && rowSpanCellIndexs.indexOf(spannedCellKey) === -1 && rowSpanCellIndexs.every((key: string) => key.split('-')[0] !== i.toString()))) {
                resultColumns.push(column);
            }
        }
        return resultColumns;
    }

    private convertPixelToPercentage(value: number, offsetValue: number): number {
        return (value / offsetValue) * 100;
    }

    private cancelResizeAction(): void {
        this.isResizeBind = true;
        EventHandler.remove(this.contentModule.getDocument(), Browser.touchMoveEvent, this.resizing);
        EventHandler.remove(this.contentModule.getDocument(), Browser.touchEndEvent, this.resizeEnd);
        this.removeResizeElement();
    }
    private resizeEnd(e: PointerEvent | TouchEvent): void {
        this.resizeBtnInit();
        this.isResizeBind = true;
        EventHandler.remove(this.contentModule.getDocument(), Browser.touchMoveEvent, this.resizing);
        EventHandler.remove(this.contentModule.getDocument(), Browser.touchEndEvent, this.resizeEnd);
        if (this.contentModule.getEditPanel().querySelector('.e-table-box') &&
            this.contentModule.getEditPanel().contains(this.contentModule.getEditPanel().querySelector('.e-table-box'))) {
            this.removeResizeElement();
        }
        if (this.helper && this.contentModule.getEditPanel().contains(this.helper)) {
            detach(this.helper); this.helper = null;
        }
        this.resetResizeHelper(this.curTable);
        this.pageX = null;
        this.pageY = null;
        this.moveEle = null;
        const currentTableTrElement: NodeListOf<Element> = this.curTable.querySelectorAll('tr');
        const tableTrPercentage: number[] = [];
        for (let i: number = 0; i < currentTableTrElement.length; i++) {
            const percentage: number = (parseFloat(currentTableTrElement[i as number].clientHeight.toString())
                / parseFloat(this.curTable.clientHeight.toString())) * 100;
            tableTrPercentage[i as number] = percentage;
        }
        for (let i: number = 0; i < currentTableTrElement.length; i++) {
            if ((currentTableTrElement[i as number] as HTMLElement).parentElement.nodeName === 'THEAD') {
                (currentTableTrElement[i as number] as HTMLElement).parentElement.style.height = tableTrPercentage[i as number] + '%';
                (currentTableTrElement[i as number] as HTMLElement).style.height = tableTrPercentage[i as number] + '%';
            }
            else {
                (currentTableTrElement[i as number] as HTMLElement).style.height = tableTrPercentage[i as number] + '%';
            }
        }
        const args: ResizeArgs = { event: e, requestType: 'table' };
        this.parent.trigger(events.resizeStop, args);
        this.parent.formatter.saveData();
        this.resizeEndTime = new Date().getTime();
    }

    private resetResizeHelper(curTable: HTMLTableElement): void {
        const colHelper: NodeListOf<Element> = this.parent.element.querySelectorAll('.e-table-rhelper.e-column-helper');
        Array.from(colHelper).forEach((element: Element) => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });
        const rowHelper: NodeListOf<Element> = this.parent.element.querySelectorAll('.e-table-rhelper.e-row-helper');
        Array.from(rowHelper).forEach((element: Element) => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });
        if (!curTable.style.width) {
            curTable.style.width = curTable.offsetWidth + 'px';
        }
        const colGroup: HTMLElement | null  = curTable.querySelector('colgroup');
        if (colGroup) {
            for (let i: number = 0; i < curTable.rows.length; i++) {
                for (let k: number = 0; k < curTable.rows[i as number].cells.length; k++) {
                    const width: string = this.convertPixelToPercentage(curTable.rows[i as number].cells[k as number].offsetWidth, parseInt(getComputedStyle(curTable).width, 10)) + '%';
                    curTable.rows[i as number].cells[k as number].style.width = width;
                }
            }
            curTable.removeChild(colGroup);
        }
    }

    private resizeBtnInit(): { [key: string]: boolean } {
        return this.resizeBtnStat = { column: false, row: false, tableBox: false };
    }
    private addRow(selectCell: NodeSelection, e: ClickEventArgs | KeyboardEvent, tabkey?: boolean): void {
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
        if (this.parent.inputElement.innerHTML === null || this.parent.inputElement.innerHTML === '') {
            if (this.parent.enterKey === 'DIV') {
                this.contentModule.getEditPanel().innerHTML = '<div><br/></div>';
            } else if (this.parent.enterKey === 'BR') {
                this.contentModule.getEditPanel().innerHTML = '<br/>';
            } else {
                this.contentModule.getEditPanel().innerHTML = '<p><br/></p>';
            }
        }
        this.removeResizeElement();
        this.hideTableQuickToolbar();
    }

    private renderDlgContent(args?: ITableNotifyArgs): void {
        const argsTarget: HTMLElement = (args.args as ClickEventArgs).originalEvent.target as HTMLElement;
        if (Browser.isDevice || this.parent.inlineMode.enable || !isNullOrUndefined(closest(argsTarget, '.e-rte-text-popup'))) {
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
        this.dlgDiv = this.parent.createElement('div', { className: 'e-rte-table-popup' + this.parent.getCssClass(true), id: this.rteID + '_table' });
        this.createTablePopupBoundFn = this.createTablePopupKeyDown.bind(this);
        this.dlgDiv.addEventListener('keydown', this.createTablePopupBoundFn);
        this.tblHeader = this.parent.createElement('div', { className: 'e-rte-popup-header' + this.parent.getCssClass(true) });
        this.tblHeader.innerHTML = header;
        this.dlgDiv.appendChild(this.tblHeader);
        const tableDiv: HTMLElement = this.parent.createElement('div', { className: 'e-rte-table-span' + this.parent.getCssClass(true) });
        this.drawTable(tableDiv, args);
        this.dlgDiv.appendChild(tableDiv);
        this.dlgDiv.appendChild(this.parent.createElement('span', { className: 'e-span-border' + this.parent.getCssClass(true) }));
        const btnEle: HTMLElement = this.parent.createElement('button', {
            className: 'e-insert-table-btn' + this.parent.getCssClass(true), id: this.rteID + '_insertTable',
            attrs: { type: 'button', tabindex: '0' }
        });
        if (!isNOU(this.parent.getToolbarElement().querySelector('.e-expended-nav') as HTMLElement)) {
            (this.parent.getToolbarElement().querySelector('.e-expended-nav') as HTMLElement).setAttribute('tabindex', '1');
        }
        this.dlgDiv.appendChild(btnEle);
        this.createTableButton = new Button({
            iconCss: 'e-icons e-create-table', content: insertbtn, cssClass: 'e-flat' + this.parent.getCssClass(true),
            enableRtl: this.parent.enableRtl, locale: this.parent.locale
        });
        this.createTableButton.isStringTemplate = true;
        this.createTableButton.appendTo(btnEle);
        EventHandler.add(btnEle, 'click', this.insertTableDialog, { self: this, args: args.args, selection: args.selection });
        this.parent.getToolbar().parentElement.appendChild(this.dlgDiv);
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
                EventHandler.remove(btnEle, 'click', this.insertTableDialog);
                this.dlgDiv.removeEventListener('keydown', this.createTablePopupBoundFn);
                detach(btnEle);
                if (this.createTableButton && !this.createTableButton.isDestroyed) {
                    this.createTableButton.destroy();
                    this.createTableButton.element = null;
                    this.createTableButton = null;
                }
                this.parent.isBlur = false;
                this.popupObj.destroy();
                detach(this.popupObj.element);
                this.popupObj = null;
            }
        });
        addClass([this.popupObj.element], 'e-popup-open');
        if (!isNOU(this.parent.cssClass)) {
            addClass([this.popupObj.element], this.parent.getCssClass());
        }
        btnEle.focus();
        this.popupObj.refreshPosition(target);
    }

    private onIframeMouseDown(): void {
        if (this.popupObj) {
            this.popupObj.hide();
        }
        if (this.parent.inlineMode.enable && this.editdlgObj) {
            this.editdlgObj.hide();
        }
        if (!isNOU(this.parent) && !isNOU(this.parent.contentModule) && !isNOU(this.parent.contentModule.getEditPanel())) {
            this.removeResizeElement();
        }
    }

    private docClick(e: { [key: string]: object }): void {
        const target: HTMLElement = <HTMLElement>(e.args as MouseEvent).target;
        // eslint-disable-next-line
        if (target && target.classList && ((this.popupObj && !closest(target, '[id=' + "'" + this.popupObj.element.id + "'" +']') ||
            (this.editdlgObj && !closest(target, '#' + this.editdlgObj.element.id)))) && !target.classList.contains('e-create-table') &&
            target.offsetParent && !target.offsetParent.classList.contains('e-rte-backgroundcolor-dropdown')) {
            if (this.popupObj) {
                this.popupObj.hide();
            }
            if (this.editdlgObj) {
                this.parent.notify(events.documentClickClosedBy, { closedBy: 'outside click' });
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
            const isToolbarClick: boolean = target && target.closest('.e-toolbar') ? true : false;
            if (!isToolbarClick) {
                this.removeCellSelectClasses();
            }
            this.removeTableSelection();
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
            rowDiv = this.parent.createElement('div', { className: 'e-rte-table-row' + this.parent.getCssClass(true), attrs: { 'data-column': '' + row } });
            EventHandler.add(rowDiv, 'mouseleave', this.tableCellLeave, this);
            for (let col: number = 0; col < 10; col++) {
                tableCell = this.parent.createElement('div', { className: 'e-rte-tablecell e-default' + this.parent.getCssClass(true), attrs: { 'data-cell': '' + col } });
                rowDiv.appendChild(tableCell);
                tableCell.style.display = 'inline-block';
                if (col === 0 && row === 0) {
                    addClass([tableCell], 'e-active');
                }
                EventHandler.add(tableCell, 'mousemove', this.tableCellSelect, this);
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
                buttonModel: { content: update, cssClass: 'e-flat e-size-update' + this.parent.getCssClass(true), isPrimary: true }
            },
            {
                click: (e: MouseEvent) => {
                    this.cancelDialog(e);
                },
                buttonModel: { cssClass: 'e-flat e-cancel' + this.parent.getCssClass(true), content: cancel }
            }],
            cssClass: this.editdlgObj.cssClass + ' e-rte-edit-table-prop-dialog'
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
                buttonModel: { content: insert, cssClass: 'e-flat e-insert-table' + ' ' + proxy.parent.cssClass, isPrimary: true }
            },
            {
                click: (e: MouseEvent) => {
                    proxy.cancelDialog(e);
                },
                buttonModel: { cssClass: 'e-flat e-cancel' + ' ' + proxy.parent.cssClass, content: cancel }
            }]
        });
        if (!isNOU(proxy.parent.cssClass)) {
            proxy.editdlgObj.setProperties({ cssClass: proxy.parent.cssClass });
        }
        proxy.editdlgObj.element.style.maxHeight = 'none';
        (proxy.editdlgObj.content as HTMLElement).querySelector('input').focus();
    }

    private tableCellDlgContent(): HTMLElement {
        const tableColumn: string = this.l10n.getConstant('columns');
        const tableRow: string = this.l10n.getConstant('rows');
        const tableWrap: HTMLElement = this.parent.createElement('div', { className: 'e-cell-wrap' + this.parent.getCssClass(true) });
        const content: string = '<div class="e-rte-field' + this.parent.getCssClass(true) + '"><input type="text" '
            + ' data-role ="none" id="tableColumn" class="e-table-column' + this.parent.getCssClass(true) + '"/></div>'
            + '<div class="e-rte-field' + this.parent.getCssClass(true) + '"><input type="text" data-role ="none" id="tableRow" class="e-table-row' + this.parent.getCssClass(true) + '" /></div>';
        const contentElem: DocumentFragment = parseHtml(content);
        tableWrap.appendChild(contentElem);
        this.columnTextBox = new NumericTextBox({
            format: 'n0',
            min: 1,
            value: 3,
            placeholder: tableColumn,
            floatLabelType: 'Auto',
            max: 50,
            enableRtl: this.parent.enableRtl, locale: this.parent.locale,
            cssClass: this.parent.getCssClass()
        });
        this.columnTextBox.isStringTemplate = true;
        this.columnTextBox.appendTo(tableWrap.querySelector('#tableColumn') as HTMLElement);
        this.rowTextBox = new NumericTextBox({
            format: 'n0',
            min: 1,
            value: 3,
            placeholder: tableRow,
            floatLabelType: 'Auto',
            max: 1000,
            enableRtl: this.parent.enableRtl, locale: this.parent.locale,
            cssClass: this.parent.getCssClass()
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
            className: 'e-rte-edit-table' + this.parent.getCssClass(true), id: this.rteID + '_tabledialog' });
        this.parent.rootContainer.appendChild(tableDialog);
        const insert: string = this.l10n.getConstant('dialogInsert');
        const cancel: string = this.l10n.getConstant('dialogCancel');
        const header: string = this.l10n.getConstant('tabledialogHeader');
        const dialogModel: DialogModel = {
            header: header,
            cssClass: classes.CLS_RTE_ELEMENTS + this.parent.getCssClass(true),
            enableRtl: this.parent.enableRtl,
            locale: this.parent.locale,
            showCloseIcon: true, closeOnEscape: true, width: (Browser.isDevice) ? '290px' : '340px', height: 'initial',
            position: { X: 'center', Y: (Browser.isDevice) ? 'center' : 'top' },
            isModal: (Browser.isDevice as boolean),
            buttons: [{
                buttonModel: { content: insert, cssClass: 'e-flat e-insert-table' + this.parent.getCssClass(true), isPrimary: true }
            },
            {
                click: (e: MouseEvent) => {
                    this.cancelDialog(e);
                },
                buttonModel: { cssClass: 'e-flat e-cancel' + this.parent.getCssClass(true), content: cancel }
            }],
            target: (Browser.isDevice) ? document.body : this.parent.element,
            animationSettings: { effect: 'None' },
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
        if (this.quickToolObj && this.quickToolObj.textQTBar &&
             this.parent.element.ownerDocument.body.contains(this.quickToolObj.textQTBar.element)) {
            this.quickToolObj.textQTBar.hidePopup();
        }
    }

    private customTable(args: ITableNotifyArgs, e: MouseEvent): void {
        const proxy: Table = ((this as ITableNotifyArgs).self) ? (this as ITableNotifyArgs).self : this;
        if (proxy && proxy.rowTextBox && proxy.rowTextBox.value && proxy.columnTextBox && proxy.columnTextBox.value) {
            const argument: ITableNotifyArgs = ((Browser.isDevice || (!isNullOrUndefined(args.args as ClickEventArgs)
                && !isNullOrUndefined((args.args as ClickEventArgs).originalEvent) &&
                ((args.args as ClickEventArgs).originalEvent as
                    KeyboardEventArgs).action === 'insert-table')
                || proxy.parent.inlineMode.enable ||
                ((!isNullOrUndefined(proxy.parent.quickToolbarSettings.text)) && !(args instanceof PointerEvent))) ? args :
                this as ITableNotifyArgs);
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
        if (dialogEle && args && args.selectNode.length > 0 && args.selectNode[0]) {
            const selectedElement: HTMLElement = (args.selectNode[0] && args.selectNode[0].nodeType === 3 ?
                args.selectNode[0].parentNode : args.selectNode[0]) as HTMLElement;
            const table: HTMLTableElement = selectedElement ? closest(selectedElement, 'table') as HTMLTableElement : null;
            if (table) {
                table.style.width = dialogEle.querySelector('.e-table-width') ? (dialogEle.querySelector('.e-table-width') as HTMLInputElement).value + 'px'
                    : table.style.width;
                if (dialogEle.querySelector('.e-cell-padding') && (dialogEle.querySelector('.e-cell-padding') as HTMLInputElement).value !== '') {
                    const tdElm: NodeListOf<HTMLElement> = table.querySelectorAll('td');
                    for (let i: number = 0; i < tdElm.length; i++) {
                        let padVal: string = '';
                        if (tdElm[i as number].style.padding === '') {
                            padVal = tdElm[i as number].getAttribute('style') + ' padding:' +
                                (dialogEle.querySelector('.e-cell-padding') as HTMLInputElement).value + 'px;';
                        } else {
                            tdElm[i as number].style.padding = (dialogEle.querySelector('.e-cell-padding') as HTMLInputElement).value + 'px';
                            padVal = tdElm[i as number].getAttribute('style');
                        }
                        tdElm[i as number].setAttribute('style', padVal);
                    }
                }
                table.cellSpacing = dialogEle.querySelector('.e-cell-spacing') ? (dialogEle.querySelector('.e-cell-spacing') as HTMLInputElement).value
                    : table.cellSpacing;
                if (!isNOU(table.cellSpacing) && table.cellSpacing !== '0') {
                    addClass([table], classes.CLS_TABLE_BORDER);
                } else {
                    removeClassWithAttr([table], classes.CLS_TABLE_BORDER);
                }
                this.parent.formatter.saveData();
                this.editdlgObj.hide({ returnValue: true } as Event);
            }
        }
    }
    private tableDlgContent(e: ITableNotifyArgs): HTMLElement {
        const selectNode: HTMLElement = (e as ITableNotifyArgs).selectParent[0] as HTMLElement;
        const tableWidth: string = this.l10n.getConstant('tableWidth');
        const cellPadding: string = this.l10n.getConstant('cellpadding');
        const cellSpacing: string = this.l10n.getConstant('cellspacing');
        const tableWrap: HTMLElement = this.parent.createElement('div', { className: 'e-table-sizewrap' + this.parent.getCssClass(true) });
        const widthVal: string | number = closest(selectNode, 'table').getClientRects()[0].width;
        const padVal: string | number = (closest(selectNode, 'td') as HTMLElement).style.padding;
        const brdSpcVal: string | number = (closest(selectNode, 'table') as HTMLElement).getAttribute('cellspacing');
        const content: string = '<div class="e-rte-field' + this.parent.getCssClass(true) + '"><input type="text" data-role ="none" id="tableWidth" class="e-table-width' + this.parent.getCssClass(true) + '" '
            + ' /></div>' + '<div class="e-rte-field' + this.parent.getCssClass(true) + '"><input type="text" data-role ="none" id="cellPadding" class="e-cell-padding' + this.parent.getCssClass(true) + '" />'
            + ' </div><div class="e-rte-field' + this.parent.getCssClass(true) + '"><input type="text" data-role ="none" id="cellSpacing" class="e-cell-spacing' + this.parent.getCssClass(true) + '" /></div>';
        const contentElem: DocumentFragment = parseHtml(content);
        tableWrap.appendChild(contentElem);
        this.tableWidthNum = new NumericTextBox({
            format: 'n0',
            min: 0,
            value: widthVal,
            placeholder: tableWidth,
            floatLabelType: 'Auto',
            enableRtl: this.parent.enableRtl, locale: this.parent.locale
        });
        this.tableWidthNum.isStringTemplate = true;
        this.tableWidthNum.appendTo(tableWrap.querySelector('#tableWidth') as HTMLElement);
        this.tableCellPadding = new NumericTextBox({
            format: 'n0',
            min: 0,
            // eslint-disable-next-line
            value: padVal !== '' ? parseInt(padVal, null) : 0,
            placeholder: cellPadding,
            floatLabelType: 'Auto',
            enableRtl: this.parent.enableRtl, locale: this.parent.locale
        });
        this.tableCellPadding.isStringTemplate = true;
        this.tableCellPadding.appendTo(tableWrap.querySelector('#cellPadding') as HTMLElement);
        this.tableCellSpacing = new NumericTextBox({
            format: 'n0',
            min: 0,
            // eslint-disable-next-line
            value:  brdSpcVal !== '' && !isNOU(brdSpcVal) ? parseInt(brdSpcVal, null) : 0,
            placeholder: cellSpacing,
            floatLabelType: 'Auto',
            enableRtl: this.parent.enableRtl, locale: this.parent.locale
        });
        this.tableCellSpacing.isStringTemplate = true;
        this.tableCellSpacing.appendTo(tableWrap.querySelector('#cellSpacing') as HTMLElement);
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
        if (this.isDestroyed) { return; }
        if (this.resizeIconPositionTime){
            clearTimeout(this.resizeIconPositionTime);
            this.resizeIconPositionTime = null;
        }
        this.removeEventListener();
        EventHandler.remove(this.parent.contentModule.getDocument(), 'selectionchange', this.tableCellsKeyboardSelection);
        if (this.curTable) {
            EventHandler.remove(this.curTable, 'mouseleave', this.tableMouseLeave);
        }
        if (this.tableCellSpacing && !this.tableCellSpacing.isDestroyed) {
            this.tableCellSpacing.destroy();
            this.tableCellSpacing = null;
        }
        if (this.tableCellPadding && !this.tableCellPadding.isDestroyed) {
            this.tableCellPadding.destroy();
            this.tableCellPadding = null;
        }
        if (this.tableWidthNum && !this.tableWidthNum.isDestroyed) {
            this.tableWidthNum.destroy();
            this.tableWidthNum = null;
        }
        if (this.rowTextBox && !this.rowTextBox.isDestroyed) {
            this.rowTextBox.destroy();
            this.rowTextBox = null;
        }
        if (this.columnTextBox && !this.columnTextBox.isDestroyed) {
            this.columnTextBox.destroy();
            this.columnTextBox = null;
        }
        if (this.createTableButton && !this.createTableButton.isDestroyed) {
            this.createTableButton.destroy();
            this.createTableButton = null;
        }
        this.createTablePopupBoundFn = null;
        this.isDestroyed = true;
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {void}
     */
    private getModuleName(): string {
        return 'table';
    }

    private afterKeyDown(): void {
        if (this.curTable) {
            this.resizeIconPositionTime = setTimeout(() => {
                this.updateResizeIconPosition();
            }, 1);
        }
    }

    private updateResizeIconPosition(): void {
        const tableReBox: HTMLElement = this.parent.contentModule.getEditPanel().querySelector('.e-table-box');
        if (!isNOU(tableReBox)) {
            const tablePosition: OffsetPosition = this.calcPos(this.curTable);
            tableReBox.style.cssText = 'top: ' + (tablePosition.top + parseInt(getComputedStyle(this.curTable).height, 10) - 4) +
            'px; left:' + (tablePosition.left + parseInt(getComputedStyle(this.curTable).width, 10) - 4) + 'px;';
        }
    }

    private createTablePopupKeyDown(e: KeyboardEvent): void {
        if (e.key === 'Escape') {
            const popupRootElem: HTMLElement = (e.target as HTMLElement).closest('.e-rte-table-popup') as HTMLElement;
            const popup: Popup  = getComponent(popupRootElem, 'popup');
            const tableToolbarButton: HTMLElement = popup.relateTo as HTMLElement;
            popup.hide();
            tableToolbarButton.focus({preventScroll: true});
        }
    }
}
