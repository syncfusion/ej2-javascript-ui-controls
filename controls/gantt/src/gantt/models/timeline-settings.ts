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
     * @default 'None'
     */
    @Property('None')
    public unit: TimelineViewMode;

    /**
     * Defines number of timeline units combined for single cell.
     * @default 1
     */
    @Property(1)
    public count: number;

    /**
     * Defines method to get custom formatted values of timeline cells.
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
     * @default 'None'
     */
    @Property('Week')
    public timelineViewMode: TimelineViewMode;
    /**
     * Defines top tier setting in timeline.
     */
    @Complex<TimelineTierSettingsModel>({}, TimelineTierSettings)
    public topTier: TimelineTierSettingsModel;
    /**
     * Defines bottom tier settings in timeline.
     */
    @Complex<TimelineTierSettingsModel>({}, TimelineTierSettings)
    public bottomTier: TimelineTierSettingsModel;
    /** 
     * Defines width of timeline cell.
     * @default 33
     */
    @Property(33)
    public timelineUnitSize: number;
    /**
     * Defines week start day in timeline.
     * @default 0     
     */
    @Property(0)
    public weekStartDay: number;
    /** 
     * Defines background color of weekend cell in week - day timeline mode.
     * @default null      
     */
    @Property(null)
    public weekendBackground: string;
    /**
     * Enables or disables tooltip for timeline cells.
     */
    @Property(true)
    public showTooltip: boolean;
    /**
     * Enables or disables timeline auto update on editing action.
     */
    @Property(true)
    public updateTimescaleView: boolean;
}
