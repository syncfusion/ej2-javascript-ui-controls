/*
 * table-module.ts - Provides table management functionality for the Rich Text Editor
 */
// Core EJ2 base utilities
import {
    detach, closest, Browser, L10n, isNullOrUndefined as isNOU, getComponent, isNullOrUndefined,
    EventHandler, addClass, KeyboardEventArgs
} from '@syncfusion/ej2-base';

// Rich Text Editor interfaces
import { IRichTextEditor, ICssClassArgs, IQuickToolbar, IRenderer } from '../base/interface';
import { NotifyArgs, IDropDownItemModel, ResizeArgs, ITableArgs, IToolbarItemModel, ITableModel } from '../../common/interface';

// UI components
import { Dialog, Popup, DialogModel } from '@syncfusion/ej2-popups';
import { Button } from '@syncfusion/ej2-buttons';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';

// Internal modules
import * as events from '../base/constant';
import * as classes from '../base/classes';
import * as EVENTS from '../../common/constant';
import { ITableNotifyArgs } from '../../common/interface';
import { ServiceLocator } from '../services/service-locator';
import { NodeSelection } from '../../selection/selection';
import { RendererFactory } from '../services/renderer-factory';
import { RenderType } from '../base/enum';
import { TableCommand } from '../../editor-manager/plugin/table';
import { DialogRenderer } from './dialog-renderer';

// Utility functions
import { dispatchEvent, parseHtml, hasClass } from '../base/util';
import { removeClassWithAttr } from '../../common/util';
import { ToolbarType } from '../../common/enum';

/*
 * `Table` module is used to handle table actions.
 */
export class Table {
    public tableObj: TableCommand;
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
    private quickToolObj: IQuickToolbar;
    private rowTextBox: NumericTextBox;
    private columnTextBox: NumericTextBox;
    private tableWidthNum: NumericTextBox;
    private tableCellPadding: NumericTextBox;
    private tableCellSpacing: NumericTextBox;
    private l10n: L10n;
    private dialogRenderObj: DialogRenderer;
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

    /*
     * Registers all event listeners for table-related operations
     *
     * This method wires up all the necessary event handlers that the Table module
     * needs to function properly, including table creation, editing, navigation,
     * and keyboard interactions.
     */
    protected addEventListener(): void {
        // Early exit if parent component is already destroyed
        if (this.parent.isDestroyed) {
            return;
        }

        // Table creation and dialog events
        this.parent.on(events.createTable, this.renderDlgContent, this);
        this.parent.on(events.initialEnd, this.afterRender, this);
        this.parent.on(events.dynamicModule, this.afterRender, this);
        this.parent.on(events.showTableDialog, this.showDialog, this);
        this.parent.on(events.closeTableDialog, this.closeDialog, this);
        this.parent.on(events.clearDialogObj, this.clearDialogObj, this);
        this.parent.on(events.bindOnEnd, this.bindOnEnd, this);
        this.parent.on(events.updateProperty, this.updateTableProperty, this);

        // Mouse interaction events
        this.parent.on(events.docClick, this.docClick, this);
        this.parent.on(events.iframeMouseDown, this.onIframeMouseDown, this);
        this.parent.on(events.editAreaClick, this.editAreaClickHandler, this);

        // Toolbar and dropdown events
        this.parent.on(events.tableToolbarAction, this.onToolbarAction, this);
        this.parent.on(events.dropDownSelect, this.dropdownSelect, this);

        // Keyboard and input events
        this.parent.on(events.keyDown, this.keyDown, this);
        this.parent.on(events.tableModulekeyUp, this.tableModulekeyUp, this);
        this.parent.on(events.afterKeyDown, this.afterKeyDown, this);

        // UI and styling events
        this.parent.on(events.bindCssClass, this.setCssClass, this);

        // Lifecycle events
        this.parent.on(events.destroy, this.destroy, this);
    }

    /*
     * Removes all event listeners previously attached by addEventListener method
     *
     * This method cleans up all event handlers attached to the parent component
     * to prevent memory leaks when the Table module is destroyed or needs to
     * be detached from the DOM.
     */
    protected removeEventListener(): void {
        // Table creation and dialog events
        this.parent.off(events.createTable, this.renderDlgContent);
        this.parent.off(events.initialEnd, this.afterRender);
        this.parent.off(events.dynamicModule, this.afterRender);
        this.parent.off(events.showTableDialog, this.showDialog);
        this.parent.off(events.closeTableDialog, this.closeDialog);
        this.parent.off(events.clearDialogObj, this.clearDialogObj);
        this.parent.off(events.bindOnEnd, this.bindOnEnd);
        this.parent.off(events.updateProperty, this.updateTableProperty);

        // Mouse interaction events
        this.parent.off(events.docClick, this.docClick);
        this.parent.off(events.iframeMouseDown, this.onIframeMouseDown);
        this.parent.off(events.editAreaClick, this.editAreaClickHandler);
        if (this.tableObj) {
            this.parent.off(events.mouseDown, this.tableObj.cellSelect);
        }

        // Toolbar and dropdown events
        this.parent.off(events.tableToolbarAction, this.onToolbarAction);
        this.parent.off(events.dropDownSelect, this.dropdownSelect);

        // Keyboard and input events
        this.parent.off(events.keyDown, this.keyDown);
        this.parent.off(events.tableModulekeyUp, this.tableModulekeyUp);
        this.parent.off(events.afterKeyDown, this.afterKeyDown);

        // UI and styling events
        this.parent.off(events.bindCssClass, this.setCssClass);

        // Lifecycle events
        this.parent.off(events.destroy, this.destroy);

        // Table quick toolbar events
        if (this.parent.editorMode !== 'Markdown' && this.parent.formatter) {
            this.parent.formatter.editorManager.observer.off(EVENTS.hideTableQuickToolbar, this.hideTableQuickToolbar);
        }
    }

