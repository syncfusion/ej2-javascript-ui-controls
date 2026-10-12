import { BeforeOpenCloseMenuEventArgs, MenuEventArgs } from '@syncfusion/ej2-navigations';
import { BlockModel, ContextMenuItemModel, ITableBlockSettings } from '../../../models/index';
import { BlockType } from '../../../models/enums';
import { events } from '../../../common/constant';
import * as constants from '../../../common/constant';
import { getNormalizedKey } from '../../../common/utils/common';
import { getAdjacentBlock, getBlockContentElement, getBlockModelById } from '../../../common/utils/block';
import { getSelectedRange, setCursorPosition } from '../../../common/utils/selection';
import { BlockManager } from '../../base/block-manager';
import { TableCommandName, LinkCommandName } from '../../../models/types';
import { getDefaultTableItems, getDefaultLinkItems } from '../../../common/utils/data';

/**
 * `ContextMenuModule` is used to handle the context menu actions in the BlockEditor.
 *
 * @hidden
 */
export class ContextMenuModule {
    private parent: BlockManager;
    private isPopupOpened: boolean = false;
    private isClipboardEmptyCache: boolean = true;
    private shortcutMap: Map<string, ContextMenuItemModel> = new Map();
    private cellInfo: {
        rowIndex: number;
        colIndex: number;
    };
    private isHeaderCell: boolean = false;
    private clickedLinkElement: HTMLAnchorElement;
    private pendingFocusRestore: {
        tableBlockId: string;
        colIndex: number;
        rowIndex: number;
        operation: 'column' | 'row';
    } | null = null;

    constructor(manager: BlockManager) {
        this.parent = manager;
        this.addEventListeners();
    }

    private addEventListeners(): void {
        this.parent.observer.on(events.keydown, this.onKeyDown, this);
        this.parent.observer.on('contextMenuCreated', this.handleContextMenuCreated, this);
        this.parent.observer.on('contextMenuBeforeOpen', this.handleContextMenuBeforeOpen, this);
        this.parent.observer.on('contextMenuAfterClose', this.handleContextMenuAfterClose, this);
        this.parent.observer.on('updateContextMenuState', this.updateContextMenuPopupState, this);
        this.parent.observer.on('contextMenuSelection', this.handleContextMenuSelection, this);
        this.parent.observer.on(events.destroy, this.destroy, this);
    }

    private removeEventListeners(): void {
        this.parent.observer.off(events.keydown, this.onKeyDown);
        this.parent.observer.off('contextMenuCreated', this.handleContextMenuCreated);
        this.parent.observer.off('contextMenuBeforeOpen', this.handleContextMenuBeforeOpen);
        this.parent.observer.off('contextMenuAfterClose', this.handleContextMenuAfterClose);
        this.parent.observer.off('updateContextMenuState', this.updateContextMenuPopupState);
        this.parent.observer.off('contextMenuSelection', this.handleContextMenuSelection);
        this.parent.observer.off(events.destroy, this.destroy);
    }

    private handleContextMenuCreated(): void {
        this.buildShortcutMap();
    }

    private buildShortcutMap(): void {
        this.shortcutMap.clear();
        this.parent.contextMenuSettings.items.forEach((item: ContextMenuItemModel) => {
            this.shortcutMap.set(item.shortcut.toLowerCase(), item);
        });
    }

    private onKeyDown(e: KeyboardEvent): void {
        const normalizedKey: string = getNormalizedKey(e);
        if (!normalizedKey) { return; }
        const menuItem: ContextMenuItemModel = this.shortcutMap.get(normalizedKey);
        if (menuItem && menuItem.id !== 'cut' && menuItem.id !== 'copy' && menuItem.id !== 'paste') {
            e.preventDefault();
            this.handleContextMenuActions(menuItem, e);
        }
    }

