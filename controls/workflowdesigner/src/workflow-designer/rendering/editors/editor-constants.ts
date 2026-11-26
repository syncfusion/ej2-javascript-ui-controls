/**
 * Shared option lists for structured property editors (form fields, conditions, switch).
 * Keeps UI labels aligned with WorkflowInputFieldType / ConditionRule enums.
 */

import {
    WorkflowConditionOperator,
    WorkflowConditionValueType,
    WorkflowInputFieldType,
    WorkflowVariableOperator
} from '../../models/workflow-enums';

/**
 * Set Variable math / comparison operators.
 *
 * @private
 */
export const VARIABLE_OPERATORS: WorkflowVariableOperator[] = [
    'Add',
    'Subtract',
    'Multiply',
    'Divide',
    'Modulo',
    'Percentage',
    'GreaterThan',
    'LessThan',
    'GreaterThanOrEqual',
    'LessThanOrEqual',
    'StrictEqual'
];

/**
 * INPUT FIELD TYPES.
 *
 * @private
 */
export const INPUT_FIELD_TYPES: WorkflowInputFieldType[] = [
    'TextBox',
    'TextArea',
    'Number',
    'Date',
    'Password',
    'Email',
    'DropDown',
    'CheckBoxes',
    'RadioButton'
];

/**
 * OPTION FIELD TYPES.
 *
 * @private
 */
export const OPTION_FIELD_TYPES: WorkflowInputFieldType[] = [
    'DropDown',
    'CheckBoxes',
    'RadioButton'
];

/**
 * CONDITION VALUE TYPES.
 *
 * @private
 */
export const CONDITION_VALUE_TYPES: WorkflowConditionValueType[] = [
    'String',
    'Number',
    'Boolean',
    'Date',
    'Array'
];

/**
 * Types for AI desired response fields (JSON schema / structured output).
 *
 * @private
 */
export const AI_RESPONSE_FIELD_TYPES: string[] = [
    'String',
    'Number',
    'Boolean',
    'Array',
    'Object'
];

/**
 * CONDITION OPERATORS.
 *
 * @private
 */
export const CONDITION_OPERATORS: WorkflowConditionOperator[] = [
    'Equal',
    'NotEqual',
    'Contains',
    'NotContains',
    'StartsWith',
    'NotStartsWith',
    'EndsWith',
    'NotEndsWith',
    'MatchesRegex',
    'NotMatchesRegex',
    'IsEmpty',
    'IsNotEmpty',
    'ArrayContains',
    'ArrayNotContains',
    'LengthEqual',
    'LengthNotEqual',
    'LengthGreaterThan',
    'LengthLessThan',
    'GreaterThan',
    'GreaterThanOrEqual',
    'LessThan',
    'LessThanOrEqual',
    'Before',
    'BeforeOrEqual',
    'After',
    'AfterOrEqual',
    'IsTrue',
    'IsFalse'
];

/**
 * Operators that do not need a comparison value.
 *
 * @private
 */
export const VALUELESS_OPERATORS: WorkflowConditionOperator[] = [
    'IsEmpty',
    'IsNotEmpty',
    'IsTrue',
    'IsFalse'
];

/** Equality + empty checks shared by most value types. */
const COMMON_EQUALITY_OPERATORS: WorkflowConditionOperator[] = [
    'Equal',
    'NotEqual',
    'IsEmpty',
    'IsNotEmpty'
];

/**
 * Operators relevant to each condition value type (hide irrelevant ones in the UI).
 *
 * @private
 */
export const OPERATORS_BY_VALUE_TYPE: { [valueType: string]: WorkflowConditionOperator[] } = {
    String: COMMON_EQUALITY_OPERATORS.concat([
        'Contains',
        'NotContains',
        'StartsWith',
        'NotStartsWith',
        'EndsWith',
        'NotEndsWith',
        'MatchesRegex',
        'NotMatchesRegex',
        'LengthEqual',
        'LengthNotEqual',
        'LengthGreaterThan',
        'LengthLessThan'
    ]),
    Number: COMMON_EQUALITY_OPERATORS.concat([
        'GreaterThan',
        'GreaterThanOrEqual',
        'LessThan',
        'LessThanOrEqual'
    ]),
    Date: COMMON_EQUALITY_OPERATORS.concat([
        'Before',
        'BeforeOrEqual',
        'After',
        'AfterOrEqual'
    ]),
    Boolean: [
        'IsTrue',
        'IsFalse',
        'IsEmpty',
        'IsNotEmpty'
    ],
    Array: COMMON_EQUALITY_OPERATORS.concat([
        'Contains',
        'NotContains',
        'LengthEqual',
        'LengthNotEqual',
        'LengthGreaterThan',
        'LengthLessThan'
    ])
};

/**
 * Convert dropdown values into items whose popup options expose native titles.
 *
 * @param {string[]} values The dropdown values.
 * @returns {Object[]} The dropdown items.
 * @private
 */
export function editorDropdownItems(values: string[]): { [key: string]: Object }[] {
    return values.map((value: string) => ({
        text: value,
        value: value,
        htmlAttributes: { title: value }
    }));
}

/**
 * Determines whether a field type uses selectable options.
 *
 * @param {string} type The field type.
 * @returns {boolean} Whether options should be displayed.
 * @private
 */
export function needsFieldOptions(type: string): boolean {
    return OPTION_FIELD_TYPES.indexOf(type as WorkflowInputFieldType) !== -1;
}

/**
 * Determines whether an operator requires a comparison value.
 *
 * @param {string} operator The condition operator.
 * @returns {boolean} Whether a value is required.
 * @private
 */
export function operatorNeedsValue(operator: string): boolean {
    return VALUELESS_OPERATORS.indexOf(operator as WorkflowConditionOperator) === -1;
}

/**
 * Operators allowed for the given condition value type.
 *
 * @param {string} valueType The condition value type.
 * @returns {WorkflowConditionOperator[]} The allowed operators.
 * @private
 */
export function operatorsForValueType(valueType: string): WorkflowConditionOperator[] {
    const key: string = valueType || 'String';
    const listed: WorkflowConditionOperator[] | undefined = OPERATORS_BY_VALUE_TYPE[`${key}`];
    return listed && listed.length ? listed.slice() : OPERATORS_BY_VALUE_TYPE.String.slice();
}

/**
 * Keeps an operator valid when the value type changes; falls back to the first allowed operator.
 *
 * @param {string} operator The condition operator.
 * @param {string} valueType The condition value type.
 * @returns {WorkflowConditionOperator} A valid operator for the value type.
 * @private
 */
export function coerceOperatorForValueType(
    operator: string,
    valueType: string
): WorkflowConditionOperator {
    const allowed: WorkflowConditionOperator[] = operatorsForValueType(valueType);
    if (allowed.indexOf(operator as WorkflowConditionOperator) !== -1) {
        return operator as WorkflowConditionOperator;
    }
    return allowed.length ? allowed[0] : 'Equal';
}
