import { isNullOrUndefined, extend } from '@syncfusion/ej2-base';
import { Schedule } from '../base/schedule';
import { View, ReturnType } from '../base/type';
import { EventTooltip } from '../popups/event-tooltip';
import * as events from '../base/constant';
import * as cls from '../base/css-constant';

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
        this.parent.activeView.renderLayout(cls.CURRENT_PANEL_CLASS);
        if (this.parent.eventTooltip) {
            this.parent.eventTooltip.destroy();
            this.parent.eventTooltip = null;
        }
        if (this.parent.eventSettings.enableTooltip || (this.parent.activeViewOptions.group.resources.length > 0
            && this.parent.activeViewOptions.group.headerTooltipTemplate)) {
            this.parent.eventTooltip = new EventTooltip(this.parent);
        }
        if (this.parent.headerModule) {
            this.parent.headerModule.updateDateRange(this.parent.activeView.getDateRangeText());
        }
    }

    public updateLabelText(view: string): void {
        let content: string = this.parent.activeView.getLabelText(view);
        this.parent.element.setAttribute('role', 'main');
        this.parent.element.setAttribute('aria-label', content);
    }

    public refreshDataManager(): void {
        let start: Date = this.parent.activeView.startDate();
        let end: Date = this.parent.activeView.endDate();
        let dataManager: Promise<Object> = this.parent.dataModule.getData(this.parent.dataModule.generateQuery(start, end));
        dataManager.then((e: ReturnType) => this.dataManagerSuccess(e)).catch((e: ReturnType) => this.dataManagerFailure(e));
    }

    private dataManagerSuccess(e: ReturnType): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.trigger(events.dataBinding, e);
        this.parent.eventsData = <Object[]>extend([], e.result, null, true);
        let processed: Object[] = this.parent.eventBase.processData(this.parent.eventsData as { [key: string]: Object }[]);
        this.parent.notify(events.dataReady, { processedData: processed });
        if (this.parent.dragAndDropModule && this.parent.dragAndDropModule.actionObj.action === 'drag') {
            this.parent.dragAndDropModule.navigationWrapper();
        }
        this.parent.trigger(events.dataBound);
        this.parent.hideSpinner();
    }

    private dataManagerFailure(e: { result: Object[] }): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.trigger(events.actionFailure, { error: e });
        this.parent.hideSpinner();
    }
}