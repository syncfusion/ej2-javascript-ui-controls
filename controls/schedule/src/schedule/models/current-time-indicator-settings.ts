import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * A class that represents the per-aspect configuration of the current time indicator
 * rendered on the Schedule.
 *
 * The values on this model are consulted by the Schedule renderers only when the master
 * `showTimeIndicator` boolean is `true`. Each sub-toggle defaults to `true` so today's
 * default rendering (label + line + full-width + on-top) is preserved when the consumer
 * omits the property or supplies a partial settings object.
 *
 * @private
 */
export class CurrentTimeIndicatorSettings extends ChildProperty<CurrentTimeIndicatorSettings> {
    /**
     * When set to `false`, hides the time text label that is rendered alongside the
     * current time line. The line itself continues to render.
     *
     * @default true
     */
    @Property(true)
    public showTime: boolean;

    /**
     * When set to `false`, restricts the current time line to the per-day-column width
     * on vertical views, or to the active day-column on a single-day timeline view. The
     * default `true` spans the time-cells row on vertical views and the visible content
     * area on timeline views.
     *
     * @default true
     */
    @Property(true)
    public showPreviousDates: boolean;

    /**
     * When set to `false`, places the current time line and label behind the appointment
     * elements. Implemented by DOM reorder: the indicator element is INSERTED BEFORE the
     * first `.e-appointment` anchor in the same container via `insertBefore`, so the
     * line / label render beneath later-appended appointment elements on the natural
     * insertion-order ladder. The default `true` APPENDS the indicator after appointments.
     *
     * @default true
     */
    @Property(true)
    public onTop: boolean;
}

