import { Schedule } from '../base/schedule';
import { VerticalView } from './vertical-view';

/**
 * week view
 */
export class Week extends VerticalView {
    public viewClass: string = 'e-week-view';
    /**
     * Constructor for week view
     */
    constructor(parent: Schedule) {
        super(parent);
    }
    /**
     * Get module name.
     */
    protected getModuleName(): string {
        return 'week';
    }
}