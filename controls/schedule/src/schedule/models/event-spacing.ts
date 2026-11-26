import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * A class that represents the space that the Scheduler leaves around and between the events of a track.
 * The values apply along the stacking axis of the track: the inline direction of the columns in the Day, Week and WorkWeek views,
 * and the block direction of the levels in the all-day row, Month and Timeline views.
 * Spacing never moves an event on the time axis.
 */
export class EventSpacing extends ChildProperty<EventSpacing> {
    /**
     * Specifies the space, in pixels, between two adjacent events on the stacking axis.
     * It is applied only between events, never before the first or after the last event.
     * When the value is `null`, the built-in space of the view is used.
     *
     * @remarks
     * - The value must be `null` or a finite number greater than or equal to `0`. A finite non-negative numeric string is converted to a number.
     * - Any other value (negative, `NaN`, infinite or of another type) is silently treated as `0`.
     *
     * @default null
     * @angularType number
     * @reactType number
     * @vueType number
     * @aspType double?
     */
    @Property(null)
    public gap: number;

    /**
     * Specifies the space, in pixels, reserved before the first column or level of a track.
     * It is the inline-start edge of a day column in the Day, Week and WorkWeek views,
     * and the top of the track in the all-day row, Month and Timeline views.
     * When the value is `null`, the built-in space of the view is used.
     *
     * @remarks
     * - The value must be `null` or a finite number greater than or equal to `0`. A finite non-negative numeric string is converted to a number.
     * - Any other value (negative, `NaN`, infinite or of another type) is silently treated as `0`.
     *
     * @default null
     * @angularType number
     * @reactType number
     * @vueType number
     * @aspType double?
     */
    @Property(null)
    public leadingSpace: number;

    /**
     * Specifies the space, in pixels, reserved after the last column or level of a track.
     * It is the inline-end edge of a day column in the Day, Week and WorkWeek views,
     * and the bottom of the track in the all-day row, Month and Timeline views.
     * The space stays free when the track is full of events, and it is reserved after the "more" indicator when one is shown.
     * When the value is `null`, the built-in space of the view is used.
     *
     * @remarks
     * - The value must be `null` or a finite number greater than or equal to `0`. A finite non-negative numeric string is converted to a number.
     * - Any other value (negative, `NaN`, infinite or of another type) is silently treated as `0`.
     *
     * @default null
     * @angularType number
     * @reactType number
     * @vueType number
     * @aspType double?
     */
    @Property(null)
    public trailingSpace: number;
}
