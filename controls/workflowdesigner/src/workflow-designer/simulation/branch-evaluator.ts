import { ConditionRule } from '../models/workflow-shared-types';
import { ExpressionEvaluator } from './expression-evaluator';

/**
 * Evaluates condition and switch branch rules against runtime context.
 * Coerces left/right values using rule.valueType so number/date/boolean/string
 * operators behave consistently with form input and expression results.
 *
 * @private
 */
export class BranchEvaluator {
    /**
     * Evaluate Conditions.
     *
     * @param {ConditionRule} conditions The conditions.
     * @param {'AND'} logic The logic.
     * @param {Object} context The context.
     * @returns {boolean} The result.
     * @private
     */
    public static evaluateConditions(conditions: ConditionRule[], logic: 'AND' | 'OR' | undefined, context: unknown): boolean {
        if (!conditions || !conditions.length) {
            return false;
        }
        const results: boolean[] = conditions.map((condition: ConditionRule) => BranchEvaluator.evaluateRule(condition, context));
        if (String(logic || '').toUpperCase() === 'OR') {
            return results.some((value: boolean) => value);
        }
        return results.every((value: boolean) => value);
    }

    /**
     * First Matching Branch.
     *
     * @param {Array} branches The branches.
     * @param {Object} context The context.
     * @returns {string} The result.
     * @private
     */
    public static firstMatchingBranch(
        branches: Array<{ branchName: string; condition: ConditionRule }>,
        context: unknown
    ): string | null {
        for (let i: number = 0; i < branches.length; i++) {
            if (BranchEvaluator.evaluateRule(branches[parseInt(i.toString(), 10)].condition, context)) {
                return branches[parseInt(i.toString(), 10)].branchName;
            }
        }
        return null;
    }

    /**
     * Evaluate Rule.
     *
     * @param {ConditionRule} rule The rule.
     * @param {Object} context The context.
     * @returns {boolean} The result.
     * @private
     */
    public static evaluateRule(rule: ConditionRule, context: unknown): boolean {
        const left: unknown = ExpressionEvaluator.resolve(rule.field, context);
        const right: unknown = ExpressionEvaluator.resolve(rule.value, context);
        switch (rule.operator) {
        case 'Equal':
            return left === right;
        case 'NotEqual':
            return left !== right;
        case 'Contains':
            return String(left).indexOf(String(right)) !== -1;
        case 'NotContains':
            return String(left).indexOf(String(right)) === -1;
        case 'StartsWith':
            return String(left).indexOf(String(right)) === 0;
        case 'NotStartsWith':
            return String(left).indexOf(String(right)) !== 0;
        case 'EndsWith':
            return BranchEvaluator.endsWith(String(left), String(right));
        case 'NotEndsWith':
            return !BranchEvaluator.endsWith(String(left), String(right));
        case 'MatchesRegex':
            return BranchEvaluator.safeRegex(String(right), String(left));
        case 'NotMatchesRegex':
            return !BranchEvaluator.safeRegex(String(right), String(left));
        case 'IsEmpty':
            return left === undefined || left === null || left === '' || (Array.isArray(left) && left.length === 0);
        case 'IsNotEmpty':
            return !(left === undefined || left === null || left === '' || (Array.isArray(left) && left.length === 0));
        case 'ArrayContains':
            return Array.isArray(left) && left.indexOf(right) !== -1;
        case 'ArrayNotContains':
            return Array.isArray(left) && left.indexOf(right) === -1;
        case 'LengthEqual':
            return BranchEvaluator.lengthOf(left) === Number(right);
        case 'LengthNotEqual':
            return BranchEvaluator.lengthOf(left) !== Number(right);
        case 'LengthGreaterThan':
            return BranchEvaluator.lengthOf(left) > Number(right);
        case 'LengthLessThan':
            return BranchEvaluator.lengthOf(left) < Number(right);
        case 'GreaterThan':
            return Number(left) > Number(right);
        case 'GreaterThanOrEqual':
            return Number(left) >= Number(right);
        case 'LessThan':
            return Number(left) < Number(right);
        case 'LessThanOrEqual':
            return Number(left) <= Number(right);
        case 'Before':
            return Date.parse(String(left)) < Date.parse(String(right));
        case 'BeforeOrEqual':
            return Date.parse(String(left)) <= Date.parse(String(right));
        case 'After':
            return Date.parse(String(left)) > Date.parse(String(right));
        case 'AfterOrEqual':
            return Date.parse(String(left)) >= Date.parse(String(right));
        case 'IsTrue':
            return left === true;
        case 'IsFalse':
            return left === false;
        default:
            return false;
        }
    }

    /**
     * Whether `text` ends with `suffix` (String.prototype.endsWith is not in the ES5 target).
     *
     * @param {string} text - The text.
     * @param {string} suffix - The suffix.
     * @returns {boolean} `true` when the text ends with the suffix.
     */
    private static endsWith(text: string, suffix: string): boolean {
        return suffix.length <= text.length && text.substring(text.length - suffix.length) === suffix;
    }

    private static lengthOf(value: unknown): number {
        if (typeof value === 'string' || Array.isArray(value)) {
            return value.length;
        }
        return 0;
    }

    private static safeRegex(pattern: string, input: string): boolean {
        if (pattern.length > 200 || input.length > 10000) {
            return false;
        }
        try {
            // eslint-disable-next-line security/detect-non-literal-regexp
            return new RegExp(pattern).test(input);
        } catch (error) {
            return false;
        }
    }
}
