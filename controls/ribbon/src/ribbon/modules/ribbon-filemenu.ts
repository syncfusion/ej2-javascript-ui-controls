import { EmitType, EventHandler, remove } from '@syncfusion/ej2-base';
import { DropDownButton } from '@syncfusion/ej2-splitbuttons';
import { Menu, MenuEventArgs, MenuItem, MenuItemModel } from '@syncfusion/ej2-navigations';
import { BeforeOpenCloseMenuEventArgs as BeforeDDBArgs, OpenCloseMenuEventArgs as AfterDDBArgs } from '@syncfusion/ej2-splitbuttons';
import { BeforeOpenCloseMenuEventArgs as BeforeMenuArgs, OpenCloseMenuEventArgs as AfterMenuArgs } from '@syncfusion/ej2-navigations';
import { FileMenuBeforeOpenCloseEventArgs, FileMenuEventArgs, FileMenuOpenCloseEventArgs, FileMenuSettings, FileMenuSettingsModel } from '../models/index';
import { commonProperties, getIndex, isTooltipPresent, Ribbon, ribbonTooltipData } from '../base/index';
import * as constants from '../base/constant';

/**
 * Defines the items of Ribbon.
 */
export class RibbonFileMenu {
    private parent: Ribbon;
    private fileMenuDDB: DropDownButton;
    private menuctrl: Menu;
    private ddbElement: HTMLButtonElement;

    constructor(parent: Ribbon) {
        this.parent = parent;
    }
    protected getModuleName(): string {
        return 'ribbonFileMenu';
    }
    protected destroy(): void {
        if (this.fileMenuDDB) {
            this.destroyDDB();
        }
        this.parent = null;
    }

