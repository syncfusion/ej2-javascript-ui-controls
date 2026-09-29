import { ComponentBase, gh, getProps, isExecute, vueDefineComponent, DefineVueComponent } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined, getValue } from '@syncfusion/ej2-base';
import { isUndefined } from '@syncfusion/ej2-base';

import { Gantt, GanttModel } from '@syncfusion/ej2-gantt';
import { ColumnsDirective, ColumnDirective, ColumnsPlugin, ColumnPlugin } from './columns.directive'
import { AddDialogFieldsDirective, AddDialogFieldDirective, AddDialogFieldsPlugin, AddDialogFieldPlugin } from './adddialogfields.directive'
import { EditDialogFieldsDirective, EditDialogFieldDirective, EditDialogFieldsPlugin, EditDialogFieldPlugin } from './editdialogfields.directive'
import { DayWorkingTimeCollectionDirective, DayWorkingTimeDirective, DayWorkingTimeCollectionPlugin, DayWorkingTimePlugin } from './dayworkingtime.directive'
import { WeekWorkingTimesDirective, WeekWorkingTimeDirective, WeekWorkingTimesPlugin, WeekWorkingTimePlugin } from './weekworkingtime.directive'
import { HolidaysDirective, HolidayDirective, HolidaysPlugin, HolidayPlugin } from './holidays.directive'
import { EventMarkersDirective, EventMarkerDirective, EventMarkersPlugin, EventMarkerPlugin } from './eventmarkers.directive'


export const properties: string[] = ['isLazyUpdate', 'plugins', 'addDialogFields', 'allowExcelExport', 'allowFiltering', 'allowKeyboard', 'allowParentDependency', 'allowPdfExport', 'allowReordering', 'allowResizing', 'allowRowDragAndDrop', 'allowSelection', 'allowSorting', 'allowTaskbarDragAndDrop', 'allowTaskbarOverlap', 'allowUnscheduledTasks', 'allowedDependencyTypes', 'autoCalculateDateScheduling', 'autoFocusTasks', 'autoUpdatePredecessorOffset', 'baselineColor', 'baselineTemplate', 'calendarSettings', 'collapseAllParentTasks', 'columnMenuItems', 'columns', 'connectorLineBackground', 'connectorLineWidth', 'contextMenuItems', 'dataSource', 'dateFormat', 'dayWorkingTime', 'daysPerMonth', 'daysPerWeek', 'disableHtmlEncode', 'durationUnit', 'editDialogFields', 'editSettings', 'emptyRecordTemplate', 'enableAdaptiveUI', 'enableAutoWbsUpdate', 'enableContextMenu', 'enableCriticalPath', 'enableHover', 'enableHtmlSanitizer', 'enableImmutableMode', 'enableInfiniteTimelineScroll', 'enableMultiTaskbar', 'enablePersistence', 'enablePredecessorValidation', 'enableRtl', 'enableSerialNumber', 'enableTimelineVirtualization', 'enableUndoRedo', 'enableVirtualMaskRow', 'enableVirtualization', 'enableWBS', 'enableWebMcp', 'eventMarkers', 'filterSettings', 'frozenColumns', 'gridLines', 'height', 'hierarchyCheckboxMode', 'highlightWeekends', 'holidays', 'hoursPerDay', 'includeWeekend', 'labelSettings', 'loadChildOnDemand', 'loadingIndicator', 'locale', 'milestoneTemplate', 'parentTaskbarTemplate', 'projectEndDate', 'projectStartDate', 'query', 'readOnly', 'renderBaseline', 'resourceFields', 'resourceIDMapping', 'resourceNameMapping', 'resources', 'rowHeight', 'searchSettings', 'segmentData', 'selectedRowIndex', 'selectionSettings', 'showColumnMenu', 'showInlineNotes', 'showOverAllocation', 'sortSettings', 'splitterSettings', 'taskFields', 'taskMode', 'taskType', 'taskbarHeight', 'taskbarTemplate', 'timelineSettings', 'timelineTemplate', 'timezone', 'toolbar', 'tooltipSettings', 'treeColumnIndex', 'undoRedoActions', 'undoRedoStepsCount', 'updateOffsetOnTaskbarEdit', 'validateManualTasksOnLinking', 'viewType', 'weekWorkingTime', 'width', 'workUnit', 'workWeek', 'zoomingLevels', 'actionBegin', 'actionComplete', 'actionFailure', 'beforeDataBound', 'beforeExcelExport', 'beforePdfExport', 'beforeTooltipRender', 'cellDeselected', 'cellDeselecting', 'cellEdit', 'cellSave', 'cellSelected', 'cellSelecting', 'collapsed', 'collapsing', 'columnDrag', 'columnDragStart', 'columnDrop', 'columnMenuClick', 'columnMenuOpen', 'contextMenuClick', 'contextMenuOpen', 'created', 'dataBound', 'dataSourceChanged', 'dataStateChange', 'destroyed', 'endEdit', 'excelExportComplete', 'excelHeaderQueryCellInfo', 'excelQueryCellInfo', 'expanded', 'expanding', 'headerCellInfo', 'load', 'onMouseMove', 'onTaskbarClick', 'pdfColumnHeaderQueryCellInfo', 'pdfExportComplete', 'pdfQueryCellInfo', 'pdfQueryTaskbarInfo', 'pdfQueryTimelineCellInfo', 'queryCellInfo', 'queryTaskbarInfo', 'recordDoubleClick', 'resizeStart', 'resizeStop', 'resizing', 'rowDataBound', 'rowDeselected', 'rowDeselecting', 'rowDrag', 'rowDragStart', 'rowDragStartHelper', 'rowDrop', 'rowSelected', 'rowSelecting', 'splitterResizeStart', 'splitterResized', 'splitterResizing', 'taskbarEdited', 'taskbarEditing', 'toolbarClick', 'beforeWebMcpToolExecute'];
export const modelProps: string[] = ['dataSource'];

