import { L10n, closest, isNullOrUndefined, KeyboardEventArgs, EventHandler } from '@syncfusion/ej2-base';
import { remove } from '@syncfusion/ej2-base';
import { ContextMenu as Menu, MenuItemModel } from '@syncfusion/ej2-navigations';
import { OpenCloseMenuEventArgs } from '@syncfusion/ej2-navigations';
import { IGrid, ContextMenuItemModel, IAction, NotifyArgs, ContextMenuOpenEventArgs, ContextMenuClickEventArgs } from '../base/interface';
import { Column } from '../models/column';
import { ServiceLocator } from '../services/service-locator';
import * as events from '../base/constant';
import { SortDescriptorModel } from '../base/grid-model';
import { Resize } from '../actions/resize';
import { Page } from '../actions/page';
import { parentsUntil, applyBiggerTheme } from '../base/util';
import { Group } from '../actions/group';
import { Sort } from '../actions/sort';
import { PdfExport } from '../actions/pdf-export';
import { ExcelExport } from '../actions/excel-export';
import { RowInfo } from '../base/interface';
import * as literals from '../base/string-literals';

export const menuClass: CMenuClassList = {
    header: '.' + literals.gridHeader,
    content:  '.' + literals.gridContent,
    edit: '.e-inline-edit',
    batchEdit: '.e-editedbatchcell',
    editIcon: 'e-edit',
    pager: '.e-gridpager',
    delete: 'e-delete',
    save: 'e-save',
    cancel: 'e-cancel',
    copy: 'e-copy',
    pdf: 'e-pdfexport',
    group: 'e-icon-group',
    ungroup: 'e-icon-ungroup',
    csv: 'e-csvexport',
    excel: 'e-excelexport',
    fPage: 'e-icon-first',
    nPage: 'e-icon-next',
    lPage: 'e-icon-last',
    pPage: 'e-icon-prev',
    ascending: 'e-icon-ascending',
    descending: 'e-icon-descending',
    groupHeader: 'e-groupdroparea',
    touchPop: 'e-gridpopup',
    autofit: 'e-icon-autofit',
    autofitall: 'e-icon-autofitall',
    chart: 'e-grid-chart-icon',
    barChart: 'e-grid-bar-chart-icon',
    bar: 'e-grid-bar-icon',
    stackingBar: 'e-grid-stacking-bar-icon',
    stackingBar100: 'e-grid-stacking-bar-100-icon',
    pie: 'e-grid-pie-icon',
    columnChart: 'e-grid-column-chart-icon',
    column: 'e-grid-column-icon',
    stackingColumn: 'e-grid-stacking-column-icon',
    stackingColumn100: 'e-grid-stacking-column-100-icon',
    lineChart: 'e-grid-line-chart-icon',
    line: 'e-grid-line-icon',
    stackingLine: 'e-grid-stacking-line-icon',
    stackingLine100: 'e-grid-stacking-line-100-icon',
    areaChart: 'e-grid-area-chart-icon',
    area: 'e-grid-area-icon',
    stackingArea: 'e-grid-stacking-area-icon',
    stackingArea100: 'e-grid-stacking-area-100-icon',
    scatter: 'e-grid-scatter-icon'
};

export interface CMenuClassList {
    header: string;
    content: string;
    edit: string;
    batchEdit: string;
    editIcon: string;
    pager: string;
    cancel: string;
    save: string;
    delete: string;
    copy: string;
    pdf: string;
    group: string;
    ungroup: string;
    csv: string;
    excel: string;
    fPage: string;
    lPage: string;
    nPage: string;
    pPage: string;
    ascending: string;
    descending: string;
    groupHeader: string;
    touchPop: string;
    autofit: string;
    autofitall: string;
    chart: string;
    barChart: string;
    bar: string;
    stackingBar: string;
    stackingBar100: string;
    pie: string;
    columnChart: string;
    column: string;
    stackingColumn: string;
    stackingColumn100: string;
    lineChart: string;
    line: string;
    stackingLine: string;
    stackingLine100: string;
    areaChart: string;
    area: string;
    stackingArea: string;
    stackingArea100: string;
    scatter: string;
}

/**
 * The `ContextMenu` module is used to handle context menu actions.
 */
