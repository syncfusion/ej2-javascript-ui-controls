import {  Property, ChildProperty } from '@syncfusion/ej2-base';

export class MaskPlaceholder  extends ChildProperty<MaskPlaceholder> {
    /**
     * Specifies the mask placeholder value for day section.
     *
     * @default 'day'
     */
    @Property('day')
    public day: string;
    /**
     * Specifies the mask placeholder value for month section.
     *
     * @default 'month'
     */
    @Property('month')
    public month: string;
    /**
     * Specifies the mask placeholder value for year section.
     *
     * @default 'year'
     */
    @Property('year')
    public year: string;
    /**
     * Specifies the mask placeholder value for day of the week section.
     *
     * @default 'day of the week'
     */
    @Property('day of the week')
    public dayOfTheWeek: string;
    /**
     * Specifies the mask placeholder value for hour section.
     *
     * @default 'hour'
     */
    @Property('hour')
    public hour: string;
    /**
     * Specifies the mask placeholder value for minute section.
     *
     * @default 'minute'
     */
    @Property('minute')
    public minute: string;
    /**
     * Specifies the mask placeholder value for second section.
     *
     * @default 'second'
     */
    @Property('second')
    public second: string;

}
