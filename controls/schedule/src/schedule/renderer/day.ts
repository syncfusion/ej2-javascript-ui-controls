import { Schedule } from '../base/schedule';
import { VerticalView } from './vertical-view';

/**
 * day view
 */
export class Day extends VerticalView {
    public viewClass: string = 'e-day-view';

    /**
     * Constructor for day view
     *
     * @param {Schedule} parent Accepts the schedule instance
     */
    constructor(parent: Schedule) {
        super(parent);
    }

    /**
     * Get module name.
     *
     * @returns {string} Returns the module name.
     */
    protected getModuleName(): string {
        return 'day';
    }

}