    /**
     * Creates File Menu
     *
     * @param {FileMenuSettingsModel} fileMenuOptions - Gets the property of filemenu.
     * @returns {void}
     * @hidden
     */
    public createFileMenu(fileMenuOptions: FileMenuSettingsModel): void {
        if (!fileMenuOptions.visible) {
            return;
        }
        this.ddbElement = this.parent.createElement('button', {
            id: this.parent.element.id + constants.RIBBON_FILE_MENU_ID
        });
        const tabEle: HTMLElement = this.parent.tabObj.element;
        const toolbarEle: HTMLElement = tabEle.querySelector('.e-toolbar');
        tabEle.insertBefore(this.ddbElement, toolbarEle);
        this.fileMenuDDB = new DropDownButton({
            content: fileMenuOptions.text,
            enableRtl: this.parent.enableRtl,
            cssClass: 'e-ribbon-file-menu e-caret-hide',
            created: () => {
                tabEle.style.setProperty(constants.RIBBON_FILE_MENU_WIDTH, this.ddbElement.offsetWidth + 'px');
            },
            beforeClose: this.ddbBeforeEvent.bind(this, false),
            beforeOpen: this.ddbBeforeEvent.bind(this, true),
            close: this.ddbAfterEvent.bind(this, false),
            open: this.ddbAfterEvent.bind(this, true)
        }, this.ddbElement);
        if (this.parent.fileMenu.popupTemplate) {
            this.fileMenuDDB.setProperties({ target: this.parent.fileMenu.popupTemplate });
        } else {
            this.createRibbonMenu(fileMenuOptions);
        }
        this.parent.tabObj.refreshActiveTabBorder();
        this.addFileMenuTooltip(fileMenuOptions);
        this.addFileMenuKeytip();
    }
    private addFileMenuTooltip(fileMenuOptions: FileMenuSettingsModel): void {
        if (isTooltipPresent(fileMenuOptions.ribbonTooltipSettings)) {
            this.ddbElement.classList.add(constants.RIBBON_TOOLTIP_TARGET);
            this.parent.tooltipData.push({ id: this.ddbElement.id, data: fileMenuOptions.ribbonTooltipSettings });
        }
    }
    private addFileMenuKeytip(): void {
        if (this.parent.fileMenu.keyTip) {
            ((this.parent.keyTipElements as {[key: string]: object})['filemenu'] as object[]) = [];
            ((this.parent.keyTipElements as {[key: string]: object})['filemenu'] as object[]).push({ id: this.ddbElement.id, type: 'filemenu', keyTip: this.parent.fileMenu.keyTip});
        }
    }
    private ddbBeforeEvent(isOpen: boolean, args: BeforeDDBArgs): void {
        //args.event is null when dropdown button is closed using a method call
        if (!isOpen && args.event && (args.event.target as HTMLElement).closest('.e-ribbon-menu')) {
            args.cancel = true;
        }
        const event: EmitType<FileMenuBeforeOpenCloseEventArgs> = isOpen ? this.parent.fileMenu.beforeOpen :
            this.parent.fileMenu.beforeClose;
        if (event) {
            const eventArgs: FileMenuBeforeOpenCloseEventArgs = { cancel: args.cancel, element: args.element, event: args.event };
            event.call(this, eventArgs);
            args.cancel = eventArgs.cancel;
        }
    }
    private ddbAfterEvent(isOpen: boolean, args: AfterDDBArgs): void {
        const element: HTMLElement = isOpen ? this.fileMenuDDB.target as HTMLElement : this.fileMenuDDB.element;
        element.focus();
        const event: EmitType<FileMenuOpenCloseEventArgs> = isOpen ? this.parent.fileMenu.open : this.parent.fileMenu.close;
        if (event) {
            const eventArgs: FileMenuOpenCloseEventArgs = { element: args.element };
            event.call(this, eventArgs);
        }
    }
    //Clone RibbonMenuItems before assigning to avoid reference issues.
    private cloneMenuItem(items: MenuItemModel[]): MenuItemModel[] {
        const itemsList: MenuItemModel[] = [];
        for (let i: number = 0; i < items.length; i++) {
            const item: MenuItemModel = items[parseInt(i.toString(), 10)];
            itemsList.push({
                iconCss: item.iconCss,
                id: item.id,
                separator: item.separator,
                text: item.text,
                url: item.url,
                items: this.cloneMenuItem(item.items)
            });
        }
        return itemsList;
    }
    private createRibbonMenu(menuOptions: FileMenuSettingsModel): void {
        const ulElem: HTMLUListElement = this.parent.createElement('ul', {
            id: this.parent.element.id + constants.RIBBON_FILE_MENU_LIST
        });
        this.fileMenuDDB.setProperties({ target: ulElem });
        this.menuctrl = new Menu({
            orientation: 'Vertical',
            enableRtl: this.parent.enableRtl,
            cssClass: 'e-ribbon-menu',
            animationSettings: menuOptions.animationSettings,
            items: this.cloneMenuItem(menuOptions.menuItems),
            showItemOnClick: menuOptions.showItemOnClick,
            template: menuOptions.itemTemplate as string | Function,
            beforeClose: this.menuBeforeEvent.bind(this, false),
            beforeOpen: this.menuBeforeEvent.bind(this, true),
            beforeItemRender: this.beforeItemRender.bind(this),
            onClose: this.menuAfterEvent.bind(this, false),
            onOpen: this.menuAfterEvent.bind(this, true),
            select: this.menuSelect.bind(this)
        }, ulElem);
        EventHandler.add(ulElem, 'keydown', (e: KeyboardEvent) => {
            if (e.key === 'Tab') { this.fileMenuDDB.toggle(); }
        }, this);
    }
    private menuBeforeEvent(isOpen: boolean, args: BeforeMenuArgs): void {
        const event: EmitType<FileMenuBeforeOpenCloseEventArgs> = isOpen ? this.parent.fileMenu.beforeOpen :
            this.parent.fileMenu.beforeClose;
        if (event) {
            const eventArgs: FileMenuBeforeOpenCloseEventArgs = {
                cancel: args.cancel, element: args.element, event: args.event,
                items: args.items, parentItem: args.parentItem
            };
            event.call(this, eventArgs);
            args.cancel = eventArgs.cancel;
        }
    }
    private menuAfterEvent(isOpen: boolean, args: AfterMenuArgs): void {
        const event: EmitType<FileMenuOpenCloseEventArgs> = isOpen ? this.parent.fileMenu.open : this.parent.fileMenu.close;
        if (event) {
            const eventArgs: FileMenuOpenCloseEventArgs = { element: args.element, items: args.items, parentItem: args.parentItem };
            event.call(this, eventArgs);
        }
    }
    private beforeItemRender(args: MenuEventArgs): void {
        const event: EmitType<FileMenuEventArgs> = this.parent.fileMenu.beforeItemRender;
        if (event) {
            const eventArgs: FileMenuEventArgs = { element: args.element, item: args.item };
            event.call(this, eventArgs);
        }
    }
    private menuSelect(args: MenuEventArgs): void {
        const event: EmitType<FileMenuEventArgs> = this.parent.fileMenu.select;
        if (event) {
            const eventArgs: FileMenuEventArgs = { element: args.element, item: args.item, event: args.event };
            event.call(this, eventArgs);
        }
        const menuOpen: boolean = !!args.element.closest('.e-ribbon-menu.e-popup-open');
        const fileTriggerOpen: boolean = !!args.element.closest('.e-ribbon-file-menu.e-popup-open');
        const fileMenuOpen: boolean = !!document.querySelector('.e-ribbon-file-menu.e-popup-open');
        // True if the file trigger was clicked open, or if the ribbon menu is open and the file menu popup is actually present
        const isMenuOpen: boolean = fileTriggerOpen || (menuOpen && fileMenuOpen);
        if (!args.element.classList.contains('e-menu-caret-icon') && isMenuOpen) {
            this.fileMenuDDB.toggle();
        }
    }

