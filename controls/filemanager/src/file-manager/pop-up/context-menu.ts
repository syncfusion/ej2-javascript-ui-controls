import { ContextMenu as Menu, BeforeOpenCloseMenuEventArgs, MenuItemModel } from '@syncfusion/ej2-navigations';
import { IFileManager, MenuClickEventArgs, MenuOpenEventArgs, NotifyArgs } from '../base/interface';
import { isNullOrUndefined as isNOU, KeyboardEventArgs, createElement, closest, KeyboardEvents } from '@syncfusion/ej2-base';
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
    private targetNodeElement: HTMLElement;
    // eslint-disable-next-line
    public menuItemData: object;
    /**
     * Constructor for the ContextMenu module
     *
     * @param {IFileManager} parent - Specifies the parent element.
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
            enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
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
            const iconSpan: HTMLElement = createElement('span');
            const element: HTMLElement = args.element;
            element.insertBefore(iconSpan, this.parent.view === 'LargeIcons' ? element.childNodes[1] : element.childNodes[0]);
            iconSpan.setAttribute('class', CLS.ICON_LARGE + ' ' + CLS.MENU_ICON);
        }
        if (args.item.id === this.getMenuId('detailsview')) {
            const iconSpan: HTMLElement = createElement('span');
            const element: HTMLElement = args.element;
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
        // eslint-disable-next-line
        let data: { [key: string]: Object };
        let treeFolder: boolean = false;
        let target: Element = args.event.target as Element;
        this.menuTarget = this.targetNodeElement = <HTMLElement>target;
        this.currentElement = args.element;
        if (target.classList.contains('e-spinner-pane')) {
            target = this.parent.navigationpaneModule.activeNode.getElementsByClassName(CLS.FULLROW)[0];
            this.menuTarget = this.targetNodeElement = <HTMLElement>target;
        }
        this.targetElement = this.parent.view === 'Details' ? closest(target, 'tr.e-row') as HTMLElement : target as HTMLElement;
        if (this.parent.enableVirtualization && (target.classList.contains('e-virtual-bottom') || target.classList.contains('e-virtualtable'))) {
            target = target.parentElement.closest("div");
        }
        const view: string = this.getTargetView(target);
        this.updateActiveModule();
        /* istanbul ignore next */
        if (target.classList.contains(CLS.TREE_VIEW) || closest(target, 'th') ||
            (closest(target, '#' + this.parent.element.id + CLS.BREADCRUMBBAR_ID)) ||
            (closest(target, '#' + this.parent.element.id + CLS.TOOLBAR_ID))) {
            args.cancel = true;
            // eslint:disable-next-line
        } else if (!(this.parent.view === 'LargeIcons') && this.targetElement &&
            this.targetElement.classList.contains('e-emptyrow')) {
            this.setLayoutItem(target);
            /* istanbul ignore next */
        } else if (closest(target, '.' + CLS.EMPTY)) {
            this.setLayoutItem(target);
            // eslint:disable-next-line
        } else if (!target.classList.contains(CLS.MENU_ITEM) &&
         !target.classList.contains(CLS.MENU_ICON) && !target.classList.contains(CLS.SUBMENU_ICON)) {
            /* istanbul ignore next */
            // eslint:disable-next-line
            if (this.parent.view === 'LargeIcons' && !isNOU(closest(target, 'li')) && !closest(target, '#' + this.parent.element.id + CLS.TREE_ID)) {
                const eveArgs: KeyboardEventArgs = { ctrlKey: true, shiftKey: true } as KeyboardEventArgs;
                if (!closest(target, 'li').classList.contains('e-active')) {
                    this.parent.largeiconsviewModule.doSelection(target, eveArgs);
                }
                // eslint-disable-next-line
                data = this.parent.visitedData as { [key: string]: Object };
                selected = true;
            } else if (!isNOU(closest(target, 'tr.e-row'))) {
                uid = this.targetElement.getAttribute('data-uid');
                // eslint-disable-next-line
                data = this.parent.detailsviewModule.gridObj.getRowObjectFromUID(uid).data as { [key: string]: Object };
                if (isNOU(this.targetElement.getAttribute('aria-selected'))) {
                    /* istanbul ignore next */
                    this.parent.detailsviewModule.gridObj.selectRows([parseInt(this.targetElement.getAttribute('data-rowindex'), 10)]);
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
                // eslint:disable-next-line
            } else if (view === 'TreeView' || view === 'GridView' || view === 'LargeIcon') {
                this.setLayoutItem(target);
                /* istanbul ignore next */
            } else {
                args.cancel = true;
            }
        }
        const pasteEle: Element = select('#' + this.getMenuId('Paste'), this.contextMenu.element);
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
        const eventArgs: MenuOpenEventArgs = {
            fileDetails: [this.menuItemData],
            element: args.element,
            target: target,
            items: isSubMenu ? args.items : this.contextMenu.items,
            menuModule: this.contextMenu,
            cancel: false,
            menuType: this.menuType,
            isSubMenu: isSubMenu
        };
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
                this.menuTarget = this.targetNodeElement = this.currentElement = null;
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
    /**
     *
     * @param {Element} target - specifies the target element.
     * @returns {string} -returns the target view.
     * @hidden
     */
    public getTargetView(target: Element): string {
        return target.classList.contains(CLS.TREE_VIEW) ?
            'TreeView' : target.classList.contains(CLS.GRID_VIEW) ?
                'GridView' : target.classList.contains(CLS.ICON_VIEW) ?
                    'LargeIcon' : target.classList.contains(CLS.LARGE_ICONS) ?
                        'LargeIcon' : '';
    }

    public getItemIndex(item: string): number {
        const itemId: string = this.getMenuId(item);
        for (let i: number = 0; i < this.currentItems.length; i++) {
            if ((this.currentItems[i as number].id === itemId) || (this.currentItems[i as number].id === item)) {
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
            if (this.checkValidItem(items[i as number]) === 1) {
                this.contextMenu.enableItems([this.getMenuId(items[i as number])], enable, isUniqueId);
            } else if (this.checkValidItem(items[i as number]) === 2) {
                this.contextMenu.enableItems([items[i as number]], enable, isUniqueId);
            }
        }
    }

    private setFolderItem(isTree: boolean): void {
        this.menuType = 'folder';
        this.contextMenu.items = this.getItemData(this.parent.contextMenuSettings.folder.map((item: string) => item.trim()));
        this.contextMenu.dataBind();
        if (isTree) {
        const selectedTreeNode: Element = select('[data-uid="'+this.parent.navigationpaneModule.treeObj.selectedNodes[0]+'"]', this.parent.navigationpaneModule.treeObj.element);
        if (this.parent.pathNames[this.parent.pathNames.length-1] === selectedTreeNode.querySelector('.e-list-text').innerHTML && this.parent.activeModule === 'navigationpane') {
            this.disabledItems.push('Open');
        }
        } else if (this.parent.selectedItems.length !== 1 && this.parent.activeModule !=='navigationpane') {
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

    // eslint-disable-next-line
    private getMenuItemData(): object {
        if (this.menuType === 'layout') {
            return getPathObject(this.parent);
        } else {
            // eslint-disable-next-line
            const args: { [key: string]: Object; } = { target: this.menuTarget };
            this.parent.notify(events.menuItemData, args);
            return this.parent.itemData[0];
        }
    }

    /* istanbul ignore next */
    private onSelect(args: MenuEventArgs): void {
        if (isNOU(args.item) || !args.item.id) { return; }
        const itemText: string = args.item.id.substr((this.parent.element.id + '_cm_').length);
        // eslint-disable-next-line
        let details: Object[];
        if (itemText === 'refresh' || itemText === 'newfolder' || itemText === 'upload') {
            details = [getPathObject(this.parent)];
            this.parent.itemData = details;
        } else {
            this.parent.notify(events.selectedData, {});
            if (this.parent.activeModule === 'navigationpane' && itemText === 'open') {
                details = [this.menuItemData];
            } else {
                details = this.parent.itemData;
            }
        }
        const eventArgs: MenuClickEventArgs = {
            cancel: false,
            element: args.element,
            fileDetails: details,
            item: args.item
        };
        this.parent.trigger('menuClick', eventArgs, (menuClickArgs: MenuClickEventArgs) => {
            let sItems: string[];
            if (!menuClickArgs.cancel) {
                // eslint:disable-next-line
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
                        if (!hasEditAccess(details[j as number])) {
                            createDeniedDialog(this.parent, details[j as number], events.permissionEdit);
                            return;
                        }
                    }
                    createDialog(this.parent, 'Delete');
                    break;
                    /* istanbul ignore next */
                case 'download':
                    for (let i: number = 0; i < details.length; i++) {
                        if (!hasDownloadAccess(details[i as number])) {
                            createDeniedDialog(this.parent, details[i as number], events.permissionDownload);
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
                    if (this.parent.visitedItem && this.parent.activeModule !== 'navigationpane') {
                        this.parent.notify(events.openInit, { target: this.parent.visitedItem });
                    } else if (this.parent.activeModule === 'navigationpane') {
                        if (this.parent.visitedItem){
                            this.parent.notify(events.openInit, { target: this.parent.visitedItem });
                        }
                        this.parent.navigationpaneModule.openFileOnContextMenuClick(closest(this.targetNodeElement, 'li') as HTMLLIElement);
                    }
                    break;
                case 'details':
                    this.parent.notify(events.detailsInit, {});
                    sItems = this.parent.selectedItems;
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
                // eslint-disable-next-line no-fallthrough
                case 'size':
                /* istanbul ignore next */
                // eslint-disable-next-line no-fallthrough
                case 'date':
                /* istanbul ignore next */
                // eslint-disable-next-line no-fallthrough
                case 'ascending':
                /* istanbul ignore next */
                // eslint-disable-next-line no-fallthrough
                case 'descending':
                /* istanbul ignore next */
                    sortbyClickHandler(this.parent, args);
                    break;
                /* istanbul ignore next */
                case 'none':
                /* istanbul ignore next */
                    sortbyClickHandler(this.parent, args);
                    break;
                /* istanbul ignore next */
                // eslint:disable-next-line
                case 'largeiconsview':
                    updateLayout(this.parent, 'LargeIcons');
                    break;
                    /* istanbul ignore next */
                    // eslint:disable-next-line
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
        for (const prop of Object.keys(e.newProp)) {
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
                eventName: 'keydown'
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
     *
     * @returns {string} - returns the module name.
     * @private
     */
    private getModuleName(): string {
        return 'contextmenu';
    }

    private destroy(): void {
        if (this.parent.isDestroyed) { return; }
        this.removeEventListener();
        this.contextMenu.destroy();
        this.targetElement = null;
    }
    /* istanbul ignore next */
    private getItemData(data: string[]): MenuItemModel[] {
        const items: MenuItemModel[] = [];
        for (let i: number = 0; i < data.length; i++) {
            let item: MenuItemModel;
            const itemId: string = this.getMenuId(data[i as number]);
            const itemText: string = getLocaleText(this.parent, data[i as number]);
            switch (data[i as number]) {
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
                item = { id: itemId, text: itemText, iconCss: CLS.ICON_DELETE }; break;
            case 'Rename':
                item = { id: itemId, text: itemText, iconCss: CLS.ICON_RENAME }; break;
            case 'NewFolder':
                item = { id: itemId, text: itemText, iconCss: CLS.ICON_NEWFOLDER }; break;
            case 'Details':
                item = { id: itemId, text: itemText, iconCss: CLS.ICON_DETAILS }; break;
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
                        },
                        {
                            id: this.getMenuId('None'), text: getLocaleText(this.parent, 'None'),
                            iconCss: this.parent.sortOrder === 'None' ? CLS.TB_OPTION_TICK : null
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
