import { Gantt } from './gantt';
import { TreeGrid, ColumnModel } from '@syncfusion/ej2-treegrid';
import { createElement, isNullOrUndefined, getValue, extend, EventHandler, deleteObject } from '@syncfusion/ej2-base';
import { FilterEventArgs, SortEventArgs, FailureEventArgs } from '@syncfusion/ej2-grids';
import { setValue, getElement } from '@syncfusion/ej2-base';
import { Deferred, Query } from '@syncfusion/ej2-data';
import { TaskFieldsModel } from '../models/models';
import { ColumnModel as GanttColumnModel, Column as GanttColumn } from '../models/column';
import { ITaskData, IGanttData } from './interface';
import { DataStateChangeEventArgs } from '@syncfusion/ej2-treegrid';
import { QueryCellInfoEventArgs, HeaderCellInfoEventArgs, RowDataBoundEventArgs } from '@syncfusion/ej2-grids';
import { ColumnMenuOpenEventArgs, ColumnMenuClickEventArgs } from '@syncfusion/ej2-grids';
import { isCountRequired } from './utils';

/**
 * TreeGrid related code goes here
 *
 * @param {object} args .
 * @returns {void} .
 */
export class GanttTreeGrid {
    private parent: Gantt;
    private treeGridElement: HTMLElement;
    public treeGridColumns: ColumnModel[];
    /**
     * @private
     */
    public currentEditRow: {};
    private previousScroll: { top: number, left: number } = { top: 0, left: 0 };
    /** @hidden */
    public prevCurrentView: Object;

    constructor(parent: Gantt) {
        this.parent = parent;
        this.parent.treeGrid = new TreeGrid();
        this.parent.treeGrid.allowSelection = false;
        this.parent.treeGrid.allowKeyboard = this.parent.allowKeyboard;
        this.parent.treeGrid.enableImmutableMode = this.parent.enableImmutableMode;
        this.treeGridColumns = [];
        this.validateGanttColumns();
        this.addEventListener();
    }
    private addEventListener(): void {
        this.parent.on('renderPanels', this.createContainer, this);
        this.parent.on('chartScroll', this.updateScrollTop, this);
        this.parent.on('destroy', this.destroy, this);
        this.parent.treeGrid.on('renderReactTemplate', this.renderReactTemplate, this);
    }
    private renderReactTemplate(args: Object[]): void {
        const portals: string = 'portals';
        this.parent[portals] = args;
        this.parent.renderTemplates();
    }
    private createContainer(): void {
        //let height: number = this.parent.ganttHeight - this.parent.toolbarModule.element.offsetHeight - 46;
        this.treeGridElement = createElement('div', {
            id: 'treeGrid' + this.parent.element.id, className: 'e-gantt-tree-grid'
            //  styles: 'height:' + height + 'px;'
        });
        const tempHeader: HTMLElement = createElement('div', { className: 'e-gantt-temp-header' });
        this.parent.treeGridPane.appendChild(this.treeGridElement);
        this.treeGridElement.appendChild(tempHeader);
        this.parent.treeGridPane.classList.add('e-temp-content');
    }
    /**
     * Method to initiate TreeGrid
     *
     * @returns {void} .
     */
    public renderTreeGrid(): void {
        this.composeProperties();
        this.bindEvents();
        this.parent.treeGrid.appendTo(this.treeGridElement);
        this.wireEvents();
    }