    private async handleContextMenuBeforeOpen(args: BeforeOpenCloseMenuEventArgs): Promise<void> {
        if (!this.parent.currentFocusedBlock) { this.parent.setFocusAndUIForNewBlock(this.parent.currentHoveredBlock); }
        this.isHeaderCell = false;
        this.clickedLinkElement = null;
        if (args.event && (args.event as MouseEvent).target) {
            const target: HTMLElement = (args.event as MouseEvent).target as HTMLElement;
            const tableBlock: HTMLElement = target.closest(`.${constants.TABLE_BLOCK_CLS}`) as HTMLElement;
            if (tableBlock && this.parent.currentFocusedBlock !== tableBlock) {
                this.parent.setFocusToBlock(tableBlock);
            }
            const cell: HTMLTableCellElement = target.closest('td, th') as HTMLTableCellElement;
            if (cell) {
                const table: HTMLTableElement = cell.closest('table');
                if (table) {
                    const rowIndex: number = Array.from(table.rows).indexOf(cell.parentElement as HTMLTableRowElement);
                    this.cellInfo = {
                        rowIndex: rowIndex,
                        colIndex: cell.cellIndex
                    };
                    // Check if the cell is a header cell
                    this.isHeaderCell = cell.tagName.toLowerCase() === 'th';
                }
            }
            // Check if clicked on a link element
            const linkElement: HTMLAnchorElement = target.closest('a') as HTMLAnchorElement;
            if (linkElement) {
                this.clickedLinkElement = linkElement;
            }
        }
        await this.toggleDisabledItems();
        this.parent.blockActionMenuModule.toggleBlockActionPopup(true);
        this.parent.linkModule.hideLinkPopup();
        setTimeout(() => {
            if (this.parent.inlineToolbarModule) {
                this.parent.inlineToolbarModule.hideInlineToolbar(args.event);
            }
        }, 50);
    }

    private updateContextMenuPopupState(value: { isOpen: boolean }): void {
        this.isPopupOpened = value.isOpen;
    }

    private handleContextMenuAfterClose(): void {
        // Restore focus after the menu has fully closed
        if (this.pendingFocusRestore) {
            const { tableBlockId, colIndex, rowIndex, operation } = this.pendingFocusRestore;
            // Use requestAnimationFrame to ensure the menu DOM is fully detached
            requestAnimationFrame(() => {
                this.restoreCellFocusAfterTableOperation(tableBlockId, colIndex, rowIndex, operation);
                this.pendingFocusRestore = null;
            });
        }
    }

    private handleContextMenuSelection(args: MenuEventArgs): void {
        this.handleContextMenuActions(args.item, args.event);
    }

    private handleIndentationAction(shouldDecrease: boolean): void {
        let savedRange: Range | null = null;
        const sel: Selection | null = window.getSelection();
        if (sel && sel.rangeCount > 0) {
            savedRange = sel.getRangeAt(0).cloneRange();
        }
        this.parent.execCommand({
            command: 'IndentBlock',
            state: {
                blockIDs: this.parent.editorMethods.getSelectedBlocks().map((block: BlockModel) => block.id),
                shouldDecrease
            }
        });
        requestAnimationFrame(() => {
            if (savedRange) {
                const selection: Selection | null = window.getSelection();
                if (selection) {
                    selection.removeAllRanges();
                    selection.addRange(savedRange);
                }
            }
        });
    }

    private handleTableOperation(operationId: string): void {
        if (!this.cellInfo) {return; }
        const tableBlock: HTMLElement = this.parent.currentFocusedBlock.closest(`.${constants.TABLE_BLOCK_CLS}`) as HTMLElement;
        if (!tableBlock) {return; }

        const blockModel: BlockModel = getBlockModelById(tableBlock.id, this.parent.getEditorBlocks());
        if (!blockModel.id) {return; }

        const settings: ITableBlockSettings  = blockModel.properties as ITableBlockSettings;
        const { rowIndex: domRowIndex, colIndex: domColIndex } = this.cellInfo as { rowIndex: number; colIndex: number };
        const modelRowIndex: number = settings.enableHeader ? domRowIndex - 1 : domRowIndex;
        const modelColIndex: number = settings.enableRowNumbers ? domColIndex - 1 : domColIndex;

        switch (operationId) {
        case 'table-insert-column-left':
            this.parent.tableService.addColumnAt({ blockId: blockModel.id, colIndex: modelColIndex });
            this.pendingFocusRestore = { tableBlockId: blockModel.id, colIndex: modelColIndex, rowIndex: 0, operation: 'column' };
            break;
        case 'table-insert-column-right':
            this.parent.tableService.addColumnAt({ blockId: blockModel.id, colIndex: modelColIndex + 1 });
            this.pendingFocusRestore = { tableBlockId: blockModel.id, colIndex: modelColIndex + 1, rowIndex: 0, operation: 'column' };
            break;
        case 'table-insert-row-above':
            this.parent.tableService.addRowAt({ blockId: blockModel.id, rowIndex: modelRowIndex });
            this.pendingFocusRestore = { tableBlockId: blockModel.id, colIndex: 0, rowIndex: modelRowIndex, operation: 'row' };
            break;
        case 'table-insert-row-below':
            this.parent.tableService.addRowAt({ blockId: blockModel.id, rowIndex: modelRowIndex + 1 });
            this.pendingFocusRestore = { tableBlockId: blockModel.id, colIndex: 0, rowIndex: modelRowIndex + 1, operation: 'row' };
            break;
        case 'table-delete-column':
            if (settings.columns.length > 1) {
                this.parent.tableService.deleteColumnAt({ blockId: blockModel.id, colIndex: modelColIndex });
            }
            break;
        case 'table-delete-row':
            if (settings.rows.length > 1) {
                this.parent.tableService.deleteRowAt({ blockId: blockModel.id, modelIndex: modelRowIndex });
            }
            break;
        case 'table-delete-table': {
            const blockElement: HTMLElement = this.parent.getBlockElementById(blockModel.id);
            const nextBlock: HTMLElement = getAdjacentBlock(blockElement, 'next');
            this.parent.execCommand({ command: 'DeleteBlock', state: { blockElement }});
            if (nextBlock) {
                setCursorPosition(getBlockContentElement(nextBlock), 0);
                this.parent.setFocusToBlock(nextBlock);
            }
            break;
        }
        }
        this.cellInfo = null;
    }

