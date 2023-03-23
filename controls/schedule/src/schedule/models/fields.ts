import { Property, ChildProperty, Complex } from '@syncfusion/ej2-base';
import { FieldOptionsModel } from './field-options-model';
import { FieldOptions } from './field-options';

/**
 * A class that holds the collection of event fields that requires to be mapped with the dataSource
 * fields along with its available configuration settings. Each field in it accepts both string and object
 *  data type. When each of the field is assigned with simple `string` value, it is assumed that the dataSource field
 *  name is mapped with it. If the `object` type is defined on each fields, then the validation related settings and mapping of
 *  those fields with dataSource can be given altogether within it.
 */
export class Field extends ChildProperty<Field> {
    /**
     * The `id` field needs to be defined as mandatory, when the Schedule is bound to remote data and
     *  it is optional, if the same is bound with JSON data. This field usually assigns ID value to each of the events.
     *
     * @default null
     */
    @Property('Id')
    public id: string;

    /**
     * The `isBlock` field allows you to block certain time interval on the Scheduler.
     * It is a boolean type property accepting either true or false values.
     * When set to true, creates a block range for the specified time interval and disables the event scheduling actions on that time range.
     *
     * @default null
     */
    @Property('IsBlock')
    public isBlock: string;

    /**
     * The `subject` field is optional, and usually assigns the subject text to each of the events.
     *
     * @default { name: null, default: null, title: null, validation: {}  }
     */
    @Complex<FieldOptionsModel>({ name: 'Subject' }, FieldOptions)
    public subject: FieldOptionsModel;

    /**
     * The `startTime` field defines the start time of an event and it is mandatory to provide it for any of the valid event objects.
     *
     * @default { name: null, default: null, title: null, validation: {} }
     */
    @Complex<FieldOptionsModel>({ name: 'StartTime' }, FieldOptions)
    public startTime: FieldOptionsModel;

    /**
     * The `endTime` field defines the end time of an event and it is mandatory to provide the end time for any of the valid event objects.
     *
     * @default { name: null, default: null, title: null, validation: {} }
     */
    @Complex<FieldOptionsModel>({ name: 'EndTime' }, FieldOptions)
    public endTime: FieldOptionsModel;

    /**
     * It maps the `startTimezone` field from the dataSource and usually accepts the valid
     * [`IANA timezone names`](https://docs.actian.com/ingres/11.0/index.html#page/Ing_Install/IANA_World_Regions_and_Time_Zone_Names.htm).
     *  It is assumed that the value provided for this field is taken into consideration while processing
     *  the `startTime` field. When this field is not mapped with any timezone names,
     *  then the events will be processed based on the timezone assigned to the Schedule.
     *
     * @default { name: null, default: null, title: null, validation: {} }
     */
    @Complex<FieldOptionsModel>({ name: 'StartTimezone' }, FieldOptions)
    public startTimezone: FieldOptionsModel;

    /**
     * It maps the `endTimezone` field from the dataSource and usually accepts the valid
     * [`IANA timezone names`](https://docs.actian.com/ingres/11.0/index.html#page/Ing_Install/IANA_World_Regions_and_Time_Zone_Names.htm).
     *  It is assumed that the value provided for this field is taken into consideration while processing the `endTime` field.
     *  When this field is not mapped with any timezone names, then the events will be processed based on the timezone assigned
     *  to the Schedule.
     *
     * @default { name: null, default: null, title: null, validation: {} }
     */
    @Complex<FieldOptionsModel>({ name: 'EndTimezone' }, FieldOptions)
    public endTimezone: FieldOptionsModel;

    /**
     * It maps the `location` field from the dataSource and the location field value will be displayed over
     *  events, while given it for an event object.
     *
     * @default { name: null, default: null, title: null, validation: {} }
     */
    @Complex<FieldOptionsModel>({ name: 'Location' }, FieldOptions)
    public location: FieldOptionsModel;

    /**
     * It maps the `description` field from the dataSource and denotes the event description which is optional.
     *
     * @default { name: null, default: null, title: null, validation: {} }
     */
    @Complex<FieldOptionsModel>({ name: 'Description' }, FieldOptions)
    public description: FieldOptionsModel;

    /**
     * The `isAllDay` field is mapped from the dataSource and is used to denote whether an event is created
     * for an entire day or for specific time alone.
     *
     * @default { name: null, default: null, title: null, validation: {} }
     */
    @Complex<FieldOptionsModel>({ name: 'IsAllDay' }, FieldOptions)
    public isAllDay: FieldOptionsModel;

    /**
     * It maps the `recurrenceID` field from dataSource and usually holds the ID value of the parent
     *  recurrence event. It is applicable only for the edited occurrence events.
     *
     * @default { name: null, default: null, title: null, validation: {} }
     */
    @Complex<FieldOptionsModel>({ name: 'RecurrenceID' }, FieldOptions)
    public recurrenceID: FieldOptionsModel;

    /**
     * It maps the `recurrenceRule` field from dataSource and is used to uniquely identify whether the
     *  event belongs to a recurring event type or normal ones.
     *
     * @default { name: null, default: null, title: null, validation: {} }
     */
    @Complex<FieldOptionsModel>({ name: 'RecurrenceRule' }, FieldOptions)
    public recurrenceRule: FieldOptionsModel;

    /**
     * It maps the `recurrenceException` field from dataSource and is used to hold the exception dates
     *  which needs to be excluded from recurring type.
     *
     * @default { name: null, default: null, title: null, validation: {} }
     */
    @Complex<FieldOptionsModel>({ name: 'RecurrenceException' }, FieldOptions)
    public recurrenceException: FieldOptionsModel;

    /**
     * The `isReadonly` field is mapped from the dataSource and is used to prevent the CRUD actions on specific events.
     *
     * @default null
     */
    @Property('IsReadonly')
    public isReadonly: string;

    /**
     * The `followingID` field is mapped from dataSource and usually holds the ID value of the main parent event.
     *
     * @default null
     */
    @Property('FollowingID')
    public followingID: string;

}