    private composeProperties(): void {
        this.parent.treeGrid.showColumnMenu = this.parent.showColumnMenu;
        this.parent.treeGrid.columnMenuItems = this.parent.columnMenuItems;
        this.parent.treeGrid.childMapping = isNullOrUndefined(this.parent.taskFields.child) ? '' : this.parent.taskFields.child;
        this.parent.treeGrid.treeColumnIndex = this.parent.treeColumnIndex;
        this.parent.treeGrid.columns = this.treeGridColumns;
        if (this.parent.dataSource instanceof Object && isCountRequired(this.parent)) {
            // In order to bind the observable data at load time, hasChildMapping is necessary to be mapped.
            this.parent.treeGrid.hasChildMapping = 'isParent';
            const count: number = getValue('count', this.parent.dataSource);
            this.parent.treeGrid.dataSource = {result: this.parent.flatData, count: count};
        } else {
            this.parent.treeGrid.hasChildMapping = null;
            this.parent.treeGrid.dataSource = this.parent.flatData;
        }
        this.parent.treeGrid.expandStateMapping = this.parent.taskFields.expandState;
        const isGantt: string = 'isGantt';
        this.parent.treeGrid[isGantt] = true;
        this.parent.treeGrid.rowHeight = this.parent.rowHeight;
        this.parent.treeGrid.gridLines = this.parent.gridLines;
        if (this.parent.searchSettings.fields.length !== 0 || this.parent.searchSettings.key !== '') {
            this.parent.treeGrid.searchSettings = this.parent.searchSettings;
        }
        const isJsComponent: string = 'isJsComponent';
        this.parent.treeGrid[isJsComponent] = true;
        let toolbarHeight: number = 0;
        if (!isNullOrUndefined(this.parent.toolbarModule) && !isNullOrUndefined(this.parent.toolbarModule.element)) {
            toolbarHeight = this.parent.toolbarModule.element.offsetHeight;
        }
        this.parent.treeGrid.height = this.parent.ganttHeight - toolbarHeight - 46;
    }
    private getContentDiv(): HTMLElement {
        return this.treeGridElement.querySelector('.e-content');
    }

    private getHeaderDiv(): HTMLElement {
        return this.treeGridElement.querySelector('.e-headercontent');
    }

    private getScrollbarWidth(): number {
        const outer: HTMLElement = document.createElement('div');
        outer.style.visibility = 'hidden';
        outer.style.overflow = 'scroll';
        outer.style.msOverflowStyle = 'scrollbar';
        const inner: HTMLElement = document.createElement('div');
        outer.appendChild(inner);
        this.parent.element.appendChild(outer);
        const scrollbarWidth: number = (outer.offsetWidth - inner.offsetWidth);
        outer.parentNode.removeChild(outer);
        return scrollbarWidth;
    }
    /**
     * @returns {void} .
     * @private
     */
    public ensureScrollBar(): void {
        const content: HTMLElement = this.getContentDiv();
        const headerDiv: HTMLElement = this.getHeaderDiv();
        const scrollWidth: number = this.getScrollbarWidth();
        const isMobile: boolean = /Android|Mac|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (scrollWidth !== 0) {
            content.style.cssText += 'width: calc(100% + ' + scrollWidth + 'px);';
        } else {
            content.classList.add('e-gantt-scroll-padding');
        }
        if (scrollWidth === 0 && isMobile) {
            headerDiv.style.cssText += 'width: calc(100% + 17px);';
        }
    }
    private bindEvents(): void {
        this.parent.treeGrid.dataBound = this.dataBound.bind(this);
        this.parent.treeGrid.collapsing = this.collapsing.bind(this);
        this.parent.treeGrid.collapsed = this.collapsed.bind(this);
        this.parent.treeGrid.expanding = this.expanding.bind(this);
        this.parent.treeGrid.expanded = this.expanded.bind(this);
        this.parent.treeGrid.actionBegin = this.actionBegin.bind(this);
        this.parent.treeGrid.actionComplete = this.treeActionComplete.bind(this);
        this.parent.treeGrid.created = this.created.bind(this);
        this.parent.treeGrid.actionFailure = this.actionFailure.bind(this);
        this.parent.treeGrid.queryCellInfo = this.queryCellInfo.bind(this);
        this.parent.treeGrid.headerCellInfo = this.headerCellInfo.bind(this);
        this.parent.treeGrid.rowDataBound = this.rowDataBound.bind(this);
        this.parent.treeGrid.columnMenuOpen = this.columnMenuOpen.bind(this);
        this.parent.treeGrid.columnMenuClick = this.columnMenuClick.bind(this);
        this.parent.treeGrid.beforeDataBound = this.beforeDataBound.bind(this);
        this.parent.treeGrid.dataStateChange = this.dataStateChange.bind(this);
    }