    /*
     * Initializes the TableCommand object in the editor manager after editor initialization is complete.
     * This method binds the table module to the editor's formatter for handling table-related operations.
     */
    private bindOnEnd(): void {
        if (this.parent.editorMode === 'HTML' && this.parent.formatter && this.parent.formatter.editorManager
            && this.contentModule) {
            const tableModel: ITableModel = this.getTableModelProperty();

            this.parent.formatter.editorManager.tableObj = this.tableObj =
                new TableCommand(this.parent.formatter.editorManager, tableModel, this.parent.iframeSettings);

            if (this.tableObj) {
                if (this.parent.tableSettings.resize) {
                    this.tableObj.addResizeEventHandlers();
                }
                // First remove any existing mouseDown event handler to prevent duplicates
                this.parent.off(events.mouseDown, this.tableObj.cellSelect);
                // Then add the event handler
                this.parent.on(events.mouseDown, this.tableObj.cellSelect, this.tableObj);
            }

            if (this.parent.formatter) {
                this.parent.formatter.editorManager.observer.on(EVENTS.hideTableQuickToolbar, this.hideTableQuickToolbar, this);
            }
        }
    }

    /* Creates and returns a table model with editor configuration and callback methods for table operations */
    private getTableModelProperty(): ITableModel {
        // Create TableCommand with table model containing required methods
        const tableModel: ITableModel = {
            tableSettings: this.parent.tableSettings,
            rteElement: this.parent.element,
            readonly: this.parent.readonly,
            enableRtl: this.parent.enableRtl,
            enterKey: this.parent.enterKey,
            editorMode: this.parent.editorMode,
            quickToolbarSettings: this.parent.quickToolbarSettings,
            // Method for retrieving CSS class name
            getCssClass: (isSpace?: boolean) => {
                return this.parent.getCssClass(isSpace);
            },

            // Method for preventing default resize behavior
            preventDefaultResize: (e: PointerEvent | MouseEvent) => {
                this.parent.preventDefaultResize(e);
            },

            // Method for retrieving the document object of the content module
            getDocument: () => {
                if (!this.contentModule) {
                    return this.parent.contentModule.getDocument();
                }
                return this.contentModule.getDocument();
            },

            // Method for retrieving the editable element object of the content module
            getEditPanel: () => {
                if (!this.contentModule) {
                    return this.parent.contentModule.getEditPanel();
                }
                return this.contentModule.getEditPanel();
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
        return tableModel;
    }

    /* Updates the table object with the latest editor configuration settings */
    private updateTableProperty(): void {
        const tableModel: ITableModel = this.getTableModelProperty();
        if (!isNullOrUndefined(this.tableObj)) {
            this.tableObj.updateTableModel(tableModel);
        }
    }

    /*
     * Handles the resize start event by triggering an event and processing the result.
     */
    private resizeStart(args: ResizeArgs): void {
        this.parent.trigger(events.resizeStart, args, (resizeStartArgs: ResizeArgs) => {
            if (resizeStartArgs.cancel && this.tableObj) {
                this.tableObj.cancelResizeAction();
            }
        });
    }

    /*
     * Handles the resizing event by triggering an event and processing the result.
     */
    private resizing(args: ResizeArgs): void {
        this.parent.trigger(events.onResize, args, (resizingArgs: ResizeArgs) => {
            if (this.tableObj) {
                if (resizingArgs.cancel) {
                    this.tableObj.cancelResizeAction();
                } else {
                    this.tableObj.perfomResizing(args.event as PointerEvent | TouchEvent);
                }
            }
        });
    }

    /*
    * Checks if the table quick toolbar is currently visible in the document.
    */
    private isTableQuickToolbarVisible(): boolean {
        return this.quickToolObj &&
            this.quickToolObj.tableQTBar &&
            document.body.contains(this.quickToolObj.tableQTBar.element);
    }

    /*
     * Handles the resize end event by triggering an event and processing the result.
     */
    private resizeEnd(args: ResizeArgs): void {
        this.parent.trigger(events.resizeStop, args);
    }

    private afterRender(): void {
        if (isNullOrUndefined(this.contentModule)) {
            this.contentModule = this.rendererFactory.getRenderer(RenderType.Content);
            this.bindOnEnd();
        }
    }

    /*
     * Updates CSS classes for UI components like Buttons, Dialog, and NumericTextBox
     *
     * This method safely adds or replaces CSS classes on component instances while
     * preserving existing classes. It handles class addition, replacement, and proper spacing.
     */
    private updateCss(currentObj: Button | Dialog | NumericTextBox, e: ICssClassArgs): void {
        if (currentObj && e.cssClass) {
            if (isNullOrUndefined(e.oldCssClass)) {
                currentObj.setProperties({
                    cssClass: (currentObj.cssClass + ' ' + e.cssClass).trim()
                });
            } else {
                currentObj.setProperties({
                    cssClass: (currentObj.cssClass.replace(e.oldCssClass, '').trim() + ' ' + e.cssClass).trim()
                });
            }
        }
    }

    /*
     * Sets CSS classes for the table module's UI elements
     *
     * Applies CSS classes to popups and various form controls, ensuring consistent
     * styling throughout the table module. Handles both initial class application
     * and subsequent class updates.
     */
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
            this.columnTextBox,
            this.rowTextBox,
            this.tableWidthNum,
            this.tableCellPadding,
            this.tableCellSpacing
        ];
        for (let i: number = 0; i < numericTextBoxObj.length; i++) {
            if (numericTextBoxObj[i as number]) {
                this.updateCss(numericTextBoxObj[i as number], e);
            }
        }
    }

