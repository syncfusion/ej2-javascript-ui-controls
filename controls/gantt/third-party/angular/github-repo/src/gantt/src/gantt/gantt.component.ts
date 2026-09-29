import { Component, ElementRef, ViewContainerRef, ChangeDetectionStrategy, QueryList, Renderer2, Injector, ValueProvider, ContentChild } from '@angular/core';
import { ComponentBase, IComponentBase, applyMixins, ComponentMixins, PropertyCollectionInfo, setValue } from '@syncfusion/ej2-angular-base';
import { Gantt } from '@syncfusion/ej2-gantt';
import { Template } from '@syncfusion/ej2-angular-base';
import { ColumnsDirective } from './columns.directive';
import { AddDialogFieldsDirective } from './adddialogfields.directive';
import { EditDialogFieldsDirective } from './editdialogfields.directive';
import { DayWorkingTimeCollectionDirective } from './dayworkingtime.directive';
import { WeekWorkingTimesDirective } from './weekworkingtime.directive';
import { HolidaysDirective } from './holidays.directive';
import { EventMarkersDirective } from './eventmarkers.directive';

export const inputs: string[] = ['addDialogFields','allowExcelExport','allowFiltering','allowKeyboard','allowParentDependency','allowPdfExport','allowReordering','allowResizing','allowRowDragAndDrop','allowSelection','allowSorting','allowTaskbarDragAndDrop','allowTaskbarOverlap','allowUnscheduledTasks','allowedDependencyTypes','autoCalculateDateScheduling','autoFocusTasks','autoUpdatePredecessorOffset','baselineColor','baselineTemplate','calendarSettings','collapseAllParentTasks','columnMenuItems','columns','connectorLineBackground','connectorLineWidth','contextMenuItems','dataSource','dateFormat','dayWorkingTime','daysPerMonth','daysPerWeek','disableHtmlEncode','durationUnit','editDialogFields','editSettings','emptyRecordTemplate','enableAdaptiveUI','enableAutoWbsUpdate','enableContextMenu','enableCriticalPath','enableHover','enableHtmlSanitizer','enableImmutableMode','enableInfiniteTimelineScroll','enableMultiTaskbar','enablePersistence','enablePredecessorValidation','enableRtl','enableSerialNumber','enableTimelineVirtualization','enableUndoRedo','enableVirtualMaskRow','enableVirtualization','enableWBS','enableWebMcp','eventMarkers','filterSettings','frozenColumns','gridLines','height','hierarchyCheckboxMode','highlightWeekends','holidays','hoursPerDay','includeWeekend','labelSettings','loadChildOnDemand','loadingIndicator','locale','milestoneTemplate','parentTaskbarTemplate','projectEndDate','projectStartDate','query','readOnly','renderBaseline','resourceFields','resourceIDMapping','resourceNameMapping','resources','rowHeight','searchSettings','segmentData','selectedRowIndex','selectionSettings','showColumnMenu','showInlineNotes','showOverAllocation','sortSettings','splitterSettings','taskFields','taskMode','taskType','taskbarHeight','taskbarTemplate','timelineSettings','timelineTemplate','timezone','toolbar','tooltipSettings','treeColumnIndex','undoRedoActions','undoRedoStepsCount','updateOffsetOnTaskbarEdit','validateManualTasksOnLinking','viewType','weekWorkingTime','width','workUnit','workWeek','zoomingLevels'];
export const outputs: string[] = ['actionBegin','actionComplete','actionFailure','beforeDataBound','beforeExcelExport','beforePdfExport','beforeTooltipRender','cellDeselected','cellDeselecting','cellEdit','cellSave','cellSelected','cellSelecting','collapsed','collapsing','columnDrag','columnDragStart','columnDrop','columnMenuClick','columnMenuOpen','contextMenuClick','contextMenuOpen','created','dataBound','dataSourceChanged','dataStateChange','destroyed','endEdit','excelExportComplete','excelHeaderQueryCellInfo','excelQueryCellInfo','expanded','expanding','headerCellInfo','load','onMouseMove','onTaskbarClick','pdfColumnHeaderQueryCellInfo','pdfExportComplete','pdfQueryCellInfo','pdfQueryTaskbarInfo','pdfQueryTimelineCellInfo','queryCellInfo','queryTaskbarInfo','recordDoubleClick','resizeStart','resizeStop','resizing','rowDataBound','rowDeselected','rowDeselecting','rowDrag','rowDragStart','rowDragStartHelper','rowDrop','rowSelected','rowSelecting','splitterResizeStart','splitterResized','splitterResizing','taskbarEdited','taskbarEditing','toolbarClick','beforeWebMcpToolExecute','dataSourceChange'];
export const twoWays: string[] = ['dataSource'];

