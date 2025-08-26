import { Property, ChildProperty, Complex } from '@syncfusion/ej2-base';import { Query, DataManager } from '@syncfusion/ej2-data';import { SortComparerFunction } from '../base/interface';import { SpannedEventPlacement } from '../base/type';import { Field } from './fields';import { FieldModel } from './fields-model';

/**
 * Interface for a class EventSettings
 */
export interface EventSettingsModel {

    /**
     * It accepts either the string or HTMLElement as template design content and parse it appropriately before displaying
     *  it onto the event background. All the event fields mapped to Schedule from dataSource can be accessed within this template code.
     * {% codeBlock src="schedule/event-template-api/index.ts" %}{% endcodeBlock %}
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    template?: string | Function;

    /**
     * With this property, the event data will be bound to Schedule.
     * The event data can be passed either as an array of JavaScript objects,
     * or else can create an instance of [`DataManager`](http://ej2.syncfusion.com/documentation/data/api-dataManager.html)
     * in case of processing remote data and can be assigned to the `dataSource` property.
     * With the remote data assigned to dataSource, check the available
     *  [adaptors](http://ej2.syncfusion.com/documentation/data/adaptors.html) to customize the data processing.
     *
     * @default []
     */
    dataSource?: Record<string, any>[] | DataManager;

    /**
     * Defines the external [`query`](http://ej2.syncfusion.com/documentation/data/api-query.html)
     * that will be executed along with the data processing.
     *
     * @default null
     */
    query?: Query;

    /**
     * Defines the collection of default event fields to be bind to the Schedule.
     *
     * @default null
     */
    fields?: FieldModel;

    /**
     * When set to `true` will display the normal tooltip over the events with its subject, location, start and end time.
     *
     * @default false
     */
    enableTooltip?: boolean;

    /**
     * Defines the option to render the spanned events (more than 24 hours) in either `AllDayRow` or `TimeSlot`. By default it renders in `AllDayRow`.
     * This property is applicable for `Day`, `Week` and `WorkWeek` views only. The possible values for this property as follows
     * * `AllDayRow`: Denotes the rendering of spanned events in an all-day row.
     * * `TimeSlot`: Denotes the rendering of spanned events in an time slot row.
     * {% codeBlock src='schedule/spannedEventPlacement/index.md' %}{% endcodeBlock %}
     *
     * @default 'AllDayRow'
     */
    spannedEventPlacement?: SpannedEventPlacement;

    /**
     * Sets a minimum duration for an event where the events are rendered for this minimum duration when the duration of the event is lesser than this value.
     *  It accepts duration value in minutes. This property is only applicable when the event duration is lesser than this property duration.
     *
     * @default 1
     */
    minimumEventDuration?: number;

    /**
     * It accepts either the string or HTMLElement as template design content and parse it appropriately before displaying it onto tooltip.
     *  All the event fields mapped with Schedule dataSource can be accessed within this template code.
     * {% codeBlock src="schedule/tooltip-template-api/index.ts" %}{% endcodeBlock %}
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    tooltipTemplate?: string | Function;

    /**
     * Defines the resource name, to decides the color of which particular resource level is to be applied on appointments, when
     *  grouping is enabled on scheduler.
     * {% codeBlock src="schedule/resource-color-field-api/index.ts" %}{% endcodeBlock %}
     *
     * @default null
     */
    resourceColorField?: string;

    /**
     * When set to `true` will edit the future events only instead of editing entire series.
     *
     * @default false
     */
    editFollowingEvents?: boolean;

    /**
     * When set to `false` the add action will be restricted.
     *
     * @default true
     */
    allowAdding?: boolean;

    /**
     * When set to `false` the edit action will be restricted.
     *
     * @default true
     */
    allowEditing?: boolean;

    /**
     * When set to `false` the delete action will be restricted.
     *
     * @default true
     */
    allowDeleting?: boolean;

    /**
     * It enables the event to occupy the full height in timeline views and
     * full width in vertical views, excluding the header of the cell.
     *
     * @default false
     */
    enableMaxHeight?: boolean;

    /**
     * This property enables the event to occupy the full height that remaining from the header and more indicator.
     * More than one appointment are available on the cell the more indicator is created.
     *
     * @default false
     */
    enableIndicator?: boolean;

    /**
     * This property ignores or include the Events element bottom white space.
     *
     * @default false
     */
    ignoreWhitespace?: boolean;

    /**
     * Defines the custom sort comparer function.
     * The sort comparer function has the same functionality like
     * [`Array.sort`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) sort comparer.
     *
     * @default null
     */
    sortComparer?: SortComparerFunction;

    /**
     * Gets or sets a value that determines whether the start date and end date filter conditions should be included in the query itself when requesting data from the server, or passed as query parameters in the API call.
     * When set to <c>true</c> the filter conditions will be part of the query itself, potentially reducing the size of the request and minimizing the time needed to parse the response.
     * However, it can also lead to longer query strings, which could result in issues with maximum URL length or server limitations on query string length.
     *
     * @default false
     */
    includeFiltersInQuery?: boolean;

}