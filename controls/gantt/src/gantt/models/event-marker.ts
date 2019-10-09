import { Property, ChildProperty } from '@syncfusion/ej2-base';
/**
 * Defines event marker collection in Gantt.
 */
export class EventMarker extends ChildProperty<EventMarker> {
    /**
     * Defines day of event marker.
     * @default null     
     */
    @Property(null)
    public day: Date | string;
    /**
     * Defines label of event marker.
     * @default null
     */
    @Property(null)
    public label: string;
    /**
     * Define custom css class for event marker to customize line and label.
     * @default null
     */
    @Property(null)
    public cssClass: string;
}