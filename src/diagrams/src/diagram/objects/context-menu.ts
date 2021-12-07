/* eslint-disable @typescript-eslint/no-explicit-any */
import { L10n, isBlazor } from '@syncfusion/ej2-base';
import { remove } from '@syncfusion/ej2-base';
import { ContextMenu as Menu, MenuItemModel, MenuEventArgs } from '@syncfusion/ej2-navigations';
import { ServiceLocator } from './service';
import { BeforeOpenCloseMenuEventArgs, OpenCloseMenuEventArgs } from '@syncfusion/ej2-navigations';
import { Diagram } from '../diagram';
import { contextMenuClick, contextMenuOpen, contextMenuBeforeItemRender } from '../enum/enum';
import { ContextMenuItemModel, DiagramMenuEventArgs } from './interface/interfaces';
import { DiagramBeforeMenuOpenEventArgs } from '../../diagram/objects/interface/interfaces';
import { createHtmlElement } from '../../diagram/utility/dom-util';

/**
 * @private
 */
export const menuClass: ContextMenuClassList = {
    content: '.e-diagramcontent',
    copy: 'e-copy',
    paste: 'e-paste',
    undo: 'e-undo',
    redo: 'e-redo',
    cut: 'e-cut',
    selectAll: 'e-selectall',
    grouping: 'e-grouping',
    group: 'e-group',
    unGroup: 'e-ungroup',
    bringToFront: 'e-bringfront',
    sendToBack: 'e-sendback',
    moveForward: 'e-bringforward',
    sendBackward: 'e-sendbackward',
    order: 'e-order'
};

/**
 * @private
 */
export interface ContextMenuClassList {
    copy: string;
    paste: string;
    content: string;
    undo: string;
    redo: string;
    cut: string;
    selectAll: string;
    grouping: string;
    group: string;
    unGroup: string;
    bringToFront: string;
    sendToBack: string;
    moveForward: string;
    sendBackward: string;
    order: string;
}

/**
 * 'ContextMenu module used to handle context menu actions.'
 *
 * @private
 */
export class DiagramContextMenu {
    //internal variables
    private element: HTMLUListElement;
    /**   @private  */
    public contextMenu: Menu;
    private defaultItems: { [key: string]: ContextMenuItemModel } = {};
    /**
     * @private
     */
    public disableItems: string[] = [];
    /**
     * @private
     */
    public hiddenItems: string[] = [];
    // module declarations
    private parent: Diagram;
    private l10n: L10n;
    private serviceLocator: ServiceLocator;
    private localeText: { [key: string]: string } = this.setLocaleKey();
    private eventArgs: Event;
    /**
     * @private
     */
    public isOpen: boolean;