    /*
     * Handles dropdown selection events for table-related operations
     *
     * This method processes dropdown command selections for table operations like
     * inserting/deleting rows or columns, merging/splitting cells, and applying
     * table styles. It routes the command to the appropriate handler method based
     * on the selected subCommand.
     */
    private dropdownSelect(e: ClickEventArgs): void {
        const item: IDropDownItemModel = e.item as IDropDownItemModel;
        if (!document.body.contains(document.body.querySelector('.e-rte-quick-toolbar')) || item.command !== 'Table') {
            return;
        }
        const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(
            this.parent.contentModule.getDocument()
        );
        const args: ITableNotifyArgs = {
            args: e,
            selection: this.parent.formatter.editorManager.nodeSelection.save(
                range,
                this.contentModule.getDocument()
            ),
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
     * Handles merging or splitting of table cells
     *
     * This method processes cell operations such as merging multiple selected cells or
     * splitting cells vertically or horizontally. After processing the operation,
     * it hides the quick toolbar to provide a clean UI experience.
     */
    private UpdateCells(selectCell: NodeSelection, e: ClickEventArgs): void {
        this.parent.formatter.process(
            this.parent, e, e, {
                selection: selectCell,
                subCommand: (e.item as IDropDownItemModel).subCommand
            }
        );
        this.hideTableQuickToolbar();
    }

    /*
     * Handles keyboard events for table operations in the editor
     *
     * This method processes key press events and manages table-related functionality
     * including navigation, selection, deletion, and insertion operations.
     */
    private keyDown(e: NotifyArgs): void {
        const event: KeyboardEventArgs = e.args as KeyboardEventArgs;
        this.handleSpecialActions(event, e);
        if (this.tableObj) {
            if (this.tableObj.isTableInteractionPossible(event)) {
                this.tableObj.handleTableKeyboardInteractions(event);
            }
            if (this.parent.editorMode === 'HTML') {
                this.tableObj.handleShiftKeyTableSelection(event);
            }
            this.tableObj.handleGlobalKeyboardShortcuts(event);
            this.tableObj.handleTableDeletion(event);
            this.tableObj.handleDeselectionOnTyping(event);
        }
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
                this.openDialog(true, e);
            } else if (this.parent.editorMode === 'Markdown') {
                this.parent.formatter.process(this.parent, null, event);
            }
            event.preventDefault();
            break;
        }
    }

    /*
     * Handles keyboard events after key up in tables.
     * This method identifies the current table cell element based on selection,
     * applies appropriate CSS classes, and manages selection state transitions
     * when navigating between cells.
     */
    private tableModulekeyUp(e: NotifyArgs): void {
        if (this.tableObj) {
            this.tableObj.tableModulekeyUp(e);
        }
    }

    /*
     * Opens the insert table dialog.
     * This method prepares and opens the dialog for inserting a new table,
     * handling both toolbar-initiated and keyboard shortcut-initiated cases.
     */
    private openDialog(isInternal?: boolean, e?: NotifyArgs): void {
        if (!isInternal) {
            (this.parent.contentModule.getEditPanel() as HTMLElement).focus();
        }
        if (this.parent.editorMode === 'HTML') {
            const docElement: Document = this.parent.contentModule.getDocument();
            const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(docElement);
            const selection: NodeSelection = this.parent.formatter.editorManager.nodeSelection
                .save(range, docElement);
            const args: ClickEventArgs = <ClickEventArgs>{
                originalEvent: e ? e.args : { action: 'insert-table' },
                item: {
                    command: 'Table',
                    subCommand: 'CreateTable'
                },
                name: !isInternal ? 'showDialog' : null
            };
            this.insertTableDialog({
                self: this,
                args: args,
                selection: selection
            } as NotifyArgs);
        }
    }

    /*
     * Shows the table dialog from toolbar action
     * This method is the entry point for displaying the table dialog
     * when triggered from the toolbar.
     */
    private showDialog(): void {
        this.openDialog(false);
        this.setCssClass({ cssClass: this.parent.getCssClass() });
    }

