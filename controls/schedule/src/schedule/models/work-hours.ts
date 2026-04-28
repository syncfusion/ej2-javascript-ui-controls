import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * A class that represents the configuration of working hours related options of scheduler.
 */
export class WorkHours extends ChildProperty<WorkHours> {
    /**
     * When set to `true`, highlights the cells of working hour range with an active color.
     *
     * @default true
     */
    @Property(true)
    public highlight: boolean;

    /**
     * It accepts the time string in short skeleton format `Hm` and usually denotes the start of the working hour range.
     *
     * @default '09:00'
     */
    @Property('09:00')
    public start: string;

    /**
     * It accepts the time string in short skeleton format `Hm` and usually denotes the end of the working hour range.
     *
     * @default '18:00'
     */
    @Property('18:00')
    public end: string;

}