    private beforeDataBound(args: object): void {
        this.parent.updatedRecords = this.parent.virtualScrollModule && this.parent.enableVirtualization ?
            getValue('virtualScrollModule.visualData', this.parent.treeGrid) : getValue('result', args);
        if (this.parent.virtualScrollModule && this.parent.enableVirtualization) {
            this.parent.updateContentHeight(args);
        }
        setValue('contentModule.objectEqualityChecker', this.objectEqualityChecker, this.parent.treeGrid.grid);
    }
    private dataBound(args: object): void {
        this.ensureScrollBar();
        this.parent.treeDataBound(args);
        this.prevCurrentView = extend([], [], this.parent.currentViewData, true);
    }
    private dataStateChange(args: DataStateChangeEventArgs): void {
        if (args.action && args.action.requestType === 'refresh') {
            this.parent.treeGrid.dataSource = {
                result: getValue('result', this.parent.treeGrid.dataSource),
                count: getValue('count', this.parent.treeGrid.dataSource)
            };
        }
        this.parent.trigger('dataStateChange', args);
    }
    private collapsing(args: object): void | Deferred {
        // Collapsing event
        const callBackPromise: Deferred = new Deferred();
        if (!this.parent.ganttChartModule.isExpandCollapseFromChart) {
            const collapsingArgs: object = this.createExpandCollapseArgs(args);
            this.parent.ganttChartModule.collapseGanttRow(collapsingArgs);
            setValue('cancel', getValue('cancel', collapsingArgs), args);
        }
    }
    private expanding(args: object): void | Deferred {
        // Expanding event
        const callBackPromise: Deferred = new Deferred();
        if (!this.parent.ganttChartModule.isExpandCollapseFromChart) {
            const expandingArgs: object = this.createExpandCollapseArgs(args);
            this.parent.ganttChartModule.expandGanttRow(expandingArgs);
            setValue('cancel', getValue('cancel', expandingArgs), args);
        }
    }
    private collapsed(args: object): void {
        if (!this.parent.ganttChartModule.isExpandCollapseFromChart  && !this.parent.isExpandCollapseLevelMethod) {
            const collapsedArgs: object = this.createExpandCollapseArgs(args);
            this.parent.ganttChartModule.collapsedGanttRow(collapsedArgs);
        }
    }
    private expanded(args: object): void {
        if (!this.parent.ganttChartModule.isExpandCollapseFromChart && !this.parent.isExpandCollapseLevelMethod) {
            if(!args['data'].length) {
                const expandedArgs: object = this.createExpandCollapseArgs(args);
                this.parent.ganttChartModule.expandedGanttRow(expandedArgs);
            }
        }
    }
    private actionBegin(args: FilterEventArgs | SortEventArgs): void {
        this.parent.notify('actionBegin', args);
        this.parent.trigger('actionBegin', args);
    }// eslint-disable-next-line
    private created(args: object): void {
        this.updateKeyConfigSettings();
    }
    private actionFailure(args: FailureEventArgs): void {
        this.parent.trigger('actionFailure', args);
    }
    private queryCellInfo = (args: QueryCellInfoEventArgs) => {
        this.parent.trigger('queryCellInfo', args);
    }
    private headerCellInfo = (args: HeaderCellInfoEventArgs) => {
        this.parent.trigger('headerCellInfo', args);
    }
    private rowDataBound = (args: RowDataBoundEventArgs) => {
        this.parent.trigger('rowDataBound', args);
    }
    private columnMenuOpen = (args: ColumnMenuOpenEventArgs) => {
        this.parent.notify('columnMenuOpen', args);
        this.parent.trigger('columnMenuOpen', args);
    }
    private columnMenuClick = (args: ColumnMenuClickEventArgs) => {
        this.parent.trigger('columnMenuClick', args);
    }
    private createExpandCollapseArgs(args: object): object {
        const record: IGanttData = getValue('data', args);
        const gridRow: Node = getValue('row', args);
        let chartRow: Node;
        chartRow = this.parent.ganttChartModule.getChartRows()[this.parent.currentViewData.indexOf(record)];
        const eventArgs: object = { data: record, gridRow: gridRow, chartRow: chartRow, cancel: false };
        return eventArgs;
    }
    // eslint-disable-next-line valid-jsdoc
    private objectEqualityChecker = (old: Object, current: Object) => {
        if (old) {
            const keys: string[] = Object.keys(old);
            let isEqual: boolean = true;
            const excludeKeys: string[] = ['Children', 'childRecords', 'taskData', 'uniqueID', 'parentItem', 'parentUniqueID', 'ganttProperties'];
            for (let i: number = 0; i < keys.length; i++) {
                /* eslint-disable-next-line */
                const oldKey: any = old[keys[i]] instanceof Date ? new Date(old[keys[i]]).getTime() : old[keys[i]];
                /* eslint-disable-next-line */
				const currentKey: any = current[keys[i]] instanceof Date ? new Date(current[keys[i]]).getTime() : current[keys[i]];
                if (oldKey !== currentKey && excludeKeys.indexOf(keys[i]) === -1) {
                    this.parent.modifiedRecords.push(current);
                    isEqual = false; break;
                }
            }
            return isEqual;
        } else {
            return false;
        }
    }
    private treeActionComplete(args: object): void {
        const updatedArgs: object = extend({}, args, true);
        if (getValue('requestType', args) === 'sorting') {
            this.parent.notify('updateModel', {});
            deleteObject(updatedArgs, 'isFrozen');
        } else if (getValue('requestType', args) === 'filtering') {
            this.parent.notify('updateModel', {});
            const focussedElement: HTMLElement = this.parent.element.querySelector('.e-treegrid');
            focussedElement.focus();
        } else if (getValue('type', args) === 'save') {
            if (this.parent.editModule && this.parent.editModule.cellEditModule) {
                const data: IGanttData = getValue('data', args);
                if (!isNullOrUndefined(data) && !isNullOrUndefined(this.parent.getTaskByUniqueID(data.uniqueID))) {
                    /* eslint-disable-next-line */
                    this.parent.getTaskByUniqueID(data.uniqueID).taskData[this.parent.taskFields.duration] = data.taskData[this.parent.taskFields.duration];
                    if (!isNullOrUndefined(data.taskData[this.parent.taskFields.resourceInfo])) {
                        /* eslint-disable-next-line */
                        this.parent.getTaskByUniqueID(data.uniqueID).taskData[this.parent.taskFields.resourceInfo] = data.taskData[this.parent.taskFields.resourceInfo];
                    }
                }
                this.parent.editModule.cellEditModule.initiateCellEdit(args, this.currentEditRow);
                this.currentEditRow = {};
            }
        }
        if (getValue('requestType', args) === 'filterafteropen') {
            this.parent.notify('actionComplete', args);
        }
        if (getValue('requestType', args) === 'searching') {
            this.parent.notify('actionComplete', args);
        }
        if (!isNullOrUndefined(getValue('batchChanges', args)) && !isNullOrUndefined(this.parent.toolbarModule)) {
            this.parent.toolbarModule.refreshToolbarItems();
        }
        if (this.parent.isCancelled) {
            setValue('requestType', 'cancel', updatedArgs);
            setValue('action', 'CellEditing', updatedArgs);
            this.parent.isCancelled = false;
        }
        if (getValue('requestType', args) === 'refresh' && isNullOrUndefined(getValue('type', args)) && this.parent.addDeleteRecord) {
            if (this.parent.selectedRowIndex != -1) {
                this.parent.selectRow(this.parent.selectedRowIndex);
            } else {
                this.parent.selectRow(0);
            }
            this.parent.addDeleteRecord = false;
        }
        this.parent.trigger('actionComplete', updatedArgs);
    }

