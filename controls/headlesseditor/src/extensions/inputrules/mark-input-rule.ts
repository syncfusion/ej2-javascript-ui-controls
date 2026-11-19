/**
 * Factory for creating mark (inline format) input rule definitions.
 *
 * Extensions use this to contribute rules that apply inline formatting (marks) such as **bold**, __italic__, `code`, etc.
 * The rule handler uses only dispatchCommand() to apply the mark, ensuring proper undo/redo grouping and event tracking.
 *
 * ```ts
 * const boldRule = createMarkRule({
 *   id: 'bold-rule',
 *   pattern: /\*\*(.+?)\*\*$/,
 *   target: 'strong'
 * });
 * ```
 */

import { InputRuleContext, InputRuleDefinition } from '../types';

/**
 * Creates a mark (inline format) input rule definition.
 *
 * Generates a reusable input rule that detects text patterns and applies inline formatting marks.
 * The handler receives the matched positions and dispatches an 'inputRuleMark' command to ensure
 * proper undo/redo support and command event tracking.
 *
 * @param {object} options - Rule configuration options.
 * @param {string} options.id - Unique identifier for the rule.
 * @param {RegExp} options.pattern - Regular expression pattern to match in the input text.
 * @param {string} options.target - Target mark name to apply (e.g., 'strong', 'em', 'code').
 * @param {boolean} [options.allowUndo] - If set to true, enables undo support for the rule. @default false
 *
 * @returns {InputRuleDefinition} The generated input rule definition.
 */
export function createMarkRule(
    options: {
        id: string;
        pattern: RegExp;
        target: string;
        allowUndo?: boolean;
    }
): InputRuleDefinition {

    return {
        id: options.id,
        pattern: options.pattern,
        allowUndo: options.allowUndo,

        handler(ctx: InputRuleContext): void {
            ctx.dispatchCommand(
                'inputRuleMark',
                {
                    markType: options.target,
                    text: ctx.match[
                        ctx.match.length - 1
                    ],
                    matchStart: ctx.start,
                    matchEnd: ctx.end
                }
            );
        }
    };
}
