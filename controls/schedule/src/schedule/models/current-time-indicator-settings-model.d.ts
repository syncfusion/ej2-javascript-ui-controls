import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Interface for a class CurrentTimeIndicatorSettings
 * @private
 */
export interface CurrentTimeIndicatorSettingsModel {

    /**
     * When set to `false`, hides the time text label that is rendered alongside the
     * current time line. The line itself continues to render.
     *
     * @default true
     */
    showTime?: boolean;

    /**
     * When set to `false`, restricts the current time line to the per-day-column width
     * on vertical views, or to the active day-column on a single-day timeline view. The
     * default `true` spans the time-cells row on vertical views and the visible content
     * area on timeline views.
     *
     * @default true
     */
    showPreviousDates?: boolean;

    /**
     * When set to `false`, places the current time line and label behind the appointment
     * elements. Implemented by DOM reorder: the indicator element is INSERTED BEFORE the
     * first `.e-appointment` anchor in the same container via `insertBefore`, so the
     * line / label render beneath later-appended appointment elements on the natural
     * insertion-order ladder. The default `true` APPENDS the indicator after appointments.
     *
     * @default true
     */
    onTop?: boolean;

}