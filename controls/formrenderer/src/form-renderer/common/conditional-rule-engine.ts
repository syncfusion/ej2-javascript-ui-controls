import {
    ConditionType,
    ConditionalRule,
    CompositeConditionalRule,
    ConditionRule,
    ConditionalDataRule,
    ChoiceBasedFieldRule
} from '../form-renderer/types/form-schema';

import { Internationalization } from '@syncfusion/ej2-base';
import { FormValueType } from './utils';

/**
 * ConditionalRuleEngine class
 * @private
 */
export class ConditionalRuleEngine {
  /**
   * Evaluate a conditional rule against form values
   *
   * Handles both simple rules (field operator value) and composite rules (AND/OR).
   * Returns false for malformed rules.
   *
   * @param rule - ConditionalRule or CompositeConditionalRule
   * @param formValues - Current form field values (key = field name, value = field value)
   * @returns true if condition met, false otherwise
   * @private
   * @example
   * ```typescript
   * const rule = { field: 'age', operator: 'greaterThan', value: 18 };
   * const isAdult = ConditionalRuleEngine.evaluateCondition(rule, { age: 25 });
   * // isAdult = true
   * ```
   */
  static evaluateCondition(
    rule: ConditionType,
    formValues: Record<string, FormValueType>
  ): boolean {
    try {
      // Handle simple rule (field operator value)
      if ('field' in rule && 'operator' in rule && 'value' in rule) {
        return this.evaluateSimpleRule(rule as ConditionalRule, formValues);
      }

      // Handle composite rule (AND/OR)
      if ('condition' in rule && 'rules' in rule) {
        return this.evaluateCompositeRule(
          rule as CompositeConditionalRule,
          formValues
        );
      }
      return false;
    } catch (error) {
      return false; // Safe default on error
    }
  }

