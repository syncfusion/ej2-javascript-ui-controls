/**
 * Kanban Types
 */

/**
 * Defines types to be used as ReturnType.
 */
export type ReturnType = { result: Object[], count: number, aggregates?: Object };

/**
 * Defines types to be used as CurrentAction.
 */
export type CurrentAction = 'Add' | 'Edit' | 'Delete';

/**
 * Defines types to be used as SelectionType.
 */
export type SelectionType = 'None' | 'Single' | 'Multiple';

/**
 * Defines types to be used as SortDirection.
 */
export type SortDirection = 'Ascending' | 'Descending';

/**
 * Defines types to be used as SortOrder.
 */
export type SortOrderBy = 'DataSourceOrder' | 'Index' | 'Custom';

/**
 * Defines types to be used as ConstraintType.
 */
export type ConstraintType = 'Column' | 'Swimlane';

/**
 * Defines types used to specifies the Dialog Field Type.
 */
export type DialogFieldType = 'TextBox' | 'DropDown' | 'Numeric' | 'TextArea';
