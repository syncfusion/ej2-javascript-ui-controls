/**
 * Toolbar action related code goes here
 */
import { Gantt } from '../base/gantt';
import { Toolbar as NavToolbar, ItemModel, ClickEventArgs } from '@syncfusion/ej2-navigations';
import { createElement, extend, isNullOrUndefined, remove, getValue, EventHandler, addClass } from '@syncfusion/ej2-base';
import * as cls from '../base/css-constants';
import * as events from '../base/constant';
import { RowSelectEventArgs } from '@syncfusion/ej2-grids';
import { ToolbarItem } from '../base/enum';
import { EditSettingsModel } from '../models/edit-settings-model';
import { TextBox } from '@syncfusion/ej2-inputs';
import { IGanttData } from '../base/common';
export class Toolbar {
    private parent: Gantt;
    private predefinedItems: { [key: string]: ItemModel } = {};
    private id: string;
    public toolbar: NavToolbar;
    private items: string[] = ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search',
        'PrevTimeSpan', 'NextTimeSpan', 'ZoomIn', 'ZoomOut', 'ZoomToFit', 'ExcelExport',
        'CsvExport', 'PdfExport', 'Indent', 'Outdent', 'CriticalPath'];
    public element: HTMLElement;
    private searchElement: HTMLInputElement;
    constructor(parent: Gantt) {
        this.parent = parent;
        this.id = this.parent.element.id;
        this.parent.on('ui-toolbarupdate', this.propertyChanged, this);
    }
    private getModuleName(): string {
        return 'toolbar';
    }
    /**
     * @returns {void} .
     * @private
     */
    public renderToolbar(): void {
        const toolbarItems: (ToolbarItem | string | ItemModel)[] = this.parent.toolbar || [];
        if (toolbarItems.length > 0) {
            this.element = createElement(
                'div', { id: this.parent.controlId + '_Gantt_Toolbar', className: cls.toolbar }
            );
            if (this.parent.treeGrid.grid.headerModule) {
                this.parent.element.insertBefore(this.element, this.parent.treeGridPane.offsetParent);
            } else {
                this.parent.element.appendChild(this.element);
            }
            const preItems: ToolbarItem[] = ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll',
                'PrevTimeSpan', 'NextTimeSpan', 'ZoomIn', 'ZoomOut', 'ZoomToFit', 'ExcelExport', 'CsvExport',
                'PdfExport', 'Indent', 'Outdent', 'CriticalPath', 'Undo', 'Redo'];
            for (const item of preItems) {
                let itemStr: string;
                let localeName: string;
                if (item === 'CriticalPath') {
                    itemStr =  'critical-path';
                    localeName = 'criticalPath';
                }
                else {
                    itemStr =  item.toLowerCase();
                    localeName = item[0].toLowerCase() + item.slice(1);
                }

                this.predefinedItems[item as string] = {
                    id: this.parent.element.id + '_' + itemStr, prefixIcon: 'e-' + itemStr,
                    text: this.parent.isAdaptive ? '' : this.parent.localeObj.getConstant(localeName),
                    tooltipText: this.parent.localeObj.getConstant(localeName) + ((localeName === 'add' ||
                        localeName === 'edit' || localeName === 'delete') ? this.parent.localeObj.getConstant('task') :
                        (localeName === 'expandAll' || localeName === 'collapseAll') ?
                            this.parent.localeObj.getConstant('tasks') : ''),
                    align: this.parent.isAdaptive ? 'Right' : 'Left'
                };
                if (this.parent.enableRtl) {
                    if (item === 'PrevTimeSpan') {
                        this.predefinedItems[item as string].prefixIcon = 'e-nexttimespan';
                    }
                    if (item === 'NextTimeSpan') {
                        this.predefinedItems[item as string].prefixIcon = 'e-prevtimespan';
                    }
                }
            }
            const searchLocalText: string = this.parent.localeObj.getConstant('search');
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
                    template: '<div class="e-input-group e-search" role="search">' +
                '<input id="' + this.id + '_searchbar" class="e-input" name="input" type="search"' +
                // eslint-disable-next-line
                'placeholder= \"' + searchLocalText + '\"/>' +
                '<span id="' + this.id + '_searchbutton" class="e-input-group-icon e-search-icon e-icons"' +
                'tabindex="-1" title="' + searchLocalText + '" aria-label= "search" role="button"></span>' +
                '</div>',
                    tooltipText: searchLocalText,
                    align: 'Right', cssClass: 'e-search-wrapper'
                };
            }
            this.createToolbar();
        }
    }

    private addReactToolbarPortals(args: Object[]): void {
        if ((this.parent as Gantt).isReact && args) {
            this.parent.portals = this.parent.portals.concat(args);
            this.parent.renderTemplates();
        }
    }

    private createToolbar(): void {
        const items: ItemModel[] = this.getItems();
        this.toolbar = new NavToolbar({
            items: items,
            enableRtl : this.parent.enableRtl,
            clicked: this.toolbarClickHandler.bind(this),
            height: this.parent.isAdaptive ? 48 : 'auto'
        });
        this.toolbar.isStringTemplate = true;
        this.toolbar.isReact = (this.parent as Gantt).isReact;
        this.toolbar.on('render-react-toolbar-template', this.addReactToolbarPortals, this);
        this.toolbar.appendTo(this.element);
        if (this.parent.treeGrid.grid && (this.parent as Gantt).isReact) {
            (this.parent.treeGrid.grid).portals = (this.parent as Gantt).portals;
        }
        const cancelItem: Element = this.element.querySelector('#' + this.parent.element.id + '_cancel');
        const updateItem: Element = this.element.querySelector('#' + this.parent.element.id + '_update');
        if (cancelItem) {
            addClass([cancelItem], cls.focusCell);
        }
        if (updateItem) {
            addClass([updateItem], cls.focusCell);
        }
        let template: boolean = false;
        this.parent.toolbar.map((e: string | ItemModel) => {
            if (e === 'Search') {
                template = true;
            }
        });
        if (this.parent.isAdaptive && template) {
            this.element.insertBefore(this.getSearchBarElement(), this.element.childNodes[0]);
            this.searchElement = this.element.querySelector('#' + this.parent.element.id + '_searchbar');
            const textObj: TextBox = new TextBox({
                placeholder: this.parent.localeObj.getConstant('search'),
                enableRtl: this.parent.enableRtl,
                floatLabelType: 'Never',
                showClearButton: true
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
        this.enableItems([this.parent.controlId + '_redo', this.parent.controlId + '_undo'], false); // disable toolbar items.
        if (this.parent.readOnly) {
            this.enableItems(
                [this.parent.element.id + '_add', this.parent.element.id + '_update', this.parent.element.id + '_delete'
                    , this.parent.element.id + '_cancel', this.parent.element.id + '_indent', this.parent.element.id + '_outdent'],
                false);
        }
    }
    private getSearchBarElement(): HTMLElement {
        const div: HTMLElement = createElement('div', { className: 'e-adaptive-searchbar', styles: 'display: none' });
        const textbox: HTMLElement = createElement('input', { attrs: { type: 'text' }, id: this.parent.element.id + '_searchbar' });
        const span: HTMLElement = createElement('span', { className: 'e-backarrowspan e-icons' });
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
    }
    private propertyChanged(property: object): void {
        const module: string = getValue('module', property);
        if (module !== this.getModuleName() || !this.parent.toolbar) {
            return;
        }
        if (this.element && this.element.parentNode) {
            remove(this.element);
        }
        this.renderToolbar();
        this.refreshToolbarItems();
    }
    private unWireEvent(): void {
        if (this.searchElement) {
            EventHandler.remove(this.searchElement, 'keyup', this.keyUpHandler);
            EventHandler.remove(this.searchElement, 'focus', this.focusHandler);
            EventHandler.remove(this.searchElement, 'blur', this.blurHandler);
            this.searchElement = null;
        }
        if (!this.parent.isDestroyed) {
            this.parent.off('ui-toolbarupdate', this.propertyChanged);
        }
    }
    private keyUpHandler(e: { keyCode: number }): void {
        if (e.keyCode === 13 && this.parent.searchSettings.key !== this.searchElement.value) {
            this.parent.searchSettings.key = this.searchElement.value;
            this.parent.dataBind();
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
     *
     * @returns {void} .
     * @hidden
     */
    public updateSearchTextBox(): void {
        if (this.searchElement && this.searchElement.value !== this.parent.searchSettings.key) {
            this.searchElement.value = this.parent.searchSettings.key;
        }
    }
    private getItems(): ItemModel[] {
        const items: ItemModel[] = [];
        const toolbarItems: (ToolbarItem | string | ItemModel)[] = this.parent.toolbar;
        let searchIndex: number = -1;
        toolbarItems.forEach((item: string | ItemModel, index: number) => {
            if ((typeof (item) === 'string' && item === 'Search') ||
                ((typeof (item) === 'object') && item.text === 'Search')) {
                searchIndex = index;
            }
        });
        if (searchIndex > -1) {
            const searchItem: (string | ItemModel)[] = toolbarItems.splice(searchIndex, 1);
            toolbarItems.push(searchItem[0]);
        }
        for (const item of toolbarItems) {
            if (typeof item === 'string') {
                items.push(this.getItemObject(item));
            } else {
                items.push(this.getItem(item));
            }
        }
        return items;
    }

    private getItem(itemObject: ItemModel): ItemModel {
        const item: ItemModel = this.predefinedItems[itemObject.text];
        return item ? extend(item, item, itemObject) : itemObject;
    }

    private getItemObject(itemName: string): ItemModel {
        return this.predefinedItems[itemName as string] || { text: itemName, id: this.id + '_' + itemName };
    }
    private toolbarClickHandler(arg: ClickEventArgs): void {
        const gObj: Gantt = this.parent;
        const gID: string = this.id;
        this.parent.isToolBarClick = false;
        extend(arg, { cancel: false });
        if (arg.item['properties'].id === this.parent.element.id + '_pdfexport' || arg.item['properties'].id === this.parent.element.id + '_critical-path') {
            if (!isNullOrUndefined(this.parent.loadingIndicator) && this.parent.loadingIndicator.indicatorType === 'Shimmer') {
                this.parent.showMaskRow();
            } else {
                this.parent.showSpinner();
            }
        }
        gObj.trigger(events.toolbarClick, arg, (args: ClickEventArgs) => {
            if (args.cancel) {
                return;
            } else {
                if (this.parent.isAdaptive === true) {
                    if (args.item.id === gID + '_edit' || args.item.id === gID + '_add' || args.item.id === gID + '_delete'
                        || args.item.id === gID + '_searchbutton' || args.item.id === gID + '_expandall'
                        || args.item.id === gID + '_collapseall') {
                        if (this.parent.selectionModule && this.parent.selectionSettings.type === 'Multiple') {
                            this.parent.selectionModule.hidePopUp();
                            (<HTMLElement>document.getElementsByClassName('e-gridpopup')[0]).style.display = 'none';
                        }
                    }
                }
                switch (!isNullOrUndefined(args.item) && args.item.id) {
                case gID + '_edit':
                    if (gObj.editModule && gObj.editSettings.allowEditing) {
                        gObj.editModule.dialogModule.openToolbarEditDialog();
                    }
                    break;
                case gID + '_indent':
                    if (gObj.editModule && gObj.selectionModule.getSelectedRecords().length) {
                        gObj.indent();
                    }
                    break;
                case gID + '_critical-path':
                    if (gObj.enableCriticalPath) {
                        gObj.enableCriticalPath = false;
                    }
                    else {
                        gObj.enableCriticalPath = true;
                    }
                    break;
                case gID + '_outdent':
                    if (gObj.editModule && gObj.selectionModule.getSelectedRecords().length) {
                        gObj.outdent();
                    }
                    break;
                case gID + '_update':
                    gObj.editModule.cellEditModule.isCellEdit = false;
                    gObj.treeGrid.grid.saveCell();
                    break;
                case gID + '_cancel':
                    gObj.cancelEdit();
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
                {
                    const searchButtonId: string = getValue('originalEvent.target.id', args);
                    if (searchButtonId === this.parent.element.id + '_searchbutton' && this.parent.filterModule) {
                        const keyVal: string =
                                (<HTMLInputElement>this.element.querySelector('#' + this.parent.element.id + '_searchbar')).value;
                        if (this.parent.searchSettings.key !== keyVal) {
                            this.parent.searchSettings.key = keyVal;
                            this.parent.dataBind();
                        }
                    }
                    break;
                }
                case gID + '_searchbutton':
                {
                    const adaptiveSearchbar: HTMLElement = this.element.querySelector('.e-adaptive-searchbar');
                    (adaptiveSearchbar.parentElement.childNodes[1] as HTMLElement).style.display = 'none';
                    adaptiveSearchbar.style.display = 'block';
                    break;
                }
                case gID + '_expandall':
                    this.parent.ganttChartModule.expandCollapseAll('expand');
                    this.parent.isCollapseAll = false;
                    break;
                case gID + '_collapseall':
                    this.parent.ganttChartModule.expandCollapseAll('collapse');
                    this.parent.isCollapseAll = true;
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
                case gID + '_undo':
                    this.parent.undo();
                    break;
                case gID + '_redo':
                    this.parent.redo();
                    break;
                }
            }
        });
    }
    /**
     *
     * @returns {void} .
     * @private
     */
    public zoomIn(): void {
        this.parent.timelineModule.processZooming(true);
        this.parent.timelineModule.isZooming = false;
    }
    /**
     *
     * @returns {void} .
     * @private
     */
    public zoomToFit(): void {
        if (this.parent.timelineModule.isZoomIn) {
            this.parent.timelineModule.isZoomIn = false;
        }
        this.parent.timelineModule.processZoomToFit();
        this.parent.ganttChartModule.updateScrollLeft(0);
        this.parent.timelineModule.isZoomToFit = false;
    }
    /**
     *
     * @returns {void} .
     * @private
     */
    public zoomOut(): void {
        this.parent.timelineModule.processZooming(false);
        this.parent.timelineModule.isZooming = false;
    }
    /**
     * To refresh toolbar items bases current state of tasks
     *
     * @param {RowSelectEventArgs} args .
     * @returns {void} .
     */
    public refreshToolbarItems(args?: RowSelectEventArgs): void {
        const gObj: Gantt = this.parent;
        let enableItems: string[] = [];
        let disableItems: string[] = [];
        const edit: EditSettingsModel = gObj.editSettings;
        const gID: string = this.id;
        let ind: number = gObj.selectedRowIndex;
        if (this.parent.loadChildOnDemand && this.parent.taskFields.hasChildMapping) {
            for (let i: number = 0; i < gObj.updatedRecords.length; i++) {
                if (gObj.updatedRecords[i as number].index === ind) {
                    ind = i;
                    break;
                }
            }
        }
        let previousGanttRecord: IGanttData;
        let isSelected: boolean = false;
        if (gObj.selectionModule) {
            if (gObj.selectionModule.getSelectedRecords().length === 1 || gObj.selectionModule.getSelectedRowCellIndexes().length === 1) {
                isSelected = true;
            }
        }
        if (gObj.selectionModule && gObj.selectionSettings.type === 'Multiple' && gObj.selectionModule.selectedRowIndexes.length > 1) {
            isSelected = false;
        }
        let isPersist: boolean = false;
        if (gObj.selectionModule && gObj.selectionSettings.persistSelection) {
            const selectedRecords: number = gObj.selectionModule.getSelectedRecords().length;
            if (gObj.selectionSettings.persistSelection && selectedRecords === 1) {
                for (let i: number = 0; i < selectedRecords; i++) {
                    const index: number = gObj.currentViewData.indexOf(gObj.selectionModule.getSelectedRecords()[i as number]);
                    if (index === -1) {
                        isPersist = true;
                    }
                }
            }
            if (isPersist) {
                isSelected = false;
            }
        }
        const toolbarItems: ItemModel[] = this.toolbar ? this.toolbar.items : [];
        const toolbarDefaultItems: string[] = [gID + '_add', gID + '_edit', gID + '_delete',
            gID + '_update', gID + '_cancel', gID + '_indent', gID + '_outdent'];
        const isResouceParent: boolean = (this.parent.viewType === 'ResourceView' && getValue('data.level', args) !== 0
            || this.parent.viewType === 'ProjectView');
        if (!isNullOrUndefined(this.parent.editModule)) {
            const touchEdit: boolean = gObj.editModule.taskbarEditModule ?
                gObj.editModule.taskbarEditModule.touchEdit : false;
            const hasData: number = gObj.flatData && gObj.flatData.length;
            // eslint-disable-next-line
            edit.allowAdding && !touchEdit ? enableItems.push(gID + '_add') : disableItems.push(gID + '_add');
            // eslint-disable-next-line
            edit.allowEditing && isResouceParent && hasData && isSelected && !touchEdit ?
                enableItems.push(gID + '_edit') : disableItems.push(gID + '_edit');
            if (!edit.allowEditing || ind === 0 || ind === -1 || !hasData || !isSelected || this.parent.viewType === 'ResourceView') {
                disableItems.push(gID + '_indent');
                disableItems.push(gID + '_outdent');
            } else {
                if (!isNullOrUndefined(gObj.updatedRecords[ind as number]) &&
                gObj.updatedRecords[ind as number].level === 0 && hasData && !touchEdit) {
                    enableItems.push(gID + '_indent');
                    disableItems.push(gID + '_outdent');
                } else {
                    previousGanttRecord = gObj.updatedRecords[ind - 1];
                    if (!isNullOrUndefined(gObj.updatedRecords[ind as number]) &&
                    (gObj.updatedRecords[ind as number].level - previousGanttRecord.level === 1) && ind !== -1) {
                        disableItems.push(gID + '_indent');
                        enableItems.push(gID + '_outdent');
                    } else if (ind !== -1) {
                        enableItems.push(gID + '_indent');
                        enableItems.push(gID + '_outdent');
                    }
                }
            }
            let isDeleteSelected: boolean = gObj.selectionModule ? gObj.selectionModule.getSelectedRecords().length > 0 ||
                gObj.selectionModule.getSelectedRowCellIndexes().length > 0 ? true : false : false;
            if (gObj.selectionModule && gObj.selectionSettings.persistSelection) {
                if (isPersist) {
                    isDeleteSelected = false;
                }
                const selectedRecords: IGanttData[] = gObj.selectionModule.getSelectedRecords();
                const selectedRecordsCount: number = selectedRecords.length;
                if (gObj.selectionSettings.persistSelection && selectedRecordsCount > 1) {
                    for (let i: number = 0; i < selectedRecordsCount; i++) {
                        const index : number = gObj.currentViewData.indexOf(selectedRecords[i as number]);
                        if (index > -1) {
                            isDeleteSelected = true;
                            break;
                        } else {
                            isDeleteSelected = false;
                        }
                    }
                }
            }
            if (edit.allowDeleting && hasData && isDeleteSelected && !touchEdit) {
                enableItems.push(gID + '_delete');
            } else {
                disableItems.push(gID + '_delete');
            }
            if (gObj.editSettings.mode === 'Auto' && !isNullOrUndefined(gObj.editModule.cellEditModule)
                && gObj.editModule.cellEditModule.isCellEdit) {
                // New initialization for enableItems and disableItems during isCellEdit
                enableItems = [];
                enableItems.push(gID + '_update', gID + '_cancel');
                disableItems = [];
                for (let t: number = 0; t < toolbarItems.length; t++) {
                    if (toolbarItems[t as number].id !== gID + '_update' && toolbarItems[t as number].id !== gID + '_cancel' &&
                        toolbarDefaultItems.indexOf(toolbarItems[t as number].id) !== -1) {
                        disableItems.push(toolbarItems[t as number].id);
                    }
                }
            } else {
                disableItems.push(gID + '_update', gID + '_cancel');
                for (let t: number = 0; t < toolbarItems.length; t++) {
                    if (enableItems.indexOf(toolbarItems[t as number].id) === -1 &&
                       disableItems.indexOf(toolbarItems[t as number].id) === -1) {
                        enableItems.push(toolbarItems[t as number].id);
                    }
                }
            }
        } else {
            disableItems.push(gID + '_delete');
            disableItems.push(gID + '_add');
            disableItems.push(gID + '_edit');
            disableItems.push(gID + '_update');
            disableItems.push(gID + '_cancel');
            disableItems.push(gID + '_indent');
            disableItems.push(gID + '_outdent');
        }
        for (let e: number = 0; e < enableItems.length; e++) {
            let index: number;
            for (let t: number = 0; t < toolbarItems.length; t++) {
                if (toolbarItems[t as number].id === enableItems[e as number]) {
                    index = t;
                    break;
                }
            }
            if (toolbarItems.length > 0) {
                this.toolbar.hideItem(index, false);
            }
        }
        for (let d: number = 0; d < disableItems.length; d++) {
            let index: number;
            for (let t: number = 0; t < toolbarItems.length; t++) {
                if (toolbarItems[t as number].id === disableItems[d as number]) {
                    index = t;
                    break;
                }
            }
            if (toolbarItems.length > 0) {
                this.toolbar.hideItem(index, true);
            }
        }
    }

    /**
     * Enables or disables ToolBar items.
     *
     * @param {string[]} items - Defines the collection of itemID of ToolBar items.
     * @param {boolean} isEnable - Defines the items to be enabled or disabled.
     * @returns {void} .
     * @hidden
     */
    public enableItems(items: string[], isEnable: boolean): void {
        for (const item of items) {
            const element: HTMLElement = this.element.querySelector('#' + item);
            if (element) {
                this.toolbar.enableItems(element.parentElement, isEnable);
            }
        }
    }

    /**
     * Destroys the Sorting of TreeGrid.
     *
     * @function destroy
     * @returns {void} .
     * @private
     */
    public destroy(): void {
        if (this.parent.filterModule) {
            this.unWireEvent();
        }
        if (this.parent.isDestroyed) { return; }
        if (this.toolbar) {
            this.toolbar.off('render-react-toolbar-template', this.addReactToolbarPortals);
        }
        this.toolbar.destroy();
        remove(this.element);
    }
}
