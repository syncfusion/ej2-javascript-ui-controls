import { BeforeOpenCloseMenuEventArgs, ContextMenu, MenuEventArgs, OpenCloseMenuEventArgs } from '@syncfusion/ej2-navigations';
import { BlockModel, ContextMenuItemModel, ContextMenuSettingsModel } from '../models/index';
import { getContextMenuItems } from '../utils/data';
import { BlockEditor } from '../base/blockeditor';
import { ContextMenuBeforeOpenEventArgs, ContextMenuBeforeCloseEventArgs, ContextMenuOpenEventArgs, ContextMenuItemClickEventArgs, ContextMenuCloseEventArgs } from '../base/eventargs';
import { BlockEditorModel, BlockType } from '../base/index';
import { events } from '../base/constant';
import { detach, isNullOrUndefined } from '@syncfusion/ej2-base';
import { getNormalizedKey } from '../utils/common';
import { getAdjacentBlock, getBlockModelById } from '../utils/block';
import { getSelectedRange } from '../utils/selection';
import { sanitizeContextMenuItems } from '../utils/transform';
import * as constants from '../base/constant';

/**
 * `ContextMenuModule` is used to handle the context menu actions in the BlockEditor.
 *
 * @hidden
 */
export class ContextMenuModule {
    private editor: BlockEditor;
    public contextMenuObj: ContextMenu;
    private isPopupOpened: boolean = false;
    private menuElement: HTMLUListElement;
    private isClipboardEmptyCache: boolean = true;
    private shortcutMap: Map<string, ContextMenuItemModel> = new Map();

    constructor(editor: BlockEditor) {
        this.editor = editor;
        this.init();
        this.buildShortcutMap();
        this.addEventListeners();
        this.updateClipboardCacheState();
    }

    private addEventListeners(): void {
        this.editor.on(events.moduleChanged, this.onPropertyChanged, this);
        this.editor.on(events.keydown, this.onKeyDown, this);
        this.editor.on(events.destroy, this.destroy, this);
    }

    private removeEventListeners(): void {
        this.editor.off(events.moduleChanged, this.onPropertyChanged);
        this.editor.off(events.keydown, this.onKeyDown);
        this.editor.off(events.destroy, this.destroy);
    }

    private init(): void {
        this.menuElement = this.editor.createElement('ul', {
            className: constants.BLOCKEDITOR_CONTEXTMENU_CLS
        });
        document.body.appendChild(this.menuElement);
        const itemTemplate: string =
            '${if(!separator)}' +
            '<div class="e-ctmenu-item-template">' +
            '<div class="e-ctmenu-content">' +
            '<span class="e-ctmenu-icon ${iconCss}"></span>' +
            '<span class="e-ctmenu-text">${text}</span>' +
            '</div>' +
            '${if(shortcut)}' +
            '<div class="e-ctmenu-shortcut">${shortcut}</div>' +
            '${/if}' +
            '</div>' +
            '${/if}';
        this.contextMenuObj = this.editor.menubarRenderer.renderContextMenu({
            target: '#' + this.editor.element.id,
            element: this.menuElement,
            items: this.getMenuItems(),
            showItemOnClick: this.editor.contextMenu.showItemOnClick,
            itemTemplate: itemTemplate,
            fields: { text: 'text', iconCss: 'iconCss', itemId: 'id' },
            select: this.handleContextMenuSelection.bind(this),
            beforeOpen: this.handleContextMenuBeforeOpen.bind(this),
            beforeClose: this.handleContextMenuBeforeClose.bind(this),
            open: this.handleContextMenuOpen.bind(this),
            close: this.handleContextMenuClose.bind(this)
        });
    }

    private getMenuItems(): ContextMenuItemModel[] {
        const menuItems: ContextMenuItemModel[] = this.editor.contextMenu.items.length > 0
            ? sanitizeContextMenuItems(this.editor.contextMenu.items)
            : getContextMenuItems();

        if (this.editor.contextMenu.items.length <= 0) {
            const prevOnChange: boolean = this.editor.isProtectedOnChange;
            this.editor.isProtectedOnChange = true;
            this.editor.contextMenu.items = menuItems;
            this.editor.isProtectedOnChange = prevOnChange;
        }
        return menuItems;
    }