    /*
     * Closes the table dialog
     * This method hides the table editing dialog if it's currently open.
     */
    private closeDialog(): void {
        if (this.editdlgObj) {
            this.editdlgObj.hide({ returnValue: true } as Event);
        }
    }

    /*
     * Processes table-related toolbar actions
     * This method handles toolbar button clicks for table operations such as
     * adding headers, removing tables, or editing table properties.
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
            this.editTable(args);
            break;
        }
    }

    /*
     * Applies vertical alignment to table cells.
     * This method processes vertical alignment commands (top, middle, bottom)
     * for the selected table cell.
     */
    private verticalAlign(args: ITableNotifyArgs, e: ClickEventArgs): void {
        const tdEle: Element = closest(args.selectParent[0], 'th') || closest(args.selectParent[0], 'td');
        if (tdEle) {
            this.parent.formatter.process(
                this.parent, e, e, {
                    tableCell: tdEle,
                    subCommand: (e.item as IDropDownItemModel).subCommand
                }
            );
        }
    }

    /*
     * Hides the quick toolbar for table editing if it exists
     *
     * This method safely checks for the existence of the toolbar and its properties
     * before attempting to hide it, preventing potential null reference errors.
     */
    private hideTableQuickToolbar(): void {
        if (this.quickToolObj &&
            typeof this.quickToolObj.tableQTBar !== 'undefined' &&
            this.quickToolObj.tableQTBar &&
            typeof this.quickToolObj.tableQTBar.element !== 'undefined' &&
            document.body.contains(this.quickToolObj.tableQTBar.element)) {
            this.quickToolObj.tableQTBar.hidePopup();
        }
    }

    /*
     * Processes table header commands
     * Delegates the processing of table header related commands to the formatter service
     * with proper parameters and type safety.
     */
    private tableHeader(selection: NodeSelection, e: ClickEventArgs | KeyboardEvent): void {
        if (!e || typeof e !== 'object') {
            return;
        }
        this.parent.formatter.process(
            this.parent, e,
            (e as ClickEventArgs).originalEvent,
            {
                selection: selection,
                subCommand: typeof (e as ClickEventArgs).item !== 'undefined' ?
                    ((e as ClickEventArgs).item as IDropDownItemModel).subCommand : undefined
            }
        );
    }

    /*
     * Gets the anchor node for an element
     * Finds the closest anchor element that contains the input element,
     * or returns the original element if no anchor is found.
     */
    private getAnchorNode(element: HTMLElement): HTMLElement {
        if (!element || typeof element !== 'object') {
            return element;
        }
        const selectParent: HTMLElement = closest(element, 'a') as HTMLElement;
        return selectParent ? selectParent : element;
    }

    /*
     * Handles click event inside editable area to show or hide the table quick toolbar.
     */
    private editAreaClickHandler(e: ITableNotifyArgs): void {
        if (this.shouldSkipQuickToolbar(e)) {
            return;
        }
        if (this.parent.editorMode === 'HTML' && this.parent.quickToolbarModule && this.parent.quickToolbarModule.tableQTBar) {
            this.quickToolObj = this.parent.quickToolbarModule;
            const args: MouseEvent = e.args as MouseEvent;
            const target: HTMLElement = args.target as HTMLElement;
            this.contentModule = this.rendererFactory.getRenderer(RenderType.Content);
            const range: Range = this.parent.formatter.editorManager.nodeSelection.getRange(this.contentModule.getDocument());
            if (this.shouldShowQuickToolbar(args, target, range)) {
                this.showTableQuickToolbar(e, args, target, range);
            } else {
                this.hideTableQuickToolbar();
            }
        }
    }

    /*
     * Determines whether to skip showing the quick toolbar.
     */
    private shouldSkipQuickToolbar(e: ITableNotifyArgs): boolean {
        if (this.parent.readonly) {
            return true;
        }
        const target: Element = (e.args as MouseEvent).target as Element;
        if (!isNOU(closest(target, '.e-img-caption'))) {
            return true;
        }
        const args: MouseEvent = e.args as MouseEvent;
        const showOnRightClick: boolean = this.parent.quickToolbarSettings.showOnRightClick;
        // Right-click / left-click logic
        return (args.which === 2 || (showOnRightClick && args.which === 1) || (!showOnRightClick && args.which === 3));
    }

    /*
     * Determines whether to show the quick toolbar based on current selection and target.
     */
    private shouldShowQuickToolbar(args: MouseEvent, target: HTMLElement, range: Range): boolean {
        const closestTable: Element = closest(target, 'table');
        const startNode: HTMLElement = this.parent.getRange().startContainer.parentElement;
        const endNode: HTMLElement = this.parent.getRange().endContainer.parentElement;
        const isAnchorEle: HTMLElement = this.getAnchorNode(target);
        const ismacRightClick: boolean = this.parent.userAgentData.getPlatform() === 'macOS' && args.which === 3;
        const rangeAtPointer: boolean = range.startContainer === range.endContainer && range.startOffset === range.endOffset;
        const currentTime: number = new Date().getTime();
        return target &&
            target.nodeName !== 'A' &&
            isAnchorEle.nodeName !== 'A' &&
            target.nodeName !== 'IMG' &&
            target.nodeName !== 'VIDEO' &&
            target.nodeName !== 'AUDIO' &&
            !target.classList.contains(classes.CLS_CLICKELEM) &&
            (startNode === endNode || ismacRightClick) &&
            (target.nodeName === 'TD' || target.nodeName === 'TH' || target.nodeName === 'TABLE' ||
                (closestTable && this.parent.contentModule.getEditPanel().contains(closestTable))) &&
            !(range.startContainer.nodeType === 3 && !(range.collapsed || ismacRightClick)) &&
            (this.tableObj && (currentTime - this.tableObj.resizeEndTime > 100)) &&
            (rangeAtPointer || closestTable.querySelectorAll('.e-multi-cells-select').length > 0);
    }

