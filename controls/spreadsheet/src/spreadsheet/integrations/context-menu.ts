import { Spreadsheet } from '../base/index';
import { ContextMenu as ContextMenuComponent, BeforeOpenCloseMenuEventArgs, MenuItemModel } from '@syncfusion/ej2-navigations';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
import { closest, extend, detach } from '@syncfusion/ej2-base';
import { MenuSelectArgs, addSheetTab, removeSheetTab, cMenuBeforeOpen, renameSheetTab, cut, copy, paste } from '../common/index';
import { addContextMenuItems, removeContextMenuItems, enableContextMenuItems } from '../common/index';

/**
 * Represents context menu for Spreadsheet.
 */
export class ContextMenu {
    // Private properties.
    private parent: Spreadsheet;
    private contextMenuInstance: ContextMenuComponent;

    /**
     * Constructor for ContextMenu module.
     */
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.init();
    }

    private init(): void {
        this.initContextMenu();
        this.addEventListener();
    }

    private initContextMenu(): void {
        let ul: HTMLUListElement = document.createElement('ul');
        ul.id = this.parent.element.id + '_contextmenu';
        this.parent.element.appendChild(ul);
        this.contextMenuInstance = new ContextMenuComponent(
            {
                cssClass: 'e-spreadsheet-contextmenu',
                target: '#' + this.parent.element.id,
                filter: 'e-numericcontainer e-active-cell e-selection e-row e-header-row e-select-all-cell e-sheet-tabs-items',
                select: this.selectHandler.bind(this),
                beforeOpen: this.beforeOpenHandler.bind(this),
                beforeClose: this.beforeCloseHandler.bind(this)
            },
            ul);
    }

    /**
     * Before close event handler.
     */
    private beforeCloseHandler(args: BeforeOpenCloseMenuEventArgs): void {
        this.parent.trigger('contextMenuBeforeClose', args);
    }

    /**
     * Select event handler.
     */
    private selectHandler(args: MenuEventArgs): void {
        let selectArgs: MenuSelectArgs = extend({ cancel: false }, args) as MenuSelectArgs;
        this.parent.trigger('contextMenuItemSelect', selectArgs);
        if (!selectArgs.cancel) {
            switch (args.item.text) {
                case 'Dialog':
                    // Dialog functionality goes here
                    break;
                case 'Cut':
                    this.parent.notify(cut, { isClick: true });
                    break;
                case 'Copy':
                    this.parent.notify(copy, { isClick: true });
                    break;
                case 'Paste':
                    this.parent.notify(paste, { isClick: true });
                    break;
                case 'Values':
                    this.parent.notify(paste, { type: 'Values' });
                    break;
                case 'Formats':
                    this.parent.notify(paste, { type: 'Formats' });
                    break;
                case 'Rename':
                    this.parent.notify(renameSheetTab, {});
                    break;
                case 'Delete':
                    this.parent.notify(removeSheetTab, {});
                    break;
                case 'Insert':
                    this.parent.notify(addSheetTab, { text: args.item.text });
                    break;
                default:
                // Rename functionality goes here
            }
        }
    }

    /**
     * Before open event handler.
     */
    private beforeOpenHandler(args: BeforeOpenCloseMenuEventArgs): void {
        let target: string = this.getTarget(args.event.target as Element);
        if (args.element.classList.contains('e-contextmenu')) {
            let items: MenuItemModel[] = this.getDataSource(target);
            this.contextMenuInstance.items = items;
            this.contextMenuInstance.dataBind();
        }
        this.parent.trigger('contextMenuBeforeOpen', args);
        this.parent.notify(cMenuBeforeOpen, extend(args, { target: target }));
    }

    /**
     * To get target area based on right click.
     */
    private getTarget(target: Element): string {
        if (closest(target, '.e-row-header') || closest(target, '.e-header-panel')) {
            return 'Header';
        } else if (closest(target, '.e-main-content')) {
            return 'Content';
        } else if (closest(target, '.e-sheet-tabs-items')) {
            return 'Footer';
        } else {
            return '';
        }
    }

    /**
     * To populate context menu items based on target area.
     */
    private getDataSource(target: string): MenuItemModel[] {
        let items: MenuItemModel[] = [];
        if (target === 'Header') {
            this.setClipboardData(items);
        } else if (target === 'Content') {
            this.setClipboardData(items);
        } else if (target === 'Footer') {
            items.push({
                text: 'Insert'
            });
            items.push({
                text: 'Delete', iconCss: 'e-icons e-delete'
            });
            items.push({
                text: 'Rename'
            });
        }
        return items;
    }

    private setClipboardData(items: MenuItemModel[]): void {
        if (this.parent.enableClipboard) {
            items.push({
                text: 'Cut',
                iconCss: 'e-icons e-cut-icon'
            });
            items.push({
                text: 'Copy',
                iconCss: 'e-icons e-copy-icon'
            });
            items.push({
                text: 'Paste',
                iconCss: 'e-icons e-paste-icon'
            });
            items.push({
                text: 'Paste Special',
                iconCss: 'e-icons e-paste-icon',
                items: [
                    { text: 'Values' },
                    { text: 'Formats' }
                ]
            });
        }
    }

    /**
     * To add event listener.
     */
    private addEventListener(): void {
        this.parent.on(addContextMenuItems, this.addItemsHandler, this);
        this.parent.on(removeContextMenuItems, this.removeItemsHandler, this);
        this.parent.on(enableContextMenuItems, this.enableItemsHandler, this);
    }

    /**
     * To add context menu items before / after particular item.
     */
    private addItemsHandler(args: InsertArgs): void {
        if (args.insertAfter) {
            this.contextMenuInstance.insertAfter(args.items, args.text, args.isUniqueId);
        } else {
            this.contextMenuInstance.insertBefore(args.items, args.text, args.isUniqueId);
        }
    }

    /**
     * To remove context menu items.
     */
    private removeItemsHandler(args: RemoveArgs): void {
        this.contextMenuInstance.removeItems(args.items, args.isUniqueId);
    }

    /**
     * To enable / disable context menu items.
     */
    private enableItemsHandler(args: EnableDisableArgs): void {
        this.contextMenuInstance.enableItems(args.items, args.enable, args.isUniqueId);
    }

    /**
     * To remove event listener.
     */
    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(addContextMenuItems, this.addItemsHandler);
            this.parent.off(removeContextMenuItems, this.removeItemsHandler);
            this.parent.off(enableContextMenuItems, this.enableItemsHandler);
        }
    }

    /**
     * To get module name.
     */
    protected getModuleName(): string {
        return 'contextMenu';
    }

    /**
     * Destroy method.
     */
    protected destroy(): void {
        this.removeEventListener();
        this.contextMenuInstance.destroy();
        let ele: HTMLElement = document.getElementById(this.parent.element.id + '_contextmenu');
        if (ele) { detach(ele); }
        this.parent = null;
    }
}

/**
 * Insert method args.
 */
interface InsertArgs {
    items: MenuItemModel[];
    text: string;
    isUniqueId: boolean;
    insertAfter: boolean;
}

/**
 * Remove method args.
 */
interface RemoveArgs {
    items: string[];
    isUniqueId: boolean;
}

/**
 * Enable / Disable method args.
 */
interface EnableDisableArgs extends RemoveArgs {
    enable: boolean;
}
