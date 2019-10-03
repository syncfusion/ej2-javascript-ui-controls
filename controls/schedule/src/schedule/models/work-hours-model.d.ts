import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Interface for a class WorkHours
 */
export interface WorkHoursModel {

    /**
     * When set to `true`, highlights the cells of working hour range with an active color.

     */
    highlight?: boolean;

    /**
     * It accepts the time string in short skeleton format `Hm` and usually denotes the start of the working hour range.  

     */
    start?: string;

    /**
     * It accepts the time string in short skeleton format `Hm` and usually denotes the end of the working hour range.

     */
    end?: string;

}