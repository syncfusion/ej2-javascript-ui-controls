/**
 * create-mark-input-rule.ts
 *
 * Factory for creating mark (inline format) input rule definitions.
 * Extensions use this to contribute rules like **bold**, __italic__, etc.
 *
 * The rule handler uses ONLY dispatchCommand() to apply the mark,
 * ensuring proper undo/redo grouping and event tracking.
 *
 * The handler passes:
 * - matchStart, matchEnd: positions of the full trigger pattern (e.g., **text**)
 * - start, end: positions of the captured content (e.g., text without **)
 * - text: the captured content to be marked
 */

import { InputRuleContext, InputRuleDefinition } from '../types';

/**
 * Creates a mark input rule.
 *
 * @param {object} options - Rule configuration.
 * @param {string} options.id - Rule identifier.
 * @param {RegExp} options.pattern - Input rule pattern.
 * @param {string} options.target - Target mark name.
 * @param {boolean} [options.allowUndo] - Enables undo support.
 * @returns {InputRuleDefinition} Input rule definition.
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