    /*
     * Shows the table quick toolbar popup at the given position.
     */
    private showTableQuickToolbar(e: ITableNotifyArgs, args: MouseEvent, target: HTMLElement, range: Range): void {
        this.parent.formatter.editorManager.nodeSelection.save(range, this.contentModule.getDocument());
        this.parent.formatter.editorManager.nodeSelection.Clear(this.contentModule.getDocument());
        this.parent.formatter.editorManager.nodeSelection.restore();
        this.quickToolObj.tableQTBar.showPopup(target, e.args as MouseEvent);
    }

    /*
     * Handles the click event on a table cell to trigger table insertion.
     */
    private tableCellClick(e: MouseEvent): void {
        const target: EventTarget = e.target;
        if (!target) {
            return;
        }
        const parentRow: HTMLElement = (target as HTMLElement).parentElement;
        const tableRow: HTMLElement = parentRow ? parentRow.parentElement : null;
        if (!parentRow || !tableRow) {
            return;
        }
        const row: number = Array.prototype.slice.call(tableRow.children).indexOf(parentRow) + 1;
        const col: number = Array.prototype.slice.call(parentRow.children).indexOf(target) + 1;
        const selfObj: Table = (this as ITableNotifyArgs).self as unknown as Table;
        if (typeof selfObj.tableInsert === 'function') {
            selfObj.tableInsert(row, col, e, this as ITableNotifyArgs);
        }
    }

    /*
     * Handles table insertion operation in the rich text editor.
     */
    private tableInsert(row: number, col: number, e: MouseEvent, selectionObj?: ITableNotifyArgs): void {
        const proxy: Table = selectionObj && selectionObj.self ? selectionObj.self as unknown as Table : this;
        const scrollX: number = window.scrollX;
        const scrollY: number = window.scrollY;
        this.prepareSelectionForTableInsert(selectionObj, proxy);
        this.cleanupTableCreationEvents(e, proxy);
        const tableConfig: ITableArgs = this.createTableConfiguration(row, col, proxy, selectionObj);
        this.insertTableIntoEditor(tableConfig, selectionObj, proxy);
        // Restore scroll position and set up cell selection
        window.scrollTo(scrollX, scrollY);
        this.setupTableCellSelection(proxy);
    }

    /*
     * Prepares the selection for table insertion.
     */
    private prepareSelectionForTableInsert(selectionObj: ITableNotifyArgs, proxy: Table): void {
        if (!selectionObj || !selectionObj.selection || !selectionObj.selection.range) {
            return;
        }
        const startContainer: Node = selectionObj.selection.range.startContainer;
        // Handle empty paragraph
        if (startContainer.nodeName === 'P' &&
            startContainer.textContent.trim() === '' &&
            !(startContainer.childNodes.length > 0)) {
            (startContainer as Element).innerHTML = '<br>';
        }
        const parentNode: Node = startContainer.parentNode;
        // Handle HTML editor mode
        if (this.isHtmlEditorOutsideEditableRegion(proxy, parentNode)) {
            (proxy.contentModule.getEditPanel() as HTMLElement).focus();
            const range: Range = proxy.parent.formatter.editorManager.nodeSelection.getRange(
                proxy.contentModule.getDocument()
            );
            selectionObj.selection = proxy.parent.formatter.editorManager.nodeSelection.save(
                range, proxy.contentModule.getDocument()
            );
        }
    }

    /*
     * Checks if the current selection is outside the editable region in HTML mode.
     */
    private isHtmlEditorOutsideEditableRegion(proxy: Table, parentNode: Node): boolean {
        if (!proxy.parent || proxy.parent.editorMode !== 'HTML') {
            return false;
        }
        const inIframeOutsideEditor: boolean = proxy.parent.iframeSettings.enable &&
            parentNode.ownerDocument &&
            parentNode.ownerDocument.querySelector('body') &&
            !hasClass(parentNode.ownerDocument.querySelector('body'), 'e-lib');
        const panelId: string = proxy.contentModule.getPanel().id;
        const outsideEditPanel: boolean = !proxy.parent.iframeSettings.enable &&
            isNOU(closest(parentNode, `[id="${panelId}"]`));
        return inIframeOutsideEditor || outsideEditPanel;
    }

