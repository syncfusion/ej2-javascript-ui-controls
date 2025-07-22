/*
 * Importing required modules from Syncfusion libraries and local sources
 * Organized by external dependencies first, then internal modules
 */
import {
    closest, Browser, isNullOrUndefined as isNOU, select, selectAll, EventHandler,
    addClass, KeyboardEventArgs
} from '../../../base'; /*externalscript*/

import { ClickEventArgs } from '../../../navigations/src'; /*externalscript*/

// Local utility imports
import * as events from '../constant';
import * as classes from '../classes';
import { dispatchEvent, hasClass } from '../util';
import { removeClassWithAttr } from '../../src/common/util';

// Component imports
import { QuickToolbar } from '../actions/quick-toolbar';
import { TableCommand } from '../../src/editor-manager';
import { SfRichTextEditor } from '../sf-richtexteditor-fn';
import { NodeSelection } from '../../src/selection/selection';

// Interface imports
import {
    IDropDownItemModel, ITableModel, ResizeArgs, IColorPickerEventArgs,
    ITableArgs, IToolbarItemModel, NotifyArgs, ITableNotifyArgs, EditTableModel,
    ITableModule
} from '../../src/common/interface';

/*
 * Table module for the Rich Text Editor component
 */
export class Table {
    /**
     * Table command object for handling table operations
     *
     * @public
     */
    public tableObj: TableCommand;

    /*
     * Parent rich text editor instance
     *
     * @private
     */
    private parent: SfRichTextEditor;

    /*
     * Quick toolbar instance for table operations
     *
     * @private
     */
    private quickToolObj: QuickToolbar;

    /*
     * Arguments for table notification events
     *
     * @private
     */
    private tableNotifyArgs: ITableNotifyArgs;

    /*
     * Constructor for the Table module
     */
    constructor(parent?: SfRichTextEditor) {
        this.parent = parent;
        this.addEventListener();
    }

    /*
     * Attaches event listeners to the parent component's observer
     * Sets up all table-related event handlers
     */
    protected addEventListener(): void {
        if (!this.parent || !this.parent.observer) {
            return;
        }

        // Register keyboard event handlers
        this.parent.observer.on(events.keyUp, this.keyUp, this);
        this.parent.observer.on(events.keyDown, this.keyDown, this);

        // Register lifecycle events
        this.parent.observer.on(events.destroy, this.destroy, this);
        this.parent.observer.on(events.bindOnEnd, this.bindOnEnd, this);

        // Register mouse events
        this.parent.observer.on(events.docClick, this.docClick, this);
        this.parent.observer.on(events.iframeMouseDown, this.onIframeMouseDown, this);
        this.parent.observer.on(events.editAreaClick, this.editAreaClickHandler, this);

        // Register table-specific events
        this.parent.observer.on(events.createTable, this.renderDlgContent, this);
        this.parent.observer.on(events.dropDownSelect, this.dropdownSelect, this);
        this.parent.observer.on(events.tableToolbarAction, this.onToolbarAction, this);
        this.parent.observer.on(events.afterKeyDown, this.afterKeyDown, this);
    }

    /*
     * Detaches all event listeners from the parent component's observer
     * Cleans up event handlers to prevent memory leaks
     */
    protected removeEventListener(): void {
        if (!this.parent || !this.parent.observer) {
            return;
        }

        // Remove keyboard event handlers
        this.parent.observer.off(events.keyUp, this.keyUp);
        this.parent.observer.off(events.keyDown, this.keyDown);

        // Remove lifecycle events
        this.parent.observer.off(events.destroy, this.destroy);
        this.parent.observer.off(events.bindOnEnd, this.bindOnEnd);

        // Remove mouse events
        this.parent.observer.off(events.docClick, this.docClick);
        this.parent.observer.off(events.iframeMouseDown, this.onIframeMouseDown);
        this.parent.observer.off(events.editAreaClick, this.editAreaClickHandler);

        // Remove table-specific events
        this.parent.observer.off(events.createTable, this.renderDlgContent);
        this.parent.observer.off(events.dropDownSelect, this.dropdownSelect);
        this.parent.observer.off(events.tableToolbarAction, this.onToolbarAction);
        this.parent.observer.off(events.tableColorPickerChanged, this.setBGColor);
        this.parent.observer.off(events.afterKeyDown, this.afterKeyDown);

        // Remove table object event if it exists
        if (this.tableObj) {
            this.parent.observer.off(events.mouseDown, this.tableObj.cellSelect);
        }
    }

