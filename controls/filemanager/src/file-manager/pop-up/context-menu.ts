import { ContextMenu as Menu, BeforeOpenCloseMenuEventArgs, MenuItemModel } from '@syncfusion/ej2-navigations';
import { IFileManager, MenuClickEventArgs, MenuOpenEventArgs, NotifyArgs } from '../base/interface';
import { isNullOrUndefined as isNOU, KeyboardEventArgs, createElement, closest, KeyboardEvents, isBlazor } from '@syncfusion/ej2-base';
import { getValue, select } from '@syncfusion/ej2-base';
import { MenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { Download, GetDetails } from './../common/operations';
import { createDialog } from './dialog';
import { cutFiles, copyFiles, refresh, getPathObject, getLocaleText, updateLayout, getFullPath } from './../common/utility';
import { getCssClass, sortbyClickHandler, pasteHandler } from './../common/utility';
import { createDeniedDialog, createNewFolder, uploadItem, hasEditAccess, hasDownloadAccess } from './../common/utility';
import * as events from './../base/constant';
import * as CLS from '../base/classes';

/**
 * ContextMenu module
 */
export class ContextMenu {
    private parent: IFileManager;
    private targetElement: HTMLElement;
    public contextMenu: Menu;
    public menuTarget: HTMLElement;
    private keyConfigs: { [key: string]: string };
    private keyboardModule: KeyboardEvents;
    private menuType: string;
    private currentItems: MenuItemModel[] = [];
    private currentElement: HTMLElement = null;
    private disabledItems: string[] = [];
    public menuItemData: object;
    /**
     * Constructor for the ContextMenu module
     * @hidden
     */
    constructor(parent?: IFileManager) {
        this.parent = parent;
        this.render();
    }

    private render(): void {
        this.keyConfigs = {
            downarrow: 'downarrow',
            uparrow: 'uparrown'
        };
        this.contextMenu = new Menu({
            enableRtl: this.parent.enableRtl,
            locale: this.parent.locale,
            target: '#' + this.parent.element.id,
            beforeItemRender: this.onBeforeItemRender.bind(this),
            select: this.onSelect.bind(this),
            beforeOpen: this.onBeforeOpen.bind(this),
            beforeClose: this.onBeforeClose.bind(this),
            cssClass: getCssClass(this.parent, CLS.ROOT_POPUP)
        });
        this.contextMenu.isStringTemplate = true;
        this.contextMenu.appendTo('#' + this.parent.element.id + CLS.CONTEXT_MENU_ID);
        this.addEventListener();
    }

    /* istanbul ignore next */
    public onBeforeItemRender(args: MenuEventArgs): void {
        if (args.item.id === this.getMenuId('largeiconsview')) {
            let iconSpan: HTMLElement = createElement('span');
            let element: HTMLElement = args.element;
            element.insertBefore(iconSpan, this.parent.view === 'LargeIcons' ? element.childNodes[1] : element.childNodes[0]);
            iconSpan.setAttribute('class', CLS.ICON_LARGE + ' ' + CLS.MENU_ICON);
        }
        if (args.item.id === this.getMenuId('detailsview')) {
            let iconSpan: HTMLElement = createElement('span');
            let element: HTMLElement = args.element;
            element.insertBefore(iconSpan, this.parent.view === 'Details' ? element.childNodes[1] : element.childNodes[0]);
            iconSpan.setAttribute('class', CLS.ICON_GRID + ' ' + CLS.MENU_ICON);
        }
    }

    public onBeforeClose(): void {
        this.menuTarget = null;
    }

    /* istanbul ignore next */
    public onBeforeOpen(args: BeforeOpenCloseMenuEventArgs): void {
        this.disabledItems = [];
        let selected: boolean = false;
        let uid: string;
        // tslint:disable-next-line
        let data: { [key: string]: Object };
        let treeFolder: boolean = false;
        let target: Element = args.event.target as Element;
        this.menuTarget = <HTMLElement>target;
        this.currentElement = args.element;
        if (target.classList.contains('e-spinner-pane')) {
            target = this.parent.navigationpaneModule.activeNode.getElementsByClassName(CLS.FULLROW)[0];
            this.menuTarget = <HTMLElement>target;
        }
        if (target.classList.contains(CLS.FULLROW)) {
            this.parent.selectedItems.length = 0;
        }
        this.targetElement = this.parent.view === 'Details' ? closest(target, 'tr') as HTMLElement : target as HTMLElement;
        let view: string = this.getTargetView(target);
        this.updateActiveModule();
        /* istanbul ignore next */
        if (target.classList.contains(CLS.TREE_VIEW) || closest(target, 'th') ||
            (closest(target, '#' + this.parent.element.id + CLS.BREADCRUMBBAR_ID)) ||
            (closest(target, '#' + this.parent.element.id + CLS.TOOLBAR_ID))) {
            args.cancel = true;
            // tslint:disable-next-line
        } else if (!(this.parent.view === 'LargeIcons') && this.targetElement &&
            this.targetElement.classList.contains('e-emptyrow')) {
            this.setLayoutItem(target);
            /* istanbul ignore next */
        } else if (closest(target, '.' + CLS.EMPTY)) {
            this.setLayoutItem(target);
            // tslint:disable-next-line
        } else if (!target.classList.contains(CLS.MENU_ITEM) && !target.classList.contains(CLS.MENU_ICON) && !target.classList.contains(CLS.SUBMENU_ICON)) {
            /* istanbul ignore next */
            // tslint:disable-next-line
            if (this.parent.view === 'LargeIcons' && !isNOU(closest(target, 'li')) && !closest(target, '#' + this.parent.element.id + CLS.TREE_ID)) {
                let eveArgs: KeyboardEventArgs = { ctrlKey: true, shiftKey: true } as KeyboardEventArgs;
                if (!closest(target, 'li').classList.contains('e-active')) {
                    this.parent.largeiconsviewModule.doSelection(target, eveArgs);
                }
                data = this.parent.visitedData as { [key: string]: Object };
                selected = true;
            } else if (!isNOU(closest(target, 'tr'))) {
                uid = this.targetElement.getAttribute('data-uid');
                data = this.parent.detailsviewModule.gridObj.getRowObjectFromUID(uid).data as { [key: string]: Object };
                if (isNOU(this.targetElement.getAttribute('aria-selected'))) {
                    /* istanbul ignore next */
                    // tslint:disable-next-line
                    this.parent.detailsviewModule.gridObj.selectRows([parseInt(this.targetElement.getAttribute('aria-rowindex'), 10)])
                }
                selected = true;
                /* istanbul ignore next */
            } else if (closest(target, '#' + this.parent.element.id + CLS.TREE_ID)) {
                uid = closest(target, 'li').getAttribute('data-uid');
                treeFolder = true;
            }
            /* istanbul ignore next */
            if (selected) {
                if (getValue('isFile', data) === true) {
                    this.setFileItem();
                } else {
                    this.setFolderItem(false);
                }
                /* istanbul ignore next */
            } else if (treeFolder) {
                this.setFolderItem(true);
                if (uid === this.parent.pathId[0]) {
                    this.disabledItems.push('Delete', 'Rename', 'Cut', 'Copy');
                }
                /* istanbul ignore next */
                // tslint:disable-next-line
            } else if (view === 'TreeView' || view === 'GridView' || view === 'LargeIcon') {
                this.setLayoutItem(target);
                /* istanbul ignore next */
            } else {
                args.cancel = true;
            }
        }
        let pasteEle: Element = select('#' + this.getMenuId('Paste'), this.contextMenu.element);
        if (!args.cancel && !this.parent.enablePaste &&
            pasteEle && !pasteEle.classList.contains('e-disabled')) {
            this.disabledItems.push('Paste');
        }
        if (args.cancel) {
            this.menuTarget = this.currentElement = null;
            return;
        }
        this.contextMenu.dataBind();
        let isSubMenu: boolean = false;
        if (target.classList.contains(CLS.MENU_ITEM) ||
            target.classList.contains(CLS.MENU_ICON) || target.classList.contains(CLS.SUBMENU_ICON)) {
            isSubMenu = true;
        }
        this.menuItemData = isSubMenu ? this.menuItemData : this.getMenuItemData();
        let eventArgs: MenuOpenEventArgs = {
            fileDetails: [this.menuItemData],
            element: args.element,
            target: target,
            items: isSubMenu ? args.items : this.contextMenu.items,
            menuModule: this.contextMenu,
            cancel: false,
            menuType: this.menuType,
            isSubMenu: isSubMenu
        };
        if (isBlazor()) {
            this.enableItems(this.disabledItems, false, true);
            delete eventArgs.menuModule;
        }
        this.currentItems = eventArgs.items;
        this.parent.trigger('menuOpen', eventArgs, (menuOpenArgs: MenuOpenEventArgs) => {
            if (!isSubMenu) {
                this.contextMenu.dataBind();
                this.contextMenu.items = menuOpenArgs.items;
                this.contextMenu.dataBind();
            }
            this.enableItems(this.disabledItems, false, true);
            args.cancel = menuOpenArgs.cancel;
            if (menuOpenArgs.cancel) {
                this.menuTarget = this.currentElement = null;
            }
        });
    }

    private updateActiveModule(): void {
        this.parent.activeModule = closest(this.menuTarget, '#' + this.parent.element.id + CLS.TREE_ID) ?
            'navigationpane' : closest(this.menuTarget, '#' + this.parent.element.id + CLS.GRID_ID) ?
                'detailsview' : closest(this.menuTarget, '#' + this.parent.element.id + CLS.LARGEICON_ID) ?
                    'largeiconsview' : this.parent.activeModule;
    }

    /* istanbul ignore next */
    /** @hidden */
    public getTargetView(target: Element): string {
        return target.classList.contains(CLS.TREE_VIEW) ?
            'TreeView' : target.classList.contains(CLS.GRID_VIEW) ?
                'GridView' : target.classList.contains(CLS.ICON_VIEW) ?
                    'LargeIcon' : target.classList.contains(CLS.LARGE_ICONS) ?
                        'LargeIcon' : '';
    }

    public getItemIndex(item: string): number {
        let itemId: string = this.getMenuId(item);
        for (let i: number = 0; i < this.currentItems.length; i++) {
            if ((this.currentItems[i].id === itemId) || (this.currentItems[i].id === item)) {
                return i;
            }
        }
        return -1;
    }

    public disableItem(items: string[]): void {
        if (items.length !== 0) {
            this.disabledItems = this.disabledItems.concat(items);
        }
    }

    private enableItems(items: string[], enable?: boolean, isUniqueId?: boolean): void {
        for (let i: number = 0; i < items.length; i++) {
            if (this.checkValidItem(items[i]) === 1) {
                this.contextMenu.enableItems([this.getMenuId(items[i])], enable, isUniqueId);
            } else if (this.checkValidItem(items[i]) === 2) {
                this.contextMenu.enableItems([items[i]], enable, isUniqueId);
            }
        }
    }

    private setFolderItem(isTree: boolean): void {
        this.menuType = 'folder';
        this.contextMenu.items = this.getItemData(this.parent.contextMenuSettings.folder.map((item: string) => item.trim()));
        this.contextMenu.dataBind();
        if (isTree) {
            this.disabledItems.push('Open');
        } else if (this.parent.selectedItems.length !== 1) {
            this.disabledItems.push('Rename', 'Paste');
        }
    }

    private setFileItem(): void {
        this.menuType = 'file';
        this.contextMenu.items = this.getItemData(this.parent.contextMenuSettings.file.map((item: string) => item.trim()));
        this.contextMenu.dataBind();
        if (this.parent.selectedItems.length !== 1) {
            this.disabledItems.push('Rename');
        }
    }

    private setLayoutItem(target: Element): void {
        this.menuType = 'layout';
        this.contextMenu.items = this.getItemData(this.parent.contextMenuSettings.layout.map((item: string) => item.trim()));
        this.contextMenu.dataBind();
        if (!this.parent.allowMultiSelection || ((this.parent.view === 'LargeIcons' &&
            (closest(target, '#' + this.parent.element.id + CLS.LARGEICON_ID).getElementsByClassName(CLS.EMPTY).length !== 0))
            || (this.parent.view === 'Details' &&
                (closest(target, '#' + this.parent.element.id + CLS.GRID_ID).getElementsByClassName(CLS.EMPTY).length !== 0)))) {
            this.disabledItems.push('SelectAll');
        }
        if (this.parent.selectedNodes.length === 0) {
            this.disabledItems.push('Paste');
        }
        this.contextMenu.dataBind();
    }

    private checkValidItem(nameEle: string): number {
        if (!isNOU(select('#' + this.getMenuId(nameEle), this.currentElement))) {
            return 1;
        } else if (!isNOU(select('#' + nameEle, this.currentElement))) {
            return 2;
        } else {
            return -1;
        }
    }

    private getMenuItemData(): object {
        if (this.menuType === 'layout') {
            return getPathObject(this.parent);
        } else {
            let args: { [key: string]: Object; } = { target: this.menuTarget };
            this.parent.notify(events.menuItemData, args);
            return this.parent.itemData[0];
        }
    }

    /* istanbul ignore next */
    private onSelect(args: MenuEventArgs): void {
        if (isNOU(args.item) || !args.item.id) { return; }
        let itemText: string = args.item.id.substr((this.parent.element.id + '_cm_').length);
        let details: Object[];
        if (itemText === 'refresh' || itemText === 'newfolder' || itemText === 'upload') {
            details = [getPathObject(this.parent)];
            this.parent.itemData = details;
        } else {
            this.parent.notify(events.selectedData, {});
            details = this.parent.itemData;
        }
        let eventArgs: MenuClickEventArgs = {
            cancel: false,
            element: args.element,
            fileDetails: details,
            item: args.item
        };
        this.parent.trigger('menuClick', eventArgs, (menuClickArgs: MenuClickEventArgs) => {
            if (!menuClickArgs.cancel) {
                // tslint:disable-next-line
                switch (itemText) {
                    case 'cut':
                        cutFiles(this.parent);
                        break;
                    case 'copy':
                        copyFiles(this.parent);
                        break;
                    case 'paste':
                        if (this.menuType === 'folder') {
                            if ((this.parent.activeModule === 'largeiconsview') || (this.parent.activeModule === 'detailsview')) {
                                this.parent.folderPath = getFullPath(this.parent, this.menuItemData, this.parent.path);
                            } else {
                                this.parent.folderPath = '';
                            }
                        } else {
                            this.parent.folderPath = '';
                        }
                        pasteHandler(this.parent);
                        break;
                    case 'delete':
                        for (let j: number = 0; j < details.length; j++) {
                            if (!hasEditAccess(details[j])) {
                                createDeniedDialog(this.parent, details[j], events.permissionEdit);
                                return;
                            }
                        }
                        createDialog(this.parent, 'Delete');
                        break;
                    /* istanbul ignore next */
                    case 'download':
                        for (let i: number = 0; i < details.length; i++) {
                            if (!hasDownloadAccess(details[i])) {
                                createDeniedDialog(this.parent, details[i], events.permissionDownload);
                                return;
                            }
                        }
                        if (this.parent.activeModule === 'navigationpane') {
                            this.parent.notify(events.downloadInit, {});
                        } else if (this.parent.selectedItems.length > 0) {
                            Download(this.parent, this.parent.path, this.parent.selectedItems);
                        }
                        break;
                    case 'rename':
                        if (!hasEditAccess(details[0])) {
                            createDeniedDialog(this.parent, details[0], events.permissionEdit);
                        } else {
                            this.parent.notify(events.renameInit, {});
                            createDialog(this.parent, 'Rename');
                        }
                        break;
                    case 'selectall':
                        /* istanbul ignore next */
                        this.parent.notify(events.selectAllInit, {});
                        break;
                    case 'refresh':
                        refresh(this.parent);
                        break;
                    case 'open':
                        if (this.parent.visitedItem) {
                            this.parent.notify(events.openInit, { target: this.parent.visitedItem });
                        }
                        break;
                    case 'details':
                        this.parent.notify(events.detailsInit, {});
                        let sItems: string[] = this.parent.selectedItems;
                        if (this.parent.activeModule === 'navigationpane') {
                            sItems = [];
                        }
                        GetDetails(this.parent, sItems, this.parent.path, 'details');
                        break;
                    case 'newfolder':
                        createNewFolder(this.parent);
                        break;
                    case 'upload':
                        uploadItem(this.parent);
                        break;
                    /* istanbul ignore next */
                    case 'name':
                    /* istanbul ignore next */
                    case 'size':
                    /* istanbul ignore next */
                    case 'date':
                    /* istanbul ignore next */
                    case 'ascending':
                    /* istanbul ignore next */
                    case 'descending':
                        /* istanbul ignore next */
                        sortbyClickHandler(this.parent, args);
                        break;
                    // tslint:disable-next-line
                    /* istanbul ignore next */
                    case 'largeiconsview':
                        updateLayout(this.parent, 'LargeIcons');
                        break;
                    // tslint:disable-next-line
                    /* istanbul ignore next */
                    case 'detailsview':
                        updateLayout(this.parent, 'Details');
                        break;
                }
            }
        });
    }

    private onPropertyChanged(e: NotifyArgs): void {
        if (e.module !== this.getModuleName() && e.module !== 'common') {
            /* istanbul ignore next */
            return;
        }
        for (let prop of Object.keys(e.newProp)) {
            switch (prop) {
                case 'cssClass':
                    this.contextMenu.cssClass = getCssClass(this.parent, CLS.ROOT_POPUP);
                    break;
            }
        }
    }

    private addEventListener(): void {
        this.parent.on(events.destroy, this.destroy, this);
        this.parent.on(events.modelChanged, this.onPropertyChanged, this);
        this.keyboardModule = new KeyboardEvents(
            this.contextMenu.element,
            {
                keyAction: this.keyActionHandler.bind(this),
                keyConfigs: this.keyConfigs,
                eventName: 'keydown',
            }
        );
    }

    private removeEventListener(): void {
        this.parent.off(events.destroy, this.destroy);
        this.parent.off(events.modelChanged, this.onPropertyChanged);
        this.keyboardModule.destroy();
    }
    private keyActionHandler(e: KeyboardEventArgs): void {
        switch (e.action) {
            case 'uparrow':
            case 'downarrow':
                e.preventDefault();
        }
    }

    /**
     * For internal use only - Get the module name.
     * @private
     */
    private getModuleName(): string {
        return 'contextmenu';
    }

    private destroy(): void {
        if (this.parent.isDestroyed) { return; }
        this.removeEventListener();
        this.contextMenu.destroy();
    }
    /* istanbul ignore next */
    private getItemData(data: string[]): MenuItemModel[] {
        let items: MenuItemModel[] = [];
        for (let i: number = 0; i < data.length; i++) {
            let item: MenuItemModel;
            let itemId: string = this.getMenuId(data[i]);
            let itemText: string = getLocaleText(this.parent, data[i]);
            switch (data[i]) {
                case '|':
                    item = { separator: true };
                    break;
                case 'Open':
                    item = { id: itemId, text: itemText, iconCss: CLS.ICON_OPEN };
                    break;
                case 'Upload':
                    item = { id: itemId, text: itemText, iconCss: CLS.ICON_UPLOAD };
                    break;
                case 'Cut':
                    item = { id: itemId, text: itemText, iconCss: CLS.ICON_CUT };
                    break;
                case 'Copy':
                    item = { id: itemId, text: itemText, iconCss: CLS.ICON_COPY };
                    break;
                case 'Paste':
                    item = { id: itemId, text: itemText, iconCss: CLS.ICON_PASTE };
                    break;
                case 'Delete':
                    item = { id: itemId, text: itemText, iconCss: CLS.ICON_DELETE };
                    break;
                case 'Rename':
                    item = { id: itemId, text: itemText, iconCss: CLS.ICON_RENAME };
                    break;
                case 'NewFolder':
                    item = { id: itemId, text: itemText, iconCss: CLS.ICON_NEWFOLDER };
                    break;
                case 'Details':
                    item = { id: itemId, text: itemText, iconCss: CLS.ICON_DETAILS };
                    break;
                case 'SortBy':
                    item = {
                        id: itemId, text: itemText, iconCss: CLS.ICON_SHORTBY,
                        items: [
                            {
                                id: this.getMenuId('Name'), text: getLocaleText(this.parent, 'Name'),
                                iconCss: this.parent.sortBy === 'name' ? CLS.TB_OPTION_DOT : null
                            },
                            {
                                id: this.getMenuId('Size'), text: getLocaleText(this.parent, 'Size'),
                                iconCss: this.parent.sortBy === 'size' ? CLS.TB_OPTION_DOT : null
                            },
                            {
                                id: this.getMenuId('Date'), text: getLocaleText(this.parent, 'DateModified'),
                                iconCss: this.parent.sortBy === '_fm_modified' ? CLS.TB_OPTION_DOT : null
                            },
                            { separator: true },
                            {
                                id: this.getMenuId('Ascending'), text: getLocaleText(this.parent, 'Ascending'),
                                iconCss: this.parent.sortOrder === 'Ascending' ? CLS.TB_OPTION_TICK : null
                            },
                            {
                                id: this.getMenuId('Descending'), text: getLocaleText(this.parent, 'Descending'),
                                iconCss: this.parent.sortOrder === 'Descending' ? CLS.TB_OPTION_TICK : null
                            }
                        ]
                    };
                    break;
                /* istanbul ignore next */
                case 'View':
                    item = {
                        id: itemId, text: itemText, iconCss: this.parent.view === 'Details' ? CLS.ICON_GRID : CLS.ICON_LARGE,
                        items: [
                            {
                                id: this.getMenuId('largeiconsview'), text: getLocaleText(this.parent, 'View-LargeIcons'),
                                iconCss: this.parent.view === 'Details' ? null : CLS.TB_OPTION_TICK
                            },
                            {
                                id: this.getMenuId('detailsview'), text: getLocaleText(this.parent, 'View-Details'),
                                iconCss: this.parent.view === 'Details' ? CLS.TB_OPTION_TICK : null
                            }
                        ]
                    };
                    break;
                case 'Refresh':
                    item = { id: itemId, text: itemText, iconCss: CLS.ICON_REFRESH };
                    break;
                case 'SelectAll':
                    item = { id: itemId, text: itemText, iconCss: CLS.ICON_SELECTALL };
                    break;
                /* istanbul ignore next */
                case 'Download':
                    item = { id: itemId, text: itemText, iconCss: CLS.ICON_DOWNLOAD };
                    break;
                /* istanbul ignore next */
                default:
                    item = { id: itemId, text: itemText };
                    break;
            }
            items.push(item);
        }
        return items;
    }

    private getMenuId(id: string): string {
        return this.parent.element.id + '_cm_' + id.toLowerCase();
    }
}