export class ContextMenu implements IAction {
    //internal variables
    private element: HTMLUListElement;
    public contextMenu: Menu;
    private defaultItems: { [key: string]: ContextMenuItemModel } = {};
    private disableItems: string[] = [];
    private hiddenItems: string[] = [];
    private gridID: string;
    private barChartList: string[] = ['Bar', 'StackingBar', 'StackingBar100'];
    private pieChartList: string[] = ['Pie'];
    private columnChartList: string[] = ['Column', 'StackingColumn', 'StackingColumn100'];
    private lineChartList: string[] = ['Line', 'StackingLine', 'StackingLine100'];
    private areaChartList: string[] = ['Area', 'StackingArea', 'StackingArea100'];
    private scatterChartList: string[] = ['Scatter'];
    public chartList: string[] = [...this.barChartList, ...this.pieChartList,
        ...this.columnChartList, ...this.lineChartList, ...this.areaChartList, ...this.scatterChartList];
    // module declarations
    private parent: IGrid;
    private serviceLocator: ServiceLocator;
    private l10n: L10n;
    private localeText: { [key: string]: string } = this.setLocaleKey();
    private targetColumn: Column;
    private eventArgs: Event;
    public isOpen: boolean;
    public row: HTMLTableRowElement;
    public cell: HTMLTableCellElement;
    private targetRowdata: RowInfo;

    constructor(parent?: IGrid, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.gridID = parent.element.id;
        this.serviceLocator = serviceLocator;
        this.addEventListener();
    }