    private updateKeyConfigSettings(): void {
        delete this.parent.treeGrid.grid.keyboardModule.keyConfigs.delete;
        delete this.parent.treeGrid.grid.keyboardModule.keyConfigs.insert;
        delete this.parent.treeGrid.grid.keyboardModule.keyConfigs.upArrow;
        delete this.parent.treeGrid.grid.keyboardModule.keyConfigs.downArrow;
        delete this.parent.treeGrid.grid.keyboardModule.keyConfigs.ctrlHome;
        delete this.parent.treeGrid.grid.keyboardModule.keyConfigs.ctrlEnd;
        delete this.parent.treeGrid.grid.keyboardModule.keyConfigs.enter;
        delete this.parent.treeGrid.grid.keyboardModule.keyConfigs.tab;
        delete this.parent.treeGrid.grid.keyboardModule.keyConfigs.shiftTab;
        delete this.parent.treeGrid.keyboardModule.keyConfigs.enter;
        delete this.parent.treeGrid.keyboardModule.keyConfigs.upArrow;
        delete this.parent.treeGrid.keyboardModule.keyConfigs.downArrow;
        delete this.parent.treeGrid.keyboardModule.keyConfigs.ctrlShiftUpArrow;
        delete this.parent.treeGrid.keyboardModule.keyConfigs.ctrlShiftDownArrow;
        delete this.parent.treeGrid.keyboardModule.keyConfigs.ctrlUpArrow;
        delete this.parent.treeGrid.keyboardModule.keyConfigs.ctrlDownArrow;
        delete this.parent.treeGrid.keyboardModule.keyConfigs.tab;
        delete this.parent.treeGrid.keyboardModule.keyConfigs.shiftTab;
    }

