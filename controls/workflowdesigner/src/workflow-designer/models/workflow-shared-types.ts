/**
 * Shared types for form fields, condition rules and output fields.
 */

import {
    WorkflowConditionLogic,
    WorkflowConditionOperator,
    WorkflowConditionValueType,
    WorkflowInputFieldType,
    WorkflowOutputFieldType
} from './workflow-enums';

/**
 * An input field declared on a Form Input trigger step.
 *
 * @private
 */
export interface WorkflowInputFieldModel {
    /** Field name. */
    name: string;

    /** Field input type. */
    type: WorkflowInputFieldType;

    /** Optional current submitted value (runtime-only; not persisted as config). */
    value?: unknown;

    /** Optional default value applied before submission. */
    defaultValue?: unknown;

    /** Optional field label. */
    label?: string;

    /** Optional placeholder text. */
    placeholder?: string;

    /** Legacy placeholder spelling retained for existing samples. */
    placeHolder?: string;

    /** Whether the field is required. */
    required?: boolean;

    /** Optional choices for selection-type fields. */
    options?: WorkflowChoiceOption[];

    /** Legacy choices spelling retained for existing samples. */
    choices?: unknown[];
}

/**
 * Choice option for DropDown, CheckBoxes and RadioButton fields.
 *
 * @private
 */
export interface WorkflowChoiceOption {
    label: string;
    value: string | number | boolean;
}

/**
 * A single typed condition rule used by Filter and Condition steps.
 *
 * @private
 */
export interface ConditionRule {
    /** Field path evaluated against runtime context. */
    field: string;

    /** Expected value type for the comparison. */
    valueType: WorkflowConditionValueType;

    /** Comparison operator. */
    operator: WorkflowConditionOperator;

    /** Optional comparison value. */
    value?: unknown;
}

/**
 * And/Or logic combinator for a set of condition rules.
 *
 * @private
 */
export type WorkflowConditionLogicType = WorkflowConditionLogic;

/**
 * A declared output field for steps that produce structured output.
 *
 * @private
 */
export interface WorkflowOutputFieldModel {
    /** Field name. */
    name: string;

    /** Field value type. */
    type: WorkflowOutputFieldType;

    /** Optional human-readable description. */
    description?: string;
}

/**
 * A key-value pair used by API Request and Notify steps.
 *
 * @private
 */
export interface KeyValue {
    /** Key name. */
    key: string;

    /** Value (JSON-safe when persisted as configuration). */
    value: unknown;
}
