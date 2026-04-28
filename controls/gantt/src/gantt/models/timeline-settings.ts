import { Property, ChildProperty, Complex } from '@syncfusion/ej2-base';
import { TimelineViewMode } from '../base/enum';
import { TimelineTierSettingsModel } from './timeline-settings-model';
import { ITimelineFormatter } from '../base/interface';

/**
 * Configures timeline settings of Gantt.
 */
export class TimelineTierSettings extends ChildProperty<TimelineTierSettings> {
    /**
     * Defines timeline cell format.
     *
     * @default ''
     */
    @Property('')
    public format: string;

    /**
     * Defines timeline mode of Gantt header.
     * * `None` - Default.
     * * `Week` - Define the week mode header.
     * * `Day` - Define the day mode header.
     * * `Hour` - Define the hour mode header.
     * * `Month` - Define the month mode header.
     * * `Year` - Define the year mode header.
     * * `Minutes` - Define the minutes mode header.
     *
     * @default 'None'
     */
    @Property('None')
    public unit: TimelineViewMode;

    /**
     * Defines number of timeline units combined for single cell.
     *
     * @default 1
     */
    @Property(1)
    public count: number;

    /**
     * Defines method to get custom formatted values of timeline cells.
     *
     * @default null
     */
    @Property(null)
    public formatter: string | ITimelineFormatter;
}
/**
 * Configures the timeline settings property in the Gantt.
 */
export class TimelineSettings extends ChildProperty<TimelineSettings> {
    /**
     * Defines timeline mode of Gantt header.
     * * `None` - Default.
     * * `Week` - Define the week mode header.
     * * `Day` - Define the day mode header.
     * * `Hour` - Define the hour mode header.
     * * `Month` - Define the month mode header.
     * * `Year` - Define the year mode header.
     * * `Minutes` - Define the minutes mode header.
     *
     * When set to any value other than 'None', this mode suggests a default topTier/bottomTier combination,
     * but any explicit manual tier settings (e.g., unit) take precedence and override the mode's defaults.
     *
     * @default 'None'
     */
    @Property('Week')
    public timelineViewMode: TimelineViewMode;
    /**
     * Defines top tier setting in timeline.
     * When timelineViewMode is set to a specific mode (not 'None'), explicit topTier settings override the mode's default.
     */
    @Complex<TimelineTierSettingsModel>({}, TimelineTierSettings)
    public topTier: TimelineTierSettingsModel;
    /**
     * Defines bottom tier settings in timeline.
     * When timelineViewMode is set to a specific mode (not 'None'), explicit bottomTier settings override the mode's default.
     */
    @Complex<TimelineTierSettingsModel>({}, TimelineTierSettings)
    public bottomTier: TimelineTierSettingsModel;
    /**
     * Defines width of timeline cell.
     *
     * @default 33
     */
    @Property(33)
    public timelineUnitSize: number;
    /**
     * Sets the first day of the week for timeline week calculations and labels.
     * Accepts values: 0 = Sunday, 1 = Monday, ..., 6 = Saturday.
     *
     * The property only works when the timeline displays weeks.
     * Make sure to enable week view using one of these:
     *   - `timelineViewMode: 'Week'`
     *   - or `topTier.unit: 'Week'` + `bottomTier.unit: 'Day'`
     *
     * Without a week-level tier in the timeline, changing this property will not change anything visible.
     *
     * @default 0  // Sunday
     */
    @Property(0)
    public weekStartDay: number;
    /**
     * Defines the background color for weekend cells when the timeline shows day-level units (i.e., timelineViewMode is 'Day' or 'Week' and bottomTier.unit is 'Day').
     *
     * @default null
     */
    @Property(null)
    public weekendBackground: string;
    /**
     * Enables or disables tooltip for timeline cells.
     *
     * @default true
     */
    @Property(true)
    public showTooltip: boolean;
    /**
     * Enables or disables timeline auto update on editing action.
     *
     * @default true
     */
    @Property(true)
    public updateTimescaleView: boolean;

    /**
     * Enables or disables the display of weekend cells in the Gantt Chart timeline.
     * Weekend days are determined based on the `workweek` configuration, which defines the working days (e.g., Monday to Friday).
     * Any day not included in the `workweek` is treated as a non-working day.
     * When set to `false`, non-working days will be hidden from the timeline view.
     * @default true
     */
    @Property(true)
    public showWeekend: boolean;

    /**
     * Specifies the start date for the visible timeline rendering in the Gantt chart UI.
     * If a specific date is provided, the timeline starts at this date and remains fixed.
     *
     * @default 'auto'
     */
    @Property('auto')
    public viewStartDate: Date | string | 'auto';

    /**
     * Specifies the end date for the visible timeline rendering in the Gantt chart UI.
     * If no value is provided (`auto`), the end date is automatically calculated to fill the chart width based on the visible timeline.
     * If a specific date is provided, the timeline ends at this date and remains fixed.
     *
     * @default 'auto'
     */
    @Property('auto')
    public viewEndDate: Date | string | 'auto';
}