export const testProp: any = getProps({props: properties});
export const props = testProp[0], watch = testProp[1], emitProbs: any = Object.keys(watch);
emitProbs.push('modelchanged', 'update:modelValue');
for (let props of modelProps) { emitProbs.push('update:'+props) }

/**
 * `ejs-gantt` represents the VueJS Gantt Component.
 * ```
 * <ejs-gantt :dataSource='data' allowSelection='true' allowSorting='true'></ejs-gantt>
 * ```
 */
export let GanttComponent: DefineVueComponent<GanttModel> =  vueDefineComponent({
    name: 'GanttComponent',
    mixins: [ComponentBase],
    props: props,
    watch: watch,
    emits: emitProbs,
    model: { event: 'modelchanged' },
    provide() { return { custom: this.custom } },
    data() {
        return {
            ej2Instance: new Gantt({}) as any,
            propKeys: properties as string[],
            models: modelProps as string[],
            hasChildDirective: true as boolean,
            hasInjectedModules: true as boolean,
            tagMapper: {"e-columns":"e-column","e-add-dialog-fields":"e-add-dialog-field","e-edit-dialog-fields":"e-edit-dialog-field","e-day-working-time-collection":"e-day-working-time","e-week-working-times":"e-week-working-time","e-holidays":"e-holidays","e-event-markers":"e-event-marker"} as { [key: string]: Object },
            tagNameMapper: {"e-add-dialog-fields":"e-addDialogFields","e-edit-dialog-fields":"e-editDialogFields","e-day-working-time-collection":"e-dayWorkingTime","e-week-working-times":"e-weekWorkingTime","e-event-markers":"e-eventMarkers"} as Object,
            isVue3: !isExecute as boolean,
            templateCollection: {} as any,
        }
    },
    created() {
        this.ej2Instances._trigger = this.ej2Instances.trigger;
        this.ej2Instances.trigger = this.trigger;
        this.bindProperties();
        this.ej2Instances._setProperties = this.ej2Instances.setProperties;
        this.ej2Instances.setProperties = this.setProperties;
        this.ej2Instances.clearTemplate = this.clearTemplate;
        this.updated = this.updated;
    },
    render(createElement: any) {
        let h: any = !isExecute ? gh : createElement;
        let slots: any = null;
        if(!isNullOrUndefined((this as any).$slots.default)) {
            slots = !isExecute ? (this as any).$slots.default() : (this as any).$slots.default;
        }
        return h('div', slots);
    },
    methods: {
        clearTemplate(templateNames?: string[]): any {
            if (!templateNames){ templateNames = Object.keys(this.templateCollection || {}) }
            if (templateNames.length &&  this.templateCollection) {
                for (let tempName of templateNames){
                    let elementCollection: any = this.templateCollection[tempName];
                    if(elementCollection && elementCollection.length) {
                        for(let ele of elementCollection) {
                            this.destroyPortals(ele);
                        }
                        delete this.templateCollection[tempName];
                    }
                }
            }
        },
        setProperties(prop: any, muteOnChange: boolean): void {
            if(this.isVue3) { this.models = !this.models ? this.ej2Instances.referModels : this.models }
            if (this.ej2Instances && this.ej2Instances._setProperties) {
                this.ej2Instances._setProperties(prop, muteOnChange);
            }
            if (prop && this.models && this.models.length) {
                Object.keys(prop).map((key: string): void => {
                    this.models.map((model: string): void => {
                        if ((key === model) && !(/datasource/i.test(key))) {
                            if (this.isVue3) {
                                this.ej2Instances.vueInstance.$emit('update:' + key, prop[key]);
                            } else {
                                (this as any).$emit('update:' + key, prop[key]);
                                (this as any).$emit('modelchanged', prop[key]);
                            }
                        }
                    });
                });
            }
        },        
        trigger(eventName: string, eventProp: {[key:string]:Object}, successHandler?: Function): void {
            if(!isExecute) { this.models = !this.models ? this.ej2Instances.referModels : this.models }
            if ((eventName === 'change' || eventName === 'input') && this.models && (this.models.length !== 0)) {
                let key: string[] = this.models.toString().match(/checked|value/) || [];
                let propKey: string = key[0];
                if (eventProp && key && !isUndefined(eventProp[propKey])) {
                    if (!isExecute) {
                        this.ej2Instances.vueInstance.$emit('update:' + propKey, eventProp[propKey]);
                        this.ej2Instances.vueInstance.$emit('modelchanged', eventProp[propKey]);
                        this.ej2Instances.vueInstance.$emit('update:modelValue', eventProp[propKey]);
                    } else {
                        if (eventName === 'change' || ((this as any).$props && !(this as any).$props.isLazyUpdate)) {
                            (this as any).$emit('update:'+ propKey, eventProp[propKey]);
                            (this as any).$emit('modelchanged', eventProp[propKey]);
                        }
                    }
                }
            } else if ((eventName === 'actionBegin' && eventProp.requestType === 'dateNavigate') && this.models && (this.models.length !== 0)) {
                let key: string[] = this.models.toString().match(/currentView|selectedDate/) || [];
                let propKey: string = key[0];
                if (eventProp && key && !isUndefined(eventProp[propKey])) {
                    if (!isExecute) {
                        this.ej2Instances.vueInstance.$emit('update:' + propKey, eventProp[propKey]);
                        this.ej2Instances.vueInstance.$emit('modelchanged', eventProp[propKey]);
                    } else {
                        (this as any).$emit('update:'+ propKey, eventProp[propKey]);
                        (this as any).$emit('modelchanged', eventProp[propKey]);
                    }
                }
            }
            if ((this.ej2Instances && this.ej2Instances._trigger)) {
                this.ej2Instances._trigger(eventName, eventProp, successHandler); 
            }
        },

        custom(): void {
            this.updated();
        },
        addPredecessor(id: number | string, predecessorString: string): void {
            return this.ej2Instances.addPredecessor(id, predecessorString);
        },
        addRecord(data?: Object[] | Object | Object, rowPosition?: Object, rowIndex?: number): void {
            return this.ej2Instances.addRecord(data, rowPosition, rowIndex);
        },
        autoFitColumns(fieldNames?: string | string[]): void {
            return this.ej2Instances.autoFitColumns(fieldNames);
        },
        cancelEdit(): void {
            return this.ej2Instances.cancelEdit();
        },
        changeTaskMode(data: Object): void {
            return this.ej2Instances.changeTaskMode(data);
        },
        clearFiltering(fields?: string[]): void {
            return this.ej2Instances.clearFiltering(fields);
        },
        clearRedoCollection(): void {
            return this.ej2Instances.clearRedoCollection();
        },
        clearSelection(): void {
            return this.ej2Instances.clearSelection();
        },
        clearSorting(): void {
            return this.ej2Instances.clearSorting();
        },
        clearUndoCollection(): void {
            return this.ej2Instances.clearUndoCollection();
        },
        collapseAll(): void {
            return this.ej2Instances.collapseAll();
        },
        collapseByID(id: number | string): void {
            return this.ej2Instances.collapseByID(id);
        },
        collapseByIndex(index: number): void {
            return this.ej2Instances.collapseByIndex(index);
        },
        convertToMilestone(id: string): void {
            return this.ej2Instances.convertToMilestone(id);
        },
        csvExport(excelExportProperties?: Object, isMultipleExport?: boolean, workbook?: any, isBlob?: boolean): Object {
            return this.ej2Instances.csvExport(excelExportProperties, isMultipleExport, workbook, isBlob);
        },
        deleteRecord(taskDetail: number | string | number[] | string[] | Object | Object[]): void {
            return this.ej2Instances.deleteRecord(taskDetail);
        },
        enableItems(items: string[], isEnable: boolean): void {
            return this.ej2Instances.enableItems(items, isEnable);
        },
        excelExport(excelExportProperties?: Object, isMultipleExport?: boolean, workbook?: any, isBlob?: boolean): Object {
            return this.ej2Instances.excelExport(excelExportProperties, isMultipleExport, workbook, isBlob);
        },
        expandAll(): void {
            return this.ej2Instances.expandAll();
        },
        expandByID(id: number | string): void {
            return this.ej2Instances.expandByID(id);
        },
        expandByIndex(index: number[] | number): void {
            return this.ej2Instances.expandByIndex(index);
        },
        filterByColumn(fieldName: string, filterOperator: string, filterValue: string | number | Object | boolean | number[] | string[] | Object[] | boolean[], predicate?: string, matchCase?: boolean, ignoreAccent?: boolean): void {
            return this.ej2Instances.filterByColumn(fieldName, filterOperator, filterValue, predicate, matchCase, ignoreAccent);
        },
        fitToProject(): void {
            return this.ej2Instances.fitToProject();
        },
        generateWBSCodes(flatDataCollection: Object[]): void {
            return this.ej2Instances.generateWBSCodes(flatDataCollection);
        },
        getCriticalTasks(): Object[] {
            return this.ej2Instances.getCriticalTasks();
        },
        getCurrentViewData(): Object[] {
            return this.ej2Instances.getCurrentViewData();
        },
        getDurationString(duration: number, durationUnit: string): string {
            return this.ej2Instances.getDurationString(duration, durationUnit);
        },
        getExpandedRecords(records: Object[]): Object[] {
            return this.ej2Instances.getExpandedRecords(records);
        },
        getFormatedDate(date: Object, format?: string): string {
            return this.ej2Instances.getFormatedDate(date, format);
        },
        getGanttColumns(): Object[] {
            return this.ej2Instances.getGanttColumns();
        },
        getGridColumns(): Object[] {
            return this.ej2Instances.getGridColumns();
        },
        getMaxRootWBSCode(parentDataCollection: Object[], parentItem?: Object): string {
            return this.ej2Instances.getMaxRootWBSCode(parentDataCollection, parentItem);
        },
        getRecordByID(id: string): Object {
            return this.ej2Instances.getRecordByID(id);
        },
        getRedoActions(): Object[] {
            return this.ej2Instances.getRedoActions();
        },
        getRowByID(id: string | number): Object {
            return this.ej2Instances.getRowByID(id);
        },
        getRowByIndex(index: number): Object {
            return this.ej2Instances.getRowByIndex(index);
        },
        getTaskByUniqueID(id: string): Object {
            return this.ej2Instances.getTaskByUniqueID(id);
        },
        getTaskInfo(taskId: string): Object {
            return this.ej2Instances.getTaskInfo(taskId);
        },
        getTaskbarHeight(): number {
            return this.ej2Instances.getTaskbarHeight();
        },
        getUndoActions(): Object[] {
            return this.ej2Instances.getUndoActions();
        },
        getWebMcpTools(toolNames?: string[]): Object[] {
            return this.ej2Instances.getWebMcpTools(toolNames);
        },
        getWorkString(work: number, workUnit: string): string {
            return this.ej2Instances.getWorkString(work, workUnit);
        },
        hideColumn(keys: string | string[], hideBy?: string): void {
            return this.ej2Instances.hideColumn(keys, hideBy);
        },
        hideMaskRow(): void {
            return this.ej2Instances.hideMaskRow();
        },
        hideSpinner(): void {
            return this.ej2Instances.hideSpinner();
        },
        indent(): void {
            return this.ej2Instances.indent();
        },
        keyActionHandler(e: Object): void {
            return this.ej2Instances.keyActionHandler(e);
        },
        mergeTask(taskId: number | string, segmentIndexes: undefined[]): void {
            return this.ej2Instances.mergeTask(taskId, segmentIndexes);
        },
        nextTimeSpan(mode?: string): void {
            return this.ej2Instances.nextTimeSpan(mode);
        },
        openAddDialog(): void {
            return this.ej2Instances.openAddDialog();
        },
        openEditDialog(taskId?: number | string): void {
            return this.ej2Instances.openEditDialog(taskId);
        },
        outdent(): void {
            return this.ej2Instances.outdent();
        },
        pdfExport(pdfExportProperties?: Object, isMultipleExport?: boolean, pdfDoc?: Object, isBlob?: boolean): Object {
            return this.ej2Instances.pdfExport(pdfExportProperties, isMultipleExport, pdfDoc, isBlob);
        },
        previousTimeSpan(mode?: string): void {
            return this.ej2Instances.previousTimeSpan(mode);
        },
        redo(): void {
            return this.ej2Instances.redo();
        },
        refreshColumns(refreshUI?: boolean): void {
            return this.ej2Instances.refreshColumns(refreshUI);
        },
        registerWebMcpTools(prefix?: string, tools?: string[] | Object[], exposedTo?: string[]): void {
            return this.ej2Instances.registerWebMcpTools(prefix, tools, exposedTo);
        },
        removeCriticalPathStyles(): void {
            return this.ej2Instances.removeCriticalPathStyles();
        },
        removePredecessor(id: number | string): void {
            return this.ej2Instances.removePredecessor(id);
        },
        removeSortColumn(columnName: string): void {
            return this.ej2Instances.removeSortColumn(columnName);
        },
        reorderColumns(fromFName: string | string[], toFName: string): void {
            return this.ej2Instances.reorderColumns(fromFName, toFName);
        },
        reorderRows(fromIndexes: number[], toIndex: number, position: string): void {
            return this.ej2Instances.reorderRows(fromIndexes, toIndex, position);
        },
        scrollToDate(date: string | Object): void {
            return this.ej2Instances.scrollToDate(date);
        },
        scrollToTask(taskId: string): void {
            return this.ej2Instances.scrollToTask(taskId);
        },
        search(keyVal: string): void {
            return this.ej2Instances.search(keyVal);
        },
        selectCell(cellIndex: Object, isToggle?: boolean): void {
            return this.ej2Instances.selectCell(cellIndex, isToggle);
        },
        selectCells(rowCellIndexes: Object[]): void {
            return this.ej2Instances.selectCells(rowCellIndexes);
        },
        selectRow(index: number, isToggle?: boolean): void {
            return this.ej2Instances.selectRow(index, isToggle);
        },
        selectRows(records: number[]): void {
            return this.ej2Instances.selectRows(records);
        },
        setScrollTop(scrollTop: number): void {
            return this.ej2Instances.setScrollTop(scrollTop);
        },
        setSplitterPosition(value: string | number, type: string): void {
            return this.ej2Instances.setSplitterPosition(value, type);
        },
        showColumn(keys: string | string[], showBy?: string): void {
            return this.ej2Instances.showColumn(keys, showBy);
        },
        showCriticalPath(isCritical: boolean): void {
            return this.ej2Instances.showCriticalPath(isCritical);
        },
        showMaskRow(): void {
            return this.ej2Instances.showMaskRow();
        },
        showSpinner(): void {
            return this.ej2Instances.showSpinner();
        },
        sortColumn(columnName: string, direction: Object, isMultiSort?: boolean): void {
            return this.ej2Instances.sortColumn(columnName, direction, isMultiSort);
        },
        splitTask(taskId: number | string, splitDate: Object | Object[]): void {
            return this.ej2Instances.splitTask(taskId, splitDate);
        },
        undo(): void {
            return this.ej2Instances.undo();
        },
        updateChartScrollOffset(left: number, top: number): void {
            return this.ej2Instances.updateChartScrollOffset(left, top);
        },
        updateDataSource(dataSource: Object[], args: object): void {
            return this.ej2Instances.updateDataSource(dataSource, args);
        },
        updatePredecessor(id: number | string, predecessorString: string): void {
            return this.ej2Instances.updatePredecessor(id, predecessorString);
        },
        updateProjectDates(startDate: Object, endDate: Object, isTimelineRoundOff: boolean, isFrom?: string): void {
            return this.ej2Instances.updateProjectDates(startDate, endDate, isTimelineRoundOff, isFrom);
        },
        updateRecordByID(data: Object): void {
            return this.ej2Instances.updateRecordByID(data);
        },
        updateRecordByIndex(index: number, data: Object): void {
            return this.ej2Instances.updateRecordByIndex(index, data);
        },
        updateTaskId(currentId: number | string, newId: number | string): void {
            return this.ej2Instances.updateTaskId(currentId, newId);
        },
        updateTimelineDates(startDate: Object, endDate: Object, isTimelineRoundOff: boolean, isFrom?: string): void {
            return this.ej2Instances.updateTimelineDates(startDate, endDate, isTimelineRoundOff, isFrom);
        },
        zoomIn(): void {
            return this.ej2Instances.zoomIn();
        },
        zoomOut(): void {
            return this.ej2Instances.zoomOut();
        },
    }
});

