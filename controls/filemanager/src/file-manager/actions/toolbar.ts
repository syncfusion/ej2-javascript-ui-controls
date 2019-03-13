import { Toolbar as BaseToolbar, ItemModel, ClickEventArgs, MenuEventArgs, DisplayMode } from '@syncfusion/ej2-navigations';
import { select, selectAll, isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import { createDialog } from '../pop-up/dialog';
import * as events from '../base/constant';
import * as CLS from '../base/classes';
import { IFileManager, NotifyArgs, FileToolbarClickEventArgs, ReadArgs } from '../base/interface';
import { refresh, getFileObject, getItemObject, getPathObject, getLocaleText, getCssClass, sortbyClickHandler } from '../common/utility';
import { read, Download, Search } from '../common/operations';
import { DropDownButton, ItemModel as SplitButtonItemModel } from '@syncfusion/ej2-splitbuttons';
import { cutFiles, copyFiles } from '../common/index';

/**
 * `Toolbar` module is used to handle Toolbar actions.
 */
export class Toolbar {

    /* Internal variables */
    private parent: IFileManager;
    private items: ItemModel[];
    private buttonObj: DropDownButton;
    private layoutBtnObj: DropDownButton;
    private default: string[] = ['Delete', 'Rename', 'Download', 'Cut', 'Copy', 'Paste'];
    private single: string[] = ['Delete', 'Rename', 'Download', 'Cut', 'Copy'];
    private multiple: string[] = ['Delete', 'Download', 'Cut', 'Copy', 'Refresh'];
    private selection: string[] = ['NewFolder', 'Upload', 'SortBy', 'Refresh'];

    /* public variable */
    public toolbarObj: BaseToolbar;

    /**
     * Constructor for the Toolbar module
     * @hidden
     */
    constructor(parent?: IFileManager) {
        this.parent = parent;
        this.render();
        this.addEventListener();
    }

    private render(): void {
        this.items = this.toolbarItemData(this.getItems(this.parent.toolbarSettings.items));
        this.toolbarObj = new BaseToolbar({
            items: this.items,
            created: this.toolbarCreateHandler.bind(this),
            overflowMode: 'Popup',
            clicked: this.onClicked.bind(this),
            enableRtl: this.parent.enableRtl
        });
        this.toolbarObj.appendTo('#' + this.parent.element.id + CLS.TOOLBAR_ID);
    }

    private getItems(items: string[]): string[] {
        let currItems: string[] = items.slice();
        if (this.parent.isDevice && this.parent.allowMultiSelection) { currItems.push('SelectAll'); }
        return currItems;
    }
    /* istanbul ignore next */
    private onClicked(args: ClickEventArgs): void {
        if (isNOU(args.item) || !args.item.id) { return; }
        let tool: string = args.item.id.substr((this.parent.element.id + '_tb_').length);
        let details: Object;
        if (tool === 'refresh' || tool === 'newfolder') {
            details = getPathObject(this.parent);
            this.parent.itemData = [details];
        } else {
            details = getFileObject(this.parent);
        }
        let eventArgs: FileToolbarClickEventArgs = { cancel: false, fileDetails: details, item: args.item };
        this.parent.trigger('toolbarClick', eventArgs);
        if (eventArgs.cancel) { return; }
        switch (tool) {
            case 'newfolder':
                createDialog(this.parent, 'NewFolder');
                break;
            /* istanbul ignore next */
            case 'cut':
                cutFiles(this.parent as IFileManager);
                if (this.parent.nodeNames) {
                    this.parent.fileOperation(this.parent.nodeNames);
                }
                break;
            /* istanbul ignore next */
            case 'copy':
                copyFiles(this.parent as IFileManager);
                if (this.parent.nodeNames) {
                    this.parent.fileOperation(this.parent.nodeNames);
                }
                if (this.parent.activeModule === 'navigationPane') {
                    this.parent.navigationpaneModule.copyNodes = <{ [key: string]: Object[]; }[]>this.parent.nodeNames;
                }
                break;
            case 'delete':
                createDialog(this.parent, 'Delete');
                break;
            case 'details':
                this.parent.getDetails();
                break;
            /* istanbul ignore next */
            case 'paste':
                this.parent.pasteHandler();
                break;
            case 'refresh':
                refresh(this.parent);
                break;
            /* istanbul ignore next */
            case 'download':
                if (this.parent.selectedItems.length > 0) {
                    if (this.parent.fileView === 'LargeIcons') {
                        let elementRecords: Object[] = [];
                        let elements: Element[] = selectAll('.e-active', this.parent.largeiconsviewModule.listElements);
                        for (let ele: number = 0; ele < elements.length; ele++) {
                            elementRecords[ele] = getItemObject(this.parent, elements[ele]);
                        }
                        Download(this.parent, elementRecords);
                    } else {
                        Download(this.parent, this.parent.detailsviewModule.gridObj.getSelectedRecords());
                    }
                } else {
                    return;
                }
                break;
            case 'rename':
                this.parent.notify(events.renameInit, {});
                createDialog(this.parent, 'Rename');
                break;
            case 'upload':
                let uploadEle: HTMLElement = <HTMLElement>select('#' + this.parent.element.id + CLS.UPLOAD_ID, this.parent.element);
                uploadEle.click();
                break;
            case 'selectall':
                this.parent.notify(events.selectAllInit, {});
                break;
            case 'selection':
                this.parent.notify(events.clearAllInit, {});
                break;
        }
    }

    private toolbarCreateHandler(): void {
        if (!isNOU(select('#' + this.getId('SortBy'), this.parent.element))) {
            let items: SplitButtonItemModel[] = [
                { id: this.getPupupId('name'), text: getLocaleText(this.parent, 'Name'), iconCss: CLS.TB_OPTION_DOT },
                { id: this.getPupupId('size'), text: getLocaleText(this.parent, 'Size') },
                { id: this.getPupupId('date'), text: getLocaleText(this.parent, 'DateModified') },
                { separator: true },
                { id: this.getPupupId('ascending'), text: getLocaleText(this.parent, 'Ascending'), iconCss: CLS.TB_OPTION_TICK },
                { id: this.getPupupId('descending'), text: getLocaleText(this.parent, 'Descending'), }
            ];
            this.buttonObj = new DropDownButton({
                items: items, cssClass: getCssClass(this.parent, CLS.ROOT_POPUP),
                select: sortbyClickHandler.bind(this, this.parent as IFileManager),
                enableRtl: this.parent.enableRtl, iconCss: CLS.ICON_SHORTBY
            });
            this.buttonObj.appendTo('#' + this.getId('SortBy'));
        }
        if (!isNOU(select('#' + this.parent.element.id + CLS.VIEW_ID, this.parent.element))) {
            let gridSpan: string = '<span class="' + CLS.ICON_GRID + ' ' + CLS.MENU_ICON + '"></span>';
            let largeIconSpan: string = '<span class="' + CLS.ICON_LARGE + ' ' + CLS.MENU_ICON + '"></span>';
            let layoutItems: SplitButtonItemModel[] = [
                {
                    id: this.getPupupId('large'), text: largeIconSpan + getLocaleText(this.parent, 'View-LargeIcons'),
                    iconCss: this.parent.view === 'Details' ? '' : CLS.TB_OPTION_TICK
                },
                {
                    id: this.getPupupId('details'), text: gridSpan + getLocaleText(this.parent, 'View-Details'),
                    iconCss: this.parent.view === 'Details' ? CLS.TB_OPTION_TICK : ''
                }
            ];
            this.layoutBtnObj = new DropDownButton({
                iconCss: this.parent.view === 'Details' ? CLS.ICON_GRID : CLS.ICON_LARGE,
                cssClass: getCssClass(this.parent, 'e-caret-hide ' + CLS.ROOT_POPUP),
                items: layoutItems, select: this.layoutChange.bind(this),
                enableRtl: this.parent.enableRtl
            });
            this.layoutBtnObj.appendTo('#' + this.parent.element.id + CLS.VIEW_ID);
        }
        this.hideItems(this.default, true);
        this.hideStatus();
    }

    private updateSortByButton(): void {
        let items: SplitButtonItemModel[] = this.buttonObj.items;
        for (let itemCount: number = 0; itemCount < items.length; itemCount++) {
            if (items[itemCount].id === this.getPupupId('name')) {
                items[itemCount].iconCss = this.parent.sortBy === 'name' ? CLS.TB_OPTION_DOT : '';
            } else if (items[itemCount].id === this.getPupupId('size')) {
                items[itemCount].iconCss = this.parent.sortBy === 'size' ? CLS.TB_OPTION_DOT : '';
            } else if (items[itemCount].id === this.getPupupId('date')) {
                items[itemCount].iconCss = this.parent.sortBy === 'dateModified' ? CLS.TB_OPTION_DOT : '';
            } else if (items[itemCount].id === this.getPupupId('ascending')) {
                items[itemCount].iconCss = this.parent.sortOrder === 'Ascending' ? CLS.TB_OPTION_TICK : '';
            } else if (items[itemCount].id === this.getPupupId('descending')) {
                items[itemCount].iconCss = this.parent.sortOrder === 'Descending' ? CLS.TB_OPTION_TICK : '';
            }
        }
    }

    private getPupupId(id: string): string {
        return this.parent.element.id + '_ddl_' + id.toLowerCase();
    }

    private layoutChange(args: MenuEventArgs): void {
        if (this.parent.view === 'Details') {
            if (args.item.id === this.getPupupId('large')) {
                this.updateLayout('LargeIcons');
            }
        } else {
            if (args.item.id === this.getPupupId('details')) {
                this.updateLayout('Details');
            }
        }
    }

    private updateLayout(view: string): void {
        this.parent.fileView = view;
        this.parent.setProperties({ view: view }, true);
        let searchWord: string;
        if (this.parent.breadcrumbbarModule.searchObj.value && this.parent.breadcrumbbarModule.searchObj.value === '') {
            this.parent.notify(events.pathColumn, { args: this.parent });
        }
        if (this.parent.searchSettings.filterType === 'startWith') {
            searchWord = '*' + this.parent.breadcrumbbarModule.searchObj.value;
        } else if (this.parent.searchSettings.filterType === 'endsWith') {
            searchWord = this.parent.breadcrumbbarModule.searchObj.value + '*';
        } else {
            searchWord = '*' + this.parent.breadcrumbbarModule.searchObj.value + '*';
        }
        if (this.parent.breadcrumbbarModule.searchObj.value.length === 0) {
            read(this.parent, events.layoutChange, this.parent.path);
        } else {
            Search(this.parent, events.layoutChange, this.parent.path, searchWord, false, false);
        }
    }

    private toolbarItemData(data: string[]): ItemModel[] {
        let items: ItemModel[] = [];
        let mode: DisplayMode = 'Both';
        if (this.parent.isMobile) {
            mode = 'Overflow';
        }
        for (let i: number = 0; i < data.length; i++) {
            let item: ItemModel;
            let itemId: string = this.getId(data[i]);
            let itemText: string = getLocaleText(this.parent, data[i]);
            let itemTooltip: string = getLocaleText(this.parent, 'Tooltip-' + data[i]);
            switch (data[i]) {
                case '|':
                    item = { type: 'Separator' };
                    break;
                case 'Upload':
                    item = { id: itemId, text: itemText, tooltipText: itemTooltip, prefixIcon: CLS.ICON_UPLOAD, showTextOn: mode };
                    break;
                case 'SortBy':
                    let spanElement: string = '<span class="e-tbar-btn-text e-tbar-ddb-text">' + itemText + '</span>';
                    item = {
                        id: itemId, tooltipText: itemTooltip,
                        template: '<button id="' + itemId + '" class="e-tbar-btn e-tbtn-txt">' + spanElement + '</button>',
                    };
                    break;
                case 'Refresh':
                    item = { id: itemId, text: itemText, tooltipText: itemTooltip, prefixIcon: CLS.ICON_REFRESH, showTextOn: mode };
                    break;
                case 'Selection':
                    let txt: string = '<span class="e-status">2 ' + itemText + '</span><span class="' + CLS.ICON_CLEAR + '"></span>';
                    item = { id: itemId, tooltipText: itemTooltip, overflow: 'Show', align: 'Right', template: txt };
                    break;
                case 'View':
                    item = {
                        id: itemId, tooltipText: itemTooltip, prefixIcon: this.parent.view === 'Details' ? CLS.ICON_GRID : CLS.ICON_LARGE,
                        overflow: 'Show', align: 'Right',
                        template: '<button id="' + this.parent.element.id + CLS.VIEW_ID + '" class="e-tbar-btn e-tbtn-txt"></button>'
                    };
                    break;
                case 'Details':
                    item = { id: itemId, tooltipText: itemTooltip, prefixIcon: CLS.ICON_DETAILS, overflow: 'Show', align: 'Right' };
                    break;
                case 'NewFolder':
                    item = { id: itemId, text: itemText, tooltipText: itemTooltip, prefixIcon: CLS.ICON_NEWFOLDER, showTextOn: mode };
                    break;
                case 'Cut':
                    item = { id: itemId, text: itemText, tooltipText: itemTooltip, prefixIcon: CLS.ICON_CUT, showTextOn: mode };
                    break;
                case 'Copy':
                    item = { id: itemId, text: itemText, tooltipText: itemTooltip, prefixIcon: CLS.ICON_COPY, showTextOn: mode };
                    break;
                case 'Paste':
                    item = { id: itemId, text: itemText, tooltipText: itemTooltip, prefixIcon: CLS.ICON_PASTE, showTextOn: mode };
                    break;
                case 'Delete':
                    item = { id: itemId, text: itemText, tooltipText: itemTooltip, prefixIcon: CLS.ICON_DELETE, showTextOn: mode };
                    break;
                case 'Rename':
                    item = { id: itemId, text: itemText, tooltipText: itemTooltip, prefixIcon: CLS.ICON_RENAME, showTextOn: mode };
                    break;
                case 'Download':
                    item = { id: itemId, text: itemText, tooltipText: itemTooltip, prefixIcon: CLS.ICON_DOWNLOAD, showTextOn: mode };
                    break;
                case 'SelectAll':
                    item = { id: itemId, text: itemText, tooltipText: itemTooltip, prefixIcon: CLS.ICON_SELECTALL, showTextOn: mode };
                    break;
                default:
                    item = { id: itemId, text: itemText, tooltipText: itemTooltip };
                    break;
            }
            items.push(item);
        }
        return items;
    }

    private getId(id: string): string {
        return this.parent.element.id + '_tb_' + id.toLowerCase();
    }

    private addEventListener(): void {
        this.parent.on(events.modelChanged, this.onPropertyChanged, this);
        this.parent.on(events.selectionChanged, this.onSelectionChanged, this);
        this.parent.on(events.layoutChange, this.onLayoutChange, this);
        this.parent.on(events.showPaste, this.showPaste, this);
        this.parent.on(events.hidePaste, this.hidePaste, this);
        this.parent.on(events.destroy, this.destroy, this);
        this.parent.on(events.sortByChange, this.updateSortByButton, this);

    }

    private reRenderToolbar(e: NotifyArgs): void {
        if (e.newProp.toolbarSettings.items !== undefined) {
            this.items = this.toolbarItemData(this.getItems(e.newProp.toolbarSettings.items));
            this.toolbarObj.items = this.items;
            this.toolbarObj.dataBind();
        }
    }

    private onSelectionChanged(e?: NotifyArgs): void {
        this.hideStatus();
        this.hideItems(this.single, true);
        this.hideItems(this.selection, false);
        if (this.parent.selectedItems.length === 1) {
            this.hideItems(this.single, false);
            this.hideItems(this.selection, true);
        } else if (this.parent.selectedItems.length > 1) {
            this.hideItems(this.multiple, false);
            this.hideItems(this.selection, true);
            let ele: Element = select('.' + CLS.STATUS, this.toolbarObj.element);
            if (ele) {
                ele.textContent = this.parent.selectedItems.length + ' ' + getLocaleText(this.parent, 'Selection');
                this.toolbarObj.hideItem(ele.parentElement, false);
            }
        }
    }

    private hideItems(tools: string[], toHide: boolean): void {
        for (let i: number = 0; i < tools.length; i++) {
            let ele: Element = select('#' + this.getId(tools[i]), this.parent.element);
            if (ele) { this.toolbarObj.hideItem(ele.parentElement, toHide); }
        }
    }

    private hideStatus(): void {
        let ele: Element = select('.' + CLS.STATUS, this.toolbarObj.element);
        if (ele) { this.toolbarObj.hideItem(ele.parentElement, true); }
    }

    private showPaste(): void {
        this.hideItems(['Paste'], false);
    }

    private hidePaste(): void {
        this.hideItems(['Paste'], true);
    }

    private onLayoutChange(args: ReadArgs): void {
        if (this.layoutBtnObj) {
            this.layoutBtnObj.iconCss = this.parent.view === 'Details' ? CLS.ICON_GRID : CLS.ICON_LARGE;
            let items: SplitButtonItemModel[] = this.layoutBtnObj.items;
            for (let itemCount: number = 0; itemCount < items.length; itemCount++) {
                if (items[itemCount].id === this.getPupupId('large')) {
                    items[itemCount].iconCss = this.parent.view === 'LargeIcons' ? CLS.TB_OPTION_TICK : '';
                } else if (items[itemCount].id === this.getPupupId('details')) {
                    items[itemCount].iconCss = this.parent.view === 'Details' ? CLS.TB_OPTION_TICK : '';
                }
            }
        }
    }

    private removeEventListener(): void {
        this.parent.off(events.modelChanged, this.onPropertyChanged);
        this.parent.off(events.selectionChanged, this.onSelectionChanged);
        this.parent.off(events.layoutChange, this.onLayoutChange);
        this.parent.off(events.showPaste, this.showPaste);
        this.parent.off(events.hidePaste, this.hidePaste);
        this.parent.off(events.destroy, this.destroy);
        this.parent.off(events.sortByChange, this.updateSortByButton);
    }

    /**
     * For internal use only - Get the module name.
     * @private
     */
    private getModuleName(): string {
        return 'toolbar';
    }

    private onPropertyChanged(e: NotifyArgs): void {
        if (e.module !== this.getModuleName() && e.module !== 'common') {
            /* istanbul ignore next */
            return;
        }
        for (let prop of Object.keys(e.newProp)) {
            switch (prop) {
                case 'cssClass':
                    if (this.buttonObj) {
                        this.buttonObj.cssClass = getCssClass(this.parent, CLS.ROOT_POPUP);
                    }
                    if (this.layoutBtnObj) {
                        this.layoutBtnObj.cssClass = getCssClass(this.parent, 'e-caret-hide ' + CLS.ROOT_POPUP);
                    }
                    break;
                case 'height':
                case 'width':
                    this.toolbarObj.refreshOverflow();
                    break;
                case 'toolbarSettings':
                    this.reRenderToolbar(e);
                    break;
                case 'enableRtl':
                    let rtl: boolean = e.newProp.enableRtl;
                    this.toolbarObj.enableRtl = rtl;
                    this.toolbarObj.dataBind();
                    if (this.buttonObj) {
                        this.buttonObj.enableRtl = rtl;
                        this.buttonObj.dataBind();
                    }
                    if (this.layoutBtnObj) {
                        this.layoutBtnObj.enableRtl = rtl;
                        this.layoutBtnObj.dataBind();
                    }
                    break;
            }
        }
    }

    /**
     * Destroys the Toolbar module.
     * @method destroy
     * @return {void}
     */
    public destroy(): void {
        if (this.parent.isDestroyed) { return; }
        this.removeEventListener();
        if (this.buttonObj) { this.buttonObj.destroy(); }
        if (this.layoutBtnObj) { this.layoutBtnObj.destroy(); }
        this.toolbarObj.destroy();
    }

    /**
     * Enables or disables the specified Toolbar items.
     * @param {string[]} items - Specifies an array of items to be enabled or disabled.
     * @param {boolean} isEnable - Determines whether the Toolbar items should to be enabled or disabled.
     */
    public enableItems(items: string[], isEnable?: boolean): void {
        for (let i: number = 0; i < items.length; i++) {
            let ele: Element = select('#' + this.getId(items[i]), this.parent.element);
            if (ele) {
                this.toolbarObj.enableItems(ele.parentElement, isEnable);
            }
        }
    }
}