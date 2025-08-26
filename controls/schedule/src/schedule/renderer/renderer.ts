import { isNullOrUndefined, addClass, removeClass } from '@syncfusion/ej2-base';
import { Schedule } from '../base/schedule';
import { View } from '../base/type';
import { VirtualScroll } from '../actions/virtual-scroll';
import { EventTooltip } from '../popups/event-tooltip';
import * as cls from '../base/css-constant';

/**
 * Schedule DOM rendering
 */
export class Render {
    public parent: Schedule;

    constructor(parent: Schedule) {
        this.parent = parent;
    }

    public render(viewName: View, isDataRefresh: boolean = true): void {
        this.initializeLayout(viewName);
        if (this.parent.activeView && isDataRefresh) {
            this.parent.crudModule.refreshDataManager();
        }
    }

    private initializeLayout(viewName: View): void {
        if (this.parent.activeView) {
            let templates: string[] = [
                'cellTemplate', 'tooltipTemplate', 'majorSlotTemplate', 'minorSlotTemplate',
                'headerTooltipTemplate', 'dateHeaderTemplate', 'dayHeaderTemplate', 'monthHeaderTemplate',
                'headerIndentTemplate', 'resourceHeaderTemplate', 'cellHeaderTemplate', 'dateRangeTemplate'
            ];
            if (this.parent.activeEventTemplates.length > 0) {
                templates = templates.concat(this.parent.activeEventTemplates);
                this.parent.activeEventTemplates = [];
            } else {
                templates.push('eventTemplate');
            }
            this.parent.resetTemplates(templates);
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
        case 'Year':
            this.parent.activeView = this.parent.yearModule;
            break;
        case 'Agenda':
            this.parent.activeView = this.parent.agendaModule;
            break;
        case 'MonthAgenda':
            this.parent.activeView = this.parent.monthAgendaModule;
            break;
        case 'TimelineDay':
            this.parent.activeView = this.parent.timelineViewsModule;
            if (!isNullOrUndefined(this.parent.activeView)) {
                this.parent.activeView.viewClass = 'e-timeline-day-view';
            }
            break;
        case 'TimelineWorkWeek':
            this.parent.activeView = this.parent.timelineViewsModule;
            if (!isNullOrUndefined(this.parent.activeView)) {
                this.parent.activeView.viewClass = 'e-timeline-work-week-view';
            }
            break;
        case 'TimelineWeek':
            this.parent.activeView = this.parent.timelineViewsModule;
            if (!isNullOrUndefined(this.parent.activeView)) {
                this.parent.activeView.viewClass = 'e-timeline-week-view';
            }
            break;
        case 'TimelineMonth':
            this.parent.activeView = this.parent.timelineMonthModule;
            break;
        case 'TimelineYear':
            this.parent.activeView = this.parent.timelineYearModule;
            break;
        }
        if (isNullOrUndefined(this.parent.activeView)) {
            const firstView: View = this.parent.viewCollections[0].option;
            if (firstView) {
                this.parent.setProperties({ currentView: firstView }, true);
                if (this.parent.headerModule) {
                    this.parent.headerModule.updateActiveView();
                    this.parent.headerModule.setCalendarView();
                }
                console.warn('[WARNING] :: Module "' + viewName + '" is not available in Schedule component!' +
                    ' You either misspelled the module name or forgot to load it.');
                return this.initializeLayout(firstView);
            }
            throw Error('Inject required modules');
        }
        this.parent.uiStateValues.scheduleHeight = this.parent.element.offsetHeight;
        this.parent.activeView.viewIndex = this.parent.viewIndex;
        this.updateLabelText(viewName);
        this.parent.activeView.addEventListener();
        this.parent.activeView.getRenderDates();
        this.parent.uiStateValues.isGroupAdaptive = this.parent.activeViewOptions.group.resources.length > 0 &&
            (this.parent.enableAdaptiveUI && !this.parent.isAdaptive ||
                this.parent.isAdaptive && this.parent.activeViewOptions.group.enableCompactView);
        if (this.parent.virtualScrollModule) {
            this.parent.virtualScrollModule.destroy();
            this.parent.virtualScrollModule = null;
        }
        if ((['Agenda', 'MonthAgenda', 'Year', 'TimelineYear'].indexOf(this.parent.currentView) === -1 ||
            (this.parent.currentView === 'TimelineYear' && this.parent.activeViewOptions.orientation === 'Vertical'))
            && this.parent.activeViewOptions.allowVirtualScrolling
            && this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            this.parent.virtualScrollModule = new VirtualScroll(this.parent);
            if (this.parent.activeView.isTimelineView()) {
                this.parent.uiStateValues.top = 0;
            } else {
                this.parent.virtualScrollModule.isHorizontalScroll = true;
                this.parent.uiStateValues.left = 0;
            }
        }
        this.updateHeader();
        this.parent.currentTimezoneDate = this.parent.getCurrentTime();
        this.parent.activeView.renderLayout(cls.CURRENT_PANEL_CLASS);
        this.parent.renderTemplates();
        if (this.parent.eventTooltip) {
            this.parent.eventTooltip.destroy();
            this.parent.eventTooltip = null;
        }
        if (this.parent.eventSettings.enableTooltip || (this.parent.activeViewOptions.group.resources.length > 0
            && this.parent.activeViewOptions.group.headerTooltipTemplate)) {
            this.parent.eventTooltip = new EventTooltip(this.parent);
        }
    }

    public updateHeader(): void {
        if (this.parent.headerModule) {
            this.parent.headerModule.setDayOfWeek(this.parent.activeViewOptions.firstDayOfWeek);
            if (this.parent.activeViewOptions.readonly) {
                addClass([this.parent.element], cls.READ_ONLY);
            } else if (this.parent.element.classList.contains(cls.READ_ONLY)) {
                removeClass([this.parent.element], cls.READ_ONLY);
            }
            this.parent.headerModule.updateDateRange();
            this.parent.headerModule.updateHeaderItems('remove');
        }
    }

    public updateLabelText(view: string): void {
        this.parent.element.setAttribute('role', 'application');
        this.parent.element.removeAttribute('aria-labelledby');
        this.parent.element.removeAttribute('aria-label');
        if (view === 'Year') {
            this.parent.element.setAttribute('aria-label', this.parent.activeView.getLabelText(view));
        } else {
            this.parent.element.setAttribute('aria-labelledby', this.parent.element.id + '_table' );
        }
    }

}