    /**
     * setRtl
     *
     * @param {commonProperties} commonProp - Get the common property of ribbon.
     * @returns {void}
     * @hidden
     */
    public setCommonProperties(commonProp: commonProperties): void {
        if (this.fileMenuDDB) {
            this.fileMenuDDB.setProperties(commonProp);
            if (this.menuctrl) {
                this.menuctrl.setProperties(commonProp);
            }
        }
    }

    /**
     * Update FileMenu
     *
     * @param {FileMenuSettingsModel} fileMenuOptions - Gets the property of filemenu.
     * @returns {void}
     * @hidden
     */
    public updateFileMenu(fileMenuOptions: FileMenuSettingsModel): void {
        if (fileMenuOptions.visible) {
            if (this.fileMenuDDB) {
                if (fileMenuOptions.text) {
                    this.fileMenuDDB.setProperties({
                        content: fileMenuOptions.text
                    });
                    this.parent.tabObj.element.style.setProperty(constants.RIBBON_FILE_MENU_WIDTH, this.ddbElement.offsetWidth + 'px');
                }
                if (fileMenuOptions.popupTemplate) {
                    if (this.menuctrl) {
                        this.destroyMenu();
                    }
                    this.fileMenuDDB.setProperties({ target: fileMenuOptions.popupTemplate });
                }
                else {
                    if (this.menuctrl) {
                        this.menuctrl.setProperties({
                            animationSettings: fileMenuOptions.animationSettings,
                            items: this.cloneMenuItem(fileMenuOptions.menuItems),
                            showItemOnClick: fileMenuOptions.showItemOnClick,
                            template: fileMenuOptions.itemTemplate
                        });
                    }
                    else {
                        this.createRibbonMenu(fileMenuOptions);
                    }
                }
                this.removeFileMenuTooltip();
                this.removeFileMenuKeytip();
                this.addFileMenuTooltip(fileMenuOptions);
                this.addFileMenuKeytip();
            }
            else {
                this.createFileMenu(fileMenuOptions);
            }
        }
        else if (this.fileMenuDDB) {
            this.destroyDDB();
        }
        this.parent.tabObj.refreshActiveTabBorder();
    }

