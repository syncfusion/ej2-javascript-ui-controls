/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * types
 */

/**
 * An enum that denotes the view mode of the Scheduler.
 * ```props
 * Day :- Denotes Day view of the scheduler.
 * Week :- Denotes Week view of the scheduler.
 * WorkWeek :- Denotes Work Week view of the scheduler.
 * Month :- Denotes Month view of the scheduler.
 * Year :- Denotes Year view of the scheduler.
 * Agenda :- Denotes Agenda view of the scheduler.
 * MonthAgenda :- Denotes Month Agenda view of the scheduler.
 * TimelineDay :- Denotes Timeline Day view of the scheduler.
 * TimelineWeek :- Denotes Timeline Week view of the scheduler.
 * TimelineWorkWeek :- Denotes Timeline Work Week view of the scheduler.
 * TimelineMonth :- Denotes Timeline Month view of the scheduler.
 * TimelineYear :- Denotes Timeline Year view of the scheduler.
 * ```
 */
export type View = 'Day' | 'Week' | 'WorkWeek' | 'Month' | 'Year' | 'Agenda' | 'MonthAgenda' | 'TimelineDay' | 'TimelineWeek' | 'TimelineWorkWeek' | 'TimelineMonth' | 'TimelineYear';

/**
 * An enum that holds the actions available in scheduler.
 * ```props
 * Add :- Denotes the current action of the scheduler is appointment creation.
 * Save :- Denotes the current action of the scheduler is editing the appointment.
 * Delete :- Denotes the current action is deleting the appointment.
 * DeleteOccurrence :- Denotes the current action is deleting single occurrence of a recurrence.
 * DeleteSeries :- Denotes the current action is deleting the entire series of recurrence appointment.
 * EditOccurrence :- Denotes the current action is editing single occurrence of a recurrence.
 * EditSeries :- Denotes the current action is editing the entire series of recurrence appointment.
 * EditFollowingEvents :- Denotes the current action is editing the following appointments in a recurrence.
 * DeleteFollowingEvents :- Denotes the current action is deleting the following appointments in a recurrence.
 * ```
 */
export type CurrentAction = 'Add' | 'Save' | 'Delete' | 'DeleteOccurrence' | 'DeleteSeries' | 'EditOccurrence' | 'EditSeries' | 'EditFollowingEvents' | 'DeleteFollowingEvents';

/**
 * An enum that holds the options for success result.
 */
export type ReturnType = { result: Record<string, any>[], count: number, aggregates?: Record<string, any>, cancel: boolean };

/**
 * An enum that holds the available popup types in the scheduler. They are
 * ```props
 * DeleteAlert :- Denotes the popup showing delete confirmation message.
 * EditEventInfo :- Denotes the quick popup on the events in responsive mode.
 * Editor :- Denotes the detailed editor window.
 * EventContainer :- Denotes the more indicator popup.
 * QuickInfo :- Denotes the quick popup.
 * OverlapAlert :- Denotes the popup showing overlap events.
 * RecurrenceAlert :- Denotes the popup showing recurrence alerts.
 * RecurrenceValidationAlert :- Denotes the popup showing recurrence validation alerts.
 * ValidationAlert :- Denotes the popup showing validation alerts.
 * ViewEventInfo :- Denotes the quick popup on the cells in responsive mode.
 * ```
 */
export type PopupType = 'Editor' | 'EventContainer' | 'QuickInfo' | 'RecurrenceAlert' | 'DeleteAlert' | 'ViewEventInfo' | 'EditEventInfo' | 'ValidationAlert' | 'RecurrenceValidationAlert' | 'OverlapAlert';

/**
 * An enum that holds the header row type in the timeline scheduler.
 * ```props
 * Year :- Denotes the year row in the header bar.
 * Month :- Denotes the month row in the header bar.
 * Week :- Denotes the week row in the header bar.
 * Date :- Denotes the date row in the header bar.
 * Hour :- Denotes the hour row in the header bar.
 * ```
 */
export type HeaderRowType = 'Year' | 'Month' | 'Week' | 'Date' | 'Hour';

/**
 * An enum that holds the orientation modes of the scheduler.
 * ```props
 * Vertical :- Denotes the vertical orientation of Timeline Year view.
 * Horizontal :- Denotes the horizontal orientation of Timeline Year view.
 * ```
 */
export type Orientation = 'Vertical' | 'Horizontal';

/**
 * An enum that holds the supported excel file formats.
 * ```props
 * csv :- Denotes the excel file format is csv.
 * xlsx :- Denotes the excel file format is xlsx.
 * ```
 */
export type ExcelFormat = 'csv' | 'xlsx';

/**
 * An enum that holds the type where the quick info template applies.
 * ```props
 * Both :- Denotes the template applies both to the event and cell.
 * Cell :- Denotes the template applies only to the cell.
 * Event :- Denotes the template applies to the event alone.
 * ```
 */
export type TemplateType = 'Both' | 'Cell' | 'Event';

/**
 * An enum that holds the different type of week number options in the scheduler.
 * ```props
 * FirstDay :- Denotes that the first week of the year starts on the first day of the year and ends before the following designated first day of the week.
 * FirstFourDayWeek :- Denotes that the first week of the year is the first week with four or more days before the designated first day of the week.
 * FirstFullWeek :- Denotes that the first week of the year begins on the first occurrence of the designated first day of the week on or after the first day of the year.
 * ```
 */
export type WeekRule = 'FirstDay' | 'FirstFourDayWeek' | 'FirstFullWeek';

/**
 * An enum that holds the options to render the spanned events in all day row or time slot.
 * ```props
 * AllDayRow :- Denotes the rendering of spanned events in an all-day row.
 * TimeSlot :- Denotes the rendering of spanned events in an time slot row.
 * ```
 */
export type SpannedEventPlacement = 'AllDayRow' | 'TimeSlot';

/**
 * An enum that holds the options to define name of the toolbar items to access default toolbar items in the Scheduler.
 * ```props
 * Previous :- Denotes the previous date navigation button in the Schedule toolbar.
 * Next :- Denotes the next date navigation button in the Schedule toolbar.
 * Today :- Denotes the today button in the Schedule toolbar.
 * Views :- Denotes the view-switching in the Schedule toolbar.
 * DateRangeText :- Denotes the date range text in the Schedule toolbar.
 * NewEvent :- Denotes the new event button in the Schedule toolbar.
 * ```
 */
export type ToolbarName = 'Custom' | 'Previous' | 'Next' | 'Today' | 'Views' | 'DateRangeText' | 'NewEvent';

/**
 * An enum that defines the possible directions for a date collection.
 *
 * - **Previous:** Denotes the previous date collection.
 * - **Next:** Denotes the next date collection.
 * - **Current:** Denotes the current date collection.
 */
export type NavigationDirection = 'Previous' | 'Next' | 'Current';
