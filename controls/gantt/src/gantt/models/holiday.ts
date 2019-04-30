import { Property, ChildProperty } from '@syncfusion/ej2-base';
/**
 * Defines holidays of project
 */
export class Holiday extends ChildProperty<Holiday> {
    /**
     * Defines start date of holiday.
     * @default null
     */
    @Property(null)
    public from: Date | string;
    /**
     * Defines end date of holiday.
     * @default null
     */
    @Property(null)
    public to: Date | string;
    /**
     * Defines label of holiday.
     * @default null
     */
    @Property(null)
    public label: string;
    /**
     * Defines custom css class of holiday to customize background and label.
     * @default null
     */
    @Property(null)
    public cssClass: string;
}