/**
 * `ejs-gantt` represents the Angular Gantt Component.
 * ```html
 * <ejs-gantt [dataSource]='data' allowSelection='true' allowSorting='true'></ejs-gantt>
 * ```
 */
@Component({
    selector: 'ejs-gantt',
    inputs: inputs,
    outputs: outputs,
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    queries: {
        childColumns: new ContentChild(ColumnsDirective),
        childAddDialogFields: new ContentChild(AddDialogFieldsDirective),
        childEditDialogFields: new ContentChild(EditDialogFieldsDirective),
        childDayWorkingTime: new ContentChild(DayWorkingTimeCollectionDirective),
        childWeekWorkingTime: new ContentChild(WeekWorkingTimesDirective),
        childHolidays: new ContentChild(HolidaysDirective),
        childEventMarkers: new ContentChild(EventMarkersDirective),
        parentTaskbarTemplate: new ContentChild('parentTaskbarTemplate'),
        toolbarTemplate: new ContentChild('toolbarTemplate'),
        timelineTemplate: new ContentChild('timelineTemplate'),
        milestoneTemplate: new ContentChild('milestoneTemplate'),
        baselineTemplate: new ContentChild('baselineTemplate'),
        taskbarTemplate: new ContentChild('taskbarTemplate'),
        editTemplate: new ContentChild('editTemplate'),
        labelSettings_rightLabel: new ContentChild('labelSettingsRightLabel'),
        labelSettings_leftLabel: new ContentChild('labelSettingsLeftLabel'),
        labelSettings_taskLabel: new ContentChild('labelSettingsTaskLabel'),
        tooltipSettings_taskbar: new ContentChild('tooltipSettingsTaskbar'),
        tooltipSettings_baseline: new ContentChild('tooltipSettingsBaseline'),
        tooltipSettings_connectorLine: new ContentChild('tooltipSettingsConnectorLine'),
        tooltipSettings_editing: new ContentChild('tooltipSettingsEditing'),
        tooltipSettings_timeline: new ContentChild('tooltipSettingsTimeline'),
        filter_itemTemplate: new ContentChild('filterItemTemplate'),
        filterTemplate: new ContentChild('filterTemplate'),
        emptyRecordTemplate: new ContentChild('emptyRecordTemplate')
    }
})
@ComponentMixins([ComponentBase])
export class GanttComponent extends Gantt implements IComponentBase {
    public declare context : any;
    public declare tagObjects: any;
	declare actionBegin: any;
	declare actionComplete: any;
	declare actionFailure: any;
	declare beforeDataBound: any;
	declare beforeExcelExport: any;
	declare beforePdfExport: any;
	declare beforeTooltipRender: any;
	declare cellDeselected: any;
	declare cellDeselecting: any;
	declare cellEdit: any;
	declare cellSave: any;
	declare cellSelected: any;
	declare cellSelecting: any;
	declare collapsed: any;
	declare collapsing: any;
	declare columnDrag: any;
	declare columnDragStart: any;
	declare columnDrop: any;
	declare columnMenuClick: any;
	declare columnMenuOpen: any;
	declare contextMenuClick: any;
	declare contextMenuOpen: any;
	declare created: any;
	declare dataBound: any;
	declare dataSourceChanged: any;
	declare dataStateChange: any;
	declare destroyed: any;
	declare endEdit: any;
	declare excelExportComplete: any;
	declare excelHeaderQueryCellInfo: any;
	declare excelQueryCellInfo: any;
	declare expanded: any;
	declare expanding: any;
	declare headerCellInfo: any;
	declare load: any;
	declare onMouseMove: any;
	declare onTaskbarClick: any;
	declare pdfColumnHeaderQueryCellInfo: any;
	declare pdfExportComplete: any;
	declare pdfQueryCellInfo: any;
	declare pdfQueryTaskbarInfo: any;
	declare pdfQueryTimelineCellInfo: any;
	declare queryCellInfo: any;
	declare queryTaskbarInfo: any;
	declare recordDoubleClick: any;
	declare resizeStart: any;
	declare resizeStop: any;
	declare resizing: any;
	declare rowDataBound: any;
	declare rowDeselected: any;
	declare rowDeselecting: any;
	declare rowDrag: any;
	declare rowDragStart: any;
	declare rowDragStartHelper: any;
	declare rowDrop: any;
	declare rowSelected: any;
	declare rowSelecting: any;
	declare splitterResizeStart: any;
	declare splitterResized: any;
	declare splitterResizing: any;
	declare taskbarEdited: any;
	declare taskbarEditing: any;
	declare toolbarClick: any;
	declare beforeWebMcpToolExecute: any;
	public declare dataSourceChange: any;
    public declare childColumns: QueryList<ColumnsDirective>;
    public declare childAddDialogFields: QueryList<AddDialogFieldsDirective>;
    public declare childEditDialogFields: QueryList<EditDialogFieldsDirective>;
    public declare childDayWorkingTime: QueryList<DayWorkingTimeCollectionDirective>;
    public declare childWeekWorkingTime: QueryList<WeekWorkingTimesDirective>;
    public declare childHolidays: QueryList<HolidaysDirective>;
    public declare childEventMarkers: QueryList<EventMarkersDirective>;
    public tags: string[] = ['columns', 'addDialogFields', 'editDialogFields', 'dayWorkingTime', 'weekWorkingTime', 'holidays', 'eventMarkers'];

