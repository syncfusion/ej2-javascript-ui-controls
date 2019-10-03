import { Property, ChildProperty, Complex } from '@syncfusion/ej2-base';import { FieldOptionsModel } from './field-options-model';import { FieldOptions } from './field-options';

/**
 * Interface for a class Field
 */
export interface FieldModel {

    /**
     * The `id` field needs to be defined as mandatory, when the Schedule is bound to remote data and
     *  it is optional, if the same is bound with JSON data. This field usually assigns ID value to each of the events.

     */
    id?: string;

    /**
     * The `isBlock` field allows you to block certain time interval on the Scheduler.
     * It is a boolean type property accepting either true or false values.
     * When set to true, creates a block range for the specified time interval and disables the event scheduling actions on that time range.

     */
    isBlock?: string;

    /**
     * The `subject` field is optional, and usually assigns the subject text to each of the events.

     */
    subject?: FieldOptionsModel;

    /**
     * The `startTime` field defines the start time of an event and it is mandatory to provide it for any of the valid event objects.

     */
    startTime?: FieldOptionsModel;

    /**
     * The `endTime` field defines the end time of an event and it is mandatory to provide the end time for any of the valid event objects.

     */
    endTime?: FieldOptionsModel;

    /**
     * It maps the `startTimezone` field from the dataSource and usually accepts the valid IANA timezone names.
     *  It is assumed that the value provided for this field is taken into consideration while processing
     *  the `startTime` field. When this field is not mapped with any timezone names,
     *  then the events will be processed based on the timezone assigned to the Schedule.

     */
    startTimezone?: FieldOptionsModel;

    /**
     * It maps the `endTimezone` field from the dataSource and usually accepts the valid IANA timezone names.
     *  It is assumed that the value provided for this field is taken into consideration while processing the `endTime` field.
     *  When this field is not mapped with any timezone names, then the events will be processed based on the timezone assigned
     *  to the Schedule.

     */
    endTimezone?: FieldOptionsModel;

    /**
     * It maps the `location` field from the dataSource and the location field value will be displayed over
     *  events, while given it for an event object.

     */
    location?: FieldOptionsModel;

    /**
     * It maps the `description` field from the dataSource and denotes the event description which is optional. 

     */
    description?: FieldOptionsModel;

    /**
     * The `isAllDay` field is mapped from the dataSource and is used to denote whether an event is created 
     * for an entire day or for specific time alone. 

     */
    isAllDay?: FieldOptionsModel;

    /**
     * It maps the `recurrenceID` field from dataSource and usually holds the ID value of the parent
     *  recurrence event. It is applicable only for the edited occurrence events.

     */
    recurrenceID?: FieldOptionsModel;

    /**
     * It maps the `recurrenceRule` field from dataSource and is used to uniquely identify whether the
     *  event belongs to a recurring event type or normal ones.

     */
    recurrenceRule?: FieldOptionsModel;

    /**
     * It maps the `recurrenceException` field from dataSource and is used to hold the exception dates
     *  which needs to be excluded from recurring type.

     */
    recurrenceException?: FieldOptionsModel;

    /**
     * The `isReadonly` field is mapped from the dataSource and is used to prevent the CRUD actions on specific events.

     */
    isReadonly?: string;

    /**
     * The `followingID` field is mapped from dataSource and usually holds the ID value of the main parent event.

     */
    followingID?: string;

}