    constructor(parent?: Diagram, service?: ServiceLocator) {
        this.parent = parent;
        this.serviceLocator = service;
        this.addEventListener();
    }
    /**
     * addEventListener method \
     *
     * @returns { void } addEventListener method .\
     *
     * @private
     */
    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on('initial-load', this.render, this);
    }

    /**
     * removeEventListener method \
     *
     * @returns { void } removeEventListener method .\
     *
     * @private
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off('initial-load', this.render);
    }

    private render(): void {
        this.l10n = this.serviceLocator.getService<L10n>('localization');
        if (!isBlazor()) {
            this.element = createHtmlElement('ul', { id: this.parent.element.id + '_contextMenu' }) as HTMLUListElement;
            this.parent.element.appendChild(this.element);
            const target: string = '#' + this.parent.element.id;
            this.contextMenu = new Menu({
                items: this.getMenuItems(),
                enableRtl: this.parent.enableRtl,
                enablePersistence: this.parent.enablePersistence,
                locale: this.parent.locale,
                target: target,
                select: this.contextMenuItemClick.bind(this),
                beforeOpen: this.contextMenuBeforeOpen.bind(this),
                onOpen: this.contextMenuOpen.bind(this),
                beforeItemRender: this.BeforeItemRender.bind(this),
                onClose: this.contextMenuOnClose.bind(this),
                cssClass: 'e-diagram-menu',
                animationSettings: { effect: 'None' }
            });
            this.contextMenu.appendTo(this.element);
        }
    }

    private getMenuItems(): ContextMenuItemModel[] {
        const menuItems: MenuItemModel[] = [];
        const orderItems: MenuItemModel[] = [];
        const groupItems: MenuItemModel[] = [];
        if (!this.parent.contextMenuSettings.showCustomMenuOnly) {
            for (const item of this.getDefaultItems()) {
                if (item.toLocaleLowerCase().indexOf('group') !== -1) {
                    if (item.toLocaleLowerCase() !== 'grouping') {
                        groupItems.push(this.buildDefaultItems(item));
                    }
                } else if (item.toLocaleLowerCase().indexOf('order') !== -1) {
                    if (item.toLocaleLowerCase() !== 'order') {
                        orderItems.push(this.buildDefaultItems(item));
                    }
                } else {
                    menuItems.push(this.buildDefaultItems(item));
                }
            }
            if (groupItems.length > 0) {
                const orderGroup: ContextMenuItemModel = this.buildDefaultItems('grouping');
                orderGroup.items = groupItems;
                menuItems.push(orderGroup);
            }
            if (orderItems.length > 0) {
                const orderGroup: ContextMenuItemModel = this.buildDefaultItems('order');
                orderGroup.items = orderItems;
                menuItems.push(orderGroup);
            }
        }
        if (this.parent.contextMenuSettings.items) {
            for (const customItem of this.parent.contextMenuSettings.items) {
                menuItems.push(customItem);
            }
        }

        return menuItems;
    }

    private contextMenuOpen(): void {
        this.isOpen = true;
    }

    private BeforeItemRender(args: MenuEventArgs): void {
        this.parent.trigger(contextMenuBeforeItemRender, args);
    }

    private contextMenuItemClick(args: DiagramMenuEventArgs): void {
        document.getElementById(this.parent.element.id + 'content').focus();
        this.parent.trigger(contextMenuClick, args);
        const item: string = this.getKeyFromId(args.item.id);
        if (!args.cancel) {
            switch (item) {
            case 'cut':
                this.parent.cut();
                break;
            case 'copy':
                this.parent.copy();
                break;
            case 'undo':
                this.parent.undo();
                break;
            case 'redo':
                this.parent.redo();
                break;
            case 'paste':
                this.parent.paste();
                break;
            case 'selectAll':
                this.parent.selectAll();
                break;
            case 'group':
                this.parent.group();
                break;
            case 'unGroup':
                this.parent.unGroup();
                break;
            case 'bringToFrontOrder':
                this.parent.bringToFront();
                break;
            case 'moveForwardOrder':
                this.parent.moveForward();
                break;
            case 'sendToBackOrder':
                this.parent.sendToBack();
                break;
            case 'sendBackwardOrder':
                this.parent.sendBackward();
                break;
            }
        }
    }

    private contextMenuOnClose(args: OpenCloseMenuEventArgs): void {
        const parent: string = 'parentObj';
        if (args.items.length > 0 && args.items[0][parent] instanceof Menu) {
            this.updateItemStatus();
        }
    }
    private getLocaleText(item: string): string {
        return this.l10n.getConstant(this.localeText[item]);
    }

    private updateItemStatus(): void {
        this.contextMenu.showItems(this.hiddenItems, true);
        this.contextMenu.enableItems(this.disableItems, false, true);
        this.hiddenItems = [];
        this.disableItems = [];
        this.isOpen = false;
    }

    /**
     * ensureItems method \
     *
     * @returns { void } ensureItems method .\
     * @param {MenuItemModel} item - provide the item value.
     * @param {Event} event - provide the event value.
     *
     * @private
     */
    public ensureItems(item: MenuItemModel, event?: Event): void {
        const key: string = this.getKeyFromId(item.id);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const dItem: ContextMenuItemModel = this.defaultItems[key];
        if (this.getDefaultItems().indexOf(key) !== -1) {
            if ((item as ContextMenuItemModel).target && (event || this.parent.checkMenu) &&
                !this.ensureTarget(item)) {
                this.hiddenItems.push(item.id);
            }
        }
    }
    /**
     * refreshItems method \
     *
     * @returns { void } refreshItems method .\
     *
     * @private
     */
    public refreshItems(): void {
        this.updateItems();
        this.contextMenu.refresh();
    }


    private updateItems(): void {
        let canInsert: boolean = true;
        for (let i: number = 0; i < this.parent.contextMenuSettings.items.length; i++) {
            const items: ContextMenuItemModel = this.parent.contextMenuSettings.items[i];
            for (let j: number = 0; j < this.contextMenu.items.length; j++) {
                if (this.contextMenu.items[j].text === this.parent.contextMenuSettings.items[i].text) {
                    canInsert = false;
                }
            }
            if (canInsert) {
                this.contextMenu.insertAfter([items], this.contextMenu.items[this.contextMenu.items.length - 1].text);

            }
        }
    }
    private async contextMenuBeforeOpen(args: BeforeOpenCloseMenuEventArgs): Promise<void> {
        if (!this.parent.checkMenu &&
            (window.navigator.userAgent.indexOf('Linux') !== -1 || window.navigator.userAgent.indexOf('X11') !== -1)) {
            this.parent.checkMenu = args.cancel = true;
        }
        if (this.parent.checkMenu) { this.hiddenItems = []; }
        let diagramArgs: DiagramBeforeMenuOpenEventArgs = args as DiagramBeforeMenuOpenEventArgs;
        diagramArgs.hiddenItems = [];
        for (const item of args.items) {
            this.ensureItems(item, args.event);
            if (item.items.length) {
                for (const newItem of item.items) {
                    this.ensureItems(newItem, args.event);
                }
            }
        }
        this.eventArgs = args.event;
        if (isBlazor()) {
            diagramArgs =
                (await this.parent.trigger(contextMenuOpen, diagramArgs) as DiagramBeforeMenuOpenEventArgs) || diagramArgs;
            if (typeof diagramArgs === 'string') {
                diagramArgs = JSON.parse(diagramArgs);
            }
        } else {
            this.parent.trigger(contextMenuOpen, diagramArgs);
        }
        let hidden: boolean = true;
        this.hiddenItems = this.hiddenItems.concat(diagramArgs.hiddenItems);
        this.contextMenu.enableItems(this.disableItems, false, true);
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const contextItems: DiagramContextMenu = this;
        for (let i: number = 0; i < args.items.length; i++) {
            const item: MenuItemModel = args.items[i];
            if (contextItems.hiddenItems.indexOf(item.id) > -1) {
                contextItems.contextMenu.hideItems([item.id], true);
            }
        }
        for (let i: number = 0; i < contextItems.contextMenu.items.length; i++) {
            const item: MenuItemModel = contextItems.contextMenu.items[i];
            if (contextItems.hiddenItems.indexOf(item.id) === -1) {
                hidden = false;
                contextItems.contextMenu.showItems([item.id], true);
            }
        }
        if (hidden) {
            diagramArgs.cancel = hidden;
            this.hiddenItems = [];
        }
        /* tslint:disable */
        if (this.parent.selectedItems.nodes.length && (this.parent.selectedItems.nodes[0] as any).isPhase) {
            args.cancel = true;
        }
        /* tslint:enable */
    }

    private ensureTarget(item: MenuItemModel): boolean {
        const selectedLength: number = this.parent.selectedItems.nodes.length +
            this.parent.selectedItems.connectors.length;
        const itemText: string = this.getKeyFromId(item.id);
        let target: boolean = false;
        switch (itemText) {
        case 'undo':
            target = this.parent.historyManager && this.parent.historyManager.canUndo ? true : false;
            break;
        case 'redo':
            target = this.parent.historyManager && this.parent.historyManager.canRedo ? true : false;
            break;
        case 'paste':
            target = this.parent.commandHandler.clipboardData.clipObject ? true : false;
            break;
        case 'selectAll':
            target = this.parent.nodes.length + this.parent.connectors.length ? true : false;
            break;
        case 'grouping':
            target = ((selectedLength > 1) || (this.parent.selectedItems.nodes[0] && this.parent.selectedItems.nodes[0].children
                    && this.parent.selectedItems.nodes[0].children.length > 1)) ? true : false;
            break;
        case 'group':
            target = selectedLength > 1;
            break;
        case 'unGroup':
            target = ((this.parent.selectedItems.nodes[0] && this.parent.selectedItems.nodes[0].children
                    && this.parent.selectedItems.nodes[0].children.length > 1)) ? true : false;
            break;
        case 'cut':
        case 'copy':
        case 'order':
        case 'bringToFrontOrder':
        case 'moveForwardOrder':
        case 'sendToBackOrder':
        case 'sendBackwardOrder':
            target = selectedLength ? true : false;
            break;
        }
        return target;
    }


    /**
     *To destroy the context menu
     *
     * @returns {void} To destroy the context menu
     */
    public destroy(): void {
        if (!isBlazor()) {
            this.contextMenu.destroy();
            remove(this.element);
        }
        this.removeEventListener();
    }


    private getModuleName(): string {
        return 'contextMenu';
    }

    private generateID(item: string): string {
        return this.parent.element.id + '_contextMenu_' + item;
    }

    private getKeyFromId(id: string): string {
        return id.replace(this.parent.element.id + '_contextMenu_', '');
    }

    private buildDefaultItems(item: string): ContextMenuItemModel {
        let menuItem: ContextMenuItemModel;
        switch (item) {
        case 'copy':
            menuItem = { target: menuClass.content, iconCss: menuClass.copy };
            break;
        case 'cut':
            menuItem = { target: menuClass.content, iconCss: menuClass.cut };
            break;
        case 'paste':
            menuItem = { target: menuClass.content, iconCss: menuClass.paste };
            break;
        case 'undo':
            menuItem = { target: menuClass.content, iconCss: menuClass.undo };
            break;
        case 'redo':
            menuItem = { target: menuClass.content, iconCss: menuClass.redo };
            break;
        case 'grouping':
            menuItem = { target: menuClass.content };
            break;
        case 'group':
            menuItem = { target: menuClass.content, iconCss: menuClass.group };
            break;
        case 'unGroup':
            menuItem = { target: menuClass.content, iconCss: menuClass.unGroup };
            break;
        case 'order':
            menuItem = { target: menuClass.content, iconCss: menuClass.order };
            break;
        case 'bringToFrontOrder':
            menuItem = { target: menuClass.content, iconCss: menuClass.bringToFront };
            break;
        case 'moveForwardOrder':
            menuItem = { target: menuClass.content, iconCss: menuClass.moveForward };
            break;
        case 'sendToBackOrder':
            menuItem = { target: menuClass.content, iconCss: menuClass.sendToBack };
            break;
        case 'sendBackwardOrder':
            menuItem = { target: menuClass.content, iconCss: menuClass.sendBackward };
            break;
        case 'selectAll':
            menuItem = { target: menuClass.content };
            break;
        }
        this.defaultItems[item] = {
            text: this.getLocaleText(item), id: this.generateID(item),
            target: menuItem.target, iconCss: menuItem.iconCss ? 'e-icons ' + menuItem.iconCss : ''
        };
        return this.defaultItems[item];
    }

    private getDefaultItems(): string[] {
        return [
            'copy',
            'cut', 'paste', 'undo', 'redo', 'selectAll', 'grouping', 'group', 'unGroup', 'order',
            'bringToFrontOrder', 'moveForwardOrder', 'sendToBackOrder', 'sendBackwardOrder'];
    }
    private setLocaleKey(): { [key: string]: string } {
        return {
            'copy': 'Copy',
            'cut': 'Cut',
            'paste': 'Paste',
            'undo': 'Undo',
            'redo': 'Redo',
            'selectAll': 'SelectAll',
            'grouping': 'Grouping',
            'group': 'Group',
            'unGroup': 'UnGroup',
            'order': 'Order',
            'bringToFrontOrder': 'BringToFront',
            'moveForwardOrder': 'MoveForward',
            'sendToBackOrder': 'SendToBack',
            'sendBackwardOrder': 'SendBackward'
        };
    }
}