    private destroyMenu(): void {
        if (this.menuctrl) {
            this.menuctrl.destroy();
            this.menuctrl = null;
        }
    }
    private destroyDDB(): void {
        this.removeFileMenuTooltip();
        this.removeFileMenuKeytip();
        const tabEle: HTMLElement = this.parent.tabObj.element;
        tabEle.style.removeProperty(constants.RIBBON_FILE_MENU_WIDTH);
        this.destroyMenu();
        this.fileMenuDDB.destroy();
        this.fileMenuDDB = null;
        remove(this.ddbElement);
        this.ddbElement = null;
    }
    private removeFileMenuTooltip(): void {
        const index: number = getIndex(this.parent.tooltipData, (e: ribbonTooltipData) => { return e.id === this.ddbElement.id; });
        if (index !== -1) {
            this.ddbElement.classList.remove(constants.RIBBON_TOOLTIP_TARGET);
            this.parent.tooltipData.splice(index, 1);
        }
    }
    private removeFileMenuKeytip(): void {
        if ((this.parent.keyTipElements as {[key: string]: object})['filemenu']) {
            const index: number = getIndex(((this.parent.keyTipElements as {[key: string]: object})['filemenu'] as object[]), (e: { [key: string]: string }) => { return e.id === this.ddbElement.id; });
            if (index !== -1) {
                ((this.parent.keyTipElements as {[key: string]: object})['filemenu'] as object[]).splice(index, 1);
            }
        }
    }

    /**
     * Add items to FileMenu.
     *
     * @param {MenuItemModel[]} items - Gets the items to be added.
     * @param {string} target - Gets the target item to add the items.
     * @param {boolean} isAfter - Gets the boolean value to add the items after or before the target item.
     * @param {boolean} isUniqueId - Gets whether the target provided is uniqueId or not.
     * @returns {void}
     */
    public addItems(items: MenuItemModel[], target: string, isAfter: boolean, isUniqueId?: boolean): void {
        if (isAfter) {
            this.menuctrl.insertAfter(items, target, isUniqueId);
        } else {
            this.menuctrl.insertBefore(items, target, isUniqueId);
        }
        (this.parent.fileMenu as FileMenuSettings).setProperties({ menuItems: this.menuctrl.items }, true);
    }

    /**
     * Remove items from FileMenu.
     *
     * @param {string[]} items - Gets the items to be removed.
     * @param {boolean} isUniqueId - Gets whether the target provided is uniqueId or not.
     * @returns {void}
     */
    public removeItems(items: string[], isUniqueId?: boolean): void {
        this.menuctrl.removeItems(items, isUniqueId);
        (this.parent.fileMenu as FileMenuSettings).setProperties({ menuItems: this.menuctrl.items }, true);
    }

    /**
     * Enable items in FileMenu.
     *
     * @param {string[]} items - Gets the items to be enabled.
     * @param {boolean} isUniqueId - Gets whether the target provided is uniqueId or not.
     * @returns {void}
     */
    public enableItems(items: string[], isUniqueId?: boolean): void {
        this.menuctrl.enableItems(items, true, isUniqueId);
        (this.parent.fileMenu as FileMenuSettings).setProperties({ menuItems: this.menuctrl.items }, true);
    }

    /**
     * Disable items in FileMenu.
     *
     * @param {string[]} items - Gets the items to be disabled.
     * @param {boolean} isUniqueId - Gets whether the target provided is uniqueId or not.
     * @returns {void}
     */
    public disableItems(items: string[], isUniqueId?: boolean): void {
        this.menuctrl.enableItems(items, false, isUniqueId);
        (this.parent.fileMenu as FileMenuSettings).setProperties({ menuItems: this.menuctrl.items }, true);
    }

    /**
     * Update items in FileMenu.
     *
     * @param {MenuItem} item - Gets the item to be updated.
     * @param {boolean} id - Gets the id of the item to be updated.
     * @param {boolean} isUniqueId - Gets whether the id provided is uniqueId or not.
     * @returns {void}
     */
    public setItem(item: MenuItem, id?: string, isUniqueId?: boolean): void {
        this.menuctrl.setItem(item, id, isUniqueId);
        this.menuctrl.refresh();
        (this.parent.fileMenu as FileMenuSettings).setProperties({ menuItems: this.menuctrl.items }, true);
    }

}
