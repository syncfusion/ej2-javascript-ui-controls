import { L10n, EventHandler, closest, Browser, isNullOrUndefined, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { remove } from '@syncfusion/ej2-base';
import { ContextMenu as Menu, MenuEventArgs, OpenCloseMenuEventArgs } from '@syncfusion/ej2-navigations';
import { IGrid, IAction, ColumnMenuItemModel, NotifyArgs, ColumnMenuOpenEventArgs, ColumnMenuClickEventArgs } from '../base/interface';
import { parentsUntil, applyBiggerTheme } from '../base/util';
import { Column } from '../models/column';
import { ServiceLocator } from '../services/service-locator';
import * as events from '../base/constant';
import { OffsetPosition, calculatePosition } from '@syncfusion/ej2-popups';
import { createCheckBox } from '@syncfusion/ej2-buttons';
import { Group } from '../actions/group';
import { Sort } from '../actions/sort';
import { SortDescriptorModel } from '../base/grid-model';
import { Filter } from '../actions/filter';
import { Resize } from '../actions/resize';
import * as literals from '../base/string-literals';

/**
 * 'column menu module used to handle column menu actions'
 *
 * @hidden
 */
export class ColumnMenu implements IAction {
    //internal variables
    private element: HTMLUListElement;
    private gridID: string;
    private parent: IGrid;
    private serviceLocator: ServiceLocator;
    private columnMenu: Menu;
    private l10n: L10n;
    private defaultItems: { [key: string]: ColumnMenuItemModel } = {};
    private localeText: { [key: string]: string } = this.setLocaleKey();
    private targetColumn: Column;
    private disableItems: string[] = [];
    private hiddenItems: string[] = [];
    private headerCell: HTMLElement;
    private isOpen: boolean = false;
    // default class names
    private GROUP: string = 'e-icon-group';
    private UNGROUP: string = 'e-icon-ungroup';
    private ASCENDING: string = 'e-icon-ascending';
    private DESCENDING: string = 'e-icon-descending';
    private ROOT: string = 'e-columnmenu';
    private FILTER: string = 'e-icon-filter';
    private POP: string = 'e-filter-popup';
    private WRAP: string = 'e-col-menu';
    private CHOOSER: string = '_chooser_';

    constructor(parent?: IGrid, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.gridID = parent.element.id;
        this.serviceLocator = serviceLocator;
        this.addEventListener();
    }

    private wireEvents(): void {
        const elements: HTMLElement[] = this.getColumnMenuHandlers();
        for (let i: number = 0; i < elements.length; i++) {
            EventHandler.add(elements[i], 'mousedown', this.columnMenuHandlerDown, this);
        }
    }

    private unwireEvents(): void {
        const elements: HTMLElement[] = this.getColumnMenuHandlers();
        for (let i: number = 0; i < elements.length; i++) {
            EventHandler.remove(elements[i], 'mousedown', this.columnMenuHandlerDown);
        }
    }

    /**
     * To destroy the resize
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        const gridElement: Element = this.parent.element;
        if (!gridElement || (!gridElement.querySelector('.' + literals.gridHeader) && !gridElement.querySelector( '.' + literals.gridContent))) { return; }
        this.columnMenu.destroy();
        this.removeEventListener();
        this.unwireFilterEvents();
        this.unwireEvents();
        if (this.element.parentNode) {
            remove(this.element);
        }
    }

    public columnMenuHandlerClick(e: Event): void {
        if ((e.target as HTMLElement).classList.contains('e-columnmenu')) {
            this.columnMenu.items = this.getItems();
            this.columnMenu.dataBind();
            if ((this.isOpen && this.headerCell !== this.getHeaderCell(
                e as { target: EventTarget, preventDefault?: Function })) || document.querySelector('.e-grid-menu .e-menu-parent.e-ul')) {
                this.columnMenu.close();
                this.openColumnMenu(e as { target: EventTarget, preventDefault?: Function });
            } else if (!this.isOpen) {
                this.openColumnMenu(e as { target: EventTarget, preventDefault?: Function });
            } else {
                this.columnMenu.close();
            }
        }
    }

    /**
     * @param {string} field - specifies the field name
     * @returns {void}
     * @hidden
     */
    public openColumnMenuByField(field: string): void {
        this.openColumnMenu({ target: this.parent.getColumnHeaderByField(field).querySelector('.e-columnmenu') });
    }

    private openColumnMenu(e: { target: Element | EventTarget, preventDefault?: Function }): void {
        let pos: OffsetPosition = { top: 0, left: 0 };
        this.element.style.cssText = 'display:block;visibility:hidden';
        const elePos: ClientRect = this.element.getBoundingClientRect();
        this.element.style.cssText = 'display:none;visibility:visible';
        this.headerCell = this.getHeaderCell(e);
        if (Browser.isDevice) {
            pos.top = ((window.innerHeight / 2) - (elePos.height / 2));
            pos.left = ((window.innerWidth / 2) - (elePos.width / 2));
        } else {
            if (this.parent.enableRtl) {
                pos = calculatePosition(this.headerCell, 'left', 'bottom');
            } else {
                pos = calculatePosition(this.headerCell, 'right', 'bottom');
                pos.left -= elePos.width;
            }
        }
        this.columnMenu.open(pos.top, pos.left);
        if (e.preventDefault) {
            e.preventDefault();
        }
        applyBiggerTheme(this.parent.element, this.columnMenu.element.parentElement);
    }

    private columnMenuHandlerDown(): void {
        this.isOpen = !(this.element.style.display === 'none' || this.element.style.display === '');
    }

    private getColumnMenuHandlers(): HTMLElement[] {
        return [].slice.call(this.parent.getHeaderTable().getElementsByClassName(this.ROOT));
    }

    /**
     * @returns {void}
     * @hidden
     */
    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.headerRefreshed, this.wireEvents, this);
        this.parent.on(events.uiUpdate, this.enableAfterRenderMenu, this);
        this.parent.on(events.initialEnd, this.render, this);
        if (this.isFilterItemAdded()) {
            this.parent.on(events.filterDialogCreated, this.filterPosition, this);
        }
        this.parent.on(events.click, this.columnMenuHandlerClick, this);
        this.parent.on(events.keyPressed, this.keyPressHandler, this);
        this.parent.on(events.destroy, this.destroy, this);
    }

    /**
     * @returns {void}
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.headerRefreshed, this.unwireEvents);
        this.parent.off(events.uiUpdate, this.enableAfterRenderMenu);
        this.parent.off(events.initialEnd, this.render);
        if (this.isFilterItemAdded()) {
            this.parent.off(events.filterDialogCreated, this.filterPosition);
        }
        this.parent.off(events.click, this.columnMenuHandlerClick);
        this.parent.off(events.keyPressed, this.keyPressHandler);
        this.parent.off(events.destroy, this.destroy);
    }

    private keyPressHandler(e: KeyboardEventArgs): void {
        const gObj: IGrid = this.parent;
        if (e.action === 'altDownArrow') {
            const element: HTMLElement = gObj.focusModule.currentInfo.element;
            if (element && element.classList.contains('e-headercell')) {
                const column: Column = gObj.getColumnByUid(element.firstElementChild.getAttribute('e-mappinguid'));
                this.openColumnMenuByField(column.field);
            }
        }
    }

    private enableAfterRenderMenu(e: NotifyArgs): void {
        if (e.module === this.getModuleName() && e.enable) {
            if (this.columnMenu) {
                this.columnMenu.destroy();
                remove(this.element);
            }
            this.render();
        }
    }

    private render(): void {
        this.l10n = this.serviceLocator.getService<L10n>('localization');
        this.element = this.parent.createElement('ul', { id: this.gridID + '_columnmenu', className: 'e-colmenu' }) as HTMLUListElement;
        this.element.setAttribute('aria-label', this.l10n.getConstant('ColumnMenuDialogARIA'));
        this.parent.element.appendChild(this.element);
        this.columnMenu = new Menu({
            cssClass: 'e-grid-menu',
            enableRtl: this.parent.enableRtl,
            enablePersistence: this.parent.enablePersistence,
            locale: this.parent.locale,
            items: this.getItems(),
            select: this.columnMenuItemClick.bind(this),
            beforeOpen: this.columnMenuBeforeOpen.bind(this),
            onOpen: this.columnMenuOnOpen.bind(this),
            onClose: this.columnMenuOnClose.bind(this),
            beforeItemRender: this.beforeMenuItemRender.bind(this),
            beforeClose: this.columnMenuBeforeClose.bind(this)
        });
        this.columnMenu.appendTo(this.element);
        this.wireFilterEvents();
    }

    private wireFilterEvents(): void {
        if (!Browser.isDevice && this.isFilterItemAdded()) {
            EventHandler.add(this.element, 'mouseover', this.appendFilter, this);
        }
    }

    private unwireFilterEvents(): void {
        if (!Browser.isDevice && this.isFilterItemAdded()) {
            EventHandler.remove(this.element, 'mouseover', this.appendFilter);
        }
    }

    private beforeMenuItemRender(args: MenuEventArgs): void {
        if (this.isChooserItem(args.item)) {
            const field: string = this.getKeyFromId(args.item.id, this.CHOOSER);
            const column: Column[] = (<{ columnModel?: Column[] }>this.parent).columnModel.filter((col: Column) => col.field === field);
            const check: Element = createCheckBox(this.parent.createElement, false, {
                label: args.item.text,
                checked: column[0].visible
            });
            if (this.parent.enableRtl) {
                check.classList.add('e-rtl');
            }
            args.element.innerHTML = '';
            args.element.appendChild(check);
        } else if (args.item.id && this.getKeyFromId(args.item.id) === 'Filter') {
            args.element.appendChild(this.parent.createElement('span', { className: 'e-icons e-caret' }));
            args.element.className += 'e-filter-item e-menu-caret-icon';
        }
    }

    private columnMenuBeforeClose(args: ColumnMenuOpenEventArgs): void {
        const colChooser: Element = args.event ? closest(args.event.target as Node, '.e-menu-item') : null;
        if (!isNullOrUndefined(args.parentItem) &&
            this.getKeyFromId(args.parentItem.id) === 'ColumnChooser' &&
            colChooser && this.isChooserItem(colChooser)) {
            args.cancel = true;
        } else if (args.event && (closest(args.event.target as Element, '.' + this.POP)
            || (args.event.currentTarget && (args.event.currentTarget as Document).activeElement &&
                parentsUntil((args.event.currentTarget as Document).activeElement as Element, 'e-filter-popup'))
            || parentsUntil(args.event.target as Element, 'e-popup') ||
            (parentsUntil(args.event.target as Element, 'e-popup-wrapper'))) && !Browser.isDevice) {
            args.cancel = true;
        }
    }

    private isChooserItem(item: ColumnMenuItemModel): boolean {
        return item.id && item.id.indexOf('_colmenu_') >= 0 &&
            this.getKeyFromId(item.id, this.CHOOSER).indexOf('_colmenu_') === -1;
    }


    private columnMenuBeforeOpen(args: ColumnMenuOpenEventArgs): void {
        args.column = this.targetColumn = this.getColumn();
        this.parent.trigger(events.columnMenuOpen, args);
        for (const item of args.items) {
            const key: string = this.getKeyFromId(item.id);
            const dItem: ColumnMenuItemModel = this.defaultItems[key];
            if (this.getDefaultItems().indexOf(key) !== -1 && this.ensureDisabledStatus(key) && !dItem.hide) {
                this.disableItems.push(item.text);
            }
            if ((item as ColumnMenuItemModel).hide) {
                this.hiddenItems.push(item.text);
            }
        }
        this.columnMenu.enableItems(this.disableItems, false);
        this.columnMenu.hideItems(this.hiddenItems);
    }

    private columnMenuOnOpen(args: OpenCloseMenuEventArgs): void {
        if (args.element.className === 'e-menu-parent e-ul ') {
            if (args.element.offsetHeight > window.innerHeight || this.parent.element.offsetHeight > window.innerHeight) {
                args.element.style.maxHeight = (window.innerHeight) * 0.8 + 'px';
                args.element.style.overflowY = 'auto';
            }
        }
    }

    private ensureDisabledStatus(item: string): boolean {
        let status: boolean = false;
        switch (item) {
        case 'Group':
            if (!this.parent.allowGrouping || (this.parent.ensureModuleInjected(Group) && this.targetColumn
                && this.parent.groupSettings.columns.indexOf(this.targetColumn.field) >= 0 ||
                this.targetColumn && !this.targetColumn.allowGrouping)) {
                status = true;
            }
            break;
        case 'AutoFitAll':
        case 'AutoFit':
            status = !this.parent.ensureModuleInjected(Resize);
            break;
        case 'Ungroup':
            if (!this.parent.ensureModuleInjected(Group) || (this.parent.ensureModuleInjected(Group) && this.targetColumn
                && this.parent.groupSettings.columns.indexOf(this.targetColumn.field) < 0)) {
                status = true;
            }
            break;
        case 'SortDescending':
        case 'SortAscending':
            if (this.parent.allowSorting && this.parent.ensureModuleInjected(Sort)
                && this.parent.sortSettings.columns.length > 0 && this.targetColumn && this.targetColumn.allowSorting) {
                const sortColumns: SortDescriptorModel[] = this.parent.sortSettings.columns;
                for (let i: number = 0; i < sortColumns.length; i++) {
                    if (sortColumns[i].field === this.targetColumn.field
                        && sortColumns[i].direction.toLocaleLowerCase() === item.toLocaleLowerCase().replace('sort', '')) {
                        status = true;
                    }
                }
            } else if (!this.parent.allowSorting || !this.parent.ensureModuleInjected(Sort) ||
                this.parent.allowSorting && this.targetColumn && !this.targetColumn.allowSorting) {
                status = true;
            }
            break;
        case 'Filter':
            if (this.parent.allowFiltering && (this.parent.filterSettings.type !== 'FilterBar')
                && this.parent.ensureModuleInjected(Filter) && this.targetColumn && this.targetColumn.allowFiltering) {
                status = false;
            } else if (this.parent.ensureModuleInjected(Filter) && this.parent.allowFiltering
                && this.targetColumn && (!this.targetColumn.allowFiltering || this.parent.filterSettings.type === 'FilterBar')) {
                status = true;
            }
        }
        return status;
    }
    private columnMenuItemClick(args: ColumnMenuClickEventArgs): void {
        const item: string = this.isChooserItem(args.item) ? 'ColumnChooser' : this.getKeyFromId(args.item.id);
        switch (item) {
        case 'AutoFit':
            this.parent.autoFitColumns(this.targetColumn.field);
            break;
        case 'AutoFitAll':
            this.parent.autoFitColumns([]);
            break;
        case 'Ungroup':
            this.parent.ungroupColumn(this.targetColumn.field);
            break;
        case 'Group':
            this.parent.groupColumn(this.targetColumn.field);
            break;
        case 'SortAscending':
            this.parent.sortColumn(this.targetColumn.field, 'Ascending');
            break;
        case 'SortDescending':
            this.parent.sortColumn(this.targetColumn.field, 'Descending');
            break;
        case 'ColumnChooser':
            // eslint-disable-next-line no-case-declarations
            const key: string = this.getKeyFromId(args.item.id, this.CHOOSER);
            // eslint-disable-next-line no-case-declarations
            const checkbox: HTMLElement = args.element.querySelector('.e-checkbox-wrapper .e-frame') as HTMLElement;
            if (checkbox && checkbox.classList.contains('e-check')) {
                checkbox.classList.remove('e-check');
                this.parent.hideColumns(key, 'field');
            } else if (checkbox) {
                this.parent.showColumns(key, 'field');
                checkbox.classList.add('e-check');
            }
            break;
        case 'Filter':
            this.getFilter(args.element, args.item.id);
            break;
        }
        args.column = this.targetColumn;
        this.parent.trigger(events.columnMenuClick, args);
    }

    private columnMenuOnClose(args: OpenCloseMenuEventArgs): void {
        const parent: string = 'parentObj';
        if (args.items.length > 0 && args.items[0][parent] instanceof Menu) {
            this.columnMenu.enableItems(this.disableItems, false);
            this.disableItems = [];
            this.columnMenu.showItems(this.hiddenItems);
            this.hiddenItems = [];
            if (this.isFilterPopupOpen()) {
                this.getFilter(args.element, args.element.id, true);
            }
        }
        if (!this.parent.isFrozenGrid()) {
            this.parent.notify(events.restoreFocus, {});
        }
    }

    private getDefaultItems(): string[] {
        return ['AutoFitAll', 'AutoFit', 'SortAscending', 'SortDescending', 'Group', 'Ungroup', 'ColumnChooser', 'Filter'];
    }

    private getItems(): ColumnMenuItemModel[] {
        const items: ColumnMenuItemModel[] = [];
        const defultItems: string[] | ColumnMenuItemModel[] = this.parent.columnMenuItems ? this.parent.columnMenuItems : this.getDefault();
        for (const item of defultItems) {
            if (typeof item === 'string') {
                if (item === 'ColumnChooser') {
                    const col: ColumnMenuItemModel = this.getDefaultItem(item);
                    col.items = this.createChooserItems();
                    items.push(col);
                } else {
                    items.push(this.getDefaultItem(item));
                }

            } else {
                items.push(item);
            }
        }
        return items;
    }

    private getDefaultItem(item: string): ColumnMenuItemModel {
        let menuItem: ColumnMenuItemModel = {};
        switch (item) {
        case 'SortAscending':
            menuItem = { iconCss: this.ASCENDING };
            break;
        case 'SortDescending':
            menuItem = { iconCss: this.DESCENDING };
            break;
        case 'Group':
            menuItem = { iconCss: this.GROUP };
            break;
        case 'Ungroup':
            menuItem = { iconCss: this.UNGROUP };
            break;
        case 'Filter':
            menuItem = { iconCss: this.FILTER };
            break;
        }
        this.defaultItems[item] = {
            text: this.getLocaleText(item), id: this.generateID(item),
            iconCss: menuItem.iconCss ? 'e-icons ' + menuItem.iconCss : null
        };
        return this.defaultItems[item];
    }

    private getLocaleText(item: string): string {
        return this.l10n.getConstant(this.localeText[item]);
    }

    private generateID(item: string, append?: string): string {
        return this.gridID + '_colmenu_' + (append ? append + item : item);
    }

    private getKeyFromId(id: string, append?: string): string {
        return id.indexOf('_colmenu_') > 0 &&
            id.replace(this.gridID + '_colmenu_' + (append ? append : ''), '');
    }

    /**
     * @returns {HTMLElement} returns the HTMLElement
     * @hidden
     */
    public getColumnMenu(): HTMLElement {
        return this.element;
    }

    private getModuleName(): string {
        return 'columnMenu';
    }

    private setLocaleKey(): { [key: string]: string } {
        const localeKeys: { [key: string]: string } = {
            'AutoFitAll': 'autoFitAll',
            'AutoFit': 'autoFit',
            'Group': 'Group',
            'Ungroup': 'Ungroup',
            'SortAscending': 'SortAscending',
            'SortDescending': 'SortDescending',
            'ColumnChooser': 'Columnchooser',
            'Filter': 'FilterMenu'
        };
        return localeKeys;
    }

    private getHeaderCell(e: { target: Element | EventTarget }): HTMLElement {
        return <HTMLElement>closest(<HTMLElement>e.target, 'th.e-headercell');
    }

    private getColumn(): Column {
        if (this.headerCell) {
            const uid: string = this.headerCell.querySelector('.e-headercelldiv').getAttribute('e-mappinguid');
            return this.parent.getColumnByUid(uid);
        }
        return null;
    }

    private createChooserItems(): ColumnMenuItemModel[] {
        const items: ColumnMenuItemModel[] = [];
        for (const col of (<{ columnModel?: Column[] }>this.parent).columnModel) {
            if (col.showInColumnChooser && col.field) {
                items.push({ id: this.generateID(col.field, this.CHOOSER), text: col.headerText ? col.headerText : col.field });
            }
        }
        return items;
    }

    private appendFilter(e: Event): void {
        const filter: string = 'Filter';
        if (!this.defaultItems[filter]) { return; } else {
            const key: string = this.defaultItems[filter].id;
            if (closest((e as Event).target as Element, '#' + key) && !this.isFilterPopupOpen()) {
                this.getFilter((e as Event).target as Element, key);
            } else if (!closest((e as Event).target as Element, '#' + key) && this.isFilterPopupOpen()) {
                this.getFilter((e as Event).target as Element, key, true);
            }
        }
    }

    private getFilter(target: Element, id: string, isClose?: boolean): void {
        const filterPopup: HTMLElement = this.getFilterPop();
        if (filterPopup) {
            filterPopup.style.display = !Browser.isDevice && isClose ? 'none' : 'block';
        } else {
            this.parent.notify(events.filterOpen, {
                col: this.targetColumn, target: target, isClose: isClose, id: id
            });
        }
    }

    private setPosition(li: Element, ul: HTMLElement): void {
        const gridPos: ClientRect = this.parent.element.getBoundingClientRect();
        const liPos: ClientRect = li.getBoundingClientRect();
        let left: number = liPos.left - gridPos.left;
        let top: number = liPos.top - gridPos.top;
        if (gridPos.height < top) {
            top = top - ul.offsetHeight + liPos.height;
        } else if (gridPos.height < top + ul.offsetHeight) {
            top = gridPos.height - ul.offsetHeight;
        }
        if (window.innerHeight < ul.offsetHeight + top + gridPos.top) {
            top = window.innerHeight - ul.offsetHeight - gridPos.top;
        }
        if (top + gridPos.top < 0) {
            top = 0;
        }
        left += (this.parent.enableRtl ? - ul.offsetWidth : liPos.width);
        if (gridPos.width <= left + ul.offsetWidth) {
            left -= liPos.width + ul.offsetWidth;
            if (liPos.left < ul.offsetWidth) {
                left = liPos.left + ul.offsetWidth / 2;
            }
        } else if (left < 0) {
            left += ul.offsetWidth + liPos.width;
        }
        ul.style.top = top + 'px';
        ul.style.left = left + 'px';
    }

    private filterPosition(): void {
        const filterPopup: HTMLElement = this.getFilterPop();
        filterPopup.classList.add(this.WRAP);
        if (!Browser.isDevice) {
            const disp: string = filterPopup.style.display;
            filterPopup.style.cssText += 'display:block;visibility:hidden';
            const li: HTMLElement = this.element.querySelector('.' + this.FILTER) as HTMLElement;
            if (li) {
                this.setPosition(li.parentElement, filterPopup);
                filterPopup.style.cssText += 'display:' + disp + ';visibility:visible';
            }
        }
    }

    private getDefault(): string[] {
        const items: string[] = [];
        if (this.parent.ensureModuleInjected(Resize)) {
            items.push('AutoFitAll');
            items.push('AutoFit');
        }
        if (this.parent.allowGrouping && this.parent.ensureModuleInjected(Group)) {
            items.push('Group');
            items.push('Ungroup');
        }
        if (this.parent.allowSorting && this.parent.ensureModuleInjected(Sort)) {
            items.push('SortAscending');
            items.push('SortDescending');
        }
        items.push('ColumnChooser');
        if (this.parent.allowFiltering && (this.parent.filterSettings.type !== 'FilterBar') &&
            this.parent.ensureModuleInjected(Filter)) {
            items.push('Filter');
        }
        return items;
    }

    private isFilterPopupOpen(): boolean {
        const filterPopup: HTMLElement = this.getFilterPop();
        return filterPopup && filterPopup.style.display !== 'none';
    }

    private getFilterPop(): HTMLElement {
        if (Browser.isDevice && this.targetColumn !== null && this.parent.filterSettings.type === 'Menu') {
            return document.getElementById(this.targetColumn.uid + '-flmdlg');
        }
        return this.parent.element.querySelector('.' + this.POP) as HTMLElement;
    }

    private isFilterItemAdded(): boolean {
        return (this.parent.columnMenuItems &&
            (this.parent.columnMenuItems as string[]).indexOf('Filter') >= 0) || !this.parent.columnMenuItems;
    }
}