    private buildShortcutMap(): void {
        this.shortcutMap.clear();
        this.editor.contextMenu.items.forEach((item: ContextMenuItemModel) => {
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
            this.editor.trigger('keyActionExecuted', {
                keyCombination: normalizedKey, action: menuItem.text
            });
        }
    }

    private handleContextMenuBeforeOpen(args: BeforeOpenCloseMenuEventArgs): void {
        const eventArgs: ContextMenuBeforeOpenEventArgs = {
            event: args.event,
            items: this.editor.contextMenu.items,
            parentItem: args.parentItem,
            cancel: !this.editor.blockActionsMenu.enable
        };
        if (this.editor.contextMenu.beforeOpen) {
            this.editor.contextMenu.beforeOpen.call(this, eventArgs);
        }
        args.cancel = eventArgs.cancel;
        if (this.editor.readOnly) { args.cancel = true; }
        if (!args.cancel) {
            this.toggleDisabledItems();
            this.editor.blockActionMenuModule.toggleBlockActionPopup(true);
            this.editor.linkModule.hideLinkPopup();
            setTimeout(() => {
                if (this.editor.inlineToolbarModule) {
                    this.editor.inlineToolbarModule.hideInlineToolbar(args.event);
                }
            }, 50);
        }
    }

    private handleContextMenuBeforeClose(args: BeforeOpenCloseMenuEventArgs): void {
        const eventArgs: ContextMenuBeforeCloseEventArgs = {
            event: args.event,
            items: this.editor.contextMenu.items,
            parentItem: args.parentItem,
            cancel: false
        };
        if (this.editor.contextMenu.beforeClose) {
            this.editor.contextMenu.beforeClose.call(this, eventArgs);
        }
        args.cancel = eventArgs.cancel;
    }

    private handleContextMenuOpen(args: OpenCloseMenuEventArgs): void {
        const eventArgs: ContextMenuOpenEventArgs = {
            element: args.element,
            items: this.editor.contextMenu.items,
            parentItem: args.parentItem
        };
        if (this.editor.contextMenu.open) {
            this.editor.contextMenu.open.call(this, eventArgs);
        }
        this.isPopupOpened = true;
    }

    private handleContextMenuClose(args: OpenCloseMenuEventArgs): void {
        const eventArgs: ContextMenuCloseEventArgs = {
            element: args.element,
            items: this.editor.contextMenu.items,
            parentItem: args.parentItem
        };
        if (this.editor.contextMenu.close) {
            this.editor.contextMenu.close.call(this, eventArgs);
        }
        this.isPopupOpened = false;
    }

    private handleContextMenuSelection(args: MenuEventArgs): void {
        const clickEventArgs: ContextMenuItemClickEventArgs = {
            item: (args.item as ContextMenuItemModel),
            event: args.event,
            cancel: false
        };
        if (this.editor.contextMenu.itemClick) {
            this.editor.contextMenu.itemClick.call(this, clickEventArgs);
        }
        if (clickEventArgs.cancel) {
            return;
        }
        this.handleContextMenuActions(args.item, args.event);
    }

    private handleIndentationAction(shouldDecrease: boolean): void {
        this.editor.blockCommandManager.handleBlockIndentation({
            blockIDs: this.editor.getSelectedBlocks().map((block: BlockModel) => block.id),
            shouldDecrease
        });
    }

    private handleContextMenuActions(menuItem: ContextMenuItemModel, e: Event): void {
        const prop: string = menuItem.id.toLowerCase();
        switch (prop) {
        case 'undo':
            this.editor.undoRedoAction.undo();
            break;
        case 'redo':
            this.editor.undoRedoAction.redo();
            break;
        case 'cut':
            this.editor.clipboardAction.handleContextCut();
            break;
        case 'copy':
            this.editor.clipboardAction.handleContextCopy();
            break;
        case 'paste':
            this.editor.clipboardAction.handleContextPaste();
            break;
        case 'link':
            this.editor.linkModule.showLinkPopup(e as KeyboardEvent);
            break;
        case 'increaseindent':
        case 'decreaseindent':
            this.handleIndentationAction(prop === 'decreaseindent');
            break;
        }
    }

    private enableMenuItems(itemIds: string[], enable: boolean): void {
        if (this.contextMenuObj) {
            this.contextMenuObj.enableItems(itemIds, enable, true);
        }
    }

    private toggleDisabledItems(): void {
        if (!getSelectedRange() || !this.editor.currentFocusedBlock) { return; }
        const blockModel: BlockModel = getBlockModelById(this.editor.currentFocusedBlock.id, this.editor.getEditorBlocks());
        const notAllowedTypes: string[] = [BlockType.Image, BlockType.Code];
        const isNotAllowedType: boolean = notAllowedTypes.indexOf(blockModel.type) !== -1;
        const previousBlockElement: HTMLElement = getAdjacentBlock(this.editor.currentFocusedBlock, 'previous');
        const previousBlockModel: BlockModel = previousBlockElement
            ? getBlockModelById(previousBlockElement.id, this.editor.getEditorBlocks())
            : null;
        const canIndent: boolean = (!previousBlockModel ||
            (previousBlockModel && blockModel.indent <= previousBlockModel.indent) && !isNotAllowedType);
        const canOutdent: boolean = blockModel.indent > 0 && !isNotAllowedType;
        const isSelection: boolean = getSelectedRange().toString().trim().length > 0;
        const canAllowLink: boolean = isSelection && !isNotAllowedType;

        this.enableMenuItems(['increaseindent'], canIndent);
        this.enableMenuItems(['decreaseindent'], canOutdent);
        this.enableMenuItems(['undo'], this.editor.undoRedoAction.canUndo());
        this.enableMenuItems(['redo'], this.editor.undoRedoAction.canRedo());
        this.enableMenuItems(['link'], canAllowLink);
        this.enableMenuItems(['cut'], isSelection);
        this.enableMenuItems(['copy'], isSelection);
        this.enableMenuItems(['paste'], !this.isClipboardEmptyCache);
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
     * Updates the cached clipboard state asynchronously.
     *
     * @returns {void}
     */
    public updateClipboardCacheState(): void {
        this.editor.clipboardAction.isClipboardEmpty().then((isEmpty: boolean) => {
            this.isClipboardEmptyCache = isEmpty;
        }).catch(() => {
            this.isClipboardEmptyCache = false;
        });
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {void}
     * @hidden
     */
    private getModuleName(): string {
        return 'contextMenu';
    }

    /**
     * Destroys the ContextMenu module.
     *
     * @returns {void}
     */
    public destroy(): void {
        if (this.contextMenuObj) {
            this.contextMenuObj.destroy();
            this.contextMenuObj = null;
            detach(this.menuElement);
            this.menuElement = null;
        }
        this.shortcutMap = null;
        this.removeEventListeners();
    }

    /**
     * Called internally if any of the property value changed.
     *
     * @param {BlockEditorModel} e - specifies the element.
     * @returns {void}
     * @hidden
     */
    protected onPropertyChanged(e: { [key: string]: BlockEditorModel }): void {
        if (e.module !== this.getModuleName()) {
            return;
        }
        const newProp: ContextMenuSettingsModel = e.newProp.contextMenu;
        const oldProp: ContextMenuSettingsModel = e.oldProp.contextMenu;
        if (!isNullOrUndefined(newProp)) {
            for (const prop of Object.keys(newProp)) {
                switch (prop) {
                case 'showItemOnClick':
                    if (newProp.showItemOnClick !== oldProp.showItemOnClick) {
                        this.contextMenuObj.showItemOnClick = newProp.showItemOnClick;
                    }
                    break;
                case 'items':
                    this.contextMenuObj.items = sanitizeContextMenuItems(newProp.items);
                    break;
                case 'itemTemplate':
                    if (newProp.itemTemplate !== oldProp.itemTemplate) {
                        this.contextMenuObj.itemTemplate = newProp.itemTemplate;
                    }
                    break;
                }
            }
        }
    }

}