    /**
     * Method to bind internal events on TreeGrid element
     *
     * @returns {void} .
     */
    private wireEvents(): void {
        const content: HTMLElement = this.parent.treeGrid.element.querySelector('.e-content');
        if (content) {
            EventHandler.add(content, 'scroll', this.scrollHandler, this);
        }
        if (this.parent.isAdaptive) {
            EventHandler.add(this.parent.treeGridPane, 'click', this.treeGridClickHandler, this);
        }
    }
    private unWireEvents(): void {
        const content: HTMLElement = this.parent.treeGrid.element &&
            this.parent.treeGrid.element.querySelector('.e-content');
        if (content) {
            EventHandler.remove(content, 'scroll', this.scrollHandler);
        }
        if (this.parent.isAdaptive) {
            EventHandler.remove(this.parent.treeGridPane, 'click', this.treeGridClickHandler);
        }
    }
    // eslint-disable-next-line
    private scrollHandler(e: WheelEvent): void {
        const content: HTMLElement = this.parent.treeGrid.element.querySelector('.e-content');
        if (content.scrollTop !== this.previousScroll.top) {
            this.parent.notify('grid-scroll', { top: content.scrollTop });
        }
        this.previousScroll.top = content.scrollTop;
        if (this.parent.contextMenuModule && this.parent.contextMenuModule.isOpen) {
            this.parent.contextMenuModule.contextMenu.close();
        }
    }
    /**
     * @returns {void} .
     * @private
     */
    public validateGanttColumns(): void {
        const ganttObj: Gantt = this.parent;
        const length: number = ganttObj.columns.length;
        const tasks: TaskFieldsModel = this.parent.taskFields;
        this.parent.columnMapping = {};
        this.parent.columnByField = {};
        this.parent.customColumns = [];
        const tasksMapping: string[] = ['id', 'name', 'startDate', 'endDate', 'duration', 'dependency',
            'progress', 'baselineStartDate', 'baselineEndDate', 'resourceInfo', 'notes', 'work', 'manual', 'type'];
        for (let i: number = 0; i < length; i++) {
            let column: GanttColumnModel = {};
            if (typeof ganttObj.columns[i] === 'string') {
                column.field = ganttObj.columns[i] as string;
            } else {
                column = <GanttColumnModel>ganttObj.columns[i];
            }
            let columnName: string[] = [];
            if (tasksMapping.length > 0) {
                columnName = tasksMapping.filter((name: string) => {
                    return column.field === tasks[name];
                });
            }
            if (columnName.length === 0) {
                if (column.field === this.parent.resourceFields.group) {
                    continue;
                }
                this.parent.customColumns.push(column.field);
                column.headerText = column.headerText ? column.headerText : column.field;
                column.width = column.width ? column.width : 150;
                column.editType = column.editType ? column.editType : 'stringedit';
                column.type = column.type ? column.type : 'string';
                this.bindTreeGridColumnProperties(column, true);
                continue;
            } else {
                const index: number = tasksMapping.indexOf(columnName[0]);
                tasksMapping.splice(index, 1);
                this.createTreeGridColumn(column, true);
                this.parent.columnMapping[columnName[0]] = column.field;
            }
        }

        /** Create default columns with task settings property */
        for (let j: number = 0; j < tasksMapping.length; j++) {
            const column: GanttColumnModel = {};
            if (!isNullOrUndefined(tasks[tasksMapping[j]])) {
                column.field = tasks[tasksMapping[j]];
                this.createTreeGridColumn(column, length === 0);
                this.parent.columnMapping[tasksMapping[j]] = column.field;
            }
        }
        if (this.parent.viewType !== 'ProjectView') {
            const column: GanttColumnModel = {};
            this.composeUniqueIDColumn(column);
            this.createTreeGridColumn(column, true);
        }
    }

