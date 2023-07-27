import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * A class that represents the configuration of options related to timescale on scheduler.
 */
export class TimeScale extends ChildProperty<TimeScale> {
    /**
     * When set to `true`, allows the schedule to display the appointments accurately against the exact time duration.
     *  If set to `false`, all the appointments of a day will be displayed one below the other.
     *
     * @default true
     */
    @Property(true)
    public enable: boolean;

    /**
     * Defines the time duration on which the time axis to be displayed either in 1 hour or 30 minutes interval and so on.
     *  It accepts the values in minutes.
     *
     * @default 60
     */
    @Property(60)
    public interval: number;

    /**
     * Decides the number of slot count to be split for the specified time interval duration.
     *
     * @default 2
     */
    @Property(2)
    public slotCount: number;

    /**
     * The template option to be applied for minor time slot. Here, the
     *  template accepts either the string or HTMLElement as template design and then the parsed design is displayed
     *  onto the time cells. The time details can be accessed within this template.
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property()
    public minorSlotTemplate: string | Function;

    /**
     * The template option to be applied for major time slot. Here, the
     *  template accepts either the string or HTMLElement as template design and then the parsed design is displayed
     *  onto the time cells. The time details can be accessed within this template.
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property()
    public majorSlotTemplate: string | Function;

}
