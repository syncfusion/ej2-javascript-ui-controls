import { formatUnit } from '@syncfusion/ej2-base';
import { NotifyEventArgs } from '../base/interface';
import { SfSchedule } from '../../schedule';
import { Month } from './month';
import * as util from '../base/util';
import * as cls from '../base/css-constant';
import {TimelineEvent} from '../event-renderer/timeline-view';

/**
 * timeline month view
 */
export class TimelineMonth extends Month {
    public isInverseTableSelect: boolean = true;

    constructor(parent: SfSchedule) {
        super(parent);
    }

    public onDataReady(args: NotifyEventArgs): void {
        let appointment: TimelineEvent = new TimelineEvent(this.parent, 'day');
        appointment.renderAppointments();
    }

    public getLeftPanelElement(): HTMLElement {
        return this.element.querySelector('.' + cls.RESOURCE_COLUMN_WRAP_CLASS) as HTMLElement;
    }

    public scrollTopPanel(target: HTMLElement): void {
        super.scrollTopPanel(target);
        this.scrollHeaderLabels(target);
    }

    public setContentHeight(content: HTMLElement, leftPanelElement: HTMLElement, height: number): void {
        if (leftPanelElement) {
            leftPanelElement.style.height = formatUnit(height - this.getScrollXIndent(content));
        }
        content.style.height = formatUnit(height);
    }

    public getMonthStart(currentDate: Date): Date {
        let monthStart: Date = util.firstDateOfMonth(util.resetTime(currentDate));
        return new Date(monthStart.getFullYear(), monthStart.getMonth(), monthStart.getDate());
    }

    public getMonthEnd(currentDate: Date): Date {
        let monthStart: Date = util.firstDateOfMonth(util.resetTime(currentDate));
        return util.lastDateOfMonth(util.addMonths(new Date(+monthStart), this.parent.activeViewOptions.interval - 1));
    }
}