    private restoreCellFocusAfterTableOperation(
        tableBlockId: string,
        colIndex: number,
        rowIndex: number,
        operation: 'column' | 'row'
    ): void {
        const tableBlock: HTMLElement = this.parent.getBlockElementById(tableBlockId);
        if (!tableBlock) { return; }

        const table: HTMLTableElement = tableBlock.querySelector('table.e-table-element') as HTMLTableElement;
        if (!table) { return; }

        const blockModel: BlockModel = getBlockModelById(tableBlockId, this.parent.getEditorBlocks());
        if (!blockModel) { return; }

        const settings: ITableBlockSettings = blockModel.properties as ITableBlockSettings;
        const tbody: HTMLTableSectionElement = table.tBodies[0];
        if (!tbody || tbody.rows.length === 0) { return; }

        if (operation === 'column') {
            const firstBodyRow: HTMLTableRowElement = tbody.rows[0];
            const domColIndex: number = settings.enableRowNumbers ? colIndex + 1 : colIndex;
            const focusCell: HTMLTableCellElement = firstBodyRow.cells[domColIndex as number] as HTMLTableCellElement;
            if (focusCell) {
                this.parent.tableService.removeCellFocus(table);
                this.parent.tableService.addCellFocus(focusCell, true);
            }
        } else {
            const rowEl: HTMLTableRowElement = tbody.rows[rowIndex as number];
            if (rowEl && rowEl.cells.length > 0) {
                const focusCell: HTMLTableCellElement = rowEl.cells[settings.enableRowNumbers ? 1 : 0] as HTMLTableCellElement;
                if (focusCell) {
                    this.parent.tableService.removeCellFocus(table);
                    this.parent.tableService.addCellFocus(focusCell, true);
                }
            }
        }
    }

    private handleContextMenuActions(menuItem: ContextMenuItemModel, e: Event): void {
        const prop: string = menuItem.id.toLowerCase();
        switch (prop) {
        case 'undo':
            this.parent.undoRedoAction.undo();
            break;
        case 'redo':
            this.parent.undoRedoAction.redo();
            break;
        case 'cut':
            this.parent.clipboardAction.handleContextCut();
            break;
        case 'copy':
            this.parent.clipboardAction.handleContextCopy();
            break;
        case 'paste':
            this.parent.clipboardAction.handleContextPaste();
            break;
        case 'link':
            this.parent.linkModule.showLinkPopup(e as KeyboardEvent);
            break;
        case 'increaseindent':
        case 'decreaseindent':
            this.handleIndentationAction(prop === 'decreaseindent');
            break;
        case 'table-insert-column-left':
        case 'table-insert-column-right':
        case 'table-insert-row-above':
        case 'table-insert-row-below':
        case 'table-delete-column':
        case 'table-delete-row':
        case 'table-delete-table':
            this.handleTableOperation(prop);
            break;
        case 'link-edit':
            this.parent.linkModule.showLinkPopup(e as KeyboardEvent);
            break;
        case 'link-copy':
            if (this.clickedLinkElement && this.clickedLinkElement.href) {
                this.parent.clipboardAction.handleContextCopy(this.clickedLinkElement.href);
            }
            break;
        case 'link-open':
            if (this.clickedLinkElement) { this.parent.linkModule.handleLinkClick(this.clickedLinkElement); }
            break;
        case 'link-remove':
            this.parent.linkModule.handleLinkInsertDeletion(e, true, this.clickedLinkElement);
            break;
        }
    }