    /**
     *
     * @param {GanttColumnModel} column .
     * @param {boolean} isDefined .
     * @returns {void} .
     */
    private createTreeGridColumn(column: GanttColumnModel, isDefined?: boolean): void {
        const taskSettings: TaskFieldsModel = this.parent.taskFields;
        column.disableHtmlEncode = !isNullOrUndefined(column.disableHtmlEncode) ? column.disableHtmlEncode : this.parent.disableHtmlEncode;
        if (taskSettings.id !== column.field) {
            column.clipMode = column.clipMode ? column.clipMode : 'EllipsisWithTooltip';
        }
        if (taskSettings.id === column.field) {
            /** Id column */
            this.composeIDColumn(column);
        } else if (taskSettings.name === column.field) {
            /** Name column */
            column.headerText = column.headerText ? column.headerText : this.parent.localeObj.getConstant('name');
            column.width = column.width ? column.width : 150;
            column.editType = column.editType ? column.editType : 'stringedit';
            column.type = column.type ? column.type : 'string';
        } else if (taskSettings.startDate === column.field) {
            /** Name column */
            column.headerText = column.headerText ? column.headerText : this.parent.localeObj.getConstant('startDate');
            column.editType = column.editType ? column.editType :
                this.parent.getDateFormat().toLowerCase().indexOf('hh') !== -1 ? 'datetimepickeredit' : 'datepickeredit';
            column.format = column.format ? column.format : { type: 'date', format: this.parent.getDateFormat() };
            column.width = column.width ? column.width : 150;
            column.edit = { params: { renderDayCell: this.parent.renderWorkingDayCell.bind(this.parent) } };
        } else if (taskSettings.endDate === column.field) {
            column.headerText = column.headerText ? column.headerText : this.parent.localeObj.getConstant('endDate');
            column.format = column.format ? column.format : { type: 'date', format: this.parent.getDateFormat() };
            column.editType = column.editType ? column.editType :
                this.parent.getDateFormat().toLowerCase().indexOf('hh') !== -1 ? 'datetimepickeredit' : 'datepickeredit';
            column.width = column.width ? column.width : 150;
            column.edit = { params: { renderDayCell: this.parent.renderWorkingDayCell.bind(this.parent) } };
        } else if (taskSettings.duration === column.field) {
            column.width = column.width ? column.width : 150;
            column.headerText = column.headerText ? column.headerText : this.parent.localeObj.getConstant('duration');
            column.valueAccessor = column.valueAccessor ? column.valueAccessor : !isNullOrUndefined(column.edit) ? null :
                this.durationValueAccessor.bind(this);
            column.editType = column.editType ? column.editType : 'stringedit';
            column.type = 'string';
        } else if (taskSettings.progress === column.field) {
            this.composeProgressColumn(column);
        } else if (taskSettings.dependency === column.field) {
            column.headerText = column.headerText ? column.headerText : this.parent.localeObj.getConstant('dependency');
            column.width = column.width ? column.width : 150;
            column.editType = column.editType ? column.editType : 'stringedit';
            column.type = 'string';
            column.allowFiltering = column.allowFiltering === false ? false : true;
        } else if (taskSettings.resourceInfo === column.field) {
            this.composeResourceColumn(column);
        } else if (taskSettings.notes === column.field) {
            column.headerText = column.headerText ? column.headerText : this.parent.localeObj.getConstant('notes');
            column.width = column.width ? column.width : 150;
            column.editType = column.editType ? column.editType : 'stringedit';
            if (!this.parent.showInlineNotes) {
                if (!column.template) {
                    column.template = '<div class="e-ganttnotes-info">' +
                        '<span class="e-icons e-notes-info"></span></div>';
                }
            }
        } else if (taskSettings.baselineStartDate === column.field ||
            taskSettings.baselineEndDate === column.field) {
            const colName: string = (taskSettings.baselineEndDate === column.field) ? 'baselineEndDate' :
                'baselineStartDate';
            column.width = column.width ? column.width : 150;
            column.headerText = column.headerText ? column.headerText : this.parent.localeObj.getConstant(colName);
            column.format = column.format ? column.format : { type: 'date', format: this.parent.getDateFormat() };
            column.editType = column.editType ? column.editType :
                this.parent.getDateFormat().toLowerCase().indexOf('hh') !== -1 ? 'datetimepickeredit' : 'datepickeredit';
        } else if (taskSettings.work === column.field) {
            column.headerText = column.headerText ? column.headerText : this.parent.localeObj.getConstant('work');
            column.width = column.width ? column.width : 150;
            column.valueAccessor = column.valueAccessor ? column.valueAccessor : this.workValueAccessor.bind(this);
            column.editType = column.editType ? column.editType : 'numericedit';

        } else if (taskSettings.type === column.field) {
            column.headerText = column.headerText ? column.headerText : this.parent.localeObj.getConstant('taskType');
            column.width = column.width ? column.width : 150;
            //column.type = 'string';
            column.editType = 'dropdownedit';
            column.valueAccessor = column.valueAccessor ? column.valueAccessor : this.taskTypeValueAccessor.bind(this);
        } else if (taskSettings.manual === column.field && this.parent.taskMode  === 'Custom') {
            column.headerText = column.headerText ? column.headerText : this.parent.localeObj.getConstant('taskMode');
            column.width = column.width ? column.width : 120;
            column.editType = column.editType ? column.editType : 'dropdownedit';
            column.valueAccessor = column.valueAccessor ? column.valueAccessor : this.modeValueAccessor.bind(this);
            column.edit = {
                params:
                {
                    query: new Query(),
                    dataSource: [
                        { id: 1, text: this.parent.localeObj.getConstant('manual'), value: true },
                        { id: 2, text: this.parent.localeObj.getConstant('auto'), value: false }
                    ],
                    fields: { text: 'text', value: 'value'}
                }
            };
        }
        this.bindTreeGridColumnProperties(column, isDefined);
    }
    /**
     * Compose Resource columns
     *
     * @param {GanttColumnModel} column .
     * @returns {void} .
     */
    private composeResourceColumn(column: GanttColumnModel): void {
        column.headerText = column.headerText ? column.headerText : this.parent.localeObj.getConstant('resourceName');
        column.width = column.width ? column.width : 150;
        column.type = 'string';
        column.valueAccessor = column.valueAccessor ? column.valueAccessor : this.resourceValueAccessor.bind(this);
        column.allowFiltering = column.allowFiltering === false ? false : true;
    }
    /**
     * @param {IGanttData} data .
     * @returns {object} .
     * @private
     */
    public getResourceIds(data: IGanttData): object {
        const value: Object[] = getValue(this.parent.taskFields.resourceInfo, data.taskData);
        const id: number[] = [];
        if (!isNullOrUndefined(value)) {
            for (let i: number = 0; i < value.length; i++) {
                id.push(typeof value[i] === 'object' ? value[i][this.parent.resourceFields.id] : value[i]);
            }
            return id;
        } else {
            return value;
        }
    }
    /**
     * Create Id column
     *
     * @param {GanttColumnModel} column .
     * @returns {void} .
     */
    private composeIDColumn(column: GanttColumnModel): void {
        const isProjectView: boolean = this.parent.viewType === 'ProjectView';
        column.isPrimaryKey = isProjectView ? true : false;
        column.headerText = column.headerText ? column.headerText : this.parent.localeObj.getConstant('id');
        column.width = column.width ? column.width : 100;
        column.allowEditing = column.allowEditing ? column.allowEditing : false;
        column.editType = column.editType ? column.editType : 'numericedit';
        column.valueAccessor = isProjectView ? null : this.idValueAccessor.bind(this);
    }
    private composeUniqueIDColumn(column: GanttColumnModel): void {
        column.field = 'rowUniqueID';
        column.isPrimaryKey = true;
        column.headerText = 'UniqueID';
        column.allowEditing = false;
        column.visible = false;
    }

