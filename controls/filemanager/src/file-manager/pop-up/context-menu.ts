import { ContextMenu as Menu, BeforeOpenCloseMenuEventArgs, TreeView, MenuItemModel } from '@syncfusion/ej2-navigations';
import { IFileManager, FileMenuClickEventArgs, FileMenuOpenEventArgs, NotifyArgs, viewType } from '../base/interface';
import { isNullOrUndefined, KeyboardEventArgs, createElement } from '@syncfusion/ej2-base';
import { MenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { Download, read } from './../common/operations';
import { createDialog } from './dialog';
import { cutFiles, copyFiles, removeBlur, refresh, getItemObject, getFileObject, getPathObject, getLocaleText } from './../common/utility';
import { getCssClass, sortbyClickHandler } from './../common/utility';
import * as events from './../base/constant';
import * as CLS from '../base/classes';

/**
 * ContextMenu module
 */
export class ContextMenu {
    private parent: IFileManager;
    private targetElement: HTMLElement;
    public contextMenu: Menu;

    /**
     * Constructor for the ContextMenu module
     * @hidden
     */
    constructor(parent?: IFileManager) {
        this.parent = parent;
        this.render();
    }

    private render(): void {
        this.contextMenu = new Menu({
            enableRtl: this.parent.enableRtl,
            locale: this.parent.locale,
            target: '#' + this.parent.element.id,
            beforeItemRender: this.onBeforeItemRender.bind(this),
            select: this.onSelect.bind(this),
            beforeOpen: this.onBeforeOpen.bind(this),
            cssClass: getCssClass(this.parent, CLS.ROOT_POPUP)
        });
        this.contextMenu.appendTo('#' + this.parent.element.id + CLS.CONTEXT_MENU_ID);
        this.addEventListener();
    }

    /* istanbul ignore next */
    public onBeforeItemRender(args: MenuEventArgs): void {
        if (args.item.id === this.getMenuId('largeiconsview')) {
            let iconSpan: HTMLElement = createElement('span');
            args.element.insertBefore(iconSpan, args.element.childNodes[1]);
            iconSpan.setAttribute('class', CLS.ICON_LARGE + ' ' + CLS.MENU_ICON);
        }
        if (args.item.id === this.getMenuId('detailsview')) {
            let iconSpan: HTMLElement = createElement('span');
            args.element.insertBefore(iconSpan, args.element.childNodes[1]);
            iconSpan.setAttribute('class', CLS.ICON_GRID + ' ' + CLS.MENU_ICON);
        }
    }

    /* istanbul ignore next */
    public onBeforeOpen(args: BeforeOpenCloseMenuEventArgs): void {
        let select: boolean = false;
        let uid: string;
        // tslint:disable-next-line
        let data: { [key: string]: Object };
        let treeFolder: boolean = false;
        let target: Element = args.event.target as Element;
        if (target.classList.contains('e-spinner-pane')) {
            target = this.parent.navigationpaneModule.activeNode.getElementsByClassName(CLS.FULLROW)[0];
        }
        if (target.classList.contains(CLS.FULLROW)) {
            this.parent.selectedItems.length = 0;
        }
        this.targetElement = this.parent.fileView === 'Details' ? target.closest('tr') as HTMLElement : target as HTMLElement;
        let view: string = this.getTargetView(target);
        /* istanbul ignore next */
        if (target.classList.contains(CLS.TREE_VIEW) || target.closest('th') ||
            (target.closest('#' + this.parent.element.id + CLS.BREADCRUMBBAR_ID))) {
            args.cancel = true;
            // tslint:disable-next-line
        } else if (!(this.parent.fileView === 'LargeIcons') && this.targetElement &&
            this.targetElement.classList.contains('e-emptyrow')) {
            this.setLayoutItem(target);
            //Paste
            // this.contextMenu.enableItems([this.getMenuId('Paste')], this.parent.enablePaste, true);
            /* istanbul ignore next */
        } else if (target.closest('.' + CLS.EMPTY)) {
            this.setLayoutItem(target);
            // tslint:disable-next-line
        } else if (!target.classList.contains(CLS.MENU_ITEM) && !target.classList.contains(CLS.MENU_ICON) && !target.classList.contains(CLS.SUBMENU_ICON)) {
            /* istanbul ignore next */
            // tslint:disable-next-line
            if (this.parent.fileView === 'LargeIcons' && !isNullOrUndefined(target.closest('li')) && !target.closest('#' + this.parent.element.id + CLS.TREE_ID)) {
                let eveArgs: KeyboardEventArgs = { ctrlKey: true, shiftKey: true } as KeyboardEventArgs;
                data = getItemObject(this.parent, this.targetElement.closest('li')) as { [key: string]: Object };
                if (!target.closest('li').classList.contains('e-active')) {
                    this.parent.largeiconsviewModule.doSelection(target, eveArgs);
                }
                select = true;
            } else if (!isNullOrUndefined(target.closest('tr'))) {
                uid = this.targetElement.getAttribute('data-uid');
                data = this.parent.detailsviewModule.gridObj.getRowObjectFromUID(uid).data as { [key: string]: Object };
                if (isNullOrUndefined(this.targetElement.getAttribute('aria-selected'))) {
                    /* istanbul ignore next */
                    // tslint:disable-next-line
                    this.parent.detailsviewModule.gridObj.selectRows([parseInt(this.targetElement.getAttribute('aria-rowindex'), 10)])
                }
                select = true;
                /* istanbul ignore next */
            } else if (target.closest('#' + this.parent.element.id + CLS.TREE_ID)) {
                treeFolder = true;
            }
            /* istanbul ignore next */
            if (select) {
                if (this.parent.fileView === 'LargeIcons') {
                    if (data.isFile === true) {
                        this.setFileItem(target);
                        if (target.closest('li') &&
                            (target.closest('li')).getElementsByClassName('e-list-img').length === 0) {
                            this.contextMenu.enableItems([this.getMenuId('Open')], false, true);
                        }
                    } else {
                        this.setFolderItem(false);
                    }
                    // tslint:disable-next-line
                } else if (data['isFile'] === true) {
                    this.setFileItem(target);
                    if (target.closest('tr') &&
                        (target.closest('tr')).getElementsByClassName(CLS.ICON_IMAGE).length === 0) {
                        this.contextMenu.enableItems([this.getMenuId('Open')], false, true);
                    }
                } else {
                    this.setFolderItem(false);
                }
                /* istanbul ignore next */
            } else if (treeFolder) {
                this.setFolderItem(true);
                /* istanbul ignore next */
                // tslint:disable-next-line
            } else if (view === 'TreeView' || view === 'GridView' || view === 'LargeIcon') {
                this.setLayoutItem(target);
                //Paste
                // this.contextMenu.enableItems([this.getMenuId('Paste')], this.parent.enablePaste, true);
                /* istanbul ignore next */
            } else {
                args.cancel = true;
            }
        }
        if (args.cancel) {
            return;
        }
        this.contextMenu.dataBind();
        let eventArgs: FileMenuOpenEventArgs = {
            fileDetails: getFileObject(this.parent),
            element: args.element,
            target: target,
            items: this.contextMenu.items,
            menuModule: this.contextMenu,
            cancel: false
        };
        this.parent.trigger('menuOpen', eventArgs);
        args.cancel = eventArgs.cancel;
        if (args.cancel) {
            return;
        }

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

    private setFolderItem(isTree: boolean): void {
        this.contextMenu.items = this.getItemData(this.parent.contextMenuSettings.folder);
        this.contextMenu.dataBind();
        if (isTree) {
            this.contextMenu.enableItems([this.getMenuId('Open')], false, true);
            this.contextMenu.enableItems([this.getMenuId('Download')], false, true);
        } else if (this.parent.selectedItems.length !== 1) {
            this.contextMenu.enableItems([this.getMenuId('Rename')], false, true);
        }
        //Paste
        // this.contextMenu.enableItems([this.getMenuId('Paste')], this.parent.enablePaste, true);
    }

    /* istanbul ignore next */
    private setFileItem(target: Element): void {
        this.contextMenu.items = this.getItemData(this.parent.contextMenuSettings.file);
        this.contextMenu.dataBind();
        if (this.parent.selectedItems.length !== 1) {
            this.contextMenu.enableItems([this.getMenuId('Rename')], false, true);
        }
    }

    private setLayoutItem(target: Element): void {
        this.contextMenu.items = this.getItemData(this.parent.contextMenuSettings.layout);
        this.contextMenu.dataBind();
        if ((this.parent.fileView === 'LargeIcons' &&
            (target.closest('#' + this.parent.element.id + CLS.LARGEICON_ID).getElementsByClassName(CLS.EMPTY).length !== 0))
            || (this.parent.fileView === 'Details' &&
                (target.closest('#' + this.parent.element.id + CLS.GRID_ID).getElementsByClassName(CLS.EMPTY).length !== 0))) {
            this.contextMenu.enableItems([this.getMenuId('SelectAll')], false, true);
            this.contextMenu.dataBind();
        }
    }

    /* istanbul ignore next */
    private onSelect(args: MenuEventArgs): void {
        if (isNullOrUndefined(args.item) || !args.item.id) { return; }
        let itemText: string = args.item.id.substr((this.parent.element.id + '_cm_').length);
        let details: Object;
        if (itemText === 'refresh' || itemText === 'newfolder') {
            details = getPathObject(this.parent);
            this.parent.itemData = [details];
        } else {
            details = getFileObject(this.parent);
        }
        let eventArgs: FileMenuClickEventArgs = {
            cancel: false,
            element: args.element,
            fileDetails: details,
            item: args.item
        };
        this.parent.trigger('menuClick', eventArgs);
        if (eventArgs.cancel) {
            return;
        }
        if (this.parent.selectedItems.length > 0 && (
            (itemText === 'paste') ||
            (itemText === 'upload'))) {
            let path: string;
            // tslint:disable-next-line
            let data: { [key: string]: Object };
            if (this.parent.fileView === 'Details') {
                let uid: string = this.targetElement.getAttribute('data-uid');
                data = this.parent.detailsviewModule.gridObj.getRowObjectFromUID(uid).data as { [key: string]: Object };
                /* istanbul ignore next */
            } else {
                let elements: Element = this.targetElement.parentElement;
                data = getItemObject(this.parent, elements) as { [key: string]: Object };
            }
            /* istanbul ignore next */
            if (data.isFile) {
                path = '';
            } else {
                path = data.name + '/';
                this.parent.navigationpaneModule.treeObj.selectedNodes = [data.id as string];
            }
            let newPath: string = this.parent.path + path;
            this.parent.setProperties({ path: newPath }, true);
        }
        // tslint:disable-next-line
        let items: Object[] = this.parent.selectedItems;
        switch (itemText) {
            case 'cut':
                cutFiles(this.parent as IFileManager);
                /* istanbul ignore next */
                if (this.parent.nodeNames) {
                    this.parent.fileOperation(this.parent.nodeNames);
                }
                break;
            case 'copy':
                copyFiles(this.parent as IFileManager);
                /* istanbul ignore next */
                if (this.parent.nodeNames) {
                    this.parent.fileOperation(this.parent.nodeNames);
                }
                /* istanbul ignore next */
                if (this.parent.activeModule === 'navigationpane') {
                    // tslint:disable-next-line
                    this.parent.navigationpaneModule.copyNodes = <{ [key: string]: Object[]; }[]>this.parent.nodeNames;
                }
                break;
            case 'paste':
                this.parent.pasteHandler();
                removeBlur(this.parent as IFileManager);
                break;
            case 'delete':
                createDialog(this.parent, 'Delete');
                break;
            /* istanbul ignore next */
            case 'download':
                /* istanbul ignore next */
                if (this.parent.activeModule === 'detailsview') {
                    items = this.parent.detailsviewModule.gridObj.getSelectedRecords();
                } else if (this.parent.activeModule === 'largeiconsview') {
                    let elements: NodeListOf<Element> = this.parent.activeElements;
                    for (let ele: number = 0; ele < elements.length; ele++) {
                        items[ele] = getItemObject(this.parent, elements[ele]);
                    }
                }
                if (items.length > 0) {
                    Download(this.parent, items);
                }
                break;
            case 'rename':
                this.parent.notify(events.renameInit, {});
                createDialog(this.parent, 'Rename');
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
                this.parent.getDetails();
                break;
            case 'newfolder':
                createDialog(this.parent, 'NewFolder');
                break;
            case 'upload':
                document.getElementById(this.parent.element.id + '_upload').click();
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
                this.changeLayout('LargeIcons');
                break;
            // tslint:disable-next-line
            /* istanbul ignore next */
            case 'detailsview':
                this.changeLayout('Details');
                break;
        }
    }
    /* istanbul ignore next */
    private changeLayout(view: viewType): void {
        if (this.parent.view !== view) {
            this.parent.setProperties({ view: view }, true);
            read(this.parent, events.layoutChange, this.parent.path);
        }
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
                case 'enableRtl':
                    this.contextMenu.enableRtl = e.newProp.enableRtl;
                    break;
            }
        }
    }

    private addEventListener(): void {
        this.parent.on(events.destroy, this.destroy, this);
        this.parent.on(events.modelChanged, this.onPropertyChanged, this);
    }

    private removeEventListener(): void {
        this.parent.off(events.destroy, this.destroy);
        this.parent.off(events.modelChanged, this.onPropertyChanged);
    }

    /**
     * For internal use only - Get the module name.
     * @private
     */
    private getModuleName(): string {
        return 'contextmenu';
    }

    /**
     * Destroys the ContextMenu module.
     * @method destroy
     * @return {void}
     */
    private destroy(): void {
        if (this.parent.isDestroyed) { return; }
        this.removeEventListener();
        this.contextMenu.destroy();
        if (document.getElementById(this.parent.element.id + CLS.CONTEXT_MENU_ID)) {
            document.getElementById(this.parent.element.id + CLS.CONTEXT_MENU_ID).remove();
        }
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
                                iconCss: this.parent.sortBy === 'name' ? CLS.TB_OPTION_DOT : ''
                            },
                            {
                                id: this.getMenuId('Size'), text: getLocaleText(this.parent, 'Size'),
                                iconCss: this.parent.sortBy === 'size' ? CLS.TB_OPTION_DOT : ''
                            },
                            {
                                id: this.getMenuId('Date'), text: getLocaleText(this.parent, 'DateModified'),
                                iconCss: this.parent.sortBy === 'dateModified' ? CLS.TB_OPTION_DOT : ''
                            },
                            { separator: true },
                            {
                                id: this.getMenuId('Ascending'), text: getLocaleText(this.parent, 'Ascending'),
                                iconCss: this.parent.sortOrder === 'Ascending' ? CLS.TB_OPTION_TICK : ''
                            },
                            {
                                id: this.getMenuId('Descending'), text: getLocaleText(this.parent, 'Descending'),
                                iconCss: this.parent.sortOrder === 'Descending' ? CLS.TB_OPTION_TICK : ''
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
                                iconCss: this.parent.view === 'Details' ? '' : CLS.TB_OPTION_TICK
                            },
                            {
                                id: this.getMenuId('detailsview'), text: getLocaleText(this.parent, 'View-Details'),
                                iconCss: this.parent.view === 'Details' ? CLS.TB_OPTION_TICK : ''
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