    /*
     * Initializes the TableCommand object in the editor manager after editor initialization is complete.
     * This method binds the table module to the editor's formatter for handling table-related operations.
     */
    private bindOnEnd(): void {
        if (this.parent.editorMode === 'HTML' && this.parent.formatter && this.parent.formatter.editorManager) {
            // Create TableCommand with table model containing required methods
            const tableModel: ITableModel = {
                tableSettings: this.parent.tableSettings,
                rteElement: this.parent.element,
                readonly: this.parent.readonly,
                enableRtl: this.parent.enableRtl,
                editorMode: this.parent.editorMode,
                enterKey: this.parent.enterKey,
                quickToolbarSettings: this.parent.quickToolbarSettings,
                // Method for retrieving CSS class name
                getCssClass: (isSpace?: boolean) => {
                    return this.parent.getCssClass(isSpace);
                },

                // Method for preventing default resize behavior
                preventDefaultResize: (e: PointerEvent | MouseEvent, isDefault: boolean) => {
                    this.parent.preventDefaultResize(e, isDefault);
                },

                // Method for retrieving the document object of the content module
                getDocument: () => {
                    return this.parent.getDocument();
                },

                // Method for retrieving the editable element object of the content module
                getEditPanel: () => {
                    return this.parent.getEditPanel();
                },

                // Table resize event handlers
                resizeStart: (args: ResizeArgs) => {
                    this.resizeStart(args);
                },
                resizing: (args: ResizeArgs) => {
                    this.resizing(args);
                },
                resizeEnd: (args: ResizeArgs) => {
                    this.resizeEnd(args);
                },

                // Table manipulation methods
                addRow: (selectCell: NodeSelection, e: ClickEventArgs | KeyboardEvent, tabkey?: boolean) => {
                    this.addRow(selectCell, e, tabkey);
                },
                hideTableQuickToolbar: () => {
                    this.hideTableQuickToolbar();
                },
                removeTable: (selection: NodeSelection, args?: ClickEventArgs | KeyboardEventArgs, delKey?: boolean) => {
                    this.removeTable(selection, args, delKey);
                },

                // Method for Checks if the table quick toolbar is currently visible in the document.
                isTableQuickToolbarVisible: () => {
                    return this.isTableQuickToolbarVisible();
                }
            };

            this.parent.formatter.editorManager.tableObj = this.tableObj =
                new TableCommand(this.parent.formatter.editorManager, tableModel, this.parent.iframeSettings);

            if (this.tableObj) {
                if (this.parent.tableSettings.resize) {
                    this.tableObj.addResizeEventHandlers();
                }

                // First remove any existing event handler to prevent duplicates
                this.parent.observer.off(events.mouseDown, this.tableObj.cellSelect);
                this.parent.observer.off(events.tableColorPickerChanged, this.setBGColor);

                // Then add the event handler
                this.parent.observer.on(events.mouseDown, this.tableObj.cellSelect, this.tableObj);
                this.parent.observer.on(events.tableColorPickerChanged, this.setBGColor, this);
            }
        }
    }

    /*
     * Handles the resize start event by triggering an event and processing the result.
     */
    private resizeStart(args: ResizeArgs): void {
        if (this.parent.getDocument().activeElement !== this.parent.inputElement) {
            this.parent.focusIn();
        }
        if (this.parent.onResizeStartEnabled) {
            (this.parent.dotNetRef.invokeMethodAsync('ResizeStartEvent', args) as unknown as Promise<ResizeArgs>).then((resizeStartArgs: ResizeArgs) => {
                if (resizeStartArgs.cancel && this.tableObj) {
                    this.tableObj.cancelResizeAction();
                }
            });
        }
    }

    /*
     * Handles the resizing event by triggering an event and processing the result.
     */
    private resizing(args: ResizeArgs): void {
        if (this.tableObj) {
            this.tableObj.perfomResizing(args.event as PointerEvent | TouchEvent);
        }
    }

    /*
     * Handles the resize end event by triggering an event and processing the result.
     *
     * @param {ResizeArgs} args - The resize event arguments
     * @returns {void} - Does not return any value
     * @private
     */
    private resizeEnd(args: ResizeArgs): void {
        if (this.parent.onResizeStopEnabled) {
            this.parent.dotNetRef.invokeMethodAsync('ResizeStopEvent', args);
        }
    }

