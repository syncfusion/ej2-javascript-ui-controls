/**
 * Kanban Types
 */

export type ReturnType = { result: Object[], count: number, aggregates?: Object };

/**
 * @deprecated
 */
export type CurrentAction = 'Add' | 'Edit' | 'Delete';

export type SelectionType = 'None' | 'Single' | 'Multiple';

export type SortType = 'Ascending' | 'Descending';

export type ConstraintType = 'Column' | 'Swimlane';

export type DialogFieldType = 'String' | 'Numeric' | 'TextArea' | 'DropDown' | 'Input' | 'TextBox';
