import { Schedule } from '../base/schedule';
import { VerticalView } from './vertical-view';
import * as util from '../base/util';

/**
 * work week view
 */
export class WorkWeek extends VerticalView {
    public viewClass: string = 'e-work-week-view';
    /**
     * Constructor for work week view
     */
    constructor(par: Schedule) {
        super(par);
    }

    public startDate(): Date {
        let startDate: Date = this.renderDates[0];
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            startDate = this.parent.resourceBase.getResourceRenderDates()[0];
        }
        return startDate;
    }

    public endDate(): Date {
        let endDate: Date = util.addDays(this.renderDates[this.renderDates.length - 1], 1);
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            endDate = util.addDays(this.parent.resourceBase.getResourceRenderDates().slice(-1)[0], 1);
        }
        return endDate;
    }

    /**
     * Get module name.
     */
    protected getModuleName(): string {
        return 'workWeek';
    }
}