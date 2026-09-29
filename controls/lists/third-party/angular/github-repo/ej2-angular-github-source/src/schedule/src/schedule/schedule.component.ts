import { Component, ElementRef, ViewContainerRef, ChangeDetectionStrategy, QueryList, Renderer2, Injector, ValueProvider, ContentChild } from '@angular/core';
import { ComponentBase, IComponentBase, applyMixins, ComponentMixins, PropertyCollectionInfo, setValue } from '@syncfusion/ej2-angular-base';
import { Schedule } from '@syncfusion/ej2-schedule';
import { Template } from '@syncfusion/ej2-angular-base';
import { ViewsDirective } from './views.directive';
import { ResourcesDirective } from './resources.directive';
import { HeaderRowsDirective } from './headerrows.directive';
import { ToolbarItemsDirective } from './toolbaritems.directive';

export const inputs: string[] = ['agendaDaysCount','allowClipboard','allowDragAndDrop','allowInline','allowKeyboardInteraction','allowMultiCellSelection','allowMultiDrag','allowMultiRowSelection','allowOverlap','allowResizing','allowSwiping','calendarMode','cellHeaderTemplate','cellTemplate','cssClass','currentTimeIndicatorSettings','currentView','dateFormat','dateHeaderTemplate','dateRangeTemplate','dayHeaderTemplate','editorFooterTemplate','editorHeaderTemplate','editorTemplate','enableAdaptiveUI','enableAllDayScroll','enableHtmlSanitizer','enablePersistence','enableRecurrenceValidation','enableRtl','enableWebMcp','endHour','eventDragArea','eventSettings','firstDayOfWeek','firstMonthOfYear','group','headerIndentTemplate','headerRows','height','hideEmptyAgendaDays','locale','maxDate','minDate','monthHeaderTemplate','monthsCount','overscanCount','prerenderDialogs','quickInfoOnSelectionEnd','quickInfoTemplates','readonly','resourceHeaderTemplate','resources','rowAutoHeight','selectedDate','selectedResource','showHeaderBar','showQuickInfo','showTimeIndicator','showWeekNumber','showWeekend','startHour','timeFormat','timeScale','timezone','timezoneDataSource','toolbarItems','views','weekRule','width','workDays','workHours'];
export const outputs: string[] = ['actionBegin','actionComplete','actionFailure','beforePaste','beforePrint','beforeWebMcpToolExecute','cellClick','cellDoubleClick','created','dataBinding','dataBound','destroyed','drag','dragStart','dragStop','eventClick','eventDoubleClick','eventRendered','excelExport','hover','moreEventsClick','navigating','popupClose','popupOpen','renderCell','resizeStart','resizeStop','resizing','select','tooltipOpen','virtualScrollStart','virtualScrollStop','currentViewChange','selectedDateChange'];
export const twoWays: string[] = ['currentView', 'selectedDate'];

/**
 * `ej-schedule` represents the Angular Schedule Component.
 * ```html
 * <ejs-schedule></ejs-schedule>
 * ```
 */
