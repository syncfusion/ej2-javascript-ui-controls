import * as cons from './../base/css-constants';
import { ContextMenuOpenEventArgs as CMenuOpenEventArgs, ContextMenuClickEventArgs as CMenuClickEventArgs } from './../base/interface';
import { TreeGrid, ContextMenu as TreeGridContextMenu } from '@syncfusion/ej2-treegrid';
import { remove, closest, isNullOrUndefined, getValue, extend, getElement, isBlazor } from '@syncfusion/ej2-base';
import { Gantt } from './../base/gantt';
import { Deferred } from '@syncfusion/ej2-data';
import { ContextMenu as Menu, OpenCloseMenuEventArgs } from '@syncfusion/ej2-navigations';
import { NotifyArgs, ContextMenuItemModel } from '@syncfusion/ej2-grids';
import { ITaskData, IGanttData, IPredecessor, RowPosition } from '../base/common';
import { TaskFieldsModel } from '../models/models';
/**
 * The ContextMenu module is used to handle the context menu items & sub-menu items.
 */
export class ContextMenu {
    /**
     * @private
     */
    public contextMenu: Menu;
    private parent: Gantt;
    private ganttID: string;
    private element: HTMLUListElement;
    private headerMenuItems: any; // tslint:disable-line
    private contentMenuItems: ContextMenuItemModel[];
    private rowData: IGanttData;
    /**
     * @private
     */
    public isOpen: Boolean;
    /**
     * @private
     */
    public item: string;
    private predecessors: IPredecessor[];
    private hideItems: string[];
    private disableItems: string[];
    constructor(parent?: Gantt) {
        this.parent = parent;
        this.ganttID = parent.element.id;
        TreeGrid.Inject(TreeGridContextMenu);
        this.parent.treeGrid.contextMenuClick = this.headerContextMenuClick.bind(this);
        this.parent.treeGrid.contextMenuOpen = this.headerContextMenuOpen.bind(this);
        this.addEventListener();
        this.resetItems();
    }