    /*
     * Renders dialog content for table operations
     *
     * @param {ITableNotifyArgs} args - Table notification arguments
     * @returns {void} - No return value
     * @private
     */
    private renderDlgContent(args?: ITableNotifyArgs): void {
        this.tableNotifyArgs = args;
        this.parent.observer.notify(events.selectionSave, {});
        if (Browser.isDevice || this.parent.inlineMode.enable || (this.parent.quickToolbarSettings.text &&
            this.parent.quickToolbarSettings.text.length > 0 && args.args &&
            (args.args as ClickEventArgs).originalEvent.target as HTMLElement &&
            ((args.args as ClickEventArgs).originalEvent.target as HTMLElement).classList &&
            ((args.args as ClickEventArgs).originalEvent.target as HTMLElement).classList.contains('e-rte-text-popup'))) {
            this.createDialog();
            return;
        }
        this.hideTableQuickToolbar();
        const tbEle: HTMLElement = this.parent.getToolbarElement() as HTMLElement;
        const tbTableEle: HTMLElement = this.parent.element.querySelector('#' + this.parent.element.id + '_toolbar_CreateTable');
        let top: number = tbEle.getBoundingClientRect().height;
        if (this.parent.toolbarSettings.position === 'Bottom') {
            top = (this.parent.getEditPanel().getBoundingClientRect().height - 150);
            if (this.parent.element.querySelector('.e-rte-character-count')) {
                top = top + this.parent.element.querySelector('.e-rte-character-count').getBoundingClientRect().height;
            }
        }
        let left: number = tbTableEle.offsetLeft;
        if (this.parent.toolbarSettings.type === 'Popup' && (tbEle.firstElementChild !== tbTableEle.parentElement)) {
            left = tbTableEle.getBoundingClientRect().left - this.parent.element.getBoundingClientRect().left;
            top = tbTableEle.getBoundingClientRect().bottom - this.parent.element.getBoundingClientRect().top;
        }
        const hScrollBarElem: HTMLElement = this.parent.getToolbar().querySelector('.e-hscroll-bar');
        if (!isNOU(hScrollBarElem)) {
            left = tbTableEle.offsetLeft - hScrollBarElem.scrollLeft;
        }
        if (isNOU(select('.e-rte-table-popup', this.parent.element))) {
            this.parent.dotNetRef.invokeMethodAsync('ShowCreateTableDialog', left, top);
        } else {
            this.parent.dotNetRef.invokeMethodAsync('CloseCreateTableDialog');
        }
    }

    /*
     * Checks if the table quick toolbar is currently visible in the document.
     */
    private isTableQuickToolbarVisible(): boolean {
        return this.quickToolObj && this.quickToolObj.getTableQTBarElement &&
            document.body.contains(this.quickToolObj.getTableQTBarElement());
    }

    /*
     * Handles the event when the create table popup is opened
     *
     * @returns {void} - No return value
     */
    public createTablePopupOpened(): void {
        if (!this.tableObj) {
            return;
        }
        const rowElements: HTMLElement[] = selectAll('.e-rte-table-popup .e-rte-table-row', this.parent.element);
        for (let i: number = 0; i < rowElements.length; i++) {
            EventHandler.add(rowElements[i as number], 'mouseleave', this.tableObj.tableCellLeave, this.tableObj);
            const tableCells: HTMLElement[] = selectAll('.e-rte-tablecell', rowElements[i as number]);
            for (let j: number = 0; j < tableCells.length; j++) {
                EventHandler.add(tableCells[j as number], 'mouseup', this.tableCellClick, this);
                EventHandler.add(tableCells[j as number], 'mousemove', this.tableObj.tableCellSelect, this.tableObj);
            }
        }
        // Setting the Zindex value for the toolbar while createTablePopup got opened for avoid overlapping
        const toolbar: HTMLElement = this.parent.element.querySelector('.e-toolbar-container');
        toolbar.style.zIndex = '11';
        const dlgEle: HTMLElement = this.parent.element.querySelector('.e-rte-table-popup') as HTMLElement;
        if (dlgEle) {
            dlgEle.focus();
        }
        if (!isNOU(this.parent.getToolbarElement().querySelector('.e-expended-nav') as HTMLElement)) {
            (this.parent.getToolbarElement().querySelector('.e-expended-nav') as HTMLElement).setAttribute('tabindex', '1');
        }
        this.tableObj.dlgDiv = this.parent.element.querySelector('.e-rte-table-popup');
        this.tableObj.tblHeader = this.parent.element.querySelector('.e-rte-table-popup .e-rte-popup-header');
    }

    /*
     * Creates dialog for table operations
     */
    private createDialog(model?: object, mode?: string): void {
        if (model && mode) {
            this.parent.dotNetRef.invokeMethodAsync('ShowEditTableDialog', model, mode);
        } else {
            this.parent.dotNetRef.invokeMethodAsync('ShowTableDialog');
        }
        if (this.quickToolObj && this.quickToolObj.getInlineQTBarElement() &&
            document.body.contains(this.quickToolObj.getInlineQTBarElement())) {
            this.quickToolObj.hideInlineQTBar();
            if (!isNOU(this.quickToolObj.textQTBar) && !isNOU(this.quickToolObj.textQTBar.element) && this.quickToolObj.textQTBar.element.classList.contains('e-popup-open')) {
                this.quickToolObj.hideTextQTBar();
            }
        }
    }

    /*
     * Handles table cell click event
     */
    private tableCellClick(e: MouseEvent): void {
        const target: EventTarget = e.target;
        const row: number = Array.prototype.slice.call(
            (target as HTMLElement).parentElement.parentElement.children).indexOf((target as HTMLElement).parentElement) + 1;
        const col: number = Array.prototype.slice.call((target as HTMLElement).parentElement.children).indexOf(target) + 1;
        this.tableInsert(row, col, 'Create', this as ITableNotifyArgs);
    }