  /**
   * Evaluate simple field comparison rule
   *
   * Supports operators: equal, notEqual, greaterThan, lessThan, greaterThanOrEqual,
   * lessThanOrEqual, in, notIn, contains, notContains.
   *
   * Handles both camelCase (greaterThan) and lowercase (greaterthan) operator formats
   * for compatibility with QueryBuilder output.
   *
   * @param rule - Simple conditional rule with field, operator, value
   * @param formValues - Current form field values
   * @returns true if comparison is true, false otherwise
   *
   * @example
   * ```typescript
   * const rule = { field: 'email', operator: 'contains', value: '@' };
   * const hasAt = evaluateSimpleRule(rule, { email: 'test@example.com' });
   * // hasAt = true
   * ```
   */
  private static evaluateSimpleRule(
    rule: ConditionalRule,
    formValues: Record<string, FormValueType>
  ): boolean {
    try {
      const fieldValue = formValues[rule.field];
      const operator = rule.operator.toLowerCase();

      // Allow evaluation for operators that make sense when value is undefined/empty
      if (fieldValue === undefined) {
        const allowedForUndefined: string[] = ['equal', 'equals', 'notequal', 'notequals', 'isempty', 'isnotempty'];
        if (allowedForUndefined.indexOf(operator) === -1) {
          return false;
        }
      }

      // Check if field value is an array (for multiselect, checkboxGroup)
      const isFieldArray = Array.isArray(fieldValue);
      const intl = new Internationalization();

      switch (operator) {
        case 'equal':
        case 'equals':
          return fieldValue === rule.value;

        case 'notequal':
        case 'notequals':
          return fieldValue !== rule.value;

        case 'startswith': return fieldValue.startsWith(rule.value);
        case 'doesnotstartswith': return !fieldValue.startsWith(rule.value);

        case 'greaterthan':
        case 'lessthan':
        case 'greaterthanorequal':
        case 'lessthanorequal': {
          const ln = Number(fieldValue);
          const rn = Number(rule.value);
          if (!Number.isNaN(ln) && !Number.isNaN(rn)) {
            if (operator === 'greaterthan') return ln > rn;
            if (operator === 'lessthan') return ln < rn;
            if (operator === 'greaterthanorequal') return ln >= rn;
            return ln <= rn;
          }
          return false;
        }

        case 'dategreaterthan':
        case 'datelessthan': {
          // try date comparison first
          const leftTs = intl.parseDate(fieldValue, { format: 'MM/dd/yyyy' });
          const rightTs = intl.parseDate(rule.value as string, { format: 'MM/dd/yyyy' });
          if (leftTs !== null && rightTs !== null) {
            if (operator === 'dategreaterthan') return leftTs > rightTs;
            if (operator === 'datelessthan') return leftTs < rightTs;
            return leftTs <= rightTs;
          }
          return false;
        }

        case 'timegreaterthan':
        case 'timelessthan': {
          // Parse time strings (format: hh:mm a)
          const leftTime = intl.parseDate(fieldValue, { format: 'hh:mm a', type: 'time' });
          const rightTime = intl.parseDate(rule.value as string, { format: 'hh:mm a', type: 'time' });
          if (leftTime !== null && rightTime !== null) {
            if (operator === 'timegreaterthan') return leftTime > rightTime;
            if (operator === 'timelessthan') return leftTime < rightTime;
          }
          return false;
        }

        case 'datetimegreaterthan':
        case 'datetimelessthan': {
          // Parse datetime strings (format: MM/dd/yyyy hh:mm a)
          const leftDateTime = intl.parseDate(fieldValue, { format: 'MM/dd/yyyy hh:mm a', type: 'dateTime' });
          const rightDateTime = intl.parseDate(rule.value as string, { format: 'MM/dd/yyyy hh:mm a', type: 'dateTime' });
          if (leftDateTime !== null && rightDateTime !== null) {
            if (operator === 'datetimegreaterthan') return leftDateTime > rightDateTime;
            if (operator === 'datetimelessthan') return leftDateTime < rightDateTime;
          }
          return false;
        }

        case 'contains':
          // If field value is array, check if array contains the specific value(s)
          if (isFieldArray) {
            // Parse comma-separated values in rule.value if it's a string
            if (typeof rule.value === 'string' && rule.value.indexOf(',') !== -1) {
              const searchValues: string[] = rule.value.split(',').map(v => v.trim());
              // Check if array contains ANY of the search values
              return searchValues.some(searchVal => (fieldValue as any[]).indexOf(searchVal) !== -1);
            }
            return (fieldValue as any[]).indexOf(rule.value) !== -1;
          }
          // Otherwise, check string contains
          return String(fieldValue).indexOf(String(rule.value)) !== -1;

        case 'notcontains':
          // If field value is array, check if array does NOT contain the specific value(s)
          if (isFieldArray) {
            // Parse comma-separated values in rule.value if it's a string
            if (typeof rule.value === 'string' && rule.value.indexOf(',') !== -1) {
              const searchValues: string[] = rule.value.split(',').map(v => v.trim());
              // Check if array contains NONE of the search values
              return !searchValues.some(searchVal => (fieldValue as any[]).indexOf(searchVal) !== -1);
            }
            return (fieldValue as any[]).indexOf(rule.value) === -1;
          }
          // Otherwise, check string does not contain
          return String(fieldValue).indexOf(String(rule.value)) === -1;

        case 'isempty':
          // Check if array is empty
          if (isFieldArray) {
            return (fieldValue as any[]).length === 0;
          }
          // For non-arrays, check if falsy or empty string
          return !fieldValue || String(fieldValue).length === 0;

        case 'isnotempty':
          // Check if array has items
          if (isFieldArray) {
            return (fieldValue as any[]).length > 0;
          }
          // For non-arrays, check if truthy and not empty string
          return !!fieldValue && String(fieldValue).length > 0;

        default:
          return false;
      }
    } catch (error) {
      return false;
    }
  }

