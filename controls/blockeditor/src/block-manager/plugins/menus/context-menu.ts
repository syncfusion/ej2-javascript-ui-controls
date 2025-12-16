import { BeforeOpenCloseMenuEventArgs, MenuEventArgs } from '@syncfusion/ej2-navigations';
import { BlockModel, ContextMenuItemModel } from '../../../models/index';
import { BlockType } from '../../../models/enums';
import { events } from '../../../common/constant';
import { getNormalizedKey } from '../../../common/utils/common';
import { getAdjacentBlock, getBlockModelById } from '../../../common/utils/block';
import { getSelectedRange } from '../../../common/utils/selection';
import { BlockManager } from '../../base/block-manager';

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

    constructor(manager: BlockManager) {
        this.parent = manager;
        this.addEventListeners();
    }

    private addEventListeners(): void {
        this.parent.observer.on(events.keydown, this.onKeyDown, this);
        this.parent.observer.on('contextMenuCreated', this.handleContextMenuCreated, this);
        this.parent.observer.on('contextMenuBeforeOpen', this.handleContextMenuBeforeOpen, this);
        this.parent.observer.on('updateContextMenuState', this.updateContextMenuPopupState, this);
        this.parent.observer.on('contextMenuSelection', this.handleContextMenuSelection, this);
        this.parent.observer.on(events.destroy, this.destroy, this);
    }

    private removeEventListeners(): void {
        this.parent.observer.off(events.keydown, this.onKeyDown);
        this.parent.observer.off('contextMenuCreated', this.handleContextMenuCreated);
        this.parent.observer.off('contextMenuBeforeOpen', this.handleContextMenuBeforeOpen);
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

    private handleContextMenuBeforeOpen(args: BeforeOpenCloseMenuEventArgs): void {
        if (!this.parent.currentFocusedBlock) { this.parent.setFocusAndUIForNewBlock(this.parent.currentHoveredBlock); }
        this.toggleDisabledItems();
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

    private handleContextMenuSelection(args: MenuEventArgs): void {
        this.handleContextMenuActions(args.item, args.event);
    }

    private handleIndentationAction(shouldDecrease: boolean): void {
        this.parent.execCommand({ command: 'IndentBlock', state: {
            blockIDs: this.parent.editorMethods.getSelectedBlocks().map((block: BlockModel) => block.id),
            shouldDecrease
        }});
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
        }
    }

    private toggleDisabledItems(): void {
        if (!getSelectedRange() || !this.parent.currentFocusedBlock) { return; }
        const blockModel: BlockModel = getBlockModelById(this.parent.currentFocusedBlock.id, this.parent.getEditorBlocks());
        const notAllowedTypes: string[] = [BlockType.Image, BlockType.Code];
        const isNotAllowedType: boolean = notAllowedTypes.indexOf(blockModel.blockType) !== -1;
        const previousBlockElement: HTMLElement = getAdjacentBlock(this.parent.currentFocusedBlock, 'previous');
        const previousBlockModel: BlockModel = previousBlockElement
            ? getBlockModelById(previousBlockElement.id, this.parent.getEditorBlocks())
            : null;
        const canIndent: boolean = (!previousBlockModel ||
            (previousBlockModel && blockModel.indent <= previousBlockModel.indent) && !isNotAllowedType);
        const canOutdent: boolean = blockModel.indent > 0 && !isNotAllowedType;
        const isSelection: boolean = getSelectedRange().toString().trim().length > 0;
        const selectedBlocks: BlockModel[] = this.parent.editorMethods.getSelectedBlocks();
        const canAllowLink: boolean = isSelection && !isNotAllowedType && (selectedBlocks && selectedBlocks.length === 1);

        const menuState: any = {
            'increaseindent': canIndent,
            'decreaseindent': canOutdent,
            'undo': this.parent.undoRedoAction.canUndo(),
            'redo': this.parent.undoRedoAction.canRedo(),
            'link': canAllowLink,
            'cut': isSelection,
            'copy': isSelection,
            'paste': true
        };
        this.parent.observer.notify('enableDisableContextMenuItems', menuState);
    }

    /**
     * Checks whether the context menu is opened or not.
     *
     * @returns {boolean} - Returns true if the context menu is opened, otherwise false.
     * @hidden
     */
    public isPopupOpen(): boolean {
        return this.isPopupOpened;
    }

    /**
     * Destroys the ContextMenu module.
     *
     * @returns {void}
     */
    public destroy(): void {
        this.removeEventListeners();
        this.shortcutMap = null;
    }

}