@Component({
    selector: 'ejs-schedule',
    inputs: inputs,
    outputs: outputs,
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    queries: {
        childViews: new ContentChild(ViewsDirective),
        childResources: new ContentChild(ResourcesDirective),
        childHeaderRows: new ContentChild(HeaderRowsDirective),
        childToolbarItems: new ContentChild(ToolbarItemsDirective),
        dateHeaderTemplate: new ContentChild('dateHeaderTemplate'),
        dateRangeTemplate: new ContentChild('dateRangeTemplate'),
        dayHeaderTemplate: new ContentChild('dayHeaderTemplate'),
        cellTemplate: new ContentChild('cellTemplate'),
        cellHeaderTemplate: new ContentChild('cellHeaderTemplate'),
        eventSettings_tooltipTemplate: new ContentChild('eventSettingsTooltipTemplate'),
        eventSettings_template: new ContentChild('eventSettingsTemplate'),
        editorTemplate: new ContentChild('editorTemplate'),
        editorHeaderTemplate: new ContentChild('editorHeaderTemplate'),
        editorFooterTemplate: new ContentChild('editorFooterTemplate'),
        monthHeaderTemplate: new ContentChild('monthHeaderTemplate'),
        timeScale_minorSlotTemplate: new ContentChild('timeScaleMinorSlotTemplate'),
        timeScale_majorSlotTemplate: new ContentChild('timeScaleMajorSlotTemplate'),
        resourceHeaderTemplate: new ContentChild('resourceHeaderTemplate'),
        headerIndentTemplate: new ContentChild('headerIndentTemplate'),
        quickInfoTemplates_header: new ContentChild('quickInfoTemplatesHeader'),
        quickInfoTemplates_content: new ContentChild('quickInfoTemplatesContent'),
        quickInfoTemplates_footer: new ContentChild('quickInfoTemplatesFooter'),
        group_headerTooltipTemplate: new ContentChild('groupHeaderTooltipTemplate')
    }
})
@ComponentMixins([ComponentBase])
export class ScheduleComponent extends Schedule implements IComponentBase {
    public declare context : any;
    public declare tagObjects: any;
	declare actionBegin: any;
	declare actionComplete: any;
	declare actionFailure: any;
	declare beforePaste: any;
	declare beforePrint: any;
	declare beforeWebMcpToolExecute: any;
	declare cellClick: any;
	declare cellDoubleClick: any;
	declare created: any;
	declare dataBinding: any;
	declare dataBound: any;
	declare destroyed: any;
	declare drag: any;
	declare dragStart: any;
	declare dragStop: any;
	declare eventClick: any;
	declare eventDoubleClick: any;
	declare eventRendered: any;
	declare excelExport: any;
	declare hover: any;
	declare moreEventsClick: any;
	declare navigating: any;
	declare popupClose: any;
	declare popupOpen: any;
	declare renderCell: any;
	declare resizeStart: any;
	declare resizeStop: any;
	declare resizing: any;
	declare select: any;
	declare tooltipOpen: any;
	declare virtualScrollStart: any;
	declare virtualScrollStop: any;
	declare currentViewChange: any;
	public declare selectedDateChange: any;
    public declare childViews: QueryList<ViewsDirective>;
    public declare childResources: QueryList<ResourcesDirective>;
    public declare childHeaderRows: QueryList<HeaderRowsDirective>;
    public declare childToolbarItems: QueryList<ToolbarItemsDirective>;
    public tags: string[] = ['views', 'resources', 'headerRows', 'toolbarItems'];

    constructor(private ngEle: ElementRef, private srenderer: Renderer2, private viewContainerRef:ViewContainerRef, private injector: Injector) {
        super();
        this.element = this.ngEle.nativeElement;
        this.injectedModules = this.injectedModules || [];
        try {
                let mod = this.injector.get('ScheduleDay');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ScheduleWeek');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ScheduleWorkWeek');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ScheduleMonth');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ScheduleYear');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ScheduleAgenda');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ScheduleMonthAgenda');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ScheduleTimelineViews');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ScheduleTimelineMonth');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ScheduleTimelineYear');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ScheduleResize');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ScheduleDragAndDrop');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ScheduleExcelExport');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ScheduleICalendarExport');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('ScheduleICalendarImport');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('SchedulePrint');
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
        this.tagObjects[0].instance = this.childViews;
        
	    if (this.childResources) {
            this.tagObjects[1].instance = this.childResources;
        }
        
	    if (this.childHeaderRows) {
            this.tagObjects[2].instance = this.childHeaderRows;
        }
        
	    if (this.childToolbarItems) {
            this.tagObjects[3].instance = this.childToolbarItems;
        }
        this.context.ngAfterContentChecked(this);
    }

    public declare registerEvents: (eventList: string[]) => void;
    public declare addTwoWay: (propList: string[]) => void;
}
Template()(ScheduleComponent.prototype, 'dateHeaderTemplate');
Template()(ScheduleComponent.prototype, 'dateRangeTemplate');
Template()(ScheduleComponent.prototype, 'dayHeaderTemplate');
Template()(ScheduleComponent.prototype, 'cellTemplate');
Template()(ScheduleComponent.prototype, 'cellHeaderTemplate');
Template()(ScheduleComponent.prototype, 'eventSettings_tooltipTemplate');
Template()(ScheduleComponent.prototype, 'eventSettings_template');
Template()(ScheduleComponent.prototype, 'editorTemplate');
Template()(ScheduleComponent.prototype, 'editorHeaderTemplate');
Template()(ScheduleComponent.prototype, 'editorFooterTemplate');
Template()(ScheduleComponent.prototype, 'monthHeaderTemplate');
Template()(ScheduleComponent.prototype, 'timeScale_minorSlotTemplate');
Template()(ScheduleComponent.prototype, 'timeScale_majorSlotTemplate');
Template()(ScheduleComponent.prototype, 'resourceHeaderTemplate');
Template()(ScheduleComponent.prototype, 'headerIndentTemplate');
Template()(ScheduleComponent.prototype, 'quickInfoTemplates_header');
Template()(ScheduleComponent.prototype, 'quickInfoTemplates_content');
Template()(ScheduleComponent.prototype, 'quickInfoTemplates_footer');
Template()(ScheduleComponent.prototype, 'group_headerTooltipTemplate');


