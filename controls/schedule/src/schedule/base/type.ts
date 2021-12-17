/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * types
 */

/**
 * An enum that denotes the view mode of the Scheduler.
 */
export type View = 'Day' | 'Week' | 'WorkWeek' | 'Month' | 'Year' | 'Agenda' | 'MonthAgenda' | 'TimelineDay' | 'TimelineWeek' | 'TimelineWorkWeek' | 'TimelineMonth' | 'TimelineYear';

/**
 * An enum that holds the actions available in scheduler.
 */
export type CurrentAction = 'Add' | 'Save' | 'Delete' | 'DeleteOccurrence' | 'DeleteSeries' | 'EditOccurrence' | 'EditSeries' | 'EditFollowingEvents' | 'DeleteFollowingEvents';

/**
 * An enum that holds the options for success result.
 */
export type ReturnType = { result: Record<string, any>[], count: number, aggregates?: Record<string, any> };

/**
 * An enum that holds the available popup types in the scheduler.
 */
export type PopupType = 'Editor' | 'EventContainer' | 'QuickInfo' | 'RecurrenceAlert' | 'DeleteAlert' | 'ViewEventInfo' | 'EditEventInfo' | 'ValidationAlert' | 'RecurrenceValidationAlert';

/**
 * An enum that holds the header row type in the timeline scheduler.
 */
export type HeaderRowType = 'Year' | 'Month' | 'Week' | 'Date' | 'Hour';
/**
 * An enum that holds the orientation modes of the scheduler.
 */
export type Orientation = 'Vertical' | 'Horizontal';
/**
 * An enum that holds the supported excel file formats.
 */
export type ExcelFormat = 'csv' | 'xlsx';
/**
 * An enum that holds the type where the quick info template applies.
 */
export type TemplateType = 'Both' | 'Cell' | 'Event';
/**
 * An enum that holds the different type of week number options in the scheduler.
 */
export type WeekRule = 'FirstDay' | 'FirstFourDayWeek' | 'FirstFullWeek';
/**
 * An enum that holds the options to render the spanned events in all day row or time slot.
 */
export type SpannedEventPlacement = 'AllDayRow' | 'TimeSlot';