    /*
     * Cleans up event handlers after table creation.
     */
    private cleanupTableCreationEvents(e: MouseEvent, proxy: Table): void {
        if (proxy.popupObj) {
            const target: HTMLElement = e.target as HTMLElement;
            if (target && target.parentElement && target.parentElement.parentElement) {
                const rows: HTMLElement[] = Array.prototype.slice.call(
                    target.parentElement.parentElement.children
                );
                for (let i: number = 0; i < rows.length; i++) {
                    EventHandler.remove(rows[i as number], 'mouseleave', this.tableObj.tableCellLeave);
                    const cells: HTMLElement[] = Array.prototype.slice.call(rows[i as number].children);
                    for (let j: number = 0; j < cells.length; j++) {
                        EventHandler.remove(cells[j as number], 'mousemove', this.tableObj.tableCellSelect);
                        EventHandler.remove(cells[j as number], 'mouseup', this.tableCellClick);
                        if (this.parent.toolbarSettings.type === ToolbarType.Popup) {
                            EventHandler.remove(cells[j as number], 'click', this.tableCellClick);
                        }
                    }
                }
            }
            proxy.popupObj.hide();
        }
        if (proxy.editdlgObj) {
            proxy.editdlgObj.hide();
        }
        if (!isNullOrUndefined(proxy.parent)) {
            if (proxy.parent.element.querySelector('.e-content')) {
                //focusing the content editable div
                (proxy.parent.element.querySelector('.e-content') as HTMLElement).focus();
            }
        }
    }

    /*
     * Creates the table configuration for insertion.
     */
    private createTableConfiguration(
        row: number,
        col: number,
        proxy: Table,
        selectionObj: ITableNotifyArgs
    ): ITableArgs {
        return {
            rows: row,
            columns: col,
            width: {
                minWidth: proxy.parent.tableSettings.minWidth,
                maxWidth: proxy.parent.tableSettings.maxWidth,
                width: proxy.parent.tableSettings.width
            },
            selection: selectionObj.selection
        };
    }

    /*
     * Inserts the table into the editor.
     */
    private insertTableIntoEditor(
        tableConfig: ITableArgs,
        selectionObj: ITableNotifyArgs,
        proxy: Table
    ): void {
        proxy.parent.formatter.process(
            proxy.parent,
            selectionObj.args,
            (selectionObj.args as ClickEventArgs).originalEvent,
            tableConfig
        );
        (proxy.contentModule.getEditPanel() as HTMLElement).focus();
    }

    /*
     * Sets up table cell selection handlers after table insertion.
     */
    private setupTableCellSelection(proxy: Table): void {
        if (!proxy.tableObj) {
            return;
        }
        proxy.parent.on(events.mouseDown, proxy.tableObj.cellSelect, proxy.tableObj);
        const selection: Selection = proxy.parent.formatter.editorManager.nodeSelection.get(
            proxy.contentModule.getDocument()
        );
        if (!isNullOrUndefined(selection) &&
            !isNullOrUndefined(selection.anchorNode) &&
            selection.anchorNode.nodeType === Node.ELEMENT_NODE) {
            const anchorElement: HTMLElement = selection.anchorNode as HTMLElement;
            const isTableCell: boolean = anchorElement.tagName === 'TD' || anchorElement.tagName === 'TH';
            if (isTableCell) {
                proxy.tableObj.curTable = closest(selection.anchorNode, 'table') as HTMLTableElement;
                proxy.tableObj.activeCell = selection.anchorNode as HTMLElement;
            }
        }
    }

    /*
     * Inserts a new row in the table at the selected cell position.
     */
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

    /*
     * Adds a new column to the table at the selected cell position.
     */
    private addColumn(selectCell: NodeSelection, e: ClickEventArgs): void {
        this.parent.formatter.process(
            this.parent, e, e,
            { selection: selectCell, width: this.parent.tableSettings.width, subCommand: (e.item as IDropDownItemModel).subCommand });
    }

    /*
     * Removes a row or column from the table based on the selected cell.
     */
    private removeRowColumn(selectCell: NodeSelection, e: ClickEventArgs): void {
        this.parent.formatter.process(this.parent, e, e, { selection: selectCell, subCommand: (e.item as IDropDownItemModel).subCommand });
        this.hideTableQuickToolbar();
    }

    /*
     * Removes the entire table from the editor content.
     */
    private removeTable(selection: NodeSelection, args?: ClickEventArgs | KeyboardEventArgs, delKey?: boolean): void {
        let cmd: { [key: string]: object };
        if (delKey) {
            cmd = { item: { command: 'Table', subCommand: 'TableRemove' } };
        }
        const value: ITableArgs = {
            selection: selection,
            subCommand: (delKey) ? (cmd.item as ITableArgs).subCommand : ((args as ClickEventArgs).item as IDropDownItemModel).subCommand
        };
        this.parent.formatter.process(
            this.parent, (delKey) ? cmd : args, (args as ClickEventArgs).originalEvent, value);
        (this.contentModule.getEditPanel() as HTMLElement).focus();
        if (this.tableObj) {
            this.tableObj.setDefaultEmptyContent();
            this.tableObj.removeResizeElement();
        }
        this.hideTableQuickToolbar();
    }

