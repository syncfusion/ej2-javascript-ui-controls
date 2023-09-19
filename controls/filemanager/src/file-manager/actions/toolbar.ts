/* eslint-disable @typescript-eslint/no-explicit-any */
import { Toolbar as BaseToolbar, ItemModel, ClickEventArgs, MenuEventArgs, DisplayMode } from '@syncfusion/ej2-navigations';
import { select, isNullOrUndefined as isNOU, closest, selectAll } from '@syncfusion/ej2-base';
import { createDialog } from '../pop-up/dialog';
import * as events from '../base/constant';
import * as CLS from '../base/classes';
import { IFileManager, NotifyArgs, ToolbarClickEventArgs, ToolbarCreateEventArgs } from '../base/interface';
import { refresh, getPathObject, getLocaleText, getCssClass, sortbyClickHandler } from '../common/utility';
import { createDeniedDialog, updateLayout } from '../common/utility';
import { GetDetails } from '../common/operations';
import { DropDownButton, ItemModel as SplitButtonItemModel } from '@syncfusion/ej2-splitbuttons';
import { cutFiles, copyFiles, pasteHandler, hasEditAccess } from '../common/index';
import { doDownload, createNewFolder, uploadItem } from '../common/index';
import { ToolbarItem, ToolbarItemModel } from '../models';