export type GanttComponent = typeof ComponentBase & {
    ej2Instance: Gantt;
    isVue3: boolean;
    isLazyUpdate: Boolean;
    plugins: any[];
    propKeys: string[];
    models: string[];
    hasChildDirective: boolean;
    tagMapper: {
        [key: string]: Object;
    };
    tagNameMapper: Object;
    setProperties(prop: any, muteOnChange: boolean): void;
    trigger(eventName: string, eventProp: {
        [key: string]: Object;
    }, successHandler?: Function): void;
    addPredecessor(id: number | string, predecessorString: string): void;
    addRecord(data?: Object[] | Object | Object, rowPosition?: Object, rowIndex?: number): void;
    autoFitColumns(fieldNames?: string | string[]): void;
    cancelEdit(): void;
    changeTaskMode(data: Object): void;
    clearFiltering(fields?: string[]): void;
    clearRedoCollection(): void;
    clearSelection(): void;
    clearSorting(): void;
    clearUndoCollection(): void;
    collapseAll(): void;
    collapseByID(id: number | string): void;
    collapseByIndex(index: number): void;
    convertToMilestone(id: string): void;
    csvExport(excelExportProperties?: Object, isMultipleExport?: boolean, workbook?: any, isBlob?: boolean): Object;
    deleteRecord(taskDetail: number | string | number[] | string[] | Object | Object[]): void;
    enableItems(items: string[], isEnable: boolean): void;
    excelExport(excelExportProperties?: Object, isMultipleExport?: boolean, workbook?: any, isBlob?: boolean): Object;
    expandAll(): void;
    expandByID(id: number | string): void;
    expandByIndex(index: number[] | number): void;
    filterByColumn(fieldName: string, filterOperator: string, filterValue: string | number | Object | boolean | number[] | string[] | Object[] | boolean[], predicate?: string, matchCase?: boolean, ignoreAccent?: boolean): void;
    fitToProject(): void;
    generateWBSCodes(flatDataCollection: Object[]): void;
    getCriticalTasks(): Object[];
    getCurrentViewData(): Object[];
    getDurationString(duration: number, durationUnit: string): string;
    getExpandedRecords(records: Object[]): Object[];
    getFormatedDate(date: Object, format?: string): string;
    getGanttColumns(): Object[];
    getGridColumns(): Object[];
    getMaxRootWBSCode(parentDataCollection: Object[], parentItem?: Object): string;
    getRecordByID(id: string): Object;
    getRedoActions(): Object[];
    getRowByID(id: string | number): Object;
    getRowByIndex(index: number): Object;
    getTaskByUniqueID(id: string): Object;
    getTaskInfo(taskId: string): Object;
    getTaskbarHeight(): number;
    getUndoActions(): Object[];
    getWebMcpTools(toolNames?: string[]): Object[];
    getWorkString(work: number, workUnit: string): string;
    hideColumn(keys: string | string[], hideBy?: string): void;
    hideMaskRow(): void;
    hideSpinner(): void;
    indent(): void;
    keyActionHandler(e: Object): void;
    mergeTask(taskId: number | string, segmentIndexes: undefined[]): void;
    nextTimeSpan(mode?: string): void;
    openAddDialog(): void;
    openEditDialog(taskId?: number | string): void;
    outdent(): void;
    pdfExport(pdfExportProperties?: Object, isMultipleExport?: boolean, pdfDoc?: Object, isBlob?: boolean): Object;
    previousTimeSpan(mode?: string): void;
    redo(): void;
    refreshColumns(refreshUI?: boolean): void;
    registerWebMcpTools(prefix?: string, tools?: string[] | Object[], exposedTo?: string[]): void;
    removeCriticalPathStyles(): void;
    removePredecessor(id: number | string): void;
    removeSortColumn(columnName: string): void;
    reorderColumns(fromFName: string | string[], toFName: string): void;
    reorderRows(fromIndexes: number[], toIndex: number, position: string): void;
    scrollToDate(date: string | Object): void;
    scrollToTask(taskId: string): void;
    search(keyVal: string): void;
    selectCell(cellIndex: Object, isToggle?: boolean): void;
    selectCells(rowCellIndexes: Object[]): void;
    selectRow(index: number, isToggle?: boolean): void;
    selectRows(records: number[]): void;
    setScrollTop(scrollTop: number): void;
    setSplitterPosition(value: string | number, type: string): void;
    showColumn(keys: string | string[], showBy?: string): void;
    showCriticalPath(isCritical: boolean): void;
    showMaskRow(): void;
    showSpinner(): void;
    sortColumn(columnName: string, direction: Object, isMultiSort?: boolean): void;
    splitTask(taskId: number | string, splitDate: Object | Object[]): void;
    undo(): void;
    updateChartScrollOffset(left: number, top: number): void;
    updateDataSource(dataSource: Object[], args: object): void;
    updatePredecessor(id: number | string, predecessorString: string): void;
    updateProjectDates(startDate: Object, endDate: Object, isTimelineRoundOff: boolean, isFrom?: string): void;
    updateRecordByID(data: Object): void;
    updateRecordByIndex(index: number, data: Object): void;
    updateTaskId(currentId: number | string, newId: number | string): void;
    updateTimelineDates(startDate: Object, endDate: Object, isTimelineRoundOff: boolean, isFrom?: string): void;
    zoomIn(): void;
    zoomOut(): void
};