    /*
     * Renders the table dialog content based on user interaction.
     */
    private renderDlgContent(args?: ITableNotifyArgs): void {
        const argsTarget: HTMLElement = (args.args as ClickEventArgs).originalEvent.target as HTMLElement;
        if (Browser.isDevice || this.parent.inlineMode.enable || !isNullOrUndefined(closest(argsTarget, '.e-text-quicktoolbar'))) {
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
        if (this.tableObj) {
            this.tableObj.tblHeader = this.tblHeader;
            this.tableObj.dlgDiv = this.dlgDiv;
        }
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
                this.popupObj.element.parentElement.style.zIndex = '';
                this.popupObj.destroy();
                detach(this.popupObj.element);
                this.popupObj = null;
            }
        });
        addClass([this.popupObj.element], 'e-popup-open');
        this.popupObj.element.parentElement.style.zIndex = '11';
        if (!isNOU(this.parent.cssClass)) {
            addClass([this.popupObj.element], this.parent.getCssClass());
        }
        this.popupObj.refreshPosition(target);
        this.positionDialogue(target);
        btnEle.focus();
    }

    /*
     * Adjusts the position of the table dialog popup based on available screen space
     * This method calculates whether there's enough space below the button to display
     * the popup. If not enough space is available, it repositions the popup above the
     * button. It also handles the correct positioning with expanded toolbars.
     */
    private positionDialogue(target: HTMLElement): void {
        const windowHeight: number = window.innerHeight;
        const popupHeight: number = this.popupObj.element.getBoundingClientRect().height;
        const spaceBelow: number = windowHeight - target.getBoundingClientRect().bottom;
        let buttonRowHeight: number;
        const toolbarButton: Element = target.closest('.e-toolbar-item');
        const isPopup: boolean = this.parent.toolbarSettings.type === 'Popup';
        const toolbarWrapper: HTMLElement = this.parent.toolbarModule.getToolbarElement() as HTMLElement;
        const expandedToolbar: HTMLElement = toolbarWrapper ? toolbarWrapper.querySelector('.e-toolbar-extended') : toolbarWrapper;
        if (toolbarButton) {
            if (isPopup) {
                buttonRowHeight = toolbarButton.getBoundingClientRect().height;
                if (toolbarButton.parentElement.getBoundingClientRect().top < toolbarWrapper.getBoundingClientRect().top) {
                    buttonRowHeight = toolbarWrapper.getBoundingClientRect().height +
                    toolbarButton.parentElement.getBoundingClientRect().height;
                }
            } else {
                buttonRowHeight = toolbarButton.parentElement.getBoundingClientRect().height;
            }
        } else {
            const toolbarItem: HTMLElement = this.parent.element.querySelector('.e-toolbar-item');
            if (toolbarItem) {
                buttonRowHeight = toolbarItem.parentElement.getBoundingClientRect().height;
            }
        }
        if (expandedToolbar && toolbarButton.parentElement !== expandedToolbar) {
            buttonRowHeight += expandedToolbar.getBoundingClientRect().height;
        }
        if (spaceBelow < popupHeight) {
            this.popupObj.element.style.setProperty('top', 'auto');
            this.popupObj.element.style.setProperty('bottom', `${buttonRowHeight}px`);
        }
    }

    /*
     * Handles iframe mouse down events by hiding popups and cleaning up resize elements.
     */
    private onIframeMouseDown(): void {
        if (this.popupObj) {
            this.popupObj.hide();
        }
        if (this.parent.inlineMode.enable && this.editdlgObj) {
            this.editdlgObj.hide();
        }
        if (!isNOU(this.parent) && !isNOU(this.parent.contentModule) &&
            !isNOU(this.parent.contentModule.getEditPanel()) && this.tableObj) {
            this.tableObj.removeResizeElement();
        }
    }

    /*
     * Manages document click events to control popup visibility.
     */
    private docClick(e: { [key: string]: object }): void {
        const target: HTMLElement = <HTMLElement>(e.args as MouseEvent).target;
        if (target && target.classList && ((this.popupObj && !closest(target, `[id='${this.popupObj.element.id}']`) ||
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
            const isToolbarClick: boolean = target.closest('.e-toolbar') || target.closest('.e-toolbar-wrapper') ? true : false;
            const isClickedOnPasteCleanupDialog: boolean = closest(target, '#' + this.parent.element.id + '_pasteCleanupDialog') ? true : false;
            if (this.tableObj) {
                if (!isToolbarClick && !isClickedOnPasteCleanupDialog) {
                    this.tableObj.removeCellSelectClasses();
                    this.tableObj.removeTableSelection();
                }
            }
            if (!Browser.isIE) {
                this.hideTableQuickToolbar();
            }
        }
        if (this.tableObj && target && target.classList && !target.classList.contains(EVENTS.CLS_TB_COL_RES) &&
            !target.classList.contains(EVENTS.CLS_TB_ROW_RES) && !target.classList.contains(EVENTS.CLS_TB_BOX_RES)) {
            this.tableObj.removeResizeElement();
        }
    }

    /*
     * Generates and configures a table UI within the provided container.
     */
    private drawTable(tableDiv: HTMLElement, args?: ITableNotifyArgs): void {
        let rowDiv: HTMLElement;
        let tableCell: HTMLElement;
        for (let row: number = 0; row < 3; row++) {
            rowDiv = this.parent.createElement('div', { className: 'e-rte-table-row' + this.parent.getCssClass(true), attrs: { 'data-column': '' + row } });
            EventHandler.add(rowDiv, 'mouseleave', this.tableObj.tableCellLeave, this.tableObj);
            for (let col: number = 0; col < 10; col++) {
                tableCell = this.parent.createElement('div', { className: 'e-rte-tablecell e-default' + this.parent.getCssClass(true), attrs: { 'data-cell': '' + col } });
                rowDiv.appendChild(tableCell);
                tableCell.style.display = 'inline-block';
                if (col === 0 && row === 0) {
                    addClass([tableCell], 'e-active');
                }
                EventHandler.add(tableCell, 'mousemove', this.tableObj.tableCellSelect, this.tableObj);
                if (this.parent.toolbarSettings.type === ToolbarType.Popup) {
                    EventHandler.add(tableCell, 'click', this.tableCellClick, { self: this, args: args.args, selection: args.selection });
                } else {
                    EventHandler.add(tableCell, 'mouseup', this.tableCellClick, { self: this, args: args.args, selection: args.selection });
                }
            }
            tableDiv.appendChild(rowDiv);
        }
    }

    /*
     * Opens a dialog to edit properties of an existing table.
     */
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

    /*
     * Opens a dialog for inserting a new table into the document.
     */
    private insertTableDialog(args: MouseEvent | NotifyArgs): void {
        const proxy: Table = ((this as ITableNotifyArgs).self) ? (this as ITableNotifyArgs).self as unknown as Table : this;
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

    /*
     * Creates the content for the table cell dialog with row and column inputs.
     */
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

    /*
     * Cleans up and destroys the dialog object.
     */
    private clearDialogObj(): void {
        if (this.editdlgObj) {
            this.editdlgObj.destroy();
            detach(this.editdlgObj.element);
            this.editdlgObj = null;
        }
    }

    /*
     * Creates a dialog for table operations.
     */
    private createDialog(args: ITableArgs | ClickEventArgs | MouseEvent): void {
        if (this.editdlgObj) {
            this.editdlgObj.hide({ returnValue: true } as Event);
            return;
        }
        const tableDialog: HTMLElement = this.parent.createElement('div', {
            className: 'e-rte-edit-table' + this.parent.getCssClass(true), id: this.rteID + '_tabledialog'
        });
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

    /*
     * Handles the creation of a custom table based on user inputs.
     */
    private customTable(args: ITableNotifyArgs, e: MouseEvent): void {
        const proxy: Table = ((this as ITableNotifyArgs).self) ? (this as ITableNotifyArgs).self as unknown as Table : this;
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

    /*
     * Handles dialog cancellation and cleanup.
     */
    private cancelDialog(e: MouseEvent): void {
        this.parent.isBlur = false;
        this.editdlgObj.hide({ returnValue: true } as Event);
    }

    /*
     * Applies the table properties from the dialog to the selected table.
     */
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
                            padVal = (tdElm[i as number].getAttribute('style') ? tdElm[i as number].getAttribute('style') : '') + ' padding:' +
                                (dialogEle.querySelector('.e-cell-padding') as HTMLInputElement).value + 'px;';
                        } else {
                            tdElm[i as number].style.padding = (dialogEle.querySelector('.e-cell-padding') as HTMLInputElement).value + 'px';
                            padVal = tdElm[i as number].getAttribute('style');
                        }
                        tdElm[i as number].style.cssText = padVal;
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

    /*
     * Creates content for the table dialog with width, padding, and spacing options.
     */
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
            value: padVal !== '' ? parseInt(padVal, 10) : 0,
            placeholder: cellPadding,
            floatLabelType: 'Auto',
            enableRtl: this.parent.enableRtl, locale: this.parent.locale
        });
        this.tableCellPadding.isStringTemplate = true;
        this.tableCellPadding.appendTo(tableWrap.querySelector('#cellPadding') as HTMLElement);
        this.tableCellSpacing = new NumericTextBox({
            format: 'n0',
            min: 0,
            value: brdSpcVal !== '' && !isNOU(brdSpcVal) ? parseInt(brdSpcVal, 10) : 0,
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
        this.removeEventListener();
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

    /*
     * For internal use only - Get the module name.
     */
    private getModuleName(): string {
        return 'table';
    }

    /*
     * Updates the table resize handles after a key is pressed.
     */
    private afterKeyDown(): void {
        if (this.tableObj) {
            this.tableObj.afterKeyDown();
        }
    }

    /*
     * Handles keyboard events in the table popup dialog, specifically for Escape key.
     */
    private createTablePopupKeyDown(e: KeyboardEvent): void {
        if (e.key === 'Escape') {
            const popupRootElem: HTMLElement = (e.target as HTMLElement).closest('.e-rte-table-popup') as HTMLElement;
            const popup: Popup = getComponent(popupRootElem, 'popup');
            const tableToolbarButton: HTMLElement = popup.relateTo as HTMLElement;
            popup.hide();
            tableToolbarButton.focus({ preventScroll: true });
        }
    }
}
