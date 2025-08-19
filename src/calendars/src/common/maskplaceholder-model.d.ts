import {  Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Interface for a class MaskPlaceholder
 */
export interface MaskPlaceholderModel {

    /**
     * Specifies the mask placeholder value for day section.
     *
     * @default 'day'
     */
    day?: string;

    /**
     * Specifies the mask placeholder value for month section.
     *
     * @default 'month'
     */
    month?: string;

    /**
     * Specifies the mask placeholder value for year section.
     *
     * @default 'year'
     */
    year?: string;

    /**
     * Specifies the mask placeholder value for day of the week section.
     *
     * @default 'day of the week'
     */
    dayOfTheWeek?: string;

    /**
     * Specifies the mask placeholder value for hour section.
     *
     * @default 'hour'
     */
    hour?: string;

    /**
     * Specifies the mask placeholder value for minute section.
     *
     * @default 'minute'
     */
    minute?: string;

    /**
     * Specifies the mask placeholder value for second section.
     *
     * @default 'second'
     */
    second?: string;

}