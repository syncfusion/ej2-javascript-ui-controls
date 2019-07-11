import { isNullOrUndefined, extend, addClass, removeClass, updateBlazorTemplate, resetBlazorTemplate } from '@syncfusion/ej2-base';
import { Schedule } from '../base/schedule';
import { View, ReturnType } from '../base/type';
import { EventTooltip } from '../popups/event-tooltip';
import * as events from '../base/constant';
import * as cls from '../base/css-constant';
import { VirtualScroll } from '../actions/virtual-scroll';

/**
 * Schedule DOM rendering
 */
export class Render {
    public parent: Schedule;
    /**
     * Constructor for render
     */
    constructor(parent: Schedule) {
        this.parent = parent;
    }

    public render(viewName: View, isDataRefresh: boolean = true): void {
        this.initializeLayout(viewName);
        if (isDataRefresh) {
            this.refreshDataManager();
        }
    }

    private initializeLayout(viewName: View): void {
        this.resetTemplates();
        if (this.parent.activeView) {
            this.parent.activeView.removeEventListener();
            this.parent.activeView.destroy();
        }
        switch (viewName) {
            case 'Day':
                this.parent.activeView = this.parent.dayModule;
                break;
            case 'Week':
                this.parent.activeView = this.parent.weekModule;
                break;
            case 'WorkWeek':
                this.parent.activeView = this.parent.workWeekModule;
                break;
            case 'Month':
                this.parent.activeView = this.parent.monthModule;
                break;
            case 'Agenda':
                this.parent.activeView = this.parent.agendaModule;
                break;
            case 'MonthAgenda':
                this.parent.activeView = this.parent.monthAgendaModule;
                break;
            case 'TimelineDay':
                this.parent.activeView = this.parent.timelineViewsModule;
                this.parent.activeView.viewClass = 'e-timeline-day-view';
                break;
            case 'TimelineWorkWeek':
                this.parent.activeView = this.parent.timelineViewsModule;
                this.parent.activeView.viewClass = 'e-timeline-work-week-view';
                break;
            case 'TimelineWeek':
                this.parent.activeView = this.parent.timelineViewsModule;
                this.parent.activeView.viewClass = 'e-timeline-week-view';
                break;
            case 'TimelineMonth':
                this.parent.activeView = this.parent.timelineMonthModule;
                break;
        }
        if (isNullOrUndefined(this.parent.activeView)) {
            let firstView: View = this.parent.viewCollections[0].option;
            if (firstView) {
                this.parent.setProperties({ currentView: firstView }, true);
                if (this.parent.headerModule) {
                    this.parent.headerModule.updateActiveView();
                    this.parent.headerModule.setCalendarView();
                }
                return this.initializeLayout(firstView);
            }
            throw Error('Inject required modules');
        }
        this.updateLabelText(viewName);
        this.parent.activeView.addEventListener();
        this.parent.activeView.getRenderDates();
        this.parent.uiStateValues.isGroupAdaptive = this.parent.isAdaptive && this.parent.activeViewOptions.group.resources.length > 0 &&
            this.parent.activeViewOptions.group.enableCompactView;
        if (this.parent.virtualScrollModule) {
            this.parent.virtualScrollModule.destroy();
            this.parent.virtualScrollModule = null;
        }
        if (this.parent.currentView.indexOf('Timeline') !== -1 && this.parent.activeViewOptions.allowVirtualScrolling
            && this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            this.parent.virtualScrollModule = new VirtualScroll(this.parent);
            this.parent.uiStateValues.top = 0;
        }
        if (this.parent.headerModule) {
            if (this.parent.activeViewOptions.readonly) {
                addClass([this.parent.element], cls.READ_ONLY);
            } else if (this.parent.element.classList.contains(cls.READ_ONLY)) {
                removeClass([this.parent.element], cls.READ_ONLY);
            }
            this.parent.headerModule.updateDateRange(this.parent.activeView.getDateRangeText());
            this.parent.headerModule.updateHeaderItems('remove');
        }
        this.parent.activeView.renderLayout(cls.CURRENT_PANEL_CLASS);
        if (this.parent.eventTooltip) {
            this.parent.eventTooltip.destroy();
            this.parent.eventTooltip = null;
        }
        if (this.parent.eventSettings.enableTooltip || (this.parent.activeViewOptions.group.resources.length > 0
            && this.parent.activeViewOptions.group.headerTooltipTemplate)) {
            this.parent.eventTooltip = new EventTooltip(this.parent);
        }
    }

    public updateLabelText(view: string): void {
        let content: string = this.parent.activeView.getLabelText(view);
        this.parent.element.setAttribute('role', 'main');
        this.parent.element.setAttribute('aria-label', content);
    }