    constructor(private ngEle: ElementRef, private srenderer: Renderer2, private viewContainerRef:ViewContainerRef, private injector: Injector) {
        super();
        this.element = this.ngEle.nativeElement;
        this.injectedModules = this.injectedModules || [];
        try {
                let mod = this.injector.get('GanttFilter');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('GanttSelection');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('GanttSort');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('GanttReorder');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('GanttResize');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('GanttEdit');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('GanttDayMarkers');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('GanttToolbar');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('GanttContextMenu');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('GanttExcelExport');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('GanttRowDD');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('GanttColumnMenu');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('GanttPdfExport');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('GanttVirtualScroll');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('GanttCriticalPath');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('GanttUndoRedo');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('GanttFreeze');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }

        this.registerEvents(outputs);
        this.addTwoWay.call(this, twoWays);
        setValue('currentInstance', this, this.viewContainerRef);
        this.context  = new ComponentBase();
    }

    public ngOnInit() {
        this.context.ngOnInit(this);
    }

    public ngAfterViewInit(): void {
        this.context.ngAfterViewInit(this);
    }

    public ngOnDestroy(): void {
        this.context.ngOnDestroy(this);
    }

    public ngAfterContentChecked(): void {
        this.tagObjects[0].instance = this.childColumns;
        
	    if (this.childAddDialogFields) {
            this.tagObjects[1].instance = this.childAddDialogFields;
        }
        
	    if (this.childEditDialogFields) {
            this.tagObjects[2].instance = this.childEditDialogFields;
        }
        
	    if (this.childDayWorkingTime) {
            this.tagObjects[3].instance = this.childDayWorkingTime;
        }
        
	    if (this.childWeekWorkingTime) {
            this.tagObjects[4].instance = this.childWeekWorkingTime;
        }
        
	    if (this.childHolidays) {
            this.tagObjects[5].instance = this.childHolidays;
        }
        
	    if (this.childEventMarkers) {
            this.tagObjects[6].instance = this.childEventMarkers;
        }
        this.context.ngAfterContentChecked(this);
    }

    public declare registerEvents: (eventList: string[]) => void;
    public declare addTwoWay: (propList: string[]) => void;
}
Template()(GanttComponent.prototype, 'parentTaskbarTemplate');
Template()(GanttComponent.prototype, 'toolbarTemplate');
Template()(GanttComponent.prototype, 'timelineTemplate');
Template()(GanttComponent.prototype, 'milestoneTemplate');
Template()(GanttComponent.prototype, 'baselineTemplate');
Template()(GanttComponent.prototype, 'taskbarTemplate');
Template()(GanttComponent.prototype, 'editTemplate');
Template()(GanttComponent.prototype, 'labelSettings_rightLabel');
Template()(GanttComponent.prototype, 'labelSettings_leftLabel');
Template()(GanttComponent.prototype, 'labelSettings_taskLabel');
Template()(GanttComponent.prototype, 'tooltipSettings_taskbar');
Template()(GanttComponent.prototype, 'tooltipSettings_baseline');
Template()(GanttComponent.prototype, 'tooltipSettings_connectorLine');
Template()(GanttComponent.prototype, 'tooltipSettings_editing');
Template()(GanttComponent.prototype, 'tooltipSettings_timeline');
Template()(GanttComponent.prototype, 'filter_itemTemplate');
Template()(GanttComponent.prototype, 'filterTemplate');
Template()(GanttComponent.prototype, 'emptyRecordTemplate');