    /*
     * Inserts a table with specified rows and columns
     */
    private tableInsert(row: number, col: number, dlgTarget: string, selectionObj?: ITableNotifyArgs): void {
        const proxy: Table = (selectionObj.self) ? selectionObj.self as unknown as Table : this;
        const startContainer: Node = this.tableNotifyArgs.selection.range.startContainer;
        if (startContainer.nodeName === 'P' && startContainer.textContent.trim() === '' && !(startContainer.childNodes.length > 0)) {
            (startContainer as Element).innerHTML = '<br />';
        }
        const parentNode: Node = startContainer.parentNode;
        if (proxy.parent.editorMode === 'HTML' &&
            ((proxy.parent.iframeSettings.enable && !hasClass(parentNode.ownerDocument.querySelector('body'), 'e-lib')) ||
                (!proxy.parent.iframeSettings.enable && isNOU(closest(parentNode, '#' + proxy.parent.getPanel().id))))) {
            (proxy.parent.getEditPanel() as HTMLElement).focus();
            const range: Range = proxy.parent.formatter.editorManager.nodeSelection.getRange(proxy.parent.getDocument());
            this.tableNotifyArgs.selection = proxy.parent.formatter.editorManager.nodeSelection.save(
                range, proxy.parent.getDocument());
        }
        const value: ITableArgs = {
            rows: row, columns: col, width: {
                minWidth: proxy.parent.tableSettings.minWidth,
                maxWidth: proxy.parent.tableSettings.maxWidth,
                width: proxy.parent.tableSettings.width
            },
            selection: this.tableNotifyArgs.selection
        };
        if (dlgTarget === 'Create') {
            this.parent.dotNetRef.invokeMethodAsync('CloseCreateTableDialog');
            if (this.parent.toolbarSettings.type === 'Popup' && !this.parent.inlineMode.enable) {
                const expendedNav: HTMLElement = this.parent.element.querySelector('.e-hor-nav.e-nav-active');
                if (expendedNav) {
                    const expandNextElement: HTMLElement = expendedNav.nextElementSibling as HTMLElement;
                    if (expandNextElement && expandNextElement.classList.contains('e-popup-open') && expandNextElement.classList.contains('e-toolbar-pop')) {
                        expendedNav.click();
                    }
                }
            }
        } else {
            this.parent.dotNetRef.invokeMethodAsync('CloseTableDialog');
        }
        this.parent.observer.notify(events.selectionRestore, {});
        proxy.parent.formatter.process(
            proxy.parent, this.tableNotifyArgs.args, (this.tableNotifyArgs.args as ClickEventArgs).originalEvent, value);
        (proxy.parent.getEditPanel() as HTMLElement).focus();
        proxy.parent.observer.on(events.mouseDown, proxy.tableObj.cellSelect, proxy.tableObj);
        const selection: Selection = proxy.parent.formatter.editorManager.nodeSelection.get(proxy.parent.getDocument());
        if (!isNOU(selection) && !isNOU(selection.anchorNode) &&
            selection.anchorNode.nodeType === Node.ELEMENT_NODE && ((selection.anchorNode as HTMLElement).tagName === 'TD'
                || (selection.anchorNode as HTMLElement).tagName === 'TH')) {
            proxy.tableObj.curTable = closest(selection.anchorNode, 'table') as HTMLTableElement;
            proxy.tableObj.activeCell = selection.anchorNode as HTMLElement;
        }
    }

    /**
     * Creates a custom table with specified rows and columns
     *
     * @param {number} rowValue - Number of rows
     * @param {number} columnValue - Number of columns
     * @returns {void} - No return value
     * @public
     */
    public customTable(rowValue: number, columnValue: number): void {
        if (rowValue && columnValue) {
            const argument: ITableNotifyArgs = ((Browser.isDevice || (!isNOU(this.tableNotifyArgs.args as ClickEventArgs)
                && !isNOU((this.tableNotifyArgs.args as ClickEventArgs).originalEvent) &&
                ((this.tableNotifyArgs.args as ClickEventArgs).originalEvent as KeyboardEventArgs).action === 'insert-table')
                || this.parent.inlineMode.enable) ? this.tableNotifyArgs : this as ITableNotifyArgs);
            this.tableInsert(rowValue, columnValue, '', argument);
        }
    }

    /**
     * Applies table properties to the selected table
     *
     * @param {EditTableModel} model - Table properties model
     * @returns {void} - No return value
     * @public
     */
    public applyTableProperties(model: EditTableModel): void {
        const table: HTMLTableElement = closest(this.tableNotifyArgs.selectNode[0] as HTMLElement, 'table') as HTMLTableElement;
        table.style.width = model.width + 'px';
        if (model.padding.toString() !== '') {
            const thElm: NodeListOf<HTMLElement> = table.querySelectorAll('th');
            this.applyCellPadding(thElm, model.padding);
            const tdElm: NodeListOf<HTMLElement> = table.querySelectorAll('td');
            this.applyCellPadding(tdElm, model.padding);
        }
        table.cellSpacing = model.spacing.toString();
        if (table.cellSpacing && table.cellSpacing !== '0') {
            addClass([table], classes.CLS_TABLE_BORDER);
        } else {
            removeClassWithAttr([table], classes.CLS_TABLE_BORDER);
        }
        this.parent.formatter.saveData();
        this.parent.dotNetRef.invokeMethodAsync('CloseTableDialog');
    }

