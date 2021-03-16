import { L10n, EventHandler, extend, isNullOrUndefined, MouseEventArgs } from '@syncfusion/ej2-base';
import { remove, isBlazor, updateBlazorTemplate, select } from '@syncfusion/ej2-base';
import { Toolbar as tool, ItemModel, ClickEventArgs } from '@syncfusion/ej2-navigations';
import { IGrid, NotifyArgs } from '../base/interface';
import * as events from '../base/constant';
import { ServiceLocator } from '../services/service-locator';
import { EditSettingsModel } from '../base/grid-model';
import { templateCompiler, appendChildren, parentsUntil } from '../base/util';
import { ToolbarItems, ToolbarItem, ResponsiveToolbarAction } from '../base/enum';
import { SearchBox } from '../services/focus-strategy';

/**
 * The `Toolbar` module is used to handle ToolBar actions.
 * @hidden
 */
export class Toolbar {
    //internal variables
    private element: HTMLElement;
    private predefinedItems: { [key: string]: ItemModel } = {};
    public toolbar: tool;
    private searchElement: HTMLInputElement;
    private gridID: string;
    // module declarations
    private parent: IGrid;
    private rowSelectedFunction: () => void;
    private rowDeSelectedFunction: () => void;
    private serviceLocator: ServiceLocator;
    private l10n: L10n;
    private items: string[] = ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'Print', 'Search',
        'ColumnChooser', 'PdfExport', 'ExcelExport', 'CsvExport', 'WordExport'];
    private searchBoxObj: SearchBox;

    constructor(parent?: IGrid, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.gridID = parent.element.id;
        this.serviceLocator = serviceLocator;
        this.addEventListener();
    }

    private render(): void {
        this.l10n = this.serviceLocator.getService<L10n>('localization');
        let preItems: ToolbarItems[] = ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'Print',
            'PdfExport', 'ExcelExport', 'WordExport', 'CsvExport'];
        for (let item of preItems) {
            let itemStr: string = item.toLowerCase();
            let localeName: string = itemStr[0].toUpperCase() + itemStr.slice(1);
            this.predefinedItems[item] = {
                id: this.gridID + '_' + itemStr, prefixIcon: 'e-' + itemStr,
                text: this.parent.enableAdaptiveUI ? '' : this.l10n.getConstant(localeName), tooltipText
                    : this.l10n.getConstant(localeName)
            };
        }
        (this.predefinedItems as { Search: ItemModel }).Search = {
            id: this.gridID + '_search',
            tooltipText: this.l10n.getConstant('Search'), align: 'Right', cssClass: 'e-search-wrapper',
            type: 'Input'
        };
        (this.predefinedItems as { ColumnChooser: ItemModel }).ColumnChooser = {
            id: this.gridID + '_' + 'columnchooser', cssClass: 'e-cc e-ccdiv e-cc-toolbar', suffixIcon: 'e-' + 'columnchooser-btn',
            text: this.l10n.getConstant('Columnchooser'), tooltipText: this.l10n.getConstant('Columnchooser'), align: 'Right',
        };
        if (this.parent.rowRenderingMode === 'Vertical') {
            if (this.parent.allowFiltering && this.parent.filterSettings.type !== 'FilterBar') {
                (this.predefinedItems as { responsiveFilter: ItemModel }).responsiveFilter = {
                    id: this.gridID + '_' + 'responsivefilter', cssClass: 'e-gridresponsiveicons e-icons',
                    suffixIcon: 'e-' + 'resfilter-icon', tooltipText: this.l10n.getConstant('FilterButton')
                };
            }
            if (this.parent.allowSorting) {
                (this.predefinedItems as { responsiveSort: ItemModel }).responsiveSort = {
                    id: this.gridID + '_' + 'responsivesort', cssClass: 'e-gridresponsiveicons e-icons',
                    suffixIcon: 'e-' + 'ressort-icon', tooltipText: this.l10n.getConstant('Sort')
                };
            }
        }
        if (this.parent.enableAdaptiveUI && this.parent.toolbar.indexOf('Search') > -1) {
            (this.predefinedItems as { responsiveBack: ItemModel }).responsiveBack = {
                id: this.gridID + '_' + 'responsiveback', cssClass: 'e-gridresponsiveicons e-icons',
                suffixIcon: 'e-' + 'resback-icon'
            };
        }
        this.createToolbar();
    }

    /**
     * Gets the toolbar of the Grid.
     * @return {Element}
     * @hidden
     */
    public getToolbar(): Element {
        return this.toolbar.element;
    }

    /**
     * Destroys the ToolBar.
     * @method destroy
     * @return {void}
     */
    public destroy(): void {
        if (this.toolbar && !this.toolbar.isDestroyed) {
            if (!this.toolbar.element) {
                this.parent.destroyTemplate(['toolbarTemplate']);
                if (this.parent.isReact) {
                    this.parent.renderTemplates();
                }
            } else {
                this.toolbar.off('render-react-toolbar-template', this.addReactToolbarPortals);
                this.toolbar.destroy();
            }
            this.unWireEvent();
            this.removeEventListener();
            remove(this.element);
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
                this.element.querySelector('.e-search-wrapper').innerHTML = '<div class="e-input-group e-search" role="search">\
                    <input id="' + this.gridID + '_searchbar" class="e-input" name="input" type="search" \
                    placeholder= \"' + this.l10n.getConstant('Search') + '\"/>\
                    <span id="' + this.gridID + '_searchbutton" class="e-input-group-icon e-search-icon e-icons" \
                    tabindex="-1" title="' + this.l10n.getConstant('Search') + '" aria-label= "search"></span> \
                    </div>';
            } else {
                this.element.querySelector('.e-search-wrapper').innerHTML = '<span id="' + this.gridID
                    + '_searchbutton" class="e-input-group-icon e-search-icon e-icons" \
                    tabindex="-1" title="' + this.l10n.getConstant('Search') + '" aria-label= "search"></span> \
                    </div>';
            }
        }
        this.bindSearchEvents();
    }

    private createToolbar(): void {
        let items: ItemModel[] = this.getResponsiveToolbarItems(this.getItems());
        this.toolbar = new tool({
            items: items,
            clicked: this.toolbarClickHandler.bind(this),
            enablePersistence: this.parent.enablePersistence,
            enableRtl: this.parent.enableRtl,
            created: this.toolbarCreated.bind(this)
        });
        (<{ isReact?: boolean }>this.toolbar).isReact = this.parent.isReact;
        this.toolbar.on('render-react-toolbar-template', this.addReactToolbarPortals, this);
        let isStringTemplate: string = 'isStringTemplate';
        this.toolbar[isStringTemplate] = true;
        let viewStr: string = 'viewContainerRef';
        let registerTemp: string = 'registeredTemplate';
        if (this.parent[viewStr]) {
            this.toolbar[registerTemp] = {};
            this.toolbar[viewStr] = this.parent[viewStr];
        }
        this.element = this.parent.createElement('div', { id: this.gridID + '_toolbarItems' });
        if (this.parent.enableAdaptiveUI) {
            this.toolbar.overflowMode = 'Popup';
            this.element.classList.add('e-res-toolbar');
        }
        if (this.parent.toolbarTemplate) {
            if (!isBlazor() && typeof (this.parent.toolbarTemplate) === 'string') {
                this.toolbar.appendTo(this.parent.toolbarTemplate);
                this.element = this.toolbar.element;
            } else {
                if (isBlazor()) {
                    let tempID: string = this.parent.element.id + 'toolbarTemplate';
                    let item: ItemModel = appendChildren(
                        this.element,
                        templateCompiler(this.parent.toolbarTemplate)({}, this.parent, 'toolbarTemplate', tempID));
                    let items: ItemModel = this.getItem(item);
                    this.toolbar.items.push(items);
                    this.toolbar.appendTo(this.element);
                    updateBlazorTemplate(this.parent.element.id + 'toolbarTemplate', 'ToolbarTemplate', this.parent);
                } else {
                    let isReactCompiler: boolean = this.parent.isReact && typeof (this.parent.toolbarTemplate) !== 'string';
                    let ID: string = this.parent.element.id + 'toolbarTemplate';
                    if (isReactCompiler) {
                        templateCompiler(this.parent.toolbarTemplate)({}, this.parent, 'toolbarTemplate', ID, null, null, this.element);
                        this.parent.renderTemplates();
                    } else {
                        appendChildren(this.element, templateCompiler(this.parent.toolbarTemplate)({}, this.parent, 'toolbarTemplate'));
                    }
                }
            }
        } else {
            this.toolbar.appendTo(this.element);
        }
        this.parent.element.insertBefore(this.element, this.parent.getHeaderContent());
    }

    private addReactToolbarPortals(args: Object[]): void {
        if (this.parent.isReact && args) {
            (<{ portals?: Object[] }>this.parent).portals = (<{ portals?: Object[] }>this.parent).portals.concat(args);
            this.parent.renderTemplates();
        }
    }

    private renderResponsiveSearch(isRender: boolean): void {
        if (isRender) {
            this.toolbarCreated(true);
            this.refreshResponsiveToolbarItems(ResponsiveToolbarAction.isSearch);
            this.searchElement = (<HTMLInputElement>select('#' + this.gridID + '_searchbar', this.element));
            let right: HTMLElement = parentsUntil(this.searchElement, 'e-toolbar-right') as HTMLElement;
            right.classList.add('e-responsive-right');
            if (this.parent.searchSettings) {
                this.updateSearchBox();
            }
            this.searchBoxObj.searchFocus({ target: this.searchElement });
            this.searchElement.focus();
        } else {
            let right: HTMLElement = parentsUntil(this.searchElement, 'e-toolbar-right') as HTMLElement;
            right.classList.remove('e-responsive-right');
            this.refreshResponsiveToolbarItems(ResponsiveToolbarAction.isInitial);
            this.toolbarCreated(false);
            this.unWireEvent();
            this.searchElement = undefined;
        }
    }

    private getResponsiveToolbarItems(items: ItemModel[]): ItemModel[] {
        if (this.parent.enableAdaptiveUI) {
            for (let i: number = 0; i < items.length; i++) {
                items[i].visible = (items[i].id === this.parent.element.id + '_add'
                    || items[i].id === this.parent.element.id + '_search' || items[i].id === this.parent.element.id + '_responsivesort'
                    || items[i].id === this.parent.element.id + '_responsivefilter');
            }
        }
        return items;
    }

    private refreshResponsiveToolbarItems(action: ResponsiveToolbarAction): ItemModel[] {
        let items: ItemModel[] = this.toolbar.items;
        let initial: string[] = ['add', 'search', 'responsivesort', 'responsivefilter'];
        if (this.parent.getSelectedRowIndexes().length) {
            initial.push('edit', 'delete');
            if (this.parent.rowRenderingMode !== 'Vertical') {
                initial.push('update', 'cancel');
            }
        }
        let search: string[] = ['responsiveback', 'search'];
        let buttons: string[] = action === ResponsiveToolbarAction.isInitial ? initial : search;
        for (let i: number = 0; i < items.length; i++) {
            let names: string[] = items[i].id.split('_');
            let ele: HTMLElement = this.element.querySelector('#' + items[i].id);
            if (ele) {
                let parent: HTMLElement = parentsUntil(ele, 'e-toolbar-item') as HTMLElement;
                if (buttons.indexOf(names[1]) > -1) {
                    parent.classList.remove('e-hidden');
                } else {
                    parent.classList.add('e-hidden');
                }
            }
        }
        return items;
    }

    private refreshToolbarItems(args?: { editSettings: EditSettingsModel, name: string }): void {
        let gObj: IGrid = this.parent;
        let enableItems: string[] = [];
        let disableItems: string[] = [];
        let edit: EditSettingsModel = gObj.editSettings;
        let hasData: number = gObj.currentViewData && gObj.currentViewData.length;
        edit.allowAdding ? enableItems.push(this.gridID + '_add') : disableItems.push(this.gridID + '_add');
        edit.allowEditing && hasData ? enableItems.push(this.gridID + '_edit') : disableItems.push(this.gridID + '_edit');
        edit.allowDeleting && hasData ? enableItems.push(this.gridID + '_delete') : disableItems.push(this.gridID + '_delete');
        if (gObj.editSettings.mode === 'Batch') {
            if (gObj.element.querySelectorAll('.e-updatedtd').length && (edit.allowAdding || edit.allowEditing)) {
                enableItems.push(this.gridID + '_update');
                enableItems.push(this.gridID + '_cancel');
            } else {
                disableItems.push(this.gridID + '_update');
                disableItems.push(this.gridID + '_cancel');
            }
        } else {
            if (gObj.isEdit && (edit.allowAdding || edit.allowEditing)) {
                enableItems = [this.gridID + '_update', this.gridID + '_cancel'];
                disableItems = [this.gridID + '_add', this.gridID + '_edit', this.gridID + '_delete'];
            } else {
                disableItems.push(this.gridID + '_update');
                disableItems.push(this.gridID + '_cancel');
            }
        }
        this.enableItems(enableItems, true);
        this.enableItems(disableItems, false);
    }

    private getItems(): ItemModel[] {
        let items: ItemModel[] = [];
        let toolbarItems: (ToolbarItems | string | ItemModel | ToolbarItem)[] = this.parent.toolbar || [];
        if (typeof (this.parent.toolbar) === 'string') {
            return [];
        }
        for (let item of toolbarItems) {
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
        if (this.parent.rowRenderingMode === 'Vertical') {
            if (this.parent.allowFiltering && this.parent.filterSettings.type !== 'FilterBar') {
                items.push(this.getItemObject('responsiveFilter'));
            }
            if (this.parent.allowSorting) {
                items.push(this.getItemObject('responsiveSort'));
            }
        }
        if (this.parent.enableAdaptiveUI) {
            items.push(this.getItemObject('responsiveBack'));
        }
        return items;
    }

    private getItem(itemObject: ItemModel): ItemModel {
        let item: ItemModel = this.predefinedItems[itemObject.text];
        return item ? extend(item, item, itemObject) : itemObject;
    }

    private getItemObject(itemName: string): ItemModel {
        return this.predefinedItems[itemName] || { text: itemName, id: this.gridID + '_' + itemName };
    }

    /**
     * Enables or disables ToolBar items.
     * @param {string[]} items - Defines the collection of itemID of ToolBar items.
     * @param {boolean} isEnable - Defines the items to be enabled or disabled.
     * @return {void}
     * @hidden
     */
    public enableItems(items: string[], isEnable: boolean): void {
        for (let item of items) {
            let element: HTMLElement = select('#' + item, this.element);
            if (element) {
                this.toolbar.enableItems(element.parentElement, isEnable);
            }
        }
    }

    private toolbarClickHandler(args: ClickEventArgs): void {
        let gObj: IGrid = this.parent;
        let gID: string = this.gridID;
        extend(args, { cancel: false });
        let newArgs: Object = !isBlazor() || this.parent.isJsComponent ? args : { item: args.item, cancel: args.cancel, name: args.name };
        let originalEvent: Event = args.originalEvent;
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
                        break;
                    case gID + '_columnchooser':
                        let tarElement: Element = this.parent.element.querySelector('.e-ccdiv');
                        let y: number = tarElement.getBoundingClientRect().top;
                        let x: number = tarElement.getBoundingClientRect().left;
                        let targetEle: Element = (<HTMLElement>toolbarargs.originalEvent.target);
                        y = tarElement.getBoundingClientRect().top + (<HTMLElement>tarElement).offsetTop;
                        gObj.createColumnchooser(x, y, targetEle);
                        break;
                    case 'copy':
                        if (isBlazor()) {
                            gObj.copy();
                        }
                        break;
                    case 'copyheader':
                    case 'copyHeader':
                        if (isBlazor()) {
                            gObj.copy(true);
                        }
                        break;
                    case gID + '_responsivefilter':
                        gObj.showResponsiveCustomFilter();
                        break;
                    case gID + '_responsivesort':
                        gObj.showResponsiveCustomSort();
                        break;
                    case gID + '_responsiveback':
                        this.renderResponsiveSearch(false);
                        break;
                }
            }
        });
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
            this.search();
        }
    }

    private search(): void {
        this.parent.search(this.searchElement.value);
    }

    private updateSearchBox(): void {
        if (this.searchElement) {
            this.searchElement.value = this.parent.searchSettings.key;
        }
    }

    private wireEvent(): void {
        if (this.searchElement) {
            this.searchBoxObj = new SearchBox(this.searchElement);
            EventHandler.add(this.searchElement, 'keyup', this.keyUpHandler, this);
            this.searchBoxObj.wireEvent();
        }
    }

    private unWireEvent(): void {
        if (this.searchElement) {
            EventHandler.remove(this.searchElement, 'keyup', this.keyUpHandler);
            this.searchBoxObj.unWireEvent();
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
        this.parent.on(events.setFullScreenDialog, this.reRenderToolbar, this);
        this.parent.on(events.initialEnd, this.render, this);
        this.parent.on(events.uiUpdate, this.onPropertyChanged, this);
        this.parent.on(events.inBoundModelChanged, this.updateSearchBox.bind(this));
        this.parent.on(events.modelChanged, this.refreshToolbarItems, this);
        this.parent.on(events.toolbarRefresh, this.refreshToolbarItems, this);
        this.parent.on(events.inBoundModelChanged, this.modelChanged, this);
        this.parent.on(events.dataBound, this.refreshToolbarItems, this);
        this.parent.on(events.click, this.removeResponsiveSearch, this);
        this.parent.on(events.rowModeChange, this.reRenderToolbar, this);
        this.rowSelectedFunction = this.rowSelected.bind(this);
        this.rowDeSelectedFunction = this.rowSelected.bind(this);
        this.parent.addEventListener(events.rowSelected, this.rowSelectedFunction);
        this.parent.addEventListener(events.rowDeselected, this.rowDeSelectedFunction);
    }

    protected removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.setFullScreenDialog, this.reRenderToolbar);
        this.parent.off(events.initialEnd, this.render);
        this.parent.off(events.uiUpdate, this.onPropertyChanged);
        this.parent.off(events.inBoundModelChanged, this.updateSearchBox);
        this.parent.off(events.modelChanged, this.refreshToolbarItems);
        this.parent.off(events.toolbarRefresh, this.refreshToolbarItems);
        this.parent.off(events.inBoundModelChanged, this.modelChanged);
        this.parent.off(events.dataBound, this.refreshToolbarItems);
        this.parent.off(events.click, this.removeResponsiveSearch);
        this.parent.off(events.rowModeChange, this.reRenderToolbar);
        this.parent.removeEventListener(events.rowSelected, this.rowSelectedFunction);
        this.parent.removeEventListener(events.rowDeselected, this.rowDeSelectedFunction);
    }

    private removeResponsiveSearch(e: MouseEventArgs): void {
        let target: Element = e.target as Element;
        let isSearch: boolean = target.classList.contains('e-search-icon') || target.classList.contains('e-search-wrapper');
        if (this.parent.enableAdaptiveUI && !isSearch && this.searchElement
            && !parentsUntil(e.target as Element, 'e-res-toolbar')) {
            this.renderResponsiveSearch(false);
        }
    }

    private rowSelected(): void {
        if (this.parent.enableAdaptiveUI) {
            this.refreshResponsiveToolbarItems(ResponsiveToolbarAction.isInitial);
        }
    }

    /**
     * For internal use only - Get the module name.
     */
    private getModuleName(): string {
        return 'toolbar';
    }
}