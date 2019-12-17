/**
 * types
 */

/**
 * An enum type that denotes the view mode of the schedule. Available options are as follows
 * * Day
 * * Week
 * * WorkWeek
 * * Month
 * * Agenda
 * * MonthAgenda
 * * TimelineDay
 * * TimelineWeek
 * * TimelineWorkWeek
 * * TimelineMonth
 * * TimelineYear
 */
export type View = 'Day' | 'Week' | 'WorkWeek' | 'Month' | 'Agenda' | 'MonthAgenda' | 'TimelineDay' | 'TimelineWeek' |
    'TimelineWorkWeek' | 'TimelineMonth' | 'TimelineYear';

export type CurrentAction = 'Add' | 'Save' | 'Delete' | 'DeleteOccurrence' | 'DeleteSeries' | 'EditOccurrence'
    | 'EditSeries' | 'EditFollowingEvents' | 'DeleteFollowingEvents';

/** @deprecated */
export type ReturnType = { result: Object[], count: number, aggregates?: Object };

export type PopupType = 'Editor' | 'EventContainer' | 'QuickInfo' | 'RecurrenceAlert' | 'DeleteAlert' | 'ViewEventInfo' | 'EditEventInfo' |
    'ValidationAlert' | 'RecurrenceValidationAlert';

export type HeaderRowType = 'Year' | 'Month' | 'Week' | 'Date' | 'Hour';

export type Orientation = 'Vertical' | 'Horizontal';

export type ExcelFormat = 'csv' | 'xlsx';

export type TemplateType = 'Both' | 'Cell' | 'Event';