    /**
     * @returns {void}
     * @hidden
     */
    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.uiUpdate, this.enableAfterRenderMenu, this);
        this.parent.on(events.initialLoad, this.render, this);
        this.parent.on(events.destroy, this.destroy, this);
    }

    /**
     * @returns {void}
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.initialLoad, this.render);
        this.parent.off(events.uiUpdate, this.enableAfterRenderMenu);
        this.parent.off(events.destroy, this.destroy);
        EventHandler.remove(this.element, 'keydown', this.keyDownHandler.bind(this));
    }

    private keyDownHandler(e: KeyboardEventArgs): void {
        if (e.code === 'Tab' || e.which === 9) {
            this.contextMenu.close();
        }
        if (e.code === 'Escape') {
            this.contextMenu.close();
            this.parent.notify(events.restoreFocus, {});
        }

    }

    private render(): void {
        this.parent.element.classList.add('e-noselect');
        this.l10n = this.serviceLocator.getService<L10n>('localization');
        this.element = this.parent.createElement('ul', { id: this.gridID + '_cmenu' }) as HTMLUListElement;
        EventHandler.add(this.element, 'keydown', this.keyDownHandler.bind(this));
        this.parent.element.appendChild(this.element);
        const target: string = '#' + this.gridID;
        this.contextMenu = new Menu({
            items: this.getMenuItems(),
            enableRtl: this.parent.enableRtl,
            enablePersistence: this.parent.enablePersistence,
            locale: this.parent.locale,
            target: target,
            select: this.contextMenuItemClick.bind(this),
            beforeOpen: this.contextMenuBeforeOpen.bind(this),
            onOpen: this.contextMenuOpen.bind(this),
            onClose: this.contextMenuOnClose.bind(this),
            beforeClose: this.contextMenuBeforeClose.bind(this),
            cssClass: this.parent.cssClass ? 'e-grid-menu' + ' ' + this.parent.cssClass : 'e-grid-menu'
        });
        this.contextMenu.appendTo(this.element);
    }

    private enableAfterRenderMenu(e: NotifyArgs): void {
        if (e.module === this.getModuleName() && e.enable) {
            if (this.contextMenu) {
                this.contextMenu.destroy();
                remove(this.element);
                this.parent.element.classList.remove('e-noselect');
            }
            this.render();
        }
    }

    private getMenuItems(): ContextMenuItemModel[] {
        const menuItems: MenuItemModel[] = [];
        const exportItems: MenuItemModel[] = [];
        const chartItems: MenuItemModel[] = [];
        const barChartItems: MenuItemModel[] = [];
        let pieChart: MenuItemModel;
        const columnChartItems: MenuItemModel[] = [];
        const lineChartItems: MenuItemModel[] = [];
        const areaChartItems: MenuItemModel[] = [];
        let scatterChart: MenuItemModel;
        for (const item of this.parent.contextMenuItems) {
            if (typeof item === 'string' && this.getDefaultItems().indexOf(item) !== -1) {
                if (this.barChartList.indexOf(item) !== -1) {
                    barChartItems.push(this.buildDefaultItems(item));
                } else if (this.pieChartList.indexOf(item) !== -1) {
                    pieChart = this.buildDefaultItems(item);
                } else if (this.columnChartList.indexOf(item) !== -1) {
                    columnChartItems.push(this.buildDefaultItems(item));
                } else if (this.lineChartList.indexOf(item) !== -1) {
                    lineChartItems.push(this.buildDefaultItems(item));
                } else if (this.areaChartList.indexOf(item) !== -1) {
                    areaChartItems.push(this.buildDefaultItems(item));
                } else if (this.scatterChartList.indexOf(item) !== -1) {
                    scatterChart = this.buildDefaultItems(item);
                } else if (item.toLocaleLowerCase().indexOf('export') !== -1) {
                    exportItems.push(this.buildDefaultItems(item));
                } else {
                    menuItems.push(this.buildDefaultItems(item));
                }
            } else if (typeof item !== 'string') {
                menuItems.push(item);
            }
        }
        if (lineChartItems.length > 0) {
            const lineChartGroup: ContextMenuItemModel = this.buildDefaultItems('LineChart');
            lineChartGroup.items = lineChartItems;
            chartItems.push(lineChartGroup);
        }
        if (areaChartItems.length > 0) {
            const areaChartGroup: ContextMenuItemModel = this.buildDefaultItems('AreaChart');
            areaChartGroup.items = areaChartItems;
            chartItems.push(areaChartGroup);
        }
        if (columnChartItems.length > 0) {
            const columnChartGroup: ContextMenuItemModel = this.buildDefaultItems('ColumnChart');
            columnChartGroup.items = columnChartItems;
            chartItems.push(columnChartGroup);
        }
        if (barChartItems.length > 0) {
            const barChartGroup: ContextMenuItemModel = this.buildDefaultItems('BarChart');
            barChartGroup.items = barChartItems;
            chartItems.push(barChartGroup);
        }
        if (scatterChart) {
            chartItems.push(scatterChart);
        }
        if (pieChart) {
            chartItems.push(pieChart);
        }
        if (chartItems.length > 0) {
            const chartGroup: ContextMenuItemModel = this.buildDefaultItems('Chart');
            chartGroup.items = chartItems;
            menuItems.push(chartGroup);
        }
        if (exportItems.length > 0) {
            const exportGroup: ContextMenuItemModel = this.buildDefaultItems('export');
            exportGroup.items = exportItems;
            menuItems.push(exportGroup);
        }
        return menuItems;
    }

    private getLastPage(): number {
        let totalpage: number = Math.floor(this.parent.pageSettings.totalRecordsCount / this.parent.pageSettings.pageSize);
        if (this.parent.pageSettings.totalRecordsCount % this.parent.pageSettings.pageSize) {
            totalpage += 1;
        }
        return totalpage;
    }

    private contextMenuOpen(): void {
        this.isOpen = true;
    }

    /**
     * @param {ContextMenuClickEventArgs} args - specifies the ContextMenuClickEventArgs argument type
     * @returns {void}
     * @hidden
     */
    public contextMenuItemClick(args: ContextMenuClickEventArgs): void {
        const item: string = this.getKeyFromId(args.item.id);
        switch (item) {
        case 'AutoFitAll':
            this.parent.autoFitColumns([]);
            break;
        case 'AutoFit':
            this.parent.autoFitColumns(this.targetColumn.field);
            break;
        case 'Group':
            this.parent.groupColumn(this.targetColumn.field);
            break;
        case 'Ungroup':
            this.parent.ungroupColumn(this.targetColumn.field);
            break;
        case 'Edit':
            if (this.parent.editModule) {
                if (this.parent.editSettings.mode === 'Batch') {
                    if (this.row && this.cell && !isNaN(parseInt(this.cell.getAttribute(literals.ariaColIndex), 10) - 1)) {
                        this.parent.editModule.editCell(parseInt(this.row.getAttribute(literals.ariaRowIndex), 10) - 1,
                                                        // eslint-disable-next-line
                                                        (this.parent.getColumns()[parseInt(this.cell.getAttribute(literals.ariaColIndex), 10) - 1] as Column).field);
                    }
                } else {
                    this.parent.editModule.endEdit();
                    this.parent.editModule.startEdit(this.row);
                }
            }
            break;
        case 'Delete':
            if (this.parent.editModule) {
                if (this.parent.editSettings.mode !== 'Batch') {
                    this.parent.editModule.endEdit();
                }
                if (this.parent.getSelectedRecords().length === 1) {
                    if (!this.parent.isCheckBoxSelection) {
                        this.parent.isFocusFirstCell = true;
                    }
                    this.parent.editModule.deleteRow(this.row);
                } else {
                    this.parent.deleteRecord();
                }
            }
            break;
        case 'Save':
            if (this.parent.editModule) {
                if (this.parent.isEdit && this.parent.editSettings.mode !== 'Batch') {
                    this.parent.isFocusFirstCell = true;
                }
                this.parent.editModule.endEdit();
            }
            break;
        case 'Cancel':
            if (this.parent.editModule) {
                if (this.parent.isEdit) {
                    this.parent.isFocusFirstCell = true;
                }
                this.parent.editModule.closeEdit();
            }
            break;
        case 'Copy':
            this.parent.copy();
            break;
        case 'PdfExport':
            this.parent.pdfExport();
            break;
        case 'ExcelExport':
            this.parent.excelExport();
            break;
        case 'CsvExport':
            this.parent.csvExport();
            break;
        case 'SortAscending':
            this.isOpen = false;
            this.parent.sortColumn(this.targetColumn.field, 'Ascending');
            break;
        case 'SortDescending':
            this.isOpen = false;
            this.parent.sortColumn(this.targetColumn.field, 'Descending');
            break;
        case 'FirstPage':
            this.parent.goToPage(1);
            break;
        case 'PrevPage':
            this.parent.goToPage(this.parent.pageSettings.currentPage - 1);
            break;
        case 'LastPage':
            this.parent.goToPage(this.getLastPage());
            break;
        case 'NextPage':
            this.parent.goToPage(this.parent.pageSettings.currentPage + 1);
            break;
        case 'Bar':
        case 'StackingBar':
        case 'StackingBar100':
        case 'Pie':
        case 'Column':
        case 'StackingColumn':
        case 'StackingColumn100':
        case 'Line':
        case 'StackingLine':
        case 'StackingLine100':
        case 'Area':
        case 'StackingArea':
        case 'StackingArea100':
        case 'Scatter':
            args.records = this.parent.getSelectedRecords();
            args.gridInstance = this.parent;
            args.chartType = item;
            break;
        }
        args.column = this.targetColumn;
        args.rowInfo = this.targetRowdata;
        this.parent.trigger(events.contextMenuClick, args);
    }

    private contextMenuOnClose(args: OpenCloseMenuEventArgs): void {
        const parent: string = 'parentObj';
        if (args.items.length > 0 && args.items[0][`${parent}`] instanceof Menu) {
            this.updateItemStatus();
        }
        this.parent.notify(events.selectRowOnContextOpen, { isOpen: false });
    }
    private getLocaleText(item: string): string {
        return this.l10n.getConstant(this.localeText[`${item}`]);
    }

    private updateItemStatus(): void {
        this.contextMenu.showItems(this.hiddenItems);
        this.contextMenu.enableItems(this.disableItems);
        this.hiddenItems = [];
        this.disableItems = [];
        this.isOpen = false;
    }

    private contextMenuBeforeOpen(args: ContextMenuOpenEventArgs): void {
        const closestGrid: Element = closest(args.event.target as Element, '.e-grid');
        if (args.event && closestGrid && closestGrid !== this.parent.element) {
            args.cancel = true;
        } else if (args.event && (closest(args.event.target as Element, '.' + menuClass.groupHeader)
            || closest(args.event.target as Element, '.' + menuClass.touchPop) ||
            closest(args.event.target as Element, '.e-summarycell') ||
            closest(args.event.target as Element, '.e-groupcaption') ||
            closest(args.event.target as Element, '.e-filterbarcell')) ||
            (this.parent.editSettings.showAddNewRow && closest(args.event.target as Element, '.e-addedrow')
            && this.parent.element.querySelector('.e-editedrow'))) {
            args.cancel = true;
        } else {
            this.targetColumn = this.getColumn(args.event);
            if (parentsUntil(args.event.target as Element, 'e-grid')) {
                this.targetRowdata = this.parent.getRowInfo(args.event.target as Element);
            }
            if ((isNullOrUndefined(args.parentItem)) && this.targetColumn) {
                if (this.targetRowdata.cell) {
                    this.parent.notify(events.selectRowOnContextOpen, { isOpen: true });
                    this.selectRow(args.event, (this.targetRowdata.cell.classList.contains('e-selectionbackground')
                    && this.parent.selectionSettings.type === 'Multiple') ? false : true);
                }
            }
            const hideSepItems: string[] = [];
            const showSepItems: string[] = [];
            for (const item of args.items) {
                const key: string = this.getKeyFromId(item.id);
                const dItem: ContextMenuItemModel = this.defaultItems[`${key}`];
                if (this.getDefaultItems().indexOf(key) !== -1) {
                    if (this.ensureDisabledStatus(key)) {
                        this.disableItems.push(item.text);
                    }
                    if (args.event && (this.ensureTarget(args.event.target as HTMLElement, menuClass.edit) ||
                        this.ensureTarget(args.event.target as HTMLElement, menuClass.batchEdit))) {
                        if (key !== 'Save' && key !== 'Cancel') {
                            this.hiddenItems.push(item.text);
                        }
                    } else if (this.parent.editModule && this.parent.editSettings.mode === 'Batch' &&
                        ((closest(args.event.target as Element, '.e-gridform')) ||
                            this.parent.editModule.getBatchChanges()[literals.changedRecords].length ||
                            this.parent.editModule.getBatchChanges()[literals.addedRecords].length ||
                            this.parent.editModule.getBatchChanges()[literals.deletedRecords].length) && (key === 'Save' || key === 'Cancel')) {
                        continue;
                    } else if (isNullOrUndefined(args.parentItem) && args.event &&
                        !isNullOrUndefined(dItem) && !this.ensureTarget(args.event.target as HTMLElement, dItem.target)) {
                        this.hiddenItems.push(item.text);
                    }
                } else if ((item as ContextMenuItemModel).target && args.event &&
                    !this.ensureTarget(args.event.target as HTMLElement, (item as ContextMenuItemModel).target)) {
                    if (item.separator) { hideSepItems.push(item.id); } else { this.hiddenItems.push(item.text); }
                } else if (this.ensureTarget(args.event.target as HTMLElement, (item as ContextMenuItemModel).target) && item.separator) {
                    showSepItems.push(item.id);
                }
            }
            if (showSepItems.length > 0) {
                this.contextMenu.showItems(showSepItems, true);
            }
            this.contextMenu.enableItems(this.disableItems, false);
            this.contextMenu.hideItems(this.hiddenItems);
            if (hideSepItems.length > 0) {
                this.contextMenu.hideItems(hideSepItems, true);
            }
            this.eventArgs = args.event;
            args.column = this.targetColumn;
            args.rowInfo = this.targetRowdata;
            this.parent.trigger(events.contextMenuOpen, args);
            if (args.cancel || (this.hiddenItems.length === args.items.length && !args.parentItem)) {
                this.updateItemStatus();
                args.cancel = true;
            }
        }
        applyBiggerTheme(this.parent.element, this.contextMenu.element.parentElement);
    }

    private contextMenuBeforeClose(args: ContextMenuOpenEventArgs): void {
        args.column = this.targetColumn;
        args.rowInfo = this.targetRowdata;
        this.parent.trigger(events.contextMenuClose, args);
    }

    private ensureTarget(targetElement: HTMLElement, selector: string): boolean {
        let target: Element = targetElement;
        if (this.ensureFrozenHeader(targetElement) && (selector === menuClass.header || selector === menuClass.content)) {
            target = closest(targetElement as Element, selector === menuClass.header ? 'thead' :  literals.tbody);
        } else if (selector === menuClass.content || selector === menuClass.header) {
            target = parentsUntil(closest(targetElement as Element, '.' + literals.table), selector.substr(1, selector.length));
        } else {
            target = closest(targetElement as Element, selector);
        }
        return target && parentsUntil(target, 'e-grid') === this.parent.element;
    }

    private ensureFrozenHeader(targetElement: HTMLElement): boolean {
        return (this.parent.frozenRows)
            && closest(targetElement, menuClass.header) ? true : false;
    }

    private ensureDisabledStatus(item: string): boolean {
        let status: boolean = false;
        switch (item) {
        case 'AutoFitAll':
        case 'AutoFit':
            status = !(this.parent.ensureModuleInjected(Resize) && !this.parent.isEdit)
            || (this.targetColumn && !this.targetColumn.field && item === 'AutoFit');
            break;
        case 'Group':
            if (!this.parent.allowGrouping || (this.parent.ensureModuleInjected(Group) && this.targetColumn
                && this.parent.groupSettings.columns.indexOf(this.targetColumn.field) >= 0) ||
                (this.targetColumn && !this.targetColumn.field)) {
                status = true;
            }
            break;
        case 'Ungroup':
            if (!this.parent.allowGrouping || !this.parent.ensureModuleInjected(Group)
                || (this.parent.ensureModuleInjected(Group) && this.targetColumn
                    && this.parent.groupSettings.columns.indexOf(this.targetColumn.field) < 0)) {
                status = true;
            }
            break;
        case 'Edit':
        case 'Delete':
        case 'Save':
        case 'Cancel':
            if (!this.parent.editModule || (this.parent.getDataRows().length === 0)) {
                status = true;
            }
            break;
        case 'Copy':
            if ((this.parent.getSelectedRowIndexes().length === 0 && this.parent.getSelectedRowCellIndexes().length === 0) ||
                this.parent.getCurrentViewRecords().length === 0) {
                status = true;
            }
            break;
        case 'export':
            if (!(this.parent.allowExcelExport && this.parent.ensureModuleInjected(ExcelExport))
                && !(this.parent.allowPdfExport && this.parent.ensureModuleInjected(PdfExport))) {
                status = true;
            }
            break;
        case 'PdfExport':
            if (!(this.parent.allowPdfExport) || !this.parent.ensureModuleInjected(PdfExport)) {
                status = true;
            }
            break;
        case 'ExcelExport':
        case 'CsvExport':
            if (!(this.parent.allowExcelExport) || !this.parent.ensureModuleInjected(ExcelExport)) {
                status = true;
            }
            break;
        case 'SortAscending':
        case 'SortDescending':
            if ((!this.parent.allowSorting) || !this.parent.ensureModuleInjected(Sort) ||
                (this.targetColumn && !this.targetColumn.field)) {
                status = true;
            } else if (this.parent.ensureModuleInjected(Sort) && this.parent.sortSettings.columns.length > 0 && this.targetColumn) {
                const sortColumns: SortDescriptorModel[] = this.parent.sortSettings.columns;
                for (let i: number = 0; i < sortColumns.length; i++) {
                    if (sortColumns[parseInt(i.toString(), 10)].field === this.targetColumn.field
                        && sortColumns[parseInt(i.toString(), 10)].direction.toLowerCase() === item.toLowerCase().replace('sort', '').toLocaleLowerCase()) {
                        status = true;
                    }
                }
            }
            break;
        case 'FirstPage':
        case 'PrevPage':
            if (!this.parent.allowPaging || !this.parent.ensureModuleInjected(Page) ||
                this.parent.getCurrentViewRecords().length === 0 ||
                (this.parent.ensureModuleInjected(Page) && this.parent.pageSettings.currentPage === 1)) {
                status = true;
            }
            break;
        case 'LastPage':
        case 'NextPage':
            if (!this.parent.allowPaging || !this.parent.ensureModuleInjected(Page) ||
                this.parent.getCurrentViewRecords().length === 0 ||
                (this.parent.ensureModuleInjected(Page) && this.parent.pageSettings.currentPage === this.getLastPage())) {
                status = true;
            }
            break;
        case 'Chart':
            status = !this.parent.getSelectedRecords().length;
            break;
        }
        return status;
    }

    /**
     * Gets the context menu element from the Grid.
     *
     * @returns {Element} returns the element
     */
    public getContextMenu(): Element {
        return this.element;
    }

    /**
     * Destroys the context menu component in the Grid.
     *
     * @function destroy
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        const gridElement: Element = this.parent.element;
        if (!gridElement || (!gridElement.querySelector('.' + literals.gridHeader) && !gridElement.querySelector( '.' + literals.gridContent))) { return; }
        if (this.contextMenu) {
            this.contextMenu.select = null;
            this.contextMenu.beforeOpen = null;
            this.contextMenu.onOpen = null;
            this.contextMenu.onClose = null;
        }
        this.removeEventListener();
        this.contextMenu.destroy();
        if (this.element.parentNode) {
            remove(this.element);
        }
        this.parent.element.classList.remove('e-noselect');
    }


    private getModuleName(): string {
        return 'contextMenu';
    }

    /**
     * @param {string} item - Defines the Key
     * @hidden
     * @returns {string} - Returns the ID
     */
    public generateID(item: string): string {
        return this.gridID + '_cmenu_' + item;
    }

    /**
     * @param {string} id - Defines the ID
     * @hidden
     * @returns {string} - Returns the Key
     */
    public getKeyFromId(id: string): string {
        return id.replace(this.gridID + '_cmenu_', '');
    }

    private buildDefaultItems(item: string): ContextMenuItemModel {
        let menuItem: ContextMenuItemModel;
        switch (item) {
        case 'AutoFitAll':
            menuItem = { target: menuClass.header, iconCss: menuClass.autofitall };
            break;
        case 'AutoFit':
            menuItem = { target: menuClass.header, iconCss: menuClass.autofit };
            break;
        case 'Group':
            menuItem = { target: menuClass.header, iconCss: menuClass.group };
            break;
        case 'Ungroup':
            menuItem = { target: menuClass.header, iconCss: menuClass.ungroup };
            break;
        case 'Edit':
            menuItem = { target: menuClass.content, iconCss: menuClass.editIcon };
            break;
        case 'Delete':
            menuItem = { target: menuClass.content, iconCss: menuClass.delete };
            break;
        case 'Save':
            menuItem = { target: menuClass.edit, iconCss: menuClass.save };
            break;
        case 'Cancel':
            menuItem = { target: menuClass.edit, iconCss: menuClass.cancel };
            break;
        case 'Copy':
            menuItem = { target: menuClass.content, iconCss: menuClass.copy };
            break;
        case 'export':
            menuItem = { target: menuClass.content };
            break;
        case 'PdfExport':
            menuItem = { target: menuClass.content, iconCss: menuClass.pdf };
            break;
        case 'ExcelExport':
            menuItem = { target: menuClass.content, iconCss: menuClass.excel };
            break;
        case 'CsvExport':
            menuItem = { target: menuClass.content, iconCss: menuClass.csv };
            break;
        case 'SortAscending':
            menuItem = { target: menuClass.header, iconCss: menuClass.ascending };
            break;
        case 'SortDescending':
            menuItem = { target: menuClass.header, iconCss: menuClass.descending };
            break;
        case 'FirstPage':
            menuItem = { target: menuClass.pager, iconCss: menuClass.fPage };
            break;
        case 'PrevPage':
            menuItem = { target: menuClass.pager, iconCss: menuClass.pPage };
            break;
        case 'LastPage':
            menuItem = { target: menuClass.pager, iconCss: menuClass.lPage };
            break;
        case 'NextPage':
            menuItem = { target: menuClass.pager, iconCss: menuClass.nPage };
            break;
        case 'Chart':
            menuItem = { target: menuClass.content, iconCss: menuClass.chart };
            break;
        case 'BarChart':
            menuItem = { target: menuClass.content, iconCss: menuClass.barChart };
            break;
        case 'Bar':
            menuItem = { target: menuClass.content, iconCss: menuClass.bar };
            break;
        case 'StackingBar':
            menuItem = { target: menuClass.content, iconCss: menuClass.stackingBar };
            break;
        case 'StackingBar100':
            menuItem = { target: menuClass.content, iconCss: menuClass.stackingBar100 };
            break;
        case 'Pie':
            menuItem = { target: menuClass.content, iconCss: menuClass.pie };
            break;
        case 'ColumnChart':
            menuItem = { target: menuClass.content, iconCss: menuClass.columnChart };
            break;
        case 'Column':
            menuItem = { target: menuClass.content, iconCss: menuClass.column };
            break;
        case 'StackingColumn':
            menuItem = { target: menuClass.content, iconCss: menuClass.stackingColumn };
            break;
        case 'StackingColumn100':
            menuItem = { target: menuClass.content, iconCss: menuClass.stackingColumn100 };
            break;
        case 'LineChart':
            menuItem = { target: menuClass.content, iconCss: menuClass.lineChart };
            break;
        case 'Line':
            menuItem = { target: menuClass.content, iconCss: menuClass.line };
            break;
        case 'StackingLine':
            menuItem = { target: menuClass.content, iconCss: menuClass.stackingLine };
            break;
        case 'StackingLine100':
            menuItem = { target: menuClass.content, iconCss: menuClass.stackingLine100 };
            break;
        case 'AreaChart':
            menuItem = { target: menuClass.content, iconCss: menuClass.areaChart };
            break;
        case 'Area':
            menuItem = { target: menuClass.content, iconCss: menuClass.area };
            break;
        case 'StackingArea':
            menuItem = { target: menuClass.content, iconCss: menuClass.stackingArea };
            break;
        case 'StackingArea100':
            menuItem = { target: menuClass.content, iconCss: menuClass.stackingArea100 };
            break;
        case 'Scatter':
            menuItem = { target: menuClass.content, iconCss: menuClass.scatter };
            break;
        }
        this.defaultItems[`${item}`] = {
            text: this.getLocaleText(item), id: this.generateID(item),
            target: menuItem.target, iconCss: menuItem.iconCss ? 'e-icons ' + menuItem.iconCss : ''
        };
        return this.defaultItems[`${item}`];
    }

    private getDefaultItems(): string[] {
        return ['AutoFitAll', 'AutoFit',
            'Group', 'Ungroup', 'Edit', 'Delete', 'Save', 'Cancel', 'Copy', 'export',
            'PdfExport', 'ExcelExport', 'CsvExport', 'SortAscending', 'SortDescending',
            'FirstPage', 'PrevPage', 'LastPage', 'NextPage',
            'Chart', 'BarChart', 'ColumnChart', 'LineChart', 'AreaChart',
            ...this.chartList];
    }
    private setLocaleKey(): { [key: string]: string } {
        const localeKeys: { [key: string]: string } = {
            'AutoFitAll': 'autoFitAll',
            'AutoFit': 'autoFit',
            'Copy': 'Copy',
            'Group': 'Group',
            'Ungroup': 'Ungroup',
            'Edit': 'EditRecord',
            'Delete': 'DeleteRecord',
            'Save': 'Save',
            'Cancel': 'CancelButton',
            'PdfExport': 'Pdfexport',
            'ExcelExport': 'Excelexport',
            'CsvExport': 'Csvexport',
            'export': 'Export',
            'SortAscending': 'SortAscending',
            'SortDescending': 'SortDescending',
            'FirstPage': 'FirstPage',
            'LastPage': 'LastPage',
            'PrevPage': 'PreviousPage',
            'NextPage': 'NextPage',
            'Chart': 'Chart',
            'BarChart': 'BarChart',
            'Bar': 'Bar',
            'StackingBar': 'StackingBar',
            'StackingBar100': 'StackingBar100',
            'Pie': 'Pie',
            'ColumnChart': 'ColumnChart',
            'Column': 'Column',
            'StackingColumn': 'StackingColumn',
            'StackingColumn100': 'StackingColumn100',
            'LineChart': 'LineChart',
            'Line': 'Line',
            'StackingLine': 'StackingLine',
            'StackingLine100': 'StackingLine100',
            'AreaChart': 'AreaChart',
            'Area': 'Area',
            'StackingArea': 'StackingArea',
            'StackingArea100': 'StackingArea100',
            'Scatter': 'Scatter'
        };
        return localeKeys;
    }

    private getColumn(e: Event): Column {
        const cell: HTMLElement = <HTMLElement>closest(<HTMLElement>e.target, 'th.e-headercell');
        if (cell) {
            const uid: string = cell.querySelector('.e-headercelldiv, .e-stackedheadercelldiv').getAttribute('data-mappinguid');
            return this.parent.getColumnByUid(uid);
        } else {
            const ele: Column = (this.parent.getRowInfo(e.target as Element).column) as Column;
            return ele || null;
        }
    }

    private selectRow(e: Event, isSelectable: boolean): void {
        this.cell = (<HTMLElement>e.target) as HTMLTableCellElement;
        this.row = <HTMLElement>closest(<HTMLElement>e.target, 'tr.e-row') as HTMLTableRowElement || this.row;
        if (this.row && isSelectable && !parentsUntil(<HTMLElement>e.target, 'e-gridpager')) {
            this.parent.selectRow(parseInt(this.row.getAttribute(literals.ariaRowIndex), 10) - 1);
        }
    }
}