    /**
     * Create progress column
     *
     * @param {GanttColumnModel} column .
     * @returns {void} .
     */
    private composeProgressColumn(column: GanttColumnModel): void {
        column.headerText = column.headerText ? column.headerText : this.parent.localeObj.getConstant('progress');
        column.width = column.width ? column.width : 150;
        column.editType = column.editType ? column.editType : 'numericedit';
    }

    /**
     * @param {GanttColumnModel} newGanttColumn .
     * @param {boolean} isDefined .
     * @returns {void} .
     */
    private bindTreeGridColumnProperties(newGanttColumn: GanttColumnModel, isDefined?: boolean): void {
        const treeGridColumn: ColumnModel = {}; const ganttColumn: GanttColumnModel = {};
        for (const prop of Object.keys(newGanttColumn)) {
            treeGridColumn[prop] = ganttColumn[prop] = newGanttColumn[prop];
        }
        this.parent.columnByField[ganttColumn.field] = ganttColumn;
        this.parent.ganttColumns.push(new GanttColumn(ganttColumn));
        if (isDefined) {
            this.treeGridColumns.push(treeGridColumn);
        }
    }// eslint-disable-next-line
    private durationValueAccessor(field: string, data: IGanttData, column: GanttColumnModel): string { 
        const ganttProp: ITaskData = data.ganttProperties;
        if (!isNullOrUndefined(ganttProp)) {
            return this.parent.dataOperation.getDurationString(ganttProp.duration, ganttProp.durationUnit);
        }
        return '';
    }// eslint-disable-next-line
    private resourceValueAccessor(field: string, data: IGanttData, column: GanttColumnModel): string {
        const ganttProp: ITaskData = data.ganttProperties;
        if (!isNullOrUndefined(ganttProp)) {
            return ganttProp.resourceNames;
        }
        return '';
    }

