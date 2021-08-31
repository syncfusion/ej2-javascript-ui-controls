import { Schedule } from '../base/schedule';
import { VerticalView } from './vertical-view';

/**
 * work week view
 */
export class WorkWeek extends VerticalView {
    public viewClass: string = 'e-work-week-view';

    /**
     * Constructor for work week view
     *
     * @param {Schedule} parent Accepts the schedule instance
     */
    constructor(parent: Schedule) {
        super(parent);
    }

    public startDate(): Date {
        return this.getViewStartDate();
    }

    public endDate(): Date {
        return this.getViewEndDate();
    }

    /**
     * Get module name.
     *
     * @returns {string} Returns the module name.
     */
    protected getModuleName(): string {
        return 'workWeek';
    }

}