    private async toggleDisabledItems(): Promise<void> {
        if (!getSelectedRange() || !this.parent.currentFocusedBlock) { return; }
        const blockModel: BlockModel = getBlockModelById(this.parent.currentFocusedBlock.id, this.parent.getEditorBlocks());
        const tableBlk: HTMLElement = this.parent.currentFocusedBlock.closest(`.${constants.TABLE_BLOCK_CLS}`) as HTMLElement;
        const notAllowedTypes: string[] = [BlockType.Image, BlockType.Code];
        const isNotAllowedType: boolean = notAllowedTypes.indexOf(blockModel.blockType) !== -1;
        const previousBlockElement: HTMLElement = getAdjacentBlock(this.parent.currentFocusedBlock, 'previous');
        const previousBlockModel: BlockModel = previousBlockElement
            ? getBlockModelById(previousBlockElement.id, this.parent.getEditorBlocks())
            : null;
        const canIndent: boolean = (!tableBlk && (!previousBlockModel ||
            (previousBlockModel && blockModel.indent <= previousBlockModel.indent) && !isNotAllowedType));
        const canOutdent: boolean = !tableBlk && (blockModel.indent > 0 && !isNotAllowedType);
        const isSelection: boolean = getSelectedRange().toString().trim().length > 0;
        const selectedBlocks: BlockModel[] = this.parent.editorMethods.getSelectedBlocks();
        const canAllowLink: boolean = this.clickedLinkElement
            ? false
            : isSelection && !isNotAllowedType && (selectedBlocks && selectedBlocks.length === 1);
        const isEmpty: boolean = await this.parent.clipboardAction.isClipboardEmpty();
        const menuState: any = {
            'increaseindent': canIndent,
            'decreaseindent': canOutdent,
            'undo': this.parent.undoRedoAction.canUndo(),
            'redo': this.parent.undoRedoAction.canRedo(),
            'link': canAllowLink,
            'cut': isSelection,
            'copy': isSelection,
            'paste': !isEmpty
        };
        this.parent.observer.notify('enableDisableContextMenuItems', menuState);
    }

    /**
     * Resolves custom table items from contextMenuSettings into a normalized ContextMenuItemModel array.
     *
     * @param {Array} items - The raw table items.
     * @returns {Array} Returns the resolved table items.
     * @hidden
     */
    public resolveTableItems(items: (string | TableCommandName | ContextMenuItemModel)[]): ContextMenuItemModel[] {
        if (!items.length) {return getDefaultTableItems(this.parent.localeJson); }

        const defaultTableItems: ContextMenuItemModel[] = getDefaultTableItems(this.parent.localeJson);
        return items
            .map((item: string | TableCommandName | ContextMenuItemModel) =>
                typeof item === 'object' ? item :
                    defaultTableItems.find((m: ContextMenuItemModel) => (m.text.toLowerCase() === String(item).toLowerCase() ||
                    m.id.toLowerCase() === String(item).toLowerCase()))
            )
            .filter((item: ContextMenuItemModel): item is ContextMenuItemModel => !!item);
    }

    /**
     * Resolves custom link items from contextMenuSettings into a normalized ContextMenuItemModel array.
     *
     * @param {(string | LinkCommandName | ContextMenuItemModel)[]} items - The raw link items.
     * @returns {ContextMenuItemModel[]} - The resolved link items.
     * @hidden
     */
    public resolveLinkItems(items: (string | LinkCommandName | ContextMenuItemModel)[]): ContextMenuItemModel[] {
        if (!items.length) {return getDefaultLinkItems(this.parent.localeJson); }

        const defaultLinkItems: ContextMenuItemModel[] = getDefaultLinkItems(this.parent.localeJson);
        return items
            .map((item: string | LinkCommandName | ContextMenuItemModel) =>
                typeof item === 'object' ? item :
                    defaultLinkItems.find((m: ContextMenuItemModel) => (m.text.toLowerCase() === String(item).toLowerCase() ||
                    m.id.toLowerCase() === String(item).toLowerCase()))
            )
            .filter((item: ContextMenuItemModel | undefined): item is ContextMenuItemModel => !!item);
    }

    /**
     * Checks whether the context menu is opened or not.
     *
     * @returns {boolean} - Returns true if the context menu is opened, otherwise false.
     * @hidden
     */
    public isPopupOpen(): boolean {
        return !!this.isPopupOpened;
    }

    /**
     * Checks whether the currently focused cell is a header cell.
     *
     * @returns {boolean} - Returns true if the cell is a header cell, otherwise false.
     * @hidden
     */
    public isHeaderCellActive(): boolean {
        return this.isHeaderCell;
    }

    /**
     * Destroys the ContextMenu module.
     *
     * @returns {void}
     */
    public destroy(): void {
        this.removeEventListeners();
        this.shortcutMap = null;
        this.cellInfo = null;
        this.isHeaderCell = false;
        this.clickedLinkElement = null;
    }

}