/**
 * Toolbar module
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
     *
     * @hidden
     * @param {IFileManager} parent - specifies the parent element.
     * @private
     */
    constructor(parent?: IFileManager) {
        this.parent = parent;
        this.render();
        this.addEventListener();
    }

    private render(): void {
        this.items = this.toolbarItemData(this.getItems(this.parent.toolbarSettings.items.map((item: string) => item.trim())));
        const eventArgs: ToolbarCreateEventArgs = { items: this.items };
        this.parent.trigger('toolbarCreate', eventArgs, (toolbarCreateArgs: ToolbarCreateEventArgs) => {
            this.items = toolbarCreateArgs.items;
            this.toolbarObj = new BaseToolbar({
                items: this.items,
                created: this.toolbarCreateHandler.bind(this),
                overflowMode: 'Popup',
                clicked: this.onClicked.bind(this),
                enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
                enableRtl: this.parent.enableRtl
            });
            this.toolbarObj.isStringTemplate = true;
            this.toolbarObj.root = this.parent.root ? this.parent.root : this.parent;
            this.toolbarObj.appendTo('#' + this.parent.element.id + CLS.TOOLBAR_ID);
        });
    }

    public getItemIndex(item: string): number {
        const itemId: string = this.getId(item);
        for (let i: number = 0; i < this.items.length; i++) {
            if (this.items[i as number].id === itemId) {
                return i;
            }
        }
        return -1;
    }

    private getItems(items: string[]): string[] {
        let currItems: string[] = items.slice();
        if (this.parent.isDevice && this.parent.allowMultiSelection) { currItems.push('SelectAll'); }
        if (this.parent.toolbarItems.length > 0) {
            currItems = this.parent.toolbarItems.map((item: ToolbarItem) => item.name);
        }
        return currItems;
    }
    /* istanbul ignore next */
    private onClicked(args: ClickEventArgs): void {
        if (isNOU(args.item) || !args.item.id) { return; }
        const tool: string = args.item.id.substr((this.parent.element.id + '_tb_').length);
        // eslint-disable-next-line
        let details: Object[];
        if (tool === 'refresh' || tool === 'newfolder' || tool === 'upload') {
            details = [getPathObject(this.parent)];
            this.parent.itemData = details;
        } else {
            this.parent.notify(events.selectedData, {});
            details = this.parent.itemData;
        }
        const eventArgs: ToolbarClickEventArgs = { cancel: false, fileDetails: details, item: args.item };
        this.parent.trigger('toolbarClick', eventArgs, (toolbarClickArgs: ToolbarClickEventArgs) => {
            let sItems: string[];
            let target: Element;
            if (!toolbarClickArgs.cancel) {
                switch (tool) {
                case 'sortby':
                    target = closest((args.originalEvent.target as Element), '.' + CLS.TB_ITEM);
                    if (target && target.classList.contains('e-toolbar-popup')) {
                        args.cancel = true;
                    }
                    break;
                case 'newfolder':
                    createNewFolder(this.parent);
                    break;
                case 'cut':
                    cutFiles(this.parent);
                    break;
                case 'copy':
                    copyFiles(this.parent);
                    break;
                case 'delete':
                    for (let i: number = 0; i < details.length; i++) {
                        if (!hasEditAccess(details[i as number])) {
                            createDeniedDialog(this.parent, details[i as number], events.permissionEdit);
                            return;
                        }
                    }
                    createDialog(this.parent, 'Delete');
                    break;
                case 'details':
                    this.parent.notify(events.detailsInit, {});
                    sItems = this.parent.selectedItems;
                    if (this.parent.activeModule === 'navigationpane') {
                        sItems = [];
                    }
                    GetDetails(this.parent, sItems, this.parent.path, 'details');
                    break;
                case 'paste':
                    this.parent.folderPath = '';
                    pasteHandler(this.parent);
                    break;
                case 'refresh':
                    refresh(this.parent);
                    break;
                case 'download':
                    doDownload(this.parent);
                    break;
                case 'rename':
                    if (!hasEditAccess(details[0])) {
                        createDeniedDialog(this.parent, details[0], events.permissionEdit);
                    } else {
                        this.parent.notify(events.renameInit, {});
                        createDialog(this.parent, 'Rename');
                    }
                    break;
                case 'upload':
                    uploadItem(this.parent);
                    break;
                case 'selectall':
                    this.parent.notify(events.selectAllInit, {});
                    break;
                case 'selection':
                    this.parent.notify(events.clearAllInit, {});
                    break;
                }
            }
        });
    }

    private toolbarCreateHandler(): void {
        if (!isNOU(select('#' + this.getId('SortBy'), this.parent.element))) {
            const items: SplitButtonItemModel[] = [
                { id: this.getPupupId('name'), text: getLocaleText(this.parent, 'Name'),
                    iconCss: this.parent.sortBy === 'name' ? CLS.TB_OPTION_DOT : '' },
                { id: this.getPupupId('size'), text: getLocaleText(this.parent, 'Size'),
                    iconCss: this.parent.sortBy === 'size' ? CLS.TB_OPTION_DOT : '' },
                { id: this.getPupupId('date'), text: getLocaleText(this.parent, 'DateModified'),
                    iconCss: this.parent.sortBy === '_fm_modified' ? CLS.TB_OPTION_DOT : '' },
                { separator: true },
                { id: this.getPupupId('ascending'), text: getLocaleText(this.parent, 'Ascending'),
                    iconCss: this.parent.sortOrder === 'Ascending' ? CLS.TB_OPTION_TICK : '' },
                { id: this.getPupupId('descending'), text: getLocaleText(this.parent, 'Descending'),
                    iconCss: this.parent.sortOrder === 'Descending' ? CLS.TB_OPTION_TICK : ''  },
                { id: this.getPupupId('none'), text: getLocaleText(this.parent, 'None'),
                    iconCss: this.parent.sortOrder === 'None' ? CLS.TB_OPTION_TICK : ''  }
            ];
            this.buttonObj = new DropDownButton({
                items: items, cssClass: getCssClass(this.parent, CLS.ROOT_POPUP),
                select: sortbyClickHandler.bind(this, this.parent as IFileManager),
                enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
                enableRtl: this.parent.enableRtl, iconCss: CLS.ICON_SHORTBY
            });
            this.buttonObj.isStringTemplate = true;
            this.buttonObj.appendTo('#' + this.getId('SortBy'));
        }
        if (!isNOU(select('#' + this.getId('View'), this.parent.element))) {
            const gridSpan: string = '<span class="' + CLS.ICON_GRID + ' ' + CLS.MENU_ICON + '"></span>';
            const largeIconSpan: string = '<span class="' + CLS.ICON_LARGE + ' ' + CLS.MENU_ICON + '"></span>';
            const layoutItems: SplitButtonItemModel[] = [
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
                enableRtl: this.parent.enableRtl,
                content: '<span class="e-tbar-btn-text">' + getLocaleText(this.parent, 'View') + '</span>'
            });
            this.layoutBtnObj.isStringTemplate = true;
            this.layoutBtnObj.appendTo('#' + this.getId('View'));
        }
        this.hideItems(this.default, true);
        this.hideStatus();
        if ((this as any).parent.portals && (this.toolbarObj as any).portals) {
            (this as any).parent.portals = (this as any).parent.portals.concat((this.toolbarObj as any).portals);
            (this.parent as any)['renderReactTemplates']();
        }
        const btnElement: HTMLInputElement[] = (selectAll('.e-btn', this.toolbarObj.element) as HTMLInputElement[]);
        for (let btnCount: number = 0; btnCount < btnElement.length; btnCount++) {
            /* istanbul ignore next */
            btnElement[btnCount as number].onkeydown = (e: KeyboardEvent) => {
                if (e.keyCode === 13 && !(<HTMLElement>e.target).classList.contains('e-fe-popup')) {
                    e.preventDefault();
                }
            };
            btnElement[btnCount as number].onkeyup = (e: KeyboardEvent) => {
                if (e.keyCode === 13 && !(<HTMLElement>e.target).classList.contains('e-fe-popup')) {
                    btnElement[btnCount as number].click();
                }
            };
        }
        this.parent.refreshLayout();
    }

    private updateSortByButton(): void {
        if (this.buttonObj) {
            const items: SplitButtonItemModel[] = this.buttonObj.items;
            for (let itemCount: number = 0; itemCount < items.length; itemCount++) {
                if (items[itemCount as number].id === this.getPupupId('name')) {
                    items[itemCount as number].iconCss = this.parent.sortBy === 'name' ? CLS.TB_OPTION_DOT : '';
                } else if (items[itemCount as number].id === this.getPupupId('size')) {
                    items[itemCount as number].iconCss = this.parent.sortBy === 'size' ? CLS.TB_OPTION_DOT : '';
                } else if (items[itemCount as number].id === this.getPupupId('date')) {
                    if (this.parent.sortBy === 'dateModified' || this.parent.sortBy === 'dateCreated') {
                        items[itemCount as number].iconCss = this.parent.sortBy === this.parent.sortBy ? CLS.TB_OPTION_DOT : '';
                    }
                    else {
                        items[itemCount as number].iconCss = this.parent.sortBy === '_fm_modified' ? CLS.TB_OPTION_DOT : '';
                    }
                } else if (items[itemCount as number].id === this.getPupupId('ascending')) {
                    items[itemCount as number].iconCss = this.parent.sortOrder === 'Ascending' ? CLS.TB_OPTION_TICK : '';
                } else if (items[itemCount as number].id === this.getPupupId('descending')) {
                    items[itemCount as number].iconCss = this.parent.sortOrder === 'Descending' ? CLS.TB_OPTION_TICK : '';
                } else if (items[itemCount as number].id === this.getPupupId('none')) {
                    items[itemCount as number].iconCss = this.parent.sortOrder === 'None' ? CLS.TB_OPTION_TICK : '';
                }
            }
        }
    }

    private getPupupId(id: string): string {
        return this.parent.element.id + '_ddl_' + id.toLowerCase();
    }

    private layoutChange(args: MenuEventArgs): void {
        if (this.parent.view === 'Details') {
            if (args.item.id === this.getPupupId('large')) {
                updateLayout(this.parent, 'LargeIcons');
            }
        } else {
            if (args.item.id === this.getPupupId('details')) {
                updateLayout(this.parent, 'Details');
            }
        }
    }

    private toolbarItemData(data: string[]): ItemModel[] {
        const items: ItemModel[] = [];
        let mode: DisplayMode = 'Both';
        if (this.parent.isMobile) {
            mode = 'Overflow';
        }
        for (let i: number = 0; i < data.length; i++) {
            let item: ItemModel;
            let propItem: ToolbarItemModel;
            if (this.parent.toolbarItems.length > 0) {
                propItem = this.getItemModel(this.parent.toolbarItems[parseInt(i.toString(), 10)]);
            }
            const itemId: string = this.getId(data[i as number]);
            const itemText: string = getLocaleText(this.parent, data[i as number]);
            const itemTooltip: string = getLocaleText(this.parent, 'Tooltip-' + data[i as number]);
            switch (data[i as number]) {
            case '|':
                item = { type: 'Separator' };
                break;
            case 'Upload':
                item = { id: itemId, text: itemText, tooltipText: itemTooltip, prefixIcon: CLS.ICON_UPLOAD, showTextOn: mode };
                break;
            case 'SortBy': {
                let spanElement: string = '<span class="e-tbar-btn-text e-tbar-ddb-text">' + itemText + '</span>';
                if (propItem && propItem.text) {
                    spanElement = '<span class="e-tbar-btn-text e-tbar-ddb-text">' + propItem.text + '</span>';
                }
                item = {
                    id: itemId, tooltipText: itemTooltip,
                    template: '<button id="' + itemId + '" class="e-tbar-btn e-tbtn-txt" tabindex="-1">' + spanElement + '</button>'
                };
                break;
            }
            case 'Refresh':
                item = { id: itemId, text: itemText, tooltipText: itemTooltip, prefixIcon: CLS.ICON_REFRESH, showTextOn: mode };
                break;
            case 'Selection':
                item = {
                    id: itemId, text: itemText, tooltipText: itemTooltip, suffixIcon: CLS.ICON_CLEAR, overflow: 'Show',
                    align: 'Right'
                };
                break;
            case 'View': {
                let viewText: string;
                if (propItem && propItem.text) {
                    viewText = propItem.text;
                } else {
                    viewText = getLocaleText(this.parent, 'View');
                }
                item = {
                    id: itemId, tooltipText: itemTooltip, prefixIcon: this.parent.view === 'Details' ? CLS.ICON_GRID : CLS.ICON_LARGE,
                    overflow: 'Show', align: 'Right', text: itemText, showTextOn: 'Overflow',
                    template: '<button id="' + itemId + '" class="e-tbar-btn e-tbtn-txt" tabindex="-1" aria-label=' +
                    viewText + '></button>'
                };
                break;
            }
            case 'Details':
                item = {
                    id: itemId, tooltipText: itemTooltip, prefixIcon: CLS.ICON_DETAILS, overflow: 'Show', align: 'Right',
                    text: itemText, showTextOn: 'Overflow'
                };
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
                item = { id: itemId, text: itemText, tooltipText: itemTooltip, template: '' };
                break;
            }
            if (this.parent.toolbarItems.length > 0 && propItem) {
                const mergedItems: ToolbarItemModel = { ...item, ...propItem };
                items.push(mergedItems);
            }
            else {
                items.push(item);
            }
        }
        return items;
    }

    private getItemModel(propItem: ToolbarItemModel): ToolbarItemModel {
        const item: ToolbarItemModel = {};
        if (propItem.id) {
            item.id = propItem.id;
        }
        if (propItem.text) {
            item.text = propItem.text;
        }
        if (propItem.tooltipText) {
            item.tooltipText = propItem.tooltipText;
        }
        if (propItem.prefixIcon) {
            item.prefixIcon = propItem.prefixIcon;
        }
        if (propItem.cssClass) {
            item.cssClass = propItem.cssClass;
        }
        if (propItem.showTextOn !== 'Both') {
            item.showTextOn = propItem.showTextOn;
        }
        if (propItem.template) {
            item.template = propItem.template;
        }
        if (propItem.disabled) {
            item.disabled = propItem.disabled;
        }
        if (propItem.width !== 'auto') {
            item.width = propItem.width;
        }
        if (propItem.suffixIcon) {
            item.suffixIcon = propItem.suffixIcon;
        }
        if (propItem.align !== 'Left') {
            item.align = propItem.align;
        }
        if (propItem.overflow !== 'None') {
            item.overflow = propItem.overflow;
        }
        if (propItem.htmlAttributes) {
            item.htmlAttributes = propItem.htmlAttributes;
        }
        if (propItem.type !== 'Button') {
            item.type = propItem.type;
        }
        if (propItem.visible !== true) {
            item.visible = propItem.visible;
        }
        if (propItem.showAlwaysInPopup) {
            item.showAlwaysInPopup = propItem.showAlwaysInPopup;
        }
        if (propItem.tabIndex !== -1) {
            item.tabIndex = propItem.tabIndex;
        }
        return item;
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
        let itemsToProcess: string | string[] = [];
        if (this.parent.toolbarItems.length > 0) {
            itemsToProcess = this.parent.toolbarItems.map((item: ToolbarItem) => {
                return item.name;
            });
        } else if (e.newProp.toolbarSettings.items !== undefined) {
            itemsToProcess = e.newProp.toolbarSettings.items.map((item: string) => {
                return item.trim();
            });
        }

        if (itemsToProcess.length > 0) {
            this.items = this.toolbarItemData(this.getItems(itemsToProcess));
            const eventArgs: ToolbarCreateEventArgs = { items: this.items };
            this.parent.trigger('toolbarCreate', eventArgs, (toolbarCreateArgs: ToolbarCreateEventArgs) => {
                if (this.buttonObj) { this.buttonObj.destroy(); }
                if (this.layoutBtnObj) { this.layoutBtnObj.destroy(); }
                this.items = toolbarCreateArgs.items; this.toolbarObj.items = this.items;
                this.toolbarObj.dataBind();
                this.toolbarCreateHandler();
            });
        }
    }

    private onSelectionChanged(): void {
        this.hideStatus();
        this.hideItems(this.single, true);
        this.hideItems(this.selection, false);
        if (this.parent.selectedItems.length === 1) {
            this.hideItems(this.single, false);
            this.hideItems(this.selection, true);
        } else if (this.parent.selectedItems.length > 1) {
            this.hideItems(this.multiple, false);
            this.hideItems(this.selection, true);
        }
        const ele: Element = select('#' + this.getId('Selection'), this.toolbarObj.element);
        if (this.parent.selectedItems.length > 0 && ele && !this.parent.enableVirtualization) {
            let txt: string;
            if (this.parent.selectedItems.length === 1) {
                txt = this.parent.selectedItems.length + ' ' + getLocaleText(this.parent, 'Item-Selection');
            } else {
                txt = this.parent.selectedItems.length + ' ' + getLocaleText(this.parent, 'Items-Selection');
            }
            select('.e-tbar-btn-text', ele).textContent = txt;
            this.toolbarObj.hideItem(ele.parentElement, false);
        }
    }

    private hideItems(tools: string[], toHide: boolean): void {
        for (let i: number = 0; i < tools.length; i++) {
            const ele: Element = select('#' + this.getId(tools[i as number]), this.parent.element);
            if (ele) { this.toolbarObj.hideItem(ele.parentElement, toHide); }
        }
    }

    private hideStatus(): void {
        const ele: Element = select('#' + this.getId('Selection'), this.toolbarObj.element);
        if (ele) { this.toolbarObj.hideItem(ele.parentElement, true); }
    }

    private showPaste(): void {
        this.hideItems(['Paste'], false);
    }

    private hidePaste(): void {
        this.hideItems(['Paste'], true);
    }

    private onLayoutChange(): void {
        if (this.layoutBtnObj) {
            this.layoutBtnObj.iconCss = this.parent.view === 'Details' ? CLS.ICON_GRID : CLS.ICON_LARGE;
            const items: SplitButtonItemModel[] = this.layoutBtnObj.items;
            for (let itemCount: number = 0; itemCount < items.length; itemCount++) {
                if (items[itemCount as number].id === this.getPupupId('large')) {
                    items[itemCount as number].iconCss = this.parent.view === 'LargeIcons' ? CLS.TB_OPTION_TICK : '';
                } else if (items[itemCount as number].id === this.getPupupId('details')) {
                    items[itemCount as number].iconCss = this.parent.view === 'Details' ? CLS.TB_OPTION_TICK : '';
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
     *
     * @returns {string} - returns module name.
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
        for (const prop of Object.keys(e.newProp)) {
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
            case 'toolbarItems':
                this.reRenderToolbar(e);
                break;
            }
        }
    }

    public destroy(): void {
        if (this.parent.isDestroyed) { return; }
        this.removeEventListener();
        if (this.buttonObj) { this.buttonObj.destroy(); }
        if (this.layoutBtnObj) { this.layoutBtnObj.destroy(); }
        this.toolbarObj.destroy();
        this.parent.refreshLayout();
    }

    public enableItems(items: string[], isEnable?: boolean): void {
        for (let i: number = 0; i < items.length; i++) {
            const ele: Element = select('#' + this.getId(items[i as number]), this.parent.element);
            if (ele) {
                this.toolbarObj.enableItems(ele.parentElement, isEnable);
            }
        }
    }
}
