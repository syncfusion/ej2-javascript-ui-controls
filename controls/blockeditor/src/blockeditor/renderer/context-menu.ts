import { detach, isNullOrUndefined } from '@syncfusion/ej2-base';
import { BeforeOpenCloseMenuEventArgs, ContextMenu, MenuEventArgs, OpenCloseMenuEventArgs } from '@syncfusion/ej2-navigations';
import { ContextMenuItemModel, ContextMenuSettingsModel } from '../../models/index';
import { getContextMenuItems, getDefaultTableItems, getDefaultLinkItems } from '../../common/utils/data';
import { BlockEditor } from '../base/blockeditor';
import { ContextMenuBeforeOpenEventArgs, ContextMenuBeforeCloseEventArgs, ContextMenuItemSelectEventArgs } from '../../models/eventargs';
import { events } from '../../common/constant';
import { sanitizeContextMenuItems } from '../../common/utils/transform';
import * as constants from '../../common/constant';
import { BlockEditorModel } from '../base/blockeditor-model';
import { ContextMenuModule as BlockManagerContextMenuModule } from '../../block-manager/plugins/menus/context-menu';

/**
 * `ContextMenuModule` is used to handle the context menu actions in the BlockEditor.
 *
 * @hidden
 */
export class ContextMenuModule {
    private editor: BlockEditor;
    public contextMenuObj: ContextMenu;
    private menuElement: HTMLUListElement;
    private isTableContextActive: boolean = false;
    private isLinkContextActive: boolean = false;

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
        this.removeTableItemsFromMenu();
        this.editor.blockManager.observer.notify('contextMenuCreated');
    }

    private getMenuItems(): ContextMenuItemModel[] {
        // Return only default items; table items are added/removed dynamically in beforeOpen
        const defaultItems: ContextMenuItemModel[] = this.editor.contextMenuSettings.items.length > 0
            ? sanitizeContextMenuItems(this.editor.contextMenuSettings.items)
            : this.buildAllMenuItems();

        if (this.editor.contextMenuSettings.items.length <= 0) {
            const prevOnChange: boolean = this.editor.isProtectedOnChange;
            this.editor.isProtectedOnChange = true;
            this.editor.contextMenuSettings.items = defaultItems;
            this.editor.isProtectedOnChange = prevOnChange;
        }
        return defaultItems;
    }

    /**
     * Builds default menu items only (no table items).
     * Table items are injected dynamically in handleContextMenuBeforeOpen when in table context.
     *
     * @returns {ContextMenuItemModel[]} - Default menu items only.
     * @private
     */
    private buildAllMenuItems(): ContextMenuItemModel[] {
        return getContextMenuItems();
    }

    /**
     * Resolves table items from contextMenuSettings or falls back to defaults.
     *
     * @returns {ContextMenuItemModel[]} - Resolved table menu items.
     * @private
     */
    private getResolvedTableItems(): ContextMenuItemModel[] {
        let tableItems: ContextMenuItemModel[] = [];

        if (this.editor.contextMenuSettings.table && this.editor.contextMenuSettings.table.length > 0 &&
            this.editor.blockManager.contextMenuModule) {
            tableItems = this.editor.blockManager.contextMenuModule.resolveTableItems(
                this.editor.contextMenuSettings.table
            );
        } else {
            tableItems = getDefaultTableItems(this.editor.blockManager.localeJson);
        }

        return tableItems.filter((item: ContextMenuItemModel) => item !== undefined && item !== null);
    }



    /**
     * Checks whether table items are currently present in the context menu.
     *
     * @returns {boolean} - True if table items exist in menu, false otherwise.
     * @private
     */
    private hasTableItems(): boolean {
        if (!this.contextMenuObj || !this.contextMenuObj.items) {
            return false;
        }
        return this.contextMenuObj.items.some(
            (item: ContextMenuItemModel) => item.id === 'table-insert' || item.id === 'table-delete'
        );
    }

    /**
     * Dynamically adds table items to the context menu before the link item.
     *
     * @returns {void}
     * @private
     */
    private addTableItemsToMenu(): void {
        if (!this.contextMenuObj || !this.contextMenuObj.items || this.hasTableItems()) {
            return;
        }

        const tableItems: ContextMenuItemModel[] = this.getResolvedTableItems();
        if (tableItems.length === 0) {
            return;
        }

        const separator: ContextMenuItemModel = { id: 'table-separator', separator: true };
        const linkItem: ContextMenuItemModel = this.contextMenuObj.items.find(
            (item: ContextMenuItemModel) => item.id === 'link'
        );

        if (linkItem) {
            this.contextMenuObj.insertBefore([...tableItems, separator], 'link', true);
        } else {
            const lastItem: ContextMenuItemModel =
                this.contextMenuObj.items[this.contextMenuObj.items.length - 1];
            this.contextMenuObj.insertAfter([separator, ...tableItems], lastItem.id, true);
        }
    }

    /**
     * Dynamically removes table items and their associated separator from the context menu.
     *
     * @returns {void}
     * @private
     */
    private removeTableItemsFromMenu(): void {
        if (!this.contextMenuObj || !this.contextMenuObj.items || !this.hasTableItems()) {
            return;
        }
        const tableItemIds: string[] = this.getTableItemIds();
        const presentIds: string[] = this.contextMenuObj.items
            .filter((item: ContextMenuItemModel) => tableItemIds.indexOf(item.id) !== -1)
            .map((item: ContextMenuItemModel) => item.id);

        if (presentIds.length > 0) {
            this.contextMenuObj.removeItems([...presentIds, 'table-separator'], true);
        }
        this.cleanDanglingSeperators();
    }

    /**
     * Removes consecutive or trailing separators that may be left after table items are removed.
     *
     * @returns {void}
     * @private
     */
    private cleanDanglingSeperators(): void {
        if (!this.contextMenuObj || !this.contextMenuObj.items) {
            return;
        }
        let lastWasSeparator: boolean = true;
        let newItems: ContextMenuItemModel[] = this.contextMenuObj.items.filter(
            (item: ContextMenuItemModel) => {
                const isSep: boolean = item.separator === true;
                if (isSep && lastWasSeparator) { return false; }
                lastWasSeparator = isSep;
                return true;
            }
        );
        const last: ContextMenuItemModel = newItems[newItems.length - 1];
        if (last && last.separator === true) { newItems = newItems.slice(0, -1); }
        this.contextMenuObj.items = newItems;
    }

    /**
     * Returns the IDs of all known table menu items.
     *
     * @returns {string[]} - Array of table item IDs.
     * @private
     */
    private getTableItemIds(): string[] {
        return [
            'table-separator',
            'table-insert',
            'table-insert-column-left',
            'table-insert-column-right',
            'table-insert-row-above',
            'table-insert-row-below',
            'table-delete',
            'table-delete-column',
            'table-delete-row',
            'table-delete-table'
        ];
    }

    /**
     * Returns the IDs of all known link context menu items.
     *
     * @returns {string[]} - Array of link item IDs.
     * @private
     */
    private getLinkItemIds(): string[] {
        return ['link-separator', 'link-edit', 'link-copy', 'link-open', 'link-remove'];
    }

    /**
     * Resolves link items from contextMenuSettings or falls back to defaults.
     *
     * @returns {ContextMenuItemModel[]} - Resolved link menu items.
     * @private
     */
    private getResolvedLinkItems(): ContextMenuItemModel[] {
        let linkItems: ContextMenuItemModel[] = [];

        if (this.editor.contextMenuSettings.link && this.editor.contextMenuSettings.link.length > 0 &&
            this.editor.blockManager.contextMenuModule) {
            linkItems = this.editor.blockManager.contextMenuModule.resolveLinkItems(
                this.editor.contextMenuSettings.link
            );
        } else {
            linkItems = getDefaultLinkItems(this.editor.blockManager.localeJson);
        }

        return linkItems.filter((item: ContextMenuItemModel) => item !== undefined && item !== null);
    }



    /**
     * Checks whether link items are currently present in the context menu.
     *
     * @returns {boolean} - True if link items exist in menu, false otherwise.
     * @private
     */
    private hasLinkItems(): boolean {
        if (!this.contextMenuObj || !this.contextMenuObj.items) {
            return false;
        }
        return this.contextMenuObj.items.some(
            (item: ContextMenuItemModel) => this.getLinkItemIds().indexOf(item.id) !== -1
        );
    }

    /**
     * Dynamically adds link items to the context menu.
     * Link items replace the default items so only link options are shown when right-clicking a link.
     *
     * @returns {void}
     * @private
     */
    private addLinkItemsToMenu(): void {
        if (!this.contextMenuObj || !this.contextMenuObj.items || this.hasLinkItems()) {
            return;
        }

        const linkItems: ContextMenuItemModel[] = this.getResolvedLinkItems();
        if (linkItems.length === 0) {
            return;
        }

        const separator: ContextMenuItemModel = { id: 'link-separator', separator: true };
        const linkItem: ContextMenuItemModel = this.contextMenuObj.items.find(
            (item: ContextMenuItemModel) => item.id === 'link'
        );

        if (linkItem) {
            this.contextMenuObj.insertBefore([...linkItems, separator], 'link', true);
        } else {
            const lastItem: ContextMenuItemModel =
                this.contextMenuObj.items[this.contextMenuObj.items.length - 1];
            this.contextMenuObj.insertAfter([separator, ...linkItems], lastItem.id, true);
        }
    }

    /**
     * Dynamically removes link items and their associated separator from the context menu.
     *
     * @returns {void}
     * @private
     */
    private removeLinkItemsFromMenu(): void {
        if (!this.contextMenuObj || !this.contextMenuObj.items || !this.hasLinkItems()) {
            return;
        }

        const linkItemIds: string[] = this.getLinkItemIds();
        const presentIds: string[] = this.contextMenuObj.items
            .filter((item: ContextMenuItemModel) => linkItemIds.indexOf(item.id) !== -1)
            .map((item: ContextMenuItemModel) => item.id);

        if (presentIds.length > 0) {
            this.contextMenuObj.removeItems([...presentIds, 'link-separator'], true);
        }
        this.cleanDanglingSeperators();
    }

    private handleContextMenuBeforeOpen(args: BeforeOpenCloseMenuEventArgs): void {
        const isRootOpen: boolean = isNullOrUndefined(args.parentItem);

        if (isRootOpen) {
            this.isTableContextActive = false;
            this.isLinkContextActive = false;
            const triggerEvent: MouseEvent = args.event as MouseEvent;
            if (triggerEvent && triggerEvent.type === 'contextmenu') {
                this.isTableContextActive = this.isClickOnTable(args.event);
                this.isLinkContextActive = this.isClickOnLink(args.event);
            }
        }

        const eventArgs: ContextMenuBeforeOpenEventArgs = {
            event: args.event,
            items: this.editor.contextMenuSettings.items,
            parentItem: args.parentItem,
            cancel: !this.editor.contextMenuSettings.enable
        };
        if (this.editor.contextMenuSettings.beforeOpen) {
            this.editor.contextMenuSettings.beforeOpen.call(this, eventArgs);
        }
        args.cancel = eventArgs.cancel;
        if (this.editor.readOnly) { args.cancel = true; }

        if (!args.cancel) {
            if (isRootOpen) {
                // Always clean up both contexts first to prevent state corruption
                // This ensures proper transition between link and table contexts
                this.removeLinkItemsFromMenu();
                this.removeTableItemsFromMenu();

                // Then add items for the current context
                if (this.isTableContextActive) {
                    this.addTableItemsToMenu();
                }
                if (this.isLinkContextActive) {
                    this.addLinkItemsToMenu();
                }
                this.editor.blockManager.observer.notify('contextMenuBeforeOpen', args);
            }
            if (this.isTableContextActive) {
                this.filterTableMenuItems();
            }
        }
    }

    /**
     * Filters insert submenu items dynamically based on header cell context.
     * Only called when in table context.
     *
     * @returns {void}
     * @private
     */
    private filterTableMenuItems(): void {
        if (!this.contextMenuObj || !this.contextMenuObj.items) {
            return;
        }

        const tableInsertItem: ContextMenuItemModel = this.contextMenuObj.items.find(
            (item: ContextMenuItemModel) => item.id === 'table-insert'
        );

        if (tableInsertItem && tableInsertItem.items) {
            const contextMenuModule: BlockManagerContextMenuModule = this.editor.blockManager.contextMenuModule;
            const isHeaderCell: boolean = contextMenuModule.isHeaderCellActive();

            const insertItems: ContextMenuItemModel[] = [
                {
                    id: 'table-insert-column-left',
                    text: this.editor.l10n.getConstant('insertColumnLeft'),
                    iconCss: 'e-icons e-insert-left'
                },
                {
                    id: 'table-insert-column-right',
                    text: this.editor.l10n.getConstant('insertColumnRight'),
                    iconCss: 'e-icons e-insert-right'
                },
                {
                    id: 'table-insert-row-above',
                    text: this.editor.l10n.getConstant('insertRowAbove'),
                    iconCss: 'e-icons e-insert-above'
                },
                {
                    id: 'table-insert-row-below',
                    text: this.editor.l10n.getConstant('insertRowBelow'),
                    iconCss: 'e-icons e-insert-below'
                }
            ];

            // Hide 'row above' for header cells
            tableInsertItem.items = isHeaderCell
                ? insertItems.filter((item: ContextMenuItemModel) => item.id !== 'table-insert-row-above')
                : insertItems;
        }
    }

    /**
     * Checks if the context menu was triggered on a table block.
     * Only returns true when right-clicking directly on table cells (td/th), not just anywhere in the table.
     * Reads directly from the event target DOM — no dependency on focus state.
     *
     * @param {Event} event - The event that triggered the context menu.
     * @returns {boolean} - True if on a table cell (td/th), false otherwise.
     * @private
     */
    private isClickOnTable(event: Event): boolean {
        if (!event || !(event as MouseEvent).target) {
            return false;
        }
        const target: HTMLElement = (event as MouseEvent).target as HTMLElement;
        // Only show table options when clicking directly on cells (td or th), not just anywhere in the table block
        if (target.closest('td') || target.closest('th')) {
            return true;
        }
        return false;
    }

    /**
     * Checks if the context menu was triggered on a link element.
     *
     * @param {Event} event - The event that triggered the context menu.
     * @returns {boolean} - True if on a link, false otherwise.
     * @private
     */
    private isClickOnLink(event: Event): boolean {
        if (!event || !(event as MouseEvent).target) {
            return false;
        }
        const target: HTMLElement = (event as MouseEvent).target as HTMLElement;
        return !!target.closest('a');
    }

    private handleContextMenuBeforeClose(args: BeforeOpenCloseMenuEventArgs): void {
        const eventArgs: ContextMenuBeforeCloseEventArgs = {
            event: args.event,
            items: this.editor.contextMenuSettings.items,
            parentItem: args.parentItem,
            cancel: false
        };
        if (this.editor.contextMenuSettings.beforeClose) {
            this.editor.contextMenuSettings.beforeClose.call(this, eventArgs);
        }
        args.cancel = eventArgs.cancel;
    }

    private handleContextMenuOpen(args: OpenCloseMenuEventArgs): void {
        this.editor.blockManager.observer.notify('updateContextMenuState', { value: { isOpen: true } });
    }

    private handleContextMenuClose(args: OpenCloseMenuEventArgs): void {
        this.isTableContextActive = false;
        this.isLinkContextActive = false;
        this.editor.blockManager.observer.notify('updateContextMenuState', { value: { isOpen: false } });
        this.editor.blockManager.observer.notify('contextMenuAfterClose', {});
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
            this.removeTableItemsFromMenu();
            this.contextMenuObj.destroy();
            this.contextMenuObj = null;
            detach(this.menuElement);
            this.menuElement = null;
        }
        this.isTableContextActive = false;
        this.isLinkContextActive = false;
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