    /*
     * Applies cell padding to the specified elements
     */
    private applyCellPadding(elements: NodeListOf<HTMLElement>, padding: number): void {
        for (let i: number = 0; i < elements.length; i++) {
            let padVal: string = '';
            if (elements[i as number].style.padding === '') {
                const styles: string = elements[i as number].getAttribute('style');
                padVal = (!isNOU(styles) ? styles : '') + ' padding:' + padding + 'px;';
            } else {
                elements[i as number].style.padding = padding + 'px';
                padVal = elements[i as number].getAttribute('style');
            }
            elements[i as number].style.cssText = padVal;
        }
    }

    /*
     * Handles edit area click events for table operations
     */
    private editAreaClickHandler(e: ITableNotifyArgs): void {
        if (this.parent.readonly || !isNOU(closest((e.args as MouseEvent).target as Element, '.e-img-caption'))) {
            return;
        }
        const args: MouseEvent = e.args as MouseEvent;
        const showOnRightClick: boolean = this.parent.quickToolbarSettings.showOnRightClick;
        if (args.which === 2 || (showOnRightClick && args.which === 1) || (!showOnRightClick && args.which === 3)) { return; }
        if (this.parent.editorMode === 'HTML' && this.parent.quickToolbarModule) {
            this.quickToolObj = this.parent.quickToolbarModule;
            const parentRect: ClientRect = this.parent.element.getBoundingClientRect();
            const target: HTMLElement = args.target as HTMLElement;
            const tbElement: HTMLElement = this.parent.getToolbarElement() as HTMLElement;
            const tbHeight: number = (tbElement) ? (tbElement.offsetHeight + this.parent.toolbarModule.getExpandTBarPopHeight()) : 0;
            const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.getDocument());
            const closestTable: Element = closest(target, 'table');
            const currentTime: number = new Date().getTime();
            const rangeAtPointer: boolean = range.startContainer === range.endContainer && range.startOffset === range.endOffset;
            const ismacRightClick: boolean = /Version\/\d+\.\d+.*Safari/.test(navigator.userAgent) && !/Chrome|Edg|Firefox/.test(navigator.userAgent) && args.which === 3;
            if (target && target.nodeName !== 'A' && target.nodeName !== 'IMG' && target.nodeName !== 'VIDEO' && !target.classList.contains(classes.CLS_CLICKELEM) &&
                target.nodeName !== 'AUDIO' && (target.nodeName === 'TD' || target.nodeName === 'TH' ||
                    target.nodeName === 'TABLE' || (closestTable && this.parent.getEditPanel().contains(closestTable)))
                && !(range.startContainer.nodeType === 3 && !(range.collapsed || ismacRightClick)) &&
                (this.tableObj && (currentTime - this.tableObj.resizeEndTime > 100)) && (rangeAtPointer || closestTable.querySelectorAll('.e-multi-cells-select').length > 0)) {
                const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.getDocument());
                this.parent.formatter.editorManager.nodeSelection.save(range, this.parent.getDocument());
                this.parent.formatter.editorManager.nodeSelection.Clear(this.parent.getDocument());
                let pageX: number;
                let pageY: number;
                if (Browser.isDevice && (e.args as TouchEvent).changedTouches[0]) {
                    pageX = (e.args as TouchEvent).changedTouches[0].pageX;
                    pageY = (e.args as TouchEvent).changedTouches[0].pageY;
                }
                else {
                    pageX = this.parent.iframeSettings.enable ? window.scrollX + parentRect.left + args.clientX : args.pageX;
                    pageY = this.parent.iframeSettings.enable ? window.scrollY + parentRect.top +
                        tbHeight + args.clientY : args.pageY;
                }
                this.quickToolObj.showTableQTBar(target, e.args as KeyboardEventArgs);
                this.parent.formatter.editorManager.nodeSelection.restore();
            } else {
                this.hideTableQuickToolbar();
            }
        }
    }

    /*
     * Hides the table quick toolbar
     */
    private hideTableQuickToolbar(): void {
        if (this.quickToolObj) {
            this.quickToolObj.hideTableQTBar();
        }
    }

    /*
     * Handles toolbar actions for table operations
     */
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
            if (isNOU(this.tableNotifyArgs)) {
                this.tableNotifyArgs = args;
            }
            this.editTable(args);
            break;
        }
    }

    /*
     * Toggles table header for the selected table
     */
    private tableHeader(selection: NodeSelection, e: ClickEventArgs | KeyboardEvent): void {
        this.parent.formatter.process(
            this.parent, e,
            (e as ClickEventArgs).originalEvent,
            { selection: selection, subCommand: ((e as ClickEventArgs).item as IDropDownItemModel).subCommand });
    }

    /*
     * Removes the selected table
     */
    private removeTable(selection: NodeSelection, args?: ClickEventArgs | KeyboardEventArgs, delKey?: boolean): void {
        if (!this.tableObj) {
            return;
        }
        let cmd: { [key: string]: object };
        if (delKey) { cmd = { item: { command: 'Table', subCommand: 'TableRemove' } }; }
        const value: ITableArgs = {
            selection: selection,
            subCommand: (delKey) ? (cmd.item as ITableArgs).subCommand : ((args as ClickEventArgs).item as IDropDownItemModel).subCommand
        };
        this.parent.formatter.process(
            this.parent, (delKey) ? cmd : args, (args as ClickEventArgs).originalEvent, value);
        (this.parent.getEditPanel() as HTMLElement).focus();
        this.tableObj.setDefaultEmptyContent();
        this.tableObj.removeResizeElement();
        this.hideTableQuickToolbar();
    }

    /*
     * Opens edit table dialog with current table properties
     */
    private editTable(args: ITableArgs): void {
        const selectNode: HTMLElement = (args as ITableNotifyArgs).selectParent[0] as HTMLElement;
        this.tableNotifyArgs.selectNode = (args as ITableNotifyArgs).selectParent;
        const width: string | number = closest(selectNode, 'table').getClientRects()[0].width;
        const padding: string | number = (closest(selectNode, 'td') as HTMLElement).style.padding;
        const spacing: string | number = (closest(selectNode, 'table') as HTMLElement).getAttribute('cellspacing');
        this.hideTableQuickToolbar();
        this.createDialog(
            {
                width: width,
                padding: parseFloat((padding !== '' ? parseInt(padding, 10) : 0).toString()),
                spacing: parseFloat((spacing !== '' && !isNOU(spacing) ? parseInt(spacing, 10) : 0).toString())
            },
            'Edit'
        );
    }

    /*
     * Handles dropdown selection for table operations
     */
    private dropdownSelect(e: ClickEventArgs): void {
        this.parent.observer.notify(events.selectionSave, {});
        const item: IDropDownItemModel = e.item as IDropDownItemModel;
        if (!document.body.contains(document.body.querySelector('.e-rte-quick-toolbar')) || item.command !== 'Table') {
            return;
        }
        const range: Range = /Version\/\d+\.\d+.*Safari/.test(navigator.userAgent) ? this.parent.formatter.editorManager.nodeSelection.range : this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.getDocument());
        const args: ITableNotifyArgs = {
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
        case 'Custom':
            this.parent.formatter.process(this.parent, e, args, {
                command: item.command,
                subCommand: (e.item as IDropDownItemModel).subCommand
            });
            break;
        case 'Merge':
        case 'VerticalSplit':
        case 'HorizontalSplit':
            this.UpdateCells(args.selection, e);
            break;
        }
    }

    /*
     * Updates table cells based on selected operation
     */
    private UpdateCells(selectCell: NodeSelection, e: ClickEventArgs): void {
        this.parent.formatter.process(this.parent, e, e, { selection: selectCell, subCommand: (e.item as IDropDownItemModel).subCommand });
        this.hideTableQuickToolbar();
    }

    /*
     * Adds a row to the table
     */
    private addRow(selectCell: NodeSelection, e: ClickEventArgs | KeyboardEvent, tabKey?: boolean): void {
        let cmd: { [key: string]: object };
        if (tabKey) {
            cmd = {
                item: { command: 'Table', subCommand: 'InsertRowAfter' }
            };
        }
        const value: ITableArgs = {
            selection: selectCell,
            subCommand: (tabKey) ? (cmd.item as ITableArgs).subCommand : ((e as ClickEventArgs).item as IDropDownItemModel).subCommand
        };

        this.parent.formatter.process(this.parent, (tabKey) ? cmd : e, e, value);
    }

    /*
     * Adds a column to the table
     */
    private addColumn(selectCell: NodeSelection, e: ClickEventArgs): void {
        this.parent.formatter.process(
            this.parent, e, e,
            { selection: selectCell, width: this.parent.tableSettings.width, subCommand: (e.item as IDropDownItemModel).subCommand });
    }

    /*
     * Removes a row or column from the table
     */
    private removeRowColumn(selectCell: NodeSelection, e: ClickEventArgs): void {
        this.parent.observer.notify(events.selectionRestore, {});
        this.parent.formatter.process(this.parent, e, e, { selection: selectCell, subCommand: (e.item as IDropDownItemModel).subCommand });
        this.hideTableQuickToolbar();
        this.parent.observer.notify(events.selectionSave, {});
    }

    /*
     * Sets vertical alignment for table cells
     */
    private verticalAlign(args: ITableNotifyArgs, e: ClickEventArgs): void {
        const tdEle: Element = closest(args.selectParent[0], 'td') || closest(args.selectParent[0], 'th');
        if (tdEle) {
            this.parent.formatter.process(this.parent, e, e, { tableCell: tdEle, subCommand: (e.item as IDropDownItemModel).subCommand });
        }
    }

    /*
     * Applies table styles to the selected table
     */
    private tableStyles(args: ITableNotifyArgs, command: string): void {
        const table: HTMLTableElement = closest(args.selectParent[0], 'table') as HTMLTableElement;
        if (command === 'Dashed') {
            if (this.parent.element.classList.contains(classes.CLS_TB_DASH_BOR)) {
                this.parent.element.classList.remove(classes.CLS_TB_DASH_BOR);
            } else {
                this.parent.element.classList.add(classes.CLS_TB_DASH_BOR);
            }
            if (table.classList.contains(classes.CLS_TB_DASH_BOR)) {
                table.classList.remove(classes.CLS_TB_DASH_BOR);
            } else {
                table.classList.add(classes.CLS_TB_DASH_BOR);
            }
        }
        if (command === 'Alternate') {
            if (this.parent.element.classList.contains(classes.CLS_TB_ALT_BOR)) {
                this.parent.element.classList.remove(classes.CLS_TB_ALT_BOR);
            } else {
                this.parent.element.classList.add(classes.CLS_TB_ALT_BOR);
            }
            if (table.classList.contains(classes.CLS_TB_ALT_BOR)) {
                table.classList.remove(classes.CLS_TB_ALT_BOR);
            } else {
                table.classList.add(classes.CLS_TB_ALT_BOR);
            }
        }
        if ((args.args as ClickEventArgs) && (args.args as ClickEventArgs).item.cssClass) {
            const classList: string[] = (args.args as ClickEventArgs).item.cssClass.split(' ');
            for (let i: number = 0; i < classList.length; i++) {
                if (table.classList.contains(classList[i as number])) {
                    table.classList.remove(classList[i as number]);
                } else {
                    table.classList.add(classList[i as number]);
                }
            }
        }
        this.parent.formatter.saveData();
        this.parent.formatter.editorManager.nodeSelection.restore();
        this.hideTableQuickToolbar();
    }

    /*
     * Sets background color for selected table cells
     */
    private setBGColor(args: IColorPickerEventArgs): void {
        const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.getDocument());
        const selection: NodeSelection = this.parent.formatter.editorManager.nodeSelection.save(range, this.parent.getDocument());
        let selectedCell: Node = selection.range.startContainer;
        selectedCell = (selectedCell.nodeType === 3) ? closest(selectedCell.parentNode, 'td,th') : closest(selectedCell, 'td, th');
        if (selectedCell && (selectedCell.nodeName === 'TD' || selectedCell.nodeName === 'TH')) {
            const items: NodeListOf<Element> = closest(selectedCell, 'table').querySelectorAll('.' + classes.CLS_TABLE_SEL);
            for (let i: number = 0; i < items.length; i++) {
                (items[i as number] as HTMLElement).style.backgroundColor = args.item.value;
            }
            this.parent.formatter.saveData();
        }
        this.hideTableQuickToolbar();
    }

    /*
     * Closes any opened table-related dialogs
     */
    private closeOpenedDialog(): void {
        const createDlg: HTMLElement = this.parent.element.querySelector('.e-rte-table-popup');
        const insertDlg: HTMLElement = this.parent.element.querySelector('.e-rte-edit-table');
        const customTrgDlg: HTMLElement = document.querySelector('.e-rte-edit-table.e-rte-elements.e-popup-open');
        //Reset the zIndex value while Table popup got closed
        const toolbar: HTMLElement = this.parent.element.querySelector('.e-toolbar-container');
        if (toolbar) {
            toolbar.style.zIndex = '10';
        }
        if (createDlg) { this.parent.dotNetRef.invokeMethodAsync('CloseCreateTableDialog'); }
        if (insertDlg) { this.parent.dotNetRef.invokeMethodAsync('CloseTableDialog'); }
        if (customTrgDlg) { this.parent.dotNetRef.invokeMethodAsync('CloseTableDialog'); }
    }

    /**
     * Shows the table dialog
     *
     * @param {boolean} isExternal - Flag indicating if called externally
     * @param {NotifyArgs} e - Notification arguments
     * @returns {void} - No return value
     * @public
     */
    public showDialog(isExternal: boolean, e?: NotifyArgs): void {
        if (isExternal) { (this.parent.getEditPanel() as HTMLElement).focus(); }
        if (this.parent.editorMode === 'HTML') {
            const docElement: Document = this.parent.getDocument();
            const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(docElement);
            const selection: NodeSelection = this.parent.formatter.editorManager.nodeSelection.save(range, docElement);
            this.parent.observer.notify(events.selectionSave, {});
            const args: ClickEventArgs = <ClickEventArgs>{
                originalEvent: isExternal ? undefined : e.args,
                item: { command: 'Table', subCommand: 'CreateTable' }
            };
            this.tableNotifyArgs = { args: args, selection: selection };
            this.createDialog();
        }
    }

    /*
     * Handles keyboard down events for table operations
     */
    private keyDown(e: NotifyArgs): void {
        if (!this.tableObj) {
            return;
        }
        const event: KeyboardEventArgs = e.args as KeyboardEventArgs;
        this.handleSpecialActions(event, e);
        if (this.tableObj.isTableInteractionPossible(event)) {
            this.tableObj.handleTableKeyboardInteractions(event);
        }
        if (this.parent.editorMode === 'HTML') {
            this.tableObj.handleShiftKeyTableSelection(event);
        }
        this.tableObj.handleShiftKeyTableSelection(event);
        this.tableObj.handleGlobalKeyboardShortcuts(event);
        this.tableObj.handleTableDeletion(event);
        this.tableObj.handleDeselectionOnTyping(event);
    }

    /*
     * Handles special action keys like Escape and Insert Table
     */
    private handleSpecialActions(event: KeyboardEventArgs, e: NotifyArgs): void {
        switch (event.action) {
        case 'escape':
            break;
        case 'insert-table':
            if (this.parent.editorMode === 'HTML') {
                this.showDialog(false, e);
            } else if (this.parent.editorMode === 'Markdown') {
                this.parent.formatter.process(this.parent, null, event);
            }
            event.preventDefault();
            break;
        }
    }

    /*
     * Handles document click events for table operations
     */
    private docClick(e: { [key: string]: object }): void {
        if (!this.tableObj) {
            return;
        }
        const target: HTMLElement = <HTMLElement>(e.args as MouseEvent).target;
        const createDlg: HTMLElement = this.parent.element.querySelector('.e-rte-table-popup');
        const insertDlg: HTMLElement = this.parent.element.querySelector('.e-rte-edit-table');
        if (target && target.classList && ((createDlg && !closest(target, '#' + createDlg.id) ||
            (insertDlg && !closest(target, '#' + insertDlg.id)))) && !target.classList.contains('e-create-table') &&
            target.offsetParent && !target.offsetParent.classList.contains('e-rte-backgroundcolor-dropdown')) {
            this.closeOpenedDialog();
            this.parent.isBlur = true;
            if (Browser.isIE) { dispatchEvent(this.parent.element, 'focusout'); }
        }
        const closestEle: Element = closest(target, 'td');
        const isExist: boolean = closestEle && this.parent.getEditPanel().contains(closestEle) ? true : false;
        if (target && target.tagName !== 'TD' && target.tagName !== 'TH' && !isExist &&
            closest(target, '.e-rte-quick-popup') === null && target.offsetParent &&
            !target.offsetParent.classList.contains('e-quick-dropdown') &&
            !target.offsetParent.classList.contains('e-rte-backgroundcolor-dropdown') && !closest(target, '.e-rte-dropdown-popup')
            && !closest(target, '.e-rte-elements')) {
            const isToolbarClick: boolean = target.closest('.e-toolbar') || target.closest('.e-toolbar-container') ? true : false;
            const isClickedOnPasteCleanupDialog: boolean = closest(target, '#' + this.parent.element.id + '_pasteCleanupDialog') ? true : false;
            if (!isToolbarClick && !isClickedOnPasteCleanupDialog) {
                this.tableObj.removeCellSelectClasses();
                this.tableObj.removeTableSelection();
            }
            if (!Browser.isIE) { this.hideTableQuickToolbar(); }
        }
        if (target && target.classList && !target.classList.contains(classes.CLS_TB_COL_RES) &&
            !target.classList.contains(classes.CLS_TB_ROW_RES) && !target.classList.contains(classes.CLS_TB_BOX_RES)) {
            this.tableObj.removeResizeElement();
        }
    }

    /*
     * Handles iframe mouse down events
     */
    private onIframeMouseDown(): void {
        this.closeOpenedDialog();
        if (!isNOU(this.parent) && !isNOU(this.parent.getEditPanel()) && this.tableObj) {
            this.tableObj.removeResizeElement();
        }
    }

    /*
     * Handles keyboard up events for table operations
     */
    private keyUp(e: NotifyArgs): void {
        if (this.tableObj) {
            this.tableObj.tableModulekeyUp(e);
        }
    }

    /**
     * Destroys the table module
     *
     * @returns {void} - No return value
     * @public
     */
    public destroy(): void {
        this.removeEventListener();
    }

    /*
     * Handles events after key down to update table resize icons
     */
    private afterKeyDown(e: KeyboardEventArgs): void {
        if (this.tableObj) {
            this.tableObj.afterKeyDown();
        }
    }

    public closePopup(): void {
        if (this.parent.toolbarSettings.type === 'Popup' && !this.parent.inlineMode.enable) {
            const expendedNav: HTMLElement = this.parent.element.querySelector('.e-hor-nav.e-nav-active');
            const expandNextElement: HTMLElement = expendedNav.nextElementSibling as HTMLElement;
            if (expendedNav && expandNextElement && expandNextElement.classList.contains('e-popup-open') && expandNextElement.classList.contains('e-toolbar-pop')) {
                expendedNav.click();
            }
        }
    }
}
