import { detach, isNullOrUndefined } from '@syncfusion/ej2-base';
import { BeforeOpenCloseMenuEventArgs, ContextMenu, MenuEventArgs, OpenCloseMenuEventArgs } from '@syncfusion/ej2-navigations';
import { ContextMenuItemModel, ContextMenuSettingsModel } from '../../models/index';
import { getContextMenuItems } from '../../common/utils/data';
import { BlockEditor } from '../base/blockeditor';
import { ContextMenuOpeningEventArgs, ContextMenuClosingEventArgs, ContextMenuItemSelectEventArgs } from '../../models/eventargs';
import { events } from '../../common/constant';
import { sanitizeContextMenuItems } from '../../common/utils/transform';
import * as constants from '../../common/constant';
import { BlockEditorModel } from '../base/blockeditor-model';

/**
 * `ContextMenuModule` is used to handle the context menu actions in the BlockEditor.
 *
 * @hidden
 */
export class ContextMenuModule {
    private editor: BlockEditor;
    public contextMenuObj: ContextMenu;
    private menuElement: HTMLUListElement;

    constructor(editor: BlockEditor) {
        this.editor = editor;
        this.init();
        this.addEventListeners();
    }

    private addEventListeners(): void {
        this.editor.on(events.moduleChanged, this.onPropertyChanged, this);
        this.editor.blockManager.observer.on('enableDisableContextMenuItems', this.enableMenuItems, this);
        this.editor.on(events.destroy, this.destroy, this);
    }

    private removeEventListeners(): void {
        this.editor.off(events.moduleChanged, this.onPropertyChanged);
        this.editor.blockManager.observer.off('enableDisableContextMenuItems', this.enableMenuItems);
        this.editor.off(events.destroy, this.destroy);
    }

    private init(): void {
        this.menuElement = this.editor.createElement('ul', {
            id: (this.editor.element.id + constants.BLOCKEDITOR_CONTEXTMENU_ID)
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
            cssClass: constants.BLOCKEDITOR_CONTEXTMENU_CLS,
            element: this.menuElement,
            items: this.getMenuItems(),
            showItemOnClick: this.editor.contextMenuSettings.showItemOnClick,
            itemTemplate: itemTemplate,
            fields: { text: 'text', iconCss: 'iconCss', itemId: 'id' },
            select: this.handleContextMenuSelection.bind(this),
            beforeOpen: this.handleContextMenuBeforeOpen.bind(this),
            beforeClose: this.handleContextMenuBeforeClose.bind(this),
            open: this.handleContextMenuOpen.bind(this),
            close: this.handleContextMenuClose.bind(this)
        });
        this.editor.blockManager.observer.notify('contextMenuCreated');
    }

    private getMenuItems(): ContextMenuItemModel[] {
        const menuItems: ContextMenuItemModel[] = this.editor.contextMenuSettings.items.length > 0
            ? sanitizeContextMenuItems(this.editor.contextMenuSettings.items)
            : getContextMenuItems();

        if (this.editor.contextMenuSettings.items.length <= 0) {
            const prevOnChange: boolean = this.editor.isProtectedOnChange;
            this.editor.isProtectedOnChange = true;
            this.editor.contextMenuSettings.items = menuItems;
            this.editor.isProtectedOnChange = prevOnChange;
        }
        return menuItems;
    }

    private handleContextMenuBeforeOpen(args: BeforeOpenCloseMenuEventArgs): void {
        const eventArgs: ContextMenuOpeningEventArgs = {
            event: args.event,
            items: this.editor.contextMenuSettings.items,
            parentItem: args.parentItem,
            cancel: !this.editor.contextMenuSettings.enable
        };
        if (this.editor.contextMenuSettings.opening) {
            this.editor.contextMenuSettings.opening.call(this, eventArgs);
        }
        args.cancel = eventArgs.cancel;
        if (this.editor.readOnly) { args.cancel = true; }
        if (!args.cancel) {
            this.editor.blockManager.observer.notify('contextMenuBeforeOpen', args);
        }
    }

    private handleContextMenuBeforeClose(args: BeforeOpenCloseMenuEventArgs): void {
        const eventArgs: ContextMenuClosingEventArgs = {
            event: args.event,
            items: this.editor.contextMenuSettings.items,
            parentItem: args.parentItem,
            cancel: false
        };
        if (this.editor.contextMenuSettings.closing) {
            this.editor.contextMenuSettings.closing.call(this, eventArgs);
        }
        args.cancel = eventArgs.cancel;
    }

    private handleContextMenuOpen(args: OpenCloseMenuEventArgs): void {
        this.editor.blockManager.observer.notify('updateContextMenuState', { value: { isOpen: true } });
    }

    private handleContextMenuClose(args: OpenCloseMenuEventArgs): void {
        this.editor.blockManager.observer.notify('updateContextMenuState', { value: { isOpen: false } });
    }

    private handleContextMenuSelection(args: MenuEventArgs): void {
        const clickEventArgs: ContextMenuItemSelectEventArgs = {
            item: (args.item as ContextMenuItemModel),
            event: args.event,
            cancel: false
        };
        if (this.editor.contextMenuSettings.itemSelect) {
            this.editor.contextMenuSettings.itemSelect.call(this, clickEventArgs);
        }
        if (!clickEventArgs.cancel) {
            this.editor.blockManager.observer.notify('contextMenuSelection', args);
        }
    }

    private enableMenuItems(menuState: { [key: string]: boolean }): void {
        if (this.contextMenuObj) {
            const itemIds: string[] = Object.keys(menuState);
            itemIds.forEach((item: string) => {
                this.contextMenuObj.enableItems([item], menuState[(item as string)], true);
            });
        }
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {void}
     * @hidden
     */
    private getModuleName(): string {
        return 'contextMenuSettings';
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
        const newProp: ContextMenuSettingsModel = e.newProp.contextMenuSettings;
        if (!isNullOrUndefined(newProp)) {
            for (const prop of Object.keys(newProp)) {
                switch (prop) {
                case 'showItemOnClick':
                    this.contextMenuObj.showItemOnClick = this.editor.blockManager.contextMenuSettings.showItemOnClick =
                    newProp.showItemOnClick;
                    break;
                case 'items':
                    this.contextMenuObj.items = this.editor.blockManager.contextMenuSettings.items =
                    sanitizeContextMenuItems(newProp.items);
                    break;
                case 'itemTemplate':
                    this.contextMenuObj.itemTemplate = newProp.itemTemplate;
                    break;
                }
            }
        }
    }

}
