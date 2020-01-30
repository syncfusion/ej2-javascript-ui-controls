/**
 * Kanban Types
 */

export type ReturnType = { result: Object[], count: number, aggregates?: Object };

export type CurrentAction = 'Add' | 'Edit' | 'Delete';

export type SelectionType = 'None' | 'Single' | 'Multiple';

export type SortType = 'Ascending' | 'Descending';

export type ConstraintType = 'Column' | 'Swimlane';