export const GanttPlugin = {
    name: 'ejs-gantt',
    install(Vue: any) {
        Vue.component(GanttPlugin.name, GanttComponent);
        Vue.component(ColumnPlugin.name, ColumnDirective);
        Vue.component(ColumnsPlugin.name, ColumnsDirective);
        Vue.component(AddDialogFieldPlugin.name, AddDialogFieldDirective);
        Vue.component(AddDialogFieldsPlugin.name, AddDialogFieldsDirective);
        Vue.component(EditDialogFieldPlugin.name, EditDialogFieldDirective);
        Vue.component(EditDialogFieldsPlugin.name, EditDialogFieldsDirective);
        Vue.component(DayWorkingTimePlugin.name, DayWorkingTimeDirective);
        Vue.component(DayWorkingTimeCollectionPlugin.name, DayWorkingTimeCollectionDirective);
        Vue.component(WeekWorkingTimePlugin.name, WeekWorkingTimeDirective);
        Vue.component(WeekWorkingTimesPlugin.name, WeekWorkingTimesDirective);
        Vue.component(HolidayPlugin.name, HolidayDirective);
        Vue.component(HolidaysPlugin.name, HolidaysDirective);
        Vue.component(EventMarkerPlugin.name, EventMarkerDirective);
        Vue.component(EventMarkersPlugin.name, EventMarkersDirective);

    }
}