import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Interface for a class Holiday
 */
export interface HolidayModel {

    /**
     * Defines start date of holiday.
     * @default null
     * @blazorType Date
     */
    from?: Date | string;

    /**
     * Defines end date of holiday.
     * @default null
     * @blazorType Date
     */
    to?: Date | string;

    /**
     * Defines label of holiday.
     * @default null
     */
    label?: string;

    /**
     * Defines custom css class of holiday to customize background and label.
     * @default null
     */
    cssClass?: string;

}