    private refreshTemplates(): void {
        if (this.parent.dateHeaderTemplate) {
            updateBlazorTemplate(this.parent.currentView + '_dateHeaderTemplate', 'DateHeaderTemplate', this.parent);
        }
        if (this.parent.activeViewOptions.timeScale.majorSlotTemplate) {
            updateBlazorTemplate(this.parent.currentView + '_majorSlotTemplate', 'MajorSlotTemplate', this.parent);
        }
        if (this.parent.activeViewOptions.timeScale.minorSlotTemplate) {
            updateBlazorTemplate(this.parent.currentView + '_minorSlotTemplate', 'MinorSlotTemplate', this.parent);
        }
        if (this.parent.cellTemplate) {
            updateBlazorTemplate(this.parent.currentView + '_cellTemplate', 'CellTemplate', this.parent);
        }
        if (this.parent.activeViewOptions.eventTemplate) {
            updateBlazorTemplate(this.parent.currentView + '_eventTemplate', 'EventTemplate', this.parent);
        }
        if (this.parent.activeViewOptions.group.headerTooltipTemplate) {
            updateBlazorTemplate(this.parent.currentView + '_headerTooltipTemplate', 'HeaderTooltipTemplate', this.parent);
        }
        if (this.parent.eventSettings.tooltipTemplate) {
            updateBlazorTemplate(this.parent.currentView + '_tooltipTemplate', 'TooltipTemplate', this.parent);
        }
        if (this.parent.quickInfoTemplates.header) {
            updateBlazorTemplate(this.parent.currentView + '_header', 'Header', this.parent);
        }
        if (this.parent.quickInfoTemplates.content) {
            updateBlazorTemplate(this.parent.currentView + '_content', 'Content', this.parent);
        }
        if (this.parent.quickInfoTemplates.footer) {
            updateBlazorTemplate(this.parent.currentView + '_footer', 'Footer', this.parent);
        }
        if (this.parent.activeViewOptions.resourceHeaderTemplate) {
            updateBlazorTemplate(this.parent.currentView + '_resourceHeaderTemplate', 'ResourceHeaderTemplate', this.parent);
        }
    }

    private resetTemplates(): void {
        let viewName: string = this.parent.viewCollections[this.parent.uiStateValues.viewIndex].option;
        if (this.parent.dateHeaderTemplate) {
            resetBlazorTemplate(viewName + '_dateHeaderTemplate', 'DateHeaderTemplate');
        }
        if (this.parent.activeViewOptions.timeScale.majorSlotTemplate) {
            resetBlazorTemplate(viewName + '_majorSlotTemplate', 'MajorSlotTemplate');
        }
        if (this.parent.activeViewOptions.timeScale.minorSlotTemplate) {
            resetBlazorTemplate(viewName + '_minorSlotTemplate', 'MinorSlotTemplate');
        }
        if (this.parent.cellTemplate) {
            resetBlazorTemplate(viewName + '_cellTemplate', 'CellTemplate');
        }
        if (this.parent.activeViewOptions.eventTemplate) {
            resetBlazorTemplate(viewName + '_eventTemplate', 'EventTemplate');
        }
        if (this.parent.activeViewOptions.group.headerTooltipTemplate) {
            resetBlazorTemplate(viewName + '_headerTooltipTemplate', 'HeaderTooltipTemplate');
        }
        if (this.parent.eventSettings.tooltipTemplate) {
            resetBlazorTemplate(viewName + '_tooltipTemplate', 'TooltipTemplate');
        }
        if (this.parent.quickInfoTemplates.header) {
            resetBlazorTemplate(viewName + '_header', 'Header');
        }
        if (this.parent.quickInfoTemplates.content) {
            resetBlazorTemplate(viewName + '_content', 'Content');
        }
        if (this.parent.quickInfoTemplates.footer) {
            resetBlazorTemplate(viewName + '_footer', 'Footer');
        }
        if (this.parent.activeViewOptions.resourceHeaderTemplate) {
            resetBlazorTemplate(viewName + '_resourceHeaderTemplate', 'ResourceHeaderTemplate');
        }
    }

    public refreshDataManager(): void {
        let start: Date = this.parent.activeView.startDate();
        let end: Date = this.parent.activeView.endDate();
        let dataManager: Promise<Object> = this.parent.dataModule.getData(this.parent.dataModule.generateQuery(start, end));
        dataManager.then((e: ReturnType) => this.dataManagerSuccess(e)).catch((e: ReturnType) => this.dataManagerFailure(e));
    }

    private dataManagerSuccess(e: ReturnType): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.trigger(events.dataBinding, e, (args: ReturnType) => {
            let resultData: Object[] = <Object[]>extend([], args.result, null, true);
            this.parent.eventsData = resultData.filter((data: { [key: string]: Object }) => !data[this.parent.eventFields.isBlock]);
            this.parent.blockData = resultData.filter((data: { [key: string]: Object }) => data[this.parent.eventFields.isBlock]);
            let processed: Object[] = this.parent.eventBase.processData(resultData as { [key: string]: Object }[]);
            this.parent.notify(events.dataReady, { processedData: processed });
            if (this.parent.dragAndDropModule && this.parent.dragAndDropModule.actionObj.action === 'drag') {
                this.parent.dragAndDropModule.navigationWrapper();
            }
            this.refreshTemplates();
            this.parent.trigger(events.dataBound, null, () => this.parent.hideSpinner());
        });
    }

    private dataManagerFailure(e: { result: Object[] }): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.trigger(events.actionFailure, { error: e }, () => this.parent.hideSpinner());
    }
}
