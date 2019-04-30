import { Schedule } from '../base/schedule';
import { VerticalView } from './vertical-view';

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
    /**
     * Get module name.
     */
    protected getModuleName(): string {
        return 'workWeek';
    }
}