  /**
   * Evaluate composite rule with AND/OR logic
   *
   * Recursively evaluates nested rules with AND (all must be true) or OR
   * (at least one must be true) logic.
   *
   * @param rule - Composite rule with condition ('and'|'or') and rules array
   * @param formValues - Current form field values
   * @returns true if composite condition met, false otherwise
   *
   * @example
   * ```typescript
   * const rule = {
   *   condition: 'and',
   *   rules: [
   *     { field: 'age', operator: 'greaterThan', value: 18 },
   *     { field: 'country', operator: 'equal', value: 'US' }
   *   ]
   * };
   * const isEligible = evaluateCompositeRule(rule, { age: 25, country: 'US' });
   * // isEligible = true
   * ```
   */
  private static evaluateCompositeRule(
    rule: CompositeConditionalRule,
    formValues: Record<string, FormValueType>
  ): boolean {
    try {
      if (!Array.isArray(rule.rules) || rule.rules.length === 0) {
        return false;
      }

      const condition = rule.condition.toLowerCase() as 'and' | 'or';

      if (condition === 'and') {
        // All rules must be true
        return rule.rules.every((childRule) =>
          this.evaluateCondition(childRule, formValues)
        );
      } else if (condition === 'or') {
        // At least one rule must be true
        return rule.rules.some((childRule) =>
          this.evaluateCondition(childRule, formValues)
        );
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if field should be visible
   *
   * Evaluates visibleWhen condition. Defaults to true (visible) if no condition
   * is defined or on error.
   *
   * @param conditions - FormComponentConditions containing visibleWhen rule
   * @param formValues - Current form field values
   * @returns true if field should be visible, false if hidden
   *
   * @example
   * ```typescript
   * const conditions = {
   *   visibleWhen: { field: 'showEmail', operator: 'equal', value: true }
   * };
   * const visible = isFieldVisible(conditions, { showEmail: true });
   * // visible = true
   * ```
   */
  static isFieldVisible(
    conditions: ConditionRule | undefined,
    formValues: Record<string, FormValueType>
  ): boolean {
    try {
      if (!conditions || !conditions.visibleWhen) {
        return true; // Default: visible if no condition
      }

      return this.evaluateCondition(conditions.visibleWhen, formValues);
    } catch (error) {
      return true; // Safe default: visible on error
    }
  }

  /**
   * Check if field should be read-only
   *
   * Evaluates readOnlyWhen condition. Defaults to false (editable) if no
   * condition is defined or on error.
   *
   * @param conditions - FormComponentConditions containing readOnlyWhen rule
   * @param formValues - Current form field values
   * @returns true if field should be read-only, false if editable
   *
   * @example
   * ```typescript
   * const conditions = {
   *   readOnlyWhen: { field: 'isVerified', operator: 'equal', value: true }
   * };
   * const readOnly = isFieldReadOnly(conditions, { isVerified: true });
   * // readOnly = true
   * ```
   */
  static isFieldReadOnly(
    conditions: ConditionRule | undefined,
    formValues: Record<string, FormValueType>
  ): boolean {
    try {
      if (!conditions || !conditions.readOnlyWhen) {
        return false; // Default: not read-only if no condition
      }

      return this.evaluateCondition(conditions.readOnlyWhen, formValues);
    } catch (error) {
      return false; // Safe default: not read-only on error
    }
  }

  /**
   * Check if field should be disabled
   *
   * Evaluates disabledWhen condition. Defaults to false (enabled) if no
   * condition is defined or on error.
   *
   * @param conditions - FormComponentConditions containing disabledWhen rule
   * @param formValues - Current form field values
   * @returns true if field should be disabled, false if enabled
   *
   * @example
   * ```typescript
   * const conditions = {
   *   disabledWhen: { field: 'orderStatus', operator: 'equal', value: 'completed' }
   * };
   * const disabled = isFieldDisabled(conditions, { orderStatus: 'completed' });
   * // disabled = true
   * ```
   */
  static isFieldDisabled(
    conditions: ConditionRule | undefined,
    formValues: Record<string, FormValueType>
  ): boolean {
    try {
      if (!conditions || !conditions.disabledWhen) {
        return false; // Default: not disabled if no condition
      }

      return this.evaluateCondition(conditions.disabledWhen, formValues);
    } catch (error) {
      return false; // Safe default: not disabled on error
    }
  }

  /**
   * Check if field should be hidden
   *
   * Evaluates hideWhen condition. Defaults to false (visible) if no condition
   * is defined or on error.
   *
   * @param conditions - FormComponentConditions containing hideWhen rule
   * @param formValues - Current form field values
   * @returns true if field should be hidden, false if visible
   *
   * @example
   * ```typescript
   * const conditions = {
   *   hideWhen: { field: 'hideEmail', operator: 'equal', value: true }
   * };
   * const hidden = isFieldHidden(conditions, { hideEmail: true });
   * // hidden = true
   * ```
   */
  static isFieldHidden(
    conditions: ConditionRule | undefined,
    formValues: Record<string, FormValueType>
  ): boolean {
    try {
      if (!conditions || !conditions.hideWhen) {
        return false; // Default: not hidden if no condition
      }

      return this.evaluateCondition(conditions.hideWhen, formValues);
    } catch (error) {
      return false; // Safe default: not hidden on error
    }
  }

  /**
   * Check if field should be required
   *
   * Evaluates requiredWhen condition. Defaults to false (not required) if no condition
   * is defined or on error.
   *
   * @param conditions - FormComponentConditions containing requiredWhen rule
   * @param formValues - Current form field values
   * @returns true if field should be required, false if optional
   *
   * @example
   * ```typescript
   * const conditions = {
   *   requiredWhen: { field: 'requireDetails', operator: 'equal', value: true }
   * };
   * const required = isFieldRequired(conditions, { requireDetails: true });
   * // required = true
   * ```
   */
  static isFieldRequired(
    conditions: ConditionRule | undefined,
    formValues: Record<string, FormValueType>
  ): boolean {
    try {
      if (!conditions || !conditions.requiredWhen) {
        return false; // Default: not required if no condition
      }

      return this.evaluateCondition(conditions.requiredWhen, formValues);
    } catch (error) {
      return false; // Safe default: not required on error
    }
  }

  /**
   * Get value to set for field if condition is met
   *
   * Evaluates setValueWhen condition and returns the value to assign if true.
   * Returns undefined if no condition is defined, condition not met, or on error.
   *
   * @param conditions - FormComponentConditions containing setValueWhen rule
   * @param formValues - Current form field values
   * @returns The value to set if condition met, undefined otherwise
   *
   * @example
   * ```typescript
   * const conditions = {
   *   setValueWhen: {
   *     condition: { field: 'country', operator: 'equal', value: 'US' },
   *     value: 'United States'
   *   }
   * };
   * const value = getConditionalValue(conditions, { country: 'US' });
   * // value = 'United States'
   * ```
   */
  static getConditionalValue(
    conditions: ConditionRule | undefined,
    formValues: Record<string, FormValueType>
  ): any {
    try {
      if (!conditions || !conditions.setValueWhen) {
        return undefined;
      }

      const isMet = this.evaluateCondition(conditions.setValueWhen.condition, formValues);
      if (isMet) {
        return conditions.setValueWhen.value;
      }
      return undefined;
    } catch (error) {
      return undefined;
    }
  }

  /**
   * Evaluate conditional data availability
   * Returns true if any conditional data rule's condition is met
   *
   * @param conditionalDataRules - Array of ConditionalDataRule objects
   * @param formValues - Current form field values
   * @returns Index of first matching rule, or -1 if none match
   */
  static evaluateConditionalDataRules(
    conditionalDataRules: ConditionalDataRule[] | undefined,
    formValues: Record<string, FormValueType>
  ): number {
    if (!conditionalDataRules || !Array.isArray(conditionalDataRules)) {
      return -1;
    }

    for (let i = 0; i < conditionalDataRules.length; i++) {
      const rule = conditionalDataRules[i as number];
      if (this.evaluateCondition(rule.condition, formValues)) {
        return i; // Return index of first matching rule
      }
    }

    return -1;
  }

  /**
 * Get filtered options for a dependent dropdown based on choice-based field rule
 *
 * If choiceBasedField rule exists and primary field has a value,
 * return only the mapped dependent options for that primary value.
 * Otherwise return all options.
 *
 * @param rule - ChoiceBasedFieldRule configuration
 * @param allDependentOptions - Complete list of dependent field options
 * @param formValues - Current form values
 * @param primaryFieldId - ID of primary field
 * @returns Filtered options array
 *
 * @example
 * ```typescript
 * const rule = {
 *   primaryFieldId: 'dept-id',
 *   choiceMapping: {
 *     'Marketing': ['Markers', 'Sticky Notes'],
 *     'Finance': ['Calculator']
 *   }
 * };
 *
 * const filtered = ConditionalRuleEngine.getChoiceBasedOptions(
 *   rule,
 *   ['Markers', 'Sticky Notes', 'Calculator'],
 *   { 'dept-id': 'Marketing' },
 *   'dept-id'
 * );
 * // Returns: ['Markers', 'Sticky Notes']
 * ```
 */
  static getChoiceBasedOptions(
    rule: ChoiceBasedFieldRule,
    allDependentOptions: string[],
    formValues: Record<string, FormValueType>,
    primaryFieldId: string
  ): string[] {
    try {
      // Get primary field value from form
      const primaryValue = formValues && formValues[primaryFieldId as string];

      if (primaryValue === null || primaryValue === undefined) {
        // No primary value selected - return all or empty based on rule config
        return rule.showAllWhenNotMapped ? allDependentOptions : [];
      }

      // Ensure primary value is treated as string for comparison
      const primaryValueStr: string = String(primaryValue);

      // Check if this primary value is mapped in the rule
      if (primaryValueStr in rule.choiceMapping) {
        const mappedOptions: string[] = rule.choiceMapping[primaryValueStr as string];

        // Validate mapped options exist in all options (safety check)
        return mappedOptions.filter((opt: string) => allDependentOptions.indexOf(opt) !== -1);
      }

      // Primary value not mapped - return all or empty based on rule config
      return rule.showAllWhenNotMapped ? allDependentOptions : [];
    } catch (error) {
      // Safe default - return all options
      return allDependentOptions;
    }
  }
}
