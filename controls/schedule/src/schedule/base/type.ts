/**
 * types
 */

/**
 * An enum that denotes the view mode of the Scheduler.
 */
export type View = 'Day' | 'Week' | 'WorkWeek' | 'Month' | 'Year' | 'Agenda' | 'MonthAgenda' | 'TimelineDay' | 'TimelineWeek' |
    'TimelineWorkWeek' | 'TimelineMonth' | 'TimelineYear';

/**
 * An enum that holds the actions available in scheduler.
 */
export type CurrentAction = 'Add' | 'Save' | 'Delete' | 'DeleteOccurrence' | 'DeleteSeries' | 'EditOccurrence'
    | 'EditSeries' | 'EditFollowingEvents' | 'DeleteFollowingEvents';

/** @deprecated */
export type ReturnType = { result: Object[], count: number, aggregates?: Object };

/**
 * An enum that holds the available popup types in the scheduler.
 */
export type PopupType = 'Editor' | 'EventContainer' | 'QuickInfo' | 'RecurrenceAlert' | 'DeleteAlert' | 'ViewEventInfo' | 'EditEventInfo' |
    'ValidationAlert' | 'RecurrenceValidationAlert';

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
