/**
 * Toolbar action related code goes here
 */
import { Gantt } from '../base/gantt';
import { Toolbar as NavToolbar, ItemModel, ClickEventArgs } from '@syncfusion/ej2-navigations';
import { createElement, extend, isNullOrUndefined, remove, getValue, EventHandler, Browser, closest } from '@syncfusion/ej2-base';
import * as cls from '../base/css-constants';
import * as events from '../base/constant';
import { ToolbarItem } from '../base/enum';
import { EditSettingsModel } from '../models/edit-settings-model';
import { TextBox } from '@syncfusion/ej2-inputs';
export class Toolbar {
    private parent: Gantt;
    private predefinedItems: { [key: string]: ItemModel } = {};
    private id: string;
    public toolbar: NavToolbar;
    private items: string[] = ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search',
        'PrevTimeSpan', 'NextTimeSpan', 'ZoomIn', 'ZoomOut', 'ZoomToFit'];
    public element: HTMLElement;
    private searchElement: HTMLInputElement;
    constructor(parent: Gantt) {
        this.parent = parent;
        this.id = this.parent.element.id;
    }
    private getModuleName(): string {
        return 'toolbar';
    }
    /**
     * @private
     */
    public renderToolbar(): void {
        let toolbarItems: (ToolbarItem | string | ItemModel)[] = this.parent.toolbar || [];
        if (toolbarItems.length > 0) {
            this.element = createElement('div', { id: this.parent.controlId + '_Gantt_Toolbar', className: cls.toolbar });
            this.parent.element.appendChild(this.element);
            let preItems: ToolbarItem[] = ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll',
                'PrevTimeSpan', 'NextTimeSpan', 'ZoomIn', 'ZoomOut', 'ZoomToFit'];
            for (let item of preItems) {
                let itemStr: string = item.toLowerCase();
                let localeName: string = item[0].toLowerCase() + item.slice(1);
                this.predefinedItems[item] = {
                    id: this.parent.element.id + '_' + itemStr, prefixIcon: 'e-' + itemStr,
                    text: this.parent.isAdaptive ? '' : this.parent.localeObj.getConstant(localeName),
                    tooltipText: this.parent.localeObj.getConstant(localeName) + ((localeName === 'add' ||
                        localeName === 'edit' || localeName === 'delete') ? this.parent.localeObj.getConstant('task') :
                        (localeName === 'expandAll' || localeName === 'collapseAll') ?
                            this.parent.localeObj.getConstant('tasks') : ''),
                    align: this.parent.isAdaptive ? 'Right' : 'Left'
                };
            }
            let searchLocalText: string = this.parent.localeObj.getConstant('search');
            if (this.parent.isAdaptive) {
                (this.predefinedItems as { Search: ItemModel }).Search = {
                    id: this.id + '_searchbutton',
                    prefixIcon: 'e-search-icon',
                    tooltipText: searchLocalText,
                    align: 'Right'
                };
            } else {
                (this.predefinedItems as { Search: ItemModel }).Search = {
                    id: this.id + '_search',
                    template: '<div class="e-input-group e-search" role="search">\
                <input id="' + this.id + '_searchbar" class="e-input" name="input" type="search" \
                placeholder= \"' + searchLocalText + '\"/>\
                <span id="' + this.id + '_searchbutton" class="e-input-group-icon e-search-icon e-icons" \
                tabindex="-1" title="' + searchLocalText + '" aria-label= "search"></span> \
                </div>',
                    tooltipText: searchLocalText,
                    align: 'Right', cssClass: 'e-search-wrapper'
                };
            }
            this.createToolbar();
        }
    }

    private createToolbar(): void {
        let items: ItemModel[] = this.getItems();
        this.toolbar = new NavToolbar({
            items: items,
            clicked: this.toolbarClickHandler.bind(this),
            height: this.parent.isAdaptive ? 48 : 'auto'
        });
        this.toolbar.appendTo(this.element);
        if (this.parent.isAdaptive) {
            this.element.insertBefore(this.getSearchBarElement(), this.element.childNodes[0]);
            this.searchElement = this.element.querySelector('#' + this.parent.element.id + '_searchbar');
            let textObj: TextBox = new TextBox({
                placeholder: this.parent.localeObj.getConstant('search'),
                floatLabelType: 'Never',
                showClearButton: true,
            });
            textObj.appendTo(this.searchElement);
        } else {
            this.searchElement = this.element.querySelector('#' + this.parent.element.id + '_searchbar');
        }
        if (this.parent.filterModule) {
            this.wireEvent();
            if (this.parent.searchSettings) {
                this.updateSearchTextBox();
            }
        }
    }
    private getSearchBarElement(): HTMLElement {
        let div: HTMLElement = createElement('div', { className: 'e-adaptive-searchbar', styles: 'display: none' });
        let textbox: HTMLElement = createElement('input', { attrs: { type: 'text' }, id: this.parent.element.id + '_searchbar' });
        let span: HTMLElement = createElement('span', { className: 'e-backarrowspan e-icons' });
        span.onclick = () => {
            div.style.display = 'none';
            (this.element.childNodes[1] as HTMLElement).style.display = 'block';
        };
        div.appendChild(span);
        div.appendChild(textbox);
        return div;
    }

    private wireEvent(): void {
        if (this.searchElement) {
            EventHandler.add(this.searchElement, 'keyup', this.keyUpHandler, this);
            EventHandler.add(this.searchElement, 'focus', this.focusHandler, this);
            EventHandler.add(this.searchElement, 'blur', this.blurHandler, this);
        }
        if (this.toolbar) {
            let mouseDown: string = Browser.touchStartEvent;
            EventHandler.add(this.toolbar.element, mouseDown, this.mouseDownHandler, this);
        }
    }
    private unWireEvent(): void {
        if (this.searchElement) {
            EventHandler.remove(this.searchElement, 'keyup', this.keyUpHandler);
            EventHandler.remove(this.searchElement, 'focus', this.focusHandler);
            EventHandler.remove(this.searchElement, 'blur', this.blurHandler);
            this.searchElement = null;
        }
        if (this.toolbar) {
            let mouseDown: string = Browser.touchStartEvent;
            EventHandler.remove(this.toolbar.element, mouseDown, this.mouseDownHandler);
        }
    }
    private keyUpHandler(e: { keyCode: number }): void {
        if (e.keyCode === 13 && this.parent.searchSettings.key !== this.searchElement.value) {
            this.parent.searchSettings.key = this.searchElement.value;
            this.parent.dataBind();
        }
    }
    private mouseDownHandler(e: PointerEvent): void {
        if (e.target) {
            let element: Element = closest(e.target as HTMLElement, '.e-toolbar-item');
            if (!isNullOrUndefined(element) && !isNullOrUndefined(element.querySelector('.e-cancel'))) {
                this.parent.editModule.cellEditModule.isCellEdit = false;
                this.parent.treeGrid.closeEdit();
            }
        }
    }
    private focusHandler(e: FocusEvent): void {
        (e.target as HTMLElement).parentElement.classList.add('e-input-focus');
    }
    private blurHandler(e: FocusEvent): void {
        (e.target as HTMLElement).parentElement.classList.remove('e-input-focus');
    }
    /**
     * Method to set value for search input box
     * @hidden
     */
    public updateSearchTextBox(): void {
        if (this.searchElement && this.searchElement.value !== this.parent.searchSettings.key) {
            this.searchElement.value = this.parent.searchSettings.key;
        }
    }
    private getItems(): ItemModel[] {
        let items: ItemModel[] = [];
        let toolbarItems: (ToolbarItem | string | ItemModel)[] = this.parent.toolbar;
        for (let item of toolbarItems) {
            switch (typeof item) {
                case 'string':
                    items.push(this.getItemObject(item as string));
                    break;
                default:
                    items.push(this.getItem(item as ItemModel));
            }
        }
        return items;
    }

    private getItem(itemObject: ItemModel): ItemModel {
        let item: ItemModel = this.predefinedItems[itemObject.text];
        return item ? extend(item, item, itemObject) : itemObject;
    }

    private getItemObject(itemName: string): ItemModel {
        return this.predefinedItems[itemName] || { text: itemName, id: this.id + '_' + itemName };
    }
    private toolbarClickHandler(args: ClickEventArgs): void {
        let gObj: Gantt = this.parent;
        let gID: string = this.id;
        extend(args, { cancel: false });
        gObj.trigger(events.toolbarClick, args);
        if (args.cancel) {
            return;
        }
        switch (!isNullOrUndefined(args.item) && args.item.id) {
            case gID + '_edit':
                if (gObj.editModule && gObj.editSettings.allowEditing) {
                    gObj.editModule.dialogModule.openToolbarEditDialog();
                }
                break;
            case gID + '_update':
                gObj.editModule.cellEditModule.isCellEdit = false;
                gObj.treeGrid.endEdit();
                break;
            case gID + '_cancel':
                // gObj.editModule.cellEditModule.isCellEdit = false;
                // gObj.treeGrid.closeEdit();
                // console.log('Cancel editing');
                event.stopPropagation();
                break;
            case gID + '_add':
                if (gObj.editModule && gObj.editSettings.allowAdding) {
                    gObj.editModule.dialogModule.openAddDialog();
                }
                break;
            case gID + '_delete':
                if (this.parent.selectionModule && this.parent.editModule) {
                    if ((this.parent.selectionSettings.mode !== 'Cell' && this.parent.selectionModule.selectedRowIndexes.length)
                        || (this.parent.selectionSettings.mode === 'Cell' &&
                            this.parent.selectionModule.getSelectedRowCellIndexes().length)) {
                        this.parent.editModule.startDeleteAction();
                    }
                }
                break;
            case gID + '_search':
                let searchButtonId: string = getValue('originalEvent.target.id', args);
                if (searchButtonId === this.parent.element.id + '_searchbutton' && this.parent.filterModule) {
                    let keyVal: string = (<HTMLInputElement>this.element.querySelector('#' + this.parent.element.id + '_searchbar')).value;
                    if (this.parent.searchSettings.key !== keyVal) {
                        this.parent.searchSettings.key = keyVal;
                        this.parent.dataBind();
                    }
                }
                break;
            case gID + '_searchbutton':
                let adaptiveSearchbar: HTMLElement = this.element.querySelector('.e-adaptive-searchbar');
                (adaptiveSearchbar.parentElement.childNodes[1] as HTMLElement).style.display = 'none';
                adaptiveSearchbar.style.display = 'block';
                break;
            case gID + '_expandall':
                this.parent.ganttChartModule.expandCollapseAll('expand');
                break;
            case gID + '_collapseall':
                this.parent.ganttChartModule.expandCollapseAll('collapse');
                break;
            case gID + '_prevtimespan':
                this.parent.previousTimeSpan();
                break;
            case gID + '_nexttimespan':
                this.parent.nextTimeSpan();
                break;
            case gID + '_zoomin':
                this.zoomIn();
                break;
            case gID + '_zoomout':
                this.zoomOut();
                break;
            case gID + '_zoomtofit':
                this.zoomToFit();
                break;
        }
    }
    /**
     *
     * @return {void}
     * @private
     */
    public zoomIn(): void {
        this.parent.timelineModule.processZooming(true);
    }
    /**
     *
     * @return {void}
     * @private
     */
    public zoomToFit(): void {
        this.parent.timelineModule.processZoomToFit();
        this.parent.ganttChartModule.updateScrollLeft(0);
    }
    /**
     *
     * @return {void}
     * @private
     */
    public zoomOut(): void {
        this.parent.timelineModule.processZooming(false);
    }
    /**
     * To refresh toolbar items bases current state of tasks
     */
    public refreshToolbarItems(): void {
        let gObj: Gantt = this.parent;
        let enableItems: string[] = [];
        let disableItems: string[] = [];
        let edit: EditSettingsModel = gObj.editSettings;
        let gID: string = this.id;
        let isSelected: boolean = gObj.selectionModule ? gObj.selectionModule.selectedRowIndexes.length === 1 ||
            gObj.selectionModule.getSelectedRowCellIndexes().length === 1 ? true : false : false;
        let toolbarItems: ItemModel[] = this.toolbar.items;
        let toolbarDefaultItems: string[] = [gID + '_add', gID + '_edit', gID + '_delete',
        gID + '_update', gID + '_cancel'];
        if (!isNullOrUndefined(this.parent.editModule)) {
            let hasData: number = gObj.currentViewData && gObj.currentViewData.length;
            edit.allowAdding ? enableItems.push(gID + '_add') : disableItems.push(gID + '_add');
            edit.allowEditing && hasData && isSelected ? enableItems.push(gID + '_edit') : disableItems.push(gID + '_edit');
            let isDeleteSelected: boolean = gObj.selectionModule ? gObj.selectionModule.selectedRowIndexes.length > 0 ||
                gObj.selectionModule.getSelectedRowCellIndexes().length > 0 ? true : false : false;
            edit.allowDeleting && hasData && isDeleteSelected ? enableItems.push(gID + '_delete') : disableItems.push(gID + '_delete');
            if (gObj.editSettings.mode === 'Auto' && !isNullOrUndefined(gObj.editModule.cellEditModule)
                && gObj.editModule.cellEditModule.isCellEdit) {
                // New initialization for enableItems and disableItems during isCellEdit
                enableItems = [];
                enableItems.push(gID + '_update', gID + '_cancel');
                disableItems = [];
                for (let t: number = 0; t < toolbarItems.length; t++) {
                    if (toolbarItems[t].id !== gID + '_update' && toolbarItems[t].id !== gID + '_cancel' &&
                        toolbarDefaultItems.indexOf(toolbarItems[t].id) !== -1) {
                        disableItems.push(toolbarItems[t].id);
                    }
                }
            } else {
                disableItems.push(gID + '_update', gID + '_cancel');
                for (let t: number = 0; t < toolbarItems.length; t++) {
                    if (enableItems.indexOf(toolbarItems[t].id) === -1 && disableItems.indexOf(toolbarItems[t].id) === -1) {
                        enableItems.push(toolbarItems[t].id);
                    }
                }
            }
        } else {
            disableItems.push(gID + '_delete');
            disableItems.push(gID + '_add');
            disableItems.push(gID + '_edit');
            disableItems.push(gID + '_update');
            disableItems.push(gID + '_cancel');
        }
        for (let e: number = 0; e < enableItems.length; e++) {
            let index: number;
            for (let t: number = 0; t < toolbarItems.length; t++) {
                if (toolbarItems[t].id === enableItems[e]) {
                    index = t;
                    break;
                }
            }
            this.toolbar.hideItem(index, false);
        }
        for (let d: number = 0; d < disableItems.length; d++) {
            let index: number;
            for (let t: number = 0; t < toolbarItems.length; t++) {
                if (toolbarItems[t].id === disableItems[d]) {
                    index = t;
                    break;
                }
            }
            this.toolbar.hideItem(index, true);
        }
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
            let element: HTMLElement = <HTMLElement>this.element.querySelector('#' + item);
            if (element) {
                this.toolbar.enableItems(element.parentElement, isEnable);
            }
        }
    }

    /**
     * Destroys the Sorting of TreeGrid.
     * @method destroy
     * @return {void}
     * @private
     */
    public destroy(): void {
        if (this.parent.isDestroyed) { return; }
        this.toolbar.destroy();
        if (this.parent.filterModule) {
            this.unWireEvent();
        }
        remove(this.element);
    }
}