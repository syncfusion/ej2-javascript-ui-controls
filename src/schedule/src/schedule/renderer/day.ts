import { Schedule } from '../base/schedule';
import { VerticalView } from './vertical-view';

/**
 * day view
 */
export class Day extends VerticalView {
    public viewClass: string = 'e-day-view';
    /**
     * Constructor for day view
     */
    constructor(parent: Schedule) {
        super(parent);
    }
    /**
     * Get module name.
     */
    protected getModuleName(): string {
        return 'day';
    }
}