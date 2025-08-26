import { L10n, EventHandler, extend, isNullOrUndefined, MouseEventArgs, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { remove, select, removeClass } from '@syncfusion/ej2-base';
import { Toolbar as tool, ItemModel, ClickEventArgs } from '@syncfusion/ej2-navigations';
import { IGrid, NotifyArgs, FocusInfo, ColumnMenuClickEventArgs, RefreshToolbarItemsArgs } from '../base/interface';
import * as events from '../base/constant';
import { ServiceLocator } from '../services/service-locator';
import { EditSettingsModel } from '../base/grid-model';
import { templateCompiler, appendChildren, parentsUntil, addRemoveEventListener, applyBiggerTheme } from '../base/util';
import { ToolbarItems, ToolbarItem, ResponsiveToolbarAction } from '../base/enum';
import { ContextMenu as Menu } from '@syncfusion/ej2-navigations';
import { OffsetPosition, calculatePosition } from '@syncfusion/ej2-popups';
import { SearchBox } from '../services/focus-strategy';
import * as literals from '../base/string-literals';

/**
 *
 * The `Toolbar` module is used to handle ToolBar actions.
 */
export class Toolbar {
    //internal variables
    /** @hidden */
    public element: HTMLElement;
    private predefinedItems: { [key: string]: ItemModel } = {};
    public toolbar: tool;
    private searchElement: HTMLInputElement;
    private gridID: string;
    protected sIcon: HTMLElement;
    private isSearched: boolean = false;
    // module declarations
    private parent: IGrid;
    private rowSelectedFunction: () => void;
    private rowDeSelectedFunction: () => void;
    private serviceLocator: ServiceLocator;
    private l10n: L10n;
    private items: string[] = ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'Print', 'Search',
        'ColumnChooser', 'PdfExport', 'ExcelExport', 'CsvExport', 'WordExport'];
    private searchBoxObj: SearchBox;
    private evtHandlers: { event: string, handler: Function }[];
    private isRightToolbarMenu: boolean = false;
    private responsiveToolbarMenu: Menu;
    // internal variables
    private toolbarMenuElement: HTMLUListElement;

    constructor(parent?: IGrid, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.gridID = parent.element.id;
        this.serviceLocator = serviceLocator;
        this.addEventListener();
    }

    private render(): void {
        this.l10n = this.serviceLocator.getService<L10n>('localization');
        const preItems: ToolbarItems[] = ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'Print',
            'PdfExport', 'ExcelExport', 'WordExport', 'CsvExport'];
        const isAdaptive: boolean = this.parent.enableAdaptiveUI;
        const excludingItems: string[] = ['Edit', 'Delete', 'Update', 'Cancel'];
        for (const item of preItems) {
            const itemStr: string = item.toLowerCase();
            const localeName: string = itemStr[0].toUpperCase() + itemStr.slice(1);
            this.predefinedItems[`${item}`] = {
                id: this.gridID + '_' + itemStr, prefixIcon: 'e-' + itemStr,
                text: this.l10n.getConstant(localeName), tooltipText
                : this.l10n.getConstant(localeName)
            };
            if (isAdaptive) {
                this.predefinedItems[`${item}`].text = '';
                this.predefinedItems[`${item}`].visible = excludingItems.indexOf(item) === -1;
            }
        }
        (this.predefinedItems as { Search: ItemModel }).Search = {
            id: this.gridID + '_search',
            tooltipText: this.l10n.getConstant('Search'), align: 'Right', cssClass: 'e-search-wrapper',
            type: 'Input'
        };
        this.isRightToolbarMenu = false;
        if (this.parent.enableAdaptiveUI && this.isResponsiveToolbarMenuItems(true) && ((this.parent.rowRenderingMode === 'Horizontal') ||
            (this.parent.rowRenderingMode === 'Vertical' && !this.parent.allowFiltering && !this.parent.allowSorting))) {
            this.isRightToolbarMenu = true;
        }

        if (isAdaptive && this.isResponsiveToolbarMenuItems(false)) {
            (this.predefinedItems as { responsiveToolbarItems: ItemModel }).responsiveToolbarItems = {
                id: this.gridID + '_' + 'responsivetoolbaritems', cssClass: 'e-responsive-toolbar-items e-menu-toolbar', suffixIcon: 'e-' + 'responsivetoolbaritems-btn',
                align:  this.isRightToolbarMenu ? 'Left' : 'Right'
            };
        } else {
            (this.predefinedItems as { ColumnChooser: ItemModel }).ColumnChooser = {
                id: this.gridID + '_' + 'columnchooser', cssClass: 'e-cc e-ccdiv e-cc-toolbar', suffixIcon: 'e-' + 'columnchooser-btn',
                text: isAdaptive ? '' : this.l10n.getConstant('Columnchooser'),
                tooltipText: this.l10n.getConstant('Columnchooser'), align: 'Right'
            };
        }
        if (this.parent.rowRenderingMode === 'Vertical') {
            if (this.parent.allowFiltering && this.parent.filterSettings.type !== 'FilterBar') {
                (this.predefinedItems as { responsiveFilter: ItemModel }).responsiveFilter = {
                    id: this.gridID + '_' + 'responsivefilter', cssClass: 'e-gridresponsiveicons e-icons',
                    suffixIcon: 'e-' + 'resfilter-icon', tooltipText: this.l10n.getConstant('FilterIcon')
                };
            }
            if (this.parent.allowSorting) {
                (this.predefinedItems as { responsiveSort: ItemModel }).responsiveSort = {
                    id: this.gridID + '_' + 'responsivesort', cssClass: 'e-gridresponsiveicons e-icons',
                    suffixIcon: 'e-' + 'ressort-icon', tooltipText: this.l10n.getConstant('SortIcon')
                };
            }
        }
        if (this.parent.enableAdaptiveUI && this.parent.toolbar && this.parent.toolbar.some((item: string | ItemModel | ToolbarItem ) =>
            (typeof item === 'object' && item.text === 'Search') || item === 'Search')) {
            (this.predefinedItems as { responsiveBack: ItemModel }).responsiveBack = {
                id: this.gridID + '_' + 'responsiveback', cssClass: 'e-gridresponsiveicons e-icons',
                suffixIcon: 'e-' + 'resback-icon', visible: false
            };
        }
        this.createToolbar();
        if (this.parent.enableAdaptiveUI) {
            if (isNullOrUndefined(this.responsiveToolbarMenu)) {
                this.renderResponsiveToolbarpopup();
            }
            if (this.toolbar.element) {
                this.toolbar.refreshOverflow();
            }
        }
    }

    private isResponsiveToolbarMenuItems(isRight?: boolean): boolean {
        const items: string[] = isRight ? ['Add', 'Edit', 'Delete', 'Search'] : ['Print', 'ColumnChooser', 'PdfExport', 'ExcelExport', 'CsvExport'];
        const toolbarItems: (ToolbarItems | string | ItemModel | ToolbarItem)[] = this.parent.toolbar || [];
        for (let i: number = 0; i < items.length; i++) {
            if (toolbarItems.indexOf(items[parseInt(i.toString(), 10)] as string) >= 0) {
                return isRight ? false : true;
            }
        }
        return isRight ? true : false;
    }

    /**
     * Gets the toolbar of the Grid.
     *
     * @returns {Element} returns the element
     * @hidden
     */
    public getToolbar(): Element {
        return this.toolbar.element;
    }

    /**
     * Destroys the ToolBar.
     *
     * @function destroy
     * @returns {void}
     */
    public destroy(): void {
        if (this.toolbar && !this.toolbar.isDestroyed) {
            if (this.responsiveToolbarMenu) {
                this.responsiveToolbarMenu.destroy();
            }
            this.toolbar.off('render-react-toolbar-template', this.addReactToolbarPortals);
            this.unWireEvent();
            this.removeEventListener();
            this.toolbar.created = null;
            this.toolbar.clicked = null;
            if (!this.toolbar.element) {
                this.parent.destroyTemplate(['toolbarTemplate']);
                if (this.parent.isReact) {
                    this.parent.renderTemplates();
                }
            } else {
                this.toolbar.destroy();
            }
            if (this.parent.isAngular) {
                const viewStr: string = 'viewContainerRef';
                const registerTemp: string = 'registeredTemplate';
                this.toolbar[`${viewStr}`] = null;
                this.toolbar[`${registerTemp}`] = null;
            }
            if (this.element.parentNode) {
                remove(this.element);
                this.toolbar = null;
            }
        }
    }

    private bindSearchEvents(): void {
        this.searchElement = (<HTMLInputElement>select('#' + this.gridID + '_searchbar', this.element));
        this.wireEvent();
        this.refreshToolbarItems();
        if (this.parent.searchSettings) {
            this.updateSearchBox();
        }
    }

    private toolbarCreated(isNormal?: boolean): void {
        if (this.element.querySelector('.e-search-wrapper')) {
            if (!this.parent.enableAdaptiveUI || isNormal) {
                const classList: string = this.parent.cssClass ? 'e-input-group e-search ' + this.parent.cssClass
                    : 'e-input-group e-search';
                this.element.querySelector('.e-search-wrapper').innerHTML = '<div class="' + classList + '" role="search">\
                    <input id="' + this.gridID + '_searchbar" class="e-input e-search" name="input" type="search" \
                    placeholder= "' + this.l10n.getConstant('Search') + '"/>\
                    <span id="' + this.gridID + '_clearbutton" class="e-input-group-icon e-icons e-sicon" \
                    tabindex="-1" aria-label= "clear" role= "button" ></span>\
                    <span id="' + this.gridID + '_searchbutton" class="e-input-group-icon e-search-icon e-icons" \
                    tabindex="-1" title="' + this.l10n.getConstant('Search') + '" role= "search"></span> \
                    </div>';
            } else {
                this.element.querySelector('.e-search-wrapper').innerHTML = '<span id="' + this.gridID
                + '_clearbutton" class="e-input-group-icon e-icons e-sicon" \
                    tabindex="-1" role= "button" aria-label= "clear" ></span>\
                    <span id="' + this.gridID
                    + '_searchbutton" class="e-input-group-icon e-search-icon e-icons" \
                    tabindex="-1" role= "button" title="' + this.l10n.getConstant('Search') + '"></span> \
                    </div>';
            }
            (this.element.querySelector('#' + this.gridID + '_clearbutton')as HTMLElement).style.cursor = 'default';
        }
        if (this.element.querySelector('.e-responsive-toolbar-items')) {
            this.element.querySelector('.e-responsive-toolbar-items').innerHTML = '<button id="' + this.gridID
                    + '_responsivetoolbaritems" class="e-tbar-btn e-control e-btn e-lib e-icon-btn" \
                    type="button" data-ripple="true" tabindex="-1" data-tabindex="-1" aria-label="responsivetoolbaritems" \
                     aria-disabled="false" ><span class="e-btn-icon e-responsivetoolbaritems-btn e-icons"></span>';
            (this.element.querySelector('#' + this.gridID + '_responsivetoolbaritems') as HTMLElement).style.width = 'auto';
        }
        this.bindSearchEvents();
    }

    private createToolbar(): void {
        const items: ItemModel[] = this.getItems();
        this.toolbar = new tool({
            items: items,
            clicked: this.toolbarClickHandler.bind(this),
            enablePersistence: this.parent.enablePersistence,
            enableRtl: this.parent.enableRtl,
            created: this.toolbarCreated.bind(this),
            cssClass: this.parent.cssClass ? this.parent.cssClass : ''
        });
        this.toolbar.isReact = this.parent.isReact;
        this.toolbar.on('render-react-toolbar-template', this.addReactToolbarPortals, this);
        const isStringTemplate: string = 'isStringTemplate';
        this.toolbar[`${isStringTemplate}`] = true;
        const viewStr: string = 'viewContainerRef';
        const registerTemp: string = 'registeredTemplate';
        if (this.parent[`${viewStr}`]) {
            this.toolbar[`${registerTemp}`] = {};
            this.toolbar[`${viewStr}`] = this.parent[`${viewStr}`];
        }
        this.element = this.parent.createElement('div', { id: this.gridID + '_toolbarItems' });
        if (this.parent.enableAdaptiveUI) {
            this.element.classList.add('e-res-toolbar');
        }
        if (this.parent.toolbarTemplate) {
            const isVue: boolean = this.parent.isVue
                || (this.parent.parentDetails && this.parent.parentDetails.parentInstObj && this.parent.parentDetails.parentInstObj.isVue);
            if (typeof (this.parent.toolbarTemplate) === 'string'
                && !(isVue && !document.querySelectorAll(this.parent.toolbarTemplate).length)
                && (document.querySelector(this.parent.toolbarTemplate) && document.querySelector(this.parent.toolbarTemplate).tagName.toLowerCase() !== 'script')) {
                this.toolbar.appendTo(this.parent.toolbarTemplate);
                this.element = this.toolbar.element;
            } else {
                const isReactCompiler: boolean = this.parent.isReact && typeof (this.parent.toolbarTemplate) !== 'string' &&
                    !(this.parent.toolbarTemplate.prototype && this.parent.toolbarTemplate.prototype.CSPTemplate);
                const isReactChild: boolean = this.parent.parentDetails && this.parent.parentDetails.parentInstObj &&
                    this.parent.parentDetails.parentInstObj.isReact;
                const ID: string = this.parent.element.id + 'toolbarTemplate';
                if (isReactCompiler || isReactChild) {
                    templateCompiler(this.parent.toolbarTemplate)({}, this.parent, 'toolbarTemplate', ID, null, null, this.element);
                    this.parent.renderTemplates();
                } else {
                    appendChildren(this.element, templateCompiler(this.parent.toolbarTemplate)(
                        {}, this.parent, 'toolbarTemplate', null, null, null, null, this.parent.root));
                }
            }
            this.element.classList.add('e-temp-toolbar');
        } else {
            this.toolbar.appendTo(this.element);
        }
        this.parent.element.insertBefore(this.element, this.parent.getHeaderContent());
        const tlbrLeftElement: Element = this.element.querySelector('.e-toolbar-left');
        const tlbrCenterElement: Element = this.element.querySelector('.e-toolbar-center');
        const tlbrRightElement: Element = this.element.querySelector('.e-toolbar-right');
        const tlbrItems: Element = this.element.querySelector('.e-toolbar-items');
        const tlbrElement: Element = this.element;
        const tlbrLeftWidth: number = tlbrLeftElement ? tlbrLeftElement.clientWidth : 0;
        const tlbrCenterWidth: number = tlbrCenterElement ? tlbrCenterElement.clientWidth : 0;
        const tlbrRightWidth: number = tlbrRightElement ? tlbrRightElement.clientWidth : 0;
        const tlbrItemsWidth: number = tlbrItems ? tlbrItems.clientWidth : 0;
        const tlbrWidth: number = tlbrElement ? tlbrElement.clientWidth : 0;
        if (tlbrLeftWidth > tlbrWidth || tlbrCenterWidth > tlbrWidth || tlbrRightWidth > tlbrWidth || tlbrItemsWidth > tlbrWidth) {
            this.toolbar.refreshOverflow();
        }
    }

    private addReactToolbarPortals(args: Object[]): void {
        if (this.parent.isReact && args) {
            this.parent.portals = this.parent.portals.concat(args);
            this.parent.renderTemplates();
        }
    }

    private renderResponsiveSearch(isRender: boolean): void {
        if (isRender) {
            this.toolbarCreated(true);
            this.refreshResponsiveToolbarItems(ResponsiveToolbarAction.isSearch);
            this.searchElement = (<HTMLInputElement>select('#' + this.gridID + '_searchbar', this.element));
            const right: HTMLElement = parentsUntil(this.searchElement, 'e-toolbar-right') as HTMLElement;
            if (right) {
                right.classList.add('e-responsive-right');
            }
            if (this.parent.searchSettings) {
                this.updateSearchBox();
            }
        } else {
            this.refreshResponsiveToolbarItems(ResponsiveToolbarAction.isInitial);
        }
        if (this.toolbar.element && this.toolbar.element.querySelector('.e-hscroll')) {
            this.toolbar.refreshOverflow();
        }
        if (isRender) {
            this.searchBoxObj.searchFocus({ target: this.searchElement });
            this.searchElement.focus();
        }
    }

    private refreshResponsiveToolbarItems(action: ResponsiveToolbarAction): void {
        if (action === ResponsiveToolbarAction.isInitial) {
            const id: string = this.parent.element.id;
            const items: string[] = [id + '_edit', id + '_delete'];
            const selectedRecords: number[] = this.parent.getSelectedRowIndexes();
            const excludingItems: string[] = [id + '_responsiveback', id + '_update', id + '_cancel'];
            for (const item of this.toolbar.items) {
                const toolbarEle: Element = (item.template as string) && (item.template as string).length ?
                    parentsUntil(this.toolbar.element.querySelector('#' + item.id), 'e-template').children[0] : this.toolbar.element.querySelector('#' + item.id);
                if (toolbarEle) {
                    if (items.indexOf(item.id) > -1) {
                        if (selectedRecords.length) {
                            toolbarEle.parentElement.classList.remove('e-hidden');
                        } else {
                            toolbarEle.parentElement.classList.add('e-hidden');
                        }
                    } else {
                        if (excludingItems.indexOf(item.id) === -1 || (excludingItems.indexOf(item.id) > 0 && this.parent.isEdit)) {
                            toolbarEle.parentElement.classList.remove('e-hidden');
                        } else {
                            toolbarEle.parentElement.classList.add('e-hidden');
                        }
                    }
                }
            }
            if (this.searchElement) {
                const right: HTMLElement = parentsUntil(this.searchElement, 'e-toolbar-right') as HTMLElement;
                if (right) {
                    right.classList.remove('e-responsive-right');
                }
                this.toolbarCreated(false);
                this.unWireEvent();
                this.searchElement = undefined;
            }
        }
        if (action === ResponsiveToolbarAction.isSearch) {
            const items: string[] = [this.parent.element.id + '_responsiveback', this.parent.element.id + '_search'];
            for (const item of this.toolbar.items) {
                const toolbarEle: Element = this.toolbar.element.querySelector('#' + item.id);
                if (toolbarEle) {
                    if (items.indexOf(item.id) > -1) {
                        toolbarEle.parentElement.classList.remove('e-hidden');
                    } else {
                        toolbarEle.parentElement.classList.add('e-hidden');
                    }
                }
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    /**
     * Refreshes the toolbar items
     *
     * @param {RefreshToolbarItemsArgs} args - Defines the editSettings model and name.
     * @returns {void}
     * @hidden
     */
    public refreshToolbarItems(args?: RefreshToolbarItemsArgs): void {
        const gObj: IGrid = this.parent;
        let enableItems: string[] = [];
        let disableItems: string[] = [];
        const edit: EditSettingsModel = gObj.editSettings;
        const hasData: number = (gObj.currentViewData && gObj.currentViewData.length) ||
            (gObj.editSettings.mode === 'Batch' && !isNullOrUndefined(gObj.editModule) && gObj.editModule.getBatchChanges()[literals.addedRecords].length);
        const addRow: boolean = edit.showAddNewRow && !gObj.element.querySelector('.e-editedrow');
        if (edit.allowAdding) {
            enableItems.push(this.gridID + '_add');
        } else {
            disableItems.push(this.gridID + '_add');
        }
        if (edit.allowEditing && hasData) {
            enableItems.push(this.gridID + '_edit');
        } else {
            disableItems.push(this.gridID + '_edit');
        }
        if (edit.allowDeleting && hasData) {
            enableItems.push(this.gridID + '_delete');
        } else {
            disableItems.push(this.gridID + '_delete');
        }
        if (gObj.allowPdfExport && hasData) {
            enableItems.push(this.gridID + '_pdfexport');
        }
        else {
            disableItems.push(this.gridID + '_pdfexport');
        }
        if (gObj.allowExcelExport && hasData) {
            enableItems.push(this.gridID + '_excelexport');
            enableItems.push(this.gridID + '_csvexport');
        }
        else {
            disableItems.push(this.gridID + '_excelexport');
            disableItems.push(this.gridID + '_csvexport');
        }
        if (gObj.showColumnChooser) {
            enableItems.push(this.gridID + '_columnchooser');
        }
        else {
            disableItems.push(this.gridID + '_columnchooser');
        }
        if (gObj.editSettings.mode === 'Batch') {
            if (gObj.element.getElementsByClassName('e-updatedtd').length && (edit.allowAdding || edit.allowEditing)) {
                enableItems.push(this.gridID + '_update');
                enableItems.push(this.gridID + '_cancel');
            } else {
                disableItems.push(this.gridID + '_update');
                disableItems.push(this.gridID + '_cancel');
            }
        } else {
            if ((gObj.isEdit || edit.showAddNewRow) && (edit.allowAdding || edit.allowEditing)) {
                enableItems = addRow ? [this.gridID + '_update', this.gridID + '_cancel', this.gridID + '_edit', this.gridID + '_delete'] :
                    [this.gridID + '_update', this.gridID + '_cancel'];
                disableItems = addRow ? [this.gridID + '_add'] :
                    [this.gridID + '_add', this.gridID + '_edit', this.gridID + '_delete'];
            } else {
                disableItems.push(this.gridID + '_update');
                disableItems.push(this.gridID + '_cancel');
            }
        }
        this.enableItems(enableItems, true);
        this.enableItems(disableItems, false);
    }

    private getItems(): ItemModel[] {
        const items: ItemModel[] = [];
        const toolbarItems: (ToolbarItems | string | ItemModel | ToolbarItem)[] = this.parent.toolbar || [];
        if (typeof (this.parent.toolbar) === 'string') {
            return [];
        }
        if (this.parent.rowRenderingMode === 'Vertical') {
            if (this.parent.allowFiltering && this.parent.filterSettings.type !== 'FilterBar') {
                items.push(this.getItemObject('responsiveFilter'));
            }
            if (this.parent.allowSorting) {
                items.push(this.getItemObject('responsiveSort'));
            }
        }
        for (const item of toolbarItems) {
            if (this.parent.enableAdaptiveUI && ['Print', 'ColumnChooser',
                'PdfExport', 'ExcelExport', 'CsvExport'].indexOf(item as string) !== -1) {
                continue;
            }
            if (this.parent.enableAdaptiveUI && ((typeof item === 'object' && item.text === 'Search') || item === 'Search')) {
                items.push(this.getItemObject('responsiveBack'));
            }
            switch (typeof item) {
            case 'number':
                items.push(this.getItemObject(this.items[item as number]));
                break;
            case 'string':
                items.push(this.getItemObject(item as string));
                break;
            default:
                items.push(this.getItem(item as ItemModel));
            }
        }
        if (this.parent.enableAdaptiveUI && this.isResponsiveToolbarMenuItems(false)) {
            items.push(this.getItemObject('responsiveToolbarItems'));
        }
        return items;
    }

    private getItem(itemObject: ItemModel): ItemModel {
        const item: ItemModel = this.predefinedItems[itemObject.text];
        return item ? extend(item, item, itemObject) : itemObject;
    }

    private getItemObject(itemName: string): ItemModel {
        return this.predefinedItems[`${itemName}`] || { text: itemName, id: this.gridID + '_' + itemName };
    }

    /**
     * Enables or disables ToolBar items.
     *
     * @param {string[]} items - Defines the collection of itemID of ToolBar items.
     * @param {boolean} isEnable - Defines the items to be enabled or disabled.
     * @returns {void}
     * @hidden
     */
    public enableItems(items: string[], isEnable: boolean): void {
        for (const item of items) {
            const element: HTMLElement = select('#' + item, this.element);
            if (element) {
                this.toolbar.enableItems(element.closest('.e-toolbar-item') as HTMLElement, isEnable);
            }
        }
    }

    private toolbarClickHandler(args: ClickEventArgs): void {
        const gObj: IGrid = this.parent;
        const gID: string = this.gridID;
        const originalEvent: Event = args.originalEvent;
        if (this.parent.enableAdaptiveUI && args.item.id === gID + '_responsivetoolbaritems') {
            this.openResponsiveToolbarMenuPopup(originalEvent, args.item.id);
        } else {
            extend(args, { cancel: false });
            const newArgs: Object = args;
            gObj.trigger(events.toolbarClick, newArgs, (toolbarargs: ClickEventArgs) => {
                toolbarargs.originalEvent = toolbarargs.originalEvent ? toolbarargs.originalEvent : originalEvent;
                if (!toolbarargs.cancel) {
                    switch (!isNullOrUndefined(toolbarargs.item) && toolbarargs.item.id) {
                    case gID + '_print':
                        gObj.print();
                        break;
                    case gID + '_edit':
                        gObj.startEdit();
                        break;
                    case gID + '_update':
                        gObj.endEdit();
                        break;
                    case gID + '_cancel':
                        gObj.closeEdit();
                        break;
                    case gID + '_add':
                        gObj.addRecord();
                        break;
                    case gID + '_delete':
                        gObj.deleteRecord();
                        break;
                    case gID + '_search':
                        if ((<HTMLElement>toolbarargs.originalEvent.target).id === gID + '_searchbutton' && this.searchElement) {
                            this.search();
                        } else if (gObj.enableAdaptiveUI && !this.searchElement
                                && ((<HTMLElement>toolbarargs.originalEvent.target).classList.contains('e-search-wrapper')
                                    || (<HTMLElement>toolbarargs.originalEvent.target).id === gID + '_searchbutton')) {
                            this.renderResponsiveSearch(true);
                        }
                        else if ((<HTMLElement>toolbarargs.originalEvent.target).classList.contains('e-clear-icon') && (<HTMLElement>toolbarargs.originalEvent.target).id === gID + '_clearbutton' && this.searchElement) {
                            this.searchElement.value = '';
                            if (this.searchElement) {
                                this.sIcon = this.searchElement.parentElement.querySelector('.e-sicon');
                                this.sIcon.classList.remove('e-clear-icon');
                                this.sIcon.removeAttribute('title');
                                this.sIcon.style.cursor = 'default';
                            }
                            if (this.isSearched || this.parent.searchSettings.key.length) {
                                this.parent.search(this.searchElement.value);
                                this.isSearched = false;
                            }
                        }
                        break;
                    case gID + '_columnchooser':
                        if (this.parent.enableAdaptiveUI) {
                            gObj.showResponsiveCustomColumnChooser();
                        } else {
                            /* eslint-disable */
                                const tarElement: Element = this.parent.element.querySelector('.e-ccdiv');
                                let y: number = tarElement.getBoundingClientRect().top;
                                const x: number = tarElement.getBoundingClientRect().left;
                                const targetEle: Element = (<HTMLElement>toolbarargs.originalEvent.target);
                                /* eslint-enable */
                            y = tarElement.getBoundingClientRect().top + (<HTMLElement>tarElement).offsetTop;
                            gObj.createColumnchooser(x, y, targetEle);
                        }
                        break;
                    case gID + '_responsivefilter':
                        gObj.notify(events.renderResponsiveChangeAction, { action: 3 });
                        gObj.showResponsiveCustomFilter();
                        break;
                    case gID + '_responsivesort':
                        gObj.notify(events.renderResponsiveChangeAction, { action: 2 });
                        gObj.showResponsiveCustomSort();
                        break;
                    case gID + '_responsiveback':
                        this.renderResponsiveSearch(false);
                        this.toolbar.refreshOverflow();
                        break;
                    }
                }
            });
        }
    }

    private openResponsiveToolbarMenuPopup(e: Event, id?: string): void {
        let pos: OffsetPosition = { top: 0, left: 0 };
        this.toolbarMenuElement.style.cssText = 'display:block;visibility:hidden';
        const elePos: ClientRect = this.toolbarMenuElement.getBoundingClientRect();
        const gClient: ClientRect = this.parent.element.getBoundingClientRect();
        this.toolbarMenuElement.style.cssText = 'display:none;visibility:visible';
        let target : Element;
        if (isNullOrUndefined(e)) {
            target = this.parent.element.querySelector('#' + id);
        } else {
            target = e.target as Element;
        }
        if (this.parent.enableRtl) {
            pos = calculatePosition(target, 'left', 'bottom');
            if (this.isRightToolbarMenu) {
                pos.left -= elePos.width;
            }
        } else {
            pos = calculatePosition(target, 'right', 'bottom');
            if (!this.isRightToolbarMenu) {
                pos.left -= elePos.width;
            }
            if ((pos.left + elePos.width + 1) >= gClient.right) {
                pos.left -= 35;
            }
        }
        this.responsiveToolbarMenu['open'](pos.top, pos.left);
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        applyBiggerTheme(this.parent.element, this.responsiveToolbarMenu.element.parentElement);

    }

    private getMenuItems(): Object[] {
        const items: Object[] = [];
        const toolbarItems: (ToolbarItems | string | ItemModel | ToolbarItem)[] = this.parent.toolbar || [];
        for (const item of toolbarItems) {
            if (typeof item === 'string' && (item === 'ColumnChooser' || item === 'PdfExport' || item === 'ExcelExport' ||
                item === 'CsvExport' || item === 'Print')) {
                items.push({
                    text: this.getLocaleText(item),
                    id: this.gridID + '_' + item.toLowerCase(),
                    iconCss: 'e-btn-icon e-' + item.toLowerCase() + ' e-icons'
                });
            }
        }
        return items as Object[];
    }

    private getLocaleText(item: string): string {
        let title: string;
        if (item === 'ColumnChooser') {
            title = this.l10n.getConstant('Columnchooser');
        } else if (item === 'PdfExport') {
            title = this.l10n.getConstant('Pdfexport');
        } else if (item === 'ExcelExport') {
            title = this.l10n.getConstant('Excelexport');
        } else if (item === 'CsvExport') {
            title = this.l10n.getConstant('Csvexport');
        } else if (item === 'Print') {
            title = this.l10n.getConstant('Print');
        }
        return title;
    }

    private renderResponsiveToolbarpopup(): void {
        this.l10n = this.serviceLocator.getService<L10n>('localization');
        this.toolbarMenuElement = this.parent.createElement('ul', {
            id: this.gridID + '__toolbaritemsmenu', className: 'e-responsivetoolbar-menu' }) as HTMLUListElement;
        this.element.setAttribute('aria-label', this.l10n.getConstant('ToolbarMenuDialogARIA'));
        this.parent.element.appendChild(this.toolbarMenuElement);
        this.responsiveToolbarMenu = new Menu({
            cssClass: this.parent.cssClass ? 'e-grid-toolbarmenu e-bigger' + ' ' + this.parent.cssClass : 'e-grid-toolbarmenu e-bigger',
            enableRtl: this.parent.enableRtl,
            enablePersistence: this.parent.enablePersistence,
            locale: this.parent.locale,
            beforeOpen: this.beforeOpenResponsiveToolbarMenuItem.bind(this),
            items: this.getMenuItems(),
            select: this.ResponsiveToolbarMenuItemClick.bind(this)
        });
        this.responsiveToolbarMenu.appendTo(this.toolbarMenuElement);
    }

    private ResponsiveToolbarMenuItemClick(args: ColumnMenuClickEventArgs): void {
        const gObj: IGrid = this.parent;
        const element: Element = args.element;
        args.item.id = element.id;
        const newArgs: Object = { cancel: false, name: 'clicked', item: args.item, originalEvent: args.event };
        gObj.trigger(events.toolbarClick, newArgs, (toolbarargs: ClickEventArgs) => {
            if (!toolbarargs.cancel) {
                switch (!isNullOrUndefined(toolbarargs.item) && toolbarargs.item.id) {
                case this.gridID + '_columnchooser':
                    gObj.notify(events.renderResponsiveChangeAction, { action: 5 });
                    gObj.showResponsiveCustomColumnChooser();
                    break;
                case this.gridID + '_print':
                    gObj.print();
                    break;
                }
            }
        });
    }

    private beforeOpenResponsiveToolbarMenuItem(): void {
        const toolbarItems: (ToolbarItems | string | ItemModel | ToolbarItem)[] = this.parent.toolbar || [];
        const responsiveMenuItems: { key: string; enabled: boolean }[] = [
            { key: 'PdfExport', enabled: this.parent.allowPdfExport },
            { key: 'ExcelExport', enabled: this.parent.allowExcelExport },
            { key: 'CsvExport', enabled: this.parent.allowExcelExport },
            { key: 'ColumnChooser', enabled: this.parent.showColumnChooser }
        ];
        const enableItems: string[] = [];
        const disableItems: string[] = [];
        responsiveMenuItems.forEach((item: { key: string; enabled: boolean }) => {
            if (toolbarItems.indexOf(item.key) !== -1) {
                const localeText: string = this.getLocaleText(item.key);
                if (item.enabled) {
                    enableItems.push(localeText);
                } else {
                    disableItems.push(localeText);
                }
            }
        });
        this.responsiveToolbarMenu.enableItems(enableItems, true);
        this.responsiveToolbarMenu.enableItems(disableItems, false);
    }

    private modelChanged(e: { module: string, properties: EditSettingsModel }): void {
        if (e.module === 'edit') {
            this.refreshToolbarItems();
        }
    }

    protected onPropertyChanged(e: NotifyArgs): void {
        if (e.module !== this.getModuleName() || !this.parent.toolbar) {
            return;
        }
        if (this.element) {
            remove(this.element);
        }
        this.render();
    }

    private keyUpHandler(e: KeyboardEvent): void {
        if (e.keyCode === 13) {
            this.parent.searchModule.refreshSearch = false;
            this.search();
        }
        if (this.searchElement) {
            this.sIcon = this.searchElement.parentElement.querySelector('.e-sicon');
            if (this.searchElement.value.length && !isNullOrUndefined(this.sIcon)) {
                this.sIcon.classList.add('e-clear-icon');
                this.sIcon.setAttribute('title', this.l10n.getConstant('Clear'));
                this.sIcon.style.cursor = 'pointer';
            }
            else {
                this.sIcon.classList.remove('e-clear-icon');
                this.sIcon.removeAttribute('title');
                this.sIcon.style.cursor = 'default';
            }
        }
    }

    private search(): void {
        this.isSearched = true;
        this.parent.search(this.searchElement.value);
    }

    private updateSearchBox(): void {
        if (this.searchElement) {
            this.searchElement.value = this.parent.searchSettings.key;
        }
    }

    private wireEvent(): void {
        if (this.searchElement) {
            this.searchBoxObj = new SearchBox(this.searchElement, this.serviceLocator);
            EventHandler.add(this.searchElement, 'keyup', this.keyUpHandler, this);
            this.searchBoxObj.wireEvent();
        }
        EventHandler.add(this.element, 'focusin', this.onFocusIn, this);
        EventHandler.add(this.element, 'focusout', this.onFocusOut, this);
    }

    private unWireEvent(): void {
        if (this.searchElement) {
            EventHandler.remove(this.searchElement, 'keyup', this.keyUpHandler);
            this.searchBoxObj.unWireEvent();
        }
        EventHandler.remove(this.element, 'focusin', this.onFocusIn);
        EventHandler.remove(this.element, 'focusout', this.onFocusOut);
    }

    private onFocusIn(e: FocusEvent): void {
        const currentInfo: FocusInfo = this.parent.focusModule.currentInfo;
        if (currentInfo && currentInfo.element) {
            removeClass([currentInfo.element, currentInfo.elementToFocus],
                        ['e-focused', 'e-focus']);
            currentInfo.element.tabIndex = -1;
        }
        (e.target as HTMLElement).tabIndex = 0;
    }

    private onFocusOut(e: FocusEvent): void {
        (e.target as HTMLElement).tabIndex = -1;
        if (e.target && (e.target as HTMLElement).id === this.parent.element.id + '_searchbar' &&
            !(e.relatedTarget && ((e.relatedTarget as HTMLElement).id === this.parent.element.id + '_clearbutton' ||
                (e.relatedTarget as HTMLElement).id === this.parent.element.id + '_searchbutton'))) {
            this.parent.searchModule.refreshSearch = false;
            this.search();
        }
    }

    private setFocusToolbarItem(element: Element): void {
        let elementToFocus: Element = element.querySelector('.e-btn,.e-input,.e-toolbar-item-focus');
        if (!elementToFocus && this.parent.enableAdaptiveUI && !this.searchElement
            && element.classList.contains('e-search-wrapper')) {
            elementToFocus = element.querySelector('#' + this.gridID + '_searchbutton');
        }
        (elementToFocus as HTMLElement).focus();
    }

    public getFocusableToolbarItems(): Element[] {
        const getFocusToolbarElements : Element[] = [].slice.call(this.element.querySelectorAll('.e-toolbar-item:not(.e-overlay):not(.e-hidden)'));
        const getFocusToolbarItems : Element[] = [];
        for (let i: number = 0; i < getFocusToolbarElements.length; i++) {
            if (!isNullOrUndefined(getFocusToolbarElements[parseInt(i.toString(), 10)].querySelector('.e-btn,.e-input,.e-toolbar-item-focus'))) {
                getFocusToolbarItems.push(getFocusToolbarElements[parseInt(i.toString(), 10)]);
            }
        }
        return getFocusToolbarItems;
    }

    private keyPressedHandler(e: KeyboardEventArgs): void {
        if (e.target && parentsUntil(e.target as Element, 'e-toolbar-item')) {
            const targetParent: Element = parentsUntil(e.target as Element, 'e-toolbar-item');
            const focusableToolbarItems: Element[] = this.getFocusableToolbarItems();
            if (e.action === 'tab' || e.action === 'shiftTab') {
                if ((e.action === 'tab' && targetParent === focusableToolbarItems[focusableToolbarItems.length - 1])
                    || (e.action === 'shiftTab' && targetParent === focusableToolbarItems[0])) {
                    return;
                }
                for (let i: number = 0; i < focusableToolbarItems.length; i++) {
                    if (targetParent === focusableToolbarItems[parseInt(i.toString(), 10)]) {
                        e.preventDefault();
                        const index: number = e.action === 'tab' ? i + 1 : i - 1;
                        this.setFocusToolbarItem(focusableToolbarItems[parseInt(index.toString(), 10)]);
                        return;
                    }
                }
            }
            if (e.action === 'enter') {
                if (this.parent.enableAdaptiveUI && !this.searchElement
                    && (e.target as Element).id === this.gridID + '_searchbutton') {
                    this.renderResponsiveSearch(true);
                }
            }
        }
    }

    private reRenderToolbar(): void {
        if (this.element) {
            remove(this.element);
        }
        this.render();
    }

    protected addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.evtHandlers = [{ event: events.setFullScreenDialog, handler: this.reRenderToolbar },
            { event: events.initialEnd, handler: this.render },
            { event: events.uiUpdate, handler: this.onPropertyChanged },
            { event: events.inBoundModelChanged, handler: this.updateSearchBox.bind(this) },
            { event: events.modelChanged, handler: this.refreshToolbarItems },
            { event: events.toolbarRefresh, handler: this.refreshToolbarItems },
            { event: events.inBoundModelChanged, handler: this.modelChanged },
            { event: events.dataBound, handler: this.refreshToolbarItems },
            { event: events.click, handler: this.removeResponsiveSearch },
            { event: events.rowModeChange, handler: this.reRenderToolbar },
            { event: events.destroy, handler: this.destroy },
            { event: events.keyPressed, handler: this.keyPressedHandler }];
        addRemoveEventListener(this.parent, this.evtHandlers, true, this);
        this.rowSelectedFunction = this.rowSelected.bind(this);
        this.rowDeSelectedFunction = this.rowSelected.bind(this);
        this.parent.addEventListener(events.rowSelected, this.rowSelectedFunction);
        this.parent.addEventListener(events.rowDeselected, this.rowDeSelectedFunction);
    }

    protected removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        addRemoveEventListener(this.parent, this.evtHandlers, false);
        this.parent.removeEventListener(events.rowSelected, this.rowSelectedFunction);
        this.parent.removeEventListener(events.rowDeselected, this.rowDeSelectedFunction);
    }

    private removeResponsiveSearch(e: MouseEventArgs): void {
        const target: Element = e.target as Element;
        const isSearch: boolean = target.classList.contains('e-search-icon') || target.classList.contains('e-search-wrapper');
        if (this.parent.enableAdaptiveUI && !isSearch && this.searchElement
            && !parentsUntil(e.target as Element, 'e-res-toolbar')) {
            this.renderResponsiveSearch(false);
        }
    }

    private rowSelected(): void {
        if (this.parent.enableAdaptiveUI && this.toolbar.element) {
            this.refreshResponsiveToolbarItems(ResponsiveToolbarAction.isInitial);
            this.toolbar.refreshOverflow();
        }
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {string} returns the module name
     */
    private getModuleName(): string {
        return 'toolbar';
    }
}