    private workValueAccessor(field: string, data: IGanttData, column: GanttColumnModel): string {   // eslint-disable-line
        const ganttProp: ITaskData = data.ganttProperties;
        if (!isNullOrUndefined(ganttProp)) {
            return this.parent.dataOperation.getWorkString(ganttProp.work, ganttProp.workUnit);
        }
        return '';
    }
    private taskTypeValueAccessor(field: string, data: IGanttData, column: GanttColumnModel): string {   // eslint-disable-line
        const ganttProp: ITaskData = data.ganttProperties;
        if (!isNullOrUndefined(ganttProp)) {
            return ganttProp.taskType;
        }
        return '';
    }
    private modeValueAccessor(field: string, data: IGanttData, column: GanttColumnModel): string {   // eslint-disable-line
        if (data[field]) {
            return 'Manual';
        } else {
            return 'Auto';
        }
    }

    private idValueAccessor(field: string, data: IGanttData, column: GanttColumnModel): string {   // eslint-disable-line
        return data.level === 0 ? 'R-' + data.ganttProperties.taskId : 'T-' + data.ganttProperties.taskId;
    }

    private updateScrollTop(args: object): void {
        this.treeGridElement.querySelector('.e-content').scrollTop = getValue('top', args);
        this.previousScroll.top = this.treeGridElement.querySelector('.e-content').scrollTop;
    }
    private treeGridClickHandler(e: PointerEvent): void {
        this.parent.notify('treeGridClick', e);
    }
    private removeEventListener(): void {
        this.parent.off('renderPanels', this.createContainer);
        this.parent.off('chartScroll', this.updateScrollTop);
        this.parent.off('destroy', this.destroy);
        this.parent.treeGrid.off('reactTemplateRender', this.renderReactTemplate);
    }
    private destroy(): void {
        this.removeEventListener();
        this.unWireEvents();
        if (this.parent.treeGrid.element) {
            this.parent.treeGrid.destroy();
        }
    }
}