    private addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on('initiate-contextMenu', this.render, this);
        this.parent.on('reRender-contextMenu', this.reRenderContextMenu, this);
        this.parent.on('contextMenuClick', this.contextMenuItemClick, this);
        this.parent.on('contextMenuOpen', this.contextMenuBeforeOpen, this);
    }

    private reRenderContextMenu(e: NotifyArgs): void {
        if (e.module === this.getModuleName() && e.enable) {
            if (this.contextMenu) {
                this.contextMenu.destroy();
                remove(this.element);
            }
            this.resetItems();
            this.render();
        }
    }

    private render(): void {
        this.element = this.parent.createElement('ul', {
            id: this.ganttID + '_contextmenu', className: cons.focusCell
        }) as HTMLUListElement;
        this.parent.element.appendChild(this.element);
        let target: string = '#' + this.ganttID;

        this.contextMenu = new Menu({
            items: this.getMenuItems(),
            locale: this.parent.locale,
            target: target,
            animationSettings: { effect: 'None' },
            select: this.contextMenuItemClick.bind(this),
            beforeOpen: this.contextMenuBeforeOpen.bind(this),
            onOpen: this.contextMenuOpen.bind(this),
            onClose: this.contextMenuOnClose.bind(this),
            cssClass: 'e-gantt'
        });
        this.contextMenu.appendTo(this.element);
        this.parent.treeGrid.contextMenuItems = this.headerMenuItems;
    }


    private contextMenuItemClick(args: CMenuClickEventArgs): void {
        this.item = this.getKeyFromId(args.item.id);
        let parentItem: ContextMenuItemModel = getValue('parentObj', args.item);
        let index: number = -1;
        if (parentItem && !isNullOrUndefined(parentItem.id) && this.getKeyFromId(parentItem.id) === 'DeleteDependency') {
            index = parentItem.items.indexOf(args.item);
        }
        if (this.parent.isAdaptive) {
            if (this.item === 'TaskInformation' || this.item === 'Above' || this.item === 'Below'
                || this.item === 'Child' || this.item === 'DeleteTask') {
                if (this.parent.selectionModule && this.parent.selectionSettings.type === 'Multiple') {
                    this.parent.selectionModule.hidePopUp();
                    (<HTMLElement>document.getElementsByClassName('e-gridpopup')[0]).style.display = 'none';
                }
            }
        }
        switch (this.item) {
            case 'TaskInformation':
                this.parent.openEditDialog(Number(this.rowData.ganttProperties.rowUniqueID));
                break;
            case 'Above':
            case 'Below':
            case 'Child':
                let position: RowPosition = this.item;
                let data: Object = extend({}, {}, this.rowData.taskData, true);
                let taskfields: TaskFieldsModel = this.parent.taskFields;
                if (!isNullOrUndefined(taskfields.dependency)) {
                    data[taskfields.dependency] = null;
                }
                if (!isNullOrUndefined(taskfields.child) && data[taskfields.child]) {
                    delete data[taskfields.child];
                }
                if (!isNullOrUndefined(taskfields.parentID) && data[taskfields.parentID]) {
                    data[taskfields.parentID] = null;
                }
                if (this.rowData) {
                    let rowIndex: number = this.parent.currentViewData.indexOf(this.rowData);
                    this.parent.addRecord(data, position, rowIndex);
                }
                break;
            case 'Milestone':
            case 'ToMilestone':
                this.parent.convertToMilestone(this.rowData.ganttProperties.rowUniqueID);
                break;
            case 'DeleteTask':
                this.parent.editModule.deleteRecord(this.rowData);
                break;
            case 'ToTask':
                data = extend({}, {}, this.rowData.taskData, true);
                taskfields = this.parent.taskFields;
                if (!isNullOrUndefined(taskfields.duration)) {
                    let ganttProp: ITaskData = this.rowData.ganttProperties;
                    data[taskfields.duration] = '1 ' + ganttProp.durationUnit;
                } else {
                    data[taskfields.startDate] = new Date(this.rowData.taskData[taskfields.startDate]);
                    let endDate: Date = new Date(this.rowData.taskData[taskfields.startDate]);
                    endDate.setDate(endDate.getDate() + 1);
                    data[taskfields.endDate] = endDate;
                }
                if (!isNullOrUndefined(data[taskfields.milestone])) {
                    if (data[taskfields.milestone] === true) {
                        data[taskfields.milestone] = false;
                    }
                }
                this.parent.updateRecordByID(data);
                break;
            case 'Cancel':
                this.parent.cancelEdit();
                break;
            case 'Save':
                this.parent.editModule.cellEditModule.isCellEdit = false;
                this.parent.treeGrid.grid.saveCell();
                break;
            case 'Dependency' + index:
                this.parent.connectorLineEditModule.removePredecessorByIndex(this.rowData, index);
                break;
            case 'Auto':
            case 'Manual':
                this.parent.changeTaskMode(this.rowData);
                break;
            case 'Indent':
                this.parent.indent();
                break;
            case 'Outdent':
                this.parent.outdent();
                break;
        }
        args.type = 'Content';
        args.rowData = this.rowData;
        this.parent.trigger('contextMenuClick', args);
    }

    private contextMenuBeforeOpen(args: CMenuOpenEventArgs): void | Deferred {
        args.gridRow = closest(args.event.target as Element, '.e-row');
        args.chartRow = closest(args.event.target as Element, '.e-chart-row');
        let menuElement: Element = closest(args.event.target as Element, '.e-gantt');
        let editForm: Element = closest(args.event.target as Element, cons.editForm);
        if (!editForm && this.parent.editModule && this.parent.editModule.cellEditModule
            && this.parent.editModule.cellEditModule.isCellEdit
            && !this.parent.editModule.dialogModule.dialogObj.open) {
            this.parent.treeGrid.grid.saveCell();
            this.parent.editModule.cellEditModule.isCellEdit = false;
        }
        if ((isNullOrUndefined(args.gridRow) && isNullOrUndefined(args.chartRow)) || this.contentMenuItems.length === 0) {
            if (!isNullOrUndefined(args.parentItem) && !isNullOrUndefined(menuElement)) {
                args.cancel = false;
            } else {
                args.cancel = true;
            }
        }
        if (!args.cancel) {
            let rowIndex: number = -1;
            if (args.gridRow) {
                rowIndex = parseInt(args.gridRow.getAttribute('aria-rowindex'), 0);
            } else if (args.chartRow) {
                rowIndex = parseInt(getValue('rowIndex', args.chartRow), 0);
            }
            if (this.parent.selectionModule && this.parent.allowSelection) {
                this.parent.selectionModule.selectRow(rowIndex);
            }
            if (!args.parentItem) {
                this.rowData = this.parent.currentViewData[rowIndex];
            }
            for (let item of args.items) {
                let target: EventTarget = args.event.target;
                if (!item.separator) {
                    this.updateItemStatus(item, target);
                }
            }
            args.rowData = this.rowData;
            args.type = 'Content';
            args.disableItems = this.disableItems;
            args.hideItems = this.hideItems;
            if (args.rowData.level === 0 && this.parent.viewType === 'ResourceView') {
                args.cancel = true;
                return;
            }
            let callBackPromise: Deferred = new Deferred();
            this.parent.trigger('contextMenuOpen', args, (args: CMenuOpenEventArgs) => {
                callBackPromise.resolve(args);
                if (isBlazor()) {
                    args.element = !isNullOrUndefined(args.element) ? getElement(args.element) : args.element;
                    args.gridRow = !isNullOrUndefined(args.gridRow) ? getElement(args.gridRow) : args.gridRow;
                    args.chartRow = !isNullOrUndefined(args.chartRow) ? getElement(args.chartRow) : args.chartRow;
                }
                this.hideItems = args.hideItems;
                this.disableItems = args.disableItems;
                if (!args.parentItem && args.hideItems.length === args.items.length) {
                    this.revertItemStatus();
                    args.cancel = true;
                }
                if (this.hideItems.length > 0) {
                    this.contextMenu.hideItems(this.hideItems);
                }
                if (this.disableItems.length > 0) {
                    this.contextMenu.enableItems(this.disableItems, false);
                }
            });
            return callBackPromise;
        }
    }

    private updateItemStatus(item: ContextMenuItemModel, target: EventTarget): void {
        let key: string = this.getKeyFromId(item.id);
        let editForm: Element = closest(target as Element, cons.editForm);
        if (editForm) {
            if (!(key === 'Save' || key === 'Cancel')) {
                this.hideItems.push(item.text);
            }
        } else {
            switch (key) {
                case 'TaskInformation':
                    if (!this.parent.editSettings.allowEditing || !this.parent.editModule) {
                        this.updateItemVisibility(item.text);
                    }
                    break;
                case 'Add':
                    if (!this.parent.editSettings.allowAdding || !this.parent.editModule) {
                        this.updateItemVisibility(item.text);
                    }
                    break;
                case 'Save':
                case 'Cancel':
                    this.hideItems.push(item.text);
                    break;
                case 'Convert':
                    if (this.rowData.hasChildRecords) {
                        this.hideItems.push(item.text);
                    } else if (!this.parent.editSettings.allowEditing || !this.parent.editModule) {
                        this.updateItemVisibility(item.text);
                    } else {
                        let subMenu: ContextMenuItemModel[] = [];
                        if (!this.rowData.ganttProperties.isMilestone) {
                            subMenu.push(
                                this.createItemModel(cons.content, 'ToMilestone', this.getLocale('toMilestone')));
                        } else {
                            subMenu.push(
                                this.createItemModel(cons.content, 'ToTask', this.getLocale('toTask')));
                        }
                        item.items = subMenu;
                    }
                    break;
                case 'DeleteDependency':
                    let items: ContextMenuItemModel[] = this.getPredecessorsItems();
                    if (this.rowData.hasChildRecords) {
                        this.hideItems.push(item.text);
                    } else if (!this.parent.editSettings.allowDeleting || items.length === 0 || !this.parent.editModule) {
                        this.updateItemVisibility(item.text);
                    } else if (items.length > 0) {
                        item.items = items;
                    }
                    break;
                case 'DeleteTask':
                    if (!this.parent.editSettings.allowDeleting || !this.parent.editModule) {
                        this.updateItemVisibility(item.text);
                    }
                    break;
                case 'TaskMode':
                    let subMenu: ContextMenuItemModel[] = [];
                    if (this.parent.taskMode !== 'Custom') {
                        this.updateItemVisibility(item.text);
                    } else {
                        if (this.rowData.ganttProperties.isAutoSchedule) {
                            subMenu.push(
                                this.createItemModel(cons.content, 'Manual', this.getLocale('manual')));
                        } else {
                            subMenu.push(
                                this.createItemModel(cons.content, 'Auto', this.getLocale('auto')));
                        }
                        item.items = subMenu;
                    }
                    break;
                case 'Indent':
                    let index : number = this.parent.selectedRowIndex;
                    let isSelected: boolean = this.parent.selectionModule ? this.parent.selectionModule.selectedRowIndexes.length === 1 ||
                        this.parent.selectionModule.getSelectedRowCellIndexes().length === 1 ? true : false : false;
                    let prevRecord: IGanttData = this.parent.currentViewData[this.parent.selectionModule.getSelectedRowIndexes()[0] - 1];
                    if (!this.parent.editSettings.allowEditing || index === 0 || index === -1 || !isSelected ||
                        this.parent.viewType === 'ResourceView' || this.parent.currentViewData[index].level - prevRecord.level === 1) {
                            this.hideItems.push(item.text);
                    }
                    break;
                case 'Outdent':
                    let ind: number = this.parent.selectionModule.getSelectedRowIndexes()[0];
                    let isSelect: boolean = this.parent.selectionModule ? this.parent.selectionModule.selectedRowIndexes.length === 1 ||
                        this.parent.selectionModule.getSelectedRowCellIndexes().length === 1 ? true : false : false;
                    if (!this.parent.editSettings.allowEditing || ind === -1 || ind === 0 || !isSelect ||
                        this.parent.viewType === 'ResourceView' || this.parent.currentViewData[ind].level === 0) {
                        this.hideItems.push(item.text);
                    }
                    break;
            }
        }
    }

    private updateItemVisibility(text: string): void {
        let isDefaultItem: boolean = !isNullOrUndefined(this.parent.contextMenuItems) ? false : true;
        if (isDefaultItem) {
            this.hideItems.push(text);
        } else {
            this.disableItems.push(text);
        }
    }
    private contextMenuOpen(): void {
        this.isOpen = true;
    }

    private getMenuItems(): ContextMenuItemModel[] {
        let menuItems: ContextMenuItemModel[] = !isNullOrUndefined(this.parent.contextMenuItems) ?
            this.parent.contextMenuItems as ContextMenuItemModel[] : this.getDefaultItems() as ContextMenuItemModel[];
        for (let item of menuItems) {
            if (typeof item === 'string' && this.getDefaultItems().indexOf(item) !== -1) {
                this.buildDefaultItems(item);
            } else if (typeof item !== 'string') {
                if (this.getDefaultItems().indexOf(item.text) !== -1) {
                    this.buildDefaultItems(item.text, item.iconCss);
                } else if (item.target === cons.columnHeader) {
                    this.headerMenuItems.push(item);
                } else {
                    this.contentMenuItems.push(item);
                }
            }
        }
        return this.contentMenuItems;
    }
    private createItemModel(target: string, item: string, text: string, iconCss?: string): ContextMenuItemModel {
        let itemModel: ContextMenuItemModel = {
            text: text,
            id: this.generateID(item),
            target: target,
            iconCss: iconCss ? 'e-icons ' + iconCss : ''
        };
        return itemModel;
    }

    private getLocale(text: string): string {
        let localeText: string = this.parent.localeObj.getConstant(text);
        return localeText;
    }

    private buildDefaultItems(item: string, iconCSS?: string): void {
        let contentMenuItem: ContextMenuItemModel;
        switch (item) {
            case 'AutoFitAll':
            case 'AutoFit':
            case 'SortAscending':
            case 'SortDescending':
                this.headerMenuItems.push(item);
                break;
            case 'TaskInformation':
                contentMenuItem = this.createItemModel(
                    cons.content, item, this.getLocale('taskInformation'), this.getIconCSS(cons.editIcon, iconCSS));
                break;
            case 'Indent':
                contentMenuItem = this.createItemModel(
                    cons.content, item, this.getLocale('indent'), this.getIconCSS(cons.indentIcon, iconCSS));
                break;
            case 'Outdent':
                contentMenuItem = this.createItemModel(
                    cons.content, item, this.getLocale('outdent'), this.getIconCSS(cons.outdentIcon, iconCSS));
                break;
            case 'Save':
                contentMenuItem = this.createItemModel(
                    cons.editIcon, item, this.getLocale('save'), this.getIconCSS(cons.saveIcon, iconCSS));
                break;
            case 'Cancel':
                contentMenuItem = this.createItemModel(
                    cons.editIcon, item, this.getLocale('cancel'), this.getIconCSS(cons.cancelIcon, iconCSS));
                break;
            case 'Add':
                contentMenuItem = this.createItemModel(
                    cons.content, item, this.getLocale('add'), this.getIconCSS(cons.addIcon, iconCSS));
                //Sub item menu
                contentMenuItem.items = [];
                contentMenuItem.items.push(
                    this.createItemModel(cons.content, 'Above', this.getLocale('above'), this.getIconCSS(cons.addAboveIcon, iconCSS)));
                contentMenuItem.items.push(
                    this.createItemModel(cons.content, 'Below', this.getLocale('below'), this.getIconCSS(cons.addBelowIcon, iconCSS)));
                    if (this.parent.viewType !== 'ResourceView') {
                contentMenuItem.items.push(
                    this.createItemModel(cons.content, 'Child', this.getLocale('child')));
                }
                contentMenuItem.items.push(this.createItemModel(
                    cons.content, 'Milestone',
                    this.getLocale('milestone')));
                break;
            case 'DeleteTask':
                contentMenuItem = this.createItemModel(
                    cons.content, item, this.getLocale('deleteTask'),
                    this.getIconCSS(cons.deleteIcon, iconCSS));
                break;
            case 'DeleteDependency':
                contentMenuItem = this.createItemModel(
                    cons.content, item, this.getLocale('deleteDependency'));
                contentMenuItem.items = [];
                contentMenuItem.items.push({});
                break;
            case 'Convert':
                contentMenuItem = this.createItemModel(
                    cons.content, item, this.getLocale('convert'));
                contentMenuItem.items = [];
                contentMenuItem.items.push({});
                break;
            case 'TaskMode':
                contentMenuItem = this.createItemModel(
                    cons.content, item, this.getLocale('changeScheduleMode'));
                contentMenuItem.items = [];
                contentMenuItem.items.push({});
                break;
        }
        if (contentMenuItem) {
            this.contentMenuItems.push(contentMenuItem);
        }
    }

    private getIconCSS(menuClass: string, iconString?: string): string {
        return isNullOrUndefined(iconString) ? menuClass : iconString;
    }

    private getPredecessorsItems(): ContextMenuItemModel[] {
        this.predecessors = this.parent.predecessorModule.getValidPredecessor(this.rowData);
        let items: ContextMenuItemModel[] = []; let itemModel: ContextMenuItemModel;
        let increment: number = 0;
        for (let predecessor of this.predecessors) {
            let ganttData: IGanttData = this.parent.getRecordByID(predecessor.from);
            let ganttProp: ITaskData = ganttData.ganttProperties;
            let text: string = ganttProp.rowUniqueID + ' - ' + ganttProp.taskName;
            let id: string = 'Dependency' + increment++;
            itemModel = this.createItemModel(cons.content, id, text);
            items.push(itemModel);
        }
        return items;
    }

    private headerContextMenuClick = (args: CMenuClickEventArgs): void => {
        let gridRow: Element = closest(args.event.target as Element, '.e-row');
        let chartRow: Element = closest(args.event.target as Element, '.e-chart-row');
        if (isNullOrUndefined(gridRow) && isNullOrUndefined(chartRow)) {
            args.type = 'Header';
            this.parent.trigger('contextMenuClick', args);
        }
    }
    private headerContextMenuOpen = (args: CMenuOpenEventArgs): void => {
        let gridRow: Element = closest(args.event.target as Element, '.e-row');
        let chartRow: Element = closest(args.event.target as Element, '.e-chart-row');
        if (isNullOrUndefined(gridRow) && isNullOrUndefined(chartRow)) {
            args.type = 'Header';
            this.parent.trigger('contextMenuOpen', args);
        } else {
            args.cancel = true;
        }
    }

    private getDefaultItems(): string[] {
        return ['AutoFitAll', 'AutoFit',
            'TaskInformation', 'DeleteTask', 'Save', 'Cancel',
            'SortAscending', 'SortDescending', 'Add',
            'DeleteDependency', 'Convert', 'TaskMode', 'Indent', 'Outdent'
        ];
    }
    /**
     * To get ContextMenu module name.
     */
    public getModuleName(): string {
        return 'contextMenu';
    }

    private removeEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('initiate-contextMenu', this.render);
        this.parent.off('reRender-contextMenu', this.reRenderContextMenu);
        this.parent.off('contextMenuClick', this.contextMenuItemClick);
        this.parent.off('contextMenuOpen', this.contextMenuOpen);
    }

    private contextMenuOnClose(args: OpenCloseMenuEventArgs): void {
        let parent: string = 'parentObj';
        if (args.items.length > 0 && args.items[0][parent] instanceof Menu) {
            this.revertItemStatus();
        }
    }

    private revertItemStatus(): void {
        if (isBlazor() && isNullOrUndefined(this.disableItems)) {
            this.disableItems = [];
        }
        this.contextMenu.showItems(this.hideItems);
        this.contextMenu.enableItems(this.disableItems);
        this.hideItems = [];
        this.disableItems = [];
        this.isOpen = false;
    }
    private resetItems(): void {
        this.hideItems = [];
        this.disableItems = [];
        this.headerMenuItems = [];
        this.contentMenuItems = [];
        this.item = null;
    }

    private generateID(item: string): string {
        return this.ganttID + '_contextMenu_' + item;
    }
    private getKeyFromId(id: string): string {
        let idPrefix: string = this.ganttID + '_contextMenu_';
        if (id.indexOf(idPrefix) > -1) {
            return id.replace(idPrefix, '');
        } else {
            return 'Custom';
        }
    }
    /**
     * To destroy the contextmenu module.
     * @return {void}
     * @private
     */
    public destroy(): void {
        this.contextMenu.destroy();
        remove(this.element);
        this.removeEventListener();
        this.contextMenu = null;
        this.element = null;
    }
}